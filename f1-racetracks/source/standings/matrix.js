/* matrix.js — renders the leader strip, the drivers points matrix (sortable,
   rounds inverted recent-first), and the constructors table. Uses globals from data.js. */
function render(){
  const roundsDesc=[...ROUNDS].sort((a,b)=>b.round-a.round);
  const L=STANDINGS[0],s2=STANDINGS[1];
  document.getElementById('leaderStrip').innerHTML=`<div class="leader-cell"><span class="k">Leader</span><span class="v" style="color:${teamColor(L.team)}">${LAST(L.id)} <span class="pts num">${L.total}</span></span></div><div class="leader-cell"><span class="k">Margin</span><span class="v num">+${L.total-s2.total}</span></div><div class="leader-cell"><span class="k">Rounds</span><span class="v num">${ROUNDS.length} <span class="pts">/ 22</span></span></div>`;
  const stamp=document.getElementById('stamp');if(stamp)stamp.textContent=APP_VERSION;

  let head=`<tr><th class="col-pos"><div class="th-pad">#</div></th><th class="col-drv" data-active="${sortMode==='name'?1:0}"><div class="th-pad" data-sort="name">Driver<span class="sicon">\u21C5</span></div></th><th class="col-pts" data-active="${sortMode==='champ'?1:0}"><div class="th-pad" data-sort="champ">PTS<span class="sicon">\u21C5</span></div></th>`;
  roundsDesc.forEach(rd=>{head+=`<th class="rnd-h" data-sort="${rd.round}" data-active="${sortMode===rd.round?1:0}"><span class="rn num">R${rd.round}</span><span class="rc">${codeOf(rd)}</span>${rd.sprint?'<span class="spr">SPR</span>':''}<span class="sicon">\u21C5</span></th>`;});
  head+=`</tr>`;

  let body='';
  orderedRows().forEach(d=>{
    body+=`<tr><td class="col-pos"><div class="pos-rank">${d.champRank}</div></td><td class="col-drv"><button class="drv" data-driver="${d.id}"><span class="team-bar" style="--team:${teamColor(d.team)}"></span><span class="drv-id"><span class="drv-name"><span class="fn">${FIRST(d.id)} </span>${LAST(d.id)}</span><span class="drv-team">${d.team}</span></span></button></td><td class="col-pts"><div class="tot num">${d.total}</div></td>`;
    roundsDesc.forEach(rd=>{
      const m=cellMeta(rd,d.id);
      if(!m){body+=`<td><div class="cell empty"><span class="cp">\u2014</span></div></td>`;return;}
      let cls='cell';
      if(m.status==='DNF')cls+=' dnf';else if(m.pos===1)cls+=' win';else if(m.pos===2)cls+=' p2';else if(m.pos===3)cls+=' p3';else if(m.pts===0)cls+=' zero';
      if(m.hasStory&&m.status!=='DNF')cls+=' story';else if(m.dnfHot)cls+=' dnfhot';else if(m.bigMover)cls+=' mover';
      let inner=m.status==='DNF'?`<span class="cp">DNF</span>`:`<span class="cp">${m.pos}</span>`+(m.pts>0?`<span class="cpts">+${m.pts}</span>`:'');
      const sp=rd.sprint?rd.sprint.classification.find(x=>x.driverId===d.id):null;
      if(sp&&sp.points>0)inner+=`<span class="sprmark">S+${sp.points}</span>`;
      if(rd.fastestLap&&rd.fastestLap.driverId===d.id)inner+=`<span class="flmark"></span>`;
      if(m.hasDeep)inner+=`<span class="deep"></span>`;
      body+=`<td><button class="cell ${cls}" data-cell="${rd.round}:${d.id}">${inner}</button></td>`;
    });
    body+=`</tr>`;
  });

  const map={};STANDINGS.forEach(d=>{map[d.team]=map[d.team]||{team:d.team,total:0,wins:0};map[d.team].total+=d.total;});
  ROUNDS.forEach(rd=>{const w=(rd.classification||[]).find(x=>x.pos===1);if(w)map[DRV[w.driverId].team].wins++;});
  const wrows=Object.values(map).sort((a,b)=>b.total-a.total);const wmax=wrows[0].total;
  const wcc=wrows.map((t,i)=>`<div class="wcc-row" data-constructor="${t.team}" role="button" tabindex="0" aria-label="${t.team} season story"><div class="wcc-rank num">${i+1}</div><div class="wcc-bar" style="--team:${teamColor(t.team)}"></div><div class="wcc-name">${t.team}</div><div class="wcc-wins">${t.wins} ${t.wins===1?'win':'wins'}</div><div class="wcc-pts num">${t.total}</div><div class="wcc-cue" aria-hidden="true">\u203A</div><div class="wcc-track" style="--team:${teamColor(t.team)};width:${(t.total/wmax*100).toFixed(1)}%"></div></div>`).join('');

  document.getElementById('stage').innerHTML=`<div class="scroll-wrap" id="matrixWrap"><table class="matrix"><thead>${head}</thead><tbody>${body}</tbody></table></div><div class="wcc hidden" id="wccWrap">${wcc}</div>`;
}
