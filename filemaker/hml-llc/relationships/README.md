# Relationships

The HML_LLC relationship graph. **Single edge surface: [`../schema/relationships.json`](../schema/relationships.json)** (the machine mirror; the renderer + linter read it directly). This README carries only narrative — the edge list is NOT restated here (standard v1.4 / `DECISIONS.md` D-006), the same no-second-index rule that retired inline calc bodies. `_index.json` holds render hints only.

## The loan-first spine

The defining decision: **loans are the financial parent, not properties.** The user navigates by property (property-first UX), but transactions, payoffs, and servicing all hang off `Loans`.

- `Loans.fkProperty` → `PropertySUMMARIES` — a loan is secured by a property.
- `ExpectedTransactions.fkLoan` → `Loans` and `AccountTransactions.fkLoan` → `Loans` — both ledgers parent to the loan. `fkProperty` was removed from both once `fkLoan` was established.
- `PaymentApplications` joins `ExpectedTransactions` ↔ `AccountTransactions` (the two-sided application).
- `Payoffs.fkLoan` → `Loans` — payoffs belong to the loan and freeze their numbers.
- `ExpectedTransactions` / `AccountTransactions` `.fkStandardTransaction` → `Standard_Transactions` — type taxonomy.

## Under review

- Party links (`fkBorrower`) pending the Organizations vs Borrowers decision.
- `PropertySUMMARIES.fkDocuments` / `fkBalloonNote` / `fkPropertyStatus` FK ownership under re-eval.

## Tooling (build-session work, not yet built)

- **Renderer:** a TO-graph view in `_viewer/`, a near-clone of the calc `reads` D3 graph — nodes = tables, edges = FKs (child.field → parent.PrimaryKey), label = cardinality, color = status (locked / pending / under-review). Reads `../schema/relationships.json` directly.
- **Linter:** both endpoints resolve to a real table+field in `../schema/tables.json`; `to.field` is a PrimaryKey; cardinality + status are valid enums; no edge references a nonexistent table; manifest ↔ schema coverage.
