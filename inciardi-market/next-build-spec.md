# Inciardi Mini Print Market Tracker — Build Spec (v2, 2026-07-13)

**App slug:** `inciardi-market` · **Repo:** `mawizorek/ClickUp_apps`
**Status:** Live relational backend. D1 schema + worker v1.2 deployed. Catalog is a ~50-row seed; the deep 500+ harvest is the next build.

> It's **Anastasia Inciardi / Inciardi Prints** (Portland, ME). Not "Inciarid."

---

## Architecture (CURRENT — supersedes the old market.json/Pages model)

```
eBay Browse API ->  Cloudflare Worker (v1.2)  ->  D1 (relational)  ->  static terminal.html
  (live data)        fetch+normalize+diff+cron       + R2 (image bytes)     (renders via API)
                              |                       + KV (snapshot + token cache)
                        cron every 6h banks history into D1
```

The Worker (`worker.js`) is the whole backend + the only thing that touches eBay (CORS + auth make a static-only page impossible). Deployed separately via Workers Builds on push to main, NOT served by Pages.

**Stores:**
- **D1** (`DB`): `catalog`, `catalog_alias`, `print_image`, `inventory`, `market_point`, `print_point`, `gone_event`, `machine`, `machine_print`, `machine_event`. Schema truth: `db/schema.sql`.
- **R2** (`IMAGES`): print image bytes. Scrubbed from Shopify CDN (decision B). 4.5GB self-enforced cap.
- **KV** (`SNAPSHOTS`): live eBay snapshot (diff source) + OAuth token cache.
- **Secrets:** `EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET`, `WRITE_KEY`.

---

## API (worker v1.2)

**Reads (open):** `GET /market`, `/catalog`, `/inventory`, `/history?print_id=`, `/machines` (filter `?state=&city=&status=&collection=` or `?print_id=`), `/usage`, `/img?key=|?u=`.
**Writes (gated, header `x-write-key`):** `POST /catalog`, `/catalog/image`, `/catalog/image/scrub`, `/catalog/image/state`, `/inventory`, `/machines`, `/machines/stock`, `/machines/print`.

---

## Data source reality

- **eBay Browse API** (`item_summary/search`): live active listings. 5,000 calls/day free. OAuth client-credentials. The market spine.
- **Marketplace Insights API** (sold comps) is restricted/closed. So baseline = retail + active-listing spread + the `gone_event` sold-proxy, NOT true sold history.
- **Shopify `/products.json`**: the catalog harvest backbone (products + variants + mystery-pack body prose = 3 layers). See `catalog-research-routine.md`.

---

## 🔨 NEXT BUILD (the main event) — full catalog harvest + scrub into D1

Everything is now wired for this; it hasn't been run at scale. A cold agent can start a clean session and execute `catalog-research-routine.md` end to end:

1. **Page the whole Shopify store** (`/products.json?limit=250` until empty). Explode all 3 layers (product / variant / mystery-pack body).
2. **Classify via collections**; reconcile against live D1 (`GET /catalog`); upsert via `POST /catalog` (dedupe -> aliases, never new prints).
3. **Scrub images** into R2 via `POST /catalog/image/scrub` (per-variant where applicable).
4. **Harvest machines** from the store-locator: `POST /machines`, link prints via `POST /machines/print`, set stock via `POST /machines/stock`.
5. **Cross-check eBay `unmatched`**; feed resolved titles into `catalog_alias`.
6. **Coverage gauge** vs the claimed 500+ (Vault as answer key only, never copied).

Win condition: catalog grows from the ~50-row seed toward the real universe, every row sourced + image-backed, machines mapped and filterable.

---

## Scoring knobs (set by Michael, still guesses)

- Exclusive buy floor: <= $40 buy / <= $70 fair / over pass.
- Pack per-print assumption: ~5 prints (until a real `pack_of`/`pack_from` lands per pack).
- Underpriced single: landed <= 75% of retail = buy.

## Worker refinements (deferred, surfaced by sample data)

- Emit `auction` flag + carry auction end time; `stale` when `firstSeen` > 30 days; `condition-note` when not New.
- Live single-URL lookup route (`/item?url=...`) to power Compare.
- Machine-aware buy signal: an exclusive going `empty` across machines = scarcity pressure = sell-side signal.

---

## Known guardrails

- **D1 via the worker is the store of truth.** `catalog.json` is a mirror/export; committing it does not update the app.
- No true sold comps; don't promise sold-price history. `gone_event` is a proxy.
- Title parsing is fuzzy; degrade to `matched:false`, never mis-score.
- Official names win; seller titles -> aliases. Provenance or provisional. `locked=1` protects hand-entered rows.
- Images scrubbed to R2 (no blobs in git). Secrets stay Worker-side.
- `schema.sql` is `CREATE IF NOT EXISTS` — it will NOT alter an existing table. Introspect live D1 to confirm, never assume a re-run migrated anything. (This bit us 2026-07-13: catalog/inventory had drifted to a dead schema; fixed by drop+recreate.)

## Futures (deferred)

Deal Radar / Sell Signal polish, pack composition sort (fuzzy mystery-pack contents), vending-machine map UI, Marketplace Insights sold comps if partner access lands.
