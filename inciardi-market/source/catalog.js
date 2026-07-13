/* Catalog gallery + full image lifecycle. Reads /catalog (D1) with catalog.json seed fallback. */
const CAT_LABELS={mini:"Minis",pack:"Packs","big-riso":"Big Risographs",linocut:"Linocuts",exclusive:"Exclusives"};
const EXCL_LABEL={nyc:"NYC",lacma:"LACMA",holiday:"Holiday","grand-central":"Grand Central","richard-scarry":"Richard Scarry"};
const CAT_ORDER=["mini","big-riso","linocut","exclusive","pack"];
const THUMB_HUE={mini:72,pack:205,exclusive:305,"big-riso":152,linocut:40};

let CATALOG={prints:[]}, MARKET={listings:[]}, INV={inventory:[]}, fromD1=false;
let state={q:"",cat:"all",ebayOnly:false};
let openPid=null;

initChrome();
boot();

async function boot(){
 const [cat, market, inv] = await Promise.all([ apiGet("/catalog", null), apiGet("/market",{listings:[],source:"none"}), apiGet("/inventory",{inventory:[]}) ]);
 if(cat && cat.prints && cat.prints.length){ CATALOG=cat; fromD1=true; } else { CATALOG=await seedCatalog(); fromD1=false; }
 MARKET=market; INV=inv;
 const live=MARKET.source==="ebay-browse"; $("f-src").textContent="market: "+(live?"live \u00b7 eBay":"sample"); $("f-src").className=live?"up":"";
 buildChips(); renderStrip(); render(); wireControls();
 if(location.hash) openDetail(decodeURIComponent(location.hash.slice(1)));
}
async function seedCatalog(){ try{ const r=await fetch("./catalog.json"); const d=await r.json(); return d; }catch(e){ return {prints:[]}; } }

function ownedSet(){ const s=new Set(); (INV.inventory||[]).forEach(r=>{ if(r.disposition==="own"){ if(r.print_id) s.add(r.print_id); if(r.name) s.add(normStr(r.name)); } }); return s; }
function isOwned(p, set){ return set.has(p.print_id) || set.has(normStr(p.name)); }

/* ---- controls ---- */
function buildChips(){
 const prints=CATALOG.prints||[]; const counts={}; prints.forEach(p=>counts[p.category]=(counts[p.category]||0)+1);
 const cats=CAT_ORDER.filter(c=>counts[c]);
 const chips=[`<button class="chip" data-cat="all" aria-pressed="true">All <span class="cnt">${prints.length}</span></button>`]
  .concat(cats.map(c=>`<button class="chip" data-cat="${c}" aria-pressed="false">${CAT_LABELS[c]||c} <span class="cnt">${counts[c]}</span></button>`));
 $("catChips").innerHTML=chips.join("");
 $("catChips").querySelectorAll(".chip").forEach(ch=>ch.addEventListener("click",()=>{ state.cat=ch.dataset.cat; $("catChips").querySelectorAll(".chip").forEach(x=>x.setAttribute("aria-pressed",String(x===ch))); render(); }));
}
function wireControls(){
 const s=$("search"), bar=$("searchbar");
 s.addEventListener("input",()=>{ state.q=s.value; bar.classList.toggle("has-val",!!state.q); render(); });
 $("searchClr").addEventListener("click",()=>{ s.value=""; state.q=""; bar.classList.remove("has-val"); s.focus(); render(); });
 const t=$("ebayToggle"); t.addEventListener("click",()=>{ state.ebayOnly=!state.ebayOnly; t.setAttribute("aria-pressed",String(state.ebayOnly)); render(); });
 $("addBtn").addEventListener("click",openAdd);
 const d=$("detail"); d.addEventListener("click",(e)=>{ if(e.target===d) d.close(); });
 const ap=$("addPrint"); ap.addEventListener("click",(e)=>{ if(e.target===ap) ap.close(); });
 $("addClose").addEventListener("click",()=>ap.close()); $("ap-cancel").addEventListener("click",()=>ap.close());
 $("ap-save").addEventListener("click",saveNewPrint);
 document.addEventListener("keydown",(e)=>{ if(e.key==="Escape"){ if(d.open)d.close(); else if(ap.open)ap.close(); } });
}

