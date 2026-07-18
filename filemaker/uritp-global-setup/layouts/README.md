# Layouts

**Stubbed this pass (schema-first).** No per-layout files yet.

## Known layouts (as-built + target)

| Layout | Purpose | State |
|---|---|---|
| Config edit | edit org identity + fiscal-year pointers | built (as-built) |
| Production selector | pick a show — match-key TOs against the **builder-owned** PRODUCTIONS | built as-built in GS; re-targets to the builder's table under DG-001 |
| Fiscal / period / department / position editors | maintain reference tables | partial |

## Next

Enumerate as per-object layout files (+ `_index.json`) after live-file reconciliation and once the Productions builder defines PRODUCTIONS (the selector TOs point at it). No layout work until schema is confirmed.
