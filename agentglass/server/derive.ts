/**
 * AgentGlass · tagless capture (ingest side)
 *
 * Mirrors agentglass/source/derive.js. Keep the two in step.
 *
 * WHY THIS EXISTS: on the real board, almost nothing carries a JSON telemetry block. What every
 * comment DOES carry is an agent signature, a headline, the artifacts it touched, and whether it's
 * handing back to Michael. So the block became the high-confidence path rather than the only path,
 * and the pipe now reads ordinary prose.
 *
 * Confidence is always labeled and never laundered:
 *   tagged  — telemetry block found. Fields asserted by the agent.
 *   derived — inferred from prose. Good enough to render, never good enough to bill.
 *   ambient — comment on a session task with no agent signal. Proves the session is alive; attributed
 *             to nobody.
 */

import { extractTelemetry, type TelemetryBlock, type ClickUpComment } from "./parse";

export type Capture = "tagged" | "derived" | "ambient";
export type Attribution = "signature" | "name" | "session" | "none";

export interface DerivedEvent {
  agent: string | null;
  action: string;
  tools_used: string[];
  target: string;
  status: "working" | "idle" | "waiting_on_human";
  kind: string;
  capture: Capture;
  attribution: Attribution;
}

/** Announce headers the fleet actually uses. Emoji first: it survives dictation and reformatting. */
const SIGNATURES: Array<{ re: RegExp; agent: string }> = [
  { re: /🔍\s*(?:Audit\s+)?Anna/i,      agent: "Audit Anna" },
  { re: /🎼\s*(?:Maestro\s+)?Mira/i,    agent: "Maestro Mira" },
  { re: /⚒️|DEXTER · AT THE KEYBOARD/i,  agent: "Dev Dexter" },
  { re: /🐎|WES HERE/i,                  agent: "Workhorse Wes" },
  { re: /🎭|MILO · ON HEADSET/i,         agent: "Mainstage Milo" },
  { re: /🧲\s*Fold-?in\s+Frank/i,        agent: "Fold-in Frank" },
  { re: /♻️\s*Eco\s+Enzo/i,              agent: "Eco Enzo" },
  { re: /💡\s*Clever\s+Cleo/i,           agent: "Clever Cleo" },
  { re: /📦\s*Scope\s+Skye/i,            agent: "Scope Skye" }
];

/**
 * Roster names as a fallback. Ideally loaded from brain-config/super-agents/roster.json at startup so
 * this list never drifts — pass it in via `roster` and this constant becomes the floor, not the truth.
 */
const ROSTER_FLOOR = [
  "Fleet Felix","Maestro Mira","Audit Anna","Dev Dexter","Workhorse Wes","Mainstage Milo",
  "ClickUp Coach Corey","Fold-in Frank","Breaker Beckett","Risk Rhys","Clever Cleo","Polish Polly",
  "Feasible Finn","Scope Skye","Eco Enzo","Scribe Sana","Handoff Hana","Closing Clio",
  "Memory Maggie","Scout Sage","Recon Renata","Size Sally","Style Stu","Domain Dara",
  "Novice Nia","Future Faye","Counter Cole","Pivot Piper","Cautious Cass","Literal Lena","Mimic Mika"
];

