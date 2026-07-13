/* app-shell.js — the ONE router for the unified F1 2026 app (v7).
 Owns lens switching between the standings surface (Matrix + History, one document) and
 the circuits surface, each mounted in an isolated, always-warm iframe. Switching is an
 opacity cross-fade with NO reload: the chrome never unmounts and neither lens re-boots.

 Shell hash is the top-level source of truth:
   #matrix (default) -> standings surface, inner hash cleared (matrix view)
   #history          -> standings surface, inner hash '#history'
   #circuits         -> circuits surface, inner hash '#/'
   #circuits/<slug>  -> circuits surface, inner hash '#/<slug>'

 ADOPTION: the shell is same-origin with both lenses, so on each iframe 'load' it injects
 a chrome-hiding <style> into that lens (the lenses ship their own brand + switcher for
 standalone use; embedded, the shell owns them) and then drives the inner hash. This
 touches ZERO lines of the lens code — both pages still work opened directly.

 Inner sub-navigation (clicking a circuit card) stays inside the circuits iframe by
 design; the shell owns the top-level lens only, keeping the two realms decoupled. */
(function () {
 var std = document.getElementById('lens-standings');
 var cir = document.getElementById('lens-circuits');
 var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
 var ready = { standings: false, circuits: false };

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
 std.addEventListener('load', function () { adopt(std, EMBED_CSS.standings); ready.standings = true; route(); });
 cir.addEventListener('load', function () { adopt(cir, EMBED_CSS.circuits); ready.circuits = true; route(); });

 if (!location.hash) location.hash = 'matrix';
 route();
})();
