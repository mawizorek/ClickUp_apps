# 🧪 The Golden Month — schema review fixture

**One worked month of one borrower's activity, as importable TSV.** March 2026. Import it and the relationship graph populates with real joins.

## Why one month beats nine table samples

Nine isolated sample files prove nothing — any nine files look plausible alone. These files **share the same primary keys**, so they can only join if the keys, the grain AND the parentage are all correct.

**Referential consistency is the proof.** Get the schema wrong and the fixture *refuses to reconcile*. The data is the test of the schema, not an illustration of it.

## ⚠️ It is deliberately ugly, and that is the deliverable

A tidy month — one loan, one on-time payment — imports cleanly under **any** schema. That is a test that cannot fail, and concluding "the schema is fine" from it is exactly how `fkProperty` survived six weeks inside artifact pages that *looked* finished.

Every row below was chosen because it kills something. Late-fee-waived rows and unassigned cash will make the hub screen look like a mess. **If it renders pretty, it is not doing its job.**

---

## 🔑 READ THIS BEFORE IMPORTING or you will silently destroy the fixture

`PrimaryKey` is auto-enter `Get(UUID)` with **"do not allow modification"** on every table. Import as-is and **FileMaker throws these keys away and mints its own — destroying every foreign key in every other file.**

It fails *quietly*: all rows import, no errors, and the portals just come up empty.

**Fix:** temporarily uncheck *Prohibit modification during data entry* on `PrimaryKey` for the seeding pass, and keep the readable keys below rather than converting to UUIDs.

`LOAN-001` appearing in six files is a **feature** — you can verify a join with your eyes on a phone, which is the entire point of a review fixture. This is never production data.

---

## Import order (FK parents first)

1. `PropertySUMMARIES.tsv`
2. `Standard_Transactions.tsv`
3. `PaymentInstructions.tsv`
4. `Loans.tsv`
5. `ExpectedTransactions.tsv`
6. `ReceivedFunds.tsv` ← 🚨 the table DL **Q8** approved
7. `AccountTransactions.tsv`
8. `PaymentApplications.tsv`
9. `Payoffs.tsv`

`Import Records` → **matching by field name**. TSV not CSV: addresses and notes contain commas and FileMaker's CSV quoting is a bad time.

---

## What each row proves

| Row | The thing it kills |
|---|---|
| **`RCPT-001`** | **One check, two loans.** $1,966.67 covering interest on `LOAN-001` *and* `LOAN-003`. **Cannot be expressed without `ReceivedFunds`** — this row is what settled Q8 empirically instead of by argument. |
| **`RCPT-004`** | **Cash with no home.** $850, memo illegible, no borrower. Under a loan-parented model this row is *illegal*. It must be a valid resting state, not a data error. |
| **`APP-003`** | **Partial payment.** $400 against $850 owed. Proves `AmountApplied` must be independent and that `ExpectedTransactions` needs a computed remainder, not a paid/unpaid flag. |
| **`EXP-004`** | **Late fee assessed then waived.** $42.50 → $0.00 on purpose. If the schema cannot say *"the fee was $42.50, we collected nothing, deliberately"* then `OriginalAmount`/`AdjustedAmount` is the wrong field pair. |
| **`PAYOFF-001` vs `ACCT-004`** | **The freeze.** Payoff issued 03-18; payment posts 03-20. **The frozen total must not move.** The only way to prove the freeze is real rather than described. |
| **`PROP-001` → 2 loans** | Kills "one property = one loan," which several script pages still assume. |
| **`LOAN-003` `Paid Off`** | A closed loan still carrying history. Proves status is not a filter that hides truth. |

---

## ✅ The reconciliation — this IS the acceptance test

| Check | Must equal |
|---|---|
| Sum of `ReceivedFunds.Amount` | **43,216.67** |
| Sum of `PaymentApplications.AmountApplied` | **42,366.67** |
| Unapplied cash (`calc_AmountUnapplied` across all receipts) | **850.00**, traceable to `RCPT-004` alone |
| `PAYOFF-001.frozen_TotalDue` after `ACCT-004` posts | **40,466.67, unchanged** |
| `EXP-002` remaining | **450.00** |
| `EXP-004` collected | **0.00**, status `Waived`, and the $42.50 still visible |
| `EXP-006` | still **outstanding** — April has not happened |

**If unapplied cash does not come out to exactly $850.00 and trace to a single receipt, the schema is wrong. Not the fixture.**

---

## The cast

- **One borrower** — `ORG-001`, who owns both properties. Realistic for private lending and it is what makes the two-loan check possible.
- **Two properties** — `PROP-001` (1420 Elm St) and `PROP-002` (88 Ridge Rd).
- **Three loans** — `LOAN-001` and `LOAN-003` both against Elm St; `LOAN-002` against Ridge Rd. `LOAN-003` pays off mid-month.
- **Four receipts** — a two-loan check, a short Venmo, a payoff wire, and one mystery check.

## Changelog

- 2026-07-29: Created. Designed in a full audit → 9-lens Workshop → re-audit loop. The one-month-not-nine-samples shape is Clever Cleo's; the six kill-rows are Breaker Beckett's; the key-override trap is Feasible Finn's catch.
