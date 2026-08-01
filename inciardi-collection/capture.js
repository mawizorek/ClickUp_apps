/* Inciardi Collection — CAPTURE. Take a photograph of a print, or pick one from the roll.
 *
 * ============================================================================
 * ONE MODULE, TWO DOORS (Q15 → A). A camera button belongs on the Photos surface AND on a
 * print's own page, and both must do the identical thing — so the behaviour lives here and the
 * screens call it. `Capture.pick({...})` is the whole public surface.
 *
 * 🔴 THE ORDER IS THE FEATURE: EXIF IS READ BEFORE THE RE-ENCODE, NOT AFTER.
 * The canvas re-encode is load-bearing (J9): it kills HEIC, applies the orientation tag, and
 * strips every EXIF field — which is the only thing standing between a kitchen's GPS
 * coordinates and a bucket. That is correct and it stays.
 *
 * But it also destroys the CAPTURE DATE, permanently, at upload. After the re-encode there is
 * no recovering when a photograph was taken: not later, not from the bytes, not ever, and
 * nothing about the result looks wrong. So `shot_at` is parsed out of the original file's APP1
 * segment BEFORE a canvas ever sees it (J16). If these forty lines are not written on day one,
 * every photo uploaded before someone notices carries a permanently unknown date.
 *
 * ⭐ The generalizable shape, worth more than the code: A FIX THAT REMOVES DATA REMOVES ALL OF
 * IT, INCLUDING THE PARTS YOU WANTED. GPS was the target; the timestamp was collateral. When
 * you strip a container, enumerate what else was in it.
 * ============================================================================
 *
 * 🚫 THERE IS NO QUEUE, AND THAT IS A DECISION. `next-build-spec.md` §5 step 8 says capture
 * ships with a "resumable queue"; §8 parks the `#capture` queue-walker as out of scope. Those
 * are either the same thing or two things and nobody said which, so this defaults to the
 * smaller one: files upload ONE AT A TIME, in order, and a failure is collected rather than
 * fatal. Thirty prints in one sitting works today. If resumption turns out to be needed, that
 * is the parked walker (Q15 D) — a feature, not a repair.
 *
 * ⚠️ HEIC: decodes on iOS because Safari carries the system codec; does NOT decode in desktop
 * Chrome, where an .heic pick fails at `createImageBitmap`. Michael builds and shoots from a
 * phone, so this is right for the real device and wrong at a desk. Named, not discovered.
 */
