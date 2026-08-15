# Devising Transcript Archive · AI Toolkit

**Purpose:** Get an interview/session recording out of a person's hands and into `uritp-docs` as (1) a verbatim raw transcript and (2) a clean readable rendering, so a devising process has both a searchable source-of-record AND a usable document, instead of a pile of WAV files sitting in Dropbox.

**Steward:** Mainstage Milo (`super-agents/mainstage-milo/`) — URITP production ops is his lane. Phase 1 (raw) is mechanical and ANY agent may run it; **Phase 2 (readable) is Milo's** — the name-grounding + rendering is domain work.

**Mode:** On-demand routine, TWO PHASES (see below).

**Invocation:** "transcribe this for TIM-D", "add this to the devising transcripts", or any audio drop into a session with a URITP interview/devising recording attached. No slash command yet — natural language trigger only.

**Trigger:** A user hands over an audio recording (interview, devising session, intro session) tied to a URITP production and says it needs to be archived as text, OR the file lives in a `People, Recordings & Transcriptions` style Dropbox folder under a production.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

⚠️ **INDEX-REGISTERED 2026-08-14 (v2).** This hook sat in git but was NOT on the AI Toolkit index for its first ~7 hours, so a cold agent could not route to it and rebuilt the convention from scratch. The index IS the routing layer; an unregistered hook is invisible. Authoring a tool is not done until it is on the index.

**Established 2026-08-14** by Brain, during the Arline Hansen (Seneca Towers) intro-session transcription.

---

## The two-phase model (v4 — read this first)

Fidelity is guaranteed MECHANICALLY, not by asking the model to "be faithful." The split is the guarantee:

| Phase | File | Who | What it is |
| --- | --- | --- | --- |
| **1 · RAW** | `<YYMMDD>_<NAME>.txt` | ANY agent | The `transcribe_media` output committed VERBATIM. No name fixes, no reflow, no frontmatter, no attribution. Source-of-record. **This phase is complete on its own** — commit it and the workflow for that recording is done. |
| **2 · READABLE** | `<YYMMDD>_<NAME>.md` | **Milo** (seated separately) | A clean, attributed, HTML-renderable rendering BUILT FROM the `.txt`. Folder-grounded name fixes + speaker labels + simple frontmatter applied HERE, never in Phase 1. |

**Why two phases:** the biggest source of "liberties" is one agent transcribing AND cleaning in the same pass — it silently smooths grammar, drops false starts, guesses names. Freezing the verbatim `.txt` FIRST means every later edit is diffable against an immutable source. Phase 2 is allowed to make it readable precisely because Phase 1 preserved the truth.

---

## Coordinates

| Surface | Location |
| --- | --- |
| **Target repo** | `mawizorek/uritp-docs` (PRIVATE — why named-resident personal history is safe here; never route these to a public repo) |
| **TIM-D transcript folder** | `production/TIM-D/transcriptions/` |
| **Other productions** | same shape under `production/<CODE>/transcriptions/` — create the folder if the production doesn't have one yet |
| **🔑 SOURCE / NAME GROUND TRUTH (Dropbox)** | the production's `People, Recordings & Transcriptions` folder — for TIM-D: `/PRODUCTIONS/URITP 26-27/2 T.I.M.E. Development PRODUCTION/People, Recordings & Transcriptions/` (Dropbox ns `14299549331`). Each session has a per-subject subfolder (e.g. `8-14-26 (ST) Intro Session/BILL Tegtmeyer/`) holding the `.WAV`, a photo, and an info sheet. **New audio to process lands here** — this is the folder a cold session pulls FROM. |

---

## PHASE 1 — RAW (`.txt`), any agent

