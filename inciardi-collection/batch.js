/* Inciardi Collection — THE BATCH LOADER. Reads a batch, checks it, hands it over.
 *
 * ============================================================================
 * 🔴 THIS FILE USED TO *BE* THE DATA, AND THAT WAS THE BUG.
 *
 * Michael, 2026-07-31: "write the hook for a new page set sent to you and how you input it into
 * the app for me to push. it should be cold-agentable and ideally jst a reference data file so
 * they're never actualyl touchuing code."
 *
 * Until v16 a new sheet meant editing `batch.js`: an IIFE, an array of object literals, two
 * body-builder functions. So transcribing a photograph was a CODE EDIT — performed by whoever
 * had the photos, in the file that feeds an irreversible bulk write, where a stray brace is a
 * parse error and a stray quote is a wrong name in the database. The riskiest input in the app
 * had the least protection around it.
 *
 * Now: `batches/<name>.json` is inert data and this file reads it. Nobody adding a sheet opens a
 * `.js` again. Procedure: `brain-config/hooks/batch-import.md`.
 * ============================================================================
 *
 * WHAT THIS FILE OWES THE REST OF THE APP: the same `window.Batch` shape as before — `sheet`,
 * `prints[]`, `label`, `source`, `artworkBody()`, `slotBody()` — so `backroom.js` and
 * `preview.js` did not have to learn anything about JSON. The one change on their side is that
 * loading is asynchronous now, because a file has to be fetched.
 *
 * 🔴 FETCHED `no-store`, WHICH RETIRES A HAZARD RATHER THAN LABELLING IT. v14 put a build stamp
 * on the run screen because a cached `batch.js` would write the WRONG arrangement to D1 and log
 * thirty-seven successes. A `<script>` tag is cached by the browser and only a `?v=` bump
 * dislodges it — which depends on a human remembering to bump it. A `fetch` with `no-store`
 * cannot serve stale data at all. The stamp stays, because it still says which CODE is running,
 * but the specific trap it was built for is now structurally impossible.
 *
 * ⚠️ THE VALIDATOR IS THE POINT OF THIS FILE. A cold agent transcribing a photo will eventually
 * write a duplicate id, a short row, or a name it left blank. Every check below mirrors a rule
 * D1 or the worker already enforces, so the verdict is identical — it just arrives BEFORE
 * anything is sent, as a list you can read, instead of as an HTTP 400 seventeen calls into a run
 * that has already half-applied.
 */
