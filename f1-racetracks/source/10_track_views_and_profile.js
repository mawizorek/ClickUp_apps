function renderTrack(t){
 if(!t.report){ renderSoon(t); return; }
 const idx=reportTracks.findIndex(x=>x.slug===t.slug);
 const prev=reportTracks[idx-1], next=reportTracks[idx+1];
 const vals=t.profile.map(p=>p[1]); const aslLow=Math.round(t.asl0+Math.min(...vals)), aslHigh=Math.round(t.asl0+Math.max(...vals)), aslSF=Math.round(t.asl0+t.profile[0][1]);
 app.innerHTML=`<div class="view">
 <div class="crumb"><a href="#/">F1 Racetracks</a><span class="sep">/</span>Round ${t.round} · ${esc(t.gp)}</div>
 <p class="eyebrow">Circuit Breakdown <span>// Round ${String(t.round).padStart(2,'0')} · ${esc(t.gp)}${t.status==='active'?' · live':''}</span></p>
 <h1 class="track">${esc(t.title)}</h1>
 <p class="sub">${esc(t.sub)}</p>
 <dl class="meta">
 <div><dt>Location</dt><dd>${esc(t.loc)} <small>${t.cc}</small></dd></div>
 <div><dt>Length</dt><dd>${t.length} <small>km</small></dd></div>
 <div><dt>Turns</dt><dd>${t.turns}</dd></div>
 <div><dt>Race</dt><dd>${t.laps} <small>laps</small></dd></div>
 <div><dt>DRS zones</dt><dd>${t.drsZones}</dd></div>
 <div><dt>Elevation</dt><dd>${aslLow}–${aslHigh} <small>m ASL</small></dd></div>
 <div><dt>Top speed</dt><dd>${esc(t.topSpeed)} <small>km/h</small></dd></div>
 <div><dt>Lap record</dt><dd>${t.recordNote?esc(t.record):esc(t.record)}</dd></div>
 </dl>
 <div class="card">
 <div class="card-h"><span class="tag">${esc(t.mapTag)}</span></div>
 <div class="plate"><img loading="lazy" src="https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(t.mapFile)}" alt="Official ${esc(t.title)} outline map"
 onerror="this.style.display='none';this.insertAdjacentHTML('afterend','<div class=&quot;ph&quot;>Map image unavailable yet. File: ${esc(t.mapFile)}</div>')"></div>
 <div class="map-cap"><span>Official outline + turn numbers</span><span>Map: ${esc(t.mapCredit)}</span></div>
 </div>
 <div class="card">
 <div class="card-h"><span class="tag">Lap profile · elevation · DRS · sectors</span>
 <span class="lap">Pole ref <b>${esc(t.poleRef)}</b></span></div>
 <svg class="profile" id="profile" viewBox="0 0 1000 330" role="img" aria-label="${esc(t.title)} lap profile"></svg>
 <div class="legend-row">
 <span class="lr"><span class="ln"></span>Elevation, m ASL (${aslLow}–${aslHigh} m)</span>
 <span class="lr"><span class="sf"></span>S/F line ${aslSF} m</span>
 <span class="lr"><span class="dia"></span>DRS detection → activation</span>
 <span class="lr"><span class="sw" style="background:var(--s1)"></span>S1</span>
 <span class="lr"><span class="sw" style="background:var(--s2)"></span>S2</span>
 <span class="lr"><span class="sw" style="background:var(--s3)"></span>S3</span>
 </div>
 <div class="sb-cols" id="sb-cols"></div>
 </div>
 <div class="info2">
 <div class="panel"><div class="panel-h"><i data-lucide="circle-gauge"></i><h3>Pit lane & stops</h3></div>
 <div class="panel-b">${t.pit.map(p=>`<div class="kv"><span class="k">${esc(p[0])}</span><span class="v">${esc(p[1])}${p[2]?`<small>${esc(p[2])}</small>`:''}</span></div>`).join('')}</div></div>
 <div class="panel"><div class="panel-h"><i data-lucide="disc"></i><h3>Tyre strategy</h3></div>
 <div class="panel-b"><div class="tyres">${t.tyres.map((y,j)=>`<div class="tyre" style="--c:${['oklch(85% 0.005 264)','oklch(80% 0.16 95)','var(--red)'][j]}"><span class="ring">${y[0]}</span><span><b>${y[1]}</b></span></div>`).join('')}</div>
 <div class="kv"><span class="k">Allocation</span><span class="v">${esc(t.tyreAlloc.split(' · ')[0])}<small>${esc(t.tyreAlloc.split(' · ')[1]||'')}</small></span></div>
 <div class="strat">${t.strat.map(s=>`<div class="row"><span class="tg ${s[0]}">${esc(s[1])}</span><span class="seq">${esc(s[2])}</span></div>`).join('')}</div>
 <p class="note">${esc(t.stratNote)}</p></div></div>
 <div class="panel"><div class="panel-h"><i data-lucide="swords"></i><h3>Overtaking</h3></div>
 <div class="panel-b"><div class="rate"><div class="score">${typeof t.otScore==='number'?t.otScore.toFixed(1):t.otScore}<small> / 5</small></div><div class="meter"><i style="width:${t.otPct}%"></i></div><div class="word">${esc(t.otWord)}</div></div>
 <div class="spots">${t.spots.map(s=>`<div class="s"><b>${esc(s[0])}</b><span>${esc(s[1])}</span></div>`).join('')}</div>
 <p class="note">${esc(t.otNote)}</p></div></div>
 </div>
 <div class="wx">
 <div class="wx-head"><h2><i data-lucide="cloud-sun"></i>Race-weekend forecast</h2><span class="wx-stamp" id="wx-stamp">Loading…</span></div>
 <div id="wx-body"><div class="wx-loading">Fetching the latest ${esc(t.loc)} forecast…</div></div>
 </div>
 <section class="block"><div class="h2"><h2>Corner-by-corner</h2><span class="count">${t.turns} turns</span></div>
 <table class="tbl"><thead><tr><th>#</th><th>Name</th><th>Sector</th><th>Type</th><th>Notes</th></tr></thead><tbody id="tbody"></tbody></table></section>
 <section class="block"><div class="h2"><h2>Track character & geography</h2></div>
 <div class="geo">${t.geo.map(g=>`<article><h3><i data-lucide="${g[0]}"></i>${esc(g[1])}</h3><p>${esc(g[2])}</p></article>`).join('')}</div></section>
 <div class="prevnext">
 <button class="pn" ${prev?'':'disabled'} ${prev?`onclick="location.hash='#/${prev.slug}'"`:''}><div class="lbl">← Previous</div><div class="nm">${prev?esc(prev.gp):'—'}</div></button>
 <button class="pn next" ${next?'':'disabled'} ${next?`onclick="location.hash='#/${next.slug}'"`:''}><div class="lbl">Next →</div><div class="nm">${next?esc(next.gp):'—'}</div></button>
 </div>
 </div>`;
 buildProfile(t);
 const cols=document.getElementById('sb-cols');
 t.sectors.forEach(s=>{const c=document.createElement('div');c.className='sb-col';
 c.innerHTML=`<div class="top"><span class="pill" style="background:${SECCOL[s.k]}"></span><span class="name">${s.name}</span></div><div class="corners">${esc(s.corners)}</div><div class="time">${s.time}<small> s · approx</small></div><div class="char">${esc(s.char)}</div>`;
 cols.appendChild(c);});
 const tb=document.getElementById('tbody');
 t.corners.forEach(c=>{const tr=document.createElement('tr');
 tr.innerHTML=`<td class="tnum">T${c[0]}</td><td class="tname">${esc(c[1])}</td><td><span class="secdot"><span class="dot" style="background:${SECCOL[c[2]]}"></span>${SN[c[2]]}</span></td><td class="ttype">${esc(c[3])}</td><td class="tnote">${esc(c[4])}</td>`;
 tb.appendChild(tr);});
 loadWeather(t);
}

