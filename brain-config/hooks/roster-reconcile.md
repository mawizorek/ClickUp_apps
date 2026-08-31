# Roster Reconcile · AI Toolkit

**Purpose:** Take any drop of course-enrollment data — a full Workday export, a professor's class-list email, or a single permission-request thread — and keep the STUDENTS × Enrollments relational join current for the CURRENT TERM, without Michael doing it by hand. Propose first, write on greenlight.

**Steward:** Tutor Tate (course + roster/enrollment domain). The TOOL itself is ownerless for one-off runs (reconcile-family precedent — any agent fires it). Corey owns the Enrollments list STRUCTURE (fields/statuses); Milo owns the upstream prep-hook seam (`roster-reconcile-prep.md`); a formal, scoped, reported full-roster pass IS an audit and seizes to Audit Anna.

**Mode:** On-demand routine, propose-then-greenlight. **Scale-invariant:** one invocation handles a single student or a whole class — the tool reads what is in front of it, there is no mode switch.

**Invocation:** `roster reconcile` · `/roster-reconcile` · "reconcile this roster" · "reconcile the enrollments" · said while looking at an inbox permission email, a class-list email, or an attached Workday export.

**Trigger:** An enrollment-bearing source is in front of the agent — a Workday course-enrollment export (any number of classes), a professor's email carrying names/emails/pronouns, or a Default-Inbox permission-to-join thread for one student.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-08-31** by Brain (specced live with Michael, first day of F26 classes). Founding case: the 2026-08-20 F26 enrollments intake (89 enrollment rows, 43 Person tasks, email as the reconcile key), which this hook freezes into a repeatable routine.

---

## 🔒 PII RULE — READ BEFORE YOU EDIT THIS FILE

**Never write a student's name, email, URID, Student ID, major, schedule or any other identifying detail into this file, or any file in any repo.** Not in a procedure step, not in an example, not in a changelog, not "just as the case that proves the rule."

- `ClickUp_apps` is **PUBLIC.** A student example committed here is a FERPA disclosure, and git history keeps it after HEAD is cleaned.
- **De-identify by SHAPE, always.** "A from-line whose legal first name differs from the signature" teaches the whole lesson; the student's actual name teaches nothing a cold agent can use. If a rule needs a real case to be believed, the rule is badly written.
- Live cases live in the **INBOX ▸ Default chain** they came from, which is inside the workspace where the data already legitimately sits. Point at the chain, never copy the person into the repo.
- Same rule for professors, guest artists and staff, and it holds in `uritp-docs` (🔒 private) too — private is not a licence, it is a smaller blast radius.
- ⚠️ **A full Workday export is the highest-risk artifact this hook touches** — it carries names, Student IDs, majors and registration status for a whole department. It is attached to a workspace task, NEVER committed, NEVER pasted into a channel, NEVER quoted in a report beyond counts and roles.

> 🩹 Born of this file's own failure: v1 and v2 shipped 2026-08-31 with two real students named in Step 0 and in the changelog, in the public repo, while the FERPA line at the bottom of this very file forbade exactly that. **A guardrail written at the bottom did not stop the author at the top.** Scrubbed same day on Michael's catch; the originals persist in history at the PR #877 commit.

---

## Coordinates

| Surface | Location |
| --- | --- |
| **The human (person table)** | STUDENTS list · `901305646880` (URITP CRM ▸ PEOPLE) — task type `Person` |
| **The join (junction table)** | Enrollments list · `901327636843` (URITP Courses ▸ ROSTERS) |
| **The class-this-term (what is OFFERED F26)** | COURSE x SEMESTER list · `901328228189` (URITP Courses ▸ SCHEMA) — rows shaped `{THTR###}{TERM}` |
| **The course catalog (titles + codes + active/cancelled)** | Course List · `901305646914` (URITP Courses ▸ SCHEMA) — resolves a code to a title and confirms it runs |
| **The source email chains** | URITP ▸ INBOX ▸ Default — permanent one-task-per-chain replica; chains are LINKED, never moved |
| **Batch import session home** | Report Imports (Workday, NM, KT, etc) · `901324196217` (URITP ▸ FMP Tables) |
| **Report FORMAT (all three reports)** | `hooks/roster-reconcile.report-spec.md` — load before reporting |
| **Upstream prep** | `hooks/roster-reconcile-prep.md` (Milo sweeps the messy inbox into a clean candidate report) |

