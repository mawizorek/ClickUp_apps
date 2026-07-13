/* Terminal dashboard logic. Reads /inventory + /catalog + /market from the Worker. */
let MARKET=null, CATALOG=null, INV=null;

initChrome();
boot();

async function boot(){
  const [market, catalog, inv] = await Promise.all([
    apiGet("/market", { listings:[], source:"none" }),
    apiGet("/catalog", null),
    apiGet("/inventory", { inventory:[] }),
  ]);
  MARKET = market;
  // catalog falls back to the bundled seed json if the D1 route isn't populated yet.
  CATALOG = catalog && catalog.prints ? catalog : await apiGetLocalCatalog();
  INV = inv;
  const live = MARKET && MARKET.source==="ebay-browse";
  const pill = live?"live \u00b7 eBay":"sample data";
  $("live-pill").textContent = pill;
  $("f-src").textContent = "prices: "+pill; $("f-src").className = live?"up":"";
  renderPortfolio(); renderTape(); renderDeals(); renderUniverse();
}
async function apiGetLocalCatalog(){ try{ const r=await fetch("./catalog.json"); const d=await r.json(); return d; }catch(e){ return { prints:[] }; } }

function catFor(pid, name){
  const prints = CATALOG.prints||[];
  if(pid){ const m=prints.find(p=>p.print_id===pid); if(m) return m; }
  if(name){ const n=normStr(name); const m=prints.find(p=>normStr(p.name)===n); if(m) return m; }
  return null;
}

function renderPortfolio(){
  const rows=(INV.inventory||[]);
  const owned=rows.filter(r=>r.disposition==="own");
  const want=rows.filter(r=>r.disposition==="want").length;
  const sold=rows.filter(r=>r.disposition==="sold");
  let mkt=0, cost=0, marked=0;
  owned.forEach(r=>{
    const c=catFor(r.print_id, r.name);
    const m=c?marketFor(MARKET,c):null;
    const unit = m&&m.low!=null ? m.low : (c&&c.retail!=null?c.retail:null);
    const q=r.qty||1;
    if(unit!=null){ mkt+=unit*q; marked++; }
    if(r.acquired_price!=null) cost+=Number(r.acquired_price)*q;
  });
  const pl = (marked&&cost)? mkt-cost : null;
  const realized = sold.reduce((s,r)=>{ if(r.sold_price!=null&&r.acquired_price!=null) return s+(r.sold_price-r.acquired_price); return s; },0);
  const plCls = pl==null?"flat":pl>=0?"up":"down";
  $("pstats").innerHTML = `
    <div class="c stat"><div class="v">${owned.length}</div><div class="l">Positions</div><div class="sub">${want} on wishlist</div></div>
    <div class="c stat"><div class="v">${money0(mkt)}</div><div class="l">Mark-to-market</div><div class="sub">${marked}/${owned.length} priced</div></div>
    <div class="c stat"><div class="v ${plCls}">${pl==null?"\u2014":(pl>=0?"+":"")+money0(Math.abs(pl)).replace("$","$")}</div><div class="l">Unrealized P/L</div><div class="sub">cost ${cost?money0(cost):"\u2014"}</div></div>
    <div class="c stat"><div class="v ${realized>=0?"up":"down"}">${sold.length?((realized>=0?"+":"")+money0(Math.abs(realized)).replace("$","$")):"\u2014"}</div><div class="l">Realized</div><div class="sub">${sold.length} sold</div></div>`;
  if(!owned.length){ $("pstats").insertAdjacentHTML("afterend", `<p style="font-family:var(--mono);font-size:0.78rem;color:var(--ink-faint);margin-top:var(--s4)">No positions yet \u2014 add prints you own in the <a href="collection.html" style="color:var(--accent)">Collection</a> tab.</p>`); }
}

function renderTape(){
  if(!MARKET||!MARKET.listings||!MARKET.listings.length){ $("tape").innerHTML = emptyBox("No market data","Set your Worker URL in Settings to go live."); return; }
  const live=MARKET.listings.filter(l=>l.status!=="gone");
  const s=MARKET.summary||{};
  const drops=live.filter(l=>(l.priceHistory||[]).length>1 && l.priceHistory[l.priceHistory.length-1].landed < l.priceHistory[0].landed)
    .map(l=>{const h=l.priceHistory;return {l,pct:Math.round((1-h[h.length-1].landed/h[0].landed)*100)};}).sort((a,b)=>b.pct-a.pct)[0];
  $("tape").innerHTML = `
    ${tapeRow("Live listings", `${live.length}`, "")}
    ${tapeRow("New since last scan", `${s.new!=null?s.new:0}`, "up")}
    ${tapeRow("Vanished (sold-proxy)", `${s.gone!=null?s.gone:0}`, "down")}
    ${tapeRow("Top mover", drops?`\u25bc ${drops.pct}%`:"\u2014", drops?"down":"", drops?esc(drops.l.print&&drops.l.print.matched?drops.l.print.name:"a listing"):"")}`;
}
function tapeRow(lab, val, cls, note){ return `<div class="tape-row"><span class="lab">${lab}</span><span class="val ${cls||""}">${note?`<span class="n">${note}</span>`:""}${val}</span></div>`; }

function renderDeals(){
  const prints=(CATALOG.prints||[]);
  const deals=[];
  prints.forEach(p=>{ if(p.exclusive) return; const m=marketFor(MARKET,p); if(!m||m.low==null||p.retail==null) return; const r=m.low/p.retail; if(r<=1.0) deals.push({p,m,r}); });
  deals.sort((a,b)=>a.r-b.r);
  if(!deals.length){ $("deals").innerHTML = emptyBox("No deals right now","Nothing live under retail in the current scan."); return; }
  $("deals").innerHTML = deals.slice(0,5).map(({p,m,r})=>{
    const th = p.image? `<img src="${p.image}" alt="">` : `<div style="background:var(--surface-2);width:100%;height:100%;display:grid;place-items:center;color:var(--ink-faint)">${initials(p.name)}</div>`;
    const disc=Math.round((1-r)*100);
    return `<a class="deal" href="catalog.html#${encodeURIComponent(p.print_id||p.name)}">
      <div class="th">${th}</div>
      <div class="mid"><div class="nm">${esc(p.name)}</div><div class="meta">${m.count} live \u00b7 retail ${money(p.retail)}</div></div>
      <div class="px up">${money(m.low)}<div class="d up">${disc}% under</div></div>
    </a>`;
  }).join("");
}

function renderUniverse(){
  const prints=(CATALOG.prints||[]);
  const withImg=prints.filter(p=>p.image).length;
  const excl=prints.filter(p=>p.exclusive).length;
  const onEbay=prints.filter(p=>marketFor(MARKET,p)).length;
  $("universe").innerHTML = `
    <div class="u stat"><div class="v">${prints.length}</div><div class="l">Catalogued</div></div>
    <div class="u stat"><div class="v">${withImg}</div><div class="l">With image</div></div>
    <div class="u stat"><div class="v plumc">${excl}</div><div class="l">Exclusives</div></div>
    <div class="u stat"><div class="v up">${onEbay}</div><div class="l">On eBay now</div></div>`;
}

function emptyBox(h,p){ return `<div class="empty" style="padding:var(--s8) 0"><h3>${esc(h)}</h3><p style="font-size:0.85rem">${esc(p)}</p></div>`; }
