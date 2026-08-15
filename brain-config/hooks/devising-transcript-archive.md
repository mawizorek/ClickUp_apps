# Devising Transcript Archive · AI Toolkit

**Purpose:** Get a raw interview/session recording out of a person's hands and into `uritp-docs` as a plain timestamped text file, so a devising process has a searchable, versioned transcript archive instead of a pile of WAV files sitting in Dropbox.

**Steward:** Mainstage Milo (`super-agents/mainstage-milo/`) — URITP production ops is his lane. Any agent may run the mechanical steps; Milo owns the convention.

**Mode:** On-demand routine.

**Invocation:** "transcribe this for TIM-D", "add this to the devising transcripts", or any audio drop into a session with a URITP interview/devising recording attached. No slash command yet — natural language trigger only.

**Trigger:** A user hands over an audio recording (interview, devising session, intro session) tied to a URITP production and says it needs to be archived as text, OR the file lives in a `People, Recordings & Transcriptions` style Dropbox folder under a production.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

⚠️ **INDEX-REGISTERED 2026-08-14 (v2).** This hook sat in git but was NOT on the AI Toolkit index for its first ~7 hours, so a cold agent could not route to it: on the second recording of the day (Bill) the agent found no path from "TIM-D transcription" to this file and rebuilt the whole convention from scratch instead of running it. Fixed by adding a dedicated row to the Quick-Scan Trigger Table. **Lesson baked in: authoring a tool is not done until it is on the index. The index IS the routing layer; an unregistered hook is invisible.**

**Established 2026-08-14** by Brain, on request from Michael during the Arline Hansen (Seneca Towers) intro-session transcription.

---

## Coordinates

| Surface | Location |
| --- | --- |
| **Target repo** | `mawizorek/uritp-docs` (PRIVATE — this is why named-resident personal history is safe here; never route these to a public repo) |
| **TIM-D transcript folder** | `production/TIM-D/transcriptions/` |
| **Other productions** | same shape under `production/<CODE>/transcriptions/` — create the folder if the production doesn't have one yet |
| **🔑 SOURCE / NAME GROUND TRUTH (Dropbox)** | the production's `People, Recordings & Transcriptions` folder — for TIM-D: `/PRODUCTIONS/URITP 26-27/2 T.I.M.E. Development PRODUCTION/People, Recordings & Transcriptions/` (Dropbox ns `14299549331`). Each session has a per-subject subfolder (e.g. `8-14-26 (ST) Intro Session/BILL Tegtmeyer/`) holding the `.WAV`, a photo, and an info sheet. |
| **Examples** | `260814_ARLINE.md` (Arline Hansen), `260814_BILL.md` (Bill Tegtmeyer) |

---

## Procedure

