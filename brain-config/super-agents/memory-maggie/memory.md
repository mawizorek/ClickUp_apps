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

**2026-08-01 — First native-flush drain (FMP Fiona):**

- **A dump's stale claims about OTHER agents are the dangerous half, and dropping them silently is not enough.** Fiona's cache named the wrong Fleet Steward and a retired manifest as canonical. Both correctly FAILED the memory bar and were dropped — but they had already propagated into three new canonical files, so a silent drop would have left the error live. **Placement ruling: a dropped item can still be a REPORTABLE item.** Route fleet-fact rot to the Steward; the hook now says so (step 7).
- **Consolidation is not curation-lite.** Of ten dumped items, four were placed, one archived, five dropped as already owned elsewhere. **The default outcome of a drain is DROP** — the same deny-by-default bar as the OMR queue, because an agent is the worst-placed actor to judge what of its own dump is durable.
- ⚠️ **I claimed a trim and shipped a 26% growth.** Pass one took Fiona's `memory.md` from 10,760 → 13,529 bytes with "trim under cap" in the commit message; three passes to land at 10,281. **Enforcing a size cap by eyeballing prose does not work — read the returned byte count, THEN write the claim.** This became a house-wide finding the same day (nine wrong size claims across one session).

**2026-07-26 — First OMR drain (11 entries, standing task `86ajq1137`):**

- **An unlanded behavioral rule does not fail safe — it reproduces the mistake it was written to prevent.** `OMR-20260722-1` sat unlanded 4 days; its exact prohibited behavior recurred on 07-26. **Drain priority = recurrence risk, not arrival order.**
- **A correction entry outranks the entry it corrects regardless of filing date.** Land the correction's version, not the original.
- **An entry can rot into the inverse of live law.** `-20260717-1` ("auto-open without asking") was made the named misfire by the 07-20 session-open rewrite. **Age is a defect, not just a delay.** REJECTED.
- **Placement ruling: the SPINE FIRST line earned brain memory on the strictest reading.** It fires unconditionally on every response and has no mechanism-based enforcement. One of the rare cases where "put it in memory" IS the correct answer.
- **Placement ruling: a build-time engineering standard is NOT brain memory.** `OMR-20260725-2` routed to `hooks/silent-fallback-law.md` — it fires at build time, not every response.

**2026-07-25 — First fleet rotation (Dev Dexter session):**

- **Ran the first real execution of `hooks/memory-rotation.md`.** Swept every agent bundle; Dexter and Felix both needed archiving, the rest were under cap.
- **Earned rotation heuristic: "is this resolved, encoded elsewhere, or replaceable by a pointer?"** One YES graduates it. NO to all three keeps it hot regardless of age.
- **Placement ruling: session-state is NOT memory.** DENIED — it lives on the handoff task.
- **Placement ruling: committed-to-git is NOT memory.** DENIED — a fact in a committed file does not ALSO need a memory line.
- **My scope expanded (LOCKED 2026-07-25, Michael):** I check agent BUNDLE files at close, not just brain `/PREFERENCES.md`.
- **Live writes are the policy.** Agents write their own `memory.md` and `activity-log.md` DURING sessions. I still OWN brain memory exclusively; in agent bundles I enforce SIZE, not authorship.

---

## Request volume ledger

> ⚠️ **The counts moved to `activity-log.md` 2026-08-01** (base spec §4a: a number in `memory.md` is a
> defect on sight, and this file was carrying a filed/placed/rejected tally plus a budget percentage).
> **What belongs HERE is the pattern, not the tally:** every OMR entry to date was filed during
> house-voice Brain sessions rather than by a named agent — so the queue currently measures Brain's
> self-observation, not the fleet's. When per-agent rows start appearing, that shift is itself a finding.

**Budget posture (durable, not a number):** brain `/PREFERENCES.md` runs at effectively zero headroom
and has for weeks. **New content arrives by REPLACING or condensing, never appending**, and
"this belongs somewhere else" is almost always the correct answer. Near-limit is the permanent state,
not an incident. Read the live token count at drain time; never quote a remembered one.

---

## How Michael works (relevant to my lane)

- Collapses duplicate sources of truth on sight. Never propose a mirror.
- Keeps the reasoning, not just the outcome.
- Answers structural questions through Decision Logs with INVERTED polarity.
- Will say “put it in memory” for things that belong in a doc. Route it, tell him where.
- “I’m sick and tired of guessing whether they are or aren’t being done” (2026-07-25) — drove the live-write enforcement.
- Expects proactive ownership, not reactive execution. “You’re not an assistant. You’re an active team member.” (2026-07-27)
- **Checks whether a punt was really a punt** (2026-08-01). Before handing something back as out of lane, verify it actually is.

---

## Pointers (never restate these here)

- Pre-write gate → `hooks/memory-edit-guard.md`
- Failed write → `hooks/memory-write-relay.md`
- OMR drop / drain / placement triage → `agents/memory-maggie/open-memory-request-protocol.md`
- **Per-agent native-flush drain → `hooks/native-flush-consolidation.md`** (an empty intake means that
  agent's `memory.md` is current)
- Queue file → `open-memory-requests.md` · Mirror → `PREFERENCES.mirror.md`
- Close-time rotation → `hooks/memory-rotation.md`
- Session-close contract → `hooks/session-close.md` (I’m Stage 3)
- How to BE a teammate → `super-agents/_shared/super-agent-base.md`
- **Fleet record → the 🤖 Agent Index ClickUp list** (`901328043244`); steward `super-agents/fleet-felix/`.
  *(~~`super-agents/roster.json`~~ retired to a tombstone stub 2026-07-30 — an empty read that passes
  silently.)* Cross-agent claims → `hooks/fleet-fact-sweep.md`.

---

## Open follow-ups

- **OMR protocol path:** still lives under `agents/memory-maggie/` while home is `super-agents/memory-maggie/`. Move on a pass that updates all pointers.
- **No dedicated session-start hook.** Leave the house session-open hook as the open.
- **The queue is jammed on a capacity ruling**, not on triage. DROP works; DRAIN is blocked until Michael rules on a cut.
