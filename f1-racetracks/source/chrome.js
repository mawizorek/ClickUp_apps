/* chrome.js — THE ONE CHROME RENDERER (new 2026-08-01, v18).

   WHY THIS FILE EXISTS. Michael, after a duplicate header shipped: "lock that shit down.
   why are these not served the same in the backend? should not be this hard???"

   It was not hard because chrome was complicated. It was hard because chrome was never
   SERVED — it was WRITTEN THREE TIMES, in three different languages, on three surfaces:

     circuits.html        static HTML in the document
     standings.html       static HTML in the document (added v17)
     weekend/nav.js       a JS template string built at runtime
     index.html           a FOURTH copy, for the shell itself

   ...and then three of those four had to be HIDDEN when the shell embedded them, through
   TWO different mechanisms (a selector list inside app-shell.js for standings + circuits,
   a `html.shell-embedded` CSS rule for weekend). Adding a header row meant knowing which
   of the two governed your lens. v17 added one and knew neither. That is not a discipline
   problem; four copies and two hide-mechanisms is a defect generator.

   WHAT THIS IS. One renderer. Every surface drops a `<div data-chrome>` where its header
   goes and loads this file. The markup for the brand and the lens switcher now exists in
   exactly ONE place in the repo.

   🔒 THE LOCK — and it is structural, not a rule to remember:

   THIS MODULE CHECKS FOR EMBEDDING ITSELF AND RENDERS NOTHING WHEN EMBEDDED.

   A lens cannot double the header, because a lens no longer draws a header — it asks for
   one, and the thing that draws it already knows whether the shell owns the chrome. There
   is no step to forget. The old hide-rules in chrome-tokens.css §6 and app-shell.js's
   EMBED_CSS stay as a net for the case where a stale cached chrome.js still emits markup,
   but they are no longer the mechanism.

   Detection is `window.self !== window.top` FIRST, because it is true the instant the
   iframe document parses — before app-shell.js has adopted anything and before any class
   is added. The `.shell-embedded` class is checked too, for a future host that is not an
   iframe.

   ⚠️ RELATIONSHIP TO THE v7 PORT. Build Order steps 8-13 replace all three shells with one
   router + a chrome module. That is still the destination and this is the same file it
   will use, built early because the duplicate-header class of bug is live now. This is NOT
   a fourth chrome. Do not let it become one: it renders a brand and a switcher. Nothing
   else belongs here.

   USAGE
     <div data-chrome data-lens="matrix"></div>          static surfaces
     F1Chrome.mount(el, { lens: 'weekend' })              JS-built surfaces

   data-lens: matrix | history | circuits | weekend.  `weekend` is a DRILL-THROUGH, not a
   peer tab, so no switcher item is marked current — which is the pre-existing rule, now
   expressed once instead of three times.

   Decision Log J16 (the measurement) · J17 (the token spine) · J18 (the regression) ·
   J19 (this).
*/
(function () {
  'use strict';

  /* The lockup mark. Was duplicated verbatim in circuits.html, standings.html,
     weekend/nav.js and index.html. */
  var MARK = '<span class="mark"><svg viewBox="0 0 24 24" fill="none">'
    + '<path d="M3 17c4-1 6-9 10-9 3 0 4 3 8 2" stroke="white" stroke-width="2.4" stroke-linecap="round"></path>'
    + '<circle cx="6" cy="16.5" r="1.7" fill="white"></circle></span>';

  /* The switcher. Weekend is deliberately absent: it is reached by drilling into a round,
     never by a tab. Order matches the shell's own switcher so the two read identically. */
  var TABS = [
    { key: 'matrix',   label: 'Matrix',   href: './standings.html' },
    { key: 'history',  label: 'History',  href: './standings.html#history' },
    { key: 'circuits', label: 'Circuits', href: './circuits.html' }
  ];

  /* 🔒 THE LOCK. True inside the unified shell's iframes from the moment this parses.
     `self !== top` needs no cooperation from app-shell.js and cannot race it. */
  function isEmbedded() {
    try {
      if (window.self !== window.top) return true;
    } catch (err) {
      return true; /* cross-origin frame access threw: we are framed. */
    }
    return document.documentElement.classList.contains('shell-embedded');
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
    });
  }

  function brandHTML(opts) {
    var href = opts.brandHref || './standings.html';
    return '<a class="brand" href="' + esc(href) + '" aria-label="F1 Racetracks home">'
      + MARK
      + '<span class="t">' + esc(opts.title || 'F1 Racetracks')
      + '<small>' + esc(opts.sub || '2026 Season') + '</small></span></a>';
  }

  function lensHTML(lens) {
    var items = TABS.map(function (t) {
      if (t.key === lens) {
        return '<span class="on" aria-current="page">' + t.label + '</span>';
      }
      return '<a href="' + t.href + '">' + t.label + '</a>';
    }).join('');
    return '<nav class="lens" aria-label="Lens switcher">' + items + '</nav>';
  }

  /* Render into one mount. Returns true if chrome was drawn, false if suppressed —
     a caller that lays out around the header can branch on it. */
  function mount(el, opts) {
    if (!el) return false;
    opts = opts || {};
    if (isEmbedded()) {
      el.innerHTML = '';
      el.setAttribute('data-chrome-state', 'embedded');
      return false;
    }
    el.innerHTML = brandHTML(opts) + lensHTML(opts.lens || el.getAttribute('data-lens') || '');
    el.setAttribute('data-chrome-state', 'rendered');
    return true;
  }

  /* Auto-mount every static `<div data-chrome>` on the page. JS-built surfaces call
     mount() directly once their container exists. */
  function autoMount() {
    var nodes = document.querySelectorAll('[data-chrome]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.getAttribute('data-chrome-state')) continue; /* idempotent */
      mount(el, {
        lens: el.getAttribute('data-lens') || '',
        brandHref: el.getAttribute('data-brand-href') || '',
        title: el.getAttribute('data-title') || '',
        sub: el.getAttribute('data-sub') || ''
      });
    }
  }

  window.F1Chrome = { mount: mount, autoMount: autoMount, isEmbedded: isEmbedded };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoMount, { once: true });
  } else {
    autoMount();
  }
})();
