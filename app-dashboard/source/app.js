/* app-dashboard v4 — engine. Consumes source/data.js (APP_META, SAMPLE, FM_META, FM_SAMPLE). */
const APP_VERSION = 'v4';
const APP_PR = '__PR__'; // stamped with the PR number that shipped this build
const OWNER = 'mawizorek';
const REPO = 'ClickUp_apps';
const PAGES_BASE = 'https://' + OWNER + '.github.io/' + REPO;
const API_BASE = 'https://api.github.com/repos/' + OWNER + '/' + REPO;
const EXCLUDED = ['template-app','app-dashboard','brain-config','agent-reports','shared','filemaker'];
const RECENT_KEY = 'appDashboard_recent';
const FILTER_KEY = 'appDashboard_filter';
const WINDOW_KEY = 'appDashboard_window';
const CACHE_TTL = 5 * 60 * 1000;
const MAX_RECENT = 2;

const WINDOWS = {
  clickup:   { health:true,  openLabel:'Open app' },
  filemaker: { health:false, openLabel:'View on repo' }
};

const SKELETON = '<div class="skeleton">' +
  '<div class="sk-row"><div class="sk-tile"></div><div class="sk-body"><div class="sk-bar" style="width:45%"></div><div class="sk-bar" style="width:60%;height:8px"></div></div></div>' +
  '<div class="sk-row"><div class="sk-tile"></div><div class="sk-body"><div class="sk-bar" style="width:38%"></div><div class="sk-bar" style="width:55%;height:8px"></div></div></div>' +
  '<div class="sk-row"><div class="sk-tile"></div><div class="sk-body"><div class="sk-bar" style="width:50%"></div><div class="sk-bar" style="width:62%;height:8px"></div></div></div></div>';

let WIN = 'clickup';
let currentFilter = 'all';
let allApps = [];
let stat = { n: 0, live: '\u2026', recent7: 0 };
let usingSample = false;
let lastFocus = null;

function cacheKey(){ return 'appDashboard_cache_' + APP_VERSION + '_' + WIN; }
function getCache(){ try{ const raw=localStorage.getItem(cacheKey()); if(!raw) return null; const p=JSON.parse(raw); if(Date.now()-p.ts>CACHE_TTL) return null; return p.data; }catch(e){ return null; } }
function setCache(data){ try{ localStorage.setItem(cacheKey(), JSON.stringify({ts:Date.now(),data})); }catch(e){} }
function pruneOldCaches(){ try{ const keep='appDashboard_cache_'+APP_VERSION+'_'; const kill=[]; for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(k && k.indexOf('appDashboard_cache_')===0 && k.indexOf(keep)!==0) kill.push(k); } kill.forEach(function(k){ localStorage.removeItem(k); }); }catch(e){} }
function getRecent(){ try{ return JSON.parse(localStorage.getItem(RECENT_KEY)||'[]'); }catch(e){ return []; } }
function logVisit(slug){ try{ let r=getRecent().filter(function(s){ return s!==slug; }); r.unshift(slug); r=r.slice(0,MAX_RECENT); localStorage.setItem(RECENT_KEY, JSON.stringify(r)); }catch(e){} }

function setStatus(){
  const el = document.getElementById('statusLine');
  if(WIN==='filemaker'){ el.innerHTML = '<b>'+stat.n+'</b> FileMaker solutions \u00b7 <b>'+stat.recent7+'</b> updated this week'; }
  else { el.innerHTML = '<b>'+stat.n+'</b> apps \u00b7 <b>'+stat.live+'</b> live \u00b7 <b>'+stat.recent7+'</b> updated this week'; }
}

function applyFilter(filter, persist){
  currentFilter = filter;
  if(persist!==false){ try{ localStorage.setItem(FILTER_KEY, filter); }catch(e){} }
  document.querySelectorAll('.chip').forEach(function(c){ c.classList.toggle('on', c.dataset.filter===filter); });
  const rows = document.querySelectorAll('.row[data-category]');
  let visible = 0;
  rows.forEach(function(r){ const show = filter==='all' || r.dataset.category===filter; r.classList.toggle('hide', !show); if(show) visible++; });
  let empty = document.getElementById('emptyFilter');
  if(visible===0 && rows.length>0){
    if(!empty){ empty=document.createElement('div'); empty.id='emptyFilter'; empty.className='state'; document.getElementById('list').appendChild(empty); }
    empty.textContent = 'No ' + filter + ' apps yet.'; empty.style.display='';
  } else if(empty){ empty.style.display='none'; }
}

