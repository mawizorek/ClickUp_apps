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
scope: TWO sweeps on one noun -- REPORTS (last night, retrospective) and CALLS (tonight/tomorrow, prospective)
---

# Report Normalization -- rehearsal report AND call intake

Parses forwarded stage manager emails into structured Production Report tasks and their associated Production Notes, then links them. This is the routine that turns Bia's nightly email into actionable, department-tagged, linked work.

🔴 **As of v1.2 this hook covers BOTH halves of the stage manager's nightly paperwork.** She sends a REPORT of what happened and a CALL for what is next, from the same account, to the same forwarding addresses, into the same kind of intake task. **Same noun, two directions in time.** The CALLS sweep is specified below the reports material and shares this file's enumeration, matching and two-surface machinery rather than duplicating it.

## Why this exists

The stage manager emails a rehearsal report every night. That email lands as a comment on the production's `| reports |` task (the CANONICAL source). A separate system (ClickBot) creates skeleton tasks in the Production Reports list. This hook bridges the two: it reads the email, fills the skeleton, and creates the department notes.

Without it, every report sits with placeholder text in its fields and zero notes linked. Michael was doing this by hand.

---

## THE CANONICAL SOURCE

**The `| reports |` task in the production's Paperwork list is the single source of truth.** Every forwarded email lives as a comment on this task. The Production Reports list tasks are the ClickUp-structured version, NOT the source.

**Finding the reports task:** each production folder (e.g. `Big Love (F26)`) has a Breakdowns subfolder containing a Paperwork list. The `| reports |` task lives there. Pattern: `[SHOW] | reports |`.

⚠️ **There is a SIBLING intake task for calls: `[SHOW] | calls |`, in the same Paperwork list.** Big Love's is `86ak1p328`. Same pattern, same forwarding mechanism, different content. A session that finds one and not the other has looked at half the paperwork.

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
4. **`Notes Done` TICKED, ZERO NOTES LINKED** -- ambiguous by construction and it must be disambiguated against the EMAIL, never assumed. "No notes, thanks!" across every section is a legitimately empty report and correctly ticked. A report with real department content and no notes is a miss.
5. **NOTES EXIST BUT THE RELATIONSHIP IS EMPTY** -- an orphan note. The `REPORT` relationship (`64d44748-2554-4c6e-b111-0249d8817b6c`) is the only thing tying a note to the night that produced it; without it the note is unattributable within a week.

⚠️ **Report the DENOMINATOR.** "Four mismatches" is a verdict on the system; "four of sixteen instances" is a reading. Always the second.

