/* AgentGlass v2 — transcript view.
   The same playhead, read as a document.

   v2 change: a derived event's "raw" is PROSE, not JSON, so expanding it shows the comment as it was
   actually posted PLUS the fields that were read out of it. That side-by-side is the whole argument
   for tagless capture: you can see there was no telemetry block and see the event anyway. */

(function(AG){
  "use strict";

  var showRaw = false;
  var order = "asc";

  function blockFor(e){
    return JSON.stringify({
      agent: e.agent, action: e.action, tools_used: e.tools_used || [],
      target: e.target || "NA", status: e.status,
      session_id: e.session_id, seq: e.seq, emitted_at: e.emitted_at
    }, null, 2);
  }

  function paintJson(json, esc){
    return esc(json)
      .replace(/"([^"]+)":/g, '<span class="k">"$1"</span>:')
      .replace(/: ("(?:[^"\\]|\\.)*")/g, ': <span class="s">$1</span>')
      .replace(/: (-?\d+(?:\.\d+)?)/g, ': <span class="n">$1</span>');
  }

  /* For derived rows: show the prose, then what we pulled out of it. */
  function derivedPanel(e, api, esc){
    var raw = e.raw || "";
    var reparsed = raw && window.AGDerive
      ? window.AGDerive.fromComment(raw, { sessionAgent: e.agent })
      : null;
    var fields = [
      ["agent", e.agent + (e.attribution ? "  (" + e.attribution + ")" : "")],
      ["action", e.action],
      ["status", e.status],
      ["target", e.target],
      ["tools", (e.tools_used || []).join(", ") || "none"]
    ];
    var out = "";
    if(raw){
      out += '<pre>' + esc(raw) + '</pre>';
    }
    out += '<pre>' + fields.map(function(f){
      return '<span class="k">' + f[0] + '</span>  <span class="s">' + esc(f[1]) + '</span>';
    }).join("\n") + '</pre>';
    if(raw && reparsed){
      out += '<pre><span class="k">re-derived just now</span>  <span class="n">' +
             esc(reparsed.agent || "none") + " / " + esc(reparsed.status) +
             '</span></pre>';
    }
    return out;
  }

  function render(api){
    var S = api.state, esc = api.esc;
    var list = api.upTo(S.T);
    var G = api.gaps(S.T);
    var host = document.getElementById("transcript");
    if(!host) return;

    var mix = api.captureMix(S.T);
    var meta = document.getElementById("txMeta");
    if(meta){
      meta.textContent = list.length
        ? list.length + " events \u00b7 " + api.fmtClock(S.tMin) + " to " + api.fmtClock(S.T) +
          " \u00b7 " + (mix.derived || 0) + " read from prose, " + (mix.tagged || 0) + " from a telemetry block"
        : "Nothing to read at this position yet.";
    }

    if(!list.length){
      host.innerHTML = '<div class="empty"><h2>The transcript starts at ' + api.fmtClock(S.tMin) +
        '.</h2><p>Scrub forward and the record fills in behind the playhead.</p></div>';
      return;
    }

    var rows = order === "asc" ? list : list.slice().reverse();
    var html = "", lastS = null;

    rows.forEach(function(e){
      if(e.session_id !== lastS){
        var sess = S.sessions[e.session_id] || {};
        var count = list.filter(function(x){ return x.session_id === e.session_id; }).length;
        html += '<div class="tx-session"><h2>' + esc(sess.title || e.session_id) + '</h2>' +
                '<p class="meta">' + esc(sess.model || "model unknown") + " \u00b7 " + count +
                ' event' + (count > 1 ? "s" : "") + " \u00b7 task " + esc(sess.task_id || "?") + '</p></div>';
        lastS = e.session_id;
      }
      if(G[e.comment_id]){
        html += '<div class="breach"><span>seq gap \u00b7 ' + G[e.comment_id] + ' event' +
                (G[e.comment_id] > 1 ? "s" : "") + ' never arrived</span><span class="rule"></span></div>';
      }

      var st = api.norm(e.status);
      var stLabel = st === "waiting" ? "waiting on human" : st;
      var cap = e.capture || "tagged";
      var toolLine = (e.tools_used && e.tools_used.length) ? e.tools_used.join(", ") : "no tools fired";

      var panel, summary;
      if(cap === "tagged"){
        var raw = e.raw || blockFor(e);
        var parsed = api.extractTelemetry(raw);
        panel = '<pre>' + paintJson(raw, esc) + '</pre>';
        summary = "telemetry block \u00b7 " + (parsed && parsed.agent === e.agent ? "parsed clean" : "reconstructed");
      } else {
        panel = derivedPanel(e, api, esc);
        summary = e.raw
          ? "no telemetry block \u00b7 read from the comment itself"
          : "no telemetry block \u00b7 fields derived";
      }

      html += '<article class="tx-ev' + (e.verified ? "" : " unverified") + '">' +
        '<div class="line">' +
          '<span class="stamp">' + api.fmtClock(e.min) + '</span>' +
          '<span class="who">' + esc(e.agent || "unattributed") + '</span>' +
          '<span class="badge ' + st + '">' + esc(stLabel) + '</span>' +
          '<span class="cap cap-' + cap + '">' + cap + '</span>' +
          '<span class="badge">#' + e.seq + '</span>' +
          (e.verified ? "" : '<span class="badge unver">unverified</span>') +
        '</div>' +
        '<p class="body">' + esc(e.action) + '. <em>' + esc(e.target || "NA") + '</em><br>' +
          '<em>' + esc(toolLine) + '</em>' +
          (e.verified || !e.claimed_usd ? "" :
            '<br><em>claimed $' + e.claimed_usd.toFixed(3) + ", excluded from cost.</em>") +
        '</p>' +
        '<details class="tx-raw"' + (showRaw ? " open" : "") + '>' +
          '<summary>' + summary + '</summary>' + panel +
        '</details>' +
      '</article>';
    });

    host.innerHTML = html;
  }

  function mount(api){
    var rawBtn = document.getElementById("rawAll");
    var ordBtn = document.getElementById("txOrder");
    if(rawBtn){
      rawBtn.setAttribute("aria-pressed", String(showRaw));
      rawBtn.textContent = showRaw ? "Hide source" : "Show source";
      rawBtn.addEventListener("click", function(){
        showRaw = !showRaw;
        rawBtn.setAttribute("aria-pressed", String(showRaw));
        rawBtn.textContent = showRaw ? "Hide source" : "Show source";
        api.render();
      });
    }
    if(ordBtn){
      ordBtn.textContent = order === "asc" ? "Oldest first" : "Newest first";
      ordBtn.addEventListener("click", function(){
        order = order === "asc" ? "desc" : "asc";
        ordBtn.textContent = order === "asc" ? "Oldest first" : "Newest first";
        api.render();
      });
    }
  }

  AG.register("transcript", { render: render, mount: mount });
})(window.AG);