/* ---- render ---- */
function renderStrip(){
 const prints=CATALOG.prints||[]; const withImg=prints.filter(p=>p.image).length; const excl=prints.filter(p=>p.exclusive).length; const onEbay=prints.filter(p=>marketFor(MARKET,p)).length; const owned=ownedSet(); const own=prints.filter(p=>isOwned(p,owned)).length;
 $("strip").innerHTML=`
  <div class="s"><div class="v">${prints.length}</div><div class="l">Catalogued</div></div>
  <div class="s"><div class="v">${withImg}</div><div class="l">With image</div></div>
  <div class="s"><div class="v up">${own}</div><div class="l">You own</div></div>
  <div class="s"><div class="v plum">${excl}</div><div class="l">Exclusives</div></div>
  <div class="s"><div class="v up">${onEbay}</div><div class="l">On eBay now</div></div>`;
}
function matchQ(p,q){ if(!q) return true; const hay=normStr(p.name+" "+(p.aliases||[]).join(" ")+" "+(p.category||"")+" "+(p.exclusive||"")); return hay.includes(normStr(q)); }
function render(){
 const owned=ownedSet();
 let list=(CATALOG.prints||[]).filter(p=>(state.cat==="all"||p.category===state.cat)&&matchQ(p,state.q));
 if(state.ebayOnly) list=list.filter(p=>marketFor(MARKET,p));
 list.sort((a,b)=>(!!b.image-!!a.image)||a.name.localeCompare(b.name));
 const total=(CATALOG.prints||[]).length;
 $("countLine").innerHTML=`Showing <b>${list.length}</b> of ${total} prints${state.cat!=="all"?" \u00b7 "+(CAT_LABELS[state.cat]||state.cat):""}${fromD1?"":" \u00b7 seed (connect Worker for live catalog)"}`;
 const grid=$("grid");
 if(!list.length){ grid.innerHTML=`<div class="empty" style="grid-column:1/-1"><h3>No prints match</h3><p>Try a different search or clear the filters.</p></div>`; return; }
 grid.innerHTML=list.map((p,i)=>cardHTML(p,i,owned)).join("");
 grid.querySelectorAll(".card").forEach(el=>{ el.addEventListener("click",()=>openDetail(el.dataset.key));
  const img=el.querySelector("img"); if(img){ if(img.complete&&img.naturalWidth) img.classList.add("loaded"); else{ img.addEventListener("load",()=>img.classList.add("loaded")); img.addEventListener("error",()=>{ if(img.dataset.r){img.style.display="none";return;} img.dataset.r="1"; img.src=img.src+(img.src.includes("?")?"&":"?")+"r="+Date.now(); }); } } });
}
function phStyle(cat){ const h=THUMB_HUE[cat]||72; return `background:oklch(30% 0.05 ${h});color:oklch(80% 0.11 ${h})`; }
function cardHTML(p,i,owned){
 const m=marketFor(MARKET,p);
 const img=p.image?`<img src="${esc(proxied(p.image,360))}" alt="${esc(p.name)}" loading="lazy" decoding="async">`:"";
 const ph=`<div class="ph" style="${phStyle(p.category)}">${p.image?"":initials(p.name)}</div>`;
 const key=esc(p.print_id||p.name);
 return `<button class="card" data-key="${key}" style="--i:${i}">
   <div class="frame">${ph}${img}${p.exclusive?`<span class="excl">${EXCL_LABEL[p.exclusive]||p.exclusive}</span>`:""}${m?`<span class="mkt">${m.count} on eBay</span>`:""}${isOwned(p,owned)?`<span class="owned">Owned</span>`:""}</div>
   <div class="body"><div class="nm">${esc(p.name)}</div><div class="rl"><span class="cat">${CAT_LABELS[p.category]||p.category||""}</span><span>${p.retail!=null?money0(p.retail):"\u2014"}</span></div></div>
  </button>`;
}

