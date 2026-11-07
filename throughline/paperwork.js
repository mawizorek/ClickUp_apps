/* paperwork.js — paperwork definitions registry.
   One definition per document. Adding a sheet = adding one definition.
   Shape: { id, name, dept, columns: [{ key, label, width, mono, required, truncate }], rows(showId) -> records, sort, groupBy? }
   The print menu renders whatever is in the registry. A definition whose rows() returns [] shows "No data yet" and is disabled. */
var Paperwork = (function () {

  // --- Trace helpers (derived patch columns) ---

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

  // Connections landing ON an endpoint (reverse of traceSteps, one hop)
  function inboundConns(epId) {
    if (!epId) return [];
    return SignalDB.getAll("connections").filter(function (c) {
      return !c.deleted_at && c.dest_endpoint === epId;
    });
  }
  function traceUp(epId) {
    var c = inboundConns(epId);
    return c.length ? c[0] : null;
  }

  // A control point's direction, normalized. Only a control point can be a patch channel.
  function cpDir(r) { return String((r && r.direction) || "").toLowerCase(); }
  function isRx(d) { return d === "in" || d === "bus"; }   // can receive: console input, mix bus
  function isTx(d) { return d === "out"; }                  // transmits onto the network

  function tracedColumns(u) {
    var steps = traceSteps(u);
    var wallPort = null, danteTx = null, destRx = null;
    steps.forEach(function (s) {
      if (!s.to) return;
      var owner = UI.epOwner(s.to);
      if (!owner) return;
      // Wall Port: first infrastructure hop on the path
      if (!wallPort && owner.t === "tie_lines") wallPort = owner.r.label;
      // Dante TX: a TX channel is a control point on a stage box, NEVER a whole device.
      // If the trace only reaches a unit, the channel does not exist yet -> leave blank (write-in).
      if (!danteTx && owner.t === "control_points" && s.conn.signal_type && isTx(cpDir(owner.r))) {
        var sig = SignalDB.get("signal_types", s.conn.signal_type);
        if (sig && sig.name === "Dante") danteTx = owner.r.label;
      }
      // Destination RX: terminal control point that can actually RECEIVE.
      // Output channels (direction "out") are not destinations; last receiving hop wins.
      if (owner.t === "control_points" && isRx(cpDir(owner.r))) destRx = owner.r.label;
    });
    return { wallPort: wallPort, danteTx: danteTx, destRx: destRx };
  }

  function feedLabel(u) {
    var conn = traceUp(u.endpoint_id);
    if (conn) return UI.epLabel(conn.source_endpoint);
    var cps = SignalDB.where("control_points", function (c) { return c.parent_unit_id === u.id; });
    for (var i = 0; i < cps.length; i++) {
      var c = traceUp(cps[i].endpoint_id);
      if (c) return UI.epLabel(c.source_endpoint);
    }
    return null;
  }

  // Power: the circuit feeding this unit. A traced path column, not a unit field.
  // Walks downstream for a power ckt tie line, then one hop upstream (a speaker is FED by its circuit).
  function powerCircuit(u) {
    var found = null;
    traceSteps(u).forEach(function (s) {
      if (found || !s.to) return;
      var owner = UI.epOwner(s.to);
      if (owner && owner.t === "tie_lines" && owner.r.signal_type === "power ckt") found = owner.r.label;
    });
    if (found) return found;
    var eps = [u.endpoint_id].concat(
      SignalDB.where("control_points", function (c) { return c.parent_unit_id === u.id; })
        .map(function (c) { return c.endpoint_id; }));
    for (var i = 0; i < eps.length; i++) {
      var conns = inboundConns(eps[i]);
      for (var j = 0; j < conns.length; j++) {
        var o = UI.epOwner(conns[j].source_endpoint);
        if (o && o.t === "tie_lines" && o.r.signal_type === "power ckt") return o.r.label;
      }
    }
    return null;
  }

  function unitDept(u) {
    var t = u.type_id ? SignalDB.get("fixture_types", u.type_id) : null;
    var sig = t && t.primary_signal ? SignalDB.get("signal_types", t.primary_signal) : null;
    return u.dept || (t && t.dept) || (sig && sig.dept) || "";
  }

  var catalogue = [
    {
      id: "input-patch", name: "Input Patch", dept: "Audio",
      columns: [
        { key: "ch", label: "Ch", width: 60, mono: true },
        { key: "source", label: "Source / Purpose", width: 180 },
        { key: "placement", label: "Placement", width: 140 },
        { key: "mic", label: "Mic / DI", width: 130 },
        { key: "rig", label: "Rig", width: 100 },
        { key: "wallPort", label: "Wall Port", width: 100, required: true },
        { key: "danteTx", label: "Dante TX", width: 100, required: true },
        { key: "destRx", label: "Dest RX", width: 120, required: true }
      ],
      sort: "ch",
      rows: function (showId) {
        return SignalDB.where("units", function (u) {
          return u.show_id === showId && !u.deleted_at && (u.direction === "in" || u.direction === "IN");
        }).map(function (u) {
          var t = SignalDB.get("fixture_types", u.type_id);
          var p = SignalDB.get("positions", u.position_id);
          var traced = tracedColumns(u);
          return { ch: u.channel || u.dmx_addr || "", source: u.purpose || "", placement: p ? p.name : "",
            mic: t ? t.name : "", rig: u.label || "", wallPort: traced.wallPort, danteTx: traced.danteTx, destRx: traced.destRx };
        });
      }
    },
    {
      id: "output-patch", name: "Output Patch", dept: "Audio",
      columns: [
        { key: "mix", label: "Mix / Out", width: 100, mono: true },
        { key: "purpose", label: "Purpose", width: 180 },
        { key: "location", label: "Location", width: 140 },
        { key: "device", label: "Speaker / Device", width: 140 },
        { key: "feed", label: "Feed", width: 120, required: true },
        { key: "power", label: "Power", width: 80, required: true },
        { key: "notes", label: "Notes", width: 160, truncate: 120 }
      ],
      sort: "mix",
      rows: function (showId) {
        return SignalDB.where("units", function (u) {
          return u.show_id === showId && !u.deleted_at && (u.direction === "out" || u.direction === "OUT");
        }).map(function (u) {
          var t = SignalDB.get("fixture_types", u.type_id);
          var p = SignalDB.get("positions", u.position_id);
          return { mix: u.channel || "", purpose: u.purpose || "", location: p ? p.name : "",
            device: t ? t.name : "", feed: feedLabel(u), power: powerCircuit(u), notes: u.notes || "" };
        });
      }
    },
    {
      id: "ch-hookup", name: "Channel Hookup", dept: "Lighting",
      columns: [
        { key: "ch", label: "Chan", width: 60, mono: true },
        { key: "position", label: "Position", width: 140 },
        { key: "unum", label: "U#", width: 50, mono: true },
        { key: "purpose", label: "Purpose", width: 180 },
        { key: "type", label: "Type", width: 130 },
        { key: "dimmer", label: "Dimmer", width: 70, mono: true },
        { key: "addr", label: "Address", width: 80, mono: true },
        { key: "color", label: "Color", width: 80, truncate: 40 }
      ],
      sort: "ch",
      rows: function (showId) {
        return SignalDB.where("units", function (u) {
          return u.show_id === showId && !u.deleted_at;
        }).filter(function (u) {
          var d = unitDept(u); return d === "Lighting" || d === "LX";
        }).map(function (u) {
          var t = SignalDB.get("fixture_types", u.type_id);
          var p = SignalDB.get("positions", u.position_id);
          return { ch: u.channel || "", position: p ? p.name : "", unum: u.unit_num != null ? String(u.unit_num) : "",
            purpose: u.purpose || "", type: t ? t.name : "", dimmer: u.dimmer || "", addr: u.dmx_addr || "", color: u.notes || "" };
        });
      }
    },
    {
      id: "inst-schedule", name: "Instrument Schedule", dept: "Lighting",
      columns: [
        { key: "position", label: "Position", width: 140 },
        { key: "unum", label: "U#", width: 50, mono: true },
        { key: "purpose", label: "Purpose", width: 180 },
        { key: "type", label: "Type", width: 130 },
        { key: "ch", label: "Chan", width: 60, mono: true },
        { key: "dimmer", label: "Dimmer", width: 70, mono: true },
        { key: "addr", label: "Address", width: 80, mono: true },
        { key: "color", label: "Color", width: 80, truncate: 40 }
      ],
      sort: "unum", groupBy: "position",
      rows: function (showId) {
        return SignalDB.where("units", function (u) {
          return u.show_id === showId && !u.deleted_at;
        }).filter(function (u) {
          var d = unitDept(u); return d === "Lighting" || d === "LX";
        }).map(function (u) {
          var t = SignalDB.get("fixture_types", u.type_id);
          var p = SignalDB.get("positions", u.position_id);
          return { position: p ? p.name : "", unum: u.unit_num != null ? String(u.unit_num) : "",
            purpose: u.purpose || "", type: t ? t.name : "", ch: u.channel || "", dimmer: u.dimmer || "", addr: u.dmx_addr || "", color: u.notes || "" };
        });
      }
    },
    {
      id: "power-schedule", name: "Power Schedule", dept: "Electrics",
      columns: [
        { key: "circuit", label: "Circuit", width: 100, mono: true },
        { key: "service", label: "Service", width: 100 },
        { key: "landsAt", label: "Lands At", width: 140 },
        { key: "load", label: "Load", width: 180, truncate: 120 },
        { key: "watts", label: "Watts", width: 80, mono: true }
      ],
      sort: "circuit",
      rows: function () {
        return SignalDB.where("tie_lines", function (r) {
          return !r.deleted_at && r.signal_type === "power ckt";
        }).map(function (r) {
          var conns = r.endpoint_id ? SignalDB.where("connections", function (c) {
            return !c.deleted_at && (c.source_endpoint === r.endpoint_id || c.dest_endpoint === r.endpoint_id);
          }) : [];
          var loadNames = conns.map(function (c) {
            var other = c.source_endpoint === r.endpoint_id ? c.dest_endpoint : c.source_endpoint;
            return UI.epLabel(other);
          }).join(", ");
          var totalW = conns.reduce(function (sum, c) {
            var other = c.source_endpoint === r.endpoint_id ? c.dest_endpoint : c.source_endpoint;
            var owner = UI.epOwner(other);
            if (owner && owner.t === "units") { var ft = SignalDB.get("fixture_types", owner.r.type_id); if (ft && ft.wattage) return sum + ft.wattage; }
            return sum;
          }, 0);
          var panelA = r.endpoint_a ? SignalDB.get("panels", r.endpoint_a) : null;
          return { circuit: r.label || "", service: r.signal_type || "", landsAt: panelA ? panelA.label : (r.endpoint_a || ""),
            load: loadNames || "", watts: totalW || "" };
        });
      }
    },
    {
      id: "video-signal", name: "Video Signal Path", dept: "Video",
      columns: [
        { key: "source", label: "Source", width: 160 },
        { key: "route", label: "Route", width: 160 },
        { key: "dest", label: "Destination", width: 160 },
        { key: "signal", label: "Signal", width: 100 }
      ],
      sort: "source",
      rows: function (showId) {
        var videoSigs = {};
        SignalDB.getAll("signal_types").forEach(function (s) {
          if (["SDI", "HDMI", "HDBaseT"].indexOf(s.name) !== -1) videoSigs[s.id] = s.name;
        });
        return SignalDB.where("connections", function (c) {
          return !c.deleted_at && c.signal_type && videoSigs[c.signal_type];
        }).map(function (c) {
          var so = UI.epOwner(c.source_endpoint), doo = UI.epOwner(c.dest_endpoint);
          if (so && so.r.show_id && so.r.show_id !== showId) return null;
          if (doo && doo.r.show_id && doo.r.show_id !== showId) return null;
          var infra = (so && so.t === "tie_lines") ? so.r.label : (doo && doo.t === "tie_lines") ? doo.r.label : null;
          return { source: UI.epLabel(c.source_endpoint), route: infra || c.connection_type || "", dest: UI.epLabel(c.dest_endpoint), signal: videoSigs[c.signal_type] || "" };
        }).filter(Boolean);
      }
    },
    {
      id: "network-devices", name: "Network Devices", dept: "Network",
      columns: [
        { key: "device", label: "Device", width: 160 },
        { key: "hostname", label: "Hostname", width: 120 },
        { key: "ip", label: "IP", width: 120, mono: true },
        { key: "vlan", label: "VLAN", width: 80 },
        { key: "port", label: "Port", width: 80 }
      ],
      sort: "device", groupBy: "network",
      rows: function (showId) {
        return SignalDB.where("network_interfaces", function (n) { return !n.deleted_at; })
          .filter(function (n) { var u = SignalDB.get("units", n.unit_id); return u && u.show_id === showId; })
          .map(function (n) {
            var u = SignalDB.get("units", n.unit_id), t = u ? SignalDB.get("fixture_types", u.type_id) : null;
            var net = n.network_id ? SignalDB.get("networks", n.network_id) : null;
            return { device: t ? t.name : (u ? "#" + u.unit_num : ""), hostname: n.hostname || "", ip: n.ip || "",
              vlan: net ? (net.vlan || "") : "", port: n.port_label || "", network: net ? net.name : "Unassigned" };
          });
      }
    },
    {
      id: "equip-pull", name: "Equipment Pull", dept: "Production",
      columns: [
        { key: "qty", label: "Qty", width: 50, mono: true },
        { key: "item", label: "Item", width: 180 },
        { key: "mfr", label: "Mfr", width: 120 },
        { key: "category", label: "Category", width: 100 },
        { key: "totalW", label: "Total W", width: 80, mono: true },
        { key: "totalLb", label: "Total lb", width: 80, mono: true }
      ],
      sort: "item", groupBy: "dept",
      rows: function (showId) {
        var byType = {};
        SignalDB.where("units", function (u) { return u.show_id === showId && !u.deleted_at; })
          .forEach(function (u) {
            var t = SignalDB.get("fixture_types", u.type_id); if (!t) return;
            if (!byType[t.id]) byType[t.id] = { qty: 0, item: t.name, mfr: t.mfr || "", category: t.category || "",
              wattage: t.wattage || 0, weight: t.weight || 0, dept: unitDept(u) };
            byType[t.id].qty++;
          });
        return Object.keys(byType).map(function (k) {
          var x = byType[k];
          return { qty: x.qty, item: x.item, mfr: x.mfr, category: x.category,
            totalW: x.wattage ? x.qty * x.wattage : "", totalLb: x.weight ? Math.round(x.qty * x.weight * 10) / 10 : "", dept: x.dept };
        });
      }
    }
  ];

  return { catalogue: catalogue };
})();
