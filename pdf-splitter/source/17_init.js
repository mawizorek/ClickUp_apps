/* Wire everything + boot. Loads last in the module order. */
(function () {
  var state = PS.state, el = PS.el, ensureFolder = PS.ensureFolder,
      parseMarkdown = PS.parseMarkdown, syncMarkdown = PS.syncMarkdown,
      computeModel = PS.computeModel;

  function init() {
    var drop = el("drop");
    drop.onclick = function () { el("pdfInput").click(); };
    el("pdfInput").onchange = function (e) { PS.loadPDF(e.target.files[0]); };
    // Drag-and-drop onto the drop zone.
    ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("dragover"); }); });
    ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("dragover"); }); });
    drop.addEventListener("drop", function (e) {
      var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f && /\.pdf$/i.test(f.name)) PS.loadPDF(f);
    });

    el("importBtn").onclick = function () { el("mdImport").click(); };
    el("mdImport").onchange = async function (e) {
      var file = e.target.files[0]; if (!file) return;
      var parsed = parseMarkdown(await file.text());
      state.headerFolder = parsed.header || state.headerFolder; state.headerTouched = true; el("fnameInput").value = state.headerFolder;
      state.splits = parsed.splits; state.splits.forEach(function (s) { ensureFolder(s.folder); });
      PS.renderHeaderClean(); PS.renderRows(); syncMarkdown();
    };
    el("fnameInput").addEventListener("input", function () {
      state.headerFolder = el("fnameInput").value; state.headerTouched = true; PS.renderHeaderClean(); syncMarkdown();
      if (state.splits.length === 0) PS.renderTree(computeModel()); else PS.refreshMeta();
    });
    el("addRow").onclick = function () {
      state.splits.push({ name: "", start: "", end: "", folder: "" }); PS.renderRows(); syncMarkdown();
      var rows = el("rows").querySelectorAll(".row"); var last = rows[rows.length - 1];
      if (last) { var inp = last.querySelector(".name-field input"); if (inp) inp.focus(); }
    };

    var codeModal = el("codeModal");
    var openCode = function () { syncMarkdown(); codeModal.showModal(); };
    el("codeBtn").onclick = openCode; el("codeBtn2").onclick = openCode;
    var applyMd = function () {
      var parsed = parseMarkdown(el("mdArea").value);
      state.headerFolder = parsed.header; state.headerTouched = true; el("fnameInput").value = state.headerFolder;
      state.splits = parsed.splits; state.splits.forEach(function (s) { ensureFolder(s.folder); });
      PS.renderHeaderClean(); PS.renderRows();
    };
    el("codeClose").onclick = function () { applyMd(); codeModal.close(); };
    codeModal.addEventListener("click", function (e) { if (e.target === codeModal) { applyMd(); codeModal.close(); } });

    var foldersModal = el("foldersModal");
    el("foldersBtn").onclick = function () { PS.renderFolderList(); el("unassignedSel").value = state.unassignedDest; foldersModal.showModal(); };
    el("foldersClose").onclick = function () { foldersModal.close(); };
    foldersModal.addEventListener("click", function (e) { if (e.target === foldersModal) foldersModal.close(); });
    el("addFolderBtn").onclick = function () {
      var name = prompt("New folder name:");
      if (name && name.trim()) { ensureFolder(name.trim()); PS.renderFolderList(); if (state.splits.length) PS.refreshMeta(); else PS.renderTree(computeModel()); }
    };
    el("unassignedSel").onchange = function () { state.unassignedDest = el("unassignedSel").value; if (state.splits.length) PS.refreshMeta(); else PS.renderTree(computeModel()); };

    PS.wireToggle("tgUnused", "includeUnused", "settings");
    PS.wireToggle("tgOverlap", "allowOverlap", "settings");
    PS.wireToggle("tgReport", "genReport", "settings");
    PS.wireToggle("tgUseFolders", null, "useFolders");
    el("exportBtn").onclick = function () { PS.doExport(); };

    PS.initSettingsDrawer();
    PS.renderHeaderClean(); PS.renderRows(); PS.renderPages(); syncMarkdown();
    window.lucide && lucide.createIcons();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