/* ---- detail + image lifecycle ---- */
function findPrint(key){ const prints=CATALOG.prints||[]; return prints.find(p=>p.print_id===key)||prints.find(p=>normStr(p.name)===normStr(key)); }
function openDetail(key){
 const p=findPrint(key); if(!p) return; openPid=p.print_id||null;
 const m=marketFor(MARKET,p);
 const hero=p.image?`<img src="${esc(proxied(p.image,900))}" alt="${esc(p.name)}">`:`<div class="ph" style="${phStyle(p.category)}">${initials(p.name)}</div>`;
 const facts=[["Retail",p.retail!=null?money(p.retail):"\u2014",false],["Category",CAT_LABELS[p.category]||p.category||"\u2014",false],p.exclusive?["Series",EXCL_LABEL[p.exclusive]||p.exclusive,false]:null,["In print",p.available?"Yes":"Retired / sold out",false],m?["Live on eBay",m.count+" listing"+(m.count>1?"s":""),true]:["Live on eBay","Not listed",false],m&&m.low!=null?["Market low",money(m.low),true]:null].filter(Boolean)
  .map(([k,v,up])=>`<div class="dt-fact"><span class="k">${k}</span><span class="v${up?" up":""}">${esc(v)}</span></div>`).join("");
 const ebayUrl=`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent("anastasia inciardi "+p.name)}`;
 $("detailInner").innerHTML=`
  <div class="dt-hero">${hero}<button class="dt-close" id="dtClose"><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>
  <div class="dt-body">
   <h2>${esc(p.name)}</h2>
   <div class="dt-tags"><span class="chip">${CAT_LABELS[p.category]||p.category||""}</span>${p.exclusive?`<span class="chip plum">${EXCL_LABEL[p.exclusive]||p.exclusive}</span>`:""}${m?`<span class="chip up">On eBay now</span>`:""}</div>
   <div class="dt-facts">${facts}</div>
   <div id="imgMgr"></div>
   <div class="dt-actions">
    <a class="btn" href="${ebayUrl}" target="_blank" rel="noopener">Find on eBay</a>
    <button class="btn write-only" id="dtAddOwn">+ I own this</button>
   </div>
  </div>`;
 $("dtClose").addEventListener("click",()=>$("detail").close());
 const own=$("dtAddOwn"); if(own) own.addEventListener("click",()=>addOwned(p));
 document.body.classList.toggle("can-write",canWrite());
 renderImgMgr(p);
 $("detail").showModal();
}
function renderImgMgr(p){
 const box=$("imgMgr"); if(!box) return;
 if(!canWrite()){ box.innerHTML=`<div class="dt-sec">Images</div><div class="readonly-note">Add your write key in Settings to upload, store, and manage images for this print.</div>`; return; }
 if(!fromD1 || !p.print_id){
  box.innerHTML=`<div class="dt-sec">Images</div><div class="readonly-note">This print isn't in the database yet. Save it to enable reliable image storage.</div><button class="btn primary" id="promote">Save to database</button>`;
  $("promote").addEventListener("click",()=>promote(p));
  return;
 }
 const imgs=p.images||[]; const active=imgs.filter(i=>i.status==="active"); const arch=imgs.filter(i=>i.status==="archived");
 const thumb=(i)=>`<div class="thumb ${i.is_primary?"primary":""} ${i.status==="archived"?"arch":""}">${i.url?`<img src="${esc(i.url)}" alt="">`:""}${i.is_primary?`<span class="badge">Main</span>`:""}<div class="thumb-acts">${i.status==="active"?(i.is_primary?"":`<button data-op="primary" data-id="${i.image_id}">Set</button>`)+`<button data-op="archive" data-id="${i.image_id}">Arch</button>`:`<button data-op="restore" data-id="${i.image_id}">Restore</button><button data-op="delete" data-id="${i.image_id}">Del</button>`}</div></div>`;
 const seedUrl = p.image && /^https?:/.test(p.image) && p.image.includes("cdn.shopify.com") ? p.image : (p._srcUrl||"");
 box.innerHTML=`
  <div class="dt-sec">Images \u00b7 ${active.length} active${arch.length?` \u00b7 ${arch.length} archived`:""}</div>
  <div class="thumbs">${active.map(thumb).join("")||`<span style="font-size:0.82rem;color:var(--ink-faint)">No images stored yet.</span>`}</div>
  ${arch.length?`<div class="thumbs">${arch.map(thumb).join("")}</div>`:""}
  <div class="img-actions">
   <label class="btn sm"><input type="file" accept="image/*" id="upIn" hidden>Upload photo</label>
   ${seedUrl?`<button class="btn sm" id="scrubBtn">Scrub &amp; store original</button>`:""}
  </div>`;
 box.querySelectorAll(".thumb-acts button").forEach(b=>b.addEventListener("click",()=>imgOp(b.dataset.op,b.dataset.id)));
 const up=$("upIn"); if(up) up.addEventListener("change",()=>uploadImg(p, up.files[0]));
 const sb=$("scrubBtn"); if(sb) sb.addEventListener("click",()=>scrubStore(p, seedUrl));
}
async function refreshCatalog(reopenKey){ const cat=await apiGet("/catalog",null); if(cat&&cat.prints&&cat.prints.length){ CATALOG=cat; fromD1=true; } renderStrip(); render(); if(reopenKey) openDetail(reopenKey); }
async function imgOp(op,image_id){ try{ toast("working\u2026"); await apiPost("/catalog/image/state",{image_id,op}); toast(op+" done"); await refreshCatalog(openPid); }catch(e){ toast(e.message,true); } }
async function uploadImg(p,file){ if(!file) return; try{ toast("uploading\u2026"); const s=await fileToScaledB64(file,1400); await apiPost("/catalog/image",{print_id:p.print_id,data:s.data,content_type:s.content_type,width:s.width,height:s.height,make_primary:true}); toast("image stored"); await refreshCatalog(p.print_id); }catch(e){ toast(e.message,true); } }
async function scrubStore(p,url){ try{ toast("scrubbing\u2026"); await apiPost("/catalog/image/scrub",{print_id:p.print_id,source_url:url,make_primary:true}); toast("original stored in R2"); await refreshCatalog(p.print_id); }catch(e){ toast(e.message,true); } }
async function promote(p){ try{ toast("saving\u2026"); const r=await apiPost("/catalog",{title:p.name,category:p.category,exclusive:p.exclusive||null,retail:p.retail,in_print:p.available?1:0,pack_of:p.packOf,pack_from:p.packFrom,aliases:p.aliases||[],source:p.source||"seed"}); if(p.image&&p.image.includes("cdn.shopify.com")){ try{ await apiPost("/catalog/image/scrub",{print_id:r.print_id,source_url:p.image,make_primary:true}); }catch(e){} } toast("saved to database"); await refreshCatalog(r.print_id); }catch(e){ toast(e.message,true); } }
async function addOwned(p){ try{ if(!fromD1||!p.print_id){ await promote(p); } const pid = (findPrint(p.print_id||p.name)||{}).print_id || p.print_id; await apiPost("/inventory",{op:"upsert",print_id:pid,disposition:"own",qty:1}); INV=await apiGet("/inventory",{inventory:[]}); toast("added to your collection"); renderStrip(); render(); }catch(e){ toast(e.message,true); } }