⚠️ **A report whose every section says "See production meeting notes" is NOT unprocessed.** It is a report that delegated its content to another surface (Big Love's Sep 14 designer run is the canonical instance). It needs a pointer to that surface, not four empty notes -- and an empty notes list on such a row must never be counted as a miss.

---

## 📋 THE CALLS SWEEP (v1.2) -- WHAT IS COMING, NOT WHAT HAPPENED

Michael, 2026-09-19:

> *"I have paperwork that forwards all the calls from the stage manager, and you should compare that to the events I have listed for our Big Love rehearsals. You don't need to create more work by adding tasks and subtasks for every call, but it would be nice if I clicked on a rehearsal and could see what they were rehearsing based on an import from that call."*

And one turn later, which is the ruling that shapes the whole section:

> *"that is almost request and would permit a subtask generated for... like noteworthy rehearsal chunks. pushing this squarely into your realm to fall out and check for - not a rote parser"*

🔴 **THIS IS A JUDGEMENT PASS WEARING A PARSER'S CLOTHES, AND THE DISTINCTION IS THE ENTIRE FEATURE.** Every line of every call can be binned mechanically. Doing so produces noise. **The deliverable is (a) the call detail visible on the rehearsal it belongs to, (b) window reconciliation, and (c) the few chunks that are genuinely noteworthy promoted to their own surface.**

### 🪦 FIRST, AND READ THIS BEFORE BUILDING ANYTHING: A PARSER ALREADY EXISTED AND IT DIED SILENTLY

A ClickUp agent named **`[BL] Calls Reconciliation`** (plus a `(copy)` variant) did exactly the mechanical half of this job. It ran on `86ak1p328` from **2026-08-28 through 2026-09-10**: parsed each forwarded call, posted a `📋 Call detail` comment onto each matching rehearsal event task, and filed a reconciliation report naming missing blocks. Its output is still sitting in that task's comment threads and it is good work.

**It has not run since Sep 10.** Eight calls landed unprocessed before anyone noticed: Sep 11, 12, 13, 14, 16, 17, 18, 19.

🔴 **SO THE SWEEP'S PRIMARY JOB IS NOT PARSING. IT IS NOTICING THAT THE PARSER STOPPED.** A dead automation emits exactly the same signal as a quiet one: nothing. **Every run compares the newest call comment's timestamp against the newest reconciliation reply's timestamp and reports the gap in days.** That check is cheap, it is falsifiable, and it is the only thing that would have caught this.

⭐ **Generalizes past this hook:** no agent can read ClickUp automation config, so the only way to know an automation is alive is to look for its OUTPUT and date it. Apply this to any agent or automation whose product lands in a comment stream.

🚫 **Do NOT build a second parser next to the stopped one.** If the existing agent is revived, this sweep's mechanical half becomes redundant and the noteworthy-chunk half does not. Check for its output first, every time.

### 🎯 THE NOTEWORTHY-CHUNK CRITERION -- four triggers, and scene work is never one

A chunk earns its own subtask **only** if one of these is true:

1. **A GUEST OR DEPARTMENT ENTERS THE ROOM** -- designers run, design presentations, photo call, a designer/consultant/department head in the building.
2. **THE SHOW RUNS END TO END** -- run-through, stumble-through, dress.
3. **A SAFETY-GOVERNED SPECIALTY IS WORKED** -- fight call, intimacy work, falls; anything with a fight choreographer or intimacy director in it.
4. **A COMPANY MILESTONE LANDS** -- off book, meet & greet, first day in the space, first day on the deck.

🚫 **"Scene 8" is Tuesday.** Scene work, notes, warm ups, character work and table work are the normal substance of a rehearsal and are NOT noteworthy. They belong in the call-detail comment, never in a subtask.

**The one-line test: does somebody outside the rehearsal room need to be there, or does the room change character?** If neither, it is a comment line.

⚠️ **The criterion is deliberately about CONSEQUENCE, not importance.** This is the same law as the briefing's relevance rule (consequence × sole-gatekeeper, never magnitude), arriving in a second container. A chunk is noteworthy because it pulls someone in or changes what the day IS -- not because it sounds significant.

### The sweep, per run

1. **Enumerate live productions from the FOLDERS**, same as the reports sweep. Shared step; do not run it twice.
2. **Read the show's `| calls |` task** for comments newer than the last processed call. Same after-midnight rule: Bia's Sep 19 call landed at 12:13 AM on Sep 19. **Key on the DATE NAMED IN THE CALL, never the comment timestamp.**
3. **Check the dead-parser gap** (above) and report it in days.
4. **Match each call date to the rehearsal event tasks** in that show's rehearsals list (Big Love: `901327015236`). A day routinely has TWO blocks (a day session and an evening session); bin the call's lines into the windows they fall inside.
5. **Post ONE `📋 Call detail` comment per event task**, carrying the time/description lines for that window, who is called and released, and the distribution date of the call it came from. **Say which call distribution it came from, so a newer call's comment visibly supersedes an older one.**
6. **RECONCILE THE WINDOW** -- see below.
7. **Promote noteworthy chunks** to subtask events under the rehearsal block they sit inside (see the field rules).
8. **Mark a preliminary as preliminary.** Bia sends weekly prelims and same-day finals; a prelim's comment says so, in the comment, so nobody plans off a draft.

### 🔴 WINDOW RECONCILIATION -- the finding that is worth more than the transcription

**Compare the call's real span against the event task's dates and report the delta.** This is where the value is, and it is proven: on 2026-09-19 BOTH Big Love rehearsal blocks were an hour early in ClickUp. Call ran 11:00 AM-2:00 PM and 3:00-6:00 PM; the task rows read 10:00 AM-1:00 PM and 2:00-5:00 PM. **The afternoon row as dated STARTS DURING THE BREAK.**

- **A whole-day offset is ONE finding, not two.** Both blocks shifted by the same hour means the day was rebuilt, not that two rows drifted independently. Say "the whole day is shifted" rather than listing each row.
- **A line that falls outside every window is a MISSING BLOCK.** The retired agent reported these correctly and constantly: the 6:30 PM crew/management call before a 7:00 PM actor call has no event covering it on nearly every date. ⚠️ **That pattern is so consistent it is probably a modelling decision, not a gap** -- Michael's events model the ACTOR call, and stage management arrives earlier. **Report it once as a pattern, not once per date**, or the finding becomes wallpaper.
- ⭐ **This is the same seam as the crew-call reconciliation on 2026-09-18: the calendar stores one thing and the paperwork stores another.** There, the calendar held CURTAIN and the email held CALL. Here, the event holds the actor window and the call holds the full day including management. **Neither surface is wrong; they answer different questions, and the reconciliation IS the deliverable.**

🚫 **NEVER WRITE A DATE FROM THIS SWEEP.** Flag the offset and stop. An agent date edit is indistinguishable from Michael's, it knocks a `CURRENT` row to `OUTDATED` in the publish queue, and it manufactures the next run's reconciliation work. This is the same prohibition the morning briefing carries, for the same reason.

### Fields on a promoted noteworthy chunk

Create it as a **subtask of the rehearsal event block it falls inside**, task type `Event`, with native start/due set to the chunk's real times.

🔴 **`GCal STATUS` = `CLOSED (N/A)` and `Info Sheet Status` = `n/a`. Both. Every time.** Michael's ruling, 2026-09-19, verbatim: *"These are internal notes for me. They never need to be updated on the Google Calendar, so their status would be not applicable for that and the production calendar field."*

⭐ **Why this is the correct use of `N/A` rather than the trap the prod-cal hook warns about:** the N/A test is about KIND -- *will this ever be a published event?* -- and the answer here is genuinely never, because **the PARENT rehearsal block is already published.** Publishing a child would double-book the Google calendar for the same hours. `N/A` means never publishes; `NEW` means not yet. A noteworthy chunk is the first case, permanently. **Leaving the field blank is NOT acceptable** -- a blank reads as unverifiable in the publish-queue sweep and the show carries dozens of those already.

**The subtask body** names the trigger that qualified it, the chunk's lines verbatim from the call, who is called, and the call distribution date. Link back to the `| calls |` task.

### 🚫 What this sweep does not do

- **No subtask per call, and no subtask per line.** Michael said so explicitly. The comment is the default surface; a subtask is the exception the criterion earns.
- **No backfill without a ruling.** Michael ruled FORWARD-ONLY on 2026-09-19 when nine historical noteworthy chunks were surfaced. Name what was found, do not build it.
- **No writes to the `| calls |` task or its comments.** Same rule as `| reports |`.
- **No date writes anywhere, ever.**

---

## Scope

**IN:** Every production in the URITP PRODUCTIONS space that has:
1. A `| reports |` task with email comments
2. Corresponding tasks in the Production Reports list
3. Unprocessed reports (Notes Done != true AND Production Notes IS NULL)
4. **(v1.2)** A `| calls |` task with call comments, and rehearsal event tasks to reconcile them against

**OUT:** Reports already marked Notes Done = true. Reports that already have Production Notes linked. Reports with no matching email on the `| reports |` task (flag as a gap, do not fabricate). **Calls whose date already carries a call-detail comment from the SAME distribution** -- a newer distribution supersedes and does get a fresh comment.

---

## Matching an email to a report

Each email comment contains a date line (e.g. `date: 9/9/26` or appears in the subject line as `[BL] 9/2/26 Rehearsal Report`). Match this to the Production Reports task whose Report Date START falls on the same calendar date.

When the email lacks an explicit date line, parse it from the PDF filename in the comment (e.g. `05. Rehearsal Report 9_2_26 - Sheet1.pdf`).

🔴 **WHEN THE DATE LINE AND THE PDF FILENAME DISAGREE, THE FILENAME AND THE CONTENT WIN, AND THE CONFLICT GETS STATED.** Verified live: the report headed `date: 9/15/26` carried the PDF `16. Rehearsal Report 9_14_26` and described the Monday designer run, which was Sep 14. A stage manager typing a date at 1 AM is the least reliable field in the email. Cross-check against the previous report's `next call` line, which is written while the schedule is in front of her.

If no match: flag it in the briefing output. Do not create orphan notes.

⚠️ **The same unreliability applies to calls, and worse.** Call PDFs have been observed mis-filed (`16. Daily Call 9_13_26` for a Sep 14 call, two consecutive `18.` files for Sep 16 and Sep 18) and a Sep 20 line reads `4:00 AM Run Through` for an obvious 4:00 PM. **Read the day's contents, cross-check against the previous call's next-day block, and state a typo as a typo rather than reproducing it as fact.**

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

⭐ **The report's `timings: NEXT Event Details` and the next day's CALL are the same information from two sources.** When they disagree, the call is fresher. That cross-check is free and it catches a schedule change nobody announced.

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

🔴 **RELATIONSHIP WRITES TAKE TASK IDS, NOT URLS, AND A URL FAILS SILENTLY.** Verified 2026-09-19: three notes created with `REPORT` set to a task URL returned success and wrote NOTHING; all three read back empty. Fixed by writing the inverse side (`Production Notes` on the report instance) with bare ids. **Always pass bare ids, and always read the relationship back after writing it.** Same species as the `create_form` internal-vs-object id trap.

⚠️ **`Links OUT` is the "associated links out" half of the job and it is the half that rots.** It points a note at the purchase request, build task or design task that actually answers it. Leave it empty when nothing downstream exists yet -- but a note asking for a purchasable object with no Links OUT and no matching Purchase Request is a real gap, and it belongs in the reconciliation report.

🔴 **`Links OUT` POINTS AT WORK, NEVER AT ANOTHER NOTE.** A note-to-note link makes the field unreadable as a queue. Found and removed one on 2026-09-19.

🔴 **AN EXISTING DATED TASK IS USUALLY THE RIGHT DESTINATION -- LOOK BEFORE CREATING ONE.** Michael's correction, 2026-09-19: the Sep 18 camera-fault note belonged on the `rehearsal camera` task he had already dated for that afternoon, not on a new video-repair task. **Creating a sibling next to existing work is worse than an empty field**, because the empty field is visibly unfinished and the duplicate looks done. Search the show's own list, its Show Design and Props lists, Purchase Requests and the receipts lists -- including CLOSED rows -- before proposing anything new.

⚠️ **An empty `Links OUT` is sometimes CORRECT and saying so is a real finding.** A purely informational note ("We will not be using any liquid fake blood," "Cast Rep is Natalie") has no downstream work and never will. Do not force a link to a task that merely shares a department or a person; **"same department" is not evidence.**

⚠️ **A bulk query of the Production Notes list renders BOTH relationship columns BLANK even when they are populated.** Verified 2026-09-19. **Open the note to read its true values.** A blank column in a list view is not evidence of an empty field, and treating it as one causes duplicate writes.

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

🔴 **AND THE INVERSE: ONE OBJECT APPEARING IN TWO SECTIONS IS TWO NOTES, NOT ONE.** Sep 18's report carried the same camera as a GENERAL/VIDEO fault (*"keeps cutting out"*) and a PROPS purchase ask (*"Can we get another camera?"*). **Do not collapse them: one needs a fix and one needs a decision, and they have different owners.** Note the relationship between them in both bodies so a reader sees the pair -- and say plainly when resolving one probably dissolves the other.

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
8. **(v1.2) Run the CALLS sweep in the same pass**, and report: the dead-parser gap in days · today's and tomorrow's call detail posted · **any window offset between the call and the event tasks** · noteworthy chunks promoted, or found-and-not-built under a forward-only ruling.
9. **(v1.2) A window offset on TODAY belongs in THE ROOM, not in this maintenance block.** A rehearsal whose stored times are wrong by an hour is a collision risk for whoever plans around it, which is exactly what THE ROOM's schedule lane is for. The maintenance receipt stays here; the consequence goes up top.

This block appears BEFORE the Gatekeeper block in the briefing output, because it is a maintenance pass, not a finding.

---

## Authority

**Five writes, all narrow:**
1. Updating custom fields on existing Production Reports tasks (normalization).
2. Creating Production Notes tasks in the Production Notes list, and creating a missing Production Reports instance from a verified email.
3. Setting the REPORT relationship on the created notes, and setting `Links OUT` to an existing downstream task when the object overlap is concrete.
4. **(v1.2)** Posting `📋 Call detail` comments onto rehearsal event tasks.
5. **(v1.2)** Creating a noteworthy-chunk subtask event under its rehearsal block, with `GCal STATUS` = `CLOSED (N/A)` and `Info Sheet Status` = `n/a`.

NEVER: delete a report, change a report's status to Closed, modify the `| reports |` or `| calls |` task or their comments, touch the email content, create a `| reports |` intake task, **write any start/due date on a production event**, or mark Notes Done (that is Michael's confirmation that the notes are correct).

