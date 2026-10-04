// repo.js: what exists in maw-prose apps/, derived from the file list alone.
// Every count here is a fact about the REPO (what has been written), never a
// claim about a FileMaker file. Nothing is maintained by hand, so nothing rots.

export const KINDS = [
  ['tables', 'Tables'], ['relationships', 'Relationships'], ['layouts', 'Layouts'],
  ['scripts', 'Scripts'], ['value-lists', 'Value lists'], ['calculations', 'Calculations']
];
const isDoc = n => !/^readme\.md$/i.test(n) && !/\.notes\.md$/i.test(n) && !n.startsWith('.');

export function appsFrom(paths) {
  const map = new Map();
  for (const p of paths) {
    const m = p.match(/^apps\/([^/]+)\/(.+)$/);
    if (!m || /^[._]/.test(m[1])) continue;
    if (!map.has(m[1])) map.set(m[1], { slug: m[1], title: '', counts: {}, tablePaths: [], readme: '', tablesReadme: '' });
    const a = map.get(m[1]), seg = m[2].split('/'), leaf = seg[seg.length - 1];
    if (seg.length === 1 && /^readme\.md$/i.test(leaf)) a.readme = p;
    if (seg.length === 2 && seg[0] === 'tables' && /^readme\.md$/i.test(leaf)) a.tablesReadme = p;
    if (seg.length > 1 && KINDS.some(k => k[0] === seg[0]) && isDoc(leaf)) a.counts[seg[0]] = (a.counts[seg[0]] || 0) + 1;
    if (seg.length === 2 && seg[0] === 'tables' && /\.md$/i.test(leaf) && isDoc(leaf)) a.tablePaths.push(p);
  }
  return [...map.values()].sort((x, y) => x.slug.localeCompare(y.slug));
}

export const titleOf = md => { const m = String(md).match(/^#\s+(.+)$/m); return m ? m[1].replace(/[*`]/g, '').trim() : ''; };

// A tables/README that links its notes in order ("the way the money moves")
// sets the Tables tab order. Anything it does not mention sorts after, A to Z.
export function orderFrom(readme) {
  const order = [], re = /\]\(\.?\/?([^)/#\s]+\.md)\)/g;
  let m;
  while ((m = re.exec(String(readme)))) if (!order.includes(m[1])) order.push(m[1]);
  return order;
}

export function sortTables(tables, order) {
  const at = t => { const i = order.indexOf(t.path.split('/').pop()); return i < 0 ? 1e6 : i; };
  return tables.slice().sort((a, b) => at(a) - at(b) || a.name.localeCompare(b.name));
}
