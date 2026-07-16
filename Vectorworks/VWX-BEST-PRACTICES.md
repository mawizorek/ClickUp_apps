# Vectorworks Best Practices — Research & Standards

> **What this file is:** the home for the Vectorworks best-practices **deep dive** (Phase 0 / D-010) and the distilled standards it produces. This is where research notes live so another agent can pick up where we left off.
>
> **Companions:** [`README.md`](./README.md) = phase-plan map · [`DECISION-LOG.md`](./DECISION-LOG.md) = decision journal. This doc = the knowledge base (raw research → ratified practice).
>
> **Status: DEEP DIVE — FINDINGS LOGGED (2026-07-16); FIRST STANDARDS ADOPTED (2026-07-16).** All eight Research Agenda questions have a dated, sourced Findings entry. Two standards promoted — S-1 (hybrid layer/class division, D-012) and S-2 (master-file reference model, D-011). Origin convention remains an open question under discussion.

---

## How this doc works (handoff contract)

Two layers, kept deliberately separate:

- **§ Findings** = raw research as it comes in. Messy, dated, every claim carries a source link + confidence. Nothing here is trusted yet.
- **§ Standards** = distilled, agreed practice that graduated out of Findings. A line moves up only once we've decided to adopt it; when it does, it also earns a dated row in `DECISION-LOG.md`.

**To resume research:** read the Research Agenda, pick an open question, add dated entries under Findings with sources. Don't write into Standards without a decision.

---

## Research Agenda (what the deep dive should answer)

Starter questions — refine as we go. Status tags added 2026-07-16 (✅ = first-pass finding logged; deeper follow-ups noted per item).

- ✅ **Layers vs. classes:** the accepted division of labor (design layers for physical/spatial separation, classes for graphic/visibility control). What's the industry-standard scheme for theatrical drafting? → **F-001** · *resolved into our house model → S-1*
- ✅ **Class naming conventions:** hierarchical/delimited naming (e.g. category-subcategory) as used by Spotlight / USITT-aligned templates. → **F-002** · *naming mechanics adopted for object-classes; specific tree still open*
- ✅ **Sheet layers vs. design layers:** viewport workflow, scale handling, title-block placement. → **F-003**
- ✅ **Reports & worksheets:** how Vectorworks worksheets/records generate schedules and manifests — the export path that feeds our git docs (ties to D-009). → **F-004**
- ✅ **Symbols & hybrid 2D/3D:** best practice for pipes/hang positions, resource embedding, screen-plane vs. layer-plane geometry. → **F-005**
- ✅ **DWG export/import fidelity:** what survives the round-trip (ties to the D-008 rebuild mitigation). → **F-006**
- ✅ **Origin / reference lines:** locking origin at CL/PL 0,0 conventions. → **F-007** · *OPEN — under discussion, not yet adopted*
- ✅ **Existing standard templates:** what ships with Spotlight, USITT recommended practices, and reputable community templates worth borrowing from. → **F-008**

---

## Findings

> Format: `F-NNN | date | claim | source | confidence`. Confidence: **High** = vendor documentation (app-help.vectorworks.net) or published standard; **Medium** = reputable community/practitioner source; **Low** = single/unverified source. All entries below are FIRST-PASS — trusted enough to inform a decision, not yet promoted to Standards.

### F-001 — Layers vs. classes: the division of labor · 2026-07-16 · Confidence: High

Vectorworks draws a hard line: **the layer determines an object's *location*; the class determines its *appearance* and visibility.** Design layers behave like stacked sheets of vellum (each with its own scale), classes span all layers and control attributes/visibility globally.

**Spotlight's specific recommendation for a light plot:** put the stage, focus points, and scenic elements on **separate design layers**; put rigging objects, hanging positions, and lighting devices **together on one layer**. **Use the same scale for all design layers.** Light-plot items each get their own class so display can be toggled globally for viewing/printing.

