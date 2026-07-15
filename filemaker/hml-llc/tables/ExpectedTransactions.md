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

## Calculations

Formulas in [`../meta/calculation-fields.md`](../meta/calculation-fields.md): `calc_amountPaid`, `calc_remaining`, `calc_islate`, `calc_lateAfterDate`.

## Relationships

- `ExpectedTransactions.fkLoan` → `Loans.PrimaryKey` (many-to-one, locked)
- `ExpectedTransactions.fkStandardTransaction` → `Standard_Transactions.PrimaryKey` (many-to-one, locked)
- Joined via `PaymentApplications.fkExpectedTransaction` (locked)

## Open Items

- Confirm `fkStatus` resolves to a real `statuses_*` record PK.
- One canonical amount family (`OriginalAmount` + `AmountAdjusted`); do not reintroduce `AmountExpected`/`OriginalAmount` duplicates.

## Changelog

- 2026-07-14: Per-table file; absorbed adjustment/sequence/grace fields + calc set from legacy docs.
