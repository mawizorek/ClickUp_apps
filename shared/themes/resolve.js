/* shared/themes/resolve.js — canonical slug → tokens resolver for the GLOBAL theme contract.
   The SINGLE source of resolution truth for BOTH consumers:
     - ClickUp HTML apps (Pages-hosted): point a <script> at this file and call apply().
     - FileMaker layout renders (local design mockups): renders inline resolved tokens at
       build time; this resolver is still the reference for what those values are.

   Applies the 17 global tokens as bare CSS custom properties (--accent, --surface-1, ...),
   so an app just writes var(--accent) and links a theme. Also sets data-mode on the root
   (light | dark | mid) so an app's mode-conditional CSS keys off the theme.

   Fallback trail (fail loud):
     unknown slug   → visible error banner, no skin applied
     status: stub   → _base spine → ultimate fallback (default-theme)
     resolved, key gap → that key falls back to the ultimate spine
     fetch fails (file://) → ultimate fallback so it never white-screens (reported offline)

   The ultimate fallback is DEFAULT-THEME (the unskinned MID-gray default): if resolution
   fails, a consumer lands on the deliberately-gray default so it reads as unthemed, never broken.

   Depth-independent: computes its own base dir, so a consumer at any folder depth just
   points a tag at this file.

   Usage:
     <script src="/path/to/shared/themes/resolve.js"></script>
     THEMES.apply('mclaren', { root: document.documentElement });
     // optional aliasMap for consumers using local var names (e.g. FileMaker cv-* roles):
     THEMES.apply('mclaren', { aliasMap: { 'surface-1':'cv-part-header', 'field':'cv-field-fill' } });
     // list available themes (for a picker), grouped as in the manifest:
     THEMES.list().then(function(idx){ /* idx.groups[].themes[] */ });
     // the default slug a new app should use when none is chosen:
     THEMES.DEFAULT  // 'default-theme'
*/
(function(){
  var TOKEN_KEYS = ["bg","surface-1","surface-2","surface-3","border","field","text","text-soft","text-faint","accent","accent-2","accent-soft","on-accent","good","warn","bad","info"];
  var DEFAULT = 'default-theme';
  // default-theme (unskinned MID-gray, high-contrast), embedded so a fetch failure never blanks the consumer
  var ULTIMATE = {
    "bg":"oklch(0.62 0 0)","surface-1":"oklch(0.68 0 0)","surface-2":"oklch(0.73 0 0)",
    "surface-3":"oklch(0.78 0 0)","border":"oklch(0.40 0 0)","field":"oklch(0.71 0 0)",
    "text":"oklch(0.16 0 0)","text-soft":"oklch(0.30 0 0)","text-faint":"oklch(0.42 0 0)",
    "accent":"oklch(0.26 0 0)","accent-2":"oklch(0.38 0 0)","accent-soft":"oklch(0.82 0 0)",
    "on-accent":"oklch(0.97 0 0)","good":"oklch(0.52 0 0)","warn":"oklch(0.46 0 0)",
    "bad":"oklch(0.30 0 0)","info":"oklch(0.42 0 0)"
  };

  var base = (function(){
    var s = document.currentScript && document.currentScript.src;
    if(!s){ var els = document.getElementsByTagName('script'); s = els[els.length-1].src; }
    return s.replace(/[^/]*$/, '');
  })();

  function getJSON(url){ return fetch(url, {cache:'no-store'}).then(function(r){ if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); }); }
  function assign(t, s){ for(var k in s){ if(Object.prototype.hasOwnProperty.call(s,k)) t[k]=s[k]; } return t; }
  function findTheme(manifest, slug){
    var groups = (manifest && manifest.groups) || [];
    for(var i=0;i<groups.length;i++){ var ts = groups[i].themes||[]; for(var k=0;k<ts.length;k++){ if(ts[k].slug===slug){ return ts[k]; } } }
    return null;
  }

  function list(){ return getJSON(base + '_index.json'); }

  // resolve(slug) -> Promise<{slug,name,mode,tokens,trail,stub,error,offline,missing}>
  function resolve(slug){
    var trail = [];
    return getJSON(base + '_index.json').then(function(idx){
      var entry = findTheme(idx, slug);
      if(!entry){ return { error:'unknown theme: "'+slug+'"', trail:['lookup "'+slug+'"','NOT IN MANIFEST'], tokens:null }; }
      var ultimateSlug = idx.ultimateFallback || DEFAULT;
      if(entry.status === 'stub' || !entry.file){
        trail.push(entry.slug+' (stub)', 'no tokens', '_base', ultimateSlug);
        return { slug:slug, name:entry.name, mode:entry.mode||'mid', tokens:assign({}, ULTIMATE), trail:trail, stub:true };
      }
      return getJSON(base + entry.file).then(function(def){
        if(!def.tokens){
          trail.push(entry.slug+' ('+entry.status+')', 'tokens null', '_base', ultimateSlug);
          return { slug:slug, name:entry.name, mode:entry.mode||'mid', tokens:assign({}, ULTIMATE), trail:trail, stub:true };
        }
        var out = {}, missing = [];
        TOKEN_KEYS.forEach(function(key){ if(def.tokens[key]){ out[key]=def.tokens[key]; } else { out[key]=ULTIMATE[key]; missing.push(key); } });
        trail.push(entry.slug+' ('+entry.status+')', missing.length ? (missing.length+' key(s) -> _base') : 'all keys resolved');
        return { slug:slug, name:entry.name, mode:def.mode||entry.mode||'mid', tokens:out, trail:trail, stub:false, missing:missing };
      });
    }).catch(function(err){
      return { slug:slug, name:'(offline fallback)', mode:'mid', tokens:assign({}, ULTIMATE), trail:['fetch failed: '+err.message, 'ULTIMATE fallback (default-theme)'], stub:false, offline:true };
    });
  }

  // apply(slug, {root, aliasMap, setMode, onResolved, onError}) -> Promise
  function apply(slug, opts){
    opts = opts || {};
    var root = opts.root || document.documentElement;
    return resolve(slug).then(function(res){
      if(res.error){ if(opts.onError){ opts.onError(res); } else { banner(res.error); } return res; }
      TOKEN_KEYS.forEach(function(key){ if(res.tokens[key]){ root.style.setProperty('--'+key, res.tokens[key]); } });
      if(opts.aliasMap){ Object.keys(opts.aliasMap).forEach(function(tokenKey){ if(res.tokens[tokenKey]){ root.style.setProperty('--'+opts.aliasMap[tokenKey], res.tokens[tokenKey]); } }); }
      if(opts.setMode !== false){ root.setAttribute('data-mode', res.mode); root.setAttribute('data-theme', res.slug); }
      if(opts.onResolved){ opts.onResolved(res); }
      return res;
    });
  }

  function banner(msg){
    var d = document.createElement('div');
    d.textContent = 'themes: ' + msg;
    d.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99999;background:oklch(0.55 0.19 25);color:oklch(0.98 0.01 25);font:600 13px ui-monospace,Menlo,monospace;padding:8px 14px;text-align:center';
    (document.body || document.documentElement).appendChild(d);
  }

  window.THEMES = { resolve:resolve, apply:apply, list:list, TOKEN_KEYS:TOKEN_KEYS, DEFAULT:DEFAULT, base:base };
})();
