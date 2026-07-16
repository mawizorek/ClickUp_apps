# Loans

**Role:** servicing-parent · **Status:** locked · **App:** hml-llc

> The real servicing parent. All loan terms + servicing status re-homed here off `PropertySUMMARIES`. The financial parent of the transaction ledgers and payoffs.

## Fields

| Field | Type | Key | Category | Status | Notes |
|---|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | | |
| CreationTimestamp | timestamp | audit | audit | | |
| CreatedBy | text | audit | audit | | |
| ModificationTimestamp | timestamp | audit | audit | | |
| ModifiedBy | text | audit | audit | | |
| fkProperty | text-uuid | fk | key | | secured-by property |
| fkBorrower | text-uuid | fk | key | pending | party-table decision |
| fkCurrentPayoff | text-uuid | fk | key | pending | points at current Payoffs row; used by payoff calcs. Must be empty during live payoff compute or calc_TotalOutstanding/calc_CurrentPayoffAmount short-circuit to the frozen prior payoff. |
| LoanNumber | text | plain | terms | | |
| OriginationDate | date | plain | terms | | |
| ClosingDate | date | plain | terms | pending | used by calc_NextMaturityDate; confirm presence in file |
| OriginalPrincipal | number | plain | terms | | canonical principal basis; schema JSON aligned 2026-07-15 (was `LoanAmount`). Confirm live-file name matches. |
| InterestRateAnnual | number | plain | terms | | canonical annual rate; schema JSON aligned 2026-07-15 (was `InterestRate`). Confirm live-file name matches. |
| OriginationPoints | number | plain | terms | | rate/fraction feeding calc_originationPoints |
| MaturationPoints | number | plain | terms | | |
| MaturationTerm_inDays | number | plain | terms | | |
| LoanTerm_inDays | number | plain | terms | | |
| GraceDays | number | plain | terms | pending | read by ExpectedTransactions.calc_lateAfterDate; confirm presence in file |
| ServicingStatus | text | plain | status | | should resolve to a real status PK, not free text |

> **Calculations:** this table has 11 calc fields. Their formula bodies are the single-source `.fmcalc` files in [`../calculations/`](../calculations/) (canonical) and are surfaced inline by the schema renderer. This markdown intentionally does not restate or index them; the JSON (`schema/tables.json` `calcRef`) + `calculations/_index.json` own that.

## Relationships

- `Loans.fkProperty` → `PropertySUMMARIES.PrimaryKey` (many-to-one, locked) — loan secured by property; property-first UX, loan-first schema
- `Loans.fkBorrower` → `Organizations.PrimaryKey` (many-to-one, pending)
- `Loans.fkCurrentPayoff` → `Payoffs.PrimaryKey` (many-to-one, pending)
- Parent of `ExpectedTransactions.fkLoan`, `AccountTransactions.fkLoan`, `Payoffs.fkLoan` (all locked)

## Open Items

- **Live-file name confirmation:** schema JSON + calc text are now aligned on `OriginalPrincipal` / `InterestRateAnnual` / `ClosingDate` / `GraceDays` / `fkCurrentPayoff` (reconciled 2026-07-15). Remaining task is confirming these exact names exist in the live FMP file; if the file differs, the file is the tiebreaker and both docs update to match.
- Finish calc-name cleanup to one consistent `calc_` family; confirm `ServicingStatus` is a real status reference.
- Later renames worth considering: `calc_originationPoints` → `calc_OriginationPointsAmount`; confirm `calc_FirstMaturation` is the forever name.

## Changelog

- 2026-07-16: Retired the inline `Calculations` section. Formula bodies now live solely in `../calculations/*.fmcalc` (referenced by `calcRef` in `schema/tables.json`) and are surfaced by the renderer. No pointer list retained per the v1.3 standard.
- 2026-07-15: Schema JSON reconciled to canonical names; cleared the blocking naming-drift flag (now a live-file confirmation item only).
- 2026-07-15: All 11 loan-math formulas embedded inline (were in meta/calculation-fields.md).
- 2026-07-14: Per-table file; absorbed full loan-terms field set + calc inventory from legacy docs; flagged principal/rate naming drift.
