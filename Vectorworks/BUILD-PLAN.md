# Vectorworks Package — Build Plan (one page)

> **What this is:** the single-page **build-from** artifact for a Vectorworks base-show-file documentation package. Per S-5, git holds the plan and Vectorworks realizes it — this page is what you draft against. It says *what we're building and in what order*, not the exhaustive layer/class lists (those come later, deliberately).
>
> **Mode: TEMPLATE.** This describes the reusable package skeleton, venue-agnostic. Smith Theatre is a later instance, not the subject here.
>
> **Scope: ANY Vectorworks file, not just URITP.** This structure is a general MAW Vectorworks documentation standard. URITP/Smith are the first users of it, but nothing here is URITP-specific — the template must stay reusable for any venue or project.
>
> **Companions:** [`README.md`](./README.md) = phase map · [`DECISION-LOG.md`](./DECISION-LOG.md) = decisions D-001..D-017 · [`VWX-BEST-PRACTICES.md`](./VWX-BEST-PRACTICES.md) = research + Standards S-1..S-6.

---

## The one-liner

We are building a **reusable, versioned documentation package** that defines how a Vectorworks file is structured, so any base file is built to a known plan instead of improvised. Git = the plan; the `.vwx` = the realization.

---

## The six standards this plan rests on

| # | Standard | One-line |
|---|----------|----------|
| S-1 | Hybrid layer/class | **Layers** = location + department + elevation. **Classes** = object category (steel/wood/framing/masking) for filtering. Elevation never in classes. |
| S-2 | Master-reference model | One dense **master** file; department/show files **reference** it (Design Layer Viewport), staying thin. |
| S-3 | Origin datum | Center of the room, coincident with the **internal origin (0,0)**. |
| S-4 | Datums & reference planes | Document the **rule**, never the numbers; values live in the file. |
| S-5 | Direction of truth | **Git leads** (plan + hand-drawn notes), VWX realizes, export = reconciliation check. |
| S-6 | File-format split | **Prose → Markdown** (renders for designers, diffs clean). **Data manifests → comma-CSV** (mirrors a VWX worksheet, machine-comparable). No `.txt`. |

---

## What the package captures (the four buckets)

NOT the exhaustive contents — the *categories* we commit to documenting. We get in the weeds on each later.

1. **Structure** — the design-layer scheme, the object-class scheme, the sheet-layer scheme. (Exact lists = future work.)
2. **Resources** — which resource types we standardize and capture (list below, confirmed D-017). 
3. **Conventions (prose)** — naming, drafting standards, origin/datums, per-department READMEs. The WHY.
4. **Reconciliation snapshot (secondary)** — a folder where exports from the file get dumped to check built-vs-planned (S-5). Its first README explains *how to export* the relevant file/worksheet from Vectorworks so the dump is consistent. Not the lead content.

---

## File formats (S-6 — decided)

Format by the file's JOB, not one blanket rule:

- **Prose / standards / the WHY → Markdown (`.md`).** Renders as clean headed pages on GitHub (tables, cross-links) so a designer reads it in-browser with zero tooling; it's still plain text under the hood, so it diffs perfectly. Beats `.txt`, which is Markdown with the benefits stripped out. **No `.txt`.**
- **Data manifests (layers, classes, symbols, records, inventory) → CSV, comma-delimited.** Machine-comparable, diffs cleanly per-row, and — crucially — **mirrors a Vectorworks database worksheet**. Comma is the locked delimiter (quote any value containing a comma).
- **The VWX-worksheet mirror is the RECONCILIATION half only (S-5 guardrail).** *I* specify the columns → the git CSV is authored first as the **plan** → you build a VWX database worksheet with those columns → on refresh it renders the file's **actual** state → export to CSV → diff. The worksheet renders a check; it never becomes the source.
- **Rule of thumb:** if a VWX worksheet will ever mirror it → CSV. If a human reads it top-to-bottom → Markdown.

---

## Resources we capture (CONFIRMED — D-017)

From the resource types Vectorworks manages (F-012). Everything except rendering polish is in.

| Resource type | Capture? | How we track it |
|---|---|---|
| **Symbols** (instruments, scenic, rigging, hardware) | **Yes — the big one** | `resources/symbols.md` (prose: library organization, naming, categories) + a generated `symbols.csv` in reconciliation. |
| **Record formats** (data schema on objects/symbols) | **Yes** | `resources/records.md` (prose overview) **+ one CSV per record type** — `record-<NAME>.csv` — giving explicit example rows of each record's fields. |
| **Title block border styles** | **Yes** | `resources/title-blocks.md` (prose + sample). |
| **Line types / line weights** | **Yes** | `standards/drafting.md` (prose standard). |
| **Text & dimension styles** | **Yes** | `standards/drafting.md` (prose standard). |
| **Hatches / tile fills** | **Yes** | Listed in `resources/` (prose; CSV manifest if the set grows). |
| **Saved views** | **Yes** | Listed in `resources/` (prose; part of navigation convention). |
| **Textures / Renderworks styles / gradients** | **No** | Rendering polish, low documentation value for a base file. Only excluded type. |

