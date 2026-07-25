# AgentGlass · ingest

## ⚠️ Nothing in this directory runs on GitHub Pages

Pages is a static file host. It serves files to browsers; it does not execute processes. Everything here
is **source storage** — read it, edit it, run it elsewhere. The live URL (`/agentglass/`) serves the
front-end only.

## Read this first: why v1 wasn't live, and what fixes it

v1's dashboard read a JSON file **committed to the repo**. That is a snapshot, not a live board — which
is exactly why an hour of real agent work didn't appear. Nothing was watching.

<br>

And the browser cannot simply fetch ClickUp itself. Two hard blocks:

1. **CORS.** The ClickUp API doesn't send permissive CORS headers to arbitrary origins, so a
   `github.io` page calling `api.clickup.com` is refused by the browser.
2. **The token.** It would have to live in a PUBLIC repo. Non-starter.

<br>

So something server-side has to hold the token and hand the browser plain JSON. Three ways, in the order
we'd actually reach for them:

| | What it is | Live? | Cost to stand up |
| --- | --- | --- | --- |
| **`worker.ts`** ✅ recommended | Cloudflare Worker: token as a secret, cron poll, KV cache, CORS-open JSON endpoint | genuinely live | ~5 min, and this repo already runs two workers for `inciardi-market` |
| `poll.ts` | local Bun process writing `../data/live-events.json` | live only while your machine is on, and only for you | 1 min |
| webhook | `taskCommentPosted` → cloudflared named tunnel | push instead of poll | most work, needs HMAC |

<br>

**The app already handles all three.** `core.js` tries `LIVE_URL` first and falls back to the committed
seed, and the header pill says **live** or **snapshot** so it can never quietly pretend to be current.

## Deploy the worker

```
wrangler init agentglass-ingest
# copy server/worker.ts + server/derive.ts + server/parse.ts into src/
wrangler kv namespace create AG_CACHE
wrangler secret put CLICKUP_TOKEN
wrangler deploy
```

Then set `LIVE_URL` in `agentglass/source/core.js` to the worker URL and bump `?v=`. The `wrangler.toml`
block is in the header comment of `worker.ts`.

## Tagless capture (`derive.ts`) — the important part

**An agent should not have to opt in to being seen.** On the real board almost nothing carries a JSON
telemetry block, yet every comment is dense with what the dashboard wants: who spoke, what they did,
what they touched, whether they're handing back to Michael. The telemetry hook is now the
**high-confidence path, not the only path.**

<br>

What gets read out of ordinary prose:

- **Agent** — announce signatures first (`🔍 Anna here`, `🎼 Mira`, `⚒️ DEXTER`), then roster names in
  the first 200 characters, then the session task title. Emoji leads because it survives dictation and
  reformatting.
- **Action** — the first real sentence, stripped of `[TRANSCRIPT · date · agent]` furniture.
- **Status** — `awaiting`, `Michael's call`, `parked`, `proposed, not executed`, `no writes until he
  rules` → `waiting_on_human`. A comment that both ships something *and* parks a question reads as
  WAITING, because the open question is the part that needs a human.
- **Targets** — `PR #NNN` and file paths, verbatim.
- **Tools** — real tool names when present; otherwise a conservative guess from what the prose describes.
  A wrong tool name is worse than none.

<br>

Three confidence tiers, always labeled in the UI and never laundered:

- **tagged** — telemetry block found. Fields asserted by the agent.
- **derived** — inferred from prose. Good enough to render, never good enough to bill.
- **ambient** — a comment with no agent signal. Proves the session is alive, attributed to nobody.

<br>

The deriver **never returns a silent zero**: on a liveness dashboard, "nothing happened" and "we
couldn't read it" must not look the same.

## Non-negotiables, and why each exists

- **Raw before parsed.** Every body is kept verbatim before the parser sees it, so the deriver stays
  re-runnable against traffic you already have. Tuning a regex must never cost you history.
- **Never fence-match.** ClickUp delivers a comment as an array of rich-text runs, so the ```` ```json ````
  fence is *markup*, not text, and may never reach `text_content`. A fence regex matches nothing,
  forever — and it fails looking like "no agents are emitting" rather than like a bug. `parse.ts`
  brace-matches instead. Do not quietly reintroduce a fence regex.
- **Dedupe on `comment.id`.** ClickUp fires `taskUpdated` alongside every `taskCommentPosted`.
- **Walk comments oldest-first.** The API returns newest-first; reversing is what makes `seq` monotonic,
  which is what makes a gap mean something.
- **Scope to the board list**, not the workspace, or the pipe ingests telemetry about telemetry.
- **Cost is derived here, never read off the wire (J4).** Model from the session task title, volume from
  tool counts, span from timestamps. Derived rows are excluded from the cost sum by design.
- **The payload path is `history_items[].comment.text_content`**, one level deeper than it looks.

## Known limitation, stated out loud

Telemetry is **self-attested**, and derived events are **inferred**. Neither is an audit trail. Anyone who
can post a comment can emit a block as any agent; anyone can write prose that looks like an agent. That's
acceptable for a capability-surfacing dashboard and unacceptable for accounting, which is why `tagged`
rows from unverified senders render desaturated and their claimed dollar figures are never summed.
