# App Version Ledger

**This file is the tiebreaker against stale reads and CDN/cache lag.** Agents read source through paths that can silently serve an old copy. This ledger is the one hand-maintained record of what version each app is actually on. When your read disagrees with this file, assume YOUR READ IS STALE and reconcile before touching anything.

## Procedure (MANDATORY on every app PR)

1. **Before opening a PR:** find the app's row below. Confirm the version/state you believe is current matches this ledger. If they disagree, STOP: re-read the real source (immutable commit-SHA path, or the git blob API which returns base64 and does NOT flatten HTML, not a plain branch URL) and reconcile. Do not build on a mismatch.
2. **Immediately after opening the PR:** update this app's row in the same session, bump the version, add the PR link, update the date. The ledger must never lag behind `main`.
3. This is a two-sided check: step 1 catches a stale read going in, step 2 keeps the ledger honest coming out.

Git commit history remains the authoritative changelog; this ledger is the fast human/agent-readable "where are we now" index that history alone doesn't surface at a glance.

**Data-separated apps carry TWO version facts:** the app *shell* build (HTML/JS/CSS, bumped on rebuilds) and the *data* date (bumped on refreshes). Record both so a stale read on either surface is catchable. A daily data refresh does NOT bump the shell version.

## Ledger

| App (slug) | Current version | Status | Last PR / notes |
| --- | --- | --- | --- |
| `prism` | v2.2 | live | Data App Viewer (JSON + Markdown), access `open` (public). v2.2 (PR #84): unlocked + mobile pivot overflow fix + footer stamp + icon package + `?v=4`. v2.1 (PR #80). v2 (PR #78). v1 (PR #54). |
| `app-dashboard` | v4 launcher + native Retired filter | live | Slim launcher over `source/` modules. Native Retired filter (PR #72). PR #74 added `?v=` cache-busting. Bump the `?v=` token on every future source change. |
| `markdown-viewer` | — | retired | Superseded by `prism`. Do not develop. |
| `file-chunker` | unverified (last known v16.2, 2026-07-01) | live | Verify against commit history before next PR. |
| `budget-code-mapper` | unverified (last known v6, design) | live | Verify before next PR. |
| `f1-racetracks` | standings lens v5.3 · circuit guide v6 · index.html router · results store 2026-07-09c | live | **Canonical results store (2026-07-09):** results live ONCE in `f1-results/2026/` (per-round files + `index_rounds.json`). Standings computes WDC/WCC live; circuit guide derives podium/pole/FL live via `source/12_results_store.js`. `data.json` DELETED. `index.html` = slim router landing on the Championship Matrix, forwarding legacy `#/ ` to `circuits.html`. **Circuit guide v6 (PR #144) — PER-CIRCUIT DATA LAYER:** track data refactored to one file per circuit, `f1-racetracks/circuits/<slug>.json` (22 files) + thin `circuits/index_circuits.json` (order + file pointer + join-by-slug). `source/09` boot fetches the index then each circuit file (Promise.all, **soft-fails per file** so one bad file can't break the guide), mirroring the f1-results per-round store. **Retired + DELETED the six inline `TRACK_DATA_ROUNDS_*` modules (05,06,07,08,08b,08c)** — the reactive 08/08b/08c byte-seam split is gone. Routed through the Council (Fold-in Frank FOLD-IN to existing per-round pattern; Size Sally forecast; Eco Enzo no-orphans; Scope Skye data-layer-only). Circuit-guide round numbers join the results store BY SLUG (Silverstone r11 here vs r9 in store). **FLAGGED, not changed:** rounds 4-5 unused in circuit-guide numbering (22 circuits, pre-existing quirk, noted in index_circuits.json) — data-content question for a separate pass. Map plates for the 7 newest circuits still use best-guess Wikimedia filenames. **Prior circuit-guide history:** v5.5 (PR #138, all 24 breakdowns built, now superseded by the per-file layout), v5.4 (PR #132, status reconcile + single-step carousel), v5.3 (PR #131, header carousel), v5.2 (PR #129, quick-access cards, superseded), v5.1 (PR #127, boot restore + results-binding fix + compact index 03d), Baku r17 (PR #135). **Standings lens v5.3 (PR #125):** unbroken quali→start→finish journey + two-column detail strip (superseded v5.2 PR #124). Quali/grid backfill rounds 2-7 (PRs #111-117). Known results-store gaps for separate reconciliation: Suzuka missing Bearman+Stroll (20/22), Miami missing Gasly (21/22). Open: per-driver fastLap null + per-driver tyre strategy not yet a store field; lens integration not squared; 2024/2025 historical backfill future. |
| `world-cup-bracket` | shell v5.7 · data 2026-07-09 (verified) | live | Data-separated app: refreshes change only `data.json`. **v5.7 (PR #122):** local-timezone kickoff. **v5.6 (PR #119):** 3rd-place node. **v5.5 (PR #106):** app-derived status; `data.json` FACTS only + `cuTaskId`. **Mirror keying (PR #110).** Next refresh after QFs. |
| `pdf-splitter` | unverified | live | Verify before next PR. |
| `on-track` | unverified | live | Verify before next PR. |
| `inciardi-market` | unverified | live | Verify before next PR. |
| `filemaker` | unverified | reference | FileMaker app docs, runs in FMP (no Pages). Verify before next PR. |

**Non-app infra (not launchable apps):** `brain-config`, `agent-reports`, `routines`, `shared`, `quickfire`, `template-app`, `polish-demo`.

---

_Rollout note: `unverified` rows carry the last value seen without a fresh read; each gets confirmed the next time that app is touched. Confirmed rows (prism, app-dashboard, markdown-viewer, world-cup-bracket, f1-racetracks) current as of 2026-07-10._
