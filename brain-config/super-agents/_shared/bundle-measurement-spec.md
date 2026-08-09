# Bundle Measurement Spec

**Type:** Shared reference. Any process that needs to assess the health of an agent's memory bundle reads this spec. The routine, the curator, and the auditor all point here rather than restating the logic.

**Consumers:** `routines/agent-memory-report.md` (fleet-wide diagnostic) · `hooks/memory-rotation.md` (Maggie's close-time rotation) · Audit Anna (ad-hoc bundle audits).

---

## What to measure

For each agent bundle at `brain-config/super-agents/<slug>/`:

| File | Metric | Source of budget | Hard ceiling |
|---|---|---|---|
| `memory.md` | Byte size | `hooks/memory-rotation.md` → 10KB target | ~22KB (unreadable above this) |
| `activity-log.md` | Byte size | `hooks/memory-rotation.md` → 5KB target | ~22KB |
| `decision-log.md` | Byte size | No enforced cap | ~22KB (flag >15KB as heavy) |
| `native-flush.md` | Exists? Bare or loaded? | — | — |
| `memory/archive/` | Dir exists? File count | — | — |
| `activity-log/` | Dir exists? File count | — | — |

## How to read "size"

Use the `size` field from the GitHub `get_file_contents` directory listing (returns bytes). Do NOT fetch file bodies just to measure them.

## Threshold bands

| Band | Condition | Meaning |
|---|---|---|
| 🔴 CRITICAL | Any file ≥ 22KB | Blocks next session open. Cannot be read whole. |
| 🟠 ACTION | `memory.md` > 10KB OR `activity-log.md` > 5KB | Over target budget. Rotation needed. |
| 🟡 WATCH | >70% of budget (memory >7KB, activity >3.5KB) OR loaded `native-flush.md` OR decision-log >15KB | Approaching cap or has pending work. |
| 🟢 CLEAR | All files under 70% of budget, archives exist, no pending flush | Healthy. |

## Structural health signals

| Signal | What it means |
|---|---|
| No `memory/archive/` dir | Rotation has NEVER fired for this agent. Either the agent is new or rotation is being skipped at close. |
| No `activity-log/` dir | Quarterly activity drain has never fired. |
| `native-flush.md` loaded (not bare) | A dump is waiting for Maggie to drain. Age of the dump matters: older = more stale risk. |
| `native-flush.md` absent | Agent does not have the intake wired yet (not all do). Not a flag. |

## What this spec does NOT do

- It does not prescribe WHAT to cut. That's Maggie's judgment.
- It does not execute rotation. That's `hooks/memory-rotation.md`.
- It does not decide priority order. The consumer (routine, auditor) applies its own ranking.
- It never touches the files. Measurement is read-only.

---

## Changelog

- 2026-08-09 — Created. Extracted from the agent-memory-report routine design to serve as a shared reference for measurement logic across Ricky, Maggie, and Anna.
