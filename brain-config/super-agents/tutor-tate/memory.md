# Tutor Tate — Memory (accumulated context, never process)

> **INHERITED vs EARNED is marked per line.** Inherited = assembled at birth 2026-07-30 and is a
> LEAD to verify, not a fact to quote. EARNED = I read the source myself.
>
> Procedure never lives here (Constitution §2–§3). No counts, no statuses → `activity-log.md` (§4a).

---

## Ledger A — Course landscape (EARNED 2026-08-04, from source)

🔴 **The birth-seeded Ledger A was WRONG and is deleted.** It said *"three courses appear live:
ENGL 124, ENGL 270, ENGL 271."* All three are **legacy numbers**, the catalog is far larger, and
those three were Michael's own teaching load rather than the program's offering.

### The renumber — the single most load-bearing fact in my lane

**The department moved from an ENGL prefix to THTR and renumbered nearly every course**, effective
AY 26-27. Nigel Maister to the company, 2025-12-02: *"Theatre courses will now have a THTR prefix
and the vast majority will have a new number too."*

- 🚨 **A BARE THREE-DIGIT NUMBER IS AMBIGUOUS AND RESOLVES WRONG ABOUT HALF THE TIME.**
  ENGL 123 was Playwriting → **THTR 123 is Intro to Lighting.** ENGL 124 was Lighting →
  **THTR 124 is Sound.** ENGL 270 was Advanced Technical Theater → **THTR 270 is Topics in
  Performance.** *Always write the prefix. Never accept a bare number from anyone, including Michael.*
- **The mapping is NOT one-to-one, four shapes:** digits reused · two legacy numbers collapsed into
  one (296+297 → 295; 298+299 → 298) · one current number over many legacy courses (292/293 → 290,
  sectioned per production) · topics numbers (260, 270 carry many titles). **So a course number is
  NOT a course identity.**
- **Old `[124]` / `[123]` / `|124|` list names are ONE course across two numbering eras**, not
  inconsistency.

### Where the canon lives, in priority order

0. ⭐⭐ **THE LEGACY↔CURRENT CROSSWALK IS LIVE IN CLICKUP, NOT IN A DOCUMENT** (EARNED 2026-09-21).
   `Course List` (`901305646914`) carries **both** an `ENGL` number field and a `THTR #` field on
   every course row. **Read that before reaching for any numbering sheet.** I verified all 35
   courses in the 390 migrated enrollment rows resolve through it with zero gaps. Six courses have
   a blank `ENGL` (THTR 101, 131, 132, 221, 228.01, 299) — plausibly post-renumber net-new, none
   in pre-F26 enrollment data. Full gate: `hooks/course-number-era-gate.md`.
1. ⭐ **The repo binder** — `mawizorek/uritp-doc-archive` → `02-courses/`. **`course-index.tsv` is
   THE canonical record**; the index page renders it and per-course pages are the prose.
2. **Nigel's numbering sheet** is upstream for numbers + credits. Newest held: `thtr course numbers
   20 Jan 2026.pdf` on **URITP-7024**, which also holds the whole provenance chain in its comments.
   ⚠️ **Work continued through February 2026, so a newer sheet probably exists.**
   Report definitions + import sessions live in **URITP ▸ FMP Tables** (`NM` = Nigel Maister).
3. **ClickUp `Course List` is the CURRENT-TERM surface**, not the definition home — **except** for
   the crosswalk itself (see 0), where it IS the source.
4. **Nigel's course FAMILIES are his own structure** and survive wherever the catalog is presented:
   120s tech/production · 130s design · 140s core performance · 150s specialized · 220s advanced
   tech · 240s advanced performance · 260s/270s topics · 290s production.

### Traps I have hit or verified myself

- 🔴 **I MISUSED A MARKER CLASS FOR A WHOLE SESSION BECAUSE I NEVER OPENED ITS DEFINITION.**
  `{.conf}` means **CONFIRMED** — *"double-checked against the real thing, trust it,"* and it paints
  green. I used it to mean *conflict*, so every disputed cell was telling the reader to TRUST the
  value that was in dispute. ⚠️ **The documentation was correct the whole time** (`theme/markers.tsv`
  and the Markers authoring page both say so plainly) — **I worked from what the word sounded like.**
  **Read the vocabulary at HEAD before using it, every time. A marker is a claim about trust, so a
  wrong one is worse than none.** The six: `tbc` unchecked · `verify` re-measure on site · `gap`
  known absence · `conf` confirmed · `est` approximate · `was` superseded.
- ⚠️ **A source document can be internally wrong.** The Sept 2025 `NEW Theater Course Numbers.Final
  Draft.xlsx` has its `Old ENGL #` column **misaligned by several rows** and contradicts its own
  second sheet. **Cross-check a crosswalk against three origins.** I took a wrong mapping from that
  exact tab AFTER flagging it as unreliable. **RESOLVED 2026-09-21:** stop cross-checking documents
  for legacy numbers — the `ENGL` field on Course List is the live source (Ledger A item 0).
- 🌟 **ERA-ACCURATE LABELING RELOCATES THE DIGIT COLLISION, IT DOES NOT REMOVE IT** (EARNED
  2026-09-21, Michael ruled era-accurate reporting). `THTR 270 Dance for the Actor` reports as
  **ENGL 141** for S25 while `THTR 141 Consent & Performance` reports as **THTR 141** for F26 —
  same digits, two unrelated courses, one report, now straddling the era seam where it is HARDER to
  catch. The prefix is what makes era-accuracy safe, so it is non-optional in every surface.
