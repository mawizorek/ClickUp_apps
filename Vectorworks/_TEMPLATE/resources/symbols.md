# Symbols — Library Organization + Naming

> Symbols are the **reusable-content backbone** (instruments, scenic units, rigging, hardware). This file is the PLAN (how the library is organized); the actual symbol inventory is a generated `symbols.csv` on the reconciliation side (S-5/S-6).

---

## Organization (the plan)

How the symbol library is structured: folder/category grouping, what belongs where, and the naming convention. Symbols are hybrid 2D/3D where they must read in both plan and 3D (F-005).

**Key F-005 rule for hybrid symbols:** the 2D component must be a **screen-plane** representation, not a 2D planar object, or it won't behave in 3D views. Lighting-device symbols must be hybrid.

**Records travel with the symbol definition** (F-005): attaching a record format to a symbol definition auto-attaches it to every instance — this is what makes the symbol inventory machine-readable (see [`records.md`](./records.md)).

## Naming

Follow the house naming discipline ([`../standards/naming.md`](../standards/naming.md)). No commas (comma-CSV, S-6).

## The symbols manifest (reconciliation)

`symbols.csv` is **generated from a Vectorworks worksheet database row** (F-011), not hand-typed. Draft columns:

```
name, type, default layer, default class, <key record fields…>, count
```

Git holds the *planned* manifest; the VWX worksheet renders the *actual* symbols to diff against it (S-5). There is no clean one-click RM dump — the worksheet is the reliable path (F-012).

---

## TODO (per-instance)

- [ ] Symbol library category structure for this venue.
- [ ] Naming convention specifics + any auto-classing hooks.
- [ ] Finalize `symbols.csv` columns (which record fields to surface).
- [ ] Confirm hybrid/screen-plane authoring for pipe/position/instrument symbols.

*Canonical: [`../../VWX-BEST-PRACTICES.md`](../../VWX-BEST-PRACTICES.md) § F-005 / F-011 / F-012.*
