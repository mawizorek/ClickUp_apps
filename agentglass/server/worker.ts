/**
 * AgentGlass · Cloudflare Worker ingest — THE PIECE THAT MAKES IT ACTUALLY PASSIVE
 *
 * THE PROBLEM v1 SHIPPED WITH: the dashboard read a JSON file committed to the repo. That is a
 * snapshot, not a live board. It cannot show the last hour of work because nothing was watching.
 *
 * WHY THE BROWSER CAN'T JUST FETCH CLICKUP DIRECTLY (both are hard blocks, not preferences):
 *   1. The ClickUp API does not send permissive CORS headers to arbitrary origins, so a
 *      github.io page calling api.clickup.com is refused by the browser.
 *   2. Even if it worked, it would require a `pk_` token inside a PUBLIC repo. Non-starter.
 *      (Secrets/PII Guard, and inciardi-market already ate a version of this lesson.)
 *
 * SO: a Worker sits in between. It holds the token as a Wrangler secret, polls the board on a cron,
 * caches the derived events in KV, and serves them as plain JSON with an open CORS header — public
 * read, private token. This is the same shape as the two workers already running for
 * inciardi-market, so it is precedent in this repo, not new infrastructure.
 *
 * DEPLOY (Michael, ~5 minutes):
 *   wrangler init agentglass-ingest
 *   # copy this file to src/index.ts, copy the wrangler.toml block below
 *   wrangler kv namespace create AG_CACHE
 *   wrangler secret put CLICKUP_TOKEN        # paste the pk_ token; never commit it
 *   wrangler deploy
 *   # then point the app at it: set LIVE_URL in agentglass/source/core.js to the worker URL
 *
 * wrangler.toml:
 *   name = "agentglass-ingest"
 *   main = "src/index.ts"
 *   compatibility_date = "2026-07-01"
 *   [[kv_namespaces]]
 *   binding = "AG_CACHE"
 *   id = "<from the create command>"
 *   [triggers]
 *   crons = ["*\/2 * * * *"]   # every 2 minutes; remove the backslash
 *   [vars]
 *   LIST_ID = "4026861396055493779"
 */

import { deriveEvent } from "./derive";

export interface Env {
  AG_CACHE: KVNamespace;
  CLICKUP_TOKEN: string;
  LIST_ID: string;
}

const API = "https://api.clickup.com/api/v2";
const CACHE_KEY = "events:latest";

/** Model comes off the session task title, never off the wire (Decision Log J4). */
function modelFromTitle(title: string): string | null {
  const m = title.match(/\((Opus|Sonnet|Haiku|GPT)[^)]*\)/i);
  return m ? m[0].replace(/[()]/g, "").trim() : null;
}

/**
 * The session agent, guessed from the task title, so a comment with no signature still gets
 * attributed with `attribution: "session"` rather than falling to ambient.
 */
function agentFromTitle(title: string): string | undefined {
  const m = title.match(/·\s*([A-Z][a-z]+ [A-Z][a-z]+)/);
  return m ? m[1] : undefined;
}

async function cu<T>(env: Env, path: string): Promise<T> {
  const res = await fetch(API + path, { headers: { Authorization: env.CLICKUP_TOKEN } });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json() as Promise<T>;
}

async function harvest(env: Env) {
  const list = await cu<{ tasks: Array<{ id: string; name: string; status?: { status: string } }> }>(
    env,
    `/list/${env.LIST_ID}/task?include_closed=true&subtasks=true`
  );

  const sessions: Record<string, any> = {};
  const events: any[] = [];

  for (const task of list.tasks) {
    const { comments } = await cu<{ comments: any[] }>(env, `/task/${task.id}/comment`);
    if (!comments?.length) continue;

    const sessionAgent = agentFromTitle(task.name);
    let seq = 0;

    // ClickUp returns newest-first; walk oldest-first so seq is monotonic and gaps mean something.
    for (const c of comments.slice().reverse()) {
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
        comment_id: String(c.id),
        task_id: task.id,
        session_id: task.id,
        seq,
        emitted_at: new Date(Number(c.date)).toISOString(),
        // Derived events are never "verified" in the accounting sense. They're honest about it,
        // which also keeps them out of the cost sum (core.js skips unverified rows).
        verified: ev.capture === "tagged" ? false : true,
        raw: c.text_content ?? ""
      });
    }
  }

  events.sort((a, b) => String(a.emitted_at).localeCompare(String(b.emitted_at)));

  const payload = {
    captured_at: new Date().toISOString(),
    source: "worker",
    sessions,
    events
  };

  await env.AG_CACHE.put(CACHE_KEY, JSON.stringify(payload), { expirationTtl: 86400 });
  return payload;
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "public, max-age=30"
};

export default {
  /** Cron: refresh the cache. Keeps request latency at KV-read speed. */
  async scheduled(_evt: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(harvest(env).catch(err => console.error("harvest failed", err)));
  },

  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);

    // Manual refresh, handy while tuning the deriver.
    if (url.pathname === "/refresh") {
      try {
        const fresh = await harvest(env);
        return new Response(JSON.stringify({ ok: true, events: fresh.events.length }), { headers: CORS });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 502, headers: CORS });
      }
    }

    const cached = await env.AG_CACHE.get(CACHE_KEY);
    if (cached) return new Response(cached, { headers: CORS });

    // Cold start with an empty cache: harvest inline rather than serving an empty board.
    try {
      const fresh = await harvest(env);
      return new Response(JSON.stringify(fresh), { headers: CORS });
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err), events: [], sessions: {} }), {
        status: 502, headers: CORS
      });
    }
  }
};
