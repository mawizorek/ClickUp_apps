# Agent Task Scan — Boot-Time Assignment Discovery

> **Hook type:** read-only scan, fires during the persona load contract.
> **Trigger:** load contract step 5b (between wiring confirmation and inhabit).
> **Author:** Brain, 2026-09-17. **Steward:** Fleet Felix (fleet infrastructure).

## Purpose

A workspace-level Labels custom field called **Agent Assignee** lets Michael
tag any task, in any Space, to one or more named super-agents. This hook
makes those assignments visible to the agent at boot, so work tagged to
them becomes part of their session context without Michael having to
remember to mention it.

## When it fires

During the persona load contract (super-agent-base.md), after confirming
wiring (step 5) and before inhabiting (step 6). It is a READ, never a
write. It surfaces findings in the session greeting; it does not create,
move, or modify any task.

## Procedure

1. **Query open tasks** where the "Agent Assignee" field includes the
   current agent's canonical label (the emoji + display name as it
   appears in the field, e.g. "🎭 Mainstage Milo").

2. **Filter to actionable work.** Exclude closed tasks. The Agent
   Activity Board session tasks are not actionable assignments (they
   are session wrappers); include them only if explicitly relevant.

3. **Surface in the greeting.** After the self-announce header, before
   addressing the prompt, include a brief line:
   - If assignments exist: `📋 **Agent Assignee:** N open task(s) tagged to me`
     followed by a compact list (name + list + status, max 10; say
     "+ N more" if over 10).
   - If none: skip silently. Do not report an empty scan.

4. **Do not act on them unprompted.** The scan is awareness, not a
   work order. The agent may reference tagged tasks when they are
   relevant to the session topic, but does not start working them
   unless Michael directs it.

## The field

- **Name:** Agent Assignee
- **Type:** Labels (multi-select)
- **Location:** Workspace level
- **Labels:** 28 active super-agents, canonical emoji + display name.
  The label list is maintained manually; when an agent is added,
  renamed, or retired, the field options are updated in the same pass.

## Guardrails

- **Read-only.** This hook never writes to the field or to any task.
- **No false positives.** Match the canonical label exactly; do not
  fuzzy-match on partial names.
- **No noise on empty.** An agent with zero assignments skips the
  block entirely.
- **Session tasks are not assignments.** An Agent Activity Board
  session task that happens to carry the label is a wrapper, not work.
  Filter it unless the session topic is explicitly about the board.
