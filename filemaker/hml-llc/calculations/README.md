# calculations/

**Canonical home for every calculation-field formula body in HML_LLC.** One file per calc, verbatim FileMaker calc text, round-trippable (copy file -> paste into the FileMaker calc dialog -> paste back out unchanged).

## Convention

- **Filename:** `<Table>__<FieldName>.fmcalc` (double-underscore namespace separator; kills cross-table collisions since calc field names are not globally unique).
- **Body:** two `//` header comment lines (owner + return/stored/purpose) then a blank line then the raw formula. FileMaker ignores the comment lines, so the whole file pastes in clean.
- **One definition, one home.** The formula lives ONLY here. `schema/tables.json` points at it via each calc field's `calcRef`; the per-table markdown links here rather than restating the body.

## Manifest

`_index.json` lists every calc with owning table, return type, stored/unstored, purpose, and a `reads` dependency hint (fields + tables the formula touches). The Phase 2 viewer reads the manifest to render the computation layer and draw the dependency graph.

## History

Supersedes the 2026-07-15 "calcs live inline in the owning table's markdown" lock. That rule was written when markdown was the only place a human saw a formula. With the JSON-driven renderer, storage and presentation decouple: files live centralized here, the renderer pulls each one and shows it inline in the rendered view. Same legibility goal, single source of truth.
