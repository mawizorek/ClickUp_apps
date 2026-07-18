# GRADUATION_CLASSES

**Role:** value-source · **Status:** under-review · **App:** uritp-people

> Class-year value source referenced by `STUDENTS_ext.fkGraduation_Year`. A **table, not a value list**, because entries can carry more than a display label (per the URITP "value list vs table" rule: metadata beyond display value = table).

## Fields

| Field | Type | Key | Category | Status | Notes |
|---|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | | |
| dropdownName | text | plain | label | | Senior, Junior, Sophomore, First Year, Recent Grad, Alumni |
| CreationTimestamp | timestamp | audit | audit | | auto |

## Relationships

- Referenced by `STUDENTS_ext.fkGraduation_Year` → `GRADUATION_CLASSES.PrimaryKey` (one-to-many, under-review)

## Open Items

- Confirm whether class-year should instead be a shared Academic_Periods reference in Global Setup (so Courses + People agree on the same year list). Cross-app consideration.

## Changelog

- 2026-07-18: First-pass migration.
