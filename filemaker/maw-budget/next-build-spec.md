# maw-budget — Next Build Spec (v0)

> One file per app, overwritten each build cycle. Version lives in this header, never in the filename.

## Scratch intake

- 2026-07-15: app scaffolded git-first from `_template-fmp-app`. Never in ClickUp. Awaiting brainstorm to define core job + anchor tables.

## Next build

- Brainstorm the data model; write the first table files + `schema/tables.json`.

## In review

- Naming convention (HML_LLC default vs URITP) — decide before first real table.

## Futures

- 

## Known guardrails

- Repo is source of truth. One file per object. Calc formulas inline in their owning table file (DOCUMENTATION-STANDARD.md, 2026-07-15).
- Every object edit = branch → PR → self-merge.
