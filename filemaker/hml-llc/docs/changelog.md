# Changelog

> Git history is authoritative; highlights here.

- **2026-07-06** — Migrated HML_LLC into the repo `filemaker/` window. Locked 9-table canonical schema translated to `schema/tables.json` + `relationships.json`. Design Constitution migrated to `design-decisions.md` + `architecture-notes.md`. Layouts, scripts, value-list contents, and graph screenshots marked PENDING (source in FileMaker file / ClickUp task).

## Open schema-lock items (carried from HMLLC-2740)

- Decide `SETUP_LLC` merge into `GLOBAL_USE_VARIABLES`.
- Normalize remaining core table names to the canonical stack.
- Strip legacy placeholder naming from the active schema.
- Retire/archive `XXval_*`, `xwork_Notes`, `zOld_FileFOLDERS`.
- Pre-SQL rename lock for Documents + CRM/party tables.
