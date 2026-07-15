---
id: inbox-triage-trigger
name: INBOX Triage Trigger
shelf: gates
kind: routing
trigger: ANY of — (a) an agent is assigned to a task in URITP ▸ INBOX ▸ Default (list id 901327608568); (b) an agent is @-mentioned or commented on such a task asking to triage/handle/execute; (c) any request naming this list asks to triage/process it; (d) any greenlight/execute signal on a task that already has a Plan Comment. Assignment is NOT required.
nicknames: [Inbox Trigger, Triage Trigger]
procedure_source: ClickUp — "INBOX Email Intake Triage — Agent Reference" (Brain Reference Library ▸ URITP). Canonical + only home of the steps.
version: 6
added: 2026-07-15
---

# INBOX Triage Trigger (🔑 Gate)

**Fires on ANY entry condition below — assignment is only ONE of them.** Agent-agnostic: any agent (Super Agent or Brain session) runs it identically, not just Mainstage Milo.

## 🟢 GREENLIGHT = RUN THIS EXACT OPENING SEQUENCE (v6, the fix that matters)
Beat 1 (interrogate/plan) already executes well — the plans are correct. The ONLY persistent failure is Beat 2: a correct plan is greenlit, but the executing agent improvises a thin routine instead of following the defined COMBINE/MOVE steps. Root cause: the executing agent is a DIFFERENT, cold-context agent than the one that wrote the plan. It has the greenlight message but not the reasoning, the intake, or the follow-up Q&A. So the instant you detect a greenlight, run this fixed opening sequence BEFORE any write — no improvisation, no shortcuts:

**GREENLIGHT OPENING SEQUENCE (mandatory, in order):**
1. **HUNT DOWN THE ORIGINAL INTAKE.** On the task, find the first/original intake material: the mirrored email comment chain (Step 0B) and the Description. Read it ENTIRELY. This is the content you'll be acting on.
2. **READ THE FULL THREAD AFTER IT.** Read every comment AFTER the intake in order: the Plan Comment, and ALL follow-up questions and answers / clarifications / addendums between Michael and any agent. The greenlight often carries qualifiers ("greenlight combine, but change the due date," "actually put it under a toggle") and earlier replies may have refined the destination or the handling. Reconstruct the FULL decision context, not just the last message.
3. **RELOAD THE GIT/CLICKUP PROCEDURE for what the named action means.** Load the ClickUp triage doc THIS TURN and read the exact Universal Standard for COMBINE or MOVE. Do not run from memory of "what COMBINE probably means."
4. **THEN plan your execution** against that freshly-loaded standard, folding in every qualifier you found in steps 1–2, and execute verbatim.

> This sequence is the literal answer to "how do we make the execution agent follow the workflow": force it to rebuild the context the plan-agent had (intake + full Q&A) AND reload the definition of the action, THEN act. Skipping straight from "greenlight" to "write" is the bug.

## ⚠️ BLANK-CONTEXT GUARD (hard rule behind the sequence above)
**You may not perform a triage write (MOVE / COMBINE / close) unless you have loaded the ClickUp procedure doc THIS TURN.** Self-check before writing: *"Did I fetch the triage doc in this same response, and did I read the intake + full follow-up thread?"* If no → STOP, do the GREENLIGHT OPENING SEQUENCE, then execute. A greenlight message, a plan comment written earlier, or memory of "what the routine says" do NOT satisfy this — only a same-turn load of the live doc + a same-turn read of the thread does.

Observed failures this closes (7/15/26): (a) greenlit to COMBINE, agent posted the email as ONE lump comment and marked the task "for ref only" instead of the full standard (verbatim-email-first / notes-second / backtrack / linked-tasks relationship / close to CLOSED-type) — ~10% of the routine, because neither the thread nor the doc was reloaded.

