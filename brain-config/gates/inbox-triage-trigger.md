---
id: inbox-triage-trigger
name: INBOX Triage Trigger
shelf: gates
kind: routing
trigger: ANY of — (a) an agent is assigned to a task in URITP ▸ INBOX ▸ Default (list id 901327608568); (b) an agent is @-mentioned or commented on such a task asking to triage/handle/execute; (c) any request naming this list asks to triage/process it. Assignment is NOT required.
nicknames: [Inbox Trigger, Triage Trigger]
procedure_source: ClickUp — "INBOX Email Intake Triage — Agent Reference" (Brain Reference Library ▸ URITP). Canonical + only home of the steps.
version: 4
added: 2026-07-15
---

# INBOX Triage Trigger (🔑 Gate)

**Fires on ANY entry condition below — assignment is only ONE of them.** The old failure mode: the gate only fired on auto-assign, so a fresh agent handed a bare comment ("triage this," "greenlight COMBINE") never routed INTO the gate, so the greenlight logic never ran. This version widens the mouth of the funnel: assignment, comment/mention, or a natural request all open the gate. Agent-agnostic: any agent (Super Agent or Brain session) runs it identically, not just Mainstage Milo.

## TRIGGER DETECTION (open the gate on ANY of these)
Evaluate on every turn that touches URITP ▸ INBOX ▸ Default (`901327608568`). If ANY match, you are IN this gate — load the ClickUp procedure doc and act:

1. **Assigned** — you were auto-assigned (or manually assigned) to a task in this list. → Beat 1.
2. **Commented / mentioned** — you're @-mentioned or addressed in a comment ON a task in this list asking to look at / triage / handle / process / execute it. → Beat 1 if no plan yet, Beat 2 if a Plan Comment is already posted (see beat test).
3. **Asked to triage the list** — any request (comment, DM, or Brain-session prompt) that names this list / INBOX and asks to triage, process, run, clear, or work it — even with NO assignment and NO specific task. → run Beat 1 across the list's open intake tasks (one Plan Comment per task).
4. **Greenlight / execute signal** — any approval or execute phrasing on a task that already has a Plan Comment. → Beat 2.

**If in doubt whether a message is a trigger: treat it as one and load the doc.** A needless doc read is cheap; a missed trigger means the whole procedure silently no-ops. Assignment is a convenience signal, NOT a precondition.

## Read this first (the mental model)
This is a **two-beat, human-in-the-loop workflow**, not a one-shot command. Whatever phrasing Michael uses, map it to the current beat and act. He should be able to prompt naturally ("triage this," "greenlight COMBINE," "go ahead") without reciting steps — the gate carries the procedure so his words don't have to.

- **Beat 1 — INTERROGATE:** load the doc, run Step 0 (rename + mirror email → comments), set first-pass fields, decide MOVE vs COMBINE, post the **Plan Comment**, then STOP and wait. Nothing destructive happens yet.
- **Beat 2 — EXECUTE (on greenlight):** RE-LOAD the doc, run the named MOVE or COMBINE **verbatim** per its Universal Standard, layer on any addendums, report back. This is the write moment.

**Beat test:** has a Plan Comment already been posted on this task and has Michael approved it? Yes → Beat 2. No → Beat 1.

## What "the greenlight gate" actually means (two mechanisms, one name)
The phrase covers two distinct things — both must hold:

1. **The mandatory greenlight POLICY (the "wait"):** after posting the Plan Comment in Beat 1, STOP. Do no destructive write (no MOVE, no COMBINE, no close) until Michael explicitly approves. This policy lives in the ClickUp doc.
2. **The greenlight RE-READ (the "now go"):** when approval arrives, RE-LOAD the doc before executing so the procedure is fresh in context, then run the named routine verbatim. This is the gate's Beat 2.

