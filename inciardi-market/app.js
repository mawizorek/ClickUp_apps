/* Inciardi Market — engine. Reads market.json (eBay prices) + catalog.json (master + machines). */

const BUILD = "v2.1";
const PR = 48; // merged PR that shipped this version

const MARKET_FALLBACK = { version: "sample", query: "inciardi mini print", source: "sample",
  baseline: { retailDefault: 14, currency: "USD" }, listings: [
  { itemId:"a", title:"Anastasia Inciardi Mini Print - NEGRONI", landed:9.5, price:9.5, shipping:0, condition:"New", buyingOptions:["FIXED_PRICE"], url:"https://ebay.com/itm/156812754385", seller:"printfan_me", status:"new", firstSeen:"2026-07-06T21:00:00Z", print:{name:"Negroni",exclusive:null,matched:true}, flags:["underpriced"], priceHistory:[{t:"2026-07-06",landed:9.5}] },
  { itemId:"b", title:"Inciardi Mini Print - NYC Exclusive Holiday Edition", landed:149, price:149, shipping:0, condition:"New", buyingOptions:["FIXED_PRICE"], url:"https://ebay.com/itm/900000103", seller:"collector_lot", status:"live", firstSeen:"2026-06-28T06:00:00Z", print:{name:"Holiday Edition",exclusive:"holiday",matched:true}, flags:["exclusive"], priceHistory:[{t:"2026-06-28",landed:149}] },
  { itemId:"c", title:"Inciardi Mini Print - LACMA set (7 lot)", landed:60, price:60, shipping:0, condition:"New", buyingOptions:["FIXED_PRICE"], url:"https://ebay.com/itm/900000104", seller:"artdealer_nyc", status:"changed", firstSeen:"2026-07-01T06:00:00Z", print:{name:"LACMA set",exclusive:"lacma",matched:true}, flags:["exclusive","pack-deal"], priceHistory:[{t:"2026-07-01",landed:75},{t:"2026-07-04",landed:68},{t:"2026-07-06",landed:60}] }
] };
const CATALOG_FALLBACK = { refreshedAt: "sample", machineCount: 120, officialMap: "https://inciardiprints.com/pages/store-locator",
  prints: [{name:"Negroni",category:"mini",exclusive:null,retail:6}], machines: [] };

const CAT_LABELS = { mini:"Minis", pack:"Packs", "big-riso":"Big Risographs", linocut:"Linocuts", exclusive:"Exclusives" };
const EXCL_LABEL = { nyc:"NYC", lacma:"LACMA", holiday:"Holiday", "richard-scarry":"Richard Scarry" };

let MARKET = null, CATALOG = null;
let state = { tab: "radar", filters: new Set() };
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
themeToggle.addEventListener("click", toggleTheme);
epInput.addEventListener("change", () => { localStorage.setItem("inciardi_ep", epInput.value.trim()); load(); });
load();

