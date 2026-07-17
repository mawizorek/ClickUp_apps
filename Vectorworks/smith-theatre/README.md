# Vectorworks Documentation Package — Smith Theatre

> Cloned from [`../_TEMPLATE/`](../_TEMPLATE/) (D-018). This is the **first real package instance** (D-002). It documents the Smith Theatre base show file: the **plan** we build the `.vwx` FROM. Git leads, the file follows (S-5).
>
> **Scope:** Smith Theatre (URITP). Universal rules point up to [`../VWX-BEST-PRACTICES.md`](../VWX-BEST-PRACTICES.md); only venue-specific content lives here.

---

## What this package is

A **versioned documentation package** that defines how the Smith Theatre base show file is structured, so the file is built to a known plan instead of improvised. **Git is the plan; the `.vwx` is the realization** (S-5).

- You draft *from* these docs in Vectorworks. The docs lead; the file follows.
- The `.vwx` itself lives **outside git** (locally / Box / Drive). This package documents it, references it, and is used to check it (D-009).

---

## Venue snapshot (rules, not numbers — S-4)

- **Room:** blackbox rectangle. Datum = center of the room rectangle, coincident with the Vectorworks **internal origin (0,0)** — already built (D-013). See [`standards/datums-and-reference-planes.md`](./standards/datums-and-reference-planes.md).
- **Departments (from the layer worksheet):** UR (venue base / architecture), SCENIC, LX DESIGNER, HEAD ELECTRICIAN, AUDIO, RIGGING, VIDEO, UTILITY, PM.
- **Elevation bands (D-012):** `0 NOTES / 1 DECK / 1.5 MEZZ / 2 TOE / 3 CATWALK`.
- Real dimensions, trim heights, and load limits live **in the file + exported worksheets**, never in this prose (S-4).

---

## Package tree

```
smith-theatre/
  README.md                        — this file
  standards/                       — the PLAN: rules a drafter builds from (+ filled Smith lists)
    layers.md                      — design-layer scheme + the actual 27-layer list
    layers.csv                     — layer manifest (the plan; reconciled against the file)
    classes.md                     — object-class scheme + PROPOSED Smith tree (pending ruling)
    classes.csv                    — class manifest (proposed)
    sheet-layers.md                — sheet numbering + drafted per-department list (F-016 draft)
    naming.md                      — naming discipline + Smith department vocabulary
    drafting.md                    — line weights, text, dimension standards
    datums-and-reference-planes.md — Smith origin + per-elevation reference-plane RULE (S-4)
  resources/                       — reusable content plan (prose .md + per-record CSVs)
    README.md                      — which resource types we capture + why (index)
    symbols.md                     — symbol library organization + naming
    records.md                     — record-format overview
    record-lighting-device.csv     — lighting-device record schema (example fields)
    record-rigging-point.csv       — rigging-point record schema (example fields)
    title-blocks.md                — title block border styles
    hatches.md                     — standardized hatches / tile fills
    saved-views.md                 — standardized saved views / navigation
  reference-notes/                 — hand-drawn handouts + Michael's build reference (S-5 primary)
    README.md
  reconciliation/                  — exports dumped FROM the file to check built-vs-planned (S-5 secondary)
    README.md
  CHANGELOG.md                     — this package's version history
```

---

## Status

**Package:** smith-theatre · **Status:** Phase 1→2 (skeleton cloned, per-instance placeholders filled) · **Venue:** Smith Theatre

- `standards/` filled first, then `resources/` (clone checklist step 3).
- **Filled from source:** layer list (Google Sheet), reference-plane rule (D-014), department vocabulary.
- **PROPOSED / pending Michael's ruling before Standard promotion:** object-class tree, full per-department sheet list (F-016). See CANDIDATES in [`../DECISION-LOG.md`](../DECISION-LOG.md).
- **Deferred to the build:** hand-drawn handouts (drop in `reference-notes/`), generated reconciliation manifests, dimension values (live in the `.vwx`).
