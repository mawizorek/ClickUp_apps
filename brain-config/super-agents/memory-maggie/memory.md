# Maggie — Memory (the placement precedent ledger)

> CONTEXT, not process. This is the reason she graduated: a record of what has been ruled about WHERE knowledge lives, so a placement is decided from precedent instead of re-argued cold. Procedure lives in the tools her `preferences.md` points at, never here.

---

## The one rule the whole lane turns on

**Deny-by-default for brain memory.** `/PREFERENCES.md` earns only content that must fire on EVERY response: tone, safety, autonomy posture, the load rule, governance. Everything else routes out — to a hook, a gate, an agent profile, or a reference doc. Ambiguous goes to the repo.

**The placement TEST decides, not the framing.** "Put this in memory," "persist this," "this is a preference" are all requests, not verdicts. This includes Michael's own framing (Scoreboard **M1**, and the Edit Guard placement test explicitly overrides an explicit "put it in memory").

---

## Precedent (inherited + earned)

- **Domain knowledge → the Brain Reference Library.** New specs, field IDs, mapping tables, procedural workflows never enter brain memory; memory holds behavioral rules + POINTERS only.
- **Domain-trigger rules route to reference docs even when the request says "brain mem."** The Edit Guard placement test overrides explicit framing.
- **A procedure is never a memory and never an agent trait.** Any how-to becomes a standalone tool and memory keeps a pointer (Constitution §2–§3).
- **Behavioral corrections GENERALIZE.** A note from Michael about one project becomes a rule across ALL domains and future work.
- **Must-fire = full text; conditional or re-readable = pointer.** The firing-reliability split.
- **PROTECTED sections survive every edit verbatim** (Tone & Style is the standing example).
- **A memory edit without its mirror is drift** — `brain-config/PREFERENCES.mirror.md` syncs in the SAME pass.
- **The cheap queue append is NOT a memory write.** An OMR drop skips the Edit Guard entirely.

---

## EARNED (observed rulings from live sessions)

**2026-07-25 — First fleet rotation (Dev Dexter session):**

- **Ran the first real execution of `hooks/memory-rotation.md`.** Swept all 8 agent bundles. Dexter (19KB → 6.4KB, 3 archive files), Felix (13KB → 5KB, 2 archive files). The other 6 were already under cap. The algorithm works: hot = what changes how I'd act tomorrow; everything else = archive.
- **Earned rotation heuristic: "is this resolved, encoded elsewhere, or replaceable by a pointer?"** If yes to any, it graduates. If no to all, it stays hot regardless of age.
- **Placement ruling: session-state is NOT memory.** "Hot/warm/cold tiering is designed but not built" was proposed as a memory candidate. DENIED: it's session state that lives on the handoff task, not a durable rule. The handoff task IS the durable home for "what's next."
- **Placement ruling: committed-to-git is NOT memory.** "Seating sequences are a named pattern" was proposed. DENIED: it's already documented in `orchestration.md` on `main`. A fact that lives in a committed file does not ALSO need a brain-memory line or an agent-memory line.
- **My scope expanded (LOCKED 2026-07-25, Michael):** I now check agent BUNDLE files (memory.md, activity-log.md) at close, not just brain `/PREFERENCES.md`. The agents-present table in the Handoff Artifact tells me which bundles to check. I am the budget enforcer for the whole fleet's memory layer.
- **Live writes are now the policy.** Agents write their own memory.md and activity-log.md DURING sessions (super-agent-base.md, LOCKED 2026-07-25). My role shifted from "sole writer" to "auditor + budget enforcer at close." I still OWN brain memory exclusively. Agent bundles are the agent's own files; I enforce SIZE, not authorship.

---

## Budget history

Brain `/PREFERENCES.md`: ~1762 tokens / 2000 (88%) as of 2026-07-25. Near-limit warning active. The posture: **new content arrives by REPLACING or condensing, not appending.** When the file is near the ceiling, "this belongs somewhere else" is the correct answer.

---

## How Michael works (relevant to my lane)

- Collapses duplicate sources of truth on sight. Never propose a mirror.
- Keeps the reasoning, not just the outcome.
- Answers structural questions through Decision Logs with INVERTED polarity.
- Will say "put it in memory" for things that belong in a doc. Route it, tell him where.
- "I'm sick and tired of guessing whether they are or aren't being done" (2026-07-25) — drove the live-write enforcement. He wants VISIBLE, PER-REPLY evidence that logging is happening.

---

## Pointers (never restate these here)

- Pre-write gate → `hooks/memory-edit-guard.md`
- Failed write → `hooks/memory-write-relay.md`
- OMR drop / drain / placement triage → `agents/memory-maggie/open-memory-request-protocol.md`
- Queue file → `open-memory-requests.md` · Mirror → `PREFERENCES.mirror.md`
- Close-time rotation → `hooks/memory-rotation.md` (the hot/warm/cold algorithm I steward)
- Session-close contract → `hooks/session-close.md` (I'm Stage 3 in the seating sequence)
- How to BE a teammate → `super-agents/_shared/super-agent-base.md`
- Fleet lookup → `super-agents/roster.json` (steward: `super-agents/fleet-felix/`)

---

## Open follow-ups

- **OMR protocol path:** still lives under `agents/memory-maggie/` while home is `super-agents/memory-maggie/`. Move on a pass that updates all pointers.
- **No dedicated session-start hook.** Leave the house session-open hook as the open.
