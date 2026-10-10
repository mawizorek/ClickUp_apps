# Voice Refresh

> **STATUS: PROPOSED, NOT REGISTERED.** No `routines/schedule.md` row and no `last-run` stamp exist yet, so this routine does not run. It goes live only after Michael greenlights the steward and the cadence.

goal:       Harvest prose Michael wrote by hand since the last run, add it to the voice sample ledger, and propose profile edits only when his measured style has actually moved.
target:     ClickUp sample ledger (one comment per run on the standing task "🧭 STANDING · Voice Profile Samples", home list chosen at greenlight) · proposed edits to `brain-config/hooks/humanize-prose.voice-michael.md` delivered as a PR left OPEN for review · `routines/last-run/voice-refresh.txt`
report-to:  DETAIL → the standing task above · ROLL-UP → 🧭 STANDING · Routine Ricky — Run Reports · https://app.clickup.com/t/86ajuhw1d

**Executor:** Routine Ricky (routines are his; zero agent changes). **Content steward (proposed):** Byline Bert, whose lane is Michael's outward voice; Documentation Dave stays steward of the `humanize-prose` engine. Michael rules.

## Why this is a routine and not a hook

The corpus changes every day and the profile should not. A hook fires per draft; this runs on a cadence, keeps a cursor, and only proposes. Fold-in: it reuses the routine framework, the Default Inbox capture Scribe Sara already produces, and the existing profile. Nothing net-new except this file.

## Sources (ranked by trust)

| Rank | Source | What counts as his | Notes |
|---|---|---|---|
| 1 | URITP ▸ INBOX ▸ Default (list `901327608568`) | Threaded replies under a `📧 Email chain` root whose sender is Michael, or labelled `MICHAEL'S REPLY` | Michael's emails are human-authored by construction: Brain's EMAIL SEND LOCK means Brain never sends. Chains tagged `voice-ref` are GOLD. |
| 2 | Home ▸ Gmail INBOX (list `901327875287`) | Same rule | Personal register; weight separately from work email. |
| 3 | Comments Michael typed to Brain | Dictation register only | Used for vocabulary and phrasing, never as an outgoing-style model. |
| 4 | Docs or tasks Michael tags `voice-ref` | His sections only | Manual, for course text and notes. |

## Steps

1. **Read state first.** `routines/last-run/voice-refresh.txt` (the cursor is the newest message date already harvested), the profile at HEAD, and the last ledger comment.
2. **Collect candidates** from each source in the table, newer than the cursor. Include closed tasks and subtasks; query defaults exclude both.
3. **Scrub each message:**
   - Cut everything at or below the first quote marker: `--` signature line, `From:`, `On ... wrote:`, `________`, `-----Original Message-----`.
   - Cut signature blocks, URLs (including `urldefense` wrappers), phone numbers and email addresses.
   - Drop a message if: it has under 8 words of body (count its sign-off only); it is a forward with no text of his; it contains agent markers (fleet agent names, emoji headers, template blocks); or it closely matches any Brain-drafted text in the same chain or in Gmail/Outlook drafts. That last check catches an AI draft he pasted and sent.
4. **Classify the register:** A working email · B student-facing · C notes · D formal · dictation. Use the profile's definitions.
5. **Write the ledger entry** as ONE comment on the standing task: per register, the sample count, GOLD vs SILVER, and the verbatim samples with source links. Student names stay inside ClickUp; never carry them further.
6. **Measure, per register, against the profile:** sentence-length median · Oxford-comma rate · spaced-hyphen rate · `!`/`!!` rate · opener and sign-off frequencies · signature phrases in use · new coinages seen in 3 or more samples.
7. **Decide.** A change becomes a proposal only if a metric moves more than 20% on at least 10 new samples in that register, or a new phrase appears in at least 3 samples. Otherwise record "no drift."
8. **Land the product.** Post the ledger comment. If there is a proposal, open a PR against the profile and LEAVE IT OPEN for the steward and Michael.
9. **STAMP** the cursor (newest harvested message date) plus the run time, only after step 8 landed.
10. **REPORT** in the format below, plus the one-line roll-up.

## Guardrails (STOP + flag if any is true)

- About to put a sample, a name, a phone number or an email address into the repo. The profile takes patterns and phrases of 12 words or fewer, nothing else.
- About to edit the profile directly or self-merge a profile PR. Proposals only, until Michael graduates the routine.
- Cannot tell whether text is his or an agent's: exclude it, and say how many were excluded.
- A student-authored message would enter the sample set. FERPA: the sender check comes first.
- About to treat dictation as an outgoing-style model.
- About to stamp before the ledger comment landed, or stamp a failed run.
- Coverage shrank versus the last run (a source unreachable): report it as unreachable, never as "no new samples."
- About to skip a step because the procedure feels long. Discipline rule 13.

## Report format

Run window (cursor → newest) · samples harvested per register, GOLD/SILVER · excluded count by reason (quoted, too short, agent-marked, draft match) · sources reached / unreachable · metric deltas per register · proposals (PR link) or "no drift" · whether this was a catch-up · files touched.

## Open for greenlight

- Steward: Bert (proposed) or Dave.
- Cadence: weekly (proposed; drift moves slowly) or biweekly.
- Standing ledger task location.
- Should GOLD tagging also happen by a reply-level reaction? Not yet: no tool reads reactions reliably, so v1 uses the task-level `voice-ref` tag.
