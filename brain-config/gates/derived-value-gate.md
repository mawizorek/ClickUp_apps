# Derived Value Gate

> **Before you build a field whose correct value is a function of something else.**
> Fires on the BUILD PATH, not at review. One question decides most cases and it is not the one
> people ask.

Steward: **ClickUp Coach Corey** (ClickUp structure + setup coaching). The TOOL is ownerless on the
Doc-Rot-Sweep precedent — any agent fires it mid-task with no persona seated. A formal, scoped,
reported pass across a whole space IS an audit and seizes to **Audit Anna**.

---

## Invocation + Trigger

Git-native. No skill layer (skills are on hold, LOCKED 2026-07-25).

**Commands:** `/derived-value-gate` · `/derived-value` · "run the derived value gate"

**Fires automatically when any of these appear in a request or a build plan:**

- A field that should "pull in," "carry over," "mirror," "match," "inherit," "copy," "sync" or
  "stay in step with" a value that lives somewhere else.
- A roll-up / relationship column that someone wants to filter, sort, group, export or mail-merge on.
- Two or more relationship fields pointing at different Lists that are supposed to feed ONE field.
- A hard-coded copy of a native value (start date, due date, status, assignee) living in a Custom Field.
- Any sentence containing "and then an automation keeps it updated."

---

## The premise (this is the whole tool)

**ClickUp has no live derived value for anything except numbers and dates on the same task.**

Everything else that looks derived is one of two things:

1. **A display that stores nothing** — a roll-up / Relationship column. It is rendered by reading
   through the link at view time. Per ClickUp's own docs: *"Rollup fields are not Custom Fields"* and
   *"Rollup fields only display in the List views you add them to."* There is no value on the task.
   Nothing downstream can read it.
2. **A write** — a value physically stamped onto the task by an automation, an AI action, or a human.

There is no third category. **So the real question is never "how do I derive this," it is "am I
building a display or a write."** A display is free and cannot drift. A write is a machine you now
own, and it drifts the moment its trigger is wrong.

---

## The test (four steps, stop at the first that resolves)

### 1. Does it need to be STORED, or only SEEN?

**Ask this out loud, every time. It kills most of them.**

If a human just needs to look at the value in a view: add the roll-up / Relationship column and
**STOP**. Zero automation, zero drift, zero maintenance. Done.

A stored field is only required for: **filter · sort · group · export · mail-merge · Forms ·
Dashboards · being read by another automation.** If none of those are on the table, building the
stored field is the mistake.

> ⚠️ This step is skipped constantly because "I want it in a field" sounds like a requirement.
> It is usually a habit. Make the requester name which of the eight uses they actually need.

### 2. Is the source NUMERIC or a DATE, on the SAME task?

→ **Formula Field.** Live, computed at read time, never drifts, no automation. This is the only
true derived value ClickUp has.

Supported inputs: Number · Currency · Dropdown *that only uses numbers* · Date Custom Fields ·
start / due / done / created / started / updated / closed · Time Tracked · Time Estimated ·
Sprint Points · other Formula Fields (one nesting layer only).

### 3. Is it TEXT, or does it CROSS A RELATIONSHIP?

→ **You are building a WRITE.** No native mechanism exists. Three documented walls, each
independently fatal:

| Wall | The rule |
|---|---|
| Formulas reject text | *"Formula Fields do not support using Custom Fields that contain text."* Email, Text, Long Text, non-numeric Dropdown, Labels: all excluded. |
| Formulas cannot reach through a link | *"You cannot calculate a sum of values from linked fields using a Formula."* Roll-ups are not in the supported-input list at all. |
| The automation action takes a constant | `Update custom field` documents dynamic *"Fields from Trigger"* sourcing for **Date** Custom Fields ONLY. There is no from-trigger source for Text, Email, or anything else. |

So the write is performed by an **AI automation** (or a human, or an external API caller). That is
not a hack and not a failure of the build. It is the only mechanism, and the gate exists to make
you say so out loud instead of hunting for a native path that is not there.

### 4. If you are building a write, it needs all three of these or it WILL drift

A write with a missing piece is worse than no write, because a stale value reads as a fresh one.

- **A TRIGGER, and the right one.** Fire on *custom field changed* for each source field — the
  moment the link is made. Not on task-create (the link does not exist yet). Not on a schedule
  (the value is wrong for the whole interval in between).
- **A PRECEDENCE RULE for multi-source.** If two sources can both be populated, write down which
  one wins. Undefined precedence means the value flips on every re-run and nobody can tell which
  pass produced what is on screen now.
- **A RE-FIRE PATH.** What happens when the SOURCE record changes after the write? If the answer
  is "nothing," the field is a snapshot, not a mirror — **label it as one** and stop calling it
  synced.

