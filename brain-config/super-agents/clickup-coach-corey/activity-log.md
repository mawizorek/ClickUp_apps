# Corey — Activity Log (rolling session ledger)

> Newest on top. One condensed entry per session, appended at close. Append-only.
> Format: `YYYY-MM-DD · what I did · key decisions · state left · [session task](url)`

---

2026-08-08 · **CONSULTED, not seated** — my profile was read into Fiona's Production MAWster schema
session ([task](https://app.clickup.com/t/86ajy1neb)) so my ClickUp-side findings could be weighed. Two things came back
at me and both need my attention:

🔴 **A LOCKED SPEC ATTRIBUTED A BLOCKER TO ME THAT IS NO LONGER TRUE.** The [Production Build FMP
spec](https://app.clickup.com/36074068/docs/12cwjm-52833/12cwjm-80793) names **step 0 as my blocker: "create `calls` and `R` on the Contact Sheet
list."** Michael's flat correction in-session: **"`calls` and `R` DOOO exist."** So the spec's only
named blocker is stale, the Custom Field Gate work it describes is done, and anyone reading that page
cold believes the pipeline is blocked on me. **The spec needs correcting and it is my row to fix.**
⚠️ Sharper lesson than the fix: **a locked page recorded a task as OWED to a named person and nobody
was watching whether it had been done.** That is the wrong-PERSON blind spot the Doc-Rot Sweep cannot
see — Fleet-Fact-Sweep territory, in a domain spec rather than a fleet file.

**My open Q5 SURVIVED as a real risk and is now upstream of an FMP build.** `URITP Productions` is a
**multi-select labels** field, so one Contact Sheet / event task can carry two shows and there is no
reliable per-production filter on an export view. The FMP side mitigated it with per-production export
views plus a compound upsert key (`TaskID` + `fkProduction`) — **but that means one saved view per
production, hand-maintained, and a new show needs a new view before its first import.** Michael wants
it replaced by ONE view with the production passed as a runtime parameter, which is **API-only** (a CSV
export is a static file). Logged in `apps/production-mawster/integration.md` as a to-do. ⚠️ **Still
unverified and it is mine to verify:** whether CSV multi-value labels come back comma-separated inside
one quoted cell, and whether any show title contains a comma.

**Also noted for my lane:** Michael declined a CU-side canonical event-type dropdown, so classification
moves to a FileMaker crosswalk with an unmatched queue — **a case where the right answer was NOT a
ClickUp field.** And ClickUp does not emit a LOCATION on an event task; ruled out of v1, recorded as a
future upgrade rather than a gap.

**State left:** nothing structural changed, no fields created. Owed: the Production Build spec
correction, and the live-CSV label check.

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