🔴 **`Notes Done` IS THE ONE FIELD THE HOOK MUST NEVER TOUCH, and the reason is structural rather than cautious.** It is the only evidence in the system that a human read the notes. An agent tick makes the field mean "a robot created some tasks," which is exactly what it was invented to distinguish from. A long unticked backlog is therefore a legitimate finding and never a cleanup job.

⚠️ **Writes 4 and 5 are the edge of the lane, and write 5 needs a ruling per batch, not per chunk.** A comment is reversible and cheap. A subtask is a structural object: one is fine, nine is a build, and a build gets asked about. Precedent for a shape is never consent to instantiate it.

---

## Known limits

- Cannot read PDF attachments on the `| reports |` task reliably (the email comment text is the working source, not the PDF). If the comment text is truncated or garbled, flag it rather than guessing.
- The "rename when Notes updated" automation is a black box. If it does not fire, the note title stays as created. That is fine; do not chase it.
- Multiple reports from the same calendar date (e.g. a morning and evening session) require matching on time, not just date. Use the timings in the email to disambiguate.
- **Cannot tell a night with no rehearsal from a rehearsal whose report never arrived** without reading the show's calendar. Read it, or label the finding unverified.
- **The sweep is only as complete as the folder enumeration**, and it inherits the ROLL CALL's limit exactly: a production living outside the production folders is invisible to it.
- ⚠️ **The multi-production sweep has NEVER run against a second production**, because as of 2026-09-19 no second production has an intake surface. Every rule here is generalized from Big Love. **A session that fires this on Becoming Curious's first report is running it for the first time and should say so.**
- ⚠️ **(v1.2) The CALLS sweep has run ONCE, by hand, on two dates (Sep 19-20).** The noteworthy-chunk criterion was applied retrospectively across the season but only ONE chunk was ever built. **A cold session is running this nearly cold and says so.**
- ⚠️ **(v1.2) It cannot tell a modelling decision from a gap.** The recurring 6:30 PM management call with no event block is almost certainly deliberate. When a "missing block" repeats on nearly every date, treat it as a question for Michael, not a defect.
- 🚫 **(v1.2) It cannot know whether a preliminary call will hold.** Bia sends weekly prelims and same-day finals. Anything built off a prelim is provisional and must say so on its face.

