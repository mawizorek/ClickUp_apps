/* Inciardi Collection — THE BATCH LOADER. Fetches a transcript, validates it, exposes it.
 *
 * ============================================================================
 * WHY THE TRANSCRIPT IS NOT IN THIS FILE ANY MORE.
 *
 * Michael, 2026-07-31: "it should be cold-agentable and ideally jst a reference data file so
 * they're never actualyl touchuing code."
 *
 * Until v16 a batch WAS a JavaScript file — eighteen object literals inside an IIFE. That has
 * two problems and only one of them is obvious.
 *
 *   1. It makes every new sheet a CODE EDIT, performed by whoever happens to be reading
 *      photographs that day. The job is transcription; the artefact should be a transcript.
 *
 *   2. 🔴 THE FAILURE MODE IS CATASTROPHIC AND MISLEADING. One unescaped quote in a print's
 *      notes and the whole script throws at parse time. `window.Batch` never gets defined, so
 *      app.js reports "the backroom screen needs batch.js" — a MISSING FILE error for a file
 *      that is present and one character wrong. Someone would go looking at script tags.
 *      A malformed .json file cannot do that. It fails inside a fetch, in one place, and this
 *      file says which file and what is wrong with it.
 *
 * WHAT THIS FILE IS NOW: fetch the manifest, fetch the chosen transcript, VALIDATE IT HARD, and
 * hand `Backroom` something it can trust. The validation is the point — see below.
 * Procedure for producing a transcript: `brain-config/hooks/binder-sheet-intake.md`.
 * ============================================================================
 */
