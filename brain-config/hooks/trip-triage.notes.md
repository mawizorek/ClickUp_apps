# Trip Triage — Notes & Scars

**Companion to `hooks/trip-triage.md`.** The hook holds the PROCEDURE. This holds the WHY: the accumulated judgement, the failures that produced each guardrail, the provenance, and the changelog.

**Read this when:** you are about to CHANGE the hook · a guardrail looks arbitrary and you are tempted to drop it · you hit a failure the hook did not predict. **You do not need this file to RUN the hook.**

**Steward:** Mainstage Milo. **Established 2026-08-10 (v3 split).**

📐 **Why a sidecar and not a decision log.** Precedent, twice over: `uritp.css` hit 34.9KB with two thirds post-mortem and split to a repo companion — explicitly **not** to ClickUp, per Prose-Documentation DL J4 (*open questions go to ClickUp because a checkbox must be clickable; **resolved findings stay in the repo beside the content they govern***). `screenshot-intake` already runs sidecars the same way. **This file is resolved findings. The TRIPS Decision Log holds the open questions.** They are different artifacts and neither substitutes for the other.

🚫 **Do not move this content into a decision log, and do not delete it as "commentary."** *(That rule is itself a scar — see S6.)*

---

## ⭐ The premise, at length

Michael named the pattern himself, 2026-08-10: *"think assignments to canonical role to assign all those people to a safety program through their association with the canonical record. this is that but in a different flavor."*

Three instances of one shape now exist:

| Instance | Join | Canonical record |
| --- | --- | --- |
| Contact Sheet `ROLE` | task name → role | the roles catalog |
| Safety program assignment | person → role → program | the role record |
| **Trip Triage** | production × department → seat → person; production × event-type → dated instance | the Contact Sheet seat + the production's calendar |

⭐ **The lesson across all three: never join two attributes to each other, join both to the canonical record.** A trip does not know who travels — the SEAT knows. A trip does not know when — the production's CALENDAR knows. Every failure below is some version of forgetting that and pattern-matching on a string instead.

**The fourth instance will show up.** When it does, recognise it from this table rather than diagnosing it cold, which is what happened to the first three.

---

## The scars — one per guardrail, so none of them reads as arbitrary

### S1 · The CALENDARS false negative *(Guardrail 6)*

Multiple folders in URITP PRODUCTIONS are named `CALENDARS` — different ids, identical display name, roughly one per production — plus `OA Calendars` and `Devised CALENDARS`, which break the pattern entirely.

**2026-08-10:** a date search scoped to "the CALENDARS folder" resolved to Big Love's, found nothing for the other shows, and produced a confident report to Michael that *"The Secretary and T.I.M.E. have no production calendar."* **Both have full ones.** The failure returned CLEAN — an empty result is exactly what "nothing exists" looks like.

⭐ **This is the repo-referent-gate failure in a ClickUp costume: a true answer to a question nobody asked.** Same fix, same discipline: derive the coordinate from the SUBJECT, state it, then search. Never scope by a display name that is not unique.

### S2 · The T.I.M.E. code, wrong within the hour *(the fork rule)*

Michael flagged the fork explicitly: *"TIME devising in the fall is a tough one 'TIM-D' versus the staged version in the spring 'TIME'."*

**Within an hour of being told**, this hook's author named a trip `{TIME}{Design Visit}{Scenic}` on a row whose label read **T.I.M.E. reading (F26)** — the fall show, `TIM-D`. Corrected to `{TIM-D}{Scenic}@{Design Visit}`.

⚠️ **Being warned about an ambiguity does not protect you from it.** The rule that actually works is mechanical: read the LIST or the SEMESTER, never the task-name prefix — because **both trees write `[TIME] …` in their task names**, so the prefix is ambiguous in live data.

⬜ **Still open on that row:** due date `2027-03-02`, a SPRING date on a FALL label. Either the code or the label is wrong. Flagged, not picked — which is the correct move and is why Guardrail 3 exists.

### S3 · The seat lookup that returned another show *(step 1, and the only wrong-answer path)*

Contact Sheet holds a full seat set for EVERY production, so a role name alone matches many rows, and **two SEARCH terms do not AND together**. A live test asking for the Secretary's Video Designer returned **Big Love's** Scenic, Lighting, Costume and Sound seats.

🔴 **Every other failure in this hook is a STOP. This one is a wrong answer that looks right** — a real person, correctly formatted, written into a real trip that will be booked. Hence the ban on accepting a seat whose production label has not been read back.

### S4 · The list that moved underneath the read *(Guardrail 4)*

In one session TRIPS went from 13 to 25 rows, two rows changed between a bulk-rename preview and its apply (the stale preview would have silently overwritten both), and one row **disappeared entirely** between two reads twenty minutes apart.

⚠️ **Michael edits live.** The preview's left-hand column is the freshness check, not decoration. Read it; do not skim it.

### S5 · The hardcoded count that rotted in fifteen minutes *(Guardrail 9)*

