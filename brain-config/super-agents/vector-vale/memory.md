# Vale — Memory (patterns + ruled conventions)

> PATTERNS and RULED CONVENTIONS only. Counts, statuses and project phase live in the LIVE STATE block on [Vale's Agent Index row](https://app.clickup.com/t/86ake8men) (base spec §4a). **A number in this file is a defect on sight — move it, do not refresh it.**
>
> ~10KB hot cap (`hooks/memory-rotation.md`). Graduated content → `memory/archive/`. ⚠️ **OVER CAP as of 2026-09-08 — rotation is due; the package-summary block in Ledger B is the graduation candidate, since it restates a document that is itself canonical.**

---

## 📒 Ledger A — Conventions Michael has RULED

**STILL EMPTY, and after one session of reading I can say what that means precisely.** This is the ledger that justifies Vale's class and the one his retirement condition is keyed on (`decision-log.md` D1).

⚠️ **The distinction that took a session to find, and it is sharper than "nothing is written down":** a substantial, dated, sourced standards package EXISTS (see Ledger B). What does not exist is a RULING on the three decisions that organize everything else — **the class tree, the sheet numbering, and the layer list are all labelled unratified in their own text.** So the correct read of an empty Ledger A is *the conventions are drafted but not ruled*, never *the conventions are missing*.

🔴 **Written-and-sourced is not the same as ruled, and conflating them is the specific way this ledger gets falsely filled.** A page dated 2026-07-16 and citing vendor documentation looks exactly like a decision. Ledger A takes a convention only when Michael has RULED it, with the date and the reason.

⚠️ **Second working session (2026-09-08) also ended with ZERO rulings**, against four candidates put to him directly: library-as-separate-file vs template-is-the-library · previz yes/no (it scopes the whole GDTF layer) · reserved-records-imported-verbatim-never-authored · sections-are-viewports-never-drawings. **Per D1 that is two real sessions. The retirement condition is now DUE and goes to Michael with this evidence.**

## 📕 Ledger B — What exists, and what it says about itself

### The standards package (READ THIS BEFORE PROPOSING ANY STRUCTURE)

`mawizorek/maw-prose` — **`standards/vectorworks/`** (`README.md` · `resources-and-symbols.md` · `sheets-and-drawing-sets.md` · `getting-data-out.md`) and **`venues/smith-theatre/`** (`README.md` · `classes.md` · `layers.md` · `electrics.md`, plus a `classes/` dir). All stamped *checked 2026-07-16*.

⚠️ **Vale's own memory was built without this and implied the conventions were unwritten. They were not.** That is the B12 shape (designing what already exists) and it was avoided at topic-time only because the container got opened before anything was proposed. **Open it every time.**

**Conventions the package states as settled:**

- 🔑 **The layer says WHERE it is; the class says WHAT IT IS.** Layer carries location, department and elevation (`LX - PLOT 2 TOE PIPES`); class carries object category (`Steel-Pipe`). Described as the origin of almost every structural mistake in these files.
- 🔑 **Elevation lives in the layer, NEVER in a class.** Explicit: if you are making a class called `high` or `deck`, stop.
- **A class is not a linestyle bucket.** Pen weight and fill are drafting attributes, not categories. A class exists so a viewport can switch every piece of steel off at once.
- **The dash is FUNCTIONAL, up to four parts** — it drives nesting in the Navigation and Organization palettes. `Steel_Beam` and `Steel Beam` will not nest. This is why the naming grammar is not cosmetic.
- **The datum is the geometric center of the room, on the Vectorworks INTERNAL origin (0,0)**, never a shifted user origin. Do not move it. Reasons given: precision degrades past ~5 km from internal origin (which would wreck the DWG export), and every referencing file inherits the frame free.
- **Use a referenced Design Layer Viewport, never layer-import.** Layer-import copies everything in and bloats the file, and it is the Fundamentals default, so it happens by accident. Master and consumer must be on the same VWX version.
- **Hybrid symbols: the 2D half must be a SCREEN-PLANE representation**, not a 2D planar object. Named as the single most common authoring mistake here.
- **Attach records to the symbol DEFINITION, not to instances** — definition records auto-attach to every instance and travel with the symbol on import, which is what makes worksheets able to count them.
- **No commas in symbol names** — the manifests are comma-CSV.
- **Where numbers live:** if it would go on a drawing, it lives in the MODEL; if you would tell it to a new hire on their first walk, it lives in the NOTES. A load rating or a datum convention is a property of the building, and burying it behind a license is how it gets lost.
- **The DWG hedge is the whole reason for the tidiness:** the file was built in Educational and must be re-created licensed, and a DWG round-trip de-skins the file but brings content back **only if** resources are embedded and laid out and class names are clean. ⚠️ **On a round-trip a DWG "layer" maps to a VWX CLASS, not a layer.**
- **Deliberate divergence from the vendor:** Spotlight says keep layers lean and put rigging, positions and instruments on one layer. The house does not, because Spotlight assumes one designer's plot and this is a multi-department master that other files reference.
- **USITT RP-2** is the graphics standard to check a plate against.
- **Vectorworks has built-in Standard Naming** (`File > Document Settings > Standard Naming`, three user slots). The house naming COULD be registered there so new files inherit it instead of relying on memory. **Not done.**

### What the package says is NOT locked (its own words)

- **The class tree is a PROPOSAL** — 11 classes in four categories (Steel, Wood, Framing, Masking), and *no authoritative Smith class list exists yet*. `Framing` and `Masking` lack the bare parent class that `Steel` and `Wood` have, flagged as probably an oversight, never confirmed. **No default attributes recorded for any class**, which means the first person to draw sets them by accident and everyone inherits it. Lighting/audio/video classes are absent ON PURPOSE — they arrive via Spotlight auto-classing.
- **Sheet numbering is DRAFTED** from the department-prefix scheme.
- **The layer list is a WORKING DRAFT**, nine rows carrying no status, three rows with no elevation band at all, and one flagged `CUT?` since it was authored. ⚠️ **The uniform design-layer scale value is recorded NOWHERE** — the package names this as the gap most likely to bite during a reference or viewport setup, and it is one of Michael's own open questions.

### 🔧 Vendor mechanics the package does NOT cover (read out of VW help, 2026-09-08)

⚠️ **All of it is VERSION-BOUND and none of it is ruled.** Vectorworks changes per release and Michael's file is Educational, so re-check the edition before asserting any of it (`hooks/source-freshness-gate.md`).

- 🔑 **`Create Plot and Model View` IS A DEAD COMMAND — replaced by Schematic Views in VW2020.** Its help pages still resolve and still read as current. Its documented defect: non-horizontal positions exported to MA3D at their PLAN position, flat on the floor, because the model view was only a viewport reference to geometry still defined flat. **Never recommend it.**
- **Schematic Views** (`Spotlight > Visualization`) are live 2D references to rigging objects and their loads, not copies. Two control points and they differ: **object position = drawing only, the model does not move; hanging point = the model DOES move.** Dragging a schematic load to a different rigging object reassigns it for real. `Replace Lighting Device`, `Find and Modify`, Spotlight Numbering and data tags all act through them onto the model. Auto-numbering order follows the SCHEMATIC layout. ⚠️ They do NOT auto-update — out-of-date objects carry a red-and-white striped border, fixed by `Update Geometry` / `Update All Schematic Views`. 2D only, so never in Braceworks calculations.
- 🔑 **A viewport is output; a schematic view is a second way to TOUCH the model.** A viewport's contents are not selectable objects. This is the distinction to keep, because it also means sections are viewports that can look AT the schematic layer.
- **Sections come off live geometry** via section viewports; `Display 2D components` shows a hybrid symbol's 2D half facing the view and falls back to 3D where there is none. **This vindicates the theory parked in the commented-out `layers.md`** (geometry as 3D symbols projected as hidden line) against vendor docs. `Hidden Object Display by Class` means **the class tree literally decides what a section looks like** — build the tree for viewport filtering, not for tidiness.
- **Hanging positions: EMBED the geometry, do not create a symbol**, whenever Braceworks, MVR export or previz are in play; embedded geometry is also far easier to revise, and trusses and pipes **cannot snap to a hanging position**. Symbol-ise only to repeat an identical position. A toe pipe wants to be a **rigging object with a Position Name**, not a class — more evidence for the standard's side of the elevation-in-class argument.
- **Reserved vs authored record formats.** `Parts`, `Light Info Record` and `EntEquipUniversal` are a **name-and-value contract the plug-in queries** — import them verbatim from a Spotlight library file, never hand-author a record of the same name. Authored records are inert and are ours to design. A record never "unlocks" behaviour; it satisfies a lookup. `Purge`'s **Special Record Formats** option (records storing PIO defaults) is the tell that VW uses records as its own storage layer.
- **`Parts` attaches to FIVE components** — body, lens, 3D locus (rotation point), yoke, base — plus every accessory and emitter locus, INSIDE the symbol. One of each per symbol; a part may be a group, and an individually-attached record beats the group's. Never group an accessory with anything. Clamps are `Base`. **The 3D locus must sit at exactly X,Y = 0,0.** Floor-mount feet must be declared `Yoke`, not `Base`, because the device tilts on them.
- 🔴 **Spotlight AUTO-CLASSING is the real class-tree polluter, and it is not the symbol's fault.** It invents a class per field value with a prefix/suffix, and VW separately auto-creates `Label` + subclasses, `Setup Notes`, beam-angle, field-angle, centerline, witness-line and footprint classes. **Bridle Preferences does the same thing per bridle part, with its own class prefix.** Left on defaults the tool builds a class tree nobody designed. Set these prefs IN THE TEMPLATE.
- **Viewport Data Visualization** drives object attributes off record values, per viewport, by value or numeric range. Some of what one is tempted to class for is a data-visualization job instead. Decide this BEFORE ratifying the class tree.
- **Library file hygiene** (VW's own resource-library guidance): nothing on any design or sheet layer, convert geometry to **generic solids** to kill modeling history, keep a separate modeling/creation file, and **save the library with the VGM cache OFF**. Custom libraries live in the user or workgroup folder mirroring VW's own folder structure; referenced resources show **italicised**. `File Health` has named tests for oversized symbols and textures.
- **GDTF is for DATA, not geometry.** `Update GDTF Files` auto-fetches by the Light Info Record's `GDTF Type ID` + `GDTF Fixture Mode`; MVR carries the model and patch. Forum and console-vendor evidence: **GDTF geometry is often worse than VW's own** and high vertex counts have corrupted meshes downstream. If there is no previz, the entire GDTF layer is dead weight.
- **Bridles are NOT rigging objects and do not take schematic views.** The purpose-built tool is `Create Bridle Assembly Diagrams` (labelled parts, optional parts list of Name/Short Name/Count, sheet or design layer, columns, `Update Object`, `Activate Bridle`), with `Create Bridle Report` for the worksheet and `Manage Bridle Parts` for the parts inventory. **This is a second, purpose-built inventory surface in the same file** — reconcile it against any house resource inventory rather than duplicating it.

### 🔴 Leads that need Michael, not research

- **`venues/smith-theatre/layers.md` renders as almost nothing.** Its entire body — the whole layer list, the known-gaps note, both conventions — sits inside an HTML comment block, and the visible intro truncates mid-sentence on the word "hidden line". ⭐ **This is the same file that was shipped to repair the governance-without-reference failure, and it is now reference that renders as nothing.** Cause unknown: possibly parked mid-restructure toward "geometry canonically lives as 3D symbols, projected as hidden line." **Do not un-comment it on assumption** — ask. ⚠️ Still unfixed as of 2026-09-08, and the vendor docs now SUPPORT the parked theory, which raises the cost of leaving it invisible.
- **A live contradiction between the locked rule and Michael's own note.** The standard says elevation never in a class; `URITP-4421` asks for *"CLASS for toe pipes, mid pipes, high pipes"* with galleries maybe in a `GALLERY` super-class. Trim height is elevation. **The class tree cannot be ratified while this is open.**
- **The Educational-edition problem is load-bearing:** the template will have to be redone, therefore *take good notes*. The documentation is the deliverable, not the file.
- **A collaborator at the venue is building a PARALLEL 3D model** of the same room, trims measured on site, classes and layers in progress, and has invited suggestions. ⚠️ Two models of one room is the reconciliation problem Vale exists to prevent — a live seam, never a resource to quietly absorb, and never assume which file is fresher.
- **Michael's own unanswered questions** (from `URITP-4421` and the reference tree): the layer scale value · how pipes and hang positions should be handled (symbol, hang position, or group per instance) · what N/S/E/W needs to mean · whether an inventory worksheet should drive default layer and class per object · whether third-party scripts get bought.

## 📗 Ledger C — Recurring file problems

Fills with what actually keeps going wrong: the resource always in the wrong class, the symbol nobody can find, the reference that breaks on every move, the convention re-litigated every term.

- **C1 · Documentation that exists and does not render.** One instance: `layers.md`, whole body inside an HTML comment. ⚠️ Still ONE instance — kept here as a watch item, not yet asserted as a pattern.
- **C2 · Vendor documentation that resolves cleanly at a STALE version and reads as current.** One instance, and it was mine: recommended `Create Plot and Model View` off a 2018 page, four years after VW2020 replaced it. **VW help URLs carry the year in the path and every version's page stays live**, so a search result is a version lottery. 🔑 **Read the year in the URL before quoting the page**, and prefer the current-version path. Related to `layers.md` only in shape, not cause: both are documents that look present and are not true.

---

## How Michael works (inherited from the fleet, confirmed patterns only)

- **Collapses duplicate sources of truth on sight. Never propose a mirror.** A second library of the same resources is that failure in a different runtime.
- **Chooses the structural fix over another behavioural rule.** "Make it impossible to skip" beats "write it down louder" every time. ⭐ The package already has an instance of this waiting: registering the house naming in VWX Standard Naming so new files inherit it, rather than trusting anyone to remember. ✅ Confirmed again 2026-09-08: he ruled that activity and learning get written AS WE GO, automatically, rather than relying on a session remembering to log (`decision-log.md` D6).
- **Wants the reasoning kept, not just the outcome.** A convention with no recorded why gets overturned by the next person who finds it inconvenient.
- **Answers structural questions through a Decision Log**, in bulk, fast, inverted polarity. Ask completely, ask once, mutually exclusive options, end on the one question that settles it.
- **He will delete a thing he just paid to fix.** Sunk cost is not an argument he accepts.
- **He knows this craft far better than the documentation does.** ⚠️ The fleet has already been burned once telling him something wrong about his own profession (electrics is lighting, audio AND video — not a synonym for lighting). **A claim about his domain is mine to ASK, never to assert.**
- **Dictates.** A garbled term is more likely mis-heard than wrong — name the non-resolution, offer the candidate, ask, stop.
- **He asks HOW IT WORKS, not just what to do.** Confirmed 2026-09-08: *"i will use manuf. but want to know whats going on."* He adopts a mechanism faster once he knows what it is doing underneath, and he wants the seams and the slop named. A bare recommendation with no mechanism is worth less to him than the mechanism alone.

## Where Vale expects to be wrong

- **Confusing what the file DOES with what Michael DECIDED.** Geometry is evidence of a choice, not a record of one, and the file is right there while he is not.
- **Confusing SOURCED with RULED.** A dated page citing vendor docs reads as settled. Three of the biggest decisions in this package say "proposal" in their own text.
- **Treating a document as present because the file exists.** `layers.md` is 3.7KB and renders nearly blank. **Read the rendered content, not the file listing.**
- **Designing a class tree before knowing what gets FILTERED.** The tree exists to toggle things in viewports; one built from tidiness instead of real view requirements is elegant and useless.
- 🔴 **Quoting vendor documentation without checking WHICH VERSION I am reading.** Proven live 2026-09-08 (C2). A resolving URL is not a current one, and this is the failure most likely to put a confidently wrong instruction in front of him about his own file.

## Pointers (never restate)

- 🔑 **The standards package:** `maw-prose` → `standards/vectorworks/` + `venues/smith-theatre/`. **The substrate for everything. Re-derive the repo coordinate at read time (`gates/repo-referent-gate.md`); do not carry it.**
- **The working task:** `URITP-4421` in URITP ▸ (Summer) Projects — open to-ponder/to-add/cleanup banners and the structural notes. ⚠️ Several of its open items are answered by mechanisms VW already ships (pipes and hang positions → rigging objects + schematic views; *"pipe trims in all sections"* → section viewports off live geometry). **Check the tool before designing the answer.**
- **The ClickUp reference tree:** the `Vectorworks` page under MAW Documents, with the Smith template page (classes, layers, sheet layers, resources, recreate), notes, drafting notes and base-show-files subpages. ⚠️ **Overlaps the repo package — assume nothing about which is fresher.**
- **The empty ClickUp surface:** `Resource FOLDERS`, URITP Inventories ▸ VWX Base Showfile ▸ RESOURCES. Scaffolded, unpopulated. ⚠️ Empty means never populated, not nothing to store.
- ⚠️ **There is no one-click symbol inventory in Vectorworks** — community-confirmed tool gap, not a missing skill. The path is a worksheet database row exported to CSV (`getting-data-out.md`), columns `name, type, default_layer, default_class, count`. **A symbol inventory does not exist until someone runs that export.**
- **The teaching surface:** drafting a light plot sits in the LX course planning (Tate's lane, Vale's standard).
- Fiona's FileMaker Canonical Object Library — the cross-runtime twin of this problem.
