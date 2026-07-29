# 70_SCHEDULE__Generate_Expected_Schedule — notes

**STATE: GOLDEN.** Approved direction, loan-centered, correct on the thing that broke the other scripts. **Two open defects below — read them before typing this in.**

Copy text: [`70_SCHEDULE__Generate_Expected_Schedule.fmscript`](./70_SCHEDULE__Generate_Expected_Schedule.fmscript)

---

## OPEN 1 — the date-overflow bug. This one is subtle and it breaks identity.

```
Set Variable [ $due ; Date ( Month ( $due ) + 1 ; $day ; Year ( $due ) ) ]
```

FileMaker rolls month 13 into January, so year-crossing is fine. **The problem is `$day`.** For a loan originated on the 29th, 30th or 31st, this overflows into the *following* month on short months:

| Origination day | `Date(2; 31; 2026)` resolves to |
|---|---|
| 31 | **March 3**, not February 28 |
| 30 | **March 2** |
| 29 | **March 1** |

So the due dates drift forward and, because `ScheduleKey` is built from the sequence number rather than the date, **the row identity silently stops matching the intended month.** A re-run then creates a second row for what should be the same obligation, which defeats the entire idempotence design.

**Suggested clamp** (not applied — changing date identity changes keys, which is Michael's call):

```
Let ( [ _m = Month ( $due ) + 1 ; _y = Year ( $due ) ;
        _lastDay = Day ( Date ( _m + 1 ; 1 ; _y ) - 1 ) ] ;
  Date ( _m ; Min ( $day ; _lastDay ) ; _y )
)
```

**Why it was invisible:** all three fixture loans originate on the 15th, 10th and 1st. **None of them trip it.** A test suite that cannot fail is how this survived. If you want to see it, add a loan originated on the 31st.

## OPEN 2 — `fkStatus` is unset

 Both create branches skip status entirely. `fkStatus` must resolve to a real status record PK, never free text pretending to be a foreign key. Blocked on the status-resolver helper, which does not exist yet. Rows will generate with an empty status until it does.

---

## Why the design is right

**Idempotence via a stable key, not a diff.** Every generated row carries:

```
ScheduleKey = fkLoan & "." & fkStandardTransaction & "." & SequenceNumber
```

That key — not the date, not the amount — is what the script trusts when deciding whether a row already exists. Michael can hit the Schedule button twice without fear, which is the whole point.

**Due-date rule (locked):** the term is treated in whole months and interest dates stay anchored to the day-of-month of `OriginationDate`. Origination Jun 18 gives Jul 18, Aug 18, Sep 18. The *current* date matters for UI and reporting and is never the identity of a scheduled row.

**Deliberately small first pass:** monthly interest rows plus one balloon principal row at maturity. **No late-fee rows here** — that is `70_SCHEDULE__Assess_Late_Fees`, on purpose, because fee assessment has different triggers and different waiver semantics.

**It reads `Loans`, never `PropertySUMMARIES`.** Required fields: `PrimaryKey`, `OriginationDate`, `MaturityDate`, `OriginalPrincipal`, `InterestRateAnnual`, `PaymentCadence`, `GraceDays`, `LoanNumber`, `fkLoanStatus`.

## Button contract from `h_Hub`

```
Param (
    PText ( "loanID" ; GLOBAL_HUB::g_fkCurrentLoan ) ;
    PText ( "mode" ; "create_or_refresh" ) ;
    PText ( "source" ; "hub_schedule_button" )
)
```

The hub resolves the loan before calling. This script does not resolve context.

## Guard rails

- Do NOT generate by property context alone
- Do NOT duplicate rows on re-run — `ScheduleKey` is the defense
- Do NOT overwrite paid or already-applied history in `create_or_refresh` mode
- `regenerate_open_only` touches ONLY rows with nothing applied against them

## Also needs the txn wrapper

This is a multi-row write, so it belongs inside `txn_Begin` / `txn_Commit` / `txn_Rollback` once those exist. Its per-row commits are **less dangerous than the waterfall's** — a half-generated schedule is recoverable by re-running, since the keys are stable — but a partial generate still leaves a loan looking scheduled when it is not.

## Fixture expectation — `fixtures/golden-month`

| Loan | Terms | Monthly interest | Matches |
|---|---|---|---|
| `LOAN-001` | 150,000 at 12% | **1,500.00** | `EXP-001`, `EXP-006` |
| `LOAN-002` | 85,000 at 12% | **850.00** | `EXP-002` |
| `LOAN-003` | 40,000 at 14% | **466.67** | `EXP-003`; balloon 40,000 = `EXP-005` |

## History

- **2026-06-18** — rewritten loan-centered; implementation approved by Michael.
- **2026-07-29** — ported from ClickUp into a real body. Month-overflow bug found during the port and flagged rather than silently patched.
- **2026-07-29 (later)** — body stripped to pure copy text; this sidecar created.
