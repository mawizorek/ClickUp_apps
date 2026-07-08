/* app-dashboard — data module. APP_META + SAMPLE (ClickUp window) and FM_META + FM_SAMPLE (FileMaker window).
 Optional per-entry `label` overrides the auto-titlecased folder name (for acronyms/casing the
 titlecaser can't infer). Optional `mono` overrides the derived monogram.
 Optional `status:'retired'` (+ optional `supersededBy:'<slug>'`) marks an app retired: hidden by
 default in the view, revealed by the "Show retired" toggle (see the augmentation block at the end). */

// ClickUp window: slug -> metadata. Categories: 'dashboard' | 'tool'.
const APP_META = {
 'world-cup-bracket': { desc: 'Live tournament bracket with match results and progression.', category: 'dashboard', badges: ['dashboard'] },
 'f1-racetracks': { label: 'F1 Racetracks', desc: 'Interactive race circuit explorer with live circuit data, layouts, and session timing.', category: 'dashboard', badges: ['data'] },
 'on-track': { desc: 'Live motorsport "what\'s on now" schedule across series, with a settings drawer and collapsible filters.', category: 'dashboard', badges: ['data'] },
 'routines': { desc: 'Live schedule view of the automated repo refresh routines. Reads schedule.md, zero upkeep.', category: 'dashboard', badges: ['dashboard'] },
 'prism': { desc: 'Data App Viewer. Drop JSON or Markdown; JSON becomes a readable table with CSV/Excel export.', category: 'tool', badges: ['tool'] },
 'file-chunker': { desc: 'Split large files into AI-readable chunks with verification headers and a markdown index.', category: 'tool', badges: ['tool'] },
 'budget-code-mapper': { desc: 'Budget code authority lookup and export tool.', category: 'tool', badges: ['data'] },
 'markdown-viewer': { desc: 'Mobile-first markdown reader. Superseded by Prism (reads Markdown + JSON).', category: 'tool', badges: ['tool'], status: 'retired', supersededBy: 'prism' },
 'pdf-splitter': { label: 'PDF Splitter', desc: 'Extract and split PDF pages entirely client-side.', category: 'tool', badges: ['tool'] },
 'polish-demo': { desc: 'Gated working example of the full app polish standard.', category: 'tool', badges: ['tool'] },
 'quickfire': { desc: 'Quick vibe-to-repo artifact sketches.', category: 'tool', badges: ['tool'] }
};

// ClickUp offline sample: only used when the GitHub API is unreachable (e.g. the ClickUp preview sandbox).
const SAMPLE = [
 { name:'prism', hoursAgo:0.2, commitCount:8, commits:[['v1 initial build (JSON + Markdown lenses)',0.2],['json lens: flatten + flags + CSV/Excel export',1],['markdown lens folded in from markdown-viewer',2]] },
 { name:'on-track', hoursAgo:0.1, commitCount:12, commits:[['settings drawer + collapsible filters',0.1],['per-dropdown select-all / clear',6],['timezone toggle in settings',14],['live refresh note',26],['initial schedule engine',40]] },
 { name:'f1-racetracks', hoursAgo:0.4, commitCount:37, commits:[['unify cache-bust build stamp across all source loads',0.4],['footer wrap fix at 320px',9],['data.json retrofit (v5)',30],['live-tracker companion',52],['v4 circuit explorer',96]] },
 { name:'world-cup-bracket', hoursAgo:20, commitCount:14, commits:[['bump contrast + live updated badge (v1.3)',20],['today filter dynamic',28],['icon.png + manifest',44],['fix Switzerland vs Algeria date',50],['v1 bracket',120]] },
 { name:'routines', hoursAgo:1, commitCount:8, commits:[['add passive live schedule viewer',1],['world-cup refresh runbook',40],['schedule ledger',60]] },
 { name:'markdown-viewer', hoursAgo:52, commitCount:9, commits:[['v3 mobile-first reader',52],['drop-zone done-state',70],['v2 parser fix',110]] },
 { name:'budget-code-mapper', hoursAgo:96, commitCount:22, commits:[['retrofit data.json split (v6)',96],['export wrapper (three-context)',130],['v5 authority builder',180]] },
 { name:'file-chunker', hoursAgo:150, commitCount:41, commits:[['v16.2 source_index rename',150],['INDEX_FILENAME const',175],['zip README metadata',210]] },
 { name:'pdf-splitter', hoursAgo:200, commitCount:6, commits:[['scaffold client-side page extract',200],['README',215]] },
 { name:'polish-demo', hoursAgo:220, commitCount:4, commits:[['gated example of polish standard',220],['access gate config',235]] },
 { name:'quickfire', hoursAgo:240, commitCount:3, commits:[['index + first sketch',240]] }
];

// FileMaker window: folder under filemaker/ -> metadata. No Pages hosting, no health check.
const FM_META = {
 '_template-fmp-app': { label: 'FMP App Template', mono: 'FM', desc: 'FileMaker app scaffold: schema JSON shape, the standard doc set, and the build workflow for new FMP solutions.' },
 'hml-llc': { label: 'HML LLC', desc: 'HML_LLC pilot FileMaker solution — schema JSON plus the 11-doc build set.' }
};

// FileMaker offline sample.
const FM_SAMPLE = [
 { name:'hml-llc', hoursAgo:5, commitCount:11, commits:[['schema JSON + 11 build docs',5],['pilot scaffold',30]] },
 { name:'_template-fmp-app', hoursAgo:30, commitCount:6, commits:[['fmp app template',30],['standard doc set',48]] }
];

