# git-grab

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/git-grab/)

[![Launch](https://img.shields.io/badge/launch-git--grab-8f96a3?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/git-grab/)

**Status:** **v1.2** (`?v=6`) — Waves 0-4 shipped, **verified end-to-end by Michael 2026-08-03** · **Access:** open (public) · **Live:** https://mawizorek.github.io/ClickUp_apps/git-grab/ · **Source of truth:** this repo folder.

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

## Infrastructure

| File | Role | Update frequency |
|---|---|---|
| `index.html` | Slim router shell: head, access gate, `APP_*` constants, hash router. **10.3KB** | Version bumps (bump the `?v=` token on any source change) |
| `chrome.js` | Header, left nav drawer, right settings drawer + theme picker, JS-written footer stamp. **10.9KB** | Rarely — see the fork note below |
| `styles.css` | Template baseline presentation, every colour a `var(--token)`. **14.2KB** | Version bumps |
| `app.css` | **This app's own objects only** (`.stepper`, `.kv`, `.mono` cells). **4.8KB** | Version bumps |
| `pages/home.html` | The tool surface | Version bumps |
| `pages/about.html` | What it does, what it touches, why it exists | Rarely |
| `config.json` | Access state (`open`/`gated`/`down`) + gate copy | Flip anytime, no version bump |
| `icon.svg` / `manifest.webmanifest` | Home-screen tile + PWA manifest | Rare |
| `zip.js` | ZIP container writer. CRC32, deflate-raw + stored fallback, UTF-8 flag, Zip-Slip-safe paths, `ZIP.selftest()`. **No network, no DOM, no deps. 14.1KB** | Rarely — it is the riskiest code here |
| `gh.js` | URL parse, ref → commit SHA, recursive tree listing, body fetching. **No DOM. 14.7KB** | With any GitHub-surface change |
| `app.js` | The `job` reducer + render + generation guard. **14.8KB** | Feature work |

📏 **CSS is split BY ORIGIN**, not by size: `styles.css` is the template baseline, `app.css` is what this app added. A fix that belongs upstream is visible as such.

No `data.json`: git-grab is a pure runtime tool, not a data-separated app.

## Architecture

**Placed from `template-app` v5 (PR #300).** Slim hash-router `index.html` + `chrome.js` + `pages/` partials + `config.json`, styled off the `shared/themes` spine.

⚠️ **Fork honesty — what actually differs from the template, stated because "unforked" is a claim that rots:**

- `chrome.js` — **logic byte-identical.** Only the header comment block differs.
- `styles.css` — **template baseline plus one comment fix.** App-specific objects were moved out to `app.css`. See the defect note below.
- `index.html` — `APP_*` constants swapped, as intended. Everything app-specific rides in through those constants.

🐞 **Defect found in the template while copying, NOT fixed at the source:** `template-app/styles.css` has the literal characters `--gap-*/--pad-*` inside a CSS comment. The `*/` closes the comment early and leaks the rest of the sentence into the stylesheet as garbage declarations. Reworded in this copy so it parses. **The template is still wrong and that is Michael's call to fix** — per repo law, you do not edit `template-app/` to fix your own app. Two further template defects were found from here on 08-03; all three are listed on the `template-app` line in `VERSIONS.md`.

### Theme

**Join: `soft-utility`** (`shared/themes/_themes.json`) — the documented default for apps copied from template-app. Colour fallback: `maw-dark-utility`. Both **borrowed, neither authored.**

🔴 **`applyTheme()` takes a JOIN slug; the `data-theme` DOM attribute takes a COLOR slug. They are not interchangeable and passing a colour to `applyTheme()` faults.** This has already bitten `inciardi-collection` and `f1-racetracks`, and git-grab nearly shipped it on 08-03 because its own reviewed plan named a colour. Note specifically that **`default-theme` is a COLOUR entity, not a join** — there is no `default-theme` row in `_themes.json`.

**Zero new theme vectors, zero new canonical objects, zero colour literals in CSS or JS.** git-grab consumes ~19 of the 42 canonical objects (`OBJECT-COVERAGE.md`) and invents none. If something looks missing mid-build, that is a design-system conversation with the steward, not an inline hex. *(Sole literal exception: `icon.svg`, which is a standalone image asset and cannot read CSS variables as a favicon.)*

## Known limits and gaps

- **No ZIP64.** More than 65,535 files or any single file over 4GB throws rather than corrupting.
- **No private repos.** The token seam exists in `ghFetch()` and is unused (Decision Log Q2); the gate is the v2 item in `next-build-spec.md`.
- 🔴 **The size guards are POLICY LINES FROM ARITHMETIC, NOT MEASUREMENTS** — warn 100MB, confirm 250MB, refuse above 1GB. `zip.js` allocates one contiguous buffer for the whole archive while every body and every deflated copy is still held, so peak is roughly 2.5x the folder size. Nobody has profiled it and the UI says so. Move them once somebody measures.
- **`og.png` is missing.** The head references it; drop a real 1200×630 PNG at the app root via the GitHub UI (binary files cannot be committed through the agent write path).
- **`styles.css` is 14.2KB** — over the ~12KB source target, under the 15KB split line. Watch it; it does not grow again without a split.

## Related

- ClickUp APPS task — living spec + Decision Log.
- `next-build-spec.md` — the name-transform stage (scoped, not greenlit) and the v2 private-repo gate.
- `template-app/CONFORMANCE.md` — the audit checklist this app is measured against.
- `shared/themes/OBJECT-COVERAGE.md` — the 42 canonical objects.