A greenlight that arrives but doesn't get RECOGNIZED (because nothing routed the agent into this gate) is the leak v4's Trigger Detection closes. Recognize the greenlight FIRST (via detection #4), then honor both mechanisms.

## Natural-language intent map (route ANY phrasing to the right beat)
Michael's prompting is intentionally casual. Match intent, not exact words:

| If Michael says (any variant) | Beat | Do |
| --- | --- | --- |
| "triage this," "run inbox," "interrogate this," "what is this," "clear the inbox," or you were just auto-assigned | 1 | Load doc → Step 0 → fields → Plan Comment → wait |
| "greenlight," "proceed," "go ahead," "do it," "execute," "yes MOVE/COMBINE," "send it" | 2 | RE-LOAD doc → run named routine verbatim → report |
| "greenlight COMBINE, plus ‹x›" / "MOVE but also ‹y›" | 2 | Execute base routine verbatim, apply ‹addendum› on top |
| "actually MOVE not COMBINE" (or vice-versa) after a plan | 2 | Switch to the other Universal Standard, re-confirm destination |
| ambiguous / conflicting / no clear destination | — | Do NOT guess. Surface the ambiguity in-thread and ask |

**Addendums modify, never replace.** An operator tweak ("put it under a toggle," "bump due date," "skip the draft reply") rides ON TOP of the full base routine. It never authorizes skipping the defined steps.

## Beat 1 detail (interrogate)
1. Load the ClickUp procedure doc (see `procedure_source`) and run it live.
2. Follow it verbatim: Step 0 (rename + mirror email → comments), first-pass fields, MOVE vs COMBINE decision, Plan Comment.
3. STOP at the mandatory greenlight gate. Return control (self-unassign is automated elsewhere).

## Beat 2 detail (greenlight re-read — the write moment)
**The gate fires again on greenlight.** Greenlight is the highest-stakes moment — it writes to canonical tasks — and a fresh agent (or a long gap) will have lost the procedure from context. So on ANY greenlight/execute signal:

1. **RE-LOAD the ClickUp procedure doc before touching anything.** Do not execute from memory of the plan or "what the routine probably says." The plan comment is not the procedure; the doc is.
2. **Execute the named routine verbatim** per the doc's Universal Standard for that action:
   - **COMBINE** → post-greenlight DEDUP CHECK first (copy only net-new messages; if the thread is already on the destination, fall through to DUPE HANDLING, do NOT re-paste), then full-verbatim-email-first-comment / notes-second / backtrack / linked-tasks relationship / name exact destination by full title + link / close intake to CLOSED-type.
   - **MOVE** → post-greenlight EXISTENCE CHECK first (if a task already exists in the target list, COMBINE onto it instead), then run the Task Move Impact Gate BEFORE moving (diff statuses + custom fields, warn on anything that drops), confirm the mirror + Description travel with the task, set fields on arrival, add a provenance note, do NOT close (a MOVE relocates a live task).
3. Layer any operator addendums on top. Only after the fresh doc load do the writes happen. Re-reading the doc IS the gate at greenlight, exactly as it is at assignment.

> Why: without a forced re-read, agents post the plan correctly then skip the defined MOVE/COMBINE steps on execution because the procedure has fallen out of context. The greenlight is precisely where the destructive writes land, so it needs the same live-read discipline as the first pass.

## Minimize slop (the standing intent behind both routines)
Michael's throughline: **capture everything once, cleanly, with zero repetition.** Never re-post content that already lives on the destination. COMBINE copies only net-new messages; MOVE avoids creating a duplicate task. When in doubt about whether something is already captured, surface it rather than double-posting. Clean audit trail > exhaustive re-paste.

## Source-of-truth split (LOCKED)
**The procedure lives ONLY in the ClickUp doc. This file holds ONLY the trigger detection + routing + intent mapping — never the steps.** git and ClickUp never both carry the same instruction. If you find triage STEPS (the actual how-to) duplicated into this file, delete them and point back to the doc. The doc wins; this stub says *when* to read it (the four detection conditions), *who* it applies to (any agent), and *how to map casual phrasing* to the right beat.

## Why decouple from Milo
The interrogation was written to be agent-portable from the start ("any agent assigned to a task in this list loads this page and follows it"). Only the auto-assign automation named Milo specifically. Flip that automation from "assign Milo" to "assign the on-duty agent" and any agent triggers the full routine — no single-agent dependency.

## NO-BYPASS
When ANY trigger-detection condition matches — assigned, commented/mentioned, asked to triage the list, or greenlit to execute — load the ClickUp procedure doc and act on it. Never run the interrogation OR the greenlit MOVE/COMBINE from memory of what it "probably says" — other agents edit that doc without notice, so the live read IS the gate.

## Changelog
- 2026-07-15 (v4) — **broadened TRIGGER DETECTION**: the gate now opens on assignment OR comment/mention OR a natural "triage the list" request OR a greenlight signal — assignment is no longer a precondition. Added an explicit "what the greenlight gate means" section (policy + re-read). Closes the leak where a bare greenlight/triage comment never routed the agent into the gate.
- 2026-07-15 (v3) — added the two-beat mental model + natural-language intent map; added the MOVE execution summary alongside COMBINE; framed for Super Agents + Brain session agents.
- 2026-07-15 (v2) — added the Greenlight re-read: gate fires a second time on greenlight, forcing a fresh doc load before any MOVE/COMBINE write.
- 2026-07-15 (v1) — created; agent-agnostic trigger decoupling the inbox interrogation from Milo.
