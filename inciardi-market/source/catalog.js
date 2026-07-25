/* Catalog gallery + full image lifecycle. Reads /catalog (D1) with catalog.json seed fallback. */
const CAT_LABELS={mini:"Minis",pack:"Packs","big-riso":"Big Risographs",linocut:"Linocuts",exclusive:"Exclusives"};
const EXCL_LABEL={nyc:"NYC",lacma:"LACMA",holiday:"Holiday","grand-central":"Grand Central","richard-scarry":"Richard Scarry"};
const CAT_ORDER=["mini","big-riso","linocut","exclusive","pack"];
const CAT_EDIT={mini:"Mini","big-riso":"Big Risograph",linocut:"Linocut",exclusive:"Exclusive",pack:"Pack"};
const THUMB_HUE={mini:72,pack:205,exclusive:305,"big-riso":152,linocut:40};

let CATALOG={prints:[]}, MARKET={listings:[]}, INV={inventory:[]}, fromD1=false;
// Michael collects MINIS. Opening on the full 177-card dump was never the useful view, so the
// catalog lands on Minis and everything else stays one chip away. Deliberately a DEFAULT FILTER
// and not a harvest exclusion: pack rows contain minis, category tagging is heuristic and will
// misfile things, and a row deleted at harvest can't come back without a full re-run.
// `group` = artwork rollup (Michael's call 2026-07-25: one card per artwork with an edition badge).
let state={q:"",cat:"mini",ebayOnly:false,group:true};
let openPid=null;

initChrome();
boot();

async function boot(){
 const [cat, market, inv] = await Promise.all([ apiGet("/catalog", null), apiGet("/market",{listings:[],source:"none"}), apiGet("/inventory",{inventory:[]}) ]);
 if(cat && cat.prints && cat.prints.length){ CATALOG=cat; fromD1=true; } else { CATALOG=await seedCatalog(); fromD1=false; }
 MARKET=market; INV=inv;
 buildChips(); renderStrip(); render(); wireControls();
 if(location.hash) openDetail(decodeURIComponent(location.hash.slice(1)));
}
async function seedCatalog(){ try{ const r=await fetch("./catalog.json"); const d=await r.json(); return d; }catch(e){ return {prints:[]}; } }

function ownedSet(){ const s=new Set(); (INV.inventory||[]).forEach(r=>{ if(r.disposition==="own"){ if(r.print_id) s.add(r.print_id); if(r.name) s.add(normStr(r.name)); } }); return s; }
function isOwned(p, set){ return set.has(p.print_id) || set.has(normStr(p.name)); }

/* ============================================================ ARTWORK ROLLUP
   Michael's ask (2026-07-25): "each artwork as the catalog entry, and the different versions
   available displayed as a tag of that artwork, and filter that way."

   THE MODEL IS A ROLLUP, NEVER A MERGE. Edition rows are PERMANENT (Michael's ruling). Every
   `print_id` survives untouched, because it keys `inventory` / `print_image` / `machine_print` —
   and for one-of-a-kind monoprints the edition IS the object. Collapsing ginkgo #1..#13 into one
   row would destroy the record of WHICH physical print is owned. So this is a pure presentation
   layer computed on the client: group the flat array, render one card, keep every row addressable.

   WHY CLIENT-SIDE: `worker.js` maps catalog columns explicitly into its JSON response and the file
   is 39KB — over the safe single-read cap — so adding an `artwork_key` column there is a chunk-walk
   job, not a one-line edit. Grouping 177 rows in JS costs nothing and keeps this front-end-only.
   When the worker is eventually chunk-walked, an `artwork_key` sourced from the Shopify product
   `handle` should replace the title parsing below (handles are stable across renames; titles are
   hand-editable, so two editions renamed differently would silently split one artwork in two).
============================================================================================ */

