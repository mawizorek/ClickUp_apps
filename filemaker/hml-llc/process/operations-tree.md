# HML LLC — Operations Tree (single-file map)

> How every layer connects: workspace, FileMaker, external world, repo, and build timeline.
> Prose block diagrams. One file to rule them all.

---

## THE FOUR LAYERS

```
┌─────────────────────────────────────────────────────────┐
│  OPERATIONAL LAYER (ClickUp / Brain / agents)           │
│  → where work is tracked, decisions logged, sessions run│
├─────────────────────────────────────────────────────────┤
│  SYSTEM LAYER (FileMaker Pro 19, single-file, local)    │
│  → where the actual loan servicing happens              │
├─────────────────────────────────────────────────────────┤
│  EXTERNAL LAYER (banks, borrowers, attorneys, gov)      │
│  → the real world that feeds into / receives from system│
├─────────────────────────────────────────────────────────┤
│  CONFIGURATION LAYER (GitHub repo, docs, specs)         │
│  → source of truth for how the system is built          │
└─────────────────────────────────────────────────────────┘
```

---

## OPERATIONAL LAYER — ClickUp + Brain

### Space: Dad LLC

```
Dad LLC (space)
├── SUMMARIES (folder)
│   └── Property SUMMARIES (list) → one task per property in portfolio
│       ├── 342 N McNeil
│       ├── 2516 Wellons Ave
│       ├── 4661 Berta
│       ├── 1738 Willow Wood
│       ├── 1288 Davidson
│       ├── 3804 Cazassa
│       ├── 3204 Kenneth St
│       └── 5133 Bruton Ave
│
├── People (list) → borrower contacts + LLCs
│   ├── Lukas Castillo
│   ├── Parker Kimball
│   ├── Aaron Rigterink
│   ├── Cougar Capital LLC
│   ├── KFI Investments
│   └── Blue Beacon Investments ...
│
├── Bank Transactions (lists) → deposits tracked as tasks
│   └── statuses: accounted | confirmed
│
├── FY 2024 / FY 2025 / FY 2026 (lists) → fiscal year buckets
│
├── Individual property lists (one per property, legacy)
│   └── Willow Wood, Kerrville, West Levi, Northaven, etc.
│       └── [STALE] these are orphaned, inconsistent, being replaced
│
└── Build task: "Build HML_LLC FileMaker v1"
    ├── Milestone subtasks (time tracking, progress)
    ├── REO Discovery subtask (start: 2026-08-16)
    └── Decision Log (doc, linked)
```

**Role of ClickUp in the operation:**
- [PROJECT MANAGEMENT] Track the FileMaker build itself
- [DECISION LOG] Record operational decisions via Riley DL
- [FUTURE: AGENT LAYER] Comms automation, borrower reminders, reconciliation triggers
- [NOT the servicing system] FileMaker handles daily operations; ClickUp tracks the meta

### Agent ecosystem

```
Riley (realty-riley) → project manager + business analyst for HML LLC
    ├── Runs the Decision Log (Q&A + decoded judgements)
    ├── Maps processes, schemas, workflows
    ├── Interrogates Michael about the business
    └── Plans automation + scaling

Fiona → FileMaker build architect (schema, scripts, layouts)
    ├── Owns the technical schema decisions
    ├── Has her own DL (meta/design-decisions.md)
    └── Builds the actual .fmp12 file specs

Dex → dev tooling, hooks, repo maintenance
    └── Wrote sweep-for-links, maintains brain-config hooks
```

---

## SYSTEM LAYER — FileMaker Pro 19

Single file. Single user (Michael). Local-first. Dad gets read-only dashboard views.

### Tables (the data model)