(function () {
  var DIR = './batches/';
  var loaded = null;      // the active batch, after validation

  function getJSON(path) {
    /* no-store, same as the router. A CACHED BATCH IS A REAL HAZARD HERE and not a cosmetic
     * one: this data gets written to a database permanently, so serving yesterday's copy means
     * importing yesterday's arrangement while the log reports success. */
    return fetch(path, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error(path + ' \u2014 HTTP ' + r.status);
      return r.text().then(function (txt) {
        try { return JSON.parse(txt); }
        catch (e) {
          /* Name the FILE and quote the parser. "Unexpected token } in JSON at position 812" is
           * useless on its own and precise once you know which file. */
          throw new Error(path + ' is not valid JSON \u2014 ' + e.message);
        }
      });
    });
  }

  /* ============================================================ VALIDATION
   * 🔴 THIS IS THE HALF THAT MATTERS, AND IT IS NEW. Moving the transcript to JSON removed the
   * risk of a batch BREAKING THE APP. It did nothing about the risk of a batch DESCRIBING A
   * WRONG IMPORT, which is worse, because that one succeeds.
   *
   * Everything checked here is something that would otherwise surface as: a silent overwrite
   * (two prints claiming one pocket — the second wins, the first vanishes, no error anywhere),
   * a 400 from the worker on call 12 of 37 leaving a half-populated sheet, or a print that
   * imports fine and is simply not the print in the photograph.
   *
   * EVERY MESSAGE NAMES THE ROW. "position must be 0-8" is a puzzle; "print 4 (guinness):
   * position 9 is not 0-8" is a fix. The person reading this has a photograph in one hand and
   * no interest in the schema.
   *
   * ⚠️ THESE RULES MIRROR THE SCHEMA AND THE WORKER, WHICH MEANS THEY CAN DRIFT FROM THEM. That
   * is accepted on purpose: the DATABASE is still the authority and will refuse anything this
   * misses. This is an early, legible NO — not a second source of truth. If they ever disagree,
   * the database is right and this file is the bug. Sources: schema.binder.sql (side, position,
   * the UNIQUE on sheet+side+position) and worker.js → badSlug(). */
  function validate(b, slug) {
    var errs = [];
    var E = function (m) { errs.push(m); };

    if (!b || typeof b !== 'object') return ['the file did not contain a JSON object'];

    /* SLUG AGREEMENT. The filename and the slug inside the file must match, and a mismatch is
     * refused rather than resolved. Picking one silently would mean the manifest advertises one
     * batch while the app loads another — and both would look right on screen. */
    if (b.slug !== slug) {
      E('the file is named "' + slug + '.json" but its slug says "' + (b.slug || '(missing)') +
        '" \u2014 they have to match, and guessing which one is right is not this app\'s job');
    }

    if (!b.label) E('no label \u2014 the preview screen has nothing to call this batch');

    var sh = b.sheet;
    if (!sh || typeof sh !== 'object') {
      E('no sheet block');
    } else {
      if (!sh.sheet_id || String(sh.sheet_id).length < 2) {
        E('sheet.sheet_id is missing or too short to be an identity');
      }
      if (!sh.binder_id) E('sheet.binder_id is missing');
      /* Not a fatal error, because the schema allows an untitled sheet and the UI falls back to
       * the id. Worth saying out loud all the same: an untitled sheet in a menu of sheets reads
       * as a bug even when it is legal. */
      if (!sh.title) E('sheet.title is empty \u2014 legal, but the sheet menu will show a raw id');
    }

    var ps = b.prints;
    if (!Array.isArray(ps) || !ps.length) return errs.concat(['no prints']);
    /* Eighteen is the physical maximum: nine pockets, two faces. More than that is not an
     * ambitious sheet, it is a transcription that lost track of itself. */
    if (ps.length > 18) E(ps.length + ' prints, but a sheet holds 18 \u2014 nine a face, two faces');

    var seenSlot = {}, seenId = {};
    ps.forEach(function (p, i) {
      var who = 'print ' + (i + 1) + ' (' + (p && (p.id || p.name) || 'unnamed') + ')';

      if (!p || typeof p !== 'object') { E(who + ' is not an object'); return; }
      if (!p.name) E(who + ': no name');

      // --- id: this is IDENTITY and it is permanent, so a bad one is permanently bad.
      var id = String(p.id || '');
      if (!id) E(who + ': no id');
      else if (id.length < 2) E(who + ': id "' + id + '" is too short to be an identity');
      /* The exact rule from worker.js → badSlug(), and the exact bug that caused the rebuild:
       * slug("#1") collapses to "1" for every numbered variant, so every one of them collides. */
      else if (/^[0-9-]+$/.test(id)) {
        E(who + ': id "' + id + '" is digits only \u2014 "#4" and "7/12" both collapse to numbers, ' +
          'which is the collision that broke the last app. The worker will reject it.');
      } else if (!/^[a-z0-9-]+$/.test(id)) {
        E(who + ': id "' + id + '" has characters outside a-z 0-9 and dash');
      }
      if (id && seenId[id]) {
        /* Legal in the schema — a print CAN sit in several slots — but never what a transcript
         * means. Two pockets on one sheet holding the same title is a copy-paste that did not
         * get its id changed, and it would import as one print placed twice. */
        E(who + ': id "' + id + '" is already used by print ' + seenId[id] +
          '. Two pockets can legally hold the same print, but on a transcript this is almost ' +
          'always a copied row with the id left behind.');
      }
      if (id) seenId[id] = i + 1;

      // --- side: 'A' or 'B'. The DB stores letters; Front/Back is only what a person reads.
      var side = String(p.side || '').toUpperCase();
      if (side !== 'A' && side !== 'B') {
        E(who + ': side is "' + (p.side == null ? '(missing)' : p.side) +
          '" \u2014 must be "A" or "B". Front and Back are display words; the data stores letters.');
      }

      // --- position: 0-8, and an integer. 1-8 typed by a human who counted from one is the
      //     likeliest mistake here, and it silently shifts eight cards by one pocket.
      var pos = p.position;
      if (typeof pos !== 'number' || pos % 1 !== 0) {
        E(who + ': position must be a whole number 0-8 (top-left is 0, not 1)');
      } else if (pos < 0 || pos > 8) {
        E(who + ': position ' + pos + ' is not 0-8. Nine pockets a face, counted from ZERO.');
      }

      // --- THE COLLISION CHECK. The one that would otherwise be silent: POST /slot is
      //     ON CONFLICT DO UPDATE, so the second print wins the pocket, the first disappears,
      //     and every call returns 200. Nothing anywhere would say a card went missing.
      if ((side === 'A' || side === 'B') && typeof pos === 'number') {
        var k = side + pos;
        if (seenSlot[k]) {
          E(who + ': ' + (side === 'A' ? 'front' : 'back') + ' pocket ' + (pos + 1) +
            ' is already taken by print ' + seenSlot[k] +
            '. The later one would silently overwrite the earlier one and both calls would ' +
            'return success.');
        }
        seenSlot[k] = i + 1;
      }
    });

    return errs;
  }

  /* Everything the runner needs, built HERE so the runner never has to know the shape of a
   * print — it only knows how to send things and read the answer. */
  function shape(b) {
    var D = b.defaults || {};
    var faces = {};
    b.prints.forEach(function (p) { faces[String(p.side).toUpperCase()] = 1; });

    return {
      slug: b.slug,
      label: b.label,
      /* The source line the preview prints. `faces_confidence` is why it exists: a transcript
       * should keep admitting which parts were assumed at the moment someone is about to write
       * them, not only in a file nobody has open. */
      source: (b.source || '') +
              (b.faces_confidence === 'assumed' ? '' : ' \u00b7 faces confirmed'),
      facesAssumed: b.faces_confidence !== 'confirmed',
      sheet: {
        sheet_id: b.sheet.sheet_id,
        binder_id: b.sheet.binder_id,
        title: b.sheet.title || null
      },
      defaults: D,
      faceCount: Object.keys(faces).length,
      prints: b.prints.map(function (p) {
        return {
          side: String(p.side).toUpperCase(),
          position: p.position,
          id: p.id,
          name: p.name,
          notes: p.notes || null,
          // Per-print override. A title read off the card is 'named'; one worked out from the
          // picture is 'inferred', and the schema carries that distinction on purpose.
          confidence: p.confidence || D.confidence || 'named'
        };
      }),

      artworkBody: function (p) {
        return {
          artwork_id: p.id,
          name: p.name,
          category: D.category || 'mini',
          edition_type: D.edition_type || 'open',
          retail: D.retail == null ? null : D.retail,
          provenance: D.provenance || 'owned',
          confidence: p.confidence,
          notes: p.notes || null,
          own: D.own !== false,
          qty: D.qty || 1
        };
      },

      /* `edition_id` is deliberately omitted: NULL is the normal case (Q12 = B) and means "this
       * print is in this pocket" without claiming to know WHICH impression. Naming an edition
       * here would be inventing a fact about a physical object. */
      slotBody: function (p) {
        return {
          sheet_id: b.sheet.sheet_id,
          side: p.side,
          position: p.position,
          artwork_id: p.id
        };
      }
    };
  }

  window.Batch = {
    /* The picker's list. Drafts are filtered out here rather than hidden in the UI — an
     * incomplete transcript should not be one tap from a write. */
    list: function () {
      return getJSON(DIR + '_index.json').then(function (m) {
        return (m.batches || []).filter(function (x) { return x.status !== 'draft'; });
      });
    },

    /* Load one, validated. Rejects with every problem at once rather than the first — someone
     * fixing a transcript should get the whole list, not five round trips. */
    load: function (slug) {
      return getJSON(DIR + slug + '.json').then(function (raw) {
        var errs = validate(raw, slug);
        if (errs.length) {
          var e = new Error(errs.length + ' problem' + (errs.length === 1 ? '' : 's') +
                            ' in ' + slug + '.json');
          e.problems = errs;      // the preview renders these as a list
          throw e;
        }
        loaded = shape(raw);
        return loaded;
      });
    },

    current: function () { return loaded; }
  };
})();
