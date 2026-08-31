# Roster Reconcile — Report Spec · AI Toolkit

**What this is:** the exact display format for every roster-reconcile report surface. **Load this before reporting; never invent report structure.**

**Applies to:** `hooks/roster-reconcile-prep.md` (Report 1) and `hooks/roster-reconcile.md` (Reports 2 and 3).

**Separate file on purpose** (`screenshot-intake.report-spec.md` precedent): both hooks point here, so the format has ONE claimant and cannot drift into two versions of itself.

**Established 2026-08-31** by Michael, live, across three corrections inside a single run. Every rule below traces to one of them.

---

## 🔴 The three rules that generated this file

1. **"not prose. a REPORT."** A findings block is a TABLE, not paragraphs. Prose buries the state column, which is the only part he acts on.
2. **State vocabulary is HIS, not the hook's.** He reports in `ADD` / `MAKE` / `PRESENT`. The hook's internal buckets (NEW / MATCH / UPDATE / CROSS-SEM / WITHDRAWN? / CONFLICT) stay internal — they are for deciding, not for showing.
3. **Every touched course gets a before/after block.** A write receipt that only lists rows written does not answer the question he actually asks: *what does the class look like now.*

⚠️ **Every reference is a LINK.** Course x Semester row, Person record, Enrollment row, source email chain. A bare name or a raw id in a report is a defect — he works from the report by clicking it.

---

## Report 1 — PREP candidates (the pick-from queue)

Four columns, one row per candidate. Emitted by `roster-reconcile-prep.md` step 4.

```
🎓 ROSTER RECONCILE PREP · <inbox> · <date> · <n> candidates
PRESENT <n> · ADD <n> · MAKE <n> · HELD <n> · nothing written
```

| Email | Student | Course X Semester | State |
| --- | --- | --- | --- |
| `[<chain id>](url)` | `[<Person>](url)` or plain name if none exists | `[{THTR###}{TERM}](url)` | PRESENT / **ADD** / **MAKE** |

**The state column, and this is the whole point of the table:**

| State | Means | Links to |
| --- | --- | --- |
| `PRESENT` | person AND enrollment row both already exist — no-op | link the STATE cell to the existing enrollment row |
| `ADD` | person exists, enrollment row for this course+term does NOT | — |
| `MAKE` | no person record at all — both get created | — |
| `HELD` | not writable yet; append the reason inline (`⚠️ drop`, `⚠️ held`, unresolved course) | — |

- **Sort by state**, PRESENT first, then ADD, then MAKE. The eye lands on what needs doing.
- **HELD rows stay IN the table** with the flag inline, then get a short block beneath explaining each. Never drop a held row from the table; an invisible held item is a lost item.
- **Name splits get their own line under the table**, not a column: `legal <X> / signs <Y>`. They are a data-integrity note, not a per-row attribute.
- Missing email is written `(no email in thread)`. Never guessed.

---

## Report 2 — WRITE receipt (what just happened)

Counts block, then a table of what was written.

```
✅ ROSTER RECONCILE COMPLETE · <TERM> · <date>
✓ WRITTEN     <n>   <x> new People · <y> Enrollment rows · <z> status flips
– SKIPPED     <n>   already current
⚡ FLAGGED     <n>   not touched
! UNRESOLVED   <n>   parked for your call
```

| Enrollment row | Student | Course × Sem | GRADING |
| --- | --- | --- | --- |
| `[{###}{TERM}@{Name}](url)` | `[<Person>](url)` 🆕 if newly created | `[{THTR###}{TERM}](url)` | value read live from the list |

- 🆕 marks a Person created this pass. Cheap, and it separates new humans from new joins at a glance.
- **Say what each GRADING value MEANS** in one line beneath the table, in this workspace's terms (e.g. request filed and awaiting approval vs no request on file). The dropdown word alone does not carry it.
- **State what you did NOT write, explicitly.** Anything you noticed but was outside the approved set gets named here. A silent omission reads as a completed pass.

---

## Report 3 — PER-COURSE before/after (⭐ the one he asked for by name)

One block per course the pass TOUCHED. Untouched courses never appear.

```
**[{THTR###}{TERM}](url)**
- previously enrolled: **<count>**
- added: [<Name>](enrollment row url) · [<Name>](enrollment row url)
- currently enrolled: **<count>**
```

- **`added:` links the ENROLLMENT ROW, not the person.** The row is the thing that was created and the thing he audits.
- **Recount `currently enrolled` from the live rows** after the write. Never `previously + added` arithmetic — that is the undocumented-arithmetic defect the doc-rot sweep flags, and it silently hides a row that failed to write.
- **Closed / `Unregistered` rows are EXCLUDED from both counts, and you say so** with the excluded count in parentheses on the `previously` line. Excluding them silently makes the before/after look wrong to anyone reading the list.
- Close with a **totals line** (`<before> → <after>, +<n>`).
- ⭐ **Then the reading, one or two lines max.** The counts are the data; the value is what they reveal — e.g. a roster that looks full while almost nobody is actually registered. A before/after with no reading is a table he has to interpret himself.

---

## Guardrails

- 🔴 **Tables, not prose,** for any findings or receipt block. Prose is for the one-line reading at the end.
- 🔴 **Link everything** — course row, person, enrollment row, source chain. No bare names, no raw ids.
- 🔴 **Report in ADD / MAKE / PRESENT.** Internal buckets are for deciding, never for display.
- 🔴 **Recount from the rows.** Never derive a current count by addition.
- 🔴 **Name every exclusion and every omission.** Closed rows excluded from a count, anything noticed but not written.
- 🔴 **Only touched courses appear** in Report 3.
- 🔒 **FERPA:** these reports live on a workspace task or comment. Never the repo, an artifact, or a chat channel — including the Agent Activity Board. Summarize to a channel by count and course only. See the PII RULE in both roster hooks.

---

## Changelog

- **v1 (2026-08-31)** — Established by Michael live during the first full roster-reconcile run: *"not prose. a REPORT"* (→ Report 1's four-column table), the ADD/MAKE/PRESENT state vocabulary, and *"give me a report that says \[course x semester link\] / previously enrolled / added / currently enrolled ... for any classes that you touched"* (→ Report 3). Recount-not-arithmetic, link-everything, and name-every-exclusion folded in from defects observed in the same run.
