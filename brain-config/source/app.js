/* Brain Config Index \u2014 engine.
   Multi-file build: index.html (shell) + source/styles.css + source/data.js + source/app.js.
   Engine updates: version-bump this file + the shell. Reads PROSE_HOOKS/TRIGGERS/BADGES/NICKNAMES from data.js. */

// ---- Config (top-level constants; change here, nowhere else) ----
const OWNER = 'mawizorek';
const REPO = 'ClickUp_apps';
const BASE = `https://api.github.com/repos/${OWNER}/${REPO}`;
const RAW = `https://raw.githubusercontent.com/${OWNER}/${REPO}/main`;
const BLOB = `https://github.com/${OWNER}/${REPO}/blob/main`;
const CACHE_TTL = 300000; // 5 min

// \u26A0\uFE0F NEEDS CONFIRMATION (Michael): the launch target for a fresh Brain MAX session.
// No documented web deep-link prefills a prompt, so the button just OPENS Brain MAX;
// the prompt is copied to the clipboard and you paste + pick an agent + send.
// Set this to your real target (web workspace home, or a clickup:// desktop protocol).
const BRAIN_MAX_URL = 'https://app.clickup.com/';

const SHELVES = [
  { key: 'gates', folder: 'brain-config/gates', label: 'Gates (pre-checks, orchestration)', cssClass: 'shelf-gates' },
  { key: 'hooks', folder: 'brain-config/hooks', label: '\u{1F504} Hooks (deterministic, profiled in repo)', cssClass: 'shelf-hooks' },
  { key: 'agents', folder: 'brain-config/agents', label: '\u{1F9E0} Agents (autonomous workers)', cssClass: 'shelf-agents' }
];

let allTools = [];
let usageData = {};
let currentSort = 'shelf';
let toastTimer = null;

