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
| `prism` | v2.2 | live | Data App Viewer (JSON + Markdown), access `open` (public). v2.2 (PR #84): unlocked + fixed mobile pivot overflow (long single-record values clipped off-screen) + footer version/PR stamp + README Infrastructure table + og.png/icon.png icon package + `?v=4`. v2.1 (PR #80): slim mobile header + `?v=3`. v2 (PR #78): mobile export bottom-sheet + tab-delimiter fix + prism.mobile.js. v1 (PR #54): took over from Markdown Viewer (retired). |
| `app-dashboard` | v4 launcher + native Retired filter | live | Slim launcher: per-app icons, ClickUp/FileMaker toggle, Brain Config hub, detail sheet, settings gear. `index.html` = thin loader over `source/` modules. Native Retired filter (PR #72). PR #74 added `?v=` cache-busting to all source loads (browsers were serving stale app.js) and fixed the footer stamp to PR #72. **Bump the `?v=` token in index.html on every future source change.** |
| `markdown-viewer` | — | retired | Superseded by `prism`. `status:'retired'` in app-dashboard; hidden by default behind the Show-retired toggle. README is a redirect/history stub. Do not develop. |
| `file-chunker` | unverified (last known v16.2, 2026-07-01) | live | Verify against commit history before next PR. |
| `budget-code-mapper` | unverified (last known v6, design) | live | Verify before next PR. |
| `f1-racetracks` | standings lens v5.1 · circuit guide v5 · index.html router · store data 2026-07-09c | live | **Canonical results store refactor (2026-07-09):** results live ONCE in `f1-results/2026/` (per-round files + `index_rounds.json`, renamed from `index.json`). Both lenses read it: standings computes WDC/WCC live; the circuit guide derives podium/pole/FL live via `source/12_results_store.js`. **`data.json` DELETED** (orphaned + wrong Albert Park FL + three stale podiums). `index.html` is a slim router landing on the Championship Matrix, forwarding legacy `#/ ` deep links to `circuits.html`. ClickUp race task = canonical for NARRATIVE, repo store = canonical for RESULTS. **Standings lens is v5.1 (PR #109):** driver race popup surfaces qualifying + the qualified→started→finished position journey (additive, lights up only for rounds carrying the enriched data). **Quali/grid data backfill (2026-07-09, PRs #111-114, #116-117):** rounds 2-7 round files enriched with per-driver `qualifying{pos,q1,q2,q3}` + `grid` + `onRoadPos` from the CU race tasks (matched by driverId). Austria (r8) + Silverstone (r9) quali left ABSENT (no CU table, no matching-canon source). Known store gaps flagged for a separate results reconciliation: Suzuka missing Bearman+Stroll (20/22), Miami missing Gasly (21/22). **Lens integration not yet squared** (router is the seam); 2024/2025 historical backfill is a future ask this per-season structure is built to absorb. |
| `world-cup-bracket` | shell v5.6 · data 2026-07-09 (verified) | live | Data-separated app: refreshes change only `data.json` (NO shell/version bump). **v5.6 (PR #119) — 3rd-place match rendering:** added round `3P` (id 32, Sat Jul 18) to the QF+ schedule filter + a standalone "3rd Place" node under the Final in the bracket view (NOT wired into the championship tree — its teams are the SF losers). `ROUND_FULL` gained a `3P` label. **v5.5 (PR #106) — app-derived status:** the app OWNS status. `normalizeMatches` in `util.js` derives upcoming/live/done at the load boundary (scores present → ft/`aet`/`pso`; kickoff passed & within window → live; else upcoming), so `data.json` carries FACTS only (scores, `psoNote`, `aet`, ET `time`, teams, `feedsTo`, `cuTaskId`) and NO status string. **Mirror keying (PR #110):** `cuTaskId` restored on all 32 matches (data.json match ↔ ClickUp World Cup list task, the ONLY join key); Ricky runbook + ops guide locked to facts-only + team-reveal rename (PR #115). Data 2026-07-09: R16 complete, QF kickoff times populated (ET). **Session recovery context:** v1.4 (PR #103) had clobbered the thin-shell `index.html` with a monolith; restored byte-identical via PR #104 (blob `501d79a`). Next refresh after QFs (Jul 9-11). |
| `pdf-splitter` | unverified | live | Verify before next PR. |
| `on-track` | unverified | live | Verify before next PR. |
| `inciardi-market` | unverified | live | Verify before next PR. |
| `filemaker` | unverified | reference | FileMaker app docs, runs in FMP (no Pages). Verify before next PR. |

**Non-app infra (not launchable apps, listed so they're not mistaken for apps):** `brain-config`, `agent-reports`, `routines`, `shared`, `quickfire`, `template-app`, `polish-demo`.

---

_Rollout note: `unverified` rows carry the last value I could see without a fresh read; each gets confirmed and firmed up the next time that app is touched. Confirmed rows (prism, app-dashboard, markdown-viewer, world-cup-bracket, f1-racetracks) are current as of 2026-07-09._
