/* Runtime data now loads from ../data.json.
   This module expects TRACKS and the rest of the runtime payload
   to already be hydrated before the app boots.
*/

const APP_VERSION = "v5";
const APP_DATE = "2026-07-03";
const SEASON = "2026";

const bySlug = Object.fromEntries(TRACKS.map(t => [t.slug, t]));
const reportTracks = TRACKS.filter(t => t.report);

const SECCOL = { s1: 'var(--s1)', s2: 'var(--s2)', s3: 'var(--s3)' },
      SN = { s1: 'S1', s2: 'S2', s3: 'S3' };

const app = document.getElementById('app');
const NS = "http://www.w3.org/2000/svg";
const E = (t, a = {}) => {
  const e = document.createElementNS(NS, t);
  for (const k in a) e.setAttribute(k, a[k]);
  return e;
};
const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&', '<': '<', '>': '>' }[c]));

const jump = document.getElementById('jump');
jump.innerHTML = 'Jump to circuit…' + TRACKS.map(t => `<option value="${t.slug}">R${t.round} · ${esc(t.gp)}${t.report ? '' : ' (soon)'}</option>`).join('');
jump.addEventListener('change', () => {
  if (jump.value) location.hash = '#/' + jump.value;
});

function router() {
  const slug = (location.hash.replace(/^#\/?/, '') || '').trim();
  if (slug && bySlug[slug]) renderTrack(bySlug[slug]);
  else renderHome();
  jump.value = bySlug[slug] ? slug : '';
  window.scrollTo(0, 0);
  if (window.lucide) lucide.createIcons();
  updateFooterMeta(slug && bySlug[slug] ? bySlug[slug] : null);
}
window.addEventListener('hashchange', router);

function renderHome() {
  const built = reportTracks.length;
  app.innerHTML = `
    <header>
      <h1>F1 Racetracks</h1>
      <p>Home base for every round’s technical track report. Click a circuit to open its full breakdown: official map, lap profile with elevation, DRS and sectors, pit and tyre strategy, overtaking, and live weather. One app, ${built} breakdowns built.</p>
    </header>
    <div id="grid"></div>
    <footer>
      <p>Completed race <span class="ss-done"></span> Race weekend live <span class="ss-active"></span> Upcoming <span class="ss-pending"></span> Breakdown ready</p>
    </footer>
  `;
  const grid = document.getElementById('grid');
  TRACKS.forEach(t => {
    const b = document.createElement('button');
    b.className = 'race';
    if (!t.report) b.disabled = true;
    else b.onclick = () => location.hash = '#/' + t.slug;
    const ss = t.status === 'done' ? 'ss-done' : t.status === 'active' ? 'ss-active' : 'ss-pending';
    b.innerHTML = `
      <div class="race-flag ${ss}">
        <span class="race-round">Round ${String(t.round).padStart(2, '0')}</span>
        <span class="race-flag-icon">${t.flag}</span>
      </div>
      <div class="race-info">
        <h2>${esc(t.gp)}</h2>
        <p>${esc(t.title)}</p>
        <p>${t.date} ${SEASON}</p>
        <p>${t.report ? 'Breakdown' : 'Soon'}</p>
      </div>
    `;
    grid.appendChild(b);
  });
}
