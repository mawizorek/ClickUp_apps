# maw-budget — Next Build Spec (v0.4)

> One file per app, overwritten each build cycle. Version lives in this header, never in the filename.

## Status: goal interrogation COMPLETE. One gate left: DD-008 naming. Then field articulation.

## Scratch intake

- 2026-07-15: app scaffolded git-first from `_template-fmp-app`. Never in ClickUp.
- 2026-07-15 brainstorm: core job = account/net-worth tracking + bill/subscription tracking, budgeting later. Single user. HML naming.
- 2026-07-15 research pass (v0.1): benchmarked QuickBooks, YNAB/Monarch/Copilot/Actual, Firefly III, Maybe, GnuCash, Bloomberg. Confirmed double-entry.
- 2026-07-15 (v0.2): **double-entry RULED IN.** Foundational calls locked (DD-001–010). Goal interrogation opened.
- 2026-07-15 (v0.2–0.3, inquiry): A, B, C, D, E, F, G captured; L raised then resolved. Prior art found (URITP BETA BUDGET + Venmo CSV).
- 2026-07-15 (v0.4, inquiry): **H, I, J, K captured — interrogation A–L CLOSED.** DD-019–022 logged. Changelog added. Only DD-008 naming remains before tables.

## Locked decisions (see `meta/design-decisions.md` for the why)

- **DD-001 Double-entry ledger** — events of balanced legs summing to zero.
- **DD-002 Signed-amount legs; account TYPE first-class** — sign×type drives net worth.
- **DD-003 Derived balances & net worth** — never stored (snapshot is the one sanctioned exception, DD-016).
- **DD-004 UI speaks money-in/out**, never debit/credit.
- **DD-005 Feed-less assets via Valuations** (house, car).
- **DD-006 Bloomberg / market data OUT** — separate app if ever.
- **DD-007 Phasing** — spine → bills → budgeting.
- **DD-008 Naming = HML style** (PROVISIONAL — THE LAST GATE before field articulation).
- **DD-009 Single user.**
- **DD-011 Full account-type coverage** — every account class (A).
- **DD-012 CSV import + manual entry, ~weekly** — Phase 1 (B). Prior art: Venmo CSV. Dedup-review UX deferred to interaction session.
- **DD-013 Reimbursements = receivables**, RESOLVED → party-as-receivable-account, live "who owes me" view, Phase 1 (L).
- **DD-014 Hierarchical categories** — parent → child tree; rollups for free (C).
- **DD-015 Multi-category splits** — N legs on one event (D).
- **DD-016 Net worth over time** — `NetWorthSnapshot`; trend chart; autonomous capture TABLED (E).
- **DD-017 Bills = expected-vs-actual, variable, soft forecasting** — Phase 2 (G).
- **DD-018 Valuation cadence = on-demand + soft staleness nudge** (PROVISIONAL, F).
- **DD-019 Budgeting = target-vs-actual first, envelope-ready later** — Phase 3 (H). Rollover deferred.
- **DD-020 Priority reports** = spend-by-category, account register, who-owes-me (I). Net-worth trend is the headline; cash-flow is Futures.
- **DD-021 Reconciliation = cleared/pending in scope** (J). Pairs with import dedup. Phase 1 flag; full statement-balance reconcile is 1.5.
- **DD-022 Platform = desktop + FileMaker Go, serverless pref, receipts wanted** (K, PROVISIONAL). Sync/hosting + receipt storage = own architecture session. Schema stays sync-agnostic + receipt-light.

## Reference model deep-dive (researched 2026-07-15)

### QuickBooks
- **Chart of Accounts (COA)**: typed accounts in 5 buckets — Assets, Liabilities, Income, Expenses, Equity. Every transaction posts to >= 2 and must balance. Account type + detail type.
- Our "Categories" = income/expense accounts; "Accounts" = asset/liability accounts. Receivables = another asset type (DD-013). Sub-accounts = our hierarchical categories (DD-014).

### Budgeting apps (UX layer, not the ledger)
- **YNAB** envelope; **Actual** OSS envelope on a real ledger (closest pattern for Phase 3); **Monarch** net-worth dashboard (DD-016); **Copilot** AI categorization (UX lesson). Budgeting = a derived layer, not a second ledger.

### OSS engines (the schema to copy)
- **Firefly III** — group → journal → legs, sum to 0. Splits = extra legs; reimbursements = party account. **Maybe** — Valuations + net-worth-over-time. **GnuCash** — strict double-entry.

### Bloomberg (out of scope, DD-006)
- Market-data + trading workstation. Tracks markets, not a household. Separate app if ever.

## Money direction, signs, debit vs credit

- Every event moves money FROM one account TO another. Legs, opposite signs, net zero.
- Debit/credit = left/right, not add/subtract. Assets & Expenses: debit increases. Liabilities/Equity/Income: credit increases.
- Each leg = a signed amount; the account's type says what the sign means. User never sees debit/credit (DD-004).

## Worked examples

- **Transfer:** `-100` Checking, `+100` Savings.
- **Card payment:** `-500` Checking, `+500` Visa (a transfer, not an expense).
- **Swipe:** `+500` Expense, `-500` Visa.
- **Split (Target $120):** `-120` Visa, `+60` Groceries, `+40` Household, `+20` Clothing (DD-015).
- **Reimbursement (front $100 for dad):** `+100` category, `-100` "Due from Dad"; on payback `+100` Checking, `-100` "Due from Dad" (DD-013).

