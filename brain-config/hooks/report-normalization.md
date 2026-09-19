---
id: report-normalization
kind: hook
version: 1.2
status: LIVE (fires as part of morning briefing, not standalone)
steward: Mainstage Milo
execution: morning briefing pre-pass (fires BEFORE the briefing blocks)
born: 2026-09-15
repo: mawizorek/ClickUp_apps@main (brain-config, PUBLIC)
trigger: /morning (via morning-briefing.md) OR direct invocation on a report task
sibling: brain-config/hooks/call-normalization.md -- SAME paperwork stream, OPPOSITE direction in time
---

# Report Normalization -- rehearsal report intake

Parses forwarded stage manager emails into structured Production Report tasks and their associated Production Notes, then links them. This is the routine that turns Bia's nightly email into actionable, department-tagged, linked work.

## 🔗 Sibling hook: `call-normalization.md`

The stage manager sends TWO pieces of paperwork every night, from the same account, to the same forwarding addresses, into the same kind of intake task in the same Paperwork list: a **REPORT** of what happened, and a **CALL** for what is next. This hook owns the report. `call-normalization.md` owns the call.

🔴 **They are deliberately separate files.** Michael's ruling, 2026-09-19: *"call normalization is different from report normalization... There are two different hooks, even though they can be related and reference each other — saying, 'Hey, this also exists.' There is no need to bloat a single file if they are two distinct workflows anyway!"*

The calls sweep briefly lived inside this file as a v1.2 section and was split out the same session. **Do not fold it back in.** What differs is not cosmetic: the call pass is prospective, writes to event tasks as comments, and is a judgement pass about what is noteworthy; this pass is retrospective, writes structured fields and department notes, and is largely mechanical.

**What they share, and where it lives:**

- **The folder enumeration** (this file, THE NIGHTLY SWEEP step 1). Run it ONCE per morning pass, not once per hook.
- **The two-surface model** -- forward local, instance central (this file).
- **The after-midnight date rule** -- key on the event date named inside the email, never the comment timestamp (both).
- **The intake-precondition finding** -- a show with no `| ... |` task cannot be swept at all (this file for `| reports |`, the sibling for `| calls |`).

⭐ **And one free cross-check that catches a schedule change nobody announced:** this hook's `timings: NEXT Event Details` and the next day's CALL are the same information from two sources. **When they disagree, the call is fresher.**

## Why this exists

The stage manager emails a rehearsal report every night. That email lands as a comment on the production's `| reports |` task (the CANONICAL source). A separate system (ClickBot) creates skeleton tasks in the Production Reports list. This hook bridges the two: it reads the email, fills the skeleton, and creates the department notes.

Without it, every report sits with placeholder text in its fields and zero notes linked. Michael was doing this by hand.

---

## THE CANONICAL SOURCE

**The `| reports |` task in the production's Paperwork list is the single source of truth.** Every forwarded email lives as a comment on this task. The Production Reports list tasks are the ClickUp-structured version, NOT the source.

**Finding the reports task:** each production folder (e.g. `Big Love (F26)`) has a Breakdowns subfolder containing a Paperwork list. The `| reports |` task lives there. Pattern: `[SHOW] | reports |`. Big Love's is `86ak1p27t`.

⚠️ **Its sibling `[SHOW] | calls |` sits in the same list** (Big Love: `86ak1p328`) and belongs to the other hook. A session that finds one and not the other has looked at half the paperwork.

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

1. **Enumerate live productions from the FOLDERS**, exactly as the briefing's ROLL CALL does -- never from what came up in conversation. A show that rehearsed and was not enumerated is invisible to this hook. **Shared with the sibling hook: enumerate once, use twice.**
2. **For each one, ask: did it rehearse last night?** Read its `| reports |` task for a comment newer than the last processed instance. ⚠️ **The email routinely arrives AFTER midnight** -- Bia's Sep 16 report landed at 12:14 AM on Sep 17, and her Sep 18 report at 12:44 AM on Sep 19. **Key on the REHEARSAL date in the email, never on the comment's timestamp.**
3. **Match, normalize, create notes, link** per the sections below.
4. **A production with no new comment is reported as "no report received," NOT as clean.** Say which: no rehearsal called, or a rehearsal that owes a report. The second one is a stage-management follow-up and it is a finding.

### 🔴 THE INTAKE PRECONDITION -- and it is a real gap, verified live

**A production with no `| reports |` task CANNOT be swept.** There is nowhere for its forwards to land, so no instance can ever be built for it, and the sweep will report zero forever while looking healthy.

