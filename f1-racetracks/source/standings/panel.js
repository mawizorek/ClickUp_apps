/* panel.js — race brief + season brief side panels, event wiring, boot.
   Loaded last; calls load() from data.js. Uses render() (matrix.js) + buildTrajectory() (trajectory.js). */
function teamChip(t){return `<span class="panel-team"><span class="team-bar" style="--team:${teamColor(t)}"></span>${t}</span>`;}
function tyreChips(arr){return arr?`<div class="tyres">`+arr.map((c,i)=>`${i>0?'<span class="tyre-arrow">\u203A</span>':''}<span class="tyre ${c}">${c}</span>`).join('')+`</div>`:'';}

function raceBrief(roundNo,id){
  const rd=ROUNDS.find(x=>x.round==roundNo);const m=cellMeta(rd,id);const det=m.det||{};const finish=m.status==='DNF'?'DNF':m.pos;det.finish=finish;
  const name=DRV[id].name,team=DRV[id].team;const isFL=rd.fastestLap&&rd.fastestLap.driverId===id,isPole=rd.pole&&rd.pole.driverId===id;
  const sp=rd.sprint?rd.sprint.classification.find(x=>x.driverId===id):null;const total=(sp?sp.points:0)+m.pts;
  let badges='';if(isPole)badges+=`<span class="badge">Pole</span>`;if(isFL)badges+=`<span class="badge fl">Fastest Lap</span>`;if(sp)badges+=`<span class="badge spr">Sprint P${sp.pos} \u00B7 +${sp.points}</span>`;
  let flow;if(det.grid){const gd=m.gridDelta,dcls=gd>0?'up':(gd<0?'down':''),dtxt=gd>0?`\u25B2 +${gd}`:(gd<0?`\u25BC ${gd}`:'\u2013 held');flow=`<div class="flow"><div class="node"><span class="nl">Grid</span><span class="nv num">${det.grid}</span></div><div class="arrow"><span class="delta ${dcls} num">${m.status==='DNF'?'':dtxt}</span><span class="track"></span></div><div class="node"><span class="nl">Finish</span><span class="nv ${finish===1?'win':''} ${m.status==='DNF'?'dnf':''} num">${m.status==='DNF'?'DNF':'P'+finish}</span></div></div>`;}else{flow=`<div class="flow"><div class="node"><span class="nl">Finish</span><span class="nv ${finish===1?'win':''} ${m.status==='DNF'?'dnf':''} num">${m.status==='DNF'?'DNF':'P'+finish}</span></div></div>`;}
  const noteText=m.note?m.note.text:null;const tagText=(det.story&&det.story.length)?renderStory(det.story,det):[];let storyHtml='';if(noteText||tagText.length){const isMv=!m.note&&m.bigMover;storyHtml=`<div class="story-box ${isMv?'mv':''}"><span class="sdot"></span><div class="stext">${noteText?`<p>${noteText}${m.note.onRoad?` <b>(on road: P${m.note.onRoad})</b>`:''}</p>`:''}${tagText.map(t=>`<p>${t}</p>`).join('')}</div></div>`;}
  const hasIllus=!!det.grid;const il=hasIllus?'illus':'';let stats=`<div class="stat-grid"><div class="stat"><span class="sl">Race Pts</span><span class="sv num">${m.pts}</span></div><div class="stat"><span class="sl">Sprint</span><span class="sv num">${sp?sp.points:'\u2014'}</span></div><div class="stat"><span class="sl">Total</span><span class="sv num">${total}</span></div>`;if(det.best)stats+=`<div class="stat ${il}"><span class="sl">Best Lap</span><span class="sv num">${det.best}</span></div>`;if(det.pits!=null)stats+=`<div class="stat ${il}"><span class="sl">Pits</span><span class="sv num">${det.pits}</span></div>`;if(det.tyres)stats+=`<div class="stat ${il}"><span class="sl">Tyres</span>${tyreChips(det.tyres)}</div>`;stats+=`</div>`;
  const illusNote=hasIllus?`<div class="illus-note"><b>Preview:</b> grid, lap, pits and tyres are illustrative; verified values (OpenF1) fill these once sourced.</div>`:'';
  return `<div class="panel-head" style="--team:${teamColor(team)}"><div><div class="panel-ey">R${rd.round} \u00B7 ${rd.name}${rd.sprint?' \u00B7 Sprint':''}</div><div class="panel-drv">${name}</div>${teamChip(team)}</div><button class="x" aria-label="Close">\u00D7</button></div><div class="panel-body">${flow}${badges?`<div class="badges">${badges}</div>`:''}${storyHtml}${stats}<div class="report">${rd.summary?`<p>${rd.summary}</p>`:''}</div>${illusNote}</div>`;
}

