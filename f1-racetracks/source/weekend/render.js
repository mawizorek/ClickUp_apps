/* weekend/render.js — Race Weekend lens, render layer (v2.0).
   renderWeekend(rd, i) paints the whole page for one round from the store data.
   Reads bare globals from data.js (ROUNDS, helpers, swingFor, stintsFor). */
(function(){
  const FLAG_ILLUSTRATIVE='illustrative';

  function mast(rd){
    const m=document.getElementById('mast');
    const w=(rd.classification||[]).find(r=>r.pos===1);
    const pole=rd.pole, fl=rd.fastestLap;
    m.innerHTML=`
      <div class="eyebrow">FIA Formula 1 World Championship · Race Weekend</div>
      <h1 class="hgp">${esc(short(rd.name)).replace(/ GP$/,'')} <b>Grand Prix</b></h1>
      <div class="hsub">
        <span class="rnd">Round ${String(rd.round).padStart(2,'0')}</span>
        <span class="dot"></span><span class="mono">${esc(fmtDate(rd.date))}</span>
        ${rd.slug?`<a class="circuit-link" href="circuits.html#/${rd.slug}">Circuit guide \u2192</a>`:''}
      </div>
      ${rd.summary?`<p class="narr">${esc(rd.summary)}</p>`:''}
      <div class="strip">
        <div class="cell win"><div class="k">Winner</div><div class="v">${w?esc(last(w.driver)):'\u2014'}</div><div class="sub">${w?esc(w.team):''}</div></div>
        <div class="cell"><div class="k">Pole</div><div class="v">${pole?esc(last(pole.driver)):'\u2014'}</div><div class="sub mono">${pole&&pole.time?esc(pole.time):''}</div></div>
        <div class="cell"><div class="k">Fastest lap</div><div class="v">${fl?esc(last(fl.driver)):'\u2014'}</div><div class="sub mono">${fl&&fl.time?esc(fl.time)+(fl.lap?' \u00b7 L'+fl.lap:''):''}</div></div>
      </div>`;
  }

  let n=0;
  const sec=(idx,title,note)=>{const s=el('section','reveal');s.style.setProperty('--i',n++);s.appendChild(el('div','shead',`<span class="idx">${idx}</span><h2>${title}</h2>${note?`<span class="note">${note}</span>`:''}`));return s;};

  function swing(app,i){
    const sw=swingFor(i); if(!sw) return;
    const s=sec('01','Championship swing');
    const wrap=el('div','swing');
    let deltaLine='';
    if(sw.delta!=null && sw.delta!==0){
      const grew=sw.delta>0;
      deltaLine=`<div class="delta">This round <span class="ex ${grew?'grew':'cut'}">${grew?'+':''}${sw.delta}</span> to the lead margin</div>`;
    }
    const max=sw.top[0].pts||1;
    const bars=sw.top.map((d,k)=>`<div class="brow${k===0?' leader':''}"><span class="bn">${esc(last(d.name))}</span><span class="bt"><i style="--w:${(d.pts/max).toFixed(3)};--i:${k};--tm:${tc(d.team)}"></i></span><span class="bv">${d.pts}</span></div>`).join('');
    wrap.innerHTML=`<div class="k">World Drivers' Championship after this round</div>
      <div class="lead"><span class="nm">${esc(last(sw.leader.name))}</span><span class="verb">leads</span><span class="mg">${sw.marginAfter===0?'level':'+'+sw.marginAfter}</span></div>
      ${deltaLine}<div class="bar">${bars}</div>`;
    s.appendChild(wrap);app.appendChild(s);
  }

  function podium(app,rd){
    const s=sec('02','Podium');
    const wrap=el('div','podium');
    [2,1,3].forEach(p=>{
      const d=(rd.classification||[]).find(x=>x.pos===p); if(!d)return;
      const c=el('div',`pod p${p}`);c.style.setProperty('--tm',tc(d.team));
      c.innerHTML=`<div class="pl">P${p}</div><div class="nm">${esc(last(d.driver))}</div><div class="tm">${esc(d.team)}</div><div class="pts"><b>${d.points||0}</b> pts</div>`;
      wrap.appendChild(c);
    });
    s.appendChild(wrap);app.appendChild(s);
  }

  function movers(app,rd){
    const gained=(rd.classification||[]).filter(d=>d.status==='FIN'&&d.pos&&typeof d.grid==='number').map(d=>({...d,g:d.grid-d.pos})).filter(d=>d.g>0).sort((a,b)=>b.g-a.g).slice(0,3);
    if(!gained.length) return;
    const s=sec('03','Biggest movers','vs starting grid');
    const wrap=el('div','movers');
    gained.forEach(d=>{const c=el('div','mover');c.style.setProperty('--tm',tc(d.team));c.innerHTML=`<div class="delta">${d.g}</div><div class="mn">${esc(last(d.driver))}</div><div class="mp">P${d.grid} \u2192 P${d.pos}</div>`;wrap.appendChild(c);});
    s.appendChild(wrap);app.appendChild(s);
  }

  function grid(app,rd){
    const byGrid=(rd.classification||[]).filter(d=>typeof d.grid==='number').sort((a,b)=>a.grid-b.grid);
    if(!byGrid.length) return;
    const s=sec('04','Starting grid','tap a slot');
    const wrap=el('div','gridwrap');
    wrap.appendChild(el('div','polebadge','\u2191 Turn 1'));
    const g=el('div','grid');
    byGrid.forEach((d,i)=>{
      const side=i%2===0?'left':'right';
      const slot=el('div',`slot ${side}${d.grid===1?' pole':''}`);
      slot.style.setProperty('--tm',tc(d.team));slot.style.setProperty('--g',i);
      let fin,cls;
      if(d.status!=='FIN'){fin='DNF';cls='dnf';}
      else{const diff=d.grid-d.pos;fin='P'+d.pos;cls=diff>0?'up':diff<0?'down':'';}
      slot.dataset.did=d.driverId||'';
      slot.innerHTML=`<span class="gp">${d.grid}</span><span class="info"><span class="dn">${esc(last(d.driver))}</span><span class="dt">${esc(d.team)}</span></span><span class="fin ${cls}">${fin}</span>`;
      slot.addEventListener('click',()=>{
        const lit=slot.classList.toggle('lit');
        const row=document.querySelector(`.rrow[data-did="${d.driverId}"]`);
        if(row){row.classList.toggle('lit',lit);if(lit)row.scrollIntoView({behavior:'smooth',block:'center'});}
      });
      g.appendChild(slot);
    });
    wrap.appendChild(g);
    const pole=byGrid.find(d=>d.grid===1);
    wrap.appendChild(el('div','gridfoot',`Pole: <b>${pole?esc(last(pole.driver)):'\u2014'}</b>${rd.pole&&rd.pole.time?' \u00b7 '+esc(rd.pole.time):''} \u00b7 grid reflects any penalties applied`));
    wrap.appendChild(el('div','gridhint','tap any slot to reveal where they finished'));
    s.appendChild(wrap);app.appendChild(s);
  }

  function stints(app,rd){
    const data=stintsFor(rd.slug); if(!data) return;
    const s=sec('05','Tyre strategy',FLAG_ILLUSTRATIVE);
    s.appendChild(el('div','stintlegend',`<span><i style="background:var(--ty-soft)"></i>Soft</span><span><i style="background:var(--ty-med)"></i>Medium</span><span><i style="background:var(--ty-hard)"></i>Hard</span>`));
    data.rows.forEach((row,ri)=>{
      const r=el('div','stintrow');
      r.appendChild(el('div','stintname',last(row.driver)));
      const bar=el('div','stintbar');
      row.stints.forEach(([comp,laps],si)=>{const seg=el('div',`stint ${comp}`);seg.style.flex=laps;seg.style.setProperty('--r',ri);seg.style.setProperty('--s',si);seg.innerHTML=`<span>${laps}</span>`;bar.appendChild(seg);});
      r.appendChild(bar);s.appendChild(r);
    });
    s.appendChild(el('div','stintnote','Stint lengths are illustrative pending lap-time sourcing. In the live build these derive from the results store like every other panel.'));
    app.appendChild(s);
  }

  function qualifying(app,rd){
    const q=(rd.classification||[]).filter(d=>d.qualifying&&d.qualifying.pos).sort((a,b)=>a.qualifying.pos-b.qualifying.pos);
    if(!q.length) return;
    const s=sec('06','Qualifying','Q1 \u00b7 Q2 \u00b7 Q3');
    [{n:'Q3',d:'Top-10 shootout',f:d=>d.qualifying.pos<=10},{n:'Q2',d:'Eliminated 11\u201315',f:d=>d.qualifying.pos>=11&&d.qualifying.pos<=15},{n:'Q1',d:'Eliminated 16\u201322',f:d=>d.qualifying.pos>=16}].forEach(t=>{
      const rows=q.filter(t.f); if(!rows.length) return;
      const tw=el('div','qtier');
      tw.appendChild(el('div','qlabel',`<span class="qn">${t.n}</span><span class="qd">${t.d}</span><span class="qline"></span>`));
      rows.forEach(d=>{
        const qy=d.qualifying,times=[qy.q1,qy.q2,qy.q3],best=[2,1,0].find(k=>times[k]);
        const cell=(v,cls,k)=>`<span class="qt ${cls}${k===best?' best':''}">${v||'\u2014'}</span>`;
        const r=el('div',`qrow${qy.pos<=3?' top':''}`);
        r.innerHTML=`<span class="qp">${qy.pos}</span><span class="qnm">${esc(last(d.driver))}<span>${esc(d.team)}</span></span>${cell(qy.q1,'q1',0)}${cell(qy.q2,'q2',1)}${cell(qy.q3,'q3',2)}`;
        tw.appendChild(r);
      });
      s.appendChild(tw);
    });
    app.appendChild(s);
  }

  function sprint(app,rd){
    if(!rd.sprint||!rd.sprint.classification||!rd.sprint.classification.length) return;
    const s=sec('07','Sprint','Saturday');
    const w=rd.sprint.classification.find(x=>x.pos===1);
    s.appendChild(el('div','sprintband',`<span class="tag">SPR</span><span class="txt">${w?esc(last(w.driver))+' took the Saturday sprint.':'Sprint result'}</span>`));
    rd.sprint.classification.slice().sort((a,b)=>a.pos-b.pos).forEach(d=>{const r=el('div',`sprow p${d.pos}`);r.innerHTML=`<span class="sp">${d.pos}</span><span class="snm">${esc(last(d.driver))}<i>${esc(d.team)}</i></span><span class="spt">+${d.points}<em> pts</em></span>`;s.appendChild(r);});
    app.appendChild(s);
  }

  function classification(app,rd){
    const cls=rd.classification||[]; if(!cls.length) return;
    const flDriver=rd.fastestLap?rd.fastestLap.driver:null;
    const s=sec('08','Race classification',rd.slug?'':'');
    const t=el('div','rtable');
    t.appendChild(el('div','rhead','<span>#</span><span>Driver</span><span class="r">Grid</span><span class="r">Pts</span>'));
    cls.forEach(d=>{
      const dnf=d.status!=='FIN';
      const r=el('div',`rrow${d.pos&&d.pos<=3?` p${d.pos}`:''}${dnf?' dnf':''}`);
      r.style.setProperty('--tm',tc(d.team));r.dataset.did=d.driverId||'';
      const pole=d.grid===1?'<span class="plflag">POLE</span>':'';
      const fl=(flDriver&&d.driver===flDriver)?'<span class="fl">FL</span>':'';
      let gain;
      if(!dnf&&typeof d.grid==='number'){const g=d.grid-d.pos;gain=g>0?`<span class="up">\u25B2${g}</span>`:g<0?`<span class="down">\u25BC${-g}</span>`:`<span class="flat">\u2014</span>`;}
      else gain=`<span class="flat">${typeof d.grid==='number'?'P'+d.grid:'\u2014'}</span>`;
      const steward=d.stewardNote?`<div class="steward">${esc(d.stewardNote)}</div>`:'';
      r.innerHTML=`<div class="rp">${dnf?'DNF':d.pos}</div>
        <div class="rname"><div class="rn">${esc(last(d.driver))}${pole}${fl}</div><div class="rt">${esc(d.team)}</div>${steward}</div>
        <div class="rgain">${gain}<span class="glabel">${dnf?'started':'vs grid'}</span></div>
        <div class="rpts${d.points?'':' zero'}">${d.points||'0'}</div>`;
      t.appendChild(r);
    });
    s.appendChild(t);app.appendChild(s);
  }

  window.renderWeekend=function(rd,i){
    const app=document.getElementById('app'); app.innerHTML=''; n=0;
    mast(rd);
    swing(app,i);
    podium(app,rd);
    movers(app,rd);
    grid(app,rd);
    stints(app,rd);
    qualifying(app,rd);
    sprint(app,rd);
    classification(app,rd);
  };
})();
