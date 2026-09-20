# Agent Task Scan — Boot-Time Assignment Discovery

> **Hook type:** read-only scan, fires during the persona load contract.
> **Trigger:** load contract step 5b (between wiring confirmation and inhabit).
> **Author:** Brain, 2026-09-17. **Steward:** Fleet Felix (fleet infrastructure).
> **v2:** 2026-09-20 — mandatory stamp + hook-displacement clause. See Revision history.

## Purpose

A workspace-level Labels custom field called **Agent Assignee** lets Michael
tag any task, in any Space, to one or more named super-agents. This hook
makes those assignments visible to the agent at boot, so work tagged to
them becomes part of their session context without Michael having to
remember to mention it.

⭐ **Why it matters more than it looks:** this is the ONE surface in the load
contract that is addressed TO the agent. Every other step reads context about
the world. A missed scan is not a missed data source, it is an unanswered
request — and Michael has no way to tell the difference between an agent that
read its assignments and chose not to act, and one that never looked.

## When it fires

During the persona load contract (super-agent-base.md), after confirming
wiring (step 5) and before inhabiting (step 6). It is a READ, never a
write. It surfaces findings in the session greeting; it does not create,
move, or modify any task.

### 🔴 A DOMAIN HOOK NEVER DISPLACES THE CONTRACT (added v2)

One trigger phrase can fire a domain hook **and** the persona load contract in
the same breath. `milo morning wakeup` is the canonical case: it pulls
`hooks/morning-briefing.md` (23,122 B) **and** loads Mainstage Milo.

**The failure mode:** a big domain hook arrives carrying a complete, ordered
agenda that reads like the whole job. The contract's own steps — 4b Scoreboard,
**5b this scan** — get silently displaced by it, because the hook's agenda is
louder and more specific than the contract's list. Nothing errors. The session
feels thorough.

**The rule:** a domain hook's agenda is ADDITIVE to the load contract, never a
substitute for it. Steps 4b and 5b run on a combo invocation exactly as they do
on a bare `/session.agent=<Name>`. **If a hook's agenda and the contract
compete for the front of the session, the contract wins and the hook's first
section waits.** Proven live: 2026-09-20, Milo morning wakeup, four assignments
unread including one comment addressed to Milo by name, posted 17 minutes after
the brief shipped.

## Procedure

1. **Query open tasks** where the "Agent Assignee" field includes the
   current agent's canonical label (the emoji + display name as it
   appears in the field, e.g. "🎭 Mainstage Milo").

2. **Filter to actionable work.** Exclude closed tasks. The Agent
   Activity Board session tasks are not actionable assignments (they
   are session wrappers); include them only if explicitly relevant.

2b. **Read the COMMENTS on anything surfaced, not just the row (added v2).**
   A label is how a task gets tagged; a comment is how a request gets MADE. The
   09-20 miss was not a missing field value, it was an unread comment on a task
   whose field was set correctly. A scan that reads rows and skips comments will
   report the assignment and miss the ask. **Also check `created_at`:** separate
   what pre-dated this session from what arrived during it, and report the split
   rather than one inflated number — 14 tagged tasks where only 4 pre-dated the
   session is a 4-task miss, and saying 14 is theatre.

3. **Surface in the greeting — THE STAMP IS MANDATORY (v2).**
   After the self-announce header, before addressing the prompt, emit ONE line,
   **always, including the zero case**:
   - Assignments found: `📋 **Agent Assignee:** N open task(s) tagged to me`
     followed by a compact list (name + list + status, max 10; say
     "+ N more" if over 10).
   - None found: `📋 **Agent Assignee:** none`
   - Query failed or field unreachable: `📋 **Agent Assignee:** ⚠️ scan failed — <reason>`
     **Never** render a failure as `none`.

   ~~If none: skip silently. Do not report an empty scan.~~ **STRUCK 2026-09-20.**
   That rule made **never ran** and **found nothing** render identically, which
   left the hook with no falsifiable artifact and made its own non-firing
   invisible. The stamp IS the proof the step ran, same function as the spine
   line and the Task-Context Orientation Gate's 🧭 stamp: **no stamp = the hook
   did not fire.** Three surfaces in this repo now carry that pattern and this is
   the third, deliberately.

