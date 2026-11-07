/* screens/print.js — print menu: select, preview, print, and export paperwork.
   Grouped by department. Checkbox per sheet. Tap a row to preview. Print + Export footer.

   A column marked `span: true` is lifted out of the header and printed as a full-width
   continuation cell underneath its record's field cells, so long text prints in full
   instead of being truncated or squeezed into a narrow column. The field row and its
   note row are one <tbody>, so a record never splits across a page. */
window.Screens = window.Screens || {};
Screens.print = (function () {
  var esc = UI.esc, or = UI.or, DASH = UI.DASH;
  var view = null;
  var checked = {};
  var previewing = null;

  function isEmpty(v) { return v === null || v === undefined || v === ""; }

  /* Blank sort keys sort LAST: a patch sheet leads with its numbered rows. */
  function sortRows(rows, key) {
    if (!key) return rows;
    rows.sort(function (a, b) {
      var av = a[key], bv = b[key], ae = isEmpty(av), be = isEmpty(bv);
      if (ae !== be) return ae ? 1 : -1;
      if (ae && be) return 0;
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

  /* Which columns actually carry a value anywhere on this sheet. A `required` column that
     traces NOTHING prints a dash, not a write-in line on every row: one empty rule marks a
     missing connection, sixteen identical rules mark a column nobody wired. */
  function tracedKeys(def, rows) {
    var t = {};
    def.columns.forEach(function (c) {
      t[c.key] = rows.some(function (r) { return !isEmpty(r[c.key]); });
    });
    return t;
  }
  function untracedRequired(def, rows) {
    var t = tracedKeys(def, rows);
    return def.columns.filter(function (c) { return c.required && !t[c.key]; }).map(function (c) { return c.label; });
  }

  /* Field columns: everything that is not the group key and not a spanning column. */
  function fieldCols(def) {
    return def.columns.filter(function (c) { return c.key !== def.groupBy && !c.span; });
  }
  function spanCols(def) {
    return def.columns.filter(function (c) { return c.span; });
  }

  /* Cell value. null means empty, so the caller decides write-in vs dash vs blank. */
  function sheetVal(c, r) {
    var v = r[c.key];
    if (isEmpty(v)) return null;
    v = String(v);
    if (c.truncate && v.length > c.truncate) {
      v = v.slice(0, c.truncate).replace(/\s+\S*$/, "") + "\u2026";
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

  function footNote(def, rows) {
    var un = untracedRequired(def, rows);
    return rows.length + ' record' + (rows.length !== 1 ? 's' : '') +
      (un.length ? ' \u00b7 not traced on this show: ' + un.join(', ') : '');
  }

  // ---- sheet preview (on-screen) ----
  function sheetPreview(def, sid, show) {
    var rows = sortRows(def.rows(sid), def.sort);
    if (!rows.length) return '<div class="print-empty">No data for this paperwork.</div>';
    var groups = groupRows(rows, def.groupBy);
    var venue = show ? SignalDB.get("venues", show.venue_id) : null;
    var designer = showDesigner(show, def.dept);
    var traced = tracedKeys(def, rows);

    var h = '<div class="print-sheet">';
    h += '<div class="sheet-hdr">';
    h += '<div class="sheet-title">' + esc(show ? show.title : '') + '</div>';
    h += '<div class="sheet-meta">' + esc((venue ? venue.name : '') + (show && show.season ? ' \u00b7 ' + show.season : '')) + '</div>';
    if (designer) h += '<div class="sheet-meta">' + esc(designer) + '</div>';
    h += '<div class="sheet-pw">' + esc(def.name) + '</div>';
    h += '<div class="sheet-date">' + new Date().toLocaleDateString() + '</div>';
    h += '</div>';

    if (groups) {
      Object.keys(groups).sort(function (a, b) { return a.localeCompare(b, undefined, { numeric: true }); })
        .forEach(function (g) { h += '<div class="sheet-ghdr">' + esc(g) + '</div>' + sheetTable(def, groups[g], traced); });
    } else {
      h += sheetTable(def, rows, traced);
    }
    h += '<div class="sheet-foot">' + esc(footNote(def, rows)) + '</div></div>';
    return h;
  }

  function sheetTable(def, rows, traced) {
    var cols = fieldCols(def), spans = spanCols(def);
    var t = '<table class="sheet-tbl"><thead><tr>';
    cols.forEach(function (c) { t += '<th style="width:' + c.width + 'px">' + esc(c.label) + '</th>'; });
    t += '</tr></thead>';
    rows.forEach(function (r, i) {
      var alt = i % 2 ? ' sheet-alt' : '';
      var notes = spans.map(function (c) { return { c: c, v: sheetVal(c, r) }; }).filter(function (x) { return x.v !== null; });
      t += '<tbody class="sheet-rec' + alt + '">';
      t += '<tr class="' + (notes.length ? 'sheet-fields has-note' : 'sheet-fields') + '">';
      cols.forEach(function (c) {
        var v = sheetVal(c, r), cls = c.mono ? ' class="sheet-mono"' : '';
        if (v === null && c.required) {
          t += traced[c.key] ? '<td' + cls + '><span class="sheet-writein"></span></td>'
                             : '<td' + cls + '><span class="sheet-na">' + DASH + '</span></td>';
        } else t += '<td' + cls + '>' + esc(v === null ? '' : v) + '</td>';
      });
      t += '</tr>';
      notes.forEach(function (x) {
        t += '<tr class="sheet-noterow"><td colspan="' + cols.length + '">' +
             '<span class="sheet-notelbl">' + esc(x.c.label) + '</span> ' + esc(x.v) + '</td></tr>';
      });
      t += '</tbody>';
    });
    t += '</table>';
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

  // ---- print ----
  function doPrint() {
    var defs = checkedDefs(); if (!defs.length) return;
    var sid = UI.showId(), show = SignalDB.get("shows", sid);
    var w = window.open('', '_blank');
    if (!w) { UI.toast('Pop-up blocked. Allow pop-ups for this site.', 'bad'); return; }
    var body = '<!doctype html><html><head><meta charset="utf-8"><title>' + esc((show ? show.title : 'Throughline') + ' Paperwork') + '</title><style>' + printCSS() + '</style></head><body>';
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
    var traced = tracedKeys(def, rows);
    var cols = fieldCols(def), spans = spanCols(def);

    var h = '<div class="pp">';
    h += '<div class="ph"><div class="phl"><b>' + esc(show ? show.title : '') + '</b>';
    if (venue) h += '<br>' + esc(venue.name);
    if (show && show.season) h += ' \u00b7 ' + esc(show.season);
    if (designer) h += '<br>' + esc(designer);
    h += '</div><div class="phr"><b>' + esc(def.name) + '</b><br>' + new Date().toLocaleDateString() + '</div></div>';
    h += '<hr class="pr">';

    function ptable(trows) {
      var t = '<table><thead><tr>';
      cols.forEach(function (c) { t += '<th style="width:' + c.width + 'px">' + esc(c.label) + '</th>'; });
      t += '</tr></thead>';
      trows.forEach(function (r, i) {
        var notes = spans.map(function (c) { return { c: c, v: sheetVal(c, r) }; }).filter(function (x) { return x.v !== null; });
        t += '<tbody class="rec' + (i % 2 ? ' a' : '') + '">';
        t += '<tr' + (notes.length ? ' class="hn"' : '') + '>';
        cols.forEach(function (c) {
          var v = sheetVal(c, r), cls = c.mono ? ' class="m"' : '';
          if (v === null && c.required) {
            t += traced[c.key] ? '<td' + cls + '><span class="wl"></span></td>'
                               : '<td' + cls + '><span class="na">\u2014</span></td>';
          } else t += '<td' + cls + '>' + esc(v === null ? '' : v) + '</td>';
        });
        t += '</tr>';
        notes.forEach(function (x) {
          t += '<tr class="nr"><td colspan="' + cols.length + '"><span class="nl">' + esc(x.c.label) + '</span> ' + esc(x.v) + '</td></tr>';
        });
        t += '</tbody>';
      });
      t += '</table>';
      return t;
    }

    if (groups) {
      Object.keys(groups).sort(function (a, b) { return a.localeCompare(b, undefined, { numeric: true }); })
        .forEach(function (g) { h += '<div class="gh">' + esc(g) + '</div>' + ptable(groups[g]); });
    } else {
      h += ptable(rows);
    }
    h += '<div class="pf">' + esc(footNote(def, rows)) + '</div></div>';
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
      'thead{display:table-header-group}' +
      'tbody.rec{page-break-inside:avoid}' +
      'th{text-align:left;font-size:8pt;font-weight:600;border-bottom:1px solid #111;padding:3px 6px;white-space:nowrap}' +
      'td{font-size:9pt;padding:2px 6px;vertical-align:top;border-bottom:1px solid #e5e7eb}' +
      'tr.hn td{border-bottom:none;padding-bottom:0}' +
      'tbody.a td{background:#f9fafb}' +
      '.m{font-family:"SF Mono","Cascadia Mono",Consolas,monospace;font-size:8pt}' +
      '.nr td{font-size:8pt;color:#333;line-height:1.35;padding:1px 6px 4px 14px}' +
      '.nl{font-size:6.5pt;text-transform:uppercase;letter-spacing:.07em;color:#888;margin-right:5px}' +
      '.wl{display:inline-block;width:90%;border-bottom:1px solid #999;min-height:12px}' +
      '.na{color:#aaa}' +
      '.pf{margin-top:8px;font-size:8pt;color:#666;text-align:right}';
  }

  // ---- export spreadsheet (full values, never truncated, span columns included) ----
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
          if (isEmpty(v)) return '<Cell/>';
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
