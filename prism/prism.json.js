/* Prism — JSON lens. Exposes window.JSONLens { load, defaultSheet, render }. */
(function () {
  function flatten(obj, prefix, out) {
    out = out || {};
    for (var k in obj) {
      var key = prefix ? prefix + "." + k : k, v = obj[k];
      if (v && typeof v === "object" && !Array.isArray(v)) flatten(v, key, out);
      else if (Array.isArray(v)) {
        if (v.length && v.every(function (x) { return x && typeof x === "object" && !Array.isArray(x); }))
          v.forEach(function (x, i) { flatten(x, key + "[" + i + "]", out); });
        else out[key] = v.map(function (x) { return (x && typeof x === "object") ? JSON.stringify(x) : x; }).join("; ");
      } else out[key] = v;
    }
    return out;
  }
  function maxDepth(v, d) { d = d || 1; if (!v || typeof v !== "object") return d; var m = d; for (var k in v) { var c = maxDepth(v[k], d + 1); if (c > m) m = c; } return m; }
  function findSheets(data) {
    var sheets = [];
    if (Array.isArray(data) && data.length && data.every(function (x) { return x && typeof x === "object"; })) {
      sheets.push({ name: "root", rows: data.map(function (r) { return flatten(r, "", {}); }) }); return sheets;
    }
    if (data && typeof data === "object" && !Array.isArray(data)) {
      var scalars = {};
      for (var k in data) {
        var v = data[k];
        if (Array.isArray(v) && v.length && v.every(function (x) { return x && typeof x === "object" && !Array.isArray(x); }))
          sheets.push({ name: k, rows: v.map(function (r) { return flatten(r, "", {}); }) });
        else scalars[k] = v;
      }
      if (Object.keys(scalars).length) sheets.unshift({ name: "(root)", rows: [flatten(scalars, "", {})] });
      if (!sheets.length) sheets.push({ name: "(root)", rows: [flatten(data, "", {})] });
      return sheets;
    }
    return [{ name: "(value)", rows: [{ value: data }] }];
  }
  function flatSingle(data) {
    if (Array.isArray(data) && data.length && data.every(function (x) { return x && typeof x === "object"; }))
      return { name: "flat", rows: data.map(function (r) { return flatten(r, "", {}); }) };
    return { name: "flat", rows: [flatten(data, "", {})] };
  }
  function columnsOf(rows) { var set = [], seen = {}; rows.forEach(function (r) { for (var k in r) { if (!seen[k]) { seen[k] = 1; set.push(k); } } }); return set; }

  function analyze(data) {
    var flags = [], isArr = Array.isArray(data);
    var rootArrObj = isArr && data.length && data.every(function (x) { return x && typeof x === "object" && !Array.isArray(x); });
    var depth = maxDepth(data), sheets = findSheets(data);
    var recordCount = rootArrObj ? data.length : sheets.reduce(function (a, s) { return a + s.rows.length; }, 0);
    var cols = columnsOf((sheets[S.activeSheet] || sheets[0]).rows);
    if (rootArrObj || sheets.some(function (s) { return s.rows.length > 1; })) {
      var target = rootArrObj ? data.map(function (r) { return flatten(r, "", {}); }) : ((sheets.filter(function (s) { return s.rows.length > 1; })[0] || {}).rows || []);
      if (target.length > 1) {
        var all = columnsOf(target), missing = [];
        all.forEach(function (c) { var n = target.filter(function (r) { return !(c in r); }).length; if (n > 0) missing.push({ c: c, n: n }); });
        if (missing.length) {
          var worst = missing.sort(function (a, b) { return b.n - a.n; }).slice(0, 2).map(function (m) { return '"' + m.c + '" (' + m.n + " missing)"; }).join(", ");
          flags.push({ sev: "warn", b: "Irregular schema", fx: missing.length + " field(s) not present in every record: " + worst + ". Blank cells on export." });
        }
        all.forEach(function (c) {
          var types = {}, tc = 0, numStr = 0, present = 0;
          target.forEach(function (r) { if (c in r && r[c] !== null) { present++; if (!types[typeof r[c]]) { types[typeof r[c]] = 1; tc++; } if (typeof r[c] === "string" && r[c] !== "" && !isNaN(r[c])) numStr++; } });
          if (tc > 1) flags.push({ sev: "warn", b: "Mixed types", fx: 'Column "' + c + '" mixes ' + Object.keys(types).join(" + ") + ". Excel may coerce." });
          else if (numStr > 0 && numStr === present) flags.push({ sev: "info", b: "Numbers as text", fx: 'Column "' + c + '" holds numeric values stored as strings.' });
        });
      }
    }
    if (depth >= 4) flags.push({ sev: "warn", b: "Deep nesting", fx: depth + ' levels deep. Flattened columns get long dot-paths; consider "split by table".' });
    else if (depth >= 3) flags.push({ sev: "info", b: "Nested data", fx: depth + " levels. Nested objects flatten into dot-notation columns." });
    var tableCount = sheets.filter(function (s) { return s.rows.length > 1; }).length;
    if (tableCount > 1) flags.push({ sev: "info", b: "Multiple tables", fx: tableCount + " nested arrays detected. Each gets its own sheet." });
    var cells = 0, nulls = 0;
    (sheets[0].rows || []).forEach(function (r) { for (var k in r) { cells++; if (r[k] === null || r[k] === "" || r[k] === undefined) nulls++; } });
    if (cells && nulls / cells > 0.3) flags.push({ sev: "info", b: "Sparse data", fx: Math.round(nulls / cells * 100) + "% of cells are empty or null." });
    if (S.raw.length > 500000) flags.push({ sev: "warn", b: "Large file", fx: (S.raw.length / 1024 / 1024).toFixed(1) + "MB. Table preview may lag; virtualized rows are a v2 item." });
    return { depth: depth, recordCount: recordCount, cols: cols.length, sheets: sheets, tableCount: tableCount, isArr: isArr, rootArrObj: rootArrObj, flags: flags };
  }

  function renderStats() {
    var a = S.analysis;
    var rows = [["Type", a.rootArrObj ? "array of objects" : (a.isArr ? "array" : "object")], ["Records", a.recordCount], ["Columns (this table)", a.cols], ["Nesting depth", a.depth], ["Tables detected", Math.max(1, a.tableCount)], ["Size", (S.raw.length / 1024).toFixed(1) + " KB"]];
    $("#stats").innerHTML = rows.map(function (r) { return '<div class="stat-row"><span class="k">' + r[0] + '</span><span class="v">' + r[1] + "</span></div>"; }).join("");
    var f = $("#flags");
    if (!a.flags.length) { f.innerHTML = "<h3>Flags</h3><div class=\"no-flags\">" + IC.ok + " Clean. Nothing weird detected.</div>"; return; }
    f.innerHTML = "<h3>Flags \u00b7 " + a.flags.length + "</h3>" + a.flags.map(function (fl) { return '<div class="flag ' + fl.sev + '">' + IC[fl.sev === "warn" ? "warn" : "info"] + "<div><b>" + fl.b + ".</b> <span class=\"fx\">" + esc(fl.fx) + "</span></div></div>"; }).join("");
  }
  function currentSheets() { var split = $("#flatMode") ? $("#flatMode").checked : true; return split ? S.analysis.sheets : [flatSingle(S.data)]; }
  function defaultSheet() { var sheets = currentSheets(), mi = 0; sheets.forEach(function (s, i) { if (s.rows.length > sheets[mi].rows.length) mi = i; }); return mi; }

  function renderTable() {
    var sheets = currentSheets();
    if (S.activeSheet >= sheets.length) S.activeSheet = 0;
    var c = $("#content"), incNull = $("#incNull") ? $("#incNull").checked : true, tabs = "";
    if (sheets.length > 1) tabs = '<div class="sheet-tabs">' + sheets.map(function (s, i) { return '<button class="sheet-tab ' + (i === S.activeSheet ? "active" : "") + '" data-i="' + i + '">' + esc(s.name) + '<span class="c">' + s.rows.length + "</span></button>"; }).join("") + "</div>";
    var sheet = sheets[S.activeSheet], cols = columnsOf(sheet.rows), body = "";
    if (sheet.rows.length === 1) {
      var r = sheet.rows[0];
      body += '<div class="pivot-note">' + IC.pivot + "<span>Single record, pivoted for reading. Exports as one row.</span></div>";
      body += '<div class="tbl-wrap"><table class="pivot"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody>';
      cols.forEach(function (col) {
        var v = r[col], cell, t = "text";
        if (v === undefined || v === null || v === "") cell = incNull ? '<span class="null">null</span>' : "";
        else if (typeof v === "number") { cell = '<span class="num">' + v + "</span>"; t = "number"; }
        else if (typeof v === "boolean") { cell = '<span class="bool">' + v + "</span>"; t = "bool"; }
        else cell = esc(v);
        body += '<tr><td class="pivot-key">' + esc(col) + '<span class="pt">' + t + '</span></td><td title="' + (v != null ? esc(v) : "") + '">' + cell + "</td></tr>";
      });
      body += "</tbody></table></div>";
    } else {
      body += '<div class="tbl-wrap"><table><thead><tr><th class="rownum">#</th>' + cols.map(function (col) {
        var t = "text", vals = sheet.rows.map(function (r) { return r[col]; }).filter(function (v) { return v !== undefined && v !== null && v !== ""; });
        if (vals.length && vals.every(function (v) { return typeof v === "number"; })) t = "number";
        else if (vals.length && vals.every(function (v) { return typeof v === "boolean"; })) t = "bool";
        return "<th>" + esc(col) + '<span class="type">' + t + "</span></th>";
      }).join("") + "</tr></thead><tbody>";
      sheet.rows.forEach(function (r, i) {
        body += '<tr><td class="rownum">' + (i + 1) + "</td>" + cols.map(function (col) {
          var v = r[col];
          if (v === undefined || v === null || v === "") return "<td>" + (incNull ? '<span class="null">null</span>' : "") + "</td>";
          if (typeof v === "number") return '<td><span class="num">' + v + "</span></td>";
          if (typeof v === "boolean") return '<td><span class="bool">' + v + "</span></td>";
          return '<td title="' + esc(v) + '">' + esc(v) + "</td>";
        }).join("") + "</tr>";
      });
      body += "</tbody></table></div>";
    }
    c.innerHTML = tabs + body;
    c.querySelectorAll(".sheet-tab").forEach(function (b) { b.onclick = function () { S.activeSheet = +b.dataset.i; renderTable(); }; });
  }
  function treeHTML(v, key) {
    var t = typeOf(v);
    if (t === "object" || t === "array") {
      var entries = t === "array" ? v.map(function (x, i) { return [i, x]; }) : Object.entries(v);
      var label = key !== null ? '<span class="key">' + esc(key) + "</span>: " : "";
      var brace = t === "array" ? '[<span class="count">' + entries.length + "</span>]" : '{<span class="count">' + entries.length + "</span>}";
      return "<details open><summary>" + label + brace + "</summary>" + entries.map(function (e) { return "<div>" + treeHTML(e[1], e[0]) + "</div>"; }).join("") + "</details>";
    }
    var lab = key !== null ? '<span class="key">' + esc(key) + "</span>: " : "", cls = "str", disp;
    if (t === "number") { cls = "num"; disp = v; } else if (t === "boolean") { cls = "bool"; disp = v; } else if (t === "null") { cls = "nul"; disp = "null"; } else disp = '"' + esc(v) + '"';
    return '<div class="leaf">' + lab + '<span class="' + cls + '">' + disp + "</span></div>";
  }

  function buildCSV(sheet, delim) {
    var cols = columnsOf(sheet.rows), incNull = $("#incNull") ? $("#incNull").checked : true;
    function q(s) { s = (s === null || s === undefined) ? "" : String(s); return /[",\n\t]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
    var head = cols.map(q).join(delim);
    var body = sheet.rows.map(function (r) { return cols.map(function (c) { var v = r[c]; if ((v === null || v === undefined) && !incNull) v = ""; return q(v); }).join(delim); }).join("\n");
    return head + "\n" + body;
  }
  function exportCSV() { var sheets = currentSheets(), sheet = sheets[S.activeSheet]; download((S.fname.replace(/\.[^.]+$/, "") || "data") + (sheets.length > 1 ? "-" + sheet.name : "") + ".csv", buildCSV(sheet, S.delim === "\t" ? "\t" : S.delim), "text/csv"); toast("CSV exported"); }
  function exportExcel() {
    var sheets = currentSheets();
    var tables = sheets.map(function (sheet) { var cols = columnsOf(sheet.rows); return '<table border="1"><tr>' + cols.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") + "</tr>" + sheet.rows.map(function (r) { return "<tr>" + cols.map(function (c) { var v = r[c]; return "<td>" + (v === null || v === undefined ? "" : esc(v)) + "</td>"; }).join("") + "</tr>"; }).join("") + "</table>"; }).join("<br>");
    var html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body>' + tables + "</body></html>";
    download((S.fname.replace(/\.[^.]+$/, "") || "data") + ".xls", html, "application/vnd.ms-excel"); toast("Excel file exported");
  }

  window.JSONLens = {
    load: function () {
      var data;
      try { data = JSON.parse(S.raw); }
      catch (e) {
        $("#content").innerHTML = '<div class="errbox">' + IC.err + "<div><b>That's not valid JSON.</b><br>" + esc(e.message) + "</div></div>";
        $("#stats").innerHTML = ""; $("#flags").innerHTML = ""; $("#viewSeg").innerHTML = ""; $("#exportbar").innerHTML = ""; $("#fmeta").textContent = "parse error"; return false;
      }
      S.data = data; S.analysis = analyze(data);
      $("#fmeta").textContent = S.analysis.recordCount + " records \u00b7 depth " + S.analysis.depth;
      $("#side").style.display = "";
      renderStats();
      $("#viewSeg").innerHTML = '<button data-v="table">Table</button><button data-v="tree">Tree</button><button data-v="raw">Raw</button>';
      $("#exportbar").innerHTML =
        '<span class="lbl">Flatten</span>' +
        '<label class="toggle"><input type="checkbox" id="flatMode" checked><span>Split by table</span></label>' +
        '<label class="toggle"><input type="checkbox" id="incNull" checked><span>Show nulls</span></label>' +
        '<div class="spacer" style="margin-left:auto"></div>' +
        '<button class="btn" id="copyBtn">' + IC.copy + 'Copy JSON</button>' +
        '<button class="btn" id="csvBtn">' + IC.csv + 'Export CSV</button>' +
        '<button class="btn primary" id="xlsBtn">' + IC.xls + 'Export Excel</button>';
      $("#flatMode").onchange = function () { S.activeSheet = defaultSheet(); renderStats(); if (S.view === "table") renderTable(); };
      $("#incNull").onchange = function () { if (S.view === "table") renderTable(); };
      $("#copyBtn").onclick = function () { navigator.clipboard.writeText(JSON.stringify(S.data, null, 2)); toast("JSON copied"); };
      $("#csvBtn").onclick = exportCSV;
      $("#xlsBtn").onclick = exportExcel;
      document.querySelectorAll("#viewSeg button").forEach(function (b) { b.onclick = function () { setView(b.dataset.v); }; });
      return true;
    },
    defaultSheet: defaultSheet,
    render: function (v) { if (v === "table") renderTable(); else if (v === "tree") $("#content").innerHTML = '<div class="tree">' + treeHTML(S.data, null) + "</div>"; else $("#content").innerHTML = '<pre class="raw">' + esc(JSON.stringify(S.data, null, 2)) + "</pre>"; }
  };
})();
