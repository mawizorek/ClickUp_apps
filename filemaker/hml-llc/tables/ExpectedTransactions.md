# ExpectedTransactions

**Role:** ledger · **Status:** locked · **App:** hml-llc

> Scheduled/expected transactions (one record per expected due item). Parent is `Loans` (`fkProperty` removed once `fkLoan` established). Also referred to in early design as `LoanSchedule`.

## Fields

| Field | Type | Key | Category | Notes |
|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | UUID, auto |
| CreationTimestamp | timestamp | audit | audit | |
| CreatedBy | text | audit | audit | |
| ModificationTimestamp | timestamp | audit | audit | |
| ModifiedBy | text | audit | audit | |
| fkLoan | text-uuid | fk | key | authoritative parent |
| fkStandardTransaction | text-uuid | fk | key | type |
| fkStatus | text-uuid | fk | key | Outstanding / Paid / Partially Paid / Waived (status PK) |
| DueDate | date | plain | detail | anchored to origination day-of-month |
| OriginalAmount | number | plain | detail | canonical expected amount (for late fees: calculated 5% amount) |
| AmountAdjusted | number | plain | detail | actual amount to collect; supports waiver/discount |
| AdjustmentReason | text | plain | detail | optional |
| AdjustmentStatus | text | plain | detail | Normal / Discounted / Waived |
| SequenceNumber | number | plain | detail | 1..n per loan; enforces uniqueness |
| GraceDaysOverride | number | plain | detail | row-level override; else falls back to Loans.GraceDays |
| Notes | text | plain | detail | |

## Calculations

**`calc_amountPaid`** — Number, unstored. Total applied amount from PaymentApplications.
```
GetAsNumber (
  ExecuteSQL (
    "SELECT COALESCE(SUM(AmountApplied),0) FROM PaymentApplications WHERE fkExpectedTransaction = ?" ;
    "" ; "" ; PrimaryKey
  )
)
```

**`calc_remaining`** — Number, unstored. Remaining unpaid balance (adjusted amount if set, else original, minus applied).
```
Let (
  _targetAmount = Case (
    not IsEmpty ( AmountAdjusted ) ; AmountAdjusted ;
    OriginalAmount
  ) ;
  _targetAmount - calc_amountPaid
)
```

**`calc_lateAfterDate`** — Date, unstored. Late threshold date (due date + grace, row override beats loan default).
```
Let (
[
  _loanGrace = ExecuteSQL (
    "SELECT GraceDays FROM Loans WHERE PrimaryKey = ?" ;
    "" ; "" ; fkLoan
  ) ;
  _graceDays = Case (
    not IsEmpty ( GraceDaysOverride ) ; GraceDaysOverride ;
    not IsEmpty ( _loanGrace ) ; GetAsNumber ( _loanGrace ) ;
    0
  )
] ;
  Case (
    not IsEmpty ( DueDate ) ; DueDate + _graceDays ;
    ""
  )
)
```

**`calc_islate`** — Number (1/0), unstored. Late/not-late helper; not late if fully paid.
```
Case (
  IsEmpty ( DueDate ) ; 0 ;
  calc_remaining <= 0 ; 0 ;
  Get ( CurrentDate ) > calc_lateAfterDate ; 1 ;
  0
)
```

## Relationships

- `ExpectedTransactions.fkLoan` → `Loans.PrimaryKey` (many-to-one, locked)
- `ExpectedTransactions.fkStandardTransaction` → `Standard_Transactions.PrimaryKey` (many-to-one, locked)
- Joined via `PaymentApplications.fkExpectedTransaction` (locked)

## Open Items

- Confirm `fkStatus` resolves to a real `statuses_*` record PK.
- One canonical amount family (`OriginalAmount` + `AmountAdjusted`); do not reintroduce `AmountExpected`/`OriginalAmount` duplicates.

## Changelog

- 2026-07-15: The 4 calc formulas embedded inline (were in meta/calculation-fields.md).
- 2026-07-14: Per-table file; absorbed adjustment/sequence/grace fields + calc set from legacy docs.
