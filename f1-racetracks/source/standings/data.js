/* data.js — fetch the canonical per-round store, compute standings, shared helpers.
 Loaded first; defines globals used by matrix.js, trajectory.js and panel.js. No data
 duplicated: verified results live in ./f1-results/2026/ (nested under the app).
 Index file: index_rounds.json (renamed from index.json 2026-07-09).

 ⚠️ v13 (2026-08-01) — THE CALENDAR IS NOT IN THIS STORE. A round's NUMBER, NAME and DATE
 come from the weekend vector (season/2026/index_weekends.json) via source/08_season.js,
 joined BY SLUG. The round file's own stored round/name/date are the FALLBACK, used only when
 the season layer is unreachable. Never join on a round number: it is derived from calendar
 position and shifts when a round is inserted or cancelled (Decision Log J9 ruling 4).

 ⚠️ v14 (2026-08-01) — THE JOIN CAN NO LONGER EMIT `undefined`. v13's fallback chain ended at
 the round file, so once those three fields are deleted from the round files the chain resolved
 to undefined and `codeOf` / panel.js's `rd.name.replace(...)` would have THROWN rather than
 degraded. withSeasonMeta now terminates in a computed default for round and name, so no
 consumer downstream of it can observe a missing field — one place to reason about instead of
 five call sites, and the next call site somebody adds is safe by construction.

 Also fixed in v13: the manifest used to be ordered with (a,b)=>a.round-b.round, and v11 reduced
 manifest rows to {slug,file}. That comparison had been NaN ever since; it stayed harmless only
 because the rows are written in date order. Ordering happens after the season join. */
const APP_VERSION='v6.0';
const DATA_BASE='f1-results/2026/';
const DATA_INDEX='index_rounds.json';
const TEAM_VAR={"Mercedes":"--t-mercedes","Ferrari":"--t-ferrari","McLaren":"--t-mclaren","Red Bull":"--t-redbull","Racing Bulls":"--t-racingbulls","Alpine":"--t-alpine","Aston Martin":"--t-astonmartin","Williams":"--t-williams","Haas":"--t-haas","Audi":"--t-audi","Cadillac":"--t-cadillac"};
const teamColor=t=>`var(${TEAM_VAR[t]||'--txt-dim'})`;

/* Narrative phrase templates for story tags. Kept: these are copy, not facts.
 NOTE (2026-07-28): nothing currently supplies `story` keys — the only producer was
 the DETAIL map deleted below. renderStory is call-guarded everywhere, so this is
 inert until a real per-round narrative source exists. Do NOT repopulate it by hand. */
const STORY={"pole-to-win":"Converted pole to a lights-to-flag win.","streak":"Extended the winning streak from the front.","streak-end":"The race that ended the streak.","maiden":"A landmark maiden result.","charge":"Charged from P{grid} to P{finish}.","recovery":"Recovery drive from P{grid}.","lost-lead-rel":"Led before a reliability failure ended it.","reliability":"Retired with a mechanical failure while running strong.","late-sc":"A late safety car reshuffled the finish.","held-podium":"Managed the tyres to hold the podium.","undercut":"Jumped track position with an early stop.","appeal":"Result restored on appeal."};
const renderStory=(keys,row)=>keys.map(k=>(STORY[k]||k).replace("{grid}",row.grid??"?").replace("{finish}",row.finish??"?"));

/* ⚠️ DELETED 2026-07-28 — the `DETAIL` map (PR: derive gridDelta from the store).

   It was a 7-entry hardcoded object keyed `round:driverId`, carrying grid/best/pits/
   tyres/story, and `cellMeta` computed the app's core story metric from it:
   `gridDelta = det.grid - r.pos`. It read det.grid and NEVER r.grid — while the store
   has carried real per-row `grid` on six of nine rounds all along.

   Two of its five checkable grid values contradicted the store (r05 Antonelli said 3,
   store says 2; r09 Leclerc said 6, store says 2) and `best` matched a real stored lap
   in one entry out of seven. Because `bigMover` fires at gridDelta >= 5 and only seven
   cells existed, the app was blind to every genuine recovery drive in the season —
   Verstappen P20 → P6 (Albert Park), Alonso P22 → P10 (Monaco), Colapinto P19 → P9
   (Silverstone) — while rendering a grid Leclerc never started from.

   Replaced by deriveDetail() below, which reads the canonical row. This restores the
   compute-once law the README already states: positionsGained is DERIVED (grid - pos),
   never stored. Full finding: F1 Racetracks App — Decision Log, W1 (2026-07-28). */

/* shared mutable state. SEASON_TOTAL = how many rounds the CALENDAR holds (23 in 2026), which
   is not the same as ROUNDS.length (how many have been raced and have a results file). It is
   null when the season layer is unavailable, and consumers must render nothing rather than a
   guess in that case. */
let ROUNDS=[],DRV={},STANDINGS=[],sortMode='champ',SEASON_TOTAL=null;
const FIRST=id=>(DRV[id].name).replace("Andrea Kimi ","").split(" ")[0];
const LAST=id=>{const n=DRV[id].name;return n==="Andrea Kimi Antonelli"?"Antonelli":n.split(" ").slice(-1)[0];};

/* 'gilles-villeneuve' -> 'Gilles Villeneuve'. The terminal fallback for a round label when
   neither the season vector nor the round file supplies a name. Never pretty, always true —
   the slug is the one identifier that cannot be missing, because the manifest is keyed on it. */
