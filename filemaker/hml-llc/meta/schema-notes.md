# Schema Notes — Normalization Audit + Live Inventory

> The narrative half of the legacy `tables-and-fields.md`: the normalization rulebook, the live-file transition inventory, and the locked implementation contract. Per-table canonical field sets live in [`../tables/`](../tables/); this page is the cross-cutting schema reasoning.

## Locked implementation updates — 2026-06-14

These supersede older placeholder language where they conflict. They capture the current intended rebuild contract, even where the live file or older screenshots still reflect pre-rebuild structure.

- **Binder key typing:** `Documents::fkLoan` and `Documents::fkProperty` should be **Text** (UUID strategy), not numeric. Older numeric-FK language is legacy pending file updates.
- **AccountTransactions parent:** target contract is **`fkLoan`**, not `fkProperty`. If the live file still shows `fkProperty`, treat as transition-state.
- **AccountTransactions purpose:** the **lean borrower-facing payoff/export row set**, not a catch-all internal ledger. Seeds from `ExpectedTransactions` + received-payment activity, then stays editable for clean payoff output.
- **Status architecture:** `fkStatus` fields resolve to **real status record PKs**, not free text pretending to be an FK.
- **Helper utilities:** status-resolution / resolved-status testing helpers are part of the planned build now, not deferred.
- **Locked `Standard_Transactions::Name` values:** `Payment Received`, `Interest Payment`, `Principal`, `Origination Points`, `Maturation Fee`, `Late Fee`.
- **Meaning rule:** `Payment Received` is the actual cash-in ledger bucket. The others are expected-item / application / payoff categories that received cash can satisfy.

## Normalization audit — 2026-06-15

**1NF and 2NF are prerequisites; core servicing tables should reach practical 3NF before more layout/script surface is added.**

### 1NF cleanup rules

- One field = one fact = one data type.
- No duplicate-name variants (`AmountOriginal` vs `OriginalAmount`) — choose one canonical field.
- No scalar FK where the real structure is one-to-many (a property shouldn't carry one fake `fkDocuments` if documents are truly related rows).
- No reusable long-form operational content in globals when it belongs as records (`PaymentInstructions`).

### 2NF / ownership corrections

- Loan-owned fields belong on `Loans`: origination date, closing date, rate, term, loan number, borrower link, principal, maturity helpers, payoff-driving terms.
- `PropertySUMMARIES` keeps property identity / collateral facts only.
- `ExpectedTransactions` / `AccountTransactions` treat `fkLoan` as the authoritative parent.
- `PaymentApplications` contains only join-level facts, not copied parent metadata.

### 3NF / dependency corrections

- Status metadata belongs in status tables, referenced by PK, not repeated as ad-hoc text.
- Transaction-type behavior belongs in `Standard_Transactions`, not duplicated on expected/actual rows.
- File/version history belongs in `DocumentVersions`; the logical document record stays in `Documents`.
- Frozen payoff values are an allowed exception — an issued payoff is a snapshot artifact, not live recomputed truth.

### Likely remaining stragglers — 2026-06-15

- **`GLOBAL_USE_VARIABLES`** — resolve overlap with `SETUP_LLC`; app-state/context only.
- **`PropertySUMMARIES`** — verify no loan-owned terms drifted back; re-check surviving FKs (borrower/document/status).
- **`Loans`** — finish calc-name cleanup to one consistent `calc_` family; confirm status + payoff-pointer are real FK/reference fields.
- **`ExpectedTransactions`** — confirm `fkLoan` authoritative, no lingering `fkProperty` anchor; one canonical amount family; grace/adjustment fields only as row-level overrides.
- **`AccountTransactions`** — confirm `fkLoan` authoritative; keep document linkage separate from external reference text (`fkSourceDocument` vs `ExternalRef`); watch `TransactionKind` vs `Standard_Transactions` overlap.
- **`PaymentApplications`** — keep skinny: join facts, timestamps, amount applied only.
- **`Payoffs`** — allowed denormalized snapshot; confirm `fkLoan` + explicit source-template reference; frozen values in, live recompute out.
- **`PaymentInstructions`** — confirm fully row-based, no global remnants; signature record-based.
- **`Standard_Transactions`** — finish naming decision (`Standard_Transactions` vs `StandardTransactions`); keep category/layer/cash-direction/waterfall behavior here.

## Live file inventory — 17 tables (2026-05-30 snapshot)

> Transition snapshot of what physically exists in the file. The locked core stack in `../tables/` is the target contract; reconcile against this during migration.

| Table | Purpose | PK |
|---|---|---|
| `Property SUMMARIES` | Core deal/loan/property record. The hub. | Text |
| `PropertyExpectations` | Calc layer: next maturity, per diem, mortgage balance, ROI, # interest payments due | Text |
| `AccountTransactions` | Lean borrower-facing rows for payoff docs + exports | Text |
| `Standard_Transactions` | Template transaction types | Text |
| `statuses_PropertySummaries` | Status records for Property Summaries | — |
| `statuses_AccountTransactions` | Status records for Account Transactions | — |
| `DOCUMENTS` | Document records (file path, local/remote, container) | Serial |
| `FileFOLDERS` | Folder records for document storage | — |
| `CRM` | Borrower or company records | — |
| `CONTACTS` | Person/contact records | — |
| `PaymentInstructions` | Payment instruction content for print/display | — |
| `GLOBAL_USE_Variables` | Global variables, preferences | — |
| `SETUP_LLC` | LLC setup/config | — |
| `SETUP_MOBILE` | Mobile setup/config | — |
| `Values` | Generic values table (value lists) | — |
| `Value_Lists` | Value list definitions | — |
| `work_Notes` | Notes table | — |

**Transition note:** `PropertyExpectations` calc layer is being folded into `Loans` calc fields; `statuses_*` tables back the `fkStatus` references; `Values`/`Value_Lists`/`work_Notes`/`SETUP_MOBILE` are candidates to retire or park. The target core stack is 9 servicing tables + parked party/document tables (see `../tables/`).
