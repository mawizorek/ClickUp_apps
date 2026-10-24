/* screens/infra.js — the INFRASTRUCTURE grid: filter ports by type and usage,
   inspect connection context, and bulk-import endpoint labels. */
window.Screens = window.Screens || {};
Screens.infra = (function () {
  var esc = UI.esc, or = UI.or, DASH = UI.DASH;
  var TYPES = ["audio tie", "data tie", "power ckt", "DMX home run", "fiber", "panel", "other"];
  var TYPE_COLORS = {
    "audio tie": "#4ade80", "data tie": "#22d3ee", "power ckt": "#fbbf24",
    "DMX home run": "#60a5fa", "fiber": "#c084fc", "panel": "#f472b6", "other": "#94a3b8"
  };
  var st = { sort: { col: "label", dir: "asc" }, filters: { type: "all", usage: "all" }, q: "" };
  var view = null;
  var COLS = [
    { k: "label", l: "Label", w: 120 },
    { k: "type", l: "Type", w: 110 },
    { k: "endpoint_a", l: "End A", w: 160, flex: true },
    { k: "endpoint_b", l: "End B", w: 160, flex: true },
    { k: "_inuse", l: "In Use", w: 70 },
    { k: "notes", l: "Notes", w: 160 }
  ];

  /* Resolve an endpoint FK: if val is a valid infrastructure ID, return its label;
     if it looks like a raw text value (legacy data), return it as-is; null -> null. */
  function resolveEP(val) {
    if (!val) return null;
    var ref = SignalDB.get("infrastructure", val);
    if (ref) return ref.label || val;
    return val; /* legacy text — show as-is until migrated */
  }

  function cs(c) { return "width:" + c.w + "px;min-width:" + c.w + "px" + (c.flex ? ";flex:1 0 " + c.w + "px" : ""); }
  function typeColor(t) { return TYPE_COLORS[t] || "#94a3b8"; }
  function pill(attr, val, label, on, extra) {
    return '<button type="button" class="sig-pill' + (on ? " is-on" : "") + (extra ? " " + extra : "") + '" ' + attr + '="' + esc(val) + '">' + esc(label) + '</button>';
  }
  function typePill(val, label, on) {
    return '<button type="button" class="sig-pill' + (on ? " is-on" : "") + '" data-infra-type="' + esc(val) + '" style="color:' + esc(typeColor(val)) + ';border-color:' + (on ? esc(typeColor(val)) : "var(--border)") + '">' + esc(label) + '</button>';
  }
  function syncPill() {
    var s = Sync.state(), d = Sync.detail();
    var map = { local: ["Local only", "sig-st-local"], nokey: ["Not signed in", "sig-st-warn"], bootstrap: ["Setup needed", "sig-st-warn"], syncing: ["Syncing\u2026", "sig-st-busy"],
      synced: ["Synced", "sig-st-ok"], pending: [d || "Pending", "sig-st-busy"], offline: ["Offline", "sig-st-warn"], error: ["Sync error", "sig-st-bad"] };
    var m = map[s] || [s, ""];
    return '<a class="sig-st ' + m[1] + '" href="#access" title="' + esc(d || m[0]) + '"><i></i>' + esc(m[0]) + '</a>';
  }
  function rowsOf() { return SignalDB.getAll("infrastructure").filter(function (r) { return !r.deleted_at; }); }
  function connectionsFor(i) {
    return SignalDB.where("connections", function (c) {
      return !c.deleted_at && i && i.endpoint_id && (c.source_endpoint === i.endpoint_id || c.dest_endpoint === i.endpoint_id);
    });
  }
  function inUse(i) { return connectionsFor(i).length; }
  function sortVal(x, col) {
    if (col === "_inuse") return x.used;
    if (col === "endpoint_a" || col === "endpoint_b") return resolveEP(x.row[col]);
    return x.row[col];
  }
  function labelHint() {
    var groups = {};
    rowsOf().forEach(function (r) {
      var m = String(r.label || "").match(/^(.*?)(\d+)$/);
      if (!m) return;
      var p = m[1], n = Number(m[2]);
      if (!isFinite(n)) return;
      if (!groups[p]) groups[p] = { count: 0, max: n };
      groups[p].count++;
      if (n > groups[p].max) groups[p].max = n;
    });
    var best = null;
    Object.keys(groups).forEach(function (p) {
      var g = groups[p];
      if (!best || g.count > best.count || (g.count === best.count && p.length > best.prefix.length)) best = { prefix: p, count: g.count, max: g.max };
    });
    return best ? best.prefix + (best.max + 1) : "e.g. D1";
  }
  function openNew() {
    var def = {}, venue = SignalDB.getAll("venues")[0];
    if (venue) def.venue_id = venue.id;
    UI.edit("infrastructure", null, { defaults: def, onSaved: function (r) { render(); if (r) detail(r.id); } });
    setTimeout(function () {
      var f = document.querySelector("#sigPanelWrap #f_label");
      if (f) f.placeholder = labelHint();
    }, 0);
  }

  function render(v) {
    view = v || view; if (!view) return;
    var old = view.querySelector(".sig-table-wrap"), keep = old ? { t: old.scrollTop, l: old.scrollLeft } : null;
    var all = rowsOf().map(function (r) { return { row: r, used: inUse(r) }; });
    var types = Object.keys(all.reduce(function (m, x) { if (x.row.type) m[x.row.type] = 1; return m; }, {})).sort(function (a, b) { return a.localeCompare(b, undefined, { numeric: true }); });
    var q = st.q.toLowerCase();
    var rows = all.filter(function (x) {
      var r = x.row;
      if (st.filters.type !== "all" && r.type !== st.filters.type) return false;
      if (st.filters.usage === "used" && !x.used) return false;
      if (st.filters.usage === "free" && x.used) return false;
      if (q && [r.label, resolveEP(r.endpoint_a), resolveEP(r.endpoint_b), r.notes].join(" ").toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
    var col = st.sort.col, dir = st.sort.dir;
    rows.sort(function (a, b) {
      var av = sortVal(a, col), bv = sortVal(b, col);
      if (av == null) av = ""; if (bv == null) bv = "";
      if (typeof av === "number" && typeof bv === "number") return dir === "asc" ? av - bv : bv - av;
      var r = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return dir === "asc" ? r : -r;
    });

    var h = '<div class="sig-app"><div class="sig-filters">';
    h += '<div class="sig-group sig-showbar"><input class="sig-search" id="infraQ" type="search" placeholder="Search infrastructure" value="' + esc(st.q) + '" aria-label="Search infrastructure">';
    if (Sync.can("write", "infrastructure")) {
      h += pill("data-act", "new", "+ New", false, "sig-act sig-new");
      h += pill("data-act", "paste", "Paste Import", false, "sig-act");
    }
    h += syncPill() + '<span class="sig-count">' + rows.length + '/' + all.length + ' infra</span></div>';
    h += '<div class="sig-group"><span class="sig-label">Type</span>' + typePill("all", "ALL", st.filters.type === "all");
    types.forEach(function (t) { h += typePill(t, t, st.filters.type === t); });
    h += '</div><div class="sig-group"><span class="sig-label">Usage</span>';
    [["all", "ALL"], ["used", "In Use"], ["free", "Free"]].forEach(function (x) { h += pill("data-usage", x[0], x[1], st.filters.usage === x[0]); });
    h += '</div></div><div class="sig-table-wrap"><div class="sig-table" role="table"><div class="sig-row sig-hdr" role="row">';
    COLS.forEach(function (c) {
      var ar = st.sort.col === c.k ? (st.sort.dir === "asc" ? " \u2191" : " \u2193") : "";
      h += '<div class="sig-cell" role="columnheader" style="' + cs(c) + '" data-sort="' + c.k + '">' + c.l + ar + '</div>';
    });
    h += '<div class="sig-cell" style="width:48px;min-width:48px"></div></div>';
    rows.forEach(function (x, i) {
      var r = x.row, pend = SignalDB.pendingFor("infrastructure", r.id);
      var cell = function (k, cls, inner, extra, title) {
        var c = COLS.filter(function (z) { return z.k === k; })[0];
        return '<div class="sig-cell' + (cls ? " " + cls : "") + '" style="' + cs(c) + (extra ? ";" + extra : "") + '"' + (title ? ' title="' + title + '"' : "") + '>' + inner + '</div>';
      };
      h += '<div class="sig-row' + (i % 2 ? " sig-alt" : "") + (pend ? " is-pend" : "") + '" role="row" data-iid="' + esc(r.id) + '" tabindex="0">';
      h += cell("label", "", or(r.label));
      h += cell("type", "", or(r.type), "color:" + esc(typeColor(r.type)));
      h += cell("endpoint_a", "sig-soft", or(resolveEP(r.endpoint_a)));
      h += cell("endpoint_b", "sig-soft", or(resolveEP(r.endpoint_b)));
      h += cell("_inuse", x.used ? "sig-ch" : "sig-muted", x.used ? String(x.used) : DASH);
      h += cell("notes", "sig-soft", esc(r.notes || ""), "", esc(r.notes || ""));
      h += '<div class="sig-cell" style="width:48px;min-width:48px"></div></div>';
    });
    if (!rows.length) h += '<div class="sig-empty">' + (all.length ? "No infrastructure matches current filters" : "No infrastructure yet. Tap + New or Paste Import to add one.") + '</div>';
    h += '</div></div></div>';
    view.innerHTML = h;
    if (keep) { var nw = view.querySelector(".sig-table-wrap"); if (nw) { nw.scrollTop = keep.t; nw.scrollLeft = keep.l; } }
    bind();
  }

  function bind() {
    var $ = function (s) { return view.querySelectorAll(s); };
    $(".sig-row[data-iid]").forEach(function (r) {
      r.addEventListener("click", function () { detail(r.dataset.iid); });
      r.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); detail(r.dataset.iid); } });
    });
    $("[data-infra-type]").forEach(function (b) { b.addEventListener("click", function () { st.filters.type = b.dataset.infraType; render(); }); });
    $("[data-usage]").forEach(function (b) { b.addEventListener("click", function () { st.filters.usage = b.dataset.usage; render(); }); });
    $("[data-sort]").forEach(function (c) { c.addEventListener("click", function () {
      var k = c.dataset.sort;
      if (st.sort.col === k) st.sort.dir = st.sort.dir === "asc" ? "desc" : "asc";
      else { st.sort.col = k; st.sort.dir = "asc"; }
      render();
    }); });
    $("[data-act]").forEach(function (b) { b.addEventListener("click", function () { if (b.dataset.act === "new") openNew(); else if (b.dataset.act === "paste") openPaste(); }); });
    var q = view.querySelector("#infraQ");
    if (q) q.addEventListener("input", function () { st.q = q.value; var p = q.selectionStart; render(); var n = view.querySelector("#infraQ"); if (n) { n.focus(); try { n.setSelectionRange(p, p); } catch (e) {} } });
  }

  function parsePaste(text) {
    return String(text || "").split(/\r?\n/).map(function (line) {
      var bits = line.split("\t").map(function (v) { return v.trim(); });
      return { label: bits[0] || "", endpoint_a: bits[1] || "", endpoint_b: bits[2] || "" };
    }).filter(function (r) { return r.label; });
  }
  /* Build a label -> id lookup for paste import endpoint resolution */
  function infraByLabel() {
    var map = {};
    rowsOf().forEach(function (r) { if (r.label) map[r.label] = r.id; });
    return map;
  }
  function bulkExisting(rows) {
    var old = {};
    rowsOf().forEach(function (r) { old[String(r.label || "")] = 1; });
    var seen = {};
    return rows.map(function (r) {
      var duplicate = !!old[r.label] || !!seen[r.label];
      seen[r.label] = 1;
      r.duplicate = duplicate;
      return r;
    });
  }
  function openPaste() {
    var type = TYPES[0];
    var h = '<div class="sig-note">Paste one label per line, or use tabs for <b>label &rarr; end A &rarr; end B</b>. Endpoint text is matched to existing infrastructure labels.</div>';
    h += '<form class="sig-form" id="infraPasteForm"><div class="sig-fld"><label for="infraPasteType">Type</label><select id="infraPasteType">' + TYPES.map(function (t) { return '<option value="' + esc(t) + '">' + esc(t) + '</option>'; }).join("") + '</select></div>';
    h += '<div class="sig-fld"><label for="infraPaste">Labels / rows</label><textarea id="infraPaste" rows="8" placeholder="D1\nD2\nD3"></textarea></div><div id="infraPastePreview"></div><div class="sig-form-acts"><button type="submit" class="sig-btn sig-btn-pri">Create All</button><button type="button" class="sig-btn" data-pclose2>Cancel</button></div></form>';
    var p = UI.panel("Paste Infrastructure", h);
    var text = p.querySelector("#infraPaste"), pick = p.querySelector("#infraPasteType"), preview = p.querySelector("#infraPastePreview");
    function draw() {
      type = pick.value;
      var rows = bulkExisting(parsePaste(text.value));
      var lookup = infraByLabel();
      var x = '<h3 class="sig-section-hdr">Preview' + (rows.length ? " (" + rows.length + ")" : "") + '</h3>';
      if (!rows.length) x += '<div class="sig-muted">Nothing to preview yet.</div>';
      else {
        x += '<div style="font-family:var(--font-mono);font-size:.76rem;border:var(--border-w) solid var(--border)">';
        rows.forEach(function (r, i) {
          var aOk = !r.endpoint_a || lookup[r.endpoint_a];
          var bOk = !r.endpoint_b || lookup[r.endpoint_b];
          x += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;padding:6px 8px;border-bottom:var(--border-w) solid var(--border);' + (i % 2 ? "background:var(--surface-2);" : "") + '">';
          x += '<span>' + esc(r.label) + '</span>';
          x += '<span class="' + (aOk ? "sig-soft" : "sig-bad") + '">' + esc(r.endpoint_a || DASH) + '</span>';
          x += '<span class="' + (bOk ? "sig-soft" : "sig-bad") + '">' + esc(r.endpoint_b || DASH) + '</span>';
          if (r.duplicate) x += '<b class="sig-bad" style="grid-column:1/-1">Duplicate \u2014 skipped</b>';
          if (!aOk || !bOk) x += '<span class="sig-muted" style="grid-column:1/-1;font-size:.7rem">Unresolved endpoint(s) stored as text</span>';
          x += '</div>';
        });
        x += '</div>';
      }
      preview.innerHTML = x;
    }
    text.addEventListener("input", draw); pick.addEventListener("change", draw); draw();
    p.querySelector("[data-pclose2]").addEventListener("click", function () { UI.close(); });
    p.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault();
      if (!Sync.can("write", "infrastructure")) { UI.toast("You do not have permission to create infrastructure", "bad"); return; }
      var rows = bulkExisting(parsePaste(text.value)), good = rows.filter(function (r) { return !r.duplicate; });
      if (!good.length) { UI.toast("No new labels to import", "bad"); return; }
      var venue = SignalDB.getAll("venues")[0], made = 0;
      var lookup = infraByLabel();
      good.forEach(function (r) {
        var ep = SignalDB.put("endpoints", { id: "EP-" + SignalDB.uid(), class: "infra" });
        var aVal = r.endpoint_a ? (lookup[r.endpoint_a] || r.endpoint_a) : null;
        var bVal = r.endpoint_b ? (lookup[r.endpoint_b] || r.endpoint_b) : null;
        SignalDB.put("infrastructure", { id: SignalDB.uid(), label: r.label, type: type, venue_id: venue ? venue.id : null,
          endpoint_id: ep.id, endpoint_a: aVal, endpoint_b: bVal, notes: null });
        made++;
      });
      Sync.kick(); UI.close(); render(); UI.toast("Created " + made + " infrastructure row" + (made === 1 ? "" : "s"));
    });
  }

  function rel(t, r, text) { return '<button type="button" class="sig-rel" data-rt="' + t + '" data-rid="' + esc(r.id) + '">' + text + '</button>'; }
  function detail(id) {
    var i = SignalDB.get("infrastructure", id); if (!i) return;
    var conns = connectionsFor(i), b = "";
    [["Label", i.label], ["Type", i.type], ["End A", resolveEP(i.endpoint_a)], ["End B", resolveEP(i.endpoint_b)], ["Notes", i.notes]].forEach(function (f) {
      b += '<div class="sig-field"><span class="sig-field-lbl">' + f[0] + '</span><span class="sig-field-val">' + or(f[1]) + '</span></div>';
    });
    b += '<h3 class="sig-section-hdr">Connections through this port' + (conns.length ? " (" + conns.length + ")" : "") + '</h3>';
    if (!conns.length) b += '<div class="sig-muted">No connections routed through this port yet.</div>';
    conns.forEach(function (c) {
      var sig = c.signal_type ? SignalDB.get("signal_types", c.signal_type) : null;
      var fmt = esc(UI.epLabel(c.source_endpoint)) + ' <span class="sig-ch">\u2192</span> ' + esc(UI.epLabel(c.dest_endpoint)) + ' <span class="sig-soft">\u00b7 ' + esc(sig ? sig.name : DASH) + '</span>';
      b += rel("connections", c, fmt);
    });
    b += '<div class="sig-form-acts">';
    if (Sync.can("write", "infrastructure", i)) b += '<button type="button" class="sig-btn sig-btn-pri" data-edit>Edit infra</button>';
    if (Sync.can("write", "connections")) b += '<button type="button" class="sig-btn" data-add-connection>+ Connection</button>';
    b += '</div>';
    var panel = UI.panel((i.label || "Infrastructure") + (i.type ? " \u00b7 " + i.type : ""), b);
    var back = function () { render(); detail(id); };
    var ed = panel.querySelector("[data-edit]");
    if (ed) ed.addEventListener("click", function () { UI.edit("infrastructure", SignalDB.get("infrastructure", id), { onSaved: function (r) { render(); if (r) detail(id); }, onClose: back }); });
    var ac = panel.querySelector("[data-add-connection]");
    if (ac) ac.addEventListener("click", function () { UI.edit("connections", null, { defaults: { source_endpoint: i.endpoint_id }, onSaved: back, onClose: back }); });
    panel.querySelectorAll("[data-rt]").forEach(function (el) { el.addEventListener("click", function () { UI.edit(el.dataset.rt, SignalDB.get(el.dataset.rt, el.dataset.rid), { onSaved: back, onClose: back }); }); });
  }

  return { render: render, refresh: function () { if (view && document.body.contains(view) && !document.getElementById("sigPanelWrap")) render(); } };
})();
