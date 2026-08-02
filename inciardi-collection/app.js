/* Inciardi Collection — THE ROUTE DISPATCHER. This file owns nothing but routing.
 *
 * One module per screen, each exporting `window.X.mount()`. Adding a screen is one row in
 * SCREENS below, one row in `boot.js` (APP.nav, APP.hidden, or APP.detail), and a new file.
 * **Never grow a module.** The full map and the size budget live in the comment at the
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
    photos:   function ()  { Photos.mount(); },
    // UNLISTED. Surfaced only at the foot of the settings panel — see the header in backroom.js
    // for what that is and is not worth. It dispatches like any other route; there is no second
    // router.
    backroom: function ()  { Backroom.mount(); },
    /* DETAIL (v19). Takes a param and is meaningless without one, so it is in NO menu — not the
     * nav drawer, not the settings footer. You arrive from a print. `boot.js` → APP.detail is
     * what makes it routable at all; without that row the router silently falls back to the
     * binder, which reads as a dead link rather than a missing registration. */
    artwork:  function (p) { Artwork.mount(p); }
  };

  /* Which global each route needs, and which FILE provides it. A script that 404'd is otherwise
   * indistinguishable from a route with no data — the exact class of silent failure this app
   * exists to refuse, so the error names the file to check. */
  var NEEDS = {
    binder:  { globals: ['Binder', 'Sheets', 'Picker'], file: 'binder.js / sheets.js / picker.js' },
    enter:   { globals: ['Enter'],   file: 'enter.js' },
    shoebox: { globals: ['Shoebox'], file: 'enter.js' },
    summary: { globals: ['Summary'], file: 'summary.js' },
    /* Capture is a REAL dependency, not an optional extra: "Add photos" is the reason this
     * screen exists, and without capture.js the grid would render with a button that silently
     * does nothing — which is precisely the failure shape this table was built to convert into
     * a message naming the file. */
    photos:  { globals: ['Photos', 'Capture'], file: 'photos.js / capture.js' },
    /* Binder is a REAL dependency even though this page never renders a sheet: `Binder.face()`
     * is the one place 'A'/'B' becomes Front/Back, and the placement list speaks that
     * vocabulary. artwork.js carries a fallback so a missing binder.js degrades the wording
     * rather than blanking the page — but naming it here is what turns a silent 404 into a
     * message that says which file to check.
     *
     * 🔴 PhotoView AND Capture ADDED v23, and PhotoView is the one that matters. A print with no
     * photographs is a LEGITIMATE state that looks exactly like a 404'd photoview.js: a complete,
     * correct-looking print page with nothing where the pictures go. Of every silent failure this
     * table defends against, that is the most convincing one — so it is named rather than left to
     * be discovered by someone concluding the feature was never built. */
    artwork: { globals: ['Artwork', 'Binder', 'PhotoView', 'Capture'],
               file: 'artwork.js / binder.js / photoview.js / capture.js' },
    /* Five globals, and each is a real dependency:
     *   Backroom — the runner.  Batch — the payload.  Preview — the markup (v15 split).
     *   Arrange  — WHERE each print sits (v17). Not optional: `build()` and `apply()` both read
     *              their placements from it, so without it the screen has no arrangement to plan
     *              against and would fall through to writing nothing at all.
     *   Binder   — `FACE` in binder.js is documented as the ONLY place the UI's front/back
     *              vocabulary meets the schema's 'A'/'B'. Borrowing it beats a second copy. */
    backroom: { globals: ['Backroom', 'Batch', 'Preview', 'Arrange', 'Binder'],
                file: 'backroom.js / batch.js / preview.js / arrange.js' }
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
