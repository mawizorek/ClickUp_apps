/* screens/units.js — the primary working surface: the UNITS grid for the current show.
   Filter by signal + direction, sort any column, tap a row for detail (with related rows + quick-adds),
   trace a signal live, pull reports, back up / restore. */
window.Screens = window.Screens || {};
Screens.units = (function () {
  var esc = UI.esc, or = UI.or, DASH = UI.DASH;
  var st = { sort: { col: "unit_num", dir: "asc" }, filters: { signal: "all", dir: "all" }, q: "" };
  var view = null;

  var SIG_COLORS = { "Analog Audio":"#4ade80","DMX 512":"#60a5fa","Dante":"#22d3ee","sACN":"#a78bfa","SDI":"#f472b6","HDMI":"#c084fc","HDBaseT":"#a78bfa","AC Power":"#fbbf24","Ethernet":"#94a3b8","MIDI":"#fb923c" };
  var DIR_COLORS = { "IN":"#4ade80", "OUT":"#fb7185" };
  var COLS = [
    {k:"unit_num",l:"Unit#",w:78},{k:"_type",l:"Type",w:130},{k:"_sig",l:"Signal",w:110},{k:"_pos",l:"Position",w:150},{k:"direction",l:"Dir",w:48},
    {k:"purpose",l:"Purpose",w:180,flex:true},{k:"channel",l:"Ch/Addr",w:84},{k:"dimmer",l:"Dimmer",w:70},{k:"role",l:"Role",w:72},{k:"notes",l:"Notes",w:160}
  ];
  function cs(c) { return "width:" + c.w + "px;min-width:" + c.w + "px" + (c.flex ? ";flex:1 0 " + c.w + "px" : ""); }
  function normDir(d) { return !d || d === DASH ? DASH : String(d).toLowerCase(); }
  function pill(attr, val, label, on, extra) { return '<button type="button" class="sig-pill' + (on ? " is-on" : "") + (extra ? " " + extra : "") + '" ' + attr + '="' + esc(val) + '">' + esc(label) + '</button>'; }

  function resolved() {
    var sid = UI.showId();
    return SignalDB.where("units", function (u) { return u.show_id === sid; }).map(function (u) {
      var t = SignalDB.get("fixture_types", u.type_id), p = SignalDB.get("positions", u.position_id), s = t ? SignalDB.get("signal_types", t.primary_signal) : null;
      return { u: u, type: t, pos: p, sig: s };
    });
  }
  function sortVal(x, col) {
    if (col === "_type") return (x.type || {}).name; if (col === "_pos") return (x.pos || {}).name; if (col === "_sig") return (x.sig || {}).name;
    if (col === "channel") return x.u.channel || x.u.dmx_addr; return x.u[col];
  }

  function syncPill() {
    var s = Sync.state(), d = Sync.detail();
    var map = { local: ["Local only", "sig-st-local"], nokey: ["Not signed in", "sig-st-warn"], bootstrap: ["Setup needed", "sig-st-warn"], syncing: ["Syncing\u2026", "sig-st-busy"],
      synced: ["Synced", "sig-st-ok"], pending: [d || "Pending", "sig-st-busy"], offline: ["Offline", "sig-st-warn"], error: ["Sync error", "sig-st-bad"] };
    var m = map[s] || [s, ""];
    return '<a class="sig-st ' + m[1] + '" href="#access" title="' + esc(d || m[0]) + '"><i></i>' + esc(m[0]) + '</a>';
  }

  function render(v) {
    view = v || view; if (!view) return;
    var wrapOld = view.querySelector(".sig-table-wrap");
    var keep = wrapOld ? { t: wrapOld.scrollTop, l: wrapOld.scrollLeft } : null;
    var all = resolved();
    var sigList = Object.keys(all.reduce(function (m, x) { if (x.sig) m[x.sig.name] = 1; return m; }, {})).sort();
    var q = st.q.toLowerCase();
    var rows = all.filter(function (x) {
      if (st.filters.signal !== "all" && (!x.sig || x.sig.name !== st.filters.signal)) return false;
      if (st.filters.dir !== "all" && normDir(x.u.direction) !== st.filters.dir) return false;
      if (q && [x.u.unit_num, x.u.purpose, x.u.channel, x.u.notes, x.u.label, (x.type || {}).name, (x.pos || {}).name].join(" ").toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
    var col = st.sort.col, dir = st.sort.dir;
    rows.sort(function (a, b) {
      var av = sortVal(a, col), bv = sortVal(b, col); if (av == null) av = ""; if (bv == null) bv = "";
      if (typeof av === "number" && typeof bv === "number") return dir === "asc" ? av - bv : bv - av;
      var r = String(av).localeCompare(String(bv), undefined, { numeric: true }); return dir === "asc" ? r : -r;
    });

    var shows = SignalDB.getAll("shows").sort(function (a, b) { return String(a.title).localeCompare(String(b.title)); });
    var sid = UI.showId(), show = SignalDB.get("shows", sid);
    var h = '<div class="sig-app">';
    if (Sync.state() === "bootstrap") h += '<div class="sig-banner">This browser has data the server doesn\u2019t. <a href="#access">Finish setup \u2192</a></div>';
    h += '<div class="sig-filters">';
    h += '<div class="sig-group sig-showbar">';
    if (shows.length > 1) h += '<select class="sig-select" id="sigShow" aria-label="Show">' + shows.map(function (s) { return '<option value="' + esc(s.id) + '"' + (s.id === sid ? " selected" : "") + '>' + esc(SCHEMA.T.shows.show(s)) + '</option>'; }).join("") + '</select>';
    else h += '<span class="sig-show">' + esc(show ? SCHEMA.T.shows.show(show) : "No show") + '</span>';
    if (show && show.locked) h += '<span class="sig-lock" title="Locked: admin-only edits">\uD83D\uDD12 Locked</span>';
    h += '<input class="sig-search" id="sigQ" type="search" placeholder="Search units" value="' + esc(st.q) + '" aria-label="Search units">';
    if (show && Sync.can("write", "units")) h += pill("data-act", "new", "+ Unit", false, "sig-act sig-new");
    h += syncPill() + '</div>';
    h += '<div class="sig-group"><span class="sig-label">Signal</span>' + pill("data-sig", "all", "ALL", st.filters.signal === "all");
    sigList.forEach(function (s) { h += pill("data-sig", s, s, st.filters.signal === s); });
    h += '</div><div class="sig-group"><span class="sig-label">Dir</span>';
    [["all","ALL"],["in","IN"],["out","OUT"],[DASH,DASH]].forEach(function (d) { h += pill("data-dir", d[0], d[1], st.filters.dir === d[0]); });
    h += '</div><div class="sig-group"><span class="sig-label">Report</span>';
    [["Input Patch","input-patch"],["Output Patch","output-patch"],["Equipment Pull","equip-pull"],["Channel Hookup","ch-hookup"]].forEach(function (r) { h += pill("data-rpt", r[1], r[0], false, "sig-rpt"); });
    h += '</div><div class="sig-group sig-tools"><span class="sig-count">' + rows.length + '/' + all.length + ' units</span>';
    h += pill("data-act", "json", "\u2913 JSON", false, "sig-act") + pill("data-act", "xls", "\u2913 Excel", false, "sig-act");
    if (Sync.state() === "local") h += pill("data-act", "import", "\u2912 Import", false) + pill("data-act", "reset", "Reset", false, "sig-danger");
    h += '<input type="file" id="sigImport" accept=".json,application/json" hidden></div></div>';

    h += '<div class="sig-table-wrap"><div class="sig-table" role="table"><div class="sig-row sig-hdr" role="row">';
    COLS.forEach(function (c) { var ar = st.sort.col === c.k ? (st.sort.dir === "asc" ? " \u2191" : " \u2193") : "";
      h += '<div class="sig-cell" role="columnheader" style="' + cs(c) + '" data-sort="' + c.k + '">' + c.l + ar + '</div>'; });
    h += '<div class="sig-cell" style="width:48px;min-width:48px"></div></div>';
    rows.forEach(function (x, i) {
      var u = x.u, sn = x.sig ? x.sig.name : "", dv = normDir(u.direction) === DASH ? DASH : normDir(u.direction).toUpperCase();
      var pend = SignalDB.pendingFor("units", u.id);
      var cell = function (k, cls, inner, extra, title) { var c = COLS.filter(function (z) { return z.k === k; })[0];
        return '<div class="sig-cell' + (cls ? " " + cls : "") + '" style="' + cs(c) + (extra ? ";" + extra : "") + '"' + (title ? ' title="' + title + '"' : "") + '>' + inner + '</div>'; };
      h += '<div class="sig-row' + (i % 2 ? " sig-alt" : "") + (pend ? " is-pend" : "") + '" role="row" data-uid="' + esc(u.id) + '" tabindex="0">';
      h += cell("unit_num", "", or(u.unit_num)) + cell("_type", "", or(x.type && x.type.name)) + cell("_sig", "", or(sn), "color:" + (SIG_COLORS[sn] || "#94a3b8"));
      h += cell("_pos", "", or(x.pos && x.pos.name)) + cell("direction", "", dv, "color:" + (DIR_COLORS[dv] || "var(--text-faint)"));
      h += cell("purpose", "", or(u.purpose)) + cell("channel", "sig-ch", or(u.channel || u.dmx_addr)) + cell("dimmer", "sig-dim", or(u.dimmer));
      h += cell("role", "sig-soft", esc(u.role || "")) + cell("notes", "sig-soft", esc(u.notes || ""), "", esc(u.notes || ""));
      h += '<div class="sig-cell sig-tr" style="width:48px;min-width:48px"><button type="button" class="sig-trace-btn" data-trace="' + esc(u.id) + '" title="Signal trace" aria-label="Signal trace">\u27bf</button></div></div>';
    });
    if (!rows.length) h += '<div class="sig-empty">' + (all.length ? "No units match current filters" : (show ? "No units yet." + (Sync.can("write", "units") ? " Tap + Unit to add one." : "") : "No show yet. Create one in Tables \u203a Shows.")) + '</div>';
    h += '</div></div></div>';
    view.innerHTML = h;
    if (keep) { var w = view.querySelector(".sig-table-wrap"); if (w) { w.scrollTop = keep.t; w.scrollLeft = keep.l; } }
    bind();
  }

  function bind() {
    var $ = function (s) { return view.querySelectorAll(s); };
    $(".sig-row[data-uid]").forEach(function (r) { r.addEventListener("click", function (e) { if (e.target.closest(".sig-trace-btn")) return; detail(r.dataset.uid); }); });
    $(".sig-row[data-uid]").forEach(function (r) { r.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); detail(r.dataset.uid); } }); });
    $("[data-sig]").forEach(function (b) { b.addEventListener("click", function () { st.filters.signal = b.dataset.sig; render(); }); });
    $("[data-dir]").forEach(function (b) { b.addEventListener("click", function () { st.filters.dir = b.dataset.dir; render(); }); });
    $("[data-sort]").forEach(function (c) { c.addEventListener("click", function () { var k = c.dataset.sort;
      if (st.sort.col === k) st.sort.dir = st.sort.dir === "asc" ? "desc" : "asc"; else { st.sort.col = k; st.sort.dir = "asc"; } render(); }); });
    $("[data-trace]").forEach(function (b) { b.addEventListener("click", function (e) { e.stopPropagation(); traceOf(b.dataset.trace); }); });
    $("[data-rpt]").forEach(function (b) { b.addEventListener("click", function () { report(b.dataset.rpt); }); });
    $("[data-act]").forEach(function (b) { b.addEventListener("click", function () { act(b.dataset.act); }); });
    var sel = view.querySelector("#sigShow"); if (sel) sel.addEventListener("change", function () { UI.setShow(sel.value); render(); });
    var q = view.querySelector("#sigQ"); if (q) q.addEventListener("input", function () { st.q = q.value; var pos = q.selectionStart; render(); var n = view.querySelector("#sigQ"); n.focus(); try { n.setSelectionRange(pos, pos); } catch (e) {} });
    var file = view.querySelector("#sigImport");
    if (file) file.addEventListener("change", function () {
      var f = file.files && file.files[0]; if (!f) return;
      var rd = new FileReader();
      rd.onload = function () { try { var n = SignalDB.importAll(JSON.parse(rd.result)); UI.toast("Restored " + n + " tables from " + f.name); render(); } catch (err) { UI.toast("Import failed: " + err.message, "bad"); } };
      rd.readAsText(f);
    });
  }

  function act(a) {
    if (a === "new") UI.edit("units", null, { defaults: { direction: DASH }, onSaved: function (s) { render(); if (s) detail(s.id); } });
    else if (a === "json") { SignalDB.downloadJSON(); UI.toast("JSON backup downloaded"); }
    else if (a === "xls") { SignalDB.downloadXLS(); UI.toast("Excel backup downloaded (one sheet per table)"); }
    else if (a === "import") view.querySelector("#sigImport").click();
    else if (a === "reset") { if (!confirm("Wipe this browser's data and reload the Big Love sample? Export a backup first if you've made edits.")) return;
      SignalDB.wipe(); seedDatabase(); render(); UI.toast("Reset to sample data"); }
  }

  // ---------- detail panel (unit + everything hanging off it) ----------
  function rel(t, r, text) { return '<button type="button" class="sig-rel" data-rt="' + t + '" data-rid="' + esc(r.id) + '">' + text + '</button>'; }
  function detail(uid) {
    var u = SignalDB.get("units", uid); if (!u) return;
    var t = SignalDB.get("fixture_types", u.type_id), p = SignalDB.get("positions", u.position_id), s = t ? SignalDB.get("signal_types", t.primary_signal) : null;
    var eps = [u.endpoint_id];
    var cps = SignalDB.where("control_points", function (c) { return c.parent_unit_id === u.id; }).sort(function (a, b) { return String(a.label).localeCompare(String(b.label), undefined, { numeric: true }); });
    cps.forEach(function (c) { eps.push(c.endpoint_id); });
    var conns = SignalDB.where("connections", function (c) { return eps.indexOf(c.source_endpoint) !== -1 || eps.indexOf(c.dest_endpoint) !== -1; });
    var asg = SignalDB.where("assignments", function (a) { return eps.indexOf(a.source_endpoint) !== -1 || eps.indexOf(a.dest_endpoint) !== -1; });
    var nis = SignalDB.where("network_interfaces", function (n) { return n.unit_id === u.id; });
    var ifs = t ? SignalDB.where("type_interfaces", function (i) { return i.type_id === t.id; }) : [];
    var deptVal = u.dept || (t && t.dept) || (s && s.dept);
    var b = "";
    [["Type", t && t.name], ["Dept", deptVal], ["Signal", s && s.name], ["Position", p && p.name], ["Direction", u.direction], ["Purpose", u.purpose], ["Channel", u.channel || u.dmx_addr],
     ["Dimmer", u.dimmer], ["Role", u.role], ["Asset tag", u.asset_tag], ["Label", u.label], ["Notes", u.notes]].forEach(function (f) {
      b += '<div class="sig-field"><span class="sig-field-lbl">' + f[0] + '</span><span class="sig-field-val">' + or(f[1]) + '</span></div>'; });
    if (ifs.length) {
      b += '<h3 class="sig-section-hdr">Expected ports</h3>';
      ifs.forEach(function (i) {
        var sigN = (SignalDB.get("signal_types", i.signal_type) || {}).name || "";
        var hit = conns.some(function (c) { return c.signal_type === i.signal_type && (c.dest_endpoint === u.endpoint_id || c.source_endpoint === u.endpoint_id); });
        b += '<div class="sig-cp"><span class="' + (hit ? "sig-good" : (i.required ? "sig-bad" : "sig-muted")) + '">' + (hit ? "\u2713" : (i.required ? "\u2717" : "\u25cb")) + '</span> ' + esc(i.label) + ' <span class="sig-muted">' + esc(sigN) + (i.required && !hit ? " \u00b7 required, unpatched" : "") + '</span></div>';
      });
    }
    var sec = function (title, t2, list, fmt, defaults) {
      var can = Sync.can("write", t2);
      b += '<h3 class="sig-section-hdr">' + title + (list.length ? " (" + list.length + ")" : "") + (can ? ' <button type="button" class="sig-add" data-add="' + t2 + '" data-def="' + esc(JSON.stringify(defaults)) + '">+ Add</button>' : "") + '</h3>';
      list.forEach(function (r) { b += rel(t2, r, fmt(r)); });
    };
    sec("Control points", "control_points", cps, function (c) { return '<span class="sig-muted">' + esc(c.cp_type || "") + '</span> ' + esc(c.label) + (c.channel_num ? ' <span class="sig-ch">ch' + esc(c.channel_num) + '</span>' : ""); }, { parent_unit_id: u.id });
    sec("Network interfaces", "network_interfaces", nis, function (n) { return '<span class="sig-ch">' + or(n.ip) + '</span> <span class="sig-soft">' + esc(n.hostname || n.port_label || "") + '</span>'; }, { unit_id: u.id });
    sec("Connections", "connections", conns, function (c) { return esc(UI.epLabel(c.source_endpoint)) + ' <span class="sig-ch">\u2192</span> ' + esc(UI.epLabel(c.dest_endpoint)) + (c.connection_type ? ' <span class="sig-soft">' + esc(c.connection_type) + '</span>' : ""); }, { source_endpoint: u.endpoint_id });
    sec("Assignments", "assignments", asg, function (a) { return '<span class="sig-good">' + esc(a.level || "") + '</span> ' + esc(UI.epLabel(a.source_endpoint)) + ' \u2192 ' + esc(a.dest_endpoint ? UI.epLabel(a.dest_endpoint) : (a.group_name || "group")) + (a.pre_post ? ' <span class="sig-soft">("' + esc(a.pre_post) + ')</span>' : ""); }, { source_endpoint: u.endpoint_id });
    b += '<div class="sig-form-acts">' + (Sync.can("write", "units", u) ? '<button type="button" class="sig-btn sig-btn-pri" data-edit>Edit unit</button>' : "") + '<button type="button" class="sig-btn" data-tr>\u27bf Trace</button></div>';
    var panel = UI.panel("Unit #" + (u.unit_num == null ? "?" : u.unit_num) + (u.purpose ? " \u00b7 " + u.purpose : ""), b);
    var back = function () { render(); detail(uid); };
    var ed = panel.querySelector("[data-edit]"); if (ed) ed.addEventListener("click", function () { UI.edit("units", SignalDB.get("units", uid), { onSaved: function (sv) { render(); if (sv) detail(uid); }, onClose: back }); });
    panel.querySelector("[data-tr]").addEventListener("click", function () { traceOf(uid); });
    panel.querySelectorAll("[data-rt]").forEach(function (el) { el.addEventListener("click", function () {
      UI.edit(el.dataset.rt, SignalDB.get(el.dataset.rt, el.dataset.rid), { onSaved: back, onClose: back }); }); });
    panel.querySelectorAll("[data-add]").forEach(function (el) { el.addEventListener("click", function () {
      UI.edit(el.dataset.add, null, { defaults: JSON.parse(el.dataset.def), onSaved: back, onClose: back }); }); });
  }

  function traceOf(uid) {
    var u = SignalDB.get("units", uid); if (!u) return;
    var t = SignalDB.get("fixture_types", u.type_id);
    var steps = UI.trace(u);
    var b = '<div class="sig-trace-info">' + esc(t ? t.name : "") + ' \u00b7 ' + esc(u.purpose || "") + '</div><div class="sig-trace-box">';
    if (!steps.length) b += '<div class="sig-muted">No downstream connections documented for this unit yet.</div>';
    steps.forEach(function (s) {
      var a = s.kind === "assignment";
      b += '<div class="sig-trace-step" style="padding-left:' + (s.depth * 18) + 'px"><span class="' + (a ? "sig-good" : "sig-ch") + '">' + (a ? "\u251c\u2192" : s.depth > 0 ? "\u2514\u2500" : "\u2500\u2500") + '</span> ' +
        '<b>' + esc(s.label) + '</b>' + (s.info ? ' <span class="sig-soft">' + esc(s.info) + '</span>' : "") + '</div>';
    });
    b += '</div><div class="sig-form-acts"><button type="button" class="sig-btn" data-back>\u2190 Unit detail</button></div>';
    var p = UI.panel("Trace: Unit #" + u.unit_num, b);
    p.querySelector("[data-back]").addEventListener("click", function () { detail(uid); });
  }

  function report(type) {
    var all = resolved().map(function (x) { return x; }), items, b = "";
    if (type === "input-patch") items = all.filter(function (x) { return normDir(x.u.direction) === "in"; });
    else if (type === "output-patch") items = all.filter(function (x) { return normDir(x.u.direction) === "out"; });
    else if (type === "ch-hookup") items = all.filter(function (x) { return x.u.dmx_addr; });
    else items = all;
    if (type === "equip-pull") {
      var counts = {}; items.forEach(function (x) { var n = (x.type || {}).name || "?"; counts[n] = (counts[n] || 0) + 1; });
      Object.keys(counts).sort().forEach(function (k) { b += '<div class="sig-field"><span style="flex:1">' + esc(k) + '</span><span class="sig-ch">' + counts[k] + '\u00d7</span></div>'; });
      b += '<div class="sig-field sig-total"><span style="flex:1">Total</span><span class="sig-ch">' + items.length + '</span></div>';
    } else {
      items.sort(function (a, z) { return String(a.u.channel || a.u.dmx_addr || a.u.unit_num).localeCompare(String(z.u.channel || z.u.dmx_addr || z.u.unit_num), undefined, { numeric: true }); });
      if (!items.length) b += '<div class="sig-muted">Nothing in this report yet.</div>';
      items.forEach(function (x) { b += '<div class="sig-field"><span class="sig-muted">#' + esc(x.u.unit_num) + '</span><span style="flex:1">' + esc(x.type ? x.type.name : "") + " \u00b7 " + esc(x.u.purpose || "") + '</span>' +
        (x.u.channel || x.u.dmx_addr ? '<span class="sig-ch">' + esc(x.u.channel || x.u.dmx_addr) + '</span>' : "") + '</div>'; });
    }
    UI.panel(type.replace(/-/g, " ").toUpperCase(), b);
  }

  return { render: render, refresh: function () { if (view && document.body.contains(view)) render(); } };
})();
