# Deploy — Inciardi Collection v1

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

**Cloudflare dashboard → Workers & Pages → `inciardi-collection` → Settings → Variables and Secrets → Add** · type **Secret** · name `WRITE_KEY` · value **a long random string, not a word**.

Set here rather than through GitHub on purpose: secrets survive every deploy, so it is done once, and it never passes through a second system that could log it. The predecessor shipped `"mikey"` and `"nickey"` inside a public JS bundle and they are *still* unrotated — that is the mistake this avoids.

---

## Turn the app on

Open **https://mawizorek.github.io/ClickUp_apps/inciardi-collection/** → tap **⚙** → paste the worker URL and the write key → **Save** → **Test connection**.

Healthy looks like:

```
{ "ok": true, "counts": { "artworks": 1, "editions": 1, "owned": 1, "sheets": 1, "slots": 1 } }
```

Those numbers should match what you entered by hand in the D1 console — that is the real proof the worker is talking to the right database. Both settings live on that device only, so each phone or laptop needs them once.

---

## When something doesn't work

| Symptom | Cause |
| --- | --- |
| Workflow fails on the deploy step | Almost always the API token: wrong template, or expired. Redo step 1. |
| Workflow fails: *bound to nothing* | `wrangler.toml` lost its database id somehow. The job refuses rather than shipping a worker that looks fine and reaches nothing. |
| Orange banner in the app: *no worker URL set* | The last step isn't done. The app says so instead of silently doing nothing. |
| `bad or missing write key` | The key in Settings doesn't match the Cloudflare secret. Reads still work; only writes are gated. |
| `server has no WRITE_KEY configured` | The secret isn't set. **An unset secret refuses writes** — it never means "open." |
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
