/* Polished late-mount app layer for the full F1 Racetracks experience.
   Uses lexical runtime state when available and upgrades the home + track weekend surfaces.
*/

(function () {
  const BUILD_LABEL = 'V1.7a';
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
    return String(value ?? '').replace(/[&<>]/g, function (char) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[char]; });
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

  function currentSlug() {
    return (location.hash.replace(/^#\/?/, '') || '').trim();
  }

  function readCurrentTrack() {
    var map = mapState();
    var meta = metaState();
    var tracks = tracksState();
    return (meta.current_round_slug && map[meta.current_round_slug])
      || tracks.find(function (track) { return track.status === 'active'; })
      || tracks.find(function (track) { return track.report; })
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

  function localTime(dateString) {
    return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(dateString));
  }

  function localDay(dateString) {
    return new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(dateString));
  }

  function sessionStatus(start, end) {
    var now = Date.now();
    var startMs = new Date(start).getTime();
    var endMs = new Date(end).getTime();
    if (now >= endMs) return 'done';
    if (now >= startMs && now < endMs) return 'live';
    return 'upcoming';
  }

  function injectExtraStyle() {
    if (document.getElementById(EXTRA_STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = EXTRA_STYLE_ID;
    style.textContent = `
      .current-round-card{margin:18px 0 0;padding:18px 18px 16px;border-radius:20px}
      .pp-home-kicker{display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap}
      .pp-home-tag,.pp-local-note,.pp-session-group-label{font-family:"IBM Plex Mono",monospace;font-size:.64rem;letter-spacing:.1em;text-transform:uppercase;color:var(--faint)}
      .pp-home-flag{display:inline-flex;align-items:center;gap:6px;color:var(--done);font-family:"IBM Plex Mono",monospace;font-size:.68rem}
      .pp-home-flag::before{content:"";width:8px;height:8px;border-radius:999px;background:var(--done)}
      .pp-home-title{display:grid;gap:4px}
      .pp-home-title h2{font-size:1.45rem;font-weight:700;letter-spacing:-.02em;line-height:1.05;margin:0}
      .pp-home-sub{color:var(--muted);font-size:.9rem;line-height:1.45}
      .pp-home-summary{color:var(--text);font-size:.95rem;line-height:1.5;font-weight:500}
      .pp-home-cta{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:4px}
      .pp-button{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 14px;border-radius:999px;border:1px solid var(--line);background:oklch(18% 0.02 264 /.82);color:var(--text);text-decoration:none;font-family:"IBM Plex Mono",monospace;font-size:.72rem}
      .pp-button.primary{background:oklch(64% 0.2 145 /.16);border-color:oklch(64% 0.2 145 /.42);color:var(--done)}
      .weekend-center{margin-top:18px}
      .pp-local-note{display:block;margin:4px 0 14px}
      .pp-schedule-list{display:grid;gap:16px}
      .pp-session-group{display:grid;gap:6px}
      .pp-session-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;padding:12px 0;border-top:1px solid oklch(32% 0.02 264 /.45)}
      .pp-session-row:first-child{border-top:none}
      .pp-session-name{font-size:1rem;line-height:1.35;color:var(--text)}
      .pp-session-time{font-family:"IBM Plex Mono",monospace;font-size:.92rem;color:var(--muted);white-space:nowrap}
      .pp-session-row.is-done{opacity:.52}
      .pp-session-row.is-live{padding-left:12px;border-left:2px solid var(--done);background:linear-gradient(90deg,oklch(64% 0.2 145 /.08),transparent 55%);border-top-color:transparent}
      .pp-session-row.is-live .pp-session-name{font-weight:700}
      .pp-session-row.is-live .pp-session-time{color:var(--text);font-weight:600}
      .pp-session-row.is-upcoming .pp-session-name{font-weight:600}
      .pp-session-row.is-upcoming .pp-session-time{color:var(--text);background:oklch(80% 0.16 85 /.12);border:1px solid oklch(80% 0.16 85 /.2);padding:5px 8px;border-radius:999px}
      .pp-schedule-summary{font-size:.96rem;color:var(--text);line-height:1.5;margin-bottom:8px}
      .pp-weekend-shell{display:grid;gap:18px}
      .pp-replay-rail{display:grid;gap:12px}
      .pp-empty-note{font-family:"IBM Plex Mono",monospace;color:var(--muted);font-size:.78rem;line-height:1.6}
      @media (max-width:720px){
        .current-round-card{padding:16px 16px 14px}
        .pp-home-title h2{font-size:1.28rem}
        .pp-home-cta{display:grid;grid-template-columns:1fr;width:100%}
        .pp-button{width:100%}
        .pp-session-row{grid-template-columns:minmax(0,1fr)}
        .pp-session-time{justify-self:start}
      }
    `;
    document.head.appendChild(style);
  }

  function ensureFooterLabel() {
    var foot = document.getElementById('foot-meta');
    if (!foot) return;
    var current = foot.textContent || '';
    var next = current.replace(/F1 Racetracks\s+[^·]+/, 'F1 Racetracks ' + BUILD_LABEL);
    foot.textContent = next === current ? ('F1 Racetracks ' + BUILD_LABEL + (current ? ' · ' + current : '')) : next;
  }

  function wrapFooterUpdater() {
    var original = window.updateFooterMeta;
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
    if (SCHEDULE_SEEDS[track.slug]) {
      return SCHEDULE_SEEDS[track.slug].map(function (group) {
        return {
          label: localDay(group.items[0].start),
          items: group.items.map(function (item) {
            return {
              series: item.series,
              label: item.label,
              range: localTime(item.start) + '–' + localTime(item.end),
              status: sessionStatus(item.start, item.end),
              start: item.start,
              end: item.end
            };
          })
        };
      });
    }

    var raw = Array.isArray(track.sessions) ? track.sessions : [];
    return raw.map(function (entry) {
      var parts = String(entry.sess || '').split('·').map(function (item) { return item.trim(); }).filter(Boolean);
      return {
        label: entry.date,
        items: [{
          series: 'F1',
          label: parts[parts.length - 1] || 'Weekend session',
          range: 'Time TBC',
          status: track.status === 'done' ? 'done' : track.status === 'active' ? 'live' : 'upcoming'
        }]
      };
    });
  }

  function scheduleSummary(track) {
    var flat = buildSchedule(track).flatMap(function (group) { return group.items; });
    return {
      liveNow: flat.find(function (item) { return item.status === 'live'; }) || null,
      nextUp: flat.find(function (item) { return item.status === 'upcoming'; }) || null,
      grandPrix: flat.find(function (item) { return /Grand Prix/i.test(item.label); }) || null
    };
  }

  function homeSummaryText(track) {
    var summary = scheduleSummary(track);
    var bits = [];
    if (summary.liveNow) bits.push(summary.liveNow.label + ' ' + summary.liveNow.range + ' now');
    if (summary.nextUp) bits.push(summary.nextUp.label + ' ' + summary.nextUp.range);
    if (summary.grandPrix && summary.grandPrix !== summary.nextUp) bits.push('Grand Prix ' + summary.grandPrix.range);
    return bits.join(' • ');
  }

  function renderHomeCard(track) {
    return `
      <section class="current-round-card" id="${HOME_ID}">
        <div class="pp-home-kicker">
          <span class="pp-home-tag">Current round</span>
          <span class="pp-home-flag">${track.status === 'active' ? 'Live' : 'Focus'}</span>
        </div>
        <div class="pp-home-title">
          <h2>${esc(track.gp)}</h2>
          <div class="pp-home-sub">${esc(track.title)}</div>
        </div>
        <div class="pp-home-summary">${esc(homeSummaryText(track))}</div>
        <div class="pp-home-cta">
          <a class="pp-button primary" href="#/${esc(track.slug)}">Open Weekend Center →</a>
          <a class="pp-button" href="./live-tracker.html">Live tracker</a>
        </div>
      </section>
    `;
  }

  function renderScheduleTab(track) {
    var groups = buildSchedule(track);
    var summary = scheduleSummary(track);
    var lead = summary.liveNow
      ? (summary.liveNow.label + ' ' + summary.liveNow.range + ' now')
      : summary.nextUp
        ? (summary.nextUp.label + ' ' + summary.nextUp.range + ' next')
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
                ${group.items.map(function (item) {
                  var label = item.series && item.series !== 'F1' ? (item.series + ' · ' + item.label) : item.label;
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
    var replay = REPLAY_DATA[track.slug];
    if (!replay) return `<div class="pp-empty-note">Replay mode is queued for this round, but the editorial beat map is not seeded yet.</div>`;
    var state = replayState(track.slug);
    var beat = replay.beats[state.beat] || replay.beats[0];
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

  function latestByDriver(rows) {
    var map = new Map();
    (rows || []).forEach(function (row) {
      var key = row.driver_number;
      if (!map.has(key) || String(row.date || '') > String(map.get(key).date || '')) map.set(key, row);
    });
    return map;
  }

  function classifySession(session) {
    var now = Date.now();
    var start = session && session.date_start ? new Date(session.date_start).getTime() : null;
    var end = session && session.date_end ? new Date(session.date_end).getTime() : null;
    if (!session || !start) return 'awaiting';
    if (start > now) return 'awaiting';
    if (!end || end >= now) return 'live';
    return (now - end) / 36e5 <= 48 ? 'replay' : 'awaiting';
  }

  function matchLiveCircuitSlug(session) {
    var haystack = [session && session.circuit_short_name, session && session.meeting_name, session && session.country_name].map(normalize).join(' ');
    return Object.keys(LIVE_CIRCUIT_ALIASES).find(function (slug) {
      return LIVE_CIRCUIT_ALIASES[slug].some(function (alias) { return haystack.includes(normalize(alias)); });
    }) || null;
  }

  function fetchJson(url) {
    return fetch(url, { cache: 'no-store' }).then(function (response) {
      if (!response.ok) throw new Error('Feed unavailable');
      return response.json();
    });
  }

  function liveInterval(intervalRow, position) {
    if (position === 1) return 'Leader';
    if (!intervalRow) return '—';
    if (typeof intervalRow.interval === 'string') return intervalRow.interval;
    if (typeof intervalRow.interval === 'number') return '+' + intervalRow.interval.toFixed(3);
    if (typeof intervalRow.gap_to_leader === 'number') return '+' + intervalRow.gap_to_leader.toFixed(3);
    return intervalRow.gap_to_leader || '—';
  }

  function renderLiveTab(track) {
    return `<div id="pp-live-shell" class="pp-weekend-shell"><div class="pp-empty-note">Loading live session context for ${esc(track.gp)}…</div></div>`;
  }

  function hydrateLive(track) {
    var shell = document.getElementById('pp-live-shell');
    if (!shell) return;
    shell.innerHTML = `<div class="pp-empty-note">Checking OpenF1 for the current ${esc(track.gp)} session…</div>`;
    fetchJson('https://api.openf1.org/v1/sessions?meeting_key=latest').then(function (sessions) {
      var matching = (sessions || []).filter(function (session) { return matchLiveCircuitSlug(session) === track.slug; });
      if (!matching.length) {
        shell.innerHTML = `<div class="pp-empty-note">No matching OpenF1 session is published right now. Use the live tracker companion for the broader view.</div>`;
        return;
      }
      var now = Date.now();
      var chosen = matching.find(function (session) {
        var start = new Date(session.date_start).getTime();
        var end = new Date(session.date_end).getTime();
        return start <= now && end >= now;
      }) || matching[0];
      var state = classifySession(chosen);
      Promise.all([
        fetchJson('https://api.openf1.org/v1/drivers?session_key=' + chosen.session_key),
        fetchJson('https://api.openf1.org/v1/position?session_key=' + chosen.session_key),
        fetchJson('https://api.openf1.org/v1/intervals?session_key=' + chosen.session_key),
        fetchJson('https://api.openf1.org/v1/race_control?session_key=' + chosen.session_key)
      ]).then(function (results) {
        var drivers = results[0] || [];
        var positions = results[1] || [];
        var intervals = results[2] || [];
        var control = results[3] || [];
        var driverByNumber = new Map((drivers || []).map(function (driver) { return [driver.driver_number, driver]; }));
        var latestPositions = Array.from(latestByDriver(positions).values()).sort(function (a, b) { return (a.position || 999) - (b.position || 999); }).slice(0, 6);
        var latestIntervals = latestByDriver(intervals);
        var recentMessages = (control || []).slice().sort(function (a, b) { return new Date(b.date || 0) - new Date(a.date || 0); }).slice(0, 4);
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
                <span>Start · ${esc(new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(chosen.date_start)))}</span>
                <span>End · ${esc(new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(chosen.date_end)))}</span>
              </div>
              <div class="live-panel-grid">
                <div class="live-subpanel">
                  <h3>Running order</h3>
                  ${latestPositions.length ? `
                    <table class="live-table">
                      <thead><tr><th>Pos</th><th>Driver</th><th>Team</th><th>Gap</th></tr></thead>
                      <tbody>
                        ${latestPositions.map(function (row) {
                          var driver = driverByNumber.get(row.driver_number) || {};
                          var teamColour = '#' + (driver.team_colour || '7d8593');
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
                  ${recentMessages.length ? `<div class="live-feed">${recentMessages.map(function (message) {
                    var category = String(message.category || '').toLowerCase();
                    var klass = category.includes('flag') ? 'flag' : category.includes('safety') ? 'safety' : 'other';
                    return `<div class="live-feed-item"><div class="live-feed-top"><span class="live-chip ${klass}">${esc(message.category || 'update')}</span>${message.lap_number ? `<span class="live-chip other">Lap ${message.lap_number}</span>` : ''}</div><div>${esc(message.message || 'No message text provided.')}</div></div>`;
                  }).join('')}</div>` : `<div class="live-empty">No recent control messages are available.</div>`}
                </div>
              </div>
              <a class="live-panel-link" href="./live-tracker.html">Open the full live tracker companion →</a>
            </div>
          </div>
        `;
      });
    }).catch(function () {
      shell.innerHTML = `<div class="pp-empty-note">Live data feed is temporarily unavailable. The live tracker companion is still the fallback surface.</div>`;
    });
  }

  function desiredMode(track) {
    var state = replayState(track.slug);
    if (state.mode) return state.mode;
    if (track.status === 'active') return 'live';
    if (track.status === 'done' && REPLAY_DATA[track.slug]) return 'replay';
    return 'schedule';
  }

  function renderWeekendCenter(track) {
    var state = replayState(track.slug);
    state.mode = desiredMode(track);
    var liveEnabled = track.slug === (readCurrentTrack() || {}).slug || track.status === 'active';
    var body = state.mode === 'live' ? renderLiveTab(track) : state.mode === 'replay' ? renderReplayTab(track) : renderScheduleTab(track);
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

  function mountHomeCard() {
    var hero = document.querySelector('.home-h');
    if (!hero) return;
    var track = readCurrentTrack();
    if (!track) return;
    var existing = document.getElementById(HOME_ID);
    if (existing) existing.remove();
    hero.insertAdjacentHTML('afterend', renderHomeCard(track));
  }

  function bindWeekendCenter(track) {
    var center = document.getElementById(CENTER_ID);
    if (!center) return;
    center.addEventListener('click', function (event) {
      var tab = event.target.closest('[data-mode]');
      if (tab && !tab.hasAttribute('disabled')) {
        clearReplay(track.slug);
        replayState(track.slug).mode = tab.dataset.mode;
        mountWeekendCenter();
        return;
      }
      var action = event.target.closest('[data-action]');
      if (!action) return;
      var replay = REPLAY_DATA[track.slug];
      var state = replayState(track.slug);
      if (!replay) return;
      if (action.dataset.action === 'prev') {
        clearReplay(track.slug);
        state.beat = Math.max(0, state.beat - 1);
      } else if (action.dataset.action === 'next') {
        clearReplay(track.slug);
        state.beat = Math.min(replay.beats.length - 1, state.beat + 1);
      } else if (action.dataset.action === 'play') {
        clearReplay(track.slug);
        replayTimers[track.slug] = window.setInterval(function () {
          var liveState = replayState(track.slug);
          liveState.beat = (liveState.beat + 1) % replay.beats.length;
          mountWeekendCenter();
        }, Math.max(700, 1800 / replayState(track.slug).speed));
        return;
      } else if (action.dataset.action === 'pause') {
        clearReplay(track.slug);
      }
      mountWeekendCenter();
    });
    center.addEventListener('input', function (event) {
      if (!event.target.matches('.wc-scrubber')) return;
      clearReplay(track.slug);
      replayState(track.slug).beat = Number(event.target.value || 0);
      mountWeekendCenter();
    });
    center.addEventListener('change', function (event) {
      var speed = event.target.closest('[data-speed]');
      if (!speed) return;
      clearReplay(track.slug);
      replayState(track.slug).speed = Number(speed.dataset.speed || 1);
      mountWeekendCenter();
    });
  }

  function mountWeekendCenter() {
    var slug = currentSlug();
    var track = mapState()[slug];
    var meta = document.querySelector('.meta');
    if (!track || !track.report || !meta) return;
    var existing = document.getElementById(CENTER_ID);
    if (existing) existing.remove();
    meta.insertAdjacentHTML('afterend', renderWeekendCenter(track));
    bindWeekendCenter(track);
    if (desiredMode(track) === 'live') hydrateLive(track);
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

  window.addEventListener('hashchange', function () {
    window.setTimeout(renderCurrentView, 40);
  });
  window.addEventListener('load', function () {
    window.setTimeout(renderCurrentView, 120);
  });

  var appRoot = document.getElementById('app');
  if (appRoot && 'MutationObserver' in window) {
    var observer = new MutationObserver(function () { window.setTimeout(renderCurrentView, 0); });
    observer.observe(appRoot, { childList: true });
  }

  window.setTimeout(renderCurrentView, 180);
})();
