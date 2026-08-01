/* Inciardi Collection — PHOTOS. The image library: everything shot or adopted, assigned or not.
 *
 * ROUTE: `#photos`. Named at Q19 → A, where Michael struck his OWN word — he asked for a
 * "library" and then rejected Library, Darkroom and Flat file in favour of the plainest option.
 * Same instinct as Q11 picking SHEET/SIDE/SLOT over the more natural PAGE/FACE/POSITION.
 * 🚫 No document calls this "the library" from here on.
 *
 * ============================================================================
 * 🔴 UNASSIGNED IS THE DEFAULT VIEW, AND IT IS THE POINT OF THE SCREEN (J15).
 *
 * Beckett's objection to an image library was that it becomes a junk drawer: 177 adopted photos
 * plus every future upload, and nobody links any of them. The counter is that this app already
 * solved that exact problem once — the SHOE-BOX shows owned-but-unplaced PRINTS, so the backlog
 * is the first thing you see rather than something you have to go looking for.
 *
 * An unassigned image is an uploaded-but-unlinked photo. Same shape, same answer. ⭐ Michael
 * independently reinvented the shoe-box for images, which is the strongest argument available
 * that this fits the app's existing model rather than bolting onto it.
 * ============================================================================
 *
 * Q23 → C is the scope switch: bring in all 177, but OPEN showing only what is relevant to
 * prints he owns. Implemented on `image.kind` — 'upload' is his, 'scrub'/'reference' are hers —
 * so it needs no new column and no second claimant on a fact `kind` already owns.
 */
