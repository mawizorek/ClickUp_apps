# maw-budget — Next Build Spec (v0.2)

> One file per app, overwritten each build cycle. Version lives in this header, never in the filename.

## Scratch intake

- 2026-07-15: app scaffolded git-first from `_template-fmp-app`. Never in ClickUp.
- 2026-07-15 brainstorm: core job = **account / net-worth tracking + bill/subscription tracking**, budgeting later. Single user (Michael). Naming = HML_LLC style (clean PascalCase, drop legacy SCREAMING names).
- 2026-07-15 research pass (v0.1): benchmarked QuickBooks, YNAB/Monarch/Copilot/Actual, Firefly III, Maybe, GnuCash, and Bloomberg Terminal. Confirmed the double-entry lean. Deep-dive below.
- 2026-07-15 (v0.2): **double-entry RULED IN by Michael.** Fork closed. Foundational design calls locked in `meta/design-decisions.md`. Now interrogating goals (below) BEFORE any table is written — no field-guessing.
- 2026-07-15 (v0.2, inquiry): answers **A**, **B**, **C**, **D** captured; **L** raised (reimbursements → DD-013). Import (CSV), hierarchical categories, and splits confirmed.

## Locked decisions (see `meta/design-decisions.md` for the why)

- **DD-001 Double-entry ledger** — events of balanced legs summing to zero.
- **DD-002 Signed-amount legs; account TYPE first-class** — sign×type drives net worth.
- **DD-003 Derived balances & net worth** — never stored.
- **DD-004 UI speaks money-in/out**, never debit/credit.
- **DD-005 Feed-less assets via Valuations** (house, car).
- **DD-006 Bloomberg / market data OUT** — separate app if ever.
- **DD-007 Phasing** — spine → bills → budgeting.
- **DD-008 Naming = HML style** (PROVISIONAL — confirm before first table).
- **DD-009 Single user.**
- **DD-011 Full account-type coverage** — model supports every account class (see A).
- **DD-012 CSV import + manual entry, ~weekly** — import tooling is Phase 1 (see B).
- **DD-013 Reimbursements = receivables** — parties owed-by tracked as receivable accounts; gig income is separate (see L).
- **DD-014 Hierarchical categories** — self-referencing parent → child tree; rollups for free (see C).
- **DD-015 Multi-category splits** — N legs on one event; a split is just more legs (see D).

## Reference model deep-dive (researched 2026-07-15)

### QuickBooks (the accounting spine everyone copies)

- Core object is the **Chart of Accounts (COA)**: a typed list of every account, in 5 buckets: **Assets, Liabilities, Income (Revenue), Expenses, Equity.**
- Every transaction posts to **>= 2 accounts** and must balance (double-entry). Usually one side is a bank/card account, the other is a category (income/expense) account.
- Each account carries an **account type** (which report it feeds) plus a **detail type** (sub-classification).
- Takeaway: our "Categories" are really income/expense accounts, and our "Accounts" are asset/liability accounts. Same COA, two flavors. **Receivables ("owed to me") are just another asset account type** — see DD-013. QuickBooks sub-accounts = our hierarchical categories (DD-014).

### Budgeting apps (the UX layer, not the ledger)

- **YNAB** — zero-based / envelope: every dollar gets a job. Method-first, sits ON TOP of an account ledger. Category **groups** = our parent categories (DD-014).
- **Actual Budget** — open-source YNAB clone, local-first, envelope model on a real ledger. Closest OSS pattern for the budgeting phase.
- **Monarch** — dashboard / net-worth first, couples, broad sync. Best "what is happening across all my money" view.
- **Copilot** — Apple-only, AI categorization, beautiful. A UX lesson, not a data-model one.
- Takeaway: budgeting = a **derived layer** (assigned vs activity vs available, per category per month), NOT a separate ledger.

### Open-source accounting engines (the actual schema to copy)

- **Firefly III** — `TransactionGroup -> TransactionJournal (the event) -> Transaction (the legs)`. Legs reference an account, carry a signed amount, sum to 0. The pattern we steal. Splits = extra legs (DD-015). (Firefly models reimbursements exactly this way: a revenue/expense party account you carry a balance against.)
- **Maybe** — adds point-in-time **Valuations** for feed-less assets. Adopted (DD-005).
- **GnuCash** — classic strict double-entry desktop. Confirms the model.

