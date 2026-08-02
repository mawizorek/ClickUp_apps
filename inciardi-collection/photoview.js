/* Inciardi Collection — THE PHOTO SURFACE. One module, every screen that shows a photograph.
 *
 * ============================================================================
 * 🔴 A MODULE WITH NO PAGE, AND THAT IS THE POINT.
 *
 * Q28 came back with every option unstruck and a note: *"want seemless photo integration and
 * linking driven from single source with access across the board."* Read as a CONSTRAINT on the
 * four options rather than a fifth option — which changes what gets built.
 *
 * The obvious build was a carousel function inside `artwork.js`. That is exactly what the note
 * forbids: `photos.js` could never reach it, so the day the grid wants a full-screen view it
 * grows a second one, and then there are two answers to "how do I look at a photograph."
 *
 *   PhotoView.mount(host, opts)   hero + filmstrip + actions, for one print
 *   PhotoView.open(list, index)   the full-screen viewer, for ANY list of photos
 *   PhotoView.url(image_id)       the one place an image URL is built
 *
 * ⚠️ `photos.js` DOES NOT CALL THIS YET. Wiring its tiles to `PhotoView.open` is a two-line
 * change and it is deliberately not in this commit: a UI change to a screen that already works
 * does not belong in the commit that creates the thing it would call. Seam built and named.
 * ============================================================================
 *
 * 🔴 DO NOT BREAK PINCH-ZOOM. Defended THREE ways, because it is the one thing here that cannot
 * be fixed later by someone who did not know it mattered:
 *
 *   1. The swipe handler ABANDONS on a second touch point. A pinch BEGINS as a touchstart, so a
 *      handler that ignores `touches.length` reads the first finger of a pinch as a swipe.
 *   2. `touch-action: pan-y pinch-zoom` on the stage (photoview.css). The browser keeps vertical
 *      panning and pinching; only the horizontal axis is ours. That is why nothing here calls
 *      preventDefault — CSS splits the axes before the gesture is disambiguated, where JS has to
 *      guess at an unfinished gesture.
 *   3. 🚫 `gesturestart` IS NEVER TOUCHED. J17 refused `preventDefault` on it specifically to
 *      preserve pinch for this screen, and left a zoom misfire unfixed elsewhere to do it. That
 *      decision was made FOR this file. Do not spend it.
 *
 * The 45px threshold and the 1.4× dominance test are BORROWED from `binder.js`, not re-picked:
 * two swipeable surfaces that disagree about what counts as a swipe is worse than either number
 * being slightly wrong.
 */
