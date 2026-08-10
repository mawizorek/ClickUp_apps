# Trip Triage · AI Toolkit

**Purpose:** Resolve a sparse row in URITP PRODUCTIONS ▸ Travel & Accom ▸ **TRIPS** into a complete, bookable trip — the PERSON who travels, the DATES they travel, and a name that reads — by joining through canonical records instead of guessing. A trip row is one person's room and one person's ticket; this hook fills it in.

**Steward:** Mainstage Milo (URITP production ops). Any agent may fire it. Milo owns the file.

**Mode:** On-demand routine, PROPOSE-FIRST. Phase 1 writes nothing without a greenlight. Promotion to auto-fill is earned per-field from real runs.

**Invocation:** `/trip-triage` · `/trips` · "triage the trips" · "fill in the trip dates" · "who is this trip for" · scoped forms preferred ("triage the Big Love trips").

**Trigger (auto-eligibility; still manual-fire in phase 1):** all of —

1. Target is the **TRIPS** list (`901328144404`) or a task whose home list is TRIPS.
2. At least one target row is INCOMPLETE on a resolvable field: `Trip For` empty · `Production DEPARTMENT` empty · native start/due empty · name off-convention.
3. The row carries at least ONE resolvable input: a `URITP Productions` label, a `Purpose (Event)` link, or a purpose legible in the name.

🚫 **Does NOT fire on:** a row prefixed `<cut>` (cancelled, see Guardrail 8) · a row whose dates came from a real booking (Guardrail 1) · any list other than TRIPS.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-08-10** by Mainstage Milo, at Michael's instruction: *"that bridge is for you to hold Milo. write yourself a hook?? we'll do this again."*

---

## ⭐ The premise — a RESOLVE-THROUGH-CANONICAL join, and we own two others

Michael named the shape: *"think assignments to canonical role to assign all those people to a safety program through their association with the canonical record. this is that but in a different flavor."*

| Instance | Join | Canonical record |
| --- | --- | --- |
| Contact Sheet `ROLE` | task name → role | the roles catalog |
| Safety program assignment | person → role → program | the role record |
| **Trip Triage (this)** | production × department → seat → person; production × event-type → dated instance | the Contact Sheet seat + the production's calendar |

⭐ **The lesson across all three: never join two attributes to each other, join both to the canonical record.** A trip does not know who travels — the SEAT knows. A trip does not know when — the production's CALENDAR knows.

**One-line law:** *resolve or flag — never infer a person, a date, or a code.*

---

## Coordinates

| Surface | Location |
| --- | --- |
| **TRIPS** (target) | URITP PRODUCTIONS ▸ Travel & Accom ▸ list `901328144404` |
| **Contact Sheet** (who) | URITP PRODUCTIONS ▸ Production STAFFING ▸ list `901328115174` |
| **Production Events (canonical)** (event TYPE table) | **URITP ▸ FMP Tables** ▸ list `901328145059` |
| **Per-production calendars** (when) | one folder PER production — see Rosetta, and read the CALENDARS trap first |
| **ADULTS / STUDENTS** (people) | URITP CRM ▸ PEOPLE ▸ ADULTS `901313504035` · STUDENTS |

**Fields on a TRIPS row:** `URITP Productions` (labels) · `Production DEPARTMENT` (dropdown) · `Purpose (Event)` (relationship → the type table) · `Trip For` (relationship → ADULTS) · `BEGIN` / `END` (frozen date mirror) · native start/due.

🔧 **READ REQUIREMENT (v2):** custom fields do NOT resolve by task id alone — `SELECT "custom:URITP Productions" … WHERE id IN (…)` returns a hard *"Custom field not found"*. **Every read must be scoped to the list:** `WHERE list = '901328144404' AND id IN (…)`. Same for Contact Sheet reads (`WHERE list = '901328115174'`). A cold agent hits this on its first query.

---

## 🔤 ROSETTA — production short codes (SET; do not ask, do not invent)

Michael, 2026-08-10: *"the acronyms for these shows are very much set so another agent session, let alone a Milo session, should know that Secretary = TS and be able to fill them in without asking."*

