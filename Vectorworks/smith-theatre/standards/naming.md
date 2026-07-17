# Naming Discipline — Smith Theatre (F-002 / F-010)

> **Package-local naming standard — self-contained on purpose (D-024).** Seeded from the template's global starting point, this is **Smith's own copy**: true to this file, **allowed to drift** from other packages, and it **travels with the package when exported** to the file viewer. It states the rule in full rather than pointing up to app-level notes (those don't ship with the export). Surfaced in summary in the package [`../README.md`](../README.md).

---

## Classes — dash-delimited hierarchy

Up to 4 parts, dash-separated (`Category-Sub-Detail`); the dash drives nesting (F-002). See [`classes.md`](./classes.md).

## Layers — department + name

`DEPARTMENT - NAME` with an elevation band ([`layers.md`](./layers.md)). Smith department vocabulary (canonical, use over synonyms): **UR, SCENIC, LX DESIGNER, HEAD ELECTRICIAN, AUDIO, RIGGING, VIDEO, UTILITY, PM**.

## Sheets — department prefix + number

`<DEPT><n>`, `0` = readme sheet (see [`sheet-layers.md`](./sheet-layers.md)).

## General rules

- Be consistent; a name is the key the reconciliation diff matches on.
- **No commas in names** (they'd need quoting in the comma-CSV manifests, S-6).
- Prefer the standard vocabulary (department names, elevation bands) over ad-hoc synonyms.

---

## To confirm (per-instance)

- [ ] Register the Smith house naming as a Vectorworks **Standard Naming** standard in the file so clones inherit it and auto-classing stays consistent (F-010). Open pending Michael.

*Canonical research: [`../../VWX-BEST-PRACTICES.md`](../../VWX-BEST-PRACTICES.md) § F-002 / F-010. Global seed: the template README naming section.*
