# maw-budget — Next Build Spec (v0.1)

> One file per app, overwritten each build cycle. Version lives in this header, never in the filename.

## Scratch intake

- 2026-07-15: app scaffolded git-first from `_template-fmp-app`. Never in ClickUp.
- 2026-07-15 brainstorm: core job = **account / net-worth tracking + bill/subscription tracking**, budgeting later. Single user (Michael). Naming = HML_LLC style (clean PascalCase, drop legacy SCREAMING names).
- 2026-07-15 research pass (v0.1): benchmarked QuickBooks, YNAB/Monarch/Copilot/Actual, Firefly III, Maybe, GnuCash, and Bloomberg Terminal. Confirms the double-entry lean. Deep-dive below.

## Reference model deep-dive (researched 2026-07-15)

### QuickBooks (the accounting spine everyone copies)

- Core object is the **Chart of Accounts (COA)**: a typed list of every account, in 5 buckets: **Assets, Liabilities, Income (Revenue), Expenses, Equity.**
- Every transaction posts to **>= 2 accounts** and must balance (double-entry). Usually one side is a bank/card account, the other is a category (income/expense) account.
- Each account carries an **account type** (which report it feeds) plus a **detail type** (sub-classification). Getting the type right is what makes the reports correct.
- Takeaway for us: our "Categories" are really income/expense accounts, and our "Accounts" are asset/liability accounts. Same COA, two flavors.

### Budgeting apps (the UX layer, not the ledger)

- **YNAB** — zero-based / envelope: every dollar gets a job. Method-first. Budget layer sits ON TOP of an account ledger.
- **Actual Budget** — open-source YNAB clone, local-first, envelope model on a real ledger. Closest OSS pattern to steal for the budgeting phase.
- **Monarch** — dashboard / net-worth first, couples, broad institution sync. Best "what is happening across all my money" view.
- **Copilot** — Apple-only, AI categorization, beautiful. A UX lesson, not a data-model one.
- Takeaway: budgeting = a **derived layer** (assigned vs activity vs available, per category per month), NOT a separate ledger. Defer it, but do not model in a way that blocks it.

### Open-source accounting engines (the actual schema to copy)

- **Firefly III** — self-hosted. `TransactionGroup -> TransactionJournal (the event) -> Transaction (the legs)`. Legs reference an account and carry a signed amount; legs sum to 0. This is the pattern to steal.
- **Maybe** — OSS Mint/QB alternative; adds point-in-time **Valuations** for feed-less assets (house, car). We adopt this.
- **GnuCash** — classic strict double-entry desktop. Confirms the model, dated UX.

### Bloomberg Terminal (asked, but out of scope)

- What it is: a professional **market-data + analytics + trading** workstation. Real-time quotes, news, fixed-income/equity analytics, messaging, Excel add-in. Function-code driven (type a ticker + a function like `DES`, `GP`, `PORT`).
- Setup: a **subscription (~$30k/user/yr)**, delivered via "Bloomberg Anywhere" (software install + serial number + a **B-Unit** biometric 2FA device), with quarterly software updates.
- **Verdict: not relevant to maw-budget.** It tracks *markets*, not *your household ledger*. If a live portfolio / market view is ever wanted, that is a separate app (its own data feed, its own folder), never folded in here. Noted so the scope line is explicit.

## Money direction, signs, debit vs credit (the mental model)

- **Double-entry in plain terms:** every event moves money FROM one account TO another. Two legs, opposite signs, net zero.
- **Debit / credit** are just "left side / right side" of an entry, not "add / subtract." Their effect depends on account type:
  - **Assets & Expenses:** debit **increases**, credit **decreases**.
  - **Liabilities, Equity & Income:** credit **increases**, debit **decreases**.
