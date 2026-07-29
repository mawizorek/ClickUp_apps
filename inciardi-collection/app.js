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

  function renderSheet(slots) {
    var byKey = {};
    slots.forEach(function (r) { byKey[r.side + r.position] = r; });
    var used = slots.length;
    var ownedN = slots.filter(function (r) { return r.state === 'owned'; }).length;
    var wantN  = slots.filter(function (r) { return r.state === 'wanted'; }).length;

    var sheet = state.sheets.filter(function (s) { return s.sheet_id === state.sheetId; })[0] || {};
    var head = '<div class="sheet-head">' +
      '<span class="name">' + Core.esc(sheet.title || state.sheetId || 'Sheet') + '</span>' +
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
        '<h2>Sheet · side ' + side + ' · slot ' + pos + '</h2>' +
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
        '<button id="p_cancel" class="ghost">Cancel</button></div>';

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

  function mountBinder() {
    var wrap = document.getElementById('sheetWrap');
    var sel = document.getElementById('sheetSel');
    Core.busy(wrap, 'Loading binder…');

    document.getElementById('newSheet').addEventListener('click', function () {
      var title = prompt('Sheet title?', 'Sheet ' + (state.sheets.length + 1));
      if (title === null) return;
      API.post('/sheet', { title: title.trim() || null })
        .then(function () { Core.toast('Sheet added', 'good'); mountBinder(); })
        .catch(function (e) { Core.toast(e.message, 'bad'); });
    });

    API.get('/sheets').then(function (d) {
      state.sheets = d.sheets || [];
      if (!state.sheets.length) {
        sel.innerHTML = '';
        wrap.innerHTML = '<div class="empty">No sheets yet. <b>Add sheet</b> starts the binder.</div>';
        return;
      }
      sel.innerHTML = state.sheets.map(function (s) {
        return '<option value="' + Core.esc(s.sheet_id) + '">' +
               Core.esc(s.title || s.sheet_id) + ' — ' + s.slots_used + '/18</option>';
      }).join('');
      if (!state.sheetId || !state.sheets.some(function (s) { return s.sheet_id === state.sheetId; })) {
        state.sheetId = state.sheets[0].sheet_id;
      }
      sel.value = state.sheetId;
      sel.onchange = function () { state.sheetId = sel.value; refreshSlots(); };
      refreshSlots();
    }).catch(function (e) { Core.fail(wrap, e); });
  }

  /* -------------------------------------------------------------- SHOEBOX */
  function mountShoebox() {
    var wrap = document.getElementById('boxWrap');
    Core.busy(wrap, 'Loading shoe-box…');
    API.get('/shoebox').then(function (d) {
      var rows = d.shoebox || [];
      if (!rows.length) {
        wrap.innerHTML = '<div class="empty">Nothing unhoused. Everything you own is in a slot.</div>';
        return;
      }
      wrap.innerHTML = '<div class="list">' + rows.map(function (r) {
        return '<div class="item">' +
          '<span class="tile">' + Core.esc(Core.initials(r.name)) + '</span>' +
          '<span class="body"><b class="nm">' + Core.esc(r.name) + '</b>' +
          '<span class="tag">' + Core.esc(r.artwork_id) + (r.category ? ' · ' + Core.esc(r.category) : '') + '</span></span>' +
          '<span class="right"><span class="badge good">own ' + r.qty_owned + '</span></span>' +
          '</div>';
      }).join('') + '</div>';
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
