# Vectorworks Base Show File — Plan & Decision Log

> **Status: BRAINSTORMING / BROAD STROKES.** This document is the single source of truth for the *planning* of the Vectorworks base-show-file documentation packages. We are deciding structure and intent here in prose; the actual schema (folder layout, file formats, CSV columns) gets **built later** from the decisions recorded below. Do not treat anything here as final unless it appears in the Decisions table with a date.
>
> **Handoff rule:** if the working session is interrupted, another agent should be able to read this file top-to-bottom and resume the brainstorm with full context. Keep it current. New decisions append to the Decisions Log; open items live in Open Questions.

---

## 1. What this project is

URITP has a long-standing effort to build an accurate **base show file** in Vectorworks (VWX) for the theater: correct drawings, dimensions, and existing architecture, set up so scenic, lighting, sound, and video designers can drop their work onto a trustworthy shell.

**The problem it's solving:** the project spins its wheels. There are no defined goals or endpoints, so every work session is just "open the file and start poking." We want a plan that defines what the file **is**, what it's **trying to accomplish**, and **what we're going to build**, so the next time we sit in Vectorworks we know exactly how to make what we have match what we actually need.

**Educational-version caveat:** the file is currently being built in Vectorworks Educational. It will eventually have to be re-created in a licensed version, so documentation and notes must be thorough enough to rebuild from scratch.

---

## 2. The reframe (the key idea, 2026-07-16)

Instead of defining "done" as a vague drawing state, we define it as a **shippable, versioned package** that travels *with* the `.vwx` file:

- The deliverable is the **VWX file + a documentation package** (READMEs, markdown, CSVs) that describes the extensive layering, classes, resources, and conventions baked into the file.
- That package is a **discrete, downloadable bundle** maintained under **version control (git)**, one package per base show file.
- Because the package has a **fixed, templated structure**, "make one per show" becomes: clone the template, swap in the show/venue specifics. The Smith Theatre base file is the **first instance** of a repeatable pattern.

This gives the project a real endpoint (a shippable bundle) and makes it universal, efficient, and templated.

---

## 3. Where it lives (repo structure decisions)

Home: the **`mawizorek/ClickUp_apps`** repo, alongside the ClickUp Apps. Git is now the home for this documentation structure (superseding the idea of keeping it as ClickUp docs).

Agreed structure (broad strokes):

- **`Vectorworks/`** — new top-level header folder (parallel to how FileMaker apps have their own world). This is the domain root for all VWX documentation packages.
  - **A template** — the reusable package skeleton. This is what we start building and keep refining. Every show package is cloned from it.
  - **Individual show-file packages** — starting with the **Smith Theatre base show file**. This is the first real package.

**Scope guardrails:**
- Do **not** clutter the `Vectorworks/` top level by giving every production its own spot. Individual productions become **sub-references elsewhere**, not top-level entries. (Exact mechanism = open question.)
- For now, focus **only** on the base show file and its structure. Everything else is deferred.

**Convention note / flag:** the repo's locked rule is "root = app folders + infra only." A `Vectorworks/` documentation header bends that rule. It is being added deliberately as a documentation domain (loose precedent: the existing `filemaker/` folder). Recorded as decision D-004 below.

---

## 4. What the package contains (broad strokes, NOT final schema)

The bundle is meant to document what's inside the VWX file so a designer (or future rebuild) understands the structure without opening Vectorworks. Anticipated contents, to be firmed up later:

- **README(s)** — what the package is, the venue, how to use the file, version/status.
- **Markdown docs** — standards and conventions (classes, layers, sheet layers, title block, symbols, drafting standards).
- **CSVs** — machine-readable manifests of the file's structure: layers, classes, and resources/inventory (each stock object with its default layer + class). These mirror the "extensive layering and documentation inside the actual Vectorworks file."
- **The `.vwx` file** — the file itself, bundled with the docs.
- Possibly a **CHANGELOG / version ledger** per package.

> Stretch idea (not committed): auto-generate a clean HTML "package viewer" from the markdown + CSVs so the bundle is browsable, not just a folder of files.

---

## 5. The universal vs. per-show seam

The thing that makes this templated: separate what's **universal** from what's **per-instance**.

