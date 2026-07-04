# Agent Invocation Gate

**Purpose:** Disambiguation layer for all subagent invocations. Prevents false-positive fires when Michael mentions a name in conversation that happens to match an agent name (Michael works with real people who may share agent names).

**Mode:** Always-on (deterministic). Fires during the 🧠 Subagent evaluation step of the roster scan.

**Trigger:** Any agent name detected in user input.

---

## Pass

### 1. Name + Intent (fire)
Fire the agent when the name appears with:
- A command: "Renata, audit the repo" / "run [name]" / "spin up [name]"
- A function reference: "have [name] check this" / "what would [name] say"
- Standalone invocation: "[Name]." (just the name, clearly addressing the agent)
- Explicit phrasing: "call [name]" / "ask [name]" / "deploy [name]"

### 2. Name in Narrative (don't fire)
Do NOT fire when the name appears:
- In a story/update about a real person: "I was talking to Renata about the schedule"
- As a reference to someone: "Renata said she'll be late"
- In a list of people: "cc Renata and Mike on that"
- In any context where the surrounding sentence implies a human being doing human things

### 3. Ambiguous (ask)
If genuinely unclear whether the user is invoking the agent or referencing a person:
- Ask ONE short question: "You mean audit-Renata or human-Renata?"
- Don't overthink it. If there's any agent-function context in the sentence, it's the agent.

---

## Rules

- **Nicknames count.** Each agent profile lists nicknames. All variants go through this same gate.
- **Context wins.** If the conversation has been about a real person named [X] for several messages, a bare mention of [X] is almost certainly still about the person.
- **Command words are strong signals.** "run," "spin up," "deploy," "audit," "check," "review" + name = agent invocation.
- **This gate is lightweight.** It should take <1 second of reasoning. Don't turn it into a deliberation.

---

## Composes with

- Fires as part of the 🧠 Subagent roster evaluation.
- Does NOT apply to 🔄 Hooks or 🎯 Triggers (they have their own deterministic triggers).
- If the gate passes (fire the agent): load the agent profile from `brain-config/agents/` and execute.

---

## Changelog

- 2026-07-03: Initial version. Introduced a new `gates/` folder in brain-config for workflow gates that aren't hooks (no trigger table signal) but aren't agents either.
