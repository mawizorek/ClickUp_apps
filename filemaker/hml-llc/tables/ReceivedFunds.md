# ReceivedFunds

**Role:** receipt-parent · **Status:** golden (approved, not yet built) · **App:** hml-llc

> **Grain: one record = one real-world cash event.** The check, the wire, the Venmo — what the *bank* saw. Not a ledger line, not an application. This is the tenth table, and it is the **transaction parent** for every multi-record write in the file.

## Why it exists (Q8, approved 2026-07-29)

Approved after the locked 9-table schema and the locked v1 script build order were read against each other for the first time and **disagreed about how many tables exist.** Four script pages already assumed this table; `60_PAYMENTS__Post_ReceivedFunds_Batch` states it *"does not skip the parent receipt layer."* It was never a new idea — it was an unwritten one.

Three reasons, in ascending order of teeth:

1. **One check, two loans.** A borrower with two properties writes one check. Without a receipt record there is nothing holding the amount the bank actually saw — you either split it into rows that no longer reconcile to the deposit, or pick one loan and lie.
2. **Money arrives before you know what it is.** A check with an illegible memo has no legal home when `fkLoan` is the authoritative parent. Here, **unapplied cash is a valid resting state** rather than a data error.
3. ⚠️ **It IS the atomicity design.** FMP19 has no native transactions (`Open/Commit/Revert Transaction` are FileMaker 2023). Rollback on 19 requires every write in a transaction to flow through **ONE relationship from ONE parent record** so `Revert Record` discards the whole set. **This record is that parent.** Without it the only candidate is `Loans` — so a check across two loans has two parents and rollback reverts half. **Build this table before the `txn_*` wrapper or you ship a silent partial rollback**, which is worse than none.

## Fields (golden — none built yet)

| Field | Type | Key | Category | Notes |
|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | auto-enter `Get(UUID)`, prohibit modification |
| ReceivedDate | date | plain | detail | the date on the deposit, not the date typed |
| Amount | number | plain | detail | **the full amount the bank saw.** Never split. |
| ReceivedMethod | text | plain | detail | value list: Check / Wire / ACH / Venmo / Cash |
| ExternalRef | text | plain | detail | check number, FEDWIRE ref. Keep separate from any document link. |
| fkBorrower | text-uuid | fk | key | **nullable** — unknown payer is legal |
| ReconciliationStatus | text | plain | detail | Unassigned / Partially Applied / Applied / Voided |
| Notes | text | plain | detail | "memo illegible" belongs here |
| fkSourceDocument | text-uuid | fk | key | optional proof-of-payment link. Deferred with Documents. |
| calc_AmountApplied | calc-number | plain | summary | sum of child `AccountTransactions.Amount` |
| calc_AmountUnapplied | calc-number | plain | summary | `Amount - calc_AmountApplied`. **The field that makes unapplied cash visible instead of lost.** |
| audit block | — | audit | audit | PrimaryKey/Creation/Created/Modification/Modified per house standard |

## Relationships

- `ReceivedFunds.PrimaryKey` ← `AccountTransactions.fkReceivedFunds` (one-to-many). **This is the transaction relationship** — the one all writes flow through.
- `ReceivedFunds.fkBorrower` → `Organizations.PrimaryKey` (many-to-one, nullable)
- No direct link to `Loans`. **Deliberate:** the loan is reached through the applications, because one receipt can touch several loans. A `fkLoan` here would recreate the bug this table fixes.

## The one rule that must never break

**`Amount` is the amount the bank saw and it is never edited to make the math work.** If applications do not sum to it, the difference is unapplied cash and that is a *fact*, not an error to tidy. `calc_AmountUnapplied` exists to keep that fact on screen.

## Scripts that write here

| Script | Folder | State |
|---|---|---|
| `50_RECEIPTS__Create_ReceivedFunds_From_Document` | `50_RECEIPTS` | ⛔ superseded — rewrite against this table |
| `60_PAYMENTS__Post_ReceivedFunds_Batch` | `60_PAYMENTS` | ⛔ superseded — spawns child `AccountTransactions` |
| `60_PAYMENTS__Reverse_Posted_Payment` | `60_PAYMENTS` | golden — void one receipt, applications cascade |

## Open Items

- ⚠️ **`Payment Received` in `Standard_Transactions` becomes a double-count risk.** That value exists specifically to paper over this table's absence (the docs state: *"`Payment Received` is the actual cash-in ledger bucket"*). Once this table exists it is a redundant type that will get picked by accident, putting the same cash in two places, and any rollup filtering on it silently double-counts. **Retire it or write down why it survives.**
- Confirm the value list for `ReceivedMethod` against how deposits actually arrive.
- `fkSourceDocument` stays inert until Documents comes back into scope.

## Test

Fixture rows `RCPT-001` (one check, two loans) and `RCPT-004` ($850, memo illegible, no loan) in [`../fixtures/golden-month/`](../fixtures/golden-month/). **`RCPT-001` cannot be expressed without this table** — that is what settled Q8 empirically rather than by argument.

## Changelog

- 2026-07-29: Created. Approved via HML_LLC Decision Log **Q8** (Michael: add it as the parent receipt layer, keep the name). Authored by FMP Fiona; the case was made by Domain Dara and the atomicity consequence found by Risk Rhys.