v1 stated the canonical event list holds *"8 rows."* Michael added `| Auditions |` during the same session. **The number was wrong before the merge commit finished propagating** — and the Known-Drift Register already says **never write a fleet or inventory COUNT anywhere, ever.**

⭐ Generalises past this file: a count is the fastest-rotting fact available, and writing one into a governing document launders staleness as authority.

### S6 · v1 failed its own cold-walk, and the pattern beat the bugs

Michael asked for a cold-agent walkthrough of v1. It failed: a cold agent got stuck three times and could write the wrong person once. **Four of the five defects were things this repo already had a rule or a file for** — a count D3 forbids, a Trigger block `_HOOK-TEMPLATE.md` prescribes, an unstated query requirement, and a file over the Size Enforcer's budget.

🔴 **Root cause: the hook was authored by copying a sibling hook instead of reading the template that governs hooks. Copying a neighbour inherits its shape and none of the standard it was supposed to meet.** That is the most transferable thing in this file.

⭐ **And the meta-lesson: the cold-walk is cheap and it works.** Twenty minutes of walking your own tool as a stranger found five real defects, one of which produced wrong data. **Do it before shipping, not after.**

---

## 🗄️ Provenance — why the schema looks like this

**`Production Events (canonical)` lives in URITP ▸ `FMP Tables`.** It is **FileMaker schema staging**, not a ClickUp modelling accident. It is typed and undated *on purpose* — it was never meant to hold occurrences.

⚠️ **So the missing instance layer is a FileMaker design decision and belongs to FMP Fiona.** In FMP you reach the date through `Production × EventType → EventInstance`. **Do not build an instance layer in ClickUp to close the gap without her.**

⭐ **The hook is a BRIDGE OVER A MISSING RELATIONSHIP, not a feature.** If the instance layer is ever built, most of step 2 is deleted, and that is the good outcome. **Never harden the string matching into something that looks permanent.**

🩹 v1's ledger called this "a ClickUp gap worth fixing." Right problem, wrong runtime. Corrected in v2.

---

## 🗒️ Steward's ledger (Milo)

Michael, 2026-08-10: *"you hold decisions and notes for yourself but share most of the process to public."* The hook is the public process. This is the judgement under it — kept in the TOOL rather than in Milo's memory bundle because it is procedural knowledge (Constitution §2–§3).

1. **The department-vs-seat assumption is the most fragile thing in the hook.** `Production DEPARTMENT` has 13 options; Contact Sheet is keyed by ~50 SEATS. `Costumes, H/M/W` alone spans Costume Designer, Costume Shop Manager, Assistant CSM, Hair & Makeup, Wardrobe Supervisor and Wardrobe Run Crew. **It lands on the right person only because a TRIP implies the visiting designer.** Right every time so far because only designers travel. **The first resident-staff trip breaks it.**
2. **The type/instance gap is the thing worth fixing — in FileMaker.** See Provenance. Everything in step 2 is competent workaround until Fiona rules.
3. **A trip row is a BOOKING, not a visit.** One person, one show, one room, one ticket. ⬜ **Shared-visit context has no home** — a joint site visit's negotiation history, cost analysis and email trail end up on whichever person's row held them first. TRIPS Decision Log J2; unsolved.
4. **Two independent arguments landed on prose trip names over coded ones:** the Labels/Dropdown source fields cannot store a short code, AND one-trip-per-person broke uniqueness on the three-token coded form. **When two unrelated arguments agree, stop hunting a third.**
5. **The Rosetta table stays in the HOOK, not here.** It is needed to RUN, not to understand. Same test for anything moved between these two files: *would a cold agent executing the routine need this in front of them?*

---

## Changelog

- **v3 (2026-08-10)** — **Split.** Procedure stayed in `trip-triage.md`; scars, premise, provenance, ledger and this changelog moved here. v2 shipped at 20.8KB against a 10–12KB budget with roughly 55% of its bytes being why-history — the `uritp.css` shape exactly. Nothing was deleted; the hook now points here. Michael: *"is that decision logs and comments bloating the file????"* — half right, and the diagnosis is recorded in S6's neighbourhood: no decision log was in the file, but the same content CLASS was.
- **v2 (2026-08-10)** — Cold-walk audit found five defects, all fixed. Added the Trigger block, the empty-`Purpose (Event)` fallback ladder (v1 dead-ended on the majority case), the correct seat-lookup method (S3), the list-scope read requirement, and Guardrail 9 after striking the hardcoded count (S5). Also added the `<cut>` cancellation convention (Guardrail 8) and the FMP Tables provenance that reassigns the instance-layer decision to Fiona.
- **v1 (2026-08-10)** — Established at Michael's instruction (*"that bridge is for you to hold Milo. write yourself a hook?? we'll do this again"*), after a live pass that resolved `Trip For` for Big Love, renamed 12 rows, split a two-artist site visit into per-person bookings, and staged dates for 8 trips. Named on Michael's coinage (*"this trips=triage might just be worth calling it"*). Carried the Rosetta table, the T.I.M.E. fork and the CALENDARS trap.
