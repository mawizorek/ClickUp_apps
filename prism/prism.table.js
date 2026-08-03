/* Prism — Table lens · ENGINE.
   Parse, data gates, model, diff, sort order, pin order, serialisation, registration.

   Split three ways by concern; one 30.4KB module blew the source-size budget
   and could not be read whole, which means it could not be safely edited:
     prism.table.js         — this file: data engine + lens registration
     prism.table.grid.js    — the editable grid
     prism.table.panels.js  — swatch bands, sidebar, export bar

   Column identity is a stable key (col.k), NEVER the display name. Renaming a
   column must not orphan its diff — or its pin. */
(function () {
  "use strict";

  var RE6 = /^#[0-9a-f]{6}$/i, RE3 = /^#[0-9a-f]{3}$/i,
      RE8 = /^#[0-9a-f]{8}$/i, REU = /^https?:\/\/\S+$/i;
  var UID = 0, KEY = 0;
  var TB = window.TB = { T: null };

  TB.newKey = function () { return "k" + (++KEY); };
  TB.newId = function () { return ++UID; };

  /* ---------------- parse ---------------- */
  TB.sniff = function (t) {
    var l = t.split("\n")[0] || "";
    var tb = (l.match(/\t/g) || []).length,
        cm = (l.match(/,/g) || []).length,
        sc = (l.match(/;/g) || []).length;
    if (tb && tb >= cm && tb >= sc) return "\t";
    return sc > cm ? ";" : ",";
  };
  TB.parse = function (t, d) {
    t = t.replace(/\r\n?/g, "\n");
    if (t.charCodeAt(0) === 0xFEFF) t = t.slice(1);
    var rows = [], row = [], cur = "", q = false, i = 0;
    while (i < t.length) {
      var c = t.charAt(i);
      if (q) {
        if (c === '"') {
          if (t.charAt(i + 1) === '"') { cur += '"'; i += 2; continue; }
          q = false; i++; continue;
        }
        cur += c; i++; continue;
      }
      if (c === '"' && cur === "") { q = true; i++; continue; }
      if (c === d) { row.push(cur); cur = ""; i++; continue; }
      if (c === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; i++; continue; }
      cur += c; i++;
    }
    if (cur !== "" || row.length) { row.push(cur); rows.push(row); }
    return rows.filter(function (r) { return r.length > 1 || (r[0] || "").trim() !== ""; });
  };

  /* ---------------- data gates ---------------- */
  TB.gate = function (v) {
    var s = v == null ? "" : String(v).trim();
    if (!s) return "empty";
    if (RE6.test(s) || RE3.test(s) || RE8.test(s)) return "hex";
    if (REU.test(s)) return "url";
    return "text";
  };
  TB.hx6 = function (s) {
    s = String(s).trim();
    if (RE3.test(s)) return ("#" + s[1] + s[1] + s[2] + s[2] + s[3] + s[3]).toLowerCase();
    return s.slice(0, 7).toLowerCase();
  };
  /* An 8-digit hex carries alpha the OS colour picker cannot see or return.
     Read it off before a pick and glue it back on after, or picking silently
     destroys the channel. */
  TB.alpha = function (s) { s = String(s).trim(); return RE8.test(s) ? s.slice(7, 9) : ""; };
  TB.lum = function (s) {
    var c = TB.hx6(s).slice(1);
    return 0.2126 * parseInt(c.substr(0, 2), 16) / 255 +
           0.7152 * parseInt(c.substr(2, 2), 16) / 255 +
           0.0722 * parseInt(c.substr(4, 2), 16) / 255;
  };

  /* ---------------- model ---------------- */
  TB.sig = function (cols) {
    return cols.map(function (c) { return c.k + "" + c.name; }).join("\u0001");
  };
  TB.build = function (names, matrix, fmt, delim) {
    var cols = names.map(function (n) { return { k: TB.newKey(), name: n }; });
    var rows = matrix.map(function (m) {
      var c = {};
      cols.forEach(function (col, i) { c[col.k] = m[i] == null ? "" : m[i]; });
      return { id: TB.newId(), c: c };
    });
    var orig = {};
    rows.forEach(function (r) { var o = {}; for (var k in r.c) o[k] = r.c[k]; orig[r.id] = o; });
    return {
      cols: cols, baseSig: TB.sig(cols), rows: rows, orig: orig,
      origIds: rows.map(function (r) { return r.id; }),
      fmt: fmt, delim: delim, sortK: null, sortDir: 0, sel: null,
      pinned: [], view: "table", hl: false, expSorted: false, order: null
    };
  };
  TB.byId = function (id) {
    var R = TB.T.rows;
    for (var i = 0; i < R.length; i++) if (R[i].id === id) return R[i];
    return null;
  };
  TB.colOf = function (k) {
    var C = TB.T.cols;
    for (var i = 0; i < C.length; i++) if (C[i].k === k) return C[i];
    return null;
  };

  /* ---------------- pinned columns ----------------
     A VIEW concern, exactly like sort. `T.cols` stays the canonical export
     order and is never reordered by a pin; only the grid reads displayCols().
     Pins are held as stable keys, so renaming a pinned column keeps its pin. */
  TB.isPinned = function (k) { return TB.T.pinned.indexOf(k) >= 0; };
  TB.pin = function (k) { if (!TB.isPinned(k)) TB.T.pinned.push(k); };
  TB.unpin = function (k) {
    var i = TB.T.pinned.indexOf(k);
    if (i >= 0) TB.T.pinned.splice(i, 1);
  };
  /* Pinned first, in the order they were pinned, then everything else in
     canonical order. */
  TB.displayCols = function () {
    var T = TB.T;
    if (!T.pinned.length) return T.cols.slice();
    var head = [];
    T.pinned.forEach(function (k) { var c = TB.colOf(k); if (c) head.push(c); });
    var tail = T.cols.filter(function (c) { return !TB.isPinned(c.k); });
    return head.concat(tail);
  };

  /* ---------------- diff ---------------- */
  TB.dirty = function (r, k) {
    var o = TB.T.orig[r.id];
    if (!o || !(k in o)) return false;
    return String(o[k]) !== String(r.c[k] == null ? "" : r.c[k]);
  };
  TB.diff = function () {
    var T = TB.T, cells = 0, added = 0, live = {};
    T.rows.forEach(function (r) {
      live[r.id] = 1;
      if (!T.orig[r.id]) { added++; return; }
      T.cols.forEach(function (col) { if (TB.dirty(r, col.k)) cells++; });
    });
    var removed = T.origIds.filter(function (id) { return !live[id]; }).length;
    var colsChanged = TB.sig(T.cols) !== T.baseSig;
    return {
      cells: cells, added: added, removed: removed, colsChanged: colsChanged,
      any: cells > 0 || added > 0 || removed > 0 || colsChanged
    };
  };
  TB.revert = function () {
    var T = TB.T;
    T.rows = T.origIds.map(function (id) {
      var o = T.orig[id], c = {};
      for (var k in o) c[k] = o[k];
      return { id: id, c: c };
    });
    T.sel = null; T.hl = false;
    TB.invalidate();
  };

  /* ---------------- display order ----------------
     Frozen between explicit sorts. Editing a cell must not resort the table
     out from under the cursor, so the order is cached as a list of row ids and
     only invalidated by a sort click or a row add/remove. */
  TB.invalidate = function () { TB.T.order = null; };
  TB.ordered = function () {
    var T = TB.T;
    if (!T.order) {
      var rs = T.rows.slice();
      if (T.sortDir && T.sortK) {
        var k = T.sortK, dir = T.sortDir === 1 ? 1 : -1;
        rs.sort(function (a, b) {
          var x = a.c[k] == null ? "" : String(a.c[k]),
              y = b.c[k] == null ? "" : String(b.c[k]);
          if (x === "" && y !== "") return 1;
          if (y === "" && x !== "") return -1;
          var nx = parseFloat(x), ny = parseFloat(y);
          if (!isNaN(nx) && !isNaN(ny) && String(nx) === x.trim() && String(ny) === y.trim()) return (nx - ny) * dir;
          return x.localeCompare(y, undefined, { numeric: true, sensitivity: "base" }) * dir;
        });
      }
      T.order = rs.map(function (r) { return r.id; });
    }
    return T.order.map(TB.byId).filter(Boolean);
  };

  /* ---------------- column helpers ---------------- */
  TB.colStat = function (k) {
    var n = { hex: 0, url: 0, empty: 0, text: 0 }, tot = TB.T.rows.length;
    TB.T.rows.forEach(function (r) { n[TB.gate(r.c[k])]++; });
    if (tot && n.hex === tot) return "<b>" + tot + "/" + tot + "</b> hex";
    var p = [];
    if (n.hex) p.push("<b>" + n.hex + "</b> hex");
    if (n.url) p.push("<b>" + n.url + "</b> url");
    if (n.text) p.push(n.text + " text");
    if (n.empty) p.push(n.empty + " empty");
    return p.join(" \u00b7 ") || "\u2014";
  };
  TB.bgKey = function () {
    var C = TB.T.cols;
    for (var i = 0; i < C.length; i++) if (C[i].name.trim().toLowerCase() === "bg") return C[i].k;
    return null;
  };
  TB.labelKey = function () {
    var C = TB.T.cols, pref = ["name", "label", "title", "slug", "id"];
    for (var p = 0; p < pref.length; p++)
      for (var i = 0; i < C.length; i++)
        if (C[i].name.trim().toLowerCase() === pref[p]) return C[i].k;
    for (var j = 0; j < C.length; j++) {
      var k = C[j].k;
      if (TB.T.rows.length && TB.T.rows.every(function (r) { return TB.gate(r.c[k]) === "text"; })) return k;
    }
    return C.length ? C[0].k : null;
  };
  /* Conditional enhancement: any file carrying a column literally named `bg`
     whose cells are hex gets its rows tinted to their own background. */
  TB.tintOf = function (r) {
    var t = document.getElementById("rowTint");
    if (!t || !t.checked) return null;
    var bk = TB.bgKey();
    if (!bk || TB.gate(r.c[bk]) !== "hex") return null;
    var bg = TB.hx6(r.c[bk]);
    return { bg: bg, fg: TB.lum(bg) > 0.5 ? "oklch(0.2 0.02 265)" : "oklch(0.96 0.01 265)" };
  };

  /* ---------------- serialise ----------------
     Always walks T.cols, never displayCols(): a pin is a reading aid and must
     not silently reorder the columns of the file you export. */
  function outRows() { return TB.T.expSorted ? TB.ordered() : TB.T.rows; }
  TB.toDelim = function (d) {
    function q(s) {
      s = s == null ? "" : String(s);
      return (s.indexOf(d) >= 0 || s.indexOf("\n") >= 0 || s.indexOf('"') >= 0)
        ? '"' + s.replace(/"/g, '""') + '"' : s;
    }
    var C = TB.T.cols;
    return [C.map(function (c) { return q(c.name); }).join(d)].concat(
      outRows().map(function (r) { return C.map(function (c) { return q(r.c[c.k]); }).join(d); })
    ).join("\n");
  };
  TB.toJSON = function () {
    var C = TB.T.cols;
    return JSON.stringify(outRows().map(function (r) {
      var o = {};
      C.forEach(function (c) { o[c.name] = r.c[c.k] == null ? "" : r.c[c.k]; });
      return o;
    }), null, 2);
  };
  /* Excel-compatible HTML table, same trick the JSON lens uses. Present so a
     flat-array .json opened here loses nothing by not going to that lens.
     A true .xlsx via SheetJS is still the open roadmap item. */
  TB.toXLS = function () {
    var C = TB.T.cols;
    var head = "<tr>" + C.map(function (c) { return "<th>" + esc(c.name) + "</th>"; }).join("") + "</tr>";
    var body = outRows().map(function (r) {
      return "<tr>" + C.map(function (c) { return "<td>" + esc(r.c[c.k] == null ? "" : r.c[c.k]) + "</td>"; }).join("") + "</tr>";
    }).join("");
    return '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">' +
      '<head><meta charset="utf-8"></head><body><table border="1">' + head + body + "</table></body></html>";
  };

  /* ---------------- detection ---------------- */
  function flatArray(t) {
    if (t.charAt(0) !== "[") return null;
    var d;
    try { d = JSON.parse(t); } catch (e) { return null; }
    if (!Array.isArray(d) || !d.length) return null;
    var ok = d.every(function (x) {
      return x && typeof x === "object" && !Array.isArray(x) &&
        Object.keys(x).every(function (k) { var v = x[k]; return v === null || typeof v !== "object"; });
    });
    return ok ? d : null;
  }

  function fail(msg) {
    $("#content").innerHTML = '<div class="errbox">' + IC.err +
      "<div><b>Cannot open this as a table.</b><br>" + msg + "</div></div>";
    $("#stats").innerHTML = "";
    $("#flags").innerHTML = "";
    $("#viewSeg").innerHTML = "";
    $("#exportbar").innerHTML = "";
    $("#fmeta").textContent = "parse error";
  }

  /* ---------------- lens registration ----------------
     Pushed onto a plain queue so load order stays free: this file loads before
     core.js, and core drains the queue at init. */
  (window.PrismLenses = window.PrismLenses || []).push({
    id: "table",
    label: "TABLE",
    accent: "var(--tbl)",
    priority: 10,
    detect: function (name, text) {
      if (/\.(tsv|csv|tab)$/i.test(name)) return true;
      var t = text.trim();
      if (flatArray(t)) return true;
      /* .txt / extensionless: claim ONLY tab-delimited. Commas are far too
         common in prose to justify stealing a file from the Markdown lens. */
      if (/\.txt$/i.test(name) || !/\.\w+$/.test(name)) {
        var lines = t.split("\n").filter(function (l) { return l.trim(); });
        if (lines.length >= 3 && lines[0].indexOf("\t") >= 0) {
          var n = lines[0].split("\t").length;
          if (n > 1 && lines.slice(0, 5).every(function (l) { return l.split("\t").length === n; })) return true;
        }
      }
      return false;
    },
    load: function () {
      var raw = S.raw.trim();
      if (!raw) { fail("The file is empty. Nothing to open."); return false; }
      var arr = flatArray(raw);
      if (arr) {
        var cols = [], seen = {};
        arr.forEach(function (o) {
          Object.keys(o).forEach(function (k) { if (!seen[k]) { seen[k] = 1; cols.push(k); } });
        });
        if (!cols.length) { fail("The JSON array has no fields to show."); return false; }
        TB.T = TB.build(cols, arr.map(function (o) {
          return cols.map(function (k) { return o[k] == null ? "" : String(o[k]); });
        }), "json", ",");
      } else {
        var d = /\.csv$/i.test(S.fname) ? ","
              : (/\.(tsv|tab)$/i.test(S.fname) ? "\t" : TB.sniff(raw));
        var m = TB.parse(raw, d);
        if (m.length < 2) { fail("Only found a header row. Nothing to edit."); return false; }
        var fix = {};
        var head = m[0].map(function (h, i) {
          h = String(h).trim() || "column " + (i + 1);
          if (fix[h]) { fix[h]++; return h + " (" + fix[h] + ")"; }
          fix[h] = 1;
          return h;
        });
        TB.T = TB.build(head, m.slice(1), d === "," || d === ";" ? "csv" : "tsv", d);
      }
      S.table = TB.T;
      $("#side").style.display = "";
      $("#viewSeg").innerHTML =
        '<button type="button" data-v="table">Table</button>' +
        '<button type="button" data-v="bands">Swatches</button>' +
        '<button type="button" data-v="raw">Raw</button>';
      return true;
    },
    defaultView: "table",
    render: function (v) { TB.T = S.table; TB.T.view = v; TBUI.full(); },
    onSetting: function () { if (TB.T) TBUI.full(); }
  });
})();
