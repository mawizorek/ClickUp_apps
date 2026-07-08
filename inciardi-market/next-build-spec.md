# Inciardi Mini Print Market Tracker — Build Spec

**App slug:** `inciardi-market` · **Repo:** `mawizorek/ClickUp_apps`
**Status (2026-07-08):** App v7, LIVE on real eBay data via the Cloudflare Worker. Terminal-style UI. Worker deployed + verified returning `source:ebay-browse`. A handful of follow-ups shelved (see bottom).

> It's **Anastasia Inciardi / Inciardi Prints** (Portland, ME). Not "Inciarid."

---

## NEXT BUILD (approved direction 2026-07-08) — Market history + data-driven scoring v2

**The goal:** stop scoring against hard-coded guesses. Score against a rolling **market** average built from our own accumulated snapshots, and show trends over time in a per-print detail view. Hard defaults stay ONLY as the cold-start fallback.

### Core reframe (this is the unlock)

**Retail and market are two different numbers and must not be conflated.**
- **Retail** = what Anastasia charges new. Fixed fact per print. Lives in `catalog.json`. Never moves. (Today's flat $14 baseline is wrong — give each print its real retail.)
- **Market** = what it actually trades at on eBay right now. A rolling average over our snapshots. THIS becomes the yardstick the verdict scores against.
- The list view scores vs market median; retail shows as a reference line beside it.

### Storage decision (LOCKED, Michael 2026-07-08): REPO time-series, not KV.

- History is a **committed data file in the repo**, appended each scan, nested under the app folder (`inciardi-market/history/` per the data-store-nests-in-app-folder rule). Chartable + permanent + scroll-back-able.
- KV stays for the worker's operational snapshot (prev-scan diff + token cache) only. It is NOT the history store.
- Rough shape: per-scan append of per-print aggregate {print, t, count, medianLanded, minLanded, maxLanded} + a `gone` event log {print, t, lastLanded}. Keep entries small; this file grows over time so watch size (Size Sally / Source-Size Enforcer territory — may need year-partitioning like the F1 store, e.g. history/2026/).

### The cron is the UNLOCK, not the scoring (do it FIRST)

- No cron = no history accumulates = the fancy averaging has nothing to average. Wire the Cloudflare Cron Trigger (~6h) on the `inciardi-market` worker FIRST so history starts banking immediately. `scheduled()` handler already exists in worker.js.
- The smart scoring is worthless until a few weeks of snapshots exist. Turn on collection now, build scoring v2 later against real data.

### Sold-price honesty (the ceiling + the workaround)

- No sold comps (eBay Marketplace Insights API is locked to us). Averages are of **asking** prices — what sellers want, drifts high.
- **Free proxy:** when a listing goes `gone`, log its last price. The distribution of "prices that disappeared" over weeks is the closest thing to a sold-price curve without the locked API. Genuinely valuable, costs nothing. Build the gone-event log from day one.

### Scoring v2 (build after history exists)

- `verdict()` compares landed vs the rolling market median for that print.
- Falls back to the hard default (current $-threshold logic) ONLY when sample size is too thin to trust. Best of both: never blank on a new/unseen print, data-driven once seen enough.
- Keep the current thresholds as the documented fallback, don't delete them.

### Trends live ELSEWHERE (Michael's instinct, confirmed)

- List view stays a fast screener. Depth is one tap in.
- Per-print **detail view**: sparkline/chart of median-ask over time, current asks plotted against it, `gone` events as sold-proxy markers, retail as a reference line.

### Build order (do NOT reorder)

1. **Cron first** (banks history starting now). Also rotate Cert ID as prerequisite security step — see shelved #1.
2. **History writer** in the worker: append per-scan aggregate + gone-event log to the repo history file. (Worker commits to repo, or emits and a step commits — decide the write path; note worker.js is pasted into Cloudflare, so a worker-side git write needs a token, OR the worker emits and something else commits. RESOLVE THIS at build time.)
3. **Per-print detail view** in the app reading the history file.
4. **Scoring v2** vs rolling median with thin-sample fallback.
5. Per-print real retail into `catalog.json` (kills the flat $14).

---

## Architecture (LIVE)

```
eBay Browse API  ->  Cloudflare Worker  ->  /market JSON  ->  static app (index.html + app.js)
   (live data)      (fetch+normalize+diff)    (snapshot)         (renders)
                            |
                      Cloudflare KV (prev snapshot + token cache)
```

- **Worker:** `inciardi-market` on Cloudflare, endpoint `https://inciardi-market.mawizorek-online.workers.dev/market`. Rebuilds snapshot on every hit (so an app reload = a manual refresh).
- **KV namespace:** `inciardi-snapshots`, bound to the worker as `SNAPSHOTS`.
- **Secrets (Cloudflare, encrypted):** `EBAY_CLIENT_ID` (plaintext ok), `EBAY_CLIENT_SECRET` (secret).
- **App data source:** `app.js` `DEFAULT_EP` soft-defaults to the worker `/market`. Load priority: Settings override -> Worker -> bundled sample. Worker outage degrades to cached/sample, never blank.
- Data Separation Pattern intact: `index.html` renders, worker supplies the living data. Worker is deployed separately, NOT served by Pages.

---

## Data source reality

- **Browse API** (`buy/browse/v1/item_summary/search`): live active listings. 5,000 calls/day free. OAuth client-credentials app token. (Endpoint path was wrong in worker v0 — `buy/api_v1` — fixed to `buy/browse/v1` in v0.1, PR #94.)
- **Marketplace Insights API** (sold comps) still restricted. v1 baseline = retail + active-listing spread, NOT sold history.

---

## market.json schema (the contract) — unchanged

Top-level: `version`, `query`, `source`, `baseline{retailDefault,currency}`, `summary{total,new,changed,gone,flagged}`, `listings[]`.
Per listing: `itemId`, `title`, `price`, `currency`, `shipping`, `landed`, `condition`, `buyingOptions[]`, `url`, `image`, `seller`, `location`, `listedAt`, `firstSeen`, `lastSeen`, `status`, `priceHistory[{t,landed}]`, `print{name,exclusive,matched}`, `flags[]`.

- `landed` = price + shipping.
- `print` derived by fuzzy title parse; `matched:false` when unresolved.
- Time fields + `status` computed by the Worker diff.

## The diff (new / changed / live / gone)

Keyed on `itemId` vs KV snapshot. First hit shows everything as `new` (no prior snapshot to diff). Second hit onward is where status + priceHistory start meaning something.

## flags

`underpriced` (landed <= 85% baseline), `exclusive` (NYC/LACMA/Grand Central/holiday), `pack-deal`. `auction`/`stale`/`condition-note` still surfaced from sample, Worker not yet emitting them.

---

## Scoring knobs (CURRENT = hard defaults; becomes the v2 fallback)

- Exclusive buy floor: <= $40 buy / <= $70 fair / over pass.
- Pack per-print assumption: ~5 prints (hardcoded; a "10 print pack" scores as 5 — fix with packCount parse).
- Underpriced single: landed <= 75% of retail = buy.
- Flat $14 retail baseline for EVERY print (wrong; per-print retail is the fix).

---

## SHELVED follow-ups (deferred 2026-07-08, in priority order)

1. **ROTATE THE CERT ID (security, do first).** The eBay Cert ID (Client Secret) appeared in a thinly-blurred screenshot mid-session. Treat as exposed. eBay keys page -> Rotate (Reset) Cert ID (grace period 0 fine) -> update `EBAY_CLIENT_SECRET` in Cloudflare -> redeploy -> re-hit `/market` to confirm still returns JSON. App ID + Dev ID are non-secret, no action.
2. **Cron trigger.** Now promoted into the NEXT BUILD above as step 1 (it's the history unlock). ~every 6h. `scheduled()` handler already exists.
3. **Pagination past the 200 cap.** `total:200` is the `limit=200` ceiling, not the true count. Add offset pagination in `fetchListings` (offset 0, 200, 400...), merge + dedupe by `itemId`. Widening the keyword is NOT the fix (adds noise, still caps at 200).
4. **Parser miss (`matched:false`).** Fuzzy title parser whiffs on some obvious exclusives (e.g. an NYC-exclusive listing parsed name:null). Tighten `parsePrint` regex/token logic so more rows match cleanly. (Also blocks history quality — unmatched listings can't aggregate per-print.)

---

## Deploy runbook (DONE, kept for reference)

1. eBay dev account -> Production keyset -> App ID + Cert ID. (Production keyset was Non-Compliant; cleared via marketplace-account-deletion opt-out.)
2. Cloudflare Worker `inciardi-market`, paste `worker.js`.
3. KV namespace `inciardi-snapshots`, bind as `SNAPSHOTS`.
4. Secrets `EBAY_CLIENT_ID` / `EBAY_CLIENT_SECRET`.
5. Deploy. `/market` returns JSON. ✅
6. App soft-defaults to the worker URL (v7). Status pill reads Live.

## Futures (deferred)

Marketplace Insights sold comps if partner access lands. My Stock empty-state polish. Machines tab is arguably a separate app (sourcing map, not market data) — watch for scope split.
