# Prism

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/prism/)

[![Launch](https://img.shields.io/badge/launch-prism-e8b84b?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/prism/)

**Status:** live (v2.2) · **Access:** open (public) · **Live:** https://mawizorek.github.io/ClickUp_apps/prism/ · **Source of truth:** this repo folder.

## What it does

Prism is a **Data App Viewer**: one shell, multiple lenses. Drop a file, Prism detects its type and shows the right view. No upload, everything runs in the browser.

- **JSON lens** — turns a JSON file into a human-readable table with **Table / Tree / Raw** views, structure stats, and a flag panel that warns about irregular schemas, mixed types, numbers-stored-as-strings, deep nesting, and sparse data. Exports to **CSV** and **Excel** (`.xls`).
- **Markdown lens** — renders `.md` clean (headings, lists, tables, code, quotes) with a **Rendered / Raw** toggle and HTML export. This folds in the former standalone Markdown Viewer.

## How to use it

1. Open the app and drop a `.json` or `.md` file onto the page (or click **Choose a file**). No file handy? Use the built-in samples.
2. **JSON:** it lands on **Split by table** with the largest data table shown; each nested array becomes its own sheet tab. A single-record sheet auto-**pivots** to a Field/Value layout for readability (still exports as one row). Toggle **Split by table** off for one flat sheet, or **Show nulls** to blank empty cells.
3. Export via **CSV** or **Excel**. CSV delimiter (comma/tab) lives in the Settings gear, alongside the light/dark theme toggle.

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | Slim entrypoint: head/polish, access gate, chrome markup, footer stamp, loads the bundle | Version bumps (bump the `?v=` token on any source change) |
| `prism.css` | All styling (dark + light themes, responsive/mobile chrome, pivot layout) | Version bumps |
| `prism.core.js` | State, helpers, file-type detection, lens routing, app chrome (drop, settings drawer, theme). Loads LAST | Version bumps |
| `prism.json.js` | `window.JSONLens`: flatten, sheet detection, analysis/flags, table+tree+raw render, CSV/Excel export | Version bumps |
| `prism.md.js` | `window.MDLens`: markdown parse + render + HTML export | Version bumps |
| `prism.mobile.js` | Mobile-only chrome: export bottom-sheet + tab-delimiter normalize (injects its own styles) | Version bumps |
| `config.json` | Access state (`open`/`gated`/`down`) + gate copy | Flip anytime (no version bump) |
| `icon.svg` / `icon.png` / `og.png` | Favicon (SVG), home-screen tile (PNG), social unfurl (PNG) | Rare |

No `data.json`: Prism is a pure runtime tool (processes user-dropped files), not a data-separated app. Any update is a version bump to the relevant module.

## Architecture (critical notes)

- **Modular by design.** Slim `index.html` entrypoint loads `prism.css` + four JS modules. No monolith.
 - `prism.core.js` — state, helpers, file-type detection, **lens routing**, and app chrome. Load LAST.
 - `prism.json.js` — `window.JSONLens`: flatten, sheet detection, analysis/flags, table+tree+raw render, CSV/Excel export.
 - `prism.md.js` — `window.MDLens`: markdown parse + render + HTML export.
 - `prism.mobile.js` — mobile export bottom-sheet + tab-delimiter fix; self-contained (injects its own styles).
- **Cache-busting.** Every bundle reference in `index.html` carries a `?v=` token. **Bump it on any source change** or browsers serve a stale module (this bit us: a mobile fix shipped but stayed frozen behind an old token).
- **Lens registry pattern.** Each lens exposes `load()` + `render(view)`. Adding a format (YAML, CSV, XML) = add a detector branch in `detectType` + a new `*Lens` module. The shell does not change.
- **Flatten strategy is a view concern, not a data concern.** Pivot and split affect the on-screen preview; export always writes true rows/columns.
- **Pivot fits the viewport.** A single-record object pivots to Field/Value; on mobile the table uses fixed layout so a long value wraps instead of forcing horizontal-scroll clipping.
- **Excel export** currently ships an Excel-compatible HTML table (`.xls`, opens natively). True `.xlsx` via SheetJS is a roadmap item.
- **Access gate** via `config.json`. Currently `open` (public). Flip to `gated` (code `2026`) or `down` with a one-line commit, no redeploy.
- **Footer stamp** is written by JS as `Prism vN · PR #N` so the live view can be verified against the latest merge.
- `.nojekyll` at repo root is load-bearing (inline `{{ }}`-style JS would break a Jekyll build).

## Version history

Commit history is authoritative.

- **v2.2** — unlocked (access `open`); fixed mobile pivot overflow (long single-record values were clipping off-screen); added footer version/PR stamp + Infrastructure table; dropped `og.png`/`icon.png` icon package; `?v=4`.
- **v2.1** — slimmed the mobile header into a compact app bar; cache-bust to `?v=3` (forced the v2 mobile footer sheet past stale cache).
- **v2** — mobile export bottom-sheet + real-tab CSV delimiter fix; added `prism.mobile.js` + first `?v=` tokens.
- **v1** — initial build. JSON + Markdown lenses, split-by-table default, single-record pivot, flag panel, CSV/Excel/HTML export, settings drawer, access gate.

## Related

- ClickUp APPS task (next-build brief + Current Version field).
- Supersedes the standalone **markdown-viewer** app (retired).
- Brain tools: When Building Apps, Source-Size Budget Enforcer, Post-Build Verify.

## Roadmap

- True `.xlsx` export (SheetJS).
- Virtualized table rendering for very large files.
- Additional lenses: YAML, CSV, XML.
