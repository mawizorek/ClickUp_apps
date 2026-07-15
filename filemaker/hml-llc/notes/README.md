# Notes

Per-build / session notes, dropped as work happens and linked to PRs. Freeform, dated, newest on top. Durable decisions graduate into `meta/` or the relevant object file; raw session log stays here.

---

## 2026-07-14 — Full single-source absorb (v2)

Absorbed every legacy `docs/` page into the mirror + `meta/` so the repo is a complete standalone source ahead of review:
- **Calc formulas** → `meta/calculation-fields.md` (canonical single home); table files list their calcs and point there.
- **Normalization audit + live 17-table inventory + locked implementation contract** → `meta/schema-notes.md`.
- **Narrative** (design-decisions, architecture-notes, data-standards, import-export, graph-log, changelog) → `meta/`.
- **Table files enriched** with full field sets: Loans (terms + calc list + naming-drift flag), ExpectedTransactions (adjustment/sequence/grace), AccountTransactions (current-14 + fields-to-add + lean contract), Documents (full binder + DocumentVersions), Standard_Transactions (locked Name values), Payoffs (payoff-date nuance), PropertySUMMARIES, GLOBAL_USE_VARIABLES.
- **Relationships** README got the loan-first-spine narrative; **layouts** exploded into 7 role files + design language; **value-lists** added DocumentType.
- Legacy `docs/` reduced to pointer stubs.

**Flagged, not silently resolved:** Loans principal/rate naming drift (`OriginalPrincipal`/`InterestRateAnnual` in calcs vs `LoanAmount`/`InterestRate` in schema JSON), plus `ClosingDate`/`GraceDays`/`fkCurrentPayoff` presence. Still genuinely pending on the FMP file: real script inventory, exact layout names/objects, value-list stored values, 52 graph screenshots, import/export field maps.

**For review:** walk `INDEX.md` top to bottom against the ClickUp docs; close each ClickUp page as its repo counterpart is confirmed.
