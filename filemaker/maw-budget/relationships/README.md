# Relationships

The **Table Occurrence (TO) graph** — source of truth for relationships. Anchor-buoy model: each layout sits on one anchor TO; related tables are buoys off it. Machine mirror: `../schema/relationships.json`. `_index.json` is the human/viewer-facing graph; it feeds the viewer.

**Join key:** every TO has an `occurrenceId`. Layouts reference it (in `layout.json` + `layouts/_index.json`); this is how we answer "which layouts use this TO" and "what does this layout reach" as **queries**, never a stored cross-reference. Full model: [`../meta/relationship-audit-model.md`](../meta/relationship-audit-model.md).

## Table occurrences

| occurrenceId | Base table | Role | Anchor group | Edges | Status |
|---|---|---|---|---|---|
| `Globals` | Globals | anchor | Globals | none (island) | proposed |

## Relationship edges

| From TO | To TO | Cardinality | Allow create | Status | Notes |
|---|---|---|---|---|---|
| _none yet_ | | | | | Globals is an island (globals utility screen has no relationships) |

_As real tables (Accounts, TransactionGroups, TransactionLines, Categories, etc.) are articulated, add their TOs + edges here; layouts on those TOs inherit the reach automatically._
