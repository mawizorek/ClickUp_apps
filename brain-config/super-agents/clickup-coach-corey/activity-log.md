# Corey — Activity Log (rolling session ledger)

> Newest on top. One entry per session, **appended LIVE as the session runs** (locked 2026-07-25 —
> not batched at close). Append-only.
> Format: `YYYY-MM-DD · what I did · key decisions · state left · session task`
>
> **Budget ~4-5KB for the ENTRIES ONLY.** The LIVE STATE block below is a permanent fixture OUTSIDE
> the sliding window (`super-agent-base.md` §4a; `hooks/memory-rotation.md` as corrected 2026-08-10).
> Quarterly cold archives → `activity-log/YYYY-QN.md`.
>
> 🚫 **Never write a ClickUp URL into this file.** Every ClickUp URL passing through an agent's context
> is rewritten to an internal placeholder, so a whole-file rewrite silently kills the link. **Name the
> task and give its ID in backticks.** (Ricky lost a link this way on 2026-08-06.)
>
> 🗄️ **Cold archive:** `activity-log/2026-Q3.md` — the 08-03 and 07-19 sessions rotated there
> 2026-08-11 by Maggie.

---

# 🔴 LIVE STATE — read this FIRST on any pickup

> Permanent fixture, OUTSIDE the sliding window. **This block did not exist until 2026-08-11**; §4a has
> required it since 07-30. Everything below was scattered across session entries and `memory.md`, where
> nothing re-reads it for expiry. Moved by Maggie's §4a sweep.

## What I OWE (nobody else is holding these)

- 🔴 **The Production Build FMP spec correction.** Its step 0 names me as the blocker — *create `calls`
  and `R` on the Contact Sheet list* — and **those fields exist** (Michael, flat, 2026-08-08). Anyone
  reading that page cold believes a whole pipeline is blocked on me. **My row to fix, still unfixed.**
- 🔴 **The live CSV label check, and it is the one thing gating a real decision.** Do CSV multi-value
  labels come back comma-separated inside one quoted cell, and **does any show title contain a comma?**
  Until that is answered the per-production-export-view stopgap is unverified.
- ⬜ **The Gen-1-going-forward session with FMP Fiona** — whether a new show still gets a Gen-1 label
  field · stop cloning option lists from the previous show · the two-phase problem · name-or-delete
  `T.I.M.E. Role ()` on both sides. ⚠️ **Do NOT retire or rename Gen-1 label fields before it.**
  ⚠️ **2026-08-08: Michael ran a Corey-and-Fiona-shaped session without either of us seated** (both
  consulted by profile only). Not the Gen-1 session, but evidence the pairing happens whether or not
  it is scheduled.

## What I am AWAITING from Michael (recommendation delivered, ruling open)

- ⬜ **Risk Assessment Q2 (scoping unit) and Q3 (canonical mechanism)** — logged on the *Risk Assessment
  CU Notes — Decision Log*. My recommendation: the label field is canonical, per-show lists demote to
  saved views. 🔴 **If Q3 lands on the field, `Risk Assessment (BL)` should NOT be built as a list.**
- ⬜ **ROLES cluster Q1, open since 2026-07-27.** ⚠️ **Same shape as the risk-assessment dual-expression
  finding — ONE ruling should close both.** Do not answer them separately.

## Bundle health — measured 2026-08-11 10:28 ET (Maggie's rotation)

- ✅ **`memory.md` ROTATED: 13,563 B → 10,416 B (10.17 KiB).** Rounding toward the alarm per the report's
  own rule: that is **176 bytes over a 10 KiB cap** — effectively landed, not cleanly under. Cutting
  content for 176 bytes is the tail wagging the dog, so it is recorded rather than forced.
- ✅ **`activity-log.md` ROTATED: 5,562 B → this file**, two sessions cold, LIVE STATE added.
- ✅ `decision-log.md` 3,569 B — smallest in the fleet, no action.
- 🔴 **`preferences.md` is 15,917 B — larger than my memory file, exempt from rotation, read FULL on
  every seating, measured by nothing. THIRD bundle in a row.**
- 🔴 **`working-notes.md` (1,988 B) is an undocumented file carrying three stale claims** — see the
  rotation PR. Not edited by this pass.

---

2026-08-08 · **CONSULTED, not seated** — my profile was read into Fiona's Production MAWster schema
session (task `86ajxk8ex`) so my ClickUp-side findings could be weighed. Two things came back at me:

🔴 **A LOCKED SPEC ATTRIBUTED A BLOCKER TO ME THAT IS NO LONGER TRUE.** The Production Build FMP spec
names **step 0 as my blocker: "create `calls` and `R` on the Contact Sheet list."** Michael's flat
correction in-session: **"`calls` and `R` DOOO exist."** So the spec's only named blocker is stale, the
Custom Field Gate work it describes is done, and anyone reading that page cold believes the pipeline is
blocked on me. ⚠️ Sharper lesson than the fix: **a locked page recorded a task as OWED to a named person
and nobody was watching whether it had been done.** The wrong-PERSON blind spot the Doc-Rot Sweep cannot
see — Fleet-Fact-Sweep territory, in a domain spec rather than a fleet file.

**My open Q5 SURVIVED as a real risk and is now upstream of an FMP build.** `URITP Productions` is a
**multi-select labels** field, so one Contact Sheet / event task can carry two shows and there is no
reliable per-production filter on an export view. The FMP side mitigated it with per-production export
views plus a compound upsert key (`TaskID` + `fkProduction`) — **but that means one saved view per
production, hand-maintained, and a new show needs a new view before its first import.** Michael wants it
replaced by ONE view with the production passed as a runtime parameter, which is **API-only** (a CSV
export is a static file). Logged in `apps/production-mawster/integration.md` as a to-do.

**Also noted for my lane:** Michael declined a CU-side canonical event-type dropdown, so classification
moves to a FileMaker crosswalk with an unmatched queue — **a case where the right answer was NOT a
ClickUp field.** And ClickUp does not emit a LOCATION on an event task; ruled out of v1, recorded as a
future upgrade rather than a gap.

**State left:** nothing structural changed, no fields created. Owed items → LIVE STATE.

2026-08-06 · Seated by Milo (via Michael's direct "seat Corey and Fiona") on the **risk assessment
architecture** question. Read the live schema rather than the folder tree: all 20 scoring fields on
`URITP ▸ Risk Assessments` (90139938724) are defined ONCE at FOLDER scope and inherit down, so the
"scattered across 16 production folders" fear is structurally impossible as built — **localization was
solved at creation.** **My finding: the defect is DUAL EXPRESSION, not sprawl.** A hazard's
show-applicability is recorded twice — the `URITP Productions` multi-select label AND the multi-home
into `Risk Assessment (<SHOW>)` — with nothing detecting disagreement. 85 hazards across 6 seasons in
`gen PRODUCTION Hazards`; **only 2 of ~16 shows have a per-show list, so the list-per-show habit was
never actually adopted.** Recommended the label field as canonical with per-show lists demoted to saved
views (fewest containers, no creation step, no sync obligation), while naming the honest cost: you lose
a real container to hand someone. Also flagged a THIRD undeclared scoping model already live —
`Motorized Hoist Risk Assessment` is scoped to EQUIPMENT, not a show or a shop. Logged as Q2 + Q3 on the
Risk Assessment CU Notes Decision Log. **Recommendation only; no structural change made.** Awaited
rulings → LIVE STATE. Session: Reynolds Ch.7 / risk architecture.

---

_Older sessions (2026-08-03 schedule pointer, 2026-07-19 conversion) → `activity-log/2026-Q3.md`._
