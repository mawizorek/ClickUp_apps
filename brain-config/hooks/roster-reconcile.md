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

### 1a. 🎓 Resolve the course (canonical source + ladder)

Every enrollment needs a course, and the source often will not state it cleanly. **The canonical source is two lists, read LIVE:**

- **COURSE x SEMESTER** (`901328228189`) = what is actually OFFERED this term (`{THTR###}{F26}` rows). This is the set an enrollment can point at — if a course is not here, it is not running this term.
- **Course List** (`901305646914`) = the catalog: code → full title, and whether it is active or cancelled. Use it to turn "lighting" into a code and to confirm the course actually runs.

**Resolution ladder — stop at the first rung that lands:**

1. **Explicit code in the body.** Workday emails literally say `THTR 120-01 - Production Experience` → map straight to the `{THTR120}{F26}` row. Section suffix (`-01`) is noted, not a separate course.
2. **Infer from context against the live catalog.** No code stated → resolve from what the body DOES say, tested against COURSE x SEMESTER + Course List: subject matter (a student writing about **lighting** → the F26 intro lighting course; **sound** → the F26 intro sound course), the meeting time/place Michael named, who referred them, the prior thread in the chain. **State the candidate AND the reason** ("course inferred: the intro lighting course, the student's whole email is about lighting"). ⚠️ **Two live lighting courses can be offered in one term** (an intro lecture and a design course) — subject matter alone does not separate them, so an intro-vs-advanced read that you cannot ground is a CONFLICT, not a pick.
3. **Genuinely ambiguous / no F26 match** → `⚠️ couldn't resolve the course`, surface it, ask Michael. **Never guess a student into a real class.** A wrong course is a wrong enrollment.

🔴 **Read the code→title map LIVE from Course List every run.** An earlier version of this file hardcoded two course numbers here and transposed them on its first run; the pair was struck rather than corrected, because a hardcoded catalog line is wrong the next time the catalog moves. **The catalog is the truth; this file names no course numbers.**

⚠️ **A `cancelled` catalog row with live enrollments is a CONFLICT, not a cull.** Observed 2026-08-31: two courses read `cancelled` in Course List while carrying live F26 enrollment rows between them. Flag it for Michael; never resolve it by deleting enrollments or by trusting either surface alone.

### 2. Analyze + plan (NO WRITES)

Go to the two lists and diff. For every incoming person, run the **two-level lookup**:

1. **Does the Person exist?** Search STUDENTS on email, confirm on Student ID.
2. **Does an Enrollment exist for this Person × this course × this term?** Search Enrollments.

The cross product is the bucket set. 🔴 **When the student is already found, the answer is a DIFF, never a blind skip:**

| Bucket | Condition | Action on greenlight |
| --- | --- | --- |
| **NEW** | no Person match | create Person + Enrollment |
| **MATCH** | Person + Enrollment exist, data identical | no-op |
| **UPDATE** | Person + Enrollment exist, but status differs (e.g. row `Unregistered`, export now registered) | flip GRADING Status (the join staying live) |
| **CROSS-SEM** | Person exists (prior term OR another course), no Enrollment for THIS course+term | add Enrollment only — do NOT touch the Person |
| **WITHDRAWN?** | in Enrollments this term, ABSENT from this export | 🚩 FLAG only, never auto-write — an export is not proof of a drop |
| **CONFLICT** | email ↔ Student ID disagree, OR course unresolved | 🚩 hold for Michael |

> First day of classes / a fresh pull: expect the bulk to be **MATCH** and **UPDATE** (Unregistered → Active), not NEW — most Persons already exist from a prior backfill. UPDATE is a real write; show whose status is changing before greenlight.

⚠️ **These bucket names are INTERNAL.** They are how you decide; they are not how you report. The report vocabulary is `PRESENT` / `ADD` / `MAKE` / `HELD` per the report spec.

**The plan is the reviewable artifact Michael greenlights against.** It shows counts per bucket and the per-row detail, and states plainly: nothing is written yet.

### 3. Write (on greenlight)

Greenlight granularity depends on batch size (see Documentation). On approval, per row:

1. Find or create the **Person** in STUDENTS (`Legal First Name`, `Last Name`, `Primary Email`; the preferred-name field when the student signs differently; `Student ID` / `Graduation Year` / `Major` when the export carries them — blank on a thin drop, flagged for Workday pull).
2. Create the **Enrollment** row; link `Student` → the Person and `Enrollment` → the resolved COURSE x SEMESTER row (step 1a).
3. Set **GRADING Status** from registration status, and **UPDATE it as it goes** (e.g. Active → Withdrawn when a prior row is confirmed dropped — only ever off explicit evidence, never off an export's silence). A permission request that is not yet approved is not `Active`; a student with no request on file is a further step back again.
4. Read the exact field/status names LIVE from the list; never from this file.

🔴 **Leave unknowns EMPTY.** A plausible guess in a data field is worse than a blank — the blank is honest, the guess is indistinguishable from a fact (batch-import's founding scar). Never invent a Student ID, grad year, major, registration status, or course.

**Graduated trust:** greenlight EVERY run for now. Once matching proves reliable on real batches, it earns silent writes on the unambiguous buckets (NEW / MATCH / UPDATE / CROSS-SEM) and only surfaces WITHDRAWN? and CONFLICT. Start at the gate; earn the autonomy (gcal-reconcile / INBOX-triage precedent).

### 3.5. 🔗 LINK OUTWARD — a REQUIRED WRITE, not a sentence in the description

**Every Enrollment row gets a real task relationship to the email chain(s) that produced it.** A provenance line in the description is a citation, not a join: it is unsearchable, unwalkable, and invisible from the other end.

- **One relationship per source chain, MANY-TO-ONE where a student has several.** A single enrollment commonly has two or three chains behind it (the Workday notification, the student's own email, a follow-up). Attach them all to the one row — that IS the consolidation, and it works precisely because it keys on the join rather than on a subject-line filter.
- **Prose provenance stays** (source + confidence tier + which session), but it is the human note. **The link is the mechanism.**
- **The linked COURSE x SEMESTER row becomes the passive collation point** — one place showing the whole class, its people, and every conversation behind it, permanently, with no filter to maintain. That is the answer to *"can these related emails collate on their own"*: no automation exists, and none is needed once the join is real.
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

- 🔒 **NEVER put a student in this file.** No name, email, URID, Student ID, major or schedule — not in a step, an example, or a changelog. De-identify by SHAPE and point at the INBOX chain. `ClickUp_apps` is PUBLIC and history outlives a scrub. Full rule + the failure that produced it: the PII RULE section at the top.
- 🔴 **OPEN THE SOURCE IN FULL — never classify off a title,** and **never scope a batch by a title filter.** Scope by the candidate set. A title filter dropped a third of the chains, twice, in one session.
- 🔗 **LINK OUTWARD is a required write.** Prose provenance is not a join. Every enrollment row links every chain that produced it; the course row is the collation point that makes it worth doing.
- 🔴 **Close only if linked.** No link generated → the chain stays open. And when a batch closes, STATE that the queue moved.
- 🔴 **Resolve the course against the LIVE catalog** (COURSE x SEMESTER offered-this-term + Course List titles). Explicit code → infer-with-reason → flag-and-ask. Never guess a student into a real class. **This file names no course numbers.**
- 🔴 **Read the Enrollments field/status set LIVE from the list every run.** Never enumerate it in this file. The list is the schema truth.
- 🔴 **Report format comes from `roster-reconcile.report-spec.md`.** Load it; report in PRESENT/ADD/MAKE/HELD, never in the internal bucket names; recount current enrollment from the rows.
- 🔴 **Never write in the analyze pass.** Plan first, greenlight second, write third.
- 🔴 **Leave unknowns EMPTY.** Never invent a Student ID, registration status, grad year, major, or course.
- 🔴 **WITHDRAWN? and CONFLICT are FLAG-only** until Michael rules. An export's silence is not proof of a drop; disagreeing keys are not an auto-pick; an unresolved course is a CONFLICT, not a best guess. A `cancelled` catalog row with live enrollments is also a CONFLICT.
- 🔴 **A conflict-resolution form is an ADD, not a duplicate.** Check which of its two courses the student already holds before proposing anything.
- 🔴 **Person stays clean** — no per-run stamp on the human record.
- **Single student → local comment, no Import Session.** Batch → Import Session in Report Imports.
- **Graduated trust:** greenlight every run now; silent writes on unambiguous buckets are earned on proven reliability, not assumed.
- Email is identity; Student ID confirms. A name-string difference with agreeing keys is normalized, not flagged.

---

## Composes with

- `hooks/roster-reconcile.report-spec.md` — the display format for all three reports. Load before reporting. Shared with the prep hook; one claimant so it cannot drift.
- `hooks/roster-reconcile-prep.md` — Milo's upstream hook (**v3**): sweeps the messy Default Inbox into a clean candidate report fed INTO this tool. Two verbs, clean seam — do not merge.
- `EMAIL-TRIAGE` skill — the inbox front door a single-student reconcile often starts from; its chain-canonical model is why chains are LINKED and never moved.
- ⚠️ `hooks/reconcile-engine.md` — **UNRESOLVED SEAM, flagged 2026-08-31, deliberately not acted on in this pass.** An engine + manifest refactor of the reconcile family landed the same day and its family list reads *"ddr / doc-destroyer / gcal / contact"* — **this hook is not named in it at all**, despite being a reconcile born the same day. Either roster reconcile is a fifth manifest candidate or it is genuinely outside the family (it CREATES relational records rather than comparing surfaces, which is a real difference). **Somebody must rule; do not migrate on assumption, and do not let the omission stand unexamined.** Fold-in Frank + Michael.
- `hooks/commit-pre-flight.md` / `secrets-pii-guard.md` — ⚠️ student data is FERPA-sensitive; STUDENTS/Enrollments detail never leaves the workspace into the public repo, an artifact, or a channel. **This file violated that on day one; see the PII RULE at the top.**
- `hooks/task-dedup-gate.md` — before creating any Person or Enrollment row.
- `hooks/batch-import.md` — sibling shape (propose-then-press), different domain. Its scars apply: leave unknowns empty; a discrepancy you can explain is not one you have resolved.

---

## Changelog

- **v5 (2026-08-31)** — 🔗 **LINK OUTWARD promoted to a required write step (3.5)** after the first live run shipped 8 enrollment rows whose source chains were cited in the DESCRIPTION only. The join was text-only and one-directional; Michael caught it by asking whether the related emails collate passively. Added: many-to-one chain linking, the course row as the passive collation point, **step 3.6 CLOSE IF LINKED** with his ruling verbatim and the state-that-the-queue-moved rule, and a hard **no-title-filter-as-scope** guardrail (a title filter dropped a third of the chains TWICE in one session). Also flagged the unresolved `reconcile-engine.md` seam — that same-day refactor's family list omits this hook entirely.
- **v4 (2026-08-31)** — Report formats EXTRACTED to `roster-reconcile.report-spec.md`, which also carries the per-course before/after report Michael specified by name (previously enrolled / added / currently enrolled, recounted from the rows rather than added up). Step 4 became a report step pointing at the spec. Also folded in: the conflict-form ADD case in Step 0, the internal-buckets-are-not-report-vocabulary note, and the preferred-name field in the write step.
- **v3 (2026-08-31)** — 🔒 **FERPA SCRUB.** v1/v2 shipped with two real student names and a real legal-vs-preferred name split as Step 0 and changelog examples, in a PUBLIC repo, against this file's own FERPA line (Michael: *"never put specifics like student names in the hook"*). All examples de-identified by shape; **new PII RULE section at the TOP**, because the guardrail that failed was written at the bottom where an author never reads it before writing. Also: struck the hardcoded course-number pair (it had already transposed once), added the two-live-lighting-courses ambiguity as a CONFLICT case, added the `cancelled`-row-with-live-enrollments conflict, and fixed the stale stub pointer to the prep hook. ⚠️ HEAD is clean; the original values persist in git history at the PR #877 commit.
- **v2 (2026-08-31)** — First live run exposed two gaps, folded in the same day. (1) Added **Step 0: OPEN THE SOURCE IN FULL** — the sweep had classified off titles and missed the reconcile key, a legal-vs-preferred name split, and a not-yet-filed request. (2) Added **Step 1a: Resolve the course** — canonical source is COURSE x SEMESTER + Course List, read LIVE, with an explicit-→infer-with-reason-→flag ladder; an unresolved course is now a CONFLICT. Fixed a course-number transposition. CROSS-SEM widened to cover another-course.
- **v1 (2026-08-31)** — Established by Brain, specced live with Michael on the first day of F26 classes. Scale-invariant intake, two-level lookup, six buckets with UPDATE as the join-staying-live case, greenlight gate with graduated trust, single-vs-batch documentation split. Person record stays clean. Field/status set read live, never enumerated here.
