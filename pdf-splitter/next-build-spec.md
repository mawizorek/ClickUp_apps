# pdf-splitter v[N+1] — Build Spec (Surgical Diffs)

> **Standing rule (applies to this app):** must be designed for clean mobile viewing AND desktop — no horizontal overflow at 320px, footers/action bars that wrap or stack, touch targets ≥44px, fluid layout via `clamp()`/`min()`/`%`, safe-area insets. **No iOS auto-zoom on tap/focus** (double-tap-zoom killed via `touch-action:manipulation`; focus-zoom killed by holding form controls ≥16px on mobile). Test at phone width before shipping.

---

## ⚠️ Source-readback hazard (READ FIRST)

The agent read path (raw fetch) **flattens HTML that lives inside JS strings** — any `innerHTML = '<div ...>'` comes back with the tags stripped. Files that are SAFE to rewrite blind: pure-logic JS (`10`, `11`), CSS (`01`–`03`), and `17` (picker is authored with `createElement`, and its `init()` has no HTML strings). Files NOT safe to rewrite from a raw read (they carry markup-in-JS): **`12_rows_render.js`, `13_tree_folders.js`, `15_export_download.js`**. To edit those safely, get byte-accurate source (base64-armored chunk set or GitHub UI copy), do NOT reconstruct their template strings from a flattened read.

---

## Scratch intake (raw, unscoped ideas)

### Non-contiguous page sets — SHIPPED 2026-07-06
Selection is now a page SET, not a single contiguous range. Tap in the per-row picker toggles a page in/out; 1-2-3-4-5 accumulates, and non-adjacent picks like `1-2,6-7` are valid and export as one PDF. Implementation (data-model change, backward compatible):
- `10_state_helpers.js`: `parsePages` honors an optional `s.pages` array (sorted/deduped/validated) and falls back to contiguous `start`/`end` when absent. Added `compressRuns([1,2,6,7]) -> "1-2,6-7"`. `pageToken` emits the run token.
- `11_markdown_model.js`: `parseMarkdown` accepts comma page lists (`page: 1-2,6-7`), sets `entry.pages` + min/max. Verdict label shows the run token for non-contiguous. `computeModel` sorts group pages.
- `17_init.js`: picker tap = toggle set; Clear empties; readout shows the token.
- Export (`15`) + `computeModel` already extract whatever page list the model provides — no export change needed (copyPages takes an arbitrary index list).

**Known follow-ups from this build:**
- **Tree tag cosmetic:** `13_tree_folders.js` `fileLine` still prints `p{first}-{last}`, so a non-contiguous file shows e.g. `p1-7` instead of `p1-2,6-7`. Export is correct; label is cosmetic. Fix needs byte-accurate `13` (see hazard note); swap tag to `"p" + PS.compressRuns(g.pages)`.
- **Manual Start/End vs a set:** editing the row's Start/End should clear `s.pages` (collapse to contiguous). That lives in `12_rows_render.js` (unsafe-to-blind-edit); until then, a split that has a non-contiguous set is best edited via the picker. Low-severity edge.
- **Range-fill convenience:** tapping every page for a big range is tedious on mobile. Consider a "tap A, then long-press B to fill A..B" gesture, or a range-mode toggle. Desktop global grid still has shift-range.

### Unused-pages destination bug — QUEUED (needs clean 13 + 15)
With "Include unused pages" ON and folders ON (single folder `organized` defined, Unassigned splits = `Unsorted/`), the auto-split leftover pages (`page_11.pdf` …) render/export at ZIP ROOT instead of honoring the unassigned destination. Expected: unused auto-split pages follow the same `unassignedDest` rule as unassigned splits (root vs `Unsorted/`).
- Fix in `13_tree_folders.js` (tree preview) + `15_export_download.js` (actual ZIP placement): compute `unusedDir = (state.useFolders && state.unassignedDest === "Unsorted") ? "Unsorted" : ""` and place unused pages there in BOTH the tree and the ZIP.
- BLOCKED on byte-accurate `13`/`15` source (markup-in-JS flattens on read).

### Mobile global pages grid — CONFIRM INTENT
The left `.pagesbar` (global "all pages" thumbnail grid) is currently `display:none` below 1180px, so on mobile it does NOT render at the top. Per-row picker now covers page selection on mobile. Michael asked to "collapse the initial all-pages thumbnails so they don't bog the top" — confirm whether he wants (a) keep it hidden on mobile (current), or (b) show it on mobile as a collapsed-by-default accordion ("Pages (39) ▸"). If (b): needs `index.html` DOM (collapsible host) + `01` CSS; index.html has heavy inline DOM (edit carefully).

### Per-row page picker — SHIPPED 2026-07-05/06
Grid icon per row opens a thumbnail picker (bottom sheet mobile / dialog desktop), allotment-colored (free / this split / another split + folder dot), overlap-toggle aware, writes back to row + markdown. Cells rebuilt as flex media+footer (no number/thumbnail overlap).

### Done earlier this cycle
- Mobile masthead collapsed to compact icon bar (commit b9eab94).
- iOS zoom prevention (commit de977cc).
- Nameless-split filename fallback ("untitled.pdf") — OPEN: auto-derive from page range instead? Awaiting Michael.

---

## Source location

- **Chunk index:** `pdf-splitter/source/source_index.html` (NOTE: not yet generated; source is the plain module set in `source/`)
- **Repo:** `mawizorek/ClickUp_apps` (branch `main`)
- **Encoding:** plain modules (no base64 armor set exists yet for this app)

---

## Agent instructions

1. Read the module set from `pdf-splitter/source/`. Mind the source-readback hazard above.
2. Apply changes per concern; each file its own commit.
3. Verify the live Pages URL serves the new bytes (CSS is `cache:no-store`; JS modules cache harder — hard-refresh to confirm).
4. Post the standard version comment on the app's APPS task.

---

## Known snags / notes for the render agent

- Base64 armor is mandatory for HTML source chunks (plaintext gets tag-flattened).
- Prefer commit-pinned raw URLs over `main` branch URLs (transient CDN 404s on recent commits).
