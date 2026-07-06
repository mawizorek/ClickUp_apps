/* app-dashboard — render module. List rendering, tile/monogram markup, sample builder.
   Globals it relies on (from app.js): WIN, WINDOWS, allApps, getRecent, logVisit, relativeTime,
   updateStats, applyFilter, setStatus, esc, PAGES_BASE, OWNER, REPO; from data.js: APP_META, FM_META, SAMPLE, FM_SAMPLE;
   from sheet.js: openSheet. All resolve at call time (this file only declares functions).

   Display name resolution: app.label (from meta) wins over the auto-titlecased folder name.
   Monogram resolution: app.mono (from meta) wins over the derived initials of the display label. */

function displayName(name){ return name.replace(/^_/,'').replace(/-/g,' ').replace(/\b\w/g, function(c){ return c.toUpperCase(); }); }
function labelFor(app){ return app.label || displayName(app.name); }
function monogram(display){ const p=display.split(' ').filter(Boolean); let m=(p[0]||'?')[0]; if(p[1]) m+=p[1][0]; return m.toUpperCase(); }
function monoFor(app){ return app.mono || monogram(labelFor(app)); }

function renderFromData(apps){
  render(apps); updateStats(apps);
  applyFilter(WIN==='filemaker' ? 'all' : currentFilter, false);
  document.getElementById('refreshStamp').textContent = new Date().toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'});
}

function tileMarkup(app){
  const mono = esc(monoFor(app));
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
    const display = labelFor(app);
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
      desc:meta.desc||null, label:meta.label||null, mono:meta.mono||null,
      category:(WIN==='clickup'?(meta.category||'tool'):'fm'), health:(WIN==='clickup'?'live':'na')
    };
  });
  allApps = apps; renderFromData(apps);
  if(WIN==='clickup'){ apps.forEach(function(a,i){ const d=document.getElementById('health-'+i); if(d) d.className='dot live'; }); stat.live=apps.length; }
  setStatus();
  document.getElementById('demoNote').style.display='';
}
