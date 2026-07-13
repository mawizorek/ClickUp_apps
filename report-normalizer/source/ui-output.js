// Step 3: Output. Run the normalize, show a summary + preview, download clean CSV via a
// real blob <a> (Safari/sandbox-safe), and log the run.
import { S, el } from './state.js';
import { normalize } from './engine.js';
import * as csv from './csv.js';
import { store } from './api.js';

let blobUrl = null;

export function renderOutput(stage) {
  stage.innerHTML = '';
  if (!S.file) { stage.append(el('p', { class: 'muted center' }, 'Drop a file first.')); return; }

  const res = normalize(S.rows, S.profile, S.schema);
  const csvText = csv.serialize(res.fields, res.rows);
  const outName = buildName();

  if (blobUrl) URL.revokeObjectURL(blobUrl);
  blobUrl = URL.createObjectURL(new Blob([csvText], { type: 'text/csv' }));

  const dl = el('a', { class: 'btn', href: blobUrl, download: outName, style: '-webkit-touch-callout:default;text-decoration:none' }, '\u2b07 Download ' + outName);

  stage.append(el('div', { class: 'card' }, [
    el('h2', { style: 'font-size:15px;margin-bottom:6px' }, 'Ready'),
    el('div', { class: 'muted', style: 'margin-bottom:10px' },
      `${res.outCount} rows \u00b7 ${res.fields.length} columns \u00b7 target: ${S.schema ? S.schema.name : '(as uploaded)'}`),
    el('div', { class: 'rowbar' }, [
      dl,
      el('button', { class: 'btn ghost', onclick: () => copy(csvText) }, 'Copy CSV'),
    ]),
    el('small', { class: 'muted' }, 'On iPhone: long-press the download button \u2192 Download Linked File.'),
  ]));

  const prev = el('div', { class: 'card' });
  prev.append(el('h2', { style: 'font-size:14px;margin-bottom:8px' }, 'Preview'));
  const scroll = el('div', { class: 'scroll' });
  const table = el('table');
  table.append(el('tr', {}, res.fields.map((f) => el('th', {}, f))));
  res.rows.slice(0, 12).forEach((r) => table.append(el('tr', {}, res.fields.map((f) => el('td', {}, String(r[f] ?? ''))))));
  scroll.append(table);
  prev.append(scroll);
  stage.append(prev);

  // Log the run (fire-and-forget; non-fatal if the Worker is down).
  store.logRun({
    run_id: 'r-' + Date.now().toString(36),
    profile_id: S.profile.profile_id || null,
    profile_name: S.profile.name,
    source_filename: S.file.name,
    row_count_in: res.inCount,
    row_count_out: res.outCount,
    target_schema: S.schema ? S.schema.name : null,
    ran_at: new Date().toISOString(),
  });
}

function buildName() {
  const base = (S.file.name || 'report').replace(/\.[^.]+$/, '');
  const tag = S.schema && S.schema.schema_id !== '_adhoc' ? '_normalized' : '_clean';
  return base + tag + '.csv';
}

function copy(text) {
  navigator.clipboard?.writeText(text).then(
    () => toast('Copied CSV'),
    () => fallbackCopy(text),
  ) || fallbackCopy(text);
}
function fallbackCopy(text) {
  const ta = el('textarea', { style: 'position:fixed;opacity:0' }); ta.value = text;
  document.body.append(ta); ta.select();
  try { document.execCommand('copy'); toast('Copied CSV'); } catch { alert('Copy failed'); }
  ta.remove();
}
function toast(msg) {
  const t = el('div', { class: 'banner match', style: 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:30' }, msg);
  document.body.append(t); setTimeout(() => t.remove(), 1400);
}
