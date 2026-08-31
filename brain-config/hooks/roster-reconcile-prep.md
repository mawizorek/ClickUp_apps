# Roster Reconcile Prep · AI Toolkit

**Purpose:** Sweep the Default Inbox for enrollment-bearing threads (permission-to-join requests, professor class lists, add/drop notices) and produce ONE clean report of roster-reconcile CANDIDATES — who, which course, what signal — that feeds INTO `hooks/roster-reconcile.md`. This hook does the domain-messy READING; the reconcile hook does the mechanical join. Two verbs, one seam — do NOT merge them.

**Steward:** Mainstage Milo (owns the inbox-reading seam). The TOOL is ownerless for one-off runs (Doc-Rot-Sweep precedent, any agent fires it). A formal, scoped, reported full-inbox pass IS an audit and seizes to Audit Anna.

**Mode:** On-demand routine, **PROPOSE-ONLY**. Reads email, writes nothing to STUDENTS/Enrollments and cuts no reconcile tasks until Michael greenlights.

**Invocation:** `roster reconcile prep` · `/roster-reconcile-prep` · "parse the inbox for roster reconcile students" · "collect the roster reconcile tasks from my inbox" · "prep the inbox for roster reconcile" · "prepare a roster reconcile handoff."

**Trigger:** Michael points at the current Default Inbox and wants enrollment-bearing threads collected before running the reconcile. Also fires when a batch of permission/class-list emails has landed and he wants them swept into one queue.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-08-31** by Brain, built out from its own stub the same day (Michael: *"arm it and make it a thing"*). Floated alongside `roster-reconcile.md` and deliberately kept separate (the prepare-vs-execute split).

---

## Coordinates

| Surface | Location |
| --- | --- |
| **Inbox swept** | URITP ▸ INBOX ▸ Default — the permanent one-task-per-chain replica of Michael's Outlook |
| **Report home** | a comment on the invoking session/task (or the Import Session task if one is already open) |
| **Feeds** | `hooks/roster-reconcile.md` step 1 (its structured intake) |
| **Operator method** | the `EMAIL-TRIAGE` skill (how the Default Inbox is read) |

---

## The seam (say it once)

**PREP collects and classifies; RECONCILE reconciles and writes.** Prep never touches STUDENTS or Enrollments, never sets a GRADING Status, never creates a Person. Its entire output is a REPORT: here are the enrollment-bearing threads I found, here's who and what course each points at, here's the signal (requesting vs enrolled vs dropped), here's my confidence. Michael reads it, picks which candidates to run, and the reconcile hook does the actual work one candidate at a time (single-student path) or as a batch.

> 🔴 A candidate is a LEAD, not a record. Prep proposing "Jane Doe → Intro to Sound, permission request" does NOT mean Jane exists, is enrolled, or should be written. It means: a thread mentions her and a course. Reconcile decides the rest.

---

## Procedure

### 1. Scope the sweep

Name what you are reading before you read it: the Default Inbox, current open chains (closed/archived chains out of scope unless Michael says otherwise). Say how many threads are in scope. An unbounded "read everything" produces a shallow pass — bound it.

### 2. Classify each thread (enrollment-bearing or not)

For every thread, one fast read: does it carry a student + a course signal? Keep only threads that do. Species that qualify:

| Thread type | Carries | Signal |
| --- | --- | --- |
| **Permission-to-join** | one student asking into a class | `requesting` (not yet registered) |
| **Professor class list** | many students, one course | `roster` (professor's own list) |
| **Add/drop / withdrawal notice** | a student leaving or joining | `add` / `drop` |
| **Registrar / Workday forward** | structured enrollment data | route to a full export path, not this |

Everything else (general email, production talk, non-enrollment) is dropped from the candidate set and NOT reported — a candidate list padded with noise is worse than a short honest one.

### 3. Extract per candidate (transcribe, do not infer)

For each enrollment-bearing thread, pull what the thread actually says:

- **Name** (as written), **email**, **pronouns** if present
- **Course** — named in the thread, or inferred from context; mark which. 🔴 If you inferred the course rather than read it, SAY SO per candidate — never present an inferred course as stated.
- **Signal** — requesting / roster / add / drop
- **Source** — the thread/task link, so reconcile (and Michael) can walk back to it
- **Confidence** — grounded (read it) vs inferred (guessed it)

🔴 **Leave unknowns EMPTY.** No email in the thread means no email — not a guessed address. Reconcile will flag the gap; a plausible guess hides it.

### 4. Emit ONE clean report (no writes)

One consolidated block, grouped by course, each candidate one line. This IS the structured input `roster-reconcile.md` step 1 expects. It proposes NOTHING to the roster — it hands Michael a queue to pick from.

```
📬 ROSTER RECONCILE PREP · Default Inbox · <date>
threads scanned: <n> · enrollment-bearing: <n> · candidates: <n>

── Intro to Sound (course inferred from prof name) ──
  • <Name> · <email> · requesting · [thread] · grounded
  • <Name> · (no email in thread) · requesting · [thread] · grounded
── THTR 120 (course stated) ──
  • <Name> · <email> · roster · [thread] · grounded
── ⚠️ couldn't resolve a course ──
  • <Name> · <email> · [thread] · needs Michael to name the class

next: pick candidates → run "roster reconcile" on each (single) or as a batch
```

### 5. Hand off

Michael picks which candidates to reconcile. Each chosen one is then run through `hooks/roster-reconcile.md` — a single student stays local (comment greenlight on its inbox task), a full class becomes an Import Session. Prep's job ends at the report; it never runs the reconcile itself.

---

## Guardrails

- 🔴 **PROPOSE-ONLY.** Reads email; writes nothing to STUDENTS/Enrollments; cuts no tasks. The report is the entire deliverable.
- 🔴 **A candidate is a lead, not a record.** Prep never asserts a student exists, is enrolled, or should be written — reconcile decides that.
- 🔴 **Transcribe, do not infer.** Inferred course = marked inferred. Missing email = empty, never guessed.
- 🔴 **Drop the noise.** Non-enrollment threads never enter the candidate list.
- ⚠️ **FERPA:** student data read from the inbox never leaves the workspace into the PUBLIC repo, an artifact, or a channel. The report lives on a workspace task/comment only.
- Unresolvable course → `⚠️ couldn't resolve`, surfaced for Michael to name; never guessed into a real class.

---

## Composes with

- `hooks/roster-reconcile.md` — the executor this feeds. Prep prepares structured input; reconcile reconciles and writes. Two verbs, one seam.
- `EMAIL-TRIAGE` skill — the Default Inbox operator method (how chains are read; INBOX ▸ Default is a permanent replica, nothing leaves).
- `hooks/meeting-scratch-triage.md` — sibling propose-only inbox-style sweep (that resolves shorthand; this resolves enrollment leads).

---

## Changelog

- **v1 (2026-08-31)** — Built out from the v0 stub the same day (Michael: "arm it and make it a thing"). Real procedure: scope → classify enrollment-bearing threads → extract per candidate (transcribe, don't infer) → emit one clean grouped report → hand off. PROPOSE-ONLY, FERPA-guarded, feeds `roster-reconcile.md`. Armed with an AI Toolkit index trigger row.
- **v0 (2026-08-31)** — Stub created by Brain. Seam documented; build deferred — lifted same day on Michael's call to run it against the live inbox.
