/* PDF load (pdf.js), lazy thumbnail rendering, page-grid click/shift-range. */
(function () {
  var state = PS.state, el = PS.el, stripExt = PS.stripExt, parsePages = PS.parsePages,
      fmtSize = PS.fmtSize, THUMB_CAP = PS.THUMB_CAP, syncMarkdown = PS.syncMarkdown;
  var thumbObserver = null;

  async function loadPDF(file) {
    if (!file) return;
    document.body.classList.add("busy");
    try {
      var buf = await file.arrayBuffer();
      // Parse FIRST; only commit bytes/state once the parse succeeds, so a bad PDF
      // can never leave stale pdfBytes paired with an old pageCount.
      var doc = await pdfjsLib.getDocument({ data: new Uint8Array(buf.slice(0)) }).promise;
      state.pdfBytes = buf.slice(0);
      state.pdfjsDoc = doc; state.pageCount = doc.numPages; state.fileName = file.name; state.fileSize = file.size;
      if (!state.headerTouched) { state.headerFolder = stripExt(file.name); el("fnameInput").value = state.headerFolder; }
      state.gridAnchor = null; state.thumbsEnabled = state.pageCount <= THUMB_CAP;
      renderDrop(); PS.renderHeaderClean(); renderPages(); PS.renderRows(); syncMarkdown();
    } catch (err) {
      el("dropTitle").textContent = "Couldn't read that PDF";
      el("dropSub").textContent = "It may be encrypted or corrupt. Try another file.";
    } finally { document.body.classList.remove("busy"); }
  }

  function renderDrop() {
    var drop = el("drop");
    if (state.pageCount > 0) {
      drop.classList.add("loaded"); drop.querySelector(".ic").innerHTML = '<i data-lucide="file-check-2"></i>';
      el("dropTitle").textContent = state.fileName;
      el("dropSub").textContent = state.pageCount + " page" + (state.pageCount === 1 ? "" : "s") + " loaded \u00b7 " + fmtSize(state.fileSize);
    } else {
      drop.classList.remove("loaded"); drop.querySelector(".ic").innerHTML = '<i data-lucide="file-plus-2"></i>';
    }
    window.lucide && lucide.createIcons();
  }

  function renderPages() {
    var grid = el("pgGrid"); grid.innerHTML = "";
    var n = state.pageCount; el("pgCount").textContent = n ? (n + " page" + (n === 1 ? "" : "s")) : "no PDF";
    if (!n) { el("pgHint").textContent = "Load a PDF to see its pages."; return; }
    if (thumbObserver) thumbObserver.disconnect();
    thumbObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { var t = en.target; thumbObserver.unobserve(t); if (state.thumbsEnabled) drawThumb(t, Number(t.dataset.page)); }
      });
    }, { root: null, rootMargin: "200px" });
    for (var i = 1; i <= n; i++) {
      var t = document.createElement("div"); t.className = "pg-thumb"; t.dataset.page = i;
      t.innerHTML = '<div class="lines"><span></span><span></span><span></span><span></span></div><div class="pnum">' + i + '</div>';
      (function (page, node) { node.onclick = function (e) { onPageClick(page, e.shiftKey); }; })(i, t);
      grid.appendChild(t); thumbObserver.observe(t);
    }
    if (n > THUMB_CAP && !state.thumbsEnabled) {
      el("pgHint").innerHTML = 'Large PDF \u2014 numbered placeholders for speed. <a href="#" id="renderThumbs" style="color:var(--accent)">Render thumbnails</a>';
      var link = el("renderThumbs"); if (link) link.onclick = function (e) { e.preventDefault(); state.thumbsEnabled = true; renderPages(); };
    } else { el("pgHint").textContent = "Click a page for a single-page split; shift-click a second to make a range."; }
    refreshThumbSelection();
  }

  async function drawThumb(t, pageNum) {
    try {
      var page = await state.pdfjsDoc.getPage(pageNum); var vp0 = page.getViewport({ scale: 1 });
      var vp = page.getViewport({ scale: 150 / vp0.width });
      var canvas = document.createElement("canvas"); canvas.width = vp.width; canvas.height = vp.height;
      await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
      var lines = t.querySelector(".lines"); if (lines) lines.remove(); t.insertBefore(canvas, t.firstChild);
    } catch (e) {}
  }

  function onPageClick(page, shift) {
    if (shift && state.gridAnchor) {
      var a = state.gridAnchor.page; var s = state.splits[state.gridAnchor.splitIndex];
      if (s) { s.start = String(Math.min(a, page)); s.end = String(Math.max(a, page)); }
      state.gridAnchor = null; PS.renderRows(); syncMarkdown();
    } else {
      state.splits.push({ name: "", start: String(page), end: String(page), folder: "" });
      state.gridAnchor = { page: page, splitIndex: state.splits.length - 1 };
      PS.renderRows(); syncMarkdown();
      var rows = el("rows").querySelectorAll(".row"); var last = rows[rows.length - 1];
      if (last) { var inp = last.querySelector(".name-field input"); if (inp) inp.focus(); }
    }
  }

  function refreshThumbSelection() {
    var active = new Set(); state.splits.forEach(function (s) { parsePages(s).pages.forEach(function (p) { active.add(p); }); });
    el("pgGrid").querySelectorAll(".pg-thumb").forEach(function (t) { t.classList.toggle("sel", active.has(Number(t.dataset.page))); });
  }

  PS.loadPDF = loadPDF;
  PS.renderDrop = renderDrop;
  PS.renderPages = renderPages;
  PS.refreshThumbSelection = refreshThumbSelection;
})();
