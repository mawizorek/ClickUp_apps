# maw-budget — Next Build Spec (v0.3)

> One file per app, overwritten each build cycle. Version lives in this header, never in the filename.

## Scratch intake

- 2026-07-15: app scaffolded git-first from `_template-fmp-app`. Never in ClickUp.
- 2026-07-15 brainstorm: core job = **account / net-worth tracking + bill/subscription tracking**, budgeting later. Single user (Michael). Naming = HML_LLC style.
- 2026-07-15 research pass (v0.1): benchmarked QuickBooks, YNAB/Monarch/Copilot/Actual, Firefly III, Maybe, GnuCash, Bloomberg. Confirmed double-entry. Deep-dive below.
- 2026-07-15 (v0.2): **double-entry RULED IN.** Foundational calls locked. Goal interrogation opened.
- 2026-07-15 (v0.2, inquiry): **A, B, C, D** captured; **L** raised.
- 2026-07-15 (v0.3, inquiry): **E, F, G** captured; **L resolved** (party-as-receivable, live view, Phase 1). Prior-art found: URITP BETA BUDGET space + Venmo CSV. Remaining: H, I, J, K + DD-008 naming.

## Locked decisions (see `meta/design-decisions.md` for the why)

- **DD-001 Double-entry ledger** — events of balanced legs summing to zero.
- **DD-002 Signed-amount legs; account TYPE first-class** — sign×type drives net worth.
- **DD-003 Derived balances & net worth** — never stored (snapshot is the one sanctioned exception, DD-016).
- **DD-004 UI speaks money-in/out**, never debit/credit.
- **DD-005 Feed-less assets via Valuations** (house, car).
- **DD-006 Bloomberg / market data OUT** — separate app if ever.
- **DD-007 Phasing** — spine → bills → budgeting.
- **DD-008 Naming = HML style** (PROVISIONAL — confirm before first table).
- **DD-009 Single user.**
- **DD-011 Full account-type coverage** — every account class (see A).
- **DD-012 CSV import + manual entry, ~weekly** — Phase 1 (see B). Prior art: Venmo CSV.
- **DD-013 Reimbursements = receivables**, packaging RESOLVED → party-as-receivable-account, live "who owes me" view, Phase 1 (see L).
- **DD-014 Hierarchical categories** — parent → child tree; rollups for free (see C).
- **DD-015 Multi-category splits** — N legs on one event (see D).
- **DD-016 Net worth over time** — `NetWorthSnapshot` table; trend chart; autonomous capture TABLED (see E).
- **DD-017 Bills = expected-vs-actual, variable, soft forecasting** — Phase 2 (see G).
- **DD-018 Valuation cadence = on-demand + soft staleness nudge** (PROVISIONAL, see F).

## Reference model deep-dive (researched 2026-07-15)

### QuickBooks (the accounting spine everyone copies)

- Core object is the **Chart of Accounts (COA)**: typed accounts in 5 buckets — **Assets, Liabilities, Income, Expenses, Equity.**
- Every transaction posts to **>= 2 accounts** and must balance. One side is usually a bank/card account, the other a category (income/expense) account.
- Each account carries an **account type** (which report it feeds) + a **detail type**.
- Takeaway: our "Categories" = income/expense accounts; "Accounts" = asset/liability accounts. **Receivables = another asset type** (DD-013). QuickBooks sub-accounts = our hierarchical categories (DD-014).

### Budgeting apps (the UX layer, not the ledger)

- **YNAB** — zero-based / envelope; sits ON TOP of an account ledger. Category **groups** = our parent categories.
- **Actual Budget** — OSS YNAB clone, envelope on a real ledger. Closest pattern for the budgeting phase.
- **Monarch** — net-worth dashboard, broad sync. The "watch it all" view (relevant to DD-016).
- **Copilot** — Apple-only, AI categorization. UX lesson, not data-model.
- Takeaway: budgeting = a **derived layer** (assigned/activity/available per category per month), NOT a separate ledger.

### Open-source accounting engines (the schema to copy)

- **Firefly III** — `TransactionGroup -> journal -> legs`, sum to 0. The pattern we steal. Splits = extra legs; reimbursements = a party account you carry a balance against.
- **Maybe** — point-in-time **Valuations** for feed-less assets (DD-005). Also does net-worth-over-time (DD-016).
- **GnuCash** — strict double-entry. Confirms the model.

### Bloomberg Terminal (out of scope — DD-006)

- Market-data + analytics + trading workstation (~$30k/yr, B-Unit 2FA, function-code UI). Tracks markets, not a household ledger. Separate app if ever.

## Money direction, signs, debit vs credit (the mental model)

- Every event moves money FROM one account TO another. Legs, opposite signs, net zero.
- **Debit / credit = left / right of an entry, not add / subtract.** Assets & Expenses: debit increases. Liabilities, Equity & Income: credit increases.
- **Storage (DD-002):** each leg is a **signed amount**; the account's type says what the sign means for net worth. User never sees debit/credit (DD-004).

## Worked examples (the cases that justify double-entry)

- **Transfer (Checking → Savings):** `-100` Checking, `+100` Savings. Nets to 0.
- **Card payment (Checking → Visa):** `-500` Checking (asset down), `+500` Visa (liability down). A transfer, NOT an expense — expense posted at swipe.
- **The swipe ($500 on Visa):** `+500` Expense, `-500` Visa (liability up).
- **Split (Target, $120 on Visa):** `-120` Visa, `+60` Groceries, `+40` Household, `+20` Clothing. Sums to 0 (DD-015).
- **Reimbursement (front $100 for dad):** `+100` category, `-100` "Due from Dad" (receivable up). When he pays: `+100` Checking, `-100` "Due from Dad" (clears). Net worth never overstated (DD-013).