**So the sweep checks for the SURFACE, not just the content**, and it raises a missing intake task as a finding **BEFORE that show's first rehearsal, not after.** Verified state 2026-09-19: **only Big Love has one.** One Acts and The Christians have retired/closed ones, and **Becoming Curious, T.I.M.E., The Secretary and Songs for a New World have none** -- with Becoming Curious rehearsing from **Sep 23** (corrected from the Sep 22 figure carried in v1.1).

⚠️ **The lead time is the point.** An intake task created the morning after the first report was emailed means that report was already lost to somebody's inbox. **Flag it when first rehearsal is on the horizon, not when the email bounces.**

🚫 **The hook does NOT create the intake task itself.** It needs an email-forwarding address confirmed against the sending account, which is Michael's setup step. The hook names the show, the date it starts rehearsing, and the list the task belongs in.

---

## 🔴 THE RECONCILIATION PASS -- CHECK THE TASKS AGAINST THE RECORDS (v1.1)

Michael, same turn: *"check rehearsal report TASKS against my rehearsal report records and notes in the newly structured intake of actual notes."*

**Creating what is missing is only half the job.** The other half is proving that what already exists matches its source. Run this over the whole Production Reports list, not just last night's row, and report **five named mismatch classes**:

1. **EMAIL WITH NO INSTANCE** -- a forward on a `| reports |` task with no matching report row. This is the create case. It is also the most common one after a busy week.
2. **INSTANCE WITH NO EMAIL** -- a report row whose date has no forward behind it. 🚫 **Never delete it and never fabricate content for it.** Say so and let Michael rule: usually it is a ClickBot skeleton for a rehearsal whose report never arrived, which is a stage-management finding, not a data-cleanup one.
3. **NOTES CREATED, `Notes Done` UNTICKED** -- the checkoff backlog. This is Michael's confirmation queue and it belongs in the briefing's GATEKEEPER block, grouped and aged. 🚫 **The hook NEVER ticks it** (see Authority).
4. **`Notes Done` TICKED, ZERO NOTES LINKED** -- ambiguous by construction and it must be disambiguated against the EMAIL, never assumed. "No notes, thanks!" across every section is a legitimately empty report and correctly ticked. A report with real department content and no notes is a miss. ⚠️ **A ticked row with zero notes AND no email behind it is UNVERIFIABLE, not legitimate** -- report it as such (the Sep 4 Big Love row is the live instance).
5. **NOTES EXIST BUT THE RELATIONSHIP IS EMPTY** -- an orphan note. The `REPORT` relationship (`64d44748-2554-4c6e-b111-0249d8817b6c`) is the only thing tying a note to the night that produced it; without it the note is unattributable within a week.

⚠️ **Report the DENOMINATOR.** "Four mismatches" is a verdict on the system; "four of sixteen instances" is a reading. Always the second.

