/* Inciardi Market — engine. Reads market.json (eBay prices) + catalog.json (master + machines). */

const BUILD = "v6";
const PR = 93; // merged PR that shipped this version

const MARKET_FALLBACK = { version:"sample", source:"sample", baseline:{ retailDefault:14, currency:"USD" }, listings:[
  { itemId:"a", title:"Anastasia Inciardi Mini Print — Negroni", price:9.5, shipping:0, landed:9.5, condition:"New", buyingOptions:["FIXED_PRICE"], url:"https://www.ebay.com/itm/156812754385", image:null, seller:"printfan_me", status:"new", firstSeen:"2026-07-06", print:{name:"Negroni",exclusive:null,matched:true}, flags:["underpriced"], priceHistory:[{t:"2026-07-06",landed:9.5}] },
  { itemId:"b", title:"Inciardi Mini Print — NYC Exclusive Holiday Edition", price:149, shipping:0, landed:149, condition:"New", buyingOptions:["FIXED_PRICE"], url:"https://www.ebay.com/itm/900000103", image:null, seller:"collector_lot", status:"live", firstSeen:"2026-06-28", print:{name:"Holiday Edition",exclusive:"holiday",matched:true}, flags:["exclusive"], priceHistory:[{t:"2026-06-28",landed:149}] },
  { itemId:"c", title:"Inciardi Mini Print — LACMA set (7 lot)", price:60, shipping:0, landed:60, condition:"New", buyingOptions:["FIXED_PRICE"], url:"https://www.ebay.com/itm/900000104", image:null, seller:"artdealer_nyc", status:"changed", firstSeen:"2026-07-01", print:{name:"LACMA set",exclusive:"lacma",matched:true}, flags:["exclusive","pack-deal"], priceHistory:[{t:"2026-07-01",landed:75},{t:"2026-07-04",landed:68},{t:"2026-07-06",landed:60}] }
] };
const CATALOG_FALLBACK = { refreshedAt:"sample", machineCount:120, prints:[{name:"Negroni",category:"mini",exclusive:null,retail:6}], machines:[] };

const CAT_LABELS = { mini:"Minis", pack:"Packs", "big-riso":"Big Risographs", linocut:"Linocuts", exclusive:"Exclusives" };
const EXCL_LABEL = { nyc:"NYC", lacma:"LACMA", holiday:"Holiday", "grand central":"Grand Central", "richard-scarry":"Richard Scarry" };
const RATING_LABEL = { buy:"BUY", watch:"HOLD", pass:"PASS" };
const RATING_CLASS = { buy:"buy", watch:"hold", pass:"pass" };
const THUMB_HUE = { mini:72, pack:205, exclusive:305, "big-riso":150, linocut:40 };

// inline SVG icons (no external icon dependency)
const ICONS = {
  "search-x":'<path d="m13.5 8.5-5 5M8.5 8.5l5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  tag:'<path d="M12.59 2.59A2 2 0 0 0 11.17 2H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.42l8.83 8.83a2 2 0 0 0 2.83 0l7.17-7.17a2 2 0 0 0 0-2.83Z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
  package:'<path d="m7.5 4.27 9 5.15M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>',
  ghost:'<path d="M9 10h.01M15 10h.01M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8Z"/>',
  "refresh-cw":'<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>',
  "map-pin":'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  "filter-x":'<path d="M13.01 4H3l6.74 8.03M22 4h-3M11 12v6.88a1 1 0 0 1-.42.81l-2.16 1.52A1 1 0 0 1 7 20.4v-8.4M22 8l-4 4M18 8l4 4"/>'
};
function icon(name){ return `<svg viewBox="0 0 24 24">${ICONS[name]||""}</svg>`; }

let MARKET = null, CATALOG = null;
let state = { tab:"radar", filters:new Set() };
const $ = (id) => document.getElementById(id);

