// front.js: the template-docs header, read just far enough for this app.
// Not a YAML parser. It reads the subset the doc renderer's pages use: scalars,
// [a, b] lists, and nested maps by indentation (data: slot: file:).
// It also reports the one header mistake that silently drops a page from the
// published site: an unquoted value containing ": " (uritp-docs data-tables).

function scalar(v) {
  v = v.replace(/\s+#.*$/, '').trim();
  if (/^".*"$|^'.*'$/.test(v)) return v.slice(1, -1);
  if (/^\[.*\]$/.test(v)) return v.slice(1, -1).split(',').map(x => scalar(x)).filter(x => x !== '');
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  if (v === 'true' || v === 'false') return v === 'true';
  return v;
}

export function frontMatter(src) {
  const m = String(src).match(/^---\n([\s\S]*?)\n---[ \t]*(?:\n|$)/);
  if (!m) return { fm: null, body: String(src), warn: [] };
  const root = {}, stack = [{ ind: -1, obj: root }], warn = [];
  for (const raw of m[1].split('\n')) {
    if (!raw.trim() || /^\s*#/.test(raw)) continue;
    const ind = raw.match(/^\s*/)[0].length, kv = raw.trim().match(/^([\w.-]+):\s*(.*)$/);
    if (!kv) continue;
    while (stack.length > 1 && ind <= stack[stack.length - 1].ind) stack.pop();
    const parent = stack[stack.length - 1].obj, val = kv[2].replace(/\s+#.*$/, '');
    if (val === '') { parent[kv[1]] = {}; stack.push({ ind, obj: parent[kv[1]] }); continue; }
    if (!/^["'[]/.test(val) && /:\s/.test(val)) warn.push('Header key `' + kv[1] + '` holds an unquoted ": ", so the doc renderer cannot parse this page and drops it from the site. Quote the value.');
    parent[kv[1]] = scalar(val);
  }
  return { fm: root, body: String(src).slice(m[0].length), warn };
}

export const REQUIRED = ['id', 'title', 'status', 'type', 'summary'];
