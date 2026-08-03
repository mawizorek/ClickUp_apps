/* Prism — Table lens · PANELS.
   Swatch band view, structure sidebar, export bar and row operations.
   Engine: prism.table.js (TB). Grid: prism.table.grid.js (TBUI.grid). */
(function () {
  "use strict";

  var TBUI = window.TBUI = window.TBUI || {};

  /* ---------------- swatch bands ----------------
     One row per band, tinted to its own bg, every hex cell a live picker.
     This is the view that makes a palette file readable as colour rather than
     as several hundred strings. */
  TBUI.bands = function () {
    var T = TB.T;
    var hexCols = T.cols.filter(function (col) {
      return T.rows.some(function (r) { return TB.gate(r.c[col.k]) === "hex"; });
    });
    if (!hexCols.length) {
      $("#content").innerHTML = '<div class="errbox">' + IC.err +
        "<div><b>No colour values in this file.</b><br>Swatches has something to draw only when at least one cell holds a hex code. Switch back to Table.</div></div>";
      return;
    }
    var lk = TB.labelKey();
    var h = '<div id="diffHost"></div><div class="bands">';
    TB.ordered().forEach(function (r) {
      var t = TB.tintOf(r);
      var n = hexCols.filter(function (col) { return TB.gate(r.c[col.k]) === "hex"; }).length;
      h += '<div class="band" data-r="' + r.id + '"' +
        (t ? ' style="background:' + t.bg + ";color:" + t.fg + ";border-color:" +
             (TB.lum(t.bg) > 0.5 ? "oklch(0.55 0 0)" : "oklch(0.42 0 0)") + '"' : "") +
        '><div class="band-head"><span class="band-name">' +
        esc(lk ? (r.c[lk] || "(untitled)") : "(row)") +
        '</span><span class="band-sub">' + n + " colours" + (t ? " \u00b7 tinted by bg" : "") +
        '</span></div><div class="chips">';
      hexCols.forEach(function (col) {
        if (TB.gate(r.c[col.k]) !== "hex") return;
        h += '<span class="chip"><input type="color" class="sw" value="' + TB.hx6(r.c[col.k]) +
          '" data-r="' + r.id + '" data-k="' + col.k + '" aria-label="' + esc(col.name) +
          '"><span class="chip-k">' + esc(col.name) + "</span></span>";
      });
      h += "</div></div>";
    });
    $("#content").innerHTML = h + "</div>";

    $("#content").querySelectorAll('input[type="color"].sw').forEach(function (inp) {
      var rid = +inp.dataset.r, k = inp.dataset.k;
      function apply() {
        TBUI.setHex(rid, k, inp.value);
        var band = document.querySelector('.band[data-r="' + rid + '"]'), r = TB.byId(rid);
        if (band && r && TB.bgKey() === k) {
          var t = TB.tintOf(r);
          band.style.background = t ? t.bg : "";
          band.style.color = t ? t.fg : "";
        }
        TBUI.paintDiff();
        TBUI.side();
      }
      inp.oninput = apply;
      inp.onchange = apply;
    });
    TBUI.paintDiff();
  };

  /* ---------------- structure sidebar ---------------- */
  TBUI.side = function () {
    var T = TB.T, hex = 0, empty = 0, url = 0;
    var tot = T.rows.length * T.cols.length;
    T.rows.forEach(function (r) {
      T.cols.forEach(function (col) {
        var g = TB.gate(r.c[col.k]);
        if (g === "hex") hex++;
        else if (g === "empty") empty++;
        else if (g === "url") url++;
      });
    });
    var rows = [
      ["Source", T.fmt.toUpperCase()],
      ["Rows", T.rows.length],
      ["Columns", T.cols.length],
      ["Cells", tot],
      ["Colour cells", hex],
      ["Empty cells", empty]
    ];
    $("#stats").innerHTML = rows.map(function (r) {
      return '<div class="stat-row"><span class="k">' + r[0] + '</span><span class="v">' + r[1] + "</span></div>";
    }).join("");

    var f = [];
    if (hex) f.push({ s: "info", b: "Colour data", x: hex + " of " + tot + " cells are hex codes. Swatches renders them as bands." });
    if (TB.bgKey()) f.push({ s: "info", b: "bg column found", x: "Rows are tinted to their own background colour. Toggle it in Settings." });
    if (url) f.push({ s: "info", b: "Links", x: url + " cell(s) hold URLs and open in a new tab." });
    var seen = {}, dup = 0;
    T.cols.forEach(function (c) { if (seen[c.name]) dup++; seen[c.name] = 1; });
    if (dup) f.push({ s: "warn", b: "Duplicate headers", x: dup + " repeated column name(s). A JSON export keeps only the last of each." });
    if (tot && empty / tot > 0.3) f.push({ s: "info", b: "Sparse data", x: Math.round(empty / tot * 100) + "% of cells are empty." });
    if (T.rows.length > 800) f.push({ s: "warn", b: "Large table", x: T.rows.length + " rows render un-virtualised. Editing may feel sluggish." });

    var el = $("#flags");
    if (!f.length) {
      el.innerHTML = '<h3>Flags</h3><div class="no-flags">' + IC.ok + " Clean. Nothing weird detected.</div>";
      return;
    }
    el.innerHTML = "<h3>Flags \u00b7 " + f.length + "</h3>" + f.map(function (fl) {
      return '<div class="flag ' + fl.s + '">' + IC[fl.s === "warn" ? "warn" : "info"] +
        "<div><b>" + fl.b + ".</b> <span class=\"fx\">" + esc(fl.x) + "</span></div></div>";
    }).join("");
  };

  /* ---------------- export bar ----------------
     Row buttons carry .rbtn, NOT .btn. prism.mobile.js stretches every .btn in
     this bar to full width and closes the bottom sheet when one is tapped;
     Add/Duplicate/Delete must do neither. */
  TBUI.bar = function () {
    var T = TB.T, sel = T.sel != null ? TB.byId(T.sel) : null;
    $("#exportbar").innerHTML =
      '<div class="rowops"><span class="lbl">Row</span>' +
      '<button type="button" class="rbtn" id="rAdd">Add</button>' +
      '<button type="button" class="rbtn" id="rDup"' + (sel ? "" : " disabled") + ">Duplicate</button>" +
      '<button type="button" class="rbtn danger" id="rDel"' + (sel ? "" : " disabled") + ">Delete</button>" +
      '<span class="hint">' + (sel ? "row selected" : "click a row number") + "</span></div>" +
      '<div class="spacer"></div>' +
      '<label class="toggle"><input type="checkbox" id="expSorted"' + (T.expSorted ? " checked" : "") +
      '><span>Export sorted order</span></label>' +
      '<select class="mini-sel" id="expFmt" aria-label="Export format">' +
      '<option value="tsv">TSV</option><option value="csv">CSV</option>' +
      '<option value="json">JSON</option><option value="xls">Excel</option></select>' +
      '<button type="button" class="btn primary" id="expBtn">Export</button>';

    $("#expFmt").value = T.fmt === "json" ? "json" : (T.delim === "," ? "csv" : "tsv");
    $("#expSorted").onchange = function () { T.expSorted = this.checked; };

    $("#rAdd").onclick = function () {
      var c = {};
      T.cols.forEach(function (col) { c[col.k] = ""; });
      var r = { id: TB.newId(), c: c };
      T.rows.splice(sel ? T.rows.indexOf(sel) + 1 : T.rows.length, 0, r);
      T.sel = r.id;
      TB.invalidate();
      TBUI.full();
      toast("Row added");
    };

    if (sel) {
      $("#rDup").onclick = function () {
        var c = {};
        for (var k in sel.c) c[k] = sel.c[k];
        var r = { id: TB.newId(), c: c };
        T.rows.splice(T.rows.indexOf(sel) + 1, 0, r);
        T.sel = r.id;
        TB.invalidate();
        TBUI.full();
        toast("Row duplicated");
      };
      $("#rDel").onclick = function (e) {
        var rc = e.target.getBoundingClientRect();
        TBUI.pop(rc.left, rc.top - 52, [{
          label: "Delete row", danger: true, confirm: true,
          run: function () {
            T.rows.splice(T.rows.indexOf(sel), 1);
            T.sel = null;
            TB.invalidate();
            TBUI.full();
            toast("Row deleted");
          }
        }]);
      };
    }

    $("#expBtn").onclick = function () {
      var f = $("#expFmt").value;
      var base = (S.fname.replace(/\.[^.]+$/, "") || "data");
      if (f === "json") download(base + ".json", TB.toJSON(), "application/json");
      else if (f === "csv") download(base + ".csv", TB.toDelim(","), "text/csv");
      else if (f === "xls") download(base + ".xls", TB.toXLS(), "application/vnd.ms-excel");
      else download(base + ".tsv", TB.toDelim("\t"), "text/tab-separated-values");
      toast((f === "xls" ? "Excel" : f.toUpperCase()) + " exported");
    };
  };
})();