```
                    ┌──────────────────────┐
                    │ GLOBAL_USE_VARIABLES │ ← app state, nav, setup, lender info
                    └──────────────────────┘

    ┌───────────────────┐         ┌──────────────────┐
    │ PropertySUMMARIES │◄────────│  LoanProperties  │ (join: 1:1 default, soft 1:N)
    │ (collateral lens) │         │                  │
    └───────────────────┘         └────────┬─────────┘
                                           │
                                  ┌────────▼─────────┐
                                  │      Loans       │ ← the financial parent
                                  │ (rate, term,     │
                                  │  maturity, etc.) │
                                  └──┬───┬───┬───┬───┘
                                     │   │   │   │
              ┌──────────────────────┘   │   │   └──────────────────────┐
              │                          │   │                          │
    ┌─────────▼──────────┐   ┌──────────▼───▼──────────┐    ┌─────────▼──────────┐
    │ ExpectedTransactions│   │   ReceivedFunds         │    │     Payoffs        │
    │ (what's owed,       │   │   (receipt parent,      │    │ (versioned payoff  │
    │  per-period, int-   │   │    atomicity anchor)    │    │  snapshots, live   │
    │  only usually)      │   │                         │    │  VOM/statement)    │
    └─────────▲──────────┘   └──────────┬──────────────┘    └──────────────────────┘
              │                          │
              │              ┌───────────▼──────────────┐
              │              │  AccountTransactions     │
              │              │  (what actually arrived  │
              │              │   at the bank)           │
              │              └───────────┬──────────────┘
              │                          │
              │              ┌───────────▼──────────────┐
              └──────────────│  PaymentApplications    │
                             │  (bridge: expected ↔    │
                             │   actual money)         │
                             └─────────────────────────┘

    ┌────────────────────┐   ┌────────────────────┐   ┌────────────────────┐
    │ PaymentInstructions│   │ Standard_Transactions│  │    Contacts        │
    │ (reusable source,  │   │ (templates/schedules │  │  + Organizations   │
    │  frozen on payoff) │   │  for recurring txns) │  │  (borrower people  │
    └────────────────────┘   └────────────────────┘   │   + LLCs)          │
                                                      └────────────────────┘
    ┌────────────────────┐
    │    Documents       │ ← binder records (closing docs, letters, receipts)
    └────────────────────┘
```

### Layouts (the UI)

```
Michael's workflow (daily operation):

[Property Hub]  →  "What properties do I have, what's their current loan?"
      │              One-click into loan detail from property context.
      ▼
[Loan Detail]   →  "This loan's full story: terms, payments, status, contacts"
      │              Portals: expected txns, received payments, payoff history.
      │              Links to: payment application, payoff generation.
      ▼
[Transactions]  →  "Bank recon view. What came in? What's unmatched?"
      │              AccountTransactions list. Filterable by date, source, status.
      ▼
[Payment App]   →  "Apply this deposit to that expected payment."
      │              Creates PaymentApplication record. Bridges the gap.
      ▼
[Payoff]        →  "Generate a fresh payoff statement for this loan."
                    Pulls current balance + per-diem + fees. Versioned snapshot.

Admin / setup:

[Global Setup]  →  Business info (lender name, address), default terms,
                    payment instruction templates, system preferences.

[Document Binder] → Per-property/loan doc storage. Closing packages,
                    modification letters, demand notices, receipts.

Dad's layer (future, read-only / lightweight):

[Dashboard]     →  Portfolio overview: which loans paid, which late,
                    total balance, total monthly income expected vs actual.
                    Dad glances. Michael's life gets easier.
```

### Interaction flow (who touches what)