(function () {
  var DIR = './batches/';
  var loaded = null;      // the adapted batch currently in hand

  /* Positions are 0-8 in the database (CHECK position BETWEEN 0 AND 8) and 1-9 in the UI. The
   * JSON has NEITHER: it is a 3x3 grid laid out like the photograph, so index arithmetic is the
   * only place a position number is ever computed, and it is computed once, here.
   *   row 0 → 0 1 2      row 1 → 3 4 5      row 2 → 6 7 8
   * Deliberate: hand-numbering eighteen slots is exactly the clerical work that produces a
   * silent off-by-one, and this app already carries a scar from that class of mistake
   * (`mini-binder-s1` is the SECOND sheet). */
  function gridToSlots(grid, face, out, err) {
    if (grid == null) return;                    // a one-sided sheet is legal
    if (!Array.isArray(grid) || grid.length !== 3) {
      err.push(face + ': must be 3 rows of 3, laid out like the photo');
      return;
    }
    grid.forEach(function (row, r) {
      if (!Array.isArray(row) || row.length !== 3) {
        err.push(face + ' row ' + (r + 1) + ': needs exactly 3 entries (null for an empty pocket)');
        return;
      }
      row.forEach(function (id, c) {
        if (id == null || id === '') return;     // empty pocket — sparse rows are the design (J3)
        out.push({ side: face === 'front' ? 'A' : 'B', position: r * 3 + c, id: String(id) });
      });
    });
  }

  /* 🔴 THE SLUG RULE IS COPIED FROM THE WORKER ON PURPOSE, AND IT IS A KNOWN DUPLICATION.
   * `worker.js` → badSlug() refuses ids under 2 characters and ids that are digits-only, because
   * "#4" and "7/12" both collapse to numbers — the exact collision that killed the predecessor.
   * The worker stays the authority; this is an early mirror so a bad id is caught while it is
   * still a line in a file rather than a 400 mid-run.
   * ⚠️ IF THE WORKER'S RULE CHANGES, CHANGE THIS IN THE SAME COMMIT. Them drifting produces a
   * batch this file blesses and the server rejects — annoying but loud, which is why the
   * duplication is acceptable and silence would not be. */
  function badSlug(id) {
    if (!id || id.length < 2) return 'too short to be an identity';
    if (/^[0-9-]+$/.test(id)) return 'digits only, which collides with every numbered variant';
    return null;
  }

  /* Everything that can be wrong, reported ALL AT ONCE. Returning on the first error would mean
   * a cold agent fixes one line, re-pushes, waits for Pages, and meets the next one — six round
   * trips for six typos. */
  function validate(d, file) {
    var err = [], warn = [];

    if (!d || typeof d !== 'object') return { errors: ['not a JSON object'], warnings: [], slots: [] };
    if (!d.sheet || !d.sheet.sheet_id) {
      err.push('sheet.sheet_id is required');
    } else if (badSlug(d.sheet.sheet_id)) {
      err.push('sheet.sheet_id "' + d.sheet.sheet_id + '": ' + badSlug(d.sheet.sheet_id));
    }
    if (!d.prints || typeof d.prints !== 'object') err.push('prints is required');
    if (d.front == null && d.back == null) err.push('needs at least one of front / back');

    var slots = [];
    gridToSlots(d.front, 'front', slots, err);
    gridToSlots(d.back, 'back', slots, err);

    var prints = d.prints || {};
    var seen = {};

    Object.keys(prints).forEach(function (id) {
      var bad = badSlug(id);
      if (bad) err.push('print id "' + id + '": ' + bad);
      var p = prints[id] || {};
      if (!p.name || !String(p.name).trim()) err.push('print "' + id + '": name is required');
    });

    slots.forEach(function (s) {
      if (!prints[s.id]) {
        err.push((s.side === 'A' ? 'front' : 'back') + ' slot ' + (s.position + 1) +
                 ' names "' + s.id + '", which is not in prints');
      }
      seen[s.id] = (seen[s.id] || 0) + 1;
    });

    /* A print in two pockets is LEGAL (J2 ruling 3, duplicate placement) but it is also exactly
     * what a copy-paste slip looks like, so it is said out loud without blocking. */
    Object.keys(seen).forEach(function (id) {
      if (seen[id] > 1) warn.push('"' + id + '" is placed ' + seen[id] + ' times on this sheet');
    });
    Object.keys(prints).forEach(function (id) {
      if (!seen[id]) warn.push('"' + id + '" is described but never placed in a grid');
    });

    return { errors: err, warnings: warn, slots: slots, file: file };
  }

  /* Flatten the grid + the print dictionary into the flat list every other file already
   * understands. Sorted front-then-back in reading order, so the preview table and the run log
   * come out in the order a person reads the physical sheet. */
  function adapt(d, v) {
    var prints = v.slots.map(function (s) {
      var p = d.prints[s.id] || {};
      return { side: s.side, position: s.position, id: s.id,
               name: p.name, notes: p.notes || null };
    }).sort(function (a, b) {
      return a.side === b.side ? a.position - b.position : (a.side === 'A' ? -1 : 1);
    });

    /* Defaults live in the DATA file, so a batch can say "these are big risos at $18" without
     * anyone touching this loader — but every key falls back, so a minimal batch declaring
     * nothing but names and a grid still imports correctly. */
    var D = d.defaults || {};
    var def = {
      category: D.category || 'mini',
      edition_type: D.edition_type || 'open',
      retail: D.retail == null ? null : Number(D.retail),
      provenance: D.provenance || 'owned',
      confidence: D.confidence || 'named',
      own: D.own !== false,               // owning it is the normal case for a photographed sheet
      qty: Math.max(1, parseInt(D.qty, 10) || 1)
    };

    return {
      id: d.id || (v.file || '').replace(/\.json$/, ''),
      label: d.label || (d.sheet && d.sheet.title) || 'Untitled batch',
      source: d.source || 'No source recorded.',
      facesAssumed: d.faces_assumed !== false,
      sheet: d.sheet,
      defaults: def,
      prints: prints,
      warnings: v.warnings,

      artworkBody: function (p) {
        return {
          artwork_id: p.id,
          name: p.name,
          category: def.category,
          edition_type: def.edition_type,
          retail: def.retail,
          provenance: def.provenance,
          confidence: def.confidence,
          notes: p.notes || null,
          own: def.own,
          qty: def.qty
        };
      },

      /* `edition_id` is deliberately omitted: NULL is the normal case (Q12 = B) and means "this
       * print is in this pocket" without claiming to know WHICH impression. Naming an edition
       * here would be inventing a fact about a physical object. */
      slotBody: function (p) {
        return { sheet_id: d.sheet.sheet_id, side: p.side,
                 position: p.position, artwork_id: p.id };
      }
    };
  }

  function getJSON(path) {
    // no-store: this is data that gets written to a database. See the header.
    return fetch(DIR + path, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error(path + ' \u2014 HTTP ' + r.status);
      return r.text().then(function (txt) {
        try { return JSON.parse(txt); }
        catch (e) {
          // Name the FILE. "Unexpected token" with no filename is the least useful thing a person
          // can be handed at the end of a transcription.
          throw new Error(path + ' is not valid JSON \u2014 ' + e.message);
        }
      });
    });
  }

  window.Batch = {
    /* The list, for the picker. A static site cannot enumerate a directory, so `_index.json` IS
     * the directory — and a batch missing from it is invisible however correct it is. */
    list: function () {
      return getJSON('_index.json').then(function (d) { return (d && d.batches) || []; });
    },

    /* Resolves to { ok:true, batch } or { ok:false, errors, warnings, file }. It does NOT reject
     * on bad data: a validation failure is a normal, expected, displayable outcome, and throwing
     * would route it through the generic "could not load" path where the specifics get lost. */
    load: function (file) {
      return getJSON(file).then(function (d) {
        var v = validate(d, file);
        if (v.errors.length) {
          return { ok: false, file: file, errors: v.errors, warnings: v.warnings };
        }
        loaded = adapt(d, v);
        loaded.file = file;
        return { ok: true, batch: loaded };
      });
    },

    current: function () { return loaded; }
  };
})();
