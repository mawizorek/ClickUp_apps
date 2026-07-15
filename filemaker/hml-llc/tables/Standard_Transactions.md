# Standard_Transactions

**Role:** taxonomy · **Status:** locked · **App:** hml-llc

> Metadata / taxonomy table for transaction types (not a glorified value list). Carries category / cash-direction / applied-layer behavior.

## Fields

| Field | Type | Key | Category | Notes |
|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | |
| CreationTimestamp | timestamp | audit | audit | |
| CreatedBy | text | audit | audit | |
| ModificationTimestamp | timestamp | audit | audit | |
| ModifiedBy | text | audit | audit | |
| Name | text | plain | detail | indexed |
| DisplayName | text | plain | detail | auto-enter calc |
| value_Category | text | plain | taxonomy | |
| value_CashDirection | text | plain | taxonomy | |
| value_AppliedToLayer | text | plain | taxonomy | |
| sort_order | number | plain | detail | |
| is_active | number | plain | detail | |

## Locked `Name` values (current use)

`Payment Received`, `Interest Payment`, `Principal`, `Origination Points`, `Maturation Fee`, `Late Fee`.

- `Payment Received` = the actual cash-in ledger bucket.
- The others = expected-item / application / payoff categories that received cash can satisfy.
- Full taxonomy may later expand (Wire Fee, Extension Fee, Principal Paydown, etc.).

## Relationships

- Referenced by `ExpectedTransactions.fkStandardTransaction` and `AccountTransactions.fkStandardTransaction` (both locked)

## Open Items

- Finish naming decision (`Standard_Transactions` vs `StandardTransactions`); stop drift.
- Seed remaining taxonomy rows from the file.

## Changelog

- 2026-07-14: Per-table file; absorbed locked Name values + taxonomy meaning from legacy docs.
