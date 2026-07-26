routine-ricky: Self-Audit — 2026-07-26 (BIRTH)
Agent: Routine Ricky (routine-ricky)
Track: git-teammate
Auditor: Fleet Felix (steward)
Standard: git-teammate DoD v0.2 (audit-instruction.md v0.5)
Overall: Up to date — 9/9 PASS at 2:29 PM · **4 checks RE-RUN at 2:43 PM after Michael redesigned the default runbook** · still 9/9. See the ADDENDUM at the bottom.

## SHA STAMPS — what this audit was run against

Required since Q11 → C (Michael, 2026-07-25), after Clio's 9/9 PASS went stale in twenty minutes
because a parallel session rewrote the base spec underneath it. **An audit is a claim with a
timestamp.** Second record in the fleet to carry these; first to carry them for a hook it depends on.

- `_shared/super-agent-base.md` ........... `e4b6fc3cb3e6b58308dcaea9c40902d2dcb4711c` (21,745 bytes — still above the split line)
- `super-agents/audit-instruction.md` ..... `9903d5f8d6bf3b8c465c24ac2295ad1edea1e11d` (v0.5, DoD v0.2)
- `gates/agent-invocation-gate.md` ........ `9e9d174e337f8cc5b458baec311a6f9f4867578e` (**de-rotted THIS session — see finding 1**)
- `gates/git-teammate-lifecycle-runbook.md` `a3b76cee56532da5ef232167fa1c8ff65edb4e1a` (v0.3)
- `hooks/data-refresh.md` ................. `d37210c1e8d6c5f5c508987b61e82d28d7713636` (v1) → **SUPERSEDED, see addendum**
- `hooks/source-freshness-gate.md` ........ `5d2091954d7ff98d9a871c06f3ae966e31282c81`
- `hooks/silent-fallback-law.md` .......... `b840d8fcc06faab88d397cf4d2ae26d717ccff39`
- `super-agents/roster.json` (post-write) . `9867aafb261bd33ace3fce7ff6a315fa2be23dee` → **SUPERSEDED, see addendum**

**Concurrency:** the board was read immediately before the first write, and **the write COLLIDED** —
two other sessions (Memory Maggie mid-OMR-drain, Maestro Mira on a group Milo session) had posted
while this session was reading the invocation gate. Re-fetched rather than forced; confirmed zero
file overlap; appended a row in THEIR new table format rather than clobbering it with the old prose
shape. **This is the mechanism working for the first time** — 24 hours earlier the same board read
"No active sessions" for 98 minutes while the base spec was rewritten under a bundle being audited.

