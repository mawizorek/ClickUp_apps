---
id: inbox-triage-trigger
name: INBOX Triage Trigger
shelf: gates
kind: routing
trigger: Any agent assigned to a task in URITP ▸ INBOX ▸ Default (list id 901327608568).
nicknames: [Inbox Trigger, Triage Trigger]
procedure_source: ClickUp — "INBOX Email Intake Triage — Agent Reference" (Brain Reference Library ▸ URITP). Canonical + only home of the steps.
version: 2
added: 2026-07-15
---

# INBOX Triage Trigger (🔑 Gate)

**Fires when any agent is assigned to a task in URITP ▸ INBOX ▸ Default (`901327608568`).** The assignment is the signal to run a first-pass inbox interrogation on the captured email task. Agent-agnostic by design: the routine is no longer coupled to Mainstage Milo — whoever the auto-assign automation lands on runs it.

## The routing
1. On assignment to an INBOX ▸ Default task, load the ClickUp procedure doc (see `procedure_source` in the front-matter) and run it live.
2. Follow that doc verbatim: Step 0 (rename + mirror email → comments), first-pass fields, MOVE vs COMBINE, Plan Comment, mandatory greenlight gate.
3. Return control per the doc (self-unassign is automated elsewhere).

## Greenlight re-read (SECOND FIRING — the write moment)
**The gate fires TWICE: once on assignment (plan), once on greenlight (execute).** Greenlight is the highest-stakes moment — it's the turn that actually writes to canonical tasks — and a fresh agent (or a long gap) will have lost the procedure from context. So on ANY greenlight signal (e.g. "greenlight," "proceed," "execute the greenlit INBOX pattern," "go ahead and MERGE/MOVE"):

1. **RE-LOAD the ClickUp procedure doc before touching anything.** Do not execute from memory of the plan or of "what the routine probably says." The plan comment is not the procedure; the doc is.
2. **Execute the named routine (MOVE or COMBINE) verbatim** per the doc — including the full COMBINE standard: first comment = full verbatim email (header + body) and nothing else; second comment = notes/response; backtrack comment on the intake task; linked-tasks relationship; name the exact destination task by full title + link; close intake to the list's CLOSED-type status. Apply any operator addendums from the greenlight ON TOP of the base steps — addendums modify, they never replace the procedure.
3. Only after the doc is freshly loaded do the writes happen. Re-reading the doc IS the gate at greenlight, exactly as it is at assignment.

> Why: without a forced re-read, agents post the plan correctly then skip the defined MOVE/COMBINE steps on execution because the procedure has fallen out of context. The greenlight is precisely where the destructive writes land, so it needs the same live-read discipline as the first pass.

## Source-of-truth split (LOCKED)
**The procedure lives ONLY in the ClickUp doc. This file holds ONLY the trigger + routing — never the steps.** git and ClickUp never both carry the same instruction. If you find triage steps duplicated into this file, delete them and point back to the doc. The doc wins; this stub just says *when* to go read it (assignment AND greenlight) and *who* it applies to (anyone, not just Milo).

## Why decouple from Milo
The interrogation was written to be agent-portable from the start ("any agent assigned to a task in this list loads this page and follows it"). Only the auto-assign automation named Milo specifically. Flip that automation from "assign Milo" to "assign the on-duty agent" and any agent triggers the full routine — no single-agent dependency.

## NO-BYPASS
When assigned to an INBOX ▸ Default task — or when greenlit to execute — load the ClickUp procedure doc and act on it. Never run the interrogation OR the greenlit MOVE/COMBINE from memory of what it "probably says" — other agents edit that doc without notice, so the live read IS the gate.

## Changelog
- 2026-07-15 (v2) — added the **Greenlight re-read**: the gate now fires a second time on greenlight, forcing a fresh doc load before any MOVE/COMBINE write. Closes the gap where agents posted the plan then skipped the defined execution steps.
- 2026-07-15 (v1) — created; agent-agnostic trigger decoupling the inbox interrogation from Milo.
