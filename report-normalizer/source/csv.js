// Minimal, dependency-free CSV. Handles quoted fields, embedded commas/newlines, escaped quotes.
// parse() returns { headers:[], rows:[{header:value}] }.

export function parse(text) {
  const cells = [];
  let field = '';
  let row = [];
  let i = 0;
  let inQ = false;
  const n = text.length;
  // strip BOM
  if (text.charCodeAt(0) === 0xfeff) i = 1;
  const pushField = () => { row.push(field); field = ''; };
  const pushRow = () => { cells.push(row); row = []; };
  for (; i < n; i++) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQ = false;
      } else field += ch;
    } else if (ch === '"') inQ = true;
    else if (ch === ',') pushField();
    else if (ch === '\r') { /* ignore, handled by \n */ }
    else if (ch === '\n') { pushField(); pushRow(); }
    else field += ch;
  }
  // trailing field/row
  if (field.length > 0 || row.length > 0) { pushField(); pushRow(); }
  // drop fully-empty trailing rows
  const clean = cells.filter((r) => !(r.length === 1 && r[0] === ''));
  if (!clean.length) return { headers: [], rows: [] };
  const headers = clean[0].map((h) => h.trim());
  const rows = clean.slice(1).map((r) => {
    const o = {};
    headers.forEach((h, idx) => { o[h] = r[idx] != null ? r[idx] : ''; });
    return o;
  });
  return { headers, rows };
}

export function serialize(headers, rows) {
  const esc = (v) => {
    const s = v == null ? '' : String(v);
    return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const head = headers.map(esc).join(',');
  const body = rows.map((r) => headers.map((h) => esc(r[h])).join(',')).join('\n');
  return head + '\n' + body + '\n';
}

// Header fingerprint: order-independent, case/space-normalized hash of column names.
export function fingerprint(headers) {
  const norm = headers
    .map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''))
    .filter(Boolean)
    .sort()
    .join('|');
  let h = 5381;
  for (let i = 0; i < norm.length; i++) h = ((h << 5) + h + norm.charCodeAt(i)) & 0xffffffff;
  return 'fp' + (h >>> 0).toString(36);
}
