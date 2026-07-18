# Staff_Positions

**Role:** reference · **Status:** pending · **App:** uritp-global-setup

> **NEW layer, graduated here from `uritp-people` (DP-006).** Governs department + title/level as shared reference data — not typed free-text per person. Referenced by `uritp-people/ADULTS_ext.fkStaffPosition` and by Labour. Seeds from the as-built People-file tables `_setup_Staff Positions` / `URJobProfileLevels` / `Supervisors`.

## Fields

| Field | Type | Key | Category | Status | Notes |
|---|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | | |
| Title | text | plain | label | pending | position/job title |
| fkDepartment | text-uuid | fk | key | pending | → Departments |
| Level | text | plain | label | pending | UR job profile level (from URJobProfileLevels) |
| fkSupervisorPosition | text-uuid | fk | key | pending | self-ref → Staff_Positions (reporting line); confirm shape when building |
| CreationTimestamp | timestamp | audit | audit | | auto |

## Relationships

- `Staff_Positions.fkDepartment` → `Departments.PrimaryKey` (many-to-one, pending)
- `Staff_Positions.fkSupervisorPosition` → `Staff_Positions.PrimaryKey` (self-ref, many-to-one, pending)
- Referenced by `uritp-people/ADULTS_ext.fkStaffPosition` (cross-app) + Labour

## Why it lives here (DP-006)

Staff positions/levels are org reference data like departments and fiscal years — Global Setup's remit. Housing them in Labour would make the People hub depend on a spoke, inverting hub-and-spoke. Global Setup is the neutral spine both People and Labour consume.

## Open Items

- Confirm exact shape when building: is `Level` a free field or its own `URJobProfileLevels` reference table? Is the supervisor a position-to-position link (modeled here) or a person link (belongs elsewhere)?
- Seed from the three as-built People-file tables.

## Changelog

- 2026-07-18: Created as the target-state home for the Staff-Positions layer (DP-006). Shape is a first proposal, pending confirmation at build time.
