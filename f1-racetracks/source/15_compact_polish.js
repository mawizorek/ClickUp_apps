/* Compact polish pass for V1.7b.
   Tightens the home card, simplifies the schedule presentation,
   and fixes mobile table/podium typography without reopening the larger runtime bug loop.
*/

(function () {
  const BUILD_LABEL = 'V1.7b compact';
  const STYLE_ID = 'pp-v17b-compact-style';

  const SILVERSTONE_LOCAL_SEED = [
    { day: 'Fri', label: 'Sprint Qualifying', start: '2026-07-03T16:30:00+01:00', end: '2026-07-03T17:14:00+01:00' },
    { day: 'Sat', label: 'Sprint', start: '2026-07-04T12:00:00+01:00', end: '2026-07-04T13:00:00+01:00' },
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

  function ensureFooterLabel() {
    const foot = document.getElementById('foot-meta');
    if (!foot) return;
    const current = foot.textContent || '';
    const next = current.replace(/F1 Racetracks\s+[^·]+/, 'F1 Racetracks ' + BUILD_LABEL);
    foot.textContent = next === current ? ('F1 Racetracks ' + BUILD_LABEL + (current ? ' · ' + current : '')) : next;
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
      .current-round-card .pp-home-tag{display:none !important}
      .current-round-card .pp-home-kicker{align-items:flex-start !important;gap:8px !important}
      .current-round-card .pp-home-flag{font-size:.62rem !important;letter-spacing:.08em}
      .current-round-card .pp-home-title{gap:2px !important}
      .current-round-card .pp-home-title h2{font-size:1.18rem !important;line-height:1.04 !important}
      .current-round-card .pp-home-sub{font-size:.82rem !important;color:var(--faint) !important}
      .current-round-card .pp-home-summary{font-size:.82rem !important;line-height:1.45 !important;color:var(--muted) !important}
      .current-round-card .pp-home-cta{margin-top:2px !important}
      .current-round-card .pp-button{padding:9px 12px !important;font-size:.68rem !important}
      .weekend-center .pp-local-note,.weekend-center .pp-schedule-summary{display:none !important}
      .weekend-center .pp-schedule-list{gap:12px !important}
      .weekend-center .pp-session-group{gap:2px !important}
      .weekend-center .pp-session-group-label{font-size:.58rem !important;color:var(--faint) !important;opacity:.8}
      .weekend-center .pp-session-row{display:flex !important;align-items:baseline !important;justify-content:space-between !important;gap:14px !important;padding:10px 0 !important}
      .weekend-center .pp-session-name{font-size:.98rem !important;line-height:1.25 !important;flex:1 1 auto !important}
      .weekend-center .pp-session-time{font-size:.88rem !important;white-space:nowrap !important;flex:0 0 auto !important}
      .weekend-center .pp-session-row.is-upcoming .pp-session-time{padding:0 !important;border:none !important;background:none !important;border-radius:0 !important;color:var(--text) !important}
      .weekend-center .pp-session-row.is-done .pp-session-time,.weekend-center .pp-session-row.is-done .pp-session-name{color:var(--faint) !important;opacity:.72 !important}
      .weekend-center .pp-session-row.is-live{padding-left:10px !important;border-left:2px solid var(--done) !important;background:linear-gradient(90deg,oklch(64% 0.2 145 /.08),transparent 50%) !important}
      .weekend-center .pp-session-row.is-live .pp-session-name,.weekend-center .pp-session-row.is-live .pp-session-time{font-weight:700 !important;color:var(--text) !important}
      @media (max-width:720px){
        .current-round-card{padding:12px 14px 12px !important}
        .current-round-card .pp-home-title h2{font-size:1.06rem !important}
        .current-round-card .pp-home-sub{display:none !important}
        .current-round-card .pp-home-summary{font-size:.76rem !important}
        .current-round-card .pp-home-cta{display:flex !important;gap:8px !important}
        .current-round-card .pp-button{width:auto !important;flex:1 1 0 !important}
        .weekend-center .pp-session-row{gap:10px !important}
        .weekend-center .pp-session-name{font-size:.92rem !important}
        .weekend-center .pp-session-time{font-size:.82rem !important}
        .tbl{table-layout:fixed !important}
        .tbl th:nth-child(1),.tbl td:nth-child(1){width:10% !important}
        .tbl th:nth-child(2),.tbl td:nth-child(2){width:20% !important}
        .tbl th:nth-child(3),.tbl td:nth-child(3){width:16% !important}
        .tbl th:nth-child(4),.tbl td:nth-child(4){width:17% !important}
        .tbl th:nth-child(5),.tbl td:nth-child(5){width:37% !important}
        .tbl td,.tbl th{overflow-wrap:break-word !important;word-break:normal !important;hyphens:auto !important}
        .tnote{font-size:.8rem !important;line-height:1.45 !important}
        .podium-steps{gap:10px !important}
        .podium-step{padding:14px 10px 12px !important}
        .step-driver{font-size:.9rem !important;line-height:1.1 !important}
        .step-team{font-size:.72rem !important;line-height:1.3 !important}
        .step-pos{font-size:.62rem !important;line-height:1.25 !important}
      }
    `;
    document.head.appendChild(style);
  }

  function compactSummary(track) {
    if (track && track.slug === 'silverstone') {
      return SILVERSTONE_LOCAL_SEED.map(function (item) {
        return item.day + ' ' + item.label + ' ' + localTime(item.start);
      }).join(' • ');
    }
    return '';
  }

  function rewriteHomeCard() {
    const card = document.getElementById('current-round-card');
    const track = currentTrack();
    if (!card || !track || track.slug !== 'silverstone') return;
    const flag = track.status === 'active' ? 'Live' : 'Focus';
    card.innerHTML = `
      <div class="pp-home-kicker">
        <div class="pp-home-title">
          <h2>${esc(track.gp)}</h2>
          <div class="pp-home-sub">${esc(track.title)}</div>
        </div>
        <span class="pp-home-flag">${esc(flag)}</span>
      </div>
      <div class="pp-home-summary">${esc(compactSummary(track))}</div>
      <div class="pp-home-cta">
        <a class="pp-button primary" href="#/${esc(track.slug)}">Open Weekend Center →</a>
        <a class="pp-button" href="./live-tracker.html">Live tracker</a>
      </div>
    `;
  }

  function rewriteScheduleRows() {
    const center = document.getElementById('weekend-center');
    if (!center) return;
    center.querySelectorAll('.pp-session-row').forEach(function (row) {
      const name = row.querySelector('.pp-session-name');
      const time = row.querySelector('.pp-session-time');
      if (!name || !time) return;
      if (!time.parentElement || time.parentElement === row) return;
      row.appendChild(time);
    });
  }

  function applyCompactPass() {
    injectStyle();
    wrapFooterUpdater();
    rewriteHomeCard();
    rewriteScheduleRows();
  }

  window.addEventListener('hashchange', function () { window.setTimeout(applyCompactPass, 80); });
  window.addEventListener('load', function () { window.setTimeout(applyCompactPass, 180); });

  const appRoot = document.getElementById('app');
  if (appRoot && 'MutationObserver' in window) {
    const observer = new MutationObserver(function () { window.setTimeout(applyCompactPass, 0); });
    observer.observe(appRoot, { childList: true, subtree: true });
  }

  window.setTimeout(applyCompactPass, 220);
})();
