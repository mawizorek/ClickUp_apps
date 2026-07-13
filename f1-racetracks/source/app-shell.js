/* app-shell.js — the ONE router for the unified F1 2026 app (v8).
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

 v8 iOS SCROLL FIX: mobile Safari expands an iframe to its full content height instead of
 giving it an internal scroll region; the shell body is overflow:hidden, so the iframe got
 clipped and NOTHING scrolled (Matrix / History / Circuits / Weekend all frozen on phones).
 Fix: at boot, wrap each iframe in a .frame-scroll div that owns overflow + touch scroll,
 and toggle the active/cross-fade on the WRAPPER (the div scrolls on iOS even when the
 iframe won't). Injected via JS + a <style> so index.html markup/head are untouched. */
(function () {
 var std = document.getElementById('lens-standings');
 var cir = document.getElementById('lens-circuits');
 var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
 var ready = { standings: false, circuits: false };

 // --- v8: inject scroll-wrapper CSS, then wrap each iframe so the WRAPPER scrolls ---
 var fixCss = document.createElement('style');
 fixCss.id = 'shell-scroll-fix';
 fixCss.textContent =
 '.stage .frame-scroll{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;' +
 '-webkit-overflow-scrolling:touch;opacity:0;pointer-events:none;background:var(--bg);' +
 'transition:opacity .3s cubic-bezier(0.16,1,0.3,1)}' +
 '.stage .frame-scroll.active{opacity:1;pointer-events:auto}' +
 '.stage .frame-scroll > iframe{position:static;display:block;width:100%;height:100%;' +
 'min-height:100%;border:0;background:var(--bg);opacity:1;pointer-events:auto}' +
 '@media (prefers-reduced-motion:reduce){.stage .frame-scroll{transition:none}}';
 document.head.appendChild(fixCss);

 function wrap(frame) {
 if (!frame) return null;
 var p = frame.parentNode;
 if (p && p.classList && p.classList.contains('frame-scroll')) return p;
 var w = document.createElement('div');
 w.className = 'frame-scroll';
 p.insertBefore(w, frame);
 w.appendChild(frame);
 return w;
 }
 var stdW = wrap(std);
 var cirW = wrap(cir);

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
 // v8: active/aria toggled on the scroll WRAPPER (falls back to the iframe if unwrapped).
 var showCir = wantCircuits && ready.circuits;
 var showStd = !wantCircuits && ready.standings;
 (cirW || cir).classList.toggle('active', showCir);
 (stdW || std).classList.toggle('active', showStd);
 (cirW || cir).setAttribute('aria-hidden', wantCircuits ? 'false' : 'true');
 (stdW || std).setAttribute('aria-hidden', wantCircuits ? 'true' : 'false');

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
