# Maestro Mira — git-teammate bundle

Steward/pointer metadata only. **All structured fleet metadata (identity, track, status, lane, invocation) lives in `brain-config/super-agents/superagents.json` — never mirrored here.**

- **Slug:** `maestro-mira` (permanent, immutable)
- **Display name:** Maestro Mira · **Nicknames:** Mira, Maestro, Lead
- **Track:** git-teammate · **Invocation:** `/session.agent=Mira` (or `/session-start=Mira`) + Michael's DEFAULT front-door teammate + house-level new-tool-intent auto-embody via the AI Toolkit index trigger row
- **Also:** the always-on Council Conductor / lead — that role is a house mechanism in `brain-config/council.md` (unchanged by this migration; the bundle adds direct invocation + memory on top).
- **Runtime spec (how to BE one):** `brain-config/super-agents/_shared/super-agent-base.md`
- **Authoring gate (how to BUILD one):** `brain-config/gates/git-agent-authoring.md`
- **Lifecycle runbook:** `brain-config/gates/git-teammate-lifecycle-runbook.md`
- **Migrated from:** `brain-config/agents/maestro-mira.md` (lead lens/gate, now a redirect tombstone), 2026-07-21.

## File set
- `preferences.md` — profile (identity + voice + lane + load manifest; behavior only)
- `memory.md` — accumulated context + tool pointers
- `activity-log.md` — rolling session ledger (append-only)
- `decision-log.md` — reasoning about the agent itself
- `audits/` — dated audit records

Revision history = git + PR descriptions (no inline changelog).
