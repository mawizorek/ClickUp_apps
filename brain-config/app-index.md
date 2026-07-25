# App Index (canonical version tracker)

**Purpose:** one pure-text line per app: slug + current version + live state. This is the **source of truth for "what is the current version of app X right now."**

**STANDING RULE (App Index Verify Gate) — fires before ANY app work OR discussion:**

1. Before touching, editing, PR-ing, OR even talking about an app, **read this file first.**
2. Compare the entry here against the version/state you *think* is current (your cached assumption).
3. **Mismatch = STOP.** Do not edit or assert. Re-read the app from the repo at HEAD (**via the git blob API — see rule 6**), reconcile, and only then proceed. A stale read is the exact failure this gate exists to catch.
4. **After any merged app PR, update this file in the same session** (bump the version + note). The index is only trustworthy if it's kept current the instant something ships.
5. This gate is advisory-blocking on discussion, hard-blocking on edits.
6. ⚠️ **VERIFY VIA THE BLOB API — NEVER `raw.githubusercontent.com` (added 2026-07-25).** Get the blob SHA from a directory listing, then read `https://api.github.com/repos/<owner>/<repo>/git/blobs/<sha>` and Base64-decode. Content-addressed = immutable = the only trustworthy read. **The raw path is cache-frozen and will hand you a months-old file while reporting success.** *(Rule 3 previously said "raw-fetch the real bytes" — that instruction was itself the trap. On 2026-07-25 a raw fetch of `app-dashboard/index.html` returned a cache-frozen **v2.3 monolith** — `APP_VERSION = 'v2.3'`, `APP_DATE = '2026-07-02'`, the pre-07-06 `EXCLUDED` list — while the blob at HEAD was the real 9,769-byte modular loader. Two files were caught lying via the raw path in a single session. The gate cannot be run on a read path that lies.)*

⚠️ **The gate cuts BOTH ways (added 2026-07-25).** This file is a claim about reality, not reality itself. On 2026-07-25 its `app-dashboard` row still carried a "main regressed, restore pending" warning from **2026-07-07** — the fix had shipped long before, and the note had gone **32 PRs stale**. An agent nearly ran a destructive revert off it. So: when this file and HEAD disagree, **HEAD wins and this file gets corrected** — never the reverse. Rule 3's "re-read the app at HEAD" is the tiebreaker, and a warning note is exactly as capable of rotting as a version number. Verify before you act on a ⚠️, especially a stale-dated one.

_Why this exists: repeated regressions from editing an app off a stale/CDN-cached read instead of verifying against the true current version. The dashboard alone got hit twice._

---

## Apps

