# Tables and Fields

> Structured source of truth: [`../schema/tables.json`](../schema/tables.json). This markdown is the human companion. Calc-field definitions + FileMaker calc-option text live in [`calculation-fields.md`](./calculation-fields.md).
>
> **Migrated from ClickUp (2026-07-06).** This git file is now canonical. Captured originally from Manage Database screenshots (2026-05-30) and subsequent design sessions.

---

## Locked implementation updates — 2026-06-14

These notes supersede older placeholder language below where they conflict. They capture the current intended rebuild contract, even where the live file or older screenshots still reflect pre-rebuild structure.

- **Binder key typing:** `DOCUMENTS::LoanID_fk` and `DOCUMENTS::PropertyID_fk` should be **Text**, aligned to the UUID/text key strategy used by the servicing-side tables. Older numeric-FK language below is legacy documentation pending file updates.
- **AccountTransactions parent:** the target contract is **`fkLoan`**, not `fkProperty`. If the live file still shows `fkProperty`, treat that as transition-state documentation rather than the intended final structure.
- **AccountTransactions purpose:** treat this table as the **lean borrower-facing payoff/export row set**, not a catch-all internal finance ledger. It generally seeds from `ExpectedTransactions` and from received-payment activity, then remains editable for clean payoff-document output.
- **Status architecture:** fields named `fkStatus` should resolve to **real status record PKs**, not free text pretending to be a foreign key.
- **Helper utilities:** helper support for status resolution / resolved-status testing is part of the planned build now, not a deferred abstraction.
- **Locked `Standard_Transactions::Name` values for current use:** `Payment Received`, `Interest Payment`, `Principal`, `Origination Points`, `Maturation Fee`, `Late Fee`.
- **Meaning rule:** `Payment Received` is the actual cash-in ledger bucket. The other names are expected-item / application / payoff categories that received cash can satisfy.

---

## Core servicing stack (locked)

| Table | Role | Purpose |
|---|---|---|
| `GLOBAL_USE_VARIABLES` | singleton | Only one-record app-state / control table. |
| `PropertySUMMARIES` | collateral | Property / collateral identity + operating fields. Not the financial parent. |
| `Loans` | servicing-parent | The real financial parent. All loan terms + servicing status. |
| `ExpectedTransactions` | ledger | Scheduled/expected transactions, parented to Loans. |
| `AccountTransactions` | ledger | Actual ledger transactions, parented to Loans. |
| `PaymentApplications` | join | Applies account transactions against expected ones. |
| `Payoffs` | snapshot | Frozen payoff statements. |
| `PaymentInstructions` | source | Record-based payee/delivery instructions feeding payoffs. |
| `Standard_Transactions` | taxonomy | Transaction-type metadata (category, cash direction, layer). |

**Parked (party + documents):** `Documents` (+ optional `DocumentVersions`, `DocumentFolders`), `Organizations`, `Contacts` (+ optional `OrganizationContacts`). Rename out of legacy all-caps before any ExecuteSQL references.

---

## Normalization audit notes — 2026-06-15

Normalization is treated as an explicit build rule: **1NF and 2NF are prerequisites, and the core servicing tables should be brought to practical 3NF before more layout/script surface area is added.**

### 1NF cleanup rules

- One field = one fact = one data type
- Do not keep duplicate-name variants like `AmountOriginal` vs `OriginalAmount`; choose one canonical field
- Do not keep a single scalar FK where the real structure is one-to-many (e.g. a property should not carry one fake `fkDocuments` field if documents are truly related rows)
- Do not store reusable long-form operational content in globals when it should live as row-based records (`PaymentInstructions`)

### 2NF / ownership corrections

- Loan-owned fields belong on `Loans`: origination date, closing date, rate, term, loan number, borrower link, principal, maturity helpers, and payoff-driving terms
- `PropertySUMMARIES` should keep property identity / collateral facts only
- `ExpectedTransactions` and `AccountTransactions` should treat `fkLoan` as the authoritative parent
- `PaymentApplications` should contain only join-level facts about the application itself, not copied parent metadata

### 3NF / dependency corrections

- Status metadata belongs in status tables and should be referenced by PK, not repeated as ad-hoc text
- Transaction-type behavior belongs in `StandardTransactions`, not duplicated independently on expected/actual rows
- File/version history belongs in `DocumentVersions`, while the logical document record stays in `Documents`
- Frozen payoff values are an allowed exception because an issued payoff is a snapshot artifact, not live recomputed truth

### Final-pass likely remaining stragglers — 2026-06-15

Narrow re-check list before graph rebuild. Core tables are mostly aligned; these are the places most likely to still carry normalization drift or naming leftovers.

