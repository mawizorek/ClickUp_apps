# URITP Global Setup — Config Spine (FileMaker App)

**Status:** Target-state schema in progress · **Runs in:** FileMaker Pro · **Source of truth:** this repo folder (see [INDEX.md](./INDEX.md))

The **config spine** of the URITP FileMaker package — the second shared backbone alongside the [People identity hub](../uritp-people/). Houses slow-changing organization reference data that every other app pulls via external data source: org identity (logo/name/acronym), fiscal years, academic periods, and departments. Every app references this from day one; nobody hardcodes org name, logo, or fiscal year locally.

> 🎯 **Build-TOWARD source of truth (greenfield discipline).** Almost nothing in this package is truly built yet, so we design the target-state schema and let it dictate build order — we do NOT let the legacy file's current contents dictate where something "temporarily" lives. Researched from the ClickUp `URITP Global Usage` doc, then edited to the target.

---

## Next Steps

- Confirm live-file field names/types against the actual FMP file (reconciliation pass).
- Author the fiscal-rollover as **discrete stepped scripts** (set-current / shift-previous / set-next) that compose into one automated rollover later.
- Enumerate the production-selector table occurrences into `layouts/` + `scripts/` once the Productions builder defines PRODUCTIONS.

## Resolved Decisions (Michael, 2026-07-18)

- **PRODUCTIONS is NOT owned here.** It graduates to the **Productions/Company builder** as that spoke's owned operational entity. Global Setup keeps ONLY a **selector pointer** (the match-key context for "which show is active") so other apps can pick a show. No temporary hosting — the builder owns it from day one (greenfield discipline, DG-001).
- **Staff Positions are NOT here either (DG-005).** Positions are so intertwined with employment + student-worker assignment that they're operational, not config. They move to the **Labour** spoke (catalog + assignments). Global Setup keeps only `Departments`, which Labour references. `uritp-people/ADULTS_ext` drops its position link; contact-sheet titles join THROUGH Labour at report time.
- **Fiscal rollover: manual, as stepped scripts.** Updated by hand each year via discrete scripts authored to compose into an automated rollover later.
- **`MAW GLOBAL` is out of scope** — a separate legit personal-builds file, NOT a duplicate of this. Do not reconcile.

## Open Questions

- Does the production-selector pointer need its own stored fields here, or is it purely derived table-occurrences + match keys against the builder-owned PRODUCTIONS? (Leaning derived.)
- Does academic-period ever need to be independent of fiscal year, or is the `fkFiscalYear` link always sufficient?

## Purpose

Shared configuration file referenced by all other URITP FMP databases via external data sources. The neutral spine: org identity, fiscal/academic time, departments. Slow-changing reference data, not operational records.

## Goals

- Centralize org identity so all files display consistent branding.
- Track fiscal years + academic periods so every file knows "what year/term is it."
- Define departments as a shared reference table (Labour, budget, inventory, safety all point at it).
- Provide production-selector context (match keys against builder-owned PRODUCTIONS) so other files can pick a show without owning the entity.

## Imports

- Manual config (org name, logo, fiscal-year FKs).
- Fiscal-year + academic-period definitions.
- Department reference entries.

## Reports / Exports

- Shared values consumed by all other FMP files via external data source references.
- Production-selector context (active-fiscal-year filtered) against the Productions builder's PRODUCTIONS.

## Build Status

As-built reference: 6 tables built + in use (GLOBAL_USAGE_VARIABLES, PRODUCTIONS, Fiscal_Years, Academic Periods, Departments, + selector TOs). Target-state moves PRODUCTIONS OUT to the Productions builder and keeps positions OUT (→ Labour). Remaining here: 4 pure-config tables. This repo pass = target-state schema + relationships; layouts/scripts stubbed.

## Architecture Notes

One of the two shared spines (config here; identity in People). **Rule:** slow-changing org reference data lives here; operational entities with their own lifecycle (productions, roles, enrollments, position assignments) live in their owning spoke. An assignment of any kind is never spine data. See `meta/design-decisions.md` (DG-002, DG-005).

---

**Related:** ClickUp source doc `URITP Global Usage`; People hub at [../uritp-people/](../uritp-people/); shared FMP build decisions in the ClickUp "FMP Apps — Shared Build & Behaviour Decision Log" + durable rulings in [../DECISIONS.md](../DECISIONS.md).