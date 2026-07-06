# Architecture Notes

Permanent record of non-obvious technical decisions.

- **Loan-first data model.** Despite property-first navigation, `Loans` is the financial parent. Transactions parent to loans; `fkProperty` was deliberately removed from the transaction tables once `fkLoan` was in place. Re-parenting to Property is a regression.
- **Frozen payoffs.** `Payoffs` stores frozen amounts + a snapshot of payment instructions at issue time. Later edits to `PaymentInstructions` must never mutate an issued payoff. This is why `PaymentInstructions` is a real record table (not globals): payoffs snapshot from it.
- **Singleton control table.** `GLOBAL_USE_VARIABLES` is the single one-record app-state table. Session context (`g_fkCurrentProperty`, `g_fkCurrentLoan`, hub mode) lives here as `g_` globals.
- **Publish boundary.** FileMaker is the system of record for property + payment truth. Publish to ClickUp is one-way and manual in v1.
- **Single-file, single-user, local-first** until a concrete constraint forces otherwise.
