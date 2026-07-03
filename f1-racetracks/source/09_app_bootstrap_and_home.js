/*
Transition note:
- Early-season data (rounds 01–09) is still trusted from the plaintext handoff slices listed in source/05_legacy_track_data_map.md.
- Later-season data (rounds 10–24) now lives in grouped semantic source files.
- When rebuilding index.html from semantic source, assemble TRACKS in round order first, then keep the logic below unchanged.
*/

const APP_VERSION = "v4";
const APP_DATE = "2026-06-30";
const SEASON = "2026";

/*
const TRACKS = [
  ...TRACK_DATA_ROUNDS_01_03,
  ...TRACK_DATA_ROUNDS_06_09,
  ...TRACK_DATA_ROUNDS_10_13,
  ...TRACK_DATA_ROUNDS_14_24
];
*/

const bySlug = Object.fromEntries(TRACKS.map(t=>[t.slug,t]));
const reportTracks = TRACKS.filter(t=>t.report);
const SECCOL={s1:'var(--s1)',s2:'var(--s2)',s3:'var(--s3)'},SN={s1:'S1',s2:'S2',s3:'S3'};
const app=document.getElementById('app');
const NS="http://www.w3.org/2000/svg";
const E=(t,a={})=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);return e;};
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));

const jump=document.getElementById('jump');
jump.innerHTML='<option value="">Jump to circuit…</option>'+
 TRACKS.map(t=>`<option value="${t.slug}">R${t.round} · ${esc(t.gp)}${t.report?'':' (soon)'}</option>`).join('');
jump.addEventListener('change',()=>{ if(jump.value) location.hash='#/'+jump.value; });

function router(){
 const slug=(location.hash.replace(/^#\/?/,'')||'').trim();
 if(slug && bySlug[slug]) renderTrack(bySlug[slug]);
 else renderHome();
 jump.value = bySlug[slug] ? slug : '';
 window.scrollTo(0,0);
 if(window.lucide) lucide.createIcons();
 updateFooterMeta(slug && bySlug[slug] ? bySlug[slug] : null);
}
window.addEventListener('hashchange',router);

function renderHome(){
 const built=reportTracks.length;
 app.innerHTML=`<div class="view"><div class="home-h">
 <p class="eyebrow">Circuit Breakdowns // ${SEASON} FIA Formula 1 World Championship</p>
 <h1>F1 Racetracks</h1>
 <p class="sub">Home base for every round’s technical track report. Click a circuit to open its full breakdown: official map, lap profile with elevation, DRS and sectors, pit and tyre strategy, overtaking, and live weather. One app, ${built} breakdowns built.</p>
 </div>
 <div class="legend">
 <span class="lg"><span class="d" style="background:var(--done)"></span>Completed race</span>
 <span class="lg"><span class="d" style="background:var(--active)"></span>Race weekend live</span>
 <span class="lg"><span class="d" style="background:var(--line)"></span>Upcoming</span>
 <span class="lg"><span class="badge b-report" style="padding:2px 6px"><span class="d" style="background:var(--done)"></span>Breakdown ready</span></span>
 </div>
 <div class="grid" id="grid"></div></div>`;
 const grid=document.getElementById('grid');
 TRACKS.forEach(t=>{
 const b=document.createElement('button');b.className='race';
 if(!t.report) b.disabled=true; else b.onclick=()=>location.hash='#/'+t.slug;
 const ss=t.status==='done'?'ss-done':t.status==='active'?'ss-active':'ss-pending';
 b.innerHTML=`<span class="status-stripe ${ss}"></span>
 <div class="rd"><span>Round ${String(t.round).padStart(2,'0')}</span><span class="flag">${t.flag}</span></div>
 <div class="gp">${esc(t.gp)}</div><div class="circ">${esc(t.title)}</div>
 <div class="foot"><span class="date">${t.date} ${SEASON}</span>
 ${t.report?'<span class="badge b-report"><span class="d" style="background:var(--done)"></span>Breakdown</span>':'<span class="badge b-soon">Soon</span>'}</div>`;
 grid.appendChild(b);
 });
}