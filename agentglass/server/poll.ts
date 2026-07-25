/**
 * AgentGlass · local ingest: poll the ClickUp comments API with Bun.
 *
 * DOES NOT RUN ON GITHUB PAGES. This is the local-only option — it writes a file on YOUR machine, so
 * the board is live for you and nobody else. For a genuinely live dashboard use `worker.ts` instead;
 * see README.md for the comparison.
 *
 *   export CLICKUP_TOKEN=pk_...
 *   bun run poll.ts
 */

import { deriveEvent } from "./derive";

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

const seen = new Set<string>();          // comment_id dedupe; taskUpdated fires alongside every post
const events: any[] = [];
const sessions: Record<string, any> = {};

async function api<T>(path: string): Promise<T> {
  const res = await fetch(API + path, { headers: { Authorization: TOKEN } });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json() as Promise<T>;
}

function modelFromTitle(title: string): string | null {
  const m = title.match(/\((Opus|Sonnet|Haiku|GPT)[^)]*\)/i);
  return m ? m[0].replace(/[()]/g, "").trim() : null;
}
function agentFromTitle(title: string): string | undefined {
  const m = title.match(/·\s*([A-Z][a-z]+ [A-Z][a-z]+)/);
  return m ? m[1] : undefined;
}

async function sweep(): Promise<void> {
  const list = await api<{ tasks: Array<{ id: string; name: string }> }>(
    `/list/${LIST_ID}/task?include_closed=true&subtasks=true`
  );

  let fresh = 0;

  for (const task of list.tasks) {
    const { comments } = await api<{ comments: any[] }>(`/task/${task.id}/comment`);
    if (!comments?.length) continue;

    const sessionAgent = agentFromTitle(task.name);
    let seq = events.filter(e => e.task_id === task.id).length;

    // Oldest-first so seq is monotonic and a gap actually means a dropped event.
    for (const c of comments.slice().reverse()) {
      const id = String(c.id);
      if (seen.has(id)) continue;
      seen.add(id);

      // RAW FIRST, ALWAYS. The deriver must stay re-runnable against traffic we already have.
      await Bun.write(RAW_PATH, JSON.stringify({
        captured_at: new Date().toISOString(), task_id: task.id, comment: c
      }) + "\n", { createPath: true });

      const ev = deriveEvent(c, { sessionAgent, sessionTitle: task.name });
      if (!ev) continue;
      seq++;

      if (!sessions[task.id]) {
        sessions[task.id] = {
          title: task.name.replace(/^(?:↪️|🧭|📋)\s*/, "").replace(/^\[AGENT\]\s*/, ""),
          model: modelFromTitle(task.name) ?? "model unknown",
          task_id: task.id,
          real_usd: 0
        };
      }

      events.push({
        ...ev,
        comment_id: id,
        task_id: task.id,
        session_id: task.id,
        seq,
        emitted_at: new Date(Number(c.date)).toISOString(),
        verified: ev.capture !== "tagged",
        raw: c.text_content ?? ""
      });
      fresh++;
    }
  }

  if (!fresh) return;

  events.sort((a, b) => String(a.emitted_at).localeCompare(String(b.emitted_at)));

  await Bun.write(OUT_PATH, JSON.stringify({
    captured_at: new Date().toISOString(), source: "poll", sessions, events
  }, null, 2), { createPath: true });

  const derived = events.filter(e => e.capture === "derived").length;
  console.log(`[${new Date().toLocaleTimeString()}] +${fresh} · ${events.length} total · ${derived} derived from prose`);
}

async function loop(): Promise<void> {
  try { await sweep(); }
  catch (err) { console.error("sweep failed:", err instanceof Error ? err.message : err); }
  setTimeout(loop, INTERVAL_MS);
}

console.log(`AgentGlass poller up. List ${LIST_ID}, every ${INTERVAL_MS / 1000}s.`);
loop();
