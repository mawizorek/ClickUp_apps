# Vale — archived reference: referencing, storage and performance (2026-09-12 → 09-19)

> Graduated straight to archive on 2026-09-20 under `hooks/memory-rotation.md`. **Load on demand when
> working referencing, file-open performance, or a crash report.** The PATTERNS from these sessions are
> in `memory.md`; this file is the substance.
>
> ⚠️ **Everything here is VERSION-BOUND and none of it is RULED.** Vectorworks changes per release,
> Michael's files are Educational edition, and every line below was read out of the `/2026/` help path
> or first-party release notes on the date stamped. **Re-read the source before acting** (C2: read the
> year in the URL). 🚫 It is a record of what the vendor SAYS, never of what Michael has DECIDED.
>
> 🔴 **Written retroactively from Vale's Agent Index transcripts, five sessions, 2026-09-12 to 09-19.**
> The git pass was flagged overdue four consecutive times and did not happen; this file is that debt
> paid. **Anything below that reads as a live measurement is not one — no `.vwx` was ever opened.**

---

## Part 1 — 🔴 The headline finding: his symptoms are NAMED VW BUGS (read 2026-09-19)

First-party, `release.vectorworks.net`, **VW2026 Update 2.1** release notes. Verbatim titles:

- **`VB-216958`** — *"2026 update File open takes forever to open"*
- **`VB-216838`** — *"File crashes when updating reference"*
- `VB-216835` — *"Slow response when working with Lighting devices"*
- `VB-217012` — *"Vectorworks gets stuck during launch"*
- `VB-216202` — *"Performance issue under Tahoe 26.0.1"*

**Update 2 also carries:** `VB-215565` Crash when updating Reference · `VB-215748` VW Crash on File Open ·
`VB-215913` Crash on File Open · `VB-214671` VW Document does not open - Verifying File ·
`VB-215146` Crashes after Deleting Several DLVPs.

⭐ **Michael's two complaints — slow open, crash while updating references — are acknowledged defects
with fix IDs.** Everything in Parts 2-4 is a CONFIGURATION story that may be sitting on top of a
VERSION story. **The first question is his update level (`Vectorworks ▸ About Vectorworks`), not which
setting.** If he is on Update 0 or 1, the cheapest available fix is an installer.

⚠️ **A named bug with a matching title is strong evidence, not proof** of his exact reproduction.
⚠️ `VB-216202` makes his **macOS version** part of the question — a variable four sessions never touched.

---

## Part 2 — Referencing mechanics (read 2026-09-17 / 09-18, `/2026/` path)

### The three levers that make reference updates expensive

All in `Tools ▸ Organization ▸ References ▸ Settings`:

1. 🔑 **`Check for out of date references every ___`** — *"Automatically checks referenced files for
   changes after this time interval; if any references are out of date, an alert dialog box opens."*
   **A TIMED POLL of every master while he works.** On evicted cloud masters, a poll is a download.
   ⭐ **Strongest candidate for a crash "while working smoothly"** — timer-driven, needs files that may
   not be local, arrives with no user action. Gives the crash a **time-shaped** hypothesis.
2. 🔑 **`When manually updating`** — updates *"only the selected references that are out of date"* OR
   *"all of the selected references."* **Set to ALL, every manual update re-reads every master whether
   or not anything changed.** One setting; the difference between updating one file and twelve.
3. **`Use reference priority when updating resources`** — docs say deselect, *"this is recommended"*:
   with it on, an individual update can silently change a resource's source file. A CORRECTNESS lever.

### Open-time cost

- **References resolve AT OPEN.** `Save referenced cache to disk` deselected means *"a copy of the
  referenced data is not saved... the referenced data is updated when the target file is opened,"* and
  `Automatically update out of date reference during file open` re-reads every master every open.
- **Cache absence INVERTS to open-time cost.** `Save viewport cache` and `Save VGM graphics cache` both
  trade file size for open speed. ⭐ **A file that opens slowly because it is THIN is not the same defect
  as one that opens slowly because it is FAT, and the fix is opposite.**
- **Autosave rides the same path.** `Overwrite original file` rewrites the whole document, and
  `Autosave a backup copy to` can point at a network drive. **A mid-session crash with no user action
  is autosave-shaped.**

### Path mode — and the correction that matters

- **`Save reference location as`** offers relative: *"use the relative path when the files might be
  moved to another computer or platform; as long as the relative path between the files remains the
  same, the reference can be found. Both files must be saved on the same volume."*
