/* weekend/nav.js — Race Weekend lens, nav + boot (v2.1).
   Renders the drill-through nav (prev / round-select / next), owns hash routing
   (#/<slug>), and boots the page. Weekend is NOT a peer tab — you arrive here by
   drilling into a round. Reads bare globals from data.js.

   ⚠️ v2.1 (2026-08-01): the topbar is NO LONGER BUILT HERE. It was a template string in
   this file — one of THREE hand-written copies of the same header across the app, which
   is what let v17 ship a doubled brand. source/chrome.js is now the only thing that
   renders chrome anywhere, and it suppresses itself when embedded in the unified shell,
   so this file cannot get that wrong. Decision Log J19. */
(function(){
  const ARROW=d=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${d==='prev'?'<path d="M15 18l-6-6 6-6"/>':'<path d="M9 18l6-6-6-6"/>'}</svg>`;

  /* One line, and the header markup lives in exactly one file. `weekend` marks no tab as
     current on purpose: it is a drill-through, not a peer lens. */
  function topbar(){
    const t=document.getElementById('topbar');
    if(t && window.F1Chrome) F1Chrome.mount(t,{lens:'weekend'});
  }

  function wknav(curSlug){
    const el0=document.getElementById('wknav');
    const opts=ROUNDS.slice().sort((a,b)=>b.round-a.round).map(rd=>`<option value="${rd.slug}"${rd.slug===curSlug?' selected':''}>R${rd.round} \u00b7 ${short(rd.name)}</option>`).join('');
    const idx=ROUNDS.findIndex(r=>r.slug===curSlug);
    const prev=idx>0?ROUNDS[idx-1]:null, next=idx>=0&&idx<ROUNDS.length-1?ROUNDS[idx+1]:null;
    el0.innerHTML=`
      <button id="wkPrev" ${prev?'':'disabled'} aria-label="Previous round">${ARROW('prev')}</button>
      <div class="wksel"><select id="wkSel" aria-label="Jump to round">${opts}</select></div>
      <button id="wkNext" ${next?'':'disabled'} aria-label="Next round">${ARROW('next')}</button>`;
    el0.querySelector('#wkSel').addEventListener('change',e=>{location.hash='#/'+e.target.value;});
    if(prev) el0.querySelector('#wkPrev').addEventListener('click',()=>{location.hash='#/'+prev.slug;});
    if(next) el0.querySelector('#wkNext').addEventListener('click',()=>{location.hash='#/'+next.slug;});
  }

  function route(){
    const app=document.getElementById('app');
    const slug=(location.hash.match(/^#\/(.+)$/)||[])[1] || META.last_completed_round_slug || (ROUNDS.length?ROUNDS[ROUNDS.length-1].slug:null);
    const i=ROUNDS.findIndex(r=>r.slug===slug);
    if(i<0){
      app.innerHTML=`<div class="empty">No race weekend found for \u201c${esc(slug||'')}\u201d.<br>Pick a round below or head back to the Matrix.</div>`;
      wknav(null); return;
    }
    wknav(ROUNDS[i].slug);
    renderWeekend(ROUNDS[i],i);
    window.scrollTo({top:0,behavior:'auto'});
  }

  (async function boot(){
    topbar();
    document.getElementById('app').innerHTML='<div class="empty">Loading the weekend\u2026</div>';
    await loadSeason();
    route();
    window.addEventListener('hashchange',route);
    const stamp=document.getElementById('foot-stamp'); if(stamp) stamp.textContent='v2.1';
  })();
})();
