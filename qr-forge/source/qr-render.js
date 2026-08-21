/* QR Forge · source/qr-render.js
   Turns a symbol into the two things a print job actually needs: a vector SVG
   (resolution-free, the one to send to a printer or a laser cutter) and a raster
   PNG for anything that will not take an SVG. Also builds the batch print sheet. */
(function (root) {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* One path, with horizontal runs merged. A version 10 code is ~3,000 dark
     modules; emitted as individual rects that is a file no RIP enjoys, and
     hairline seams show up between adjacent squares on some printers. */
  function pathFor(sym, quiet) {
    var n = sym.size, out = [];
    for (var y = 0; y < n; y++) {
      var x = 0;
      while (x < n) {
        if (!sym.get(x, y)) { x++; continue; }
        var run = 1;
        while (x + run < n && sym.get(x + run, y)) run++;
        out.push('M' + (x + quiet) + ' ' + (y + quiet) + 'h' + run + 'v1h-' + run + 'z');
        x += run;
      }
    }
    return out.join('');
  }

  function svg(sym, o) {
    o = o || {};
    var quiet = o.quiet == null ? 4 : o.quiet;
    var span = sym.size + quiet * 2;
    var dark = o.dark || '#000000';
    var attrs = o.mm
      ? 'width="' + o.mm + 'mm" height="' + o.mm + 'mm"'
      : 'width="' + (o.scale || 8) * span + '" height="' + (o.scale || 8) * span + '"';
    return '<svg xmlns="http://www.w3.org/2000/svg" ' + attrs +
      ' viewBox="0 0 ' + span + ' ' + span + '" shape-rendering="crispEdges"' +
      ' role="img" aria-label="' + esc(o.label || 'QR code') + '">' +
      (o.transparent ? '' : '<rect width="' + span + '" height="' + span + '" fill="' + (o.light || '#ffffff') + '"/>') +
      '<path fill="' + dark + '" d="' + pathFor(sym, quiet) + '"/></svg>';
  }

  function canvas(sym, o) {
    o = o || {};
    var quiet = o.quiet == null ? 4 : o.quiet, scale = o.scale || 8;
    var span = sym.size + quiet * 2;
    var c = document.createElement('canvas');
    c.width = c.height = span * scale;
    var g = c.getContext('2d');
    g.fillStyle = o.light || '#ffffff';
    g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = o.dark || '#000000';
    for (var y = 0; y < sym.size; y++) for (var x = 0; x < sym.size; x++)
      if (sym.get(x, y)) g.fillRect((x + quiet) * scale, (y + quiet) * scale, scale, scale);
    return c;
  }

  function slug(s) {
    return (String(s || 'qr').toLowerCase().replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'qr').slice(0, 48);
  }

  /* A print sheet, not a screen page: physical mm, a real page margin, and
     rows that will not break a code across a page. */
  function sheet(items, o) {
    o = o || {};
    var cols = o.cols || 3, mm = o.mm || 34;
    var cells = items.map(function (it) {
      return '<div class="c">' + svg(it.sym, { mm: mm, quiet: 4, label: it.label || it.url }) +
        '<p class="l">' + esc(it.label || '') + '</p>' +
        '<p class="u">' + esc(it.url) + '</p></div>';
    }).join('');
    return '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">' +
      '<title>' + esc(o.title || 'QR sheet') + '</title>' +
      '<style>@page{margin:12mm}' +
      'body{margin:0;font:400 9pt/1.35 -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;color:#111}' +
      'h1{font-size:11pt;font-weight:700;margin:0 0 1mm;letter-spacing:.02em}' +
      'p.meta{margin:0 0 6mm;font-size:8pt;color:#666}' +
      '.g{display:grid;grid-template-columns:repeat(' + cols + ',1fr);gap:8mm 6mm}' +
      '.c{break-inside:avoid;page-break-inside:avoid;text-align:center}' +
      '.c svg{display:block;margin:0 auto}' +
      '.l{margin:2mm 0 0;font-size:8.5pt;font-weight:600;line-height:1.25}' +
      '.u{margin:.6mm 0 0;font-size:6.5pt;color:#777;word-break:break-all;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}' +
      '@media print{p.meta,h1{display:none}}' +
      '</style></head><body><h1>' + esc(o.title || 'QR sheet') + '</h1>' +
      '<p class="meta">' + items.length + ' codes at ' + mm + 'mm. Print at 100% — any scaling changes the module size.</p>' +
      '<div class="g">' + cells + '</div></body></html>';
  }

  root.QRRender = { svg: svg, canvas: canvas, sheet: sheet, slug: slug, esc: esc };
})(window);
