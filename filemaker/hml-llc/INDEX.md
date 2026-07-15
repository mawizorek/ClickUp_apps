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

7 role-defined layouts (exact FMP names pending). See [layouts/README.md](./layouts/README.md).

## Value Lists (`value-lists/`)

See [value-lists/README.md](./value-lists/README.md).

## Meta / narrative (`meta/`)

- [design-decisions](./meta/design-decisions.md) · [architecture-notes](./meta/architecture-notes.md) · [data-standards](./meta/data-standards.md)
- [calculation-fields](./meta/calculation-fields.md) (all calc formulas) · [schema-notes](./meta/schema-notes.md) (normalization + live inventory)
- [import-export-specs](./meta/import-export-specs.md) · [database-graph-log](./meta/database-graph-log.md) · [changelog](./meta/changelog.md)

## Legacy

`docs/` holds pointer stubs to their absorbed destinations (kept so old links don't break).
