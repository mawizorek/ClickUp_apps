# ADULTS_ext

**Role:** role-extension · **Status:** pending · **App:** uritp-people

> Non-student role extension off PEOPLE (one-to-one via `fkPERSON`). Faculty, staff, adjuncts, guest artists, vendors, volunteers. Carries the adult classification. **Department + Title placement is the one genuinely open question** (here vs a Staff-Positions layer).

## Fields

| Field | Type | Key | Category | Status | Notes |
|---|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | | |
| fkPERSON | text-uuid | fk | key | | → PEOPLE.PrimaryKey |
| AdultType | text | plain | classification | | value list: Faculty, Staff, Adjunct, Guest Artist, Vendor, Volunteer |
| Department | text | plain | classification | pending | **OPEN QUESTION**: keep here or graduate to a Staff-Positions layer |
| Title | text | plain | classification | pending | **OPEN QUESTION** (with Department) |
| AdultStatus | text | plain | classification | | value list: Active, Inactive |
| NotesAdult | text | plain | notes | | |
| StartDate | date | plain | lifecycle | | when relationship began (optional) |
| EndDate | date | plain | lifecycle | | when it ended (optional) |
| CreationTimestamp | timestamp | audit | audit | | auto |
| CreatedBy | text | audit | audit | | auto |

## Relationships

- `ADULTS_ext.fkPERSON` → `PEOPLE.PrimaryKey` (one-to-one, pending) — a person may hold BOTH student + adult extensions

## Open Items

- **Dept/Title**: the fuzzy field. If URITP tracks staff positions/levels formally (the as-built file had `_setup_Staff Positions` + `URJobProfileLevels` + `Supervisors`), dept/title may want to be a reference to that layer rather than free text here. Parked, non-blocking.
- `AdultType` + `AdultStatus` should resolve to value lists (see `value-lists/`, pending).
- Confirm the design-only Layout C (ADULTS) field needs against this set.

## Changelog

- 2026-07-18: First-pass migration from the ClickUp `URITP People FMP` doc "Fields to add for Layout C" spec. Dept/Title flagged as the open placement question.
