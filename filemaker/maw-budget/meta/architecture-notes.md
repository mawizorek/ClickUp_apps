# Architecture Notes — maw-budget

Git-first app: no ClickUp precursor. Source of truth is this repo from day one.

## Model: lightweight double-entry ledger

maw-budget is built on a **double-entry ledger** (the model behind QuickBooks, Firefly III, GnuCash, Actual). A transaction is not a single row — it is an **event** (`TransactionGroup`) made of balanced **legs** (`TransactionLines`) whose signed amounts sum to zero. Chosen deliberately over single-entry: it is the only model that represents transfers between your own accounts (bank->bank, checking->credit card) without double-counting, and it makes net worth fall out for free.

## Account types & sign convention

- Every `Account` carries a **type** (asset or liability). First-class, because "balance went up" means opposite things for a checking account (good) vs a credit card (more debt owed).
- Categories are effectively **income/expense accounts**; Accounts are **asset/liability accounts**. Same chart-of-accounts idea, two flavors.
- **Debit / credit** are left/right of an entry, not add/subtract. Effect by type: a debit increases assets & expenses and decreases liabilities/income/equity; a credit is the reverse.
- **Storage:** legs store a **signed amount**; the sign moves the owning account's balance in its natural direction. The UI speaks money-in / money-out, never "debit/credit" — the balancing happens underneath.

## Derived balances (no separate engine)

- Account balance = sum of its legs (plus the latest `Valuation` for feed-less assets like a house or car).
- Net worth = sum of all account balances.
- Nothing summable is stored; balances and net worth are always calculated.

## Transfers & card payments

- **A transfer or card payment is a two-leg event between your own accounts, not income/expense.** Paying a Visa from Checking is `-` Checking (asset down) and `+` Visa (liability down); the expense already posted when the card was swiped. This single behavior is what justifies the whole double-entry choice.

## Out of scope (explicit)

- **Bloomberg Terminal / market data.** Bloomberg is a market-data + analytics + trading workstation (subscription-grade, B-Unit 2FA, function-code UI). It tracks markets, not a household ledger. If a live portfolio / market view is ever wanted, it is a separate app with its own feed and folder, never folded into maw-budget.
- Investments, multi-currency: deferred past v1.

See `../next-build-spec.md` for the current spine, phasing, and the open double-entry decision.