Checklist results:
1. Base pointer present ................ PASS — `preferences.md` line 1 is the `_shared/super-agent-base.md` pointer.
2. Load manifest valid ................. PASS — 9 entries, all present. Two are CONDITIONAL by design and correctly so: `hooks/data-refresh.md` on any refresh turn ("read it, don't recall it" — the point of a stewarded runbook) and `hooks/source-freshness-gate.md` before stating any fetched fact. **→ RE-RUN, now 10 entries.**
3. `roster.json` row accurate .......... PASS — `class: super-agent`, `memory: true`, `status: active`, `invoke: /session.agent=Ricky`, `aka: [Ricky, Routine]`, one-line lane, `home`, `from` carrying both the 07-20 queue origin and the 07-26 build. **`default_runbook` states the empty-registry behavior inline** so a cold reader cannot mistake "empty" for "nothing to do." `gate_strength: confirm`. **→ RE-RUN, row changed.**
4. Every pointer RESOLVES .............. PASS — verified against live directory listings, not memory: `hooks/data-refresh.md` (authored FIRST, before the profile that points at it — the Maggie phantom-hook lesson) · `hooks/source-freshness-gate.md` · `hooks/silent-fallback-law.md` · `hooks/memory-rotation.md` · `gates/agent-invocation-gate.md` · `_shared/super-agent-base.md` · `super-agents/scout-sage/` · `super-agents/roster.json` · `super-agents/audit-instruction.md`. ClickUp-side surfaces (Formula 1 reference page) referenced by NAME, never by a session-local URL placeholder, which would be dead text in a repo file. **→ RE-RUN, one new pointer.**
5. Bundle files present + in-format ..... PASS — all five + `audits/`. **NO procedure in the bundle:** the entire routine lives in `hooks/data-refresh.md`, which he STEWARDS. `activity-log.md` is in the current LIVE per-reply format (not the format retired on 07-25 — checked, because that is exactly what went stale on Clio).
6. No cross-file contradiction .......... PASS — profile, memory, README, roster row and the runbook tell ONE story, including the empty-registry behavior stated identically in all four places (it is the single most misreadable fact about him, so it is repeated on purpose rather than left to inference). **→ RE-RUN, highest-risk check after a same-day redesign.**
7. Voice distinct + token clean ......... PASS, with the naming history handled explicitly. Announce `🔄 ═══ RICKY · ON THE ROUNDS ═══` — 🔄 unclaimed; the position is a **verb**, deliberately unlike every other banner (which use a state or a place), because he is the only teammate whose identity is a repeated action. Token scan across both namespaces: `Ricky` / `Routine` unclaimed. **Dictation:** `Rocky` is a live known variant of his own name (Michael said it on 2026-07-26); registered in the token map as resolving to him. Also checked against `Renata` and `Rhys` on the R initial — both clear (three syllables vs two vs one).
8. Index mirror fresh ................... PASS — AI Toolkit index updated same session: new invocation trigger row + the two-trees teammate list and count (11 → 12). **→ trigger row rewritten in the addendum pass.**
9. Inherited memory labelled ............ PASS — `memory.md` labels everything INHERITED with a re-label instruction, and **explicitly names its two EMPTY ledgers as deliberate** (source-behavior, per-poll normal). Seeding invented source history would have been the exact confident-unverified-claim failure his own pre-flight gate exists to prevent.

## 🔎 Finding 1 — his own CONTRACT was broken, in the load-bearing spot (fixed pre-build)

`gates/agent-invocation-gate.md` is the spec Ricky is the reference implementation of, so it was read
before authoring. **STEP 0 instructed every agent in the fleet to resolve tokens via
`invocation_resolution.token_map` — a field that does not exist** (it is `invocation.tokens`). That is
the FIRST move of every invocation: an agent following it literally finds nothing and falls back to
guessing, which is precisely the failure STEP 0 was written to prevent. Same paragraph also described
the roster as two arrays abolished on 07-25; three more dead `registry.json` pointers; and only 3 of
6 live migrations listed. **Fixed in PR #549 BEFORE any of Ricky's files were written** — building
against it would have baked the rot into the agent that exists to demonstrate it.

## 🔎 Finding 2 — `roster.json` hit 21.1KB mid-build and was trimmed in the same pass

Adding his row took the file to **21,140 bytes against a ~22KB HARD ceiling.** One more agent and
registration BREAKS — which is not a budget note, it is exactly how Dev Dexter shipped unregistered.
**Acted rather than only flagging:** trimmed the header notes back to real one-line pointers, moving
rule text to the gates where it is actually enforced (Constitution §2 — a data file holds data). Much
of that prose was Felix's own, added over the previous two days in the same breath as locking "trim
prose instead," which is its own small lesson. **Result: 19,774 → 18,202 bytes — a net 1,572-byte
REDUCTION despite adding a full registration.** Still ~6KB over the ~12KB target; `accent` remains
the escalated field (32 rows, duplicate values across rows, so already not a reliable identifier).

Divergences / contradictions:
- **None inside the bundle.**
- **Open surface (deliberate):** the poll registry is EMPTY. **Correct behavior, not a defect** — but
  he is not USEFUL until a first poll is registered, and that requires pinning sources, a
  Michael-or-Sage job. Candidates: F1 (likeliest — real domain scaffolding), market data, weather.
