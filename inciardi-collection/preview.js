/* Inciardi Collection — THE BACK ROOM'S MARKUP. Three screens, no decisions.
 *
 *   chooser()  — which transcript, when there is more than one
 *   problems() — a transcript that did not validate
 *   html()     — the preview of a run that could happen
 *
 * ============================================================================
 * WHY THIS SEAM AND NOT THE ONE THE MODULE MAP NAMES.
 *
 * `backroom.js` reached 16.7KB against a 15KB split line at v15. The seam recorded in the map is
 * PLAN vs APPLY — and taking it means refactoring the write path on a morning Michael is about
 * to push thirty-seven irreversible writes through it. So a different seam was taken: the
 * markup. Pure string assembly, no state, no network, so `apply`/`chain`/`log` were untouched.
 *
 * IT IS ALSO THE HALF THAT CHURNS. Every note Michael has given this screen has been about what
 * it SAYS, never about how it writes — and v16 proved it again by adding two screens here and
 * one function there. The volatile part and the dangerous part are no longer the same file.
 *
 * ⚠️ PLAN vs APPLY IS STILL OWED. Take it on a day when nobody is mid-import.
 * ============================================================================
 *
 * ZERO DECISIONS LIVE HERE. Every number and verdict is computed in `backroom.js` → build() and
 * arrives on `plan`. If this file ever starts working something out for itself, there are two
 * places deciding what a run will do, and they will eventually disagree.
 *
 * FOUR IDS ARE A CONTRACT with backroom.js: `brRun`, `brRecheck`, `brOverride`, and the
 * `.br-pick` class on chooser rows. Renaming one here silently unwires it there, and the symptom
 * is a control that looks fine and does nothing.
 */
(function () {

  function esc(s) { return Core.esc(s); }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  /* ---------------------------------------------------------------- CHOOSER
   * Only reached when more than one batch is ready; a single batch opens itself. Pushed ones
   * stay in the list rather than disappearing — the transcript is the only durable record of
   * those photographs, and a list that silently shrinks makes you wonder what you lost. */
  function chooser(all) {
    return '<div class="br-head">' +
        '<h2 class="br-line">' + plural(all.length, 'batch', 'batches') + ' to choose from.</h2>' +
        '<p class="br-sub">Each one is a transcribed sheet waiting to be written into the ' +
        'binder.</p>' +
      '</div>' +
      '<div class="br-picks">' +
        all.map(function (x) {
          var done = x.status === 'pushed';
          return '<a class="br-pick' + (done ? ' done' : '') + '" href="#backroom?batch=' +
            encodeURIComponent(x.slug) + '" data-slug="' + esc(x.slug) + '">' +
            '<span class="bp-t">' + esc(x.label || x.slug) + '</span>' +
            '<span class="bp-h">' + esc(x.slug) +
              (done ? ' \u00b7 already pushed' + (x.pushed ? ' ' + esc(x.pushed) : '') : '') +
            '</span></a>';
        }).join('') +
      '</div>';
  }

  /* ---------------------------------------------------------------- PROBLEMS
   * A transcript that did not validate. NO RUN BUTTON — not a disabled one, absent. And the last
   * line names the file, because a screen that reports a data error without saying where the
   * data lives sends the reader hunting through the UI for a setting that does not exist. */
  function problems(slug, list) {
    return '<div class="br-head">' +
        '<h2 class="br-line">This transcript cannot be imported.</h2>' +
        '<p class="br-sub">' + plural(list.length, 'problem', 'problems') + ' in <code>batches/' +
          esc(slug) + '.json</code>. Nothing has been read from the binder and nothing has been ' +
          'sent.</p>' +
      '</div>' +
      '<ul class="br-probs">' +
        list.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') +
      '</ul>' +
      '<p class="hint">These are checked here so they surface now rather than as a failed call ' +
      'halfway through a run \u2014 or, worse, as a silent overwrite that returns success. Fix ' +
      'the file in the repo and reload; there is nothing to change on this screen.</p>';
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
   * "FRONT AND BACK ASSUMED" IS HIS PHRASE AND IT STAYS ON SCREEN — now read from the
   * transcript's own `faces_confidence` rather than counted from the data. v15 inferred it from
   * "are there two distinct sides", which is a different question: a genuinely single-face sheet
   * looked identical to a two-face sheet whose orientation someone had actually confirmed. */
  function headline(B, plan, stamp) {
    return '<div class="br-head">' +
      '<h2 class="br-line">Importing <b>' + plural(B.prints.length, 'print', 'prints') +
        '</b> into <b>' + plural(plan.rows.length, 'scanned slot', 'scanned slots') +
        '</b> over <b>1 sheet</b>' +
        (B.facesAssumed && plan.faces === 2 ? ', front and back assumed' : '') + '.</h2>' +
      '<p class="br-sub">' + esc(B.label) + ' \u00b7 ' + esc(B.source) + '</p>' +
      '<p class="br-mech">' + plan.calls + ' calls \u00b7 ' + plan.dbRows +
        ' database rows \u00b7 ' + plan.newArts + ' new to the catalog' +
        (plan.haveArts ? ', ' + plan.haveArts + ' already known' : '') +
        ' \u00b7 batch ' + esc(B.slug) + ' \u00b7 build ' + esc(stamp) + '</p>' +
      '</div>';
  }

  /* THE TARGET. A screen that writes to a sheet says WHICH sheet, by id, before it does — the
   * difference between a fresh sheet and someone's working one is a single string, and it
   * belongs on screen rather than buried in a data file. */
  function target(B, plan) {
    return '<p class="br-target"><span class="tag">target</span> ' +
      'sheet <code>' + esc(B.sheet.sheet_id) + '</code> \u00b7 titled ' +
      esc(B.sheet.title || '(untitled)') + ' \u00b7 in binder <code>' +
      esc(B.sheet.binder_id) + '</code>' +
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
          '<span class="br-id">' + esc(p.id) +
          /* An inferred title is worth flagging on the row that is about to become permanent.
           * The id is permanent; the name can be changed later, but nobody goes back. */
          (p.confidence === 'inferred' ? ' \u00b7 name inferred' : '') + '</span></td>' +
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
    chooser: chooser,
    problems: problems,
    html: function (B, plan, stamp) {
      return headline(B, plan, stamp) + target(B, plan) + stop(plan) +
             table(plan) + controls(B, plan);
    }
  };
})();
