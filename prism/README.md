# Prism

### \u25b6\ufe0e [**Launch the app \u2192**](https://mawizorek.github.io/ClickUp_apps/prism/)

[![Launch](https://img.shields.io/badge/launch-prism-e8b84b?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/prism/)

**Status:** live (v1) \u00b7 **Live:** https://mawizorek.github.io/ClickUp_apps/prism/ \u00b7 **Source of truth:** this repo folder.

## What it does

Prism is a **Data App Viewer**: one shell, multiple lenses. Drop a file, Prism detects its type and shows the right view. No upload, everything runs in the browser.

- **JSON lens** \u2014 turns a JSON file into a human-readable table with **Table / Tree / Raw** views, structure stats, and a flag panel that warns about irregular schemas, mixed types, numbers-stored-as-strings, deep nesting, and sparse data. Exports to **CSV** and **Excel** (`.xls`).
- **Markdown lens** \u2014 renders `.md` clean (headings, lists, tables, code, quotes) with a **Rendered / Raw** toggle and HTML export. This folds in the former standalone Markdown Viewer.

## How to use it

1. Open the app and drop a `.json` or `.md` file onto the page (or click **Choose a file**). No file handy? Use the built-in samples.
2. **JSON:** it lands on **Split by table** with the largest data table shown; each nested array becomes its own sheet tab. A single-record sheet auto-**pivots** to a Field/Value layout for readability (still exports as one row). Toggle **Split by table** off for one flat sheet, or **Show nulls** to blank empty cells.
3. Export via **CSV** or **Excel**. CSV delimiter (comma/tab) lives in the Settings gear.

## Architecture (critical notes)

- **Modular by design.** Slim `index.html` entrypoint loads `prism.css` + three JS modules. No monolith.
  - `prism.core.js` \u2014 state, helpers, file-type detection, **lens routing**, and app chrome (drop, settings drawer, theme). Load LAST.
  - `prism.json.js` \u2014 `window.JSONLens`: flatten, sheet detection, analysis/flags, table+tree+raw render, CSV/Excel export.
  - `prism.md.js` \u2014 `window.MDLens`: markdown parse + render + HTML export.
- **Lens registry pattern.** Each lens exposes `load()` + `render(view)`. Adding a format (YAML, CSV, XML) = add a detector branch in `detectType` + a new `*Lens` module. The shell does not change.
- **Flatten strategy is a view concern, not a data concern.** Pivot and split affect the on-screen preview; export always writes true rows/columns.
- **Excel export** currently ships an Excel-compatible HTML table (`.xls`, opens natively). True `.xlsx` via SheetJS is a roadmap item.
- **Access gate** via `config.json` (`gated`, code `2026`). Cosmetic soft-lock only; no sensitive data. Flip to `open` to share publicly.
- `.nojekyll` at repo root is load-bearing (inline `{{ }}`-style JS would break a Jekyll build).

## Version history

Commit history is authoritative.

- **v1** \u2014 initial build. JSON + Markdown lenses, split-by-table default, single-record pivot, flag panel, CSV/Excel/HTML export, settings drawer, access gate.

## Related

- ClickUp APPS task (next-build brief + Current Version field).
- Supersedes the standalone **markdown-viewer** app (retirement pending).
- Brain tools: When Building Apps, Source-Size Budget Enforcer, Post-Build Verify.

## Roadmap

- True `.xlsx` export (SheetJS).
- Virtualized table rendering for very large files.
- Additional lenses: YAML, CSV, XML.
- Retire/redirect the standalone markdown-viewer once Prism is confirmed as its replacement.
