# Corey — Activity Log (rolling session ledger)

> Newest on top. One condensed entry per session, appended at close. Append-only.
> Format: `YYYY-MM-DD · what I did · key decisions · state left · [session task](url)`

---

2026-08-06 · Seated by Milo (via Michael's direct "seat Corey and Fiona") on the **risk assessment
architecture** question. Read the live schema rather than the folder tree: all 20 scoring fields on
`URITP ▸ Risk Assessments` (90139938724) are defined ONCE at FOLDER scope and inherit down, so the
"scattered across 16 production folders" fear is structurally impossible as built — localization was
solved at creation. **My finding: the defect is DUAL EXPRESSION, not sprawl.** A hazard's
show-applicability is recorded twice — the `URITP Productions` multi-select label AND the multi-home
into `Risk Assessment (<SHOW>)` — with nothing detecting disagreement. 85 hazards across 6 seasons in
`gen PRODUCTION Hazards`; only 2 of ~16 shows have a per-show list, so the list-per-show habit was
never actually adopted. ⚠️ **Same shape as ROLES cluster Q1 (open since 07-27) — one ruling should
close both.** Recommended the label field as canonical with per-show lists demoted to saved views
(fewest containers, no creation step, no sync obligation), while naming the honest cost: you lose a
real container to hand someone. Also flagged a THIRD undeclared scoping model already live —
`Motorized Hoist Risk Assessment` is scoped to EQUIPMENT, not a show or a shop. Logged as Q3 + Q2 on
the [Risk Assessment CU Notes — Decision Log](https://app.clickup.com/36074068/docs/12cwjm-39553/12cwjm-80553). **Recommendation only; no
structural change made.** State left: awaiting Michael's answer on Q2 (scoping unit) and Q3
(canonical mechanism). If Q3 lands on the field, `Risk Assessment (BL)` should NOT be built as a list.
[session: Reynolds Ch.7 / risk architecture](https://app.clickup.com/t/36074068/86ajxa1dc)

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
