/* Prism — Table lens. TSV / CSV / flat-JSON, READ-WRITE.
   Self-registers into window.PrismLenses; loads BEFORE core.js.
   Column identity is a stable key (col.k), never the display name — renaming
   a column must not orphan its diff. */
(function () {
  "use strict";

  var RE6 = /^#[0-9a-f]{6}$/i, RE3 = /^#[0-9a-f]{3}$/i, RE8 = /^#[0-9a-f]{8}$/i, REU = /^https?:\/\/\S+$/i;
  var T = null, UID = 0, KEY = 0;

  /* ---------------- parsing ---------------- */
  function sniff(t) {
    var l = t.split("\n")[0] || "";
    var tb = (l.match(/\t/g) || []).length, cm = (l.match(/,/g) || []).length, sc = (l.match(/;/g) || []).length;
    if (tb && tb >= cm && tb >= sc) return "\t";
    return sc > cm ? ";" : ",";
  }
  function parse(t, d) {
    t = t.replace(/\r\n?/g, "\n");
    if (t.charCodeAt(0) === 0xFEFF) t = t.slice(1);
    var rows = [], row = [], cur = "", q = false, i = 0;
    while (i < t.length) {
      var c = t.charAt(i);
      if (q) {
        if (c === '"') { if (t.charAt(i + 1) === '"') { cur += '"'; i += 2; continue; } q = false; i++; continue; }
        cur += c; i++; continue;
      }
      if (c === '"' && cur === "") { q = true; i++; continue; }
      if (c === d) { row.push(cur); cur = ""; i++; continue; }
      if (c === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; i++; continue; }
      cur += c; i++;
    }
    if (cur !== "" || row.length) { row.push(cur); rows.push(row); }
    return rows.filter(function (r) { return r.length > 1 || (r[0] || "").trim() !== ""; });
  }

  /* ---------------- data gates ---------------- */
  function gate(v) {
    var s = v == null ? "" : String(v).trim();
    if (!s) return "empty";
    if (RE6.test(s) || RE3.test(s) || RE8.test(s)) return "hex";
    if (REU.test(s)) return "url";
    return "text";
  }
  function hx6(s) {
    s = String(s).trim();
    if (RE3.test(s)) return ("#" + s[1] + s[1] + s[2] + s[2] + s[3] + s[3]).toLowerCase();
    return s.slice(0, 7).toLowerCase();
  }
  /* 8-digit hex carries alpha the OS picker cannot see. Keep it. */
  function alphaOf(s) { s = String(s).trim(); return RE8.test(s) ? s.slice(7, 9) : ""; }
  function lum(s) {
    var c = hx6(s).slice(1);
    return 0.2126 * parseInt(c.substr(0, 2), 16) / 255 + 0.7152 * parseInt(c.substr(2, 2), 16) / 255 + 0.0722 * parseInt(c.substr(4, 2), 16) / 255;
  }

  /* ---------------- model ---------------- */
  function build(names, matrix, fmt, delim) {
    var cols = names.map(function (n) { return { k: "k" + (++KEY), name: n }; });
    var rows = matrix.map(function (m) {
      var c = {}; cols.forEach(function (col, i) { c[col.k] = m[i] == null ? "" : m[i]; });
      return { id: ++UID, c: c };
    });
    var orig = {};
    rows.forEach(function (r) { var o = {}; for (var k in r.c) o[k] = r.c[k]; orig[r.id] = o; });
    return {
      cols: cols, sig: sigOf(cols), rows: rows, orig: orig,
      origIds: rows.map(function (r) { return r.id; }),
      fmt: fmt, delim: delim, sortK: null, sortDir: 0, sel: null,
      view: "table", hl: false, expSorted: false, order: null
    };
  }
  function sigOf(cols) { return cols.map(function (c) { return c.k + "" + c.name; }).join("\u0001"); }
  function byId(id) { for (var i = 0; i < T.rows.length; i++) if (T.rows[i].id === id) return T.rows[i]; return null; }
  function colOf(k) { for (var i = 0; i < T.cols.length; i++) if (T.cols[i].k === k) return T.cols[i]; return null; }

  /* ---------------- diff ---------------- */
  function dirty(r, k) {
    var o = T.orig[r.id];
    if (!o || !(k in o)) return false;
    return String(o[k]) !== String(r.c[k] == null ? "" : r.c[k]);
  }
  function diff() {
    var cells = 0, added = 0, live = {};
    T.rows.forEach(function (r) {
      live[r.id] = 1;
      if (!T.orig[r.id]) { added++; return; }
      T.cols.forEach(function (col) { if (dirty(r, col.k)) cells++; });
    });
    var removed = T.origIds.filter(function (id) { return !live[id]; }).length;
    var colsChanged = sigOf(T.cols) !== T.sig;
    return { cells: cells, added: added, removed: removed, colsChanged: colsChanged,
      any: cells > 0 || added > 0 || removed > 0 || colsChanged };
  }

  /* ---------------- display order (frozen between sorts) ----------------
     Editing a cell must NOT resort the table under the cursor. Order is
     cached and only invalidated by an explicit sort or a row add/remove. */
  function invalidate() { T.order = null; }
  function ordered() {
    if (!T.order) {
      var rs = T.rows.slice();
      if (T.sortDir && T.sortK) {
        var k = T.sortK, dir = T.sortDir === 1 ? 1 : -1;
        rs.sort(function (a, b) {
          var x = a.c[k] == null ? "" : String(a.c[k]), y = b.c[k] == null ? "" : String(b.c[k]);
          if (x === "" && y !== "") return 1;
          if (y === "" && x !== "") return -1;
          var nx = parseFloat(x), ny = parseFloat(y);
          if (!isNaN(nx) && !isNaN(ny) && String(nx) === x.trim() && String(ny) === y.trim()) return (nx - ny) * dir;
          return x.localeCompare(y, undefined, { numeric: true, sensitivity: "base" }) * dir;
        });
      }
      T.order = rs.map(function (r) { return r.id; });
    }
    return T.order.map(byId).filter(Boolean);
  }

  /* ---------------- column helpers ---------------- */
  function colStat(k) {
    var n = { hex: 0, url: 0, empty: 0, text: 0 }, tot = T.rows.length;
    T.rows.forEach(function (r) { n[gate(r.c[k])]++; });
    if (tot && n.hex === tot) return "<b>" + tot + "/" + tot + "</b> hex";
    var p = [];
    if (n.hex) p.push("<b>" + n.hex + "</b> hex");
    if (n.url) p.push("<b>" + n.url + "</b> url");
    if (n.text) p.push(n.text + " text");
    if (n.empty) p.push(n.empty + " empty");
    return p.join(" \u00b7 ") || "\u2014";
  }
  function bgKey() {
    for (var i = 0; i < T.cols.length; i++) if (T.cols[i].name.trim().toLowerCase() === "bg") return T.cols[i].k;
    return null;
  }
  function labelKey() {
    var pref = ["name", "label", "title", "slug", "id"];
    for (var p = 0; p < pref.length; p++)
      for (var i = 0; i < T.cols.length; i++)
        if (T.cols[i].name.trim().toLowerCase() === pref[p]) return T.cols[i].k;
    for (var j = 0; j < T.cols.length; j++) {
      var k = T.cols[j].k;
      if (T.rows.length && T.rows.every(function (r) { return gate(r.c[k]) === "text"; })) return k;
    }
    return T.cols.length ? T.cols[0].k : null;
  }
  function tintOf(r) {
    if (!$("#rowTint") || !$("#rowTint").checked) return null;
    var bk = bgKey();
    if (!bk || gate(r.c[bk]) !== "hex") return null;
    var bg = hx6(r.c[bk]);
    return { bg: bg, fg: lum(bg) > 0.5 ? "oklch(0.2 0.02 265)" : "oklch(0.96 0.01 265)" };
  }

  /* ---------------- serialise ---------------- */
  function outRows() { return T.expSorted ? ordered() : T.rows; }
  function toDelim(d) {
    function q(s) {
      s = s == null ? "" : String(s);
      return (s.indexOf(d) >= 0 || s.indexOf("\n") >= 0 || s.indexOf('"') >= 0) ? '"' + s.replace(/"/g, '""') + '"' : s;
    }
    return [T.cols.map(function (c) { return q(c.name); }).join(d)].concat(
      outRows().map(function (r) { return T.cols.map(function (c) { return q(r.c[c.k]); }).join(d); })
    ).join("\n");
  }
  function toJSON() {
    return JSON.stringify(outRows().map(function (r) {
      var o = {}; T.cols.forEach(function (c) { o[c.name] = r.c[c.k] == null ? "" : r.c[c.k]; }); return o;
    }), null, 2);
  }

  /* ---------------- popover (no native confirm/prompt — both are blocked
     inside a sandboxed iframe and a blocked confirm() returns false silently) */
  var pop = null;
  function closePop() { if (pop) { pop.remove(); pop = null; } }
  document.addEventListener("mousedown", function (e) { if (pop && !pop.contains(e.target)) closePop(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closePop(); });
  function openPop(x, y, items) {
    closePop();
    pop = document.createElement("div"); pop.className = "pop";
    items.forEach(function (it) {
      if (it === "-") { pop.appendChild(document.createElement("hr")); return; }
      var b = document.createElement("button");
      b.type = "button"; b.textContent = it.label;
      if (it.danger) b.className = "danger";
      b.onclick = function () {
        if (it.confirm && b.dataset.armed !== "1") { b.dataset.armed = "1"; b.textContent = "Confirm: " + it.label; b.className = "danger armed"; return; }
        closePop(); it.run();
      };
      pop.appendChild(b);
    });
    pop.style.left = Math.max(8, Math.min(x, window.innerWidth - 200)) + "px";
    pop.style.top = Math.min(y, window.innerHeight - 240) + "px";
    document.body.appendChild(pop);
  }

  /* ---------------- cell rendering ---------------- */
  function cellHTML(r, k) {
    var v = r.c[k] == null ? "" : r.c[k], g = gate(v), d = dirty(r, k) ? " is-dirty" : "";
    if (g === "hex") {
      var s = String(v).trim(), a = alphaOf(s);
      return '<div class="t-cell' + d + '">' +
        '<input type="color" class="sw" value="' + hx6(s) + '" data-r="' + r.id + '" data-k="' + k + '" aria-label="' + esc(colOf(k).name) + '">' +
        '<span class="hx' + (a ? " hx-a" : "") + '" title="' + (a ? "Alpha ." + a + " is preserved when you use the picker. Click the text to edit the whole value." : "Click the text to type a value") + '">' + esc(s) + "</span></div>";
    }
    if (g === "url") return '<div class="t-cell' + d + '"><a class="t-url" href="' + esc(String(v).trim()) + '" target="_blank" rel="noopener noreferrer">' + esc(String(v).trim()) + "</a></div>";
    if (g === "empty") return '<div class="t-cell' + d + '"><span class="t-empty" title="empty"></span></div>';
    return '<div class="t-cell' + d + '">' + esc(v) + "</div>";
  }

  /* Surgical DOM patch. Rebuilding <tbody> on every keystroke threw away
     horizontal scroll on a 35-column file; that is the main path here. */
  function patchCell(rid, k) {
    var td = document.querySelector('td[data-r="' + rid + '"][data-k="' + k + '"]');
    var r = byId(rid);
    if (!td || !r) return;
    td.className = (gate(r.c[k]) === "hex" ? "gate-hex" : "editable") + (dirty(r, k) ? " has-dirty" : "");
    td.innerHTML = cellHTML(r, k);
    wireCell(td);
    afterEdit(rid, k);
  }
  /* Live picker drag: touch the label + tint only. Replacing the <input>
     mid-pick detaches the OS colour dialog from its anchor. */
  function softCell(rid, k) {
    var td = document.querySelector('td[data-r="' + rid + '"][data-k="' + k + '"]');
    var r = byId(rid);
    if (!td || !r) return;
    var lab = td.querySelector(".hx"), cell = td.querySelector(".t-cell");
    if (lab) lab.textContent = String(r.c[k]);
    if (cell) cell.classList.toggle("is-dirty", dirty(r, k));
    td.classList.toggle("has-dirty", dirty(r, k));
    afterEdit(rid, k);
  }
  function afterEdit(rid, k) {
    var st = document.querySelector('th.cstat-cell[data-k="' + k + '"] .cstat');
    if (st) st.innerHTML = colStat(k);
    paintDiff();
    if (bgKey() === k) {
      var tr = document.querySelector('tr[data-r="' + rid + '"]'), r = byId(rid);
      if (tr && r) {
        var t = tintOf(r);
        tr.style.background = t ? t.bg : "";
        tr.style.color = t ? t.fg : "";
        tr.classList.toggle("tinted", !!t);
      }
    }
    renderSide();
  }

  function wireCell(td) {
    var rid = +td.dataset.r, k = td.dataset.k;
    var sw = td.querySelector('input[type="color"].sw');
    if (sw) {
      sw.oninput = function () { setHex(rid, k, sw.value); softCell(rid, k); };
      sw.onchange = function () { setHex(rid, k, sw.value); softCell(rid, k); };
      var lab = td.querySelector(".hx");
      if (lab) lab.onclick = function (e) { e.stopPropagation(); editText(td, rid, k); };
      return;
    }
    td.onclick = function (e) { if (!e.target.closest("a")) editText(td, rid, k); };
  }
  function setHex(rid, k, picked) {
    var r = byId(rid); if (!r) return;
    r.c[k] = picked + alphaOf(r.c[k]);
  }
  function editText(td, rid, k) {
    if (!td || td.querySelector(".t-input")) return;
    var r = byId(rid); if (!r) return;
    var old = r.c[k] == null ? "" : r.c[k], done = false;
    td.innerHTML = '<input class="t-input" value="' + esc(old) + '">';
    var inp = td.querySelector(".t-input");
    inp.focus(); inp.select();
    function commit(save) {
      if (done) return; done = true;
      if (save) r.c[k] = inp.value;
      patchCell(rid, k);
    }
    inp.onblur = function () { commit(true); };
    inp.onkeydown = function (e) {
      if (e.key === "Enter") { e.preventDefault(); commit(true); }
      else if (e.key === "Escape") { e.preventDefault(); commit(false); }
      else if (e.key === "Tab") {
        e.preventDefault(); commit(true);
        var cells = [].slice.call(document.querySelectorAll("td.editable, td.gate-hex"));
        var cur = document.querySelector('td[data-r="' + rid + '"][data-k="' + k + '"]');
        var nx = cells[cells.indexOf(cur) + (e.shiftKey ? -1 : 1)];
        if (nx) { nx.scrollIntoView({ block: "nearest", inline: "nearest" }); editText(nx, +nx.dataset.r, nx.dataset.k); }
      }
    };
  }

  /* ---------------- diff banner ---------------- */
  function paintDiff() {
    var host = $("#diffHost"); if (!host) return;
    var d = diff();
    if (!d.any) { host.innerHTML = ""; return; }
    var b = [];
    if (d.cells) b.push("<b>" + d.cells + "</b> cell" + (d.cells === 1 ? "" : "s") + " changed");
    if (d.added) b.push("<b>" + d.added + "</b> row" + (d.added === 1 ? "" : "s") + " added");
    if (d.removed) b.push("<b>" + d.removed + "</b> row" + (d.removed === 1 ? "" : "s") + " deleted");
    if (d.colsChanged) b.push("<b>columns</b> changed");
    host.innerHTML = '<div class="diffbar"><span>' + b.join(" \u00b7 ") + '</span><span class="rt">' +
      '<button type="button" class="pill-btn' + (T.hl ? " on" : "") + '" id="hlBtn">Highlight changes</button>' +
      '<button type="button" class="pill-btn" id="revBtn">Revert all</button></span></div>';
    $("#hlBtn").onclick = function () { T.hl = !T.hl; document.body.classList.toggle("hl-diff", T.hl); paintDiff(); };
    $("#revBtn").onclick = function (e) {
      var rc = e.target.getBoundingClientRect();
      openPop(rc.left - 60, rc.bottom + 6, [{ label: "Discard every change", danger: true, confirm: true, run: function () {
        T.cols = T.cols.slice(); T.sig = sigOf(T.cols);
        T.rows = T.origIds.map(function (id) { var o = T.orig[id], c = {}; for (var k in o) c[k] = o[k]; return { id: id, c: c }; });
        T.sig = sigOf(T.cols); T.sel = null; T.hl = false;
        document.body.classList.remove("hl-diff"); invalidate(); full(); toast("Reverted to imported state");
      } }]);
    };
  }

  /* ---------------- table view ---------------- */
  function renderTable() {
    var rows = ordered(), h = '<div id="diffHost"></div><div class="tbl-wrap"><table><thead><tr><th class="rownum">#</th>';
    T.cols.forEach(function (col) {
      var a = T.sortK === col.k ? (T.sortDir === 1 ? "\u25b2" : T.sortDir === 2 ? "\u25bc" : "") : "";
      h += '<th class="sortable" data-k="' + col.k + '"><span class="th-in"><span class="th-name">' + esc(col.name) + "</span>" +
        (a ? '<span class="arrow">' + a + "</span>" : "") +
        '<button type="button" class="colmenu" data-k="' + col.k + '" aria-label="Column options">\u22ee</button></span></th>';
    });
    h += '</tr><tr class="statrow"><th class="rownum"></th>';
    T.cols.forEach(function (col) { h += '<th class="cstat-cell" data-k="' + col.k + '"><span class="cstat">' + colStat(col.k) + "</span></th>"; });
    h += "</tr></thead><tbody>";
    rows.forEach(function (r, n) {
      var t = tintOf(r), cls = [];
      if (!T.orig[r.id]) cls.push("row-added");
      if (T.sel === r.id) cls.push("sel");
      if (t) cls.push("tinted");
      h += "<tr data-r=\"" + r.id + "\"" + (cls.length ? ' class="' + cls.join(" ") + '"' : "") +
        (t ? ' style="background:' + t.bg + ";color:" + t.fg + '"' : "") +
        '><td class="rownum" data-row="' + r.id + '">' + (n + 1) + "</td>";
      T.cols.forEach(function (col) {
        h += '<td class="' + (gate(r.c[col.k]) === "hex" ? "gate-hex" : "editable") + (dirty(r, col.k) ? " has-dirty" : "") +
          '" data-r="' + r.id + '" data-k="' + col.k + '">' + cellHTML(r, col.k) + "</td>";
      });
      h += "</tr>";
    });
    $("#content").innerHTML = h + "</tbody></table></div>";
    document.body.classList.toggle("hl-diff", T.hl);
    wireTable();
    paintDiff();
    stickyOffset();
  }
  /* The stat row sits under the header row. Measure it; a hardcoded offset
     breaks the moment a long column name wraps. */
  function stickyOffset() {
    var hr = document.querySelector("thead tr:first-child th");
    if (hr) document.documentElement.style.setProperty("--th-h", hr.offsetHeight + "px");
  }
  function wireTable() {
    var c = $("#content");
    c.querySelectorAll("th.sortable").forEach(function (th) {
      th.onclick = function (e) {
        if (e.target.closest(".colmenu") || e.target.closest(".th-edit")) return;
        var k = th.dataset.k;
        if (T.sortK !== k) { T.sortK = k; T.sortDir = 1; }
        else T.sortDir = (T.sortDir + 1) % 3;
        if (T.sortDir === 0) T.sortK = null;
        invalidate(); renderTable();
      };
    });
    c.querySelectorAll(".colmenu").forEach(function (b) {
      b.onclick = function (e) {
        e.stopPropagation();
        var k = b.dataset.k, i = T.cols.indexOf(colOf(k)), rc = b.getBoundingClientRect();
        openPop(rc.left, rc.bottom + 4, [
          { label: "Rename column", run: function () { renameCol(k); } },
          { label: "Insert column left", run: function () { insertCol(i); } },
          { label: "Insert column right", run: function () { insertCol(i + 1); } },
          "-",
          { label: "Delete column", danger: true, confirm: true, run: function () {
              if (T.cols.length === 1) { toast("Cannot delete the last column"); return; }
              T.cols.splice(i, 1);
              T.rows.forEach(function (r) { delete r.c[k]; });
              if (T.sortK === k) { T.sortK = null; T.sortDir = 0; invalidate(); }
              full();
            } }
        ]);
      };
    });
    c.querySelectorAll("td.rownum").forEach(function (td) {
      td.onclick = function () {
        var id = +td.dataset.row;
        T.sel = T.sel === id ? null : id;
        c.querySelectorAll("tbody tr").forEach(function (tr) { tr.classList.toggle("sel", +tr.dataset.r === T.sel); });
        renderBar();
      };
    });
    c.querySelectorAll("td.editable, td.gate-hex").forEach(wireCell);
  }
  function renameCol(k) {
    var th = document.querySelector('th.sortable[data-k="' + k + '"]');
    var col = colOf(k); if (!th || !col) return;
    var span = th.querySelector(".th-name"); if (!span) return;
    var old = col.name, done = false;
    span.innerHTML = '<input class="t-input th-edit" value="' + esc(old) + '">';
    var inp = span.querySelector("input");
    inp.focus(); inp.select();
    function commit(save) {
      if (done) return; done = true;
      if (save) {
        var nv = inp.value.trim();
        if (!nv) toast("Column name cannot be blank");
        else if (T.cols.some(function (x) { return x !== col && x.name === nv; })) toast("A column called \u201c" + nv + "\u201d already exists");
        else col.name = nv;
      }
      full();
    }
    inp.onblur = function () { commit(true); };
    inp.onkeydown = function (e) {
      if (e.key === "Enter") { e.preventDefault(); commit(true); }
      else if (e.key === "Escape") { e.preventDefault(); commit(false); }
    };
  }
  function insertCol(at) {
    var base = "column", n = 1, nm = base + " " + n;
    while (T.cols.some(function (c) { return c.name === nm; })) { n++; nm = base + " " + n; }
    var col = { k: "k" + (++KEY), name: nm };
    T.cols.splice(at, 0, col);
    T.rows.forEach(function (r) { r.c[col.k] = ""; });
    full();
  }

  /* ---------------- swatch band view ---------------- */
  function renderBands() {
    var hexKeys = T.cols.filter(function (col) {
      return T.rows.some(function (r) { return gate(r.c[col.k]) === "hex"; });
    });
    if (!hexKeys.length) {
      $("#content").innerHTML = '<div class="errbox">' + IC.err + "<div><b>No colour values in this file.</b><br>Swatches has something to draw only when at least one cell holds a hex code. Switch back to Table.</div></div>";
      return;
    }
    var lk = labelKey(), h = '<div id="diffHost"></div><div class="bands">';
    ordered().forEach(function (r) {
      var t = tintOf(r), n = hexKeys.filter(function (col) { return gate(r.c[col.k]) === "hex"; }).length;
      h += '<div class="band" data-r="' + r.id + '"' +
        (t ? ' style="background:' + t.bg + ";color:" + t.fg + ";border-color:" + (lum(t.bg) > 0.5 ? "oklch(0.55 0 0)" : "oklch(0.42 0 0)") + '"' : "") +
        '><div class="band-head"><span class="band-name">' + esc(lk ? (r.c[lk] || "(untitled)") : "(row)") +
        '</span><span class="band-sub">' + n + " colours" + (t ? " \u00b7 tinted by bg" : "") + '</span></div><div class="chips">';
      hexKeys.forEach(function (col) {
        if (gate(r.c[col.k]) !== "hex") return;
        h += '<span class="chip"><input type="color" class="sw" value="' + hx6(r.c[col.k]) +
          '" data-r="' + r.id + '" data-k="' + col.k + '" aria-label="' + esc(col.name) + '"><span class="chip-k">' + esc(col.name) + "</span></span>";
      });
      h += "</div></div>";
    });
    $("#content").innerHTML = h + "</div>";
    $("#content").querySelectorAll('input[type="color"].sw').forEach(function (inp) {
      var rid = +inp.dataset.r, k = inp.dataset.k;
      function apply() {
        setHex(rid, k, inp.value);
        var band = document.querySelector('.band[data-r="' + rid + '"]'), r = byId(rid);
        if (band && bgKey() === k && r) {
          var t = tintOf(r);
          band.style.background = t ? t.bg : "";
          band.style.color = t ? t.fg : "";
        }
        paintDiff(); renderSide();
      }
      inp.oninput = apply; inp.onchange = apply;
    });
    paintDiff();
  }

  /* ---------------- side panel ---------------- */
  function renderSide() {
    var hex = 0, empty = 0, tot = T.rows.length * T.cols.length;
    T.rows.forEach(function (r) {
      T.cols.forEach(function (col) { var g = gate(r.c[col.k]); if (g === "hex") hex++; else if (g === "empty") empty++; });
    });
    var rows = [["Source", T.fmt.toUpperCase()], ["Rows", T.rows.length], ["Columns", T.cols.length],
      ["Cells", tot], ["Colour cells", hex], ["Empty cells", empty]];
    $("#stats").innerHTML = rows.map(function (r) {
      return '<div class="stat-row"><span class="k">' + r[0] + '</span><span class="v">' + r[1] + "</span></div>";
    }).join("");

    var f = [];
    if (hex) f.push({ s: "info", b: "Colour data", x: hex + " of " + tot + " cells are hex codes. Swatches renders them as bands." });
    if (bgKey()) f.push({ s: "info", b: "bg column found", x: "Rows are tinted to their own background colour. Toggle it in Settings." });
    var names = {}, dup = 0;
    T.cols.forEach(function (c) { if (names[c.name]) dup++; names[c.name] = 1; });
    if (dup) f.push({ s: "warn", b: "Duplicate headers", x: dup + " repeated column name(s). A JSON export keeps only the last of each." });
    if (tot && empty / tot > 0.3) f.push({ s: "info", b: "Sparse data", x: Math.round(empty / tot * 100) + "% of cells are empty." });
    if (T.rows.length > 800) f.push({ s: "warn", b: "Large table", x: T.rows.length + " rows render un-virtualised. Editing may feel sluggish." });

    var el = $("#flags");
    if (!f.length) { el.innerHTML = '<h3>Flags</h3><div class="no-flags">' + IC.ok + " Clean. Nothing weird detected.</div>"; return; }
    el.innerHTML = "<h3>Flags \u00b7 " + f.length + "</h3>" + f.map(function (fl) {
      return '<div class="flag ' + fl.s + '">' + IC[fl.s === "warn" ? "warn" : "info"] + "<div><b>" + fl.b + ".</b> <span class=\"fx\">" + esc(fl.x) + "</span></div></div>";
    }).join("");
  }

  /* ---------------- export bar ----------------
     Row buttons use .rbtn, NOT .btn: prism.mobile.js stretches every .btn to
     full width in the bottom sheet and closes the sheet when one is tapped. */
  function renderBar() {
    var sel = T.sel != null ? byId(T.sel) : null;
    $("#exportbar").innerHTML =
      '<div class="rowops"><span class="lbl">Row</span>' +
      '<button type="button" class="rbtn" id="rAdd">Add</button>' +
      '<button type="button" class="rbtn" id="rDup"' + (sel ? "" : " disabled") + ">Duplicate</button>" +
      '<button type="button" class="rbtn danger" id="rDel"' + (sel ? "" : " disabled") + ">Delete</button>" +
      '<span class="hint">' + (sel ? "row selected" : "click a row number") + "</span></div>" +
      '<div class="spacer"></div>' +
      '<label class="toggle"><input type="checkbox" id="expSorted"' + (T.expSorted ? " checked" : "") + '><span>Export sorted order</span></label>' +
      '<select class="mini-sel" id="expFmt" aria-label="Export format"><option value="tsv">TSV</option><option value="csv">CSV</option><option value="json">JSON</option></select>' +
      '<button type="button" class="btn primary" id="expBtn">Export</button>';
    $("#expFmt").value = T.fmt === "json" ? "json" : (T.delim === "," ? "csv" : "tsv");
    $("#expSorted").onchange = function () { T.expSorted = this.checked; };
    $("#rAdd").onclick = function () {
      var c = {}; T.cols.forEach(function (col) { c[col.k] = ""; });
      var r = { id: ++UID, c: c };
      T.rows.splice(sel ? T.rows.indexOf(sel) + 1 : T.rows.length, 0, r);
      T.sel = r.id; invalidate(); full(); toast("Row added");
    };
    if (sel) {
      $("#rDup").onclick = function () {
        var c = {}; for (var k in sel.c) c[k] = sel.c[k];
        var r = { id: ++UID, c: c };
        T.rows.splice(T.rows.indexOf(sel) + 1, 0, r);
        T.sel = r.id; invalidate(); full(); toast("Row duplicated");
      };
      $("#rDel").onclick = function (e) {
        var rc = e.target.getBoundingClientRect();
        openPop(rc.left, rc.top - 46, [{ label: "Delete row", danger: true, confirm: true, run: function () {
          T.rows.splice(T.rows.indexOf(sel), 1); T.sel = null; invalidate(); full(); toast("Row deleted");
        } }]);
      };
    }
    $("#expBtn").onclick = function () {
      var f = $("#expFmt").value, base = (S.fname.replace(/\.[^.]+$/, "") || "data");
      if (f === "json") download(base + ".json", toJSON(), "application/json");
      else if (f === "csv") download(base + ".csv", toDelim(","), "text/csv");
      else download(base + ".tsv", toDelim("\t"), "text/tab-separated-values");
      toast(f.toUpperCase() + " exported");
    };
  }

  function full() {
    renderSide(); renderBar();
    $("#fmeta").textContent = T.rows.length + " rows \u00b7 " + T.cols.length + " cols";
    if (T.view === "bands") renderBands();
    else if (T.view === "raw") renderRaw();
    else renderTable();
  }
  function renderRaw() {
    $("#content").innerHTML = '<pre class="raw">' + esc(T.fmt === "json" ? toJSON() : toDelim(T.delim)) + "</pre>";
  }

  function fail(msg) {
    $("#content").innerHTML = '<div class="errbox">' + IC.err + "<div><b>Cannot open this as a table.</b><br>" + msg + "</div></div>";
    $("#stats").innerHTML = ""; $("#flags").innerHTML = ""; $("#viewSeg").innerHTML = ""; $("#exportbar").innerHTML = "";
    $("#fmeta").textContent = "parse error";
  }

  /* ---------------- registration ---------------- */
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
         common in prose to steal a file from the Markdown lens. */
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
        arr.forEach(function (o) { Object.keys(o).forEach(function (k) { if (!seen[k]) { seen[k] = 1; cols.push(k); } }); });
        if (!cols.length) { fail("The JSON array has no fields to show."); return false; }
        T = build(cols, arr.map(function (o) {
          return cols.map(function (k) { return o[k] == null ? "" : String(o[k]); });
        }), "json", ",");
      } else {
        var d = /\.csv$/i.test(S.fname) ? "," : (/\.(tsv|tab)$/i.test(S.fname) ? "\t" : sniff(raw));
        var m = parse(raw, d);
        if (m.length < 2) { fail("Only found a header row. Nothing to edit."); return false; }
        var fix = {};
        var head = m[0].map(function (h, i) {
          h = String(h).trim() || "column " + (i + 1);
          if (fix[h]) { fix[h]++; return h + " (" + fix[h] + ")"; }
          fix[h] = 1; return h;
        });
        T = build(head, m.slice(1), d === "," ? "csv" : (d === ";" ? "csv" : "tsv"), d);
      }
      S.table = T;
      $("#side").style.display = "";
      $("#viewSeg").innerHTML = '<button type="button" data-v="table">Table</button><button type="button" data-v="bands">Swatches</button><button type="button" data-v="raw">Raw</button>';
      return true;
    },
    defaultView: "table",
    render: function (v) { T = S.table; T.view = v; full(); },
    onSetting: function () { if (T) full(); }
  });
})();
