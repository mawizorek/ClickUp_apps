# Sheet-Layer Numbering + Viewport Convention (DRAFT — F-016)

> **Lightweight draft.** The pattern is set; the full per-department drawing list is finalized when the first real venue package is built. Not yet a ratified Standard.

---

## What sheet layers are

Sheet layers = presentation / "paper space," always at **1:1**, holding **viewports, title block borders, notes, annotations** (F-003). Scale is expressed per-viewport, not on the sheet. Each sheet layer has its own user origin.

## The numbering pattern

`<DEPT><n>` — a department letter + a number. Grounded in the National CAD Standard (discipline-letter prefix + sheet-type digit) and USITT discipline-set conventions (F-016).

| Prefix | Department | `0` sheet |
|---|---|---|
| `UR` | Venue base / architecture (groundplan, sections) | `UR0` = file readme |
| `S`  | Scenic | `S0` = scenic readme |
| `L`  | Lighting | `L0` = lighting readme |
| `A`  | Audio | `A0` = audio readme |
| `R`  | Rigging | `R0` = rigging readme |
| `V`  | Video | `V0` = video readme |

## Rules

- **`0` = the department's readme sheet** (hard rule). Real drawings start at `1`.
- Numbers **ascend in drawing order** within a department.
- An **indented sheet number = a viewport** off the sheet above it.
- Title block lives on the sheet layer (see [`../resources/title-blocks.md`](../resources/title-blocks.md)).

---

## TODO (finalized at first venue build)

- [ ] The full per-department drawing list (which sheets exist, in order).
- [ ] Whether any department needs a two-digit sheet-type split (plans vs sections vs details).
- [ ] Confirm prefix set against the actual departments in the layer list ([`layers.md`](./layers.md)).
- [ ] Promote from draft → Standard once the list is settled.

*Research basis: [`../../VWX-BEST-PRACTICES.md`](../../VWX-BEST-PRACTICES.md) § F-016 / F-003.*
