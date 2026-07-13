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
| `f1-racetracks` | v8 (verified) | live | Unified single-app shell (`index.html` = REAL app: one persistent chrome + ONE hash router `source/app-shell.js`; each lens an isolated always-warm cross-faded surface, no reload). `#matrix`/`#history` → standings surface; `#circuits`/`#circuits/ ` → circuits surface; shell ADOPTS each lens on load (chrome-hiding CSS + inner-hash drive), zero edits to the 24 lens modules, both still work standalone. **v8 (PR #177): circuits home cards reworked to a database/table-row feel (`.rcard`/`.rc-*`: leading mono Rxx + status dot, hairline dividers, tabular date, no side-stripe) and the Jump-to-circuit ` ` replaced by a styled right-side drawer (scrim + filter + full round list) — all self-contained in `source/09`, scoped `.rcard`/`.jump-*`; old `.race`/`.status-stripe` rules in 02css now dead (cleanup pending). `circuits.html` cache token → 20260713d.** Prior: v6.3 hue-268 cohesion, v6.4 matrix density, v6.5 cross-lens View Transitions, v7 unified shell. Verified via git blob API. History-as-feed = next pass (history.js). |
| `world-cup-bracket` | shell v5.4 · data 2026-07-07 (verified) | live | Data-separated app: refreshes change only `data.json` (NO shell/version bump). Shell = v5.4 (last known; footer reads `v5.4 · direct`). Data 2026-07-07: R16 complete (8/8), QF slate seeded, lower-half `feedsTo` wiring fix. PR #76, merge SHA `1b50113`; ledger stamps PR #77. Verified against immutable commit-SHA path. Next refresh after QFs (Jul 9-11). |
| `pdf-splitter` | unverified | live | Verify before next PR. |
| `on-track` | shell v2.0 · data 2026-07-08 (verified) | live | Data-separated app (engine `source/{render,app}.js` + `styles.css`; data `data.json`). **v2.0 (PR #179): soft TBD event support** — date-known / time-TBD events (`{ "date":"YYYY-MM-DD", "timeTBD":true }`, no `start`/`end`) render as honest “TBD” schedule rows, are grouped by authored date via new `groupKey()`, and are kept out of all live/next/countdown logic via a `_tbd` flag; no placeholder hour invented. Engine-only edit to `source/render.js` (styling reused, no `styles.css` change). **Reconciled a stale row:** source was already at v1.9 (settings popover + retired footer export via `cleanupFooter`) while the spec/ledger still read v1.8 / unverified. Verified via git blob API. |
| `inciardi-market` | app v10 · worker v1.0 (2026-07-13) | live | Ground-up relational rebuild, PR #170. D1 (catalog + catalog_alias + print_image + inventory + market/print/gone points) + R2 image store (`IMAGES` bucket `inciardi-images`) + KV snapshot. Four surfaces: terminal / catalog / collection / market (market inherits shell next pass). Worker v1.0 API: reads /market /catalog /inventory /history /img; gated writes /catalog, /catalog/image(+/scrub +/state), /inventory. Full image lifecycle (upload/scrub-store/primary/archive/restore/multi). Dedupe-on-add. Prior /img proxy fix PR #168; spec PR #169. **Deploy delta: create R2 bucket + apply db/schema.sql (see README).** |
| `filemaker` | unverified | reference | FileMaker app docs, runs in FMP (no Pages). Verify before next PR. |

**Non-app infra (not launchable apps, listed so they're not mistaken for apps):** `brain-config`, `agent-reports`, `routines`, `shared`, `quickfire`, `template-app`, `polish-demo`.

---

_Rollout note: `unverified` rows carry the last value I could see without a fresh read; each gets confirmed and firmed up the next time that app is touched. Confirmed rows (prism, app-dashboard, markdown-viewer, world-cup-bracket, inciardi-market, f1-racetracks, on-track) are current as of 2026-07-13._
