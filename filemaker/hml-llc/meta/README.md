# Meta / narrative

Cross-cutting documentation that does NOT map to a single FileMaker object. In the repo-native model the old 11 fixed pages decomposed: object pages became mirror folders (`tables/`, `relationships/`, `layouts/`, `scripts/`, `value-lists/`); the narrative pages live here.

## Contents

| File | Covers | Absorbed from (legacy `docs/`) |
|---|---|---|
| [design-decisions.md](./design-decisions.md) | Constitution-level stance, schema-lock rulings | docs/design-decisions.md |
| [architecture-notes.md](./architecture-notes.md) | Non-obvious technical decisions (loan-first, frozen payoffs, singleton) | docs/architecture-notes.md |
| [data-standards.md](./data-standards.md) | Naming conventions (HML variant) | docs/data-standards.md |
| [calculation-fields.md](./calculation-fields.md) | **Canonical home for all calc-field formulas** | docs/calculation-fields.md |
| [schema-notes.md](./schema-notes.md) | Normalization audit (1NF/2NF/3NF), live 17-table transition inventory, locked values | docs/tables-and-fields.md (narrative half) |
| [import-export-specs.md](./import-export-specs.md) | Import maps + export/report shape | docs/import-export-specs.md |
| [database-graph-log.md](./database-graph-log.md) | Dated relationship-graph captures | docs/database-graph-log.md |
| [changelog.md](./changelog.md) | Highlights (git history is authoritative) | docs/changelog.md |

## Note on calc formulas

All FileMaker calc-option text lives in **one** place: `calculation-fields.md`. Table files list their calc fields and point here, so a formula is never duplicated (and never drifts) across two files.
