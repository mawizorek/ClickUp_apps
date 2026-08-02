/* Inciardi Collection — THE VIEWER. One photograph, full screen, from anywhere.
 *
 * ============================================================================
 * ⭐ THIS FILE EXISTS BECAUSE OF ONE SENTENCE. Q28 came back with all four surfaces unstruck
 * and a note: *"want seemless photo integration and linking driven from single source with
 * access across the board."*
 *
 * That note is not a fifth feature. It is a CONSTRAINT on the other four — full-screen viewing,
 * multi-select, sort/filter and a picker on the print's page must be ONE component reading ONE
 * source, not four features that each grow their own photo list and their own idea of what
 * order photographs go in. Four independent photo surfaces is exactly how this app's binder and
 * carousel would have ended up disagreeing about which picture a print IS.
 *
 * So: the print page owns the carousel strip, the Photos grid owns the grid, and BOTH hand off
 * to this for the actual looking-at-a-photograph. Adding a third caller is a call to `open()`.
 * ============================================================================
 *
 * 🔴 PINCH-ZOOM SURVIVES, AND THAT IS THE ONE RULE THIS FILE CANNOT BREAK.
 *
 * J17 refused `preventDefault` on `gesturestart` — the only thing that reliably kills zoom on
 * iOS — for this exact screen, on the grounds that pinching a print is the entire point of
 * photographing it at 1800px. base.css says the same thing from the CSS side.
 *
 * A careless swipe handler undoes that from the other direction: the first finger of a pinch
 * looks precisely like the start of a drag. **So any touch carrying more than one finger
 * abandons swipe tracking immediately and permanently for that gesture.** There is no
 * `preventDefault` anywhere in the gesture path in this file, and none may be added — the
 * browser keeps every native behaviour and this only listens.
 *
 * ⚠️ The 45px threshold is borrowed from the binder's page-turn on purpose. One swipe distance
 * across the app means a gesture that turns a binder face also advances a photograph, rather
 * than two surfaces each having their own idea of how far a swipe is.
 */
