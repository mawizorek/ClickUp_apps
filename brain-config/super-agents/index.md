# Super-Agent Fleet Index

> **Data + view are split (singularity):**
> - **Data (edit here):** [`superagents.json`](./superagents.json) — the canonical machine-readable fleet record: every ClickUp super agent + git-teammate, track, golden-standard version, and compliance status.
> - **Pretty view:** [`index.html`](./index.html) — renders `superagents.json`; holds no data of its own.
>
> Do **not** keep a duplicate table here or anywhere else. This page is a pointer only. `brain-config/agents/` is the separate Brain-session council, not this fleet.

**Audit workflow:** `brain-config/super-agents/audit-instruction.md` — holds BOTH tracks: **native full-standard** (live-vs-declared mirror audit) and **git-teammate** (internal-consistency DoD; no live config to diff). Each declaration/audit change lands via its own PR (PR history = audit trail). Per-agent declarations live in `brain-config/super-agents/<slug>/`.

## Structure

```
brain-config/super-agents/
  superagents.json             # DATA: the fleet record (hand-edit this)
  index.html                   # VIEW: renders superagents.json
  index.md                     # this pointer
  audit-instruction.md         # the audit standard (native + git-teammate tracks)
  <slug>/
    README.md                  # steward pointer metadata (never mirror superagents.json fields)
    preferences.md             # NATIVE: verbatim mirror of the live config. GIT-TEAMMATE: the canonical profile (no live config to mirror).
    memory.md                  # git-teammate: accumulated context + tool pointers
    activity-log.md            # rolling session ledger (append-only)
    decision-log.md            # git-teammate: reasoning about the agent itself
    audits/<slug>.<date>.md    # dated audit records (one per audit, via PR)
```

## Changelog

- 2026-07-21: noted the two audit tracks + corrected the git-teammate file model (preferences is canonical for a teammate, not a live-config mirror; added memory/decision-log to the structure). Prompted by a Beckett doc-drift flag.
- 2026-07-15: index split into `superagents.json` (data) + `index.html` (renderer); this file reduced to a pointer.
- 2026-07-15: fleet index created in Git (moved off ClickUp).