1. **Get the audio under the transcription cap.** `transcribe_media` caps at 25MB. Zoom H-series recorders and similar field recorders ship raw 32-bit float WAVs that blow past this in minutes (a 5-minute interview can be 100MB+). Compress first:
 - Preferred: user runs `ffmpeg -i input.wav -ac 1 -b:a 64k compressed.mp3` locally (fast, seconds, no wasm overhead).
 - Fallback: the in-browser [Audio Compressor](https://mawizorek.github.io/ClickUp_apps/audio-compressor/) app (client-side ffmpeg.wasm) if the user has no local ffmpeg. Slower on large files, single-threaded.
2. **Transcribe with timestamps. Diarization is optional and fragile — see the fallback ladder.** These are typically one-on-one interviews (interviewer + subject) captured by a single recorder. Because the file is archived RAW with no speaker labels (step 4), plain `timestamps: true` is sufficient and is the reliable default. **Fallback ladder when a transcription call times out (120s):**
 - a. Try `timestamps: true` on the whole compressed file first.
 - b. **If it times out, SPLIT the audio and transcribe the halves — do NOT just drop to a worse mode.** Use `execute_bash` + `ffmpeg` to cut the file at its midpoint (`-t <half>` for part 1, `-ss <half>` for part 2), transcribe each part, then concatenate. This was proven on Bill's 6:16 file on 2026-08-14: the whole-file call (even diarized) timed out, but two ~3-min halves went through cleanly. Splitting beats degrading. Duration check first: `ffprobe -show_entries format=duration`.
 - c. Only if a split half STILL times out, fall back to a plain transcript (no timestamps) and note the degradation in the commit/PR.
 - Diarization (`diarization: true`) is nice-to-have for readability but times out more often than timestamps-only; it is never required since labels aren't archived. If you want it, run it per-split-half where it succeeds more reliably.
3. 🔑 **NAMES COME FROM THE FOLDER, NOT THE AUDIO. This is a HARD STEP, run it before committing.** The transcription model spells every proper noun phonetically and it WILL be wrong — a subject says "Hanson" but signed the sheet "Hansen," mis-hears her own surname, or the interviewer hears "Helena" for "Halina." **The Dropbox source folder is the authoritative spelling** and it is free to read:
 - The per-subject **subfolder name** (`BILL Tegtmeyer`) and the **photo filename** (`Bill-Tegtmeyer.79.ST.jpg`) are Michael's own labels — treat them as ground truth for the FULL name and the age.
 - ⚠️ These two can themselves disagree (Bill's folder/photo said `Tegtmeyer`, the info-sheet PDF said `Tegmeyer`) — when sources conflict, ASK Michael which is canonical; never silently pick one.
 - ⚠️ The info-sheet PDFs are handwritten scans — their OCR is garbage, so do NOT rely on the PDF body; use the folder/photo filenames.
 - **Apply the correct spelling everywhere the name appears** — the subject's own name AND every OTHER subject they mention (Leroy talks at length about "Helena" who is really `Halina Reszitnyk`; fix it in Leroy's file too so the transcripts cross-reference cleanly).
 - **Correct ONLY names you can ground against the folder.** Place names, employers, schools, etc. that are merely mis-heard and have no folder source (Bill's Kansas college town, Leroy's Florida town / steel mill, Halina's employer) STAY AS TRANSCRIBED — do not invent a spelling. Uncertainty with no ground truth is left alone, not guessed.
4. **Name the file `<YYMMDD>_<SUBJECT_FIRST_NAME_CAPS>.md`**, matching the recording date and the subject's name AS IT APPEARS IN THE SOURCE FOLDER (step 3), not as the audio said it (e.g. 2026-08-14 subject in folder `ARLINE Hansen` → `260814_ARLINE.md`, even though she says "Arlene" on tape; Bill → `260814_BILL.md`). If two subjects share a first name in the same production, disambiguate with last initial (`260814_ARLINEH.md`).
5. **Commit straight text, no frontmatter, no header.** Just the timestamped lines, one blank line between turns, exactly as transcribed — except the folder-grounded name corrections from step 3. Match the shape of `260814_ARLINE.md`.
6. **PR-Merge Workflow applies** (see `GitHub MCP — Operating Standard`): branch → commit → PR → self-merge immediately. Never ask Michael to review/merge a transcript commit. ⚠️ **Do NOT commit straight to `main`** — this was slipped on Bill's file (2026-08-14, committed directly to main, no branch/PR). End state was fine but the workflow was skipped; the ceremony exists so a bad transcription is a single revertable PR.
7. **Report back:** file link + PR link. No transcript text pasted into chat or comments (same spirit as Rule 0 in `meeting-transcript-attribution.md` — the artifact lives in the file, not the conversation).

---

## Guardrails

- **One file per recording.** Do not batch multiple interviews into one commit or one PR — easier to review, easier to revert a single bad transcription.
- **Split before you degrade.** On a timeout, splitting the audio (Procedure 2b) preserves timestamp quality; dropping to a plain no-timestamp transcript is the last resort, not the first fallback.
- **Multiple files do NOT require separate chat sessions.** The friction is the local compression step (user has to run ffmpeg or use the compressor app between each file), not any technical session limit. Any number of files can be processed back-to-back in one sitting once each compressed file is handed over. Expect dozens across a devising process.
- **NAMES are corrected against the folder; everything else is left as heard.** This hook does not paraphrase, tidy, or re-word the transcript — the spoken content stays verbatim. The ONE correction it makes is proper-name spelling grounded in the source folder (Procedure 3). Mis-heard place names / employers with no folder source stay exactly as transcribed; a downstream human working the devising process resolves those. 🚩 This is a deliberate revision of the old v1/v2 "correct nothing" rule — raw phonetic name guesses shipped seven real residents' names wrong on 2026-08-14, and the folder had the right spellings the whole time.
- **Private repo, named people.** These transcripts carry real residents' medical, financial and personal histories. `uritp-docs` is private and that is load-bearing — never route a copy into a public repo, a public channel, or a shipped artifact.

---

## Composes with

- `GitHub MCP — Operating Standard` (PR-Merge Workflow, commit message format).
- `meeting-transcript-attribution.md` — sibling hook for the opposite case (multi-speaker meetings, attributed, posted to ClickUp comments). If a devising transcript later needs per-speaker attribution, that hook is the one to run against the archived file, not this one.
- VIDEO-ANALYSIS skill — the `ffmpeg` extract/split mechanics (audio track extraction, frame sampling) live there; this hook reuses the split technique for the timeout fallback.

---

## Changelog

- **v1 (2026-08-14)** — Established by Brain. Initial scope: single-subject interview/devising recordings → raw timestamped `.md` files in `uritp-docs/production/<CODE>/transcriptions/`. First file: `260814_ARLINE.md` (TIM-D, Seneca Towers).
- **v2 (2026-08-14)** — Registered on the AI Toolkit index (was invisible to cold agents, caused a from-scratch rebuild on the Bill file). Added the split-file transcription fallback (Procedure 2b). Logged the direct-to-`main` commit slip. Added the private-repo/PII guardrail.
- **v3 (2026-08-14)** — Names come from the SOURCE FOLDER, not the audio (Procedure 3, now a hard pre-commit step). The old "correct nothing" rule shipped seven residents' names wrong (Arlene Hanson→Arline Hansen, Tegmeyer→Tegtmeyer, Ryszypnik→Reszitnyk, Helena→Halina in Leroy's file) while the correct spellings sat in the Dropbox `People, Recordings & Transcriptions` folder the whole time. Added that folder as a Coordinates row. Narrowed the no-correction guardrail: folder-grounded NAMES are fixed, un-groundable place/employer names stay as heard. Fixed on-tape example labels (Arline is Hansen not Hanson).
