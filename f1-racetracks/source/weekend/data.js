/* weekend/data.js — Race Weekend lens, data layer (v2.0).
   SINGLE SOURCE OF TRUTH = f1-results/2026/ (index_rounds.json + per-round files).
   Loads the whole season so the championship swing can be computed LIVE (cumulative
   WDC after each round). Fails soft to an embedded Canada (r5) snapshot so the page
   still renders off-origin (local preview). Nothing about results is stored twice —
   podium/pole/FL/grid/quali/sprint all derive from the round file in render.js.

   Globals exposed (classic-script scope, read bare by render.js / nav.js):
     ROUNDS  — ascending array of round objects
     META    — { last_completed_round_slug }
     helpers — tc, last, short, esc, fmtDate, el
     wdcAfter(i), swingFor(i), stintsFor(slug) */
const BASE='f1-results/2026/';
const TEAMVAR={Mercedes:'--t-mercedes',Ferrari:'--t-ferrari',McLaren:'--t-mclaren','Red Bull':'--t-redbull','Racing Bulls':'--t-racingbulls',Alpine:'--t-alpine','Aston Martin':'--t-astonmartin',Williams:'--t-williams',Haas:'--t-haas',Audi:'--t-audi',Cadillac:'--t-cadillac'};
const tc=t=>`var(${TEAMVAR[t]||'--line'})`;
const last=n=>{n=String(n||'');return n==='Andrea Kimi Antonelli'?'Antonelli':(n.split(' ').slice(-1)[0]||n);};
const short=s=>String(s||'').replace(' Grand Prix','').replace('-Catalunya','');
const esc=s=>String(s??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const fmtDate=d=>{if(!d)return'';const dt=new Date(d+'T00:00:00');return isNaN(dt)?d:dt.toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'});};
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};

/* Illustrative tyre strategy (52-lap Canada shown). NOT in the store yet — flagged
   'illustrative' in the UI, sourced going forward from lap-time data. Keyed by slug. */
const STINTS={
  'gilles-villeneuve':{
    laps:70,
    rows:[
      {driver:'Andrea Kimi Antonelli',stints:[['med',30],['hard',40]]},
      {driver:'Lewis Hamilton',stints:[['med',26],['hard',44]]},
      {driver:'Max Verstappen',stints:[['hard',34],['med',36]]},
      {driver:'Charles Leclerc',stints:[['hard',40],['med',30]]},
      {driver:'Isack Hadjar',stints:[['med',32],['hard',38]]}
    ]
  }
};
const stintsFor=slug=>STINTS[slug]||null;

/* embedded fallback (off-origin preview): the Canada round only */
const EMBED={meta:{last_completed_round_slug:'gilles-villeneuve'},rounds:[{
  round:5,slug:'gilles-villeneuve',name:'Canadian Grand Prix',date:'2026-05-24',
  summary:"Antonelli's fourth win in a row after leader Russell retired from the lead battle with a power-unit issue on lap 30. First driver to win each of his first four F1 races in succession.",
  pole:{driver:'George Russell',team:'Mercedes',time:'1:12.578'},
  fastestLap:{driverId:'86ae52qvh',driver:'Andrea Kimi Antonelli',team:'Mercedes',time:'1:14.210',lap:68},
  sprint:{classification:[
    {pos:1,driverId:'86ae52qva',driver:'George Russell',team:'Mercedes',points:8},
    {pos:2,driverId:'86ae52q76',driver:'Lando Norris',team:'McLaren',points:7},
    {pos:3,driverId:'86ae52qvh',driver:'Andrea Kimi Antonelli',team:'Mercedes',points:6},
    {pos:4,driverId:'86ae52q7p',driver:'Oscar Piastri',team:'McLaren',points:5},
    {pos:5,driverId:'86ae52rxd',driver:'Charles Leclerc',team:'Ferrari',points:4},
    {pos:6,driverId:'86ae52rxg',driver:'Lewis Hamilton',team:'Ferrari',points:3},
    {pos:7,driverId:'86ae52rym',driver:'Max Verstappen',team:'Red Bull',points:2},
    {pos:8,driverId:'86aj1ra31',driver:'Arvid Lindblad',team:'Racing Bulls',points:1}]},
  classification:[
    {pos:1,driverId:'86ae52qvh',driver:'Andrea Kimi Antonelli',team:'Mercedes',status:'FIN',points:25,grid:2,qualifying:{pos:2,q1:'1:13.380',q2:'1:13.076',q3:'1:12.646'}},
    {pos:2,driverId:'86ae52rxg',driver:'Lewis Hamilton',team:'Ferrari',status:'FIN',points:18,grid:5,qualifying:{pos:5,q1:'1:13.767',q2:'1:13.041',q3:'1:12.868'}},
    {pos:3,driverId:'86ae52rym',driver:'Max Verstappen',team:'Red Bull',status:'FIN',points:15,grid:6,qualifying:{pos:6,q1:'1:14.067',q2:'1:13.479',q3:'1:12.907'}},
    {pos:4,driverId:'86ae52rxd',driver:'Charles Leclerc',team:'Ferrari',status:'FIN',points:12,grid:8,qualifying:{pos:8,q1:null,q2:null,q3:'1:12.976'}},
    {pos:5,driverId:'86ae52ryt',driver:'Isack Hadjar',team:'Red Bull',status:'FIN',points:10,grid:7,qualifying:{pos:7,q1:null,q2:null,q3:'1:12.935'}},
    {pos:6,driverId:'86aj1ra0h',driver:'Franco Colapinto',team:'Alpine',status:'FIN',points:8,grid:10,qualifying:{pos:10,q1:null,q2:null,q3:'1:13.697'}},
    {pos:7,driverId:'86ae52rye',driver:'Liam Lawson',team:'Racing Bulls',status:'FIN',points:6,grid:12,qualifying:{pos:12,q1:null,q2:'1:13.897',q3:null}},
    {pos:8,driverId:'86ae52rq4',driver:'Pierre Gasly',team:'Alpine',status:'FIN',points:4,grid:14,qualifying:{pos:14,q1:null,q2:'1:14.187',q3:null}},
    {pos:9,driverId:'86ae52rqj',driver:'Carlos Sainz',team:'Williams',status:'FIN',points:2,grid:15,qualifying:{pos:15,q1:null,q2:null,q3:null}},
    {pos:10,driverId:'86ae52rxv',driver:'Oliver Bearman',team:'Haas',status:'FIN',points:1,grid:16,qualifying:{pos:16,q1:null,q2:null,q3:null}},
    {pos:11,driverId:'86ae52q7p',driver:'Oscar Piastri',team:'McLaren',status:'FIN',points:0,grid:4,qualifying:{pos:4,q1:'1:13.559',q2:'1:13.285',q3:'1:12.781'}},
    {pos:12,driverId:'86ae52rqw',driver:'Nico Hulkenberg',team:'Audi',status:'FIN',points:0,grid:11,qualifying:{pos:11,q1:null,q2:'1:13.886',q3:null}},
    {pos:13,driverId:'86ae52rqp',driver:'Gabriel Bortoleto',team:'Audi',status:'FIN',points:0,grid:13,qualifying:{pos:13,q1:null,q2:'1:14.071',q3:null}},
    {pos:14,driverId:'86ae52rxu',driver:'Esteban Ocon',team:'Haas',status:'FIN',points:0,grid:18,qualifying:{pos:18,q1:null,q2:null,q3:null}},
    {pos:15,driverId:'86ae52rqa',driver:'Lance Stroll',team:'Aston Martin',status:'FIN',points:0,grid:21,qualifying:{pos:21,q1:null,q2:null,q3:null}},
    {pos:16,driverId:'86aj1ra1g',driver:'Valtteri Bottas',team:'Cadillac',status:'FIN',points:0,grid:20,qualifying:{pos:20,q1:null,q2:null,q3:null}},
    {pos:null,driverId:'86ae52qva',driver:'George Russell',team:'Mercedes',status:'DNF',points:0,grid:1,qualifying:{pos:1,q1:'1:13.953',q2:'1:13.079',q3:'1:12.578'},stewardNote:'Retired from the lead on lap 30 with a power-unit issue.'},
    {pos:null,driverId:'86ae52q76',driver:'Lando Norris',team:'McLaren',status:'DNF',points:0,grid:3,qualifying:{pos:3,q1:'1:13.503',q2:'1:13.049',q3:'1:12.729'}},
    {pos:null,driverId:'86aj1ra31',driver:'Arvid Lindblad',team:'Racing Bulls',status:'DNF',points:0,grid:9,qualifying:{pos:9,q1:null,q2:null,q3:'1:13.280'}},
    {pos:null,driverId:'86aj1ra1z',driver:'Sergio Perez',team:'Cadillac',status:'DNF',points:0,grid:19,qualifying:{pos:19,q1:null,q2:null,q3:null}},
    {pos:null,driverId:'86ae52rqc',driver:'Alexander Albon',team:'Williams',status:'DNF',points:0,grid:17,qualifying:{pos:17,q1:null,q2:null,q3:null}},
    {pos:null,driverId:'86ae52rq8',driver:'Fernando Alonso',team:'Aston Martin',status:'DNF',points:0,grid:22,qualifying:{pos:22,q1:null,q2:null,q3:null}}
  ]}]};

/* shared season state */
let ROUNDS=[], META={};

async function loadSeason(){
  try{
    const idx=await fetch(BASE+'index_rounds.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw 0;return r.json();});
    META={last_completed_round_slug:idx.last_completed_round_slug||null};
    const files=(idx.rounds||[]).slice().sort((a,b)=>a.round-b.round);
    const loaded=await Promise.all(files.map(f=>fetch(BASE+f.file.replace('./',''),{cache:'no-cache'}).then(r=>r.ok?r.json():null).catch(()=>null)));
    ROUNDS=loaded.filter(Boolean).sort((a,b)=>a.round-b.round);
    if(!ROUNDS.length) throw 0;
  }catch(e){
    ROUNDS=EMBED.rounds; META=EMBED.meta;
  }
  return {ROUNDS,META};
}

/* cumulative WDC (race + sprint) through ROUNDS index i, descending by points */
function wdcAfter(i){
  const pts={},nm={},tm={};
  const add=r=>{if(!r||!r.driverId)return;pts[r.driverId]=(pts[r.driverId]||0)+(r.points||0);nm[r.driverId]=r.driver;tm[r.driverId]=r.team;};
  for(let k=0;k<=i && k<ROUNDS.length;k++){
    const rd=ROUNDS[k];if(!rd)continue;
    (rd.classification||[]).forEach(add);
    if(rd.sprint&&rd.sprint.classification) rd.sprint.classification.forEach(add);
  }
  return Object.keys(pts).map(id=>({id,pts:pts[id],name:nm[id],team:tm[id]}))
    .sort((a,b)=>b.pts-a.pts||last(a.name).localeCompare(last(b.name)));
}

/* championship swing produced BY round index i: leader + margin after, and the
   change in the leader's margin vs before this round (positive = extended). */
function swingFor(i){
  const after=wdcAfter(i);
  if(!after.length) return null;
  const leader=after[0], second=after[1];
  const marginAfter=second?leader.pts-second.pts:leader.pts;
  let delta=null;
  if(i>0){
    const before=wdcAfter(i-1);
    const bLead=before[0];
    if(bLead){
      const bSecond=before[1];
      const bMargin=bLead.id===leader.id?(bSecond?bLead.pts-bSecond.pts:bLead.pts):null;
      if(bLead.id===leader.id && bMargin!=null) delta=marginAfter-bMargin;
    }
  }
  return {leader,marginAfter,delta,top:after.slice(0,5)};
}