(function () {

  /* 1800px long edge, matching the "full" derivative the spec locked (Q14 C). The other two
   * derivatives are deferred — see images.js — so this single image is both the full view and,
   * scaled by CSS, the thumbnail. */
  var MAX_EDGE = 1800;
  var QUALITY = 0.86;

  /* ============================================================ EXIF
   * A DELIBERATELY TINY READER: it wants ONE tag. A full EXIF library is a dependency, and
   * every other field in there is something J16 explicitly refused to keep — camera, lens,
   * exposure. Nobody will ever ask what f-stop a print catalogue photo used.
   *
   * Returns 'YYYY-MM-DD HH:MM:SS' or null. NULL IS A COMPLETELY NORMAL ANSWER: a screenshot, a
   * PNG, an image already stripped by another app, or a camera that wrote no date. It is not an
   * error and must never be reported as one.
   */
  function exifShotAt(buf) {
    try {
      var v = new DataView(buf);
      if (v.byteLength < 4 || v.getUint16(0) !== 0xFFD8) return null;   // not a JPEG
      var off = 2;
      while (off + 4 < v.byteLength) {
        if (v.getUint8(off) !== 0xFF) return null;                     // lost the marker chain
        var marker = v.getUint8(off + 1);
        var size = v.getUint16(off + 2);
        if (marker === 0xE1) {                                          // APP1 — the EXIF block
          var tiff = off + 10;                                          // skip "Exif\0\0"
          if (tiff + 8 > v.byteLength) return null;
          var le = v.getUint16(tiff) === 0x4949;                        // II = little endian
          var ifd0 = tiff + v.getUint32(tiff + 4, le);
          var exifPtr = findTag(v, ifd0, tiff, le, 0x8769);             // ExifIFDPointer
          if (exifPtr == null) return null;
          var s = findTag(v, tiff + exifPtr, tiff, le, 0x9003, true);   // DateTimeOriginal
          if (!s) return null;
          /* EXIF writes 'YYYY:MM:DD HH:MM:SS'. Only the DATE separators become dashes — a blind
           * global replace would turn the clock into 08-01-01 and look plausible doing it. */
          var m = /^(\d{4}):(\d{2}):(\d{2})[ T](\d{2}:\d{2}:\d{2})/.exec(s.trim());
          return m ? (m[1] + '-' + m[2] + '-' + m[3] + ' ' + m[4]) : null;
        }
        if (marker === 0xDA) return null;                               // start of scan: no EXIF
        off += 2 + size;
      }
    } catch (e) { /* a malformed header is not worth failing an upload over */ }
    return null;
  }

  /* Walk one IFD's entries looking for a tag. `asString` pulls an ASCII value (which may sit
   * inline or behind an offset); otherwise the value is a LONG read directly. */
  function findTag(v, dir, tiff, le, tag, asString) {
    if (dir + 2 > v.byteLength) return null;
    var n = v.getUint16(dir, le);
    for (var i = 0; i < n; i++) {
      var e = dir + 2 + i * 12;
      if (e + 12 > v.byteLength) return null;
      if (v.getUint16(e, le) !== tag) continue;
      if (!asString) return v.getUint32(e + 8, le);
      var len = v.getUint32(e + 4, le);
      var at = len > 4 ? tiff + v.getUint32(e + 8, le) : e + 8;
      var out = '';
      for (var j = 0; j < len && at + j < v.byteLength; j++) {
        var c = v.getUint8(at + j);
        if (!c) break;
        out += String.fromCharCode(c);
      }
      return out;
    }
    return null;
  }

  /* ============================================================ re-encode
   * `imageOrientation: 'from-image'` applies the EXIF rotation tag while decoding, so a photo
   * taken sideways lands upright — and because the tag is then gone from the output, nothing
   * downstream can rotate it a second time. Doing it here rather than with a CSS transform is
   * what makes the stored bytes correct for every future consumer.
   */
  function reencode(file) {
    return createImageBitmap(file, { imageOrientation: 'from-image' }).then(function (bmp) {
      var scale = Math.min(1, MAX_EDGE / Math.max(bmp.width, bmp.height));
      var w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale);
      var c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(bmp, 0, 0, w, h);
      if (bmp.close) bmp.close();
      return new Promise(function (res, rej) {
        c.toBlob(function (b) {
          /* toBlob hands back null on failure rather than throwing, which is exactly the silent
           * shape this app refuses. A zero-byte upload behind a 200 is the worst outcome
           * available, and the worker's own 1KB floor is the second line of the same defence. */
          if (b) res({ blob: b, w: w, h: h });
          else rej(new Error('the browser could not encode this image'));
        }, 'image/jpeg', QUALITY);
      });
    });
  }

  /* ============================================================ upload
   * Raw bytes as the body, metadata in the query string — the shape `POST /image` expects.
   * Deliberately NOT routed through `API.post()`, which JSON-encodes; the key header is set by
   * hand here for the same reason images.js dispatches before the body parse. One exception to
   * the one-door rule, and it exists because the door only accepts JSON.
   */
  function upload(enc, opts) {
    var q = ['width=' + enc.w, 'height=' + enc.h, 'credit=you'];
    if (opts.edition_id) q.push('edition_id=' + encodeURIComponent(opts.edition_id));
    if (opts.subject) q.push('subject=' + encodeURIComponent(opts.subject));
    if (opts.shot_at) q.push('shot_at=' + encodeURIComponent(opts.shot_at));

    return fetch(API.base() + '/image?' + q.join('&'), {
      method: 'POST',
      cache: 'no-store',
      headers: { 'content-type': 'image/jpeg', 'x-write-key': API.key() },
      body: enc.blob
    }).then(function (r) {
      return r.text().then(function (txt) {
        var d;
        try { d = JSON.parse(txt); }
        catch (e) { throw new Error('HTTP ' + r.status + ' — not JSON: ' + txt.slice(0, 120)); }
        if (!r.ok || d.ok === false) throw new Error(d.error || ('HTTP ' + r.status));
        return d;
      });
    });
  }

  /* One file, end to end. The ArrayBuffer is read ONCE and the File is handed to the decoder
   * separately — reading a 4MB file twice on a phone is a visible pause. */
  function one(file, opts) {
    return file.arrayBuffer().then(function (buf) {
      var shot = exifShotAt(buf);
      return reencode(file).then(function (enc) {
        return upload(enc, {
          edition_id: opts.edition_id,
          subject: opts.subject,
          shot_at: shot || opts.shot_at || null
        });
      });
    });
  }

  window.Capture = {
    /* Open the picker. On iOS this offers Camera / Photo Library / Files; `capture: true` forces
     * the camera instead, which is what a print's own page wants ("photograph THIS one").
     *
     *   edition_id  attach on arrival. Omit and the photo lands UNASSIGNED, which is legal by
     *               design (J15) and is the whole bulk-shoot workflow.
     *   subject     single | pack | detail | packaging | in-situ | reference
     *   multiple    default true
     *   onDone(n)   called once, with the number that landed
     */
    pick: function (opts) {
      opts = opts || {};
      var input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      if (opts.multiple !== false) input.multiple = true;
      if (opts.capture) input.capture = 'environment';
      input.style.display = 'none';
      document.body.appendChild(input);

      input.addEventListener('change', function () {
        var files = [].slice.call(input.files || []);
        if (input.parentNode) input.parentNode.removeChild(input);
        if (!files.length) return;
        Capture.run(files, opts);
      });

      input.click();
    },

    /* SEQUENTIAL, and a failure never stops the run. Uploading thirty photos in parallel from a
     * phone is how you get a stalled radio and a partial result nobody can reconstruct; one at
     * a time is slower and finishes. Errors are COLLECTED and reported together at the end,
     * because thirty separate red toasts is the same as no report at all. */
    run: function (files, opts) {
      opts = opts || {};
      var done = 0, dupes = 0, errs = [];
      var total = files.length;

      function step(i) {
        if (i >= total) {
          if (errs.length) {
            Core.toast(done + ' of ' + total + ' uploaded — ' + errs.length + ' failed: ' + errs[0], 'bad');
          } else if (dupes) {
            Core.toast(done + ' uploaded (' + dupes + ' already stored)', 'good');
          } else {
            Core.toast(done + (done === 1 ? ' photo added' : ' photos added'), 'good');
          }
          if (opts.onDone) opts.onDone(done);
          return;
        }
        if (total > 1) Core.toast('Uploading ' + (i + 1) + ' of ' + total + '\u2026');
        one(files[i], opts).then(function (d) {
          done++;
          if (d.duplicate) dupes++;
          /* A 207 means the photo is stored and only the ATTACHMENT failed. Reporting "uploaded"
           * and nothing else would leave a photo silently unattached to the print it was shot
           * for, which is the one thing the caller assumed had happened. */
          if (d.link_error) errs.push('stored but not attached: ' + d.link_error);
          step(i + 1);
        }).catch(function (e) {
          errs.push((files[i].name || 'photo') + ': ' + (e.message || String(e)));
          step(i + 1);
        });
      }
      step(0);
    },

    /* Exposed for the same reason `Binder.face()` is: one place converts EXIF's date format, and
     * a second copy in a future importer is a second thing that can disagree. */
    exifShotAt: exifShotAt
  };
})();