// ---- helpers ----
function slugToName(slug) { return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function b64(s) { return btoa(unescape(encodeURIComponent(s))); }
function unb64(s) { try { return decodeURIComponent(escape(atob(s))); } catch (e) { return ''; } }

function extractPurpose(content) {
  const m = content.match(/\*\*Purpose:\*\*\s*(.+?)(?:\n|$)/);
  return m ? m[1].trim() : '';
}
function extractCreatedDate(content) {
  const m = content.match(/^- (\d{4}-\d{2}-\d{2}):/m);
  return m ? m[1] : null;
}
function extractShortcut(content) { return /\*\*Shortcut:\*\*\s*true/i.test(content); }
function extractLaunchPrompt(content) {
  const m = content.match(/\*\*Launch prompt:\*\*\s*\n+```[a-zA-Z]*\n([\s\S]*?)\n```/);
  return m ? m[1].trim() : '';
}

async function fetchJSON(url) {
  const cached = localStorage.getItem(url);
  if (cached) { const { data, ts } = JSON.parse(cached); if (Date.now() - ts < CACHE_TTL) return data; }
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  localStorage.setItem(url, JSON.stringify({ data, ts: Date.now() }));
  return data;
}

async function fetchText(url) {
  const cached = localStorage.getItem('txt:' + url);
  if (cached) { const { data, ts } = JSON.parse(cached); if (Date.now() - ts < CACHE_TTL) return data; }
  const res = await fetch(url);
  if (!res.ok) return '';
  const data = await res.text();
  localStorage.setItem('txt:' + url, JSON.stringify({ data, ts: Date.now() }));
  return data;
}

function clearCache() {
  Object.keys(localStorage).forEach(k => { if (k.startsWith('https://') || k.startsWith('txt:')) localStorage.removeItem(k); });
  location.reload();
}

async function loadUsageLog() {
  const text = await fetchText(`${RAW}/brain-config/usage-log.json`);
  if (!text) return;
  try {
    const log = JSON.parse(text);
    usageData = log.tools || {};
    const sessEl = document.getElementById('sessions-logged');
    const updEl = document.getElementById('last-updated');
    if (log.sessions_logged > 0) sessEl.textContent = `${log.sessions_logged} sessions`;
    if (log.last_updated) updEl.textContent = `last: ${log.last_updated}`;
  } catch (e) {}
}

async function loadShelf(shelf) {
  const listing = await fetchJSON(`${BASE}/contents/${shelf.folder}?ref=main`);
  if (!listing || !Array.isArray(listing)) return [];
  const mdFiles = listing.filter(f => f.name.endsWith('.md') && f.name !== 'README.md');
  const tools = [];
  for (const file of mdFiles) {
    const slug = file.name.replace('.md', '');
    const content = await fetchText(`${RAW}/${shelf.folder}/${file.name}`);
    const shortcut = extractShortcut(content);
    tools.push({
      slug, name: slugToName(slug), purpose: extractPurpose(content),
      shelf: shelf.key, url: `${BLOB}/${shelf.folder}/${file.name}`,
      created: extractCreatedDate(content), uses: usageData[slug] || 0,
      badge: BADGES[slug] || null, nicknames: NICKNAMES[slug] || null,
      shortcut, launchPrompt: shortcut ? extractLaunchPrompt(content) : ''
    });
  }
  return tools;
}

function renderTool(tool) {
  const badge = tool.badge ? `<span class="badge badge-${tool.badge}">${tool.badge}</span>` : '';
  const nicks = tool.nicknames ? `<span class="nicknames">${esc(tool.nicknames)}</span>` : '';
  const run = (tool.shortcut && tool.launchPrompt)
    ? `<a class="run-btn" href="${BRAIN_MAX_URL}" target="_blank" rel="noopener" data-prompt64="${b64(tool.launchPrompt)}" title="Copy prompt &amp; open Brain MAX">\u25B6 Run me</a>`
    : '';
  const nameInner = tool.url
    ? `<a href="${tool.url}" target="_blank" rel="noopener">${esc(tool.name)}</a>`
    : `<span class="no-profile">${esc(tool.name)}</span>`;
  const usesHtml = tool.uses > 0 ? `<span class="uses">${tool.uses}\u00D7</span>` : '';
  const dateHtml = tool.created ? `<span>${tool.created}</span>` : '';
  const searchData = `${tool.name} ${tool.purpose} ${tool.nicknames || ''}`.toLowerCase();
  return `<div class="tool" data-shelf="${tool.shelf}" data-search="${esc(searchData)}">
    <div class="tool-name">${nameInner}${badge}${nicks}${run}</div>
    <div class="tool-purpose">${esc(tool.purpose)}</div>
    <div class="tool-meta">${usesHtml}${dateHtml}</div>
  </div>`;
}

function renderSection(label, cssClass, shelfKey, tools) {
  if (tools.length === 0) return '';
  return `<section class="${cssClass}" data-shelf="${shelfKey}">
    <h2>${label}</h2>
    <div class="tool-list">${tools.map(renderTool).join('')}</div>
  </section>`;
}

function getSortedTools() {
  if (currentSort === 'created') return [...allTools].sort((a, b) => (b.created || '').localeCompare(a.created || ''));
  if (currentSort === 'usage') return [...allTools].sort((a, b) => b.uses - a.uses);
  return allTools;
}

function renderAll() {
  const content = document.getElementById('content');
  const sorted = getSortedTools();
  let html = '';
  if (currentSort !== 'shelf') {
    const label = currentSort === 'created' ? 'All tools (newest first)' : 'All tools (most used first)';
    html = `<section data-shelf="all"><h2>${label}</h2><div class="tool-list">${sorted.map(renderTool).join('')}</div></section>`;
  } else {
    for (const shelf of SHELVES) {
      html += renderSection(shelf.label, shelf.cssClass, shelf.key, sorted.filter(t => t.shelf === shelf.key));
    }
    const proseTools = PROSE_HOOKS.map(t => ({ ...t, slug: '', shelf: 'prose', url: null, created: null, uses: 0, badge: null, nicknames: null, shortcut: false, launchPrompt: '' }));
    html += renderSection('\u{1F504} Hooks (prose-only, no repo profile)', 'shelf-hooks', 'prose', proseTools);
    const triggerTools = TRIGGERS.map(t => ({ ...t, slug: '', shelf: 'triggers', url: null, created: null, uses: 0, badge: null, nicknames: null, shortcut: false, launchPrompt: '' }));
    html += renderSection('\u{1F3AF} Triggers (contextual, fire when signal matches)', 'shelf-triggers', 'triggers', triggerTools);
  }
  content.innerHTML = html;
  bindHeadings();
  applyFilters();
}

function updateCounts() {
  const hooks = allTools.filter(t => t.shelf === 'hooks').length;
  const gates = allTools.filter(t => t.shelf === 'gates').length;
  const agents = allTools.filter(t => t.shelf === 'agents').length;
  document.getElementById('count-hooks').textContent = hooks;
  document.getElementById('count-gates').textContent = gates;
  document.getElementById('count-prose').textContent = PROSE_HOOKS.length;
  document.getElementById('count-triggers').textContent = TRIGGERS.length;
  document.getElementById('count-agents').textContent = agents;
  document.getElementById('total-count').textContent = `${hooks + gates + agents + PROSE_HOOKS.length + TRIGGERS.length} total`;
}

function getActiveFilters() { return [...document.querySelectorAll('.pill.active')].map(p => p.dataset.filter); }

function applyFilters() {
  const active = getActiveFilters();
  const query = document.getElementById('search').value.toLowerCase().trim();
  const sections = document.querySelectorAll('#content section');
  let visibleCount = 0;
  sections.forEach(s => {
    const shelfMatch = active.length === 0 || active.includes(s.dataset.shelf) || s.dataset.shelf === 'all';
    const tools = s.querySelectorAll('.tool');
    let sectionHasVisible = false;
    tools.forEach(tool => {
      const searchData = tool.dataset.search || '';
      const toolShelf = tool.dataset.shelf;
      const textMatch = !query || searchData.includes(query);
      const filterMatch = shelfMatch || (active.length > 0 && active.includes(toolShelf));
      const visible = filterMatch && textMatch;
      tool.classList.toggle('hidden', !visible);
      if (visible) { sectionHasVisible = true; visibleCount++; }
    });
    s.classList.toggle('hidden', !sectionHasVisible);
  });
  document.getElementById('no-results').classList.toggle('visible', visibleCount === 0);
}

function bindHeadings() {
  document.querySelectorAll('#content section h2').forEach(h2 => {
    h2.addEventListener('click', () => {
      const shelf = h2.closest('section').dataset.shelf;
      const pill = document.querySelector(`.pill[data-filter="${shelf}"]`);
      if (pill) { pill.classList.toggle('active'); applyFilters(); }
    });
  });
}

// ---- Run-me launcher ----
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3400);
}

