# Trip Triage · AI Toolkit

**Purpose:** Take a sparse row in URITP PRODUCTIONS ▸ Travel & Accom ▸ **TRIPS** and resolve it into a complete, bookable trip — the PERSON who travels, the DATES they travel, and a name that reads — by joining it through canonical records instead of guessing. A trip row is one person's room and one person's ticket; this hook is what fills it in.

**Steward:** Mainstage Milo (URITP production ops). Any agent may fire it. Milo owns the file.

**Mode:** On-demand, PROPOSE-FIRST. Phase 1 is manual-fire and writes nothing without a greenlight. Promotion to auto-fill is earned per-field from real runs, not granted up front.

**Invocation:** `/trip-triage` · `/trips` · "triage the trips" · "fill in the trip dates" · "who is this trip for" · scoped forms preferred ("triage the Big Love trips").

**Established 2026-08-10** in the TRIPS session, at Michael's direct instruction: *"that bridge is for you to hold Milo. write yourself a hook?? we'll do this again."*

---

## ⭐ The premise — this is a RESOLVE-THROUGH-CANONICAL join, and we already own two others

Michael named the shape himself: *"think assignments to canonical role to assign all those people to a safety program through their association with the canonical record. this is that but in a different flavor."*

<p><br/></p>

The family:

| Instance | Join | Canonical record |
| --- | --- | --- |
| Contact Sheet `ROLE` | task name → role | the roles catalog |
| Safety program assignment | person → role → program | the role record |
| **Trip Triage (this)** | production × department → seat → person; production × event-type → dated instance | the Contact Sheet seat + the production's own calendar |

<p><br/></p>

⭐ **The recurring lesson across all three: never join two attributes to each other, join both to the canonical record.** A trip does not know who travels. The SEAT knows. A trip does not know when. The production's CALENDAR knows. This hook's whole job is to walk to the canonical record and come back, rather than pattern-matching on strings.

<p><br/></p>

**One-line law:** *resolve or flag — never infer a person, a date, or a code.*

---

## Coordinates

| Surface | Location |
| --- | --- |
| **TRIPS** (the target) | URITP PRODUCTIONS ▸ Travel & Accom ▸ list `901328144404` |
| **Contact Sheet** (who) | URITP PRODUCTIONS ▸ Production STAFFING ▸ list `901328115174` |
| **Production Events (canonical)** (the event TYPE table) | list `901328145059` — 8 abstract types, **NO DATES, by design** |
| **Per-production calendars** (when) | one calendar folder PER production, see the Rosetta table below |
| **ADULTS / STUDENTS** (the people) | URITP CRM ▸ PEOPLE ▸ ADULTS `901313504035` · STUDENTS |

**Fields on a TRIPS row:** `URITP Productions` (labels) · `Production DEPARTMENT` (dropdown) · `Purpose (Event)` (relationship → the type table) · `Trip For` (relationship → ADULTS) · `BEGIN` / `END` (date, the frozen mirror) · native start/due.

---

## 🔤 ROSETTA — production short codes (SET, do not ask, do not invent)

Michael, 2026-08-10: *"the acronyms for these shows are very much set so another agent session, let alone a Milo session, should know that Secretary = TS and be able to fill them in without asking."*

<p><br/></p>

**These are not proposals. Every one is READ OFF THE LIVE LIST NAMES in URITP PRODUCTIONS — the workspace already uses them.**

| Code | Production (label value) | Its calendar lists |
| --- | --- | --- |
| `BL` | Big Love (F26) | `Production Cal (BL)` · `[BL] Rehearsals` · `Show Design (BL)` |
| `TS` | The Secretary (S27) | `Events (TS)` · `Rehearsals (TS)` |
| `TIM-D` | **T.I.M.E. reading (F26)** — the FALL devising/reading | `Prod Cal & Reh (TIM-D)` · `Rehearsals (TIM-D)` |
| `TIME` | **T.I.M.E. staged (S27)** — the SPRING staged production | `Prod Cal (TIME)` · `Rehearsals (TIME)` |
| `OA` | One Acts (F26) | `Events (OA)` · `Paperwork (OA 2026)` |
| `KL` | Kali (F26) | `Rehearsals (KL)` · `Kali` |
| `P` / `P0` | 🚫 **NOT A PRODUCTION** — the SHOW TEMPLATE. Never emit as a trip code. | `COMA (P0)` · `Paperwork (P0)` · `events (P)` |

