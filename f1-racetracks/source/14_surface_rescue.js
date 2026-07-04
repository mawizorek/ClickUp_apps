/* Polished late-mount app layer for the full F1 Racetracks experience.
   Uses lexical runtime state when available and upgrades the home + track weekend surfaces.
*/

(function () {
  const BUILD_LABEL = 'V1.7 full';
  const HOME_ID = 'current-round-card';
  const CENTER_ID = 'weekend-center';
  const EXTRA_STYLE_ID = 'pp-weekend-center-polish';
  const LIVE_REFRESH_MS = 20000;

  const replayTimers = {};
  const viewState = {};

  const LIVE_CIRCUIT_ALIASES = {
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
        { series: 'F1', label: 'Practice 1', range: '12:30–13:30', status: 'done' },
        { series: 'F1', label: 'Sprint Qualifying', range: '16:30–17:14', status: 'done' }
      ]},
      { day: 'Sat', date: '2026-07-04', items: [
        { series: 'F1', label: 'Sprint', range: '12:00–13:00', status: 'live' },
        { series: 'F1', label: 'Qualifying', range: '4:00–5:00 PM', status: 'upcoming' }
      ]},
      { day: 'Sun', date: '2026-07-05', items: [
        { series: 'F1', label: 'Grand Prix', range: '3:00–5:00 PM', status: 'upcoming' }
      ]}
    ]
  };

  const REPLAY_DATA = {
    'albert-park': {
      title: 'Australian GP replay',
      subtitle: 'Russell converts the opener into a Mercedes 1–2.',
      beats: [
        { phase: 'Launch', lap: 'Lap 1 / 58', clock: 'Lights out', order: ['RUS', 'PIA', 'HAM', 'NOR', 'VER'], feed: ['Russell nails the start from pole.', 'Piastri locks down P2 through Turn 3.'] },
        { phase: 'Pit phase', lap: 'Lap 30 / 58', clock: '00:41:10', order: ['RUS', 'VER', 'NOR', 'LEC', 'ANT'], feed: ['Undercut windows open across the top five.', 'Antonelli gains clean air in the second phase.'] },
        { phase: 'Finish', lap: 'Chequered flag', clock: '01:27:12', order: ['RUS', 'ANT', 'LEC', 'VER', 'NOR'], feed: ['Mercedes opens 2026 with a 1–2.', 'Russell wins the season opener.'] }
      ]
    },
    shanghai: {
      title: 'Chinese GP replay',
      subtitle: 'Antonelli controls the Shanghai weekend end to end.',
      beats: [
        { phase: 'Launch', lap: 'Lap 1 / 56', clock: 'Lights out', order: ['ANT', 'RUS', 'HAM', 'LEC', 'PIA'], feed: ['Antonelli launches cleanly from pole.', 'Hamilton holds the inside into the spiral.'] },
        { phase: 'Strategy', lap: 'Lap 28 / 56', clock: '00:46:18', order: ['RUS', 'ANT', 'HAM', 'LEC', 'PIA'], feed: ['Russell briefly leads on the stop phase.', 'Antonelli retakes effective control on fresher tyres.'] },
        { phase: 'Finish', lap: 'Chequered flag', clock: '01:29:04', order: ['ANT', 'RUS', 'HAM', 'LEC', 'PIA'], feed: ['Antonelli wins in Shanghai.', 'Mercedes completes another 1–2.'] }
      ]
    },
    suzuka: {
      title: 'Japanese GP replay',
      subtitle: 'Clean air and precision define Suzuka.',
      beats: [
        { phase: 'Launch', lap: 'Lap 1 / 53', clock: 'Lights out', order: ['ANT', 'RUS', 'PIA', 'LEC', 'NOR'], feed: ['Antonelli controls the launch from pole.', 'Suzuka stays orderly through the Esses.'] },
        { phase: 'Middle stint', lap: 'Lap 30 / 53', clock: '00:51:06', order: ['ANT', 'PIA', 'LEC', 'RUS', 'NOR'], feed: ['Antonelli keeps control through the undercut window.', 'Leclerc jumps into podium contention.'] },
        { phase: 'Finish', lap: 'Chequered flag', clock: '01:28:58', order: ['ANT', 'PIA', 'LEC', 'RUS', 'NOR'], feed: ['Antonelli takes his first F1 win.', 'Suzuka rewards precision over chaos.'] }
      ]
    },
    miami: {
      title: 'Miami GP replay',
      subtitle: 'A compressed field, a sharp restart, and Antonelli again.',
      beats: [
        { phase: 'Launch', lap: 'Lap 1 / 57', clock: 'Lights out', order: ['ANT', 'VER', 'LEC', 'NOR', 'PIA'], feed: ['Antonelli leads into Turn 1.', 'Verstappen stays glued on the opening run.'] },
        { phase: 'Safety Car', lap: 'Lap 41 / 57', clock: '01:05:08', order: ['ANT', 'NOR', 'PIA', 'LEC', 'VER'], feed: ['The field compresses under Safety Car.', 'Antonelli wins the restart rhythm into Turn 1.'] },
        { phase: 'Finish', lap: 'Chequered flag', clock: '01:28:41', order: ['ANT', 'NOR', 'PIA', 'LEC', 'VER'], feed: ['Antonelli wins in Miami.', 'McLaren pressure shapes the final stint.'] }
      ]
    },
    'gilles-villeneuve': {
      title: 'Canadian GP replay',
      subtitle: 'Montreal slips into a strategic street fight.',
      beats: [
        { phase: 'Launch', lap: 'Lap 1 / 70', clock: 'Lights out', order: ['RUS', 'ANT', 'HAM', 'VER', 'LEC'], feed: ['Russell launches from pole.', 'Antonelli stays tight into Virage Senna.'] },
        { phase: 'Pit phase', lap: 'Lap 32 / 70', clock: '00:48:42', order: ['ANT', 'RUS', 'HAM', 'VER', 'LEC'], feed: ['Antonelli flips the order through the stop phase.', 'Montreal strategy swings on clean-air timing.'] },
        { phase: 'Finish', lap: 'Chequered flag', clock: '01:33:44', order: ['ANT', 'HAM', 'VER', 'RUS', 'LEC'], feed: ['Antonelli wins in Montreal.', 'Hamilton and Verstappen round out the podium.'] }
      ]
    }
  };

  function esc(value) {
    return String(value ?? '').replace(/[&<>]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[char]));
  }

  function mapState() {
    if (typeof bySlug !== 'undefined' && bySlug) return bySlug;
    if (window.bySlug) return window.bySlug;
    return {};
  }

  function tracksState() {
    if (typeof TRACKS !== 'undefined' && Array.isArray(TRACKS)) return TRACKS;
    if (Array.isArray(window.TRACKS)) return window.TRACKS;
    return [];
  }

  function metaState() {
    if (typeof appDataMeta !== 'undefined' && appDataMeta) return appDataMeta;
    if (window.appDataMeta) return window.appDataMeta;
    return {};
  }

  function seasonValue() {
    if (typeof SEASON !== 'undefined') return SEASON;
    if (window.SEASON) return window.SEASON;
    return '2026';
  }

  function currentSlug() {
    return (location.hash.replace(/^#\/?/, '') || '').trim();
  }

  function readCurrentTrack() {
    const map = mapState();
    const meta = metaState();
    const tracks = tracksState();
    return (meta.current_round_slug && map[meta.current_round_slug])
      || tracks.find((track) => track.status === 'active')
      || tracks.find((track) => track.report)
      || null;
  }

  function normalize(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function injectExtraStyle() {
    if (document.getElementById(EXTRA_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = EXTRA_STYLE_ID;
    style.textContent = `
      .pp-home-kicker{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap}
      .pp-home-meta{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
      .pp-home-box{border:1px solid var(--line);border-radius:18px;background:oklch(15% 0.018 264 /.62);padding:18px 18px 16px}
      .pp-home-box .crc-label{display:block}
      .pp-home-cta{display:flex;gap:10px;flex-wrap:wrap}
      .pp-button{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 16px;border-radius:999px;border:1px solid var(--line);background:oklch(18% 0.02 264 /.82);color:var(--text);text-decoration:none;font-family:"IBM Plex Mono",monospace;font-size:.72rem}
      .pp-button.primary{background:oklch(64% 0.2 145 /.16);border-color:oklch(64% 0.2 145 /.42);color:var(--done)}
      .pp-weekend-shell{display:grid;gap:18px}
      .pp-replay-rail{display:grid;gap:12px}
      .pp-empty-note{font-family:"IBM Plex Mono",monospace;color:var(--muted);font-size:.78rem;line-height:1.6}
      .pp-inline-link{display:inline-flex;align-items:center;gap:8px;color:var(--text);text-decoration:none;border-bottom:1px solid oklch(100% 0 0 /.14);padding-bottom:2px}
      .pp-inline-link:hover{border-color:var(--drs)}
      .pp-home-tag{font-family:"IBM Plex Mono",monospace;font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;color:var(--faint)}
      @media (max-width: 720px){.pp-home-meta{grid-template-columns:1fr}.pp-home-box{padding:16px}.pp-home-cta{display:grid;grid-template-columns:1fr}.pp-button{width:100%}}
    `;
    document.head.appendChild(style);
  }

  function ensureFooterLabel() {
    const foot = document.getElementById('foot-meta');
    if (!foot) return;
    const current = foot.textContent || '';
    const next = current.replace(/F1 Racetracks\s+[^·]+/, `F1 Racetracks ${BUILD_LABEL}`);
    foot.textContent = next === current ? `F1 Racetracks ${BUILD_LABEL}${current ? ` · ${current}` : ''}` : next;
  }

  function wrapFooterUpdater() {
    const original = window.updateFooterMeta;
    if (typeof original !== 'function' || original.__ppWrapped) {
      ensureFooterLabel();
      return;
    }
    function wrapped(target) {
      original(target);
      ensureFooterLabel();
    }
    wrapped.__ppWrapped = true;
    window.updateFooterMeta = wrapped;
    ensureFooterLabel();
  }

  function buildSchedule(track) {
    if (SCHEDULE_SEEDS[track.slug]) return SCHEDULE_SEEDS[track.slug];
    const raw = Array.isArray(track.sessions) ? track.sessions : [];
    if (!raw.length) return [];
    return raw.map((entry) => {
      const [dayLabelRaw, bodyRaw] = String(entry.sess || '').split('·');
      const dayLabel = (dayLabelRaw || 'Weekend').trim();
      const body = (bodyRaw || 'Session').trim();
      const pieces = body.split('+').map((item) => item.trim()).filter(Boolean);
      return {
        day: dayLabel,
        date: entry.date,
        items: pieces.map((label) => ({
          series: 'F1',
          label,
          range: 'Time TBC',
          status: track.status === 'done' ? 'done' : track.status === 'active' ? 'live' : 'upcoming'
        }))
      };
    });
  }

  function summarizeSchedule(track) {
    const groups = buildSchedule(track);
    const flat = groups.flatMap((group) => group.items);
    const liveNow = flat.find((item) => item.status === 'live');
    const nextUp = flat.find((item) => item.status === 'upcoming');
    return {
      liveNow: liveNow ? liveNow.label : (track.status === 'active' ? 'Race weekend active' : 'No live session'),
      nextUp: nextUp ? nextUp.label : (track.status === 'done' ? 'Weekend complete' : 'More sessions to come')
    };
  }

  function renderHomeCard(track) {
    const summary = summarizeSchedule(track);
    return `
      <section class="current-round-card" id="${HOME_ID}">
        <div class="pp-home-kicker">
          <div>
            <div class="pp-home-tag">Current round</div>
            <h2>${esc(track.gp)}</h2>
          </div>
          <div class="crc-badge crc-badge-${esc(track.status || 'active')}">${esc(track.status || 'active')}</div>
        </div>
        <p class="crc-copy">This is the main race-weekend launch pad now — one tap into the live circuit page, one glance for the weekend pulse.</p>
        <div class="pp-home-meta">
          <div class="pp-home-box"><span class="crc-label">Circuit</span><div class="crc-value">${esc(track.title)}</div></div>
          <div class="pp-home-box"><span class="crc-label">Live now</span><div class="crc-value">${esc(summary.liveNow)}</div></div>
          <div class="pp-home-box"><span class="crc-label">Next up</span><div class="crc-value">${esc(summary.nextUp)}</div></div>
        </div>
        <div class="pp-home-cta">
          <a class="pp-button primary" href="#/${esc(track.slug)}">Open Weekend Center →</a>
          <a class="pp-button" href="./live-tracker.html">Open live tracker</a>
        </div>
      </section>
    `;
  }

  function renderScheduleTab(track) {
    const groups = buildSchedule(track);
    if (!groups.length) {
      return `<div class="pp-empty-note">Weekend schedule data is still thin for this round, but the shell is now in place for the richer per-session feed.</div>`;
    }
    const summary = summarizeSchedule(track);
    return `
      <div class="wc-body-grid">
        <div class="wc-main">
          ${groups.map((group) => `
            <section class="wc-day-block">
              <div class="wc-day-head"><strong>${esc(group.day)}</strong><span>${esc(group.date)}</span></div>
              <div class="wc-day-list">
                ${group.items.map((item) => `
                  <div class="wc-session-row">
                    <div class="wc-session-left">
                      <span class="wc-series wc-series-f1">${esc(item.series)}</span>
                      <span class="wc-session-name">${esc(item.label)}</span>
                    </div>
                    <div class="wc-session-right">
                      <span class="wc-session-time">${esc(item.range)}</span>
                      <span class="wc-status wc-status-${esc(item.status)}">${esc(item.status)}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>
          `).join('')}
        </div>
        <aside class="wc-rail">
          <div class="wc-rail-card"><div class="wc-rail-label">Live now</div><div class="wc-rail-value">${esc(summary.liveNow)}</div></div>
          <div class="wc-rail-card"><div class="wc-rail-label">Next up</div><div class="wc-rail-value">${esc(summary.nextUp)}</div></div>
          <div class="wc-rail-card"><div class="wc-rail-label">Mode</div><div class="wc-rail-copy">This is the calendar layer — fast, glanceable, and built to keep the live race page feeling current.</div></div>
        </aside>
      </div>
    `;
  }

  function replayState(slug) {
    if (!viewState[slug]) viewState[slug] = { mode: 'schedule', beat: 0, speed: 1 };
    return viewState[slug];
  }

  function clearReplay(slug) {
    if (replayTimers[slug]) {
      window.clearInterval(replayTimers[slug]);
      delete replayTimers[slug];
    }
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
            <ol class="wc-order-list">${beat.order.map((entry, index) => `<li><span class="wc-order-pos">${index + 1}.</span><span>${esc(entry)}</span></li>`).join('')}</ol>
          </section>
          <aside class="pp-replay-rail">
            <div class="wc-rail-card"><div class="wc-rail-label">Key moments</div><div class="wc-feed">${beat.feed.map((item) => `<div class="wc-feed-item">${esc(item)}</div>`).join('')}</div></div>
            <div class="wc-rail-card"><div class="wc-rail-label">Why it hits</div><div class="wc-rail-copy">Replay is not fake telemetry. It is the sharp editorial retelling layer — fast, tactile, and good enough to actually revisit a finished weekend.</div></div>
          </aside>
        </div>
      </div>
    `;
  }

  function latestByDriver(rows) {
    const map = new Map();
    for (const row of rows || []) {
      const key = row.driver_number;
      if (!map.has(key) || String(row.date || '') > String(map.get(key).date || '')) map.set(key, row);
    }
    return map;
  }

  function classifySession(session) {
    const now = Date.now();
    const start = session?.date_start ? new Date(session.date_start).getTime() : null;
    const end = session?.date_end ? new Date(session.date_end).getTime() : null;
    if (!session || !start) return 'awaiting';
    if (start > now) return 'awaiting';
    if (!end || end >= now) return 'live';
    return (now - end) / 36e5 <= 48 ? 'replay' : 'awaiting';
  }

  function matchLiveCircuitSlug(session) {
    const haystack = [session?.circuit_short_name, session?.meeting_name, session?.country_name].map(normalize).join(' ');
    return Object.keys(LIVE_CIRCUIT_ALIASES).find((slug) => LIVE_CIRCUIT_ALIASES[slug].some((alias) => haystack.includes(normalize(alias)))) || null;
  }

  async function fetchJson(url) {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Feed unavailable`);
    return response.json();
  }

  function liveInterval(intervalRow, position) {
    if (position === 1) return 'Leader';
    if (!intervalRow) return '—';
    if (typeof intervalRow.interval === 'string') return intervalRow.interval;
    if (typeof intervalRow.interval === 'number') return `+${intervalRow.interval.toFixed(3)}`;
    if (typeof intervalRow.gap_to_leader === 'number') return `+${intervalRow.gap_to_leader.toFixed(3)}`;
    return intervalRow.gap_to_leader || '—';
  }

  async function hydrateLive(track) {
    const shell = document.getElementById('pp-live-shell');
    if (!shell) return;
    shell.innerHTML = `<div class="pp-empty-note">Checking OpenF1 for the current ${esc(track.gp)} session…</div>`;
    try {
      const sessions = await fetchJson('https://api.openf1.org/v1/sessions?meeting_key=latest');
      const matching = (sessions || []).filter((session) => matchLiveCircuitSlug(session) === track.slug);
      if (!matching.length) {
        shell.innerHTML = `<div class="pp-empty-note">No matching OpenF1 session is published right now. Use the live tracker companion for the broader view.</div>`;
        return;
      }
      const now = Date.now();
      const chosen = matching.find((session) => {
        const start = new Date(session.date_start).getTime();
        const end = new Date(session.date_end).getTime();
        return start <= now && end >= now;
      }) || matching[0];
      const state = classifySession(chosen);
      const [drivers, positions, intervals, control] = await Promise.all([
        fetchJson(`https://api.openf1.org/v1/drivers?session_key=${chosen.session_key}`),
        fetchJson(`https://api.openf1.org/v1/position?session_key=${chosen.session_key}`),
        fetchJson(`https://api.openf1.org/v1/intervals?session_key=${chosen.session_key}`),
        fetchJson(`https://api.openf1.org/v1/race_control?session_key=${chosen.session_key}`)
      ]);
      const driverByNumber = new Map((drivers || []).map((driver) => [driver.driver_number, driver]));
      const latestPositions = Array.from(latestByDriver(positions).values()).sort((a, b) => (a.position || 999) - (b.position || 999)).slice(0, 6);
      const latestIntervals = latestByDriver(intervals);
      const recentMessages = (control || []).slice().sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)).slice(0, 4);
      shell.innerHTML = `
        <div class="live-session-card">
          <div class="live-session-shell">
            <div class="live-session-head">
              <div>
                <div class="tag">Live mode</div>
                <h2>${esc(chosen.session_name)} · ${esc(chosen.circuit_short_name || track.title)}</h2>
              </div>
              <div class="live-state-badge ${state}">${esc(state)}</div>
            </div>
            <p class="live-session-copy">This is the pulse layer: current session state, top order, and race control without leaving the circuit page.</p>
            <div class="live-session-meta">
              <span>Start · ${esc(new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(chosen.date_start)))}</span>
              <span>End · ${esc(new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(chosen.date_end)))}</span>
            </div>
            <div class="live-panel-grid">
              <div class="live-subpanel">
                <h3>Running order</h3>
                ${latestPositions.length ? `
                  <table class="live-table">
                    <thead><tr><th>Pos</th><th>Driver</th><th>Team</th><th>Gap</th></tr></thead>
                    <tbody>
                      ${latestPositions.map((row) => {
                        const driver = driverByNumber.get(row.driver_number) || {};
                        const teamColour = `#${driver.team_colour || '7d8593'}`;
                        return `
                          <tr>
                            <td>P${row.position}</td>
                            <td class="live-driver"><span class="live-teambar" style="background:${teamColour}"></span><strong>${esc(driver.name_acronym || row.driver_number)}</strong></td>
                            <td>${esc(driver.team_name || 'Unknown')}</td>
                            <td>${esc(liveInterval(latestIntervals.get(row.driver_number), row.position))}</td>
                          </tr>
                        `;
                      }).join('')}
                    </tbody>
                  </table>` : `<div class="live-empty">Timing rows are not available yet.</div>`}
              </div>
              <div class="live-subpanel">
                <h3>Race control</h3>
                ${recentMessages.length ? `<div class="live-feed">${recentMessages.map((message) => `<div class="live-feed-item"><div class="live-feed-top"><span class="live-chip ${String(message.category || '').toLowerCase().includes('flag') ? 'flag' : String(message.category || '').toLowerCase().includes('safety') ? 'safety' : 'other'}">${esc(message.category || 'update')}</span>${message.lap_number ? `<span class="live-chip other">Lap ${message.lap_number}</span>` : ''}</div><div>${esc(message.message || 'No message text provided.')}</div></div>`).join('')}</div>` : `<div class="live-empty">No recent control messages are available.</div>`}
              </div>
            </div>
            <a class="live-panel-link" href="./live-tracker.html">Open the full live tracker companion →</a>
          </div>
        </div>
      `;
    } catch (error) {
      shell.innerHTML = `<div class="pp-empty-note">Live data feed is temporarily unavailable. The live tracker companion is still the fallback surface.</div>`;
    }
  }

  function renderLiveTab(track) {
    return `<div id="pp-live-shell" class="pp-weekend-shell"><div class="pp-empty-note">Loading live session context for ${esc(track.gp)}…</div></div>`;
  }

  function desiredMode(track) {
    const state = replayState(track.slug);
    if (state.mode) return state.mode;
    if (track.status === 'active') return 'live';
    if (track.status === 'done' && REPLAY_DATA[track.slug]) return 'replay';
    return 'schedule';
  }

  function renderWeekendCenter(track) {
    const state = replayState(track.slug);
    state.mode = desiredMode(track);
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
            <button class="wc-tab${state.mode === 'live' ? ' is-active' : ''}" data-mode="live">Live</button>
            <button class="wc-tab${state.mode === 'replay' ? ' is-active' : ''}" data-mode="replay" ${REPLAY_DATA[track.slug] ? '' : 'disabled'}>Replay</button>
          </div>
        </div>
        ${body}
      </section>
    `;
  }

  function mountHomeCard() {
    const hero = document.querySelector('.home-h');
    if (!hero) return;
    const track = readCurrentTrack();
    if (!track) return;
    const existing = document.getElementById(HOME_ID);
    if (existing) existing.remove();
    hero.insertAdjacentHTML('afterend', renderHomeCard(track));
  }

  function mountWeekendCenter() {
    const slug = currentSlug();
    const track = mapState()[slug];
    const meta = document.querySelector('.meta');
    if (!track || !track.report || !meta) return;
    const existing = document.getElementById(CENTER_ID);
    if (existing) existing.remove();
    meta.insertAdjacentHTML('afterend', renderWeekendCenter(track));
    bindWeekendCenter(track);
    if (desiredMode(track) === 'live') hydrateLive(track);
  }

  function bindWeekendCenter(track) {
    const center = document.getElementById(CENTER_ID);
    if (!center) return;
    center.addEventListener('click', (event) => {
      const tab = event.target.closest('[data-mode]');
      if (tab && !tab.hasAttribute('disabled')) {
        clearReplay(track.slug);
        replayState(track.slug).mode = tab.dataset.mode;
        mountWeekendCenter();
        return;
      }
      const action = event.target.closest('[data-action]');
      if (!action) return;
      const replay = REPLAY_DATA[track.slug];
      const state = replayState(track.slug);
      if (!replay) return;
      if (action.dataset.action === 'prev') {
        clearReplay(track.slug);
        state.beat = Math.max(0, state.beat - 1);
      } else if (action.dataset.action === 'next') {
        clearReplay(track.slug);
        state.beat = Math.min(replay.beats.length - 1, state.beat + 1);
      } else if (action.dataset.action === 'play') {
        clearReplay(track.slug);
        replayTimers[track.slug] = window.setInterval(() => {
          const liveState = replayState(track.slug);
          liveState.beat = (liveState.beat + 1) % replay.beats.length;
          mountWeekendCenter();
        }, Math.max(700, 1800 / replayState(track.slug).speed));
        return;
      } else if (action.dataset.action === 'pause') {
        clearReplay(track.slug);
      }
      mountWeekendCenter();
    });
    center.addEventListener('input', (event) => {
      if (!event.target.matches('.wc-scrubber')) return;
      clearReplay(track.slug);
      replayState(track.slug).beat = Number(event.target.value || 0);
      mountWeekendCenter();
    });
    center.addEventListener('change', (event) => {
      const speed = event.target.closest('[data-speed]');
      if (!speed) return;
      clearReplay(track.slug);
      replayState(track.slug).speed = Number(speed.dataset.speed || 1);
      mountWeekendCenter();
    });
  }

  function renderCurrentView() {
    injectExtraStyle();
    wrapFooterUpdater();
    if (currentSlug()) {
      mountWeekendCenter();
      return;
    }
    mountHomeCard();
  }

  window.addEventListener('hashchange', () => window.setTimeout(renderCurrentView, 40));
  window.addEventListener('load', () => window.setTimeout(renderCurrentView, 120));

  const appRoot = document.getElementById('app');
  if (appRoot && 'MutationObserver' in window) {
    const observer = new MutationObserver(() => window.setTimeout(renderCurrentView, 0));
    observer.observe(appRoot, { childList: true });
  }

  window.setTimeout(renderCurrentView, 180);
})();
