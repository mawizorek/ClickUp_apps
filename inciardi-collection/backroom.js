/* Inciardi Collection — THE BACK ROOM. Loads a transcribed batch and writes it into the binder.
 *
 * This file CHOOSES, READS, DECIDES and WRITES. The batch itself is `batches/<name>.json` (data,
 * never code — see batch.js), the markup is `preview.js`, and WHERE each print sits is `arrange.js`.
 *
 * HOW YOU GET HERE: `#backroom` is absent from `APP.nav`, so it is in neither the nav drawer nor
 * the page footer. It IS listed at the foot of the settings panel (v13) and reachable by typing
 * the address. The full argument for why concealment is not a defence here lives ONCE, in
 * settings.js → hiddenRoutes(). Short version: public repo, public site, write key baked into
 * core.js by design, so anyone who can read the source can already POST to the worker with curl.
 * THE PROTECTIONS ARE THE GUARDS BELOW AND D1 TIME TRAVEL. Never the URL.
 *
 * WHAT THIS SCREEN REFUSES TO DO:
 *   - Write anything before showing you every row it intends to write.
 *   - Offer to run a batch whose data does not validate.
 *   - Touch a sheet that already has prints in it, unless you tick the override.
 *   - Continue past a failure it did not expect.
 *   - Add a second copy of a print you already own. A re-run is a no-op, not a double.
 *   - v17: write an arrangement other than the one currently on screen.
 *
 * 🔴 v17 — THE ARRANGEMENT IS NO LONGER THE FILE'S TO DICTATE, AND EVERY READ OF IT MOVED.
 * `Arrange.prints()` replaces `B.prints` in `build()` and in BOTH loops of `apply()`. That is the
 * whole integration, and it has to be all three: planning from the grid while writing from the file
 * would show him a corrected sheet and then write the broken one, which is worse than not offering
 * the editor at all. `B` keeps `artworkBody()` / `slotBody()` — they only ever read a print's own
 * fields, so an arranged print passes through them unchanged.
 *
 * ⚠️ THE REMAINING SEAM, for whoever adds the next feature: PLAN vs APPLY. `preflight` / `build`
 * read and decide; `apply` / `chain` / `log` write. They share only `live` and `plan`.
 */
