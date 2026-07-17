# Design-Layer Scheme — Smith Theatre (S-1)

> **The rule, plus the venue list.** The RULE is universal (layers carry location + department + elevation, S-1); the enumerated Smith house layers live in the comma-CSV manifest [`layers.csv`](./layers.csv) (S-6). This file states the rule and the Smith department/elevation vocabulary.

---

## The rule (S-1)

**Layers carry LOCATION + DEPARTMENT + ELEVATION.** Elevation lives in the LAYER, never in a class. Department prefix routes the master-reference model (S-2) — a department file references only the layers it needs. All design layers share the **same scale** (F-001) so referenced viewports line up; scale is therefore uniform across the manifest and not enumerated per-row (it lives in the file).

## Elevation bands (Smith set)

Smith uses the standard band vocabulary:

| Band | Meaning at Smith |
|---|---|
| `0 NOTES` | non-geometry: scratch, system notes, render/PViz cameras |
| `1 DECK` | deck level: groundplan, deck plots, architecture |
| `1.5 MEZZ` | mezzanine / tech-setup intermediate |
| `2 TOE` | toe-pipe level |
| `3 CATWALK` | catwalk / high steel: rigging, overhead positions |

## Departments (Smith vocabulary)

From the working layer list: **UR** (venue base / architecture), **SCENIC**, **LX DESIGNER** + **HEAD ELECTRICIAN** (lighting), **AUDIO**, **RIGGING**, **VIDEO**, **UTILITY** (cameras / scratch), **PM** (tech setup). `VENUE BASE` layers are authored once in the master; `DEPARTMENT` layers are the thin per-discipline consumers (S-2).

## The manifest

The full house layer list is [`layers.csv`](./layers.csv) — one row per layer, columns `layer_name, department, elevation_band, scope, 2D, 3D, status, tags`. It is the **plan authored in git first** (S-5); once the file is built, a Vectorworks worksheet renders the actual layers and is exported to `../reconciliation/` to diff against this manifest. The worksheet never becomes the source.

> **Status: working draft.** Per-row `status` (REVIEWING / CREATED / NEW / DRAFTING / CUT?) mirrors the working sheet. The list is **not** a ratified Standard; the house layer set promotes only on Michael's explicit ruling + a mirrored DECISION-LOG row.

---

## Still open (per-instance)

- [ ] Resolve the `CUT?` candidate (`2D 2 [SPAC] Mezzanine`) and the unnumbered `>import 3D` / `VID - REP` rows.
- [ ] Lock the house layer set → promote from working draft to Standard (Michael's ruling).
- [ ] Confirm the uniform design-layer scale value in the file.

*Companion: [`classes.md`](./classes.md) (orthogonal axis) · rule in [`../../VWX-BEST-PRACTICES.md`](../../VWX-BEST-PRACTICES.md) § S-1. Source: Google Sheet "URITP VWX Smith Theatre BASE FILE Worksheets" (D-019).*
