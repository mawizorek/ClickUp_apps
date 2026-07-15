---
id: inbox-triage-trigger
name: INBOX Triage Trigger
shelf: gates
kind: routing
trigger: ANY of — (a) an agent is assigned to a task in URITP ▸ INBOX ▸ Default (list id 901327608568); (b) an agent is @-mentioned or commented on such a task asking to triage/handle/execute; (c) any request naming this list asks to triage/process it; (d) any greenlight/execute signal on a task that already has a Plan Comment. Assignment is NOT required.
nicknames: [Inbox Trigger, Triage Trigger]
procedure_source: ClickUp — "INBOX Email Intake Triage — Agent Reference" (Brain Reference Library ▸ URITP). Canonical + only home of the steps.
version: 5
added: 2026-07-15
---

# INBOX Triage Trigger (🔑 Gate)

**Fires on ANY entry condition below — assignment is only ONE of them.** Agent-agnostic: any agent (Super Agent or Brain session) runs it identically, not just Mainstage Milo.

## ⚠️ BLANK-CONTEXT GUARD (read before ANY execution) — v5
The recurring failure is NOT trigger recognition anymore; it's an agent that recognizes the greenlight but **executes from blank context** — it never re-loaded the procedure, so it improvises a thin version of the routine. Observed 7/15/26: greenlit to COMBINE, the agent posted the email as ONE lump comment and marked the task "for ref only" instead of running the full standard (verbatim-email-first-comment / notes-second-comment / backtrack / linked-tasks relationship / close to CLOSED-type). It did ~10% of the routine because the routine wasn't in context.

**HARD RULE: you may not perform a triage write (MOVE / COMBINE / close) unless you have loaded the ClickUp procedure doc THIS TURN.** Self-check before writing: *"Did I fetch the triage doc in this same response?"* If no → STOP, fetch it, then execute. A greenlight message, a plan comment you wrote earlier, or your memory of "what the routine says" do NOT satisfy this — only a same-turn load of the live doc does. This is why the doc load and the write must happen in the SAME agent turn.

**You cannot force a git fetch from inside git.** The pointer that makes an agent load the workflow has to live in what the agent reads by default — so it lives in THREE always-surfaced places, and any one of them is enough to route you here:
1. **The AI Toolkit index trigger table** (Brain sessions load this every pass): rows for "assigned to INBOX ▸ Default" and "greenlight/execute on INBOX ▸ Default" point here.
2. **The list's read-before-acting page** (URITP ▸ INBOX ▸ Default): points at the triage doc + this gate.
3. **The Plan Comment's ⚙️ execution footer** (the strongest anchor at greenlight): every Plan Comment ends with the reload instruction + the exact routine steps, so an agent replying to a greenlight reads them INLINE even with otherwise-blank context. See below.

## The greenlight self-anchor (plan-comment footer)
Because a greenlight is a REPLY to the Plan Comment, the plan comment is the one piece of context a greenlit agent reliably has. So the procedure requires every Plan Comment to END with a mandatory **⚙️ execution footer** that (a) says "reload the doc, do not run from this thread alone," (b) names the exact routine + destination task, and (c) lists the routine's steps inline. The footer's spec lives in the ClickUp doc's PLAN COMMENT format; this gate just enforces that it exists and is honored. If you are executing a greenlight and the plan comment you're replying to has NO execution footer, that plan predates v5 — reload the doc and run the full Universal Standard anyway.

## TRIGGER DETECTION (open the gate on ANY of these)
Evaluate on every turn that touches URITP ▸ INBOX ▸ Default (`901327608568`). If ANY match, you are IN this gate — load the ClickUp procedure doc and act:

1. **Assigned** — auto- or manually assigned to a task in this list. → Beat 1.
2. **Commented / mentioned** — @-mentioned or addressed in a comment on a task here asking to look at / triage / handle / process / execute it. → Beat 1 if no plan yet, Beat 2 if a Plan Comment already exists.
3. **Asked to triage the list** — any request naming this list / INBOX asking to triage, process, run, clear, or work it — even with NO assignment and NO specific task. → Beat 1 across the open intake tasks.
4. **Greenlight / execute signal** — any approval or execute phrasing on a task that already has a Plan Comment. → Beat 2 (and the BLANK-CONTEXT GUARD applies).

**If in doubt whether a message is a trigger: treat it as one and load the doc.** A needless doc read is cheap; a missed trigger silently no-ops the whole procedure. Assignment is a convenience signal, NOT a precondition.

## Read this first (the mental model)
A **two-beat, human-in-the-loop workflow**, not a one-shot command. Map whatever phrasing Michael uses to the current beat and act. He prompts naturally ("triage this," "greenlight COMBINE," "go ahead"); the gate carries the procedure so his words don't have to.

- **Beat 1 — INTERROGATE:** load the doc, run Step 0 (rename + mirror email → comments), set first-pass fields, decide MOVE vs COMBINE, post the **Plan Comment (with ⚙️ execution footer)**, then STOP and wait. Nothing destructive yet.
- **Beat 2 — EXECUTE (on greenlight):** RE-LOAD the doc (BLANK-CONTEXT GUARD), run the named MOVE or COMBINE **verbatim** per its Universal Standard, layer on addendums, report back. The write moment.