> 🔴 **Read the field/status set LIVE from the Enrollments list at run time — this hook NEVER enumerates it.** The dropdown values, statuses, and relationships are documented ON the list itself so every agent reads one truth. Baking the schema into this file guarantees it rots the first time a field is added. Same law as routing-by-Lane-at-read-time — and it applies to the COURSE catalog too: read the F26 offerings LIVE, never hardcode a course list here.

---

## The mental model (say it once, out loud)

This is a **foreign-key sync a database would do with a trigger.** STUDENTS is the person table, Enrollments is the junction table (one row = one student × one course-this-term), COURSE x SEMESTER answers "which term." ClickUp cannot keep a relational join current on its own, so this hook is the trigger, executed by an agent on demand. **The agent does the mechanical join maintenance; Michael's only manual act is the greenlight.**

**Default term = the CURRENT term** (kept as a pointer, not guessed from a date). A drop that does not state its term (a professor email never will) is assumed current; a full export names its own course/section.

---

## Procedure

### 0. 🔴 OPEN THE SOURCE IN FULL — never classify off a title

**Read the actual thread/export body before you decide anything. A subject line is a lead, not the content.** The title tells you a student and maybe a course; the BODY carries the email address, the pronouns, the URID, the referral, the legal-vs-preferred name, whether they have actually filed the Workday request yet, and which course they mean when the title doesn't say. A pass that classifies off titles will file the wrong bucket, miss the reconcile key, and never see the name split.

- Open every candidate thread and read it end to end — including the mirrored email-chain comments and Michael's replies, not just the description.
- Proven failure SHAPES this rule exists to stop (2026-08-31 first run, de-identified per the PII rule above — the live chains are in INBOX ▸ Default):
  - **A from-line whose legal first name differs from the name the student signs**, so Workday and the mail account disagree and the title shows neither. Keep the legal name as identity, carry the preferred name alongside.
  - **A how-does-this-work INQUIRY whose title is indistinguishable from a real permission request** — no Workday override filed, so the student is invisible on every roster surface and a title-only pass files them as pending approval.
  - **A thread whose COURSE was only knowable from the subject matter in the body** (the student wrote entirely about lighting and never named a code).
  - **A signed time-conflict resolution form naming TWO courses**, where the student already holds one of them — the form exists to ADD the other. A title-only read proposes a duplicate row for the course they are already in.
- 🔴 **A TITLE FILTER IS NOT A SCOPE.** Selecting candidate chains by a course string in the subject silently drops every chain that never names the course — which was **a third of them** on the first run, and included the highest-stakes items. This failed TWICE in one session (once picking candidates, once picking which chains to stamp). Scope by the CANDIDATE SET you built in step 2, never by a name match.
- **When in doubt, open MORE, not less.** The cost of an extra read is nothing; the cost of a title-only guess is a wrong write.

### 1. Intake + normalize

Classify the drop on the **completeness spectrum** — where it lands sets the record's confidence tier:

| Drop | Carries | Course identity | Record tier |
| --- | --- | --- | --- |
| **Thin** (professor email, permission thread) | names, emails, maybe pronouns | resolve per step 1a | ⚠️ BARE RECORD — needs a Workday pull |
| **Full export** (Workday) | Student ID, major/minor, registration status, section | read from the file | complete |

**Reconcile key: email is identity, Student ID confirms.** On a full export, match on BOTH; a row where email and Student ID disagree is a **CONFLICT** (surface it, never silently pick).

**Normalization runs seamless and surfaces conflicts ONLY** (Phase-1 behavior, to be bolstered later). A name-string difference (Workday legal name vs the name a kid goes by) is NOT a conflict when the keys agree: keep legal name as the identity field, capture the preferred name alongside, and only stop when the KEYS themselves disagree.

### 1b. 📦 Reading a COLD full export — what to expect, and the STATUS DECISION RULE

**Why this section exists.** Michael, 2026-08-31: *"write in your hook what those fields do and what to expect if you ever get a cold export like this in the future so you don't have to infer."* The first run set every status by inference from email evidence with no written rule, so the next pass would have re-derived it from scratch and probably differently.

<p></p>

🔴 **THE DISTINCTION THAT RESOLVES THIS FILE'S OWN CONTRADICTION — read it before you edit either half.** This hook is forbidden from enumerating the field set (see Coordinates), and that rule stands. It is not violated here, because two different things are being separated:

