/* QR Forge · source/app.js
   The single-code view plus the shared chrome (drawer, tabs, theme, footer stamp).
   Batch lives in batch.js. Nothing here talks to a network. */
(function () {
  'use strict';

  var R = window.QRRender, QR = window.QR;
  var $ = function (id) { return document.getElementById(id); };

  /* Export strings live up here as named constants so a rename is one edit. */
  var FILE_SVG = function (s) { return s + '.svg'; };
  var FILE_PNG = function (s) { return s + '.png'; };
  var THEME_KEY = 'qrforge.theme';

  /* Practical print floors. Below ~0.33mm a module stops being resolvable by
     the phone cameras and handhelds people actually use; 0.5mm is the size to
     aim for on anything that will get handled. */
  var MODULE_FLOOR = 0.33, MODULE_SAFE = 0.5;

  var state = { ecl: 'Q', sym: null, urls: [] };

  function freeUrls() {
    state.urls.forEach(function (u) { URL.revokeObjectURL(u); });
    state.urls = [];
  }
  function blobUrl(content, type) {
    var u = URL.createObjectURL(new Blob([content], { type: type }));
    state.urls.push(u);
    return u;
  }

  var framed = false;
  try { framed = window.self !== window.top; } catch (e) { framed = true; }

  /* ── chrome ──────────────────────────────────────────── */
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'light' ? '#f2efe8' : '#211d14');
    Array.prototype.forEach.call($('theme-seg').children, function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.themeSet === t));
    });
  }

  function initChrome() {
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    setTheme(saved === 'light' ? 'light' : 'dark');
    $('theme-seg').addEventListener('click', function (e) {
      var b = e.target.closest('[data-theme-set]');
      if (b) setTheme(b.dataset.themeSet);
    });

    var gear = $('gear'), drawer = $('drawer');
    function closeDrawer() { drawer.hidden = true; gear.setAttribute('aria-expanded', 'false'); }
    gear.addEventListener('click', function () {
      var open = gear.getAttribute('aria-expanded') === 'true';
      drawer.hidden = open;
      gear.setAttribute('aria-expanded', String(!open));
    });
    document.addEventListener('click', function (e) {
      if (drawer.hidden) return;
      if (!drawer.contains(e.target) && !gear.contains(e.target)) closeDrawer();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !drawer.hidden) { closeDrawer(); gear.focus(); }
    });

    var tabs = [$('t-one'), $('t-batch')], panels = [$('p-one'), $('p-batch')];
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () {
        tabs.forEach(function (o, j) {
          o.setAttribute('aria-selected', String(i === j));
          panels[j].hidden = i !== j;
        });
        if (i === 1 && window.QRBatch) window.QRBatch.refresh();
      });
    });

    var b = window.QRF_BUILD || { version: '?', pr: 0 };
    $('stamp').textContent = 'QR Forge v' + b.version + ' · ' + (b.pr ? 'PR #' + b.pr : 'PR pending');

    $('selftest').addEventListener('click', function () {
      var out = $('selftest-out'), r = window.QRSelfTest.run();
      out.hidden = false;
      out.textContent = r.tests.map(function (t) {
        return (t.pass ? '✓ ' : '✕ ') + t.name + (t.detail ? '  (' + t.detail + ')' : '');
      }).join('\n') + '\n\n' + r.passed + ' passed, ' + r.failed + ' failed. These check the\n' +
        'encoder against the published values in the standard. Only a real scanner\n' +
        'can confirm the printed code reads.';
    });
  }

  /* ── the single code ─────────────────────────────────────── */
  function opts() {
    return {
      ecl: state.ecl,
      boost: $('boost').checked,
      mask: parseInt($('mask').value, 10),
      quiet: Math.max(0, Math.min(8, parseInt($('quiet').value, 10) || 0)),
      width: Math.max(8, Math.min(300, parseFloat($('width').value) || 30)),
      scale: parseInt($('scale').value, 10) || 8,
      transparent: $('transparent').checked,
      label: $('label').value.trim()
    };
  }

  function cell(term, val, flag, sub) {
    return '<div><dt>' + term + '</dt><dd' + (flag ? ' class="flag"' : '') + '>' +
      val + (sub ? '<small>' + sub + '</small>' : '') + '</dd></div>';
  }

  function render() {
    var o = opts(), text = $('payload').value.trim();
    var art = $('art'), cap = $('cap'), notice = $('notice'), readout = $('readout'), acts = $('acts');

    freeUrls();
    $('scale-out').textContent = o.scale;
    $('ecl-hint').innerHTML = 'Survives roughly <strong>' + QR.tolerance[state.ecl] +
      '%</strong> of the code being scuffed, printed badly or covered.';
    $('payload-hint').textContent = text
      ? QR.byteLength(text) + ' bytes encoded. Every character is inside the pattern.'
      : 'Whatever goes in here is what the code will always point at.';

    if (!text) {
      art.innerHTML = '<p class="empty">Paste a link to see the code.</p>';
      cap.hidden = true; notice.hidden = true; readout.hidden = true; acts.hidden = true;
      return;
    }

    var sym;
    try {
      sym = QR.encode(text, { ecl: o.ecl, boost: o.boost, mask: o.mask });
    } catch (err) {
      art.innerHTML = '<p class="empty">No symbol can hold this.</p>';
      cap.hidden = true; readout.hidden = true; acts.hidden = true;
      notice.hidden = false;
      notice.className = 'notice hard';
      notice.textContent = err.message + ' Shorten the link, or drop to a lower error correction level.';
      return;
    }
    state.sym = sym;

    var span = sym.size + o.quiet * 2;
    var moduleMm = o.width / span;
    var codeMm = moduleMm * sym.size;
    var reachM = codeMm * 10 / 1000;

    art.innerHTML = R.svg(sym, { quiet: o.quiet, scale: 10, label: o.label || text, transparent: false });

    cap.hidden = false;
    cap.innerHTML = (o.label ? '<b>' + R.esc(o.label) + '</b>' : '') +
      '<span>' + R.esc(text.length > 120 ? text.slice(0, 119) + '…' : text) + '</span>';

    var tight = moduleMm < MODULE_FLOOR, snug = moduleMm < MODULE_SAFE;
    readout.hidden = false;
    readout.innerHTML =
      cell('Symbol', 'v' + sym.version, false, sym.size + ' × ' + sym.size + ' modules') +
      cell('Correction', sym.ecl + (sym.ecl !== sym.requestedEcl ? ' ↑' : ''), false,
           sym.tolerance + '% loss tolerated') +
      cell('Payload', sym.payloadBytes + ' B', false, 'of ' + sym.capacityBytes + ' B at this size') +
      cell('Module', moduleMm.toFixed(2) + ' mm', snug, 'at ' + o.width + ' mm wide') +
      cell('Reads to', (reachM < 1 ? Math.round(reachM * 100) + ' cm' : reachM.toFixed(1) + ' m'),
           false, 'rough ceiling, good light') +
      cell('Mask', String(sym.mask), false, o.mask >= 0 ? 'forced' : 'lowest penalty');

    if (tight) {
      notice.hidden = false; notice.className = 'notice hard';
      notice.textContent = 'At ' + o.width + ' mm each module is ' + moduleMm.toFixed(2) +
        ' mm, below what most phone cameras and handheld scanners resolve. Print it bigger, ' +
        'shorten the link, or drop the correction level to get a smaller symbol.';
    } else if (snug) {
      notice.hidden = false; notice.className = 'notice';
      notice.textContent = 'Modules are ' + moduleMm.toFixed(2) + ' mm. That works on clean ' +
        'laser output but gets marginal on labels, thermal paper or anything that will be handled. ' +
        MODULE_SAFE + ' mm is the size to aim for.';
    } else if (sym.ecl !== sym.requestedEcl) {
      notice.hidden = false; notice.className = 'notice';
      notice.textContent = 'There was spare room inside version ' + sym.version + ', so the correction ' +
        'level went from ' + sym.requestedEcl + ' up to ' + sym.ecl + '. Same physical size, more damage survived.';
    } else {
      notice.hidden = true;
    }

    var name = R.slug(o.label || text.replace(/^https?:\/\//, ''));
    var svgOut = R.svg(sym, { quiet: o.quiet, mm: o.width, label: o.label || text, transparent: o.transparent });

    acts.hidden = false;
    var svgA = $('dl-svg');
    svgA.href = blobUrl(svgOut, 'image/svg+xml');
    svgA.download = FILE_SVG(name);
    if (framed) { svgA.target = '_blank'; svgA.rel = 'noopener'; }

    var pngA = $('dl-png');
    pngA.setAttribute('aria-disabled', 'true');
    pngA.textContent = 'Building PNG…';
    R.canvas(sym, { quiet: o.quiet, scale: o.scale }).toBlob(function (b) {
      var u = URL.createObjectURL(b);
      state.urls.push(u);
      pngA.href = u;
      pngA.download = FILE_PNG(name);
      pngA.removeAttribute('aria-disabled');
      pngA.textContent = 'Download PNG (' + (span * o.scale) + 'px)';
      if (framed) { pngA.target = '_blank'; pngA.rel = 'noopener'; }
    }, 'image/png');

    $('copy-svg').onclick = function () { copy(svgOut, $('copy-svg'), 'Copy SVG markup'); };
  }

  function copy(text, btn, label) {
    function done() {
      btn.textContent = 'Copied';
      btn.classList.add('done');
      setTimeout(function () { btn.textContent = label; btn.classList.remove('done'); }, 1500);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else { fallback(); }
    function fallback() {
      var t = document.createElement('textarea');
      t.value = text;
      t.style.cssText = 'position:fixed;top:-9999px';
      document.body.appendChild(t);
      t.select();
      try { document.execCommand('copy'); done(); } catch (e) { btn.textContent = 'Copy failed'; }
      document.body.removeChild(t);
    }
  }

  /* ── boot ────────────────────────────────────────────── */
  var pending;
  function schedule() { clearTimeout(pending); pending = setTimeout(render, 90); }

  function init() {
    initChrome();

    $('ecl-seg').addEventListener('click', function (e) {
      var b = e.target.closest('[data-ecl]');
      if (!b) return;
      state.ecl = b.dataset.ecl;
      Array.prototype.forEach.call($('ecl-seg').children, function (o) {
        o.setAttribute('aria-pressed', String(o === b));
      });
      render();
    });

    ['payload', 'label', 'quiet', 'width'].forEach(function (id) {
      $(id).addEventListener('input', schedule);
    });
    ['boost', 'mask', 'transparent'].forEach(function (id) {
      $(id).addEventListener('change', render);
    });
    $('scale').addEventListener('input', function () {
      $('scale-out').textContent = $('scale').value;
      schedule();
    });

    $('payload').value = 'https://mawizorek.github.io/ClickUp_apps/qr-forge/';
    $('label').value = 'QR Forge';
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
