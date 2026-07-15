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
| fkCurrentPayoff | text-uuid | fk | key | pending | points at current Payoffs row; used by payoff calcs |
| LoanNumber | text | plain | terms | | |
| OriginationDate | date | plain | terms | | |
| ClosingDate | date | plain | terms | pending | used by calc_NextMaturityDate; confirm presence in file |
| OriginalPrincipal | number | plain | terms | naming | principal basis (schema JSON currently calls this `LoanAmount` — reconcile) |
| InterestRateAnnual | number | plain | terms | naming | annual rate (schema JSON currently `InterestRate` — reconcile) |
| OriginationPoints | number | plain | terms | | rate/fraction feeding calc_originationPoints |
| MaturationPoints | number | plain | terms | | |
| MaturationTerm_inDays | number | plain | terms | | |
| LoanTerm_inDays | number | plain | terms | | |
| GraceDays | number | plain | terms | pending | read by ExpectedTransactions.calc_lateAfterDate; confirm presence |
| ServicingStatus | text | plain | status | | should resolve to a real status PK, not free text |

## Calculations

Loan math (formulas in [`../meta/calculation-fields.md`](../meta/calculation-fields.md)): `calc_CurrentPrincipalBalance`, `calc_CurrentPayoffAmount`, `calc_TotalOutstanding`, `calc_NextDueDate`, `calc_NextMaturityDate`, `calc_FirstMaturation`, `calc_MaturationPayment`, `calc_MonthlyPayment`, `calc_perDiemInterest`, `calc_originationPoints`, `calc_expROI`.

## Relationships

- `Loans.fkProperty` → `PropertySUMMARIES.PrimaryKey` (many-to-one, locked) — loan secured by property; property-first UX, loan-first schema
- `Loans.fkBorrower` → `Organizations.PrimaryKey` (many-to-one, pending)
- `Loans.fkCurrentPayoff` → `Payoffs.PrimaryKey` (many-to-one, pending)
- Parent of `ExpectedTransactions.fkLoan`, `AccountTransactions.fkLoan`, `Payoffs.fkLoan` (all locked)

## Open Items

- **Field-naming reconciliation (blocking calc wiring):** calc text uses `OriginalPrincipal` / `InterestRateAnnual` / `ClosingDate` / `GraceDays` / `fkCurrentPayoff`; `schema/tables.json` uses `LoanAmount` / `InterestRate` and omits the latter three. Confirm the live-file names and align schema JSON + calc text.
- Finish calc-name cleanup to one consistent `calc_` family; confirm `ServicingStatus` is a real status reference.

## Changelog

- 2026-07-14: Per-table file; absorbed full loan-terms field set + calc inventory from legacy docs; flagged principal/rate naming drift.
