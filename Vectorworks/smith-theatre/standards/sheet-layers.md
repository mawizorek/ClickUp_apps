# Sheet-Layer Numbering + Viewport Convention (DRAFT — F-016) — Smith Theatre

> **Lightweight draft.** The pattern is set; the full per-department drawing list below is drafted from the **existing ClickUp scheme** and is **not yet a ratified Standard** — F-016 promotion awaits Michael (candidate #2).

---

## What sheet layers are

Sheet layers = presentation / "paper space," always at **1:1**, holding **viewports, title block borders, notes, annotations** (F-003). Scale is per-viewport, not on the sheet. Each sheet layer has its own user origin.

## The numbering pattern

`<DEPT><n>` — a department letter + a number. Grounded in the National CAD Standard (discipline-letter prefix + sheet-type digit) and USITT discipline-set conventions (F-016).

| Prefix | Department | `0` sheet |
|---|---|---|
| `UR` | Venue base / architecture (groundplan, sections) | `UR0` = file readme |
| `S` | Scenic | `S0` = scenic readme |
| `L` | Lighting | `L0` = lighting readme |
| `A` | Audio | `A0` = audio readme |
| `R` | Rigging | `R0` = rigging readme |
| `V` | Video | `V0` = video readme |

## Rules

- **`0` = the department's readme sheet** (hard rule). Real drawings start at `1`.
- Numbers **ascend in drawing order** within a department.
- An **indented sheet number = a viewport** off the sheet above it.
- Title block lives on the sheet layer (see [`../resources/title-blocks.md`](../resources/title-blocks.md)).

---

## Drafted per-department sheet list (from the existing ClickUp scheme)

### `UR` — Venue base / architecture

| Sheet | Drawing |
|---|---|
| UR0 | File readme |
| UR1 | Groundplan |
| UR2 | Overhead |
| UR3 | Section — West |
| UR4 | Section — North |
| UR5 | Section — East |
| UR6 | Section — South |

### `S` — Scenic

| Sheet | Drawing |
|---|---|
| S0 | Scenic readme |
| S1–S7 | Scenic drawings (exact list locked at build) |

### `L` — Lighting · `A` — Audio · `R` — Rigging · `V` — Video

| Sheet | Drawing |
|---|---|
| L0 / A0 / R0 / V0 | Department readme |
| L1+ / A1+ / R1+ / V1+ | Department drawings (exact list locked at build) |

---

## Reconciling the sheet scheme against the layer list (flag for Michael)

The **layer-department set is richer than the sheet-prefix set** ([`layers.md`](./layers.md)):

- **Lighting** splits across two layer departments — `LX DESIGNER` and `HEAD ELECTRICIAN` — but both feed the single **`L`** sheet prefix. Confirm this is intended (one lighting sheet set, two layer owners).
- **`UTILITY`** (cameras, PViz, working scratch) and **`PM`** (tech setup) are **working layers** with no drawing set in the draft scheme. Confirm they get no department sheets (their content appears on other departments' sheets / utility views).

---

## TODO (finalized at first venue build)

- [ ] The full per-department drawing list (which sheets exist, in order).
- [ ] Whether any department needs a two-digit sheet-type split (plans vs sections vs details).
- [ ] **Michael's confirmation** of the prefix set vs. the actual departments (LX split; UTILITY/PM).
- [ ] Promote draft → Standard once locked (mirror with a dated DECISION-LOG row).

*Research basis: [`../../VWX-BEST-PRACTICES.md`](../../VWX-BEST-PRACTICES.md) § F-016 / F-003.*
