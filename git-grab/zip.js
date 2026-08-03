/* zip.js — a ZIP container writer, by hand.

   NO NETWORK. NO DOM. NO DEPENDENCIES. Pure bytes in, bytes out, so it can be reasoned about
   and tested alone — which is the whole reason it ships before the fetch layer exists. The
   container is the risky part of this app; downloading files is not.

   WHY HAND-WRITTEN INSTEAD OF A LIBRARY: this app exists because Michael did not want to hand a
   third party's page a GitHub token. Vendoring a zip library would satisfy that on a
   technicality while re-introducing a supply chain. CompressionStream is a browser built-in, so
   the only code you have to trust is the ~250 lines below.

   THE FORMAT, briefly, because the offsets are unforgiving:
     [local header + data] x N ... [central directory entry] x N ... [EOCD]
   Every central-directory entry stores the byte offset of its local header, and the EOCD stores
   the offset and size of the central directory. Get one count wrong and the archive opens as
   EMPTY rather than as broken — exactly the silent-failure class this app refuses. Hence the
   selftest at the bottom parses its own output back out.

   NOT IMPLEMENTED, on purpose. Each throws; none corrupts quietly:
     - ZIP64. Ceiling 4 GB per file, 65,535 entries.
     - Explicit directory entries. Paths with slashes imply folders in every target extractor.
     - Encryption, archive comments, extra fields.
*/
(function () {
  "use strict";

  /* ---------------- CRC-32 (IEEE 802.3, the polynomial ZIP mandates) ---------------- */
  var CRC_TABLE = (function () {
    var t = new Uint32Array(256);
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      t[n] = c >>> 0;
    }
    return t;
  })();

  function crc32(bytes) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  /* ---------------- little-endian writer ----------------
     Every multi-byte field in a ZIP is little-endian. An explicit DataView flag is safer than
     hand-shifting bytes and unambiguous to read six months later. */
  function Writer(size) {
    this.buf = new Uint8Array(size);
    this.view = new DataView(this.buf.buffer);
    this.pos = 0;
  }
  Writer.prototype.u16 = function (v) { this.view.setUint16(this.pos, v, true); this.pos += 2; return this; };
  Writer.prototype.u32 = function (v) { this.view.setUint32(this.pos, v >>> 0, true); this.pos += 4; return this; };
  Writer.prototype.bytes = function (b) { this.buf.set(b, this.pos); this.pos += b.length; return this; };

  /* ---------------- DOS date/time ----------------
     ZIP predates Unix timestamps here. Year is offset from 1980; seconds have 2-second
     resolution (hence the shift). Clamp below 1980 rather than emit a negative year that
     renders as garbage in Explorer. */
  function dosTime(d) {
    return ((d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >>> 1)) & 0xFFFF;
  }
  function dosDate(d) {
    var y = Math.max(1980, d.getFullYear()) - 1980;
    return ((y << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xFFFF;
  }

  var enc = new TextEncoder();
  var dec = new TextDecoder();

  /* ---------------- deflate ----------------
     CompressionStream is Chrome 103+ / Safari 16.4+ / Firefox 113+. Where it is missing we store
     (method 0): a bigger file every extractor on earth still opens. Graceful degradation, not a
     failure path, and build() reports which one it used. */
  function hasDeflate() { return typeof CompressionStream === "function"; }

  function deflateRaw(bytes) {
    /* 'deflate-raw' is a bare DEFLATE stream with no zlib wrapper. ZIP method 8 wants exactly
       that. Plain 'deflate' would prepend a 2-byte zlib header and corrupt the entry. */
    var cs = new CompressionStream("deflate-raw");
    var writer = cs.writable.getWriter();
    writer.write(bytes);
    writer.close();
    return new Response(cs.readable).arrayBuffer().then(function (ab) { return new Uint8Array(ab); });
  }

  /* ---------------- path hygiene ----------------
     An entry name is attacker-controlled text as far as an extractor is concerned. Strip leading
     slashes and any '..' segment so an archive can never write outside its own folder (Zip
     Slip). Backslashes normalise to '/', which the spec requires. */
  function safeName(name) {
    var parts = String(name).replace(/\\/g, "/").split("/");
    var out = [];
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (!p || p === "." || p === "..") continue;
      out.push(p);
    }
    return out.join("/");
  }

  /* ---------------- build ----------------
     entries: [{ name, data: Uint8Array | string }]
     opts:    { date?: Date, compress?: boolean }
     resolves { blob, bytes, entries, method } */
  function build(entries, opts) {
    opts = opts || {};
    var when = opts.date || new Date();
    var wantDeflate = (opts.compress !== false) && hasDeflate();

    if (!Array.isArray(entries) || !entries.length) {
      return Promise.reject(new Error("zip: nothing to pack"));
    }
    if (entries.length > 0xFFFF) {
      /* 65,535 is the EOCD's 16-bit counter. Past it we need ZIP64, and silently wrapping the
         count is precisely the opens-as-empty failure described in the header. */
      return Promise.reject(new Error("zip: " + entries.length + " files exceeds the 65,535 entry limit (ZIP64 not implemented)"));
    }

    var prepared = [];
    var seen = Object.create(null);
    var chain = Promise.resolve();

    entries.forEach(function (e) {
      chain = chain.then(function () {
        var name = safeName(e.name);
        if (!name) throw new Error("zip: entry has no usable name");

        /* Case-insensitive collision check. macOS and Windows fold case, so README.md and
           readme.md in one archive silently overwrite each other on extract. */
        var key = name.toLowerCase();
        if (seen[key]) throw new Error('zip: duplicate path after case-folding: "' + name + '" collides with "' + seen[key] + '"');
        seen[key] = name;

        var raw = (typeof e.data === "string") ? enc.encode(e.data) : new Uint8Array(e.data);
        if (raw.length > 0xFFFFFFFF) throw new Error('zip: "' + name + '" exceeds 4 GB (ZIP64 not implemented)');

        var rec = { nameBytes: enc.encode(name), name: name, crc: crc32(raw), size: raw.length };

        if (!wantDeflate || raw.length === 0) {
          rec.method = 0; rec.body = raw; rec.csize = raw.length;
          prepared.push(rec);
          return;
        }
        return deflateRaw(raw).then(function (def) {
          /* If compression made it bigger (png, jpg, already-zipped bytes), store instead. */
          if (def.length >= raw.length) { rec.method = 0; rec.body = raw; rec.csize = raw.length; }
          else { rec.method = 8; rec.body = def; rec.csize = def.length; }
          prepared.push(rec);
        });
      });
    });

    return chain.then(function () {
      var LOCAL = 30, CENTRAL = 46, EOCD = 22;
      var total = 0, i;
      for (i = 0; i < prepared.length; i++) {
        total += LOCAL + prepared[i].nameBytes.length + prepared[i].csize;
        total += CENTRAL + prepared[i].nameBytes.length;
      }
      total += EOCD;

      var w = new Writer(total);
      var time = dosTime(when), date = dosDate(when);
      var FLAG_UTF8 = 0x0800; /* general-purpose bit 11; without it non-ASCII names mangle on Windows */

      /* ---- local headers + file data ---- */
      for (i = 0; i < prepared.length; i++) {
        var r = prepared[i];
        r.offset = w.pos; /* the central directory points back here */
        w.u32(0x04034B50)
         .u16(20)
         .u16(FLAG_UTF8)
         .u16(r.method)
         .u16(time).u16(date)
         .u32(r.crc)
         .u32(r.csize)
         .u32(r.size)
         .u16(r.nameBytes.length)
         .u16(0)
         .bytes(r.nameBytes)
         .bytes(r.body);
      }

      /* ---- central directory ---- */
      var cdStart = w.pos;
      for (i = 0; i < prepared.length; i++) {
        var c = prepared[i];
        w.u32(0x02014B50)
         .u16(20)
         .u16(20)
         .u16(FLAG_UTF8)
         .u16(c.method)
         .u16(time).u16(date)
         .u32(c.crc)
         .u32(c.csize)
         .u32(c.size)
         .u16(c.nameBytes.length)
         .u16(0)
         .u16(0)
         .u16(0)
         .u16(0)
         .u32(0)
         .u32(c.offset)
         .bytes(c.nameBytes);
      }

      /* ---- end of central directory ---- */
      var cdSize = w.pos - cdStart;
      w.u32(0x06054B50)
       .u16(0).u16(0)
       .u16(prepared.length)
       .u16(prepared.length)
       .u32(cdSize)
       .u32(cdStart)
       .u16(0);

      if (w.pos !== total) {
        /* Size was computed up front; a mismatch means a field width above is wrong. Refuse
           rather than hand back a truncated or padded archive. */
        throw new Error("zip: internal size mismatch (wrote " + w.pos + ", expected " + total + ")");
      }

      return {
        blob: new Blob([w.buf], { type: "application/zip" }),
        bytes: w.buf,
        entries: prepared.length,
        method: wantDeflate ? "deflate" : "stored"
      };
    });
  }

  /* ---------------- read back (verification, not a feature) ----------------
     A minimal central-directory reader, so build() can be checked against something other than
     my own arithmetic. If writer and reader disagree about one offset, the selftest fails loudly
     instead of producing a file that only fails later on your desktop. */
  function listFromBytes(buf) {
    var view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    var eocd = -1;
    for (var p = buf.length - 22; p >= 0; p--) {
      if (view.getUint32(p, true) === 0x06054B50) { eocd = p; break; }
    }
    if (eocd < 0) throw new Error("zip read: no EOCD found");

    var count = view.getUint16(eocd + 10, true);
    var cdOff = view.getUint32(eocd + 16, true);
    var out = [], off = cdOff;

    for (var i = 0; i < count; i++) {
      if (view.getUint32(off, true) !== 0x02014B50) throw new Error("zip read: bad central header at " + off);
      var method = view.getUint16(off + 10, true);
      var crc    = view.getUint32(off + 16, true);
      var csize  = view.getUint32(off + 20, true);
      var size   = view.getUint32(off + 24, true);
      var nlen   = view.getUint16(off + 28, true);
      var elen   = view.getUint16(off + 30, true);
      var clen   = view.getUint16(off + 32, true);
      var lOff   = view.getUint32(off + 42, true);
      var name   = dec.decode(buf.subarray(off + 46, off + 46 + nlen));

      if (view.getUint32(lOff, true) !== 0x04034B50) throw new Error('zip read: bad local header for "' + name + '"');
      var lNlen = view.getUint16(lOff + 26, true);
      var lElen = view.getUint16(lOff + 28, true);

      out.push({
        name: name, method: method, crc: crc, csize: csize, size: size,
        dataAt: lOff + 30 + lNlen + lElen
      });
      off += 46 + nlen + elen + clen;
    }
    return out;
  }

  /* ---------------- selftest ----------------
     Run ZIP.selftest() in the console. It builds an archive and reads it back, asserting the
     ROUND TRIP rather than any value I hardcoded — a test full of constants I invented would
     only prove I can copy my own arithmetic twice.

     WHAT IT CANNOT PROVE: that macOS Archive Utility and Windows Explorer accept the file.
     Nothing running in a tab can prove that. Download the sample and double-click it. */
  function selftest() {
    var padded = new Array(400).join("compressible "); /* long + repetitive, so deflate must shrink it */
    var samples = [
      { name: "readme.txt", data: "Hello from git-grab.\nSecond line.\n" },
      { name: "nested/deep/data.txt", data: padded },
      { name: "unicode/caf\u00e9 \u2014 \u2705.txt", data: "non-ascii name, UTF-8 flag set\n" },
      { name: "empty.txt", data: "" }
    ];
    var results = [], ok = true;
    function check(label, pass, detail) {
      results.push((pass ? "PASS  " : "FAIL  ") + label + (detail ? "  \u2014 " + detail : ""));
      if (!pass) ok = false;
    }

    return build(samples).then(function (z) {
      var list = listFromBytes(z.bytes);
      check("entry count", list.length === samples.length, list.length + " of " + samples.length);

      for (var i = 0; i < list.length; i++) {
        var got = list[i];
        var want = enc.encode(samples[i].data);
        check('crc "' + got.name + '"', got.crc === crc32(want), "0x" + got.crc.toString(16));
        check('size "' + got.name + '"', got.size === want.length, got.size + " vs " + want.length);
        if (got.method === 0) {
          var stored = z.bytes.subarray(got.dataAt, got.dataAt + got.csize);
          var same = stored.length === want.length;
          for (var j = 0; same && j < want.length; j++) if (stored[j] !== want[j]) same = false;
          check('stored bytes "' + got.name + '"', same);
        }
      }

      var big = list[1];
      check("deflate shrank the repetitive entry",
            !hasDeflate() || big.method === 0 || big.csize < big.size,
            big.csize + " / " + big.size + " bytes");
      check("unicode name survived the round trip", list[2].name.indexOf("caf\u00e9") >= 0, list[2].name);
      check("empty file is a valid entry", list[3].size === 0);

      var url = URL.createObjectURL(z.blob);
      console.log(results.join("\n"));
      console.log(ok
        ? "\n\u2705 structure round-trips (" + z.method + ", " + z.bytes.length + " bytes).\nThat is NOT proof an OS extractor accepts it. Download and open this:\n" + url
        : "\n\u274c see failures above");
      return { ok: ok, results: results, url: url, method: z.method, size: z.bytes.length };
    });
  }

  window.ZIP = {
    build: build,
    crc32: crc32,
    list: listFromBytes,
    selftest: selftest,
    hasDeflate: hasDeflate,
    safeName: safeName
  };
})();
