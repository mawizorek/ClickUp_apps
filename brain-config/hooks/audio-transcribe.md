# Audio Transcribe · AI Toolkit

**Purpose:** Turn any recording (meeting, interview, voice memo, video) into a speaker-labelled, timestamped transcript attached to the task it belongs to, at any length, without hitting the transcriber's size or time limits.

**Steward:** Dev Dexter (`super-agents/dev-dexter/`) owns the mechanics. The mechanics are ownerless: ANY agent runs steps 0-5. Name correction (proper nouns) belongs to the domain owner, resolved through the 🤖 Agent Index `Lane` field (URITP → Mainstage Milo).

**Mode:** On-demand.

**Invocation:** `/transcribe` · "transcribe this" · "transcribe the recording" · "transcribe today's meeting" · any audio or video file handed over with a request to get text out of it.

**Trigger:** An audio/video attachment (wav, mp3, m4a, mp4, mov, webm) on a task, plus a request for its text. This is the ENGINE: `devising-transcript-archive` (TIM-D interviews) and `meeting-transcript-attribution` (comment-chain attribution) both start here when all they have is audio.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-10-14** by Dev Dexter, after two live runs on SPAC Operations Meeting recordings (09-09, 28:29 mp4; 10-14, 16:56 wav).

---

## Why this exists

The built-in transcriber is fine. What fails is how audio gets fed to it: a hard **25MB** file cap and a hard **120s** processing timeout per call, no retry. Before this hook the only written recipe lived inside the TIM-D hook and split files in HALVES, which works for a 6-minute interview and times out on a 30-minute meeting. Michael's ask (2026-10-14): speaker labels by default, and a cold session must be able to run it from this file alone.

---

## Measured limits (do not re-learn these)

- **3-min chunks + diarization: 6/6 passed** (10-14 run). This is the default.
- **5-min chunks + diarization: 5/5 TIMED OUT** (09-09 run). Never.
- **5-min chunks, timestamps only: 10/10 passed.** This is the fallback, not the default.
- A tail chunk under ~3.5 min diarized cleanly on both runs.
- 16 kHz mono 48 kbps MP3 = ~0.36 MB/min. A 30-minute meeting is ~11MB whole, ~1MB per 3-min chunk. Size is never the binding limit after step 1; time is.

---

## Procedure

### 0 · Intake gate

1. **The file must be a TASK attachment, not media pasted inside a comment.** Inline comment uploads are refused by both the sandbox and the transcriber ("Attachment is not unified", 10-14). On that error do NOT retry: ask Michael to drop the file straight onto the task, then continue.
2. **Resolve the participant roster BEFORE attributing anything.** Sources, in order: (a) the invoking message, including the canonical form "the <group> staff was in attendance minus <Name>"; (b) the event task's invite (To/Cc on the forwarded calendar email) and description; (c) prior transcripts in the same recurring chain.
3. **An invite list is who was INVITED, not who ATTENDED.** If the roster is not declared outright, or the audio contradicts it (someone addressed by name who is not on it, someone on it who never speaks, the facilitator speaking about the expected facilitator in the third person), **ASK Michael to confirm the participants**, using buttons where available. Transcription (steps 1-3) proceeds while waiting. **Attribution (step 4) waits for the answer.**

### 1 · Prep (sandbox)

```
ffmpeg -i <input> -vn -ac 1 -ar 16000 -b:a 48k full.mp3
ffmpeg -i full.mp3 -f segment -segment_time 180 -c copy part_%02d.mp3
```

`-vn` drops video, which is most of an mp4's size (236MB → 10MB on 09-09). Copy the parts into the sandbox output dir so each gets an attachment URL the transcriber can read.

### 2 · Transcribe

Fire every chunk in parallel with **diarization ON**. Fallback ladder, per chunk, never for the whole file:

1. 180s diarized times out → re-cut THAT chunk at 90s and retry diarized.
2. Still fails → timestamps-only for that chunk, marked `⚠️ unlabelled` in the stitch header.

