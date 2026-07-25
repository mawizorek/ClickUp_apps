/**
 * AgentGlass · stage 1 ingest: poll the ClickUp comments API.
 *
 * DOES NOT RUN ON GITHUB PAGES. Run locally with Bun:
 *   export CLICKUP_TOKEN=pk_...
 *   bun run poll.ts
 *
 * Why polling before webhooks (Decision Log Q4): zero infrastructure, nothing to expose, no signature to
 * verify, testable immediately. The webhook + cloudflared tunnel is stage 2, once the parser is proven
 * against real traffic. Latency of a minute is irrelevant for a dashboard whose job is conveying
 * liveness at human reading speed.
 */

import { toEvent, type ParsedEvent } from "./parse";

const TOKEN = process.env.CLICKUP_TOKEN ?? "";
const LIST_ID = process.env.AGENTGLASS_LIST_ID ?? "4026861396055493779"; // Agent Activity Board
const INTERVAL_MS = Number(process.env.AGENTGLASS_INTERVAL ?? 60_000);
const RAW_PATH = "raw/comments.jsonl";
const OUT_PATH = "../data/live-events.json";
const API = "https://api.clickup.com/api/v2";

if (!TOKEN) {
  console.error("CLICKUP_TOKEN is not set. Nothing to poll with.");
  process.exit(1);
}

const seen = new Set<string>();          // comment_id dedupe. The board also fires taskUpdated.
const events: ParsedEvent[] = [];
const sessions: Record<string, { title: string; model: string; task_id: string; real_usd: number }> = {};

async function api<T>(path: string): Promise<T> {
  const res = await fetch(API + path, { headers: { Authorization: TOKEN } });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json() as Promise<T>;
}

/** Model comes off the session task title, never off the wire (Decision Log J4). */
function modelFromTitle(title: string): string | null {
  const m = title.match(/\((Opus|Sonnet|Haiku|GPT)[^)]*\)/i);
  return m ? m[0].replace(/[()]/g, "").trim() : null;
}

function sessionKey(taskId: string, block: ParsedEvent): string {
  return block.session_id ?? taskId;   // pre-extension blocks fall back to the task
}

async function appendRaw(line: unknown): Promise<void> {
  await Bun.write(RAW_PATH, JSON.stringify(line) + "\n", { createPath: true });
}

async function sweep(): Promise<void> {
  const list = await api<{ tasks: Array<{ id: string; name: string }> }>(
    `/list/${LIST_ID}/task?include_closed=true&subtasks=true`
  );

  let fresh = 0;

  for (const task of list.tasks) {
    const { comments } = await api<{ comments: any[] }>(`/task/${task.id}/comment`);

    for (const c of comments) {
      const id = String(c.id);
      if (seen.has(id)) continue;
      seen.add(id);

      // RAW FIRST, ALWAYS. The parser must be re-runnable against traffic we already have.
      await appendRaw({ captured_at: new Date().toISOString(), task_id: task.id, comment: c });

      const ev = toEvent(c, task.id);
      if (!ev) continue;               // a comment with no telemetry block is not an error

      const key = sessionKey(task.id, ev);
      ev.session_id = key;
      if (!sessions[key]) {
        sessions[key] = {
          title: task.name,
          model: modelFromTitle(task.name) ?? "model unknown",
          task_id: task.id,
          real_usd: 0
        };
      }
      events.push(ev);
      fresh++;
    }
  }

  if (!fresh) return;

  events.sort((a, b) => String(a.emitted_at).localeCompare(String(b.emitted_at)));

  await Bun.write(OUT_PATH, JSON.stringify({
    captured_at: new Date().toISOString(),
    source: "poll",
    sessions,
    events
  }, null, 2), { createPath: true });

  console.log(`[${new Date().toLocaleTimeString()}] +${fresh} telemetry events, ${events.length} total`);
}

async function loop(): Promise<void> {
  try {
    await sweep();
  } catch (err) {
    // A failed sweep is not fatal. Log it and try again; the next pass re-reads everything.
    console.error("sweep failed:", err instanceof Error ? err.message : err);
  }
  setTimeout(loop, INTERVAL_MS);
}

console.log(`AgentGlass poller up. List ${LIST_ID}, every ${INTERVAL_MS / 1000}s.`);
loop();
