/* trajectory.js — season-card trajectory chart. Three toggleable metrics + teammate overlay.
   Loaded after matrix.js, before panel.js. Uses globals from data.js.
   Default metric = 'position' (set here + in panel.js seasonBrief). */
let trajState={id:null,metric:'position'};

const TRAJ_META={
  standings:{label:'Championship points',ref:true},
  gap:{label:'Points vs leader',ref:true},
  position:{label:'Championship position',ref:false}
};

/* returns {vals, minV, maxV, invert, yfmt, refVals} for a metric */
function trajSeries(id,metric){
  if(metric==='standings'){
    const vals=cumPoints(id),ref=leaderPace();
    return{vals,ref,minV:0,maxV:Math.max(...ref,1),invert:false,yfmt:v=>v};
  }
  if(metric==='gap'){
    const vals=gapVals(id);
    let lo=0;Object.keys(DRV).forEach(k=>{const g=gapVals(k);lo=Math.min(lo,...g);});
    return{vals,ref:vals.map(()=>0),minV:lo,maxV:0,invert:false,yfmt:v=>v===0?'Lead':v};
  }
  const vals=rankTrajectory(id);
  let hi=3;Object.keys(DRV).forEach(k=>{hi=Math.max(hi,...rankTrajectory(k));});
  return{vals,ref:null,minV:1,maxV:hi,invert:true,yfmt:v=>'P'+v};
}

function buildTrajectory(id,metric){
  const team=DRV[id].team, mate=teammate(id);
  const W=300,H=140,N=ROUNDS.length;
  const s=trajSeries(id,metric);
  const mateS=mate?trajSeries(mate,metric):null;
  // shared domain so both lines fit
  let minV=s.minV,maxV=s.maxV;
  if(mateS){minV=Math.min(minV,mateS.minV);maxV=Math.max(maxV,mateS.maxV);}
  const span=(maxV-minV)||1;
  const mapY=v=>s.invert?((v-minV)/span)*H:H-((v-minV)/span)*H;
  const xAt=i=>N>1?(i/(N-1))*W:0;
  const line=arr=>arr.map((v,i)=>`${xAt(i).toFixed(1)},${mapY(v).toFixed(1)}`).join(' ');
  // gridlines: three reference values
  const gv=[minV,minV+span/2,maxV];
  const gl=gv.map(v=>{const y=mapY(v);return `<line class="tg" x1="0" y1="${y.toFixed(1)}" x2="${W}" y2="${y.toFixed(1)}"/><text class="tax" x="-5" y="${(y+3).toFixed(1)}" text-anchor="end">${s.yfmt(Math.round(v))}</text>`;}).join('');
  const xlab=ROUNDS.map((rd,i)=>`<text class="tax" x="${xAt(i).toFixed(1)}" y="${H+14}" text-anchor="middle">${codeOf(rd)}</text>`).join('');
  // event dots on main line
  const dots=s.vals.map((v,i)=>{const rd=ROUNDS[i];const r=raceRow(rd,id);const win=r&&r.pos===1;const dnf=r&&r.status==='DNF';const cx=xAt(i).toFixed(1),cy=mapY(v).toFixed(1);if(win)return `<circle cx="${cx}" cy="${cy}" r="4" fill="var(--gold)"/>`;if(dnf)return `<circle cx="${cx}" cy="${cy}" r="4" fill="var(--red)"/>`;return `<circle cx="${cx}" cy="${cy}" r="2" fill="${teamColor(team)}"/>`;}).join('');
  const refLine=(TRAJ_META[metric].ref&&s.ref)?`<polyline class="tref" points="${line(s.ref)}"/>`:'';
  const mateLine=mateS?`<polyline class="tmate" points="${line(mateS.vals)}"/>`:'';
  const endV=s.vals[N-1];
  const endTxt=metric==='gap'?(endV===0?'Leader':endV+' pts'):metric==='position'?('P'+endV):(endV+' pts');
  // toggle
  const btns=Object.keys(TRAJ_META).map(k=>`<button data-traj="${k}" aria-selected="${k===metric}">${k==='standings'?'Standings':k==='gap'?'Vs Leader':'Position'}</button>`).join('');
  // legend
  let leg=`<span><i class="tk-main" style="background:${teamColor(team)}"></i> ${LAST(id)}</span>`;
  if(mate)leg+=`<span><i class="tk-mate"></i> ${LAST(mate)}</span>`;
  if(TRAJ_META[metric].ref&&metric==='standings')leg+=`<span><i class="tk-ref"></i> Leader pace</span>`;
  if(metric==='gap')leg+=`<span><i class="tk-ref"></i> Leader (0)</span>`;
  leg+=`<span><i class="tk-dot g"></i> Win</span><span><i class="tk-dot r"></i> DNF</span>`;
  return `<div class="traj-head"><span class="tt-lbl">${TRAJ_META[metric].label}</span><span class="tt-end num" style="color:${teamColor(team)}">${endTxt}</span></div>
    <div class="traj-seg">${btns}</div>
    <svg class="traj-svg" viewBox="-30 -8 ${W+42} ${H+28}" preserveAspectRatio="none" style="--team:${teamColor(team)}">${gl}${refLine}${mateLine}<polyline class="tmain" points="${line(s.vals)}"/>${dots}${xlab}</svg>
    <div class="traj-leg">${leg}</div>`;
}
