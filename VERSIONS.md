# App Ledger — THE single source of truth for every app

**One file. One row per app. Every folder in the repo root appears here or in the not-apps line.** `brain-config/app-index.md` is retired to a stub; there is no second index.

**Also the tiebreaker against stale reads and CDN lag.** When your read disagrees with this file, **re-read at HEAD and reconcile** — the gate cuts both ways (below).

## 📏 Size (target **~16KB**, ceiling **22KB** — LOCKED 2026-07-26, Michael)

**Each row is CURRENT STATE, not version history.** Per-version narrative lives in git history + the PR description + that app's own `README.md`/`next-build-spec.md`. This ledger cites the PR and stops.

- **Ceiling ~22KB** is physics: base64 inflation past the ~30KB read cap. Past it the file cannot be read whole, and **a file that cannot be read whole cannot be safely edited.**
- **Target ~16KB** = floor + real headroom. It replaces a ~12KB target that had **never once been met** since being locked — see the Floor Rule in `brain-config/hooks/source-size-budget-enforcer.md` (a stated target never met is rot, not aspiration).
- **Never split the table** — trim prose. Seat Size Sally before this grows.
- ⚠️ **Every edit that adds must also trim.** The changelog is where to cut: entries older than a week keep their durable finding and lose their narrative, because git log holds the story.

## Procedure (MANDATORY on every app PR)

1. **Before touching, editing, PR-ing, or even DISCUSSING an app:** read this file. Compare against the version you *think* is current.
2. **Mismatch = STOP.** Re-read at an immutable commit-SHA path or the git blob API (base64-decoded). Reconcile before building.
3. **Immediately after opening a PR:** update that app's row in the same session. The ledger must never lag `main`.
4. Advisory-blocking on discussion, hard-blocking on edits.

⚠️ **The gate cuts BOTH ways.** This file is a *claim* about reality, not reality. On 2026-07-25 the `app-dashboard` row still carried a "main regressed, restore pending" warning dated **2026-07-07**; the fix had shipped the next day and the note was **32 PRs stale**. An agent nearly ran a destructive revert off it. **HEAD wins; this file gets corrected.** A warning rots exactly like a version number — verify before acting on a ⚠️, especially a stale-dated one.

⚠️ **An OPEN-ITEMS list rots the same way, and is more dangerous** (2026-07-28). The `f1-racetracks` row carried *"`fastLap` is r9 ONLY — backfill r1-8"* for five days after that backfill completed. **A completed job left in an open-items list is an instruction to redo it** — and redoing that one would have overwritten `{time,lap}` objects with bare strings. Verify an open item before working it, exactly as you would a warning.

⚠️ **A row can also be wrong about WHAT an app is** (2026-07-30). The `inciardi-collection` row said *"probably a data/spec folder, not a Pages app — do NOT assume it is launchable"* for four days while it was a live, deployed app being used from a phone. It was written from a directory listing read wrong, and the guess hardened into a do-not instruction. **Never write a speculative classification as a directive.**

🔴 **AND A ROW GOES STALE BY DEFAULT, NOT BY ACCIDENT — MEASURED TWICE IN 24 HOURS.** On 07-31 this file said `inciardi-collection` was on **v3** while `main` was on **v16**: fourteen versions, six of them shipped that same day. It was corrected to v17 — and then **v18 and v19 both shipped without touching it again**, by two different sessions, inside three hours. **Step 3 of the procedure above has now been skipped on roughly fifteen consecutive releases of one app.**

> ⭐ **The diagnosis is not laziness, and "try harder" will not fix it. Step 3 fires at the END of work, when the thing you came to do is already done — so it is the step with the least momentum behind it. Step 1 is the enforcement mechanism: if you READ the ledger before touching an app, a thirteen-version gap is unmissable and you fix it on the way in.** A row that is thirteen versions behind is worse than a missing row: a missing row admits it knows nothing.

**Data-separated apps carry TWO version facts:** the *shell* build (bumped on rebuilds) and the *data* date (bumped on refreshes). A data refresh does NOT bump the shell.

**Version-stamp convention:** carry a version the app itself declares (`APP_VERSION`, or the `?v=` cache-bust on its source links) — **not a PR number, not the word "live."**

**⚠️ Read-path note (verified 2026-07-25):** branch raw URLs served copies MANY versions stale AND they flatten HTML/SVG out of template literals. Reliable: blob API base64-decoded, or `get_file_contents` at an immutable commit SHA. **Never build an edit on a branch raw read.**

---

## Ledger

Live URL pattern: `https://mawizorek.github.io/ClickUp_apps/<slug>/`. Unmarked rows are live.

