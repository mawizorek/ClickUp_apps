/* Inciardi Collection — THE BACK ROOM'S PREVIEW. Markup only.
 *
 * ============================================================================
 * WHY THIS SEAM AND NOT THE ONE I NAMED.
 *
 * `backroom.js` reached 16.7KB against a 15KB split line, and `index.html` carries my own
 * commitment that the next feature touching a file at the line arrives as a split rather than an
 * append. I dodged that once already at v14, with a real reason: the seam recorded in the module
 * map is PLAN vs APPLY, and Michael was minutes away from pushing thirty-seven irreversible
 * writes through `apply()`. Restructuring the write path immediately before someone uses it
 * trades a genuine risk for a budget number.
 *
 * That reason has not expired — he still has not run it. But dodging the same split twice is how
 * a rule quietly stops being one, and this app has a documented history of exactly that (the
 * dead `ic_color` read, two structurally-defeated banner checks, the manual deploy button).
 *
 * So: A DIFFERENT SEAM, chosen because it is FREE. Everything here is pure string assembly — a
 * function of (batch, plan) with no state, no network and no side effects. `apply`, `chain` and
 * `log` are byte-identical after this commit. The write path cannot be affected by a change to a
 * file that only builds HTML.
 *
 * WHY IT IS NOT A CONSOLATION PRIZE: this is also the half that CHANGES. Every note Michael has
 * given the back room has been about what the screen SAYS, never about how it writes. The
 * churning part and the dangerous part were in one file, and now they are not.
 *
 * ⚠️ THE PLAN/APPLY SEAM IS STILL THE RIGHT ONE and is still recorded in the module map. Whoever
 * adds the next real feature here should take the expensive half, on a day when nobody is
 * mid-import.
 * ============================================================================
 *
 * ZERO DECISIONS LIVE HERE. Every number and every verdict is computed in `backroom.js` →
 * build() and arrives on `plan`. If this file ever starts working something out for itself,
 * there are two places deciding what the run will do, and they will eventually disagree.
 *
 * THREE IDS ARE A CONTRACT with backroom.js → wire(): `brRun`, `brRecheck`, `brOverride`.
 * Renaming one here silently unwires it there, and the symptom is a button that looks fine and
 * does nothing.
 */
(function () {

  function esc(s) { return Core.esc(s); }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  /* ============================================================ THE HEADLINE
   * Michael, 2026-07-31: "its a little misleading to say it as that number cos to me it seems
   * like 18 since i gave you two full filled sheets of 9... it really should be headlined as
   * 'importing 18 prints into 18 scanned slots over 1 sheet assumed front/back'."
   *
   * 🔴 HE IS RIGHT, AND THE OLD BUTTON WAS WORSE THAN MISLEADING — IT WAS WRONG. It read "Write
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
   * "FRONT AND BACK ASSUMED" IS HIS PHRASE AND IT STAYS ON SCREEN. Even after the v14 swap,
   * WHICH face is the front remains an assumption — no photograph of a loose sheet says. The
   * screen keeps admitting that at the moment of writing, rather than only in a code comment
   * nobody reads at 10am. */
  function headline(B, plan, stamp) {
    return '<div class="br-head">' +
      '<h2 class="br-line">Importing <b>' + plural(B.prints.length, 'print', 'prints') +
        '</b> into <b>' + plural(plan.rows.length, 'scanned slot', 'scanned slots') +
        '</b> over <b>1 sheet</b>' +
        (plan.faces === 2 ? ', front and back assumed' : '') + '.</h2>' +
      '<p class="br-sub">' + esc(B.label) + ' \u00b7 ' + esc(B.source) + '</p>' +
      '<p class="br-mech">' + plan.calls + ' calls \u00b7 ' + plan.dbRows +
        ' database rows \u00b7 ' + plan.newArts + ' new to the catalog' +
        (plan.haveArts ? ', ' + plan.haveArts + ' already known' : '') +
        ' \u00b7 build ' + esc(stamp) + '</p>' +
      '</div>';
  }

  /* THE TARGET. A screen that writes to a sheet says WHICH sheet, by id, before it does — the
   * difference between a fresh sheet and someone's working one is a single string, and it
   * belongs on screen rather than buried in a data file. */
  function target(B, plan) {
    return '<p class="br-target"><span class="tag">target</span> ' +
      'sheet <code>' + esc(B.sheet.sheet_id) + '</code> \u00b7 titled ' +
      esc(B.sheet.title) + ' \u00b7 in binder <code>' + esc(B.sheet.binder_id) + '</code>' +
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
    html: function (B, plan, stamp) {
      return headline(B, plan, stamp) + target(B, plan) + stop(plan) +
             table(plan) + controls(B, plan);
    }
  };
})();
