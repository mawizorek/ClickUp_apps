# Vectorworks Base Show File — Plan & Decision Log

> **Status: BRAINSTORMING / BROAD STROKES.** This document is the single source of truth for the *planning* of the Vectorworks base-show-file documentation packages. We are deciding structure and intent here in prose; the actual schema (folder layout, file formats, CSV columns) gets **built later** from the decisions recorded below. Do not treat anything here as final unless it appears in the Decisions table with a date.
>
> **Governing model (D-015):** git is the **plan** (design-time source of truth) we build FROM; Vectorworks (local) is the **realization**. Git leads, the file follows, exports are a reconciliation check. FileMaker-workflow parallel. See VWX-BEST-PRACTICES.md § S-5.
>
> **Handoff rule:** if the working session is interrupted, another agent should be able to read this file top-to-bottom and resume the brainstorm with full context. Keep it current. New decisions append to the Decisions Log; open items live in Open Questions.
>
> **Companion:** [`README.md`](./README.md) is the phase-plan map (phases + where we are) · [`BUILD-PLAN.md`](./BUILD-PLAN.md) is the one-page build-from artifact. This file is the journal (what we decided, when, why).

---

## 1. What this project is

URITP has a long-standing effort to build an accurate **base show file** in Vectorworks (VWX) for the theater: correct drawings, dimensions, and existing architecture, set up so scenic, lighting, sound, and video designers can drop their work onto a trustworthy shell.

**The problem it's solving:** the project spins its wheels. There are no defined goals or endpoints, so every work session is just "open the file and start poking." We want a plan that defines what the file **is**, what it's **trying to accomplish**, and **what we're going to build**, so the next time we sit in Vectorworks we know exactly how to make what we have match what we actually need.

**Educational-version caveat:** the file is currently being built in Vectorworks Educational. It will eventually have to be re-created in a licensed version, so documentation and notes must be thorough enough to rebuild from scratch. (Mitigation path: see D-008.)

---

## 2. The reframe (the key ideas)

**2a. The deliverable is a versioned package, not a vague drawing state (2026-07-16, D-001).** We define "done" as a shippable, versioned bundle in git, one per base show file; the `.vwx` itself lives outside git (D-009).

**2b. Git = the plan; Vectorworks = the realization (2026-07-16, D-015 / S-5).** The center of gravity is the **forward-looking plan**, not a description trailing the file:

- Git holds the **intended** structure (layers we expect, class tree, sheet scheme, conventions), the goals, and the **hand-drawn reference notes/drawings actually handed to collaborators** — which are also Michael's build reference. Git LEADS.
- Vectorworks (local) reflects **what's actually built**. Michael drafts in VWX *from* the git plan (FileMaker parallel: agent preps the spec, Michael builds).
- The VWX→Git export is a **reconciliation check** ("does what I built match what we documented?"), NOT a routine population pipeline. We don't dump the file's state into git.

---

## 3. Where it lives (repo structure decisions)

Home: the **`mawizorek/ClickUp_apps`** repo. Git holds the **plan + documentation trail** (D-015); the `.vwx` lives locally.

- **`Vectorworks/`** — top-level header folder (parallel to how FileMaker apps have their own world). Domain root for all VWX documentation packages.
  - **A template** — the reusable package skeleton. Every show package clones from it.
  - **Individual show-file packages** — starting with the **Smith Theatre base show file** (first real package).

**Scope guardrails:** don't clutter the `Vectorworks/` top level with a spot per production; productions become **sub-references elsewhere**. For now, focus only on the base show file. **Note (D-016 scope):** the template + its standards are org-agnostic — reusable for any Vectorworks file, not just URITP; URITP/Smith are the first users.

---

## 4. What the package contains (reframed by D-015 — plan-first; formats per D-016)

**PRIMARY — the plan (hand-authored, the lead artifacts) — Markdown (D-016):**

- **Intended structure specs** — the expected layer list, object-class tree, sheet-layer scheme, naming/drafting/symbol standards. Dictated in git first, built in VWX from it.
- **Hand-drawn reference notes / drawings** — the actual handout to designers and Michael's build reference. First-class content.
- **Prose standards + per-department READMEs** — the WHY; includes a **Datums & Reference Planes** note (S-4/D-014). Never holds dimension values.
- **CHANGELOG / version ledger** — tracks the plan's evolution.

**SECONDARY — reconciliation snapshot (generated from the file, occasional, a checking aid, per S-5) — comma-CSV (D-016):**