// "Alex's Brooklyn Ginko #4" -> {artwork:"Alex's Brooklyn Ginko", edition:"4"}
// Also catches the linocut "7/12" edition-of-N form.
const ED_HASH=/^(.*\S)\s+#\s*(\d+)$/;
const ED_SLASH=/^(.*\S)\s+(\d+)\s*\/\s*(\d+)$/;
function artworkOf(p){
 const name=String(p.name||"").trim();
 let m=name.match(ED_HASH);
 if(m) return { artwork:m[1], edition:m[2], num:parseInt(m[2],10), of:null };
 m=name.match(ED_SLASH);
 if(m) return { artwork:m[1], edition:`${m[2]}/${m[3]}`, num:parseInt(m[2],10), of:parseInt(m[3],10) };
 return null; // single-edition artwork: the row IS the artwork
}
// Group a flat print list into artwork groups + singles, preserving order.
function groupList(list){
 const out=[], byKey=new Map();
 for(const p of list){
  const a=state.group?artworkOf(p):null;
  if(!a){ out.push({kind:"single",p,name:p.name,editions:[p]}); continue; }
  const key=normStr(a.artwork)+"|"+(p.category||"");
  let g=byKey.get(key);
  if(!g){ g={kind:"artwork",name:a.artwork,editions:[],nums:[],of:null}; byKey.set(key,g); out.push(g); }
  g.editions.push(p); p._ed=a.edition; p._edNum=a.num;
  if(a.num) g.nums.push(a.num);
  if(a.of) g.of=Math.max(g.of||0,a.of);
 }
 // A "group" of one is just a single — don't badge "1 edition".
 return out.map(g=>(g.kind==="artwork"&&g.editions.length===1)?{kind:"single",p:g.editions[0],name:g.editions[0].name,editions:g.editions}:g)
  .map(g=>{ if(g.kind==="artwork"){ g.editions.sort((a,b)=>(a._edNum||0)-(b._edNum||0)); g.sold=soldGaps(g); } return g; });
}
// SOLD-OUT GAPS (Michael: "absolutely" surface these).
// The shop DELETES a variant when that edition sells, so the gaps in the surviving numbers are the
// sold ones: ginkgo ships #1-#6,#8-#11,#13 -> #7 and #12 are gone. That's per-edition rarity for free.
// LIMITATION, stated rather than hidden: without an explicit edition-count field we can only see gaps
// BELOW the highest surviving number. If the top edition sold, the run just looks shorter. An
// `edition_of` column (parseable from body_html: "#1 & #3 are 3x4, the rest 6x6" era listings often
// state the run) or the `/N` form fixes that; the `x/N` linocuts already give us `of` exactly.
function soldGaps(g){
 const nums=g.nums.filter(n=>Number.isFinite(n));
 if(nums.length<2) return [];
 const top=g.of||Math.max(...nums);
 const have=new Set(nums), gaps=[];
 for(let i=1;i<=top;i++) if(!have.has(i)) gaps.push(i);
 return gaps;
}
function groupKey(g){ return g.kind==="artwork" ? "art:"+normStr(g.name)+"|"+(g.editions[0].category||"") : (g.p.print_id||g.p.name); }
function findGroup(key){
 if(!String(key).startsWith("art:")) return null;
 const owned=ownedSet();
 return visibleGroups().find(g=>g.kind==="artwork"&&groupKey(g)===key)||null;
}
function visibleGroups(){
 let list=(CATALOG.prints||[]).filter(p=>(state.cat==="all"||p.category===state.cat)&&matchQ(p,state.q));
 if(state.ebayOnly) list=list.filter(p=>marketFor(MARKET,p));
 list.sort((a,b)=>(!!b.image-!!a.image)||a.name.localeCompare(b.name,undefined,{numeric:true,sensitivity:"base"}));
 return groupList(list);
}

