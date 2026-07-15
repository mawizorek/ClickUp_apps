# PaymentApplications

**Role:** join · **Status:** locked · **App:** hml-llc

> Join table: applies account transactions against expected transactions. Kept lean.

## Fields

| Field | Type | Key | Category | Notes |
|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | |
| CreationTimestamp | timestamp | audit | audit | |
| CreatedBy | text | audit | audit | |
| ModificationTimestamp | timestamp | audit | audit | |
| ModifiedBy | text | audit | audit | |
| fkExpectedTransaction | text-uuid | fk | key | |
| fkAccountTransaction | text-uuid | fk | key | |
| AmountApplied | number | plain | detail | |
| AppliedTimestamp | timestamp | plain | detail | |

## Relationships

- `PaymentApplications.fkExpectedTransaction` → `ExpectedTransactions.PrimaryKey` (many-to-one, locked) — join side A
- `PaymentApplications.fkAccountTransaction` → `AccountTransactions.PrimaryKey` (many-to-one, locked) — join side B

## Open Items

- Keep lean; add fields only if the real application workflow requires them.

## Changelog

- 2026-07-14: Migrated to per-table file (repo-native docs revamp).