function renderSoon(t){
 app.innerHTML=`<div class="view">
 <div class="crumb"><a href="#/">F1 Racetracks</a><span class="sep">/</span>Round ${t.round} · ${esc(t.gp)}</div>
 <p class="eyebrow">Circuit Breakdown <span>// Round ${String(t.round).padStart(2,'0')} · ${esc(t.gp)}</span></p>
 <h1 class="track">${esc(t.title)}</h1>
 <p class="sub">${esc(t.loc)}, ${t.cc} · ${t.date} ${SEASON}. Full breakdown not built yet. It’ll be generated ahead of the race weekend using the Circuit Breakdown generator.</p>
 <div class="card" style="margin-top:24px"><div class="panel-b" style="padding:30px 4px"><p class="note" style="padding:0">Coming soon. <a href="#/" style="color:var(--drs)">← Back to all circuits</a></p></div></div>
 </div>`;
}

function buildProfile(t){
 const svg=document.getElementById('profile');
 const W=1000,PAD=58,EB=210,ET=52,BARY=250,BARH=26;
 const elevMin=0, elevMax=t.elevMax;
 const X=d=>PAD+d*(W-PAD*2);const Y=m=>EB-((m-elevMin)/(elevMax-elevMin))*(EB-ET);
 const asl=v=>Math.round(t.asl0+v);
 t.drs.forEach(z=>{svg.appendChild(E('rect',{x:X(z.from),y:ET-6,width:X(z.to)-X(z.from),height:(BARY+BARH)-(ET-6),fill:'oklch(64% 0.2 145/.13)',stroke:'oklch(64% 0.2 145/.4)','stroke-width':1,rx:3}));
 const fl=E('text',{x:X(z.from)+4,y:ET+6,fill:'var(--drs)','font-size':(t.drs.length>3?9.5:11),'font-weight':600,'font-family':'IBM Plex Mono, monospace'});fl.textContent=z.label+(t.drs.length>3?'':' ▸');svg.appendChild(fl);});
 const defs=E('defs');const grad=E('linearGradient',{id:'eg',x1:0,y1:0,x2:0,y2:1});
 grad.appendChild(E('stop',{offset:'0%','stop-color':'var(--elev)','stop-opacity':.32}));grad.appendChild(E('stop',{offset:'100%','stop-color':'var(--elev)','stop-opacity':.02}));defs.appendChild(grad);svg.appendChild(defs);
 const area=d3.area().x(p=>X(p[0])).y0(EB).y1(p=>Y(p[1])).curve(d3.curveCatmullRom.alpha(0.6));
 const line=d3.line().x(p=>X(p[0])).y(p=>Y(p[1])).curve(d3.curveCatmullRom.alpha(0.6));
 svg.appendChild(E('path',{d:area(t.profile),fill:'url(#eg)'}));svg.appendChild(E('path',{d:line(t.profile),fill:'none',stroke:'var(--elev)','stroke-width':2.5,'stroke-linejoin':'round'}));
 const vals=t.profile.map(p=>p[1]); const minP=Math.min(...vals), maxP=Math.max(...vals), sfVal=t.profile[0][1];
 const er=E('text',{x:8,y:ET-14,fill:'var(--muted)','font-size':10,'font-weight':600,'font-family':'IBM Plex Mono, monospace'});er.textContent='ELEVATION · m ASL';svg.appendChild(er);
 const yHi=Y(maxP);
 svg.appendChild(E('line',{x1:PAD-6,y1:yHi,x2:W-PAD,y2:yHi,stroke:'var(--line)','stroke-width':1,'stroke-dasharray':'2 6',opacity:.45}));
 svg.appendChild(E('text',{x:8,y:yHi+3,fill:'var(--faint)','font-size':10,'font-family':'IBM Plex Mono, monospace'})).textContent=asl(maxP)+' m';
 const yLo=Y(minP);
 svg.appendChild(E('line',{x1:PAD-6,y1:yLo,x2:W-PAD,y2:yLo,stroke:'var(--line)','stroke-width':1,'stroke-dasharray':'2 6',opacity:.45}));
 svg.appendChild(E('text',{x:8,y:yLo+3,fill:'var(--faint)','font-size':10,'font-family':'IBM Plex Mono, monospace'})).textContent=asl(minP)+' m';
 const ySF=Y(sfVal);
 if(Math.abs(ySF-yLo)>10 && Math.abs(ySF-yHi)>10){
 svg.appendChild(E('line',{x1:PAD,y1:ySF,x2:W-PAD,y2:ySF,stroke:'var(--faint)','stroke-width':1.2,'stroke-dasharray':'5 4',opacity:.7}));
 const sl=E('text',{x:W-PAD,y:ySF-5,fill:'var(--muted)','font-size':9.5,'text-anchor':'end','font-weight':600,'font-family':'IBM Plex Mono, monospace'});sl.textContent='S/F '+asl(sfVal)+' m';svg.appendChild(sl);
 }
 t.drs.forEach(z=>{const dx=X(z.det),ay=EB+20;svg.appendChild(E('line',{x1:dx,y1:ay,x2:X(z.from),y2:ay,stroke:'var(--drs)','stroke-width':1.4,'stroke-dasharray':'3 3'}));
 svg.appendChild(E('path',{d:`M${X(z.from)-5},${ay-3} L${X(z.from)},${ay} L${X(z.from)-5},${ay+3} Z`,fill:'var(--drs)'}));
 svg.appendChild(E('rect',{x:dx-5,y:ay-5,width:10,height:10,fill:'var(--drs)',transform:`rotate(45 ${dx} ${ay})`}));
 svg.appendChild(E('text',{x:dx,y:ay-9,fill:'var(--drs)','font-size':9.5,'font-weight':600,'text-anchor':'middle','font-family':'IBM Plex Mono, monospace'})).textContent='DET';});
 t.sectorsBar.forEach(s=>{svg.appendChild(E('rect',{x:X(s.from),y:BARY,width:X(s.to)-X(s.from)-2,height:BARH,fill:SECraw(s.k),rx:3}));
 svg.appendChild(E('text',{x:(X(s.from)+X(s.to))/2,y:BARY+BARH/2+4,fill:'oklch(18% 0.02 264)','font-size':12,'font-weight':700,'text-anchor':'middle'})).textContent=SN[s.k];});
 svg.appendChild(E('text',{x:PAD,y:BARY+BARH+15,fill:'var(--faint)','font-size':10,'font-family':'IBM Plex Mono, monospace'})).textContent='LAP START';
 svg.appendChild(E('text',{x:W-PAD,y:BARY+BARH+15,fill:'var(--faint)','font-size':10,'text-anchor':'end','font-family':'IBM Plex Mono, monospace'})).textContent='S/F';
 const valAt=d=>{const arr=t.profile;for(let i=1;i<arr.length;i++){if(arr[i][0]>=d){const a=arr[i-1],b=arr[i];const tt=(d-a[0])/(b[0]-a[0]||1);return a[1]+(b[1]-a[1])*tt;}}return arr[arr.length-1][1];};
 t.marks.forEach(m=>{const x=X(m[0]);svg.appendChild(E('line',{x1:x,y1:Y(valAt(m[0])),x2:x,y2:BARY,stroke:'var(--line)','stroke-width':1,'stroke-dasharray':'2 4'}));
 svg.appendChild(E('circle',{cx:x,cy:Y(valAt(m[0])),r:3,fill:'var(--elev)',stroke:'var(--bg)','stroke-width':1.5}));
 svg.appendChild(E('text',{x:x,y:Y(valAt(m[0]))-9,fill:'var(--muted)','font-size':10,'text-anchor':'middle','font-family':'Space Grotesk, sans-serif'})).textContent=m[1];});
}

function SECraw(k){return getComputedStyle(document.documentElement).getPropertyValue('--'+k).trim();}