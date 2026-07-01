# PDF Splitter & Renamer

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/pdf-splitter/)

[![Launch](https://img.shields.io/badge/▶%20Launch%20PDF%20Splitter-Open%20in%20browser-1ea7a7?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/pdf-splitter/)

> Opens the live app in your default browser (GitHub Pages). Nothing uploads; all processing is local.

**Status:** Shipped v1.2 · **Live:** https://mawizorek.github.io/ClickUp_apps/pdf-splitter/ · **Source of truth:** [`index.html`](./index.html) on `main` (commit history = version history)

A single self-contained, offline HTML app. Load ONE multi-page PDF, define how it splits into separate documents (page ranges + clean filenames + optional folder grouping) through a database-style portal editor, then export a ZIP of the renamed, split PDFs organized into folders. Everything runs client-side; nothing is uploaded anywhere.

---

## What it does

- **One PDF in, one organized ZIP out.** ZIP root = an editable Session/Header Folder Name (auto-filled from the upload filename, then cleaned).
- **Portal rows are a skin over a hidden markdown block; markdown is the source of truth.** Three ways to populate it: manual row editing, Import .md (overwrites the set), or direct edits in the Markdown panel. Export always reads the markdown.
- **Page grid:** click a page for a single-page split; shift-click a second for a range. Thumbnails render lazily; PDFs over ~50 pages default to numbered placeholders with an opt-in render.
- **Filename cleaning** (live preview per row + on the header folder): trim → lowercase → spaces to `_` → unsafe chars to `_` → collapse repeat `_` → strip leading/trailing `_` → cap 60 → append `.pdf`. Hyphens survive.
- **Validation engine, real-time badges.** Hard blocks (disable export): page out of bounds, invalid/empty page fields, duplicate final filename. Soft warnings (never block): page overlap across different names, unused folder, split with no pages.
- **Merge & duplicate semantics.** Identical cleaned name + same folder → merge into one file (pages in order). Same pages under different names → separate identical files (a feature).
- **Folders:** config panel (master on/off, add/rename/delete, unassigned destination), visible per-row folder dropdown, per-folder color identity, `(unused)` flags, no empty dirs.
- **Quick templates:** repeat a page N times, every/odd/even page, split into N equal chunks.
- **Row tools:** drag-to-reorder (affects ZIP order), duplicate row.
- **Export:** live file-tree preview → Export builds the ZIP → inline confirm card (file count + size) → download. `_export_report.txt` bundled by default (source, splits, warnings, timestamp).

---

## How to use it

1. **[Launch the app](https://mawizorek.github.io/ClickUp_apps/pdf-splitter/)** (opens in your browser).
2. Drop or select ONE PDF. The header folder name auto-fills from the filename.
3. Define splits: click pages in the left grid, add rows manually, use **Templates**, or **Import .md** (see the Brain "PDF Split Markdown Packager" tool to generate that markdown from any document).
4. Optionally assign folders per row and configure them in the **Folders** panel.
5. Watch the live file-tree on the right. Fix any red badges (they block export).
6. **Export ZIP** → confirm card → **Download**. On iOS Safari, long-press Download → "Download Linked File."

---

## Architecture (critical infrastructure notes)

This section is the permanent record of the non-obvious technical decisions. It replaces the historical build notes that used to accrete on the ClickUp task description; the task now holds only the next-build brief.

### Self-contained, offline-first

Single `index.html`, all CSS + JS inline. Works double-clicked from disk. `index.html` IS the app AND the folder's GitHub Pages web entry point — never split it into chunks or add a manifest.

### Library stack (the one deviation from the original brief)

The original spec said "PDF.js splits." **PDF.js cannot WRITE PDFs** — it only reads and renders. So the labor is divided across three CDN libs:

- **PDF.js** — reads page count, renders page thumbnails.
- **pdf-lib** — the actual page extraction/merge (`copyPages`) that builds each output PDF. This is the write engine PDF.js lacks.
- **JSZip** — bundles the outputs into the ZIP.

Offline caveat: because the three libs load from CDN, the very first run needs a connection to cache them; fully offline thereafter.

### Markdown as source of truth

Rows and the markdown block are the same data. The parser splits each line on the FIRST colon only (so `name: Invoice: March` is safe), reads `page: N` or `page: N-M`, `name:`, optional `folder:`, entries separated by a line of `---`, and a leading `folder_name:` header. Any agent can generate this markdown via the Brain "PDF Split Markdown Packager" tool for a clean round-trip: same PDF + import .md = exact export, no row editing.

### Merge model (how grouping actually resolves)

Merge key = `assigned folder + cleaned name`. Rows sharing a key union their pages (in listed order) into one file. Two groups that resolve to the SAME final path collide → hard "Duplicate name" error. Same name in DIFFERENT folders nests separately (no collision). This is what makes flat-mode same-name collisions surface correctly while foldered same-names stay distinct.

### Locked row layout (design rule, do not regress)

Validation badges and the folder control must ADD onto the row, never reflow it. The row is a fixed grid — `grip | dot | name(flex) | folder | pages | meta` — where every column is fixed width except the name field. Badges paint into a reserved fixed-width meta slot; notes drop onto their own full-width line below. A wide badge ("Duplicate name", "Shares pages") can never squeeze the page fields or misalign stacked rows. Any future control goes in a fixed slot, not an `auto` column.

### Downloads (hard-won, non-negotiable)

Real same-origin `blob:` `<a download>`. Build the ZIP as a Blob, `URL.createObjectURL`, attach to a real anchor with a `download` attr. Desktop: fire it once. Mobile (iOS Safari, top-level): user long-presses → "Download Linked File" → real file lands in Files › Downloads; keep `-webkit-touch-callout: default` on the anchor. NEVER use synthetic `.click()` in a sandbox, `data:` URIs, `navigator.share({files})` for this, `window.open`, or a cross-origin file link (that last one saves a 135-byte `.url` shortcut instead of the bytes). The download link/confirm card is invalidated and its blob revoked on ANY state change, so a stale-named ZIP can never be offered.

### Reactivity

Every state mutation routes through `renderTree()`, which is the single choke point that also invalidates the download. That's why the tree and download button stay live on every interaction rather than lagging.

---

## Version history

Commit history on `main` is the authoritative changelog. Highlights:

- **v1.2** — overlay modals replaced by inline panel cards; row drag-reorder; duplicate row; quick templates; filename cleaning fix (unsafe→_ before collapse, so `M3 . Reg` → `m3_reg`); confirm-before-download as an inline card.
- **v1.1** — locked row layout; visible in-row folder dropdown; download-button invalidation; fully reactive tree.
- **v1** — first full render: all logic behind the approved skin (PDF.js parse/thumbnails, pdf-lib split/merge, markdown↔rows sync, filename cleaning, validation engine, folders, JSZip export + report).

> Note: the initial commit was messaged "v1" while carrying the v1.1 build; the in-app version badge is authoritative. There is also one dead placeholder commit from a v1.2 write slip, immediately corrected by the following commit. Current `index.html` is always correct.

---

## Related

- **ClickUp task (next-build brief + current-version links):** the APPS-list task holds the volatile next-build brief and custom-field version links, NOT historical notes.
- **Revision History doc:** permanent per-version working-notes trail (one subpage per build, append-only). Page 1 is the locked goals/constraints source of truth.
- **Brain tool:** "PDF Split Markdown Packager" generates import-ready split markdown from any document.

---

## Roadmap (v1.3+)

- Session persistence (localStorage the split config, not the PDF; "restore last session?").
- Keyboard shortcuts (Tab nav, Cmd/Ctrl+Enter export, Delete row, Cmd+Z undo).