/* ---- controls ---- */
function buildChips(){
 const prints=CATALOG.prints||[]; const counts={}; prints.forEach(p=>counts[p.category]=(counts[p.category]||0)+1);
 const cats=CAT_ORDER.filter(c=>counts[c]);
 if(state.cat!=="all" && !counts[state.cat]) state.cat="all"; // seed data / empty category -> don't open on nothing
 const chips=[`<button class="chip" data-cat="all" aria-pressed="${state.cat==="all"}">All <span class="cnt">${prints.length}</span></button>`]
  .concat(cats.map(c=>`<button class="chip" data-cat="${c}" aria-pressed="${state.cat===c}">${CAT_LABELS[c]||c} <span class="cnt">${counts[c]}</span></button>`));
 $("catChips").innerHTML=chips.join("");
 $("catChips").querySelectorAll(".chip").forEach(ch=>ch.addEventListener("click",()=>{ state.cat=ch.dataset.cat; $("catChips").querySelectorAll(".chip").forEach(x=>x.setAttribute("aria-pressed",String(x===ch))); render(); }));
}
function wireControls(){
 const s=$("search"), bar=$("searchbar");
 s.addEventListener("input",()=>{ state.q=s.value; bar.classList.toggle("has-val",!!state.q); render(); });
 $("searchClr").addEventListener("click",()=>{ s.value=""; state.q=""; bar.classList.remove("has-val"); s.focus(); render(); });
 const t=$("ebayToggle"); t.addEventListener("click",()=>{ state.ebayOnly=!state.ebayOnly; t.setAttribute("aria-pressed",String(state.ebayOnly)); render(); });
 const g=$("groupToggle"); if(g) g.addEventListener("click",()=>{ state.group=!state.group; g.setAttribute("aria-pressed",String(state.group)); render(); });
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
 // artworks = distinct artwork groups across the WHOLE catalog, so the number is stable regardless of filter
 const artworks=new Set(prints.map(p=>{ const a=artworkOf(p); return (a?normStr(a.artwork):normStr(p.name))+"|"+(p.category||""); })).size;
 $("strip").innerHTML=`
  <div class="s"><div class="v">${artworks}</div><div class="l">Artworks</div></div>
  <div class="s"><div class="v">${prints.length}</div><div class="l">Editions</div></div>
  <div class="s"><div class="v up">${own}</div><div class="l">You own</div></div>
  <div class="s"><div class="v plum">${excl}</div><div class="l">Exclusives</div></div>
  <div class="s"><div class="v up">${onEbay}</div><div class="l">On eBay now</div></div>`;
}
function matchQ(p,q){ if(!q) return true; const hay=normStr(p.name+" "+(p.aliases||[]).join(" ")+" "+(p.category||"")+" "+(p.exclusive||"")); return hay.includes(normStr(q)); }
function render(){
 const owned=ownedSet();
 const groups=visibleGroups();
 const total=(CATALOG.prints||[]).length;
 const eds=groups.reduce((n,g)=>n+g.editions.length,0);
 $("countLine").innerHTML=`Showing <b>${groups.length}</b> ${state.group?"artwork"+(groups.length===1?"":"s"):"prints"}`
  + (state.group&&eds!==groups.length?` \u00b7 ${eds} editions`:"")
  + ` of ${total}${state.cat!=="all"?" \u00b7 "+(CAT_LABELS[state.cat]||state.cat):""}${fromD1?"":" \u00b7 seed (connect Worker for live catalog)"}`;
 const grid=$("grid");
 if(!groups.length){ grid.innerHTML=`<div class="empty" style="grid-column:1/-1"><h3>No prints match</h3><p>Try a different search or clear the filters.</p></div>`; return; }
 grid.innerHTML=groups.map((g,i)=>cardHTML(g,i,owned)).join("");
 grid.querySelectorAll(".card").forEach((el,i)=>{
  el.addEventListener("click",()=>openDetail(el.dataset.key));
  // wireImg owns the load/error lifecycle (app-core). The pre-v16 handler retried the SAME url with
  // a cache-bust, re-downloading the multi-MB file that had just failed, then hid the card on the
  // second miss. A retry must move DOWN the ladder to a different source.
  wireImg(el.querySelector("img"), imgLadder(groups[i].editions[0], 360));
 });
}
function phStyle(cat){ const h=THUMB_HUE[cat]||72; return `background:oklch(30% 0.05 ${h});color:oklch(80% 0.11 ${h})`; }
function cardHTML(g,i,owned){
 // The card face is the artwork's first edition (or the single print). Editions live in the drawer.
 const p=g.editions[0];
 const m=marketFor(MARKET,p);
 const isArt=g.kind==="artwork";
 const ownedCount=g.editions.filter(x=>isOwned(x,owned)).length;
 // thumbSrc, NOT p.image: p.image is the R2 ARCHIVAL original (1-3MB here). See the Image
 // Rendering Law in app-core.js — a grid never paints an original.
 //
 // ⚠️ INLINE opacity:1 IS LOAD-BEARING, NOT REDUNDANT (2026-07-25).
 // v18 removed an `opacity:0` gate from catalog.css that was hiding every grid image until JS
 // added a class. The fix was correct but it shipped in a STYLESHEET, and a stylesheet can be
 // served stale from cache while the HTML and JS around it are fresh — so the bug appeared to
 // survive its own fix. An inline style beats any cached stylesheet rule.
 const img=p.image?`<img src="${esc(thumbSrc(p,360))}" alt="${esc(g.name)}" loading="lazy" decoding="async" style="opacity:1;position:relative;z-index:1">`:"";
 // Initials render ALWAYS, behind the image. A featureless box makes "failed to load" and
 // "nothing to load" indistinguishable — the ambiguity that sent three rounds of diagnosis to the
 // wrong layer. See Image Rendering Law rule 7.
 const ph=`<div class="ph" style="${phStyle(p.category)}">${initials(g.name)}</div>`;
 const price=p.retail!=null?money0(p.retail):"\u2014";
 return `<button class="card${isArt?" is-art":""}" data-key="${esc(groupKey(g))}" style="--i:${i}">
   <div class="frame">${ph}${img}
     ${isArt?`<span class="edcount">${g.editions.length} editions</span>`:""}
     ${p.exclusive?`<span class="excl">${EXCL_LABEL[p.exclusive]||p.exclusive}</span>`:""}
     ${m?`<span class="mkt">${m.count} on eBay</span>`:""}
     ${ownedCount?`<span class="owned">${isArt&&ownedCount>1?ownedCount+" owned":"Owned"}</span>`:""}</div>
   <div class="body"><div class="nm">${esc(g.name)}</div>
     <div class="rl"><span class="cat">${CAT_LABELS[p.category]||p.category||""}</span><span>${price}</span></div>
     ${isArt&&g.sold&&g.sold.length?`<div class="soldline">#${g.sold.join(", #")} sold</div>`:""}
   </div>
  </button>`;
}

/* ---- detail + image lifecycle ---- */
function findPrint(key){ const prints=CATALOG.prints||[]; return prints.find(p=>p.print_id===key)||prints.find(p=>normStr(p.name)===normStr(key)); }
function catOpts(sel){ return Object.keys(CAT_EDIT).map(k=>`<option value="${k}"${k===sel?" selected":""}>${CAT_EDIT[k]}</option>`).join(""); }

// Edition strip: the "tag" half of Michael's ask. Every surviving edition is a chip; the sold ones
// render as struck-through ghosts so the run reads as a complete story ("#7 is gone") instead of a
// silently shorter list. Tapping a chip re-opens the drawer on THAT edition — separate rows, separate
// photos, separate ownership, one artwork.
function editionStrip(g, currentId){
 if(!g || g.kind!=="artwork") return "";
 const chips=g.editions.map(e=>`<button class="edchip${e.print_id===currentId?" on":""}" data-ed="${esc(e.print_id||e.name)}">#${esc(e._ed||"?")}</button>`).join("");
 const sold=(g.sold||[]).map(n=>`<span class="edchip gone" title="sold — no longer listed">#${n}</span>`).join("");
 return `<div class="dt-sec">Editions \u00b7 ${g.editions.length} available${(g.sold||[]).length?` \u00b7 ${g.sold.length} sold`:""}</div>
  <div class="edstrip">${chips}${sold}</div>
  <p class="ed-hint">Each edition is its own catalogued print with its own photo — one-of-a-kind runs are genuinely different objects. Struck-through numbers are gone from the shop.</p>`;
}

