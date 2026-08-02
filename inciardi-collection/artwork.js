/* Inciardi Collection — THE ARTWORK DETAIL. One print, everything known about it.
 *
 * ROUTE: `#artwork?id=<artwork_id>` — a real, bookmarkable address (Q16 → A + D, decoded at J12).
 *
 * ============================================================================
 * WHY THIS EXISTS, and why it took until v19.
 *
 * Q6 was answered on 2026-07-25 with a CONDITION: *"I'm fine with just A if the assumption is
 * that I can go to the edition detail menu and input a photo later from day one."* The answer
 * was folded into the descriptor as settled and **the condition was never built** — no artwork
 * route, no edition route, no upload control anywhere in the app for six days (J11).
 *
 * The generalizable half, worth more than the page: **a conditional answer whose condition is a
 * build step needs that step written down AS A STEP**, or the condition quietly becomes an
 * assumption that everything downstream rests on.
 *
 * ⭐ AND AS OF v23 THE CONDITION IS FINALLY MET — twenty-three versions and eight days after it
 * was accepted as settled. You can now open a print and put a photograph on it from that page.
 *
 * WHY A ROUTE AND NOT A DRAWER. Michael struck the bottom-sheet option (Q16 C) even though it
 * was the fastest to build, so **linkability beat speed** — consistent with v7's deep links. A
 * print is now addressable: you can send yourself a link to Choco Taco.
 * ============================================================================
 *
 * 🔴 IT READS `/summary`, AND THAT IS A DESIGN DECISION, NOT LAZINESS.
 * `/summary` already returns every print's counts plus every placement in the binder, and the
 * Collection matrix renders off exactly that response. Giving this page its own route would mean
 * a SECOND query computing owned/placed/spare — and two queries that answer the same question
 * eventually disagree. `worker/reads.js` says the same thing from the other side.
 * The cost is honest and small: it fetches the whole collection to render one print. At 59
 * artworks that is one small JSON. **If it ever gets slow, the fix is a route that SELECTS from
 * the same view, never a second calculation.**
 *
 * 🔴 THIS FILE CONTAINS NO PHOTO LOGIC, AND THAT IS ENFORCED RATHER THAN TIDY.
 * It does not know what a carousel is, does not build an image URL, does not know which
 * photograph is on the binder card. It renders `<div id="awPhotos">` and hands `PhotoView` an
 * artwork id. Q28's note — *"driven from single source with access across the board"* — is what
 * makes that a REQUIREMENT and not a preference: `photos.js` has to be able to reach the same
 * component, and it cannot reach a function defined in here.
 */
