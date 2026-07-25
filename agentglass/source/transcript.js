/* AgentGlass v1 — transcript view.
   The same playhead, read as a document. This is where the JSON parsing is visible: every entry can
   expand to the telemetry block, and the block is round-tripped back through the real parser so what
   you read is what the parser actually produced, not a pretty-print of the stored row. */

(function(AG){
  "use strict";

  var showRaw = false;
  var order = "asc";

  // Canonical block per the Global Telemetry hook. Used when a row has no verbatim capture.
  function blockFor(e){
    return JSON.stringify({
      agent: e.agent,
      action: e.action,
      tools_used: e.tools_used || [],
      target: e.target || "NA",
      status: e.status,
      session_id: e.session_id,
      seq: e.seq,
      emitted_at: e.emitted_at
    }, null, 2);
  }

  function paint(json, esc){
    return esc(json)
      .replace(/"([^"]+)":/g, '<span class="k">"$1"</span>:')
      .replace(/: ("(?:[^"\\]|\\.)*")/g, ': <span class="s">$1</span>')
      .replace(/: (-?\d+(?:\.\d+)?)/g, ': <span class="n">$1</span>');
  }

  function render(api){
    var S = api.state, esc = api.esc;
    var list = api.upTo(S.T);
    var G = api.gaps(S.T);
    var host = document.getElementById("transcript");
    if(!host) return;

    var meta = document.getElementById("txMeta");
    if(meta){
      meta.textContent = list.length
        ? list.length + " events \u00b7 " + api.fmtClock(S.tMin) + " to " + api.fmtClock(S.T) +
          " \u00b7 " + Object.keys(list.reduce(function(a,e){ a[e.session_id]=1; return a; }, {})).length +
          " sessions"
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
                ' event' + (count > 1 ? "s" : "") + " \u00b7 task " + esc(sess.task_id || "?") +
                '</p></div>';
        lastS = e.session_id;
      }

      if(G[e.comment_id]){
        html += '<div class="breach"><span>seq gap \u00b7 ' + G[e.comment_id] +
                ' event' + (G[e.comment_id] > 1 ? "s" : "") +
                ' never arrived</span><span class="rule"></span></div>';
      }

      var st = api.norm(e.status);
      var stLabel = st === "waiting" ? "waiting on human" : st;
      var raw = e.raw || blockFor(e);
      var parsed = api.extractTelemetry(raw);
      var ok = parsed && parsed.agent === e.agent;
      var toolLine = (e.tools_used && e.tools_used.length)
        ? e.tools_used.join(", ")
        : "no tools fired";

      html += '<article class="tx-ev' + (e.verified ? "" : " unverified") + '">' +
        '<div class="line">' +
          '<span class="stamp">' + api.fmtClock(e.min) + '</span>' +
          '<span class="who">' + esc(e.agent) + '</span>' +
          '<span class="badge ' + st + '">' + esc(stLabel) + '</span>' +
          '<span class="badge">#' + e.seq + '</span>' +
          (e.verified ? "" : '<span class="badge unver">unverified</span>') +
        '</div>' +
        '<p class="body">' + esc(e.action) + '. <em>' + esc(e.target || "NA") + '</em><br>' +
          '<em>' + esc(toolLine) + '</em>' +
          (e.verified || !e.claimed_usd ? "" :
            '<br><em>claimed $' + e.claimed_usd.toFixed(3) + ", excluded from cost\u002e</em>") +
        '</p>' +
        '<details class="tx-raw"' + (showRaw ? " open" : "") + '>' +
          '<summary>telemetry block \u00b7 ' +
            (ok ? "parsed clean" : "PARSE FAILED") +
            (e.raw ? " \u00b7 as captured" : " \u00b7 reconstructed") +
          '</summary>' +
          '<pre>' + paint(raw, esc) + '</pre>' +
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
      rawBtn.textContent = showRaw ? "Hide raw telemetry" : "Show raw telemetry";
      rawBtn.addEventListener("click", function(){
        showRaw = !showRaw;
        rawBtn.setAttribute("aria-pressed", String(showRaw));
        rawBtn.textContent = showRaw ? "Hide raw telemetry" : "Show raw telemetry";
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
