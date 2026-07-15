# Data Standards

Inherits the URITP FileMaker naming conventions. HML_LLC specifics:

- **Primary keys:** `PrimaryKey` on every table, UUID, never serial. (Note: HML uses the literal name `PrimaryKey`, not a `pk_` prefix — this diverges from the URITP `pk_` house style; reconciliation is an open governance item, see `../../DOCUMENTATION-STANDARD.md`.)
- **Foreign keys:** `fk<Parent>` — `fkProperty`, `fkLoan`, `fkBorrower`, `fkStandardTransaction`, `fkStatus`, `fkExpectedTransaction`, `fkAccountTransaction`.
- **Calculations:** `calc_` prefix; eliminate mixed `CALC_*` forms.
- **Globals:** `g_` prefix; `gLIST_` reserved for value-list globals.
- **Audit fields:** `CreationTimestamp`, `CreatedBy`, `ModificationTimestamp`, `ModifiedBy` on every table (including the singleton).
- **Value lists vs tables:** metadata beyond display value = table (e.g. `Standard_Transactions`); simple labels = value list.
- **No leading underscores** on active core table names. Strip legacy `GLOBAL_`, `XXval_`, `old...` from the active schema.
