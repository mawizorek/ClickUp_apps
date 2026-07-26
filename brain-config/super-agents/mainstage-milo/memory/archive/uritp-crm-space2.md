# Archive: Mainstage Milo / URITP CRM (Space 2) — Pass-1 walk detail

> WARM tier. Graduated out of `memory.md` on 2026-07-26 by Memory Maggie under
> `hooks/memory-rotation.md`, mid-session, on Michael's explicit instruction (the hook
> normally fires only at close — see the flag in that session's transcript).
>
> **Why it graduated:** Space 2 reached Pass-1 COMPLETE. Every list, folder and subfolder
> has a List Index row plus a documentation page, so the ClickUp trail is now the source of
> truth and this no longer needs to load every session. The handful of facts that still
> change how Milo acts tomorrow stayed HOT; everything below is on-demand.
>
> **Load this when:** a CRM list comes back up, a projection question arises, anything
> touches the two generations of company records, or Space 3 work reaches back into CRM.
>
> Append-only. Never edit, never reorganize.

---

## Space true purpose (LOCKED by Michael)

CRM is the **identity spine**. A person's relationship to the program is many-to-many and
time-sliced, and there was no single row to hang it on. It holds the person; every
operational surface elsewhere is a **projection** of that record into a context.

## Live structure (verified by opening containers, not inferred)

Exactly TWO folders.

- **PEOPLE** ▸ ADULTS · STUDENTS · ROLES (subfolder: THTR MAJORS / MINORS / Cluster-ers /
  SM CERTIFICATES) · GENERAL AVAILABLITY · Labor · Adjuncts & Guests · UR Staff & Faculty
- **CONTACT SHEETS** ▸ FY26 (subfolder) · FY27 (Upcoming) (subfolder) · SHOW ROLES

**Natives vs projections:** only STUDENTS (303), ADULTS (101) and SHOW ROLES (51) hold
native tasks. Everything else is projection — one record was found live in 17 lists at once.

## PEOPLE folder — the cascade IS the reason it exists

Defines **35 fields** in four groups: identity + contact (11) · the Mon–Fri **availability
engine** (8, incl. `Availablity Status` NEED/UPDATE/CURRENT and a Clear button) · the
**Gen-1 involvement archive** (13) · certification/workflow (3, incl. `Lift Certified`).
No folder-level status set. Automations are unreadable by audit tooling — noted unverified,
not assumed absent.

**F2 headline finding — the Gen-1 fields MIGRATED LEVELS** (verified by field id). Every
show through S'26 is defined at FOLDER level; every show from F'26 onward at SPACE level
(`[Big Love] F'26`, `[T.I.M.E. devising] F'26`, `[T.I.M.E. staged] S'27`, `[The Secretary]
S'27`, `[OA27]`, `?KF?`). A folder field reaches only PEOPLE's children; a SPACE field
reaches every list in CRM — **including the contact sheets AND SHOW ROLES itself**, which is
why the SHOW ROLES catalog inherits label copies of its own vocabulary. Side effect, never
intended. Milo's read: the label fields didn't just fail to get retired, they got PROMOTED to
wider scope exactly as their replacement shipped. Whatever gets decided about Gen 1 should
also decide what LEVEL it lives at.

## The two generations (Michael-confirmed)

- **Gen 1 (pre-FY26):** a show's company recorded as a **label field on each person**, one
  field per production, options = the role vocabulary.
- **Gen 2 (FY26+):** a **contact-sheet list** joined to the **SHOW ROLES** catalog by
  relationship.
- Gen 2 is a deliberate UPGRADE of Gen 1, so the apparent duplication is a **predecessor
  relationship**, not a conflict.

## CONTACT SHEETS — the best-built structure in CRM

A real relational model: SHOW ROLES = 51 role DEFINITIONS (typed Task, not Person) → per-show
sheets project people in from STUDENTS/ADULTS → every sheet defines a `list_relationship`
into SHOW ROLES. A sheet row is a genuine PERSON × ROLE × SHOW assignment against a
controlled vocabulary.

- **FY26** (closed season, 4 sheets): CHR 58 · T/C 51 · Memo 43 · PAW 39.
  **FY27** (upcoming, 3): The Secretary 25 · Big Love 24 · T.I.M.E. 23. 263 rows / 7 shows.
- **CHR is the reference implementation** (both generations, full contact trio, a unique
  `URITP Distro List`). **T/C is the minimal correct one** (ONE join field, everything else
  inherited) — which raises whether CHR's extras were experiments rather than requirements.