/* ---- boot ---- */
const gear = $("gear"), drawer = $("drawer"), themeToggle = $("themeToggle"), epInput = $("epInput"), panel = $("panel");
initTheme();
epInput.value = localStorage.getItem("inciardi_ep") || "";
document.querySelectorAll(".tab").forEach(t => t.addEventListener("click", () => switchTab(t.dataset.tab)));
gear.addEventListener("click", () => { drawer.showModal(); gear.setAttribute("aria-expanded","true"); });
$("drawerClose").addEventListener("click", () => drawer.close());
drawer.addEventListener("click", (e) => { if (e.target === drawer) drawer.close(); });
drawer.addEventListener("close", () => gear.setAttribute("aria-expanded","false"));
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && drawer.open) drawer.close(); });
themeToggle.addEventListener("click", toggleTheme);
epInput.addEventListener("change", () => { localStorage.setItem("inciardi_ep", epInput.value.trim()); load(); });
load();

async function load() {
  const ep = (localStorage.getItem("inciardi_ep") || "").trim();
  MARKET = await grab(ep || "./market.json", "inciardi_mkt", MARKET_FALLBACK);
  CATALOG = await grab("./catalog.json", "inciardi_cat", CATALOG_FALLBACK);
  renderStatus(); renderBoard(); renderCounts(); render(); stampFooter();
}
async function grab(src, key, fallback) {
  try {
    const res = await fetch(src, { headers: { Accept: "application/json" } });
    if (!res.ok) throw 0;
    const d = await res.json();
    if (d.error) throw 0;
    localStorage.setItem(key, JSON.stringify(d));
    return d;
  } catch { const c = localStorage.getItem(key); return c ? JSON.parse(c) : fallback; }
}

/* ---- scoring ---- */
function baseline(){ return (MARKET.baseline && MARKET.baseline.retailDefault) || 14; }
function has(l, f){ return (l.flags || []).includes(f); }
function isPack(l){ return has(l, "pack-deal"); }
function isExclusive(l){ return l.print && l.print.exclusive; }
function verdict(l){
  const b = baseline();
  if (isExclusive(l)) {
    if (l.landed <= 40) return { k:"buy", t:"under exclusive floor" };
    if (l.landed <= 70) return { k:"watch", t:"fair for exclusive" };
    return { k:"pass", t:"priced high" };
  }
  if (isPack(l)) return l.landed/5 <= b*0.7 ? { k:"buy", t:"cheap per print" } : { k:"watch", t:"pack, check count" };
  const r = l.landed / b;
  if (r <= 0.75) return { k:"buy", t:`${Math.round((1-r)*100)}% under retail` };
  if (r <= 1.05) return { k:"watch", t:"around retail" };
  return { k:"pass", t:`${Math.round((r-1)*100)}% over` };
}
// Delta vs retail, framed like a ticker change. Cheaper-than-retail = up (green, the buyer's win).
function deltaFor(l){
  const b = baseline();
  if (isExclusive(l)) return { txt:(l.landed/b).toFixed(1)+"\u00d7", cls:"flat", sub:"vs retail" };
  if (isPack(l)) { const pct = Math.round((l.landed/5/b - 1)*100); return { txt:(pct>0?"+":"")+pct+"%", cls: pct<0?"up":pct>0?"down":"flat", sub:"per print" }; }
  const pct = Math.round((l.landed/b - 1)*100);
  return { txt:(pct>0?"+":"")+pct+"%", cls: pct<0?"up":pct>0?"down":"flat", sub:"vs retail" };
}
function listingsFor(name){ return MARKET.listings.filter(l => l.print && l.print.matched && l.print.name === name); }
function rangeFor(name){
  const ls = listingsFor(name).filter(l => l.status !== "gone");
  if (!ls.length) return null;
  const p = ls.map(l => l.landed);
  return { low: Math.min(...p), high: Math.max(...p), count: ls.length };
}

