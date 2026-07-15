# Organizations

**Role:** party · **Status:** pending · **App:** hml-llc

> Parked: company/business/entity records (vs `Borrowers` if borrower-only scope wins). Rename `CRM` → `Organizations` before ExecuteSQL.

## Fields

| Field | Type | Key | Category | Notes |
|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | |

## Relationships

- Referenced by `Loans.fkBorrower` (pending) and `PropertySUMMARIES.fkBorrower` (under-review)

## Open Items

- Scope decision: `Organizations` (broader) vs `Borrowers` (borrower-only). Leaning `Organizations`.
- Full field set + audit quad pending enumeration.

## Changelog

- 2026-07-14: Migrated to per-table file (repo-native docs revamp).