function seasonBrief(id){
  const d=STANDINGS.find(x=>x.id===id),w=wins(id),best=bestFin(id);
  trajState={id,metric:'position'};
  // round-by-round aggregates (race classification)
  const finRows=ROUNDS.map(rd=>raceRow(rd,id)).filter(r=>r&&r.status==='FIN'&&r.pos);
  const avgFin=finRows.length?(finRows.reduce((t,r)=>t+r.pos,0)/finRows.length):null;
  const podiums=ROUNDS.filter(rd=>{const r=raceRow(rd,id);return r&&r.status==='FIN'&&r.pos<=3;}).length;
  const dnfs=ROUNDS.filter(rd=>{const r=raceRow(rd,id);return r&&r.status==='DNF';}).length;
  const summary=`<div class="rbr-summary">`+
    `<div class="rs"><span class="rs-l">Avg Finish</span><span class="rs-v num">${avgFin?'P'+avgFin.toFixed(1):'\u2014'}</span></div>`+
    `<div class="rs"><span class="rs-l">Points</span><span class="rs-v num">${d.total}</span></div>`+
    `<div class="rs"><span class="rs-l">Podiums</span><span class="rs-v num" style="color:${podiums?'var(--gold)':'var(--txt)'}">${podiums}</span></div>`+
    `<div class="rs"><span class="rs-l">DNFs</span><span class="rs-v num" style="color:${dnfs?'var(--red)':'var(--txt)'}">${dnfs}</span></div>`+
    `</div>`;
  const colhead=`<div class="season-row shead"><span class="sr-rn">Rnd</span><span class="sr-ev">Event</span><span class="sr-fin">Fin</span><span class="sr-pts">Pts</span></div>`;
  // recent-first
  const rows=[...ROUNDS].sort((a,b)=>b.round-a.round).map(rd=>{const r=raceRow(rd,id);const sp=rd.sprint?rd.sprint.classification.find(x=>x.driverId===id):null;let fin='\u2014',pts=0;if(r){fin=r.status==='DNF'?'DNF':'P'+r.pos;pts=r.points+(sp?sp.points:0);}return `<div class="season-row"><span class="sr-rn num">R${rd.round}</span><span class="sr-ev">${codeOf(rd)} \u00B7 ${rd.name.replace(' Grand Prix','')}</span><span class="sr-fin num" style="color:${r&&r.pos===1?'var(--gold)':r&&r.status==='DNF'?'var(--red)':'var(--txt)'}">${fin}</span><span class="sr-pts num">${pts||''}</span></div>`;}).join('');
  const mate=teammate(id);let h2hHtml='';if(mate){const[me,them]=h2h(id,mate);h2hHtml=`<div class="h2h"><div><div class="h2h-l">Teammate H2H</div><div class="h2h-score"><span class="${me>=them?'win-n':'lose-n'}">${me}</span><span style="color:var(--txt-dim);font-size:0.9rem">\u2013</span><span class="${them>me?'win-n':'lose-n'}">${them}</span></div></div><div class="h2h-vs">race finishes<br>vs <b>${LAST(mate)}</b></div></div>`;}
  return `<div class="panel-head" style="--team:${teamColor(d.team)}"><div><div class="panel-ey">Season \u00B7 Championship P${d.champRank}</div><div class="panel-drv">${d.name}</div>${teamChip(d.team)}</div><button class="x" aria-label="Close">\u00D7</button></div><div class="panel-body"><div class="stat-grid"><div class="stat"><span class="sl">Total</span><span class="sv num" style="color:${d.champRank===1?'var(--gold)':'var(--txt)'}">${d.total}</span></div><div class="stat"><span class="sl">Pos</span><span class="sv num">P${d.champRank}</span></div><div class="stat"><span class="sl">Race / Spr</span><span class="sv num">${d.race}<small> / ${d.sprint}</small></span></div><div class="stat"><span class="sl">Wins</span><span class="sv num">${w}</span></div><div class="stat"><span class="sl">Best</span><span class="sv num">${best===99?'\u2014':'P'+best}</span></div><div class="stat"><span class="sl">Rounds</span><span class="sv num">${ROUNDS.length}</span></div></div>${h2hHtml}<div class="traj" id="trajBox">${buildTrajectory(id,'position')}</div><div><span class="section-h">Round by round</span>${summary}<div class="season-list">${colhead}${rows}</div></div></div>`;
}