**Every code below is READ OFF A LIVE LIST NAME in URITP PRODUCTIONS.** This documents existing vocabulary; it proposes nothing.

| Code | Production (label value) | Its calendar lists |
| --- | --- | --- |
| `BL` | Big Love (F26) | `Production Cal (BL)` · `[BL] Rehearsals` · `Show Design (BL)` |
| `TS` | The Secretary (S27) | `Events (TS)` · `Rehearsals (TS)` |
| `TIM-D` | **T.I.M.E. reading (F26)** — FALL devising | `Prod Cal & Reh (TIM-D)` · `Rehearsals (TIM-D)` |
| `TIME` | **T.I.M.E. staged (S27)** — SPRING staged | `Prod Cal (TIME)` · `Rehearsals (TIME)` |
| `OA` | One Acts (F26) | `Events (OA)` · `Paperwork (OA 2026)` |
| `KL` | Kali (F26) | `Rehearsals (KL)` · `Kali` |
| `P` / `P0` | 🚫 **NOT A PRODUCTION** — the SHOW TEMPLATE. Never emit as a trip code. | `COMA (P0)` · `Paperwork (P0)` · `events (P)` |

### 🔴 THE T.I.M.E. FORK — flagged by Michael as the hard one

*"TIME devising in the fall is a tough one 'TIM-D' versus the staged version in the spring 'TIME'."* Two productions, one show title, one semester apart, codes three characters different.

- 🚫 **NEVER discriminate by the task-name prefix.** Both trees write `[TIME] …` — `[TIME] Auditions (if needed)` is in `Prod Cal (TIME)`, `[TIME] Casting (auditions weekend)` is in `Prod Cal & Reh (TIM-D)`. **The prefix is ambiguous in live data right now.**
- ✅ **Discriminate by the LIST the event lives in, or the SEMESTER in the label.** `(F26)` → `TIM-D`. `(S27)` → `TIME`.
- ⚠️ Never fuzzy-match these two. Exact label, exact list.

🩹 **LIVE SCAR, 2026-08-10:** this hook's author named a trip `{TIME}{Design Visit}{Scenic}` while its label read **T.I.M.E. reading (F26)** — the fall show, `TIM-D`. **Wrong code within an hour of the fork being explained.** Corrected to `{TIM-D}{Scenic}@{Design Visit}`. ⚠️ That row still carries a due date of `2027-03-02` — a SPRING date on a FALL label. Either the code or the label is wrong; the correct move was to flag, not pick. Open.

---

## 🚨 THE CALENDARS TRAP — read before any date lookup

**Multiple different folders in URITP PRODUCTIONS are all named `CALENDARS`** — different ids, identical display name, roughly one per production — plus `OA Calendars` and `Devised CALENDARS`, which break the pattern entirely. **Do not write down how many there are; count them at read time if you need the number.**

🔴 **Scoping a date search to "the CALENDARS folder" silently searches ONE production's calendar and returns clean.** On 2026-08-10 this produced the confident, wrong report *"The Secretary and T.I.M.E. have no production calendar"* — delivered to Michael. Both have full calendars. The search had resolved to Big Love's folder and found nothing, which is exactly what "nothing exists" looks like.

⭐ **This is the repo-referent-gate failure in a ClickUp costume: a true answer to a question nobody asked.** Same fix — **derive the coordinate from the SUBJECT, state it, then search.**

✅ **The safe move: query the SPACE (`901313768203`) and read the `home_list_name` column** against the Rosetta table. The list name carries the production code; the folder name does not.

---

## 🔴 THE STRUCTURAL GAP — `Purpose (Event)` points at a TYPE table

`Production Events (canonical)` holds abstract event KINDS — `| Designer Run |`, `| Tech |`, `| Opening Night |`, `| First Costume Fittings |`, `| Meet & Greet |`, `| First Rehearsal |`, `| Site Visit |`, `| Design Presentation |`, `| Auditions |`. One row serves every production, forever. **Read the list for its current membership; never quote a count from this file** (a hardcoded count here rotted within fifteen minutes of v1 merging — Known-Drift Register D3).

