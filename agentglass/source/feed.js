/* AgentGlass v3 — feed view, rebuilt as a CONVERSATION rather than an event log.

   What changed and why (Workshop, 2026-07-25):
   - FULL post bodies from `raw`, clamped to 7 lines with an expand. `action` was only ever our
     one-line summary OF the post; `raw` is the post. v2 rendered the summary and threw away the text.
   - ONE chronological stream. Per-session sticky headers are gone (Cleo): they fragmented the read.
     Session is quiet context inside each post now.
   - SPEAKER LANES. Michael's turns render in his own lane, visibly not an agent.
   - Emoji avatars from the canonical badge table in gates/session-transcript-gate.md. We already
     assign every voice a badge; not using it was leaving free identity on the floor.
   - No markdown parsing. Live `raw` is untrusted text off the ClickUp API, so every field goes
     through api.esc() and the body renders as plain text with `white-space: pre-wrap`. Do not
     "improve" this into innerHTML markdown without a real sanitizer. (Polly)
*/

(function(AG){
  "use strict";

  /* Canonical badges — session-transcript-gate.md. Collisions resolved for voices the gate
     table doesn't cover yet; if the gate adds a row, this follows it, not the reverse. */
  var BADGE = {
    "Maestro Mira":"\uD83C\uDFBC", "Risk Rhys":"\u26A0\uFE0F", "Breaker Beckett":"\uD83D\uDD28",
    "Clever Cleo":"\uD83D\uDCA1", "Polish Polly":"\u2728", "Feasible Finn":"\uD83D\uDD27",
    "Scope Skye":"\uD83D\uDCD0", "Eco Enzo":"\uD83C\uDF10", "Scribe Sana":"\u270D\uFE0F",
    "Fold-in Frank":"\uD83E\uDDE9", "Mimic Mika":"\uD83C\uDFAD", "Cautious Cass":"\uD83E\uDDCA",
    "Literal Lena":"\uD83D\uDCCF", "Counter Cole":"\u21A9\uFE0F", "Pivot Piper":"\uD83D\uDD00",
    "Style Stu":"\uD83D\uDE0E", "Novice Nia":"\uD83D\uDC23", "Domain Dara":"\uD83C\uDF93",
    "Future Faye":"\uD83D\uDD2E", "Handoff Hana":"\uD83C\uDFC1",
    "Dev Dexter":"\u2692\uFE0F", "Fleet Felix":"\uD83E\uDDED", "Audit Anna":"\uD83D\uDD0D",
    "Workhorse Wes":"\uD83D\uDC0E", "Mainstage Milo":"\uD83C\uDFAA", "ClickUp Coach Corey":"\uD83E\uDDF0",
    "Memory Maggie":"\uD83E\uDDE0", "Scout Sage":"\uD83D\uDD2D", "Recon Renata":"\uD83D\uDD75\uFE0F",
    "Size Sally":"\uD83D\uDCE6", "Closing Clio":"\uD83C\uDFAC", "Michael":"\uD83D\uDC64"
  };
  function badge(name, speaker){
    if(speaker === "michael") return BADGE.Michael;
    if(!name) return "\u25CB";                       // no signature found: an honest empty circle
    if(BADGE[name]) return BADGE[name];
    return name.trim().charAt(0).toUpperCase();       // unknown voice: initial, never a fake badge
  }

  /* Strip the machine furniture off a transcript comment so the body reads like what was said.
     Conservative: only removes prefixes we KNOW we added ourselves. */
  function bodyOf(e){
    var t = e.raw || e.action || "";
    t = String(t)
      .replace(/^\[TRANSCRIPT[^\]]{0,80}\]\s*/i, "")
      .replace(/^\[[A-Z][A-Z \u00b7·\-]{2,40}\]\s*/, "")
      .trim();
    // a telemetry block at the tail is metadata, not speech
    var tail = t.lastIndexOf("{\n  \"agent\"");
    if(tail > 40) t = t.slice(0, tail).trim();
    return t;
  }

  function sessionOf(api, e){
    var s = api.state.sessions[e.session_id] || {};
    return s.title || e.session_id || "";
  }

  function dayOf(min){
    var d = new Date(min * 60000);
    return d.toDateString();
  }

  function sessionChips(N, esc, ago){
    if(!N.sessions.length){
      return '<span class="agent" data-st="off"><i class="st"></i>board dark</span>';
    }
    return N.sessions.map(function(s){
      return '<span class="agent" data-st="' + s.state + '" title="' + esc(s.meta.title) + '">' +
             '<i class="st"></i>' + esc(s.last.agent || "unattributed") +
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
        ? "Last post: <b>" + esc(N.latest.agent || "someone") + "</b>, " + ago(N.lastAge) + "."
        : "";
    }

    var fleetEl = document.getElementById("fleet");
    if(fleetEl) fleetEl.innerHTML = sessionChips(N, esc, ago);

    /* ── what needs you: sessions only, never a lens that spoke once and handed back ── */
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
              ? "no one has posted since " + api.fmtClock(s.last.min) + "."
              : esc(s.last.action) + ".";
            return '<li><span class="who">' + esc(s.meta.title) + '</span><span>' + why +
                   ' <em>' + esc(s.last.agent || "") + " \u00b7 " + ago(s.age) + '</em></span></li>';
          }).join("")
        : '<li><span>Nothing is parked and nothing went quiet.</span></li>';
      if(items.length && !box.hasAttribute("data-touched")) box.open = true;
    }

    /* ── THE STREAM: one column, newest first, full bodies ── */
    var shown = api.upTo(S.T).slice().reverse();
    var feed = document.getElementById("feed");
    if(!feed) return;

    if(!shown.length){
      feed.innerHTML = '<div class="empty"><h2>Nothing posted yet.</h2><p>The board was quiet before ' +
        api.fmtClock(S.tMin) + '. Scrub right to watch it fill in.</p></div>';
    } else {
      var html = "", lastDay = null;
      shown.forEach(function(e, i){
        var day = dayOf(e.min);
        if(day !== lastDay){
          html += '<div class="daymark">' + esc(day) + '</div>';
          lastDay = day;
        }

        if(G[e.comment_id]){
          html += '<div class="breach"><span>seq gap \u00b7 ' + G[e.comment_id] + ' post' +
                  (G[e.comment_id] > 1 ? "s" : "") + ' never arrived</span><span class="rule"></span></div>';
        }

        var mine = e.speaker === "michael";
        var text = bodyOf(e);
        var longish = text.length > 340 || (text.match(/\n/g) || []).length > 6;
        var cap = e.capture || "tagged";

        var meta = "";
        if(e.target && e.target !== "NA") meta += "<span>" + esc(e.target) + "</span>";
        if(e.tools_used && e.tools_used.length){
          meta += e.tools_used.slice(0,4).map(function(t){
            return "<span>" + esc(t) + "</span>";
          }).join("");
          if(e.tools_used.length > 4) meta += '<span class="quiet">+' + (e.tools_used.length - 4) + '</span>';
        }
        if(!e.verified){
          meta += '<span class="warn">unverified sender' +
                  (e.claimed_usd ? " \u00b7 claims $" + e.claimed_usd.toFixed(3) : "") + '</span>';
        } else if(cap === "ambient"){
          meta += '<span class="quiet">no agent signature</span>';
        }

        html += '<article class="post' + (mine ? " mine" : "") + (e.verified ? "" : " unverified") +
                  '" data-st="' + api.norm(e.status) + '" data-i="' + i + '">' +
          '<div class="avatar" aria-hidden="true">' + badge(e.agent, e.speaker) + '</div>' +
          '<div>' +
            '<div class="head">' +
              '<span class="name">' + esc(mine ? "Michael" : (e.agent || "unattributed")) + '</span>' +
              '<span class="when">' + api.fmtClock(e.min) + '</span>' +
              '<span class="dot">\u00b7</span>' +
              '<span class="where">' + esc(sessionOf(api, e)) + '</span>' +
            '</div>' +
            '<p class="body' + (longish ? " clamped" : "") + '">' + esc(text) + '</p>' +
            (longish ? '<button type="button" class="more">Show more</button>' : "") +
            (meta ? '<div class="meta">' + meta + '</div>' : "") +
          '</div>' +
        '</article>';
      });
      feed.innerHTML = html;
    }

    var m = api.money(S.T), mix = api.captureMix(S.T);
    var est = document.getElementById("est"), real = document.getElementById("real");
    if(est) est.textContent = "$" + m.est.toFixed(2);
    if(real) real.textContent = "$" + m.real.toFixed(2);
    var mixEl = document.getElementById("mix");
    if(mixEl){
      var total = (mix.tagged||0) + (mix.derived||0) + (mix.ambient||0);
      mixEl.textContent = (mix.derived||0) + " of " + total + " read from prose";
    }
  }

  /* Delegated so it survives every re-render (scrubbing rebuilds the whole stream). */
  function mount(){
    var box = document.getElementById("needs");
    if(box) box.addEventListener("toggle", function(){ box.setAttribute("data-touched","1"); });

    var feed = document.getElementById("feed");
    if(!feed) return;
    feed.addEventListener("click", function(ev){
      var btn = ev.target.closest(".more");
      if(!btn) return;
      var body = btn.parentNode.querySelector(".body");
      var open = body.classList.toggle("clamped");
      btn.textContent = open ? "Show more" : "Show less";
    });
  }

  AG.register("feed", { render: render, mount: mount });
})(window.AG);
