# Fiscal_Years

**Role:** reference · **Status:** under-review · **App:** uritp-global-setup

> Fiscal-year definitions. The time-fanout hub: referenced by the GLOBAL_USAGE_VARIABLES current/prev/next pointers, by Academic_Periods, and by the builder-owned PRODUCTIONS.

## Fields

| Field | Type | Key | Category | Status | Notes |
|---|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | | |
| popup_short | text | plain | label | | short display label for dropdowns |
| Title | text | plain | label | | e.g. FY27 |
| StartDate | date | plain | range | | |
| EndDate | date | plain | range | | |
| CreationTimestamp | timestamp | audit | audit | | auto |

## Relationships

- Referenced by `GLOBAL_USAGE_VARIABLES` current/prev/next pointers (many-to-one)
- Parent of `Academic_Periods.fkFiscalYear` (one-to-many)
- Referenced cross-app by the builder-owned `PRODUCTIONS.fkFiscalYear`

## Open Items

- Confirm live-file field names.

## Changelog

- 2026-07-18: First-pass target-state migration.
