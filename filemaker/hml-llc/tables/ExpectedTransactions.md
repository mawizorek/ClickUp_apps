# ExpectedTransactions

**Role:** ledger · **Status:** locked · **App:** hml-llc

> Expected/scheduled transactions. Parent is `Loans` (`fkProperty` removed once `fkLoan` established).

## Fields

| Field | Type | Key | Category | Notes |
|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | |
| CreationTimestamp | timestamp | audit | audit | |
| CreatedBy | text | audit | audit | |
| ModificationTimestamp | timestamp | audit | audit | |
| ModifiedBy | text | audit | audit | |
| fkLoan | text-uuid | fk | key | |
| fkStandardTransaction | text-uuid | fk | key | |
| fkStatus | text-uuid | fk | key | |
| DueDate | date | plain | detail | |
| Amount | number | plain | detail | normalized amount pattern (no dup AmountOriginal/OriginalAmount) |
| Notes | text | plain | detail | |
| SortOrder | number | plain | detail | |
| calc_is_Late | calc | calc | calc | |
| calc_AmountPaid | calc | calc | calc | |
| calc_Remaining | calc | calc | calc | |

## Relationships

- `ExpectedTransactions.fkLoan` → `Loans.PrimaryKey` (many-to-one, locked)
- `ExpectedTransactions.fkStandardTransaction` → `Standard_Transactions.PrimaryKey` (many-to-one, locked)
- Joined via `PaymentApplications.fkExpectedTransaction` (locked)

## Open Items

- Confirm `fkStatus` target (value-list-backed vs status table).

## Changelog

- 2026-07-14: Migrated to per-table file (repo-native docs revamp).
