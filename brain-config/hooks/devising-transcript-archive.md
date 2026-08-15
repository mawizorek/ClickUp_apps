# Devising Transcript Archive · AI Toolkit

**Purpose:** Get an interview/session recording out of a person's hands and into `uritp-docs` as (1) a verbatim raw transcript and (2) a clean readable rendering, so a devising process has both a searchable source-of-record AND a usable document, instead of a pile of WAV files sitting in Dropbox.

**Steward:** Mainstage Milo (`super-agents/mainstage-milo/`) — URITP production ops is his lane. Phase 1 (raw) is mechanical and ANY agent may run it; **Phase 2 (readable) is Milo's** — the proper-noun grounding + rendering is domain work.

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
| **1 · RAW** | `<YYMMDD>_<NAME>.txt` | ANY agent | The `transcribe_media` output committed VERBATIM. No corrections, no reflow, no frontmatter, no attribution. Source-of-record. **This phase is complete on its own** — commit it and the workflow for that recording is done. |
| **2 · READABLE** | `<YYMMDD>_<NAME>.md` | **Milo** (seated separately) | A clean, HTML-renderable rendering BUILT FROM the `.txt`. Grounded proper-noun corrections (names + locations) + the locked frontmatter/participants/keywords template applied HERE, never in Phase 1. |

**Why two phases:** the biggest source of "liberties" is one agent transcribing AND cleaning in the same pass — it silently smooths grammar, drops false starts, guesses names. Freezing the verbatim `.txt` FIRST means every later edit is diffable against an immutable source. Phase 2 is allowed to make it presentable precisely because Phase 1 preserved the truth.

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
3. **Commit the tool output VERBATIM.** 🔒 This is the fidelity guarantee. Paste `transcribe_media`'s output exactly as returned — one `[mm:ss]` segment per line, no reflow, no merging into paragraphs, no corrections, no attribution, no frontmatter, no header. **Never re-key or reconstruct it from memory** — retyping is where cleanup sneaks in. If you split in 2b, concatenate the parts in order and nothing else. The committed `.txt` must equal the tool output.
4. **File name `<YYMMDD>_<NAME>.txt`** — `<NAME>` = subject FIRST name in caps, spelled AS IN THE SOURCE FOLDER (see 🔑 below), e.g. `260814_BILL.txt`. Same-first-name collision in one production → add last initial (`260814_ARLINEH.txt`).
5. **Commit via PR-Merge** (branch → commit → PR → self-merge; NEVER straight to `main`). One recording per PR. Report file + PR link, no transcript text in chat.

**Phase 1 done = that recording is archived.** Phase 2 can happen now, later, or in a separate session.

---

## PHASE 2 — READABLE (`.md`), seat Milo

Builds the human-facing document FROM the frozen `.txt`. Milo owns this pass.

6. **CORRECT THE PROPER NOUNS — NAMES *and* LOCATIONS.** The transcription spells every proper noun phonetically and it WILL be wrong ("Arundelcoit" for Irondequoit, "Ryszypnik" for Reszitnyk, "Bonnefie" for Bonifay). Phase 2 fixes the ones it can identify, in tiers of confidence:
 - **Tier 1 — NAMES, folder-grounded (authoritative).** The per-subject **subfolder name** (`BILL Tegtmeyer`) + the **photo filename** (`Bill-Tegtmeyer.79.ST.jpg`) are Michael's own labels — ground truth for the FULL name and the age. Apply the correct spelling EVERYWHERE the name appears, including OTHER subjects mentioned (Leroy's "Helena" is really `Halina Reszitnyk`; fix it in Leroy's `.md` too so files cross-reference). ⚠️ Folder/photo can disagree with the info-sheet PDF (Bill: folder `Tegtmeyer` vs PDF `Tegmeyer`) — on conflict ASK Michael, never silently pick. Info-sheet PDFs are handwritten scans; OCR is garbage, don't trust the PDF body.
 - **Tier 2 — LOCATIONS & identifiable proper nouns (correct when confident).** Real, recognizable places and institutions get their correct spelling: local geography (Irondequoit, Owego, Rochester, Seneca Towers, Highland Hospital, Sullivan Street), towns, schools, employers, well-known orgs. Use knowledge of the Rochester/URITP context. **The bar is CONFIDENT IDENTIFICATION, not folder-grounding** — "Arundelcoit" → Irondequoit is obvious; correct it. This is the v6 change from the old "names only" rule.
 - **Tier 3 — genuinely unidentifiable, LEAVE AS HEARD + flag.** If a proper noun can't be confidently resolved (a garbled employer like Halina's "B4ments," a steel mill you can't verify like Leroy's "Fodler Seiberg"), keep it verbatim and note it in the PR body as unresolved. **Never invent a spelling to look finished.** Uncertainty stays honest.
