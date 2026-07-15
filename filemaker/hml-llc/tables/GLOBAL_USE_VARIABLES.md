# GLOBAL_USE_VARIABLES

**Role:** singleton · **Status:** locked · **App:** hml-llc

> The only one-record app-state / control table. Holds file setup values + session context globals.

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
| calc_FILEPATH | calc | calc | setup | |
| calc_FILENAME | calc | calc | setup | |
| calc_HOSTED_STATUS | calc | calc | setup | |
| calc_FILESIZE_MB | calc | calc | setup | |
| script_Stats_RecordCounts | text | plain | setup | |
| script_LastSaved | text | plain | setup | |
| g_fkCurrentProperty | text-uuid | global | context | current property context |
| g_fkCurrentLoan | text-uuid | global | context | current loan context |
| g_HubMode | text | global | context | main hub/tab mode |

## Relationships

None (singleton state table).

## Open Items

- `SETUP_LLC`: decide whether it is truly separate or merges file-wide setup here.

## Changelog

- 2026-07-14: Migrated to per-table file (repo-native docs revamp). Source: `schema/tables.json`.
