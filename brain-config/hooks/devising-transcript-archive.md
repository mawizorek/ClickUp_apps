# Devising Transcript Archive · AI Toolkit

**Purpose:** Get a raw interview/session recording out of a person's hands and into `uritp-docs` as a plain timestamped text file, so a devising process has a searchable, versioned transcript archive instead of a pile of WAV files sitting in Dropbox.

**Steward:** Mainstage Milo (`super-agents/mainstage-milo/`) — URITP production ops is his lane. Any agent may run the mechanical steps; Milo owns the convention.

**Mode:** On-demand routine.

**Invocation:** "transcribe this for TIM-D", "add this to the devising transcripts", or any audio drop into a session with a URITP interview/devising recording attached. No slash command yet — natural language trigger only.

**Trigger:** A user hands over an audio recording (interview, devising session, intro session) tied to a URITP production and says it needs to be archived as text, OR the file lives in a `People, Recordings & Transcriptions` style Dropbox folder under a production.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-08-14** by Brain, on request from Michael during the Arlene Hanson (Seneca Towers) intro-session transcription.

---

## Coordinates

| Surface | Location |
| --- | --- |
| **Target repo** | `mawizorek/uritp-docs` |
| **TIM-D transcript folder** | `production/TIM-D/transcriptions/` |
| **Other productions** | same shape under `production/<CODE>/transcriptions/` — create the folder if the production doesn't have one yet |
| **First example** | `production/TIM-D/transcriptions/260814_ARLINE.md` |

---

## Procedure

1. **Get the audio under the transcription cap.** `transcribe_media` caps at 25MB. Zoom H-series recorders and similar field recorders ship raw 32-bit float WAVs that blow past this in minutes (a 5-minute interview can be 100MB+). Compress first:
 - Preferred: user runs `ffmpeg -i input.wav -ac 1 -b:a 64k compressed.mp3` locally (fast, seconds, no wasm overhead).
 - Fallback: the in-browser [Audio Compressor](https://mawizorek.github.io/ClickUp_apps/audio-compressor/) app (client-side ffmpeg.wasm) if the user has no local ffmpeg. Slower on large files, single-threaded.
2. **Transcribe with timestamps, not diarization.** These are typically one-on-one interviews (interviewer + subject) captured by a single recorder. Diarization has repeatedly timed out (120s) on ~5-minute compressed files in practice; plain `timestamps: true` succeeds reliably and is sufficient since the file is archived RAW (see step 4 — no speaker labels are added at this stage).
3. **Do not attribute speakers or edit the transcript.** This hook archives the RAW timestamped output verbatim, question and answer turns interleaved with no labels. This is deliberate and different from `meeting-transcript-attribution.md` (which is for multi-person meetings posted as ClickUp task comments with speaker attribution). A devising/interview transcript is a source document, not a meeting record — it gets attributed and worked later, by a human, in the devising process itself.
4. **Name the file `<YYMMDD>_<SUBJECT_FIRST_NAME_CAPS>.md`**, matching the recording date and the subject's name as it appears in the source folder (e.g. a recording dated 2026-08-14 for a subject named Arlene → `260814_ARLINE.md`). If two subjects share a first name in the same production, disambiguate with last initial (`260814_ARLINEH.md`).
5. **Commit straight text, no frontmatter, no header.** Just the timestamped lines, one blank line between turns, exactly as transcribed. Match the shape of `260814_ARLINE.md`.
6. **PR-Merge Workflow applies** (see `GitHub MCP — Operating Standard`): branch → commit → PR → self-merge immediately. Never ask Michael to review/merge a transcript commit.
7. **Report back:** file link + PR link. No transcript text pasted into chat or comments (same spirit as Rule 0 in `meeting-transcript-attribution.md` — the artifact lives in the file, not the conversation).

---

## Guardrails

- **One file per recording.** Do not batch multiple interviews into one commit or one PR — easier to review, easier to revert a single bad transcription.
- **No forced diarization retries.** If timestamps-only also times out, fall back to a plain transcript (no timestamps) rather than burning repeated attempts — see `transcribe_media` timeout behavior. Note the degradation in the PR description.
- **Multiple files do NOT require separate chat sessions.** The friction is the local compression step (user has to run ffmpeg or use the compressor app between each file), not any technical session limit. Any number of files can be processed back-to-back in one sitting once each compressed file is handed over.
- **This hook does not correct or improve the transcript.** Garbled proper nouns, mis-heard words, etc. stay as the model transcribed them. Correction is downstream, in the devising process, by people who know the source material — see `meeting-transcript-attribution.md` Pass 2 for the pattern this deliberately does NOT apply here.

---

## Composes with

- `GitHub MCP — Operating Standard` (PR-Merge Workflow, commit message format).
- `meeting-transcript-attribution.md` — sibling hook for the opposite case (multi-speaker meetings, attributed, posted to ClickUp comments). If a devising transcript later needs per-speaker attribution, that hook is the one to run against the archived file, not this one.

---

## Changelog

- **v1 (2026-08-14)** — Established by Brain. Initial scope: single-subject interview/devising recordings → raw timestamped `.md` files in `uritp-docs/production/<CODE>/transcriptions/`. First file: `260814_ARLINE.md` (TIM-D, Arlene Hanson, Seneca Towers).
