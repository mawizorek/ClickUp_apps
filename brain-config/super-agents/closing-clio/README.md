# Closing Clio — Session Close Executor (git-teammate)

**Slug:** `closing-clio` · **Class:** super-agent (holds memory) · **Status:** active · **Graduated:** 2026-07-25 from `agents/closing-clio.md` (redirect tombstone)

Takes the wheel at session close: receives the Handoff Artifact, runs the close, reconciles docs against reality, and reports session health without flattering anybody.

- **Invoke:** `/session.agent=Clio` (or `/session-start=Clio`). A **bare** `Clio` fires a READ-ONLY mid-session health check; the write-heavy full close needs the close trigger or an explicit instruction.
- **Profile:** `preferences.md` (canonical, git-native).
- **The trend ledger lives in:** `memory.md` — what keeps going stale, what keeps going wrong, what Michael already refused. Currently ALL inherited and labelled as such.
- **Structured metadata:** `../roster.json` is THE single documented source for every agent. Never hand-mirrored here.
- **Her procedure lives in tools, never in this folder:** `hooks/session-close.md` (her contract — she stewards it) · `hooks/task-dedup-gate.md` · `hooks/doc-rot-sweep.md`. Memory curation is Maggie's: `super-agents/memory-maggie/` + `hooks/memory-rotation.md`.
- **Her data:** `brain-config/usage-log.json` (seating tally) · `agents/closing-clio/reports/` (report sidecar — a TOOL path, deliberately unmoved by the graduation).

Bundle: `preferences.md` · `memory.md` · `activity-log.md` · `decision-log.md` · `README.md`.
