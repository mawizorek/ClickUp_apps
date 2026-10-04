// parse.js: ONE table note in, data out. No DOM, no fetch.
//
// Reads two shapes. The target (maw-prose D-041, Production MAWster's shape):
//   template-docs front matter · # Title · !!! abstract "Grain" callout ·
//   a field register in a sibling .tsv, declared under data: and placed with
//   !!! data "<slot>".
// The older shape still reads while notes move: a "Grain:" line and a markdown
// table under "## Fields". It renders, with an amber notice that it is old.
// Columns are found by header NAME, never position, in both shapes.
import { cells, joinPath } from './md.js?v=2';
import { frontMatter, REQUIRED } from './front.js?v=2';

const TYPES = { text: 'Text', number: 'Number', date: 'Date', time: 'Time', timestamp: 'Timestamp', container: 'Container' };
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
export const plain = s => String(s || '').replace(/\[([^\]]*)\]\{\.[\w-]+\}/g, '$1').replace(/[`*]/g, '').trim();

export function fmType(raw) {
  const r = plain(raw);
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
  const k = h.replace(/::.*$/, '').toLowerCase().replace(/[*`]/g, '').replace(/_/g, ' ').trim();
  if (k === 'field' || k === 'field name' || k === 'name') return 'name';
  if (k === 'type') return 'type';
  if (k === 'options') return 'options';
  if (k.includes('comment') || k === 'notes' || k === 'note') return 'comment';
  if (k === 'to' || k.includes('occurrence') || k === 'points at') return 'to';
  if (k.includes('⚠') || k === 'flag' || k === 'flags') return 'flag';
  if (k === 'status' || k === 'group') return 'group';
  return null;
}

const GRAIN = /^\s*\**\s*grain\s*:?\s*\**\s*:?\s*/i;
const CALLOUT = /^!!!\s+([\w-]+)(?:\s+"([^"]*)")?\s*$/;
const blank = n => ({ order: n, name: '', href: '', type: '', options: '', comment: '', to: '', toRaw: '', flag: '', group: '', defects: [] });

function calloutBody(L, i) {
  const out = [];
  while (i < L.length && (/^(\s{4}|\t)/.test(L[i]) || (!L[i].trim() && i + 1 < L.length && /^(\s{4}|\t)/.test(L[i + 1])))) out.push(L[i++].replace(/^(\s{4}|\t)/, ''));
  return { out, i };
}