Split before you degrade. Never drop to plain text without timestamps.

### 3 · Stitch → the RAW file

Write each chunk's output to its own file **verbatim** (never re-key from memory), then re-base every `[mm:ss]` by `chunk_index × 180` and concatenate in order under a `--- chunk N · mm:ss ---` marker. Header lines name the source file, duration, chunk length, and this warning:

> Speaker letters are LOCAL to each chunk. `A` in chunk 1 is not necessarily `A` in chunk 2, and diarization sometimes merges two voices under one letter.

File: `<YYYY-MM-DD>_<slug>_transcript_speakers-raw.txt`. **The raw file is never edited after this step.** It is the arbiter for every later dispute.

### 4 · Attribute → the NAMED file (roster confirmed only)

Map letters to names **per chunk**, then override per turn where content contradicts the letter. Ladder, stop at first hit (shared with `meeting-transcript-attribution`):

1. Speaker names themselves, or is addressed by name in the turn before.
2. Lane-exclusive content (facilities/building → ops manager; dance load-in → dance PM; theatre season → AD). Domain inference: prefix `⚠️`.
3. Agenda running order from the invite or task description.
4. Same recurring chain: recurring speakers keep recurring subjects.
5. Nothing hit → `⚠️ Unattributed`. Never guess a person into the room.

Known merge patterns (10-14): the facilitator and a faculty member shared one letter inside a chunk; a reply and the next speaker's opener landed on one line. Split the line in the named file and flag it. Nobody outside the confirmed roster gets a turn.

File: `<YYYY-MM-DD>_<slug>_transcript.txt`, lines as `[mm:ss] Name: text`.

### 5 · Deliver

1. Stage both files and promote them onto the SOURCE task as attachments. Never paste transcript text into chat or comments (`meeting-transcript-attribution` Rule 0 applies here too).
2. Chat reply = receipt: the file links, the roster used, the unresolved flags, and action items **with owners only where the speaker is grounded** (no `⚠️`). An item from an inferred speaker is reported as "someone committed to X (speaker unconfirmed)".
3. Proper nouns stay AS HEARD in both files ("Mel Weekend" = Meliora Weekend). Correction is the domain owner's pass, disclosed per `meeting-transcript-attribution` fidelity rules.

---

## Guardrails

- **Verbatim floor.** Steps 3-4 never change words. Attribution adds names and splits merged lines; nothing else.
- **Roster before names.** Unclear participants = ask, not infer. A wrong name on a commitment is worse than no name.
- **Private material routes by content, not by this hook.** TIM-D / devising interviews (named residents' personal histories) go through `devising-transcript-archive` into private `uritp-docs`. Never commit any transcript to a public repo, including this one.
- **The sandbox has no network.** All fetching is through attachment loading; nothing here needs or calls an external service.

---

## Composes with

- `devising-transcript-archive.md`: its Phase 1 runs steps 0-3 here; its Phase 2 (Milo's readable script) reads the raw file.
- `meeting-transcript-attribution.md`: when a meeting exists only as audio, this hook produces the input; that hook threads it into task comments if Michael wants the chain form.
- `secrets-pii-guard.md` before any repo write that touches a transcript.
- VIDEO-ANALYSIS skill for the ffmpeg extract mechanics on video sources.

---

## Scars

- **10-14 · the timestamps-only transcript put the facilitator's words in Michael's mouth.** Without labels, a strike-list commitment the facilitator made to the dance PM was reported to Michael as HIS action item. Speaker labels are the default because of this, and owners are only claimed on grounded speakers.
- **10-14 · the invite said one facilitator, the audio said another.** The voice running the meeting referred to the invite's sender in the third person. Invite = invited, never attended. That is the case the roster-confirm gate exists for.

---

## Changelog

- **v1 (2026-10-14)**: Established by Dev Dexter. 3-min diarized chunks as default, per-chunk fallback ladder, raw/named two-file output, roster-confirm gate, attach-to-source-task delivery. Supersedes the halves ladder in `devising-transcript-archive` for anything over ~6 min.
