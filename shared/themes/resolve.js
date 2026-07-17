/* shared/themes/resolve.js — TSV-sourced resolver for the three-entity theme system.
   Colors + feelings are TAB-separated grids; themes are the JSON join.
     - colors.tsv   : one row per COLOR, hex values (18 cols incl. accent-deep). HEX IS CANONICAL.
     - feelings.tsv : one row per FEELING, form values (fonts/radii/line/shadow/gradient ANGLE).
     - _themes.json : the JOIN — { slug, color, feeling }. Apps reference a THEME.

   HARD RULE (locked 2026-07-17): NO runtime color math. Every color is a literal hex from the grid.
   The button/surface gradient is TWO explicit hex stops (accent → accent-deep) + the feeling's angle.
   There is no color-mix / OKLCH / derived stop anywhere.

   Applies bare CSS custom properties (--accent, --surface-1, --font-display, --radius, ...), so a
   consumer just writes var(--accent). Sets data-mode (light|dark|mid) + data-theme/data-feel on root.

   Backward compatible: THEMES.apply(colorSlug) still applies a COLOR (now hex from colors.tsv).
   New: THEMES.applyFeeling(slug), THEMES.applyTheme(joinSlug), THEMES.ready.

   Usage:
     <script src="/path/shared/themes/resolve.js"></script>
     THEMES.applyTheme('sharp-mclaren');            // color + feeling from the join
     THEMES.apply('mclaren');                        // color only (legacy)
     THEMES.ready.then(()=>{ /* THEMES.colors, THEMES.feelings, THEMES.themes populated */ });
*/
(function(){
  var COLOR_KEYS=["bg","surface-1","surface-2","surface-3","border","field","text","text-soft","text-faint","accent","accent-deep","accent-2","accent-soft","on-accent","good","warn","bad","info"];
  var FEEL_KEYS=["font-display","font-body","radius","radius-lg","radius-pill","border-w","grad-angle","shadow-out","shadow-in","fs-lead","fs-body","fs-sm","fs-xs","track-tight","track-btn","touch"];
  var DEFAULT='default-theme';
  // hex ultimate fallback (default-theme mid-gray) so a fetch miss never white-screens
  var ULT={"bg":"#8f8f8f","surface-1":"#a0a0a0","surface-2":"#b0b0b0","surface-3":"#bfbfbf","border":"#565656","field":"#ababab","text":"#1c1c1c","text-soft":"#3f3f3f","text-faint":"#5b5b5b","accent":"#353535","accent-deep":"#222222","accent-2":"#515151","accent-soft":"#cccccc","on-accent":"#f6f6f6","good":"#757575","warn":"#656565","bad":"#3f3f3f","info":"#5b5b5b"};

  var base=(function(){ var s=document.currentScript&&document.currentScript.src; if(!s){var e=document.getElementsByTagName('script');s=e[e.length-1].src;} return s.replace(/[^/]*$/,''); })();

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

  // apply a COLOR row (hex) to the root. Returns the row (or ULT fallback).
  function applyColor(slug,opts){
    opts=opts||{}; var root=opts.root||document.documentElement;
    return loadColors().then(function(d){
      var row=d.rows[slug];
      if(!row){ if(opts.onError){opts.onError('unknown color: '+slug);} else if(opts.silent!==true){ banner('unknown color "'+slug+'"'); } row=ULT; }
      COLOR_KEYS.forEach(function(k){ root.style.setProperty('--'+k, (row[k]||ULT[k])); });
      if(row.mode){ root.setAttribute('data-mode',row.mode); }
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
  // gradient = TWO explicit hex stops + the feeling's angle. No color math.
  function setGrad(root){
    root.style.setProperty('--accent-grad','linear-gradient(var(--grad-angle,180deg), var(--accent), var(--accent-deep))');
    root.style.setProperty('--surface-grad','var(--surface-2)');
  }
  // apply a THEME (the join) = its color + its feeling.
  function applyTheme(slug,opts){
    opts=opts||{}; var root=opts.root||document.documentElement;
    return loadThemes().then(function(list){
      var t=null; for(var i=0;i<list.length;i++){ if(list[i].slug===slug){ t=list[i]; break; } }
      if(!t){ if(opts.onError){opts.onError('unknown theme: '+slug);} else { banner('unknown theme "'+slug+'"'); } return null; }
      return Promise.all([applyColor(t.color,{root:root,silent:true}),applyFeeling(t.feeling,{root:root,silent:true})]).then(function(){ setGrad(root); return t; });
    });
  }

  // legacy alias: apply(colorSlug) applies a COLOR (kept for existing consumers)
  function apply(slug,opts){ return applyColor(slug,opts); }
  // legacy resolve(slug): returns {slug,tokens} for a color
  function resolve(slug){ return loadColors().then(function(d){ var row=d.rows[slug]||ULT; var out={}; COLOR_KEYS.forEach(function(k){out[k]=row[k]||ULT[k];}); return {slug:slug,name:(row.name||slug),mode:row.mode||'mid',tokens:out}; }); }
  function listColors(){ return loadColors().then(function(d){ return d.order.map(function(s){ return {slug:s,name:d.rows[s].name,mode:d.rows[s].mode,accent:d.rows[s].accent}; }); }); }
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
    resolve:resolve, listColors:listColors, listFeelings:listFeelings, listThemes:listThemes,
    COLOR_KEYS:COLOR_KEYS, FEEL_KEYS:FEEL_KEYS, DEFAULT:DEFAULT, base:base, ready:ready,
    colors:{}, feelings:{}, themes:[]
  };
})();
