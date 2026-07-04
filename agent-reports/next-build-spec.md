# Agent Reports — next build spec

Version tracked in commit history, not this filename.

## Next build

- **Split reports out of `index.html` into data files.** Per-agent: `brain-config/agents/<agent>/reports/<report-id>.json` + a per-agent `reports/index.json` manifest. Viewer fetches on load. This drops the viewer HTML under the ~30KB write cap so every future report commit goes through MCP (no UI upload).
- **Lock the report JSON schema.** Fields: `id, type, reportType, ts, target, verdictWord, verdictPill, pillText, summary, tally[], delta` + type-specific: `findings[] / apps[] / clean[]` (audit), `lenses[] / call` (review). Recon Renata's audit is the reference shape.
- **Pull agents out of the brain-config tool index.** Agents get their own window (this app). The tool registry stays tools only.

## Futures

- Timeline diffing between consecutive reports ("2 fixed, 1 new since last run"). Renata already carries resolved-state, so the data is there.
- Report/chrome aesthetic fine-tune pass (Michael): keep tightening the report-document surface on mobile.
- Deep-linkable report URLs (hash routing) so a single report can be shared.

## In review

- v1 self-contained build shipped via UI upload (over the byte-safe write cap).
- Bugs fixed: pager button rendering; the "view all reports" control separated from the left/right nav arrows (now a distinct full-width button below the timeline dots).
- Report view reworked to render as a distinct document sheet (letterhead + flat ruled entries) vs the app chrome, so it's unmistakable when you're reading a report.
- Home copy refreshed (removed stale text).