| App (slug) | Version | State + live warnings (detail → PR + app README) |
| --- | --- | --- |
| `agentglass` | shell **v2** · seed 2026-07-25 · **SNAPSHOT** | PR #488. Agent Activity Board liveness feed. Hash-router shell + `pages/` + `source/`; non-executing `server/` tree. **⚠️ NOT PASSIVE YET** — reads a repo-committed seed; header pill reads `live` vs `snapshot` so it can't imply false currency. To go live: deploy `server/worker.ts`, set `LIVE_URL`, bump `?v=`. Capture is 3 labeled tiers (`tagged`/`derived`/`ambient`); derived rows are NEVER billable. **Do NOT: fence-match ClickUp comments (brace-match only); add latency percentiles (order locked by J3).** Telemetry is self-attested — not an audit trail. |
| `app-dashboard` | **v4** (`?v=73`) | PR #72/#74. Slim launcher; thin `index.html` loader over `source/*`. Live tree via GitHub API, health dots, 5-min cache, ClickUp/FileMaker toggle, Show-retired toggle, detail sheet. **Bump `?v=` on every source change.** `supersededBy` in `data.js` must name another APP slug — leave it off when the replacement isn't an app, or the launcher links to a tile that doesn't exist. ⚠️ **Do NOT revert PR #59/#57** — that instruction was stale by 32 PRs; reverting destroys current work (verified at HEAD 2026-07-25, PR #485). |
| `budget-code-mapper` | unverified (last known v6, design) | Verify + stamp a real version on next touch. |
| `f1-racetracks` | shell **v6.7.1** · data 2026-07-23c · store verified `d27ce55` | PRs #572/#573/#574. **v7 SCREENS LOCKED 07-26** (4 routes) + **SCHEMA VALIDATED 07-28** (9/9 round files read). Plan + **Build Order v2** in the app README; store docs + **per-field state table** in `f1-results/2026/README.md`. **Canonical data-inside-app example.** v6.7.1 fixed a real bug: `positionsGained` ran off a **7-entry hardcoded map with two grid values that contradicted the store**, so the app was blind to every recovery drive in the season while rendering a grid Leclerc never started from — deleted, now derived from `r.grid`. ⚠️ Open: **`grid`+`qualifying` absent on r03/r04/r07** (needs SOURCED data — do not improvise), qualifying uneven in the other six, sprint arc documented-never-built, **FOUR source modules over the 15KB line**, `applyTheme('f1')` does not resolve until the join is registered, **three app version strings**. |
| `file-chunker` | unverified (last known v16.2) | Generates the `/source` chunk sets for over-cap apps. Verify on next touch. |
| `inbox-digest-report` | v6 (shell) · data Jul 17 2026 | PR #323. Gmail Inbox Sweep audit surface. **PURE RENDERER of `data/inbox-state.json`** — the sweep edits ONLY the JSON; data-only lock intact. Field spec in `data/README.md`. |
| `inciardi-collection` | **v19** (`?v=19`) · worker split, deployed · theme `soft-mercedes` · D1 live | PRs #590→#638. ⚠️ **This row said v3 on 07-31 (14 versions stale) and then missed v18 and v19 anyway — see the staleness note above. READ THIS FILE BEFORE TOUCHING THE APP.** Digital twin of the mini-print binder: binder → sheets → sides → 9 slots. **Its OWN worker + D1, separate from `inciardi-market`** (do not cross them). Thin `index.html` router + 16 JS modules + `pages/` partials. **🔴 THE WORKER IS NOW TWO FILES** (PR #637): `worker/worker.js` 19.6KB (shell + the write gate + 7 write routes) and `worker/reads.js` 13.8KB (7 GETs) — it was 29.3KB, 674 bytes under the read cap. **Split before adding any route; that debt is now paid.** Schema canonical + applied; composite FK makes a slot/edition disagreement unwriteable (22/22, PR #577). **ROUTES:** binder · summary · shoebox · enter · **`#artwork?id=`** (v19, detail — reached from a print, in no menu) · `#backroom` (unlisted). **BACK ROOM** bulk-imports a sheet from `batches/<slug>.json` — **data, never code** (`brain-config/hooks/batch-import.md`); v17 made its 3×3 arrangement **editable** after `ice-cream` imported 90° out of true past a green validator. ⚠️ **The editor writes the RUN, not the FILE** — slots are `ON CONFLICT DO UPDATE`, so an uncorrected batch file silently undoes a fixed import; commit the corrected grids back. **🔴 THE WRITE KEY SHIPS PUBLICLY, ON PURPOSE** — `core.js` → `DEFAULT_KEY` **and** `wrangler.toml` → `[vars] WRITE_KEY`, Michael's call 2026-07-30. **The pair must match; rotate both or neither.** Deploy applies the key, so **there is NO Cloudflare dashboard step**. Recovery = D1 Time Travel (30d). A mismatch is a **401 on first save, never on `/health`** — reads are unauthenticated, so a green Test connection proves nothing about writes. ⚠️ **Bare worker URLs have served 24-hour-stale reads**; add `?nocache=` to anything a decision rests on. ⚠️ Known stale: `README.md` (23KB) still claims the key is never bundled. ⚠️ **`boot.js` 17.7KB, `backroom.js` 16.5KB, `backroom.css` 16.3KB, `arrange.js` 15.8KB, `binder.css` 15.1KB all over the 15KB line** (under the 22KB ceiling; seams named in `index.html`). **Do NOT restore a read-only banner in `checkConfig()`, do NOT re-add an `ic_color` read, and do NOT reinstate the back room's number strip** — all three were structurally defeated and could only produce an invisible wrong answer. **Next scope is LOCKED in `inciardi-collection/next-build-spec.md`; every remaining step is gated on Michael or on one DDL pass.** |
| `inciardi-market` | front-end **v16** · both workers v1.4 · 🪦 **BEING RETIRED** | PR #474. Two Cloudflare workers over one D1+R2 store; **NOT data-separated** (D1 *is* the data). **Michael, 07-31: "consider that app dead."** 🔴 **DO NOT DELETE ITS D1 YET.** `print_image` holds the only R2-key → which-print mapping for the 177 images in `inciardi-images`, and `inciardi-collection` is adopting them — **export that join before any teardown** or 268MB becomes anonymous objects (spec §2, step 0). **🔴 OPEN SECURITY: `LOGINS` holds guessable write keys in the public bundle.** Distinct from the *deliberate* baked key next door: readable is an accepted tradeoff there, **guessable is a defect here** (`"mikey"`/`"nickey"` are dictionary words). **Image Rendering Law** (app-core comment + README): `proxied(url,360)` is a no-op on an R2 `/img?key=` URL. Prices are DOLLARS not cents. Known drift: `app-core.js` footer still reads `PR = 455`. |
| `markdown-viewer` | **RETIRED** | Superseded by `prism`. Hidden behind Show-retired. README is a redirect stub. **Do not develop.** |
| `on-track` | shell **v2.4** (`?v=24`) · data 2026-07-23c | PRs #463/#468/#470. Data-separated. 2nd theme-spine consumer: composed 4-vector theme, **passive Theme picker** reading `shared/themes/_themes.json` live — add a theme there and the menu updates with zero app change. **The reference implementation for a theme picker.** `:root` = labeled first-paint FALLBACK FLOOR. **The 20 series colors are a LOCAL data layer — never sweep them into a theme vector.** 🐞 **Open bug:** favicon/apple-touch/og:image point at `IMG_*.png` files that are GONE — app icon + every link preview broken. One-line fix. |
| `pdf-splitter` | unverified (last known v1) | Verify + stamp on next touch. |
| `polish-demo` | demo | Working example of the pro-polish standard. Gate code `2026`. Not a launchable app. |
| `prism` | v1 | PR #54. Data App Viewer (JSON + Markdown). Modular. Gate code `2026`. |
| `report-normalizer` | ⚠️ **unverified, never indexed** | Found 2026-07-25, absent from BOTH former indexes. Needs a version stamp + a real row on next touch. |
| `retrocast` | ⚠️ **unverified, never indexed** | Found 2026-07-25 — despite being the **FIRST theme-spine consumer** per this ledger's own rollout note. Needs a version stamp. |
| `routines` | 🗑️ **DELETED 2026-07-27 — NO LONGER AN APP** | PR #562. The folder survives as **docs only** (schedule, runbooks, `last-run/` stamps) and is listed here purely so the app is not re-added. **Do not rebuild it.** **Its lesson lives in `routines/next-build-spec.md`: the app never rotted — retiring the scheduler is what turned it into a duplicate. When a capability is retired, ask what existed only to compensate for it.** |
| `squash` | ⚠️ **unverified, never indexed** | Found 2026-07-25. Needs a version stamp + a real row. |
| `Vectorworks` | ⚠️ **unverified, never indexed** | Found 2026-07-25. Also the ONLY capitalized folder in a kebab-case repo — needs a naming decision alongside its stamp. |
| `world-cup-bracket` | shell v5.4 · data 2026-07-07 | PRs #76/#77. Data-separated: refreshes change only `data.json`, NO shell bump. **⚠️ Its refresh ROUTINE is retired (tournament ended Jul 19) — the APP is not. Still live, do not retire it.** |
| `f1-results` | ⚠️ **NOT AN APP** (tombstone) | Kept so the phantom isn't re-added: this is f1-racetracks' **nested data store**, never a root app. |
| `filemaker` | unverified (reference) | FileMaker app docs; runs in FMP, not on Pages. Verify on next touch. |

