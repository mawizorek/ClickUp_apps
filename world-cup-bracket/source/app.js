// World Cup 2026 Bracket - entry point. Wires modules, loads data, boots views.
import { S, APP_VERSION, BUILD_PR, DATA_URL, CACHE_KEY, REPO_OWNER, REPO_NAME, DATA_PATH } from './store.js';
import { buildFedBy, byId } from './util.js';
import { renderTimeNav, renderSchedule } from './schedule.js';
import { renderBracket } from './bracket.js';
import { togglePick, applyPaths } from './paths.js';
import { initSheet } from './sheet.js';

async function fetchLastUpdated() {
  const el = document.getElementById('updatedTime');
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?path=${DATA_PATH}&per_page=1`);
    if (!res.ok) throw new Error('API error');
    const commits = await res.json();
    if (commits.length > 0) {
      const date = new Date(commits[0].commit.author.date);
      const now = new Date();
      const diffMins = Math.floor((now - date) / 60000);
      const diffHrs = Math.floor((now - date) / 3600000);
      const diffDays = Math.floor((now - date) / 86400000);
      let rel;
      if (diffMins < 2) rel = 'just now';
      else if (diffMins < 60) rel = `${diffMins}m ago`;
      else if (diffHrs < 24) rel = `${diffHrs}h ago`;
      else rel = `${diffDays}d ago`;
      const timeStr = date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
      el.textContent = `${timeStr} (${rel})`;
      el.classList.toggle('fresh', diffHrs < 6);
    }
  } catch (e) { el.textContent = 'unavailable'; }
}

async function loadData() {
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error('Fetch failed');
    const json = await res.json();
    localStorage.setItem(CACHE_KEY, JSON.stringify(json));
    return json;
  } catch (e) {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) return JSON.parse(cached);
    return null;
  }
}

function renderFooter() {
  const el = document.getElementById('appFooter');
  if (el) el.textContent = `World Cup Bracket \u00b7 ${APP_VERSION} \u00b7 ${BUILD_PR}`;
}

function showBracketView() {
  document.querySelectorAll('.view-btn').forEach(b => b.classList.toggle('active', b.dataset.view === 'bracket'));
  document.getElementById('scheduleView').classList.remove('active');
  document.getElementById('bracketView').classList.add('active');
  renderBracket();
}

function setupViewToggle() {
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const v = btn.dataset.view;
      document.getElementById('scheduleView').classList.toggle('active', v === 'schedule');
      document.getElementById('bracketView').classList.toggle('active', v === 'bracket');
      if (v === 'bracket') renderBracket();
    });
  });
}

// Trace-path arrow inside the detail sheet -> jump to bracket, add that team
// to the multi-select compare, and paint the paths.
function setupTraceBridge() {
  document.addEventListener('trace-team', (e) => {
    const team = e.detail && e.detail.team;
    if (!team) return;
    showBracketView();
    if (!S.picks.includes(team)) togglePick(team);
    applyPaths();
  });
}

let tickerStarted = false;
function startCountdownTicker() {
  if (tickerStarted) return; tickerStarted = true;
  setInterval(() => {
    document.querySelectorAll('[data-countdown]').forEach(el => {
      const target = new Date(+el.dataset.countdown);
      let diff = target - new Date();
      if (diff <= 0) { el.textContent = 'kicked off'; return; }
      const d = Math.floor(diff / 86400000); diff -= d * 86400000;
      const h = Math.floor(diff / 3600000); diff -= h * 3600000;
      const mi = Math.floor(diff / 60000);
      el.textContent = d > 0 ? `in ${d}d ${h}h` : h > 0 ? `in ${h}h ${mi}m` : `in ${mi}m`;
    });
  }, 30000);
}

async function init() {
  renderFooter();
  fetchLastUpdated();
  const data = await loadData();
  if (!data) {
    document.getElementById('scheduleContent').innerHTML = '<div class="loading-msg">Could not load match data. Open via GitHub Pages or ensure data.json is in the same folder.</div>';
    return;
  }
  S.allMatches = data.matches;
  S.rankings = data.rankings || {};
  buildFedBy();
  setupViewToggle();
  setupTraceBridge();
  initSheet(byId);
  renderTimeNav();
  renderSchedule('today');
  startCountdownTicker();
}

init();
