/* Inciardi Collection — PHOTOS. The bank of images, assigned and unassigned.
 *
 * ============================================================================
 * ⭐ UNASSIGNED IS THE DEFAULT VIEW, AND THAT IS THE WHOLE DESIGN (Q19 + J15).
 *
 * The app already solved this problem once: the SHOE-BOX is owned-but-unplaced prints, and it
 * is a screen rather than a filter because a backlog you have to go looking for is a backlog
 * nobody clears. An unassigned photo is an uploaded-but-unlinked image — same shape, same
 * answer. Michael arrived at it independently for images, which is the strongest argument that
 * it fits the model rather than bolting onto it.
 *
 * This is what makes bulk capture worth having: shoot thirty prints in one sitting with no
 * decisions at all, then file them later from a grid, on the couch. Capture and cataloguing
 * stop being the same chore (J10's unsolved half).
 * ============================================================================
 *
 * ⚠️ NO CAPTION / SUBJECT EDITING, AND IT IS A MISSING ROUTE, NOT AN OVERSIGHT.
 * The worker has `assign`, `primary` and `archive`. There is no update-metadata endpoint, so a
 * caption box here would be a control that 500s — worse than an honest gap, and the same ruling
 * that shipped v19's artwork page with an empty photo block instead of a dead upload button.
 * The drawer says so in the UI rather than leaving a reader to discover it.
 *
 * ⚠️ EVERY TILE IS THE FULL 1800px IMAGE, scaled by CSS. Derivatives were deferred (images.js
 * names why: one `r2_key` column, the scheme for three was never decided). `loading="lazy"`
 * and a fixed box keep 177 tiles usable; this is nonetheless the first thing that will hurt,
 * and the fix is a `-t.jpg` sibling key, not anything in this file.
 */
