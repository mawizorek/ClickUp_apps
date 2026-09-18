/* drmd.js -- the doc-render markdown dialect, rendered into Material's DOM shape.
 *
 * 🔴 THIS EMITS MATERIAL'S CLASS CONTRACT ON PURPOSE. `.md-typeset`, `.admonition`,
 * `.admonition-title`, `.dr-mark`, `.docrender-dead` are not our names -- they are
 * what doc-render-engine's stylesheets select on. Rename one and the published CSS
 * stops matching. See doc-sandbox/next-build-spec.md section 2.
 *
 * 🚫 NOT A COMMONMARK PARSER, and does not claim to be. It covers the dialect the
 * doc sites actually author. Everything it cannot do is listed in `LIMITS` below
 * and surfaced in the UI -- an unmeasured gap is the failure mode, not a small one.
 */

import { inline, esc, slug } from './drmd.inline.js';

export const LIMITS = [
  'frontmatter furniture (lede, aka, revised, spec tables) is engine-side',
  'marker colour comes from markers.tsv at build time, so markers inherit ink',
  '@id links cannot resolve in one page and render as dead references',
  '!!! data TSV tables are a build-time transform',
  'reference-style links, setext headings and footnotes are not implemented',
  'raw HTML is limited to a safe inline subset; block HTML is escaped, never executed',
];

