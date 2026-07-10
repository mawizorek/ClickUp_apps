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
| `prism` | v2.2 | live | Data App Viewer (JSON + Markdown), access `open` (public). v2.2 (PR #84): unlocked + fixed mobile pivot overflow + footer version/PR stamp + README Infrastructure table + og.png/icon.png icon package + `?v=4`. v2.1 (PR #80): slim mobile header + `?v=3`. v2 (PR #78): mobile export bottom-sheet + tab-delimiter fix. v1 (PR #54): took over from Markdown Viewer (retired). |
| `app-dashboard` | v4 launcher + native Retired filter | live | Slim launcher: per-app icons, ClickUp/FileMaker toggle, Brain Config hub, detail sheet, settings gear. `index.html` = thin loader over `source/` modules. Native Retired filter (PR #72). PR #74 added `?v=` cache-busting to all source loads and fixed the footer stamp to PR #72. **Bump the `?v=` token in index.html on every future source change.** |
| `markdown-viewer` | — | retired | Superseded by `prism`. `status:'retired'` in app-dashboard; hidden by default behind the Show-retired toggle. Do not develop. |
| `file-chunker` | unverified (last known v16.2, 2026-07-01) | live | Verify against commit history before next PR. |
| `budget-code-mapper` | unverified (last known v6, design) | live | Verify before next PR. |
| `f1-racetracks` | standings lens v5.3 · circuit guide v5.4 · index.html router · store data 2026-07-09c | live | **Canonical results store refactor (2026-07-09):** results live ONCE in `f1-results/2026/` (per-round files + `index_rounds.json`, renamed from `index.json`). Both lenses read it: standings computes WDC/WCC live; the circuit guide derives podium/pole/FL live via `source/12_results_store.js`. **`data.json` DELETED**. `index.html` is a slim router landing on the Championship Matrix, forwarding legacy `#/ ` deep links to `circuits.html`. ClickUp race task = canonical for NARRATIVE, repo store = canonical for RESULTS. **Circuit guide v5.4 (PR #132) — reconcile + single-step carousel:** (1) inline track statuses in source/07 reconciled to the store meta — Silverstone (r11) `active→done`, Spa (r12) `pending→active`, so grid stripes + carousel chips + store meta all agree Spa = current (the earlier status divergence is now RESOLVED). (2) `window.f1Carousel(dir)` advances the window by ONE round per chevron (slide, keep one tile) instead of a fresh pair. **Circuit guide v5.3 (PR #131) — header carousel:** two condensed race tiles flanked by chevrons, default window current + next; `carouselMarkup`/`carouselTile`/`f1Carousel`/`currentIndex` in source/09, styled in source/03d (`.cx*`). Retired v5.2's `.quick-access`/`.qa-*`. **v5.2 (PR #129):** pinned quick-access cards (superseded). **v5.1 (PR #127) — restore + compact index:** the index was dead because module 09's `boot()` still fetched the deleted `data.json`; now `boot()` assembles TRACKS from inline `TRACK_DATA_ROUNDS_*` globals (source/05-08). Results binding fix: `raceResults`/`historicWinners`/`appDataMeta` bind to the same `window.*` objects module 12 mutates. Added `source/03d_styles_technical_index.css.txt`. **Standings lens v5.3 (PR #125):** Qualified→Started→Finished as ONE unbroken flow row + two-column detail strip (Q1/Q2/Q3 under Qualifying; fastest lap + tyre strategy under Race). Superseded v5.2 (PR #124, split-into-portals). **v5.1 standings (PR #109):** driver race popup first surfaced qualifying + position journey. **Quali/grid backfill (2026-07-09, PRs #111-114, #116-117):** rounds 2-7 per-driver `qualifying{pos,q1,q2,q3}` + `grid` + `onRoadPos` from CU tasks (by driverId). Austria (r8/red-bull-ring is actually r10 here; Austria quali) + Silverstone quali ABSENT (no CU table). Known store gaps for separate reconciliation: Suzuka missing Bearman+Stroll (20/22), Miami missing Gasly (21/22). Open threads: per-driver `fastLap` still null + per-driver tyre strategy not yet a store field; lens integration not squared (router is the seam); 2024/2025 historical backfill is a future ask this per-season structure absorbs. |
| `world-cup-bracket` | shell v5.7 · data 2026-07-09 (verified) | live | Data-separated app: refreshes change only `data.json` (NO shell/version bump). **v5.7 (PR #122) — local-timezone kickoff:** `localKickoff` in `util.js` renders each kickoff in the VIEWER'S own zone; data `time` stays ET-clock. **v5.6 (PR #119) — 3rd-place rendering:** round `3P` (id 32, Sat Jul 18). **v5.5 (PR #106) — app-derived status:** `normalizeMatches` derives upcoming/live/done at load; `data.json` carries FACTS only + `cuTaskId`. **Mirror keying (PR #110):** `cuTaskId` on all 32 matches. **Session recovery:** v1.4 (PR #103) clobbered the thin-shell `index.html`; restored via PR #104. Next refresh after QFs (Jul 9-11). |
| `pdf-splitter` | unverified | live | Verify before next PR. |
| `on-track` | unverified | live | Verify before next PR. |
| `inciardi-market` | unverified | live | Verify before next PR. |
| `filemaker` | unverified | reference | FileMaker app docs, runs in FMP (no Pages). Verify before next PR. |

**Non-app infra (not launchable apps, listed so they're not mistaken for apps):** `brain-config`, `agent-reports`, `routines`, `shared`, `quickfire`, `template-app`, `polish-demo`.

---

_Rollout note: `unverified` rows carry the last value I could see without a fresh read; each gets confirmed the next time that app is touched. Confirmed rows (prism, app-dashboard, markdown-viewer, world-cup-bracket, f1-racetracks) are current as of 2026-07-10._