**None of those rows has a date, and none can.** A type is not an occurrence. The dated occurrences live in the per-production calendars as `[BL] Designer Run`, `[BL] Tech 1`…`Tech 5`, `[TS] Auditions`.

⭐ **The chain is: Trip → event TYPE → ✂️ → dated INSTANCE. The middle link does not exist as a relationship.** The only bridge is NAME MATCHING — the identical mechanism that left the Contact Sheet `ROLE` join at 41-of-49 rows empty while looking healthy.

### 🗄️ Why it is shaped this way — and whose call the fix is (v2)

**The canonical list lives in URITP ▸ `FMP Tables`.** It is **FileMaker schema staging**, not a ClickUp modelling accident. It is typed and undated *on purpose* — it was never meant to hold occurrences.

⚠️ **So the instance layer is a FileMaker design decision and belongs to FMP Fiona, not to a ClickUp workaround.** In FMP you would reach the date through `Production × EventType → EventInstance`. **Do not build an instance layer in ClickUp to close this gap without her.** This hook is a BRIDGE OVER A MISSING RELATIONSHIP; if the instance layer is ever built, most of step 2 is deleted, and that is the good outcome. Never harden the string matching into something that looks permanent.

---

## The routine

### 0. Orient · state the coordinate

- Confirm scope: which production(s), which trips. **State the production CODE and its calendar lists out loud before searching**, derived from Rosetta.
- Read every target row FRESH, list-scoped (see the READ REQUIREMENT). Never reuse a row read earlier in the session.
- Skip any row prefixed `<cut>`.

### 1. WHO — resolve `Trip For` through the seat

1. Read the trip's `URITP Productions` label + `Production DEPARTMENT`.
2. Find the matching seat on **Contact Sheet**.
3. Take that seat's `ADULT` (or `STUDENT`) link. That is `Trip For`.

🔧 **HOW TO FIND THE SEAT (v2) — the naive query returns the WRONG PRODUCTION.** Contact Sheet holds a full seat set for EVERY production, so a role name alone matches many rows. **Two SEARCH terms do not AND together** — searching `'Video Designer'` + `'Secretary'` returned Big Love's Scenic, Lighting, Costume and Sound seats in a live test.

✅ **Correct method: filter on the `URITP Productions` custom field, then match the role in the returned set.**

```
SELECT id, name, "custom:URITP Productions", "custom:ROLE", "custom:ADULT", "custom:STUDENT"
FROM tasks
WHERE list = '901328115174'
  AND "custom:URITP Productions" IS NOT NULL
  AND is_subtask IN (true, false)
```

**Then pick the row whose production label matches EXACTLY and whose name is the seat.** 🚫 Never trust a single-SEARCH result. 🚫 Never accept a seat whose production label you have not read back. **Writing another show's designer into a real trip is the one failure in this hook that produces a wrong answer instead of a stop.**

⚠️ **THE ASSUMPTION THIS JOIN RIDES ON.** `Production DEPARTMENT` has 13 options; Contact Sheet is keyed by **SEAT** (~50 roles). `Costumes, H/M/W` alone spans Costume Designer, Costume Shop Manager, Assistant CSM, Hair & Makeup, Wardrobe Supervisor, Wardrobe Run Crew. **The join lands on the right person only because a TRIP implies the visiting designer** — the head who travels in, not resident staff. Re-check it any time a non-designer travels.

⚠️ A seat that exists with an EMPTY `ADULT`/`STUDENT` means **the seat is uncast**, not that the join failed. Report it that way.

### 2. WHEN — resolve dates through the production's calendar

1. Read `Purpose (Event)`. It may hold MORE THAN ONE type.
2. Using Rosetta, open **that production's own** calendar lists.
3. Match each type to its dated instance by name. **Report it as a name match, not a resolved relationship.**
4. `START` = earliest matched instance's start day. `DUE` = latest matched instance's end day.

🔧 **EMPTY `Purpose (Event)` — the majority case, and v1 dead-ended here.** Many live rows carry the purpose only in the NAME (`{TS}{Costume}@{First Fittings, Meet & Greet}`). Do NOT stop.

**Fallback ladder, stop at the first rung that resolves:**

