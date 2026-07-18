# URITP Global Setup — Next Build Spec

**Version:** v1 (first migration pass) · **Date:** 2026-07-18 · overwritten each build cycle.

## This pass shipped

- Target-state config-spine scaffold (schema-first, layouts stubbed).
- 5 config tables: GLOBAL_USAGE_VARIABLES, Fiscal_Years, Academic_Periods, Departments, Staff_Positions (new, DP-006).
- PRODUCTIONS explicitly EXCLUDED — builder-owned (DG-001).
- Rulings DG-001..004 recorded.

## Next cycle (dependency-ordered, greenfield discipline)

1. **Live-file reconciliation** — confirm the 5 tables' field names/types against the actual FMP file.
2. **Build the Staff_Positions layer** — confirm its shape (Level free vs referenced; supervisor as position-link vs person-link), seed from `_setup_Staff Positions` / `URJobProfileLevels` / `Supervisors`.
3. **Author the 3 fiscal-rollover step-scripts** (set-current / shift-previous / set-next) in `scripts/`, built to compose.
4. **Productions/Company builder** — the spoke that OWNS PRODUCTIONS. Build BEFORE the apps that pick a show. Global Setup then wires its selector table-occurrences against it.
5. Wire the production-selector TOs (`layouts/`) once the builder defines PRODUCTIONS.

## Build-order note (DG-001)

Don't build show-consuming apps (Beta Budget show-tagging, Paperwork Archive, Contact Sheets) until the Productions builder exists. Dependency order over accident-of-creation order.
