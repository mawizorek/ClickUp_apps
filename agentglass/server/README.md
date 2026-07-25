# AgentGlass · ingest

## ⚠️ This directory does NOT run on GitHub Pages

Pages is a static file host. It serves files to browsers; it does not execute processes. Everything in
`server/` is **source storage** — read it, edit it, run it on your own machine. The live URL
(`/agentglass/`) serves the front-end only.

## What this is

The ClickUp comment pipe: the ingest lane that turns telemetry blocks posted on the Agent Activity Board
into the JSON the dashboard reads. Per Decision Log Q1, this is the **primary** lane, because ClickUp
Brain sessions cannot emit OpenTelemetry at all (J2) — Brain's model calls happen inside ClickUp's
infrastructure, so there is no local process to set `OTEL_*` on and no base URL to proxy.

## Two stages, in this order (Q4)

**Stage 1 — polling. Build this first.** `poll.ts` walks the board's tasks, pulls comments through the
ClickUp API on an interval, and writes raw bodies to JSONL before parsing anything. No public ingress, no
signature to verify, testable the minute you have a token. This is what ships.

**Stage 2 — webhook. Graduate to this once the parser is proven against real traffic.** A `taskCommentPosted`
subscription pointed at a **cloudflared named tunnel** (chosen over ngrok because the hostname survives a
restart). When that lands, `X-Signature` HMAC verification is **mandatory**, not optional: ClickUp
publishes no fixed webhook IPs, so the signature is the only thing separating ClickUp from anyone who
finds the tunnel. Also return `200` immediately and process async, or a slow endpoint gets deactivated.

## Run it

```
bun install
export CLICKUP_TOKEN=pk_...
bun run poll.ts
```

Writes `raw/comments.jsonl` (append-only capture) and `../data/live-events.json` (what the app reads).
Point `index.html`'s data source at the live file when you're ready to cut over from the seed.

## Non-negotiables, and why each one exists

- **Raw before parsed.** Every body hits JSONL untouched before the parser sees it. The parser then
  becomes re-runnable against real traffic instead of you re-triggering events you already threw away.
- **Never fence-match.** ClickUp delivers a comment as an array of rich-text runs, so the ```` ```json ````
  fence is *markup*, not text, and may never reach `text_content`. A regex hunting for the fence matches
  nothing, forever. `parse.ts` brace-matches instead. This was caught before a line was written; do not
  quietly reintroduce a fence regex.
- **Dedupe on `comment.id`.** ClickUp fires `taskUpdated` alongside every `taskCommentPosted`, so a naive
  listener double-counts every event.
- **Scope to the board list**, not the workspace, or the pipe ingests telemetry about telemetry.
- **Cost is derived here, never read off the wire (J4).** An agent asserting its own spend is a number
  that looks authoritative and isn't. Model comes from the session task title, volume from `tools_used`
  lengths, span from `session_id` + `emitted_at`. Estimation stays a separate re-runnable layer so a wrong
  rate table costs an estimate, never the underlying data.
- **The payload path is `history_items[].comment.text_content`**, one level deeper than it looks.

## Known limitation, stated out loud

Telemetry is **self-attested**. Anyone who can post a comment can emit a block as any agent at any cost.
That is acceptable for a capability-surfacing dashboard and unacceptable for accounting. `verified: false`
marks a sender the pipe could not corroborate; the app desaturates those rows and never sums their
claimed figures. Do not let this become an audit trail.
