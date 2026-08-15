# Devising Transcript Archive · AI Toolkit

**Purpose:** Get an interview/session recording out of a person's hands and into `uritp-docs` as (1) a verbatim raw transcript and (2) a clean, readable SCRIPT, so a devising process has both a searchable source-of-record AND a usable document, instead of a pile of WAV files sitting in Dropbox.

**Steward:** Mainstage Milo (`super-agents/mainstage-milo/`) — URITP production ops is his lane. Phase 1 (raw) is mechanical and ANY agent may run it; **Phase 2 (script) is Milo's** — the proper-noun grounding + rendering is domain work.

**Mode:** On-demand routine, TWO PHASES (see below).

**Invocation:** "transcribe this for TIM-D", "add this to the devising transcripts", or any audio drop into a session with a URITP interview/devising recording attached. No slash command yet — natural language trigger only.

**Trigger:** A user hands over an audio recording (interview, devising session, intro session) tied to a URITP production and says it needs to be archived as text, OR the file lives in a `People, Recordings & Transcriptions` style Dropbox folder under a production.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

⚠️ **INDEX-REGISTERED 2026-08-14 (v2).** This hook sat in git but was NOT on the AI Toolkit index for its first ~7 hours, so a cold agent could not route to it and rebuilt the convention from scratch. The index IS the routing layer; an unregistered hook is invisible. Authoring a tool is not done until it is on the index.

**Established 2026-08-14** by Brain, during the Arline Hansen (Seneca Towers) intro-session transcription.

---

## The two-phase model (v4 — read this first)

Fidelity is guaranteed MECHANICALLY, not by asking the model to "be faithful." The split is the guarantee — and it is ALSO what lets Phase 2 be genuinely readable:

| Phase | File | Who | What it is |
| --- | --- | --- | --- |
| **1 · RAW** | `<YYMMDD>_<NAME>.txt` | ANY agent | The `transcribe_media` output committed VERBATIM. Literal `[mm:ss]` segments, no corrections, no reflow, no attribution, no frontmatter. The immutable source-of-record. **Complete on its own.** |
| **2 · SCRIPT** | `<YYMMDD>_<NAME>.md` | **Milo** (seated separately) | A clean, readable SCRIPT built FROM the `.txt`: speaker-attributed, grouped into complete sentences/turns, proper nouns corrected, frontmatter + keywords. HTML-renderable. |