/* ---- manual add + dedupe ---- */
function openAdd(){ $("ap-name").value=""; $("ap-retail").value=""; $("ap-excl").value=""; $("ap-cat").value="mini"; $("ap-inprint").value="0"; $("ap-warn").hidden=true; $("addPrint").showModal(); $("ap-name").focus(); }
function dedupe(name){ const n=normStr(name); const prints=CATALOG.prints||[];
 const exact=prints.find(p=>normStr(p.name)===n||(p.aliases||[]).some(a=>normStr(a)===n));
 if(exact) return {kind:"exact",p:exact};
 const near=prints.find(p=>{ const pn=normStr(p.name); return pn&&(pn.includes(n)||n.includes(pn)); });
 if(near) return {kind:"near",p:near};
 return null;
}
async function saveNewPrint(){
 const name=$("ap-name").value.trim(); if(!name){ toast("name required",true); return; }
 const hit=dedupe(name);
 if(hit&&hit.kind==="exact"){ $("addPrint").close(); toast("already catalogued \u2014 opening it"); openDetail(hit.p.print_id||hit.p.name); return; }
 if(hit&&hit.kind==="near"){ const w=$("ap-warn"); w.hidden=false; w.innerHTML=`Looks close to <b>${esc(hit.p.name)}</b>. If that's the same print, <a href="#" id="ap-open" style="color:var(--accent)">open it instead</a>. Otherwise press Save again to add as new.`; $("ap-open").addEventListener("click",(e)=>{e.preventDefault();$("addPrint").close();openDetail(hit.p.print_id||hit.p.name);}); if(w.dataset.armed!==name){ w.dataset.armed=name; return; } }
 try{ toast("saving\u2026"); const r=await apiPost("/catalog",{title:name,category:$("ap-cat").value,exclusive:$("ap-excl").value||null,retail:$("ap-retail").value?Number($("ap-retail").value):null,in_print:$("ap-inprint").value==="1"?1:0,source:"manual",locked:1}); $("addPrint").close(); toast("print added"); await refreshCatalog(r.print_id); }catch(e){ toast(e.message,true); }
}
