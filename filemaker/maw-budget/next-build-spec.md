# maw-budget — Next Build Spec (v0.2)

> One file per app, overwritten each build cycle. Version lives in this header, never in the filename.

## Scratch intake

- 2026-07-15: app scaffolded git-first from `_template-fmp-app`. Never in ClickUp.
- 2026-07-15 brainstorm: core job = **account / net-worth tracking + bill/subscription tracking**, budgeting later. Single user (Michael). Naming = HML_LLC style (clean PascalCase, drop legacy SCREAMING names).
- 2026-07-15 research pass (v0.1): benchmarked QuickBooks, YNAB/Monarch/Copilot/Actual, Firefly III, Maybe, GnuCash, and Bloomberg Terminal. Confirmed the double-entry lean. Deep-dive below.
- 2026-07-15 (v0.2): **double-entry RULED IN by Michael.** Fork closed. Foundational design calls locked in `meta/design-decisions.md`. Now interrogating goals (below) BEFORE any table is written — no field-guessing.

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

## Reference model deep-dive (researched 2026-07-15)

### QuickBooks (the accounting spine everyone copies)

- Core object is the **Chart of Accounts (COA)**: a typed list of every account, in 5 buckets: **Assets, Liabilities, Income (Revenue), Expenses, Equity.**
- Every transaction posts to **>= 2 accounts** and must balance (double-entry). Usually one side is a bank/card account, the other is a category (income/expense) account.
- Each account carries an **account type** (which report it feeds) plus a **detail type** (sub-classification).
- Takeaway: our "Categories" are really income/expense accounts, and our "Accounts" are asset/liability accounts. Same COA, two flavors.

### Budgeting apps (the UX layer, not the ledger)

- **YNAB** — zero-based / envelope: every dollar gets a job. Method-first, sits ON TOP of an account ledger.
- **Actual Budget** — open-source YNAB clone, local-first, envelope model on a real ledger. Closest OSS pattern for the budgeting phase.
- **Monarch** — dashboard / net-worth first, couples, broad sync. Best "what is happening across all my money" view.
- **Copilot** — Apple-only, AI categorization, beautiful. A UX lesson, not a data-model one.
- Takeaway: budgeting = a **derived layer** (assigned vs activity vs available, per category per month), NOT a separate ledger.

### Open-source accounting engines (the actual schema to copy)

- **Firefly III** — `TransactionGroup -> TransactionJournal (the event) -> Transaction (the legs)`. Legs reference an account, carry a signed amount, sum to 0. The pattern we steal.
- **Maybe** — adds point-in-time **Valuations** for feed-less assets. Adopted (DD-005).
- **GnuCash** — classic strict double-entry desktop. Confirms the model.

### Bloomberg Terminal (asked, but out of scope — DD-006)

- A professional **market-data + analytics + trading** workstation. Real-time quotes, news, analytics, Excel add-in, function-code UI (`DES`, `GP`, `PORT`).
- Setup: subscription (~$30k/user/yr) via "Bloomberg Anywhere" (install + serial + **B-Unit** biometric 2FA), quarterly updates.
- **Not relevant to maw-budget.** Tracks markets, not a household ledger. A live portfolio/market view, if ever wanted, is a separate app.

## Money direction, signs, debit vs credit (the mental model)

- **Double-entry in plain terms:** every event moves money FROM one account TO another. Two legs, opposite signs, net zero.
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
- Net worth dropped $500 at swipe; paying the card just moves the liability off. Double-entry gets this exactly right; single-entry double-counts or loses the transfer.

## Proposed spine (double-entry flavor, HML naming) — SHAPE ONLY, not final fields

> This is the object shape we're committing to conceptually. **Field lists are deliberately NOT written here** — they come after the Open inquiry below is answered, in a dedicated field-articulation session.

