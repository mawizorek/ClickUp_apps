# Deploy — Inciardi Collection

**You don't deploy this. It deploys itself.**

A push to `main` that touches `worker/**` or `wrangler.toml` runs the deploy automatically. Front-end changes (`index.html`, `app.js`, `core.js`, `styles.css`, `pages/`) need no deploy at all — GitHub Pages serves them about 60 seconds after a commit.

So in normal use there is **nothing to press**. The manual button survives for forcing a redeploy; everything below is reference for when something breaks.

---

## Why it used to be manual, and why it isn't

The workflow started as button-only, for a real reason: *"unattended auto-deploy of a key-authenticated write API on every commit is not something you want."* True while `WRITE_KEY` lived in the Cloudflare dashboard, outside git — an automatic deploy couldn't touch it, and deploying was a rare deliberate act.

That expired the moment the key moved into `wrangler.toml`. **There is no longer a secret for an automatic deploy to leak** that any reader of this public repo doesn't already have. What was left was a required manual step whose only possible outcome was "apply what `main` already says" — not a safety gate, a chore with a failure mode. Forget it once and the front end is calling routes the worker doesn't have. Which is exactly what v4 did.

**The path filter is the whole point.** It fires only on the worker's own inputs, so a CSS tweak doesn't burn build minutes redeploying an unchanged worker. `db/**` is excluded deliberately: schema files are applied by hand to D1 and are not worker inputs.

⚠️ **The one thing that remains true:** the worker runs the code from its LAST DEPLOY, not from `main`. A merged commit that hasn't deployed isn't live. The trigger closes that gap automatically now, but if the app is behaving like older code, check the Actions tab before you check anything else.

---

## One-time setup — two GitHub secrets

Already done. Here for the record, and for the day a token expires.

### 1. A Cloudflare API token

[dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens) → **Create Token** → the **Edit Cloudflare Workers** template → Continue → Create → **copy it now**, it is shown once.

### 2. Your Cloudflare account id

The **Account Details** card at the bottom of Workers & Pages, or in the dashboard URL right after `dash.cloudflare.com/`. **Exactly 32 hex characters** — the deploy asserts that shape, because a 50-character paste once burned three runs on a misleading routing error.

Both go in Repo → **Settings → Secrets and variables → Actions → Secrets**, as `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

The **database id is committed** in `wrangler.toml` (`045f1943…`) — an id is an identifier, not a credential, so it lives in the repo where you can see what the worker is bound to. Reaching the data still needs the token.

---

## Forcing a deploy by hand

Repo → **Actions** → **Deploy inciardi-collection worker** → **Run workflow** → **Run**. Leave the input blank. Useful when you've edited `WRITE_KEY` in the Cloudflare dashboard by mistake and want the committed value re-applied.

*(The optional input overrides the committed database id for one run — useful for a scratch database, never needed normally.)*

---

## The write key — there is NO dashboard step

**`WRITE_KEY` is a plain `[vars]` entry in `wrangler.toml`, and the deploy applies it.** Its twin is `DEFAULT_KEY` in `core.js`, which ships to the browser. **The two must be character-identical.** Rotating = edit both in one commit; the push then deploys itself. Rotate one and every write returns 401.

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
- The key is **long and random**, unlike the predecessor's `"mikey"` / `"nickey"` — readable is the accepted tradeoff; *guessable* is a defect, and those are still unrotated in `inciardi-market`. The deploy refuses a key under 16 characters for exactly this reason.
- **An unset key still refuses every write** (503). Blank never means open.

---

## Using the app

Open **https://mawizorek.github.io/ClickUp_apps/inciardi-collection/** and use it. Nothing to paste, on any device. Both Settings fields are *overrides* for a staging worker or a different key, and both fall back to the built-in value when left blank.

Health check: **⚙ → Test connection** should show

```
{ "ok": true, "counts": { "artworks": 4, "editions": 4, "owned": 3, "sheets": 2, "slots": 6 } }
```

⚠️ **A green Test connection does not prove writes work.** `/health` is a read, and reads are unauthenticated by design. **The first save is the only real test of the key.**

---

## When something doesn't work

| Symptom | Cause |
| --- | --- |
| The app calls a route the worker doesn't have (404 with a route list) | The worker hasn't deployed since that code merged. **Check the Actions tab** — with the push trigger this should be self-healing, but a failed run leaves exactly this state. |
| Workflow fails on the deploy step | Almost always the API token: wrong template, or expired. Redo step 1. |
| Workflow fails: *7003 / 7000, could not route* | Malformed `CLOUDFLARE_ACCOUNT_ID` — must be exactly 32 hex. The preflight catches this before the deploy. |
| Workflow fails: *no WRITE_KEY in wrangler.toml* | Someone removed the `[vars]` entry. Deploying without it would leave the worker refusing writes while `/health` stayed green. |
| Workflow fails: *bound to nothing* | `wrangler.toml` lost its database id. The job refuses rather than shipping a worker that looks fine and reaches nothing. |
| A front-end change didn't appear | Pages takes ~60s, and `index.html` cache-busts its own assets with `?v=N`. If you edited `app.js` or `styles.css` without bumping that number, you're seeing a cached copy. |
| `server has no WRITE_KEY configured` (503) | The worker hasn't deployed since the key went into config. Force a run. |
| `bad or missing write key` (401), nothing pasted on this device | `WRITE_KEY` in `wrangler.toml` and `DEFAULT_KEY` in `core.js` disagree — one half was rotated without the other. Or the page is cached: hard-reload. |
| `bad or missing write key` (401) after pasting a key | Your device override is wrong. Clear the Settings box and Save to fall back to the built-in key. |
| Reads work, writes fail | The shape of every key problem. Reads are never gated. |
| The worker isn't in the Cloudflare dashboard list | **It happened, and the worker was fine.** Ping `<worker-url>/health` in a browser — that is the authoritative answer. The dashboard's application list is a UI, not the truth. |
| `no such table: artwork` | The worker is bound to the wrong database. |
| Browser console: CORS | Only `mawizorek.github.io` and localhost are allowed. Deliberate: a wildcard on a key-authenticated API lets any page anywhere spend your key. |
| An unexpected constraint error | Read it. The schema refuses contradictions by design — a slot naming one artwork while pointing at another's edition is *unwriteable*, not merely discouraged. |

---

## If you ever are at a desk

Everything the worker needs is in the file:

```
cd inciardi-collection
npx wrangler deploy
```

The CI path exists because the terminal path assumes hardware you usually don't have, not because the commands are wrong.

## Rejected: the dashboard worker editor

Cloudflare lets you paste worker code straight into the dashboard, which is also phone-doable and *sounds* simpler. It isn't, for one reason: the source would then live in the dashboard **and** in git, and two sources of truth for one fact is exactly the failure this app was rebuilt to eliminate. Git stays canonical; CI deploys from it. **The write key moved for the same reason.**
