# git-grab

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/git-grab/)

[![Launch](https://img.shields.io/badge/launch-git--grab-8f96a3?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/git-grab/)

**Status:** v0.1 — Wave 0 scaffold, **no app logic yet** · **Access:** open (public) · **Live:** https://mawizorek.github.io/ClickUp_apps/git-grab/ · **Source of truth:** this repo folder.

## What it does

Paste a **public** GitHub folder URL — a `/tree/` link, a `/blob/` link, or a commit permalink — and get back a `.zip` of that folder and everything under it, recursively. That is the whole job.

It replaces `download-directory.github.io`. Not because that tool is doing anything wrong: it is open source and almost certainly clean. The reason is narrower and it is the only justification that holds up — **an audit of a mutable origin does not bind the next deploy.** A copy on an origin Michael controls turns "trust the maintainer forever" into "read this file once."

## The correctness bar (read this before changing anything)

The only failure that matters is **a zip that is quietly missing files.** Every other failure is visible, and a visible failure in a tool you run by hand is an inconvenience. A short zip is not — you find out weeks later.

So the acceptance test is **not** "it downloaded a zip." It is:

> the count on screen == the count of entries in the zip == the count GitHub reports, **and anything excluded is named on screen.**

Two known exclusions that must be reported rather than dropped:

| Tree mode | What it is | Why naive code corrupts the zip |
|---|---|---|
| `160000` | **submodule** (gitlink) | It is a pointer to another repo. There is no blob to fetch — code either 404s or skips it in silence. |
| `120000` | **symlink** | The blob body is the link *target as text*, not the file. You get a one-line text file wearing a binary's name. |

Also non-negotiable: if the trees API returns `truncated: true`, **refuse and say so.** A partial zip with no error is strictly worse than no tool.

## Infrastructure

| File | Role | Update frequency |
|---|---|---|
| `index.html` | Slim router shell: head, access gate, `APP_*` constants, hash router. **7.6KB** | Version bumps (bump the `?v=` token on any source change) |
| `chrome.js` | Header, left nav drawer, right settings drawer + theme picker, JS-written footer stamp. **10.9KB** | Rarely — see the fork note below |
| `styles.css` | All presentation, every colour a `var(--token)`. **14.1KB** | Version bumps |
| `pages/home.html` | The tool surface | Version bumps |
| `pages/about.html` | What it does, what it touches, why it exists | Rarely |
| `config.json` | Access state (`open`/`gated`/`down`) + gate copy | Flip anytime, no version bump |
| `icon.svg` / `manifest.webmanifest` | Home-screen tile + PWA manifest | Rare |
| `zip.js` | **Wave 1 — not yet built.** ZIP container writer. No network, no DOM. | — |
| `gh.js` | **Wave 2 — not yet built.** URL parse, ref→SHA, tree listing. No DOM. | — |
| `app.js` | **Wave 3 — not yet built.** The `job` reducer + render. | — |

No `data.json`: git-grab is a pure runtime tool, not a data-separated app.

## Architecture

**Placed from `template-app` v5 (PR #300).** Slim hash-router `index.html` + `chrome.js` + `pages/` partials + `config.json`, styled off the `shared/themes` spine.

⚠️ **Fork honesty — what actually differs from the template, stated because "unforked" is a claim that rots:**

- `chrome.js` — **logic byte-identical.** Only the header comment block differs.
- `styles.css` — **template baseline plus three app-specific object blocks** (`.stepper`, `.kv`, `.mono` table/field cells) and **one comment fix**. See the defect note below. It is a fork, and calling it otherwise would be false.
- `index.html` — `APP_*` constants swapped, as intended. Everything app-specific rides in through those constants.

🐞 **Defect found in the template while copying, NOT fixed at the source:** `template-app/styles.css` has the literal characters `--gap-*/--pad-*` inside a CSS comment. The `*/` closes the comment early and leaks the rest of the sentence into the stylesheet as garbage declarations. Reworded in this copy so it parses. **The template is still wrong and that is Michael's call to fix** — per repo law, you do not edit `template-app/` to fix your own app.

### Theme

**Join: `soft-utility`** (`shared/themes/_themes.json`) — the documented default for apps copied from template-app. Colour fallback: `maw-dark-utility`. Both **borrowed, neither authored.**

🔴 **`applyTheme()` takes a JOIN slug; the `data-theme` DOM attribute takes a COLOR slug. They are not interchangeable and passing a colour to `applyTheme()` faults.** This has already bitten `inciardi-collection` and `f1-racetracks`. Note specifically that **`default-theme` is a COLOUR entity, not a join** — there is no `default-theme` row in `_themes.json`.

**Zero new theme vectors, zero new canonical objects, zero colour literals in CSS or JS.** git-grab consumes ~19 of the 42 canonical objects (`OBJECT-COVERAGE.md`) and invents none. If something looks missing mid-build, that is a design-system conversation with the steward, not an inline hex. *(Sole literal exception: `icon.svg`, which is a standalone image asset and cannot read CSS variables as a favicon.)*

## Known gaps

- **`og.png` is missing.** The head references it; drop a real 1200×630 PNG at the app root via the GitHub UI (binary files cannot be committed through the agent write path).
- **`styles.css` is 14.1KB** — over the ~12KB source target, under the 15KB split line. Watch it; it does not grow again without a split.
- Waves 1–4 are unbuilt. See `next-build-spec.md`.

## Related

- ClickUp APPS task — living spec + wave plan + Decision Log.
- `template-app/CONFORMANCE.md` — the audit checklist this app is measured against.
- `shared/themes/OBJECT-COVERAGE.md` — the 42 canonical objects.
