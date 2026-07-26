routine-ricky: Self-Audit — 2026-07-26 (BIRTH)
Agent: Routine Ricky (routine-ricky)
Track: git-teammate
Auditor: Fleet Felix (steward)
Standard: git-teammate DoD v0.2 (audit-instruction.md v0.5)
Overall: Up to date — 9/9 PASS, with one finding raised to a fleet rule and one deliberate emptiness

## SHA STAMPS — what this audit was run against

Required since Q11 → C (Michael, 2026-07-25), after Clio's 9/9 PASS went stale in twenty minutes
because a parallel session rewrote the base spec underneath it. **An audit is a claim with a
timestamp.** Second record in the fleet to carry these; first to carry them for a hook it depends on.

- `_shared/super-agent-base.md` ........... `e4b6fc3cb3e6b58308dcaea9c40902d2dcb4711c` (21,745 bytes — still above the split line)
- `super-agents/audit-instruction.md` ..... `9903d5f8d6bf3b8c465c24ac2295ad1edea1e11d` (v0.5, DoD v0.2)
- `gates/agent-invocation-gate.md` ........ `9e9d174e337f8cc5b458baec311a6f9f4867578e` (**de-rotted THIS session — see finding 1**)
- `gates/git-teammate-lifecycle-runbook.md` `a3b76cee56532da5ef232167fa1c8ff65edb4e1a` (v0.3)
- `hooks/data-refresh.md` ................. `d37210c1e8d6c5f5c508987b61e82d28d7713636` (v1, authored this session)
- `hooks/source-freshness-gate.md` ........ `5d2091954d7ff98d9a871c06f3ae966e31282c81`
- `hooks/silent-fallback-law.md` .......... `b840d8fcc06faab88d397cf4d2ae26d717ccff39`
- `super-agents/roster.json` (post-write) . `9867aafb261bd33ace3fce7ff6a315fa2be23dee`

**Concurrency:** the board was read immediately before the first write, and **the write COLLIDED** —
two other sessions (Memory Maggie mid-OMR-drain, Maestro Mira on a group Milo session) had posted
while this session was reading the invocation gate. Re-fetched rather than forced; confirmed zero
file overlap (Mira's row explicitly releases `roster.json`, Maggie's drain does not claim it);
appended a row in THEIR new table format rather than clobbering it with the old prose shape.
**This is the mechanism working for the first time** — 24 hours earlier the same board read "No active
sessions" for 98 minutes while the base spec was rewritten under a bundle being audited.

Checklist results:
1. Base pointer present ................ PASS — `preferences.md` line 1 is the `_shared/super-agent-base.md` pointer.
2. Load manifest valid ................. PASS — 9 entries, all present. Two are CONDITIONAL by design and correctly so: `hooks/data-refresh.md` on any refresh turn ("read it, don't recall it" — the point of a stewarded runbook) and `hooks/source-freshness-gate.md` before stating any fetched fact.
3. `roster.json` row accurate .......... PASS — `class: super-agent`, `memory: true`, `status: active`, `invoke: /session.agent=Ricky`, `aka: [Ricky, Routine]`, one-line lane, `home`, `from` carrying both the 07-20 queue origin and the 07-26 build. **`default_runbook` states the empty-registry behavior inline** (a bare call ASKS) so a cold reader cannot mistake "empty" for "nothing to do." `gate_strength: confirm`.
4. Every pointer RESOLVES .............. PASS — verified against live directory listings, not memory: `hooks/data-refresh.md` (authored FIRST, before the profile that points at it — the Maggie phantom-hook lesson) · `hooks/source-freshness-gate.md` · `hooks/silent-fallback-law.md` · `hooks/memory-rotation.md` · `gates/agent-invocation-gate.md` · `_shared/super-agent-base.md` · `super-agents/scout-sage/` · `super-agents/roster.json` · `super-agents/audit-instruction.md`. ClickUp-side surfaces (Formula 1 reference page) referenced by NAME, never by a session-local URL placeholder, which would be dead text in a repo file.
5. Bundle files present + in-format ..... PASS — all five + `audits/`. **NO procedure in the bundle:** the entire routine lives in `hooks/data-refresh.md`, which he STEWARDS. `activity-log.md` is in the current LIVE per-reply format (not the format retired on 07-25 — checked, because that is exactly what went stale on Clio).
6. No cross-file contradiction .......... PASS — profile, memory, README, roster row and the runbook tell ONE story, including the empty-registry behavior stated identically in all four places (it is the single most misreadable fact about him, so it is repeated on purpose rather than left to inference).
7. Voice distinct + token clean ......... PASS, with the naming history handled explicitly. Announce `🔄 ═══ RICKY · ON THE ROUNDS ═══` — 🔄 unclaimed; the position is a **verb**, deliberately unlike every other banner (which use a state or a place), because he is the only teammate whose identity is a repeated action. Token scan across both namespaces: `Ricky` / `Routine` unclaimed. **Dictation:** `Rocky` is a live known variant of his own name (Michael said it on 2026-07-26); registered in the token map as resolving to him. Also checked against `Renata` and `Rhys` on the R initial — both clear (three syllables vs two vs one).
8. Index mirror fresh ................... PASS — AI Toolkit index updated same session: new invocation trigger row + the two-trees teammate list and count (11 → 12).
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
- **Open surface (deliberate, and the honest state of him):** the poll registry is EMPTY, so a bare
  `Ricky` currently ASKS rather than runs. **Correct behavior, not a defect** — but he is not USEFUL
  until a first poll is registered, and that requires pinning sources, which is a Michael-or-Sage job.
  Candidate slots named in the runbook: F1 (likeliest — real domain scaffolding behind it), market
  data, weather.
- **Open surface (unproven by construction):** **door 3.** Pointing a session at
  `hooks/data-refresh.md` with no persona loaded must behave identically to a bare `Ricky`. That
  equivalence is the part of the invocation contract nobody has demonstrated, and it is the reason he
  was queued as the stress test in the first place. It cannot be audited at birth; it needs a run.

Actions recommended:
- **Michael:** register the first poll (or hand it to Sage to pin sources). Until then Ricky is
  correct-but-idle. F1 is the cheapest first row.
- **Michael:** overrule `gate_strength: confirm` → `auto` if the read-only argument outweighs the
  external-fetch caution. Felix's call, cheap to reverse.
- **Dexter:** `_shared/super-agent-base.md` is still 21,745 bytes against the ~22KB ceiling.
  Deliberately untouched for the third consecutive session; still needs a real split.
- **Ricky, first run:** convert both ledgers from empty to earned, and demonstrate door 3.
