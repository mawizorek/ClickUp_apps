/* Inciardi Collection — APP CHROME. Header, nav drawer, settings drawer, footer.
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

  function $(id) { return document.getElementById(id); }

  /* ---------- header: hamburger · brand · gear ---------- */
  function buildHeader(cfg) {
    var h = $('appHeader');
    h.innerHTML =
      '<div class="hd-in">' +
        '<button class="hd-icon" id="navBtn" aria-label="Menu" aria-expanded="false" ' +
          'aria-controls="navDrawer"><span class="hd-bars"></span></button>' +
        '<a class="hd-brand" href="#' + cfg.nav[0].route + '">' +
          '<span class="hd-logo" aria-hidden="true">' + (cfg.logo || '\u25C6') + '</span>' +
          '<span class="hd-name"><b>' + cfg.appName + '</b> ' +
          '<span class="hd-sub">' + (cfg.appSub || '') + '</span></span></a>' +
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
    if (open.settings) paintDevice();      // refresh in case the window was resized since
    if (!open.nav && !open.settings) restoreFocus();
  }

  function restoreFocus() {
    if (lastTrigger) { try { lastTrigger.focus(); } catch (e) {} lastTrigger = null; }
  }

  function closeAll() {
    setDrawer('nav', false);
    setDrawer('settings', false);
    $('chromeScrim').hidden = true;
    restoreFocus();
  }

  /* ---------- left: the page menu ----------
   * No item ceiling. A fifth route costs one line of config, where the old inline header would
   * have wrapped. */
  function buildNav(cfg) {
    var d = document.createElement('aside');
    d.id = 'navDrawer';
    d.className = 'drawer drawer-left';
    d.setAttribute('aria-hidden', 'true');
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-modal', 'true');
    d.setAttribute('aria-label', 'Menu');
    d.innerHTML =
      '<div class="drawer-head"><h2>Menu</h2>' +
        '<button class="drawer-x" id="navX" aria-label="Close menu">\u2715</button></div>' +
      '<nav class="drawer-body nav-list" aria-label="Primary">' +
        cfg.nav.map(function (n) {
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

  /* ---------- right: settings ----------
   * The write-key and worker-URL fields keep their ids so boot.js wires them unchanged. */
  function buildSettings() {
    var d = document.createElement('aside');
    d.id = 'settingsDrawer';
    d.className = 'drawer drawer-right';
    d.setAttribute('aria-hidden', 'true');
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-modal', 'true');
    d.setAttribute('aria-label', 'Settings');
    d.innerHTML =
      '<div class="drawer-head"><h2>Settings</h2>' +
        '<button class="drawer-x" id="setX" aria-label="Close settings">\u2715</button></div>' +
      '<div class="drawer-body">' +

        '<label class="drawer-label">Appearance</label>' +
        '<div class="seg" role="group" aria-label="Light or dark">' +
          '<button id="modeDark" data-mode="dark" aria-pressed="true">Dark</button>' +
          '<button id="modeLight" data-mode="light" aria-pressed="false">Light</button>' +
        '</div>' +
        '<p class="drawer-note" id="modeNote"></p>' +

        '<div class="drawer-hr"></div>' +

        '<label class="drawer-label">This device</label>' +
        '<p class="drawer-note" id="devNote"></p>' +

        '<div class="drawer-hr"></div>' +

        '<label class="drawer-label" for="writeKey">Write key</label>' +
        '<input id="writeKey" type="password" autocomplete="off">' +
        '<p class="drawer-note" id="keyHint"></p>' +
        '<div class="row">' +
          '<button id="saveCfg" class="primary">Save</button>' +
          '<button id="ping">Test connection</button></div>' +
        '<div class="row"><button id="copyDiag" class="ghost">Copy diagnostics</button></div>' +
        '<pre id="pingOut" class="out" hidden></pre>' +

        '<details>' +
          '<summary class="tag">Advanced \u00b7 worker URL</summary>' +
          '<label class="drawer-label" for="apiBase">Worker URL</label>' +
          '<input id="apiBase" type="url" inputmode="url" autocapitalize="off" autocorrect="off">' +
          '<p class="drawer-note" id="baseHint"></p>' +
          '<div class="row"><button id="resetBase" class="ghost">Use the built-in default</button></div>' +
        '</details>' +
      '</div>';
    document.body.appendChild(d);
    $('setX').addEventListener('click', closeAll);
    initMode();
    paintDevice();
  }

  /* Michael asked to track mobile vs desktop. `device.js` owns the answer; this is where a person
   * can read it, and the footer carries the short version. Re-read on drawer open rather than
   * cached, because a resized window changes it. */
  function paintDevice() {
    var el = $('devNote');
    if (!el) return;
    el.textContent = window.Device
      ? Device.describe()
      : 'device.js did not load, so layout is falling back to width alone.';
  }

  /* ============================================================ LIGHT / DARK
   * No new colours and no new CSS. Every row in `colors.tsv` ships its default ramp PLUS eleven
   * `alt-*` columns holding the opposite-mode neutrals, and `mercedes` has a complete set
   * (verified against the grid). `resolve.js` already exposes setMode / getMode / supportsMode
   * and swaps the ramp on the same colour row. Brand accent, semantics and data colours are
   * shared across modes on purpose — a theme should not change identity when the lights come on.
   *
   * 🔴 WHICH IS ALSO THE v10 LESSON: because brand colours are shared, using one as INK fails in
   * one of the two modes. v9 lettered the card initials and the wordmark in `accent-2` and they
   * vanished on the light ramp. Fixed by using the mode-aware pair (`accent-soft` ground,
   * `accent-deep` ink), NOT by adding a light-mode override. If a rule needs `[data-mode]`, the
   * rule is reaching around the spine.
   *
   * Dark stays the default. The choice persists under the resolver's own key, so this app never
   * invents a second place to remember it. */
  function initMode() {
    var note = $('modeNote');

    if (!(window.THEMES && THEMES.setMode)) {
      // Honest, not silent: the buttons would do nothing, so say why instead of pretending.
      note.textContent = 'Theme resolver did not load, so light mode is unavailable this session.';
      ['modeDark', 'modeLight'].forEach(function (id) { $(id).disabled = true; });
      return;
    }

    function paint(mode) {
      $('modeDark').setAttribute('aria-pressed', String(mode !== 'light'));
      $('modeLight').setAttribute('aria-pressed', String(mode === 'light'));
      note.textContent = mode === 'light'
        ? 'Same Mercedes palette, light neutrals. The accent does not change.'
        : 'Dark is the default for this app.';
    }

    ['modeDark', 'modeLight'].forEach(function (id) {
      $(id).addEventListener('click', function () {
        var mode = this.getAttribute('data-mode');
        THEMES.setMode(mode);          // persists; swaps the ramp on the same colour row
        paint(mode);
        /* The iOS browser chrome is painted by a meta tag, so it has to move with the app or
         * there is a visible seam between the two. Read the resolved token rather than hardcoding
         * a hex, so this stays correct if the palette ever changes. */
        var m = document.querySelector('meta[name="theme-color"]');
        if (m) {
          var c = getComputedStyle(document.documentElement)
            .getPropertyValue('--surface-1').trim();
          if (c) m.setAttribute('content', c);
        }
      });
    });

    paint(THEMES.getMode() || 'dark');
  }

  /* ---------- footer ---------- */
  function buildFooter(cfg) {
    var f = $('appFooter');
    f.innerHTML =
      '<div class="foot-in">' +
        '<div class="foot-src">' +
          (cfg.sources || []).map(function (s) {
            return '<a href="' + s.href + '" target="_blank" rel="noopener">' + s.label + '</a>';
          }).join('') +
        '</div>' +
        '<div class="foot-dev" id="footDev"></div>' +
        '<div class="foot-stamp">' + cfg.appName + ' ' + cfg.version + '</div>' +
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
    init: function (cfg) {
      buildHeader(cfg); buildScrim(); buildNav(cfg); buildSettings(); buildFooter(cfg);
    },
    setActive: function (route) {
      [].forEach.call(document.querySelectorAll('.nav-link'), function (a) {
        a.classList.toggle('is-active', a.getAttribute('data-route') === route);
      });
    },
    closeAll: closeAll
  };
})();
