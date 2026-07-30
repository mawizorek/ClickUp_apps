/* Inciardi Collection — DEVICE. Mobile vs desktop, decided once.
 *
 * Michael, 2026-07-30: "can you track mobile vs desktop."
 *
 * WHY THIS EXISTS AND ISN'T JUST MEDIA QUERIES: CSS already handles size. What it cannot answer
 * is INPUT — whether there is a real pointer or a thumb — and that is the distinction the app
 * was getting wrong. The desktop screenshot showed landscape cards because the stage sized
 * itself to fill the viewport, which is right on a phone (tall, narrow) and wrong on a laptop
 * (short, wide). Nothing in the app knew the difference.
 *
 * `data-device` on <html> is the single source. CSS reads it for layout, diagnostics report it,
 * and no module computes its own answer.
 *
 * TOUCH IS THE PRIMARY SIGNAL, not width. A 1024px iPad in landscape is a touch device; a 700px
 * browser window on a laptop is not. Width alone gets both wrong. `pointer: coarse` asks the
 * real question, with width only as a tiebreak for hybrids.
 */
(function () {
  var root = document.documentElement;

  function read() {
    var coarse = window.matchMedia('(pointer: coarse)').matches;
    var narrow = window.innerWidth < 820;
    // Coarse pointer OR genuinely narrow. A narrow window on a desktop still gets the phone
    // layout, which is correct: the layout follows the space, not the hardware.
    return (coarse || narrow) ? 'mobile' : 'desktop';
  }

  function apply() {
    var d = read();
    if (root.getAttribute('data-device') !== d) {
      root.setAttribute('data-device', d);
    }
    // Reported separately from the verdict, because "mobile because narrow" and "mobile because
     // touch" are different facts and a diagnostics paste should not conflate them.
    root.setAttribute('data-pointer',
      window.matchMedia('(pointer: coarse)').matches ? 'coarse' : 'fine');
  }

  apply();

  /* Re-evaluate on resize, debounced. A dragged window crosses the threshold repeatedly and
   * every crossing re-lays-out the stage; unthrottled that is a resize handler doing layout
   * work sixty times a second. */
  var t = null;
  window.addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(apply, 120);
  });

  window.Device = {
    is: function (kind) { return root.getAttribute('data-device') === kind; },
    kind: function () { return root.getAttribute('data-device'); },
    pointer: function () { return root.getAttribute('data-pointer'); },
    /* For diagnostics: everything about the surface in one line, so a screenshot report never
     * needs a follow-up question about what it was taken on. */
    describe: function () {
      return root.getAttribute('data-device') +
        ' \u00b7 pointer ' + root.getAttribute('data-pointer') +
        ' \u00b7 ' + window.innerWidth + 'x' + window.innerHeight +
        ' \u00b7 dpr ' + (window.devicePixelRatio || 1);
    }
  };
})();
