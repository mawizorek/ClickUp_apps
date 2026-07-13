# Inciardi Mini Print Market Tracker

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/inciardi-market/)

![launch](https://img.shields.io/badge/▶︎_Launch-Inciardi_Market-c65a3a)

**Status:** v10 front-end · worker v1.2 (live D1 + R2 API) · catalog harvest cron v1.3 (built, pending one-time deploy).
**Source of truth:** D1 (via the worker). This repo folder is canonical for code; `catalog.json` is a human-readable export only.

## What it does

Tracks and sources **Anastasia Inciardi mini prints** (Inciardi Prints, Portland ME) on eBay, backed by a self-filling print catalog + a vending-machine location layer.

- **Deal Radar (buy):** non-exclusive listings at/under retail, best deals first. Packs judged on per-print value.
- **Sell Signal (sell):** exclusives (NYC / LACMA / Grand Central / Richard Scarry / holiday) with current asks, sparklines, and a "vanished since last scan" rarity flag.
- **Catalog:** the master print universe in D1, one row per print, multi-image (R2-backed), self-filling from the shop.
- **Collection:** owned-copies ledger (own / want / sold, cost basis, P/L), FK'd to the catalog.
- **Machines:** vending-machine location layer — filter prints by machine/city/state + track empty/restock status.

## How to use it

Open the app. It reads live from the worker API (D1). The Settings gear holds the theme toggle + data-source config + honest refresh notes.

## Architecture

Relational backend over Cloudflare **D1** (catalog / aliases / images metadata / inventory / market history / machines) + **R2** (image bytes), fronted by two Workers. Neither is served by GitHub Pages; the static front-end reads their JSON.

- **`worker.js` (v1.2) — the live API + market feed.** Open reads: `/market`, `/catalog`, `/inventory`, `/history`, `/machines`, `/usage`, `/img`. Gated writes (`x-write-key`): catalog/image/inventory/machine upserts. `scheduled()` banks the eBay market snapshot every 6h.
- **`cron-worker.js` (v1.3) — the unattended catalog harvest.** A SEPARATE worker sharing the same D1 + R2 by binding (keeps the over-cap `worker.js` untouched). Two crons, see Automation.
- **Baseline (v1):** retail + active-listing spread. **No sold-price history** (eBay gates Marketplace Insights).
- **Images:** scrubbed into R2 (Decision B); reference rows render immediately via the `/img?u=` CDN passthrough, then harden to stored bytes.

Full contract + build spec in `next-build-spec.md`. Deep-dig SOP in `catalog-research-routine.md`.

## Automation (the crons)

| Cron | Schedule | Worker | Does |
| --- | --- | --- | --- |
| Market bank | every 6h | `worker.js` | Banks eBay `market_point` / `print_point` / `gone_event` into D1. |
| Catalog harvest | daily 09:00 UTC | `cron-worker.js` | Pages the Shopify store, explodes product/variant/pack layers, prints-only, tags category + exclusive, upserts D1 (locked-aware: `in_print` always refreshes, else fill-only on locked rows). |
| Image backfill | hourly, self-idling | `cron-worker.js` | Scrubs 25 reference images/tick into R2 under the 4.5GB cap; no-ops once caught up (~500 backfill in <24h). |

### Go-live setup for the harvest cron (one-time)

1. In Cloudflare, add a second Workers Builds project on this repo, config path `inciardi-market/wrangler-cron.toml` (or deploy manually: `wrangler deploy -c inciardi-market/wrangler-cron.toml`).
2. No secrets needed — it only reads the public shop + CDN and writes through the shared D1/R2 bindings.
3. Smoke-test: hit `/run/harvest` then `/run/images` on the new worker URL, then confirm `GET /catalog` on the main worker shows the grown count + filling images.

## Version history

- **v1.3 (cron)** — `cron-worker.js` + `wrangler-cron.toml`: unattended daily Shopify catalog harvest + hourly self-idling image backfill, sharing the main worker's D1/R2.
- **v1.2 (worker)** — machine location endpoints; hard 4.5GB R2 storage cap.
- **v1.0 (worker) / v10 (app)** — ground-up relational rebuild: D1 schema + R2 image store + full API; terminal front-end.
- Earlier: eBay market feed, image proxy, auction price-parse fix. Commit history is authoritative.

## Related

- ClickUp task: Inciardi Mini Print Market Tracker (APPS list).
- Deep-dig SOP: `catalog-research-routine.md`. Light top-up: `catalog-refresh.md`.
- Machine seeds: `db/seed-catalog.sql` (4) + `db/seed-machines.sql` (10 research-sourced).

## Roadmap

- Deploy the harvest cron (one-time setup above).
- Stockist machine pull: one-time harvest of the ~120-machine geo list once the `data-stockist-widget-tag` is captured from the store-locator page source.
- Full 28-collection walk in the harvest (currently a curated 4-collection signal subset).
- Machine status/restock enrichment (buy-side drop signal).
- v2: multi-source rarity graph (retail sold-out, Poshmark, drop history); Marketplace Insights sold comps if partner access lands.
