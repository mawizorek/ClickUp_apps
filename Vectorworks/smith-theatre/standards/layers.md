# Design-Layer Scheme (S-1) — Smith Theatre

> **The rule, then the list.** This states HOW layers are organized (universal), followed by the **actual Smith layer list** (filled per-instance, D-019). The list is cross-checked against the file via [`../reconciliation/`](../reconciliation/).

---

## The rule

**Layers carry LOCATION + DEPARTMENT + ELEVATION.** (S-1)

A design layer encodes three things:

1. **Department** — who owns it (venue-base/UR, scenic, lighting, audio, rigging, video, utility, PM).
2. **Elevation band** — the vertical zone the geometry lives in.
3. **Location / content** — what the layer actually holds.

**Elevation lives in the LAYER, never in a class.** (hard rule, S-1)

## Elevation bands (D-012 — matches the Smith worksheet exactly)

| Band | Meaning |
|---|---|
| `0 NOTES` | non-geometry / notes / scratch / cameras |
| `1 DECK` | deck level |
| `1.5 MEZZ` | mezzanine / intermediate |
| `2 TOE` | toe-pipe level |
| `3 CATWALK` | catwalk / high steel |

## Naming

`DEPARTMENT - NAME` (see [`naming.md`](./naming.md)). The department prefix routes the master-reference model (S-2): a department file references only the layers it needs. `VENUE BASE` layers are the master geometry authored once and consumed downstream (S-2/D-011); `DEPARTMENT` layers are the per-department working layers.

## Scale

All design layers share the **same scale** (Spotlight guidance, F-001) so referenced viewports line up. The shared value is set in the file and confirmed on reconciliation; it is not restated per-row (S-4).

---

## The Smith layer list (27 layers — source: Google Sheet "URITP VWX Smith Theatre BASE FILE Worksheets")

Machine-comparable manifest: [`layers.csv`](./layers.csv) (authored first as the plan, S-5). Grouped below by elevation band for reading.

### `3 CATWALK`

| Layer | Department | Scope | 2D/3D | Status |
|---|---|---|---|---|
| RIGGING - OVERHEAD | RIGGING | VENUE BASE | 2D+3D | CREATED |
| _HANG POSITIONS | UR | VENUE BASE | 2D | REVIEWING |
| 3D 3 CATWALKS | UR | VENUE BASE | 3D | REVIEWING |
| LX - REP | HEAD ELECTRICIAN | VENUE BASE | 2D+3D | NEW (house/work lights) |
| LX - PLOT SECTIONS | HEAD ELECTRICIAN | DEPARTMENT | 2D | NEW |
| LX - PLOT 1 CATWALKS | LX DESIGNER | DEPARTMENT | 2D+3D | NEW |
| UTL - CAMERAS | UTILITY | DEPARTMENT | 2D+3D | PLANNED (rep) |
| VID - OVERHEAD | VIDEO | DEPARTMENT | — | DRAFTING |

### `2 TOE`

| Layer | Department | Scope | 2D/3D | Status |
|---|---|---|---|---|
| AUDIO - OVERHEAD | AUDIO | DEPARTMENT | 2D+3D | CREATED |
| AUDIO - REP | AUDIO | VENUE BASE | 3D | DRAFTING (rep) |
| LX - PLOT 2 TOE PIPES | LX DESIGNER | DEPARTMENT | 2D+3D | NEW |
| SCENIC - OVERHEAD | SCENIC | DEPARTMENT | — | PLANNED |
| VID - TOE PIPES | VIDEO | DEPARTMENT | — | PLANNED |

### `1.5 MEZZ`

| Layer | Department | Scope | 2D/3D | Status |
|---|---|---|---|---|
| 3D 2 MEZZANINE | UR | VENUE BASE | 3D | REVIEWING |
| LX - MEZZ | LX DESIGNER | DEPARTMENT | 2D+3D | NEW |
| TECH SETUP | PM | DEPARTMENT | 2D+3D | PLANNED |

### `1 DECK`

| Layer | Department | Scope | 2D/3D | Status |
|---|---|---|---|---|
| Theatre Architecture | UR | VENUE BASE | 2D+3D | PLANNED |
| 3D 1 GROUNDPLAN | UR | VENUE BASE | 3D | REVIEWING |
| LX - focus points | LX DESIGNER | DEPARTMENT | 2D+3D | CREATED |
| LX - PLOT 3 DECK | LX DESIGNER | DEPARTMENT | 2D+3D | NEW |
| SCENIC - DECK | SCENIC | DEPARTMENT | — | DRAFTING |
| SCENIC - Symbols | SCENIC | DEPARTMENT | — | PLANNED |
| VID - DECK | VIDEO | DEPARTMENT | — | PLANNED |

### `0 NOTES`

| Layer | Department | Scope | 2D/3D | Status |
|---|---|---|---|---|
| PVIZ - View CAMERAS | UTILITY | VENUE BASE | 3D | DRAFTING (render cameras) |
| WORKING SCRATCH | UTILITY | VENUE BASE | 2D+3D | PLANNED |
| VID - SYSTEM NOTES | VIDEO | DEPARTMENT | — | PLANNED |

### Elevation unassigned (confirm at build)

| Layer | Department | Scope | 2D/3D | Status |
|---|---|---|---|---|
| VID - REP | VIDEO | VENUE BASE | — | PLANNED (rep) |

> `2D/3D` reflects the worksheet's 2D/3D content flags; `—` = not yet built. `Status` carried verbatim from the worksheet (blank → PLANNED). `rep` = repertory/house layer.

---

## TODO (per-instance)

- [ ] Confirm `VID - REP` elevation band (unset in the worksheet).
- [ ] Confirm which `VENUE BASE` layers form the referenced master vs. department working layers (S-2/D-011).
- [ ] Generate `../reconciliation/layers.csv` from the file and diff against [`layers.csv`](./layers.csv) once the file is built.

*Companion: [`classes.md`](./classes.md) (the orthogonal axis) · canonical rule in [`../../VWX-BEST-PRACTICES.md`](../../VWX-BEST-PRACTICES.md) § S-1.*
