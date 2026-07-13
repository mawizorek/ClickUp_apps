// Step 2: Map. Remap source columns to target fields, attach transform ops, filter rows,
// see a live before/after preview, and save the whole thing as a profile.
import { S, el } from './state.js';
import { normalize } from './engine.js';

const COL_OPS = [
  { op: 'trimWhitespace', label: 'Trim' },
  { op: 'caseNormalize', label: 'UPPER' },
  { op: 'signFlip', label: 'Flip sign' },
  { op: 'dateReformat', label: 'Date\u2192ISO', args: { out: 'YYYY-MM-DD' } },
];

export function renderMap(stage, go, saveProfile) {
  stage.innerHTML = '';
  if (!S.file) { stage.append(el('p', { class: 'muted center' }, 'Drop a file first.')); return; }

  // --- target schema selector ---
  const schemaSel = el('select', {
    onchange: (e) => {
      const s = S.schemas.find((x) => x.schema_id === e.target.value);
      S.schema = s || { schema_id: '_adhoc', name: '(as uploaded)', fields: S.headers.map((h) => ({ field: h })) };
      draw();
    },
  });
  schemaSel.append(el('option', { value: '_adhoc' }, '(as uploaded \u2014 no target)'));
  S.schemas.forEach((s) => schemaSel.append(el('option', { value: s.schema_id, ...(S.schema && S.schema.schema_id === s.schema_id ? { selected: 'selected' } : {}) }, s.name)));
  stage.append(el('div', { class: 'card' }, [
    el('div', { class: 'field' }, [el('span', {}, 'Target schema'), schemaSel]),
  ]));

  const body = el('div');
  stage.append(body);
  draw();

  function targetFields() {
    return (S.schema && S.schema.fields ? S.schema.fields.map((f) => f.field) : S.headers);
  }

  function draw() {
    body.innerHTML = '';
    // --- mapping rows: one per source column ---
    const mapCard = el('div', { class: 'card' });
    mapCard.append(el('h2', { style: 'font-size:14px;margin-bottom:8px' }, 'Columns'));
    S.headers.forEach((src) => {
      const tgt = S.profile.map[src] || '';
      const sel = el('select', {
        onchange: (e) => {
          const v = e.target.value;
          if (v === '__drop') delete S.profile.map[src];
          else S.profile.map[src] = v;
          preview();
        },
      });
      sel.append(el('option', { value: '__drop', ...(tgt ? {} : { selected: 'selected' }) }, 'Drop'));
      targetFields().forEach((f) => sel.append(el('option', { value: f, ...(tgt === f ? { selected: 'selected' } : {}) }, f)));

      const opWrap = el('div', { class: 'ops' });
      COL_OPS.forEach((o) => {
        const active = tgt && (S.profile.transforms[tgt] || []).some((t) => t.op === o.op);
        opWrap.append(el('button', {
          class: 'op' + (active ? ' on' : ''),
          title: tgt ? '' : 'Map to a field first',
          onclick: () => { if (tgt) toggleOp(tgt, o); },
        }, o.label));
      });

      mapCard.append(el('div', { class: 'maprow' }, [
        el('span', { class: 'src' }, src),
        el('span', { class: 'muted' }, '\u2192'),
        sel,
        opWrap,
      ]));
    });
    body.append(mapCard);

    // --- constants for unmapped target fields ---
    const mappedTargets = new Set(Object.values(S.profile.map));
    const empties = targetFields().filter((f) => !mappedTargets.has(f));
    if (S.schema.schema_id !== '_adhoc' && empties.length) {
      const cCard = el('div', { class: 'card' });
      cCard.append(el('h2', { style: 'font-size:14px;margin-bottom:8px' }, 'Unmapped target fields (set a constant, optional)'));
      empties.forEach((f) => {
        const cur = (S.profile.transforms[f] || []).find((t) => t.op === 'constant');
        cCard.append(el('div', { class: 'maprow' }, [
          el('span', { class: 'src' }, f),
          el('input', { type: 'text', placeholder: 'constant value', value: cur ? cur.args.value : '',
            oninput: (e) => { S.profile.transforms[f] = [{ op: 'constant', args: { value: e.target.value } }]; preview(); } }),
        ]));
      });
      body.append(cCard);
    }

    // --- row filter ---
    const f = S.profile.filter || { col: '', cmp: 'lt', value: '' };
    const colSel = el('select', { onchange: (e) => { setFilter('col', e.target.value); } });
    colSel.append(el('option', { value: '' }, '(no filter \u2014 keep all rows)'));
    S.headers.forEach((h) => colSel.append(el('option', { value: h, ...(f.col === h ? { selected: 'selected' } : {}) }, h)));
    const cmpSel = el('select', { onchange: (e) => setFilter('cmp', e.target.value) });
    [['lt', '<'], ['gte', '\u2265'], ['eq', '='], ['neq', '\u2260']].forEach(([v, lbl]) =>
      cmpSel.append(el('option', { value: v, ...(f.cmp === v ? { selected: 'selected' } : {}) }, lbl)));
    const valInput = el('input', { type: 'text', value: f.value, placeholder: 'value', oninput: (e) => setFilter('value', e.target.value) });
    body.append(el('div', { class: 'card' }, [
      el('h2', { style: 'font-size:14px;margin-bottom:8px' }, 'Row filter'),
      el('div', { class: 'maprow' }, [colSel, cmpSel, valInput]),
      el('small', { class: 'muted' }, 'e.g. Ledger Account < 6000 keeps labor rows. Leave blank to keep everything.'),
    ]));

    // --- live preview ---
    const prev = el('div', { class: 'card' });
    prev.id = 'previewCard';
    body.append(prev);
    preview();

    // --- save + continue bar ---
    const nameInput = el('input', { type: 'text', value: S.profile.name && S.profile.name !== '(unsaved)' ? S.profile.name : '', placeholder: 'Profile name (e.g. URF0985 \u2192 Beta Budget)' });
    body.append(el('div', { class: 'card' }, [
      el('div', { class: 'field' }, [el('span', {}, 'Save this mapping as a profile'), nameInput]),
      el('div', { class: 'rowbar' }, [
        el('button', { class: 'btn ghost', onclick: () => save(nameInput.value) }, '\uD83D\uDCBE Save profile'),
        el('button', { class: 'btn', onclick: () => go('output') }, 'Continue to Output \u2192'),
      ]),
    ]));
  }

  function toggleOp(tgt, o) {
    const list = S.profile.transforms[tgt] || [];
    const i = list.findIndex((t) => t.op === o.op);
    if (i >= 0) list.splice(i, 1);
    else list.push({ op: o.op, ...(o.args ? { args: o.args } : {}) });
    S.profile.transforms[tgt] = list;
    draw();
  }

  function setFilter(k, v) {
    S.profile.filter = S.profile.filter || { col: '', cmp: 'lt', value: '' };
    S.profile.filter[k] = v;
    if (!S.profile.filter.col) S.profile.filter = null;
    preview();
  }

  function preview() {
    const card = document.getElementById('previewCard');
    if (!card) return;
    card.innerHTML = '';
    const res = normalize(S.rows, S.profile, S.schema);
    card.append(el('h2', { style: 'font-size:14px;margin-bottom:8px' }, `Preview \u00b7 ${res.outCount} of ${res.inCount} rows`));
    const scroll = el('div', { class: 'scroll' });
    const table = el('table');
    table.append(el('tr', {}, res.fields.map((f) => el('th', {}, f))));
    res.rows.slice(0, 8).forEach((r) => table.append(el('tr', {}, res.fields.map((f) => el('td', {}, String(r[f] ?? ''))))));
    scroll.append(table);
    card.append(scroll);
  }

  function save(name) {
    if (!name || !name.trim()) { alert('Give the profile a name first.'); return; }
    S.profile.name = name.trim();
    if (!S.profile.profile_id) S.profile.profile_id = 'p-' + Date.now().toString(36);
    S.profile.header_fingerprint = S.fingerprint;
    if (!S.profile.filename_hint && S.file) S.profile.filename_hint = (S.file.name.match(/[A-Za-z]+\d+/) || [''])[0];
    S.profile.schema_id = S.schema && S.schema.schema_id !== '_adhoc' ? S.schema.schema_id : null;
    saveProfile(S.profile);
  }
}
