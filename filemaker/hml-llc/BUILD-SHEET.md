# 🥇 HML v1 — BUILD SHEET

**STATE: 🥇 GOLDEN (target).** What the file SHOULD be, not what it is. **Open this before a build session.** Every statement here is flat and actionable — you never need a chat thread or a comment to use it.

> Moved out of ClickUp 2026-07-29 on Michael's ruling: *"i don't want fmp documentation in cu anymore… this should all be relatable doc layouts in the git organized like the fmp menus."* **Only the Decision Log stays in ClickUp**, and only because inverted-polarity checkboxes need to be clickable — in markdown `- [ ]` is inert text and a question cannot be answered.

---

## 🚦 The gate is CLOSED — Q8 ruled 2026-07-29

✅ **`ReceivedFunds` joins the canonical stack as the parent receipt layer, keeping that name.** The locked schema said 9 tables; the locked script order needed 10. Now they agree. → [`tables/ReceivedFunds.md`](./tables/ReceivedFunds.md)

<br/>

**Still open:** `tbl_*` object family for table-view columns (DL **Q7**), and the `utilities` script-folder divergence (see [`scripts/README.md`](./scripts/README.md)).

---

## The state legend — every page in this tree carries one

| Stamp | Means |
|---|---|
| 🥇 **GOLDEN** | Target state. Build toward it. May not match the live file. No build-status chatter. |
| 🔨 **BUILT** | What is actually in the file, verified on a named date. |
| ⛔ **SUPERSEDED** | **Do not implement.** Kept for history; says what replaced it. |

The FileMaker Documentation Standard has forbidden braiding target-state with build-status since June, but supplied **no marker** — so the rule was unenforceable by construction, and the old Tables page ended up stacking screenshots, a June 14 lock, a June 15 audit, the live inventory and "tables to add" in one scroll. **A rule with no mechanism is a wish.** An unstamped page in this tree is a bug.

---

## Build order — the order is a CORRECTNESS matter

| # | Do this | Done looks like |
|---|---|---|
| 1 | Build **`ReceivedFunds`**; settle `Payment Received` in the taxonomy | Table exists; the redundant type is retired or explicitly justified |
| 2 | Build the **`txn_*` wrapper** (`00_APP`) | Three scripts exist; a deliberate mid-block failure rolls back **everything** |
| 3 | Import the **Golden Month** fixture | All six kill-rows land; reconciliation shows **$850.00 unapplied**, traceable to `RCPT-004` |
| 4 | **Ledger table views** — `ExpectedTransactions`, `AccountTransactions`, `Standard_Transactions`, `PaymentInstructions` | Column set, order and formatting **deliberately designed**. Table view is a real user surface here, not scaffolding |
| 5 | **Loan hub** — `ExpectedTransactions` + `AccountTransactions` portals | The month-of-work screen. The only screen that must be right for the tool to be usable |
| 6 | **Property hub** — `Loans` portal | `PROP-001` shows **two** loans |
| 7 | **Payoff read-only print** layout | No portal. An editable portal over frozen data defeats the freeze |

<br/>

### ⛔ WHY STEP 1 MUST PRECEDE STEP 2 — the most dangerous thing on this page

FileMaker 19 has **no native transactions** (`Open/Commit/Revert Transaction` arrived in FileMaker 2023 — verified against the Claris 20.1.2 release notes and the MBS step-by-version table). Atomicity on 19 requires **every write in a transaction to flow through ONE relationship from ONE parent record**, so `Revert Record` on that parent discards the whole set.

**The receipt IS that record.** Build the wrapper first and the only available parent is `Loans` — so one check across two loans has TWO parents and `Revert Record` can only roll back half. **You would ship a rollback that silently reverts partially**, which is worse than no rollback: it produces corruption you believe was prevented.

**Table before wrapper.**

<br/>

### `txn_*` — the non-obvious rules

- Names are `txn_Begin` / `txn_Commit` / `txn_Rollback`. **There is no engine transaction underneath. Write that in the script comments** or a future reader designs against a guarantee that does not exist.
- `Set Error Capture [On]` around the block. Check `Get(LastError)` **after every write step**, not once at the end.
- **No `Commit Records` anywhere inside the block.** A stray commit is the single most common way this pattern breaks silently.
- Wrap it **once**. Hand-copying rollback logic into the payment-apply and the payoff-freeze means the second copy is where the bug lives.
- **Must fail loudly.** A wrapper that swallows an error to keep a routine moving is worse than none — silent helpers are worse than throwing ones.

**The two routines that MUST be atomic:** applying one `AccountTransactions` row across N `ExpectedTransactions` (half-applied = corrupt money data), and the `Payoffs` snapshot freeze (partial freeze = a quote that silently changes after it was sent).