```
MICHAEL (sole operator)
│
├── DAILY: check bank → record payments → apply to loans
│   [HUMAN] opens FileMaker → Transactions layout → Payment App
│
├── PER-DUE-DATE: review upcoming queue → send reminders
│   [HUMAN] checks Loan Detail portals → manually texts/emails borrower
│   [FUTURE: AUTOMATED] FileMaker or agent sends reminder on schedule
│
├── WHEN LATE: send late notice → accrue fee
│   [HUMAN] drafts notice → sends via text/email/mail
│   [AUTOMATED] FileMaker calculates fee + flags status
│
├── MONTHLY CLOSE: reconcile → roll payoff → report to dad
│   [HUMAN] bank recon in Transactions view
│   [AUTOMATED] payoff snapshot rolls per-loan
│   [HUMAN → FUTURE: DASHBOARD] dad checks status himself
│
├── AT MATURITY: demand letter → collect payoff → release lien
│   [HUMAN] generate payoff in Payoff layout → send to borrower
│   [EXTERNAL] title company wires funds
│   [HUMAN] record final payment → file lien release
│
└── SETUP: new loan → origination checklist
    [HUMAN] enters all data in FileMaker
    [HUMAN] files closing docs in Document Binder
    [AUTOMATED] system generates ExpectedTransactions for full term

DAD (lightweight interaction, future)
│
├── Glance at dashboard
├── Confirm a payment arrived (button: "yes I see it")
└── Maybe: enter a check receipt when Michael isn't around

BORROWER (receives, doesn't interact with system)
│
├── Gets payment reminder
├── Gets receipt
├── Gets late notice
├── Gets payoff statement
└── Gets demand/default letter
```

---

## EXTERNAL LAYER — The Real World

```
                    ┌─────────────────┐
                    │   BMO Harris    │ ← primary bank
                    │   (checking)    │   wire + check deposits land here
                    └────────┬────────┘
                             │ statement exports
                             ▼
                    ┌─────────────────┐
                    │   FileMaker     │ ← bank recon happens here
                    │   (system)      │
                    └────────┬────────┘
                             │ payment confirmations, notices
                             ▼
┌───────────┐     ┌──────────────────┐     ┌───────────────────┐
│  Venmo    │     │    Borrowers     │     │  Title Companies  │
│(@JJWizorek│     │ (individuals +   │     │ (payoff wires,    │
│ alt pmts) │     │  LLCs, ~8-20)    │     │  lien releases)   │
└───────────┘     └──────────────────┘     └───────────────────┘

┌───────────────┐   ┌─────────────────┐   ┌───────────────────┐
│ Christie /    │   │   Attorney      │   │  County Recorder  │
│ Saddle Creek  │   │ (foreclosure/   │   │  (deed, UCC-1,    │
│ (title co,    │   │  default only)  │   │   lien release)   │
│  closing      │   └─────────────────┘   └───────────────────┘
│  support)     │
└───────────────┘   ┌─────────────────┐
                    │  Property Mgmt  │ ← REO properties only (future)
                    │  Company (TBD)  │   rent collection, maintenance
                    └─────────────────┘
                    ┌─────────────────┐
                    │      IRS        │ ← 1098 interest reporting (annual)
                    └─────────────────┘
```

---

## CONFIGURATION LAYER — GitHub (mawizorek/ClickUp_apps)

```
filemaker/hml-llc/
├── process/
│   ├── servicing-lifecycle.md    → step-by-step lifecycle (HUMAN/AUTOMATED/EXTERNAL)
│   └── operations-tree.md        → THIS FILE (the whole map)
│
├── tables/
│   ├── PropertySUMMARIES.md      → schema: collateral/property fields
│   ├── Loans.md                  → schema: financial terms, rates, dates
│   ├── ExpectedTransactions.md   → schema: per-period obligations
│   ├── AccountTransactions.md    → schema: actual bank arrivals
│   ├── ReceivedFunds.md          → schema: receipt parent (atomicity)
│   ├── PaymentApplications.md    → schema: bridge expected ↔ actual
│   ├── Payoffs.md                → schema: versioned payoff snapshots
│   ├── PaymentInstructions.md    → schema: wire/check/venmo instructions
│   ├── Standard_Transactions.md  → schema: recurring templates
│   ├── Contacts.md               → schema: borrower people
│   ├── Organizations.md          → schema: borrower LLCs
│   ├── Documents.md              → schema: binder records
│   └── GLOBAL_USE_VARIABLES.md   → schema: app state + setup
│
├── layouts/
│   ├── property-hub.md           → spec: portfolio-level property view
│   ├── loan-detail.md            → spec: single-loan deep view
│   ├── transactions.md           → spec: bank recon + account txns
│   ├── payment-application.md    → spec: apply money to obligations
│   ├── payoff.md                 → spec: generate/view payoff statements
│   ├── document-binder.md        → spec: doc storage per property/loan
│   └── global-setup.md           → spec: business config + defaults
│
├── scripts/                      → FileMaker script definitions
├── calculations/                 → calculated field formulas
├── relationships/                → relationship graph documentation
├── fixtures/                     → test data (Golden Month scenario)
├── functions/                    → custom functions
├── value-lists/                  → value list definitions
├── meta/design-decisions.md      → Fiona's schema DL
├── notes/                        → working notes, research
├── INDEX.md                      → file index + navigation
├── README.md                     → project overview
└── next-build-spec.md            → current sprint/build target

maw-prose/apps/hml-llc/
└── build-sheet.md                → CANONICAL build order + status (moved here)
```

