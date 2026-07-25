/* AgentGlass v2 — feed view.
   Order on screen IS the priority order: NOW → sessions → what needs you → the stream → cost. */

(function(AG){
  "use strict";

  var VERB = {
    working: "running", waiting: "waiting on you", stalled: "went quiet", idle: "done", handed: "handed off"
  };

  function sessionChips(N, esc, ago){
    if(!N.sessions.length){
      return '<span class="agent" data-st="off"><i class="st"></i>board dark</span>';
    }
    return N.sessions.map(function(s){
      var who = s.last.agent || "unattributed";
      return '<span class="agent" data-st="' + s.state + '" title="' + esc(s.meta.title) + '">' +
             '<i class="st"></i>' + esc(who) +
             '<span class="age">' + ago(s.age).replace(" ago","") + '</span></span>';
    }).join("");
  }

  function render(api){
    var S = api.state, esc = api.esc, ago = api.ago;
    var N = api.now(S.T);
    var G = api.gaps(S.T);

    /* ── NOW ── */
    var nowEl = document.getElementById("now");
    if(nowEl){
      nowEl.setAttribute("data-mood", N.mood);
      document.getElementById("nowKicker").textContent =
        S.T < S.tLive ? "at " + api.fmtClock(S.T) : "right now";
      document.getElementById("nowLine").textContent = N.line;
      document.getElementById("nowLast").innerHTML = N.latest
        ? "Last thing that happened: <b>" + esc(N.latest.agent || "someone") + "</b> " +
          esc(N.latest.action.charAt(0).toLowerCase() + N.latest.action.slice(1)) +
          ", " + ago(N.lastAge) + "."
        : "";
    }

    document.getElementById("fleet").innerHTML = sessionChips(N, esc, ago);

    /* ── what needs you: ONLY held + stalled SESSIONS. A lens that spoke once and handed back is
       not an alarm — that was v1's false-alarm storm. ── */
    var items = N.held.concat(N.stalled);
    var box = document.getElementById("needs");
    if(box){
      box.className = "needs" + (items.length ? "" : " quiet");
      document.getElementById("needCount").textContent = items.length;
      document.getElementById("needLabel").textContent = items.length
        ? (items.length === 1 ? "1 thing needs you" : items.length + " things need you")
        : "nothing needs you";
      document.getElementById("needList").innerHTML = items.length
        ? items.map(function(s){
            var why = s.state === "stalled"
              ? "no one has posted since " + api.fmtClock(s.last.min) + ". Last beat: " +
                esc(s.last.action.charAt(0).toLowerCase() + s.last.action.slice(1)) + "."
              : esc(s.last.action) + ".";
            return '<li><span class="who">' + esc(s.meta.title) + '</span><span>' + why +
                   ' <em>' + esc(s.last.agent || "") + " \u00b7 " + ago(s.age) + '</em></span></li>';
          }).join("")
        : '<li><span>Nothing is parked and nothing went quiet.</span></li>';
      if(items.length && !box.hasAttribute("data-touched")) box.open = true;
    }

    /* ── the stream ── */
    var shown = api.upTo(S.T).slice().reverse();
    var feed = document.getElementById("feed");
    if(!feed) return;

    if(!shown.length){
      feed.innerHTML = '<div class="empty"><h2>Nothing on air yet.</h2><p>The board was dark before ' +
        api.fmtClock(S.tMin) + '. Scrub right to watch the fleet wake up.</p></div>';
    } else {
      var html = "", lastS = null;
      shown.forEach(function(e){
        if(e.session_id !== lastS){
          var sess = S.sessions[e.session_id] || {};
          html += '<div class="session-head"><div class="name">' + esc(sess.title || e.session_id) +
                  '</div><div class="model">' + esc(sess.model || "model unknown") + '</div></div>';
          lastS = e.session_id;
        }
        if(G[e.comment_id]){
          html += '<div class="breach"><span>seq gap \u00b7 ' + G[e.comment_id] + ' event' +
                  (G[e.comment_id] > 1 ? "s" : "") + ' never arrived</span><span class="rule"></span></div>';
        }
        var tools = (e.tools_used && e.tools_used.length)
          ? e.tools_used.map(function(t){ return "<span>" + esc(t) + "</span>"; }).join("")
          : '<span class="none">no tools fired</span>';
        var cap = e.capture || "tagged";
        html += '<article class="ev' + (e.verified ? "" : " unverified") + '" data-st="' +
                  api.norm(e.status) + '">' +
                  '<div class="t">' + api.fmtClock(e.min) + '</div><div>' +
                    '<div class="who"><i class="st"></i>' + esc(e.agent || "unattributed") +
                      '<span class="cap cap-' + cap + '" title="' +
                      (cap === "derived" ? "read from prose, no telemetry block" :
                       cap === "ambient" ? "activity with no agent signal" : "telemetry block found") +
                      '">' + cap + '</span>' +
                      '<span class="seq">#' + e.seq + '</span></div>' +
                    '<div class="act">' + esc(e.action) + '</div>' +
                    '<div class="tgt">' + esc(e.target || "NA") + '</div>' +
                    '<div class="tools">' + tools + '</div>' +
                    (e.verified ? "" : '<div class="flag"><span class="m">unverified</span>' +
                      'self-attested sender' +
                      (e.claimed_usd ? " \u00b7 claims $" + e.claimed_usd.toFixed(3) : "") + '</div>') +
                  '</div></article>';
      });
      feed.innerHTML = html;
    }

    var m = api.money(S.T), mix = api.captureMix(S.T);
    document.getElementById("est").textContent = "$" + m.est.toFixed(2);
    document.getElementById("real").textContent = "$" + m.real.toFixed(2);
    var mixEl = document.getElementById("mix");
    if(mixEl) mixEl.textContent = (mix.derived || 0) + " of " +
      ((mix.tagged||0)+(mix.derived||0)+(mix.ambient||0)) + " derived";
  }

  function mount(){
    var box = document.getElementById("needs");
    if(box) box.addEventListener("toggle", function(){ box.setAttribute("data-touched","1"); });
  }

  AG.register("feed", { render: render, mount: mount });
})(window.AG);
