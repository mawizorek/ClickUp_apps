/* weekend/story.js — Race Weekend lens, STORY MODE engine (v1).
   The motion layer of the race-detail page: same round, brought to life.
   Derives the position LADDER from the round's own classification (grid → finish),
   exactly like every other weekend panel derives from the store. Telemetry, tyre
   stint age, and team radio are the PROCEDURAL / FUTURE layer (flagged illustrative
   in-UI) until the per-second (R2) tier + archived radio land — the light lap layer
   is real store data today.

   Exposes: window.mountStory(rd, i) / window.teardownStory().
   Reads bare globals from data.js (tc, last, esc, el, stintsFor). Mounts into #wk-story. */
(function(){
  const T3=n=>{n=last(n);return (n==='Antonelli'?'ANT':n.slice(0,3).toUpperCase());};
  const isSC=(l,sc)=>sc&&l>=sc.from&&l<=sc.to;
  const seeded=str=>{let s=0;for(const c of String(str))s=(s*31+c.charCodeAt(0))>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};};

  let R=null;                 // active race model
  let T=1, sel=null, playing=false, raf=null, stepMs=1000, tab='pos', lod='sector', ghostOn=false, lastLap=0, lastPitSig='__i__', cardBuilt=false, cardRefs={};
  const LOD={lap:1,sector:1/3,sec:0.02};
  const $=s=>document.querySelector(s);
  const curLap=()=>Math.min(R.laps,Math.max(1,Math.round(T)));
  const frac=()=>T-Math.floor(T);
  const posOf=(c,l)=>R.DATA[l][c].pos;
  function contPos(c){const lo=Math.floor(T),hi=Math.min(R.laps,Math.ceil(T));if(lo===hi)return posOf(c,lo);const f=T-lo;return posOf(c,lo)*(1-f)+posOf(c,hi)*f;}

  /* ---- build the race model from a store round ---- */
  function build(rd){
    const cls=(rd.classification||[]).filter(d=>d.driver);
    const laps=rd.laps || (window.stintsFor&&stintsFor(rd.slug)&&stintsFor(rd.slug).laps) || 57;
    // codes + meta (dedupe collisions)
    const codes=[],meta={},used={};
    cls.forEach(d=>{let c=T3(d.driver);while(used[c])c=c.slice(0,2)+d.driver.replace(/\s/g,'').slice(-1).toUpperCase();used[c]=1;codes.push(c);meta[c]={name:last(d.driver),team:d.team,did:d.driverId,color:tc(d.team)};});
    // START = grid order; FINISH = final classification (DNF to the back, keep order)
    const byGrid=cls.slice().filter(d=>typeof d.grid==='number').sort((a,b)=>a.grid-b.grid);
    const codeOf=d=>codes[cls.indexOf(d)];
    const START=(byGrid.length?byGrid:cls).map(codeOf);
    const fin=cls.slice().sort((a,b)=>{const ap=a.pos==null?999:a.pos,bp=b.pos==null?999:b.pos;return ap-bp;});
    const FINISH={};fin.forEach((d,idx)=>FINISH[codeOf(d)]=idx+1);
    const startPos={};START.forEach((c,i)=>startPos[c]=i+1);
    const N=START.length;
    // pit + safety car: derive stops from stint boundaries if available (else none)
    const pit={};const st=window.stintsFor&&stintsFor(rd.slug);
    if(st){st.rows.forEach(row=>{const c=T3(row.driver);if(!codes.includes(c))return;let acc=0;row.stints.slice(0,-1).forEach(([,len])=>{acc+=len;pit[c]=Math.round(acc);});});}
    const sc=null; // safety-car window: not in store yet
    // per-lap order via smoothstep(start→finish)+noise, pit penalty bump
    const rank=(c,l)=>{const t=(l-1)/(laps-1||1),e=t*t*(3-2*t);let v=startPos[c]*(1-e)+FINISH[c]*e;v+=(seeded(c+'~'+l)()-0.5)*0.8;if(pit[c]){if(l===pit[c])v+=30;else if(l===pit[c]+1)v+=5;}return v;};
    const ORDER=[];for(let l=1;l<=laps;l++){ORDER.push(l===1?START.slice():START.slice().sort((a,b)=>rank(a,l)-rank(b,l)));}
    // light lap DATA: pos + gap + interval + illustrative lap time
    const DATA={};let best=Infinity,pb={};
    for(let l=1;l<=laps;l++){DATA[l]={};let cum=0;ORDER[l-1].forEach((c,i)=>{const rnd=seeded(c+'-'+l);const iv=i===0?0:0.6+i*0.08+rnd()*0.8;cum+=iv;const ms=Math.round(87500+i*90+rnd()*500);if(!pb[c]||ms<pb[c])pb[c]=ms;if(ms<best)best=ms;const drs=(i>0&&iv<1&&l>=3&&rnd()<0.7);DATA[l][c]={pos:i+1,gap:cum,iv,ms,drs};});}
    for(let l=1;l<=laps;l++)for(const c in DATA[l]){const d=DATA[l][c];d.best=d.ms===best;d.pb=d.ms===pb[c]&&!d.best;}
    // tyre stint per driver from stints (illustrative) else single medium stint
    const tyre={};codes.forEach(c=>tyre[c]={comp:'MED',pitLap:pit[c]||null,newComp:'HARD'});
    // wheel settings (illustrative)
    const setg={},ph={};codes.forEach(c=>{const r=seeded('set'+c);setg[c]={eng:1+Math.floor(r()*9),bb:52+Math.floor(r()*11),diff:['LOW','MID','HIGH'][Math.floor(r()*3)]};ph[c]=(([...c].reduce((a,x)=>a+x.charCodeAt(0),0))%100)/100;});
    return {codes,meta,START,FINISH,startPos,ORDER,DATA,pit,sc,laps,N,tyre,setg,ph,radio:rd.radio||null,slug:rd.slug};
  }

  /* ---- speed profile (illustrative telemetry) ---- */
  const SPEED=[];(function(){const cor=[[.06,.55],[.16,.42],[.27,.68],[.36,.3],[.46,.6],[.58,.38],[.7,.72],[.8,.34],[.9,.5]];for(let i=0;i<=120;i++){const t=i/120;let s=1;cor.forEach(([p,d])=>{const w=.035;s=Math.min(s,1-(1-d)*Math.exp(-((t-p)**2)/(2*w*w)));});SPEED.push(s);}})();
  const pace=c=>{const h=[...c].reduce((a,x)=>a+x.charCodeAt(0),0);return .93+(h%10)/100;};
  function telem(c,prog){const idx=Math.min(120,Math.floor(prog*120));const b=SPEED[idx];const kph=Math.round(b*340*pace(c));const nx=SPEED[Math.min(120,idx+1)];const sl=nx-b;const thr=sl>=0?Math.min(100,60+sl*900+b*30):Math.max(0,b*40);return {kph,gear:Math.max(1,Math.round(b*7)+1),rpm:8000+b*5000,thr};}
  const fmt=ms=>{const m=Math.floor(ms/60000),s=(ms%60000)/1000;return m+':'+s.toFixed(1).padStart(4,'0');};
  const cChar=c=>c[0];

  /* ---- markup ---- */
  function shell(){return `
   <div class="st-transport">
     <button class="st-play" id="stPlay"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>
     <div class="st-lapread"><div class="big mono">L<b id="stLap">1</b><span>/${R.laps}</span></div><div class="ph" id="stPhase">Lights out · <b id="stSec">S1</b></div></div>
     <div class="st-scrub"><div class="st-flags" id="stFlags"></div><input type="range" id="stScrub" min="1" max="${R.laps}" value="1" step="0.02"></div>
     <span class="st-seglbl">Scrub</span>
     <div class="st-seg" id="stLod"><button data-lod="lap">Lap</button><button data-lod="sector" aria-selected="true">Sector</button><button data-lod="sec">Sec</button></div>
     <div class="st-seg" id="stSpeed"><button data-s="2000">1×</button><button data-s="1000" aria-selected="true">2×</button><button data-s="480">4×</button></div>
   </div>
   <div class="st-main">
     <section class="st-tower"><div class="st-th"><span>P</span><span>Driver</span><span>DRS</span><span>Tyre</span><span>Gap</span><span>Last</span></div><div class="st-tb" id="stTower"></div></section>
     <section class="st-card">
       <div class="st-cardh">
         <div class="st-seg" id="stTabs"><button data-tab="pos" aria-selected="true">Positions</button><button data-tab="grid">Grid</button><button data-tab="radio">Radio <span class="mono" id="stRcnt" style="opacity:.6"></span></button></div>
         <div class="st-ctx"><span class="cbar" id="stCbar"></span><div class="cinfo"><div class="ccode" id="stCcode"></div><div class="cteam" id="stCteam"></div></div><span class="cpos mono" id="stCpos"></span></div>
       </div>
       <div class="st-panel on" id="stPos"><label class="st-ghost" id="stGhost"><span class="sw"></span> illustrative</label><svg class="st-ladder" id="stLadder" preserveAspectRatio="none"></svg></div>
       <div class="st-panel" id="stGrid">
         <div class="st-focus"><div class="gf-id"><span class="bar" id="stFbar"></span><div><div class="code" id="stFcode"></div><div class="team" id="stFteam"></div></div><span class="pos mono" id="stFpos"></span></div>
           <div class="gf-wheel"><div class="st-shift" id="stShift"></div><div class="gf-core"><span class="gear mono" id="stFgear">1</span><div class="sp"><span class="kph mono" id="stFkph">0</span><i>KM/H</i></div><div class="gf-set"><span>ENG <b id="stFeng"></b></span><span>BBAL <b id="stFbb"></b></span><span>DIFF <b id="stFdiff"></b></span><span>DRS <b class="drs" id="stFdrs">OFF</b></span></div></div></div>
         </div>
         <div class="st-gstage"><div class="st-formation"><div class="st-strip"></div><div class="st-track" id="stTrack"></div></div><aside class="st-pit"><div class="st-pittitle">Pit Lane</div><div id="stPitBody"></div></aside></div>
       </div>
       <div class="st-panel" id="stRadio"><div class="st-feed" id="stFeed"></div></div>
     </section>
   </div>`;}

  /* ---- renders ---- */
  function tower(){const l=curLap();$('#stTower').innerHTML=R.ORDER[l-1].map(c=>{const d=R.DATA[l][c],m=R.meta[c];const gap=d.pos===1?'<span class="gap leader">LEADER</span>':'<span class="gap mono">+'+d.gap.toFixed(1)+'</span>';const iv=d.pos===1?'':'<span class="int mono">+'+d.iv.toFixed(1)+'</span>';const lc=d.best?'best':(d.pb?'pb':'');const pit=R.pit[c]===l;const pc=d.pos<=3?' p'+d.pos:'';const comp=cChar(R.tyre[c].comp);const age=R.tyre[c].pitLap&&l>=R.tyre[c].pitLap?l-R.tyre[c].pitLap+1:l;return `<div class="st-row${pc} ${sel===c?'sel':''} ${pit?'pit':''}" data-c="${c}" style="--tm:${m.color}"><span class="pos mono">${d.pos}</span><span class="drv"><span class="bar"></span><span class="code">${c}</span></span><span class="drs ${d.drs?'on':''}">DRS</span><span class="tyre"><span class="circ ${comp}">${comp}</span><span class="age">${age}</span></span><span class="gapint">${gap}${iv}</span><span class="last ${lc}">${fmt(d.ms)}</span></div>`;}).join('');$('#stTower').querySelectorAll('.st-row').forEach(r=>r.addEventListener('click',()=>pick(r.dataset.c)));}
  // ladder geometry
  let LB={pl:28,pr:42,pt:12,pb:18,w:0,h:0};
  const svg=()=>$('#stLadder');
  function lay(){const r=svg().getBoundingClientRect();LB.w=r.width;LB.h=r.height;}
  const xAt=l=>LB.pl+(l-1)/(R.laps-1||1)*(LB.w-LB.pl-LB.pr);
  const yAt=p=>LB.pt+(p-1)/(R.N-1||1)*(LB.h-LB.pt-LB.pb);
  function step(fn){let d='';for(let l=1;l<=R.laps;l++){const x=xAt(l),y=yAt(fn(l));if(l===1)d=`M ${x.toFixed(1)} ${y.toFixed(1)}`;else{const mx=(xAt(l-1)+x)/2;d+=` L ${mx.toFixed(1)} ${yAt(fn(l-1)).toFixed(1)} L ${mx.toFixed(1)} ${y.toFixed(1)} L ${x.toFixed(1)} ${y.toFixed(1)}`;}}return d;}
  function ladBase(){if(tab!=='pos')return;lay();if(LB.w<20){requestAnimationFrame(ladBase);return;}let s='';for(let p=1;p<=R.N;p++){const y=yAt(p);s+=`<line class="gl" x1="${LB.pl}" y1="${y}" x2="${LB.w-LB.pr}" y2="${y}"/><text class="ll" x="${LB.pl-6}" y="${y+3}" text-anchor="end">${p}</text>`;}const stepv=R.laps>16?3:2;for(let l=1;l<=R.laps;l+=stepv){const x=xAt(l);s+=`<text class="lp" x="${x}" y="${LB.h-4}" text-anchor="middle">L${l}</text>`;}R.codes.forEach(c=>{const dim=sel&&sel!==c?' dim':'';const sw=sel===c?3:1.7;s+=`<path class="dl${dim}" style="stroke:${R.meta[c].color};stroke-width:${sw}" d="${step(l=>posOf(c,l))}"/>`;});s+=`<g id="stDyn"></g>`;svg().innerHTML=s;}
  function ladDyn(){const g=$('#stDyn');if(!g)return;let s=`<line class="sl" x1="${xAt(T)}" y1="${LB.pt-4}" x2="${xAt(T)}" y2="${LB.h-LB.pb+3}"/>`;R.codes.forEach(c=>{const se=sel===c,dim=sel&&!se?' dim':'';const x=xAt(T),y=yAt(contPos(c));s+=`<g class="${dim}"><circle cx="${x}" cy="${y}" r="${se?4.5:2.8}" fill="${R.meta[c].color}" stroke="var(--bg)" stroke-width="1.3"/>${se?`<text class="nc" x="${x+7}" y="${y+3.2}" fill="${R.meta[c].color}">${c}</text>`:''}</g>`;});g.innerHTML=s;}
  // grid cards
  const ROW=33;
  function buildCards(){const t=$('#stTrack');t.innerHTML='';cardRefs={};R.codes.forEach(c=>{const e=el('div','st-gcar');e.style.setProperty('--tm',R.meta[c].color);e.dataset.c=c;e.innerHTML=`<span class="gc-pos mono"></span><span class="gc-code">${c}</span><div class="gc-mid"><span class="gc-kph mono">0<i>KM/H</i></span><span class="gc-gear mono">1</span><span class="gc-rpm"><i></i></span></div><div class="gc-right"><span class="gc-drs"></span><span class="gc-delta mono"></span></div>`;e.addEventListener('click',()=>pick(c));t.appendChild(e);cardRefs[c]={e,pos:e.querySelector('.gc-pos'),kph:e.querySelector('.gc-kph'),gear:e.querySelector('.gc-gear'),rpm:e.querySelector('.gc-rpm i'),drs:e.querySelector('.gc-drs'),delta:e.querySelector('.gc-delta')};});cardBuilt=true;t.style.height=(R.N*ROW)+'px';}
  function grid(){if(tab!=='grid')return;if(!cardBuilt)buildCards();const l=curLap();R.codes.forEach(c=>{const r=cardRefs[c],cp=contPos(c),y=(cp-1)*ROW,x=(Math.round(cp)%2===0)?20:0;r.e.style.transform=`translate(${x}px,${y}px)`;const t=telem(c,(frac()+R.ph[c])%1),d=R.DATA[l][c];r.pos.textContent=Math.round(cp);r.kph.innerHTML=t.kph+'<i>KM/H</i>';r.gear.textContent=t.gear;r.rpm.style.width=Math.min(100,(t.rpm-8000)/5000*100).toFixed(0)+'%';r.drs.classList.toggle('on',d.drs&&t.thr>70);r.delta.textContent=d.pos===1?'LEAD':'+'+d.iv.toFixed(1);r.e.classList.toggle('sel',sel===c);r.e.classList.toggle('pitting',R.pit[c]===l);});pit(l);focus();}
  function pit(l){const inp=R.ORDER[l-1].filter(c=>R.pit[c]===l);const sig=l+':'+inp.join(',');if(sig===lastPitSig)return;lastPitSig=sig;$('#stPitBody').innerHTML=inp.length?inp.map(c=>{const d=R.DATA[l][c];return `<div class="st-pitcar" style="--tm:${R.meta[c].color}"><div class="pc-top"><span class="pc-code">${c}</span><span class="pc-pos">P${d.pos}</span></div><div class="pc-tyre">fresh set · stop</div><div class="pc-timer">STATIONARY · 2.${3+(c.charCodeAt(0)%6)}s</div></div>`;}).join(''):'<div class="st-pitempty">Pit lane clear. Stops shown are illustrative (stint boundaries) until pit data is in the store.</div>';}
  const shiftSp=[];
  function focus(){const c=sel,t=telem(c,(frac()+R.ph[c])%1);$('#stFkph').textContent=t.kph;$('#stFgear').textContent=t.gear;const n=Math.round(Math.min(1,(t.rpm-8000)/5000)*15);shiftSp.forEach((sp,i)=>sp.className='sl '+(i<n?(i<9?'g':i<13?'y':'r'):''));const on=R.DATA[curLap()][c].drs&&t.thr>70;$('#stFdrs').textContent=on?'OPEN':'OFF';$('#stFdrs').classList.toggle('on',on);}
  function focusId(){const c=sel,m=R.meta[c];$('#stFbar').style.background=m.color;$('#stFcode').textContent=c;$('#stFteam').textContent=m.team;$('#stFpos').textContent='P'+posOf(c,curLap());const s=R.setg[c];$('#stFeng').textContent=s.eng;$('#stFbb').textContent=s.bb+'%';$('#stFdiff').textContent=s.diff;}
  function radio(){const l=curLap();const feed=$('#stFeed');if(!R.radio){$('#stRcnt').textContent='';feed.innerHTML='<div class="st-empty">Team radio isn\u2019t archived for this round yet. When the radio feed lands in the store, messages drop in here timestamped to the lap.</div>';return;}const msgs=R.radio.filter(m=>m.lap<=l);$('#stRcnt').textContent=msgs.length||'';feed.innerHTML=msgs.length?msgs.map(m=>{if(m.sys)return `<div class="st-sys ${m.kind||''}">${esc(m.text)}</div>`;const c=m.code,col=R.meta[c]?R.meta[c].color:'var(--txt-dim)',who=R.meta[c]?R.meta[c].name:(m.who||c);return `<div class="st-msg" style="--tm:${col}"><div class="av">${c||''}</div><div class="body"><div class="meta"><span class="who" style="color:${col}">${esc(who)}</span><span class="lap">Lap ${m.lap}</span></div><div class="bubble">${esc(m.text)}</div></div></div>`;}).join(''):'<div class="st-empty">Nothing on the radio yet at this point in the race.</div>';feed.scrollTop=feed.scrollHeight;}
  function ctx(){const c=sel,m=R.meta[c];$('#stCbar').style.background=m.color;$('#stCcode').textContent=c;$('#stCteam').textContent=m.team;$('#stCpos').textContent='P'+posOf(c,curLap());$('.st-ctx').style.setProperty('--tm',m.color);}
  function phaseTxt(){const l=curLap();if(l===1&&frac()<.15)return'Lights out';if(l>=R.laps)return'Finish';if(l>R.laps-3)return'Closing laps';return'Racing';}

  function syncLap(){tower();radio();focusId();ctx();}
  function syncFrame(){$('#stLap').textContent=curLap();$('#stSec').textContent='S'+Math.min(3,Math.floor(frac()*3)+1);$('#stPhase').firstChild.textContent=phaseTxt()+' · ';$('#stScrub').value=T;if(tab==='pos')ladDyn();if(tab==='grid')grid();}
  function full(){const l=curLap();if(l!==lastLap){lastLap=l;syncLap();}syncFrame();}
  function pick(c){sel=c;tower();if(tab==='pos'){ladBase();ladDyn();}focusId();ctx();if(tab==='grid')grid();}
  function loop(){if(!playing)return;T+=(1/60)*(1000/stepMs);if(T>=R.laps){T=R.laps;full();stop();return;}full();raf=requestAnimationFrame(loop);}
  function play(){if(T>=R.laps){T=1;lastLap=0;full();}playing=true;$('#stPlay').querySelector('path').setAttribute('d','M6 5h4v14H6zM14 5h4v14h-4z');raf=requestAnimationFrame(loop);}
  function stop(){playing=false;$('#stPlay').querySelector('path').setAttribute('d','M8 5v14l11-7z');cancelAnimationFrame(raf);}
  const segPick=(box,fn)=>box.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;box.querySelectorAll('button').forEach(x=>x.setAttribute('aria-selected','false'));b.setAttribute('aria-selected','true');fn(b);});

  function wire(){
    shiftSp.length=0;const sh=$('#stShift');for(let i=0;i<15;i++){const s=el('span','sl');sh.appendChild(s);shiftSp.push(s);}
    $('#stPlay').addEventListener('click',()=>playing?stop():play());
    $('#stScrub').addEventListener('input',e=>{stop();let v=+e.target.value;const st=LOD[lod];if(lod!=='sec')v=Math.round((v-1)/st)*st+1;T=Math.min(R.laps,Math.max(1,v));full();});
    segPick($('#stSpeed'),b=>{stepMs=+b.dataset.s;});
    segPick($('#stLod'),b=>{lod=b.dataset.lod;$('#stScrub').step=lod==='sec'?0.02:LOD[lod];});
    segPick($('#stTabs'),b=>{tab=b.dataset.tab;document.querySelectorAll('.st-panel').forEach(p=>p.classList.remove('on'));({pos:'#stPos',grid:'#stGrid',radio:'#stRadio'})[tab]&&$(({pos:'#stPos',grid:'#stGrid',radio:'#stRadio'})[tab]).classList.add('on');if(tab==='pos'){ladBase();ladDyn();}if(tab==='grid'){lastPitSig='__i__';grid();}if(tab==='radio')radio();});
    $('#stGhost').addEventListener('click',()=>{ghostOn=!ghostOn;$('#stGhost').classList.toggle('on',ghostOn);});
    let h='';for(let l=1;l<=R.laps;l+=(R.laps>16?3:2)){h+=`<span class="tk" style="left:${(l-1)/(R.laps-1)*100}%"></span>`;}$('#stFlags').innerHTML=h;
    window.addEventListener('resize',onResize);
  }
  function onResize(){if(tab==='pos'){ladBase();ladDyn();}}

  window.mountStory=function(rd,i){
    R=build(rd);T=1;lastLap=0;tab='pos';lod='sector';playing=false;cardBuilt=false;lastPitSig='__i__';
    sel=R.codes[0]||null;
    const host=document.getElementById('wk-story');if(!host)return;host.innerHTML=shell();
    wire();ladBase();full();
  };
  window.teardownStory=function(){stop();window.removeEventListener('resize',onResize);const host=document.getElementById('wk-story');if(host)host.innerHTML='';};
})();
