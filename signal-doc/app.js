/* app.js — Signal Documentation System main application logic.
   Vanilla JS, no build step. Renders into the template-app chrome shell.
   Primary surface: sortable/filterable UNITS table with detail + trace + report side panels.
   Backups: JSON + Excel export, JSON import, reset-to-seed. */
var SigApp = (function () {
  var db = SignalDB;
  var state = { show: null, units: [], filtered: [], selected: null, panel: null, sort: { col: "unit_num", dir: "asc" }, filters: { signal: "all", dir: "all" } };
  var DASH = "\u2014";

  function esc(v) { return v === null || v === undefined ? "" : String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function or(v) { return v === null || v === undefined || v === "" ? DASH : esc(v); }

  function resolve(u) {
    u._type = db.get("fixture_types", u.type_id);
    u._pos = u.position_id ? db.get("positions", u.position_id) : null;
    u._sig = u._type ? db.get("signal_types", u._type.primary_signal) : null;
    return u;
  }

  function loadUnits() {
    if (!state.show) { state.units = []; applyFilters(); return; }
    state.units = db.getAll("units").filter(function (u) { return u.show_id === state.show.show_id; }).map(resolve);
    applyFilters();
  }

  function normDir(d) { return !d || d === DASH ? DASH : String(d).toLowerCase(); }

  function applyFilters() {
    state.filtered = state.units.filter(function (u) {
      if (state.filters.signal !== "all" && (!u._sig || u._sig.name !== state.filters.signal)) return false;
      if (state.filters.dir !== "all" && normDir(u.direction) !== state.filters.dir) return false;
      return true;
    });
    sortUnits();
  }

  function sortVal(u, col) {
    if (col === "_type") return (u._type || {}).name;
    if (col === "_pos") return (u._pos || {}).name;
    if (col === "_sig") return (u._sig || {}).name;
    if (col === "channel") return u.channel || u.dmx_addr;
    return u[col];
  }
  function sortUnits() {
    var col = state.sort.col, dir = state.sort.dir;
    state.filtered.sort(function (a, b) {
      var av = sortVal(a, col), bv = sortVal(b, col);
      if (av == null) av = ""; if (bv == null) bv = "";
      if (typeof av === "number" && typeof bv === "number") return dir === "asc" ? av - bv : bv - av;
      var r = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return dir === "asc" ? r : -r;
    });
    renderTable();
  }

  var SIG_COLORS = {
    "Analog Audio":"#4ade80","DMX 512":"#60a5fa","Dante":"#22d3ee","sACN":"#a78bfa",
    "SDI":"#f472b6","HDMI":"#c084fc","HDBaseT":"#a78bfa","AC Power":"#fbbf24",
    "Ethernet":"#94a3b8","MIDI":"#fb923c"
  };
  var DIR_COLORS = { "IN":"#4ade80", "OUT":"#fb7185" };

  var COLS = [
    {k:"unit_num",l:"Unit#",w:78},{k:"_type",l:"Type",w:130},{k:"_sig",l:"Signal",w:110},
    {k:"_pos",l:"Position",w:150},{k:"direction",l:"Dir",w:48},{k:"purpose",l:"Purpose",w:180,flex:true},
    {k:"channel",l:"Ch/Addr",w:84},{k:"dimmer",l:"Dimmer",w:70},{k:"role",l:"Role",w:72},{k:"notes",l:"Notes",w:160}
  ];
  function cellStyle(c) { return 'width:' + c.w + 'px;min-width:' + c.w + 'px' + (c.flex ? ';flex:1 0 ' + c.w + 'px' : ''); }

  function pill(attr, val, label, on, extra) {
    return '<button type="button" class="sig-pill' + (on ? " is-on" : "") + (extra ? " " + extra : "") + '" ' + attr + '="' + esc(val) + '">' + esc(label) + '</button>';
  }

  function renderTable() {
    var view = document.getElementById("view");
    var oldWrap = view.querySelector(".sig-table-wrap");
    var keep = oldWrap ? { t: oldWrap.scrollTop, l: oldWrap.scrollLeft } : null;

    var sigTypes = {}; state.units.forEach(function (u) { if (u._sig) sigTypes[u._sig.name] = 1; });
    var sigList = Object.keys(sigTypes).sort();

    var h = '<div class="sig-app"><div class="sig-filters">';
    h += '<div class="sig-group"><span class="sig-label">Signal</span>' + pill("data-sig", "all", "ALL", state.filters.signal === "all");
    sigList.forEach(function (s) { h += pill("data-sig", s, s, state.filters.signal === s); });
    h += '</div>';
    h += '<div class="sig-group"><span class="sig-label">Dir</span>';
    [["all","ALL"],["in","IN"],["out","OUT"],[DASH,DASH]].forEach(function (d) { h += pill("data-dir", d[0], d[1], state.filters.dir === d[0]); });
    h += '</div>';
    h += '<div class="sig-group"><span class="sig-label">Report</span>';
    [["Input Patch","input-patch"],["Output Patch","output-patch"],["Equipment Pull","equip-pull"],["Channel Hookup","ch-hookup"]].forEach(function (r) {
      h += pill("data-rpt", r[1], r[0], state.panel === "rpt:" + r[1], "sig-rpt");
    });
    h += '</div>';
    h += '<div class="sig-group sig-tools"><span class="sig-count">' + state.filtered.length + '/' + state.units.length + ' units</span>';
    h += pill("data-act", "json", "\u2913 JSON", false, "sig-act");
    h += pill("data-act", "xls", "\u2913 Excel", false, "sig-act");
    h += pill("data-act", "import", "\u2912 Import", false);
    h += pill("data-act", "reset", "Reset", false, "sig-danger");
    h += '<input type="file" id="sigImport" accept=".json,application/json" hidden>';
    h += '</div></div>';

    h += '<div class="sig-table-wrap"><div class="sig-table" role="table">';
    h += '<div class="sig-row sig-hdr" role="row">';
    COLS.forEach(function (c) {
      var arrow = state.sort.col === c.k ? (state.sort.dir === "asc" ? " \u2191" : " \u2193") : "";
      h += '<div class="sig-cell" role="columnheader" style="' + cellStyle(c) + '" data-sort="' + c.k + '">' + c.l + arrow + '</div>';
    });
    h += '<div class="sig-cell" style="width:48px;min-width:48px"></div></div>';

    state.filtered.forEach(function (u, i) {
      var sel = state.selected && state.selected.unit_id === u.unit_id;
      var sigName = u._sig ? u._sig.name : "";
      var dirVal = normDir(u.direction) === DASH ? DASH : normDir(u.direction).toUpperCase();
      var C = function (k, cls, inner, extra, title) {
        var c = COLS.filter(function (x) { return x.k === k; })[0];
        return '<div class="sig-cell' + (cls ? " " + cls : "") + '" style="' + cellStyle(c) + (extra ? ";" + extra : "") + '"' + (title ? ' title="' + title + '"' : "") + '>' + inner + '</div>';
      };
      var vals = {
        unit_num: C("unit_num", "", or(u.unit_num)),
        _type: C("_type", "", or(u._type && u._type.name)),
        _sig: C("_sig", "", or(sigName), "color:" + (SIG_COLORS[sigName] || "#94a3b8")),
        _pos: C("_pos", "", or(u._pos && u._pos.name)),
        direction: C("direction", "", dirVal, "color:" + (DIR_COLORS[dirVal] || "var(--text-faint)")),
        purpose: C("purpose", "", or(u.purpose)),
        channel: C("channel", "sig-ch", or(u.channel || u.dmx_addr)),
        dimmer: C("dimmer", "sig-dim", or(u.dimmer)),
        role: C("role", "sig-soft", esc(u.role || "")),
        notes: C("notes", "sig-soft", esc(u.notes || ""), "", esc(u.notes || ""))
      };
      h += '<div class="sig-row' + (sel ? " is-sel" : "") + (i % 2 ? " sig-alt" : "") + '" role="row" data-uid="' + esc(u.unit_id) + '">';
      COLS.forEach(function (c) { h += vals[c.k]; });
      h += '<div class="sig-cell sig-tr" style="width:48px;min-width:48px"><button type="button" class="sig-trace-btn" data-uid="' + esc(u.unit_id) + '" title="Signal trace" aria-label="Signal trace">\u27bf</button></div>';
      h += '</div>';
    });
    if (!state.filtered.length) h += '<div class="sig-empty">No units match current filters</div>';
    h += '</div></div></div>';

    if (state.panel) {
      var p = "";
      if (state.panel === "detail" && state.selected) p = renderDetail(state.selected);
      else if (state.panel === "trace" && state.selected) p = renderTrace(state.selected);
      else if (state.panel.indexOf("rpt:") === 0) p = renderReport(state.panel.slice(4));
      if (p) h += '<div class="sig-scrim" data-close></div>' + p;
    }

    view.innerHTML = h;
    if (keep) { var w = view.querySelector(".sig-table-wrap"); if (w) { w.scrollTop = keep.t; w.scrollLeft = keep.l; } }
    bindEvents();
  }

  function panel(title, body) {
    return '<aside class="sig-panel" role="dialog" aria-label="' + esc(title) + '"><div class="sig-panel-hdr"><h2>' + esc(title) +
      '</h2><button type="button" class="sig-panel-x" data-close aria-label="Close">\u2715</button></div><div class="sig-panel-body">' + body + '</div></aside>';
  }

  function renderDetail(u) {
    var conns = db.getAll("connections").filter(function (c) { return c.source_endpoint === u.endpoint_id || c.dest_endpoint === u.endpoint_id; });
    var assigns = db.getAll("assignments").filter(function (a) { return a.source_endpoint === u.endpoint_id; });
    var cps = db.getAll("control_points").filter(function (cp) { return cp.parent_unit_id === u.unit_id; });
    var nis = db.getAll("network_interfaces").filter(function (ni) { return ni.unit_id === u.unit_id; });
    var b = "";
    [["Type",(u._type||{}).name],["Signal",(u._sig||{}).name],["Position",(u._pos||{}).name],["Direction",u.direction],["Purpose",u.purpose],["Channel",u.channel||u.dmx_addr],["Dimmer",u.dimmer],["Role",u.role],["Asset Tag",u.asset_tag],["Label",u.label],["Notes",u.notes]].forEach(function (f) {
      b += '<div class="sig-field"><span class="sig-field-lbl">' + f[0] + '</span><span class="sig-field-val">' + or(f[1]) + '</span></div>';
    });
    if (nis.length) { b += '<h3 class="sig-section-hdr">Network Interfaces</h3>'; nis.forEach(function (ni) { b += '<div class="sig-field"><span class="sig-ch">' + esc(ni.ip) + '</span> <span class="sig-muted">' + esc(ni.hostname || ni.port_label) + '</span></div>'; }); }
    if (cps.length) { b += '<h3 class="sig-section-hdr">Control Points (' + cps.length + ')</h3>'; cps.forEach(function (cp) { b += '<div class="sig-cp"><span class="sig-muted">' + esc(cp.cp_type) + '</span> ' + esc(cp.label) + (cp.channel_num ? ' <span class="sig-ch">ch' + esc(cp.channel_num) + '</span>' : "") + '</div>'; }); }
    if (conns.length) { b += '<h3 class="sig-section-hdr">Connections</h3>'; conns.forEach(function (c) { b += '<div class="sig-field"><span class="sig-soft">' + esc(c.connection_type) + '</span> ' + esc(c.notes) + '</div>'; }); }
    if (assigns.length) { b += '<h3 class="sig-section-hdr">Assignments</h3>'; assigns.forEach(function (a) { b += '<div class="sig-field"><span class="sig-good">' + esc(a.level) + '</span> \u2192 ' + esc(a.notes || a.group_name) + (a.pre_post ? ' <span class="sig-soft">(' + esc(a.pre_post) + ')</span>' : "") + '</div>'; }); }
    b += '<div style="margin-top:16px">' + pill("data-trace", u.unit_id, "\u27bf Trace this signal", false, "sig-act") + '</div>';
    return panel("Unit #" + u.unit_num, b);
  }

  function renderTrace(u) {
    var conns = db.getAll("connections"), assigns = db.getAll("assignments");
    var endpoints = [u.endpoint_id];
    db.getAll("control_points").forEach(function (cp) { if (cp.parent_unit_id === u.unit_id) endpoints.push(cp.endpoint_id); });
    var visited = {}, results = [];
    function walk(ep, depth) {
      if (!ep || visited[ep] || depth > 12) return;
      visited[ep] = true;
      conns.forEach(function (c) {
        if (c.source_endpoint !== ep) return;
        results.push({ depth: depth, type: c.connection_type, notes: c.notes, isAssign: false });
        walk(c.dest_endpoint, depth + 1);
      });
      assigns.forEach(function (a) {
        if (a.source_endpoint !== ep) return;
        results.push({ depth: depth, type: "assign", notes: a.level + " \u2192 " + (a.notes || a.group_name), isAssign: true });
      });
    }
    endpoints.forEach(function (ep) { walk(ep, 0); });
    var b = '<div class="sig-trace-info">' + esc(u._type ? u._type.name : "") + ' \u00b7 ' + esc(u.purpose) + '</div><div class="sig-trace-box">';
    if (!results.length) b += '<div class="sig-muted">No downstream connections documented for this unit yet.</div>';
    results.forEach(function (s) {
      b += '<div class="sig-trace-step" style="padding-left:' + (s.depth * 18) + 'px"><span class="' + (s.isAssign ? "sig-good" : "sig-ch") + '">' +
        (s.isAssign ? "\u251c\u2192" : s.depth > 0 ? "\u2514\u2500" : "\u2500\u2500") + '</span> <span class="' + (s.isAssign ? "sig-good" : "") + '">' + esc(s.notes || s.type) + '</span></div>';
    });
    b += '</div>';
    return panel("Trace: Unit #" + u.unit_num, b);
  }

  function renderReport(type) {
    var items, b = "";
    if (type === "input-patch") items = state.units.filter(function (u) { return normDir(u.direction) === "in"; });
    else if (type === "output-patch") items = state.units.filter(function (u) { return normDir(u.direction) === "out"; });
    else if (type === "ch-hookup") items = state.units.filter(function (u) { return u.dmx_addr; });
    else items = state.units;
    if (type === "equip-pull") {
      var counts = {};
      items.forEach(function (u) { var n = (u._type || {}).name || "?"; counts[n] = (counts[n] || 0) + 1; });
      Object.keys(counts).sort().forEach(function (k) { b += '<div class="sig-field"><span style="flex:1">' + esc(k) + '</span><span class="sig-ch">' + counts[k] + '\u00d7</span></div>'; });
      b += '<div class="sig-field sig-total"><span style="flex:1">Total</span><span class="sig-ch">' + items.length + '</span></div>';
    } else {
      items.sort(function (a, b2) { return String(a.channel || a.dmx_addr || a.unit_num).localeCompare(String(b2.channel || b2.dmx_addr || b2.unit_num), undefined, { numeric: true }); });
      if (!items.length) b += '<div class="sig-muted">Nothing in this report yet.</div>';
      items.forEach(function (u) {
        b += '<div class="sig-field"><span class="sig-muted">#' + esc(u.unit_num) + '</span><span style="flex:1">' + esc(u._type ? u._type.name : "") + " \u00b7 " + esc(u.purpose) + '</span>';
        if (u.channel || u.dmx_addr) b += '<span class="sig-ch">' + esc(u.channel || u.dmx_addr) + '</span>';
        b += '</div>';
      });
    }
    return panel(type.replace(/-/g, " ").toUpperCase(), b);
  }

  function toast(msg) {
    var t = document.createElement("div"); t.className = "sig-toast"; t.textContent = msg;
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2600);
  }

  function selectUnit(uid, panelName) {
    state.selected = state.units.find(function (u) { return String(u.unit_id) === String(uid); }) || null;
    state.panel = state.selected ? panelName : null;
    renderTable();
  }

  function onAction(act) {
    if (act === "json") { db.downloadJSON(); toast("JSON backup downloaded"); }
    else if (act === "xls") { db.downloadXLS(); toast("Excel backup downloaded (one sheet per table)"); }
    else if (act === "import") { document.getElementById("sigImport").click(); }
    else if (act === "reset") {
      if (!confirm("Wipe local data and reload the Big Love sample? Export a backup first if you've made edits.")) return;
      db.wipe(); seedDatabase(); db.reload(); state.selected = null; state.panel = null; init(); toast("Reset to sample data");
    }
  }

  function bindEvents() {
    var view = document.getElementById("view");
    view.querySelectorAll("[data-sig]").forEach(function (btn) { btn.addEventListener("click", function () { state.filters.signal = btn.dataset.sig; applyFilters(); }); });
    view.querySelectorAll("[data-dir]").forEach(function (btn) { btn.addEventListener("click", function () { state.filters.dir = btn.dataset.dir; applyFilters(); }); });
    view.querySelectorAll(".sig-hdr [data-sort]").forEach(function (cell) {
      cell.addEventListener("click", function () {
        var col = cell.dataset.sort;
        if (state.sort.col === col) state.sort.dir = state.sort.dir === "asc" ? "desc" : "asc";
        else { state.sort.col = col; state.sort.dir = "asc"; }
        sortUnits();
      });
    });
    view.querySelectorAll(".sig-row[data-uid]").forEach(function (row) {
      row.addEventListener("click", function (e) { if (e.target.closest(".sig-trace-btn")) return; selectUnit(row.dataset.uid, "detail"); });
    });
    view.querySelectorAll(".sig-trace-btn, [data-trace]").forEach(function (btn) {
      btn.addEventListener("click", function (e) { e.stopPropagation(); selectUnit(btn.dataset.uid || btn.dataset.trace, "trace"); });
    });
    view.querySelectorAll("[data-rpt]").forEach(function (btn) {
      btn.addEventListener("click", function () { var p = "rpt:" + btn.dataset.rpt; state.panel = state.panel === p ? null : p; renderTable(); });
    });
    view.querySelectorAll("[data-close]").forEach(function (el) { el.addEventListener("click", function () { state.panel = null; state.selected = null; renderTable(); }); });
    view.querySelectorAll("[data-act]").forEach(function (btn) { btn.addEventListener("click", function () { onAction(btn.dataset.act); }); });
    var file = document.getElementById("sigImport");
    if (file) file.addEventListener("change", function () {
      var f = file.files && file.files[0]; if (!f) return;
      var rd = new FileReader();
      rd.onload = function () {
        try {
          var n = db.importAll(JSON.parse(rd.result));
          state.selected = null; state.panel = null; init(); toast("Restored " + n + " tables from " + f.name);
        } catch (err) { alert("Import failed: " + err.message); }
      };
      rd.readAsText(f);
    });
  }

  function onKey(e) { if (e.key === "Escape" && state.panel) { state.panel = null; state.selected = null; renderTable(); } }
  var keyBound = false;

  function init() {
    if (db.isEmpty()) { seedDatabase(); db.reload(); }
    var shows = db.getAll("shows");
    state.show = shows.length ? shows[0] : null;
    if (!keyBound) { document.addEventListener("keydown", onKey); keyBound = true; }
    loadUnits();
  }

  return { init: init };
})();
