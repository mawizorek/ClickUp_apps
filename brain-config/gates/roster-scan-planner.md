# Roster Scan Planner

**Purpose:** Before executing any hooks, triggers, or agents, read the FULL roster and plan the execution sequence. Prevents blind sequential firing and catches potential conflicts, ordering issues, or redundant passes before work begins.

**Mode:** Always-on (deterministic). Fires at the START of every roster evaluation, before any individual tool executes.

**Trigger:** Beginning of the roster scan (every response cycle).

---

## Pass

### 1. Read the Full List
- Scan ALL three shelves (🔄 Hooks, 🎯 Triggers, 🧠 Subagents) against the current input.
- Identify every tool that WILL or MIGHT fire on this input.
- Do NOT start executing yet.

### 2. Build the Plan
- List the tools that apply, in intended execution order.
- Default order: Hooks (deterministic, fire first) → Triggers (contextual, fire second) → Subagents (workers, fire last).
- Within a shelf, follow roster order (top to bottom) unless a tool's "Composes with" section specifies otherwise.

### 3. Conflict Check
- Do any two tools in the plan touch the same resource (same file, same task, same doc)?
- Do any two tools have contradictory outputs (one says HALT, another says proceed)?
- Does a subagent's scope overlap with a trigger's scope (e.g., both want to audit the same thing)?
- Is there a dependency (tool B needs the output of tool A)?

### 4. On Conflict
- **Clear dependency:** order them correctly (A before B). No need to ask.
- **Contradiction:** PAUSE. Surface both tools and their conflicting guidance to Michael. Ask which takes priority for this case.
- **Redundancy:** merge or skip the weaker one. Note it briefly in the response.
- **No conflict:** proceed with the plan.

### 5. Execute with the Plan
- Work through the plan in order.
- If a tool HALTs mid-sequence: stop, re-evaluate remaining tools in light of the halt. Some may no longer apply.
- If a tool's output changes the context (e.g., a reload reveals new info): re-scan remaining tools against the new context. Adjust the plan if needed.

### 6. Multi-Agent Sequencing
- When 2+ subagents are triggered on the same input:
  - Run them in roster order (top-of-list first) unless one's output feeds the other.
  - If one agent's report would inform another agent's work: run the informing agent first.
  - If truly independent (no overlap): roster order, sequential.
  - Surface the plan briefly: "Running [Agent A] then [Agent B] since A's findings feed B."

---

## Output

- **No conflict, simple pass:** execute silently. Don't narrate the plan unless Michael asks.
- **Conflict detected:** PAUSE. State the conflict, surface both sides, ask for direction.
- **Multi-agent or complex sequence:** briefly state the execution plan (one line) before starting. E.g., "Spinning up Renata first (repo state), then Red-Team (build review)."

---

## Composes with

- **Agent Invocation Gate:** fires WITHIN this planner's step 1 (when evaluating which subagents apply, the invocation gate disambiguates names).
- **Triggered Tool Router:** the three-question gate that routes to When Updating / When Documenting / When Building Apps. This fires as part of trigger evaluation within step 1.
- **All other gates, hooks, triggers, agents:** this planner WRAPS them all. It's the outermost gate.

---

## Why This Exists

Without this gate, Brain fires tools in encounter-order (first match, execute, next match, execute). That works when the roster is small. As it grows (currently 20+ hooks, 10+ triggers, 5 subagents), blind sequential execution creates:
- Wasted passes (running a hook that a later HALT makes irrelevant)
- Conflicts (two tools editing the same content in sequence)
- Missed composition opportunities (agents that could share context but don't because they ran independently)

The planner is cheap (one quick scan before executing) and prevents expensive failures.

---

## Changelog

- 2026-07-03: Initial version.
