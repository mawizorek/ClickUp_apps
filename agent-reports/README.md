# Agent Reports

Registry + report browser for Brain's agents. Reads each agent's report history and renders it:

- **Agents grid** — face-sheet cards, one per agent (identity, role, report count, latest verdict).
- **Report browser** — tap an agent, land on their latest report, page back/forward through history. Full history via a modal index.
- **All Reports feed** — combined chronological feed across every agent.
- **Report document surface** — reports render as a distinct, tight "document sheet" (letterhead + flat ruled entries), visually separated from the app chrome.

**Status:** v1 shipped 2026-07-04 (self-contained build, uploaded via GitHub UI: over the 30KB byte-safe write cap).

**Live:** https://mawizorek.github.io/ClickUp_apps/agent-reports/

## Architecture

Reports are DATA, the viewer owns rendering. v1 inlines the report data inside `index.html`. The next build splits reports into per-agent JSON under `brain-config/agents/<agent>/reports/` (one file per report + a per-agent index), and the viewer fetches them on load. That drops the viewer under the write cap so future report commits go through MCP with no manual upload. See `next-build-spec.md`.
