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
| `inciardi-market` | unverified | live | Verify before next PR. |
| `inbox-digest-report` | v4 (shell) · data: Jul 17 2026 sweep | live | Data-audit surface for the Gmail Inbox Sweep. **v4 (PR #321): app is now a PURE RENDERER of `data/inbox-state.json`. A sweep refresh edits ONLY that JSON — never the renderer/index/CSS.** `pages/report.html` fetches the JSON + builds the five buckets (graceful empty/parse-error), zero hardcoded email data + a loud no-hardcode header comment. New `data/inbox-state.json` (rolling sweep state, seeded Jul 17 8-thread sweep). New `data/README.md` = standalone FIELD SPEC (every field, bucket enum, `state`→pill map, locked `in:inbox` slop-query format) — read-before-edit. `index.html` router now re-executes page `<script>` tags after innerHTML inject (generic shell capability; should fold back to `template-app`); shell v3.2→v4. Hook `gmail-inbox-sweep.md` gained THE SWEEP OUTPUT IS ONE FILE protocol (JSON is the sole artifact). Matrix page + matrix CSS UNTOUCHED. **v3.2 (PR #319): spreadsheet-dashboard skin, mobile-primary** (titled grid blocks, sharp corners, connected gridlines, fixed mobile wrap via `table-layout:fixed`; `REPORT ADDITIONS` CSS block; styles.css `?v=3`). **v3.1 (PR #318): slop clear scoped to `in:inbox`** (a bare `from:()` searched ALL mail, surfaced archived + ACCOUNTS keepers + a receipt). **v3 (PR #316): added `pages/report.html` as the LANDING page** (five buckets, inline gmail_url + task links, grouped slop + one-click clear, scoreboard, two-phase PLAN/EXECUTE pill; `DEFAULT_PAGE` matrix→report, NAV = Report + Field Matrix + About). **v2 (PR #312): rebuilt from gold-standard `template-app`** (real chrome + `styles.css` + `pages/`; `matrix.html` field-capture grid; `about.html`). v1 (PR #311) improvised shell, superseded. |
| `filemaker` | unverified | reference | FileMaker app docs, runs in FMP (no Pages). Verify before next PR. |

**Non-app infra (not launchable apps, listed so they're not mistaken for apps):** `brain-config`, `agent-reports`, `routines`, `shared`, `quickfire`, `template-app`, `polish-demo`.

- `template-app` — **gold standard, v5 (PR #300, 2026-07-16). Access: GATED (code 0426).** The copy/place/audit baseline: slim hash-router `index.html` shell + `chrome.js` (header/menu/settings drawer/footer) + `pages/` partials, all styled off the `shared/themes` spine (`var(--token)`, default `default-theme`). Carries `CONFORMANCE.md` as the audit checklist. **Candidate fold-in: the v4 router `<script>`-execution capability from inbox-digest-report (lets a page run its own render after injection).** v1 (PR #285) initial rebuild; v2 (PR #288) left slide-in nav drawer + themed theme-picker popup + resilient theme load; v3 (PR #293) inline-expanding picker (fixed clipped menu); v4 (PR #299) killed saved-theme FOUC (early `data-theme` in head) + drawer focus management; v5 (PR #300) re-gated to 0426 + friction-free gate input (visible numeric field, autofocus/select on render, code shown as placeholder). Local assets loaded with `?v=` cache-bust. `source/` retired; loose head/footer snippets folded into `index.html` / `chrome.js` (Apps/HTML Artifacts doc pointer updated to match, same PR-era).

---

_Rollout note: `unverified` rows carry the last value I could see without a fresh read; each gets confirmed and firmed up the next time that app is touched. Confirmed rows (prism, app-dashboard, markdown-viewer, world-cup-bracket) are current as of 2026-07-07._
