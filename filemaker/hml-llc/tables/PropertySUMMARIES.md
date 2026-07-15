# PropertySUMMARIES

**Role:** collateral · **Status:** locked · **App:** hml-llc

> Collateral / operating property table. NOT the financial parent — loan-servicing ownership lives on `Loans`.

## Fields

| Field | Type | Key | Category | Status | Notes |
|---|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | | |
| CreationTimestamp | timestamp | audit | audit | | |
| CreatedBy | text | audit | audit | | |
| ModificationTimestamp | timestamp | audit | audit | | |
| ModifiedBy | text | audit | audit | | |
| fkBorrower | text-uuid | fk | key | under-review | FK ownership under re-eval |
| fkDocuments | text-uuid | fk | key | under-review | |
| fkBalloonNote | text-uuid | fk | key | under-review | |
| fkPropertyStatus | text-uuid | fk | key | under-review | |
| &lt;property identity + operating fields&gt; | text | plain | identity | pending | address/collateral identity fields — enumerate from FileMaker file |

## Relationships

- `PropertySUMMARIES.fkDocuments` → `Documents.PrimaryKey` (many-to-one, under-review)
- `PropertySUMMARIES.fkBorrower` → `Organizations.PrimaryKey` (many-to-one, under-review)
- Referenced by `Loans.fkProperty` (many-to-one, locked)

## Open Items

- Enumerate the real property identity / operating fields from the FileMaker file.
- Re-evaluate the four under-review FKs so each clearly belongs to a real parent/module.

## Changelog

- 2026-07-14: Migrated to per-table file (repo-native docs revamp).
