/* Compact polish pass for V1.7c.
   Syncs the home card with the race-page schedule language,
   fixes footer label repetition, hard-binds the home CTA,
   and tightens podium mobile typography.
*/

(function () {
  const BUILD_LABEL = 'V1.7d polish';
  const STYLE_ID = 'pp-v17d-polish-style';

  const SILVERSTONE_LOCAL_SEED = [
    { day: 'Fri', label: 'Sprint Qualifying', start: '2026-07-03T16:30:00+01:00', end: '2026-07-03T17:14:00+01:00' },
    { day: 'Sat', label: 'Sprint', start: '2026-07-04T12:00:00+01:00', end: '2026-07-04T13:00:00+01:00' },
    { day: 'Sat', label: 'Qualifying', start: '2026-07-04T16:00:00+01:00', end: '2026-07-04T17:00:00+01:00' },
    { day: 'Sun', label: 'Grand Prix', start: '2026-07-05T15:00:00+01:00', end: '2026-07-05T17:00:00+01:00' }
  ];

  function esc(value) {
    return String(value ?? '').replace(/[&<>]/g, function (char) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[char]; });
  }

  function localTime(dateString) {
    return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(dateString));
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

  function currentTrack() {
    const map = mapState();
    const meta = metaState();
    const tracks = tracksState();
    return (meta.current_round_slug && map[meta.current_round_slug])
      || tracks.find(function (track) { return track.status === 'active'; })
      || tracks.find(function (track) { return track.report; })
      || null;
  }

  function normalizeFooterText(text) {
    const raw = String(text || '').replace(/\s+/g, ' ').trim();
    const removedRepeats = raw.replace(/(?:·\s*F1 Racetracks\s+[^·]+)+/g, '');
    const withoutLeadingLabel = removedRepeats.replace(/^F1 Racetracks\s+[^·]+(?:\s*·\s*)?/, '');
    const remainder = withoutLeadingLabel.trim().replace(/^·\s*/, '');
    return remainder ? `F1 Racetracks ${BUILD_LABEL} · ${remainder}` : `F1 Racetracks ${BUILD_LABEL}`;
  }

  function ensureFooterLabel() {
    const foot = document.getElementById('foot-meta');
    if (!foot) return;
    foot.textContent = normalizeFooterText(foot.textContent);
  }

  function wrapFooterUpdater() {
    const original = window.updateFooterMeta;
    if (typeof original !== 'function' || original.__ppCompactWrapped) {
      ensureFooterLabel();
      return;
    }
    function wrapped(target) {
      original(target);
      ensureFooterLabel();
    }
    wrapped.__ppCompactWrapped = true;
    window.updateFooterMeta = wrapped;
    ensureFooterLabel();
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .current-round-card{padding:14px 16px 14px !important;gap:10px !important}
      .current-round-card .pp-home-tag,.current-round-card .pp-home-summary{display:none !important}
      .current-round-card .pp-home-kicker{align-items:center !important;gap:8px !important}
      .current-round-card .pp-home-title{gap:1px !important}
      .current-round-card .pp-home-title h2{font-size:1.14rem !important;line-height:1.04 !important}
      .current-round-card .pp-home-sub{display:none !important}
      .current-round-card .pp-home-flag{font-size:.56rem !important;letter-spacing:.08em;padding:0 0 0 10px !important;gap:6px !important;line-height:1.2 !important}
      .current-round-card .pp-home-flag::before{width:7px !important;height:7px !important}
      .current-round-card .pp-home-cta{margin-top:4px !important}
      .current-round-card .pp-button{padding:9px 12px !important;font-size:.68rem !important}
      .pp-home-schedule{display:grid;gap:8px;margin-top:2px}
      .pp-home-day{font-family:"IBM Plex Mono",monospace;font-size:.58rem;letter-spacing:.1em;text-transform:uppercase;color:var(--faint);opacity:.9;margin-top:2px}
      .pp-home-day:first-child{margin-top:0}
      .pp-home-session{display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:7px 0;border-top:1px solid oklch(32% 0.02 264 /.45)}
      .pp-home-session.is-live{padding-left:10px;border-left:2px solid var(--done);background:linear-gradient(90deg,oklch(64% 0.2 145 /.08),transparent 55%)}
      .pp-home-session-name{font-size:.92rem;line-height:1.25;color:var(--text);flex:1 1 auto}
      .pp-home-session-time{font-family:"IBM Plex Mono",monospace;font-size:.82rem;color:var(--muted);white-space:nowrap;flex:0 0 auto}
      .weekend-center .pp-local-note,.weekend-center .pp-schedule-summary{display:none !important}
      .weekend-center .pp-schedule-list{gap:10px !important}
      .weekend-center .pp-session-group{gap:0 !important}
      .weekend-center .pp-session-group-label{font-size:.58rem !important;color:var(--faint) !important;opacity:.85}
      .weekend-center .pp-session-row{display:flex !important;align-items:baseline !important;justify-content:space-between !important;gap:14px !important;padding:9px 0 !important}
      .weekend-center .pp-session-name{font-size:.96rem !important;line-height:1.24 !important;flex:1 1 auto !important}
      .weekend-center .pp-session-time{font-size:.86rem !important;white-space:nowrap !important;flex:0 0 auto !important;padding:0 !important;border:none !important;background:none !important;border-radius:0 !important;color:var(--muted) !important}
      .weekend-center .pp-session-row.is-done .pp-session-time,.weekend-center .pp-session-row.is-done .pp-session-name{color:var(--faint) !important;opacity:.68 !important}
      .weekend-center .pp-session-row.is-live{padding-left:10px !important;border-left:2px solid var(--done) !important;background:linear-gradient(90deg,oklch(64% 0.2 145 /.08),transparent 50%) !important}
      .weekend-center .pp-session-row.is-live .pp-session-name,.weekend-center .pp-session-row.is-live .pp-session-time{font-weight:700 !important;color:var(--text) !important}
      .weekend-center .pp-session-row.is-upcoming .pp-session-name{font-weight:600 !important}
      .tbl{table-layout:fixed !important}
      .tbl td,.tbl th{overflow-wrap:break-word !important;hyphens:auto !important}
      .tnote{font-size:.84rem !important;line-height:1.45 !important}
      @media (max-width:720px){
        .current-round-card{padding:12px 14px 12px !important}
        .current-round-card .pp-home-title h2{font-size:1rem !important}
        .current-round-card .pp-home-cta{display:flex !important;gap:8px !important}
        .current-round-card .pp-button{width:auto !important;flex:1 1 0 !important}
        .pp-home-schedule{gap:6px}
        .pp-home-session{gap:10px;padding:6px 0}
        .pp-home-session-name{font-size:.84rem}
        .pp-home-session-time{font-size:.78rem}
        .weekend-center .pp-session-row{gap:10px !important}
        .weekend-center .pp-session-name{font-size:.9rem !important}
        .weekend-center .pp-session-time{font-size:.8rem !important}
        .tbl th:nth-child(1),.tbl td:nth-child(1){width:10% !important}
        .tbl th:nth-child(2),.tbl td:nth-child(2){width:20% !important}
        .tbl th:nth-child(3),.tbl td:nth-child(3){width:16% !important}
        .tbl th:nth-child(4),.tbl td:nth-child(4){width:17% !important}
        .tbl th:nth-child(5),.tbl td:nth-child(5){width:37% !important}
        .podium-steps{gap:10px !important;align-items:flex-end !important}
        .podium-step{padding:14px 10px 12px !important;min-width:0 !important}
        .step-driver{font-size:.88rem !important;line-height:1.08 !important}
        .step-team{font-size:.68rem !important;line-height:1.2 !important}
        .step-pos{display:none !important}
      }
    `;
    document.head.appendChild(style);
  }

  function homeScheduleRows(track) {
    if (track && track.slug === 'silverstone') {
      return SILVERSTONE_LOCAL_SEED
        .map(function (item) {
          return {
            day: item.day,
            label: item.label,
            start: item.start,
            end: item.end,
            status: (function () {
              const now = Date.now();
              const startMs = new Date(item.start).getTime();
              const endMs = new Date(item.end).getTime();
              if (now >= endMs) return 'done';
              if (now >= startMs && now < endMs) return 'live';
              return 'upcoming';
            })()
          };
        })
        .filter(function (item) { return item.status !== 'done'; });
    }
    return [];
  }

  function rewriteHomeCard() {
    const card = document.getElementById('current-round-card');
    const track = currentTrack();
    if (!card || !track || track.slug !== 'silverstone') return;
    const flag = track.status === 'active' ? 'Live' : 'Focus';
    const rows = homeScheduleRows(track);
    const groups = rows.reduce(function (acc, item) {
      (acc[item.day] = acc[item.day] || []).push(item);
      return acc;
    }, {});
    card.innerHTML = `
      <div class="pp-home-kicker">
        <div class="pp-home-title">
          <h2>${esc(track.gp)}</h2>
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
    `;
  }

  function bindHomeCard() {
    const trigger = document.querySelector('[data-open-weekend]');
    if (!trigger || trigger.__ppBound) return;
    trigger.__ppBound = true;
    trigger.addEventListener('click', function () {
      const slug = trigger.getAttribute('data-open-weekend');
      const nextHash = '#/' + slug;
      if (location.hash === nextHash) {
        if (typeof router === 'function') router();
        return;
      }
      location.hash = nextHash;
      window.setTimeout(function () {
        if (typeof router === 'function') router();
      }, 0);
    });
  }

  function rewriteScheduleRows() {
    const center = document.getElementById('weekend-center');
    if (!center) return;
    center.querySelectorAll('.pp-session-row').forEach(function (row) {
      const time = row.querySelector('.pp-session-time');
      if (!time) return;
      if (time.parentElement !== row) row.appendChild(time);
    });
  }

  function applyPolishPass() {
    injectStyle();
    wrapFooterUpdater();
    rewriteHomeCard();
    bindHomeCard();
    rewriteScheduleRows();
  }

  window.addEventListener('hashchange', function () { window.setTimeout(applyPolishPass, 80); });
  window.addEventListener('load', function () { window.setTimeout(applyPolishPass, 180); });

  const appRoot = document.getElementById('app');
  if (appRoot && 'MutationObserver' in window) {
    const observer = new MutationObserver(function () { window.setTimeout(applyPolishPass, 0); });
    observer.observe(appRoot, { childList: true, subtree: true });
  }

  window.setTimeout(applyPolishPass, 220);
})();
