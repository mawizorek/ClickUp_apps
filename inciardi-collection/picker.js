/* Inciardi Collection — THE SLOT PICKER.
 *
 * Extracted from `binder.js` 2026-07-30. Does BOTH jobs from one control: choose a known
 * artwork, or type a new name and get artwork + edition + placement in one gesture. That is J2
 * ruling 4 — a slot card IS the entry surface, not a link to one. Michael: "why are they so
 * different tho?" They aren't.
 *
 * STATE: owned by `binder.js`. This reads through `Binder.*` and refreshes through
 * `Binder.refresh()`, never by touching `state`.
 */
(function () {
  function $(id) { return document.getElementById(id); }

  function open(side, pos, slotId) {
    var host = $('pickWrap');
    Drawer.open(host);
    host.innerHTML = '<div class="drawer-body"><div class="empty">Loading prints\u2026</div></div>';

    Binder.artworks().then(function (list) {
      var opts = list.map(function (a) {
        return '<option value="' + Core.esc(a.artwork_id) + '">' + Core.esc(a.name) +
          ' \u2014 own ' + a.qty_owned +
          (a.placed_count ? ' \u00b7 placed ' + a.placed_count : '') + '</option>';
      }).join('');

      host.innerHTML =
        '<div class="drawer-head"><h2>' + Binder.face(side) + ' \u00b7 slot ' + (pos + 1) + '</h2>' +
          '<button class="drawer-x" id="p_cancel" aria-label="Close">\u2715</button></div>' +
        '<div class="drawer-body">' +
          '<p class="drawer-note">Pick a print you know, name a new one, or leave a note.</p>' +
          '<label class="drawer-label" for="p_pick">Known print</label>' +
          '<select id="p_pick"><option value="">\u2014 choose \u2014</option>' + opts + '</select>' +
          '<label class="drawer-label" for="p_new">\u2026or a print not in the catalog yet</label>' +
          '<input id="p_new" placeholder="e.g. Radish Bunch">' +
          '<div class="check"><input type="checkbox" id="p_own" checked>' +
            '<label for="p_own">I have this one</label></div>' +
          '<label class="drawer-label" for="p_note">\u2026or just a note in this slot</label>' +
          '<input id="p_note" placeholder="e.g. save for a trade">' +
          '<div class="row"><button id="p_save" class="primary">Place</button>' +
            (slotId ? '<button id="p_clear">Clear</button>' : '') + '</div>' +
          '<p class="drawer-note">Already have it somewhere else? Place it again \u2014 a print ' +
          'can sit in several slots, and the card spells out <b>own N \u00b7 placed M</b> so it ' +
          'can never read as owning more than you do.</p>' +
        '</div>';

      $('p_cancel').addEventListener('click', function () { Drawer.closeAll(); });

      if (slotId) $('p_clear').addEventListener('click', function () {
        API.del('/slot?id=' + encodeURIComponent(slotId)).then(function () {
          Core.toast('Slot cleared', 'good');
          Drawer.closeAll();
          Binder.refresh();
        }).catch(function (e) { Core.toast(e.message, 'bad'); });
      });

      $('p_save').addEventListener('click', function () {
        var pick = $('p_pick').value;
        var fresh = $('p_new').value.trim();
        var note = $('p_note').value.trim();
        var btn = $('p_save');
        btn.disabled = true; btn.textContent = 'Placing\u2026';

        function place(artwork_id) {
          return API.post('/slot', {
            sheet_id: Binder.sheetId(), side: side, position: pos,
            artwork_id: artwork_id || undefined,
            note: artwork_id ? undefined : (note || undefined)
          });
        }

        var chain;
        if (fresh) {
          // Create then place. Two writes, and the toast says which one failed if either does.
          chain = API.post('/artwork', { name: fresh, own: $('p_own').checked })
            .then(function (d) { Binder.invalidateArtworks(); return place(d.artwork_id); });
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
          Core.toast('Placed', 'good');
          Drawer.closeAll();
          Binder.refresh();
        }).catch(function (e) {
          Core.toast(e.message, 'bad');
        }).then(function () {
          btn.disabled = false; btn.textContent = 'Place';
        });
      });
    }).catch(function (e) { Core.fail(host, e); });
  }

  window.Picker = { open: open };
})();
