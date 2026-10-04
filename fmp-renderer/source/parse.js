// parse.js: ONE table note in, data out. No DOM, no fetch.
//
// It reads the shape maw-prose already writes, with no front matter (D-030):
//   # Title  ·  "Manage → Database → …" breadcrumb  ·  a "Grain:" paragraph  ·
//   "## Fields" then a markdown table whose HEADER names the columns.
// Columns are found by header name, never by position, so a note that adds or
// reorders a column still parses. Everything else in the note is kept as prose.
import { cells, joinPath } from './md.js?v=1';

const TYPES = { text: 'Text', number: 'Number', date: 'Date', time: 'Time', timestamp: 'Timestamp', container: 'Container' };
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

export function fmType(raw) {
  const r = String(raw || '').trim();
  let m = r.match(/^\(\s*c\s*(?:→|->)\s*([^)]+)\)/i);
  if (m) return { label: 'Calculation', detail: 'result ' + cap(m[1].trim()) };
  m = r.match(/^\(\s*s\s*(?:→|->)\s*([^)]+)\)/i);
  if (m) return { label: 'Summary', detail: m[1].trim() };
  const k = r.toLowerCase();
  if (k === 'text-uuid') return { label: 'Text', detail: 'UUID key' };
  if (TYPES[k]) return { label: TYPES[k] };
  m = k.match(/^(text|number|date|time|timestamp|container)[-\s(]+(.*)$/);
  if (m) return { label: TYPES[m[1]], detail: r.slice(m[1].length).replace(/^[-\s(]+|\)\s*$/g, '') };
  return { label: r || '—', unknown: true };
}

function keyOf(h) {
  const k = h.toLowerCase().replace(/[*`_]/g, '').trim();
  if (k === 'field' || k === 'field name' || k === 'name') return 'name';
  if (k === 'type') return 'type';
  if (k.includes('comment')) return 'comment';
  if (k === 'to' || k.includes('occurrence') || k === 'points at') return 'to';
  if (k.includes('⚠') || k === 'flag' || k === 'flags') return 'flag';
  return null;
}

const GRAIN = /^\s*\**\s*grain\s*:?\s*\**\s*:?\s*/i;

export function parseTable(md, path) {
  const file = path.split('/').pop().replace(/\.md$/i, '');
  const L = String(md).replace(/<!--[\s\S]*?-->/g, '').replace(/\r\n/g, '\n').split('\n');
  const t = { path, file, name: '', grain: '', fields: [], fieldsFound: false, notes: '', defects: [] };
  const notes = [];
  let i = 0;
  while (i < L.length) {
    const l = L[i];
    if (!t.name && /^#\s+/.test(l)) { t.name = l.replace(/^#\s+/, '').trim(); i++; continue; }
    if (/^\s*Manage\s*(→|->)/.test(l)) { i++; continue; }
    if (!t.grain && GRAIN.test(l) && /grain/i.test(l.slice(0, 12))) {
      const buf = [l.replace(GRAIN, '')]; i++;
      while (i < L.length && L[i].trim() && !/^#/.test(L[i])) buf.push(L[i++].trim());
      t.grain = buf.join(' ').trim(); continue;
    }
    if (!t.fieldsFound && /^##\s+fields\b/i.test(l)) {
      i++;
      while (i < L.length && !/^\s*\|/.test(L[i]) && !/^#/.test(L[i])) i++;
      const rows = [];
      while (i < L.length && /^\s*\|/.test(L[i])) rows.push(L[i++]);
      if (rows.length) { t.fieldsFound = true; t.fields = fieldsFrom(rows, path); }
      continue;
    }
    notes.push(l); i++;
  }
  t.name = t.name || file;
  t.notes = notes.join('\n').trim();
  return t;
}

function fieldsFrom(rows, path) {
  const keys = cells(rows[0]).map(keyOf);
  return rows.slice(1).filter(r => !/^[\s|:-]+$/.test(r)).map((r, n) => {
    const c = cells(r), f = { order: n, name: '', href: '', type: '', comment: '', to: '', toRaw: '', flag: '', defects: [] };
    keys.forEach((k, j) => { if (k) f[k] = c[j] || ''; });
    const link = f.name.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) { f.name = link[1]; f.href = joinPath(path, link[2]); }
    f.name = f.name.replace(/[`*]/g, '').trim();
    if (f.to) { f.toRaw = f.to; f.to = f.to.replace(/^[\s→\->]+/, '').split(/[\s,;(]/)[0].replace(/[`*]/g, ''); }
    return f;
  }).filter(f => f.name);
}

// Validation RENDERS (Sep 25 ruling): nothing here fails a load. Each finding
// is attached to the row it belongs to and painted in place.
export function validate(tables) {
  const names = new Set();
  tables.forEach(t => { names.add(t.name); names.add(t.file); });
  for (const t of tables) {
    t.defects = [];
    if (!t.grain) t.defects.push('No grain stated. A table note opens with what one record means.');
    if (!t.fieldsFound) t.defects.push('No “## Fields” table, so this note cannot render as fields.');
    const seen = new Set();
    for (const f of t.fields) {
      f.defects = [];
      if (seen.has(f.name)) f.defects.push('Duplicate field name in this table.');
      seen.add(f.name);
      f.toMissing = !!(f.to && !names.has(f.to));
      if (f.toMissing) f.defects.push('Points at ' + f.to + ', which has no table note in this app.');
      if (fmType(f.type).unknown) f.defects.push('Type “' + (f.type || 'blank') + '” is not a FileMaker field type this renderer knows.');
    }
  }
  return tables;
}

export const issueCount = t => t.defects.length + t.fields.reduce((n, f) => n + f.defects.length, 0);
