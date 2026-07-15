# Payoffs

**Role:** snapshot · **Status:** locked · **App:** hml-llc

> Frozen payoff snapshots. Numbers + payment-instruction snapshot are frozen so history can't be overwritten by later source edits.

## Fields

| Field | Type | Key | Category | Notes |
|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | |
| CreationTimestamp | timestamp | audit | audit | |
| CreatedBy | text | audit | audit | |
| ModificationTimestamp | timestamp | audit | audit | |
| ModifiedBy | text | audit | audit | |
| fkLoan | text-uuid | fk | key | |
| IsCurrent | number | plain | version | current/version marker |
| IssueDate | date | plain | detail | |
| AsOfDate | date | plain | detail | |
| FrozenPayoffAmount | number | plain | frozen | frozen — never recomputed |
| FrozenPaymentInstructions | text | plain | frozen | snapshot of PaymentInstructions at issue |

## Relationships

- `Payoffs.fkLoan` → `Loans.PrimaryKey` (many-to-one, locked)
- Consumes a frozen snapshot of `PaymentInstructions` (copied at issue, not an FK)

## Open Items

- Confirm freeze semantics on `FrozenPaymentInstructions` (full text snapshot vs structured JSON).

## Changelog

- 2026-07-14: Migrated to per-table file (repo-native docs revamp).
