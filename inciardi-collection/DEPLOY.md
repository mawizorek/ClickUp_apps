# Deploy — Inciardi Collection v1

**No terminal needed.** `wrangler` wants Node and a shell, and a phone has neither — so the deploy runs from a **button** in GitHub instead. Everything below is doable in a mobile browser.

The database and schema are already applied. This only stands up the worker (the API the form talks to).

---

## One-time setup — four things, all in a browser

### 1. A Cloudflare API token

[dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens) → **Create Token** → use the **Edit Cloudflare Workers** template → Continue → Create → **copy it now**, it is shown once.

### 2. Your Cloudflare account id

Any Workers or D1 page in the dashboard → it is in the URL right after `dash.cloudflare.com/`, and on the Workers overview page in the sidebar.

### 3. Your D1 database id

**D1 dashboard → `inciardi-collection` → Overview.** The id sits under the name.

### 4. Put them in GitHub

Repo → **Settings → Secrets and variables → Actions**

| Where | Name | Value |
| --- | --- | --- |
| **Secrets** tab | `CLOUDFLARE_API_TOKEN` | from step 1 |
| **Secrets** tab | `CLOUDFLARE_ACCOUNT_ID` | from step 2 |
| **Variables** tab | `INCIARDI_DB_ID` | from step 3 |

The database id is a *variable*, not a secret — it is not sensitive, and keeping it visible means you can see what the worker is bound to. You can also skip it and type the id into the run box each time.

---

## Deploy

Repo → **Actions** → **Deploy inciardi-collection worker** → **Run workflow** → **Run**.

When it goes green, open the run's log and the worker URL is in the deploy step — `https://inciardi-collection.<something>.workers.dev`.

**This is the only step you repeat.** Front-end changes need no deploy at all; Pages serves them about 60 seconds after a commit. Only changes under `worker/` need a run.

---

## Set the write key (one time, dashboard only)

**Cloudflare dashboard → Workers & Pages → `inciardi-collection` → Settings → Variables and Secrets → Add**, type `Secret`, name `WRITE_KEY`, value **a long random string — not a word**.

It is set here rather than through GitHub on purpose: secrets survive a deploy, so it only needs doing once, and it never passes through a second system that could log it. The predecessor shipped `"mikey"` and `"nickey"` inside a public JS bundle and they are *still* unrotated — that is the mistake this avoids.

---

## Turn the app on

Open **https://mawizorek.github.io/ClickUp_apps/inciardi-collection/** → tap **⚙** → paste the worker URL and the write key → **Save** → **Test connection**.

Healthy looks like:

```
{ "ok": true, "counts": { "artworks": 1, "editions": 1, "owned": 1, "sheets": 1, "slots": 1 } }
```

Those numbers should match what you entered by hand in the D1 console. Both settings live on that device only, so each phone or laptop needs them once.

---

## When something doesn't work

| Symptom | Cause |
| --- | --- |
| Workflow fails: *No database id* | Step 4's `INCIARDI_DB_ID` variable is missing, and the run box was left blank. |
| Workflow fails: *still holds the placeholder* | The substitution didn't take. The job refuses to deploy a worker bound to nothing rather than shipping a broken one. |
| Workflow fails on the deploy step | Usually the API token: wrong template, or expired. Re-do step 1. |
| Orange banner in the app: *no worker URL set* | The last step isn't done. The app says so instead of silently doing nothing. |
| `bad or missing write key` | The key in Settings doesn't match the secret. Reads still work; only writes are gated. |
| `server has no WRITE_KEY configured` | The secret isn't set. **An unset secret refuses writes** — it never means "open." |
| `no such table: artwork` | The worker is bound to the wrong database. Wrong id. |
| Browser console: CORS | Only `mawizorek.github.io` and localhost are allowed. Deliberate: a wildcard on a key-authenticated API lets any page anywhere spend your key. |
| An unexpected constraint error | Read it. The schema refuses contradictions by design — a slot naming one artwork while pointing at another's edition is *unwriteable*, not merely discouraged. |

---

## If you ever are at a desk

The same thing, three commands:

```
cd inciardi-collection
npx wrangler secret put WRITE_KEY
npx wrangler deploy
```

Paste the database id into `wrangler.toml` first. The button path exists because the terminal path assumes hardware you usually don't have, not because the commands are wrong.

## Rejected: the dashboard worker editor

Cloudflare lets you paste worker code straight into the dashboard, which is also phone-doable and *sounds* simpler. It is not, for one reason: the source would then live in the dashboard **and** in git, and two sources of truth for one fact is exactly the failure this app was rebuilt to eliminate. Git stays canonical; CI deploys from it.
