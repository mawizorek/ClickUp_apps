# Vectorworks Best Practices — Research & Standards

> **What this file is:** the home for the Vectorworks best-practices **deep dive** (Phase 0 / D-010) and the distilled standards it produces. This is where research notes live so another agent can pick up where we left off.
>
> **Companions:** [`README.md`](./README.md) = phase-plan map · [`DECISION-LOG.md`](./DECISION-LOG.md) = decision journal · [`BUILD-PLAN.md`](./BUILD-PLAN.md) = the one-page build-from artifact. This doc = the knowledge base (raw research → ratified practice).
>
> **Status: DEEP DIVE — FINDINGS F-001..F-015 LOGGED; STANDARDS S-1..S-6 ADOPTED (2026-07-16).** S-5 sets the direction of truth (Git = plan, VWX = realization, export = reconciliation); S-6 sets the file-format split (Markdown prose / comma-CSV manifests). Package structure is now largely settled at the skeleton level; remaining work is the exhaustive lists + sheet-layer numbering.

---

## How this doc works (handoff contract)

Two layers, kept deliberately separate:

- **§ Findings** = raw research as it comes in. Messy, dated, every claim carries a source link + confidence. Nothing here is trusted yet.
- **§ Standards** = distilled, agreed practice that graduated out of Findings. A line moves up only once we've decided to adopt it; when it does, it also earns a dated row in `DECISION-LOG.md`.

**To resume research:** read the Research Agenda, pick an open question, add dated entries under Findings with sources. Don't write into Standards without a decision.

---

## Research Agenda (what the deep dive should answer)

Starter questions — refine as we go. Status tags added 2026-07-16 (✅ = first-pass finding logged; deeper follow-ups noted per item).

- ✅ **Layers vs. classes:** design layers for physical/spatial separation, classes for graphic/visibility control. → **F-001** · *resolved into our house model → S-1*
- ✅ **Class naming conventions:** hierarchical/delimited naming. → **F-002 / F-010** · *naming mechanics adopted; specific tree still open*
- ✅ **Sheet layers vs. design layers:** viewport workflow, scale handling, title-block placement. → **F-003**
- ✅ **Reports & worksheets:** how worksheets/records generate schedules and manifests. → **F-004 / F-011** · *export path — now a reconciliation aid per S-5*
- ✅ **Symbols & hybrid 2D/3D:** pipes/hang positions, resource embedding, screen- vs layer-plane. → **F-005**
- ✅ **DWG export/import fidelity:** what survives the round-trip. → **F-006**
- ✅ **Origin / reference lines:** locking origin at 0,0. → **F-007** · *resolved → S-3*
- ✅ **Existing standard templates:** Spotlight defaults, USITT RP, community templates. → **F-008 / F-010**
- ➕ **Extraction / reporting engine** (2nd pass): what a VWX file can emit + how it becomes git artifacts. → **F-011 (worksheet/criteria), F-012 (resources), F-013 (referencing), F-014 (publish/PDF)** · *reframed by S-5: these power the reconciliation check, not a routine population pipeline*
- ➕ **File formats** (3rd pass): what file types the package uses. → **F-015** · *resolved → S-6*

---

## Findings

> Format: `F-NNN | date | claim | source | confidence`. Confidence: **High** = vendor documentation (app-help.vectorworks.net) or published standard; **Medium** = reputable community/practitioner source; **Low** = single/unverified source.

### F-001 — Layers vs. classes: the division of labor · 2026-07-16 · Confidence: High

Vectorworks draws a hard line: **the layer determines an object's *location*; the class determines its *appearance* and visibility.** Design layers behave like stacked sheets of vellum (each with its own scale), classes span all layers and control attributes/visibility globally.

**Spotlight's specific recommendation for a light plot:** put the stage, focus points, and scenic elements on **separate design layers**; put rigging objects, hanging positions, and lighting devices **together on one layer**. **Use the same scale for all design layers.** Light-plot items each get their own class so display can be toggled globally for viewing/printing.

> **House note (2026-07-16):** we deliberately diverge from Spotlight's lean-layer advice. Our layers are keyed on **department × elevation band** (~27 layers) because this is a multi-department **master** file, not a single designer's plot (see S-1 / S-2).

