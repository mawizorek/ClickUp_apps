# Standard_Transactions

**Role:** taxonomy · **Status:** locked · **App:** hml-llc

> Metadata / taxonomy table for transaction types (not a glorified value list).

## Fields

| Field | Type | Key | Category | Notes |
|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | |
| CreationTimestamp | timestamp | audit | audit | |
| CreatedBy | text | audit | audit | |
| ModificationTimestamp | timestamp | audit | audit | |
| ModifiedBy | text | audit | audit | |
| Name | text | plain | detail | |
| DisplayName | text | plain | detail | |
| value_Category | text | plain | taxonomy | |
| value_CashDirection | text | plain | taxonomy | |
| value_AppliedToLayer | text | plain | taxonomy | |
| sort_order | number | plain | detail | |
| is_active | number | plain | detail | |

## Relationships

- Referenced by `ExpectedTransactions.fkStandardTransaction` and `AccountTransactions.fkStandardTransaction` (both locked)

## Open Items

- Seed the taxonomy rows (category / cash direction / applied layer) from the FileMaker file.

## Changelog

- 2026-07-14: Migrated to per-table file (repo-native docs revamp).
