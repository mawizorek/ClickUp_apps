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
 * ⚠️ NO PHOTOS HERE YET, DELIBERATELY. The carousel, the filmstrip and the upload button are
 * `next-build-spec.md` steps 5 + 8, and they are blocked on an R2 bucket binding and the image
 * routes. This page ships the empty state INSTEAD OF the button, because a control that 500s is
 * worse than an honest gap — and the gap is where they land, unchanged, when the pipe exists.
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

  /* ---------- photos: the honest gap ----------
   * Shipping the empty state rather than a disabled button, for the same reason the back room
   * renders NO run button on an invalid batch: a disabled control says "there is a way to make
   * this go," and there is not one yet. */
  function photos() {
    return '<h2 class="aw-h">Photographs</h2>' +
      '<div class="aw-photos">' +
        '<p><b>None yet, and there is no way to add one from here.</b></p>' +
        '<p class="aw-note">The image table is live in D1 and the pipe is designed end to end — ' +
        'it needs an R2 binding and the upload routes. Scope and order: ' +
        '<code>next-build-spec.md</code> steps 5 and 8. This block is where the carousel, the ' +
        'filmstrip and the ⭐ primary toggle land, unchanged.</p>' +
      '</div>';
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
      '<h2 class="aw-h">Where it is</h2>' +
      placements(places) +
      editions(eds) +
      photos() +
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

    var id = (params && params.id) || '';
    if (!id) { host.innerHTML = noId(); return; }

    Core.busy(host, 'Reading the collection\u2026');

    /* Three reads in parallel, and each answers something the others cannot:
     *   /artworks  the descriptive fields — notes, edition_type, provenance, retail
     *   /summary   the counts AND every placement (see the header note on why not a new route)
     *   /editions  this print's impressions
     * Promise.all rather than a chain: they do not depend on each other, and a phone on a slow
     * connection should pay for one round trip, not three. */
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
    }).catch(function (e) { Core.fail(host, e); });
  }

  window.Artwork = { mount: mount };
})();
