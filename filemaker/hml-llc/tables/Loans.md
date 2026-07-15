# Loans

**Role:** servicing-parent · **Status:** locked · **App:** hml-llc

> The real servicing parent. Loan terms + servicing status re-homed here off `PropertySUMMARIES`.

## Fields

| Field | Type | Key | Category | Status | Notes |
|---|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | | |
| CreationTimestamp | timestamp | audit | audit | | |
| CreatedBy | text | audit | audit | | |
| ModificationTimestamp | timestamp | audit | audit | | |
| ModifiedBy | text | audit | audit | | |
| fkProperty | text-uuid | fk | key | | |
| fkBorrower | text-uuid | fk | key | | |
| LoanNumber | text | plain | terms | | |
| OriginationDate | date | plain | terms | | |
| LoanAmount | number | plain | terms | | principal |
| InterestRate | number | plain | terms | | |
| OriginationPoints | number | plain | terms | | |
| MaturationPoints | number | plain | terms | | |
| MaturationTerm_inDays | number | plain | terms | | |
| LoanTerm_inDays | number | plain | terms | | |
| ServicingStatus | text | plain | status | | |
| calc_&lt;loan math&gt; | calc | calc | calc | pending | surviving loan math re-homed from PropertySUMMARIES / Account Calculations |

## Relationships

- `Loans.fkProperty` → `PropertySUMMARIES.PrimaryKey` (many-to-one, locked) — a loan is secured by a property; property-first UX, loan-first schema
- `Loans.fkBorrower` → `Organizations.PrimaryKey` (many-to-one, pending) — party table decision open
- Parent of `ExpectedTransactions.fkLoan`, `AccountTransactions.fkLoan`, `Payoffs.fkLoan` (all locked)

## Open Items

- Enumerate and define the `calc_` loan-math fields re-homed from `PropertySUMMARIES` / `Account Calculations`.

## Changelog

- 2026-07-14: Migrated to per-table file (repo-native docs revamp).
