/* Inciardi Collection — THE SHEET MENU. Reorder, rename, add.
 *
 * Extracted from `binder.js` 2026-07-30. A dropdown could only ever answer "which sheet am I
 * looking at"; arranging the binder is a different verb and this panel is its home.
 *
 * SHEET stays the canonical word for the thing that physically moves (Q11). PAGE — one face,
 * numbered from sheet order plus front/back — is deliberately not built here: moving a SHEET is
 * one integer per row and ZERO slots touched, while moving a PAGE means re-seating nine prints.
 * One is a reorder, the other is a migration. `v_binder_spread.side_index` already derives the
 * page sequence, so a reorder renumbers pages for free.
 *
 * STATE: owned by `binder.js`. This module reads it through `Binder.*` and writes through
 * `Binder.reload()` / `Binder.goToSheet()`, never by touching it directly.
 */
(function () {
  var busy = false;

  function $(id) { return document.getElementById(id); }

  function setBusy(on, label) {
    busy = on;
    var host = $('sheetMenu');
    if (!host) return;
    [].forEach.call(host.querySelectorAll('button'), function (b) { b.disabled = on; });
    var s = $('sm_status');
    if (s) { s.textContent = on ? (label || 'Saving\u2026') : ''; s.hidden = !on; }
  }

  function render() {
    var host = $('sheetMenu');
    if (!host) return;
    var list = Binder.sheets();
    var cur = Binder.sheetId();
    var n = list.length;

    var rows = list.map(function (s, i) {
      return '<div class="sheetrow' + (s.sheet_id === cur ? ' on' : '') + '">' +
        '<button class="sr-pick" data-pick="' + Core.esc(s.sheet_id) + '">' +
          '<span class="sr-n">' + (i + 1) + '</span>' +
          '<span class="sr-t">' + Core.esc(s.title || s.sheet_id) + '</span>' +
          '<span class="sr-f">' + s.slots_used + '/18</span>' +
        '</button>' +
        '<span class="sr-acts">' +
          '<button class="sr-mv" data-mv="' + i + '" data-dir="-1" aria-label="Move up"' +
            (i === 0 ? ' disabled' : '') + '>\u2191</button>' +
          '<button class="sr-mv" data-mv="' + i + '" data-dir="1" aria-label="Move down"' +
            (i === n - 1 ? ' disabled' : '') + '>\u2193</button>' +
          '<button class="sr-re" data-rename="' + Core.esc(s.sheet_id) + '" ' +
            'aria-label="Rename">\u270E</button>' +
        '</span></div>';
    }).join('');

    host.innerHTML =
      '<div class="drawer-head"><h2>Sheets</h2>' +
        '<button class="drawer-x" id="sm_close" aria-label="Close">\u2715</button></div>' +
      '<div class="drawer-body">' +
        '<p class="drawer-note">A sheet always travels with both its faces, so moving one ' +
        'never disturbs a print inside it.</p>' +
        (n ? '<div class="sheetlist">' + rows + '</div>'
           : '<div class="empty">No sheets yet. <b>Add sheet</b> starts the binder.</div>') +
        '<p id="sm_status" class="drawer-note" hidden></p>' +
        '<div class="row"><button id="sm_new" class="primary">Add sheet</button></div>' +
      '</div>';

    [].forEach.call(host.querySelectorAll('.sr-pick'), function (b) {
      b.addEventListener('click', function () {
        if (busy) return;
        Binder.goToSheet(b.getAttribute('data-pick'));
        Drawer.closeAll();
      });
    });
    [].forEach.call(host.querySelectorAll('.sr-mv'), function (b) {
      b.addEventListener('click', function () {
        move(+b.getAttribute('data-mv'), +b.getAttribute('data-dir'));
      });
    });
    [].forEach.call(host.querySelectorAll('.sr-re'), function (b) {
      b.addEventListener('click', function () { rename(b.getAttribute('data-rename')); });
    });
    $('sm_close').addEventListener('click', function () { Drawer.closeAll(); });
    $('sm_new').addEventListener('click', add);
  }

  /* One press = one server write = one re-read. Deliberately NOT a local shuffle with a "save
   * order" button: a list reordered on screen while holding an unsaved order is the screen
   * asserting something the database has not agreed to. Buttons disable in flight so rapid taps
   * cannot race into a scrambled binder. */
  function move(i, dir) {
    if (busy) return;
    var list = Binder.sheets();
    var j = i + dir;
    if (j < 0 || j >= list.length) return;

    var order = list.map(function (s) { return s.sheet_id; });
    var tmp = order[i]; order[i] = order[j]; order[j] = tmp;

    setBusy(true, dir < 0 ? 'Moving up\u2026' : 'Moving down\u2026');
    // The WHOLE order goes up, never "move this one": the route validates it as a complete
    // permutation, so a stale list on this device is REFUSED rather than half-applied.
    API.post('/sheet/reorder', { order: order })
      .then(Binder.reload)
      .then(function () { render(); Binder.paintDeck(); Core.toast('Binder reordered', 'good'); })
      .catch(function (e) { Core.toast(e.message, 'bad'); })
      .then(function () { setBusy(false); });
  }

  function rename(id) {
    if (busy) return;
    var cur = Binder.sheets().filter(function (s) { return s.sheet_id === id; })[0] || {};
    var next = prompt('Sheet title?', cur.title || '');
    if (next === null) return;           // cancelled, which is NOT the same as cleared
    setBusy(true, 'Renaming\u2026');
    API.post('/sheet/rename', { sheet_id: id, title: next.trim() })
      .then(Binder.reload)
      .then(function () { render(); Binder.paintDeck(); Core.toast('Renamed', 'good'); })
      .catch(function (e) { Core.toast(e.message, 'bad'); })
      .then(function () { setBusy(false); });
  }

  function add() {
    if (busy) return;
    var title = prompt('Sheet title?', 'Sheet ' + (Binder.sheets().length + 1));
    if (title === null) return;
    setBusy(true, 'Adding\u2026');
    API.post('/sheet', { title: title.trim() || null })
      .then(Binder.reload)
      .then(function () { render(); Binder.paintDeck(); Core.toast('Sheet added', 'good'); })
      .catch(function (e) { Core.toast(e.message, 'bad'); })
      .then(function () { setBusy(false); });
  }

  window.Sheets = {
    open: function () {
      var host = $('sheetMenu');
      if (!host.hidden) { Drawer.closeAll(); return; }
      render();
      Drawer.open(host);
      var b = $('sheetMenuBtn');
      if (b) b.setAttribute('aria-expanded', 'true');
    }
  };
})();
