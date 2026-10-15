/* app.js — Signal Documentation System main application logic.
   Vanilla JS, no build step. Renders into the template-app chrome shell.
   Primary surface: sortable/filterable UNITS table with detail + trace side panels. */
var SigApp = (function () {
  var db = SignalDB;
  var state = { show: null, units: [], filtered: [], selected: null, panel: null, sort: { col: "unit_num", dir: "asc" }, filters: { signal: "all", dir: "all" } };

  function resolve(u) {
    u._type = db.get("fixture_types", u.type_id);
    u._pos = u.position_id ? db.get("positions", u.position_id) : null;
    u._sig = u._type ? db.get("signal_types", u._type.primary_signal) : null;
    return u;
  }

  function loadUnits() {
    if (!state.show) return;
    state.units = db.getAll("units").filter(function (u) { return u.show_id === state.show.show_id; }).map(resolve);
    applyFilters();
  }

  function applyFilters() {
    state.filtered = state.units.filter(function (u) {
      if (state.filters.signal !== "all" && (!u._sig || u._sig.name !== state.filters.signal)) return false;
      if (state.filters.dir !== "all" && u.direction !== state.filters.dir) return false;
      return true;
    });
    sortUnits();
  }

  function sortUnits() {
    var col = state.sort.col, dir = state.sort.dir;
    state.filtered.sort(function (a, b) {
      var av = col === "_type" ? (a._type||{}).name : col === "_pos" ? (a._pos||{}).name : col === "_sig" ? (a._sig||{}).name : a[col];
      var bv = col === "_type" ? (b._type||{}).name : col === "_pos" ? (b._pos||{}).name : col === "_sig" ? (b._sig||{}).name : b[col];
      if (av == null) av = ""; if (bv == null) bv = "";
      if (typeof av === "number" && typeof bv === "number") return dir === "asc" ? av - bv : bv - av;
      return dir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    renderTable();
  }

  var SIG_COLORS = {
    "Analog Audio":"#4ade80","DMX 512":"#60a5fa","Dante":"#22d3ee","sACN":"#a78bfa",
    "SDI":"#f472b6","HDMI":"#c084fc","HDBaseT":"#a78bfa","AC Power":"#fbbf24",
    "Ethernet":"#94a3b8","MIDI":"#fb923c"
  };
  var DIR_COLORS = { "in":"#4ade80", "out":"#fb7185", "IN":"#4ade80", "OUT":"#fb7185" };

  function renderTable() {
    var view = document.getElementById("view");
    var sigTypes = {}; state.units.forEach(function(u){ if(u._sig) sigTypes[u._sig.name]=1; });
    var sigList = Object.keys(sigTypes).sort();

    var html = '<div class="sig-app">';
    html += '<div class="sig-filters">';
    html += '<span class="sig-label">SIGNAL</span><div class="sig-pills">';
    html += '<button class="sig-pill' + (state.filters.signal==="all"?" is-on":"") + '" data-sig="all">ALL</button>';
    sigList.forEach(function(s){ html += '<button class="sig-pill' + (state.filters.signal===s?" is-on":"") + '" data-sig="'+s+'">'+s+'</button>'; });
    html += '</div>';
    html += '<span class="sig-sep">\u2502</span><span class="sig-label">DIR</span><div class="sig-pills">';
    ["all","in","out","\u2014"].forEach(function(d){ html += '<button class="sig-pill' + (state.filters.dir===d?" is-on":"") + '" data-dir="'+d+'">'+(d==="all"?"ALL":d.toUpperCase())+'</button>'; });
    html += '</div>';
    html += '<span class="sig-sep">\u2502</span><span class="sig-label">REPORT</span><div class="sig-pills">';
    [["Input Patch","input-patch"],["Output Patch","output-patch"],["Equipment Pull","equip-pull"],["Channel Hookup","ch-hookup"]].forEach(function(r){
      html += '<button class="sig-pill sig-rpt" data-rpt="'+r[1]+'">'+r[0]+'</button>';
    });
    html += '</div>';
    html += '<span class="sig-count">'+state.filtered.length+'/'+state.units.length+' units</span>';
    html += '<button class="sig-pill sig-export" id="btnExport">Export JSON</button>';
    html += '</div>';

    var cols = [
      {k:"unit_num",l:"Unit#",w:"52px"},{k:"_type",l:"Type",w:"120px"},{k:"_sig",l:"Signal",w:"110px"},
      {k:"_pos",l:"Position",w:"140px"},{k:"direction",l:"Dir",w:"44px"},{k:"purpose",l:"Purpose",w:"1fr"},
      {k:"channel",l:"Ch/Addr",w:"72px"},{k:"dimmer",l:"Dimmer",w:"64px"},{k:"role",l:"Role",w:"64px"},{k:"notes",l:"Notes",w:"120px"}
    ];
    html += '<div class="sig-table" role="table">';
    html += '<div class="sig-row sig-hdr">';
    cols.forEach(function(c){
      var arrow = state.sort.col===c.k ? (state.sort.dir==="asc"?" \u2191":" \u2193") : "";
      html += '<div class="sig-cell" style="width:'+c.w+(c.w==="1fr"?";flex:1":"")+';min-width:'+c.w+'" data-sort="'+c.k+'">'+c.l+arrow+'</div>';
    });
    html += '<div class="sig-cell" style="width:40px"></div></div>';

    state.filtered.forEach(function(u, i){
      var sel = state.selected && state.selected.unit_id === u.unit_id;
      var sigName = u._sig ? u._sig.name : "";
      var sigColor = SIG_COLORS[sigName] || "#94a3b8";
      var dirVal = u.direction === "\u2014" ? "\u2014" : (u.direction||"").toUpperCase();
      var dirColor = DIR_COLORS[dirVal] || "#94a3b8";
      html += '<div class="sig-row'+(sel?" is-sel":"")+(i%2?" sig-alt":"")+' " data-uid="'+u.unit_id+'">';
      html += '<div class="sig-cell" style="width:52px">'+u.unit_num+'</div>';
      html += '<div class="sig-cell" style="width:120px">'+(u._type?u._type.name:"\u2014")+'</div>';
      html += '<div class="sig-cell" style="width:110px;color:'+sigColor+'">'+sigName+'</div>';
      html += '<div class="sig-cell" style="width:140px">'+(u._pos?u._pos.name:"\u2014")+'</div>';
      html += '<div class="sig-cell" style="width:44px;color:'+dirColor+'">'+dirVal+'</div>';
      html += '<div class="sig-cell" style="flex:1;min-width:140px">'+u.purpose+'</div>';
      html += '<div class="sig-cell sig-ch" style="width:72px">'+(u.channel||u.dmx_addr||"\u2014")+'</div>';
      html += '<div class="sig-cell sig-dim" style="width:64px">'+(u.dimmer||"\u2014")+'</div>';
      html += '<div class="sig-cell sig-muted" style="width:64px">'+(u.role||"")+'</div>';
      html += '<div class="sig-cell sig-muted" style="width:120px">'+(u.notes||"")+'</div>';
      html += '<div class="sig-cell" style="width:40px"><button class="sig-trace-btn" data-uid="'+u.unit_id+'" title="Signal Trace">\u27bf</button></div>';
      html += '</div>';
    });
    if (state.filtered.length === 0) html += '<div class="sig-empty">No units match current filters</div>';
    html += '</div></div>';

    if (state.panel === "detail" && state.selected) html += renderDetail(state.selected);
    if (state.panel === "trace" && state.selected) html += renderTrace(state.selected);
    if (state.panel && state.panel.indexOf("rpt:") === 0) html += renderReport(state.panel.slice(4));

    view.innerHTML = html;
    bindEvents();
  }

  function renderDetail(u) {
    var conns = db.getAll("connections").filter(function(c){ return c.source_endpoint===u.endpoint_id||c.dest_endpoint===u.endpoint_id; });
    var assigns = db.getAll("assignments").filter(function(a){ return a.source_endpoint===u.endpoint_id; });
    var cps = db.getAll("control_points").filter(function(cp){ return cp.parent_unit_id===u.unit_id; });
    var nis = db.getAll("network_interfaces").filter(function(ni){ return ni.unit_id===u.unit_id; });
    var h = '<aside class="sig-panel"><div class="sig-panel-hdr"><h2>Unit #'+u.unit_num+'</h2><button class="sig-panel-x" data-close>\u2715</button></div>';
    h += '<div class="sig-panel-body">';
    var fields = [["Type",(u._type||{}).name],["Signal",(u._sig||{}).name],["Position",(u._pos||{}).name],["Direction",u.direction],["Purpose",u.purpose],["Channel",u.channel||u.dmx_addr],["Dimmer",u.dimmer],["Role",u.role],["Asset Tag",u.asset_tag],["Label",u.label],["Notes",u.notes]];
    fields.forEach(function(f){ h += '<div class="sig-field"><span class="sig-field-lbl">'+f[0]+'</span><span class="sig-field-val">'+(f[1]||"\u2014")+'</span></div>'; });
    if (nis.length) { h += '<h3 class="sig-section-hdr">Network Interfaces</h3>'; nis.forEach(function(ni){ h += '<div class="sig-field"><span class="sig-ch">'+ni.ip+'</span> <span class="sig-muted">'+(ni.hostname||ni.port_label)+'</span></div>'; }); }
    if (cps.length) { h += '<h3 class="sig-section-hdr">Control Points ('+cps.length+')</h3>'; cps.forEach(function(cp){ h += '<div class="sig-cp"><span class="sig-muted">'+cp.cp_type+'</span> '+cp.label+(cp.channel_num?' <span class="sig-ch">ch'+cp.channel_num+'</span>':"")+' </div>'; }); }
    if (conns.length) { h += '<h3 class="sig-section-hdr">Connections</h3>'; conns.forEach(function(c){ h += '<div class="sig-field"><span class="sig-muted">'+c.connection_type+'</span> '+c.notes+'</div>'; }); }
    if (assigns.length) { h += '<h3 class="sig-section-hdr">Assignments</h3>'; assigns.forEach(function(a){ h += '<div class="sig-field"><span class="sig-good">'+a.level+'</span> \u2192 '+(a.notes||a.group_name)+(a.pre_post?' <span class="sig-muted">('+a.pre_post+')</span>':"")+' </div>'; }); }
    h += '</div></aside>';
    return h;
  }

  function renderTrace(u) {
    var conns = db.getAll("connections");
    var assigns = db.getAll("assignments");
    var allCPs = db.getAll("control_points").filter(function(cp){ return cp.parent_unit_id===u.unit_id; });
    var endpoints = [u.endpoint_id];
    allCPs.forEach(function(cp){ endpoints.push(cp.endpoint_id); });
    var visited = {}, results = [];
    function walk(ep, depth) {
      if (visited[ep] || depth > 8) return;
      visited[ep] = true;
      conns.filter(function(c){ return c.source_endpoint===ep; }).forEach(function(c){
        results.push({depth:depth, type:c.connection_type, notes:c.notes, isAssign:false});
        walk(c.dest_endpoint, depth+1);
      });
      assigns.filter(function(a){ return a.source_endpoint===ep; }).forEach(function(a){
        results.push({depth:depth, type:"assign", notes:a.level+" \u2192 "+(a.notes||a.group_name), isAssign:true});
      });
    }
    endpoints.forEach(function(ep){ walk(ep, 0); });
    var h = '<aside class="sig-panel"><div class="sig-panel-hdr"><h2>Signal Trace: Unit #'+u.unit_num+'</h2><button class="sig-panel-x" data-close>\u2715</button></div>';
    h += '<div class="sig-panel-body">';
    h += '<div class="sig-trace-info">'+(u._type?u._type.name:"")+' \u00b7 '+u.purpose+'</div>';
    h += '<div class="sig-trace-box">';
    if (!results.length) h += '<div class="sig-muted">No connections from this unit</div>';
    results.forEach(function(s){
      var pad = s.depth * 20;
      h += '<div class="sig-trace-step" style="padding-left:'+pad+'px">';
      h += '<span class="'+(s.isAssign?"sig-good":"sig-ch")+'">'+(s.isAssign?"\u251c\u2192":s.depth>0?"\u2514\u2500":"\u2500\u2500")+'</span> ';
      h += '<span class="'+(s.isAssign?"sig-good":"")+' ">'+(s.notes||s.type)+'</span>';
      h += '</div>';
    });
    h += '</div></div></aside>';
    return h;
  }

  function renderReport(type) {
    var h = '<aside class="sig-panel"><div class="sig-panel-hdr"><h2>'+type.replace(/-/g," ").toUpperCase()+'</h2><button class="sig-panel-x" data-close>\u2715</button></div>';
    h += '<div class="sig-panel-body">';
    var items;
    if (type === "input-patch") items = state.units.filter(function(u){return u.direction==="in";});
    else if (type === "output-patch") items = state.units.filter(function(u){return u.direction==="out";});
    else if (type === "ch-hookup") items = state.units.filter(function(u){return u.dmx_addr;});
    else items = state.units;
    if (type === "equip-pull") {
      var counts = {};
      items.forEach(function(u){ var n=(u._type||{}).name||"?"; counts[n]=(counts[n]||0)+1; });
      Object.keys(counts).sort().forEach(function(k){
        h += '<div class="sig-field"><span>'+k+'</span><span class="sig-ch">'+counts[k]+'\u00d7</span></div>';
      });
      h += '<div class="sig-field sig-total"><span>Total</span><span class="sig-ch">'+items.length+'</span></div>';
    } else {
      items.forEach(function(u){
        h += '<div class="sig-field"><span class="sig-muted">#'+u.unit_num+'</span> '+(u._type?u._type.name:"")+" \u00b7 "+u.purpose;
        if (u.channel||u.dmx_addr) h += ' <span class="sig-ch">'+(u.channel||u.dmx_addr)+'</span>';
        h += '</div>';
      });
    }
    h += '</div></aside>';
    return h;
  }

  function bindEvents() {
    document.querySelectorAll(".sig-pill[data-sig]").forEach(function(btn){
      btn.addEventListener("click", function(){ state.filters.signal = btn.dataset.sig; applyFilters(); });
    });
    document.querySelectorAll(".sig-pill[data-dir]").forEach(function(btn){
      btn.addEventListener("click", function(){ state.filters.dir = btn.dataset.dir; applyFilters(); });
    });
    document.querySelectorAll(".sig-hdr .sig-cell[data-sort]").forEach(function(cell){
      cell.addEventListener("click", function(){
        var col = cell.dataset.sort;
        if (state.sort.col === col) state.sort.dir = state.sort.dir==="asc"?"desc":"asc";
        else { state.sort.col = col; state.sort.dir = "asc"; }
        sortUnits();
      });
    });
    document.querySelectorAll(".sig-row:not(.sig-hdr)").forEach(function(row){
      row.addEventListener("click", function(e){
        if (e.target.classList.contains("sig-trace-btn")) return;
        var uid = row.dataset.uid;
        state.selected = state.units.find(function(u){return u.unit_id===uid;}) || null;
        state.panel = "detail";
        renderTable();
      });
    });
    document.querySelectorAll(".sig-trace-btn").forEach(function(btn){
      btn.addEventListener("click", function(e){
        e.stopPropagation();
        var uid = btn.dataset.uid;
        state.selected = state.units.find(function(u){return u.unit_id===uid;}) || null;
        state.panel = "trace";
        renderTable();
      });
    });
    document.querySelectorAll(".sig-rpt").forEach(function(btn){
      btn.addEventListener("click", function(){ state.panel = "rpt:"+btn.dataset.rpt; renderTable(); });
    });
    document.querySelectorAll("[data-close]").forEach(function(btn){
      btn.addEventListener("click", function(){ state.panel = null; state.selected = null; renderTable(); });
    });
    var exp = document.getElementById("btnExport");
    if (exp) exp.addEventListener("click", function(){ db.downloadJSON(); });
  }

  function init() {
    if (db.isEmpty()) { seedDatabase(); db.reload(); }
    var shows = db.getAll("shows");
    if (shows.length) state.show = shows[0];
    loadUnits();
  }

  return { init: init };
})();
