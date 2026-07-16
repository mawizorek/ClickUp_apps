# Changelog — maw-budget

_Chronological "what changed when" activity log. Newest first. Distinct from `design-decisions.md` (the WHY of each locked call) and `next-build-spec.md` (the current WHAT). This file is the trail; read it top-to-bottom-newest to see how the app's planning evolved. Every PR that touches this app should add a line here._

---

## 2026-07-16

- **`render-standard` — layout render standard dictated + value-list render rebuilt Excel-style.** After several iterations on the value-list render, Michael dictated exactly what these layout renders must be. Created **`filemaker/LAYOUT-RENDER-STANDARD.md`** (cross-app): the render IS the layout (DD-R01, no chrome/no gray-window mockup), behaves like FileMaker Browse mode (DD-R02, live controls), looks like the built layout with **Excel/spreadsheet density** (DD-R03: zero border-radius, collapsed gridlines, no cell gaps, tight rows, reproduce-don't-reinterpret), **desktop-scaled fixed canvas** (DD-R04, no mobile reflow, zoom instead), **manifest-driven + generic with data stored as JSON** (DD-R05: value lists live in `value-lists/_index.json`, one shell renders any number of them for any app), **theme via a single token block, provisional pending the themes standard** (DD-R06). Named the two generic-renderer axes: **value-list-generic** (built) + **theme-generic** (pending themes session), converging into `z-fm-layout-object-viewer`. Rebuilt `LAYOUT-value-lists/preview.html` to the spreadsheet standard (sharp corners, collapsed gridlines, no gutters, alternating row fill, cell-focus highlight). Field/table + relationship generic shells noted PROPOSED, pending go-ahead.
- **`value-lists-faithful` / `value-lists-fullbleed` — value-list render iterations.** Moved the render from a scaled "picture of a FileMaker window on gray" to a full-viewport runnable page, then to a faithful, dense recreation of Michael's URITP Budget Value Lists screenshot (stacked NOTES chip, green-check flag cluster with STATUS column header, numbered SORT column, orange action row, PK/version footer). Superseded same day by the Excel-grid `render-standard` pass.
- **`layout-value-lists` — second layout render + value-list registry wired.** Built `layouts/utility/LAYOUT-value-lists/` (`VALUE_Lists`, view `SYS | Value Lists [DSK]`), a master-detail **Value Lists editor** modeled on Michael's URITP Budget prior-art page: left rail of lists, right portal of members, three per-list flags (`IS_ACTIVE` / `IS_STATUS_LIST` / `ENFORCE 1-TO-1`), a canonical STATUS mapping column for status lists, and a GLOBALS `gLIST_` assignment popover. Wired **`value-lists/_index.json`** as the app's **third source-of-truth index** (joined to layouts + relationships on keys): 10 real/possible maw-budget value lists documented with derivation taxonomy (`custom`/`fromField`/`globalSeed`/`relatedTable`) + the status-list mapping model. Added `ValueLists` (anchor) + `ValueListItems` (buoy) + their edge to `relationships/_index.json`; `Globals` stays an island. Added `meta/value-list-tracking-model.md`. Registered the layout in `layouts/_index.json`. Fixed stale README: DD-008 naming flipped provisional -> LOCKED (HML).
- **`relationship-audit-model` — relationship + layout audit model locked.** Added `meta/relationship-audit-model.md`: audits are **queries over two indexes joined on `occurrenceId`**, not a stored cross-reference. (1) `relationships/_index.json` = the TO graph (anchor-buoy; relationship source of truth), seeded with the `Globals` anchor TO (island of one). (2) `layouts/_index.json` = the combined layout roll-up, each layout carrying `occurrenceId`. **Rejected a generated `_xref.json`** (derived state that would drift — Michael's call). Layout folders stay lean; the shared viewer computes joins live.
- **`preview-pure-interactive` — preview.html rebuilt as the real layout.** Stripped ALL chrome from the GLOBAL_Settings preview; pure, chrome-free, interactive Browse-mode render with live controls. `index.html` (inspector) untouched.
- **Viewer decision (Michael):** the shared object/JSON inspector becomes standalone app **`z-fm-layout-object-viewer`** at the **`filemaker/` folder level**, NOT the repo root. Loads any FMP app's `layout.json` by slug+path; computes joins live. **Build pending explicit go-ahead.**
- **`layout-global-preview` — real to-scale render added (chrome superseded same day).** First `preview.html` with FileMaker layout bar/ruler/zoom + manifest geometry + provisional `viewName`. Chrome removed hours later; geometry + viewName remain.
- **`layout-global-variables` — first layout render; layout-first articulation begins.** Articulate the app **layout-by-layout** via real HTML renders *before* table docs, so each render surfaces the fields/value-lists/scripts the backend must define. Created `layouts/utility/LAYOUT-global-variables/` (folder-per-layout). 16 objects, all bindings `proposed`. **NOTE:** folder-per-layout diverges from the one-file-per-layout line in `DOCUMENTATION-STANDARD.md` v1.1 — standard update pending sign-off.

## 2026-07-15

- **`lock-naming` — last gate cleared + prior-art correction.** DD-008 **LOCKED = HML style**. **Corrected DD-012 prior art:** the real dense precursor is the **Budgeting | Shopping** space, NOT URITP BETA BUDGET (which has its own separate plan). No open gate remains before field articulation.
- **`inquiry-hijk` — closed the goal interrogation (A–L complete).** Logged DD-019/020/021/022. Created this changelog. Spec → v0.4.
- **`inquiry-efgl` — answered E/F/G, resolved L.** DD-016/017/018 + DD-013 packaging. Spec → v0.3.
- **`inquiry-d` — answered D.** DD-015 (multi-category splits = N legs on one event).
- **`inquiry-c` — answered C.** DD-014 (hierarchical parent→child categories).
- **`reimbursements` — raised L.** DD-013 (reimbursements = receivables).
- **`inquiry-ab` — answered A + B.** DD-011 + DD-012.
- **`decisions-v0.2` — locked the foundation.** Double-entry ruled in. Created `meta/design-decisions.md` (DD-001–010). Spec → v0.2.
- **`plan-v0.1` — research pass + articulated plan.** Benchmarked the reference tools. Filled `next-build-spec.md`, `meta/architecture-notes.md`, README.
- **scaffold** — app scaffolded git-first from `_template-fmp-app`.

---

## How to read the doc set (for a cold agent picking this up)

1. **`README.md`** — cover page.
2. **`meta/design-decisions.md`** — every committed schema call (DD-001…DD-022). START HERE for WHY.
3. **`next-build-spec.md`** — the current plan.
4. **`meta/architecture-notes.md`** — the double-entry model in prose.
5. **`meta/relationship-audit-model.md`** — layouts/TOs/relationships join model (occurrenceId).
6. **`meta/value-list-tracking-model.md`** — value-list tracking + the generic render-shell family.
7. **`../LAYOUT-RENDER-STANDARD.md`** (filemaker level) — what layout renders must be/behave/look like (DD-R01–R06).
8. **this `changelog.md`** — the chronological trail.

**Current state (2026-07-16):** planning complete, zero tables written on purpose. All schema decisions locked incl. HML naming (DD-008). Layout-first articulation underway: `GLOBAL_Settings` + `VALUE_Lists` each have an interactive `preview.html` + inspector `index.html` off one `layout.json`. Three source-of-truth indexes join on keys: layouts, relationships (TO graph), value-lists. Relationship/audit + value-list tracking models locked. **Layout render standard locked (DD-R01–R06): renders are runnable, chrome-free, Excel-dense, desktop-scaled, generic + JSON-driven.** GLOBAL_Settings render still needs retro-fit to the Excel-grid standard. Shared viewer `z-fm-layout-object-viewer` decided, build pending; generic field/table shell proposed, pending go-ahead. Prior-art / migration source = the **Budgeting | Shopping** space.
