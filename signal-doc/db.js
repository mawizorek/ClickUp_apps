/* db.js — localStorage-backed 14-table normalized database for Signal Documentation System.
   Tables: signal_types, fixture_types, type_interfaces, venues, positions, infrastructure,
   networks, shows, endpoints, units, control_points, network_interfaces, connections, assignments.
   Persistence: localStorage (JSON). Backups: JSON download, Excel (SpreadsheetML, one sheet per table).
   Restore: JSON file import. */
var SignalDB = (function () {
  var STORAGE_KEY = "SignalDoc_v1";
  var TABLES = [
    "signal_types","fixture_types","type_interfaces","venues","positions",
    "infrastructure","networks","shows","endpoints","units","control_points",
    "network_interfaces","connections","assignments"
  ];
  var KEY_MAP = { shows: "show_id", units: "unit_id" };
  var data = {};

  function keyFor(table) { return KEY_MAP[table] || "id"; }
  function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); return true; } catch (e) { return false; } }

  function load() {
    for (var i = 0; i < TABLES.length; i++) data[TABLES[i]] = {};
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        var parsed = JSON.parse(saved);
        for (var t in parsed) { if (data.hasOwnProperty(t)) data[t] = parsed[t]; }
      }
    } catch (e) {}
  }
  function wipe() { try { localStorage.removeItem(STORAGE_KEY); } catch (e) {} load(); }

  function getAll(table) { return Object.values(data[table] || {}); }
  function get(table, key) { return (data[table] || {})[key] || null; }
  function put(table, row) { if (!data[table]) data[table] = {}; data[table][row[keyFor(table)]] = row; save(); }
  function del(table, key) { if (data[table]) { delete data[table][key]; save(); } }
  function clear(table) { data[table] = {}; save(); }
  function isEmpty() { return Object.keys(data.shows || {}).length === 0; }
  function tables() { return TABLES; }

  function exportAll() {
    var out = { _meta: { app: "signal-doc", schema: "v1", exported: new Date().toISOString() } };
    for (var i = 0; i < TABLES.length; i++) out[TABLES[i]] = getAll(TABLES[i]);
    return out;
  }
  function importAll(obj) {
    var hits = 0;
    for (var t in obj) {
      if (!data.hasOwnProperty(t) || !Array.isArray(obj[t])) continue;
      data[t] = {}; hits++;
      var rows = obj[t];
      for (var j = 0; j < rows.length; j++) data[t][rows[j][keyFor(t)]] = rows[j];
    }
    if (!hits) throw new Error("No Signal Doc tables in that file");
    save();
    return hits;
  }

  function stamp() { var d = new Date(); return d.toISOString().slice(0, 10) + "-" + String(d.getHours()).padStart(2, "0") + String(d.getMinutes()).padStart(2, "0"); }
  function download(blob, name) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500); // Safari needs the URL alive past click
  }
  function downloadJSON() {
    download(new Blob([JSON.stringify(exportAll(), null, 2)], { type: "application/json" }), "signal-doc-backup-" + stamp() + ".json");
  }

  // Excel 2003 XML Spreadsheet: opens natively in Excel/Numbers, no library, one worksheet per table.
  function x(v) { return String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function downloadXLS() {
    var s = '<?xml version="1.0"?>\n<?mso-application progid="Excel.Sheet"?>\n' +
      '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' +
      '<Styles><Style ss:ID="h"><Font ss:Bold="1"/><Interior ss:Color="#D9E1F2" ss:Pattern="Solid"/></Style></Styles>';
    TABLES.forEach(function (t) {
      var rows = getAll(t), cols = [], seen = {};
      rows.forEach(function (r) { Object.keys(r).forEach(function (k) { if (!seen[k] && k.charAt(0) !== "_") { seen[k] = 1; cols.push(k); } }); });
      s += '<Worksheet ss:Name="' + x(t.toUpperCase().slice(0, 31)) + '"><Table>';
      s += '<Row>' + cols.map(function (c) { return '<Cell ss:StyleID="h"><Data ss:Type="String">' + x(c) + '</Data></Cell>'; }).join("") + '</Row>';
      rows.forEach(function (r) {
        s += '<Row>' + cols.map(function (c) {
          var v = r[c];
          if (v === null || v === undefined || v === "") return '<Cell/>';
          if (typeof v === "number" && isFinite(v)) return '<Cell><Data ss:Type="Number">' + v + '</Data></Cell>';
          if (typeof v === "object") v = JSON.stringify(v);
          return '<Cell><Data ss:Type="String">' + x(v) + '</Data></Cell>';
        }).join("") + '</Row>';
      });
      s += '</Table></Worksheet>';
    });
    s += '</Workbook>';
    download(new Blob([s], { type: "application/vnd.ms-excel" }), "signal-doc-backup-" + stamp() + ".xls");
  }

  load();
  return {
    getAll: getAll, get: get, put: put, del: del, clear: clear, wipe: wipe,
    isEmpty: isEmpty, tables: tables, exportAll: exportAll, importAll: importAll,
    downloadJSON: downloadJSON, downloadXLS: downloadXLS, reload: load, save: save, TABLES: TABLES
  };
})();