### Bloomberg Terminal (asked, but out of scope — DD-006)

- A professional **market-data + analytics + trading** workstation. Real-time quotes, news, analytics, Excel add-in, function-code UI (`DES`, `GP`, `PORT`).
- Setup: subscription (~$30k/user/yr) via "Bloomberg Anywhere" (install + serial + **B-Unit** biometric 2FA), quarterly updates.
- **Not relevant to maw-budget.** Tracks markets, not a household ledger. A live portfolio/market view, if ever wanted, is a separate app.

## Money direction, signs, debit vs credit (the mental model)

- **Double-entry in plain terms:** every event moves money FROM one account TO another. Two legs (or more), opposite signs, net zero.
- **Debit / credit = left / right of an entry, not add / subtract.** Effect depends on account type:
  - **Assets & Expenses:** debit **increases**, credit **decreases**.
  - **Liabilities, Equity & Income:** credit **increases**, debit **decreases**.
- **Storage rule (DD-002):** store each leg as a **signed amount**; the account's type tells the viewer what the sign means for net worth. The user never sees debit/credit (DD-004).
- **"Positive vs negative" as Michael sees it:** checking up = good (asset up); Visa balance up = you owe more (liability up). Same direction, opposite meaning → type is first-class.

## Paying between banks & cards on one platform (the transfer problem)

The case a single-row model breaks — the reason for DD-001.

- **Transfer (Checking -> Savings):** ONE group, TWO legs: `-100` Checking, `+100` Savings. Not income/expense. Nets to 0.
- **Paying a credit card (Checking -> Visa):** ONE group: `-500` Checking (asset down), `+500` Visa (liability down). A card payment is a **transfer between your own accounts**, NOT an expense — the expense posted at swipe.
- **The swipe (buying $500 on the Visa):** `+500` Expense category, `-500` Visa (liability up).
- **Split purchase (Target run, $120 on the Visa):** ONE group, FOUR legs: `-120` Visa, `+60` Groceries, `+40` Household, `+20` Clothing. Still sums to zero. A split is just more legs (DD-015).
- **Reimbursement (front $100 for dad):** ONE group: `+100` expense/category, `-100` "Due from Dad" (receivable, asset up = he owes you). When dad pays you: `+100` checking, `-100` "Due from Dad" (receivable clears). Net worth is never overstated. Same mechanic as a transfer, just against a party account (DD-013).
- Net worth dropped $500 at swipe; paying the card just moves the liability off. Double-entry gets this exactly right; single-entry double-counts or loses the transfer.

## Proposed spine (double-entry flavor, HML naming) — SHAPE ONLY, not final fields

> This is the object shape we're committing to conceptually. **Field lists are deliberately NOT written here** — they come after the Open inquiry below is answered, in a dedicated field-articulation session.

