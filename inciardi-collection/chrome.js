/* Inciardi Collection — APP CHROME. The frame every route shares: header, nav drawer, scrim,
 * footer. The settings panel is `settings.js`; this file still owns OPENING and CLOSING it,
 * because drawer state is shared between the two panels and a second owner of that state is how
 * you end up with both open at once.
 *
 * Adopted from `template-app/chrome.js` (gold standard v5) on 2026-07-30. Built ONCE and shared
 * by every route, from a config object.
 *
 * WHAT THE TEMPLATE ALREADY SOLVED AND WE HAD SOLVED WRONG: this app put its nav INLINE in the
 * header, which is why it wrapped to two lines on a phone at v5 and why the app carried a comment
 * reading "FOUR ITEMS IS THE CEILING." The template's answer is a hamburger and a LEFT DRAWER,
 * which has no item ceiling. Also adopted: a FOOTER — this app had none, so its version stamp
 * lived nowhere.
 *
 * Left and right drawers are mirror images, one shared scrim, mutually exclusive, Escape closes,
 * focus returns to whatever opened them. Zero colour literals.
 */
(function () {
  var open = { nav: false, settings: false };
  var lastTrigger = null;      // focus returns here when a drawer closes
  var cfg = null;              // the config object, kept for setActive
  var titles = {};             // route -> label, for the header and the tab title

  function $(id) { return document.getElementById(id); }

  /* ---------- header: hamburger · PAGE TITLE · gear ----------
   * 🔴 v11 — THE HEADER NAMES THE PAGE, NOT THE APP. Michael: "the PAGE TITLE at the top should
   * be CENTERED." Until then the centre of the header carried the wordmark on all four routes,
   * left-aligned next to the hamburger. That answered a question nobody had ("which app is
   * this") and left the real one unanswered ("which page am I on") — the nav drawer knew, but
   * you had to open it to find out.
   *
   * THREE ZONES ON A GRID, not flex. `42px minmax(0,1fr) 42px` makes the middle column
   * mathematically centred in the header regardless of what the flanking buttons contain.
   * `justify-content: center` on a flex row would centre the title in the LEFTOVER space, which
   * shifts it whenever one side is wider — the classic almost-centred header.
   *
   * TWO LINES, ZERO EXTRA HEIGHT: kicker ~9px + title ~17px = 26px, inside the 42px the icon
   * buttons already claim. So the app identity survives above the title and the binder stage
   * loses nothing — which matters, because that route is height-locked to the viewport.
   */
  function buildHeader(c) {
    var h = $('appHeader');
    h.innerHTML =
      '<div class="hd-in">' +
        '<button class="hd-icon" id="navBtn" aria-label="Menu" aria-expanded="false" ' +
          'aria-controls="navDrawer"><span class="hd-bars"></span></button>' +
        '<div class="hd-mid">' +
          '<span class="hd-kicker">' +
            '<span class="hd-logo" aria-hidden="true">' + (c.logo || '\u25C6') + '</span>' +
            '<span>' + c.appName + ' ' + (c.appSub || '') + '</span></span>' +
          '<h1 class="hd-title" id="hdTitle">' +
            (titles[c.defaultPage] || c.appName) + '</h1>' +
        '</div>' +
        '<button class="hd-icon" id="gearBtn" aria-label="Settings" aria-expanded="false" ' +
          'aria-controls="settingsDrawer">\u2699</button>' +
      '</div>' +
      '<div id="banner" class="banner" hidden></div>';
    $('navBtn').addEventListener('click', function () { toggle('nav', this); });
    $('gearBtn').addEventListener('click', function () { toggle('settings', this); });
  }

  /* ---------- shared scrim + mutually exclusive drawers ---------- */
  function buildScrim() {
    var s = document.createElement('button');
    s.id = 'chromeScrim';
    s.className = 'chrome-scrim';
    s.hidden = true;
    s.setAttribute('aria-label', 'Close');
    s.addEventListener('click', closeAll);
    document.body.appendChild(s);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && (open.nav || open.settings)) closeAll();
    });
  }

  function setDrawer(which, v) {
    var d = $(which === 'nav' ? 'navDrawer' : 'settingsDrawer');
    var btn = $(which === 'nav' ? 'navBtn' : 'gearBtn');
    if (!d || !btn) return;
    open[which] = v;
    d.classList.toggle('is-open', v);
    d.setAttribute('aria-hidden', String(!v));
    btn.setAttribute('aria-expanded', String(v));
    if (v) {
      var x = d.querySelector('.drawer-x');
      if (x) setTimeout(function () { x.focus(); }, 60);
    }
  }

  function toggle(which, trigger) {
    var willOpen = !open[which];
    if (willOpen && trigger) lastTrigger = trigger;
    // Opening one closes the other, and any page-level drawer too — three stacked panels is how
    // the v4 UI got confusing.
    if (window.Drawer) Drawer.closeAll(true);
    setDrawer('nav', which === 'nav' ? willOpen : false);
    setDrawer('settings', which === 'settings' ? willOpen : false);
    $('chromeScrim').hidden = !(open.nav || open.settings);
    // Re-read on open rather than caching: a resized window changes the answer.
    if (open.settings && window.Settings) Settings.paintDevice();
    if (!open.nav && !open.settings) restoreFocus();
  }

  function restoreFocus() {
    if (lastTrigger) { try { lastTrigger.focus(); } catch (e) {} lastTrigger = null; }
  }

  function closeAll() {
    setDrawer('nav', false);
    setDrawer('settings', false);
    var s = $('chromeScrim');
    if (s) s.hidden = true;
    restoreFocus();
  }

  /* ---------- left: the page menu ----------
   * No item ceiling. A fifth route costs one line of config, where the old inline header would
   * have wrapped.
   * ⚠️ DRAWN FROM `cfg.nav` ONLY, never from `cfg.hidden` or `cfg.detail`. That is the entire
   * mechanism by which an unlisted route stays out of the menu — there is no "is it secret" flag
   * anywhere else, and adding one would be a second place for the answer to live. Hidden routes
   * surface in the SETTINGS panel instead (see the block in settings.js), which is deliberate:
   * quiet, but reachable without an address bar. DETAIL routes surface NOWHERE — they need a
   * param, so a menu row pointing at one would always be broken.
   * The head carries the WORDMARK rather than the word "Menu": the header stopped saying which
   * app this is when the page title took the centre, and a menu is the natural place for
   * identity. The panel is still labelled "Menu" to assistive tech via aria-label. */
  function buildNav(c) {
    var d = document.createElement('aside');
    d.id = 'navDrawer';
    d.className = 'drawer drawer-left';
    d.setAttribute('aria-hidden', 'true');
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-modal', 'true');
    d.setAttribute('aria-label', 'Menu');
    d.innerHTML =
      '<div class="drawer-head"><h2>' +
          '<span class="dh-logo" aria-hidden="true">' + (c.logo || '\u25C6') + '</span> ' +
          c.appName + ' <span class="dh-sub">' + (c.appSub || '') + '</span></h2>' +
        '<button class="drawer-x" id="navX" aria-label="Close menu">\u2715</button></div>' +
      '<nav class="drawer-body nav-list" aria-label="Primary">' +
        c.nav.map(function (n) {
          return '<a class="nav-link" data-route="' + n.route + '" href="#' + n.route + '">' +
            '<span class="nl-t">' + n.label + '</span>' +
            (n.hint ? '<span class="nl-h">' + n.hint + '</span>' : '') + '</a>';
        }).join('') +
      '</nav>';
    document.body.appendChild(d);
    $('navX').addEventListener('click', closeAll);
    d.querySelector('.nav-list').addEventListener('click', function (e) {
      if (e.target.closest('.nav-link')) closeAll();
    });
  }

  /* ---------- right: settings, built by settings.js ----------
   * 🔴 THE FALLBACK IS NOT DEFENSIVE PADDING, IT IS THE DIFFERENCE BETWEEN A BROKEN PANEL AND A
   * BROKEN APP. `boot.js` → wireSettings() reaches straight for `#apiBase` and `#writeKey` by
   * id. If settings.js 404s and this builds nothing, that call dereferences null, boot throws
   * before it ever reaches the router, and the ENTIRE app renders blank — a missing settings
   * panel presenting as a dead white screen, which is the single worst diagnostic this codebase
   * could offer. So the drawer always exists, and when it is empty it says why and names the
   * file. (wireSettings guards the same fields on its side; two cheap checks, because this one
   * failure mode takes down everything.) */
  function buildSettings(c) {
    if (window.Settings) { Settings.build(c, closeAll); return; }
    var d = document.createElement('aside');
    d.id = 'settingsDrawer';
    d.className = 'drawer drawer-right';
    d.setAttribute('aria-hidden', 'true');
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-label', 'Settings');
    d.innerHTML =
      '<div class="drawer-head"><h2>Settings</h2>' +
        '<button class="drawer-x" id="setX" aria-label="Close settings">\u2715</button></div>' +
      '<div class="drawer-body"><div class="empty bad"><b>Settings did not load.</b><br>' +
        '<code>settings.js</code> is missing or failed to parse, so appearance, the write key ' +
        'and diagnostics are unavailable. Check the script tags in <code>index.html</code>. ' +
        'The rest of the app still works.</div></div>';
    document.body.appendChild(d);
    $('setX').addEventListener('click', closeAll);
  }

  /* ---------- footer ---------- */
  function buildFooter(c) {
    var f = $('appFooter');
    f.innerHTML =
      '<div class="foot-in">' +
        '<div class="foot-src">' +
          (c.sources || []).map(function (s) {
            return '<a href="' + s.href + '" target="_blank" rel="noopener">' + s.label + '</a>';
          }).join('') +
        '</div>' +
        '<div class="foot-dev" id="footDev"></div>' +
        '<div class="foot-stamp">' + c.appName + ' ' + c.version + '</div>' +
      '</div>';
    paintFootDev();
    // Keep it honest across a window drag: device.js debounces its own re-read, this follows.
    window.addEventListener('resize', function () { setTimeout(paintFootDev, 160); });
  }

  function paintFootDev() {
    var el = $('footDev');
    if (el && window.Device) el.textContent = Device.kind();
  }

  window.Chrome = {
    init: function (c) {
      cfg = c;
      /* route -> label, so setActive can retitle without re-walking the config every time.
       * HIDDEN and DETAIL routes are titled here TOO, and only here. setActive falls back to the
       * app name for a route it cannot name, so an unlisted or detail page would otherwise open
       * with the wrong title in both the header and the browser tab — which reads as a
       * half-broken load rather than a deliberately quiet page. Titled, still not in the MENU:
       * buildNav takes `c.nav` alone.
       * ⚠️ A DETAIL route's label is GENERIC by necessity — "Print", not the print's name — because
       * this map is built once at init and cannot know a param. The specific name is the <h1> in
       * the content area, which is why artwork.js renders one. */
      c.nav.concat(c.hidden || []).concat(c.detail || [])
        .forEach(function (n) { titles[n.route] = n.label; });
      buildHeader(c); buildScrim(); buildNav(c); buildSettings(c); buildFooter(c);
    },
    /* One call per route change, from the router. It marks the nav row AND writes the page title
     * in the header and the browser tab — one function so the three can never disagree about
     * which page you are on. An unknown route falls back to the app name rather than blanking:
     * an empty header reads as a broken load. */
    setActive: function (route) {
      [].forEach.call(document.querySelectorAll('.nav-link'), function (a) {
        a.classList.toggle('is-active', a.getAttribute('data-route') === route);
      });
      var label = titles[route] || (cfg ? cfg.appName : '');
      var t = $('hdTitle');
      if (t) t.textContent = label;
      if (cfg) {
        document.title = label + ' \u00b7 ' + cfg.appName + ' ' + (cfg.appSub || '');
      }
    },
    closeAll: closeAll
  };
})();