const KINDS: Array<{ re: RegExp; kind: string }> = [
  { re: /^\[TRANSCRIPT/i,    kind: "transcript" },
  { re: /^\[RECONCIL/i,      kind: "reconcile" },
  { re: /^\[CONFIRMS?/i,     kind: "confirm" },
  { re: /^\[SESSION CLOSE/i, kind: "close" },
  { re: /^\[PROSE SWEEP/i,   kind: "sweep" },
  { re: /^\[RESUMABILITY/i,  kind: "resume" },
  { re: /OPENING POST/i,     kind: "convene" }
];

const WAITING = /\b(awaiting|await|pending michael|michael'?s call|michael rules|his sign-?off|proposed,? not executed|no writes until|held for|awaiting go|parked|blocked on|needs? (?:a )?human|waiting on)\b/i;
const DONE = /\b(session close|closed out|signing off|wrapped)\b/i;

export function statusFrom(text: string): DerivedEvent["status"] {
  if (DONE.test(text)) return "idle";
  if (WAITING.test(text)) return "waiting_on_human";
  return "working";
}

export function agentFrom(
  text: string,
  sessionAgent?: string,
  roster: string[] = ROSTER_FLOOR
): { agent: string; how: Attribution } | null {
  const head = text.slice(0, 200);
  for (const s of SIGNATURES) if (s.re.test(head)) return { agent: s.agent, how: "signature" };
  for (const name of roster) if (head.includes(name)) return { agent: name, how: "name" };
  return sessionAgent ? { agent: sessionAgent, how: "session" } : null;
}

/** The one line a human reads on the feed. Gets more care than any other derived field. */
export function headlineFrom(text: string): string {
  let t = text
    .replace(/^\[[^\]]{0,90}\]\s*/, "")
    .replace(/^[^\w]{0,6}(?:═+\s*)?/, "")
    .replace(/^(?:[A-Z][a-z]+\s){0,2}here\s*[—:-]\s*/i, "")
    .trim();
  const nl = t.indexOf("\n");
  if (nl > 0 && nl < 42) t = t.slice(nl + 1).trim();
  const m = t.match(/^(.{8,150}?)(?:[.!?](?:\s|$)|\n|$)/);
  return (m ? m[1] : t.slice(0, 120)).trim().replace(/\s+/g, " ");
}

function targetsFrom(text: string): string[] {
  const out: string[] = [];
  (text.match(/\bPR #(\d+)/g) ?? []).slice(0, 3).forEach(p => out.push(p));
  (text.match(/\b[\w./-]+\.(?:md|json|ts|js|html|css|tsv)\b/g) ?? [])
    .slice(0, 3).forEach(f => { if (!out.includes(f)) out.push(f); });
  return out;
}

function toolsFrom(text: string): string[] {
  const named = text.match(/\b(?:githubmcp|search|load|create|update|post|query)_[a-z_]+/g);
  if (named) return [...new Set(named)].slice(0, 6);
  const guess: string[] = [];
  if (/\bPR #\d+|merged|committed|branch\b/i.test(text)) guess.push("githubmcp_create_pull_request");
  if (/\bblob|get_file|live blob read\b/i.test(text)) guess.push("githubmcp_get_file_contents");
  if (/\bdecision log|doc page|rewrote\b/i.test(text)) guess.push("update_document");
  if (/\bindex row|audit status\b/i.test(text)) guess.push("update_task");
  return guess;
}

function kindFrom(text: string): string {
  const head = text.slice(0, 200);
  for (const k of KINDS) if (k.re.test(head)) return k.kind;
  return "note";
}

/**
 * The single entry point. Tries the telemetry block first, falls back to prose, and NEVER returns a
 * silent zero — a comment on a session task always counts as at least ambient activity, because
 * "nothing here" and "we couldn't read it" must not look the same on a liveness dashboard.
 */
export function deriveEvent(
  c: ClickUpComment,
  opts: { sessionAgent?: string; sessionTitle?: string; roster?: string[] } = {}
): DerivedEvent | null {
  const text = c.text_content ?? "";
  if (!text.trim()) return null;

  const block: TelemetryBlock | null = extractTelemetry(text);
  if (block) {
    return {
      agent: block.agent,
      action: block.action ?? headlineFrom(text),
      tools_used: Array.isArray(block.tools_used) ? block.tools_used : [],
      target: block.target ?? "NA",
      status: block.status,
      kind: kindFrom(text),
      capture: "tagged",
      attribution: "signature"
    };
  }

  const who = agentFrom(text, opts.sessionAgent, opts.roster);
  const headline = headlineFrom(text);
  if (!headline) return null;

  return {
    agent: who ? who.agent : null,
    action: headline,
    tools_used: toolsFrom(text),
    target: targetsFrom(text).join(" · ") || (opts.sessionTitle ?? "NA"),
    status: statusFrom(text),
    kind: kindFrom(text),
    capture: who ? "derived" : "ambient",
    attribution: who ? who.how : "none"
  };
}
