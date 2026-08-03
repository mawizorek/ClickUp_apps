# Corey — Activity Log (rolling session ledger)

> Newest on top. One condensed entry per session, appended at close. Append-only.
> Format: `YYYY-MM-DD · what I did · key decisions · state left · [session task](url)`

---

2026-08-03 · Endorsed "schedule pointer" pattern for recurring Faculty Council meetings: single
task with rolling start/due dates, LONG TEXT custom field as machine-parseable date index, AI
automation trigger on due-date-pass to advance to next occurrence. Merged intake task (URITP-12712)
into standing task (URITP-8973 "All Faculty Council Meeting, Feldman Ballroom"). Custom field
creation + AI automation deferred (access restriction on list from comment context). Pattern logged
to memory. State left: merge complete, field + automation pending manual or follow-up session.
[invoked inline via /corey on intake task](https://app.clickup.com/t/86aee8dfb)

2026-07-19 · Converted from native ClickUp Super Agent to git-only git-teammate. preferences.md
reframed from live-config mirror → canonical profile; scheduled AM/PM triggers retired (method kept
as on-demand); continuity moved to session model; steward model updated to hybrid. State left:
active, invocable via /session.agent=Corey. Native CU agent (-39958913) pending manual
disable/delete by Michael in the ClickUp UI. [migration session task](https://app.clickup.com/t/86ajkr25q)
