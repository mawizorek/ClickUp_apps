# Documents

**Role:** document · **Status:** pending · **App:** hml-llc

> Parked: one metadata/intake record per logical document. Rename `DOCUMENTS` → `Documents` before any ExecuteSQL references.

## Fields

| Field | Type | Key | Category | Notes |
|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | |
| fkProperty | text-uuid | fk | key | |
| fkLoan | text-uuid | fk | key | |
| fkCurrentVersion | text-uuid | fk | key | if DocumentVersions survives v1 |

## Relationships

- Referenced by `PropertySUMMARIES.fkDocuments` (many-to-one, under-review)
- Potential child `DocumentVersions` (decision open)

## Open Items

- `Documents` base + child `DocumentVersions`, or file storage directly on `Documents` for v1?
- Audit fields + full field set pending enumeration.

## Changelog

- 2026-07-14: Migrated to per-table file (repo-native docs revamp).
