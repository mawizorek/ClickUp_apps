# PDF Splitter & Renamer

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/pdf-splitter/)

[![Launch](https://img.shields.io/badge/▶%20Launch%20PDF%20Splitter-Open%20in%20browser-1ea7a7?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/pdf-splitter/)

> Opens the live app in your default browser (GitHub Pages). Nothing uploads; all processing is local.

**Status:** v2 (modular) · **Live:** https://mawizorek.github.io/ClickUp_apps/pdf-splitter/ · **Source of truth:** the modular source in [`source/`](./source), loaded by a slim [`index.html`](./index.html). Commit history = version history.

Load ONE multi-page PDF, define how it splits into separate documents (page ranges + clean filenames + optional folder grouping) through a database-style portal editor, then export a ZIP of the renamed, split PDFs organized into folders. Everything runs client-side; nothing is uploaded anywhere.

---

## What it does

- **One PDF in, one organized ZIP out.** ZIP root = an editable Session/Header Folder Name (auto-filled from the upload filename, then cleaned).
- **Portal rows are a skin over a hidden markdown block; markdown is the source of truth.** Populate it three ways: manual row editing, Import .md (overwrites the set), or direct edits in the Markdown panel. Export always reads the markdown.
- **Page grid:** click a page for a single-page split; shift-click a second for a range. Thumbnails render lazily; PDFs over 50 pages default to numbered placeholders with an opt-in render.
- **Filename cleaning** (live preview per row + on the header folder): trim → lowercase → spaces to `_` → unsafe chars to `_` → collapse repeat `_` → strip leading/trailing `_` → cap 60 → append `.pdf`. Hyphens survive.
- **Validation engine, real-time badges.** Hard blocks (disable export): page out of bounds, invalid/empty page fields, duplicate final filename. Soft warnings (never block): page overlap across different names, unused folder, split with no pages.
- **Merge & duplicate semantics.** Identical cleaned name + same folder → merge into one file (pages in order). Same pages under different names → separate identical files (a feature).
- **Folders:** config drawer (master on/off, add/rename/delete, unassigned destination), visible per-row folder dropdown, per-folder color from a generic palette, `(unused)` flags, no empty dirs.
- **Drag-and-drop** a PDF onto the drop zone, or click to browse.
- **Settings drawer** (gear, top-right): light/dark theme toggle, persisted to localStorage; honest note on local-only behavior.
- **Export:** live file-tree preview → Export builds the ZIP → inline download link → `_export_report.txt` bundled by default.

---

## How to use it

1. **[Launch the app](https://mawizorek.github.io/ClickUp_apps/pdf-splitter/)** (opens in your browser).
2. Drop or select ONE PDF. The header folder name auto-fills from the filename.
3. Define splits: click pages in the left grid, add rows manually, or **Import .md** (see the Brain "PDF Split Markdown Packager" tool to generate that markdown from any document).
4. Optionally assign folders per row and configure them in the **Folders** drawer.
5. Watch the live file-tree on the right. Fix any red badges (they block export).
6. **Export ZIP** → **Download**. On iOS Safari, long-press Download → "Download Linked File."

---

## Architecture (critical infrastructure notes)

### Modular by concern (v2)

v2 replaced the single self-contained file with a **slim `index.html` entrypoint + concern-separated modules in `source/`**, each well under the 15KB budget. `index.html` fetches the stylesheets and loads the JS modules in a fixed order, then `17_init.js` wires everything. A `BUILD_STAMP` in `index.html` is appended as `?v=` to every source request so a new deploy always serves fresh bytes past the Pages CDN. **Bump `BUILD_STAMP` on every source/style deploy.**

**Module map (boot order is load-bearing):**

| File | Owns |
| --- | --- |
| `source/01_styles_base.css.txt` | Theme tokens (dark default + `[data-theme=light]`), generic folder palette, layout, pages sidebar, drop zone |
| `source/02_styles_rows.css.txt` | Locked row grid, validation badges, additive note row, empty state |
| `source/03_styles_export_chrome.css.txt` | Export column, file tree, toggles, download, dialogs, settings drawer |
| `source/10_state_helpers.js` | `state`, `cleanName` (fixed order), `parsePages`, folder helpers |
| `source/11_markdown_model.js` | Markdown serialize/parse (source of truth), merge model, row verdicts |
| `source/12_rows_render.js` | Row rendering, generic folder dots, status bar, download invalidation |
| `source/13_tree_folders.js` | Live file-tree, folder-list editor, header ZIP-root preview |
| `source/14_pdf_thumbs.js` | PDF load (pdf.js), lazy IntersectionObserver thumbnails, page-click ranges |
| `source/15_export_download.js` | pdf-lib `copyPages` export, JSZip bundle, same-origin blob download |
| `source/16_settings_drawer.js` | Settings gear + persisted light/dark theme |
| `source/17_init.js` | Wires all controls + drag-and-drop; boots last |

### Library stack

PDF.js reads page count + renders thumbnails (it cannot WRITE PDFs). **pdf-lib** does the actual page extraction/merge (`copyPages`). **JSZip** bundles the outputs. First run needs a connection to cache the three CDN libs; fully offline thereafter.

### Markdown as source of truth

Rows and the markdown block are the same data. The parser splits each line on the FIRST colon only (so `name: Invoice: March` is safe), reads `page: N` or `page: N-M`, `name:`, optional `folder:`, entries separated by a line of `---`, and a leading `folder_name:` header. Round-trip clean: same PDF + import .md = exact export.

### Merge model

Merge key = `assigned folder + cleaned name`. Rows sharing a key union their pages (in listed order) into one file. Two groups resolving to the SAME final path collide → hard "Duplicate name" error. Same name in DIFFERENT folders nests separately.

### Locked row layout (design rule, do not regress)

The row is a fixed grid — `dot | name(flex) | folder | pages | meta` — every column fixed width except the name field. Validation badges paint into a reserved fixed-width meta slot; notes drop onto their own full-width line below. Badges/folder controls ADD onto the row, never reflow it.

### Downloads (hard-won, non-negotiable)

Same-origin `blob:` URL. Build the ZIP as a Blob, `URL.createObjectURL`, attach to a real anchor with a `download` attr. Desktop: auto-fire once. Mobile (iOS Safari): user long-presses → "Download Linked File"; keep `-webkit-touch-callout: default` on the anchor. NEVER synthetic `.click()` in a sandbox, `data:` URIs, `navigator.share`, `window.open`, or a cross-origin file link. The download link + its blob are invalidated on ANY state change via the single `renderTree()` choke point, so a stale-named ZIP can never be offered.

---

## Version history

Commit history on `main` is the authoritative changelog. Highlights:

- **v2** — ground-up modular rebuild: slim `index.html` + `source/` modules (all < 15KB), replacing the single-file monolith. Added a Settings drawer with a persisted light/dark theme, drag-and-drop PDF loading, and the standard head/polish block. Dropped the garage-paperwork artifacts (hardcoded Registrations/Insurance/Titles/Misc folder colors + the `exp<date>` filename auto-suggestion) for general scope. Fixed the v1 filename-cleaning order bug (unsafe→`_` now runs BEFORE collapse, so `M3 . Reg` → `m3_reg`).
- **v1.1** — locked row layout; visible in-row folder dropdown; download-button invalidation; fully reactive tree. (Last version with recoverable source; lived as chunk-artifact `.txt` slices, retired in v2.)
- **v1** — first full render: all logic behind the approved skin.

---

## Related

- **ClickUp task (APPS list):** next-build brief + Current Version / GitHub Folder Name fields.
- **Brain tool:** "PDF Split Markdown Packager" generates import-ready split markdown from any document. (v2 keeps the markdown schema unchanged, so the tool round-trips.)

---

## Roadmap (v2.1+)

- Session persistence (localStorage the split config, not the PDF; "restore last session?").
- Keyboard shortcuts (Tab nav, Cmd/Ctrl+Enter export, Delete row, Cmd+Z undo).
- Standard PWA install scaffold + `og.png` / `icon.png` social assets.
