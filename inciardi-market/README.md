# Inciardi Mini Print Market Tracker

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/inciardi-market/)

![launch](https://img.shields.io/badge/▶︎_Launch-Inciardi_Market-c65a3a)

**Status:** live · front-end **v16** · main worker **v1.4** · harvest cron worker **v1.4** (deployed and running).
**Source of truth:** D1 database `inciardi-market`, written via the Cloudflare workers. This repo folder is canonical for code + schema; `catalog.json` is a human-readable export mirror only.

> It's **Anastasia Inciardi / Inciardi Prints** (Portland, ME). Not "Inciarid."

## What it does

Tracks and sources **Anastasia Inciardi mini prints** on eBay, backed by a self-filling print catalog + a vending-machine location layer.

- **Deal Radar (buy):** live eBay listings scored against a baseline, underpriced surfaced first. Packs judged on per-print value.
- **Sell Signal (sell):** exclusives (NYC / LACMA / Grand Central / Richard Scarry / holiday) with current asks, sparklines, and a "vanished since last scan" rarity proxy.
- **Catalog:** the master print universe in D1 (one row per print), each with versioned images, aliases, retail, availability. Self-fills from Anastasia's Shopify store. NOT a personal-collection inventory.
- **Swipe:** the mobile bulk-input funnel into the Collection — right = own, up = want, left = skip.
- **Collection:** the owned-copies ledger (one row per physical print, cost basis, P/L, own/want/sold).
- **Machines:** the vending-machine location layer — filter prints by which machine/city carries them, with live + historical stock status.

## CATALOG vs MARKET — what feeds what

These are two different pipelines that happen to meet in the UI. Keep them straight:

| | CATALOG | MARKET |
| --- | --- | --- |
| **What it is** | The canonical universe of prints that exist | Live eBay listings, right now |
| **Source** | `inciardiprints.com/products.json` (her own Shopify) | eBay Browse API |
| **Written by** | `cron-worker.js`, daily 09:00 UTC | `worker.js`, cron every 6h |
| **Stored in** | D1 `catalog` + `catalog_alias` + `print_image` | KV snapshot, diffed to new/changed/live/gone |
| **eBay involvement** | **None** | All of it |

They join in exactly one place: `marketFor()` in `app-core.js`, which fuzzy-matches a catalog print to live listings on normalized name + aliases. That's why a rename folds the old name into `aliases` — break the alias and you break the join.

**Known limitation:** the catalog is sourced from ONE site. A print that never appeared on her Shopify (vending-machine-only, museum-shop exclusives, anything retired before the harvest existed) will never enter the catalog on its own. Multi-source discovery is on the roadmap, not built.

## 🖼️ Image Rendering Law (READ BEFORE TOUCHING ANY `<img>`)

Photos have vanished from this app **three separate times** — different root cause each time, identical symptom: images flash, then go blank. These rules are the accumulated fix. The enforcing code is the image block in `source/app-core.js`.

1. **Never paint an archival original into a list or grid.** Originals here run 1–3 MB; 177 of them is ~260 MB. A phone decodes a handful (*the flash*) then purges or times out the rest (*the vanish*). Grids get a **width-capped derivative** via `thumbSrc()` / `imgLadder()`. Only a detail hero may load the original (`heroSrc()`).
2. **If an image route takes a size param, every branch must honor it — or the param is a lie.** This was the 2026-07-25 bug: cards politely called `proxied(url, 360)` and got the full-res file anyway, because the Worker's `/img?key=` (R2) branch reads `w` and can't act on it — you can't resize a stored blob for free. Thumbnails therefore resolve against the Shopify CDN `source_url`, where `width=` genuinely resizes, server-side, edge-cached 7 days.
3. **An error handler may NEVER retry the same URL with a cache-bust.** The old one did exactly that: re-downloading the multi-MB file that had just failed, then hiding the element outright on the second miss — converting a slow image into a permanently missing one. A retry moves **down the ladder to a different source**; only the last rung may give up.
4. **Grid images are always `loading="lazy"` + `decoding="async"`,** so 177 cards don't all request at once.
5. **Store derivatives, not camera originals.** The harvest asks the CDN for `width=1600&format=jpg` before writing to R2 — which also converts HEIC uploads into something Chrome can actually decode.

Prior incidents, for the record: (1) 2026-07-13 — raw `cdn.shopify.com` hotlinks were being blocked; fixed with the `/img?u=` proxy. (2) same era — Worker sent a bare User-Agent and Shopify 403'd it; fixed with `BROWSER_HEADERS`. (3) 2026-07-25 — the payload-size + cache-bust-retry failure above.

## 💵 Price units (the other trap)

Shopify's **storefront** `products.json` returns `price` as a decimal string **in dollars** (`"25.00"`). The Admin API and Stripe use integer **cents** and look identical at a glance. A `/100` in `retailFrom()` turned every $25 print into `0.25`, rendered as "$0" on every card, and — the part that actually hurt — made `underpriced` (`landed <= 85% of baseline`) mathematically unreachable, so **Deal Radar silently could never flag a buy.** Fixed 2026-07-25. Do not reintroduce a divide or a `Math.round` there.

## How to use it

Open the app; it reads the live D1 catalog + eBay market through the Cloudflare worker. The catalog auto-refreshes daily from the shop and print images backfill within a day — no manual data entry to keep it current. Hand-add or edit a print in the Catalog tab; hand-entered rows are `locked` and the harvest won't clobber them (except availability, which always tracks the live store).

**Naming:** the shop names mini-print variants numerically ("#1", "1/12"), so the harvest composes them as `Product Title #N` — a sortable, matchable placeholder. The real artwork names don't exist in the shop's data at all. Rename a print (catalog pencil, or swipe long-press → ✎ Edit); that sets `locked:1` and the nightly harvest leaves your title alone forever, with the old name kept as an alias so eBay matching survives.

## Architecture

**Two Cloudflare workers, one shared store (D1 + R2):**

- **`worker.js` (v1.4) — the live API + market feed.** Reads: `/market` (eBay, diffed vs KV snapshot), `/catalog`, `/inventory`, `/history`, `/machines`, `/usage`, `/img`. Gated writes (`x-write-key`, multi-key → actor `michael`/`nick`): catalog/image/inventory/machine upserts. Backups: `POST /snapshot`, `GET /snapshots`, `POST /restore` (soft restore, auto pre-restore snapshot). Cron every 6h banks eBay market history into D1.
- **`cron-worker.js` (v1.4) — the unattended catalog harvest.** Shares the SAME D1 + R2 by binding. Two crons:
  - **Daily 09:00 UTC** — pages Anastasia's Shopify `/products.json`, explodes the product / variant / mystery-pack layers into catalog rows (prints only; merch filtered), tags category + exclusive, upserts via a **locked-aware** path (fills blanks on locked rows, always refreshes `in_print`).
  - **Hourly, self-idling** — scrubs 12 print images per tick from `cdn.shopify.com` into R2 as `width=1600&format=jpg` derivatives, honors the 4.5GB storage cap, no-ops once caught up. New prints render instantly via CDN passthrough, then harden to R2.
  - ⚠️ `SCRUB_BATCH` must stay ≤ ~12 on the Workers free tier: 3 subrequests per image against a ~50/invocation cap.

**Data model (D1, `db/schema.sql`):** `catalog` + `catalog_alias` + `print_image` (multi-image, R2-backed, archive/restore) + `inventory` + `market_point`/`print_point`/`gone_event` (time series) + `machine` + `machine_print` + `machine_event` (location layer). `provenance` + `locked` flags protect hand-entered rows.

**`print_id` is load-bearing.** It's a slug of the raw source title and it keys `inventory`, `print_image` and `machine_print`. The harvest never DELETEs, so changing how an id is derived doesn't rename rows — it mints a parallel set and strands the originals along with the collection ledger pointing at them. Change display titles freely; never change id derivation without a migration.

**No sold comps:** baseline = retail + active-listing spread (eBay gates sold history behind the restricted Marketplace Insights API).

## Front-end conventions

- `source/app-core.js` is loaded first on every page and owns the API client, chrome, settings/backup UI, and the image ladder. Page files (`catalog.js`, `swipe.js`, …) build on it — they never re-implement it.
- **Bump the `?v=` token** on `source/*` script + link tags whenever those files change. A browser holding a stale `app-core.js` next to a fresh `catalog.js` is a ReferenceError and a blank page, not a cosmetic lag. (`app-dashboard` learned this in PR #74.)
- Dark by default, mobile-first, no fixed-width tables.

## Deploy notes

- **Main worker:** `wrangler.toml` → `worker.js`. Secrets (Cloudflare dashboard): `EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET`, `WRITE_KEY`, optional `WRITE_KEY_NICK`. Bindings: KV `SNAPSHOTS`, D1 `DB`, R2 `IMAGES`.
- **Cron worker:** `wrangler-cron.toml` → `cron-worker.js`, deployed as a SECOND Workers Builds project on this repo. Manual triggers: `/run/harvest`, `/run/images`, `/debug` (read-only peek), `/health`.
- **Schema:** `wrangler d1 execute inciardi-market --remote --file=inciardi-market/db/schema.sql`, then `seed-catalog.sql`, then `seed-machines.sql`.
- **Restore paths, in order of reach:** in-app Settings → Backups (R2 snapshots, everyday undo) → `wrangler d1 time-travel` (30-day point-in-time, catastrophic).

## Version history

- **front-end v16 / cron v1.4** — catalog cleanup: width-capped derivative thumbnails + real fallback ladder (the flash-then-vanish fix), `retailFrom` `/100` removed (every price was 1/100th of reality and Deal Radar could never flag), numeric variant titles composed as `Product #N` with a stable `print_id`, natural sort, Minis as the default filter, serialized swipe write queue, `?v=` cache-bust on catalog + swipe.
- **front-end v15 / worker v1.4** — R2 snapshot backups + restore, soft two-person login (baked `LOGINS`), multi-key worker auth with actor tagging.
- **front-end v14** — catalog rename + swipe edit-in-place, harvest-safe via `locked:1` + alias fold-in.
- **front-end v13** — swipe-to-sort bulk-input page.
- **worker v1.3 / cron-worker** — unattended Shopify catalog-harvest cron, locked-aware upsert. Separate worker sharing D1/R2.
- **worker v1.2** — machine location endpoints (`/machines*`).
- **worker v1.1** — hard 4.5GB R2 storage cap + `/usage` meter.
- **worker v1.0 / app v10** — ground-up relational rebuild: D1 schema + R2 image store + full API; terminal front-end.
- Earlier: eBay Browse worker + sample-data app. Commit history is authoritative.

## Related

- ClickUp task: Inciardi Mini Print Market Tracker (APPS list).
- Research SOP: `catalog-research-routine.md` (deep rebuild) + `catalog-refresh.md` (light top-up).
- Build spec: `next-build-spec.md`.

## Roadmap

- 🔴 **Rotate the baked write keys.** The accepted-tradeoff decision covered baking a key into a public bundle; it did not cover a guessable one. Long random strings via `wrangler secret put`.
- Scheduled auto-snapshot (daily cron → `/snapshot`) + snapshot retention/pruning, so backups don't depend on remembering to tap.
- D1 skip-state for swipe (currently localStorage, so it dies every time a browser is cleared — which is the documented reason the login feature exists).
- Multi-source catalog discovery: Poshmark, the Stockist ~120-machine geo list, eBay `unmatched` → auto-research → alias feedback loop.
- One-time re-scrub of the 177 existing R2 originals as 1600px derivatives (would drop ~268MB to ~30MB).
- Fold the harvest into a single worker (needs a chunk-walk of the over-cap `worker.js`).
- Marketplace Insights sold comps if partner access lands.
