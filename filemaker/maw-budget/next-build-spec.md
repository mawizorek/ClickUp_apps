# maw-budget — Next Build Spec (v0)

> One file per app, overwritten each build cycle. Version lives in this header, never in the filename.

## Scratch intake

- 2026-07-15: app scaffolded git-first from `_template-fmp-app`. Never in ClickUp.
- 2026-07-15 brainstorm: core job = **account / net-worth tracking + bill/subscription tracking**, budgeting later. Single user (Michael). Naming = HML_LLC style (clean PascalCase, drop legacy SCREAMING names).

## Core direction (researched 2026-07-15)

Don't reinvent the wheel — base the model on the open-source QuickBooks/Mint alternatives. Reference tools + how they're built:

- **QuickBooks alternatives (personal):** Maybe (open-source Mint/QB killer), Firefly III (self-hosted), GnuCash. **All double-entry.**
- **Budgeting dashboards:** YNAB, Actual Budget (open-source YNAB clone). Envelope budgeting layered on a ledger.

**Key steal: lightweight double-entry.** A transaction is NOT one row — it's an event with balanced legs summing to zero.

- Firefly pattern: `TransactionGroup` → `TransactionJournal` (the event) → `Transaction` (the legs; each references an account; legs balance to 0).
- Wins transfers (Checking→Savings = one group, two legs), paycheck/category splits, and mixed-category purchases for free — all of which break a single-row model.
- **Net worth falls out free:** account balance = sum of its legs; net worth = sum of account balances. No separate engine.
- Feed-less assets (house, car) get point-in-time **Valuations/Snapshots** (Maybe's pattern; matches the BalanceSnapshots instinct).
- Budgeting layer (deferred): `BudgetAllocation` = category + month + amount assigned. Activity derived from category legs per month; Available = assigned − activity + rollover.

## Proposed spine (double-entry flavor, HML naming)

- **Institutions** → **Accounts** (`fkInstitution`; typed asset/liability, on/off budget)
- **TransactionGroups** (event: date, payee, memo) → **TransactionLines** (legs: `fkAccount`, `fkCategory`, signed amount; must sum to 0 per group)
- **Categories** (self-referencing `fkParentCategory`, envelope-ready)
- **ImportSessions** (`fkAccount`; stamps groups w/ provenance + dedup `rawHash`)
- **Valuations** (`fkAccount`; point-in-time worth for feed-less assets)
- **Bills** (recurring expected; = HML `ExpectedTransactions` pattern) — phase 2
- **BudgetAllocations** (category + month) — phase 2

## Next build

- Write the first table files + `schema/tables.json` around the spine above, ONCE the fork below is decided.

## In review (DECISION NEEDED to unblock)

- **Double-entry vs single-entry.** Brain leans **double-entry** (correct for transfers between own accounts, no rebuild later; slightly more scaffold now). Single-entry is simpler but walls off transfers/splits. Michael to rule before any table is written.

## Futures

- Budgeting layer (envelope model, YNAB/Actual style).
- Bill ↔ actual-transaction match layer (= HML `PaymentApplications` pattern).
- Investments / multi-currency (Firefly + Maybe both model these; out of scope v1).

## Known guardrails

- Repo is source of truth. One file per object. Calc formulas inline in their owning table file (DOCUMENTATION-STANDARD.md, 2026-07-15).
- Every object edit = branch → PR → self-merge.
