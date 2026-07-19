/* shared/themes/resolve.js — TSV-sourced resolver for the 4-VECTOR theme system.
   A THEME is a JOIN of four independent vectors, each its own TSV grid:
     - colors.tsv      : one row per COLOR, hex values + 11 alt-* cols + data-1..4. HEX IS CANONICAL.
     - typography.tsv  : one row per TYPOGRAPHY set (fonts incl. font-mono, fs-* ramp, tracking).
     - forms.tsv       : one row per FORMS set (radii, border-w, gradient ANGLE, shadows, elev-1/2/3, motion).
     - spacing.tsv     : one row per SPACING set (touch target, pad-*, gap-*).
     - _themes.json    : the JOIN — { slug, color, typography, forms, spacing }. Apps reference a THEME slug.

   HISTORY / THE FIX (2026-07-19): this file previously loaded a single `feelings.tsv` and read a
   `t.feeling` pointer off the join. The system migrated to the 4-vector split (typography/forms/spacing
   as separate grids, a 4-pointer join) but the resolver was never updated — so applyTheme() silently
   dropped every non-color vector and apps hand-baked their structural CSS instead. This rewrite composes
   ALL FOUR from the current grids. `THEMES.applyTheme(slug)` now sets the full token set from one pointer.

   HARD RULE (locked 2026-07-17): NO runtime color math. Every color is a literal hex from the grid.
   The button/surface gradient is TWO explicit hex stops (accent → accent-2) + the forms angle.

   BIDIRECTIONAL LIGHT/DARK (2026-07-17): each color row ships a DEFAULT ramp (bare 18 tokens; absolute
     mode = the `mode` column) + an opposite-mode neutral ramp in 11 alt-* columns. Brand, semantics, and
     data-1..4 are SHARED across modes. Render rule: ramp = (wantMode === row.mode) ? bare : alt.

   BACKWARD COMPATIBLE: THEMES.apply(colorSlug) still applies a COLOR only (existing apps rely on it).
     THEMES.applyFeeling(slug) is a DEPRECATED alias that now applies a FORMS row (feelings ≈ forms
     historically) so any legacy caller degrades gracefully rather than erroring.
   New/fixed: applyTheme(joinSlug) composes 4 vectors; applyTypography/applyForms/applySpacing(slug);
     listTypography/listForms/listSpacing/listThemes; setMode/getMode/supportsMode; THEMES.ready.
*/
(function(){
  var COLOR_KEYS=["bg","surface-1","surface-2","surface-3","border","field","text","text-soft","text-faint","accent","accent-deep","accent-2","accent-soft","on-accent","good","warn","bad","info","data-1","data-2","data-3","data-4"];
  // the 11 tokens that flip between modes (have alt-* columns). Everything else is shared identity.
  var ALT_KEYS=["bg","surface-1","surface-2","surface-3","border","field","text","text-soft","text-faint","accent-soft","on-accent"];
  // the three FEEL vectors, each its own grid + column set.
  var TYPO_KEYS=["font-display","font-body","font-mono","fs-lead","fs-body","fs-sm","fs-xs","track-tight","track-btn"];
  var FORM_KEYS=["radius","radius-lg","radius-pill","border-w","grad-angle","shadow-out","shadow-in","elev-1","elev-2","elev-3","motion-fast","motion-med","ease","lift"];
  var SPACE_KEYS=["touch","pad-cell","pad-card","gap-xs","gap-md","gap-lg"];
  // union, exported for consumers/tools that want the whole feel surface at once.
  var FEEL_KEYS=TYPO_KEYS.concat(FORM_KEYS, SPACE_KEYS);
  var DEFAULT='default-theme';
  var MODE_KEY='themes:mode';
  // hex ultimate fallback (default-theme mid-gray) so a fetch miss never white-screens
  var ULT={"bg":"#8f8f8f","surface-1":"#a0a0a0","surface-2":"#b0b0b0","surface-3":"#bfbfbf","border":"#565656","field":"#ababab","text":"#1c1c1c","text-soft":"#3f3f3f","text-faint":"#5b5b5b","accent":"#353535","accent-deep":"#222222","accent-2":"#515151","accent-soft":"#cccccc","on-accent":"#f6f6f6","good":"#757575","warn":"#656565","bad":"#3f3f3f","info":"#5b5b5b","data-1":"#4f9fe0","data-2":"#e07bad","data-3":"#46c48a","data-4":"#e0a84f"};

  var base=(function(){ var s=document.currentScript&&document.currentScript.src; if(!s){var e=document.getElementsByTagName('script');s=e[e.length-1].src;} return s.replace(/[^/]*$/,''); })();

  // global absolute mode: null = follow each theme's own default landing mode (backward compatible).
  var _mode=(function(){ try{ return localStorage.getItem(MODE_KEY)||null; }catch(e){ return null; } })();
  function storeMode(m){ try{ if(m==null) localStorage.removeItem(MODE_KEY); else localStorage.setItem(MODE_KEY,m); }catch(e){} }

  function getText(url){ return fetch(url,{cache:'no-store'}).then(function(r){ if(!r.ok) throw new Error('HTTP '+r.status); return r.text(); }); }
  function getJSON(url){ return fetch(url,{cache:'no-store'}).then(function(r){ if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); }); }
  // parse TSV -> { head, rows:{slug:{col:val}}, order:[slug...] }
  function parseTSV(txt){
    var lines=txt.replace(/\r/g,'').split('\n').filter(function(l){return l.length;});
    var head=lines[0].split('\t'); var rows={}, order=[];
    for(var i=1;i<lines.length;i++){ var c=lines[i].split('\t'); var o={}; for(var j=0;j<head.length;j++){ o[head[j]]=c[j]; } if(o.slug){ rows[o.slug]=o; order.push(o.slug); } }
    return { head:head, rows:rows, order:order };
  }

  var _colors=null,_typo=null,_forms=null,_space=null,_themes=null;
  function loadColors(){ if(_colors) return Promise.resolve(_colors); return getText(base+'colors.tsv').then(parseTSV).then(function(d){_colors=d;return d;}).catch(function(){_colors={head:[],rows:{},order:[]};return _colors;}); }
  function loadTypography(){ if(_typo) return Promise.resolve(_typo); return getText(base+'typography.tsv').then(parseTSV).then(function(d){_typo=d;return d;}).catch(function(){_typo={head:[],rows:{},order:[]};return _typo;}); }
  function loadForms(){ if(_forms) return Promise.resolve(_forms); return getText(base+'forms.tsv').then(parseTSV).then(function(d){_forms=d;return d;}).catch(function(){_forms={head:[],rows:{},order:[]};return _forms;}); }
  function loadSpacing(){ if(_space) return Promise.resolve(_space); return getText(base+'spacing.tsv').then(parseTSV).then(function(d){_space=d;return d;}).catch(function(){_space={head:[],rows:{},order:[]};return _space;}); }
  function loadThemes(){ if(_themes) return Promise.resolve(_themes); return getJSON(base+'_themes.json').then(function(j){_themes=(j&&j.themes)||[];return _themes;}).catch(function(){_themes=[];return _themes;}); }

  function banner(msg){ var d=document.createElement('div'); d.textContent='themes: '+msg; d.style.cssText='position:fixed;top:0;left:0;right:0;z-index:99999;background:#b23a2f;color:#fff;font:600 13px ui-monospace,Menlo,monospace;padding:8px 14px;text-align:center'; (document.body||document.documentElement).appendChild(d); }

  // does a color row carry a complete opposite-mode (alt-*) ramp?
  function hasAlt(row){ if(!row) return false; for(var i=0;i<ALT_KEYS.length;i++){ var v=row['alt-'+ALT_KEYS[i]]; if(v==null||v==='') return false; } return true; }

  // apply a COLOR row (hex) to the root. opts.mode = requested ABSOLUTE mode (light|dark).
  function applyColor(slug,opts){
    opts=opts||{}; var root=opts.root||document.documentElement;
    return loadColors().then(function(d){
      var row=d.rows[slug];
      if(!row){ if(opts.onError){opts.onError('unknown color: '+slug);} else if(opts.silent!==true){ banner('unknown color "'+slug+'"'); } row=ULT; }
      var landing=row.mode||'mid';
      var want=opts.mode||_mode||landing;
      var useAlt=(want!==landing);
      if(useAlt && !hasAlt(row)){ useAlt=false; } // graceful: alt requested but not authored -> bare ramp
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

  // generic FEEL-vector applier: set the vector's columns from its grid row.
  function applyVector(loader,keys,attr,slug,opts){
    opts=opts||{}; var root=opts.root||document.documentElement;
    return loader().then(function(d){
      var row=d.rows[slug];
      if(!row){ if(opts.silent!==true){ banner('unknown '+attr+' "'+slug+'"'); } return null; }
      keys.forEach(function(k){ if(row[k]!=null && row[k]!==''){ root.style.setProperty('--'+k,row[k]); } });
      root.setAttribute('data-'+attr,slug);
      return row;
    });
  }
  function applyTypography(slug,opts){ return applyVector(loadTypography,TYPO_KEYS,'typography',slug,opts); }
  function applyForms(slug,opts){ return applyVector(loadForms,FORM_KEYS,'forms',slug,opts).then(function(r){ setGrad(opts&&opts.root||document.documentElement); return r; }); }
  function applySpacing(slug,opts){ return applyVector(loadSpacing,SPACE_KEYS,'spacing',slug,opts); }
  // DEPRECATED alias: old callers said applyFeeling(slug) meaning the tactile vector -> now FORMS.
  function applyFeeling(slug,opts){ return applyForms(slug,opts); }

  // gradient = TWO explicit hex stops (accent → accent-2, a two-HUE sweep) + the forms angle. No color math.
  function setGrad(root){
    root=root||document.documentElement;
    root.style.setProperty('--accent-grad','linear-gradient(var(--grad-angle,135deg), var(--accent), var(--accent-2))');
    root.style.setProperty('--surface-grad','var(--surface-2)');
  }

  // apply a THEME (the JOIN) = its color + typography + forms + spacing. opts.mode threads to the color.
  function applyTheme(slug,opts){
    opts=opts||{}; var root=opts.root||document.documentElement;
    return loadThemes().then(function(list){
      var t=null; for(var i=0;i<list.length;i++){ if(list[i].slug===slug){ t=list[i]; break; } }
      if(!t){ if(opts.onError){opts.onError('unknown theme: '+slug);} else { banner('unknown theme "'+slug+'"'); } return null; }
      var jobs=[applyColor(t.color,{root:root,silent:true,mode:opts.mode})];
      if(t.typography) jobs.push(applyTypography(t.typography,{root:root,silent:true}));
      if(t.forms)      jobs.push(applyForms(t.forms,{root:root,silent:true}));
      if(t.spacing)    jobs.push(applySpacing(t.spacing,{root:root,silent:true}));
      return Promise.all(jobs).then(function(){ setGrad(root); root.setAttribute('data-theme-join',slug); return t; });
    });
  }

  // ---- global light/dark mode ----
  function setMode(mode,opts){
    opts=opts||{}; _mode=mode; if(opts.persist!==false) storeMode(mode);
    var root=opts.root||document.documentElement;
    var slug=root.getAttribute('data-theme');
    if(slug) return applyColor(slug,{root:root,mode:mode||undefined,silent:true});
    return Promise.resolve(null);
  }
  function getMode(){ return _mode; }
  function supportsMode(slug,mode){ return loadColors().then(function(d){ var row=d.rows[slug]; if(!row) return false; var landing=row.mode||'mid'; return (mode===landing) || hasAlt(row); }); }

  // legacy alias: apply(colorSlug) applies a COLOR (kept for existing consumers)
  function apply(slug,opts){ return applyColor(slug,opts); }
  // legacy resolve(slug): returns {slug,tokens} for a color (honors the active global mode)
  function resolve(slug){ return loadColors().then(function(d){ var row=d.rows[slug]||ULT; var landing=row.mode||'mid'; var want=_mode||landing; var useAlt=(want!==landing)&&hasAlt(row); var out={}; COLOR_KEYS.forEach(function(k){ var v=(useAlt&&ALT_KEYS.indexOf(k)>=0)?row['alt-'+k]:row[k]; out[k]=v||row[k]||ULT[k]; }); return {slug:slug,name:(row.name||slug),mode:(useAlt?want:landing),tokens:out}; }); }
  function listColors(){ return loadColors().then(function(d){ return d.order.map(function(s){ var row=d.rows[s]; return {slug:s,name:row.name,mode:row.mode,accent:row.accent,alt:hasAlt(row)}; }); }); }
  function listTypography(){ return loadTypography().then(function(d){ return d.order.map(function(s){ return {slug:s}; }); }); }
  function listForms(){ return loadForms().then(function(d){ return d.order.map(function(s){ return {slug:s}; }); }); }
  function listSpacing(){ return loadSpacing().then(function(d){ return d.order.map(function(s){ return {slug:s}; }); }); }
  function listThemes(){ return loadThemes(); }
  // legacy alias kept so old callers of listFeelings() don't break; now lists FORMS.
  function listFeelings(){ return listForms(); }

  var ready=Promise.all([loadColors(),loadTypography(),loadForms(),loadSpacing(),loadThemes()]).then(function(){
    window.THEMES.colors=(_colors&&_colors.rows)||{};
    window.THEMES.typography=(_typo&&_typo.rows)||{};
    window.THEMES.forms=(_forms&&_forms.rows)||{};
    window.THEMES.spacing=(_space&&_space.rows)||{};
    window.THEMES.themes=_themes||[];
    return true;
  });

  window.THEMES={
    apply:apply, applyColor:applyColor,
    applyTypography:applyTypography, applyForms:applyForms, applySpacing:applySpacing,
    applyFeeling:applyFeeling, applyTheme:applyTheme,
    setMode:setMode, getMode:getMode, supportsMode:supportsMode,
    resolve:resolve,
    listColors:listColors, listTypography:listTypography, listForms:listForms, listSpacing:listSpacing,
    listThemes:listThemes, listFeelings:listFeelings,
    COLOR_KEYS:COLOR_KEYS, ALT_KEYS:ALT_KEYS, TYPO_KEYS:TYPO_KEYS, FORM_KEYS:FORM_KEYS, SPACE_KEYS:SPACE_KEYS, FEEL_KEYS:FEEL_KEYS,
    DEFAULT:DEFAULT, base:base, ready:ready,
    colors:{}, typography:{}, forms:{}, spacing:{}, themes:[]
  };
})();
