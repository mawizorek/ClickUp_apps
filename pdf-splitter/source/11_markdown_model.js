/* Markdown serialize/parse (source of truth), merge model, per-row verdicts. */
(function () {
 var state = PS.state, cleanName = PS.cleanName, parsePages = PS.parsePages,
 pageToken = PS.pageToken, compressRuns = PS.compressRuns, el = PS.el;

 function serializeMarkdown() {
 var head = ["folder_name: " + state.headerFolder, ""];
 var entries = state.splits.map(function (s) {
 var parts = ["page: " + pageToken(s), "name: " + (s.name || "")];
 if ((s.folder || "").trim()) parts.push("folder: " + s.folder.trim());
 return parts.join("\n");
 });
 return head.join("\n") + entries.join("\n---\n");
 }

 // Splits each line on the FIRST colon only, so "name: Invoice: March" is safe.
 function parseMarkdown(text) {
 var lines = String(text || "").split(/\r?\n/);
 var header = state.headerFolder, headerConsumed = false; var bodyLines = [];
 for (var i = 0; i < lines.length; i++) {
 var m = lines[i].match(/^\s*folder_name\s*:\s*(.*)$/i);
 if (m && !headerConsumed) { header = m[1].trim(); headerConsumed = true; continue; }
 bodyLines.push(lines[i]);
 }
 var blocks = bodyLines.join("\n").split(/^\s*---\s*$/m);
 var splits = [];
 blocks.forEach(function (block) {
 var b = block.trim(); if (!b) return;
 var entry = { name: "", start: "", end: "", folder: "", pages: null }; var hasAny = false;
 b.split(/\r?\n/).forEach(function (ln) {
 var idx = ln.indexOf(":"); if (idx === -1) return;
 var key = ln.slice(0, idx).trim().toLowerCase(); var val = ln.slice(idx + 1).trim();
 if (key === "page") {
 hasAny = true;
 // Accept a comma-separated list of pages and ranges: "1-2,6-7,9".
 var setPages = [];
 val.split(",").forEach(function (part) {
 part = part.trim(); if (!part) return;
 var rng = part.match(/^(\d+)\s*-\s*(\d+)$/);
 if (rng) { var a = +rng[1], bb = +rng[2], lo = Math.min(a, bb), hi = Math.max(a, bb); for (var q = lo; q <= hi; q++) setPages.push(q); }
 else if (/^\d+$/.test(part)) setPages.push(+part);
 });
 if (setPages.length) {
 var seen = {}, uniq = [];
 setPages.forEach(function (p) { if (!seen[p]) { seen[p] = true; uniq.push(p); } });
 uniq.sort(function (a, b) { return a - b; });
 entry.pages = uniq; entry.start = String(uniq[0]); entry.end = String(uniq[uniq.length - 1]);
 }
 } else if (key === "name") { hasAny = true; entry.name = val; }
 else if (key === "folder") { hasAny = true; entry.folder = val; }
 });
 if (hasAny) splits.push(entry);
 });
 return { header: header, splits: splits };
 }
 function syncMarkdown() { el("mdArea").value = serializeMarkdown(); }

 // Merge key = assigned folder + cleaned name. Same key unions pages into one file.
 // Two groups resolving to the same final path collide (hard error).
 // Empty cleaned name falls back to "untitled" so we never emit a bare ".pdf".
 function computeModel() {
 var rowInfo = state.splits.map(function (s, i) {
 var pages = parsePages(s);
 return { i: i, s: s, cn: cleanName(s.name) || "untitled", pages: pages,
 blank: !((s.name || "").trim()) && pages.status === "empty" };
 });
 var groups = new Map();
 rowInfo.forEach(function (r) {
 if (r.blank || r.pages.status !== "ok") return;
 var folderIntent = (r.s.folder || "").trim(); var key = folderIntent + "||" + r.cn;
 if (!groups.has(key)) groups.set(key, { cn: r.cn, folderIntent: folderIntent, rows: [], pages: [] });
 var g = groups.get(key); g.rows.push(r.i);
 r.pages.pages.forEach(function (p) { if (!g.pages.includes(p)) g.pages.push(p); });
 r.group = g;
 });
 var pathMap = new Map(); var groupList = Array.from(groups.values());
 groupList.forEach(function (g) {
 g.pages.sort(function (a, b) { return a - b; });
 var dir = "";
 if (state.useFolders) dir = g.folderIntent ? g.folderIntent : (state.unassignedDest === "Unsorted" ? "Unsorted" : "");
 g.dir = dir; g.finalName = g.cn + ".pdf"; g.finalPath = (dir ? dir + "/" : "") + g.finalName;
 if (!pathMap.has(g.finalPath)) pathMap.set(g.finalPath, []);
 pathMap.get(g.finalPath).push(g);
 });
 pathMap.forEach(function (gs) { if (gs.length > 1) gs.forEach(function (g) { g.collision = true; }); });
 var pageUse = {}; groupList.forEach(function (g) { g.pages.forEach(function (p) { pageUse[p] = (pageUse[p] || 0) + 1; }); });
 var used = new Set(); groupList.forEach(function (g) { g.pages.forEach(function (p) { used.add(p); }); });
 var unusedPages = []; for (var p = 1; p <= state.pageCount; p++) if (!used.has(p)) unusedPages.push(p);
 return { rowInfo: rowInfo, groups: groupList, pageUse: pageUse, unusedPages: unusedPages };
 }

 function rowVerdict(r, model) {
 if (r.blank) return { kind: "none" };
 var p = r.pages;
 if (p.status === "invalid") return { kind: "err", text: "Invalid pages", note: "Check the page selection. Every page must be a whole number \u2265 1." };
 if (p.status === "oob") return { kind: "err", text: "Out of range", note: "Selected pages go past the end. PDF has " + state.pageCount + " page" + (state.pageCount === 1 ? "" : "s") + ". Fix before export." };
 if (p.status === "empty") return { kind: "warn", text: "No pages", note: "Named split with no pages assigned. It will be skipped at export." };
 var g = r.group;
 if (g && g.collision) return { kind: "err", text: "Duplicate name", note: "Another split exports to the same path (" + g.finalPath + "). Rename it, or turn folders on to separate them." };
 var merged = g && g.rows.length > 1;
 var overlaps = p.pages.some(function (pg) { return model.pageUse[pg] > 1; });
 var token = compressRuns(p.pages);
 var contiguous = (p.pages.length === (p.end - p.start + 1));
 var label = p.pages.length === 1 ? ("Page " + p.start) : (contiguous ? ("Pages " + p.start + "-" + p.end) : ("Pages " + token));
 if (merged) return { kind: "ok", text: label, note: "Merges with same-named splits into " + g.finalName + " (pages " + g.pages.join(", ") + ")." };
 if (overlaps) return { kind: "warn", text: "Shares pages", note: "Shares page(s) with another split. Kept as a separate file. Allowed by design." };
 return { kind: "ok", text: label };
 }

 PS.serializeMarkdown = serializeMarkdown;
 PS.parseMarkdown = parseMarkdown;
 PS.syncMarkdown = syncMarkdown;
 PS.computeModel = computeModel;
 PS.rowVerdict = rowVerdict;
})();
