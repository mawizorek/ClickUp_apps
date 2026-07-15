# Super-Agent Fleet Index

Canonical, Git-only index of every ClickUp Super Agent: track, golden-standard version, and
current compliance status. Replaces the retired ClickUp "Agent Fleet Register" doc (that page is
flagged for deletion; do not recreate a ClickUp copy). Open this file, or ask the Fleet Steward
(ClickUp Coach Corey) for the link.

**Golden standard:** v1.0 — defined by the Creation & Setup Checklist + Golden Config Skeleton
(ClickUp AI Toolkit). Audit procedure: `brain-config/super-agents/audit-instruction.md`.

---

## Fleet

| Agent (slug) | Track | Golden std | Status | Last audit |
|--------------|-------|-----------|--------|------------|
| ClickUp Coach Corey (`clickup-coach-corey`) | Full-Standard | v1.0 | Up to date | 2026-07-15 |
| Mainstage Milo | Full-Standard | v1.0 | Needs declaration + audit | — |
| FMP Frank | Full-Standard (confirm) | — | Needs declaration + audit | — |
| Update URITP | Full-Standard (confirm) | — | Needs declaration + audit | — |
| Origination Date agent | Task-Specific / Exempt | n/a | Inventory only | — |
| Parse new property emails | Task-Specific / Exempt | n/a | Inventory only | — |
| Update AMOUNT PAID (when associated) | Task-Specific / Exempt | n/a | Inventory only | — |

> Fleet roster is incomplete and grounded in verified agents only. We proceed **one agent at a
> time**; new agents get a folder under `super-agents/<slug>/` + a row here. Unconfirmed details
> are marked — never invented.

---

## Structure

```
brain-config/super-agents/
  index.md                     # this file (the fleet index)
  audit-instruction.md         # the audit standard
  <slug>/
    README.md                  # steward-controlled uniform metadata
    preferences.md             # the agent's own self-maintained mirror
    audits/<slug>.<date>.md    # dated audit records (one per audit, via PR)
```

Distinct from `brain-config/agents/` (the Brain-session council: Mira, Wes, Renata, lenses,
gates). This folder is the **ClickUp Super Agent** fleet.

---

## Changelog

- 2026-07-15: created. Fleet index moved from ClickUp to Git (single source). Corey audited
  Up-to-date on v1.0.
