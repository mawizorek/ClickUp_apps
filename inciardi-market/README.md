# Inciardi Mini Print Market Tracker

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/inciardi-market/)

![launch](https://img.shields.io/badge/▶︎_Launch-Inciardi_Market-c65a3a)

**Status:** live · relational D1 backend (worker v1.2) + auto catalog-harvest cron (v1.3).
**Source of truth:** D1 database `inciardi-market`, written via the Cloudflare workers. This repo folder is canonical for code + schema; `catalog.json` is a human-readable export mirror only.

> It's **Anastasia Inciardi / Inciardi Prints** (Portland, ME). Not "Inciarid."

## What it does

Tracks and sources **Anastasia Inciardi mini prints** on eBay, backed by a self-filling print catalog + a vending-machine location layer.

- **Deal Radar (buy):** live eBay listings scored against a baseline, underpriced surfaced first. Packs judged on per-print value.
- **Sell Signal (sell):** exclusives (NYC / LACMA / Grand Central / Richard Scarry / holiday) with current asks, sparklines, and a "vanished since last scan" rarity proxy.
- **Catalog:** the master print universe in D1 (one row per print), each with versioned images, aliases, retail, availability. Self-fills from Anastasia's Shopify store. NOT a personal-collection inventory.
- **Collection:** the owned-copies ledger (one row per physical print, cost basis, P/L, own/want/sold).
- **Machines:** the vending-machine location layer — filter prints by which machine/city carries them, with live + historical stock status.

## How to use it

Open the app; it reads the live D1 catalog + eBay market through the Cloudflare worker. The catalog auto-refreshes daily from the shop and print images backfill within a day — no manual data entry to keep it current. Hand-add or edit a print in the Catalog tab; hand-entered rows are `locked` and the harvest won't clobber them (except availability, which always tracks the live store).

## Architecture

**Two Cloudflare workers, one shared store (D1 + R2):**

- **`worker.js` (v1.2) — the live API + market feed.** Reads: `/market` (eBay, diffed vs KV snapshot), `/catalog`, `/inventory`, `/history`, `/machines`, `/usage`, `/img`. Gated writes (`x-write-key`): catalog/image/inventory/machine upserts. Cron every 6h banks eBay market history into D1.
- **`cron-worker.js` (v1.3) — the unattended catalog harvest.** Shares the SAME D1 + R2 by binding. Two crons:
  - **Daily 09:00 UTC** — pages Anastasia's Shopify `/products.json`, explodes the product / variant / mystery-pack layers into catalog rows (prints only; merch filtered), tags category + exclusive, upserts via a **locked-aware** path (fills blanks on locked rows, always refreshes `in_print`).
  - **Hourly, self-idling** — scrubs 25 print images from `cdn.shopify.com` into R2 per tick, honors the 4.5GB storage cap, no-ops once caught up (~500 backfilled in <24h). New prints render instantly via CDN passthrough, then harden to R2.

**Data model (D1, `db/schema.sql`):** `catalog` + `catalog_alias` + `print_image` (multi-image, R2-backed, archive/restore) + `inventory` + `market_point`/`print_point`/`gone_event` (time series) + `machine` + `machine_print` + `machine_event` (location layer). `provenance` + `locked` flags protect hand-entered rows.

**No sold comps:** baseline = retail + active-listing spread (eBay gates sold history behind the restricted Marketplace Insights API).

## Deploy notes

- **Main worker:** `wrangler.toml` → `worker.js`. Secrets (Cloudflare dashboard): `EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET`, `WRITE_KEY`. Bindings: KV `SNAPSHOTS`, D1 `DB`, R2 `IMAGES`.
- **Cron worker (one-time setup):** `wrangler-cron.toml` → `cron-worker.js`. Create a SECOND Workers Builds project on this repo pointing at `inciardi-market/wrangler-cron.toml` (or `wrangler deploy -c inciardi-market/wrangler-cron.toml`). No secrets needed. Smoke-test via `/run/harvest` + `/run/images` on the cron worker URL.
- **Schema:** `wrangler d1 execute inciardi-market --remote --file=inciardi-market/db/schema.sql`, then `seed-catalog.sql`, then `seed-machines.sql`.

## Version history

- **worker v1.3 / cron-worker** — unattended Shopify catalog-harvest cron (daily text harvest + hourly self-idling image backfill), locked-aware upsert. Separate worker sharing D1/R2.
- **worker v1.2** — machine location endpoints (`/machines*`).
- **worker v1.1** — hard 4.5GB R2 storage cap + `/usage` meter.
- **worker v1.0 / app v10** — ground-up relational rebuild: D1 schema + R2 image store + full API; terminal front-end (catalog/collection/market).
- Earlier: eBay Browse worker + sample-data app. Commit history is authoritative.

## Related

- ClickUp task: Inciardi Mini Print Market Tracker (APPS list).
- Research SOP: `catalog-research-routine.md` (deep rebuild) + `catalog-refresh.md` (light top-up).
- Build spec: `next-build-spec.md`.

## Roadmap

- Fold the harvest into a single worker (needs a chunk-walk of the over-cap `worker.js`).
- Stockist machine pull: one-time harvest of the full ~120-machine geo list once the `data-stockist-widget-tag` is captured from the store-locator page source.
- Machine status/restock enrichment as a buy-side drop signal.
- eBay `unmatched` → auto-research → alias feedback loop.
- Marketplace Insights sold comps if partner access lands.
