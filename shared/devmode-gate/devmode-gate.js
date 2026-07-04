/* Dev-Mode Gate - two-stage reusable smokescreen curtain.
 *
 * STAGE 1 (landing): reads as a genuine 'in development' page - animated
 *   construction stripe border, pleasant copy, and a discreet unlock button.
 *   Nothing on this view hints at a password.
 * STAGE 2 (keypad): pressing the unlock button surfaces the numeric keypad in
 *   place. Correct code dissolves the whole curtain; the real app is fully
 *   built underneath the entire time.
 *
 * Drop-in: place this as the FIRST element in <body>, then load this script:
 *   <div data-devmode-gate data-key="1234"></div>
 *   <script src="/ClickUp_apps/shared/devmode-gate/devmode-gate.js"></script>
 *
 * LIMITATION (read this): a UI curtain, NOT security. The app markup lives in
 * the DOM and is readable via view-source. The repo is PUBLIC. Use only for
 * decluttering / soft-gating a smokescreen landing - never to protect anything
 * sensitive. The key is configurable per page so it is not baked into this file.
 *
 * Config via data-* on the gate element:
 *   data-key          plaintext unlock code (default "1234")
 *   data-length       expected digit count (default = key length)
 *   data-dev-title    landing headline (default "In development")
 *   data-dev-message  landing body copy (default friendly under-construction line)
 *   data-unlock-label unlock button text (default "Unlock")
 *   data-title        keypad-view headline (default "Enter code")
 *   data-remember     "true" keeps it unlocked for the tab session (default off)
 */
