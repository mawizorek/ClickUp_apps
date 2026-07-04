/* Permanent live-mode loader for the weekend center.
   Keeps OpenF1 fetch + render logic out of the schedule/replay renderer.
 */

function hydrateWeekendLiveMode(track) {
  const shell = document.getElementById('pp-live-shell');
  if (!shell) return;

  shell.innerHTML = `<div class="pp-empty-note">Checking OpenF1 for the current ${esc(track.gp)} session…</div>`;

  fetchWeekendJson('https://api.openf1.org/v1/sessions?meeting_key=latest').then(function (sessions) {
    const matching = (sessions || []).filter(function (session) {
      return matchLiveCircuitSlug(session) === track.slug;
    });

    if (!matching.length) {
      shell.innerHTML = `<div class="pp-empty-note">No matching OpenF1 session is published right now. Use the live tracker companion for the broader view.</div>`;
      return;
    }

    const now = Date.now();
    const chosen = matching.find(function (session) {
      const start = new Date(session.date_start).getTime();
      const end = new Date(session.date_end).getTime();
      return start <= now && end >= now;
    }) || matching[0];

    const state = classifySessionState(chosen);

    return Promise.all([
      fetchWeekendJson('https://api.openf1.org/v1/drivers?session_key=' + chosen.session_key),
      fetchWeekendJson('https://api.openf1.org/v1/position?session_key=' + chosen.session_key),
      fetchWeekendJson('https://api.openf1.org/v1/intervals?session_key=' + chosen.session_key),
      fetchWeekendJson('https://api.openf1.org/v1/race_control?session_key=' + chosen.session_key)
    ]).then(function (results) {
      const drivers = results[0] || [];
      const positions = results[1] || [];
      const intervals = results[2] || [];
      const control = results[3] || [];
      const driverByNumber = new Map((drivers || []).map(function (driver) { return [driver.driver_number, driver]; }));
      const latestPositions = Array.from(latestByDriver(positions).values()).sort(function (a, b) {
        return (a.position || 999) - (b.position || 999);
      }).slice(0, 6);
      const latestIntervals = latestByDriver(intervals);
      const recentMessages = (control || []).slice().sort(function (a, b) {
        return new Date(b.date || 0) - new Date(a.date || 0);
      }).slice(0, 4);

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
                        const driver = driverByNumber.get(row.driver_number) || {};
                        const teamColour = '#' + (driver.team_colour || '7d8593');
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
                  const category = String(message.category || '').toLowerCase();
                  const klass = category.includes('flag') ? 'flag' : category.includes('safety') ? 'safety' : 'other';
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
