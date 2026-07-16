# Object-Class Scheme (S-1)

> **The rule, not the tree.** This states HOW classes are organized. The actual per-venue class tree is filled in when the package is built.

---

## The rule

**Classes carry OBJECT CATEGORY, for filtering.** (S-1)

A class answers *what kind of thing is this* — **steel, wood, framing, masking**, etc. — so viewports and saved views can globally toggle object types on/off. Classes are the **object-filtering** system.

- Classes are **NOT** a linestyle/weight bucket (that's [`drafting.md`](./drafting.md)).
- Classes do **NOT** carry elevation (that's the layer, S-1).

## Naming (dash-delimited hierarchy)

Up to **4 parts, separated by a dash**; the dash drives hierarchical nesting in the Navigation / Organization palettes (F-002). Examples of the *shape* (not a committed tree):

```
Steel
Wood
Framing-Stud
Framing-Platform
Masking-Border
Masking-Leg
```

Anticipate Spotlight auto-classing (device classes generated from a field value, prefix/suffix) so the house tree nests cleanly with auto-created classes (F-002).

## Why object-based

Michael's call (D-012): classes should let you toggle "all masking" or "all steel" across the whole file. Graphic linework is handled separately in `drafting.md`; elevation is handled in layers. Keeping classes purely categorical keeps the three axes orthogonal.

---

## TODO (per-instance)

- [ ] The full object-class tree for this venue (top-level categories + dash-nested children).
- [ ] Confirm which categories map to Spotlight auto-classing.
- [ ] `classes.csv` reconciliation columns: `class name (dash path), parent group, purpose, default attributes`.

*Companion: [`layers.md`](./layers.md) (the orthogonal axis) · [`drafting.md`](./drafting.md) (linework) · canonical rule in [`../../VWX-BEST-PRACTICES.md`](../../VWX-BEST-PRACTICES.md) § S-1.*
