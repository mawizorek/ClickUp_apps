/* Inciardi Collection — THE BACK ROOM. Runs a transcribed batch into the binder.
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
 *   - Touch a sheet that already has prints in it, unless you tick the override.
 *   - Continue past a failure it did not expect.
 *   - Add a second copy of a print you already own. A re-run is a no-op, not a double.
 *
 * ONE BATCH AT A TIME. `window.Batch` is the payload; swapping batches means swapping
 * `batch.js`. This file never changes when a new photo arrives, which is the entire point of
 * the split — the code that performs irreversible writes should not be edited casually.
 *
 * ⚠️ NAMED SEAM, for whoever adds the next feature here: PLAN vs APPLY. `preflight` / `build` /
 * `render` read and decide; `apply` / `chain` / `log` write. They share only `live` and `plan`.
 * That is where this file splits, and it is close enough to the 15KB line that the next real
 * addition should take it rather than append.
 */
(function () {
  var live = null;        // what the server says right now
  var plan = null;        // what we intend to do about it
  var running = false;

  function $(id) { return document.getElementById(id); }
  function esc(s) { return Core.esc(s); }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  /* ---------------------------------------------------------------- PREFLIGHT
   * READ FIRST, ALWAYS. The batch was written hours ago against a binder that has since been
   * edited from a phone. Everything this screen claims is derived from a read taken seconds
   * before the write, never from an assumption baked into the payload. */
  function preflight() {
    var host = $('brWrap');
    var B = window.Batch;
    if (!B) {
      host.innerHTML = '<div class="empty bad"><b>No batch loaded.</b><br>' +
        'batch.js did not load, so there is nothing to run.</div>';
      return;
    }
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

  /* Compare the batch against live and decide, per row, what will happen. Nothing here sends
   * anything — this function's whole job is to make the run predictable in advance. */
  function build() {
    var B = window.Batch;
    var sheetExists = !!live.sheets[B.sheet.sheet_id];
    var occupied = Object.keys(live.slots).length;

    var rows = B.prints.map(function (p) {
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
    var faces = {};
    B.prints.forEach(function (p) { faces[p.side] = 1; });

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
      newArts: newArts,
      haveArts: rows.length - newArts,
      faces: Object.keys(faces).length,
      clashes: rows.filter(function (r) { return r.slotState === 'clash'; }).length,
      // HTTP calls, which is NOT the same number as either the prints or the database rows.
      calls: newArts + (sheetExists ? 0 : 1) + rows.length,
      /* Rows D1 will actually gain. Each POST /artwork writes THREE: the artwork, the implicit
       * edition its trigger mints (schema.sql — every artwork has at least one edition), and an
       * ownership row because the batch says `own`. Stated because the old button said "Write 37
       * rows" and 37 was the CALL count — wrong in both directions at once. */
      dbRows: newArts * 3 + (sheetExists ? 0 : 1) + rows.length
    };
  }

  /* ---------------------------------------------------------------- RENDER */
  function render() {
    var B = window.Batch;

    /* ============================================================ THE HEADLINE
     * Michael, 2026-07-31: "its a little misleading to say it as that number cos to me it seems
     * like 18 since i gave you two full filled sheets of 9... it really should be headlined as
     * 'importing 18 prints into 18 scanned slots over 1 sheet assumed front/back'."
     *
     * 🔴 HE IS RIGHT, AND THE BUTTON WAS WORSE THAN MISLEADING — IT WAS WRONG. It read "Write 37
     * rows". 37 is the count of HTTP CALLS. The number of DATABASE ROWS is 73, because each
     * POST /artwork also mints an implicit edition (trigger) and an ownership row. So the single
     * number on the button was simultaneously too big to describe the work and too small to
     * describe the writes, and it was the number a person had to press.
     *
     * THE RULE: A CONFIRMATION SCREEN HEADLINES THE WORK, IN THE UNITS OF THE THING BEING DONE.
     * Eighteen prints into eighteen slots on one sheet — that is the sentence someone can check
     * against the physical object in their hand, which is the only check that matters here. The
     * call count and the row count are MECHANICS: useful for reading the log afterwards, useless
     * for deciding whether to press the button, so they go underneath in small type.
     *
     * "FRONT AND BACK ASSUMED" IS HIS PHRASE AND IT STAYS ON SCREEN. Even after the v14 swap,
     * WHICH face is the front remains an assumption — no photograph of a loose sheet says. The
     * screen should keep admitting that at the moment of writing rather than only in a code
     * comment nobody reads at 10am. */
    var head =
      '<div class="br-head">' +
        '<h2 class="br-line">Importing <b>' + plural(B.prints.length, 'print', 'prints') +
          '</b> into <b>' + plural(plan.rows.length, 'scanned slot', 'scanned slots') +
          '</b> over <b>' + plural(1, 'sheet', 'sheets') + '</b>' +
          (plan.faces === 2 ? ', front and back assumed' : '') + '.</h2>' +
        '<p class="br-sub">' + esc(B.label) + ' \u00b7 ' + esc(B.source) + '</p>' +
        '<p class="br-mech">' +
          plan.calls + ' calls \u00b7 ' + plan.dbRows + ' database rows \u00b7 ' +
          plan.newArts + ' new to the catalog' +
          (plan.haveArts ? ', ' + plan.haveArts + ' already known' : '') +
          ' \u00b7 build ' + esc(window.ICApp ? ICApp.version : '?') +
        '</p>' +
      '</div>';

    /* THE TARGET, spelled out. A screen that writes to a sheet should say which sheet, by id,
     * before it does — the difference between a new sheet and someone's working one is a single
     * string, and it should be on screen rather than in a file. */
    var target =
      '<p class="br-target"><span class="tag">target</span> ' +
      'sheet <code>' + esc(B.sheet.sheet_id) + '</code> \u00b7 titled ' +
      esc(B.sheet.title) + ' \u00b7 in binder <code>' + esc(B.sheet.binder_id) + '</code>' +
      (plan.sheetExists
        ? ' \u2014 <b>already exists</b>, holding ' + plan.occupied + ' slot' +
          (plan.occupied === 1 ? '' : 's') + '.'
        : ' \u2014 <b>will be created</b>, landing after your existing sheets.') + '</p>';

    var note = plan.blocked
      ? '<div class="br-stop"><b>Blocked.</b> That sheet already holds ' + plan.occupied +
        ' slot' + (plan.occupied === 1 ? '' : 's') + ', so this run would write over work that ' +
        'is already there. Nothing has been sent.' +
        '<label class="br-ovr"><input type="checkbox" id="brOverride"> ' +
        'I know \u2014 overwrite those slots anyway</label></div>'
      : '';

    var body = plan.rows.map(function (r) {
      var p = r.p;
      return '<tr class="' + (r.slotState === 'clash' ? 'clash' : '') + '">' +
        '<td class="br-pos">' + Binder.face(p.side).toLowerCase() +
          ' <b>' + (p.position + 1) + '</b></td>' +
        '<td class="br-nm">' + esc(p.name) +
          '<span class="br-id">' + esc(p.id) + '</span></td>' +
        '<td class="br-st">' + tag(r) + '</td>' +
      '</tr>';
    }).join('');

    $('brWrap').innerHTML =
      head + target + note +
      '<div class="mxt-wrap"><table class="mxt br-t"><thead><tr>' +
        '<th>Slot</th><th>Print</th><th>What happens</th>' +
      '</tr></thead><tbody>' + body + '</tbody></table></div>' +

      /* The button says the WORK too. "Import 18 prints" is checkable against the sheet in your
       * hand; "Write 37 rows" was a number only this file could have produced. */
      '<div class="br-go">' +
        '<button id="brRun" class="primary"' + (plan.blocked ? ' disabled' : '') + '>' +
          'Import ' + plural(B.prints.length, 'print', 'prints') + '</button>' +
        '<button id="brRecheck" class="ghost">Re-read the binder</button>' +
      '</div>' +
      '<p class="hint">Order is forced: prints first, then the sheet, then the slots \u2014 a ' +
      'slot cannot reference an artwork that does not exist yet. Each print is three rows: the ' +
      'print itself, its edition, and your copy of it. Writes go one at a time and stop at the ' +
      'first real failure, so a bad row leaves the rest unsent rather than half applied. A print ' +
      'you already own is skipped, never added twice.</p>' +
      '<pre id="brLog" class="out" hidden></pre>';

    wire();
  }

  function tag(r) {
    if (r.slotState === 'clash') {
      return '<span class="br-tag bad">replaces ' +
        esc(r.sitting.artwork_name || r.sitting.note || 'what is there') + '</span>';
    }
    if (r.slotState === 'same') return '<span class="br-tag">already placed</span>';
    return r.artState === 'new'
      ? '<span class="br-tag new">add print + place</span>'
      : '<span class="br-tag">place only</span>';
  }

  function wire() {
    $('brRecheck').addEventListener('click', preflight);
    var ov = $('brOverride');
    if (ov) {
      ov.addEventListener('change', function () { $('brRun').disabled = !this.checked; });
    }
    $('brRun').addEventListener('click', function () {
      if (running) return;
      // Second confirm, and it names the sheet. The first click is intent; this is consent.
      if (!window.confirm('Write to ' + window.Batch.sheet.sheet_id + '? This cannot be undone ' +
          'from inside the app.')) return;
      apply();
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
   * arrangement silently re-seats the prints. Correct behaviour for fixing a mistake, and also
   * why the build stamp is on screen. */
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
    var B = window.Batch;
    running = true;
    $('brRun').disabled = true;
    $('brLog').hidden = false;
    $('brLog').textContent = '';
    log('', 'Starting \u2014 ' + new Date().toLocaleTimeString() +
            '  \u00b7  build ' + (window.ICApp ? ICApp.version : '?') + '\n');

    var steps = [];

    // 1. PRINTS FIRST. slot.artwork_id is a foreign key; placing before the artwork exists is an
    //    unwriteable row, not a race. Skip the ones already in the catalog.
    //    One call, three rows: artwork, its implicit edition (trigger), and the ownership row.
    B.prints.forEach(function (p) {
      if (live.arts[p.id]) return;
      steps.push({
        label: 'print \u00b7 ' + p.name,
        run: function () { return API.post('/artwork', B.artworkBody(p)); }
      });
    });

    // 2. THE SHEET. Needs to exist before anything can be placed on it.
    if (!plan.sheetExists) {
      steps.push({
        label: 'sheet \u00b7 ' + B.sheet.title,
        run: function () { return API.post('/sheet', B.sheet); }
      });
    }

    // 3. THE SLOTS. ON CONFLICT DO UPDATE server-side, so these are idempotent by construction.
    B.prints.forEach(function (p) {
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

  window.Backroom = { mount: preflight };
})();
