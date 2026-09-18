/* sites.js -- THE MECHANISM. Read a published page's <head>, reuse its stylesheet
 * set verbatim, render into Material's DOM shape.
 *
 * WHY A READ AND NOT A VENDORED COPY. Three reasons, each sufficient on its own,
 * all read out of mawizorek/doc-render-engine@main rather than assumed:
 *   1. `docrender/assets.py:_plan()` GENERATES tokens.css, marks.css and blocks.css
 *      per build from the theme TSVs. There is no file on disk to copy.
 *   2. Every asset URL carries a content fingerprint -- `base.a41f7c92.css` -- so no
 *      URL can be hardcoded; it changes whenever the bytes change.
 *   3. `assets/base.css` maps our --dr-* tokens onto Material's --md-* variables and
 *      MATERIAL does the painting. The engine's CSS is a patch layer, not a sheet.
 *
 * AND THE <head> CARRIES LOAD ORDER, WHICH IS LAW UPSTREAM WITH NAMED LIVE BUGS
 * ATTACHED: chrome.css before base.css reverts every dark-mode link to Material's
 * indigo; the print group before the generated sheets makes paper wrong "with no
 * error and no report". A hand-assembled list is a chance to reintroduce one of
 * those. A real <head> cannot get the order wrong.
 *
 * Same origin throughout (apps and doc sites are both mawizorek.github.io), so no
 * CORS, no proxy, nothing to configure -- including uritp-docs, whose repo is
 * private while its Pages site is public.
 */

/* THE ONLY TWO LEGAL VALUES. base.css scopes its entire Material mapping to
 * [data-md-color-scheme="slate"], [data-md-color-scheme="default"] -- nothing else
 * matches anything. ABSENT, THE SHEET PRINTS NEAR-BLACK: Material writes this
 * attribute from localStorage, so a reader who never touched the toggle keeps
 * Material's own dark values over a correct light palette. That is a real bug the
 * engine shipped, diagnosed and fixed (assets/print-md-bridge.css). This app is
 * exactly that reader, so the attribute is always written explicitly.
 * Never set this to a theme name -- that is the applyTheme() colour-vs-join fault,
 * logged twice upstream. */
export const SCHEMES = { slate: 'Dark (slate)', default: 'Light (default)' };

export async function loadSites(url = './source/instances.json') {
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error('instances.json HTTP ' + r.status);
  const j = await r.json();
  return Array.isArray(j.sites) ? j.sites : [];
}

/* Read one published page and report what it links, in document order.
 * Returns { stylesheets, inline, scheme, title, pageUrl }. */
export async function readHead(pageUrl) {
  const r = await fetch(pageUrl, { cache: 'no-store' });
  if (!r.ok) throw new Error('HTTP ' + r.status + ' from ' + pageUrl);
  const doc = new DOMParser().parseFromString(await r.text(), 'text/html');

  const stylesheets = [];
  const inline = [];
  // Document order is preserved by querySelectorAll, and document order IS the
  // cascade order. Do not sort, filter or de-duplicate this list.
  for (const el of doc.querySelectorAll('head link[rel~="stylesheet"], head style')) {
    if (el.tagName === 'STYLE') { inline.push(el.textContent || ''); continue; }
    const href = el.getAttribute('href');
    if (href) stylesheets.push(new URL(href, pageUrl).href);
  }

  const served = doc.documentElement.getAttribute('data-md-color-scheme');
  return {
    pageUrl,
    stylesheets,
    inline,
    scheme: Object.hasOwn(SCHEMES, served || '') ? served : null,
    title: (doc.querySelector('title')?.textContent || '').trim(),
  };
}

/* Material's own wrapper chain. `.md-typeset` is what every engine document rule
 * selects on (base.css: `.md-typeset .dr-lede`, `.md-typeset .dr-aka`, ...), and
 * `.md-content__inner` is what carries the content measure. Emitting this shape is
 * the cost of the mechanism and it is the right trade: a parallel reimplementation
 * guarantees drift, wearing the contract does not. */
function shell(bodyHtml) {
  return '<div class="md-container"><main class="md-main"><div class="md-main__inner md-grid">' +
    '<div class="md-content"><article class="md-content__inner md-typeset">' +
    bodyHtml +
    '</article></div></div></main></div>';
}

/* The preview is an IFRAME, and that is structural rather than stylistic.
 * Material's sheets style `body`, `:root` and document-level attributes, so
 * injecting them into this app's own document would restyle the editor too. An
 * iframe is a separate document: total isolation, and printing it prints ONLY the
 * preview, which is this app's primary job. */
export function buildDoc({ bodyHtml, head, scheme, extraCss = '' }) {
  const links = (head?.stylesheets || []).map((h) => '<link rel="stylesheet" href="' + h + '">').join('');
  const styles = (head?.inline || []).map((c) => '<style>' + c + '</style>').join('');
  const baseHref = head?.pageUrl ? '<base href="' + head.pageUrl + '">' : '';
  return '<!DOCTYPE html><html lang="en" data-md-color-scheme="' + (scheme || 'slate') + '">' +
    '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    baseHref + links + styles +
    // Only ever layout nudges for the frame itself. Never a colour, a radius, a
    // font or a spacing value: those belong to the site's own resolved theme, and a
    // local override here would be invisibly disagreeing with it.
    '<style>html,body{margin:0}.md-main__inner{margin-top:0}' + extraCss + '</style>' +
    '</head><body>' + shell(bodyHtml) + '</body></html>';
}

/* Upload mode: pull the content column out of an already-rendered page. No parser
 * involved, so fidelity is whatever the engine already produced. */
export function extractContent(htmlString) {
  const doc = new DOMParser().parseFromString(htmlString, 'text/html');
  const node = doc.querySelector('.md-content__inner') || doc.querySelector('article') ||
    doc.querySelector('.md-content') || doc.querySelector('main') || doc.body;
  if (!node) return { html: '', found: null };
  for (const kill of node.querySelectorAll('script,.md-source-file,.md-content__button,form')) kill.remove();
  return {
    html: node.innerHTML,
    found: node.className || node.tagName.toLowerCase(),
    scheme: doc.documentElement.getAttribute('data-md-color-scheme') || null,
  };
}

/* Write a document into an iframe. srcdoc is deliberately avoided: it makes the
 * frame's base URL opaque, which breaks the fingerprinted stylesheet URLs. */
export function paint(iframe, docHtml) {
  const d = iframe.contentDocument;
  d.open(); d.write(docHtml); d.close();
}
