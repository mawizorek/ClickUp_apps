# Gate: When Creating / Editing Git Super-Agents (and their Tools)

**Fires before authoring or materially editing any agent under `brain-config/super-agents/`, OR
any tool an agent would run.** This is the "how to BUILD one" authoring standard; the runtime
"how to BE one" lives in `brain-config/super-agents/_shared/super-agent-base.md`.

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
   `preferences.md`, STOP — author it as a tool and leave only a POINTER in the agent.
4. **Routines are stewarded, not stored.** A routine an agent runs lives as a tool the agent OWNS
   editing; the agent's memory points to it, the deep procedure lives in the tool.
5. **Decision logs by home:** topic decisions → the topic's page; agent-self decisions → the
   agent's `decision-log.md`. Never store topic procedure in an agent.
6. **🎯 EVERY AGENT SHIPS WITH THE CONDITION UNDER WHICH IT SHOULD BE KILLED.** See the
   Retirement Condition section below. It is a build BLOCKER, not a nicety.

These bind tool authoring too: when building ANY tool, the test is "does capability live in a
triggerable tool, with agents only pointing at it?" If a capability is getting baked into a
persona, that's the smell this gate exists to catch.

---

## 🎯 THE RETIREMENT CONDITION (LOCKED 2026-08-01 — fleet-wide, blocking)

**No agent this fleet has ever built shipped with a condition for retiring it.** That is not a
stylistic gap. It is why **Catch Up Clark sat as the queue's #1 item for eight days** while nobody
could name what he would remember that Clio did not — the question that should have killed him on
day one had no place to be written, so it was asked five times and answered never. Three manifests
and a scheduler have been retired since; each one required somebody to notice, argue, and re-derive
the case. **A retirement condition is the cheapest thing in this gate and it outlives every roster
it is written into.**

### The requirement

**Every new agent bundle — teammate or lens — ships with `decision-log.md` **D1** = its retirement
condition.** D1 is reserved for this. It is written **at BUILD time, by the builder, before the
agent is registered**, and it is a **PASS/FAIL check in the birth audit** (see
`super-agents/audit-instruction.md`).

### What makes a valid condition

It must be **falsifiable, observable, and checkable by a cold session with no memory of the build.**

- ✅ *"If Ledger C is still inherited-only after two real pieces of business work, this was a lens."*
  (Realty Riley D6 — the precedent this rule generalizes.)
- ✅ *"If this head's craft ledger is still inherited-only after two real productions, it was a
  lens."* (`_shared/department-head-base.md` §8 — the department-head default.)
- ✅ *"If the routine registry is still empty after N invocations, this is a hook."*
- 🚫 *"Retire if no longer useful."* — unfalsifiable, unobservable, means nothing to a cold reader.
- 🚫 *"Retire when Michael says so."* — that is true of everything and therefore says nothing.
- 🚫 A condition that only the BUILDER could evaluate. If it needs the build conversation to
  interpret, it is not a condition, it is a memory.

### The default shape for a MEMORY-justified agent

A lens graduates for exactly one reason: **it needs MEMORY** (base spec §6). So the default
condition is the inverse of the justification, and it should be the first thing you try to write:

> **If <the specific ledger that justified this bundle> is still inherited-only after <N> real
> pieces of <the work>, it was a lens.**

### Enforcement

- **No D1 = the build is not done.** Not a partial, not a follow-up — the bundle is incomplete in
  the same way an unregistered agent is (see step 6 below).
- **The condition is never quietly deleted.** If it comes due and Michael keeps the agent, the
  condition is **struck with the reason and re-set with a new bar**, so the next reader sees that
  it was evaluated rather than forgotten.
- **It is not a promise to retire.** It is a promise to ASK, on a date, with evidence. Michael
  rules; the condition just guarantees somebody brings it up.

---

## Two-tree law (know which tree you're in)

- `brain-config/agents/` = ephemeral **Council/Workshop lenses**. Stateless processing verbs. NO
  personal memory. NOT session-invocable as a standing persona.
- `brain-config/super-agents/` = persistent **teammates**. Full context bundle, base pointer,
  invoked via `/session.agent=<Name>`, hold memory across sessions.

