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

function clearWeekendReplayTimer(slug) {
  const state = ensureWeekendState(slug);
  if (state.timer) {
    window.clearInterval(state.timer);
    state.timer = null;
  }
}

function trackSlugFromHash() {
  return (location.hash.replace(/^#\/?/, "") || "").trim();
}

function inferScheduleStatus(track, dateString) {
  const today = new Date().toISOString().slice(0, 10);
  if (track.status === "done") return "done";
  if (track.status === "active") {
    if (dateString === today) return "live";
    return dateString < today ? "done" : "upcoming";
  }
  return dateString < today ? "done" : "upcoming";
}

function buildFallbackSchedule(track) {
  return (track.sessions || []).map(entry => {
    const [dayLabelRaw, bodyRaw] = String(entry.sess || "").split("·");
    const dayLabel = (dayLabelRaw || "Weekend").trim();
    const body = (bodyRaw || "Session").trim();
    const pieces = body.split("+").map(item => item.trim()).filter(Boolean);
    return {
      day: dayLabel,
      date: entry.date,
      items: pieces.map(label => ({
        series: "F1",
        label,
        time: "Time TBC",
        status: inferScheduleStatus(track, entry.date)
      }))
    };
  });
}

function scheduleDataFor(track) {
  if (Array.isArray(track.schedule) && track.schedule.length) {
    const grouped = {};
    track.schedule.forEach(item => {
      const dateKey = item.datetime ? item.datetime.slice(0, 10) : "unknown";
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          day: new Date(item.datetime).toLocaleDateString("en-US", { weekday: "short" }),
          date: dateKey,
          items: []
        };
      }
      grouped[dateKey].items.push({
        series: item.series,
        label: item.session,
        time: new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(item.datetime)),
        status: item.status || "upcoming"
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
        <span class="wc-series wc-series-${String(item.series || "generic").toLowerCase()}">${esc(item.series || "F1")}</span>
        <span class="wc-session-name">${esc(item.label)}</span>
      </div>
      <div class="wc-session-right">
        <span class="wc-session-time">${esc(item.time || "Time TBC")}</span>
        <span class="wc-status wc-status-${item.status}">${esc(item.status)}</span>
      </div>
    </div>
  `;
}

function replayDataFor(track) {
  return WEEKEND_REPLAY_DATA[track.slug] || null;
}

function renderScheduleMode(track) {
  const groups = scheduleDataFor(track);
  const flat = groups.flatMap(group => group.items);
  const liveNow = flat.find(item => item.status === "live") || null;
  const nextUp = flat.find(item => item.status === "upcoming") || null;
  return `
    <div class="wc-body-grid">
      <div class="wc-main">
        ${groups.map(group => `
          <section class="wc-day-block">
            <div class="wc-day-head">
              <strong>${esc(group.day)}</strong>
              <span>${esc(group.date)}</span>
            </div>
            <div class="wc-day-list">
              ${group.items.map(scheduleRowMarkup).join("")}
            </div>
          </section>
        `).join("")}
      </div>
      <aside class="wc-rail">
        <div class="wc-rail-card">
          <div class="wc-rail-label">Live now</div>
          <div class="wc-rail-value">${liveNow ? esc(liveNow.label) : "No session live right now"}</div>
        </div>
        <div class="wc-rail-card">
          <div class="wc-rail-label">Next up</div>
          <div class="wc-rail-value">${nextUp ? esc(nextUp.label) : "Weekend complete / awaiting next round"}</div>
        </div>
        <div class="wc-rail-card">
          <div class="wc-rail-label">Intent</div>
          <div class="wc-rail-copy">This puts the calendar feel directly into the main app as you page across rounds.</div>
        </div>
      </aside>
    </div>
  `;
}

function renderReplayMode(track) {
  const replay = replayDataFor(track);
  if (!replay) {
    return `
      <div class="wc-empty">
        <strong>Replay coming next.</strong>
        <p>This round is eligible for Weekend Center replay, but the editorial event stream has not been seeded yet.</p>
      </div>
    `;
  }

  const state = ensureWeekendState(track.slug);
  const beat = replay.beats[state.beat] || replay.beats[0];
  return `
    <div class="wc-replay-shell" data-slug="${track.slug}">
      <div class="wc-replay-top">
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
          <section class="wc-order-block">
            <div class="wc-day-head"><strong>Running order snapshot</strong><span>${esc(beat.phase)}</span></div>
            <ol class="wc-order-list">
              ${beat.order.map((row, index) => `<li><span class="wc-order-pos">${index + 1}.</span><span>${esc(row)}</span></li>`).join("")}
            </ol>
          </section>
        </div>
        <aside class="wc-rail">
          <div class="wc-rail-card">
            <div class="wc-rail-label">Event feed</div>
            <div class="wc-feed">
              ${beat.feed.map(item => `<div class="wc-feed-item">${esc(item)}</div>`).join("")}
            </div>
          </div>
          <div class="wc-rail-card">
            <div class="wc-rail-label">Mode feel</div>
            <div class="wc-rail-copy">Race-control / leaderboard playback first. Event rhythm beats deep stats in v1.</div>
          </div>
        </aside>
      </div>
    </div>
  `;
}

function defaultWeekendMode(track) {
  const replay = replayDataFor(track);
  if (track.status === "done" && replay) return "replay";
  return "schedule";
}

function currentRoundTrack() {
  return bySlug[appDataMeta.current_round_slug]
    || TRACKS.find(track => track.status === "active")
    || bySlug[appDataMeta.last_completed_round_slug]
    || reportTracks.find(track => track.status !== "done")
    || reportTracks[0]
    || null;
}

function currentRoundSummary(track) {
  const groups = scheduleDataFor(track);
  const flat = groups.flatMap(group => group.items);
  const liveNow = flat.find(item => item.status === "live") || null;
  const nextUp = flat.find(item => item.status === "upcoming") || null;
  if (liveNow) return { label: "Live now", value: liveNow.label };
  if (nextUp) return { label: "Next up", value: nextUp.label };
  if (track.status === "done") return { label: "Replay", value: "Weekend complete" };
  return { label: "Status", value: "Weekend details loading" };
}

function renderHomeCurrentRaceCard(track) {
  const statusLabel = track.status === "active" ? "Current round" : track.status === "done" ? "Latest completed round" : "Next round";
  const summary = currentRoundSummary(track);
  return `
    <section class="current-round-card" id="current-round-card">
      <div class="crc-head">
        <div>
          <div class="tag">${statusLabel}</div>
          <h2>${esc(track.gp)}</h2>
        </div>
        <div class="crc-badge crc-badge-${track.status}">${esc(track.status)}</div>
      </div>
      <p class="crc-copy">Jump straight into the track page for the race weekend that matters most right now. The chronological grid stays untouched below.</p>
      <div class="crc-grid">
        <div class="crc-card">
          <div class="crc-label">Circuit</div>
          <div class="crc-value">${esc(track.title)}</div>
        </div>
        <div class="crc-card">
          <div class="crc-label">Date</div>
          <div class="crc-value">${esc(track.date)} ${SEASON}</div>
        </div>
        <div class="crc-card">
          <div class="crc-label">${esc(summary.label)}</div>
          <div class="crc-value">${esc(summary.value)}</div>
        </div>
      </div>
      <div class="crc-actions">
        <a class="crc-link" href="#/${track.slug}">Open current race page →</a>
        <a class="crc-link is-muted" href="./live-tracker.html">Open live tracker companion →</a>
      </div>
    </section>
  `;
}

function renderWeekendCenter(track) {
  const state = ensureWeekendState(track.slug);
  if (!state.mode) state.mode = defaultWeekendMode(track);
  return `
    <section class="card weekend-center" id="weekend-center" data-slug="${track.slug}">
      <div class="wc-head">
        <div>
          <div class="tag">Weekend Center</div>
          <h2>${esc(track.gp)} weekend</h2>
        </div>
        <div class="wc-toggle" role="tablist" aria-label="Weekend Center mode">
          <button class="wc-tab${state.mode === 'schedule' ? ' is-active' : ''}" data-mode="schedule">Schedule</button>
          <button class="wc-tab${state.mode === 'replay' ? ' is-active' : ''}" data-mode="replay">Replay</button>
        </div>
      </div>
      <div class="wc-body" id="weekend-center-body">
        ${state.mode === 'replay' ? renderReplayMode(track) : renderScheduleMode(track)}
      </div>
    </section>
  `;
}

function stopReplay(track) {
  clearWeekendReplayTimer(track.slug);
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
  clearWeekendReplayTimer(track.slug);
  state.timer = window.setInterval(() => replayTick(track), Math.max(700, 1800 / state.speed));
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

  const center = document.getElementById('weekend-center');
  if (!center) return;
  center.addEventListener('click', event => {
    const tab = event.target.closest('[data-mode]');
    if (tab) {
      const state = ensureWeekendState(track.slug);
      state.mode = tab.dataset.mode;
      if (state.mode !== 'replay') stopReplay(track);
      mountWeekendCenter(track.slug);
      return;
    }

    const action = event.target.closest('[data-action]');
    if (action) {
      const state = ensureWeekendState(track.slug);
      const replay = replayDataFor(track);
      if (!replay) return;
      if (action.dataset.action === 'prev') {
        stopReplay(track);
        state.beat = Math.max(0, state.beat - 1);
      } else if (action.dataset.action === 'next') {
        stopReplay(track);
        state.beat = Math.min(replay.beats.length - 1, state.beat + 1);
      } else if (action.dataset.action === 'play') {
        startReplay(track);
        return;
      } else if (action.dataset.action === 'pause') {
        stopReplay(track);
      }
      mountWeekendCenter(track.slug);
      return;
    }

    const speed = event.target.closest('[data-speed]');
    if (speed) {
      const state = ensureWeekendState(track.slug);
      state.speed = Number(speed.dataset.speed || 1);
      stopReplay(track);
      mountWeekendCenter(track.slug);
    }
  });

  center.addEventListener('input', event => {
    if (event.target.matches('.wc-scrubber')) {
      const state = ensureWeekendState(track.slug);
      stopReplay(track);
      state.beat = Number(event.target.value || 0);
      mountWeekendCenter(track.slug);
    }
  });
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
  Object.keys(weekendEnhancementState).forEach(clearWeekendReplayTimer);
  window.setTimeout(syncWeekendSurfaces, 0);
});

window.setTimeout(syncWeekendSurfaces, 400);
