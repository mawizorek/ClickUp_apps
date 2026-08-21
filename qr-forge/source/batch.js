/* QR Forge · source/batch.js
   Many codes at once, ending in a labelled print sheet. Its own lane so app.js
   stays under the source-size line. */
(function () {
  'use strict';

  var R = window.QRRender, QR = window.QR;
  var $ = function (id) { return document.getElementById(id); };
  var urls = [];

  function free() { urls.forEach(function (u) { URL.revokeObjectURL(u); }); urls = []; }
  function mint(content, type) {
    var u = URL.createObjectURL(new Blob([content], { type: type }));
    urls.push(u);
    return u;
  }

  /* Lines are `Label | url`. A line with no pipe is a bare link, which is a real
     way people paste a list, not an error. */
  function parse(raw) {
    return raw.split(/\r?\n/).map(function (line) { return line.trim(); })
      .filter(Boolean).map(function (line) {
        var i = line.indexOf('|');
        var label = i >= 0 ? line.slice(0, i).trim() : '';
        var url = (i >= 0 ? line.slice(i + 1) : line).trim();
        var row = { label: label, url: url };
        if (!url) { row.error = 'no link'; return row; }
        try {
          row.sym = QR.encode(url, { ecl: 'Q', boost: true });
        } catch (e) {
          row.error = 'too long (' + e.bytes + ' B)';
        }
        return row;
      });
  }

  function refresh() {
    free();
    var rows = parse($('rows').value);
    var good = rows.filter(function (r) { return r.sym; });
    var mm = Math.max(10, Math.min(120, parseFloat($('bwidth').value) || 34));
    var cols = parseInt($('cols').value, 10) || 3;
    var sheetA = $('sheet');

    if (!rows.length) {
      $('batch-sum').textContent = 'Nothing parsed yet.';
      $('batch-tbl').innerHTML = '';
      sheetA.setAttribute('aria-disabled', 'true');
      sheetA.removeAttribute('href');
      return;
    }

    var worst = good.reduce(function (acc, r) {
      var m = mm / (r.sym.size + 8);
      return Math.min(acc, m);
    }, Infinity);

    $('batch-sum').textContent = good.length + ' of ' + rows.length + ' ready' +
      (good.length ? ' · smallest module ' + worst.toFixed(2) + ' mm' : '') +
      (worst < 0.33 ? ' — too fine to scan, go bigger' : '');

    $('batch-tbl').innerHTML = '<div class="tbl-wrap"><table class="tbl">' +
      '<thead><tr><th>#</th><th>Label</th><th>Link</th><th>Symbol</th><th>SVG</th></tr></thead><tbody>' +
      rows.map(function (r, i) {
        var svgCell = '—';
        if (r.sym) {
          var name = R.slug(r.label || r.url.replace(/^https?:\/\//, ''));
          var u = mint(R.svg(r.sym, { quiet: 4, mm: mm, label: r.label || r.url }), 'image/svg+xml');
          svgCell = '<a href="' + u + '" download="' + name + '.svg">download</a>';
        }
        return '<tr' + (r.error ? ' class="bad"' : '') + '>' +
          '<td class="n">' + (i + 1) + '</td>' +
          '<td>' + (R.esc(r.label) || '<span style="opacity:.5">none</span>') + '</td>' +
          '<td class="u">' + R.esc(r.url) + '</td>' +
          '<td class="n">' + (r.sym ? 'v' + r.sym.version + ' ' + r.sym.ecl : r.error) + '</td>' +
          '<td class="n">' + svgCell + '</td></tr>';
      }).join('') + '</tbody></table></div>';

    if (good.length) {
      sheetA.removeAttribute('aria-disabled');
      sheetA.href = mint(R.sheet(good, {
        cols: cols, mm: mm,
        title: 'QR sheet · ' + good.length + ' codes · ' + mm + 'mm'
      }), 'text/html');
      sheetA.textContent = 'Open print sheet (' + good.length + ')';
    } else {
      sheetA.setAttribute('aria-disabled', 'true');
      sheetA.removeAttribute('href');
      sheetA.textContent = 'Open print sheet';
    }
  }

  var pending;
  function schedule() { clearTimeout(pending); pending = setTimeout(refresh, 220); }

  function init() {
    $('rows').addEventListener('input', schedule);
    $('cols').addEventListener('change', refresh);
    $('bwidth').addEventListener('input', schedule);
    window.QRBatch = { refresh: refresh };
    refresh();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