- **a.** `Purpose (Event)` link → canonical type → calendar instance. The real path.
- **b.** **Purpose legible in the name** → match that phrase to the canonical type list → calendar instance. ⚠️ **Label the result `inferred from name`, every time, in the report.** Propose setting `Purpose (Event)` as part of the same proposal — closing the gap is more valuable than the dates.
- **c.** Purpose legible but matching NO canonical type → propose the date from the calendar AND flag that the type table may be missing a row. Michael adds types; you do not.
- **d.** Nothing legible → `⚠️ unresolvable`, and say which field would fix it.

⚠️ **Rung b is INFERENCE, and Guardrail 3 still holds: the link is the data, the name is display.** Inferring a date from a name is allowed; silently promoting the name into the link is not.

**Whole-day collapse (RULE, not rounding):** a timed event yields a WHOLE-DAY trip. A 7–10pm Designer Run on the 14th produces a trip dated the 14th, all day. State it every time.

**Single day → same day.** `START` and `DUE` both that date. Michael's explicit instruction.

🚦 **MULTI-PURPOSE IS A FORK, NOT A CALCULATION — ASK, DO NOT SPAN.** Two purposes days apart (Tech 10/2 + Opening 10/8) can mean one seven-night stay OR two trips. **This is one-trip-per-booking applied to TIME instead of people, and it has the same answer shape: if they fly home in between, it is TWO ROWS.** Never silently emit a span. A wrong span books six unnecessary hotel nights.

### 3. NAME — only once WHO and WHEN are known

The trip name is a derived display key over four values. Convention and generated-vs-typed are OPEN QUESTIONS on the TRIPS Decision Log — **read it before renaming anything.**

⚠️ **Two of the four name sources CANNOT hold a short code.** `URITP Productions` is a **Labels** field, `Production DEPARTMENT` is a **Dropdown**; both are attribute-less strings with nowhere to store an abbreviation. An abbreviated name therefore requires the Rosetta table applied by the AGENT. **That is exactly why the table lives in this file and not in an automation prompt** — a prompt-embedded map is invisible, unversioned, and wrong the day a show is added.

### 4. Report · propose, do not write

A table: trip · resolved person · resolved dates · the SOURCE row each value came from · `⚠️` on anything unresolved · `inferred from name` on any rung-b result. Close with a tally: resolved / inferred / flagged / blocked. **The table IS the deliverable in phase 1.**

---

## Guardrails

1. 🔒 **NEVER overwrite a CONFIRMED booking with a derived date.** Some trips carry real flight and hotel dates. A derived date is a guess; a booked date is a fact. Check comments, checklists and the description for booking evidence before proposing any date change on a row that already has one.
2. 🔒 **Empty source writes empty.** Never substitute a plausible date, person, or code. A substituted default is indistinguishable from a real value downstream (Derived Field Pattern Q4, locked).
3. 🔒 **A DISAGREEMENT between a row's name and its links is a FINDING, not something to normalize.** Renaming it silently destroys the evidence. The link is the data, the name is display — say so and let Michael rule.
4. 🔒 **RE-READ BEFORE EVERY WRITE.** Michael works this list while a pass is open. On 2026-08-10 two rows changed between a bulk-rename preview and its apply, and the stale preview would have overwritten both; the list also grew from 13 to 25 rows inside one session and one row disappeared entirely between two reads. **The preview's left-hand column IS the freshness check.**
5. 🔒 **Never invent a production code.** Rosetta is closed. A production not in it gets a `⚠️` and Michael names the code.
6. 🔒 **State the coordinate before searching** (the CALENDARS trap). Never scope by a folder name.
7. 🔒 **Report string matches AS string matches.** The type↔instance join is not a relationship.
8. 🔒 **`<cut>` in a row name means CANCELLED.** Skip it entirely — do not resolve dates, do not rename, do not clear its fields. It keeps its person and purpose deliberately, as a record of what was called off.
9. 🔒 **Never write a COUNT into this file** (Known-Drift Register D3). Event types, calendar folders, trip rows and seats all move. Count at read time.

---

## NOT this tool

