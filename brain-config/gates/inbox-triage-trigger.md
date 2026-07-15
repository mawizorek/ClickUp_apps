---
id: inbox-triage-trigger
name: INBOX Triage Trigger
shelf: gates
kind: routing
trigger: Any agent assigned to a task in URITP ▸ INBOX ▸ Default (list id 901327608568), OR any greenlight/execute signal on such a task.
nicknames: [Inbox Trigger, Triage Trigger]
procedure_source: ClickUp — "INBOX Email Intake Triage — Agent Reference" (Brain Reference Library ▸ URITP). Canonical + only home of the steps.
version: 3
added: 2026-07-15
---

# INBOX Triage Trigger (🔑 Gate)

**Fires when any agent is assigned to a task in URITP ▸ INBOX ▸ Default (`901327608568`), or when Michael greenlights/directs execution on such a task.** The assignment is the signal to run a first-pass inbox interrogation; the greenlight is the signal to execute the named routine. Agent-agnostic by design: not coupled to Mainstage Milo — ANY agent (a Super Agent or a Brain session agent) that lands on one of these tasks runs the routine identically.

## Read this first (the mental model)
This is a **two-beat, human-in-the-loop workflow**, not a one-shot command. Whatever phrasing Michael uses, map it to the current beat and act. He should be able to prompt naturally ("triage this," "greenlight COMBINE," "go ahead") without reciting steps — the gate carries the procedure so his words don't have to.

- **Beat 1 — INTERROGATE (on assignment):** load the doc, run Step 0 (rename + mirror email → comments), set first-pass fields, decide MOVE vs COMBINE, post the **Plan Comment**, then STOP and wait. Nothing destructive happens yet.
- **Beat 2 — EXECUTE (on greenlight):** RE-LOAD the doc, run the named MOVE or COMBINE **verbatim** per its Universal Standard, layer on any addendums, report back. This is the write moment.

If you're ever unsure which beat you're in: has a Plan Comment already been posted and greenlit? Yes → Beat 2. No → Beat 1.

## Natural-language intent map (route ANY phrasing to the right beat)
Michael's prompting is intentionally casual. Match intent, not exact words:

| If Michael says (any variant) | Beat | Do |
| --- | --- | --- |
| "triage this," "run inbox," "interrogate this," "what is this," or you were just auto-assigned | 1 | Load doc → Step 0 → fields → Plan Comment → wait |
| "greenlight," "proceed," "go ahead," "do it," "execute," "yes MOVE/COMBINE," "send it" | 2 | RE-LOAD doc → run named routine verbatim → report |
| "greenlight COMBINE, plus ‹x›" / "MOVE but also ‹y›" | 2 | Execute base routine verbatim, apply ‹addendum› on top |
| "actually MOVE not COMBINE" (or vice-versa) after a plan | 2 | Switch to the other Universal Standard, re-confirm destination |
| ambiguous / conflicting / no clear destination | — | Do NOT guess. Surface the ambiguity in-thread and ask |

**Addendums modify, never replace.** An operator tweak ("put it under a toggle," "bump due date," "skip the draft reply") rides ON TOP of the full base routine. It never authorizes skipping the defined steps.

## The routing (Beat 1 — assignment)
1. On assignment to an INBOX ▸ Default task, load the ClickUp procedure doc (see `procedure_source`) and run it live.
2. Follow it verbatim: Step 0 (rename + mirror email → comments), first-pass fields, MOVE vs COMBINE decision, Plan Comment.
3. STOP at the mandatory greenlight gate. Return control (self-unassign is automated elsewhere).

## Greenlight re-read (Beat 2 — the write moment)
**The gate fires TWICE: once on assignment (plan), once on greenlight (execute).** Greenlight is the highest-stakes moment — it writes to canonical tasks — and a fresh agent (or a long gap) will have lost the procedure from context. So on ANY greenlight/execute signal (see the intent map):

1. **RE-LOAD the ClickUp procedure doc before touching anything.** Do not execute from memory of the plan or "what the routine probably says." The plan comment is not the procedure; the doc is.
2. **Execute the named routine verbatim** per the doc's Universal Standard for that action:
   - **COMBINE** → post-greenlight DEDUP CHECK first (copy only net-new messages; if the thread is already on the destination, fall through to DUPE HANDLING, do NOT re-paste), then full-verbatim-email-first-comment / notes-second / backtrack / linked-tasks relationship / name exact destination by full title + link / close intake to CLOSED-type.
   - **MOVE** → post-greenlight EXISTENCE CHECK first (if a task already exists in the target list, COMBINE onto it instead), then run the Task Move Impact Gate BEFORE moving (diff statuses + custom fields, warn on anything that drops), confirm the mirror + Description travel with the task, set fields on arrival, add a provenance note, do NOT close (a MOVE relocates a live task).
3. Layer any operator addendums on top. Only after the fresh doc load do the writes happen. Re-reading the doc IS the gate at greenlight, exactly as it is at assignment.

> Why: without a forced re-read, agents post the plan correctly then skip the defined MOVE/COMBINE steps on execution because the procedure has fallen out of context. The greenlight is precisely where the destructive writes land, so it needs the same live-read discipline as the first pass.

## Minimize slop (the standing intent behind both routines)
Michael's throughline: **capture everything once, cleanly, with zero repetition.** Never re-post content that already lives on the destination. COMBINE copies only net-new messages; MOVE avoids creating a duplicate task. When in doubt about whether something is already captured, surface it rather than double-posting. Clean audit trail > exhaustive re-paste.

## Source-of-truth split (LOCKED)
**The procedure lives ONLY in the ClickUp doc. This file holds ONLY the trigger + routing + intent mapping — never the steps.** git and ClickUp never both carry the same instruction. If you find triage STEPS (the actual how-to) duplicated into this file, delete them and point back to the doc. The doc wins; this stub says *when* to read it (assignment AND greenlight), *who* it applies to (any agent), and *how to map casual phrasing* to the right beat.

## Why decouple from Milo
The interrogation was written to be agent-portable from the start ("any agent assigned to a task in this list loads this page and follows it"). Only the auto-assign automation named Milo specifically. Flip that automation from "assign Milo" to "assign the on-duty agent" and any agent triggers the full routine — no single-agent dependency.

## NO-BYPASS
When assigned to an INBOX ▸ Default task — or when greenlit to execute — load the ClickUp procedure doc and act on it. Never run the interrogation OR the greenlit MOVE/COMBINE from memory of what it "probably says" — other agents edit that doc without notice, so the live read IS the gate.

## Changelog
- 2026-07-15 (v3) — added the **two-beat mental model** + **natural-language intent map** so any agent routes casual phrasing to the right beat; added the MOVE execution summary (existence check + Task Move Impact Gate + no-close) alongside COMBINE; framed for both Super Agents and Brain session agents. Goal: Michael's prompting can stay natural.
- 2026-07-15 (v2) — added the **Greenlight re-read**: gate fires a second time on greenlight, forcing a fresh doc load before any MOVE/COMBINE write.
- 2026-07-15 (v1) — created; agent-agnostic trigger decoupling the inbox interrogation from Milo.
