# Notes

Per-build / session notes, dropped as work happens and linked to PRs. Freeform, dated, newest on top. Durable decisions graduate into `meta/` or the relevant object file; raw session log stays here.

---

## 2026-07-14 — Repo-native docs revamp (v1)

Stood up the one-file-per-object mirror on HML as the reference implementation: `tables/` (12 files), `relationships/`, `scripts/` (FMP-folder mirror + `commitRecord` exemplar), `functions/` (+ `MSG_ValueListErrors` stub), `layouts/`, `value-lists/`, `meta/`, `notes/`, plus `INDEX.md`. Standard promoted to `filemaker/DOCUMENTATION-STANDARD.md`; template rebuilt to match. Legacy `docs/` preserved, flagged for absorption. Scripts/functions/layouts still need real enumeration from the FileMaker file.
