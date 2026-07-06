# Layouts

> The 3rd of the 11 standard documentation subpages. Structured schema lives in [`../schema/`](../schema/); this page documents the **screens** (FileMaker layouts) that render that schema. Full layout-object inventory is **PENDING** from the FileMaker file (share DDR / layout captures to enumerate exact objects, parts, and object names).

## Layout philosophy

- **Property-first UX / loan-first schema.** Layouts are organized around the navigation the user actually performs (start at a property, drill into its loan), even though the data model parents financial records on `Loans`. See [`design-decisions.md`](./design-decisions.md) and [`architecture-notes.md`](./architecture-notes.md).
- **Desktop + mobile.** v1 must demo on both. Layouts use the shared component/theme system so they scale across form factors.
- **Component-driven.** All layouts are built from the locked HML object families (cards, property bar, pills, buttons, tables, tab switcher, form elements, verification/utility boxes). The component system is documented in ClickUp subtask HMLLC-2735 (done) and should be treated as the layout design language of record.

## Core layout set (intended for v1)

> Names below are functional roles, not confirmed FileMaker layout names. Confirm/rename against the file on the next DDR pass.

| Layout (role) | Primary TO / context | Purpose |
|---|---|---|
| Property Hub | `PropertySUMMARIES` | Entry point. Navigate by property; property bar + document-type pills; drill into the property's loan. |
| Loan Detail | `Loans` | The financial parent view. Loan terms, servicing status, entry to transactions + payoff. |
| Transactions (Expected vs. Actual) | `Loans` → `ExpectedTransactions` / `AccountTransactions` | View-tab switcher between expected and actual ledgers; filter pills; status pills; apply payments. |
| Payment Application | `PaymentApplications` | Apply an account transaction against expected transaction(s); verification box confirms the math. |
| Payoff | `Payoffs` | Generate + freeze a payoff snapshot; pulls a `PaymentInstructions` snapshot at issue time. |
| Document Binder | `Documents` (parked module) | Document source of truth; binder view of loan/property docs. Parked for v1 unless needed. |
| Global Setup / utility | `GLOBAL_USE_VARIABLES` | Behind-the-scenes control layer (device mode, current-context globals, setup). HMLLC-2737. |

## Design language reference

Surfaces: cream page (`#F5F1EA`), paper cards (`#FDFCFA`), warm-gray secondary (`#EDE9E3`). Accent = purple property bar (`#7B3FA0`). Type = Gabarito (UI) + IBM Plex Mono (data). Status colors: red = late/fee, green = paid, gold = outstanding/upcoming-due, purple = interest/upcoming. Full spec in HMLLC-2735.

## Pending from the FileMaker file

- Exact FileMaker layout names + layout folder structure.
- Layout parts (header / body / footer / sub-summary) per layout.
- Object-level inventory and which component family each object uses.
- Portal + tab-control configurations on Transactions and Payoff.
- Mobile-specific layout variants vs. responsive single-layout approach.