7. **Render into our own template** (deliberately NOT the Otter export format — keep it lean, HTML-renderable via the standard frontmatter→render pipeline). EXACT shape (LOCKED, Michael 2026-08-15):

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

[00:00] Now it's recording. I'm an idiot. What can I say.
```

 - **Frontmatter fields, all required, in this order:**
   - `title:` — `<Subject first name> intro, <D Mon YYYY>` (e.g. `Arline intro, 14 Aug 2026`). Human-readable date, no leading zero on the day.
   - `id:` — `transcription-<YYMMDD>-<name>` (name lowercase, folder-grounded spelling; matches the file stem; last-initial disambiguation carries over → `transcription-260814-arlineh`).
   - `type: page` · `status: public` · `nav: hidden` — constants, do not vary.
   - `revised:` — the date this `.md` was last rendered/edited, `D Mon YYYY`.
   - `keywords:` — **inline `[...]` list of EVERY proper noun edited OR confirmed in Phase 2** (step 6): subject + interviewer full names, every corrected/verified place, school, employer, org. This is the searchable index of the transcript and the audit trail of what Phase 2 touched. Order roughly people → places → orgs. Omit Tier-3 unresolved terms (they aren't confirmed). If a name/place appears in the body, it belongs here.
 - **Then a blank line, then the metadata block:** `Location: <venue>` and `Participants: <interviewer>, <subject>`. Interviewer for TIM-D intro sessions is **Nigel** (Nigel Maister — the info-sheet contact); confirm per session, never hardcode blindly. Subject name folder-grounded.
 - **Then a blank line, then the transcript body: KEEP THE `[mm:ss]` TIMESTAMPED LINES** — same segmented shape as the `.txt`, NOT Q/A speaker labels. Phase 2's ONLY body edits are the proper-noun corrections from step 6; it MUST NOT merge, reflow, paraphrase, reword, or add anything else. The `.txt` is the arbiter; anything ambiguous, defer to it.
 - Omit nothing from the frontmatter. If the interviewer can't be confirmed, write the subject in Participants and FLAG the missing interviewer — never invent a name.
8. **File name `<YYMMDD>_<NAME>.md`** — same stem as the `.txt`, `.md` extension. Commit via PR-Merge, never straight to `main`. Report file + PR link, and list any Tier-3 unresolved proper nouns in the PR body.

---

## Guardrails

- **Phase 1 is verbatim, full stop.** No paraphrase, no reflow, no corrections, no frontmatter. If the `.txt` isn't a faithful copy of the tool output, Phase 1 failed.
- **Phase 2 body = raw body + proper-noun corrections (names + confident locations), nothing else.** The frontmatter/participants/keywords block is the only ADDED structure. No merging into paragraphs, no rewording of speech. Tier-3 unidentifiable proper nouns stay as heard and are flagged, never guessed.
- **Everything corrected or confirmed becomes a keyword.** The `keywords:` list is both the search index and the record of what Phase 2 changed — if you fixed it or verified it, it goes in the list.
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
- **v4 (2026-08-15)** — Split into two phases. Phase 1 `<YYMMDD>_<NAME>.txt` = verbatim tool output, any agent, the fidelity guarantee. Phase 2 `<YYMMDD>_<NAME>.md` = readable, Milo-seated. Kills the transcribe-and-clean-in-one-pass liberties failure mechanically. Naming changed to a `.txt` (raw) + `.md` (readable) linked pair.
- **v5 (2026-08-15)** — Locked the Phase 2 `.md` template (Michael): frontmatter `title / id / type / status / nav / revised`, then `Location:` + `Participants:`, then the `[mm:ss]` body (NOT Q/A labels). Phase 2's only body edit was folder-grounded name fixes. TIM-D interviewer confirmed as Nigel (Maister).
- **v6 (2026-08-15)** — **Correction scope widened from NAMES to all identifiable PROPER NOUNS (names + LOCATIONS)**, in three confidence tiers: Tier 1 names folder-grounded, Tier 2 locations/orgs corrected when confidently identifiable (Rochester context — e.g. "Arundelcoit"→Irondequoit), Tier 3 unidentifiable left as heard + flagged in the PR. Added a **`keywords:` frontmatter field** — every proper noun edited OR confirmed in Phase 2, doubling as the search index and the audit trail of what Phase 2 touched (Michael). Prompted by the v5 test shipping "Arundelcoit" in Bill's finished `.md` because the old rule only allowed folder-grounded NAME fixes.
