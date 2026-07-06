# Tables and Fields

> Structured source of truth: [`../schema/tables.json`](../schema/tables.json). This is the human companion. 9 canonical core tables + 3 parked party/document tables.

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

## Parked (party + documents)

`Documents` (+ optional `DocumentVersions`, `DocumentFolders`), `Organizations`, `Contacts` (+ optional `OrganizationContacts`). Rename out of legacy all-caps before any ExecuteSQL references.

## Field conventions

See [`data-standards.md`](./data-standards.md). PK = `PrimaryKey` (UUID) on every table; FK = `fk<Parent>`; calcs = `calc_`; globals = `g_`.

**Pending from the FileMaker file:** full field enumeration for `PropertySUMMARIES` identity fields, the re-homed `calc_` loan math on `Loans`, and confirmation of parked-table fields.
