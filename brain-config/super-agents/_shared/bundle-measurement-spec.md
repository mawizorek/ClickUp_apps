# Bundle Measurement Spec

**Purpose:** Reusable recipe for measuring the health of a single agent bundle. Used by:
- `routines/agent-memory-report.md` (fleet-wide diagnostic)
- Memory Maggie (during drains and rotation passes)
- Audit Anna (during bundle audits)
- Any future consumer that needs to answer "is this bundle healthy?"

**Canonical budget definitions live in:** `hooks/memory-rotation.md`. This file references them, never restates them.

---

## What to measure

For an agent bundle at `brain-config/super-agents/<slug>/`, read and record:

| File | Metric | Budget | Source of budget |
|---|---|---|---|
| `memory.md` | byte size | ~10KB hot cap | `hooks/memory-rotation.md` |
| `activity-log.md` | byte size | ~5KB sliding window | `hooks/memory-rotation.md` |
| `decision-log.md` | byte size | no hard cap (informational) | — |
| `preferences.md` | byte size | no cap (identity, not rotated) | — |
| `native-flush.md` | exists? bare or loaded? | bare = healthy, loaded = pending drain | `hooks/native-flush-consolidation.md` |

## Structural signals

| Check | What it means |
|---|---|
| `memory/archive/` dir exists | Rotation HAS fired at least once for this agent |
| `memory/archive/` dir missing | Rotation has NEVER fired — if memory.md is large, this is a problem |
| `activity-log/` dir exists | Quarterly activity drain HAS fired |
| `activity-log/` dir missing | No quarterly drain has occurred — check activity-log.md size |
| `native-flush.md` exists and is loaded (non-bare) | Pending intake waiting for a Maggie drain session |
| `native-flush.md` missing | Agent does not have a native-flush intake (may or may not be expected) |

## Tier classification

Apply these thresholds after measuring:

| Tier | Condition |
|---|---|
| 🔴 **CRITICAL** | Any file > ~22KB (the read ceiling — blocks session open) |
| 🟠 **ACTION** | `memory.md` > 10KB OR `activity-log.md` > 5KB (over target budget, rotation needed) |
| 🟡 **WATCH** | `memory.md` > 7KB OR `activity-log.md` > 3.5KB (>70% of budget) OR native-flush loaded OR on the watchlist |
| 🟢 **CLEAR** | All files under 70% budget, no pending flush, no structural concerns |

## Notes for consumers

- **Sizes are approximate.** The git blob API returns base64-encoded content; decode first, then measure the raw bytes. Do not measure the base64 string length (inflated ~33%).
- **"Bare" native-flush** means the file contains only its header template and an empty dump zone. Any content below the dump-zone marker = loaded.
- **Decision-log.md has no hard cap** but flag it at >15KB as "getting heavy" for awareness. It uses partial loading (TOC + last N entries) so it doesn't block session open the way memory.md would.
- **Missing files are not errors for all agents.** Older agents may lack `native-flush.md` (not yet rolled out). Newer agents may lack archive dirs (rotation hasn't been needed yet). Context matters.
