---
id: report-normalization
kind: hook
version: 1.1
status: LIVE (fires as part of morning briefing, not standalone)
steward: Mainstage Milo
execution: morning briefing pre-pass (fires BEFORE the briefing blocks)
born: 2026-09-15
repo: mawizorek/ClickUp_apps@main (brain-config, PUBLIC)
trigger: /morning (via morning-briefing.md) OR direct invocation on a report task
---

# Report Normalization -- rehearsal report intake

Parses forwarded stage manager emails into structured Production Report tasks and their associated Production Notes, then links them. This is the routine that turns Bia's nightly email into actionable, department-tagged, linked work.

## Why this exists

The stage manager emails a rehearsal report every night. That email lands as a comment on the production's `| reports |` task (the CANONICAL source). A separate system (ClickBot) creates skeleton tasks in the Production Reports list. This hook bridges the two: it reads the email, fills the skeleton, and creates the department notes.

Without it, every report sits with placeholder text in its fields and zero notes linked. Michael was doing this by hand.

---

## THE CANONICAL SOURCE

**The `| reports |` task in the production's Paperwork list is the single source of truth.** Every forwarded email lives as a comment on this task. The Production Reports list tasks are the ClickUp-structured version, NOT the source.

**Finding the reports task:** each production folder (e.g. `Big Love (F26)`) has a Breakdowns subfolder containing a Paperwork list. The `| reports |` task lives there. Pattern: `[SHOW] | reports |`.

DO NOT derive report content from timestamps, task creation dates, or assumptions. READ THE EMAIL.

---

## 🔴 THE NIGHTLY SWEEP -- EVERY PRODUCTION THAT REHEARSED, NOT JUST BIG LOVE (v1.1)

Michael, 2026-09-17, during a live `/milo` morning wakeup:

> *"any rehearsal from the night before (big love, becoming curious, one acts, etc) end up as actual report instances to be checked off while their forwards live locally in their production lists."*

**THE TWO-SURFACE MODEL, and it is the whole architecture:**

- **The FORWARD lives LOCALLY.** The stage manager's forwarded email stays as a comment on that production's own `| reports |` task, in that production's own Paperwork list. It never moves, never gets copied to a central list, never gets edited.
- **The INSTANCE lives CENTRALLY.** Every rehearsal produces one row in the shared Production Reports list (`901328331141`), tagged to its show via `URITP Productions`, which is the surface Michael checks off.

⭐ **Why both: the forward is EVIDENCE and belongs next to the show; the instance is WORK and belongs in one queue.** A single central list of instances is how a production manager running five shows sees one night's obligations in one read. Five separate per-show report lists would rebuild the problem this list solved.

### The sweep, per run

1. **Enumerate live productions from the FOLDERS**, exactly as the briefing's ROLL CALL does -- never from what came up in conversation. A show that rehearsed and was not enumerated is invisible to this hook.
2. **For each one, ask: did it rehearse last night?** Read its `| reports |` task for a comment newer than the last processed instance. ⚠️ **The email routinely arrives AFTER midnight** -- Bia's Sep 16 report landed at 12:14 AM on Sep 17. **Key on the REHEARSAL date in the email, never on the comment's timestamp.**
3. **Match, normalize, create notes, link** per the sections below.
4. **A production with no new comment is reported as "no report received," NOT as clean.** Say which: no rehearsal called, or a rehearsal that owes a report. The second one is a stage-management follow-up and it is a finding.

### 🔴 THE INTAKE PRECONDITION -- and it is a real gap, verified live

**A production with no `| reports |` task CANNOT be swept.** There is nowhere for its forwards to land, so no instance can ever be built for it, and the sweep will report zero forever while looking healthy.

**So the sweep checks for the SURFACE, not just the content**, and it raises a missing intake task as a finding **BEFORE that show's first rehearsal, not after.** Verified state 2026-09-17: Big Love has one, One Acts and The Christians have retired/closed ones, and **Becoming Curious, T.I.M.E., The Secretary and Songs for a New World have none** -- with Becoming Curious rehearsing from Sep 22.

⚠️ **The lead time is the point.** An intake task created the morning after the first report was emailed means that report was already lost to somebody's inbox. **Flag it when first rehearsal is on the horizon, not when the email bounces.**

🚫 **The hook does NOT create the intake task itself.** It needs an email-forwarding address confirmed against the sending account, which is Michael's setup step. The hook names the show, the date it starts rehearsing, and the list the task belongs in.