1. **Get the audio under the transcription cap.** `transcribe_media` caps at 25MB. Zoom H-series recorders ship raw 32-bit float WAVs that blow past this in minutes. Compress first: `ffmpeg -i input.wav -ac 1 -b:a 64k compressed.mp3` locally, or the in-browser [Audio Compressor](https://mawizorek.github.io/ClickUp_apps/audio-compressor/) app (client-side ffmpeg.wasm) as fallback.
2. **Transcribe with timestamps.** Plain `timestamps: true` is the reliable default. **Fallback ladder on a 120s timeout:** (a) whole file first; (b) if it times out, SPLIT the audio and transcribe halves — `ffprobe` for duration, `ffmpeg -t <half>` / `-ss <half>`, transcribe each, concatenate (proven on Bill's 6:16 file: whole-file timed out, two ~3-min halves went through); (c) only if a split half STILL times out, drop to a plain no-timestamp transcript and note the degradation. Splitting beats degrading. Diarization is optional and times out more often; never required since Phase 1 archives no labels.
3. **Commit the tool output VERBATIM.** 🔒 This is the fidelity guarantee. Paste `transcribe_media`'s output exactly as returned — one `[mm:ss]` segment per line, no reflow, no merging into paragraphs, no name fixes, no attribution, no frontmatter, no header. **Never re-key or reconstruct it from memory** — retyping is where cleanup sneaks in. If you split in 2b, concatenate the parts in order and nothing else. The committed `.txt` must equal the tool output.
4. **File name `<YYMMDD>_<NAME>.txt`** — `<NAME>` = subject FIRST name in caps, spelled AS IN THE SOURCE FOLDER (see 🔑 below), e.g. `260814_BILL.txt`. Same-first-name collision in one production → add last initial (`260814_ARLINEH.txt`).
5. **Commit via PR-Merge** (branch → commit → PR → self-merge; NEVER straight to `main`). One recording per PR. Report file + PR link, no transcript text in chat.

**Phase 1 done = that recording is archived.** Phase 2 can happen now, later, or in a separate session.

---

## PHASE 2 — READABLE (`.md`), seat Milo

Builds the human-facing document FROM the frozen `.txt`. Milo owns this pass.

6. 🔑 **NAMES COME FROM THE FOLDER, NOT THE AUDIO.** The transcription spells every proper noun phonetically and it WILL be wrong. The Dropbox source folder is authoritative and free to read:
 - The per-subject **subfolder name** (`BILL Tegtmeyer`) + the **photo filename** (`Bill-Tegtmeyer.79.ST.jpg`) are Michael's own labels — ground truth for the FULL name and the age.
 - ⚠️ Folder/photo can disagree with the info-sheet PDF (Bill: folder `Tegtmeyer` vs PDF `Tegmeyer`) — on conflict ASK Michael, never silently pick. The info-sheet PDFs are handwritten scans; their OCR is garbage, do not trust the PDF body.
 - **Apply the correct spelling everywhere the name appears** — the subject AND every other subject they mention (Leroy's "Helena" is really `Halina Reszitnyk`; fix it in Leroy's `.md` too so files cross-reference).
 - **Correct ONLY names groundable against the folder.** Mis-heard place names / employers / schools with no folder source (Bill's Kansas college town, Leroy's Florida town / steel mill, Halina's employer) STAY AS TRANSCRIBED — do not invent a spelling. Uncertainty with no ground truth is left alone.
7. **Render into our own simple template** (deliberately NOT the Otter export format — keep it lean, HTML-renderable via the standard frontmatter→render pipeline). Frontmatter block then a readable body:

```
---
subject: Bill Tegtmeyer
age: 79
recording_date: 2026-08-14
session: ST Intro Session
location: Seneca Towers
production: TIM-D (T.I.M.E. Development)
source_audio: 260814_123200_TrLR.WAV
raw_transcript: 260814_BILL.txt
---

# Bill Tegtmeyer — TIM-D Intro Session

**Q:** <interviewer question, lightly cleaned for readability>

**Bill:** <subject answer — words verbatim from the .txt, merged into readable prose, false starts may be trimmed for flow>

...
```

 - Speaker labels: `**Q:**` for the interviewer, the subject's first name for answers. Two-voice interviews only; if a third voice appears, label by folder name or `**Q2:**`.
 - Phase 2 MAY merge segments into readable paragraphs and lightly trim filler FOR READABILITY — that is the point of it being separate from the `.txt`. It may NOT change meaning, add words, or invent content. The `.txt` remains the arbiter; anything ambiguous, defer to it.
 - Keep the frontmatter lean. Omit fields you can't ground (don't invent an interviewer name). `raw_transcript` MUST point at the Phase 1 `.txt` so the pair stays linked.
8. **File name `<YYMMDD>_<NAME>.md`** — same stem as the `.txt`, `.md` extension. Commit via PR-Merge, never straight to `main`. Report file + PR link.

---

## Guardrails

- **Phase 1 is verbatim, full stop.** No paraphrase, no reflow, no name fixes, no frontmatter. If the `.txt` isn't a faithful copy of the tool output, Phase 1 failed.
- **All corrections and rendering live in Phase 2**, and even there: NAMES are folder-grounded, everything else stays as heard. Un-groundable place/employer names are never guessed.
- **One recording per PR**, each phase its own commit — easier to review, easier to revert one bad transcription.
- **Split before you degrade** on a timeout (Phase 1, step 2b).
- **Multiple files do NOT require separate chat sessions.** Process dozens back-to-back once each compressed file is handed over. Only friction is the local compression step.
- **Private repo, named people.** Real residents' medical/financial/personal histories. `uritp-docs` is private and load-bearing — never route a copy into a public repo, a public channel, or a shipped artifact. Never paste transcript text into chat/comments (the artifact lives in the file).

---

## Composes with

- `GitHub MCP — Operating Standard` (PR-Merge Workflow, commit message format).
- `meeting-transcript-attribution.md` — sibling hook for multi-speaker MEETINGS (attributed, posted to ClickUp comments). Different case: that attributes speakers in a meeting record; this archives a one-on-one interview as a source document + readable render.
- VIDEO-ANALYSIS skill — the `ffmpeg` extract/split mechanics; this hook reuses the split technique for the timeout fallback.

---

## Changelog

- **v1 (2026-08-14)** — Established. Single-subject recordings → raw timestamped `.md` in `uritp-docs/production/<CODE>/transcriptions/`. First file: `260814_ARLINE.md` (TIM-D, Seneca Towers).
- **v2 (2026-08-14)** — Registered on the AI Toolkit index. Added the split-file transcription fallback. Logged the direct-to-`main` commit slip. Added the private-repo/PII guardrail.
- **v3 (2026-08-14)** — Names come from the SOURCE FOLDER, not the audio (hard pre-commit step). Old "correct nothing" rule had shipped seven residents' names wrong while the folder held the right spellings. Narrowed no-correction to: folder-grounded names fixed, un-groundable places left as heard.
- **v4 (2026-08-15)** — **Split into two phases** on Michael's design. Phase 1 `<YYMMDD>_<NAME>.txt` = verbatim tool output, any agent, the fidelity guarantee (commit the output, never re-key it). Phase 2 `<YYMMDD>_<NAME>.md` = readable, Milo-seated, folder-grounded name fixes + speaker attribution + our own simple HTML-renderable frontmatter template (NOT the Otter format). This kills the "transcribe-and-clean-in-one-pass takes liberties" failure mechanically: the `.txt` is frozen before anything is cleaned. Naming convention changed `.md`-only → `.txt` (raw) + `.md` (readable) as a linked pair.
