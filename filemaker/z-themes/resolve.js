/* z-themes/resolve.js — canonical slug → tokens resolver for FileMaker layout renderers.
   The SINGLE source of resolution truth: every renderer calls this instead of
   reimplementing token lookup. Fetches the z-themes manifest + the theme file,
   runs the fallback trail, and applies the 10 cv-* tokens as CSS custom properties.

   Fallback trail (fail loud):
     unknown slug        → visible error banner, no skin applied
     status: stub        → _base spine → ultimate fallback (maw-dark-utility)
     resolved, key gap   → that key falls back to the ultimate spine
     fetch fails (file://)→ ultimate fallback so it never white-screens (reported)

   Depth-independent: computes the z-themes base dir from its own <script src>,
   so a renderer at any folder depth just points a <script> tag at this file.

   Usage:
     <script src="../../../../z-themes/resolve.js"></script>
     ZTHEMES.apply('maw-dark-utility', { root: document.documentElement });
     // optional aliasMap for renderers using local var names:
     ZTHEMES.apply('maw-dark-utility', { aliasMap: { 'cv-bg':'t-bg', ... } });
*/
(function(){
  var TOKEN_KEYS = ["cv-bg","cv-part-header","cv-part-body","cv-part-footer","cv-field-fill","cv-field-border","cv-field-text","cv-label","cv-accent","cv-title"];
  // maw-dark-utility, embedded so a fetch failure never blanks the render
  var ULTIMATE = {
    "cv-bg":"oklch(0.23 0.013 260)","cv-part-header":"oklch(0.285 0.02 260)","cv-part-body":"oklch(0.235 0.012 260)",
    "cv-part-footer":"oklch(0.27 0.016 260)","cv-field-fill":"oklch(0.31 0.014 260)","cv-field-border":"oklch(0.44 0.02 260)",
    "cv-field-text":"oklch(0.94 0.008 260)","cv-label":"oklch(0.70 0.012 260)","cv-accent":"oklch(0.72 0.11 205)","cv-title":"oklch(0.96 0.02 205)"
  };

  // base dir of THIS script (…/z-themes/)
  var base = (function(){
    var s = document.currentScript && document.currentScript.src;
    if(!s){ var els = document.getElementsByTagName('script'); s = els[els.length-1].src; }
    return s.replace(/[^/]*$/, '');
  })();

  function getJSON(url){ return fetch(url, {cache:'no-store'}).then(function(r){ if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); }); }
  function assign(t, s){ for(var k in s){ if(Object.prototype.hasOwnProperty.call(s,k)) t[k]=s[k]; } return t; }
  function findTheme(manifest, slug){
    var groups = (manifest && manifest.groups) || [];
    for(var i=0;i<groups.length;i++){ var ts = groups[i].themes||[]; for(var k=0;k<ts.length;k++){ if(ts[k].slug===slug) return ts[k]; } }
    return null;
  }

  // resolve(slug) -> Promise<{slug,name,tokens,trail,stub,error,offline}>
  function resolve(slug){
    var trail = [];
    return getJSON(base + '_index.json').then(function(idx){
      var entry = findTheme(idx, slug);
      if(!entry){ return { error:'unknown theme: "'+slug+'"', trail:['lookup "'+slug+'"','NOT IN MANIFEST'], tokens:null }; }
      var ultimateSlug = idx.ultimateFallback || 'maw-dark-utility';
      if(entry.status === 'stub' || !entry.file){
        trail.push(entry.slug+' (stub)', 'no tokens', '_base', ultimateSlug);
        return { slug:slug, name:entry.name, tokens:assign({}, ULTIMATE), trail:trail, stub:true };
      }
      return getJSON(base + entry.file).then(function(def){
        if(!def.tokens){
          trail.push(entry.slug+' ('+entry.status+')', 'tokens null', '_base', ultimateSlug);
          return { slug:slug, name:entry.name, tokens:assign({}, ULTIMATE), trail:trail, stub:true };
        }
        var out = {}, missing = [];
        TOKEN_KEYS.forEach(function(key){ if(def.tokens[key]){ out[key]=def.tokens[key]; } else { out[key]=ULTIMATE[key]; missing.push(key); } });
        trail.push(entry.slug+' ('+entry.status+')', missing.length ? (missing.length+' key(s) -> _base') : 'all keys resolved');
        return { slug:slug, name:entry.name, tokens:out, trail:trail, stub:false, missing:missing };
      });
    }).catch(function(err){
      return { slug:slug, name:'(offline fallback)', tokens:assign({}, ULTIMATE), trail:['fetch failed: '+err.message, 'ULTIMATE fallback'], stub:false, offline:true };
    });
  }

  // apply(slug, {root, aliasMap, onResolved, onError}) -> Promise<result>
  function apply(slug, opts){
    opts = opts || {};
    var root = opts.root || document.documentElement;
    return resolve(slug).then(function(res){
      if(res.error){ if(opts.onError){ opts.onError(res); } else { banner(res.error); } return res; }
      TOKEN_KEYS.forEach(function(key){ if(res.tokens[key]) root.style.setProperty('--'+key, res.tokens[key]); });
      if(opts.aliasMap){ Object.keys(opts.aliasMap).forEach(function(cvKey){ if(res.tokens[cvKey]) root.style.setProperty('--'+opts.aliasMap[cvKey], res.tokens[cvKey]); }); }
      if(opts.onResolved) opts.onResolved(res);
      return res;
    });
  }

  function banner(msg){
    var d = document.createElement('div');
    d.textContent = 'z-themes: ' + msg;
    d.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99999;background:oklch(0.55 0.19 25);color:oklch(0.98 0.01 25);font:600 13px ui-monospace,Menlo,monospace;padding:8px 14px;text-align:center';
    (document.body || document.documentElement).appendChild(d);
  }

  window.ZTHEMES = { resolve:resolve, apply:apply, TOKEN_KEYS:TOKEN_KEYS, base:base };
})();
