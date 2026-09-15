---
id: report-normalization
kind: hook
version: 1.0
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

1. **BEFORE the briefing blocks**, scan for unprocessed reports.
2. Process them silently (this is a WRITE, authorized same as the drill batch).
3. In the briefing output, report what was processed: `Processed N reports, created M notes (links).`
4. Flag any emails that could not be matched to a report task.
5. Flag any reports with `No Notes? = true` that unexpectedly have notes in the email (this means the stage manager's "no notes" flag was wrong).

This block appears BEFORE the Gatekeeper block in the briefing output, because it is a maintenance pass, not a finding.

---

## Authority

**Three writes, all narrow:**
1. Updating custom fields on existing Production Reports tasks (normalization).
2. Creating Production Notes tasks in the Production Notes list.
3. Setting the REPORT relationship on the created notes.

NEVER: delete a report, change a report's status to Closed, modify the `| reports |` task or its comments, touch the email content, or mark Notes Done (that is Michael's confirmation that the notes are correct).

---

## Known limits

- Cannot read PDF attachments on the `| reports |` task reliably (the email comment text is the working source, not the PDF). If the comment text is truncated or garbled, flag it rather than guessing.
- The "rename when Notes updated" automation is a black box. If it does not fire, the note title stays as created. That is fine; do not chase it.
- Multiple reports from the same calendar date (e.g. a morning and evening session) require matching on time, not just date. Use the timings in the email to disambiguate.
- This hook processes one production at a time. The morning briefing should loop across all active productions that have a `| reports |` task.

---

## Provenance

Built 2026-09-15 from a live session where Michael walked through the full normalization of the Sep 2 Big Love rehearsal report, then the linking of 5 unlinked notes to their source reports. The methodology correction (use the email source, not timestamps) was Michael's explicit ruling during that session.

The `| reports |` task pattern was discovered at `[BL] | reports |` (task `86ak1p27t`) in Paperwork (BL), Big Love's Breakdowns folder. The pattern is expected to repeat per production.
