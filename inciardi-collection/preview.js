/* Inciardi Collection — THE BACK ROOM'S MARKUP. Strings only.
 *
 * ============================================================================
 * WHY THIS SEAM AND NOT THE ONE THE MODULE MAP NAMES.
 *
 * `backroom.js` reached 16.7KB against a 15KB split line. The seam recorded in the map is PLAN
 * vs APPLY — and taking it means refactoring the write path on the morning Michael is about to
 * push thirty-seven irreversible writes through it. So a different seam was taken: this one,
 * which is FREE. Everything here is pure string assembly, a function of (batch, plan) with no
 * state, no network and no side effects, so `apply` / `chain` / `log` could not be affected by
 * it even in principle.
 *
 * AND IT IS THE HALF THAT CHURNS. Every note Michael has given this screen has been about what
 * it SAYS, never about how it writes. v16 is the third consecutive change to land entirely in
 * this file. The volatile part and the dangerous part are no longer the same file.
 *
 * ⚠️ PLAN vs APPLY IS STILL OWED. Take it on a day when nobody is mid-import.
 * ============================================================================
 *
 * ZERO DECISIONS LIVE HERE. Every number and verdict is computed in `backroom.js` → build() and
 * arrives on `plan`. If this file ever starts working something out for itself, there are two
 * places deciding what a run will do, and they will eventually disagree.
 *
 * FOUR IDS ARE A CONTRACT with backroom.js: `brRun`, `brRecheck`, `brOverride`, and the
 * `.br-pick` class. Renaming one here silently unwires it there, and the symptom is a control
 * that looks fine and does nothing.
 */
