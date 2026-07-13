/* data.js — fetch the canonical per-round store, compute standings, shared helpers.
 Loaded first; defines globals used by matrix.js, trajectory.js and panel.js. No data
 duplicated: verified results live in ./f1-results/2026/ (nested under the app).
 Index file: index_rounds.json (renamed from index.json 2026-07-09). */
const APP_VERSION='v6.0';
const DATA_BASE='f1-results/2026/';
const DATA_INDEX='index_rounds.json';
const TEAM_VAR={"Mercedes":"--t-mercedes","Ferrari":"--t-ferrari","McLaren":"--t-mclaren","Red Bull":"--t-redbull","Racing Bulls":"--t-racingbulls","Alpine":"--t-alpine","Aston Martin":"--t-astonmartin","Williams":"--t-williams","Haas":"--t-haas","Audi":"--t-audi","Cadillac":"--t-cadillac"};
const teamColor=t=>`var(${TEAM_VAR[t]||'--txt-dim'})`;

/* Illustrative per-cell granular detail (grid/best/pits/tyres/story tags).
 NOT in the JSON store yet — flagged 'preview' in the UI until sourced from OpenF1.
 Keyed round:driverId. Story keys resolve against STORY. */
const STORY={"pole-to-win":"Converted pole to a lights-to-flag win.","streak":"Extended the winning streak from the front.","streak-end":"The race that ended the streak.","maiden":"A landmark maiden result.","charge":"Charged from P{grid} to P{finish}.","recovery":"Recovery drive from P{grid}.","lost-lead-rel":"Led before a reliability failure ended it.","reliability":"Retired with a mechanical failure while running strong.","late-sc":"A late safety car reshuffled the finish.","held-podium":"Managed the tyres to hold the podium.","undercut":"Jumped track position with an early stop.","appeal":"Result restored on appeal."};
const DETAIL={"8:86ae52qva":{grid:1,best:"1:06.983",pits:2,tyres:["M","H"],story:["pole-to-win"]},"8:86ae52rym":{grid:5,best:"1:07.112",pits:2,tyres:["M","H"],story:["charge"]},"5:86ae52qvh":{grid:3,best:"1:13.510",pits:2,tyres:["M","H"],story:["streak"]},"7:86ae52rxg":{grid:2,best:"1:15.880",pits:3,tyres:["S","M","M"],story:["maiden","undercut"]},"7:86ae52qvh":{grid:4,best:"1:15.990",pits:2,tyres:["M","H"],story:["streak-end","reliability"]},"9:86ae52rxd":{grid:6,best:"1:29.440",pits:1,tyres:["M","H"],story:["late-sc"]},"2:86ae52qvh":{grid:1,best:"1:35.275",pits:1,tyres:["M","H"],story:["pole-to-win","maiden"]}};
const renderStory=(keys,row)=>keys.map(k=>(STORY[k]||k).replace("{grid}",row.grid??"?").replace("{finish}",row.finish??"?"));

/* shared mutable state */
let ROUNDS=[],DRV={},STANDINGS=[],sortMode='champ';
const FIRST=id=>(DRV[id].name).replace("Andrea Kimi ","").split(" ")[0];
const LAST=id=>{const n=DRV[id].name;return n==="Andrea Kimi Antonelli"?"Antonelli":n.split(" ").slice(-1)[0];};
const codeOf=rd=>(rd.name.match(/\b([A-Z]{3})\b/)||[])[1]||rd.slug.slice(0,3).toUpperCase();

async function load(){
 try{
 const idx=await fetch(DATA_BASE+DATA_INDEX,{cache:'no-cache'}).then(r=>{if(!r.ok)throw 0;return r.json();});
 const files=idx.rounds.sort((a,b)=>a.round-b.round);
 ROUNDS=await Promise.all(files.map(f=>fetch(DATA_BASE+f.file.replace('./',''),{cache:'no-cache'}).then(r=>{if(!r.ok)throw 0;return r.json();})));
 compute();
 render();
 // Publish that the season is loaded so lenses mounted after this (e.g. history.js)
 // can render immediately instead of blind-polling — fixes History hanging on slow mobile.
 window.dispatchEvent(new Event('season-ready'));
 }catch(e){
 document.getElementById('stage').innerHTML='<div class="state">Could not load the season data.<br><span style="font-size:0.78rem">This lens reads the results store at <code>'+DATA_BASE+DATA_INDEX+'</code>; it needs to run on GitHub Pages (same origin), not opened as a local file.</span></div>';
 }
}

