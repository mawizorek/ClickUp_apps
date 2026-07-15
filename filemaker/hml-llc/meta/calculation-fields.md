# Calculation Fields — Index

> **Formula bodies live inline in each table file, next to the field they define** (per the calc-inline rule in [`../../DOCUMENTATION-STANDARD.md`](../../DOCUMENTATION-STANDARD.md)). This page is a **thin cross-table index only** — no formula text here, just where each calc lives so you can see the whole calc surface at a glance. If you're editing a formula, edit it in the table file; never copy a body here.

## Index

| Calc field | Owning table | Result | Storage | Purpose |
|---|---|---|---|---|
| `calc_filePath` | [GLOBAL_USE_VARIABLES](../tables/GLOBAL_USE_VARIABLES.md#calculations) | Text | Unstored | Current file path. |
| `calc_fileName` | [GLOBAL_USE_VARIABLES](../tables/GLOBAL_USE_VARIABLES.md#calculations) | Text | Unstored | Current file name. |
| `calc_hostedStatus` | [GLOBAL_USE_VARIABLES](../tables/GLOBAL_USE_VARIABLES.md#calculations) | Text | Unstored | Hosted vs local. |
| `calc_fileSizeMB` | [GLOBAL_USE_VARIABLES](../tables/GLOBAL_USE_VARIABLES.md#calculations) | Number | Unstored | File size (MB in display only). |
| `countNumDocuments` | [PropertySUMMARIES](../tables/PropertySUMMARIES.md#calculations) | Number | Unstored | Count of related documents. |
| `calc_CurrentPrincipalBalance` | [Loans](../tables/Loans.md#calculations) | Number | Stored | Current principal basis. |
| `calc_originationPoints` | [Loans](../tables/Loans.md#calculations) | Number | Stored | Origination-points amount. |
| `calc_MaturationPayment` | [Loans](../tables/Loans.md#calculations) | Number | Stored | Maturity-side payment. |
| `calc_MonthlyPayment` | [Loans](../tables/Loans.md#calculations) | Number | Stored | Recurring interest/payment. |
| `calc_perDiemInterest` | [Loans](../tables/Loans.md#calculations) | Number | Unstored | Per-diem interest. |
| `calc_FirstMaturation` | [Loans](../tables/Loans.md#calculations) | Number | Stored | First maturation milestone. |
| `calc_NextMaturityDate` | [Loans](../tables/Loans.md#calculations) | Date | Unstored | Next maturity milestone. |
| `calc_NextDueDate` | [Loans](../tables/Loans.md#calculations) | Date | Unstored | Next collectible due date. |
| `calc_TotalOutstanding` | [Loans](../tables/Loans.md#calculations) | Number | Unstored | Total outstanding balance. |
| `calc_CurrentPayoffAmount` | [Loans](../tables/Loans.md#calculations) | Number | Unstored | Current all-in payoff. |
| `calc_expROI` | [Loans](../tables/Loans.md#calculations) | Number | Stored | Analytical ROI. |
| `calc_amountPaid` | [ExpectedTransactions](../tables/ExpectedTransactions.md#calculations) | Number | Unstored | Total applied from PaymentApplications. |
| `calc_remaining` | [ExpectedTransactions](../tables/ExpectedTransactions.md#calculations) | Number | Unstored | Remaining unpaid balance. |
| `calc_lateAfterDate` | [ExpectedTransactions](../tables/ExpectedTransactions.md#calculations) | Date | Unstored | Late threshold date. |
| `calc_islate` | [ExpectedTransactions](../tables/ExpectedTransactions.md#calculations) | Number | Unstored | Late/not-late 1/0. |

## Scope note

`PaymentApplications`, `PaymentInstructions`, `Standard_Transactions`, and `Payoffs` need no dedicated calc fields in the active v1 core.

## Locked nuance (cross-cutting, kept here)

- `calc_NextDueDate` and `calc_NextMaturityDate` are **not** synonyms.
- `PayoffDisplayDate` is a payoff statement display date, not a creation/prepared timestamp.
- `CreationTimestamp` on `Payoffs` covers when the record was actually generated.
- `GoodThroughDate` is the separate payoff-validity endpoint.

## Changelog

- 2026-07-15: Demoted from formula home to thin index; all bodies moved inline into their table files per the calc-inline rule.