(function () {
  var files = [];         // every batch in batches/_index.json
  var B = null;           // the batch currently loaded and validated
  var live = null;        // what the server says right now
  var plan = null;        // what we intend to do about it
  var running = false;
  /* ⚠️ THE OVERRIDE SURVIVES A RE-RENDER, and that is a v17 fix rather than a nicety. Editing the
   * arrangement re-renders the screen, which rebuilds the checkbox unticked — so on the exact sheet
   * that needs fixing (already imported, therefore occupied, therefore blocked) every single tap
   * would have silently re-armed the block. The state belongs to the session, not to the node. */
  var overridden = false;

  function $(id) { return document.getElementById(id); }

  /* WHERE THE PRINTS GO. One call per use, never cached across a render: `arrange.js` is the only
   * thing that knows, and a stale copy of an arrangement is precisely the bug this screen exists
   * to catch. */
  function placed() { return Arrange.prints(); }

  /* ---------------------------------------------------------------- MOUNT
   * A chain now, because the batch lives on disk: list → choose → load → validate → preflight.
   * Each step can fail in its own way and each says which one it was. "Nothing happened" is not
   * an acceptable outcome on the screen that performs bulk writes. */
  function mount() {
    var host = $('brWrap');
    var missing = !window.Batch ? 'batch.js' : !window.Preview ? 'preview.js'
                : !window.Arrange ? 'arrange.js' : null;
    if (missing) {
      host.innerHTML = '<div class="empty bad"><b>The back room did not fully load.</b><br>' +
        'Missing <code>' + missing + '</code>. This screen will not write anything it cannot ' +
        'first read and show you.</div>';
      return;
    }

    /* Any edit to the arrangement re-plans against the SAME server snapshot and repaints. No
     * refetch: only positions changed, so re-reading the binder would be a slow way to get the
     * same answer — and "Re-read the binder" is a button he can press when he wants one. */
    Arrange.onChange(function () {
      if (!B || !live) return;
      plan = build();
      render();
    });

    Core.busy(host, 'Looking for batches\u2026');

    Batch.list().then(function (list) {
      files = list;
      if (!files.length) {
        host.innerHTML = '<div class="empty">No batches to import.<br>' +
          'Drop a <code>.json</code> in <code>batches/</code> and add it to ' +
          '<code>batches/_index.json</code>.</div>';
        return;
      }
      open(files[0]);
    }).catch(function (e) { Core.fail(host, e); });
  }

  /* Load one batch and either preflight it or show why it cannot be run. A validation failure is
   * a NORMAL outcome here, rendered in full — the whole point of moving batches to data files is
   * that a transcription mistake becomes a readable list instead of a 400 mid-run. */
  function open(file) {
    var host = $('brWrap');
    Core.busy(host, 'Reading ' + file + '\u2026');
    Batch.load(file).then(function (res) {
      if (!res.ok) {
        B = null;
        host.innerHTML = Preview.invalid(res, files);
        wirePicker();
        return;
      }
      B = res.batch;
      /* Seed the editor from the file BEFORE anything is planned, and reset the override with it:
       * consent to overwrite one sheet is not consent to overwrite the next one you pick. */
      Arrange.from(B);
      overridden = false;
      preflight();
    }).catch(function (e) { Core.fail(host, e); });
  }

  /* ---------------------------------------------------------------- PREFLIGHT
   * READ FIRST, ALWAYS. The batch was written hours ago against a binder that has since been
   * edited from a phone. Everything this screen claims is derived from a read taken seconds
   * before the write, never from an assumption baked into the payload. */
  function preflight() {
    var host = $('brWrap');
    if (!B) return mount();
    Core.busy(host, 'Reading what is in the binder right now\u2026');

    Promise.all([API.get('/artworks'), API.get('/sheets')]).then(function (r) {
      var arts = {};
      (r[0].artworks || []).forEach(function (a) { arts[a.artwork_id] = a; });
      var sheets = {};
      (r[1].sheets || []).forEach(function (s) { sheets[s.sheet_id] = s; });

      // Only ask for slots if the target sheet exists; asking otherwise is a guaranteed empty.
      if (!sheets[B.sheet.sheet_id]) return { arts: arts, sheets: sheets, slots: {} };
      return API.get('/slots?sheet=' + encodeURIComponent(B.sheet.sheet_id))
        .then(function (d) {
          var slots = {};
          (d.slots || []).forEach(function (s) { slots[s.side + s.position] = s; });
          return { arts: arts, sheets: sheets, slots: slots };
        });
    }).then(function (l) {
      live = l;
      plan = build();
      render();
    }).catch(function (e) { Core.fail(host, e); });
  }

  /* Compare the arrangement against live and decide, per row, what will happen. Nothing here sends
   * anything — this function's whole job is to make the run predictable in advance, and it is
   * the ONLY place any of these numbers are worked out. preview.js decides nothing. */
  function build() {
    var sheetExists = !!live.sheets[B.sheet.sheet_id];
    var occupied = Object.keys(live.slots).length;
    var list = placed();

    var rows = list.map(function (p) {
      var have = live.arts[p.id];
      var sitting = live.slots[p.side + p.position];
      return {
        p: p,
        artState: have ? 'have' : 'new',
        // Only flag a CLASH when the pocket holds something ELSE. The same print in the same
        // pocket is the batch already having run, which is not a conflict.
        slotState: !sitting ? 'free'
          : (sitting.artwork_id === p.id ? 'same' : 'clash'),
        sitting: sitting
      };
    });

    var newArts = rows.filter(function (r) { return r.artState === 'new'; }).length;
    var faces = {}, seen = {};
    list.forEach(function (p) { faces[p.side] = 1; seen[p.id] = 1; });

    return {
      sheetExists: sheetExists,
      occupied: occupied,
      // 🔴 THE GUARD THAT MATTERS, and it is deliberately a RULE rather than a list of sheet ids
      // to leave alone. Michael asked that his two working sheets not be touched. A hardcoded
      // do-not-touch list would protect exactly the sheets someone remembered to add to it, and
      // silently stop protecting the third one. Instead: a run is blocked whenever the TARGET
      // sheet already holds any slots at all. Both of his working sheets do, so they are covered
      // by the rule, and so is every sheet he makes tomorrow.
      blocked: sheetExists && occupied > 0,
      rows: rows,
      /* DISTINCT ARTWORKS, computed rather than taken from `B.prints.length`. Under the editor the
       * two are always equal (every op is a permutation) — which is exactly why leaning on that
       * equality would be the kind of coincidence that survives until the day it stops. */
      printCount: Object.keys(seen).length,
      newArts: newArts,
      haveArts: rows.length - newArts,
      faces: Object.keys(faces).length,
      clashes: rows.filter(function (r) { return r.slotState === 'clash'; }).length,
      // HTTP calls. NOT the same number as the prints, and NOT the same number as the rows.
      calls: newArts + (sheetExists ? 0 : 1) + rows.length,
      /* Rows D1 actually gains. Each POST /artwork writes THREE: the artwork, the implicit
       * edition its trigger mints (schema.sql — every artwork has at least one edition), and an
       * ownership row because the batch says `own`. Computed because the old button said "Write
       * 37 rows" and 37 was the CALL count: wrong in both directions at once. */
      dbRows: newArts * 3 + (sheetExists ? 0 : 1) + rows.length
    };
  }

  /* Build, inject, wire. Every number on screen comes from `plan`; the markup file works nothing
   * out for itself, so there is one place deciding what this run will do. */
  function render() {
    $('brWrap').innerHTML = Preview.html(B, plan, files,
      window.ICApp ? ICApp.version : '(version unknown)');
    wirePicker();
    Arrange.wire();

    $('brRecheck').addEventListener('click', preflight);
    var ov = $('brOverride');
    if (ov) {
      ov.checked = overridden;
      ov.addEventListener('change', function () {
        overridden = this.checked;
        $('brRun').disabled = !overridden;
      });
    }
    var run = $('brRun');
    if (run) {
      if (plan.blocked) run.disabled = !overridden;
      run.addEventListener('click', function () {
        if (running) return;
        // Second confirm, and it names the sheet. The first click is intent; this is consent.
        if (!window.confirm('Write to ' + B.sheet.sheet_id + '? This cannot be undone ' +
            'from inside the app.')) return;
        apply();
      });
    }
  }

  /* The picker exists on BOTH the valid and invalid screens, so it is wired separately — a batch
   * that fails to validate must still let you switch to one that does. */
  function wirePicker() {
    [].forEach.call(document.querySelectorAll('.br-pick'), function (b) {
      b.addEventListener('click', function () { open(b.getAttribute('data-file')); });
    });
  }

  /* ---------------------------------------------------------------- APPLY
   * SEQUENTIAL, NOT Promise.all. Thirty-seven parallel writes would interleave their log lines
   * into noise, and a failure in the middle would leave no way to say what had already landed.
   * One at a time is slower and completely legible. */
  function log(kind, text) {
    var el = $('brLog');
    el.hidden = false;
    var mark = kind === 'ok' ? '\u2713' : kind === 'skip' ? '\u00b7' : kind === 'bad' ? '\u2717' : ' ';
    el.textContent += mark + ' ' + text + '\n';
    el.scrollTop = el.scrollHeight;
  }

  /* A duplicate is not a failure. The worker answers 409 with an already exists message when an
   * artwork_id is taken, and UNIQUE on a second POST /sheet. Both mean the row this batch wanted
   * is present, which is the desired end state — so they are logged as skips and the run
   * continues. This is also what makes a re-run safe: the artwork insert short-circuits BEFORE
   * the copy insert in the worker, so re-running cannot add a second copy and quietly double an
   * ownership count.
   * ⚠️ WHAT IT DOES NOT PROTECT: slots use ON CONFLICT DO UPDATE, so a re-run with a DIFFERENT
   * arrangement silently re-seats the prints. Correct behaviour for fixing a mistake — and as of
   * v17 it is also the mechanism BEHIND the drift warning in arrange.js, because it means an
   * unfixed batch file can undo a corrected import without a single error. */
  function benign(e) {
    return /already exists|UNIQUE/i.test(e.message || '');
  }

  function chain(steps) {
    var i = 0;
    function next() {
      if (i >= steps.length) return Promise.resolve();
      var s = steps[i++];
      return s.run().then(function (res) {
        // 207 = the artwork landed but its ownership row did not. Do NOT report that as a clean
        // success: the print would show as wanted forever and nobody would know why.
        if (res && res.copy_error) log('bad', s.label + ' \u2014 saved, but ownership failed: ' + res.copy_error);
        else log('ok', s.label);
        return next();
      }).catch(function (e) {
        if (benign(e)) { log('skip', s.label + ' \u2014 already there'); return next(); }
        log('bad', s.label + ' \u2014 ' + e.message);
        throw e;
      });
    }
    return next();
  }

  function apply() {
    running = true;
    $('brRun').disabled = true;
    $('brLog').hidden = false;
    $('brLog').textContent = '';
    log('', 'Starting \u2014 ' + new Date().toLocaleTimeString() +
            '  \u00b7  ' + B.file + '  \u00b7  build ' +
            (window.ICApp ? ICApp.version : '?') + '\n');

    /* 🔴 THE RECEIPT NAMES THE EDITS. A log that says nothing about the corrections is a log that
     * cannot later answer "why does D1 disagree with the file" — the one question a drifted
     * arrangement guarantees somebody eventually asks. */
    if (Arrange.dirty()) {
      log('', 'Arrangement EDITED on screen before this run:');
      Arrange.ops().forEach(function (o) { log('', '    \u00b7 ' + o); });
      log('', 'batches/' + B.file + ' still holds the old arrangement.\n');
    }

    /* ONE read of the arrangement for the whole run. Two calls would return equal arrays today and
     * would be a race the day anything can change mid-run. */
    var list = placed();
    var steps = [];

    // 1. PRINTS FIRST. slot.artwork_id is a foreign key; placing before the artwork exists is an
    //    unwriteable row, not a race. Skip the ones already in the catalog.
    //    One call, three rows: artwork, its implicit edition (trigger), and the ownership row.
    list.forEach(function (p) {
      if (live.arts[p.id]) return;
      steps.push({
        label: 'print \u00b7 ' + p.name,
        run: function () { return API.post('/artwork', B.artworkBody(p)); }
      });
    });

    // 2. THE SHEET. Needs to exist before anything can be placed on it.
    if (!plan.sheetExists) {
      steps.push({
        label: 'sheet \u00b7 ' + (B.sheet.title || B.sheet.sheet_id),
        run: function () { return API.post('/sheet', B.sheet); }
      });
    }

    // 3. THE SLOTS. ON CONFLICT DO UPDATE server-side, so these are idempotent by construction.
    list.forEach(function (p) {
      steps.push({
        label: 'slot \u00b7 ' + Binder.face(p.side).toLowerCase() + ' ' + (p.position + 1) +
               ' \u00b7 ' + p.name,
        run: function () { return API.post('/slot', B.slotBody(p)); }
      });
    });

    chain(steps).then(function () {
      log('', '\nDone. ' + steps.length + ' calls sent.');
      Core.toast('Batch written', 'good');
      // NO OPTIMISTIC UI: re-read rather than assuming the plan happened. The screen now shows
      // the post-write truth, which is also the proof it worked.
      Binder.invalidateArtworks();
      running = false;
      preflight();
    }).catch(function (e) {
      log('', '\nSTOPPED. Everything above this line landed; nothing below it was sent.');
      Core.toast(e.message, 'bad');
      running = false;
      $('brRun').disabled = false;
    });
  }

  window.Backroom = { mount: mount };
})();