function openDetail(key){
 // Two kinds of key: an artwork group ("art:...") opens on its first edition; a print_id opens that row.
 let g=findGroup(key), p;
 if(g){ p=g.editions[0]; }
 else { p=findPrint(key); if(!p) return; g=visibleGroups().find(x=>x.kind==="artwork"&&x.editions.some(e=>e.print_id===p.print_id))||null; }
 renderDetail(p,g);
}
function renderDetail(p,g){
 openPid=p.print_id||null;
 const m=marketFor(MARKET,p);
 const heading=g?g.name:p.name;
 const edTag=g&&p._ed?`<span class="chip plum">Edition #${esc(p._ed)}</span>`:"";
 // The hero is the one place the archival original is the right answer (single image, on demand).
 const hero=p.image?`<img src="${esc(heroSrc(p,1200))}" alt="${esc(p.name)}" decoding="async">`:`<div class="ph" style="${phStyle(p.category)}">${initials(heading)}</div>`;
 const facts=[["Retail",p.retail!=null?money(p.retail):"\u2014",false],["Category",CAT_LABELS[p.category]||p.category||"\u2014",false],p.exclusive?["Series",EXCL_LABEL[p.exclusive]||p.exclusive,false]:null,["In print",p.available?"Yes":"Retired / sold out",false],m?["Live on eBay",m.count+" listing"+(m.count>1?"s":""),true]:["Live on eBay","Not listed",false],m&&m.low!=null?["Market low",money(m.low),true]:null].filter(Boolean)
  .map(([k,v,up])=>`<div class="dt-fact"><span class="k">${k}</span><span class="v${up?" up":""}">${esc(v)}</span></div>`).join("");
 const ebayUrl=`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent("anastasia inciardi "+heading)}`;
 $("detailInner").innerHTML=`
  <div class="dt-hero">${hero}<button class="dt-close" id="dtClose"><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>
  <div class="dt-body">
   <div class="dt-title-row"><h2 id="dtName">${esc(heading)}</h2><button class="dt-edit write-only" id="dtEditBtn" aria-label="Edit name"><svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button></div>
   <form class="dt-edit-form" id="dtEditForm" hidden>
     <div class="field"><label>Print name${g?" (this edition only)":""}</label><input id="ed-name" value="${esc(p.name)}" spellcheck="false"></div>
     <div class="row2">
       <div class="field"><label>Category</label><select id="ed-cat">${catOpts(p.category)}</select></div>
       <div class="field"><label>Retail ($)</label><input id="ed-retail" type="number" step="0.01" value="${p.retail!=null?p.retail:""}"></div>
     </div>
     <div class="ed-row"><button type="button" class="btn primary sm" id="ed-save">Save &amp; lock</button><button type="button" class="btn ghost sm" id="ed-cancel">Cancel</button></div>
     <p class="ed-hint">Locks this print so the nightly shop sync keeps your title instead of overwriting it. The old name is kept as a search alias so eBay matching still works.${g?" Keep the trailing #"+esc(p._ed||"N")+" to keep it grouped under this artwork.":""}</p>
   </form>
   <div class="dt-tags"><span class="chip">${CAT_LABELS[p.category]||p.category||""}</span>${edTag}${p.exclusive?`<span class="chip plum">${EXCL_LABEL[p.exclusive]||p.exclusive}</span>`:""}${m?`<span class="chip up">On eBay now</span>`:""}</div>
   <div class="dt-facts">${facts}</div>
   ${staleRetailNote(p)}
   ${editionStrip(g,p.print_id)}
   <div id="imgMgr"></div>
   <div class="dt-actions">
    <a class="btn" href="${ebayUrl}" target="_blank" rel="noopener">Find on eBay</a>
    <button class="btn write-only" id="dtAddOwn">+ I own ${g&&p._ed?"#"+esc(p._ed):"this"}</button>
   </div>
  </div>`;
 $("dtClose").addEventListener("click",()=>$("detail").close());
 wireImg($("detailInner").querySelector(".dt-hero img"), heroLadder(p,1200));
 // edition chips: swap the drawer to that edition in place (no close/reopen, keeps scroll intent)
 $("detailInner").querySelectorAll(".edchip[data-ed]").forEach(b=>b.addEventListener("click",()=>{
  const e=(g.editions||[]).find(x=>(x.print_id||x.name)===b.dataset.ed); if(e) renderDetail(e,g);
 }));
 const own=$("dtAddOwn"); if(own) own.addEventListener("click",()=>addOwned(p));
 const eb=$("dtEditBtn"); if(eb) eb.addEventListener("click",()=>{ const f=$("dtEditForm"); f.hidden=!f.hidden; if(!f.hidden){ $("ed-name").focus(); $("ed-name").select(); } });
 const esv=$("ed-save"); if(esv) esv.addEventListener("click",()=>saveEdit(p));
 const ecx=$("ed-cancel"); if(ecx) ecx.addEventListener("click",()=>{ $("dtEditForm").hidden=true; });
 const fx=$("fixRetail"); if(fx) fx.addEventListener("click",()=>fixStaleRetail(p));
 document.body.classList.toggle("can-write",canWrite());
 renderImgMgr(p);
 if(!$("detail").open) $("detail").showModal();
}

