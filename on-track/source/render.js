// On Track — engine: constants, data model, date/format helpers, and all render/paint logic.
// Loaded before app.js. Classic script (shared global scope with app.js).
const APP_VERSION = 'v1.9';
const APP_DATE = '2026-07-05';
const APP_SLUG = 'on-track';
const SERIES = {
  'F1':          { label: 'Formula 1',      color: 'var(--s-f1)' },
  'F2':          { label: 'Formula 2',      color: 'var(--s-f2)' },
  'F3':          { label: 'Formula 3',      color: 'var(--s-f3)' },
  'NASCAR':      { label: 'NASCAR',         color: 'var(--s-nascar)' },
  'IndyCar':     { label: 'IndyCar',        color: 'var(--s-indycar)' },
  'MotoGP':      { label: 'MotoGP',         color: 'var(--s-motogp)' },
  'Moto2':       { label: 'Moto2',          color: 'var(--s-moto2)' },
  'Moto3':       { label: 'Moto3',          color: 'var(--s-moto3)' },
  'IMSA':        { label: 'IMSA',           color: 'var(--s-imsa)' },
  'WEC':         { label: 'WEC',            color: 'var(--s-wec)' },
  'NHRA':        { label: 'NHRA',           color: 'var(--s-nhra)' },
  'Formula E':   { label: 'Formula E',      color: 'var(--s-formulae)' },
  'WSBK':        { label: 'World Superbike',color: 'var(--s-wsbk)' },
  'MotoAmerica': { label: 'MotoAmerica',    color: 'var(--s-motoamerica)' },
  'MXGP':        { label: 'MXGP',           color: 'var(--s-mxgp)' },
  'BSB':         { label: 'British Superbike', color: 'var(--s-bsb)' },
  'Speedway':    { label: 'FIM Speedway',   color: 'var(--s-speedway)' },
  'FIM Speedway':{ label: 'FIM Speedway',   color: 'var(--s-speedway)' },
  'SMX':         { label: 'Supercross/SMX', color: 'var(--s-smx)' },
  'Supercars':   { label: 'Supercars',      color: 'var(--s-supercars)' }
};
const seriesColor = s => (SERIES[s] && SERIES[s].color) || 'var(--s-default)';
const FALLBACK_DATA = {
  version: '2026-07-04b',
  events: [
    { series:'F1',      kind:'Race', title:'British Grand Prix', detail:'Silverstone', start:'2026-07-05T10:00:00-04:00', end:'2026-07-05T12:00:00-04:00', platforms:['Apple TV'] },
    { series:'NASCAR',  kind:'Race', title:'eero 400', detail:'Chicagoland, Cup Series', start:'2026-07-05T18:00:00-04:00', end:'2026-07-05T21:00:00-04:00', platforms:['TNT Sports','HBO Max'] },
    { series:'MotoGP',  kind:'Race', title:'German Grand Prix', detail:'Sachsenring', start:'2026-07-12T08:00:00-04:00', end:'2026-07-12T09:30:00-04:00', platforms:['FS1'] }
  ]
};
let DATA = FALLBACK_DATA;
let events = [];
const state = {
  tz: localStorage.getItem('ontrack_tz') || 'ET',
  theme: localStorage.getItem('ontrack_theme') || 'rb',
  series: new Set(JSON.parse(localStorage.getItem('ontrack_series') || '[]')),
  plats: new Set(JSON.parse(localStorage.getItem('ontrack_plats') || '[]')),
  showPast: false,
  q: ''
};
const ET_TZ = 'America/New_York';
const localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
const $ = s => document.querySelector(s);
const activeTZ = () => state.tz === 'ET' ? ET_TZ : localTZ;
const tzAbbrev = () => {
  try {
    const p = new Intl.DateTimeFormat('en-US', { timeZone: activeTZ(), timeZoneName: 'short' }).formatToParts(new Date());
    return (p.find(x => x.type === 'timeZoneName') || {}).value || (state.tz === 'ET' ? 'ET' : '');
  } catch (e) { return state.tz === 'ET' ? 'ET' : ''; }
};
const fmtTime = d => new Intl.DateTimeFormat('en-US', { timeZone: activeTZ(), hour: 'numeric', minute: '2-digit' }).format(d);
const dayKey = d => new Intl.DateTimeFormat('en-CA', { timeZone: activeTZ(), year:'numeric', month:'2-digit', day:'2-digit' }).format(d);
const dayShort = d => new Intl.DateTimeFormat('en-US', { timeZone: activeTZ(), weekday:'short', month:'short', day:'numeric' }).format(d);
const labelFromKey = k => new Intl.DateTimeFormat('en-US', { timeZone:'UTC', weekday:'long', month:'short', day:'numeric' }).format(new Date(k + 'T12:00:00Z'));
const shortFromKey = k => new Intl.DateTimeFormat('en-US', { timeZone:'UTC', weekday:'short', month:'short', day:'numeric' }).format(new Date(k + 'T12:00:00Z'));
const addDays = (k, n) => { const [y,m,d]=k.split('-').map(Number); const dt=new Date(Date.UTC(y,m-1,d)); dt.setUTCDate(dt.getUTCDate()+n); return dt.toISOString().slice(0,10); };
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function hydrate() {
  events = (DATA.events || []).map((e, i) => {
    const s = new Date(e.start), en = new Date(e.end);
    return Object.assign({}, e, { _i: i, _s: s, _e: en });
  }).filter(e => !isNaN(e._s.getTime())).sort((a, b) => a._s - b._s);
}
function stateOf(e, now) {
  if (now >= e._s && now < e._e) return 'live';
  if (e._s > now) return 'upcoming';
  return 'past';
}
function renderHero() {
  const now = new Date();
  const live = events.filter(e => stateOf(e, now) === 'live');
  const hero = $('#hero');
  if (live.length) {
    hero.innerHTML =
      '<div class="hero-eyebrow"><span class="dot-live"></span> On the air now</div>' +
      '<div class="hero-live-list">' +
      live.map(e =>
        '<div class="live-card" style="--sc:' + seriesColor(e.series) + '">' +
          '<div class="sbar"></div>' +
          '<div class="body">' +
            '<div class="live-title">' + esc(e.title) + '</div>' +
            '<div class="live-meta">' + esc((SERIES[e.series]||{}).label||e.series) + ' · ' + esc(e.kind) + (e.detail ? ' · ' + esc(e.detail) : '') + '</div>' +
            '<div class="live-badges">' + e.platforms.map(p => '<span class="plat-badge">' + esc(p) + '</span>').join('') + '</div>' +
          '</div>' +
          '<span class="live-flag"><span class="dot-live" style="background:var(--live-ink)"></span>Live · ends ' + fmtTime(e._e) + '</span>' +
        '</div>').join('') +
      '</div>';
    return;
  }
  const next = events.find(e => e._s > now);
  if (next) {
    const diff = next._s - now;
    hero.innerHTML =
      '<div class="hero-eyebrow">Up next</div>' +
      '<div class="next-wrap">' +
        '<div class="count" id="count" style="color:' + seriesColor(next.series) + '">' + fmtDur(diff) + '</div>' +
        '<div class="next-info" style="--sc:' + seriesColor(next.series) + '">' +
          '<div class="evt-series" style="margin-bottom:4px">' + esc((SERIES[next.series]||{}).label||next.series) + ' · ' + esc(next.kind) + '</div>' +
          '<div class="live-title">' + esc(next.title) + '</div>' +
          '<div class="live-meta">' + (next.detail ? esc(next.detail) + ' · ' : '') + shortFromKey(dayKey(next._s)) + ' ' + fmtTime(next._s) + ' ' + tzAbbrev() + '</div>' +
          '<div class="live-badges">' + next.platforms.map(p => '<span class="plat-badge">' + esc(p) + '</span>').join('') + '</div>' +
        '</div>' +
      '</div>';
    return;
  }
  const last = events.slice().reverse().find(e => e._e <= now);
  hero.innerHTML =
    '<div class="hero-eyebrow">That\'s a wrap</div>' +
    '<div class="live-title">No sessions live right now.</div>' +
    '<div class="live-meta" style="margin-top:8px">' +
      (last ? 'Last on air: ' + esc(last.title) + ' · ' + esc((SERIES[last.series]||{}).label||last.series) : 'Check back when the next race weekend loads.') +
    '</div>';
}
function fmtDur(ms) {
  const t = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(t / 86400), h = Math.floor((t % 86400) / 3600), m = Math.floor((t % 3600) / 60), s = t % 60;
  if (d > 0) return d + '<span class="u">d</span> ' + h + '<span class="u">h</span> ' + m + '<span class="u">m</span>';
  if (h > 0) return h + '<span class="u">h</span> ' + String(m).padStart(2,'0') + '<span class="u">m</span> ' + String(s).padStart(2,'0') + '<span class="u">s</span>';
  return m + '<span class="u">m</span> ' + String(s).padStart(2,'0') + '<span class="u">s</span>';
}
function buildChips() {
  const seriesInData = Array.from(new Set(events.map(e => e.series)));
  $('#seriesChips').innerHTML = seriesInData.map(s =>
    '<button class="chip" data-series="' + esc(s) + '" aria-pressed="' + state.series.has(s) + '" style="--cc:' + seriesColor(s) + '">' +
      '<span class="swatch"></span>' + esc((SERIES[s]||{}).label||s) +
    '</button>').join('');
  const platsInData = Array.from(new Set(events.reduce((a, e) => a.concat(e.platforms), []))).sort();
  $('#platChips').innerHTML = platsInData.map(p =>
    '<button class="chip plat" data-plat="' + esc(p) + '" aria-pressed="' + state.plats.has(p) + '">' + esc(p) + '</button>').join('');
  $('#seriesChips').querySelectorAll('.chip').forEach(c =>
    c.addEventListener('click', () => toggleSet(state.series, c.dataset.series, 'ontrack_series', c)));
  $('#platChips').querySelectorAll('.chip').forEach(c =>
    c.addEventListener('click', () => toggleSet(state.plats, c.dataset.plat, 'ontrack_plats', c)));
  updateFilterCounts();
}
function buildJump() {
  const todayK = dayKey(new Date());
  const days = Array.from(new Set(events.map(e => dayKey(e._s)))).sort();
  const sel = $('#jumpDate');
  sel.innerHTML = '<option value="">Jump to date…</option>' + days.map(k => {
    const n = events.filter(e => dayKey(e._s) === k).length;
    const tag = k === todayK ? ' · Today' : (k < todayK ? ' · past' : '');
    return '<option value="' + k + '">' + esc(shortFromKey(k)) + tag + ' (' + n + ')</option>';
  }).join('');
}
function updateFilterCounts() {
  const cs = state.series.size, cp = state.plats.size;
  const bs = $('#countSeries'), bp = $('#countWatch');
  if (bs) { bs.textContent = cs; bs.classList.toggle('zero', cs === 0); }
  if (bp) { bp.textContent = cp; bp.classList.toggle('zero', cp === 0); }
}
function setSection(sec, open, persist) {
  sec.setAttribute('data-open', open);
  const head = sec.querySelector('.fhead');
  if (head) head.setAttribute('aria-expanded', open);
  const body = sec.querySelector('.fbody');
  if (body) body.setAttribute('aria-hidden', String(!open));
  if (persist) {
    const key = sec.id === 'secSeries' ? 'ontrack_sec_series' : 'ontrack_sec_watch';
    localStorage.setItem(key, open);
  }
}
function toggleSection(sec) {
  setSection(sec, sec.getAttribute('data-open') !== 'true', true);
}
function sectionInit() {
  const mobile = window.matchMedia('(max-width: 620px)').matches;
  [['secSeries','ontrack_sec_series'],['secWatch','ontrack_sec_watch']].forEach(([id, key]) => {
    const sec = document.getElementById(id);
    if (!sec) return;
    const saved = localStorage.getItem(key);
    const open = saved === null ? !mobile : saved === 'true';
    setSection(sec, open, false);
  });
}
function passesFilter(e) {
  if (state.series.size && !state.series.has(e.series)) return false;
  if (state.plats.size && !e.platforms.some(p => state.plats.has(p))) return false;
  if (state.q) {
    const hay = (e.title + ' ' + (e.detail||'') + ' ' + e.kind + ' ' + ((SERIES[e.series]||{}).label||e.series) + ' ' + e.series + ' ' + e.platforms.join(' ')).toLowerCase();
    if (!hay.includes(state.q)) return false;
  }
  return true;
}
function renderSchedule() {
  const now = new Date();
  const todayK = dayKey(now);
  const matched = events.filter(passesFilter);
  const anyFilter = state.series.size || state.plats.size || state.q;
  $('#clrSeries').hidden = !state.series.size;
  $('#clrPlat').hidden = !state.plats.size;
  if (typeof syncFilterAction === 'function') syncFilterAction();
  const visible = e => state.showPast || e._e > now;
  const dayMap = new Map();
  matched.forEach(e => { if (!visible(e)) return; const k = dayKey(e._s); if (!dayMap.has(k)) dayMap.set(k, []); dayMap.get(k).push(e); });
  const pastCount = matched.filter(e => e._e <= now).length;
  const pt = $('#pastToggle');
  if (pastCount) {
    pt.hidden = false;
    pt.setAttribute('aria-expanded', state.showPast);
    pt.innerHTML = state.showPast
      ? 'Hide earlier <span class="cnt">(' + pastCount + ')</span>'
      : '► Show earlier <span class="cnt">(' + pastCount + ')</span>';
  } else { pt.hidden = true; }
  const upcomingCount = matched.filter(e => e._e > now).length;
  $('#resultNote').textContent = anyFilter
    ? (state.showPast ? matched.length + ' of ' + events.length + ' sessions' : upcomingCount + ' of ' + events.length + ' upcoming')
    : upcomingCount + ' upcoming sessions';
  let keys;
  if (anyFilter) {
    keys = Array.from(dayMap.keys()).sort();
  } else {
    const allK = events.map(e => dayKey(e._s));
    if (!allK.length) { keys = []; }
    else {
      const minK = allK.reduce((a, b) => a < b ? a : b);
      const maxK = allK.reduce((a, b) => a > b ? a : b);
      const start = state.showPast ? minK : (todayK > minK ? todayK : minK);
      keys = [];
      if (start <= maxK) for (let k = start; k <= maxK; k = addDays(k, 1)) keys.push(k);
    }
  }
  const host = $('#schedule');
  if (!keys.length) {
    const noneUpcoming = !anyFilter && !upcomingCount && pastCount;
    host.innerHTML =
      '<div class="empty"><div class="big">🏁</div>' +
      (noneUpcoming
        ? '<h3>Nothing left on the schedule</h3><p>Every loaded session has run. Peek at what already aired.</p><button id="resetF">► Show earlier sessions</button>'
        : '<h3>Nothing matches those filters</h3><p>Try loosening the series or platform selection.</p><button id="resetF">Clear all filters</button>') +
      '</div>';
    $('#resetF').addEventListener('click', () => {
      if (noneUpcoming) { state.showPast = true; }
      else { state.series.clear(); state.plats.clear(); state.q = ''; $('#search').value = ''; localStorage.removeItem('ontrack_series'); localStorage.removeItem('ontrack_plats'); buildChips(); }
      renderSchedule();
    });
    return;
  }
  host.innerHTML = keys.map(k => {
    const evs = (dayMap.get(k) || []);
    const isToday = k === todayK;
    const isEarlier = k < todayK;
    const empty = evs.length === 0;
    const body = empty
      ? '<div class="evt-empty"><span class="em-flag">🏁</span>No events scheduled for this day.</div>'
      : evs.map(e => {
          const st = stateOf(e, now);
          return '<div class="evt ' + (st==='live'?'is-live':'') + ' ' + (st==='past'?'is-past':'') + '" style="--sc:' + seriesColor(e.series) + '">' +
            '<div class="evt-time">' + fmtTime(e._s) + '<span class="end">' + fmtTime(e._e) + '</span></div>' +
            '<div class="evt-bar"></div>' +
            '<div class="evt-main">' +
              '<span class="evt-series">' + esc((SERIES[e.series]||{}).label||e.series) + '</span> ' +
              '<span class="evt-kind">' + esc(e.kind) + '</span> ' +
              (st==='live' ? '<span class="livepill"><span class="dot-live" style="background:var(--live-ink);width:6px;height:6px"></span>Live</span>' : '') +
              '<div class="evt-title">' + esc(e.title) + (e.detail ? ' <span class="det">· ' + esc(e.detail) + '</span>' : '') + '</div>' +
            '</div>' +
            '<div class="evt-plats">' + e.platforms.map(p => '<span class="plat-badge">' + esc(p) + '</span>').join('') + '</div>' +
          '</div>';
        }).join('');
    return '<section class="day-group' + (isEarlier ? ' past-group' : '') + (empty ? ' empty-day' : '') + '" id="day-' + k + '">' +
      '<div class="day-head">' +
        '<h2>' + esc(labelFromKey(k)) + '</h2>' +
        (isToday ? '<span class="today">Today</span>' : (isEarlier ? '<span class="earlier">Earlier</span>' : '')) +
        (empty ? '' : '<span class="cnt">' + evs.length + ' session' + (evs.length>1?'s':'') + '</span>') +
      '</div>' + body +
    '</section>';
  }).join('');
}
function jumpTo(k) {
  if (!k) return;
  const todayK = dayKey(new Date());
  if (k < todayK && !state.showPast) { state.showPast = true; renderSchedule(); }
  requestAnimationFrame(() => {
    const el = document.getElementById('day-' + k);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}
function tick() {
  const now = new Date();
  $('#clockTime').textContent = fmtTime(now);
  $('#clockZone').textContent = tzAbbrev();
  const c = $('#count');
  if (c) {
    const next = events.find(e => e._s > now);
    const live = events.some(e => stateOf(e, now) === 'live');
    if (!next || live || now >= next._s) { renderHero(); renderSchedule(); }
    else c.innerHTML = fmtDur(next._s - now);
  } else {
    renderHero();
  }
}
function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  $('#themeBtn').textContent = state.theme === 'rb' ? '◑' : '◐';
  const meta = document.querySelector('meta[name=theme-color]');
  if (meta) meta.setAttribute('content', state.theme === 'rb' ? '#141d3b' : '#f2f3f7');
}
