# Vectorworks Base Show File — Plan & Decision Log

> **Status: BRAINSTORMING / BROAD STROKES.** This document is the single source of truth for the *planning* of the Vectorworks base-show-file documentation packages. We are deciding structure and intent here in prose; the actual schema (folder layout, file formats, CSV columns) gets **built later** from the decisions recorded below. Do not treat anything here as final unless it appears in the Decisions table with a date.
>
> **Handoff rule:** if the working session is interrupted, another agent should be able to read this file top-to-bottom and resume the brainstorm with full context. Keep it current. New decisions append to the Decisions Log; open items live in Open Questions.
>
> **Companion:** [`README.md`](./README.md) is the phase-plan map (phases + where we are). This file is the journal (what we decided, when, why).

---

## 1. What this project is

URITP has a long-standing effort to build an accurate **base show file** in Vectorworks (VWX) for the theater: correct drawings, dimensions, and existing architecture, set up so scenic, lighting, sound, and video designers can drop their work onto a trustworthy shell.

**The problem it's solving:** the project spins its wheels. There are no defined goals or endpoints, so every work session is just "open the file and start poking." We want a plan that defines what the file **is**, what it's **trying to accomplish**, and **what we're going to build**, so the next time we sit in Vectorworks we know exactly how to make what we have match what we actually need.

**Educational-version caveat:** the file is currently being built in Vectorworks Educational. It will eventually have to be re-created in a licensed version, so documentation and notes must be thorough enough to rebuild from scratch. (Mitigation path: see D-008.)

---

## 2. The reframe (the key idea, 2026-07-16)

Instead of defining "done" as a vague drawing state, we define it as a **shippable, versioned documentation package** that describes and travels alongside the `.vwx` file:

- The deliverable is the **VWX file + a documentation package** (READMEs, markdown, CSVs) that describes the extensive layering, classes, resources, and conventions baked into the file.
- The **documentation package** is a discrete, version-controlled bundle in **git**, one package per base show file. **The `.vwx` file itself does not live in git** (see D-009).
- Because the package has a **fixed, templated structure**, "make one per show" becomes: clone the template, swap in the show/venue specifics. The Smith Theatre base file is the **first instance** of a repeatable pattern.

---

## 3. Where it lives (repo structure decisions)

Home: the **`mawizorek/ClickUp_apps`** repo. Git holds the **documentation trail only**.

- **`Vectorworks/`** — top-level header folder (parallel to how FileMaker apps have their own world). Domain root for all VWX documentation packages.
  - **A template** — the reusable package skeleton. Every show package clones from it.
  - **Individual show-file packages** — starting with the **Smith Theatre base show file** (first real package).

**Scope guardrails:** don't clutter the `Vectorworks/` top level with a spot per production; productions become **sub-references elsewhere**. For now, focus only on the base show file.

---

## 4. What the package contains (broad strokes, NOT final schema)

Documents what's inside the VWX file so a designer (or future rebuild) understands the structure without opening Vectorworks. Anticipated contents, to firm up later:

- **README(s)** — what the package is, the venue, how to use the file, version/status.
- **Markdown docs** — standards & conventions (classes, layers, sheet layers, title block, symbols, drafting standards).
- **CSVs** — machine-readable manifests of the file's structure: layers, classes, resources/inventory (each stock object with its default layer + class). **Preferably generated from Vectorworks** via worksheet/report export (D-009), not hand-transcribed.
- Reference to **the `.vwx` file** — which lives outside git.
- Possibly a **CHANGELOG / version ledger** per package.

> Stretch idea (not committed): auto-generate a clean HTML "package viewer" from the markdown + CSVs. Hold until the content actually exists.

---

## 5. The universal vs. per-show seam

