/* Swipe-to-sort. Bulk-input funnel into the Collection ledger.
   Reads /catalog minus owned/want (D1) minus skipped (localStorage); right=own, up=want (D1 writes), left=skip (local). */
const CAT_LABELS={mini:"Minis",pack:"Packs","big-riso":"Big Risographs",linocut:"Linocuts",exclusive:"Exclusives"};
const EXCL_LABEL={nyc:"NYC",lacma:"LACMA",holiday:"Holiday","grand-central":"Grand Central","richard-scarry":"Richard Scarry"};
const CAT_ORDER=["mini","big-riso","linocut","exclusive","pack"];
const THUMB_HUE={mini:72,pack:205,exclusive:305,"big-riso":152,linocut:40};
const SKIP_KEY="inciardi_skip";

let CATALOG={prints:[]}, MARKET={listings:[]}, INV={inventory:[]}, fromD1=false;
let feed=[];        // remaining prints to sort (feed[0] = live top card)
let undoStack=[];   // {type, p, inv_id, ready}
let sorted=0, added=0, wanted=0, skipped=0;
let filters={cat:"all", series:"all", inPrintOnly:true};
let busy=false;     // guards a commit animation in flight

initChrome();
boot();

async function boot(){
  const [cat, market, inv] = await Promise.all([ apiGet("/catalog", null), apiGet("/market",{listings:[],source:"none"}), apiGet("/inventory",{inventory:[]}) ]);
  if(cat && cat.prints && cat.prints.length){ CATALOG=cat; fromD1=true; } else { CATALOG=await seedCatalog(); fromD1=false; }
  MARKET=market; INV=inv;
  buildFilterUI(); wire(); rebuildFeed(); render();
  if(!canWrite()) showNote("Read-only — add your write key in Settings to save what you swipe.");
}
async function seedCatalog(){ try{ const r=await fetch("./catalog.json"); return await r.json(); }catch(e){ return {prints:[]}; } }

/* ---- sets ---- */
function skipSet(){ try{ return new Set(JSON.parse(localStorage.getItem(SKIP_KEY)||"[]")); }catch(e){ return new Set(); } }
function saveSkip(s){ try{ localStorage.setItem(SKIP_KEY, JSON.stringify([...s])); }catch(e){} }
function keyOf(p){ return p.print_id || normStr(p.name); }
function sortedSet(){ const s=new Set(); (INV.inventory||[]).forEach(r=>{ if(r.disposition==="own"||r.disposition==="want"){ if(r.print_id) s.add(r.print_id); if(r.name) s.add(normStr(r.name)); } }); return s; }

function rebuildFeed(){
  const done=sortedSet(), skip=skipSet();
  feed=(CATALOG.prints||[]).filter(p=>{
    if(done.has(p.print_id)||done.has(normStr(p.name))) return false;
    if(skip.has(keyOf(p))) return false;
    if(filters.inPrintOnly && !p.available) return false;
    if(filters.cat!=="all" && p.category!==filters.cat) return false;
    if(filters.series!=="all" && p.exclusive!==filters.series) return false;
    return true;
  });
}

