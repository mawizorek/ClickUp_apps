# HML LLC — Servicing Lifecycle

> Prose process map for the hard money loan servicing operation.  
> Each block is annotated: `[HUMAN]` `[AUTOMATED]` `[EXTERNAL]`  
> "Automated" means FileMaker handles it once triggered. "External" means the action happens outside your system (bank, borrower, mail).

---

## 1. LOAN ORIGINATION (one-time per loan)

```
[EXTERNAL] Borrower signs closing docs (note, deed of trust, disbursement)
     ↓
[HUMAN] Michael enters new loan into FileMaker:
        → Property Summary (address, ARV, rehab budget)
        → Loan record (principal, rate, term, origination date, maturity date, due day)
        → LoanProperties join (1:1 default, soft 1:N if blanket)
        → PaymentInstructions snapshot (wire info, check address, Venmo)
     ↓
[AUTOMATED] System generates ExpectedTransactions for full term:
        → One per period (monthly, interest-only)
        → Due date = loan's specific day each month
        → Amount = principal × rate ÷ 12
     ↓
[HUMAN] File closing docs (scan/link in document binder)
```

---

## 2. MONTHLY SERVICING CYCLE (per loan, per period)

This is NOT a single batch on the 1st. Each loan has its own due date.

### 2a. Pre-due-date

```
[AUTOMATED] FileMaker surfaces "upcoming due" queue (due within 7 days)
     ↓
[HUMAN] Review queue. Optional: send reminder to borrower.
     ↓
[AUTOMATED → future] Send automated payment reminder
        (v1: manual. v2: scripted email/text from FileMaker or agent)
```

### 2b. Payment arrives

```
[EXTERNAL] Money arrives: check (mail) | wire (BMO Harris) | Venmo (@JJWizorek)
     ↓
[HUMAN] Michael checks bank / Venmo for arrival.
        Identifies which loan the payment belongs to.
     ↓
[HUMAN] Records in FileMaker:
        → New AccountTransaction (date, amount, source, method)
        → PaymentApplication bridges AccountTransaction → ExpectedTransaction
        → Interest-only: full amount applies to interest (common case)
        → Partial payment: system flags shortfall, does not auto-advance
     ↓
[AUTOMATED] Ledger updates:
        → Running balance recalculates
        → Paid status on ExpectedTransaction flips
        → Late flag clears if within grace period
```

### 2c. Payment is late

```
[AUTOMATED] Grace period expires → system flags loan as LATE
     ↓
[HUMAN] Send late notice to borrower (v1: manual email/text)
     ↓
[AUTOMATED] Late fee accrues (flat or % per loan terms)
        → Added to outstanding balance
        → Reflected in next payoff calculation
```

### 2d. Receipt / confirmation

```
[HUMAN → future AUTOMATED] Send receipt to borrower confirming payment received.
        v1: manual (text/email with amount + date).
        v2: FileMaker generates receipt PDF, sends automatically.
```

---

## 3. PERIOD CLOSE (per loan, after payment window)

```
[AUTOMATED] Period closes → system rolls a fresh Payoff snapshot:
        → Principal outstanding
        → Accrued interest (per-diem × days since last payment)
        → Outstanding fees (late fees, wire fees)
        → Total payoff amount as of today
     ↓
[AUTOMATED] Payoff record stored (versioned, timestamped)
        → Always current: borrower asks "what's my payoff?" → instant answer
        → This IS the live VOM / payoff statement view
     ↓
[HUMAN] Reconcile: bank account balance vs. sum of recorded payments
        → Flag discrepancies
     ↓
[HUMAN] Report to dad (verbal, dashboard glance, or printed summary)
        → v1: Michael tells dad verbally
        → v2: Dad checks FileMaker dashboard himself
```

---

## 4. END-OF-LOAN EVENTS

### 4a. Maturity approaching

```
[AUTOMATED] System flags loans within 30/60/90 days of maturity
     ↓
[HUMAN] Send payoff demand letter to borrower
        → Uses current Payoff snapshot + per-diem for forward dating
     ↓
[EXTERNAL] Borrower arranges payoff (title company wire, etc.)
```

### 4b. Payoff received

```
[EXTERNAL] Payoff funds arrive (wire from title company, typically)
     ↓
[HUMAN] Record final AccountTransaction
     ↓
[AUTOMATED] PaymentApplication waterfall:
        → Outstanding fees first
        → Accrued interest
        → Remaining to principal
        → Loan balance → $0
     ↓
[HUMAN] Release lien (deed of reconveyance filed)
     ↓
[AUTOMATED] Loan status → CLOSED. Archived in system.
```

### 4c. Extension / renewal

```
[HUMAN] Borrower requests extension before maturity
     ↓
[HUMAN] Negotiate new terms (extended maturity, possible rate change, extension fee)
     ↓
[HUMAN] Enter modification in FileMaker:
        → Update maturity date
        → Log extension fee as AccountTransaction
        → Regenerate remaining ExpectedTransactions with new dates
```

### 4d. Default / foreclosure

```
[AUTOMATED] Loan exceeds [X] days past due → system flags DEFAULT
     ↓
[HUMAN] Attempt contact / workout with borrower
     ↓
[EXTERNAL] If unresolved: attorney initiates foreclosure
     ↓
[HUMAN] Track foreclosure status in FileMaker (dates, filings, costs)
```

---

## 5. CROSS-CUTTING PROCESSES

### 5a. Bank reconciliation

```
[HUMAN] Periodically (weekly or monthly):
        → Export or review BMO Harris statement
        → Match each deposit to an AccountTransaction in FileMaker
        → Flag unmatched deposits (unknown source)
        → Flag expected payments with no matching deposit
```

### 5b. Borrower communication log

```
[HUMAN] Every outbound contact (reminder, receipt, demand, notice)
        → Logged in FileMaker with date, method, content summary
        → Builds audit trail per borrower
```

### 5c. Document management

```
[HUMAN] Closing docs, modification letters, demand letters, receipts:
        → Stored/linked in FileMaker document binder per property/loan
        → Retrievable by property, borrower, or loan
```

---

## DELEGATION LADDER (per Michael's J3 principle)

Every `[HUMAN]` step follows this progression:

1. **Michael does it manually** — proves the workflow works, documents friction
2. **Michael scripts/automates it** — FileMaker script, calculated field, or trigger
3. **Delegate to dad** — only after proven, only lightweight interaction (confirm, glance)
4. **Delegate to agent/script** — fully autonomous, Michael monitors

No step jumps levels. Manual-first, delegate-after-proven.

---

## FILE MAP

| File | Purpose |
|------|--------|
| `process/servicing-lifecycle.md` | This file. The full process map. |
| `tables/` | Schema definitions per base table |
| `scripts/` | FileMaker script specs |
| `layouts/` | Layout architecture + render specs |
| `fixtures/` | Test data (Golden Month, etc.) |
| `calculations/` | Calculated field definitions |
| `relationships/` | Relationship graph documentation |
| `meta/design-decisions.md` | Fiona's DL (schema/build decisions) |
| `BUILD-SHEET.md` | Current build order + status |

---

*Last updated: 2026-08-02 · Source: DL decisions J1-J4, Q1-Q3*
