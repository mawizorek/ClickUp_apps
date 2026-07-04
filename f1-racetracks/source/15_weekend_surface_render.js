/* Permanent weekend-surface rendering.
   Owns the home current-round card, weekend-center tabs, shared footer label handling,
   and the stable style layer that replaced the oversized rescue file.
 */

function injectWeekendSurfaceStyle() {
  if (document.getElementById(WEEKEND_SURFACE_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = WEEKEND_SURFACE_STYLE_ID;
  style.textContent = `
    .current-round-card{margin:18px 0 0;padding:14px 16px 14px;border-radius:20px}
    .pp-home-kicker{display:flex;justify-content:space-between;gap:8px;align-items:center;flex-wrap:wrap}
    .pp-home-title{display:grid;gap:1px}
    .pp-home-title h2{font-size:1.14rem;font-weight:700;letter-spacing:-.02em;line-height:1.04;margin:0}
    .pp-home-sub{display:none}
    .pp-home-flag{display:inline-flex;align-items:center;gap:6px;color:var(--done);font-family:"IBM Plex Mono",monospace;font-size:.56rem;letter-spacing:.08em;text-transform:uppercase;padding-left:10px;line-height:1.2}
    .pp-home-flag::before{content:"";width:7px;height:7px;border-radius:999px;background:var(--done)}
    .pp-home-cta{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:4px}
    .pp-button{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:9px 12px;border-radius:999px;border:1px solid var(--line);background:oklch(18% 0.02 264 /.82);color:var(--text);text-decoration:none;font-family:"IBM Plex Mono",monospace;font-size:.68rem;cursor:pointer}
    .pp-button.primary{background:oklch(64% 0.2 145 /.16);border-color:oklch(64% 0.2 145 /.42);color:var(--done)}
    .pp-home-schedule{display:grid;gap:8px;margin-top:2px}
    .pp-home-day{font-family:"IBM Plex Mono",monospace;font-size:.58rem;letter-spacing:.1em;text-transform:uppercase;color:var(--faint);opacity:.9;margin-top:2px}
    .pp-home-day:first-child{margin-top:0}
    .pp-home-session{display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:7px 0;border-top:1px solid oklch(32% 0.02 264 /.45)}
    .pp-home-session.is-live{padding-left:10px;border-left:2px solid var(--done);background:linear-gradient(90deg,oklch(64% 0.2 145 /.08),transparent 55%)}
    .pp-home-session-name{font-size:.92rem;line-height:1.25;color:var(--text);flex:1 1 auto}
    .pp-home-session-time{font-family:"IBM Plex Mono",monospace;font-size:.82rem;color:var(--muted);white-space:nowrap;flex:0 0 auto}
    .weekend-center{margin-top:18px}
    .pp-local-note,.pp-schedule-summary{display:none}
    .pp-schedule-list{display:grid;gap:10px}
    .pp-session-group{display:grid;gap:0}
    .pp-session-group-label{font-size:.58rem;color:var(--faint);opacity:.85;font-family:"IBM Plex Mono",monospace;letter-spacing:.1em;text-transform:uppercase}
    .pp-session-row{display:flex;align-items:baseline;justify-content:space-between;gap:14px;padding:9px 0}
    .pp-session-row.is-live{padding-left:10px;border-left:2px solid var(--done);background:linear-gradient(90deg,oklch(64% 0.2 145 /.08),transparent 50%)}
    .pp-session-name{font-size:.96rem;line-height:1.24;flex:1 1 auto}
    .pp-session-time{font-family:"IBM Plex Mono",monospace;font-size:.86rem;color:var(--muted);white-space:nowrap;flex:0 0 auto}
    .pp-session-row.is-done .pp-session-name,.pp-session-row.is-done .pp-session-time{color:var(--faint);opacity:.68}
    .pp-session-row.is-live .pp-session-name,.pp-session-row.is-live .pp-session-time{font-weight:700;color:var(--text)}
    .pp-session-row.is-upcoming .pp-session-name{font-weight:600}
    .pp-weekend-shell{display:grid;gap:18px}
    .pp-replay-rail{display:grid;gap:12px}
    .pp-empty-note{font-family:"IBM Plex Mono",monospace;color:var(--muted);font-size:.78rem;line-height:1.6}
    .wc-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;flex-wrap:wrap}
    .wc-head h2{font-size:1.24rem;font-weight:700;letter-spacing:-.02em}
    .wc-toggle{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .wc-tab{border:1px solid var(--line);background:oklch(18% 0.02 264 /.82);color:var(--muted);padding:8px 12px;border-radius:999px;font-family:"IBM Plex Mono",monospace;font-size:.68rem;cursor:pointer}
    .wc-tab.is-active{color:var(--text);border-color:oklch(64% 0.2 145 /.42);background:oklch(64% 0.2 145 /.12)}
    .wc-tab[disabled]{opacity:.4;cursor:not-allowed}
    .wc-day-head{display:flex;justify-content:space-between;gap:10px;align-items:center;font-family:"IBM Plex Mono",monospace;font-size:.72rem;color:var(--faint);margin-bottom:8px}
    .wc-replay-top{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap}
    .wc-kicker,.wc-phase-chip,.wc-lap,.wc-clock{font-family:"IBM Plex Mono",monospace;font-size:.68rem;letter-spacing:.08em;text-transform:uppercase}
    .wc-phase-chip{padding:7px 10px;border-radius:999px;border:1px solid var(--line);background:oklch(18% 0.02 264 /.82)}
    .wc-controls{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .wc-control,.wc-speed{border:1px solid var(--line);background:oklch(18% 0.02 264 /.82);color:var(--text);padding:8px 10px;border-radius:999px;font-family:"IBM Plex Mono",monospace;font-size:.68rem;cursor:pointer}
    .wc-speed.is-active{border-color:oklch(64% 0.2 145 /.42);color:var(--done)}
    .wc-scrubber{width:100%}
    .wc-body-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(240px,320px);gap:16px}
    .wc-order-block,.wc-rail-card{border:1px solid var(--line);border-radius:14px;background:oklch(17% 0.018 264 /.62);padding:14px}
    .wc-order-list{display:grid;gap:8px;padding-left:0;list-style:none}
    .wc-order-list li{display:flex;gap:10px;align-items:center}
    .wc-order-pos{font-family:"IBM Plex Mono",monospace;color:var(--faint);min-width:2.6ch}
    .wc-rail-label{font-family:"IBM Plex Mono",monospace;font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;color:var(--faint);margin-bottom:8px}
    .wc-rail-value{font-size:.98rem;font-weight:600;line-height:1.35}
    .wc-rail-copy{color:var(--muted);font-size:.86rem;line-height:1.55}
    .wc-feed{display:grid;gap:10px}
    .wc-feed-item{padding:10px 0;border-bottom:1px solid oklch(32% 0.02 264 /.45)}
    .wc-feed-item:last-child{border-bottom:none;padding-bottom:0}
    @media (max-width:860px){.wc-body-grid{grid-template-columns:1fr}}
    @media (max-width:720px){
      .current-round-card{padding:12px 14px 12px}
      .pp-home-title h2{font-size:1rem}
      .pp-home-cta{display:flex;gap:8px}
      .pp-button{width:auto;flex:1 1 0}
      .pp-home-schedule{gap:6px}
      .pp-home-session{gap:10px;padding:6px 0}
      .pp-home-session-name{font-size:.84rem}
      .pp-home-session-time{font-size:.78rem}
      .pp-session-row{gap:10px}
      .pp-session-name{font-size:.9rem}
      .pp-session-time{font-size:.8rem}
    }
  `;
  document.head.appendChild(style);
}

function normalizeFooterText(text) {
  const raw = String(text || '').replace(/\s+/g, ' ').trim();
  const removedRepeats = raw.replace(/(?:·\s*F1 Racetracks\s+[^·]+)+/g, '');
  const withoutLeadingLabel = removedRepeats.replace(/^F1 Racetracks\s+[^·]+(?:\s*·\s*)?/, '');
  const remainder = withoutLeadingLabel.trim().replace(/^·\s*/, '');
  return remainder ? 'F1 Racetracks ' + BUILD_LABEL + ' · ' + remainder : 'F1 Racetracks ' + BUILD_LABEL;
}

function ensureWeekendFooterLabel() {
  const foot = document.getElementById('foot-meta');
  if (!foot) return;
  foot.textContent = normalizeFooterText(foot.textContent);
}

function wrapWeekendFooterUpdater() {
  const original = window.updateFooterMeta;
  if (typeof original !== 'function' || original.__ppWeekendWrapped) {
    ensureWeekendFooterLabel();
    return;
  }
  function wrapped(target) {
    original(target);
    ensureWeekendFooterLabel();
  }
  wrapped.__ppWeekendWrapped = true;
  window.updateFooterMeta = wrapped;
  ensureWeekendFooterLabel();
}

function desiredWeekendMode(track) {
  const state = replayState(track.slug);
  if (state.mode) return state.mode;
  if (track.status === 'active') return 'live';
  if (track.status === 'done' && REPLAY_DATA[track.slug]) return 'replay';
  return 'schedule';
}

function renderHomeCard(track) {
  const rows = homeScheduleRows(track);
  const groups = rows.reduce(function (acc, item) {
    (acc[item.day] = acc[item.day] || []).push(item);
    return acc;
  }, {});
  const flag = track.status === 'active' ? 'Live' : 'Focus';
  return `
    <section class="current-round-card" id="${HOME_ID}">
      <div class="pp-home-kicker">
        <div class="pp-home-title">
          <h2>${esc(track.gp)}</h2>
          <div class="pp-home-sub">${esc(track.title)}</div>
        </div>
        <span class="pp-home-flag">${esc(flag)}</span>
      </div>
      <div class="pp-home-schedule">
        ${Object.keys(groups).map(function (day) {
          return `
            <div class="pp-home-day">${esc(day)}</div>
            ${groups[day].map(function (item) {
              return `
                <div class="pp-home-session ${item.status === 'live' ? 'is-live' : ''}">
                  <div class="pp-home-session-name">${esc(item.label)}</div>
                  <div class="pp-home-session-time">${esc(localTime(item.start))}–${esc(localTime(item.end))}</div>
                </div>
              `;
            }).join('')}
          `;
        }).join('')}
      </div>
      <div class="pp-home-cta">
        <button class="pp-button primary" type="button" data-open-weekend="${esc(track.slug)}">Open Weekend Center →</button>
        <a class="pp-button" href="./live-tracker.html">Live tracker</a>
      </div>
    </section>
  `;
}

function renderScheduleTab(track) {
  const groups = buildSchedule(track);
  const summary = scheduleSummary(track);
  const lead = summary.liveNow
    ? summary.liveNow.label + ' ' + summary.liveNow.range + ' now'
    : summary.nextUp
      ? summary.nextUp.label + ' ' + summary.nextUp.range + ' next'
      : 'Weekend complete';

  if (!groups.length) {
    return `<div class="pp-empty-note">Weekend schedule data is still thin for this round, but the shell is now in place for the richer per-session feed.</div>`;
  }

  return `
    <div class="pp-weekend-shell">
      <div class="pp-schedule-summary">${esc(lead)}</div>
      <span class="pp-local-note">Times shown in your local timezone.</span>
      <div class="pp-schedule-list">
        ${groups.map(function (group) {
          return `
            <section class="pp-session-group">
              <div class="pp-session-group-label">${esc(group.label)}</div>
              ${(group.items || []).map(function (item) {
                const label = item.series && item.series !== 'F1' ? item.series + ' · ' + item.label : item.label;
                return `
                  <div class="pp-session-row is-${esc(item.status)}">
                    <div class="pp-session-name">${esc(label)}</div>
                    <div class="pp-session-time">${esc(item.range)}</div>
                  </div>
                `;
              }).join('')}
            </section>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderReplayTab(track) {
  const replay = REPLAY_DATA[track.slug];
  if (!replay) {
    return `<div class="pp-empty-note">Replay mode is queued for this round, but the editorial beat map is not seeded yet.</div>`;
  }
  const state = replayState(track.slug);
  const beat = replay.beats[state.beat] || replay.beats[0];
  return `
    <div class="pp-weekend-shell" data-slug="${esc(track.slug)}">
      <div class="wc-replay-top">
        <div>
          <div class="wc-kicker">Replay timeline</div>
          <h3>${esc(replay.title)}</h3>
          <p class="crc-copy">${esc(replay.subtitle)}</p>
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
        <section class="wc-order-block">
          <div class="wc-day-head"><strong>Running order snapshot</strong><span>${esc(beat.phase)}</span></div>
          <ol class="wc-order-list">${beat.order.map(function (entry, index) { return `<li><span class="wc-order-pos">${index + 1}.</span><span>${esc(entry)}</span></li>`; }).join('')}</ol>
        </section>
        <aside class="pp-replay-rail">
          <div class="wc-rail-card"><div class="wc-rail-label">Key moments</div><div class="wc-feed">${beat.feed.map(function (item) { return `<div class="wc-feed-item">${esc(item)}</div>`; }).join('')}</div></div>
          <div class="wc-rail-card"><div class="wc-rail-label">Why it hits</div><div class="wc-rail-copy">Replay is the sharp editorial retelling layer — quick to scan, good enough to revisit a finished weekend, and no fake telemetry nonsense.</div></div>
        </aside>
      </div>
    </div>
  `;
}

function renderLiveTab(track) {
  return `<div id="pp-live-shell" class="pp-weekend-shell"><div class="pp-empty-note">Loading live session context for ${esc(track.gp)}…</div></div>`;
}

function renderWeekendCenter(track) {
  const state = replayState(track.slug);
  state.mode = desiredWeekendMode(track);
  const liveEnabled = track.slug === (readCurrentTrack() || {}).slug || track.status === 'active';
  const body = state.mode === 'live' ? renderLiveTab(track) : state.mode === 'replay' ? renderReplayTab(track) : renderScheduleTab(track);
  return `
    <section class="card weekend-center" id="${CENTER_ID}" data-slug="${esc(track.slug)}">
      <div class="wc-head">
        <div>
          <div class="tag">Weekend Center</div>
          <h2>${esc(track.gp)} weekend</h2>
        </div>
        <div class="wc-toggle" role="tablist" aria-label="Weekend Center mode">
          <button class="wc-tab${state.mode === 'schedule' ? ' is-active' : ''}" data-mode="schedule">Schedule</button>
          <button class="wc-tab${state.mode === 'live' ? ' is-active' : ''}" data-mode="live" ${liveEnabled ? '' : 'disabled'}>Live</button>
          <button class="wc-tab${state.mode === 'replay' ? ' is-active' : ''}" data-mode="replay" ${REPLAY_DATA[track.slug] ? '' : 'disabled'}>Replay</button>
        </div>
      </div>
      ${body}
    </section>
  `;
}