---

## What v1 is FOR (DL Q1)

**An internal instrument Michael runs the books in.** Not Dad's tool, not a demo — Dad sees v2 after real use proves the data model. Scoped to **the two or three screens that carry a month**, nothing else built.

Consequences: the 07/21 due date is void · "credible demo on desktop and mobile" is struck · **mobile / FileMaker Go is OUT of v1** (which also removes the main argument against table view).

---

## Where truth lives

| Artifact | Home |
|---|---|
| Field registry — every field, type, storage, calc text | `tables/*.md` + `calculations/` in this repo. Diffable. |
| Grain, keys, the rule that must never break | the same table pages — **grain is now in `tables/_index.json` per row** |
| Script bodies | `scripts/<FMP_FOLDER>/<Name>.fmscript` — dictation reference, not paste-round-trip |
| Script tree + call graph | `scripts/_index.json` — one flat manifest; `calledBy` is DERIVED, never stored |
| **Decisions and open questions** | **ClickUp: HML_LLC FileMaker v1 — Decision Log.** The one deliberate exception. |

**Grain was the missing field.** The Documentation Standard has demanded a *"one record means…"* line since June and not one page carried one — and **every contradiction found in the 07-29 audit was a grain disagreement** (is one row a payment, or an application of a payment?). Had `AccountTransactions` carried *"one line on a borrower-facing statement"*, nobody would have mistaken it for a cash ledger and the 9-vs-10 gap would have been caught in June.

---

## Pages that are lying to you right now

**Seven script rows are marked `superseded` in [`scripts/_index.json`](./scripts/_index.json)** — five written against `fkProperty` before `Loans` won, two unverified. They carry `supersededWhy` inline.

**Stamped, not rewritten, on purpose.** Rewriting them before Q8 would have paid twice, since they were about to be wrong for a second reason. **A stamp IS the write-step** — debt legible on the object is discharged; debt that lives in a status table is not, which is how a 2026-06-18 self-audit sat unmoved for six weeks.

---

## The fixture

[`fixtures/golden-month/`](./fixtures/golden-month/) — one worked month of March 2026 as nine importable TSVs whose keys thread through every file.

**Referential consistency is the proof:** nine isolated samples prove nothing, but nine files can only join if keys, grain and parentage are all right. It is **deliberately ugly** — a tidy month imports cleanly under any schema, which is a test that cannot fail.

🔑 **Read the fixture README before importing.** `PrimaryKey` is auto-enter UUID with override prohibited, so an as-is import destroys every FK **and fails quietly** (rows land, portals come up empty).

**Acceptance test:** unapplied cash must be exactly **$850.00**, traceable to `RCPT-004` alone. If it is not, the schema is wrong — not the fixture.

---

## Consequences that are easy to miss

**⚠️ `Payment Received` is now a double-count risk.** That value exists *specifically* to paper over the missing receipt table (the docs state: *"`Payment Received` is the actual cash-in ledger bucket"*). With `ReceivedFunds` live it is a redundant type that **will** get picked by accident, putting the same cash in two places, and any rollup filtering on it silently double-counts. **Decide it in the same pass as step 1.**

**Table naming is still unresolved — a bug factory before any `ExecuteSQL`.** Three tables, two spellings each: `Standard_Transactions`/`StandardTransactions` · `PropertySUMMARIES`/`Property SUMMARIES` · `GLOBAL_USE_VARIABLES`/`GLOBAL_USE_Variables`. The Pre-SQL naming lock is **0 of 6 done.** Not this pass, but it must land before SQL calc text touches any of them.

**The ledger table views have no approved object vocabulary.** `tbl_*` is proposed and unruled (DL Q7). Reviewing table views before it lands means reviewing schema through an unstyled surface — **do not read "unstyled" as "unfinished."**

**`PropertyExpectations` exists in the live file (~14 calc fields) and is NOT in the canonical stack.** Likely absorbed into `Loans` calcs. Unconfirmed — do not delete it, do not build against it. Logged in `tables/_index.json` → `notInStack`.

---

## Explicitly NOT in this pass

Stated as decisions, not drift: `Documents` / `DocumentVersions` / `Contacts` / `Organizations` (the documents portal is already deferred) · the naming-lock rename pass · rewriting the seven superseded scripts (stamp only) · mobile / FileMaker Go · `PropertyExpectations` resolution.

---

**If you read only one thing:** build `ReceivedFunds` before the `txn_*` wrapper, import the Golden Month, and confirm unapplied cash is exactly $850.00 traceable to one receipt. Everything else here is detail.
