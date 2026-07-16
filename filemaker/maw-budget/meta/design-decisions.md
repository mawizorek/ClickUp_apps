# Design Decisions — maw-budget

_Decision log (ADR-style). Each entry is a call we've committed to, why, and its status. This is the "why" record; the "what" lives in `../next-build-spec.md` and `architecture-notes.md`. New decisions append here; never silently reverse a LOCKED one without a superseding entry._

**Status key:** `LOCKED` = decided, build on it · `PROVISIONAL` = defaulted, confirm before it hardens · `OPEN` = still being interrogated (see spec).

---

## DD-001 — Double-entry ledger `LOCKED` (2026-07-15)

maw-budget is a double-entry ledger, not a single-row expense list. A transaction is an **event** (`TransactionGroup`) of balanced **legs** (`TransactionLines`) that sum to zero.

**Why:** every serious reference tool (QuickBooks, Firefly III, GnuCash, Actual) is double-entry. It is the only model that represents transfers between your own accounts (bank→bank, checking→card) without double-counting or losing the transfer, and net worth falls out of it for free. Cost is a little more scaffolding now; the payoff is never rebuilding.

**Supersedes:** the v0 "double-entry vs single-entry" open fork. Ruled by Michael 2026-07-15.

## DD-002 — Signed-amount legs; account TYPE is first-class `LOCKED` (2026-07-15)

Each leg stores a **signed amount** against an account. Whether `+` is "good" depends on the account's **type** (asset vs liability), so type is a first-class field, not a label.

**Why:** "balance went up" is good on checking (asset) and bad on a Visa (liability). The sign + type pair is what lets net worth roll up correctly. Debit/credit are just left/right of an entry (debit raises assets & expenses, credit raises liabilities/income/equity) — we encode that as sign×type, not as user-facing jargon.

## DD-003 — Balances and net worth are DERIVED, never stored `LOCKED` (2026-07-15)

Account balance = sum of its legs (plus the latest `Valuation` for feed-less assets). Net worth = sum of account balances. Nothing summable is persisted.

**Why:** stored balances drift out of sync the moment anything is edited. Derived balances can't lie.

## DD-004 — UI vocabulary: money-in / money-out, never "debit/credit" `LOCKED` (2026-07-15)

The interface speaks in plain money-in / money-out. The double-entry balancing happens underneath; the user never types a debit or a credit.

**Why:** debit/credit is the #1 thing that scares people off accounting tools. The correctness lives in the engine, not in the vocabulary.

## DD-005 — Feed-less assets via point-in-time Valuations `LOCKED` (2026-07-15)

Assets with no transaction stream (house, car) carry point-in-time `Valuation` snapshots rather than a running ledger.

**Why:** Maybe's pattern. You don't transact your house monthly; you re-estimate its worth occasionally. A snapshot models that honestly.

## DD-006 — Bloomberg / market data is OUT OF SCOPE `LOCKED` (2026-07-15)

maw-budget tracks a household ledger, not markets. No live quotes, no portfolio analytics, no market feed.

**Why:** Bloomberg Terminal is a different species (real-time market data + trading, ~$30k/yr, B-Unit 2FA). If a live portfolio view is ever wanted, it is a **separate app** with its own feed and folder, never folded in here. Named explicitly so the scope line stays honest.

## DD-007 — Phasing: spine → bills → budgeting `LOCKED` (2026-07-15)

Phase 1 = the ledger spine (accounts, balances, net worth, transfers, spend-by-category). Phase 2 = bills/subscriptions + bill↔actual match. Phase 3 = envelope budgeting on top of the existing ledger. Each phase is built so the next never forces a rebuild.

**Why:** budgeting is a derived layer, not a second ledger. Building the correct spine first means the envelope layer is additive, not surgical.

## DD-008 — Naming convention: HML_LLC house style `PROVISIONAL` (2026-07-15)

Defaulted to HML style (`PrimaryKey` / `fk<Parent>`, clean PascalCase, no legacy SCREAMING names). Alternative is URITP style (`pk_` / `fk_`).

**Confirm before the first real table is written.** Flip in `schema/tables.json` `_meta.conventions` if changing.

## DD-009 — Single user `LOCKED` (2026-07-15)

Michael only. No sharing/permissions model, no household split.

## DD-010 — Repo is source of truth; one file per object; PR workflow `LOCKED` (inherited)

Git-first app. Every object is one file, edited by branch → PR → self-merge. Calc formulas live inline in their owning table file (per `../../DOCUMENTATION-STANDARD.md`).

## DD-011 — Full account-type coverage `LOCKED` (2026-07-15)

The model must support every account class Michael holds: checking, savings, each credit card, cash, loans/mortgage, retirement, house, car. (Answer to inquiry A.)

**Why:** Michael wants all of them tracked. Implication: a single `Account` table with a **type** field (asset/liability + a sub-type detail) and an **on-budget boolean** covers the spread; we do NOT make a table per account class. Feed-less assets (house, car) use Valuations per DD-005. Actual counts and the on-budget flag per account are data set at entry time, not structure.

## DD-012 — CSV import + manual entry, ~weekly cadence `LOCKED` (2026-07-15)

Primary intake is **CSV import**, with **manual entry and manual post-import cleanup** as first-class steps. Cadence: aiming every other day, realistically ~weekly. (Answer to inquiry B.)

**Why:** FileMaker has no live bank feed, and Michael will drive intake by hand on a roughly weekly rhythm. Implications: (1) `ImportSessions` + a CSV mapper are **Phase 1**, not deferred; (2) `Account` needs a **per-account CSV column-mapping** (banks differ); (3) a **dedup key** (`rawHash`) prevents double-posting overlapping re-imports; (4) manual entry is a peer path, not a fallback. Sample CSV per bank gathered when the mapper is built.

---

## Deferred / not yet decided

Remaining open interrogation: **C–K** (categories, splits, net-worth-over-time, valuation cadence, bills, budgeting model, reports, reconciliation, platform). See the **Open inquiry** section of `../next-build-spec.md`. No table is drafted until these are resolved; guessing fields now would bake in the wrong shape.
