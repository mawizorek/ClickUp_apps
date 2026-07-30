# Deploy — Inciardi Collection v2

**No terminal needed.** `wrangler` wants Node and a shell, and a phone has neither — so the deploy runs from a **button** in GitHub. Everything below works in a mobile browser.

The database and schema are already applied, and `wrangler.toml` is already bound to the right database. This only stands up the worker (the API the form talks to).

---

## One-time setup — two things

### 1. A Cloudflare API token

[dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens) → **Create Token** → the **Edit Cloudflare Workers** template → Continue → Create → **copy it now**, it is shown once.

### 2. Your Cloudflare account id

Any Workers or D1 page in the dashboard — it is in the URL right after `dash.cloudflare.com/`, and in the sidebar on the Workers overview.

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

**This is the only step you ever repeat**, and only for changes under `worker/`. Front-end changes need no deploy at all; Pages serves them about 60 seconds after a commit.

*(The optional input overrides the committed id for one run — useful for a scratch database, never needed normally.)*

---

## Set the write key (one time, dashboard only)

**Cloudflare dashboard → Workers & Pages → `inciardi-collection` → Settings → Variables and Secrets → Add** · name `WRITE_KEY` · value **the exact string in `core.js` → `DEFAULT_KEY`**.

The two must match character for character. The worker compares them directly; there is no other place the key lives, and **an unset `WRITE_KEY` refuses every write** — it never means "open."

**Type: `Text`, not `Secret`.** Deliberate, and against the obvious instinct. A Cloudflare *Secret* cannot be read back after saving, which is how the first key was lost inside a day — the dashboard showed dots, nobody could confirm what it was, and there was no way to check it against the app short of rotating both halves. Since the same string is already in a public bundle (see below), encrypting the dashboard copy protects nothing and costs the ability to verify a mismatch.

### ⚠️ The key is IN THE PUBLIC BUNDLE, on purpose

**Michael's call, 2026-07-30, made with the tradeoff spelled out.** `core.js` ships `DEFAULT_KEY`, so any browser can write with nothing pasted — the point is that Nick, and any freshly-cleared browser, never has to produce a credential to log a print.

What that means, plainly:

- This is a public repo and a public Pages site, so **assume the key is known.** Anyone can add junk artworks or clear slots via the API. CORS does not help — it constrains browsers, not `curl`.
- Nothing else is exposed: no personal data, no money, no third-party credential. Blast radius is "the binder data gets vandalised."
- Recovery is real and was confirmed before accepting this: **D1 Time Travel**, 30-day point-in-time restore.
- It is at least **long and random**, unlike the predecessor's `"mikey"` / `"nickey"` — guessable beats readable for badness, and those are *still* unrotated in `inciardi-market`.

**To rotate** (2 minutes, do it the moment anything looks off): edit `WRITE_KEY` in the Cloudflare dashboard → paste the same new string into `DEFAULT_KEY` in `core.js` → commit. Every device picks it up on next load, which is the whole reason it is baked in. Rotate *both halves or neither* — a mismatch shows up as a 401 on the first save, and `core.js` names that case explicitly.

---

## Turn the app on

Open **https://mawizorek.github.io/ClickUp_apps/inciardi-collection/** → tap **⚙** → **Test connection**.

Nothing to paste. The worker URL and the write key both ship with the app; both boxes in Settings are *overrides* for a staging worker or a different key, and both fall back to the built-in value when left blank.

Healthy looks like:

```
{ "ok": true, "counts": { "artworks": 1, "editions": 1, "owned": 1, "sheets": 1, "slots": 1 } }
```

Those numbers should match what you entered by hand in the D1 console — that is the real proof the worker is talking to the right database.

⚠️ **A green Test connection does not prove writes work.** `/health` is a read, and reads are unauthenticated by design. The first *save* is the only real test of the key.

---

## When something doesn't work

| Symptom | Cause |
| --- | --- |
| Workflow fails on the deploy step | Almost always the API token: wrong template, or expired. Redo step 1. |
| Workflow fails: *bound to nothing* | `wrangler.toml` lost its database id somehow. The job refuses rather than shipping a worker that looks fine and reaches nothing. |
| `server has no WRITE_KEY configured` (503) | The Cloudflare variable isn't set. **An unset key refuses writes** — it never means "open." This is the state the app was in all of 2026-07-30. |
| `bad or missing write key` (401) on a device where you pasted nothing | `DEFAULT_KEY` in `core.js` and `WRITE_KEY` in Cloudflare disagree — one half was rotated without the other. Or the page is cached: hard-reload first. |
| `bad or missing write key` (401) after pasting a key | Your device override is wrong. Clear the Settings box and Save to fall back to the built-in key. |
| Reads work, writes fail | Expected shape of every key problem. Reads are never gated. |
| `no such table: artwork` | The worker is bound to the wrong database. |
| Browser console: CORS | Only `mawizorek.github.io` and localhost are allowed. Deliberate: a wildcard on a key-authenticated API lets any page anywhere spend your key. |
| An unexpected constraint error | Read it. The schema refuses contradictions by design — a slot naming one artwork while pointing at another's edition is *unwriteable*, not merely discouraged. |

---

## If you ever are at a desk

Same thing, two commands, since the id is already in the file:

```
cd inciardi-collection
npx wrangler deploy
```

The button path exists because the terminal path assumes hardware you usually don't have, not because the commands are wrong.

## Rejected: the dashboard worker editor

Cloudflare lets you paste worker code straight into the dashboard, which is also phone-doable and *sounds* simpler. It isn't, for one reason: the source would then live in the dashboard **and** in git, and two sources of truth for one fact is exactly the failure this app was rebuilt to eliminate. Git stays canonical; CI deploys from it.
