/**
 * AgentGlass · telemetry extraction
 *
 * Mirrors agentglass/source/core.js `extractTelemetry`. Keep the two in step: the browser needs it to
 * show what was parsed, the ingest needs it to do the parsing.
 *
 * The rule that matters: NEVER key off the ``` fence. ClickUp delivers a comment as an array of
 * rich-text runs, so the fence is markup and may never reach `text_content`. A fence regex is a silent
 * zero-match that looks like "no agents are emitting" rather than like a bug.
 */

export type Status = "working" | "idle" | "waiting_on_human";

export interface TelemetryBlock {
  agent: string;
  action: string;
  tools_used: string[];
  target: string;
  status: Status;
  /** Added by the minimal schema extension (Decision Log Q2). Absent on older blocks. */
  session_id?: string;
  seq?: number;
  emitted_at?: string;
}

export interface ParsedEvent extends TelemetryBlock {
  comment_id: string;
  task_id: string;
  raw: string;
  verified: boolean;
}

/** String-aware brace matcher. Returns the index of the closing brace, or -1. */
function matchBrace(s: string, start: number): number {
  let depth = 0, inStr = false, esc = false;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === "{") depth++;
    else if (c === "}") { depth--; if (depth === 0) return i; }
  }
  return -1;
}

function isBlock(o: unknown): o is TelemetryBlock {
  if (!o || typeof o !== "object") return false;
  const b = o as Record<string, unknown>;
  return typeof b.agent === "string" && typeof b.status === "string";
}

/**
 * Walk every balanced `{...}` in the body and return the LAST one that looks like telemetry.
 * The hook appends the block at the end of a reply, so last-wins is correct; and walking rather than
 * anchoring means prose containing braces, or a block quoted mid-comment, does not break extraction.
 */
export function extractTelemetry(text: string | null | undefined): TelemetryBlock | null {
  if (!text) return null;
  const clean = String(text).replace(/```[a-z]*/gi, "");
  let found: TelemetryBlock | null = null;
  for (let i = 0; i < clean.length; i++) {
    if (clean[i] !== "{") continue;
    const end = matchBrace(clean, i);
    if (end < 0) break;
    try {
      const obj = JSON.parse(clean.slice(i, end + 1));
      if (isBlock(obj)) found = obj;
    } catch { /* not telemetry, keep walking */ }
    i = end;
  }
  return found;
}

/** ClickUp's shape. The body is one level deeper than it looks. */
export interface ClickUpComment {
  id: string;
  date?: string;
  text_content?: string;
  user?: { id: number; username?: string };
}

/**
 * Pull the comment out of a `taskCommentPosted` webhook payload.
 * Path is `history_items[].comment`, NOT top-level `comment`.
 */
export function commentFromWebhook(payload: any): { comment: ClickUpComment; task_id: string } | null {
  const items = payload?.history_items;
  if (!Array.isArray(items)) return null;
  for (const item of items) {
    if (item?.comment?.id) {
      return { comment: item.comment as ClickUpComment, task_id: String(payload.task_id ?? "") };
    }
  }
  return null;
}

/**
 * A sender is verified only if the pipe can corroborate it. Today that means: the comment was posted by
 * a known workspace principal AND the block's `agent` is on the roster. Until the roster is wired in,
 * everything defaults to unverified-unless-allowlisted, which is the safe direction to be wrong in.
 */
export function verifySender(c: ClickUpComment, block: TelemetryBlock, roster: Set<string>): boolean {
  if (!roster.size) return true;              // roster not wired yet: don't cry wolf on every row
  return roster.has(block.agent);
}

export function toEvent(
  c: ClickUpComment,
  task_id: string,
  roster: Set<string> = new Set()
): ParsedEvent | null {
  const block = extractTelemetry(c.text_content);
  if (!block) return null;
  return {
    ...block,
    tools_used: Array.isArray(block.tools_used) ? block.tools_used : [],
    target: block.target ?? "NA",
    comment_id: String(c.id),
    task_id,
    emitted_at: block.emitted_at ?? (c.date ? new Date(Number(c.date)).toISOString() : undefined),
    raw: c.text_content ?? "",
    verified: verifySender(c, block, roster)
  };
}
