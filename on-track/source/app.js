// On Track — app shell: filter toggles, event binding, self-contained export, bootstrap.
// Loaded AFTER render.js (shared global scope: uses state/$/render fns defined there).
function toggleSet(set, val, key, el) {
  set.has(val) ? set.delete(val) : set.add(val);
  el.setAttribute('aria-pressed', set.has(val));
  localStorage.setItem(key, JSON.stringify(Array.from(set)));
  updateFilterCounts();
  renderSchedule();
}
// Rebuild a fully self-contained copy by re-inlining every external source file at runtime,
// so exported/downloaded copies still work standalone even though the served app is multi-file.
// The current DATA is inlined too, so an offline copy renders the exact listings it was saved with.
function buildSelfContained() {
  const bust = '?v=' + Date.now();
  return Promise.all([
    fetch('./index.html' + bust).then(r => r.text()),
    fetch('./source/styles.css' + bust).then(r => r.text()),
    fetch('./source/render.js' + bust).then(r => r.text()),
    fetch('./source/app.js' + bust).then(r => r.text())
  ]).then(function (parts) {
    const html = parts[0], css = parts[1], rjs = parts[2], ajs = parts[3];
    const dataScript = '<script>window.__ONTRACK_DATA__=' + JSON.stringify(DATA) + ';<\/script>';
    return html
      .replace('<link rel="stylesheet" href="./source/styles.css">', '<style>\n' + css + '\n</style>')
      .replace('<script src="./source/render.js" defer><\/script>', dataScript + '\n<script>\n' + rjs + '\n<\/script>')
      .replace('<script src="./source/app.js" defer><\/script>', '<script>\n' + ajs + '\n<\/script>');
  });
}
function exportSelfContained(onOk, onFail) {
  buildSelfContained().then(onOk).catch(onFail);
}
function fallbackCopy(text, done) {
  const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta);
  ta.select(); try { document.execCommand('copy'); } catch (e) {} ta.remove(); done();
}
function flash(sel, txt) {
  const el = $(sel); const o = el.textContent; el.textContent = txt;
  setTimeout(() => { el.textContent = o; }, 1500);
}
function wire() {
  $('#themeBtn').addEventListener('click', () => {
    state.theme = state.theme === 'rb' ? 'light' : 'rb';
    localStorage.setItem('ontrack_theme', state.theme); applyTheme();
  });
  const setTZ = tz => {
    state.tz = tz; localStorage.setItem('ontrack_tz', tz);
    $('#tzET').setAttribute('aria-pressed', tz === 'ET');
    $('#tzLocal').setAttribute('aria-pressed', tz === 'local');
    buildJump(); renderHero(); renderSchedule(); tick();
  };
  $('#tzET').addEventListener('click', () => setTZ('ET'));
  $('#tzLocal').addEventListener('click', () => setTZ('local'));
  $('#tzET').setAttribute('aria-pressed', state.tz === 'ET');
  $('#tzLocal').setAttribute('aria-pressed', state.tz === 'local');
  $('#headSeries').addEventListener('click', () => toggleSection($('#secSeries')));
  $('#headWatch').addEventListener('click', () => toggleSection($('#secWatch')));
  $('#jumpDate').addEventListener('change', ev => { const k = ev.target.value; jumpTo(k); ev.target.value = ''; });
  $('#pastToggle').addEventListener('click', () => { state.showPast = !state.showPast; renderSchedule(); });
  let deb;
  $('#search').addEventListener('input', ev => {
    clearTimeout(deb);
    deb = setTimeout(() => { state.q = ev.target.value.trim().toLowerCase(); renderSchedule(); }, 120);
  });
  $('#clrSeries').addEventListener('click', () => {
    state.series.clear(); localStorage.removeItem('ontrack_series'); buildChips(); renderSchedule();
  });
  $('#clrPlat').addEventListener('click', () => {
    state.plats.clear(); localStorage.removeItem('ontrack_plats'); buildChips(); renderSchedule();
  });
  $('#copySrc').addEventListener('click', () => {
    exportSelfContained(full => {
      const done = () => flash('#copySrc', '✓ Copied');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(full).then(done).catch(() => fallbackCopy(full, done));
      } else { fallbackCopy(full, done); }
    }, () => flash('#copySrc', 'Failed — retry'));
  });
  $('#prepDl').addEventListener('click', () => {
    exportSelfContained(full => {
      const url = URL.createObjectURL(new Blob([full], { type: 'text/html' }));
      const a = $('#saveLink'); a.href = url; a.download = APP_SLUG + '-' + APP_VERSION + '.html';
      a.style.display = 'inline-flex'; flash('#prepDl', 'Ready →');
      setTimeout(() => URL.revokeObjectURL(url), 90000);
    }, () => flash('#prepDl', 'Failed — retry'));
  });
  $('#openTab').addEventListener('click', () => {
    exportSelfContained(full => {
      const url = URL.createObjectURL(new Blob([full], { type: 'text/plain' }));
      window.open(url, '_blank'); setTimeout(() => URL.revokeObjectURL(url), 90000);
    }, () => flash('#openTab', 'Failed — retry'));
  });
}
function render() { renderHero(); renderSchedule(); }
function boot() {
  hydrate();
  applyTheme();
  buildChips();
  buildJump();
  sectionInit();
  render();
  wire();
  $('#verLine').textContent = 'On Track ' + APP_VERSION;
  $('#dataStamp').textContent = ' · listings ' + (DATA.version || APP_DATE);
  $('#feedBy').textContent = 'Engine ' + APP_VERSION + ' · ' + APP_DATE + '.';
  tick();
  setInterval(tick, 1000);
}
(function init() {
  if (window.__ONTRACK_DATA__ && Array.isArray(window.__ONTRACK_DATA__.events)) {
    DATA = window.__ONTRACK_DATA__;
  } else {
    try {
      const cached = localStorage.getItem('ontrack_data');
      if (cached) { const j = JSON.parse(cached); if (j && Array.isArray(j.events)) DATA = j; }
    } catch (e) {}
  }
  boot();
  if (!window.__ONTRACK_DATA__ && typeof fetch === 'function') {
    fetch('./data.json', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(json => {
        if (json && Array.isArray(json.events)) {
          DATA = json;
          try { localStorage.setItem('ontrack_data', JSON.stringify(json)); } catch (e) {}
          hydrate(); buildChips(); buildJump(); render();
          $('#dataStamp').textContent = ' · listings ' + (DATA.version || APP_DATE);
        }
      })
      .catch(() => {});
  }
})();
