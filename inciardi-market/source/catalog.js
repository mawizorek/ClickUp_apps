/* Inciardi Catalog — gallery page logic. Reads catalog.json + cross-refs the live market feed. */
const CAT_LABELS = { mini:"Minis", pack:"Packs", "big-riso":"Big Risographs", linocut:"Linocuts", exclusive:"Exclusives" };
const EXCL_LABEL = { nyc:"NYC", lacma:"LACMA", holiday:"Holiday", "grand-central":"Grand Central", "richard-scarry":"Richard Scarry" };
const CAT_ORDER = ["mini","big-riso","linocut","exclusive","pack"];
const THUMB_HUE = { mini:72, pack:205, exclusive:305, "big-riso":152, linocut:40 };
const WORKER_EP = "https://inciardi-market.mawizorek-online.workers.dev/market";
// Images route through the Worker's same-origin /img proxy (edge-cached), never
// hotlinked straight from Shopify's CDN. That direct hotlink was the flash-then-
// vanish bug: 30+ concurrent cross-origin hits flaked on mobile.
const IMG_EP = "https://inciardi-market.mawizorek-online.workers.dev/img";

const $ = (id) => document.getElementById(id);
let CATALOG = null, MARKET = null;
let state = { q:"", cat:"all", ebayOnly:false };

/* ---- theme (shared key with market view) ---- */
const themeToggle = $("themeToggle");
function initTheme(){ if (localStorage.getItem("inciardi_theme")==="light"){ document.documentElement.dataset.theme="light"; themeToggle.setAttribute("aria-pressed","false"); } else { themeToggle.setAttribute("aria-pressed","true"); } }
function toggleTheme(){ const isLight = document.documentElement.dataset.theme==="light";
 if(isLight){ delete document.documentElement.dataset.theme; localStorage.setItem("inciardi_theme","dark"); themeToggle.setAttribute("aria-pressed","true"); }
 else { document.documentElement.dataset.theme="light"; localStorage.setItem("inciardi_theme","light"); themeToggle.setAttribute("aria-pressed","false"); } }
initTheme();

/* ---- settings drawer ---- */
const gear = $("gear"), drawer = $("drawer");
gear.addEventListener("click", () => { drawer.showModal(); gear.setAttribute("aria-expanded","true"); });
$("drawerClose").addEventListener("click", () => drawer.close());
drawer.addEventListener("click", (e) => { if (e.target === drawer) drawer.close(); });
drawer.addEventListener("close", () => gear.setAttribute("aria-expanded","false"));
themeToggle.addEventListener("click", toggleTheme);

/* ---- detail dialog ---- */
const detail = $("detail");
$("dtClose").addEventListener("click", () => detail.close());
detail.addEventListener("click", (e) => { if (e.target === detail) detail.close(); });

/* ---- boot ---- */
showSkeletons();
load();

async function load(){
 CATALOG = await grab("./catalog.json", { prints:[], machines:[] });
 const ep = (localStorage.getItem("inciardi_ep") || "").trim() || WORKER_EP;
 MARKET = await grab(ep, { listings:[], source:"none" });
 buildChips(); renderStrip(); render();
 $("f-stamp").textContent = liveMarket() ? "market: live \u00b7 eBay" : "market: sample";
}
async function grab(src, fallback){
 try { const r = await fetch(src, { headers:{ Accept:"application/json" } }); if(!r.ok) throw 0; const d = await r.json(); if(d.error) throw 0; return d; }
 catch { return fallback; }
}
function liveMarket(){ return MARKET && MARKET.source === "ebay-browse"; }