(function () {

  var state = {
    scope: 'mine',
    showAssigned: false,
    images: [],
    counts: {},
    prints: null,
    picked: null
  };

  function esc(s) { return Core.esc(s); }
  function $(id) { return document.getElementById(id); }

  /* Served through the worker proxy, never straight from R2 — the bucket is private, which is
   * what lets an archived photo 404 without anything touching the bytes (J13). */
  function src(im) { return API.base() + '/image/' + encodeURIComponent(im.image_id); }

  function toolbar() {
    var c = state.counts || {};
    var tabs = [['mine', 'Mine', c.mine], ['theirs', 'Hers', c.theirs], ['all', 'All', c.total]]
      .map(function (t) {
        return '<button class="ph-tab' + (state.scope === t[0] ? ' is-on' : '') +
          '" data-scope="' + t[0] + '">' + t[1] +
          (t[2] == null ? '' : ' <span class="ph-n">' + t[2] + '</span>') + '</button>';
      }).join('');
    return '<div class="ph-tabs" role="group" aria-label="Whose photographs">' + tabs + '</div>' +
      '<label class="ph-check"><input type="checkbox" id="phAssigned"' +
      (state.showAssigned ? ' checked' : '') + '> show assigned ones too</label>';
  }

  /* ⚠️ `loading="lazy"` is load-bearing: 177 tiles is 177 worker requests, every one a full-size
   * image because the derivatives were deferred (images.js header). When the library outgrows
   * this the fix is the thumb derivative, NOT pagination — paging a wall of photographs trades
   * away the one thing the screen is for.
   *
   * The caption is never blank: an adopted photo carries its legacy print id (adopt.js writes it
   * into `caption`), an upload carries its own. A tile with nothing on it is a grey box, and a
   * grey box is how an outage hides — the rule that also puts initials on a photo-less card. */
  function tile(im) {
    var links = Number(im.links || 0);
    var label = im.caption || im.subject || im.image_id;
    return '<button class="ph-tile' + (links ? ' is-linked' : '') +
      '" data-id="' + esc(im.image_id) + '">' +
      '<img src="' + esc(src(im)) + '" alt="' + esc(label) + '" loading="lazy">' +
      '<span class="ph-cap">' + esc(label) + '</span>' +
      (links ? '<span class="ph-badge">' + links + '</span>' : '') +
      (im.kind !== 'upload' ? '<span class="ph-hers" title="Anastasia&#39;s shop photo">A</span>' : '') +
      '</button>';
  }

  function grid() {
    if (!state.images.length) return empty();
    return '<div class="ph-grid">' + state.images.map(tile).join('') + '</div>';
  }

  /* Four empties, because "no photos" is four different situations and three of them have a next
   * action. An empty state that cannot tell them apart is the same defect as a read returning []
   * for an outage. */
  function empty() {
    var c = state.counts || {};
    if (!c.total) {
      return '<div class="empty"><b>No photographs yet.</b><br>Take one with ' +
        '<b>Add photos</b>, or bring in Anastasia&#39;s shop pictures below.</div>';
    }
    if (state.scope === 'mine' && !c.mine) {
      return '<div class="empty"><b>You have not taken any yet.</b><br>' +
        (c.theirs ? 'There are ' + c.theirs + ' of Anastasia&#39;s — tap <b>Hers</b>.' : '') +
        '</div>';
    }
    if (!state.showAssigned) {
      return '<div class="empty"><b>Nothing unassigned here.</b><br>Every photograph in this ' +
        'view is already attached to a print. Tick <b>show assigned ones too</b> to see them.</div>';
    }
    return '<div class="empty">No photographs in this view.</div>';
  }

  function load() {
    var host = $('phGrid');
    if (!host) return;
    Core.busy(host, 'Reading the photographs…');
    var q = '/images?scope=' + state.scope + (state.showAssigned ? '&assigned=any' : '');
    API.get(q).then(function (d) {
      state.images = d.images || [];
      state.counts = d.counts || {};
      var bar = $('phBar');
      if (bar) { bar.innerHTML = toolbar(); wireBar(); }
      host.innerHTML = grid();
    }).catch(function (e) { Core.fail(host, e); });
  }

  function wireBar() {
    [].forEach.call(document.querySelectorAll('.ph-tab'), function (b) {
      b.addEventListener('click', function () {
        state.scope = b.getAttribute('data-scope');
        load();
      });
    });
    var chk = $('phAssigned');
    if (chk) {
      chk.addEventListener('change', function () {
        state.showAssigned = chk.checked;
        load();
      });
    }
  }

  /* ============================================================ the assign drawer
   * TWO STEPS, and the second is skipped whenever it has one answer.
   *
   * A photo links to an EDITION, never an artwork (J9, Q1) — but an open print has exactly one
   * implicit edition, which is the overwhelming common case. Making someone confirm a choice
   * with a single option is not a choice, it is a tap. Step two appears only for a print with
   * more than one impression: a Brooklyn Ginkgo monoprint, or a labelled second printing. */
  function openAssign(im) {
    state.picked = im;
    var d = $('phDrawer');
    if (!d) return;
    paintAssign();
    Drawer.open(d);
  }

  function paintAssign() {
    var im = state.picked;
    var body = $('phDrawerBody');
    if (!im || !body) return;
    var links = Number(im.links || 0);

    body.innerHTML =
      '<div class="ph-prev"><img src="' + esc(src(im)) + '" alt=""></div>' +
      '<p class="ph-meta">' + esc(im.caption || im.image_id) +
        (im.shot_at ? ' · shot ' + esc(im.shot_at) : '') +
        (im.bytes ? ' · ' + Math.round(im.bytes / 1024) + 'KB' : '') +
        (im.width ? ' · ' + im.width + '×' + im.height : '') + '</p>' +
      (links ? '<p class="ph-note">Already on ' + links + ' print' + (links === 1 ? '' : 's') +
        ': <code>' + esc(im.edition_ids || '') + '</code></p>' : '') +
      '<label class="ph-lab" for="phFind">Attach to a print</label>' +
      '<input type="search" id="phFind" placeholder="Type a name…" autocomplete="off">' +
      '<div id="phHits" class="ph-hits"></div>' +
      '<div class="ph-acts"><button class="btn btn-ghost" id="phArchive">Archive this photo</button></div>' +
      '<p class="ph-note">Archiving hides it everywhere and <b>keeps the file forever</b>. There ' +
      'is no delete: R2 bytes are the one thing in this app that cannot be restored.</p>';

    $('phArchive').addEventListener('click', archive);
    var find = $('phFind');
    find.addEventListener('input', function () { hits(find.value); });

    /* Fetched once per session, on first open rather than at mount: most visits to this screen
     * are looking, not filing, and nobody should pay for a read they may not use. */
    if (!state.prints) {
      API.get('/artworks').then(function (d) {
        state.prints = d.artworks || [];
        hits(find.value);
      }).catch(function (e) {
        $('phHits').innerHTML = '<div class="empty bad">Could not load the print list. ' +
          esc(e.message || String(e)) + '</div>';
      });
    } else {
      hits('');
    }
  }

  function hits(q) {
    var el = $('phHits');
    if (!el) return;
    if (!state.prints) { el.innerHTML = '<div class="empty">Loading prints…</div>'; return; }
    q = String(q || '').trim().toLowerCase();
    var list = state.prints.filter(function (a) {
      return !q || a.name.toLowerCase().indexOf(q) >= 0 || a.artwork_id.indexOf(q) >= 0;
    }).slice(0, 12);
    if (!list.length) { el.innerHTML = '<div class="empty">No print matches that.</div>'; return; }
    el.innerHTML = list.map(function (a) {
      return '<button class="ph-hit" data-art="' + esc(a.artwork_id) + '"><span>' +
        esc(a.name) + '</span><span class="ph-hid">' + esc(a.artwork_id) + '</span></button>';
    }).join('');
    [].forEach.call(el.querySelectorAll('.ph-hit'), function (b) {
      b.addEventListener('click', function () { chooseEdition(b.getAttribute('data-art')); });
    });
  }

  function chooseEdition(artworkId) {
    var el = $('phHits');
    el.innerHTML = '<div class="empty">Reading editions…</div>';
    API.get('/editions?artwork=' + encodeURIComponent(artworkId)).then(function (d) {
      var eds = d.editions || [];
      if (!eds.length) {
        el.innerHTML = '<div class="empty bad">That print has no edition row, which should be ' +
          'impossible — the schema trigger creates one. Worth reporting.</div>';
        return;
      }
      if (eds.length === 1) { assign(eds[0].edition_id); return; }
      el.innerHTML = '<p class="ph-note">Which impression?</p>' + eds.map(function (e) {
        return '<button class="ph-hit" data-ed="' + esc(e.edition_id) + '"><span>' +
          esc(e.implicit ? 'the only impression' : (e.label || e.edition_id)) +
          '</span><span class="ph-hid">' + esc(e.edition_type) + '</span></button>';
      }).join('');
      [].forEach.call(el.querySelectorAll('.ph-hit'), function (b) {
        b.addEventListener('click', function () { assign(b.getAttribute('data-ed')); });
      });
    }).catch(function (e) {
      el.innerHTML = '<div class="empty bad">' + esc(e.message || String(e)) + '</div>';
    });
  }

  function assign(editionId) {
    if (!state.picked) return;
    API.post('/image/assign', { image_id: state.picked.image_id, edition_id: editionId })
      .then(function () {
        Core.toast('Attached', 'good');
        Drawer.closeAll();
        load();
      })
      .catch(function (e) { Core.toast(e.message || String(e), 'bad'); });
  }

  function archive() {
    if (!state.picked) return;
    API.post('/image/archive', { image_id: state.picked.image_id })
      .then(function () {
        Core.toast('Archived — the file is still there', 'good');
        Drawer.closeAll();
        load();
      })
      .catch(function (e) { Core.toast(e.message || String(e), 'bad'); });
  }

  /* ============================================================ adopt the 177
   *
   * 🔴 THIS BUTTON EXISTS BECAUSE THE ROUTE WAS UNREACHABLE. `POST /image/adopt` needs a POST
   * carrying a write key, and Michael builds from a phone with no terminal — so the legacy
   * import shipped as something only a developer could invoke. **That is the B14 wrong-surface
   * scar this app has already paid for twice**: the wrangler runbook nobody could run, and the
   * DDL paste that had to become a workflow button. A capability with no reachable surface is
   * not a capability.
   *
   * DRY RUN FIRST, ALWAYS — Apply is not rendered until the dry run has rendered its counts, so
   * the number is on screen before the write is even possible. Same rule as the back room
   * refusing to draw a run button for an invalid batch.
   *
   * ⚠️ EXPECT A LOW MATCH RATE AND DO NOT READ IT AS FAILURE. Many legacy keys are
   * `prints/1-10/` and `prints/12-x-16/` — collapsed slugs and dimensions, the slug("#1")
   * collision this app was rebuilt to escape. Those photos still import (Q23 C); they simply
   * cannot auto-match, and get linked by eye from this grid. */
  function adopt(apply) {
    var out = $('phAdoptOut');
    out.hidden = false;
    out.innerHTML = '<div class="empty">' + (apply ? 'Importing…' : 'Checking…') + '</div>';
    API.post('/image/adopt' + (apply ? '?apply=1' : ''), {}).then(function (d) {
      if (apply) {
        out.innerHTML = '<div class="ph-res"><b>Imported ' + d.found + ' photographs.</b><br>' +
          d.matched + ' attached to prints you own · ' + d.unmatched + ' left unassigned' +
          (d.of_which_unnameable ? ' (' + d.of_which_unnameable +
            ' of those can never auto-match)' : '') + '</div>';
        state.scope = 'all';
        load();
        return;
      }
      out.innerHTML = '<div class="ph-res"><b>' + d.found +
        ' photographs found. Nothing written yet.</b><br>' + d.would_match +
        ' would attach to prints you own · ' + d.would_import_unmatched +
        ' would come in unassigned' +
        (d.of_which_unnameable ? '<br><span class="ph-warn">' + d.of_which_unnameable +
          ' of those carry an id like <code>12-x-16</code> and can never match automatically — ' +
          'they are linkable by eye from the grid.</span>' : '') +
        '</div><button class="btn" id="phApply">Import them</button>';
      $('phApply').addEventListener('click', function () { adopt(true); });
    }).catch(function (e) {
      out.innerHTML = '<div class="empty bad">' + esc(e.message || String(e)) + '</div>';
    });
  }

  function mount() {
    if (!$('phWrap')) return;

    $('phShoot').addEventListener('click', function () {
      Capture.shoot({
        multiple: true,
        onStep: function (done, total, name) {
          Core.busy($('phGrid'), 'Uploading ' + (done + 1) + ' of ' + total + '  ·  ' + name);
        },
        onDone: function () { load(); }
      });
    });

    $('phAdopt').addEventListener('click', function () { adopt(false); });

    /* Delegated. The grid is replaced on every load, so per-tile listeners would need re-binding
     * each time and one missed re-bind is a screen where tapping silently does nothing. */
    $('phGrid').addEventListener('click', function (e) {
      var t = e.target.closest('.ph-tile');
      if (!t) return;
      var id = t.getAttribute('data-id');
      for (var i = 0; i < state.images.length; i++) {
        if (state.images[i].image_id === id) { openAssign(state.images[i]); return; }
      }
    });

    var x = $('phDrawerX');
    if (x) x.addEventListener('click', function () { Drawer.closeAll(); });

    load();
  }

  window.Photos = { mount: mount };
})();
