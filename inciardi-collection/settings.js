/* Inciardi Collection — THE SETTINGS DRAWER. The right-hand panel and everything in it.
 *
 * Split out of chrome.js at v13. chrome.js owns the frame every route shares — header, nav,
 * scrim, footer — and this owns one panel inside it. The seam is clean because the contract
 * between them is already ID-BASED: `boot.js` finds `#writeKey`, `#apiBase`, `#ping` and the
 * rest by id and wires them, so it does not know or care which file wrote the markup.
 *
 * WHAT chrome.js STILL OWNS: opening and closing this thing. Drawer state is shared between the
 * two panels (opening one closes the other) and a second owner of that state is how you end up
 * with both open at once.
 */
(function () {

  function $(id) { return document.getElementById(id); }

  /* ---------- the panel ---------- */
  function build(cfg, closeAll) {
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

        /* ⚠️ These ids are a CONTRACT with boot.js → wireSettings(). Renaming one here silently
         * unwires it there, and the symptom is a control that looks fine and does nothing. */
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

        hiddenRoutes(cfg) +
      '</div>';

    document.body.appendChild(d);
    $('setX').addEventListener('click', closeAll);

    var foot = d.querySelector('.drawer-foot');
    if (foot) {
      // Same behaviour as a nav link: going somewhere closes the panel you left from.
      foot.addEventListener('click', function (e) {
        if (e.target.closest('.foot-link')) closeAll();
      });
    }

    initMode();
    paintDevice();
  }

  /* ============================================================ UNLISTED ROUTES, REACHABLE
   * Michael, 2026-07-31: "you can surface back room as a footer text link in the setting menu or
   * something. not url type in case we build this as an app with no url bar."
   *
   * 🔴 THAT IS A REACHABILITY BUG, NOT A CONVENIENCE. `#backroom` was reachable only by typing a
   * hash. Installed to a home screen and running standalone, there IS no address bar — so a
   * URL-only route is a route that does not exist in the app form of the app. Hiding a page
   * behind an address is fine; hiding it behind an address the user cannot type is just losing
   * the page.
   *
   * RENDERED FROM `cfg.hidden`, NOT HARDCODED. That list already drives two things: whether the
   * router will resolve the route (boot.js) and what the header calls it (chrome.js). Now it
   * drives discovery too. Adding a hidden page stays ONE line in boot.js — and a second place to
   * register one is a second place to forget one.
   *
   * STILL QUIET, and quiet is all it ever was. Bottom of the settings panel, behind a divider,
   * small type, below the advanced section. Not in the nav drawer, not in the footer, not on any
   * page. But say it plainly: this is now two taps from anywhere, so the concealment is weaker
   * than it was yesterday. That is FINE and always was — the actual protections are the guards
   * in backroom.js (live preflight, blocked on any occupied sheet, per-row verdict, two
   * confirmations, idempotent re-runs) and D1 Time Travel. The address was never the defence,
   * which is exactly why trading some of it for reachability costs nothing real.
   */
  function hiddenRoutes(cfg) {
    var list = (cfg && cfg.hidden) || [];
    if (!list.length) return '';
    return '<div class="drawer-hr"></div>' +
      '<div class="drawer-foot">' +
        '<label class="drawer-label">Tools</label>' +
        list.map(function (n) {
          return '<a class="foot-link" href="#' + n.route + '">' +
            '<span class="fl-t">' + n.label + '</span>' +
            (n.hint ? '<span class="fl-h">' + n.hint + '</span>' : '') + '</a>';
        }).join('') +
        '<p class="drawer-note">Not in the menu. These write to the binder in bulk.</p>' +
      '</div>';
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
   * `alt-*` columns holding the opposite-mode neutrals, and `mercedes` has a complete set.
   * `resolve.js` exposes setMode / getMode and swaps the ramp on the same colour row. Brand
   * accent, semantics and data colours are shared across modes on purpose — a theme should not
   * change identity when the lights come on.
   *
   * 🔴 WHICH IS ALSO THE v10 LESSON: because brand colours are shared, using one as INK fails in
   * one of the two modes. v9 lettered the card initials and the wordmark in `accent-2` and they
   * vanished on the light ramp. Fixed with the mode-aware pair (`accent-soft` ground,
   * `accent-deep` ink), NOT a light-mode override — a rule needing `[data-mode]` is reaching
   * around the spine.
   * ⚠️ v12 FOUND THREE MORE of the same defect still live in summary.css, two versions after the
   * rule was written down. Fixing the instances in a screenshot is not fixing the rule.
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

  window.Settings = { build: build, paintDevice: paintDevice };
})();
