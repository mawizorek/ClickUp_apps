/* seed.js — Big Love F26 sample data for Signal Documentation System. */
function seedDatabase() {
  var db = SignalDB;
  var ST = [
    {id:"ST-01",name:"Analog Audio",protocol:"Analog",connector:"XLR/TRS",dept:"Audio"},
    {id:"ST-02",name:"DMX 512",protocol:"DMX",connector:"5-pin XLR",dept:"Lighting"},
    {id:"ST-03",name:"Dante",protocol:"IP Audio",connector:"RJ45",dept:"Audio"},
    {id:"ST-04",name:"sACN",protocol:"IP Lighting",connector:"RJ45",dept:"Lighting"},
    {id:"ST-07",name:"SDI",protocol:"Serial Digital",connector:"BNC",dept:"Video"},
    {id:"ST-08",name:"HDMI",protocol:"Digital AV",connector:"HDMI",dept:"Video"},
    {id:"ST-09",name:"Ethernet",protocol:"IP Data",connector:"RJ45",dept:"Infra"},
    {id:"ST-10",name:"AC Power",protocol:"Power",connector:"Various",dept:"Infra"},
    {id:"ST-11",name:"MIDI",protocol:"Control",connector:"5-pin DIN",dept:"Control"},
    {id:"ST-12",name:"HDBaseT",protocol:"IP Video",connector:"RJ45",dept:"Video"}
  ];
  ST.forEach(function(r){db.put("signal_types",r);});

  var FT = [
    {id:"FT-01",name:"SM58",category:"Microphone",mfr:"Shure",wattage:"",weight:0.7,primary_signal:"ST-01"},
    {id:"FT-02",name:"SM57",category:"Microphone",mfr:"Shure",wattage:"",weight:0.6,primary_signal:"ST-01"},
    {id:"FT-03",name:"DI Box",category:"DI",mfr:"Radial",wattage:"",weight:1,primary_signal:"ST-01"},
    {id:"FT-04",name:"ULXD2/SM58",category:"Wireless TX",mfr:"Shure",wattage:"",weight:0.7,primary_signal:"ST-01"},
    {id:"FT-06",name:"Rio 3224-D",category:"Stage Box",mfr:"Yamaha",wattage:45,weight:17.6,primary_signal:"ST-03"},
    {id:"FT-07",name:"QL5",category:"Console",mfr:"Yamaha",wattage:230,weight:57.3,primary_signal:"ST-03"},
    {id:"FT-08",name:"DXR12 MKII",category:"Speaker",mfr:"Yamaha",wattage:1100,weight:27.1,primary_signal:"ST-01"},
    {id:"FT-09",name:"PSM300 TX",category:"IEM TX",mfr:"Shure",wattage:6,weight:0.8,primary_signal:"ST-01"},
    {id:"FT-10",name:"PSM300 RX",category:"IEM RX",mfr:"Shure",wattage:"",weight:0.3,primary_signal:"ST-01"},
    {id:"FT-11",name:"Source Four 26\u00b0",category:"Leko",mfr:"ETC",wattage:750,weight:18.6,primary_signal:"ST-02"},
    {id:"FT-13",name:"ColorSource PAR",category:"LED",mfr:"ETC",wattage:125,weight:7.7,primary_signal:"ST-02"},
    {id:"FT-14",name:"Eos Ti",category:"Console (LX)",mfr:"ETC",wattage:250,weight:55,primary_signal:"ST-04"},
    {id:"FT-15",name:"Net3 Gateway",category:"DMX Gateway",mfr:"ETC",wattage:10,weight:1.5,primary_signal:"ST-04"},
    {id:"FT-16",name:"PTZ Camera",category:"Camera",mfr:"PTZOptics",wattage:15,weight:3,primary_signal:"ST-07"},
    {id:"FT-18",name:"12-pair Snake",category:"Mult",mfr:"Whirlwind",wattage:"",weight:25,primary_signal:"ST-01"},
    {id:"FT-20",name:"Dimmer Rack",category:"Dimmer",mfr:"ETC",wattage:7200,weight:85,primary_signal:"ST-10"},
    {id:"FT-21",name:"ATEM 2ME",category:"Switcher",mfr:"Blackmagic",wattage:80,weight:22,primary_signal:"ST-07"},
    {id:"FT-22",name:"Roland HT-TX",category:"HDBaseT TX",mfr:"Roland",wattage:8,weight:0.6,primary_signal:"ST-12"},
    {id:"FT-23",name:"Roland HT-RX",category:"HDBaseT RX",mfr:"Roland",wattage:8,weight:0.6,primary_signal:"ST-12"},
    {id:"FT-25",name:"Projector",category:"Projector",mfr:"\u2014",wattage:500,weight:45,primary_signal:"ST-08"}
  ];
  FT.forEach(function(r){db.put("fixture_types",r);});

  db.put("venues",{id:"V-01",name:"Sloan Performing Arts Center",abbr:"SPAC",notes:"Main venue"});
  db.put("shows",{show_id:"SH-01",title:"Big Love",season:"F26",venue_id:"V-01",opening:"2026-11-14",designer_snd:"M. Wizorek",designer_lx:"TBD",designer_vid:"M. Wizorek"});

  var POS = [
    {id:"P-01",name:"1st Electric",type:"pipe",venue:"V-01",scope:"venue"},
    {id:"P-02",name:"2nd Electric",type:"pipe",venue:"V-01",scope:"venue"},
    {id:"P-03",name:"FOH Pipe",type:"pipe",venue:"V-01",scope:"venue"},
    {id:"P-06",name:"Booth",type:"room",venue:"V-01",scope:"venue"},
    {id:"P-07",name:"SL Deck",type:"floor",venue:"V-01",scope:"venue"},
    {id:"P-08",name:"SR Wing",type:"floor",venue:"V-01",scope:"venue"},
    {id:"P-09",name:"Catwalk",type:"catwalk",venue:"V-01",scope:"venue"},
    {id:"P-10",name:"DS Center",type:"floor",venue:"V-01",scope:"show"},
    {id:"P-11",name:"Band Platform SR",type:"floor",venue:"V-01",scope:"show"},
    {id:"P-12",name:"Sarah (Drummer)",type:"person",venue:"V-01",scope:"show"},
    {id:"P-13",name:"Actor 1 - Juliet",type:"person",venue:"V-01",scope:"show"},
    {id:"P-14",name:"Actor 2 - Romeo",type:"person",venue:"V-01",scope:"show"},
    {id:"P-15",name:"FOH Mount",type:"mount",venue:"V-01",scope:"venue"},
    {id:"P-16",name:"Backstage",type:"wall",venue:"V-01",scope:"venue"}
  ];
  POS.forEach(function(r){db.put("positions",r);});

  var INFRA = [
    {id:"INF-012",label:"A12",type:"audio tie",endpoint_a:"SL Wall pos 12",endpoint_b:"Bay Row C pos 3",venue:"V-01"},
    {id:"INF-096",label:"D96",type:"data tie",endpoint_a:"FOH mount",endpoint_b:"Booth Data 3",venue:"V-01"},
    {id:"INF-104",label:"D104",type:"data tie",endpoint_a:"Catwalk",endpoint_b:"Booth",venue:"V-01"},
    {id:"INF-120",label:"PWR-3A-7",type:"power ckt",endpoint_a:"Panel 3A brk 7",endpoint_b:"SL Deck",venue:"V-01"},
    {id:"INF-121",label:"PWR-3A-9",type:"power ckt",endpoint_a:"Panel 3A brk 9",endpoint_b:"SR Wing",venue:"V-01"},
    {id:"INF-122",label:"DMX-HR-1",type:"DMX home run",endpoint_a:"Booth DMX 1",endpoint_b:"1st Elec drop",venue:"V-01"},
    {id:"INF-130",label:"PWR-2B-3",type:"power ckt",endpoint_a:"Panel 2B brk 3",endpoint_b:"1E outlet",venue:"V-01"},
    {id:"INF-140",label:"PWR-BOOTH",type:"power ckt",endpoint_a:"Panel 1A",endpoint_b:"Booth rack",venue:"V-01"},
    {id:"INF-150",label:"PWR-FOH",type:"power ckt",endpoint_a:"Panel 2A brk 11",endpoint_b:"FOH proj",venue:"V-01"}
  ];
  INFRA.forEach(function(r){db.put("infrastructure",r);});

  var NETS = [
    {id:"NET-01",name:"DANTE-1",protocol:"Dante",subnet:"135.254.16.0/16",vlan:"100",venue:"V-01"},
    {id:"NET-02",name:"DANTE-2",protocol:"Dante",subnet:"172.31.16.0/16",vlan:"200",venue:"V-01"},
    {id:"NET-03",name:"CONTROL",protocol:"Ethernet",subnet:"192.168.0.0/24",vlan:"1",venue:"V-01"},
    {id:"NET-04",name:"sACN",protocol:"sACN",subnet:"10.101.1.0/24",vlan:"300",venue:"V-01"},
    {id:"NET-05",name:"AV CONTROL",protocol:"Ethernet",subnet:"192.168.1.0/24",vlan:"400",venue:"V-01"}
  ];
  NETS.forEach(function(r){db.put("networks",r);});

  var UNITS = [
    {num:1,type:"FT-01",pos:"P-10",dir:"in",purpose:"Vocal DS",ch:18},
    {num:2,type:"FT-01",pos:"P-11",dir:"in",purpose:"Guitar amp",ch:19},
    {num:3,type:"FT-01",pos:"P-11",dir:"in",purpose:"Kick drum",ch:22},
    {num:4,type:"FT-02",pos:"P-11",dir:"in",purpose:"Snare",ch:23},
    {num:5,type:"FT-03",pos:"P-11",dir:"in",purpose:"Keys L",ch:24},
    {num:6,type:"FT-03",pos:"P-11",dir:"in",purpose:"Keys R",ch:25},
    {num:7,type:"FT-04",pos:"P-13",dir:"in",purpose:"Juliet wireless",ch:33,notes:"Lav"},
    {num:8,type:"FT-04",pos:"P-14",dir:"in",purpose:"Romeo wireless",ch:34,notes:"Lav"},
    {num:20,type:"FT-08",pos:"P-07",dir:"out",purpose:"Surround SL",ch:"Mix 4",notes:"Trim 14'"},
    {num:21,type:"FT-08",pos:"P-08",dir:"out",purpose:"Surround SR",ch:"Mix 5",notes:"Trim 14'"},
    {num:100,type:"FT-07",pos:"P-06",dir:"\u2014",purpose:"FOH Audio Console",role:"primary",asset_tag:"URITP-11953"},
    {num:101,type:"FT-06",pos:"P-06",dir:"\u2014",purpose:"Booth Rio (rack)"},
    {num:102,type:"FT-06",pos:"P-07",dir:"\u2014",purpose:"Stage Rio (portable)"},
    {num:300,type:"FT-18",pos:"P-11",dir:"\u2014",purpose:"Band snake",label:"MULT A"},
    {num:400,type:"FT-09",pos:"P-06",dir:"out",purpose:"IEM TX Sarah",ch:"Mix 8"},
    {num:401,type:"FT-10",pos:"P-12",dir:"out",purpose:"IEM RX Sarah",notes:"Bodypack"},
    {num:200,type:"FT-14",pos:"P-06",dir:"\u2014",purpose:"LX Console",role:"primary"},
    {num:201,type:"FT-15",pos:"P-06",dir:"\u2014",purpose:"DMX Gateway #1",notes:"Feeds 1E"},
    {num:30,type:"FT-11",pos:"P-01",dir:"\u2014",purpose:"DS warm wash L",ch:101,dimmer:201,dmx_addr:"1/101",notes:"R02"},
    {num:31,type:"FT-11",pos:"P-01",dir:"\u2014",purpose:"DS warm wash R",ch:102,dimmer:202,dmx_addr:"1/102",notes:"R02"},
    {num:32,type:"FT-11",pos:"P-01",dir:"\u2014",purpose:"DS cool wash L",ch:103,dimmer:203,dmx_addr:"1/103",notes:"R60"},
    {num:33,type:"FT-11",pos:"P-01",dir:"\u2014",purpose:"DS cool wash R",ch:104,dimmer:204,dmx_addr:"1/104",notes:"R60"},
    {num:40,type:"FT-13",pos:"P-02",dir:"\u2014",purpose:"Top wash C",ch:110,dmx_addr:"1/110",notes:"LED"},
    {num:210,type:"FT-20",pos:"P-06",dir:"\u2014",purpose:"Dimmer Rack #1",notes:"Feeds 1E"},
    {num:500,type:"FT-21",pos:"P-06",dir:"\u2014",purpose:"Video Switcher",role:"primary",notes:"Constellation"},
    {num:501,type:"FT-22",pos:"P-06",dir:"\u2014",purpose:"Roland TX #1",notes:"Proj feed"},
    {num:502,type:"FT-23",pos:"P-15",dir:"\u2014",purpose:"Roland RX #1",notes:"At projector"},
    {num:510,type:"FT-16",pos:"P-09",dir:"in",purpose:"PTZ Cam #1 (wide)",ch:"ATEM In1"},
    {num:520,type:"FT-25",pos:"P-15",dir:"out",purpose:"FOH Projector"},
    {num:530,type:"FT-08",pos:"P-16",dir:"out",purpose:"Backstage monitor",notes:"SM video"}
  ];
  UNITS.forEach(function(u) {
    var eid = "EP-U" + String(u.num).padStart(3,"0");
    db.put("endpoints",{id:eid,class:"physical"});
    db.put("units",{
      unit_id:"U-"+String(u.num).padStart(3,"0"), endpoint_id:eid, show_id:"SH-01",
      type_id:u.type, unit_num:u.num, position_id:u.pos, direction:u.dir,
      purpose:u.purpose, notes:u.notes||"", role:u.role||"", asset_tag:u.asset_tag||"",
      label:u.label||"", channel:u.ch||"", dimmer:u.dimmer||"", dmx_addr:u.dmx_addr||""
    });
  });

  var CPS = [
    {id:"CP-001",parent:"U-100",label:"Input Ch 22",type:"channel",signal:"ST-01",dir:"in",ch:22},
    {id:"CP-002",parent:"U-100",label:"Mix 4",type:"mix bus",signal:"ST-01",dir:"bus",ch:4},
    {id:"CP-003",parent:"U-100",label:"Mix 5",type:"mix bus",signal:"ST-01",dir:"bus",ch:5},
    {id:"CP-004",parent:"U-100",label:"Mix 8 (IEM)",type:"mix bus",signal:"ST-01",dir:"bus",ch:8},
    {id:"CP-005",parent:"U-100",label:"Dante TX 63",type:"net TX",signal:"ST-03",dir:"out",ch:63},
    {id:"CP-011",parent:"U-100",label:"Matrix 1",type:"matrix",signal:"ST-01",dir:"bus",ch:1},
    {id:"CP-012",parent:"U-100",label:"DCA 3",type:"DCA",signal:"ST-01",dir:"bus",ch:3},
    {id:"CP-050",parent:"U-500",label:"SDI In 1",type:"SDI in",signal:"ST-07",dir:"in",ch:1},
    {id:"CP-053",parent:"U-500",label:"SDI Out 1 (Pgm)",type:"SDI out",signal:"ST-07",dir:"out",ch:1},
    {id:"CP-054",parent:"U-500",label:"MV1 Out",type:"MV out",signal:"ST-07",dir:"out",ch:""},
    {id:"CP-060",parent:"U-500",label:"Program",type:"pgm bus",signal:"ST-07",dir:"bus",ch:""},
    {id:"CP-056",parent:"U-500",label:"MV1 Slot 1",type:"MV slot",signal:"ST-07",dir:"virtual",ch:1}
  ];
  CPS.forEach(function(cp) {
    var eid = "EP-"+cp.id;
    db.put("endpoints",{id:eid,class:"virtual"});
    db.put("control_points",{id:cp.id,endpoint_id:eid,parent_unit_id:cp.parent,label:cp.label,cp_type:cp.type,signal_type:cp.signal,direction:cp.dir,channel_num:cp.ch});
  });

  var CONNS = [
    {id:"C-001",show:"SH-01",src:"EP-U003",dst:"INF-012",type:"cable",signal:"ST-01",notes:"SM58 kick \u2192 tie A12"},
    {id:"C-002",show:"SH-01",src:"INF-012",dst:"EP-CP-001",type:"patch\u2192dante\u2192ch",signal:"ST-01",notes:"A12 \u2192 Bay \u2192 Rio \u2192 Dante \u2192 QL In22"},
    {id:"C-003",show:"SH-01",src:"EP-CP-005",dst:"EP-U020",type:"dante\u2192amp\u2192spkr",signal:"ST-03",notes:"QL TX63 \u2192 Amp \u2192 DXR12 SL"},
    {id:"C-004",show:"SH-01",src:"INF-120",dst:"EP-U020",type:"power",signal:"ST-10",notes:"Ckt 3A-7 \u2192 DXR12 SL"},
    {id:"C-005",show:"SH-01",src:"INF-121",dst:"EP-U021",type:"power",signal:"ST-10",notes:"Ckt 3A-9 \u2192 DXR12 SR"},
    {id:"C-006",show:"SH-01",src:"EP-U510",dst:"EP-CP-050",type:"SDI\u2192tie\u2192ATEM",signal:"ST-07",notes:"PTZ SDI \u2192 D104 \u2192 ATEM In1"},
    {id:"C-007",show:"SH-01",src:"EP-CP-053",dst:"EP-U520",type:"video chain",signal:"ST-07",notes:"ATEM Out1 \u2192 HT-TX \u2192 D96 \u2192 HT-RX \u2192 Proj"},
    {id:"C-008",show:"SH-01",src:"EP-CP-054",dst:"EP-U530",type:"cable",signal:"ST-07",notes:"ATEM MV1 \u2192 Backstage mon"},
    {id:"C-010",show:"SH-01",src:"INF-130",dst:"EP-U030",type:"power",signal:"ST-10",notes:"Ckt 2B-3 \u2192 Dim \u2192 S4 #30"},
    {id:"C-011",show:"SH-01",src:"INF-122",dst:"EP-U030",type:"DMX chain",signal:"ST-02",notes:"Eos \u2192 sACN \u2192 Net3 \u2192 DMX HR1 \u2192 Dim \u2192 S4"}
  ];
  CONNS.forEach(function(c){db.put("connections",{id:c.id,show_id:c.show,source_endpoint:c.src,dest_endpoint:c.dst,connection_type:c.type,signal_type:c.signal,notes:c.notes,cable_color:""});});

  var ASSIGNS = [
    {id:"A-001",show:"SH-01",src:"EP-U003",dst:"EP-CP-002",level:"-3dB",pre_post:"post",group:"",notes:"Kick \u2192 Mix 4"},
    {id:"A-002",show:"SH-01",src:"EP-U003",dst:"EP-CP-003",level:"-3dB",pre_post:"post",group:"",notes:"Kick \u2192 Mix 5"},
    {id:"A-003",show:"SH-01",src:"EP-U003",dst:"EP-CP-004",level:"-6dB",pre_post:"pre",group:"",notes:"Kick \u2192 IEM Sarah"},
    {id:"A-004",show:"SH-01",src:"EP-U003",dst:"EP-CP-011",level:"0dB",pre_post:"post",group:"",notes:"Kick \u2192 Matrix 1"},
    {id:"A-010",show:"SH-01",src:"EP-U003",dst:"EP-CP-012",level:"unity",pre_post:"",group:"Band",notes:"DCA group"},
    {id:"A-011",show:"SH-01",src:"EP-U004",dst:"EP-CP-012",level:"unity",pre_post:"",group:"Band",notes:"DCA group"},
    {id:"A-020",show:"SH-01",src:"EP-U020",dst:"",level:"unity",pre_post:"",group:"Surround Array",notes:""},
    {id:"A-021",show:"SH-01",src:"EP-U021",dst:"",level:"unity",pre_post:"",group:"Surround Array",notes:""},
    {id:"A-040",show:"SH-01",src:"EP-CP-050",dst:"EP-CP-056",level:"unity",pre_post:"",group:"",notes:"Cam1 \u2192 MV1 Slot1"}
  ];
  ASSIGNS.forEach(function(a){db.put("assignments",{id:a.id,show_id:a.show,source_endpoint:a.src,dest_cp:a.dst,level:a.level,pre_post:a.pre_post,group_name:a.group,notes:a.notes});});

  var NIS = [
    {id:"NI-01",unit_id:"U-100",network_id:"NET-01",ip:"135.254.16.100",hostname:"YAMAHA_QL5",port_label:"Primary"},
    {id:"NI-02",unit_id:"U-100",network_id:"NET-03",ip:"192.168.0.99",hostname:"",port_label:"Control"},
    {id:"NI-03",unit_id:"U-101",network_id:"NET-01",ip:"135.254.16.101",hostname:"RIO_BOOTH",port_label:"Primary"},
    {id:"NI-04",unit_id:"U-102",network_id:"NET-01",ip:"135.254.16.102",hostname:"RIO_STAGE",port_label:"Primary"},
    {id:"NI-05",unit_id:"U-200",network_id:"NET-04",ip:"10.101.1.100",hostname:"",port_label:"Port A"},
    {id:"NI-06",unit_id:"U-500",network_id:"NET-05",ip:"192.168.1.100",hostname:"",port_label:"Ethernet"},
    {id:"NI-07",unit_id:"U-510",network_id:"NET-05",ip:"192.168.1.50",hostname:"PTZ-CAM-1",port_label:"Network"}
  ];
  NIS.forEach(function(ni){db.put("network_interfaces",ni);});

  db.save();
}
