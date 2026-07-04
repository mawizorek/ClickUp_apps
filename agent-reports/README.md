# Agent Reports

Registry + report browser for Brain's agents. A lean viewer that reads report DATA from the repo and renders it.

- **Agents grid** — face-sheet cards, one per agent (identity, role, report count, latest verdict).
- **Report browser** — tap an agent, land on their latest report, page back/forward through history. Full history via a modal index.
- **All Reports feed** — combined chronological feed across every agent.
- **Report document surface** — reports render as a distinct, tight document sheet (letterhead + flat ruled entries), visually separated from the app chrome.

**Live:** https://mawizorek.github.io/ClickUp_apps/agent-reports/

## Architecture (data-separated)

The viewer (`index.html`) holds NO report data. It fetches:

- `agent-reports/manifest.json` — the agent roster (id, name, role, initials, accent, blurb).
- `brain-config/agents/<agent>/reports/index.json` — each agent's report list (newest first), enough for the grid/pager/history.
- `brain-config/agents/<agent>/reports/<report-id>.json` — the full report, lazy-loaded when opened.

Fetched from raw.githubusercontent.com (permissive CORS) so it works identically in preview and on Pages. Because the viewer carries no data, `index.html` stays small, MCP-editable, and never hits the write cap. **Adding a report = commit one JSON file + add a line to that agent's `index.json`.** No viewer edit, no re-render, no upload.

## Report JSON schema (v1)

Common: `id, type (audit|review), reportType, ts (ISO), target, verdictWord, verdictPill (solid|adjust), pillText, delta, summary, tally[]`.
- **audit** adds: `findings[] {num,sev,cat,fixed?,body,fix}`, `apps[] {name,size,dot,rd,flag?}`, `clean[]`.
- **review** adds: `lenses[] {name,status,body}`, `call`.

Recon Renata's audit is the reference shape.