function setWindow(win){
  if(win===WIN) return;
  WIN = win;
  try{ localStorage.setItem(WINDOW_KEY, win); }catch(e){}
  document.body.classList.toggle('fm', win==='filemaker');
  document.querySelectorAll('.win-seg').forEach(function(s){ const on=s.dataset.window===win; s.classList.toggle('on', on); s.setAttribute('aria-selected', on?'true':'false'); });
  document.getElementById('mastTitle').innerHTML = (win==='filemaker'?'FileMaker':'ClickUp') + ' <span>Apps</span>';
  document.getElementById('cuChrome').style.display = win==='filemaker'?'none':'';
  document.getElementById('fmChrome').style.display = win==='filemaker'?'':'none';
  document.getElementById('filterRow').style.display = win==='filemaker'?'none':'';
  document.getElementById('secLabel').textContent = win==='filemaker'?'FileMaker solutions':'Apps';
  closeSheet();
  allApps = []; usingSample = false;
  document.getElementById('list').innerHTML = SKELETON;
  init(false);
}

async function init(force){
  const cfg = WINDOWS[WIN];
  pruneOldCaches();
  try{ const s=localStorage.getItem(FILTER_KEY); if(s && ['all','dashboard','tool'].indexOf(s)!==-1) currentFilter=s; }catch(e){}
  if(!force){ const cached=getCache(); if(cached){ allApps=cached; renderFromData(cached); if(cfg.health) cached.forEach(function(a,i){ checkHealth(a,i); }); return; } }
  try{
    const treeRes = await fetch(API_BASE + '/git/trees/main?recursive=1');
    if(!treeRes.ok) throw new Error('tree');
    const tree = (await treeRes.json()).tree || [];
    const folders = []; const seen = {};
    if(WIN==='clickup'){
      tree.forEach(function(t){ if(t.type==='tree' && t.path.indexOf('/')===-1 && EXCLUDED.indexOf(t.path)===-1 && !seen[t.path]){ seen[t.path]=1; folders.push(t.path); } });
    } else {
      tree.forEach(function(t){ const m=/^filemaker\/([^/]+)$/.exec(t.path); if(t.type==='tree' && m && !seen[t.path]){ seen[t.path]=1; folders.push(t.path); } });
    }
    const dataSet = {}, iconSet = {};
    if(WIN==='clickup'){
      tree.forEach(function(t){ if(/\/data\.json$/.test(t.path)) dataSet[t.path.split('/')[0]]=1; if(/^[^/]+\/icon\.png$/.test(t.path)) iconSet[t.path.split('/')[0]]=1; });
    }
    const apps = await Promise.all(folders.map(function(p){ const slug = WIN==='clickup' ? p : p.split('/')[1]; return buildApp(p, slug, !!dataSet[slug], !!iconSet[slug]); }));
    apps.sort(function(a,b){ return new Date(b.lastUpdated||0) - new Date(a.lastUpdated||0); });
    allApps = apps; setCache(apps); renderFromData(apps);
    if(cfg.health) apps.forEach(function(a,i){ checkHealth(a,i); });
  }catch(e){
    try{
      const suffix = '_' + WIN;
      for(let i=0;i<localStorage.length;i++){
        const k=localStorage.key(i);
        if(k && k.indexOf('appDashboard_cache_')===0 && k.slice(-suffix.length)===suffix){
          const p=JSON.parse(localStorage.getItem(k));
          if(p && p.data){ allApps=p.data; renderFromData(p.data); if(cfg.health) p.data.forEach(function(a,idx){ checkHealth(a,idx); }); return; }
        }
      }
    }catch(e2){}
    buildFromSample();
  }
}

async function buildApp(path, slug, hasData, hasIcon){
  const cfg = WINDOWS[WIN];
  const pagesUrl = cfg.health ? (PAGES_BASE + '/' + slug + '/') : null;
  const repoUrl = 'https://github.com/' + OWNER + '/' + REPO + '/tree/main/' + path;
  let lastUpdated=null, commitCount=0, commits=[];
  try{
    const r = await fetch(API_BASE + '/commits?per_page=100&path=' + encodeURIComponent(path));
    if(r.ok){ const cs = await r.json(); if(Array.isArray(cs) && cs.length){
      commitCount = cs.length; lastUpdated = cs[0].commit.author.date;
      commits = cs.slice(0,12).map(function(c){ return { msg:c.commit.message.split('\n')[0], date:c.commit.author.date }; });
    } }
  }catch(e){}
  const meta = (WIN==='clickup' ? APP_META[slug] : FM_META[slug]) || {};
  return {
    name:slug, path:path, slugText:(WIN==='clickup'?slug:'filemaker/'+slug)+'/',
    pagesUrl:pagesUrl, repoUrl:repoUrl, iconUrl:(hasIcon?PAGES_BASE+'/'+slug+'/icon.png':null),
    lastUpdated:lastUpdated, commitCount:commitCount, commits:commits, hasData:hasData,
    desc:meta.desc||null, category:(WIN==='clickup'?(meta.category||'tool'):'fm'), health:cfg.health?null:'na'
  };
}