/* ---- chrome ---- */
function renderStatus(){
  const live = MARKET.source === "ebay-browse";
  $("status").className = "status" + (live ? "" : " sample");
  $("statusText").textContent = live ? "Live" : "Sample";
}
function renderBoard(){
  const live = MARKET.listings.filter(l => l.status !== "gone");
  const deals = live.filter(l => !isExclusive(l) && verdict(l).k === "buy").length;
  const fresh = live.filter(l => l.status === "new").length;
  const gone = MARKET.listings.filter(l => l.status === "gone").length;
  const drops = live.filter(l => (l.priceHistory||[]).length > 1 && l.priceHistory[l.priceHistory.length-1].landed < l.priceHistory[0].landed)
    .map(l => { const h=l.priceHistory; return { l, pct: Math.round((1 - h[h.length-1].landed/h[0].landed)*100) }; })
    .sort((a,b) => b.pct - a.pct)[0];
  const temp = deals >= 5 ? "Market's warm" : deals >= 2 ? "A few live deals" : "Quiet tape";
  $("board").innerHTML = `
    <div class="read">
      <div class="eyebrow">Buy side</div>
      <div class="headline">${temp}</div>
      <div class="sub">${deals} under-retail ${deals===1?"quote":"quotes"} live now</div>
    </div>
    <div class="figs">
      <div class="fig up"><div class="l">Under retail</div><div class="v">${deals>0?'<span class="arw">\u25b2</span>':""}${deals}</div><div class="n">flagged buys</div></div>
      <div class="fig"><div class="l">New</div><div class="v">${fresh}</div><div class="n">since last scan</div></div>
      <div class="fig down"><div class="l">Top mover</div><div class="v">${drops?'<span class="arw">\u25bc</span>'+drops.pct+"%":"\u2014"}</div><div class="n">${drops?esc(drops.l.print&&drops.l.print.matched?drops.l.print.name:"a listing"):"no movers"}</div></div>
      <div class="fig mute"><div class="l">Pulled</div><div class="v">${gone}</div><div class="n">gone since scan</div></div>
    </div>`;
}
function renderCounts(){
  const live = MARKET.listings.filter(l => l.status !== "gone");
  $("c-radar").textContent = live.filter(l => !isExclusive(l) && verdict(l).k !== "pass").length;
  $("c-sell").textContent = MARKET.listings.filter(isExclusive).length;
  $("c-stock").textContent = getStock().length;
  $("c-cat").textContent = (CATALOG.prints || []).length;
  $("c-mach").textContent = (CATALOG.machines || []).length;
  $("c-all").textContent = MARKET.listings.length;
}
function switchTab(tab){
  state.tab = tab; state.filters.clear();
  document.querySelectorAll(".tab").forEach(t => t.setAttribute("aria-selected", String(t.dataset.tab === tab)));
  render();
}
function render(){
  ({ radar:renderRadar, sell:renderSell, stock:renderStock, catalog:renderCatalog, machines:renderMachines, all:renderAll }[state.tab])();
  panel.classList.remove("fade"); void panel.offsetWidth; panel.classList.add("fade");
}

