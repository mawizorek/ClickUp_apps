# Trip Triage · AI Toolkit

**Purpose:** Resolve a sparse row in URITP PRODUCTIONS ▸ Travel & Accom ▸ **TRIPS** into a complete, bookable trip — the PERSON who travels, the DATES they travel, and a name that reads — by joining through canonical records instead of guessing. A trip row is one person's room and one person's ticket.

**Steward:** Mainstage Milo. Any agent may fire it; Milo owns the file.

**Mode:** On-demand routine, PROPOSE-FIRST. Phase 1 writes nothing without a greenlight.

**Invocation:** `/trip-triage` · `/trips` · "triage the trips" · "fill in the trip dates" · "who is this trip for" · scoped forms preferred ("triage the Big Love trips").

**Trigger (auto-eligibility; still manual-fire in phase 1):** all of —

1. Target is the **TRIPS** list (`901328144404`) or a task whose home list is TRIPS.
2. At least one row is INCOMPLETE on a resolvable field: `Trip For` empty · `Production DEPARTMENT` empty · native start/due empty · name off-convention.
3. The row carries at least ONE resolvable input: a `URITP Productions` label, a `Purpose (Event)` link, or a purpose legible in the name.

🚫 **Does NOT fire on:** a row prefixed `<cut>` (Guardrail 8) · a row whose dates came from a real booking (Guardrail 1) · any list other than TRIPS.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

📓 **Notes, scars and provenance: `hooks/trip-triage.notes.md`.** You do not need it to RUN this hook. **Read it before you CHANGE this hook**, or when a guardrail below looks arbitrary — every one of them has a documented failure behind it.

**Established 2026-08-10** by Mainstage Milo.

---

## ⭐ The premise

This is a **RESOLVE-THROUGH-CANONICAL** join, the third we own (with the Contact Sheet `ROLE` join and safety-program assignment).

⭐ **Never join two attributes to each other — join both to the canonical record.** A trip does not know who travels; the SEAT knows. A trip does not know when; the production's CALENDAR knows.

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

🔧 **READ REQUIREMENT.** Custom fields do NOT resolve by task id alone — `SELECT "custom:URITP Productions" … WHERE id IN (…)` returns a hard *"Custom field not found"*. **Scope every read to the list:** `WHERE list = '901328144404' AND id IN (…)`. Same for Contact Sheet (`WHERE list = '901328115174'`).

---

## 🔤 ROSETTA — production short codes (SET; do not ask, do not invent)

Michael, 2026-08-10: *"the acronyms for these shows are very much set so another agent session, let alone a Milo session, should know that Secretary = TS and be able to fill them in without asking."* Every code below is read off a live list name; this documents existing vocabulary and proposes nothing.

| Code | Production (label value) | Its calendar lists |
| --- | --- | --- |
| `BL` | Big Love (F26) | `Production Cal (BL)` · `[BL] Rehearsals` · `Show Design (BL)` |
| `TS` | The Secretary (S27) | `Events (TS)` · `Rehearsals (TS)` |
| `TIM-D` | **T.I.M.E. reading (F26)** — FALL devising | `Prod Cal & Reh (TIM-D)` · `Rehearsals (TIM-D)` |
| `TIME` | **T.I.M.E. staged (S27)** — SPRING staged | `Prod Cal (TIME)` · `Rehearsals (TIME)` |
| `OA` | One Acts (F26) | `Events (OA)` · `Paperwork (OA 2026)` |
| `KL` | Kali (F26) | `Rehearsals (KL)` · `Kali` |
| `P` / `P0` | 🚫 **NOT A PRODUCTION** — the SHOW TEMPLATE. Never emit as a trip code. | `COMA (P0)` · `Paperwork (P0)` · `events (P)` |

🔴 **THE T.I.M.E. FORK.** Two productions, one title, one semester apart.

- 🚫 **Never discriminate by the task-name prefix.** Both trees write `[TIME] …` — the prefix is ambiguous in live data.
- ✅ **Discriminate by the LIST the event lives in, or the SEMESTER in the label.** `(F26)` → `TIM-D`. `(S27)` → `TIME`.
- ⚠️ Never fuzzy-match these two. Exact label, exact list. *(Scar: notes → S2.)*

