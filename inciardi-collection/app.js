/* Inciardi Collection — page mounts.
 *
 * The router injects pages/<route>.html with innerHTML, which does not run inline scripts,
 * so each page's behaviour lives here and is attached by App.mount(route).
 *
 * TWO RULES THIS FILE FOLLOWS THROUGHOUT:
 *   1. NO OPTIMISTIC UI. Every write waits for the server, then re-reads. The entire point
 *      of this rebuild is that the screen never claims something the database has not
 *      confirmed. A slot that looks filled because we hoped it worked is the old app.
 *   2. Every count that means "how many do I own" comes from the server's v_owned
 *      (SUM(qty)), never from a length or a COUNT(*) computed here.
 */
(function () {
  var state = { sheets: [], sheetId: null, artworks: [] };

  /* ---------------------------------------------------------------- ENTER */
  function slugPreview(s) {
    return String(s || '').toLowerCase()
      .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
      .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '').slice(0, 64);
  }

  function mountEnter() {
    var f = document.getElementById('enterForm');
    var name = document.getElementById('f_name');
    var idIn = document.getElementById('f_id');
    var idEcho = document.getElementById('idEcho');
    var own = document.getElementById('f_own');
    var qtyWrap = document.getElementById('qtyWrap');
    var out = document.getElementById('enterOut');

    /* Show the derived id live. It is PERMANENT identity, so seeing it before the write
     * beats explaining it after. */
    function echo() {
      var id = idIn.value.trim() || slugPreview(name.value);
      idEcho.textContent = id || '—';
      idEcho.className = 'num' + (/^[0-9-]*$/.test(id) && id ? ' bad-text' : '');
    }
    name.addEventListener('input', echo);
    idIn.addEventListener('input', echo);
    echo();

    own.addEventListener('change', function () { qtyWrap.hidden = !own.checked; });
    qtyWrap.hidden = !own.checked;

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = document.getElementById('enterBtn');
      var payload = {
        name: name.value.trim(),
        artwork_id: idIn.value.trim() || undefined,
        collection_id: document.getElementById('f_collection').value.trim() || undefined,
        category: document.getElementById('f_category').value,
        edition_type: document.getElementById('f_edtype').value,
        retail: document.getElementById('f_retail').value,
        notes: document.getElementById('f_notes').value.trim() || undefined,
        own: own.checked,
        qty: document.getElementById('f_qty').value,
        acquired_where: document.getElementById('f_where').value.trim() || undefined
      };
      if (!payload.name) { Core.toast('Name is required', 'bad'); return; }
      btn.disabled = true; btn.textContent = 'Saving…';
      API.post('/artwork', payload).then(function (d) {
        out.hidden = false;
        var ed = (d.editions || []).map(function (x) { return x.edition_id; }).join(', ');
        out.innerHTML =
          '<b>' + Core.esc(payload.name) + '</b> is canonical.<br>' +
          '<span class="tag">artwork</span> <span class="num">' + Core.esc(d.artwork_id) + '</span><br>' +
          '<span class="tag">edition</span> <span class="num">' + Core.esc(ed) + '</span>' +
          (d.copy_id ? '<br><span class="tag">copy</span> <span class="num">' + Core.esc(d.copy_id) + '</span>' : '') +
          (d.copy_error ? '<br><span class="badge bad">copy failed</span> ' + Core.esc(d.copy_error) : '');
        Core.toast(d.copy_error ? 'Artwork saved, copy failed' : 'Saved', d.copy_error ? 'bad' : 'good');
        f.reset();
        document.getElementById('f_category').value = 'mini';
        qtyWrap.hidden = true; echo(); name.focus();
        state.artworks = [];   // force a re-read; the picker must not serve a stale list
      }).catch(function (err) {
        Core.toast(err.message, 'bad');
      }).then(function () {
        btn.disabled = false; btn.textContent = 'Save print';
      });
    });
  }

  /* --------------------------------------------------------------- BINDER */
  function loadArtworks() {
    if (state.artworks.length) return Promise.resolve(state.artworks);
    return API.get('/artworks').then(function (d) { state.artworks = d.artworks || []; return state.artworks; });
  }

  function slotCell(sheetId, side, pos, row) {
    var id = 'sl_' + side + pos;
    if (!row) {
      // EMPTY = no row exists. This is a placeholder for a record that isn't there.
      return '<button class="slot empty" id="' + id + '" data-side="' + side + '" data-pos="' + pos +
             '" title="Add a print here">+</button>';
    }
    var st = row.state;                       // derived server-side: owned | wanted | note
    if (st === 'note') {
      return '<button class="slot note" id="' + id + '" data-side="' + side + '" data-pos="' + pos +
             '" data-slot="' + Core.esc(row.slot_id) + '">' +
             '<span class="nm">' + Core.esc(row.note) + '</span>' +
             '<span class="meta">note</span></button>';
    }
    // Only a real, non-implicit label ever renders as a badge. An implicit edition must
    // never show as "#1" (Q1).
    var badge = (row.edition_label && !row.edition_implicit)
      ? '<span class="ed">' + Core.esc(row.edition_label) + '</span> ' : '';
    /* own N · placed M — never a bare number. One owned print placed three times must not
     * read as three owned; that is the condition Beckett's imprecision was accepted on. */
    var meta = badge + 'own ' + row.qty_owned + ' · placed ' + row.placed_count;
    return '<button class="slot ' + st + '" id="' + id + '" data-side="' + side + '" data-pos="' + pos +
           '" data-slot="' + Core.esc(row.slot_id) + '">' +
           '<span class="tile">' + Core.esc(Core.initials(row.artwork_name)) + '</span>' +
           '<span class="nm">' + Core.esc(row.artwork_name) + '</span>' +
           '<span class="meta">' + meta + '</span></button>';
  }

  function sheetIndex() {
    for (var i = 0; i < state.sheets.length; i++) {
      if (state.sheets[i].sheet_id === state.sheetId) return i;
    }
    return -1;
  }

  function renderSheet(slots) {
    var byKey = {};
    slots.forEach(function (r) { byKey[r.side + r.position] = r; });
    var used = slots.length;
    var ownedN = slots.filter(function (r) { return r.state === 'owned'; }).length;
    var wantN  = slots.filter(function (r) { return r.state === 'wanted'; }).length;

    var pos = sheetIndex();
    var sheet = state.sheets[pos] || {};
    /* Position in the binder, 1-based FOR READING ONLY. Stored sheet_order is 0-based and the
     * sheet_id may say anything at all — `mini-binder-s1` is the SECOND sheet, because ids
     * were minted from the 0-based order and are permanent. Never show an id as a position. */
    var where = pos < 0 ? '' :
      '<span class="tag">sheet ' + (pos + 1) + ' of ' + state.sheets.length + '</span>';

    var head = '<div class="sheet-head">' +
      '<span class="name">' + Core.esc(sheet.title || state.sheetId || 'Sheet') + '</span>' +
      where +
      '<span class="num">' + used + ' / 18</span>' +
      '<span class="meter"><span style="width:' + Math.round(used / 18 * 100) + '%"></span></span>' +
      '<span class="tag">' + ownedN + ' owned · ' + wantN + ' wanted · ' + (18 - used) + ' empty</span>' +
      '</div>';

    var sides = ['A', 'B'].map(function (side) {
      var cells = '';
      for (var p = 0; p < 9; p++) cells += slotCell(state.sheetId, side, p, byKey[side + p]);
      return '<div class="side"><span class="tag">Side ' + side + '</span>' +
             '<div class="slots">' + cells + '</div></div>';
    }).join('');

    document.getElementById('sheetWrap').innerHTML = head + '<div class="sides">' + sides + '</div>';

    [].forEach.call(document.querySelectorAll('.slot'), function (b) {
      b.addEventListener('click', function () {
        openPicker(b.getAttribute('data-side'), +b.getAttribute('data-pos'), b.getAttribute('data-slot'));
      });
    });
  }

  /* Inline picker, deliberately NOT a modal. It does BOTH jobs from one control:
   * choose a known artwork, or type a new name and get artwork + edition + placement in
   * one gesture. That is J2 ruling 4 — a slot card IS the entry surface. */
  function openPicker(side, pos, slotId) {
    var host = document.getElementById('pickWrap');
    host.hidden = false;
    host.innerHTML = '<div class="empty">Loading prints…</div>';
    loadArtworks().then(function (list) {
      var opts = list.map(function (a) {
        return '<option value="' + Core.esc(a.artwork_id) + '">' + Core.esc(a.name) +
               ' — own ' + a.qty_owned + (a.placed_count ? ' · placed ' + a.placed_count : '') + '</option>';
      }).join('');
      host.innerHTML =
        '<h2>Sheet · side ' + side + ' · slot ' + (pos + 1) + '</h2>' +
        '<label for="p_pick">Known print</label>' +
        '<select id="p_pick"><option value="">— choose —</option>' + opts + '</select>' +
        '<label for="p_new">…or a print not in the catalog yet</label>' +
        '<input id="p_new" placeholder="e.g. Radish Bunch">' +
        '<div class="check"><input type="checkbox" id="p_own" checked>' +
        '<label for="p_own">I have this one</label></div>' +
        '<label for="p_note">…or just a note in this slot</label>' +
        '<input id="p_note" placeholder="e.g. save for a trade">' +
        '<div class="row"><button id="p_save" class="primary">Place</button>' +
        (slotId ? '<button id="p_clear">Clear slot</button>' : '') +
        '<button id="p_cancel" class="ghost">Cancel</button></div>' +
        '<p class="hint">Placing a print you already have elsewhere is fine — the same print may sit in several slots. Every card reads <b>own N · placed M</b>, so a duplicate placement can never masquerade as a duplicate print.</p>';

      document.getElementById('p_cancel').addEventListener('click', function () { host.hidden = true; });
      if (slotId) document.getElementById('p_clear').addEventListener('click', function () {
        API.del('/slot?id=' + encodeURIComponent(slotId)).then(function () {
          Core.toast('Slot cleared', 'good'); host.hidden = true; refreshSlots();
        }).catch(function (e) { Core.toast(e.message, 'bad'); });
      });

      document.getElementById('p_save').addEventListener('click', function () {
        var pick = document.getElementById('p_pick').value;
        var fresh = document.getElementById('p_new').value.trim();
        var note = document.getElementById('p_note').value.trim();
        var btn = document.getElementById('p_save');
        btn.disabled = true; btn.textContent = 'Placing…';

        function place(artwork_id) {
          return API.post('/slot', {
            sheet_id: state.sheetId, side: side, position: pos,
            artwork_id: artwork_id || undefined,
            note: artwork_id ? undefined : (note || undefined)
          });
        }
        var chain;
        if (fresh) {
          // Create then place. Two writes, and the toast says which one failed if either does.
          chain = API.post('/artwork', { name: fresh, own: document.getElementById('p_own').checked })
            .then(function (d) { state.artworks = []; return place(d.artwork_id); });
        } else if (pick) {
          chain = place(pick);
        } else if (note) {
          chain = place(null);
        } else {
          btn.disabled = false; btn.textContent = 'Place';
          Core.toast('Pick a print, type a new name, or write a note', 'bad');
          return;
        }
        chain.then(function () {
          Core.toast('Placed', 'good'); host.hidden = true; refreshSlots();
        }).catch(function (e) {
          Core.toast(e.message, 'bad');
        }).then(function () { btn.disabled = false; btn.textContent = 'Place'; });
      });
    }).catch(function (e) { Core.fail(host, e); });
  }

  function refreshSlots() {
    var wrap = document.getElementById('sheetWrap');
    Core.busy(wrap, 'Loading sheet…');
    API.get('/slots?sheet=' + encodeURIComponent(state.sheetId))
      .then(function (d) { renderSheet(d.slots || []); })
      .catch(function (e) { Core.fail(wrap, e); });
  }

  /* ==================================================== THE SHEET MENU
   * Replaces a <select> of sheets, and the reason is not decoration: a dropdown can only
   * ever answer "which sheet am I looking at". Arranging the binder is a different verb and
   * it had nowhere to live. This panel is that home.
   *
   * SHEET stays the canonical word for the physical thing that moves (Q11, locked in
   * schema.binder.sql). PAGE — one side, derived from sheet order plus A/B — is deliberately
   * NOT built here yet, and the distinction is what makes it worth waiting for: moving a
   * SHEET is one integer per row and ZERO slots touched, while moving a PAGE means
   * re-seating nine prints. One is a reorder, the other is a migration.
   * `v_binder_spread` already derives the page sequence from sheet_order, so this reorder
   * renumbers pages for free the moment that view gets surfaced. Nothing to keep in sync.
   */
  var menuBusy = false;

  function reloadSheets() {
    return API.get('/sheets').then(function (d) {
      state.sheets = d.sheets || [];
      if (!state.sheets.length) { state.sheetId = null; return state.sheets; }
      if (sheetIndex() < 0) state.sheetId = state.sheets[0].sheet_id;
      return state.sheets;
    });
  }

  function paintSheetBtn() {
    var btn = document.getElementById('sheetMenuBtn');
    if (!btn) return;
    var i = sheetIndex();
    var cur = state.sheets[i];
    if (!cur) {
      btn.innerHTML = '<span class="sb-t">No sheets yet</span><span class="sb-c" aria-hidden="true">▾</span>';
      return;
    }
    btn.innerHTML =
      '<span class="sb-n num">' + (i + 1) + '/' + state.sheets.length + '</span>' +
      '<span class="sb-t">' + Core.esc(cur.title || cur.sheet_id) + '</span>' +
      '<span class="sb-f num">' + cur.slots_used + '/18</span>' +
      '<span class="sb-c" aria-hidden="true">▾</span>';
  }

  function setMenuBusy(on, label) {
    menuBusy = on;
    var host = document.getElementById('sheetMenu');
    if (!host) return;
    [].forEach.call(host.querySelectorAll('button'), function (b) { b.disabled = on; });
    var s = document.getElementById('sm_status');
    if (s) { s.textContent = on ? (label || 'Saving…') : ''; s.hidden = !on; }
  }

  function closeSheetMenu() {
    var host = document.getElementById('sheetMenu');
    if (host) host.hidden = true;
    var btn = document.getElementById('sheetMenuBtn');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  function renderSheetMenu() {
    var host = document.getElementById('sheetMenu');
    if (!host) return;
    var n = state.sheets.length;

    var rows = state.sheets.map(function (s, i) {
      var on = s.sheet_id === state.sheetId;
      return '<div class="sheetrow' + (on ? ' on' : '') + '">' +
        '<button class="sr-pick" data-pick="' + Core.esc(s.sheet_id) + '">' +
          '<span class="sr-n num">' + (i + 1) + '</span>' +
          '<span class="sr-t">' + Core.esc(s.title || s.sheet_id) +
            (on ? ' <span class="tag">open</span>' : '') + '</span>' +
          '<span class="sr-f num">' + s.slots_used + '/18</span>' +
        '</button>' +
        '<span class="sr-acts">' +
          '<button class="sr-mv" data-mv="' + i + '" data-dir="-1" aria-label="Move up"' +
            (i === 0 ? ' disabled' : '') + '>&#8593;</button>' +
          '<button class="sr-mv" data-mv="' + i + '" data-dir="1" aria-label="Move down"' +
            (i === n - 1 ? ' disabled' : '') + '>&#8595;</button>' +
          '<button class="sr-re" data-rename="' + Core.esc(s.sheet_id) + '" aria-label="Rename sheet">&#9998;</button>' +
        '</span>' +
      '</div>';
    }).join('');

    host.innerHTML =
      '<h2>Sheets</h2>' +
      '<p class="hint">Tap a sheet to open it. <b>&#8593; &#8595;</b> move it through the binder, <b>&#9998;</b> renames it. A sheet always travels with both its sides, so moving one never disturbs a single print inside it.</p>' +
      (n ? '<div class="sheetlist">' + rows + '</div>'
         : '<div class="empty">No sheets yet. <b>Add sheet</b> starts the binder.</div>') +
      '<p id="sm_status" class="hint" hidden></p>' +
      '<div class="row"><button id="sm_new" class="primary">Add sheet</button>' +
      '<button id="sm_close" class="ghost">Close</button></div>';

    [].forEach.call(host.querySelectorAll('.sr-pick'), function (b) {
      b.addEventListener('click', function () {
        if (menuBusy) return;
        state.sheetId = b.getAttribute('data-pick');
        closeSheetMenu(); paintSheetBtn(); refreshSlots();
      });
    });
    [].forEach.call(host.querySelectorAll('.sr-mv'), function (b) {
      b.addEventListener('click', function () {
        moveSheet(+b.getAttribute('data-mv'), +b.getAttribute('data-dir'));
      });
    });
    [].forEach.call(host.querySelectorAll('.sr-re'), function (b) {
      b.addEventListener('click', function () { renameSheet(b.getAttribute('data-rename')); });
    });
    document.getElementById('sm_close').addEventListener('click', closeSheetMenu);
    document.getElementById('sm_new').addEventListener('click', addSheet);
  }

  /* One press = one server write = one re-read. Deliberately NOT a local shuffle with a
   * "save order" button: a list reordered on screen while holding an unsaved order is the
   * screen asserting something the database has not agreed to, which is rule 1 at the top of
   * this file. The cost is a round trip per tap, and the buttons disable while it is in
   * flight so rapid taps cannot race each other into a scrambled binder. */
  function moveSheet(i, dir) {
    if (menuBusy) return;
    var j = i + dir;
    if (j < 0 || j >= state.sheets.length) return;

    var order = state.sheets.map(function (s) { return s.sheet_id; });
    var tmp = order[i]; order[i] = order[j]; order[j] = tmp;

    setMenuBusy(true, dir < 0 ? 'Moving up…' : 'Moving down…');
    // The WHOLE order goes up, never "move this one": the route validates it as a complete
    // permutation, so a stale list on this device gets REFUSED rather than half-applied.
    API.post('/sheet/reorder', { order: order })
      .then(reloadSheets)
      .then(function () {
        renderSheetMenu(); paintSheetBtn();
        Core.toast('Binder reordered', 'good');
      })
      .catch(function (e) { Core.toast(e.message, 'bad'); })
      .then(function () { setMenuBusy(false); });
  }

  function renameSheet(id) {
    if (menuBusy) return;
    var cur = state.sheets.filter(function (s) { return s.sheet_id === id; })[0] || {};
    var next = prompt('Sheet title?', cur.title || '');
    if (next === null) return;              // cancelled, which is NOT the same as cleared
    setMenuBusy(true, 'Renaming…');
    API.post('/sheet/rename', { sheet_id: id, title: next.trim() })
      .then(reloadSheets)
      .then(function () {
        renderSheetMenu(); paintSheetBtn();
        // The sheet header carries the title too, so it needs repainting or the page keeps
        // showing the old name until the next navigation.
        if (id === state.sheetId) refreshSlots();
        Core.toast('Renamed', 'good');
      })
      .catch(function (e) { Core.toast(e.message, 'bad'); })
      .then(function () { setMenuBusy(false); });
  }

  function addSheet() {
    if (menuBusy) return;
    var title = prompt('Sheet title?', 'Sheet ' + (state.sheets.length + 1));
    if (title === null) return;
    setMenuBusy(true, 'Adding…');
    API.post('/sheet', { title: title.trim() || null })
      .then(reloadSheets)
      .then(function () {
        renderSheetMenu(); paintSheetBtn();
        Core.toast('Sheet added', 'good');
      })
      .catch(function (e) { Core.toast(e.message, 'bad'); })
      .then(function () { setMenuBusy(false); });
  }

  function mountBinder() {
    var wrap = document.getElementById('sheetWrap');
    var btn = document.getElementById('sheetMenuBtn');
    Core.busy(wrap, 'Loading binder…');

    btn.addEventListener('click', function () {
      var host = document.getElementById('sheetMenu');
      if (!host.hidden) { closeSheetMenu(); return; }
      renderSheetMenu();
      host.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
    });
    document.addEventListener('keydown', function (e) {
      var host = document.getElementById('sheetMenu');
      if (e.key === 'Escape' && host && !host.hidden && !menuBusy) closeSheetMenu();
    });

    reloadSheets().then(function () {
      paintSheetBtn();
      if (!state.sheets.length) {
        wrap.innerHTML = '<div class="empty">No sheets yet. Open the sheet menu above and <b>Add sheet</b> to start the binder.</div>';
        return;
      }
      refreshSlots();
    }).catch(function (e) { Core.fail(wrap, e); });
  }

  /* -------------------------------------------------------------- SHOEBOX
   * TWO groups, because they answer two different questions and Michael asked for both
   * without losing either:
   *   unhoused → none of this print is in the binder. The ORIGINAL shoe-box question,
   *              unchanged, so the old meaning is intact.
   *   spare    → one is on a sheet, N more are still in the box.
   * `spare` is SUBTRACTION (own − placed), not allocation: nothing in the schema records
   * which physical copy sits where, and nothing needs to. See the /shoebox route comment
   * for why that needed no schema change, contrary to the old note in views.sql.
   */
  function boxRow(r) {
    var right = r.box_state === 'spare'
      ? '<span class="badge good">' + r.spare + ' spare</span> ' +
        '<span class="badge">' + r.placed_count + ' in binder</span>'
      : '<span class="badge good">own ' + r.qty_owned + '</span>';
    return '<div class="item">' +
      '<span class="tile">' + Core.esc(Core.initials(r.name)) + '</span>' +
      '<span class="body"><b class="nm">' + Core.esc(r.name) + '</b>' +
      '<span class="tag">' + Core.esc(r.artwork_id) + (r.category ? ' · ' + Core.esc(r.category) : '') + '</span></span>' +
      '<span class="right">' + right + '</span>' +
      '</div>';
  }

  function boxGroup(title, sub, rows) {
    return '<div class="boxgroup">' +
      '<div class="bg-head"><span class="name">' + Core.esc(title) + '</span>' +
      '<span class="num">' + rows.length + '</span></div>' +
      '<p class="hint">' + sub + '</p>' +
      '<div class="list">' + rows.map(boxRow).join('') + '</div></div>';
  }

  function mountShoebox() {
    var wrap = document.getElementById('boxWrap');
    Core.busy(wrap, 'Loading shoe-box…');
    API.get('/shoebox').then(function (d) {
      var rows = d.shoebox || [];
      if (!rows.length) {
        wrap.innerHTML = '<div class="empty">The box is empty. Every copy you own is in a slot.</div>';
        return;
      }
      var unhoused = rows.filter(function (r) { return r.box_state === 'unhoused'; });
      var spare    = rows.filter(function (r) { return r.box_state === 'spare'; });
      var html = '';
      if (unhoused.length) {
        html += boxGroup('Not in the binder yet',
          'None of these is on a sheet — they have no place in the binder at all.', unhoused);
      }
      if (spare.length) {
        html += boxGroup('Spares',
          'These are laid out in the binder already. The count is what is left over in the box.', spare);
      }
      wrap.innerHTML = html;
    }).catch(function (e) { Core.fail(wrap, e); });
  }

  window.App = {
    mount: function (route) {
      if (route === 'enter')   return mountEnter();
      if (route === 'binder')  return mountBinder();
      if (route === 'shoebox') return mountShoebox();
    }
  };
})();