/* ---- tabs ---- */
function renderRadar(){
  const live = MARKET.listings.filter(l => l.status !== "gone" && !isExclusive(l));
  const ranked = live.map(l => ({ l, v: verdict(l) })).filter(x => x.v.k !== "pass")
    .sort((a,b) => rank(a.v.k)-rank(b.v.k) || a.l.landed-b.l.landed);
  panel.innerHTML = `<p class="section-lead">Non-exclusive listings at or under retail (<b>${money(baseline())}</b>), best deals first. Packs are judged on value per print.</p>
    <div class="feed">${ranked.map(x => dealCard(x.l, x.v)).join("") || empty("search-x","No deals right now","Nothing under retail in the current scan.")}</div>`;
}
function renderSell(){
  const ex = MARKET.listings.filter(isExclusive);
  const active = ex.filter(l => l.status !== "gone"), gone = ex.filter(l => l.status === "gone");
  panel.innerHTML = `<p class="section-lead">Exclusives (NYC, LACMA, Grand Central, holiday editions) and their current asks. If you hold one, <b>this is your sell signal</b>.</p>
    <div class="feed">${active.map(sellRow).join("") || empty("tag","No exclusives listed","None of the collectible editions are on the market right now.")}</div>
    ${gone.length ? `<div class="vanished">${icon("ghost")}<div><b>${gone.length} exclusive${gone.length>1?"s":""} vanished since last scan.</b> ${gone.map(g=>esc(g.print.name)).join(", ")} disappeared, likely sold. If you're holding, the market's thin.</div></div>` : ""}`;
}
function renderStock(){
  const stock = getStock();
  const opts = (CATALOG.prints || []).map(p => `<option value="${esc(p.name)}">${esc(p.name)}${p.exclusive?" ("+(EXCL_LABEL[p.exclusive]||p.exclusive)+")":""}</option>`).join("");
  let totalMkt = 0, totalPaid = 0;
  const rows = stock.map((s, i) => {
    const r = rangeFor(s.name), mkt = r ? r.low : null;
    const cat = (CATALOG.prints||[]).find(p => p.name === s.name), excl = cat && cat.exclusive;
    if (mkt) totalMkt += mkt; if (s.paid) totalPaid += Number(s.paid);
    const gain = (mkt && s.paid) ? mkt - s.paid : null;
    return `<div class="stockrow">
      <div class="thumb" style="background:${thumbBg(cat?cat.category:"mini")};color:${thumbInk(cat?cat.category:"mini")}">${initials(s.name)}</div>
      <div><div style="font-weight:600;font-size:0.86rem">${esc(s.name)}</div>
        <div class="d-meta">${esc(s.condition||"—")}${s.paid?` <span class="sep">·</span> paid ${money(s.paid)}`:""}${excl?` <span class="sell-flag">sell signal</span>`:""}</div></div>
      <div class="d-rail"><div class="landed">${mkt?money(mkt):"—"}</div>
        <div class="sub-price">${mkt?"market low":"not listed"}</div>
        ${gain!==null?`<div class="delta ${gain>=0?"up":"down"}">${gain>=0?"+":""}${money(gain)}</div>`:""}</div>
      <button class="rm" data-i="${i}" aria-label="Remove"><svg class="ic" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>`;
  }).join("");
  panel.innerHTML = `<p class="section-lead">Prints you own, marked to the live eBay market. Stored on this device only. Exclusives flag a <b>sell signal</b> when the market runs hot.</p>
    <div class="stockform">
      <select id="stkName">${opts}</select>
      <select id="stkCond"><option>New</option><option>Used</option><option>Sealed</option></select>
      <input id="stkPaid" type="number" placeholder="Paid $" min="0" step="0.5">
      <button class="btn" id="stkAdd">Add print</button>
    </div>
    ${stock.length ? `<div class="portfolio">
        <div class="p"><div class="n">${stock.length}</div><div class="l">Positions</div></div>
        <div class="p"><div class="n">${money(totalMkt)}</div><div class="l">Mark-to-market</div></div>
        <div class="p"><div class="n${totalPaid&&totalMkt-totalPaid>=0?" gain":""}">${totalPaid?money(totalMkt-totalPaid):"—"}</div><div class="l">Unrealized P/L</div></div>
      </div>${rows}` : empty("package","No positions yet","Add a print above. Exclusives you hold will flag when the market's hot.")}`;
  $("stkAdd").addEventListener("click", () => {
    const s = getStock(); s.push({ name: $("stkName").value, condition: $("stkCond").value, paid: $("stkPaid").value || null });
    setStock(s); renderCounts(); render();
  });
  panel.querySelectorAll(".rm").forEach(b => b.addEventListener("click", () => {
    const s = getStock(); s.splice(Number(b.dataset.i), 1); setStock(s); renderCounts(); render();
  }));
}
function renderCatalog(){
  const prints = CATALOG.prints || [];
  const byCat = {}; prints.forEach(p => { (byCat[p.category] = byCat[p.category] || []).push(p); });
  const listed = prints.filter(p => rangeFor(p.name)).length;
  let html = `<p class="section-lead">The full print universe crossed against the live eBay market. <b>"Not listed"</b> means no copy is on eBay right now, which is its own signal. Refreshed ${fmtDate(CATALOG.refreshedAt)}.</p>`;
  Object.keys(CAT_LABELS).filter(c => byCat[c]).forEach(c => {
    html += `<div class="cat-head"><h2>${CAT_LABELS[c]}</h2><span class="n">${byCat[c].length}</span></div><div class="cat-grid">`;
    html += byCat[c].sort((a,b)=>a.name.localeCompare(b.name)).map(p => {
      const r = rangeFor(p.name);
      const line = r ? `${money(r.low)}${r.high>r.low?"–"+money(r.high):""} · ${r.count} live` : "not listed";
      return `<div class="cat-item${r?"":" unlisted"}"><div class="name">${esc(p.name)}</div>
        <div class="stat">${line}${p.retail?` · retail ${money(p.retail)}`:""}</div></div>`;
    }).join("") + `</div>`;
  });
  html += `<div class="vanished" style="margin-top:var(--s5)">${icon("refresh-cw")}<div><b>${listed} of ${prints.length} catalog prints are on eBay right now.</b> This list widens each time the catalog refresh runs a wide web search; the master run is 500+ prints.</div></div>`;
  panel.innerHTML = html;
}
function renderMachines(){
  const ms = CATALOG.machines || [];
  panel.innerHTML = `<p class="section-lead">Where the $1 prints (and the Richard Scarry exclusives) live in the wild. <b>${CATALOG.machineCount||"120"}+</b> machines nationwide; this is the session-tracked subset, weighted toward exclusive-carrying spots.</p>
    ${ms.map(m => `<div class="machine">${icon("map-pin")}
      <div><div class="mname">${esc(m.name)}</div>
        <div class="mloc">${esc([m.city,m.state].filter(Boolean).join(", ")||"location TBD")}${m.notes?" · "+esc(m.notes):""}</div></div>
      <span class="coll">${esc(m.collection||"minis")}</span></div>`).join("") || empty("map-pin","No machines tracked","Run the catalog refresh to pull locations.")}`;
}
function renderAll(){
  const allFlags = ["underpriced","exclusive","pack-deal","auction","stale","new","changed","gone"];
  const active = state.filters.size ? MARKET.listings.filter(l => [...state.filters].every(f => has(l,f) || l.status===f)) : MARKET.listings;
  panel.innerHTML = `<div class="chips">${allFlags.map(f => `<button class="chip" data-f="${f}" aria-pressed="${state.filters.has(f)}">${f.replace("-"," ")}</button>`).join("")}</div>
    <div class="feed">${active.map(l => dealCard(l, verdict(l))).join("") || empty("filter-x","No matches","Loosen the filters.")}</div>`;
  panel.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => {
    const f = c.dataset.f; state.filters.has(f) ? state.filters.delete(f) : state.filters.add(f); renderAll();
  }));
}