const BLOCK = { FENCE: /^(\s*)(`{3,}|~{3,})\s*([^\s`~]*)\s*$/, HEAD: /^(#{1,6})\s+(.*)$/, HR: /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/, ADM: /^(\?{3}\+?|!{3})\s+([A-Za-z][\w-]*)(?:\s+"((?:[^"\\]|\\.)*)")?\s*$/, UL: /^(\s*)[-*+]\s+(.*)$/, OL: /^(\s*)(\d+)[.)]\s+(.*)$/, QUOTE: /^\s*>\s?(.*)$/, ROW: /^\s*\|(.+)\|\s*$/, SEP: /^\s*\|(\s*:?-{1,}:?\s*\|)+\s*$/, COMMENT: /^\s*<!--/, TAB: /^(\s*)={3}\+?\s+"((?:[^"\\]|\\.)*)"\s*$/ };

/* Engine directives whose body is DATA, not prose. `!!! data "slot"` is consumed
 * by docrender/datatable.py, which reads a sibling TSV. One pasted page has no
 * TSV, so there is nothing to draw and an empty box would read as a paint bug. */
const DATA_DIRECTIVES = new Set(['data', 'report', 'tokens', 'view', 'form', 'qr', 'chain']);

/* ---- frontmatter -------------------------------------------------------- */
/* Deliberately shallow: scalars only. The engine owns the real contract; this
 * exists so a pasted page's header does not render as a horizontal rule
 * followed by a pile of key: value prose, which is what it looks like raw. */
export function splitFrontmatter(src) {
  const text = String(src).replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  if (!text.startsWith('---\n')) return { meta: {}, body: text, hadFrontmatter: false };
  const end = text.indexOf('\n---', 3);
  if (end === -1) return { meta: {}, body: text, hadFrontmatter: false };
  const raw = text.slice(4, end);
  const rest = text.slice(text.indexOf('\n', end + 1) + 1 || text.length);
  const meta = {};
  for (const line of raw.split('\n')) {
    const m = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (!m) continue;
    let v = m[2].trim().replace(/^["'](.*)["']$/, '$1');
    meta[m[1]] = v;
  }
  return { meta, body: rest, hadFrontmatter: true };
}

/* ---- blocks ------------------------------------------------------------- */
function dedent(lines, n) { return lines.map((l) => (l.trim() === '' ? '' : l.slice(n))); }

function blocks(lines, stats, depth) {
  const out = [];
  let i = 0;
  const flushable = [];

  const para = () => {
    if (!flushable.length) return;
    out.push('<p>' + inline(flushable.join('\n'), stats) + '</p>');
    flushable.length = 0;
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') { para(); i++; continue; }

    let m = BLOCK.FENCE.exec(line);
    if (m) {
      para();
      const close = m[2][0];
      const lang = m[3] || '';
      const buf = [];
      i++;
      while (i < lines.length && !new RegExp('^\\s*' + close + '{' + m[2].length + ',}\\s*$').test(lines[i])) buf.push(lines[i++]);
      i++;
      stats.fences++;
      out.push('<div class="highlight"><pre><code' + (lang ? ' class="language-' + lang + '"' : '') + '>' + esc(buf.join('\n')) + '\n</code></pre></div>');
      continue;
    }

    /* 🔴 HTML COMMENTS ARE STRIPPED, AND THIS IS THE ONE THAT BIT.
     * Authors comment blocks OUT -- uritp-safety's emergency-contacts.md has a
     * whole phone directory inside an HTML comment. python-markdown passes a
     * comment through as raw HTML and the browser hides it; escaping it instead
     * makes the markup visible AND renders the table inside it. A safety page
     * publishing a directory its author deliberately withdrew is the worst
     * available failure here, so comments are removed outright. Fences are
     * handled above, so a comment shown as an example survives. */
    if (BLOCK.COMMENT.test(line)) {
      para();
      if (/-->/.test(line)) { stats.comments++; i++; continue; }
      i++;
      while (i < lines.length && !/-->/.test(lines[i])) i++;
      i++;
      stats.comments++;
      continue;
    }

    /* Content tabs: `=== "Title"` with a four-space body. CONSECUTIVE blocks are
     * ONE set, which is not a guess -- the live uritp-safety PPE page renders all
     * seven labels in a row followed by all seven bodies, which is exactly this
     * shape. Without this branch that page's four-space bodies fall through to
     * the indented-code branch and a PPE requirement list renders as source. */
    m = BLOCK.TAB.exec(line);
    if (m) {
      para();
      const tabs = [];
      while (i < lines.length) {
        const t = BLOCK.TAB.exec(lines[i]);
        if (!t) break;
        i++;
        const body = [];
        while (i < lines.length && (lines[i].trim() === '' || /^ {4}/.test(lines[i]) || /^\t/.test(lines[i]))) {
          body.push(lines[i].replace(/^\t/, '    '));
          i++;
        }
        while (body.length && body[body.length - 1].trim() === '') body.pop();
        tabs.push({ label: t[2].replace(/\\"/g, '"'), body });
      }
      const n = ++stats.tabSets;
      const name = '__tabbed_' + n;
      const inputs = tabs.map((_, k) => '<input' + (k === 0 ? ' checked="checked"' : '') +
        ' id="' + name + '_' + (k + 1) + '" name="' + name + '" type="radio">').join('');
      const labels = tabs.map((t, k) => '<label for="' + name + '_' + (k + 1) + '">' + inline(t.label, stats) + '</label>').join('');
      const bodies = tabs.map((t) => '<div class="tabbed-block">' + (t.body.length ? blocks(dedent(t.body, 4), stats, depth + 1) : '') + '</div>').join('');
      stats.tabs += tabs.length;
      out.push('<div class="tabbed-set tabbed-alternate" data-tabs="' + n + ':' + tabs.length + '">' + inputs +
        '<div class="tabbed-labels">' + labels + '</div><div class="tabbed-content">' + bodies + '</div></div>');
      continue;
    }

    // Admonition BEFORE indented-code, because its body IS four-space indented.
    m = BLOCK.ADM.exec(line);
    if (m) {
      para();
      const marker = m[1];
      const fam = m[2].toLowerCase();
      const title = m[3];
      const collapsible = marker[0] === '?';
      i++;
      const body = [];
      while (i < lines.length && (lines[i].trim() === '' || /^ {4}/.test(lines[i]) || /^\t/.test(lines[i]))) {
        body.push(lines[i].replace(/^\t/, '    '));
        i++;
      }
      while (body.length && body[body.length - 1].trim() === '') body.pop();
      const inner = body.length ? blocks(dedent(body, 4), stats, depth + 1) : '';
      stats.admonitions++;
      if (!body.length) stats.admonitionsEmpty++;
      /* A body-less engine directive states its absence using the engine's OWN
       * unresolved-reference class, which base.css already styles. Reusing that
       * treatment beats inventing a placeholder look. */
      if (DATA_DIRECTIVES.has(fam) && !body.length) {
        stats.directives++;
        stats.admonitionsEmpty--;
        out.push('<p class="docrender-dead" title="' + fam + ' blocks are resolved by the engine at build time">' +
          fam + (title === undefined ? '' : ' \u2014 ' + esc(title.replace(/\\"/g, '"'))) +
          ' \u00b7 renders at build time</p>');
        continue;
      }
      const cap = fam.charAt(0).toUpperCase() + fam.slice(1);
      const head = title === undefined ? cap : inline(title.replace(/\\"/g, '"'), stats);
      if (collapsible) {
        out.push('<details class="' + fam + '"' + (marker.endsWith('+') ? ' open' : '') +
          '><summary>' + head + '</summary>' + inner + '</details>');
      } else {
        out.push('<div class="admonition ' + fam + '"><p class="admonition-title">' + head + '</p>' + inner + '</div>');
      }
      continue;
    }

    m = BLOCK.HEAD.exec(line);
    if (m) {
      para();
      const lvl = m[1].length;
      let text = m[2].trim();
      let id = null;
      const anchor = /\{#([\w-]+)\}\s*$/.exec(text);
      if (anchor) { id = anchor[1]; text = text.slice(0, anchor.index).trim(); }
      const hid = id || slug(text);
      stats.headings++;
      out.push('<h' + lvl + ' id="' + hid + '">' + inline(text, stats) +
        ' <a class="headerlink" href="#' + hid + '" title="Permanent link">\u00b6</a></h' + lvl + '>');
      i++; continue;
    }

    if (BLOCK.HR.test(line)) { para(); out.push('<hr>'); i++; continue; }

    // Pipe table: a row, then a delimiter row. Both required.
    if (BLOCK.ROW.test(line) && i + 1 < lines.length && BLOCK.SEP.test(lines[i + 1])) {
      para();
      const cells = (r) => r.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map((c) => c.replace(/\\\|/g, '|').trim());
      const aligns = cells(lines[i + 1]).map((c) => (/^:-+:$/.test(c) ? 'center' : /-+:$/.test(c) ? 'right' : /^:-+/.test(c) ? 'left' : ''));
      const head = cells(line);
      i += 2;
      const body = [];
      while (i < lines.length && BLOCK.ROW.test(lines[i])) body.push(cells(lines[i++]));
      const th = head.map((c, n) => '<th' + (aligns[n] ? ' style="text-align:' + aligns[n] + '"' : '') + '>' + inline(c, stats) + '</th>').join('');
      const tr = body.map((r) => '<tr>' + head.map((_, n) =>
        '<td' + (aligns[n] ? ' style="text-align:' + aligns[n] + '"' : '') + '>' + inline(r[n] === undefined ? '' : r[n], stats) + '</td>').join('') + '</tr>').join('');
      stats.tables++;
      out.push('<table><thead><tr>' + th + '</tr></thead><tbody>' + tr + '</tbody></table>');
      continue;
    }

    if (BLOCK.QUOTE.test(line)) {
      para();
      const buf = [];
      while (i < lines.length && (BLOCK.QUOTE.test(lines[i]) || (lines[i].trim() !== '' && buf.length && !BLOCK.HEAD.test(lines[i])))) {
        const q = BLOCK.QUOTE.exec(lines[i]);
        buf.push(q ? q[1] : lines[i]);
        i++;
      }
      out.push('<blockquote>' + blocks(buf, stats, depth + 1) + '</blockquote>');
      continue;
    }

    if (BLOCK.UL.test(line) || BLOCK.OL.test(line)) { para(); const r = list(lines, i, stats, depth); out.push(r.html); i = r.next; continue; }

    if (/^ {4}/.test(line) && !flushable.length) {
      para();
      const buf = [];
      while (i < lines.length && (/^ {4}/.test(lines[i]) || lines[i].trim() === '')) buf.push(lines[i++].slice(4));
      while (buf.length && buf[buf.length - 1].trim() === '') buf.pop();
      out.push('<div class="highlight"><pre><code>' + esc(buf.join('\n')) + '\n</code></pre></div>');
      continue;
    }

    // Leading space only: a trailing double-space is a hard line break.
    flushable.push(line.replace(/^\s+/, ''));
    i++;
  }
  para();
  return out.join('\n');
}

/* Nesting is by INDENT WIDTH, which is the thing naive list parsers get wrong.
 * A deeper indent opens a child list; a shallower one closes back out. */
function list(lines, start, stats, depth) {
  const first = BLOCK.OL.exec(lines[start]);
  const ordered = !!first;
  const baseIndent = (ordered ? first[1] : BLOCK.UL.exec(lines[start])[1]).length;
  const items = [];
  let i = start;

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '') {
      const nxt = lines[i + 1];
      if (nxt === undefined) break;
      const nm = BLOCK.UL.exec(nxt) || BLOCK.OL.exec(nxt);
      if (!nm && !/^ {2,}\S/.test(nxt)) break;
      items.length && items[items.length - 1].push('');
      i++; continue;
    }
    const um = BLOCK.UL.exec(line);
    const om = BLOCK.OL.exec(line);
    const mm = um || om;
    if (mm) {
      const ind = mm[1].length;
      if (ind < baseIndent) break;
      if (ind >= baseIndent + 2) {
        items.length || items.push([]);
        items[items.length - 1].push(line.slice(baseIndent + 2));
        i++; continue;
      }
      if (!!om !== ordered) break;
      items.push([um ? um[2] : om[3]]);
      i++; continue;
    }
    if (!items.length) break;
    const cont = /^(\s*)/.exec(line)[1].length;
    if (cont > baseIndent) { items[items.length - 1].push(line.slice(Math.min(cont, baseIndent + 2))); i++; continue; }
    items[items.length - 1].push(line.trim());
    i++;
  }

  stats.lists++;
  const html = items.map((it) => {
    while (it.length && it[it.length - 1].trim() === '') it.pop();
    const multi = it.some((l, n) => n > 0 && (l.trim() === '' || BLOCK.UL.test(l) || BLOCK.OL.test(l) || BLOCK.FENCE.test(l)));
    if (!multi) return '<li>' + inline(it.join('\n'), stats) + '</li>';
    const inner = blocks(it, stats, depth + 1);
    return '<li>' + inner.replace(/^<p>([\s\S]*?)<\/p>/, '$1') + '</li>';
  }).join('');
  return { html: '<' + (ordered ? 'ol' : 'ul') + '>' + html + '</' + (ordered ? 'ol' : 'ul') + '>', next: i };
}

/* ---- entry -------------------------------------------------------------- */
export function render(src) {
  const { meta, body, hadFrontmatter } = splitFrontmatter(src);
  const stats = { headings: 0, links: 0, xrefs: 0, markers: 0, admonitions: 0, admonitionsEmpty: 0,
    tables: 0, lists: 0, fences: 0, comments: 0, tabSets: 0, tabs: 0, directives: 0 };
  const html = blocks(body.split('\n'), stats, 0);
  return { html, meta, stats, hadFrontmatter };
}

export default { render, splitFrontmatter, LIMITS };
