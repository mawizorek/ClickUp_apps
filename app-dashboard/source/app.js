/* app-dashboard v4 — core engine + boot. Companion modules: data.js (metadata/samples),
   render.js (list rendering), sheet.js (detail sheet). Load order: data → render → sheet → app. */
const APP_VERSION = 'v4';
const APP_PR = '39'; // stamped with the PR number that shipped this build
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
    desc:meta.desc||null, label:meta.label||null, mono:meta.mono||null,
    category:(WIN==='clickup'?(meta.category||'tool'):'fm'), health:cfg.health?null:'na'
  };
}

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

/* ---- boot (runs last; every companion module is loaded by now) ---- */
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
