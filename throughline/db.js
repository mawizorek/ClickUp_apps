/* db.js — local-first store for Throughline. localStorage-backed cache of the server (or the whole DB in local mode).
   Every row: id + domain fields + server meta (rev, updated_at, updated_by, deleted_at).
   Local edits go to an OUTBOX coalesced per row; shadow keeps the last server copy so a denied edit can roll back.
   Backups: JSON (restorable) + Excel (SpreadsheetML, one sheet per table). */
var SignalDB = (function () {
  var KEY = "Throughline_v1", LEGACY = "SignalDoc_v2"; // renamed from Signal Doc; same origin, so carry the data over
  var TABLES = SCHEMA.ORDER;
  var data;
  var listeners = [];

  function blank() { var t = {}; TABLES.forEach(function (n) { t[n] = {}; }); return { tables: t, shadow: {}, outbox: {}, seq: 0, meta: {} }; }
  function load() {
    data = blank();
    try {
      var s = localStorage.getItem(KEY), legacy = false;
      if (!s) { s = localStorage.getItem(LEGACY); legacy = !!s; }
      if (s) { var p = JSON.parse(s); TABLES.forEach(function (n) { if (p.tables && p.tables[n]) data.tables[n] = p.tables[n]; });
        data.shadow = p.shadow || {}; data.outbox = p.outbox || {}; data.seq = p.seq || 0; data.meta = p.meta || {};
        if (legacy) { flushSave(); localStorage.removeItem(LEGACY); } }
    } catch (e) {}
    try { localStorage.removeItem("SignalDoc_v1"); } catch (e) {} // v1 was read-only sample data
  }
  var saveT = null;
  function save() { clearTimeout(saveT); saveT = setTimeout(flushSave, 50); }
  function flushSave() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { console.warn("save failed", e); } }
  function emit(what) { listeners.forEach(function (f) { try { f(what); } catch (e) { console.error(e); } }); }

  function uid() { return (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2, 10); }
  function getAll(t) { return Object.values(data.tables[t] || {}); }
  function get(t, id) { return id == null ? null : (data.tables[t] || {})[id] || null; }
  function where(t, fn) { return getAll(t).filter(fn); }

  // ---- local edits (go to outbox) ----
  function put(t, row, opts) {
    if (!row.id) row.id = uid();
    var prev = get(t, row.id);
    var next = Object.assign({}, prev || {}, row);
    data.tables[t][row.id] = next;
    if (!(opts && opts.noSync)) queue(t, row.id, "upsert");
    save(); emit({ t: t, id: row.id });
    return next;
  }
  function del(t, id) {
    var prev = get(t, id); if (!prev) return;
    delete data.tables[t][id];
    if (prev.rev == null && data.outbox[t + "|" + id]) { delete data.outbox[t + "|" + id]; } // never reached the server
    else queue(t, id, "delete", prev);
    save(); emit({ t: t, id: id });
  }
  function queue(t, id, op, deletedRow) {
    var k = t + "|" + id;
    data.seq++;
    data.outbox[k] = { table: t, id: id, op: op, seq: data.seq, base_rev: (deletedRow || get(t, id) || {}).rev, row: deletedRow ? { id: id } : null };
  }
  function pending() { return Object.values(data.outbox).sort(function (a, b) { return a.seq - b.seq; }); }
  function pendingFor(t, id) { return data.outbox[t + "|" + id] || null; }

  // ---- server application ----
  function applyServer(t, row) {
    if (!data.tables[t]) return;
    var k = t + "|" + row.id;
    data.shadow[k] = row;
    if (data.outbox[k]) return; // local edit pending; server sees it on push (and reports a conflict if stale)
    if (row.deleted_at) delete data.tables[t][row.id]; else data.tables[t][row.id] = row;
  }
  function ack(entry, result) {
    var k = entry.table + "|" + entry.id;
    var cur = data.outbox[k];
    var srv = result.row;
    if (srv) data.shadow[k] = srv;
    if (result.status === "ok") {
      if (cur && cur.seq > entry.seq) { // edited again while in flight: keep local fields, adopt server rev
        if (srv) { var l = get(entry.table, entry.id); if (l) l.rev = srv.rev; cur.base_rev = srv.rev; }
      } else {
        delete data.outbox[k];
        if (srv) { if (srv.deleted_at) delete data.tables[entry.table][entry.id]; else data.tables[entry.table][entry.id] = srv; }
      }
    } else { // conflict | denied | invalid | failed -> server truth wins locally
      delete data.outbox[k];
      var sh = srv || data.shadow[k];
      if (sh && !sh.deleted_at) data.tables[entry.table][entry.id] = sh; else delete data.tables[entry.table][entry.id];
    }
    save();
  }
  // full pull: server set + still-pending local rows; everything else is dropped (permission changes)
  function replaceAll(tables) {
    var keep = {};
    pending().forEach(function (p) { keep[p.table + "|" + p.id] = get(p.table, p.id); });
    var fresh = blank();
    data.tables = fresh.tables; data.shadow = {};
    TABLES.forEach(function (t) { (tables[t] || []).forEach(function (r) { data.shadow[t + "|" + r.id] = r; if (!r.deleted_at) data.tables[t][r.id] = r; }); });
    Object.keys(keep).forEach(function (k) { var p = k.split("|"); if (keep[k]) data.tables[p[0]][p[1]] = keep[k]; });
    save(); emit({ all: true });
  }
  function hasLocalOnlyRows() { return TABLES.some(function (t) { return getAll(t).some(function (r) { return r.rev == null; }); }); }
  function isEmpty() { return getAll("shows").length === 0; }
  function wipe() { data = blank(); flushSave(); emit({ all: true }); }
  function meta(k, v) { if (arguments.length === 1) return data.meta[k]; data.meta[k] = v; save(); }

  // ---- backups ----
  function exportAll() {
    var out = { _meta: { app: "throughline", schema: "v2", exported: new Date().toISOString() } };
    TABLES.forEach(function (t) { out[t] = getAll(t); });
    return out;
  }
  function importAll(obj, opts) {
    var hits = 0;
    TABLES.forEach(function (t) {
      if (!Array.isArray(obj[t])) return; hits++;
      obj[t].forEach(function (r) { if (!r.id) return; var c = Object.assign({}, r); if (!(opts && opts.keepRev)) delete c.rev; put(t, c, { noSync: !(opts && opts.sync) }); });
    });
    if (!hits) throw new Error("No Throughline tables in that file");
    return hits;
  }
  function stamp() { var d = new Date(); return d.toISOString().slice(0, 10) + "-" + String(d.getHours()).padStart(2, "0") + String(d.getMinutes()).padStart(2, "0"); }
  function download(blob, name) {
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
  }
  function downloadJSON() { download(new Blob([JSON.stringify(exportAll(), null, 2)], { type: "application/json" }), "throughline-backup-" + stamp() + ".json"); }
  function x(v) { return String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function downloadXLS() {
    var s = '<?xml version="1.0"?>\n<?mso-application progid="Excel.Sheet"?>\n<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Styles><Style ss:ID="h"><Font ss:Bold="1"/><Interior ss:Color="#D9E1F2" ss:Pattern="Solid"/></Style></Styles>';
    TABLES.forEach(function (t) {
      var rows = getAll(t), cols = [], seen = {};
      rows.forEach(function (r) { Object.keys(r).forEach(function (k) { if (!seen[k]) { seen[k] = 1; cols.push(k); } }); });
      s += '<Worksheet ss:Name="' + x(t.toUpperCase().slice(0, 31)) + '"><Table><Row>' + cols.map(function (c) { return '<Cell ss:StyleID="h"><Data ss:Type="String">' + x(c) + '</Data></Cell>'; }).join("") + '</Row>';
      rows.forEach(function (r) {
        s += '<Row>' + cols.map(function (c) { var v = r[c];
          if (v === null || v === undefined || v === "") return '<Cell/>';
          if (typeof v === "number" && isFinite(v)) return '<Cell><Data ss:Type="Number">' + v + '</Data></Cell>';
          return '<Cell><Data ss:Type="String">' + x(typeof v === "object" ? JSON.stringify(v) : v) + '</Data></Cell>'; }).join("") + '</Row>';
      });
      s += '</Table></Worksheet>';
    });
    download(new Blob([s + '</Workbook>'], { type: "application/vnd.ms-excel" }), "throughline-backup-" + stamp() + ".xls");
  }

  load();
  return {
    TABLES: TABLES, uid: uid, getAll: getAll, get: get, where: where, put: put, del: del,
    pending: pending, pendingFor: pendingFor, applyServer: applyServer, ack: ack, replaceAll: replaceAll,
    hasLocalOnlyRows: hasLocalOnlyRows, isEmpty: isEmpty, wipe: wipe, meta: meta, flush: flushSave,
    exportAll: exportAll, importAll: importAll, downloadJSON: downloadJSON, downloadXLS: downloadXLS,
    on: function (f) { listeners.push(f); }, shadow: function (t, id) { return data.shadow[t + "|" + id] || null; }
  };
})();
