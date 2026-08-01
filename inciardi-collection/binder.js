/* Inciardi Collection — THE STAGE. Faces, cards, turning.
 *
 * 26KB → 14KB. The sheet menu moved to `sheets.js`, the slot picker to `picker.js`, and the
 * drawer plumbing to `core.js`. Seams are the ones the standard names: render modules by
 * screen, shared helpers extracted, one owner per piece of state.
 *
 * TWO RULES:
 *   1. NO OPTIMISTIC UI. Every write waits for the server, then re-reads.
 *   2. Every "how many do I own" comes from the server (v_owned, SUM(qty)), never a length or
 *      a COUNT(*) computed here.
 *
 * ============================================================================
 * VOCABULARY — FRONT / BACK IN THE UI, 'A' / 'B' IN THE DATA. Michael, 2026-07-30.
 *
 * `slot.side` carries CHECK (side IN ('A','B')), and `v_binder_spread` computes side_index
 * from CASE sd.side WHEN 'A'. A 'FRONT' would be an unwriteable row. `FACE` below is the ONLY
 * place the two vocabularies meet — do not "finish the rename" into the schema.
 * ============================================================================
 *
 * STATE OWNERSHIP: this module owns `state`. `sheets.js` and `picker.js` read it and act on it
 * through the exported API at the bottom, rather than each keeping a copy. One owner, because
 * two copies of "which sheet am I on" is the drift this app exists to refuse.
 */
