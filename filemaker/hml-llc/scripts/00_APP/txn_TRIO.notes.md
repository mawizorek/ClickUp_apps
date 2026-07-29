# txn_Begin / txn_Commit / txn_Rollback — notes

**STATE: GOLDEN.** Designed, not yet built. **Build these AFTER `tables/ReceivedFunds.md` exists** — see the ordering rule below, it is a correctness matter.

Copy text: [txn_Begin](./txn_Begin.fmscript) · [txn_Commit](./txn_Commit.fmscript) · [txn_Rollback](./txn_Rollback.fmscript)

> **One notes file for three scripts, deliberately.** They are one design in three entry points; splitting the reasoning three ways would mean maintaining the same explanation in triplicate. Every other script gets its own sidecar.

---

## There is no engine transaction underneath this. Read that twice.

FileMaker 19 has no `Open Transaction` step — it arrived in **FileMaker 2023 (v20)**. Verified against the Claris FMP 20.1.2 release notes and the MBS step-by-version comparison.

**`txn_Begin` is a name borrowed from databases that really have one.** If you read that name and assume ACID, you will design something that loses money.

## What actually provides atomicity

FileMaker holds an uncommitted record **and its related uncommitted records** as one open editable state. So if every write in a routine reaches its table **through ONE relationship from ONE parent record**, a single `Revert Record` on that parent discards the entire set.

That is the whole mechanism. It is twenty years old and it works.

## The two rules that matter more than these three scripts

**1. ONE parent.** If a routine legitimately has two parents, it **cannot** be atomic on 19 — split it, or restructure so the real parent sits higher.

> This is exactly why `ReceivedFunds` had to exist first. One check across two loans has **two `Loans` parents** but only **one receipt.** The missing table and the broken rollback were the same problem wearing two hats.

**2. NO `Commit Records` between Begin and Commit.** Not one. A stray commit ends the transaction and makes everything before it permanent — **while the wrapper still reports success.** That is the silent-partial-rollback failure, and it is worse than having no rollback at all, because you believe you were protected.

⚠️ **`60_PAYMENTS__Auto_Apply_Waterfall` currently commits twice per applied row, inside its loop.** That is the single most important thing to strip when it is rewritten, and it is the reason this wrapper exists at all.

## The shape every write routine takes

```
Perform Script [ txn_Begin ; { parentTable: "ReceivedFunds", parentID: $rcptID } ]
... all writes, through relationships from that parent ...
If [ $error ]
    Perform Script [ txn_Rollback ; { reason: $error } ]
    Exit Script [ ok:false ]
End If
Perform Script [ txn_Commit ]
```

## Why each one behaves the way it does

**`txn_Begin` refuses to nest.** A nested pseudo-transaction is a lie: the inner commit would end the outer one, and the outer rollback could no longer reach the inner writes. Better to fail on the second Begin than to pretend.

**`txn_Commit` never swallows an error.** A wrapper that eats a failure to keep a routine moving is worse than no wrapper, because the caller believes the write landed. On any commit error it returns `ok:false` with the FileMaker error code and **leaves the record uncommitted** so the caller can roll back and log first. It does not decide for the caller and it does not retry.

**Validation errors are not transaction errors.** 507 (validate by calc), 506 (required), 504 (unique) mean the DATA is wrong, not that the transaction broke. Those route through the shared `commitRecord` helper so the user-facing wording is single-sourced from `MSG_ValueListErrors` instead of being reinvented. `Get(LastError)` returns a code and never the field's own message — which is precisely why that helper exists.

**`txn_Rollback` has no repair path, by design.** No compensating deletes, no hunting for leaked rows. A repair routine that cleans up half-written data is a tool for discovering you already sent a wrong payoff quote. Prevention only: if the pattern was violated, the correct outcome is a loud failure and a human looking at it.

⚠️ **The honest limit:** if a routine slipped a commit into its loop, those rows are already permanent and `txn_Rollback` **cannot reach them.** It will still report `ok:true`, because from its position nothing is pending. **The no-stray-commit rule is the load-bearing part; these scripts are only the visible part.**

## Acceptance test — run this before trusting the wrapper anywhere

Post `RCPT-001` (the two-loan check from `fixtures/golden-month`) with a deliberate failure injected **after the first `PaymentApplications` row is written.**

**Correct result: ZERO `PaymentApplications` rows and ZERO `AccountTransactions` rows exist afterward.**

If one row survives, a stray commit is still in the routine and the wrapper is decorative.

## History

- **2026-07-29** — designed. Method ruled by Michael via HML_LLC DL **Q3** ("I definitely want rollback and error catching throughout all of this"), with Dexter's call that the mechanism and the wrapper are not alternatives: build the classic single-parent pattern, then wrap it **once** so no routine improvises its own. Option 3 from Q3 (accept non-atomic writes plus an after-the-fact repair script) was rejected outright by both of us.
- **2026-07-29 (later)** — bodies stripped to pure copy text; this shared sidecar created.
