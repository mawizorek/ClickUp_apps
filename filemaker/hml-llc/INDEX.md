# HML_LLC — Object Index (rendering manifest)

_The navigable map of every documented object. Mirrors the FileMaker solution. Human entry point; the Phase 2 viewer reads the `_index.json` in each folder._

## Tables (`tables/`)

| Table | Role | Status |
|---|---|---|
| [GLOBAL_USE_VARIABLES](./tables/GLOBAL_USE_VARIABLES.md) | singleton | locked |
| [PropertySUMMARIES](./tables/PropertySUMMARIES.md) | collateral | locked |
| [Loans](./tables/Loans.md) | servicing-parent | locked |
| [ExpectedTransactions](./tables/ExpectedTransactions.md) | ledger | locked |
| [AccountTransactions](./tables/AccountTransactions.md) | ledger | locked |
| [PaymentApplications](./tables/PaymentApplications.md) | join | locked |
| [Payoffs](./tables/Payoffs.md) | snapshot | locked |
| [PaymentInstructions](./tables/PaymentInstructions.md) | source | under-review |
| [Standard_Transactions](./tables/Standard_Transactions.md) | taxonomy | locked |
| [Documents](./tables/Documents.md) | document | pending |
| [Organizations](./tables/Organizations.md) | party | pending |
| [Contacts](./tables/Contacts.md) | party | pending |

## Relationships (`relationships/`)

Loan-first graph. See [relationships/README.md](./relationships/README.md) + `relationships/_index.json`.

## Scripts (`scripts/`)

Mirrors FMP script folders. See [scripts/README.md](./scripts/README.md).
- utilities/ — [commitRecord](./scripts/utilities/commitRecord.md)
- imports/ · navigation/ · triggers/ — scaffolded, pending enumeration.

## Functions (`functions/`)

See [functions/README.md](./functions/README.md).
- [MSG_ValueListErrors](./functions/MSG_ValueListErrors.md)

## Layouts (`layouts/`)

See [layouts/README.md](./layouts/README.md) — pending enumeration.

## Value Lists (`value-lists/`)

See [value-lists/README.md](./value-lists/README.md).

## Meta / narrative (`meta/`)

Design decisions, architecture, data standards, changelog, graph log, import/export. See [meta/README.md](./meta/README.md).
