# Roster Reconcile — Roster Artifact Spec · AI Toolkit

**What this is:** the procedure for turning a registrar roster export into **per-course roster artifacts** attached to their COURSE x SEMESTER rows, and for **stamping the freshness field when you do**. Load this whenever a reconcile pass produces or refreshes a roster file.

**Applies to:** `hooks/roster-reconcile.md` — this is its artifact half. That hook RECONCILES records; this spec PUBLISHES the source document. Two verbs, one seam.

**Separate file on purpose** (`roster-reconcile.report-spec.md` precedent): one claimant per concern, so neither can drift into two versions of itself. ⚠️ Also a hard practical reason: `roster-reconcile.md` is **34KB**, past the ~22KB read-whole budget, and a file that cannot be read whole cannot be safely patched. Adding this inline would have made that worse. See Known gaps.

**Established 2026-09-07** by Tutor Tate, from the first full Workday THTR export (138 rows, 21 courses). **Steward:** Tutor Tate. The mechanical steps are ownerless (any agent fires them); a formal reported pass SEIZES to Audit Anna.

**Front door: `roster-reconcile.md` + this file.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

---

## 🔒 PII RULE

**Never write a student's name, email, URID, Student ID, major or schedule into this file, or any file in any repo.** De-identify by SHAPE. `ClickUp_apps` is PUBLIC and history outlives a scrub. Course codes and counts are fine; people are not.

🔴 **The ARTIFACTS themselves are the highest-risk objects this spec touches.** A per-course roster carries legal names, Student IDs, majors and photo filenames for a whole class.

- ✅ Workspace tasks ONLY.
- 🚫 NEVER the repo. NEVER a shipped artifact. NEVER a chat channel, the Agent Activity Board included.
- Channel summaries name **counts and course codes**, never students. Precedent: a spine line naming five students was written to that board and scrubbed the same day.

---

## The law: VERBATIM means add structure, never content

Same law as `hooks/verbatim-doc-import.md`, applied to data instead of prose. A split roster is a **reproduction of a source document**, not a report.

**Allowed:** splitting one file into many · one sheet per course, named for the course · frozen header row · column widths · the filename convention below.

🚫 **Forbidden:** renaming a column · reordering columns · reordering rows · dropping a column you judge irrelevant · recalculating anything · de-duplicating churn · collapsing a student's multiple rows · adding a computed column · adding a summary row · fixing a typo in the source.

🔴 **DO NOT DE-DUPLICATE. The row count is the registrar's HISTORY, not a headcount.** Proven on the founding export: one course showed twice as many rows as students because a single student cycled add/drop five times in four hours, and another doubled because its lecture and lab register as a PAIR under one action with identical millisecond timestamps. **Both are true records of what the registrar did.** A cleaned file silently destroys the only evidence of enrollment churn there is.

⚠️ **Therefore the row count is NOT a class size, and the report SAYS SO out loud.** A reader who assumes otherwise will over-count every multi-section and high-churn course. State it every time; it is not obvious and it looks like a bug.

---

## Split grain: by COURSE CODE, never by section

🔴 **One file per course code, because that is what ONE COURSE x SEMESTER row is.** A multi-section course keeps every section's rows inside its one file (the founding export had five such courses).

- Splitting by section would produce files with no row to live on, and would fragment a roster the teaching side reads as one class.
- The section suffix stays visible **inside** the data, where the source put it. It is never promoted to a file boundary.
- ⚠️ A course whose sections are genuinely different classes is a SCHEMA question for Corey, not a split decision. Flag it; never resolve it by splitting the file.

**Filename:** `<CODE>_<TERM>_roster.xlsx` (e.g. `THTR123_F26_roster.xlsx`). **Sheet name:** `<CODE> <TERM>`.

---

## Procedure

### 1. Split, and reconcile the count before you attach anything

🔴 **Rows in must equal rows out, summed across every file. State the number both ways.** A split that loses a row is the one failure mode that looks like success — every file opens fine and one person is simply gone. Founding run: 138 in → 138 out across 21 files.

Also state the **export's own timestamp**, read from the latest registration event in the data, not the time you ran the split.

### 2. A course with ZERO rows gets NO FILE

🚫 **Never write an empty roster.** A verbatim split cannot invent one, and an empty file reads as *"nobody enrolled"* when the truth is *"not in this pull."* Those are different facts and only one of them is knowable.

Report the skipped course as an explicit line, with which of the two it is (or `unverified` if you cannot tell). Founding run: one course row was skipped for exactly this reason.

### 3. Attach to the COURSE x SEMESTER row — as a TASK ATTACHMENT

One file per its own course row.

🔴 **Use the plain task attachment, NOT an attachment-type custom field.** Proven defect, founding run: an attachment custom field **cannot accept a fresh upload at all** (it takes only the id of a file already in ClickUp), and pointing it at an existing upload **makes a second copy** rather than referencing the first — arriving with a **doubled file extension** the field adds itself. Cost per task: one duplicate file, one mangled filename.

⚠️ **No agent tool deletes an attachment.** So this defect is not self-correctable: test it once and you have created cleanup only a human can do. **Do not re-test it.**

### 4. 🔴 STAMP THE FRESHNESS FIELD — this is the step that makes the artifact legible

