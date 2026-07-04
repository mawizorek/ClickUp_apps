/* Weather + footer/export surface synced to the shipped v5 app. */

async function loadWeather(t) {
  const body = document.getElementById("wx-body");
  const stamp = document.getElementById("wx-stamp");
  if (!body) return;

  const WMO = {
    0: ["Clear sky", "sun"],
    1: ["Mainly clear", "sun"],
    2: ["Partly cloudy", "cloud-sun"],
    3: ["Overcast", "cloud"],
    45: ["Fog", "cloud-fog"],
    48: ["Rime fog", "cloud-fog"],
    51: ["Light drizzle", "cloud-drizzle"],
    53: ["Drizzle", "cloud-drizzle"],
    55: ["Heavy drizzle", "cloud-drizzle"],
    61: ["Light rain", "cloud-rain"],
    63: ["Rain", "cloud-rain"],
    65: ["Heavy rain", "cloud-rain-wind"],
    71: ["Light snow", "cloud-snow"],
    73: ["Snow", "cloud-snow"],
    75: ["Heavy snow", "cloud-snow"],
    80: ["Light showers", "cloud-rain"],
    81: ["Showers", "cloud-rain"],
    82: ["Heavy showers", "cloud-rain-wind"],
    95: ["Thunderstorm", "cloud-lightning"],
    96: ["Storm + hail", "cloud-lightning"],
    99: ["Severe storm", "cloud-lightning"]
  };

  const COMPASS = [
    "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
  ];
  const dir = d => COMPASS[Math.round(d / 22.5) % 16];

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${t.lat}&longitude=${t.lng}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant&timezone=${encodeURIComponent(t.tz)}&forecast_days=16`;

  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(r.status);
    const j = await r.json();
    const d = j.daily;
    const idx = {};
    d.time.forEach((tm, i) => {
      idx[tm] = i;
    });

    let html = '<div class="wx-grid">';
    t.sessions.forEach(s => {
      const i = idx[s.date];
      const dl = `${s.date.slice(8, 10)}/${s.date.slice(5, 7)}`;
      if (i === undefined) {
        html += `
          <div class="wx-day">
            <div class="d">${dl}</div>
            <div class="sess">${s.sess}</div>
            <div class="desc" style="margin-top:14px">Outside the 16-day forecast window. Check back closer to the weekend.</div>
          </div>
        `;
        return;
      }
      const code = d.weather_code[i];
      const [desc, icon] = WMO[code] || ["—", "cloud"];
      const hi = Math.round(d.temperature_2m_max[i]);
      const lo = Math.round(d.temperature_2m_min[i]);
      const pop = d.precipitation_probability_max[i];
      const ws = Math.round(d.wind_speed_10m_max[i]);
      const wd = d.wind_direction_10m_dominant[i];
      html += `
        <div class="wx-day">
          <div class="d">${dl}</div>
          <div class="sess">${s.sess}</div>
          <div class="cond"><i data-lucide="${icon}"></i><div class="temp">${hi}°<small> / ${lo}°C</small></div></div>
          <div class="desc">${desc}</div>
          <div class="wx-row"><span><i data-lucide="droplets"></i>${pop == null ? "–" : pop + "%"} rain</span><span><i data-lucide="wind"></i>${ws} km/h <span style="display:inline-block;transform:rotate(${(wd + 180) % 360}deg)">↑</span> ${dir(wd)}</span></div>
        </div>
      `;
    });
    html += '</div>';
    body.innerHTML = html;
    stamp.textContent = 'Live · updated ' + new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    if (window.lucide) lucide.createIcons();
  } catch (e) {
    body.innerHTML = '<div class="wx-error">Couldn’t load live conditions right now. The forecast refreshes automatically next time this opens.</div>';
    stamp.textContent = 'Live feed unavailable';
  }
}

function currentDataExport() {
  return {
    version: appDataMeta.version || APP_DATE,
    season: appDataMeta.season || Number(SEASON),
    tracks: TRACKS,
    raceResults,
    historicWinners
  };
}

function flash(btn, txt) {
  const original = btn.innerHTML;
  btn.classList.add("ok");
  btn.innerHTML = `<i data-lucide="check"></i>${txt}`;
  if (window.lucide) lucide.createIcons();
  setTimeout(() => {
    btn.classList.remove("ok");
    btn.innerHTML = original;
    if (window.lucide) lucide.createIcons();
  }, 1600);
}

function buildSource() {
  const clone = document.documentElement.cloneNode(true);
  const slot = clone.querySelector("#save-slot");
  if (slot) slot.innerHTML = "";
  return "<!DOCTYPE html>\n" + clone.outerHTML;
}

let _srcURL = null;
function freshSourceURL(mime) {
  if (_srcURL) {
    URL.revokeObjectURL(_srcURL);
    _srcURL = null;
  }
  const blob = new Blob([buildSource()], { type: mime });
  _srcURL = URL.createObjectURL(blob);
  setTimeout(() => {
    if (_srcURL) {
      URL.revokeObjectURL(_srcURL);
      _srcURL = null;
    }
  }, 90000);
  return _srcURL;
}

const copyBtn = document.getElementById("t-copy");
if (copyBtn) {
  copyBtn.addEventListener("click", async e => {
    const src = buildSource();
    try {
      await navigator.clipboard.writeText(src);
      flash(e.currentTarget, "Source copied");
    } catch (_) {
      const ta = document.createElement("textarea");
      ta.value = src;
      ta.style.position = "fixed";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (__){ }
      ta.remove();
      flash(e.currentTarget, ok ? "Source copied" : "Copy failed");
    }
  });
}

const prepBtn = document.getElementById("t-prep");
if (prepBtn) {
  prepBtn.addEventListener("click", e => {
    const slot = document.getElementById("save-slot");
    if (!slot) return;
    slot.innerHTML = "";
    const a = document.createElement("a");
    a.href = freshSourceURL("text/html");
    a.download = "f1-racetracks-app.html";
    a.className = "save-link";
    a.textContent = "⤓ Save f1-racetracks-app.html";
    slot.appendChild(a);
    flash(e.currentTarget, "Ready → click Save");
  });
}

const tabBtn = document.getElementById("t-tab");
if (tabBtn) {
  tabBtn.addEventListener("click", e => {
    const w = window.open(freshSourceURL("text/plain"), "_blank");
    flash(e.currentTarget, w ? "Opened" : "Popup blocked");
  });
}

const dataBtn = document.getElementById("t-data");
if (dataBtn) {
  dataBtn.addEventListener("click", e => {
    const slot = document.getElementById("save-slot");
    if (!slot) return;
    slot.innerHTML = "";
    const a = document.createElement("a");
    const data = JSON.stringify(currentDataExport(), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = "f1-racetracks-data.json";
    a.className = "save-link";
    a.textContent = "⤓ Save f1-racetracks-data.json";
    slot.appendChild(a);
    flash(e.currentTarget, "Ready → click Save");
    setTimeout(() => URL.revokeObjectURL(url), 90000);
  });
}

const LIVE_REFRESH_MS = 20000;

const WEEKEND_LIVE_CIRCUIT_ALIASES = {
  'albert-park': ['albert park', 'melbourne'],
  shanghai: ['shanghai'],
  suzuka: ['suzuka'],
  miami: ['miami'],
  'gilles-villeneuve': ['gilles villeneuve', 'montreal', 'canada'],
  monaco: ['monaco'],
  catalunya: ['barcelona', 'catalunya', 'circuit de barcelona-catalunya', 'spanish gp'],
  'red-bull-ring': ['red bull ring', 'spielberg', 'austrian gp'],
  silverstone: ['silverstone', 'british gp'],
  spa: ['spa', 'spa-francorchamps', 'circuit de spa-francorchamps', 'belgian gp'],
  hungaroring: ['hungaroring', 'hungary', 'hungarian gp'],
  zandvoort: ['zandvoort', 'dutch gp'],
  monza: ['monza', 'italian gp'],
  madring: ['madring', 'madrid'],
  baku: ['baku', 'azerbaijan'],
  'marina-bay': ['marina bay', 'singapore'],
  cota: ['cota', 'circuit of the americas', 'united states'],
  mexico: ['mexico city', 'hermanos rodriguez', 'méxico'],
  interlagos: ['interlagos', 'sao paulo', 'são paulo'],
  'las-vegas': ['las vegas'],
  losail: ['losail', 'qatar'],
  'yas-marina': ['yas marina', 'abu dhabi']
};

const SCHEDULE_SEEDS = {
  silverstone: [
    { day: 'Fri', date: '2026-07-03', items: [
      { series: 'F1', label: 'Practice 1', start: '2026-07-03T12:30:00+01:00', end: '2026-07-03T13:30:00+01:00' },
      { series: 'F1', label: 'Sprint Qualifying', start: '2026-07-03T16:30:00+01:00', end: '2026-07-03T17:14:00+01:00' }
    ]},
    { day: 'Sat', date: '2026-07-04', items: [
      { series: 'F1', label: 'Sprint', start: '2026-07-04T12:00:00+01:00', end: '2026-07-04T13:00:00+01:00' },
      { series: 'F1', label: 'Qualifying', start: '2026-07-04T16:00:00+01:00', end: '2026-07-04T17:00:00+01:00' }
    ]},
    { day: 'Sun', date: '2026-07-05', items: [
      { series: 'F1', label: 'Grand Prix', start: '2026-07-05T15:00:00+01:00', end: '2026-07-05T17:00:00+01:00' }
    ]}
  ]
};

const WEEKEND_REPLAY_DATA = {
  "albert-park": {
    sessionLabel: "Grand Prix replay",
    sessionDate: "Sun Mar 8",
    beats: [
      { clock: "Lights out", lap: "Lap 1 / 58", phase: "Race start", order: ["RUS", "PIA", "HAM", "NOR", "VER"], feed: ["Russell converts pole cleanly", "Piastri hangs onto P2 through Turn 3"] },
      { clock: "00:18:40", lap: "Lap 14 / 58", phase: "Opening stint", order: ["RUS", "NOR", "HAM", "VER", "LEC"], feed: ["Verstappen clears Hamilton on DRS run to Turn 11", "Medium tyres stabilise after early graining"] },
      { clock: "00:41:10", lap: "Lap 30 / 58", phase: "Pit cycle", order: ["RUS", "VER", "NOR", "LEC", "ANT"], feed: ["Undercut window opens for the leaders", "Antonelli gains clean air in the second phase"] },
      { clock: "01:05:35", lap: "Lap 43 / 58", phase: "Fastest lap phase", order: ["RUS", "ANT", "LEC", "VER", "NOR"], feed: ["Verstappen sets fastest lap", "Antonelli locks in the Mercedes 1–2 picture"] },
      { clock: "01:27:12", lap: "Chequered flag", phase: "Finish", order: ["RUS", "ANT", "LEC", "VER", "NOR"], feed: ["Mercedes opens 2026 with a 1–2", "Russell wins the season opener"] }
    ]
  }
};

const weekendEnhancementState = {};

function ensureWeekendState(slug) {
  if (!weekendEnhancementState[slug]) {
    weekendEnhancementState[slug] = { mode: null, beat: 0, speed: 1, timer: null };
  }
  return weekendEnhancementState[slug];
}

function clearWeekendTimer(slug) {
  const state = ensureWeekendState(slug);
  if (state.timer) {
    window.clearInterval(state.timer);
    state.timer = null;
  }
}

function trackSlugFromHash() {
  return (location.hash.replace(/^#\/?/, "") || "").trim();
}

function weekendNormalize(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function classifyWeekendSessionState(session) {
  const now = Date.now();
  const start = session?.date_start ? new Date(session.date_start).getTime() : null;
  const end = session?.date_end ? new Date(session.date_end).getTime() : null;
  if (!session || !start) return 'idle';
  if (start > now) return 'awaiting';
  if (!end || end >= now) return 'live';
  return (now - end) / 36e5 <= 48 ? 'replay' : 'idle';
}

function matchWeekendCircuitSlug(session) {
  const haystack = [session?.circuit_short_name, session?.meeting_name, session?.country_name]
    .map(weekendNormalize)
    .join(' ');
  for (const [slug, aliases] of Object.entries(WEEKEND_LIVE_CIRCUIT_ALIASES)) {
    if (aliases.some(alias => haystack.includes(weekendNormalize(alias)))) return slug;
  }
  return null;
}

async function fetchWeekendJson(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

function latestWeekendByDriver(rows) {
  const map = new Map();
  for (const row of rows || []) {
    const key = row.driver_number;
    if (!map.has(key) || String(row.date || '') > String(map.get(key).date || '')) map.set(key, row);
  }
  return map;
}

function formatWeekendInterval(intervalRow, position) {
  if (position === 1) return 'Leader';
  if (!intervalRow) return '—';
  if (typeof intervalRow.interval === 'string') return intervalRow.interval;
  if (typeof intervalRow.interval === 'number') return `+${intervalRow.interval.toFixed(3)}`;
  if (typeof intervalRow.gap_to_leader === 'number') return `+${intervalRow.gap_to_leader.toFixed(3)}`;
  return intervalRow.gap_to_leader || '—';
}

function liveFormatLocal(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date);
}

function liveChipClass(category = '') {
  const value = String(category).toLowerCase();
  if (value.includes('flag')) return 'flag';
  if (value.includes('safety')) return 'safety';
  if (value.includes('session')) return 'session';
  return 'other';
}

function formatSeedTime(dateString) {
  return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date(dateString));
}

function formatSessionStatus(start, end) {
  const now = Date.now();
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  if (now >= endMs) return 'done';
  if (now >= startMs && now < endMs) return 'live';
  return 'upcoming';
}

function buildFallbackSchedule(track) {
  return (track.sessions || []).map(entry => {
    const [dayLabelRaw, bodyRaw] = String(entry.sess || '').split('·');
    const dayLabel = (dayLabelRaw || 'Weekend').trim();
    const body = (bodyRaw || 'Session').trim();
    const pieces = body.split('+').map(item => item.trim()).filter(Boolean);
    return {
      day: dayLabel,
      date: entry.date,
      items: pieces.map(label => ({
        series: 'F1',
        label,
        time: 'Time pending',
        status: inferScheduleStatus(track, entry.date)
      }))
    };
  });
}

function inferScheduleStatus(track, dateString) {
  const today = new Date().toISOString().slice(0, 10);
  if (track.status === 'done') return 'done';
  if (track.status === 'active') {
    if (dateString === today) return 'live';
    return dateString < today ? 'done' : 'upcoming';
  }
  return dateString < today ? 'done' : 'upcoming';
}

function scheduleDataFor(track) {
  if (SCHEDULE_SEEDS[track.slug]) {
    return SCHEDULE_SEEDS[track.slug].map(group => ({
      day: group.day,
      date: group.date,
      items: group.items.map(item => ({
        series: item.series,
        label: item.label,
        time: formatSeedTime(item.start),
        range: `${formatSeedTime(item.start)}–${formatSeedTime(item.end)}`,
        status: formatSessionStatus(item.start, item.end),
        start: item.start,
        end: item.end
      }))
    }));
  }

  return buildFallbackSchedule(track);
}

function scheduleRowMarkup(item) {
  return `
    <div class="wc-session-row">
      <div class="wc-session-left">
        <span class="wc-series wc-series-${String(item.series || 'generic').toLowerCase()}">${esc(item.series || 'F1')}</span>
        <span class="wc-session-name">${esc(item.label)}</span>
      </div>
      <div class="wc-session-right">
        <span class="wc-session-time">${esc(item.range || item.time || 'Time pending')}</span>
        <span class="wc-status wc-status-${item.status}">${esc(item.status)}</span>
      </div>
    </div>
  `;
}

function currentRoundTrack() {
  return TRACKS.find(track => track.status === 'active') || reportTracks[0] || null;
}

function renderHomeCurrentRaceCard(track) {
  return `
    <section class="current-round-card" id="current-round-card">
      <div class="crc-head">
        <div>
          <div class="tag">Current round</div>
          <h2>${esc(track.gp)}</h2>
        </div>
        <div class="crc-badge crc-badge-${track.status}">${esc(track.status)}</div>
      </div>
      <div class="crc-grid">
        <div class="wc-panel"><div class="crc-label">Circuit</div><div class="crc-value">${esc(track.title)}</div></div>
        <div class="wc-panel"><div class="crc-label">Date</div><div class="crc-value">${esc(track.date)} ${SEASON}</div></div>
      </div>
      <div class="crc-actions"><a class="crc-primary" href="#/${track.slug}">Open ${esc(track.gp)} weekend →</a></div>
    </section>
  `;
}

function renderScheduleMode(track) {
  const groups = scheduleDataFor(track);
  return `
    <div class="wc-body-grid">
      <div class="wc-main">
        ${groups.map(group => `
          <section class="wc-panel">
            <div class="wc-day-head"><strong>${esc(group.day)}</strong><span>${esc(group.date)}</span></div>
            <div class="wc-day-list">${group.items.map(scheduleRowMarkup).join('')}</div>
          </section>
        `).join('')}
      </div>
    </div>
  `;
}

function renderWeekendCenter(track) {
  return `
    <section class="card weekend-center" id="weekend-center" data-slug="${track.slug}">
      <div class="wc-head">
        <div>
          <div class="tag">Weekend Center</div>
          <h2>${esc(track.gp)} weekend</h2>
        </div>
        <div class="wc-toggle"><button class="wc-tab is-active">Schedule</button></div>
      </div>
      <div class="wc-body">${renderScheduleMode(track)}</div>
    </section>
  `;
}

function mountWeekendCenter(slug) {
  const track = bySlug[slug];
  if (!track || !track.report) return;
  const view = app.querySelector('.view');
  const meta = view && view.querySelector('.meta');
  if (!view || !meta) return;
  const existing = document.getElementById('weekend-center');
  if (existing) existing.remove();
  meta.insertAdjacentHTML('afterend', renderWeekendCenter(track));
}

function mountHomeCurrentRaceCard() {
  const track = currentRoundTrack();
  const view = app.querySelector('.view');
  const hero = view && view.querySelector('.home-h');
  if (!track || !view || !hero) return;
  const existing = document.getElementById('current-round-card');
  if (existing) existing.remove();
  hero.insertAdjacentHTML('afterend', renderHomeCurrentRaceCard(track));
}

function syncWeekendSurfaces() {
  const slug = trackSlugFromHash();
  if (slug && bySlug[slug]) mountWeekendCenter(slug);
  else mountHomeCurrentRaceCard();
}
