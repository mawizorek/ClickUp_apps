# Deploy — Inciardi Collection v1

Five steps. Two of them are one-time. **I cannot run any of these** — deploying needs `wrangler` on your machine, and I have no network or shell. The database and schema are already done.

---

## 1. Get the database id (one time)

The schema is already applied, so the database exists. You just need its id:

```
npx wrangler d1 list
```

Or: **D1 dashboard → `inciardi-collection` → Overview**, the id sits under the name.

## 2. Paste it into `wrangler.toml` (one time)

Replace `PASTE_DATABASE_ID_HERE` in `inciardi-collection/wrangler.toml`. It is left as an obvious placeholder on purpose: a wrong id fails loudly at deploy, which beats a plausible guess that binds the worker to nothing.

## 3. Set the write key (one time)

```
cd inciardi-collection
npx wrangler secret put WRITE_KEY
```

Paste **a long random string**, not a word. The predecessor shipped `"mikey"` and `"nickey"` inside a public JS bundle and they are *still* unrotated — that is the mistake this step exists to avoid. This key never appears in any file here.

## 4. Deploy

```
npx wrangler deploy
```

Copy the `https://inciardi-collection.<you>.workers.dev` URL it prints.

## 5. Point the app at it

Open **https://mawizorek.github.io/ClickUp_apps/inciardi-collection/** → tap **⚙** → paste the worker URL and the write key → **Save** → **Test connection**.

A healthy response looks like:

```
{ "ok": true, "counts": { "artworks": 1, "editions": 1, "owned": 1, "sheets": 1, "slots": 1 } }
```

Those numbers should match what you already entered by hand. Both settings live on that device only, so each phone or laptop needs them once.

---

## When something doesn't work

| Symptom | Cause |
| --- | --- |
| Orange banner: *no worker URL set* | Step 5 not done. The app says so rather than silently doing nothing. |
| `bad or missing write key` | The key in Settings doesn't match the secret from step 3. Reads still work. |
| `server has no WRITE_KEY configured` | Step 3 skipped. **An unset secret refuses writes** — it never means "open." |
| `no such table: artwork` | The worker is bound to the wrong database. Wrong id in step 2. |
| Browser console: CORS | Only `mawizorek.github.io` and localhost are allowed. Deliberate: a wildcard on a key-authenticated API lets any page anywhere spend your key. Add an origin in `worker/worker.js` if you need one. |
| A constraint error you didn't expect | Read it. The schema refuses contradictions by design — a slot naming one artwork while pointing at another edition is *unwriteable*, not merely discouraged. |

## Redeploying later

Only step 4. Steps 1–3 and 5 are one-time. Front-end changes need no deploy at all — Pages serves them about 60 seconds after a commit lands on `main`.