/* ---- filter UI ---- */
function buildFilterUI(){
  const prints=CATALOG.prints||[]; const counts={}; prints.forEach(p=>counts[p.category]=(counts[p.category]||0)+1);
  const cats=CAT_ORDER.filter(c=>counts[c]);
  const chips=[`<button class="chip" data-cat="all" aria-pressed="true">All</button>`]
    .concat(cats.map(c=>`<button class="chip" data-cat="${c}" aria-pressed="false">${CAT_LABELS[c]||c}</button>`));
  $("catChips").innerHTML=chips.join("");
  $("catChips").querySelectorAll(".chip").forEach(ch=>ch.addEventListener("click",()=>{ $("catChips").querySelectorAll(".chip").forEach(x=>x.setAttribute("aria-pressed",String(x===ch))); filters.cat=ch.dataset.cat; }));
}
function wire(){
  $("btnHave").addEventListener("click",()=>flyTop("own"));
  $("btnSkip").addEventListener("click",()=>flyTop("skip"));
  $("btnWant").addEventListener("click",()=>flyTop("want"));
  $("btnUndo").addEventListener("click",undoLast);
  const f=$("filters");
  $("filterBtn").addEventListener("click",()=>f.showModal());
  $("filtClose").addEventListener("click",()=>f.close());
  f.addEventListener("click",(e)=>{ if(e.target===f) f.close(); });
  $("seriesSel").addEventListener("change",()=>filters.series=$("seriesSel").value);
  const ip=$("inPrintToggle"); ip.addEventListener("click",()=>{ filters.inPrintOnly=!filters.inPrintOnly; ip.setAttribute("aria-pressed",String(filters.inPrintOnly)); ip.textContent=filters.inPrintOnly?"On":"Off"; });
  $("applyFilters").addEventListener("click",()=>{ rebuildFeed(); render(); f.close(); updateFilterLabel(); });
  $("resetSkips").addEventListener("click",()=>{ saveSkip(new Set()); skipped=0; rebuildFeed(); render(); f.close(); toast("skipped prints reset"); });
  document.addEventListener("keydown",(e)=>{ if(f.open) return; if(e.key==="ArrowRight")flyTop("own"); else if(e.key==="ArrowLeft")flyTop("skip"); else if(e.key==="ArrowUp")flyTop("want"); });
  updateFilterLabel();
}
function updateFilterLabel(){ const bits=[]; if(filters.inPrintOnly)bits.push("In print"); if(filters.cat!=="all")bits.push(CAT_LABELS[filters.cat]||filters.cat); if(filters.series!=="all")bits.push(EXCL_LABEL[filters.series]||filters.series); $("filterLabel").textContent=bits.length?bits.join(" · "):"All prints"; }

/* ---- render ---- */
function phStyle(cat){ const h=THUMB_HUE[cat]||72; return `background:oklch(30% 0.05 ${h});color:oklch(80% 0.11 ${h})`; }
function cardHTML(p, depth){
  const img=p.image?`<img src="${esc(proxied(p.image,720))}" alt="${esc(p.name)}" draggable="false">`:"";
  const ph=`<div class="ph" style="${phStyle(p.category)}">${p.image?"":initials(p.name)}</div>`;
  const m=marketFor(MARKET,p);
  const series=p.exclusive?`<span class="swbadge">${EXCL_LABEL[p.exclusive]||p.exclusive}</span>`:"";
  return `<article class="swcard" data-depth="${depth}" data-key="${esc(keyOf(p))}">
    <div class="frame">${ph}${img}
      <div class="stamp have">HAVE</div><div class="stamp skip">SKIP</div><div class="stamp want">WANT</div>
      <div class="scrim"></div>
      <div class="meta"><div class="nm">${esc(p.name)}</div>
        <div class="chips">${series}<span class="swchip">${CAT_LABELS[p.category]||p.category||""}</span>${p.retail!=null?`<span class="swchip">${money0(p.retail)}</span>`:""}${m?`<span class="swchip mkt">${m.count} on eBay</span>`:""}</div>
      </div>
      <div class="backface"><div class="bk-h">Market · ${esc(p.name)}</div><div class="bk-body">${marketRows(p,m)}</div>
        <div class="bk-acts"><button class="mini want" data-a="want">♥ Want it</button><button class="mini skip" data-a="skip">✕ Don't have</button></div>
        <button class="bk-flip" data-a="unflip">← back to print</button></div>
    </div>
  </article>`;
}
function marketRows(p,m){
  const rows=[["Retail", p.retail!=null?money(p.retail):"—", false],["Category", CAT_LABELS[p.category]||p.category||"—", false]];
  if(p.exclusive) rows.push(["Series", EXCL_LABEL[p.exclusive]||p.exclusive, false]);
  rows.push(["In print", p.available?"Yes":"Retired", false]);
  rows.push(["Live on eBay", m?(m.count+" listing"+(m.count>1?"s":"")):"Not listed", !!m]);
  if(m&&m.low!=null) rows.push(["Market low", money(m.low), true]);
  return rows.map(([k,v,up])=>`<div class="bk-row"><span class="k">${k}</span><span class="v${up?" up":""}">${esc(v)}</span></div>`).join("");
}
function render(){
  const stage=$("stage");
  $("btnUndo").disabled = !undoStack.length;
  if(!feed.length){ stage.innerHTML=endHTML(); wireEnd(); toggleActions(false); updateProgress(); return; }
  toggleActions(true);
  const top=feed.slice(0,3);
  // deepest first in DOM so the top card (depth 0) paints last / on top
  stage.innerHTML=top.map((p,i)=>cardHTML(p,i)).sort((a,b)=>0).reverse().join("");
  const topEl=stage.querySelector('.swcard[data-depth="0"]');
  if(topEl) attachDrag(topEl);
  updateProgress();
}
function toggleActions(on){ $("actions").style.visibility = on ? "visible" : "hidden"; }
function updateProgress(){
  const total=(CATALOG.prints||[]).length;
  $("progress").innerHTML = feed.length ? `<b>${sorted}</b> sorted · ${feed.length} to go` : `${sorted} sorted`;
}
function endHTML(){
  const any=sorted>0;
  return `<div class="swend">
    <div class="big">${any?"🎉":"🔍"}</div>
    <h2>${any?"Deck cleared":"Nothing to sort"}</h2>
    <div class="tally">${any?`You added <b class="have">${added}</b> owned · <b class="want">${wanted}</b> wishlist · <b class="skip">${skipped}</b> skipped`:"No prints match this filter, or you've cleared them all."}</div>
    <div class="row"><button class="btn" id="endFilter">Change filter</button>${skipSet().size?`<button class="btn ghost" id="endReset">Reset skipped</button>`:""}<a class="btn primary" href="collection.html">See collection →</a></div>
  </div>`;
}
function wireEnd(){
  const ef=$("endFilter"); if(ef) ef.addEventListener("click",()=>$("filters").showModal());
  const er=$("endReset"); if(er) er.addEventListener("click",()=>{ saveSkip(new Set()); skipped=0; rebuildFeed(); render(); toast("skipped prints reset"); });
}