- CSV manifests via worksheet database rows (layers / classes / symbols / records / sheets), exported when Michael wants to diff the built file against the plan. **Preferably generated from Vectorworks** (F-011), never hand-transcribed. Comma-delimited (D-016). The VWX worksheet mirrors the git CSV as a reconciliation device only — the worksheet never becomes the source (S-5/S-6).
- Optional PDF/A-1b plate set (Publish) as a frozen as-built snapshot.
- Reference to **the `.vwx` file**, which lives outside git.

> Stretch idea (not committed): auto-generate a clean HTML "package viewer" from the markdown + CSVs. Hold until the content actually exists.

---

## 5. The universal vs. per-show seam

- **Universal (lives in the template):** the class system, layer system, text/dimension/drafting standards, title-block structure, symbol conventions, and the *convention* of a Datums & Reference Planes note (D-014). Conform to MAW's general Vectorworks standards used when drafting *outside* this base file — one source of truth governs both.
- **Per-instance (lives in the show package):** venue geometry, real dimensions and trim heights, the specific class names populated (e.g. Smith's toe/mid/high pipes), inventory selections, the actual plot, and **venue-specific reference-plane rules** (e.g. Smith's deck-off-trim / upper-off-wall behavior, D-014).

**Integration principle:** the base file *conforms to* the general standards; the show package captures only what's venue-specific and **points up** to the general standard rather than duplicating it.

**File-topology principle (D-011):** the base file is a **dense MASTER** that department/show files **reference** (not copy) — technical method = referenced Design Layer Viewport (F-013). Venue geometry is authored once in the master and consumed downstream. See VWX-BEST-PRACTICES.md § S-2.

**Direction-of-truth principle (D-015):** the plan is authored in git and the file is built to match it; see § 2b and S-5.

**File-format principle (D-016):** prose → Markdown, data manifests → comma-CSV; see S-6.

