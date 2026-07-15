# Payoffs

**Role:** snapshot · **Status:** locked · **App:** hml-llc

> Frozen payoff statements. Numbers + payment-instruction snapshot are frozen so history can't be overwritten by later source edits. Allowed denormalized snapshot table.

## Fields

| Field | Type | Key | Category | Notes |
|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | |
| CreationTimestamp | timestamp | audit | audit | when the record was actually generated |
| CreatedBy | text | audit | audit | |
| ModificationTimestamp | timestamp | audit | audit | |
| ModifiedBy | text | audit | audit | |
| fkLoan | text-uuid | fk | key | |
| IsCurrent | number | plain | version | current/version marker |
| IssueDate | date | plain | detail | |
| AsOfDate | date | plain | detail | |
| PayoffDisplayDate | date | plain | detail | statement display date (NOT a creation/prepared timestamp) |
| GoodThroughDate | date | plain | detail | payoff-validity endpoint (distinct from display date) |
| TotalPayoffAmount | number | plain | frozen | frozen — read by Loans.calc_CurrentPayoffAmount / calc_TotalOutstanding |
| FrozenPaymentInstructions | text | plain | frozen | snapshot of PaymentInstructions at issue |

## Relationships

- `Payoffs.fkLoan` → `Loans.PrimaryKey` (many-to-one, locked)
- Referenced back by `Loans.fkCurrentPayoff` (pending)
- Consumes a frozen snapshot of `PaymentInstructions` (copied at issue, not an FK)

## Open Items

- Confirm explicit source-template reference; keep frozen values in, live recompute out.
- `FrozenPaymentInstructions` freeze format: full text snapshot vs structured JSON.

## Changelog

- 2026-07-14: Per-table file; absorbed TotalPayoffAmount + display/good-through/creation date nuance from legacy docs.
