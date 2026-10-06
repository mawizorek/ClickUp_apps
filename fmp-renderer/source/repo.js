// repo.js: what exists in maw-prose apps/, derived from the file list alone.
// Every count here is a fact about the REPO (what has been written), never a
// claim about a FileMaker file. Nothing is maintained by hand, so nothing rots.
//
// Folder names are read through kindOf(), so the doc-render shape (tables/)
// and the older numbered shape (20-tables/) both land in the same bucket while
// the moves into apps/ are in flight (maw-prose D-041).

export const KINDS = [
  ['tables', 'Tables'], ['relationships', 'Relationships'], ['layouts', 'Layouts'],
  ['scripts', 'Scripts'], ['value-lists', 'Value lists'], ['custom-functions', 'Functions'], ['calculations', 'Calculations']
];
const ALIAS = { functions: 'custom-functions' };
export const kindOf = dir => { const k = dir.toLowerCase().replace(/^\d+[-_]/, ''); return ALIAS[k] || k; };
const isIndex = n => /^(readme|index)\.md$/i.test(n);
const isDoc = n => !isIndex(n) && !/\.notes\.md$/i.test(n) && !/\.tsv$/i.test(n) && !n.startsWith('.');

export function appsFrom(paths) {
  const map = new Map();
  for (const p of paths) {
    const m = p.match(/^apps\/([^/]+)\/(.+)$/);
    if (!m || /^[._]/.test(m[1])) continue;
    if (!map.has(m[1])) map.set(m[1], { slug: m[1], title: '', counts: {}, tablePaths: [], scriptPaths: [], readme: '', tablesReadme: '' });
    const a = map.get(m[1]), seg = m[2].split('/'), leaf = seg[seg.length - 1], kind = seg.length > 1 ? kindOf(seg[0]) : '';
    if (seg.length === 1 && isIndex(leaf) && (!a.readme || /^index/i.test(leaf))) a.readme = p;
    if (seg.length === 2 && kind === 'tables' && isIndex(leaf) && (!a.tablesReadme || /^index/i.test(leaf))) a.tablesReadme = p;
    if (kind && KINDS.some(k => k[0] === kind) && isDoc(leaf)) a.counts[kind] = (a.counts[kind] || 0) + 1;
    if (seg.length === 2 && kind === 'tables' && /\.md$/i.test(leaf) && isDoc(leaf)) a.tablePaths.push(p);
    // A script is its .fmscript, at any depth under scripts/ (folders mirror Script Workspace).
    if (kind === 'scripts' && /\.fmscript$/i.test(leaf)) a.scriptPaths.push(p);
  }
  return [...map.values()].sort((x, y) => x.slug.localeCompare(y.slug));
}

export const titleOf = md => {
  const s = String(md), fm = s.match(/^---\n[\s\S]*?\ntitle:\s*["']?(.+?)["']?\s*\n[\s\S]*?\n---/);
  if (fm) return fm[1].trim();
  const m = s.match(/^#\s+(.+)$/m); return m ? m[1].replace(/[*`]/g, '').trim() : '';
};

// A tables index that links its notes in order sets the Tables tab order.
export function orderFrom(readme) {
  const order = [], re = /\]\(\.?\/?([^)/#\s]+\.md)\)/g;
  let m;
  while ((m = re.exec(String(readme)))) if (!order.includes(m[1])) order.push(m[1]);
  return order;
}

// Sort: front-matter order: first (the doc renderer's rule), then the index's
// link order, then A to Z.
export function sortTables(tables, order) {
  const at = t => { const i = order.indexOf(t.path.split('/').pop()); return i < 0 ? 1e6 : i; };
  const ord = t => (typeof t.order === 'number' ? t.order : 1e9);
  return tables.slice().sort((a, b) => ord(a) - ord(b) || at(a) - at(b) || a.name.localeCompare(b.name));
}

// Scripts as the Script Workspace lists them: by folder, then name.
export function scriptsFrom(app) {
  return app.scriptPaths.map(p => {
    const rel = p.replace(/^apps\/[^/]+\/scripts\//, '').replace(/\.fmscript$/i, '');
    const cut = rel.lastIndexOf('/');
    return { path: p, rel, name: rel.slice(cut + 1), folder: cut < 0 ? '' : rel.slice(0, cut) };
  }).sort((a, b) => a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name));
}
