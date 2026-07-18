# ADULTS_ext

**Role:** role-extension · **Status:** pending · **App:** uritp-people

> Non-student role extension off PEOPLE (one-to-one via `fkPERSON`). Faculty, staff, adjuncts, guest artists, vendors, volunteers. Carries the adult classification. **Ruling 2026-07-18:** Department + Title do NOT live here as free text — they reference a **Staff-Positions layer** (via `fkStaffPosition`), so titles/levels are governed in one place instead of typed per person.

## Fields

| Field | Type | Key | Category | Status | Notes |
|---|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | | |
| fkPERSON | text-uuid | fk | key | | → PEOPLE.PrimaryKey |
| AdultType | text | plain | classification | | value list: Faculty, Staff, Adjunct, Guest Artist, Vendor, Volunteer |
| fkStaffPosition | text-uuid | fk | classification | pending | → Staff-Positions layer (holds Department + Title/level). Replaces the as-built free-text Department/Title. Home of that layer TBD: dedicated positions table vs. Labour spoke. |
| AdultStatus | text | plain | classification | | value list: Active, Inactive |
| NotesAdult | text | plain | notes | | |
| StartDate | date | plain | lifecycle | | when relationship began (optional) |
| EndDate | date | plain | lifecycle | | when it ended (optional) |
| CreationTimestamp | timestamp | audit | audit | | auto |
| CreatedBy | text | audit | audit | | auto |

**10 fields.** As-built free-text `Department` + `Title` were replaced by the single `fkStaffPosition` reference per Michael's ruling that dept/title graduate to a Staff-Positions layer.

## Relationships

- `ADULTS_ext.fkPERSON` → `PEOPLE.PrimaryKey` (one-to-one, pending) — a person may hold BOTH student + adult extensions
- `ADULTS_ext.fkStaffPosition` → Staff-Positions layer PK (many-to-one, pending) — layer's home app TBD

## Open Items

- **Staff-Positions layer home:** dedicated positions table in this file, or the Labour spoke? The as-built People file carried `_setup_Staff Positions` / `URJobProfileLevels` / `Supervisors` — those are the seed for this layer. Deferred-to-Labour is the current lean (see `meta/design-decisions.md`).
- `AdultType` + `AdultStatus` should resolve to value lists (see `value-lists/`, pending).

## Changelog

- 2026-07-18 (target-state): Dept/Title graduated to a Staff-Positions layer via `fkStaffPosition` (Michael ruling). Field count 11→10.
- 2026-07-18: First-pass migration from the ClickUp `URITP People FMP` doc "Fields to add for Layout C" spec.