function buildFromSample(){
  usingSample = true;
  const now = Date.now();
  const src = WIN==='clickup' ? SAMPLE : FM_SAMPLE;
  const apps = src.map(function(s){
    const meta = (WIN==='clickup' ? APP_META[s.name] : FM_META[s.name]) || {};
    const path = WIN==='clickup' ? s.name : 'filemaker/'+s.name;
    return {
      name:s.name, path:path, slugText:(WIN==='clickup'?s.name:'filemaker/'+s.name)+'/',
      pagesUrl: WIN==='clickup' ? PAGES_BASE+'/'+s.name+'/' : null,
      repoUrl:'https://github.com/'+OWNER+'/'+REPO+'/tree/main/'+path, iconUrl:null,
      lastUpdated:new Date(now - s.hoursAgo*3600000).toISOString(), commitCount:s.commitCount,
      commits:(s.commits||[]).map(function(c){ return { msg:c[0], date:new Date(now - c[1]*3600000).toISOString() }; }),
      hasData:(meta.badges||[]).indexOf('data')!==-1 || s.name==='world-cup-bracket',
      desc:meta.desc||null, category:(WIN==='clickup'?(meta.category||'tool'):'fm'), health:(WIN==='clickup'?'live':'na')
    };
  });
  allApps = apps; renderFromData(apps);
  if(WIN==='clickup'){ apps.forEach(function(a,i){ const d=document.getElementById('health-'+i); if(d) d.className='dot live'; }); stat.live=apps.length; }
  setStatus();
  document.getElementById('demoNote').style.display='';
}

function displayName(name){ return name.replace(/^_/,'').replace(/-/g,' ').replace(/\b\w/g, function(c){ return c.toUpperCase(); }); }
function monogram(display){ const p=display.split(' ').filter(Boolean); let m=(p[0]||'?')[0]; if(p[1]) m+=p[1][0]; return m.toUpperCase(); }

function renderFromData(apps){
  render(apps); updateStats(apps);
  applyFilter(WIN==='filemaker' ? 'all' : currentFilter, false);
  document.getElementById('refreshStamp').textContent = new Date().toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'});
}

function tileMarkup(app){
  const mono = esc(monogram(displayName(app.name)));
  if(app.iconUrl){
    return '<img class="ticon" src="'+app.iconUrl+'" alt="" loading="lazy" onerror="this.remove();this.parentNode.classList.remove(\'has-img\');var m=this.parentNode.querySelector(\'.tmono\');if(m)m.style.display=\'flex\';">'
         + '<span class="tmono" style="display:none">'+mono+'</span>';
  }
  return '<span class="tmono">'+mono+'</span>';
}

function render(apps){
  const list = document.getElementById('list');
  const recent = getRecent();
  const health = WINDOWS[WIN].health;
  const chevIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';
  list.innerHTML = apps.map(function(app, i){
    const display = displayName(app.name);
    const timeStr = app.lastUpdated ? relativeTime(app.lastUpdated) : null;
    const isRecent = recent.indexOf(app.name)!==-1;
    const cat = app.category;
    let tags = '';
    if(isRecent) tags += '<span class="tag tag-recent">Recent</span>';
    if(app.hasData) tags += '<span class="tag tag-data">Data</span>';
    let meta = '<span class="slug">'+esc(app.slugText)+'</span>';
    if(timeStr) meta += '<span class="sep">\u00b7</span>'+esc(timeStr);
    const dotHTML = health ? '<span class="dot checking" id="health-'+i+'"></span>' : '';
    const linkTarget = health ? app.pagesUrl : app.repoUrl;
    const linkAttrs = health ? '' : ' target="_blank" rel="noopener"';
    let h = '<div class="row" data-category="'+cat+'">';
    h += '<a class="tile-link" href="'+linkTarget+'"'+linkAttrs+' data-slug="'+esc(app.name)+'" aria-label="Open '+esc(display)+'">';
    h += '<span class="tile c-'+cat+(app.iconUrl?' has-img':'')+'">'+tileMarkup(app)+dotHTML+'</span>';
    h += '</a>';
    h += '<button class="info" data-idx="'+i+'" aria-label="Details for '+esc(display)+'">';
    h += '<span class="line1"><span class="name">'+esc(display)+'</span>'+tags+'</span>';
    h += '<span class="metaline">'+meta+'</span>';
    h += '</button>';
    h += '<a class="chev" href="'+app.repoUrl+'" target="_blank" rel="noopener" aria-label="Open '+esc(display)+' repo folder">'+chevIcon+'</a>';
    h += '</div>';
    return h;
  }).join('');
  list.querySelectorAll('.tile-link').forEach(function(a){ a.addEventListener('click', function(){ logVisit(a.dataset.slug); }); });
  list.querySelectorAll('.info').forEach(function(b){ b.addEventListener('click', function(){ openSheet(parseInt(b.dataset.idx,10)); }); });
}

