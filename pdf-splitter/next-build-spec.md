# pdf-splitter v[N+1] — Build Spec (Surgical Diffs)

> **Standing rule (applies to this app):** must be designed for clean mobile viewing AND desktop — no horizontal overflow at 320px, footers/action bars that wrap or stack, touch targets ≥44px, fluid layout via `clamp()`/`min()`/`%`, safe-area insets. **No iOS auto-zoom on tap/focus** (double-tap-zoom killed via `touch-action:manipulation`; focus-zoom killed by holding form controls ≥16px on mobile). Test at phone width before shipping.

---

## Scratch intake (raw, unscoped ideas)

### Per-row page picker popup (PROPOSED 2026-07-05, awaiting greenlight)

Michael wants the visual page-selection power (currently only the big top/left global thumbnail grid) wired into each individual split row instead of one giant global collection. Tap a page-pick affordance on a row → popup thumbnail grid → tap a page to set that row's START, tap a second for a range → writes back to the row's START/END fields + markdown source of truth.

"Best of both worlds": the popup surfaces allotment state (the desktop left-rail's "which pages aren't allotted yet" awareness) per-row — free pages normal, pages owned by THIS row = accent, pages owned by OTHER rows = dimmed + that split's folder-palette dot. Desktop keeps its left rail; the per-row picker is additive.

Proposed design calls (opinionated):
- **Trigger:** explicit page-grid icon button inside each row (near START/END). Discoverable entry (Interaction-State Standard: entry must be obvious).
- **Surface:** bottom sheet on mobile (thumb-reachable), centered `<dialog>` on desktop. Reuse existing `<dialog>` chrome (already sharp-cornered).
- **Reuse existing thumbnail render path** (14_pdf_thumbs.js) — not rebuilding thumbs.
- **Selection lifecycle:** tap one = single page (start=end); tap two = range; tap a selected page again = deselect; tap-outside / Esc / X = close. Full entry+exit per Interaction-State Standard.
- **Overlap tie-in:** respect the existing "Allow page overlap" toggle — overlap off = other-row pages disabled in picker; overlap on = selectable but flagged.
- **Writeback through the model** (11_markdown_model.js) so rows ↔ markdown never desync.
- **v1 scope:** popup picker + allotment coloring + tap/range select + writeback + close paths, mobile sheet + desktop dialog. **Deferred to fast-follow:** opening a row's picker live-highlighting those pages in the desktop left rail.

Requires reading 12_rows_render.js, 14_pdf_thumbs.js, 11_markdown_model.js before writing diffs.

### Done this cycle (shipped, not pending)
- Mobile masthead collapsed to a compact icon bar (commit b9eab94).
- iOS zoom prevention: `touch-action:manipulation` on controls + ≥16px mobile form fields (commit de977cc).
- Nameless-split filename fallback ("untitled.pdf") — open question: auto-derive from page range instead. Awaiting Michael's call.

---

## Source location

- **Chunk index:** `pdf-splitter/source/source_index.html`
- **Repo:** `mawizorek/ClickUp_apps` (branch `main`)
- **Commit (pinned):** ` `
- **Encoding:** base64 armored
- **Total chunks:** [N]

## What this version does (summary)

1. [Change 1]
2. ...

---

## Diff 1: [Description]

```javascript
// FIND:
[exact code to find]
// REPLACE WITH:
[exact replacement code]
```

---

## Agent instructions

1. Read the chunk set from `pdf-splitter/source/source_index.html`. Gated walk, auto-advance up to 5 chunks per pass.
2. Apply the diffs above in order.
3. Deliver the complete modified source as a ClickUp artifact (v[N+1]).
4. Do NOT commit to the repo if file >30KB. Michael uploads manually.
5. Post the standard version comment on the app's task.

---

## Known snags / notes for the render agent

- Base64 armor is mandatory for HTML source chunks (plaintext gets tag-flattened).
- Prefer commit-pinned raw URLs over `main` branch URLs (transient CDN 404s on recent commits).
