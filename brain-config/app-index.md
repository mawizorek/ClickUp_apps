# App Index (canonical version tracker)

**Purpose:** one pure-text line per app: slug + current version + live state. This is the **source of truth for "what is the current version of app X right now."**

**STANDING RULE (App Index Verify Gate) — fires before ANY app work OR discussion:**

1. Before touching, editing, PR-ing, OR even talking about an app, **read this file first.**
2. Compare the entry here against the version/state you *think* is current (your cached assumption).
3. **Mismatch = STOP.** Do not edit or assert. Re-read the app from the repo at HEAD (raw-fetch the real bytes), reconcile, and only then proceed. A stale read is the exact failure this gate exists to catch.
4. **After any merged app PR, update this file in the same session** (bump the version + note). The index is only trustworthy if it's kept current the instant something ships.
5. This gate is advisory-blocking on discussion, hard-blocking on edits.

⚠️ **The gate cuts BOTH ways (added 2026-07-25).** This file is a claim about reality, not reality itself. On 2026-07-25 its `app-dashboard` row still carried a "main regressed, restore pending" warning from **2026-07-07** — the fix had shipped long before, and the note had gone **32 PRs stale**. An agent nearly ran a destructive revert off it. So: when this file and HEAD disagree, **HEAD wins and this file gets corrected** — never the reverse. Rule 3's "re-read the app at HEAD" is the tiebreaker, and a warning note is exactly as capable of rotting as a version number. Verify before you act on a ⚠️, especially a stale-dated one.

🔗 **Companion ledger: `VERSIONS.md` (repo root).** That file carries the deeper per-PR record — the data-vs-shell version split, verified/unverified marking, and full change notes. **This page is the fast roster; that file is the detail.** When the two disagree, re-read HEAD and fix BOTH. 🚩 *Flagged for Michael (2026-07-25): both files open by declaring themselves the source of truth for app versions, and the duplicate is what drifted 32 PRs. Same failure class as the roster/registry split resolved the same day. Recommend collapsing to one — structural call, not made unilaterally.*

_Why this exists: repeated regressions from editing an app off a stale/CDN-cached read instead of verifying against the true current version. The dashboard alone got hit twice._

---

## Apps

