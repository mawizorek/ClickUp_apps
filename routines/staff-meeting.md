# Staff Meeting Close-Out

goal:       Archive today's agenda, transcribe recordings, extract action items, roll the task forward.
target:     `mawizorek/uritp-docs` · `REPO_PAGES/doc-staff-meeting-agenda.md` (archive) + `[Staff Meeting]` task comments (transcriptions)
report-to:  DETAIL → task comment · ROLL-UP → spine

## References

- **Source task:** `[Staff Meeting]` · URITP-2594 · `| Routines | & Recurring`
- **Archive page:** [`mawizorek/uritp-docs/REPO_PAGES/doc-staff-meeting-agenda.md`](https://github.com/mawizorek/uritp-docs/blob/main/REPO_PAGES/doc-staff-meeting-agenda.md)
- **Google Doc (volatile, reused weekly):** [Staff Meeting Agenda](https://docs.google.com/document/d/1j44tmavM8JwiqdpoJ22kPedC_Df__5fBBMnrPYNL3Go/edit)
- **Template format:** `===` tabbed sections per person, `- [ ]` checkboxes per item, `*Nothing for the Group*` tab collects names with nothing to report.

## Trigger

Michael says the meeting is done, uploads a recording to `[Staff Meeting]`, or invokes `/milo` referencing staff meeting close-out.

## Steps

1. **Read the archive page.** Open `REPO_PAGES/doc-staff-meeting-agenda.md` from `uritp-docs` (main). Note the template header format and the most recent dated entry.

2. **Snapshot the agenda.** Read the current agenda from the `[Staff Meeting]` task description. Format it into a new `### <Day>, <Date> { .new-page }` entry matching the template exactly:
   - **New-page flag:** every new entry header MUST include `{ .new-page }` after the date. This renders a visual flag on the published site.
   - One `=== "**Name**"` section per person who has items, with `- [ ]` per item.
   - One `=== "*Nothing for the Group*"` section listing everyone who had nothing.
   - Verbatim content from the agenda. Do not editorialize, reword, or summarize.
   - Insert the new entry directly below the template header block (above all prior entries).
   - Commit to `uritp-docs` main.

3. **Compress recordings.** Raw `.wav` uploads exceed the 25 MB transcription limit. For each new audio attachment:
   - Relay the file into the sandbox.
   - Re-encode: `ffmpeg -i input.wav -ac 1 -b:a 64k output.mp3`
   - Transcribe the compressed file with `transcribe_media` (diarization on).

4. **Post topic threads.** For each distinct topic in the transcript:
   - Post a root comment on the task: `🎙️ TOPIC · Speaker — Subject` with a `Staff Meeting · <Date> · <Time> ET` subheader.
   - Post the transcript text as a threaded reply.
   - Attribute speakers by name where diarization makes it clear. Flag uncertain attribution with `⚠️`.

5. **Extract action items.** Anything that sounds like an assignment, follow-up, or deadline:
   - Link to an existing task if one matches, or flag for Michael to create.
   - Do NOT create long prose comment blocks. Tasks are the artifact, not meeting minutes.

6. **Roll the task forward.**
   - Clear the consumed agenda content from the task description (keep the banner structure, wipe the per-person items).
   - Advance start/due dates to next Tuesday's meeting slot.
   - Set task status back to `on deck`.

7. **Spine.** Post the close-out log line to the spine channel.

## Guardrails

- Never delete older archive entries.
- Never edit the Google Doc directly.
- If a recording is inaudible or ambiguous, flag with `⚠️` and a best-guess; do not invent content.
- If no recording is uploaded, the archive entry stands as agenda-only.
- Student names in sensitive contexts (grades, behavioral notes): keep in task comments only. The archive page is in a public repo.
- The archive lives in `uritp-docs`, NOT `ClickUp_apps`. Do not create or write archive entries in `ClickUp_apps`.
