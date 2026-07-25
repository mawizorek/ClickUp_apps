# AgentGlass

**Mobile-first activity feed for the ClickUp Agent Activity Board.** Makes invisible agent work visible.

- **Live:** https://mawizorek.github.io/ClickUp_apps/agentglass/
- **Spec:** AgentGlass Spec (ClickUp, Brain Reference Library)
- **Decision Log:** AgentGlass — Decision Log (Q1–Q6, J1–J4 all closed 2026-07-25)
- **Handoff:** `↪️ HANDOFF · Dev Dexter · AgentGlass Webhook Listener · Jul 25`

## True purpose (read this before adding a feature)

This is a **capability-surfacing glass box, not a devops observability product.** There is no team to hold
accountable, no spend to police, no SLO to defend. The genre it was borrowed from (traces, p50/p95, cost
attribution) is not the genre it belongs to.

Priority order is deliberate and locked (Decision Log J3):

1. **Liveness and presence** — the fleet visibly doing things. This is the product.
2. **Narrative legibility** — what an agent did and why, readable at a glance.
3. **What needs you** — held sessions, silent agents, sequence gaps.
4. **Shadow cost** — explicitly an estimate, never a ledger.
5. **Latency percentiles** — near-worthless here. Deliberately absent. Do not add them back.

## Structure

```
agentglass/
  index.html            thin hash-router shell + shared chrome + the scrub transport
  pages/feed.html       view 1 — glanceable mobile activity feed
  pages/transcript.html view 2 — full scrubbed transcript with raw telemetry blocks
  source/styles.css     theme tokens + all styling
  source/core.js        state, time model, telemetry parser, roster + cost derivation, router
  source/feed.js        feed renderer
  source/transcript.js  transcript renderer
  data/seed-events.json 22 real board events, Jul 25 2026 (stands in until the poller runs)
  server/               ingest source. DOES NOT RUN ON PAGES. See server/README.md
```

`index.html` is a **router/shell only** (repo law, LOCKED 2026-07-08). Two servable views exist, so the
landing page is the one-line `DEFAULT_VIEW` constant near the top of `core.js`. Repoint it there; never
grow the index into a page.

Bump the `?v=` token in `index.html` on every `source/` change or browsers will serve stale modules.

## The two views

**Feed** (`#/feed`) — roster chips, what-needs-you, event stream, cost band. Built for a phone in one hand.

**Transcript** (`#/transcript`) — the same moment in time, read as a document: every event in full, session
headers, and each entry's **raw telemetry JSON** expandable inline. This is where the parsing is visible.
Toggle in the header; the scrub position carries across both views.

Both views are windows onto the same playhead. Drag the transport, both recompute.

## Data contract

The app reads a single JSON document (`data/seed-events.json` today, the poller's output later):

```json
{
  "captured_at": "2026-07-25T11:12:00-04:00",
  "source": "seed",
  "sessions": {
    "<session_id>": { "title": "...", "model": "Opus 5", "task_id": "86a...", "real_usd": 0 }
  },
  "events": [
    {
      "comment_id": "90130296617941",
      "task_id": "86ajq02um",
      "session_id": "bypass",
      "emitted_at": "2026-07-25T10:14:00-04:00",
      "seq": 1,
      "agent": "GPT-4o",
      "action": "Tracking task added to the board",
      "tools_used": ["githubmcp_create_or_update_file"],
      "target": "Agent Activity Board",
      "status": "working",
      "verified": false,
      "claimed_usd": 0.008,
      "raw": "{ ...the telemetry block exactly as it arrived... }"
    }
  ]
}
```

`raw` is kept verbatim so the transcript can show what was actually parsed. `verified: false` marks a
self-attested sender; the app renders those desaturated and never sums their `claimed_usd`.

## Known limitations (documented on purpose)

- **Telemetry is self-attested.** Anyone who can post a comment can emit a block as any agent. Demonstrated
  live on the board, not hypothetical. Acceptable because this is capability-surfacing, not accounting.
  Never mistake this for an audit trail.
- **Silence would read as health.** A crashed agent emits nothing and would render as calmly idle. This
  attacks priority #1, so the stale-`working` sweep and `seq` gap detection are load-bearing, not polish.
- **Cost is a counterfactual.** `EST` answers "what would this have cost billed direct," derived from
  observable facts. `REAL` is money actually spent. They are never blended.

## Roadmap

- **v2** — swap the seed JSON for the poller's live output; SQLite behind it.
- **v2** — adopt the `shared/themes` 4-vector spine (this build ships local tokens as a labeled fallback
  floor, not spine-composed chrome).
- **v3** — webhook graduation via a cloudflared named tunnel, with `X-Signature` HMAC verification.

Status: **v1, scaffold complete, running on seeded real data.**
