/* App Dashboard engine. Discovers repo app folders, health-checks, filters. */
const APP_VERSION = 'v2.4';
const APP_DATE = '2026-07-07';

const OWNER = 'mawizorek';
const REPO = 'ClickUp_apps';
const PAGES_BASE = `https://${OWNER}.github.io/${REPO}`;
const API_BASE = `https://api.github.com/repos/${OWNER}/${REPO}`;
const EXCLUDED = ['template-app', 'app-dashboard', 'brain-config', 'agent-reports', 'routines', 'shared', 'quickfire', '.nojekyll', 'README.md', 'robots.txt', 'canary.txt', 'index.html'];

const CACHE_KEY = `appDashboard_cache_${APP_VERSION}`;
const CACHE_TTL = 5 * 60 * 1000;
const RECENT_KEY = 'appDashboard_recent';
const FILTER_KEY = 'appDashboard_filter';
const SHOW_RETIRED_KEY = 'appDashboard_showRetired';
const MAX_RECENT = 2;

// App metadata: slug -> { desc, category, badges, status, supersededBy }
// Categories: 'dashboard' (view/explore data) | 'tool' (process/transform input)
// status: 'live' (default) | 'retired' (hidden unless Show retired is on)
const APP_META = {
  'prism': { desc: 'Data App Viewer. Drop JSON or Markdown; JSON becomes a readable table with CSV/Excel export.', category: 'tool', badges: ['tool'], status: 'live' },
  'world-cup-bracket': { desc: 'Live tournament bracket with match results and progression.', category: 'dashboard', badges: ['dashboard'], status: 'live' },
  'f1-racetracks': { desc: 'Interactive race circuit explorer with live data.', category: 'dashboard', badges: ['data'], status: 'live' },
  'file-chunker': { desc: 'Split large files into AI-readable chunks with verification headers.', category: 'tool', badges: ['tool'], status: 'live' },
  'budget-code-mapper': { desc: 'Budget code authority lookup and export tool.', category: 'tool', badges: ['data'], status: 'live' },
  'markdown-viewer': { desc: 'Mobile-first markdown reader. Superseded by Prism, which reads Markdown and JSON.', category: 'tool', badges: ['tool'], status: 'retired', supersededBy: 'prism' },
  'pdf-splitter': { desc: 'Extract and split PDF pages client-side.', category: 'tool', badges: ['tool'], status: 'live' },
  'inciardi-market': { desc: 'Market list and pricing view.', category: 'dashboard', badges: ['data'], status: 'live' }
};

let currentFilter = 'all';
let showRetired = false;
let allApps = [];

function getCache() {
  try { const raw = localStorage.getItem(CACHE_KEY); if (!raw) return null; const parsed = JSON.parse(raw); if (Date.now() - parsed.ts > CACHE_TTL) return null; return parsed.data; } catch (e) { return null; }
}
function setCache(data) { try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data })); } catch (e) {} }
function pruneOldCaches() { try { for (let i = 0; i < localStorage.length; i++) { const key = localStorage.key(i); if (key && key.startsWith('appDashboard_cache_') && key !== CACHE_KEY) { localStorage.removeItem(key); } } } catch (e) {} }

function getRecent() { try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch (e) { return []; } }
function logVisit(slug) { try { let recent = getRecent().filter(s => s !== slug); recent.unshift(slug); recent = recent.slice(0, MAX_RECENT); localStorage.setItem(RECENT_KEY, JSON.stringify(recent)); } catch (e) {} }

