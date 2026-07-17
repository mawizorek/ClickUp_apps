# Naming Discipline (F-002 / F-010)

> **Package-local copy — self-contained on purpose.** Seeded from the global starting point in the package README; on clone this becomes THIS file's own naming standard, **allowed to drift per venue**, and it **travels with the package when exported** to the file viewer (it never depends on pointing up to the app-level notes, which don't ship with the export). State the rule fully here rather than deferring.

---

## Classes — dash-delimited hierarchy

Up to **4 parts, dash-separated** (`Category-Sub-Detail`). The dash drives hierarchical nesting in the Navigation / Organization palettes (F-002). See [`classes.md`](./classes.md).

## Layers — department + name

`DEPARTMENT - NAME`, with an elevation band attached (see [`layers.md`](./layers.md)). The department prefix routes the master-reference model (S-2).

## Sheets — department prefix + number

`<DEPT><n>`, `0` = readme sheet (see [`sheet-layers.md`](./sheet-layers.md)).

## Register it as a Standard Naming standard (F-010)

Vectorworks has a built-in **Standard Naming** facility (`File > Document Settings > Standard Naming`) for layers/classes/viewports — ships VWArch + AIA/NCS + User 1/2/3 slots, up to 99 custom standards per type via the `ClassNameStds` / `LayerNameStds` / `ViewNameStds` worksheets. **Register the house naming** so every cloned file inherits it and auto-classing stays consistent.

## General rules

- Be consistent; a name is a key the reconciliation diff matches on.
- No commas in names (they'd need quoting in the comma-CSV manifests, S-6).
- Prefer the standard vocabulary (department names, elevation bands) over ad-hoc synonyms.

---

## TODO (per-instance)

- [ ] Confirm the department-name vocabulary for this venue.
- [ ] Register the house naming as a Standard Naming standard in the file.

*Canonical research: [`../../VWX-BEST-PRACTICES.md`](../../VWX-BEST-PRACTICES.md) § F-002 / F-010. Global seed: the package README naming section.*
