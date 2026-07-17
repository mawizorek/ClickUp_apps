# Record Formats — Overview — Smith Theatre

> Record formats are the **data schema** attached to objects/symbols — the fields the worksheet manifests read (F-011/F-012). This is the prose overview; **each record type gets its own example CSV** (`record-<NAME>.csv`) with explicit sample rows (D-017).

---

## What a record format is

A named set of fields (model, position, purpose, dimensions, etc.) attached to an object or symbol. Attach a record to a **symbol definition** and it auto-attaches to every instance (F-012) — the backbone that makes the symbol inventory machine-readable.

## Smith record types (per-type CSVs)

| Record type | CSV | Rides on |
|---|---|---|
| Lighting device | [`record-lighting-device.csv`](./record-lighting-device.csv) | Lighting-Device symbols (auto-attach) |
| Rigging point | [`record-rigging-point.csv`](./record-rigging-point.csv) | Rigging-Point symbols |

One CSV per record type keeps each schema tokenized, comparable, and easy to diff. Comma-delimited (S-6).

## Why segmented

Michael's call (D-017): separate files over one fat page — cleaner tokenization and diffs, and every record schema carries its own concrete examples rather than being described abstractly.

---

## TODO (per-instance)

- [x] List the record formats this venue uses (lighting device, rigging point).
- [ ] Add further record types as the build surfaces them (scenic unit, audio device, video device).
- [ ] Note which records auto-attach to which symbol definitions.

*Companion: [`symbols.md`](./symbols.md) (records ride on symbols) · canonical [`../../VWX-BEST-PRACTICES.md`](../../VWX-BEST-PRACTICES.md) § F-012 + D-017.*
