// views.js: HTML for every screen. Pure functions of data, no fetching.
import { esc, inline, block } from './md.js?v=2';
import { fmType, issueCount } from './parse.js?v=2';
import { blobUrl, editUrl, commitUrl } from './github.js?v=2';
import { KINDS } from './repo.js?v=3';

const enc = encodeURIComponent;
const plural = (n, w) => n + ' ' + w + (n === 1 ? '' : 's');
const GLYPH = '<svg viewBox="0 0 40 40" width="40" height="40"><rect x="6" y="4" width="28" height="32" rx="3" style="fill:var(--surface-3);stroke:var(--border)"/><rect x="11" y="11" width="18" height="3" rx="1" style="fill:var(--accent)"/><rect x="11" y="18" width="18" height="2" rx="1" style="fill:var(--text-faint)"/><rect x="11" y="23" width="13" height="2" rx="1" style="fill:var(--text-faint)"/><rect x="11" y="28" width="16" height="2" rx="1" style="fill:var(--text-faint)"/></svg>';

export function launch(apps) {
  const tiles = apps.map(a => {
    const counts = KINDS.map(([k, label]) => '<li' + (a.counts[k] ? '' : ' class="is-zero"') + '><b>' + (a.counts[k] || 0) + '</b> ' + label + '</li>').join('');
    return '<a class="tile" href="#/' + enc(a.slug) + '/tables"><span class="tile__glyph" aria-hidden="true">' + GLYPH + '</span>' +
      '<span class="tile__name" data-title="' + esc(a.slug) + '">' + esc(a.title || a.slug) + '</span>' +
      '<span class="tile__slug">apps/' + esc(a.slug) + '/</span><ul class="tile__counts">' + counts + '</ul></a>';
  }).join('');
  return '<section class="launch"><h1 class="launch__title">Open a FileMaker app</h1>' +
    '<p class="launch__sub">Counts are what has been written in maw-prose. They say nothing about what exists in a file.</p>' +
    '<div class="tiles">' + (tiles || '<p class="empty">No folders under apps/ yet.</p>') + '</div></section>';
}

export function dialog(app, tab, sel, body, summary) {
  const t = (id, label, href) => '<a role="tab" class="tab' + (tab === id ? ' is-on' : '') + '" aria-selected="' + (tab === id) + '" href="' + href + '">' + label + '</a>';
  const root = '#/' + enc(app.slug);
  const title = (tab === 'scripts' ? 'Script Workspace for “' : 'Manage Database for “') + esc(app.title || app.slug) + '”';
  return '<section class="dlg"><div class="dlg__bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>' +
    '<span class="dlg__title">' + title + '</span></div>' +
    '<nav class="tabs" role="tablist">' + t('tables', 'Tables', root + '/tables') + t('fields', 'Fields', root + '/fields' + (sel ? '/' + enc(sel) : '')) +
    '<span class="tab is-off" role="tab" aria-disabled="true" title="Not built yet. The relationship notes exist; the graph is the next screen.">Relationships</span>' +
    t('scripts', 'Scripts', root + '/scripts') + '</nav>' +
    '<div class="dlg__body">' + body + '</div>' +
    '<div class="dlg__foot"><a class="btn" href="#/">All apps</a><span>' + summary + '</span></div></section>';
}

const badge = n => n ? '<span class="badge" title="' + plural(n, 'spec issue') + '">' + n + '</span>' : '';

export function tablesTab(app, tables) {
  if (!tables.length) return '<p class="empty">No table notes in apps/' + esc(app.slug) + '/tables/ yet.</p>';
  const rows = tables.map(t => '<a class="row row--t" role="row" href="#/' + enc(app.slug) + '/fields/' + enc(t.file) + '">' +
    '<span class="c-name">' + esc(t.name) + '</span><span class="c-num">' + (t.fieldsFound ? t.fields.length : '—') + '</span>' +
    '<span class="c-grain">' + (t.grain ? inline(t.grain, t.path, { noLinks: true }) : '<em class="faint">no grain stated</em>') + '</span>' +
    '<span class="c-flag">' + (t.notices.length ? '<span class="dot-amber" title="' + esc(t.notices.join(' ')) + '"></span>' : '') + badge(issueCount(t)) + '</span></a>').join('');
  return '<div class="list list--t" role="table"><div class="row row--h row--t" role="row"><span>Table Name</span><span class="c-num">Fields</span><span>One record means</span><span></span></div>' + rows + '</div>';
}

const SORTS = ['creation order', 'field name', 'field type'];
function sortFields(fields, by) {
  const f = fields.slice();
  if (by === 'field name') f.sort((a, b) => a.name.localeCompare(b.name));
  if (by === 'field type') f.sort((a, b) => fmType(a.type).label.localeCompare(fmType(b.type).label) || a.order - b.order);
  return f;
}

