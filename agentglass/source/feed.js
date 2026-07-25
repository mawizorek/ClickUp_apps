/* AgentGlass v1 — feed view.
   Priority 1-4 on one screen: liveness, narrative, what-needs-you, shadow cost.
   Priority 5 (latency percentiles) is deliberately absent. See README before adding it back. */

(function(AG){
  "use strict";

  function chips(R, esc, ago){
    if(!R.length){
      return '<span class="agent" data-st="off"><i class="st"></i>fleet dark</span>';
    }
    return R.map(function(a){
      var age = a.st === "silent" ? "silent " + ago(a.age) : ago(a.age);
      return '<span class="agent" data-st="' + a.st + '"><i class="st"></i>' +
             esc(a.agent) + '<span class="age">' + age + '</span></span>';
    }).join("");
  }

  function needs(R, esc, ago){
    return R.filter(function(a){ return a.st === "waiting" || a.st === "silent"; });
  }

  function render(api){
    var S = api.state, esc = api.esc, ago = api.ago;
    var R = api.roster(S.T);
    var G = api.gaps(S.T);

    var fleet = document.getElementById("fleet");
    if(fleet) fleet.innerHTML = chips(R, esc, ago);

    /* what needs you */
    var N = needs(R);
    var box = document.getElementById("needs");
    if(box){
      box.className = "needs" + (N.length ? "" : " quiet");
      document.getElementById("needCount").textContent = N.length;
      document.getElementById("needLabel").textContent = N.length
        ? (N.length === 1 ? "1 thing needs you" : N.length + " things need you")
        : "nothing needs you";
      document.getElementById("needList").innerHTML = N.length
        ? N.map(function(a){
            var why = a.st === "silent"
              ? "went quiet " + ago(a.age) + " ago mid-work. Last seen: " +
                esc(a.e.action).toLowerCase() + "."
              : esc(a.e.action).toLowerCase() + " \u2014 parked " + ago(a.age) + " ago.";
            return '<li><span class="who">' + esc(a.agent) + '</span><span>' + why + '</span></li>';
          }).join("")
        : '<li><span>Every agent is either emitting or finished clean.</span></li>';
      if(N.length && !box.hasAttribute("data-touched")) box.open = true;
    }

    /* event stream, newest first, grouped by session */
    var shown = api.upTo(S.T).slice().reverse();
    var feed = document.getElementById("feed");
    if(!feed) return;

    if(!shown.length){
      feed.innerHTML = '<div class="empty"><h2>Nothing on air yet.</h2>' +
        '<p>The board was dark before ' + api.fmtClock(S.tMin) +
        '. Scrub right to watch the fleet wake up.</p></div>';
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
          html += '<div class="breach"><span>seq gap \u00b7 ' + G[e.comment_id] +
                  ' event' + (G[e.comment_id] > 1 ? "s" : "") +
                  ' never arrived</span><span class="rule"></span></div>';
        }
        var tools = (e.tools_used && e.tools_used.length)
          ? e.tools_used.map(function(t){ return "<span>" + esc(t) + "</span>"; }).join("")
          : '<span class="none">no tools fired</span>';
        html += '<article class="ev' + (e.verified ? "" : " unverified") +
                '" data-st="' + api.norm(e.status) + '">' +
                  '<div class="t">' + api.fmtClock(e.min) + '</div><div>' +
                    '<div class="who"><i class="st"></i>' + esc(e.agent) +
                      '<span class="seq">#' + e.seq + '</span></div>' +
                    '<div class="act">' + esc(e.action) + '</div>' +
                    '<div class="tgt">' + esc(e.target || "NA") + '</div>' +
                    '<div class="tools">' + tools + '</div>' +
                    (e.verified ? "" :
                      '<div class="flag"><span class="m">unverified</span>self-attested sender' +
                      (e.claimed_usd ? " \u00b7 claims $" + e.claimed_usd.toFixed(3) : "") + '</div>') +
                  '</div></article>';
      });
      feed.innerHTML = html;
    }

    var m = api.money(S.T);
    var est = document.getElementById("est"), real = document.getElementById("real");
    if(est) est.textContent = "$" + m.est.toFixed(2);
    if(real) real.textContent = "$" + m.real.toFixed(2);
  }

  function mount(api){
    var box = document.getElementById("needs");
    if(box){
      box.addEventListener("toggle", function(){ box.setAttribute("data-touched", "1"); });
    }
  }

  AG.register("feed", { render: render, mount: mount });
})(window.AG);
