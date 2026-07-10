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
| `f1-racetracks` | standings lens v5.3 · circuit guide v5.5 · index.html router · store data 2026-07-09c | live | **Canonical results store refactor (2026-07-09):** results live ONCE in `f1-results/2026/` (per-round files + `index_rounds.json`, renamed from `index.json`). Both lenses read it: standings computes WDC/WCC live; the circuit guide derives podium/pole/FL live via `source/12_results_store.js`. **`data.json` DELETED**. `index.html` is a slim router landing on the Championship Matrix, forwarding legacy `#/ ` deep links to `circuits.html`. ClickUp race task = canonical for NARRATIVE, repo store = canonical for RESULTS. **Circuit guide v5.5 (PR #138) — ALL 24 breakdowns built:** the final 7 stubs authored (Singapore/marina-bay r18, COTA r19, Mexico r20, Interlagos r21, Las Vegas r22, Qatar/losail r23, Abu Dhabi/yas-marina r24), all research-grounded, all `report:true`. NO Soon tags remain. **Module split (size discipline):** filling every round pushed module 08 past ~36KB (over the 30KB write/read cap), so track data is now THREE files at clean seams: `08_track_data_rounds_14_24.js` = rounds 14-17 (array name kept `TRACK_DATA_ROUNDS_14_24`, ~20KB); `08b_track_data_rounds_18_24.js` = rounds 18-21 (`TRACK_DATA_ROUNDS_18_21`, ~21KB); `08c_track_data_rounds_22_24.js` = rounds 22-24 (`TRACK_DATA_ROUNDS_22_24`, ~15KB). Boot in source/09 concats all globals; circuits.html loads 08b+08c; cache-bust 20260710f; footer/APP_VERSION v5.5. **NOTE:** map plates for the 7 new circuits use Wikimedia `*.svg` filename guesses — eyeball live, swap to correct `Special:FilePath` names if any show the placeholder. **Baku r17 built (PR #135).** **Circuit guide v5.4 (PR #132):** inline statuses reconciled to store meta (Silverstone r11 done, Spa r12 active); carousel steps one round per chevron. **v5.3 (PR #131):** header carousel (two tiles + chevrons). **v5.2 (PR #129):** quick-access cards (superseded). **v5.1 (PR #127):** restore (boot assembles inline TRACK_DATA globals; `data.json` fetch was dead) + results binding fix + compact index CSS (03d). **Standings lens v5.3 (PR #125):** unbroken quali→start→finish journey + two-column detail strip. Superseded v5.2 (PR #124). **v5.1 standings (PR #109).** **Quali/grid backfill (PRs #111-114, #116-117):** rounds 2-7. Known store gaps for separate reconciliation: Suzuka missing Bearman+Stroll (20/22), Miami missing Gasly (21/22). Open threads: per-driver `fastLap` still null + per-driver tyre strategy not yet a store field; lens integration not squared; 2024/2025 historical backfill is a future ask. |
| `world-cup-bracket` | shell v5.7 · data 2026-07-09 (verified) | live | Data-separated app: refreshes change only `data.json` (NO shell/version bump). **v5.7 (PR #122) — local-timezone kickoff:** `localKickoff` in `util.js`; data `time` stays ET-clock. **v5.6 (PR #119) — 3rd-place rendering:** round `3P` (id 32, Sat Jul 18). **v5.5 (PR #106) — app-derived status:** `normalizeMatches` derives upcoming/live/done at load; `data.json` FACTS only + `cuTaskId`. **Mirror keying (PR #110).** **Session recovery:** v1.4 (PR #103) clobbered thin-shell index.html; restored via PR #104. Next refresh after QFs (Jul 9-11). |
| `pdf-splitter` | unverified | live | Verify before next PR. |
| `on-track` | unverified | live | Verify before next PR. |
| `inciardi-market` | unverified | live | Verify before next PR. |
| `filemaker` | unverified | reference | FileMaker app docs, runs in FMP (no Pages). Verify before next PR. |

**Non-app infra (not launchable apps, listed so they're not mistaken for apps):** `brain-config`, `agent-reports`, `routines`, `shared`, `quickfire`, `template-app`, `polish-demo`.

---

_Rollout note: `unverified` rows carry the last value I could see without a fresh read; each gets confirmed the next time that app is touched. Confirmed rows (prism, app-dashboard, markdown-viewer, world-cup-bracket, f1-racetracks) are current as of 2026-07-10._
