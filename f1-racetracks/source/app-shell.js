/* app-shell.js — the ONE router for the unified F1 2026 app (v9).
 Owns lens switching between the standings surface (Matrix + History, one document) and
 the circuits surface, each mounted in an isolated, always-warm iframe. Switching is an
 opacity cross-fade with NO reload: the chrome never unmounts and neither lens re-boots.

 Shell hash is the top-level source of truth:
   #matrix (default) -> standings surface, inner hash cleared (matrix view)
   #history          -> standings surface, inner hash '#history'
   #circuits         -> circuits surface, inner hash '#/'
   #circuits/<slug>  -> circuits surface, inner hash '#/<slug>'

 ADOPTION: the shell is same-origin with both lenses, so on each iframe 'load' it injects
 a chrome-hiding <style> into that lens and drives the inner hash. Zero edits to lens code.

 iOS SCROLL (v8 -> v9): mobile Safari won't give an iframe an internal scroll region, and
 the shell body is overflow:hidden. v8 wrapped each iframe in a .frame-scroll div so the
 WRAPPER scrolls — but with the iframe pinned to height:100% the wrapper had nothing taller
 than itself to scroll (so only circuits, which self-scrolled, appeared to work). v9 fixes
 it properly: because both lenses are SAME-ORIGIN, we height-sync each iframe to its inner
 content (iframe.style.height = inner scrollHeight) via a ResizeObserver on the inner body
 plus a re-measure on load/route/inner-hashchange. The iframe grows to content height, the
 wrapper (overflow-y:auto, -webkit-overflow-scrolling:touch) then has real height to scroll.
 Standings does an in-doc matrix<->history swap and weekend renders async, so the observer
 is what keeps height correct across those without any reload. */
(function () {
 var std = document.getElementById('lens-standings');
 var cir = document.getElementById('lens-circuits');
 var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
 var ready = { standings: false, circuits: false };

 // inject scroll-wrapper CSS (iframe height is now content-driven, NOT 100%)
 var fixCss = document.createElement('style');
 fixCss.id = 'shell-scroll-fix';
 fixCss.textContent =
 '.stage .frame-scroll{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;' +
 '-webkit-overflow-scrolling:touch;opacity:0;pointer-events:none;background:var(--bg);' +
 'transition:opacity .3s cubic-bezier(0.16,1,0.3,1)}' +
 '.stage .frame-scroll.active{opacity:1;pointer-events:auto}' +
 '.stage .frame-scroll > iframe{display:block;width:100%;min-height:100%;border:0;' +
 'background:var(--bg)}' +
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

 // --- v9 height-sync: grow each same-origin iframe to its inner content height ---
 function measure(frame) {
 try {
 var doc = frame.contentDocument;
 if (!doc || !doc.body) return;
 // reset so a shrink can be detected, then read the true content height
 frame.style.height = 'auto';
 var h = Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight);
 frame.style.height = h + 'px';
 } catch (e) { /* cross-timing; harmless */ }
 }
 function observe(frame) {
 try {
 var doc = frame.contentDocument;
 if (!doc || !doc.body || !('ResizeObserver' in window)) return;
 var ro = new ResizeObserver(function () { measure(frame); });
 ro.observe(doc.body);
 // inner navigation (matrix<->history swap, weekend route) changes height w/o reload
 frame.contentWindow.addEventListener('hashchange', function () { setTimeout(function(){measure(frame);}, 60); });
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
 var showCir = wantCircuits && ready.circuits;
 var showStd = !wantCircuits && ready.standings;
 (cirW || cir).classList.toggle('active', showCir);
 (stdW || std).classList.toggle('active', showStd);
 (cirW || cir).setAttribute('aria-hidden', wantCircuits ? 'false' : 'true');
 (stdW || std).setAttribute('aria-hidden', wantCircuits ? 'true' : 'false');

 if (wantCircuits) { setInner(cir, p.sub ? '#/' + p.sub : '#/'); mark('circuits'); }
 else if (p.lens === 'history') { setInner(std, '#history'); mark('history'); }
 else { setInner(std, ''); mark('matrix'); }
 // re-measure the surface we just switched to (inner view may have changed height)
 setTimeout(function(){ measure(wantCircuits ? cir : std); }, 70);
 }

 tabs.forEach(function (t) {
 t.addEventListener('click', function (e) {
 e.preventDefault();
 var target = t.getAttribute('data-nav');
 if (('#' + target) === location.hash) route();
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