(function () {

  var st = { photos: [], i: 0, onAct: null, label: '' };

  /* ⚠️ SECOND COPY OF THIS IN THE APP. `photos.js` has an identical local `imgUrl()`. Not
   * consolidated here because that means editing photos.js, and a UI refactor does not belong
   * in the commit that ships the carousel — but it is one line and it should come here when
   * photos.js is next opened. Named so it is a known duplicate rather than a discovered one. */
  function url(id) { return API.base() + '/image/' + encodeURIComponent(id); }

  /* 🔴 PHOTOS ATTACH TO AN EDITION, NEVER TO AN ARTWORK (J9, Q1) — and nobody thinks in
   * editions, so every caller offers PRINTS and resolves the difference here.
   *
   * The implicit edition is right for almost every print, because an open-run print has exactly
   * one. When EXPLICIT editions exist — a second printing, an "oops" printing, a numbered
   * monoprint — it ASKS, because guessing puts the photograph on the wrong physical object and
   * that distinction is the entire reason the edition layer exists.
   *
   * Returns an edition, or null for "the human cancelled" — which callers must treat as write
   * nothing, not as fall back to the first one.
   *
   * ⚠️ `photos.js` still carries its own copy of this logic inside `attach()`. It should call
   * this instead the next time that file is touched. */
  function pickEdition(editions) {
    var eds = editions || [];
    if (!eds.length) throw new Error('that print has no edition to attach to');
    var explicit = eds.filter(function (e) { return !e.implicit; });
    if (!explicit.length) return eds.filter(function (e) { return e.implicit; })[0] || eds[0];

    var labels = eds.map(function (e, i) {
      return (i + 1) + ') ' + (e.implicit ? 'the standard one' : (e.label || e.edition_id));
    }).join('\n');
    var n = window.prompt('This print has more than one printing. Which one is in the photo?\n\n' + labels, '1');
    var idx = parseInt(n, 10);
    if (!(idx >= 1 && idx <= eds.length)) return null;
    return eds[idx - 1];
  }

  function host() {
    var h = document.getElementById('viewer');
    if (h) return h;
    h = document.createElement('div');
    h.id = 'viewer';
    h.className = 'vw';
    h.hidden = true;
    /* Appended to <body>, not to the route's container, for the same reason chrome.js appends
     * its drawers there: a route change replaces #view, and a full-screen overlay that dies
     * mid-animation with its parent leaves the scroll lock behind. */
    document.body.appendChild(h);
    return h;
  }

  function meta(p) {
    var bits = [];
    if (p.shot_at) bits.push('shot ' + p.shot_at);
    if (p.width && p.height) bits.push(p.width + '\u00d7' + p.height);
    if (p.links > 1) bits.push('on ' + p.links + ' prints');
    if (p.kind && p.kind !== 'upload') bits.push(p.kind + ' \u2014 not your photograph');
    return bits.join(' \u00b7 ');
  }

  function paint() {
    var h = host();
    var p = st.photos[st.i];
    if (!p) return close();

    /* ⭐ THE FRONT MARKER IS POSITIONAL, NOT A STORED FLAG. Since v22 the front photo is simply
     * the first one the server returned (Q26: an ordinal, not a boolean), so "is this the
     * card's photo" is `index === 0` and cannot disagree with the binder. Reading a field here
     * would be a second claimant on a fact the ORDER already carries. */
    var isFront = st.i === 0;

    h.innerHTML =
      '<div class="vw-bar">' +
        '<span class="vw-count">' + (st.i + 1) + ' / ' + st.photos.length +
          (st.label ? ' \u00b7 ' + Core.esc(st.label) : '') + '</span>' +
        '<button type="button" class="vw-x" data-vw="close" aria-label="Close">\u2715</button>' +
      '</div>' +
      '<div class="vw-stage">' +
        (st.photos.length > 1
          ? '<button type="button" class="vw-arrow prev" data-vw="prev" aria-label="Previous photo">\u2039</button>' +
            '<button type="button" class="vw-arrow next" data-vw="next" aria-label="Next photo">\u203a</button>'
          : '') +
        /* No `loading="lazy"`: this is the one image on screen and the reason the user tapped.
         * The onerror is the same honesty rule as the grid — a row whose bytes went missing is a
         * real reportable state, and a blank black screen is indistinguishable from loading. */
        '<img class="vw-img" alt="" src="' + Core.esc(url(p.image_id)) + '"' +
        ' onerror="this.outerHTML=\'<span class=&quot;vw-broken&quot;>These bytes are missing from storage.<br>The row exists; the file does not.</span>\'">' +
      '</div>' +
      '<div class="vw-foot">' +
        '<p class="vw-meta">' + (isFront ? '<b class="vw-isfront">\u2b50 on the card</b> \u00b7 ' : '') +
          Core.esc(meta(p)) + '</p>' +
        (st.photos.length > 1
          ? '<div class="vw-strip">' + st.photos.map(function (q, n) {
              return '<button type="button" class="vw-th' + (n === st.i ? ' on' : '') +
                '" data-vw-go="' + n + '" aria-label="Photo ' + (n + 1) + '">' +
                '<img loading="lazy" alt="" src="' + Core.esc(url(q.image_id)) + '">' +
                (n === 0 ? '<span class="vw-thfront">\u2b50</span>' : '') + '</button>';
            }).join('') + '</div>'
          : '') +
        '<div class="vw-acts">' +
          /* ⚠️ THE BUTTON IS HIDDEN ON THE FRONT PHOTO, NOT DISABLED, AND NOT ALWAYS SHOWN.
           * Q26 → A said hide the control when there is nothing for it to do. Under the ordinal
           * that is a sharper test than "one photo": the control is meaningless on the photo
           * that is ALREADY first, whether there is one photo or nine. A disabled button claims
           * there is a way to make it go. */
          (isFront ? '' : '<button type="button" class="primary" data-vw="front">\u2b50 Put on the card</button>') +
          '<button type="button" data-vw="unlink">Remove from this print</button>' +
          '<button type="button" class="ghost" data-vw="archive">Archive</button>' +
        '</div>' +
        /* Stated in the UI rather than only in a comment, same as the Photos drawer: someone
         * hunting for a caption box needs to know it is absent on purpose. */
        '<p class="vw-note">Captions are not editable yet \u2014 the worker has no route for it. ' +
        'Archiving hides a photo everywhere and never deletes the file.</p>' +
      '</div>';

    [].forEach.call(h.querySelectorAll('[data-vw]'), function (b) {
      b.addEventListener('click', function () { act(b.dataset.vw); });
    });
    [].forEach.call(h.querySelectorAll('[data-vw-go]'), function (b) {
      b.addEventListener('click', function () { go(parseInt(b.dataset.vwGo, 10)); });
    });

    var strip = h.querySelector('.vw-strip .on');
    if (strip && strip.scrollIntoView) strip.scrollIntoView({ block: 'nearest', inline: 'center' });
  }

  function go(n) {
    if (n < 0 || n >= st.photos.length) return;
    st.i = n;
    paint();
  }

  function act(what) {
    var p = st.photos[st.i];
    if (what === 'close') return close();
    if (what === 'prev') return go(st.i - 1);
    if (what === 'next') return go(st.i + 1);
    if (!p) return;

    /* ⭐ "PUT ON THE CARD" IS A MOVE, NOT A FLAG (Q26 + J26). The worker writes MIN(sort) - 1,
     * so this photo goes to the front of THIS print's order and the one that was there falls
     * back into the derive. That is what makes it undoable without an unstar verb: you undo it
     * by putting a different photo on the card.
     *
     * ⚠️ It needs `edition_id`, not `artwork_id`. The order lives on the LINK. */
    if (what === 'front') {
      return write('/image/primary', { image_id: p.image_id, edition_id: p.edition_id },
                   'On the card. Tap another photo\u2019s star to change it.');
    }
    if (what === 'unlink') {
      return write('/image/assign', { image_id: p.image_id, edition_id: p.edition_id, unlink: true },
                   'Taken off this print. The photo is still in Photos.');
    }
    if (what === 'archive') {
      return write('/image/archive', { image_id: p.image_id },
                   'Archived \u2014 the file is kept, permanently.');
    }
  }

  function write(path, body, okMsg) {
    API.post(path, body).then(function () {
      Core.toast(okMsg, 'good');
      close();
      /* The CALLER re-reads and re-renders. This module does not know which surface opened it
       * and must not guess — the print page reloads its carousel, the grid reloads its grid. */
      if (st.onAct) st.onAct();
    }).catch(function (e) { Core.toast(e.message || String(e), 'bad'); });
  }

  /* ---------- gestures ----------
   * 🔴 READ THE HEADER BEFORE TOUCHING ANY OF THIS. Two fingers = a pinch = hands off, and
   * nothing here calls preventDefault. */
  var sx = 0, sy = 0, tracking = false;

  function down(e) {
    if (e.touches.length > 1) { tracking = false; return; }   // pinch: not ours
    tracking = true;
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
  }
  function move(e) {
    // A second finger arriving MID-GESTURE is a pinch that started as a tap. Drop it.
    if (e.touches.length > 1) tracking = false;
  }
  function up(e) {
    if (!tracking) return;
    tracking = false;
    var t = e.changedTouches && e.changedTouches[0];
    if (!t) return;
    var dx = t.clientX - sx, dy = t.clientY - sy;
    /* Horizontal INTENT, not just horizontal distance: |dx| must beat the threshold AND beat
     * the vertical movement, or a diagonal scroll flicks the photograph sideways. */
    if (Math.abs(dx) < 45 || Math.abs(dx) <= Math.abs(dy)) return;
    go(st.i + (dx < 0 ? 1 : -1));
  }

  function keys(e) {
    if (e.key === 'Escape') return close();
    if (e.key === 'ArrowRight') return go(st.i + 1);
    if (e.key === 'ArrowLeft') return go(st.i - 1);
  }

  function close() {
    var h = document.getElementById('viewer');
    if (h) { h.hidden = true; h.innerHTML = ''; }
    document.body.classList.remove('vw-open');
    document.removeEventListener('keydown', keys);
  }

  /* opts: { photos: [...], index: n, label: 'PBR', onAct: fn }
   * `photos` must arrive IN DISPLAY ORDER — the worker's order, untouched. Sorting it here
   * would be the second ordering the whole v22 pass exists to prevent. */
  function open(opts) {
    st.photos = (opts && opts.photos) || [];
    st.i = Math.max(0, Math.min((opts && opts.index) || 0, st.photos.length - 1));
    st.onAct = (opts && opts.onAct) || null;
    st.label = (opts && opts.label) || '';
    if (!st.photos.length) return;

    var h = host();
    h.hidden = false;
    /* Locks the page behind the overlay. Removed in close(), including the close() that runs
     * after a write — a scroll lock that outlives its overlay is a dead app. */
    document.body.classList.add('vw-open');
    paint();

    h.addEventListener('touchstart', down, { passive: true });
    h.addEventListener('touchmove', move, { passive: true });
    h.addEventListener('touchend', up, { passive: true });
    document.addEventListener('keydown', keys);
  }

  window.Viewer = { open: open, close: close, url: url, pickEdition: pickEdition };
})();
