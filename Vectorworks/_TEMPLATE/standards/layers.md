# Design-Layer Scheme (S-1)

> **The rule, not the list.** This states HOW layers are organized. The actual per-venue layer list is filled in when the package is built (and cross-checked against the file via `reconciliation/`).

---

## The rule

**Layers carry LOCATION + DEPARTMENT + ELEVATION.** (S-1)

A design layer encodes three things:

1. **Department** — who owns it (venue-base, scenic, lighting, audio, rigging, video, utility, PM).
2. **Elevation band** — the vertical zone the geometry lives in.
3. **Location / content** — what the layer actually holds.

**Elevation lives in the LAYER, never in a class.** (hard rule, S-1)

## Elevation bands (standard set)

| Band | Meaning |
|---|---|
| `0 NOTES` | non-geometry / notes / scratch |
| `1 DECK` | deck level |
| `1.5 MEZZ` | mezzanine / intermediate |
| `2 TOE` | toe-pipe level |
| `3 CATWALK` | catwalk / high steel |

> Bands are the standard vocabulary; a venue with different levels adapts the set but keeps the "elevation = layer" principle.

## Naming

`DEPARTMENT - NAME` (see [`naming.md`](./naming.md)). Department prefix routes the master-reference model (S-2) — a department file references only the layers it needs.

## Scale

All design layers share the **same scale** (Spotlight guidance, F-001) so referenced viewports line up.

## Why this shape

This is a **multi-department MASTER** (S-2), not a single designer's plot — so we deliberately run many layers (dept × elevation) rather than Spotlight's lean "one layer for all rigging" advice. Layers answer *where / whose / what height*; classes answer *what kind of thing*. The two stay orthogonal.

---

## TODO (per-instance)

- [ ] The full layer list for this venue (department × elevation grid).
- [ ] Any venue-specific elevation bands beyond the standard set.
- [ ] `layers.csv` reconciliation manifest columns: `layer name, department, elevation band, scale, 2D/3D, status`.

*Companion: [`classes.md`](./classes.md) (the orthogonal axis) · canonical rule in [`../../VWX-BEST-PRACTICES.md`](../../VWX-BEST-PRACTICES.md) § S-1.*
