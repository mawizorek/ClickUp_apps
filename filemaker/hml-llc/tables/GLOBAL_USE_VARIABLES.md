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
| calc_filePath | calc | calc | setup | see Calculations |
| calc_fileName | calc | calc | setup | see Calculations |
| calc_hostedStatus | calc | calc | setup | see Calculations |
| calc_fileSizeMB | calc | calc | setup | numeric; append "MB" in display only |
| script_Stats_RecordCounts | text | plain | setup | script-adjacent helper |
| script_LastSaved | text | plain | setup | script-adjacent helper |
| g_fkCurrentProperty | text-uuid | global | context | current property context |
| g_fkCurrentLoan | text-uuid | global | context | current loan context |
| g_HubMode | text | global | context | main hub/tab mode |

### Optional record-count calcs (placement rule: here, not on SETUP_*)

`calc_propertyCount`, `calc_accountTransactionCount`, `calc_expectedTransactionCount`, `calc_documentCount`, `calc_borrowerCount` — add as needed for setup/admin surfaces.

## Calculations

**`calc_filePath`** — Text, unstored. Current file path/location.
```
Get ( FilePath )
```

**`calc_fileName`** — Text, unstored. Current file name.
```
Get ( FileName )
```

**`calc_hostedStatus`** — Text, unstored. Hosted vs local helper.
```
If ( Get ( MultiUserState ) > 1 ; "Hosted" ; "Local" )
```

**`calc_fileSizeMB`** — Number, unstored. Numeric file size; append "MB" only in display contexts.
```
Let (
  ~bytes = Get ( FileSize ) ;
  Round ( ~bytes / 1048576 ; 2 )
)
```

## Relationships

None (singleton state table).

## Open Items

- `SETUP_LLC`: decide whether it merges here or stays separate. `SETUP_MOBILE`, `Values`, `Value_Lists` are retire/park candidates (see meta/schema-notes.md).

## Changelog

- 2026-07-15: Calc formulas embedded inline (were in meta/calculation-fields.md).
- 2026-07-14: Per-table file; absorbed file-info + record-count calc detail from legacy docs.