**Michael, 2026-09-07:** *"it's part of your hook. when uploading new roster, update this field that says you did that."*

After attaching, in the SAME pass, write the roster-freshness surface on that course row: the **date** field recording when the roster was last uploaded, plus the **status** field marking it current.

🔴 **Read the exact field names and option values LIVE from the list every run. This file names none of them** — same law as the parent hook's Enrollments field set. Schema rots; procedure does not.

⚠️ **The agent does this write directly, and that is a deliberate ruling, not a shortcut.** The obvious alternative — a native automation stamping the date off the upload — **CANNOT EXIST: ClickUp has no attachment trigger.** Verified against the full trigger list 2026-09-07 (assignee, comment, custom field, name, checklist, dates, Every…, location, priority, move, status, subtasks, tags, created, linked, time tracked, task type, unblocked). **Uploading a file fires nothing.** A date field left to self-populate off an upload stays permanently blank and looks broken.

✅ **So the hook IS the mechanism.** An attach with no stamp is an undated snapshot, which is worse than no snapshot: it will be read as current forever.

🚫 **Never stamp a course you did not attach a file to.** The date means *this file landed*, and a stamp with no file behind it is a lie that filters and sorts will believe. A skipped zero-row course keeps an empty date — **empty means never uploaded, and that is the correct reading.** Never backfill a plausible date.

### 5. Report

A manifest table on the Import Session task: course row (linked) · file (linked) · rows · sections · plus the registrar's own state counts. Then the count reconciliation, the export timestamp, and every skipped course.

🔴 **Every reference is a LINK.** A bare course code in a manifest is a defect — the manifest exists to be clicked.

---

## Guardrails

- 🔒 **No student in this file, and no artifact outside the workspace.** Channel summaries by count and course only.
- 🔴 **Verbatim: add structure, never content.** No renames, no reorders, no recalculation, no summary rows.
- 🔴 **NEVER de-duplicate.** Churn rows and lecture/lab pairs are the record. Say the row count is not a headcount.
- 🔴 **Split by course code, never by section.**
- 🔴 **Rows in = rows out. State the number.**
- 🚫 **No file for a zero-row course.** Report the skip and say which kind it is.
- 🔴 **Task attachment, never an attachment custom field.** The field duplicates the file and doubles the extension, and no tool can delete an attachment afterwards.
- 🔴 **Attach and stamp in ONE pass.** No attachment trigger exists, so nothing else will ever stamp it.
- 🔴 **Read field names and options LIVE.** This file names none.
- 🚫 **Never stamp without an attach.** Empty date = never uploaded.
- ⚠️ **Artifacts are snapshots and go stale during add/drop.** Re-split from a fresh export; never hand-edit an attached file.

---

## Composes with

- `hooks/roster-reconcile.md` — the parent. It reconciles STUDENTS × Enrollments; this publishes the source document onto the course rows.
- `hooks/roster-reconcile.report-spec.md` — Reports 1–3. The manifest here is a fourth surface and deliberately does NOT live there: that spec is about reconciliation findings, this is about artifacts.
- `hooks/verbatim-doc-import.md` — sibling law, prose instead of data: add structure, connection and form, never content.
- `hooks/secrets-pii-guard.md` — the repo-write guard this file's PII rule localizes.
- **Derived Field Pattern** (Brain Reference Library) — the freshness date is a live instance: Q1 stored (staleness must be filterable, and an attachment's upload time is exposed nowhere a filter can reach) · Q2 re-driver = **this hook**, because no attachment trigger exists · Q4 empty = never uploaded. ⭐ Marked as a **REAL REQUIREMENT, not a workaround**: *"when was this snapshot pulled"* is a genuine attribute of a roster record and ports to FileMaker as a plain timestamp. It must NOT be scrubbed as scaffolding during the migration.

---

## Known gaps (honest list)

1. **The parent hook has no pointer to this file yet.** `roster-reconcile.md` is 34KB and this tooling can only replace a file whole, so adding one pointer line would mean re-typing 34KB — the exact silent-loss risk its own size rule warns about. **A cold agent loading only the parent will not find this spec.** Fix properly by splitting that file at a real seam, which is a scoped job of its own, not a side effect of this one.
2. **The freshness date field does not exist yet** at time of writing. Field creation on that list is ClickUp Coach Corey's lane. Until it exists, step 4 stamps only the status half.
3. **Generalized from ONE run** (F26, 2026-09-07, 138 rows / 21 courses / 1 term). A cold session finding no prior run SAYS SO.
4. **The attachment-field defect was observed once, on one field, in one list.** It is recorded as observed behaviour, not as a platform-wide law — but ⚠️ do NOT re-verify it by testing, because the test is not reversible by any agent tool.

---

## Changelog

- **v1 (2026-09-07)** — Established by Tutor Tate during the first full Workday THTR export. Every rule traces to something that happened in that run: the no-de-duplicate law (a five-cycle add/drop and lecture+lab pairs), split-by-code-not-section (five multi-section courses), no-file-for-zero-rows (one skipped course), task-attachment-not-custom-field (the duplicate + doubled-extension defect, one task left needing manual cleanup), and the stamp step on Michael's instruction, with the no-attachment-trigger finding recorded as the reason the agent must do it rather than an automation.
