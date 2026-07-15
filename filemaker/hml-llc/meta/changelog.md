# Changelog

> Git history is authoritative; highlights here.

- **2026-07-14** — Repo-native docs revamp. One-file-per-object mirror stood up; legacy `docs/` content absorbed into `tables/` + `meta/` + `layouts/`. Standard promoted to `filemaker/DOCUMENTATION-STANDARD.md`. Legacy `docs/` reduced to pointer stubs.
- **2026-07-06** — Added `layouts.md`, completing the standard 11-page set. Layouts documented at role/philosophy level; object-level inventory PENDING on the file.
- **2026-07-06** — Migrated HML_LLC into the repo `filemaker/` window. Locked canonical schema → `schema/*.json`. Design Constitution → design-decisions + architecture-notes. Layouts, scripts, value-lists, graph screenshots marked PENDING.

## Still gated on the FileMaker file (needs a DDR / export)

- **Scripts** — inventory + steps live in the file. Needs DDR or copy-pasted steps.
- **Value lists** — full enumeration from the file.
- **Database graph log** — 52 screenshots on HMLLC-2740 to migrate.
- **Import/export specs** — field-level maps + export/report layouts.
- **Layouts** — exact FileMaker layout names, parts, object inventory.
- **Loans field reconciliation** — principal/rate naming (`OriginalPrincipal`/`InterestRateAnnual` in calcs vs `LoanAmount`/`InterestRate` in schema); `ClosingDate`/`GraceDays`/`fkCurrentPayoff` presence.

## Open schema-lock items (from HMLLC-2740)

- Decide `SETUP_LLC` merge into `GLOBAL_USE_VARIABLES`.
- Normalize remaining core table names to the canonical stack.
- Strip legacy placeholder naming from the active schema.
- Retire/archive `XXval_*`, `xwork_Notes`, `zOld_FileFOLDERS`.
- Pre-SQL rename lock for Documents + CRM/party tables.
