# HML_LLC — Hard Money Loan LLC (FileMaker App)

**Status:** Pilot / migrating · **reference implementation for the repo-native docs model** · **Runs in:** FileMaker Pro (2026) · **Source of truth:** this repo folder (see [INDEX.md](./INDEX.md))

Servicing system for a hard money lending LLC: tracks properties, loans, expected vs. actual transactions, payment applications, and frozen payoffs. First app migrated onto the one-file-per-object mirror ([DOCUMENTATION-STANDARD.md](../DOCUMENTATION-STANDARD.md)).

---

## Next Steps

- Finish the canonical schema lock (a handful of field/rename items still open — see per-table **Open Items** and `meta/changelog.md`).
- Build the Global Setup utility layer.
- Build Loans / Payoffs / PaymentInstructions infrastructure.
- Implement property intake, import, and output workflows.
- Enumerate real script + function inventory into `scripts/` and `functions/` (only `commitRecord` + JSON helpers documented so far).

## Open Questions

- `SETUP_LLC`: separate table, or merge file-wide setup into `GLOBAL_USE_VARIABLES`?
- Company-side table scope: `Organizations` (broader) vs `Borrowers` (borrower-only). Leaning `Organizations`.
- `Documents` + child `DocumentVersions`, or file storage directly on `Documents` for v1?
- Retire/archive `XXval_*`, `xwork_Notes`, `zOld_FileFOLDERS` out of the active core graph.
- Naming: HML uses `PrimaryKey`/`fk<Parent>`; URITP uses `pk_`/`fk_`. Reconcile house style?

## Purpose

A credible v1 demonstrating the full loan lifecycle (property summary → loan → transactions → payoff) on desktop and mobile before the FileMaker 2026 trial ends. FileMaker owns property + payment truth; ClickUp owns human operational workflow.

## Goals

- Prove the core loan lifecycle end to end before expanding into reporting or multi-user.
- Property-first UX, loan-first schema.
- Binder = document source of truth; payoff history versioned and frozen.

## Imports

- Property + loan intake (property summary → loan record).
- Payment/receipt intake, where one parent receipt may allocate across multiple loans/properties.

## Reports / Exports

- Payoff statements (frozen snapshots).
- Servicing / transaction reporting, university-admin-level professionalism even though internal.
- One-way publish first: FileMaker → ClickUp. No two-way sync in v1.

## Build Status

Active top-priority build (~22h tracked). Theme components done. Schema lock nearly complete (per-table files carry remaining open items). Global Setup + servicing infrastructure prepared/in progress. Property intake open. Target: v1 demoable with ~1 week buffer before trial end.

## Workflow

Navigate by property → drill into the loan (the real financial parent) → view expected vs. actual transactions → apply payments → generate/freeze a payoff. Manual button-driven publish to ClickUp.

## Architecture Notes

See `meta/architecture-notes.md`. Highlights: property-first UX / loan-first schema; single-user, local-file-first, one file; binder = document source of truth; payoff history frozen; one-way publish (FileMaker → ClickUp) first.

## Artifacts

| Date | Artifact | Link | Description |
|---|---|---|---|
| 2026-06-08 | Theme components | ClickUp subtask HMLLC-2735 | Full object/component design system (done) |
| 2026-06-14 | Schema lock working set | ClickUp subtask HMLLC-2740 | 52 graph screenshots + canonical stack decisions |

---

**Related:** ClickUp build task HMLLC-2731 · HML_LLC Design Constitution (in `meta/design-decisions.md`). Legacy 11-page docs remain under `docs/` and are being absorbed into the mirror; see `meta/README.md`.
