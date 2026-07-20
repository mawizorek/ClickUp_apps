# Agent Invocation Gate

**Purpose:** Disambiguation layer for all subagent invocations. Prevents false-positive fires when Michael mentions a name in conversation that happens to match an agent name (Michael works with real people who may share agent names). **Also carries the invocation-mode contract** (bare name vs name+context) and the per-agent soft-gate dial — see below.

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

## 🎛️ Invocation modes: bare name vs name + context (LOCKED 2026-07-20, Michael)

Invoking an agent has two shapes. They are the SAME agent invoked two ways, NOT two kinds of agent.

<p><br/></p>

**Mode A — bare name (context = null): "run your thing."** A naked invocation ("Routine Ricky." / "Hey Ricky" with no situation attached) means: **run the agent's documented DEFAULT runbook, with no other input, and proceed through it.** The agent points at a standalone, separately-documented runbook; the bare name is a convenience alias that fires that runbook at `context=null`.

**Mode B — name + context: "here's the situation, apply yourself."** The persona is applied to Michael's supplied input, the normal way every lens/agent already runs.

<p><br/></p>

**The runbook is decoupled from the persona (the core principle).** A routine an agent runs is a STANDALONE documented hook/runbook (in the repo, or a linked ClickUp doc), directly invocable on its own — Michael can open any session, point at that document, and say "run this process," and it executes identically to the bare-name call. The agent name is just a friendly door to it. The routine is NEVER baked INTO the persona as a hardcoded "pull this, run this" pipeline — that's too procedural and it's not what a Super Agent is. **Super Agents are personalities; this is a convenience layer for accessing dense routines that happens to share an agent's name.**

<p><br/></p>

**Default vs menu (the Ricky problem).** An agent with MANY routines (e.g. Routine Ricky's data polls: sports, market data, weather) cannot run all of them on a bare call. Such a profile MUST declare, explicitly:
- **`default_runbook`** — the ONE routine that fires on a naked name invocation ("Routine Ricky." → his standard refresh).
- **the menu** — the named routines invoked with an explicit target ("Ricky, run the weather pull").
If no `default_runbook` is defined, a bare call does NOT auto-execute — it asks which routine (see the soft gate). Getting Ricky's default-vs-menu line right is the canonical stress test for this whole model.

---

## 🔉 Soft gate — per-agent dial (`gate_strength`, LOCKED 2026-07-20, Michael)

Before auto-executing a full runbook on a bare-name call, an agent may hold a **soft gate** ("run the full routine, or are you driving?"). How hard it holds is **NOT global — it's a per-agent dial** declared in the profile front-matter, so different agents sit at different points on the spectrum:

<p><br/></p>

- **`gate_strength: auto`** — bare name runs the default runbook immediately, no confirm. For cheap/idempotent/well-worn routines (Ricky's standard refresh trends here once trusted).
- **`gate_strength: confirm`** — bare name surfaces a one-line "run the full <default> now?" before firing. The middle default for anything with cost or side effects.
- **`gate_strength: always-ask`** — never auto-runs; a bare name always asks what's wanted. For agents whose "thing" is fuzzy or whose official hat is less literally a routine (the gray-area agents).

<p><br/></p>

**The spectrum is the point.** Ricky (personality running procedure) sits toward `auto` — quintessential runbook agent. As agents get "official hats" that are less literally a fixed routine, they move toward `always-ask`. The dial makes that explicit and auditable instead of vibes. Default when unset: **`confirm`** (safe middle; never silently auto-fire a multi-step routine nobody asked to run).

---

## 🗣️ Slash-command fuzzy-resolve (voice/dictation aware; cross-ref Clarify First → Clara lens)

A near-miss command token resolves to the closest canonical invocation grammar rather than being read literally as a name. Canonical grammar lives in `registry.json → session_commands`: `/session-start`, `/session-start=<Name>`, `/session.agent=<Name>`. Fuzzy aliases — `/command <Name>`, `/agent <Name>`, `/call <Name>` — route to `/session.agent=<Name>`, resolving `<Name>` via `super-agents/superagents.json`. Proceed with a one-line reading ("reading '/command Felix' as invoke Fleet Felix") when the name resolves; only ask when the token is genuinely unresolvable. *(Michael dictates on every device; a mangled command token is a transcription artifact, not a new agent name — see the 🎙️ Clara lens in Clarify First.)*

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
- **Bare name = Mode A (context=null runbook).** A clean standalone agent name with no attached situation runs the agent's `default_runbook`, subject to its `gate_strength`. No default defined → ask which routine.
- **The runbook is standalone + directly invocable.** "Run this process" pointed at the runbook doc == the bare-name call. The persona references the runbook; it never hardcodes it.
- **This gate is lightweight.** It should take <1 second of reasoning. Don't turn it into a deliberation.
- **A retired/tombstoned agent is NEVER a live invocation target.** A near-name collision with a retired agent resolves to the LIVE holder of that name (see the Wes rule above). Tombstones exist for historical link resolution + context, not for routing fresh commands.

---

## Composes with

- Fires as part of the 🧠 Subagent roster evaluation.
- Does NOT apply to 🔄 Hooks or 🎯 Triggers (they have their own deterministic triggers).
- If the gate passes (fire the agent): load the agent profile from `brain-config/agents/` (or `super-agents/` for git-teammates) and execute; on a bare-name call, load and run its `default_runbook` subject to `gate_strength`.
- **Clarify First → Clara lens** owns the dictation-artifact reparse that feeds the slash-command fuzzy-resolve above.
- **Agent Name-Collision Gate** (`gates/agent-name-collision-gate.md`) is the WRITE-side counterpart: it should have forced a distinct invocation token when Workhorse Wes was created. The Wes collision above is the read-side patch for a name that shipped anyway (Michael chose to reuse the first name deliberately).

---

## Changelog

- 2026-07-20: **Added the invocation-mode contract + per-agent soft-gate dial.** Bare name (context=null) runs the agent's `default_runbook`; name+context applies the persona to input. Runbooks are standalone + directly invocable ("run this process" by URL == bare-name call); the persona points at the runbook, never hardcodes it (Super Agents are personalities + a convenience layer over dense routines). Added `gate_strength` (auto | confirm | always-ask; default confirm) as a per-agent dial. Added the slash-command fuzzy-resolve cross-ref to the Clara lens. Routine Ricky named as the canonical stress test (default_runbook vs menu). Prompted by Michael across the /command-Felix → speech-to-text → routine-agent thread.
- 2026-07-19: **Added the “Wes”/“/wes” name-collision resolution** — live invocation routes to the ACTIVE Workhorse Wes, never the retired Workshop Wes tombstone (which must not fire “Mira convenes the Workshop”). Fixes a live misfire where `/wes` resolved to the tombstone. Added the general rule that a retired agent is never a live invocation target. Prompted by Michael (screenshot of the misfire).
- 2026-07-03: Initial version. Introduced a new `gates/` folder in brain-config for workflow gates that aren't hooks (no trigger table signal) but aren't agents either.
