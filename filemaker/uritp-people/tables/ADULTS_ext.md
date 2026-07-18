# ADULTS_ext

**Role:** role-extension · **Status:** pending · **App:** uritp-people

> Non-student role extension off PEOPLE (one-to-one via `fkPERSON`). Faculty, staff, adjuncts, guest artists, vendors, volunteers. Carries the adult classification. **Ruling 2026-07-18 (W1):** Department + Title reference a **Staff-Positions layer** (via `fkStaffPosition`) that is **Global-Setup-owned reference data** — not a People-local table and not Labour-owned. Both this extension and the Labour spoke read it.

## Fields

| Field | Type | Key | Category | Status | Notes |
|---|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | | |
| fkPERSON | text-uuid | fk | key | | → PEOPLE.PrimaryKey |
| AdultType | text | plain | classification | | value list: Faculty, Staff, Adjunct, Guest Artist, Vendor, Volunteer |
| fkStaffPosition | text-uuid | fk | classification | pending | → Staff-Positions layer (Department + Title/level), **Global-Setup-owned** (W1). Replaces as-built free-text Department/Title. |
| AdultStatus | text | plain | classification | | value list: Active, Inactive |
| NotesAdult | text | plain | notes | | |
| StartDate | date | plain | lifecycle | | when relationship began (optional) |
| EndDate | date | plain | lifecycle | | when it ended (optional) |
| CreationTimestamp | timestamp | audit | audit | | auto |
| CreatedBy | text | audit | audit | | auto |

**10 fields.** As-built free-text `Department` + `Title` replaced by the single `fkStaffPosition` reference.

## Relationships

- `ADULTS_ext.fkPERSON` → `PEOPLE.PrimaryKey` (one-to-one, pending) — a person may hold BOTH student + adult extensions
- `ADULTS_ext.fkStaffPosition` → Staff-Positions layer PK in **Global Setup** (many-to-one, pending)

## Why Global Setup owns positions (W1)

Staff positions/levels are **org reference data**, like departments and fiscal years, which is exactly Global Setup's job. Putting them there (not in Labour) avoids a back-dependency where the People hub would depend on the Labour spoke, keeping hub-and-spoke clean. Seeds from the as-built `_setup_Staff Positions` / `URJobProfileLevels` / `Supervisors`.

## Open Items

- Build the Staff-Positions layer in Global Setup (next Global Setup migration); confirm its exact fields (department, title, level, supervisor).
- `AdultType` + `AdultStatus` resolve to value lists (see `value-lists/`, pending).

## Changelog

- 2026-07-18 (W1): Staff-Positions layer ruled **Global-Setup-owned** (not People-local, not Labour). `fkStaffPosition` points there.
- 2026-07-18 (target-state): Dept/Title graduated to a Staff-Positions layer via `fkStaffPosition`. Field count 11→10.
- 2026-07-18: First-pass migration from the ClickUp `URITP People FMP` doc "Fields to add for Layout C" spec.
