/* db.js — localStorage-backed 14-table normalized database for Signal Documentation System.
   Tables: signal_types, fixture_types, type_interfaces, venues, positions, infrastructure,
   networks, shows, endpoints, units, control_points, network_interfaces, connections, assignments.
   Persistence: localStorage (JSON). Export: full JSON download. Import: JSON file restore. */
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

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
  }

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

  function getAll(table) { return Object.values(data[table] || {}); }
  function get(table, key) { return (data[table] || {})[key] || null; }
  function put(table, row) {
    if (!data[table]) data[table] = {};
    data[table][row[keyFor(table)]] = row;
    save();
  }
  function del(table, key) { if (data[table]) { delete data[table][key]; save(); } }
  function clear(table) { data[table] = {}; save(); }
  function isEmpty() { return Object.keys(data.shows || {}).length === 0; }
  function tables() { return TABLES; }
  function exportAll() {
    var out = {};
    for (var i = 0; i < TABLES.length; i++) out[TABLES[i]] = getAll(TABLES[i]);
    return out;
  }
  function importAll(obj) {
    for (var t in obj) {
      if (!data.hasOwnProperty(t)) continue;
      data[t] = {};
      var rows = obj[t];
      for (var j = 0; j < rows.length; j++) data[t][rows[j][keyFor(t)]] = rows[j];
    }
    save();
  }
  function downloadJSON() {
    var blob = new Blob([JSON.stringify(exportAll(), null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "signal-doc-backup-" + new Date().toISOString().slice(0, 10) + ".json";
    a.click(); URL.revokeObjectURL(a.href);
  }

  load();
  return {
    getAll: getAll, get: get, put: put, del: del, clear: clear,
    isEmpty: isEmpty, tables: tables, exportAll: exportAll, importAll: importAll,
    downloadJSON: downloadJSON, reload: load, save: save, TABLES: TABLES
  };
})();