**Beat test:** has a Plan Comment already been posted and approved? Yes → Beat 2. No → Beat 1.

## What "the greenlight gate" actually means (two mechanisms, one name)
1. **The mandatory greenlight POLICY (the "wait"):** after posting the Plan Comment, STOP. No destructive write until Michael explicitly approves.
2. **The greenlight RE-READ (the "now go"):** on approval, RE-LOAD the doc (same turn as the write — BLANK-CONTEXT GUARD), then run the named routine verbatim.

## Natural-language intent map (route ANY phrasing to the right beat)
| If Michael says (any variant) | Beat | Do |
| --- | --- | --- |
| "triage this," "run inbox," "interrogate this," "what is this," "clear the inbox," or you were just auto-assigned | 1 | Load doc → Step 0 → fields → Plan Comment (+ ⚙️ footer) → wait |
| "greenlight," "proceed," "go ahead," "do it," "execute," "yes MOVE/COMBINE," "send it" | 2 | RELOAD doc (same turn) → run named routine verbatim → report |
| "greenlight COMBINE, plus ‹x›" / "MOVE but also ‹y›" | 2 | Execute base routine verbatim, apply ‹addendum› on top |
| "actually MOVE not COMBINE" (or vice-versa) after a plan | 2 | Switch to the other Universal Standard, re-confirm destination |
| ambiguous / conflicting / no clear destination | — | Do NOT guess. Surface the ambiguity in-thread and ask |

**Addendums modify, never replace.** An operator tweak rides ON TOP of the full base routine; it never authorizes skipping the defined steps.

## Beat 1 detail (interrogate)
1. Load the ClickUp procedure doc (see `procedure_source`) and run it live.
2. Follow it verbatim: Step 0 (rename + mirror email → comments), first-pass fields, MOVE vs COMBINE decision, Plan Comment ENDING with the ⚙️ execution footer.
3. STOP at the greenlight gate. Return control (self-unassign is automated elsewhere).

## Beat 2 detail (greenlight re-read — the write moment)
On ANY greenlight/execute signal:
1. **BLANK-CONTEXT GUARD: RE-LOAD the ClickUp procedure doc THIS TURN before touching anything.** The plan comment is not the procedure; the doc is.
2. **Execute the named routine verbatim** per the doc's Universal Standard:
   - **COMBINE** → dedup check (copy only net-new messages; if the thread is already on the destination, fall through to DUPE HANDLING, do NOT re-paste) → full-verbatim-email-first-comment / notes-second / backtrack / linked-tasks relationship / name exact destination by full title + link / close intake to CLOSED-type.
   - **MOVE** → existence check (if a task already exists in the target list, COMBINE onto it instead) → Task Move Impact Gate BEFORE moving (diff statuses + custom fields, warn on drops) → confirm mirror + Description travel → set fields on arrival → provenance note → do NOT close.
3. Layer addendums on top. Report naming what you appended vs. what was already present.

> Why: without a same-turn re-read, agents post the plan correctly then improvise a thin routine on execution because the procedure has fallen out of context. The greenlight is where the destructive writes land, so it needs the same live-read discipline as the first pass.

## Minimize slop (standing intent)
Capture everything once, cleanly, with zero repetition. Never re-post content already on the destination. COMBINE copies only net-new messages; MOVE avoids creating a duplicate task. When in doubt whether something is already captured, surface it rather than double-posting.

## Source-of-truth split (LOCKED)
**The procedure lives ONLY in the ClickUp doc. This file holds ONLY trigger detection + routing + intent mapping + the guards that enforce loading the doc — never the steps themselves.** git and ClickUp never both carry the same instruction. The step summaries above are pointers/reminders of what to reload, NOT the authoritative how-to; if they ever conflict with the doc, the doc wins. If you find full triage STEPS duplicated into this file, delete them and point back to the doc.

## Why decouple from Milo
Written to be agent-portable from the start ("any agent assigned to a task in this list loads this page and follows it"). Only the auto-assign automation named Milo. Flip it to "assign the on-duty agent" and any agent triggers the full routine — no single-agent dependency.

## NO-BYPASS
When ANY trigger-detection condition matches, load the ClickUp procedure doc and act on it. You may not perform a MOVE/COMBINE/close unless you loaded that doc THIS TURN. Never run from memory of what it "probably says" — other agents edit the doc without notice, so the live same-turn read IS the gate.

## Changelog
- 2026-07-15 (v5) — added the **BLANK-CONTEXT GUARD** (no triage write unless the doc was loaded THIS TURN) + the **plan-comment ⚙️ execution footer** as the greenlight self-anchor + named the three always-surfaced places that route an agent to load the workflow. Closes the failure where a greenlit agent executed a thin, improvised routine from blank context.
- 2026-07-15 (v4) — broadened trigger detection (assignment no longer a precondition) + defined "the greenlight gate" (policy + re-read).
- 2026-07-15 (v3) — two-beat mental model + natural-language intent map + MOVE execution summary.
- 2026-07-15 (v2) — greenlight re-read: gate fires again on greenlight, forcing a fresh doc load before writing.
- 2026-07-15 (v1) — created; agent-agnostic trigger decoupling the inbox interrogation from Milo.