- Sources: [Organizing the drawing (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/Structure/Organizing_the_drawing.htm) · [Light plot structure (VW2023)](https://app-help.vectorworks.net/2023/eng/VW2023_Guide/LightingDesign1/Light_plot_structure.htm) · [Design Series Layers, Classes, and Viewport Standards (VW2016)](https://app-help.vectorworks.net/2016/eng/VW2016_Guide/Structure/Design_Series_Layers_Classes_and_Viewport_Standards.htm)

### F-002 — Class naming conventions · 2026-07-16 · Confidence: High

Vendor guidance: **decide a naming scheme before creating classes.** For large class counts, use **compound names of up to four parts, separated by a dash** (e.g. `Arch-Wall-Ext`). **The dash drives hierarchical nesting** in the Navigation/Organization palettes. Spotlight can auto-assign device classes from a field value (prefix/suffix), and the dash nests those too.

> **House note:** per D-012 our classes are object-category based; dash-delimited ≤4-part mechanics adopted as the naming discipline. Specific tree still to define.

- Sources: [Creating classes (VW2023)](https://app-help.vectorworks.net/2023/eng/VW2023_Guide/Structure/Creating_classes.htm) · [Spotlight prefs: Lighting Devices Classes and Color pane (VW2024)](https://app-help.vectorworks.net/2024/eng/VW2024_Guide/Setup/Spotlight_preferences_Lighting_Devices_Classes_and_Color_pane.htm)

### F-003 — Sheet layers vs. design layers · 2026-07-16 · Confidence: High

**Design layers** = the drawing itself, scaled. **Sheet layers** = presentation / "paper space," always at **1:1**, containing **viewports, title block borders, notes, annotations.** Viewports render a chosen combination of visible/grayed/hidden design layers + classes. All design layers share one user origin; each sheet layer has its own.

- Sources: [Organizing the drawing (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/Structure/Organizing_the_drawing.htm) · [Setting the user origin (VW2024)](https://app-help.vectorworks.net/2024/eng/VW2024_Guide/Setup/Setting_the_user_origin.htm) · [VW equivalents to AutoCAD/Revit terms](https://app-help.vectorworks.net/2020/eng/VW2020_Guide/DXFDWG/Vectorworks_equivalents_to_AutoCAD_and_Revit_terms_and_concepts.htm)

### F-004 — Reports & worksheets export (feeds the S-5 reconciliation check) · 2026-07-16 · Confidence: High

- **Worksheets export directly to CSV** (comma/semicolon), tab-delimited text, and Excel (`File > Export`). CSV is the clean machine-readable path into git.
- **Reports are worksheets built from object record data.** `Create Report` (Spotlight > Reports / Tools > Reports) builds a worksheet keyed on object data — **including the object's class**.
- **Preformatted reports** ship for lighting devices etc. (e.g. `SL Instrument Schedule Database`); `Generate Paperwork` builds schedules + reports in one pass.
- **Export Instrument Data** (`File > Export`) dumps instrument/accessory/power/position data (Lightwright-compatible).

> **S-5 note:** this export path is how Michael produces a snapshot to *check against the plan*, not how the git package is routinely populated. See S-5. **Delimiter locked to comma per S-6.**

- Sources: [Exporting worksheets (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/Worksheets/Exporting%20worksheets.htm) · [Creating reports (VW2025)](https://app-help.vectorworks.net/2025/eng/VW2025_Guide/RecordsSchedules/Creating%20reports.htm) · [Generating paperwork (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/LightingDesign2/Generating%20paperwork.htm) · [Exporting instrument data (VW2020)](https://app-help.vectorworks.net/2020/eng/VW2020_Guide/Export/Exporting_instrument_data.htm)

### F-005 — Symbols & hybrid 2D/3D (pipes / hang positions) · 2026-07-16 · Confidence: High

A **hybrid symbol** carries a 2D planar (screen-plane) component and a 3D component. **Lighting-device symbols must be hybrid**, and the **2D component must be a *screen-plane* representation, NOT a 2D planar object.** Screen-plane objects only exist inside hybrid symbols/PIOs and don't appear in 3D views. **Records attached to a symbol definition travel with it** on import/copy (reinforces the embed-resources / D-008 hedge).

- Sources: [Workflow: Creating lighting device symbol definitions (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/LightingDesign2/Workflow_Creating_lighting_device_symbol_definitions.htm) · [Concept: Vectorworks symbols (VW2025)](https://app-help.vectorworks.net/2025/eng/VW2025_Guide/Symbols/Concept_Vectorworks_symbols.htm) · [Screen vs layer plane (VW Forum)](https://forum.vectorworks.net/index.php?/topic/112373-screen-vs-layer-plane-within-hybrid-plugins/)

### F-006 — DWG export/import fidelity (feeds D-008 rebuild hedge) · 2026-07-16 · Confidence: High

**A DWG/DXF "layer" maps to a Vectorworks *class*, not a Vectorworks layer.** Map classes ↔ DWG layers on import/export; save reusable mapping sets. Symbols/plug-ins/groups export as **blocks** (symbol blocks keep the name; others go generic unless named in the OIP Data tab; option to decompose). VW imports DWG v2.5–2025, exports v12–2025. Expect de-classing/renaming on round-trip; clean class naming + named plug-ins + embedded/laid-out resources are what make re-import survivable.

- Sources: [Mapping DXF/DWG layer and class names (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/DXFDWG/Mapping_DXFDWG_layer_and_class_names.htm) · [DXF/DWG import options (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/DXFDWG/DXF_DWG_and_DWF_import_options.htm) · [DXF/DWG file export (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/DXFDWG/DXF_DWG_and_DWF_file_export.htm)

### F-007 — Origin / reference lines · 2026-07-16 · Confidence: High (mechanics) / Medium (convention)

**Internal origin** is fixed at (0,0), immovable; **user origin** is movable and coordinates read relative to it. Work within ~5 km of the internal origin or precision degrades. Resolved → S-3: Smith is a blackbox, datum = center of the room rectangle, coincident with the internal origin.

- Sources: [Concept: Internal origin and user origin (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/Setup/Concept__Internal_origin_and_user_origin.htm) · [Centering the drawing on the internal origin (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/Setup/Centering_the_drawing_on_the_internal_origin.htm)

### F-008 — Existing standard templates & references · 2026-07-16 · Confidence: High

VW recommends a **Save As Template** workflow (a file holding standard classes/layers/resources/page-size/attributes). Spotlight ships default content libraries + preformatted reports. **USITT RP-2** (2006; revised Lighting Documentation RP in review 2024) is the graphics standard most plots follow. Borrow from both.

- Sources: [Lighting Design workflow — Save As Template (VW2019)](https://app-help.vectorworks.net/2019/eng/VW2019_Guide/LightingDesign1/Lighting_Design.htm) · [Resource Management for Entertainment Design (VW newsroom)](https://www.vectorworks.net/en-US/newsroom/managing-resource-libraries-vectorworks-spotlight) · [USITT RP-2 (2006) (PDF)](https://cad4theatre.org.uk/USITT-RP2-Lighting-Standard.pdf)

### F-009 — Reference planes & tolerance detail (the "minutia" problem) · 2026-07-16 · Confidence: Medium (house-empirical)

Smith: nominal 50'×70', but interior trim shaves ~1/8" per wall; deck measurements come off the interior trim face, mezzanine/catwalks off nominal wall structure — so the reference plane changes by elevation. **Scope: Smith-specific.** Resolved into S-4 (D-014): document the rule, not the numbers.

- Source: Michael, working session 2026-07-16 (venue-empirical).

### F-010 — Vectorworks Standard Naming system · 2026-07-16 · Confidence: High

Built-in **Standard Naming** for layers/classes/viewports (`File > Document Settings > Standard Naming`). Ships VWArch + AIA/NCS + User 1/2/3; up to **99** custom standards per type via the `ClassNameStds` / `LayerNameStds` / `ViewNameStds` worksheets. Our house naming can be registered as a formal custom standard in the template so new files inherit it.

- Sources: [Creating additional custom standards (VW2023)](https://app-help.vectorworks.net/2022/eng/VW2023_Guide/Setup/Creating_additional_custom_standards.htm) · [Layer, class, and viewport standards (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/Structure/Layer_class_and_viewport_standards.htm)

### F-011 — Worksheet database rows + Criteria engine (the extraction workhorse) · 2026-07-16 · Confidence: High

How a snapshot/manifest CSV is produced. A worksheet has two row types: **spreadsheet rows** (constants/notes) and **database rows** (a header row + auto-generated sub-rows, one per matching object). The **Criteria dialog** defines which objects populate a database row — by **class, layer, object type, record field, symbol name, line weight**, with nested AND/OR condition sets. Each **column** picks a function or field: object data (record fields) OR general properties like **`the layer it's on`, `its class`, symbol name, count, dimensions**. So a layers/classes/resource snapshot is a database row with the right criteria + columns, then **File > Export → CSV** (F-004). Because a column emits an object's layer *and* class, the "each object with its default layer + class" view is native.

> **S-5 note:** this is the engine behind the reconciliation snapshot Michael runs to check the file against the plan — not a routine git-population pipeline. **S-6 note:** the git-side CSV (the plan) is authored first; the worksheet renders the file's actual state to diff against it — the worksheet never becomes the source.

- Sources: [Defining worksheet rows (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/Worksheets/Defining_worksheet_rows.htm) · [The Criteria dialog box (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/Worksheets/The_Criteria_dialog_box.htm) · [Selecting a function or field for a database column (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/Worksheets/Selecting_a_function_or_field_for_a_database_column.htm) · [Worksheet functions reference (Vectorworks GitHub)](https://github.com/Vectorworks/developer-worksheets/blob/main/Worksheet%20Functions/Vectorworks%202026%20US.md)

### F-012 — Resource types + Resource Manager · 2026-07-16 · Confidence: High

"Resources" is a specific VWX bucket managed in the **Resource Manager**: **symbols, record formats, worksheets, hatches, line types, text styles, dimension standards, title block border styles, textures/Renderworks styles, gradients, class/layer definitions, saved views**, and more. **Record formats** are the data schema attached to objects/symbols; attaching a record to a **symbol definition** auto-attaches it to every instance. The Resource Manager exports individual resources/folders and (Design Suite) can **reference** resources from a master file (italicized = referenced). Community-confirmed: there's **no clean one-click "dump all symbol names to a spreadsheet"** from the RM — the reliable CSV path is a **worksheet database row** (F-011).

- Sources: [Resource Manager (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/ResourceManager/Resource%20Manager.htm) · [Exporting resources (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/ResourceManager/Exporting_resources.htm) · [Attaching record formats to symbols/objects/materials (VW2023)](https://app-help.vectorworks.net/2023/eng/VW2023_Guide/RecordsSchedules/Attaching_record_formats_to_symbols_objects_and_materials.htm) · [Symbol name export from Resource Manager (VW Forum)](https://forum.vectorworks.net/index.php?/topic/115928-symbol-name-export-from-resource-manager/)

### F-013 — Referencing mechanism (the technical spine of S-2) · 2026-07-16 · Confidence: High

- **Design Suite's recommended method = referenced Design Layer Viewport (DLVP):** create a DLVP in the target file and reference the master's design layers into it. **Advantage: the master's layers/classes/resources are NOT all force-imported** — the department file stays thin (exactly S-2's intent).
- The older **layer-import** referencing (Fundamentals default) copies layers in — heavier; avoid.
- Referencing pulls the referenced layers *with their classes + resources*; referenced items show **italicized**. Master and target **must be the same VW version** (matters for the D-008 Educational→licensed rebuild).
- **Project Sharing** (`.vwxp` + working files) is a separate multi-user mechanism; possibly relevant later, not required for the reference model.

- Sources: [Concept: Layer referencing (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/Workgroup/Concept_Layer_referencing.htm) · [Creating a referenced design layer viewport (VW2024)](https://app-help.vectorworks.net/2024/eng/VW2024_Guide/Viewports1/Creating_a_referenced_design_layer_viewport.htm) · [Referencing resources (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/Workgroup/Referencing_resources.htm)

### F-014 — Batch publish + PDF export (the human-readable drawing trail) · 2026-07-16 · Confidence: High

- **Publish command** batch-exports **multiple sheet layers, saved views, and worksheets** at once, to **PDF / DXF-DWG / DWF / Excel / image** (PDF + images need Design Suite). Can auto-pull all sheets in a title-block issue.
- **PDF export** turns each sheet/page into a PDF page, embeds fonts, offers **PDF/A-1b** — an **archival** format that flattens layers and embeds color/font. Good candidate for a frozen "as-published" drawing set (Phase 3/6).
- Note (S-5): the primary handout to collaborators is the **hand-drawn plan/notes in git**; a published PDF plate set is an optional as-built snapshot, not the lead artifact.

- Sources: [Batch publishing (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/PrintPublish/Batch%20publishing.htm) · [Exporting PDF files — incl. PDF/A-1b archival (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/Export/Exporting_PDF_files.htm)

### F-015 — File-format tradeoffs: Markdown vs .txt vs CSV vs worksheet-mirror · 2026-07-16 · Confidence: High (workshop-reasoned + tooling facts)

The package holds **two distinct kinds** of file, and they want different formats:

- **Markdown for prose** beats `.txt`: GitHub renders `.md` into clean headed pages with tables and cross-links (a designer reads it in-browser, zero tooling), yet it's still plain text under the hood so it diffs perfectly in git. `.txt` is "Markdown with the benefits removed" — no structure, no rendering, a flat wall at scale. So the "txt is cleaner" instinct is really "I want it readable," and md is the *more* readable of the two.
- **CSV for data manifests** (layers/classes/symbols/inventory): machine-comparable, row-level git diffs, and it **mirrors a VWX database worksheet** (F-011) so the reconciliation diff is trivial (both sides CSV). VW's worksheet export offers a comma-or-semicolon delimiter (F-004) — **pick one and standardize** so every export is consistent.
- **The worksheet-mirror is a RECONCILIATION device, not a source (S-5 guardrail):** git CSV = the plan (authored first) → VWX worksheet renders the actual state → export → diff. If the worksheet is ever treated as the origin of the CSV, the file leads and git trails, inverting S-5. Keep auto-render strictly to the tabular manifests; never render the prose standards as worksheets.
- **Rule of thumb:** if a VWX worksheet will ever mirror it → CSV. If a human reads it top-to-bottom → Markdown.

Resolved → S-6 (D-016), with the delimiter locked to **comma**.

- Sources: workshop reasoning 2026-07-16 (6 lenses) + tooling facts from [Exporting worksheets (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/Worksheets/Exporting%20worksheets.htm) (delimiter options) and GitHub Markdown rendering behavior.

---

## Research Agenda — progress (2026-07-16)

- **Pass 1:** F-001..F-010 (structure, naming, symbols, DWG, origin, templates, Standard Naming).
- **Pass 2:** F-011..F-014 (extraction/reporting/referencing/publish).
- **Pass 3:** F-015 (file formats).
- **Direction-of-truth ruling (S-5, D-015):** git = plan of record, VWX = realization, export = reconciliation.
- **File-format ruling (S-6, D-016):** Markdown prose / comma-CSV manifests; worksheet-mirror is reconciliation-only.
- **Adopted into Standards:** S-1 (D-012), S-2 (D-011), S-3 (D-013), S-4 (D-014), S-5 (D-015), S-6 (D-016).
- **Still open:** object-class tree; final layer list; sheet-layer numbering (tabled, more research); which snapshot worksheets + columns; USITT RP-2 symbol adoption; empirical DWG round-trip test; Standard Naming registration; `.vwx` storage location; whether reconciliation snapshots live in-repo vs. throwaway.

---

## Candidate decisions for Michael (NOT yet adopted — do not promote until ruled)

1. **Standard show-file structure** — design-layer / class / sheet-layer / resource skeleton (sheet-layer prefixes tabled pending research). Folder skeleton + file manifest now drafted in `BUILD-PLAN.md`.
2. **Referencing method (F-013):** adopt **referenced Design Layer Viewports** (not layer-import) as the S-2 mechanism; note the same-version constraint.
3. **D-008 DWG hedge as procedure (F-006):** saved class↔DWG-layer mapping set, embedded/laid-out resources, named plug-ins, real round-trip test.
4. **Template strategy (F-008):** `Save As Template` conforming to USITT RP-2 + Spotlight defaults.
5. **Register house naming as a Standard Naming standard (F-010).**
6. **Whether reconciliation snapshots live in the repo** or stay throwaway diffs (S-5 open format question).

---

## Standards (adopted)

> A line lives here only after Michael rules; each carries a mirrored dated row in `DECISION-LOG.md`.

### S-1 — Hybrid layer/class division of labor · adopted 2026-07-16 · D-012

- **Layers carry LOCATION + ROUTING + ELEVATION** — location, department (S-2 routing), and elevation band (`0 NOTES / 1 DECK / 1.5 MEZZ / 2 TOE / 3 CATWALK`). **Elevation lives in layers, never classes.**
- **Classes carry OBJECT CATEGORY (for filtering)** — steel, wood, framing, masking, etc. — so viewports/saved views toggle object types globally. Not a linestyle/weight bucket.
- **Naming:** object-classes use dash-delimited ≤4-part hierarchy (F-002). Specific tree = open.
- **Why:** layers answer *where / whose / what height*; classes answer *what kind of thing*. Orthogonal, so a department file (S-2) pulls the layers it needs and still toggles object categories across them.

### S-2 — Master-file reference model · adopted 2026-07-16 · D-011

- **One dense MASTER base file** holds all departments as layers (single source of truth for venue geometry).
- **Department / per-show files REFERENCE the master** (technical method: referenced **Design Layer Viewport**, F-013), pulling only the layers they need rather than duplicating geometry.
- Master authored to be referenced: clean department × elevation layering (S-1), embedded + laid-out resources (F-005/D-008).
- Edits to venue geometry happen once, in the master, and propagate to every referencing file. (Master + targets must share a VW version — F-013.)

### S-3 — Origin / datum convention · adopted 2026-07-16 · D-013

- **Smith is a blackbox rectangle** (~50' × 70' nominal); datum = **geometric center of the room rectangle**, NOT a proscenium CL × plaster line.
- **Center is coincident with the Vectorworks INTERNAL origin (0,0)** — not just a shifted user origin. Already built.
- **Why internal:** keeps geometry tight around (0,0) so DWG round-trips (D-008/F-006) don't lose precision; every referencing file (S-2) inherits the same coordinate frame.
- **Coordinate reading:** +X/−X = stage-right/left; +Y/−Y = up/downstage (axis polarity to confirm with N/S/E/W).
- **Caveat feeding S-4:** the center is the *origin*; it does NOT resolve which *surface* is the measurement reference at a given elevation.

### S-4 — Datums & reference-planes documentation convention · adopted 2026-07-16 · D-014

- **Document the RULE, not the numbers.** Every package carries a short **"Datums & Reference Planes"** note stating which surface is the datum and where that changes by elevation (deck → interior trim face; mezzanine/catwalks → nominal wall structure). Capture the logic + gotchas.
- **Values live in the file, not the prose.** Actual dimensions flow out through worksheet/CSV export (D-009); prose never holds dimension values, save a few deliberately-flagged exceptions.
- **Model to real dimensions.** Geometry reflects reality; the doc only flags that deck-datum ≠ nominal-wall.
- **Scope split:** the *convention* is universal (every package gets the note); the *specific rules* are venue-specific (Smith's elevation rule lives in the Smith package, per F-009).

### S-5 — Direction of truth: Git = plan, Vectorworks = realization · adopted 2026-07-16 · D-015

The governing model for the whole project (parallels the FileMaker workflow: the agent designs/preps specs in git, Michael builds from them):

- **Git is the plan / design-time source of truth.** It holds the *intended* structure (layers we expect, class tree, sheet scheme, conventions), the goals, and the **hand-drawn reference notes/drawings that are actually handed to collaborators** and that Michael drafts against in Vectorworks. Git LEADS.
- **Vectorworks (local files) is the realization / as-built.** It reflects what has actually been built. The `.vwx` lives locally (D-009), never in git.
- **The VWX→Git export is RECONCILIATION, not population.** The worksheet/CSV/PDF export machinery (F-004/F-011/F-014) exists so Michael can produce a snapshot and ask "does what I built match what we documented?" It is an occasional checking aid — **we do not routinely import the file's state into git**, and the file's export does not become the primary package content.
- **Direction of authorship:** plan first in git → build in VWX from it → spot-check the build against the plan. Not: build in VWX → dump to git.
- **Refines (does not contradict) D-001 + D-009:** the package is still versioned docs in git with the file outside git, but its center of gravity is the **forward-looking plan**, not a file-trailing description. Where earlier text reads file-first, S-5 governs.

### S-6 — File-format split: Markdown prose, comma-CSV manifests · adopted 2026-07-16 · D-016

Format each file by its JOB, not one blanket rule:

- **Prose / standards / conventions / the WHY → Markdown (`.md`).** Renders as clean headed pages on GitHub (tables, cross-links) so a designer reads it in-browser with zero tooling, and it still diffs perfectly as plain text. **No `.txt`** — it's Markdown with the benefits stripped out.
- **Data manifests (layers, classes, symbols, inventory) → CSV, comma-delimited.** Machine-comparable, clean per-row diffs, and mirrors a VWX database worksheet (F-011). **Comma is the locked delimiter** (quote any value containing a comma).
- **The VWX-worksheet mirror is the RECONCILIATION half ONLY (S-5 guardrail).** The git CSV is authored first as the plan; the worksheet renders the file's actual state; export → diff. The worksheet renders a check, never becomes the source. Auto-render stays strictly on the tabular manifests — never render prose standards as worksheets.
- **Rule of thumb:** VWX worksheet will ever mirror it → CSV. Human reads it top-to-bottom → Markdown.
- **Reach (S-6 pairs with S-5):** applies to every package in this org-agnostic template, not just URITP/Smith.

---

*Last updated: 2026-07-16.*
