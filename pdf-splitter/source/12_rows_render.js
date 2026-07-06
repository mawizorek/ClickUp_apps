/* Row rendering + validation badges. Generic: folder dot uses the assigned folder's
   palette color; no hardcoded folder-type classes, no smart-suggestion chip. */
(function () {
  var state = PS.state, el = PS.el, cleanName = PS.cleanName, parsePages = PS.parsePages,
      computeModel = PS.computeModel, rowVerdict = PS.rowVerdict,
      folderColor = PS.folderColor, ensureFolder = PS.ensureFolder, syncMarkdown = PS.syncMarkdown;

  function renderRows() {
    var rows = el("rows"); rows.innerHTML = "";
    if (state.splits.length === 0) {
      var n = state.pageCount || 0;
      rows.innerHTML =
        '<div class="empty-portal">' +
        '<div class="t">No splits defined yet</div>' +
        '<div class="s">Click pages in the sidebar, add a split manually, or import a .md.<br>' +
        'Export with none defined and each page becomes its own single-page PDF.</div>' +
        '<div class="auto"><i data-lucide="wand-2"></i> Default: ' + n + ' single-page PDF' + (n === 1 ? "" : "s") + '</div>' +
        '</div>';
      window.lucide && lucide.createIcons(); renderStatusEmpty(); PS.renderTree(computeModel()); return;
    }
    state.splits.forEach(function (s, i) { rows.appendChild(rowEl(s, i)); });
    window.lucide && lucide.createIcons(); refreshMeta();
  }

  function rowEl(s, i) {
    var row = document.createElement("div");
    row.className = "row"; row.dataset.i = i;

    var dot = document.createElement("span");
    dot.className = "fdot";
    dot.style.background = folderColor(s.folder);
    dot.title = (s.folder || "").trim() ? "Folder: " + s.folder : "No folder";

    var nameField = document.createElement("div");
    nameField.className = "field name-field";
    nameField.innerHTML = "<label>Document name</label>";
    var nameInput = document.createElement("input");
    nameInput.value = s.name || ""; nameInput.spellcheck = false; nameInput.placeholder = "untitled";
    var clean = document.createElement("div");
    clean.className = "clean"; clean.innerHTML = "<b>" + (cleanName(s.name) || "untitled") + ".pdf</b>";
    nameField.appendChild(nameInput); nameField.appendChild(clean);
    nameInput.addEventListener("input", function () {
      s.name = nameInput.value; clean.innerHTML = "<b>" + (cleanName(s.name) || "untitled") + ".pdf</b>";
      syncMarkdown(); refreshMeta();
    });

    var folderField = document.createElement("div");
    folderField.className = "field folder-field";
    folderField.innerHTML = "<label>Folder</label>";
    var sel = document.createElement("select");
    sel.add(new Option("\u2014 None", ""));
    state.folders.forEach(function (f) { sel.add(new Option(f.name, f.name)); });
    if ((s.folder || "").trim() && !state.folders.some(function (f) { return f.name === s.folder; })) sel.add(new Option(s.folder, s.folder));
    sel.add(new Option("\uFF0B New folder\u2026", "__new__"));
    sel.value = (s.folder || "");
    sel.onchange = function () {
      if (sel.value === "__new__") {
        var name = prompt("New folder name:");
        if (name && name.trim()) { ensureFolder(name.trim()); s.folder = name.trim(); }
        renderRows(); syncMarkdown(); return;
      }
      s.folder = sel.value; renderRows(); syncMarkdown();
    };
    folderField.appendChild(sel);

    var pagesGroup = document.createElement("div");
    pagesGroup.className = "pages-group";
    pagesGroup.appendChild(pageField("Start", s.start, function (v) { s.start = v; syncMarkdown(); refreshMeta(); }));
    pagesGroup.appendChild(pageField("End", s.end, function (v) { s.end = v; syncMarkdown(); refreshMeta(); }, "\u2014"));

    var meta = document.createElement("div");
    meta.className = "meta";
    var badge = document.createElement("span"); badge.className = "badge ok"; meta.appendChild(badge);
    var del = document.createElement("button"); del.className = "del"; del.innerHTML = '<i data-lucide="trash-2"></i>';
    del.onclick = function () { state.splits.splice(i, 1); renderRows(); syncMarkdown(); };
    meta.appendChild(del);

    row.appendChild(dot); row.appendChild(nameField); row.appendChild(folderField); row.appendChild(pagesGroup); row.appendChild(meta);
    return row;
  }

  function pageField(label, val, onChange, placeholder) {
    var f = document.createElement("div"); f.className = "field";
    var lb = document.createElement("label"); lb.textContent = label;
    var inp = document.createElement("input"); inp.className = "mono";
    inp.value = (val == null) ? "" : val; if (placeholder) inp.placeholder = placeholder; inp.inputMode = "numeric";
    inp.addEventListener("input", function () { onChange(inp.value.trim()); });
    f.appendChild(lb); f.appendChild(inp); return f;
  }

  function refreshMeta() {
    var model = computeModel();
    var rowEls = Array.prototype.slice.call(el("rows").querySelectorAll(".row"));
    var hardErrors = 0, ready = 0, total = 0;
    model.rowInfo.forEach(function (r) {
      var rEl = rowEls.find(function (x) { return Number(x.dataset.i) === r.i; }); if (!rEl) return;
      var existingNote = rEl.querySelector(".row-note"); if (existingNote) existingNote.remove();
      var badge = rEl.querySelector(".badge");
      var v = rowVerdict(r, model);
      if (r.blank) { if (badge) badge.style.display = "none"; return; }
      total++;
      if (badge) {
        badge.style.display = "";
        var icon = v.kind === "err" ? "alert-triangle" : v.kind === "warn" ? "info" : "check";
        badge.className = "badge " + (v.kind === "none" ? "ok" : v.kind);
        badge.innerHTML = '<i data-lucide="' + icon + '"></i> ' + (v.text || "");
      }
      if (v.kind === "err") hardErrors++; else ready++;
      if (v.note) {
        var note = document.createElement("div"); note.className = "row-note";
        if (v.kind === "err") note.style.color = "var(--err)";
        note.innerHTML = '<i data-lucide="' + (v.kind === "err" ? "alert-triangle" : "info") + '"></i> ' + v.note;
        rEl.appendChild(note);
      }
    });
    rowEls.forEach(function (rEl) {
      var s = state.splits[Number(rEl.dataset.i)]; if (!s) return;
      var dot = rEl.querySelector(".fdot"); if (dot) dot.style.background = folderColor(s.folder);
    });
    window.lucide && lucide.createIcons();
    renderStatus(hardErrors, ready, total, model);
    PS.renderTree(model);
    PS.refreshThumbSelection && PS.refreshThumbSelection();
    el("exportBtn").disabled = hardErrors > 0 || state.pageCount === 0;
  }

  function renderStatusEmpty() {
    var bar = el("statusBar"), txt = el("statusText");
    if (state.pageCount === 0) { bar.className = "status"; txt.textContent = "Load a PDF to begin."; return; }
    bar.className = "status"; var n = state.pageCount;
    txt.innerHTML = "<b>No splits defined.</b> Export = " + n + " single-page PDF" + (n === 1 ? "" : "s") + ".";
    el("exportBtn").disabled = state.pageCount === 0;
  }
  function renderStatus(hardErrors, ready, total, model) {
    var bar = el("statusBar"), txt = el("statusText");
    if (state.pageCount === 0) { bar.className = "status"; txt.textContent = "Load a PDF to begin."; return; }
    if (total === 0) { renderStatusEmpty(); return; }
    if (hardErrors > 0) {
      bar.className = "status blocked";
      txt.innerHTML = "<b>" + ready + " of " + total + " splits ready.</b> " + hardErrors + " error" + (hardErrors === 1 ? "" : "s") + " block" + (hardErrors === 1 ? "s" : "") + " export.";
    } else {
      bar.className = "status ready";
      txt.innerHTML = "<b>" + total + " split" + (total === 1 ? "" : "s") + " ready</b> \u2192 " + model.groups.length + " file" + (model.groups.length === 1 ? "" : "s") + ". Ready to export.";
    }
  }

  function invalidateDownload() {
    var a = el("dlLink"); if (a) a.classList.remove("show");
    var h = el("dlHint"); if (h) h.classList.remove("show");
    if (state.lastBlobUrl) { try { URL.revokeObjectURL(state.lastBlobUrl); } catch (e) {} state.lastBlobUrl = null; }
  }

  PS.renderRows = renderRows;
  PS.refreshMeta = refreshMeta;
  PS.renderStatusEmpty = renderStatusEmpty;
  PS.invalidateDownload = invalidateDownload;
})();