---

## BUILD TIMELINE

Target: demo-ready on desktop + mobile before FileMaker 2026 trial expires (~1 week buffer).

```
PHASE 1 — Foundation (schema + atomicity)         [ARCHITECTURE]
├── ReceivedFunds table built
├── txn_* rollback wrapper (atomicity on FMP19)
└── Relationship graph cleaned: property → current loan path

PHASE 2 — Data in (import + ledger)               [IMPLEMENTATION]
├── Golden Month fixture imported
├── Ledger table views operational
└── AccountTransactions + ExpectedTransactions populated

PHASE 3 — Core UI (hubs + portals)                [IMPLEMENTATION]
├── Loan Detail hub with portals (expected, received, payoff history)
├── Property Hub (portfolio view, one-click into loan)
└── Transactions layout (bank recon view)

PHASE 4 — Workflow (payment application + payoff)  [IMPLEMENTATION]
├── Payment Application flow (apply deposit → expected txn)
├── Payoff generation + versioning
└── PaymentInstructions frozen snapshot on payoff

PHASE 5 — Polish + Demo                           [AESTHETICS + REVIEW]
├── Theme, typography, mobile-responsive layouts
├── Demo dataset (realistic 8-loan portfolio)
├── End-to-end servicing walkthrough
├── Dad dashboard view (read-only portfolio glance)
└── Document binder basics

FUTURE (post-demo, post-trial):
├── Borrower comms automation (agent or script-driven)
├── Bank statement import automation
├── REO property tracking module
├── 1098 generation
└── Dad's lightweight interaction layer (confirm button, receipt entry)
```

---

## HOW THE LAYERS TALK TO EACH OTHER

```
[EXTERNAL]          [SYSTEM]              [OPERATIONAL]         [CONFIG]
 Bank deposit   →   AccountTransaction    (tracked as task     (schema spec
 arrives             recorded in FM         in ClickUp only      in GitHub
                                           during BUILD phase)  defines fields)

 Borrower       ←   Payoff layout         Riley plans the      Layout spec
 gets payoff         generates PDF          comms workflow       in layouts/
 letter

 Michael        →   Payment Application   Time tracked on      Script spec
 applies payment     in FM, bridges         milestone subtask    in scripts/
                    expected ↔ actual

 Dad glances    ←   Dashboard layout      (no ClickUp          Layout spec
 portfolio           in FM (future)         involvement)         in layouts/

 Agent sends    ←   (future) triggered    Agent runs from      Hook in
 reminder            by FM date calc        ClickUp/Brain        brain-config/
```

Key principle: **ClickUp manages the build and decisions. FileMaker runs the business. GitHub holds the blueprints. The external world is what feeds in and receives output.**

Once the build is done, ClickUp's role shifts from "project management" to "automation layer" (agents sending comms, monitoring due dates, flagging anomalies). FileMaker stays the ledger of record.

---

*Last updated: 2026-08-02 · Source: DL decisions J1-J6, servicing-lifecycle.md, full repo audit*
