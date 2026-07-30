/* Inciardi Collection — BOOT. Config, theme, router, settings wiring, diagnostics.
 *
 * WHY THIS IS A FILE AND NOT A <script> IN index.html: the repo's architecture lock (2026-07-08)
 * is that **`index.html` is an INDEX** — a thin shell referencing pages, never a file storing
 * servable content. Ours had grown a ~250-line inline script and hit 20.8KB; the index had
 * quietly become the app, which is the exact drift that lock exists to stop.
 *
 * `APP` below is the one config object. Adding a route is a line there plus a module file.
 * Chrome.setActive() turns `nav[].label` into the centred PAGE TITLE in the header and the
 * browser tab title, so a route's label is written once, here.
 */
(function () {

  /* ==== CONFIG — the only thing most changes touch ==== */
  var APP = {
    appName: 'Inciardi',
    appSub: 'Collection',
    logo: '\uD83D\uDCD5',
    version: 'v11',
    /* 🎨 `soft-mercedes` is a JOIN in shared/themes/_themes.json — colour `mercedes` + typography
       `grounded` + forms `soft` + spacing `standard`.
       🔴 applyTheme() TAKES A JOIN SLUG, NEVER A COLOUR SLUG. `mercedes` alone is a row in
       colors.tsv and faults here. The `data-theme` attribute in index.html is the opposite: it
       takes a COLOUR slug, because themes.css ships a static block for the pre-JS first paint.
       Two vocabularies, one word apart. */
    theme: 'soft-mercedes',
    color: 'mercedes',          // pre-paint floor; must match the join's colour
    defaultPage: 'binder',
    /* Hints are why the drawer beats the old inline bar — there was never room to say what a page
       is FOR up there. `label` is ALSO the page title in the header (v11). */
    nav: [
      { route: 'binder',  label: 'Binder',     hint: 'Nine slots a face, front and back' },
      { route: 'summary', label: 'Collection', hint: 'Every print, and where each one is' },
      { route: 'shoebox', label: 'Shoe-box',   hint: 'Owned, not in the binder yet' },
      { route: 'enter',   label: 'Enter',      hint: 'Add a print to the catalog' }
    ],
    sources: [
      { label: 'Anastasia Inciardi', href: 'https://www.anastasiainciardi.com/' }
    ]
  };

  var routes = APP.nav.map(function (n) { return n.route; });
  var lastPing = null, lastError = null, lastAt = null;

  function $(id) { return document.getElementById(id); }

  /* ---------- theme ---------- */
  if (window.THEMES && THEMES.applyTheme) {
    THEMES.applyTheme(APP.theme);
  } else {
    // resolve.js absent: themes.css + the data-theme attribute already painted the Mercedes ramp,
    // so this only re-asserts it. Colours survive; the other three vectors fall back to the var()
    // defaults in base.css. Light mode is unavailable and chrome.js says so out loud.
    document.documentElement.setAttribute('data-theme', APP.color);
  }

  /* ---------- chrome ---------- */
  Chrome.init(APP);
  wireSettings();
  checkConfig();

  /* ---------- router: hash -> pages/<route>.html, then MOUNT ----------
   * The hash carries PARAMS: `#binder?sheet=sheet-1&side=B` opens that sheet's back, which is what
   * every link in the Collection matrix points at. Query string rather than a path because it is
   * order-independent and tolerates a missing value, so an old link with only `?sheet=` still
   * works. A positional path breaks on the third param. */
  function parse() {
    var h = (location.hash || '').replace(/^#/, '');
    var q = h.indexOf('?');
    var route = (q < 0 ? h : h.slice(0, q)) || APP.defaultPage;
    var params = {};
    if (q >= 0) {
      h.slice(q + 1).split('&').forEach(function (kv) {
        if (!kv) return;
        var i = kv.indexOf('=');
        if (i < 1) return;
        try {
          params[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1));
        } catch (e) { /* a malformed escape is not worth breaking navigation over */ }
      });
    }
    if (routes.indexOf(route) === -1) route = APP.defaultPage;
    return { route: route, params: params };
  }

  function go() {
    var at = parse();
    fetch('./pages/' + at.route + '.html', { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
      .then(function (html) {
        $('view').innerHTML = html;
        Chrome.setActive(at.route);        // marks the nav row AND writes the page title
        window.scrollTo(0, 0);
        App.mount(at.route, at.params);   // the hook innerHTML injection needs
      })
      .catch(function (e) {
        document.body.classList.remove('stage');
        $('view').innerHTML = '<section class="page"><h1>Page failed to load</h1>' +
          '<p class="muted">' + Core.esc(e.message) + '</p></section>';
      });
  }
  window.addEventListener('hashchange', go);

  /* ---------- settings ---------- */
  function wireSettings() {
    /* Show the OVERRIDE, not the effective value: an input pre-filled with something it never
     * saved is a small lie about state, and blanking it would then look like erasing. */
    function paintBase() {
      var el = $('apiBase'), hint = $('baseHint');
      if (API.isDefaultBase()) {
        el.value = '';
        el.placeholder = API.defaultBase();
        hint.innerHTML = 'Using the built-in default. Leave blank unless you are pointing at a different worker.';
      } else {
        el.value = API.base();
        hint.innerHTML = 'Overridden on this device. Built-in default is <code>' +
          Core.esc(API.defaultBase()) + '</code>.';
      }
    }

    /* Same rule, and it matters more here: NEVER pre-fill this box with the built-in key. Painting
     * the effective value would both lie about what this device saved AND put the credential one
     * "show password" tap from any screen someone is looking over. */
    function paintKey() {
      var el = $('writeKey'), hint = $('keyHint');
      if (API.isDefaultKey()) {
        el.value = '';
        el.placeholder = 'using the built-in key';
        hint.innerHTML = 'Editing is <b>already unlocked</b> \u2014 this app ships with its write key.';
      } else {
        el.value = API.key();
        hint.innerHTML = 'Overridden on this device. Clear the box and Save to go back to the built-in key.';
      }
    }

    paintBase(); paintKey();

    $('resetBase').addEventListener('click', function () {
      API.setBase(''); paintBase(); Core.toast('Back to the built-in worker', 'good');
    });

    $('saveCfg').addEventListener('click', function () {
      API.setBase($('apiBase').value.trim());   // blank = fall back to the default
      API.setKey($('writeKey').value.trim());
      Core.toast('Saved on this device', 'good');
      paintBase(); paintKey(); checkConfig(); go();
    });

    /* RAW JSON, verbatim — Michael pastes it, so the machine output is the point. The verdict line
     * sits ABOVE it because that costs nothing and answers "can I save yet?" at a glance. */
    $('ping').addEventListener('click', function () {
      var out = $('pingOut');
      out.hidden = false; out.textContent = '\u2026';
      lastAt = new Date().toISOString();
      API.get('/health').then(function (d) {
        lastPing = d; lastError = null;
        out.textContent =
          'CONNECTED \u00b7 ' + (API.isDefaultKey() ? 'built-in write key' : 'key overridden here') +
          '\n\n' + JSON.stringify(d, null, 2) +
          '\n\nNOTE: /health is a READ, and reads never need a key \u2014 so this passing does' +
          '\nnot prove writes work. A 401 on a save means the key here and the one on the' +
          '\nworker disagree.';
      }).catch(function (e) {
        lastError = e.message || String(e); lastPing = null;
        out.textContent = 'FAILED\n\n' + lastError;
      });
    });

    $('copyDiag').addEventListener('click', function () {
      var txt = bundle(), out = $('pingOut');
      function manual() {
        /* navigator.clipboard is absent in some iOS configurations and in non-secure contexts. A
         * copy button that silently does nothing is worse than no copy button. */
        out.hidden = false; out.textContent = txt;
        try {
          var r = document.createRange(); r.selectNodeContents(out);
          var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        } catch (e) {}
        Core.toast('Clipboard blocked \u2014 text selected, copy manually', 'bad');
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt)
          .then(function () { Core.toast('Diagnostics copied (no key included)', 'good'); })
          .catch(manual);
      } else { manual(); }
    });
  }

  /* ---------- diagnostics ----------
   * 🔴 NEVER THE KEY ITSELF — only whether one exists and how long it is. This text is built to be
   * pasted into a chat, so a credential in here would be a leak with a delivery mechanism
   * attached. (The built-in one is public anyway, but a diagnostic that pastes credentials into
   * chat logs is a habit that will eventually meet a key that is not.) */
  function bundle() {
    var d = document.documentElement;
    var L = [];
    L.push('INCIARDI COLLECTION \u2014 DIAGNOSTICS');
    L.push('generated   ' + new Date().toISOString());
    L.push('app         ' + APP.version + '  (theme ' + APP.theme + ')');
    /* The RESOLVED theme, read off the DOM rather than the constant: if a vector failed to apply,
     * resolve.js writes "!slug" into the attribute, so this reports what the page is actually
     * wearing instead of what it intended to wear. */
    L.push('theme join  ' + (d.getAttribute('data-theme-join') || '(not applied)') +
           '  color=' + (d.getAttribute('data-theme') || '?') +
           '  mode=' + (d.getAttribute('data-mode') || '?'));
    if (window.THEMES && THEMES.faults && THEMES.faults.length) {
      L.push('theme fault ' + THEMES.faults.length + ': ' + THEMES.faults.join(' | '));
    }
    /* Mobile vs desktop, from device.js. The layout differs between them, so a screenshot report
     * that omits this costs a round trip to find out which one it was. */
    L.push('device      ' + (window.Device ? Device.describe() : '(device.js did not load)'));
    /* WHICH MODULES LOADED. After a split, a 404'd script and a screen with no data look
     * identical — this is the line that tells them apart. */
    L.push('modules     ' +
      ['Device', 'Chrome', 'Binder', 'Sheets', 'Picker', 'Enter', 'Shoebox', 'Summary', 'App']
        .map(function (m) { return m + (window[m] ? '\u2713' : '\u2717'); }).join(' '));
    L.push('hash        ' + (location.hash || '(none)'));
    L.push('worker      ' + API.base() + (API.isDefaultBase() ? '  [built-in]' : '  [OVERRIDDEN here]'));
    L.push('write key   ' + (API.isDefaultKey()
      ? 'built-in (' + API.key().length + ' chars, from core.js)'
      : 'OVERRIDDEN here (' + API.key().length + ' chars)'));
    L.push('browser     ' + navigator.userAgent);
    L.push('');
    if (lastAt) L.push('last test   ' + lastAt);
    if (lastError) { L.push(''); L.push('LAST FAILURE'); L.push(lastError); }
    if (lastPing) { L.push(''); L.push('LAST /health'); L.push(JSON.stringify(lastPing, null, 2)); }
    if (!lastAt) L.push('(Test connection has not run this session.)');
    return L.join('\n');
  }

  /* ---------- the banner ----------
   * History, kept because it IS the lesson: this first checked !API.base(), which became
   * permanently false when the URL got a default — and a banner that cannot fire reads as an
   * all-clear. v1 fixed it by checking !API.key(). v2 baked in a key and did the same thing to
   * that check a second time.
   *
   * So there is NO always-true gap left to announce, and the honest move is to announce nothing
   * rather than invent a warning to keep the element busy. The one real remaining gap is a key
   * MISMATCH, undetectable from a read — it surfaces as a 401 on the first save, where core.js
   * names it precisely. Do not "restore" a read-only banner; there is no read-only state left. */
  function checkConfig() {
    var b = $('banner');
    if (!b) return;
    if (!API.key()) {
      // Only reachable if DEFAULT_KEY is ever emptied in core.js.
      b.hidden = false;
      b.className = 'banner warn';
      b.textContent = 'Read-only: no write key available. Open Settings to paste one.';
    } else { b.hidden = true; }
  }

  window.ICApp = { version: APP.version, go: go, parse: parse, config: APP };
  go();
})();