function compute(){
 DRV={};
 ROUNDS.forEach(rd=>{
 const rows=[...(rd.classification||[]),...((rd.sprint&&rd.sprint.classification)||[])];
 rows.forEach(r=>{ if(r.driverId){ DRV[r.driverId]={name:r.driver,team:r.team}; } });
 });
 const race=id=>ROUNDS.reduce((t,rd)=>{const r=(rd.classification||[]).find(x=>x.driverId===id);return t+(r?r.points:0);},0);
 const spr=id=>ROUNDS.reduce((t,rd)=>{if(!rd.sprint)return t;const r=rd.sprint.classification.find(x=>x.driverId===id);return t+(r?r.points:0);},0);
 STANDINGS=Object.keys(DRV).map(id=>({id,name:DRV[id].name,team:DRV[id].team,race:race(id),sprint:spr(id),total:race(id)+spr(id)})).sort((a,b)=>b.total-a.total||LAST(a.id).localeCompare(LAST(b.id)));
 STANDINGS.forEach((d,i)=>d.champRank=i+1);
}

const raceRow=(rd,id)=>(rd.classification||[]).find(x=>x.driverId===id);
function wins(id){return ROUNDS.filter(rd=>{const r=raceRow(rd,id);return r&&r.pos===1;}).length;}
function bestFin(id){let b=99;ROUNDS.forEach(rd=>{const r=raceRow(rd,id);if(r&&r.status==='FIN'&&r.pos&&r.pos<b)b=r.pos;});return b;}
function teammate(id){const t=DRV[id].team;return Object.keys(DRV).find(k=>k!==id&&DRV[k].team===t);}
function h2h(id,mate){let me=0,them=0;ROUNDS.forEach(rd=>{const a=raceRow(rd,id),b=raceRow(rd,mate);if(a&&b&&a.status==='FIN'&&b.status==='FIN'){if(a.pos<b.pos)me++;else them++;}});return[me,them];}

/* trajectory source series (combined race + sprint), used by trajectory.js */
function cumPoints(id){let t=0;return ROUNDS.map(rd=>{const r=(rd.classification||[]).find(x=>x.driverId===id);const s=rd.sprint?rd.sprint.classification.find(x=>x.driverId===id):null;t+=(r?r.points:0)+(s?s.points:0);return t;});}
function leaderPace(){return ROUNDS.map((_,i)=>Math.max(...Object.keys(DRV).map(id=>cumPoints(id)[i])));}
function gapVals(id){const c=cumPoints(id),l=leaderPace();return c.map((v,i)=>v-l[i]);}
function rankTrajectory(id){const cum={};Object.keys(DRV).forEach(k=>cum[k]=0);const tr=[];ROUNDS.forEach(rd=>{(rd.classification||[]).forEach(r=>cum[r.driverId]+=r.points);if(rd.sprint)rd.sprint.classification.forEach(r=>cum[r.driverId]+=r.points);const board=Object.keys(cum).sort((a,b)=>cum[b]-cum[a]);tr.push(board.indexOf(id)+1);});return tr;}

function cellMeta(rd,id){
 const r=raceRow(rd,id);if(!r)return null;
 const det=DETAIL[`${rd.round}:${id}`];
 const note=r.stewardNote?{text:r.stewardNote,onRoad:r.onRoadPos}:null;
 const gridDelta=(det&&det.grid&&r.pos)?det.grid-r.pos:null;
 const hasStory=!!(note||(det&&det.story&&det.story.length));
 const bigMover=gridDelta!==null&&gridDelta>=5;
 const dnfHot=r.status==='DNF'&&note;
 return{r,pos:r.pos,status:r.status,pts:r.points,det,note,gridDelta,hasStory,bigMover,dnfHot,hasDeep:!!det};
}

function orderedRows(){const rows=[...STANDINGS];if(sortMode==='champ')return rows;if(sortMode==='name')return rows.sort((a,b)=>LAST(a.id).localeCompare(LAST(b.id)));const rd=ROUNDS.find(x=>x.round===sortMode);const rank=id=>{const r=raceRow(rd,id);if(!r)return 999;if(r.status==='DNF')return 900;return r.pos;};return rows.sort((a,b)=>rank(a.id)-rank(b.id)||b.total-a.total);}
