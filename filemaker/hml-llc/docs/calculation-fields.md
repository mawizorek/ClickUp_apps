# Calculation Fields

> Canonical home for calculation-field definitions and FileMaker calc-option text for the current servicing core. **Migrated from ClickUp (2026-07-06).** Companion to [`tables-and-fields.md`](./tables-and-fields.md).

## Scope

Covers the active HML servicing stack: `GLOBAL_USE_VARIABLES`, `PropertySUMMARIES`, `Loans`, `ExpectedTransactions`.

For now, `PaymentApplications`, `PaymentInstructions`, `StandardTransactions`, and `Payoffs` do **not** require dedicated calc fields in the active v1 core.

## Current calculation inventory

| Table | Field | Result | Storage | Purpose |
|---|---|---|---|---|
| GLOBAL_USE_VARIABLES | `calc_filePath` | Text | Unstored | Current file path/location. |
| GLOBAL_USE_VARIABLES | `calc_fileName` | Text | Unstored | Current file name. |
| GLOBAL_USE_VARIABLES | `calc_hostedStatus` | Text | Unstored | Hosted vs local helper. |
| GLOBAL_USE_VARIABLES | `calc_fileSizeMB` | Number | Unstored | Numeric file size helper; append "MB" only in display contexts. |
| PropertySUMMARIES | `countNumDocuments` | Number | Unstored | Count of related property documents. |
| Loans | `calc_CurrentPayoffAmount` | Number | Unstored | Current all-in payoff helper. |
| Loans | `calc_CurrentPrincipalBalance` | Number | Stored | Current principal basis. |
| Loans | `calc_expROI` | Number | Stored | Analytical ROI helper kept by decision. |
| Loans | `calc_FirstMaturation` | Number | Stored | First maturation milestone helper. |
| Loans | `calc_MaturationPayment` | Number | Stored | Maturity-side payment amount. |
| Loans | `calc_MonthlyPayment` | Number | Stored | Recurring interest/payment helper. |
| Loans | `calc_NextDueDate` | Date | Unstored | Next collectible expected due date. |
| Loans | `calc_NextMaturityDate` | Date | Unstored | Next maturity milestone, distinct from next due date. |
| Loans | `calc_originationPoints` | Number | Stored | Origination-points amount helper. |
| Loans | `calc_perDiemInterest` | Number | Unstored | Per-diem interest helper. |
| Loans | `calc_TotalOutstanding` | Number | Unstored | Total outstanding balance helper. |
| ExpectedTransactions | `calc_amountPaid` | Number | Unstored | Total applied amount from PaymentApplications. |
| ExpectedTransactions | `calc_islate` | Number | Unstored | Late/not-late 1/0 helper. |
| ExpectedTransactions | `calc_lateAfterDate` | Date | Unstored | Late threshold date. |
| ExpectedTransactions | `calc_remaining` | Number | Unstored | Remaining unpaid balance. |

## FileMaker calc-option text

### GLOBAL_USE_VARIABLES

`calc_filePath`
```
Get ( FilePath )
```

`calc_fileName`
```
Get ( FileName )
```

`calc_hostedStatus`
```
If ( Get ( MultiUserState ) > 1 ; "Hosted" ; "Local" )
```

`calc_fileSizeMB`
```
Let (
  ~bytes = Get ( FileSize ) ;
  Round ( ~bytes / 1048576 ; 2 )
)
```

### PropertySUMMARIES

`countNumDocuments`
```
GetAsNumber (
  ExecuteSQL (
    "SELECT COUNT(PrimaryKey) FROM Documents WHERE fkProperty = ?" ;
    "" ;
    "" ;
    PrimaryKey
  )
)
```

### Loans

`calc_CurrentPrincipalBalance`
```
OriginalPrincipal
```

`calc_NextDueDate`
```
GetAsDate (
  ExecuteSQL (
    "SELECT MIN(DueDate) FROM ExpectedTransactions WHERE fkLoan = ? AND DueDate >= ?" ;
    "" ;
    "" ;
    PrimaryKey ;
    Get ( CurrentDate )
  )
)
```

`calc_NextMaturityDate`
```
Let (
  [
    _baseDate = Case ( not IsEmpty ( ClosingDate ) ; ClosingDate ; OriginationDate ) ;
    _termDays = MaturationTerm_inDays
  ] ;
  Case (
    not IsEmpty ( _baseDate ) and not IsEmpty ( _termDays ) ; _baseDate + _termDays ;
    ""
  )
)
```