- 🔴 **So "moving the files breaks every reference" is TRUE ONLY FOR ABSOLUTE PATHS.** The Concept page
  sentence (*"if either the file name or the location of a referenced file is changed, the reference is
  broken"*) is a generalization the per-reference dialog contradicts. **Moving the WHOLE tree together,
  intact, on one volume, preserves relative references.** ⭐ **Check the path mode BEFORE the move.**

### Method: DLVP vs layer import

- **Design layer viewport referencing is the DEFAULT in Design Suite products**; layer import carries
  *"for backward compatibility"* (= the "classic / old-school" method). Spotlight is Design Suite, so
  the default resolves for his license. ✅ **Michael confirmed 2026-09-18 he is on the current default.**
- 🔑 **DLVP BOUNDS the chain:** *"all of the layers, classes, and resources from the master file are not
  automatically imported into the target file."* Layer import has no such limit, so every hop drags in
  everything. **His open-time problem is FETCH cost, not IMPORT bloat** — fixable with the cache and
  auto-update switches, no re-architecture.
- **Switching methods auto-converts:** *"any existing referenced layers are automatically converted into
  referenced design layer viewports."* Never a one-way door.
- **`Existing Reference`** in Select Viewport Source means multiple DLVPs can ride ONE reference to the
  same master. ⭐ **The open-time cost is the ROWS on the References tab, not the viewport count** — his
  reference count may be an overcount, and reading the row count is a one-glance correction.

### Chains (references through references)

- 🔴 **VW DOES NOT DOCUMENT whether updating cascades down a chain, or whether open-time resolution
  recurses.** Six referencing pages read end to end; not one states it. **Stays marked unknown.** He can
  settle it in sixty seconds: open a master and read its OWN References tab.
- 🔑 **Chains are anticipated BY DESIGN.** From `Creating a referenced design layer viewport`:
  *"Circular references are not allowed; for example, if file A references file B, and file B references
  file C, then file C cannot reference file A."* **VW's own rule uses a three-deep chain as its example.**
- 🔴 **The same sentence names a loophole:** *"The exception is if one of the references uses the
  referencing in the Vectorworks Fundamentals product (layer import)."* **DLVP refuses a circular chain;
  layer import does not.** 🔻 **DOWNGRADED for Michael 2026-09-18** — he is on DLVP, so VW blocks it for
  him. Still live for any master that is on the legacy method.
- 🔴 **`Resources in layers that are referenced from the master file take precedence over resources in
  the target file.`** Down a chain that is a file he never opened outranking his own resources.
- 🔴 **`Update class definitions`** — *"updates class definitions along with the referenced objects that
  use those classes."* Marked *"Vectorworks file references only,"* NOT layer-import-only, so viewport
  references carry it. **It is ABSENT from the Select Viewport Source dialog and lives only in Edit on
  the References tab** — so if every reference was made through Create Viewport, he has plausibly never
  seen this switch. ⭐ **A default he never chose, writing class attributes into an unratified class
  tree.** Its default state is NOT documented. **The actor authoring his class tree is not a person, it
  is a reference update.**
- ⚠️ **`Referenced Vectorworks files must be the same version as the target file.`** A master still at
  2025 is not a slow reference, it is a non-functional one.
- 🔴 **The Organization dialog shows HIS references. It does NOT show his masters' references.** He
  cannot audit tier two from the surface that is supposed to tell him what his file depends on.

---

## Part 3 — Storage: iCloud Drive (read 2026-09-17, Apple Mac Help)

🔴 **The finding is not "cloud storage is slow." It is that iCloud Drive can hold a file that LOOKS
PRESENT and contains no data.**

- **`Optimize Mac Storage`** / *"Store older documents in iCloud when space is needed"*: *"Your Mac can
  automatically store documents in iCloud when more space is needed."* Evicted items are **dataless** —
  since Sonoma there is no visible `.icloud` stub, **the file shows its FULL SIZE in Finder** and only
  the iCloud Status column reveals `NotDownloaded`. Opening one triggers a download first.
- `Download Now` and **`Keep Downloaded`** exist precisely because eviction is automatic and invisible.
- 🔑 **Why it is catastrophic for HIS file shape:** a reference is read AT OPEN, not at draw time, so a
  heavily-referenced target forces macOS to reconstitute N evicted masters before a single line appears
  — then the drawing is resident and fast. **That is his exact symptom.** The cost is not in his
  geometry, it is in his dependency graph meeting a storage layer that lies about what is local.
- ⚠️ **iCloud Drive is ABSENT from VW's recognized-cloud list** (VW names Vectorworks Cloud Services,
  Box Drive, Dropbox, Google Drive, OneDrive, Resilio Sync). **Reported as an ABSENCE from a
  project-sharing page, NOT as a prohibition on plain `.vwx` files** — he is not on project sharing.
- 🔴 **THE ORDER TRAP.** The obvious fix is "move everything local," and per Apple **moving evicted files
  can move EMPTY PLACEHOLDERS while iCloud treats the move as a deletion of the real data.** Documented
  data-loss class. **Turn Optimize OFF (or `Keep Downloaded` the whole tree) and let it fully download
  BEFORE moving anything.** Then move the whole tree at once and repair references once.
- ⚠️ Practitioner reports that VW opened a file *"before it had finished syncing"* are forum-grade and
  carry no weight above the vendor citations.

---

## Part 4 — Memory, logs, and the machine side (read 2026-09-17 / 09-19)

### What actually consumes memory

- **Undo is the cheapest big win.** Session pane: *"Undo information is kept in memory, so the higher the
  maximum number of undos, the more memory may be required,"* and *Streamline drawing interactions*
  (2026): *"we recommend setting the maximum number as low as you can to save memory usage."* Grouping
  view changes makes a low number livable.
