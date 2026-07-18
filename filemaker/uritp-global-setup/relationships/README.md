# Relationships

Narrative only. The edge list is data and lives in [`../schema/relationships.json`](../schema/relationships.json) (single edge surface, per DOCUMENTATION-STANDARD v1.4 / D-006).

## The shape (config spine)

```
   GLOBAL_USAGE_VARIABLES ─(current/prev/next)─► Fiscal_Years ◄─(fkFiscalYear)─ Academic_Periods
                                                    ▲
                                            (cross-app) PRODUCTIONS.fkFiscalYear
                                            [PRODUCTIONS is builder-owned, not here]

   Departments ◄─(fkDepartment)─ Staff_Positions ─(fkSupervisorPosition, self-ref)─┐
                                        ▲                                          │
                                        └───────────────────────────────┘
```

- **Fiscal_Years** is the time-fanout hub: the three GUV pointers, Academic_Periods, and (cross-app) the builder-owned PRODUCTIONS all key to it.
- **Staff_Positions** points at Departments and self-references for reporting lines.
- **PRODUCTIONS is NOT in this graph** — it's owned by the Productions/Company builder (DG-001). Global Setup only holds selector table-occurrences (match-key context) against it, documented under `layouts/` when built.
- **Cross-app references** (other apps → GUV for branding, → Fiscal_Years, → Departments, → Staff_Positions) live in each consumer's own `relationships.json`, not here.

## Open Items

- Confirm cardinalities + the Staff_Positions shape against the live file / at build time.
