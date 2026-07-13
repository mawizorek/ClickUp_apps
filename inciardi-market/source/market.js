/* Market radar. Reads /market + cross-refs /catalog for per-print retail. */
let MARKET={listings:[]}, CATALOG={prints:[]};
let flag="all";
const BASELINE=14;

initChrome();
boot();

async function boot(){
  const [market,catalog]=await Promise.all([ apiGet("/market",{listings:[],source:"none"}), apiGet("/catalog",null) ]);
  MARKET=market; CATALOG=catalog&&catalog.prints?catalog:await seed();
  const live=MARKET.source==="ebay-browse"; const pill=live?"live \u00b7 eBay":"sample data";
  $("live-pill").textContent=pill; $("f-src").textContent="prices: "+pill; $("f-src").className=live?"up":"";
  buildChips(); renderStrip(); render();
}
async function seed(){ try{ const r=await fetch("./catalog.json"); return await r.json(); }catch(e){ return {prints:[]}; } }

function retailFor(l){ if(!l.print||!l.print.name) return null; const n=normStr(l.print.name); const p=(CATALOG.prints||[]).find(x=>normStr(x.name)===n||(x.aliases||[]).some(a=>normStr(a)===n)); return p&&p.retail!=null?p.retail:null; }
function isExcl(l){ return l.print&&l.print.exclusive; }
function isPack(l){ return (l.flags||[]).includes("pack-deal"); }
function verdict(l){ const base=retailFor(l)||BASELINE;
  if(isExcl(l)){ if(l.landed<=40) return {k:"buy",t:"under exclusive floor"}; if(l.landed<=70) return {k:"hold",t:"fair for exclusive"}; return {k:"pass",t:"priced high"}; }
  if(isPack(l)) return (l.landed/5<=base*0.7)?{k:"buy",t:"cheap per print"}:{k:"hold",t:"pack, check count"};
  const r=l.landed/base; if(r<=0.75) return {k:"buy",t:Math.round((1-r)*100)+"% under retail"}; if(r<=1.05) return {k:"hold",t:"around retail"}; return {k:"pass",t:Math.round((r-1)*100)+"% over"}; }
function delta(l){ const base=retailFor(l); if(base==null) return null; const pct=Math.round((l.landed/base-1)*100); return {pct, cls:pct<0?"up":pct>0?"down":"flat"}; }

function renderStrip(){
  const live=(MARKET.listings||[]).filter(l=>l.status!=="gone"); const s=MARKET.summary||{};
  const deals=live.filter(l=>!isExcl(l)&&verdict(l).k==="buy").length;
  $("strip").innerHTML=`
    <div class="s"><div class="v">${live.length}</div><div class="l">Live listings</div></div>
    <div class="s"><div class="v up">${deals}</div><div class="l">Under-retail buys</div></div>
    <div class="s"><div class="v">${s.new||0}</div><div class="l">New</div></div>
    <div class="s"><div class="v down">${s.gone||0}</div><div class="l">Vanished</div></div>
    <div class="s"><div class="v plum">${live.filter(isExcl).length}</div><div class="l">Exclusives</div></div>`;
}
function buildChips(){
  const flags=[["all","All"],["underpriced","Under retail"],["exclusive","Exclusive"],["pack-deal","Packs"],["new","New"],["gone","Vanished"]];
  $("flagChips").innerHTML=flags.map(([f,l])=>`<button class="chip" data-f="${f}" aria-pressed="${f==="all"}">${l}</button>`).join("");
  $("flagChips").querySelectorAll(".chip").forEach(c=>c.addEventListener("click",()=>{ flag=c.dataset.f; $("flagChips").querySelectorAll(".chip").forEach(x=>x.setAttribute("aria-pressed",String(x===c))); render(); }));
}
function render(){
  if(!MARKET.listings||!MARKET.listings.length){ $("list").innerHTML=`<div class="empty"><h3>No market data</h3><p style="font-size:0.85rem">Set your Worker URL in Settings to go live.</p></div>`; $("countLine").textContent=""; return; }
  let list=MARKET.listings.slice();
  if(flag==="gone") list=list.filter(l=>l.status==="gone");
  else { list=list.filter(l=>l.status!=="gone"); if(flag==="new") list=list.filter(l=>l.status==="new"); else if(flag!=="all") list=list.filter(l=>(l.flags||[]).includes(flag)); }
  list.sort((a,b)=>{ const rank=v=>v==="buy"?0:v==="hold"?1:2; return rank(verdict(a).k)-rank(verdict(b).k)||a.landed-b.landed; });
  const goneNote = flag!=="gone" ? gone() : "";
  $("countLine").innerHTML=`<b>${list.length}</b> listing${list.length!==1?"s":""}${flag!=="all"?" \u00b7 "+flag.replace("-"," "):""}`;
  $("list").innerHTML=goneNote+(list.map(row).join("")||`<div class="empty"><h3>Nothing here</h3><p style="font-size:0.85rem">Loosen the filter.</p></div>`);
}
function gone(){ const g=(MARKET.listings||[]).filter(l=>l.status==="gone"); if(!g.length) return ""; return `<div class="gone-note"><b>${g.length}</b> listing${g.length>1?"s":""} vanished since the last scan \u2014 logged as sold-proxy data. Likely sold; the market's thinning.</div>`; }
function row(l){ const v=verdict(l); const d=delta(l); const name=l.print&&l.print.matched?esc(l.print.name):"unmatched";
  return `<a class="mrow" href="${esc(l.url||"#")}" target="_blank" rel="noopener">
    <div class="mid"><div class="t">${esc(l.title||name)}</div>
      <div class="meta"><span>${name}</span><span>\u00b7 ${esc(l.condition||"")}</span>${(l.flags||[]).map(f=>`<span class="chip ${f==="exclusive"?"plum":f==="underpriced"?"up":""}">${f.replace("-"," ")}</span>`).join("")}</div></div>
    <div class="px"><div class="amt">${money(l.landed)}</div>${d?`<div class="d ${d.cls}">${d.pct>0?"+":""}${d.pct}% vs retail</div>`:`<div class="d flat">${l.shipping?"+"+money(l.shipping)+" ship":"free ship"}</div>`}<div style="margin-top:5px"><span class="verdict ${v.k}">${v.k}</span></div></div>
  </a>`;
}
