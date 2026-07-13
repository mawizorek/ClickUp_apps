/* Collection ledger. Individual owned copies (D1 inventory), marked to the live market. */
let MARKET={listings:[]}, CATALOG={prints:[]}, INV={inventory:[]};
let disp="own";

initChrome();
boot();

async function boot(){
 const [market,catalog,inv]=await Promise.all([ apiGet("/market",{listings:[],source:"none"}), apiGet("/catalog",null), apiGet("/inventory",{inventory:[]}) ]);
 MARKET=market; CATALOG=catalog&&catalog.prints&&catalog.prints.length?catalog:await seedCatalog(); INV=inv;
 const live=MARKET.source==="ebay-browse"; $("f-src").textContent="market: "+(live?"live \u00b7 eBay":"sample"); $("f-src").className=live?"up":"";
 buildDatalist(); wire(); renderStats(); render();
}
async function seedCatalog(){ try{ const r=await fetch("./catalog.json"); return await r.json(); }catch(e){ return {prints:[]}; } }

function catFor(pid,name){ const prints=CATALOG.prints||[]; if(pid){ const m=prints.find(p=>p.print_id===pid); if(m) return m; } if(name){ const n=normStr(name); const m=prints.find(p=>normStr(p.name)===n); if(m) return m; } return null; }
function unitMkt(r){ const c=catFor(r.print_id,r.name); const m=c?marketFor(MARKET,c):null; if(m&&m.low!=null) return {v:m.low,src:"market low"}; if(c&&c.retail!=null) return {v:c.retail,src:"retail"}; return {v:null,src:"\u2014"}; }

function wire(){
 $("dispChips").querySelectorAll(".chip").forEach(ch=>ch.addEventListener("click",()=>{ disp=ch.dataset.d; $("dispChips").querySelectorAll(".chip").forEach(x=>x.setAttribute("aria-pressed",String(x===ch))); render(); }));
 $("addBtn").addEventListener("click",openAdd);
 const ah=$("addHold"); ah.addEventListener("click",(e)=>{ if(e.target===ah) ah.close(); });
 $("ahClose").addEventListener("click",()=>ah.close()); $("ah-cancel").addEventListener("click",()=>ah.close());
 $("ah-save").addEventListener("click",saveHold);
 document.addEventListener("keydown",(e)=>{ if(e.key==="Escape"&&ah.open) ah.close(); });
}
function buildDatalist(){ $("ah-list").innerHTML=(CATALOG.prints||[]).map(p=>`<option value="${esc(p.name)}">`).join(""); }

function renderStats(){
 const rows=INV.inventory||[]; const owned=rows.filter(r=>r.disposition==="own"); const want=rows.filter(r=>r.disposition==="want"); const sold=rows.filter(r=>r.disposition==="sold");
 let mkt=0,cost=0,marked=0; owned.forEach(r=>{ const u=unitMkt(r); const q=r.qty||1; if(u.v!=null){mkt+=u.v*q;marked++;} if(r.acquired_price!=null) cost+=Number(r.acquired_price)*q; });
 const pl=(marked&&cost)?mkt-cost:null; const realized=sold.reduce((s,r)=>(r.sold_price!=null&&r.acquired_price!=null)?s+(r.sold_price-r.acquired_price):s,0);
 $("pstats").innerHTML=`
  <div class="c"><div class="v">${owned.length}</div><div class="l">Positions</div></div>
  <div class="c"><div class="v">${money0(mkt)}</div><div class="l">Mark-to-market</div></div>
  <div class="c"><div class="v ${pl==null?"flat":pl>=0?"up":"down"}">${pl==null?"\u2014":(pl>=0?"+":"\u2212")+money0(Math.abs(pl)).slice(1)}</div><div class="l">Unrealized P/L</div></div>
  <div class="c"><div class="v ${realized>=0?"up":"down"}">${sold.length?((realized>=0?"+":"\u2212")+money0(Math.abs(realized)).slice(1)):"\u2014"}</div><div class="l">Realized \u00b7 ${sold.length} sold</div></div>`;
}

