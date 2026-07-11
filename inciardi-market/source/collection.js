/* Inciardi Collection — print-registry logic.
   Local-first: your caught/wanted inventory lives in localStorage. The sync key is stored for when a
   shared-DB write endpoint ships; the worker currently serves only GET /market (no write path yet),
   so state is honestly reported as local-only. Reads catalog from the shared catalog.json when present,
   falling back to a bundled seed so the page always renders. */
const APP_NAME = "Inciardi Collection";
const APP_VERSION = "v0.9";
const APP_PR = 153;
const WORKER = "https://inciardi-market.mawizorek-online.workers.dev";
const WKEY_KEY = "inciardi-write-key";
const INV_KEY = "inciardi-deck-v1";
const THEME_KEY = "inciardi_theme"; // shared across all three pages
const CATALOG_URL = "./catalog.json";

const SVG = {
 check: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
 bookmark: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M6 2a2 2 0 0 0-2 2v18l8-5 8 5V4a2 2 0 0 0-2-2z"/></svg>',
 tag: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1.5"/></svg>',
 deal: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>',
 search: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
};

/* ---- catalog seed (used until catalog.json loads; also the naming spine) ---- */
const RAW = [["Negroni","mini",null,6,"food"],["Milk","mini",null,6,"food"],["Olive","mini",null,6,"food"],["Strawberry","mini",null,6,"food"],["Jam","mini",null,6,"food"],["Cornichon","mini",null,6,"food"],["Macaroni","mini",null,6,"food"],["Bird's Eye Chili","mini",null,6,"food"],["Clementine","mini",null,6,"food"],["Tinned Fish","mini",null,6,"food"],["Cheese #1","mini",null,6,"food"],["Cheese #2","mini",null,6,"food"],["Goldfish","mini",null,6,"food"],["Cheez-It","mini",null,6,"food"],["You & Me Conversation Heart","mini",null,6,"holiday"],["Mystery Pack","pack",null,18,"other"],["MetroCard","big-riso",null,20,"transit"],["Evening on the B Train","big-riso",null,20,"transit"],["On The Road","big-riso",null,20,"transit"],["Jello","big-riso",null,20,"food"],["Rainbow Swiss Chard","big-riso",null,20,"food"],["Grand Central Terminal Ceiling","big-riso",null,22,"place"],["Grand Central Terminal Clock","big-riso",null,22,"place"],["Rainbow Cookie","linocut",null,15,"food"],["Mini PBR Can","linocut",null,15,"food"],["Camp Coffee","linocut",null,15,"food"],["Hot Dog","linocut",null,15,"food"],["Cento Tomato Can","linocut",null,15,"food"],["Garlic Scapes","linocut",null,15,"food"],["Grand Central","exclusive","nyc",null,"place"],["Holiday Edition","exclusive","holiday",null,"holiday"],["Monet's Flowers","exclusive","lacma",null,"art"],["Pipe","exclusive","lacma",null,"art"],["Lamp Post","exclusive","lacma",null,"place"],["Lowly Worm","exclusive","richard-scarry",null,"character"],["Pickle Car","exclusive","richard-scarry",null,"character"],["LACMA set","pack","lacma",null,"art"]];

const RARITY_OF = c => c==="exclusive"?"exclusive":c==="pack"?"pack":c==="big-riso"?"big-riso":c==="linocut"?"linocut":"mini";
const RAR_LABEL = { mini:"Mini", linocut:"Linocut", "big-riso":"Big Riso", pack:"Pack", exclusive:"Exclusive" };
const RAR_VAR = { mini:"var(--r-mini)", linocut:"var(--r-linocut)", "big-riso":"var(--r-riso)", pack:"var(--r-pack)", exclusive:"var(--r-excl)" };
const COL_LABEL = { nyc:"NYC", lacma:"LACMA", holiday:"Holiday", "richard-scarry":"Richard Scarry", "grand-central":"Grand Central" };
const SUB_LABEL = { food:"Food", transit:"Transit", place:"Place", art:"Art", character:"Character", holiday:"Holiday", other:"Other" };
const CHIP_HUE = { food:35, transit:205, place:150, art:300, character:86, holiday:15, other:70 };
const RAR_ORDER = ["mini","linocut","big-riso","pack","exclusive"];

