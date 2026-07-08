# Inciardi Mini Print Market Tracker — Build Spec

**App slug:** `inciardi-market` · **Repo:** `mawizorek/ClickUp_apps`
**Status (2026-07-08):** App v7, LIVE on real eBay data via the Cloudflare Worker. Terminal-style UI. Worker deployed + verified returning `source:ebay-browse`. A handful of follow-ups shelved (see bottom).

> It's **Anastasia Inciardi / Inciardi Prints** (Portland, ME). Not "Inciarid."

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

## Scoring knobs (still Michael's guesses)

- Exclusive buy floor: <= $40 buy / <= $70 fair / over pass.
- Pack per-print assumption: ~5 prints.
- Underpriced single: landed <= 75% of retail = buy.

---

## SHELVED follow-ups (deferred 2026-07-08, in priority order)

1. **ROTATE THE CERT ID (security, do first).** The eBay Cert ID (Client Secret) appeared in a thinly-blurred screenshot mid-session. Not confirmed leaked, but treat as exposed. eBay keys page -> Rotate (Reset) Cert ID (grace period 0 fine) -> update `EBAY_CLIENT_SECRET` in Cloudflare -> redeploy -> re-hit `/market` to confirm still returns JSON. App ID + Dev ID are non-secret, no action.
2. **Cron trigger.** Worker only refreshes on hit. Add a Cloudflare Cron Trigger (~every 6h) so `priceHistory` + new/changed/gone build passively even when the app isn't opened. Worker `scheduled()` handler already exists; just needs the trigger wired.
3. **Pagination past the 200 cap.** `total:200` is the `limit=200` ceiling, not the true count — field is larger and being truncated. Add offset pagination in `fetchListings` (offset 0, 200, 400...), merge + dedupe by `itemId`. Cheap on the 5k/day budget. Widening the keyword is NOT the fix (adds noise, still caps at 200).
4. **Parser miss (`matched:false`).** Fuzzy title parser whiffs on some obvious exclusives (e.g. an NYC-exclusive listing parsed name:null). Tighten `parsePrint` regex/token logic so more rows match cleanly.

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
