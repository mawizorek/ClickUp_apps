/* drmd.inline.js -- everything that happens INSIDE a line.
 *
 * Split out of drmd.js at 17.6 KB, on the repo convention that a file which
 * cannot be read whole cannot be safely edited. The seam is real rather than
 * arbitrary: this file owns SPANS, drmd.js owns BLOCKS. Same split doc-render-
 * engine made between `print-type.css` (how big the type is) and
 * `print-space.css` (how much air) -- one question per file.
 */


/* Inline tags real pages use for formatting. Everything else is escaped.
 * 🔴 THIS LIST IS A SECURITY BOUNDARY, NOT A CONVENIENCE. The engine lets
 * python-markdown pass ALL raw HTML through; this app will not, because it renders
 * text a user pasted from anywhere. Adding `script`, `iframe`, `object`, `style`,
 * `form` or any tag carrying an event attribute turns a preview pane into an
 * execution surface. Formatting only, no attributes preserved. */
const SAFE_HTML = ['s', 'del', 'ins', 'mark', 'small', 'sub', 'sup', 'kbd', 'abbr', 'em', 'strong', 'b', 'i', 'u', 'br', 'wbr'];
const SAFE_RE = new RegExp('&lt;(/?)(' + SAFE_HTML.join('|') + ')\\s*/?&gt;', 'gi');

/* Parks a code span while the rest of the line is processed.
 *
 * 🔴 PURE ASCII WITH NO BACKSLASH ESCAPE, AND THAT IS A CORRECTNESS RULE.
 * This was a single NUL, written as a backslash-u escape. That escape did not
 * survive being written to disk -- the transport decodes it to a real NUL and a
 * shell cannot carry one -- so the sentinel silently became the EMPTY STRING,
 * which left the restore pattern as
 * /([0-9]+)/, matching every number in the document and replacing it with
 * held[thatNumber] === undefined. "In 2026 the cyc was 40 feet" rendered as
 * "In undefined the cyc was undefined feet".
 *
 * ⚑ IT PASSED A TWENTY-PAGE SUITE. Tag balance passed, no dialect leaked, every
 * count was correct, and every number in every fixture was destroyed -- because
 * nothing asserted that the document's own TEXT came out the other side. Checking
 * the wrong thing carefully feels exactly like checking the right thing. The
 * content-preservation checks in test/run.js exist because of this and must not be
 * removed.
 *
 * The random suffix makes a collision with authored text impractical; a fixed
 * sentinel could in principle be typed by somebody. */
const KEY = 'zQdRmDcOdE' + Math.random().toString(36).slice(2, 8) + 'x';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug = (s) => s.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-') || 'section';

/* ---- inline ------------------------------------------------------------- */
/* Code spans are lifted out FIRST and restored LAST. Any other order lets an
 * asterisk inside `a * b` become emphasis, which is the single most common way a
 * hand-written inline pass goes wrong. */
function inline(src, stats) {
  const held = [];
  let s = String(src).replace(/(`+)([\s\S]*?)\1/g, (_, f, code) => {
    held.push('<code>' + esc(code.trim()) + '</code>');
    return KEY + (held.length - 1) + KEY;
  });

  // AFTER code protection: a comment shown as an example inside backticks must
  // survive, while a real comment in prose must not. Order decides which.
  s = s.replace(/<!--[\s\S]*?-->/g, () => { stats.comments++; return ''; });

  s = esc(s);

  // A marker span: [text]{.class}. The pattern forbids ']' inside the text,
  // which is the engine's own documented constraint, not a shortcut.
  s = s.replace(/\[([^\]]+)\]\{\.([\w-]+)\}/g, (_, t, cls) => {
    stats.markers++;
    return '<span class="dr-mark dr-mark--plain" data-dr-marker="' + cls + '" title="' + cls + '">' + t + '</span>';
  });
  // Bare marker: {.gap} -- prints its own label upstream from markers.tsv, which
  // we do not have. Render the class name so it is visible rather than eaten.
  s = s.replace(/\{\.([\w-]+)\}/g, (_, cls) => {
    stats.markers++;
    return '<span class="dr-mark dr-mark--plain" data-dr-marker="' + cls + '" title="' + cls + '">' + cls + '</span>';
  });

  // Images before links: the syntaxes differ by one leading '!'.
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_, alt, src2) =>
    '<img alt="' + alt + '" src="' + src2 + '">');

  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_, t, href) => {
    // @id / @peer:id / @rel:id -- a cross-reference the engine resolves at build
    // time from state.PAGES. One page cannot resolve it, so it renders as the
    // engine's OWN dead-reference treatment rather than a broken link.
    if (href.startsWith('@')) {
      stats.xrefs++;
      return '<span class="docrender-dead" title="cross-reference ' + href + ' resolves at build time">' + t + '</span>';
    }
    stats.links++;
    const ext = /^[a-z][a-z0-9+.-]*:\/\//i.test(href);
    return '<a href="' + href + '"' + (ext ? ' rel="noopener"' : '') + '>' + t + '</a>';
  });

  s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>')
       .replace(/(\*\*\*|___)(?=\S)([\s\S]*?\S)\1/g, '<strong><em>$2</em></strong>')
       .replace(/(\*\*|__)(?=\S)([\s\S]*?\S)\1/g, '<strong>$2</strong>')
       .replace(/(?<![*\w])\*(?=[^\s*])([\s\S]*?)\*(?!\*)/g, '<em>$1</em>')
       .replace(/(?<![_\w])_(?=[^\s_])([\s\S]*?)_(?!\w)/g, '<em>$1</em>')
       .replace(/  \n/g, '<br>\n');

  /* Safe inline HTML is un-escaped LAST, after every markdown pass, so a tag can
   * never be assembled out of markdown output. Anything not whitelisted stays
   * escaped and is therefore inert. */
  s = s.replace(SAFE_RE, (_, close, tag) => '<' + close + tag.toLowerCase() + '>');

  return s.replace(new RegExp(KEY + '([0-9]+)' + KEY, 'g'), (_, i) => held[+i]);
}

/* Re-exported so drmd.js has one import site rather than two. */
export { inline, esc, slug };
