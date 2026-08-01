/* Inciardi Collection — THE SLOT PICKER.
 *
 * Extracted from `binder.js` 2026-07-30. Does BOTH jobs from one control: choose a known
 * artwork, or type a new name and get artwork + edition + placement in one gesture. That is J2
 * ruling 4 — a slot card IS the entry surface, not a link to one. Michael: "why are they so
 * different tho?" They aren't.
 *
 * STATE: owned by `binder.js`. This reads through `Binder.*` and refreshes through
 * `Binder.refresh()`, never by touching `state`.
 *
 * 🔴 v19 — THE SECOND DOOR, AND WHY IT IS A LINK RATHER THAN A REPLACEMENT.
 * `#artwork?id=` gives a print its own page, so tapping a binder card now has two plausible
 * meanings: PLACE something, or INSPECT what is there. Resolving that by making the card open
 * the detail page would break placement — the app's primary verb, and the whole point of J2
 * ruling 4. So the picker KEEPS the gesture and gains a link: a filled slot offers "see this
 * print", an empty one is unchanged. Additive, and the only edit v19 makes to an existing
 * surface.
 *
 * ⚠️ The extra `/slots` read fires ONLY for a filled slot, because that is the only case that
 * can have a link. It runs inside the same Promise.all as the artwork list, so it costs no extra
 * round trip — and it deliberately does NOT change `Picker.open`'s signature, which would have
 * meant editing `binder.js` (15.0KB, already at the split line) for the sake of a label.
 */
(function () {
  function $(id) { return document.getElementById(id); }

  function open(side, pos, slotId) {
    var host = $('pickWrap');
    Drawer.open(host);
    host.innerHTML = '<div class="drawer-body"><div class="empty">Loading prints\u2026</div></div>';

    /* A failed slot read must NEVER take the picker down with it — placement has to keep working
     * when a nicety does not. Hence the catch that resolves to an empty list: worst case the
     * link is absent, which is exactly v18's behaviour. */
    var slots = slotId
      ? API.get('/slots?sheet=' + encodeURIComponent(Binder.sheetId()))
          .then(function (d) { return d.slots || []; })
          .catch(function () { return []; })
      : Promise.resolve([]);

    Promise.all([Binder.artworks(), slots]).then(function (r) {
      var list = r[0];
      var sitting = null;
      r[1].forEach(function (s) { if (s.slot_id === slotId) sitting = s; });

      var opts = list.map(function (a) {
        return '<option value="' + Core.esc(a.artwork_id) + '">' + Core.esc(a.name) +
          ' \u2014 own ' + a.qty_owned +
          (a.placed_count ? ' \u00b7 placed ' + a.placed_count : '') + '</option>';
      }).join('');

      /* Only when the slot holds an ARTWORK. A note-only slot has nothing to inspect, and a link
       * to `#artwork?id=` with no id would land on the "no print chosen" state — a door that
       * opens onto an apology. */
      var seeLink = (sitting && sitting.artwork_id)
        ? '<a class="p-see" href="#artwork?id=' + encodeURIComponent(sitting.artwork_id) + '">' +
            'See <b>' + Core.esc(sitting.artwork_name || sitting.artwork_id) + '</b> \u2192</a>'
        : '';

      host.innerHTML =
        '<div class="drawer-head"><h2>' + Binder.face(side) + ' \u00b7 slot ' + (pos + 1) + '</h2>' +
          '<button class="drawer-x" id="p_cancel" aria-label="Close">\u2715</button></div>' +
        '<div class="drawer-body">' +
          seeLink +
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
