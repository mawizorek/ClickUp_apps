/* Inciardi Market v22 — shared core: API client, chrome, helpers. Loaded before each page's own js. */
const BUILD = "v22";
const PR = 483; // merged PR that shipped this version
const API_DEFAULT = "https://inciardi-market.mawizorek-online.workers.dev";

// Timeouts are PER-PATH now. A flat 6s was the bug: /catalog returns 177 prints each with a nested
// image array, and on mobile that legitimately exceeds 6s — so the abort fired on a HEALTHY request
// and the app fell back to stale localStorage. See the FETCH HONESTY LAW below.
const API_TIMEOUT_MS = 9000;            // default
const API_TIMEOUT_HEAVY_MS = 25000;     // /catalog, /market — big payloads, be patient
const HEAVY_PATHS = ["/catalog", "/market", "/inventory"];
function timeoutFor(path){ return HEAVY_PATHS.some(p=>path.startsWith(p)) ? API_TIMEOUT_HEAVY_MS : API_TIMEOUT_MS; }

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
// 🔴 OPEN ACTION (code review, 2026-07-25): the accepted tradeoff covered baking a key into a public
// bundle. It did NOT cover a GUESSABLE key. The two values below are short dictionary words, which means
// the store is writable by anyone who guesses — not merely by anyone who reads the source. Rotate to long
// random strings: `wrangler secret put WRITE_KEY` + `wrangler secret put WRITE_KEY_NICK`, then paste the
// new values here and commit. Same exposure model as agreed, minus the drive-by. Michael holds the secrets.
//
// HOW TO FILL: paste each person's write key between the quotes and commit. Leave a value "" to hide that
// identity button (that person just pastes their key manually in the field below instead). If Nick shares
// Michael's key for now, put the SAME string in both — attribution just both reads "michael" server-side.
const LOGINS = {
  michael: "mikey",   // <-- paste Michael's WRITE_KEY here
  nick:    "nickey",   // <-- paste Nick's key here (set WRITE_KEY_NICK on the Worker), or reuse Michael's
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

/* ============================================================ FETCH HONESTY LAW
   🔴 A CACHE THAT FAILS SILENTLY DOES NOT DEGRADE GRACEFULLY — IT LIES.

   This is the single most expensive lesson in this app's history. On 2026-07-25 three separate
   caching layers each independently served stale data with no visible signal, and the cost was an
   entire day of misdiagnosis: fixes shipped, verified correct in the database, and the phone kept
   showing old values. Every "it's still broken" report was HALF TRUE — the code was fixed, the data
   was old — which is the most confusing possible failure mode because it makes correct fixes look
   wrong and sends you re-fixing working code.

   The three layers, all of which I built as "resilience":
     1. HTTP cache — worker.js sets no Cache-Control. Fixed v17 with cache:"no-store".
     2. Stylesheet cache — a CSS-only fix was defeated by the cache it was fixing. Fixed v19 with an
        inline style + a static #f-assets version marker.
     3. localStorage fallback — THIS ONE. apiGet aborted at a flat 6s and silently substituted an old
        snapshot. /catalog (177 prints + nested image arrays) legitimately exceeds 6s on mobile, so
        the abort was firing on HEALTHY requests and the fallback was winning ROUTINELY, not rarely.

   THE LAW, and it generalizes past this app:
   • Any fallback path MUST announce itself in the UI. Not console. Not a comment. On screen, where
     the person looking at the wrong number can see WHY it's wrong.
   • A timeout must be sized to the payload it guards, not to a round number that felt nice.
   • Cached data must carry its age. "Stale" with no timestamp is unactionable.
   • Prefer showing NOTHING with an honest error over showing OLD data silently. A blank state sends
     you to the network; a stale state sends you to re-fix working code.
   • Corollary from the v18/v19 image saga: this is the same disease as gating visibility on a JS
     class. Both make a failure invisible. Invisible failures get misattributed to the wrong layer.
============================================================================================ */

const NO_STORE = { cache: "no-store" };

// Provenance ledger: every read records HOW it resolved. The UI reads this, so the app can never
// again present cached data as if it were live.
const FETCH_STATE = {};   // path -> { source:"live"|"cache"|"empty", at:ms, age:ms|null, error:string|null }
function fetchState(){ return FETCH_STATE; }
function isStale(){ return Object.values(FETCH_STATE).some(s=>s.source==="cache"); }
function staleSummary(){
 const bad=Object.entries(FETCH_STATE).filter(([,s])=>s.source!=="live");
 if(!bad.length) return null;
 const oldest=bad.reduce((a,[,s])=>Math.max(a,s.age||0),0);
 return { paths:bad.map(([p])=>p), oldest, error:(bad.find(([,s])=>s.error)||[])[1]?.error||null };
}

async function apiGet(path, fallback){
 const key = "cache:" + path, stampKey = "cachedAt:" + path;
 const ctrl = new AbortController();
 const timer = setTimeout(()=>ctrl.abort(), timeoutFor(path));
 try{
  let d;
  try{
   const r = await fetch(apiBase() + path, { headers:{ Accept:"application/json" }, signal: ctrl.signal, ...NO_STORE });
   if(!r.ok) throw new Error("HTTP "+r.status);
   d = await r.json();
   if(d && d.error) throw new Error(d.error);
  } finally { clearTimeout(timer); }
  try{ localStorage.setItem(key, JSON.stringify(d)); localStorage.setItem(stampKey, String(Date.now())); }catch(e){}
  FETCH_STATE[path] = { source:"live", at:Date.now(), age:0, error:null };
  renderDataBanner();
  return d;
 }catch(e){
  // FALLBACK — and it is now LOUD. It still serves the cached copy (offline is a real use case on a
  // phone in a shop) but it records the provenance and paints a banner, so a wrong number on screen
  // always comes with the reason it's wrong. Never silent. Never again.
  const msg = (e && e.name==="AbortError") ? "timed out" : ((e && e.message) || "request failed");
  const c = localStorage.getItem(key);
  if(c){
   try{
    const parsed = JSON.parse(c);
    const at = Number(localStorage.getItem(stampKey)) || null;
    FETCH_STATE[path] = { source:"cache", at, age: at ? Date.now()-at : null, error: msg };
    renderDataBanner();
    return parsed;
   }catch(_){}
  }
  FETCH_STATE[path] = { source:"empty", at:Date.now(), age:null, error: msg };
  renderDataBanner();
  return fallback;
 }
}
async function apiPost(path, body){
 const ctrl = new AbortController();
 const timer = setTimeout(()=>ctrl.abort(), timeoutFor(path));
 try{
  const r = await fetch(apiBase() + path, { method:"POST", headers:{ "Content-Type":"application/json", "x-write-key": wkey() }, body: JSON.stringify(body), signal: ctrl.signal, ...NO_STORE });
  const d = await r.json().catch(()=>({}));
  if(!r.ok || (d && d.error)) throw new Error((d && d.error) || ("HTTP "+r.status));
  return d;
 }catch(e){
  // A write that times out is NOT a write that failed — it may well have landed. Say exactly that
  // rather than implying it didn't; a false "failed" makes people re-submit and double-write.
  if(e && e.name==="AbortError") throw new Error("timed out — the save may or may not have landed; reload to check");
  throw e;
 } finally { clearTimeout(timer); }
}

// The banner. Fixed to the top, impossible to miss, names the age and the reason.
// Deliberately NOT a toast: a toast disappears, and this condition persists until a reload succeeds.
function renderDataBanner(){
 const s = staleSummary();
 let el = $("dataBanner");
 if(!s){ if(el) el.remove(); return; }
 if(!el){
  el = document.createElement("div");
  el.id = "dataBanner"; el.className = "databanner";
  document.body.appendChild(el);
 }
 const anyCache = Object.values(FETCH_STATE).some(x=>x.source==="cache");
 const ageTxt = s.oldest ? relAge(s.oldest) : null;
 el.className = "databanner " + (anyCache ? "warn" : "err");
 el.innerHTML = anyCache
  ? `<b>Showing saved data${ageTxt?` from ${ageTxt}`:""}</b> — couldn't reach the database (${esc(s.error||"offline")}). Prices and photos may be out of date. <button class="bnr-btn" id="bnrRetry">Retry</button>`
  : `<b>No data</b> — couldn't reach the database (${esc(s.error||"offline")}). <button class="bnr-btn" id="bnrRetry">Retry</button>`;
 const b = $("bnrRetry"); if(b) b.addEventListener("click",()=>location.reload());
}
function relAge(ms){
 const m=Math.round(ms/60000);
 if(m<1) return "moments ago";
 if(m<60) return m+" min ago";
 const h=Math.round(m/60); if(h<24) return h+" hr ago";
 return Math.round(h/24)+" days ago";
}
// Nuke every cached payload — the manual escape hatch for "I don't trust what I'm seeing."
function clearDataCache(){
 Object.keys(localStorage).filter(k=>k.startsWith("cache:")||k.startsWith("cachedAt:")).forEach(k=>localStorage.removeItem(k));
 toast("local data cache cleared — reloading");
 setTimeout(()=>location.reload(),700);
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
// NOTE the asymmetry that bit us: `w` only does anything on the ?u= (CDN) branch. On a ?key= (R2) URL the
// Worker cannot resize a stored blob, so the width is silently dropped. See the law below.
function proxied(url, w){
 if(!url) return url;
 if(url.indexOf("/img?") >= 0) return url;
 if(/^https?:\/\/cdn\.shopify\.com/i.test(url)) return apiBase() + "/img?u=" + encodeURIComponent(url) + (w ? "&w=" + w : "");
 return url;
}

/* ============================================================ IMAGE RENDERING LAW
   Photos have vanished from this app FIVE times — five different root causes, one identical symptom.
   Full incident table in inciardi-market/README.md. Read before touching any <img>.

   1. NEVER paint an archival original into a list or grid. Originals here run 1-3MB; 177 of them
      is ~260MB, and a phone will decode a handful (the flash) then purge or time out the rest
      (the vanish). Grids get a WIDTH-CAPPED DERIVATIVE. Only a detail hero may load the original.
   2. If an image route accepts a size param, EVERY branch must honor it — or the param is a lie.
      The card asked for proxied(url, 360) and was handed the full-res R2 file anyway, because
      /img?key= ignores `w`. Thumbnails resolve against the Shopify CDN source_url, where width=
      genuinely resizes (server-side, edge-cached 7 days).
   3. An error handler may NEVER retry the same URL with a cache-bust. The old one did exactly that,
      re-downloading the multi-MB file that had just failed, then hid the element outright on the
      second miss. A retry moves DOWN the ladder to a DIFFERENT source; only the last rung gives up.
   4. Grid images are always loading="lazy" + decoding="async".
   5. R2 holds ARCHIVAL bytes and the harvest only writes derivatives GOING FORWARD — never
      retroactively. The 177 pre-2026-07-25 originals are still full-res (3 are HEIC under a .jpg
      key, blank outside Safari). That's why thumbs resolve to the CDN: correct TODAY, independent
      of a re-scrub that hasn't run. Don't "simplify" thumbs back onto ?key=.
   6. 🔴 NEVER gate visibility on a JavaScript class. No opacity:0 + .loaded, no fade from invisible.
      If the mechanism fails the content disappears AND the failure is invisible in every log — it
      looks exactly like a data problem. Cost three misdiagnoses. Default visible, placeholder behind.
      Corollary: when content doesn't appear, read the CSS BEFORE the pipeline.
   7. A placeholder must always carry identifying content (initials, label, alt). A featureless box
      makes "failed to load" and "nothing to load" indistinguishable — a diagnostic dead end.
============================================================================================ */

// The image row the app should treat as "the" picture for a print.
function primaryImage(p){
 const imgs=(p&&p.images)||[];
 return imgs.find(i=>i.is_primary&&i.status=="active") || imgs.find(i=>i.status=="active") || null;
}
// Ordered fallback chain for a THUMBNAIL — cheapest and most-likely-to-work first.
function imgLadder(p, w){
 if(!p) return [];
 const im=primaryImage(p);
 const cdn=(im&&im.source_url) || (/^https?:\/\/cdn\.shopify\.com/i.test(p.image||"") ? p.image : "");
 const out=[];
 if(cdn) out.push(proxied(cdn, w)); // resized derivative (~40KB) — the rung that should always win
 if(im&&im.url) out.push(im.url);   // stored R2 copy, full size
 if(p.image) out.push(p.image);     // whatever /catalog handed us
 if(cdn) out.push(cdn);             // bare CDN original, unproxied — last resort
 return [...new Set(out.filter(Boolean))];
}
function thumbSrc(p, w){ return imgLadder(p, w)[0] || ""; }

// Detail hero: here the archival copy IS the right answer (one image, explicitly requested).
function heroLadder(p, w){
 if(!p) return [];
 const im=primaryImage(p);
 const cdn=(im&&im.source_url) || (/^https?:\/\/cdn\.shopify\.com/i.test(p.image||"") ? p.image : "");
 const out=[];
 if(im&&im.url) out.push(im.url);
 if(p.image) out.push(p.image);
 if(cdn) out.push(proxied(cdn, w));
 return [...new Set(out.filter(Boolean))];
}
function heroSrc(p, w){ return heroLadder(p, w)[0] || ""; }

// Same rules for a bare print_image row (the image-manager chips in the catalog drawer).
function imageLadder(i, w){
 if(!i) return [];
 const out=[];
 if(i.source_url && /^https?:\/\/cdn\.shopify\.com/i.test(i.source_url)) out.push(proxied(i.source_url, w));
 if(i.url) out.push(i.url);
 if(i.source_url) out.push(i.source_url);
 return [...new Set(out.filter(Boolean))];
}
function imageThumb(i, w){ return imageLadder(i, w)[0] || ""; }

// Own the load/error lifecycle for one <img>: flag it loaded, and walk the ladder on failure.
function wireImg(img, ladder){
 if(!img) return;
 const alts=(ladder||[]).filter(Boolean);
 let i=0;
 const done=()=>img.classList.add("loaded");
 if(img.complete && img.naturalWidth) done(); else img.addEventListener("load",done);
 img.addEventListener("error",()=>{
  while(i<alts.length && alts[i]===img.getAttribute("src")) i++;
  if(i<alts.length){ img.src=alts[i++]; return; } // next rung: a DIFFERENT url, never a cache-bust
  img.style.display="none";                       // ladder exhausted -> let the initials tile show
 });
}

/* ---- market cross-reference (shared) ---- */
// Given a MARKET payload + a print {name,aliases}, return {count, low} of matching live listings.
// ⚠️ ARCHITECTURALLY DOOMED, kept only until the registry inversion lands (2026-07-25 ruling).
// This matches listing titles BACKWARDS onto catalog names, so any listing whose title we can't
// parse is silently invisible. The replacement is registry-driven: one query PER ARTWORK using its
// real name + aliases, so every result is bound to an artwork by construction. This function gets
// DELETED then, not fixed.
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

  <div class="acct-h" style="margin-top:var(--s5)">Data</div>
  <div class="acct-note" id="dataDiag"></div>
  <div class="idrow"><button class="btn sm" id="clearCacheBtn">Clear saved data</button></div>
  <p class="acct-note">The app keeps a local copy of the catalog so it still works offline. If a number looks wrong, clear it and reload to force a fresh read.</p>

  <div class="acct-h" style="margin-top:var(--s5)">Backups</div>
  <p class="acct-note">A backup saves your whole catalog + collection. Restoring reinstates them if something gets wiped. (Cloudflare also keeps a 30-day auto history behind this.) Note: backups save the RECORDS of your photos, not the image files themselves.</p>
  <div class="idrow"><button class="btn sm primary" id="backupNow">Back up now</button><button class="btn sm" id="backupList">Show backups</button></div>
  <div id="snapList" class="snaplist"></div>`;
 drawer.appendChild(sec);

 renderWho();
 renderDataDiag();
 sec.querySelectorAll(".idbtn").forEach(b=>b.addEventListener("click",()=>{ if(setIdentity(b.dataset.id)){ renderWho(); toast("Signed in as "+b.dataset.id); } }));
 const so=$("signOutBtn"); if(so) so.addEventListener("click",()=>{ signOut(); renderWho(); toast("signed out"); });
 const cc=$("clearCacheBtn"); if(cc) cc.addEventListener("click",clearDataCache);
 $("backupNow").addEventListener("click",backupNow);
 $("backupList").addEventListener("click",loadSnapshots);
}
// Per-endpoint provenance readout. If you ever wonder "is this live?", this answers it precisely
// instead of making you infer it from whether the numbers look plausible.
function renderDataDiag(){
 const el=$("dataDiag"); if(!el) return;
 const rows=Object.entries(FETCH_STATE);
 if(!rows.length){ el.innerHTML=`<span style="color:var(--ink-faint)">no reads yet</span>`; return; }
 el.innerHTML=rows.map(([p,s])=>{
  const tag = s.source==="live" ? `<b style="color:var(--up)">live</b>`
            : s.source==="cache" ? `<b style="color:var(--amber)">saved copy${s.age?` · ${relAge(s.age)}`:""}</b>`
            : `<b style="color:var(--down)">no data</b>`;
  return `<div style="display:flex;justify-content:space-between;gap:8px"><code>${esc(p)}</code>${tag}</div>`;
 }).join("");
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
 gear.addEventListener("click",()=>{ renderDataDiag(); drawer.showModal(); gear.setAttribute("aria-expanded","true"); });
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
