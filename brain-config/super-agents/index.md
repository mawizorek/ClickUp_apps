# Super-Agent Fleet Index

> **Data + view are split (singularity):**
> - **Data (edit here):** [`superagents.json`](./superagents.json) — the canonical machine-readable fleet record: every ClickUp super agent, track, golden-standard version, and compliance status.
> - **Pretty view:** [`index.html`](./index.html) — renders `superagents.json`; holds no data of its own.
>
> Do **not** keep a duplicate table here or anywhere else. This page is a pointer only. `brain-config/agents/` is the separate Brain-session council, not this fleet.

**Audit workflow:** `brain-config/super-agents/audit-instruction.md`. Each declaration/audit change lands via its own PR (PR history = audit trail). Per-agent declarations live in `brain-config/super-agents/<slug>/` (`README.md` + `preferences.md` + `audits/`).

## Structure

```
brain-config/super-agents/
  superagents.json             # DATA: the fleet record (hand-edit this)
  index.html                   # VIEW: renders superagents.json
  index.md                     # this pointer
  audit-instruction.md         # the audit standard
  <slug>/
    README.md                  # steward-controlled uniform metadata
    preferences.md             # the agent's own self-maintained mirror
    audits/<slug>.<date>.md    # dated audit records (one per audit, via PR)
```

## Changelog

- 2026-07-15: index split into `superagents.json` (data) + `index.html` (renderer); this file reduced to a pointer.
- 2026-07-15: fleet index created in Git (moved off ClickUp).
