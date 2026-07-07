/* Prism — core. State, helpers, lens routing, app chrome. Load LAST. */
var S = { raw: "", fname: "", type: null, data: null, analysis: null, view: null, activeSheet: 0, delim: "," };
function $(s) { return document.querySelector(s); }
function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
function typeOf(v) { if (v === null) return "null"; if (Array.isArray(v)) return "array"; return typeof v; }
function toast(m) { $("#toastMsg").textContent = m; var t = $("#toast"); t.classList.add("on"); setTimeout(function () { t.classList.remove("on"); }, 1900); }
function download(name, text, mime) { var b = new Blob([text], { type: mime }), u = URL.createObjectURL(b), a = document.createElement("a"); a.href = u; a.download = name; a.click(); URL.revokeObjectURL(u); }

var IC = {
  warn: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M12 9v4m0 4h.01M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="12" cy="12" r="9" stroke="currentColor"/><path d="M12 11v5m0-8h.01" stroke="currentColor" stroke-linecap="round"/></svg>',
  ok: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  pivot: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M3 9h18M9 3v18" stroke="currentColor" stroke-linecap="round"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.7"><rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor"/><path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor"/></svg>',
  csv: '<svg viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.7"><path d="M14 3v4a1 1 0 0 0 1 1h4M8 13h2m-2 4h4" stroke="currentColor"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" stroke="currentColor" stroke-linejoin="round"/></svg>',
  xls: '<svg viewBox="0 0 24 24" fill="none" stroke="oklch(0.2 0.02 265)" stroke-width="1.8"><path d="M14 3v4a1 1 0 0 0 1 1h4" stroke="currentColor"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" stroke="currentColor" stroke-linejoin="round"/><path d="m9.5 12 5 6m0-6-5 6" stroke="currentColor" stroke-linecap="round"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="oklch(0.2 0.02 265)" stroke-width="1.8"><path d="m8 8-4 4 4 4m8-8 4 4-4 4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  err: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6"><circle cx="12" cy="12" r="9" stroke="currentColor"/><path d="M12 8v5m0 3h.01" stroke="currentColor" stroke-linecap="round"/></svg>'
};

var SAMPLE_JSON = {
  list: "APPS", exportedAt: "2026-07-07T15:40:00Z",
  tasks: [
    { id: "86aja5kp3", name: "Markdown Viewer", status: "in progress", priority: "normal", points: 5, assignees: [{ name: "Michael Wizorek", role: "owner" }], tags: ["app", "tool"] },
    { id: "86aja5kq7", name: "File Chunker", status: "complete", priority: "high", points: 8, assignees: [{ name: "Michael Wizorek", role: "owner" }], tags: ["app"] },
    { id: "86aja5kr2", name: "F1 Racetracks", status: "complete", priority: 2, points: "3", assignees: [], tags: ["app", "f1"] },
    { id: "86aja5ks9", name: "Budget Code Mapper", status: "design", priority: null, points: 13, tags: ["app", "internal"] }
  ],
  meta: { total: 4, workspace: "MAW", owner: { name: "Michael", id: 48150956 } }
};
var SAMPLE_MD = "# Prism \u2014 Concept Notes\n\nOne shell, two lenses. Drop a file, get the right view.\n\n## Why it exists\n\nJSON is a **tree**. A spreadsheet is a **grid**. Prism bridges the two so you can *actually read* a backup file.\n\n## The lenses\n\n1. **JSON** \u2014 table, tree, and raw views + CSV / Excel export\n2. **Markdown** \u2014 clean render + raw source\n\n> The magic is the flatten-strategy choice: same data, two truths.\n\n### Roadmap\n\n| Lens | Status |\n| --- | --- |\n| JSON | live |\n| Markdown | live |\n| YAML | planned |\n\nAdding a lens stays trivial: register a detector + a render module.";

