# Vale — archived reference (graduated 2026-09-10)

> Graduated out of `memory.md` under `hooks/memory-rotation.md`. **Load on demand when working the substance.**
>
> ⚠️ Everything here restates a document that is canonical elsewhere — which is why it graduated. **The source outranks this file.** Re-read the source before acting on any line.

---

## Part 1 — The standards package, as it stood 2026-07-16

Source: `maw-prose/standards/vectorworks/` (README, resources-and-symbols, sheets-and-drawing-sets, getting-data-out).

### Stated as settled

- 🔑 **The layer says WHERE it is; the class says WHAT IT IS.** Layer carries location, department, elevation. Class carries object category. Named as the origin of almost every structural mistake in these files.
- 🔑 **Elevation lives in the layer, NEVER a class.** Explicit: if you are making a class called `high` or `deck`, stop.
- **A class is not a linestyle bucket.** Pen weight and fill are drafting attributes. A class exists so a viewport can switch every piece of steel off at once.
- **The dash is FUNCTIONAL, up to four parts** — it drives nesting in the Navigation and Organization palettes. `Steel_Beam` and `Steel Beam` will not nest.
- **Datum = geometric center of the room, on the VW INTERNAL origin (0,0)**, never a shifted user origin. Precision degrades past ~5 km from internal origin (wrecking the DWG export), and every referencing file inherits the frame free. **Do not move it.**
- **Referenced Design Layer Viewport, never layer-import.** Layer-import copies everything in and bloats the file, and it is the Fundamentals default, so it happens by accident. Master and consumer must be on the same VW version.
- **Hybrid symbols: the 2D half must be SCREEN-PLANE**, not a 2D planar object. The single most common authoring mistake here.
- **Records attach to the symbol DEFINITION, not instances** — definition records auto-attach to every instance and travel with the symbol on import, which is what lets worksheets count them.
- **No commas in symbol names** — the manifests are comma-CSV.
- **Where numbers live:** on a drawing → the MODEL. Told to a new hire on their first walk → the NOTES.
- **The DWG hedge is the reason for the tidiness:** built in Educational, must be re-created licensed; a round-trip de-skins the file but returns content **only if** resources are embedded and laid out and class names are clean. ⚠️ **On a round-trip a DWG "layer" maps to a VW CLASS, not a layer.**
- **Deliberate divergence from the vendor:** Spotlight says keep layers lean, one layer for rigging/positions/instruments. The house does not — Spotlight assumes one designer's plot; this is a multi-department master others reference.
- **USITT RP-2** is the graphics standard to check a plate against.
- **VW ships Standard Naming** (`File > Document Settings > Standard Naming`, three user slots). House naming COULD be registered so new files inherit it. **Not done** — and it is the structural fix Michael's own pattern favours.

### Stated as NOT locked, in the package's own words

- **The class tree is a PROPOSAL** — 11 classes, four categories (Steel, Wood, Framing, Masking); *no authoritative Smith class list exists yet*. `Framing` and `Masking` lack the bare parent that `Steel` and `Wood` have, flagged as probably an oversight, never confirmed. **No default attributes recorded for any class**, so the first person to draw sets them by accident and everyone inherits it. Lighting/audio/video classes absent ON PURPOSE — they arrive via Spotlight auto-classing.
- **Sheet numbering is DRAFTED** from the department-prefix scheme.
- **The layer list is a WORKING DRAFT** — nine rows with no status, three with no elevation band, one flagged `CUT?` since authoring.

---

## Part 2 — Vendor mechanics (read out of VW help, 2026-09-08)

⚠️ **VERSION-BOUND, and none of it is ruled.** VW changes per release and the file is Educational. Re-check the edition before asserting any of it (`hooks/source-freshness-gate.md`), and **read the year in the help URL** (C2).