const slug = s => String(s||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
function sampleMarket(id){ let h=0; for(const c of id) h=(h*31+c.charCodeAt(0))>>>0; const listed=h%10<4; const deal=listed&&h%10<1; const price=listed?8+(h%22):null; return { listed, deal, price }; }
const IMG_BASE = "./cards/";

function buildPrints(rows){
 return rows.map(([name,cat,excl,retail,subject]) => {
 const id = slug(name);
 return { id, name, category:cat, rarity:RARITY_OF(cat), collection:excl||null, subject:subject||"other", retail, market:sampleMarket(id), img:IMG_BASE+id+".png" };
 });
}
let PRINTS = buildPrints(RAW);

/* ---- state ---- */
const $ = id => document.getElementById(id);
let INV = safeParse(localStorage.getItem(INV_KEY)) || {}; // { id: {own:true?, want:true?} }
const saveInv = () => localStorage.setItem(INV_KEY, JSON.stringify(INV));
let filters = { rarity:new Set(), collection:new Set(), subject:new Set() };
let view = "all", query = "";
let introDone = false;

function safeParse(s){ try { return JSON.parse(s); } catch { return null; } }
function rec(id){ return INV[id] || {}; }
function isOwn(id){ return !!rec(id).own; }
function isWant(id){ return !!rec(id).want; }
function wkey(){ return localStorage.getItem(WKEY_KEY) || ""; }

/* ---- theme (shared key) ---- */
function initTheme(){
 const t = localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
 document.documentElement.setAttribute("data-theme", t);
 syncThemeButtons(t);
}
function setTheme(t){ document.documentElement.setAttribute("data-theme", t); localStorage.setItem(THEME_KEY, t); syncThemeButtons(t); }
function syncThemeButtons(t){ const d=$("themeDark"), l=$("themeLight"); if(d) d.setAttribute("aria-pressed", String(t==="dark")); if(l) l.setAttribute("aria-pressed", String(t==="light")); }

/* ---- sync status (honest: local-only until a write endpoint exists) ---- */
function setSync(s){
 const label = { local:"local only", syncing:"syncing\u2026", synced:"synced", error:"sync error", nokey:"local only" }[s] || "local only";
 const gd = $("gearDot"); if(gd) gd.setAttribute("data-s", s);
 const fd = $("footSyncDot"); if(fd) fd.setAttribute("data-s", s);
 const fl = $("footSyncLabel"); if(fl) fl.textContent = label;
 const ks = $("keyState");
 if(ks) ks.textContent = wkey() ? "key saved on this device \u00b7 shared sync not live yet" : "no key set \u2014 changes stay on this device";
}

/* ---- boot ---- */
initTheme();
wireChrome();
renderFacets();
render();
stampFooter();
setSync(wkey() ? "nokey" : "local"); // both map to local-only today
loadCatalog();

async function loadCatalog(){
 try {
 const r = await fetch(CATALOG_URL, { headers:{ Accept:"application/json" } });
 if(!r.ok) throw 0;
 const d = await r.json();
 if(d && Array.isArray(d.prints) && d.prints.length){
 PRINTS = d.prints.map(p => {
 const id = slug(p.name);
 const cat = p.category || "mini";
 return { id, name:p.name, category:cat, rarity:RARITY_OF(cat), collection:p.exclusive||null,
 subject:p.subject||"other", retail:(p.retail!=null?p.retail:null), market:sampleMarket(id),
 img:p.image || (IMG_BASE+id+".png") };
 });
 renderFacets(); render();
 }
 } catch { /* keep the bundled seed; page already rendered */ }
}

/* ---- chrome wiring ---- */
function wireChrome(){
 const gear=$("gear"), drawer=$("drawer"), scrim=$("scrim"), rail=$("rail");
 const openDrawer=()=>{ drawer.classList.add("open"); scrim.classList.add("show"); document.body.classList.add("locked"); };
 const closeAll=()=>{ drawer.classList.remove("open"); rail.classList.remove("open"); scrim.classList.remove("show"); document.body.classList.remove("locked"); };
 gear.addEventListener("click", openDrawer);
 $("drawerClose").addEventListener("click", closeAll);
 scrim.addEventListener("click", closeAll);
 $("railToggle").addEventListener("click", ()=>{ rail.classList.add("open"); scrim.classList.add("show"); document.body.classList.add("locked"); });
 const rc=$("railClose"); if(rc) rc.addEventListener("click", closeAll);
 document.addEventListener("keydown", e=>{ if(e.key==="Escape") closeAll(); });

 $("themeDark").addEventListener("click", ()=>setTheme("dark"));
 $("themeLight").addEventListener("click", ()=>setTheme("light"));

 const s=$("search");
 s.addEventListener("input", ()=>{ query=s.value.trim().toLowerCase(); render(); });

 document.querySelectorAll(".view-chip").forEach(c => c.addEventListener("click", ()=>{
 view = c.dataset.view;
 document.querySelectorAll(".view-chip").forEach(x=>x.setAttribute("aria-pressed", String(x===c)));
 render();
 }));

 $("syncSave").addEventListener("click", ()=>{
 const v=$("syncKey").value.trim();
 if(v) localStorage.setItem(WKEY_KEY, v); else localStorage.removeItem(WKEY_KEY);
 setSync(v ? "nokey" : "local");
 });
 $("syncKey").value = wkey();

 document.querySelectorAll("[data-clear]").forEach(b => b.addEventListener("click", ()=>{
 filters[b.dataset.clear].clear(); renderFacets(); render();
 }));
}

/* ---- facets ---- */
function countBy(keyFn, val){ return PRINTS.filter(p => keyFn(p)===val).length; }
function renderFacets(){
 const rar = RAR_ORDER.filter(r => PRINTS.some(p=>p.rarity===r));
 $("facetRarity").innerHTML = rar.map(r => optHTML("rarity", r, RAR_LABEL[r], countBy(p=>p.rarity, r), RAR_VAR[r])).join("");
 const cols = Object.keys(COL_LABEL).filter(c => PRINTS.some(p=>p.collection===c));
 $("facetCollection").innerHTML = cols.map(c => optHTML("collection", c, COL_LABEL[c], PRINTS.filter(p=>p.collection===c).length, null)).join("") || emptyOpt();
 const subs = Object.keys(SUB_LABEL).filter(s => PRINTS.some(p=>p.subject===s));
 $("facetSubject").innerHTML = subs.map(s => optHTML("subject", s, SUB_LABEL[s], countBy(p=>p.subject, s), `oklch(0.72 0.12 ${CHIP_HUE[s]||70})`)).join("");
 document.querySelectorAll(".opt").forEach(o => o.addEventListener("click", ()=>{
 const dim=o.dataset.dim, val=o.dataset.val, set=filters[dim];
 set.has(val) ? set.delete(val) : set.add(val);
 o.setAttribute("aria-pressed", String(set.has(val)));
 render();
 }));
}
function optHTML(dim, val, label, count, dotVar){
 const on = filters[dim].has(val);
 const dot = dotVar ? `<span class="dot" style="background:${dotVar}"></span>` : "";
 return `<div class="opt" data-dim="${dim}" data-val="${esc(val)}" aria-pressed="${on}"><span class="box"></span>${dot}<span>${esc(label)}</span><span class="ct">${count}</span></div>`;
}
function emptyOpt(){ return `<div class="opt" style="opacity:.5;cursor:default"><span>none</span></div>`; }

/* ---- filtering ---- */
function passesView(p){
 if(view==="owned") return isOwn(p.id);
 if(view==="wanted") return isWant(p.id);
 if(view==="missing") return !isOwn(p.id);
 if(view==="listed") return !!(p.market && p.market.listed);
 return true;
}
function passes(p){
 if(!passesView(p)) return false;
 if(query && !p.name.toLowerCase().includes(query)) return false;
 if(filters.rarity.size && !filters.rarity.has(p.rarity)) return false;
 if(filters.collection.size && !filters.collection.has(p.collection)) return false;
 if(filters.subject.size && !filters.subject.has(p.subject)) return false;
 return true;
}

/* ---- render ---- */
function render(){
 const list = PRINTS.filter(passes);
 const deck = $("deck");
 if(!list.length){
 deck.className = "deck";
 deck.innerHTML = `<div class="empty">${SVG.search}<p>No prints match this lens.<br><b>Clear a filter</b> or widen your search.</p></div>`;
 } else {
 deck.className = introDone ? "deck" : "deck intro";
 deck.innerHTML = list.map((p,i) => cardHTML(p,i)).join("");
 wireCards();
 introDone = true;
 }
 updateStats();
 updateShowing(list.length);
 updateTags();
}
function cardHTML(p, i){
 const own = isOwn(p.id) ? 1 : 0, want = isWant(p.id) ? 1 : 0;
 const m = p.market || {};
 const avail = m.listed
 ? `<span class="avail${m.deal?" deal":""}">${m.deal?SVG.deal:""}$${m.price}</span>`
 : "";
 const priceText = m.listed ? `$${m.price}` : (p.retail!=null ? `$${p.retail}` : "\u2014");
 const img = `<img src="${esc(p.img)}" alt="${esc(p.name)}" loading="lazy" onerror="this.style.display='none'">`;
 return `<button class="card" data-id="${esc(p.id)}" data-own="${own}" data-want="${want}" style="--i:${i}">
   <div class="art">${img}<span class="glyph-ph">${initials(p.name)}</span>
    <span class="rar" style="background:${RAR_VAR[p.rarity]}"></span>
    ${avail}
    <span class="caught">${SVG.check}</span>
    <span class="want-flag">${SVG.bookmark}</span>
   </div>
   <div class="own-ring"></div>
   <div class="meta">
    <div class="nm">${esc(p.name)}</div>
    <div class="sub"><span class="col">${RAR_LABEL[p.rarity]||""}</span><span class="price">${priceText}</span></div>
   </div>
  </button>`;
}
function wireCards(){
 document.querySelectorAll(".card").forEach(card => {
 const id = card.dataset.id;
 let lpTimer=null, lpFired=false;
 // desktop: click = catch, shift-click = want
 card.addEventListener("click", e => {
 if(lpFired){ lpFired=false; return; }
 if(e.shiftKey) toggleWant(id, card); else toggleOwn(id, card);
 });
 // touch: long-press = want
 card.addEventListener("touchstart", () => {
 lpFired=false;
 lpTimer=setTimeout(()=>{ lpFired=true; toggleWant(id, card); if(navigator.vibrate) navigator.vibrate(12); }, 450);
 }, { passive:true });
 const cancel=()=>{ if(lpTimer){ clearTimeout(lpTimer); lpTimer=null; } };
 card.addEventListener("touchend", cancel);
 card.addEventListener("touchmove", cancel, { passive:true });
 });
}
function toggleOwn(id, card){
 const r = { ...rec(id) };
 if(r.own) delete r.own; else r.own = true;
 commit(id, r, card);
}
function toggleWant(id, card){
 const r = { ...rec(id) };
 if(r.want) delete r.want; else r.want = true;
 commit(id, r, card);
}
function commit(id, r, card){
 if(Object.keys(r).length) INV[id] = r; else delete INV[id];
 saveInv();
 if(card){ card.dataset.own = isOwn(id)?1:0; card.dataset.want = isWant(id)?1:0; }
 // if the current view is a subset that this card may leave, re-render so it drops out cleanly
 if((view==="owned" && !isOwn(id)) || (view==="wanted" && !isWant(id)) || (view==="missing" && isOwn(id))){
 render();
 } else {
 updateStats(); renderFacets();
 }
}

/* ---- readouts ---- */
function updateStats(){
 const ownN = PRINTS.filter(p=>isOwn(p.id)).length;
 const wantN = PRINTS.filter(p=>isWant(p.id)).length;
 set($("statKnown"), PRINTS.length);
 set($("statOwned"), ownN);
 set($("statWanted"), wantN);
 set($("dataKnown"), PRINTS.length);
}
function updateShowing(n){ const el=$("showing"); if(el) el.innerHTML = `<b>${n}</b> of ${PRINTS.length} records`; }
function updateTags(){
 const tags=[];
 if(view!=="all") tags.push(tag("view", view, cap(view)));
 if(query) tags.push(tag("q", "", `\u201c${esc(query)}\u201d`));
 filters.rarity.forEach(v=>tags.push(tag("rarity", v, RAR_LABEL[v])));
 filters.collection.forEach(v=>tags.push(tag("collection", v, COL_LABEL[v]||v)));
 filters.subject.forEach(v=>tags.push(tag("subject", v, SUB_LABEL[v]||v)));
 const box=$("activeTags"); if(!box) return;
 box.innerHTML = tags.join("");
 box.querySelectorAll("[data-t]").forEach(b => b.addEventListener("click", ()=>{
 const kind=b.dataset.t, val=b.dataset.v;
 if(kind==="view"){ view="all"; document.querySelectorAll(".view-chip").forEach(x=>x.setAttribute("aria-pressed", String(x.dataset.view==="all"))); }
 else if(kind==="q"){ query=""; $("search").value=""; }
 else { filters[kind].delete(val); }
 renderFacets(); render();
 }));
}
function tag(kind, val, label){ return `<span class="tag">${esc(label)}<button data-t="${kind}" data-v="${esc(val)}" aria-label="Remove">\u00d7</button></span>`; }

/* ---- utils ---- */
function stampFooter(){ const el=$("footStamp"); if(el) el.textContent = `${APP_NAME} ${APP_VERSION} \u00b7 PR #${APP_PR}`; }
function initials(name){ return String(name||"?").replace(/[^A-Za-z0-9 ]/g,"").split(/\s+/).slice(0,2).map(w=>w[0]||"").join("").toUpperCase() || "?"; }
function cap(s){ return String(s||"").charAt(0).toUpperCase()+String(s||"").slice(1); }
function set(el, v){ if(el) el.textContent = v; }
function esc(s){ return String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