**Resource-capture principle (D-017):** capture all resource types except rendering polish; `resources/` stays segmented into separate files; each record type gets its own example CSV. See § 7 D-017 + BUILD-PLAN.

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
| D-001 | 2026-07-16 | Reframe the deliverable as a versioned, downloadable **documentation package** describing the `.vwx` file, maintained in git, one per base show file. | The endpoint the project was missing. Emphasis later refined plan-first by D-015. |
| D-002 | 2026-07-16 | Package structure must be **templated** so per-show files = clone template + swap specifics. Smith Theatre is the first instance. | Drives "universal, efficient, templated." |
| D-003 | 2026-07-16 | Home = **`mawizorek/ClickUp_apps`** repo. This documentation lives in **git**, not ClickUp docs. | Git is the source of truth going forward. |
| D-004 | 2026-07-16 | Add a top-level **`Vectorworks/`** header folder; inside it a template + per-show packages, starting with Smith. | Bends the "root = apps + infra only" rule; added deliberately as a docs domain. |
| D-005 | 2026-07-16 | Do **not** give every production a top-level spot; productions become sub-references elsewhere. Focus now = base show file only. | Anti-clutter guardrail. |
| D-006 | 2026-07-16 | Create **one** exhaustive plan + decision-log document first; build the schema **later**. | Broad-strokes mode. |
| D-007 | 2026-07-16 | **Ratify the 7-phase lifecycle spine** (Phase 0–6), brainstorming → closing & archiving. | Approved by Michael. Detail in README. |
| D-008 | 2026-07-16 | **Rebuild risk accepted** with a mitigation path: export **DWG** directly from the file; with resources embedded + laid out, re-importing the DWG should de-skin but bring content back. Keep resources embedded + cleanly laid out throughout. | No way around the Educational→licensed rebuild; DWG round-trip is the hedge. |
| D-009 | 2026-07-16 | **`.vwx` files will NOT live in git. Git is solely the documentation trail.** Planning to **export documentation out of Vectorworks into git** (worksheet/report export → CSV/markdown). | Files live elsewhere; bundle references them. Export role refined by D-015 to a reconciliation check, not routine population. |
| D-010 | 2026-07-16 | **Do a Vectorworks best-practices deep dive + deep research as a brainstorming sub-session** before designing our workflow. | Build on established practice, not habit. Findings F-001..F-016 logged in VWX-BEST-PRACTICES.md. |
| D-011 | 2026-07-16 | **Adopt the master-file reference model.** One dense **MASTER** base file holds all departments as layers; department/show files **reference** it (referenced Design Layer Viewport, F-013), pulling only the layers they need. | Confirmed by Michael. VWX-BEST-PRACTICES.md § S-2. Downstream files are thin consumers of the master. |
| D-012 | 2026-07-16 | **Adopt the hybrid layer/class division.** **Classes = object-category filtering** (steel, wood, framing, masking…). **Layers = location + department routing + elevation band** (`0 NOTES / 1 DECK / 1.5 MEZZ / 2 TOE / 3 CATWALK`). **Elevation lives in layers, never classes.** Object-classes use dash-delimited ≤4-part naming (F-002). | Confirmed by Michael. § S-1. Diverges from Spotlight's lean-layer advice (multi-dept master, not a single plot). |
| D-013 | 2026-07-16 | **Adopt the origin / datum convention.** Smith is a blackbox rectangle (~50'×70' nominal); datum = **center of the room rectangle**, coincident with the Vectorworks **internal origin (0,0)**. Already built in the file. | Confirmed by Michael. § S-3. Internal-origin coincidence protects DWG round-trip precision (D-008) and shares one coordinate frame across referencing files (D-011). |
| D-014 | 2026-07-16 | **Adopt the datums & reference-planes documentation convention.** Document the **RULE** (which surface is the datum at each elevation), never the numbers, in a short **"Datums & Reference Planes"** note. Values live in the file + exported worksheets. Convention is universal; the specific Smith elevation rule (deck-off-trim / upper-off-wall) lives in the **Smith package**. | Confirmed by Michael. § S-4. Resolves F-009. |
| D-015 | 2026-07-16 | **Adopt the direction-of-truth model: Git = plan, Vectorworks = realization, export = reconciliation.** Git holds the intended structure + goals + hand-drawn reference notes (the actual collaborator handout + Michael's build reference) and LEADS; Michael builds in VWX from the git plan (FileMaker parallel); the `.vwx` lives locally (D-009); VWX→Git export is an occasional check that the built file matches the plan, **not** a routine population pipeline. | Confirmed by Michael. Promoted to VWX-BEST-PRACTICES.md § S-5. **Refines the emphasis of D-001 (package is plan-first, not file-trailing) and D-009 (export = reconciliation, not primary import).** |
| D-016 | 2026-07-16 | **Adopt the file-format split.** **Prose / standards / the WHY → Markdown (`.md`)** (renders for designers on GitHub, diffs clean as plain text; no `.txt`). **Data manifests (layers, classes, symbols, inventory) → CSV, comma-delimited** (machine-comparable; mirrors a VWX database worksheet). The VWX-worksheet mirror is a **reconciliation device only** — the git CSV is authored first as the plan, the worksheet renders the actual state to diff against it, and never becomes the source (S-5 guardrail). Applies to every package (org-agnostic). | Confirmed by Michael; comma delimiter chosen. Promoted to VWX-BEST-PRACTICES.md § S-6. Resolves F-015 + the CSV-delimiter open question. |
| D-017 | 2026-07-16 | **Confirm the resource-capture list + resources/ segmentation.** Capture **symbols, record formats, title-block styles, line types/weights, text & dimension styles, hatches/tile fills, and saved views**. **Exclude only** textures / Renderworks styles / gradients (rendering polish). `resources/` stays **segmented into separate `.md` files** (symbols.md, records.md, title-blocks.md, hatches.md, saved-views.md), NOT one fat README — preferred for tokenization + clean diffs. **Each record type gets its own example CSV** (`record-<NAME>.csv`) with explicit sample rows of that record's fields. | Confirmed by Michael. Captured in BUILD-PLAN.md (resource-capture table + file manifest). Promotes hatches + saved views from "maybe" to "yes" vs. the earlier draft. |

---

## 8. Open Questions (to decide before building schema)

- **Standard show-file structure (ACTIVE, next big plan artifact):** the design-layer / class / sheet-layer / resource skeleton for a VWX show file, dictated in git per D-015. Folder skeleton + file manifest + resource-capture list now settled in `BUILD-PLAN.md`. Ratify the structure doc → S-7.
- **Sheet-layer numbering scheme:** DRAFTED lightweight in `BUILD-PLAN.md` (dept-letter prefix + number, `0` = readme sheet; UR/S/L/A/R/V). **Finalized (full per-department drawing list) at the Smith build**, per Michael. See F-016.
- **Reconciliation snapshot policy (S-5 open):** does a generated snapshot live in the repo, or stay a throwaway diff Michael shows in chat? (Format now settled by D-016: comma-CSV / PDF-A if in-repo.)
- **Where the `.vwx` files actually live** (Box? Drive? local + referenced).
- **Object-class tree (D-012/S-1):** the specific categories (steel / wood / framing / masking / …) + dash hierarchy.
- **House layer list (D-012/S-1):** finalize the department × elevation set; the Google Sheet's ~27 layers are the working draft.
- **Standard Naming registration (F-010):** register the house naming as a formal custom standard in the template?
- **Referencing method (F-013):** confirm referenced Design Layer Viewports as the S-2 mechanism (+ same-version constraint).
- **Phase 5–6 ownership boundary.**
- **Template location & naming** under `Vectorworks/`.
- **Per-show sub-reference mechanism** (D-005), now framed by the master-reference model (D-011).
- **Inventory worksheet:** each object resource with its default layer + class.
- **Pipes & hang positions:** symbols vs. lighting pipe tool; hybrid 2D/3D (F-005).
- **N/S/E/W conventions** (+X/+Y axis polarity off the S-3 center datum).
- **HTML package viewer:** build or not (hold).
- **Licensed rebuild:** when/how, via the D-008 DWG path.

### Resolved (moved out of Open Questions)

- ~~**Class scheme:** object-based vs. graphic/linestyle-based~~ → **D-012**.
- ~~**File topology:** one file vs. referenced department files~~ → **D-011**.
- ~~**Origin / reference-line convention**~~ → **D-013**.
- ~~**Reference-plane / tolerance detail granularity**~~ → **D-014**.
- ~~**Direction of truth: is git a mirror of the file or the plan we build from?**~~ → **D-015**: git = plan, VWX = realization, export = reconciliation.
- ~~**File formats: Markdown vs .txt vs CSV; CSV delimiter**~~ → **D-016**: Markdown prose / comma-CSV manifests; worksheet-mirror is reconciliation-only.
- ~~**Resource-capture list + resources/ segmentation**~~ → **D-017**: capture all but rendering polish; segmented files; per-record CSVs.

---

## 9. Source material (ClickUp, for context)

- **Task:** URITP-4421 — "Vectorworks base show file (and model)" (status: working). 55 attachments (drawings, PDFs, `.vwx` files, photos), scattered TODO braindumps, subtasks (REP plot; recreate resource-page PDFs as DWG).
- **ClickUp docs:** "🟡 SMITH THEATRE VWX TEMPLATE FILE 🟡" + subpages (Classes, Layers & Classes, Sheet Layers, Resources, Recreate), under the "Vectorworks" standards doc. Also "Smith Theatre ARCHITECTURE Notes" (bottom of toe = 18'8\" from deck) and "MAW BASE SHOW FILES."
- **Existing sheet-layer scheme (ClickUp):** dept-prefixed numbered drawings — UR0–6 (file readme, groundplan, overhead, W/N/E/S sections), S1–7 (scenic), L0– (lighting), A0– (audio), R0– (rigging), V0– (video); indented sheet number = a viewport off the sheet above. Basis for the F-016 draft numbering.
- **Layer worksheet (working draft):** Google Sheet "URITP VWX Smith Theatre BASE FILE Worksheets" — ~27 layers keyed on DEPARTMENT × elevation band, with 2D/3D flags and STATUS. Working source for the D-012/S-1 layer list.
- **Venue geometry (feeds S-3 / S-4):** blackbox rectangle ~50'×70' nominal; interior trim shaves ~1/8" per wall; deck measurements off interior trim face; mezzanine/catwalks off nominal wall structure. Center of rectangle = internal origin (built).
- **Rigging facts (from the task):** High Steel — concentrated point limit 2000 lbs, total load limit 8000 lbs; max 4 simultaneous loads per beam, no closer than 4'-0\" on center, 12,000 lbs total over all beams; beams run E/W at 4' & 12' from center.

---

## 10. Next actions

1. **Dictate the standard show-file structure in git** (design layers / classes / sheet layers / resources) per D-015 → ratify as S-7. The folder skeleton + file manifest + resource-capture list are ready; this writes the prose standards.
2. **Stand up the first template folder skeleton** (BUILD-PLAN manifest), then generate the READMEs in one pass.
3. Define the **object-class tree** and finalize the **house layer list** under S-1 (D-012).
4. Finalize the **sheet-layer numbering** (full per-department list) at the Smith build (F-016).
5. Settle the **reconciliation snapshot policy** (in-repo vs throwaway).

*Last updated: 2026-07-16.*
