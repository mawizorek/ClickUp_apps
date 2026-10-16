/* screens/tables.js — generic editor for all 14 tables. Schema-driven: pick a table, search, tap a row to edit,
   + New to add. Show-scoped tables follow the show picked on the Units screen. */
window.Screens = window.Screens || {};
Screens.tables = (function () {
  var esc = UI.esc;
  var st = { t: "units", q: "" }, view = null;
  var GROUPS = [["Show", ["units","control_points","connections","assignments","network_interfaces","positions","shows"]],
                ["Venue", ["infrastructure","networks","venues"]],
                ["Library", ["fixture_types","type_interfaces","signal_types"]]];

  function rowsOf(t) {
    var sid = UI.showId();
    var rows = SignalDB.getAll(t);
    if (SCHEMA.isShowScoped(t)) rows = rows.filter(function (r) { return r.show_id === sid; });
    if (t === "positions") rows = rows.filter(function (r) { return !r.show_id || r.show_id === sid; });
    return rows;
  }
  function sub(t, r) {
    var S = SCHEMA.T[t], bits = [];
    S.fields.slice(1, 4).forEach(function (f) {
      var v = r[f[0]]; if (v == null || v === "") return;
      if (f[2] === "fk") { var x = SignalDB.get(f[3].to, v); v = x ? SCHEMA.T[f[3].to].show(x) : v; }
      else if (f[2] === "ep") v = UI.epLabel(v);
      else if (f[2] === "bool") v = v ? f[1] : null;
      if (v != null && String(S.show(r)).indexOf(String(v)) === -1) bits.push(v);
    });
    return bits.join(" \u00b7 ");
  }

  function render(v) {
    view = v || view; if (!view) return;
    var t = st.t, S = SCHEMA.T[t], q = st.q.toLowerCase();
    var rows = rowsOf(t).map(function (r) { return { r: r, label: S.show(r), sub: sub(t, r) }; })
      .filter(function (x) { return !q || (x.label + " " + x.sub).toLowerCase().indexOf(q) !== -1; })
      .sort(function (a, b) { return a.label.localeCompare(b.label, undefined, { numeric: true }); });
    var show = SignalDB.get("shows", UI.showId());
    var h = '<div class="sig-tables"><div class="sig-filters"><div class="sig-group sig-showbar">';
    h += '<select class="sig-select" id="tblPick" aria-label="Table">' + GROUPS.map(function (g) {
      return '<optgroup label="' + g[0] + '">' + g[1].map(function (n) { return '<option value="' + n + '"' + (n === t ? " selected" : "") + '>' + SCHEMA.T[n].label + " (" + rowsOf(n).length + ")</option>"; }).join("") + '</optgroup>'; }).join("") + '</select>';
    h += '<input class="sig-search" id="tblQ" type="search" placeholder="Search ' + esc(S.label.toLowerCase()) + '" value="' + esc(st.q) + '">';
    if (Sync.can("write", t) && (!SCHEMA.isShowScoped(t) || show)) h += '<button type="button" class="sig-pill sig-act sig-new" id="tblNew">+ New</button>';
    h += '</div>';
    if (SCHEMA.isShowScoped(t) || t === "positions") h += '<div class="sig-group"><span class="sig-label">Show</span><span class="sig-soft">' + esc(show ? SCHEMA.T.shows.show(show) : "none") + '</span></div>';
    h += '</div><div class="sig-list">';
    rows.forEach(function (x) {
      var pend = SignalDB.pendingFor(t, x.r.id);
      h += '<button type="button" class="sig-li' + (pend ? " is-pend" : "") + '" data-id="' + esc(x.r.id) + '"><span class="sig-li-t">' + esc(x.label) + '</span>' + (x.sub ? '<span class="sig-li-s">' + esc(x.sub) + '</span>' : "") + '</button>';
    });
    if (!rows.length) h += '<div class="sig-empty">' + (q ? "No matches" : "Nothing here yet") + '</div>';
    h += '</div></div>';
    view.innerHTML = h;
    view.querySelector("#tblPick").addEventListener("change", function (e) { st.t = e.target.value; st.q = ""; render(); });
    var qi = view.querySelector("#tblQ");
    qi.addEventListener("input", function () { st.q = qi.value; var p = qi.selectionStart; render(); var n = view.querySelector("#tblQ"); n.focus(); try { n.setSelectionRange(p, p); } catch (e) {} });
    var nb = view.querySelector("#tblNew"); if (nb) nb.addEventListener("click", function () {
      var def = {}; if (t === "positions" && !Sync.isAdmin()) def.show_id = UI.showId();
      var venue = SignalDB.getAll("venues")[0]; if (venue && ["positions","infrastructure","networks","shows"].indexOf(t) !== -1) def.venue_id = venue.id;
      UI.edit(t, null, { defaults: def, onSaved: function () { render(); } });
    });
    view.querySelectorAll(".sig-li").forEach(function (b) { b.addEventListener("click", function () { UI.edit(t, SignalDB.get(t, b.dataset.id), { onSaved: function () { render(); } }); }); });
  }
  return { render: render, refresh: function () { if (view && document.body.contains(view) && !document.getElementById("sigPanelWrap")) render(); } };
})();