⚠️ **A report whose every section says "See production meeting notes" is NOT unprocessed.** It is a report that delegated its content to another surface (Big Love's Sep 14 designer run is the canonical instance). It needs a pointer to that surface, not four empty notes -- and an empty notes list on such a row must never be counted as a miss.

---

## Scope

**IN:** Every production in the URITP PRODUCTIONS space that has:
1. A `| reports |` task with email comments
2. Corresponding tasks in the Production Reports list
3. Unprocessed reports (Notes Done != true AND Production Notes IS NULL)

**OUT:** Reports already marked Notes Done = true. Reports that already have Production Notes linked. Reports with no matching email on the `| reports |` task (flag as a gap, do not fabricate). **Everything about CALLS** -- that is `call-normalization.md`.

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
| Report Date START | Start time from the email header | `af0bfd6d-81dc-464e-9dd3-5e34eb0f73b4` |
| Report Date END | End time from the email header | `22615620-8b96-4da0-90ae-f9bfcea627e7` |
| attendance: ACTORS | Actors line | `275d1a33-7d7f-40c4-b0ad-7542dc3f5d6d` |
| attendance: MANAGEMENT | Management line | `8c91245b-5d9d-408d-9646-9fb82707a4bd` |
| attendance: PRODUCTION | Production line | `0a1446c2-07b1-4e28-b43e-7924dfab080b` |
| report_type | Rehearsal / Performance / Front of House | `2aca88a2-1d8f-402b-b496-4d529ede128d` |

Also update the task description to replace any placeholder text with the parsed content, matching the template format of completed reports.

⚠️ **`URITP Productions` (`588908e1-6f53-46ca-9bab-8d0a12e145c8`) is what makes a central list survive five shows.** Set it on every instance, every time. Big Love is `81fa53ba-0b8a-4313-b45f-27d95b9b399b`; read the field's live options for the rest rather than guessing.

⚠️ **`Event LOCATION` (`accde03b-b7e4-456a-aefc-a7bccdd55fcb`) is a trap on this paperwork.** The email's location column carries the venue for the NEXT call, not the one being reported. **Leave it blank unless this rehearsal's own venue is stated**, and say in the description that you did.

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

### 🔴 Five relationship and linking defects, all verified live 2026-09-19

**1. RELATIONSHIP WRITES TAKE BARE TASK IDS, AND A URL FAILS SILENTLY.** Three notes created with `REPORT` set to a task URL returned success and wrote NOTHING; all three read back empty. Fixed by writing the inverse side (`Production Notes` on the report instance) with bare ids. **Always pass bare ids, and always read the relationship back after writing it.** Same species as the `create_form` internal-vs-object id trap.

**2. A BULK QUERY RENDERS BOTH RELATIONSHIP COLUMNS BLANK EVEN WHEN THEY ARE POPULATED.** A list-style query of Production Notes showed empty `REPORT` and `Links OUT` on rows that demonstrably had both. **Open the note to read its true values.** A blank column in a list view is not evidence of an empty field, and treating it as one causes duplicate writes.

**3. `Links OUT` POINTS AT WORK, NEVER AT ANOTHER NOTE.** A note-to-note link makes the field unreadable as a queue. Found and removed one.

**4. AN EXISTING DATED TASK IS USUALLY THE RIGHT DESTINATION -- LOOK BEFORE CREATING ONE.** Michael's correction: the Sep 18 camera-fault note belonged on the `rehearsal camera` task he had already dated for that afternoon, not on a new video-repair task. **Creating a sibling next to existing work is worse than an empty field**, because the empty field is visibly unfinished and the duplicate looks done. Search the show's own list, its Show Design and Props lists, Purchase Requests and the receipts lists -- **including CLOSED rows** -- before proposing anything new. ⭐ And when the destination is a dated task, the note's content belongs there as a CALLOUT COMMENT, so it is in front of whoever opens that task on the day.

**5. AN EMPTY `Links OUT` IS SOMETIMES CORRECT, AND SAYING SO IS A REAL FINDING.** A purely informational note ("We will not be using any liquid fake blood," "Cast Rep is Natalie") has no downstream work and never will. Do not force a link to a task that merely shares a department or a person; **"same department" is not evidence.** Evidence is a concrete overlap: the same object named in both, the same scene, the same vendor.

⚠️ **`Links OUT` is the half of the job that rots.** A note asking for a purchasable object with no Links OUT and no matching Purchase Request is a real gap, and it belongs in the reconciliation report.

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
| VIDEO | `0640d772-b010-48ea-b202-e24d028455cc` |
| (PM) Production Management | `58e4264e-eb19-4770-ace1-045b22fb3c90` |
| Cast | `b26c98e8-ba0b-4cec-b66a-4c86175fbeae` |

Use judgement on secondary labels. A SET note about tripping hazards gets both Scenic and Safety. A GENERAL note about cast allergies gets Cast. Read the content, do not just mirror the section header.

🔴 **PRIMARY DEPARTMENT FOLLOWS THE SECTION HEADER; THE LABELS FOLLOW THE CONTENT.** These are different jobs and collapsing them loses information. Sep 16's COSTUMES section asked for a *prop* cane: Primary stays Costumes because that is where the stage manager filed it and that is who answers the design question, and Props gets a label because that is who buys it. **State the split in the note body when it happens** -- a silently re-filed note teaches the stage manager nothing about where her asks land.

---

## Multiple notes per section

When a section contains multiple distinct items (bulleted or clearly separate requests), create ONE note per item. The Sep 2 report's PROPS section had two separate asks (golf bag + barrier stand-in) = two notes.

When it is one continuous thought, it is one note.

🔴 **AND THE INVERSE: ONE OBJECT APPEARING IN TWO SECTIONS IS TWO NOTES, NOT ONE.** Sep 18's report carried the same camera as a GENERAL/VIDEO fault (*"keeps cutting out"*) and a PROPS purchase ask (*"Can we get another camera?"*). **Do not collapse them: one needs a fix and one needs a decision, and they have different owners.** Note the relationship in both bodies so a reader sees the pair -- and **say plainly when resolving one probably dissolves the other**, because that is the sentence that stops an unnecessary purchase.

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
8. **Run `call-normalization.md` in the same pass**, reusing this hook's folder enumeration. Its receipt is a separate line in the same block.

This block appears BEFORE the Gatekeeper block in the briefing output, because it is a maintenance pass, not a finding.

---

## Authority

**Three writes, all narrow:**
1. Updating custom fields on existing Production Reports tasks (normalization).
2. Creating Production Notes tasks in the Production Notes list, and creating a missing Production Reports instance from a verified email.
3. Setting the REPORT relationship on the created notes, and setting `Links OUT` to an EXISTING downstream task when the object overlap is concrete.

NEVER: delete a report, change a report's status to Closed, modify the `| reports |` task or its comments, touch the email content, create a `| reports |` intake task, **write any start/due date on a production event**, or mark Notes Done (that is Michael's confirmation that the notes are correct).

