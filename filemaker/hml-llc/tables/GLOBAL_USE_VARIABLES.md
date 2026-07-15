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
| calc_filePath | calc | calc | setup | see meta/calculation-fields.md |
| calc_fileName | calc | calc | setup | see meta/calculation-fields.md |
| calc_hostedStatus | calc | calc | setup | see meta/calculation-fields.md |
| calc_fileSizeMB | calc | calc | setup | numeric; append "MB" in display only |
| script_Stats_RecordCounts | text | plain | setup | script-adjacent helper |
| script_LastSaved | text | plain | setup | script-adjacent helper |
| g_fkCurrentProperty | text-uuid | global | context | current property context |
| g_fkCurrentLoan | text-uuid | global | context | current loan context |
| g_HubMode | text | global | context | main hub/tab mode |

### Optional record-count calcs (placement rule: here, not on SETUP_*)

`calc_propertyCount`, `calc_accountTransactionCount`, `calc_expectedTransactionCount`, `calc_documentCount`, `calc_borrowerCount` — add as needed for setup/admin surfaces.

## Calculations

File-info calcs (`calc_filePath`, `calc_fileName`, `calc_hostedStatus`, `calc_fileSizeMB`) — formulas in [`../meta/calculation-fields.md`](../meta/calculation-fields.md).

## Relationships

None (singleton state table).

## Open Items

- `SETUP_LLC`: decide whether it merges here or stays separate. `SETUP_MOBILE`, `Values`, `Value_Lists` are retire/park candidates (see meta/schema-notes.md).

## Changelog

- 2026-07-14: Per-table file; absorbed file-info + record-count calc detail from legacy docs.
