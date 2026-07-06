# Relationships

> Structured source: [`../schema/relationships.json`](../schema/relationships.json).

## The loan-first spine

The defining decision: **loans are the financial parent, not properties.** The user navigates by property (property-first UX), but transactions, payoffs, and servicing all hang off `Loans`.

- `Loans.fkProperty` → `PropertySUMMARIES` — a loan is secured by a property.
- `ExpectedTransactions.fkLoan` → `Loans` and `AccountTransactions.fkLoan` → `Loans` — both ledgers parent to the loan. `fkProperty` was removed from both once `fkLoan` was established.
- `PaymentApplications` joins `ExpectedTransactions` ↔ `AccountTransactions` (the two-sided application).
- `Payoffs.fkLoan` → `Loans` — payoffs belong to the loan and freeze their numbers.
- `ExpectedTransactions` / `AccountTransactions` `.fkStandardTransaction` → `Standard_Transactions` — type taxonomy.

## Under review

- Party links (`fkBorrower`) pending the Organizations vs Borrowers decision.
- `PropertySUMMARIES.fkDocuments` / `fkBalloonNote` / `fkPropertyStatus` FK ownership under re-eval.
