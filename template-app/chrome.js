/* chrome.js — standard app chrome for the gold-standard template.
   Builds ONCE, shared across every page:
     • header: left hamburger + banner brand + right settings gear
     • LEFT nav drawer (slides in from left) — the app's page menu
     • RIGHT settings drawer (slides in from right) — theme picker + honest notes
     • footer: JS-written version/PR stamp
   Left and right drawers are mirror images. All color comes from the theme
   spine via var(--token); no color literals here (sole exception: the neutral
   black-alpha scrim, which must darken regardless of theme). */
(function () {
  var open = { nav: false, settings: false, pop: false };
  var SPINE_INDEX = "../shared/themes/_index.json"; // fallback if resolve.js didn't load

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (html != null) n.innerHTML = html;
    return n;
  }
  function scrim() { return document.getElementById("chromeScrim"); }

  /* ---------- resilient theme helpers ---------- */
  function themeIndex() {
    if (window.THEMES && THEMES.list) return THEMES.list();
    return fetch(SPINE_INDEX, { cache: "no-store" }).then(function (r) { if (!r.ok) throw 0; return r.json(); });
  }
  function applyTheme(slug) {
    // Prefer the canonical resolver; fall back to the data-theme attribute,
    // which themes.css alone honors, so theming survives a resolve.js hiccup.
    if (window.THEMES && THEMES.apply) { THEMES.apply(slug, { root: document.documentElement }); }
    else { document.documentElement.setAttribute("data-theme", slug); }
    try { localStorage.setItem("app_theme", slug); } catch (e) {}
  }
  function savedSlug(fallback) {
    try { return localStorage.getItem("app_theme") || fallback; } catch (e) { return fallback; }
  }

  /* ---------- header ---------- */
  function buildHeader(cfg) {
    var h = document.getElementById("appHeader");
    h.className = "app-header";
    h.innerHTML =
      '<div class="hd-in">' +
        '<button class="hd-icon hd-burger" id="navBtn" aria-label="Menu" aria-expanded="false" aria-controls="navDrawer"><span class="hd-bars"></span></button>' +
        '<a class="hd-brand" href="#' + cfg.nav[0].route + '">' +
          '<span class="hd-logo" aria-hidden="true">' + (cfg.logo || "\u25C6") + '</span>' +
          '<span class="hd-name">' + cfg.appName + '</span></a>' +
        '<button class="hd-icon hd-gear" id="gearBtn" aria-label="Settings" aria-expanded="false" aria-controls="settingsDrawer">\u2699</button>' +
      '</div>';
    document.getElementById("navBtn").addEventListener("click", function () { toggle("nav"); });
    document.getElementById("gearBtn").addEventListener("click", function () { toggle("settings"); });
  }

  /* ---------- shared scrim + open/close ---------- */
  function buildScrim() {
    var s = el("div", { id: "chromeScrim", "class": "chrome-scrim", hidden: "" });
    s.addEventListener("click", closeAll);
    document.body.appendChild(s);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });
  }
  function setDrawer(which, v) {
    var id = which === "nav" ? "navDrawer" : "settingsDrawer";
    var btn = which === "nav" ? "navBtn" : "gearBtn";
    var d = document.getElementById(id);
    open[which] = v;
    d.classList.toggle("is-open", v);
    d.setAttribute("aria-hidden", String(!v));
    document.getElementById(btn).setAttribute("aria-expanded", String(v));
  }
  function toggle(which) {
    var willOpen = !open[which];
    // mutually exclusive: opening one closes the other
    setDrawer("nav", which === "nav" ? willOpen : false);
    setDrawer("settings", which === "settings" ? willOpen : false);
    if (!open.settings) closePop();
    scrim().hidden = !(open.nav || open.settings);
  }
  function closeAll() {
    setDrawer("nav", false); setDrawer("settings", false); closePop();
    scrim().hidden = true;
  }

  /* ---------- left nav drawer ---------- */
  function buildNavDrawer(cfg) {
    var d = el("aside", { id: "navDrawer", "class": "drawer drawer-left", "aria-hidden": "true", role: "dialog", "aria-label": "Menu" });
    d.innerHTML =
      '<div class="drawer-head"><h2>Menu</h2><button class="drawer-x" id="navX" aria-label="Close menu">\u2715</button></div>' +
      '<nav class="drawer-body nav-list" aria-label="Primary">' +
        cfg.nav.map(function (n) { return '<a class="nav-link" data-route="' + n.route + '" href="#' + n.route + '">' + n.label + '</a>'; }).join("") +
      '</nav>';
    document.body.appendChild(d);
    document.getElementById("navX").addEventListener("click", closeAll);
    d.querySelector(".nav-list").addEventListener("click", function (e) {
      if (e.target.classList.contains("nav-link")) closeAll();
    });
  }

  /* ---------- right settings drawer ---------- */
  function buildSettingsDrawer(cfg) {
    var d = el("aside", { id: "settingsDrawer", "class": "drawer drawer-right", "aria-hidden": "true", role: "dialog", "aria-label": "Settings" });
    d.innerHTML =
      '<div class="drawer-head"><h2>Settings</h2><button class="drawer-x" id="setX" aria-label="Close settings">\u2715</button></div>' +
      '<div class="drawer-body">' +
        '<label class="drawer-label" id="themeLbl">Theme</label>' +
        '<div class="theme-field">' +
          '<button class="theme-trigger" id="themeTrigger" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="themeLbl themeCurrent">' +
            '<span class="sw" id="themeSw"><i></i></span>' +
            '<span class="theme-current" id="themeCurrent">\u2014</span>' +
            '<span class="theme-chev" aria-hidden="true">\u25BE</span>' +
          '</button>' +
          '<div class="theme-pop" id="themePop" role="listbox" tabindex="-1" aria-label="Theme"></div>' +
        '</div>' +
        '<p class="drawer-note" id="themeNote"></p>' +
        '<div class="drawer-hr"></div>' +
        '<p class="drawer-note">Honest notes about this app live here (refresh cadence, data freshness, live-update behavior). Keep it factual, no marketing.</p>' +
      '</div>';
    document.body.appendChild(d);
    document.getElementById("setX").addEventListener("click", closeAll);
    initThemePicker(cfg);
  }

  /* ---------- themed theme picker (custom popup, not a native select) ---------- */
  function closePop() {
    var pop = document.getElementById("themePop");
    var trg = document.getElementById("themeTrigger");
    if (pop) pop.classList.remove("is-open");
    if (trg) trg.setAttribute("aria-expanded", "false");
    open.pop = false;
  }
  function setTrigger(slug, name) {
    var sw = document.getElementById("themeSw");
    var cur = document.getElementById("themeCurrent");
    if (sw) sw.setAttribute("data-theme", slug);   // swatch inherits that theme's tokens
    if (cur) cur.textContent = name || slug;
  }
  function initThemePicker(cfg) {
    var trigger = document.getElementById("themeTrigger");
    var pop = document.getElementById("themePop");
    var note = document.getElementById("themeNote");
    var chosen = savedSlug(cfg.defaultTheme);

    trigger.addEventListener("click", function () {
      open.pop = !open.pop;
      pop.classList.toggle("is-open", open.pop);
      trigger.setAttribute("aria-expanded", String(open.pop));
    });

    themeIndex().then(function (idx) {
      var groups = (idx && idx.groups) || [];
      var found = null;
      groups.forEach(function (g) {
        pop.appendChild(el("div", { "class": "theme-group" }, g.label));
        (g.themes || []).forEach(function (t) {
          if (t.slug === chosen) found = t;
          var row = el("button", { "class": "theme-opt", role: "option", "data-slug": t.slug, "aria-selected": String(t.slug === chosen) },
            '<span class="sw" data-theme="' + t.slug + '"><i></i></span><span class="nm">' + t.name + '</span>');
          row.addEventListener("click", function () { choose(t.slug, t.name); });
          pop.appendChild(row);
        });
      });
      setTrigger(chosen, found ? found.name : chosen);
      note.textContent = window.THEMES ? "" : "Live resolver unavailable — theming via stylesheet fallback.";
    }).catch(function () {
      note.textContent = "Could not load the theme index. Check the shared/themes spine.";
    });

    function choose(slug, name) {
      applyTheme(slug);
      setTrigger(slug, name);
      var opts = pop.querySelectorAll(".theme-opt");
      for (var i = 0; i < opts.length; i++) {
        opts[i].setAttribute("aria-selected", String(opts[i].getAttribute("data-slug") === slug));
      }
      closePop();
    }
  }

  /* ---------- footer ---------- */
  function buildFooter(cfg) {
    var f = document.getElementById("appFooter");
    f.className = "app-footer";
    var sources = (cfg.sources || []).map(function (s) { return '<a href="' + s.href + '" target="_blank" rel="noopener">' + s.label + '</a>'; }).join("");
    f.innerHTML = '<div class="foot-in"><div class="foot-sources">' + sources + '</div><div class="foot-stamp" id="footStamp"></div></div>';
    var stamp = document.getElementById("footStamp");
    if (stamp) stamp.textContent = cfg.appName + " " + cfg.version + " \u00b7 PR #" + cfg.pr;
  }

  window.Chrome = {
    init: function (cfg) {
      buildHeader(cfg); buildScrim(); buildNavDrawer(cfg); buildSettingsDrawer(cfg); buildFooter(cfg);
    },
    setActive: function (route) {
      var links = document.querySelectorAll(".nav-link");
      for (var i = 0; i < links.length; i++) {
        links[i].classList.toggle("is-active", links[i].getAttribute("data-route") === route);
      }
    }
  };
})();