(function () {

  function esc(s) { return Core.esc(s); }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  /* ---------- the batch picker ----------
   * Only drawn when there is more than one batch: a chooser with a single choice is furniture,
   * and on the screen that performs bulk writes furniture is worse than nothing. It appears on
   * the valid AND the invalid screen, so a broken batch never traps you somewhere with no exit. */
  function picker(files, current) {
    if (!files || files.length < 2) return '';
    return '<div class="br-picks">' +
      files.map(function (f) {
        var on = f === current;
        return '<button class="br-pick' + (on ? ' on' : '') + '" data-file="' + esc(f) + '"' +
          (on ? ' aria-current="true"' : '') + '>' + esc(f.replace(/\.json$/, '')) + '</button>';
      }).join('') + '</div>';
  }

  /* ============================================================ THE HEADLINE
   * Michael, 2026-07-31: "its a little misleading to say it as that number cos to me it seems
   * like 18 since i gave you two full filled sheets of 9... it really should be headlined as
   * 'importing 18 prints into 18 scanned slots over 1 sheet assumed front/back'."
   *
   * 🔴 HE WAS RIGHT, AND THE OLD BUTTON WAS WORSE THAN MISLEADING — IT WAS WRONG. It read "Write
   * 37 rows". 37 is the count of HTTP CALLS. The number of DATABASE ROWS is 73, because each
   * POST /artwork also mints an implicit edition (trigger, schema.sql) and an ownership row. So
   * the single number on the button was simultaneously too big to describe the work and too
   * small to describe the writes — and it was the number a person had to press.
   *
   * THE RULE: A CONFIRMATION SCREEN HEADLINES THE WORK, IN THE UNITS OF THE THING BEING DONE.
   * Eighteen prints into eighteen slots on one sheet is a sentence you can check against the
   * physical object in your hand, which is the only check that matters here. Calls and rows are
   * MECHANICS: useful for reading the log afterwards, useless for deciding whether to press the
   * button. They go underneath, small.
   *
   * "FRONT AND BACK ASSUMED" IS HIS PHRASE AND IT STAYS ON SCREEN — and as of v16 it is a real
   * flag in the batch file (`faces_assumed`) rather than something inferred from the shape of
   * the data, so a future batch that KNOWS which face is which can say so and drop the caveat
   * honestly. */
  function headline(B, plan, stamp) {
    return '<div class="br-head">' +
      '<h2 class="br-line">Importing <b>' + plural(B.prints.length, 'print', 'prints') +
        '</b> into <b>' + plural(plan.rows.length, 'scanned slot', 'scanned slots') +
        '</b> over <b>1 sheet</b>' +
        (plan.faces === 2 && B.facesAssumed ? ', front and back assumed' : '') + '.</h2>' +
      '<p class="br-sub">' + esc(B.label) + ' \u00b7 ' + esc(B.source) + '</p>' +
      '<p class="br-mech">' + plan.calls + ' calls \u00b7 ' + plan.dbRows +
        ' database rows \u00b7 ' + plan.newArts + ' new to the catalog' +
        (plan.haveArts ? ', ' + plan.haveArts + ' already known' : '') +
        ' \u00b7 ' + esc(B.file || '') + ' \u00b7 build ' + esc(stamp) + '</p>' +
      '</div>';
  }

  /* Non-blocking notes from the validator: a print placed twice (legal, J2 ruling 3, but also
   * what a copy-paste slip looks like) or described and never placed. Shown rather than
   * swallowed — the whole reason batches are data files is that their mistakes become legible. */
  function warnings(list) {
    if (!list || !list.length) return '';
    return '<ul class="br-warn">' + list.map(function (w) {
      return '<li>' + esc(w) + '</li>';
    }).join('') + '</ul>';
  }

  /* THE TARGET. A screen that writes to a sheet says WHICH sheet, by id, before it does — the
   * difference between a fresh sheet and someone's working one is a single string, and it
   * belongs on screen rather than buried in a data file. */
  function target(B, plan) {
    return '<p class="br-target"><span class="tag">target</span> ' +
      'sheet <code>' + esc(B.sheet.sheet_id) + '</code> \u00b7 titled ' +
      esc(B.sheet.title || '(untitled)') + ' \u00b7 in binder <code>' +
      esc(B.sheet.binder_id || 'mini-binder') + '</code>' +
      (plan.sheetExists
        ? ' \u2014 <b>already exists</b>, holding ' +
          plural(plan.occupied, 'slot', 'slots') + '.'
        : ' \u2014 <b>will be created</b>, landing after your existing sheets.') + '</p>';
  }

  function stop(plan) {
    if (!plan.blocked) return '';
    return '<div class="br-stop"><b>Blocked.</b> That sheet already holds ' +
      plural(plan.occupied, 'slot', 'slots') + ', so this run would write over work that is ' +
      'already there. Nothing has been sent.' +
      '<label class="br-ovr"><input type="checkbox" id="brOverride"> ' +
      'I know \u2014 overwrite those slots anyway</label></div>';
  }

  /* The per-row verdict. This column is the entire point of the screen: a batch importer that
   * lists names without saying which are new and which get overwritten has told you nothing you
   * could act on. */
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

  function table(plan) {
    var body = plan.rows.map(function (r) {
      var p = r.p;
      /* Binder.face() is the ONE place 'A'/'B' becomes Front/Back (binder.js). Borrowed rather
       * than copied — a second mapping is a second thing to get wrong. */
      return '<tr class="' + (r.slotState === 'clash' ? 'clash' : '') + '">' +
        '<td class="br-pos">' + Binder.face(p.side).toLowerCase() +
          ' <b>' + (p.position + 1) + '</b></td>' +
        '<td class="br-nm">' + esc(p.name) +
          '<span class="br-id">' + esc(p.id) + '</span></td>' +
        '<td class="br-st">' + tag(r) + '</td>' +
      '</tr>';
    }).join('');

    return '<div class="mxt-wrap"><table class="mxt br-t"><thead><tr>' +
      '<th>Slot</th><th>Print</th><th>What happens</th>' +
      '</tr></thead><tbody>' + body + '</tbody></table></div>';
  }

  /* The button says the WORK, for the same reason the headline does: "Import 18 prints" is
   * checkable against the sheet in your hand. "Write 37 rows" was a number only that file could
   * have produced, and it was not even the right one. */
  function controls(B, plan) {
    return '<div class="br-go">' +
        '<button id="brRun" class="primary"' + (plan.blocked ? ' disabled' : '') + '>' +
          'Import ' + plural(B.prints.length, 'print', 'prints') + '</button>' +
        '<button id="brRecheck" class="ghost">Re-read the binder</button>' +
      '</div>' +
      '<p class="hint">Order is forced: prints first, then the sheet, then the slots \u2014 a ' +
      'slot cannot reference an artwork that does not exist yet. Each new print is three rows: ' +
      'the print, its edition, and your copy of it. Writes go one at a time and stop at the ' +
      'first real failure, so a bad row leaves the rest unsent rather than half applied. A print ' +
      'you already own is skipped, never added twice.</p>' +
      '<pre id="brLog" class="out" hidden></pre>';
  }

  window.Preview = {
    html: function (B, plan, files, stamp) {
      return picker(files, B.file) + headline(B, plan, stamp) + warnings(B.warnings) +
             target(B, plan) + stop(plan) + table(plan) + controls(B, plan);
    },

    /* ⚠️ THE FAILURE SCREEN RENDERS NO RUN BUTTON AT ALL. Not a disabled one — none. A disabled
     * button says "there is a way to make this go"; on a batch whose data does not validate, the
     * only way is to fix the file and push again. Every error is listed at once, because a cold
     * agent fixing them one per round trip waits on a Pages build each time.
     * The picker still renders, so a broken batch is not a dead end. */
    invalid: function (res, files) {
      return picker(files, res.file) +
        '<div class="br-head">' +
          '<h2 class="br-line">This batch cannot be imported.</h2>' +
          '<p class="br-sub">Nothing has been sent. Fix <code>batches/' + esc(res.file) +
            '</code> and push \u2014 the file is data, so no code needs touching.</p>' +
        '</div>' +
        '<ul class="br-errs">' + res.errors.map(function (e) {
          return '<li>' + esc(e) + '</li>';
        }).join('') + '</ul>' +
        warnings(res.warnings) +
        '<p class="hint">Every rule above is one the database or the worker enforces anyway. ' +
        'Checking here only means you find out now, all at once, instead of part-way through a ' +
        'run. The format is documented in <code>brain-config/hooks/batch-import.md</code>.</p>';
    }
  };
})();
