# AccountTransactions

**Role:** ledger · **Status:** locked · **App:** hml-llc

> Actual account transactions (the ledger). Parent is `Loans`.

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
| Date | date | plain | detail | |
| Amount | number | plain | detail | |
| Description | text | plain | detail | |
| Notes | text | plain | detail | |
| ExternalRef | text | plain | detail | proper text/reference field, not a container |

## Relationships

- `AccountTransactions.fkLoan` → `Loans.PrimaryKey` (many-to-one, locked)
- `AccountTransactions.fkStandardTransaction` → `Standard_Transactions.PrimaryKey` (many-to-one, locked)
- Joined via `PaymentApplications.fkAccountTransaction` (locked)

## Open Items

- Confirm `fkStatus` target.

## Changelog

- 2026-07-14: Migrated to per-table file (repo-native docs revamp).