/* ---- drag + long-press ---- */
function attachDrag(el){
  let startX=0,startY=0,dx=0,dy=0,pid=null,moved=false,longT=null;
  const onDown=(e)=>{
    if(busy||el.classList.contains("flipped")||pid!==null) return;
    pid=e.pointerId; try{el.setPointerCapture(pid);}catch(_){}
    startX=e.clientX; startY=e.clientY; dx=0;dy=0;moved=false; el.classList.add("grabbing");
    longT=setTimeout(()=>{ if(!moved) flip(el); }, 480);
  };
  const onMove=(e)=>{
    if(e.pointerId!==pid) return;
    dx=e.clientX-startX; dy=e.clientY-startY;
    if(!moved && (Math.abs(dx)>6||Math.abs(dy)>6)){ moved=true; clearTimeout(longT); }
    el.style.transform=`translate(${dx}px,${dy}px) rotate(${dx*0.05}deg)`;
    stamps(el,dx,dy);
  };
  const onUp=(e)=>{
    if(e.pointerId!==pid) return;
    clearTimeout(longT); el.classList.remove("grabbing"); pid=null;
    const w=el.offsetWidth||340, cx=Math.max(90,w*0.32), cy=120;
    if(dx>cx) return fly(el,"own");
    if(dx<-cx) return fly(el,"skip");
    if(dy<-cy && Math.abs(dx)<cx) return fly(el,"want");
    el.style.transform=""; stamps(el,0,0);
  };
  el.addEventListener("pointerdown",onDown);
  el.addEventListener("pointermove",onMove);
  el.addEventListener("pointerup",onUp);
  el.addEventListener("pointercancel",onUp);
  el.querySelectorAll("[data-a]").forEach(b=>b.addEventListener("click",(ev)=>{ ev.stopPropagation(); const a=b.dataset.a; if(a==="unflip")unflip(el); else if(a==="want")commit("want"); else if(a==="skip")commit("skip"); }));
}
function stamps(el,dx,dy){
  const w=el.offsetWidth||340, cx=Math.max(90,w*0.32), cy=120;
  const h=el.querySelector(".stamp.have"), s=el.querySelector(".stamp.skip"), wa=el.querySelector(".stamp.want");
  if(!h) return;
  h.style.opacity = dx>20 ? Math.min(1, dx/cx).toFixed(2) : 0;
  s.style.opacity = dx<-20 ? Math.min(1, -dx/cx).toFixed(2) : 0;
  wa.style.opacity = (dy<-20 && Math.abs(dx)<cx) ? Math.min(1, -dy/cy).toFixed(2) : 0;
}
function flip(el){ el.classList.add("flipped"); }
function unflip(el){ el.classList.remove("flipped"); }

