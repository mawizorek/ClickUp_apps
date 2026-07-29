# HML_LLC — the file, as a menu

**This tree mirrors FileMaker's own *Manage* menu.** Open a folder here and you should be looking at the same thing you see in the IDE. Scrollable on a phone; every folder carries an `_index.json` the viewer reads.

> 🥇 **START HERE → [BUILD-SHEET.md](./BUILD-SHEET.md)** — the one page to open before a build session.
>
> **STATE stamps:** every page carries 🥇 GOLDEN (target) · 🔨 BUILT (verified in the file, dated) · ⛔ SUPERSEDED (do not implement). An unstamped page is a bug.

---

## 🗄️ Manage → Database → Tables (`tables/`)

| Table | Grain — one record means… | Role | State |
|---|---|---|---|
| [GLOBAL_USE_VARIABLES](./tables/GLOBAL_USE_VARIABLES.md) | one record, ever — app state + current selection | singleton | 🔨 |
| [PropertySUMMARIES](./tables/PropertySUMMARIES.md) | one piece of real collateral. NOT a deal, NOT a loan | collateral | 🔨 |
| [Loans](./tables/Loans.md) | one note with its own terms — **the financial parent** | servicing-parent | 🔨 |
| [ExpectedTransactions](./tables/ExpectedTransactions.md) | one thing the borrower **owes**, on a date. A promise | ledger | 🔨 |
| 🆕 [**ReceivedFunds**](./tables/ReceivedFunds.md) | one **real-world cash event** — what the bank saw. Never split | receipt-parent | 🥇 |
| [AccountTransactions](./tables/AccountTransactions.md) | one line on a borrower-facing statement. A **projection** | ledger | 🔨 |
| [PaymentApplications](./tables/PaymentApplications.md) | one act of assigning $X of a receipt to one owed item | join | 🔨 |
| [Payoffs](./tables/Payoffs.md) | one quote that was **sent to a human**. Frozen | snapshot | 🔨 |
| [PaymentInstructions](./tables/PaymentInstructions.md) | one reusable "how to pay us" block. Row-based | source | 🥇 |
| [Standard_Transactions](./tables/Standard_Transactions.md) | one **kind** of money movement. Taxonomy | taxonomy | 🔨 |
| [Documents](./tables/Documents.md) · [Organizations](./tables/Organizations.md) · [Contacts](./tables/Contacts.md) | — | party / document | 🥇 out of v1 |

**`ReceivedFunds` is the tenth table**, approved 2026-07-29 (DL Q8). It closed a six-week disagreement between the locked schema (9 tables) and the locked script order (which required 10), **and** it is the single-parent record the FMP19 rollback pattern needs.

⚠️ **`PropertyExpectations` exists in the live file (~14 calc fields) but is NOT in the stack.** Unconfirmed, likely absorbed into `Loans` calcs. Do not delete, do not build against it. See `tables/_index.json` → `notInStack`.

## 🔗 Manage → Database → Relationships (`relationships/`)

Loan-first graph. → [relationships/README.md](./relationships/README.md) + `_index.json`

⚠️ The transaction relationship for rollback is `ReceivedFunds.PrimaryKey ← AccountTransactions.fkReceivedFunds`. **Every multi-record write flows through it.**

## 🧮 Manage → Database → Fields → calculations (`calculations/`)

One `.fmcalc` per calc field — pastes back into the calculation dialog verbatim. → `calculations/_index.json`

## 📜 Manage → Scripts (`scripts/`)

**Eleven folders, matching the real Script Workspace:** `00_APP` · `10_UI` · `20_NAV` · `30_CONTEXT` · `40_BINDER` · `50_RECEIPTS` · `60_PAYMENTS` · `70_SCHEDULE` · `80_PAYOFF` · `90_ADMIN` · `zz_DEV_ARCHIVE` → [scripts/README.md](./scripts/README.md)

⚠️ **CORRECTED 2026-07-29.** The old tree used `imports/navigation/triggers/utilities` and the README *claimed* those matched the file. They matched nothing. **Seven scripts are now stamped `superseded`** with reasons inline in `scripts/_index.json`.

## ƒ Manage → Custom Functions (`functions/`)

→ [functions/README.md](./functions/README.md) · [MSG_ValueListErrors](./functions/MSG_ValueListErrors.md)

## 🖼️ Manage → Layouts (`layouts/`)

→ [layouts/README.md](./layouts/README.md). v1 builds three: **Loan hub** (two portals — the month-of-work screen), **Property hub** (`Loans` portal), **Payoff print** (read-only, no portal).

## 📋 Manage → Value Lists (`value-lists/`)

→ [value-lists/README.md](./value-lists/README.md)

---

## 🧪 Fixtures (`fixtures/`)

**[golden-month/](./fixtures/golden-month/)** — one worked month, nine TSVs, keys threading through every file. Referential consistency is the proof; deliberately ugly. **Acceptance test: unapplied cash = exactly $850.00 traceable to `RCPT-004`.**

🔑 Read its README first — an as-is import destroys every FK and **fails quietly**.

## 📝 Meta / narrative (`meta/`)

[design-decisions](./meta/design-decisions.md) · [architecture-notes](./meta/architecture-notes.md) · [data-standards](./meta/data-standards.md) · [calculation-fields](./meta/calculation-fields.md) · [schema-notes](./meta/schema-notes.md) · [import-export-specs](./meta/import-export-specs.md) · [database-graph-log](./meta/database-graph-log.md) · [changelog](./meta/changelog.md)

---

## What is NOT here, and why

**Decisions and open questions live in ClickUp** — the *HML_LLC FileMaker v1 — Decision Log*. That is the one deliberate exception to "FMP docs live in git," and it is a correctness constraint, not a preference: the log runs on **inverted-polarity checkboxes** (checked = rejected), and in markdown `- [ ]` is inert text, so a question there literally cannot be answered.

**Everything else moved out of ClickUp 2026-07-29** on Michael's ruling. The old ClickUp pages are pointer stubs; `docs/` here holds legacy stubs so old links don't break.

<br/>

**Open:** `tbl_*` object family for table-view columns (DL Q7) · the `utilities` script-folder divergence · the three-table naming lock (0 of 6).
