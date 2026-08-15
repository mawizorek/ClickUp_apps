# Devising Transcript Archive · AI Toolkit

**Purpose:** Get a raw interview/session recording out of a person's hands and into `uritp-docs` as a plain timestamped text file, so a devising process has a searchable, versioned transcript archive instead of a pile of WAV files sitting in Dropbox.

**Steward:** Mainstage Milo (`super-agents/mainstage-milo/`) — URITP production ops is his lane. Any agent may run the mechanical steps; Milo owns the convention.

**Mode:** On-demand routine.

**Invocation:** "transcribe this for TIM-D", "add this to the devising transcripts", or any audio drop into a session with a URITP interview/devising recording attached. No slash command yet — natural language trigger only.

**Trigger:** A user hands over an audio recording (interview, devising session, intro session) tied to a URITP production and says it needs to be archived as text, OR the file lives in a `People, Recordings & Transcriptions` style Dropbox folder under a production.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

⚠️ **INDEX-REGISTERED 2026-08-14 (v2).** This hook sat in git but was NOT on the AI Toolkit index for its first ~7 hours, so a cold agent could not route to it: on the second recording of the day (Bill Tegmeyer) the agent found no path from "TIM-D transcription" to this file and rebuilt the whole convention from scratch instead of running it. Fixed by adding a dedicated row to the Quick-Scan Trigger Table. **Lesson baked in: authoring a tool is not done until it is on the index. The index IS the routing layer; an unregistered hook is invisible.**

**Established 2026-08-14** by Brain, on request from Michael during the Arlene Hanson (Seneca Towers) intro-session transcription.

---

## Coordinates

| Surface | Location |
| --- | --- |
| **Target repo** | `mawizorek/uritp-docs` (PRIVATE — this is why named-resident personal history is safe here; never route these to a public repo) |
| **TIM-D transcript folder** | `production/TIM-D/transcriptions/` |
| **Other productions** | same shape under `production/<CODE>/transcriptions/` — create the folder if the production doesn't have one yet |
| **Examples** | `260814_ARLINE.md` (Arlene Hanson), `260814_BILL.md` (Bill Tegmeyer) |

---

## Procedure

