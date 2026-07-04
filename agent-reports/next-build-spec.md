# Agent Reports — next build spec

Version tracked in commit history, not this filename.

## In review (shipped this session)

- v1 data-separated build. Lean viewer in `agent-reports/index.html` (no inlined data), reports as per-agent JSON under `brain-config/agents/<agent>/reports/`. Viewer fetches roster + per-agent index + lazy-loads full reports from raw.githubusercontent.
- Report JSON schema v1 locked (see README). Recon Renata audit is the reference shape.
- Report view renders as a distinct document sheet (letterhead + flat ruled entries) vs the app chrome, so it's unmistakable when reading a report.
- Pager fixed; "view all reports" control separated from the nav arrows (full-width button below the timeline dots). Home copy refreshed. Loading + error + empty states added.

## Futures

- **Pull agents out of the brain-config tool index** as primary entries; this app is their window. Tool registry stays tools only.
- **Timeline diffing** between consecutive reports ("2 fixed, 1 new since last run"). Renata already carries resolved-state, so the data is there.
- **Deep-linkable report URLs** (hash routing) so a single report can be shared/opened directly.
- **Write path for agents:** helper so an agent appends a report JSON + updates its index in one commit as part of its run.
- Aesthetic fine-tune pass on the report-document surface (mobile tightening) — Michael to drive.
