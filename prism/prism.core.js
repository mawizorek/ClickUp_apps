/* Prism — core. State, helpers, lens registry, app chrome. Load LAST. */
var S = { raw: "", fname: "", type: null, data: null, analysis: null, view: null, activeSheet: 0, delim: ",", table: null };
function $(s) { return document.querySelector(s); }
function esc(s) { return String(s === null || s === undefined ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function typeOf(v) { if (v === null) return "null"; if (Array.isArray(v)) return "array"; return typeof v; }
function toast(m) { $("#toastMsg").textContent = m; var t = $("#toast"); t.classList.add("on"); setTimeout(function () { t.classList.remove("on"); }, 1900); }
function download(name, text, mime) { var b = new Blob([text], { type: mime }), u = URL.createObjectURL(b), a = document.createElement("a"); a.href = u; a.download = name; a.click(); setTimeout(function () { URL.revokeObjectURL(u); }, 1000); }

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
var SAMPLE_MD = "# Prism \u2014 Concept Notes\n\nOne shell, many lenses. Drop a file, get the right view.\n\n## Why it exists\n\nJSON is a **tree**. A spreadsheet is a **grid**. Prism bridges the two so you can *actually read* a backup file.\n\n## The lenses\n\n1. **Table** \u2014 TSV / CSV / flat JSON, editable, with colour swatches\n2. **JSON** \u2014 table, tree, and raw views + CSV / Excel export\n3. **Markdown** \u2014 clean render + raw source\n\n> The magic is the flatten-strategy choice: same data, two truths.\n\n### Roadmap\n\n| Lens | Status |\n| --- | --- |\n| Table | live |\n| JSON | live |\n| Markdown | live |\n| YAML | planned |\n\nAdding a lens stays trivial: push a detector + a render module onto the registry.";
var SAMPLE_TSV = "slug\tname\tmode\tbg\tsurface-1\tborder\ttext\taccent\taccent-deep\tgood\twarn\tbad\tinfo\tdocs\n" +
  "maw-dark-utility\tMAW Dark Utility\tdark\t#2a2d33\t#333740\t#656d7c\t#eef0f3\t#46b8cf\t#2e8ba0\t#35c48a\t#d8ab4f\t#d64f3f\t#56a8dd\thttps://mawizorek.github.io/ClickUp_apps/\n" +
  "paper-mono\tPaper Mono\tlight\t#fafafa\t#fefefe\t#cfcfcf\t#292929\t#333333\t#1f1f1f\t#2e9268\t#a67c2e\t#bf4436\t#3a7fb5\t\n" +
  "papyrus\tPapyrus\tlight\t#f0e6d2\t#f7efe0\t#c0a982\t#4a3826\t#97663a\t#6f4a28\t#2f8f5f\t#a67d33\t#b0503a\t#3d7098\t\n" +
  "mclaren\tMcLaren\tdark\t#292420\t#231f1b\t#5f5850\t#f2f1ec\t#f5842f\t#c05e18\t#35c48a\t#d8ab4f\t#d64f3f\t#63bce0\t\n" +
  "ferrari\tFerrari\tdark\t#2b201e\t#241a18\t#64504a\t#f6efee\t#d83f38\t#a82a24\t#35c48a\t#e0bd4a\t#d84334\t#63bce0\t\n" +
  "mercedes\tMercedes\tdark\t#1e2827\t#192221\t#506361\t#eff6f5\t#4fc8c0\t#2e9a93\t#38c48c\t#d8ab4f\t#d64f3f\t#6fb4cc\t\n" +
  "alpine\tAlpine\tdark\t#21262f\t#1b2029\t#5a6273\t#eff1f5\t#ff3d9e\t#c9237b\t#35c48a\t#d8ab4f\t#d64f3f\t#56a0dd\t\n" +
  "paddock\tPaddock Violet\tdark\t#0b0d13\t#12151b\t#2b2e35\t#edeef3\t#f14442\t#b71920\t#49ca81\t#e7b643\t#e6424c\t#4baeed\t";

/* ---------------- LENS REGISTRY ----------------
   The README and the ClickUp task both claimed a "lens-registry pattern: add a
   detector + a render module, shell unchanged." No registry existed — routing
   was a hardcoded `S.type === "json" ? JSONLens : MDLens` ternary in two
   places, so a third lens could not be added without editing the shell. This
   is that registry, built for real.

   A lens is { id, label, accent, priority, detect, load, defaultView, render }
   and optionally onSetting. Lower priority wins. Lens files push themselves
   onto window.PrismLenses before this file runs; the two original lenses are
   adapted here so their own modules stay untouched. */
var LENS = {}, LENS_ORDER = [];
function registerLens(d) { LENS[d.id] = d; LENS_ORDER.push(d); }

(function buildRegistry() {
  (window.PrismLenses || []).forEach(registerLens);

  if (window.JSONLens) registerLens({
    id: "json", label: "JSON", accent: "var(--json)", priority: 20,
    detect: function (name, text) {
      if (/\.json$/i.test(name)) return true;
      var t = text.trim();
      if (t.charAt(0) === "{" || t.charAt(0) === "[") { try { JSON.parse(t); return true; } catch (e) {} }
      return false;
    },
    load: function () { if (!JSONLens.load()) return false; S.activeSheet = JSONLens.defaultSheet(); return true; },
    defaultView: "table",
    render: function (v) { JSONLens.render(v); }
  });

  if (window.MDLens) registerLens({
    id: "md", label: "Markdown", accent: "var(--md)", priority: 99,
    detect: function () { return true; },
    load: function () { MDLens.load(); return true; },
    defaultView: "rendered",
    render: function (v) { MDLens.render(v); }
  });

  LENS_ORDER.sort(function (a, b) { return (a.priority || 50) - (b.priority || 50); });
})();

function detectType(name, text) {
  for (var i = 0; i < LENS_ORDER.length; i++) {
    try { if (LENS_ORDER[i].detect(name, text)) return LENS_ORDER[i].id; } catch (e) {}
  }
  return LENS_ORDER.length ? LENS_ORDER[LENS_ORDER.length - 1].id : null;
}

function loadContent(name, text) {
  S.raw = text; S.fname = name; S.activeSheet = 0;
  var type = detectType(name, text); S.type = type;
  var L = LENS[type];
  if (!L) { toast("No lens can open that file"); return; }
  $("#stage").style.display = "none"; $("#viewer").classList.add("on"); $("#resetBtn").classList.add("on");
  $("#fname").textContent = name;
  var pill = $("#lensPill"); pill.classList.add("on");
  $("#lensLabel").textContent = L.label;
  document.documentElement.style.setProperty("--accent", L.accent);
  pill.querySelector(".dot").style.background = L.accent;
  if (L.load()) setView(L.defaultView);
}
function setView(v) {
  S.view = v;
  document.querySelectorAll("#viewSeg button").forEach(function (b) { b.classList.toggle("active", b.dataset.v === v); });
  LENS[S.type].render(v);
}
function reset() {
  $("#viewer").classList.remove("on"); $("#stage").style.display = "flex";
  $("#lensPill").classList.remove("on"); $("#resetBtn").classList.remove("on");
  document.documentElement.style.setProperty("--accent", "var(--json)");
  document.body.classList.remove("hl-diff");
  S.data = null; S.raw = ""; S.type = null; S.table = null;
  var pw = $("#pasteWrap"); if (pw) { pw.classList.remove("on"); $("#pasteBox").value = ""; }
}
function readFile(f) {
  if (!f) return;
  if (f.size > 12 * 1024 * 1024) { toast("That file is over 12MB \u2014 too big to edit in the browser"); return; }
  var r = new FileReader();
  r.onerror = function () { toast("Could not read that file"); };
  r.onload = function () { loadContent(f.name, String(r.result)); };
  r.readAsText(f);
}

(function init() {
  $("#pickBtn").onclick = function () { $("#fileInput").click(); };
  $("#fileInput").onchange = function (e) { readFile(e.target.files[0]); e.target.value = ""; };
  $("#resetBtn").onclick = reset;
  $("#sampleJson").onclick = function () { loadContent("apps-export.json", JSON.stringify(SAMPLE_JSON, null, 2)); };
  $("#sampleMd").onclick = function () { loadContent("concept-notes.md", SAMPLE_MD); };
  var st = $("#sampleTsv"); if (st) st.onclick = function () { loadContent("colors.tsv", SAMPLE_TSV); };

  /* Paste import: a spreadsheet range on the clipboard is already TSV, so the
     fastest path for a two-cell fix skips the filesystem entirely. */
  var pasteBtn = $("#pasteBtn");
  if (pasteBtn) {
    pasteBtn.onclick = function () {
      var w = $("#pasteWrap");
      w.classList.toggle("on");
      if (w.classList.contains("on")) $("#pasteBox").focus();
    };
    $("#pasteLoad").onclick = function () {
      var v = $("#pasteBox").value;
      if (!v.trim()) { toast("Nothing pasted yet"); return; }
      loadContent(v.trim().charAt(0) === "[" ? "pasted.json" : "pasted.tsv", v);
    };
  }

  var drop = $("#drop");
  ["dragenter", "dragover"].forEach(function (ev) { document.addEventListener(ev, function (e) { e.preventDefault(); if ($("#stage").style.display !== "none") drop.classList.add("hot"); }); });
  ["dragleave", "drop"].forEach(function (ev) { document.addEventListener(ev, function (e) { e.preventDefault(); if (ev === "dragleave" && e.relatedTarget) return; drop.classList.remove("hot"); }); });
  document.addEventListener("drop", function (e) { e.preventDefault(); if (e.dataTransfer && e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]); });

  var drawer = $("#drawer"), scrim = $("#scrim"), gear = $("#gearBtn");
  function openD() { drawer.classList.add("on"); scrim.classList.add("on"); gear.setAttribute("aria-expanded", "true"); drawer.setAttribute("aria-hidden", "false"); }
  function closeD() { drawer.classList.remove("on"); scrim.classList.remove("on"); gear.setAttribute("aria-expanded", "false"); drawer.setAttribute("aria-hidden", "true"); }
  gear.onclick = openD; $("#closeDrawer").onclick = closeD; scrim.onclick = closeD;
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeD(); });

  function setTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("prism-theme", t); } catch (e) {}
    document.querySelectorAll("#themeSeg button").forEach(function (b) { b.classList.toggle("active", b.dataset.t === t); });
  }
  document.querySelectorAll("#themeSeg button").forEach(function (b) { b.onclick = function () { setTheme(b.dataset.t); }; });
  try { var saved = localStorage.getItem("prism-theme"); if (saved) setTheme(saved); } catch (e) {}

  document.querySelectorAll("#delimSeg button").forEach(function (b) { b.onclick = function () { S.delim = b.dataset.d; document.querySelectorAll("#delimSeg button").forEach(function (x) { x.classList.toggle("active", x === b); }); }; });

  /* Settings that a lens may care about re-render through the lens, not the shell. */
  var tint = $("#rowTint");
  if (tint) tint.onchange = function () {
    var L = S.type && LENS[S.type];
    if (L && L.onSetting) L.onSetting();
  };

  document.addEventListener("click", function (e) {
    var b = e.target.closest("#viewSeg button");
    if (b) setView(b.dataset.v);
  });
})();