- **`GLOBAL_USE_VARIABLES`** — resolve any remaining overlap with `SETUP_LLC`; keep as app-state/context only, not a home for real business records.
- **`PropertySUMMARIES`** — verify no loan-owned terms drifted back here; re-check surviving FKs (borrower/document/status) so each clearly belongs to the property lens, not loan-servicing.
- **`Loans`** — finish calc-name cleanup so the loan math family uses one consistent `calc_...` system; confirm status and payoff-pointer fields are real FK/reference fields, not loose text.
- **`ExpectedTransactions`** — confirm `fkLoan` is authoritative and no lingering `fkProperty` logic acts as the real join anchor; one canonical amount family; keep grace/adjustment fields only where they represent row-level overrides.
- **`AccountTransactions`** — confirm `fkLoan` authoritative and `fkProperty` not still functioning as true parent; keep document linkage separate from external reference text (`fkSourceDocument` vs `ExternalRef`); watch for duplicated type/status meaning if `TransactionKind` and `StandardTransactions` overlap.
- **`PaymentApplications`** — keep it skinny: only join facts, timestamps, amount applied, application-specific controls. Do not copy in property/loan/borrower/type metadata.
- **`Payoffs`** — allowed denormalized snapshot table, but confirm `fkLoan` exists and the source-template reference is explicit; keep frozen issued values here, live recomputed logic out.
- **`PaymentInstructions`** — confirm fully row-based, no global/singleton remnants; signature storage record-based (directly or via document reference).
- **`StandardTransactions`** — finish the naming decision (`StandardTransactions` vs `Standard_Transactions`) and stop drift; keep category/layer/cash-direction/waterfall behavior here.

---

## Field conventions

See [`data-standards.md`](./data-standards.md). PK = `PrimaryKey` (UUID) on every table; FK = `fk`; calcs = `calc_`; globals = `g_`.

---

## Table inventory (live file, 17 tables — 2026-05-30)

> Legacy/transition snapshot of what physically exists in the file. The locked core stack above is the target contract; reconcile against this inventory during migration.

| Table | Purpose | Primary Key |
|---|---|---|
| `Property SUMMARIES` | Core deal/loan/property record. The hub. | Text (unique) |
| `PropertyExpectations` | Calc layer: next maturity, per diem, mortgage balance, ROI, # interest payments due | Text (unique) |
| `AccountTransactions` | Lean borrower-facing transaction/output rows for payoff docs + global exports. Seeded from expected transactions + received-payment activity. | Text (unique) |
| `Standard_Transactions` | Template transaction types (Origination, Interest Payment, etc.) | Text (unique) |
| `statuses_PropertySummaries` | Status value records for Property Summaries | — |
| `statuses_AccountTransactions` | Status value records for Account Transactions | — |
| `DOCUMENTS` | Document records (file path, local/remote, container) | Serial (auto) |
| `FileFOLDERS` | Folder records for document storage organization | — |
| `CRM` | Borrower or company records | — |
| `CONTACTS` | Person/contact records (borrower, title, vendors) | — |
| `PaymentInstructions` | Payment instruction content for print/display | — |
| `GLOBAL_USE_Variables` | Global variables, preferences | — |
| `SETUP_LLC` | LLC setup/config | — |
| `SETUP_MOBILE` | Mobile setup/config | — |
| `Values` | Generic values table (used with value lists) | — |
| `Value_Lists` | Value list definitions | — |
| `work_Notes` | Notes table | — |

---

## Tables to add (confirmed design, not yet built)

### ExpectedTransactions (or LoanSchedule)

One record per expected due item.

| Field | Type | Notes |
|---|---|---|
| PrimaryKey | Text | UUID, auto |
| fkProperty | Text | FK to Property SUMMARIES (target contract: `fkLoan`) |
| DueDate | Date | Anchored to origination day-of-month |
| AmountExpected | Number | Dollar amount due |
| fkStandardTransaction | Text | FK to Standard_Transactions (type) |
| fkStatus | Text | Outstanding, Paid, Partially Paid, Waived |
| SequenceNumber | Number | 1..n per property, enforces uniqueness |
| OriginalAmount | Number | For late fees: the calculated 5% amount |
| AdjustedAmount | Number | For late fees: actual amount to collect (supports waiver/discount) |
| AdjustmentReason | Text | Optional |
| AdjustmentStatus | Text | Normal, Discounted, Waived |
| Notes | Text | |
| CreationTimestamp | Timestamp | Auto |
| ModificationTimestamp | Timestamp | Auto |

### PaymentApplications (join table)

Matches actual receipts to expected items. Supports partial payments and one-payment-covers-many.