const titleFromSlug=s=>String(s||'').split('-').filter(Boolean).map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ');

/* Three-letter column code. Hardened v14: `.match` is called on a value this helper does not
   own, so it guards rather than trusting the join. */
const codeOf=rd=>((rd&&rd.name?String(rd.name):'').match(/\b([A-Z]{3})\b/)||[])[1]||String((rd&&rd.slug)||'').slice(0,3).toUpperCase();

/* The season calendar, or null. Never throws — this lens is the championship table, and a
   calendar outage must cost round LABELS, never the standings themselves. */
async function seasonCalendar(){
 if(!window.F1Season||!window.F1Season.ready) return null;
 try{ return await window.F1Season.ready; }
 catch(e){ console.error('[standings] season layer unavailable — round number, name and date fall back to the round file.',e); return null; }
}

/* Join one round file to its weekend row, by slug. Vector wins, round file is the fallback,
   and v14 adds a terminal default so the result is NEVER undefined:

     round -> vector · stored · manifest position + 1
     name  -> vector · stored · title derived from the slug
     date  -> vector · stored · null   (the one field left nullable on purpose: fmtDate and the
              date cells already render an empty string for null, and an invented date is worse
              than a blank one)

   `i` is the manifest index, which is in date order, so position+1 is the same ordinal the
   season layer would have derived. It is a floor, not a claim — and per J9 ruling 4 a derived
   ordinal is never persisted anywhere, including back into the round file it came from. */
function withSeasonMeta(rd,mf,cal,i){
 if(!rd) return null;
 const slug=rd.slug||(mf&&mf.slug)||null;
 const w=(cal&&cal.bySlug&&slug)?cal.bySlug[slug]:null;
 return Object.assign({},rd,{
  slug:slug,
  round:(w&&w.round!=null)?w.round:(rd.round!=null?rd.round:(i+1)),
  name:(w&&w.name)||rd.name||titleFromSlug(slug),
  date:(w&&w.raceDate)||rd.date||null
 });
}

async function load(){
 try{
 const cal=await seasonCalendar();
 const idx=await fetch(DATA_BASE+DATA_INDEX,{cache:'no-cache'}).then(r=>{if(!r.ok)throw 0;return r.json();});
 const manifest=(idx.rounds||[]);
 const loaded=await Promise.all(manifest.map(f=>fetch(DATA_BASE+f.file.replace('./',''),{cache:'no-cache'}).then(r=>{if(!r.ok)throw 0;return r.json();})));
 ROUNDS=loaded.map((rd,i)=>withSeasonMeta(rd,manifest[i],cal,i)).filter(Boolean).sort((a,b)=>(a.round||0)-(b.round||0));
 SEASON_TOTAL=(cal&&Array.isArray(cal.weekends)&&cal.weekends.length)?cal.weekends.length:null;
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

/* deriveDetail — the per-cell detail object, DERIVED from the canonical row.
   Replaces the deleted hardcoded DETAIL map. Every value here traces to the store.

   grid  : r.grid verbatim. Number on the enriched rounds, the string 'PL' for a
           pit-lane start, null on the three rounds that carry no grid data yet
           (r03 suzuka, r04 miami, r07 catalunya). Consumers already branch on it.
   best  : this driver's real fastest race lap time (r.fastLap.time, complete r1-9).
   pits / tyres / story : DELIBERATELY ABSENT. There is no per-stint or pit-stop data
           in the store (tyres.stints[] is designed but unpopulated), and inventing it
           is what the DETAIL map did. Panel renderers already guard on these being
           missing, so they simply do not render. When real data lands, add it HERE —
           to a derivation off the store — never to a literal map. */
function deriveDetail(r){
 if(!r)return null;
 return{ grid:(r.grid!=null?r.grid:null), best:(r.fastLap&&r.fastLap.time)?r.fastLap.time:null };
}

function cellMeta(rd,id){
 const r=raceRow(rd,id);if(!r)return null;
 const det=deriveDetail(r);
 const note=r.stewardNote?{text:r.stewardNote,onRoad:r.onRoadPos}:null;
 // positionsGained, derived: only when the round actually carries a NUMERIC grid.
 // 'PL' (pit-lane start) has no meaningful numeric delta, and the three flat rounds
 // have no grid at all — both yield null, and null renders as nothing, never a guess.
 const gridNum=(typeof r.grid==='number')?r.grid:null;
 const gridDelta=(gridNum!=null&&r.pos)?gridNum-r.pos:null;
 const hasStory=!!note;
 const bigMover=gridDelta!==null&&gridDelta>=5;
 const dnfHot=r.status==='DNF'&&note;
 return{r,pos:r.pos,status:r.status,pts:r.points,det,note,gridDelta,hasStory,bigMover,dnfHot,hasDeep:!!(det&&det.grid!=null)};
}

function orderedRows(){const rows=[...STANDINGS];if(sortMode==='champ')return rows;if(sortMode==='name')return rows.sort((a,b)=>LAST(a.id).localeCompare(LAST(b.id)));const rd=ROUNDS.find(x=>x.round===sortMode);const rank=id=>{const r=raceRow(rd,id);if(!r)return 999;if(r.status==='DNF')return 900;return r.pos;};return rows.sort((a,b)=>rank(a.id)-rank(b.id)||b.total-a.total);}
