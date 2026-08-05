# git-grab

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/git-grab/)

[![Launch](https://img.shields.io/badge/launch-git--grab-8f96a3?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/git-grab/)

**Status:** **v1.3** (`?v=7`) — PR #745 · **Access:** open (public) · **Live:** https://mawizorek.github.io/ClickUp_apps/git-grab/ · **Source of truth:** this repo folder.

⚠️ **This status line said "v0.1 — Wave 0 scaffold, no app logic yet" until 2026-08-04, nine PRs after the app shipped and worked.** `next-build-spec.md` carried the same rot. The ledger row in `VERSIONS.md` was right the whole time. If those two ever disagree again, the ledger wins and this file gets corrected.

## What it does

Paste a **public** GitHub folder URL — a `/tree/` link, a `/blob/` link, or a commit permalink — and get back a `.zip` of that folder and everything under it, recursively. That is the whole job.

It replaces `download-directory.github.io`. Not because that tool is doing anything wrong: it is open source and almost certainly clean. The reason is narrower and it is the only justification that holds up — **an audit of a mutable origin does not bind the next deploy.** A copy on an origin Michael controls turns "trust the maintainer forever" into "read this file once."

## The correctness bar (read this before changing anything)

The only failure that matters is **a zip that is quietly missing files.** Every other failure is visible, and a visible failure in a tool you run by hand is an inconvenience. A short zip is not — you find out weeks later.

So the acceptance test is **not** "it downloaded a zip." It is:

> the count on screen == the count of entries in the zip == the count GitHub reports, **and anything excluded is named on screen.**

The count is asserted **twice**: `gh.js` checks fetched blobs against the listing, and `app.js` checks zip entries against the pinned listing *before* the download link is offered. Both numbers print in the done panel.

Two known exclusions that must be reported rather than dropped:

| Tree mode | What it is | Why naive code corrupts the zip |
|---|---|---|
| `160000` | **submodule** (gitlink) | It is a pointer to another repo. There is no blob to fetch — code either 404s or skips it in silence. |
| `120000` | **symlink** | The blob body is the link *target as text*, not the file. You get a one-line text file wearing a binary's name. |

Also non-negotiable: if the trees API returns `truncated: true`, **refuse and say so.** A partial zip with no error is strictly worse than no tool.

🔴 **The generation counter in `app.js` (v1.2) is load-bearing — do not remove it.** The URL field's Enter key had no busy check, so a second job could start mid-fetch and the count assertion would end up comparing one folder's zip against another folder's listing. Every async continuation captures `gen` and bails if superseded; `grab()` pins its listing in a local.

## Renaming on export (v1.3)

Two optional transforms, both **off by default**, both previewed in the file table before anything downloads.

| Toggle | Does | Example |
|---|---|---|
| Convert markdown to `.txt` | `.md` / `.markdown` → `.txt` | `notes.md` → `notes.txt` |
| Rename index files | `index.md` → `<parent-folder>_index.md` | `docs/index.md` → `docs/docs_index.md` |

Both together, in that order: `docs/index.md` → `docs/docs_index.txt`. The order is fixed, because running the extension rewrite first would force the index rule to recognise `index.txt` — a different file that might legitimately be sitting in the folder.

**Why `.txt` at all:** markdown has no guaranteed handler. On a machine without a markdown editor a double-click is a coin flip. `.txt` opens the same way everywhere, nothing is protected by the change (the source is public and the formatting is already stripped), and renaming one back to `.md` restores the rendering in two seconds.

🔴 **MARKDOWN ONLY, AND THAT IS A SAFETY RULE RATHER THAN A SCOPE PREFERENCE.** `index.html` is the directory default — rename it and an extracted site folder stops loading. `index.js` is worse: module resolution finds `foo/index.js` for `require("./foo")`, so the rename silently breaks the import graph of whatever you grabbed to read. Same shape as `__init__.py`. The rename is a documents convenience and it is **destructive on code**. Both regexes in `names.js` are anchored to markdown extensions and must stay that way.

🔴 **A COLLISION SKIPS ONE RENAME. IT NEVER DROPS A FILE.** If `notes.md` would become `notes.txt` and `notes.txt` is already in the folder, that one file keeps its name, says so in the table, and **both ship in the zip**. This is what keeps the whole feature clear of the correctness bar: a rename changes what an entry is CALLED and never whether it EXISTS, so neither count assertion can be moved by it. The planner runs in two rounds — files that are not moving reserve their names first, then movers claim in listing order.

**Control surface:** a master toggle for each transform, plus a tick on each markdown row in the file table. A row tick beats the masters for that file. Flipping a master **clears** the individual choices, because a row whose state has an invisible origin is worse than one that resets. Per-file ticks stop at the 300-row render cap; rows past it follow the masters and the table says so.

**Toggling never touches the network.** Every plan is recomputed from `f.rel` — the original name, never written to — so it is idempotent and off→on is byte-identical. The unauthenticated API budget is 60 calls an hour and a checkbox that re-listed the tree would spend it on nothing.

## Infrastructure

| File | Role | Update frequency |
|---|---|---|
| `index.html` | Slim router shell: head, access gate, `APP_*` constants, hash router | Version bumps (bump the `?v=` token on any source change) |
| `chrome.js` | Header, left nav drawer, right settings drawer + theme picker, JS-written footer stamp | Rarely — see the fork note below |
| `styles.css` | Template baseline presentation, every colour a `var(--token)` | Version bumps |
| `app.css` | **This app's own objects only** (`.stepper`, `.kv`, `.namebox`, `.out`, mono cells) | Version bumps |
| `pages/home.html` | The tool surface | Version bumps |
| `pages/about.html` | What it does, what it touches, why it exists | Rarely |
| `config.json` | Access state (`open`/`gated`/`down`) + gate copy | Flip anytime, no version bump |
| `icon.svg` / `manifest.webmanifest` | Home-screen tile + PWA manifest | Rare |
| `zip.js` | ZIP container writer. CRC32, deflate-raw + stored fallback, UTF-8 flag, Zip-Slip-safe paths, `ZIP.selftest()`. **No network, no DOM, no deps** | Rarely — it is the riskiest code here |
| `gh.js` | URL parse, ref → commit SHA, recursive tree listing, body fetching. **No DOM** | With any GitHub-surface change |
| `names.js` | Export-name transforms + the collision planner + `NAMES.selftest()`. **No network, no DOM, no imports** | With any rename rule change |
| `view.js` | Every rendered string. **No state, no network, no listeners** | Feature work |
| `app.js` | The `job` reducer, the stages, the generation guard, the listeners | Feature work |

⚠️ **Byte counts are deliberately not in this table.** Every hand-maintained size in this repo has gone stale; read them off a directory listing at HEAD. The rule that matters: **each JS module stays under the 15KB split line**, and `view.js` exists because `app.js` was 14,841 B and about to cross it.

📏 **CSS is split BY ORIGIN**, not by size: `styles.css` is the template baseline, `app.css` is what this app added. A fix that belongs upstream is visible as such.

**JS is split BY LANE:** container / network / naming / markup / state. Nothing reaches across — `names.js` and `view.js` know nothing about `fetch`, and `gh.js` and `zip.js` know nothing about the DOM.

No `data.json`: git-grab is a pure runtime tool, not a data-separated app.

## Three names per file, and they must not be confused

| Field | Is | Read by |
|---|---|---|
| `f.path` | the true path in the repo | `rawURL()` — fetching, and only fetching |
| `f.rel` | the original name relative to the grabbed folder. **Never written to** | every plan, every count |
| `f.out` | what the zip entry is called | `ZIP.build()` — packing, and only packing |

Fetch by `path`, pack by `out`. Those are different strings the moment a toggle is on, and swapping them is the one edit that turns this feature into a 404 storm.

## Architecture

**Placed from `template-app` v5 (PR #300).** Slim hash-router `index.html` + `chrome.js` + `pages/` partials + `config.json`, styled off the `shared/themes` spine.

⚠️ **Fork honesty — what actually differs from the template, stated because "unforked" is a claim that rots:**

- `chrome.js` — **logic byte-identical.** Only the header comment block differs.
- `styles.css` — **template baseline plus one comment fix.** App-specific objects were moved out to `app.css`. See the defect note below.
- `index.html` — `APP_*` constants swapped, as intended, plus the extra `<script>` lines for this app's modules.

🐞 **Defect found in the template while copying, NOT fixed at the source:** `template-app/styles.css` has the literal characters `--gap-*/--pad-*` inside a CSS comment. The `*/` closes the comment early and leaks the rest of the sentence into the stylesheet as garbage declarations. Reworded in this copy so it parses. **The template is still wrong and that is Michael's call to fix** — per repo law, you do not edit `template-app/` to fix your own app. Two further template defects were found from here on 08-03; all three are listed on the `template-app` line in `VERSIONS.md`.

### Theme

**Join: `soft-utility`** (`shared/themes/_themes.json`) — the documented default for apps copied from template-app. Colour fallback: `maw-dark-utility`. Both **borrowed, neither authored.**

🔴 **`applyTheme()` takes a JOIN slug; the `data-theme` DOM attribute takes a COLOR slug. They are not interchangeable and passing a colour to `applyTheme()` faults.** This has already bitten `inciardi-collection` and `f1-racetracks`, and git-grab nearly shipped it on 08-03 because its own reviewed plan named a colour. Note specifically that **`default-theme` is a COLOUR entity, not a join** — there is no `default-theme` row in `_themes.json`.

**Zero new theme vectors, zero new canonical objects, zero colour literals in CSS or JS.** git-grab consumes ~19 of the 42 canonical objects (`OBJECT-COVERAGE.md`) and invents none — the v1.3 rename controls are built out of the card, checkbox and muted-text objects already here rather than a new one. *(Sole literal exception: `icon.svg`, which is a standalone image asset and cannot read CSS variables as a favicon.)*

## Self test

The **Self test** page runs both suites on one button: `NAMES.selftest()` (synchronous, pure, all six rename acceptance criteria) and `ZIP.selftest()` (builds a real archive and parses it back out).

⚠️ **They are not equally conclusive, and the page says so.** The name checks are the whole truth about renaming. The zip checks prove the container round-trips through its own reader — **nothing running in a tab can prove macOS Archive Utility or Windows Explorer accepts the file.** Download the sample and double-click it.

## Known limits and gaps

- **No ZIP64.** More than 65,535 files or any single file over 4GB throws rather than corrupting.
- **No private repos.** The token seam exists in `ghFetch()` and is unused (Decision Log Q2); the gate is the v2 item in `next-build-spec.md`.
- 🔴 **The size guards are POLICY LINES FROM ARITHMETIC, NOT MEASUREMENTS** — warn 100MB, confirm 250MB, refuse above 1GB. `zip.js` allocates one contiguous buffer for the whole archive while every body and every deflated copy is still held, so peak is roughly 2.5x the folder size. Nobody has profiled it and the UI says so. Move them once somebody measures.
- **`og.png` is missing.** The head references it; drop a real 1200×630 PNG at the app root via the GitHub UI (binary files cannot be committed through the agent write path).

## Related

- ClickUp APPS task — living spec + Decision Log.
- `next-build-spec.md` — the v2 private-repo gate, the refusals, and what shipped.
- `template-app/CONFORMANCE.md` — the audit checklist this app is measured against.
- `shared/themes/OBJECT-COVERAGE.md` — the 42 canonical objects.