function flyTop(type){ const el=$("stage").querySelector('.swcard[data-depth="0"]'); if(!el||busy) return; if(el.classList.contains("flipped")) unflip(el); fly(el,type); }
function fly(el,type){
  if(busy) return; busy=true;
  const dir = type==="own"?1 : type==="skip"?-1 : 0;
  const tx = dir*(window.innerWidth||500)*1.1, ty = type==="want"?-(window.innerHeight||800):40;
  el.style.transition="transform .34s var(--ease), opacity .34s";
  el.style.transform=`translate(${tx}px,${ty}px) rotate(${dir*14}deg)`;
  el.style.opacity="0";
  if(navigator.vibrate){ try{ navigator.vibrate(type==="own"?[10,5,10]:6); }catch(_){} }
  setTimeout(()=>{ busy=false; commit(type); }, 260);
}

/* ---- commit / undo ---- */
async function commit(type){
  const p=feed[0]; if(!p) return;
  feed.shift(); sorted++;
  if(type==="skip"){ const s=skipSet(); s.add(keyOf(p)); saveSkip(s); skipped++; undoStack.push({type,p,inv_id:null,ready:null}); render(); return; }
  const disp = type==="own"?"own":"want";
  if(type==="own") added++; else wanted++;
  const entry={type,p,inv_id:null,ready:null}; undoStack.push(entry); render();
  if(!canWrite()){ showNote("Not saved — add your write key in Settings."); return; }
  entry.ready=(async()=>{
    try{
      const body={op:"upsert", disposition:disp, qty:1, acquired_where:"swipe"};
      if(p.print_id) body.print_id=p.print_id; else body.provisional_label=p.name;
      const r=await apiPost("/inventory", body);
      entry.inv_id = r.inserted || r.updated || null;
      INV=await apiGet("/inventory",{inventory:[]});
    }catch(e){ reconcileFail(entry, e); }
  })();
}
function reconcileFail(entry, e){
  // write failed: pull it back out of the ledger counts + re-serve the card
  const i=undoStack.indexOf(entry); if(i>=0) undoStack.splice(i,1);
  if(entry.type==="own") added=Math.max(0,added-1); else wanted=Math.max(0,wanted-1);
  sorted=Math.max(0,sorted-1);
  if(!feed.some(x=>keyOf(x)===keyOf(entry.p))) feed.unshift(entry.p);
  render();
  toast((e&&e.message)||"save failed — card returned", true);
}
async function undoLast(){
  const entry=undoStack.pop(); if(!entry) return;
  const {type,p}=entry;
  if(!feed.some(x=>keyOf(x)===keyOf(p))) feed.unshift(p);
  sorted=Math.max(0,sorted-1);
  if(type==="skip"){ const s=skipSet(); s.delete(keyOf(p)); saveSkip(s); skipped=Math.max(0,skipped-1); render(); toast("undo"); return; }
  if(type==="own") added=Math.max(0,added-1); else wanted=Math.max(0,wanted-1);
  render(); toast("undo");
  if(entry.ready){ try{ await entry.ready; }catch(_){} }
  if(entry.inv_id && canWrite()){ try{ await apiPost("/inventory",{op:"delete",inv_id:entry.inv_id}); INV=await apiGet("/inventory",{inventory:[]}); }catch(_){} }
}

/* ---- misc ---- */
let _noteT;
function showNote(msg){ let n=$("swnote"); if(!n){ n=document.createElement("div"); n.id="swnote"; n.className="swnote"; document.body.appendChild(n); } n.textContent=msg; clearTimeout(_noteT); _noteT=setTimeout(()=>{ if(n) n.remove(); }, 4200); }