/* ---- market cross-reference ---- */
function norm(s){ return String(s||"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim(); }
function marketFor(p){
 if(!MARKET || !MARKET.listings) return null;
 const names = [norm(p.name), ...((p.aliases||[]).map(norm))];
 const ls = MARKET.listings.filter(l => { if(l.status==="gone") return false; const n = l.print && l.print.matched && norm(l.print.name); return n && names.includes(n); });
 if(!ls.length) return null;
 const prices = ls.map(l => l.landed).filter(x => x!=null);
 return { count: ls.length, low: prices.length?Math.min(...prices):null };
}

/* ---- controls ---- */
function buildChips(){
 const prints = CATALOG.prints || [];
 const counts = {}; prints.forEach(p => counts[p.category] = (counts[p.category]||0)+1);
 const cats = CAT_ORDER.filter(c => counts[c]);
 const chips = [`<button class="chip" data-cat="all" aria-pressed="true">All <span class="cnt">${prints.length}</span></button>`]
  .concat(cats.map(c => `<button class="chip" data-cat="${c}" aria-pressed="false">${CAT_LABELS[c]||c} <span class="cnt">${counts[c]}</span></button>`));
 $("catChips").innerHTML = chips.join("");
 $("catChips").querySelectorAll(".chip").forEach(ch => ch.addEventListener("click", () => {
  state.cat = ch.dataset.cat;
  $("catChips").querySelectorAll(".chip").forEach(x => x.setAttribute("aria-pressed", String(x===ch)));
  render();
 }));
}
const searchEl = $("search"), searchbar = $("searchbar");
searchEl.addEventListener("input", () => { state.q = searchEl.value; searchbar.classList.toggle("has-val", !!state.q); render(); });
$("searchClr").addEventListener("click", () => { searchEl.value=""; state.q=""; searchbar.classList.remove("has-val"); searchEl.focus(); render(); });
const ebayToggle = $("ebayToggle");
ebayToggle.addEventListener("click", () => { state.ebayOnly = !state.ebayOnly; ebayToggle.setAttribute("aria-pressed", String(state.ebayOnly)); render(); });
document.addEventListener("keydown", (e) => {
 if(e.key==="Escape"){ if(detail.open) detail.close(); else if(drawer.open) drawer.close(); }
});

/* ---- render ---- */
function renderStrip(){
 const prints = CATALOG.prints || [];
 const withImg = prints.filter(p => p.image).length;
 const excl = prints.filter(p => p.exclusive).length;
 const onEbay = prints.filter(p => marketFor(p)).length;
 $("strip").innerHTML = `
  <div class="s"><div class="v">${prints.length}</div><div class="l">Catalogued</div></div>
  <div class="s"><div class="v accent">${withImg}</div><div class="l">With image</div></div>
  <div class="s"><div class="v">${excl}</div><div class="l">Exclusives</div></div>
  <div class="s"><div class="v up">${onEbay}</div><div class="l">On eBay now</div></div>`;
}
function matchQ(p, q){ if(!q) return true; const hay = norm(p.name+" "+(p.aliases||[]).join(" ")+" "+(p.category||"")+" "+(p.exclusive||"")); return hay.includes(norm(q)); }
function render(){
 const prints = (CATALOG.prints || []).slice();
 let list = prints.filter(p => (state.cat==="all"||p.category===state.cat) && matchQ(p, state.q));
 if(state.ebayOnly) list = list.filter(p => marketFor(p));
 list.sort((a,b) => (!!b.image - !!a.image) || a.name.localeCompare(b.name));
 const grid = $("grid");
 const total = (CATALOG.prints||[]).length;
 $("countLine").innerHTML = `Showing <b>${list.length}</b> of ${total} prints${state.cat!=="all"?` \u00b7 ${CAT_LABELS[state.cat]||state.cat}`:""}${state.ebayOnly?` \u00b7 on eBay now`:""}`;
 if(!list.length){
  grid.innerHTML = `<div class="empty"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg><h3>No prints match</h3><p>Try a different search or clear the filters to see the full universe.</p></div>`;
  return;
 }
 grid.innerHTML = list.map((p, i) => cardHTML(p, i)).join("");
 grid.querySelectorAll(".card").forEach(el => {
  el.addEventListener("click", () => openDetail(el.dataset.name));
  const img = el.querySelector("img");
  if(img){
   if(img.complete && img.naturalWidth) img.classList.add("loaded");
   else img.addEventListener("load", () => img.classList.add("loaded"));
   // Retry once with a cache-bust before giving up. A single flaky fetch used to
   // hard-hide the image for the whole session (the flash-then-vanish bug).
   img.addEventListener("error", () => {
    if(img.dataset.retried){ img.style.display="none"; return; }
    img.dataset.retried = "1";
    img.src = img.src + (img.src.includes("?") ? "&" : "?") + "r=" + Date.now();
   });
  }
 });
}
function thumb(url, w){ if(!url) return null; return `${IMG_EP}?u=${encodeURIComponent(url)}&w=${w}`; }
function initials(name){ return String(name||"?").split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase(); }
function phStyle(cat){ const h = THUMB_HUE[cat]||72; return `background:oklch(30% 0.05 ${h});color:oklch(80% 0.11 ${h})`; }
function cardHTML(p, i){
 const m = marketFor(p);
 const img = p.image ? `<img src="${thumb(p.image,360)}" alt="${esc(p.name)}" loading="lazy" decoding="async">` : "";
 const ph = `<div class="ph" style="${phStyle(p.category)}">${p.image?"":initials(p.name)}</div>`;
 const mkt = m ? `<span class="mkt">${m.count} on eBay</span>` : "";
 const excl = p.exclusive ? `<span class="excl">${EXCL_LABEL[p.exclusive]||p.exclusive}</span>` : "";
 return `<button class="card" data-name="${esc(p.name)}" style="--i:${i}">
   <div class="frame">${ph}${img}${excl}${mkt}</div>
   <div class="body">
    <div class="nm">${esc(p.name)}</div>
    <div class="rl"><span class="cat">${CAT_LABELS[p.category]||p.category||""}</span><span>${p.retail!=null?"$"+p.retail:"\u2014"}</span></div>
   </div>
  </button>`;
}

/* ---- detail ---- */
function openDetail(name){
 const p = (CATALOG.prints||[]).find(x => x.name === name); if(!p) return;
 const m = marketFor(p);
 const big = p.image ? `<img src="${thumb(p.image,900)}" alt="${esc(p.name)}">` : `<div class="ph" style="${phStyle(p.category)}">${initials(p.name)}</div>`;
 const tags = [
  `<span class="dt-tag">${CAT_LABELS[p.category]||p.category||""}</span>`,
  p.exclusive ? `<span class="dt-tag excl">${EXCL_LABEL[p.exclusive]||p.exclusive}</span>` : "",
  m ? `<span class="dt-tag mkt">On eBay now</span>` : ""
 ].join("");
 const facts = [
  ["Retail", p.retail!=null ? "$"+p.retail : "\u2014", false],
  ["Category", CAT_LABELS[p.category]||p.category||"\u2014", false],
  p.exclusive ? ["Series", EXCL_LABEL[p.exclusive]||p.exclusive, false] : null,
  ["In print", p.available===false ? "Sold out / retired" : p.available===true ? "Yes" : "\u2014", false],
  m ? ["Live on eBay", `${m.count} listing${m.count>1?"s":""}`, true] : ["Live on eBay", "Not listed", false],
  m && m.low!=null ? ["Market low", "$"+m.low.toFixed(2), true] : null
 ].filter(Boolean).map(([k,v,up]) => `<div class="dt-fact"><span class="k">${k}</span><span class="v${up?" up":""}">${esc(v)}</span></div>`).join("");
 const contents = (p.contents && p.contents.length) ? `<div class="dt-section-h">In this pack (${p.packOf?p.packOf+" of "+(p.packFrom||p.contents.length):p.contents.length})</div><div class="dt-contents">${p.contents.map(c => `<span>${esc(c)}</span>`).join("")}</div>` : "";
 const ebayUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent("anastasia inciardi "+p.name)}`;
 const shopMsg = p.available===false ? "View on eBay" : "Find it";
 $("dtInner").innerHTML = `
  <div class="dt-frame">${big}</div>
  <div class="dt-body">
   <h2>${esc(p.name)}</h2>
   <div class="dt-tags">${tags}</div>
   <div class="dt-facts">${facts}</div>
   ${contents}
   <div class="dt-actions">
    <a class="dt-btn primary" href="${ebayUrl}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>${shopMsg}</a>
    <a class="dt-btn ghost" href="https://inciardiprints.com" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>Shop</a>
   </div>
   <div class="dt-src">Source: ${esc(p.source||"catalog")}${(p.aliases&&p.aliases.length)?` \u00b7 also listed as: ${p.aliases.map(esc).join(", ")}`:""}. ${p.image?"Reference image: Anastasia's store CDN.":"No reference image sourced yet."}</div>
  </div>`;
 detail.showModal();
}

/* ---- skeleton + utils ---- */
function showSkeletons(){
 $("grid").innerHTML = Array.from({length:10}).map(() => `<div class="skeleton"><div class="sk-frame"></div><div class="sk-line"></div><div class="sk-line short"></div></div>`).join("");
}
function esc(s){ return String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