- **Institutions** -> **Accounts** (`fkInstitution`; typed asset/liability/**receivable**, on/off budget, normal sign)
- **Parties** (payers/payees you track a running balance against: Dad, UofR, gig clients) — shape TBD by inquiry L; may be modeled as receivable Accounts rather than a separate table
- **TransactionGroups** (event: date, payee, memo) -> **TransactionLines** (legs: `fkAccount`, `fkCategory`, signed `amount`; **N legs, sum to 0 per group** — splits per DD-015)
- **Categories** (self-referencing `fkParentCategory`, parent → child tree per DD-014; typed income/expense, envelope-ready)
- **ImportSessions** (`fkAccount`; provenance + dedup `rawHash`)
- **Valuations** (`fkAccount`; point-in-time worth for feed-less assets)
- **Bills** (recurring expected) — phase 2
- **BudgetAllocations** (category + month) — phase 3

**Derived, not stored:** account balance = sum of its legs (+ latest Valuation). Net worth = sum of balances. Category spend rolls up the tree (DD-014).

## Phasing (DD-007)

- **Phase 1 (v1):** Institutions, Accounts, Categories, TransactionGroups, TransactionLines, ImportSessions, Valuations. Delivers balances, net worth, transfers, card payments, splits, spend by category. **Import (CSV) is in v1 per DD-012.** Split editor is a Phase 1 UI concern (DD-015). Reimbursement receivables likely land here too (pending L).
- **Phase 2:** Bills (expected/recurring) + Bill<->actual match (HML `PaymentApplications` pattern). Reimbursement↔payment matching may share this layer.
- **Phase 3:** Budgeting layer (envelope, Actual/YNAB style): `BudgetAllocations`; Available = assigned - activity + rollover.
- **Out of scope v1:** investments, multi-currency, live market data.

## Open inquiry — goal interrogation (ANSWER BEFORE ANY TABLE) 🔍

> The point of this pass: pressure-test what the app is actually FOR, so fields are derived from real goals, not guessed. Each answer feeds directly into the field-articulation session.

**A. Account inventory. ✅ ANSWERED (2026-07-15):** track **every account class** — checking, savings, each card, cash, loans/mortgage, retirement, house, car (→ DD-011). Follow-ups (non-blocking): actual counts per type; on-budget vs net-worth-only flag per account (→ `Account` carries an on-budget boolean).

**B. Data intake. ✅ ANSWERED (2026-07-15):** **CSV import** primary + **manual steps**, ~weekly (→ DD-012). `ImportSessions` + per-account CSV column-mapping + `rawHash` dedup are Phase 1. Follow-up: sample CSV per bank when building the mapper.

**C. Categories. ✅ ANSWERED (2026-07-15):** **hierarchical, parent → child** (→ DD-014). Self-referencing `fkParentCategory`, income/expense typed, rollups for free. Working depth = 2 levels (confirm if arbitrary depth wanted). Exact category list is data, gathered at entry time.

**D. Splits. ✅ ANSWERED (2026-07-15):** **yes, multi-category splits** (→ DD-015). One purchase across several categories = N legs on one `TransactionGroup`, still summing to zero. No new table; needs a split-editor UI in Phase 1.

**L. Reimbursements. ✅ RAISED (2026-07-15):** track money fronted and paid back by **dad, U of R, gig-work payers, one-offs** (→ DD-013). Modeled as a **receivable** ("owed to me"), not a special expense flag. Open sub-questions:
- Default packaging: **(a)** party-as-receivable-account (carry a running "Due from X" balance) vs **(b)** a lighter reimbursable-status + later match to the incoming payment?
- Phase: receivables in **Phase 1**, or fold the matching into the Phase 2 Bill↔actual layer?
- Do you want a live "who owes me / how much" view, or just correctness in net worth?
- Note: **gig-work income is NOT a reimbursement** — it's real income. "Gig payer" is a party; the money is income, not a receivable clearing. Confirm that split holds for how you think about it.

**E. Net worth over time.** Net-worth trend chart, or just today's number? (Trend needs periodic snapshots or full-history derivation.)

**F. Feed-less asset cadence.** How often re-value the house/car — manually when you feel like it, or on a schedule?

**G. Bills (phase 2 shape).** What counts as a "bill" vs a normal transaction? Fixed recurring only, or variable (utilities)? Upcoming-bill forecasting / reminders?

**H. Budgeting model (phase 3).** True envelope (YNAB: assign every dollar) or simpler target-vs-actual per category? Should unspent roll over month to month?

**I. Reports — the 3 you'd actually open.** Net-worth trend? Monthly spend by category? Account register? Cash-flow in/out? Rank them.

**J. Reconciliation.** Reconcile against real statements (mark cleared vs pending)? That adds a `cleared`/statement concept to lines.

**K. Platform reach.** FileMaker Pro on desktop only, or also FileMaker Go on iPhone/iPad for on-the-go entry?

## Next build (BLOCKED until inquiry answered)

- Remaining inquiry: E–L. Plus resolve DD-008 naming.
- THEN: spin up a fresh agent session to articulate real fields per object, writing `tables/` files + `schema/tables.json` off these answers.

## Futures

- Budgeting layer (envelope, YNAB/Actual).
- Bill <-> actual-transaction match (HML `PaymentApplications`).
- Investments / multi-currency (out of scope v1).
- Separate market-data app if a live portfolio / Bloomberg-style view is ever wanted.

## Known guardrails

- Repo is source of truth. One file per object. Calc formulas inline in their owning table file (DOCUMENTATION-STANDARD.md, 2026-07-15).
- Every object edit = branch -> PR -> self-merge.
