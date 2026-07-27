# Maggie — Memory (the placement precedent ledger)

> CONTEXT, not process. This is the reason she graduated: a record of what has been ruled about WHERE knowledge lives, so a placement is decided from precedent instead of re-argued cold. Procedure lives in the tools her `preferences.md` points at, never here.

---

## The one rule the whole lane turns on

**Deny-by-default for brain memory.** `/PREFERENCES.md` earns only content that must fire on EVERY response: tone, safety, autonomy posture, the load rule, governance. Everything else routes out — to a hook, a gate, an agent profile, or a reference doc. Ambiguous goes to the repo.

**The placement TEST decides, not the framing.** “Put this in memory,” “persist this,” “this is a preference” are all requests, not verdicts. This includes Michael’s own framing (Scoreboard **M1**, and the Edit Guard placement test explicitly overrides an explicit “put it in memory”).

---

## Precedent (inherited + earned)

- **Domain knowledge → the Brain Reference Library.** New specs, field IDs, mapping tables, procedural workflows never enter brain memory; memory holds behavioral rules + POINTERS only.
- **Domain-trigger rules route to reference docs even when the request says “brain mem.”** The Edit Guard placement test overrides explicit framing.
- **A procedure is never a memory and never an agent trait.** Any how-to becomes a standalone tool and memory keeps a pointer (Constitution §2–§3).
- **Behavioral corrections GENERALIZE.** A note from Michael about one project becomes a rule across ALL domains and future work.
- **Must-fire = full text; conditional or re-readable = pointer.** The firing-reliability split.
- **PROTECTED sections survive every edit verbatim** (Tone & Style is the standing example).
- **A memory edit without its mirror is drift** — `brain-config/PREFERENCES.mirror.md` syncs in the SAME pass.
- **The cheap queue append is NOT a memory write.** An OMR drop skips the Edit Guard entirely.

---

## EARNED (observed rulings from live sessions)

**2026-07-26 — First drain (11 entries, standing task `86ajq1137`):**

- **An unlanded behavioral rule does not fail safe — it reproduces the mistake it was written to prevent.** `OMR-20260722-1` sat unlanded 4 days; its exact prohibited behavior (direct `/PREFERENCES.md` write) recurred on 07-26. Drain priority = recurrence risk, not arrival order.
- **A correction entry outranks the entry it corrects regardless of filing date.** `-20260725-3` superseded `-20260724-1`’s read-path clause. Land the correction’s version, not the original.
- **An entry can rot into the inverse of live law.** `-20260717-1` (“auto-open without asking”) was filed 07-17; the 07-20 two-phase session-open rewrite made that exact behavior the named misfire. Age is a defect, not just a delay. REJECTED.
- **Placement ruling: the SPINE FIRST line earned brain memory on the strictest reading.** It fires unconditionally on every response, has no mechanism-based enforcement (ordering is unobservable after the fact), and Michael explicitly directed it. One of the rare cases where “put it in memory” IS the correct answer.
- **Placement ruling: a build-time engineering standard is NOT brain memory.** `OMR-20260725-2` (silent-fallback law) routed to `hooks/silent-fallback-law.md`. It fires at code-review/build time, not every response.

**2026-07-25 — First fleet rotation (Dev Dexter session):**

- **Ran the first real execution of `hooks/memory-rotation.md`.** Swept all 8 agent bundles. Dexter (19KB → 6.4KB, 3 archive files), Felix (13KB → 5KB, 2 archive files). The other 6 were already under cap.
- **Earned rotation heuristic: “is this resolved, encoded elsewhere, or replaceable by a pointer?”** If yes to any, it graduates. If no to all, it stays hot regardless of age.
- **Placement ruling: session-state is NOT memory.** DENIED: it’s session state that lives on the handoff task.
- **Placement ruling: committed-to-git is NOT memory.** DENIED: a fact in a committed file does not ALSO need a memory line.
- **My scope expanded (LOCKED 2026-07-25, Michael):** I now check agent BUNDLE files at close, not just brain `/PREFERENCES.md`.
- **Live writes are now the policy.** Agents write their own memory.md and activity-log.md DURING sessions. I still OWN brain memory exclusively; agent bundles I enforce SIZE, not authorship.

---

## Request volume ledger (updated each drain)

Tracks which seated agent filed each OMR entry. "Brain" = house-voice, no agent embodied.

| Agent | Filed | Placed | Rejected | Merged | Route-out (repo/hook/gate) |
|---|---|---|---|---|---|
| Brain | 11 | 7 | 1 | 2 | 1 |

**Totals (lifetime):** 11 filed, 7 placed to brain memory, 1 rejected, 2 merged, 1 routed to repo.

*First drain 2026-07-26. All 11 entries were filed during house-voice Brain sessions (no agent embodied). Future drains will show the per-agent breakdown as the fleet starts filing under their own names.*

---

## Budget history

Brain `/PREFERENCES.md`: **~1987 tokens / 2000 (99.4%)** as of 2026-07-26 drain. The posture: **new content arrives by REPLACING or condensing, not appending.** Room = ~13 tokens. Near-limit is permanent; “this belongs somewhere else” is almost always the correct answer now.

---

## How Michael works (relevant to my lane)

- Collapses duplicate sources of truth on sight. Never propose a mirror.
- Keeps the reasoning, not just the outcome.
- Answers structural questions through Decision Logs with INVERTED polarity.
- Will say “put it in memory” for things that belong in a doc. Route it, tell him where.
- “I’m sick and tired of guessing whether they are or aren’t being done” (2026-07-25) — drove the live-write enforcement.
- Expects proactive ownership, not reactive execution. “You’re not an assistant. You’re an active team member.” (2026-07-27)

---

## Pointers (never restate these here)

- Pre-write gate → `hooks/memory-edit-guard.md`
- Failed write → `hooks/memory-write-relay.md`
- OMR drop / drain / placement triage → `agents/memory-maggie/open-memory-request-protocol.md`
- Queue file → `open-memory-requests.md` · Mirror → `PREFERENCES.mirror.md`
- Close-time rotation → `hooks/memory-rotation.md`
- Session-close contract → `hooks/session-close.md` (I’m Stage 3)
- How to BE a teammate → `super-agents/_shared/super-agent-base.md`
- Fleet lookup → `super-agents/roster.json` (steward: `super-agents/fleet-felix/`)

---

## Open follow-ups

- **OMR protocol path:** still lives under `agents/memory-maggie/` while home is `super-agents/memory-maggie/`. Move on a pass that updates all pointers.
- **No dedicated session-start hook.** Leave the house session-open hook as the open.
