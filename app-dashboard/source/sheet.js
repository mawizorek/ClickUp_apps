/* app-dashboard — detail bottom-sheet module. Split from app.js to stay under the ~12KB gate.
   Relies on globals from app.js (allApps, WIN, WINDOWS, esc, relativeTime, fullWhen, logVisit)
   and render.js (displayName, monogram). All referenced at event time, after every script has loaded. */

let lastFocus = null;
const scrim = document.getElementById('scrim');
const sheet = document.getElementById('sheet');

function openSheet(idx){
  const app = allApps[idx]; if(!app) return;
  const cfg = WINDOWS[WIN];
  const display = displayName(app.name);
  lastFocus = document.activeElement;
  const st = document.getElementById('sheetTile');
  st.className = 'sheet-tile c-' + app.category;
  st.innerHTML = app.iconUrl ? '<img src="'+app.iconUrl+'" alt="" onerror="this.remove();var p=this.parentNode;p.textContent=\''+esc(monogram(display))+'\';">' : esc(monogram(display));
  document.getElementById('sheetName').textContent = display;
  document.getElementById('sheetSlug').textContent = app.slugText;
  document.getElementById('sheetDesc').textContent = app.desc || 'No description on file yet.';
  const hv = document.getElementById('mHealth');
  if(cfg.health){
    const dot = document.getElementById('health-'+idx);
    const state = app.health || (dot && dot.classList.contains('live') ? 'live' : dot && dot.classList.contains('dead') ? 'dead' : 'checking');
    hv.textContent = state==='live' ? 'Live' : state==='dead' ? 'Down' : '\u2026';
    hv.className = 'v ' + (state==='live'?'ok':state==='dead'?'bad':'');
  } else {
    hv.textContent = 'Repo'; hv.className = 'v';
  }
  document.getElementById('mUpdated').textContent = app.lastUpdated ? relativeTime(app.lastUpdated) : '\u2014';
  document.getElementById('mCommits').textContent = app.commitCount ? (app.commitCount + (app.commitCount>=100?'+':'')) : '\u2014';
  const openBtn = document.getElementById('sheetOpen');
  const repoBtn = document.getElementById('sheetRepo');
  const openSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>';
  if(cfg.health){
    openBtn.innerHTML = openSvg + 'Open app'; openBtn.href = app.pagesUrl; openBtn.removeAttribute('target'); openBtn.removeAttribute('rel'); openBtn.onclick = function(){ logVisit(app.name); };
    repoBtn.style.display = '';
  } else {
    openBtn.innerHTML = openSvg + 'View on repo'; openBtn.href = app.repoUrl; openBtn.target = '_blank'; openBtn.rel = 'noopener'; openBtn.onclick = null;
    repoBtn.style.display = 'none';
  }
  repoBtn.href = app.repoUrl;
  renderCommits(app);
  document.body.classList.add('locked');
  scrim.classList.add('show'); sheet.classList.add('show'); sheet.setAttribute('aria-hidden','false');
  document.getElementById('sheetClose').focus();
}

function renderCommits(app){
  const wrap = document.getElementById('sheetCommits');
  if(app.commits && app.commits.length){
    wrap.innerHTML = app.commits.map(function(c){
      return '<div class="commit"><div class="rail"><div class="node"></div></div><div class="ctext"><div class="cmsg">'+esc(c.msg)+'</div><div class="cwhen">'+esc(fullWhen(c.date))+'</div></div></div>';
    }).join('');
  } else if(app.commitCount){
    wrap.innerHTML = '<div class="commits-empty">'+app.commitCount+' commits. Open the repo for the full history.</div>';
  } else {
    wrap.innerHTML = '<div class="commits-empty">No commit history loaded.</div>';
  }
}

function closeSheet(){
  scrim.classList.remove('show'); sheet.classList.remove('show'); sheet.setAttribute('aria-hidden','true');
  document.body.classList.remove('locked');
  if(lastFocus && lastFocus.focus) lastFocus.focus();
}

scrim.addEventListener('click', closeSheet);
document.getElementById('sheetClose').addEventListener('click', closeSheet);
document.addEventListener('keydown', function(e){ if(e.key==='Escape' && sheet.classList.contains('show')) closeSheet(); });

// swipe-down to dismiss
(function(){
  let y0=null;
  sheet.addEventListener('touchstart', function(e){ if(sheet.querySelector('.sheet-scroll').scrollTop<=0) y0=e.touches[0].clientY; else y0=null; }, {passive:true});
  sheet.addEventListener('touchmove', function(e){ if(y0===null) return; const dy=e.touches[0].clientY-y0; if(dy>0){ sheet.style.transform='translateY('+dy+'px)'; } }, {passive:true});
  sheet.addEventListener('touchend', function(e){ if(y0===null) return; const dy=e.changedTouches[0].clientY-y0; sheet.style.transform=''; if(dy>90) closeSheet(); y0=null; }, {passive:true});
})();