## Proposed spine (HML naming) — SHAPE ONLY, not final fields

> Field lists come in the field-articulation session, after DD-008 is confirmed.

- **Institutions** -> **Accounts** (`fkInstitution`; typed asset/liability/**receivable**, on/off budget, normal sign)
- **Parties** (Dad, UofR, gig clients) — receivable `Account`s carry a running "owed" balance (DD-013)
- **TransactionGroups** (date, payee, memo, **cleared/pending** per DD-021) -> **TransactionLines** (legs: `fkAccount`, `fkCategory`, signed `amount`; **N legs, sum to 0**)
- **Categories** (`fkParentCategory` tree, DD-014; typed income/expense)
- **ImportSessions** (`fkAccount`; provenance + dedup `rawHash`, DD-012)
- **Valuations** (`fkAccount`; point-in-time worth; on-demand, DD-018)
- **NetWorthSnapshot** (date + total [+ optional per-account]; DD-016)
- **Receipt** (reference/external, NOT embedded by default; DD-022) — attach to a transaction
- **Bills** (recurring expected: payee, category, expected amount, schedule, next-due) — phase 2 (DD-017)
- **BudgetAllocations** (category + month + target; rollover-ready) — phase 3 (DD-019)

**Derived, not stored:** account balance = sum of legs (+ latest Valuation). Net worth = sum of balances. Category spend rolls up the tree. (Snapshots are the one frozen exception.)

## Phasing

- **Phase 1 (v1):** Institutions, Accounts (incl. receivables), Categories, TransactionGroups, TransactionLines, ImportSessions, Valuations, NetWorthSnapshot, Receipt (reference). Delivers: balances, net worth + trend, transfers, card payments, splits, spend-by-category, account register, live who-owes-me, CSV import, split editor, cleared/pending marking. **Priority report order (DD-020): spend-by-category → account register → who-owes-me.**
- **Phase 2:** Bills (expected-vs-actual, variable, soft flags) + bill↔actual match. Reimbursement auto-clear can share it.
- **Phase 3:** Budgeting — target-vs-actual first (DD-019), envelope + rollover as an additive upgrade.
- **Out of scope v1:** investments, multi-currency, live market data.
- **Tabled:** autonomous net-worth capture; full statement-balance reconciliation (Phase 1.5); envelope rollover.

## Open inquiry — CLOSED (A–L all answered)

**A. Accounts ✅** every class (DD-011). **B. Intake ✅** CSV + manual, weekly (DD-012). **C. Categories ✅** hierarchical (DD-014). **D. Splits ✅** yes (DD-015). **E. Net worth ✅** trend/snapshots (DD-016). **F. Valuations ✅** on-demand + nudge (DD-018). **G. Bills ✅** expected-vs-actual, soft, Phase 2 (DD-017). **H. Budgeting ✅** target-vs-actual→envelope (DD-019). **I. Reports ✅** category / register / who-owes-me (DD-020). **J. Reconcile ✅** cleared/pending (DD-021). **K. Platform ✅** desktop + Go, sync deferred (DD-022). **L. Reimbursements ✅** receivables, live view, Phase 1 (DD-013).

## Last gate before tables

- **DD-008 naming convention** — confirm HML (`PrimaryKey`/`fk<Parent>`) vs URITP (`pk_`/`fk_`). This is the ONLY thing blocking field articulation.

## Deferred to their own sessions (do NOT block field articulation)

- **Interaction/interface design**, incl. the manual-vs-CSV **dedup review UX** (DD-012) and the split editor UX (DD-015).
- **Hosting/sync architecture** for desktop + FileMaker Go, and **receipt storage** approach (DD-022).
- **Rollover** behavior for the envelope upgrade (DD-019).
- One-time **migration** from URITP BETA BUDGET / Venmo data (DD-012 prior art).

## Next build

- Confirm DD-008 naming.
- THEN: fresh agent session articulates real fields per object → writes `tables/` files + `schema/tables.json` off DD-011–022. The decision log + this spec are the brief; a cold agent should be able to run it without re-interviewing Michael.

## Prior art — existing ClickUp budget space

**URITP BETA BUDGET** space + **Venmo** list (`Journal Entry` task type) + combined Venmo CSV. Validates the model (dad = reimbursement pattern, Alarm Will Sound/drafting = gig income, Chase/Capital One/Venmo = multi-source CSV). First CSV mapping target + one-time migration source. maw-budget (FileMaker) is the long-term home, not this space.

## Futures

- Autonomous net-worth snapshot capture (on-open / weekly).
- Full envelope budgeting + rollover.
- Bill↔actual auto-match + reimbursement auto-clear.
- Full statement-balance reconciliation.
- Cash-flow in/out report.
- Investments / multi-currency.
- Separate market-data app if a live portfolio view is ever wanted.

## Known guardrails

- Repo is source of truth. One file per object. Calc formulas inline in their owning table file.
- Every object edit = branch -> PR -> self-merge. Log each PR in `meta/changelog.md`.
