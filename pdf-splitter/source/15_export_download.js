/* Export: pdf-lib copyPages/merge, JSZip bundle, report, same-origin blob download. */
(function () {
  var state = PS.state, el = PS.el, cleanName = PS.cleanName, fmtSize = PS.fmtSize,
      computeModel = PS.computeModel;

  async function doExport() {
    if (state.pageCount === 0) return;
    document.body.classList.add("busy");
    el("exportBtn").innerHTML = '<i data-lucide="loader"></i> Building\u2026'; window.lucide && lucide.createIcons();
    try {
      var model = computeModel();
      var srcDoc = await PDFLib.PDFDocument.load(state.pdfBytes, { ignoreEncryption: true });
      var zip = new JSZip(); var rootName = cleanName(state.headerFolder) || "export"; var root = zip.folder(rootName);
      var report = [];
      report.push("PDF Splitter & Renamer \u2014 Export Report");
      report.push("Source: " + state.fileName + " (" + state.pageCount + " pages, " + fmtSize(state.fileSize) + ")");
      report.push("Generated: " + new Date().toLocaleString()); report.push("ZIP root: " + rootName + "/"); report.push("");

      async function extract(pages) {
        var out = await PDFLib.PDFDocument.create();
        var copied = await out.copyPages(srcDoc, pages.map(function (p) { return p - 1; }));
        copied.forEach(function (pg) { out.addPage(pg); });
        return out.save();
      }
      function place(dir, name, bytes) { if (state.useFolders && dir) root.folder(dir).file(name, bytes); else root.file(name, bytes); }

      if (model.groups.length === 0) {
        report.push("No splits defined. Exported each page as its own single-page PDF:");
        for (var p = 1; p <= state.pageCount; p++) { root.file("page_" + p + ".pdf", await extract([p])); report.push("  page_" + p + ".pdf \u2190 p" + p); }
      } else {
        report.push("Splits (" + model.groups.length + " file" + (model.groups.length === 1 ? "" : "s") + "):");
        for (var gi = 0; gi < model.groups.length; gi++) {
          var g = model.groups[gi];
          place(g.dir, g.finalName, await extract(g.pages));
          report.push("  " + ((state.useFolders && g.dir ? g.dir + "/" : "") + g.finalName) + " \u2190 pages " + g.pages.join(", "));
        }
        if (state.settings.includeUnused && model.unusedPages.length) {
          report.push(""); report.push("Unused pages (auto-split):");
          for (var ui = 0; ui < model.unusedPages.length; ui++) { var up = model.unusedPages[ui]; root.file("page_" + up + ".pdf", await extract([up])); report.push("  page_" + up + ".pdf \u2190 p" + up); }
        }
        var warns = [];
        var overlapPages = Object.keys(model.pageUse).filter(function (p) { return model.pageUse[p] > 1; });
        if (overlapPages.length) warns.push("Page overlap across different names: pages " + overlapPages.join(", ") + " (kept as separate files by design).");
        state.folders.forEach(function (f) { if (model.groups.every(function (g) { return g.folderIntent !== f.name; })) warns.push('Folder "' + f.name + '" declared but unused (no directory created).'); });
        model.rowInfo.forEach(function (r) { if (!r.blank && r.pages.status === "empty") warns.push('Split "' + r.s.name + '" has no pages assigned \u2014 skipped.'); });
        if (warns.length) { report.push(""); report.push("Warnings:"); warns.forEach(function (w) { report.push("  - " + w); }); }
      }
      if (state.settings.genReport) root.file("_export_report.txt", report.join("\n"));
      var blob = await zip.generateAsync({ type: "blob" });
      revealDownload(blob, rootName + ".zip");
    } catch (err) { alert("Export failed: " + (err && err.message ? err.message : err)); }
    finally { document.body.classList.remove("busy"); el("exportBtn").innerHTML = '<i data-lucide="package"></i> Export ZIP'; window.lucide && lucide.createIcons(); }
  }

  // Same-origin blob + real anchor. iOS: user long-presses -> "Download Linked File".
  // Desktop: auto-click. Never synthetic click in sandbox / data: URI / cross-origin link.
  function revealDownload(blob, filename) {
    if (state.lastBlobUrl) { try { URL.revokeObjectURL(state.lastBlobUrl); } catch (e) {} }
    var url = URL.createObjectURL(blob); state.lastBlobUrl = url;
    var a = el("dlLink"); a.href = url; a.download = filename; a.classList.add("show");
    a.innerHTML = '<i data-lucide="download"></i> Download ' + filename; window.lucide && lucide.createIcons();
    var isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    var isMobile = isIOS || /Android/.test(navigator.userAgent);
    var hint = el("dlHint");
    if (isMobile) { hint.textContent = "Long-press the button above, then tap \u201cDownload Linked File\u201d to save the ZIP to Files \u203a Downloads."; hint.classList.add("show"); }
    else { hint.classList.remove("show"); setTimeout(function () { a.click(); }, 350); }
  }

  function wireToggle(id, key, target) {
    var t = el(id);
    t.onclick = function () {
      t.classList.toggle("on"); var on = t.classList.contains("on"); t.dataset.on = on;
      if (target === "settings") state.settings[key] = on;
      else if (target === "useFolders") { state.useFolders = on; PS.renderRows(); PS.syncMarkdown(); }
      if (state.splits.length === 0) PS.renderTree(computeModel()); else PS.refreshMeta();
    };
  }

  PS.doExport = doExport;
  PS.wireToggle = wireToggle;
})();