- 🔑 **`Create Plot and Model View` IS DEAD — replaced by Schematic Views in VW2020.** Its help pages still resolve and read as current. Documented defect: non-horizontal positions exported to MA3D at their PLAN position, flat on the floor. **Never recommend it.**
- **Schematic Views** (`Spotlight > Visualization`) are live 2D references to rigging objects and their loads, not copies. **Object position = drawing only, model does not move; hanging point = the model DOES move.** Dragging a schematic load to another rigging object reassigns it for real. `Replace Lighting Device`, `Find and Modify`, Spotlight Numbering and data tags all act through them onto the model. Auto-numbering follows the SCHEMATIC layout. ⚠️ No auto-update — stale objects carry a red-and-white striped border (`Update Geometry` / `Update All Schematic Views`). 2D only, so never in Braceworks calculations.
- 🔑 **A viewport is OUTPUT; a schematic view is a second way to TOUCH the model.** A viewport's contents are not selectable objects.
- **Sections come off live geometry** via section viewports; `Display 2D components` shows a hybrid symbol's 2D half facing the view, falling back to 3D where there is none. **This vindicates the parked theory** (geometry as 3D symbols projected as hidden line). `Hidden Object Display by Class` means **the class tree literally decides what a section looks like** — build the tree for viewport filtering, not tidiness.
- **Hanging positions: EMBED the geometry, do not make a symbol**, whenever Braceworks, MVR export or previz are in play; embedded geometry is easier to revise, and trusses and pipes **cannot snap to a hanging position**. Symbol-ise only to repeat an identical position. **A toe pipe wants to be a rigging object with a Position Name, not a class** — independent support for the elevation-in-layer rule.
- **Reserved vs authored record formats.** `Parts`, `Light Info Record`, `EntEquipUniversal` are a **name-and-value contract the plug-in queries** — import verbatim from a Spotlight library file, never hand-author a record of the same name. Authored records are inert and ours to design. **A record never "unlocks" behaviour; it satisfies a lookup.** `Purge`'s Special Record Formats option is the tell that VW uses records as its own storage layer.
- **`Parts` attaches to FIVE components** — body, lens, 3D locus (rotation point), yoke, base — plus every accessory and emitter locus, INSIDE the symbol. One of each per symbol; a part may be a group, and an individually-attached record beats the group's. Never group an accessory with anything. Clamps are `Base`. **The 3D locus must sit at exactly X,Y = 0,0.** Floor-mount feet are `Yoke`, not `Base`, because the device tilts on them.
- 🔴 **Spotlight AUTO-CLASSING is the real class-tree polluter, and it is not the symbol's fault.** It invents a class per field value with a prefix/suffix, and VW separately auto-creates `Label` + subclasses, `Setup Notes`, beam-angle, field-angle, centerline, witness-line and footprint classes. **Bridle Preferences does the same per bridle part.** Left on defaults the tool builds a class tree nobody designed. **Set these prefs IN THE TEMPLATE.**
- **Viewport Data Visualization** drives object attributes off record values, per viewport, by value or numeric range. **Some of what one is tempted to class for is a data-visualization job instead. Decide this BEFORE ratifying the class tree.**
- **Library file hygiene** (VW's own guidance): nothing on any design or sheet layer, convert geometry to **generic solids** to kill modeling history, keep a separate modeling file, **save with the VGM cache OFF**. Custom libraries live in the user or workgroup folder mirroring VW's own structure; referenced resources show **italicised**. `File Health` has named tests for oversized symbols and textures.
- **GDTF is for DATA, not geometry.** `Update GDTF Files` auto-fetches by the Light Info Record's `GDTF Type ID` + `GDTF Fixture Mode`; MVR carries model and patch. Forum and console-vendor evidence: **GDTF geometry is often worse than VW's own**, and high vertex counts have corrupted meshes downstream. **No previz means the whole GDTF layer is dead weight.**
- **Bridles are NOT rigging objects and take no schematic views.** The tool is `Create Bridle Assembly Diagrams` (labelled parts, optional parts list, sheet or design layer, `Update Object`, `Activate Bridle`), with `Create Bridle Report` and `Manage Bridle Parts`. ⚠️ **A second, purpose-built inventory surface in the same file** — reconcile against any house resource inventory rather than duplicating it.
