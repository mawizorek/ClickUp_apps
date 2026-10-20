# Staff Meeting Close-Out

> Procedure Brain runs after each Tuesday staff meeting to archive the agenda, process recordings, and leave the task clean for next week.
>
> **Source task:** `[Staff Meeting]` · URITP-2594
> **Archive page:** [`REPO_PAGES/doc-staff-meeting-agenda.md`](../REPO_PAGES/doc-staff-meeting-agenda.md)
> **Google Doc (volatile, reused weekly):** [Staff Meeting Agenda](https://docs.google.com/document/d/1j44tmavM8JwiqdpoJ22kPedC_Df__5fBBMnrPYNL3Go/edit)

## Close-Out Procedure

Trigger: Michael says the meeting is done, or uploads a recording to `[Staff Meeting]`.

1. **Snapshot the agenda.** Copy the current agenda from the task description verbatim into a new dated entry at the top of `REPO_PAGES/doc-staff-meeting-agenda.md`. Preserve the person-by-person format exactly.
2. **Transcribe recordings.** For each new `.wav` / audio attachment on the task:
   - Transcribe using `transcribe_media`.
   - Post each distinct topic as a threaded comment on the task, formatted: `🎙️ TOPIC · Speaker — Subject` with the date/time header, transcript in the reply.
3. **Extract action items.** Anything that sounds like an assignment, follow-up, or deadline becomes a linked task (or gets linked to an existing one). No prose summaries, no 1000-line comment blocks.
4. **Update the archive entry.** Add a compact `Transcription summary` bullet list under the agenda snapshot in the archive page (what was discussed, decisions, flags). Link to action-item tasks where they exist.
5. **Roll the task forward.** Clear the consumed agenda content from the task description (keep the banner structure, wipe the per-person items). Advance start/due dates to next Tuesday's meeting slot.
6. **Mark status.** Set task status back to `on deck` for the next occurrence.

## Guardrails

- Never delete older archive entries.
- Never edit the Google Doc directly.
- If a recording is inaudible or ambiguous, flag with `⚠️` and a best-guess; do not invent content.
- If no recording is uploaded, the archive entry stands as agenda-only (no transcription summary).
- Student names in sensitive contexts (grades, behavioral notes): keep in task comments, do NOT put in the archive page. That file is in a public repo.
