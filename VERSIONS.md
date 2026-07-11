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
| `f1-racetracks` | circuit guide v6.1 · standings lens v5.4 · index.html router · results store 2026-07-09c | live | **Verified against main 2026-07-11 (immutable SHAs).** Two lenses over ONE canonical results store at `f1-racetracks/f1-results/2026/` (`index_rounds.json` + per-round files); standings computes WDC/WCC live, circuit guide derives podium/pole/FL live via `source/12_results_store.js`. `data.json` DELETED. `index.html` = slim router landing on the Championship Matrix, forwarding legacy `#/` to `circuits.html`. **Standings lens v5.4 (PR #153) — SEASON HISTORY:** added a `History` lens to the Championship Matrix switcher (self-contained `source/standings/history.js`, folded into `nav.xnav`): newest-first round-by-round feed, each round fusing result (podium/pole/FL/sprint) with the resulting WDC leader+margin computed live from `cumPoints`. In-page stage swap; touches no other module. Cache-bust `?v=5.3 -> 5.4` across all standings modules; footer pinned to v5.4 by history.js. NOTE: `source/standings/data.js` `APP_VERSION` const still emits `v5.1` (predates segmented-module versioning) — bump it to v5.4 on the next data.js edit (deferred to avoid a full-file rewrite of the core module for a cosmetic change). Prior standings history: v5.3 (PR #125) unbroken quali→start→finish journey + two-column detail; quali/grid backfill rounds 2-7 (PRs #111-117). **Circuit guide v6.1 (PR #145) — PER-YEAR FIELDS IN THE SEASON INDEX:** `round`/`date`/`status`/`sessions` moved out of each `circuits/<slug>.json` (now TIMELESS identity + layout only) into `circuits/index_circuits.json` keyed by slug; `source/09` boot merges them on at load. Unlocks near-free 2024/2025 historical backfill (reuse the 22 identity files with a new season index). Cache-bust `20260710g -> 20260710h`; APP_VERSION `v6.1`. Built on v6 (PR #144, per-circuit data layer: 22 files + thin index, soft-fail per file, killed the inline TRACK_DATA modules). Circuit-guide round numbers join the results store BY SLUG (Silverstone r11 here vs r9 in store). **FLAGGED, not changed:** rounds 4-5 unused in circuit-guide numbering (pre-existing quirk, noted in index); map plates for the 7 newest circuits use best-guess Wikimedia filenames. **Known results-store gaps (separate reconciliation):** Suzuka missing Bearman+Stroll (20/22), Miami missing Gasly (21/22); per-driver fastLap null pending a lap-time source. |
| `world-cup-bracket` | shell v5.4 · data 2026-07-07 (verified) | live | Data-separated app: refreshes change only `data.json` (NO shell/version bump). Shell = v5.4 (last known; footer reads `v5.4 · direct`). Data 2026-07-07: R16 complete (8/8), QF slate seeded, lower-half `feedsTo` wiring fix. PR #76, merge SHA `1b50113`; ledger stamps PR #77. Verified against immutable commit-SHA path. Next refresh after QFs (Jul 9-11). |
| `pdf-splitter` | unverified | live | Verify before next PR. |
| `on-track` | unverified | live | Verify before next PR. |
| `inciardi-market` | shell v9 · catalog data 2026-07-10 | live | **Modularized (PR #151): thin HTML shells + `source/` modules.** `source/base.css` (shared design system + chrome, used by every page), `source/catalog.css` + `source/catalog.js` (gallery), `source/market.css` (terminal). `index.html` 25.5→6.5KB, `catalog.html` 32→6.3KB, both link `?v=9` source. `app.js` (market engine, 21KB) UNCHANGED, still stamps v7/PR#96. Three-page app (Catalog/Market/Collection) from v8 (PR #149). Data: expanded image-backed `catalog.json` w/ corrected retail. Research SOP: `catalog-research-routine.md` (PRs #147/#148). **TODO: `collection.html` still 38KB inline — needs the same modular split (adopt base.css + extract css/js); predates v9, deferred to its own pass.** Bump `?v=` token on every future source change. |
| `filemaker` | unverified | reference | FileMaker app docs, runs in FMP (no Pages). Verify before next PR. |

**Non-app infra (not launchable apps, listed so they're not mistaken for apps):** `brain-config`, `agent-reports`, `routines`, `shared`, `quickfire`, `template-app`, `polish-demo`.

---

_Rollout note: `unverified` rows carry the last value I could see without a fresh read; each gets confirmed and firmed up the next time that app is touched. Confirmed rows (prism, app-dashboard, markdown-viewer, world-cup-bracket, inciardi-market, f1-racetracks) are current as of 2026-07-11._
