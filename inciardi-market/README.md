# Inciardi Mini Print Market Tracker

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/inciardi-market/)

![launch](https://img.shields.io/badge/▶︎_Launch-Inciardi_Market-c65a3a)

**Status:** v1 · running on bundled sample data until the eBay Worker is live.
**Source of truth:** this repo folder. Live at the Pages URL above.

## What it does

Tracks and sources **Anastasia Inciardi mini prints** (Inciardi Prints, Portland ME) on eBay. Two sides:

- **Deal Radar (buy):** non-exclusive listings at or under retail, best deals first. Packs judged on per-print value.
- **Sell Signal (sell):** exclusives (NYC / LACMA / Grand Central / holiday) with current asks, price sparklines, and a "vanished since last scan" rarity flag.
- **All Listings:** the full scan with flag filters.
- **Catalog:** a self-filling reference (print → market range). Not a personal-collection inventory.
- **Compare:** paste an eBay link to place it against the market (live single-URL lookup arrives with the Worker).

## How to use it

Open the app. It runs on `market.json` (bundled sample today). To go live: open the Settings gear, paste your Cloudflare Worker URL (`https://inciardi-market.<you>.workers.dev/market`) into the data-source field. The same UI switches to live eBay data with zero rework.

## Architecture

Data Separation Pattern: `index.html` is the engine, `market.json` is the living data. A Cloudflare Worker (`worker.js`, deployed separately, NOT served by Pages) hits eBay's Browse API on a cron, diffs against the previous snapshot in KV, and writes `market.json`.

- **Baseline (v1):** retail price + active-listing spread. **No sold-price history** (eBay gates that behind the restricted Marketplace Insights API).
- **eBay auth:** OAuth client-credentials app token, cached in Cloudflare KV.
- **Diff:** keyed on `itemId` → new / changed / live / gone. Flags (underpriced / exclusive / pack-deal / auction / stale / condition-note) are orthogonal.

Full contract + deploy runbook in `next-build-spec.md`.

## Version history

- **v1** — initial build: five-tab app, sample `market.json` (19 listings), Cloudflare Worker, build spec. Commit history is authoritative.

## Related

- ClickUp task: Inciardi Mini Print Market Tracker (APPS list).
- Architecture lineage: the Live Data Connectivity exploration doc (Cloudflare Worker proxy pattern).

## Roadmap

- Wire the live eBay Worker once dev-account approval lands.
- Live paste-a-link Compare (single-item fetch via the Worker).
- `packCount` field so pack scoring stops assuming ~5 prints.
- v2: vending-machine location map; multi-source rarity graph (retail sold-out, Poshmark, drop history).
