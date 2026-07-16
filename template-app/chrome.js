/* chrome.js — standard app chrome for the gold-standard template.
   Builds the header (banner logo + menu dropdown + settings gear/drawer) and the
   footer (JS-written stamp) ONCE, so every page renders identical chrome.
   All visuals come from the theme spine via var(--token); no color literals here. */
(function () {
  var state = { menu: false, drawer: false };

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (html != null) n.innerHTML = html;
    return n;
  }

  function buildHeader(cfg) {
    var header = document.getElementById("appHeader");
    header.className = "app-header";
    header.innerHTML =
      '<div class="hd-in">' +
        '<button class="hd-menu" id="hdMenuBtn" aria-label="Menu" aria-expanded="false" aria-controls="hdNav"><span class="hd-bars"></span></button>' +
        '<a class="hd-brand" href="#' + cfg.nav[0].route + '">' +
          '<span class="hd-logo" aria-hidden="true">' + (cfg.logo || "\u25C6") + '</span>' +
          '<span class="hd-name">' + cfg.appName + '</span></a>' +
        '<nav class="hd-nav" id="hdNav" aria-label="Primary">' +
          cfg.nav.map(function (n) { return '<a class="hd-link" data-route="' + n.route + '" href="#' + n.route + '">' + n.label + '</a>'; }).join("") +
        '</nav>' +
        '<button class="hd-gear" id="hdGearBtn" aria-label="Settings" aria-expanded="false" aria-controls="settingsDrawer">\u2699</button>' +
      '</div>';

    var menuBtn = document.getElementById("hdMenuBtn");
    var nav = document.getElementById("hdNav");
    menuBtn.addEventListener("click", function () {
      state.menu = !state.menu;
      nav.classList.toggle("is-open", state.menu);
      menuBtn.setAttribute("aria-expanded", String(state.menu));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.classList.contains("hd-link")) {
        state.menu = false; nav.classList.remove("is-open"); menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  function buildDrawer(cfg) {
    var d = el("aside", { id: "settingsDrawer", "class": "drawer", "aria-hidden": "true", role: "dialog", "aria-label": "Settings" });
    d.innerHTML =
      '<div class="drawer-head"><h2>Settings</h2><button class="drawer-x" id="drawerX" aria-label="Close settings">\u2715</button></div>' +
      '<div class="drawer-body">' +
        '<label class="drawer-label" for="themeSel">Theme</label>' +
        '<select id="themeSel" class="drawer-sel"></select>' +
        '<p class="drawer-note" id="themeNote"></p>' +
        '<div class="drawer-hr"></div>' +
        '<p class="drawer-note">Honest notes about this app live here (refresh cadence, data freshness, live-update behavior). Keep it factual, no marketing.</p>' +
      '</div>';
    document.body.appendChild(d);
    var scrim = el("div", { id: "drawerScrim", "class": "drawer-scrim", hidden: "" });
    document.body.appendChild(scrim);

    var gear = document.getElementById("hdGearBtn");
    function setOpen(v) {
      state.drawer = v;
      d.classList.toggle("is-open", v);
      d.setAttribute("aria-hidden", String(!v));
      scrim.hidden = !v;
      gear.setAttribute("aria-expanded", String(v));
    }
    gear.addEventListener("click", function () { setOpen(!state.drawer); });
    document.getElementById("drawerX").addEventListener("click", function () { setOpen(false); });
    scrim.addEventListener("click", function () { setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && state.drawer) setOpen(false); });

    initThemePicker(cfg);
  }

  function initThemePicker(cfg) {
    var sel = document.getElementById("themeSel");
    var note = document.getElementById("themeNote");
    var saved = cfg.defaultTheme;
    try { saved = localStorage.getItem("app_theme") || cfg.defaultTheme; } catch (e) {}
    if (!window.THEMES) { note.textContent = "Theme spine not loaded."; return; }
    THEMES.list().then(function (idx) {
      (idx.groups || []).forEach(function (g) {
        var og = el("optgroup", { label: g.label });
        (g.themes || []).forEach(function (t) {
          var o = el("option", { value: t.slug }, t.name);
          if (t.slug === saved) o.setAttribute("selected", "");
          og.appendChild(o);
        });
        sel.appendChild(og);
      });
      sel.value = saved;
    }).catch(function () { note.textContent = "Could not load theme index."; });
    sel.addEventListener("change", function () {
      var slug = sel.value;
      THEMES.apply(slug, { root: document.documentElement, onResolved: function (res) {
        note.textContent = res.offline ? "Offline: showing fallback." :
          (res.stub ? "Stub theme, using fallback spine." :
          (res.missing && res.missing.length ? (res.missing.length + " token(s) fell back to spine.") : "Applied " + res.name + "."));
      }});
      try { localStorage.setItem("app_theme", slug); } catch (e) {}
    });
  }

  function buildFooter(cfg) {
    var f = document.getElementById("appFooter");
    f.className = "app-footer";
    var sources = (cfg.sources || []).map(function (s) { return '<a href="' + s.href + '" target="_blank" rel="noopener">' + s.label + '</a>'; }).join("");
    f.innerHTML = '<div class="foot-in"><div class="foot-sources">' + sources + '</div><div class="foot-stamp" id="footStamp"></div></div>';
    var stamp = document.getElementById("footStamp");
    if (stamp) stamp.textContent = cfg.appName + " " + cfg.version + " \u00b7 PR #" + cfg.pr;
  }

  window.Chrome = {
    init: function (cfg) { buildHeader(cfg); buildDrawer(cfg); buildFooter(cfg); },
    setActive: function (route) {
      var links = document.querySelectorAll(".hd-link");
      for (var i = 0; i < links.length; i++) {
        links[i].classList.toggle("is-active", links[i].getAttribute("data-route") === route);
      }
    }
  };
})();
