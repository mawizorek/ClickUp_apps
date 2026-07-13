// Native .xlsx / .xls parsing. Lazy-loads SheetJS from CDN on first use (keeps the base
// bundle small; app is online-only anyway). Returns the same { headers, rows } shape as csv.js
// so the rest of the pipeline is source-format agnostic.
//
// Workday exports (URF0985) carry preamble/title rows before the real header, so we detect
// the header row instead of assuming row 0: the first row (within the first 20) whose filled-
// cell count is highest and is followed by a similarly-wide data row.

let _xlsxPromise = null;
function loadSheetJS() {
  if (window.XLSX) return Promise.resolve(window.XLSX);
  if (_xlsxPromise) return _xlsxPromise;
  _xlsxPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js';
    s.onload = () => resolve(window.XLSX);
    s.onerror = () => reject(new Error('Could not load the Excel reader (offline?).'));
    document.head.append(s);
  });
  return _xlsxPromise;
}

function filled(row) { return row.filter((c) => c != null && String(c).trim() !== '').length; }

// Given an array-of-arrays sheet, find the most likely header row index.
function detectHeaderRow(aoa) {
  const scan = Math.min(aoa.length, 20);
  let best = 0, bestScore = -1;
  for (let i = 0; i < scan; i++) {
    const w = filled(aoa[i]);
    const next = aoa[i + 1] ? filled(aoa[i + 1]) : 0;
    // header candidates: wide row, with a data row of comparable width right after
    const score = w + Math.min(w, next);
    if (w >= 2 && score > bestScore) { bestScore = score; best = i; }
  }
  return best;
}

export async function parseFile(file) {
  const XLSX = await loadSheetJS();
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });
  const first = wb.SheetNames[0];
  const ws = wb.Sheets[first];
  const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false, raw: false, defval: '' });
  if (!aoa.length) return { headers: [], rows: [], sheetName: first, sheetNames: wb.SheetNames };

  const hIdx = detectHeaderRow(aoa);
  const rawHeaders = aoa[hIdx].map((h) => String(h == null ? '' : h).trim());
  // de-dup / fill blank header cells so keys are unique and non-empty
  const seen = {};
  const headers = rawHeaders.map((h, i) => {
    let name = h || `Column ${i + 1}`;
    if (seen[name] != null) { seen[name]++; name = `${name} (${seen[name]})`; }
    else seen[name] = 0;
    return name;
  });

  const rows = [];
  for (let r = hIdx + 1; r < aoa.length; r++) {
    const arr = aoa[r];
    if (!arr || filled(arr) === 0) continue;
    const o = {};
    headers.forEach((h, i) => { o[h] = arr[i] != null ? String(arr[i]) : ''; });
    rows.push(o);
  }
  return { headers, rows, sheetName: first, sheetNames: wb.SheetNames };
}

export function isExcel(name = '') {
  return /\.(xlsx|xls)$/i.test(name);
}
