/* Late rescue mount for homepage current-round card and track Weekend Center.
   Purpose: make the newer weekend surfaces visible even if the earlier enhancement layer misses.
*/

(function () {
  const RESCUE_TOKEN = 'dbg2 rescue';
  const RESCUE_CARD_ID = 'current-round-card-rescue';
  const RESCUE_CENTER_ID = 'weekend-center-rescue';

  function rescueEsc(value) {
    return String(value ?? '').replace(/[&<>]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[char]));
  }

  function currentTrack() {
    if (window.bySlug && window.appDataMeta && window.appDataMeta.current_round_slug && window.bySlug[window.appDataMeta.current_round_slug]) {
      return window.bySlug[window.appDataMeta.current_round_slug];
    }
    if (Array.isArray(window.TRACKS)) {
      return window.TRACKS.find((track) => track.status === 'active') || window.TRACKS.find((track) => track.report) || null;
    }
    return null;
  }

  function simpleSessions(track) {
    const raw = Array.isArray(track?.sessions) ? track.sessions : [];
    if (!raw.length) {
      return [{ label: 'Weekend schedule sync pending', meta: 'Rescue surface is live', status: 'upcoming' }];
    }
    return raw.slice(0, 3).map((entry) => {
      const parts = String(entry.sess || '').split('·').map((item) => item.trim()).filter(Boolean);
      return {
        label: parts[parts.length - 1] || 'Weekend session',
        meta: `${entry.date || ''} · ${parts[0] || 'Weekend'}`.trim(),
        status: track.status === 'done' ? 'done' : track.status === 'active' ? 'live' : 'upcoming'
      };
    });
  }

  function ensureFooterToken() {
    const foot = document.getElementById('foot-meta');
    if (!foot) return;
    const original = foot.textContent || '';
    if (original.includes(RESCUE_TOKEN)) return;
    if (original.includes('dbg1')) {
      foot.textContent = original.replace('dbg1', RESCUE_TOKEN);
      return;
    }
    foot.textContent = `${original} · ${RESCUE_TOKEN}`.trim();
  }

  function patchFooterUpdater() {
    const original = window.updateFooterMeta;
    if (typeof original !== 'function' || original.__rescueWrapped) {
      ensureFooterToken();
      return;
    }
    function wrappedUpdateFooterMeta(target) {
      original(target);
      ensureFooterToken();
    }
    wrappedUpdateFooterMeta.__rescueWrapped = true;
    window.updateFooterMeta = wrappedUpdateFooterMeta;
    ensureFooterToken();
  }

  function mountHomeRescue() {
    const homeHero = document.querySelector('.home-h');
    if (!homeHero || document.getElementById(RESCUE_CARD_ID)) return;
    const track = currentTrack();
    if (!track) return;
    const section = document.createElement('section');
    section.id = RESCUE_CARD_ID;
    section.className = 'current-round-card';
    section.innerHTML = `
      <div class="crc-head">
        <div>
          <div class="tag">Current round · ${RESCUE_TOKEN}</div>
          <h2>${rescueEsc(track.gp || track.title || 'Current round')}</h2>
        </div>
        <div class="crc-badge crc-badge-${rescueEsc(track.status || 'active')}">${rescueEsc(track.status || 'active')}</div>
      </div>
      <p class="crc-copy">Rescue mount active: the current-race shortcut is now being forced into the real home render so the newest front-end layer is visible again.</p>
      <div class="crc-grid">
        <div class="wc-panel"><div class="crc-label">Circuit</div><div class="crc-value">${rescueEsc(track.title || '—')}</div></div>
        <div class="wc-panel"><div class="crc-label">Date</div><div class="crc-value">${rescueEsc(track.date || '—')} ${rescueEsc(window.SEASON || '')}</div></div>
        <div class="wc-panel"><div class="crc-label">Status</div><div class="crc-value">${rescueEsc(track.status || 'active')}</div></div>
      </div>
      <div class="crc-actions"><a class="crc-primary" href="#/${rescueEsc(track.slug || '')}">Open weekend center →</a></div>
    `;
    homeHero.insertAdjacentElement('afterend', section);
  }

  function mountTrackRescue() {
    const meta = document.querySelector('.meta');
    const view = document.querySelector('.view');
    if (!meta || !view || document.getElementById(RESCUE_CENTER_ID)) return;
    const slug = (location.hash.replace(/^#\/?/, '') || '').trim();
    const track = window.bySlug && window.bySlug[slug];
    if (!track || !track.report) return;
    const sessionRows = simpleSessions(track).map((session) => `
      <div class="wc-session-row">
        <div class="wc-session-left">
          <span class="wc-series wc-series-f1">F1</span>
          <span class="wc-session-name">${rescueEsc(session.label)}</span>
        </div>
        <div class="wc-session-right">
          <span class="wc-session-time">${rescueEsc(session.meta)}</span>
          <span class="wc-status wc-status-${rescueEsc(session.status)}">${rescueEsc(session.status)}</span>
        </div>
      </div>
    `).join('');

    const section = document.createElement('section');
    section.id = RESCUE_CENTER_ID;
    section.className = 'card weekend-center';
    section.innerHTML = `
      <div class="wc-head">
        <div>
          <div class="tag">Weekend Center · ${RESCUE_TOKEN}</div>
          <h2>${rescueEsc(track.gp || track.title || 'Weekend')} weekend</h2>
        </div>
        <div class="wc-toggle"><button class="wc-tab is-active" type="button">Schedule</button></div>
      </div>
      <div class="wc-body-grid">
        <div class="wc-main">
          <section class="wc-panel">
            <div class="wc-day-head"><strong>Weekend view</strong><span>${rescueEsc(track.date || '')}</span></div>
            <div class="wc-day-list">${sessionRows}</div>
          </section>
        </div>
      </div>
    `;
    meta.insertAdjacentElement('afterend', section);
  }

  function applyRescue() {
    patchFooterUpdater();
    mountHomeRescue();
    mountTrackRescue();
  }

  window.addEventListener('hashchange', () => window.setTimeout(applyRescue, 40));
  window.addEventListener('load', () => window.setTimeout(applyRescue, 120));

  const appRoot = document.getElementById('app');
  if (appRoot && 'MutationObserver' in window) {
    const observer = new MutationObserver(() => window.setTimeout(applyRescue, 0));
    observer.observe(appRoot, { childList: true });
  }

  window.setTimeout(applyRescue, 200);
})();