/* ---- components ---- */
function thumbBg(cat){ return `oklch(30% 0.05 ${THUMB_HUE[cat]||72})`; }
function thumbInk(cat){ return `oklch(80% 0.11 ${THUMB_HUE[cat]||72})`; }
function initials(name){ if(!name) return "?"; return name.split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase(); }
function thumb(l){
  const cat = (l.print && (CATALOG.prints||[]).find(p => p.name === l.print.name)) || { category:"mini" };
  if (l.image) return `<div class="thumb"><img src="${esc(l.image)}" alt="" loading="lazy"></div>`;
  return `<div class="thumb" style="background:${thumbBg(cat.category)};color:${thumbInk(cat.category)}">${initials(l.print&&l.print.name)}</div>`;
}
function dealCard(l, v){
  const dv = v || verdict(l), d = deltaFor(l);
  return `<article class="deal">
    ${thumb(l)}
    <div class="d-body">
      <h3><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.title)}</a></h3>
      <div class="d-meta">${l.print&&l.print.matched?esc(l.print.name):"unmatched"} <span class="sep">·</span> ${esc(l.condition||"")} <span class="sep">·</span> ${esc(l.seller||"?")}</div>
      <div class="badges"><span class="badge b-${l.status}">${l.status}</span>${(l.flags||[]).map(f=>`<span class="badge b-${f}">${f.replace("-"," ")}</span>`).join("")}</div>
    </div>
    <div class="d-rail">
      <div class="landed">${money(l.landed)}</div>
      <div class="sub-price">${l.shipping?"+"+money(l.shipping)+" ship":"free ship"}</div>
      <div class="railrow"><span class="delta ${d.cls}">${d.txt}</span><span class="rating ${RATING_CLASS[dv.k]}">${RATING_LABEL[dv.k]}</span></div>
    </div>
  </article>`;
}
function sellRow(l){
  const hist = (l.priceHistory||[]).map(h=>h.landed), max = Math.max(...hist, 1);
  const bars = hist.map(h => `<span style="height:${Math.max(10, h/max*24)}px"></span>`).join("");
  const trend = hist.length>1 ? (hist[hist.length-1]<hist[0]?{c:"down",t:"▼ dropping"}:hist[hist.length-1]>hist[0]?{c:"up",t:"▲ climbing"}:{c:"",t:"flat"}) : null;
  return `<article class="sell-row">
    <div>
      <div class="sr-title"><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.title)}</a></div>
      <div class="sr-meta"><span class="badge b-exclusive">${EXCL_LABEL[l.print.exclusive]||l.print.exclusive}</span> ${esc(l.seller||"?")}${trend?` <span class="sep">·</span> <span class="trend ${trend.c}">${trend.t}</span>`:""}</div>
      ${hist.length>1?`<div class="spark">${bars}</div>`:""}
    </div>
    <div class="sr-price"><div class="sr-mult">${money(l.landed)}</div><div class="sr-vs">${(l.landed/baseline()).toFixed(1)}× retail</div></div>
    <div class="rating hold">EXCL</div>
  </article>`;
}
function empty(name,h,p){ return `<div class="empty">${icon(name)}<h3>${esc(h)}</h3><p>${esc(p)}</p></div>`; }

