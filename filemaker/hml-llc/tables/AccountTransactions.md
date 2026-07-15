# AccountTransactions

**Role:** ledger · **Status:** locked · **App:** hml-llc

> Actual ledger transactions. **Lean borrower-facing payoff/export row set** — not a catch-all internal ledger. Seeds from `ExpectedTransactions` + received-payment activity, then stays editable for clean payoff output. Parent is `Loans`.

## Fields (current live, 14)

| Field | Type | Key | Category | Notes |
|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | |
| fkProperty | text-uuid | fk | key | transition-state — target contract is `fkLoan` |
| fkStatus | text-uuid | fk | key | auto-enter calc; resolve to status PK |
| Date | date | plain | detail | indexed |
| Amount | number | plain | detail | |
| Description | text | plain | detail | indexed |
| Notes | text | plain | detail | |
| is_active | number | plain | detail | |
| CreatedBy | text | audit | audit | |
| CreationTimestamp | timestamp | audit | audit | |
| ModifiedBy | text | audit | audit | |
| ModificationTimestamp | timestamp | audit | audit | |
| RunningTotal | summary | plain | summary | |
| Summary_TotalAmount | summary | plain | summary | |

## Fields to add (confirmed design)

| Field | Type | Notes |
|---|---|---|
| fkLoan | text-uuid | authoritative parent (replaces fkProperty role) |
| fkStandardTransaction | text-uuid | type |
| TransactionKind | text | Expected / Actual / Adjustment — watch overlap with Standard_Transactions |
| ReceivedMethod | text | ACH / check / wire / cash |
| ExternalRef | text | bank reference, check number (keep separate from any document link) |
| ClearedDate | date | optional, for reconciliation |

## Relationships

- Target: `AccountTransactions.fkLoan` → `Loans.PrimaryKey` (many-to-one; `fkProperty` retained only transitionally)
- `AccountTransactions.fkStandardTransaction` → `Standard_Transactions.PrimaryKey` (locked)
- Joined via `PaymentApplications.fkAccountTransaction` (locked)

## Open Items

- Re-parent from `fkProperty` to `fkLoan`.
- Keep document linkage (`fkSourceDocument`) separate from `ExternalRef` text.
- Resolve `TransactionKind` vs `Standard_Transactions` meaning overlap.

## Changelog

- 2026-07-14: Per-table file; absorbed current-14 + fields-to-add + lean-purpose contract from legacy docs.
