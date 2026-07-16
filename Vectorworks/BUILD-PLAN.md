# Vectorworks Package — Build Plan (one page)

> **What this is:** the single-page **build-from** artifact for a Vectorworks base-show-file documentation package. Per S-5, git holds the plan and Vectorworks realizes it — this page is what you draft against. It says *what we're building and in what order*, not the exhaustive layer/class lists (those come later, deliberately).
>
> **Mode: TEMPLATE.** This describes the reusable package skeleton, venue-agnostic. Smith Theatre is a later instance, not the subject here.
>
> **Scope: ANY Vectorworks file, not just URITP.** This structure is a general MAW Vectorworks documentation standard. URITP/Smith are the first users of it, but nothing here is URITP-specific — the template must stay reusable for any venue or project.
>
> **Companions:** [`README.md`](./README.md) = phase map · [`DECISION-LOG.md`](./DECISION-LOG.md) = decisions D-001..D-015 · [`VWX-BEST-PRACTICES.md`](./VWX-BEST-PRACTICES.md) = research + Standards S-1..S-5.

---

## The one-liner

We are building a **reusable, versioned documentation package** that defines how a Vectorworks file is structured, so any base file is built to a known plan instead of improvised. Git = the plan; the `.vwx` = the realization.

---

## The five standards this plan rests on

| # | Standard | One-line |
|---|----------|----------|
| S-1 | Hybrid layer/class | **Layers** = location + department + elevation. **Classes** = object category (steel/wood/framing/masking) for filtering. Elevation never in classes. |
| S-2 | Master-reference model | One dense **master** file; department/show files **reference** it (Design Layer Viewport), staying thin. |
| S-3 | Origin datum | Center of the room, coincident with the **internal origin (0,0)**. |
| S-4 | Datums & reference planes | Document the **rule**, never the numbers; values live in the file. |
| S-5 | Direction of truth | **Git leads** (plan + hand-drawn notes), VWX realizes, export = reconciliation check. |

---

## What the package captures (the four buckets)

NOT the exhaustive contents — the *categories* we commit to documenting. We get in the weeds on each later.

1. **Structure** — the design-layer scheme, the object-class scheme, the sheet-layer scheme. (Exact lists = future work.)
2. **Resources** — which resource types we standardize and capture (see the draft list below). (Exact set = being decided.)
3. **Conventions (prose)** — naming, drafting standards, origin/datums, per-department READMEs. The WHY.
4. **Reconciliation snapshot (secondary)** — a folder where exports from the file get dumped to check built-vs-planned (S-5). Its first README explains *how to export* the relevant file/worksheet from Vectorworks so the dump is consistent. Not the lead content.

---

## Draft: which resources we capture (FOR DISCUSSION — not locked)

From the resource types Vectorworks actually manages (F-012), the ones worth standardizing in a documentation package, ranked by how much they matter to a base file:

| Resource type | Capture? | How we track it |
|---|---|---|
| **Symbols** (instruments, scenic, rigging, hardware) | **Yes — the big one** | A **symbols manifest CSV** generated from a worksheet (name, type, default layer, default class, key record fields, count) + prose notes on the library's organization. This is the reusable-content backbone. |
| **Record formats** (the data schema on objects/symbols) | Yes | Prose doc of each record + its fields (the schema the symbols manifest reads from). |
| **Title block border styles** | Yes | Prose + a sample; drives sheet-layer presentation. |
| **Line types / line weights** | Yes | Prose standard (drafting.md). |
| **Text & dimension styles** | Yes | Prose standard (drafting.md). |
| **Hatches / tile fills** | Maybe | List if we standardize any; else skip. |
| **Saved views** | Maybe | Useful for navigation; list if we standardize them. |
| **Textures / Renderworks styles / gradients** | Probably not | Rendering polish, low documentation value for a base file. |

**On symbols specifically (your question):** yes, they get their own home — a `resources/symbols.md` (prose: how the library is organized, naming, categories) **plus** a generated `symbols.csv` in the reconciliation dump when you want to verify the file's actual symbol list against the plan. The prose is the plan (git-authored); the CSV is the reconciliation snapshot (file-generated, per S-5). Same split as everything else.

---

## Proposed template folder skeleton + file manifest (DRAFT — for discussion, not built yet)

```
<package>/
  README.md                     — what this package is, scope, status, how to use
  standards/
    layers.md                   — the design-layer scheme (rules; list later)
    classes.md                  — the object-class scheme (rules; tree later)
    sheet-layers.md             — sheet numbering + viewport convention
    naming.md                   — naming discipline (dash-delimited, Standard Naming)
    drafting.md                 — line weights, text, dimension standards
    datums-and-reference-planes.md  — the S-4 rule note (universal convention)
  resources/
    README.md                   — which resource types we capture + why
    symbols.md                  — symbol library organization + naming (the plan)
    records.md                  — record-format schemas
    title-blocks.md             — title block styles
  reference-notes/
    README.md                   — what these are (hand-drawn handouts, S-5 primary)
  reconciliation/
    README.md                   — HOW to export from Vectorworks + what belongs here
    (dumped CSV/PDF exports land here)
  CHANGELOG.md                  — the plan's version history
```

> Open: per-department README placement (likely one per department — Michael); whether `records.md`/`title-blocks.md` earn their own files or fold into `resources/README.md` at first.

---

## Build order (phases, from the README map)

1. **Now — finish Phase 0 planning:** lock the folder skeleton + file manifest (above), confirm the resource-capture list, settle sheet-layer numbering (research pending).
2. **Phase 1 — Template Build:** stand up the folders + write the prose standards (rules, not lists); empty structure ready to fill.
3. **Then — exhaustive lists:** only after the skeleton is agreed do we write the actual layer list / class tree / symbol inventory.
4. **Phase 2+ — first instance (e.g. Smith):** clone the template, fill in venue specifics. (Not now.)

---

## Deliberately NOT doing yet

- Exhaustive layer list, class tree, or symbol inventory (stay out of the weeds until the skeleton's agreed).
- Anything venue-specific (we're in template mode).
- Building the actual `.vwx` (that's Phase 2, and it follows this plan).

---

*Last updated: 2026-07-16. Status: DRAFT skeleton for discussion; not yet ratified.*