async function load() {
  const ep = (localStorage.getItem("inciardi_ep") || "").trim();
  MARKET = await grab(ep || "./market.json", "inciardi_mkt", MARKET_FALLBACK);
  CATALOG = await grab("./catalog.json", "inciardi_cat", CATALOG_FALLBACK);
  $("freshness").textContent = MARKET.source === "ebay-browse" ? "live" : "sample";
  render();
  stampFooter();
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

/* ---- footer freshness stamps ---- */
function stampFooter() {
  const live = MARKET.source === "ebay-browse";
  const pv = $("f-prices"), pd = $("f-price-dot"), cv = $("f-catalog"), fb = $("f-build");
  if (pv) pv.textContent = `prices: ${live ? "live · eBay" : "sample data"}${MARKET.version && MARKET.version!=="sample" ? " · "+relTime(MARKET.version) : ""}`;
  if (pd) pd.className = "dot" + (live ? " live" : "");
  if (cv) cv.textContent = `catalog: ${(CATALOG.prints||[]).length} prints${CATALOG.refreshedAt && CATALOG.refreshedAt!=="sample" ? " · "+relTime(CATALOG.refreshedAt) : ""}`;
  if (fb) fb.textContent = `Inciardi Market ${BUILD} · PR #${PR}`;
}

/* ---- scoring ---- */
function baseline() { return (MARKET.baseline && MARKET.baseline.retailDefault) || 14; }
function has(l, f) { return (l.flags || []).includes(f); }
function isPack(l) { return has(l, "pack-deal"); }
function isExclusive(l) { return l.print && l.print.exclusive; }
function verdict(l) {
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
function listingsFor(name) { return MARKET.listings.filter(l => l.print && l.print.matched && l.print.name === name); }
function rangeFor(name) {
  const ls = listingsFor(name).filter(l => l.status !== "gone");
  if (!ls.length) return null;
  const prices = ls.map(l => l.landed);
  return { low: Math.min(...prices), high: Math.max(...prices), count: ls.length };
}

/* ---- render router ---- */
function render() {
  const live = MARKET.listings.filter(l => l.status !== "gone");
  $("c-radar").textContent = live.filter(l => !isExclusive(l) && verdict(l).k !== "pass").length;
  $("c-sell").textContent = MARKET.listings.filter(isExclusive).length;
  $("c-stock").textContent = getStock().length;
  $("c-cat").textContent = (CATALOG.prints || []).length;
  $("c-mach").textContent = (CATALOG.machines || []).length;
  $("c-all").textContent = MARKET.listings.length;
  ({ radar:renderRadar, sell:renderSell, stock:renderStock, catalog:renderCatalog, machines:renderMachines, all:renderAll, compare:renderCompare }[state.tab])();
}
function switchTab(tab) {
  state.tab = tab; state.filters.clear();
  document.querySelectorAll(".tab").forEach(t => t.setAttribute("aria-selected", String(t.dataset.tab === tab)));
  render();
}

/* ---- trends strip ---- */
function trendsStrip() {
  const live = MARKET.listings.filter(l => l.status !== "gone");
  const fresh = live.filter(l => l.status === "new").length;
  const drops = live.filter(l => (l.priceHistory||[]).length > 1 && l.priceHistory[l.priceHistory.length-1].landed < l.priceHistory[0].landed);
  const biggest = drops.map(l => { const h=l.priceHistory; return { l, pct: Math.round((1 - h[h.length-1].landed/h[0].landed)*100) }; })
    .sort((a,b) => b.pct - a.pct)[0];
  const gone = MARKET.listings.filter(l => l.status === "gone").length;
  const deals = live.filter(l => !isExclusive(l) && verdict(l).k === "buy").length;
  return `<div class="trends">
    <div class="trend hot"><div class="k">Buy now</div><div class="v">${deals}</div><div class="d">under-retail deals live</div></div>
    <div class="trend up"><div class="k">New</div><div class="v">${fresh}</div><div class="d">fresh since last scan</div></div>
    <div class="trend down"><div class="k">Biggest drop</div><div class="v">${biggest?biggest.pct+"%":"–"}</div><div class="d">${biggest?esc(biggest.l.print&&biggest.l.print.matched?biggest.l.print.name:"a listing"):"no movers"}</div></div>
    <div class="trend"><div class="k">Sold / pulled</div><div class="v">${gone}</div><div class="d">gone since last scan</div></div>
  </div>`;
}

function renderRadar() {
  const live = MARKET.listings.filter(l => l.status !== "gone" && !isExclusive(l));
  const ranked = live.map(l => ({ l, v: verdict(l) })).filter(x => x.v.k !== "pass")
    .sort((a,b) => rank(a.v.k)-rank(b.v.k) || a.l.landed-b.l.landed);
  panel.innerHTML = trendsStrip() +
    `<p class="lead"><strong>Buy side.</strong> Non-exclusive listings at or under retail (${money(baseline())}), best deals first. Packs judged on per-print value.</p>
     <div class="deals">${ranked.map(x => dealCard(x.l, x.v)).join("") || emptyState("🔍","No deals right now","Nothing under retail in the current scan.")}</div>`;
}

function renderSell() {
  const ex = MARKET.listings.filter(isExclusive);
  const active = ex.filter(l => l.status !== "gone"), gone = ex.filter(l => l.status === "gone");
  panel.innerHTML = `<p class="lead"><strong>Sell side.</strong> Exclusives (NYC / LACMA / Grand Central / holiday) and current asks. If you own one, this is your sell signal.</p>
    <div class="sell">${active.map(sellRow).join("") || emptyState("💰","No exclusives listed","None of the collectible editions are on the market right now.")}</div>
    ${gone.length ? `<div class="note"><span>👻</span><div><b>${gone.length} exclusive${gone.length>1?"s":""} vanished since last scan.</b> ${gone.map(g=>esc(g.print.name)).join(", ")} disappeared, likely sold. If you hold one, the market's thin.</div></div>` : ""}`;
}

/* ---- My Stock (device-local) ---- */
function getStock() { try { return JSON.parse(localStorage.getItem("inciardi_stock") || "[]"); } catch { return []; } }
function setStock(s) { localStorage.setItem("inciardi_stock", JSON.stringify(s)); }
function renderStock() {
  const stock = getStock();
  const opts = (CATALOG.prints || []).map(p => `<option value="${esc(p.name)}">${esc(p.name)}${p.exclusive?" ("+EXCL_LABEL[p.exclusive]+")":""}</option>`).join("");
  let totalMkt = 0, totalPaid = 0;
  const rows = stock.map((s, i) => {
    const r = rangeFor(s.name);
    const mkt = r ? r.low : null;
    const cat = (CATALOG.prints||[]).find(p => p.name === s.name);
    const excl = cat && cat.exclusive;
    if (mkt) totalMkt += mkt;
    if (s.paid) totalPaid += Number(s.paid);
    const gain = (mkt && s.paid) ? mkt - s.paid : null;
    const gl = gain === null ? "" : `<div class="verdict ${gain>=0?"gain":"loss"}">${gain>=0?"+":""}${money(gain)}</div>`;
    const sig = excl && mkt ? `<span class="badge b-exclusive">sell signal</span>` : "";
    return `<div class="deal"><div class="thumb">🖨️</div>
      <div class="d-body"><h3>${esc(s.name)}</h3>
        <div class="d-meta"><span>${esc(s.condition||"—")}</span>${s.paid?`<span>· paid ${money(s.paid)}</span>`:""}${excl?`<span class="badge b-exclusive">${EXCL_LABEL[excl]}</span>`:""}${sig}</div></div>
      <div class="d-price"><div class="landed">${mkt?money(mkt):"—"}</div><div class="sub-price">${mkt?"market low":"not listed"}</div>${gl}</div>
      <button class="rm" data-i="${i}" aria-label="Remove">×</button></div>`;
  }).join("");
  panel.innerHTML = `<p class="lead"><strong>Your stock.</strong> Prints you own, valued against the current eBay market. Lives on this device only, not tied to any external inventory. Add what you're holding to track value and catch sell signals on exclusives.</p>
    <div class="stockform">
      <select id="stkName">${opts}</select>
      <select id="stkCond"><option>New</option><option>Used</option><option>Sealed</option></select>
      <input id="stkPaid" type="number" placeholder="paid $" min="0" step="0.01">
      <button class="act" id="stkAdd">Add</button>
    </div>
    ${stock.length ? `<div class="portfolio">
      <div class="p"><span class="n">${stock.length}</span><span class="l">prints</span></div>
      <div class="p"><span class="n">${money(totalMkt)}</span><span class="l">market value</span></div>
      <div class="p"><span class="n">${totalPaid?money(totalMkt-totalPaid):"–"}</span><span class="l">unrealized</span></div>
    </div><div class="stocklist">${rows}</div>` : emptyState("📦","Nothing tracked yet","Add a print above. Exclusives you hold will flag a sell signal when the market's hot.")}`;
  $("stkAdd").addEventListener("click", () => {
    const s = getStock();
    s.push({ name: $("stkName").value, condition: $("stkCond").value, paid: $("stkPaid").value || null });
    setStock(s); render();
  });
  panel.querySelectorAll(".rm").forEach(b => b.addEventListener("click", () => {
    const s = getStock(); s.splice(Number(b.dataset.i), 1); setStock(s); render();
  }));
}

/* ---- Catalog (master universe × market) ---- */
function renderCatalog() {
  const prints = CATALOG.prints || [];
  const byCat = {};
  prints.forEach(p => { (byCat[p.category] = byCat[p.category] || []).push(p); });
  const listedCount = prints.filter(p => rangeFor(p.name)).length;
  let html = `<p class="lead"><strong>The catalog.</strong> The full print universe (session-refreshed from the web), each crossed against the live eBay market. "Not listed" means no copy is on eBay right now, which is its own signal. Refreshed ${fmtDate(CATALOG.refreshedAt)}.</p>`;
  Object.keys(CAT_LABELS).filter(c => byCat[c]).forEach(c => {
    html += `<div class="cat-head"><h2>${CAT_LABELS[c]}</h2><span class="n">${byCat[c].length}</span></div><div class="cat-grid">`;
    html += byCat[c].sort((a,b)=>a.name.localeCompare(b.name)).map(p => {
      const r = rangeFor(p.name);
      const priceLine = r ? `${money(r.low)}${r.high>r.low?"–"+money(r.high):""} · ${r.count} live` : "not listed";
      return `<div class="cat-item ${r?"":"unlisted"}"><div class="name">${esc(p.name)}</div>
        <div class="stat">${priceLine}${p.retail?` · retail ${money(p.retail)}`:""}</div>
        ${p.exclusive?`<span class="badge b-exclusive excl">${EXCL_LABEL[p.exclusive]}</span>`:`<span class="badge ${r?"b-listed":"b-unlisted"} excl">${r?"on market":"unlisted"}</span>`}</div>`;
    }).join("") + `</div>`;
  });
  html += `<div class="note"><span>🔄</span><div><b>${listedCount} of ${prints.length} catalog prints are on eBay right now.</b> This list widens each time the catalog refresh runs a wide web search. The master run is 500+ prints; this is the working subset that hits the market. <a href="${esc(CATALOG.officialMap)}" target="_blank" rel="noopener" style="color:var(--accent-ink)">Official machine map →</a></div></div>`;
  panel.innerHTML = html;
}

/* ---- Machines ---- */
function renderMachines() {
  const ms = CATALOG.machines || [];
  panel.innerHTML = `<p class="lead"><strong>Vending machines.</strong> Where the $1 prints (and the Richard Scarry exclusives) live in the wild. ${CATALOG.machineCount||"120"}+ machines nationwide; this is the session-tracked subset. The exclusives here are what resell hot, so the map is a sourcing tool.</p>
    <div class="machines">${ms.map(m => `<div class="machine"><span class="pin">📍</span>
      <div><div class="mname">${esc(m.name)}</div><div class="mloc">${esc([m.city,m.state].filter(Boolean).join(", ")||"location TBD")}${m.notes?" · "+esc(m.notes):""}</div></div>
      <span class="badge b-exclusive">${esc(m.collection||"minis")}</span></div>`).join("") || emptyState("📍","No machines tracked yet","Run the catalog refresh to pull locations.")}
    </div>
    <div class="note"><span>🗺️</span><div><b>The full map lives on Anastasia's site.</b> This tab tracks the machines that surface in the session refresh, weighted toward the exclusive-carrying ones. <a href="${esc(CATALOG.officialMap)}" target="_blank" rel="noopener" style="color:var(--accent-ink)">Official store locator →</a></div></div>`;
}

/* ---- All + Compare ---- */
function renderAll() {
  const allFlags = ["underpriced","exclusive","pack-deal","auction","stale","new","changed","gone"];
  const active = state.filters.size ? MARKET.listings.filter(l => [...state.filters].every(f => has(l,f) || l.status===f)) : MARKET.listings;
  panel.innerHTML = `<div class="chips">${allFlags.map(f => `<button class="chip" data-f="${f}" aria-pressed="${state.filters.has(f)}">${f.replace("-"," ")}</button>`).join("")}</div>
    <div class="deals">${active.map(l => dealCard(l, verdict(l))).join("") || emptyState("∅","No matches","Loosen the filters.")}</div>`;
  panel.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => {
    const f = c.dataset.f; state.filters.has(f) ? state.filters.delete(f) : state.filters.add(f); renderAll();
  }));
}
function renderCompare() {
  panel.innerHTML = `<p class="lead"><strong>Found a link?</strong> Paste an eBay listing URL to place it against the market: how its price stacks up vs retail and comparable listings.</p>
    <div class="paste"><input type="url" id="cmpUrl" placeholder="https://www.ebay.com/itm/..." spellcheck="false"><button class="act" id="cmpBtn">Compare</button></div>
    <div id="cmpOut">${emptyState("🔗","Nothing to compare yet","Live lookup needs the Worker; until then this resolves links already in the scan.")}</div>`;
  $("cmpBtn").addEventListener("click", () => {
    const url = $("cmpUrl").value.trim(), out = $("cmpOut");
    if (!url) { out.innerHTML = emptyState("🔗","No URL","Paste an eBay listing link."); return; }
    const m = url.match(/itm\/(\d+)/);
    const found = m && MARKET.listings.find(l => l.url.includes(m[1]));
    out.innerHTML = found ? `<div class="deals">${dealCard(found, verdict(found))}</div>`
      : `<div class="note"><span>⏳</span><div><b>Not in the current dataset.</b> Live single-URL lookup arrives with the Worker (it'll fetch that item from eBay directly). For now, Compare resolves links already in the scan.</div></div>`;
  });
}

