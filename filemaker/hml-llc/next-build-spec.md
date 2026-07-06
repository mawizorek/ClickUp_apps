# HML_LLC — Next Build Spec (v1)

> One file, overwritten each cycle. Version in this header, not the filename.

## Scratch intake

- Migration of docs from ClickUp into this repo folder (Phase 1 of the FileMaker window rollout).

## Next build

- Finish canonical schema lock: remaining rename/normalize items (see `docs/changelog.md`).
- Build the Global Setup utility layer (HMLLC-2737, prepared).
- Build Loans / Payoffs / PaymentInstructions infrastructure (HMLLC-2738, prepared).
- Implement property intake, import, and output workflows (HMLLC-2739, open).

## In review

- `PaymentInstructions` record-based rebuild (signature: container vs document-module reference).

## Futures

- Reporting layer beyond core lifecycle.
- Two-way ClickUp sync (explicitly NOT v1).
- Phase 3: script notes as source files.

## Known guardrails

- Property-first UX, loan-first schema. Do not re-parent transactions onto Property.
- Payoffs are frozen snapshots; never recompute an issued payoff.
- One-way publish (FileMaker -> ClickUp) only in v1; button-driven, no middleware.
- Single file, single user, local-first unless a real constraint forces a split.