(function () {

  function esc(s) { return Core.esc(String(s == null ? '' : s)); }

  /* Binder.face() is the ONE place 'A'/'B' becomes Front/Back. Borrowed, never copied — a second
   * mapping is a second thing to get wrong. The fallback exists only so a missing binder.js
   * degrades this page rather than blanking it. */
  function face(side) {
    return (window.Binder && Binder.face) ? Binder.face(side) : (side === 'A' ? 'Front' : 'Back');
  }

  function chip(label, value) {
    if (value == null || value === '') return '';
    return '<span class="aw-chip"><b>' + esc(label) + '</b>' + esc(value) + '</span>';
  }

  /* ---------- the counts strip ----------
   * Three numbers that must add up, and the app has been bitten by each of them separately:
   *   owned      SUM(copy.qty), never COUNT(*)
   *   in binder  MIN(owned, placed) — NOT `placed`, which counts slots and double-counts a
   *              print sitting on two sheets (legal, J2 ruling 3)
   *   spare      MAX(0, owned - placed)
   * All three arrive computed from `/summary`. This file adds nothing up. */
  function counts(s) {
    var cells = [
      ['owned', s.qty_owned || 0],
      ['in binder', s.in_binder || 0],
      ['spare', s.spare || 0]
    ];
    if (s.placed > (s.qty_owned || 0)) cells.push(['slots used', s.placed]);
    return '<div class="aw-nums">' + cells.map(function (c) {
      return '<div class="aw-num"><span class="awn-v">' + c[1] +
             '</span><span class="awn-k">' + c[0] + '</span></div>';
    }).join('') + '</div>';
  }

  /* ---------- placements ----------
   * Every link is a DEEP LINK to the exact face it sits on, which is the whole reason /summary
   * carries sheet_title and sheet_order rather than just sheet_id. */
  function placements(list) {
    if (!list.length) {
      return '<p class="aw-empty">Not in the binder. ' +
        '<a href="#shoebox">It is in the shoe-box</a> — or you want one and have not got it yet.</p>';
    }
    return '<ul class="aw-places">' + list.map(function (p) {
      return '<li><a href="#binder?sheet=' + encodeURIComponent(p.sheet_id) +
        '&side=' + encodeURIComponent(p.side) + '">' +
        '<span class="awp-sheet">' + esc(p.sheet_title || p.sheet_id) + '</span>' +
        '<span class="awp-pos">' + esc(face(p.side).toLowerCase()) +
        ' · slot ' + (p.position + 1) + '</span></a></li>';
    }).join('') + '</ul>';
  }

  /* ---------- editions ----------
   * 🔴 AN IMPLICIT EDITION IS NEVER RENDERED AS A BADGE. schema.sql is explicit: implicit=1 means
   * the row exists because the ARTWORK exists, not because Anastasia numbered anything. Printing
   * "#1" on Luna Moth is the phantom-badge bug the predecessor shipped. It is named here as
   * structural, so a reader knows the row is real and the number is not. */
  function editions(list) {
    if (!list.length) return '';
    var rows = list.map(function (e) {
      return '<li>' + (e.implicit
        ? '<span class="aw-imp">the only impression</span>' +
          '<span class="aw-note">structural — not a numbered edition</span>'
        : '<span class="aw-lab">' + esc(e.label || e.edition_id) + '</span>' +
          '<span class="aw-note">' + esc(e.edition_type) + '</span>') + '</li>';
    }).join('');
    return '<h2 class="aw-h">Editions</h2><ul class="aw-eds">' + rows + '</ul>';
  }

  /* ---------- photographs ----------
   * ⭐ v19 CUT THIS BLOCK TO SHAPE AND SAID SO IN ITS OWN COMMENT: *"this block is where the
   * carousel, the filmstrip and the ⭐ primary toggle land, unchanged."* They landed, and this
   * function went from an apology to one empty div.
   *
   * The smallness IS the result. A page that has to be rearranged to receive a planned feature
   * was never actually sized for it, and "we left room" is a claim that only gets tested once.
   *
   * ⚠️ It is a MOUNT POINT, not a render. `PhotoView` replaces this element's contents on every
   * write and never the element itself, which is what lets it hold one delegated listener
   * instead of rebinding a handler per frame after each edit. */
  function photos() {
    return '<h2 class="aw-h">Photographs</h2><div id="awPhotos"></div>';
  }

  function render(art, sum, places, eds) {
    return '<div class="aw">' +
      '<header class="aw-head">' +
        '<h1 class="aw-name">' + esc(art.name) + '</h1>' +
        '<p class="aw-id"><code>' + esc(art.artwork_id) + '</code></p>' +
      '</header>' +
      counts(sum) +
      '<div class="aw-chips">' +
        chip('', art.category) +
        chip('', art.edition_type) +
        chip('', art.confidence === 'named' ? null : art.confidence) +
        chip('', art.provenance) +
        (art.retail != null ? chip('$', Number(art.retail).toFixed(2)) : '') +
        (art.collection_id ? chip('in ', art.collection_id) : '') +
      '</div>' +
      (art.notes ? '<p class="aw-notes">' + esc(art.notes) + '</p>' : '') +
      /* PHOTOGRAPHS SIT ABOVE "where it is" AS OF v23. The picture is the fastest way to confirm
       * you are on the right print, and it was below two lists and a table of counts. Placement
       * changed; nothing else on the page did. */
      photos() +
      '<h2 class="aw-h">Where it is</h2>' +
      placements(places) +
      editions(eds) +
      '<p class="aw-back"><a href="#summary">← all prints</a></p>' +
    '</div>';
  }

  /* A missing id is a link someone typed or a stale bookmark. Offering the nearest names beats a
   * bare "not found", because the usual cause is a slug that was guessed rather than copied —
   * the exact failure `badSlug()` exists to prevent one layer down. */
  function notFound(id, list) {
    var near = list.filter(function (a) {
      return a.artwork_id.indexOf(String(id).slice(0, 4)) === 0;
    }).slice(0, 6);
    return '<div class="aw"><header class="aw-head">' +
      '<h1 class="aw-name">No print with that id</h1>' +
      '<p class="aw-id"><code>' + esc(id) + '</code> is not in the catalog.</p></header>' +
      (near.length
        ? '<h2 class="aw-h">Did you mean</h2><ul class="aw-places">' + near.map(function (a) {
            return '<li><a href="#artwork?id=' + encodeURIComponent(a.artwork_id) + '">' +
              '<span class="awp-sheet">' + esc(a.name) + '</span>' +
              '<span class="awp-pos">' + esc(a.artwork_id) + '</span></a></li>';
          }).join('') + '</ul>'
        : '') +
      '<p class="aw-back"><a href="#summary">← all prints</a></p></div>';
  }

  function noId() {
    return '<div class="aw"><header class="aw-head">' +
      '<h1 class="aw-name">No print chosen</h1>' +
      '<p class="aw-id">This page needs one: <code>#artwork?id=&lt;artwork_id&gt;</code>. ' +
      'You get here by opening a print, not from the menu.</p></header>' +
      '<p class="aw-back"><a href="#summary">← all prints</a></p></div>';
  }

  function mount(params) {
    var host = document.getElementById('artWrap');
    if (!host) return;

    /* 🔴 THE SCRIM'S CLICK IS BOUND HERE BECAUSE NOTHING ELSE BINDS IT (J23). `core.js` shows and
     * hides `#pageScrim` and never attaches a handler — each page owns that. A declared scrim
     * with no listener is a dimmed screen you cannot dismiss, which is strictly worse than no
     * backdrop at all. Bound before the fetch so it works even if the read fails. */
    var scrim = document.getElementById('pageScrim');
    if (scrim) scrim.addEventListener('click', function () { Drawer.closeAll(); });

    var id = (params && params.id) || '';
    if (!id) { host.innerHTML = noId(); return; }

    Core.busy(host, 'Reading the collection\u2026');

    /* Three reads in parallel, and each answers something the others cannot:
     *   /artworks  the descriptive fields — notes, edition_type, provenance, retail
     *   /summary   the counts AND every placement (see the header note on why not a new route)
     *   /editions  this print's impressions
     * Promise.all rather than a chain: they do not depend on each other, and a phone on a slow
     * connection should pay for one round trip, not three.
     * ⚠️ PhotoView makes its own two reads AFTER these land. Deliberately not folded in: it has
     * to work when a caller other than this page mounts it, and a component whose data only one
     * caller can supply is not a shared component. Two extra requests on a page already making
     * three, in exchange for the constraint Q28 actually asked for. */
    Promise.all([
      API.get('/artworks'),
      API.get('/summary'),
      API.get('/editions?artwork=' + encodeURIComponent(id))
    ]).then(function (r) {
      var list = (r[0] && r[0].artworks) || [];
      var art = null;
      for (var i = 0; i < list.length; i++) {
        if (list[i].artwork_id === id) { art = list[i]; break; }
      }
      if (!art) { host.innerHTML = notFound(id, list); return; }

      var prints = (r[1] && r[1].prints) || [];
      var sum = {};
      for (var j = 0; j < prints.length; j++) {
        if (prints[j].artwork_id === id) { sum = prints[j]; break; }
      }

      var places = ((r[1] && r[1].placements) || []).filter(function (p) {
        return p.artwork_id === id;
      });

      host.innerHTML = render(art, sum, places, (r[2] && r[2].editions) || []);

      /* AFTER the innerHTML, because #awPhotos does not exist until then. A guard rather than an
       * assumption: photoview.js is reached by link like this whole route, so a 404 on it should
       * cost the photographs and nothing else — the rest of the page is already painted. */
      if (window.PhotoView) {
        PhotoView.mount(document.getElementById('awPhotos'), { artwork: id });
      }
    }).catch(function (e) { Core.fail(host, e); });
  }

  window.Artwork = { mount: mount };
})();