<p><br/></p>

### 🔴 THE T.I.M.E. FORK — the one that will bite, and Michael flagged it as hard

*"TIME devising in the fall is a tough one 'TIM-D' versus the staged version in the spring 'TIME'."*

<p><br/></p>

**Two productions, one show title, one semester apart, and their codes differ by three characters.**

- 🚫 **NEVER discriminate them by the task-name prefix.** Both trees write `[TIME] …` in task names — `[TIME] Auditions (if needed)` lives in `Prod Cal (TIME)` and `[TIME] Casting (auditions weekend)` lives in `Prod Cal & Reh (TIM-D)`. **The prefix is ambiguous in the live data right now.**
- ✅ **Discriminate by the LIST the event lives in, or by the SEMESTER in the label.** `(F26)` → `TIM-D`. `(S27)` → `TIME`. The list name is the only unambiguous signal.
- ⚠️ **`TIME` is a substring of `TIM-D` reasoning but not of the string** — do not fuzzy-match these two. Exact label, exact list.

<p><br/></p>

🩹 **LIVE SCAR, 2026-08-10:** this hook's own author renamed a trip to `{TIME}{Design Visit}{Scenic}` while its `URITP Productions` label read **T.I.M.E. reading (F26)** — the fall devising show, which is `TIM-D`. **Wrong code, applied within an hour of the fork being explained.** That row also carries a due date of `2027-03-02`, which is a SPRING date on a FALL label, so either the code or the label is wrong and the correct move was to flag rather than pick. Left open deliberately.

---

## 🚨 THE CALENDARS TRAP — read this before any date lookup

**There are FIVE different folders named `CALENDARS` in URITP PRODUCTIONS.** Different folder ids, identical display name, one per production, plus `OA Calendars` and `Devised CALENDARS` which break the naming pattern entirely.

<p><br/></p>

🔴 **Consequence, and it has already produced a false negative: scoping a date search to "the CALENDARS folder" silently searches ONE production's calendar and returns clean.** On 2026-08-10 this produced the confident, wrong report *"The Secretary and T.I.M.E. have no production calendar"* — reported to Michael. Both have full calendars (`Events (TS)` has 58 rows; `Prod Cal (TIME)` has 59). The search had resolved to Big Love's folder and found nothing, which is exactly what "nothing exists" looks like.

<p><br/></p>

⭐ **This is the repo-referent-gate failure in a ClickUp costume: a true answer to a question nobody asked.** Same fix: **derive the coordinate from the SUBJECT, state it, then search.** Never scope by a folder NAME. Scope by the production's own folder id, or search the whole SPACE and filter by list.

<p><br/></p>

✅ **The safe move: query the SPACE (`901313768203`) and read the `home_list_name` column** against the Rosetta table. The list name carries the production code; the folder name does not.

---

## 🔴 THE STRUCTURAL GAP — `Purpose (Event)` points at the wrong table

`Production Events (canonical)` is a **TYPE table**: 8 rows, one per event kind, serving every production forever. `| Designer Run |`, `| Tech |`, `| Opening Night |`, `| First Costume Fittings |`, `| Meet & Greet |`, `| First Rehearsal |`, `| Site Visit |`, `| Design Presentation |`.

<p><br/></p>

**None of them has a date, and none of them can.** A type is not an occurrence. The dated occurrences live in the per-production calendars as `[BL] Designer Run`, `[BL] Tech 1`…`Tech 5`, `[TS] Auditions`.

<p><br/></p>

⭐ **So the chain is: Trip → event TYPE → ✂️ → dated INSTANCE. The middle link does not exist as a relationship.** There is no per-production instance record joining the canonical type to the calendar row. Today the only bridge is NAME MATCHING, which is the identical mechanism that left the Contact Sheet `ROLE` join at 41-of-49 rows empty while looking healthy.

<p><br/></p>

🗄️ **The FMP read (Fiona):** you have a type table and an instance table and the instance table has no foreign key back to the type. In FileMaker you would never reach a date from a type — you reach it through `Production × EventType → EventInstance`. **`Purpose (Event)` should point at the INSTANCE, not the type.** Until it does, this hook is doing a string join and must be honest about that in every report.

