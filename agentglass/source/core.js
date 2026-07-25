/* AgentGlass v2 — core.
   Owns: data load, time model, telemetry parser, NOW read, roster + cost derivation, router, transport.

   REPO LAW: index.html is a shell. The landing view is the one-line constant below. */

window.AG = (function(){
  "use strict";

  var DEFAULT_VIEW = "feed";           // <- repoint the landing view here, nowhere else
  var DATA_URL = "data/seed-events.json?v=2";
  var LIVE_URL = "data/live-events.json";  // written by server/poll.ts or the worker; used if present
  var STALL_MIN = 25;                  // a session with no successor this long is STALLED
  var PAD_MIN = 6;

  // $ per 1M tokens [in, out]. Estimation only.
  var RATES = {
    "Opus 5": [15,75], "Opus 4.8": [15,75], "Sonnet 4": [3,15], "GPT-4o": [2.5,10], "_default": [10,50]
  };
  var TOK_TURN = 14200, TOK_TOOL = 5400, TOK_OUT = 1150;

  var S = { data:null, events:[], sessions:{}, tMin:0, tMax:0, tLive:0, T:0, view:DEFAULT_VIEW, live:false };
  var pages = {};

  /* ───────── telemetry parsing (unchanged from v1; never fence-match) ───────── */

  function matchBrace(s, start){
    var depth = 0, inStr = false, esc = false;
    for(var i = start; i < s.length; i++){
      var c = s.charAt(i);
      if(inStr){
        if(esc) esc = false;
        else if(c === "\\") esc = true;
        else if(c === '"') inStr = false;
        continue;
      }
      if(c === '"') inStr = true;
      else if(c === "{") depth++;
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
      } catch(e){ /* keep walking */ }
      i = end;
    }
    return found;
  }

  /* ───────── time ───────── */

  function toMin(iso){ return Math.round(new Date(iso).getTime() / 60000); }
  function fmtClock(min){
    var d = new Date(min * 60000), h = d.getHours(), m = d.getMinutes();
    return (h % 12 === 0 ? 12 : h % 12) + ":" + String(m).padStart(2, "0");
  }
  function fmtStamp(min){
    var d = new Date(min * 60000);
    var days = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
    var mons = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    return (d.getHours() < 12 ? "AM" : "PM") + " \u00b7 " + days[d.getDay()] + " " +
           mons[d.getMonth()] + " " + d.getDate();
  }
  function ago(m){
    if(m < 1) return "just now";
    if(m < 60) return m + "m ago";
    var h = Math.floor(m / 60), r = m % 60;
    return h + "h" + (r ? String(r).padStart(2,"0") : "") + " ago";
  }

  function norm(status){
    if(status === "waiting_on_human" || status === "waiting") return "waiting";
    if(status === "working") return "working";
    return "idle";
  }

  function upTo(t){ return S.events.filter(function(e){ return e.min <= t; }); }

  /* ───────── SESSIONS are the unit of liveness ─────────

     v1 got this wrong and it produced a wall of false alarms: it treated every agent as a
     standing process, so a Workshop lens that spoke ONE line and handed back read as "went quiet
     mid-work." Frank, Dara and Beckett aren't stuck; they contributed and the room moved on.

     The fix is a rule, not a threshold: YOU CAN ONLY BE SILENT IF YOU ARE THE LAST VOICE IN YOUR
     SESSION. If someone spoke after you, you handed off. Silence is a property of the SESSION —
     the thread nobody came back to — and only its last speaker carries it. */

  function sessionStates(t){
    var by = {};
    upTo(t).forEach(function(e){ (by[e.session_id] = by[e.session_id] || []).push(e); });
    return Object.keys(by).map(function(k){
      var list = by[k].sort(function(a,b){ return (a.min - b.min) || (a.seq - b.seq); });
      var last = list[list.length - 1];
      var age = t - last.min;
      var st = norm(last.status);
      if(st === "working" && age > STALL_MIN) st = "stalled";
      return {
        id: k,
        meta: S.sessions[k] || { title:k, model:"model unknown" },
        events: list,
        last: last,
        age: age,
        state: st,                       // working | waiting | idle | stalled
        voices: list.map(function(e){ return e.agent; })
                    .filter(function(v,i,a){ return v && a.indexOf(v) === i; })
      };
    }).sort(function(a,b){
      var rank = { working:0, waiting:1, stalled:2, idle:3 };
      return (rank[a.state] - rank[b.state]) || (a.age - b.age);
    });
  }

  /* Roster derived FROM sessions, so an agent's state inherits its session's reality. */
  function roster(t){
    var out = [], seen = {};
    sessionStates(t).forEach(function(s){
      s.events.slice().reverse().forEach(function(e){
        if(!e.agent || seen[e.agent]) return;
        seen[e.agent] = true;
        var isLast = e.comment_id === s.last.comment_id;
        var st;
        if(isLast) st = s.state;               // carries the session's fate
        else st = "handed";                     // spoke, then the room moved on. NOT an alarm.
        out.push({ agent:e.agent, st:st, age:t - e.min, e:e, session:s });
      });
    });
    var rank = { working:0, waiting:1, stalled:2, handed:3, idle:4 };
    return out.sort(function(a,b){ return (rank[a.st] - rank[b.st]) || (a.age - b.age); });
  }

  /* THE NOW READ — the one thing v1 had no answer for.
     Plain language, top of screen, no counting required. */
  function now(t){
    var sess = sessionStates(t);
    var live = sess.filter(function(s){ return s.state === "working"; });
    var held = sess.filter(function(s){ return s.state === "waiting"; });
    var stalled = sess.filter(function(s){ return s.state === "stalled"; });
    var all = upTo(t);
    var latest = all.length ? all[all.length - 1] : null;

    var mood = live.length ? "working" : (stalled.length ? "stalled" : (held.length ? "waiting" : "idle"));
    var line;
    if(!latest) line = "Nothing has happened yet.";
    else if(live.length === 1) line = live[0].last.agent + " is mid-run on " + live[0].meta.title + ".";
    else if(live.length > 1) line = live.length + " sessions are running right now.";
    else if(held.length) line = "Nothing is running. " + held.length +
         (held.length === 1 ? " session is" : " sessions are") + " waiting on you.";
    else if(stalled.length) line = "Nothing is running, and " + stalled.length +
         (stalled.length === 1 ? " session went" : " sessions went") + " quiet mid-work.";
    else line = "The fleet is idle. Everything finished clean.";

    return {
      mood: mood, line: line, latest: latest,
      live: live, held: held, stalled: stalled,
      sessions: sess,
      lastAge: latest ? t - latest.min : null
    };
  }

  function gaps(t){
    var by = {}, out = {};
    upTo(t).forEach(function(e){ (by[e.session_id] = by[e.session_id] || []).push(e); });
    Object.keys(by).forEach(function(k){
      var list = by[k].slice().sort(function(a,b){ return a.seq - b.seq; });
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
      if(!e.verified) return;
      turns[e.session_id] = (turns[e.session_id] || 0) + 1;
      tools[e.session_id] = (tools[e.session_id] || 0) + (e.tools_used || []).length;
    });
    Object.keys(turns).forEach(function(k){
      var sess = S.sessions[k] || {};
      var rate = RATES[sess.model] || RATES._default;
      est += ((turns[k]*TOK_TURN + tools[k]*TOK_TOOL)/1e6)*rate[0] + ((turns[k]*TOK_OUT)/1e6)*rate[1];
      real += sess.real_usd || 0;
    });
    return { est:est, real:real };
  }

  /* Capture mix — how much of what you're seeing needed no telemetry block at all. */
  function captureMix(t){
    var m = { tagged:0, derived:0, ambient:0 };
    upTo(t).forEach(function(e){ m[e.capture || "tagged"] = (m[e.capture || "tagged"] || 0) + 1; });
    return m;
  }

  /* ───────── transport ───────── */

  function density(){
    var svg = document.getElementById("density");
    var W = 400, H = 44, bucket = Math.max(4, Math.round((S.tMax - S.tMin) / 90));
    var n = Math.max(1, Math.ceil((S.tMax - S.tMin) / bucket));
    var counts = new Array(n).fill(0);
    S.events.forEach(function(e){
      var i = Math.min(n - 1, Math.floor((e.min - S.tMin) / bucket));
      if(i >= 0) counts[i]++;
    });
    var max = Math.max.apply(null, counts.concat([1]));
    var bw = W / n, s = "";
    for(var i = 0; i < n; i++){
      var h = counts[i] ? 5 + (counts[i]/max)*(H-7) : 2;
      var x = i*bw + bw*0.18, w = Math.max(1.2, bw*0.64);
      s += '<rect class="bar" data-t="' + (S.tMin + i*bucket + bucket/2) + '" x="' + x.toFixed(2) +
           '" y="' + (H-h).toFixed(2) + '" width="' + w.toFixed(2) + '" height="' + h.toFixed(2) + '" rx="1.5"></rect>';
    }
    s += '<line x1="0" y1="43.5" x2="400" y2="43.5" stroke="oklch(31% 0.012 52)" stroke-width="1"/>';
    svg.innerHTML = s;

    var th = "";
    for(var k = 0; k < 4; k++) th += "<span>" + fmtClock(Math.round(S.tMin + (S.tMax-S.tMin)*(k/3))) + "</span>";
    document.getElementById("ticks").innerHTML = th;
    paintBars();
  }

  function paintBars(){
    var bars = document.querySelectorAll("#density .bar");
    for(var i = 0; i < bars.length; i++){
      bars[i].setAttribute("fill", +bars[i].getAttribute("data-t") <= S.T
        ? "oklch(62% 0.10 78)" : "oklch(30% 0.016 52)");
    }
  }

  function seekTo(t){ S.T = Math.max(S.tMin, Math.min(S.tLive, Math.round(t))); render(); }

  function wireTransport(){
    var track = document.getElementById("track"), bubble = document.getElementById("bubble");
    var dragging = false;
    function fromX(x){
      var r = track.getBoundingClientRect();
      seekTo(S.tMin + Math.min(1, Math.max(0, (x - r.left)/r.width)) * (S.tMax - S.tMin));
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
    var pill = document.getElementById("pill");
    pill.className = "pill " + (rewound ? "rewound" : (S.live ? "live" : "snapshot"));
    document.getElementById("pillTxt").textContent = rewound
      ? "rewound " + ago(S.tLive - S.T).replace(" ago","")
      : (S.live ? "live" : "snapshot");
    document.getElementById("nowBtn").disabled = !rewound;

    var pct = ((S.T - S.tMin) / (S.tMax - S.tMin)) * 100;
    var head = document.getElementById("head");
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
    var vp = document.getElementById("viewport");
    if(want === S.view && vp.getAttribute("data-view") === want){ render(); return; }
    S.view = want;
    fetch("pages/" + want + ".html?v=2").then(function(r){
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

  /* ───────── boot ─────────
     Tries the live file first. If the poller or worker has written one, this becomes a live board;
     if not, it falls back to the committed snapshot and SAYS SO in the pill rather than pretending. */

  function ingest(d, isLive){
    S.data = d; S.live = !!isLive;
    S.sessions = d.sessions || {};
    S.events = (d.events || []).map(function(e){
      var c = Object.assign({}, e);
      c.min = toMin(e.emitted_at);
      c.verified = e.verified !== false;
      c.capture = e.capture || "tagged";
      return c;
    }).sort(function(a,b){ return (a.min - b.min) || (a.seq - b.seq); });

    if(!S.events.length){
      document.getElementById("viewport").innerHTML =
        '<div class="empty"><h2>No activity captured yet.</h2>' +
        '<p>Nothing has been ingested. Once the poller runs, sessions appear here.</p></div>';
      return false;
    }
    S.tMin = S.events[0].min;
    S.tLive = toMin(d.captured_at || S.events[S.events.length - 1].emitted_at);
    S.tMax = S.tLive + PAD_MIN;
    S.T = S.tLive;
    return true;
  }

  function start(){
    density();
    wireTransport();
    document.getElementById("nowBtn").addEventListener("click", function(){
      seekTo(S.tLive);
      document.getElementById("viewport").scrollTop = 0;
    });
    window.addEventListener("hashchange", route);
    route();
  }

  function boot(){
    fetch(LIVE_URL, { cache: "no-store" })
      .then(function(r){ if(!r.ok) throw new Error("no live"); return r.json(); })
      .then(function(d){ if(ingest(d, true)) start(); })
      .catch(function(){
        fetch(DATA_URL).then(function(r){ return r.json(); })
          .then(function(d){ if(ingest(d, false)) start(); })
          .catch(function(){
            document.getElementById("viewport").innerHTML =
              '<p class="err">Could not load any event data.</p>';
          });
      });
  }

  var api = {
    boot: boot, state: S,
    register: function(name, mod){ pages[name] = mod; },
    roster: roster, sessionStates: sessionStates, now: now, gaps: gaps, money: money,
    captureMix: captureMix, upTo: upTo, norm: norm,
    extractTelemetry: extractTelemetry,
    fmtClock: fmtClock, fmtStamp: fmtStamp, ago: ago,
    seekTo: seekTo, render: render,
    esc: function(s){
      return String(s == null ? "" : s)
        .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
    }
  };
  return api;
})();