| slug | current version | live | notes |
| --- | --- | --- | --- |
| `prism` | v1 | https://mawizorek.github.io/ClickUp_apps/prism/ | Data App Viewer (JSON + Markdown). Modular: index.html loader + prism.css + prism.core/json/md.js. Access-gated (code 2026). |
| `app-dashboard` | **v4 · PR #72** (`?v=72`) | https://mawizorek.github.io/ClickUp_apps/app-dashboard/ | ✅ Verified against HEAD 2026-07-25. Modular slim launcher: thin `index.html` loader + `source/*` (app.js, data.js, render.js, sheet.js, settings.js + styles/sheet/settings/retired CSS). Live tree read via the GitHub API, per-app health dots, 5-min cache, ClickUp/FileMaker window toggle, Brain Config hub + Theme Studio + Groups refs, filter chips + Show-retired toggle, settings gear w/ light-dark, detail bottom-sheet w/ commits. **The 2026-07-07 regression is FIXED** — the old "restore via revert of PR #59 + #57" note was stale by 32 PRs and has been removed. Do NOT revert #59/#57; that would destroy current work. |
| `markdown-viewer` | RETIRED | (stub) | Superseded by `prism`. Kept as a redirect/history stub (`index.html` ~2.4KB + README + next-build-spec). Retirement verified intact 2026-07-25. (The old "reverting PR #57 temporarily un-retires" caveat is void — no revert is happening.) |
| `f1-results` | ⚠️ **NOT A ROOT APP** | (no such Pages URL) | Corrected 2026-07-25: absent from the repo root tree and from `VERSIONS.md`. `f1-results` is the **nested data store inside f1-racetracks** (`f1-racetracks/f1-results/<year>/`), which is exactly where a data store belongs. The old row listed a phantom app + a Pages URL that 404s. Row kept as a tombstone so the phantom isn't re-added. |
| `f1-racetracks` | standings shell v6.7 · data 2026-07-23c | https://mawizorek.github.io/ClickUp_apps/f1-racetracks/ | Nested data store (`f1-results/<year>/`) — the canonical data-inside-app example. Standings shell v6.7 (PR #466); data verified 2026-07-23c (PRs #461/#465). Other lenses (circuits/weekend/live) unverified. Data-layer follow-ups parked in a handoff (quali dig, fastLap, popup restructure, lens integration). |
| `file-chunker` | v16.2 | https://mawizorek.github.io/ClickUp_apps/file-chunker/ | Generates the `/source` chunk sets for over-cap apps. |
| `budget-code-mapper` | v6 (design) | https://mawizorek.github.io/ClickUp_apps/budget-code-mapper/ | |
| `pdf-splitter` | v1 | https://mawizorek.github.io/ClickUp_apps/pdf-splitter/ | |
| `world-cup-bracket` | shell v5.4 · data 2026-07-07 | https://mawizorek.github.io/ClickUp_apps/world-cup-bracket/ | Two-surface (data.json + ClickUp), cuTaskId anchor. Data-separated: refreshes change only `data.json`, no shell bump. Shell version per `VERSIONS.md`. |
| `on-track` | **v2.4** (`?v=24`) | https://mawizorek.github.io/ClickUp_apps/on-track/ | ✅ Verified against HEAD 2026-07-25. Thin shell + `shared/themes` spine + `source/{styles.css,render.js,app.js}` + data.json. Composed 4-vector theme, default `on-track` (red-bull × racing-archivo × soft × standard), **user-selectable via the settings theme picker** reading `shared/themes/_themes.json` live (PR #470). The 20 series colors stay a LOCAL data layer on top of any theme. Reference impl for the settings drawer + collapsible filters. ⚠️ **Broken asset refs:** `index.html` still points favicon/apple-touch/og:image/twitter:image at `IMG_4698.png` / `IMG_4689.png`, but the folder now ships `icon.png` + `og.png` — the rename landed, the references didn't. Social previews + app icon are broken until repointed. |
| `inciardi-market` | front-end v16 · workers v1.4 | https://mawizorek.github.io/ClickUp_apps/inciardi-market/ | Two Cloudflare workers over one D1+R2 store; NOT data-separated (D1 is the data). PR #474. 🔴 Open: `LOGINS` holds guessable write keys in the public bundle — rotate. |
| `polish-demo` | demo | https://mawizorek.github.io/ClickUp_apps/polish-demo/ | Live example of the pro-polish standard (gate code 2026). |
| `routines` | live | https://mawizorek.github.io/ClickUp_apps/routines/ | Passive schedule viewer (dashboard-category). ⚠️ No version stamp — assign one on next touch. |
| `agentglass` | shell v1 · data seed 2026-07-25 | https://mawizorek.github.io/ClickUp_apps/agentglass/ | Added to this index 2026-07-25 (was missing). Activity feed for the Agent Activity Board: hash-router `index.html` + `pages/` partials + `source/` modules, two views on one playhead. First app whose source includes a **non-executing `server/` tree** (does not run on Pages). PR #480. |
| `inbox-digest-report` | v6 (shell) · data Jul 17 2026 sweep | https://mawizorek.github.io/ClickUp_apps/inbox-digest-report/ | Added to this index 2026-07-25 (was missing). Pure renderer of `data/inbox-state.json` — the sweep edits ONLY the JSON. PR #323. |
| `retrocast` | ⚠️ unverified — **no `VERSIONS.md` row either** | (unverified) | Added to this index 2026-07-25 (was missing from BOTH indexes). Notable: the ledger's rollout note calls it the **FIRST theme-spine consumer**, yet it has no row anywhere. Needs a version stamp + a ledger row on next touch. |
| `report-normalizer` | ⚠️ unverified — **no `VERSIONS.md` row either** | (unverified) | Added to this index 2026-07-25 (was missing from BOTH indexes). Exists in the repo root. Needs a version stamp + a ledger row on next touch. |
| `squash` | ⚠️ unverified — **no `VERSIONS.md` row either** | (unverified) | Added to this index 2026-07-25 (was missing from BOTH indexes). Exists in the repo root. Needs a version stamp + a ledger row on next touch. |
| `Vectorworks` | ⚠️ unverified — **no `VERSIONS.md` row either** | (unverified) | Added to this index 2026-07-25 (was missing from BOTH indexes). Also the only **capitalized** folder in a repo where every other slug is kebab-case — needs a naming decision alongside its version stamp. |

_Not apps (never PR as apps): template-app, brain-config, agent-reports, shared, quickfire, filemaker._

---

**Maintenance:** versions marked "verify on next touch" or ⚠️ are seeded from commit history and should be confirmed against repo HEAD the next time each app is opened. Reconcile drift whenever spotted. This file is git-canonical; keep it flat and pure-text.

**Version-stamp convention:** an app's row should carry a real version the app itself declares (`APP_VERSION` in its engine, or the `?v=` cache-bust on its source links) — not a PR number and not the word "live." A PR number ages into meaninglessness; `?v=` is checkable in one read. Rows still on "live" or a PR number are flagged above.

**Coverage rule (added 2026-07-25):** every folder in the repo root is either **in this table** or in the "not apps" line. Nothing gets to be invisible. Four apps were found in the root tree but present in NEITHER this index nor `VERSIONS.md` — an app nobody indexes is an app nobody verifies.

**Changelog**

- 2026-07-25 — Second pass, same day (Dev Dexter, after a concurrent first pass). Additive only, nothing from the first pass overwritten: **added 6 apps that were missing entirely** (`agentglass`, `inbox-digest-report`, `retrocast`, `report-normalizer`, `squash`, `Vectorworks` — the last four are absent from `VERSIONS.md` too). **Corrected the `f1-results` phantom row** — it is not a root app, it is f1-racetracks' nested data store, and its listed Pages URL 404s. Filled verified versions for `f1-racetracks` / `world-cup-bracket` / `inciardi-market` from the ledger. Added the `VERSIONS.md` companion pointer + flagged the two-sources-of-truth overlap for Michael. Added the coverage rule.
- 2026-07-25 — Reconciled against HEAD by Dev Dexter. Removed the stale `app-dashboard` regression warning (fix shipped, main is v4/PR #72). Stamped `on-track` v2.4 + the theme picker. Flagged On Track's broken brand-asset references. Added the both-ways clause to the verify gate + the version-stamp convention. Flagged the four unversioned rows.