// A retail under $1 is always the fingerprint of the pre-2026-07-25 `/100` harvest bug (no Inciardi
// print has ever cost cents). The nightly harvest CANNOT repair these on its own: it only sees
// products currently published on the shop, so a retired/sold-out print is never revisited and keeps
// its wrong value forever. Surface it with a one-tap repair instead of leaving a silent bad number,
// and note WHY it can't self-heal so nobody waits on a cron that will never touch it.
function isStaleRetail(p){ return p.retail!=null && p.retail > 0 && p.retail < 1; }
function staleRetailNote(p){
 if(!isStaleRetail(p)) return "";
 const real=Math.round(p.retail*100);
 return `<div class="dedupe-warn">Retail looks off by 100x — almost certainly <b>$${real}</b>, stored before the price fix. This print is retired, so the nightly shop sync can't correct it (it only reads products still listed).<span class="write-only" style="display:block;margin-top:10px"><button class="btn sm primary" id="fixRetail">Set to $${real} &amp; lock</button></span></div>`;
}
async function fixStaleRetail(p){
 if(!canWrite()){ toast("sign in first",true); return; }
 const real=Math.round(p.retail*100);
 try{
  toast("fixing\u2026");
  // Full row back: the worker upsert clobbers every field on conflict. locked:1 so it sticks.
  await apiPost("/catalog",{ print_id:p.print_id, title:p.name, category:p.category, exclusive:p.exclusive||null, retail:real, in_print:p.available?1:0, pack_of:p.packOf??null, pack_from:p.packFrom??null, aliases:p.aliases||[], notes:p.notes??null, source:p.source||"manual", locked:1 });
  toast(`retail set to $${real}`);
  await refreshCatalog(p.print_id);
 }catch(e){ toast(e.message,true); }
}

