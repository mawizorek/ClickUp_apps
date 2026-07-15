# Relationships

The HML_LLC relationship graph. **Loan-first:** loans are the financial parent; transactions hang off `Loans`, not `Property`. Machine mirror: `../schema/relationships.json`. Manifest for the viewer: `_index.json`.

## Edges

| From | To | Cardinality | Status | Notes |
|---|---|---|---|---|
| Loans.fkProperty | PropertySUMMARIES.PrimaryKey | many-to-one | locked | loan secured by property |
| Loans.fkBorrower | Organizations.PrimaryKey | many-to-one | pending | party table decision open |
| ExpectedTransactions.fkLoan | Loans.PrimaryKey | many-to-one | locked | |
| AccountTransactions.fkLoan | Loans.PrimaryKey | many-to-one | locked | |
| ExpectedTransactions.fkStandardTransaction | Standard_Transactions.PrimaryKey | many-to-one | locked | |
| AccountTransactions.fkStandardTransaction | Standard_Transactions.PrimaryKey | many-to-one | locked | |
| PaymentApplications.fkExpectedTransaction | ExpectedTransactions.PrimaryKey | many-to-one | locked | join side A |
| PaymentApplications.fkAccountTransaction | AccountTransactions.PrimaryKey | many-to-one | locked | join side B |
| Payoffs.fkLoan | Loans.PrimaryKey | many-to-one | locked | |
| PropertySUMMARIES.fkDocuments | Documents.PrimaryKey | many-to-one | under-review | |
| PropertySUMMARIES.fkBorrower | Organizations.PrimaryKey | many-to-one | under-review | |