- **Institutions** -> **Accounts** (`fkInstitution`; typed asset/liability, on/off budget, normal sign)
- **TransactionGroups** (event: date, payee, memo) -> **TransactionLines** (legs: `fkAccount`, `fkCategory`, signed `amount`; sum to 0 per group)
- **Categories** (self-referencing `fkParentCategory`; typed income/expense, envelope-ready)
- **ImportSessions** (`fkAccount`; provenance + dedup `rawHash`)
- **Valuations** (`fkAccount`; point-in-time worth for feed-less assets)
- **Bills** (recurring expected) — phase 2
- **BudgetAllocations** (category + month) — phase 3

**Derived, not stored:** account balance = sum of its legs (+ latest Valuation). Net worth = sum of balances.

## Phasing (DD-007)

- **Phase 1 (v1):** Institutions, Accounts, Categories, TransactionGroups, TransactionLines, ImportSessions, Valuations. Delivers balances, net worth, transfers, card payments, spend by category.
- **Phase 2:** Bills (expected/recurring) + Bill<->actual match (HML `PaymentApplications` pattern).
- **Phase 3:** Budgeting layer (envelope, Actual/YNAB style): `BudgetAllocations`; Available = assigned - activity + rollover.
- **Out of scope v1:** investments, multi-currency, live market data.

## Open inquiry — goal interrogation (ANSWER BEFORE ANY TABLE) 🔍

> The point of this pass: pressure-test what the app is actually FOR, so fields are derived from real goals, not guessed. Each answer feeds directly into the field-articulation session. Nothing below is decided.

**A. Account inventory — what actually exists.**
- List every real account: checking(s), savings, each credit card, cash, loans/mortgage, HSA/retirement, the house, the car(s). How many of each?
- Which are "on budget" (spending flows through) vs "off budget" (tracked for net worth only, e.g. mortgage, 401k)?

**B. Data intake — how do transactions get IN?** (FileMaker has no live bank feed.)
- Manual entry, CSV/OFX import from each bank, or a mix? Which banks, what export format?
- How often will you actually sit down to enter/import? (Drives whether import tooling is v1 or later.)

**C. Categories — shape & granularity.**
- Flat list or hierarchical (parent → child)? Roughly how many?
- QuickBooks-style income/expense accounts, or simple spending buckets?

**D. Splits.** One purchase across multiple categories (Target run = groceries + household + clothing) — do you need it? (Double-entry supports it free; confirms UI need.)

**E. Net worth over time.** Do you want a net-worth trend chart, or just today's number? (Trend needs periodic snapshots or full-history derivation.)

**F. Feed-less asset cadence.** How often re-value the house/car — manually when you feel like it, or on a schedule?

**G. Bills (phase 2 shape).** What counts as a "bill" vs a normal transaction? Fixed recurring only, or variable (utilities)? Do you want upcoming-bill forecasting / reminders?

**H. Budgeting model (phase 3).** True envelope (YNAB: assign every dollar) or simpler target-vs-actual per category? Should unspent roll over month to month?

**I. Reports — the 3 you'd actually open.** Net-worth trend? Monthly spend by category? Account register? Cash-flow in/out? Rank them.

**J. Reconciliation.** Will you reconcile against real statements (mark cleared vs pending)? That adds a `cleared`/statement concept to lines.

**K. Platform reach.** FileMaker Pro on desktop only, or also FileMaker Go on iPhone/iPad for on-the-go entry?

## Next build (BLOCKED until inquiry answered)

- Resolve DD-008 naming + the Open inquiry above.
- THEN: spin up a fresh agent session to articulate real fields per object, writing `tables/` files + `schema/tables.json` off these answers.

## Futures

- Budgeting layer (envelope, YNAB/Actual).
- Bill <-> actual-transaction match (HML `PaymentApplications`).
- Investments / multi-currency (out of scope v1).
- Separate market-data app if a live portfolio / Bloomberg-style view is ever wanted.

## Known guardrails

- Repo is source of truth. One file per object. Calc formulas inline in their owning table file (DOCUMENTATION-STANDARD.md, 2026-07-15).
- Every object edit = branch -> PR -> self-merge.
