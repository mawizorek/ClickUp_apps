# Calculation Fields — (retired index)

> **This page is retired as of 2026-07-16.** It used to be a thin cross-table index back when formula bodies lived inline in each table's markdown (the calc-inline rule). That rule was reversed: formula bodies now live in standalone files under [`../calculations/`](../calculations/), one `.fmcalc` per calc field, referenced by `calcRef` in [`../schema/tables.json`](../schema/tables.json). See decision **D-003 / D-004** in [`../../DECISIONS.md`](../../DECISIONS.md) and the LOCKED section in [`../../DOCUMENTATION-STANDARD.md`](../../DOCUMENTATION-STANDARD.md).

## Where the calc surface lives now

- **Formula bodies (canonical):** `../calculations/<Table>__<field>.fmcalc` — verbatim FileMaker text, round-trippable.
- **Structural metadata + pointer:** each calc field in `../schema/tables.json` carries `calcRef` + `returns` + `stored`.
- **Cross-table index + dependency hints:** `../calculations/_index.json` (owning table, return, stored, purpose, `reads`).
- **Rendered view:** the shared viewer at `../../_viewer/` (`schema.html?app=hml-llc`) shows every calc inline with syntax highlighting, copy-to-clipboard, and a dependency graph. Validate with `linter.html?app=hml-llc`.

Do not add formula text or a per-calc index here. This file is kept only as a breadcrumb from the old path; the manifest replaces it.

## Locked nuance (moved, do not lose)

These cross-cutting semantics are recorded in the relevant field `notes` in `schema/tables.json` and remain true:

- `calc_NextDueDate` and `calc_NextMaturityDate` are **not** synonyms.
- `Payoffs.PayoffDisplayDate` is a statement display date, not a creation/prepared timestamp.
- `Payoffs.CreationTimestamp` covers when the record was actually generated.
- `Payoffs.GoodThroughDate` is the separate payoff-validity endpoint.

## Note on `countNumDocuments`

The old index listed a `countNumDocuments` calc on `PropertySUMMARIES`. It is NOT in the current locked schema or the manifest. If it exists in the live FMP file, add it as a real calc field (row in `tables.json` + a `.fmcalc` file + a manifest entry) so the linter covers it; otherwise it stays dropped. Flagged 2026-07-16.

## Changelog

- 2026-07-16: Retired. Calc surface moved to `../calculations/` + `../schema/tables.json` `calcRef` + `../calculations/_index.json`; rendered by `../../_viewer/`. Flagged the phantom `countNumDocuments`.
- 2026-07-15: Demoted from formula home to thin index (the now-reversed inline rule).