- **Universal (lives in the template):** the class system, layer system, text/dimension/drafting standards, title-block structure, symbol conventions. These conform to MAW's general Vectorworks standards used when drafting *outside* this base file — one source of truth governs both.
- **Per-instance (lives in the show package):** the venue geometry, real dimensions and trim heights, the specific class names populated (e.g. Smith's toe/mid/high pipes), inventory selections, the actual plot.

**Integration principle:** the base file *conforms to* the general standards; the show package only captures what's venue-specific and **points up** to the general standard rather than duplicating it.

---

## 6. Proposed phases (PROPOSED — not yet ratified)

Captured from the brainstorm so they aren't lost. Each has a real endpoint. These are a starting point to react to, not agreed scope.

- **Phase 0 — Charter:** define what the file IS / is NOT / definition of "v1 done."
- **Phase 1 — Architecture shell:** dimensionally-accurate as-built (walls, catwalks, galleries, mezzanine, high steel, pipe trims), origin locked at CL/PL 0,0. Done = geometry locked.
- **Phase 2 — Standards skeleton:** class system (toe/mid/high pipes, gallery supergroup), layers, sheet layers, title block + project data, drawing labels. The integration seam with general standards. Done = new sheet opens to title block + production info.
- **Phase 3 — Rigging & hang positions:** pipes/catwalks/positions as hybrid symbols (2D screen-plane vs 3D layer-plane), traveler track, load limits + rigging no-go zones. Done = LX can drop a plot on real positions.
- **Phase 4 — Inventory integration:** resource worksheet, each stock object with default layer + class; softgoods, masking, cyc, risers. Done = designers pull from a real library.
- **Phase 5 — Handoff & public prep:** unlock GP symbol, clean elevations/sections, REP plot, export bundle (VWX/DWG/PDF), per-show spin-up checklist. Done = shareable.
- **Tail — Educational re-create:** rebuild in licensed Vectorworks from these notes.

---

## 7. Decisions Log

| ID | Date | Decision | Notes |
|----|------|----------|-------|
| D-001 | 2026-07-16 | Reframe the deliverable as a versioned, downloadable **documentation package bundled with the `.vwx` file**, maintained in git, one per base show file. | The endpoint the project was missing. |
| D-002 | 2026-07-16 | Package structure must be **templated** so per-show files = clone template + swap specifics. Smith Theatre is the first instance. | Drives "universal, efficient, templated." |
| D-003 | 2026-07-16 | Home = **`mawizorek/ClickUp_apps`** repo. This documentation lives in **git**, not ClickUp docs. | Git is the source of truth going forward. |
| D-004 | 2026-07-16 | Add a top-level **`Vectorworks/`** header folder (parallel to FileMaker's world); inside it a template + per-show packages, starting with Smith. | Bends the "root = apps + infra only" locked rule; added deliberately as a docs domain. |
| D-005 | 2026-07-16 | Do **not** give every production a top-level spot; productions become sub-references elsewhere. Focus now = base show file only. | Anti-clutter guardrail. |
| D-006 | 2026-07-16 | Create **one** exhaustive plan + decision-log document first (this file); actually build the schema **later**. | We are in broad-strokes mode. |

---

## 8. Open Questions (to decide before building schema)

- **Package folder/file schema:** exact folder layout, filenames, and CSV columns (layers.csv, classes.csv, resources.csv, etc.). To be designed later.
- **Template location & naming:** where the template sits under `Vectorworks/` and what it's called.
- **Per-show sub-reference mechanism:** how individual productions reference a base show file without cluttering the top level (D-005).
- **Inventory worksheet:** how to represent each object resource with its default layer + class (open item carried from the VWX task).
- **Pipes & hang positions:** how to model them (symbols vs. lighting pipe tool; hybrid symbol 2D/3D handling).
- **N/S/E/W conventions:** what the directional labels need to standardize to.
- **Class scheme:** toe / mid / high pipes; galleries as a super-group/class.
- **HTML package viewer:** build it or not (stretch idea from Section 4).
- **Licensed rebuild:** when/how the Educational-version file gets re-created.

---

## 9. Source material (ClickUp, for context)

These remain the working/source surfaces; git is now the home for the shipping documentation structure.

- **Task:** URITP-4421 — "Vectorworks base show file (and model)" (status: working). Holds 55 attachments (drawings, PDFs, `.vwx` files, photos), scattered TODO braindumps, and subtasks (REP plot; recreate resource-page PDFs as DWG).
- **ClickUp docs:** the "🟡 SMITH THEATRE VWX TEMPLATE FILE 🟡" doc and its subpages (Classes, Layers & Classes, Sheet Layers, Resources, Recreate), under the parent "Vectorworks" standards doc. Also "Smith Theatre ARCHITECTURE Notes" (e.g. bottom of toe = 18'8\" from deck) and "MAW BASE SHOW FILES."
- **Rigging facts captured on the task:** High Steel — concentrated point limit 2000 lbs, total load limit 8000 lbs; max 4 simultaneous loads per beam, no closer than 4'-0\" on center, 12,000 lbs total over all beams; beams run E/W at 4' & 12' from center.

---

## 10. Next actions

1. React to / ratify the Section 6 phases (or reshape them).
2. Decide the package folder/file schema (Section 8) — then build the template skeleton.
3. Stand up the template under `Vectorworks/`, then clone it into the Smith Theatre package.

*Last updated: 2026-07-16.*
