# Naming Discipline — Smith Theatre (F-002 / F-010)

> Naming for layers, classes, views — the discipline that keeps the file navigable and reconciliation diffs clean. The RULE is universal; this notes the Smith vocabulary.

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

- [ ] Register the house naming as a Vectorworks **Standard Naming** standard in the Smith file so clones inherit it and auto-classing stays consistent (F-010). Open pending Michael.

*Canonical: [`../../VWX-BEST-PRACTICES.md`](../../VWX-BEST-PRACTICES.md) § F-002 / F-010.*
