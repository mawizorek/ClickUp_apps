/* Prism — Table lens · CELL.
   ONE CELL, start to finish: gate → markup, in-place patching after a commit,
   inline text editing, and the per-cell event wiring.

   This is the RENDER half of the old prism.table.grid.js, which reached
   16,829 B — over the 15KB split line. The seam is deliberate:
     prism.table.cell.js  — what a single cell looks like and how it is edited
     prism.table.grid.js  — how cells are ASSEMBLED into a table (headers, sort,
                            pins, column ops, the diff banner)
   If you are changing what a value looks like, you are in this file. If you are
   changing the shape of the table around it, you are in the other one.

   ⚠️ CROSS-FILE CALLS RESOLVE THROUGH THE `TBUI` NAMESPACE AT CALL TIME, NEVER
   AT LOAD TIME. This file loads before grid.js and panels.js and still calls
   TBUI.paintDiff() (grid) and TBUI.side() (panels) — legal because nothing here
   runs until a file is open. Never hoist one of those into a load-time const. */
(function () {
  "use strict";

  var TBUI = window.TBUI = window.TBUI || {};

  /* ---------------- gate → markup ---------------- */
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
  TBUI.tdOf = tdOf;

  /* ---------------- patching ----------------
     Surgical DOM patch after a commit. Rebuilding <tbody> threw away horizontal
     scroll, and on a 35-column palette file that is the main path, not an edge. */
  function patchCell(rid, k) {
    var td = tdOf(rid, k), r = TB.byId(rid);
    if (!td || !r) return;
    /* The pin class and its MEASURED inline offset are owned by grid.js and are
       not recoverable from here — carry them across the rebuild or the cell
       silently drops out of the frozen block. */
    var pinned = td.classList.contains("pin"), left = td.style.left;
    td.className = (TB.gate(r.c[k]) === "hex" ? "gate-hex" : "editable") +
      (TB.dirty(r, k) ? " has-dirty" : "") + (pinned ? " pin" : "");
    if (pinned) td.style.left = left;
    td.innerHTML = cellHTML(r, k);
    wireCell(td);
    afterEdit(rid, k);
  }
  TBUI.patchCell = patchCell;

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
  TBUI.softCell = softCell;

  /* Everything a single cell edit has to refresh AROUND itself: its column's
     stat, the diff banner, the row tint if the edited cell IS the tint source,
     and the sidebar totals. Deliberately not a full re-render. */
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
  TBUI.afterEdit = afterEdit;

  /* ---------------- wiring + editing ---------------- */
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

  /* The picker returns 6 digits. An 8-digit hex carries alpha the OS dialog
     cannot see, so re-attach it or picking silently destroys the channel. */
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
        /* Re-query AFTER the commit: patchCell replaced this <td>, so a node
           captured before the commit is detached and indexOf would miss. */
        var cells = [].slice.call(document.querySelectorAll("td.editable, td.gate-hex"));
        var nx = cells[cells.indexOf(tdOf(rid, k)) + (e.shiftKey ? -1 : 1)];
        if (nx) {
          nx.scrollIntoView({ block: "nearest", inline: "nearest" });
          editText(nx, +nx.dataset.r, nx.dataset.k);
        }
      }
    };
  }
  TBUI.editText = editText;
})();