/* constructorTable — WCC standings, mirrors matrix.js (sum of both drivers' race+sprint;
   wins = race wins). Kept here so the story panel and the table never disagree. */
function constructorTable(){
  const map={};
  STANDINGS.forEach(d=>{const m=map[d.team]||(map[d.team]={team:d.team,total:0,race:0,sprint:0,wins:0});m.total+=d.total;m.race+=d.race;m.sprint+=d.sprint;});
  ROUNDS.forEach(rd=>{const w=(rd.classification||[]).find(x=>x.pos===1);if(w&&map[DRV[w.driverId].team])map[DRV[w.driverId].team].wins++;});
  return Object.values(map).sort((a,b)=>b.total-a.total);
}

/* constructorSeason — the drivers rolled up: how the team's points came to be.
   Contribution split (who scored what) + real per-round team haul. All verified data. */
function constructorSeason(team){
  const table=constructorTable();
  const rank=table.findIndex(t=>t.team===team)+1;
  const T=table[rank-1];
  const drivers=STANDINGS.filter(d=>d.team===team).sort((a,b)=>b.total-a.total);
  let podiums=0,poles=0,fls=0;
  ROUNDS.forEach(rd=>{
    drivers.forEach(d=>{const r=raceRow(rd,d.id);if(r&&r.status==='FIN'&&r.pos&&r.pos<=3)podiums++;});
    if(rd.pole&&DRV[rd.pole.driverId]&&DRV[rd.pole.driverId].team===team)poles++;
    if(rd.fastestLap&&DRV[rd.fastestLap.driverId]&&DRV[rd.fastestLap.driverId].team===team)fls++;
  });
  const lead=teamColor(team);
  const tone=i=>i===0?lead:`color-mix(in oklch,${lead} 42%,var(--s3))`;
  const bar=drivers.map((d,i)=>`<span style="width:${T.total?(d.total/T.total*100).toFixed(1):(100/drivers.length).toFixed(1)}%;background:${tone(i)}"></span>`).join('');
  const crows=drivers.map((d,i)=>`<div class="csplit-row"><div class="csplit-nm"><span class="cdot" style="background:${tone(i)}"></span><span class="cn">${d.name}</span></div><span class="csplit-pts num">${d.total}</span><span class="csplit-pct">${T.total?Math.round(d.total/T.total*100)+'%':'\u2014'}</span></div>`).join('');
  const split=`<div class="csplit"><div class="csplit-bar">${bar}</div><div class="csplit-rows">${crows}</div></div>`;
  const colhead=`<div class="season-row shead"><span class="sr-rn">Rnd</span><span class="sr-ev">Event \u00B7 drivers</span><span class="sr-pts">Pts</span></div>`;
  const rbr=[...ROUNDS].sort((a,b)=>b.round-a.round).map(rd=>{
    let rpts=0;
    const chips=drivers.map(d=>{
      const r=raceRow(rd,d.id);const sp=rd.sprint?rd.sprint.classification.find(x=>x.driverId===d.id):null;
      rpts+=(r?r.points:0)+(sp?sp.points:0);
      let fin='\u2014',col='var(--txt-dim)';
      if(r){if(r.status==='DNF'){fin='DNF';col='var(--red)';}else{fin='P'+r.pos;col=r.pos===1?'var(--gold)':r.pos<=3?'var(--txt)':'var(--txt-mid)';}}
      return `<span class="cr-chip"><b>${LAST(d.id).slice(0,3).toUpperCase()}</b><span style="color:${col}">${fin}</span></span>`;
    }).join('');
    return `<div class="season-row crow"><span class="sr-rn num">R${rd.round}</span><div class="cr-ev"><span class="cr-nm">${codeOf(rd)} \u00B7 ${rd.name.replace(' Grand Prix','')}</span><div class="cr-chips">${chips}</div></div><span class="cr-pts num">${rpts||''}</span></div>`;
  }).join('');
  const lineup=drivers.map(d=>LAST(d.id)).join(' \u00B7 ');
  return `<div class="panel-head" style="--team:${lead}"><div><div class="panel-ey">Constructors \u00B7 Championship P${rank}</div><div class="panel-drv">${team}</div><span class="panel-team"><span class="team-bar" style="--team:${lead}"></span>${lineup}</span></div><button class="x" aria-label="Close">\u00D7</button></div><div class="panel-body"><div class="stat-grid"><div class="stat"><span class="sl">Total</span><span class="sv num" style="color:${rank===1?'var(--gold)':'var(--txt)'}">${T.total}</span></div><div class="stat"><span class="sl">Pos</span><span class="sv num">P${rank}</span></div><div class="stat"><span class="sl">Wins</span><span class="sv num">${T.wins}</span></div><div class="stat"><span class="sl">Podiums</span><span class="sv num" style="color:${podiums?'var(--gold)':'var(--txt)'}">${podiums}</span></div><div class="stat"><span class="sl">Poles</span><span class="sv num">${poles}</span></div><div class="stat"><span class="sl">Fastest Laps</span><span class="sv num">${fls}</span></div></div><div><span class="section-h">Points contribution</span>${split}</div><div><span class="section-h">Round by round</span><div class="season-list">${colhead}${rbr}</div></div></div>`;
}

