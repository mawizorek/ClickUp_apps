# maw-budget — (FileMaker App)

**Status:** pilot · **Runs in:** FileMaker Pro · **Source of truth:** this repo folder (see [INDEX.md](./INDEX.md))

Personal finance app. First **git-first** FMP app: never lived in ClickUp; documented in this repo from day one.

> Built on the repo-native docs model ([../DOCUMENTATION-STANDARD.md](../DOCUMENTATION-STANDARD.md)): 1:1 mirror of the FileMaker solution, one file per object, edited by PR. Scaffolded from `_template-fmp-app/` on 2026-07-15.

---

## Next Steps

- [ ] **RULE the double-entry vs single-entry fork** (see [next-build-spec.md](./next-build-spec.md) "In review"). This unblocks all table work. Recommendation: **double-entry.**
- [ ] Confirm naming convention (HML_LLC house style default) before the first table.
- [ ] Draft Phase 1 tables (Institutions, Accounts, Categories, TransactionGroups, TransactionLines, ImportSessions, Valuations) into `tables/` + `schema/tables.json`.

## Open Questions

- Naming convention: keep HML_LLC (`PrimaryKey` / `fk<Parent>`) or switch to URITP (`pk_` / `fk_`)? Defaulted to HML.
- v1 report set: which reports matter first (net-worth trend? monthly spend by category? account register?).

## Purpose

Single-user (Michael) personal finance: see every account balance and total net worth accurately, handle transfers and credit-card payments between accounts without double-counting, and track recurring bills/subscriptions. Envelope budgeting layers on later. Built on a correct accounting foundation (double-entry) so the budgeting layer never forces a rebuild.

## Goals

- One place to see every account balance and total net worth, accurate to the day.
- Transfers and card payments modeled correctly (no double-count, no lost transfers).
- Recurring bills/subscriptions tracked (phase 2).
- Envelope budgeting (phase 3) without re-architecting.
- Fully repo-documented, FileMaker-built, single-user.

## Imports

- Bank / card CSV via `ImportSessions` (provenance stamp + dedup by `rawHash`).
- Feed-less assets (house, car) updated via point-in-time `Valuations`.

## Reports / Exports

- Net-worth-over-time, spending-by-category, account register. (Exact v1 set TBD — see Open Questions.)

## Build Status

Plan articulated (v0.1). Double-entry spine + phasing defined in [next-build-spec.md](./next-build-spec.md). No objects built yet — blocked on the double-entry decision.

## Workflow

Double-entry ledger: every event = balanced legs summing to zero; balances and net worth are derived, not stored. The UI shows money-in / money-out, never debit/credit. See [meta/architecture-notes.md](./meta/architecture-notes.md).

## Architecture Notes

See `meta/architecture-notes.md`.

## Artifacts

| Date | Artifact | Link | Description |
|---|---|---|---|