⚠️ **Creating a net-new downstream task to satisfy a `Links OUT` is NOT in this list.** Name what should exist and stop. One is a judgement call worth making out loud; several is a build, and a build gets asked about. **Precedent for a shape is never consent to instantiate it.**

🔴 **`Notes Done` IS THE ONE FIELD THE HOOK MUST NEVER TOUCH, and the reason is structural rather than cautious.** It is the only evidence in the system that a human read the notes. An agent tick makes the field mean "a robot created some tasks," which is exactly what it was invented to distinguish from. A long unticked backlog is therefore a legitimate finding and never a cleanup job.

---

## Known limits

- Cannot read PDF attachments on the `| reports |` task reliably (the email comment text is the working source, not the PDF). If the comment text is truncated or garbled, flag it rather than guessing.
- The "rename when Notes updated" automation is a black box. If it does not fire, the note title stays as created. That is fine; do not chase it.
- Multiple reports from the same calendar date (e.g. a morning and evening session) require matching on time, not just date. Use the timings in the email to disambiguate.
- **Cannot tell a night with no rehearsal from a rehearsal whose report never arrived** without reading the show's calendar. Read it, or label the finding unverified.
- **The sweep is only as complete as the folder enumeration**, and it inherits the ROLL CALL's limit exactly: a production living outside the production folders is invisible to it.
- ⚠️ **The multi-production sweep has NEVER run against a second production**, because as of 2026-09-19 no second production has an intake surface. Every rule here is generalized from Big Love. **A session that fires this on Becoming Curious's first report is running it for the first time and should say so.**

---

## Provenance

Built 2026-09-15 from a live session where Michael walked through the full normalization of the Sep 2 Big Love rehearsal report, then the linking of 5 unlinked notes to their source reports. The methodology correction (use the email source, not timestamps) was Michael's explicit ruling during that session.

The `| reports |` task pattern was discovered at `[BL] | reports |` (task `86ak1p27t`) in Paperwork (BL), Big Love's Breakdowns folder. The pattern is expected to repeat per production.

**v1.1, 2026-09-17**, folded in during a live `/milo` morning wakeup, from one instruction carrying three separate rulings: **the sweep covers every production that rehearsed** (two-surface model: forwards local, instances central) · **the pass RECONCILES as well as creates** (five named mismatch classes, with a denominator) · **the instance is the thing that gets checked off**, which made `Notes Done` a gatekeeper queue rather than a field.

⭐ **Three facts were discovered by running it rather than by specifying it, which is why they are written down:** the report email arrives after midnight and must be keyed on the rehearsal date · the stage manager's typed date line disagrees with her own PDF filename and loses to it · **four of five live productions have no intake surface at all**. That last one is the finding the whole version exists to surface, and no amount of normalizing Big Love would ever have produced it.

**v1.2, 2026-09-19**, from a live `/milo` morning wakeup + email triage session. Two things happened in one pass. First, the Sep 18 Big Love report was normalized end to end -- instance plus three notes -- and **produced five separate relationship and linking defects**, all recorded above, the sharpest being that a relationship write with a URL succeeds and writes nothing.

🔴 Second, **the calls sweep was written into this file as a v1.2 section and then SPLIT OUT to `call-normalization.md` in the same session, on Michael's ruling:** *"There is no need to bloat a single file if they are two distinct workflows anyway!"* The merged file had also reached 34,846 bytes, past this repo's read-whole ceiling. **The byte count agreed with the ruling, but the ruling is the reason** -- and worth recording because the instinct to fold in was itself a correct instinct applied to the wrong pair. `ddr-reconcile`/`ddr-reaudit` are two verbs on ONE noun and stayed separate; reports and calls are two verbs on two nouns. **Fold-in is not the default; SAME NOUN is the test.**