(function () {

  var state = {
    scope: 'mine',          // Q23 C: yours first, hers behind a switch
    unassignedOnly: true,   // the shoe-box rule
    counts: {},
    prints: null            // /artworks, cached for the assign picker
  };

  function $(id) { return document.getElementById(id); }
  function imgUrl(id) { return API.base() + '/image/' + encodeURIComponent(id); }

  /* ============================================================ the scope bar
   * Counts come from the SERVER's tally, never from `rows.length`. The grid is a filtered page;
   * a chip labelled from the page it is filtering would say "hers (0)" while sitting next to
   * 118 of them. Same reason /summary computes its own totals instead of letting the client
   * add up what it happens to be holding. */
  function bar() {
    var c = state.counts || {};
    var chips = [
      ['mine', 'Mine', c.mine],
      ['theirs', 'Anastasia\u2019s', c.theirs],
      ['all', 'All', c.total]
    ].map(function (row) {
      var on = state.scope === row[0];
      return '<button class="ph-chip" type="button" data-scope="' + row[0] + '"' +
             ' aria-pressed="' + (on ? 'true' : 'false') + '">' +
             Core.esc(row[1]) + (row[2] == null ? '' : ' \u00b7 ' + row[2]) + '</button>';
    }).join('');

    return chips +
      '<button class="ph-chip" type="button" id="phUnassigned"' +
      ' aria-pressed="' + (state.unassignedOnly ? 'true' : 'false') + '">' +
      'Unassigned only</button>';
  }

  /* ============================================================ the grid */
  function tile(im) {
    var flag = im.links > 0
      ? '<span class="ph-flag' + (im.is_primary_anywhere ? ' is-primary"' : '"') + '>' +
        (im.is_primary_anywhere ? '\u2b50 ' : '') + im.links + '</span>'
      : '';
    /* onerror rather than a bare <img>: a row whose bytes are missing from R2 is a REAL state
     * the worker reports as a 502, and an empty grey square is indistinguishable from a photo
     * that has not finished loading. */
    return '<button class="ph-tile" type="button" data-id="' + Core.esc(im.image_id) + '">' +
      '<img loading="lazy" alt="" src="' + Core.esc(imgUrl(im.image_id)) + '"' +
      ' onerror="this.outerHTML=\'<span class=&quot;ph-broken&quot;>image missing<br>from storage</span>\'">' +
      flag + '</button>';
  }

  function paint(images) {
    $('phBar').innerHTML = bar();
    var grid = $('phGrid');

    if (!images.length) {
      /* The empty state has to say WHICH emptiness this is. "No photos" under a filter that is
       * hiding 118 of them is a lie by omission, and it is how someone concludes the upload
       * failed. */
      var why = state.unassignedOnly
        ? 'Nothing unassigned in this view. Turn off <b>Unassigned only</b> to see filed photos.'
        : (state.scope === 'mine'
            ? 'You have not uploaded any photos yet. Tap <b>Add photos</b>.'
            : 'Nothing here yet.');
      grid.innerHTML = '<div class="empty">' + why + '</div>';
    } else {
      grid.innerHTML = images.map(tile).join('');
      [].forEach.call(grid.querySelectorAll('.ph-tile'), function (b) {
        b.addEventListener('click', function () {
          var found = images.filter(function (i) { return i.image_id === b.dataset.id; })[0];
          if (found) openPhoto(found);
        });
      });
    }

    [].forEach.call($('phBar').querySelectorAll('[data-scope]'), function (b) {
      b.addEventListener('click', function () { state.scope = b.dataset.scope; load(); });
    });
    $('phUnassigned').addEventListener('click', function () {
      state.unassignedOnly = !state.unassignedOnly; load();
    });
  }

  function load() {
    var grid = $('phGrid');
    Core.busy(grid, 'Loading photos\u2026');
    var q = '/images?scope=' + state.scope + (state.unassignedOnly ? '' : '&assigned=any');
    return API.get(q).then(function (d) {
      state.counts = d.counts || {};
      paint(d.images || []);
    }).catch(function (e) { Core.fail(grid, e); });
  }

  /* ============================================================ the per-photo drawer */
  function openPhoto(im) {
    var body = $('phDrawerBody');
    var links = (im.edition_ids || '').split(',').filter(Boolean);

    var meta = [];
    if (im.shot_at) meta.push('shot <b>' + Core.esc(im.shot_at) + '</b>');
    if (im.width && im.height) meta.push(im.width + '\u00d7' + im.height);
    if (im.bytes) meta.push(Math.round(im.bytes / 1024) + 'KB');
    meta.push('by <b>' + Core.esc(im.credit || 'unknown') + '</b>');
    if (im.kind !== 'upload') meta.push('<b>' + Core.esc(im.kind) + '</b> \u2014 not your photograph');

    body.innerHTML =
      '<h2>Photo</h2>' +
      '<img class="ph-shot" alt="" src="' + Core.esc(imgUrl(im.image_id)) + '">' +
      '<p class="ph-meta">' + meta.join(' \u00b7 ') + '</p>' +
      (links.length
        ? '<ul class="ph-links">' + links.map(function (ed) {
            return '<li><span class="muted">' + Core.esc(printName(ed)) + '</span>' +
              '<button type="button" data-primary="' + Core.esc(ed) + '">Make main</button>' +
              '<button type="button" data-unlink="' + Core.esc(ed) + '">Remove</button></li>';
          }).join('') + '</ul>'
        : '<p class="muted">Not attached to any print yet.</p>') +
      '<div class="ph-acts">' +
        '<select id="phAssign"><option value="">Attach to a print\u2026</option></select>' +
        '<button type="button" id="phArchive" class="danger">Archive</button>' +
        '<button type="button" id="phClose">Close</button>' +
      '</div>' +
      /* Stated in the UI, not just in a comment: a person looking for a caption box needs to
       * know it is absent on purpose rather than hidden somewhere they have not found. */
      '<p class="muted ph-meta">Captions are not editable yet \u2014 the worker has no route for ' +
      'it. Archiving never deletes the picture.</p>';

    body.querySelectorAll('[data-primary]').forEach(function (b) {
      b.addEventListener('click', function () {
        act('/image/primary', { image_id: im.image_id, edition_id: b.dataset.primary }, 'Set as the main photo');
      });
    });
    body.querySelectorAll('[data-unlink]').forEach(function (b) {
      b.addEventListener('click', function () {
        act('/image/assign', { image_id: im.image_id, edition_id: b.dataset.unlink, unlink: true }, 'Removed from that print');
      });
    });
    $('phArchive').addEventListener('click', function () {
      act('/image/archive', { image_id: im.image_id }, 'Archived \u2014 the file is kept');
    });
    $('phClose').addEventListener('click', function () { Drawer.closeAll(); });

    fillPrints(im);
    Drawer.open($('phDrawer'));
  }

  /* An edition_id is `<artwork_id>:e1` for the implicit one the trigger mints, and anything the
   * shop labelled for an explicit one. So the artwork name is DERIVABLE for the common case and
   * genuinely not for the rest — in which case the raw id is shown rather than a guess. */
  function printName(editionId) {
    var base = String(editionId).split(':')[0];
    var hit = (state.prints || []).filter(function (p) { return p.artwork_id === base; })[0];
    return hit ? hit.name : editionId;
  }

  function fillPrints(im) {
    var sel = $('phAssign');
    function options() {
      (state.prints || []).forEach(function (p) {
        var o = document.createElement('option');
        o.value = p.artwork_id;
        o.textContent = p.name;
        sel.appendChild(o);
      });
      sel.addEventListener('change', function () {
        if (sel.value) attach(im, sel.value);
      });
    }
    if (state.prints) return options();
    API.get('/artworks').then(function (d) {
      state.prints = d.artworks || [];
      options();
    }).catch(function (e) { Core.toast(e.message || String(e), 'bad'); });
  }

  /* 🔴 PHOTOS ATTACH TO AN EDITION, NEVER TO AN ARTWORK (J9, Q1) — but nobody thinks in
   * editions, so the picker offers PRINTS and this resolves the difference.
   *
   * The implicit edition is the right answer for almost every print, because an open-run print
   * has exactly one. When there are EXPLICIT editions — a second printing, an "oops" printing,
   * a numbered monoprint — it ASKS. Guessing there would put the photograph on the wrong
   * physical object, which is the exact distinction the edition layer exists to preserve. */
  function attach(im, artworkId) {
    API.get('/editions?artwork=' + encodeURIComponent(artworkId)).then(function (d) {
      var eds = d.editions || [];
      if (!eds.length) throw new Error('that print has no edition to attach to');

      var explicit = eds.filter(function (e) { return !e.implicit; });
      var pick = eds.filter(function (e) { return e.implicit; })[0] || eds[0];

      if (explicit.length) {
        var labels = eds.map(function (e, i) {
          return (i + 1) + ') ' + (e.implicit ? 'the standard one' : (e.label || e.edition_id));
        }).join('\n');
        var n = window.prompt('This print has more than one printing. Which one is in the photo?\n\n' + labels, '1');
        var idx = parseInt(n, 10);
        if (!(idx >= 1 && idx <= eds.length)) return;   // cancelled or nonsense: write nothing
        pick = eds[idx - 1];
      }
      return API.post('/image/assign', { image_id: im.image_id, edition_id: pick.edition_id })
        .then(function () { Core.toast('Attached', 'good'); Drawer.closeAll(); load(); });
    }).catch(function (e) { Core.toast(e.message || String(e), 'bad'); });
  }

  function act(path, body, okMsg) {
    API.post(path, body).then(function () {
      Core.toast(okMsg, 'good');
      Drawer.closeAll();
      load();
    }).catch(function (e) { Core.toast(e.message || String(e), 'bad'); });
  }

  window.Photos = {
    mount: function () {
      var add = $('phAdd');
      if (add) {
        add.addEventListener('click', function () {
          /* No edition_id: these land UNASSIGNED on purpose. Filing happens later, from the
           * grid, which is the entire point of the surface. */
          Capture.pick({ onDone: function () { load(); } });
        });
      }
      load();
    },
    reload: load
  };
})();
