# Design Decisions

> Migrated from the HML_LLC Design Constitution (ClickUp). Git is canonical.

## Architecture stance

- Current top-priority build.
- **Property-first UX / loan-first schema.** User navigates by property; the model treats loans as the real financial parent.
- Single-user, local-file-first, one file unless a later constraint justifies a split.

## Document & binder philosophy

- **Binder = document source of truth.** Payoff history is versioned and frozen.
- One parent receipt/payment may allocate across multiple loans/properties.
- FileMaker owns property + payment truth; ClickUp owns human operational workflow.

## Integration boundary

- One-way publish first: FileMaker → ClickUp.
- No two-way sync in v1.
- Button-driven manual publish before any middleware or webhook layer.

## Build priorities

- Prove the core loan lifecycle (property summary → loan → transactions → payoff) before reporting or multi-user.
- Keep artifact/theme work constrained to the shared HML object families documented in Filemaker Home.

## Schema-lock rulings (from HMLLC-2740)

- `Loans` created as the real servicing parent; loan terms re-homed off `PropertySUMMARIES`.
- `_PAYMENT_ASSIGNMENTS` rebuilt as `PaymentApplications` (real join purpose).
- `Payoffs` created as a real table; payoff numbers frozen.
- `_Payment_Instructions` rebuilt as a real record-based table (out of fake-globals).
- `Account Calculations` logic folded into canonical tables / TO-context calcs, then retired.
- `Standard_Transactions` treated as taxonomy, not a value list.
