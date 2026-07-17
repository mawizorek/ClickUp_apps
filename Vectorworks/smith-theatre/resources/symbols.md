# Symbols — Smith Theatre (library organization + naming)

> Symbols are the reusable-content backbone (instruments, scenic units, rigging hardware). This file is the PLAN (how the library is organized); the actual inventory is a generated `symbols.csv` on the reconciliation side (S-5/S-6).

---

## Organization (the plan)

Group the Smith library by department category, mirroring the layer departments: **lighting devices, rigging points/hardware, scenic units, audio, video, hang positions**. Symbols are hybrid 2D/3D where they must read in both plan and 3D (F-005).

**Key F-005 rule for hybrid symbols:** the 2D component must be a **screen-plane** representation (not a 2D planar object) or it won't behave in 3D. Lighting-device and pipe/position symbols must be hybrid.

**Records travel with the symbol definition** (F-005): attach a record format to the definition and it auto-attaches to every instance — this is what makes the inventory machine-readable (see [`records.md`](./records.md)).

## Naming

Follow the house naming discipline ([`../standards/naming.md`](../standards/naming.md)). No commas (comma-CSV, S-6).

## The manifest (reconciliation)

`symbols.csv` is **generated from a Vectorworks worksheet database row** (F-011), not hand-typed. Draft columns: `name, type, default_layer, default_class, <key record fields>, count`. Git holds the *planned* manifest; the worksheet renders the *actual* symbols to diff against it (S-5).

---

## TODO (per-instance)

- [ ] Symbol library category structure for Smith (confirm against the layer departments).
- [ ] Hybrid/screen-plane authoring for pipe/position/instrument symbols.
- [ ] Finalize `symbols.csv` columns (which record fields to surface).

*Canonical: [`../../VWX-BEST-PRACTICES.md`](../../VWX-BEST-PRACTICES.md) § F-005 / F-011 / F-012.*