function detectType(name, text) {
  if (/\.(md|markdown)$/i.test(name)) return "md";
  if (/\.json$/i.test(name)) return "json";
  var t = text.trim();
  if (t.charAt(0) === "{" || t.charAt(0) === "[") { try { JSON.parse(t); return "json"; } catch (e) {} }
  return "md";
}
function loadContent(name, text) {
  S.raw = text; S.fname = name; S.activeSheet = 0;
  var type = detectType(name, text); S.type = type;
  $("#stage").style.display = "none"; $("#viewer").classList.add("on"); $("#resetBtn").classList.add("on");
  $("#fname").textContent = name;
  var pill = $("#lensPill"); pill.classList.add("on");
  $("#lensLabel").textContent = type === "json" ? "JSON" : "Markdown";
  document.documentElement.style.setProperty("--accent", type === "json" ? "var(--json)" : "var(--md)");
  pill.querySelector(".dot").style.background = type === "json" ? "var(--json)" : "var(--md)";
  if (type === "json") { if (JSONLens.load()) { S.activeSheet = JSONLens.defaultSheet(); setView("table"); } }
  else { MDLens.load(); setView("rendered"); }
}
function setView(v) {
  S.view = v;
  document.querySelectorAll("#viewSeg button").forEach(function (b) { b.classList.toggle("active", b.dataset.v === v); });
  (S.type === "json" ? JSONLens : MDLens).render(v);
}
function reset() {
  $("#viewer").classList.remove("on"); $("#stage").style.display = "flex";
  $("#lensPill").classList.remove("on"); $("#resetBtn").classList.remove("on");
  document.documentElement.style.setProperty("--accent", "var(--json)");
  S.data = null; S.raw = ""; S.type = null;
}
function readFile(f) { if (!f) return; var r = new FileReader(); r.onload = function () { loadContent(f.name, r.result); }; r.readAsText(f); }

(function init() {
  $("#pickBtn").onclick = function () { $("#fileInput").click(); };
  $("#fileInput").onchange = function (e) { readFile(e.target.files[0]); };
  $("#resetBtn").onclick = reset;
  $("#sampleJson").onclick = function () { loadContent("apps-export.json", JSON.stringify(SAMPLE_JSON, null, 2)); };
  $("#sampleMd").onclick = function () { loadContent("concept-notes.md", SAMPLE_MD); };

  var drop = $("#drop");
  ["dragenter", "dragover"].forEach(function (ev) { document.addEventListener(ev, function (e) { e.preventDefault(); if ($("#stage").style.display !== "none") drop.classList.add("hot"); }); });
  ["dragleave", "drop"].forEach(function (ev) { document.addEventListener(ev, function (e) { e.preventDefault(); if (ev === "dragleave" && e.relatedTarget) return; drop.classList.remove("hot"); }); });
  document.addEventListener("drop", function (e) { e.preventDefault(); if (e.dataTransfer && e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]); });

  var drawer = $("#drawer"), scrim = $("#scrim"), gear = $("#gearBtn");
  function openD() { drawer.classList.add("on"); scrim.classList.add("on"); gear.setAttribute("aria-expanded", "true"); drawer.setAttribute("aria-hidden", "false"); }
  function closeD() { drawer.classList.remove("on"); scrim.classList.remove("on"); gear.setAttribute("aria-expanded", "false"); drawer.setAttribute("aria-hidden", "true"); }
  gear.onclick = openD; $("#closeDrawer").onclick = closeD; scrim.onclick = closeD;
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeD(); });

  function setTheme(t) { document.documentElement.setAttribute("data-theme", t); try { localStorage.setItem("prism-theme", t); } catch (e) {} document.querySelectorAll("#themeSeg button").forEach(function (b) { b.classList.toggle("active", b.dataset.t === t); }); }
  document.querySelectorAll("#themeSeg button").forEach(function (b) { b.onclick = function () { setTheme(b.dataset.t); }; });
  try { var saved = localStorage.getItem("prism-theme"); if (saved) setTheme(saved); } catch (e) {}
  document.querySelectorAll("#delimSeg button").forEach(function (b) { b.onclick = function () { S.delim = b.dataset.d; document.querySelectorAll("#delimSeg button").forEach(function (x) { x.classList.toggle("active", x === b); }); }; });
})();
