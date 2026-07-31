/* Inciardi Collection — THE BACK ROOM. Runs a transcribed batch into the binder.
 *
 * This file CHOOSES, READS, DECIDES and WRITES. The markup is `preview.js`; the transcript and
 * its validation are `batch.js` + `batches/*.json`.
 *
 * HOW YOU GET HERE: `#backroom` is absent from `APP.nav`, so it is in neither the nav drawer nor
 * the page footer. It IS listed at the foot of the settings panel (v13) and reachable by typing
 * the address. The full argument for why concealment is not a defence here lives ONCE, in
 * settings.js → hiddenRoutes(). Short version: public repo, public site, write key baked into
 * core.js by design, so anyone who can read the source can already POST to the worker with curl.
 * THE PROTECTIONS ARE THE GUARDS BELOW AND D1 TIME TRAVEL. Never the URL.
 *
 * WHAT THIS SCREEN REFUSES TO DO:
 *   - Load a transcript that does not validate. No run button at all, not a disabled one.
 *   - Write anything before showing you every row it intends to write.
 *   - Touch a sheet that already has prints in it, unless you tick the override.
 *   - Continue past a failure it did not expect.
 *   - Add a second copy of a print you already own. A re-run is a no-op, not a double.
 *
 * ⚠️ THE REMAINING SEAM, for whoever adds the next feature: PLAN vs APPLY. `preflight` / `build`
 * read and decide; `apply` / `chain` / `log` write. They share only `live` and `plan`.
 */
(function () {
  var B = null;           // the loaded, validated batch
  var live = null;        // what the server says right now
  var plan = null;        // what we intend to do about it
  var running = false;

  function $(id) { return document.getElementById(id); }

  /* ---------------------------------------------------------------- CHOOSE
   * A batch used to be a global that was simply THERE. Now it is fetched, so there is a step
   * before the one this screen used to start with.
   *
   * `#backroom?batch=drinks` picks directly. With no parameter: one batch loads itself, several
   * show a chooser. Auto-loading the only batch matters more than it sounds — a list of one is
   * a question with one answer, and asking it every time is the kind of friction that makes a
   * tool feel bureaucratic. */
  function mount(params) {
    var host = $('brWrap');
    Core.busy(host, 'Looking for batches\u2026');

    Batch.list().then(function (all) {
      if (!all.length) {
        host.innerHTML = '<div class="empty">No batches to import.<br>' +
          'A transcript is a file in <code>batches/</code> plus one line in ' +
          '<code>batches/_index.json</code>.</div>';
        return;
      }
      var want = params && params.batch;
      if (!want && all.length === 1) want = all[0].slug;
      if (!want) return choose(all);

      // A named batch that is not in the manifest is a typo or a deleted file. Say which.
      var known = all.some(function (x) { return x.slug === want; });
      if (!known) {
        host.innerHTML = '<div class="empty bad"><b>No batch called "' + Core.esc(want) +
          '".</b><br>The manifest lists: ' +
          all.map(function (x) { return '<code>' + Core.esc(x.slug) + '</code>'; }).join(', ') +
          '</div>';
        return;
      }
      open(want);
    }).catch(function (e) { Core.fail(host, e); });
  }

  function choose(all) {
    $('brWrap').innerHTML = Preview.chooser(all);
    [].forEach.call(document.querySelectorAll('.br-pick'), function (a) {
      a.addEventListener('click', function (ev) {
        ev.preventDefault();
        open(a.getAttribute('data-slug'));
      });
    });
  }

  function open(slug) {
    var host = $('brWrap');
    Core.busy(host, 'Reading the transcript\u2026');
    Batch.load(slug).then(function (b) {
      B = b;
      preflight();
    }).catch(function (e) {
      /* 🔴 A VALIDATION FAILURE RENDERS THE PROBLEM LIST AND NO RUN BUTTON. Not a disabled one —
       * ABSENT. A disabled button invites hunting for the thing that enables it, and there is
       * nothing on this screen to find: the transcript is wrong and the fix is in the repo.
       * `e.problems` is every problem at once, because someone correcting a file should get the
       * whole list rather than five round trips. */
      if (e.problems) { host.innerHTML = Preview.problems(slug, e.problems); return; }
      Core.fail(host, e);
    });
  }

  /* ---------------------------------------------------------------- PREFLIGHT
   * READ FIRST, ALWAYS. The transcript was written hours ago against a binder that has since
   * been edited from a phone. Everything this screen claims is derived from a read taken seconds
   * before the write, never from an assumption baked into the payload. */
  function preflight() {
    var host = $('brWrap');
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
   * anything — this function's whole job is to make the run predictable in advance, and it is
   * the ONLY place any of these numbers are worked out. preview.js decides nothing. */
  function build() {
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
      faces: B.faceCount,
      clashes: rows.filter(function (r) { return r.slotState === 'clash'; }).length,
      // HTTP calls. NOT the same number as the prints, and NOT the same number as the rows.
      calls: newArts + (sheetExists ? 0 : 1) + rows.length,
      /* Rows D1 actually gains. Each POST /artwork writes THREE: the artwork, the implicit
       * edition its trigger mints (schema.sql — every artwork has at least one edition), and an
       * ownership row because the batch says `own`. Computed because the v14 button said "Write
       * 37 rows" and 37 was the CALL count: wrong in both directions at once. */
      dbRows: newArts * 3 + (sheetExists ? 0 : 1) + rows.length
    };
  }

  /* Build, inject, wire. All three numbers on screen come from `plan`; the markup file works
   * nothing out for itself, so there is one place deciding what this run will do. */
  function render() {
    if (!window.Preview) {
      $('brWrap').innerHTML = '<div class="empty bad"><b>Preview did not load.</b><br>' +
        '<code>preview.js</code> is missing, so there is no way to show you what would be ' +
        'written \u2014 and this screen will not write anything it cannot show you first.</div>';
      return;
    }
    $('brWrap').innerHTML =
      Preview.html(B, plan, window.ICApp ? ICApp.version : '(version unknown)');
    wire();
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
      if (!window.confirm('Write to ' + B.sheet.sheet_id + '? This cannot be undone ' +
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
    running = true;
    $('brRun').disabled = true;
    $('brLog').hidden = false;
    $('brLog').textContent = '';
    log('', 'Starting \u2014 ' + new Date().toLocaleTimeString() +
            '  \u00b7  batch ' + B.slug +
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
        label: 'sheet \u00b7 ' + (B.sheet.title || B.sheet.sheet_id),
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
      log('', 'Mark this batch \u201cpushed\u201d in batches/_index.json so the next reader ' +
              'knows it has run.');
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