---

## 🔴 THE RECONCILIATION PASS -- CHECK THE TASKS AGAINST THE RECORDS (v1.1)

Michael, same turn: *"check rehearsal report TASKS against my rehearsal report records and notes in the newly structured intake of actual notes."*

**Creating what is missing is only half the job.** The other half is proving that what already exists matches its source. Run this over the whole Production Reports list, not just last night's row, and report **five named mismatch classes**:

1. **EMAIL WITH NO INSTANCE** -- a forward on a `| reports |` task with no matching report row. This is the create case. It is also the most common one after a busy week.
2. **INSTANCE WITH NO EMAIL** -- a report row whose date has no forward behind it. 🚫 **Never delete it and never fabricate content for it.** Say so and let Michael rule: usually it is a ClickBot skeleton for a rehearsal whose report never arrived, which is a stage-management finding, not a data-cleanup one.
3. **NOTES CREATED, `Notes Done` UNTICKED** -- the checkoff backlog. This is Michael's confirmation queue and it belongs in the briefing's GATEKEEPER block, grouped and aged. 🚫 **The hook NEVER ticks it** (see Authority).
4. **`Notes Done` TICKED, ZERO NOTES LINKED** -- ambiguous by construction and it must be disambiguated against the EMAIL, never assumed. "No notes, thanks!" across every section is a legitimately empty report and correctly ticked. A report with real department content and no notes is a miss.
5. **NOTES EXIST BUT THE RELATIONSHIP IS EMPTY** -- an orphan note. The `REPORT` relationship (`64d44748-2554-4c6e-b111-0249d8817b6c`) is the only thing tying a note to the night that produced it; without it the note is unattributable within a week.

⚠️ **Report the DENOMINATOR.** "Four mismatches" is a verdict on the system; "four of sixteen instances" is a reading. Always the second.

