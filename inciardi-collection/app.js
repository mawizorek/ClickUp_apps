/* Inciardi Collection — THE ROUTE DISPATCHER. This file owns nothing but routing.
 *
 * ============================================================================
 * WHY THIS FILE IS 3KB AND NOT 33KB. Split 2026-07-30, Michael's call, no behaviour changed.
 *
 * app.js reached 32,701 bytes against a ~30KB hard read cap (~22KB target — GitHub MCP
 * Operating Standard). **A file that cannot be read back whole cannot be safely edited**, so
 * the file that renders this app had become the file least safe to change. One more screen and
 * every future edit would have been built on a truncated read.
 *
 * It did not get there by design. It got there by ACCUMULATION: v4 added the sheet menu, v5
 * added the stage, v6 added face traversal, v7 added the shoe-box split — each a reasonable
 * change, each into the same file, none of them the moment anybody would have called it a
 * problem. That is how every oversized file in this repo has happened.
 *
 * 🔴 THE REAL FINDING, worth more than the refactor: the tools to prevent this ALREADY EXISTED
 * and neither ran. Size Sally (`agents/size-sally.md`) forecasts a file's size curve BEFORE a
 * write, and Dev Dexter (`super-agents/dev-dexter/`) owns the modular-split law as a person.
 * Both are INVOKE-ONLY. Nobody seated either one across v4, v5, v6 or v7. A guardrail that
 * requires someone to remember it is not a guardrail — it is a suggestion with paperwork.
 *
 * THE SHAPE NOW. One module per screen, each exporting `window.X.mount()`:
 *   core.js     — API client + DOM helpers (loaded first; everything depends on it)
 *   binder.js   — the stage, the flip, the sheet menu          → window.Binder
 *   enter.js    — the entry form AND the shoe-box              → window.Enter, window.Shoebox
 *   summary.js  — the collection matrix + drill-in             → window.Summary
 *   app.js      — this file. Routing only.
 *
 * Load order does not matter beyond core.js: mounting happens after every file has parsed.
 * ⚠️ ADDING A SCREEN MEANS ADDING A FILE. Do not grow this one back.
 * ============================================================================ */
(function () {

  /* Every route's mount function, by name. A table rather than an if-chain because the whole
   * point of this file is that adding a screen is a one-line change here plus a new file —
   * and because a missing module then fails loudly at exactly one place (below) instead of
   * silently doing nothing. */
  var SCREENS = {
    binder:  function (p) { return window.Binder && Binder.mount(p); },
    enter:   function ()  { return window.Enter && Enter.mount(); },
    shoebox: function ()  { return window.Shoebox && Shoebox.mount(); },
    summary: function ()  { return window.Summary && Summary.mount(); }
  };

  // Which module each route needs, so a failure can name the file that is missing rather than
  // leaving a blank page. A script that 404'd is otherwise indistinguishable from a route with
  // no data — the exact class of silent failure this app exists to refuse.
  var OWNER = { binder: 'Binder', enter: 'Enter', shoebox: 'Shoebox', summary: 'Summary' };

  window.App = {
    mount: function (route, params) {
      /* `body.stage` is what locks the binder to the viewport and kills page scroll. Every
       * other route keeps normal document flow, so it has to come OFF on the way out. */
      document.body.classList.toggle('stage', route === 'binder');

      /* The binder binds a DOCUMENT-level keydown listener, because its stage is not focusable.
       * That listener outlives the route, so it must be detached here — leaving it attached
       * means arrow keys in the Enter form would turn binder faces underneath. This is the one
       * piece of state a screen module cannot own itself. */
      if (route !== 'binder' && window.Binder && Binder.keys) {
        document.removeEventListener('keydown', Binder.keys);
      }

      var screen = SCREENS[route];
      if (!screen) return;

      var owner = OWNER[route];
      if (owner && !window[owner]) {
        // Loud, not blank. Names the file so the fix is obvious.
        var view = document.getElementById('view');
        if (view) {
          view.innerHTML = '<section class="page"><h1>Screen failed to load</h1>' +
            '<p class="muted">The <code>' + route + '</code> screen needs <code>' +
            route.replace('shoebox', 'enter') + '.js</code>, which did not load. ' +
            'Check the script tags in <code>index.html</code> and the browser console.</p></section>';
        }
        return;
      }
      return screen(params);
    }
  };
})();
