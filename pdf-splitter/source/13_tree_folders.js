/* Live file-tree preview (single choke point that invalidates the download),
   folder-list editor, header ZIP-root preview. */
(function () {
  var state = PS.state, el = PS.el, cleanName = PS.cleanName, folderColor = PS.folderColor,
      computeModel = PS.computeModel, syncMarkdown = PS.syncMarkdown;

  function fileLine(g) {
    var tag = g.pages.length === 1 ? ("p" + g.pages[0]) : ("p" + g.pages[0] + "-" + g.pages[g.pages.length - 1]);
    return '<div class="file"><i data-lucide="file-text"></i> ' + g.finalName + '<span class="pp">' + tag + '</span></div>';
  }

  function renderTree(model) {
    PS.invalidateDownload(); // every state change re-renders the tree and kills any stale ZIP link
    var tree = el("tree");
    if (state.pageCount === 0) { tree.innerHTML = '<div class="tree-empty">No PDF loaded yet.</div>'; return; }
    var root = cleanName(state.headerFolder) || "export";
    var html = '<div class="folder"><i data-lucide="folder"></i> ' + root + '/</div>';
    var groups = model.groups;
    if (groups.length === 0) {
      var n = state.pageCount, shown = Math.min(n, 6);
      for (var p = 1; p <= shown; p++) html += '<div class="file"><i data-lucide="file-text"></i> page_' + p + '.pdf<span class="pp">p' + p + '</span></div>';
      if (n > shown) html += '<div class="file" style="opacity:0.7"><i data-lucide="more-horizontal"></i> +' + (n - shown) + ' more single-page PDFs</div>';
    } else if (state.useFolders) {
      var byDir = {}; var rootFiles = [];
      groups.forEach(function (g) { if (g.dir) (byDir[g.dir] = byDir[g.dir] || []).push(g); else rootFiles.push(g); });
      Object.keys(byDir).sort().forEach(function (dir) {
        html += '<div class="folder" style="padding-left:1rem;"><i data-lucide="folder" style="color:' + folderColor(dir) + '"></i> ' + dir + '/</div>';
        byDir[dir].forEach(function (g) { html += fileLine(g); });
      });
      state.folders.forEach(function (f) {
        if (!byDir[f.name]) html += '<div class="folder" style="padding-left:1rem;opacity:0.7;"><i data-lucide="folder" style="color:' + f.color + '"></i> ' + f.name + '/<span class="unused-tag">(unused)</span></div>';
      });
      rootFiles.forEach(function (g) { html += fileLine(g); });
    } else { groups.forEach(function (g) { html += fileLine(g); }); }
    if (state.settings.includeUnused && model.unusedPages.length && groups.length) {
      model.unusedPages.forEach(function (p) { html += '<div class="file"><i data-lucide="file-text"></i> page_' + p + '.pdf<span class="pp">p' + p + '</span></div>'; });
    }
    if (state.settings.genReport) html += '<div class="root-file"><i data-lucide="file-text"></i> _export_report.txt</div>';
    tree.innerHTML = html; window.lucide && lucide.createIcons();
  }

  function renderFolderList() {
    var model = computeModel(); var counts = {};
    model.groups.forEach(function (g) { if (g.folderIntent) counts[g.folderIntent] = (counts[g.folderIntent] || 0) + 1; });
    var list = el("folderList"); list.innerHTML = "";
    if (!state.folders.length) {
      list.innerHTML = '<div style="font-size:0.8rem;color:var(--text-faint);text-align:center;padding:0.5rem;">No folders yet. Add one below, or pick one from the Folder dropdown on any split.</div>';
      return;
    }
    state.folders.forEach(function (f, idx) {
      var item = document.createElement("div"); item.className = "folder-item"; var c = counts[f.name] || 0;
      item.innerHTML = '<span class="fdot" style="background:' + f.color + '"></span>';
      var inp = document.createElement("input"); inp.value = f.name;
      inp.addEventListener("change", function () {
        var old = f.name, nn = inp.value.trim(); if (!nn) { inp.value = old; return; }
        state.splits.forEach(function (s) { if ((s.folder || "").trim() === old) s.folder = nn; });
        f.name = nn; PS.renderRows(); syncMarkdown(); renderFolderList();
      });
      var count = document.createElement("span"); count.className = "fcount"; count.style.color = c === 0 ? "var(--warn)" : "";
      count.textContent = c === 0 ? "unused" : (c + (c === 1 ? " split" : " splits"));
      var rm = document.createElement("button"); rm.className = "rm"; rm.innerHTML = '<i data-lucide="x"></i>';
      rm.onclick = function () {
        if (c > 0 && !confirm('"' + f.name + '" is assigned to ' + c + ' split' + (c === 1 ? "" : "s") + '. Remove it and clear those assignments?')) return;
        state.splits.forEach(function (s) { if ((s.folder || "").trim() === f.name) s.folder = ""; });
        state.folders.splice(idx, 1); PS.renderRows(); syncMarkdown(); renderFolderList();
      };
      item.appendChild(inp); item.appendChild(count); item.appendChild(rm); list.appendChild(item);
    });
    window.lucide && lucide.createIcons();
  }

  function renderHeaderClean() {
    el("fnameClean").innerHTML = '<span class="lbl">ZIP root \u2192</span> ' + (cleanName(state.headerFolder) || "export") + "/";
  }

  PS.renderTree = renderTree;
  PS.renderFolderList = renderFolderList;
  PS.renderHeaderClean = renderHeaderClean;
})();