⚠️ **A report whose every section says "See production meeting notes" is NOT unprocessed.** It is a report that delegated its content to another surface (Big Love's Sep 14 designer run is the canonical instance). It needs a pointer to that surface, not four empty notes -- and an empty notes list on such a row must never be counted as a miss.

---

## Scope

**IN:** Every production in the URITP PRODUCTIONS space that has:
1. A `| reports |` task with email comments
2. Corresponding tasks in the Production Reports list
3. Unprocessed reports (Notes Done != true AND Production Notes IS NULL)

**OUT:** Reports already marked Notes Done = true. Reports that already have Production Notes linked. Reports with no matching email on the `| reports |` task (flag as a gap, do not fabricate).

---

## Matching an email to a report

Each email comment contains a date line (e.g. `date: 9/9/26` or appears in the subject line as `[BL] 9/2/26 Rehearsal Report`). Match this to the Production Reports task whose Report Date START falls on the same calendar date.

When the email lacks an explicit date line, parse it from the PDF filename in the comment (e.g. `05. Rehearsal Report 9_2_26 - Sheet1.pdf`).

🔴 **WHEN THE DATE LINE AND THE PDF FILENAME DISAGREE, THE FILENAME AND THE CONTENT WIN, AND THE CONFLICT GETS STATED.** Verified live: the report headed `date: 9/15/26` carried the PDF `16. Rehearsal Report 9_14_26` and described the Monday designer run, which was Sep 14. A stage manager typing a date at 1 AM is the least reliable field in the email. Cross-check against the previous report's `next call` line, which is written while the schedule is in front of her.

If no match: flag it in the briefing output. Do not create orphan notes.

---

## What to normalize on the report task

Parse these from the email body and write to the matching Production Reports task's custom fields:

| Field | Source in email | Custom Field ID |
|---|---|---|
| Event Summary | REHEARSAL SUMMARY section | `3304bf53-95ef-42fa-8bae-6e8e9d5ed15b` |
| timings: Event Details | The left-hand time/description column | `58e9a572-1263-47ce-a465-e824e08c0286` |
| timings: NEXT Event Details | The "next call" column | `785f12d7-9172-42ec-be71-f4e286370c7e` |
| Report Date END | End time from the email header | `22615620-8b96-4da0-90ae-f9bfcea627e7` |
| attendance fields | Actors, Management, Production lines | respective text fields |

Also update the task description to replace any placeholder text with the parsed content, matching the template format of completed reports.

⚠️ **`URITP Productions` (`588908e1-6f53-46ca-9bab-8d0a12e145c8`) is what makes a central list survive five shows.** Set it on every instance, every time. Big Love is `81fa53ba-0b8a-4313-b45f-27d95b9b399b`; read the field's live options for the rest rather than guessing.

---

## Creating Production Notes

The email has department sections. Standard sections:
- GENERAL
- SET
- PROPS
- COSTUMES
- LIGHTS
- SOUND/MUSIC

**"none, thanks!" or equivalent = SKIP.** Only create a note for sections with actual content.

**For each non-empty section, create ONE task** in the Production Notes list (`901328331154`), task type `Journal Entry`, with:

| Field | Value | ID |
|---|---|---|
| Primary Department | Map section header to dropdown | `b8d516a9-4a5e-4868-82ff-03c04764ebe6` |
| Report Note Content (text) | Verbatim text from the section | `77b2eb32-473e-4763-980c-da0db07df677` |
| Notes | Condensed one-line version | `63506962-b7ee-4f06-855d-a66c03b4947a` |
| Production Note (labels) | Relevant department tags | `8bd1a34f-ded0-472a-8185-3b6d5bd3b3ff` |
| REPORT (relationship) | Link to the Production Reports task | `64d44748-2554-4c6e-b111-0249d8817b6c` |
| Links OUT (tasks) | Downstream work this note spawned | `6ea062af-dbcd-47ea-89fd-ffbacb98ab48` |

⚠️ **`Links OUT` is the "associated links out" half of the job and it is the half that rots.** It points a note at the purchase request, build task or design task that actually answers it. Leave it empty when nothing downstream exists yet -- but a note asking for a purchasable object with no Links OUT and no matching Purchase Request is a real gap, and it belongs in the reconciliation report.

### Department mapping (section header -> Primary Department dropdown ID)

| Section | Dropdown value | Dropdown ID |
|---|---|---|
| GENERAL | General | `6aed65c8-b28e-4311-8acc-08651079c0ef` |
| SET | Scenic | `348986be-e61a-4a96-b120-ed29ea0adcaa` |
| PROPS | Props | `b50c7aa7-ddaa-4f64-b7e4-86d3469297ae` |
| COSTUMES | Costumes | `9f5aaee1-ae96-41da-8261-083f6fac74e7` |
| LIGHTS | Lighting | `0c9d9feb-30f1-4045-a54b-f79eb3deff59` |
| SOUND/MUSIC | Sound / Music | `db97f769-67e9-47f7-a5f1-f0dbe5f1807f` |

### Production Note label mapping (common secondary tags)

| Concept | Label ID |
|---|---|
| Props | `9024fd95-bb2b-41ef-86c4-b0c1e7c6e134` |
| Scenic | `6218a7bc-c939-4a24-9ed8-ad6b9f4d1c37` |
| Safety | `1c4f1d53-ef2c-4bfc-9f77-b2d7d351b277` |
| Costumes & Wardrobe | `3a3e53d2-4ece-4a40-9461-532aec7dc3ec` |
| Lighting (LX) | `f1c205f5-e2bb-4ea4-aeba-0b0e3f01212c` |
| Sound/Audio | `6af60514-62e4-4c65-9814-379f6172f6d0` |
| Music | `1837f46e-147d-496c-9512-6f1e084e56e0` |
| (PM) Production Management | `58e4264e-eb19-4770-ace1-045b22fb3c90` |
| Cast | `b26c98e8-ba0b-4cec-b66a-4c86175fbeae` |

Use judgement on secondary labels. A SET note about tripping hazards gets both Scenic and Safety. A GENERAL note about cast allergies gets Cast. Read the content, do not just mirror the section header.

🔴 **PRIMARY DEPARTMENT FOLLOWS THE SECTION HEADER; THE LABELS FOLLOW THE CONTENT.** These are different jobs and collapsing them loses information. Sep 16's COSTUMES section asked for a *prop* cane: Primary stays Costumes because that is where the stage manager filed it and that is who answers the design question, and Props gets a label because that is who buys it. **State the split in the note body when it happens** -- a silently re-filed note teaches the stage manager nothing about where her asks land.

---

## Multiple notes per section

When a section contains multiple distinct items (bulleted or clearly separate requests), create ONE note per item. The Sep 2 report's PROPS section had two separate asks (golf bag + barrier stand-in) = two notes.

When it is one continuous thought, it is one note.

---

## The description template

The note task description follows this shape (observed from existing notes):

```
**Header Department:**
<Department name>

**Report Note Content (text):**
<Verbatim text from the report section>
```

Additional lines (e.g. `**Other Department Tags:**`) only when cross-department.

---

## After processing

The `rename when Notes updated` automation fires on the Notes field and retitles the note task automatically. Do not manually set titles to match the automation's output; let it fire.

---

## Morning briefing integration

When firing as part of `/morning`:

1. **BEFORE the briefing blocks**, sweep EVERY live production for unprocessed reports (see THE NIGHTLY SWEEP).
2. Process them silently (this is a WRITE, authorized same as the drill batch).
3. In the briefing output, report what was processed: `Processed N reports, created M notes (links).`
4. Flag any emails that could not be matched to a report task.
5. Flag any reports with `No Notes? = true` that unexpectedly have notes in the email (this means the stage manager's "no notes" flag was wrong).
6. **Report the reconciliation pass's five mismatch classes with a denominator**, and route the `Notes Done` backlog into the GATEKEEPER block rather than this one.
7. **Name every production with no intake surface**, with the date it starts rehearsing.

This block appears BEFORE the Gatekeeper block in the briefing output, because it is a maintenance pass, not a finding.

---

## Authority

**Three writes, all narrow:**
1. Updating custom fields on existing Production Reports tasks (normalization).
2. Creating Production Notes tasks in the Production Notes list, and creating a missing Production Reports instance from a verified email.
3. Setting the REPORT relationship on the created notes.

NEVER: delete a report, change a report's status to Closed, modify the `| reports |` task or its comments, touch the email content, create a `| reports |` intake task, or mark Notes Done (that is Michael's confirmation that the notes are correct).

🔴 **`Notes Done` IS THE ONE FIELD THE HOOK MUST NEVER TOUCH, and the reason is structural rather than cautious.** It is the only evidence in the system that a human read the notes. An agent tick makes the field mean "a robot created some tasks," which is exactly what it was invented to distinguish from. A long unticked backlog is therefore a legitimate finding and never a cleanup job.

---

## Known limits

- Cannot read PDF attachments on the `| reports |` task reliably (the email comment text is the working source, not the PDF). If the comment text is truncated or garbled, flag it rather than guessing.
- The "rename when Notes updated" automation is a black box. If it does not fire, the note title stays as created. That is fine; do not chase it.
- Multiple reports from the same calendar date (e.g. a morning and evening session) require matching on time, not just date. Use the timings in the email to disambiguate.
- **Cannot tell a night with no rehearsal from a rehearsal whose report never arrived** without reading the show's calendar. Read it, or label the finding unverified.
- **The sweep is only as complete as the folder enumeration**, and it inherits the ROLL CALL's limit exactly: a production living outside the production folders is invisible to it.
- ⚠️ **The multi-production sweep has NEVER run against a second production**, because as of 2026-09-17 no second production has an intake surface. Every rule here is generalized from Big Love. **A session that fires this on Becoming Curious's first report is running it for the first time and should say so.**

---

## Provenance

Built 2026-09-15 from a live session where Michael walked through the full normalization of the Sep 2 Big Love rehearsal report, then the linking of 5 unlinked notes to their source reports. The methodology correction (use the email source, not timestamps) was Michael's explicit ruling during that session.

The `| reports |` task pattern was discovered at `[BL] | reports |` (task `86ak1p27t`) in Paperwork (BL), Big Love's Breakdowns folder. The pattern is expected to repeat per production.

**v1.1, 2026-09-17**, folded in during a live `/milo` morning wakeup, from one instruction carrying three separate rulings: **the sweep covers every production that rehearsed** (two-surface model: forwards local, instances central) · **the pass RECONCILES as well as creates** (five named mismatch classes, with a denominator) · **the instance is the thing that gets checked off**, which made `Notes Done` a gatekeeper queue rather than a field.

⭐ **Three facts were discovered by running it rather than by specifying it, which is why they are written down:** the report email arrives after midnight and must be keyed on the rehearsal date · the stage manager's typed date line disagrees with her own PDF filename and loses to it · **four of five live productions have no intake surface at all**, with Becoming Curious rehearsing from Sep 22. That last one is the finding the whole version exists to surface, and no amount of normalizing Big Love would ever have produced it.