**If you cannot supply all three: say the field will drift, in writing, and let Michael decide.**
Shipping a mirror that silently stops mirroring is the failure this gate exists to prevent.

---

## Structural escapes (check before accepting the write)

Sometimes the derived value is a symptom and the schema is the disease.

- **Two relationship fields feeding one target usually means two home Lists.** Collapsing the two
  source Lists into one List with a TYPE field collapses the two relationship fields into one and
  the problem disappears. ⚠️ Weigh it against the standing URITP CRM rule (STUDENTS + ADULTS stay
  as-is; lean-down happens INSIDE them, not by moving people between people lists). A merge of that
  size is Michael's call, never a gate's.
- **A shared "container" List does NOT rescue you.** Only List-to-List Relationships expose Custom
  Field roll-up columns, and Tasks in Multiple Lists can only be linked *when their HOME Lists are
  related*. Multi-homing a person into a shared list does not relate their home list to anything.
- **A Relationship scoped to a specific List cannot be reused elsewhere**, and the List it points at
  **cannot be changed after creation** — a new relationship must be built. Get the target right the
  first time.

## Gotchas worth knowing before you commit

- Formula Fields **cannot be added to multiple locations** — no sharing one formula across Lists.
- Formula Fields are **not compatible with templates**; applying a template drops them.
- Formulas using `TODAY()` cannot be sorted, filtered, grouped, used in Automations, or used in
  Dashboard Calculation cards.
- Roll-up / Relationship columns exist **per view**. Adding one to a List view does not put it
  anywhere else, and it never appears on the task itself.
- **Relationship and Rollup fields cannot be MOVED** between locations in the Custom Field Manager.

---

## Instance ledger (why this is a pattern and not three accidents)

Every entry is the same shape: *a value that must track another value, with no native mechanism to
keep it tracking.* Append here rather than logging a fourth one-off.

| # | Instance | Source → Target | Resolution |
|---|---|---|---|
| 1 | Time-boxed availability poll | a date window → a per-poll List + hard-coded date fields | Unresolved. Every poll mints a new List plus date fields that persist forever. Mechanism gap named, not closed. |
| 2 | **Frozen Date Mirror** (D5, 2026-08-05) | native `start_date` / `due_date` → folder-scoped `BEGIN` / `END` Date fields | Write. ⚠️ No bulk path exists — a date Custom Field is constants-only on `UPDATE` (no column-to-column copy, no `CASE` map), so backfill is one write per task. A List adopting the pattern needs an on-create / on-date-change automation or the mirror silently drifts. |
| 3 | **Contact Sheet email roll-up** (2026-08-07) | `STUDENT` / `ADULT` List Relationships → one `Contact Email` field | Write, by AI automation. Correct as built. Needs step 4's trigger + precedence + re-fire. |

**What the ledger already teaches:** every instance so far resolved to a WRITE, and every one of
them hit the same missing piece — no native way to keep the write current. The gap is not in any
one build. It is in ClickUp.

---

## Cross-runtime note (the Corey ↔ Fiona seam)

FileMaker does not have this gap, and the reason is precise enough to be useful rather than smug:
**FileMaker's derived value is a FIELD; ClickUp's is a COLUMN.**

An FMP unstored calculation can traverse a relationship, return text, and then be consumed by a
layout, a report, a script, a find, or another calculation. A ClickUp roll-up renders in a view and
terminates there. Same concept, one is consumable and one is not.

**Consequence for anyone reading this mid-build:** "we could just do it in FileMaker" is TRUE and
usually IRRELEVANT. Moving a workflow across runtimes to win one field is a bad trade. The question
is whether the whole entity belongs there — and that is Fiona's call on the FMP side, not this
gate's.

Full correlation (where it holds, where it breaks) lives in **FMP Fiona's** `memory.md` correlation
ledger. Pointer only; never copy it here.

---

## Known limits (stated, per house rule)

- **This gate cannot make anyone answer step 1 honestly.** "I need it in a field" will keep getting
  offered as a requirement. The gate can only make the question get asked.
- It rules on MECHANISM, not on schema. Whether two Lists should be one List is a structural
  decision that belongs to Michael, informed by Corey.
- ClickUp ships features. **Re-verify the three walls in step 3 against live Help Center docs before
  quoting them as current** — the day dynamic from-trigger sourcing lands for text fields, step 3
  changes and this file is wrong.

---

**Born** 2026-08-07, out of the Contact Sheet STUDENT/ADULT email roll-up question, on Michael's
ruling: *"write it up properly instead of us rediscovering it every few weeks."* Third recorded
instance of the same gap.