<p><br/></p>

⚠️ **This hook is therefore a BRIDGE OVER A MISSING RELATIONSHIP, not a feature.** If the instance layer ever gets built, most of step 2 below is deleted, and that is the good outcome. Do not harden the string matching into something that looks permanent.

---

## The routine

### 0. Orient · state the coordinate

- Confirm scope: which production(s), which trips. State the production CODE and its calendar lists out loud before searching, derived from the Rosetta table.
- Read every target trip row FRESH. Never reuse a row read earlier in the session — Michael edits the same rows while a pass is open (see the Guardrails).

### 1. WHO — resolve `Trip For` through the seat

1. Read the trip's `URITP Productions` label + `Production DEPARTMENT`.
2. Find the matching seat on **Contact Sheet**: same production label, the role corresponding to the department.
3. Take that seat's `ADULT` (or `STUDENT`) link. That is `Trip For`.

<p><br/></p>

⚠️ **THE ASSUMPTION THIS JOIN RIDES ON, stated because it is invisible and load-bearing.** `Production DEPARTMENT` has 13 options; Contact Sheet is keyed by **SEAT** (~50 roles). `Costumes, H/M/W` alone spans Costume Designer, Costume Shop Manager, Assistant CSM, Hair & Makeup, Wardrobe Supervisor and Wardrobe Run Crew. **The join lands on the right person only because a TRIP implies the visiting designer** — the department head who travels in, not the resident staff. That is a real assumption about how URITP works and it must be re-checked any time a non-designer travels.

<p><br/></p>

⚠️ **`Production DEPARTMENT` is a DROPDOWN with no `Direction` option until 2026-08-10** (added in that session, because director travel was literally unclassifiable). If a department value is missing for a real travelling role, that is a vocabulary gap — say so, do not file it under `GENERAL`.

### 2. WHEN — resolve dates through the production's calendar

1. Read `Purpose (Event)`. It may hold MORE THAN ONE type (e.g. Tech + Opening Night).
2. Using the Rosetta table, open **that production's own** calendar lists.
3. Match each type to its dated instance by name. **Report the match as a name match, not as a resolved relationship.**
4. `START` = earliest matched instance's start day. `DUE` = latest matched instance's end day.

<p><br/></p>

**Whole-day collapse (RULE, not rounding):** a timed event yields a WHOLE-DAY trip. A 7–10pm Designer Run on the 14th produces a trip dated the 14th, all day. Travel occupies the day the event falls on. State this every time, because the trip dates are then NOT literally the event's timestamps.

<p><br/></p>

**Single day → same day.** `START` and `DUE` both that date. Michael's explicit instruction.

<p><br/></p>

🚦 **MULTI-PURPOSE IS A FORK, NOT A CALCULATION — ASK, DO NOT SPAN.** Two purposes days apart (Tech 10/2 + Opening 10/8) can mean one seven-night stay OR two separate trips. **This is the one-trip-per-person-per-booking rule applied to TIME instead of to people, and it has the same answer shape: if they fly home in between, it is TWO ROWS.** Never silently emit a span; present both and let Michael choose. A wrong span books six unnecessary hotel nights.

### 3. NAME — only once WHO and WHEN are known

The trip name is a derived display key over four values. Convention and generated-vs-typed are OPEN QUESTIONS on the TRIPS Decision Log — **read it before renaming anything.**

<p><br/></p>

⚠️ **Two of the four name sources CANNOT hold a short code.** `URITP Productions` is a **Labels** field and `Production DEPARTMENT` is a **Dropdown**; both are attribute-less strings with nowhere to store an abbreviation. So an abbreviated name requires the Rosetta table above to be applied by the AGENT — there is no lookup. **That is exactly why this table lives in this file and not in an automation prompt:** a prompt-embedded map is invisible and unversioned, and goes wrong the day a show is added.

### 4. Report · propose, do not write

Output a table: trip · resolved person · resolved dates · the SOURCE row each value came from · and a `⚠️` on anything unresolved. Close with a tally: resolved / flagged / blocked-on-missing-data. **The table IS the deliverable in phase 1.**

---

## Guardrails

