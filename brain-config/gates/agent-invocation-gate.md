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

## 🚨 Name-collision resolution: "Wes" / "/wes" (LOCKED 2026-07-19)

**There are two agents whose name is “Wes.” Resolve EVERY live “Wes” / “/wes” invocation to the LIVE one:**

- ✅ **`workhorse-wes` (Workhorse Wes) — ACTIVE.** Any live invocation — `/wes`, “Wes,” “run Wes,” “Wes here” — routes HERE. This is the announce-only standing-presence agent.
- 🪦 **`workshop-wes` (Workshop Wes) — RETIRED/NULL, NEVER invocable.** It was decomposed 2026-07-04 into The Workshop (7 lenses) + Future Faye. It is a tombstone. **“/wes” MUST NOT resolve to it, and MUST NOT trigger “Mira convenes the Workshop.”** The Workshop is invoked by its OWN tokens only: “workshop this,” “run it by the team/workshop,” “convene the team” — **never by “wes.”**

**Why this rule exists (the misfire it fixes):** on 2026-07-19 a live `/wes` in another session resolved to the retired Workshop Wes and fired “Mira convenes the Workshop” instead of the live Workhorse Wes. Root cause: the tombstone carried a “inbound ‘Wes’ references resolve here” note that a fresh invocation token matched. Corrected: only historical PROSE mentions of “Workshop Wes” point at the tombstone for context; the live invocation token “wes”/“/wes” belongs to Workhorse Wes. If you ever mean the old decomposition, say “Workshop Wes” in full or invoke “the Workshop” directly.

**One-line test:** bare “Wes” or “/wes” → Workhorse Wes (announce). Want the team? Say “workshop” / “the team.” Want the tombstone? You almost never do — say “Workshop Wes” in full.

---

## Rules

- **Nicknames count.** Each agent profile lists nicknames. All variants go through this same gate.
- **Context wins.** If the conversation has been about a real person named [X] for several messages, a bare mention of [X] is almost certainly still about the person.
- **Command words are strong signals.** "run," "spin up," "deploy," "audit," "check," "review" + name = agent invocation.
- **This gate is lightweight.** It should take <1 second of reasoning. Don't turn it into a deliberation.
- **A retired/tombstoned agent is NEVER a live invocation target.** A near-name collision with a retired agent resolves to the LIVE holder of that name (see the Wes rule above). Tombstones exist for historical link resolution + context, not for routing fresh commands.

---

## Composes with

- Fires as part of the 🧠 Subagent roster evaluation.
- Does NOT apply to 🔄 Hooks or 🎯 Triggers (they have their own deterministic triggers).
- If the gate passes (fire the agent): load the agent profile from `brain-config/agents/` and execute.
- **Agent Name-Collision Gate** (`gates/agent-name-collision-gate.md`) is the WRITE-side counterpart: it should have forced a distinct invocation token when Workhorse Wes was created. The Wes collision above is the read-side patch for a name that shipped anyway (Michael chose to reuse the first name deliberately).

---

## Changelog

- 2026-07-19: **Added the “Wes”/“/wes” name-collision resolution** — live invocation routes to the ACTIVE Workhorse Wes, never the retired Workshop Wes tombstone (which must not fire “Mira convenes the Workshop”). Fixes a live misfire where `/wes` resolved to the tombstone. Added the general rule that a retired agent is never a live invocation target. Prompted by Michael (screenshot of the misfire).
- 2026-07-03: Initial version. Introduced a new `gates/` folder in brain-config for workflow gates that aren't hooks (no trigger table signal) but aren't agents either.
