# Record Formats — Overview

> Record formats are the **data schema** attached to objects/symbols — the fields the worksheet manifests read (F-011/F-012). This file is the prose overview; **each record type gets its own example CSV** (`record-<NAME>.csv`) with explicit sample rows (D-017).

---

## What a record format is

A named set of fields (model, position, purpose, dimensions, etc.) attached to an object or symbol. Attach a record to a **symbol definition** and it auto-attaches to every instance (F-012) — this is the backbone that makes the symbol inventory machine-readable.

## Per-type CSVs (D-017)

Each record type is documented by example in its own file:

```
record-<NAME>.csv   — explicit example rows showing that record's fields
```

e.g. `record-lighting-device.csv`, `record-rigging-point.csv`. One CSV per record type keeps each schema tokenized, comparable, and easy to diff. Comma-delimited (S-6).

## Why segmented

Michael's call (D-017): separate files over one fat page — cleaner tokenization and diffs, and every record schema carries its own concrete examples rather than being described abstractly.

---

## TODO (per-instance)

- [ ] List the record formats this venue uses.
- [ ] For each, create `record-<NAME>.csv` with a header row + a few real example rows.
- [ ] Note which records auto-attach to which symbol definitions.

*Companion: [`symbols.md`](./symbols.md) (records ride on symbols) · canonical [`../../VWX-BEST-PRACTICES.md`](../../VWX-BEST-PRACTICES.md) § F-012 + D-017.*