- **Universal (lives in the template):** the class system, layer system, text/dimension/drafting standards, title-block structure, symbol conventions. Conform to MAW's general Vectorworks standards used when drafting *outside* this base file — one source of truth governs both.
- **Per-instance (lives in the show package):** venue geometry, real dimensions and trim heights, the specific class names populated (e.g. Smith's toe/mid/high pipes), inventory selections, the actual plot.

**Integration principle:** the base file *conforms to* the general standards; the show package captures only what's venue-specific and **points up** to the general standard rather than duplicating it.

**File-topology principle (D-011):** the base file is a **dense MASTER** that department/show files **reference** (not copy). Venue geometry is authored once in the master and consumed downstream. See VWX-BEST-PRACTICES.md § S-2.

---

## 6. Phases (RATIFIED 2026-07-16, D-007)

Full lifecycle, brainstorming → closing & archiving. Canonical detail + current position live in [`README.md`](./README.md).

- **Phase 0 — Brainstorming & Planning** *(active)*: define intent + structure; includes the best-practices deep dive (D-010), the VWX-reports export design (D-009), and defining package contents/schema.
- **Phase 1 — Template Build**: reusable package skeleton; universal standards.
- **Phase 2 — Base Show File Build (Smith Theatre)**: the accurate file itself; carries the rebuild-risk mitigation (D-008).
- **Phase 3 — Package & Publish**: assemble the bundle; version docs in git (`.vwx` excluded, D-009).
- **Phase 4 — Per-Show Instantiation**: clone template/base per production.
- **Phase 5 — Production Use**: designers work on the shell. *(Ownership boundary = open question.)*
- **Phase 6 — Closing & Archiving**: finalize as-built, capture revisions, archive the package.

---

## 7. Decisions Log

| ID | Date | Decision | Notes |
|----|------|----------|-------|
| D-001 | 2026-07-16 | Reframe the deliverable as a versioned, downloadable **documentation package** describing the `.vwx` file, maintained in git, one per base show file. | The endpoint the project was missing. |
| D-002 | 2026-07-16 | Package structure must be **templated** so per-show files = clone template + swap specifics. Smith Theatre is the first instance. | Drives "universal, efficient, templated." |
| D-003 | 2026-07-16 | Home = **`mawizorek/ClickUp_apps`** repo. This documentation lives in **git**, not ClickUp docs. | Git is the source of truth going forward. |
| D-004 | 2026-07-16 | Add a top-level **`Vectorworks/`** header folder; inside it a template + per-show packages, starting with Smith. | Bends the "root = apps + infra only" rule; added deliberately as a docs domain. |
| D-005 | 2026-07-16 | Do **not** give every production a top-level spot; productions become sub-references elsewhere. Focus now = base show file only. | Anti-clutter guardrail. |
| D-006 | 2026-07-16 | Create **one** exhaustive plan + decision-log document first; build the schema **later**. | Broad-strokes mode. |
| D-007 | 2026-07-16 | **Ratify the 7-phase lifecycle spine** (Phase 0–6), brainstorming → closing & archiving. | Approved by Michael. Detail in README. |
| D-008 | 2026-07-16 | **Rebuild risk accepted** with a mitigation path: export **DWG** directly from the file; with resources embedded + laid out, re-importing the DWG should de-skin but bring content back. Keep resources embedded + cleanly laid out throughout. | No way around the Educational→licensed rebuild; DWG round-trip is the hedge. |
| D-009 | 2026-07-16 | **`.vwx` files will NOT live in git. Git is solely the documentation trail.** Actively planning to **export documentation out of Vectorworks into git** (worksheet/report export → CSV/markdown). | Files live elsewhere; bundle references them. Report-setup design is a Phase 0 task. |
| D-010 | 2026-07-16 | **Do a Vectorworks best-practices deep dive + deep research as a brainstorming sub-session** before designing our workflow. | Build on established practice, not habit. First-pass findings F-001..F-008 logged in VWX-BEST-PRACTICES.md. |
| D-011 | 2026-07-16 | **Adopt the master-file reference model.** One dense **MASTER** base file holds all departments as layers (single source of truth for venue geometry); department/show files **reference** it (VW referencing / design-layer viewport references), pulling only the layers they need rather than duplicating geometry. | Confirmed by Michael. Promoted to VWX-BEST-PRACTICES.md § S-2. Downstream files are thin consumers of the master. |
| D-012 | 2026-07-16 | **Adopt the hybrid layer/class division.** **Classes = object-category filtering** (steel, wood, framing, masking…) for viewport/saved-view visibility control. **Layers = location + department routing + elevation band** (`0 NOTES / 1 DECK / 1.5 MEZZ / 2 TOE / 3 CATWALK`). **Elevation lives in layers, never classes.** Object-classes use dash-delimited ≤4-part naming (F-002). | Confirmed by Michael. Promoted to VWX-BEST-PRACTICES.md § S-1. Diverges from Spotlight's lean-layer advice because this is a multi-department master, not a single plot. Specific class tree + layer list still to define. |

---

## 8. Open Questions (to decide before building schema)

- **Package folder/file schema:** exact folder layout, filenames, and CSV columns (layers.csv, classes.csv, resources.csv, etc.).
- **VWX report/worksheet export design:** which worksheets/reports to build in Vectorworks, what columns they emit, and the export-to-git mechanism (D-009).
- **Where the `.vwx` files actually live** (Box? Drive? local + referenced) now that git is docs-only.
- **Object-class tree (under D-012/S-1):** the specific object categories (steel / wood / framing / masking / …) and their dash-delimited hierarchy.
- **House layer list (under D-012/S-1):** finalize the department × elevation layer set; the Google Sheet's ~27 layers are the working draft.
- **Phase 5–6 ownership boundary:** how much of Production Use / Closing is *this project's* scope vs. lifecycle context around the deliverable.
- **Template location & naming** under `Vectorworks/`.
- **Per-show sub-reference mechanism** (D-005) — now framed by the master-reference model (D-011).
- **Inventory worksheet:** each object resource with its default layer + class.
- **Pipes & hang positions:** symbols vs. lighting pipe tool; hybrid 2D/3D handling (F-005).
- **N/S/E/W conventions.**
- **Origin / reference-line convention (OPEN, under discussion):** lock CL × plaster line = 0,0 on the internal origin? Recommendation on the table (F-007); not yet ruled.
- **HTML package viewer:** build or not (hold until content exists).
- **Licensed rebuild:** when/how, via the D-008 DWG path.

### Resolved (moved out of Open Questions)

- ~~**Class scheme:** object-based vs. graphic/linestyle-based~~ → **D-012**: object-category classes (steel/wood/framing/masking) for filtering; linework handled separately. Elevation stays in layers.
- ~~**File topology:** one file vs. referenced department files~~ → **D-011**: dense master referenced by department/show files.

---

## 9. Source material (ClickUp, for context)

- **Task:** URITP-4421 — "Vectorworks base show file (and model)" (status: working). 55 attachments (drawings, PDFs, `.vwx` files, photos), scattered TODO braindumps, subtasks (REP plot; recreate resource-page PDFs as DWG).
- **ClickUp docs:** "🟡 SMITH THEATRE VWX TEMPLATE FILE 🟡" + subpages (Classes, Layers & Classes, Sheet Layers, Resources, Recreate), under the "Vectorworks" standards doc. Also "Smith Theatre ARCHITECTURE Notes" (bottom of toe = 18'8\" from deck) and "MAW BASE SHOW FILES."
- **Layer worksheet (working draft):** Google Sheet "URITP VWX Smith Theatre BASE FILE Worksheets" — ~27 layers keyed on DEPARTMENT × elevation band (0 NOTES / 1 DECK / 1.5 MEZZ / 2 TOE / 3 CATWALK), with 2D/3D flags and STATUS. This is the working source for the D-012/S-1 layer list.
- **Rigging facts (from the task):** High Steel — concentrated point limit 2000 lbs, total load limit 8000 lbs; max 4 simultaneous loads per beam, no closer than 4'-0\" on center, 12,000 lbs total over all beams; beams run E/W at 4' & 12' from center.

---

## 10. Next actions

1. **Decide the origin convention** (F-007) — the live open question; recommendation is CL × PL = 0,0 on internal origin.
2. Define the **object-class tree** and the **house layer list** under S-1 (D-012).
3. Design the VWX report/worksheet export → git mechanism (D-009).
4. Define package contents → then the folder/file schema → then build the template skeleton.

*Last updated: 2026-07-16.*
