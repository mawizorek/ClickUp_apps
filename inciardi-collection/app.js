/* Inciardi Collection — THE ROUTE DISPATCHER. This file owns nothing but routing.
 *
 * One module per screen, each exporting `window.X.mount()`. Adding a screen is one row in
 * SCREENS below, one row in `boot.js` (APP.nav, or APP.hidden for an unlisted one), and a new
 * file. **Never grow a module.** The full map and the size budget live in the comment at the
 * top of `index.html`.
 */
(function () {

  /* A table rather than an if-chain: adding a screen is one line, and a missing module fails at
   * exactly one place (below) instead of silently doing nothing. */
  var SCREENS = {
    binder:   function (p) { Binder.mount(p); },
    enter:    function ()  { Enter.mount(); },
    shoebox:  function ()  { Shoebox.mount(); },
    summary:  function ()  { Summary.mount(); },
    // UNLISTED. Reachable only by knowing the address — see the header in backroom.js for what
    // that is and is not worth. It dispatches like any other route; there is no second router.
    backroom: function ()  { Backroom.mount(); }
  };

  /* Which global each route needs, and which FILE provides it. A script that 404'd is otherwise
   * indistinguishable from a route with no data — the exact class of silent failure this app
   * exists to refuse, so the error names the file to check. */
  var NEEDS = {
    binder:  { globals: ['Binder', 'Sheets', 'Picker'], file: 'binder.js / sheets.js / picker.js' },
    enter:   { globals: ['Enter'],   file: 'enter.js' },
    shoebox: { globals: ['Shoebox'], file: 'enter.js' },
    summary: { globals: ['Summary'], file: 'summary.js' },
    /* `Binder` is a real dependency here, not a leftover: the back room prints slot positions as
     * front/back, and `FACE` in binder.js is documented as the ONLY place where the UI's
     * front/back vocabulary and the schema's 'A'/'B' are allowed to meet. Borrowing that map
     * beats keeping a second copy of it that can drift. */
    backroom: { globals: ['Backroom', 'Batch', 'Binder'], file: 'backroom.js / batch.js' }
  };

  window.App = {
    mount: function (route, params) {
      /* `body.stage` locks the binder to the viewport and kills page scroll (base.css). Every
       * other route keeps document flow, so it must come OFF on the way out. It also hides the
       * footer, because the stage owns the full height and the deck bar is already down there. */
      document.body.classList.toggle('stage', route === 'binder');

      /* The binder binds a DOCUMENT-level keydown listener, because its stage is not focusable.
       * That listener outlives the route, so it is detached here — leave it attached and arrow
       * keys in the Enter form would turn binder faces underneath. This is the one piece of
       * state a screen module cannot own itself. */
      if (route !== 'binder' && window.Binder && Binder.keys) {
        document.removeEventListener('keydown', Binder.keys);
      }

      // Any page-level drawer belongs to the route that built it; a route change orphans it.
      if (window.Drawer) Drawer.closeAll();

      var screen = SCREENS[route];
      if (!screen) return;

      var need = NEEDS[route];
      var missing = need.globals.filter(function (g) { return !window[g]; });
      if (missing.length) {
        var view = document.getElementById('view');
        if (view) {
          view.innerHTML = '<section class="page"><h1>Screen failed to load</h1>' +
            '<p class="muted">The <code>' + Core.esc(route) + '</code> screen needs <code>' +
            Core.esc(need.file) + '</code> \u2014 missing: ' + Core.esc(missing.join(', ')) +
            '. Check the script tags in <code>index.html</code> and the browser console.</p>' +
            '</section>';
        }
        return;
      }
      screen(params);
    }
  };
})();