**You cannot force a git fetch from inside git.** The pointer that makes an agent load the workflow lives in what the agent reads by default — THREE always-surfaced places, any one enough to route you here:
1. **The AI Toolkit index trigger table** (Brain loads every pass): rows for "assigned to INBOX ▸ Default" and "greenlight/execute on INBOX ▸ Default" point here.
2. **The list's read-before-acting page** (URITP ▸ INBOX ▸ Default): points at the triage doc + this gate.
3. **The Plan Comment's ⚙️ execution footer** (strongest anchor at greenlight): every Plan Comment ends with the GREENLIGHT OPENING SEQUENCE + the reload instruction + the exact routine steps, so an agent replying to a greenlight reads them INLINE even with otherwise-blank context.

## The greenlight self-anchor (plan-comment footer)
Because a greenlight is a REPLY to the Plan Comment, that comment is the one piece of context a greenlit agent reliably has. So every Plan Comment MUST END with a mandatory **⚙️ execution footer** that (a) prints the GREENLIGHT OPENING SEQUENCE (hunt intake → read full thread → reload doc → execute), (b) names the exact routine + destination task, and (c) lists the routine's steps inline. The footer's spec lives in the ClickUp doc's PLAN COMMENT format; this gate enforces that it exists and is honored. If the plan comment you're replying to has NO footer, it predates v5 — run the full opening sequence and Universal Standard anyway.

## TRIGGER DETECTION (open the gate on ANY of these)
Evaluate on every turn that touches URITP ▸ INBOX ▸ Default (`901327608568`). If ANY match, you are IN this gate — load the ClickUp procedure doc and act:

1. **Assigned** — auto- or manually assigned to a task in this list. → Beat 1.
2. **Commented / mentioned** — @-mentioned or addressed in a comment on a task here asking to look at / triage / handle / process / execute it. → Beat 1 if no plan yet, Beat 2 if a Plan Comment already exists.
3. **Asked to triage the list** — any request naming this list / INBOX asking to triage, process, run, clear, or work it — even with NO assignment and NO specific task. → Beat 1 across the open intake tasks.
4. **Greenlight / execute signal** — any approval or execute phrasing on a task that already has a Plan Comment. → Beat 2: run the GREENLIGHT OPENING SEQUENCE above.

**If in doubt whether a message is a trigger: treat it as one and load the doc.** A needless doc read is cheap; a missed trigger silently no-ops the whole procedure. Assignment is a convenience signal, NOT a precondition.

## Read this first (the mental model)
A **two-beat, human-in-the-loop workflow**, not a one-shot command. Map whatever phrasing Michael uses to the current beat and act. He prompts naturally ("triage this," "greenlight COMBINE," "go ahead"); the gate carries the procedure so his words don't have to.

- **Beat 1 — INTERROGATE:** load the doc, run Step 0 (rename + mirror email → comments), set first-pass fields, decide MOVE vs COMBINE, post the **Plan Comment (with ⚙️ execution footer)**, then STOP and wait. Nothing destructive yet. *(This beat works well today.)*
- **Beat 2 — EXECUTE (on greenlight):** run the **GREENLIGHT OPENING SEQUENCE** (hunt intake → read full thread → reload doc), then run the named MOVE or COMBINE **verbatim** per its Universal Standard, layer on addendums, report back. The write moment. *(This beat is what v6 hardens.)*

**Beat test:** has a Plan Comment already been posted and approved? Yes → Beat 2. No → Beat 1.

## Natural-language intent map (route ANY phrasing to the right beat)
| If Michael says (any variant) | Beat | Do |
| --- | --- | --- |
| "triage this," "run inbox," "interrogate this," "what is this," "clear the inbox," or you were just auto-assigned | 1 | Load doc → Step 0 → fields → Plan Comment (+ ⚙️ footer) → wait |
| "greenlight," "proceed," "go ahead," "do it," "execute," "yes MOVE/COMBINE," "send it" | 2 | GREENLIGHT OPENING SEQUENCE → run named routine verbatim → report |
| "greenlight COMBINE, plus ‹x›" / "MOVE but also ‹y›" | 2 | Opening sequence, then execute base routine verbatim + apply ‹addendum› on top |
| "actually MOVE not COMBINE" (or vice-versa) after a plan | 2 | Opening sequence, switch to the other Universal Standard, re-confirm destination |
| ambiguous / conflicting / no clear destination | — | Do NOT guess. Surface the ambiguity in-thread and ask |

