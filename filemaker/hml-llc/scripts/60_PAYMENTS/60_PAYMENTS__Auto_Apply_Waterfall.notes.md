# 60_PAYMENTS__Auto_Apply_Waterfall — notes

**STATE: SUPERSEDED. Read the body, do not type it into FileMaker yet.**

Copy text: [`60_PAYMENTS__Auto_Apply_Waterfall.fmscript`](./60_PAYMENTS__Auto_Apply_Waterfall.fmscript)

---

## Why it is superseded — two defects, and the second is the dangerous one

**1. It keys off `fkProperty`.** `Loans` won that argument in June; the servicing parent is `fkLoan`. Known since the 2026-06-18 audit.

**2. It commits TWICE PER APPLIED ROW, inside the loop.** This was NOT previously known and it is worse than the rename.

FileMaker 19 has no native transactions, so atomicity depends on every write staying uncommitted until one deliberate commit at the end. **Each `Commit Records` in that loop ends the transaction and makes the preceding rows permanent.** A failure on application 3 of 5 leaves two applications committed, the money half-applied, and the routine still reporting `ok:true`.

That is not a crash. That is a ledger that looks fine and is wrong.

**Both commit steps must be deleted** when this is rewritten, and the whole routine wrapped once in `txn_Begin` / `txn_Commit` / `txn_Rollback` with **`ReceivedFunds` as the single parent** — not `Loans`, because one check across two loans has two `Loans` parents and only one receipt.

## Rewrite checklist

- [ ] `fkProperty` to `fkLoan` throughout (params, find criteria)
- [ ] Delete both mid-loop `Commit Records` steps
- [ ] Wrap in the `txn_*` trio, parent = `ReceivedFunds`
- [ ] Param becomes `{ receivedFundsID, loanID }` — a receipt can span loans, so the caller loops loans, not properties
- [ ] Re-test against `RCPT-001` (the two-loan check)

## Design notes worth keeping

**The three-pass structure is correct and should survive the rewrite.** Ranking comes from the related `Standard_Transactions::Name`, not from a hardcoded list on the row — so renaming a display label cannot silently reorder the money. That is the right dependency direction.

**Waiver handling is also correct:** `AdjustmentStatus = "Waived"` collapses the base to 0 rather than deleting the row, so an assessed-then-waived fee stays visible at its original amount. This is what makes fixture row `EXP-004` expressible.

**Remainder is deliberately left unapplied** on the posted row instead of being forced somewhere. Unapplied cash is a fact, not an error.

## Relationships this needs wired

| Name | Shape |
|---|---|
| `PaymentApplications_forAccountTransaction` | AT 1-n PA via `fkAccountTransaction` |
| `PaymentApplications_forExpected` | ET 1-n PA via `fkExpectedTransaction` |
| `Standard_Transactions_forExpected` | ET `fkStandardTransaction` = ST `PrimaryKey` |

## Guard rails

- Partial applications are REQUIRED, not an edge case
- Fees keep a stable transaction class even if display labels change
- Never overwrite history — ADD `PaymentApplications` rows

## Fixture expectation — `fixtures/golden-month`

- `RCPT-002` / `ACCT-003`: $400 against `EXP-002` ($850 owed) leaves it **Partially Paid with 450.00 remaining**, not Paid.
- `EXP-004`: the waived $42.50 collects **0.00** and stays visible at $42.50.
- Net across the month: **850.00 unapplied**, traceable to `RCPT-004` alone.

## History

- **2026-06-18** — script-contract audit flagged it property-centered.
- **2026-07-29** — ported from ClickUp into a real body. Commit-boundary defect found during the port.
- **2026-07-29 (later)** — body stripped to pure copy text; this sidecar created. The commit steps stay in the body verbatim rather than being pre-deleted, so the body remains a faithful record of what exists rather than a half-rewrite.
