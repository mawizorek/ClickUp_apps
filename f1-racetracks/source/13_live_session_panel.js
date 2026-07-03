/* Main-app OpenF1 live panel for matching circuit pages. */

const LIVE_REFRESH_MS = 20000;
let livePanelTimer = null;

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

function teardownLivePanel() {
  if (livePanelTimer) {
    window.clearInterval(livePanelTimer);
    livePanelTimer = null;
  }
}

function liveNormalize(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function classifyLiveSessionState(session) {
  const now = Date.now();
  const start = session?.date_start ? new Date(session.date_start).getTime() : null;
  const end = session?.date_end ? new Date(session.date_end).getTime() : null;
  if (!session || !start) return 'idle';
  if (start > now) return 'awaiting';
  if (!end || end >= now) return 'live';
  const hoursSinceEnd = (now - end) / 36e5;
  return hoursSinceEnd <= 48 ? 'replay' : 'idle';
}

function matchLiveCircuitSlug(session) {
  const haystack = [session?.circuit_short_name, session?.meeting_name, session?.country_name].map(liveNormalize).join(' ');
  for (const [slug, aliases] of Object.entries(LIVE_CIRCUIT_ALIASES)) {
    if (aliases.some(alias => haystack.includes(liveNormalize(alias)))) return slug;
  }
  return null;
}

async function fetchLiveJson(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

function latestLiveByDriver(rows) {
  const map = new Map();
  for (const row of rows || []) {
    const key = row.driver_number;
    if (!map.has(key) || String(row.date || '') > String(map.get(key).date || '')) map.set(key, row);
  }
  return map;
}

function formatLiveInterval(interval, gapToLeader, position) {
  if (position === 1) return 'Leader';
  if (interval == null && gapToLeader == null) return '—';
  if (typeof interval === 'string') return interval;
  if (typeof interval === 'number') return `+${interval.toFixed(3)}`;
  if (typeof gapToLeader === 'number') return `+${gapToLeader.toFixed(3)}`;
  return gapToLeader || '—';
}

function liveBadgeMarkup(state) {
  return `<span class="live-state-badge ${state}">${state}</span>`;
}

function liveChipClass(category = '') {
  const value = String(category).toLowerCase();
  if (value.includes('flag')) return 'flag';
  if (value.includes('safety')) return 'safety';
  if (value.includes('session')) return 'session';
  return 'other';
}

function liveFormatLocal(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date);
}

function liveFormatShortTime(dateString) {
  if (!dateString) return '—';
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(dateString));
}

