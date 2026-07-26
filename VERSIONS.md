# App Ledger — THE single source of truth for every app

**One file. One row per app. Every folder in the repo root appears here or in the not-apps line.** `brain-config/app-index.md` is retired to a stub; there is no second index.

**Also the tiebreaker against stale reads and CDN lag.** When your read disagrees with this file, **re-read at HEAD and reconcile** — the gate cuts both ways (below).

## 📏 Size (target **~16KB**, ceiling **22KB** — LOCKED 2026-07-26, Michael)

**Each row is CURRENT STATE, not version history.** Per-version narrative lives in git history + the PR description + that app's own `README.md`/`next-build-spec.md`. This ledger cites the PR and stops.

- **Ceiling ~22KB** is physics: base64 inflation past the ~30KB read cap. Past it the file cannot be read whole, and **a file that cannot be read whole cannot be safely edited.**
- **Target ~16KB** = floor (~9-10KB at this row count) + real headroom. It replaces a ~12KB target that had **never once been met** since being locked — see the Floor Rule in `brain-config/hooks/source-size-budget-enforcer.md` (a stated target never met is rot, not aspiration).
- **Paid for by dropping the `Status` column** (2026-07-26), which duplicated the version cell. Status now rides in that cell.
- **Never split the table** — trim prose. Seat Size Sally before this grows.

## Procedure (MANDATORY on every app PR)

1. **Before touching, editing, PR-ing, or even DISCUSSING an app:** read this file. Compare against the version you *think* is current.
2. **Mismatch = STOP.** Re-read at an immutable commit-SHA path or the git blob API (base64-decoded). Reconcile before building.
3. **Immediately after opening a PR:** update that app's row in the same session. The ledger must never lag `main`.
4. Advisory-blocking on discussion, hard-blocking on edits.

⚠️ **The gate cuts BOTH ways.** This file is a *claim* about reality, not reality. On 2026-07-25 the `app-dashboard` row still carried a "main regressed, restore pending" warning dated **2026-07-07**; the fix had shipped the next day and the note was **32 PRs stale**. An agent nearly ran a destructive revert off it. **HEAD wins; this file gets corrected.** A warning rots exactly like a version number — verify before acting on a ⚠️, especially a stale-dated one.

**Data-separated apps carry TWO version facts:** the *shell* build (bumped on rebuilds) and the *data* date (bumped on refreshes). A data refresh does NOT bump the shell.

**Version-stamp convention:** carry a version the app itself declares (`APP_VERSION`, or the `?v=` cache-bust on its source links) — **not a PR number, not the word "live."**

