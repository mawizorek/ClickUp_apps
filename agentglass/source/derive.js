/* AgentGlass v2 — tagless capture.

   THE POINT: an agent should not have to opt in to being seen. Almost nothing on the real board
   carries a JSON telemetry block, yet every comment is dense with exactly the facts the dashboard
   wants — who spoke, what they did, what they touched, whether they're waiting on Michael. The
   telemetry hook is now the HIGH-CONFIDENCE path, not the only path.

   Three confidence tiers, always labeled in the UI:
     tagged   — a real telemetry block was found. Fields are asserted.
     derived  — no block; agent + action + status inferred from how the comment is written.
     ambient  — a comment on a session task with no agent signal at all. Counted as session
                activity (the session is alive) but attributed to nobody.

   Mirrored in server/derive.ts. Keep the two in step. */

window.AGDerive = (function(){
  "use strict";

  /* Signature table. Built from what agents ACTUALLY post, not from what a spec wishes they posted.
     Emoji first because it survives dictation, reformatting, and mobile clients. */
  var SIGNATURES = [
    { re: /🔍\s*(?:Audit\s+)?Anna/i,            agent: "Audit Anna" },
    { re: /🎼\s*(?:Maestro\s+)?Mira/i,          agent: "Maestro Mira" },
    { re: /⚒️|DEXTER · AT THE KEYBOARD/i,        agent: "Dev Dexter" },
    { re: /🐎|WES HERE/i,                        agent: "Workhorse Wes" },
    { re: /🎭|MILO · ON HEADSET/i,               agent: "Mainstage Milo" },
    { re: /🧲\s*Fold-?in\s+Frank/i,              agent: "Fold-in Frank" },
    { re: /♻️\s*Eco\s+Enzo/i,                    agent: "Eco Enzo" },
    { re: /💡\s*Clever\s+Cleo/i,                 agent: "Clever Cleo" },
    { re: /📦\s*Scope\s+Skye/i,                  agent: "Scope Skye" }
  ];

  /* Fallback: any known roster name appearing in the first ~160 chars. Names are distinctive
     enough (alliterative by design) that this is safe; we only take the FIRST match so a comment
     that merely mentions another agent doesn't get misattributed. */
  var ROSTER = [
    "Fleet Felix","Maestro Mira","Audit Anna","Dev Dexter","Workhorse Wes","Mainstage Milo",
    "ClickUp Coach Corey","Fold-in Frank","Breaker Beckett","Risk Rhys","Clever Cleo",
    "Polish Polly","Feasible Finn","Scope Skye","Eco Enzo","Scribe Sana","Handoff Hana",
    "Closing Clio","Memory Maggie","Scout Sage","Recon Renata","Size Sally","Style Stu",
    "Domain Dara","Novice Nia","Future Faye","Counter Cole","Pivot Piper","Cautious Cass",
    "Literal Lena","Mimic Mika","GPT-4o"
  ];

  /* Bracket prefixes the fleet already uses as de-facto event types. */
  var KINDS = [
    { re: /^\[TRANSCRIPT/i,      kind: "transcript" },
    { re: /^\[RECONCIL/i,        kind: "reconcile" },
    { re: /^\[CONFIRMS?/i,       kind: "confirm" },
    { re: /^\[SESSION CLOSE/i,   kind: "close" },
    { re: /^\[PROSE SWEEP/i,     kind: "sweep" },
    { re: /^\[RESUMABILITY/i,    kind: "resume" },
    { re: /OPENING POST/i,       kind: "convene" }
  ];

  /* Status inference. Ordered: a comment that both ships something AND parks a question is
     WAITING, because the open question is the thing Michael has to act on. */
  var WAITING = /\b(awaiting|await|pending michael|michael'?s call|michael rules|his sign-?off|proposed,? not executed|no writes until|held for|awaiting go|parked|blocked on|needs? (?:a )?human|waiting on)\b/i;
  var DONE    = /\b(session close|closed out|signing off|wrapped)\b/i;

  function statusFrom(text){
    if(DONE.test(text)) return "idle";
    if(WAITING.test(text)) return "waiting_on_human";
    return "working";
  }

  /* Targets: the concrete things a comment names. These are what "target" means in practice. */
  function targetsFrom(text){
    var out = [];
    var pr = text.match(/\bPR #(\d+)/g);
    if(pr) pr.slice(0,3).forEach(function(p){ out.push(p); });
    var files = text.match(/\b[\w./-]+\.(?:md|json|ts|js|html|css|tsv)\b/g);
    if(files) files.slice(0,3).forEach(function(f){ if(out.indexOf(f) < 0) out.push(f); });
    return out;
  }

  /* Tools: named MCP/internal tools if present, otherwise inferred from what the prose describes.
     Inference is deliberately conservative — a wrong tool name is worse than none. */
  function toolsFrom(text){
    var named = text.match(/\b(?:githubmcp|search|load|create|update|post|query)_[a-z_]+/g);
    if(named) return named.filter(function(v,i,a){ return a.indexOf(v) === i; }).slice(0,6);
    var guess = [];
    if(/\bPR #\d+|merged|committed|branch\b/i.test(text)) guess.push("githubmcp_create_pull_request");
    if(/\bblob|read the file|get_file|live blob read\b/i.test(text)) guess.push("githubmcp_get_file_contents");
    if(/\bdecision log|doc page|wrote the page|rewrote\b/i.test(text)) guess.push("update_document");
    if(/\bindex row|audit status|task\b/i.test(text)) guess.push("update_task");
    return guess;
  }

  /* Headline: the first real sentence, cleaned of prefix furniture. This becomes the one line a
     human reads on the feed, so it matters more than any other derived field. */
  function headlineFrom(text){
    var t = text
      .replace(/^\[[^\]]{0,90}\]\s*/, "")                 // [TRANSCRIPT · date · agent]
      .replace(/^[^\w]{0,6}(?:═+\s*)?/, "")                // leading emoji / rules
      .replace(/^(?:[A-Z][a-z]+\s){0,2}here\s*[—:-]\s*/i, "") // "Mira here — "
      .trim();
    // drop a leading agent signature line if the real content starts on the next line
    var firstBreak = t.indexOf("\n");
    if(firstBreak > 0 && firstBreak < 42) t = t.slice(firstBreak + 1).trim();
    var m = t.match(/^(.{8,150}?)(?:[.!?](?:\s|$)|\n|$)/);
    var line = (m ? m[1] : t.slice(0, 120)).trim();
    return line.replace(/\s+/g, " ");
  }

  function agentFrom(text, fallback){
    var head = text.slice(0, 200);
    for(var i = 0; i < SIGNATURES.length; i++){
      if(SIGNATURES[i].re.test(head)) return { agent: SIGNATURES[i].agent, how: "signature" };
    }
    for(var j = 0; j < ROSTER.length; j++){
      if(head.indexOf(ROSTER[j]) >= 0) return { agent: ROSTER[j], how: "name" };
    }
    return fallback ? { agent: fallback, how: "session" } : null;
  }

  function kindFrom(text){
    for(var i = 0; i < KINDS.length; i++){
      if(KINDS[i].re.test(text.slice(0, 60)) || KINDS[i].re.test(text.slice(0, 200))) return KINDS[i].kind;
    }
    return "note";
  }

  /**
   * Derive an event from a plain comment. `tagged` takes precedence when a telemetry block exists.
   * Returns null only when there is nothing worth showing at all.
   */
  function fromComment(text, opts){
    opts = opts || {};
    if(!text || !text.trim()) return null;
    var who = agentFrom(text, opts.sessionAgent);
    var headline = headlineFrom(text);
    if(!headline) return null;
    return {
      agent: who ? who.agent : null,
      action: headline,
      tools_used: toolsFrom(text),
      target: targetsFrom(text).join(" · ") || (opts.sessionTitle || "NA"),
      status: statusFrom(text),
      kind: kindFrom(text),
      capture: who ? "derived" : "ambient",
      attribution: who ? who.how : "none"
    };
  }

  return { fromComment: fromComment, agentFrom: agentFrom, statusFrom: statusFrom,
           headlineFrom: headlineFrom, SIGNATURES: SIGNATURES, ROSTER: ROSTER };
})();
