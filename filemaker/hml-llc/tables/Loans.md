# Loans

**Role:** servicing-parent · **Status:** locked · **App:** hml-llc

> The real servicing parent. All loan terms + servicing status re-homed here off `PropertySUMMARIES`. The financial parent of the transaction ledgers and payoffs.

## Fields

| Field | Type | Key | Category | Status | Notes |
|---|---|---|---|---|---|
| PrimaryKey | text-uuid | pk | key | | |
| CreationTimestamp | timestamp | audit | audit | | |
| CreatedBy | text | audit | audit | | |
| ModificationTimestamp | timestamp | audit | audit | | |
| ModifiedBy | text | audit | audit | | |
| fkProperty | text-uuid | fk | key | | secured-by property |
| fkBorrower | text-uuid | fk | key | pending | party-table decision |
| fkCurrentPayoff | text-uuid | fk | key | pending | points at current Payoffs row; used by payoff calcs |
| LoanNumber | text | plain | terms | | |
| OriginationDate | date | plain | terms | | |
| ClosingDate | date | plain | terms | pending | used by calc_NextMaturityDate; confirm presence in file |
| OriginalPrincipal | number | plain | terms | naming | principal basis (schema JSON currently calls this `LoanAmount` — reconcile) |
| InterestRateAnnual | number | plain | terms | naming | annual rate (schema JSON currently `InterestRate` — reconcile) |
| OriginationPoints | number | plain | terms | | rate/fraction feeding calc_originationPoints |
| MaturationPoints | number | plain | terms | | |
| MaturationTerm_inDays | number | plain | terms | | |
| LoanTerm_inDays | number | plain | terms | | |
| GraceDays | number | plain | terms | pending | read by ExpectedTransactions.calc_lateAfterDate; confirm presence |
| ServicingStatus | text | plain | status | | should resolve to a real status PK, not free text |

## Calculations

**`calc_CurrentPrincipalBalance`** — Number, stored. Current principal basis.
```
OriginalPrincipal
```

**`calc_originationPoints`** — Number, stored. Origination-points amount.
```
OriginalPrincipal * OriginationPoints
```

**`calc_MaturationPayment`** — Number, stored. Maturity-side payment amount.
```
OriginalPrincipal * MaturationPoints
```

**`calc_MonthlyPayment`** — Number, stored. Recurring interest/payment helper.
```
OriginalPrincipal * InterestRateAnnual / 12
```

**`calc_perDiemInterest`** — Number, unstored. Per-diem interest helper.
```
OriginalPrincipal * InterestRateAnnual / 365
```

**`calc_FirstMaturation`** — Number, stored. First maturation milestone helper.
```
Case (
  not IsEmpty ( OriginationDate ) and not IsEmpty ( MaturationTerm_inDays ) ;
    OriginationDate + MaturationTerm_inDays ;
  ""
)
```

**`calc_NextMaturityDate`** — Date, unstored. Next maturity milestone, distinct from next due date.
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

**`calc_NextDueDate`** — Date, unstored. Next collectible expected due date.
```
GetAsDate (
  ExecuteSQL (
    "SELECT MIN(DueDate) FROM ExpectedTransactions WHERE fkLoan = ? AND DueDate >= ?" ;
    "" ; "" ; PrimaryKey ; Get ( CurrentDate )
  )
)
```

**`calc_TotalOutstanding`** — Number, unstored. Total outstanding balance helper. Prefers a frozen payoff if one exists, else sums remaining expected.
```
Let (
[
  _currentPayoff = ExecuteSQL (
    "SELECT TotalPayoffAmount FROM Payoffs WHERE PrimaryKey = ?" ;
    "" ; "" ; fkCurrentPayoff
  ) ;
  _remainingExpected = ExecuteSQL (
    "SELECT COALESCE(SUM(CASE WHEN et.AmountAdjusted IS NOT NULL THEN et.AmountAdjusted ELSE et.OriginalAmount END),0) - COALESCE(SUM(pa.AmountApplied),0) FROM ExpectedTransactions et LEFT JOIN PaymentApplications pa ON et.PrimaryKey = pa.fkExpectedTransaction WHERE et.fkLoan = ?" ;
    "" ; "" ; PrimaryKey
  )
] ;
  Case (
    not IsEmpty ( _currentPayoff ) ; GetAsNumber ( _currentPayoff ) ;
    GetAsNumber ( _remainingExpected )
  )
)
```

**`calc_CurrentPayoffAmount`** — Number, unstored. Current all-in payoff helper. Frozen payoff if present, else `calc_TotalOutstanding`.
```
Let (
  _currentPayoff = ExecuteSQL (
    "SELECT TotalPayoffAmount FROM Payoffs WHERE PrimaryKey = ?" ;
    "" ; "" ; fkCurrentPayoff
  ) ;
  Case (
    not IsEmpty ( _currentPayoff ) ; GetAsNumber ( _currentPayoff ) ;
    calc_TotalOutstanding
  )
)
```

**`calc_expROI`** — Number, stored. Analytical ROI helper kept by decision.
```
Let (
[
  _expectedInterest = calc_MonthlyPayment * Ceiling ( LoanTerm_inDays / 30.5 ) ;
  _originationRevenue = calc_originationPoints ;
  _maturityRevenue = calc_MaturationPayment
] ;
  Case (
    IsEmpty ( OriginalPrincipal ) or OriginalPrincipal = 0 ; "" ;
    ( _expectedInterest + _originationRevenue + _maturityRevenue ) / OriginalPrincipal
  )
)
```

## Relationships

- `Loans.fkProperty` → `PropertySUMMARIES.PrimaryKey` (many-to-one, locked) — loan secured by property; property-first UX, loan-first schema
- `Loans.fkBorrower` → `Organizations.PrimaryKey` (many-to-one, pending)
- `Loans.fkCurrentPayoff` → `Payoffs.PrimaryKey` (many-to-one, pending)
- Parent of `ExpectedTransactions.fkLoan`, `AccountTransactions.fkLoan`, `Payoffs.fkLoan` (all locked)

## Open Items

- **Field-naming reconciliation (blocking calc wiring):** calc text uses `OriginalPrincipal` / `InterestRateAnnual` / `ClosingDate` / `GraceDays` / `fkCurrentPayoff`; `schema/tables.json` uses `LoanAmount` / `InterestRate` and omits the latter three. Confirm the live-file names and align schema JSON + calc text.
- Finish calc-name cleanup to one consistent `calc_` family; confirm `ServicingStatus` is a real status reference.
- Later renames worth considering: `calc_originationPoints` → `calc_OriginationPointsAmount`; confirm `calc_FirstMaturation` is the forever name.

## Changelog

- 2026-07-15: All 11 loan-math formulas embedded inline (were in meta/calculation-fields.md).
- 2026-07-14: Per-table file; absorbed full loan-terms field set + calc inventory from legacy docs; flagged principal/rate naming drift.
