# Layouts

One file per layout, mirroring *Manage Layouts*. Manifest: `_index.json`. Each layout below is a **functional role** — exact FileMaker layout names/parts/objects are PENDING a DDR pass.

## Layout philosophy

- **Property-first UX / loan-first schema.** Layouts organize around the navigation the user performs (start at a property, drill into its loan), even though the model parents financial records on `Loans`. See `../meta/design-decisions.md` + `../meta/architecture-notes.md`.
- **Desktop + mobile.** v1 must demo on both, using the shared component/theme system.
- **Component-driven.** Built from the locked HML object families (cards, property bar, pills, buttons, tables, tab switcher, form elements, verification/utility boxes). Design language of record: ClickUp subtask HMLLC-2735 (done).

## Core layout set (v1)

| File | Role | Primary TO / context |
|---|---|---|
| [property-hub.md](./property-hub.md) | Entry point; navigate by property, drill into loan | PropertySUMMARIES |
| [loan-detail.md](./loan-detail.md) | Financial parent view; terms, status, entry to txns + payoff | Loans |
| [transactions.md](./transactions.md) | Expected vs Actual ledgers; tab switcher, filter/status pills | Loans → Expected/Account |
| [payment-application.md](./payment-application.md) | Apply a receipt against expected item(s); verification box | PaymentApplications |
| [payoff.md](./payoff.md) | Generate + freeze a payoff snapshot | Payoffs |
| [document-binder.md](./document-binder.md) | Document source of truth (parked for v1) | Documents |
| [global-setup.md](./global-setup.md) | Behind-the-scenes control layer | GLOBAL_USE_VARIABLES |

## Design language reference

Surfaces: cream page (`#F5F1EA`), paper cards (`#FDFCFA`), warm-gray secondary (`#EDE9E3`). Accent = purple property bar (`#7B3FA0`). Type = Gabarito (UI) + IBM Plex Mono (data). Status colors: red = late/fee, green = paid, gold = outstanding/upcoming-due, purple = interest/upcoming. Full spec: HMLLC-2735.

## Pending from the FileMaker file

- Exact FileMaker layout names + layout folder structure.
- Layout parts (header / body / footer / sub-summary) per layout.
- Object-level inventory + which component family each object uses.
- Portal + tab-control configs on Transactions and Payoff.
- Mobile-specific variants vs responsive single-layout approach.
