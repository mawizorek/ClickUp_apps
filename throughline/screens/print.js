/* screens/print.js — print menu: select, preview, print, and export paperwork.
   Grouped by department. Checkbox per sheet. Tap a row to preview. Print + Export footer.
   Truncation applies to the SHEET only (print + preview). The spreadsheet carries full values. */
window.Screens = window.Screens || {};
Screens.print = (function () {
  var esc = UI.esc, or = UI.or, DASH = UI.DASH;
  var view = null;
  var checked = {};
  var previewing = null;

  function sortRows(rows, key) {
    if (!key) return rows;
    rows.sort(function (a, b) {
      var av = a[key], bv = b[key];
      if (av == null) av = ""; if (bv == null) bv = "";
      if (typeof av === "number" && typeof bv === "number") return av - bv;
      return String(av).localeCompare(String(bv), undefined, { numeric: true });
    });
    return rows;
  }

  function groupRows(rows, key) {
    if (!key) return null;
    var g = {};
    rows.forEach(function (r) { var k = r[key] || "Ungrouped"; if (!g[k]) g[k] = []; g[k].push(r); });
    return g;
  }

  /* Sheet cell value. Returns null for an empty cell so the caller can decide
     between a write-in line (required) and a blank. Honours column truncate. */
  function sheetVal(c, r) {
    var v = r[c.key];
    if (v === null || v === undefined || v === "") return null;
    v = String(v);
    if (c.truncate && v.length > c.truncate) {
      v = v.slice(0, c.truncate).replace(/\s+\S*$/, "");
      v += "\u2026";
    }
    return v;
  }

  // ---- render ----
  function render(v) {
    view = v || view; if (!view) return;
    var sid = UI.showId(), show = SignalDB.get("shows", sid);
    var cat = Paperwork.catalogue;

    var depts = {}, deptOrder = [];
    cat.forEach(function (d) {
      if (!depts[d.dept]) { depts[d.dept] = []; deptOrder.push(d.dept); }
      depts[d.dept].push(d);
    });

    var nChecked = Object.keys(checked).filter(function (k) { return checked[k]; }).length;

    var h = '<div class="sig-app print-app"><div class="sig-filters"><div class="sig-group sig-showbar">';
    var shows = SignalDB.getAll("shows").sort(function (a, b) { return String(a.title).localeCompare(String(b.title)); });
    if (shows.length > 1) {
      h += '<select class="sig-select" id="printShow" aria-label="Show">';
      shows.forEach(function (s) { h += '<option value="' + esc(s.id) + '"' + (s.id === sid ? ' selected' : '') + '>' + esc(SCHEMA.T.shows.show(s)) + '</option>'; });
      h += '</select>';
    } else {
      h += '<span class="sig-show">' + esc(show ? SCHEMA.T.shows.show(show) : "No show") + '</span>';
    }
    h += '</div></div>';

    h += '<div class="print-menu">';
    deptOrder.forEach(function (dept) {
      h += '<h3 class="print-dept-hdr">' + esc(dept) + '</h3>';
      depts[dept].forEach(function (d) {
        var rows = d.rows(sid);
        var count = rows.length;
        var disabled = count === 0;
        var isChecked = !!checked[d.id] && !disabled;
        h += '<div class="print-item' + (disabled ? ' is-disabled' : '') + (previewing === d.id ? ' is-active' : '') + '" data-pid="' + esc(d.id) + '">';
        h += '<label class="print-cb" onclick="event.stopPropagation()"><input type="checkbox"' + (isChecked ? ' checked' : '') + (disabled ? ' disabled' : '') + ' data-check="' + esc(d.id) + '"></label>';
        h += '<span class="print-name">' + esc(d.name) + '</span>';
        h += '<span class="print-ct">' + (disabled ? 'No data yet' : count + ' record' + (count !== 1 ? 's' : '')) + '</span>';
        h += '</div>';
      });
    });
    h += '</div>';

    if (previewing) {
      var def = cat.filter(function (d) { return d.id === previewing; })[0];
      if (def) h += sheetPreview(def, sid, show);
    }

    h += '<div class="print-acts">';
    h += '<button type="button" class="sig-btn sig-btn-pri" data-act="print"' + (!nChecked ? ' disabled' : '') + '>Print' + (nChecked ? ' (' + nChecked + ')' : '') + '</button> ';
    h += '<button type="button" class="sig-btn" data-act="pdf"' + (!nChecked ? ' disabled' : '') + '>Export PDF</button> ';
    h += '<button type="button" class="sig-btn" data-act="xls"' + (!nChecked ? ' disabled' : '') + '>Export spreadsheet</button>';
    h += '</div></div>';

    view.innerHTML = h;
    bind();
  }

  // ---- sheet preview (on-screen) ----
  function sheetPreview(def, sid, show) {
    var rows = sortRows(def.rows(sid), def.sort);
    if (!rows.length) return '<div class="print-empty">No data for this paperwork.</div>';
    var groups = groupRows(rows, def.groupBy);
    var venue = show ? SignalDB.get("venues", show.venue_id) : null;
    var designer = showDesigner(show, def.dept);

    var h = '<div class="print-sheet">';
    h += '<div class="sheet-hdr">';
    h += '<div class="sheet-title">' + esc(show ? show.title : '') + '</div>';
    h += '<div class="sheet-meta">' + esc((venue ? venue.name : '') + (show && show.season ? ' \u00b7 ' + show.season : '')) + '</div>';
    if (designer) h += '<div class="sheet-meta">' + esc(designer) + '</div>';
    h += '<div class="sheet-pw">' + esc(def.name) + '</div>';
    h += '<div class="sheet-date">' + new Date().toLocaleDateString() + '</div>';
    h += '</div>';

    if (groups) {
      var gk = Object.keys(groups).sort(function (a, b) { return a.localeCompare(b, undefined, { numeric: true }); });
      gk.forEach(function (g) { h += '<div class="sheet-ghdr">' + esc(g) + '</div>' + sheetTable(def, groups[g]); });
    } else {
      h += sheetTable(def, rows);
    }
    h += '<div class="sheet-foot">' + rows.length + ' record' + (rows.length !== 1 ? 's' : '') + '</div></div>';
    return h;
  }

  function sheetTable(def, rows) {
    var t = '<table class="sheet-tbl"><thead><tr>';
    def.columns.forEach(function (c) { if (c.key === def.groupBy) return; t += '<th style="width:' + c.width + 'px">' + esc(c.label) + '</th>'; });
    t += '</tr></thead><tbody>';
    rows.forEach(function (r, i) {
      t += '<tr' + (i % 2 ? ' class="sheet-alt"' : '') + '>';
      def.columns.forEach(function (c) {
        if (c.key === def.groupBy) return;
        var v = sheetVal(c, r);
        var cls = c.mono ? ' class="sheet-mono"' : '';
        if (v === null && c.required) t += '<td' + cls + '><span class="sheet-writein"></span></td>';
        else t += '<td' + cls + '>' + esc(v === null ? '' : v) + '</td>';
      });
      t += '</tr>';
    });
    t += '</tbody></table>';
    return t;
  }

  function showDesigner(show, dept) {
    if (!show) return '';
    if (dept === 'Audio' && show.designer_snd) return show.designer_snd;
    if ((dept === 'Lighting' || dept === 'Electrics') && show.designer_lx) return show.designer_lx;
    if (dept === 'Video' && show.designer_vid) return show.designer_vid;
    return '';
  }

  // ---- bind ----
  function bind() {
    var $ = function (s) { return view.querySelectorAll(s); };
    $('[data-check]').forEach(function (cb) { cb.addEventListener('change', function () { checked[cb.dataset.check] = cb.checked; render(); }); });
    $('.print-item:not(.is-disabled)').forEach(function (el) {
      el.addEventListener('click', function (e) {
        if (e.target.closest('label')) return;
        previewing = el.dataset.pid === previewing ? null : el.dataset.pid;
        render();
      });
    });
    var sel = view.querySelector('#printShow');
    if (sel) sel.addEventListener('change', function () { UI.setShow(sel.value); render(); });
    $('[data-act]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.dataset.act === 'print' || b.dataset.act === 'pdf') doPrint();
        else if (b.dataset.act === 'xls') doExport();
      });
    });
  }

  function checkedDefs() {
    var sid = UI.showId();
    return Paperwork.catalogue.filter(function (d) { return checked[d.id] && d.rows(sid).length > 0; });
  }

  // ---- print (opens a print-ready window) ----
  function doPrint() {
    var defs = checkedDefs(); if (!defs.length) return;
    var sid = UI.showId(), show = SignalDB.get("shows", sid);
    var w = window.open('', '_blank');
    if (!w) { UI.toast('Pop-up blocked. Allow pop-ups for this site.', 'bad'); return; }
    var css = printCSS();
    var body = '<!doctype html><html><head><meta charset="utf-8"><title>' + esc((show ? show.title : 'Throughline') + ' Paperwork') + '</title><style>' + css + '</style></head><body>';
    defs.forEach(function (def, di) {
      if (di > 0) body += '<div class="pb"></div>';
      body += printPage(def, sid, show);
    });
    body += '<script>window.onload=function(){window.print();}<\/script></body></html>';
    w.document.write(body);
    w.document.close();
  }

  function printPage(def, sid, show) {
    var rows = sortRows(def.rows(sid), def.sort);
    if (!rows.length) return '';
    var groups = groupRows(rows, def.groupBy);
    var venue = show ? SignalDB.get("venues", show.venue_id) : null;
    var designer = showDesigner(show, def.dept);

    var h = '<div class="pp">';
    h += '<div class="ph"><div class="phl"><b>' + esc(show ? show.title : '') + '</b>';
    if (venue) h += '<br>' + esc(venue.name);
    if (show && show.season) h += ' \u00b7 ' + esc(show.season);
    if (designer) h += '<br>' + esc(designer);
    h += '</div><div class="phr"><b>' + esc(def.name) + '</b><br>' + new Date().toLocaleDateString() + '</div></div>';
    h += '<hr class="pr">';

    function ptable(trows) {
      var t = '<table><thead><tr>';
      def.columns.forEach(function (c) { if (c.key === def.groupBy) return; t += '<th style="width:' + c.width + 'px">' + esc(c.label) + '</th>'; });
      t += '</tr></thead><tbody>';
      trows.forEach(function (r, i) {
        t += '<tr' + (i % 2 ? ' class="a"' : '') + '>';
        def.columns.forEach(function (c) {
          if (c.key === def.groupBy) return;
          var v = sheetVal(c, r);
          var cls = c.mono ? ' class="m"' : '';
          if (v === null && c.required) t += '<td' + cls + '><span class="wl"></span></td>';
          else t += '<td' + cls + '>' + esc(v === null ? '' : v) + '</td>';
        });
        t += '</tr>';
      });
      t += '</tbody></table>';
      return t;
    }

    if (groups) {
      Object.keys(groups).sort(function (a, b) { return a.localeCompare(b, undefined, { numeric: true }); })
        .forEach(function (g) { h += '<div class="gh">' + esc(g) + '</div>' + ptable(groups[g]); });
    } else {
      h += ptable(rows);
    }
    h += '<div class="pf">' + rows.length + ' record' + (rows.length !== 1 ? 's' : '') + '</div></div>';
    return h;
  }

  function printCSS() {
    return '@page{size:letter landscape;margin:.5in}' +
      'body{font-family:-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;font-size:9pt;color:#111;margin:0}' +
      '.pp{page-break-after:always}.pp:last-child{page-break-after:auto}.pb{page-break-after:always;height:0}' +
      '.ph{display:flex;justify-content:space-between;align-items:flex-start}' +
      '.phl{font-size:10pt;line-height:1.4}.phr{text-align:right;font-size:10pt;line-height:1.4}' +
      '.pr{border:none;border-top:2px solid #111;margin:8px 0 6px}' +
      '.gh{font-weight:bold;font-size:10pt;background:#e5e7eb;padding:3px 6px;margin:10px 0 2px}' +
      'table{border-collapse:collapse;width:100%;margin-bottom:4px}' +
      'thead{display:table-header-group}tr{page-break-inside:avoid}' +
      'th{text-align:left;font-size:8pt;font-weight:600;border-bottom:1px solid #111;padding:3px 6px;white-space:nowrap}' +
      'td{font-size:9pt;padding:2px 6px;vertical-align:top;border-bottom:1px solid #e5e7eb}' +
      'tr.a td{background:#f9fafb}' +
      '.m{font-family:"SF Mono","Cascadia Mono",Consolas,monospace;font-size:8pt}' +
      '.wl{display:inline-block;width:90%;border-bottom:1px solid #999;min-height:12px}' +
      '.pf{margin-top:8px;font-size:8pt;color:#666;text-align:right}';
  }

  // ---- export spreadsheet (full values, never truncated) ----
  function doExport() {
    var defs = checkedDefs(); if (!defs.length) return;
    var sid = UI.showId(), show = SignalDB.get("shows", sid);
    var stamp = new Date().toISOString().slice(0, 10);
    var title = show ? show.title.replace(/[^a-zA-Z0-9]/g, '-') : 'throughline';
    var x = function (v) { return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
    var s = '<?xml version="1.0"?>\n<?mso-application progid="Excel.Sheet"?>\n<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">';
    s += '<Styles><Style ss:ID="h"><Font ss:Bold="1"/><Interior ss:Color="#D9E1F2" ss:Pattern="Solid"/></Style></Styles>';
    defs.forEach(function (def) {
      var rows = sortRows(def.rows(sid), def.sort);
      s += '<Worksheet ss:Name="' + x(def.name.slice(0, 31)) + '"><Table>';
      s += '<Row>' + def.columns.map(function (c) { return '<Cell ss:StyleID="h"><Data ss:Type="String">' + x(c.label) + '</Data></Cell>'; }).join('') + '</Row>';
      rows.forEach(function (r) {
        s += '<Row>' + def.columns.map(function (c) {
          var v = r[c.key];
          if (v === null || v === undefined || v === '') return '<Cell/>';
          if (typeof v === 'number' && isFinite(v)) return '<Cell><Data ss:Type="Number">' + v + '</Data></Cell>';
          return '<Cell><Data ss:Type="String">' + x(v) + '</Data></Cell>';
        }).join('') + '</Row>';
      });
      s += '</Table></Worksheet>';
    });
    s += '</Workbook>';
    var blob = new Blob([s], { type: 'application/vnd.ms-excel' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = title + '-paperwork-' + stamp + '.xls';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
    UI.toast('Exported ' + defs.length + ' sheet' + (defs.length !== 1 ? 's' : ''));
  }

  return {
    render: render,
    refresh: function () { if (view && document.body.contains(view) && !document.getElementById('sigPanelWrap')) render(); }
  };
})();