**Non-app infra (never PR as an app):** `brain-config`, `agent-reports`, `shared`, `quickfire`, `template-app`.

- **`template-app` — gold standard, v5 (PR #300). Access: GATED, code `0426`.** The copy/place/audit baseline: slim hash-router `index.html` + `chrome.js` + `pages/` partials, styled off the `shared/themes` spine. Carries `CONFORMANCE.md` as the audit checklist. Candidate fold-in: the router `<script>`-execution capability from inbox-digest-report.
- **`shared/themes` — the 4-vector theme spine.** A THEME is a JOIN in `_themes.json` binding one row each from `colors.tsv` / `typography.tsv` / `forms.tsv` / `spacing.tsv`. 🔴 **`applyTheme()` takes a JOIN slug; the `data-theme` DOM attribute takes a COLOR slug.** Passing a color to `applyTheme()` faults — the trap that bit both `inciardi-collection` and `f1-racetracks`. Since PR #502 an unresolved pointer paints a red banner instead of half-theming in silence. `themes.css` is GENERATED and was last built 2026-07-16, so it lacks blocks for `carbon` and `eos`.

---

## Coverage rule

**Every folder in the repo root is either in the table above or in the not-apps line. Nothing gets to be invisible.** Four apps were found in the root tree on 2026-07-25 in NEITHER former index, and a **fifth (`inciardi-collection`) on 2026-07-26 missing from this ledger itself.** An app nobody indexes is an app nobody verifies.

⚠️ **Coverage is necessary but not sufficient. It proves an app is LISTED, never that it is still NEEDED.** `routines` was correctly indexed, freshly versioned and actively maintained on the day it was deleted as redundant. **Every duplicate-check we own runs at creation time; none re-run when the world changes.**

⚠️ **Nor does coverage prove a row is TRUE, or CURRENT.** `f1-racetracks` was listed, versioned and hand-rewritten two days before its open-items list was found to describe work that had already shipped. `inciardi-collection` was listed on 07-26, misclassified as not-an-app in the same stroke, sat fourteen versions behind through six same-day releases, and **then missed two more the day it was corrected.** **A maintained row is not a verified row** — stamp what you checked and when.

## Changelog

- **2026-08-01 — `inciardi-collection` → v19** (PRs #637 + #638). The 29.3KB worker split (674 bytes under the read cap; three version notes had promised it) and the artwork detail route that **Q6's answer had rested on for six days without being built**. **Durable findings:** *a conditional answer whose condition is a build step needs that step written down AS a step* · *a split commit is where a quiet behavioural edit hides, so move code and change nothing else* · *a route class that needs a param belongs in neither of two lists that are both menus.* Also: this row missed v18 and v19 even after being corrected the same evening — see the staleness note, which is now the sharpest thing in this file.
- **2026-07-31 — `inciardi-collection` v3 → v17** (PRs #626/#629/#630). A batch import went into D1 90° out of true past a green validator, so the confirm screen's arrangement became editable. **Durable finding: validation proves a payload is WELL FORMED and can say nothing about whether it is TRUE — so a confirmation screen must render in the units of the physical thing (a sheet is a grid, not eighteen rows), and rendering it is only half the fix, because a screen you cannot correct is a quiz.**
- **2026-07-30 — write key baked into the public bundle**, then moved into `wrangler.toml` when the Cloudflare dashboard turned out not to list a worker that was live the whole time. **Durable findings: a dashboard list is a UI, not the truth. And giving a setting a default silently kills the check that tested for its absence** — three times to one app; a banner that cannot fire reads as an all-clear.
- **2026-07-28 — `f1-racetracks` → v6.7.1 + open-items list struck.** Durable finding: the open-items clause above, and "a maintained row is not a verified row."
- **2026-07-27 — `routines` DELETED.** Durable finding: two claimants on one truth can be created by a capability change rather than by anyone's mistake.
- **2026-07-26 — target reset to ~16KB.** A stated target never met is the defect, per the Floor Rule.
- **2026-07-25 — COLLAPSED TO ONE LEDGER** (Michael's call, Dev Dexter). `app-index.md` retired to a stub; this file absorbed it by moving per-version narrative to git history + PR descriptions + each app's README.
- Earlier history: git log + PR descriptions. Per-app history: that app's `README.md` + `next-build-spec.md`.

_`unverified` rows carry the last value visible without a fresh read; each gets confirmed the next time that app is touched. Confirmed 2026-07-25: agentglass, prism, app-dashboard, markdown-viewer, world-cup-bracket, on-track, inciardi-market. Re-confirmed 2026-07-28: f1-racetracks (all nine round files, at `d27ce55`). Confirmed 2026-08-01: inciardi-collection (full module tree + measured sizes, both worker files, live `/health` post-deploy)._
