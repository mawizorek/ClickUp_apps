# Roster Reconcile Prep · AI Toolkit

**Purpose:** Sweep the Default Inbox for enrollment-bearing threads (permission-to-join requests, professor class lists, add/drop notices) and produce ONE clean report of roster-reconcile CANDIDATES — who, which course, what signal — that feeds INTO `hooks/roster-reconcile.md`. This hook does the domain-messy READING; the reconcile hook does the mechanical join. Two verbs, one seam — do NOT merge them.

**Steward:** Mainstage Milo (owns the inbox-reading seam). The TOOL is ownerless for one-off runs (Doc-Rot-Sweep precedent, any agent fires it). A formal, scoped, reported full-inbox pass IS an audit and seizes to Audit Anna.

**Mode:** On-demand routine, **PROPOSE-ONLY**. Reads email, writes nothing to STUDENTS/Enrollments and cuts no reconcile tasks until Michael greenlights.

**Invocation:** `roster reconcile prep` · `/roster-reconcile-prep` · "parse the inbox for roster reconcile students" · "collect the roster reconcile tasks from my inbox" · "prep the inbox for roster reconcile" · "prepare a roster reconcile handoff."

**Trigger:** Michael points at the current Default Inbox and wants enrollment-bearing threads collected before running the reconcile. Also fires when a batch of permission/class-list emails has landed and he wants them swept into one queue.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-08-31** by Brain, built out from its own stub the same day (Michael: *"arm it and make it a thing"*). Floated alongside `roster-reconcile.md` and deliberately kept separate (the prepare-vs-execute split).

---

## 🔒 PII RULE — READ BEFORE YOU EDIT THIS FILE, AND BEFORE YOU REPORT

**Never write a student's name, email, URID, Student ID, major or schedule into this file, or any file in any repo.** Not in a procedure step, not in an example, not in a changelog, not as the real case that proves a rule.

- `ClickUp_apps` is **PUBLIC**, and git history keeps a name after HEAD is scrubbed.
- **De-identify by SHAPE.** "A from-line whose legal first name differs from the signature" is the entire lesson; the student's actual name teaches a cold agent nothing.
- This is the hook that READS student mail, which makes it the likeliest place a real name gets pasted in as evidence. It is clean today. Keep it that way.
- Sibling rule in `hooks/roster-reconcile.md` → PII RULE, added after that file shipped with two real students named in it.

🔴 **The RUN OUTPUT obeys the same rule, and it is easier to break.** The candidate report lives on a workspace task or comment ONLY. It never goes to the repo, an artifact, or a **chat channel** — including the Agent Activity Board. A spine line naming five students was written to that channel on 2026-08-31 and scrubbed the same day: the report was correctly workspace-only, and the SUMMARY of it leaked. Summarize by count and course, never by name.

---

## Coordinates

| Surface | Location |
| --- | --- |
| **Inbox swept** | URITP ▸ INBOX ▸ Default — the permanent one-task-per-chain replica of Michael's Outlook |
| **Report home** | a comment on the invoking session/task (or the Import Session task if one is already open) |
| **Report FORMAT** | `hooks/roster-reconcile.report-spec.md` — load before reporting |
| **Feeds** | `hooks/roster-reconcile.md` step 1 (its structured intake) |
| **Operator method** | the `EMAIL-TRIAGE` skill (how the Default Inbox is read) |

---

## The seam (say it once)

**PREP collects and classifies; RECONCILE reconciles and writes.** Prep never touches STUDENTS or Enrollments, never sets a GRADING Status, never creates a Person. Its entire output is a REPORT: here are the enrollment-bearing threads I found, here's who and what course each points at, here's the signal (requesting vs enrolled vs dropped), here's my confidence. Michael reads it, picks which candidates to run, and the reconcile hook does the actual work one candidate at a time (single-student path) or as a batch.