(function () {
  var state = { sheets: [], sheetId: null, artworks: [], side: 'A', slots: [] };
  var FACE = { A: 'Front', B: 'Back' };

  function $(id) { return document.getElementById(id); }

  /* The picker's artwork list is cached — opening nine slots should not be nine identical
   * reads. Cleared by whoever changes the catalog (see the exports). */
  function artworks() {
    if (state.artworks.length) return Promise.resolve(state.artworks);
    return API.get('/artworks').then(function (d) {
      state.artworks = d.artworks || [];
      return state.artworks;
    });
  }

  function sheetIndex() {
    for (var i = 0; i < state.sheets.length; i++) {
      if (state.sheets[i].sheet_id === state.sheetId) return i;
    }
    return -1;
  }

  /* ---------------------------------------------------------------- THE PLATE (v21)
   * 🔴 THE INITIALS ARE NOT REPLACED BY THE PHOTO — THE PHOTO SITS ON TOP OF THEM.
   *
   * `onerror="this.remove()"` drops the image and the initials are revealed underneath, which is
   * Image Rendering Law rule 7 doing real work rather than sitting in a comment: a BROKEN photo
   * and a print with NO photo must not look the same, and neither may look like a card that
   * failed to render. A grey box would collapse all three into one appearance.
   *
   * ⭐ `image_id` IS DERIVED BY THE WORKER, not chosen here (reads.js → displayImage). The client
   * does not rank photos, exactly as it does not count copies — one ranking, computed once, so
   * the binder and the Collection matrix can never disagree about which photo a print HAS.
   */
  function plate(row) {
    var ini = '<span class="ini">' + Core.esc(Core.initials(row.artwork_name)) + '</span>';
    if (!row.image_id) return '<span class="plate">' + ini + '</span>';
    return '<span class="plate">' + ini +
      '<img class="pl-img" loading="lazy" alt="" src="' +
      Core.esc(API.base() + '/image/' + encodeURIComponent(row.image_id)) +
      '" onerror="this.remove()"></span>';
  }

  /* ---------------------------------------------------------------- ONE CARD
   * The v4 card stacked a 4:5 plate, then the name, then two mono lines — ~230px tall, so nine
   * could never share a screen. The caption sits ON the plate as a band: same information,
   * half the height, and that is what lets a whole face fit the frame. */
  function card(side, pos, row) {
    var at = 'data-side="' + side + '" data-pos="' + pos + '"';

    // EMPTY = no row exists. Absence is the state; this is a placeholder, not a record.
    if (!row) {
      return '<button class="slot empty" ' + at + ' aria-label="Empty ' +
        FACE[side].toLowerCase() + ', slot ' + (pos + 1) + '">+</button>';
    }

    var sid = ' data-slot="' + Core.esc(row.slot_id) + '"';

    if (row.state === 'note') {
      return '<button class="slot note" ' + at + sid + '>' +
        '<span class="n-lab">note</span>' +
        '<span class="n-txt">' + Core.esc(row.note) + '</span></button>';
    }

    /* 🔴 own N · placed M — the locked legibility rule, implemented differently, NOT relaxed.
     * The schema permits one artwork in several slots on the condition that a card can never
     * read as owning more than you do. v4 met that by printing the string on EVERY card, which
     * made diagnostics the loudest thing on the grid. Here the exact string appears only when
     * the numbers could mislead; the ordinary case says nothing, because a solid card in a slot
     * already means "owned, and it is here." `wanted` gets the word instead of "own 0 · placed
     * 1": same fact, stated better. Do NOT reinstate it everywhere or reduce it to a count. */
    var sub = '';
    if (row.state === 'wanted') sub = 'wanted';
    else if (row.qty_owned !== 1 || row.placed_count !== 1) {
      sub = 'own ' + row.qty_owned + ' \u00b7 placed ' + row.placed_count;
    }

    // Only a real, non-implicit label renders as a badge — an implicit edition must never show
    // as "#1" (Q1).
    var ed = (row.edition_label && !row.edition_implicit)
      ? '<span class="ed">' + Core.esc(row.edition_label) + '</span>' : '';

    return '<button class="slot ' + row.state + '" ' + at + sid + '>' + ed +
      plate(row) +
      '<span class="cap"><span class="nm">' + Core.esc(row.artwork_name) + '</span>' +
      (sub ? '<span class="c-sub">' + Core.esc(sub) + '</span>' : '') +
      '</span></button>';
  }

  /* Paint BOTH faces. Both stay in the DOM because the flip needs something to reveal;
   * backface-visibility keeps the hidden one un-tappable, so no pointer-events juggling. */
  function paintFaces() {
    var byKey = {};
    state.slots.forEach(function (r) { byKey[r.side + r.position] = r; });

    ['A', 'B'].forEach(function (side) {
      var mine = state.slots.filter(function (r) { return r.side === side; });
      var owned = mine.filter(function (r) { return r.state === 'owned'; }).length;
      var want = mine.filter(function (r) { return r.state === 'wanted'; }).length;

      var cells = '';
      for (var p = 0; p < 9; p++) cells += card(side, p, byKey[side + p]);

      // Zeroes omitted rather than printed as "0 wanted" — noise dressed as information.
      var bits = [];
      if (owned) bits.push(owned + ' owned');
      if (want) bits.push(want + ' wanted');
      bits.push((9 - mine.length) + ' open');

      $('face' + side).innerHTML =
        '<div class="face-tag"><span class="n"><b>' + FACE[side] + '</b></span>' +
        '<span class="n">' + bits.join(' \u00b7 ') + '</span></div>' +
        '<div class="grid9">' + cells + '</div>';
    });

    [].forEach.call(document.querySelectorAll('.slot'), function (b) {
      b.addEventListener('click', function () {
        Picker.open(b.getAttribute('data-side'), +b.getAttribute('data-pos'),
                    b.getAttribute('data-slot'));
      });
    });
    paintDeck();
  }

  function setSide(side) {
    state.side = side;
    var fl = $('flipper');
    if (fl) fl.classList.toggle('showB', side === 'B');
    var a = $('sideA'), b = $('sideB');
    if (a) a.setAttribute('aria-pressed', String(side === 'A'));
    if (b) b.setAttribute('aria-pressed', String(side === 'B'));
    paintDeck();
  }

  function paintDeck() {
    var i = sheetIndex(), n = state.sheets.length, cur = state.sheets[i];
    var t = $('sbTitle'), f = $('sbFill'), m = $('sbMeter'), w = $('deckWhere');

    if (t) t.textContent = cur ? (cur.title || cur.sheet_id) : 'No sheets yet';
    if (f) f.textContent = cur ? cur.slots_used + '/18' : '';
    if (m) m.style.width = cur ? Math.round(cur.slots_used / 18 * 100) + '%' : '0';
    /* 1-BASED FOR READING ONLY. Stored sheet_order is 0-based and a sheet_id can say anything —
     * `mini-binder-s1` is the SECOND sheet. Never show an id as a position.
     * This is also a BUTTON now (see pages/binder.html): it says what the sheet menu is about,
     * so it opens the sheet menu. Empty binder = nothing to choose from, so it disables rather
     * than opening a menu of nothing. */
    if (w) {
      w.textContent = n ? 'sheet ' + (i + 1) + ' of ' + n : '';
      w.disabled = !n;
      w.setAttribute('aria-label', n
        ? 'Sheet ' + (i + 1) + ' of ' + n + '. Choose a sheet.'
        : 'No sheets yet');
    }

    /* The step buttons report whether ANY face remains in that direction, not another SHEET.
     * A control that greys out while the equivalent keystroke still works is a lie. */
    var p = $('prevSheet'), nx = $('nextSheet');
    if (p) p.disabled = !canStep(-1);
    if (nx) nx.disabled = !canStep(1);
  }

  /* ---------------------------------------------------------------- TRAVERSAL
   * THE BINDER IS ONE SEQUENCE OF FACES, not sheets-with-a-toggle. One press = one face,
   * flowing over the sheet boundary:
   *     sheet 1 front → sheet 1 back → sheet 2 front → sheet 2 back → …
   * which is exactly `v_binder_spread.side_index`, the page order the database already derives.
   * Nothing new is stored; this walks the sequence that was always there.
   *
   * Stepping BACKWARD lands on the previous sheet's BACK, because that is the face you would
   * physically see. No wrap-around: looping last→first makes "where am I" unanswerable. */
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
      if (state.side === 'A') { setSide('B'); return; }     // turn the sheet over
      if (i >= state.sheets.length - 1) return;             // last face in the binder
      state.sheetId = state.sheets[i + 1].sheet_id;
      setSide('A');                                         // next sheet, front first
    } else {
      if (state.side === 'B') { setSide('A'); return; }
      if (i <= 0) return;                                   // first face in the binder
      state.sheetId = state.sheets[i - 1].sheet_id;
      setSide('B');
    }
    refresh();
  }

  /* ---------------------------------------------------------------- DATA */
  function reload() {
    return API.get('/sheets').then(function (d) {
      state.sheets = d.sheets || [];
      if (!state.sheets.length) { state.sheetId = null; return state.sheets; }
      if (sheetIndex() < 0) state.sheetId = state.sheets[0].sheet_id;
      return state.sheets;
    });
  }

  function refresh() {
    return API.get('/slots?sheet=' + encodeURIComponent(state.sheetId))
      .then(function (d) { state.slots = d.slots || []; paintFaces(); })
      .catch(function (e) {
        state.slots = [];
        var st = $('stage');
        if (st) st.innerHTML = '<div class="empty bad"><b>Could not load this sheet.</b><br>' +
          Core.esc(e.message) + '</div>';
        Core.toast(e.message, 'bad');
      });
  }

  /* Bound at the document because the stage is not focusable. app.js detaches it on route
   * change — the listener outlives the route, so this module cannot clean it up itself. */
  function keys(e) {
    if (document.body.className.indexOf('stage') < 0) return;
    if (Drawer.anyOpen()) {
      if (e.key === 'Escape') Drawer.closeAll();
      return;                                   // never turn a sheet behind an open drawer
    }
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName || '')) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;      // leave browser history alone

    // Up/Down do the same as Left/Right on purpose: on a two-face object there is no second
    // axis to spend them on, and a key that does nothing reads as broken.
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); stepFace(1); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); stepFace(-1); }
  }

  /* params: { sheet, side } from a deep link like #binder?sheet=sheet-1&side=B, which is what
   * every Summary link points at. An unknown sheet id falls through to the first sheet rather
   * than erroring — a stale bookmark should open the binder, not a dead end. */
  function mount(params) {
    var stage = $('stage');

    /* TWO DOORS, ONE ROOM. The sheet TITLE at the top and the POSITION READOUT at the bottom
     * both open the sheet menu, because both of them name it. Same call, not a copy of the
     * open logic — a second opener is how two panels end up disagreeing about which is open. */
    function openSheets() { Sheets.open(); }
    $('sheetMenuBtn').addEventListener('click', openSheets);
    $('deckWhere').addEventListener('click', openSheets);

    $('legendBtn').addEventListener('click', function () {
      var l = $('legend');
      if (!l.hidden) { Drawer.closeAll(); return; }
      Drawer.open(l);
      this.setAttribute('aria-expanded', 'true');
    });
    $('legendClose').addEventListener('click', function () { Drawer.closeAll(); });
    $('pageScrim').addEventListener('click', function () { Drawer.closeAll(); });

    $('sideA').addEventListener('click', function () { setSide('A'); });
    $('sideB').addEventListener('click', function () { setSide('B'); });
    // Step buttons walk FACES, same as the keys and a swipe, so the three cannot disagree.
    $('prevSheet').addEventListener('click', function () { stepFace(-1); });
    $('nextSheet').addEventListener('click', function () { stepFace(1); });

    /* SWIPE TO TURN — the payoff of a bounded stage: with no vertical scroll competing, a
     * horizontal drag is unambiguous. 45px, and the horizontal delta must beat the vertical. */
    var sx = 0, sy = 0, live = false;
    stage.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { live = false; return; }
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; live = true;
    }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (!live) return;
      live = false;
      var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
      stepFace(dx < 0 ? 1 : -1);
    }, { passive: true });

    document.addEventListener('keydown', keys);

    reload().then(function () {
      paintDeck();
      if (!state.sheets.length) {
        stage.innerHTML = '<div class="empty">No sheets yet.<br>' +
          'Open the sheet menu above and <b>Add sheet</b> to start the binder.</div>';
        return;
      }
      var want = params && params.sheet;
      if (want && state.sheets.some(function (s) { return s.sheet_id === want; })) {
        state.sheetId = want;
      }
      setSide(params && params.side === 'B' ? 'B' : 'A');
      refresh();
    }).catch(function (e) { Core.fail(stage, e); });
  }

  /* THE EXPORTS. Each is here for a stated reason, not for convenience:
   *   mount / keys        — route entry, and the listener app.js must detach.
   *   invalidateArtworks  — enter.js calls it after a save; this module owns the cached list.
   *   sheets / sheetId / side / index  — read access for sheets.js and picker.js.
   *   goToSheet / reload / refresh / paintDeck  — the writes those two modules need, so they
   *                       never mutate `state` directly. One owner. */
  window.Binder = {
    mount: mount,
    keys: keys,
    artworks: artworks,
    invalidateArtworks: function () { state.artworks = []; },
    sheets: function () { return state.sheets; },
    sheetId: function () { return state.sheetId; },
    side: function () { return state.side; },
    index: sheetIndex,
    face: function (s) { return FACE[s]; },
    goToSheet: function (id) { state.sheetId = id; setSide('A'); refresh(); },
    reload: reload,
    refresh: refresh,
    paintDeck: paintDeck
  };
})();
