# Relationships

The HML_LLC relationship graph. Machine mirror: `../schema/relationships.json`. Manifest for the viewer: `_index.json`.

## The loan-first spine

The defining decision: **loans are the financial parent, not properties.** The user navigates by property (property-first UX), but transactions, payoffs, and servicing all hang off `Loans`.

- `Loans.fkProperty` → `PropertySUMMARIES` — a loan is secured by a property.
- `ExpectedTransactions.fkLoan` → `Loans` and `AccountTransactions.fkLoan` → `Loans` — both ledgers parent to the loan. `fkProperty` was removed from both once `fkLoan` was established.
- `PaymentApplications` joins `ExpectedTransactions` ↔ `AccountTransactions` (the two-sided application).
- `Payoffs.fkLoan` → `Loans` — payoffs belong to the loan and freeze their numbers.
- `ExpectedTransactions` / `AccountTransactions` `.fkStandardTransaction` → `Standard_Transactions` — type taxonomy.

## Edges

| From | To | Cardinality | Status | Notes |
|---|---|---|---|---|
| Loans.fkProperty | PropertySUMMARIES.PrimaryKey | many-to-one | locked | loan secured by property |
| Loans.fkBorrower | Organizations.PrimaryKey | many-to-one | pending | party table decision open |
| Loans.fkCurrentPayoff | Payoffs.PrimaryKey | many-to-one | pending | current-payoff pointer |
| ExpectedTransactions.fkLoan | Loans.PrimaryKey | many-to-one | locked | |
| AccountTransactions.fkLoan | Loans.PrimaryKey | many-to-one | locked | (fkProperty retained transitionally) |
| ExpectedTransactions.fkStandardTransaction | Standard_Transactions.PrimaryKey | many-to-one | locked | |
| AccountTransactions.fkStandardTransaction | Standard_Transactions.PrimaryKey | many-to-one | locked | |
| PaymentApplications.fkExpectedTransaction | ExpectedTransactions.PrimaryKey | many-to-one | locked | join side A |
| PaymentApplications.fkAccountTransaction | AccountTransactions.PrimaryKey | many-to-one | locked | join side B |
| Payoffs.fkLoan | Loans.PrimaryKey | many-to-one | locked | |
| PropertySUMMARIES.fkDocuments | Documents.PrimaryKey | many-to-one | under-review | |
| PropertySUMMARIES.fkBorrower | Organizations.PrimaryKey | many-to-one | under-review | |

## Under review

- Party links (`fkBorrower`) pending the Organizations vs Borrowers decision.
- `PropertySUMMARIES.fkDocuments` / `fkBalloonNote` / `fkPropertyStatus` FK ownership under re-eval.