> 🔴 A candidate is a LEAD, not a record. Prep proposing "a student → the intro sound course, permission request" does NOT mean that person exists in STUDENTS, is enrolled, or should be written. It means: a thread mentions them and a course. Reconcile decides the rest.

---

## Procedure

### 1. Scope the sweep

Name what you are reading before you read it: the Default Inbox, current open chains (closed/archived chains out of scope unless Michael says otherwise). Say how many threads are in scope. An unbounded "read everything" produces a shallow pass — bound it.

🔴 **Scope the WHOLE open inbox, not just today's captures.** A sweep scoped to fresh arrivals structurally cannot see the enrollment thread that has been sitting for four weeks, and the oldest thread is usually the most urgent one (a graduation-credit or registration-blocked ask does not re-announce itself). Proven 2026-08-31: a pass scoped to same-day captures missed the highest-stakes candidate in the list — a student who could not register in Workday and needed a course to graduate.

⚠️ **Closed chains are out of scope by default and that has a known cost — SAY SO rather than staying silent.** A `library`/filed chain can carry live current-term enrollment content (a lab conflict still being solved, a course still being negotiated). Report closed chains as an unread SCOPE EDGE at the end of the run and offer to include them; never quietly leave the edge invisible.

### 2. Classify each thread (enrollment-bearing or not)

For every thread, one fast read: does it carry a student + a course signal? Keep only threads that do. Species that qualify:

