# maw-budget — (FileMaker App)

**Status:** planning complete + layout-first articulation underway · **Runs in:** FileMaker Pro + FileMaker Go · **Source of truth:** this repo folder (see [INDEX.md](./INDEX.md))

Personal finance app. First **git-first** FMP app: never lived in ClickUp; documented in this repo from day one.

> Built on the repo-native docs model ([../DOCUMENTATION-STANDARD.md](../DOCUMENTATION-STANDARD.md)): 1:1 mirror of the FileMaker solution, one file per object, edited by PR. Scaffolded from `_template-fmp-app/` on 2026-07-15.

---

## Next Steps

- [ ] **Themeing agent pass.** Review the layout renders + reconcile the theme-token vocabulary and create the canonical theme file. Brief: [../THEMING-INTEGRATION.md](../THEMING-INTEGRATION.md).
- [ ] **Field articulation session.** Write real fields per object into `tables/` + `schema/tables.json`, driven by DD-011–022 in HML naming (DD-008 LOCKED). Layout-first renders are surfacing the fields/value-lists/scripts ahead of this.
- [ ] **Continue layout-first renders.** `GLOBAL_Settings` + `VALUE_Lists` done; ledger/register + report layouts (LDGR/RPT) next.
- [ ] **Decisions pending:** go/no-go on the generic field/table render shell + `z-fm-layout-object-viewer`; confirm naming convention + folder-per-layout, then update `DOCUMENTATION-STANDARD.md`.

## Design decisions (goal interrogation A–L CLOSED — full rationale in [meta/design-decisions.md](./meta/design-decisions.md))

- **Double-entry ledger** (DD-001): a transaction is an event of balanced legs summing to zero.
- **Signed-amount legs; account TYPE first-class** (DD-002).
- **Balances & net worth derived, never stored** (DD-003) — net-worth snapshots are the one exception (DD-016).
- **UI speaks money-in / money-out, never debit/credit** (DD-004).
- **Feed-less assets (house, car) via point-in-time Valuations** (DD-005); re-valued on-demand + soft staleness nudge (DD-018).
- **Bloomberg / market data out of scope** (DD-006).
- **Phasing: spine → bills → budgeting** (DD-007).
- **Naming = HML house style** (DD-008, **LOCKED** — `PrimaryKey`/`fk<Parent>`, PascalCase, `g_`/`gLIST_` globals, `calc_`, audit quad).
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

## Render program (layout-first articulation)

We articulate the app **layout-by-layout** via real HTML renders BEFORE writing tables, so each render surfaces the fields/value-lists/scripts the backend must define. Renders follow [../LAYOUT-RENDER-STANDARD.md](../LAYOUT-RENDER-STANDARD.md) (DD-R01–R06): the render IS the layout, behaves like FileMaker Browse mode, Excel-grid density, sized to the real layout, manifest-driven + generic, themed via one token block (provisional; see [../THEMING-INTEGRATION.md](../THEMING-INTEGRATION.md)).

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

Planning complete through the goal interrogation (A–L, DD-001–022). All decisions locked incl. HML naming (DD-008). **No tables built yet — by design.** Layout-first articulation underway (`GLOBAL_Settings`, `VALUE_Lists`); render standard + theme contract documented. Three source-of-truth indexes join on keys: layouts, relationships (TO graph), value-lists. See [meta/changelog.md](./meta/changelog.md) for the full trail + open threads.

## Workflow

Double-entry ledger: every event = balanced legs summing to zero; balances and net worth are derived, not stored. The UI shows money-in / money-out, never debit/credit. See [meta/architecture-notes.md](./meta/architecture-notes.md).

## Architecture Notes

See [meta/architecture-notes.md](./meta/architecture-notes.md) (model), [meta/design-decisions.md](./meta/design-decisions.md) (decision log), [meta/relationship-audit-model.md](./meta/relationship-audit-model.md) + [meta/value-list-tracking-model.md](./meta/value-list-tracking-model.md) (join/audit models), [../LAYOUT-RENDER-STANDARD.md](../LAYOUT-RENDER-STANDARD.md) + [../THEMING-INTEGRATION.md](../THEMING-INTEGRATION.md) (render + theme), [meta/changelog.md](./meta/changelog.md) (trail).

## Artifacts

| Date | Artifact | Link | Description |
|---|---|---|---|
| 2026-07-16 | VALUE_Lists render | [preview.html](./layouts/utility/LAYOUT-value-lists/preview.html) | Excel-grid master-detail value-list editor (status-style, GLOBALS panel). |
| 2026-07-16 | GLOBAL_Settings render | [preview.html](./layouts/utility/LAYOUT-global-variables/preview.html) | 315px 4-global settings skeleton. |
| 2026-07-15 | Planning brief v0.1 | HTML artifact (chat) | Double-entry explainer: the mechanic, debit/credit, the transfer problem, tools reframed, our phased plan. |
