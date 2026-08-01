/* Inciardi Collection — CAPTURE. Photograph a print: read, re-encode, upload.
 *
 * ONE ENTRY POINT — `Capture.shoot(opts)` — called from TWO places, which is Q15 → A verbatim:
 * *"both, one module."* A camera button on a print's own page (assign on arrival) and one on the
 * Photos surface (upload unassigned, sort later). Same pipeline, one `edition_id` apart.
 *
 * ============================================================================
 * 🔴 THE ORDER OF THIS PIPELINE IS THE WHOLE DESIGN. Step 1 happens before step 3 or a fact is
 * destroyed permanently.
 *
 *   1. READ THE ORIGINAL BYTES  → parse EXIF, take `DateTimeOriginal`
 *   2. decode to a bitmap        → browser applies EXIF orientation
 *   3. RE-ENCODE ON A CANVAS     → ⚠️ kills HEIC, bakes in rotation, STRIPS ALL EXIF
 *   4. POST the re-encoded bytes → `shot_at` rides along as a query param
 *
 * J16: the strip is deliberate and stays — it is the only thing between Michael's kitchen
 * coordinates and a bucket. But **it takes the capture date with it, and there is no second
 * chance.** Not later, not from the stored bytes, not ever. Every photo uploaded before someone
 * notices has a permanently unknown date.
 *
 * ⭐ The generalizable half, from J16 and worth keeping in view here: *a fix that removes data
 * removes ALL of it, including the parts you wanted.* GPS was the target; the timestamp was
 * collateral. **When you strip a container, enumerate what else was in it.**
 * ============================================================================
 *
 * ⚠️ NO QUEUE IN v1, AND THAT IS A DEFAULT RATHER THAN A RULING. `next-build-spec.md` §5 step 8
 * says capture ships with a *"resumable queue"*; §8 parks the `#capture` queue-walker. Those are
 * either the same thing (parked) or two different things (upload retry vs bulk walker) and
 * nobody has said which. So: one file at a time, each failure named, nothing persisted.
 * **Selecting several files is a LOOP, not a queue** — close the page mid-run and the rest are
 * simply not uploaded. Said out loud because "queue" implies resume, and this does not resume.
 *
 * ⚠️ IT DOES NOT GO THROUGH `API.req()`. That helper JSON.stringifies every body by construction,
 * and this body is BYTES. It borrows `API.base()` and `API.key()` so the endpoint and the
 * credential still have exactly one home — the deviation is the serialization, not the config.
 */