/* ---- Retired-status augmentation (ADDITIVE) ----------------------------------------------
 Lives in data.js on purpose: the loader (index.html) and render module carry inline HTML that
 the agent read path flattens, so rewriting them risks a regression. This block needs none of
 that — it reads `status:'retired'` from APP_META (above), and after each render it tags matching
 rows, injects a "Show retired" toggle into the existing #filterRow, and adds a Retired badge +
 superseded link. Visibility composes with the existing category filter through independent CSS
 (body.hide-retired), so app.js/render.js are untouched. FileMaker rows aren't in APP_META, so
 they never match and this is a no-op in that window. */
(function () {
 var SHOW_KEY = 'appDashboard_showRetired';
 var META = (typeof APP_META !== 'undefined') ? APP_META : {};
 var BASE = (typeof PAGES_BASE !== 'undefined') ? PAGES_BASE : 'https://mawizorek.github.io/ClickUp_apps';

 function injectCSS() {
 if (document.getElementById('retired-style')) return;
 var s = document.createElement('style');
 s.id = 'retired-style';
 s.textContent =
 '.row[data-retired="1"]{opacity:.5;transition:opacity .2s}' +
 '.row[data-retired="1"]:hover{opacity:.9}' +
 'body.hide-retired .row[data-retired="1"]{display:none!important}' +
 '.retired-note{margin-top:6px;font-size:.68rem;font-weight:600;color:oklch(65% .18 25);display:flex;gap:8px;align-items:center;flex-wrap:wrap}' +
 '.retired-note .rtag{padding:2px 7px;border-radius:5px;background:oklch(22% .05 25);border:1px solid oklch(38% .09 25);letter-spacing:.04em;text-transform:uppercase;font-size:.6rem}' +
 '.retired-note a{color:oklch(75% .16 55);text-decoration:none}' +
 '.retired-note a:hover{text-decoration:underline}' +
 '.retired-toggle{display:inline-flex;align-items:center;gap:7px;padding:8px 14px;border-radius:20px;font-size:.75rem;font-weight:700;border:1px solid var(--border,#2a2f3a);background:var(--surface-1,#1a1e26);color:var(--text-muted,#8a90a0);cursor:pointer;white-space:nowrap;user-select:none;-webkit-user-select:none}' +
 '.retired-toggle .rbox{width:26px;height:15px;border-radius:20px;background:oklch(30% .01 250);border:1px solid var(--border,#2a2f3a);position:relative;transition:background .15s}' +
 '.retired-toggle .rbox::after{content:"";position:absolute;top:1px;left:1px;width:11px;height:11px;border-radius:50%;background:oklch(55% .01 250);transition:transform .18s,background .15s}' +
 '.retired-toggle.on{border-color:oklch(65% .18 25);color:var(--text,#e7e8ee)}' +
 '.retired-toggle.on .rbox{background:oklch(65% .18 25 / .35);border-color:oklch(65% .18 25)}' +
 '.retired-toggle.on .rbox::after{transform:translateX(11px);background:oklch(65% .18 25)}' +
 '.retired-sep{width:1px;height:20px;background:var(--border,#2a2f3a);flex:none;margin:0 2px}';
 document.head.appendChild(s);
 }

 function ensureToggle() {
 var row = document.getElementById('filterRow');
 if (!row || document.getElementById('retiredToggle')) return;
 var sep = document.createElement('span'); sep.className = 'retired-sep';
 var t = document.createElement('button');
 t.id = 'retiredToggle'; t.type = 'button'; t.className = 'retired-toggle';
 t.innerHTML = '<span class="rbox"></span>Show retired';
 t.addEventListener('click', function (e) {
 e.stopPropagation();
 var on = document.body.classList.toggle('hide-retired') === false;
 t.classList.toggle('on', on);
 t.setAttribute('aria-pressed', on ? 'true' : 'false');
 try { localStorage.setItem(SHOW_KEY, on ? '1' : '0'); } catch (x) {}
 });
 row.appendChild(sep); row.appendChild(t);
 var show = false; try { show = localStorage.getItem(SHOW_KEY) === '1'; } catch (x) {}
 document.body.classList.toggle('hide-retired', !show);
 t.classList.toggle('on', show);
 t.setAttribute('aria-pressed', show ? 'true' : 'false');
 }

 function tagRows() {
 var list = document.getElementById('list'); if (!list) return;
 var rows = list.querySelectorAll('.row[data-category]');
 rows.forEach(function (row) {
 var link = row.querySelector('.tile-link'); if (!link) return;
 var slug = link.getAttribute('data-slug'); if (!slug) return;
 var meta = META[slug];
 if (meta && meta.status === 'retired') {
 row.setAttribute('data-retired', '1');
 if (!row.querySelector('.retired-note')) {
 var info = row.querySelector('.info') || row;
 var note = document.createElement('div');
 note.className = 'retired-note';
 var sup = meta.supersededBy;
 var supName = sup ? sup.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }) : null;
 note.innerHTML = '<span class="rtag">Retired</span>' +
 (sup ? '<span>\u2192 superseded by <a href="' + BASE + '/' + sup + '/" target="_blank" rel="noopener">' + supName + '</a></span>' : '');
 info.appendChild(note);
 }
 }
 });
 }

 function boot() {
 injectCSS(); ensureToggle(); tagRows();
 var list = document.getElementById('list');
 if (list && window.MutationObserver) {
 new MutationObserver(function () { tagRows(); }).observe(list, { childList: true });
 }
 }
 if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
 else boot();
})();