function fieldRow(app, t, f, on) {
  const ty = fmType(f.type), chips = [];
  if (f.to) chips.push('<span class="chip' + (f.toMissing ? ' chip--bad' : '') + '">→ ' + esc(f.to) + '</span>');
  if (f.href) chips.push('<span class="chip">calc file</span>');
  if (f.flag) chips.push('<span class="chip chip--flag">' + inline(f.flag, t.path, { noLinks: true }) + '</span>');
  if (f.group) chips.push('<span class="chip chip--group">' + inline(f.group, t.path, { noLinks: true }) + '</span>');
  return '<a class="row row--f' + (on ? ' is-sel' : '') + '" role="row" data-field="' + esc(f.name) + '" href="#/' + enc(app.slug) + '/fields/' + enc(t.file) + '/' + enc(f.name) + '">' +
    '<span class="c-name">' + esc(f.name) + badge(f.defects.length) + '</span>' +
    '<span class="c-type">' + esc(ty.label) + (ty.detail ? '<small>' + esc(ty.detail) + '</small>' : '') + '</span>' +
    '<span class="c-opt">' + optText(t, f) + chips.join('') + '</span></a>';
}

// FileMaker's own column is "Options / Comments": options first, then the comment.
function optText(t, f) {
  const parts = [f.options, f.comment].filter(Boolean).map(x => inline(x, t.path, { noLinks: true }));
  return parts.length ? '<span>' + parts.join(' <b class="sep">/</b> ') + '</span>' : '<em class="faint">no comment</em>';
}

const noticeList = d => d.length ? '<ul class="notices">' + d.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '';
const defectList = d => d.length ? '<ul class="defects">' + d.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '';

function fieldDetail(app, t, f) {
  const ty = fmType(f.type), rows = [
    ['Type', esc(ty.label) + (ty.detail ? ' · ' + esc(ty.detail) : '') + (f.type && f.type !== ty.label ? ' <code>' + esc(f.type) + '</code>' : '')],
    ['Comment', f.comment ? inline(f.comment, t.path, { ids: app.ids }) : '<em class="faint">none</em>']
  ];
  if (f.options) rows.splice(1, 0, ['Options', inline(f.options, t.path, { ids: app.ids })]);
  if (f.group) rows.push(['Group', inline(f.group, t.path)]);
  if (f.to) rows.push(['Points at', f.toMissing ? '<span class="bad">' + esc(f.to) + ', no table note</span>' : '<a href="#/' + enc(app.slug) + '/fields/' + enc(f.to) + '">' + esc(f.to) + '</a>']);
  if (f.flag) rows.push(['Flag', inline(f.flag, t.path)]);
  if (f.href) rows.push(['Calculation', '<a href="' + esc(blobUrl(f.href)) + '" target="_blank" rel="noopener">' + esc(f.href.split('/').pop()) + ' ↗</a>']);
  return '<p class="side__kicker">Field in ' + esc(t.name) + '</p><h2 class="side__h">' + esc(f.name) + '</h2>' + defectList(f.defects) +
    '<dl class="dl">' + rows.map(r => '<dt>' + r[0] + '</dt><dd>' + r[1] + '</dd>').join('') + '</dl>' +
    '<p class="side__links"><a class="btn" href="#/' + enc(app.slug) + '/fields/' + enc(t.file) + '">Table notes</a> ' + noteLinks(t) + '</p>';
}

const noteLinks = t => '<a class="btn" href="' + esc(blobUrl(t.path)) + '" target="_blank" rel="noopener">Open note ↗</a> <a class="btn" href="' + esc(editUrl(t.path)) + '" target="_blank" rel="noopener">Edit ↗</a>';

function tableDetail(app, t) {
  const o = { ids: app.ids };
  const meta = [t.id && 'id ' + t.id, t.order != null && 'order ' + t.order, t.revised && 'revised ' + t.revised, t.status && t.status].filter(Boolean);
  const reg = t.register ? '<a class="btn" href="' + esc(blobUrl(t.register)) + '" target="_blank" rel="noopener">' + esc(t.register.split('/').pop()) + ' ↗</a> ' : '';
  return '<p class="side__kicker">Table</p><h2 class="side__h">' + esc(t.name) + '</h2>' +
    (t.summary ? '<p class="lede">' + inline(t.summary, t.path, o) + '</p>' : '') +
    (meta.length ? '<p class="meta">' + meta.map(esc).join(' · ') + '</p>' : '') +
    defectList(t.defects) + noticeList(t.notices) +
    (t.grain ? '<p class="grain"><span>One record means</span>' + inline(t.grain, t.path, o) + '</p>' : '') +
    (t.notes ? '<div class="md">' + block(t.notes, t.path, o) + '</div>' : '') +
    '<p class="side__links">' + reg + noteLinks(t) + '</p>';
}

