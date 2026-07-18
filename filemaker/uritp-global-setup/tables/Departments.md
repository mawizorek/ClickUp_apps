# Departments

**Role:** reference · **Status:** under-review · **App:** uritp-global-setup

> Shared department reference. Consumed by department-aware apps (Labour, Inventory, Safety, budget apps) and by the Staff_Positions layer.

## Fields

| Field | Type | Key | Category | Status | Notes |
|---|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | | |
| Name | text | plain | label | | full department name |
| Short Name | text | plain | label | | abbreviation |
| CreatedBy | text | audit | audit | | auto |
| CreationTimestamp | timestamp | audit | audit | | auto |
| ModificationTimestamp | timestamp | audit | audit | | auto |
| ModifiedBy | text | audit | audit | | auto |

## Relationships

- Parent of `Staff_Positions.fkDepartment` (one-to-many, pending)
- Referenced cross-app by department-aware spokes

## Open Items

- Confirm live-file field names.

## Changelog

- 2026-07-18: First-pass target-state migration.