**⚠️ Read-path note (verified 2026-07-25):** branch raw URLs served copies MANY versions stale (`main/inciardi-market/source/app-core.js` returned v10.1/PR #174 while `main` was on v15/PR #455) AND they flatten HTML/SVG out of template literals. Reliable: blob API base64-decoded, or `get_file_contents` at an immutable commit SHA. **Never build an edit on a branch raw read.**

---

## Ledger

Live URL pattern: `https://mawizorek.github.io/ClickUp_apps/<slug>/`. Unmarked rows are live.

| App (slug) | Version | State + live warnings (detail → PR + app README) |
| --- | --- | --- |
| `agentglass` | shell **v2** · seed 2026-07-25 · **SNAPSHOT** | PR #488. Agent Activity Board liveness feed. Hash-router shell + `pages/` + `source/`; non-executing `server/` tree. **⚠️ NOT PASSIVE YET** — reads a repo-committed seed; header pill reads `live` vs `snapshot` so it can't imply false currency. To go live: deploy `server/worker.ts`, set `LIVE_URL`, bump `?v=`. Capture is 3 labeled tiers (`tagged`/`derived`/`ambient`); derived rows are NEVER billable. **Do NOT: fence-match ClickUp comments (brace-match only — the ```json fence is markup and never reaches `text_content`); add latency percentiles (order locked by J3).** Telemetry is self-attested + derived rows inferred — not an audit trail. |
| `app-dashboard` | **v4** (`?v=72`) | PR #72/#74. Slim launcher; thin `index.html` loader over `source/*` (app/data/render/sheet/settings.js + styles/sheet/settings/retired.css). Live tree via GitHub API, health dots, 5-min cache, ClickUp/FileMaker toggle, Brain Config + Theme Studio + Groups refs, Show-retired toggle, detail sheet. **Bump `?v=` on every source change.** ⚠️ **Do NOT revert PR #59/#57** — that instruction was stale by 32 PRs; reverting destroys current work (verified at HEAD 2026-07-25, PR #485). |
| `budget-code-mapper` | unverified (last known v6, design) | Verify + stamp a real version on next touch. |
| `f1-racetracks` | shell v6.7 · data 2026-07-23c | **v7 SCREENS LOCKED 2026-07-26** (4 routes; standings folds into the router; `circuits.html` killed; live-tracker standalone but adopts the theme spine; Story Mode parked OUT of the cycle). Plan + the single authoritative Build Order live in the app README; reasoning in its ClickUp Decision Log. SCREEN lock, **not** a schema lock. **Canonical data-inside-app example:** store nests at `f1-racetracks/f1-results/<year>/`. ⚠️ Open: `fastLap` is **r9 ONLY** (1 of 9 rounds — backfill r1-8 before the weekend port), tyre strategy (design locked, backfill held), Silverstone sprint quali, flat-schema reconciliation (Suzuka/Miami/Barcelona → grid+quali), **FOUR source modules over the 15KB split line**, sprint results have no schema home. Circuits/weekend/live shells unverified. |
| `file-chunker` | unverified (last known v16.2) | Generates the `/source` chunk sets for over-cap apps. Verify on next touch. |
| `inbox-digest-report` | v6 (shell) · data Jul 17 2026 | PR #323. Gmail Inbox Sweep audit surface. **PURE RENDERER of `data/inbox-state.json`** — the sweep edits ONLY the JSON; data-only lock intact, no new JSON fields. Sticky bucket toggle + per-bucket row templates; field spec in `data/README.md`. |
| `inciardi-collection` | ⚠️ **unverified, never indexed** | Found in the repo root 2026-07-26, absent from this ledger since it was written. Has `README.md` (20.5KB) + a `db/` tree and **no `index.html`**, so probably a data/spec folder, not a Pages app — do NOT assume it is launchable. Classify (real app row vs the not-apps line) and stamp on next touch. |
| `inciardi-market` | front-end **v16** · both workers v1.4 | PR #474. Two Cloudflare workers over one D1+R2 store; **NOT data-separated** (D1 *is* the data). **🔴 OPEN SECURITY: `LOGINS` holds guessable write keys in the public bundle — rotate via `wrangler secret put`.** **Image Rendering Law** (app-core comment + README): `proxied(url,360)` is a no-op on an R2 `/img?key=` URL, so thumbs must resolve to width-capped CDN derivatives — 3rd image outage, different cause each time. Prices are DOLLARS not cents (`/100` removed). `print_id` derivation deliberately UNCHANGED (harvest never DELETEs). Known drift: `app-core.js` footer still reads `PR = 455`. |
| `markdown-viewer` | **RETIRED** | Superseded by `prism`. `status:'retired'` in app-dashboard's `data.js`, hidden behind Show-retired. README is a redirect stub. **Do not develop.** |
| `on-track` | shell **v2.4** (`?v=24`) · data 2026-07-23c | PRs #463/#468/#470. Data-separated. 2nd real theme-spine consumer: composed 4-vector theme `on-track` (`red-bull` × `racing-archivo` × `soft` × `standard`), **passive Theme picker** in settings reading `shared/themes/_themes.json` live via `THEMES.listThemes()` — add a theme there and the menu updates with zero app change. Fallback `THEME_DEFAULT='on-track'` (no white-screen on a deleted theme). `:root` = labeled first-paint FALLBACK FLOOR. **The 20 series colors are a LOCAL data layer riding on top of any theme — never sweep them into a theme vector.** Reference impl for the settings drawer + collapsible filters. Light-mode first paint flashes dark. 🐞 **Open bug (not fixed):** favicon/apple-touch/og:image/twitter:image point at `IMG_4698.png`/`IMG_4689.png` but the folder ships `icon.png`+`og.png` and the `IMG_*` files are GONE — app icon + every link preview broken. One-line fix. |
| `pdf-splitter` | unverified (last known v1) | Verify + stamp on next touch. |
| `polish-demo` | demo | Working example of the pro-polish standard. Gate code `2026`. Not a launchable app. |
| `prism` | v1 | PR #54. Data App Viewer (JSON + Markdown). Modular: index loader + `prism.css` + `prism.core/json/md.js`. Gate code `2026`. |
| `report-normalizer` | ⚠️ **unverified, never indexed** | Found in the repo root 2026-07-25, absent from BOTH former indexes. Needs a version stamp + a real row on next touch. |
| `retrocast` | ⚠️ **unverified, never indexed** | Found 2026-07-25, absent from BOTH former indexes — despite being the **FIRST theme-spine consumer** per this ledger's own rollout note. Needs a version stamp on next touch. |
| `routines` | ⚠️ no version stamp | Passive schedule viewer (dashboard-category), reads `schedule.md`. Assign a version on next touch. |
| `squash` | ⚠️ **unverified, never indexed** | Found 2026-07-25, absent from BOTH former indexes. Needs a version stamp + a real row on next touch. |
| `Vectorworks` | ⚠️ **unverified, never indexed** | Found 2026-07-25, absent from BOTH former indexes. Also the ONLY capitalized folder in a kebab-case repo — needs a naming decision alongside its stamp. |
| `world-cup-bracket` | shell v5.4 · data 2026-07-07 | PRs #76/#77. Data-separated: refreshes change only `data.json`, NO shell bump. Two-surface (data.json + ClickUp), `cuTaskId` anchor. Verified against an immutable commit-SHA path. |
| `f1-results` | ⚠️ **NOT AN APP** (tombstone) | Kept so the phantom isn't re-added: this is f1-racetracks' **nested data store** (`f1-racetracks/f1-results/<year>/`), never a root app. The old index listed it with a Pages URL that 404s. |
| `filemaker` | unverified (reference) | FileMaker app docs; runs in FMP, not on Pages. Verify on next touch. |

**Non-app infra (never PR as an app):** `brain-config`, `agent-reports`, `shared`, `quickfire`, `template-app`.

- **`template-app` — gold standard, v5 (PR #300). Access: GATED, code `0426`.** The copy/place/audit baseline: slim hash-router `index.html` + `chrome.js` (header/menu/settings drawer/footer) + `pages/` partials, all styled off the `shared/themes` spine (`var(--token)`, default `default-theme`). Carries `CONFORMANCE.md` as the audit checklist. `source/` retired; loose head/footer snippets folded into `index.html`/`chrome.js`. Candidate fold-in: the router `<script>`-execution capability from inbox-digest-report (lets a page run its own render after injection).

---

## Coverage rule

**Every folder in the repo root is either in the table above or in the not-apps line. Nothing gets to be invisible.** Four apps were found in the root tree on 2026-07-25 in NEITHER former index, and a **fifth (`inciardi-collection`) on 2026-07-26 missing from this ledger itself.** An app nobody indexes is an app nobody verifies. The rule only holds if someone re-runs it against the live root tree — assume it has drifted since.

## Changelog

- **2026-07-26 (b) — TARGET RESET TO ~16KB, `Status` COLUMN DROPPED (Michael's ruling).** The ~12KB target had never been met since it was locked; per the Floor Rule a never-met target is the defect. New target = floor + real headroom, paid for by removing the duplicate `Status` column and trimming header narrative. Ceiling stays 22KB. Escalation notice removed — resolved, not deleted; reasoning in the Enforcer's ClickUp Decision Log (Q1-A).
- **2026-07-26 (a) — `f1-racetracks` row rewritten for the v7 screen lock** (no version bump; docs-only, shell stays v6.7). **Indexed `inciardi-collection`.** Those two additions took the file 11.9KB → 13.3KB, breaking the then-current target and triggering the reset above.
- **2026-07-25 — COLLAPSED TO ONE LEDGER (Michael's call, Dev Dexter).** `app-index.md` retired to a stub; this file absorbed it. Slimmed 16.4KB → ~11KB by moving per-version narrative to git history + PR descriptions + each app's README/spec, keeping every live warning, security flag, do-not-do rule, and architecture fact. Absorbed the both-ways clause, the version-stamp convention, the coverage rule, the `f1-results` tombstone, and 4 never-indexed apps.
- Earlier history: git log + PR descriptions. Per-app history: that app's `README.md` + `next-build-spec.md`.

_`unverified` rows carry the last value visible without a fresh read; each gets confirmed the next time that app is touched. Confirmed 2026-07-25: agentglass, prism, app-dashboard, markdown-viewer, world-cup-bracket, on-track, inciardi-market. Confirmed 2026-07-26: f1-racetracks (data + shell + source module sizes, measured at HEAD)._
