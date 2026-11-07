/* throughline/tests/traced-columns.test.js
   Covers the four traced-column defects found in the 2026-11-06 Becoming Curious print run.
   No framework: a fake SignalDB + UI, the derivation logic from paperwork.js, and plain asserts.
   Run: node throughline/tests/traced-columns.test.js   (exits non-zero on failure) */

var DB = {
  units: {
    U1: { id:"U1", show_id:"S1", endpoint_id:"EPU1", direction:"in",  purpose:"WX Violin", channel:"1", type_id:"T1" },
    U2: { id:"U2", show_id:"S1", endpoint_id:"EPU2", direction:"out", purpose:"Sub 1-Bottom", channel:"QL5 Dante 04", type_id:"T2",
          notes:"RESOLVED 2026-11-06: fed from Cat 3 ANI4OUT output 1, Dante RX channel Sub 1-Bottom, subscribed to QL5 Dante out 04. Stacked under the top sub. Renamed to match the Dante label. Position UNVERIFIED." },
    UBOX: { id:"UBOX", show_id:"S1", endpoint_id:"EPBOX", direction:"\u2014", purpose:"Cat 3 Dante output box", type_id:"T3" },
    UQL5: { id:"UQL5", show_id:"S1", endpoint_id:"EPQL5", direction:"\u2014", purpose:"FOH Audio Console", type_id:"T4" }
  },
  control_points: {
    /* stage box: a Dante TX channel (out) and an output XLR channel (out, the decoy that used to win) */
    CPTX:  { id:"CPTX",  parent_unit_id:"UBOX", endpoint_id:"EPTX",  label:"Dante TX 01",          direction:"out" },
    CPANI: { id:"CPANI", parent_unit_id:"UBOX", endpoint_id:"EPANI", label:"ANI out 2: Sub 2-Top", direction:"out" },
    /* console: a receiving input channel */
    CPRX:  { id:"CPRX",  parent_unit_id:"UQL5", endpoint_id:"EPRX",  label:"Rio In 1",             direction:"in" }
  },
  tie_lines: {
    TL1: { id:"TL1", endpoint_id:"EPTL1", label:"M57",    signal_type:"data tie" },
    PC1: { id:"PC1", endpoint_id:"EPPC1", label:"Ckt 12", signal_type:"power ckt" }
  },
  signal_types: { SDANTE: { id:"SDANTE", name:"Dante" }, SAC: { id:"SAC", name:"AC Power" } },
  fixture_types: { T1:{id:"T1",name:"WX Violin Pickup"}, T2:{id:"T2",name:"SUB 702-AS II"}, T3:{id:"T3",name:"ANI4OUT-XLR"}, T4:{id:"T4",name:"QL5"} },
  positions: {}, networks: {}, network_interfaces: {},
  connections: {
    /* INPUT path: violin -> wall port M57 -> stage box Dante TX -> console Rio In 1 -> box output (decoy) */
    C1: { id:"C1", source_endpoint:"EPU1",  dest_endpoint:"EPTL1", signal_type:"SDANTE" },
    C2: { id:"C2", source_endpoint:"EPTL1", dest_endpoint:"EPTX",  signal_type:"SDANTE" },
    C3: { id:"C3", source_endpoint:"EPTX",  dest_endpoint:"EPRX",  signal_type:"SDANTE" },
    C4: { id:"C4", source_endpoint:"EPRX",  dest_endpoint:"EPANI", signal_type:"SDANTE" },
    /* OUTPUT path: a power circuit feeds the sub; the console feeds it signal */
    C5: { id:"C5", source_endpoint:"EPPC1", dest_endpoint:"EPU2",  signal_type:"SAC" },
    C6: { id:"C6", source_endpoint:"EPANI", dest_endpoint:"EPU2",  signal_type:"SDANTE" }
  }
};

var SignalDB = {
  getAll: function (t) { return Object.keys(DB[t] || {}).map(function (k) { return DB[t][k]; }); },
  get: function (t, id) { return (DB[t] || {})[id] || null; },
  where: function (t, f) { return this.getAll(t).filter(f); }
};
var EPOWNER = {};
["units", "control_points", "tie_lines"].forEach(function (t) {
  SignalDB.getAll(t).forEach(function (r) { if (r.endpoint_id) EPOWNER[r.endpoint_id] = { t: t, r: r }; });
});
var UI = {
  epOwner: function (ep) { return EPOWNER[ep] || null; },
  epLabel: function (ep) { var o = EPOWNER[ep]; if (!o) return "?"; return o.r.label || o.r.purpose || o.r.id; }
};

