/* app.js -- wiring only. The parser is drmd.js, the mechanism is sites.js, and this
 * file owns the two panes, the debounce, the status line and print.
 *
 * EVERY FAILURE PATH REPORTS ITS SOURCE. A silent fallback that renders SLIGHTLY
 * wrong is the failure mode this app is most likely to have and least likely to
 * notice -- the same shape as the engine's contrast table that "read as a check that
 * passed" while never having been measured. So: no fallback is ever quiet, and the
 * status line always names which site resolved and which did not.
 */
import { render, LIMITS } from './drmd.js';
import { loadSites, readHead, buildDoc, extractContent, paint, SCHEMES } from './sites.js';

const $ = (id) => document.getElementById(id);
const DEBOUNCE_MS = 150;

const state = { sites: [], site: null, head: null, scheme: 'slate', mode: 'paste', src: '', uploadHtml: null, uploadName: null };

const SAMPLE = `---
id: example
title: Example page
type: page
status: public
revised: 2026-09
---

# Example page

Paste or drop a page written in **our format**. Callouts, tables, markers,
content tabs and fenced code all render.

!!! note "This is a callout"

    Indent the body four spaces. That is what tells the parser it belongs to
    the box.

!!! danger "And this is the one that matters"

    Colour comes from the selected site's own theme, not from this app.

=== "Tab one"

    - content tabs group into a set
    - exactly as the live safety pages do

=== "Tab two"

    Second tab.

| Column | What it does |
| --- | --- |
| \`status:\` | what reaches the site |
| \`nav:\` | what a reader is offered |

A marker reads [40'-0"]{.conf} and an unchecked one reads [grid height]{.tbc}.
A cross-reference like [another page](@some-id) cannot resolve in one page, so
it renders as the engine's own dead reference.
`;

/* ---- status ------------------------------------------------------------- */
function status(kind, msg) {
  const el = $('status');
  el.className = 'status status--' + kind;
  el.textContent = msg;
}

function setBanner() {
  const b = $('banner');
  if (state.mode === 'upload') {
    b.hidden = false;
    b.className = 'banner banner--full';
    b.textContent = 'Upload mode: full fidelity. This page was rendered by the engine; only the skin is being re-applied.';
  } else {
    b.hidden = false;
    b.className = 'banner';
    b.textContent = 'Paste mode: prose, callouts, tables, tabs and markers. No frontmatter furniture (lede, aka, revised, spec tables) \u2014 those are engine-side.';
  }
}

/* ---- render ------------------------------------------------------------- */
let timer = null;
function schedule() { clearTimeout(timer); timer = setTimeout(repaint, DEBOUNCE_MS); }

function repaint() {
  const frame = $('preview');
  let bodyHtml = '';

  if (state.mode === 'upload' && state.uploadHtml) {
    const x = extractContent(state.uploadHtml);
    bodyHtml = x.html;
    $('stats').textContent = 'uploaded \u00b7 ' + state.uploadName + ' \u00b7 content taken from .' + String(x.found).split(' ')[0];
  } else {
    const t0 = performance.now();
    let r;
    try {
      r = render(state.src);
    } catch (e) {
      status('bad', 'Render failed: ' + e.message);
      return;
    }
    const ms = Math.round(performance.now() - t0);
    bodyHtml = r.html;
    const parts = Object.entries(r.stats).filter(([k, v]) => v > 0 && k !== 'admonitionsEmpty').map(([k, v]) => v + ' ' + k);
    $('stats').textContent = (r.hadFrontmatter ? 'frontmatter: ' + (r.meta.id || '(no id)') + ' \u00b7 ' : 'no frontmatter \u00b7 ') +
      (parts.length ? parts.join(', ') : 'empty') + ' \u00b7 ' + ms + 'ms';
  }

  paint(frame, buildDoc({ bodyHtml, head: state.head, scheme: state.scheme }));
}

