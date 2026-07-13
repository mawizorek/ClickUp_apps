# Inciardi Mini Print Market Tracker — Build Spec

**App slug:** `inciardi-market` · **Repo:** `mawizorek/ClickUp_apps`
**Version target:** worker v1.3 (adds the daily catalog-scrub cron)
**Status:** worker v1.2 live (D1 catalog/image/inventory/machine API + eBay market cron every 6h). This spec adds an UNATTENDED daily harvest of Anastasia's Shopify store into D1.

> It's **Anastasia Inciardi / Inciardi Prints** (Portland, ME). Not "Inciarid."

> **DECISIONS LOCKED (Michael, 2026-07-13):** see the resolved block at the bottom. Cron hour 09:00 UTC · `in_print` always refreshes (live fact) · images scrub via an hourly self-idling cron (faster). This spec is ready to build.

---

## Goal (one line)

Crons on the existing worker that run the Shopify harvest half of `catalog-research-routine.md` automatically — no manual trigger, no write key handed around — upserting the print universe into D1 and converging image coverage over time.

---

## Why a cron (not the manual/script path)

The worker already has `env.DB` (D1) + `env.IMAGES` (R2) bound and a working `scheduled()` handler (banks eBay market history every 6h). Running the catalog harvest IN-worker means it writes straight to D1/R2 with zero auth dance (no `x-write-key`, because it's not crossing the HTTP boundary). Michael wanted "auto cron." This is it.

---

## Cron layout (worker v1.3) — THREE triggers, branched on `event.cron`

```toml
[triggers]
crons = [
  "0 */6 * * *",   # EXISTING: eBay market snapshot bank (untouched)
  "0 9 * * *",     # NEW daily: catalog TEXT harvest (products.json + collections)
  "0 * * * *"      # NEW hourly: image scrub batch, SELF-IDLING (no-ops when caught up)
]
```

```js
async scheduled(event, env, ctx) {
  if (event.cron === "0 9 * * *")      ctx.waitUntil(runCatalogScrub(env).catch((e) => console.error("catalog-scrub", e)));
  else if (event.cron === "0 * * * *") ctx.waitUntil(runImageBackfill(env).catch((e) => console.error("img-backfill", e)));
  else                                 ctx.waitUntil(runCron(env).catch((e) => console.error("cron", e)));  // existing market bank
}
```

Why split text vs images into two crons: the text harvest is cheap + bounded (runs once daily); the image backfill is the expensive part and now runs hourly so the backlog clears in under a day, then idles. Keeping them separate means the daily harvest never competes with image work for the subrequest budget in a single tick.

---

## Next build

### 1. `runCatalogScrub(env)` — daily text harvest (09:00 UTC)

Pages `https://inciardiprints.com/products.json?limit=250&page=N` until `products` is empty. For each product, explode the THREE layers per the routine:
- **Product level** → one catalog row (title, handle, price→retail, available→in_print, product_type/tags→category).
- **Variant level** → multi-print products (the 8x10 Riso holds 9 themes); each variant `title` becomes its own print, art from `variant.featured_image.src`.
- **Mystery-pack contents** → parse `body_html` prose for the embedded print list; set `pack_of`/`pack_from`.

Walk each `/collections/<handle>/products.json` from the routine's collection map for `category` + exclusive detection (`grand-central`, `richard-scarry`, `lacma`, `holiday`). Cache collection→handle membership in one pass; don't re-fetch per print. Record each print's canonical CDN image URL onto the row (source_url) so the image backfill cron has a target.

Upsert each via the harvest-safe path (hard-stop #1), source=`shop-harvest`.

### 2. `runImageBackfill(env)` — hourly, self-idling (FASTER, per Michael)

- Query D1 for prints that have a known `source_url` but NO active `print_image` row. Take the first **`SCRUB_BATCH = 25`**.
- If that query returns zero → **return immediately (no-op).** Once coverage is complete the hourly tick costs ~one D1 read and exits. Self-healing when new prints land.
- Otherwise scrub those ≤25 CDN images into R2 (reuse `scrubImage` logic, factored to an internal callable that skips the HTTP gate).
- Convergence: ~500 images ÷ 25/hr ≈ **fully backfilled in <24h**, vs ~a month on the old daily-15 plan. Then it idles.

---

## 🛑 HARD-STOP #1 — harvest must NOT clobber locked rows (with the in_print carve-out)

The existing `upsertCatalog()` does an unconditional `ON CONFLICT DO UPDATE SET ...` on EVERY field. Run unattended, it would silently stomp Michael's hand-entered (`locked=1`) prints every night. **Unacceptable for a timer.**

**Fix:** a separate `harvestUpsertCatalog(env, row)` that:
- If the print_id doesn't exist → plain INSERT (source=`shop-harvest`, locked=0).
- If it exists and `locked=0` → update freely (harvest owns unlocked rows).
- If it exists and `locked=1` → **COALESCE-fill only**: populate NULL/empty columns, never overwrite a populated hand-entered value — **EXCEPT `in_print`, which ALWAYS refreshes** (Michael's call: availability is a live fact from the store, not a hand-entered opinion, so the harvest owns it even on locked rows).
- Always additive on aliases (`INSERT OR IGNORE` into `catalog_alias`), never delete.

The manual `POST /catalog` path keeps its current clobber behavior (a human edit is intentional). This guard is harvest-only.

---

## 🛑 HARD-STOP #2 — image scrub bounded per invocation (subrequest cap)

Cloudflare Workers cap subrequests per invocation (50 free / 1000 paid). Scrubbing ~500 images in one tick blows it and the run dies mid-way, non-deterministically.

**Fix (now via the hourly backfill cron above):**
- The daily text harvest is cheap + bounded (store ~40-60 products = 1-2 pages + ~28 collections ≈ 30 subrequests). Well under any cap.
- The hourly image cron scrubs a bounded `SCRUB_BATCH = 25` per tick (25 image fetches + a couple D1 reads). Safe under the free cap with margin, and hourly cadence clears the backlog fast without ever fragmenting a single over-cap run.
- Keep `SCRUB_BATCH` an explicit const so the ceiling is obvious if the plan tier changes; can push higher on paid.

---

## Guardrails (carried from the routine)

- **D1 via the worker is store of truth.** These crons write D1/R2 directly (in-worker); `catalog.json` stays a human export, NOT written by the cron.
- **Never reference/copy Vault (miniprint.io).** Coverage answer-key only.
- **Official names win**; seller/variant titles fold in as aliases, never new prints.
- **Provenance:** everything the cron writes is source=`shop-harvest`, locked=0 (so a later human edit + lock always wins — except `in_print`, always live).
- **Merge, don't delete:** the cron never deletes catalog rows (a product going away = `in_print=0`, not a delete — it's still a real print that trades on eBay).
- **Machines untouched** by these crons (deferred; hand-seeded in `db/seed-machines.sql`).

---

## Agent instructions (do / don't)

**DO:**
- Edit `worker.js` + `wrangler.toml` only. Fetch fresh blob SHAs before writing (stale-context guard).
- Branch → PR → self-merge. Bump the worker header comment to v1.3.
- After merge, wait for Workers Builds, then hit `GET /catalog` and confirm the count grew + images are filling over the next few hours.
- Add a short honest note to the app Settings drawer: "Catalog auto-refreshes daily from the shop; print images backfill within a day."

**DON'T:**
- DON'T touch the existing `runCron()` market-bank logic or the 6h trigger.
- DON'T route the harvest through `POST /catalog` (that clobbers locked rows — use the new harvest-safe upsert).
- DON'T scrub all images in one run (cap death) — use the bounded hourly backfill.
- DON'T harvest machines here.
- DON'T write `catalog.json` from the cron.

---

## Decisions — RESOLVED (Michael, 2026-07-13)

1. **Cron hour:** daily catalog harvest at **09:00 UTC** (~4-5am Central). Confirmed.
2. **`in_print` on locked rows:** **always refresh.** It's a live availability fact from the store, not a hand-entered opinion — the single carve-out to the locked-row no-clobber guard. Everything else on a locked row is still COALESCE-fill-only.
3. **Image speed:** **go faster** → images move to their own **hourly, self-idling** cron at `SCRUB_BATCH=25`, backfilling ~500 in <24h then idling to ~zero cost. Replaces the once-daily 15/run plan.

---

## Futures (deferred)

- **Stockist machine pull:** one-time harvest of the ~120-machine geo list once the `data-stockist-widget-tag` is captured from the store-locator page source. Could later become its own weekly cron.
- Machine status/restock enrichment (buy-side drop signal).
- eBay `unmatched` → auto-research → alias feedback loop.
- Marketplace Insights sold comps if partner access lands.