---

## 🚨 THE CALENDARS TRAP — read before any date lookup

**Multiple folders in URITP PRODUCTIONS are all named `CALENDARS`** — different ids, identical display name, roughly one per production — plus `OA Calendars` and `Devised CALENDARS`. **Count them at read time; never write the number down.**

🔴 **Scoping a search to "the CALENDARS folder" silently searches ONE production's and returns clean.** An empty result is indistinguishable from "nothing exists." This has already produced a confident wrong report. *(Scar: notes → S1.)*

✅ **The safe move: query the SPACE (`901313768203`) and read the `home_list_name` column** against Rosetta. The list name carries the production code; the folder name does not.

---

## 🔴 THE STRUCTURAL GAP — `Purpose (Event)` points at a TYPE table

`Production Events (canonical)` holds abstract event KINDS (`| Designer Run |`, `| Tech |`, `| Opening Night |`, …). One row serves every production, forever. **Read the list for its current membership; never quote a count** (Guardrail 9).

**None of those rows has a date, and none can.** The dated occurrences live in the per-production calendars as `[BL] Designer Run`, `[BL] Tech 1`…`Tech 5`, `[TS] Auditions`.

⭐ **The chain is: Trip → event TYPE → ✂️ → dated INSTANCE, and the middle link does not exist as a relationship.** The only bridge is NAME MATCHING — the same mechanism that left the Contact Sheet `ROLE` join at 41-of-49 rows empty while looking healthy. **Always report it as a name match.**

⚠️ **The canonical list is FileMaker schema staging (it lives in `FMP Tables`), so the missing instance layer is FMP Fiona's design call. Do not build one in ClickUp without her.** Full reasoning: notes → Provenance.

---

## The routine

### 0. Orient · state the coordinate

- Confirm scope. **State the production CODE and its calendar lists out loud before searching**, derived from Rosetta.
- Read every target row FRESH and list-scoped. Never reuse a row read earlier in the session.
- Skip any row prefixed `<cut>`.

### 1. WHO — resolve `Trip For` through the seat

1. Read the trip's `URITP Productions` label + `Production DEPARTMENT`.
2. Find the matching seat on **Contact Sheet**.
3. Take that seat's `ADULT` (or `STUDENT`) link. That is `Trip For`.

🔧 **HOW TO FIND THE SEAT — the naive query returns the WRONG PRODUCTION.** Contact Sheet holds a full seat set for every production, and **two SEARCH terms do not AND together.**

✅ **Correct method: filter on the `URITP Productions` custom field, then match the seat in the returned set.**

```
SELECT id, name, "custom:URITP Productions", "custom:ROLE", "custom:ADULT", "custom:STUDENT"
FROM tasks
WHERE list = '901328115174'
  AND "custom:URITP Productions" IS NOT NULL
  AND is_subtask IN (true, false)
```

🚫 **Never trust a single-SEARCH result. Never accept a seat whose production label you have not read back.** This is the one path in the hook that produces a wrong answer instead of a stop. *(Scar: notes → S3.)*

⚠️ **The assumption this join rides on:** `Production DEPARTMENT` is a DEPARTMENT (13 options); Contact Sheet is keyed by SEAT (~50 roles). It lands correctly only because **a TRIP implies the visiting designer.** Re-check it any time a non-designer travels. *(notes → ledger 1.)*

⚠️ A seat that exists with an EMPTY `ADULT`/`STUDENT` means **the seat is uncast**, not that the join failed. Report it that way.

### 2. WHEN — resolve dates through the production's calendar

1. Read `Purpose (Event)`. It may hold MORE THAN ONE type.
2. Using Rosetta, open **that production's own** calendar lists.
3. Match each type to its dated instance by name. **Report it as a name match.**
4. `START` = earliest matched instance's start day. `DUE` = latest matched instance's end day.

🔧 **EMPTY `Purpose (Event)` is common — do NOT stop.** Fallback ladder, stop at the first rung that resolves:

