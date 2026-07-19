# Gate: When Creating / Editing Git Super-Agents

**Fires before authoring or materially editing any agent under `brain-config/super-agents/`.**
This is the "how to BUILD one" authoring standard; the runtime "how to BE one" lives in
`brain-config/super-agents/_shared/super-agent-base.md`. It is the git equivalent of the
ClickUp Golden Config Skeleton, adapted for session-invocable git personas.

---

## Two-tree law (know which tree you're in)

- `brain-config/agents/` = ephemeral **Council/Workshop lenses** (Mira, Anna, Cass, Skye, ...).
  Stateless processing verbs. NO personal memory. NOT session-invocable as a standing persona.
- `brain-config/super-agents/` = persistent **teammates** (Milo, Corey, Wes, ...). Full context
  bundle, base pointer, invoked via `/session.agent=<Name>`, hold memory across sessions.

A persona that needs to accumulate context and be inhabited for a whole session belongs in
`super-agents/`. A pure processing lens belongs in `agents/`. Migrating a lens → teammate means
moving it into `super-agents/` with the full 4-file bundle and redirecting the old lens file.

---

## Required file set (create ALL)

```
super-agents/<slug>/
  preferences.md    # profile: base pointer FIRST line, then identity + voice + lane + load manifest
  memory.md         # accumulated context only (never process/skills)
  activity-log.md    # rolling session ledger (newest on top, append-only)
  decision-log.md   # reasoning trail, Decision-Log Gold-Standard format
  README.md         # steward metadata (fleet convention)
```

`preferences.md` MUST open with:
`> Follow the shared base first — brain-config/super-agents/_shared/super-agent-base.md — then personalize below.`

---

## Authoring checklist

1. **Name-collision gate** (`brain-config/gates/agent-name-collision-gate.md`): scan live ClickUp
   Super Agents + registry + super-agents fleet. A retired/tombstoned agent is NEVER a live
   invocation target (see B11). Distinguish live invocation tokens from historical prose refs.
2. **Profile stays behavior-only.** No stored how-to. Point OUT to the AI Toolkit / gates for process.
3. **Load manifest = deep by default.** Full memory + full decision-log + long activity window.
4. **Slash trigger.** Register `/session.agent=<Name>` as a literal Quick-Scan Trigger Table row
   in the AI Toolkit index → pointing at the base spec load contract.
5. **Mirror-pair registration (SAME SESSION):** add/update the agent's row in BOTH
   `super-agents/superagents.json` (fleet record: status, lane, channels, triggers) AND the
   AI Toolkit index roster + `registry.json` where applicable. One-sided edits are the exact
   drift that stranded earlier agents. Never hand-mirror per-field metadata into folder files
   — `superagents.json` is the canonical metadata home.
6. **PR-merge workflow** (GitHub Operating Standard): branch → commit → PR → self-merge → report.
7. **Session task + transcript** for the authoring session (Agent Activity Board).

---

## Editing an existing super-agent

- Stale Context Reload: re-fetch the file via blob API before editing (never a carried SHA).
- Behavior changes → `preferences.md`. Accumulated context → `memory.md`. Reasoning → `decision-log.md`.
- What-changed = git history + PR description. Never an inline changelog.