---

## Provenance

Built 2026-09-15 from a live session where Michael walked through the full normalization of the Sep 2 Big Love rehearsal report, then the linking of 5 unlinked notes to their source reports. The methodology correction (use the email source, not timestamps) was Michael's explicit ruling during that session.

The `| reports |` task pattern was discovered at `[BL] | reports |` (task `86ak1p27t`) in Paperwork (BL), Big Love's Breakdowns folder. The pattern is expected to repeat per production.

**v1.1, 2026-09-17**, folded in during a live `/milo` morning wakeup, from one instruction carrying three separate rulings: **the sweep covers every production that rehearsed** (two-surface model: forwards local, instances central) · **the pass RECONCILES as well as creates** (five named mismatch classes, with a denominator) · **the instance is the thing that gets checked off**, which made `Notes Done` a gatekeeper queue rather than a field.

⭐ **Three facts were discovered by running it rather than by specifying it, which is why they are written down:** the report email arrives after midnight and must be keyed on the rehearsal date · the stage manager's typed date line disagrees with her own PDF filename and loses to it · **four of five live productions have no intake surface at all**. That last one is the finding the whole version exists to surface, and no amount of normalizing Big Love would ever have produced it.

**v1.2, 2026-09-19**, folded in during a live `/milo` morning wakeup + email triage session, from Michael's request for a calls sweep and his immediate correction of its genre. Three rulings: **the calls are the same noun as the reports and belong in this hook** · **it is a judgement pass, not a rote parser -- surface the noteworthy chunks** · **noteworthy chunks are internal notes and carry `N/A` on BOTH calendar fields.** Plus a forward-only ruling on the nine historical chunks.

🪦 **The version exists because a parser already did the mechanical half and died unnoticed on Sep 10.** Eight calls accumulated unprocessed. ⭐ **The lesson that outranks everything else in this section: READ THE EXISTING COMMENTS BEFORE PROPOSING A MECHANISM.** This session was one turn from speccing a second parser alongside a stopped one -- the same two-punch-lists defect the DDR hook warns about, arriving in a new container. **A dead automation and a quiet one emit the same signal, so the only way to know is to date its output.**

⚠️ **Recorded and NOT acted on, because it is Michael's to rule:** nine noteworthy chunks passed the criterion earlier in the season and only one has any surface. The heaviest is **Sep 9** -- fall practice with the fight choreographer running in TWO rooms simultaneously, plus two intimacy blocks, in one night, with nothing in ClickUp recording that it happened. Hazard Hawthorne's incident memory is empty; so is the record of the nights most likely to fill it.
