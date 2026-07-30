# Deploy — Inciardi Collection v2

**No terminal needed.** `wrangler` wants Node and a shell, and a phone has neither — so the deploy runs from a **button** in GitHub. Everything below works in a mobile browser.

The database and schema are already applied, and `wrangler.toml` is already bound to the right database. This stands up the worker (the API the form talks to) **and sets its write key** in the same press.

---

## One-time setup — two things

### 1. A Cloudflare API token

[dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens) → **Create Token** → the **Edit Cloudflare Workers** template → Continue → Create → **copy it now**, it is shown once.

### 2. Your Cloudflare account id

Any Workers or D1 page in the dashboard — it is in the URL right after `dash.cloudflare.com/`, and in the **Account Details** card at the bottom of Workers & Pages. **Exactly 32 hex characters.** The deploy asserts that shape, because a 50-character paste once burned three runs on a misleading routing error.

### Put both in GitHub

Repo → **Settings → Secrets and variables → Actions → Secrets** tab:

| Name | Value |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | from step 1 |
| `CLOUDFLARE_ACCOUNT_ID` | from step 2 |

That's it. The **database id is already committed** in `wrangler.toml` (`045f1943…`) — an id is an identifier, not a credential, so it lives in the repo where you can see what the worker is bound to. Reaching the data still needs the token above.

---

## Deploy

Repo → **Actions** → **Deploy inciardi-collection worker** → **Run workflow** → **Run**. Leave the input blank.

Green run → open the log → the worker URL is in the deploy step, `https://inciardi-collection.<something>.workers.dev`.

**This is the only step you ever repeat**, and only for changes under `worker/` **or to the write key**. Front-end changes need no deploy at all; Pages serves them about 60 seconds after a commit.

*(The optional input overrides the committed database id for one run — useful for a scratch database, never needed normally.)*

---

## The write key — there is NO dashboard step

**`WRITE_KEY` is a plain `[vars]` entry in `wrangler.toml`, and the deploy applies it.** Its twin is `DEFAULT_KEY` in `core.js`, which ships to the browser. **The two must be character-identical.** Rotating = edit both in one commit + re-run the deploy. Rotate one and every write returns 401.

### Why it is not a Cloudflare Secret

Three reasons, in the order they were learned:

1. **The key is already public by decision.** Michael's call, 2026-07-30: `core.js` ships it so Nick and any freshly-cleared browser can write with nothing pasted. Encrypting the server's copy of a string that is readable in view-source protects nothing.
2. **A Secret cannot be read back.** That is exactly how the first key was lost inside a day: the dashboard showed dots, nobody could confirm the value, and checking it meant rotating both halves blind.
3. **The dashboard step could not be found.** On 2026-07-30 this worker was live and answering `/health` while the phone dashboard's application list showed only the two `inciardi-market` workers. "Go set it in the dashboard" was an instruction pointing at a screen that did not show the worker. **A setup step nobody can locate is not a step.**

⚠️ **Do not also set a `WRITE_KEY` secret in the dashboard.** A `[vars]` entry of the same name overwrites it on every deploy, so a dashboard value would win until the next deploy and then silently stop — the worst possible failure shape. One source of truth: `wrangler.toml`.

### What this costs, plainly

- Public repo, public Pages site: **assume the key is known.** Anyone can add junk artworks or clear slots via the API. CORS does not help — it constrains browsers, not `curl`.
- Not exposed: no personal data, no money, no third-party credential. Blast radius is "the binder data gets vandalised."
- Recovery is real and was confirmed before accepting this: **D1 Time Travel**, 30-day point-in-time restore.
- The key is **long and random**, unlike the predecessor's `"mikey"` / `"nickey"` — readable is the accepted tradeoff; *guessable* is a defect, and those are still unrotated in `inciardi-market`. The deploy now refuses a key under 16 characters for exactly this reason.
- **An unset key still refuses every write** (503). Blank never means open.

---

## Turn the app on

Open **https://mawizorek.github.io/ClickUp_apps/inciardi-collection/** and use it. Nothing to paste, on any device.

Both Settings fields are *overrides* for a staging worker or a different key; blank falls back to the built-in value. Health check: **⚙ → Test connection** should show

```
{ "ok": true, "counts": { "artworks": 1, "editions": 1, "owned": 1, "sheets": 1, "slots": 1 } }
```

Those numbers should match what you entered by hand in the D1 console — that is the real proof the worker is talking to the right database.

⚠️ **A green Test connection does not prove writes work.** `/health` is a read, and reads are unauthenticated by design. **The first save is the only real test of the key.**

---

## When something doesn't work

| Symptom | Cause |
| --- | --- |
| Workflow fails on the deploy step | Almost always the API token: wrong template, or expired. Redo step 1. |
| Workflow fails: *7003 / 7000, could not route* | Malformed `CLOUDFLARE_ACCOUNT_ID` — must be exactly 32 hex. The preflight now catches this before the deploy. |
| Workflow fails: *no WRITE_KEY in wrangler.toml* | Someone removed the `[vars]` entry. Deploying without it would leave the worker refusing writes while `/health` stayed green. |
| Workflow fails: *bound to nothing* | `wrangler.toml` lost its database id. The job refuses rather than shipping a worker that looks fine and reaches nothing. |
| `server has no WRITE_KEY configured` (503) | The worker has not been deployed since the key went into config. **Re-run the workflow.** |
| `bad or missing write key` (401), nothing pasted on this device | `WRITE_KEY` in `wrangler.toml` and `DEFAULT_KEY` in `core.js` disagree — one half was rotated without the other. Or the page is cached: hard-reload. |
| `bad or missing write key` (401) after pasting a key | Your device override is wrong. Clear the Settings box and Save to fall back to the built-in key. |
| Reads work, writes fail | The shape of every key problem. Reads are never gated. |
| The worker isn't in the Cloudflare dashboard list | **It happened, and the worker was fine.** Ping `<worker-url>/health` in a browser — that is the authoritative answer. The dashboard's application list is a UI, not the truth. |
| `no such table: artwork` | The worker is bound to the wrong database. |
| Browser console: CORS | Only `mawizorek.github.io` and localhost are allowed. Deliberate: a wildcard on a key-authenticated API lets any page anywhere spend your key. |
| An unexpected constraint error | Read it. The schema refuses contradictions by design — a slot naming one artwork while pointing at another's edition is *unwriteable*, not merely discouraged. |

---

## If you ever are at a desk

Same thing, two commands, since everything the worker needs is in the file:

```
cd inciardi-collection
npx wrangler deploy
```

The button path exists because the terminal path assumes hardware you usually don't have, not because the commands are wrong.

## Rejected: the dashboard worker editor

Cloudflare lets you paste worker code straight into the dashboard, which is also phone-doable and *sounds* simpler. It isn't, for one reason: the source would then live in the dashboard **and** in git, and two sources of truth for one fact is exactly the failure this app was rebuilt to eliminate. Git stays canonical; CI deploys from it. **The write key just moved for the same reason.**
