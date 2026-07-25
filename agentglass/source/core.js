/* AgentGlass v1 — core.
   Owns: data load, the time model, the telemetry parser, roster + cost derivation, the router,
   and the scrub transport. Views register themselves on AG.pages and get called with the state.

   REPO LAW: index.html is a shell. The landing view is the one-line constant below. */

window.AG = (function(){
  "use strict";

  var DEFAULT_VIEW = "feed";          // <- repoint the landing view here, nowhere else
  var DATA_URL = "data/seed-events.json?v=1";
  var STALE_MIN = 12;                  // minutes of silence before a `working` agent reads as SILENT
  var PAD_MIN = 6;                     // dead air kept to the right of the live edge

  // $ per 1M tokens [in, out]. Estimation only. Wrong numbers here cost an estimate, never data.
  var RATES = {
    "Opus 5":   [15, 75],
    "Opus 4.8": [15, 75],
    "Sonnet 4": [3, 15],
    "GPT-4o":   [2.5, 10],
    "_default": [10, 50]
  };
  var TOKENS_PER_TURN = 14200;         // context replay dominates a Brain turn
  var TOKENS_PER_TOOL = 5400;
  var TOKENS_OUT_TURN = 1150;

  var S = { data:null, events:[], sessions:{}, tMin:0, tMax:0, tLive:0, T:0, view:DEFAULT_VIEW };
  var pages = {};

  /* ───────── telemetry parsing ─────────
     Shape-agnostic ON PURPOSE. ClickUp delivers a comment as an array of rich-text runs, so the
     ```json fence is MARKUP, not text, and may never reach text_content. Keying off the fence is a
     silent zero-match forever. We strip any fence that survives, then brace-match with string
     awareness and take the LAST valid telemetry object in the body (the hook appends it at the end).
     Mirrored in server/parse.ts — keep the two in step. */

  function matchBrace(s, start){
    var depth = 0, inStr = false, esc = false;
    for(var i = start; i < s.length; i++){
      var c = s.charAt(i);
      if(inStr){
        if(esc){ esc = false; }
        else if(c === "\\"){ esc = true; }
        else if(c === '"'){ inStr = false; }
        continue;
      }
      if(c === '"'){ inStr = true; }
      else if(c === "{"){ depth++; }
      else if(c === "}"){ depth--; if(depth === 0) return i; }
    }
    return -1;
  }

  function extractTelemetry(text){
    if(!text) return null;
    var clean = String(text).replace(/```[a-z]*/gi, "");
    var found = null;
    for(var i = 0; i < clean.length; i++){
      if(clean.charAt(i) !== "{") continue;
      var end = matchBrace(clean, i);
      if(end < 0) break;
      try {
        var obj = JSON.parse(clean.slice(i, end + 1));
        if(obj && typeof obj === "object" && obj.agent && obj.status) found = obj;
      } catch(e){ /* not a telemetry object, keep walking */ }
      i = end;
    }
    return found;
  }

  /* ───────── time ───────── */

  function toMin(iso){
    var d = new Date(iso);
    return Math.round(d.getTime() / 60000);
  }
  function fmtClock(min){
    var d = new Date(min * 60000);
    var h = d.getHours(), m = d.getMinutes();
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ":" + String(m).padStart(2, "0");
  }
  function fmtStamp(min){
    var d = new Date(min * 60000);
    var mer = d.getHours() < 12 ? "AM" : "PM";
    var days = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
    var mons = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    return mer + " \u00b7 " + days[d.getDay()] + " " + mons[d.getMonth()] + " " + d.getDate();
  }
  function ago(m){
    if(m < 1) return "now";
    if(m < 60) return m + "m";
    var h = Math.floor(m / 60), r = m % 60;
    return h + "h" + (r ? String(r).padStart(2, "0") : "");
  }

  /* ───────── derivations ─────────
     Nothing here trusts an agent's own numbers. Status is normalized, silence is inferred from the
     clock, gaps are inferred from seq, and cost is inferred from observable volume (Decision Log J4). */

  function norm(status){
    if(status === "waiting_on_human" || status === "waiting") return "waiting";
    if(status === "working") return "working";
    return "idle";
  }

  function upTo(t){
    return S.events.filter(function(e){ return e.min <= t; });
  }

  function roster(t){
    var seen = {}, order = [];
    upTo(t).forEach(function(e){
      if(!seen[e.agent]) order.push(e.agent);
      seen[e.agent] = e;
    });
    var out = order.map(function(name){
      var e = seen[name];
      var st = norm(e.status), age = t - e.min;
      if(st === "working" && age > STALE_MIN) st = "silent";
      return { agent:name, st:st, age:age, e:e };
    });
    var rank = { working:0, waiting:1, silent:2, idle:3 };
    out.sort(function(a,b){ return (rank[a.st] - rank[b.st]) || (a.age - b.age); });
    return out;
  }

  // seq gaps, computed per session against what has actually arrived
  function gaps(t){
    var bySession = {}, out = {};
    upTo(t).forEach(function(e){
      (bySession[e.session_id] = bySession[e.session_id] || []).push(e);
    });
    Object.keys(bySession).forEach(function(k){
      var list = bySession[k].slice().sort(function(a,b){ return a.seq - b.seq; });
      for(var i = 1; i < list.length; i++){
        var miss = list[i].seq - list[i-1].seq - 1;
        if(miss > 0) out[list[i].comment_id] = miss;
      }
    });
    return out;
  }

  function money(t){
    var turns = {}, tools = {}, est = 0, real = 0;
    upTo(t).forEach(function(e){
      if(!e.verified) return;                       // never price a self-attested sender
      turns[e.session_id] = (turns[e.session_id] || 0) + 1;
      tools[e.session_id] = (tools[e.session_id] || 0) + (e.tools_used || []).length;
    });
    Object.keys(turns).forEach(function(k){
      var sess = S.sessions[k] || {};
      var rate = RATES[sess.model] || RATES._default;
      var tin = turns[k] * TOKENS_PER_TURN + tools[k] * TOKENS_PER_TOOL;
      var tout = turns[k] * TOKENS_OUT_TURN;
      est += (tin / 1e6) * rate[0] + (tout / 1e6) * rate[1];
      real += sess.real_usd || 0;
    });
    return { est:est, real:real };
  }

  /* ───────── transport ───────── */

  function density(){
    var svg = document.getElementById("density");
    var W = 400, H = 44, bucket = 4;
    var n = Math.max(1, Math.ceil((S.tMax - S.tMin) / bucket));
    var counts = new Array(n).fill(0);
    S.events.forEach(function(e){
      var i = Math.min(n - 1, Math.floor((e.min - S.tMin) / bucket));
      if(i >= 0) counts[i]++;
    });
    var max = Math.max.apply(null, counts.concat([1]));
    var bw = W / n, s = "";
    for(var i = 0; i < n; i++){
      var h = counts[i] ? 5 + (counts[i] / max) * (H - 7) : 2;
      var x = i * bw + bw * 0.18, w = bw * 0.64;
      var mid = S.tMin + i * bucket + bucket / 2;
      s += '<rect class="bar" data-t="' + mid + '" x="' + x.toFixed(2) + '" y="' + (H-h).toFixed(2) +
           '" width="' + w.toFixed(2) + '" height="' + h.toFixed(2) + '" rx="1.5"></rect>';
    }
    s += '<line x1="0" y1="43.5" x2="400" y2="43.5" stroke="oklch(31% 0.012 52)" stroke-width="1"/>';
    svg.innerHTML = s;

    var ticks = document.getElementById("ticks"), th = "";
    for(var k = 0; k < 4; k++){
      th += "<span>" + fmtClock(Math.round(S.tMin + (S.tMax - S.tMin) * (k / 3))) + "</span>";
    }
    ticks.innerHTML = th;
    paintBars();
  }

  function paintBars(){
    var bars = document.querySelectorAll("#density .bar");
    for(var i = 0; i < bars.length; i++){
      var past = +bars[i].getAttribute("data-t") <= S.T;
      bars[i].setAttribute("fill", past ? "oklch(62% 0.10 78)" : "oklch(30% 0.016 52)");
    }
  }

  function seekTo(t){
    S.T = Math.max(S.tMin, Math.min(S.tLive, Math.round(t)));
    render();
  }

  function wireTransport(){
    var track = document.getElementById("track");
    var bubble = document.getElementById("bubble");
    var dragging = false;

    function fromX(x){
      var r = track.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (x - r.left) / r.width));
      seekTo(S.tMin + p * (S.tMax - S.tMin));
    }
    track.addEventListener("pointerdown", function(e){
      dragging = true; track.setPointerCapture(e.pointerId);
      bubble.classList.add("on"); fromX(e.clientX);
    });
    track.addEventListener("pointermove", function(e){ if(dragging) fromX(e.clientX); });
    function stop(){ dragging = false; bubble.classList.remove("on"); }
    track.addEventListener("pointerup", stop);
    track.addEventListener("pointercancel", stop);
    track.addEventListener("keydown", function(e){
      var step = e.shiftKey ? 10 : 1;
      if(e.key === "ArrowLeft"){ seekTo(S.T - step); e.preventDefault(); }
      else if(e.key === "ArrowRight"){ seekTo(S.T + step); e.preventDefault(); }
      else if(e.key === "Home"){ seekTo(S.tMin); e.preventDefault(); }
      else if(e.key === "End"){ seekTo(S.tLive); e.preventDefault(); }
    });

    var keys = document.querySelectorAll(".keys button");
    for(var i = 0; i < keys.length; i++){
      keys[i].addEventListener("click", function(){
        var j = this.getAttribute("data-jump");
        if(j === "start") seekTo(S.tMin);
        else if(j) seekTo(S.T + parseInt(j, 10));
        else seekTo(S.tLive);
        document.getElementById("viewport").scrollTop = 0;
      });
    }
  }

  /* ───────── chrome + router ───────── */

  function chrome(){
    var rewound = S.T < S.tLive;
    document.getElementById("clock").textContent = fmtClock(S.T);
    document.getElementById("stamp").textContent = fmtStamp(S.T);
    document.getElementById("pill").className = "pill " + (rewound ? "rewound" : "live");
    document.getElementById("pillTxt").textContent = rewound ? "\u2212" + ago(S.tLive - S.T) : "live";
    document.getElementById("nowBtn").disabled = !rewound;

    var head = document.getElementById("head");
    var pct = ((S.T - S.tMin) / (S.tMax - S.tMin)) * 100;
    head.className = "head" + (rewound ? " rewound" : "");
    head.style.left = pct + "%";
    var bubble = document.getElementById("bubble");
    bubble.style.left = pct + "%";
    bubble.textContent = fmtClock(S.T);

    var track = document.getElementById("track");
    track.setAttribute("aria-valuemin", S.tMin);
    track.setAttribute("aria-valuemax", S.tLive);
    track.setAttribute("aria-valuenow", S.T);
    track.setAttribute("aria-valuetext", fmtClock(S.T) + " " + fmtStamp(S.T));

    var R = roster(S.T);
    var on = R.filter(function(a){ return a.st === "working"; }).length;
    var held = R.filter(function(a){ return a.st === "waiting"; }).length;
    var quiet = R.filter(function(a){ return a.st === "silent"; }).length;
    document.getElementById("roll").innerHTML = R.length
      ? "<b>" + on + "</b> on air<span class='sep'>\u00b7</span><b>" + held +
        "</b> held<span class='sep'>\u00b7</span><b>" + quiet + "</b> silent"
      : "<b>0</b> agents on the board";

    document.getElementById("tabFeed").setAttribute("aria-selected", S.view === "feed");
    document.getElementById("tabTranscript").setAttribute("aria-selected", S.view === "transcript");
    paintBars();
  }

  function render(){
    chrome();
    var page = pages[S.view];
    if(page && page.render) page.render(api);
  }

  function route(){
    var want = (location.hash || "").replace(/^#\/?/, "") || DEFAULT_VIEW;
    if(!pages[want]) want = DEFAULT_VIEW;
    if(want === S.view && document.getElementById("viewport").getAttribute("data-view") === want){
      render(); return;
    }
    S.view = want;
    var vp = document.getElementById("viewport");
    fetch("pages/" + want + ".html?v=1").then(function(r){
      if(!r.ok) throw new Error(r.status);
      return r.text();
    }).then(function(html){
      vp.innerHTML = html;
      vp.setAttribute("data-view", want);
      vp.scrollTop = 0;
      if(pages[want].mount) pages[want].mount(api);
      render();
    }).catch(function(){
      vp.innerHTML = '<p class="err">Could not load the ' + want + ' view.</p>';
    });
  }

  /* ───────── boot ───────── */

  function boot(){
    fetch(DATA_URL).then(function(r){
      if(!r.ok) throw new Error(r.status);
      return r.json();
    }).then(function(d){
      S.data = d;
      S.sessions = d.sessions || {};
      S.events = (d.events || []).map(function(e){
        var c = Object.assign({}, e);
        c.min = toMin(e.emitted_at);
        c.verified = e.verified !== false;
        return c;
      }).sort(function(a,b){ return (a.min - b.min) || (a.seq - b.seq); });

      if(!S.events.length){
        document.getElementById("viewport").innerHTML =
          '<div class="empty"><h2>No telemetry yet.</h2><p>Nothing has been ingested. ' +
          'Once the poller runs, sessions appear here.</p></div>';
        return;
      }
      S.tMin = S.events[0].min;
      S.tLive = toMin(d.captured_at || S.events[S.events.length - 1].emitted_at);
      S.tMax = S.tLive + PAD_MIN;
      S.T = S.tLive;

      density();
      wireTransport();
      document.getElementById("nowBtn").addEventListener("click", function(){
        seekTo(S.tLive);
        document.getElementById("viewport").scrollTop = 0;
      });
      window.addEventListener("hashchange", route);
      route();
    }).catch(function(){
      document.getElementById("viewport").innerHTML =
        '<p class="err">Could not load the event data.</p>';
    });
  }

  var api = {
    boot: boot,
    state: S,
    register: function(name, mod){ pages[name] = mod; },
    // derivations
    roster: roster, gaps: gaps, money: money, upTo: upTo, norm: norm,
    // parsing (exposed so the transcript view can show real parse output)
    extractTelemetry: extractTelemetry,
    // formatting
    fmtClock: fmtClock, fmtStamp: fmtStamp, ago: ago,
    seekTo: seekTo, render: render,
    esc: function(s){
      return String(s == null ? "" : s)
        .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
    }
  };
  return api;
})();