⚠️ **Never list example names here — they rot.** This gate once named Mira and Anna as lenses long
after they graduated (corrected 2026-07-27). **The ClickUp 🤖 Agent Index is authoritative**; filter
it by `Class` to see either tree. Two trees is a STORAGE fact, not a hierarchy: `Class` means
persistence, not rank (base spec Constitution §6). A lens graduates for exactly one reason — it
needs MEMORY.

A persona that needs to accumulate context and be inhabited for a whole session belongs in
`super-agents/`. A pure processing lens belongs in `agents/`. Migrating a lens → teammate means
moving it into `super-agents/` with the full bundle, flipping its Index row, and redirecting the old
lens file to a tombstone.

---

## Required file set (create ALL)

**Canonical list lives in the base spec** (`_shared/super-agent-base.md` → File set) so there is
ONE description of a bundle. Do not restate it here; it drifted once already (this gate omitted
`memory/archive/` and `activity-log/` for weeks).

`preferences.md` MUST open with:
`> Follow the shared base first — brain-config/super-agents/_shared/super-agent-base.md — then personalize below.`

**A CRAFT DEPARTMENT HEAD takes a second pointer**, on the line below the first:
`> Then the department-head supplement — brain-config/super-agents/_shared/department-head-base.md.`
That file holds the two-axis scope, the craft-ledger / project-log memory split, the hard
exclusions (no calendar, no inventory, no people), the export-not-source provenance rule, and the
six-field instantiation delta. **Do not restate any of it in a head's profile.**

---

## Authoring checklist

1. **Name-collision gate** (`brain-config/gates/agent-name-collision-gate.md`): scan the ClickUp
   Agent Index (names + `Slug` + `AKA`, **including retired rows**) and live ClickUp Super Agents.
   A retired/tombstoned agent is NEVER a live invocation target (see B11), but its name is still taken.
2. **Profile stays behavior-only.** No stored how-to (Founding law §2–§3). Point OUT to tools for process.
3. **Load manifest = deep by default.** Full memory + full decision-log + long activity window.
4. **Per-response logging wired.** The profile assumes the runtime logging mandate. Don't re-author
   it — it's in the base spec; just don't contradict it.
5. **Slash trigger.** Register `/session.agent=<Name>` as a literal Quick-Scan Trigger Table row
   in the AI Toolkit index → pointing at the base spec load contract.
6. **Registration (SAME SESSION): add the agent's row to the ClickUp 🤖 Agent Index** —
   https://app.clickup.com/36074068/v/li/901328043244 (list id `901328043244`). Fill `Slug` (immutable) · `Class` · `Memory` ·
   `Invoke` · `AKA` · `Home`, plus `default_runbook` + `Gate Strength` if it has a bare-name
   default, plus `Lane` **only** if there is no home file. Set the native status.
   ~~Mirror-pair registration into `superagents.json` AND the AI Toolkit index roster AND
   `registry.json`~~ — STRUCK 2026-07-27 (mirror mandate retired). ~~`roster.json` is the single
   documented source~~ — **STRUCK 2026-07-30: retired to a tombstone stub; the Index is a ClickUp
   list now.** No pair means no sync obligation, and resurrecting a file to mirror the list is the
   duplication three retirements have already killed.
   > ⚠️ **Registration is the WIRING, not paperwork.** An unregistered agent cannot be resolved no
   > matter how complete its bundle is. Dev Dexter shipped built-but-unregistered on 2026-07-25
   > because the old file could not be written to. That failure class is gone — adding a row costs
   > nothing now — so there is no excuse left for skipping it.
7. **🎯 Retirement condition written as `decision-log.md` D1** (Founding law §6 + the section
   above). **BLOCKING — no D1, no ship.**
8. **PR-merge workflow** (GitHub Operating Standard): branch → commit → PR → self-merge → report.
9. **Session task + transcript** for the authoring session (Agent Activity Board).

---

## Editing an existing super-agent

- Stale Context Reload: re-fetch the file via blob API before editing (never a carried SHA).
- Behavior changes → `preferences.md`. Accumulated context → `memory.md`. Reasoning → `decision-log.md`.
- Procedure change → the TOOL it lives in, NOT the agent (Founding law §3). Agent keeps only the pointer.
- Identity/routing change (name, nickname, class, invoke, home) → **the Agent Index row**, same session.
- What-changed = git history + PR description. Never an inline changelog.