| Thread type | Carries | Signal |
| --- | --- | --- |
| **Permission-to-join** | one student asking into a class | `requesting` (not yet registered) |
| **Professor class list** | many students, one course | `roster` (professor's own list) |
| **Add/drop / withdrawal notice** | a student leaving or joining | `add` / `drop` |
| **Registrar / Workday forward** | structured enrollment data | route to a full export path, not this |
| **Degree-audit / graduation-credit thread** | one student, several courses, a requirement gap | `requesting` — treat as enrollment-bearing; these carry the course the student MUST get into |
| **Time-conflict resolution form** | one student, TWO courses, a signed form | `add` — the form clears an overlap so a SECOND course can be added; the first course is usually already enrolled |

Everything else (general email, production talk, non-enrollment) is dropped from the candidate set and NOT reported — a candidate list padded with noise is worse than a short honest one.

⚠️ **A conflict form is an ADD, not a duplicate.** Read which course is already held and which is being added; proposing a row for the course the student is already in is the failure this line exists to stop.

### 3. Extract per candidate (transcribe, do not infer)

For each enrollment-bearing thread, pull what the thread actually says:

- **Name** (as written), **email**, **pronouns** if present
- **Course** — named in the thread, or inferred from context; mark which. 🔴 If you inferred the course rather than read it, SAY SO per candidate — never present an inferred course as stated.
- **Signal** — requesting / roster / add / drop
- **Source** — the thread/task link, so reconcile (and Michael) can walk back to it
- **Confidence** — grounded (read it) vs inferred (guessed it)

🔴 **Leave unknowns EMPTY.** No email in the thread means no email — not a guessed address. Reconcile will flag the gap; a plausible guess hides it.

### 4. Emit ONE clean report (no writes)

🔴 **Load `hooks/roster-reconcile.report-spec.md` and emit Report 1 from it.** This hook does NOT carry the format — one claimant, so it cannot drift. Short version of what that spec requires: a four-column table (Email · Student · Course X Semester · State), states reported as `PRESENT` / `ADD` / `MAKE` / `HELD`, every reference a link, held rows kept IN the table with the reason inline, name splits on their own line beneath.

⚠️ **Not prose.** Michael's words, 2026-08-31: *"not prose. a REPORT."* A grouped prose block buries the state column, which is the only part he acts on. This IS the structured input `roster-reconcile.md` step 1 expects. **Workspace surface only** (see the PII RULE).

### 5. Hand off

Michael picks which candidates to reconcile. Each chosen one is then run through `hooks/roster-reconcile.md` — a single student stays local (comment greenlight on its inbox task), a full class becomes an Import Session. Prep's job ends at the report; it never runs the reconcile itself.

---

## Guardrails

- 🔒 **NEVER put a student in this file** — no name, email, URID, Student ID, major or schedule, in any step, example or changelog. De-identify by shape. Full rule: the PII RULE at the top.
- 🔴 **The report is workspace-only, and so is every summary of it.** Never the repo, an artifact, or a chat channel — the Agent Activity Board included. Summarize by count and course, never by name.
- 🔴 **Report format comes from `roster-reconcile.report-spec.md`.** Load it; never invent report structure and never restate the format here.
- 🔴 **PROPOSE-ONLY.** Reads email; writes nothing to STUDENTS/Enrollments; cuts no tasks. The report is the entire deliverable.
- 🔴 **A candidate is a lead, not a record.** Prep never asserts a student exists, is enrolled, or should be written — reconcile decides that.
- 🔴 **Sweep the whole open inbox, not just recent captures**, and declare the closed-chain scope edge.
- 🔴 **Transcribe, do not infer.** Inferred course = marked inferred. Missing email = empty, never guessed.
- 🔴 **Drop the noise.** Non-enrollment threads never enter the candidate list.
- Unresolvable course → `⚠️ couldn't resolve`, surfaced for Michael to name; never guessed into a real class.

---

## Composes with

- `hooks/roster-reconcile.md` — the executor this feeds. Prep prepares structured input; reconcile reconciles and writes. Two verbs, one seam. Its PII RULE is the sibling of the one above.
- `hooks/roster-reconcile.report-spec.md` — the display format for Report 1 (and the reconcile hook's Reports 2 and 3). Shared file, one claimant.
- `EMAIL-TRIAGE` skill — the Default Inbox operator method (how chains are read; INBOX ▸ Default is a permanent replica, nothing leaves).
- `hooks/meeting-scratch-triage.md` — sibling propose-only inbox-style sweep (that resolves shorthand; this resolves enrollment leads).
- `hooks/secrets-pii-guard.md` — the repo-write guard this file's PII RULE localizes.

---

## Changelog

- **v3 (2026-08-31)** — Report format EXTRACTED to `roster-reconcile.report-spec.md` after Michael rejected the grouped prose block live (*"not prose. a REPORT"*) and specified a four-column table with an ADD/MAKE/PRESENT state column. Step 4 now points instead of restating (points-never-copies, same law as reading the Enrollments field set live). Also added: time-conflict resolution forms as an enrollment-bearing species with the not-a-duplicate warning (a form clears an overlap to ADD a second course, and the first course is usually already enrolled — caught live), and the closed-chain SCOPE EDGE must now be declared rather than left silent (a filed chain was carrying live current-term lab-conflict content).
- **v2 (2026-08-31)** — 🔒 Added the **PII RULE at the top** (mirror of the one added to `roster-reconcile.md` after that file shipped with real student names in a PUBLIC repo) plus a hard guardrail line; the correction generalizes and this is the hook that reads student mail. Made the report-surface rule explicit about **chat channels**, after a spine line naming five students went to the Agent Activity Board and was scrubbed the same day. Also folded in two first-run findings: **scope the whole open inbox, not just today's captures** (a same-day-only sweep missed a registration-blocked graduation candidate sitting four weeks), and degree-audit/graduation-credit threads added as an enrollment-bearing species.
- **v1 (2026-08-31)** — Built out from the v0 stub the same day (Michael: "arm it and make it a thing"). Real procedure: scope → classify enrollment-bearing threads → extract per candidate (transcribe, don't infer) → emit one clean grouped report → hand off. PROPOSE-ONLY, FERPA-guarded, feeds `roster-reconcile.md`. Armed with an AI Toolkit index trigger row.
- **v0 (2026-08-31)** — Stub created by Brain. Seam documented; build deferred — lifted same day on Michael's call to run it against the live inbox.
