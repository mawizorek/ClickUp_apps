/* app-shell.js — the ONE router for the unified F1 2026 app (v10).
 Owns lens switching between the standings surface (Matrix + History, one document) and
 the circuits surface, each mounted in an isolated, always-warm iframe. Switching is an
 opacity cross-fade with NO reload: the chrome never unmounts and neither lens re-boots.

 Shell hash is the top-level source of truth:
   #matrix (default) -> standings surface, inner hash cleared (matrix view)
   #history          -> standings surface, inner hash '#history'
   #circuits         -> circuits surface, inner hash '#/'
   #circuits/<slug>  -> circuits surface, inner hash '#/<slug>'

 ADOPTION: same-origin with both lenses, so on each iframe 'load' it injects chrome-hiding
 CSS into that lens and drives the inner hash. Zero edits to lens code.

 iOS SCROLL (v10): the shell stacks each lens in a position:absolute; inset:0 iframe inside
 an overflow:hidden stage — that pins the iframe to viewport height and iOS Safari refuses to
 scroll inside a height-clamped iframe (Matrix/History/Weekend froze; Circuits only looked ok
 because its content fit). Earlier tries failed: v8 gave the wrapper nothing taller to scroll,
 v9 REPARENTED the iframes which reloaded them and blanked the app. v10 is a minimal delta on
 the known-good v7 router: NO reparenting. Instead (1) the .stage becomes the scroll container,
 (2) each iframe is height-synced to its inner content (read the same-origin inner doc's
 scrollHeight, set the iframe's px height) so the stage has real height to scroll. Route logic
 is byte-for-byte v7. */
(function () {
 var std = document.getElementById('lens-standings');
 var cir = document.getElementById('lens-circuits');
 var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
 var ready = { standings: false, circuits: false };

 // v10: make the stage scroll and let each iframe grow to content height (no reparent).
 var fix = document.createElement('style');
 fix.id = 'shell-scroll-fix';
 fix.textContent =
 '.stage{overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch}' +
 '.stage iframe{bottom:auto;height:auto;min-height:100%}';
 document.head.appendChild(fix);

 // Height-sync: read the SAME-ORIGIN inner document height, set the iframe px height.
 // (Reading inner scrollHeight is independent of the iframe's own rendered height, so it
 //  never collapses the way a height:auto measurement did in v9.)
 function measure(frame) {
 try {
 var doc = frame.contentDocument;
 if (!doc || !doc.body) return;
 var h = Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight);
 if (h > 0) frame.style.height = h + 'px';
 } catch (e) { /* cross-timing; harmless */ }
 }
 function observe(frame) {
 try {
 var doc = frame.contentDocument, win = frame.contentWindow;
 if (!doc || !doc.body) return;
 if ('ResizeObserver' in window) { new ResizeObserver(function () { measure(frame); }).observe(doc.body); }
 win.addEventListener('hashchange', function () { setTimeout(function () { measure(frame); }, 60); });
 } catch (e) { /* harmless */ }
 }

 // Chrome the shell hides inside each embedded lens (its brand + cross-lens switcher).
 var EMBED_CSS = {
 standings: '.xnav{display:none!important}',
 circuits: '.topbar .brand,.topbar .lens{display:none!important}.topbar{justify-content:flex-end!important}'
 };

 function adopt(frame, css) {
 try {
 var doc = frame.contentDocument;
 if (!doc || doc.getElementById('shell-embed-css')) return;
 var s = doc.createElement('style');
 s.id = 'shell-embed-css';
 s.textContent = css;
 doc.head.appendChild(s);
 doc.documentElement.classList.add('shell-embedded');
 } catch (e) { /* cross-timing; harmless */ }
 }

 function parse() {
 var h = (location.hash || '').replace(/^#/, '');
 if (!h) return { lens: 'matrix', sub: '' };
 var i = h.indexOf('/');
 if (i === -1) return { lens: h, sub: '' };
 return { lens: h.slice(0, i), sub: h.slice(i + 1) };
 }

 function setInner(frame, hash) {
 try {
 var w = frame.contentWindow;
 if (!w) return;
 if ((w.location.hash || '') !== hash) w.location.hash = hash;
 } catch (e) { /* not ready; the frame 'load' handler re-runs route() */ }
 }

 function mark(lens) {
 document.querySelectorAll('.switch [role="tab"]').forEach(function (t) {
 t.setAttribute('aria-selected', t.getAttribute('data-nav') === lens ? 'true' : 'false');
 });
 }

 function route() {
 var p = parse();
 var wantCircuits = p.lens === 'circuits';
 // Reveal a surface only once it has booted + been adopted, so no un-stripped chrome flashes.
 cir.classList.toggle('active', wantCircuits && ready.circuits);
 std.classList.toggle('active', !wantCircuits && ready.standings);
 cir.setAttribute('aria-hidden', wantCircuits ? 'false' : 'true');
 std.setAttribute('aria-hidden', wantCircuits ? 'true' : 'false');

 if (wantCircuits) { setInner(cir, p.sub ? '#/' + p.sub : '#/'); mark('circuits'); }
 else if (p.lens === 'history') { setInner(std, '#history'); mark('history'); }
 else { setInner(std, ''); mark('matrix'); }
 // re-measure the surface we just switched to (inner view height may have changed)
 setTimeout(function () { measure(wantCircuits ? cir : std); }, 80);
 }

 tabs.forEach(function (t) {
 t.addEventListener('click', function (e) {
 e.preventDefault();
 var target = t.getAttribute('data-nav');
 if (('#' + target) === location.hash) route(); // same hash: re-assert view
 else location.hash = target;
 });
 });

 window.addEventListener('hashchange', route);
 window.addEventListener('resize', function () { measure(std); measure(cir); });
 std.addEventListener('load', function () { adopt(std, EMBED_CSS.standings); observe(std); measure(std); ready.standings = true; route(); });
 cir.addEventListener('load', function () { adopt(cir, EMBED_CSS.circuits); observe(cir); measure(cir); ready.circuits = true; route(); });

 if (!location.hash) location.hash = 'matrix';
 route();
})();
