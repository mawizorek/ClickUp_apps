# Vectorworks Package — Build Plan (one page)

> **What this is:** the single-page **build-from** artifact for a Vectorworks base-show-file documentation package. Per S-5, git holds the plan and Vectorworks realizes it — this page is what you draft against. It says *what we're building and in what order*, not the exhaustive layer/class lists (those come later, deliberately).
>
> **Mode: TEMPLATE.** This describes the reusable package skeleton, venue-agnostic. Smith Theatre is a later instance, not the subject here.
>
> **Companions:** [`README.md`](./README.md) = phase map · [`DECISION-LOG.md`](./DECISION-LOG.md) = decisions D-001..D-015 · [`VWX-BEST-PRACTICES.md`](./VWX-BEST-PRACTICES.md) = research + Standards S-1..S-5.

---

## The one-liner

We are building a **reusable, versioned documentation package** that defines how a URITP Vectorworks show file is structured, so any base file is built to a known plan instead of improvised. Git = the plan; the `.vwx` = the realization.

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
2. **Resources** — which resource types we standardize and capture: symbols, record formats, worksheets, text/dimension styles, line types, title-block styles. (Exact set = future work.)
3. **Conventions (prose)** — naming, drafting standards, origin/datums, per-department READMEs. The WHY.
4. **Reconciliation snapshot (secondary)** — occasional CSV/PDF export from the file to check built-vs-planned (S-5). Not the lead content.

---

## Proposed template folder skeleton (DRAFT — for discussion, not built yet)

```
<package>/
  README.md                     — what this package is, venue, status, how to use
  standards/
    layers.md                   — the design-layer scheme (rules; list later)
    classes.md                  — the object-class scheme (rules; tree later)
    sheet-layers.md             — sheet numbering + viewport convention
    naming.md                   — naming discipline (dash-delimited, Standard Naming)
    drafting.md                 — line weights, text, dimension standards
    datums-and-reference-planes.md  — the S-4 rule note (universal convention)
  resources/
    README.md                   — which resource types we capture + why
  reference-notes/              — the hand-drawn notes/drawings handed to collaborators (S-5 primary)
  reconciliation/               — (optional) generated CSV/PDF snapshots for built-vs-planned checks
  CHANGELOG.md                  — the plan's version history
```

> Open: whether `reconciliation/` lives in-repo at all vs. stays a throwaway diff (S-5 open question); per-department README placement (likely one per department — Michael); exact `resources/` breakdown.

---

## Build order (phases, from the README map)

1. **Now — finish Phase 0 planning:** lock the folder skeleton (above), decide which resource types + which layer *categories* we capture, settle sheet-layer numbering (research pending), decide the reconciliation-snapshot policy.
2. **Phase 1 — Template Build:** stand up the folder skeleton with the prose standards written (rules, not lists), and the empty structure ready to fill.
3. **Then — exhaustive lists:** only after the skeleton is agreed do we write the actual layer list / class tree / resource inventory.
4. **Phase 2+ — Smith instance:** clone the template, fill in venue specifics. (Not now.)

---

## Deliberately NOT doing yet

- Exhaustive layer list, class tree, or resource inventory (Michael: stay out of the weeds until the skeleton's agreed).
- Anything Smith-specific (we're in template mode).
- Building the actual `.vwx` (that's Phase 2, and it follows this plan).

---

*Last updated: 2026-07-16. Status: DRAFT skeleton for discussion; not yet ratified.*
