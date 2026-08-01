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
 * ⭐ v20 CLOSED IT. The photo block below is no longer an apology; it is a camera. Six days from
 * the answer to the surface, and one more version to the control the answer actually promised.
 * ============================================================================
 *
 * 🔴 IT READS `/summary` AND `/images`, AND ADDS NO ROUTE OF ITS OWN.
 * `/summary` already returns every print's counts plus every placement, and the Collection
 * matrix renders off exactly that response. `/images` already returns every photo with the
 * editions it is attached to. Giving this page its own endpoints would mean SECOND queries
 * computing the same facts — and two queries that answer one question eventually disagree.
 * The cost is honest and small: it fetches collection-wide JSON to render one print. At this
 * size that is one small payload. **If it ever gets slow, the fix is a route that SELECTS from
 * the same view, never a second calculation.**
 */
(function () {

  var last = null;      // the params of the current render, so an upload can refresh in place
  var shots = [];       // this print's photographs, in the order the filmstrip shows them

  function esc(s) { return Core.esc(String(s == null ? '' : s)); }
  function imgUrl(im) { return API.base() + '/image/' + encodeURIComponent(im.image_id); }

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

  /* ============================================================ photographs (v20)
   *
   * ⭐ THE CAMERA IS HERE AND IN Photos, FROM ONE MODULE — Q15 → A, verbatim. Shooting from a
   * print's own page attaches the photo the moment it exists, so the whole library step is
   * skipped for the common case. The library is for the OTHER workflow: thirty prints in one
   * sitting, filed later.
   *
   * 🔴 THE STAR IS SHOWN ONLY WHERE IT IS PROVABLY TRUE, AND THAT IS A REAL LIMITATION.
   * `/images` returns `is_primary_anywhere` = MAX(is_primary) across EVERY link a photo has. For
   * a photograph attached to this one print that is exact. For a PACK SHOT attached to nine
   * prints it says "primary somewhere" and cannot say where — so rendering a star off it would
   * mark a photo as this print's main picture on the strength of it being another print's.
   * **A small confident lie is the defect class this entire schema exists to refuse**, so the
   * star renders only when `links === 1` and is simply absent otherwise. The fix is a
   * per-edition flag on `/images`; deferred, not pretended.
   */
  function photoBlock(eds, imgs) {
    var edSet = {};
    eds.forEach(function (e) { edSet[e.edition_id] = true; });

    shots = imgs.filter(function (im) {
      return String(im.edition_ids || '').split(',').some(function (id) { return edSet[id]; });
    });

    /* ONE BUTTON PER IMPRESSION when there is more than one, rather than a picker. A Brooklyn
     * Ginkgo monoprint genuinely needs its own photograph, so which one you are shooting IS the
     * question — and a print with a single implicit edition gets one button and no question at
     * all, because a choice with one option is a tap. */
    var add = (eds.length === 1)
      ? '<button class="btn" data-shoot="' + esc(eds[0].edition_id) + '">Add a photo</button>'
      : eds.map(function (e) {
          return '<button class="btn" data-shoot="' + esc(e.edition_id) + '">Photograph ' +
            esc(e.implicit ? 'this print' : (e.label || e.edition_id)) + '</button>';
        }).join('');

    if (!shots.length) {
      return '<h2 class="aw-h">Photographs</h2>' +
        '<div class="aw-ph aw-ph-none">' +
          '<p><b>No photograph of this print yet.</b></p>' +
          '<p class="aw-note">Take one and it attaches here immediately — nothing to file. ' +
          'Or attach one you already took from <a href="#photos">Photographs</a>.</p>' +
          '<div class="aw-ph-acts">' + add + '</div>' +
        '</div>';
    }

    var strip = shots.length > 1
      ? '<div class="aw-strip">' + shots.map(function (im, i) {
          return '<button class="aw-thumb' + (i === 0 ? ' is-on' : '') + '" data-i="' + i + '">' +
            '<img src="' + esc(imgUrl(im)) + '" alt="" loading="lazy"></button>';
        }).join('') + '</div>'
      : '';

    return '<h2 class="aw-h">Photographs</h2>' +
      '<div class="aw-ph">' +
        '<div class="aw-ph-main"><img id="awMain" src="' + esc(imgUrl(shots[0])) +
          '" alt="' + esc(shots[0].caption || 'photograph of this print') + '"></div>' +
        strip +
        '<p class="aw-note" id="awShot"></p>' +
        '<div class="aw-ph-acts">' +
          '<button class="btn btn-ghost" id="awPrimary" hidden>Use as the main picture</button>' +
          add +
        '</div>' +
      '</div>';
  }

  /* Swapping the shown photograph is a src change and two class toggles, not a re-render: the
   * page around it has not changed, and re-rendering would refetch every thumbnail. */
  function showShot(i) {
    var im = shots[i];
    if (!im) return;
    var main = document.getElementById('awMain');
    if (main) { main.src = imgUrl(im); main.alt = im.caption || 'photograph of this print'; }

    [].forEach.call(document.querySelectorAll('.aw-thumb'), function (b) {
      b.classList.toggle('is-on', b.getAttribute('data-i') === String(i));
    });

    var note = document.getElementById('awShot');
    if (note) {
      var bits = [];
      if (im.shot_at) bits.push('shot ' + im.shot_at);
      if (im.credit && im.credit !== 'you') bits.push('by ' + im.credit);
      if (im.kind !== 'upload') bits.push('Anastasia&#39;s shop photo');
      if (Number(im.links) > 1) bits.push('also on ' + (Number(im.links) - 1) + ' other print' +
        (Number(im.links) === 2 ? '' : 's'));
      note.innerHTML = bits.join(' · ');
    }

    // See the block comment: only unambiguous when this photo has exactly one link.
    var btn = document.getElementById('awPrimary');
    if (btn) {
      var solo = Number(im.links) === 1;
      var isPrimary = solo && Number(im.is_primary_anywhere) === 1;
      btn.hidden = isPrimary;
      btn.setAttribute('data-img', im.image_id);
      btn.setAttribute('data-ed', String(im.edition_ids || '').split(',')[0] || '');
    }
  }

  function render(art, sum, places, eds, imgs) {
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
      photoBlock(eds, imgs) +
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

  function wire(host) {
    if (shots.length) showShot(0);

    host.addEventListener('click', function (e) {
      var thumb = e.target.closest('.aw-thumb');
      if (thumb) { showShot(Number(thumb.getAttribute('data-i'))); return; }

      var shoot = e.target.closest('[data-shoot]');
      if (shoot) {
        Capture.shoot({
          edition_id: shoot.getAttribute('data-shoot'),
          subject: 'single',
          onDone: function () { mount(last); }      // refetch: the strip is now stale
        });
        return;
      }

      var prim = e.target.closest('#awPrimary');
      if (prim) {
        API.post('/image/primary', {
          image_id: prim.getAttribute('data-img'),
          edition_id: prim.getAttribute('data-ed')
        }).then(function () {
          Core.toast('That is the main picture now', 'good');
          mount(last);
        }).catch(function (err) { Core.toast(err.message || String(err), 'bad'); });
      }
    });
  }

  function mount(params) {
    var host = document.getElementById('artWrap');
    if (!host) return;
    last = params;

    var id = (params && params.id) || '';
    if (!id) { host.innerHTML = noId(); return; }

    Core.busy(host, 'Reading the collection…');

    /* Four reads in parallel, each answering something the others cannot:
     *   /artworks  the descriptive fields — notes, medium, edition_type, provenance, retail
     *   /summary   the counts AND every placement (see the header on why not a new route)
     *   /editions  this print's impressions
     *   /images    every photograph, with the editions each is attached to
     * Promise.all rather than a chain: they do not depend on each other, and a phone on a slow
     * connection should pay for one round trip rather than four. */
    Promise.all([
      API.get('/artworks'),
      API.get('/summary'),
      API.get('/editions?artwork=' + encodeURIComponent(id)),
      API.get('/images?scope=all&assigned=any')
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

      host.innerHTML = render(art, sum, places, (r[2] && r[2].editions) || [],
                              (r[3] && r[3].images) || []);
      wire(host);
    }).catch(function (e) { Core.fail(host, e); });
  }

  window.Artwork = { mount: mount };
})();