4. **Do not act on them unprompted.** The scan is awareness, not a
   work order. The agent may reference tagged tasks when they are
   relevant to the session topic, but does not start working them
   unless Michael directs it. ⚠️ **Awareness is not silence, though:** a
   surfaced task carrying a direct unanswered request to this agent gets NAMED
   in the stamp block. Not acting is a choice about scope; not mentioning it is
   just a second miss.

## The field

- **Name:** Agent Assignee
- **Type:** Labels (multi-select)
- **Location:** Workspace level
- **Labels:** the active super-agent set, canonical emoji + display name.
  The label list is maintained manually; when an agent is added,
  renamed, or retired, the field options are updated in the same pass.
  ⚠️ **Never write a fleet COUNT here** (Known-Drift Register D3) — ~~28 active
  super-agents~~ struck 2026-09-20; the 🤖 Agent Index list IS the count.
- 🔴 **A label that does not exist yet returns EMPTY, and empty looks clean.**
  No tool can add an option to a live Labels field, so a newly built agent has
  no label until Michael creates it by hand. Until then this hook returns zero
  for them — correctly, and uselessly (live case: Vellum Victoria, 2026-09-20).
  **A `none` stamp from an agent whose label you have not confirmed exists is
  unverified, not clean.** Say so in the stamp.

## Guardrails

- **Read-only.** This hook never writes to the field or to any task.
- **No false positives.** Match the canonical label exactly; do not
  fuzzy-match on partial names.
- ~~**No noise on empty.** An agent with zero assignments skips the
  block entirely.~~ **REVERSED 2026-09-20 — see Procedure step 3.** The stamp
  fires on every load, zero included. A one-line `none` is not noise; it is the
  only thing that distinguishes a clean scan from a skipped one.
- **Session tasks are not assignments.** An Agent Activity Board
  session task that happens to carry the label is a wrapper, not work.
  Filter it unless the session topic is explicitly about the board.
- **Never report only one surface.** This hook is a SURFACE PRECEDENCE consumer
  (`hooks/report-normalization.naming.md` → SURFACE PRECEDENCE): the field, the
  task body, and the comments are three surfaces on one assignment. Read all
  three before reporting, and name which one carried the ask.

## Parent law

The v2 stamp is **not a net-new rule.** It is `hooks/silent-fallback-law.md`
applied to a hook rather than to app code:

> *"A fallback that does not announce itself is not graceful degradation, it is
> a lie."*

And its corollary lands exactly on v1's silent-on-empty clause:

> *"Resilience features are the prime suspects. Every silent-fallback bug found
> so far was originally added to make something more robust."*

v1's silence WAS a robustness feature — it existed to keep greetings clean. It
made the hook's own failure unobservable. Same law, new surface; a FOLD-IN, not
a second rule. Dexter stewards that law and should see this application.

## Revision history

**v2 — 2026-09-20.** Michael: *"it should be part of your AGENT load to look."*
It already was: step 5b has pointed here since it was written, and this file has
existed since 09-17. It did not fire on the 09-20 Milo morning wakeup and
nothing recorded that it hadn't. Two structural fixes, neither about discipline:
the mandatory stamp (silent-on-empty struck) and the hook-displacement clause.
The diagnosis that produced both: the miss was found only because Michael asked,
which is the same way the 09-17 activity-log gap on this same fleet was found.
**A step with no artifact is a step with no evidence, and every such step in
this repo has eventually gone unrun.**

Written DIRECT TO MAIN — no `create_branch` tool in that session's kit, only
`create_pull_request` / `merge_pull_request`. Declared rather than hidden; the
branch→PR→self-merge rule stands and was not waived, just unexecutable.

**v1 — 2026-09-17.** Born with the Agent Assignee field.
