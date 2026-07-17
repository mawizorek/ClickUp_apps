# Object-Class Scheme (S-1) — Smith Theatre

> **The rule, then a PROPOSED tree.** This states HOW classes are organized (universal). The Smith object-class tree below is a **DRAFT proposal** — it is candidate #1 and **awaits Michael's ruling before promotion to a Standard** (guardrail). Nothing here is ratified.

---

## The rule

**Classes carry OBJECT CATEGORY, for filtering.** (S-1)

A class answers *what kind of thing is this* — **steel, wood, framing, masking**, etc. — so viewports and saved views can globally toggle object types on/off. Classes are the **object-filtering** system.

- Classes are **NOT** a linestyle/weight bucket (that's [`drafting.md`](./drafting.md)).
- Classes do **NOT** carry elevation (that's the layer, S-1).

## Naming (dash-delimited hierarchy)

Up to **4 parts, dash-separated** (`Category-Sub-Detail`); the dash drives hierarchical nesting in the Navigation / Organization palettes (F-002). Anticipate Spotlight auto-classing (device classes generated from a field value) so the house tree nests cleanly with auto-created classes (F-002).

---

## PROPOSED Smith object-class tree (DRAFT — pending Michael's ruling)

Top-level categories from D-012 (`steel / wood / framing / masking`), extended with the object categories implied by the Smith departments (rigging, lighting, scenic, soft goods, hardware). Proposed, not committed:

```
Steel
Wood
Framing-Stud
Framing-Platform
Framing-Facing
Masking-Border
Masking-Leg
Masking-Traveler
Masking-Ground-Row
Rigging-Pipe
Rigging-Point
Rigging-Hardware
Rigging-Motor
Lighting-Device
Lighting-Accessory
Lighting-Cable
Scenic-Hard
Scenic-Soft
Scenic-Deck
Hardware
```

> Graphic concerns (line weight/type) are handled in [`drafting.md`](./drafting.md), not here. Elevation is handled in [`layers.md`](./layers.md), not here. Keeping classes purely categorical keeps the three axes orthogonal (D-012).

Machine-comparable manifest: [`classes.csv`](./classes.csv) (proposed plan).

---

## TODO (per-instance)

- [ ] **Michael's ruling** on the proposed tree above before any Standard promotion (mirror with a dated DECISION-LOG row).
- [ ] Confirm which categories map to Spotlight auto-classing (`Lighting-Device` likely auto-generated).
- [ ] Confirm masking/rigging sub-children against the actual Smith inventory.

*Companion: [`layers.md`](./layers.md) (orthogonal axis) · [`drafting.md`](./drafting.md) (linework) · canonical rule in [`../../VWX-BEST-PRACTICES.md`](../../VWX-BEST-PRACTICES.md) § S-1.*