| slug | current version | live | notes |
| --- | --- | --- | --- |
| `prism` | v1 | https://mawizorek.github.io/ClickUp_apps/prism/ | Data App Viewer (JSON + Markdown). Modular: index.html loader + prism.css + prism.core/json/md.js. Access-gated (code 2026). |
| `app-dashboard` | **v4 · PR #72** (`?v=72`) | https://mawizorek.github.io/ClickUp_apps/app-dashboard/ | ✅ Verified against HEAD 2026-07-25. Modular slim launcher: thin `index.html` loader + `source/*` (app.js, data.js, render.js, sheet.js, settings.js + styles/sheet/settings/retired CSS). Live tree read via the GitHub API, per-app health dots, 5-min cache, ClickUp/FileMaker window toggle, Brain Config hub + Theme Studio + Groups refs, filter chips + Show-retired toggle, settings gear w/ light-dark, detail bottom-sheet w/ commits. **The 2026-07-07 regression is FIXED** — the old "restore via revert of PR #59 + #57" note was stale by 32 PRs and has been removed. Do NOT revert #59/#57; that would destroy current work. |
| `markdown-viewer` | RETIRED | (stub) | Superseded by `prism`. Kept as a redirect/history stub (`index.html` ~2.4KB + README + next-build-spec). Retirement verified intact 2026-07-25. (The old "reverting PR #57 temporarily un-retires" caveat is void — no revert is happening.) |
| `f1-results` | PR #61 (4 commits) | https://mawizorek.github.io/ClickUp_apps/f1-results/ | ⚠️ Still a PR number, not a version. Verify + stamp a real version on next touch. |
| `f1-racetracks` | v4 | https://mawizorek.github.io/ClickUp_apps/f1-racetracks/ | Nested data store (`f1-results/<year>/`) — the canonical data-inside-app example. Data-layer follow-ups parked in a handoff (quali dig, fastLap, popup restructure, lens integration). |
| `file-chunker` | v16.2 | https://mawizorek.github.io/ClickUp_apps/file-chunker/ | Generates the `/source` chunk sets for over-cap apps. |
| `budget-code-mapper` | v6 (design) | https://mawizorek.github.io/ClickUp_apps/budget-code-mapper/ | |
| `pdf-splitter` | v1 | https://mawizorek.github.io/ClickUp_apps/pdf-splitter/ | |
| `world-cup-bracket` | live | https://mawizorek.github.io/ClickUp_apps/world-cup-bracket/ | Two-surface (data.json + ClickUp), cuTaskId anchor. ⚠️ No version stamp — assign one on next touch. |
| `on-track` | **v2.4** (`?v=24`) | https://mawizorek.github.io/ClickUp_apps/on-track/ | ✅ Verified against HEAD 2026-07-25. Thin shell + `shared/themes` spine + `source/{styles.css,render.js,app.js}` + data.json. Composed 4-vector theme, default `on-track` (red-bull × racing-archivo × soft × standard), **user-selectable via the settings theme picker** reading `shared/themes/_themes.json` live (PR #470). The 20 series colors stay a LOCAL data layer on top of any theme. Reference impl for the settings drawer + collapsible filters. ⚠️ **Broken asset refs:** `index.html` still points favicon/apple-touch/og:image/twitter:image at `IMG_4698.png` / `IMG_4689.png`, but the folder now ships `icon.png` + `og.png` — the rename landed, the references didn't. Social previews + app icon are broken until repointed. |
| `inciardi-market` | live | https://mawizorek.github.io/ClickUp_apps/inciardi-market/ | ⚠️ No version stamp — assign one on next touch. |
| `polish-demo` | demo | https://mawizorek.github.io/ClickUp_apps/polish-demo/ | Live example of the pro-polish standard (gate code 2026). |
| `routines` | live | https://mawizorek.github.io/ClickUp_apps/routines/ | Passive schedule viewer (dashboard-category). ⚠️ No version stamp — assign one on next touch. |

_Not apps (never PR as apps): template-app, brain-config, agent-reports, shared, quickfire._

---

**Maintenance:** versions marked "verify on next touch" or ⚠️ are seeded from commit history and should be confirmed against repo HEAD the next time each app is opened. Reconcile drift whenever spotted. This file is git-canonical; keep it flat and pure-text.

**Version-stamp convention:** an app's row should carry a real version the app itself declares (`APP_VERSION` in its engine, or the `?v=` cache-bust on its source links) — not a PR number and not the word "live." A PR number ages into meaninglessness; `?v=` is checkable in one read. Four rows are still on "live" or a PR number and are flagged above.

**Changelog**

- 2026-07-25 — Rule 3 repointed from `raw.githubusercontent.com` to the **git blob API**, and rule 6 added with the evidence. The verify gate had been instructing agents to verify via the one read path that is known to serve stale bytes; on this date the raw path returned a cache-frozen v2.3 monolith for `app-dashboard/index.html` against a real modular loader at HEAD. A verification rule that names an unreliable read path is worse than none.
- 2026-07-25 — Reconciled against HEAD by Dev Dexter. Removed the stale `app-dashboard` regression warning (fix shipped, main is v4/PR #72). Stamped `on-track` v2.4 + the theme picker. Flagged On Track's broken brand-asset references. Added the both-ways clause to the verify gate + the version-stamp convention. Flagged the four unversioned rows.