function finish(f, path) {
  const link = f.name.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
  if (link) { f.name = link[1]; f.href = joinPath(path, link[2]); }
  f.name = plain(f.name);
  if (f.to) { f.toRaw = f.to; f.to = plain(f.to).replace(/^[\s→\->]+/, '').split(/[\s,;(]/)[0]; }
  return f;
}

export function parseTable(md, path) {
  const file = path.split('/').pop().replace(/\.md$/i, '');
  const { fm, body, warn } = frontMatter(String(md).replace(/\r\n/g, '\n'));
  const h = fm || {};
  const t = { path, file, id: h.id || '', title: h.title || '', summary: h.summary || '', revised: h.revised || '', status: h.status || '',
    order: typeof h.order === 'number' ? h.order : null, name: '', grain: '', fields: [], fieldsFound: false, legacyFields: false,
    register: '', slot: '', blankRows: 0, notes: '', defects: [], notices: [], fmWarn: warn, hasFm: !!fm, fmMissing: fm ? REQUIRED.filter(k => !(k in h)) : [] };
  const slots = h.data && typeof h.data === 'object' ? h.data : {};
  const L = body.replace(/<!--[\s\S]*?-->/g, '').split('\n'), notes = [];
  let heading = '', i = 0, placed = false;
  while (i < L.length) {
    const l = L[i];
    if (!heading && /^#\s+/.test(l)) { heading = l.replace(/^#\s+/, '').trim(); i++; continue; }
    if (/^\s*Manage\s*(→|->)/.test(l)) { i++; continue; }
    if (!t.grain && GRAIN.test(l) && /grain/i.test(l.slice(0, 12)) && !CALLOUT.test(l)) {
      const buf = [l.replace(GRAIN, '')]; i++;
      while (i < L.length && L[i].trim() && !/^#/.test(L[i])) buf.push(L[i++].trim());
      t.grain = buf.join(' ').trim(); continue;
    }
    const c = l.match(CALLOUT);
    if (c) {
      const b = calloutBody(L, i + 1);
      if (/^grain$/i.test(c[2] || '') && !t.grain) { t.grain = b.out.join(' ').replace(/\s+/g, ' ').trim(); i = b.i; continue; }
      if (c[1] === 'data') {
        const s = slots[c[2]];
        if (s && s.file && !t.register) { t.register = joinPath(path, s.file); t.slot = c[2]; placed = true; }
        i = b.i; continue;
      }
      notes.push(l, ...b.out.map(x => '    ' + x)); i = b.i; continue;
    }
    if (!t.fieldsFound && /^##\s+fields\b/i.test(l)) {
      let j = i + 1;
      while (j < L.length && !/^\s*\|/.test(L[j]) && !/^#/.test(L[j]) && !CALLOUT.test(L[j])) j++;
      const rows = [];
      while (j < L.length && /^\s*\|/.test(L[j])) rows.push(L[j++]);
      if (rows.length) { t.fieldsFound = t.legacyFields = true; t.fields = mdFields(rows, path); i = j; continue; }
      i++; continue; // an empty "## Fields" heading above a TSV is a label, not prose
    }
    notes.push(l); i++;
  }
  if (!t.register) { const first = Object.keys(slots).find(k => slots[k] && slots[k].file); if (first) { t.register = joinPath(path, slots[first].file); t.slot = first; } }
  t.unplaced = !!t.register && !placed;
  t.name = t.title || heading || file;
  t.notes = notes.join('\n').trim();
  return t;
}

function mdFields(rows, path) {
  const keys = cells(rows[0]).map(keyOf);
  return rows.slice(1).filter(r => !/^[\s|:-]+$/.test(r)).map((r, n) => {
    const c = cells(r), f = blank(n);
    keys.forEach((k, j) => { if (k && !f[k]) f[k] = c[j] || ''; });
    return finish(f, path);
  }).filter(f => f.name);
}

export function fieldsFromTsv(tsv, t) {
  const rows = String(tsv).replace(/\r\n/g, '\n').split('\n').filter(r => r.trim());
  if (!rows.length) return t;
  const keys = rows[0].split('\t').map(keyOf);
  t.fields = []; t.blankRows = 0;
  rows.slice(1).forEach(r => {
    const c = r.split('\t');
    if (/^-\s*EOF\s*-$/i.test(c.join('').trim())) return;
    const f = blank(t.fields.length);
    keys.forEach((k, j) => { if (k && !f[k]) f[k] = (c[j] || '').trim(); });
    finish(f, t.path);
    if (!f.name) { t.blankRows++; return; }
    t.fields.push(f);
  });
  t.fieldsFound = true;
  return t;
}

// Validation RENDERS (Sep 25 ruling): nothing here fails a load.
// RED = the spec has a problem. AMBER = the note is in the old shape (D-041).
export function validate(tables) {
  const names = new Set();
  tables.forEach(t => { names.add(t.name); names.add(t.file); if (t.id) names.add(t.id); });
  for (const t of tables) {
    t.defects = [...t.fmWarn]; t.notices = [];
    if (!t.grain) t.defects.push('No grain stated. A table note opens with what one record means.');
    if (t.registerMissing) t.defects.push('Register ' + t.register.split('/').pop() + ' is declared but is not in the repo.');
    else if (!t.fieldsFound) t.defects.push('No field register: no data slot pointing at a .tsv and no “## Fields” table.');
    if (t.blankRows) t.defects.push(t.blankRows + ' register row' + (t.blankRows === 1 ? ' has' : 's have') + ' no field name.');
    if (t.unplaced) t.notices.push('The data slot “' + t.slot + '” is declared but never placed with !!! data, so the published page will not show the register.');
    if (!t.hasFm) t.notices.push('No front matter yet. D-041 gives every page the template-docs header.');
    else if (t.fmMissing.length) t.notices.push('Header is missing: ' + t.fmMissing.join(', ') + '.');
    if (t.legacyFields) t.notices.push('Field register is a markdown table. D-041 moves it to a sibling .tsv.');
    const seen = new Set();
    for (const f of t.fields) {
      f.defects = [];
      if (seen.has(f.name)) f.defects.push('Duplicate field name in this table.');
      seen.add(f.name);
      f.toMissing = !!(f.to && !names.has(f.to));
      if (f.toMissing) f.defects.push('Points at ' + f.to + ', which has no table note in this app.');
      if (fmType(f.type).unknown) f.defects.push('Type “' + (plain(f.type) || 'blank') + '” is not a FileMaker field type this renderer knows.');
    }
  }
  return tables;
}

export const issueCount = t => t.defects.length + t.fields.reduce((n, f) => n + f.defects.length, 0);
