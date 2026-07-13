# Inciardi Mini Print Market Tracker — Build Spec

**App slug:** `inciardi-market` · **Repo:** `mawizorek/ClickUp_apps`
**Version target:** worker v1.3 (adds the daily catalog-scrub cron)
**Status:** worker v1.2 live (D1 catalog/image/inventory/machine API + eBay market cron every 6h). This spec adds an UNATTENDED daily harvest of Anastasia's Shopify store into D1.

> It's **Anastasia Inciardi / Inciardi Prints** (Portland, ME). Not "Inciarid."

---

## Goal (one line)

A second cron on the existing worker that runs the Shopify harvest half of `catalog-research-routine.md` automatically — no manual trigger, no write key handed around — upserting the print universe into D1 and converging image coverage over time.

---

## Why a cron (not the manual/script path)

The worker already has `env.DB` (D1) + `env.IMAGES` (R2) bound and a working `scheduled()` handler (banks eBay market history every 6h). Running the catalog harvest IN-worker means it writes straight to D1/R2 with zero auth dance (no `x-write-key`, because it's not crossing the HTTP boundary). Michael wanted "auto cron." This is it.

---

## Scratch intake

- Store barely changes intraday → daily is plenty (market stays 6h).
- Two crons on one worker: branch on `event.cron` string in `scheduled()`.
- Machines are NOT in this cron (store-locator is a JS Stockist widget + press sightings are fuzzy → assisted, not unattended). Hand-seeded separately in `db/seed-machines.sql`.

---

## Next build (worker v1.3)

### 1. Second cron trigger (`wrangler.toml`)

```toml
[triggers]
crons = ["0 */6 * * *", "0 9 * * *"]   # existing 6h market + NEW daily 09:00 UTC catalog scrub
```

### 2. Branch the scheduled handler on `event.cron`

```js
async scheduled(event, env, ctx) {
  if (event.cron === "0 9 * * *") {
    ctx.waitUntil(runCatalogScrub(env).catch((e) => console.error("catalog-scrub", e)));
  } else {
    ctx.waitUntil(runCron(env).catch((e) => console.error("cron", e)));  // existing market bank
  }
}
```

### 3. `runCatalogScrub(env)` — the harvest

Pages `https://inciardiprints.com/products.json?limit=250&page=N` until `products` is empty. For each product, explode the THREE layers per the routine:
- **Product level** → one catalog row (title, handle, price→retail, available→in_print, product_type/tags→category).
- **Variant level** → multi-print products (the 8x10 Riso holds 9 themes); each variant `title` becomes its own print, art from `variant.featured_image.src`.
- **Mystery-pack contents** → parse `body_html` prose for the embedded print list; set `pack_of`/`pack_from`.

Upsert each via a NEW **harvest-safe** path (see hard-stop #1), source=`shop-harvest`.

### 4. Category + exclusive detection

Walk each `/collections/<handle>/products.json` from the routine's collection map; membership → `category` + exclusive token (`grand-central`, `richard-scarry`, `lacma`, `holiday`). Cache collection→handle membership in one pass, don't re-fetch per print.

---

## 🛑 HARD-STOP #1 — harvest must NOT clobber locked rows

The existing `upsertCatalog()` does an unconditional `ON CONFLICT DO UPDATE SET ...` on EVERY field. Run unattended, it would silently stomp Michael's hand-entered (`locked=1`) prints every night. **Unacceptable for a timer.**

**Fix:** a separate `harvestUpsertCatalog(env, row)` that:
- If the print_id doesn't exist → plain INSERT (source=`shop-harvest`, locked=0).
- If it exists and `locked=0` → update freely (harvest owns unlocked rows).
- If it exists and `locked=1` → **COALESCE-fill only**: populate NULL/empty columns, never overwrite a populated hand-entered value. Always safe to refresh `in_print` (availability is a live fact, not a hand-entered opinion) — confirm this carve-out with Michael.
- Always additive on aliases (`INSERT OR IGNORE` into `catalog_alias`), never delete.

The manual `POST /catalog` path keeps its current clobber behavior (a human edit is intentional). This guard is harvest-only.

---

## 🛑 HARD-STOP #2 — image scrub must be incremental (subrequest cap)

Cloudflare Workers cap subrequests per invocation (50 on the free tier, 1000 paid). Full store + ~28 collections + scrubbing ~500 images in one tick blows it and the whole run dies mid-way, non-deterministically.

**Fix:** split the work.
- **Every run:** harvest ALL text data (products.json + collections). That's the cheap, bounded part (store is ~40-60 products, collections ~28 fetches). Well under any cap.
- **Image scrub: bounded batch per run.** After harvest, query D1 for prints with NO active `print_image` row, take the first **N=15** (tunable const `SCRUB_BATCH`), and `scrubImage` each into R2 (reuse the existing `scrubImage` logic, factored to an internal callable so it doesn't need the HTTP gate). ~500 images ÷ 15/day ≈ converges in ~a month, self-healing as new prints land.
- Count subrequests defensively: 1 per page + 1 per collection + N per image + a little slack. Keep the ceiling explicit as a const so it's obvious if the cap tier changes.

---

## Guardrails (carried from the routine)

- **D1 via the worker is store of truth.** This cron writes D1/R2 directly (in-worker); `catalog.json` stays a human export, NOT written by this cron.
- **Never reference/copy Vault (miniprint.io).** Coverage answer-key only.
- **Official names win**; seller/variant titles fold in as aliases, never new prints.
- **Provenance:** everything this cron writes is source=`shop-harvest`, locked=0 (so a later human edit + lock always wins).
- **Merge, don't delete:** the cron never deletes catalog rows (a product going away = `in_print=0`, not a delete — it's still a real print that trades on eBay).
- **Machines untouched** by this cron (deferred; hand-seeded).

---

## Agent instructions (do / don't)

**DO:**
- Edit `worker.js` + `wrangler.toml` only. Fetch fresh blob SHAs before writing (stale-context guard).
- Branch → PR → self-merge. Bump the worker header comment to v1.3.
- After merge, wait for Workers Builds, then hit `GET /catalog` and confirm the count grew + images are filling.
- Add a short honest note to the app Settings drawer: "Catalog auto-refreshes daily from the shop; images backfill over ~a month."

**DON'T:**
- DON'T touch the existing `runCron()` market-bank logic or the 6h trigger.
- DON'T route the harvest through `POST /catalog` (that clobbers locked rows — use the new harvest-safe upsert).
- DON'T try to scrub all images in one run (cap death).
- DON'T harvest machines here.
- DON'T write `catalog.json` from the cron.

---

## Open decisions for Michael

1. Daily 09:00 UTC (= 4-5am Central) okay, or a different hour?
2. `in_print` refresh on locked rows: safe to always update (it's a live fact), or hands-off locked rows entirely?
3. `SCRUB_BATCH=15`/day acceptable convergence, or push harder (higher cap tier)?

---

## Futures (deferred)

- **Stockist machine pull:** one-time harvest of the ~120-machine geo list once the `data-stockist-widget-tag` is captured from the store-locator page source. Could later become its own weekly cron.
- Machine status/restock enrichment (buy-side drop signal).
- eBay `unmatched` → auto-research → alias feedback loop.
- Marketplace Insights sold comps if partner access lands.