**Addendums modify, never replace.** An operator tweak rides ON TOP of the full base routine; it never authorizes skipping the defined steps.

## Beat 1 detail (interrogate)
1. Load the ClickUp procedure doc (see `procedure_source`) and run it live.
2. Follow it verbatim: Step 0 (rename + mirror email → comments), first-pass fields, MOVE vs COMBINE decision, Plan Comment ENDING with the ⚙️ execution footer.
3. STOP at the greenlight gate. Return control (self-unassign is automated elsewhere).

## Beat 2 detail (the write moment)
On ANY greenlight/execute signal, run the GREENLIGHT OPENING SEQUENCE (hunt intake → read full follow-up thread → reload doc THIS TURN), then:
**Execute the named routine verbatim** per the doc's Universal Standard:
   - **COMBINE** → dedup check (copy only net-new messages; if the thread is already on the destination, fall through to DUPE HANDLING, do NOT re-paste) → full-verbatim-email-first-comment / notes-second / backtrack / linked-tasks relationship / name exact destination by full title + link / close intake to CLOSED-type.
   - **MOVE** → existence check (if a task already exists in the target list, COMBINE onto it instead) → Task Move Impact Gate BEFORE moving (diff statuses + custom fields, warn on drops) → confirm mirror + Description travel → set fields on arrival → provenance note → do NOT close.
Layer addendums on top. Report naming what you appended vs. what was already present.

> Why: without rebuilding context (intake + full thread) and a same-turn doc re-read, agents improvise a thin routine on execution because the procedure and the decision history have fallen out of context. The greenlight is where the destructive writes land, so it needs full-context discipline.

## Minimize slop (standing intent)
Capture everything once, cleanly, with zero repetition. Never re-post content already on the destination. COMBINE copies only net-new messages; MOVE avoids creating a duplicate task. When in doubt whether something is already captured, surface it rather than double-posting.

## Source-of-truth split (LOCKED)
**The procedure lives ONLY in the ClickUp doc. This file holds ONLY trigger detection + routing + intent mapping + the guards that enforce loading the doc — never the steps themselves.** git and ClickUp never both carry the same instruction. The step summaries above are pointers/reminders of what to reload, NOT the authoritative how-to; if they ever conflict with the doc, the doc wins. If you find full triage STEPS duplicated into this file, delete them and point back to the doc.

## Why decouple from Milo
Written to be agent-portable from the start ("any agent assigned to a task in this list loads this page and follows it"). Only the auto-assign automation named Milo. Flip it to "assign the on-duty agent" and any agent triggers the full routine — no single-agent dependency.

## NO-BYPASS
When ANY trigger-detection condition matches, load the ClickUp procedure doc and act on it. On a greenlight you must run the GREENLIGHT OPENING SEQUENCE (hunt intake → read full thread → reload doc) and may not MOVE/COMBINE/close unless you loaded that doc THIS TURN. Never run from memory of what it "probably says" — other agents edit the doc without notice, so the live same-turn read IS the gate.

## Changelog
- 2026-07-15 (v6) — added the **GREENLIGHT OPENING SEQUENCE**: on greenlight, before any write, the executing agent must (1) hunt down + read the original intake entirely, (2) read the full follow-up Q&A thread after it, (3) reload the procedure doc for what the named action means, THEN execute. Directly targets the confirmed pattern where Beat 1 plans well but a cold-context Beat 2 agent improvises the execution.
- 2026-07-15 (v5) — BLANK-CONTEXT GUARD (no triage write unless the doc was loaded THIS TURN) + plan-comment ⚙️ execution footer as greenlight self-anchor + named the three always-surfaced routing points.
- 2026-07-15 (v4) — broadened trigger detection (assignment no longer a precondition) + defined "the greenlight gate" (policy + re-read).
- 2026-07-15 (v3) — two-beat mental model + natural-language intent map + MOVE execution summary.
- 2026-07-15 (v2) — greenlight re-read: gate fires again on greenlight, forcing a fresh doc load before writing.
- 2026-07-15 (v1) — created; agent-agnostic trigger decoupling the inbox interrogation from Milo.