- 🔑 **The only hard RAM number in the docs:** Display pane, `Use VectorCaching for faster drawing` —
  *"while this makes screen redraws faster, it also can potentially increase RAM requirements by up to
  50 percent."*
- **Two DOCUMENT-level caches:** `Save viewport cache` (rasters, PNG/JPEG per the Edit pane compression
  preference) and `Save VGM graphics cache`. Both trade file size for open/redraw speed.
- **Resources load with the document whether used or not**, which is why `Purge` only touches UNUSED
  ones. Two placed manufacturer symbols with fat 3D bodies are not purgeable and are still in memory.
- **Scripted plug-in objects are** *"compiled once and stored in memory"* — the mechanism behind
  per-click regeneration cost on lighting devices.
- **`Check File Health` (2026)** is effectively VW's own list of what makes a file slow: 3D polygons in
  groups (*"three times as many vertices"*), high-vertex polygons, small sweep increment angles, hatch
  levels, oversized textures, transparent 2D symbols, bounding box far from origin, legacy 2D/screen
  plane, and **`Corrupted Plug-in Objects` — *"can cause a file to crash,"* the only test on that page
  with crash as the stated outcome.** ⚠️ **Gated on a Vectorworks SUBSCRIPTION per the page itself, and
  his files read as Educational, so availability is UNVERIFIED** — do not tell him to run it as if it is
  there.

### Logs

- 🔑 **`Log time in program`** (Session pane) — *"records in a log file the time spent in the program, as
  well as the time spent to open and close documents."* **It literally times file opens.** Writes
  `Vectorworks Log` into the User Data and Preferences folder. **OFF by default. This is the one thing
  that turns "forever" into a number.**
- **User folder:** `/Users/<user>/Library/Application Support/Vectorworks/2026`, reachable via the User
  Folders pane **`Reveal in Finder`**.
- **`Error Reports` / `Usage Data`** are TELEMETRY TO VECTORWORKS, not a diagnostic he reads. The GDPR FAQ
  confirms the user log captures *"application crash details, selected workspace, undo actions, and tool
  or command selection"* and is *"saved in your user folder."* **Useful because it makes a support ticket
  possible, not because it tells him anything tonight.**
- ⚠️ `VW Crash Dump.dmp` and `Vectorworks_2026_VWIM` logs under `~/Library/Logs` come from a Vectorworks
  Germany support post for **2025**. Forum-grade, unverified for 2026, not asserted.
- 🚫 `PSTimingLog` is project-sharing only — does not exist for him.
- 🔴 **NO LOG SHOWS THE iCLOUD SIDE.** Nothing in VW reports "this reference was fetched from the cloud."
  Eviction state is visible only in Finder's iCloud Status column. **A timing log says a file took 90
  seconds; it will never say why.**

### Scripting and workspace artifacts (read 2026-09-12)

- 🔑 **FOUR commands generate real scripts with no code** and write them into a script palette:
  `Custom Selection`, `Custom Modification`, `Custom Tool/Attribute`, `Object Visibility`. Per *Creating
  custom selection scripts*: `Create VectorScript` / `Create Python Script`, then *"you're prompted to
  select a palette for the script... double-click the script to perform the operation."* ⭐ **These do
  real work — criteria-based selection, batch modification, visibility states — operations with no menu
  equivalent.** They are not wrappers around menu commands.
- **`Save Palette Positions`** (`Window > Palettes`) persists palette layout per workspace into
  `[User]\Settings\SavedSettings.xml`, and **that user file overrides the workspace file's initial
  settings.** A real precedence rule.
- **The Workspaces dialog `Export`** writes menu items, tools and keyboard shortcuts to a TEXT FILE —
  turning a workspace from an opaque blob into a diffable artifact.
- ⚠️ **Workspaces, plug-ins and `SavedSettings.xml` are USER-FOLDER artifacts, not document resources**,
  so they sit outside `vwx-base-file/`. Whether an exported workspace earns a documentation page is a
  Fold-in Frank question, not a unilateral one.

---

## Part 5 — The artifact

**VWX 2026 Load Board**, v3 as of 2026-09-18: https://app.clickup.com/36074068/artifact/12cwjm-64473

21 settings grouped by their literal VWX menu path, each with its verbatim vendor line behind a `?`;
six meters (open time · memory held · in-session lag · file on disk · crash exposure · cloud dependency);
three cue presets; a flag board for what a meter cannot say.

⭐ **Two things about it worth carrying.** The panels sort themselves into what travels with the
DOCUMENT, the MACHINE, and the STORAGE PATH — an interface built to his navigation habits reproduced the
lane's organizing principle unprompted. And **cue 2 raises `file on disk` while dropping open time,
crash and cloud dependency**: the recommended setup BUYS open speed with bytes, and a model that only
showed wins would be advocacy dressed as instrumentation.

🔴 **It carries a `MODEL · NOT MEASURED` stamp and it means it.** The numbers are a weighted model of
documented mechanisms; **the QUOTES are the load-bearing content.** ⚠️ **A quantified interface is the
most persuasive way to launder a guess** — meters reading 94 look like telemetry, and nobody has opened
a `.vwx`.
