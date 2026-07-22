/* Inciardi Market v15 — shared core: API client, chrome, helpers. Loaded before each page's own js. */
const BUILD = "v15";
const PR = 455; // merged PR that shipped this version
const API_DEFAULT = "https://inciardi-market.mawizorek-online.workers.dev";
const API_TIMEOUT_MS = 6000; // dead/slow Worker must fail fast so the seed fallback can render

// ============================================================ SOFT LOGIN (fill these in once)
// Michael + Nick clear/refresh browsers constantly, so pasting the write key each time never sticks.
// Baking the two keys here lets each person tap their name once and stay "signed in" across browser
// clears (the identity is re-applied from source, not just localStorage).
//
// ⚠️ ACCEPTED TRADEOFF (Michael, 2026-07-22): this is a public GitHub Pages site, so anything shipped
// here is readable in view-source. For a 2-person, no-personal-data print tracker this is a deliberately
// accepted low risk — worst case is a corrupted catalog/collection, and that's covered by BOTH the in-app
// Backups below AND D1 Time Travel (30-day point-in-time restore). See the Decision Log.
//
// HOW TO FILL: paste each person's write key between the quotes and commit. Leave a value "" to hide that
// identity button (that person just pastes their key manually in the field below instead). If Nick shares
// Michael's key for now, put the SAME string in both — attribution just both reads "michael" server-side.
const LOGINS = {
  michael: "",   // <-- paste Michael's WRITE_KEY here
  nick:    "",   // <-- paste Nick's key here (set WRITE_KEY_NICK on the Worker), or reuse Michael's
};

const $ = (id) => document.getElementById(id);
function apiBase(){ return (localStorage.getItem("inciardi_ep") || "").trim() || API_DEFAULT; }
function wkey(){ return (localStorage.getItem("inciardi_wkey") || "").trim(); }
function canWrite(){ return !!wkey(); }
function whoami(){ return localStorage.getItem("inciardi_identity") || ""; }
// Sign in as a named identity: applies that person's baked-in key. Survives browser clears because the
// value comes from LOGINS (source), not from whatever localStorage happened to keep.
function setIdentity(name){
  const key = (LOGINS[name] || "").trim();
  if(!key){ toast("No key set for "+name+" — paste it in the field below once", true); return false; }
  localStorage.setItem("inciardi_wkey", key);
  localStorage.setItem("inciardi_identity", name);
  document.body.classList.toggle("can-write", true);
  return true;
}
function signOut(){ localStorage.removeItem("inciardi_wkey"); localStorage.removeItem("inciardi_identity"); document.body.classList.toggle("can-write", false); }

async function apiGet(path, fallback){
 const key = "cache:" + path;
 const ctrl = new AbortController();
 const timer = setTimeout(()=>ctrl.abort(), API_TIMEOUT_MS);
 try{
 let d;
 try{
 const r = await fetch(apiBase() + path, { headers:{ Accept:"application/json" }, signal: ctrl.signal });
 if(!r.ok) throw 0; d = await r.json(); if(d && d.error) throw 0;
 } finally { clearTimeout(timer); }
 try{ localStorage.setItem(key, JSON.stringify(d)); }catch(e){}
 return d;
 }catch(e){
 const c = localStorage.getItem(key); if(c){ try{ return JSON.parse(c); }catch(_){} }
 return fallback;
 }
}
async function apiPost(path, body){
 const ctrl = new AbortController();
 const timer = setTimeout(()=>ctrl.abort(), API_TIMEOUT_MS);
 try{
 const r = await fetch(apiBase() + path, { method:"POST", headers:{ "Content-Type":"application/json", "x-write-key": wkey() }, body: JSON.stringify(body), signal: ctrl.signal });
 const d = await r.json().catch(()=>({}));
 if(!r.ok || (d && d.error)) throw new Error((d && d.error) || ("HTTP "+r.status));
 return d;
 } finally { clearTimeout(timer); }
}

