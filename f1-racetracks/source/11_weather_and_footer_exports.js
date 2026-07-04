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
if (copyBtn) copyBtn.addEventListener("click", async e => {
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
    try { ok = document.execCommand("copy"); } catch (__){ }
    ta.remove();
    flash(e.currentTarget, ok ? "Source copied" : "Copy failed");
  }
});

const prepBtn = document.getElementById("t-prep");
if (prepBtn) prepBtn.addEventListener("click", e => {
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

const tabBtn = document.getElementById("t-tab");
if (tabBtn) tabBtn.addEventListener("click", e => {
  const w = window.open(freshSourceURL("text/plain"), "_blank");
  flash(e.currentTarget, w ? "Opened" : "Popup blocked");
});

const dataBtn = document.getElementById("t-data");
if (dataBtn) dataBtn.addEventListener("click", e => {
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

const SCHEDULE_SEEDS = {
  silverstone: [
    { day: 'Fri', date: '2026-07-03', items: [
      { series: 'F1', label: 'Practice 1', range: '12:30–13:30', status: 'done' },
      { series: 'F1', label: 'Sprint Qualifying', range: '16:30–17:14', status: 'done' }
    ]},
    { day: 'Sat', date: '2026-07-04', items: [
      { series: 'F1', label: 'Sprint', range: '12:00–13:00', status: 'live' },
      { series: 'F1', label: 'Qualifying', range: '16:00–17:00', status: 'upcoming' }
    ]},
    { day: 'Sun', date: '2026-07-05', items: [
      { series: 'F1', label: 'Grand Prix', range: '15:00–17:00', status: 'upcoming' }
    ]}
  ]
};

function currentRoundTrack() {
  return bySlug[appDataMeta.current_round_slug] || TRACKS.find(track => track.status === 'active') || reportTracks[0] || null;
}

function scheduleDataFor(track) {
  return SCHEDULE_SEEDS[track.slug] || [];
}

function renderHomeCurrentRaceCard(track) {
  const groups = scheduleDataFor(track);
  const sessions = groups.flatMap(group => group.items);
  const liveNow = sessions.find(session => session.status === 'live');
  const nextUp = sessions.find(session => session.status === 'upcoming');
  return `
    <section class="current-round-card" id="current-round-card">
      <div class="crc-head">
        <div>
          <div class="tag">Current round</div>
          <h2>${esc(track.gp)}</h2>
        </div>
        <div class="crc-badge crc-badge-${track.status}">${esc(track.status)}</div>
      </div>
      <p class="crc-meta">${esc(track.title)} · ${esc(track.date)} ${SEASON}</p>
      <div class="crc-grid">
        <div class="wc-panel"><div class="crc-label">Live now</div><div class="crc-value">${esc(liveNow ? liveNow.label : 'No session live')}</div></div>
        <div class="wc-panel"><div class="crc-label">Next up</div><div class="crc-value">${esc(nextUp ? nextUp.label : 'Weekend complete')}</div></div>
      </div>
      <div class="crc-actions"><a class="crc-primary" href="#/${track.slug}">Open weekend center →</a></div>
    </section>
  `;
}

function scheduleRowMarkup(item) {
  return `
    <div class="wc-session-row">
      <div class="wc-session-left">
        <span class="wc-series wc-series-f1">${esc(item.series)}</span>
        <span class="wc-session-name">${esc(item.label)}</span>
      </div>
      <div class="wc-session-right">
        <span class="wc-session-time">${esc(item.range)}</span>
        <span class="wc-status wc-status-${item.status}">${esc(item.status)}</span>
      </div>
    </div>
  `;
}

function renderWeekendCenter(track) {
  const groups = scheduleDataFor(track);
  if (!groups.length) return '';
  return `
    <section class="card weekend-center" id="weekend-center">
      <div class="wc-head">
        <div>
          <div class="tag">Weekend Center</div>
          <h2>${esc(track.gp)} weekend</h2>
        </div>
        <div class="wc-toggle"><button class="wc-tab is-active">Schedule</button></div>
      </div>
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
