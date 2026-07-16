# maw-budget — (FileMaker App)

**Status:** planning (inquiry closed) · **Runs in:** FileMaker Pro + FileMaker Go · **Source of truth:** this repo folder (see [INDEX.md](./INDEX.md))

Personal finance app. First **git-first** FMP app: never lived in ClickUp; documented in this repo from day one.

> Built on the repo-native docs model ([../DOCUMENTATION-STANDARD.md](../DOCUMENTATION-STANDARD.md)): 1:1 mirror of the FileMaker solution, one file per object, edited by PR. Scaffolded from `_template-fmp-app/` on 2026-07-15.

---

## Next Steps

- [ ] **Confirm DD-008 naming** (HML `PrimaryKey`/`fk<Parent>` vs URITP `pk_`/`fk_`). This is the ONLY gate left before tables.
- [ ] **Fresh agent session: field articulation.** Write real fields per object into `tables/` + `schema/tables.json`, driven by DD-011–022. The [decision log](./meta/design-decisions.md) + [spec](./next-build-spec.md) are the full brief — a cold agent should run it without re-interviewing Michael.

## Design decisions (goal interrogation A–L CLOSED — full rationale in [meta/design-decisions.md](./meta/design-decisions.md))

- **Double-entry ledger** (DD-001): a transaction is an event of balanced legs summing to zero.
- **Signed-amount legs; account TYPE first-class** (DD-002).
- **Balances & net worth derived, never stored** (DD-003) — net-worth snapshots are the one exception (DD-016).
- **UI speaks money-in / money-out, never debit/credit** (DD-004).
- **Feed-less assets (house, car) via point-in-time Valuations** (DD-005); re-valued on-demand + soft staleness nudge (DD-018).
- **Bloomberg / market data out of scope** (DD-006).
- **Phasing: spine → bills → budgeting** (DD-007).
- **Single user** (DD-009).
- **Every account class in one typed `Account` table** + on-budget boolean (DD-011).
- **CSV import + manual entry, ~weekly** (DD-012); dedup via `rawHash`.
- **Reimbursements = receivables**, live "who owes me" view, Phase 1 (DD-013).
- **Hierarchical parent→child categories** (DD-014).
- **Multi-category splits** = N legs on one event (DD-015).
- **Net worth over time** via `NetWorthSnapshot` (DD-016).
- **Bills = expected-vs-actual, variable, soft forecasting**, Phase 2 (DD-017).
- **Budgeting = target-vs-actual first, envelope-ready later**, Phase 3 (DD-019).
- **Priority reports:** spend-by-category, account register, who-owes-me (DD-020).
- **Reconciliation: cleared/pending in scope** (DD-021).
- **Platform: desktop + FileMaker Go**, serverless pref, receipts wanted — sync/hosting is an open architecture question (DD-022).
- Naming = HML house style (DD-008, **PROVISIONAL — the last open gate**).

## Purpose

Single-user (Michael) personal finance: see every account balance and total net worth accurately (and its trend over time), handle transfers, card payments, splits, and reimbursements without double-counting, track who owes him, and track recurring bills. Envelope budgeting layers on later. Built on a correct accounting foundation (double-entry) so every later phase is additive, never a rebuild.

## Goals

- One place to see every account balance, total net worth, and the net-worth trend.
- Transfers, card payments, splits, and reimbursements modeled correctly (no double-count, no lost transfers).
- CSV import + manual entry with dedup; cleared/pending reconciliation.
- Live "who owes me" (receivables).
- Recurring bills tracked with expected-vs-actual (phase 2); envelope budgeting (phase 3) without re-architecting.
- Desktop + mobile (FileMaker Go); repo-documented; single-user.

## Imports

- Bank / card CSV via `ImportSessions` (provenance + `rawHash` dedup). First target: the existing Venmo/Chase/Capital One CSV. Manual entry is a peer path.
- Feed-less assets updated via point-in-time `Valuations`.

## Reports / Exports

- v1 priority (DD-020): **spend-by-category**, **account register**, **who-owes-me**. Net-worth trend is the headline number + chart. Cash-flow = Futures.

## Build Status

Planning complete through the goal interrogation (A–L, DD-001–022). **No objects built yet — by design.** Next: confirm DD-008 naming, then a dedicated field-articulation session. See [meta/changelog.md](./meta/changelog.md) for the full trail.

## Workflow

Double-entry ledger: every event = balanced legs summing to zero; balances and net worth are derived, not stored. The UI shows money-in / money-out, never debit/credit. See [meta/architecture-notes.md](./meta/architecture-notes.md).

## Architecture Notes

See [meta/architecture-notes.md](./meta/architecture-notes.md) (model), [meta/design-decisions.md](./meta/design-decisions.md) (decision log), [meta/changelog.md](./meta/changelog.md) (chronological trail).

## Artifacts

| Date | Artifact | Link | Description |
|---|---|---|---|
| 2026-07-15 | Planning brief v0.1 | HTML artifact (chat) | Double-entry explainer: the mechanic, debit/credit, the transfer problem, tools reframed, our phased plan. |
