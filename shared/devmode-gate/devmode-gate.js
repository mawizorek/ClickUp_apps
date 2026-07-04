/* Dev-Mode Gate - reusable smokescreen curtain.
 *
 * Drop-in: place this as the FIRST element in <body>, then load this script:
 *   <div data-devmode-gate data-key="1234" data-title="Dev mode"></div>
 *   <script src="/ClickUp_apps/shared/devmode-gate/devmode-gate.js"></script>
 * The rest of the page is the real app, fully built underneath. This overlay
 * covers it until the correct code is entered, then removes itself.
 *
 * LIMITATION (read this): a UI curtain, NOT security. The app markup lives in
 * the DOM and is readable via view-source. The repo is PUBLIC. Use only for
 * decluttering / soft-gating a smokescreen landing - never to protect anything
 * sensitive. The key is configurable per page so it is not baked into this file.
 *
 * Config via data-* on the gate element:
 *   data-key       plaintext unlock code (default "1234")
 *   data-length    expected digit count (default = key length)
 *   data-title     headline on the curtain (default "Enter code")
 *   data-remember  "true" keeps it unlocked for the tab session (default off)
 */
(function () {
  var CSS = [
    '.dmg-overlay{position:fixed;inset:0;z-index:99999;background:oklch(12% 0.015 260);',
    'display:flex;flex-direction:column;align-items:center;justify-content:center;',
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;',
    'color:oklch(90% 0.008 260);padding:24px;gap:22px;}',
    '.dmg-title{font-size:1rem;font-weight:600;letter-spacing:.02em;color:oklch(70% 0.01 260);}',
    '.dmg-dots{display:flex;gap:14px;}',
    '.dmg-dot{width:13px;height:13px;border-radius:50%;border:1.5px solid oklch(45% 0.02 260);transition:all 140ms;}',
    '.dmg-dot.filled{background:oklch(72% 0.14 260);border-color:oklch(72% 0.14 260);}',
    '.dmg-pad{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;width:min(78vw,264px);}',
    '.dmg-key{aspect-ratio:1;border:1px solid oklch(26% 0.015 260);background:oklch(18% 0.012 260);',
    'color:oklch(92% 0.008 260);border-radius:50%;font-size:1.4rem;font-weight:500;cursor:pointer;',
    'display:flex;align-items:center;justify-content:center;user-select:none;',
    '-webkit-tap-highlight-color:transparent;transition:background 120ms,transform 80ms;}',
    '.dmg-key:hover{background:oklch(24% 0.014 260);}',
    '.dmg-key:active{transform:scale(.93);background:oklch(30% 0.02 260);}',
    '.dmg-key.ghost{background:none;border:none;cursor:default;}',
    '.dmg-key.wrong{animation:dmg-shake 360ms;}',
    '@keyframes dmg-shake{0%,100%{transform:translateX(0);}20%,60%{transform:translateX(-8px);}40%,80%{transform:translateX(8px);}}',
    '.dmg-hint{font-size:.7rem;color:oklch(52% 0.01 260);min-height:1em;}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('dmg-style')) return;
    var s = document.createElement('style');
    s.id = 'dmg-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function initGate(el) {
    var key = el.getAttribute('data-key') || '1234';
    var length = parseInt(el.getAttribute('data-length') || String(key.length), 10);
    var title = el.getAttribute('data-title') || 'Enter code';
    var remember = el.getAttribute('data-remember') === 'true';
    var storeId = 'dmg:' + (el.id || location.pathname);

    if (remember && sessionStorage.getItem(storeId) === 'open') { el.remove(); return; }

    injectCSS();
    document.body.style.overflow = 'hidden';

    var entry = '';
    var overlay = document.createElement('div');
    overlay.className = 'dmg-overlay';

    var titleEl = document.createElement('div');
    titleEl.className = 'dmg-title';
    titleEl.textContent = title;

    var dots = document.createElement('div');
    dots.className = 'dmg-dots';
    for (var i = 0; i < length; i++) {
      var d = document.createElement('div');
      d.className = 'dmg-dot';
      dots.appendChild(d);
    }

    var hint = document.createElement('div');
    hint.className = 'dmg-hint';

    var pad = document.createElement('div');
    pad.className = 'dmg-pad';
    var layout = ['1','2','3','4','5','6','7','8','9','','0','back'];
    layout.forEach(function (label) {
      var k = document.createElement('button');
      k.className = 'dmg-key';
      k.type = 'button';
      if (label === '') { k.className += ' ghost'; k.disabled = true; }
      else if (label === 'back') { k.textContent = '\u232B'; k.setAttribute('aria-label', 'delete'); }
      else { k.textContent = label; }
      k.addEventListener('click', function () { press(label); });
      pad.appendChild(k);
    });

    function renderDots() {
      var ds = dots.querySelectorAll('.dmg-dot');
      ds.forEach(function (dot, idx) { dot.classList.toggle('filled', idx < entry.length); });
    }

    function unlock() {
      document.body.style.overflow = '';
      if (remember) sessionStorage.setItem(storeId, 'open');
      overlay.style.transition = 'opacity 240ms';
      overlay.style.opacity = '0';
      setTimeout(function () { overlay.remove(); }, 260);
    }

    function reject() {
      pad.classList.add('wrong');
      hint.textContent = 'Nope';
      setTimeout(function () { pad.classList.remove('wrong'); hint.textContent = ''; }, 400);
      entry = '';
      renderDots();
    }

    function press(label) {
      if (label === 'back') { entry = entry.slice(0, -1); renderDots(); return; }
      if (label === '' || entry.length >= length) return;
      entry += label;
      renderDots();
      if (entry.length === length) {
        if (entry === key) unlock(); else reject();
      }
    }

    document.addEventListener('keydown', function (e) {
      if (!document.body.contains(overlay)) return;
      if (e.key >= '0' && e.key <= '9') press(e.key);
      else if (e.key === 'Backspace') press('back');
    });

    overlay.appendChild(titleEl);
    overlay.appendChild(dots);
    overlay.appendChild(pad);
    overlay.appendChild(hint);
    el.replaceWith(overlay);
    renderDots();
  }

  function boot() {
    var gates = document.querySelectorAll('[data-devmode-gate]');
    gates.forEach(initGate);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