function applyFilter(filter) {
  currentFilter = filter;
  try { localStorage.setItem(FILTER_KEY, filter); } catch (e) {}
  document.querySelectorAll('.filter-chip[data-filter]').forEach(chip => { chip.classList.toggle('active', chip.dataset.filter === filter); });
  refreshVisibility();
}
function refreshVisibility() {
  const cards = document.querySelectorAll('.app-card[data-category]');
  let visible = 0;
  cards.forEach(card => {
    const catMatch = currentFilter === 'all' || card.dataset.category === currentFilter;
    const retiredOk = showRetired || card.dataset.status !== 'retired';
    const show = catMatch && retiredOk;
    card.classList.toggle('hidden', !show);
    if (show) visible++;
  });
  let emptyEl = document.getElementById('emptyFilter');
  if (visible === 0 && cards.length > 0) {
    if (!emptyEl) { emptyEl = document.createElement('div'); emptyEl.id = 'emptyFilter'; emptyEl.className = 'empty-filter'; document.getElementById('appGrid').appendChild(emptyEl); }
    emptyEl.textContent = currentFilter === 'all' ? 'No apps to show.' : `No ${currentFilter} apps to show.`;
    emptyEl.style.display = '';
  } else if (emptyEl) { emptyEl.style.display = 'none'; }
}
function setShowRetired(on) {
  showRetired = on;
  try { localStorage.setItem(SHOW_RETIRED_KEY, on ? '1' : '0'); } catch (e) {}
  const chip = document.querySelector('.toggle-chip[data-toggle="retired"]');
  if (chip) chip.classList.toggle('active', on);
  refreshVisibility();
}

async function init(forceRefresh) {
  const grid = document.getElementById('appGrid');
  pruneOldCaches();
  try { const saved = localStorage.getItem(FILTER_KEY); if (saved && ['all', 'dashboard', 'tool'].includes(saved)) currentFilter = saved; } catch (e) {}
  try { showRetired = localStorage.getItem(SHOW_RETIRED_KEY) === '1'; } catch (e) {}
  const rtChip = document.querySelector('.toggle-chip[data-toggle="retired"]'); if (rtChip) rtChip.classList.toggle('active', showRetired);

  if (!forceRefresh) { const cached = getCache(); if (cached) { allApps = cached; renderFromData(cached); cached.forEach((app, i) => checkHealth(app, i)); return; } }
  grid.innerHTML = '<div class="loading-state">Loading apps\u2026</div>';
  try {
    const [treeRes, commitsRes] = await Promise.all([ fetch(`${API_BASE}/contents/`), fetch(`${API_BASE}/commits?per_page=100`) ]);
    if (!treeRes.ok || !commitsRes.ok) throw new Error('API error');
    const items = await treeRes.json();
    const commits = await commitsRes.json();
    const appFolders = items.filter(i => i.type === 'dir' && !EXCLUDED.includes(i.name));
    const apps = await Promise.all(appFolders.map(f => buildApp(f, commits)));
    apps.sort((a, b) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0));
    allApps = apps; setCache(apps); renderFromData(apps);
    apps.forEach((app, i) => checkHealth(app, i));
  } catch (e) {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('appDashboard_cache_')) {
          const parsed = JSON.parse(localStorage.getItem(key));
          if (parsed && parsed.data) { allApps = parsed.data; renderFromData(parsed.data); grid.insertAdjacentHTML('beforeend', '<div class="cache-note">Showing cached data (offline or rate limited)</div>'); parsed.data.forEach((app, idx) => checkHealth(app, idx)); return; }
        }
      }
    } catch (e2) {}
    grid.innerHTML = '<div class="error-state">Could not reach GitHub API. Check your connection and refresh.</div>';
  }
}