function render(){
 const rows=(INV.inventory||[]).filter(r=>r.disposition===disp);
 const box=$("ledger");
 if(!rows.length){ box.innerHTML=`<div class="empty"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg><h3>${disp==="own"?"No prints yet":disp==="want"?"Wishlist empty":"Nothing sold"}</h3><p style="font-size:0.85rem">${canWrite()?"Add a holding above.":"Add your write key in Settings to build your collection."}</p></div>`; return; }
 const showMkt=disp!=="sold";
 const head=`<tr><th>Print</th><th class="hide-sm">Cond.</th><th style="text-align:right">${disp==="sold"?"Sold":"Paid"}</th>${showMkt?`<th style="text-align:right">Market</th><th style="text-align:right">P/L</th>`:""}<th></th></tr>`;
 const body=rows.map(r=>{
  const c=catFor(r.print_id,r.name); const u=unitMkt(r); const paid=r.acquired_price;
  const pl=(showMkt&&u.v!=null&&paid!=null)?u.v-paid:null;
  const th=(c&&c.image)?`<img src="${esc(proxied(c.image,76))}" alt="">`:initials(r.name||"?");
  const priceCell = disp==="sold" ? money(r.sold_price) : money(paid);
  return `<tr>
   <td><div class="nm"><div class="th">${th}</div><div><div>${esc(r.name||r.provisional_label||"Untitled")}</div>${!r.print_id?`<div class="prov">provisional</div>`:(c&&c.exclusive?`<div class="prov plumc">${esc(c.exclusive)}</div>`:"")}</div></div></td>
   <td class="hide-sm" style="color:var(--ink-faint);font-family:var(--mono);font-size:0.78rem">${esc(r.condition||"\u2014")}${r.framed?" \u00b7 framed":""}</td>
   <td class="num">${priceCell}</td>
   ${showMkt?`<td class="num">${u.v!=null?money(u.v):"\u2014"}<div style="font-size:0.6rem;color:var(--ink-faint)">${u.src}</div></td><td class="num ${pl==null?"":pl>=0?"up":"down"}">${pl==null?"\u2014":(pl>=0?"+":"\u2212")+money(Math.abs(pl)).slice(1)}</td>`:""}
   <td><div class="rowacts write-only">${disp==="own"?`<button data-a="sell" data-id="${r.inv_id}">Sell</button>`:disp==="want"?`<button data-a="got" data-id="${r.inv_id}">Got it</button>`:""}<button data-a="del" data-id="${r.inv_id}">Del</button></div></td>
  </tr>`;
 }).join("");
 box.innerHTML=`<div class="lgr-wrap"><table class="lgr">${head}${body}</table></div>`;
 document.body.classList.toggle("can-write",canWrite());
 box.querySelectorAll(".rowacts button").forEach(b=>b.addEventListener("click",()=>rowAct(b.dataset.a,b.dataset.id)));
}

async function reload(){ INV=await apiGet("/inventory",{inventory:[]}); renderStats(); render(); }
async function rowAct(a,id){ const r=(INV.inventory||[]).find(x=>x.inv_id===id); if(!r) return;
 try{
 if(a==="del"){ if(!confirm("Remove this holding?")) return; await apiPost("/inventory",{op:"delete",inv_id:id}); toast("removed"); }
 else if(a==="sell"){ const v=prompt("Sold price ($)?", r.acquired_price||""); if(v===null) return; await apiPost("/inventory",{op:"upsert",inv_id:id,print_id:r.print_id,provisional_label:r.provisional_label,disposition:"sold",condition:r.condition,framed:r.framed,qty:r.qty,acquired_price:r.acquired_price,acquired_where:r.acquired_where,sold_price:v?Number(v):null,sold_at:new Date().toISOString()}); toast("marked sold"); }
 else if(a==="got"){ await apiPost("/inventory",{op:"upsert",inv_id:id,print_id:r.print_id,provisional_label:r.provisional_label,disposition:"own",condition:r.condition,qty:r.qty,acquired_price:r.acquired_price,acquired_where:r.acquired_where}); toast("moved to owned"); }
 await reload();
 }catch(e){ toast(e.message,true); }
}

function openAdd(){ $("ah-print").value=""; $("ah-paid").value=""; $("ah-where").value=""; $("ah-cond").value=""; $("ah-disp").value=disp==="want"?"want":"own"; $("addHold").showModal(); $("ah-print").focus(); }
async function saveHold(){
 const name=$("ah-print").value.trim(); if(!name){ toast("pick or type a print",true); return; }
 const c=catFor(null,name);
 const body={ op:"upsert", disposition:$("ah-disp").value, condition:$("ah-cond").value||null, acquired_price:$("ah-paid").value?Number($("ah-paid").value):null, acquired_where:$("ah-where").value||null, qty:1 };
 if(c&&c.print_id) body.print_id=c.print_id; else body.provisional_label=name;
 try{ toast("saving\u2026"); await apiPost("/inventory",body); $("addHold").close(); toast("holding saved"); if(body.disposition!==disp){ disp=body.disposition; $("dispChips").querySelectorAll(".chip").forEach(x=>x.setAttribute("aria-pressed",String(x.dataset.d===disp))); } await reload(); }catch(e){ toast(e.message,true); }
}
