/* Standard app chrome: settings gear -> dialog housing the light/dark theme toggle.
   Theme persists to localStorage; gear reflects open/closed via aria-expanded. */
(function () {
  var el = PS.el;
  var THEME_KEY = "pdfsplitter.theme";

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") || "dark";
  }
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    syncThemeSeg();
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#ffffff" : "#15171d");
  }
  function syncThemeSeg() {
    var t = currentTheme();
    document.querySelectorAll("#themeSeg button").forEach(function (b) {
      b.classList.toggle("active", b.dataset.themeChoice === t);
    });
  }

  function initSettingsDrawer() {
    var modal = el("settingsModal"), btn = el("settingsBtn");
    if (!modal || !btn) return;
    btn.onclick = function () { syncThemeSeg(); modal.showModal(); btn.setAttribute("aria-expanded", "true"); };
    var close = function () { if (modal.open) modal.close(); btn.setAttribute("aria-expanded", "false"); };
    el("settingsClose").onclick = close;
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    modal.addEventListener("close", function () { btn.setAttribute("aria-expanded", "false"); });
    document.querySelectorAll("#themeSeg button").forEach(function (b) {
      b.onclick = function () { applyTheme(b.dataset.themeChoice); };
    });
    // Honor system preference on first run if nothing saved.
    var saved = null; try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (!saved) {
      var prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
      applyTheme(prefersLight ? "light" : "dark");
    } else { syncThemeSeg(); }
  }

  PS.initSettingsDrawer = initSettingsDrawer;
})();
