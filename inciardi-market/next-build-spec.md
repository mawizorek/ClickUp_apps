# Inciardi Mini Print Market Tracker — Build Spec

**App slug:** `inciardi-market` · **Repo:** `mawizorek/ClickUp_apps`
**Status (2026-07-13):** App LIVE on real eBay data via the Cloudflare Worker. Modular multi-page (router-shell `index.html` -> `market.html` / `catalog.html` / `collection.html`, shared `source/base.css` + per-page css/js). Worker at **v0.5**: `/market` (live eBay), `/inventory` + `/catalog/confirm` (D1, gated), and the new **`/img` same-origin image proxy** (PR #168, 2026-07-13) that killed the catalog flash-then-vanish. D1 DB is wired (`catalog`, `catalog_alias`, `inventory` tables + a title/alias resolver) but the gallery still reads the static `catalog.json`, not the DB. Two approved build tracks below.

> It's **Anastasia Inciardi / Inciardi Prints** (Portland, ME). Not "Inciarid."

---

## NEXT BUILD A (approved 2026-07-13) — Manual catalog entry + Worker-canonical catalog + own-image upload

**The goal:** make the catalog hand-editable. Michael has a print in front of him -> types it in, drops a photo -> it's in the catalog. No scrub, no rebuild, no CDN dependency for owned prints. This flips the catalog from a static scrub-built JSON to a Worker-canonical store (D1 + R2), with scrubbing demoted to *enrichment that fills gaps but never clobbers*.

### Core reframe (the unlock)

**The catalog stops being scrape-canonical and becomes hand-canonical.**
- Today: `catalog.json` is static, scrub-built (Shopify harvest). Nowhere to "add a print" without a rebuild.
- Target: **D1 `catalog` table is the source of truth** (the table + resolver already exist in worker.js). The gallery reads a new `GET /catalog` route. `catalog.json` demotes to a seed/cold-start fallback (fill-if-blank, same posture as the market sample).
- Scrub/harvest becomes an **enrichment pass**, not the author. It fills empty fields and flags conflicts; it NEVER overwrites a hand-entered value (see the merge-not-clobber guardrail).

### Own-image upload -> R2 (kills the CDN dependency for owned prints)

- New R2 bucket bound to the worker. A gated image-upload route (`POST /catalog/image`, or fold into `/catalog/confirm` as a multipart body) stores the photo in R2.
- **Served back through the `/img` proxy we just shipped** — extend `IMG_HOST_ALLOW` / add an R2 branch so `/img?key=<r2-key>` streams the owned image same-origin, edge-cached, exactly like the Shopify path. One image code path for everything.
- This is strictly better than committing image binaries to the repo (binaries can't round-trip the MCP commit tool — GitHub-UI drag-drop hell, no automation). R2 + `/img` is fully automatable from the app.

### Manual add = a gated form

- A gated "Add print" form in the catalog view: name, category, retail, exclusive/series, in-print flag, aliases, photo.
- Writes via the existing gated `POST /catalog/confirm` (already in worker.js: upserts `catalog` keyed on `print_id`, `ON CONFLICT DO UPDATE`, optional alias insert).
- **Write auth:** `/catalog/confirm` requires the `x-write-key` header (`env.WRITE_KEY`). The key CANNOT ship in the public repo. Enter it once in the Settings drawer, cache to `localStorage` (same pattern as the endpoint override). Cosmetic-gate doctrine holds — no sensitive data — but WRITE_KEY protects DB integrity, so it stays user-entered, never committed.

### Dedupe-on-add (Michael's core ask — the reconciliation layer)

**The behavior Michael flagged:** "I'll be lazy and just input a print I have in front of me even though it already exists in the DB." So a manual add must be **reconciled against the existing catalog before it writes**, and manual entries are **cached specifically for that comparison**.

- Before committing an add, normalize the entry (lowercased, alpha-num-collapsed name + aliases — reuse the `norm()` the gallery already uses) and match against every existing catalog row + its aliases.
- **Exact/normalized match -> HALT the create.** Surface the existing print: "You already have this — want to attach your photo/retail to it instead?" Merge into the existing `print_id`, don't spawn a twin.
- **Near match (fuzzy) -> WARN + ask.** Present the candidate(s), let Michael pick "merge into this" or "no, it's genuinely new."
- **No match -> proceed** to create with a fresh `print_id`.
- This is the Task Dedup Gate pattern, applied to prints. It's the whole point of the feature: lazy re-entry converges onto the existing record instead of fragmenting the catalog.

### Merge-not-clobber guardrail (LOCKED intent)

**The day the catalog is hand-editable, the scrub must stop being allowed to overwrite manual entries, or it stomps Michael's uploads on the next run.**
- Every catalog row carries **provenance**: `source` (`manual` | `shop-harvest` | `ebay-confirm` | `seed`) and ideally per-field manual-locks (at minimum: a manually-set image/retail/name is locked).
- The enrichment/harvest pass is **fill-if-blank + conflict-flag ONLY.** It may populate an empty field on a manual row; it may NOT overwrite a populated manual field. A material disagreement is a flag for Michael to resolve, never a silent overwrite.
- Mirrors the repo-wide fill-if-blank + conflict-flag rule already used for the F1 / World Cup twins.

### Open questions to RESOLVE at build time

1. **R2 access path:** serve owned images via the worker `/img` (R2 binding read) vs an R2 public/custom-domain URL. Prefer routing through `/img` so there's one cached, allowlisted image path and no second public origin.
2. **`print_id` generation for manual adds:** slug from name? random id? Must play nice with the dedupe match (don't let a new id mask a name collision — dedupe is on normalized name/alias, not id).
3. **`GET /catalog` shape:** return the same schema the gallery already consumes from `catalog.json` (so `catalog.js` barely changes), with `source`/provenance added per row. Keep `catalog.json` as the fallback the app falls to on worker outage.
4. **Image compression on upload:** downscale/compress client-side before R2 (the app's raster budget rule: keep it lean, phone photos are multi-MB).
5. **Migration:** one-time seed of the current `catalog.json` into D1 so the DB starts from today's 50-ish sourced prints, all tagged `source:seed` (so a later harvest can enrich them but a manual edit locks them).

### Build order (proposed)

1. **R2 bucket + binding + `/img` R2 branch** (image path first — everything visual leans on it).
2. **`GET /catalog` from D1** + seed `catalog.json` into D1 (`source:seed`). Gallery reads `/catalog`, falls back to `catalog.json`.
3. **Manual-add form** + WRITE_KEY in Settings, writing via `/catalog/confirm`.
4. **Dedupe-on-add reconciliation** (halt-exact / warn-near / proceed-none) — the heart of the feature.
5. **Provenance + merge-not-clobber** enforcement on the harvest/enrichment pass.

---

## NEXT BUILD B (approved 2026-07-08, still queued) — Market history + data-driven scoring v2

**The goal:** stop scoring against hard-coded guesses. Score against a rolling **market** average built from our own accumulated snapshots, and show trends over time in a per-print detail view. Hard defaults stay ONLY as the cold-start fallback.

### Core reframe (this is the unlock)

**Retail and market are two different numbers and must not be conflated.**
- **Retail** = what Anastasia charges new. Fixed fact per print. Lives in the catalog. Never moves. (Today's flat $14 baseline is wrong — give each print its real retail.)
- **Market** = what it actually trades at on eBay right now. A rolling average over our snapshots. THIS becomes the yardstick the verdict scores against.
- The list view scores vs market median; retail shows as a reference line beside it.

### Storage decision (LOCKED, Michael 2026-07-08): REPO time-series, not KV.

- History is a **committed data file in the repo**, appended each scan, nested under the app folder (`inciardi-market/history/` per the data-store-nests-in-app-folder rule). Chartable + permanent + scroll-back-able.
- KV stays for the worker's operational snapshot (prev-scan diff + token cache) only. It is NOT the history store.
- Rough shape: per-scan append of per-print aggregate {print, t, count, medianLanded, minLanded, maxLanded} + a `gone` event log {print, t, lastLanded}. Keep entries small; this file grows over time so watch size (may need year-partitioning like the F1 store, e.g. `history/2026/`).
- NOTE: the D1 DB (NEXT BUILD A) may change this calculus — `market_point` / `print_point` / `gone_event` tables already exist in worker.js's `runCron`. Reconcile at build time whether history lives in repo files or D1; the cron already writes to D1.

### The cron is the UNLOCK, not the scoring (do it FIRST)

- No cron = no history accumulates = the fancy averaging has nothing to average. Wire the Cloudflare Cron Trigger (~6h) on the `inciardi-market` worker FIRST so history starts banking immediately. `scheduled()` handler already exists in worker.js and wrangler.toml already declares `crons = ["0 */6 * * *"]`.
- The smart scoring is worthless until a few weeks of snapshots exist. Turn on collection now, build scoring v2 later against real data.

### Sold-price honesty (the ceiling + the workaround)

- No sold comps (eBay Marketplace Insights API is locked to us). Averages are of **asking** prices — what sellers want, drifts high.
- **Free proxy:** when a listing goes `gone`, log its last price. The distribution of "prices that disappeared" over weeks is the closest thing to a sold-price curve without the locked API. Genuinely valuable, costs nothing. `gone_event` log already writes in the cron.

### Scoring v2 (build after history exists)

- `verdict()` compares landed vs the rolling market median for that print.
- Falls back to the hard default (current $-threshold logic) ONLY when sample size is too thin to trust. Best of both: never blank on a new/unseen print, data-driven once seen enough.
- Keep the current thresholds as the documented fallback, don't delete them.

### Trends live ELSEWHERE (Michael's instinct, confirmed)

- List view stays a fast screener. Depth is one tap in.
- Per-print **detail view**: sparkline/chart of median-ask over time, current asks plotted against it, `gone` events as sold-proxy markers, retail as a reference line.

### Build order (do NOT reorder)

1. **Cron first** (banks history starting now). Also rotate Cert ID as prerequisite security step — see shelved #1.
2. **History writer**: per-scan aggregate + gone-event log. (D1 path already exists via cron; decide repo-file vs D1 as the readable store for the app.)
3. **Per-print detail view** in the app reading the history.
4. **Scoring v2** vs rolling median with thin-sample fallback.
5. Per-print real retail into the catalog (kills the flat $14).

---

## Architecture (LIVE)

```
eBay Browse API  ->  Cloudflare Worker  ->  /market JSON   ->  static app (router shell -> pages)
   (live data)      (fetch+normalize+diff)    (snapshot)          (renders)
                              |  \
                    Cloudflare KV   \-- Cloudflare D1 (catalog, inventory, history points)
                 (prev snapshot +        + /img proxy (Shopify CDN today, R2 next)
                  token cache)
```

- **Worker:** `inciardi-market` on Cloudflare, base `https://inciardi-market.mawizorek-online.workers.dev`. Routes: `GET /market` (live eBay snapshot, rebuilt each hit), `GET /img` (same-origin image proxy, edge-cached 7d, host-allowlisted), `GET/POST /inventory` (D1, POST gated), `POST /catalog/confirm` (D1 upsert, gated), `scheduled()` cron distills points into D1.
- **KV namespace:** `inciardi-snapshots` -> `SNAPSHOTS` (operational snapshot + token cache only).
- **D1:** bound as `DB`. Tables: `catalog`, `catalog_alias`, `inventory`, `market_point`, `print_point`, `gone_event`.
- **Secrets (Cloudflare, encrypted):** `EBAY_CLIENT_ID` (plaintext ok), `EBAY_CLIENT_SECRET` (secret), `WRITE_KEY` (gates every POST). Never in the repo.
- **App data source:** page js soft-defaults to the worker. Load priority: Settings override -> Worker -> bundled sample/`catalog.json`. Worker outage degrades to cached/sample, never blank.
- Data Separation Pattern intact: shells render, worker supplies living data. Worker is deployed via Workers Builds (git-connected, `wrangler.toml`), NOT served by Pages.

---

## Data source reality

- **Browse API** (`buy/browse/v1/item_summary/search`): live active listings. 5,000 calls/day free. OAuth client-credentials app token.
- **Marketplace Insights API** (sold comps) still restricted. Baseline = retail + active-listing spread, NOT sold history.

---

## market.json schema (the contract) — unchanged

Top-level: `version`, `query`, `source`, `baseline{retailDefault,currency}`, `summary{total,new,changed,gone,flagged}`, `listings[]`.
Per listing: `itemId`, `title`, `price`, `currency`, `shipping`, `landed`, `condition`, `buyingOptions[]`, `url`, `image`, `seller`, `location`, `listedAt`, `firstSeen`, `lastSeen`, `status`, `priceHistory[{t,landed}]`, `print{name,exclusive,matched}`, `flags[]`.

- `landed` = price + shipping.
- `print` derived by fuzzy title parse; `matched:false` when unresolved.
- Time fields + `status` computed by the Worker diff (keyed on `itemId` vs KV snapshot).

## flags

`underpriced` (landed <= 85% baseline), `exclusive` (NYC/LACMA/Grand Central/holiday), `pack-deal`. `auction`/`stale`/`condition-note` still surfaced from sample, Worker not yet emitting them.

---

## Scoring knobs (CURRENT = hard defaults; becomes the v2 fallback)

- Exclusive buy floor: <= $40 buy / <= $70 fair / over pass.
- Pack per-print assumption: ~5 prints (hardcoded; a "10 print pack" scores as 5 — fix with packCount parse).
- Underpriced single: landed <= 75% of retail = buy.
- Flat $14 retail baseline for EVERY print (wrong; per-print retail is the fix, NEXT BUILD B step 5).

---

## SHELVED follow-ups (in priority order)

1. **ROTATE THE CERT ID (security, do first).** The eBay Cert ID (Client Secret) appeared in a thinly-blurred screenshot mid-session. Treat as exposed. eBay keys page -> Rotate (Reset) Cert ID -> update `EBAY_CLIENT_SECRET` in Cloudflare -> redeploy -> re-hit `/market` to confirm JSON. App ID + Dev ID are non-secret, no action.
2. **Cron trigger.** Promoted into NEXT BUILD B step 1 (the history unlock). `wrangler.toml` already declares the 6h cron; confirm it's firing in the Cloudflare dashboard.
3. **Pagination past the 200 cap.** `total:200` is the `limit=200` ceiling, not the true count. Add offset pagination in `fetchListings` (offset 0, 200, 400...), merge + dedupe by `itemId`. Widening the keyword is NOT the fix.
4. **Parser miss (`matched:false`).** Fuzzy title parser whiffs on some obvious exclusives. Tighten `parsePrint` regex/token logic so more rows match cleanly. (Also blocks history quality — unmatched listings can't aggregate per-print.)

---

## Deploy runbook (DONE, kept for reference)

1. eBay dev account -> Production keyset -> App ID + Cert ID.
2. Cloudflare Worker `inciardi-market` (now git-connected via `wrangler.toml` / Workers Builds).
3. KV namespace `inciardi-snapshots`, bind as `SNAPSHOTS`. D1 `inciardi-market`, bind as `DB`.
4. Secrets `EBAY_CLIENT_ID` / `EBAY_CLIENT_SECRET` / `WRITE_KEY`.
5. Deploy. `/market` returns JSON. ✅
6. App soft-defaults to the worker URL. Status pill reads Live.

**For NEXT BUILD A, add:** R2 bucket + binding; `WRITE_KEY` entered in the app Settings drawer (never committed).

## Futures (deferred)

Marketplace Insights sold comps if partner access lands. My Stock empty-state polish. Machines tab is arguably a separate app (sourcing map, not market data) — watch for scope split.