function renderLivePanelContent(track, session, state, positionsRows, controlRows, refreshedAt) {
  const meta = [
    `Meeting · ${session.meeting_name || '—'}`,
    `Start · ${liveFormatLocal(session.date_start)}`,
    `End · ${liveFormatLocal(session.date_end)}`,
    `Updated · ${liveFormatShortTime(refreshedAt)}`
  ];

  const stateCopy = {
    live: 'OpenF1 is carrying a live session for this circuit right now.',
    replay: 'This circuit has a recent session in the replay window, so the latest timing and control data stay visible here.',
    awaiting: 'A matching session is scheduled for this circuit but hasn’t started yet. This panel will wake up automatically once data begins to flow.'
  };

  const positionsMarkup = positionsRows.length ? `
    <table class="live-table">
      <thead><tr><th>Pos</th><th>Driver</th><th>Team</th><th>Interval</th></tr></thead>
      <tbody>
        ${positionsRows.map(row => `
          <tr>
            <td class="mono">P${row.position}</td>
            <td class="live-driver"><span class="live-teambar" style="background:${row.teamColour}"></span><strong>${row.acronym}</strong> <small>#${row.driverNumber}</small></td>
            <td class="muted">${row.team}</td>
            <td class="mono">${row.interval}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  ` : '<p class="live-empty">No live running-order rows are available yet for this session.</p>';

  const controlMarkup = controlRows.length ? `
    <div class="live-feed">
      ${controlRows.map(message => `
        <div class="live-feed-item">
          <div class="live-feed-top">
            <span class="live-chip ${liveChipClass(message.category)}">${message.category || 'update'}</span>
            ${message.flag ? `<span class="live-chip flag">${message.flag}</span>` : ''}
            ${message.lap_number ? `<span class="tag mono">Lap ${message.lap_number}</span>` : ''}
            <span class="tag mono">${liveFormatShortTime(message.date)}</span>
          </div>
          <div>${message.message || 'No message text provided.'}</div>
        </div>
      `).join('')}
    </div>
  ` : '<p class="live-empty">No recent race-control messages are available yet.</p>';

  return `
    <div class="live-session-shell">
      <div class="live-session-head">
        <div>
          <div class="tag">OpenF1 live session</div>
          <h2>${session.session_name || 'Latest session'} · ${session.circuit_short_name || session.meeting_name || 'Unknown circuit'}</h2>
        </div>
        ${liveBadgeMarkup(state)}
      </div>
      <p class="live-session-copy">${stateCopy[state] || ''}</p>
      <div class="live-session-meta">${meta.map(item => `<span>${item}</span>`).join('')}</div>
      <div class="live-panel-grid">
        <div class="live-subpanel">
          <h3>Running order</h3>
          ${positionsMarkup}
        </div>
        <div class="live-subpanel">
          <h3>Race control</h3>
          ${controlMarkup}
        </div>
      </div>
      <a class="live-panel-link" href="./live-tracker.html">Open the full live tracker companion →</a>
      <p class="live-panel-note">This is the first integrated live slice inside the main app. It stays narrow on purpose: status, positions, and race-control context for the currently viewed circuit.</p>
    </div>
  `;
}

async function refreshLivePanel(track) {
  const block = document.getElementById('live-session-block');
  const shell = document.getElementById('live-panel-shell');
  if (!block || !shell) return;

  try {
    const sessions = await fetchLiveJson('https://api.openf1.org/v1/sessions?session_key=latest');
    const session = Array.isArray(sessions) ? sessions[0] : null;
    const state = classifyLiveSessionState(session);
    const matchedSlug = matchLiveCircuitSlug(session);

    if (!session || matchedSlug !== track.slug || state === 'idle') {
      block.style.display = 'none';
      return;
    }

    block.style.display = '';

    let positionsRows = [];
    let controlRows = [];
    if (session.session_key) {
      const [drivers, positions, intervals, control] = await Promise.all([
        fetchLiveJson(`https://api.openf1.org/v1/drivers?session_key=${session.session_key}`),
        fetchLiveJson(`https://api.openf1.org/v1/position?session_key=${session.session_key}`),
        fetchLiveJson(`https://api.openf1.org/v1/intervals?session_key=${session.session_key}`),
        fetchLiveJson(`https://api.openf1.org/v1/race_control?session_key=${session.session_key}`)
      ]);

      const driverByNumber = new Map((drivers || []).map(driver => [driver.driver_number, driver]));
      const latestPositions = latestLiveByDriver(positions);
      const latestIntervals = latestLiveByDriver(intervals);
      positionsRows = Array.from(latestPositions.values())
        .sort((a, b) => (a.position || 999) - (b.position || 999))
        .slice(0, 5)
        .map(row => {
          const driver = driverByNumber.get(row.driver_number) || {};
          const interval = latestIntervals.get(row.driver_number) || {};
          return {
            position: row.position,
            driverNumber: row.driver_number,
            acronym: driver.name_acronym || driver.last_name || row.driver_number,
            team: driver.team_name || 'Unknown team',
            teamColour: `#${driver.team_colour || '7d8593'}`,
            interval: formatLiveInterval(interval.interval, interval.gap_to_leader, row.position)
          };
        });

      controlRows = (control || [])
        .slice()
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        .slice(0, 5);
    }

    shell.innerHTML = renderLivePanelContent(track, session, state, positionsRows, controlRows, new Date().toISOString());
  } catch (error) {
    block.style.display = '';
    shell.innerHTML = `<p class="live-empty">Live session data is temporarily unavailable. Open the <a class="live-panel-link" href="./live-tracker.html">live tracker companion</a> for the standalone view once OpenF1 responds again.</p>`;
    console.error('Live panel error', error);
  }
}

function initLivePanel(track) {
  const block = document.getElementById('live-session-block');
  const shell = document.getElementById('live-panel-shell');
  if (!block || !shell) return;

  teardownLivePanel();
  block.style.display = '';
  shell.innerHTML = '<p class="live-empty">Checking OpenF1 for a matching live session…</p>';

  refreshLivePanel(track);
  livePanelTimer = window.setInterval(() => refreshLivePanel(track), LIVE_REFRESH_MS);
}
