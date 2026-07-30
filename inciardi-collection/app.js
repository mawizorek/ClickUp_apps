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
 *
 * ============================================================================
 * VOCABULARY — FRONT / BACK IN THE UI, 'A' / 'B' IN THE DATA. Michael, 2026-07-30.
 *
 * Every label a person reads says FRONT or BACK, because that is what the physical object
 * has. Every value that crosses the wire or lands in a row is still 'A' or 'B':
 *   - `slot.side` carries CHECK (side IN ('A','B')) — a 'FRONT' would be an unwriteable row.
 *   - `v_binder_spread` computes side_index from CASE sd.side WHEN 'A'.
 *   - Six rows already exist keyed on 'A'/'B'.
 * So this is a DISPLAY MAPPING and nothing else. `FACE_LABEL` below is the only place the
 * two vocabularies meet. Do not "finish the rename" by pushing it into the schema: renaming
 * a CHECK constraint's domain means rewriting every row, every view, and the composite FK
 * path, to change a word nobody sees.
 * ============================================================================ */
(function () {
  var state = { sheets: [], sheetId: null, artworks: [], side: 'A', slots: [] };

  // The ONE seam between the stored value and the word on screen.
  var FACE_LABEL = { A: 'Front', B: 'Back' };

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

  /* ONE CARD.
   *
   * The v4 card stacked a 4:5 plate, then the name, then two monospace lines. Three across a
   * 390px phone made each card ~230px tall, so a side was ~700px and nine cards could never
   * be on screen together. The caption now sits ON the plate as a band: same information,
   * roughly half the height, and it is the layout that lets a whole side fit the frame.
   */
  function slotCell(side, pos, row) {
    var base = 'data-side="' + side + '" data-pos="' + pos + '"';
    var where = FACE_LABEL[side].toLowerCase() + ', slot ' + (pos + 1);

    // EMPTY = no row exists. Absence is the state; this is a placeholder, not a record.
    if (!row) {
      return '<button class="slot empty" ' + base +
             ' aria-label="Empty ' + where + '">+</button>';
    }

    var slot = ' data-slot="' + Core.esc(row.slot_id) + '"';

    if (row.state === 'note') {
      return '<button class="slot note" ' + base + slot + '>' +
        '<span class="n-lab">note</span>' +
        '<span class="n-txt">' + Core.esc(row.note) + '</span></button>';
    }

    /* 🔴 own N · placed M — the locked legibility rule, implemented differently, NOT relaxed.
     * schema.binder.sql permits one artwork in several slots, on the stated condition that a
     * card can never read as owning more than you do. v4 met that by printing the string on
     * every card, which made diagnostics the loudest thing on a nine-card grid.
     * Here the exact string appears whenever the numbers could mislead — any card where
     * qty_owned is not 1 or placed_count is not 1 — and the ordinary case says nothing,
     * because a solid card in a slot already means "owned, and it is here."
     * `wanted` gets the word instead of "own 0 · placed 1", which is the same fact stated
     * better: you own none of it. */
    var sub = '';
    if (row.state === 'wanted') {
      sub = 'wanted';
    } else if (row.qty_owned !== 1 || row.placed_count !== 1) {
      sub = 'own ' + row.qty_owned + ' · placed ' + row.placed_count;
    }

    // Only a real, non-implicit label ever renders as a badge. An implicit edition must never
    // show as "#1" (Q1).
    var ed = (row.edition_label && !row.edition_implicit)
      ? '<span class="ed">' + Core.esc(row.edition_label) + '</span>' : '';

    return '<button class="slot ' + row.state + '" ' + base + slot + '>' + ed +
      '<span class="plate"><span class="ini">' + Core.esc(Core.initials(row.artwork_name)) + '</span></span>' +
      '<span class="cap"><span class="nm">' + Core.esc(row.artwork_name) + '</span>' +
      (sub ? '<span class="c-sub">' + Core.esc(sub) + '</span>' : '') +
      '</span></button>';
  }

  function sheetIndex() {
    for (var i = 0; i < state.sheets.length; i++) {
      if (state.sheets[i].sheet_id === state.sheetId) return i;
    }
    return -1;
  }

  /* Paint BOTH faces. Both stay in the DOM because the flip needs something to reveal;
   * backface-visibility keeps the hidden one un-tappable. */
  function renderFaces() {
    var byKey = {};
    state.slots.forEach(function (r) { byKey[r.side + r.position] = r; });

    ['A', 'B'].forEach(function (side) {
      var mine = state.slots.filter(function (r) { return r.side === side; });
      var used = mine.length;
      var owned = mine.filter(function (r) { return r.state === 'owned'; }).length;
      var want = mine.filter(function (r) { return r.state === 'wanted'; }).length;

      var cells = '';
      for (var p = 0; p < 9; p++) cells += slotCell(side, p, byKey[side + p]);

      // The side's own tally, stated compactly. Zeroes are omitted rather than printed as
      // "0 wanted", which is noise dressed as information.
      var bits = [];
      if (owned) bits.push(owned + ' owned');
      if (want) bits.push(want + ' wanted');
      bits.push((9 - used) + ' open');

      document.getElementById('face' + side).innerHTML =
        '<div class="face-tag"><span class="n"><b>' + FACE_LABEL[side] + '</b></span>' +
        '<span class="n">' + bits.join(' &middot; ') + '</span></div>' +
        '<div class="grid9">' + cells + '</div>';
    });

    bindSlots();
    paintDeck();
  }

  function bindSlots() {
    [].forEach.call(document.querySelectorAll('.slot'), function (b) {
      b.addEventListener('click', function () {
        openPicker(b.getAttribute('data-side'), +b.getAttribute('data-pos'), b.getAttribute('data-slot'));
      });
    });
  }

  function setSide(side) {
    state.side = side;
    var fl = document.getElementById('flipper');
    if (fl) fl.classList.toggle('showB', side === 'B');
    var a = document.getElementById('sideA'), b = document.getElementById('sideB');
    if (a) a.setAttribute('aria-pressed', String(side === 'A'));
    if (b) b.setAttribute('aria-pressed', String(side === 'B'));
    paintDeck();
  }

  function paintDeck() {
    var i = sheetIndex(), n = state.sheets.length, cur = state.sheets[i];
    var t = document.getElementById('sbTitle');
    var f = document.getElementById('sbFill');
    var m = document.getElementById('sbMeter');
    var w = document.getElementById('deckWhere');
    var p = document.getElementById('prevSheet'), nx = document.getElementById('nextSheet');

    if (t) t.textContent = cur ? (cur.title || cur.sheet_id) : 'No sheets yet';
    if (f) f.textContent = cur ? cur.slots_used + '/18' : '';
    if (m) m.style.width = cur ? Math.round(cur.slots_used / 18 * 100) + '%' : '0';
    /* Position is 1-BASED FOR READING ONLY. Stored sheet_order is 0-based and a sheet_id can
     * say anything — `mini-binder-s1` is the SECOND sheet, because ids were minted from the
     * 0-based order and are permanent. Never show an id as a position. */
    if (w) w.textContent = n ? 'sheet ' + (i + 1) + ' of ' + n : '';

    /* The step buttons now say whether there is ANY face left in that direction, not whether
     * there is another SHEET. On sheet 1 front, ‹ is dead; on sheet 1 back it steps back to
     * the front. Matching the arrow keys matters more than matching their own icons: a
     * control that is disabled while the equivalent keystroke still works is a lie. */
    if (p) p.disabled = !canStep(-1);
    if (nx) nx.disabled = !canStep(1);
  }

  /* ---------------------------------------------------- traversal
   * THE BINDER IS ONE SEQUENCE OF FACES, not sheets-with-a-toggle. Michael: "arrow keys
   * should cycle through a/b as well."
   *
   * The v5 keys were ArrowLeft = front, ArrowRight = back — two absolute jumps that did
   * nothing once you were already on that face, and could never leave the sheet. Reading a
   * binder is not like that: you turn one face at a time and eventually you are on the next
   * sheet without having thought about it.
   *
   * So one press = one face, and it flows over the sheet boundary:
   *     sheet 1 front → sheet 1 back → sheet 2 front → sheet 2 back → …
   * which is exactly `v_binder_spread.side_index`, the page order the database already
   * derives. Nothing new is stored; this walks the sequence that was always there.
   *
   * Stepping BACKWARD into a previous sheet lands on its BACK, because that is the face you
   * would physically see. Only the first and last faces in the whole binder are dead ends,
   * and no wrap-around: silently looping from the last face to the first would make "where am
   * I" unanswerable without reading the position line every time.
   */
  function canStep(dir) {
    var i = sheetIndex();
    if (i < 0) return false;
    if (dir > 0) return state.side === 'A' || i < state.sheets.length - 1;
    return state.side === 'B' || i > 0;
  }

  function stepFace(dir) {
    var i = sheetIndex();
    if (i < 0) return;

    if (dir > 0) {
      if (state.side === 'A') { setSide('B'); return; }        // turn the sheet over
      if (i >= state.sheets.length - 1) return;                // last face in the binder
      state.sheetId = state.sheets[i + 1].sheet_id;
      setSide('A');                                            // next sheet, front first
    } else {
      if (state.side === 'B') { setSide('A'); return; }
      if (i <= 0) return;                                      // first face in the binder
      state.sheetId = state.sheets[i - 1].sheet_id;
      setSide('B');            // going back, you see that sheet's BACK
    }
    refreshSlots();
  }

  /* Inline picker, deliberately NOT a modal dialog. It does BOTH jobs from one control:
   * choose a known artwork, or type a new name and get artwork + edition + placement in
   * one gesture. That is J2 ruling 4 — a slot card IS the entry surface. */
  function openPicker(side, pos, slotId) {
    var host = document.getElementById('pickWrap');
    openDrawer(host);
    host.innerHTML = '<div class="empty">Loading prints…</div>';
    loadArtworks().then(function (list) {
      var opts = list.map(function (a) {
        return '<option value="' + Core.esc(a.artwork_id) + '">' + Core.esc(a.name) +
               ' — own ' + a.qty_owned + (a.placed_count ? ' · placed ' + a.placed_count : '') + '</option>';
      }).join('');
      host.innerHTML =
        '<h2>' + FACE_LABEL[side] + ' &middot; slot ' + (pos + 1) + '</h2>' +
        '<p class="hint">Pick a print you know, name a new one, or leave a note.</p>' +
        '<label for="p_pick">Known print</label>' +
        '<select id="p_pick"><option value="">— choose —</option>' + opts + '</select>' +
        '<label for="p_new">…or a print not in the catalog yet</label>' +
        '<input id="p_new" placeholder="e.g. Radish Bunch">' +
        '<div class="check"><input type="checkbox" id="p_own" checked>' +
        '<label for="p_own">I have this one</label></div>' +
        '<label for="p_note">…or just a note in this slot</label>' +
        '<input id="p_note" placeholder="e.g. save for a trade">' +
        '<div class="row"><button id="p_save" class="primary">Place</button>' +
        (slotId ? '<button id="p_clear">Clear</button>' : '') +
        '<button id="p_cancel" class="ghost">Cancel</button></div>' +
        '<p class="hint">Already have it somewhere else? Place it again — a print can sit in ' +
        'several slots, and the card will spell out <b>own N &middot; placed M</b> so it can\'t ' +
        'read as owning more than you do.</p>';

      document.getElementById('p_cancel').addEventListener('click', closeDrawers);
      if (slotId) document.getElementById('p_clear').addEventListener('click', function () {
        API.del('/slot?id=' + encodeURIComponent(slotId)).then(function () {
          Core.toast('Slot cleared', 'good'); closeDrawers(); refreshSlots();
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
          Core.toast('Placed', 'good'); closeDrawers(); refreshSlots();
        }).catch(function (e) {
          Core.toast(e.message, 'bad');
        }).then(function () { btn.disabled = false; btn.textContent = 'Place'; });
      });
    }).catch(function (e) { Core.fail(host, e); });
  }

  function refreshSlots() {
    API.get('/slots?sheet=' + encodeURIComponent(state.sheetId))
      .then(function (d) { state.slots = d.slots || []; renderFaces(); })
      .catch(function (e) {
        state.slots = [];
        var st = document.getElementById('stage');
        if (st) st.innerHTML = '<div class="empty bad"><b>Could not load this sheet.</b><br>' +
          Core.esc(e.message) + '</div>';
        Core.toast(e.message, 'bad');
      });
  }

  /* ---------------------------------------------------- drawers + scrim
   * v4 had no scrim, so a drawer floated over a fully live page with no signal that it was
   * modal and no way to dismiss by tapping away. */
  function openDrawer(el) {
    closeDrawers(true);
    var s = document.getElementById('scrim');
    if (s) s.hidden = false;
    el.hidden = false;
  }
  function closeDrawers(keepScrim) {
    ['sheetMenu', 'legend', 'pickWrap'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.hidden = true;
    });
    var s = document.getElementById('scrim');
    if (s && !keepScrim) s.hidden = true;
    ['sheetMenuBtn', 'legendBtn'].forEach(function (id) {
      var b = document.getElementById(id);
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }

  /* ==================================================== THE SHEET MENU
   * A dropdown could only ever answer "which sheet am I looking at". Arranging the binder is
   * a different verb and had nowhere to live; this panel is that home.
   *
   * SHEET stays the canonical word for the thing that physically moves (Q11). PAGE — one
   * face, numbered from sheet order plus front/back — is deliberately not built: moving a
   * SHEET is one integer per row and zero slots touched, while moving a PAGE means re-seating
   * nine prints. `v_binder_spread.side_index` already derives the sequence, which is also
   * what the arrow traversal above walks.
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

  function setMenuBusy(on, label) {
    menuBusy = on;
    var host = document.getElementById('sheetMenu');
    if (!host) return;
    [].forEach.call(host.querySelectorAll('button'), function (b) { b.disabled = on; });
    var s = document.getElementById('sm_status');
    if (s) { s.textContent = on ? (label || 'Saving…') : ''; s.hidden = !on; }
  }

  function renderSheetMenu() {
    var host = document.getElementById('sheetMenu');
    if (!host) return;
    var n = state.sheets.length;

    var rows = state.sheets.map(function (s, i) {
      var on = s.sheet_id === state.sheetId;
      return '<div class="sheetrow' + (on ? ' on' : '') + '">' +
        '<button class="sr-pick" data-pick="' + Core.esc(s.sheet_id) + '">' +
          '<span class="sr-n">' + (i + 1) + '</span>' +
          '<span class="sr-t">' + Core.esc(s.title || s.sheet_id) + '</span>' +
          '<span class="sr-f">' + s.slots_used + '/18</span>' +
        '</button>' +
        '<span class="sr-acts">' +
          '<button class="sr-mv" data-mv="' + i + '" data-dir="-1" aria-label="Move up"' +
            (i === 0 ? ' disabled' : '') + '>&#8593;</button>' +
          '<button class="sr-mv" data-mv="' + i + '" data-dir="1" aria-label="Move down"' +
            (i === n - 1 ? ' disabled' : '') + '>&#8595;</button>' +
          '<button class="sr-re" data-rename="' + Core.esc(s.sheet_id) + '" aria-label="Rename">&#9998;</button>' +
        '</span>' +
      '</div>';
    }).join('');

    host.innerHTML =
      '<h2>Sheets</h2>' +
      '<p class="hint">A sheet always travels with both its faces, so moving one never ' +
      'disturbs a print inside it.</p>' +
      (n ? '<div class="sheetlist">' + rows + '</div>'
         : '<div class="empty">No sheets yet. <b>Add sheet</b> starts the binder.</div>') +
      '<p id="sm_status" class="hint" hidden></p>' +
      '<div class="row"><button id="sm_new" class="primary">Add sheet</button>' +
      '<button id="sm_close" class="ghost">Close</button></div>';

    [].forEach.call(host.querySelectorAll('.sr-pick'), function (b) {
      b.addEventListener('click', function () {
        if (menuBusy) return;
        state.sheetId = b.getAttribute('data-pick');
        setSide('A');
        closeDrawers(); refreshSlots();
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
    document.getElementById('sm_close').addEventListener('click', closeDrawers);
    document.getElementById('sm_new').addEventListener('click', addSheet);
  }

  /* One press = one server write = one re-read. Deliberately NOT a local shuffle with a
   * "save order" button: a list reordered on screen while holding an unsaved order is the
   * screen asserting something the database has not agreed to, which is rule 1 at the top of
   * this file. Buttons disable in flight so rapid taps cannot race into a scrambled binder. */
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
      .then(function () { renderSheetMenu(); paintDeck(); Core.toast('Binder reordered', 'good'); })
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
      .then(function () { renderSheetMenu(); paintDeck(); Core.toast('Renamed', 'good'); })
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
      .then(function () { renderSheetMenu(); paintDeck(); Core.toast('Sheet added', 'good'); })
      .catch(function (e) { Core.toast(e.message, 'bad'); })
      .then(function () { setMenuBusy(false); });
  }

  function mountBinder() {
    var stage = document.getElementById('stage');

    document.getElementById('sheetMenuBtn').addEventListener('click', function () {
      var host = document.getElementById('sheetMenu');
      if (!host.hidden) { closeDrawers(); return; }
      renderSheetMenu(); openDrawer(host);
      this.setAttribute('aria-expanded', 'true');
    });
    document.getElementById('legendBtn').addEventListener('click', function () {
      var host = document.getElementById('legend');
      if (!host.hidden) { closeDrawers(); return; }
      openDrawer(host);
      this.setAttribute('aria-expanded', 'true');
    });
    document.getElementById('legendClose').addEventListener('click', closeDrawers);
    document.getElementById('scrim').addEventListener('click', function () {
      if (!menuBusy) closeDrawers();
    });

    document.getElementById('sideA').addEventListener('click', function () { setSide('A'); });
    document.getElementById('sideB').addEventListener('click', function () { setSide('B'); });
    // The step buttons walk FACES, same as the arrow keys, so the two can never disagree.
    document.getElementById('prevSheet').addEventListener('click', function () { stepFace(-1); });
    document.getElementById('nextSheet').addEventListener('click', function () { stepFace(1); });

    /* SWIPE TO TURN. The gesture the object implies — and the reason the stage is bounded
     * rather than scrollable: with no vertical scroll to compete with, a horizontal drag is
     * unambiguous. Threshold 45px and the horizontal delta must beat the vertical, so a
     * scroll attempt inside a drawer is never read as a turn. Swipe walks the same face
     * sequence as the keys and the buttons; three inputs, one model. */
    var sx = 0, sy = 0, tracking = false;
    stage.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { tracking = false; return; }
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; tracking = true;
    }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (!tracking) return;
      tracking = false;
      var t = e.changedTouches[0];
      var dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
      stepFace(dx < 0 ? 1 : -1);
    }, { passive: true });

    document.addEventListener('keydown', onBinderKeys);

    reloadSheets().then(function () {
      paintDeck();
      if (!state.sheets.length) {
        stage.innerHTML = '<div class="empty">No sheets yet.<br>' +
          'Open the sheet menu above and <b>Add sheet</b> to start the binder.</div>';
        return;
      }
      setSide('A');
      refreshSlots();
    }).catch(function (e) { Core.fail(stage, e); });
  }

  /* Bound at the document because the stage is not focusable, and removed on route change so
   * the Enter form's own keys are never intercepted. */
  function onBinderKeys(e) {
    if (document.body.className.indexOf('stage') < 0) return;
    var open = ['sheetMenu', 'legend', 'pickWrap'].some(function (id) {
      var el = document.getElementById(id); return el && !el.hidden;
    });
    if (e.key === 'Escape' && open && !menuBusy) { closeDrawers(); return; }
    if (open) return;                       // never turn the sheet behind an open drawer
    if (/^(INPUT|SELECT|TEXTAREA)$/.test((e.target.tagName || ''))) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;   // leave browser history alone

    // One press, one face, straight through the binder. Up/Down do the same thing as
    // Left/Right on purpose: on a two-face object there is no second axis to spend them on,
    // and a key that does nothing reads as broken.
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); stepFace(1); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); stepFace(-1); }
  }

  /* -------------------------------------------------------------- SHOEBOX
   * TWO groups, because they answer two different questions:
   *   unhoused → none of this print is in the binder. The ORIGINAL shoe-box question.
   *   spare    → one is on a sheet, N more are still in the box.
   * `spare` is SUBTRACTION (own − placed), not allocation: nothing records which physical
   * copy sits where, and nothing needs to. See the /shoebox route comment.
   */
  function boxRow(r) {
    var right = r.box_state === 'spare'
      ? '<span class="badge good">' + r.spare + ' spare</span>' +
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
          'These are laid out already. The count is what is left over in the box.', spare);
      }
      wrap.innerHTML = html;
    }).catch(function (e) { Core.fail(wrap, e); });
  }

  window.App = {
    mount: function (route) {
      /* `body.stage` is what locks the binder to the viewport and kills page scroll. Every
       * other route keeps normal document flow, so it has to come off on the way out. */
      document.body.classList.toggle('stage', route === 'binder');
      if (route !== 'binder') document.removeEventListener('keydown', onBinderKeys);

      if (route === 'enter')   return mountEnter();
      if (route === 'binder')  return mountBinder();
      if (route === 'shoebox') return mountShoebox();
    }
  };
})();
