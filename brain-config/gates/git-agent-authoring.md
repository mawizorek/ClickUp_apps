# Gate: When Creating / Editing Git Super-Agents (and their Tools)

**Fires before authoring or materially editing any agent under `brain-config/super-agents/`, OR
any tool an agent would run.** This is the "how to BUILD one" authoring standard; the runtime
"how to BE one" lives in `brain-config/super-agents/_shared/super-agent-base.md`. It is the git
equivalent of the ClickUp Golden Config Skeleton, adapted for session-invocable git personas.

---

## 🏛️ Founding law (applies to EVERY agent + tool decision)

1. **Same brain, different profile.** An agent is the same Brain wearing a profile. Capability
   lives in the shared tool stack; the agent is context + personality over it. This is why tools
   compose across all agents and platforms — build the capability once as a tool, not per-agent.
2. **Agents are ONLY EVER hands executing written tools.** An agent NEVER stores real procedure in
   its own config/files. Procedure = a standalone tool (hook / gate / skill / reference doc) with
   its own home; the agent triggers and stewards it. Agent files = context + personality only.
3. **🚦 Procedure-is-a-tool gate (HARD, fires before ANY self-write of memory/procedure OR any new
   agent-embedded step):** ask *"Is this a standalone tool that should be triggered instead?"* The
   answer is YES, always. If you're about to write how-to into an agent's `memory.md` /
   `preferences.md`, STOP — author it as a tool and leave only a POINTER in the agent. This is the
   authoring-side twin of the same gate in the runtime base spec.
4. **Routines are stewarded, not stored.** A routine an agent runs lives as a tool the agent OWNS
   editing; the agent's memory points to it, the deep procedure lives in the tool.
5. **Decision logs by home:** topic decisions → the topic's page; agent-self decisions → the
   agent's `decision-log.md`. Never store topic procedure in an agent.

These five bind tool authoring too: when building ANY tool, the test is "does capability live in a
triggerable tool, with agents only pointing at it?" If a capability is getting baked into a
persona, that's the smell this gate exists to catch.

---

## Two-tree law (know which tree you're in)

- `brain-config/agents/` = ephemeral **Council/Workshop lenses** (Rhys, Beckett, Cleo, Polly, Finn,
  Skye, Enzo, Frank, Sally, Stu, ...). Stateless processing verbs. NO personal memory. NOT
  session-invocable as a standing persona.
- `brain-config/super-agents/` = persistent **teammates** (Wes, Corey, Felix, Mira, Anna, Milo,
  Maggie, Dexter, Sage, Clio, ...). Full context bundle, base pointer, invoked via
  `/session.agent=<Name>`, hold memory across sessions.

⚠️ **Both lists rot — `roster.json` is authoritative, never these examples.** Mira and Anna were
named here as lenses long after they graduated (corrected 2026-07-27). Two trees is a STORAGE fact,
not a hierarchy: `class` means persistence, not rank (base spec Constitution §6). A lens graduates
for exactly one reason — it needs MEMORY.

A persona that needs to accumulate context and be inhabited for a whole session belongs in
`super-agents/`. A pure processing lens belongs in `agents/`. Migrating a lens → teammate means
moving it into `super-agents/` with the full bundle and redirecting the old lens file to a
tombstone.

---

## Required file set (create ALL)

**Canonical list lives in the base spec** (`_shared/super-agent-base.md` → File set) so there is
ONE description of a bundle. Do not restate it here; it drifted once already (this gate omitted
`memory/archive/` and `activity-log/` for weeks).

`preferences.md` MUST open with:
`> Follow the shared base first — brain-config/super-agents/_shared/super-agent-base.md — then personalize below.`

---

## Authoring checklist

1. **Name-collision gate** (`brain-config/gates/agent-name-collision-gate.md`): scan live ClickUp
   Super Agents + `roster.json` + the super-agents fleet. A retired/tombstoned agent is NEVER a live
   invocation target (see B11). Distinguish live invocation tokens from historical prose refs.
2. **Profile stays behavior-only.** No stored how-to (Founding law §2–§3). Point OUT to tools for process.
3. **Load manifest = deep by default.** Full memory + full decision-log + long activity window.
4. **Per-response logging wired.** The profile assumes the runtime logging mandate (session-task
   transcript per reply + frequent memory/activity fills + provenance). Don't re-author it — it's
   in the base spec; just don't contradict it.
5. **Slash trigger.** Register `/session.agent=<Name>` as a literal Quick-Scan Trigger Table row
   in the AI Toolkit index → pointing at the base spec load contract.
6. **Registration (SAME SESSION): add the agent's row to `roster.json`.** ~~Mirror-pair registration
   into BOTH `superagents.json` AND the AI Toolkit index roster + `registry.json`.~~ STRUCK
   2026-07-27: the mirror-pair mandate was RETIRED 2026-07-25 and `registry.json` is a tombstone
   stub (PR #483). **`roster.json` is the single documented source — one flat list, one row per
   agent.** No pair means no sync obligation, and resurrecting a second manifest to mirror it is the
   duplication that was retired. Keep the roster under ~12KB (slim rule) and update the AI Toolkit
   index's behavioral trigger row for the agent in the same pass.
7. **PR-merge workflow** (GitHub Operating Standard): branch → commit → PR → self-merge → report.
8. **Session task + transcript** for the authoring session (Agent Activity Board).

---

## Editing an existing super-agent

- Stale Context Reload: re-fetch the file via blob API before editing (never a carried SHA).
- Behavior changes → `preferences.md`. Accumulated context → `memory.md`. Reasoning → `decision-log.md`.
- Procedure change → the TOOL it lives in, NOT the agent (Founding law §3). Agent keeps only the pointer.
- What-changed = git history + PR description. Never an inline changelog.