| Field | Type | Notes |
|---|---|---|
| PrimaryKey | Text | UUID, auto |
| fkExpectedTransaction | Text | FK to ExpectedTransactions |
| fkAccountTransaction | Text | FK to AccountTransactions |
| AmountApplied | Number | How much of the receipt goes to this expected item |
| AppliedDate | Date | Or use AccountTransaction date |
| CreationTimestamp | Timestamp | Auto |

### DocumentVersions

File containers live here. Documents table points to current version.

| Field | Type | Notes |
|---|---|---|
| VersionID | Serial (PK) | Auto |
| DocumentID_fk | Number | FK to DOCUMENTS |
| VersionNumber | Number | Auto-increment per document |
| RemoteFile | Container | Encrypted remote storage |
| LocalCache | Container | Device-local cache |
| SyncStatus | Text | remote_only, local_only, synced, pinned |
| UploadedBy | Text | |
| UploadTimestamp | Timestamp | Auto |
| Notes | Text | |

---

## AccountTransactions: current fields (14)

| Field | Type | Notes |
|---|---|---|
| PrimaryKey | Text | Unique |
| fkProperty | Text | Indexed (target contract: `fkLoan`) |
| fkStatus | Text | Auto-enter calc |
| Date | Date | Indexed |
| Amount | Number | |
| Description | Text | Indexed |
| Notes | Text | |
| is_active | Number | |
| CreatedBy | Text | Audit |
| CreationTimestamp | Timestamp | Audit |
| ModifiedBy | Text | Audit |
| ModificationTimestamp | Timestamp | Audit |
| RunningTotal | Summary | |
| Summary_TotalAmount | Summary | |

### Fields to add to AccountTransactions

| Field | Type | Notes |
|---|---|---|
| fkStandardTransaction | Text | FK to Standard_Transactions |
| TransactionKind | Text | Expected vs Actual vs Adjustment |
| ReceivedMethod | Text | ACH, check, wire, cash |
| ExternalRef | Text | Bank reference, check number |
| ClearedDate | Date | Optional, for reconciliation |

---

## DOCUMENTS table (binder module)

| Field | Type | Notes |
|---|---|---|
| DocumentID | Serial (PK) | Auto-enter |
| PropertyID_fk | Number (FK) | Links to Properties (the "tab" in the binder). Target: Text. |
| LoanID_fk | Number (FK) | Optional for now. Target: Text. |
| DocumentType | Text (value list) | Balloon Note, Settlement Statement, Interest Payment, Check Received |
| DocumentDate | Date | Date on the document itself |
| DateReceived | Date | When physically received or cashed |
| Amount | Number | Dollar amount (if applicable) |
| PayorPayee | Text | Who wrote or received the check |
| CheckNumber | Text | For checks only |
| Notes | Text | Freeform |
| CurrentVersionID_fk | Number (FK) | Points to active DocumentVersions record |
| VersionCount | Number (calc) | Count of versions |
| PinnedLocal | Number (boolean) | 1 = keep cached on device permanently |
| OriginalFilename | Text | Preserved original filename |
| ExpectedPaymentID_fk | Number (FK) | Future: link to expected payment |
| ReceivedPaymentID_fk | Number (FK) | Future: link to received payment |
| LinkedDate | Timestamp | When link was made (audit) |
| LinkedBy | Text | Who linked it |
| IsVerified | Number (boolean) | 1 = reconciled against ledger |
| DateCreated | Timestamp | Auto |
| DateModified | Timestamp | Auto |

---

## PropertyExpectations: current fields (14)

Calculation layer tied to a property:

- fkProperty
- calcNextMaturation
- calcNumberInterestPaymentsDue
- calcPerDiem (and variants)
- calcMortgageBalance
- expROI
- Audit fields + PrimaryKey

## Standard_Transactions: current fields (7)

- PrimaryKey (Text, unique)
- Name (Text, indexed)
- DisplayName (Text, auto-enter calc)
- Audit fields

Needs to be populated with full taxonomy: Origination, Interest Payment, Late Fee, Principal Paydown, Wire Fee, Extension Fee, etc.

---

## GLOBAL_USE_Variables: utility + file info fields

`GLOBAL_USE_Variables` is the canonical single-record utility table. It should absorb app-level nav/filter/view globals and the basic file-info block used on setup/admin surfaces.

**File info fields to incorporate:** `calc_filePath`, `calc_fileLastSaved`, `calc_recordCountSummary`.

**Optional individual counts:** `calc_propertyCount`, `calc_accountTransactionCount`, `calc_expectedTransactionCount`, `calc_documentCount`, `calc_borrowerCount`.

**Placement rule:** these utility fields belong on `GLOBAL_USE_Variables`, not on `SETUP_LLC`, `SETUP_MOBILE`, or the values tables.
