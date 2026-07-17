# Object-Class Scheme — Smith Theatre (S-1)

> **PROPOSAL — not a ratified Standard.** The RULE is universal (classes = object category for filtering, dash-nested, no elevation, S-1). The tree below is a **per-instance proposal**; there is no authoritative Smith class list yet. **Nothing here promotes to a Standard without Michael's explicit ruling + a mirrored DECISION-LOG row** (D-022). No `classes.csv` manifest is authored until the tree is ruled.

---

## The rule (S-1)

A class answers *what kind of thing is this* — steel, wood, framing, masking, etc. — so viewports and saved views globally toggle object types on/off. Classes are **category only**: not a linestyle/weight bucket (that's [`drafting.md`](./drafting.md)) and **never** elevation (that's the layer). Dash-delimited, up to 4 parts; the dash drives hierarchical nesting (F-002). Anticipate Spotlight auto-classing so the house tree nests cleanly with auto-created device classes.

## Proposed tree (DRAFT — awaiting ruling)

```
Steel
Steel-Beam
Steel-Pipe
Wood
Wood-Ply
Wood-Dimensional
Framing-Stud
Framing-Platform
Masking-Border
Masking-Leg
Masking-Traveler
```

This is the *shape* Michael called for (steel / wood / framing / masking + dash-nested children, D-012), not a committed set. Lighting/audio/video device classes are expected to arrive via Spotlight auto-classing rather than being hand-authored here.

---

## To resolve before promotion

- [ ] Michael rules the top-level categories + the dash hierarchy.
- [ ] Confirm which categories map to Spotlight auto-classing (device classes from a field value).
- [ ] On ruling: author `classes.csv` (columns `class_name (dash path), parent_group, purpose, default_attributes`) + mirror a dated DECISION-LOG row promoting to a Standard.

*Companion: [`layers.md`](./layers.md) (orthogonal axis) · [`drafting.md`](./drafting.md) (linework) · rule in [`../../VWX-BEST-PRACTICES.md`](../../VWX-BEST-PRACTICES.md) § S-1.*
