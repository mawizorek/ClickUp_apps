/* Prism — Markdown lens. Exposes window.MDLens { load, render }. */
(function () {
  function renderMD(src) {
    var lines = src.replace(/\r\n/g, "\n").split("\n"), html = [], i = 0;
    function inline(t) {
      return esc(t)
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    }
    while (i < lines.length) {
      var l = lines[i];
      if (/^```/.test(l)) { var code = []; i++; while (i < lines.length && !/^```/.test(lines[i])) { code.push(lines[i]); i++; } i++; html.push("<pre><code>" + esc(code.join("\n")) + "</code></pre>"); continue; }
      if (/^#{1,6}\s/.test(l)) { var lvl = l.match(/^#+/)[0].length; html.push("<h" + lvl + ">" + inline(l.replace(/^#+\s/, "")) + "</h" + lvl + ">"); i++; continue; }
      if (/^>\s?/.test(l)) { var q = []; while (i < lines.length && /^>\s?/.test(lines[i])) { q.push(lines[i].replace(/^>\s?/, "")); i++; } html.push("<blockquote>" + inline(q.join(" ")) + "</blockquote>"); continue; }
      if (/^(-{3,}|\*{3,})$/.test(l.trim())) { html.push("<hr>"); i++; continue; }
      if (/^\s*\|.*\|\s*$/.test(l) && i + 1 < lines.length && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
        var head = l.split("|").slice(1, -1).map(function (c) { return c.trim(); });
        i += 2; var body = [];
        while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) { body.push(lines[i].split("|").slice(1, -1).map(function (c) { return c.trim(); })); i++; }
        html.push("<table><tr>" + head.map(function (h) { return "<th>" + inline(h) + "</th>"; }).join("") + "</tr>" + body.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + inline(c) + "</td>"; }).join("") + "</tr>"; }).join("") + "</table>");
        continue;
      }
      if (/^\s*[-*+]\s/.test(l)) { var items = []; while (i < lines.length && /^\s*[-*+]\s/.test(lines[i])) { items.push(lines[i].replace(/^\s*[-*+]\s/, "")); i++; } html.push("<ul>" + items.map(function (it) { return "<li>" + inline(it) + "</li>"; }).join("") + "</ul>"); continue; }
      if (/^\s*\d+\.\s/.test(l)) { var oi = []; while (i < lines.length && /^\s*\d+\.\s/.test(lines[i])) { oi.push(lines[i].replace(/^\s*\d+\.\s/, "")); i++; } html.push("<ol>" + oi.map(function (it) { return "<li>" + inline(it) + "</li>"; }).join("") + "</ol>"); continue; }
      if (l.trim() === "") { i++; continue; }
      var para = [l]; i++; while (i < lines.length && lines[i].trim() !== "" && !/^(#{1,6}\s|>|```|\s*[-*+]\s|\s*\d+\.\s|\s*\|)/.test(lines[i])) { para.push(lines[i]); i++; }
      html.push("<p>" + inline(para.join(" ")) + "</p>");
    }
    return html.join("\n");
  }

  window.MDLens = {
    load: function () {
      var name = S.fname, text = S.raw;
      $("#side").style.display = "none";
      $("#fmeta").textContent = text.split("\n").length + " lines \u00b7 " + (text.length / 1024).toFixed(1) + " KB";
      $("#viewSeg").innerHTML = '<button data-v="rendered">Rendered</button><button data-v="raw">Raw</button>';
      $("#exportbar").innerHTML =
        '<span class="lbl">Markdown lens</span>' +
        '<span class="fmeta">Renders headings, lists, tables, code, quotes.</span>' +
        '<div class="spacer" style="margin-left:auto"></div>' +
        '<button class="btn" id="copyMd">' + IC.copy + 'Copy source</button>' +
        '<button class="btn primary" id="htmlBtn">' + IC.code + 'Export HTML</button>';
      $("#copyMd").onclick = function () { navigator.clipboard.writeText(S.raw); toast("Source copied"); };
      $("#htmlBtn").onclick = function () {
        download((name.replace(/\.[^.]+$/, "") || "doc") + ".html",
          '<!doctype html><meta charset="utf-8"><title>' + esc(name) + '</title><body style="font-family:system-ui;max-width:74ch;margin:40px auto;padding:0 20px;line-height:1.7">' + renderMD(S.raw) + "</body>", "text/html");
        toast("HTML exported");
      };
      document.querySelectorAll("#viewSeg button").forEach(function (b) { b.onclick = function () { setView(b.dataset.v); }; });
      return true;
    },
    render: function (v) {
      if (v === "rendered") $("#content").innerHTML = '<div class="md-body">' + renderMD(S.raw) + "</div>";
      else $("#content").innerHTML = '<pre class="raw">' + esc(S.raw) + "</pre>";
    }
  };
})();