- **Normal balances:** assets/expenses sit positive on the debit side; liabilities/income/equity sit positive on the credit side.
- **Our storage rule:** store each leg as a **signed amount** on an account; `+` moves that account's balance in its natural direction, `-` moves it back. The leg's category/type tells the viewer how to color and roll it up. We do NOT make the user think in debit/credit — the UI shows money-in / money-out; the ledger stays balanced underneath.
- **"Positive vs negative" as Michael sees it:**
  - Checking balance up = good (asset increased).
  - Credit-card balance up = you owe more (liability increased).
  - Same event ("balance went up") means opposite things depending on account type, which is exactly why account TYPE (asset vs liability) is a first-class field.

## Paying between banks & cards on one platform (the transfer problem)

This is the case a single-row model breaks, and the reason we go double-entry.

- **Transfer (Checking -> Savings):** ONE `TransactionGroup`, TWO legs: `-100` Checking, `+100` Savings. Not income, not expense. Nets to 0. No double-count.
- **Paying a credit card (Checking -> Visa):** ONE group, two legs: `-500` Checking (asset down), `+500` Visa (liability down, i.e. debt reduced). A card payment is a **transfer between your own accounts**, NOT an expense — the expense already posted when the card was swiped.
- **The swipe itself (buying $500 on the Visa):** `+500` on an Expense category, `-500` on the Visa (liability up).
- Net across both events: net worth dropped $500 at swipe time; paying the card just moves the liability off. Double-entry gets this exactly right; single-entry either double-counts or loses the transfer.

## Proposed spine (double-entry flavor, HML naming)

- **Institutions** -> **Accounts** (`fkInstitution`; typed asset/liability, on/off budget, `normalSign`)
- **TransactionGroups** (event: date, payee, memo) -> **TransactionLines** (legs: `fkAccount`, `fkCategory`, signed `amount`; must sum to 0 per group)
- **Categories** (self-referencing `fkParentCategory`; typed income/expense, envelope-ready)
- **ImportSessions** (`fkAccount`; stamps groups with provenance + dedup `rawHash`)
- **Valuations** (`fkAccount`; point-in-time worth for feed-less assets)
- **Bills** (recurring expected; = HML `ExpectedTransactions` pattern) — phase 2
- **BudgetAllocations** (category + month) — phase 3

**Derived, not stored:** account balance = sum of its legs (+ latest Valuation for feed-less assets). Net worth = sum of account balances. No separate engine.

## Phasing

- **Phase 1 (v1):** Institutions, Accounts, Categories, TransactionGroups, TransactionLines, ImportSessions, Valuations. Delivers: balances, net worth, transfers, card payments, spending by category.
- **Phase 2:** Bills (expected/recurring) + Bill<->actual match layer (HML `PaymentApplications` pattern).
- **Phase 3:** Budgeting layer (envelope, Actual/YNAB style): `BudgetAllocations`; Available = assigned - activity + rollover.
- **Out of scope v1:** investments, multi-currency, live market data (the Bloomberg-shaped thing is a separate app entirely).

## Next build

- Write the first table files + `schema/tables.json` around the spine above, ONCE the fork below is decided.

## In review (DECISION NEEDED to unblock)

- **Double-entry vs single-entry.** Recommendation: **double-entry.** Confirmed by the research pass — every serious reference tool (QuickBooks, Firefly III, GnuCash, Actual) is double-entry, and it is the only model that handles transfers + card payments without double-counting. Single-entry is less scaffold now but walls off transfers/splits and forces a painful rebuild later. **Michael to rule before any table is written.**

## Futures

- Budgeting layer (envelope model, YNAB/Actual style).
- Bill <-> actual-transaction match layer (= HML `PaymentApplications` pattern).
- Investments / multi-currency (Firefly + Maybe both model these; out of scope v1).
- Separate market-data app if a live portfolio / Bloomberg-style view is ever wanted.

## Known guardrails

- Repo is source of truth. One file per object. Calc formulas inline in their owning table file (DOCUMENTATION-STANDARD.md, 2026-07-15).
- Every object edit = branch -> PR -> self-merge.
