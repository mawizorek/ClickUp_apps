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
| `inciardi-market` | shell v9 · catalog data 2026-07-10 | live | **Modularized (PR #151): thin HTML shells + `source/` modules.** `source/base.css` (shared design system + chrome, used by every page), `source/catalog.css` + `source/catalog.js` (gallery), `source/market.css` (terminal). `index.html` 25.5→6.5KB, `catalog.html` 32→6.3KB, both link `?v=9` source. `app.js` (market engine, 21KB) UNCHANGED, still stamps v7/PR#96. Three-page app (Catalog/Market/Collection) from v8 (PR #149). Data: expanded image-backed `catalog.json` w/ corrected retail. Research SOP: `catalog-research-routine.md` (PRs #147/#148). **TODO: `collection.html` still 38KB inline — needs the same modular split (adopt base.css + extract css/js); predates v9, deferred to its own pass.** Bump `?v=` token on every future source change. |
| `filemaker` | unverified | reference | FileMaker app docs, runs in FMP (no Pages). Verify before next PR. |

**Non-app infra (not launchable apps, listed so they're not mistaken for apps):** `brain-config`, `agent-reports`, `routines`, `shared`, `quickfire`, `template-app`, `polish-demo`.

---

_Rollout note: `unverified` rows carry the last value I could see without a fresh read; each gets confirmed and firmed up the next time that app is touched. Confirmed rows (prism, app-dashboard, markdown-viewer, world-cup-bracket, inciardi-market) are current as of 2026-07-10._