/* ---- derivation logic, mirrored from paperwork.js ---- */
function traceSteps(u) {
  var seeds = [u.endpoint_id];
  SignalDB.where("control_points", function (c) { return c.parent_unit_id === u.id; })
    .forEach(function (c) { if (c.endpoint_id) seeds.push(c.endpoint_id); });
  var conns = SignalDB.getAll("connections").filter(function (c) { return !c.deleted_at; });
  var out = [];
  function walk(ep, depth, path) {
    conns.forEach(function (c) {
      if (c.source_endpoint !== ep || (c.dest_endpoint && path.indexOf(c.dest_endpoint) !== -1)) return;
      out.push({ conn: c, depth: depth, to: c.dest_endpoint });
      if (depth < 16 && c.dest_endpoint) walk(c.dest_endpoint, depth + 1, path.concat([c.dest_endpoint]));
    });
  }
  seeds.forEach(function (s) { if (s) walk(s, 0, [s]); });
  return out;
}
function inboundConns(epId) {
  if (!epId) return [];
  return SignalDB.getAll("connections").filter(function (c) { return !c.deleted_at && c.dest_endpoint === epId; });
}
function cpDir(r) { return String((r && r.direction) || "").toLowerCase(); }
function isRx(d) { return d === "in" || d === "bus"; }
function isTx(d) { return d === "out"; }

function tracedColumns(u) {
  var steps = traceSteps(u);
  var wallPort = null, danteTx = null, destRx = null;
  steps.forEach(function (s) {
    if (!s.to) return;
    var owner = UI.epOwner(s.to);
    if (!owner) return;
    if (!wallPort && owner.t === "tie_lines") wallPort = owner.r.label;
    if (!danteTx && owner.t === "control_points" && s.conn.signal_type && isTx(cpDir(owner.r))) {
      var sig = SignalDB.get("signal_types", s.conn.signal_type);
      if (sig && sig.name === "Dante") danteTx = owner.r.label;
    }
    if (owner.t === "control_points" && isRx(cpDir(owner.r))) destRx = owner.r.label;
  });
  return { wallPort: wallPort, danteTx: danteTx, destRx: destRx };
}
function powerCircuit(u) {
  var found = null;
  traceSteps(u).forEach(function (s) {
    if (found || !s.to) return;
    var owner = UI.epOwner(s.to);
    if (owner && owner.t === "tie_lines" && owner.r.signal_type === "power ckt") found = owner.r.label;
  });
  if (found) return found;
  var eps = [u.endpoint_id].concat(
    SignalDB.where("control_points", function (c) { return c.parent_unit_id === u.id; }).map(function (c) { return c.endpoint_id; }));
  for (var i = 0; i < eps.length; i++) {
    var conns = inboundConns(eps[i]);
    for (var j = 0; j < conns.length; j++) {
      var o = UI.epOwner(conns[j].source_endpoint);
      if (o && o.t === "tie_lines" && o.r.signal_type === "power ckt") return o.r.label;
    }
  }
  return null;
}
/* mirrored from screens/print.js */
function sheetVal(c, r) {
  var v = r[c.key];
  if (v === null || v === undefined || v === "") return null;
  v = String(v);
  if (c.truncate && v.length > c.truncate) { v = v.slice(0, c.truncate).replace(/\s+\S*$/, ""); v += "\u2026"; }
  return v;
}

/* ---- assertions ---- */
var fails = 0;
function check(name, got, want) {
  var ok = String(got) === String(want);
  if (!ok) fails++;
  console.log((ok ? "PASS  " : "FAIL  ") + name + (ok ? "" : "\n        got=" + JSON.stringify(got) + " want=" + JSON.stringify(want)));
}

var tc = tracedColumns(DB.units.U1);
check("Dest RX is the console input, NOT the ANI output", tc.destRx, "Rio In 1");
check("Dante TX is a TX channel, not a device",           tc.danteTx, "Dante TX 01");
check("Wall Port still resolves from the tie line",       tc.wallPort, "M57");

/* a Dante hop that only reaches a device must stay blank (write-in), never print the box */
var lonely = { id: "U9", endpoint_id: "EPLONE" };
EPOWNER["EPLONE"] = { t: "units", r: lonely };
DB.connections.C7 = { id: "C7", source_endpoint: "EPLONE", dest_endpoint: "EPQL5", signal_type: "SDANTE" };
check("device-only Dante hop stays blank",                tracedColumns(lonely).danteTx, "null");

check("Power traces the feeding circuit",                 powerCircuit(DB.units.U2), "Ckt 12");
check("Power blank when no circuit is traced",            powerCircuit(DB.units.U1), "null");

var noteCol = { key: "notes", truncate: 120 };
var truncated = sheetVal(noteCol, DB.units.U2);
var body = truncated.slice(0, -1);
check("long note is truncated",                           truncated.length <= 121, "true");
check("truncation ends with an ellipsis",                 /\u2026$/.test(truncated), "true");
check("kept text is a prefix of the original",            DB.units.U2.notes.indexOf(body) === 0, "true");
check("cut lands on a word boundary",                     /^\s/.test(DB.units.U2.notes.slice(body.length)), "true");
check("short value is untouched",                         sheetVal(noteCol, { notes: "short" }), "short");
check("empty returns null so required -> write-in",       sheetVal({ key: "power", required: true }, { power: "" }), "null");

console.log("\n" + (fails ? fails + " FAILED" : "all green"));
if (fails) process.exit(1);
