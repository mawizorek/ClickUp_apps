/* Prism — mobile chrome. Export bottom-sheet + tab-delimiter fix. Load AFTER core. */
(function () {
  /* Mobile-only styles, injected here so prism.css stays untouched this pass. */
  var css = [
    '@media (max-width:820px){',
    ' .exportbar{position:fixed;left:0;right:0;bottom:0;z-index:45;flex-direction:column;align-items:stretch;gap:var(--sp-3);',
    '  padding:var(--sp-4) var(--sp-4) calc(var(--sp-4) + env(safe-area-inset-bottom));border-top:1px solid var(--border);',
    '  border-radius:var(--r-lg) var(--r-lg) 0 0;box-shadow:0 -14px 44px oklch(0.1 0.02 265 / 0.5);',
    '  max-height:78vh;overflow-y:auto;transform:translateY(115%);transition:transform .28s var(--ease)}',
    ' .exportbar::before{content:"";flex:none;align-self:center;width:38px;height:4px;border-radius:2px;background:var(--border);margin-bottom:var(--sp-1)}',
    ' body.export-open .exportbar{transform:translateY(0)}',
    ' .exportbar .lbl{align-self:flex-start}',
    ' .exportbar .fmeta{align-self:flex-start}',
    ' .exportbar .spacer{display:none}',
    ' .exportbar .btn{width:100%;justify-content:center;padding:13px 16px;font-size:0.92rem}',
    ' .export-fab{position:fixed;right:16px;bottom:calc(18px + env(safe-area-inset-bottom));z-index:44;display:none;align-items:center;gap:8px;',
    '  padding:13px 20px;border-radius:100px;border:none;background:var(--accent);color:oklch(0.2 0.02 265);font-weight:650;font-size:0.9rem;',
    '  box-shadow:0 8px 26px oklch(0.1 0.02 265 / 0.55)}',
    ' body.has-view .export-fab{display:inline-flex}',
    ' body.export-open .export-fab{display:none}',
    ' .export-fab svg{width:18px;height:18px;stroke:oklch(0.2 0.02 265)}',
    ' .export-scrim{position:fixed;inset:0;background:oklch(0.1 0.02 265 / 0.5);opacity:0;pointer-events:none;transition:opacity .2s var(--ease);z-index:43}',
    ' body.export-open .export-scrim{opacity:1;pointer-events:auto}',
    '}',
    '@media (min-width:821px){.export-fab,.export-scrim{display:none!important}}'
  ].join('');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* Floating trigger + backdrop. */
  var fab = document.createElement('button');
  fab.type = 'button';
  fab.className = 'export-fab';
  fab.setAttribute('aria-label', 'Export options');
  fab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.9"><path d="M12 3v12m0 0 4-4m-4 4-4-4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" stroke-linecap="round"/></svg>Export';
  var scrim = document.createElement('div');
  scrim.className = 'export-scrim';
  document.body.appendChild(scrim);
  document.body.appendChild(fab);

  function openSheet() { document.body.classList.add('export-open'); }
  function closeSheet() { document.body.classList.remove('export-open'); }
  fab.addEventListener('click', openSheet);
  scrim.addEventListener('click', closeSheet);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });

  /* Close the sheet after a real export/copy tap; toggles keep it open. */
  var bar = document.getElementById('exportbar');
  if (bar) bar.addEventListener('click', function (e) {
    var t = e.target;
    while (t && t !== bar) { if (t.classList && t.classList.contains('btn')) { closeSheet(); break; } t = t.parentNode; }
  });

  /* Show the trigger only while a file is open; mirror viewer state on <body>. */
  var viewer = document.getElementById('viewer');
  function sync() {
    var on = !!(viewer && viewer.classList.contains('on'));
    document.body.classList.toggle('has-view', on);
    if (!on) closeSheet();
  }
  if (viewer) { new MutationObserver(sync).observe(viewer, { attributes: true, attributeFilter: ['class'] }); sync(); }

  /* Loose-end (a): the Tab delimiter button carries data-d="\t" (a literal
     backslash-t). core.js stores that literal in S.delim, but the CSV export
     compares against a real tab, so the escape leaks into the output. Normalize
     to a real tab right after selection. */
  document.querySelectorAll('#delimSeg button').forEach(function (b) {
    b.addEventListener('click', function () {
      if (typeof S !== 'undefined' && S.delim === '\\t') S.delim = '\t';
    });
  });
})();
