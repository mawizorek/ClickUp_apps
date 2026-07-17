# Naming Discipline (F-002 / F-010) — Smith Theatre

> Naming conventions for layers, classes, and views — the discipline that keeps the file navigable and reconciliation diffs clean.

---

## Classes — dash-delimited hierarchy

Up to **4 parts, dash-separated** (`Category-Sub-Detail`). The dash drives hierarchical nesting in the Navigation / Organization palettes (F-002). See [`classes.md`](./classes.md).

## Layers — department + name

`DEPARTMENT - NAME`, with an elevation band attached (see [`layers.md`](./layers.md)). The department prefix routes the master-reference model (S-2).

**Smith department vocabulary (confirmed from the layer worksheet):**

| Department | Role |
|---|---|
| `UR` | Venue base / architecture (master geometry) |
| `SCENIC` | Scenic |
| `LX DESIGNER` | Lighting design layers |
| `HEAD ELECTRICIAN` | Lighting rep / house + work light + sections |
| `AUDIO` | Audio |
| `RIGGING` | Rigging |
| `VIDEO` | Video |
| `UTILITY` | Cameras / PViz / working scratch |
| `PM` | Tech setup |

## Sheets — department prefix + number

`<DEPT><n>`, `0` = readme sheet (see [`sheet-layers.md`](./sheet-layers.md)).

## Register it as a Standard Naming standard (F-010)

Vectorworks has a built-in **Standard Naming** facility (`File > Document Settings > Standard Naming`) for layers/classes/viewports. **Registering the house naming here in the template** lets every cloned file inherit it and keeps auto-classing consistent.

## General rules

- Be consistent; a name is a key the reconciliation diff matches on.
- **No commas in names** (they'd need quoting in the comma-CSV manifests, S-6).
- Prefer the standard vocabulary (department names, elevation bands) over ad-hoc synonyms.

---

## TODO (per-instance)

- [x] Confirm the department-name vocabulary for Smith (table above).
- [ ] Register the house naming as a Standard Naming standard in the template file (F-010, pending Michael).

*Canonical: [`../../VWX-BEST-PRACTICES.md`](../../VWX-BEST-PRACTICES.md) § F-002 / F-010.*
