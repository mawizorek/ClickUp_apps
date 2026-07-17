# Vectorworks Documentation Package — TEMPLATE

> **This folder is the GOLD STANDARD skeleton.** To start a new package (a venue/show base file), **copy this entire `_TEMPLATE/` folder** to a new sibling folder named for the venue (e.g. `smith-theatre/`), then fill in the placeholders. Never edit `_TEMPLATE/` with venue specifics — it stays generic so it's always safe to clone.
>
> **Scope:** org-agnostic. This works for ANY Vectorworks file, not just URITP. (D-016)

---

## What this package is

A **versioned documentation package** that defines how a Vectorworks file is structured, so a base file is built to a known plan instead of improvised. **Git is the plan; the `.vwx` is the realization.** (S-5)

- **You draft *from* these docs** in Vectorworks. The docs lead; the file follows.
- The `.vwx` itself lives **outside git** (locally / Box / Drive). This package documents it, references it, and is used to check it. (D-009)

---

## The standards this package follows

Canonical detail lives in the domain doc [`../VWX-BEST-PRACTICES.md`](../VWX-BEST-PRACTICES.md); the one-line version:

| # | Standard | One-line |
|---|----------|----------|
| S-1 | Hybrid layer/class | **Layers** = location + department + elevation. **Classes** = object category for filtering. Elevation never in classes. |
| S-2 | Master-reference model | One dense **master** file; department/show files **reference** it (Design Layer Viewport), staying thin. |
| S-3 | Origin datum | A meaningful room datum, coincident with the **internal origin (0,0)**. |
| S-4 | Datums & reference planes | Document the **rule**, never the numbers; values live in the file. |
| S-5 | Direction of truth | **Git leads** (plan + hand-drawn notes), VWX realizes, export = reconciliation check. |
| S-6 | File-format split | **Prose → Markdown**, **data manifests → comma-CSV**. No `.txt`. |

---

## Naming conventions — global starting point (D-024)

**This is the seed every package inherits.** On clone, it becomes the package's **own local copy** ([`standards/naming.md`](./standards/naming.md)) that is **allowed to drift per venue** and **travels with the package when it's exported** to the file viewer. The package-local copy is the source of truth for THAT file; this template section is only the default it starts from. (Drift is intentional — different showfile templates may legitimately name things differently.)

The default discipline:

- **Classes — dash-delimited hierarchy.** Up to 4 parts, dash-separated (`Category-Sub-Detail`); the dash drives nesting in the Navigation / Organization palettes (F-002).
- **Layers — `DEPARTMENT - NAME`** with an elevation band; the department prefix routes the master-reference model (S-2).
- **Sheets — `<DEPT><n>`**, `0` = the department readme sheet.
- **No commas in names** (they'd need quoting in the comma-CSV manifests, S-6). Prefer the standard vocabulary over ad-hoc synonyms; a name is the key the reconciliation diff matches on.
- **Register as a VWX Standard Naming standard** (`File > Document Settings > Standard Naming`) so every cloned file inherits it and auto-classing stays consistent (F-010).

Full rule + per-instance vocabulary slots: [`standards/naming.md`](./standards/naming.md). Canonical research: [`../VWX-BEST-PRACTICES.md`](../VWX-BEST-PRACTICES.md) § F-002 / F-010.

---

## What's in this package (the tree)

```
<package>/
  README.md                     — this file: what the package is + how to use it
  standards/                    — the PLAN: rules a drafter builds from (prose, .md)
    layers.md                   — design-layer scheme (dept × elevation)
    classes.md                  — object-class scheme (categories, dash-nested)
    sheet-layers.md             — sheet numbering + viewport convention
    naming.md                   — naming discipline (package-local copy; may drift; exported)
    drafting.md                 — line weights, text, dimension standards
    datums-and-reference-planes.md  — which surface is the datum, per elevation (S-4)
  resources/                    — the reusable content plan (prose .md + per-record CSVs)
    README.md                   — which resource types we capture + why (index)
    symbols.md                  — symbol library organization + naming
    records.md                  — record-format overview (+ record-<NAME>.csv per type)
    title-blocks.md             — title block border styles
    hatches.md                  — standardized hatches / tile fills
    saved-views.md              — standardized saved views / navigation
  reference-notes/              — the hand-drawn handouts + Michael's build reference (S-5 primary)
    README.md
  reconciliation/               — exports dumped FROM the file to check built-vs-planned (S-5 secondary)
    README.md                   — HOW to export from Vectorworks + what belongs here
  CHANGELOG.md                  — this package's version history
```

---

## How to start a new package (clone checklist)

1. Copy `_TEMPLATE/` → ` /`.
2. Fill this README's venue line + status, and surface the venue's naming conventions in the package README (seeded from the section above; may drift per venue).
3. Work `standards/` first (the plan you build from), then `resources/`.
4. Drop hand-drawn handouts in `reference-notes/`.
5. Only after the plan is set, build the `.vwx` from it; use `reconciliation/` to check the build.
6. Log every real decision in [`../DECISION-LOG.md`](../DECISION-LOG.md); keep this package's `CHANGELOG.md` current.

---

**Package:** _TEMPLATE (generic) · **Status:** skeleton · **Venue:** none (fill on clone)

*Placeholders throughout are marked `<…>` or “TODO (per-instance)”. Prose files state the RULE; exhaustive lists (actual layers, classes, symbols) are filled per-package.*
