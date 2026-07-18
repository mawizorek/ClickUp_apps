/* shared/themes/resolve.js — TSV-sourced resolver for the three-entity theme system.
   Colors + feelings are TAB-separated grids; themes are the JSON join.
     - colors.tsv   : one row per COLOR, hex values (18 bare cols incl. accent-deep) + 11 alt-* cols. HEX IS CANONICAL.
     - feelings.tsv : one row per FEELING, form values (fonts/radii/line/shadow/elevation-scale/motion/gradient ANGLE).
     - _themes.json : the JOIN — { slug, color, feeling }. Apps reference a THEME.

   HARD RULE (locked 2026-07-17): NO runtime color math. Every color is a literal hex from the grid.
   The button/surface gradient is TWO explicit hex stops (accent → accent-2, a two-HUE sweep) + the
   feeling's angle. Repointed 2026-07-17 from accent-deep to accent-2 for cross-theme dynamism (maximalism
   pass): the second stop is now the contrasting brand hue, not a darker shade of the first. accent-deep
   stays authored (free for future hover/border roles). There is no color-mix / OKLCH / derived stop anywhere.

   ELEVATION + MOTION (added 2026-07-18, sleek pass): the forms/feeling grid now also carries a 3-step
   elevation scale (elev-1 resting / elev-2 raised+hover / elev-3 floating+modal) and a motion set
   (motion-fast, motion-med, ease curve, lift = hover translate). These fold into the FORMS vector — NOT a
   new TSV — because tactility/depth is already forms' job. Consumers read var(--elev-2), var(--motion-med),
   var(--ease), var(--lift) directly; borderlessness is just border-w:0 on the sleek preset.

   BIDIRECTIONAL LIGHT/DARK (added 2026-07-17):
     Each color row ships a DEFAULT ramp (the bare 18 tokens; its absolute mode = the `mode` column)
     and an opposite-mode neutral ramp in 11 `alt-*` columns (bg, surface-1..3, border, field, text,
     text-soft, text-faint, accent-soft, on-accent). Brand (accent/accent-deep/accent-2) + semantics
     (good/warn/bad/info) are SHARED across modes — no alt.
     Render rule: ramp = (wantMode === row.mode) ? bare : alt. So a relative store yields an absolute
     light/dark render. `mode` is the theme's DEFAULT LANDING mode, not a fixed category.
     Global mode is opt-in via THEMES.setMode('light'|'dark') and persists in localStorage; when unset,
     every theme lands in its own `mode` (fully backward compatible — dark stays dark).
     Graceful fallback: if the requested mode needs the alt ramp but the row's alt cells are blank
     (e.g. default-theme, mode `mid`), we fall back to the bare ramp — never render half-empty tokens.

   Applies bare CSS custom properties (--accent, --surface-1, --font-display, --radius, --elev-2, ...), so a
   consumer just writes var(--accent). Sets data-mode (light|dark|mid) + data-theme/data-feel on root.

   Backward compatible: THEMES.apply(colorSlug) still applies a COLOR (now hex from colors.tsv).
   New: THEMES.applyFeeling(slug), THEMES.applyTheme(joinSlug), THEMES.setMode(mode), THEMES.getMode(),
        THEMES.supportsMode(slug,mode), THEMES.ready.

   Usage:
     <script src="/path/shared/themes/resolve.js"></script>
     THEMES.applyTheme('sharp-mclaren');            // color + feeling from the join (lands in theme's mode)
     THEMES.setMode('light');                        // global absolute mode; re-applies current theme + persists
     THEMES.apply('mclaren');                        // color only (legacy)
     THEMES.ready.then(()=>{ /* THEMES.colors, THEMES.feelings, THEMES.themes populated */ });
