# Changelog — maw-budget

_Chronological "what changed when" activity log. Newest first. Distinct from `design-decisions.md` (the WHY of each locked call) and `next-build-spec.md` (the current WHAT). This file is the trail; read it top-to-bottom-newest to see how the app's planning evolved. Every PR that touches this app should add a line here._

---

## 2026-07-15

- **`lock-naming` — last gate cleared + prior-art correction.** DD-008 **LOCKED = HML style** (`PrimaryKey`/`fk<Parent>`, PascalCase); URITP style rejected. `schema/tables.json` conventionNote flipped to LOCKED. **Corrected DD-012 prior art:** the real dense precursor is the **Budgeting | Shopping** space (Statements, Statement Imports, Budget, Subscriptions, Vendors, plus shopping-side lists), NOT URITP BETA BUDGET — per Michael, BETA BUDGET has different use cases and its own separate FileMaker plan, so it is NOT this build. **No open gate remains before field articulation.**
- **`inquiry-hijk` — closed the goal interrogation (A–L complete).** Logged DD-019 (budgeting: target-vs-actual now, envelope-ready later), DD-020 (priority reports: spend-by-category, account register, who-owes-me), DD-021 (reconciliation: cleared/pending in scope), DD-022 (platform: desktop + FileMaker Go, serverless preference, receipts wanted — sync/hosting flagged as the open architecture risk). **Created this changelog** (was missing — the FileMaker doc standard calls for it). Spec → v0.4.
- **`inquiry-efgl` — answered E/F/G, resolved L.** DD-016 (net worth over time via `NetWorthSnapshot`; autonomous capture tabled), DD-017 (bills = expected-vs-actual, variable, soft forecasting; Phase 2), DD-018 (valuation cadence = on-demand + soft staleness nudge, provisional), DD-013 packaging resolved (party-as-receivable, live "who owes me" view, Phase 1). Discovered prior art. Spec → v0.3.
- **`inquiry-d` — answered D.** DD-015 (multi-category splits = N legs on one event; needs split-editor UI; no schema cost).
- **`inquiry-c` — answered C.** DD-014 (hierarchical parent→child categories; rollups for free; working depth 2).
- **`reimbursements` — raised L.** DD-013 (reimbursements modeled as receivables, not a flag; gig income kept distinct). Added inquiry item L.
- **`inquiry-ab` — answered A + B.** DD-011 (full account-type coverage, single Account table + type + on-budget boolean), DD-012 (CSV import + manual entry, ~weekly; importer is Phase 1).
- **`decisions-v0.2` — locked the foundation.** Double-entry RULED IN by Michael. Created `meta/design-decisions.md` (DD-001–010). Reframed the README's open questions as a structured goal interrogation (A–K). Spec → v0.2. No tables written (deliberate).
- **`plan-v0.1` — research pass + articulated plan.** Benchmarked QuickBooks, YNAB/Monarch/Copilot/Actual, Firefly III, Maybe, GnuCash, Bloomberg. Filled `next-build-spec.md` (v0 → v0.1), `meta/architecture-notes.md`, and the README cover page. Delivered an HTML planning brief (double-entry explainer) in chat.
- **scaffold** — app scaffolded git-first from `_template-fmp-app`. First FMP app documented in-repo from day one; never lived in ClickUp.

---

## How to read the doc set (for a cold agent picking this up)

1. **`README.md`** — cover page: purpose, goals, current status, next steps.
2. **`meta/design-decisions.md`** — every committed call (DD-001…DD-022) with rationale + status. START HERE to understand WHY the app is shaped the way it is.
3. **`next-build-spec.md`** — the current plan: locked decisions, the object spine (shape only), phasing.
4. **`meta/architecture-notes.md`** — the double-entry model in prose.
5. **this `changelog.md`** — the chronological trail of how we got here.

**Current state (2026-07-15):** planning complete, zero tables written on purpose. All decisions locked incl. HML naming (DD-008). Next action = a dedicated field-articulation session writes the actual table/field definitions off DD-001–022. Prior-art / migration source = the **Budgeting | Shopping** space (not BETA BUDGET).