/* ---- sites -------------------------------------------------------------- */
async function pickSite(slug) {
  const site = state.sites.find((s) => s.slug === slug);
  if (!site) { status('bad', 'No such site: ' + slug); return; }
  state.site = site;
  status('busy', 'Reading ' + site.name + ' \u2026');
  try {
    const head = await readHead(site.url);
    state.head = head;
    if (head.scheme) state.scheme = head.scheme;
    $('scheme').value = state.scheme;
    if (!head.stylesheets.length) {
      status('warn', site.name + ' resolved but linked NO stylesheets \u2014 preview is unstyled. The site may be mid-deploy.');
    } else {
      status('ok', site.name + ' \u00b7 ' + head.stylesheets.length + ' stylesheets live from ' + new URL(site.url).pathname);
    }
  } catch (e) {
    state.head = null;
    // No vendored fallback exists, deliberately: the three generated sheets have no
    // file to copy and every URL is fingerprinted. So an unreachable site is
    // reported as unstyled rather than approximated.
    status('bad', 'Could not read ' + site.name + ' (' + e.message + '). Preview renders UNSTYLED \u2014 structure only, no theme.');
  }
  repaint();
}

/* ---- boot --------------------------------------------------------------- */
async function boot() {
  $('limits').textContent = LIMITS.join(' \u00b7 ');

  for (const [v, label] of Object.entries(SCHEMES)) {
    const o = document.createElement('option');
    o.value = v; o.textContent = label;
    $('scheme').append(o);
  }

  const ta = $('src');
  ta.value = SAMPLE;
  state.src = SAMPLE;
  ta.addEventListener('input', () => { state.src = ta.value; if (state.mode === 'paste') schedule(); });

  $('scheme').addEventListener('change', (e) => { state.scheme = e.target.value; repaint(); });
  $('print').addEventListener('click', () => {
    const w = $('preview').contentWindow;
    w.focus();
    w.print();
  });

  for (const r of document.querySelectorAll('input[name=mode]')) {
    r.addEventListener('change', (e) => {
      state.mode = e.target.value;
      $('pane-paste').hidden = state.mode !== 'paste';
      $('pane-upload').hidden = state.mode !== 'upload';
      setBanner();
      repaint();
    });
  }

  const file = $('file');
  file.addEventListener('change', async () => {
    const f = file.files[0];
    if (!f) return;
    const text = await f.text();
    state.uploadName = f.name;
    if (/\.html?$/i.test(f.name)) {
      state.uploadHtml = text;
      state.mode = 'upload';
      document.querySelector('input[name=mode][value=upload]').checked = true;
    } else {
      state.uploadHtml = null;
      state.src = text;
      ta.value = text;
      state.mode = 'paste';
      document.querySelector('input[name=mode][value=paste]').checked = true;
    }
    $('pane-paste').hidden = state.mode !== 'paste';
    $('pane-upload').hidden = state.mode !== 'upload';
    $('upload-name').textContent = f.name + ' (' + f.size.toLocaleString() + ' B)';
    setBanner();
    repaint();
  });

  // Drop anywhere on the editor pane.
  const dz = $('editor');
  dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('drop'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('drop'));
  dz.addEventListener('drop', (e) => {
    e.preventDefault(); dz.classList.remove('drop');
    if (e.dataTransfer.files[0]) { file.files = e.dataTransfer.files; file.dispatchEvent(new Event('change')); }
  });

  setBanner();

  try {
    state.sites = await loadSites();
    const sel = $('site');
    sel.innerHTML = '';
    for (const s of state.sites) {
      const o = document.createElement('option');
      o.value = s.slug; o.textContent = s.name;
      sel.append(o);
    }
    sel.addEventListener('change', (e) => pickSite(e.target.value));
    if (state.sites.length) { sel.value = state.sites[0].slug; await pickSite(state.sites[0].slug); }
    else status('bad', 'instances.json listed no sites.');
  } catch (e) {
    status('bad', 'Could not load the site list (' + e.message + '). Preview renders UNSTYLED.');
    repaint();
  }
}

boot();