- **`Standard Role` + `Consistent Role`** on the catalog encode a **staffing-gap calculator**
  nothing currently reads. Standard = does every show need this role; Consistent = is it
  usually the same person. The difference between them is the hiring list.
- **34 of 51 role definitions are half-drafted** (20 new + 9 in progress + 5 notate). Status
  on SHOW ROLES tracks how settled the DEFINITION is, not casting; `notate` is a live to-do.
- The FY folders group by **sheet vintage, not season** (PAW is an F'25 show filed under FY26).
- **T.I.M.E. is the messiest for a real reason:** the only two-phase production (devising F'26
  + staged S'27). `T.I.M.E. Role ()` exists with empty parens, and SHOW ROLES carries the
  matching duplicate on its side. Gen 1 handled two phases cleanly with two label fields;
  **Gen 2 cannot express phase at all.** The old mechanism models this show better.
- **Big Love's Gen-1 label options were cloned from a previous musical and never renamed** —
  `[cast] Natasha / PIERRE / ANATOLE / HELENE` are Great Comet characters, and the same dead
  cast list appears verbatim in `[The Secretary]` and both `[T.I.M.E.]` fields. Write-once
  lists can't be meaningfully edited, so each new show inherits the last one's dead options.

## Per-list facts worth keeping

- **STUDENTS (303):** `complete` = graduated/departed; 69 are alumni, so any query treating
  complete as "done processing" silently scopes them in. Enrollment field series is a known
  stopgap headed to the FileMaker build, not a ClickUp restructure.
- **ADULTS (101):** `complete` = **relationship inactive** (the middle state), independent of
  the contact-data pass which lives in description prose. Holds **two populations with
  opposite behavior** — standing staff in 8–12 lists each, guest artists in 0–2. Carries real
  relationship-maintenance data (`Gift Ideas`, `Birthday`) and one performance appraisal. No
  `Assigned Programs` / `Safety Programs` — those live only on STUDENTS, so the PROGRAMS
  entanglement runs through the STUDENT record. `Courses taught` is the faculty-side mirror
  of STUDENTS' enrollment slots, built as ONE relationship field instead of one per semester.
- **ROLES subfolder:** academic-standing + credential cohorts, 100% projection, 19 unique
  students across all four lists, subfolder defines nothing. **THTR MINORS holds 1 record
  against 303 students — do NOT trust it as a roster of minors**; it's the proof that when two
  mechanisms hold one fact and neither is authoritative, the weaker silently rots.
  **SM CERTIFICATES is the only ROLES list touching production COMPETENCE** — and URITP
  records two certifications two incompatible ways (`Lift Certified` = dated field on every
  person; SM cert = undated list membership; only the field can answer "is it current").
- **GENERAL AVAILABLITY (6):** a **QUEUE, not a roster** — the active working set. Defines
  ZERO fields, and that zero is the finding. Its smallness is the feature; a large one would
  be the failure state.
- **3 empty lists** (Labor, Adjuncts & Guests, UR Staff & Faculty): the purpose was correct,
  the mechanism lost — `URITP Affiliation` on ADULTS does the same segmentation in one field.
  DEAD, not dormant. Retire/build decision parked pending the projection-fan question.

## The availability root cause (the diagnosis behind Milo's standing assignment)

Four surfaces across **THREE** spaces:

1. **GENERAL AVAILABLITY** (CRM ▸ PEOPLE) — adds nothing, contributes membership.
2. **PM Availablity** (⚠️ URITP PRODUCTIONS ▸ The Christians, NOT CRM) — four dropdowns
   encoding ONE meeting poll (`Option 1: Tue 11:30a - 12:30p` …) + attendance priority.
3. **Postmortem Availability** (Space 1 ▸ Season Planning) — calendar dates baked into field
   names for one December event.
4. **Company Postmortem attendees** (Space 1) — attendance, a different question entirely.

**ONE ENGINE FOR RECURRING AVAILABILITY, ZERO ENGINE FOR ONE-OFF POLLS.** The weekday
`availability:` fields on a show list are the SAME fields (verified by id) as CRM PEOPLE's,
so data written on a show IS the person's data — that part works. Every time-boxed poll,
however, mints a new list plus hard-coded date fields that persist forever. One write-once
dropdown carries `CONFRIMED!` frozen in permanently.

## Provenance

Walked 2026-07-25 → 07-26 with Audit Anna leading. 23 Index rows (Sort 100–122), 17
documentation pages, 5 Decision Logs, 11 J-blocks. Nothing on any subject list was changed.
Standing thread: `task:86ajknmmk`. All 23 rows sit at **Documented** — Confirmed is Michael's
word only.
