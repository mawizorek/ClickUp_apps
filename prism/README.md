# Prism

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/prism/)

[![Launch](https://img.shields.io/badge/launch-prism-e8b84b?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/prism/)

**Status:** live (v3) · **Access:** open (public) · **Live:** https://mawizorek.github.io/ClickUp_apps/prism/ · **Source of truth:** this repo folder.

## What it does

Prism is a **Data App Workbench**: one shell, multiple lenses. Drop a file, Prism detects its type and shows the right lens. No upload, everything runs in the browser, nothing persists between sessions.

As of v3 it is no longer read-only. Tabular files open in an editable workbench.

- **Table lens** — TSV, CSV and flat JSON, **editable**. Per-cell data gates render a hex code as a live colour swatch, a URL as a link, an empty cell as a ghost stripe. Inline editing, non-destructive sort, a column-stats subheader, row and column operations, a diff summary, and a **Swatches** view that renders each row as a colour band. Exports TSV / CSV / JSON / Excel.
- **JSON lens** — nested or object-root JSON as a human-readable table with **Table / Tree / Raw** views, structure stats, and a flag panel that warns about irregular schemas, mixed types, numbers-stored-as-strings, deep nesting and sparse data. Exports **CSV** and **Excel** (`.xls`).
- **Markdown lens** — renders `.md` clean (headings, lists, tables, code, quotes) with a **Rendered / Raw** toggle and HTML export. This folds in the former standalone Markdown Viewer.

## How to use it

1. Drop a file on the page, click **Choose a file**, or hit **Paste data** and paste a range straight out of Excel, Sheets or Numbers (a copied spreadsheet range is already tab-separated). No file handy? Use the built-in samples.
2. **Tabular:** click any cell to edit it, Tab to advance. Hex cells get a swatch; click the swatch for the OS colour picker or the text to type a value. Click a column header to sort (asc → desc → original), the ⋮ for column operations, a row number to select it. **Swatches** shows the same data as colour bands.
3. **JSON:** it lands on **Split by table** with the largest data table shown; each nested array becomes its own sheet tab. A single-record sheet auto-**pivots** to a Field/Value layout for readability (still exports as one row).
4. Export from the bar at the bottom. The format dropdown converts on the way out, and the filename follows the file you imported.

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | Slim entrypoint: head/polish, access gate, chrome markup, footer stamp, loads the bundle | Version bumps (bump the `?v=` token on any source change) |
| `prism.css` | Base styling (dark + light themes, responsive/mobile chrome, pivot layout) | Version bumps |
| `prism.table.css` | Table lens styling (gated cells, swatch bands, diff banner, popover, row ops) | Version bumps |
| `prism.table.js` | Table lens **engine**: parse, data gates, model, diff, sort order, serialisation, lens registration | Version bumps |
| `prism.table.grid.js` | Table lens **grid**: cell rendering, in-place patching, inline editing, sort headers, column ops, diff banner | Version bumps |
| `prism.table.panels.js` | Table lens **panels**: swatch bands, structure sidebar, export bar, row ops | Version bumps |
| `prism.json.js` | `window.JSONLens`: flatten, sheet detection, analysis/flags, table+tree+raw render, CSV/Excel export | Version bumps |
| `prism.md.js` | `window.MDLens`: markdown parse + render + HTML export | Version bumps |
| `prism.core.js` | State, helpers, **the lens registry**, app chrome (drop, paste, settings drawer, theme). Loads LAST | Version bumps |
| `prism.mobile.js` | Mobile-only chrome: export bottom-sheet + tab-delimiter normalize (injects its own styles) | Version bumps |
| `config.json` | Access state (`open`/`gated`/`down`) + gate copy | Flip anytime (no version bump) |
| `icon.png` / `og.png` | Home-screen tile, social unfurl | Rare |

No `data.json`: Prism is a pure runtime tool (processes user-dropped files), not a data-separated app. Any update is a version bump to the relevant module.

## Architecture (critical notes)

- **Modular by design.** Slim `index.html` loads two stylesheets and seven JS modules. No monolith.
- 🔴 **The lens registry is REAL as of v3, and it was a documented lie before it.** v1 through v2.2 of this README claimed *"add a detector branch in `detectType` + a new `*Lens` module. The shell does not change"* — which contradicts itself in its own sentence, because `detectType` is the shell. Routing was a hardcoded `S.type === "json" ? JSONLens : MDLens` ternary in **two** places (`loadContent` and `setView`), so a third lens could not exist without editing core. **If a doc promises an extension point, open the file and confirm the extension point exists.**
- **How the registry actually works.** A lens is an object:
  ```js
  { id, label, accent, priority, detect(name, text), load(), defaultView, render(view), onSetting? }
  ```
  Lens files push themselves onto `window.PrismLenses` and load **before** `prism.core.js`, which drains the queue at init. Lowest `priority` wins detection; the last entry is the fallback. Adding a format really is a new module plus one `push` — core is untouched.
  - `prism.json.js` and `prism.md.js` **still expose the old `window.JSONLens` / `window.MDLens` globals and were not modified by v3.** Core adapts them into registry entries at init, so their behaviour and their file hashes are unchanged. New lenses should self-register instead.
- 🔴 **Table lens column identity is `col.k`, never the display name.** Columns carry a stable generated key; the name is presentation only. Matching a row's original values by display name meant **renaming a column silently zeroed its diff** — the banner reported no changes while the export still carried them. Repro: edit three cells in a column, rename the column, watch the count vanish.
- 🔴 **An 8-digit hex carries alpha the OS colour picker cannot see or return.** Read the alpha off before the pick and re-attach it after, or picking silently destroys the channel. Repro: a cell holding `#1a2b3c80`, nudge the swatch once, alpha gone.
- 🔴 **No `confirm()` or `prompt()` anywhere in this app.** Both are blocked inside a sandboxed iframe, and a blocked `confirm()` returns `false`, so a Delete would do nothing and say nothing. Destructive actions use an arm-then-fire popover; renaming a column edits the header in place.
- ⚠️ **A commit patches one `<td>`; it never rebuilds `<tbody>`.** A full re-render threw away horizontal scroll, and on a 35-column palette file that is the main path, not an edge case. For the same reason a live picker drag touches only the label and the row tint — replacing the `<input>` mid-pick detaches the OS colour dialog from its anchor.
- ⚠️ **Display order is frozen between explicit sorts.** It is cached as a list of row ids and invalidated only by a sort click or a row add/remove, so editing a sorted table does not teleport the row out from under the cursor.
- ⚠️ **Row-op buttons are `.rbtn`, never `.btn`.** `prism.mobile.js` stretches every `.btn` in the export bar to full width and closes the bottom sheet when one is tapped. Add / Duplicate / Delete must do neither.
- ⚠️ **`prism.css` is 17,183 B and clips on a full read.** Table styles are a **sibling stylesheet**, not an append — rewriting a file from a truncated read is how this repo has broken itself before.
- ⚠️ **A flat array of scalar-only objects opens in the Table lens, not the JSON lens** (behaviour change in v3). It is a table with no tree to show, and this makes it editable. Excel export was added to the Table lens so that case loses nothing. Nested or object-root JSON is unchanged.
- **Conditional row tint.** If a column is literally named `bg` and holds hex values, rows and bands are tinted to their own background colour, with the foreground picked by luminance. Generic trigger, toggleable in Settings.
- **Cache-busting.** Every bundle reference in `index.html` carries a `?v=` token. **Bump it on any source change** or browsers serve a stale module (this bit us: a mobile fix shipped but stayed frozen behind an old token).
- **Flatten strategy is a view concern, not a data concern.** Pivot and split affect the on-screen preview; export always writes true rows/columns.
- **Excel export** ships an Excel-compatible HTML table (`.xls`, opens natively). True `.xlsx` via SheetJS is a roadmap item.
- **Access gate** via `config.json`. Currently `open` (public). Flip to `gated` (code `2026`) or `down` with a one-line commit, no redeploy.
- **Footer stamp** is written by JS as `Prism vN · PR #N` so the live view can be verified against the latest merge.
- `.nojekyll` at repo root is load-bearing (inline `{{ }}`-style JS would break a Jekyll build).

## Version history

Commit history is authoritative.

- **v3** — Table lens (TSV/CSV/flat-JSON, read-write) across three modules + its own stylesheet; the real lens registry; paste import; format-convert export; diff summary; Swatches band view; row tint. Adversarial pass cleared two silent-corruption defects (renamed-column diff, 8-digit hex alpha). `?v=5`, PR #723.
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
- Virtualised table rendering for very large files.
- Additional lenses: YAML, XML.
- Markdown frontmatter as an editable table (the data gates are lens-agnostic functions, so MDLens can call them).
