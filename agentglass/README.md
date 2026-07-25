# AgentGlass

**Mobile-first activity feed for the ClickUp Agent Activity Board.** Makes invisible agent work visible.

- **Live:** https://mawizorek.github.io/ClickUp_apps/agentglass/
- **Spec:** AgentGlass Spec (ClickUp, Brain Reference Library)
- **Decision Log:** AgentGlass — Decision Log
- **Handoff:** `↪️ HANDOFF · Dev Dexter · AgentGlass Webhook Listener · Jul 25`

## True purpose (read this before adding a feature)

This is a **capability-surfacing glass box, not a devops observability product.** No team to hold
accountable, no spend to police, no SLO to defend. The genre it was borrowed from (traces, p50/p95, cost
attribution) is not the genre it belongs to.

Priority order is deliberate and locked (Decision Log J3):

1. **Liveness and presence** — what is happening right now. This is the product.
2. **Narrative legibility** — what an agent did and why, readable at a glance.
3. **What needs you** — held sessions, quiet sessions, sequence gaps.
4. **Shadow cost** — explicitly an estimate, never a ledger.
5. **Latency percentiles** — near-worthless here. Deliberately absent. Do not add them back.

## Liveness: snapshot vs live (the v1 miss, fixed properly in v2)

v1 read a JSON file **committed to the repo**, so it was a snapshot pretending to be a dashboard — an
hour of real agent work went completely unseen. And a static page cannot fix that by itself: the ClickUp
API refuses cross-origin browser calls, and a `pk_` token can never live in a public repo.

<br>

v2's boot sequence is honest about which one you're looking at:

1. Try `LIVE_URL` (the Cloudflare Worker endpoint, or a local `data/live-events.json`).
2. Fall back to the committed `data/seed-events.json`.
3. **The header pill reads `live` or `snapshot` accordingly.** It never quietly implies currency.

<br>

To make it genuinely live, deploy `server/worker.ts` (~5 minutes; this repo already runs two workers for
`inciardi-market`). See `server/README.md` for the full comparison of worker vs local poller vs webhook.

## Tagless capture — agents don't have to opt in

The telemetry hook is the **high-confidence path, not the only path.** On the real board almost nothing
carries a JSON block, yet every comment already contains what the dashboard wants. `source/derive.js` and
`server/derive.ts` read agent, action, status, targets and tools out of ordinary prose: announce
signatures (`🔍 Anna here`, `🎼 Mira`, `⚒️ DEXTER`), roster names, `[TRANSCRIPT · …]` prefixes, `PR #NNN`,
file paths, and hand-back language like `awaiting` / `Michael's call` / `parked`.

<br>

Every row is labeled with how it was captured, and the label is never laundered:

- **tagged** — telemetry block found. Fields asserted by the agent.
- **derived** — read from prose. Good enough to render, never good enough to bill.
- **ambient** — a comment with no agent signal. Proves the session is alive, attributed to nobody.

<br>

On the current seed data, **19 of 22 events are derived.** The only tagged rows are the forged GPT-4o
ones, which is a fairly complete argument on its own.

## The silence rule (v1's false-alarm storm, and the fix)

v1 treated every agent as a standing process, so a Workshop lens that spoke one line and handed back
rendered as *"went quiet mid-work."* Seven alarms, five of them meaningless. Fold-in Frank wasn't stuck;
he ruled and the room moved on.

<br>

The fix is a rule, not a tuned threshold:

> **You can only be silent if you are the last voice in your session.**

If someone spoke after you, you handed off (`handed`, dimmed, no alarm). Silence is a property of the
**session** — the thread nobody came back to — and only its last speaker carries it. What-needs-you now
lists *sessions*, not agents: those waiting on Michael, and those that went quiet mid-work.

## Structure

```
agentglass/
  index.html            thin hash-router shell + chrome + the scrub transport
  pages/feed.html       view 1 — NOW read, sessions, what-needs-you, stream, cost
  pages/transcript.html view 2 — full scrubbed transcript, prose-in/fields-out per event
  source/styles.css     theme tokens + all styling (local floor; spine adoption is a v3 item)
  source/core.js        state, time model, telemetry parser, NOW read, derivations, router
  source/derive.js      tagless prose capture (browser mirror of server/derive.ts)
  source/feed.js        feed renderer
  source/transcript.js  transcript renderer
  data/seed-events.json real board events through 12:44 PM, Jul 25 2026
  server/               ingest source. DOES NOT RUN ON PAGES. See server/README.md
    worker.ts           Cloudflare Worker — the recommended live path
    poll.ts             local Bun poller
    parse.ts            telemetry block extraction (brace-match, never fence-match)
    derive.ts           tagless prose capture
```

`index.html` is a **router/shell only** (repo law, LOCKED 2026-07-08). Two servable views exist, so the
landing page is the one-line `DEFAULT_VIEW` constant near the top of `core.js`.

<br>

Bump the `?v=` token in `index.html` on every `source/` change or browsers will serve stale modules.

## The two views

**Feed** (`#/feed`) — opens with the **NOW read**: one plain-language sentence answering "what is
happening right now," plus the last thing that happened and how long ago. Then session chips,
what-needs-you, the event stream, and the cost band. Built for a phone in one hand.

<br>

**Transcript** (`#/transcript`) — the same moment read as a document. Each entry expands to its source:
for tagged events, the telemetry JSON round-tripped back through the real parser; for derived events, the
**comment exactly as posted** followed by the fields pulled out of it. That side-by-side is the proof that
tagless capture works.

<br>

Both views share one playhead. Drag the transport, both recompute.

## Known limitations (documented on purpose)

- **Telemetry is self-attested and derived events are inferred.** Neither is an audit trail. Anyone who
  can post a comment can emit a block as any agent, or write prose that reads like one. Acceptable for
  capability-surfacing, unacceptable for accounting.
- **Silence still needs a rule, not a promise.** The session-scoped rule above is load-bearing; a
  liveness dashboard that shows a dead session as calm has failed at its only job.
- **Cost is a counterfactual.** `EST` answers "what would this have cost billed direct." `REAL` is money
  actually spent. They are never blended, and derived rows are excluded from both.

## Roadmap

- **v3** — deploy the worker and cut `LIVE_URL` over; SQLite behind it for history.
- **v3** — adopt the `shared/themes` 4-vector spine (v2 still ships a labeled local token floor).
- **v4** — webhook graduation via a cloudflared named tunnel, with mandatory `X-Signature` HMAC.

Status: **v2 — tagless capture + NOW read + session-scoped silence. Still a snapshot until the worker
is deployed.**
