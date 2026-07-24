// On Track — app shell: filter toggles, settings popover, event binding, bootstrap.
// Loaded AFTER render.js (shared global scope: uses state/$/render fns defined there).
function toggleSet(set, val, key, el) {
  set.has(val) ? set.delete(val) : set.add(val);
  el.setAttribute('aria-pressed', set.has(val));
  localStorage.setItem(key, JSON.stringify(Array.from(set)));
  updateFilterCounts();
  renderSchedule();
}
// Series chip tri-state cycle (per series, not global):
//   off -> 'race' (races + qualifying) -> 'all' (+ practice) -> off
// Qualifying always shows on a selected series (it's never gated); only PRACTICE is the
// opt-in 3rd state. A series with NO practice-tier events skips the middle state and
// behaves as a plain 2-state toggle (off -> race -> off), so the 3rd click never lands on
// an identical view. Hero is re-rendered too, so 'on now / up next' respects the new tier.
function cycleSeries(name, el) {
  const cur = state.series.get(name);
  const hasPrac = SERIES_WITH_PRACTICE.has(name);
  let next;
  if (!cur) next = 'race';
  else if (cur === 'race') next = hasPrac ? 'all' : null;
  else next = null;
  if (next) state.series.set(name, next); else state.series.delete(name);
  saveSeriesState();
  const tier = state.series.get(name) || 'off';
  const lb = (SERIES[name] || {}).label || name;
  el.setAttribute('data-tier', tier);
  el.setAttribute('aria-pressed', String(tier !== 'off'));
  el.setAttribute('aria-label', lb + (tier === 'race' ? ' — races and qualifying' : tier === 'all' ? ' — races, qualifying, and practice' : ' — off'));
  updateFilterCounts();
  renderSchedule();
  renderHero();
}
// One-time discoverability line above the series chips. The default view already shows
// everything (races + qualifying + practice), so this explains how to NARROW: tapping a
// series filters to it (races + qualifying), a 2nd tap adds its practice (+P), a 3rd clears
// it. Injected once (guarded by id) so buildChips() rebuilds never duplicate or clobber it.
function addSeriesHint() {
  const chips = document.getElementById('seriesChips');
  if (!chips || document.getElementById('seriesHint')) return;
  const hint = document.createElement('p');
  hint.id = 'seriesHint';
  hint.className = 'series-hint';
  hint.innerHTML = 'Showing everything by default. Tap a series to narrow: <b>1×</b> races + qualifying · <b>2×</b> add practice <span class="pip-inline">+P</span> · <b>3×</b> off';
  chips.insertAdjacentElement('beforebegin', hint);
}
// Per-dropdown master action: ONE button lives inside EACH filter section, scoped to
// just that section. Series body gets a Select-all-series / Clear-series button; the
// Where-to-watch body gets its own for platforms. Shared slot per button: 'Select all X'
// at rest, flips to 'Clear X' the instant any chip in that section is active. Injected
// right after each chip group (siblings of #seriesChips / #platChips), so buildChips()
// rebuilding the chip innerHTML never clobbers them. syncFilterAction() keeps both labels
// in lockstep with state (called from renderSchedule, so they self-correct).
function addFilterBtn(chipsId, setKey, btnId) {
  const chips = document.getElementById(chipsId);
  if (!chips || document.getElementById(btnId)) return;
  const btn = document.createElement('button');
  btn.id = btnId;
  btn.className = 'filter-action';
  btn.type = 'button';
  chips.insertAdjacentElement('afterend', btn);
  btn.addEventListener('click', () => {
    const set = setKey === 'series' ? state.series : state.plats;
    if (set.size) {
      set.clear();
      localStorage.removeItem(setKey === 'series' ? 'ontrack_series' : 'ontrack_plats');
    } else if (setKey === 'series') {
      // Select-all lands every series on 'races only'; pull in practice per series after.
      events.forEach(e => state.series.set(e.series, 'race'));
      saveSeriesState();
    } else {
      events.forEach(e => e.platforms.forEach(p => state.plats.add(p)));
      localStorage.setItem('ontrack_plats', JSON.stringify(Array.from(state.plats)));
    }
    buildChips();
    renderSchedule();
    renderHero();
  });
}
function buildFilterAction() {
  addFilterBtn('seriesChips', 'series', 'faSeries');
  addFilterBtn('platChips', 'plats', 'faPlats');
  syncFilterAction();
}
function syncFilterAction() {
  [['faSeries', state.series, 'series'], ['faPlats', state.plats, 'platforms']].forEach(function (row) {
    const btn = document.getElementById(row[0]);
    if (!btn) return;
    const set = row[1], label = row[2], on = set.size > 0;
    btn.classList.toggle('is-clear', on);
    btn.setAttribute('aria-pressed', on);
    btn.innerHTML = on
      ? '<span class="fa-lb">Clear ' + label + '</span><span class="fa-ct">' + set.size + '</span>'
      : '<span class="fa-lb">Select all ' + label + '</span>';
  });
}
// Settings popover: a gear in the masthead housing app chrome — the theme (light/dark)
// toggle and the timezone toggle, plus an honest note about how the app updates. Both
// control nodes are MOVED (not rebuilt) into the drawer, so the listeners wired in wire()
// survive intact. This gear + light-mode toggle is the standard chrome home going forward.
function buildSettings() {
  const tools = document.querySelector('.mast-tools');
  if (!tools || document.getElementById('settingsWrap')) return;
  const wrap = document.createElement('div');
  wrap.className = 'settings-wrap';
  wrap.id = 'settingsWrap';
  const btn = document.createElement('button');
  btn.id = 'settingsBtn';
  btn.className = 'settingsbtn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Settings');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>';
  const pop = document.createElement('div');
  pop.className = 'settings-pop';
  pop.id = 'settingsPop';
  pop.hidden = true;
  pop.innerHTML =
    '<div class="set-title">Settings</div>' +
    '<div class="set-row"><span class="set-lb">Theme</span><span id="themeSlot"></span></div>' +
    '<div class="set-row"><span class="set-lb">Time zone</span><span id="tzSlot"></span></div>' +
    '<p class="set-note">Countdowns and “on now” update live every second. Listings are refreshed weekly and verified per race weekend, so broadcast times can change last-minute.</p>';
  wrap.appendChild(btn);
  wrap.appendChild(pop);
  tools.appendChild(wrap);
  const theme = document.getElementById('themeBtn');
  const themeSlot = pop.querySelector('#themeSlot');
  if (theme && themeSlot) themeSlot.appendChild(theme);
  const tz = document.querySelector('.tz-toggle');
  const tzSlot = pop.querySelector('#tzSlot');
  if (tz && tzSlot) tzSlot.appendChild(tz);
  const close = () => { pop.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', ev => {
    ev.stopPropagation();
    const open = pop.hidden;
    pop.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
  });
  pop.addEventListener('click', ev => ev.stopPropagation());
  document.addEventListener('click', ev => { if (!wrap.contains(ev.target)) close(); });
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape') close(); });
}
// Footer cleanup: remove the source-download buttons (git hosting is the reliable source
// of truth now) and the prose note (its content moved into Settings). The compact build
// stamp (#verLine / #dataStamp) stays as the cache-check readout.
function cleanupFooter() {
  const src = document.querySelector('.foot-src');
  if (src) src.remove();
  const note = document.querySelector('.foot-note');
  if (note) note.remove();
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
    deb = setTimeout(() => { state.q = ev.target.value.trim().toLowerCase(); renderSchedule(); renderHero(); }, 120);
  });
  $('#clrSeries').addEventListener('click', () => {
    state.series.clear(); localStorage.removeItem('ontrack_series'); buildChips(); renderSchedule(); renderHero();
  });
  $('#clrPlat').addEventListener('click', () => {
    state.plats.clear(); localStorage.removeItem('ontrack_plats'); buildChips(); renderSchedule(); renderHero();
  });
}
function render() { renderHero(); renderSchedule(); }
function boot() {
  hydrate();
  applyTheme();
  buildChips();
  addSeriesHint();
  buildJump();
  sectionInit();
  buildFilterAction();
  render();
  wire();
  buildSettings();
  cleanupFooter();
  const vl = $('#verLine'); if (vl) vl.textContent = 'On Track ' + APP_VERSION;
  const ds = $('#dataStamp'); if (ds) ds.textContent = ' · listings ' + (DATA.version || APP_DATE);
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
          hydrate(); buildChips(); addSeriesHint(); buildJump(); buildFilterAction(); render();
          const ds = $('#dataStamp'); if (ds) ds.textContent = ' · listings ' + (DATA.version || APP_DATE);
        }
      })
      .catch(() => {});
  }
})();
