# Changelog — maw-budget

_Chronological "what changed when" activity log. Newest first. Distinct from `design-decisions.md` (the WHY of each locked call) and `next-build-spec.md` (the current WHAT). This file is the trail; read it top-to-bottom-newest to see how the app's planning evolved. Every PR that touches this app should add a line here._

---

## 2026-07-16

- **`render-docs-clarity` — documentation clarity pass + themeing handoff (session close).** Added a **Design goals** section to `LAYOUT-RENDER-STANDARD.md` (why renders exist: articulate layout-first, 1:1 rebuildable in FMP, doc-compliance by construction, reusable/generic, dummy-on-purpose) and a **Theme contract** section. Created **`filemaker/THEMING-INTEGRATION.md`**: the token contract for the incoming themeing agent — current provisional token set, where tokens live (single `:root` per render), the drift to reconcile (renders use bare semantic tokens `--bg/--orange/--teal/...`; `layout.json` mirrors `cv-*` names against a `z-themes/maw-dark-utility.json` `themeRef` that does not exist yet), the swap-without-structural-change rule (DD-R06), and 4 integration options (recommended: canonical theme JSON inlined at build). Refined DD-R03 (form-vs-sheet rounding nuance) and DD-R04 (real-width, incl. small popup widths). **Clean stopping point; next: themeing agent reviews + integrates.**
- **`globals-retrofit` — GLOBAL_Settings rebuilt as a tight ~315px skeleton.** Per Michael, stripped to 4 globals (App Name, Current User, App Version, Environment), mobile/popup-sized single column, one row per field, softer field rounding (single-field entry, not a grid), same theme tokens. Manifest-driven, Save stub. `layouts/_index.json` updated (objectCount 16->4, width 315, status render-skeleton); `layout.json` retains the fuller 16-object future build.
- **`render-standard` — layout render standard dictated + value-list render rebuilt Excel-style.** Created **`filemaker/LAYOUT-RENDER-STANDARD.md`** (DD-R01–R06): the render IS the layout (no chrome/no gray-window mockup), behaves like FileMaker Browse mode, **Excel/spreadsheet density** (zero radius, collapsed gridlines, no cell gaps), desktop-scaled fixed canvas (no reflow), manifest-driven + generic (value lists as data JSON, one shell renders any/any app), theme via one token block (provisional). Named the two generic-renderer axes: value-list-generic (built) + theme-generic (pending). Rebuilt `LAYOUT-value-lists/preview.html` to the spreadsheet standard.
- **`value-lists-faithful` / `value-lists-fullbleed` — value-list render iterations.** From a scaled 'picture of a FileMaker window on gray' -> full-viewport runnable page -> faithful dense recreation of Michael's URITP Budget Value Lists screenshot. Superseded same day by the Excel-grid `render-standard` pass.
- **`layout-value-lists` — second layout render + value-list registry wired.** Built `LAYOUT-value-lists/` (master-detail Value Lists editor from the URITP prior art: rail, member portal, IS_ACTIVE/IS_STATUS_LIST/ENFORCE 1-TO-1 flags, canonical STATUS mapping, GLOBALS popover). Wired **`value-lists/_index.json`** as the app's **third source-of-truth index**: 10 lists, derivation taxonomy (`custom`/`fromField`/`globalSeed`/`relatedTable`), status-list mapping. Added `ValueLists` (anchor) + `ValueListItems` (buoy) + edge to `relationships/_index.json`; `Globals` stays an island. Added `meta/value-list-tracking-model.md`. Fixed stale README: DD-008 provisional -> LOCKED (HML).
- **`relationship-audit-model` — relationship + layout audit model locked.** Added `meta/relationship-audit-model.md`: audits are **queries over two indexes joined on `occurrenceId`**, not a stored xref. Rejected a generated `_xref.json`. Layout folders stay lean; the shared viewer computes joins live.
- **`preview-pure-interactive` — GLOBAL_Settings preview stripped of all chrome** (superseded by the 315px skeleton).
- **Viewer decision (Michael):** shared inspector becomes standalone **`z-fm-layout-object-viewer`** at `filemaker/` level. Build pending explicit go-ahead.
- **`layout-global-preview` / `layout-global-variables` — first layout render + layout-first articulation begins.** folder-per-layout established (diverges from DOCUMENTATION-STANDARD v1.1 one-file-per-layout; standard update pending sign-off).

## 2026-07-15

- **`lock-naming` — last gate cleared + prior-art correction.** DD-008 **LOCKED = HML style**. Corrected DD-012 prior art: the dense precursor is the **Budgeting | Shopping** space, NOT URITP BETA BUDGET.
- **`inquiry-hijk` — closed the goal interrogation (A–L).** DD-019/020/021/022. Created this changelog. Spec -> v0.4.
- **`inquiry-efgl`** — DD-016/017/018 + DD-013 packaging. Spec -> v0.3.
- **`inquiry-d`** — DD-015 (multi-category splits). **`inquiry-c`** — DD-014 (hierarchical categories). **`reimbursements`** — DD-013 (receivables). **`inquiry-ab`** — DD-011 + DD-012.
- **`decisions-v0.2`** — double-entry ruled in; DD-001–010. **`plan-v0.1`** — research + articulated plan. **scaffold** — git-first from `_template-fmp-app`.

---

## How to read the doc set (for a cold agent picking this up)

1. **`README.md`** — cover page.
2. **`meta/design-decisions.md`** — every committed schema call (DD-001…DD-022). START HERE for WHY.
3. **`next-build-spec.md`** — the current plan.
4. **`meta/architecture-notes.md`** — the double-entry model in prose.
5. **`meta/relationship-audit-model.md`** — layouts/TOs/relationships join model (occurrenceId).
6. **`meta/value-list-tracking-model.md`** — value-list tracking + the generic render-shell family.
7. **`../LAYOUT-RENDER-STANDARD.md`** — what layout renders must be/behave/look like (DD-R01–R06) + design goals.
8. **`../THEMING-INTEGRATION.md`** — the theme-token contract for the themeing agent.
9. **this `changelog.md`** — the chronological trail.

**Current state (2026-07-16, session close):** planning complete, zero tables written on purpose. All schema decisions locked incl. HML naming (DD-008). Layout-first articulation underway: **`VALUE_Lists`** (full Excel-grid render, 10 value lists documented) + **`GLOBAL_Settings`** (315px 4-global skeleton) each have an interactive `preview.html` off one manifest. Three source-of-truth indexes join on keys: layouts, relationships (TO graph), value-lists. **Layout render standard locked (DD-R01–R06)** + design goals + theme contract documented. Theme is PROVISIONAL, handed to the themeing agent via `THEMING-INTEGRATION.md`. Shared viewer `z-fm-layout-object-viewer` decided, build pending; generic field/table shell proposed, pending go-ahead. Prior-art / migration source = the **Budgeting | Shopping** space.

**Open threads for next session:**
- Themeing agent reviews the renders + reconciles the token vocabulary (`--bare` vs `cv-*`) and creates `z-themes/maw-dark-utility.json`.
- Go/no-go on the generic **field/table render shell** (+ the cross-app shell framework) and on building **`z-fm-layout-object-viewer`**.
- Next layouts: ledger/register + reports (LDGR/RPT).
- Confirm layout naming convention (`<AREA> | <Name> [<Platform>]`), `Globals` table name, and folder-per-layout -> then update `DOCUMENTATION-STANDARD.md`.
- GLOBAL_Settings `layout.json` still describes the fuller 16-object build; retrofit the manifest when the full build resumes.