function renderFromData(apps) {
  render(apps); updateStats(apps); applyFilter(currentFilter);
  document.getElementById('refreshTime').textContent = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

async function buildApp(folder, commits) {
  const name = folder.name;
  const pagesUrl = `${PAGES_BASE}/${name}/`;
  const repoUrl = `https://github.com/${OWNER}/${REPO}/tree/main/${name}`;
  const folderCommits = commits.filter(c => c.commit.message.toLowerCase().includes(name));
  const lastCommit = folderCommits[0] || null;
  const lastUpdated = lastCommit ? lastCommit.commit.author.date : null;
  const lastMsg = lastCommit ? lastCommit.commit.message.split('\n')[0] : null;
  const commitCount = folderCommits.length;
  let hasData = false;
  try { const res = await fetch(`${API_BASE}/contents/${name}`); if (res.ok) { const contents = await res.json(); hasData = contents.some(f => f.name === 'data.json'); } } catch (e) {}
  const meta = APP_META[name] || {};
  return { name, pagesUrl, repoUrl, lastUpdated, lastMsg, commitCount, hasData, desc: meta.desc || null, category: meta.category || 'tool', badges: meta.badges || [], status: meta.status || 'live', supersededBy: meta.supersededBy || null };
}

function render(apps) {
  const grid = document.getElementById('appGrid');
  const recent = getRecent();
  grid.innerHTML = apps.map((app, i) => {
    const displayName = app.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const timeStr = app.lastUpdated ? relativeTime(app.lastUpdated) : '\u2014';
    const isRecent = recent.includes(app.name) && app.status !== 'retired';
    const badgeHtml = [
      app.hasData ? '<span class="badge badge-data">data.json</span>' : '',
      ...app.badges.map(b => {
        if (b === 'dashboard') return '<span class="badge badge-dashboard">Dashboard</span>';
        if (b === 'data') return app.hasData ? '' : '<span class="badge badge-data">data.json</span>';
        if (b === 'tool') return '<span class="badge badge-tool">Tool</span>';
        return '';
      }),
      app.status === 'retired' ? '<span class="badge badge-retired">Retired</span>' : ''
    ].filter(Boolean).join('');
    let supersededHtml = '';
    if (app.supersededBy) {
      const supName = app.supersededBy.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      supersededHtml = `<div class="superseded-note">\u2192 Superseded by <a href="${PAGES_BASE}/${app.supersededBy}/" target="_blank" rel="noopener">${esc(supName)}</a></div>`;
    }
    return `<div class="app-card" data-category="${app.category}" data-status="${app.status}">
      <div class="app-header">
        <span class="health-dot checking" id="health-${i}"></span>
        <span class="app-name">${esc(displayName)}</span>
        ${isRecent ? '<span class="recent-indicator">Recent</span>' : ''}
      </div>
      <div class="app-slug">${esc(app.name)}</div>
      ${app.desc ? `<div class="app-desc">${esc(app.desc)}</div>` : ''}
      ${supersededHtml}
      ${badgeHtml ? `<div class="app-badges">${badgeHtml}</div>` : ''}
      <div class="app-meta">
        <span>${timeStr}</span>
        <span>${app.commitCount} commit${app.commitCount !== 1 ? 's' : ''}</span>
        ${app.lastMsg ? `<span><strong>${esc(app.lastMsg)}</strong></span>` : ''}
      </div>
      <div class="app-actions">
        <a class="app-btn app-btn-open" href="${app.pagesUrl}" target="_blank" rel="noopener" onclick="logVisit('${app.name}')">Open app</a>
        <a class="app-btn app-btn-repo" href="${app.repoUrl}" target="_blank" rel="noopener">Repo folder</a>
      </div>
    </div>`;
  }).join('');
}

async function checkHealth(app, idx) {
  const dot = document.getElementById(`health-${idx}`);
  if (!dot) return;
  try { const res = await fetch(app.pagesUrl, { method: 'GET', mode: 'cors', cache: 'no-store' }); dot.className = res.ok ? 'health-dot live' : 'health-dot dead'; updateHealthCount(); }
  catch (e) { dot.className = 'health-dot dead'; updateHealthCount(); }
}
function updateHealthCount() {
  const dots = document.querySelectorAll('.health-dot');
  let healthy = 0, resolved = 0;
  dots.forEach(d => { if (d.classList.contains('live')) { healthy++; resolved++; } else if (d.classList.contains('dead')) { resolved++; } });
  if (resolved === dots.length && dots.length > 0) { document.getElementById('healthyCount').textContent = healthy; }
}
function updateStats(apps) {
  const active = apps.filter(a => a.status !== 'retired');
  document.getElementById('appCount').textContent = active.length;
  document.getElementById('healthyCount').textContent = '\u2026';
  const sevenDays = Date.now() - 7 * 86400000;
  const recent = active.filter(a => a.lastUpdated && new Date(a.lastUpdated) > sevenDays).length;
  document.getElementById('recentCount').textContent = recent;
}
function relativeTime(iso) {
  const ms = Date.now() - new Date(iso);
  const hrs = Math.floor(ms / 3600000), days = Math.floor(ms / 86400000);
  if (hrs < 1) return 'just now';
  if (hrs < 24) return `${hrs}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

document.getElementById('refreshBtn').addEventListener('click', () => init(true));
document.getElementById('filterRow').addEventListener('click', (e) => {
  const toggle = e.target.closest('.toggle-chip[data-toggle="retired"]');
  if (toggle) { setShowRetired(!showRetired); return; }
  const chip = e.target.closest('.filter-chip[data-filter]');
  if (!chip) return;
  applyFilter(chip.dataset.filter);
});

init(false);