1. **Get the audio under the transcription cap.** `transcribe_media` caps at 25MB. Zoom H-series recorders and similar field recorders ship raw 32-bit float WAVs that blow past this in minutes (a 5-minute interview can be 100MB+). Compress first:
 - Preferred: user runs `ffmpeg -i input.wav -ac 1 -b:a 64k compressed.mp3` locally (fast, seconds, no wasm overhead).
 - Fallback: the in-browser [Audio Compressor](https://mawizorek.github.io/ClickUp_apps/audio-compressor/) app (client-side ffmpeg.wasm) if the user has no local ffmpeg. Slower on large files, single-threaded.
2. **Transcribe with timestamps. Diarization is optional and fragile — see the fallback ladder.** These are typically one-on-one interviews (interviewer + subject) captured by a single recorder. Because the file is archived RAW with no speaker labels (step 4), plain `timestamps: true` is sufficient and is the reliable default. **Fallback ladder when a transcription call times out (120s):**
 - a. Try `timestamps: true` on the whole compressed file first.
 - b. **If it times out, SPLIT the audio and transcribe the halves — do NOT just drop to a worse mode.** Use `execute_bash` + `ffmpeg` to cut the file at its midpoint (`-t <half>` for part 1, `-ss <half>` for part 2), transcribe each part, then concatenate. This was proven on Bill Tegmeyer's 6:16 file on 2026-08-14: the whole-file call (even diarized) timed out, but two ~3-min halves went through cleanly. Splitting beats degrading. Duration check first: `ffprobe -show_entries format=duration`.
 - c. Only if a split half STILL times out, fall back to a plain transcript (no timestamps) and note the degradation in the commit/PR.
 - Diarization (`diarization: true`) is nice-to-have for readability but times out more often than timestamps-only; it is never required since labels aren't archived. If you want it, run it per-split-half where it succeeds more reliably.
3. **Do not attribute speakers or edit the transcript.** This hook archives the RAW timestamped output verbatim, question and answer turns interleaved with no labels. This is deliberate and different from `meeting-transcript-attribution.md` (which is for multi-person meetings posted as ClickUp task comments with speaker attribution). A devising/interview transcript is a source document, not a meeting record — it gets attributed and worked later, by a human, in the devising process itself.
4. **Name the file `<YYMMDD>_<SUBJECT_FIRST_NAME_CAPS>.md`**, matching the recording date and the subject's name as it appears in the source folder (e.g. a recording dated 2026-08-14 for a subject named Arlene → `260814_ARLINE.md`; Bill → `260814_BILL.md`). If two subjects share a first name in the same production, disambiguate with last initial (`260814_ARLINEH.md`).
5. **Commit straight text, no frontmatter, no header.** Just the timestamped lines, one blank line between turns, exactly as transcribed. Match the shape of `260814_ARLINE.md`.
6. **PR-Merge Workflow applies** (see `GitHub MCP — Operating Standard`): branch → commit → PR → self-merge immediately. Never ask Michael to review/merge a transcript commit. ⚠️ **Do NOT commit straight to `main`** — this was slipped on Bill's file (2026-08-14, committed directly to main, no branch/PR). End state was fine but the workflow was skipped; the ceremony exists so a bad transcription is a single revertable PR.
7. **Report back:** file link + PR link. No transcript text pasted into chat or comments (same spirit as Rule 0 in `meeting-transcript-attribution.md` — the artifact lives in the file, not the conversation).

---

## Guardrails

- **One file per recording.** Do not batch multiple interviews into one commit or one PR — easier to review, easier to revert a single bad transcription.
- **Split before you degrade.** On a timeout, splitting the audio (Procedure 2b) preserves timestamp quality; dropping to a plain no-timestamp transcript is the last resort, not the first fallback.
- **Multiple files do NOT require separate chat sessions.** The friction is the local compression step (user has to run ffmpeg or use the compressor app between each file), not any technical session limit. Any number of files can be processed back-to-back in one sitting once each compressed file is handed over. Expect dozens across a devising process.
- **This hook does not correct or improve the transcript.** Garbled proper nouns, mis-heard words, etc. stay as the model transcribed them. Correction is downstream, in the devising process, by people who know the source material — see `meeting-transcript-attribution.md` Pass 2 for the pattern this deliberately does NOT apply here.
- **Private repo, named people.** These transcripts carry real residents' medical, financial and personal histories. `uritp-docs` is private and that is load-bearing — never route a copy into a public repo, a public channel, or a shipped artifact.

---

## Composes with

- `GitHub MCP — Operating Standard` (PR-Merge Workflow, commit message format).
- `meeting-transcript-attribution.md` — sibling hook for the opposite case (multi-speaker meetings, attributed, posted to ClickUp comments). If a devising transcript later needs per-speaker attribution, that hook is the one to run against the archived file, not this one.
- VIDEO-ANALYSIS skill — the `ffmpeg` extract/split mechanics (audio track extraction, frame sampling) live there; this hook reuses the split technique for the timeout fallback.

---

## Changelog

- **v1 (2026-08-14)** — Established by Brain. Initial scope: single-subject interview/devising recordings → raw timestamped `.md` files in `uritp-docs/production/<CODE>/transcriptions/`. First file: `260814_ARLINE.md` (TIM-D, Arlene Hanson, Seneca Towers).
- **v2 (2026-08-14)** — Registered on the AI Toolkit index (was invisible to cold agents, caused a from-scratch rebuild on the Bill Tegmeyer file). Added the split-file transcription fallback (Procedure 2b, proven on Bill's 6:16 file). Logged the direct-to-`main` commit slip on Bill's file. Added the private-repo/PII guardrail and second example (`260814_BILL.md`).