// Rename / re-categorize a catalogued print. Sends the FULL row back (the worker upsert clobbers every
// field on conflict) + locked:1 so the nightly harvest treats the edit as source of truth. Old name folds
// into aliases so the eBay market match survives the rename.
async function saveEdit(p){
 if(!canWrite()){ toast("add your write key in Settings first",true); return; }
 const name=$("ed-name").value.trim(); if(!name){ toast("name can't be empty",true); return; }
 const category=$("ed-cat").value;
 const retail=$("ed-retail").value!==""?Number($("ed-retail").value):null;
 const aliases=(p.aliases||[]).slice();
 const oldn=normStr(p.name);
 if(oldn && normStr(name)!==oldn && !aliases.some(a=>normStr(a)===oldn)) aliases.push(p.name);
 try{
  toast("saving\u2026");
  const r=await apiPost("/catalog",{ print_id:p.print_id||undefined, title:name, category, exclusive:p.exclusive||null, retail, in_print:p.available?1:0, pack_of:p.packOf??null, pack_from:p.packFrom??null, aliases, notes:p.notes??null, source:p.source||"manual", locked:1 });
  toast("saved & locked");
  await refreshCatalog(r.print_id||p.print_id);
 }catch(e){ toast(e.message,true); }
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
 // Same law as the grid: these are ~82px chips, so they get a derivative, never the original.
 const thumb=(i)=>`<div class="thumb ${i.is_primary?"primary":""} ${i.status==="archived"?"arch":""}">${i.url?`<img src="${esc(imageThumb(i,200))}" alt="" loading="lazy" decoding="async">`:""}${i.is_primary?`<span class="badge">Main</span>`:""}<div class="thumb-acts">${i.status==="active"?(i.is_primary?"":`<button data-op="primary" data-id="${i.image_id}">Set</button>`)+`<button data-op="archive" data-id="${i.image_id}">Arch</button>`:`<button data-op="restore" data-id="${i.image_id}">Restore</button><button data-op="delete" data-id="${i.image_id}">Del</button>`}</div></div>`;
 const seedUrl = p.image && /^https?:/.test(p.image) && p.image.includes("cdn.shopify.com") ? p.image : (p._srcUrl||"");
 box.innerHTML=`
  <div class="dt-sec">Images \u00b7 ${active.length} active${arch.length?` \u00b7 ${arch.length} archived`:""}</div>
  <div class="thumbs">${active.map(thumb).join("")||`<span style="font-size:0.82rem;color:var(--ink-faint)">No images stored yet.</span>`}</div>
  ${arch.length?`<div class="thumbs">${arch.map(thumb).join("")}</div>`:""}
  <div class="img-actions">
   <label class="btn sm"><input type="file" accept="image/*" id="upIn" hidden>Upload photo</label>
   ${seedUrl?`<button class="btn sm" id="scrubBtn">Scrub &amp; store original</button>`:""}
  </div>`;
 const ordered=imgs.filter(x=>x.status==="active").concat(imgs.filter(x=>x.status==="archived"));
 box.querySelectorAll(".thumbs img").forEach((im,n)=>wireImg(im, imageLadder(ordered[n], 200)));
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