/* ---- detail sheet ---- */
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
(function(){
  let y0=null;
  sheet.addEventListener('touchstart', function(e){ if(sheet.querySelector('.sheet-scroll').scrollTop<=0) y0=e.touches[0].clientY; else y0=null; }, {passive:true});
  sheet.addEventListener('touchmove', function(e){ if(y0===null) return; const dy=e.touches[0].clientY-y0; if(dy>0){ sheet.style.transform='translateY('+dy+'px)'; } }, {passive:true});
  sheet.addEventListener('touchend', function(e){ if(y0===null) return; const dy=e.changedTouches[0].clientY-y0; sheet.style.transform=''; if(dy>90) closeSheet(); y0=null; }, {passive:true});
})();

async function checkHealth(app, idx){
  const dot = document.getElementById('health-'+idx);
  if(!dot) return;
  try{ const res = await fetch(app.pagesUrl, { method:'GET', mode:'cors', cache:'no-store' }); const ok=res.ok; dot.className = ok ? 'dot live' : 'dot dead'; if(allApps[idx]) allApps[idx].health = ok?'live':'dead'; updateHealthCount(); }
  catch(e){ dot.className='dot dead'; if(allApps[idx]) allApps[idx].health='dead'; updateHealthCount(); }
}
function updateHealthCount(){
  if(usingSample) return;
  const dots = document.querySelectorAll('.dot');
  let healthy=0, resolved=0;
  dots.forEach(function(d){ if(d.classList.contains('live')){ healthy++; resolved++; } else if(d.classList.contains('dead')){ resolved++; } });
  if(resolved===dots.length && dots.length>0){ stat.live=healthy; setStatus(); }
}
function updateStats(apps){
  const sevenDays = Date.now() - 7*86400000;
  stat.n = apps.length;
  stat.live = (WIN==='clickup') ? (usingSample ? apps.length : '\u2026') : '\u2014';
  stat.recent7 = apps.filter(function(a){ return a.lastUpdated && new Date(a.lastUpdated) > sevenDays; }).length;
  setStatus();
}
function relativeTime(iso){
  const ms = Date.now() - new Date(iso), hrs = Math.floor(ms/3600000), days = Math.floor(ms/86400000);
  if(hrs < 1) return 'just now'; if(hrs < 24) return hrs + 'h ago'; if(days < 7) return days + 'd ago';
  return new Date(iso).toLocaleDateString('en-US',{month:'short',day:'numeric'});
}
function fullWhen(iso){ const d=new Date(iso); return d.toLocaleDateString('en-US',{month:'short',day:'numeric'}) + ' \u00b7 ' + relativeTime(iso); }
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/'/g,'&#39;'); }

document.getElementById('verStamp').textContent = APP_VERSION + ' \u00b7 PR #' + APP_PR;
const refreshBtn = document.getElementById('refreshBtn');
refreshBtn.addEventListener('click', async function(){
  if(refreshBtn.classList.contains('spinning')) return;
  refreshBtn.classList.add('spinning');
  await init(true);
  setTimeout(function(){ refreshBtn.classList.remove('spinning'); }, 400);
});
document.getElementById('filterRow').addEventListener('click', function(e){ const chip=e.target.closest('.chip'); if(!chip) return; applyFilter(chip.dataset.filter); });
document.getElementById('windowToggle').addEventListener('click', function(e){ const seg=e.target.closest('.win-seg'); if(!seg) return; setWindow(seg.dataset.window); });

try{ const w=localStorage.getItem(WINDOW_KEY); if(w==='filemaker'){ setWindow('filemaker'); } else { init(false); } }catch(e){ init(false); }
