# ExpectedTransactions

**Role:** ledger · **Status:** locked · **App:** hml-llc

> Scheduled/expected transactions (one record per expected due item). Parent is `Loans` (`fkProperty` removed once `fkLoan` established). Also referred to in early design as `LoanSchedule`.

## Fields

| Field | Type | Key | Category | Notes |
|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | UUID, auto |
| CreationTimestamp | timestamp | audit | audit | |
| CreatedBy | text | audit | audit | |
| ModificationTimestamp | timestamp | audit | audit | |
| ModifiedBy | text | audit | audit | |
| fkLoan | text-uuid | fk | key | authoritative parent |
| fkStandardTransaction | text-uuid | fk | key | type |
| fkStatus | text-uuid | fk | key | Outstanding / Paid / Partially Paid / Waived (status PK) |
| DueDate | date | plain | detail | anchored to origination day-of-month |
| OriginalAmount | number | plain | detail | canonical expected amount (for late fees: calculated 5% amount) |
| AmountAdjusted | number | plain | detail | actual amount to collect; supports waiver/discount |
| AdjustmentReason | text | plain | detail | optional |
| AdjustmentStatus | text | plain | detail | Normal / Discounted / Waived |
| SequenceNumber | number | plain | detail | 1..n per loan; enforces uniqueness |
| GraceDaysOverride | number | plain | detail | row-level override; else falls back to Loans.GraceDays |
| Notes | text | plain | detail | |

> **Calculations:** this table has 4 calc fields. Their formula bodies are the single-source `.fmcalc` files in [`../calculations/`](../calculations/) (canonical) and are surfaced inline by the schema renderer. This markdown intentionally does not restate or index them; the JSON (`schema/tables.json` `calcRef`) + `calculations/_index.json` own that.

## Relationships

- `ExpectedTransactions.fkLoan` → `Loans.PrimaryKey` (many-to-one, locked)
- `ExpectedTransactions.fkStandardTransaction` → `Standard_Transactions.PrimaryKey` (many-to-one, locked)
- Joined via `PaymentApplications.fkExpectedTransaction` (locked)

## Open Items

- Confirm `fkStatus` resolves to a real `statuses_*` record PK.
- One canonical amount family (`OriginalAmount` + `AmountAdjusted`); do not reintroduce `AmountExpected`/`OriginalAmount` duplicates.

## Changelog

- 2026-07-16: Retired the inline `Calculations` section. Formula bodies now live solely in `../calculations/*.fmcalc` (referenced by `calcRef` in `schema/tables.json`) and are surfaced by the renderer. No pointer list retained per the v1.3 standard.
- 2026-07-15: The 4 calc formulas embedded inline (were in meta/calculation-fields.md).
- 2026-07-14: Per-table file; absorbed adjustment/sequence/grace fields + calc set from legacy docs.
