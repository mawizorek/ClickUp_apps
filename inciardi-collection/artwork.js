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
 * ✅ AS OF v22 THE CONDITION IS FINALLY MET, seven days after it was accepted. The
 * generalizable half is still worth more than the page: **a conditional answer whose condition
 * is a build step needs that step written down AS A STEP**, or the condition quietly becomes an
 * assumption everything downstream rests on.
 *
 * WHY A ROUTE AND NOT A DRAWER. Michael struck the bottom-sheet option (Q16 C) even though it
 * was the fastest to build, so **linkability beat speed** — consistent with v7's deep links.
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
 * 🔴 AND THE PHOTOGRAPHS COME FROM `GET /images?artwork=`, WHICH IS THE SAME RULE AGAIN.
 * That route runs the identical ranking the binder card uses (`photoOrder()` in
 * `worker/links.js`) with the `LIMIT 1` taken off. **So the first frame of the carousel IS the
 * photo on the binder card — structurally, not by agreement.** Nothing in this file sorts,
 * filters or re-orders that list, and nothing in it may start: a client-side ordering here is
 * the second claimant that would let the binder and this page disagree about which photograph a
 * print IS. Render what arrives, in the order it arrives.
 *
 * ⚠️ SIZE: 17.9KB at v22 — over the 15KB split line, under the 22KB ceiling, so it still reads
 * whole. If it grows again the seam is the photo block: `photos()`, `strip()` and the two add
 * paths are self-contained and would go to `artphotos.js`. The full-screen viewer already left
 * (`viewer.js`), which is what kept this file under the ceiling in the first place.
 */