- **a.** `Purpose (Event)` link → canonical type → calendar instance. The real path.
- **b.** **Purpose legible in the name** → match that phrase to the canonical type list → calendar instance. ⚠️ **Label the result `inferred from name`, every time.** Propose SETTING `Purpose (Event)` in the same proposal — closing the gap beats the dates.
- **c.** Purpose legible but matching NO canonical type → propose the date AND flag that the type table may be missing a row. Michael adds types; you do not.
- **d.** Nothing legible → `⚠️ unresolvable`, and name the field that would fix it.

⚠️ **Rung b is INFERENCE.** Guardrail 3 still holds: inferring a date from a name is allowed; silently promoting the name into the link is not.

**Whole-day collapse (RULE, not rounding):** a timed event yields a WHOLE-DAY trip. A 7–10pm Designer Run on the 14th produces a trip dated the 14th, all day. State it every time.

**Single day → same day.** `START` and `DUE` both that date.

🚦 **MULTI-PURPOSE IS A FORK, NOT A CALCULATION — ASK, DO NOT SPAN.** Two purposes days apart can mean one long stay OR two trips. **This is one-trip-per-booking applied to TIME instead of people: if they fly home in between, it is TWO ROWS.** A wrong span books nights nobody needs.

### 3. NAME — only once WHO and WHEN are known

The trip name is a derived display key over four values. **Convention and generated-vs-typed are OPEN QUESTIONS on the TRIPS Decision Log — read it before renaming anything.**

⚠️ **Two of the four name sources cannot hold a short code** — `URITP Productions` is a Labels field and `Production DEPARTMENT` is a Dropdown, both attribute-less strings. An abbreviated name therefore requires Rosetta applied by the AGENT, which is why that table lives in this file and never in an automation prompt.

### 4. Report · propose, do not write

A table: trip · resolved person · resolved dates · the SOURCE row each value came from · `⚠️` on anything unresolved · `inferred from name` on any rung-b result. Close with a tally: resolved / inferred / flagged / blocked. **The table IS the deliverable in phase 1.**

---

## Guardrails

1. 🔒 **NEVER overwrite a CONFIRMED booking with a derived date.** Check comments, checklists and the description for booking evidence first. A derived date is a guess; a booked date is a fact.
2. 🔒 **Empty source writes empty.** Never substitute a plausible date, person or code (Derived Field Pattern Q4, locked).
3. 🔒 **A disagreement between a row's name and its links is a FINDING, not something to normalize.** The link is the data, the name is display — say so and let Michael rule.
4. 🔒 **RE-READ BEFORE EVERY WRITE.** Michael edits this list while a pass is open; rows move, and rows vanish. The preview's left-hand column IS the freshness check. *(notes → S4.)*
5. 🔒 **Never invent a production code.** Rosetta is closed; an unlisted production gets a `⚠️` and Michael names it.
6. 🔒 **State the coordinate before searching.** Never scope by a folder name. *(notes → S1.)*
7. 🔒 **Report string matches AS string matches.** The type↔instance join is not a relationship.
8. 🔒 **`<cut>` in a row name means CANCELLED.** Skip it entirely — do not resolve dates, rename, or clear its fields. It keeps its person and purpose deliberately.
9. 🔒 **Never write a COUNT into this file** (Known-Drift Register D3). Event types, calendar folders, trip rows and seats all move. *(notes → S5.)*

---

## NOT this tool

- **Not INBOX triage** — that MOVEs and COMBINEs a queue; this resolves fields on live rows.
- **Not Meeting Scratch Triage** — that normalizes comment shorthand; this joins schema.
- **Not the Derived Field Pattern** — that is the LAW on values tracking other values (`Q0`–`Q4`) and it GOVERNS this hook. Load it before proposing any mechanism.
- **Not a booking agent.** This resolves what a trip IS. Booking flights and rooms is human work.

---

**Composes with:** `hooks/trip-triage.notes.md` (scars + ledger; read before changing this file) · `hooks/cross-space-research-gate.md` · the **Derived Field Pattern** ClickUp page (governing law) · the **TRIPS Decision Log** (open naming questions) · `hooks/task-context-orientation.md` · `gates/repo-referent-gate.md`.

**Changelog:** `hooks/trip-triage.notes.md`. **Decision history:** TRIPS (URITP Travel & Accom) — Decision Log, ClickUp.
