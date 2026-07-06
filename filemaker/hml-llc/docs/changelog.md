# Changelog

> Git history is authoritative; highlights here.

- **2026-07-06** — Added `docs/layouts.md`, completing the standard 11-page documentation set (was 10/11; Layouts was the missing subpage). Layouts documented at the role/philosophy level with the v1 core layout set; object-level inventory marked PENDING on the FileMaker file.
- **2026-07-06** — Migrated HML_LLC into the repo `filemaker/` window. Locked 9-table canonical schema translated to `schema/tables.json` + `relationships.json`. Design Constitution migrated to `design-decisions.md` + `architecture-notes.md`. Layouts, scripts, value-list contents, and graph screenshots marked PENDING (source in FileMaker file / ClickUp task).

## Still gated on the FileMaker file (cannot be documented without a DDR / export)

- **Scripts** (`scripts-and-automations.md`) — script inventory + steps live in the file. Needs DDR output or copy-pasted script steps.
- **Value lists** (`value-lists.md` / `schema/value-lists.json`) — full enumeration from the file.
- **Database graph log** (`database-graph-log.md`) — 52 relationship-graph screenshots currently on ClickUp task HMLLC-2740; migrate the dated captures + observations.
- **Import/export specs** (`import-export-specs.md`) — field-level import maps + export/report layouts.
- **Tables and fields** (`tables-and-fields.md`) — full field enumeration per table (identity fields, re-homed `calc_` loan math, parked-table fields).

## Open schema-lock items (carried from HMLLC-2740)

- Decide `SETUP_LLC` merge into `GLOBAL_USE_VARIABLES`.
- Normalize remaining core table names to the canonical stack.
- Strip legacy placeholder naming from the active schema.
- Retire/archive `XXval_*`, `xwork_Notes`, `zOld_FileFOLDERS`.
- Pre-SQL rename lock for Documents + CRM/party tables.
