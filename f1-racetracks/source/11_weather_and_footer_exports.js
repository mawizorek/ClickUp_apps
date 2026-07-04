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

document.getElementById("t-copy").addEventListener("click", async e => {
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

document.getElementById("t-prep").addEventListener("click", e => {
  const slot = document.getElementById("save-slot");
  slot.innerHTML = "";
  const a = document.createElement("a");
  a.href = freshSourceURL("text/html");
  a.download = "f1-racetracks-app.html";
  a.className = "save-link";
  a.textContent = "⤓ Save f1-racetracks-app.html";
  slot.appendChild(a);
  flash(e.currentTarget, "Ready → click Save");
});

document.getElementById("t-tab").addEventListener("click", e => {
  const w = window.open(freshSourceURL("text/plain"), "_blank");
  flash(e.currentTarget, w ? "Opened" : "Popup blocked");
});

document.getElementById("t-data").addEventListener("click", e => {
  const slot = document.getElementById("save-slot");
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
    {
      day: 'Fri',
      date: '2026-07-03',
      items: [
        { series: 'F1', label: 'Practice 1', start: '2026-07-03T12:30:00+01:00', end: '2026-07-03T13:30:00+01:00' },
        { series: 'F1', label: 'Sprint Qualifying', start: '2026-07-03T16:30:00+01:00', end: '2026-07-03T17:14:00+01:00' }
      ]
    },
    {
      day: 'Sat',
      date: '2026-07-04',
      items: [
        { series: 'F1', label: 'Sprint', start: '2026-07-04T12:00:00+01:00', end: '2026-07-04T13:00:00+01:00' },
        { series: 'F1', label: 'Qualifying', start: '2026-07-04T16:00:00+01:00', end: '2026-07-04T17:00:00+01:00' }
      ]
    },
    {
      day: 'Sun',
      date: '2026-07-05',
      items: [
        { series: 'F1', label: 'Grand Prix', start: '2026-07-05T15:00:00+01:00', end: '2026-07-05T17:00:00+01:00' }
      ]
    }
  ],
  spa: [
    {
      day: 'Fri',
      date: '2026-07-17',
      items: [
        { series: 'F1', label: 'Practice 1', start: '2026-07-17T13:30:00+02:00', end: '2026-07-17T14:30:00+02:00' },
        { series: 'F1', label: 'Practice 2', start: '2026-07-17T17:00:00+02:00', end: '2026-07-17T18:00:00+02:00' }
      ]
    },
    {
      day: 'Sat',
      date: '2026-07-18',
      items: [
        { series: 'F1', label: 'Practice 3', start: '2026-07-18T12:30:00+02:00', end: '2026-07-18T13:30:00+02:00' },
        { series: 'F1', label: 'Qualifying', start: '2026-07-18T16:00:00+02:00', end: '2026-07-18T17:00:00+02:00' }
      ]
    },
    {
      day: 'Sun',
      date: '2026-07-19',
      items: [
        { series: 'F1', label: 'Grand Prix', start: '2026-07-19T15:00:00+02:00', end: '2026-07-19T17:00:00+02:00' }
      ]
    }
  ],
  hungaroring: [
    {
      day: 'Fri',
      date: '2026-07-24',
      items: [
        { series: 'F1', label: 'Practice 1', start: '2026-07-24T13:30:00+02:00', end: '2026-07-24T14:30:00+02:00' },
        { series: 'F1', label: 'Practice 2', start: '2026-07-24T17:00:00+02:00', end: '2026-07-24T18:00:00+02:00' }
      ]
    },
    {
      day: 'Sat',
      date: '2026-07-25',
      items: [
        { series: 'F1', label: 'Practice 3', start: '2026-07-25T12:30:00+02:00', end: '2026-07-25T13:30:00+02:00' },
        { series: 'F1', label: 'Qualifying', start: '2026-07-25T16:00:00+02:00', end: '2026-07-25T17:00:00+02:00' }
      ]
    },
    {
      day: 'Sun',
      date: '2026-07-26',
      items: [
        { series: 'F1', label: 'Grand Prix', start: '2026-07-26T15:00:00+02:00', end: '2026-07-26T17:00:00+02:00' }
      ]
    }
  ],
  zandvoort: [
    {
      day: 'Fri',
      date: '2026-08-21',
      items: [
        { series: 'F1', label: 'Practice 1', start: '2026-08-21T10:30:00+02:00', end: '2026-08-21T11:30:00+02:00' },
        { series: 'F1', label: 'Sprint Qualifying', start: '2026-08-21T14:30:00+02:00', end: '2026-08-21T15:14:00+02:00' }
      ]
    },
    {
      day: 'Sat',
      date: '2026-08-22',
      items: [
        { series: 'F1', label: 'Sprint', start: '2026-08-22T10:00:00+02:00', end: '2026-08-22T11:00:00+02:00' },
        { series: 'F1', label: 'Qualifying', start: '2026-08-22T14:00:00+02:00', end: '2026-08-22T15:00:00+02:00' }
      ]
    },
    {
      day: 'Sun',
      date: '2026-08-23',
      items: [
        { series: 'F1', label: 'Grand Prix', start: '2026-08-23T13:00:00+02:00', end: '2026-08-23T15:00:00+02:00' }
      ]
    }
  ],
  monza: [
    {
      day: 'Fri',
      date: '2026-09-04',
      items: [
        { series: 'F1', label: 'Practice 1', start: '2026-09-04T10:30:00+02:00', end: '2026-09-04T11:30:00+02:00' },
        { series: 'F1', label: 'Practice 2', start: '2026-09-04T14:00:00+02:00', end: '2026-09-04T15:00:00+02:00' }
      ]
    },
    {
      day: 'Sat',
      date: '2026-09-05',
      items: [
        { series: 'F1', label: 'Practice 3', start: '2026-09-05T10:30:00+02:00', end: '2026-09-05T11:30:00+02:00' },
        { series: 'F1', label: 'Qualifying', start: '2026-09-05T14:00:00+02:00', end: '2026-09-05T15:00:00+02:00' }
      ]
    },
    {
      day: 'Sun',
      date: '2026-09-06',
      items: [
        { series: 'F1', label: 'Grand Prix', start: '2026-09-06T13:00:00+02:00', end: '2026-09-06T15:00:00+02:00' }
      ]
    }
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
  },
  shanghai: {
    sessionLabel: "Grand Prix replay",
    sessionDate: "Sun Mar 15",
    beats: [
      { clock: "Lights out", lap: "Lap 1 / 56", phase: "Race start", order: ["ANT", "RUS", "HAM", "LEC", "PIA"], feed: ["Antonelli launches cleanly from pole", "Hamilton holds the inside into the spiral"] },
      { clock: "00:20:05", lap: "Lap 12 / 56", phase: "Tyre management", order: ["ANT", "RUS", "HAM", "PIA", "LEC"], feed: ["Mercedes manages front graining better than the field", "Piastri briefly pressures Hamilton into Turn 14"] },
      { clock: "00:46:18", lap: "Lap 28 / 56", phase: "Pit cycle", order: ["RUS", "ANT", "HAM", "LEC", "PIA"], feed: ["Russell cycles ahead briefly on the alternative stop phase", "Antonelli reclaims the net lead on fresher tyres"] },
      { clock: "01:14:40", lap: "Lap 46 / 56", phase: "Closing stint", order: ["ANT", "RUS", "HAM", "LEC", "PIA"], feed: ["Mercedes settles into a controlled 1–2", "Hamilton protects P3 from Leclerc"] },
      { clock: "01:29:04", lap: "Chequered flag", phase: "Finish", order: ["ANT", "RUS", "HAM", "LEC", "PIA"], feed: ["Antonelli wins in Shanghai", "Mercedes completes another 1–2"] }
    ]
  },
  suzuka: {
    sessionLabel: "Grand Prix replay",
    sessionDate: "Sun Mar 29",
    beats: [
      { clock: "Lights out", lap: "Lap 1 / 53", phase: "Race start", order: ["ANT", "RUS", "PIA", "LEC", "NOR"], feed: ["Antonelli controls the launch from pole", "Suzuka stays orderly through the Esses"] },
      { clock: "00:23:25", lap: "Lap 14 / 53", phase: "Rhythm phase", order: ["ANT", "PIA", "RUS", "LEC", "NOR"], feed: ["Piastri clears Russell in the pit phase", "Dirty air keeps overtakes scarce on track"] },
      { clock: "00:51:06", lap: "Lap 30 / 53", phase: "Medium to hard transition", order: ["ANT", "PIA", "LEC", "RUS", "NOR"], feed: ["Antonelli maintains control through the undercut window", "Leclerc jumps into podium contention"] },
      { clock: "01:14:11", lap: "Lap 44 / 53", phase: "Final stint", order: ["ANT", "PIA", "LEC", "RUS", "NOR"], feed: ["Antonelli manages the closing laps cleanly", "Piastri keeps pressure but never gets a true attack"] },
      { clock: "01:28:58", lap: "Chequered flag", phase: "Finish", order: ["ANT", "PIA", "LEC", "RUS", "NOR"], feed: ["Antonelli takes his first F1 win", "Suzuka rewards clean air and precision"] }
    ]
  },
  miami: {
    sessionLabel: "Grand Prix replay",
    sessionDate: "Sun May 3",
    beats: [
      { clock: "Lights out", lap: "Lap 1 / 57", phase: "Race start", order: ["ANT", "VER", "LEC", "NOR", "PIA"], feed: ["Antonelli leads into Turn 1", "Verstappen keeps DRS pressure on the opening run"] },
      { clock: "00:19:55", lap: "Lap 12 / 57", phase: "Opening DRS trains", order: ["ANT", "NOR", "PIA", "VER", "LEC"], feed: ["McLarens move into the chase pack", "Miami’s triple-straight layout starts to stretch strategy choices"] },
      { clock: "00:43:12", lap: "Lap 28 / 57", phase: "Pit cycle", order: ["NOR", "ANT", "PIA", "LEC", "VER"], feed: ["Norris leads briefly during the cycle", "Antonelli regains effective control on the next phase"] },
      { clock: "01:05:08", lap: "Lap 41 / 57", phase: "Safety Car ending", order: ["ANT", "NOR", "PIA", "LEC", "VER"], feed: ["Safety Car window compresses the field", "Antonelli wins the restart rhythm into Turn 1"] },
      { clock: "01:28:41", lap: "Chequered flag", phase: "Finish", order: ["ANT", "NOR", "PIA", "LEC", "VER"], feed: ["Antonelli wins in Miami", "McLaren double-podium pressure shapes the final stint"] }
    ]
  },
  "gilles-villeneuve": {
    sessionLabel: "Grand Prix replay",
    sessionDate: "Sun May 24",
    beats: [
      { clock: "Lights out", lap: "Lap 1 / 70", phase: "Race start", order: ["RUS", "ANT", "HAM", "VER", "LEC"], feed: ["Russell launches from pole", "Antonelli stays tight into Virage Senna"] },
      { clock: "00:24:18", lap: "Lap 16 / 70", phase: "Slipstream phase", order: ["RUS", "ANT", "HAM", "VER", "LEC"], feed: ["Leaders stay nose-to-tail through the DRS zones", "Hamilton protects the final podium place"] },
      { clock: "00:48:42", lap: "Lap 32 / 70", phase: "Pit cycle", order: ["ANT", "RUS", "HAM", "VER", "LEC"], feed: ["Antonelli flips the order through the stop phase", "Montreal strategy swings on clean-air timing"] },
      { clock: "01:13:30", lap: "Lap 50 / 70", phase: "Closing sprint", order: ["ANT", "HAM", "VER", "RUS", "LEC"], feed: ["Hamilton surges into P2", "Verstappen locks onto the podium train"] },
      { clock: "01:33:44", lap: "Chequered flag", phase: "Finish", order: ["ANT", "HAM", "VER", "RUS", "LEC"], feed: ["Antonelli wins in Montreal", "Hamilton and Verstappen round out the podium"] }
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

  if (Array.isArray(track.schedule) && track.schedule.length) {
    const grouped = {};
    track.schedule.forEach(item => {
      const dateKey = item.datetime ? item.datetime.slice(0, 10) : 'unknown';
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          day: new Date(item.datetime).toLocaleDateString('en-US', { weekday: 'short' }),
          date: dateKey,
          items: []
        };
      }
      grouped[dateKey].items.push({
        series: item.series,
        label: item.session,
        time: new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date(item.datetime)),
        range: new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date(item.datetime)),
        status: item.status || 'upcoming',
        start: item.datetime,
        end: item.datetime
      });
    });
    return Object.values(grouped);
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

function replayDataFor(track) {
  return WEEKEND_REPLAY_DATA[track.slug] || null;
}

function currentRoundTrack() {
  return bySlug[appDataMeta.current_round_slug]
    || TRACKS.find(track => track.status === 'active')
    || bySlug[appDataMeta.last_completed_round_slug]
    || reportTracks.find(track => track.status !== 'done')
    || reportTracks[0]
    || null;
}

function currentRoundSummary(track) {
  const groups = scheduleDataFor(track);
  const flat = groups.flatMap(group => group.items);
  const liveNow = flat.find(item => item.status === 'live') || null;
  const nextUp = flat.find(item => item.status === 'upcoming') || null;
  if (liveNow) return { label: 'Live now', value: `${liveNow.label} · ${liveNow.time}` };
  if (nextUp) return { label: 'Next up', value: `${nextUp.label} · ${nextUp.time}` };
  if (track.status === 'done') return { label: 'Replay', value: 'Race weekend complete' };
  return { label: 'Status', value: 'Weekend info loading' };
}

function renderHomeCurrentRaceCard(track) {
  const summary = currentRoundSummary(track);
  const statusLabel = track.status === 'active' ? 'Current round' : track.status === 'done' ? 'Latest completed round' : 'Next round';
  return `
    <section class="current-round-card" id="current-round-card">
      <div class="crc-head">
        <div>
          <div class="tag">${statusLabel}</div>
          <h2>${esc(track.gp)}</h2>
        </div>
        <div class="crc-badge crc-badge-${track.status}">${esc(track.status)}</div>
      </div>
      <div class="crc-grid">
        <div class="wc-panel">
          <div class="crc-label">Circuit</div>
          <div class="crc-value">${esc(track.title)}</div>
        </div>
        <div class="wc-panel">
          <div class="crc-label">Date</div>
          <div class="crc-value">${esc(track.date)} ${SEASON}</div>
        </div>
        <div class="wc-panel">
          <div class="crc-label">${esc(summary.label)}</div>
          <div class="crc-value">${esc(summary.value)}</div>
        </div>
      </div>
      <div class="crc-actions">
        <a class="crc-primary" href="#/${track.slug}">Open ${esc(track.gp)} weekend →</a>
        <a class="crc-link crc-secondary" href="#grid">Jump to full round grid ↓</a>
      </div>
    </section>
  `;
}

function renderScheduleMode(track) {
  const groups = scheduleDataFor(track);
  const flat = groups.flatMap(group => group.items);
  const liveNow = flat.find(item => item.status === 'live') || null;
  const nextUp = flat.find(item => item.status === 'upcoming') || null;
  const lastResult = raceResults[track.slug] || null;
  return `
    <div class="wc-body-grid">
      <div class="wc-main">
        ${groups.map(group => `
          <section class="wc-panel">
            <div class="wc-day-head">
              <strong>${esc(group.day)}</strong>
              <span>${esc(group.date)}</span>
            </div>
            <div class="wc-day-list">
              ${group.items.map(scheduleRowMarkup).join('')}
            </div>
          </section>
        `).join('')}
      </div>
      <aside class="wc-rail">
        <div class="wc-rail-card">
          <div class="wc-rail-label">Live now</div>
          <div class="wc-rail-value">${liveNow ? esc(`${liveNow.label} · ${liveNow.time}`) : 'No session live right now'}</div>
        </div>
        <div class="wc-rail-card">
          <div class="wc-rail-label">Next up</div>
          <div class="wc-rail-value">${nextUp ? esc(`${nextUp.label} · ${nextUp.time}`) : 'Weekend complete / awaiting next round'}</div>
        </div>
        <div class="wc-rail-card">
          <div class="wc-rail-label">Fastest reference</div>
          <div class="wc-rail-copy">${lastResult?.fastestLap ? esc(`${lastResult.fastestLap.driver} · ${lastResult.fastestLap.time}`) : 'Race result detail will appear here once the weekend is complete.'}</div>
        </div>
      </aside>
    </div>
  `;
}

function renderReplayMode(track) {
  const replay = replayDataFor(track);
  const result = raceResults[track.slug] || null;
  if (!replay) {
    return `
      <div class="wc-empty">
        <strong>Replay timeline unavailable.</strong>
        <p>This round does not have seeded replay beats yet.</p>
      </div>
    `;
  }

  const state = ensureWeekendState(track.slug);
  const beat = replay.beats[state.beat] || replay.beats[0];
  return `
    <div class="wc-replay-shell" data-slug="${track.slug}">
      <div class="wc-live-top">
        <div>
          <div class="wc-kicker">${esc(replay.sessionLabel)}</div>
          <h3>${esc(track.gp)} · ${esc(replay.sessionDate)}</h3>
        </div>
        <div class="wc-phase-chip">${esc(beat.phase)}</div>
      </div>
      <div class="wc-controls">
        <button class="wc-control" data-action="prev">◀◀</button>
        <button class="wc-control" data-action="play">▶</button>
        <button class="wc-control" data-action="pause">❚❚</button>
        <button class="wc-control" data-action="next">▶▶</button>
        <span class="wc-lap">${esc(beat.lap)}</span>
        <span class="wc-clock">${esc(beat.clock)}</span>
        <button class="wc-speed${state.speed === 1 ? ' is-active' : ''}" data-speed="1">x1</button>
        <button class="wc-speed${state.speed === 2 ? ' is-active' : ''}" data-speed="2">x2</button>
        <button class="wc-speed${state.speed === 4 ? ' is-active' : ''}" data-speed="4">x4</button>
      </div>
      <input class="wc-scrubber" type="range" min="0" max="${replay.beats.length - 1}" value="${state.beat}" data-action="scrub">
      <div class="wc-body-grid">
        <div class="wc-main">
          <section class="wc-panel">
            <div class="wc-day-head"><strong>Running order snapshot</strong><span>${esc(beat.phase)}</span></div>
            <ol class="wc-order-list">
              ${beat.order.map((row, index) => `<li><span class="wc-order-pos">${index + 1}.</span><span>${esc(row)}</span></li>`).join('')}
            </ol>
          </section>
        </div>
        <aside class="wc-rail">
          <div class="wc-rail-card">
            <div class="wc-rail-label">Key moments</div>
            <div class="wc-feed">
              ${beat.feed.map(item => `<div class="wc-feed-item">${esc(item)}</div>`).join('')}
            </div>
          </div>
          <div class="wc-rail-card">
            <div class="wc-rail-label">Winner</div>
            <div class="wc-rail-value">${result?.winner ? esc(result.winner) : 'Result pending'}</div>
          </div>
        </aside>
      </div>
    </div>
  `;
}

function renderLiveMode(track) {
  return `
    <div class="wc-live-grid">
      <div class="wc-main">
        <section class="wc-panel" id="wc-live-shell">
          <div class="wc-empty">
            <strong>Loading live weekend data…</strong>
            <p>Checking the latest OpenF1 session for this circuit.</p>
          </div>
        </section>
      </div>
      <aside class="wc-rail">
        <div class="wc-rail-card">
          <div class="wc-rail-label">Weekend view</div>
          <div class="wc-rail-copy">Live timing, next session, and race control sit directly on the circuit page now.</div>
        </div>
      </aside>
    </div>
  `;
}

function defaultWeekendMode(track) {
  if (track.slug === (currentRoundTrack() || {}).slug && track.status === 'active') return 'live';
  if (track.status === 'done' && replayDataFor(track)) return 'replay';
  return 'schedule';
}

function weekendTabsFor(track) {
  const state = ensureWeekendState(track.slug);
  const liveEnabled = track.slug === (currentRoundTrack() || {}).slug;
  const replayEnabled = !!replayDataFor(track);
  return `
    <div class="wc-toggle" role="tablist" aria-label="Weekend Center mode">
      <button class="wc-tab${state.mode === 'schedule' ? ' is-active' : ''}" data-mode="schedule">Schedule</button>
      <button class="wc-tab${state.mode === 'live' ? ' is-active' : ''}" data-mode="live" ${liveEnabled ? '' : 'disabled'}>Live</button>
      <button class="wc-tab${state.mode === 'replay' ? ' is-active' : ''}" data-mode="replay" ${replayEnabled ? '' : 'disabled'}>Replay</button>
    </div>
  `;
}

function renderWeekendCenter(track) {
  const state = ensureWeekendState(track.slug);
  if (!state.mode) state.mode = defaultWeekendMode(track);
  if (state.mode === 'live' && track.slug !== (currentRoundTrack() || {}).slug) state.mode = 'schedule';
  if (state.mode === 'replay' && !replayDataFor(track)) state.mode = track.status === 'active' ? 'live' : 'schedule';

  const body = state.mode === 'live'
    ? renderLiveMode(track)
    : state.mode === 'replay'
      ? renderReplayMode(track)
      : renderScheduleMode(track);

  return `
    <section class="card weekend-center" id="weekend-center" data-slug="${track.slug}">
      <div class="wc-head">
        <div>
          <div class="tag">Weekend Center</div>
          <h2>${esc(track.gp)} weekend</h2>
        </div>
        ${weekendTabsFor(track)}
      </div>
      <div class="wc-body">${body}</div>
    </section>
  `;
}

async function hydrateLiveMode(track) {
  const shell = document.getElementById('wc-live-shell');
  if (!shell) return;

  try {
    const sessions = await fetchWeekendJson('https://api.openf1.org/v1/sessions?meeting_key=latest');
    const matching = (sessions || []).filter(session => matchWeekendCircuitSlug(session) === track.slug);
    const now = Date.now();
    const current = matching.find(session => {
      const start = new Date(session.date_start).getTime();
      const end = new Date(session.date_end).getTime();
      return start <= now && end >= now;
    });
    const next = matching.filter(session => new Date(session.date_start).getTime() > now)
      .sort((a, b) => new Date(a.date_start) - new Date(b.date_start))[0] || null;
    const latestCompleted = matching.filter(session => new Date(session.date_end).getTime() < now)
      .sort((a, b) => new Date(b.date_end) - new Date(a.date_end))[0] || null;
    const chosen = current || latestCompleted || next || matching[0] || null;

    if (!chosen) {
      shell.innerHTML = `
        <div class="wc-empty">
          <strong>No current Silverstone session feed.</strong>
          <p>OpenF1 is not returning a matching session for this circuit right now.</p>
        </div>
      `;
      return;
    }

    const sessionState = classifyWeekendSessionState(chosen);
    const [driversRes, positionsRes, intervalsRes, controlRes] = await Promise.allSettled([
      fetchWeekendJson(`https://api.openf1.org/v1/drivers?session_key=${chosen.session_key}`),
      fetchWeekendJson(`https://api.openf1.org/v1/position?session_key=${chosen.session_key}`),
      fetchWeekendJson(`https://api.openf1.org/v1/intervals?session_key=${chosen.session_key}`),
      fetchWeekendJson(`https://api.openf1.org/v1/race_control?session_key=${chosen.session_key}`)
    ]);

    const drivers = driversRes.status === 'fulfilled' ? driversRes.value : [];
    const positions = positionsRes.status === 'fulfilled' ? positionsRes.value : [];
    const intervals = intervalsRes.status === 'fulfilled' ? intervalsRes.value : [];
    const messages = controlRes.status === 'fulfilled' ? controlRes.value : [];

    const driverByNumber = new Map((drivers || []).map(driver => [driver.driver_number, driver]));
    const latestPositions = Array.from(latestWeekendByDriver(positions).values())
      .sort((a, b) => (a.position || 999) - (b.position || 999))
      .slice(0, 8);
    const latestIntervals = latestWeekendByDriver(intervals);
    const recentMessages = (messages || []).slice().sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)).slice(0, 6);

    const nextLabel = next ? `${next.session_name} · ${new Intl.DateTimeFormat('en-GB', { weekday: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(next.date_start))}` : 'No further session published';

    shell.innerHTML = `
      <div class="wc-live-hero">
        <div class="wc-live-top">
          <div>
            <div class="wc-kicker">Live session</div>
            <h3>${esc(chosen.session_name)} · ${esc(chosen.circuit_short_name || chosen.meeting_name || track.title)}</h3>
          </div>
          <div class="live-state-badge ${sessionState}">${esc(sessionState)}</div>
        </div>
        <div class="wc-kpi-grid">
          <div class="wc-live-kpi">
            <div class="crc-label">Start</div>
            <div class="wc-kpi-value">${liveFormatLocal(chosen.date_start)}</div>
          </div>
          <div class="wc-live-kpi">
            <div class="crc-label">End</div>
            <div class="wc-kpi-value">${liveFormatLocal(chosen.date_end)}</div>
          </div>
          <div class="wc-live-kpi">
            <div class="crc-label">Next session</div>
            <div class="wc-kpi-value">${esc(nextLabel)}</div>
          </div>
        </div>
      </div>
      <div class="wc-body-grid">
        <div class="wc-main">
          <section class="wc-panel">
            <div class="wc-day-head"><strong>Running order</strong><span>${latestPositions.length ? `${latestPositions.length} drivers` : 'Timing pending'}</span></div>
            ${latestPositions.length ? `
              <table class="wc-live-table">
                <thead><tr><th>Pos</th><th>Driver</th><th>Team</th><th>Interval</th></tr></thead>
                <tbody>
                  ${latestPositions.map(row => {
                    const driver = driverByNumber.get(row.driver_number) || {};
                    const teamColour = `#${driver.team_colour || '7d8593'}`;
                    return `
                      <tr>
                        <td class="wc-live-time">P${row.position}</td>
                        <td class="wc-live-driver"><span class="wc-live-teambar" style="background:${teamColour}"></span><strong>${driver.name_acronym || row.driver_number}</strong> <span class="wc-live-meta">#${row.driver_number}</span></td>
                        <td>${esc(driver.team_name || 'Unknown team')}</td>
                        <td class="wc-live-time">${formatWeekendInterval(latestIntervals.get(row.driver_number), row.position)}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            ` : `<div class="wc-live-empty">Timing rows aren’t published for this session yet.</div>`}
          </section>
        </div>
        <aside class="wc-rail">
          <div class="wc-rail-card">
            <div class="wc-rail-label">Race control</div>
            <div class="wc-feed">
              ${recentMessages.length ? recentMessages.map(message => `
                <div class="wc-feed-item">
                  <div class="wc-live-top">
                    <span class="wc-live-chip ${message.category ? liveChipClass(message.category) : 'other'}">${esc(message.category || 'update')}</span>
                    ${message.flag ? `<span class="wc-live-chip flag">${esc(message.flag)}</span>` : ''}
                    ${message.lap_number ? `<span class="wc-live-time">Lap ${message.lap_number}</span>` : ''}
                  </div>
                  <div>${esc(message.message || 'No message text provided.')}</div>
                </div>
              `).join('') : '<div class="wc-live-empty">No race-control messages are published for this session yet.</div>'}
            </div>
          </div>
          <div class="wc-rail-card">
            <div class="wc-rail-label">Extra surface</div>
            <a class="wc-secondary-link" href="./live-tracker.html">Open standalone live tracker →</a>
          </div>
        </aside>
      </div>
    `;

    const state = ensureWeekendState(track.slug);
    if (state.mode === 'live') {
      clearWeekendTimer(track.slug);
      state.timer = window.setInterval(() => hydrateLiveMode(track), LIVE_REFRESH_MS);
    }
  } catch (error) {
    shell.innerHTML = `
      <div class="wc-empty">
        <strong>Live feed unavailable.</strong>
        <p>${esc(error.message || 'OpenF1 did not respond cleanly just now.')}</p>
      </div>
    `;
  }
}

function stopReplay(track) {
  clearWeekendTimer(track.slug);
}

function replayTick(track) {
  const replay = replayDataFor(track);
  const state = ensureWeekendState(track.slug);
  if (!replay) return;
  state.beat = (state.beat + 1) % replay.beats.length;
  mountWeekendCenter(track.slug);
}

function startReplay(track) {
  const replay = replayDataFor(track);
  const state = ensureWeekendState(track.slug);
  if (!replay) return;
  clearWeekendTimer(track.slug);
  state.timer = window.setInterval(() => replayTick(track), Math.max(700, 1800 / state.speed));
}

function mountWeekendCenter(slug) {
  const track = bySlug[slug];
  if (!track || !track.report) return;
  const view = app.querySelector('.view');
  const meta = view && view.querySelector('.meta');
  if (!view || !meta) return;

  clearWeekendTimer(track.slug);

  const existing = document.getElementById('weekend-center');
  if (existing) existing.remove();
  meta.insertAdjacentHTML('afterend', renderWeekendCenter(track));

  const center = document.getElementById('weekend-center');
  if (!center) return;
  center.addEventListener('click', event => {
    const tab = event.target.closest('[data-mode]');
    if (tab && !tab.hasAttribute('disabled')) {
      const state = ensureWeekendState(track.slug);
      state.mode = tab.dataset.mode;
      if (state.mode !== 'replay') clearWeekendTimer(track.slug);
      mountWeekendCenter(track.slug);
      return;
    }

    const action = event.target.closest('[data-action]');
    if (action) {
      const state = ensureWeekendState(track.slug);
      const replay = replayDataFor(track);
      if (!replay) return;
      if (action.dataset.action === 'prev') {
        clearWeekendTimer(track.slug);
        state.beat = Math.max(0, state.beat - 1);
      } else if (action.dataset.action === 'next') {
        clearWeekendTimer(track.slug);
        state.beat = Math.min(replay.beats.length - 1, state.beat + 1);
      } else if (action.dataset.action === 'play') {
        startReplay(track);
        return;
      } else if (action.dataset.action === 'pause') {
        clearWeekendTimer(track.slug);
      }
      mountWeekendCenter(track.slug);
      return;
    }

    const speed = event.target.closest('[data-speed]');
    if (speed) {
      const state = ensureWeekendState(track.slug);
      state.speed = Number(speed.dataset.speed || 1);
      clearWeekendTimer(track.slug);
      mountWeekendCenter(track.slug);
    }
  });

  center.addEventListener('input', event => {
    if (event.target.matches('.wc-scrubber')) {
      const state = ensureWeekendState(track.slug);
      clearWeekendTimer(track.slug);
      state.beat = Number(event.target.value || 0);
      mountWeekendCenter(track.slug);
    }
  });

  if (ensureWeekendState(track.slug).mode === 'live') {
    hydrateLiveMode(track);
  }
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
  if (slug && bySlug[slug]) {
    mountWeekendCenter(slug);
    return;
  }
  mountHomeCurrentRaceCard();
}

window.addEventListener('hashchange', () => {
  Object.keys(weekendEnhancementState).forEach(clearWeekendTimer);
  window.setTimeout(syncWeekendSurfaces, 0);
});

window.setTimeout(syncWeekendSurfaces, 400);
