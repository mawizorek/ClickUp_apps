/* Prism — Table lens · GRID.
   The editable table: gated cell rendering, in-place patching, inline text
   editing, sort headers, column operations, pinned columns, the diff banner.
   Engine: prism.table.js (TB). Panels: prism.table.panels.js (TBUI.side/bar/bands). */
(function () {
  "use strict";

  var TBUI = window.TBUI = window.TBUI || {};

  /* ---------------- popover ----------------
     Deliberately NOT window.confirm / window.prompt. Both are blocked inside a
     sandboxed iframe, and a blocked confirm() returns false, so a Delete would
     silently do nothing and say nothing. Destructive items arm on first click
     and fire on the second. */
  var pop = null;
  function closePop() { if (pop) { pop.remove(); pop = null; } }
  TBUI.closePop = closePop;
  document.addEventListener("mousedown", function (e) { if (pop && !pop.contains(e.target)) closePop(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closePop(); });

  TBUI.pop = function (x, y, items) {
    closePop();
    pop = document.createElement("div");
    pop.className = "pop";
    items.forEach(function (it) {
      if (it === "-") { pop.appendChild(document.createElement("hr")); return; }
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = it.label;
      if (it.danger) b.className = "danger";
      b.onclick = function () {
        if (it.confirm && b.dataset.armed !== "1") {
          b.dataset.armed = "1";
          b.textContent = "Confirm: " + it.label;
          b.className = "danger armed";
          return;
        }
        closePop();
        it.run();
      };
      pop.appendChild(b);
    });
    pop.style.left = Math.max(8, Math.min(x, window.innerWidth - 200)) + "px";
    pop.style.top = Math.max(8, Math.min(y, window.innerHeight - 260)) + "px";
    document.body.appendChild(pop);
  };

  /* ---------------- cell rendering ---------------- */
  function cellHTML(r, k) {
    var v = r.c[k] == null ? "" : r.c[k],
        g = TB.gate(v),
        d = TB.dirty(r, k) ? " is-dirty" : "";
    if (g === "hex") {
      var s = String(v).trim(), a = TB.alpha(s);
      return '<div class="t-cell' + d + '">' +
        '<input type="color" class="sw" value="' + TB.hx6(s) + '" data-r="' + r.id +
        '" data-k="' + k + '" aria-label="' + esc(TB.colOf(k).name) + '">' +
        '<span class="hx' + (a ? " hx-a" : "") + '" title="' +
        (a ? "Alpha ." + a + " is preserved when you use the picker. Click the text to edit the whole value."
           : "Click the text to type a value") +
        '">' + esc(s) + "</span></div>";
    }
    if (g === "url") {
      var u = String(v).trim();
      return '<div class="t-cell' + d + '"><a class="t-url" href="' + esc(u) +
        '" target="_blank" rel="noopener noreferrer">' + esc(u) + "</a></div>";
    }
    if (g === "empty") return '<div class="t-cell' + d + '"><span class="t-empty" title="empty"></span></div>';
    return '<div class="t-cell' + d + '">' + esc(v) + "</div>";
  }
  TBUI.cellHTML = cellHTML;

  function tdOf(rid, k) { return document.querySelector('td[data-r="' + rid + '"][data-k="' + k + '"]'); }

  /* Surgical DOM patch after a commit. Rebuilding <tbody> threw away horizontal
     scroll, and on a 35-column palette file that is the main path, not an edge. */
  function patchCell(rid, k) {
    var td = tdOf(rid, k), r = TB.byId(rid);
    if (!td || !r) return;
    var pinned = td.classList.contains("pin"), left = td.style.left;
    td.className = (TB.gate(r.c[k]) === "hex" ? "gate-hex" : "editable") +
      (TB.dirty(r, k) ? " has-dirty" : "") + (pinned ? " pin" : "");
    if (pinned) td.style.left = left;
    td.innerHTML = cellHTML(r, k);
    wireCell(td);
    afterEdit(rid, k);
  }
  /* Live picker drag: touch the label and the tint only. Replacing the <input>
     mid-pick detaches the OS colour dialog from its anchor element. */
  function softCell(rid, k) {
    var td = tdOf(rid, k), r = TB.byId(rid);
    if (!td || !r) return;
    var lab = td.querySelector(".hx"), cell = td.querySelector(".t-cell");
    if (lab) lab.textContent = String(r.c[k]);
    var d = TB.dirty(r, k);
    if (cell) cell.classList.toggle("is-dirty", d);
    td.classList.toggle("has-dirty", d);
    afterEdit(rid, k);
  }
  function afterEdit(rid, k) {
    var st = document.querySelector('th.cstat-cell[data-k="' + k + '"] .cstat');
    if (st) st.innerHTML = TB.colStat(k);
    TBUI.paintDiff();
    if (TB.bgKey() === k) {
      var tr = document.querySelector('tr[data-r="' + rid + '"]'), r = TB.byId(rid);
      if (tr && r) {
        var t = TB.tintOf(r);
        tr.style.background = t ? t.bg : "";
        tr.style.color = t ? t.fg : "";
        tr.classList.toggle("tinted", !!t);
      }
    }
    TBUI.side();
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
  TBUI.wireCell = wireCell;

  function setHex(rid, k, picked) {
    var r = TB.byId(rid);
    if (r) r.c[k] = picked + TB.alpha(r.c[k]);
  }
  TBUI.setHex = setHex;

  function editText(td, rid, k) {
    if (!td || td.querySelector(".t-input")) return;
    var r = TB.byId(rid);
    if (!r) return;
    var old = r.c[k] == null ? "" : r.c[k], done = false;
    td.innerHTML = '<input class="t-input" value="' + esc(old) + '">';
    var inp = td.querySelector(".t-input");
    inp.focus();
    inp.select();
    function commit(save) {
      if (done) return;
      done = true;
      if (save) r.c[k] = inp.value;
      patchCell(rid, k);
    }
    inp.onblur = function () { commit(true); };
    inp.onkeydown = function (e) {
      if (e.key === "Enter") { e.preventDefault(); commit(true); }
      else if (e.key === "Escape") { e.preventDefault(); commit(false); }
      else if (e.key === "Tab") {
        e.preventDefault();
        commit(true);
        var cells = [].slice.call(document.querySelectorAll("td.editable, td.gate-hex"));
        var nx = cells[cells.indexOf(tdOf(rid, k)) + (e.shiftKey ? -1 : 1)];
        if (nx) {
          nx.scrollIntoView({ block: "nearest", inline: "nearest" });
          editText(nx, +nx.dataset.r, nx.dataset.k);
        }
      }
    };
  }

  /* ---------------- diff banner ---------------- */
  TBUI.paintDiff = function () {
    var host = $("#diffHost");
    if (!host) return;
    var d = TB.diff();
    if (!d.any) { host.innerHTML = ""; return; }
    var b = [];
    if (d.cells) b.push("<b>" + d.cells + "</b> cell" + (d.cells === 1 ? "" : "s") + " changed");
    if (d.added) b.push("<b>" + d.added + "</b> row" + (d.added === 1 ? "" : "s") + " added");
    if (d.removed) b.push("<b>" + d.removed + "</b> row" + (d.removed === 1 ? "" : "s") + " deleted");
    if (d.colsChanged) b.push("<b>columns</b> changed");
    host.innerHTML = '<div class="diffbar"><span>' + b.join(" \u00b7 ") + '</span><span class="rt">' +
      '<button type="button" class="pill-btn' + (TB.T.hl ? " on" : "") + '" id="hlBtn">Highlight changes</button>' +
      '<button type="button" class="pill-btn" id="revBtn">Revert all</button></span></div>';
    $("#hlBtn").onclick = function () {
      TB.T.hl = !TB.T.hl;
      document.body.classList.toggle("hl-diff", TB.T.hl);
      TBUI.paintDiff();
    };
    $("#revBtn").onclick = function (e) {
      var rc = e.target.getBoundingClientRect();
      TBUI.pop(rc.left - 60, rc.bottom + 6, [{
        label: "Discard every change", danger: true, confirm: true,
        run: function () {
          TB.revert();
          document.body.classList.remove("hl-diff");
          TBUI.full();
          toast("Reverted to imported state");
        }
      }]);
    };
  };

  /* ---------------- pinned columns ----------------
     Offsets are MEASURED from the rendered header, never assumed: column widths
     depend on content, so a hardcoded number would drift the moment a value or
     a column name changed. */
  function applyPins() {
    var tbl = document.querySelector(".tbl-wrap table");
    if (!tbl) return;
    var pins = TB.T.pinned;
    if (!pins.length) return;
    var rn = tbl.querySelector("thead th.rownum");
    var x = rn ? rn.offsetWidth : 0;
    pins.forEach(function (k, i) {
      var head = tbl.querySelector('thead tr:first-child th[data-k="' + k + '"]');
      var cells = tbl.querySelectorAll('th[data-k="' + k + '"], td[data-k="' + k + '"]');
      var last = i === pins.length - 1;
      for (var c = 0; c < cells.length; c++) {
        cells[c].style.left = x + "px";
        cells[c].classList.toggle("pin-last", last);
      }
      x += head ? head.offsetWidth : 0;
    });
  }
  TBUI.applyPins = applyPins;

  /* A pin costs permanent horizontal room. Past roughly half the viewport there
     is nothing left to scroll, which defeats the point of pinning. Measured
     against the live header, then refused rather than shipped broken. */
  function pinFits(k) {
    var wrap = document.querySelector(".tbl-wrap");
    var tbl = wrap && wrap.querySelector("table");
    if (!wrap || !tbl) return true;
    var rn = tbl.querySelector("thead th.rownum");
    var used = rn ? rn.offsetWidth : 0;
    TB.T.pinned.concat([k]).forEach(function (pk) {
      var h = tbl.querySelector('thead tr:first-child th[data-k="' + pk + '"]');
      if (h) used += h.offsetWidth;
    });
    return used <= wrap.clientWidth * 0.55;
  }

  function togglePin(k) {
    if (TB.isPinned(k)) { TB.unpin(k); TBUI.grid(); return; }
    if (TB.T.pinned.length >= TB.T.cols.length - 1) {
      toast("At least one column has to stay unpinned");
      return;
    }
    if (!pinFits(k)) {
      toast("That pin would fill over half the view. Unpin something first.");
      return;
    }
    TB.pin(k);
    TBUI.grid();
  }

  var rzT = null;
  window.addEventListener("resize", function () {
    clearTimeout(rzT);
    rzT = setTimeout(function () { if (TB.T && TB.T.view === "table") applyPins(); }, 120);
  });

  /* ---------------- table view ---------------- */
  TBUI.grid = function () {
    var T = TB.T, rows = TB.ordered(), cols = TB.displayCols();
    var h = '<div id="diffHost"></div><div class="tbl-wrap"><table><thead><tr><th class="rownum">#</th>';
    cols.forEach(function (col) {
      var p = TB.isPinned(col.k);
      var a = T.sortK === col.k ? (T.sortDir === 1 ? "\u25b2" : T.sortDir === 2 ? "\u25bc" : "") : "";
      h += '<th class="sortable' + (p ? " pin" : "") + '" data-k="' + col.k + '"><span class="th-in">' +
        (p ? '<span class="pin-dot" title="Pinned">\u25c9</span>' : "") +
        '<span class="th-name">' + esc(col.name) + "</span>" +
        (a ? '<span class="arrow">' + a + "</span>" : "") +
        '<button type="button" class="colmenu" data-k="' + col.k + '" aria-label="Column options">\u22ee</button>' +
        "</span></th>";
    });
    h += '</tr><tr class="statrow"><th class="rownum"></th>';
    cols.forEach(function (col) {
      h += '<th class="cstat-cell' + (TB.isPinned(col.k) ? " pin" : "") + '" data-k="' + col.k +
        '"><span class="cstat">' + TB.colStat(col.k) + "</span></th>";
    });
    h += "</tr></thead><tbody>";
    rows.forEach(function (r, n) {
      var t = TB.tintOf(r), cls = [];
      if (!T.orig[r.id]) cls.push("row-added");
      if (T.sel === r.id) cls.push("sel");
      if (t) cls.push("tinted");
      h += '<tr data-r="' + r.id + '"' + (cls.length ? ' class="' + cls.join(" ") + '"' : "") +
        (t ? ' style="background:' + t.bg + ";color:" + t.fg + '"' : "") +
        '><td class="rownum" data-row="' + r.id + '">' + (n + 1) + "</td>";
      cols.forEach(function (col) {
        h += '<td class="' + (TB.gate(r.c[col.k]) === "hex" ? "gate-hex" : "editable") +
          (TB.dirty(r, col.k) ? " has-dirty" : "") + (TB.isPinned(col.k) ? " pin" : "") +
          '" data-r="' + r.id + '" data-k="' + col.k + '">' + cellHTML(r, col.k) + "</td>";
      });
      h += "</tr>";
    });
    $("#content").innerHTML = h + "</tbody></table></div>";
    document.body.classList.toggle("hl-diff", T.hl);
    wireGrid();
    TBUI.paintDiff();
    stickyOffset();
    applyPins();
  };

  /* The stat row sticks below the header row. Measure the header instead of
     hardcoding an offset, which breaks the moment a long name wraps. */
  function stickyOffset() {
    var th = document.querySelector("thead tr:first-child th");
    if (th) document.documentElement.style.setProperty("--th-h", th.offsetHeight + "px");
  }

  function wireGrid() {
    var c = $("#content");
    c.querySelectorAll("th.sortable").forEach(function (th) {
      th.onclick = function (e) {
        if (e.target.closest(".colmenu") || e.target.closest(".th-edit")) return;
        var T = TB.T, k = th.dataset.k;
        if (T.sortK !== k) { T.sortK = k; T.sortDir = 1; }
        else T.sortDir = (T.sortDir + 1) % 3;
        if (T.sortDir === 0) T.sortK = null;
        TB.invalidate();
        TBUI.grid();
      };
    });
    c.querySelectorAll(".colmenu").forEach(function (b) {
      b.onclick = function (e) {
        e.stopPropagation();
        var k = b.dataset.k, i = TB.T.cols.indexOf(TB.colOf(k)), rc = b.getBoundingClientRect();
        TBUI.pop(rc.left, rc.bottom + 4, [
          { label: TB.isPinned(k) ? "Unpin column" : "Pin to left (view only)", run: function () { togglePin(k); } },
          "-",
          { label: "Rename column", run: function () { renameCol(k); } },
          { label: "Insert column left", run: function () { insertCol(i); } },
          { label: "Insert column right", run: function () { insertCol(i + 1); } },
          "-",
          {
            label: "Delete column", danger: true, confirm: true,
            run: function () {
              var T = TB.T;
              if (T.cols.length === 1) { toast("Cannot delete the last column"); return; }
              T.cols.splice(i, 1);
              T.rows.forEach(function (r) { delete r.c[k]; });
              TB.unpin(k);
              if (T.sortK === k) { T.sortK = null; T.sortDir = 0; TB.invalidate(); }
              TBUI.full();
            }
          }
        ]);
      };
    });
    c.querySelectorAll("td.rownum").forEach(function (td) {
      td.onclick = function () {
        var id = +td.dataset.row;
        TB.T.sel = TB.T.sel === id ? null : id;
        c.querySelectorAll("tbody tr").forEach(function (tr) {
          tr.classList.toggle("sel", +tr.dataset.r === TB.T.sel);
        });
        TBUI.bar();
      };
    });
    c.querySelectorAll("td.editable, td.gate-hex").forEach(wireCell);
  }

  function renameCol(k) {
    var th = document.querySelector('th.sortable[data-k="' + k + '"]'), col = TB.colOf(k);
    if (!th || !col) return;
    var span = th.querySelector(".th-name");
    if (!span) return;
    var done = false;
    span.innerHTML = '<input class="t-input th-edit" value="' + esc(col.name) + '">';
    var inp = span.querySelector("input");
    inp.focus();
    inp.select();
    function commit(save) {
      if (done) return;
      done = true;
      if (save) {
        var nv = inp.value.trim();
        if (!nv) toast("Column name cannot be blank");
        else if (TB.T.cols.some(function (x) { return x !== col && x.name === nv; }))
          toast("A column called \u201c" + nv + "\u201d already exists");
        else col.name = nv;
      }
      TBUI.full();
    }
    inp.onblur = function () { commit(true); };
    inp.onkeydown = function (e) {
      if (e.key === "Enter") { e.preventDefault(); commit(true); }
      else if (e.key === "Escape") { e.preventDefault(); commit(false); }
    };
  }

  function insertCol(at) {
    var T = TB.T, base = "column", n = 1, nm = base + " " + n;
    while (T.cols.some(function (c) { return c.name === nm; })) { n++; nm = base + " " + n; }
    var col = { k: TB.newKey(), name: nm };
    T.cols.splice(at, 0, col);
    T.rows.forEach(function (r) { r.c[col.k] = ""; });
    TBUI.full();
  }

  TBUI.raw = function () {
    $("#content").innerHTML = '<pre class="raw">' +
      esc(TB.T.fmt === "json" ? TB.toJSON() : TB.toDelim(TB.T.delim)) + "</pre>";
  };

  TBUI.full = function () {
    TBUI.side();
    TBUI.bar();
    $("#fmeta").textContent = TB.T.rows.length + " rows \u00b7 " + TB.T.cols.length + " cols" +
      (TB.T.pinned.length ? " \u00b7 " + TB.T.pinned.length + " pinned" : "");
    if (TB.T.view === "bands") TBUI.bands();
    else if (TB.T.view === "raw") TBUI.raw();
    else TBUI.grid();
  };
})();
