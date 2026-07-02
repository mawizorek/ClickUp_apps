const APP_VERSION = 'v2';
const APP_DATE = '2026-07-02';
const TEAM_THEME = 'Oracle Red Bull Racing';
const REPO_OWNER = 'mawizorek';
const REPO_NAME = 'ClickUp_apps';
const REPO_BRANCH = 'main';
const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents?ref=${REPO_BRANCH}`;
const CACHE_KEY = 'clickup_apps_index_cache_v2';
const HIDDEN_FOLDERS = new Set(['.github']);
const SPECIAL_WORDS = new Map([
  ['ai', 'AI'],
  ['ddr', 'DDR'],
  ['f1', 'F1'],
  ['pdf', 'PDF']
]);

const appListEl = document.getElementById('app-list');
const statusPillEl = document.getElementById('status-pill');
const statTotalEl = document.getElementById('stat-total');
const statSourceEl = document.getElementById('stat-source');
const statRefreshEl = document.getElementById('stat-refresh');
const footerVersionEl = document.getElementById('footerVersion');
const refreshButtonEl = document.getElementById('refresh-button');

footerVersionEl.textContent = `${APP_VERSION} · ${APP_DATE}`;

function titleFromSlug(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((segment) => {
      const lower = segment.toLowerCase();
      if (SPECIAL_WORDS.has(lower)) return SPECIAL_WORDS.get(lower);
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

function formatTimestamp(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function repoUrlFor(slug) {
  return `https://github.com/${REPO_OWNER}/${REPO_NAME}/tree/${REPO_BRANCH}/${slug}`;
}

function liveUrlFor(slug) {
  return `https://${REPO_OWNER}.github.io/${REPO_NAME}/${slug}/`;
}

function isAppDirectory(item) {
  return item && item.type === 'dir' && !HIDDEN_FOLDERS.has(item.name);
}

function toAppRecord(item) {
  const slug = item.name;
  return {
    slug,
    title: titleFromSlug(slug),
    liveUrl: liveUrlFor(slug),
    repoUrl: repoUrlFor(slug),
    isTemplate: slug === 'template-app'
  };
}

function writeCache(payload) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn('Cache write failed', error);
  }
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('Cache read failed', error);
    return null;
  }
}

function setStatus(message, tone) {
  statusPillEl.textContent = message;
  statusPillEl.dataset.tone = tone;
}

function setStats(count, sourceLabel, fetchedAt) {
  statTotalEl.textContent = String(count ?? '—');
  statSourceEl.textContent = sourceLabel || '—';
  statRefreshEl.textContent = formatTimestamp(fetchedAt);
}

function renderEmptyState(message, detail) {
  appListEl.innerHTML = `
    <article class="notice">
      <strong>${message}</strong>
      <p>${detail}</p>
    </article>
  `;
}

function renderApps(apps) {
  if (!apps.length) {
    renderEmptyState('No app folders found.', 'The repo root returned no app directories to display.');
    return;
  }

  appListEl.innerHTML = apps
    .map((app) => {
      const badge = app.isTemplate ? 'Reference template' : 'Live shortcut';
      const note = app.isTemplate
        ? 'Primary reference app and schema proof. Theme is isolated in /source/03_theme_team.css.txt.'
        : 'Auto-discovered from the repo root and linked directly to its GitHub Pages entry point.';

      return `
        <article class="card">
          <div class="card-header">
            <div>
              <h2>${app.title}</h2>
              <p><code>${app.slug}</code></p>
            </div>
            <span class="badge">${badge}</span>
          </div>
          <p>${note}</p>
          <div class="card-actions">
            <a class="link-pill primary" href="${app.liveUrl}" target="_blank" rel="noreferrer">Open app</a>
            <a class="link-pill" href="${app.repoUrl}" target="_blank" rel="noreferrer">Repo folder</a>
          </div>
        </article>
      `;
    })
    .join('');
}

async function fetchAppsFromGitHub() {
  const response = await fetch(API_URL, {
    headers: {
      Accept: 'application/vnd.github+json'
    }
  });

  if (!response.ok) {
    throw new Error(`GitHub API responded with ${response.status}`);
  }

  const items = await response.json();
  return items
    .filter(isAppDirectory)
    .map(toAppRecord)
    .sort((a, b) => a.title.localeCompare(b.title));
}

async function loadApps({ forceRefresh = false } = {}) {
  refreshButtonEl.disabled = true;
  setStatus(forceRefresh ? 'Refreshing live app list…' : 'Connecting to the GitHub API…', 'loading');

  try {
    const apps = await fetchAppsFromGitHub();
    const payload = {
      apps,
      fetchedAt: new Date().toISOString(),
      source: 'live'
    };

    writeCache(payload);
    renderApps(apps);
    setStats(apps.length, 'Live API', payload.fetchedAt);
    setStatus(`Loaded ${apps.length} app folders from the live GitHub API.`, 'live');
  } catch (error) {
    console.error(error);
    const cached = readCache();

    if (cached?.apps?.length) {
      renderApps(cached.apps);
      setStats(cached.apps.length, 'Cached', cached.fetchedAt);
      setStatus('Live fetch failed — showing the last cached app list.', 'cached');
    } else {
      renderEmptyState(
        'Could not load the app list.',
        'GitHub may be rate-limiting, offline, or blocking the request. Open the repo directly, then try Refresh when you are back online.'
      );
      setStats('—', 'Unavailable', null);
      setStatus('Could not reach the GitHub API and no cached list is available yet.', 'error');
    }
  } finally {
    refreshButtonEl.disabled = false;
  }
}

refreshButtonEl.addEventListener('click', () => loadApps({ forceRefresh: true }));
loadApps();