**Segmentation (D-017):** `resources/` stays **segmented into separate files** (records.md, title-blocks.md, symbols.md, etc.) rather than one fat README — preferred for tokenization + clean diffs. **Record types each get their own CSV** (`record-<NAME>.csv`) so every record schema has explicit, comparable example rows.

---

## Sheet-layer numbering (DRAFT — lightweight, finalized at Smith build)

Grounded in the National CAD Standard model (discipline-letter prefix + sheet-type number) and USITT's discipline-set convention, adapted to the existing ClickUp scheme. **Kept intentionally light now; the full per-department sheet list gets locked when we build the Smith documentation.**

**Draft pattern:** `<DEPT><n>` — a department letter + a number; an indented number = a viewport off the sheet above.

| Prefix | Department | `0` sheet |
|---|---|---|
| **UR** | Venue base / architecture (groundplan, sections) | UR0 = file readme |
| **S** | Scenic | S0 = scenic readme |
| **L** | Lighting | L0 = lighting readme |
| **A** | Audio | A0 = audio readme |
| **R** | Rigging | R0 = rigging readme |
| **V** | Video | V0 = video readme |

- **`0` = the department's readme sheet** (hard rule); real drawings start at 1.
- Numbers ascend in drawing order within a department; indent = viewport.
- **Deferred to Smith build:** the exact drawing list per department, and whether any department needs a two-digit sheet-type split (e.g. plans vs sections vs details). Draft stays lightweight until then.

---

## Proposed template folder skeleton + file manifest (DRAFT — for discussion, not built yet)

```
<package>/
  README.md                     — what this package is, scope, status, how to use
  standards/
    layers.md                   — the design-layer scheme (rules; list later)
    classes.md                  — the object-class scheme (rules; tree later)
    sheet-layers.md             — sheet numbering + viewport convention (draft above)
    naming.md                   — naming discipline (dash-delimited, Standard Naming)
    drafting.md                 — line weights, text, dimension standards
    datums-and-reference-planes.md  — the S-4 rule note (universal convention)
  resources/
    README.md                   — which resource types we capture + why (index)
    symbols.md                  — symbol library organization + naming (the plan)
    records.md                  — record-format overview (+ per-type record-<NAME>.csv)
    title-blocks.md             — title block styles
    hatches.md                  — standardized hatches/fills (if any)
    saved-views.md              — standardized saved views / navigation
  reference-notes/
    README.md                   — what these are (hand-drawn handouts, S-5 primary)
  reconciliation/
    README.md                   — HOW to export from Vectorworks + what belongs here
    (dumped CSV/PDF exports land here)
  CHANGELOG.md                  — the plan's version history
```

> All prose files above are `.md` (S-6); manifests (symbols.csv, record-<NAME>.csv, and anything in `reconciliation/`) are comma-CSV.

---

## Build order (phases, from the README map)

1. **Now — finish Phase 0 planning:** folder skeleton + file manifest (above) locked; resource-capture list confirmed (D-017); sheet-numbering drafted (light). Remaining Phase-0: object-class tree + house layer list (deferred to build), reconciliation-snapshot in-repo-vs-throwaway policy.
2. **Phase 1 — Template Build:** stand up the folders + write the prose standards (rules, not lists); empty structure ready to fill.
3. **Then — exhaustive lists:** only after the skeleton is agreed do we write the actual layer list / class tree / symbol inventory / per-record CSVs.
4. **Phase 2+ — first instance (e.g. Smith):** clone the template, fill in venue specifics + finalize the sheet list. (Not now.)

---

## Deliberately NOT doing yet

- Exhaustive layer list, class tree, or symbol inventory (stay out of the weeds until the skeleton's agreed).
- The full per-department sheet list (drafted light; finalized at Smith build).
- Anything venue-specific (we're in template mode).
- Building the actual `.vwx` (that's Phase 2, and it follows this plan).

---

*Last updated: 2026-07-16. Status: DRAFT skeleton for discussion; file-format split (S-6) + resource-capture (D-017) ratified; sheet-numbering intentionally draft.*