(function () {

  function esc(s) { return Core.esc(s); }

  /* THE ONLY PLACE AN IMAGE URL IS BUILT. The bucket is private and `GET /image/:id` is the one
   * door (J13). `API.base()` rather than a constant, so a device pointed at a staging worker
   * loads that worker's pictures. */
  function url(id) { return API.base() + '/image/' + encodeURIComponent(id); }

  /* Module-level and deliberately small: the CURRENT list and where you are in it. The viewer and
   * the strip must never hold two copies of that. */
  var strip = null;      // { host, artworkId, photos, editions, index }
  var viewer = null;     // { el, list, i } while the full-screen viewer is up

  /* ============================================================ FULL SCREEN (Q28 A)
   * Appended to <body>, not to the page: a viewer nested in the routed view sits UNDER the
   * chrome and cannot go edge to edge.
   * ⚠️ NOT a `.page-drawer` and it does not use `Drawer`. Those are bottom sheets sized to leave
   * the page visible behind them; this is the opposite of that.
   */
  function viewerHTML(p, i, n) {
    var meta = [];
    if (p.shot_at) meta.push('shot ' + String(p.shot_at).slice(0, 10));
    if (p.width && p.height) meta.push(p.width + '\u00d7' + p.height);
    if (p.links > 1) meta.push('on ' + p.links + ' prints');
    return '' +
      '<div class="pv-bar">' +
        '<button type="button" class="pv-x" data-pv="close" aria-label="Close">\u2715</button>' +
        '<span class="pv-count">' + (i + 1) + ' / ' + n + '</span>' +
      '</div>' +
      '<div class="pv-stage" data-pv="stage">' +
        '<img class="pv-img" alt="' + esc(p.caption || 'Photograph of this print') +
          '" src="' + esc(url(p.image_id)) + '">' +
      '</div>' +
      '<div class="pv-foot">' +
        (p.caption ? '<p class="pv-cap">' + esc(p.caption) + '</p>' : '') +
        '<p class="pv-meta">' + esc(meta.join(' \u00b7 ')) + '</p>' +
        (n > 1 ? '<div class="pv-nav">' +
            '<button type="button" data-pv="prev" aria-label="Previous">\u2039</button>' +
            '<button type="button" data-pv="next" aria-label="Next">\u203a</button>' +
          '</div>' : '') +
      '</div>';
  }

  function paintViewer() {
    if (!viewer) return;
    viewer.el.innerHTML = viewerHTML(viewer.list[viewer.i], viewer.i, viewer.list.length);
    bindSwipe(viewer.el.querySelector('[data-pv="stage"]'));
  }

  /* Wraps rather than stopping at the ends. A three-photo carousel that refuses to pass the last
   * frame reads as broken on a phone, where nothing on screen says you are at the end. */
  function step(d) {
    if (!viewer || viewer.list.length < 2) return;
    viewer.i = (viewer.i + d + viewer.list.length) % viewer.list.length;
    paintViewer();
  }

  function closeViewer() {
    if (!viewer) return;
    document.removeEventListener('keydown', viewerKeys);
    if (viewer.el.parentNode) viewer.el.parentNode.removeChild(viewer.el);
    document.body.classList.remove('pv-open');
    viewer = null;
  }

  function viewerKeys(e) {
    if (e.key === 'Escape') closeViewer();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  }

  function open(list, i) {
    if (!list || !list.length) return;
    closeViewer();
    var el = document.createElement('div');
    el.className = 'pv';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Photograph');
    viewer = { el: el, list: list, i: Math.max(0, Math.min(i || 0, list.length - 1)) };
    document.body.appendChild(el);
    /* Locks the page behind it. Without this, a vertical drag the swipe handler correctly ignores
     * scrolls the print page underneath, so closing drops you somewhere you never navigated to. */
    document.body.classList.add('pv-open');
    paintViewer();
    document.addEventListener('keydown', viewerKeys);

    el.addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-pv]');
      var what = b && b.getAttribute('data-pv');
      if (what === 'close') closeViewer();
      else if (what === 'prev') step(-1);
      else if (what === 'next') step(1);
      /* The backdrop closes; the photograph does not. A tap on the image is how you steady a
       * pinch, and closing on it would make zooming feel like a trap. */
      else if (ev.target === el) closeViewer();
    });
  }

  /* 🔴 READ THE PINCH NOTE IN THE HEADER BEFORE TOUCHING THIS. No preventDefault anywhere, on
   * purpose — the axis split is done in CSS. */
  function bindSwipe(stage) {
    if (!stage) return;
    var x0 = null, y0 = null, dead = false;

    stage.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { dead = true; x0 = null; return; }   // two fingers = a pinch
      dead = false; x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });

    // A second finger landing mid-gesture is a pinch beginning late. Kill the swipe.
    stage.addEventListener('touchmove', function (e) {
      if (e.touches.length > 1) { dead = true; x0 = null; }
    }, { passive: true });

    stage.addEventListener('touchend', function (e) {
      if (dead || x0 == null) { x0 = null; return; }
      var t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0;
      x0 = null;
      /* The dominance test stops a lazy diagonal scroll turning the photo, and it matters more
       * here than on the binder because this stage also pans vertically when zoomed in. */
      if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
      step(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  /* ============================================================ THE STRIP
   * What lands in the block `artwork.js` cut to shape at v19.
   *
   * ⭐ THE HERO IS `photos[0]` AND NOTHING CHOOSES IT HERE. The worker returns them in display
   * order (`photoOrder()` in worker/links.js) and names the winner in its own `card` field. A
   * `sort()` in this file would be the second ordering v22 spent a PR making impossible. If the
   * hero looks wrong, the RANKING is wrong — fix it there.
   */
  function stripHTML(s) {
    var ps = s.photos;
    if (!ps.length) {
      return '<div class="pv-none"><p><b>No photograph of this print yet.</b></p>' +
        '<p class="pv-hint">Shoot one, or attach a picture you have already uploaded.</p>' +
        actionsHTML(s) + '</div>';
    }
    var hero = ps[0];
    return '' +
      '<div class="pv-hero">' +
        '<button type="button" class="pv-heroimg" data-pvi="0" ' +
          'aria-label="Open full screen">' +
          '<img src="' + esc(url(hero.image_id)) + '" alt="' +
            esc(hero.caption || 'Photograph of this print') + '">' +
        '</button>' +
        /* Names the derived winner out loud. The Q26 complaint was that starring produced a toast
         * and no visible change; a label saying which photo is the card's makes the
         * bring-to-front write observable at ANY count, including one. */
        '<p class="pv-onthecard">\u2b50 On the binder card</p>' +
      '</div>' +
      (ps.length > 1 ? filmstripHTML(ps) : '') +
      actionsHTML(s);
  }

  function filmstripHTML(ps) {
    return '<div class="pv-film">' + ps.map(function (p, i) {
      return '<button type="button" class="pv-frame' + (i === 0 ? ' is-card' : '') +
        '" data-pvi="' + i + '" aria-label="Photograph ' + (i + 1) + ' of ' + ps.length + '">' +
        '<img src="' + esc(url(p.image_id)) + '" alt="" loading="lazy">' +
        (p.links > 1 ? '<span class="pv-pack">' + p.links + '</span>' : '') +
        '</button>';
    }).join('') + '</div>';
  }

  /* ⭐ THE STAR IS ONLY OFFERED WHEN IT CAN DO SOMETHING (Q26 → A). With one photograph there is
   * nothing to promote it above, so the control is ABSENT rather than present-and-inert. The
   * "on the binder card" label above carries the meaning when there is only one.
   *
   * ⚠️ It reads "use this one", not "make main". The old label described a STATE; since v22 it is
   * a MOVE — the photo goes to the front and starring another takes it back. Naming it as a verb
   * is the honest half of the mechanism change. */
  function actionsHTML(s) {
    var many = s.photos.length > 1;
    return '<div class="pv-acts">' +
      '<button type="button" class="primary" data-pva="shoot">\uD83D\uDCF7 Take a photo</button>' +
      '<button type="button" data-pva="pick">Attach an existing photo</button>' +
      (many ? '<button type="button" data-pva="front">\u2b50 Use this one on the card</button>' : '') +
      (s.photos.length ? '<button type="button" class="ghost" data-pva="unlink">Remove from this print</button>' : '') +
    '</div>';
  }

  function paintStrip() { if (strip) strip.host.innerHTML = stripHTML(strip); }

  /* Photos attach to EDITIONS (J9, Q1) and nobody thinks in editions, so resolution happens here.
   * One printing: use it. Several: ASK — putting a photo on the wrong printing is the precise
   * distinction the edition layer exists to preserve. Same rule photos.js follows, stated in both
   * places because it is a POLICY; a shared helper would hide it from both readers. */
  function editionFor(s) {
    var eds = s.editions || [];
    if (!eds.length) return null;
    if (eds.length === 1) return eds[0].edition_id;
    var labels = eds.map(function (e, i) {
      return (i + 1) + ') ' + (e.implicit ? 'the original' : (e.label || e.edition_id));
    }).join('\n');
    var pick = window.prompt('This print has ' + eds.length +
      ' printings. Which one is this a photo of?\n\n' + labels, '1');
    var n = parseInt(pick, 10);
    if (!n || n < 1 || n > eds.length) return null;
    return eds[n - 1].edition_id;
  }

  function reload() {
    if (!strip) return Promise.resolve();
    return API.get('/images?artwork=' + encodeURIComponent(strip.artworkId))
      .then(function (r) { strip.photos = (r && r.photos) || []; paintStrip(); });
  }

  function act(what) {
    var s = strip;
    if (!s) return;

    if (what === 'shoot') {
      if (!window.Capture || !Capture.pick) {
        return Core.toast('capture.js did not load \u2014 check the script tags', 'bad');
      }
      var ed = editionFor(s);
      if (!ed) return Core.toast('No printing to attach to', 'bad');
      /* Uploads STRAIGHT ONTO this print — `POST /image?edition_id=` attaches on arrival, which is
       * why that parameter exists. The alternative is upload, go to Photos, find it, attach,
       * come back: four steps to do the obvious thing. */
      return Capture.pick({ edition_id: ed, onDone: function () { reload(); } });
    }

    if (what === 'front') {
      var p = s.photos[s.index || 0];
      if (!p) return;
      if ((s.index || 0) === 0) {
        /* Refuses rather than writing a no-op. Starring the photo already at the front would
         * succeed, change nothing and toast "done" — the exact Q26 defect this pass exists to
         * kill, reintroduced one layer up. */
        return Core.toast('That one is already on the card', 'good');
      }
      return API.post('/image/primary', { image_id: p.image_id, edition_id: p.edition_id })
        .then(function () { s.index = 0; return reload(); })
        .then(function () { Core.toast('Moved to the front', 'good'); })
        .catch(function (e) { Core.toast(e.message || String(e), 'bad'); });
    }

    if (what === 'unlink') {
      var q = s.photos[s.index || 0];
      if (!q) return;
      if (!window.confirm('Take this photograph off this print?\n\nThe photo is kept \u2014 it ' +
            'stays in Photos and on any other print it is attached to.')) return;
      return API.post('/image/assign', { image_id: q.image_id, edition_id: q.edition_id, unlink: true })
        .then(function () { s.index = 0; return reload(); })
        .then(function () { Core.toast('Removed from this print', 'good'); })
        .catch(function (e) { Core.toast(e.message || String(e), 'bad'); });
    }

    if (what === 'pick') return openPicker();
  }

  /* ============================================================ ATTACH AN EXISTING PHOTO (Q28 D)
   * The reverse of the attach that already exists. Today the only way to put a photo on a print
   * is to open Photos, find it and attach from there — backwards when you are already looking at
   * the print.
   *
   * Shows UNASSIGNED photos, the same default Photos itself opens on (Q19 + J15) and for the same
   * reason. ⚠️ It does NOT offer already-attached photos, so a pack shot cannot be added to a
   * second print from here yet. Named rather than hidden: the fix is a scope switch in this
   * drawer, and it waits until someone wants it.
   */
  function openPicker() {
    var host = document.getElementById('pvPick');
    if (!host) return Core.toast('This page has no photo picker mounted', 'bad');
    Core.busy(host, 'Reading your unfiled photos\u2026');
    Drawer.open(host);
    API.get('/images').then(function (r) {
      var imgs = (r && r.images) || [];
      var head = '<div class="pv-pickhead"><b>' +
        (imgs.length ? imgs.length + ' unfiled photo' + (imgs.length === 1 ? '' : 's')
                     : 'Nothing unfiled') +
        '</b><button type="button" data-pva="pickclose">Close</button></div>';
      if (!imgs.length) {
        host.innerHTML = head + '<p class="pv-hint">Every photo you have uploaded is already on ' +
          'a print. Take a new one, or unfile one from Photos first.</p>';
        return;
      }
      host.innerHTML = head + '<div class="pv-grid">' + imgs.map(function (im) {
        return '<button type="button" class="pv-cell" data-pvpick="' + esc(im.image_id) + '">' +
          '<img src="' + esc(url(im.image_id)) + '" alt="" loading="lazy">' +
          (im.shot_at ? '<span class="pv-when">' + esc(String(im.shot_at).slice(5, 10)) + '</span>' : '') +
        '</button>';
      }).join('') + '</div>';
    }).catch(function (e) { Core.fail(host, e); });
  }

  function attach(imageId) {
    var s = strip;
    if (!s) return;
    var ed = editionFor(s);
    if (!ed) return Core.toast('No printing to attach to', 'bad');
    API.post('/image/assign', { image_id: imageId, edition_id: ed })
      .then(function () { Drawer.closeAll(); s.index = 0; return reload(); })
      .then(function () { Core.toast('Attached to this print', 'good'); })
      .catch(function (e) { Core.toast(e.message || String(e), 'bad'); });
  }

  /* ONE delegated listener on the host, not one per frame: the strip is rebuilt wholesale after
   * every write, and per-element handlers would need rebinding each time — which is how a button
   * silently stops working after the second edit. */
  function mount(host, opts) {
    if (!host) return;
    var artworkId = (opts && opts.artwork) || '';
    if (!artworkId) return;

    strip = { host: host, artworkId: artworkId, photos: [], editions: [], index: 0 };
    Core.busy(host, 'Reading the photographs\u2026');

    host.addEventListener('click', function (ev) {
      var f = ev.target.closest('[data-pvi]');
      if (f && strip) {
        var i = parseInt(f.getAttribute('data-pvi'), 10) || 0;
        strip.index = i;
        /* A filmstrip tap SELECTS; the hero, or a second tap, OPENS. Selecting has to be possible
         * without opening, because "use this one on the card" acts on the selection — a tap that
         * always went full-screen would put the star behind a detour. */
        if (f.classList.contains('pv-heroimg') || f.classList.contains('is-sel')) {
          open(strip.photos, i);
        } else {
          [].forEach.call(host.querySelectorAll('.pv-frame'), function (b) {
            b.classList.toggle('is-sel', b === f);
          });
        }
        return;
      }
      var pk = ev.target.closest('[data-pvpick]');
      if (pk) return attach(pk.getAttribute('data-pvpick'));
      var a = ev.target.closest('[data-pva]');
      if (!a) return;
      if (a.getAttribute('data-pva') === 'pickclose') return Drawer.closeAll();
      act(a.getAttribute('data-pva'));
    });

    /* Editions are fetched HERE rather than handed in, even though artwork.js also reads them:
     * this module has to work when something other than the print page mounts it, and a
     * dependency only one caller can satisfy is not a shared component. */
    Promise.all([
      API.get('/images?artwork=' + encodeURIComponent(artworkId)),
      API.get('/editions?artwork=' + encodeURIComponent(artworkId))
    ]).then(function (r) {
      if (!strip || strip.artworkId !== artworkId) return;   // navigated away mid-flight
      strip.photos = (r[0] && r[0].photos) || [];
      strip.editions = (r[1] && r[1].editions) || [];
      paintStrip();
    }).catch(function (e) { Core.fail(host, e); });
  }

  window.PhotoView = { mount: mount, open: open, url: url };
})();
