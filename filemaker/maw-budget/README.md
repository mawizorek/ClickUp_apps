# maw-budget — (FileMaker App)

**Status:** pilot · **Runs in:** FileMaker Pro · **Source of truth:** this repo folder (see [INDEX.md](./INDEX.md))

Personal finance app. First **git-first** FMP app: never lived in ClickUp; documented in this repo from day one.

> Built on the repo-native docs model ([../DOCUMENTATION-STANDARD.md](../DOCUMENTATION-STANDARD.md)): 1:1 mirror of the FileMaker solution, one file per object, edited by PR. Scaffolded from `_template-fmp-app/` on 2026-07-15.

---

## Next Steps

- [ ] **Answer the goal interrogation** (Open Questions below / full version in [next-build-spec.md](./next-build-spec.md) “Open inquiry”). This is the gate.
- [ ] Confirm the naming convention (DD-008, defaulted to HML) before any table exists.
- [ ] **Then: fresh agent session** to articulate real fields per object off these answers — write `tables/` + `schema/tables.json`. No tables until the inquiry is done; guessing bakes in the wrong shape.

## Design decisions (LOCKED — full rationale in [meta/design-decisions.md](./meta/design-decisions.md))

- **Double-entry ledger** (DD-001): a transaction is an event of balanced legs summing to zero. Ruled in by Michael 2026-07-15.
- **Signed-amount legs; account TYPE first-class** (DD-002).
- **Balances & net worth are derived, never stored** (DD-003).
- **UI speaks money-in / money-out, never debit/credit** (DD-004).
- **Feed-less assets (house, car) via point-in-time Valuations** (DD-005).
- **Bloomberg / market data out of scope** — separate app if ever (DD-006).
- **Phasing: spine → bills → budgeting** (DD-007).
- **Single user** (DD-009).
- Naming = HML house style (DD-008, PROVISIONAL).

## Open Questions (the goal interrogation — answer before tables)

Full prompts in [next-build-spec.md](./next-build-spec.md) “Open inquiry.” In short:

- **A. Accounts:** every real account you hold, and which are on-budget vs net-worth-only.
- **B. Intake:** manual vs CSV/OFX import (no live bank feed in FileMaker); which banks, how often.
- **C. Categories:** flat or hierarchical, how granular.
- **D. Splits:** one purchase across multiple categories — needed?
- **E. Net worth:** trend-over-time, or just today's number?
- **F. Valuations:** how often re-value the house/car?
- **G. Bills:** what's a bill vs a transaction; forecasting/reminders?
- **H. Budgeting:** true envelope or target-vs-actual; rollover?
- **I. Reports:** rank the 3 you'd actually open.
- **J. Reconcile:** mark cleared vs pending against statements?
- **K. Platform:** desktop only, or FileMaker Go on mobile too?

## Purpose

Single-user (Michael) personal finance: see every account balance and total net worth accurately, handle transfers and credit-card payments between accounts without double-counting, and track recurring bills/subscriptions. Envelope budgeting layers on later. Built on a correct accounting foundation (double-entry) so the budgeting layer never forces a rebuild.

## Goals

- One place to see every account balance and total net worth, accurate to the day.
- Transfers and card payments modeled correctly (no double-count, no lost transfers).
- Recurring bills/subscriptions tracked (phase 2).
- Envelope budgeting (phase 3) without re-architecting.
- Fully repo-documented, FileMaker-built, single-user.

## Imports

- Bank / card CSV or OFX via `ImportSessions` (provenance stamp + dedup by `rawHash`). Exact formats pending inquiry B.
- Feed-less assets (house, car) updated via point-in-time `Valuations`.

## Reports / Exports

- Candidates: net-worth-over-time, spending-by-category, account register, cash flow. v1 set pending inquiry I.

## Build Status

Decisions locked (v0.2). Double-entry ruled in; foundational calls in [meta/design-decisions.md](./meta/design-decisions.md). **No objects built yet — blocked on the goal interrogation**, then a dedicated field-articulation session.

## Workflow

Double-entry ledger: every event = balanced legs summing to zero; balances and net worth are derived, not stored. The UI shows money-in / money-out, never debit/credit. See [meta/architecture-notes.md](./meta/architecture-notes.md).

## Architecture Notes

See [meta/architecture-notes.md](./meta/architecture-notes.md) (model) and [meta/design-decisions.md](./meta/design-decisions.md) (decision log).

## Artifacts

| Date | Artifact | Link | Description |
|---|---|---|---|
| 2026-07-15 | Planning brief v0.1 | HTML artifact (chat) | Double-entry explainer: the mechanic, debit/credit, the transfer problem, tools reframed, our phased plan. |