export function fieldsTab(app, tables, t, sel, sort) {
  const opts = tables.map(x => '<option value="' + esc(x.file) + '"' + (x === t ? ' selected' : '') + '>' + esc(x.name) + '</option>').join('');
  const ctl = '<div class="ctl"><label>Table <select id="tblsel">' + opts + '</select></label>' +
    '<span class="ctl__count">' + plural(t.fields.length, 'field') + ' defined in table “' + esc(t.name) + '”</span>' +
    '<label class="ctl__sort">View by <select id="sortby">' + SORTS.map(s => '<option' + (s === sort ? ' selected' : '') + '>' + s + '</option>').join('') + '</select></label></div>';
  const list = t.fieldsFound
    ? '<div class="list list--f" role="table"><div class="row row--h row--f" role="row"><span>Field Name</span><span>Type</span><span>Options / Comments</span></div>' +
      sortFields(t.fields, sort).map(f => fieldRow(app, t, f, f.name === sel)).join('') + '</div>'
    : '<p class="empty">This note has no field register yet, so there is nothing to list.</p>';
  const f = t.fields.find(x => x.name === sel);
  return ctl + '<div class="split"><div class="split__main">' + list + '</div><aside class="side' + (f ? ' side--field' : '') + '">' + (f ? fieldDetail(app, t, f) : tableDetail(app, t)) + '</aside></div>';
}

// Script Workspace. The XML is built in the browser from the .fmscript each
// time the script is opened; nothing generated is stored anywhere.
export function scriptsTab(app, scripts, s, res, cmd) {
  if (!scripts.length) return '<p class="empty">No .fmscript files in apps/' + esc(app.slug) + '/scripts/ yet.</p>';
  const rows = scripts.map(x => '<a class="row row--t' + (s && x.rel === s.rel ? ' is-sel' : '') + '" role="row" href="#/' + enc(app.slug) + '/scripts/' + enc(x.rel) + '">' +
    '<span class="c-name">' + esc(x.name) + '</span><span class="c-num"></span><span class="c-grain">' + esc(x.folder || '(top level)') + '</span><span class="c-flag"></span></a>').join('');
  const list = '<div class="list list--t" role="table"><div class="row row--h row--t" role="row"><span>Script</span><span class="c-num"></span><span>Folder</span><span></span></div>' + rows + '</div>';
  return '<div class="split"><div class="split__main">' + list + '</div><aside class="side">' + (s && res ? scriptDetail(s, res, cmd) : scriptHelp()) + '</aside></div>';
}

const scriptHelp = () => '<p class="side__kicker">Scripts</p><h2 class="side__h">Pick a script</h2>' +
  '<p class="lede">Each script is read from its .fmscript and turned into FileMaker’s clipboard format right here. Nothing generated is stored.</p>' +
  '<p class="meta">Copy for FileMaker, paste into Terminal, press Enter, then click into an empty script and press ⌘V.</p>';

function scriptDetail(s, res, cmd) {
  const n = res.steps.filter(x => x.kind !== 'comment').length, hand = res.hand;
  const handList = hand.length ? '<ul class="defects">' + hand.map(h => '<li>Line ' + h.n + ', ' + esc(h.name || 'step') + ': ' + esc(h.why) + '. It pastes as a TYPE BY HAND comment.</li>').join('') + '</ul>' : '';
  const code = res.steps.map(x => {
    const line = '    '.repeat(x.depth) + x.text;
    return x.kind === 'hand' ? '<span class="bad">' + esc(line) + '</span>' : esc(line);
  }).join('\n');
  return '<p class="side__kicker">' + esc(s.folder || 'Script') + '</p><h2 class="side__h">' + esc(s.name) + '</h2>' +
    '<p class="meta">' + plural(n, 'step') + (hand.length ? ' · ' + plural(hand.length, 'step') + ' to type by hand' : ' · every step translates') + '</p>' + handList +
    '<p class="side__links"><button id="copyfm" class="btn" type="button">Copy for FileMaker</button> ' +
    '<a class="btn" href="' + esc(blobUrl(s.path)) + '" target="_blank" rel="noopener">Open .fmscript ↗</a> <a class="btn" href="' + esc(editUrl(s.path)) + '" target="_blank" rel="noopener">Edit ↗</a></p>' +
    '<p class="meta">Then paste into Terminal, press Enter, click into an empty script in FileMaker and press ⌘V.</p>' +
    '<details><summary>The Terminal command</summary><textarea id="cmdbox" readonly rows="4" spellcheck="false" style="width:100%;font-family:var(--font-mono,monospace)">' + esc(cmd) + '</textarea></details>' +
    '<div class="md"><pre><code>' + code + '</code></pre></div>';
}

export function foot(tree) {
  const when = new Date(tree.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  return 'maw-prose @ <a href="' + esc(commitUrl(tree.sha)) + '" target="_blank" rel="noopener">' + esc(tree.sha.slice(0, 7)) + '</a> · ' + esc(tree.subject) +
    ' · ' + esc(when) + ' · ' + (tree.cached ? 'cached list' : 'fresh list') + ' <button id="refresh" type="button" class="linkbtn">Re-read repo</button>';
}

export const failure = msg => '<section class="launch"><h1 class="launch__title">Could not read the specs</h1><p class="launch__sub">' + esc(msg) + '</p><p><button id="retry" class="btn" type="button">Try again</button></p></section>';
