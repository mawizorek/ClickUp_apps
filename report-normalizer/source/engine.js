// The engine: given parsed rows + a mapping profile + a target schema, produce output rows
// keyed by the schema's field order. Pure; no DOM.

import { applyOps, rowPasses } from './transforms.js';

// profile.map: { sourceCol: targetField }
// profile.transforms: { targetField: [ {op,args}, ... ] }
// profile.filter: { col, cmp, value } | null
export function normalize(rows, profile, schema) {
  const fields = schema.fields.map((f) => f.field);
  // invert map: targetField -> sourceCol (first wins)
  const targetToSource = {};
  Object.entries(profile.map || {}).forEach(([src, tgt]) => {
    if (tgt && !(tgt in targetToSource)) targetToSource[tgt] = src;
  });

  const kept = (profile.filter && profile.filter.col)
    ? rows.filter((r) => rowPasses(r, profile.filter))
    : rows;

  const out = kept.map((row) => {
    const o = {};
    for (const field of fields) {
      const src = targetToSource[field];
      let val = src != null ? row[src] : '';
      const ops = (profile.transforms && profile.transforms[field]) || [];
      val = applyOps(val, row, ops);
      o[field] = val == null ? '' : val;
    }
    return o;
  });

  return { fields, rows: out, inCount: rows.length, outCount: out.length };
}

// Build an empty pass-through profile for a freshly-dropped, unrecognized file (viewer mode):
// every source column maps to an identically-named target so it renders as-is.
export function passthroughProfile(headers) {
  const map = {};
  headers.forEach((h) => { map[h] = h; });
  return {
    profile_id: null, name: '(unsaved)', schema_id: null,
    header_fingerprint: null, filename_hint: '', locked: 0, source: 'adhoc',
    map, transforms: {}, filter: null,
  };
}

export function passthroughSchema(headers) {
  return { schema_id: '_adhoc', name: '(as uploaded)', fields: headers.map((h) => ({ field: h })) };
}