| | Lives where | Why |
| --- | --- | --- |
| **The VALUE LIST** (which options exist, their exact spelling) | 🔴 the Enrollments list, read LIVE every run | It is SCHEMA. It changes when Corey adds an option, and a copy here would rot silently. |
| **The DECISION RULE** (which evidence justifies which value) | ✅ this file | It is PROCEDURE. It does not rot when a field is added — a new option needs a new rule, which is a deliberate edit, not decay. |

**Never write the option list here. Always write the reasoning here.** A cold agent that reads the live list gets the vocabulary; it needs this file for the judgement.

#### The status ladder — evidence → value

Read the exact option spellings live, then map by **how far along the registration pipeline the evidence actually places the student.** The ladder, from least to most committed:

1. **A student has expressed interest but filed NOTHING in Workday.** They emailed, or they came to an event, or they were referred. There is no override request, so they are invisible to the registrar. → the least-committed "they're thinking about it" option.
2. **An override request EXISTS and is awaiting Michael's Approve/Deny.** The Workday notification says the request is live. Michael has not ruled. → the awaiting-a-decision option.
3. **Approved and/or on the registrar's roster but NOT registered for credit.** This is the state the *unregistered workflow* describes and it is the one most likely to be misread — see the caution below.
4. **Registered for credit, the enrollment is real.** → the active option.
5. **Was enrolled, has left.** → the withdrawn option. 🔴 Only ever off EXPLICIT evidence.
6. **Term finished, grade in.** → the complete option, set at end of term, never by an intake pass.

⚠️ **The pipeline is NOT linear and the export will prove it.** A student can be approved and never register, register and never attend, or attend with no request on file at all. **Do not infer position from a neighbouring fact** — attendance is not registration, approval is not enrollment, and an email saying "see you Tuesday" is not a registrar state.

#### 🔴 UNVERIFIED as of 2026-08-31 — the honest edge, do not paper over it

The ladder above is a **workspace-side** model, built from email evidence during the first run. **No full Workday export has been read against it yet.** Specifically unknown:

- **What the registrar's own status vocabulary is**, and whether it maps 1:1 onto the ladder or crosses it. It may be finer-grained (an approved-not-registered state distinct from a requested state) or coarser.
- **What the "unregistered workflow" rows actually represent** — Michael flagged it as *"tells the story of unregistering too, to be determined."* Treat that phrase as the open question it is: unregistered may mean never-registered, dropped-before-census, or an in-flight registrar process. **These are three different facts and only the export can separate them.**
- Whether one student appears MULTIPLE times per course (a request, then a registration) — which would make row count ≠ student count.

🔴 **On the first real export: read it, state the mapping you derived, and get Michael's ruling BEFORE writing status at volume.** Then record the settled mapping in a **Decision Log**, not in this file — semantics of a registrar's vocabulary is a decision with a why, and it belongs where decisions live. Update this ladder only if the RULE changes.

#### What a cold export carries — and what it can never carry

| Expect it to CARRY | Expect it to be SILENT on |
| --- | --- |
| legal name, Student ID, the course + section, registration status, major/minor, term | the name a student actually goes by |
| every enrolled student, not just the ones who emailed | WHY anyone is in a given state |
| rows for courses outside this pass's scope (a THTR-wide pull covers the department) | anyone who never entered the pipeline — 🔴 **the export cannot see the student who only emailed** |
| a snapshot timestamp | whether a missing person dropped or was never there |

⚠️ **A long export is not a complete picture.** The people this hook found by reading email are exactly the people an export structurally omits. **Never treat an export as the full roster of humans** — it is the full roster of *registrar records*.

#### The two buckets that ONLY a full export can fire

- **UPDATE** — the first pass wrote nearly everything at the low end of the ladder because email is all it had. A registrar export is the first evidence that can legitimately advance a row. Expect **UPDATE to be the bulk of a first cold export**, and it is a real write on existing rows, so name whose status changes before touching anything.
- **WITHDRAWN?** — comparing a full export against existing rows makes absence visible for the first time. 🔴 **Absence is a FLAG, never a write.** An export's silence has at least four innocent explanations (never registered, out of the export's scope, name/key mismatch, export truncation) before it means anyone dropped.

⚠️ **Reconcile the counts and state the denominator.** Rows in the export, students in the export, rows already in Enrollments, and the per-bucket totals must all account for each other. A gap means a filter lied — usually the closed/subtask default, which excludes both unless told otherwise.

