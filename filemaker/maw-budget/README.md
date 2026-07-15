# maw-budget — (FileMaker App)

**Status:** pilot · **Runs in:** FileMaker Pro · **Source of truth:** this repo folder (see [INDEX.md](./INDEX.md))

Personal finance app. First **git-first** FMP app: never lived in ClickUp; documented in this repo from day one.

> Built on the repo-native docs model ([../DOCUMENTATION-STANDARD.md](../DOCUMENTATION-STANDARD.md)): 1:1 mirror of the FileMaker solution, one file per object, edited by PR. Scaffolded from `_template-fmp-app/` on 2026-07-15.

---

## Next Steps

- [ ] Brainstorm session: define the app's core job and the 3-5 anchor tables
- [ ] Confirm naming convention (defaulted to HML_LLC house style; flip in `schema/tables.json` `_meta.conventions` before any real table exists)
- [ ] Draft first tables into `tables/` + `schema/tables.json`

## Open Questions

- Core job: budgeting, account/net-worth tracking, bill/subscription tracking, or all of it?
- Anchor tables (candidates): Accounts, Transactions, Categories, Budgets, Bills?
- Single-user (Michael only) or shared?
- Naming convention: keep HML_LLC style (`PrimaryKey` + `fk<Parent>`) or switch to URITP style (`pk_`/`fk_`)?

## Purpose

_TBD in brainstorm._

## Goals

_TBD in brainstorm._

## Imports

_TBD._

## Reports / Exports

_TBD._

## Build Status

Scaffold only. No objects defined yet.

## Workflow

_TBD._

## Architecture Notes

See `meta/architecture-notes.md`.

## Artifacts

| Date | Artifact | Link | Description |
|---|---|---|---|