async function copyToClipboard(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch (e) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.top = '-1000px'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.focus(); ta.select();
      const ok = document.execCommand('copy'); document.body.removeChild(ta); return ok;
    } catch (e2) { return false; }
  }
}

function bindLaunch() {
  document.getElementById('content').addEventListener('click', async (e) => {
    const btn = e.target.closest('.run-btn');
    if (!btn) return;
    const prompt = unb64(btn.dataset.prompt64 || '');
    if (!prompt) return;
    const ok = await copyToClipboard(prompt);
    showToast(ok
      ? 'Prompt copied \u2192 opening Brain MAX. Paste, pick your agent, hit send.'
      : 'Auto-copy blocked here. The prompt is still in this tab \u2014 copy it manually before you switch.');
    // The anchor's default action opens BRAIN_MAX_URL in a new tab.
  });
}

async function init() {
  await loadUsageLog();
  for (const shelf of SHELVES) { allTools.push(...await loadShelf(shelf)); }
  document.getElementById('loading').style.display = 'none';
  updateCounts();
  renderAll();
  bindLaunch();
  document.querySelectorAll('.pill').forEach(pill => pill.addEventListener('click', () => { pill.classList.toggle('active'); applyFilters(); }));
  document.getElementById('search').addEventListener('input', applyFilters);
  document.querySelectorAll('.sort-btn').forEach(btn => btn.addEventListener('click', () => {
    currentSort = btn.dataset.sort;
    document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderAll();
  }));
  document.getElementById('clear-cache').addEventListener('click', clearCache);
}

init();
