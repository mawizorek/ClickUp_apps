/* PDF Splitter & Renamer v2 - state + shared helpers.
 Boot order: this loads first; everything hangs off window.PS. */
window.PS = window.PS || {};

(function () {
 if (window.pdfjsLib) {
 pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
 }

 // Generic folder palette (replaces the old garage-paperwork Registrations/Insurance/Titles/Misc presets).
 var FOLDER_PALETTE = [
 "var(--f0)", "var(--f1)", "var(--f2)", "var(--f3)", "var(--f4)",
 "var(--f5)", "var(--f6)", "var(--f7)", "var(--f8)"
 ];
 var UNSORT = "var(--f-unsort)";
 var THUMB_CAP = 50;

 var state = {
 pdfBytes: null, pdfjsDoc: null, pageCount: 0, fileName: "", fileSize: 0,
 headerFolder: "", headerTouched: false,
 splits: [], folders: [], useFolders: true, unassignedDest: "root",
 settings: { includeUnused: false, allowOverlap: true, genReport: true },
 thumbsEnabled: true, gridAnchor: null, lastBlobUrl: null
 };

 var el = function (id) { return document.getElementById(id); };

 // Filename cleaning. ORDER FIX vs v1: unsafe->_ BEFORE collapsing repeats, so
 // "M3 . Reg" -> "m3_reg" (v1 produced "m3___reg"). Hyphens survive (not in UNSAFE).
 var UNSAFE = /[.\/\\:*?"<>|@#$%&!^~]/g;
 function cleanName(raw) {
 var s = String(raw == null ? "" : raw).trim().toLowerCase();
 s = s.replace(/\s+/g, "_")
 .replace(UNSAFE, "_")
 .replace(/_+/g, "_")
 .replace(/^_+|_+$/g, "");
 s = s.slice(0, 60).replace(/^_+|_+$/g, "");
 return s;
 }
 function stripExt(name) { return String(name || "").replace(/\.[^.]+$/, ""); }

 function folderColor(name) {
 var f = state.folders.find(function (x) { return x.name === name; });
 return f ? f.color : UNSORT;
 }
 function ensureFolder(name) {
 var n = (name || "").trim(); if (!n) return;
 if (!state.folders.some(function (f) { return f.name === n; })) {
 state.folders.push({ name: n, color: FOLDER_PALETTE[state.folders.length % FOLDER_PALETTE.length] });
 }
 }

 // Compress a page array into a compact run token: [1,2,6,7] -> "1-2,6-7", [37] -> "37".
 function compressRuns(pages) {
 if (!pages || !pages.length) return "";
 var sorted = pages.slice().sort(function (a, b) { return a - b; });
 var runs = [], start = sorted[0], prev = sorted[0];
 for (var i = 1; i < sorted.length; i++) {
 if (sorted[i] === prev + 1) { prev = sorted[i]; continue; }
 runs.push(start === prev ? String(start) : (start + "-" + prev));
 start = prev = sorted[i];
 }
 runs.push(start === prev ? String(start) : (start + "-" + prev));
 return runs.join(",");
 }

 // Page resolution. An explicit page SET (s.pages array) takes precedence and
 // supports non-contiguous selections (1-2,6-7). Falls back to the contiguous
 // start/end pair when no set is present, so manual Start/End editing still works.
 function parsePages(s) {
 if (Array.isArray(s.pages) && s.pages.length) {
 var seen = {}, uniq = [], bad = false;
 s.pages.forEach(function (p) {
 var n = Number(p);
 if (!Number.isInteger(n) || n < 1) { bad = true; return; }
 if (!seen[n]) { seen[n] = true; uniq.push(n); }
 });
 if (bad) return { pages: [], status: "invalid", start: null, end: null };
 if (!uniq.length) return { pages: [], status: "empty", start: null, end: null };
 uniq.sort(function (a, b) { return a - b; });
 var oobSet = state.pageCount > 0 && uniq.some(function (p) { return p > state.pageCount; });
 return { pages: uniq, status: oobSet ? "oob" : "ok", start: uniq[0], end: uniq[uniq.length - 1] };
 }
 var sr = (s.start == null ? "" : String(s.start)).trim();
 var er = (s.end == null ? "" : String(s.end)).trim();
 if (!sr && !er) return { pages: [], status: "empty", start: null, end: null };
 var start = sr ? Number(sr) : null, end = er ? Number(er) : null;
 if (start === null && end !== null) start = end;
 if (end === null && start !== null) end = start;
 if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < 1 || start > end) {
 return { pages: [], status: "invalid", start: start, end: end };
 }
 var pages = []; for (var p = start; p <= end; p++) pages.push(p);
 var oob = state.pageCount > 0 && pages.some(function (p) { return p > state.pageCount; });
 return { pages: pages, status: oob ? "oob" : "ok", start: start, end: end };
 }
 function pageToken(s) {
 var p = parsePages(s); if (p.status === "empty") return "";
 return compressRuns(p.pages);
 }

 function fmtSize(b) {
 if (b > 1048576) return (b / 1048576).toFixed(1) + " MB";
 if (b > 1024) return (b / 1024).toFixed(0) + " KB";
 return b + " B";
 }

 PS.state = state;
 PS.el = el;
 PS.THUMB_CAP = THUMB_CAP;
 PS.cleanName = cleanName;
 PS.stripExt = stripExt;
 PS.folderColor = folderColor;
 PS.ensureFolder = ensureFolder;
 PS.compressRuns = compressRuns;
 PS.parsePages = parsePages;
 PS.pageToken = pageToken;
 PS.fmtSize = fmtSize;
})();
