/* seed.js — Big Love F26 sample data (SPAC). Loaded into the local store only (never auto-pushed);
   an admin can upload it to the server from Access > Bootstrap. */
function seedDatabase() {
  var db = SignalDB, P = function (t, r) { db.put(t, r, { noSync: true }); };
  [["ST-01","Analog Audio","Analog","XLR/TRS","Audio"],["ST-02","DMX 512","DMX","5-pin XLR","Lighting"],["ST-03","Dante","IP Audio","RJ45","Audio"],
   ["ST-04","sACN","IP Lighting","RJ45","Lighting"],["ST-07","SDI","Serial Digital","BNC","Video"],["ST-08","HDMI","Digital AV","HDMI","Video"],
   ["ST-09","Ethernet","IP Data","RJ45","Infra"],["ST-10","AC Power","Power","Various","Infra"],["ST-11","MIDI","Control","5-pin DIN","Audio"],
   ["ST-12","HDBaseT","IP Video","RJ45","Video"]].forEach(function (s) { P("signal_types", { id: s[0], name: s[1], protocol: s[2], connector: s[3], dept: s[4] }); });

  [["FT-01","SM58","Microphone","Shure",null,0.7,"ST-01"],["FT-02","SM57","Microphone","Shure",null,0.6,"ST-01"],["FT-03","DI Box","DI","Radial",null,1,"ST-01"],
   ["FT-04","ULXD2/SM58","Wireless TX","Shure",null,0.7,"ST-01"],["FT-06","Rio 3224-D","Stage Box","Yamaha",45,17.6,"ST-03"],["FT-07","QL5","Console","Yamaha",230,57.3,"ST-03"],
   ["FT-08","DXR12 MKII","Speaker","Yamaha",1100,27.1,"ST-01"],["FT-09","PSM300 TX","IEM TX","Shure",6,0.8,"ST-01"],["FT-10","PSM300 RX","IEM RX","Shure",null,0.3,"ST-01"],
   ["FT-11","Source Four 26\u00b0","Leko","ETC",750,18.6,"ST-02"],["FT-13","ColorSource PAR","LED","ETC",125,7.7,"ST-02"],["FT-14","Eos Ti","Console (LX)","ETC",250,55,"ST-04"],
   ["FT-15","Net3 Gateway","DMX Gateway","ETC",10,1.5,"ST-04"],["FT-16","PTZ Camera","Camera","PTZOptics",15,3,"ST-07"],["FT-18","12-pair Snake","Mult","Whirlwind",null,25,"ST-01"],
   ["FT-20","Dimmer Rack","Dimmer","ETC",7200,85,"ST-10"],["FT-21","ATEM 2ME","Switcher","Blackmagic",80,22,"ST-07"],["FT-22","Roland HT-TX","HDBaseT TX","Roland",8,0.6,"ST-12"],
   ["FT-23","Roland HT-RX","HDBaseT RX","Roland",8,0.6,"ST-12"],["FT-25","Projector","Projector",null,500,45,"ST-08"]
  ].forEach(function (f) { P("fixture_types", { id: f[0], name: f[1], category: f[2], mfr: f[3], wattage: f[4], weight: f[5], primary_signal: f[6] }); });
  [["TI-01","FT-08","Line In","ST-01","in","XLR",1],["TI-02","FT-08","Power","ST-10","in","powerCON",1],["TI-03","FT-11","DMX In","ST-02","in","5-pin XLR",0],
   ["TI-04","FT-11","Power","ST-10","in","Stage pin",1],["TI-05","FT-13","DMX In","ST-02","in","5-pin XLR",1],["TI-06","FT-13","Power","ST-10","in","powerCON",1]
  ].forEach(function (i, k) { P("type_interfaces", { id: i[0], type_id: i[1], label: i[2], signal_type: i[3], direction: i[4], connector: i[5], required: i[6], sort: k }); });

  P("venues", { id: "V-01", name: "Sloan Performing Arts Center", abbr: "SPAC", notes: "Main venue" });
  P("shows", { id: "SH-01", title: "Big Love", season: "F26", venue_id: "V-01", opening: "2026-11-14", designer_snd: "M. Wizorek", designer_lx: "TBD", designer_vid: "M. Wizorek", locked: 0, is_template: 0 });

  [["P-01","1st Electric","pipe",null],["P-02","2nd Electric","pipe",null],["P-03","FOH Pipe","pipe",null],["P-06","Booth","room",null],["P-07","SL Deck","floor",null],
   ["P-08","SR Wing","floor",null],["P-09","Catwalk","catwalk",null],["P-15","FOH Mount","mount",null],["P-16","Backstage","wall",null],
   ["P-10","DS Center","floor","SH-01"],["P-11","Band Platform SR","floor","SH-01"],["P-12","Sarah (Drummer)","person","SH-01"],
   ["P-13","Actor 1 - Juliet","person","SH-01"],["P-14","Actor 2 - Romeo","person","SH-01"]
  ].forEach(function (p) { P("positions", { id: p[0], name: p[1], type: p[2], venue_id: "V-01", show_id: p[3] }); });

  [["INF-012","A12","audio tie","SL Wall pos 12","Bay Row C pos 3"],["INF-096","D96","data tie","FOH mount","Booth Data 3"],["INF-104","D104","data tie","Catwalk","Booth"],
   ["INF-120","PWR-3A-7","power ckt","Panel 3A brk 7","SL Deck"],["INF-121","PWR-3A-9","power ckt","Panel 3A brk 9","SR Wing"],["INF-122","DMX-HR-1","DMX home run","Booth DMX 1","1st Elec drop"],
   ["INF-130","PWR-2B-3","power ckt","Panel 2B brk 3","1E outlet"],["INF-140","PWR-BOOTH","power ckt","Panel 1A","Booth rack"],["INF-150","PWR-FOH","power ckt","Panel 2A brk 11","FOH proj"]
  ].forEach(function (i) { var ep = "EP-" + i[0]; P("endpoints", { id: ep, class: "infra" }); P("infrastructure", { id: i[0], venue_id: "V-01", endpoint_id: ep, label: i[1], type: i[2], endpoint_a: i[3], endpoint_b: i[4] }); });

  [["NET-01","DANTE-1","Dante","135.254.16.0/16","100"],["NET-02","DANTE-2","Dante","172.31.16.0/16","200"],["NET-03","CONTROL","Ethernet","192.168.0.0/24","1"],
   ["NET-04","sACN","sACN","10.101.1.0/24","300"],["NET-05","AV CONTROL","Ethernet","192.168.1.0/24","400"]
  ].forEach(function (n) { P("networks", { id: n[0], venue_id: "V-01", name: n[1], protocol: n[2], subnet: n[3], vlan: n[4] }); });

  var UNITS = [
    [1,"FT-01","P-10","in","Vocal DS",{channel:"18"}],[2,"FT-01","P-11","in","Guitar amp",{channel:"19"}],[3,"FT-01","P-11","in","Kick drum",{channel:"22"}],
    [4,"FT-02","P-11","in","Snare",{channel:"23"}],[5,"FT-03","P-11","in","Keys L",{channel:"24"}],[6,"FT-03","P-11","in","Keys R",{channel:"25"}],
    [7,"FT-04","P-13","in","Juliet wireless",{channel:"33",notes:"Lav"}],[8,"FT-04","P-14","in","Romeo wireless",{channel:"34",notes:"Lav"}],
    [20,"FT-08","P-07","out","Surround SL",{channel:"Mix 4",notes:"Trim 14'"}],[21,"FT-08","P-08","out","Surround SR",{channel:"Mix 5",notes:"Trim 14'"}],
    [100,"FT-07","P-06","\u2014","FOH Audio Console",{role:"primary",asset_tag:"URITP-11953"}],[101,"FT-06","P-06","\u2014","Booth Rio (rack)",{}],[102,"FT-06","P-07","\u2014","Stage Rio (portable)",{}],
    [300,"FT-18","P-11","\u2014","Band snake",{label:"MULT A"}],[400,"FT-09","P-06","out","IEM TX Sarah",{channel:"Mix 8"}],[401,"FT-10","P-12","out","IEM RX Sarah",{notes:"Bodypack"}],
    [200,"FT-14","P-06","\u2014","LX Console",{role:"primary"}],[201,"FT-15","P-06","\u2014","DMX Gateway #1",{notes:"Feeds 1E"}],
    [30,"FT-11","P-01","\u2014","DS warm wash L",{channel:"101",dimmer:"201",dmx_addr:"1/101",notes:"R02"}],[31,"FT-11","P-01","\u2014","DS warm wash R",{channel:"102",dimmer:"202",dmx_addr:"1/102",notes:"R02"}],
    [32,"FT-11","P-01","\u2014","DS cool wash L",{channel:"103",dimmer:"203",dmx_addr:"1/103",notes:"R60"}],[33,"FT-11","P-01","\u2014","DS cool wash R",{channel:"104",dimmer:"204",dmx_addr:"1/104",notes:"R60"}],
    [40,"FT-13","P-02","\u2014","Top wash C",{channel:"110",dmx_addr:"1/110",notes:"LED"}],[210,"FT-20","P-06","\u2014","Dimmer Rack #1",{notes:"Feeds 1E"}],
    [500,"FT-21","P-06","\u2014","Video Switcher",{role:"primary",notes:"Constellation"}],[501,"FT-22","P-06","\u2014","Roland TX #1",{notes:"Proj feed"}],
    [502,"FT-23","P-15","\u2014","Roland RX #1",{notes:"At projector"}],[510,"FT-16","P-09","in","PTZ Cam #1 (wide)",{channel:"ATEM In1"}],
    [520,"FT-25","P-15","out","FOH Projector",{}],[530,"FT-08","P-16","out","Backstage monitor",{notes:"SM video"}]
  ];
  UNITS.forEach(function (u) {
    var n = String(u[0]).padStart(3, "0"), ep = "EP-U" + n;
    P("endpoints", { id: ep, class: "physical" });
    P("units", Object.assign({ id: "U-" + n, show_id: "SH-01", endpoint_id: ep, type_id: u[1], unit_num: u[0], position_id: u[2], direction: u[3], purpose: u[4] }, u[5]));
  });

  [["CP-001","U-100","Input Ch 22","channel","ST-01","in","22"],["CP-002","U-100","Mix 4","mix bus","ST-01","bus","4"],["CP-003","U-100","Mix 5","mix bus","ST-01","bus","5"],
   ["CP-004","U-100","Mix 8 (IEM)","mix bus","ST-01","bus","8"],["CP-005","U-100","Dante TX 63","net TX","ST-03","out","63"],["CP-011","U-100","Matrix 1","matrix","ST-01","bus","1"],
   ["CP-012","U-100","DCA 3","DCA","ST-01","bus","3"],["CP-050","U-500","SDI In 1","SDI in","ST-07","in","1"],["CP-053","U-500","SDI Out 1 (Pgm)","SDI out","ST-07","out","1"],
   ["CP-054","U-500","MV1 Out","MV out","ST-07","out",null],["CP-060","U-500","Program","pgm bus","ST-07","bus",null],["CP-056","U-500","MV1 Slot 1","MV slot","ST-07","virtual","1"]
  ].forEach(function (c) { var ep = "EP-" + c[0]; P("endpoints", { id: ep, class: "virtual" });
    P("control_points", { id: c[0], show_id: "SH-01", endpoint_id: ep, parent_unit_id: c[1], label: c[2], cp_type: c[3], signal_type: c[4], direction: c[5], channel_num: c[6] }); });

  [["C-001","EP-U003","EP-INF-012","cable","ST-01","SM58 kick \u2192 tie A12"],["C-002","EP-INF-012","EP-CP-001","patch\u2192dante\u2192ch","ST-01","A12 \u2192 Bay \u2192 Rio \u2192 Dante \u2192 QL In22"],
   ["C-003","EP-CP-005","EP-U020","dante\u2192amp\u2192spkr","ST-03","QL TX63 \u2192 Amp \u2192 DXR12 SL"],["C-004","EP-INF-120","EP-U020","power","ST-10","Ckt 3A-7 \u2192 DXR12 SL"],
   ["C-005","EP-INF-121","EP-U021","power","ST-10","Ckt 3A-9 \u2192 DXR12 SR"],["C-006","EP-U510","EP-CP-050","SDI\u2192tie\u2192ATEM","ST-07","PTZ SDI \u2192 D104 \u2192 ATEM In1"],
   ["C-007","EP-CP-053","EP-U520","video chain","ST-07","ATEM Out1 \u2192 HT-TX \u2192 D96 \u2192 HT-RX \u2192 Proj"],["C-008","EP-CP-054","EP-U530","cable","ST-07","ATEM MV1 \u2192 Backstage mon"],
   ["C-010","EP-INF-130","EP-U030","power","ST-10","Ckt 2B-3 \u2192 Dim \u2192 S4 #30"],["C-011","EP-INF-122","EP-U030","DMX chain","ST-02","Eos \u2192 sACN \u2192 Net3 \u2192 DMX HR1 \u2192 S4"]
  ].forEach(function (c) { P("connections", { id: c[0], show_id: "SH-01", source_endpoint: c[1], dest_endpoint: c[2], connection_type: c[3], signal_type: c[4], notes: c[5] }); });

  [["A-001","EP-CP-001","EP-CP-002","-3dB","post",null,"Kick \u2192 Mix 4"],["A-002","EP-CP-001","EP-CP-003","-3dB","post",null,"Kick \u2192 Mix 5"],
   ["A-003","EP-CP-001","EP-CP-004","-6dB","pre",null,"Kick \u2192 IEM Sarah"],["A-004","EP-CP-001","EP-CP-011","0dB","post",null,"Kick \u2192 Matrix 1"],
   ["A-010","EP-CP-001","EP-CP-012","unity",null,"Band","DCA group"],["A-020","EP-U020",null,"unity",null,"Surround Array",null],["A-021","EP-U021",null,"unity",null,"Surround Array",null],
   ["A-040","EP-CP-050","EP-CP-056","unity",null,null,"Cam1 \u2192 MV1 Slot1"]
  ].forEach(function (a) { P("assignments", { id: a[0], show_id: "SH-01", source_endpoint: a[1], dest_endpoint: a[2], level: a[3], pre_post: a[4], group_name: a[5], notes: a[6] }); });

  [["NI-01","U-100","NET-01","135.254.16.100","YAMAHA_QL5","Primary"],["NI-02","U-100","NET-03","192.168.0.99",null,"Control"],["NI-03","U-101","NET-01","135.254.16.101","RIO_BOOTH","Primary"],
   ["NI-04","U-102","NET-01","135.254.16.102","RIO_STAGE","Primary"],["NI-05","U-200","NET-04","10.101.1.100",null,"Port A"],["NI-06","U-500","NET-05","192.168.1.100",null,"Ethernet"],
   ["NI-07","U-510","NET-05","192.168.1.50","PTZ-CAM-1","Network"]
  ].forEach(function (n) { P("network_interfaces", { id: n[0], show_id: "SH-01", unit_id: n[1], network_id: n[2], ip: n[3], hostname: n[4], port_label: n[5] }); });
  db.flush();
}
