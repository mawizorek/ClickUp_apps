# GLOBAL_USE_VARIABLES

**Role:** singleton · **Status:** locked · **App:** hml-llc

> The only one-record app-state / control table. Holds file setup values + session context globals. Absorbs app-level nav/filter/view globals and the file-info block used on setup/admin surfaces.

## Fields

| Field | Type | Key | Category | Notes |
|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | |
| CreationTimestamp | timestamp | audit | audit | |
| CreatedBy | text | audit | audit | |
| ModificationTimestamp | timestamp | audit | audit | |
| ModifiedBy | text | audit | audit | |
| APP_TITLE | text | plain | setup | |
| APP_VERSION | text | plain | setup | |
| calc_filePath | calc | calc | setup | see ../calculations/ |
| calc_fileName | calc | calc | setup | see ../calculations/ |
| calc_hostedStatus | calc | calc | setup | see ../calculations/ |
| calc_fileSizeMB | calc | calc | setup | numeric; append "MB" in display only |
| script_Stats_RecordCounts | text | plain | setup | script-adjacent helper |
| script_LastSaved | text | plain | setup | script-adjacent helper |
| g_fkCurrentProperty | text-uuid | global | context | current property context |
| g_fkCurrentLoan | text-uuid | global | context | current loan context |
| g_HubMode | text | global | context | main hub/tab mode |

### Optional record-count calcs (placement rule: here, not on SETUP_*)

`calc_propertyCount`, `calc_accountTransactionCount`, `calc_expectedTransactionCount`, `calc_documentCount`, `calc_borrowerCount` — add as needed for setup/admin surfaces. When added, each gets its own `.fmcalc` file in `../calculations/` and a `calcRef` in the schema JSON.

> **Calculations:** this table's calc formula bodies are the single-source `.fmcalc` files in [`../calculations/`](../calculations/) (canonical) and are surfaced inline by the schema renderer. This markdown intentionally does not restate or index them; the JSON (`schema/tables.json` `calcRef`) + `calculations/_index.json` own that.

## Relationships

None (singleton state table).

## Open Items

- `SETUP_LLC`: decide whether it merges here or stays separate. `SETUP_MOBILE`, `Values`, `Value_Lists` are retire/park candidates (see meta/schema-notes.md).

## Changelog

- 2026-07-16: Retired the inline `Calculations` section. Formula bodies now live solely in `../calculations/*.fmcalc` (referenced by `calcRef` in `schema/tables.json`) and are surfaced by the renderer. No pointer list retained per the v1.3 standard.
- 2026-07-15: Calc formulas embedded inline (were in meta/calculation-fields.md).
- 2026-07-14: Per-table file; absorbed file-info + record-count calc detail from legacy docs.