(function () {

  /* 1800px matches Q14 → C's "working full". The three derivatives it also locked are NOT built:
   * migration 001 gave `image` a single `r2_key` and the key scheme for the other two was never
   * decided. One image per shot; a thumb can be added later by convention off the same key with
   * no schema change (see the images.js header). */
  var MAX_EDGE = 1800;
  var QUALITY = 0.85;
  var MIN_BYTES = 1024;                 // matches the worker's own floor, so the error is local

  /* ============================================================ EXIF
   * A real APP1/TIFF walk rather than a library: ~50 lines against a dependency, in a repo with
   * no bundler. It reads exactly two tags and gives up quietly on anything it does not recognise
   * — a photo with no EXIF is normal (screenshots, downloads, anything Android re-encoded) and
   * must not be treated as an error.
   */
  function tagValue(v, dir, tiff, le, tag) {
    var n = v.getUint16(dir, le);
    for (var i = 0; i < n; i++) {
      var e = dir + 2 + i * 12;
      if (v.getUint16(e, le) !== tag) continue;
      var type = v.getUint16(e + 2, le);
      var count = v.getUint32(e + 4, le);
      if (type === 4) return v.getUint32(e + 8, le);            // LONG — an IFD pointer
      if (type === 3) return v.getUint16(e + 8, le);            // SHORT
      if (type === 2) {                                          // ASCII
        // A value over 4 bytes lives elsewhere and the slot holds an offset. Getting this
        // backwards reads four bytes of the offset as the string, which looks like corruption.
        var p = count > 4 ? tiff + v.getUint32(e + 8, le) : e + 8;
        var s = '';
        for (var j = 0; j < count - 1; j++) s += String.fromCharCode(v.getUint8(p + j));
        return s;
      }
    }
    return null;
  }

  function exifShotAt(buf) {
    try {
      var v = new DataView(buf);
      if (v.getUint16(0) !== 0xFFD8) return null;               // not a JPEG at all
      var off = 2;
      while (off + 4 < v.byteLength) {
        var marker = v.getUint16(off);
        if ((marker & 0xFF00) !== 0xFF00) return null;          // lost the segment chain
        if (marker === 0xFFDA) return null;                     // start of scan: no APP1 exists
        var size = v.getUint16(off + 2);
        if (marker === 0xFFE1 && v.getUint32(off + 4) === 0x45786966) {   // "Exif"
          var tiff = off + 10;
          var le = v.getUint16(tiff) === 0x4949;                // II = little endian
          if (v.getUint16(tiff + 2, le) !== 42) return null;    // the TIFF magic number
          var ifd0 = tiff + v.getUint32(tiff + 4, le);
          var exifPtr = tagValue(v, ifd0, tiff, le, 0x8769);    // the Exif sub-IFD
          var dt = exifPtr ? tagValue(v, tiff + exifPtr, tiff, le, 0x9003) : null;  // DateTimeOriginal
          if (!dt) dt = tagValue(v, ifd0, tiff, le, 0x0132);    // DateTime — file mtime, weaker
          if (!dt || typeof dt !== 'string') return null;
          // EXIF writes "2026:07:31 14:22:03". Only the DATE half uses colons; converting the
          // whole string would destroy the time.
          var m = dt.match(/^(\d{4}):(\d{2}):(\d{2})[ T](\d{2}:\d{2}:\d{2})/);
          return m ? (m[1] + '-' + m[2] + '-' + m[3] + ' ' + m[4]) : null;
        }
        off += 2 + size;
      }
    } catch (e) { /* a malformed header is not worth failing an upload over */ }
    return null;
  }

  /* ============================================================ decode + re-encode */

  function readBytes(file) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { res(r.result); };
      r.onerror = function () { rej(new Error('could not read the file off the device')); };
      r.readAsArrayBuffer(file);
    });
  }

  /* ⚠️ ORIENTATION IS THE BROWSER'S JOB AND WE ASK FOR IT EXPLICITLY. `createImageBitmap` with
   * `imageOrientation: 'from-image'` applies the EXIF rotation during decode, so the canvas draws
   * an already-upright image. The <img> fallback relies on the same behaviour being the default
   * for image ELEMENTS (spec change, Safari 13.1+ / Chrome 81+) — true on every browser this app
   * targets, and stated rather than assumed because a sideways binder is exactly the kind of bug
   * that gets blamed on the photograph. */
  function decode(file) {
    if (window.createImageBitmap) {
      try {
        return createImageBitmap(file, { imageOrientation: 'from-image' })
          .catch(function () { return viaImg(file); });
      } catch (e) { /* older signature: no options object */ }
    }
    return viaImg(file);
  }

  function viaImg(file) {
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(file);
      var im = new Image();
      im.onload = function () { URL.revokeObjectURL(url); res(im); };
      im.onerror = function () {
        URL.revokeObjectURL(url);
        // The realistic cause on a desktop is a HEIC straight off an iPhone: Safari decodes it,
        // Chrome does not. Say that instead of "load error".
        rej(new Error('this browser could not decode that image (a HEIC from an iPhone will not open outside Safari)'));
      };
      im.src = url;
    });
  }

  function reencode(bmp) {
    var w = bmp.width, h = bmp.height;
    var scale = Math.min(1, MAX_EDGE / Math.max(w, h));       // never UPscale a small photo
    var cw = Math.round(w * scale), ch = Math.round(h * scale);
    var c = document.createElement('canvas');
    c.width = cw; c.height = ch;
    c.getContext('2d').drawImage(bmp, 0, 0, cw, ch);
    if (bmp.close) bmp.close();                                // free the bitmap on browsers that need it
    return new Promise(function (res, rej) {
      c.toBlob(function (blob) {
        if (!blob) return rej(new Error('the browser refused to encode the resized image'));
        res({ blob: blob, width: cw, height: ch });
      }, 'image/jpeg', QUALITY);
    });
  }

  /* ============================================================ upload */

  function upload(blob, meta) {
    var qs = ['credit=you'];
    if (meta.edition_id) qs.push('edition_id=' + encodeURIComponent(meta.edition_id));
    if (meta.shot_at) qs.push('shot_at=' + encodeURIComponent(meta.shot_at));
    if (meta.subject) qs.push('subject=' + encodeURIComponent(meta.subject));
    qs.push('width=' + meta.width, 'height=' + meta.height);

    return fetch(API.base() + '/image?' + qs.join('&'), {
      method: 'POST',
      cache: 'no-store',
      headers: { 'content-type': 'image/jpeg', 'x-write-key': API.key() },
      body: blob
    }).then(function (r) {
      return r.text().then(function (txt) {
        var d;
        try { d = JSON.parse(txt); }
        catch (e) { throw new Error('HTTP ' + r.status + ' — the reply was not JSON: ' + txt.slice(0, 120)); }
        if (!r.ok || d.ok === false) {
          // Same two named cases core.js handles, because a 401 on a device that never typed a
          // key reads as nonsense and a 503 here is a setup state rather than a bug.
          if (r.status === 401) throw new Error('the write key on this device does not match the worker');
          if (r.status === 503) throw new Error(d.fix || d.error || 'the worker has no R2 binding');
          throw new Error(d.error || ('HTTP ' + r.status));
        }
        return d;
      });
    });
  }

  /* ============================================================ the pipeline, one file */

  function one(file, editionId, subject) {
    if (!/^image\//.test(file.type) && !/\.(jpe?g|png|hei[cf]|webp)$/i.test(file.name || '')) {
      return Promise.reject(new Error('"' + (file.name || 'that file') + '" is not an image'));
    }
    var shotAt = null;
    return readBytes(file)
      .then(function (buf) {
        // 🔴 STEP 1. Before anything touches the pixels. See the header.
        shotAt = exifShotAt(buf);
        return decode(file);
      })
      .then(reencode)
      .then(function (out) {
        if (out.blob.size < MIN_BYTES) {
          throw new Error('the re-encoded image came out empty (' + out.blob.size + ' bytes) — nothing was uploaded');
        }
        return upload(out.blob, {
          edition_id: editionId, shot_at: shotAt, subject: subject,
          width: out.width, height: out.height
        });
      })
      .then(function (d) { d.shot_at = shotAt; d.file = file.name || ''; return d; });
  }

  /* ============================================================ the entry point
   *
   *   Capture.shoot({
   *     edition_id : optional. Present = assign on arrival; absent = lands unassigned in Photos.
   *     subject    : optional. single | pack | detail | packaging | in-situ
   *     multiple   : allow picking several (a LOOP — read the header)
   *     onStep     : (done, total, label) progress, called per file
   *     onDone     : (results, errors) once, at the end
   *   })
   *
   * The input is created, clicked and thrown away rather than living in the page. A persistent
   * hidden <input> is state two screens would share, and this module holds none.
   * ⚠️ NO `capture="environment"` ATTRIBUTE, deliberately: on iOS it forces the camera and REMOVES
   * "Photo Library" from the sheet. Most of these prints are photographed once and filed later,
   * so the library has to stay reachable. Omitting it gives the full choice sheet.
   */
  function shoot(opts) {
    opts = opts || {};
    var inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = 'image/*';
    if (opts.multiple) inp.multiple = true;
    inp.style.display = 'none';
    document.body.appendChild(inp);

    inp.addEventListener('change', function () {
      var files = [].slice.call(inp.files || []);
      document.body.removeChild(inp);
      if (!files.length) return;                     // cancelled: not an error, say nothing

      var results = [], errors = [], i = 0;

      function step() {
        if (i >= files.length) {
          if (opts.onDone) opts.onDone(results, errors);
          if (errors.length) {
            Core.toast(errors.length + ' of ' + files.length + ' failed: ' + errors[0].message, 'bad');
          } else {
            var dup = results.filter(function (r) { return r.duplicate; }).length;
            Core.toast(results.length + ' photo' + (results.length === 1 ? '' : 's') + ' uploaded' +
                       (dup ? ' (' + dup + ' already stored)' : ''), 'good');
          }
          return;
        }
        var f = files[i];
        if (opts.onStep) opts.onStep(i, files.length, f.name || 'photo');
        one(f, opts.edition_id, opts.subject)
          .then(function (d) { results.push(d); })
          /* A failure is RECORDED and the loop continues. Nine good photos and one HEIC should
           * not cost nine uploads — but the failure is never swallowed either: it is counted,
           * named, and the first message is surfaced. */
          .catch(function (e) { errors.push({ file: f.name || 'photo', message: e.message || String(e) }); })
          .then(function () { i++; step(); });
      }
      step();
    });

    inp.click();
  }

  window.Capture = { shoot: shoot, exifShotAt: exifShotAt };
})();
