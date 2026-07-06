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

/* ---- Per-row visual page picker (appended module). ----
 Opens a thumbnail grid scoped to ONE split row. Selection is a SET: tapping a
 page toggles it in/out, so 1-2-3-4-5 accumulates (no random clear/rebuild) and
 non-contiguous picks like 1-2-6-7 are valid. Pages owned by OTHER splits show
 dimmed with that split's folder color; with "Allow page overlap" off they lock.
 Writes s.pages straight back to the row + markdown source of truth. Built with
 createElement (no innerHTML markup) so agent readback never flattens it. Full
 entry/exit lifecycle per the Interaction-State Standard: trigger button = entry;
 X / Done / tap-outside / Esc = exit; tap-again on a page / Clear = deselect. */
(function () {
 var state = PS.state, el = PS.el, parsePages = PS.parsePages,
 folderColor = PS.folderColor, compressRuns = PS.compressRuns;
 var modal = null, gridEl = null, readoutEl = null, curIdx = -1, pickObserver = null;

 function ic(name) { var i = document.createElement("i"); i.setAttribute("data-lucide", name); return i; }

 function legendItem(kind, label) {
 var s = document.createElement("span"); s.className = "pk-leg pk-leg-" + kind;
 var sw = document.createElement("span"); sw.className = "pk-sw";
 var t = document.createElement("span"); t.textContent = label;
 s.appendChild(sw); s.appendChild(t); return s;
 }

 function buildModal() {
 modal = document.createElement("dialog"); modal.className = "picker-modal";

 var head = document.createElement("div"); head.className = "modal-head";
 var h = document.createElement("h3"); h.textContent = "Select pages"; head.appendChild(h);
 var x = document.createElement("button"); x.type = "button"; x.className = "x";
 x.setAttribute("aria-label", "Close"); x.appendChild(ic("x")); x.onclick = function () { close(); };
 head.appendChild(x); modal.appendChild(head);

 var body = document.createElement("div"); body.className = "modal-body picker-body";

 var hint = document.createElement("div"); hint.className = "picker-hint";
 hint.textContent = "Tap a page to add it, tap again to remove it. Non-adjacent pages are fine \u2014 e.g. 1\u20132 and 6\u20137 in one split.";
 body.appendChild(hint);

 var legend = document.createElement("div"); legend.className = "picker-legend";
 legend.appendChild(legendItem("free", "Free"));
 legend.appendChild(legendItem("own", "This split"));
 legend.appendChild(legendItem("other", "Another split"));
 body.appendChild(legend);

 gridEl = document.createElement("div"); gridEl.className = "picker-grid"; body.appendChild(gridEl);

 var foot = document.createElement("div"); foot.className = "picker-foot";
 readoutEl = document.createElement("span"); readoutEl.className = "picker-sel"; foot.appendChild(readoutEl);
 var clearBtn = document.createElement("button"); clearBtn.type = "button"; clearBtn.className = "btn";
 clearBtn.textContent = "Clear"; clearBtn.onclick = function () { clearSel(); }; foot.appendChild(clearBtn);
 var doneBtn = document.createElement("button"); doneBtn.type = "button"; doneBtn.className = "export-btn picker-done";
 doneBtn.textContent = "Done"; doneBtn.onclick = function () { close(); }; foot.appendChild(doneBtn);
 body.appendChild(foot);

 modal.appendChild(body); document.body.appendChild(modal);
 modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
 }

 // page -> folder color, for pages owned by any OTHER split (not the current one).
 function ownerMap() {
 var m = {};
 state.splits.forEach(function (s, idx) {
 if (idx === curIdx) return;
 var pp = parsePages(s); if (pp.status !== "ok") return;
 pp.pages.forEach(function (pg) { if (!m[pg]) m[pg] = folderColor(s.folder); });
 });
 return m;
 }

 // Current split's selected page set, as a plain array.
 function currentSet() {
 var s = state.splits[curIdx]; if (!s) return [];
 var pp = parsePages(s);
 return (pp.status === "ok") ? pp.pages.slice() : [];
 }
 function ownLookup() {
 var set = {}; currentSet().forEach(function (p) { set[p] = true; }); return set;
 }
 function applySet(arr) {
 var s = state.splits[curIdx]; if (!s) return;
 if (!arr.length) { s.pages = null; s.start = ""; s.end = ""; return; }
 arr.sort(function (a, b) { return a - b; });
 s.pages = arr; s.start = String(arr[0]); s.end = String(arr[arr.length - 1]);
 }

 function renderGrid() {
 if (!gridEl) return;
 if (pickObserver) pickObserver.disconnect();
 gridEl.textContent = "";
 var n = state.pageCount; if (!n) return;
 var owners = ownerMap(), own = ownLookup();
 var overlapOff = !state.settings.allowOverlap;
 var useThumbs = state.thumbsEnabled;

 pickObserver = new IntersectionObserver(function (entries) {
 entries.forEach(function (en) {
 if (en.isIntersecting) { var t = en.target; pickObserver.unobserve(t); if (useThumbs) drawThumb(t, Number(t.dataset.page)); }
 });
 }, { root: gridEl, rootMargin: "150px" });

 for (var i = 1; i <= n; i++) {
 var t = document.createElement("button"); t.type = "button"; t.className = "pk-thumb"; t.dataset.page = i;
 var owned = owners[i], isOwn = own[i], disabled = overlapOff && owned && !isOwn;
 if (isOwn) t.classList.add("pk-own");
 else if (owned) t.classList.add("pk-other");
 else t.classList.add("pk-free");
 if (disabled) { t.classList.add("pk-disabled"); t.disabled = true; }
 if (owned && !isOwn) { var dot = document.createElement("span"); dot.className = "pk-dot"; dot.style.background = owned; t.appendChild(dot); }
 var media = document.createElement("span"); media.className = "pk-media";
 if (!useThumbs) { var ph = document.createElement("span"); ph.className = "pk-ph"; media.appendChild(ph); }
 t.appendChild(media);
 var num = document.createElement("span"); num.className = "pk-num"; num.textContent = i; t.appendChild(num);
 (function (page, node) { node.onclick = function () { tapPage(page); }; })(i, t);
 gridEl.appendChild(t); pickObserver.observe(t);
 }
 updateReadout();
 }

 async function drawThumb(node, pageNum) {
 try {
 var page = await state.pdfjsDoc.getPage(pageNum);
 var vp0 = page.getViewport({ scale: 1 });
 var vp = page.getViewport({ scale: 150 / vp0.width });
 var c = document.createElement("canvas"); c.className = "pk-canvas"; c.width = vp.width; c.height = vp.height;
 await page.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise;
 var media = node.querySelector(".pk-media"); if (media) media.appendChild(c);
 } catch (e) {}
 }

 // Toggle a page in/out of the current split's set.
 function tapPage(p) {
 var set = currentSet();
 var at = set.indexOf(p);
 if (at === -1) set.push(p); else set.splice(at, 1);
 applySet(set); commit();
 }

 function clearSel() { applySet([]); commit(); }

 function commit() {
 PS.renderRows(); PS.syncMarkdown(); PS.invalidateDownload && PS.invalidateDownload();
 renderGrid(); window.lucide && lucide.createIcons();
 }

 function updateReadout() {
 if (!readoutEl) return;
 var set = currentSet();
 if (set.length) {
 readoutEl.textContent = set.length === 1 ? ("Page " + set[0]) : ("Pages " + compressRuns(set));
 readoutEl.className = "picker-sel has";
 } else { readoutEl.textContent = "No pages selected"; readoutEl.className = "picker-sel"; }
 }

 function open(idx) {
 if (!state.pageCount) return;
 if (!modal) buildModal();
 curIdx = idx;
 if (!modal.open) modal.showModal();
 renderGrid(); window.lucide && lucide.createIcons();
 }

 function close() { if (modal && modal.open) modal.close(); if (pickObserver) pickObserver.disconnect(); }

 // Inject a page-grid trigger into each split row's pages-group after every render.
 function injectButtons() {
 var rows = el("rows"); if (!rows) return;
 rows.querySelectorAll(".row").forEach(function (row) {
 var pg = row.querySelector(".pages-group"); if (!pg || pg.querySelector(".pick-btn")) return;
 var i = Number(row.dataset.i);
 var b = document.createElement("button"); b.type = "button"; b.className = "pick-btn";
 b.title = "Pick pages visually"; b.setAttribute("aria-label", "Pick pages visually");
 b.appendChild(ic("layout-grid")); b.onclick = function () { open(i); };
 pg.appendChild(b);
 });
 window.lucide && lucide.createIcons();
 }

 var _origRenderRows = PS.renderRows;
 PS.renderRows = function () { _origRenderRows.apply(this, arguments); injectButtons(); };
 PS.openPagePicker = open;

 // Cover the case where the first render already ran before this patch installed.
 if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", injectButtons);
 else injectButtons();
})();
