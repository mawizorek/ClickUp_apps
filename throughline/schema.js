/* schema.js — client mirror of the 14-table registry (worker.js TABLES is authoritative).
   Drives every form, list, and FK picker. Field: [key, label, type, opts]
   types: text | area | num | bool | date | enum (opts.values) | fk (opts.to) | ep (endpoint picker) */
var SCHEMA = (function () {
  var DIRS = ["in", "out", "—"];
  var EP_EXCLUDE = {type:["audio tie","data tie","DMX home run","fiber"]};
  var T = {
    signal_types: { label: "Signal Types", scope: "library", show: function (r) { return r.name; },
      fields: [["name","Name","text",{req:1}],["dept","Department","text"],["protocol","Protocol","text"],["connector","Connector","text"],["notes","Notes","area"]] },
    fixture_types: { label: "Fixture Types", scope: "library", show: function (r) { return r.name; },
      fields: [["name","Name","text",{req:1}],["category","Category","text"],["mfr","Manufacturer","text"],["model","Model","text"],["primary_signal","Primary signal","fk",{to:"signal_types"}],["dept","Department","text"],["wattage","Wattage","num"],["weight","Weight (lb)","num"],["notes","Notes","area"]] },
    type_interfaces: { label: "Type Interfaces", scope: "library", show: function (r) { var t = SignalDB.get("fixture_types", r.type_id); return (t ? t.name + " \u203a " : "") + r.label; },
      fields: [["type_id","Fixture type","fk",{to:"fixture_types",req:1}],["label","Port label","text",{req:1}],["signal_type","Signal","fk",{to:"signal_types"}],["direction","Direction","enum",{values:["in","out","io"]}],["connector","Connector","text"],["required","Required","bool"],["sort","Sort","num"],["notes","Notes","area"]] },
    venues: { label: "Venues", scope: "venue", show: function (r) { return r.abbr ? r.abbr + " \u00b7 " + r.name : r.name; },
      fields: [["name","Name","text",{req:1}],["abbr","Abbr","text"],["notes","Notes","area"]] },
    shows: { label: "Shows", scope: "show-root", show: function (r) { return r.title + (r.season ? " (" + r.season + ")" : ""); },
      fields: [["title","Title","text",{req:1}],["season","Season","text"],["venue_id","Venue","fk",{to:"venues"}],["opening","Opening","date"],["designer_snd","Sound designer","text"],["designer_lx","LX designer","text"],["designer_vid","Video designer","text"],["locked","Locked (admin-only edits)","bool"],["is_template","Template","bool"],["notes","Notes","area"]] },
    positions: { label: "Positions", scope: "position", show: function (r) { return r.name + (r.show_id ? "" : " \u00b7 venue"); },
      fields: [["name","Name","text",{req:1}],["type","Type","enum",{values:["pipe","room","floor","catwalk","mount","wall","person"]}],["venue_id","Venue","fk",{to:"venues"}],["show_id","Show (blank = venue position)","fk",{to:"shows"}],["notes","Notes","area"]] },
    endpoints: { label: "Endpoints", scope: "endpoint", hidden: true, show: function (r) { return UI.epLabel(r.id); },
      fields: [["class","Class","enum",{values:["physical","virtual","infra"]}]] },
    infrastructure: { label: "Infrastructure", scope: "venue", ep: "infra", show: function (r) { return r.label + (r.type ? " \u00b7 " + r.type : ""); },
      fields: [["label","Label","text",{req:1}],["type","Type","enum",{values:["audio tie","data tie","power ckt","DMX home run","fiber","panel","other"]}],["venue_id","Venue","fk",{to:"venues"}],["endpoint_a","End A","fk",{to:"infrastructure",exclude:EP_EXCLUDE}],["endpoint_b","End B","fk",{to:"infrastructure",exclude:EP_EXCLUDE}],["notes","Notes","area"]] },
    networks: { label: "Networks", scope: "venue", show: function (r) { return r.name + (r.subnet ? " \u00b7 " + r.subnet : ""); },
      fields: [["name","Name","text",{req:1}],["protocol","Protocol","text"],["subnet","Subnet","text"],["vlan","VLAN","text"],["venue_id","Venue","fk",{to:"venues"}],["notes","Notes","area"]] },
    units: { label: "Units", scope: "show", ep: "physical", show: function (r) { var t = SignalDB.get("fixture_types", r.type_id); return "#" + (r.unit_num == null ? "?" : r.unit_num) + " " + (r.purpose || (t ? t.name : "")); },
      fields: [["unit_num","Unit #","num",{req:1}],["type_id","Fixture type","fk",{to:"fixture_types",req:1}],["position_id","Position","fk",{to:"positions"}],["direction","Direction","enum",{values:DIRS}],["purpose","Purpose","text"],["channel","Channel / Mix","text"],["dimmer","Dimmer","text"],["dmx_addr","DMX addr (U/addr)","text"],["role","Role","text"],["asset_tag","Asset tag","text"],["label","Label","text"],["dept","Department (override)","text",{hint:"Leave blank to use fixture type default"}],["notes","Notes","area"]] },
    control_points: { label: "Control Points", scope: "show", ep: "virtual", show: function (r) { var u = SignalDB.get("units", r.parent_unit_id); return (u ? SCHEMA.T.units.show(u) + " \u203a " : "") + r.label; },
      fields: [["parent_unit_id","Device (unit)","fk",{to:"units",req:1}],["label","Label","text",{req:1}],["cp_type","Type","text",{hint:"channel, mix bus, matrix, DCA, MV slot..."}],["signal_type","Signal","fk",{to:"signal_types"}],["direction","Direction","enum",{values:["in","out","bus","virtual"]}],["channel_num","Ch #","text"],["notes","Notes","area"]] },
    network_interfaces: { label: "Network Interfaces", scope: "show", show: function (r) { var u = SignalDB.get("units", r.unit_id); return (r.ip || "no IP") + (u ? " \u00b7 " + SCHEMA.T.units.show(u) : ""); },
      fields: [["unit_id","Unit","fk",{to:"units",req:1}],["network_id","Network","fk",{to:"networks"}],["ip","IP","text"],["hostname","Hostname","text"],["port_label","Port","text"],["mac","MAC","text"],["notes","Notes","area"]] },
    connections: { label: "Connections", scope: "show", show: function (r) { return UI.epLabel(r.source_endpoint) + " \u2192 " + UI.epLabel(r.dest_endpoint); },
      fields: [["source_endpoint","From","ep",{req:1}],["dest_endpoint","To","ep",{req:1}],["connection_type","Type","text",{hint:"cable, patch, dante, power..."}],["signal_type","Signal","fk",{to:"signal_types"}],["cable_label","Cable label","text"],["cable_color","Cable color","text"],["length","Length","text"],["notes","Notes","area"]] },
    assignments: { label: "Assignments", scope: "show", show: function (r) { return UI.epLabel(r.source_endpoint) + " \u2192 " + (r.dest_endpoint ? UI.epLabel(r.dest_endpoint) : (r.group_name || "group")); },
      fields: [["source_endpoint","Source","ep",{req:1}],["dest_endpoint","Destination (blank = group only)","ep"],["level","Level","text"],["pre_post","Pre/Post","enum",{values:["pre","post"]}],["group_name","Group","text"],["notes","Notes","area"]] }
  };
  var ORDER = Object.keys(T);
  return { T: T, ORDER: ORDER, isShowScoped: function (t) { return T[t].scope === "show"; } };
})();
