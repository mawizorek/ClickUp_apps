// Step 1: Source. Drop/pick a CSV, parse it, fingerprint headers, auto-match a saved profile.
import { S, el } from './state.js';
import * as csv from './csv.js';
import { passthroughProfile, passthroughSchema } from './engine.js';

export function renderSource(stage, go) {
  stage.innerHTML = '';
  const input = el('input', { type: 'file', accept: '.csv,text/csv', id: 'fileInput' });
  const drop = el('div', { class: 'drop' + (S.file ? ' done' : '') }, [
    S.file
      ? el('div', {}, [
          el('div', { text: '\u2713 Loaded' }),
          el('div', { class: 'filechip' }, [S.file.name + ' \u00b7 ' + S.rows.length + ' rows']),
          el('div', {}, [el('button', { class: 'btn ghost sm', style: 'margin-top:10px', onclick: () => reset(stage, go) }, 'Replace file')]),
        ])
      : el('label', { for: 'fileInput' }, [
          el('div', { style: 'font-size:28px' }, '\uD83E\uDDF9'),
          el('div', { style: 'margin:8px 0 4px;font-weight:600' }, 'Drop a CSV here, or tap to choose'),
          el('div', { class: 'muted', style: 'font-size:13px' }, 'Processed in your browser. Nothing is uploaded.'),
        ]),
    input,
  ]);

  input.addEventListener('change', (e) => { const f = e.target.files[0]; if (f) load(f, stage, go); });
  drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('hover'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('hover'));
  drop.addEventListener('drop', (e) => {
    e.preventDefault(); drop.classList.remove('hover');
    const f = e.dataTransfer.files[0]; if (f) load(f, stage, go);
  });
  stage.append(drop);

  if (S.file) {
    const banner = S.matched
      ? el('div', { class: 'banner match' }, [
          '\u2713 Recognized this report \u2192 ', el('strong', {}, S.profile.name),
          '. Mapping pre-filled. ',
          el('button', { class: 'btn ghost sm', onclick: () => manual(stage, go) }, 'Map manually instead'),
        ])
      : el('div', { class: 'banner warn' }, [
          'No saved profile matches these headers. Opening as a plain viewer \u2014 map it and save a profile to auto-recognize next time.',
        ]);
    stage.append(banner);
    stage.append(el('div', { class: 'rowbar' }, [
      el('button', { class: 'btn', onclick: () => go('map') }, 'Continue to Map \u2192'),
    ]));
  }
}

function reset(stage, go) {
  S.file = null; S.headers = []; S.rows = []; S.fingerprint = null;
  S.profile = null; S.schema = null; S.matched = false;
  renderSource(stage, go);
}

function manual(stage, go) {
  S.matched = false;
  S.profile = passthroughProfile(S.headers);
  S.schema = passthroughSchema(S.headers);
  renderSource(stage, go);
}

function load(file, stage, go) {
  const rd = new FileReader();
  rd.onload = () => {
    const { headers, rows } = csv.parse(String(rd.result));
    if (!headers.length) { alert('Could not read any columns from that file.'); return; }
    S.file = { name: file.name };
    S.headers = headers; S.rows = rows;
    S.fingerprint = csv.fingerprint(headers);
    matchProfile(file.name);
    renderSource(stage, go);
  };
  rd.onerror = () => alert('Failed to read the file.');
  rd.readAsText(file);
}

// Exact-or-warn: match on header fingerprint first, else a filename hint. Never partial auto-apply.
function matchProfile(filename) {
  const byFp = S.profiles.find((p) => p.header_fingerprint && p.header_fingerprint === S.fingerprint);
  const byName = !byFp && S.profiles.find((p) => p.filename_hint && filename.toUpperCase().includes(p.filename_hint.toUpperCase()));
  const hit = byFp || byName;
  if (hit) {
    S.matched = true;
    S.profile = JSON.parse(JSON.stringify(hit));
    S.schema = S.schemas.find((s) => s.schema_id === hit.schema_id) || passthroughSchema(S.headers);
  } else {
    S.matched = false;
    S.profile = passthroughProfile(S.headers);
    S.schema = passthroughSchema(S.headers);
  }
}