(function () {
  var CSS = [
    '.dmg-overlay{position:fixed;inset:0;z-index:99999;background:oklch(12% 0.015 260);',
    'display:flex;align-items:center;justify-content:center;',
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;',
    'color:oklch(90% 0.008 260);padding:24px;}',
    /* construction stripe frame */
    '.dmg-frame{position:relative;width:min(92vw,440px);border-radius:16px;',
    'background:oklch(15% 0.012 260);padding:6px;overflow:hidden;}',
    '.dmg-frame::before{content:"";position:absolute;inset:0;border-radius:16px;padding:6px;',
    'background:repeating-linear-gradient(45deg,oklch(78% 0.15 85) 0 16px,oklch(20% 0.02 260) 16px 32px);',
    'background-size:200% 200%;animation:dmg-march 2.4s linear infinite;',
    '-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);',
    '-webkit-mask-composite:xor;mask-composite:exclude;}',
    '@keyframes dmg-march{to{background-position:32px 0;}}',
    '.dmg-inner{position:relative;background:oklch(16% 0.012 260);border-radius:11px;',
    'padding:34px 26px;display:flex;flex-direction:column;align-items:center;gap:18px;text-align:center;}',
    /* landing */
    '.dmg-cone{font-size:2.2rem;line-height:1;}',
    '.dmg-dev-title{font-size:1.15rem;font-weight:700;letter-spacing:-.01em;}',
    '.dmg-dev-msg{font-size:.85rem;line-height:1.5;color:oklch(64% 0.01 260);max-width:32ch;}',
    '.dmg-unlock{margin-top:4px;font-size:.7rem;font-weight:600;text-transform:uppercase;',
    'letter-spacing:.08em;color:oklch(58% 0.02 260);background:none;border:1px solid oklch(28% 0.015 260);',
    'border-radius:100px;padding:7px 16px;cursor:pointer;transition:all 150ms;-webkit-tap-highlight-color:transparent;}',
    '.dmg-unlock:hover{color:oklch(85% 0.01 260);border-color:oklch(45% 0.02 260);}',
    '.dmg-unlock:active{transform:scale(.96);}',
    /* keypad view */
    '.dmg-title{font-size:1rem;font-weight:600;letter-spacing:.02em;color:oklch(70% 0.01 260);}',
    '.dmg-dots{display:flex;gap:14px;}',
    '.dmg-dot{width:13px;height:13px;border-radius:50%;border:1.5px solid oklch(45% 0.02 260);transition:all 140ms;}',
    '.dmg-dot.filled{background:oklch(72% 0.14 260);border-color:oklch(72% 0.14 260);}',
    '.dmg-pad{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;width:min(74vw,240px);}',
    '.dmg-key{aspect-ratio:1;border:1px solid oklch(26% 0.015 260);background:oklch(18% 0.012 260);',
    'color:oklch(92% 0.008 260);border-radius:50%;font-size:1.4rem;font-weight:500;cursor:pointer;',
    'display:flex;align-items:center;justify-content:center;user-select:none;',
    '-webkit-tap-highlight-color:transparent;transition:background 120ms,transform 80ms;}',
    '.dmg-key:hover{background:oklch(24% 0.014 260);}',
    '.dmg-key:active{transform:scale(.93);background:oklch(30% 0.02 260);}',
    '.dmg-key.ghost{background:none;border:none;cursor:default;}',
    '.dmg-pad.wrong{animation:dmg-shake 360ms;}',
    '@keyframes dmg-shake{0%,100%{transform:translateX(0);}20%,60%{transform:translateX(-8px);}40%,80%{transform:translateX(8px);}}',
    '.dmg-hint{font-size:.7rem;color:oklch(52% 0.01 260);min-height:1em;}',
    '.dmg-hide{display:none !important;}'
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
    var devTitle = el.getAttribute('data-dev-title') || 'In development';
    var devMsg = el.getAttribute('data-dev-message') || 'This page is still being built. Check back soon.';
    var unlockLabel = el.getAttribute('data-unlock-label') || 'Unlock';
    var padTitle = el.getAttribute('data-title') || 'Enter code';
    var remember = el.getAttribute('data-remember') === 'true';
    var storeId = 'dmg:' + (el.id || location.pathname);

    if (remember && sessionStorage.getItem(storeId) === 'open') { el.remove(); return; }

    injectCSS();
    document.body.style.overflow = 'hidden';

    var entry = '';
    var overlay = document.createElement('div');
    overlay.className = 'dmg-overlay';

    var frame = document.createElement('div');
    frame.className = 'dmg-frame';
    var inner = document.createElement('div');
    inner.className = 'dmg-inner';
    frame.appendChild(inner);
    overlay.appendChild(frame);

    // ---- Stage 1: landing ----
    var landing = document.createElement('div');
    landing.className = 'dmg-inner';
    landing.style.padding = '0';
    landing.style.gap = '18px';
    var cone = document.createElement('div'); cone.className = 'dmg-cone'; cone.textContent = '\uD83D\uDEA7';
    var dTitle = document.createElement('div'); dTitle.className = 'dmg-dev-title'; dTitle.textContent = devTitle;
    var dMsg = document.createElement('div'); dMsg.className = 'dmg-dev-msg'; dMsg.textContent = devMsg;
    var unlockBtn = document.createElement('button'); unlockBtn.className = 'dmg-unlock'; unlockBtn.type = 'button'; unlockBtn.textContent = unlockLabel;
    landing.appendChild(cone); landing.appendChild(dTitle); landing.appendChild(dMsg); landing.appendChild(unlockBtn);

    // ---- Stage 2: keypad ----
    var keypad = document.createElement('div');
    keypad.className = 'dmg-inner dmg-hide';
    keypad.style.padding = '0';
    var titleEl = document.createElement('div'); titleEl.className = 'dmg-title'; titleEl.textContent = padTitle;
    var dots = document.createElement('div'); dots.className = 'dmg-dots';
    for (var i = 0; i < length; i++) { var d = document.createElement('div'); d.className = 'dmg-dot'; dots.appendChild(d); }
    var hint = document.createElement('div'); hint.className = 'dmg-hint';
    var pad = document.createElement('div'); pad.className = 'dmg-pad';
    var layout = ['1','2','3','4','5','6','7','8','9','','0','back'];
    layout.forEach(function (label) {
      var k = document.createElement('button');
      k.className = 'dmg-key'; k.type = 'button';
      if (label === '') { k.className += ' ghost'; k.disabled = true; }
      else if (label === 'back') { k.textContent = '\u232B'; k.setAttribute('aria-label', 'delete'); }
      else { k.textContent = label; }
      k.addEventListener('click', function () { press(label); });
      pad.appendChild(k);
    });
    keypad.appendChild(titleEl); keypad.appendChild(dots); keypad.appendChild(pad); keypad.appendChild(hint);

    inner.appendChild(landing);
    inner.appendChild(keypad);

    var stage = 'landing';
    unlockBtn.addEventListener('click', function () {
      stage = 'keypad';
      landing.classList.add('dmg-hide');
      keypad.classList.remove('dmg-hide');
    });

    function renderDots() {
      dots.querySelectorAll('.dmg-dot').forEach(function (dot, idx) { dot.classList.toggle('filled', idx < entry.length); });
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
      entry = ''; renderDots();
    }
    function press(label) {
      if (stage !== 'keypad') return;
      if (label === 'back') { entry = entry.slice(0, -1); renderDots(); return; }
      if (label === '' || entry.length >= length) return;
      entry += label; renderDots();
      if (entry.length === length) { if (entry === key) unlock(); else reject(); }
    }

    document.addEventListener('keydown', function (e) {
      if (!document.body.contains(overlay) || stage !== 'keypad') return;
      if (e.key >= '0' && e.key <= '9') press(e.key);
      else if (e.key === 'Backspace') press('back');
    });

    el.replaceWith(overlay);
    renderDots();
  }

  function boot() {
    document.querySelectorAll('[data-devmode-gate]').forEach(initGate);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