- **Not INBOX triage** — that MOVEs and COMBINEs a queue; this resolves fields on live rows.
- **Not Meeting Scratch Triage** — that normalizes comment shorthand; this joins schema.
- **Not the Derived Field Pattern** — that is the LAW on values tracking other values (`Q0`–`Q4`) and it GOVERNS this hook. Load it before proposing any mechanism.
- **Not a booking agent.** This resolves what a trip IS. Booking flights and rooms is human work.

---

## 🗒️ Steward's ledger (Milo — decisions and scars)

Michael: *"you hold decisions and notes for yourself but share most of the process to public."* The procedure above is public and reusable. This is the accumulated judgement that makes it work, kept in the TOOL rather than in Milo's memory bundle because it is procedural knowledge (Constitution §2–§3).

1. **The department-vs-seat assumption (step 1) is the most fragile thing here.** Right every time so far because only designers travel. The first resident-staff trip breaks it.
2. **The type/instance gap is the thing worth fixing — in FILEMAKER, not here.** v1 called it a ClickUp gap; that was wrong. The canonical list is FMP staging and the instance layer is Fiona's call. Everything in step 2 is competent workaround until she rules.
3. **A trip row is a BOOKING, not a visit.** One person, one show, one room, one ticket. Shared-visit context (a joint site visit's negotiation history, cost analysis, email trail) has **no home** and ends up on whichever person's row held it first. TRIPS Decision Log J2; unsolved.
4. **Michael edits live.** Every bulk pass must assume the data moved since the read.
5. **Two independent arguments landed on prose names over coded ones** (2026-08-10): the Labels/Dropdown fields cannot store codes, AND one-trip-per-person broke uniqueness on the three-token coded form. When two unrelated arguments agree, stop hunting a third.
6. **v1 failed its own cold-walk, and the pattern in the failures is worth more than the fixes.** Four of five defects were things this repo already had a rule or a file for — a hardcoded count (D3 forbids it), a missing Trigger block (`_HOOK-TEMPLATE.md` prescribes it), an unstated query requirement, and an over-budget file (the Size Enforcer targets 10–12KB). **The hook was authored by copying a sibling instead of reading the template that governs hooks.** Copying a neighbour inherits its shape and none of the standard it was supposed to meet.

---

**Composes with:** `hooks/cross-space-research-gate.md` · the **Derived Field Pattern** ClickUp page (governing law) · the **TRIPS Decision Log** (open naming questions) · `hooks/task-context-orientation.md` · `gates/repo-referent-gate.md` (the coordinate-at-subject-turn discipline the CALENDARS trap instantiates) · `hooks/source-size-budget-enforcer.md` (this file is over target; split the Rosetta table or the ledger before adding sections).

**Decision history:** TRIPS (URITP Travel & Accom) — Decision Log, ClickUp, under the Brain Reference Library.

**Changelog:**

- **v2 (2026-08-10)** — Cold-walk audit against live rows found five defects; all fixed here. Added the **Trigger** block (missing entirely; `_HOOK-TEMPLATE.md` requires it). Added the **empty-`Purpose (Event)` fallback ladder** — v1 dead-ended on what turned out to be the majority case. Added the **correct seat-lookup method** after a live test proved the naive single-SEARCH query returns another production's designers, the one path that produced a wrong answer rather than a stop. Added the **list-scope read requirement** (custom fields do not resolve by task id alone). **Struck the hardcoded event-type count** and added Guardrail 9 — the count was wrong within fifteen minutes of v1 merging. Also: `<cut>` cancellation convention (Guardrail 8), the **FMP Tables provenance** that re-assigns the instance-layer decision to Fiona, and ledger item 6.
- **v1 (2026-08-10)** — Established in the TRIPS session at Michael's instruction (*"write yourself a hook?? we'll do this again"*), after a live pass that resolved `Trip For` for Big Love, renamed 12 rows, split a two-artist visit into per-person bookings, and staged dates for 8 trips. Named on Michael's coinage (*"this trips=triage might just be worth calling it"*). Carried the Rosetta table, the T.I.M.E. fork, and the CALENDARS trap. Phase 1 propose-only.
