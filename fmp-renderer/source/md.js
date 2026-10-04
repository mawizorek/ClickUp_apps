// md.js: just enough markdown to show a table note's prose. Not a general
// renderer. Links resolve against the note's own path, to GitHub, so a link
// that works on github.com works here. v2 adds the doc renderer's vocabulary
// that table notes use: !!! callouts, [text]{.marker} confidence markers and
// [text](@id) links (resolved in-app when the id is a table here).
import { blobUrl } from './github.js?v=2';

export const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g,
  c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function joinPath(from, rel) {
  const out = from.split('/'); out.pop();
  for (const seg of rel.split('#')[0].split('/')) {
    if (!seg || seg === '.') continue;
    if (seg === '..') out.pop(); else out.push(seg);
  }
  return out.join('/');
}

function linkTo(href, base) {
  if (/^(https?:|mailto:)/i.test(href)) return href;
  return blobUrl(joinPath(base, href));
}

export function inline(s, base, o) {
  const opt = o || {};
  const codes = [];
  let out = esc(s).replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return '\uE000' + (codes.length - 1) + '\uE001'; });
  out = out.replace(/\[([^\]]+)\]\{\.([\w-]+)\}/g, (_, txt, cls) => '<span class="mk mk--' + cls + '">' + txt + '</span>');
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, txt, href) => {
    if (href.charAt(0) === '@') {
      const to = opt.ids && opt.ids[href.slice(1)];
      return to && !opt.noLinks ? '<a href="' + to + '">' + txt + '</a>' : '<span class="xref" title="' + href + '">' + txt + '</span>';
    }
    return opt.noLinks ? txt : '<a href="' + linkTo(href, base) + '" target="_blank" rel="noopener">' + txt + '</a>';
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
           .replace(/(^|[^*\w])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
           .replace(/~~([^~]+)~~/g, '<s>$1</s>');
  return out.replace(/\uE000(\d+)\uE001/g, (_, i) => '<code>' + codes[i] + '</code>');
}

export const cells = line => line.trim().replace(/^\|/, '').replace(/\|$/, '')
  .split(/(?<!\\)\|/).map(c => c.trim().replace(/\\\|/g, '|'));

function table(rows, base) {
  const body = rows.filter(r => !/^[\s|:-]+$/.test(r));
  if (!body.length) return '';
  const [head, ...rest] = body;
  const th = cells(head).map(c => '<th>' + inline(c, base) + '</th>').join('');
  const tr = rest.map(r => '<tr>' + cells(r).map(c => '<td>' + inline(c, base) + '</td>').join('') + '</tr>').join('');
  return '<div class="md-table"><table><thead><tr>' + th + '</tr></thead><tbody>' + tr + '</tbody></table></div>';
}

const LIST = /^\s*([-*]|\d+\.)\s+/;
const SPECIAL = /^(#{1,6}\s|```|\s*\||\s*([-*]|\d+\.)\s+|>|!!!\s)/;

export function block(md, base, opt) {
  const L = String(md || '').split('\n');
  let h = '', i = 0;
  while (i < L.length) {
    const l = L[i];
    if (!l.trim()) { i++; continue; }
    if (/^```/.test(l)) {
      const buf = []; i++;
      while (i < L.length && !/^```/.test(L[i])) buf.push(L[i++]);
      i++; h += '<pre><code>' + esc(buf.join('\n')) + '</code></pre>'; continue;
    }
    const m = l.match(/^(#{1,6})\s+(.*)/);
    if (m) { const lv = Math.min(6, m[1].length + 2); h += '<h' + lv + '>' + inline(m[2], base, opt) + '</h' + lv + '>'; i++; continue; }
    const co = l.match(/^!!!\s+([\w-]+)(?:\s+"([^"]*)")?\s*$/);
    if (co) {
      const buf = []; i++;
      while (i < L.length && (/^(\s{4}|\t)/.test(L[i]) || (!L[i].trim() && i + 1 < L.length && /^(\s{4}|\t)/.test(L[i + 1])))) buf.push(L[i++].replace(/^(\s{4}|\t)/, ''));
      h += '<div class="callout callout--' + esc(co[1]) + '">' + (co[2] ? '<p class="callout__t">' + inline(co[2], base, opt) + '</p>' : '') + block(buf.join('\n'), base, opt) + '</div>';
      continue;
    }
    if (/^\s*\|/.test(l)) { const rows = []; while (i < L.length && /^\s*\|/.test(L[i])) rows.push(L[i++]); h += table(rows, base); continue; }
    if (LIST.test(l)) {
      const ord = /^\s*\d+\./.test(l), items = [];
      while (i < L.length && LIST.test(L[i])) {
        let it = L[i++].replace(LIST, '');
        while (i < L.length && /^\s{2,}\S/.test(L[i]) && !LIST.test(L[i])) it += ' ' + L[i++].trim();
        items.push('<li>' + inline(it, base, opt) + '</li>');
      }
      h += (ord ? '<ol>' : '<ul>') + items.join('') + (ord ? '</ol>' : '</ul>'); continue;
    }
    if (/^>/.test(l)) { const buf = []; while (i < L.length && /^>/.test(L[i])) buf.push(L[i++].replace(/^>\s?/, '')); h += '<blockquote>' + inline(buf.join(' '), base, opt) + '</blockquote>'; continue; }
    if (/^(-{3,}|\*{3,})$/.test(l.trim())) { h += '<hr>'; i++; continue; }
    const buf = [];
    while (i < L.length && L[i].trim() && !SPECIAL.test(L[i])) buf.push(L[i++].trim());
    if (!buf.length) { buf.push(L[i++].trim()); }
    h += '<p>' + inline(buf.join(' '), base, opt) + '</p>';
  }
  return h;
}
