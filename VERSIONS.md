# App Version Ledger

**This file is the tiebreaker against stale reads and CDN/cache lag.** Agents read source through paths that can silently serve an old copy. This ledger is the one hand-maintained record of what version each app is actually on. When your read disagrees with this file, assume YOUR READ IS STALE and reconcile before touching anything.

## Procedure (MANDATORY on every app PR)

1. **Before opening a PR:** find the app's row below. Confirm the version/state you believe is current matches this ledger. If they disagree, STOP: re-read the real source (immutable commit-SHA path, or the git blob API which returns base64 and does NOT flatten HTML, not a plain branch URL) and reconcile. Do not build on a mismatch.
2. **Immediately after opening the PR:** update this app's row in the same session, bump the version, add the PR link, update the date. The ledger must never lag behind `main`.
3. This is a two-sided check: step 1 catches a stale read going in, step 2 keeps the ledger honest coming out.

Git commit history remains the authoritative changelog; this ledger is the fast human/agent-readable "where are we now" index that history alone doesn't surface at a glance.

**Data-separated apps carry TWO version facts:** the app *shell* build (HTML/JS/CSS, bumped on rebuilds) and the *data* date (`data.json`, bumped on refreshes). Record both so a stale read on either surface is catchable. A daily data refresh does NOT bump the shell version.

## Ledger

| App (slug) | Current version | Status | Last PR / notes |
| --- | --- | --- | --- |
| `prism` | v1 | live | Data App Viewer (JSON + Markdown). Initial build PR #54. |
| `app-dashboard` | v4 launcher + native Retired filter | live | Slim launcher: per-app icons, ClickUp/FileMaker toggle, Brain Config hub, detail sheet, settings gear. `index.html` = thin loader over `source/` modules. Native Retired filter (PR #72). PR #74 added `?v=` cache-busting to all source loads (browsers were serving stale app.js) and fixed the footer stamp to PR #72. **Bump the `?v=` token in index.html on every future source change.** |
| `markdown-viewer` | — | retired | Superseded by `prism`. `status:'retired'` in app-dashboard; hidden by default behind the Show-retired toggle. README is a redirect/history stub. Do not develop. |
| `file-chunker` | unverified (last known v16.2, 2026-07-01) | live | Verify against commit history before next PR. |
| `budget-code-mapper` | unverified (last known v6, design) | live | Verify before next PR. |
| `f1-racetracks` | unverified (last known v4/v5) | live | Verify before next PR. |
| `world-cup-bracket` | shell v5.4 · data 2026-07-07 (verified) | live | Data-separated app: refreshes change only `data.json` (NO shell/version bump). Shell = v5.4 (last known; footer reads `v5.4 · direct`). Data 2026-07-07: R16 complete (8/8), QF slate seeded, lower-half `feedsTo` wiring fix. PR #76, merge SHA `1b50113`; ledger stamps PR #77. Verified against immutable commit-SHA path. Next refresh after QFs (Jul 9-11). |
| `pdf-splitter` | unverified | live | Verify before next PR. |
| `on-track` | unverified | live | Verify before next PR. |
| `inciardi-market` | shell v10 (index=router) · worker v0.4 · catalog data 2026-07-10 | live | **index-as-router reconcile (PR #156):** `index.html` is now a thin ROUTER shell (1.8KB) — one-line `DEFAULT_LANDING = "market.html"` const + JS `location.replace` + `<noscript>` fallback, nothing servable itself. The Market terminal moved VERBATIM into `market.html` (6.5KB; keeps `app.js` wiring + `source/base.css`+`market.css`). `catalog.html` + `collection.html` Market-nav links (and the catalog footer Market link) repointed `./index.html` → `./market.html`. Now `/` → router → market.html by default; Market/Catalog/Collection cross-linked both ways. **Worker v0.4 (PR #157):** fixed the $0.00 / -100% Deal Radar bug — `normalize()` only read `it.price.value`, absent on AUCTION listings the search pulls (`buyingOptions:{FIXED_PRICE|AUCTION}`), so auctions collapsed to landed 0 → -100% vs retail. Now falls back to `it.currentBidPrice`. **`worker.js` is the Cloudflare deploy target, NOT Pages-served — REQUIRES a Worker redeploy to take effect.** `app.js` (market engine, 21KB, under cap) UNCHANGED, still stamps v7/PR#96. `collection.js` stamps v0.9/PR#154. Modules: `source/base.css` (shared, index+catalog+market), `catalog.css`+`catalog.js` (gallery), `market.css` (terminal), `collection.css`+`collection.js` (registry, self-contained). Collection sync is honest local-only (worker exposes no write endpoint). Data: image-backed `catalog.json`, corrected retail. Research SOP: `catalog-research-routine.md` (PRs #147/#148). Bump `?v=` token on every future source change. |
| `filemaker` | unverified | reference | FileMaker app docs, runs in FMP (no Pages). Verify before next PR. |

**Non-app infra (not launchable apps, listed so they're not mistaken for apps):** `brain-config`, `agent-reports`, `routines`, `shared`, `quickfire`, `template-app`, `polish-demo`.

---

_Rollout note: `unverified` rows carry the last value I could see without a fresh read; each gets confirmed and firmed up the next time that app is touched. Confirmed rows (prism, app-dashboard, markdown-viewer, world-cup-bracket, inciardi-market) are current as of 2026-07-11._
