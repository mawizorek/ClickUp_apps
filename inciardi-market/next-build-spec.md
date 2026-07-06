# Inciardi Mini Print Market Tracker — Build Spec

**App slug:** `inciardi-market` · **Repo:** `mawizorek/ClickUp_apps`
**Status:** v1 shipped on sample data. Worker wiring pending eBay dev-account approval.

> It's **Anastasia Inciardi / Inciardi Prints** (Portland, ME). Not "Inciarid."

---

## Architecture

```
eBay Browse API  →  Cloudflare Worker  →  market.json  →  static index.html
   (live data)      (fetch+normalize+diff)   (snapshot)        (renders)
                            |
                      Cloudflare KV (prev snapshot + token cache)
```

Data Separation Pattern: `index.html` renders, `market.json` is the living data. The Worker (`worker.js`) is the only thing that touches eBay (CORS + auth make a static page impossible). Deployed separately, NOT served by Pages.

---

## Data source reality

- **Browse API** (`item_summary/search`): live active listings. 5,000 calls/day free. OAuth client-credentials app token.
- **Marketplace Insights API** (sold comps) is restricted / closed to new users. So **v1 baseline = retail + active-listing spread**, NOT sold history.
- Multi-source rarity (retail sold-out, Poshmark, drop history) = v2.

---

## market.json schema (the contract)

Top-level: `version`, `query`, `source`, `baseline{retailDefault,currency}`, `summary{total,new,changed,gone,flagged}`, `listings[]`.

Per listing: `itemId`, `title`, `price`, `currency`, `shipping`, `landed`, `condition`, `buyingOptions[]`, `url`, `image`, `seller`, `location`, `listedAt`, `firstSeen`, `lastSeen`, `status`, `priceHistory[{t,landed}]`, `print{name,exclusive,matched}`, `flags[]`.

- `landed` = price + shipping (the number that matters).
- `print` is derived by parsing the title (fuzzy; `matched:false` when unresolved).
- Time fields + `status` computed by the Worker diff.

---

## The diff (new / changed / live / gone)

Keyed on `itemId` vs KV snapshot:
- **new** — present now, absent last scan.
- **changed** — present both, `landed`/`buyingOptions` moved. Append `priceHistory`.
- **live** — present both, unchanged. Keeps `firstSeen`.
- **gone** — in last snapshot, absent now. Kept one cycle. (Disappearance ≈ sold; can't confirm without Marketplace Insights.)

## flags (orthogonal to status)

- `underpriced` — landed <= 85% of baseline.
- `exclusive` — title matches NYC / LACMA / Grand Central / holiday.
- `pack-deal` — multi-print pack.
- `auction` / `stale` / `condition-note` — surfaced from sample; Worker to emit them (see Next build).

---

## Next build (Worker additions surfaced by the sample data)

- Emit `auction` flag from `buyingOptions:[AUCTION]` + carry auction end time.
- Emit `stale` flag when `firstSeen` > 30 days.
- Emit `condition-note` when condition != New, and factor condition into scoring.
- Add `packCount` (parsed "N prints" / "N lot") so pack scoring stops assuming ~5.
- Live single-URL lookup route (`/item?url=...`) to power Compare.

## Scoring knobs (set by Michael, currently guesses)

- Exclusive buy floor: <= $40 buy / <= $70 fair / over pass.
- Pack per-print assumption: ~5 prints (until `packCount` lands).
- Underpriced single: landed <= 75% of retail = buy.

---

## Known guardrails

- No sold comps in v1. Don't promise price history from sold data.
- Title parsing is fuzzy; degrade to `matched:false`, never mis-score.
- eBay bot-walls raw page fetches; all data via Browse API through the Worker.
- Secrets stay Worker-side. Nothing sensitive in the public repo.
- CORS header required on the Worker for the Pages origin.

## Deploy runbook (v0)

1. eBay developer account → production keyset → Client ID + Secret.
2. Cloudflare: create Worker `inciardi-market`, paste `worker.js`.
3. Add KV namespace, bind as `SNAPSHOTS`.
4. Add secrets `EBAY_CLIENT_ID` / `EBAY_CLIENT_SECRET`.
5. Deploy. Open `.../market`, confirm JSON.
6. Paste the Worker URL into the app Settings drawer.
7. Add cron (every 6h) once on-demand works.

## Futures (deferred)

Deal Radar/Sell Signal polish, self-filling `catalog.json`, pack composition sort, vending-machine map, Marketplace Insights sold comps if partner access lands.