> **House note (2026-07-16):** we deliberately diverge from Spotlight's lean-layer advice. Our layers are keyed on **department × elevation band** (~27 layers) because this is a multi-department **master** file, not a single designer's plot (see S-1 / S-2). Spotlight advises a plot; we're building a hub.

- Sources: [Organizing the drawing (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/Structure/Organizing_the_drawing.htm) · [Light plot structure (VW2023)](https://app-help.vectorworks.net/2023/eng/VW2023_Guide/LightingDesign1/Light_plot_structure.htm) · [Design Series Layers, Classes, and Viewport Standards (VW2016)](https://app-help.vectorworks.net/2016/eng/VW2016_Guide/Structure/Design_Series_Layers_Classes_and_Viewport_Standards.htm)

### F-002 — Class naming conventions · 2026-07-16 · Confidence: High

Vendor guidance: **decide a naming scheme before creating classes.** For large class counts, use **compound names of up to four parts, separated by a dash**, each part a level in the hierarchy (e.g. `Arch-Wall-Ext`, `Elec-Lite-Ceiling`, `Plum-Equip-New`). **The dash drives hierarchical nesting** in pop-up menus, the Object Info palette, the Organization dialog, and the Navigation palette.

Spotlight can **auto-assign lighting-device classes from a device field value** (prefix or suffix), and using a dash nests those auto-generated classes into the same hierarchy — so a house naming scheme should anticipate auto-classing.

> **House note (2026-07-16):** per D-012 our classes are **object-category** based (steel, wood, framing, masking…). The dash-delimited ≤4-part mechanics above are adopted as the *naming* discipline for those object-classes; the specific class tree is still to be defined.

- Sources: [Creating classes (VW2023)](https://app-help.vectorworks.net/2023/eng/VW2023_Guide/Structure/Creating_classes.htm) · [Spotlight prefs: Lighting Devices Classes and Color pane (VW2024)](https://app-help.vectorworks.net/2024/eng/VW2024_Guide/Setup/Spotlight_preferences_Lighting_Devices_Classes_and_Color_pane.htm)

### F-003 — Sheet layers vs. design layers · 2026-07-16 · Confidence: High

**Design layers** = the drawing itself, scaled (vellum model). **Sheet layers** = presentation / "paper space," always at **1:1**, containing **viewports, title block borders, notes, and annotations.** Viewports render a chosen combination of visible / grayed / hidden design layers + classes for detail, section, or rendered views — this is where the title block lives and where scale is expressed per-viewport, not on the sheet.

Origin nuance that matters for title-block/coordinate work: **all design layers share one user origin, but each sheet layer has its own user origin** (see F-007).

- Sources: [Organizing the drawing (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/Structure/Organizing_the_drawing.htm) · [Setting the user origin (VW2024)](https://app-help.vectorworks.net/2024/eng/VW2024_Guide/Setup/Setting_the_user_origin.htm) · [VW equivalents to AutoCAD/Revit terms (sheet layers = paper space)](https://app-help.vectorworks.net/2020/eng/VW2020_Guide/DXFDWG/Vectorworks_equivalents_to_AutoCAD_and_Revit_terms_and_concepts.htm)

### F-004 — Reports & worksheets export (feeds D-009 git docs) · 2026-07-16 · Confidence: High

This is the mechanism that produces our documentation trail. Key facts:

- **Worksheets export directly to CSV** (comma- or semicolon-delimited), tab-delimited text, and Excel (`File > Export`). CSV is the clean machine-readable path into git.
- **Reports are worksheets built from object record data.** `Create Report` (Spotlight > Reports, or Tools > Reports) lets you select objects and build a worksheet keyed on their data — **including the object's class** — which is exactly how we'd emit a layers/classes/resources manifest.
- **Preformatted reports** ship for objects with predefined data (lighting devices etc.), e.g. `SL Instrument Schedule Database`. `Generate Paperwork` builds schedules + reports in one pass.
- Separately, **Export Instrument Data** (`File > Export`) dumps instrument/accessory/power/position data to a Lightwright-compatible file — another CSV-ish export path for the inventory manifest.
- **Implication for D-009:** build report/worksheet(s) in the VWX file keyed on layer + class + record fields, export to CSV, commit the CSV to the package. The report definition lives in the file; the CSV is the git artifact.

- Sources: [Exporting worksheets (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/Worksheets/Exporting%20worksheets.htm) · [Creating reports (VW2025)](https://app-help.vectorworks.net/2025/eng/VW2025_Guide/RecordsSchedules/Creating%20reports.htm) · [Generating paperwork (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/LightingDesign2/Generating%20paperwork.htm) · [Using preformatted reports (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/RecordsSchedules/Using_preformatted_reports.htm) · [Exporting instrument data (VW2020)](https://app-help.vectorworks.net/2020/eng/VW2020_Guide/Export/Exporting_instrument_data.htm)

### F-005 — Symbols & hybrid 2D/3D (pipes / hang positions) · 2026-07-16 · Confidence: High

A **hybrid symbol** carries both a 2D planar (screen-plane) component and a 3D component, and displays the right one when switching between Top/Plan and 3D views. Critical constraints:

- **Lighting-device symbols must be hybrid**, and the **2D component must be a *screen-plane* representation, NOT a 2D planar object.**
- **Screen-plane objects only exist inside hybrid symbols / plug-in objects and do not appear in 3D views** — so screen-plane vs. layer-plane is a real gotcha when authoring pipe/position/instrument symbols.
- When 3D geometry reads poorly in hidden-line viewports, you can author dedicated **2D components** for the symbol to control the drawn look.
- **Records attached to a symbol definition travel with it** on import/copy — reinforcing the "embed resources" mitigation for the D-008 rebuild path.

- Sources: [Workflow: Creating lighting device symbol definitions (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/LightingDesign2/Workflow_Creating_lighting_device_symbol_definitions.htm) · [Concept: Vectorworks symbols (VW2025)](https://app-help.vectorworks.net/2025/eng/VW2025_Guide/Symbols/Concept_Vectorworks_symbols.htm) · [Screen vs layer plane in hybrid plug-ins (VW Forum)](https://forum.vectorworks.net/index.php?/topic/112373-screen-vs-layer-plane-within-hybrid-plugins/) · [Store and Convey Multiple Representations with Hybrid Symbols (VW newsroom)](https://www.vectorworks.net/en-US/newsroom/store-and-convey-multiple-representations-with-hybrid-symbols)

### F-006 — DWG export/import fidelity (feeds D-008 rebuild hedge) · 2026-07-16 · Confidence: High

The single most important gotcha for the D-008 DWG round-trip: **a DWG/DXF "layer" maps to a Vectorworks *class*, not a Vectorworks layer.** Vendor docs say DWG layers "correspond more closely to Vectorworks classes."

- **Map classes ↔ DWG layers on import/export.** You can use AIA standard layer names or a custom set, and **save reusable mapping sets** (stored in User Data / shareable via workgroup folders).
- **Symbols, plug-ins, layer links, and groups export as blocks.** Symbol blocks keep the symbol name; plug-ins/layer links get generic names unless named in the OIP Data tab. There's an option to **decompose** symbols/groups/PIOs to simple geometry on export.
- **Version range:** VW imports DWG/DXF v2.5–2025, exports v12–2025. DWG is safer than DXF for files with image links.
- **Round-trip coordinate integrity depends on origin discipline** (see F-007): imports can land far from the internal origin and cause precision/working-plane issues.
- **Net for D-008:** the DWG round-trip is a real hedge, but expect *de-classing/renaming* and block-name genericization. Clean class naming (F-002), named plug-ins, and embedded + laid-out resources (F-005) are what make the re-import survivable. Confirms the DECISION-LOG note to keep resources embedded and cleanly laid out.

- Sources: [Mapping DXF/DWG layer and class names (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/DXFDWG/Mapping_DXFDWG_layer_and_class_names.htm) · [DXF/DWG import options — layers ≈ classes (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/DXFDWG/DXF_DWG_and_DWF_import_options.htm) · [DXF/DWG file export — symbols/groups as blocks (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/DXFDWG/DXF_DWG_and_DWF_file_export.htm) · [DXF/DWG file formats — version range (VW2025)](https://app-help.vectorworks.net/2025/eng/VW2025_Guide/DXFDWG/DXF_DWG_and_DWF_file_formats.htm)

### F-007 — Origin / reference lines · 2026-07-16 · Confidence: High (mechanics) / Medium (CL×PL convention)

**Mechanics (High):** the **internal origin** is fixed at (0,0) and cannot move; the **user origin** is movable and all displayed coordinates are relative to it. Work within **~5 km / a few miles of the internal origin** or rendering and precision degrade. All design layers share one user origin; each sheet layer has its own. `Center Drawing on Internal Origin` pulls far-flung geometry back (common fix after a DWG import).

**Theatrical convention (Medium — practitioner-sourced, widely used):** set the drawing so the **intersection of center line (CL) and plaster line (PL) sits at 0,0 on the internal origin** — snap the CL/PL intersection onto the internal-origin target. Gives every designer a shared, meaningful reference for coordinates.

> **STATUS: OPEN (2026-07-16).** Michael has not yet locked an origin convention; under active discussion. Recommendation on the table = CL × PL = 0,0 coincident with internal origin. Do NOT promote to Standards until ruled.

- Sources: [Concept: Internal origin and user origin (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/Setup/Concept__Internal_origin_and_user_origin.htm) · [Setting the user origin (VW2024)](https://app-help.vectorworks.net/2024/eng/VW2024_Guide/Setup/Setting_the_user_origin.htm) · [Centering the drawing on the internal origin (VW2026)](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/Setup/Centering_the_drawing_on_the_internal_origin.htm) · [The Vectorworks Internal Origin and You (Focus Notes — CL/plaster-line convention)](https://focusnotes.wordpress.com/2015/08/26/the-vectoworks-internal-origin-and-you/)

### F-008 — Existing standard templates & references · 2026-07-16 · Confidence: High

- **Vectorworks itself recommends a template workflow:** build a file holding your standard classes, design layers, resources, page size, and default attributes, then `File > Save As Template`. New show files start from it (or import standard elements from it). This is directly the Phase 1 "reusable package skeleton" pattern.
- **Spotlight ships default content libraries** (thousands of symbols) plus **preformatted reports**; resources are managed via library files (local / network / cloud).
- **USITT RP-2, *Recommended Practice for Theatrical Lighting Design Graphics*** (2006; a revised *Lighting Documentation RP* was in public review 2024) is the graphics standard most industry plots follow — symbols, line styles, labels, instrument conventions. The strongest external standard to align our class/symbol/graphic choices to.
- **Net:** borrow from BOTH — Spotlight's default libraries/reports as the tooling baseline, USITT RP-2 as the graphics-language standard our template conforms to.

- Sources: [Lighting Design workflow — Save As Template (VW2019)](https://app-help.vectorworks.net/2019/eng/VW2019_Guide/LightingDesign1/Lighting_Design.htm) · [Resource Management for Entertainment Design (VW newsroom)](https://www.vectorworks.net/en-US/newsroom/managing-resource-libraries-vectorworks-spotlight) · [USITT Lighting Documentation RP — 2024 review draft (PDF)](https://www.usitt.org/sites/default/files/2024-10/USITT%20Lighting%20Documentation%20RP-Review%20Draft%202024-10-17.pdf) · [USITT RP-2 (2006) (PDF)](https://cad4theatre.org.uk/USITT-RP2-Lighting-Standard.pdf)

---

## Research Agenda — progress (2026-07-16)

- **8 / 8** starter questions have a first-pass, sourced Finding (F-001..F-008). Mostly vendor-grade (High); F-007's CL×PL convention and general community practice are Medium.
- **Adopted into Standards:** the layer/class division (S-1, D-012) and the master-file reference model (S-2, D-011).
- **Deeper follow-ups still open** (not blockers, refine as we build):
  - The exact **object-class tree** (steel / wood / framing / masking / …) and dash-delimited naming under S-1.
  - The exact **house layer list** (department × elevation) — the Google Sheet's ~27 layers are the working draft.
  - Which **specific reports/worksheets** to build and their **CSV columns** for the git manifest (F-004 → the D-009 design task).
  - **Origin convention** (F-007) — live open question.
  - Confirming **which USITT RP-2 symbols/graphics** we adopt vs. Spotlight defaults (F-008).
  - A hands-on **DWG round-trip test** on a sample of the actual Smith file (F-006 is doc-level, not yet empirical).

---

## Candidate decisions for Michael (NOT yet adopted — do not promote until ruled)

Remaining open candidates (adopted ones moved to Standards below):

1. **Origin convention (F-007):** lock CL × plaster line = 0,0 coincident with the internal origin, for every base/show file. — *under discussion.*
2. **D-008 DWG hedge as procedure (F-006):** maintain a saved class↔DWG-layer mapping set, keep resources embedded + laid out, name plug-ins, and run a real round-trip test before trusting it.
3. **Template strategy (F-008):** base the Phase 1 skeleton on a `Save As Template` file that conforms to **USITT RP-2** graphics and leverages **Spotlight default libraries**.
4. **D-009 export path (design task, not a yes/no) (F-004):** build class/layer/resource **reports → CSV export** as the git-manifest mechanism; column design is the open follow-up.

---

## Standards (adopted)

> A line lives here only after Michael rules; each carries a mirrored dated row in `DECISION-LOG.md`.

### S-1 — Hybrid layer/class division of labor · adopted 2026-07-16 · D-012

Our file uses a deliberate split (diverging from Spotlight's lean-layer advice because this is a multi-department master, not a single plot):

- **Layers carry LOCATION + ROUTING + ELEVATION.** A layer encodes (a) its physical location, (b) its **department** (for the master-reference routing in S-2), and (c) its **elevation band** — `0 NOTES / 1 DECK / 1.5 MEZZ / 2 TOE / 3 CATWALK`. **Elevation lives in layers, never in classes.**
- **Classes carry OBJECT CATEGORY (for filtering).** Classes are object-type based — e.g. **steel, wood, framing, masking** — so that viewports and saved views can toggle object types on/off globally. This is the object-filtering system; classes are NOT primarily a linestyle/weight bucket.
- **Naming:** object-classes follow the dash-delimited, ≤4-part hierarchical convention (F-002) so they nest cleanly in the Navigation/Organization palettes. Specific class tree = open follow-up.
- **Why:** layers answer *where / whose / what height*; classes answer *what kind of thing* for visibility control. The two systems stay orthogonal so a department file (S-2) can pull the layers it needs and still toggle object categories across them.

### S-2 — Master-file reference model · adopted 2026-07-16 · D-011

- **One dense MASTER base file** holds all departments as layers (the venue's single source of truth for geometry — architecture, rigging, positions, etc.).
- **Department / per-show files REFERENCE the master** (Vectorworks referencing / design-layer viewport references), pulling in only the layers they need rather than duplicating geometry.
- The master is authored to be referenced: clean department × elevation layering (S-1), embedded + laid-out resources (F-005/D-008), so a downstream LX/scenic/audio file is a thin consumer of the master.
- Consequence: edits to venue geometry happen once, in the master, and propagate to every referencing file.

---

*Last updated: 2026-07-16.*
