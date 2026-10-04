// app.js: state, routing, events. Hash routes:
//   #/                          Launch Center (every app under maw-prose apps/)
//   #/<app>/tables              Manage Database, Tables tab
//   #/<app>/fields/<Table>      Fields tab
//   #/<app>/fields/<Table>/<F>  Fields tab with one field open
import { loadTree, loadFile } from './github.js?v=2';
import { appsFrom, titleOf, orderFrom, sortTables } from './repo.js?v=2';
import { parseTable, fieldsFromTsv, validate, issueCount } from './parse.js?v=2';
import * as V from './views.js?v=2';

const $ = id => document.getElementById(id);
const S = { tree: null, apps: [], tables: new Map(), run: 0 };
const SORT_KEY = 'fmpr.sort';

function status(msg, kind) { const s = $('status'); s.textContent = msg; s.className = 'status status--' + (kind || 'ok'); }

async function boot(force) {
  status('reading maw-prose…', 'busy');
  try {
    S.tree = await loadTree(force);
    if (force) S.tables.clear();
    S.apps = appsFrom(S.tree.paths);
    $('foot').innerHTML = V.foot(S.tree);
    await route();
    titles();
  } catch (e) {
    status(e.message, 'bad');
    $('view').innerHTML = V.failure(e.message);
  }
}

// App names come from each app's own README title, filled in as they arrive.
function titles() {
  for (const a of S.apps) {
    if (!a.readme || a.title) continue;
    loadFile(S.tree.sha, a.readme).then(md => {
      a.title = titleOf(md);
      document.querySelectorAll('[data-title="' + CSS.escape(a.slug) + '"]').forEach(n => { n.textContent = a.title || a.slug; });
    }).catch(() => {});
  }
}

async function loadApp(app) {
  if (S.tables.has(app.slug)) return S.tables.get(app.slug);
  const sha = S.tree.sha;
  const [readme, ...notes] = await Promise.all([
    app.tablesReadme ? loadFile(sha, app.tablesReadme).catch(() => '') : '',
    ...app.tablePaths.map(p => loadFile(sha, p).then(md => parseTable(md, p)))
  ]);
  if (!app.title && app.readme) app.title = titleOf(await loadFile(sha, app.readme).catch(() => ''));
  // v2: a note that declares a TSV register gets its fields from that file.
  const have = new Set(S.tree.paths);
  await Promise.all(notes.filter(t => t.register).map(t => {
    if (!have.has(t.register)) { t.registerMissing = true; return null; }
    return loadFile(sha, t.register).then(tsv => fieldsFromTsv(tsv, t)).catch(() => { t.registerMissing = true; });
  }));
  const tables = validate(sortTables(notes, orderFrom(readme)));
  app.ids = {};
  tables.forEach(t => { if (t.id) app.ids[t.id] = '#/' + encodeURIComponent(app.slug) + '/fields/' + encodeURIComponent(t.file); });
  S.tables.set(app.slug, tables);
  return tables;
}

const sortPref = () => { try { return localStorage.getItem(SORT_KEY) || 'creation order'; } catch (e) { return 'creation order'; } };

async function route() {
  if (!S.tree) return;
  const run = ++S.run;
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  if (!parts.length) {
    $('view').innerHTML = V.launch(S.apps);
    document.title = 'FMP Renderer';
    status(S.apps.length + ' app folders in maw-prose', 'ok');
    return;
  }
  const app = S.apps.find(a => a.slug === parts[0]);
  if (!app) { status('No app folder named “' + parts[0] + '” in maw-prose apps/.', 'warn'); $('view').innerHTML = V.launch(S.apps); return; }
  if (!S.tables.has(app.slug)) status('reading ' + app.tablePaths.length + ' table notes from ' + app.slug + '…', 'busy');
  let tables;
  try { tables = await loadApp(app); } catch (e) { if (run === S.run) status(e.message, 'bad'); return; }
  if (run !== S.run) return; // a newer click won

  const tab = parts[1] === 'fields' && tables.length ? 'fields' : 'tables';
  const issues = tables.reduce((n, t) => n + issueCount(t), 0);
  const summary = tables.length + ' table' + (tables.length === 1 ? '' : 's') + ' · ' + issues + ' issue' + (issues === 1 ? '' : 's');
  let body, sel = '';
  if (tab === 'tables') body = V.tablesTab(app, tables);
  else {
    // Routes use the FILE stem (stable, no spaces); names and ids still resolve.
    const want = String(parts[2] || '').toLowerCase();
    const t = tables.find(x => x.file.toLowerCase() === want) || tables.find(x => x.name.toLowerCase() === want || x.id === parts[2]) || tables[0];
    sel = t.file;
    body = V.fieldsTab(app, tables, t, parts[3], sortPref());
  }
  const keep = keepScroll();
  $('view').innerHTML = V.dialog(app, tab, sel, body, summary);
  keep();
  document.title = (sel ? (tables.find(x => x.file === sel) || {}).name + ' · ' : '') + (app.title || app.slug) + ' · FMP Renderer';
  status(issues ? issues + ' spec issue' + (issues === 1 ? '' : 's') + ' shown in place, marked in red' : 'no spec issues found', issues ? 'warn' : 'ok');
}

// Opening a field re-renders the screen; keep the list where the reader left it.
function keepScroll() {
  const l = document.querySelector('.list--f'), top = l ? l.scrollTop : 0, y = window.scrollY;
  return () => { const n = document.querySelector('.list--f'); if (n) n.scrollTop = top; window.scrollTo(0, y); };
}

document.addEventListener('change', e => {
  const parts = location.hash.replace(/^#\/?/, '').split('/');
  if (e.target.id === 'tblsel') location.hash = '#/' + parts[0] + '/fields/' + encodeURIComponent(e.target.value);
  if (e.target.id === 'sortby') { try { localStorage.setItem(SORT_KEY, e.target.value); } catch (x) {} route(); }
});
document.addEventListener('click', e => {
  if (e.target.id === 'refresh' || e.target.id === 'retry') boot(true);
});
// Up/Down walks the field list, the way it does in FileMaker.
document.addEventListener('keydown', e => {
  if ((e.key !== 'ArrowDown' && e.key !== 'ArrowUp') || /select|input|textarea/i.test(e.target.tagName)) return;
  const rows = [...document.querySelectorAll('.row--f[data-field]')];
  if (!rows.length) return;
  const i = rows.findIndex(r => r.classList.contains('is-sel'));
  const next = rows[Math.max(0, Math.min(rows.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1)))];
  if (next && next !== rows[i]) { e.preventDefault(); location.hash = next.getAttribute('href'); }
});
window.addEventListener('hashchange', route);
boot(false);
