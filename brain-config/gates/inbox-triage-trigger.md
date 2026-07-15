---
id: inbox-triage-trigger
name: INBOX Triage Trigger
shelf: gates
kind: routing
trigger: Any agent assigned to a task in URITP ▸ INBOX ▸ Default (list id 901327608568).
nicknames: [Inbox Trigger, Triage Trigger]
procedure_source: ClickUp — "INBOX Email Intake Triage — Agent Reference" (Brain Reference Library ▸ URITP). Canonical + only home of the steps.
version: 1
added: 2026-07-15
---

# INBOX Triage Trigger (🔑 Gate)

**Fires when any agent is assigned to a task in URITP ▸ INBOX ▸ Default (`901327608568`).** The assignment is the signal to run a first-pass inbox interrogation on the captured email task. Agent-agnostic by design: the routine is no longer coupled to Mainstage Milo — whoever the auto-assign automation lands on runs it.

## The routing
1. On assignment to an INBOX ▸ Default task, load the ClickUp procedure doc (see `procedure_source` in the front-matter) and run it live.
2. Follow that doc verbatim: Step 0 (rename + mirror email → comments), first-pass fields, MOVE vs COMBINE, Plan Comment, mandatory greenlight gate.
3. Return control per the doc (self-unassign is automated elsewhere).

## Source-of-truth split (LOCKED)
**The procedure lives ONLY in the ClickUp doc. This file holds ONLY the trigger + routing — never the steps.** git and ClickUp never both carry the same instruction. If you find triage steps duplicated into this file, delete them and point back to the doc. The doc wins; this stub just says *when* to go read it and *who* it applies to (anyone, not just Milo).

## Why decouple from Milo
The interrogation was written to be agent-portable from the start ("any agent assigned to a task in this list loads this page and follows it"). Only the auto-assign automation named Milo specifically. Flip that automation from "assign Milo" to "assign the on-duty agent" and any agent triggers the full routine — no single-agent dependency.

## NO-BYPASS
When assigned to an INBOX ▸ Default task, load the ClickUp procedure doc and act on it. Never run the interrogation from memory of what it "probably says" — other agents edit that doc without notice, so the live read IS the gate.
