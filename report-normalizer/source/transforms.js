// Transform op library. Each op: (value, row, args) => newValue. Pure, named, reusable.
// Column-level ops run on a single cell; filterRows is handled separately in the engine.

export const OPS = {
  trimWhitespace: {
    label: 'Trim',
    fn: (v) => (v == null ? v : String(v).trim()),
  },
  caseNormalize: {
    label: 'UPPER',
    fn: (v) => (v == null ? v : String(v).toUpperCase()),
  },
  signFlip: {
    label: 'Flip sign',
    fn: (v) => {
      const n = parseNum(v);
      return n == null ? v : -n;
    },
  },
  debitCreditToSigned: {
    label: 'Debit/Credit \u2192 signed',
    // args: { debitCol, creditCol }  -> resolves a signed amount from two columns.
    fn: (v, row, args = {}) => {
      const d = parseNum(row[args.debitCol]);
      const c = parseNum(row[args.creditCol]);
      if (d != null && d !== 0) return -Math.abs(d);
      if (c != null && c !== 0) return Math.abs(c);
      const single = parseNum(v);
      return single == null ? v : single;
    },
  },
  dateReformat: {
    label: 'Reformat date',
    // args: { out } out format token: 'YYYY-MM-DD' (default) | 'MM/DD/YYYY'
    fn: (v, row, args = {}) => {
      const d = parseDate(v);
      if (!d) return v;
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return (args.out === 'MM/DD/YYYY') ? `${m}/${day}/${y}` : `${y}-${m}-${day}`;
    },
  },
  constant: {
    label: 'Constant',
    // args: { value } -> always emit a fixed value (used for RECEIPT#, etc.)
    fn: (_v, _row, args = {}) => args.value ?? '',
  },
  derived: {
    label: 'Merge',
    // args: { cols:[...], sep } -> join several source columns
    fn: (v, row, args = {}) => {
      const cols = args.cols || [];
      const parts = cols.map((c) => row[c]).filter((x) => x != null && x !== '');
      return parts.join(args.sep ?? ' ');
    },
  },
};

export function parseNum(v) {
  if (v == null || v === '') return null;
  const n = Number(String(v).replace(/[$,()]/g, (m) => (m === '(' || m === ')' ? '' : '')).replace(/,/g, ''));
  if (String(v).trim().startsWith('(') && String(v).trim().endsWith(')') && !isNaN(n)) return -Math.abs(n);
  return isNaN(n) ? null : n;
}

export function parseDate(v) {
  if (!v) return null;
  const s = String(v).trim();
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

// Apply an ordered op chain to one cell within its row context.
export function applyOps(value, row, opList = []) {
  let out = value;
  for (const step of opList) {
    const op = OPS[step.op];
    if (op) out = op.fn(out, row, step.args || {});
  }
  return out;
}

// Row filter: keep rows where a numeric column is </>/</>= a threshold, or equals text.
// filter: { col, cmp:'lt'|'gte'|'eq'|'neq', value }
export function rowPasses(row, filter) {
  if (!filter || !filter.col) return true;
  const raw = row[filter.col];
  if (filter.cmp === 'eq') return String(raw) === String(filter.value);
  if (filter.cmp === 'neq') return String(raw) !== String(filter.value);
  const n = parseNum(raw);
  const t = parseNum(filter.value);
  if (n == null || t == null) return true;
  if (filter.cmp === 'lt') return n < t;
  if (filter.cmp === 'gte') return n >= t;
  return true;
}
