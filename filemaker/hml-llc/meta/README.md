# Meta / narrative

The narrative documentation that does NOT map to a single FileMaker object. In the repo-native model the old 11 fixed pages decompose: object pages became mirror folders (`tables/`, `relationships/`, `layouts/`, `scripts/`, `value-lists/`); the narrative pages land here.

## Contents (target)

| File | Absorbs (legacy `docs/`) |
|---|---|
| design-decisions.md | docs/design-decisions.md |
| architecture-notes.md | docs/architecture-notes.md |
| data-standards.md | docs/data-standards.md |
| changelog.md | docs/changelog.md |
| database-graph-log.md | docs/database-graph-log.md |
| import-export-specs.md | docs/import-export-specs.md |

## Status

The legacy `../docs/` folder still holds the current narrative content and is preserved intact for now. Absorption into `meta/` (moving/rewriting each file) is the next step of the revamp, done per-file by PR so no content is lost. `docs/tables-and-fields.md`, `docs/relationships.md`, `docs/scripts-and-automations.md`, `docs/layouts.md`, `docs/value-lists.md` are superseded by the mirror folders and will be reduced to pointers.
