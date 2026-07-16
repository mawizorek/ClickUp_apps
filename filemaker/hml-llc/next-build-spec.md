# HML_LLC — Next Build Spec (v2)

> One file, overwritten each cycle. Version in this header, not the filename.

## Scratch intake

- Migration of docs from ClickUp into this repo folder (Phase 1 of the FileMaker window rollout).

## Next build

- Finish canonical schema lock: remaining rename/normalize items (see `docs/changelog.md`).
- Build the Global Setup utility layer (HMLLC-2737, prepared).
- Build Loans / Payoffs / PaymentInstructions infrastructure (HMLLC-2738, prepared).
- Implement property intake, import, and output workflows (HMLLC-2739, open).
- **Date-scoped payoff (as-of + good-through) — see design block below.** Unblocks the fastest path: balloon-note contract in → expected-only ledger → exported payoff at any date.

## Design — date-scoped payoff (NEW, v2)

### Problem

Today `Loans.calc_TotalOutstanding` / `calc_CurrentPayoffAmount` are **date-blind**: they sum *all* remaining expected rows regardless of `DueDate` and never touch `calc_perDiemInterest`. On a nothing-paid balloon note, an origination-dated payoff and a today-dated payoff return the identical undiscounted total — so the origination-vs-current comparison never diverges. The per-diem accrual layer is the entire delta and nothing consumes it.

### Fastest happy path (nothing paid, expected-only ledger)

1. One `Loans` record from the balloon-note contract (`OriginationDate`, `ClosingDate`, `OriginalPrincipal`, `InterestRateAnnual`, `OriginationPoints`, `MaturationPoints`, `MaturationTerm_inDays`, `LoanTerm_inDays`, `GraceDays`).
2. Spawn `ExpectedTransactions` schedule: origination points (day 0), monthly interest rows (anchored to origination day-of-month), maturation fee, principal balloon at maturity.
3. No `AccountTransactions` / `PaymentApplications` → `calc_amountPaid = 0`, `calc_remaining = OriginalAmount` on every row.
4. Compute payoff **for a target date**, freeze into a `Payoffs` snapshot, export.

### Model: parameterized payoff for a target date D

Payoff(D) = principal (always paid in full on payoff) + fees/interest due on-or-before D + per-diem accrual for the partial period since the last scheduled interest date through D.

Build it as ONE custom function so as-of and good-through share the exact same math (DRY):

**`fn_PayoffForDate ( loanID ; targetDate )`** — returns Number.
```
Let (
[
  _principal = ExecuteSQL (
    "SELECT calc_CurrentPrincipalBalance FROM Loans WHERE PrimaryKey = ?" ; "" ; "" ; loanID ) ;

  // fees + scheduled interest already due on/before target date, still unpaid.
  // Excludes the principal-balloon row (principal counted above) to avoid double-count.
  _dueItems = ExecuteSQL (
    "SELECT COALESCE(SUM(CASE WHEN et.AmountAdjusted IS NOT NULL THEN et.AmountAdjusted ELSE et.OriginalAmount END),0) " &
    "- COALESCE(SUM(pa.AmountApplied),0) " &
    "FROM ExpectedTransactions et " &
    "LEFT JOIN PaymentApplications pa ON et.PrimaryKey = pa.fkExpectedTransaction " &
    "JOIN Standard_Transactions st ON et.fkStandardTransaction = st.PrimaryKey " &
    "WHERE et.fkLoan = ? AND et.DueDate <= ? AND st.Name <> 'Principal'" ;
    "" ; "" ; loanID ; targetDate ) ;

  // last scheduled interest DueDate on/before target date (per-diem stub start).
  // Falls back to origination/closing base if no interest row has come due yet.
  _lastInterestDue = ExecuteSQL (
    "SELECT MAX(et.DueDate) FROM ExpectedTransactions et " &
    "JOIN Standard_Transactions st ON et.fkStandardTransaction = st.PrimaryKey " &
    "WHERE et.fkLoan = ? AND st.Name = 'Interest Payment' AND et.DueDate <= ?" ;
    "" ; "" ; loanID ; targetDate ) ;

  _base = ExecuteSQL (
    "SELECT COALESCE(ClosingDate, OriginationDate) FROM Loans WHERE PrimaryKey = ?" ; "" ; "" ; loanID ) ;

  _stubStart = Case ( not IsEmpty ( _lastInterestDue ) ; GetAsDate ( _lastInterestDue ) ; GetAsDate ( _base ) ) ;
  _perDiem = ExecuteSQL ( "SELECT calc_perDiemInterest FROM Loans WHERE PrimaryKey = ?" ; "" ; "" ; loanID ) ;
  _stubDays = Max ( 0 ; GetAsDate ( targetDate ) - _stubStart ) ;
  _stubInterest = GetAsNumber ( _perDiem ) * _stubDays
] ;
  GetAsNumber ( _principal ) + GetAsNumber ( _dueItems ) + _stubInterest
)
```

### Consuming calc fields on `Loans`

- **`calc_PayoffAsOf`** — Number, unstored. `fn_PayoffForDate ( PrimaryKey ; AsOfDate )`. AsOfDate is the payoff's effective date (the exported figure).
- **`calc_PayoffGoodThrough`** — Number, unstored. `fn_PayoffForDate ( PrimaryKey ; GoodThroughDate )`. GoodThroughDate = AsOfDate + float buffer (wire/mail lead time); per-diem runs further, so this quote stays valid through that date.

At origination (AsOfDate = OriginationDate) the stub is 0 days → payoff = principal + origination points. At current date the stub accrues `perDiem × elapsed`. The good-through figure adds `perDiem × buffer` on top. That linear per-diem layer IS the origination-vs-current delta the comparison is about.

### Freeze into Payoffs

- `AsOfDate` ← the as-of date; `TotalPayoffAmount` ← `calc_PayoffAsOf` frozen; `GoodThroughDate` + a frozen good-through figure captured at issue.
- `PayoffDisplayDate` is statement-display only (not prepared timestamp); `CreationTimestamp` covers when generated. Frozen values in, live recompute out.

### Blockers / guardrails specific to this build

- **`fkCurrentPayoff` must be empty** during live computation or `calc_TotalOutstanding` / `calc_CurrentPayoffAmount` short-circuit to a prior frozen payoff instead of the live expected sum.
- **Field-naming drift is blocking:** the function text uses `OriginalPrincipal` / `InterestRateAnnual` / `ClosingDate`; `schema/tables.json` still uses `LoanAmount` / `InterestRate` and omits `ClosingDate` / `GraceDays`. Reconcile before wiring.
- Confirm the locked `Standard_Transactions::Name` values used in the SQL (`Principal`, `Interest Payment`) match the live file exactly — the `st.Name` filters depend on them.
- Formula bodies graduate inline into `tables/Loans.md` (calc-inline rule) once built; the custom function lands in `functions/`.

## In review

- `PaymentInstructions` record-based rebuild (signature: container vs document-module reference).

## Futures

- Reporting layer beyond core lifecycle.
- Two-way ClickUp sync (explicitly NOT v1).
- Phase 3: script notes as source files.

## Known guardrails

- Property-first UX, loan-first schema. Do not re-parent transactions onto Property.
- Payoffs are frozen snapshots; never recompute an issued payoff.
- One-way publish (FileMaker -> ClickUp) only in v1; button-driven, no middleware.
- Single file, single user, local-first unless a real constraint forces a split.