/* ---- formatting ---- */
function money(n){ if(n==null||isNaN(n)) return "\u2014"; const v=Number(n); return (v<0?"-$":"$")+Math.abs(v).toFixed(2); }
function money0(n){ if(n==null||isNaN(n)) return "\u2014"; const v=Number(n); return (v<0?"-$":"$")+Math.abs(v).toFixed(0); }
function pct(n){ if(n==null||isNaN(n)) return "\u2014"; return (n>0?"+":"")+Math.round(n)+"%"; }
function esc(s){ return String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
function normStr(s){ return String(s||"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim(); }
function fmtDate(s){ try{ return new Date(s).toLocaleDateString(undefined,{month:"short",day:"numeric"}); }catch(e){ return s; } }
function fmtDateTime(s){ try{ return new Date(s).toLocaleString(undefined,{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}); }catch(e){ return s; } }
function initials(n){ return String(n||"?").split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase(); }

/* ---- image URL: route raw CDN images through the Worker /img proxy (edge-cached, same-origin) ---- */
// D1-served images already come as absolute .../img?key= or .../img?u= URLs and pass through untouched.
// Seed/raw cdn.shopify.com URLs get rewritten to /img?u= so they never hotlink (the flash-then-vanish fix).
function proxied(url, w){
 if(!url) return url;
 if(url.indexOf("/img?") >= 0) return url;
 if(/^https?:\/\/cdn\.shopify\.com/i.test(url)) return apiBase() + "/img?u=" + encodeURIComponent(url) + (w ? "&w=" + w : "");
 return url;
}

/* ---- market cross-reference (shared) ---- */
// Given a MARKET payload + a print {name,aliases}, return {count, low} of matching live listings.
function marketFor(MARKET, p){
 if(!MARKET || !MARKET.listings) return null;
 const names = [normStr(p.name), ...((p.aliases||[]).map(normStr))].filter(Boolean);
 const ls = MARKET.listings.filter(l => { if(l.status=="gone") return false; const n = l.print && l.print.matched && normStr(l.print.name); return n && names.includes(n); });
 if(!ls.length) return null;
 const prices = ls.map(l=>l.landed).filter(x=>x!=null);
 return { count: ls.length, low: prices.length?Math.min(...prices):null, high: prices.length?Math.max(...prices):null };
}

/* ---- chrome: nav active, gear/drawer, theme, write-key, footer ---- */
function initTheme(){ const t=$("themeToggle"); if(!t) return;
 if(localStorage.getItem("inciardi_theme")=="light"){ document.documentElement.dataset.theme="light"; t.setAttribute("aria-pressed","false"); } else { t.setAttribute("aria-pressed","true"); }
 t.addEventListener("click",()=>{ const light=document.documentElement.dataset.theme=="light";
 if(light){ delete document.documentElement.dataset.theme; localStorage.setItem("inciardi_theme","dark"); t.setAttribute("aria-pressed","true"); }
 else { document.documentElement.dataset.theme="light"; localStorage.setItem("inciardi_theme","light"); t.setAttribute("aria-pressed","false"); } });
}
/* ---- mobile slide-out nav: hamburger + right-side drawer, built from the existing .nav so pages stay DRY ---- */
function buildMobileNav(){
 const row = document.querySelector(".topbar .row");
 const nav = row && row.querySelector(".nav");
 if(!row || !nav || $("navToggle")) return;
 const btn = document.createElement("button");
 btn.className = "navtoggle"; btn.id = "navToggle";
 btn.setAttribute("aria-label","Menu"); btn.setAttribute("aria-expanded","false"); btn.setAttribute("aria-controls","navDrawer");
 btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
 const gear = $("gear");
 row.insertBefore(btn, gear || null);
 const backdrop = document.createElement("div");
 backdrop.className = "navdrawer-backdrop"; backdrop.id = "navBackdrop";
 const drawer = document.createElement("aside");
 drawer.className = "navdrawer"; drawer.id = "navDrawer"; drawer.setAttribute("aria-hidden","true"); drawer.setAttribute("aria-label","Menu");
 const links = Array.from(nav.querySelectorAll("a")).map(a=>{
 const cur = a.getAttribute("aria-current")=="page";
 return `<a href="${a.getAttribute("href")}"${cur?' aria-current="page"':''}>${esc(a.textContent.trim())}</a>`;
 }).join("");
 drawer.innerHTML = `<div class="navdrawer-h"><span class="brand"><span class="dot"></span>Inciardi Market</span><button class="x" id="navClose" aria-label="Close menu"><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div><nav class="navdrawer-links">${links}</nav>`;
 document.body.appendChild(backdrop);
 document.body.appendChild(drawer);
 const open=()=>{ document.body.classList.add("nav-open"); drawer.setAttribute("aria-hidden","false"); btn.setAttribute("aria-expanded","true"); };
 const close=()=>{ document.body.classList.remove("nav-open"); drawer.setAttribute("aria-hidden","true"); btn.setAttribute("aria-expanded","false"); };
 btn.addEventListener("click",()=>{ document.body.classList.contains("nav-open") ? close() : open(); });
 backdrop.addEventListener("click",close);
 $("navClose").addEventListener("click",close);
 drawer.querySelectorAll("a").forEach(a=>a.addEventListener("click",close));
 document.addEventListener("keydown",(e)=>{ if(e.key=="Escape"&&document.body.classList.contains("nav-open")) close(); });
}

/* ---- account + backups: injected into the #settings drawer so every page gets it from one place ---- */
function buildAccountUI(){
 const drawer = document.querySelector("#settings .drawer");
 if(!drawer || $("acctBlock")) return;
 const sec = document.createElement("div");
 sec.id = "acctBlock";
 const idButtons = Object.keys(LOGINS).filter(n=>(LOGINS[n]||"").trim())
   .map(n=>`<button class="btn sm idbtn" data-id="${n}">${n[0].toUpperCase()+n.slice(1)}</button>`).join("");
 sec.innerHTML = `
  <hr class="acct-sep">
  <div class="acct-h">Who's using this</div>
  <div class="acct-who" id="acctWho"></div>
  ${idButtons?`<div class="idrow">${idButtons}<button class="btn sm ghost" id="signOutBtn">Sign out</button></div>`
    :`<p class="acct-note">No saved logins yet. Paste a key above once; ask Brain to bake in tap-to-switch logins.</p>`}

  <div class="acct-h" style="margin-top:var(--s5)">Backups</div>
  <p class="acct-note">A backup saves your whole catalog + collection. Restoring reinstates them if something gets wiped. (Cloudflare also keeps a 30-day auto history behind this.)</p>
  <div class="idrow"><button class="btn sm primary" id="backupNow">Back up now</button><button class="btn sm" id="backupList">Show backups</button></div>
  <div id="snapList" class="snaplist"></div>`;
 drawer.appendChild(sec);

 renderWho();
 sec.querySelectorAll(".idbtn").forEach(b=>b.addEventListener("click",()=>{ if(setIdentity(b.dataset.id)){ renderWho(); toast("Signed in as "+b.dataset.id); } }));
 const so=$("signOutBtn"); if(so) so.addEventListener("click",()=>{ signOut(); renderWho(); toast("signed out"); });
 $("backupNow").addEventListener("click",backupNow);
 $("backupList").addEventListener("click",loadSnapshots);
}
function renderWho(){
 const el=$("acctWho"); if(!el) return;
 const who=whoami();
 el.innerHTML = canWrite()
   ? `Signed in${who?` as <b>${esc(who[0].toUpperCase()+who.slice(1))}</b>`:" (manual key)"} · editing unlocked`
   : `Read-only — tap a name or paste a key to edit`;
}
async function backupNow(){
 if(!canWrite()){ toast("sign in first",true); return; }
 try{ toast("backing up\u2026"); const r=await apiPost("/snapshot",{}); toast(`backed up · ${r.counts?r.counts.inventory:"?"} owned, ${r.counts?r.counts.catalog:"?"} catalog`); loadSnapshots(); }
 catch(e){ toast(e.message,true); }
}
async function loadSnapshots(){
 const box=$("snapList"); if(!box) return;
 if(!canWrite()){ box.innerHTML=`<div class="acct-note">Sign in to see backups.</div>`; return; }
 box.innerHTML=`<div class="acct-note">loading…</div>`;
 try{
  const r=await apiGet("/snapshots",{snapshots:[]});
  const list=(r.snapshots||[]);
  if(!list.length){ box.innerHTML=`<div class="acct-note">No backups yet. Hit “Back up now.”</div>`; return; }
  box.innerHTML=list.slice(0,12).map(s=>{
    const label=fmtDateTime(s.uploaded)+(/_pre-restore\./.test(s.key)?" · auto (pre-restore)":"");
    return `<div class="snaprow"><span class="snapts">${esc(label)}</span><button class="btn sm restore" data-key="${esc(s.key)}">Restore</button></div>`;
  }).join("");
  box.querySelectorAll(".restore").forEach(b=>b.addEventListener("click",()=>restoreSnap(b.dataset.key)));
 }catch(e){ box.innerHTML=`<div class="acct-note">${esc(e.message)}</div>`; }
}
async function restoreSnap(key){
 if(!confirm("Restore this backup? Your collection is replaced with the backup's, and catalog names/edits are rolled back to it. A safety backup of right-now is taken first.")) return;
 try{ toast("restoring\u2026"); const r=await apiPost("/restore",{key}); toast(`restored · ${r.restored?r.restored.inventory:"?"} owned back`); setTimeout(()=>location.reload(),900); }
 catch(e){ toast(e.message,true); }
}

function initChrome(){
 initTheme();
 buildMobileNav();
 const gear=$("gear"), drawer=$("settings");
 if(gear&&drawer){
 gear.addEventListener("click",()=>{ drawer.showModal(); gear.setAttribute("aria-expanded","true"); });
 const c=$("settingsClose"); if(c) c.addEventListener("click",()=>drawer.close());
 drawer.addEventListener("click",(e)=>{ if(e.target==drawer) drawer.close(); });
 drawer.addEventListener("close",()=>gear.setAttribute("aria-expanded","false"));
 document.addEventListener("keydown",(e)=>{ if(e.key=="Escape"&&drawer.open) drawer.close(); });
 }
 const ep=$("epInput"); if(ep){ ep.value=localStorage.getItem("inciardi_ep")||""; ep.addEventListener("change",()=>{ localStorage.setItem("inciardi_ep",ep.value.trim()); location.reload(); }); }
 const wk=$("wkeyInput"); if(wk){ wk.value=localStorage.getItem("inciardi_wkey")||""; wk.addEventListener("change",()=>{ localStorage.setItem("inciardi_wkey",wk.value.trim()); localStorage.removeItem("inciardi_identity"); toast(canWrite()?"Write key saved \u2014 editing unlocked":"Write key cleared"); document.body.classList.toggle("can-write",canWrite()); if($("acctWho")) renderWho(); }); }
 document.body.classList.toggle("can-write",canWrite());
 buildAccountUI();
 const fb=$("f-build"); if(fb) fb.textContent = `Inciardi Market ${BUILD}${PR?" \u00b7 PR #"+PR:""}`;
}
let _toastT;
function toast(msg, isErr){ let t=$("toast"); if(!t){ t=document.createElement("div"); t.id="toast"; t.className="toast"; document.body.appendChild(t); }
 t.textContent=msg; t.className="toast show"+(isErr?" err":""); clearTimeout(_toastT); _toastT=setTimeout(()=>t.className="toast"+(isErr?" err":""),2600); }

/* ---- downscale an image File to a base64 data payload (keeps R2 lean) ---- */
function fileToScaledB64(file, maxDim){
 return new Promise((resolve,reject)=>{
 const img=new Image(); const url=URL.createObjectURL(file);
 img.onload=()=>{ URL.revokeObjectURL(url);
 let {width:w,height:h}=img; const m=maxDim||1400; if(Math.max(w,h)>m){ const s=m/Math.max(w,h); w=Math.round(w*s); h=Math.round(h*s); }
 const c=document.createElement("canvas"); c.width=w; c.height=h; c.getContext("2d").drawImage(img,0,0,w,h);
 const type = file.type=="image/png" ? "image/png" : "image/jpeg";
 const data=c.toDataURL(type, type=="image/jpeg"?0.86:undefined);
 resolve({ data, content_type:type, width:w, height:h });
 };
 img.onerror=()=>{ URL.revokeObjectURL(url); reject(new Error("bad image")); };
 img.src=url;
 });
}