`calc_FirstMaturation`
```
Case (
  not IsEmpty ( OriginationDate ) and not IsEmpty ( MaturationTerm_inDays ) ;
    OriginationDate + MaturationTerm_inDays ;
  ""
)
```

`calc_perDiemInterest`
```
OriginalPrincipal * InterestRateAnnual / 365
```

`calc_MaturationPayment`
```
OriginalPrincipal * MaturationPoints
```

`calc_MonthlyPayment`
```
OriginalPrincipal * InterestRateAnnual / 12
```

`calc_originationPoints`
```
OriginalPrincipal * OriginationPoints
```

`calc_TotalOutstanding`
```
Let (
[
  _currentPayoff = ExecuteSQL (
    "SELECT TotalPayoffAmount FROM Payoffs WHERE PrimaryKey = ?" ;
    "" ;
    "" ;
    fkCurrentPayoff
  ) ;
  _remainingExpected = ExecuteSQL (
    "SELECT COALESCE(SUM(CASE WHEN et.AmountAdjusted IS NOT NULL THEN et.AmountAdjusted ELSE et.OriginalAmount END),0) - COALESCE(SUM(pa.AmountApplied),0) FROM ExpectedTransactions et LEFT JOIN PaymentApplications pa ON et.PrimaryKey = pa.fkExpectedTransaction WHERE et.fkLoan = ?" ;
    "" ;
    "" ;
    PrimaryKey
  )
] ;
  Case (
    not IsEmpty ( _currentPayoff ) ; GetAsNumber ( _currentPayoff ) ;
    GetAsNumber ( _remainingExpected )
  )
)
```

`calc_CurrentPayoffAmount`
```
Let (
  _currentPayoff = ExecuteSQL (
    "SELECT TotalPayoffAmount FROM Payoffs WHERE PrimaryKey = ?" ;
    "" ;
    "" ;
    fkCurrentPayoff
  ) ;
  Case (
    not IsEmpty ( _currentPayoff ) ; GetAsNumber ( _currentPayoff ) ;
    calc_TotalOutstanding
  )
)
```

`calc_expROI`
```
Let (
[
  _expectedInterest = calc_MonthlyPayment * Ceiling ( LoanTerm_inDays / 30.5 ) ;
  _originationRevenue = calc_originationPoints ;
  _maturityRevenue = calc_MaturationPayment
] ;
  Case (
    IsEmpty ( OriginalPrincipal ) or OriginalPrincipal = 0 ;
      "" ;
    ( _expectedInterest + _originationRevenue + _maturityRevenue ) / OriginalPrincipal
  )
)
```

### ExpectedTransactions

`calc_lateAfterDate`
```
Let (
[
  _loanGrace = ExecuteSQL (
    "SELECT GraceDays FROM Loans WHERE PrimaryKey = ?" ;
    "" ;
    "" ;
    fkLoan
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

`calc_islate`
```
Case (
  IsEmpty ( DueDate ) ; 0 ;
  calc_remaining <= 0 ; 0 ;
  Get ( CurrentDate ) > calc_lateAfterDate ; 1 ;
  0
)
```

`calc_amountPaid`
```
GetAsNumber (
  ExecuteSQL (
    "SELECT COALESCE(SUM(AmountApplied),0) FROM PaymentApplications WHERE fkExpectedTransaction = ?" ;
    "" ;
    "" ;
    PrimaryKey
  )
)
```

`calc_remaining`
```
Let (
  _targetAmount = Case (
    not IsEmpty ( AmountAdjusted ) ; AmountAdjusted ;
    OriginalAmount
  ) ;
  _targetAmount - calc_amountPaid
)
```

## Locked nuance

- `calc_NextDueDate` and `calc_NextMaturityDate` are **not** synonyms.
- `PayoffDisplayDate` is a payoff statement display date, not a creation/prepared timestamp.
- `CreationTimestamp` on `Payoffs` covers when the record was actually generated.
- `GoodThroughDate` is the separate payoff-validity endpoint.

## Still worth normalizing later

- Rename `calc_originationPoints` to something clearer like `calc_OriginationPointsAmount` if the current name gets muddy.
- Decide whether `calc_FirstMaturation` is the right forever name or a more explicit milestone helper.
- Push final calc naming rules into [`data-standards.md`](./data-standards.md) once this schema pass cools down.
