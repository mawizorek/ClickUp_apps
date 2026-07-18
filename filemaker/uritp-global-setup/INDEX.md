# URITP Global Setup — Object Index (rendering manifest)

_The navigable map of every documented object. Mirrors the FileMaker solution. Human entry point; the viewer reads the `_index.json` in each folder._

## Tables (`tables/`)

| Table | Role | Status |
|---|---|---|
| [GLOBAL_USAGE_VARIABLES](./tables/GLOBAL_USAGE_VARIABLES.md) | singleton-config | under-review |
| [Fiscal_Years](./tables/Fiscal_Years.md) | reference | under-review |
| [Academic_Periods](./tables/Academic_Periods.md) | reference | under-review |
| [Departments](./tables/Departments.md) | reference | under-review |

> **Deliberately NOT here:**
> - **PRODUCTIONS** — owned by the Productions/Company builder (DG-001). GS carries only production-selector table occurrences (match-key context).
> - **Staff_Positions** — moved to the **Labour** spoke (DG-005); positions are operational assignment data, not config. See the [tombstone](./tables/Staff_Positions.md). Departments stay here; Labour references them.

## Relationships (`relationships/`)

Config spine — fiscal-year fanout + academic time keys. See [relationships/README.md](./relationships/README.md) + `schema/relationships.json`.

## Scripts (`scripts/`)

Fiscal-year rollover: discrete stepped scripts (set-current / shift-previous / set-next), composable into an automated rollover later. Pending enumeration.

## Layouts (`layouts/`)

Stubbed (schema-first). Production selector + config-edit layouts. See [layouts/README.md](./layouts/README.md).

## Meta / narrative (`meta/`)

- [design-decisions](./meta/design-decisions.md) — config-vs-operational rulings + greenfield discipline
- verification.json — D-007 object audit ledger (empty baseline)
