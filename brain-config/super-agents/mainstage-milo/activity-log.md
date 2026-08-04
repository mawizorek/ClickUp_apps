# Mainstage Milo — Activity Log

_Live project state + rolling session ledger. Newest on top._
_Hot window: the LIVE STATE block + the last ~2 closes. Older entries: `activity-log/2026-Q3.md`._

> 📌 **THIS FILE IS WHERE MY ONGOING PROJECTS LIVE** (Michael's ruling, 2026-07-30). `memory.md` holds patterns, preferences and durable workspace knowledge; **anything with a count, a status, a frontier, a park or an owed answer belongs here.** Read the LIVE STATE block FIRST on any pickup.
>
> ⚠️ **Budget note:** `hooks/memory-rotation.md` sets a ~5KB sliding window written for a pure session ledger. **The window applies to the ENTRIES below the LIVE STATE block, not to the whole file.** Flagged, not fudged — the hook needs the new shape.

---

## ➡️ LIVE STATE — what I'm carrying right now

### The URITP list audit (Anna leads; I hold the workspace knowledge)

🌟 **SPACES 1, 2, 3, 4 AND 5 ARE PASS-1 COMPLETE.** Space 5 additionally **fully Confirmed.**

➡️ **NEXT: SPACE 6 — URITP Courses (`901313847910`)**, ~612 tasks / 7 folders, not opened yet. Then **SPACE 7 — URITP BETA BUDGET (`901313517644`)**, ~408 tasks / 4 folders. Both gate the 🎩 FOUR HATS session.

**Index: 154 rows — 138 Confirmed · 16 Documented.** Verified 2026-07-30 11:25 AM ET against `901327881037` with `is_subtask IN (true, false) AND is_closed IN (true, false)`. ⚠️ **The Jul 30 close artifact said 152 and was 2 light.** **Re-query, never reuse a count older than the last close.**

**Machinery:** standing thread `86ajknmmk` (**reopen, never spawn a new session task**) · **List Index `901327881037`** ⚠️ NOT `901327854042`, that's the Custom Field Dictionary · Audit Frontier Scan = the resume surface · Roadmap banner has drifted 3× (distrust it against the live Index) · List Audit DoD `12cwjm-76573` · `/council=uritp-audit` seats the bench. **`Confirmed` is MICHAEL's word only.**

### 🎯 My standing assignments (owed, not parked)

**1 · The availability-tracking problem** (his, 2026-07-25). Mine to carry; **Corey** is the call-in for the ClickUp mechanism. The finding is settled — recurring weekly availability is well-built and genuinely shared (same field ids across spaces); the **time-boxed poll** has no mechanism, so every "pick one of these four Tuesday slots" mints a new list plus hard-coded date fields that persist forever. **What's owed is the proposal, not the diagnosis.**

**2 · ROLES cluster Q1 — Corey and I owe a RECOMMENDATION** (his, 2026-07-27): *"how does corey or Milo think we should set this up."* **Not a park.** STUDENTS carries a `Major | Minor | Cluster` field while four ROLES lists express the same fact as membership. Corey owns the ClickUp mechanism, I own how the cohort data is actually used. **Establish what each mechanism is FOR before picking a winner.** We report at the brainstorm sessions, informed by Spaces 4–7; Michael rules after. ⚠️ The subfolder-naming question folded INTO this — **do not propose a rename in isolation.**

### 🅿️ Parked / scheduled — carry, do not force

- **CRM projection-fan shape — OPEN.** *"you're seeing growing pains."* **Never read a verdict into it.**
- **ROLES — park #3.** Space 3 did not resolve it; Q1 above is the live thread.
- **📅 Gen-1 going forward = SCHEDULED:** a session with **Corey + FMP Fiona** (bundle `fmp-frank`). That pair now has **four** queued conversations and no home.
- **One Acts format** + **the three umbrella folders' placement** → Pass 2 by decision.
- **SHOW TEMPLATE Q7 open:** three fields (`Department`, `Phase`, `Venue`) no production uses.
- **Space-4 Q4:** where the stalled-pilot / superseded line falls. Undecided, **and it changes what every Space-4 flag means.**
- **Calendar-surface sprawl** (6 surfaces) · the **Routines ↔ Season Planning dividing line** · **access control across 5 surfaces / 3 spaces.**
- **`| DEFINITIONS FOR PROGRAMS |`** — a real task in Space 1 ▸ Production PROGRAMS at `researching` since **Jan 2025.** The definition question the audit keeps circling is already an open task in the workspace.

### 🎒 Carry into Space 6 and 7

- **Roadmap flag 11** — PD-spend orphans (travel/book/course items at `submitted` in Prof Dev ▸ Optional Trainings). Candidate home: `PM Budetting ▸ WISH LIST`.
- **The RIT-course three-facets finding:** one course = **Receipt** (money) + **Event** (attendance) + **3 SCANS** (artifact). Already multi-homed, so **3 facets of one thing, not a scatter.**
- **Roadmap flag 12** — Core Competencies cluster lives only in `(Summer) Projects`.
- **CRM ROLES** (`THTR MAJORS` / `MINORS` / `Cluster-ers`) are the enrolment side. ⚠️ **Do not resolve the ROLES park inside Space 6.**
- **Expect `Person` and `Book` task types** — both exist workspace-wide and Courses is where they most plausibly land.
- **Roadmap flag 1** — CRM ▸ PEOPLE ▸ `Labor` is EMPTY while BETA BUDGET ▸ LABOR is populated. **Explicitly deferred: "resolves at Space 7."** Verify from the Space-7 side before locking it.

---

## 2026-08-04 · Cross-session deposit: org chart + team composition confirmed

**Surface:** Job Market Research task (86ajtgbt3), comment thread — Paige-led gap-closure session.

**Deposited to memory.md (not a Milo session, but core URITP knowledge confirmed by Michael):**
- Org chart split: 4 direct reports (Charlie, Mary, Casey, Katie) · 2 peers (Sara, Chris) · Nigel above.
- Budget: ~$50K/production × 4–5 shows = $200–250K/year (materials + student labor).
- Team scale: ~9 staff + 19-person leadership + 25–40 student positions.
- 10 craft disciplines, 7 management domains, dual-track (workforce + educational).
- Michael confirmed the split with zero corrections to the bench's guess.
- Role framing: PM title undersells scope; actual ≈ Director of Production.

**No project state changed. No LIVE STATE updates needed.**

---

## 2026-08-03 · INBOX intake: Faculty Council Meeting Dates 2026-2027 — COMPLETE ✅

- **Capture:** URITP-8973 (`86aee8dfb`), single email from Emily Prinzi (UR Senior Faculty Affairs Officer). Mass announcement listing all Faculty Council meeting dates for the 2026-2027 academic year (8 meetings, monthly first-Wednesday, 4-5pm).
- **Disposition:** MOVE executed → Recurring Academic Events (Season Planning). Merge of triage plan task (`86ajv41yu`) into this task complete.
- **Pattern adopted: SCHEDULE POINTER** — single task, rolling dates, indexed schedule in custom field. No subtask clutter. One entity, always pointing at next occurrence.
- **Dates set:** Start/due → Wed Sep 9, 2026, 4:00-5:00pm ET (Hawkins Carlson Room). Status reopened to `new`.
- **Custom field CREATED by Michael:** `Meeting Schedule` (Multi Line Text, field ID `a03adfca-58bb-4f3b-b14d-af0e39366028`). Populated with canonical template.
- **🔒 TEMPLATE FORMAT (use from now on for schedule-pointer fields):**
  ```
  - [ ] Day Mon Date, Year Time (Location)
  - [ ] Day Mon Date, Year Time (Location)
  ```
  Markdown checkbox syntax. Unchecked = upcoming. Checked (`- [x]`) = past/completed. One line per occurrence.
- **Automation spec (manual setup):** "When due date arrives" → AI Action parses the field, advances start/due to next `- [ ]` date, marks previous `- [x]`.
- **Corey seated + confirmed** the schedule-pointer pattern as best practice (no native recurrence for irregular date lists with exceptions).
- **Description tidy-up (PA energy pass):** Raw email body flushed from description → archived as comment. Description rebuilt as clean reference surface: Zoom link at top, contacts, pattern note. Title updated to "Faculty Council Meeting (2026-27)". Critical access info (Zoom) is now one-glance findable.

---

## 2026-07-30 · PICKUP, and my memory got re-shaped

- Seated via `/council=uritp-audit` on the 6+7 pickup. Standing thread reopened, not recreated.
- **My `memory.md` was carrying a two-space-stale live-state block** — *"Spaces 1, 2 AND 3 PASS-1 COMPLETE… 59 rows"* — underneath my own ⚠️ warning about a stale count. Anna's had the identical rot.
- **Michael's ruling:** memory = patterns + core preferences; ongoing project state → the activity log, *"so they can see what their ongoing projects are."* Executed: memory 10.3KB → 8.4KB, all project state moved into the LIVE STATE block above.
- **This is the same lesson I already learned smaller.** On 07-26 I blew my cap writing per-list audit detail into memory and was told it belongs in the standing thread. **I fixed the granularity and kept the category error** — project state of any size was still landing in the wrong file.
- **Worth noting for my own thesis:** my file encoded project state in a place meant for durable knowledge, which is *exactly* the workspace pattern I keep documenting. **I did the thing I diagnose.**

---

## 2026-07-27 → 07-30 · SPACES 4 AND 5 Pass-1 COMPLETE — my reads

- **Space 4 (URITP Programs) = the PROOF layer, not a catalog** (purpose confirmed): policy → blank form → signed return → incident. 5 containers, 9 lists, 87 tasks. **`{ braces }` = blank form, `Person: Topic` = signed return, and that NAMING is the only state machine, because the space defines zero custom fields.** ⚠️ Michael: it is **NOT live and operating** (8 submissions, 5 people, all June 9–10). `Production PROGRAMS (private)` is **not private and not sealed** — it's a **WORKING BENCH** (56 program records + 16 errands like "bucket of sand"), and **a bench doesn't project outward.** His reframe that mattered: **the procedure-named lists are TRAINING LOGS, not per-occurrence logs.**
- 🌟 **PROGRAM SPRAWL: I helped retire it, and we were wrong.** 14 of 17 `Programs in Development` tasks are the same tasks multi-homed and `Policies` is a labelled live migration — both true — but the flag described a *different* pair, and the real evidence was there: **25 records minted in `Production PROGRAMS` in 90 seconds on 2025-07-13, ~18 duplicating `SAFETY Programs`, `CATWALK Program` twice sixty seconds apart, all distinct IDs.** Michael reinstated it on instinct. **⚠️ Space 1's PROGRAMS page still describes the old reading and needs correcting.**
- **Space 5 (URITP Inventories) — the space he called "out of control" is the most rigorously wired data model in the workspace.** Model↔unit populated **351/351** (LX) and **553/558** (RIGGING), with button fields standing in for stored procedures. **It's a relational database operated inside a task manager. The data was never the problem; the container is** — which is why the FileMaker instinct points there and why the migration inherits a clean schema.
- **Four data layers, not two:** MODEL · UNIT · CONTAINER (`STORAGE BINS`) · ADDRESS SPACE (`SPAC Relays`). **They SEPARATE on migration** (J3): ~180 model records stay in ClickUp, ~1,050 unit records go to FileMaker.
- **`AUDIO Itemized` is archived and holds 87 records** (the SPAC permanent audio install among them) while every space-wide query reported **1**. The space holds ~1,682 tasks, not ~1,596. **The archive was accidental — unarchive it.**
- 🌟 **"That's what Lightwright is for"** — a **third disposition** beside ClickUp and FileMaker. Second instance after Space 4's EH&S system. **Not everything is ours to hold.**
- Other rulings I need to carry: fungibility applies downward and retroactively (collapse ~380 identical rigging rows) · the `OWNER` field beats the name prefixes, strip them · `[90XX]` was invented here and extends to all six departments · `COUNT` needs two numbers, owned AND usable · the numeral statuses are **unnamed series stages, not counts.**

---

## 2026-07-26 · SPACE 3 (URITP PRODUCTIONS) Pass-1 COMPLETE — my home turf

- Seated all session with Anna leading, Mira convening, Corey and Fiona alongside. 18 folders, 18 Index rows, 3 pages. Full detail: `memory/archive/uritp-productions-space3.md`.
- 🌟 **The production lifecycle is legible in the data** — scaffold → staffing up → in build → running → finished (~85–96% closed). **Status spread dates a show's position** the way naming grammar dates its build.
- 🌟 **The growth order:** hub+calendar → rehearsals → paperwork → design → **strike/risk LAST.** ONE ACTS (2026) is the only live show with a strike list and the only one where paperwork outweighs the calendar. **You can tell how far along a show is by which lists EXIST, without opening a task.**
- **My bundle was rotated at the top of that session**, then I promptly blew the cap again mid-session — **per-list audit detail belongs in the standing thread, not my memory.**
- **Scope ruling landed:** `Theatre` / `CRM` / `Inventory` / `Work` are his work life outside URITP. Cross-board pattern notes are **Corey's** lane.
- _(Space 2 / CRM close entry rotated out — full detail lives in `memory/archive/uritp-crm-space2.md`.)_
