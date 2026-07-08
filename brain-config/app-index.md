# App Index (canonical version tracker)

**Purpose:** one pure-text line per app: slug + current version + live state. This is the **source of truth for "what is the current version of app X right now."**

**STANDING RULE (App Index Verify Gate) — fires before ANY app work OR discussion:**

1. Before touching, editing, PR-ing, OR even talking about an app, **read this file first.**
2. Compare the entry here against the version/state you *think* is current (your cached assumption).
3. **Mismatch = STOP.** Do not edit or assert. Re-read the app from the repo at HEAD (raw-fetch the real bytes), reconcile, and only then proceed. A stale read is the exact failure this gate exists to catch.
4. **After any merged app PR, update this file in the same session** (bump the version + note). The index is only trustworthy if it's kept current the instant something ships.
5. This gate is advisory-blocking on discussion, hard-blocking on edits.

_Why this exists: repeated regressions from editing an app off a stale/CDN-cached read instead of verifying against the true current version. The dashboard alone got hit twice._

---

## Apps

| slug | current version | live | notes |
| --- | --- | --- | --- |
| `prism` | v1 | https://mawizorek.github.io/ClickUp_apps/prism/ | Data App Viewer (JSON + Markdown). Modular: index.html loader + prism.css + prism.core/json/md.js. Access-gated (code 2026). |
| `app-dashboard` | **slim launcher + settings gear/theme** (last good = commit `9b4dc40`, PR #40) | https://mawizorek.github.io/ClickUp_apps/app-dashboard/ | Modular: thin index.html loader + `source/*` (app.js, data.js, render.js, sheet.js, settings.js + CSS). Per-app icons, ClickUp/FileMaker toggle, Brain Config hub, detail bottom-sheet. ⚠️ main regressed to old card v2.4 (my error 2026-07-07); restore via revert of PR #59 + #57 pending. |
| `markdown-viewer` | RETIRED | (stub) | Superseded by `prism`. Kept as redirect/history stub. (Note: reverting PR #57 temporarily un-retires; re-apply after dashboard restore.) |
| `f1-results` | PR #61 (4 commits) | https://mawizorek.github.io/ClickUp_apps/f1-results/ | Verify exact version tag on next touch. |
| `f1-racetracks` | v4 | https://mawizorek.github.io/ClickUp_apps/f1-racetracks/ | |
| `file-chunker` | v16.2 | https://mawizorek.github.io/ClickUp_apps/file-chunker/ | |
| `budget-code-mapper` | v6 (design) | https://mawizorek.github.io/ClickUp_apps/budget-code-mapper/ | |
| `pdf-splitter` | v1 | https://mawizorek.github.io/ClickUp_apps/pdf-splitter/ | |
| `world-cup-bracket` | live | https://mawizorek.github.io/ClickUp_apps/world-cup-bracket/ | Two-surface (data.json + ClickUp), cuTaskId anchor. |
| `on-track` | live | https://mawizorek.github.io/ClickUp_apps/on-track/ | Reference impl for settings drawer + collapsible filters. |
| `inciardi-market` | live | https://mawizorek.github.io/ClickUp_apps/inciardi-market/ | |
| `polish-demo` | demo | https://mawizorek.github.io/ClickUp_apps/polish-demo/ | Live example of the pro-polish standard (gate code 2026). |
| `routines` | live | https://mawizorek.github.io/ClickUp_apps/routines/ | Passive schedule viewer (dashboard-category). |

_Not apps (never PR as apps): template-app, brain-config, agent-reports, shared, quickfire._

---

**Maintenance:** versions marked "verify on next touch" are seeded from commit history / the Active Builds table and should be confirmed against repo HEAD the next time each app is opened. Reconcile drift whenever spotted. This file is git-canonical; keep it flat and pure-text.