**Why two phases:** the `.txt` is the verbatim truth, frozen first and diffable forever. BECAUSE that exists, Phase 2 is free to be readable — attribute speakers, join fragmented timestamp lines into whole sentences — without anyone losing the literal record. The fidelity lives in the `.txt`; the readability lives in the `.md`.

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
2. **Transcribe with timestamps.** Plain `timestamps: true` is the reliable default. **Fallback ladder on a 120s timeout:** (a) whole file first; (b) if it times out, SPLIT the audio and transcribe halves — `ffprobe` for duration, `ffmpeg -t <half>` / `-ss <half>`, transcribe each, concatenate (proven on Bill's 6:16 file: whole-file timed out, two ~3-min halves went through); (c) only if a split half STILL times out, drop to a plain no-timestamp transcript and note the degradation. Splitting beats degrading. Diarization is optional and times out more often; never required.
3. **Commit the tool output VERBATIM.** 🔒 This is the fidelity guarantee. Paste `transcribe_media`'s output exactly as returned — one `[mm:ss]` segment per line, no reflow, no merging, no corrections, no attribution, no frontmatter, no header. **Never re-key or reconstruct it from memory.** If you split in 2b, concatenate the parts in order and nothing else. The committed `.txt` must equal the tool output.
4. **File name `<YYMMDD>_<NAME>.txt`** — `<NAME>` = subject FIRST name in caps, spelled AS IN THE SOURCE FOLDER (see 🔑 below), e.g. `260814_BILL.txt`. Same-first-name collision in one production → add last initial (`260814_ARLINEH.txt`).
5. **Commit via PR-Merge** (branch → commit → PR → self-merge; NEVER straight to `main`). One recording per PR. Report file + PR link, no transcript text in chat.

**Phase 1 done = that recording is archived.** Phase 2 can happen now, later, or in a separate session.

---

## PHASE 2 — READABLE SCRIPT (`.md`), seat Milo

Builds the human-facing SCRIPT FROM the frozen `.txt`. Milo owns this pass. Two jobs: correct the proper nouns (step 6), then render as a readable script (step 7).

6. **CORRECT THE PROPER NOUNS — NAMES *and* LOCATIONS.** The transcription spells every proper noun phonetically and it WILL be wrong ("Arundelcoit" for Irondequoit, "Ryszypnik" for Reszitnyk, "Bonnefie" for Bonifay). Fix the ones you can identify, in tiers of confidence:
 - **Tier 1 — NAMES, folder-grounded (authoritative).** The per-subject **subfolder name** (`BILL Tegtmeyer`) + the **photo filename** (`Bill-Tegtmeyer.79.ST.jpg`) are Michael's own labels — ground truth for the FULL name and the age. Apply the correct spelling EVERYWHERE the name appears, including OTHER subjects mentioned (Leroy's "Helena" is really `Halina Reszitnyk`; fix it in Leroy's `.md` too). ⚠️ Folder/photo can disagree with the info-sheet PDF (Bill: folder `Tegtmeyer` vs PDF `Tegmeyer`) — on conflict ASK Michael, never silently pick. Info-sheet PDFs are handwritten scans; OCR is garbage, don't trust the PDF body.
 - **Tier 2 — LOCATIONS & identifiable proper nouns (correct when confident).** Real, recognizable places and institutions get their correct spelling: local geography (Irondequoit, Owego, Rochester, Seneca Towers, Highland Hospital, Sullivan Street), towns, schools, employers, well-known orgs. Use Rochester/URITP context. **The bar is CONFIDENT IDENTIFICATION** — "Arundelcoit" → Irondequoit is obvious; correct it.
 - **Tier 3 — genuinely unidentifiable, LEAVE AS HEARD + flag.** A garbled employer (Halina's "B4ments") or an unverifiable name (Leroy's "Fodler Seiberg") stays verbatim and is noted in the PR body as unresolved. **Never invent a spelling to look finished.**
7. **RENDER AS A READABLE SCRIPT — this is the point of Phase 2 (v7).** The `.txt` is the literal record; the `.md` is the readable one. Turn the fragmented timestamped segments into a clean, SIMPLE two-person script:
 - **Attribute every turn to a speaker** by name from `Participants` — `**Nigel:**` (interviewer) and `**<Subject>:**` (e.g. `**Arline:**`). Two voices; if a clear third voice appears, label it or `**Unknown:**`, never guess a name.
 - **Group into COMPLETE SENTENCES / whole turns.** Join the choppy per-timestamp fragments into readable sentences and merge consecutive fragments from the same speaker into one turn. This is a light clean-up for readability: fix obvious run-together fragments and false-start stutters into flowing sentences. **You may drop pure filler ("um," a repeated false start) and fix punctuation/capitalization — but NEVER change words, add content, paraphrase meaning, or reorder.** When in doubt, the `.txt` wins.
 - **Timestamp lightly, at the START of each speaker turn only** — `**Arline:** [00:29] I was born in a town called Owego...` — an anchor back to the audio, not one per line. Keep it SIMPLE; don't clutter every sentence with a timestamp.
 - Keep it a script, not prose: one speaker turn per block, blank line between turns.
8. **Render into our own template** (deliberately NOT the Otter export format — lean, HTML-renderable). EXACT shape (LOCKED, Michael 2026-08-15):

```
---
title: Arline intro, 14 Aug 2026
id: transcription-260814-arline
type: page
status: public
nav: hidden
revised: 15 Aug 2026
keywords: [Arline Hansen, Nigel Maister, Owego, Rochester, Seneca Towers, Gleason, Ferrell]
---

Location: Seneca Towers
Participants: Nigel, Arline

**Nigel:** [00:00] Now it's recording.

**Arline:** I'm an idiot, what can I say.

**Nigel:** No, you're not. You're handling a lot.

**Arline:** [00:18] Yeah, but I should know how to speak... So, my name is Arline Hansen, and I'm 85. I was born in a town called Owego, on the Pennsylvania–New York border. There were farms all around me.
```

 - **Frontmatter fields, all required, in this order:**
   - `title:` — `<Subject first name> intro, <D Mon YYYY>` (e.g. `Arline intro, 14 Aug 2026`). Human-readable date, no leading zero on the day.
   - `id:` — `transcription-<YYMMDD>-<name>` (name lowercase, folder-grounded spelling; matches the file stem; last-initial disambiguation carries over → `transcription-260814-arlineh`).
   - `type: page` · `status: public` · `nav: hidden` — constants, do not vary.
   - `revised:` — the date this `.md` was last rendered/edited, `D Mon YYYY`.
   - `keywords:` — inline `[...]` list of EVERY proper noun edited OR confirmed in Phase 2 (step 6): subject + interviewer full names, every corrected/verified place, school, employer, org. Search index + audit trail of what Phase 2 touched. People → places → orgs. Omit Tier-3 unresolved terms. If it's in the body, it's in the list.
 - **Then a blank line, then:** `Location: <venue>` and `Participants: <interviewer>, <subject>`. TIM-D interviewer is **Nigel** (Nigel Maister — the info-sheet contact); confirm per session, never hardcode blindly. Subject folder-grounded.
 - **Then a blank line, then the SCRIPT body** per step 7 — speaker-attributed, sentence-grouped turns, light turn-start timestamps.
 - Omit nothing from the frontmatter. If the interviewer can't be confirmed, still attribute the subject's turns and label the other voice `**Interviewer:**`, and FLAG it — never invent a name.
9. **File name `<YYMMDD>_<NAME>.md`** — same stem as the `.txt`, `.md` extension. Commit via PR-Merge, never straight to `main`. Report file + PR link, and list any Tier-3 unresolved proper nouns in the PR body.

---

## Guardrails

- **Phase 1 is verbatim, full stop.** Literal `[mm:ss]` segments, no corrections, no reflow, no attribution, no frontmatter. If the `.txt` isn't a faithful copy of the tool output, Phase 1 failed. **All readability lives in Phase 2** — the `.txt` never gets a speaker label or a joined sentence.
- **Phase 2 is a readable SCRIPT, but the WORDS are still the subject's.** Attribute speakers, join fragments into whole sentences, drop pure filler, fix punctuation — but NEVER change words, add content, paraphrase, or reorder. Correct proper nouns per the tiers. The `.txt` is the arbiter for any dispute; a reader must be able to diff the `.md` against it and find only: speaker labels, sentence-joining, filler removal, punctuation, and grounded proper-noun fixes.
- **Everything corrected or confirmed becomes a keyword.** The `keywords:` list is both the search index and the record of what Phase 2 changed.
- **One recording per PR**, each phase its own commit. **Split before you degrade** on a timeout (Phase 1, 2b).
- **Multiple files do NOT require separate chat sessions.** Process dozens back-to-back once each compressed file is handed over.
- **Private repo, named people.** Real residents' medical/financial/personal histories. `uritp-docs` is private and load-bearing — never route a copy into a public repo, a public channel, or a shipped artifact. Never paste transcript text into chat/comments.

---

## Composes with

- `GitHub MCP — Operating Standard` (PR-Merge Workflow, commit message format).
- `meeting-transcript-attribution.md` — sibling hook for multi-speaker MEETINGS (attributed, posted to ClickUp comments). Different case: that attributes speakers in a meeting record posted as comments; this archives a one-on-one interview as a verbatim `.txt` source + a readable `.md` script.
- VIDEO-ANALYSIS skill — the `ffmpeg` extract/split mechanics; this hook reuses the split technique for the timeout fallback.

---

## Changelog

- **v1 (2026-08-14)** — Established. Single-subject recordings → raw timestamped `.md` in `uritp-docs/production/<CODE>/transcriptions/`. First file: `260814_ARLINE.md` (TIM-D, Seneca Towers).
- **v2 (2026-08-14)** — Registered on the AI Toolkit index. Added the split-file transcription fallback. Logged the direct-to-`main` commit slip. Added the private-repo/PII guardrail.
- **v3 (2026-08-14)** — Names come from the SOURCE FOLDER, not the audio. Old "correct nothing" rule had shipped seven residents' names wrong. Narrowed no-correction to folder-grounded names.
- **v4 (2026-08-15)** — Split into two phases. Phase 1 `.txt` = verbatim tool output, any agent, the fidelity guarantee. Phase 2 `.md` = readable, Milo-seated. `.txt` (raw) + `.md` (readable) linked pair.
- **v5 (2026-08-15)** — Locked the Phase 2 template: frontmatter + `Location:`/`Participants:` + `[mm:ss]` body. (Body was literal segments, no speaker labels — superseded by v7.)
- **v6 (2026-08-15)** — Correction scope widened from NAMES to all identifiable PROPER NOUNS (names + LOCATIONS), three confidence tiers. Added the `keywords:` frontmatter field (every proper noun edited or confirmed = search index + audit trail).
- **v7 (2026-08-15)** — **Phase 2 `.md` body is now a READABLE SCRIPT, not literal segments** (Michael). Attribute every turn to a speaker by name (`**Nigel:**` / `**<Subject>:**`), group choppy per-timestamp fragments into COMPLETE SENTENCES and whole turns, drop pure filler, fix punctuation, light timestamp at each turn START only. Words/meaning still never change — the `.txt` remains the verbatim arbiter, and the `.md` must diff against it to only speaker labels + sentence-joining + filler removal + punctuation + grounded proper-noun fixes. Reverses the v5 "keep literal timestamped lines, no Q/A labels" body rule; frontmatter/keywords from v5/v6 unchanged.
