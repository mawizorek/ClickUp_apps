# Academic_Periods

**Role:** reference · **Status:** under-review · **App:** uritp-global-setup

> Semester/term definitions, each tied to a fiscal year. Consumed by semester-aware apps (Courses, Labour).

## Fields

| Field | Type | Key | Category | Status | Notes |
|---|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | | |
| fkFiscalYear | text-uuid | fk | key | | → Fiscal_Years |
| popup_short | text | plain | label | | short display label |
| Title | text | plain | label | | e.g. Fall 2026, Spring 2027 |
| StartDate | date | plain | range | | |
| EndDate | date | plain | range | | |

## Relationships

- `Academic_Periods.fkFiscalYear` → `Fiscal_Years.PrimaryKey` (many-to-one, under-review)

## Open Items

- Confirm live-file field names.

## Changelog

- 2026-07-18: First-pass target-state migration.