const scrim=document.getElementById('scrim'),panel=document.getElementById('panel');
function openPanel(html,team){panel.style.setProperty('--team',teamColor(team));panel.innerHTML=html;panel.classList.add('open');scrim.classList.add('open');const x=panel.querySelector('.x');if(x)x.focus();}
function closePanel(){panel.classList.remove('open');scrim.classList.remove('open');}

document.addEventListener('click',e=>{
  const tj=e.target.closest('[data-traj]');if(tj){trajState.metric=tj.dataset.traj;const box=document.getElementById('trajBox');if(box)box.innerHTML=buildTrajectory(trajState.id,trajState.metric);return;}
  const sortEl=e.target.closest('[data-sort]');if(sortEl){const v=sortEl.dataset.sort;sortMode=(v==='champ'||v==='name')?v:parseInt(v,10);render();return;}
  const cell=e.target.closest('[data-cell]');if(cell){const parts=cell.dataset.cell.split(':');openPanel(raceBrief(parts[0],parts[1]),DRV[parts[1]].team);return;}
  const drv=e.target.closest('[data-driver]');if(drv){openPanel(seasonBrief(drv.dataset.driver),DRV[drv.dataset.driver].team);return;}
  const con=e.target.closest('[data-constructor]');if(con){openPanel(constructorSeason(con.dataset.constructor),con.dataset.constructor);return;}
  if(e.target.closest('.x')){closePanel();return;}
  const seg=e.target.closest('.seg button');if(seg){document.querySelectorAll('.seg button').forEach(b=>b.setAttribute('aria-selected','false'));seg.setAttribute('aria-selected','true');const drivers=seg.dataset.view==='drivers';const mw=document.getElementById('matrixWrap'),ww=document.getElementById('wccWrap');if(mw)mw.classList.toggle('hidden',!drivers);if(ww)ww.classList.toggle('hidden',drivers);document.getElementById('legend').classList.toggle('off',!drivers);}
});
scrim.addEventListener('click',closePanel);
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closePanel();return;}
  if(e.key==='Enter'||e.key===' '){const con=e.target.closest&&e.target.closest('[data-constructor]');if(con){e.preventDefault();openPanel(constructorSeason(con.dataset.constructor),con.dataset.constructor);}}
});

load();