/* ---- components ---- */
function dealCard(l, v) {
  const dv = v || verdict(l), hot = dv.k === "buy" && !isExclusive(l);
  return `<div class="deal ${hot?"hot":""}"><div class="thumb">🖨️</div>
    <div class="d-body"><h3><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.title)}</a></h3>
      <div class="d-meta"><span>${l.print&&l.print.matched?esc(l.print.name):"unmatched"}</span><span>·</span><span>${esc(l.condition||"")}</span><span>·</span><span>${esc(l.seller||"?")}</span></div>
      <div class="badges"><span class="badge b-${l.status}">${l.status}</span>${(l.flags||[]).map(f=>`<span class="badge b-${f}">${f.replace("-"," ")}</span>`).join("")}</div></div>
    <div class="d-price"><div class="landed">${money(l.landed)}</div>
      <div class="sub-price">${l.shipping?money(l.price)+" + "+money(l.shipping)+" ship":"free ship"}</div>
      <div class="verdict ${dv.k}">${dv.k==="buy"?"● ":""}${esc(dv.t)}</div></div></div>`;
}
function sellRow(l) {
  const hist = (l.priceHistory||[]).map(h=>h.landed), max = Math.max(...hist, 1);
  const bars = hist.map(h => `<span style="height:${Math.max(10,Math.round(h/max*26))}px"></span>`).join("");
  const trend = hist.length>1 ? (hist[hist.length-1]<hist[0]?"▼ dropping":hist[hist.length-1]>hist[0]?"▲ climbing":"flat") : "";
  return `<div class="sell-row"><div>
    <h3 style="font-size:.98rem;font-weight:600"><a href="${esc(l.url)}" target="_blank" rel="noopener" style="color:var(--ink);text-decoration:none">${esc(l.title)}</a></h3>
    <div class="d-meta"><span class="badge b-exclusive">${esc(l.print.exclusive)}</span><span>${esc(l.seller||"?")}</span>${trend?`<span>· ${trend}</span>`:""}</div>
    ${hist.length>1?`<div class="spark">${bars}</div>`:""}</div>
    <div class="d-price"><div class="landed">${money(l.landed)}</div><div class="sub-price">vs ${money(baseline())} retail</div>
    <div class="verdict buy">${Math.round(l.landed/baseline())}× retail</div></div></div>`;
}
function emptyState(big,h,p){ return `<div class="empty"><div class="big">${big}</div><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`; }

/* ---- theme + utils ---- */
function initTheme(){ if (localStorage.getItem("inciardi_theme")==="dark"){ document.documentElement.dataset.theme="dark"; themeToggle.setAttribute("aria-pressed","true"); } }
function toggleTheme(){ const d=document.documentElement.dataset.theme==="dark";
  if(d){ delete document.documentElement.dataset.theme; localStorage.setItem("inciardi_theme","light"); themeToggle.setAttribute("aria-pressed","false"); }
  else { document.documentElement.dataset.theme="dark"; localStorage.setItem("inciardi_theme","dark"); themeToggle.setAttribute("aria-pressed","true"); } }
function rank(k){ return k==="buy"?0:k==="watch"?1:2; }
function money(n){ const v=Number(n||0); return (v<0?"-$":"$")+Math.abs(v).toFixed(2); }
function fmtDate(s){ try { return new Date(s).toLocaleDateString(); } catch { return s; } }
function relTime(s){ try { const d=(Date.now()-new Date(s))/1000; if(d<3600)return Math.max(1,Math.round(d/60))+"m ago"; if(d<86400)return Math.round(d/3600)+"h ago"; return Math.round(d/86400)+"d ago"; } catch { return s; } }
function esc(s){ return String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