## Proposed spine (double-entry flavor, HML naming) — SHAPE ONLY, not final fields

> Object shape we're committing to conceptually. **Field lists are NOT written here** — they come in the dedicated field-articulation session after the inquiry closes.

- **Institutions** -> **Accounts** (`fkInstitution`; typed asset/liability/**receivable**, on/off budget, normal sign)
- **Parties** (Dad, UofR, gig clients) — receivable `Account`s carry a running "owed" balance (DD-013, resolved)
- **TransactionGroups** (event: date, payee, memo) -> **TransactionLines** (legs: `fkAccount`, `fkCategory`, signed `amount`; **N legs, sum to 0**)
- **Categories** (`fkParentCategory` tree, DD-014; typed income/expense, envelope-ready)
- **ImportSessions** (`fkAccount`; provenance + dedup `rawHash`)
- **Valuations** (`fkAccount`; point-in-time worth for feed-less assets; on-demand cadence, DD-018)
- **NetWorthSnapshot** (date + total [+ optional per-account]; trend history, DD-016)
- **Bills** (recurring expected: payee, category, expected amount, schedule, next-due) — phase 2 (DD-017)
- **BudgetAllocations** (category + month) — phase 3

**Derived, not stored:** account balance = sum of its legs (+ latest Valuation). Net worth = sum of balances. Category spend rolls up the tree. (Snapshots are the one frozen exception.)

## Phasing (DD-007)

- **Phase 1 (v1):** Institutions, Accounts (incl. receivables), Categories, TransactionGroups, TransactionLines, ImportSessions, Valuations, NetWorthSnapshot. Delivers balances, net worth + trend, transfers, card payments, splits, spend by category, live "who owes me," CSV import, split editor.
- **Phase 2:** Bills (expected-vs-actual, variable, soft schedule flags) + bill↔actual match (HML `ExpectedTransactions`/`PaymentApplications`). Reimbursement auto-clear can share this layer.
- **Phase 3:** Budgeting (envelope, Actual/YNAB): `BudgetAllocations`; Available = assigned - activity + rollover.
- **Out of scope v1:** investments, multi-currency, live market data.
- **Tabled automation:** autonomous net-worth snapshot capture (on-open / Monday 9a) — Futures, not v1.

## Open inquiry — goal interrogation (ANSWER BEFORE ANY TABLE) 🔍

**A. Accounts. ✅** every account class (→ DD-011). Follow-ups (non-blocking): counts per type; on-budget flag per account.

**B. Intake. ✅** CSV import + manual, ~weekly (→ DD-012). Prior art: Venmo CSV (Chase/Capital One/Venmo). First mapping target.

**C. Categories. ✅** hierarchical parent → child (→ DD-014). Working depth 2.

**D. Splits. ✅** yes, N-leg splits (→ DD-015). Needs split-editor UI, Phase 1.

**E. Net worth over time. ✅** trend, via `NetWorthSnapshot` (→ DD-016). Autonomous capture (on-open / Mon 9a) tabled to Futures.

**F. Valuation cadence. ✅** on-demand + soft staleness nudge (→ DD-018, PROVISIONAL). A valuation = "what's this worth today, roughly"; update occasionally, it feeds net worth until you change it.

**G. Bills. ✅** a bill = a recurring expected outflow on a schedule (rent, utilities, subs). **Variable** expected amount + actual once paid; **soft** forecasting via visual flags on a clear schedule; Phase 2 (→ DD-017).

**L. Reimbursements. ✅ RESOLVED** party-as-receivable-account, **live "who owes me" view, Phase 1** (→ DD-013). Gig income ≠ reimbursement (confirmed vs real Venmo data).

**H. Budgeting model (phase 3).** True envelope (assign every dollar) or simpler target-vs-actual per category? Should unspent roll over month to month?

**I. Reports — the 3 you'd actually open.** Net-worth trend? Monthly spend by category? Account register? Cash-flow in/out? "Who owes me"? Rank them.

**J. Reconciliation.** Reconcile against real statements (mark cleared vs pending)? Adds a `cleared`/statement concept to lines.

**K. Platform reach.** FileMaker Pro desktop only, or also FileMaker Go on iPhone/iPad?

## Prior art — existing ClickUp budget space (2026-07-15)

Michael already runs a rough version in ClickUp: the **URITP BETA BUDGET** space (money) + a **Venmo** list (`Journal Entry` task type: NOTES, created name, Date Posted, Amount) + a combined Venmo CSV statement. Scattered and non-cohesive (his words), but useful:
- **Validates the model against real data:** dad (Joseph J. Wizorek) transfers = the reimbursement/support pattern; Alarm Will Sound + drafting clients = gig income; Chase + Capital One + Venmo balance = multiple funding sources on one CSV.
- **First CSV mapping target** for the Phase 1 importer (DD-012).
- **Migration note:** the field-articulation session should look at what's already captured there before finalizing fields, and plan a one-time import path. Do NOT treat the ClickUp space as the long-term home — maw-budget (FileMaker) is.

## Next build (BLOCKED until inquiry answered)

- Remaining inquiry: **H, I, J, K**. Plus resolve DD-008 naming.
- THEN: fresh agent session to articulate real fields per object, writing `tables/` files + `schema/tables.json` off these answers.

## Futures

- Autonomous net-worth snapshot capture (on-open / weekly).
- Budgeting layer (envelope, YNAB/Actual).
- Bill↔actual auto-match + reimbursement auto-clear.
- Investments / multi-currency (out of scope v1).
- Separate market-data app if a live portfolio view is ever wanted.

## Known guardrails

- Repo is source of truth. One file per object. Calc formulas inline in their owning table file.
- Every object edit = branch -> PR -> self-merge.