- 🔒 **NEVER overwrite a CONFIRMED booking with a derived date.** Some trips carry real flight and hotel dates from a booked itinerary. A derived date is a guess; a booked date is a fact. **Check for booking evidence — comments, checklists, an itinerary in the description — before proposing any date change on a row that already has one.**
- 🔒 **Empty source writes empty.** Never substitute a plausible date, person, or code. A substituted default is indistinguishable from a real value downstream (Derived Field Pattern Q4, locked).
- 🔒 **A DISAGREEMENT between a row's name and its links is a FINDING, not a thing to normalize.** A trip named for one event but linked to another means one of them is wrong; renaming it silently destroys the evidence. **The link is the data, the name is the display — but say so and let Michael rule.**
- 🔒 **RE-READ BEFORE EVERY WRITE.** Michael works the same list while a pass is open. On 2026-08-10 two rows changed between a bulk-rename preview and its apply, and the stale preview would have silently overwritten both. **The preview's left-hand column IS the freshness check — read it, do not skim it.**
- 🔒 **Never invent a production code.** The Rosetta table is closed. A production not in it gets a `⚠️`, and Michael names the code.
- 🔒 **State the coordinate before searching** (the CALENDARS trap). Never scope by a folder name.
- 🔒 **Report string matches AS string matches.** The type↔instance join is not a relationship and must never be presented as one.

---

## NOT this tool

- **Not INBOX triage** — that MOVEs and COMBINEs a queue; this resolves fields on live rows.
- **Not Meeting Scratch Triage** — that normalizes comment shorthand; this joins schema.
- **Not the Derived Field Pattern** — that is the LAW on values tracking other values (`Q0`–`Q4`, and it governs this hook). This is one domain's application of it. **Load that page before proposing any mechanism here.**
- **Not a booking agent.** This resolves what a trip IS. Actually booking flights and rooms is human work.

---

## 🗒️ Steward's ledger (Milo — decisions and scars, kept here on purpose)

Michael's instruction: *"you hold decisions and notes for yourself but share most of the process to public."* The procedure above is public and reusable. This section is the accumulated judgement that makes it work, and it lives in the TOOL rather than in Milo's memory bundle because it is procedural knowledge (Constitution §2–§3).

<p><br/></p>

1. **The department-vs-seat assumption (step 1) is the single most fragile thing in this hook.** It has been right every time so far because only designers travel. The first resident-staff trip breaks it.
2. **The type/instance gap (step 2) is the thing worth fixing.** Everything else here is competent workaround. If a session has appetite for one structural improvement in TRIPS, it is an instance layer — not a better string match.
3. **A trip row is a BOOKING, not a visit.** One person, one show, one room, one ticket. Shared-visit context (a joint site visit's negotiation history, cost analysis, email trail) currently has **no home** — it ends up on whichever person's row happened to hold it first. Named on the TRIPS Decision Log J2; unsolved.
4. **Michael edits live.** Every bulk pass on this list must assume the data moved since the read.
5. **Two independent arguments landed on prose names over coded ones** (2026-08-10): the Labels/Dropdown fields cannot store codes, AND one-trip-per-person broke uniqueness on the three-token coded form. When two unrelated arguments agree, stop hunting a third.

---

**Composes with:** `hooks/cross-space-research-gate.md` (map the surfaces before proposing) · the **Derived Field Pattern** ClickUp page (the governing law) · the **TRIPS Decision Log** (open questions on naming) · `hooks/task-context-orientation.md` (orients a trip task before this runs) · `gates/repo-referent-gate.md` (the coordinate-at-subject-turn discipline the CALENDARS trap is an instance of).

**Decision history:** TRIPS (URITP Travel & Accom) — Decision Log, ClickUp, under the Brain Reference Library.

**Changelog:**

- **v1 (2026-08-10)** — Established in the TRIPS session at Michael's instruction (*"write yourself a hook?? we'll do this again"*), after a live pass that resolved `Trip For` for Big Love, renamed 12 rows, split a two-artist visit into per-person bookings, and staged dates for 8 trips. Named `trip-triage` on Michael's own coinage (*"this trips=triage might just be worth calling it"*). Carries the Rosetta code table so no future session asks for a code again, the T.I.M.E. `TIM-D`/`TIME` fork, and the five-folders-named-CALENDARS trap with its false-negative scar. Phase 1 propose-only.
