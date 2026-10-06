// fmscript.js: a .fmscript (the readable copy target in maw-prose) in, a
// FileMaker clipboard snippet out. Pure text; no DOM, no fetch.
//
// Steps whose XML has been proven by a real paste are emitted as steps. A
// step this file cannot translate is NOT dropped: it becomes a comment step
// reading "TYPE BY HAND: <the original line>", and is reported, so a script
// never pastes silently short.

const x = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const cdata = s => '<![CDATA[' + String(s).replace(/]]>/g, ']]]]><![CDATA[>') + ']]>';
const calc = s => '<Calculation>' + cdata(s) + '</Calculation>';
const step = (id, name, inner) => '<Step enable="True" id="' + id + '" name="' + x(name) + '">' + (inner || '') + '</Step>';
const comment = t => step(89, '# (comment)', '<Text>' + x(t) + '</Text>');
const onOff = a => /^\s*on\s*$/i.test(a || '');

// Split "a ; b ; c" at top level only: never inside "quoted text" (FileMaker
// escapes a quote as \"), and never inside ( ), [ ] or { }.
export function splitArgs(s) {
  const out = []; let cur = '', depth = 0, q = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { cur += c; if (c === '\\' && i + 1 < s.length) { cur += s[++i]; continue; } if (c === '"') q = false; continue; }
    if (c === '"') { q = true; cur += c; continue; }
    if ('([{'.includes(c)) depth++;
    if (')]}'.includes(c)) depth--;
    if (c === ';' && depth === 0) { out.push(cur.trim()); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim() || out.length) out.push(cur.trim());
  return out;
}

const after = (a, label) => { const re = new RegExp('^' + label + '\\s*:\\s*', 'i'); return re.test(a || '') ? a.replace(re, '') : null; };
const unquote = s => { const m = String(s).trim().match(/^"((?:[^"\\]|\\.)*)"$/); return m ? m[1].replace(/\\"/g, '"') : null; };
const fieldRef = r => { const m = String(r).trim().match(/^([^:]+)::(.+)$/); return m ? { table: m[1].trim(), field: m[2].trim() } : null; };

// One entry per step this file can write. Each returns the inner XML, or
// throws a short reason, which turns the line into a TYPE BY HAND comment.
const STEPS = {
  'Set Variable': a => {
    const v = after(a[1], 'Value'); if (v == null) throw 'no Value:';
    const m = a[0].match(/^(\$\$?[^\s\[]+)\s*(?:\[\s*(.+)\s*\])?$/); if (!m) throw 'bad variable name';
    return [141, '<Value>' + calc(v) + '</Value><Repetition>' + calc(m[2] || '1') + '</Repetition><Name>' + x(m[1]) + '</Name>'];
  },
  'If': a => [68, calc(a[0])],
  'Else If': a => [125, calc(a[0])],
  'Else': () => [69, ''],
  'End If': () => [70, ''],
  'Loop': () => [71, ''],
  'Exit Loop If': a => [72, calc(a[0])],
  'End Loop': () => [73, ''],
  'Exit Script': a => { const r = after(a[0], 'Text Result'); return [103, r == null || r === '' ? '' : calc(r)]; },
  'Set Error Capture': a => [86, '<Set state="' + (onOff(a[0]) ? 'True' : 'False') + '"/>'],
  'Allow User Abort': a => [85, '<Set state="' + (onOff(a[0]) ? 'True' : 'False') + '"/>'],
  'Freeze Window': () => [79, ''],
  'Go to Layout': a => {
    const n = unquote(a[0]); if (n == null) throw 'only a named layout translates; type layout-by-calculation by hand';
    return [6, '<LayoutDestination value="SelectedLayout"/><Layout id="0" name="' + x(n) + '"/>'];
  },
  'Enter Find Mode': a => [22, '<Pause state="' + (/pause\s*:\s*on/i.test(a.join(';')) ? 'True' : 'False') + '"/>'],
  'Perform Find': a => { if (a.some(Boolean)) throw 'stored find requests do not translate'; return [28, '<Restore state="False"/>']; },
  'Set Field': a => {
    const f = fieldRef(a[0]); if (!f) throw 'target is not Table::Field';
    return [76, calc(a[1] || '') + '<Field table="' + x(f.table) + '" id="0" name="' + x(f.field) + '"/>'];
  },
  'Go to Record/Request/Page': a => {
    const where = (a[0] || '').trim();
    if (where === 'First' || where === 'Last') return [16, '<NoInteract state="True"/><RowPageLocation value="' + where + '"/>'];
    if (where === 'Next' || where === 'Previous') {
      const ex = /exit after last\s*:\s*on/i.test(a.join(';'));
      return [16, '<NoInteract state="True"/>' + (ex ? '<Exit state="True"/>' : '') + '<RowPageLocation value="' + where + '"/>'];
    }
    throw 'only First, Last, Next and Previous translate';
  },
  'Show All Records': () => [23, ''],
  'New Record/Request': () => [7, ''],
  'Commit Records/Requests': () => [75, '<NoInteract state="True"/>']
};

export const SUPPORTED = Object.keys(STEPS);

// text -> { xml, steps: [{ n, text, depth, kind: 'step'|'comment'|'hand', name, why }], hand }
export function toSnippet(text) {
  const out = [], steps = [];
  String(text).replace(/\r\n?/g, '\n').split('\n').forEach((raw, i) => {
    const depth = (raw.match(/^\t*/) || [''])[0].length, line = raw.trim();
    if (!line) return;
    const n = i + 1;
    if (line.startsWith('#')) { out.push(comment(line.replace(/^#\s?/, ''))); steps.push({ n, text: line, depth, kind: 'comment' }); return; }
    const m = line.match(/^([^\[]+?)\s*(?:\[\s*([\s\S]*?)\s*\])?\s*$/);
    const name = m ? m[1].trim() : line, args = m && m[2] != null ? splitArgs(m[2]) : [];
    const fn = STEPS[name];
    try {
      if (!fn) throw 'no translation for this step yet';
      const [id, inner] = fn(args);
      out.push(step(id, name, inner)); steps.push({ n, text: line, depth, kind: 'step', name });
    } catch (why) {
      out.push(comment('TYPE BY HAND: ' + line));
      steps.push({ n, text: line, depth, kind: 'hand', name, why: String(why) });
    }
  });
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<fmxmlsnippet type="FMObjectList">\n' + out.join('\n') + '\n</fmxmlsnippet>\n';
  return { xml, steps, hand: steps.filter(s => s.kind === 'hand') };
}

// The one-line Terminal command that puts the snippet on the clipboard as
// FileMaker script steps (pasteboard type XMSS). Hex is [0-9a-f] only, so
// nothing inside it needs shell quoting.
export function pasteCommand(xml) {
  const bytes = new TextEncoder().encode(xml);
  let hex = '';
  for (const b of bytes) hex += b.toString(16).padStart(2, '0');
  return 'osascript -e "set the clipboard to \u00abdata XMSS' + hex + '\u00bb"';
}