⚠️ **A cold export is a SNAPSHOT and goes stale the moment registration moves.** Always state its export timestamp in the report; a first-week export ages in days, not weeks (the DDR family learned this the hard way — one of theirs was superseded in 18 hours).

### 1a. 🎓 Resolve the course (canonical source + ladder)

Every enrollment needs a course, and the source often will not state it cleanly. **The canonical source is two lists, read LIVE:**

- **COURSE x SEMESTER** (`901328228189`) = what is actually OFFERED this term (`{THTR###}{F26}` rows). This is the set an enrollment can point at — if a course is not here, it is not running this term.
- **Course List** (`901305646914`) = the catalog: code → full title, and whether it is active or cancelled. Use it to turn "lighting" into a code and to confirm the course actually runs.

**Resolution ladder — stop at the first rung that lands:**

1. **Explicit code in the body.** Workday emails literally say `THTR 120-01 - Production Experience` → map straight to the `{THTR120}{F26}` row. Section suffix (`-01`) is noted, not a separate course.
2. **Infer from context against the live catalog.** No code stated → resolve from what the body DOES say, tested against COURSE x SEMESTER + Course List: subject matter (a student writing about **lighting** → the F26 intro lighting course; **sound** → the F26 intro sound course), the meeting time/place Michael named, who referred them, the prior thread in the chain. **State the candidate AND the reason** ("course inferred: the intro lighting course, the student's whole email is about lighting"). ⚠️ **Two live lighting courses can be offered in one term** (an intro lecture and a design course) — subject matter alone does not separate them, so an intro-vs-advanced read that you cannot ground is a CONFLICT, not a pick.
3. **Genuinely ambiguous / no F26 match** → `⚠️ couldn't resolve the course`, surface it, ask Michael. **Never guess a student into a real class.** A wrong course is a wrong enrollment.

🔴 **Read the code→title map LIVE from Course List every run.** An earlier version of this file hardcoded two course numbers here and transposed them on its first run; the pair was struck rather than corrected, because a hardcoded catalog line is wrong the next time the catalog moves. **The catalog is the truth; this file names no course numbers.**

⚠️ **A `cancelled` catalog row with live enrollments is a CONFLICT, not a cull.** Observed 2026-08-31: two courses read `cancelled` in Course List while carrying live F26 enrollment rows between them. Flag it for Michael; never resolve it by deleting enrollments or by trusting either surface alone. 🔴 A cold export naming a course the catalog calls cancelled is the same conflict arriving from the other direction — same rule, still not a cull.

### 2. Analyze + plan (NO WRITES)

Go to the two lists and diff. For every incoming person, run the **two-level lookup**:

1. **Does the Person exist?** Search STUDENTS on email, confirm on Student ID.
2. **Does an Enrollment exist for this Person × this course × this term?** Search Enrollments.

The cross product is the bucket set. 🔴 **When the student is already found, the answer is a DIFF, never a blind skip:**

| Bucket | Condition | Action on greenlight |
| --- | --- | --- |
| **NEW** | no Person match | create Person + Enrollment |
| **MATCH** | Person + Enrollment exist, data identical | no-op |
| **UPDATE** | Person + Enrollment exist, but status differs | advance GRADING Status per the 1b ladder (the join staying live) |
| **CROSS-SEM** | Person exists (prior term OR another course), no Enrollment for THIS course+term | add Enrollment only — do NOT touch the Person |
| **WITHDRAWN?** | in Enrollments this term, ABSENT from this export | 🚩 FLAG only, never auto-write — an export is not proof of a drop |
| **CONFLICT** | email ↔ Student ID disagree, OR course unresolved | 🚩 hold for Michael |

> First day of classes / a fresh pull: expect the bulk to be **MATCH** and **UPDATE**, not NEW — most Persons already exist from a prior backfill. UPDATE is a real write; show whose status is changing before greenlight.

⚠️ **These bucket names are INTERNAL.** They are how you decide; they are not how you report. The report vocabulary is `PRESENT` / `ADD` / `MAKE` / `HELD` per the report spec.

**The plan is the reviewable artifact Michael greenlights against.** It shows counts per bucket and the per-row detail, and states plainly: nothing is written yet.

### 3. Write (on greenlight)

Greenlight granularity depends on batch size (see Documentation). On approval, per row:

