# Inciardi Market

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/inciardi-market/)

![launch](https://img.shields.io/badge/▶︎_Launch-Inciardi_Market-4ec98a)

**Status:** v10 (app shell) · worker v1.0 · relational backend (D1 + R2) live.
**Source of truth:** this repo folder + the Cloudflare Worker's D1 database. Live at the Pages URL above.

A collector's **terminal** for Anastasia Inciardi mini prints (Inciardi Prints, Portland ME): live eBay market, the full print catalog, and your own collection marked to market.

## What it does

Four surfaces over one relational backend:

- **Terminal** — the cockpit. Your collection's mark-to-market value, unrealized + realized P/L, the day's market tape (new / vanished / top mover), best moves under retail, and the print universe at a glance.
- **Catalog** — the print universe crossed against the live market. Full **image lifecycle** per print: upload your own photo (stored in R2, not hotlinked), scrub-and-store the original CDN image, set-primary, archive, restore, and multiple images per print. Manual add-a-print with **dedupe-on-add** (re-adding an existing print merges instead of duplicating).
- **Collection** — your holdings ledger. One row per **physical copy** you own, matched to the catalog, marked to the live market low. Own / wishlist / sold, cost basis, P/L, sell flow, and provisional (un-catalogued) entries.
- **Market** — the eBay radar (inherits the new shell next pass).

## How to use it

Open the terminal. Reads are public. To edit (add prints, upload/store images, manage your collection), open the Settings gear and paste your **write key** — it never ships in the app. Set the Worker URL there too if it ever changes.

## Architecture

**Relational backend, terminal front-end.**

```
eBay Browse API  ->  Cloudflare Worker (v1.0)  ->  static app (router shell -> pages)
   (live tape)        + D1 (relational store)        terminal / catalog / collection / market
                      + R2 (image bytes)
                      + KV (snapshot + token cache)
```

- **D1 (`DB`)** is the source of truth: `catalog` (master prints) + `catalog_alias` + `print_image` (many versioned images per print, active/archived) + `inventory` (one row per owned physical copy) + `market_point` / `print_point` / `gone_event` (history). Schema: `db/schema.sql`.
- **R2 (`IMAGES`)** holds image bytes, served back through `GET /img?key=` (same-origin, edge-cached). Scrubbed CDN images are copied INTO R2, not hotlinked.
- **KV (`SNAPSHOTS`)** is the operational eBay snapshot (prev-scan diff) + OAuth token cache only. Not the data store.
- **Worker API:** reads `/market /catalog /inventory /history /img` (open); writes `/catalog`, `/catalog/image`, `/catalog/image/scrub`, `/catalog/image/state`, `/inventory` (gated by `x-write-key`). Cron banks history every 6h.
- **Provenance + locked:** every catalog row records its source; manual rows are locked so the harvest/enrichment pass fills blanks but never clobbers a hand-entered value.
- Worker is deployed via Workers Builds (git-connected `wrangler.toml`), NOT served by Pages.

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | Router shell (redirects to `terminal.html`) | Rare |
| `terminal.html` / `catalog.html` / `collection.html` / `market.html` | Servable pages | Version bumps |
| `source/*.css` / `source/*.js` | Per-page modules + shared `base.css` / `app-core.js` | Version bumps |
| `worker.js` | Cloudflare Worker: relational API over D1 + R2 + eBay | Worker version bumps |
| `db/schema.sql` | D1 relational schema (apply with wrangler d1 execute) | Schema changes |
| `catalog.json` | Seed / cold-start fallback for the catalog | Seed refresh |

## Deploy delta (v10)

One-time setup for the new backend:

1. **R2 bucket:** Cloudflare > R2 > create bucket `inciardi-images` (binding `IMAGES` in `wrangler.toml`).
2. **Apply schema:** `wrangler d1 execute inciardi-market --file=inciardi-market/db/schema.sql`.
3. **Seed the catalog into D1** (optional first pass): the app promotes seed prints on first edit; or bulk-load `catalog.json` via the `/catalog` route.
4. **WRITE_KEY secret** already gates POSTs; enter the same value in the app Settings drawer to edit.

## Version history

- **v10 / worker v1.0** — ground-up relational rebuild. D1 catalog + inventory + versioned R2 image store; terminal/portfolio front-end (Terminal / Catalog / Collection); full per-print image lifecycle (upload / scrub-store / primary / archive / restore / multi-image); dedupe-on-add; owned-copies ledger marked to market.
- **v7–v9** — modular split (router shell + per-page css/js), `/img` image proxy (killed the catalog flash-then-vanish), three-page nav.
- **v1–v7** — eBay Worker went live; terminal-style radar; catalog gallery; collection tracker. Commit history is authoritative.

## Related

- ClickUp task: Inciardi Mini Print Market Tracker (APPS list).
- Build spec + roadmap: `next-build-spec.md` (NEXT BUILD A = this rebuild's spec; NEXT BUILD B = scoring v2).

## Roadmap

- **Phase 2 — signal:** confirm the cron is banking history; sold-proxy curve + per-print trend charts + scoring v2 (score vs rolling market median, not the flat baseline).
- **Phase 3 — portfolio depth:** valuation over time, condition-adjusted marks, honest sell signals on exclusives.
- **Phase 4 — the hunt:** wishlist auto-watch (eBay + machines), price alerts, sourcing map as a live tool.
- **Phase 5 — generalize:** the artist becomes a config; the engine serves any collectible market.
- Fold `market.html` fully into the v10 shell; per-print real retail to replace the flat $14 baseline.
- Security: rotate the eBay Cert ID (deferred by Michael).