- **Open surface (unproven by construction):** **door 3.** Pointing a session at
  `hooks/data-refresh.md` with no persona loaded must behave identically to a bare `Ricky`. That
  equivalence is the part of the invocation contract nobody has demonstrated, and it is the reason he
  was queued as the stress test. It cannot be audited at birth; it needs a run.

---

# ADDENDUM — 2026-07-26 ~2:43 PM · the default runbook was REDESIGNED 14 minutes after this audit was signed

**What happened:** Michael changed what a bare `Ricky` does. It no longer runs a fixed sweep of polls;
it **TRIAGES** — reads a shared timestamp log, computes what is due against each poll's cadence, and
PROPOSES (*"here's what needs to happen — proceed?"*). Full reasoning in `decision-log.md` **D7**.

**This is exactly the scenario the SHA stamps exist for.** Two of the stamped files above are now
superseded (`hooks/data-refresh.md` v1 → v2, `roster.json`). Rather than let a signed 9/9 quietly rot
for the second time in two days, the four affected checks were RE-RUN against HEAD:

- **Check 2 (load manifest) — RE-PASS.** Now **10 entries**: `brain-config/data-refresh-log.json`
  added, marked *always on a bare call* (triage IS reading that file, so a conditional load would be
  wrong — the manifest has to guarantee it).
- **Check 3 (roster row) — RE-PASS.** `default_runbook` rewritten to TRIAGE with the propose-and-stop
  behavior stated inline; **`gate_strength` `confirm` → `auto`** (D8). New row SHA:
  `8686bfdb92e22e4476eb54ed191b4e4537f44af6`, 18,331 bytes — **+129 for the whole redesign**, still
  well under the ceiling.
- **Check 4 (pointers resolve) — RE-PASS.** One new pointer, `brain-config/data-refresh-log.json`,
  authored BEFORE the profile and runbook that reference it. Same discipline as v1's runbook: never
  point at a file that does not exist yet.
- **Check 6 (no cross-file contradiction) — RE-PASS, and this was the real risk.** A same-day redesign
  across four files is precisely how a bundle ends up half-describing an old behavior. Verified that
  profile, roster row, runbook v2, README, and the log's own header now agree on: triage is the
  default · it proposes and stops · execution is always gated · **cadence is CONFIG in the registry
  while timestamps are STATE in the log** · any agent may stamp. **The old "run every `in_default`
  poll" framing survives NOWHERE as live instruction** — `in_default` was re-scoped in place to "watched
  by triage," and D5's original reasoning is kept because it still holds, with a note that D7 changed
  what the flag gates.

**Updated SHA stamps for the re-run:** `hooks/data-refresh.md` = `c340306ef30defa657c9a7659d1796d483726532`
(v2) · `roster.json` = `8686bfdb92e22e4476eb54ed191b4e4537f44af6` · `data-refresh-log.json` =
`6ecd541e00106e1c72d346a05d450273bea12104` (v1).

**New finding from the redesign, recorded because it is a rule and not a one-off:** `gate_strength`
**tracks the BLAST RADIUS of the default runbook, not the agent's age or seniority.** Ricky shipped at
`confirm` because his default FETCHED external data; when the default became read-only arithmetic that
ends in a question, `auto` became correct — and gating a read-only routine that already asks would be a
confirmation in front of a confirmation. The caution did not evaporate, it **relocated** to per-poll
`auto_run`, which is where the outside-world contact now lives. Worth folding into the invocation gate
on its next pass.

**Open surfaces unchanged by the redesign, plus one:**
- Registry still EMPTY → triage reports "nothing registered." Correct, still idle.
- Door 3 still unproven.
- ⚠️ **NEW:** F1's natural cadence is **race-weekend-driven, not a fixed interval.** The `cadence`
  field currently assumes a duration. The likeliest first poll may therefore be the one that forces
  `cadence` to express more than "every N days" — flagged now rather than discovered at registration.