1. Find or create the **Person** in STUDENTS (`Legal First Name`, `Last Name`, `Primary Email`; the preferred-name field when the student signs differently; `Student ID` / `Graduation Year` / `Major` when the export carries them — blank on a thin drop, flagged for Workday pull).
2. Create the **Enrollment** row; link `Student` → the Person and `Enrollment` → the resolved COURSE x SEMESTER row (step 1a).
3. Set **GRADING Status** per the **1b ladder**, and **UPDATE it as it goes** as evidence arrives.
4. Read the exact field/status names LIVE from the list; never from this file.

🔴 **Leave unknowns EMPTY.** A plausible guess in a data field is worse than a blank — the blank is honest, the guess is indistinguishable from a fact (batch-import's founding scar). Never invent a Student ID, grad year, major, registration status, or course.

**Graduated trust:** greenlight EVERY run for now. Once matching proves reliable on real batches, it earns silent writes on the unambiguous buckets (NEW / MATCH / UPDATE / CROSS-SEM) and only surfaces WITHDRAWN? and CONFLICT. Start at the gate; earn the autonomy (gcal-reconcile / INBOX-triage precedent).

### 3.5. 🔗 LINK OUTWARD — a REQUIRED WRITE, not a sentence in the description

**Every Enrollment row gets a real task relationship to the email chain(s) that produced it.** A provenance line in the description is a citation, not a join: it is unsearchable, unwalkable, and invisible from the other end.

- **One relationship per source chain, MANY-TO-ONE where a student has several.** A single enrollment commonly has two or three chains behind it (the Workday notification, the student's own email, a follow-up). Attach them all to the one row — that IS the consolidation, and it works precisely because it keys on the join rather than on a subject-line filter.
- **Prose provenance stays** (source + confidence tier + which session), but it is the human note. **The link is the mechanism.**
- **The linked COURSE x SEMESTER row becomes the passive collation point** — one place showing the whole class, its people, and every conversation behind it, permanently, with no filter to maintain. That is the answer to *"can these related emails collate on their own"*: no automation exists, and none is needed once the join is real.
- ⚠️ **On a batch/export row there may be NO email chain to link** — an export row is its own provenance. Link it to the **Import Session** task instead; every row still walks back to a source.
- 🔴 **This step is what makes closing the intake chains safe** (below). Close before linking and you file the trail away with nothing pointing at it.

> 🩹 Born of the first live run: 8 enrollment rows shipped citing their chains in **prose only**. The join was one-directional and text-based — you could not walk from a course to its emails, nor from a row back to the email that made it. Michael caught it by asking whether the related emails collate passively. **A join that only a human can follow is not a join.**

### 3.6. Closing the source chains (Michael's ruling, 2026-08-31)

**CLOSE IF LINKED.** Once a chain's outward link exists and its work is tracked elsewhere, flip it to the intake list's dormant status and stamp it processed. Dormant is not deleted: a chain reopens the moment a reply lands, and chain-canonical only bars **moving** a chain out of the list, never closing it.

- 🔴 **The link is the precondition, not the triage stamp.** A stamped-but-unlinked chain is not closable — the stamp says a pass happened, the link says the work has a home.
- **No link generated → stays open.** A `drop` signal or an unresolved item has no enrollment row, so nothing links, so it stays visible.
- ⚠️ **STATE THE CONSEQUENCE when you close a batch:** the queue MOVES. Approvals that were legible as unread email are now legible only as `GRADING Status` on the roster. Say so in the receipt, or the human loses a queue without being told.
- Michael's words when he overruled a proposal to hold them open: *"not enough reason to hold them open. close the emails if the link has been generated."*

### 4. Report — load the report spec

🔴 **`hooks/roster-reconcile.report-spec.md` carries all three report forms. Load it before reporting; never invent report structure and never restate the format here.** One claimant, so the format cannot drift.

- **Report 2 — write receipt:** counts block + a table of every row written, with GRADING values explained in this workspace's terms, and an explicit statement of what you did NOT write. **Count the links and the closes too** — they are writes.
- **Report 3 — per-course before/after (⭐ Michael asked for this one by name):** for EVERY course the pass touched — previously enrolled count, added (linked enrollment rows), currently enrolled count — then a totals line and a one-or-two-line reading. **Recount from the live rows; never `previous + added` arithmetic**, which hides a row that failed to write. Untouched courses never appear.
- 📦 **On a cold export, also report the export's own timestamp, its row count vs student count, and the UNVERIFIED status-mapping question** until Michael has ruled on it.

### 5. Document (three surfaces, and the path depends on batch size)

**Person stays CLEAN.** The permanent human record gets no per-run stamp; its history is reconstructable by walking its Enrollment rows back to their sessions — and, since 3.5, back to the actual emails.

| Surface | What lands |
| --- | --- |
| **Enrollment row** | provenance stamp (source + confidence tier + session) **AND the outward links** |
| **Import Session** (batch only) | attached raw source + the greenlighted plan + conflict log + write receipt |
| **Person** | nothing per-run — clean |

**Two documentation paths, decided by batch size:**

- 🔹 **Single student** (one permission email / inbox triage task): everything stays LOCAL to that task. The greenlight is a COMMENT there, the write happens, the provenance line goes on the Person's description. **No Import Session task** — that is ceremony for one row.
- 🔸 **Batch / full class export:** spin up an **Import Session task** in Report Imports with the plan, the attached source, and the final report. One task per run; it is the permanent "what came in and when." The roster data flows OUT of it into STUDENTS + Enrollments, and every written row stamps back to it.

> Report Imports is the **import SOURCE / staging list**, not the roster. Source records live there; clean relational data lives in STUDENTS + Enrollments. You can always walk an Enrollment row back to the Import Session that made it.

---

## Guardrails

- 🔒 **NEVER put a student in this file.** No name, email, URID, Student ID, major or schedule — not in a step, an example, or a changelog. De-identify by SHAPE and point at the INBOX chain. `ClickUp_apps` is PUBLIC and history outlives a scrub. A full export is the highest-risk artifact here: attach it, never commit or paste it. Full rule: the PII RULE at the top.
- 🔴 **OPEN THE SOURCE IN FULL — never classify off a title,** and **never scope a batch by a title filter.** Scope by the candidate set. A title filter dropped a third of the chains, twice, in one session.
- 📦 **The VALUE LIST is schema (read live); the DECISION RULE is procedure (step 1b).** Never enumerate options here, never re-infer the ladder there.
- 📦 **An export is the full roster of REGISTRAR RECORDS, not of humans.** It structurally cannot see the student who only emailed. Never treat it as complete.
- 🔗 **LINK OUTWARD is a required write.** Prose provenance is not a join. Export rows with no email chain link to the Import Session instead.
- 🔴 **Close only if linked.** No link generated → the chain stays open. And when a batch closes, STATE that the queue moved.
- 🔴 **Resolve the course against the LIVE catalog.** Explicit code → infer-with-reason → flag-and-ask. **This file names no course numbers.**
- 🔴 **Read the Enrollments field/status set LIVE from the list every run.**
- 🔴 **Report format comes from `roster-reconcile.report-spec.md`.** Report in PRESENT/ADD/MAKE/HELD; recount from the rows; state the export timestamp and the denominator.
- 🔴 **Never write in the analyze pass.** Plan first, greenlight second, write third.
- 🔴 **Leave unknowns EMPTY.** Never invent a Student ID, registration status, grad year, major, or course.
- 🔴 **WITHDRAWN? and CONFLICT are FLAG-only** until Michael rules. An export's silence is not proof of a drop; disagreeing keys are not an auto-pick; an unresolved course is a CONFLICT. A `cancelled` course with live enrollments is a CONFLICT from either direction.
- 🔴 **Attendance is not registration; approval is not enrollment.** Never advance a status off an adjacent fact.
- 🔴 **A conflict-resolution form is an ADD, not a duplicate.** Check which of its two courses the student already holds.
- 🔴 **Person stays clean** — no per-run stamp on the human record.
- **Single student → local comment.** Batch → Import Session in Report Imports.
- **Graduated trust:** greenlight every run now; silent writes are earned, not assumed.
- Email is identity; Student ID confirms. A name-string difference with agreeing keys is normalized, not flagged.

---

## Composes with

- `hooks/roster-reconcile.report-spec.md` — the display format for all three reports. Load before reporting. Shared with the prep hook; one claimant so it cannot drift.
- `hooks/roster-reconcile-prep.md` — Milo's upstream hook (**v3**): sweeps the messy Default Inbox into a clean candidate report fed INTO this tool. Two verbs, clean seam — do not merge. 📦 Its output and a cold export are COMPLEMENTARY, not redundant: prep finds the people the registrar cannot see, the export finds the people email never mentioned.
- `EMAIL-TRIAGE` skill — the inbox front door a single-student reconcile often starts from; its chain-canonical model is why chains are LINKED and never moved.
- `hooks/batch-import.md` — the closest sibling for the EXPORT path (propose-then-press over a bulk file, different domain). Its scars apply directly: leave unknowns empty; a discrepancy you can explain is not one you have resolved; a silent conflict-update re-writes stale data with a clean-looking run.
- `hooks/commit-pre-flight.md` / `secrets-pii-guard.md` — ⚠️ student data is FERPA-sensitive. **This file violated that on day one; see the PII RULE at the top.**
- `hooks/task-dedup-gate.md` — before creating any Person or Enrollment row.
- ~~`hooks/reconcile-engine.md` — unresolved seam, possible fifth manifest~~ **STRUCK 2026-08-31 by Michael the same day it was raised: "that's a different reconcile project."** Roster reconcile is NOT an engine manifest candidate and its absence from that family list is correct, not an omission. The structural reason it does not fit, recorded so nobody re-opens this: the engine COMPARES existing surfaces and proposes; this hook CREATES relational records from an intake source. Different verb.

---

## Changelog

- **v6 (2026-08-31)** — 📦 **Added Step 1b: reading a COLD full export + the GRADING Status DECISION RULE**, on Michael's instruction (*"so you don't have to infer"*) ahead of the first full Workday THTR export. Resolves a real contradiction in this file rather than papering over it: the **VALUE LIST is schema** and stays on the list read-live, the **DECISION RULE is procedure** and belongs here, because a rule does not rot when a field is added. Carries the six-rung evidence→value ladder, what an export carries vs is silent on, the two buckets only an export can fire (UPDATE at volume, WITHDRAWN? for the first time), and an explicit **UNVERIFIED** block — no export has been read yet, the registrar's own vocabulary is unknown, and Michael's *"unregistered ... to be determined"* is preserved as the open question it is, to be settled in a Decision Log rather than guessed. Also: `attendance is not registration, approval is not enrollment`, export rows link to the Import Session when no email chain exists, and the export-is-a-snapshot timestamp rule. **Struck the `reconcile-engine.md` seam flag** — Michael ruled it a different project; the structural reason is recorded so it is not re-opened.
- **v5 (2026-08-31)** — 🔗 **LINK OUTWARD promoted to a required write step (3.5)** after the first live run shipped 8 enrollment rows whose source chains were cited in the DESCRIPTION only. Michael caught it by asking whether the related emails collate passively. Added many-to-one chain linking, the course row as the passive collation point, **step 3.6 CLOSE IF LINKED** with his ruling verbatim, and a hard **no-title-filter-as-scope** guardrail (that failure fired TWICE in one session).
- **v4 (2026-08-31)** — Report formats EXTRACTED to `roster-reconcile.report-spec.md`, which also carries the per-course before/after report Michael specified by name. Step 4 became a report step pointing at the spec. Also: the conflict-form ADD case, the internal-buckets-are-not-report-vocabulary note, and the preferred-name field in the write step.
- **v3 (2026-08-31)** — 🔒 **FERPA SCRUB.** v1/v2 shipped with two real student names in a PUBLIC repo, against this file's own FERPA line (Michael: *"never put specifics like student names in the hook"*). All examples de-identified by shape; **new PII RULE section at the TOP**, because the guardrail that failed was written at the bottom where an author never reads it. Also struck the hardcoded course-number pair (already transposed once), added the two-live-lighting-courses ambiguity and the cancelled-row-with-live-enrollments conflict. ⚠️ HEAD is clean; originals persist in history at the PR #877 commit.
- **v2 (2026-08-31)** — First live run exposed two gaps. (1) **Step 0: OPEN THE SOURCE IN FULL** — the sweep had classified off titles and missed the reconcile key, a name split, and a not-yet-filed request. (2) **Step 1a: Resolve the course** against the live catalog with an explicit-→infer-→flag ladder. Fixed a course-number transposition. CROSS-SEM widened to another-course.
- **v1 (2026-08-31)** — Established by Brain, specced live with Michael on the first day of F26 classes. Scale-invariant intake, two-level lookup, six buckets with UPDATE as the join-staying-live case, greenlight gate with graduated trust, single-vs-batch documentation split. Person record stays clean.
