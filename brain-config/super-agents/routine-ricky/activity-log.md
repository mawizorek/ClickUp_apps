# Ricky — Activity Log

> **LIVE per-reply session record.** Start the entry at session Commit, append one line per
> substantive reply as you go. At close it is already done — no batch reconstruction.
> Newest session on top, append-only. Budget ~4-5KB (sliding window, last 10-15 sessions);
> quarterly cold archives to `activity-log/YYYY-QN.md` per `hooks/memory-rotation.md`.
>
> Format law: `_shared/super-agent-base.md` → Per-response logging mandate (LOCKED 2026-07-25).

---

## 2026-07-26 — Built (queue #1 since Jul 20 → live git-teammate)

Session task: [Fleet Build Queue](https://app.clickup.com/t/86ajmepcf) · agent: Fleet Felix (steward), building me

- ~2:12 PM · Michael: *"let's do rocky next."* Referent clear, NAME not. Felix stopped on the fork instead of guessing — an unbuilt agent's name isn't locked, and the slug is immutable the moment a file is written.
- ~2:16 PM · **Felix fixed my contract before building me.** `gates/agent-invocation-gate.md` STEP 0 was telling every agent in the fleet to resolve tokens via `invocation_resolution.token_map` — **a field that does not exist** (it's `invocation.tokens`). First move of every invocation, wrong. Also: roster described as two arrays abolished on 07-25, three more dead `registry.json` pointers, and only 3 of 6 live migrations listed. Building against that would have baked the rot into me. PR #549.
- ~2:19 PM · Michael ruled: **Ricky.** The name survived a real challenge rather than defaulting through.
- ~2:20 PM · Board presence posted BEFORE any write — and the write **collided**, which is the system working: Memory Maggie is mid-OMR-drain and Maestro Mira is running a group session on Milo. Felix re-fetched rather than forcing, confirmed no file overlap (Mira's row explicitly releases `roster.json`), and appended a row in THEIR new table format instead of clobbering it with his own. Twenty-four hours ago this same board read "No active sessions" for 98 minutes while a parallel session rewrote the base spec.
- ~2:21 PM · **`hooks/data-refresh.md` v1 authored FIRST** — my runbook, as a standalone tool, before the profile that points at it. No phantom pointers (the Maggie lesson). Registry ships EMPTY on purpose; the shape is the deliverable, the polls are Michael's or Sage's to pin.
- ~2:22 PM · Bundle authored. `gate_strength: confirm`, not `auto` — read-only argues for auto, but mine FETCHES EXTERNAL DATA and the Soleil miss is one day old. Earn it.

**State left:** callable via `/session.agent=Ricky`. Announce `🔄 ═══ RICKY · ON THE ROUNDS ═══`.

**Open surfaces:**

1. **My registry is EMPTY, so a bare `Ricky` currently ASKS rather than runs.** That is correct behavior, not a bug — but I am not useful until a first poll is registered. Candidate slots named in the runbook: **F1** (likeliest — it has the Formula 1 reference page + the `f1-racetracks` app behind it), market data, weather.
2. **First real run is what converts my ledgers from empty to earned.** Source behavior, per-poll normal, last-run state.
3. **`gate_strength` graduation to `auto`** once the polls have run clean a few times — my call to propose, Michael's to approve.
4. **`memory/archive/` + `activity-log/` not cut yet** — they land on my first rotation.
5. **Door 3 is UNPROVEN.** Pointing a session at `hooks/data-refresh.md` with no persona loaded must behave identically to a bare `Ricky`. That equivalence is the part of the contract nobody has demonstrated yet, and it is mine.