/* ---- stock store ---- */
function getStock(){ try { return JSON.parse(localStorage.getItem("inciardi_stock") || "[]"); } catch { return []; } }
function setStock(s){ localStorage.setItem("inciardi_stock", JSON.stringify(s)); }

/* ---- theme + utils ---- */
// dark terminal is the default; light is opt-in via [data-theme="light"].
function initTheme(){ if (localStorage.getItem("inciardi_theme")==="light"){ document.documentElement.dataset.theme="light"; themeToggle.setAttribute("aria-pressed","false"); } else { themeToggle.setAttribute("aria-pressed","true"); } }
function toggleTheme(){ const isLight = document.documentElement.dataset.theme==="light";
  if(isLight){ delete document.documentElement.dataset.theme; localStorage.setItem("inciardi_theme","dark"); themeToggle.setAttribute("aria-pressed","true"); }
  else { document.documentElement.dataset.theme="light"; localStorage.setItem("inciardi_theme","light"); themeToggle.setAttribute("aria-pressed","false"); } }
function stampFooter(){
  const live = MARKET.source === "ebay-browse";
  $("f-build").textContent = `Inciardi Market ${BUILD}${PR?" · PR #"+PR:""}`;
  $("f-stamp").textContent = live ? "prices: live · eBay" : "prices: sample data";
}
function rank(k){ return k==="buy"?0:k==="watch"?1:2; }
function money(n){ const v=Number(n||0); return (v<0?"-$":"$")+Math.abs(v).toFixed(2); }
function fmtDate(s){ try { return new Date(s).toLocaleDateString(undefined,{month:"short",day:"numeric"}); } catch { return s; } }
function esc(s){ return String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