- ⚠️ **Not every ENGL number is archived.** THTR 100 Playwriting is a **live cross-listing** with
  ENGL 123.
- ⚠️ **`cancelled` is a DONE-type status** on `Course List` — a cut course reads as completed work.
- ⚠️ **The major and minor requirements are documented NOWHERE in our systems.** Only the three
  clusters are. The ClickUp program records have sat at `researching` since May 2025.

## Ledger B — How Michael works (EARNED)

- **When he contradicts me he is usually right, and the contradiction is the finding.**
- ⭐ **Look for the pattern in HIS OWN artifacts before designing one.** The cluster pages already
  carried the line schema, the collision handling and the credit markers. **Extract, do not invent.**
- 🔴 **PROSE IS THE ENEMY OF A REFERENCE FILE, and the rule is stricter than "less prose": NEVER
  EXPLAIN THE MECHANISM ON A READER-FACING PAGE.** No note about what is hidden, no provenance
  banner, no build state. *"That's just slop."* **Reasoning goes in the PR body and the Decision
  Log; the page carries the fact.** I violated this twice in one session, the second time after
  writing the rule into a handoff myself.
- **Empty beats plausible.** He wants blanks left visibly blank for the conversation that fills them.
- **He normalizes toward one canonical vector.** A second copy of a fact gets deleted on sight, even
  a useful-looking one.
- ⚠️ **He audits WHERE a lesson was written, not just whether it was learned.** *"Whose repo, agent,
  decision store, backlog or memory did you write each of those into?"* **A correction that lives
  only in a session transcript is lost** — the transcript is not read on a cold start. Place every
  correction where the next agent will trip over it, and expect to be asked.
- **He asks for the capture unprompted when he values the finding.** 2026-09-21: *"capture that in
  notes - in your memory if you think, or notes/hook for other agents…. your activity and stumbles
  belong in your agents index task."* **Placement is part of the work, and the split is explicit:
  reusable knowledge → memory or a cross-agent hook; what I DID and what I got WRONG → comments on
  my row in the 🤖 Agent Index.**
- Notes live IN the task. Decision logs, inverted polarity, read back before acting.

## Ledger C — Teaching patterns (EARNED — the ledger that justifies my class)

- 🌟 **The renumber is a TEACHING hazard, not just a data one.** Students, faculty and Workday all
  still say the old numbers. **Confirm which course before answering any numbered question.**
  This is also WHY era-accurate reporting is right: an ENGL label matches the transcript and the
  Workday record a student brings to advising.
- 🌟 **THTR 120 and THTR 298 are NOT interchangeable, and students try.** Credit for work on a PAST
  production cannot be claimed through Production Experience; the student enrolls in the current
  term's Performance Lab. **There is a signed drop/add on file for exactly this.**
- 🌟 **FOUR TERMS OF ENROLLMENT HISTORY NOW EXIST IN ONE QUERYABLE PLACE** (EARNED 2026-09-21).
  The retroactive migration put F24→S26 into the `Enrollments` junction (`901327636843`) beside F26.
  Longitudinal questions are answerable for the first time. What the first pass showed: **228
  distinct students** across the migrated terms, and **retention is the headline — 168 students
  appear in exactly ONE term, 46 in two, 12 in three, 2 in four.** Course-load is thin and steady
  (1.07–1.42 courses per student per term), so the program is broad-and-shallow by default, not
  deep. Stage Management (ENGL 296.1) is the single most-enrolled migrated course at 37.
- ⚠️ **The Production-Experience pathway is WEAKER than assumed and the sample is small.** Of 25
  students who took ENGL 126 / Production Experience in a migrated term, only **14 subsequent
  enrollments** follow, top destination Stage Management at 4. Do not narrate this as a pipeline
  until more terms land — but do not assume the funnel exists either.
- **Six intro-lighting topics were dropped ON PURPOSE:** Magic Sheets · Instrument Schedules · hang
  cards · lighting legend · plot sections · Rep plots vs show plots. Advanced paperwork, not intro.
- **Cluster eligibility arrives as a real advising problem, in the student's words** — *"I would love
  to take 124 but am unsure if it would fulfill my requirement."*
- ⚠️ **"2-credit courses no longer apply to the cluster"** — Michael's own note, with his own open
  question beside it: *"(majors and minors?)"*. **Unresolved, and it changes eligibility for every
  130s design course.**
- ⚠️ **Nothing here yet about where students get lost INSIDE a unit.** That needs a term in the room.

## Pointers (never restate)

- Being a teammate: `_shared/super-agent-base.md` · Mapping before acting:
  `hooks/cross-space-research-gate.md` · Recording a decision: Decision Logs Gold Standard.
- **Course numbering + era labeling:** `hooks/course-number-era-gate.md` (I steward it; Milo and
  Corey read it too — anyone who labels course data).
- **Course decisions:** the `Course List — Decision Log` page (under the `COURSES | LAB` folder page).
- **Authoring contract:** the gold standard on `template-docs` — seven-key header, the marker set,
  and the list of fields that are NOT header keys.
- **Fleet facts:** the 🤖 Agent Index list (`901328043244`) + `hooks/fleet-fact-sweep.md`.
- **Milo seam:** peers, no hierarchy. Production owns the EVENT, the course borrows it; a genuine
  conflict goes to Michael, never settled sideways (Courses log J9).
- **Enrollment data:** the `Enrollments` junction (`901327636843`) is the only enrollment history
  that exists post-migration; `COURSE x SEMESTER` (`901328228189`) holds the offerings. Read the
  2026-09-20 session task's audit loop before reporting off either — one accepted risk, four parked
  defects.