(function () {

  /* One print's worth of state, so a write can repaint the photo block alone. Re-running the
   * page's three other reads to redraw a filmstrip would cost four round trips and scroll the
   * reader back to the top of a print they were in the middle of looking at. */
  var cur = { id: '', name: '', editions: [], photos: [] };

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
   * "#1" on Luna Moth is the phantom-badge bug the predecessor shipped. */
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

  /* ============================================================ THE PHOTOGRAPHS (v22)
   * The block v19 sized and left empty, filled with what it was sized for.
   *
   * 🔴 RENDERED IN ARRIVAL ORDER. No sort here, ever. See the file header.
   */
  function photos() {
    var list = cur.photos || [];
    var add =
      '<div class="aw-pacts">' +
        '<button type="button" class="primary" id="awShoot">\ud83d\udcf7 Photograph this print</button>' +
        '<button type="button" id="awAttach">Attach one you already took</button>' +
      '</div>';

    if (!list.length) {
      /* Still an honest empty state, but no longer a dead end — the two controls that fill it
       * are right there. v19 shipped the gap INSTEAD OF a button because the routes did not
       * exist; they do now, so the gap becomes an invitation. */
      return '<h2 class="aw-h">Photographs</h2>' +
        '<div class="aw-photos"><p><b>No photographs of this print yet.</b></p>' +
        '<p class="aw-note">Shoot it, or attach something already in Photos — a pack shot can ' +
        'sit on several prints at once.</p></div>' + add;
    }

    var hero = list[0];
    return '<h2 class="aw-h">Photographs</h2>' +
      '<div class="aw-car">' +
        '<button type="button" class="aw-hero" data-open="0" aria-label="View full screen">' +
          '<img alt="" src="' + esc(Viewer.url(hero.image_id)) + '"' +
          ' onerror="this.outerHTML=\'<span class=&quot;aw-broken&quot;>bytes missing from storage</span>\'">' +
          '<span class="aw-heroflag">\u2b50 on the card</span>' +
        '</button>' +
        (list.length > 1 ? strip(list) : '') +
        '<p class="aw-pmeta">' + list.length +
          (list.length === 1 ? ' photograph' : ' photographs') +
          ' \u00b7 the first is the one on your binder card' +
          (hero.links > 1 ? ' \u00b7 this one is also on ' + (hero.links - 1) + ' other print' +
            (hero.links > 2 ? 's' : '') : '') +
        '</p>' +
      '</div>' + add;
  }

  /* The filmstrip. Tapping a frame opens the viewer AT that frame rather than swapping the hero
   * in place: the reason to tap a small picture is to see a big one, and a strip that only
   * changes the image above it makes you tap twice for the thing you wanted. */
  function strip(list) {
    return '<div class="aw-strip">' + list.map(function (p, i) {
      return '<button type="button" class="aw-th" data-open="' + i + '"' +
        ' aria-label="Photo ' + (i + 1) + ' of ' + list.length + '">' +
        '<img loading="lazy" alt="" src="' + esc(Viewer.url(p.image_id)) + '">' +
        (i === 0 ? '<span class="aw-thfront">\u2b50</span>' : '') + '</button>';
    }).join('') + '</div>';
  }

  /* Repaint the photo block ALONE. `#awPhotos` wraps it precisely so a write does not force the
   * page's other three reads to run again. */
  function repaint() {
    var box = document.getElementById('awPhotos');
    if (!box) return;
    box.innerHTML = photos();
    wirePhotos();
  }

  function reloadPhotos() {
    return API.get('/images?artwork=' + encodeURIComponent(cur.id)).then(function (d) {
      cur.photos = (d && d.photos) || [];
      repaint();
    }).catch(function (e) { Core.toast(e.message || String(e), 'bad'); });
  }

  function wirePhotos() {
    var box = document.getElementById('awPhotos');
    if (!box) return;

    [].forEach.call(box.querySelectorAll('[data-open]'), function (b) {
      b.addEventListener('click', function () {
        Viewer.open({
          photos: cur.photos,
          index: parseInt(b.dataset.open, 10) || 0,
          label: cur.name,
          onAct: reloadPhotos
        });
      });
    });

    var shoot = document.getElementById('awShoot');
    if (shoot) {
      shoot.addEventListener('click', function () {
        /* 🔴 RESOLVE THE EDITION BEFORE OPENING THE CAMERA, not after. If this print has
         * explicit printings the question has to be answered while the person still knows why
         * they are being asked — asking after six photos have uploaded is asking about a thing
         * they have stopped thinking about. `pickEdition` returns null for "cancelled", which
         * means write nothing. */
        var ed;
        try { ed = Viewer.pickEdition(cur.editions); }
        catch (e) { return Core.toast(e.message || String(e), 'bad'); }
        if (!ed) return;
        /* `capture: true` forces the CAMERA rather than the library. capture.js's own header
         * names this as what a print's own page wants: you are standing in front of the print. */
        Capture.pick({ edition_id: ed.edition_id, capture: true, subject: 'single',
                       onDone: reloadPhotos });
      });
    }

    var attach = document.getElementById('awAttach');
    if (attach) attach.addEventListener('click', openAttach);
  }

  /* ============================================================ attach an existing photo
   * Q28 → D, the reverse direction of the attach that already exists. Today a photo is filed
   * FROM the Photos grid; this lets a print reach back for one.
   *
   * ⚠️ AN INLINE PANEL, NOT A DRAWER, and that is deliberate. `core.js`'s Drawer shows and hides
   * `#pageScrim` but never BINDS it — every page owns that click, and a page that declares the
   * scrim without a handler gets a dimmed screen you cannot dismiss, which is worse than no
   * backdrop. That trap has already been found once by reading rather than by tapping. An inline
   * panel has no scrim to get wrong.
   */
  function openAttach() {
    var box = document.getElementById('awPick');
    if (!box) return;
    if (!box.hidden) { box.hidden = true; return; }   // second tap closes it
    box.hidden = false;
    Core.busy(box, 'Reading your photos\u2026');

    /* `assigned=any` on purpose: a pack shot already sitting on nine prints is exactly the thing
     * you want to put on a tenth, and a picker that only offered UNASSIGNED photos would hide
     * the one workflow this button exists for. */
    API.get('/images?scope=all&assigned=any').then(function (d) {
      var all = (d.images || []).filter(function (im) {
        // Already on this print: offering it again would be a no-op with a success toast.
        return (cur.photos || []).every(function (p) { return p.image_id !== im.image_id; });
      });
      if (!all.length) {
        box.innerHTML = '<p class="aw-empty">Nothing left to attach — every photo you have is ' +
          'already on this print.</p>';
        return;
      }
      box.innerHTML = '<p class="aw-pmeta">Newest first. Tap one to put it on this print.</p>' +
        '<div class="aw-strip wrap">' + all.map(function (im) {
          return '<button type="button" class="aw-th" data-pick="' + esc(im.image_id) + '">' +
            '<img loading="lazy" alt="" src="' + esc(Viewer.url(im.image_id)) + '">' +
            (im.links ? '<span class="aw-thn">' + im.links + '</span>' : '') + '</button>';
        }).join('') + '</div>';

      [].forEach.call(box.querySelectorAll('[data-pick]'), function (b) {
        b.addEventListener('click', function () { doAttach(b.dataset.pick); });
      });
    }).catch(function (e) { Core.fail(box, e); });
  }

  function doAttach(imageId) {
    var ed;
    try { ed = Viewer.pickEdition(cur.editions); }
    catch (e) { return Core.toast(e.message || String(e), 'bad'); }
    if (!ed) return;
    API.post('/image/assign', { image_id: imageId, edition_id: ed.edition_id })
      .then(function () {
        Core.toast('Attached to ' + cur.name, 'good');
        var box = document.getElementById('awPick');
        if (box) { box.hidden = true; box.innerHTML = ''; }
        return reloadPhotos();
      })
      .catch(function (e) { Core.toast(e.message || String(e), 'bad'); });
  }

  /* ---------- the page ---------- */
  function render(art, sum, places, eds) {
    return '<div class="aw">' +
      '<header class="aw-head">' +
        '<h1 class="aw-name">' + esc(art.name) + '</h1>' +
        '<p class="aw-id"><code>' + esc(art.artwork_id) + '</code></p>' +
      '</header>' +
      counts(sum) +
      '<div class="aw-chips">' +
        chip('', art.category) +
        chip('', art.medium) +
        chip('', art.edition_type) +
        chip('', art.confidence === 'named' ? null : art.confidence) +
        chip('', art.provenance) +
        (art.retail != null ? chip('$', Number(art.retail).toFixed(2)) : '') +
      '</div>' +
      (art.notes ? '<p class="aw-notes">' + esc(art.notes) + '</p>' : '') +
      /* PHOTOGRAPHS FIRST, above "Where it is". v19 put the empty block at the bottom because it
       * was an apology; a picture of the print is the most useful thing on the page and belongs
       * directly under its name. */
      '<div id="awPhotos">' + photos() + '</div>' +
      '<div id="awPick" class="aw-pick" hidden></div>' +
      '<h2 class="aw-h">Where it is</h2>' +
      placements(places) +
      editions(eds) +
      '<p class="aw-back"><a href="#summary">← all prints</a></p>' +
    '</div>';
  }

  /* A missing id is a link someone typed or a stale bookmark. Offering the nearest names beats a
   * bare "not found", because the usual cause is a slug that was guessed rather than copied. */
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

    cur = { id: id, name: id, editions: [], photos: [] };
    Core.busy(host, 'Reading the collection\u2026');

    /* FOUR reads in parallel, and each answers something the others cannot:
     *   /artworks       the descriptive fields — notes, edition_type, provenance, retail
     *   /summary        the counts AND every placement (see the header on why not a new route)
     *   /editions       this print's impressions
     *   /images?artwork the photographs, in the binder card's own order
     * Promise.all rather than a chain: none depends on another, and a phone on a slow
     * connection should pay for one round trip rather than four.
     *
     * 🔴 THE PHOTO READ CATCHES SEPARATELY. A photo route that 500s must degrade to "could not
     * load the photographs" underneath a page that still shows the print's name, counts and
     * placements — never take the whole page down with it. That is the /summary lesson from
     * 08-01 applied forward: three routes broke together because one column was missing, and
     * the detail page went with them silently. */
    Promise.all([
      API.get('/artworks'),
      API.get('/summary'),
      API.get('/editions?artwork=' + encodeURIComponent(id)),
      API.get('/images?artwork=' + encodeURIComponent(id)).catch(function (e) {
        Core.toast('Photographs did not load: ' + (e.message || e), 'bad');
        return { photos: [] };
      })
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

      cur.name = art.name;
      cur.editions = (r[2] && r[2].editions) || [];
      cur.photos = (r[3] && r[3].photos) || [];

      host.innerHTML = render(art, sum, places, cur.editions);
      wirePhotos();
    }).catch(function (e) { Core.fail(host, e); });
  }

  window.Artwork = { mount: mount };
})();
