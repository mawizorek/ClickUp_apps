# Record Formats — Smith Theatre (overview)

> Record formats are the data schema attached to objects/symbols — the fields the worksheet manifests read (F-011/F-012). This is the prose overview; **each record type gets its own example CSV** (`record-<NAME>.csv`) with explicit sample rows (D-017).

---

## What a record format is

A named set of fields attached to an object or symbol. Attach a record to a **symbol definition** and it auto-attaches to every instance (F-012) — the backbone that makes the inventory machine-readable.

## Smith record types (per-type CSVs, D-017)

Comma-delimited (S-6). Each type is documented by example in its own file:

- [`record-lighting-device.csv`](./record-lighting-device.csv) — instruments (position, unit #, purpose, class/layer).
- [`record-rigging-point.csv`](./record-rigging-point.csv) — high-steel points (beam, capacity intent, class/layer).

More types (scenic unit, audio device, video device) get their own `record-<NAME>.csv` as they're defined.

> The template's `record-EXAMPLE.csv` demo is **not** carried into Smith (replaced by the real per-type CSVs above).

---

## TODO (per-instance)

- [ ] Confirm the full record-format list Smith uses.
- [ ] Note which records auto-attach to which symbol definitions.
- [ ] Add `record-<NAME>.csv` for scenic / audio / video as defined.

*Companion: [`symbols.md`](./symbols.md) · canonical [`../../VWX-BEST-PRACTICES.md`](../../VWX-BEST-PRACTICES.md) § F-012 + D-017.*
