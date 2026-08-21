/* QR Forge · source/qr-core.js
   ISO/IEC 18004 encoder. Byte mode (UTF-8), versions 1-40, ECC L/M/Q/H.

   The payload is written into the module pattern itself. There is no lookup
   table, no shortener and no server anywhere in the chain, which is the whole
   point: a code produced here keeps working for exactly as long as the URL
   inside it does, with nobody in the middle who can withdraw it.

   Depends on: QRGF (source/qr-gf.js). */
(function (root) {
  'use strict';
  var GF = root.QRGF;

  var LEVELS = ['L', 'M', 'Q', 'H'];
  var FMT = { L: 1, M: 0, Q: 3, H: 2 };
  /* Share of codewords the level can lose and still decode. Nominal figures
     from the standard, not a promise about any particular scanner. */
  var TOLERANCE = { L: 7, M: 15, Q: 25, H: 30 };

  /* ECC codewords per block, indexed [level][version]. Slot 0 is unused. */
  var ECB = [
    [0,7,10,15,20,26,18,20,24,30,18,20,24,26,30,22,24,28,30,28,28,28,28,30,30,26,28,30,30,30,30,30,30,30,30,28,30,30,30,30,30],
    [0,10,16,26,18,24,16,18,22,22,26,30,22,22,24,24,28,28,26,26,26,26,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28],
    [0,13,22,18,26,18,24,18,22,20,24,28,26,24,20,30,24,28,28,26,30,28,30,30,30,30,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],
    [0,17,28,22,16,22,28,26,26,24,28,24,28,22,24,24,30,28,28,26,28,30,24,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30]
  ];
  /* Number of ECC blocks, indexed [level][version]. */
  var NB = [
    [0,1,1,1,1,1,2,2,2,2,4,4,4,4,4,6,6,6,6,7,8,8,9,9,10,12,12,12,13,14,15,16,17,18,19,19,20,21,22,24,25],
    [0,1,1,1,2,2,4,4,4,5,5,5,8,9,9,10,10,11,13,14,16,17,17,18,20,21,23,25,26,28,29,31,33,35,37,38,40,43,45,47,49],
    [0,1,1,2,2,4,4,6,6,8,8,8,10,12,16,12,17,16,18,21,20,23,23,25,27,29,34,34,35,38,40,43,45,48,51,53,56,59,62,65,68],
    [0,1,1,2,4,4,4,5,5,8,8,11,11,16,16,18,16,19,21,25,25,25,34,30,32,35,37,40,42,45,48,51,54,57,60,63,66,70,74,77,81]
  ];

  var N1 = 3, N2 = 3, N3 = 40, N4 = 10;

  function bit(v, i) { return ((v >>> i) & 1) !== 0; }

  /* Modules available to data + ECC, once every function pattern is subtracted. */
  function rawModules(ver) {
    var n = (16 * ver + 128) * ver + 64;
    if (ver >= 2) {
      var a = Math.floor(ver / 7) + 2;
      n -= (25 * a - 10) * a - 55;
      if (ver >= 7) n -= 36;
    }
    return n;
  }
  function totalCw(ver) { return Math.floor(rawModules(ver) / 8); }
  function dataCw(ver, lvl) {
    var i = LEVELS.indexOf(lvl);
    return totalCw(ver) - ECB[i][ver] * NB[i][ver];
  }
  function ccBits(ver) { return ver <= 9 ? 8 : 16; }
  function bitsFor(len, ver) { return 4 + ccBits(ver) + 8 * len; }
  function capacity(ver, lvl) {
    return Math.floor((dataCw(ver, lvl) * 8 - 4 - ccBits(ver)) / 8);
  }

  function utf8(str) {
    if (root.TextEncoder) return new TextEncoder().encode(str);
    var out = [], s = unescape(encodeURIComponent(str));
    for (var i = 0; i < s.length; i++) out.push(s.charCodeAt(i));
    return new Uint8Array(out);
  }

  /* Alignment pattern centres. The version 32 step is a genuine exception in
     the standard, not an off-by-one: the formula gives 28 and the answer is 26. */
  function alignPos(ver) {
    if (ver === 1) return [];
    var count = Math.floor(ver / 7) + 2;
    var step = ver === 32 ? 26 : Math.ceil((ver * 4 + 4) / (count * 2 - 2)) * 2;
    var out = [6];
    for (var pos = ver * 4 + 10; out.length < count; pos -= step) out.splice(1, 0, pos);
    return out;
  }

  function buildData(bytes, ver, lvl) {
    var cap = dataCw(ver, lvl) * 8, bits = [];
    function push(val, n) { for (var i = n - 1; i >= 0; i--) bits.push((val >>> i) & 1); }
    push(4, 4);                                    // byte mode
    push(bytes.length, ccBits(ver));
    for (var i = 0; i < bytes.length; i++) push(bytes[i], 8);
    push(0, Math.min(4, cap - bits.length));       // terminator
    push(0, (8 - bits.length % 8) % 8);            // pad to a byte boundary
    for (var p = 0xEC; bits.length < cap; p ^= 0xEC ^ 0x11) push(p, 8);
    var cw = new Uint8Array(cap / 8);
    for (var j = 0; j < bits.length; j++) cw[j >>> 3] |= bits[j] << (7 - (j & 7));
    return cw;
  }

  /* Split into blocks, append each block's ECC, then interleave. Interleaving is
     what makes a scuff survivable: a physical smudge lands across many blocks
     instead of destroying one of them outright. */
  function interleave(data, ver, lvl) {
    var i = LEVELS.indexOf(lvl);
    var blocks = NB[i][ver], eccLen = ECB[i][ver];
    var raw = totalCw(ver);
    var shortCount = blocks - raw % blocks;
    var shortLen = Math.floor(raw / blocks);
    var div = GF.divisor(eccLen), parts = [], k = 0;
    for (var b = 0; b < blocks; b++) {
      var n = shortLen - eccLen + (b < shortCount ? 0 : 1);
      var dat = data.subarray(k, k + n); k += n;
      parts.push({ dat: dat, ecc: GF.remainder(dat, div) });
    }
    var out = new Uint8Array(raw), p = 0, c, j;
    for (c = 0; c <= shortLen - eccLen; c++)
      for (j = 0; j < blocks; j++) if (c < parts[j].dat.length) out[p++] = parts[j].dat[c];
    for (c = 0; c < eccLen; c++)
      for (j = 0; j < blocks; j++) out[p++] = parts[j].ecc[c];
    return out;
  }

  function QRSymbol(ver, lvl) {
    this.version = ver;
    this.ecl = lvl;
    this.size = ver * 4 + 17;
    this.mask = -1;
    this.m = new Uint8Array(this.size * this.size);
    this.fixed = new Uint8Array(this.size * this.size);
  }
  var P = QRSymbol.prototype;

  P.get = function (x, y) { return this.m[y * this.size + x] === 1; };

  P.setFn = function (x, y, dark) {
    if (x < 0 || y < 0 || x >= this.size || y >= this.size) return;
    this.m[y * this.size + x] = dark ? 1 : 0;
    this.fixed[y * this.size + x] = 1;
  };

  P.finder = function (cx, cy) {
    for (var dy = -4; dy <= 4; dy++) for (var dx = -4; dx <= 4; dx++) {
      var d = Math.max(Math.abs(dx), Math.abs(dy));
      this.setFn(cx + dx, cy + dy, d !== 2 && d !== 4);
    }
  };

  P.align = function (cx, cy) {
    for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++)
      this.setFn(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
  };

  P.patterns = function () {
    var n = this.size, i, j;
    for (i = 0; i < n; i++) { this.setFn(6, i, i % 2 === 0); this.setFn(i, 6, i % 2 === 0); }
    this.finder(3, 3); this.finder(n - 4, 3); this.finder(3, n - 4);
    var pos = alignPos(this.version), last = pos.length - 1;
    for (i = 0; i <= last; i++) for (j = 0; j <= last; j++) {
      if ((i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0)) continue;
      this.align(pos[i], pos[j]);
    }
    this.formatBits(0);   // reserves the area; overwritten once the mask is chosen
    this.versionBits();
  };

  P.formatBits = function (mask) {
    var data = FMT[this.ecl] << 3 | mask, rem = data, i, n = this.size;
    for (i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    var b = ((data << 10) | rem) ^ 0x5412;
    for (i = 0; i <= 5; i++) this.setFn(8, i, bit(b, i));
    this.setFn(8, 7, bit(b, 6));
    this.setFn(8, 8, bit(b, 7));
    this.setFn(7, 8, bit(b, 8));
    for (i = 9; i < 15; i++) this.setFn(14 - i, 8, bit(b, i));
    for (i = 0; i < 8; i++) this.setFn(n - 1 - i, 8, bit(b, i));
    for (i = 8; i < 15; i++) this.setFn(8, n - 15 + i, bit(b, i));
    this.setFn(8, n - 8, true);   // the one permanently dark module
  };

  P.versionBits = function () {
    if (this.version < 7) return;
    var rem = this.version, i;
    for (i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25);
    var b = (this.version << 12) | rem;
    for (i = 0; i < 18; i++) {
      var c = bit(b, i), a = this.size - 11 + i % 3, d = Math.floor(i / 3);
      this.setFn(a, d, c); this.setFn(d, a, c);
    }
  };

  /* Two-module-wide columns, right to left, alternating up and down. Column 6
     is skipped because the vertical timing pattern owns it. */
  P.placeData = function (cw) {
    var n = this.size, i = 0;
    for (var right = n - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (var vert = 0; vert < n; vert++) {
        for (var j = 0; j < 2; j++) {
          var x = right - j;
          var up = ((right + 1) & 2) === 0;
          var y = up ? n - 1 - vert : vert;
          var idx = y * n + x;
          if (!this.fixed[idx] && i < cw.length * 8) {
            this.m[idx] = (cw[i >>> 3] >>> (7 - (i & 7))) & 1;
            i++;
          }
        }
      }
    }
  };

  P.applyMask = function (k) {
    var n = this.size;
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      var idx = y * n + x;
      if (this.fixed[idx]) continue;
      var inv;
      switch (k) {
        case 0: inv = (x + y) % 2 === 0; break;
        case 1: inv = y % 2 === 0; break;
        case 2: inv = x % 3 === 0; break;
        case 3: inv = (x + y) % 3 === 0; break;
        case 4: inv = (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0; break;
        case 5: inv = (x * y) % 2 + (x * y) % 3 === 0; break;
        case 6: inv = ((x * y) % 2 + (x * y) % 3) % 2 === 0; break;
        default: inv = ((x + y) % 2 + (x * y) % 3) % 2 === 0;
      }
      if (inv) this.m[idx] ^= 1;
    }
  };

  /* The four penalty rules. Masking exists so the pattern does not accidentally
     grow features a decoder will mistake for a finder, or drift so far from an
     even light/dark split that thresholding fails. */
  P.penalty = function () {
    var n = this.size, s = 0, x, y, run, col, bits, c;
    for (y = 0; y < n; y++) {
      run = 1; col = this.get(0, y); bits = col ? 1 : 0;
      for (x = 1; x < n; x++) {
        c = this.get(x, y);
        if (c === col) { run++; } else { if (run >= 5) s += N1 + run - 5; col = c; run = 1; }
        bits = ((bits << 1) & 0x7FF) | (c ? 1 : 0);
        if (x >= 10 && (bits === 0x05D || bits === 0x5D0)) s += N3;
      }
      if (run >= 5) s += N1 + run - 5;
    }
    for (x = 0; x < n; x++) {
      run = 1; col = this.get(x, 0); bits = col ? 1 : 0;
      for (y = 1; y < n; y++) {
        c = this.get(x, y);
        if (c === col) { run++; } else { if (run >= 5) s += N1 + run - 5; col = c; run = 1; }
        bits = ((bits << 1) & 0x7FF) | (c ? 1 : 0);
        if (y >= 10 && (bits === 0x05D || bits === 0x5D0)) s += N3;
      }
      if (run >= 5) s += N1 + run - 5;
    }
    for (y = 0; y < n - 1; y++) for (x = 0; x < n - 1; x++) {
      c = this.get(x, y);
      if (c === this.get(x + 1, y) && c === this.get(x, y + 1) && c === this.get(x + 1, y + 1)) s += N2;
    }
    var dark = 0;
    for (var i = 0; i < this.m.length; i++) dark += this.m[i];
    var total = n * n;
    s += Math.floor(Math.abs(dark * 100 / total - 50) / 5) * N4;
    return s;
  };

  P.draw = function (cw, forceMask) {
    this.codewords = cw;
    this.patterns();
    this.placeData(cw);
    var best = -1, bestScore = Infinity;
    if (forceMask >= 0 && forceMask <= 7) {
      best = forceMask;
    } else {
      for (var k = 0; k < 8; k++) {
        this.applyMask(k); this.formatBits(k);
        var sc = this.penalty();
        this.applyMask(k);                       // XOR is its own undo
        if (sc < bestScore) { bestScore = sc; best = k; }
      }
    }
    this.applyMask(best);
    this.formatBits(best);
    this.mask = best;
    this.penaltyScore = bestScore === Infinity ? this.penalty() : bestScore;
  };

  function encode(text, opts) {
    opts = opts || {};
    var lvl = LEVELS.indexOf(opts.ecl) >= 0 ? opts.ecl : 'Q';
    var bytes = utf8(String(text == null ? '' : text));
    var ver = 0;
    for (var v = 1; v <= 40; v++) {
      if (bitsFor(bytes.length, v) <= dataCw(v, lvl) * 8) { ver = v; break; }
    }
    if (!ver) {
      var e = new Error('That payload is ' + bytes.length + ' bytes. The largest symbol there is (version 40, ECC ' + lvl + ') holds ' + capacity(40, lvl) + '.');
      e.code = 'TOO_LONG';
      e.bytes = bytes.length;
      e.limit = capacity(40, lvl);
      throw e;
    }
    /* Leftover room inside the chosen version is free error correction. Taking
       it costs nothing: same version, same physical size, more damage survived. */
    if (opts.boost !== false) {
      for (var i = 3; i > LEVELS.indexOf(lvl); i--) {
        if (bitsFor(bytes.length, ver) <= dataCw(ver, LEVELS[i]) * 8) { lvl = LEVELS[i]; break; }
      }
    }
    var sym = new QRSymbol(ver, lvl);
    sym.draw(interleave(buildData(bytes, ver, lvl), ver, lvl),
             opts.mask == null ? -1 : opts.mask);
    sym.payloadBytes = bytes.length;
    sym.capacityBytes = capacity(ver, lvl);
    sym.tolerance = TOLERANCE[lvl];
    sym.requestedEcl = LEVELS.indexOf(opts.ecl) >= 0 ? opts.ecl : 'Q';
    return sym;
  }

  root.QR = {
    encode: encode,
    Symbol: QRSymbol,
    levels: LEVELS,
    tolerance: TOLERANCE,
    capacity: capacity,
    dataCodewords: dataCw,
    alignPositions: alignPos,
    byteLength: function (t) { return utf8(String(t == null ? '' : t)).length; }
  };
})(window);