*/
(function(){
  var COLOR_KEYS=["bg","surface-1","surface-2","surface-3","border","field","text","text-soft","text-faint","accent","accent-deep","accent-2","accent-soft","on-accent","good","warn","bad","info"];
  // the 11 tokens that flip between modes (have alt-* columns). Everything else is shared identity.
  var ALT_KEYS=["bg","surface-1","surface-2","surface-3","border","field","text","text-soft","text-faint","accent-soft","on-accent"];
  var FEEL_KEYS=["font-display","font-body","radius","radius-lg","radius-pill","border-w","grad-angle","shadow-out","shadow-in","elev-1","elev-2","elev-3","motion-fast","motion-med","ease","lift","fs-lead","fs-body","fs-sm","fs-xs","track-tight","track-btn","touch"];
  var DEFAULT='default-theme';
  var MODE_KEY='themes:mode';
  // hex ultimate fallback (default-theme mid-gray) so a fetch miss never white-screens
  var ULT={"bg":"#8f8f8f","surface-1":"#a0a0a0","surface-2":"#b0b0b0","surface-3":"#bfbfbf","border":"#565656","field":"#ababab","text":"#1c1c1c","text-soft":"#3f3f3f","text-faint":"#5b5b5b","accent":"#353535","accent-deep":"#222222","accent-2":"#515151","accent-soft":"#cccccc","on-accent":"#f6f6f6","good":"#757575","warn":"#656565","bad":"#3f3f3f","info":"#5b5b5b"};

  var base=(function(){ var s=document.currentScript&&document.currentScript.src; if(!s){var e=document.getElementsByTagName('script');s=e[e.length-1].src;} return s.replace(/[^/]*$/,''); })();

  // global absolute mode: null = follow each theme's own default landing mode (backward compatible).
  var _mode=(function(){ try{ return localStorage.getItem(MODE_KEY)||null; }catch(e){ return null; } })();
  function storeMode(m){ try{ if(m==null) localStorage.removeItem(MODE_KEY); else localStorage.setItem(MODE_KEY,m); }catch(e){} }

  function getText(url){ return fetch(url,{cache:'no-store'}).then(function(r){ if(!r.ok) throw new Error('HTTP '+r.status); return r.text(); }); }
  function getJSON(url){ return fetch(url,{cache:'no-store'}).then(function(r){ if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); }); }
  // parse TSV -> { order:[slug...], rows:{slug:{col:val}} }
  function parseTSV(txt){
    var lines=txt.replace(/\r/g,'').split('\n').filter(function(l){return l.length;});
    var head=lines[0].split('\t'); var rows={}, order=[];
    for(var i=1;i<lines.length;i++){ var c=lines[i].split('\t'); var o={}; for(var j=0;j<head.length;j++){ o[head[j]]=c[j]; } if(o.slug){ rows[o.slug]=o; order.push(o.slug); } }
    return { head:head, rows:rows, order:order };
  }

  var _colors=null,_feelings=null,_themes=null;
  function loadColors(){ if(_colors) return Promise.resolve(_colors); return getText(base+'colors.tsv').then(parseTSV).then(function(d){_colors=d;return d;}).catch(function(){_colors={head:[],rows:{},order:[]};return _colors;}); }
  function loadFeelings(){ if(_feelings) return Promise.resolve(_feelings); return getText(base+'feelings.tsv').then(parseTSV).then(function(d){_feelings=d;return d;}).catch(function(){_feelings={head:[],rows:{},order:[]};return _feelings;}); }
  function loadThemes(){ if(_themes) return Promise.resolve(_themes); return getJSON(base+'_themes.json').then(function(j){_themes=(j&&j.themes)||[];return _themes;}).catch(function(){_themes=[];return _themes;}); }

  function banner(msg){ var d=document.createElement('div'); d.textContent='themes: '+msg; d.style.cssText='position:fixed;top:0;left:0;right:0;z-index:99999;background:#b23a2f;color:#fff;font:600 13px ui-monospace,Menlo,monospace;padding:8px 14px;text-align:center'; (document.body||document.documentElement).appendChild(d); }

  // does a row carry a complete opposite-mode (alt-*) ramp?
  function hasAlt(row){ if(!row) return false; for(var i=0;i<ALT_KEYS.length;i++){ var v=row['alt-'+ALT_KEYS[i]]; if(v==null||v==='') return false; } return true; }

  // apply a COLOR row (hex) to the root. opts.mode = requested ABSOLUTE mode (light|dark).
  // Returns the row (or ULT fallback).
  function applyColor(slug,opts){
    opts=opts||{}; var root=opts.root||document.documentElement;
    return loadColors().then(function(d){
      var row=d.rows[slug];
      if(!row){ if(opts.onError){opts.onError('unknown color: '+slug);} else if(opts.silent!==true){ banner('unknown color "'+slug+'"'); } row=ULT; }
      var landing=row.mode||'mid';
      // requested absolute mode: explicit opt > global stored mode > the theme's own landing mode
      var want=opts.mode||_mode||landing;
      var useAlt=(want!==landing);
      // graceful fallback: alt ramp requested but not authored -> stay on the bare (default) ramp
      if(useAlt && !hasAlt(row)){ useAlt=false; }
      var effMode=useAlt?want:landing;
      COLOR_KEYS.forEach(function(k){
        var val=(useAlt && ALT_KEYS.indexOf(k)>=0) ? row['alt-'+k] : row[k];
        root.style.setProperty('--'+k,(val||row[k]||ULT[k]));
      });
      if(effMode){ root.setAttribute('data-mode',effMode); }
      root.setAttribute('data-theme',slug);
      return row;
    });
  }
  // apply a FEELING row (form) to the root.
  function applyFeeling(slug,opts){
    opts=opts||{}; var root=opts.root||document.documentElement;
    return loadFeelings().then(function(d){
      var row=d.rows[slug]; if(!row){ if(opts.silent!==true){ banner('unknown feeling "'+slug+'"'); } return null; }
      FEEL_KEYS.forEach(function(k){ if(row[k]!=null&&row[k]!==''){ root.style.setProperty('--'+k,row[k]); } });
      root.setAttribute('data-feel',slug);
      setGrad(root);
      return row;
    });
  }
  // gradient = TWO explicit hex stops (accent → accent-2, a two-HUE sweep) + the feeling's angle. No color math.
  function setGrad(root){
    root.style.setProperty('--accent-grad','linear-gradient(var(--grad-angle,135deg), var(--accent), var(--accent-2))');
    root.style.setProperty('--surface-grad','var(--surface-2)');
  }
  // apply a THEME (the join) = its color + its feeling. opts.mode threads through to the color.
  function applyTheme(slug,opts){
    opts=opts||{}; var root=opts.root||document.documentElement;
    return loadThemes().then(function(list){
      var t=null; for(var i=0;i<list.length;i++){ if(list[i].slug===slug){ t=list[i]; break; } }
      if(!t){ if(opts.onError){opts.onError('unknown theme: '+slug);} else { banner('unknown theme "'+slug+'"'); } return null; }
      return Promise.all([applyColor(t.color,{root:root,silent:true,mode:opts.mode}),applyFeeling(t.feeling,{root:root,silent:true})]).then(function(){ setGrad(root); return t; });
    });
  }

  // ---- global light/dark mode ----
  // Set the absolute mode for every theme render + persist it, then re-apply whatever theme is live.
  // mode = 'light' | 'dark' (or null to clear back to per-theme landing). opts.persist=false to skip storage.
  function setMode(mode,opts){
    opts=opts||{}; _mode=mode; if(opts.persist!==false) storeMode(mode);
    var root=opts.root||document.documentElement;
    var slug=root.getAttribute('data-theme');
    if(slug) return applyColor(slug,{root:root,mode:mode||undefined,silent:true});
    return Promise.resolve(null);
  }
  function getMode(){ return _mode; }
  // can this theme render the given absolute mode? (its landing mode always; the other only if alt authored)
  function supportsMode(slug,mode){ return loadColors().then(function(d){ var row=d.rows[slug]; if(!row) return false; var landing=row.mode||'mid'; return (mode===landing) || hasAlt(row); }); }

  // legacy alias: apply(colorSlug) applies a COLOR (kept for existing consumers)
  function apply(slug,opts){ return applyColor(slug,opts); }
  // legacy resolve(slug): returns {slug,tokens} for a color (honors the active global mode)
  function resolve(slug){ return loadColors().then(function(d){ var row=d.rows[slug]||ULT; var landing=row.mode||'mid'; var want=_mode||landing; var useAlt=(want!==landing)&&hasAlt(row); var out={}; COLOR_KEYS.forEach(function(k){ var v=(useAlt&&ALT_KEYS.indexOf(k)>=0)?row['alt-'+k]:row[k]; out[k]=v||row[k]||ULT[k]; }); return {slug:slug,name:(row.name||slug),mode:(useAlt?want:landing),tokens:out}; }); }
  function listColors(){ return loadColors().then(function(d){ return d.order.map(function(s){ var row=d.rows[s]; return {slug:s,name:row.name,mode:row.mode,accent:row.accent,alt:hasAlt(row)}; }); }); }
  function listFeelings(){ return loadFeelings().then(function(d){ return d.order.map(function(s){ return {slug:s,name:d.rows[s].name,status:d.rows[s].status}; }); }); }
  function listThemes(){ return loadThemes(); }

  var ready=Promise.all([loadColors(),loadFeelings(),loadThemes()]).then(function(){
    window.THEMES.colors=(_colors&&_colors.rows)||{};
    window.THEMES.feelings=(_feelings&&_feelings.rows)||{};
    window.THEMES.themes=_themes||[];
    return true;
  });

  window.THEMES={
    apply:apply, applyColor:applyColor, applyFeeling:applyFeeling, applyTheme:applyTheme,
    setMode:setMode, getMode:getMode, supportsMode:supportsMode,
    resolve:resolve, listColors:listColors, listFeelings:listFeelings, listThemes:listThemes,
    COLOR_KEYS:COLOR_KEYS, ALT_KEYS:ALT_KEYS, FEEL_KEYS:FEEL_KEYS, DEFAULT:DEFAULT, base:base, ready:ready,
    colors:{}, feelings:{}, themes:[]
  };
})();
