/* ui.js — shared UI kit: escaping, toast, side panel, endpoint labels, FK options, and the
   schema-driven record form used by every screen. */
var UI = (function () {
  var DASH = "\u2014";
  function esc(v) { return v === null || v === undefined ? "" : String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function or(v) { return v === null || v === undefined || v === "" ? DASH : esc(v); }

  function toast(msg, kind) {
    var box = document.getElementById("sigToasts");
    if (!box) { box = document.createElement("div"); box.id = "sigToasts"; box.className = "sig-toasts"; box.setAttribute("aria-live", "polite"); document.body.appendChild(box); }
    var t = document.createElement("div"); t.className = "sig-toast" + (kind ? " is-" + kind : ""); t.textContent = msg;
    box.appendChild(t); while (box.children.length > 3) box.firstChild.remove();
    setTimeout(function () { t.remove(); }, kind === "bad" ? 5000 : 2600);
  }

  // ---------- current show ----------
  function showId() {
    var id = SignalDB.meta("showId");
    if (id && SignalDB.get("shows", id)) return id;
    var s = SignalDB.getAll("shows").sort(function (a, b) { return String(a.title).localeCompare(String(b.title)); })[0];
    return s ? s.id : null;
  }
  function setShow(id) { SignalDB.meta("showId", id); }

  // ---------- endpoint index (owner lookup), rebuilt on change ----------
  var idx = null;
  SignalDB.on(function () { idx = null; });
  function index() {
    if (idx) return idx;
    idx = {};
    SignalDB.getAll("units").forEach(function (u) { if (u.endpoint_id) idx[u.endpoint_id] = { t: "units", r: u }; });
    SignalDB.getAll("control_points").forEach(function (c) { if (c.endpoint_id) idx[c.endpoint_id] = { t: "control_points", r: c }; });
    SignalDB.getAll("infrastructure").forEach(function (i) { if (i.endpoint_id) idx[i.endpoint_id] = { t: "infrastructure", r: i }; });
    return idx;
  }
  function epOwner(ep) { return ep ? index()[ep] || null : null; }
  function epLabel(ep) {
    if (!ep) return DASH;
    var o = epOwner(ep);
    if (!o) return "(missing " + String(ep).slice(0, 8) + ")";
    return SCHEMA.T[o.t].show(o.r);
  }

  // ---------- FK + endpoint options ----------
  function fkRows(to) {
    var sid = showId();
    var rows = SignalDB.getAll(to);
    if (SCHEMA.isShowScoped(to)) rows = rows.filter(function (r) { return r.show_id === sid; });
    if (to === "positions") rows = rows.filter(function (r) { return !r.show_id || r.show_id === sid; });
    return rows.map(function (r) { return { id: r.id, label: SCHEMA.T[to].show(r) }; })
      .sort(function (a, b) { return a.label.localeCompare(b.label, undefined, { numeric: true }); });
  }
  function epGroups() {
    var sid = showId();
    var g = [["Units", "units"], ["Control points", "control_points"], ["Infrastructure", "infrastructure"]].map(function (x) {
      var rows = SignalDB.getAll(x[1]).filter(function (r) { return r.endpoint_id && (x[1] === "infrastructure" || r.show_id === sid); });
      return { label: x[0], items: rows.map(function (r) { return { id: r.endpoint_id, label: SCHEMA.T[x[1]].show(r) }; })
        .sort(function (a, b) { return a.label.localeCompare(b.label, undefined, { numeric: true }); }) };
    });
    return g.filter(function (x) { return x.items.length; });
  }

  // ---------- side panel ----------
  var onClose = null;
  function panel(title, bodyHtml, opts) {
    close(true);
    var wrap = document.createElement("div"); wrap.id = "sigPanelWrap";
    wrap.innerHTML = '<div class="sig-scrim" data-pclose></div><aside class="sig-panel" role="dialog" aria-label="' + esc(title) + '">' +
      '<div class="sig-panel-hdr"><h2>' + esc(title) + '</h2><div class="sig-panel-acts">' + ((opts && opts.actions) || "") +
      '<button type="button" class="sig-panel-x" data-pclose aria-label="Close">\u2715</button></div></div>' +
      '<div class="sig-panel-body">' + bodyHtml + '</div></aside>';
    document.body.appendChild(wrap);
    onClose = opts && opts.onClose;
    wrap.querySelectorAll("[data-pclose]").forEach(function (el) { el.addEventListener("click", function () { close(); }); });
    return wrap.querySelector(".sig-panel");
  }
  function close(silent) {
    var w = document.getElementById("sigPanelWrap"); if (!w) return;
    w.remove(); var f = onClose; onClose = null; if (!silent && f) f();
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

  // ---------- record form ----------
  function fieldHtml(f, val, ro) {
    var k = f[0], label = f[1], type = f[2], o = f[3] || {};
    var id = "f_" + k, req = o.req ? " required" : "", dis = ro ? " disabled" : "";
    var lab = '<label for="' + id + '">' + esc(label) + (o.req ? ' <b class="sig-req">*</b>' : "") + '</label>';
    var input;
    if (type === "area") input = '<textarea id="' + id + '" name="' + k + '" rows="3"' + dis + '>' + esc(val) + '</textarea>';
    else if (type === "bool") return '<div class="sig-fld sig-fld-bool"><label><input type="checkbox" id="' + id + '" name="' + k + '"' + (val ? " checked" : "") + dis + '> ' + esc(label) + '</label></div>';
    else if (type === "enum") input = '<select id="' + id + '" name="' + k + '"' + req + dis + '><option value="">' + DASH + '</option>' +
      o.values.map(function (v) { return '<option' + (String(val) === v ? " selected" : "") + '>' + esc(v) + '</option>'; }).join("") + '</select>';
    else if (type === "fk") input = '<select id="' + id + '" name="' + k + '"' + req + dis + '><option value="">' + DASH + '</option>' +
      fkRows(o.to).map(function (r) { return '<option value="' + esc(r.id) + '"' + (r.id === val ? " selected" : "") + '>' + esc(r.label) + '</option>'; }).join("") + '</select>';
    else if (type === "ep") input = '<select id="' + id + '" name="' + k + '"' + req + dis + '><option value="">' + DASH + '</option>' +
      epGroups().map(function (g) { return '<optgroup label="' + esc(g.label) + '">' + g.items.map(function (r) {
        return '<option value="' + esc(r.id) + '"' + (r.id === val ? " selected" : "") + '>' + esc(r.label) + '</option>'; }).join("") + '</optgroup>'; }).join("") + '</select>';
    else input = '<input id="' + id + '" name="' + k + '" type="' + (type === "num" ? "number\" step=\"any" : type === "date" ? "date" : "text") + '" value="' + esc(val) + '"' + req + dis +
      (o.hint ? ' placeholder="' + esc(o.hint) + '"' : "") + ' autocomplete="off">';
    return '<div class="sig-fld">' + lab + input + '</div>';
  }

  // edit(table, row|null, {defaults, onSaved, title})
  function edit(t, row, opts) {
    opts = opts || {};
    var S = SCHEMA.T[t], isNew = !row;
    var cur = Object.assign({}, opts.defaults || {}, row || {});
    var canW = isNew ? Sync.can("write", t, Object.assign({ show_id: SCHEMA.isShowScoped(t) ? showId() : cur.show_id }, cur)) : Sync.can("write", t, row);
    var canD = !isNew && Sync.can("delete", t, row);
    var pend = row && SignalDB.pendingFor(t, row.id);
    var h = '<form class="sig-form" novalidate>';
    if (!canW) h += '<div class="sig-note">Read-only for your role.</div>';
    S.fields.forEach(function (f) { h += fieldHtml(f, cur[f[0]], !canW); });
    if (row && row.updated_by) h += '<div class="sig-meta">' + (pend ? "Unsynced local edit \u00b7 " : "") + 'Last edit ' + esc(row.updated_by) + (row.updated_at ? " \u00b7 " + esc(new Date(row.updated_at).toLocaleString()) : "") + '</div>';
    h += '<div class="sig-form-acts">';
    if (canW) h += '<button type="submit" class="sig-btn sig-btn-pri">' + (isNew ? "Create" : "Save") + '</button>';
    if (canD) h += '<button type="button" class="sig-btn sig-btn-bad" data-del>Delete</button>';
    h += '<button type="button" class="sig-btn" data-pclose2>Cancel</button></div></form>';
    var p = panel(opts.title || ((isNew ? "New " : "") + (isNew ? S.label.replace(/s$/, "") : S.show(row))), h, { onClose: opts.onClose });
    var form = p.querySelector("form");
    p.querySelector("[data-pclose2]").addEventListener("click", function () { close(); });
    var first = form.querySelector("input:not([type=checkbox]),select,textarea"); if (first && canW) setTimeout(function () { try { first.focus(); } catch (e) {} }, 60);
    form.addEventListener("submit", function (e) {
      e.preventDefault(); if (!canW) return;
      var out = { id: row ? row.id : undefined }, missing = [];
      S.fields.forEach(function (f) {
        var el = form.querySelector('[name="' + f[0] + '"]'); if (!el) return;
        var v = f[2] === "bool" ? (el.checked ? 1 : 0) : el.value.trim();
        if (f[2] === "num" && v !== "") v = Number(v);
        if (v === "") v = null;
        if ((f[3] || {}).req && (v === null)) missing.push(f[1]);
        out[f[0]] = v;
      });
      if (missing.length) { toast("Required: " + missing.join(", "), "bad"); return; }
      if (isNew) {
        Object.keys(opts.defaults || {}).forEach(function (k) { if (!(k in out)) out[k] = opts.defaults[k]; });
        out.id = SignalDB.uid();
        if (SCHEMA.isShowScoped(t) && !out.show_id) out.show_id = showId();
        if (S.ep) { var ep = SignalDB.put("endpoints", { id: "EP-" + SignalDB.uid(), class: S.ep }); out.endpoint_id = ep.id; }
      }
      if (t === "units" && out.unit_num != null) {
        var dup = SignalDB.where("units", function (u) { return u.show_id === (out.show_id || cur.show_id) && u.unit_num === out.unit_num && u.id !== out.id; })[0];
        if (dup && !confirm("Unit #" + out.unit_num + " already exists (" + (dup.purpose || "") + "). Save anyway?")) return;
      }
      var saved = SignalDB.put(t, out);
      Sync.kick(); close(true);
      toast((isNew ? "Created " : "Saved ") + S.show(saved));
      if (opts.onSaved) opts.onSaved(saved, isNew);
    });
    var d = p.querySelector("[data-del]");
    if (d) d.addEventListener("click", function () {
      var kids = dependents(t, row);
      var msg = "Delete " + S.show(row) + (kids.length ? " and " + kids.length + " linked row" + (kids.length > 1 ? "s" : "") + " (connections, control points, IPs)" : "") + "?";
      if (!confirm(msg)) return;
      kids.forEach(function (k) { SignalDB.del(k[0], k[1].id); });
      SignalDB.del(t, row.id); Sync.kick(); close(true);
      toast("Deleted " + S.show(row));
      if (opts.onSaved) opts.onSaved(null, false);
    });
  }

  // rows that only make sense with this row (soft-deleted with it)
  function dependents(t, row) {
    var out = [];
    function eps(ep) {
      if (!ep) return;
      SignalDB.where("connections", function (c) { return c.source_endpoint === ep || c.dest_endpoint === ep; }).forEach(function (c) { out.push(["connections", c]); });
      SignalDB.where("assignments", function (a) { return a.source_endpoint === ep || a.dest_endpoint === ep; }).forEach(function (a) { out.push(["assignments", a]); });
    }
    if (t === "units") {
      eps(row.endpoint_id);
      SignalDB.where("control_points", function (c) { return c.parent_unit_id === row.id; }).forEach(function (c) { out.push(["control_points", c]); eps(c.endpoint_id); });
      SignalDB.where("network_interfaces", function (n) { return n.unit_id === row.id; }).forEach(function (n) { out.push(["network_interfaces", n]); });
    } else if (t === "control_points" || t === "infrastructure") eps(row.endpoint_id);
    var seen = {}; return out.filter(function (x) { var k = x[0] + x[1].id; if (seen[k]) return false; seen[k] = 1; return true; });
  }

  // live signal trace (mirrors worker /trace): connections + assignments, continuing only past connections
  function trace(u) {
    var seeds = [u.endpoint_id].concat(SignalDB.where("control_points", function (c) { return c.parent_unit_id === u.id; }).map(function (c) { return c.endpoint_id; }));
    var edges = SignalDB.getAll("connections").map(function (c) { return { src: c.source_endpoint, dst: c.dest_endpoint, kind: "connection", info: c.notes || c.connection_type || "" }; })
      .concat(SignalDB.getAll("assignments").map(function (a) { return { src: a.source_endpoint, dst: a.dest_endpoint, kind: "assignment", info: ((a.level || "") + " " + (a.pre_post ? "(" + a.pre_post + ") " : "") + (a.group_name || "")).trim() }; }));
    var out = [];
    function walk(ep, depth, path) {
      edges.forEach(function (e) {
        if (e.src !== ep || (e.dst && path.indexOf(e.dst) !== -1)) return;
        out.push({ depth: depth, kind: e.kind, info: e.info, to: e.dst, label: e.dst ? epLabel(e.dst) : "group" });
        if (e.kind === "connection" && depth < 16) walk(e.dst, depth + 1, path.concat([e.dst]));
      });
    }
    seeds.forEach(function (s) { if (s) walk(s, 0, [s]); });
    return out;
  }

  return { esc: esc, or: or, toast: toast, panel: panel, close: close, edit: edit, epLabel: epLabel, epOwner: epOwner,
    fkRows: fkRows, showId: showId, setShow: setShow, trace: trace, dependents: dependents, DASH: DASH };
})();
