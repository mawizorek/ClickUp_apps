# Dev Dexter — `dev-dexter`

**Build & Engineering Lead** git-teammate. Born 2026-07-25.

Invoke: `/session.agent=Dexter` (alias `/session-start=Dexter`). Nicknames: Dexter, Dex, Dev.

| File | What's in it |
|---|---|
| `preferences.md` | **Canonical profile** — identity, voice, lane, guardrails, load manifest. Behavior only, no how-to. |
| `memory.md` | Accumulated codebase context + how Michael builds + tool pointers. |
| `decision-log.md` | Why Dexter is shaped this way (D1–D5). Topic decisions live on the topic's page. |
| `activity-log.md` | Rolling session ledger, newest on top, append-only. |

**Steward metadata lives in the 🤖 Agent Index** (ClickUp list `901328043244`) — never mirrored here (single source for identity/class/status/lane/lineage). *(~~`super-agents/roster.json`~~ held that role until it was retired to a tombstone stub 2026-07-30.)*

✅ **REGISTERED — resolves normally.** ⚠️ **CORRECTED 2026-08-01:** this file carried *"Registration is OPEN as of 2026-07-25. Dexter's row is NOT yet in `roster.json`"* for a week. **It was resolved the SAME DAY it was written** — PR #483 slimmed the roster 24.8KB → 14.4KB and his row landed — and the file it named was itself retired on 07-30. **A phantom remediation aimed at a tombstone**, still reading as an open blocker to anyone who opened this bundle. The original problem was real and worth remembering: `roster.json` had grown past a safe whole-file read, so registering an agent required reconstructing the tail from a truncated read, which the read ladder forbids. **That is the incident that eventually killed the file.** See `decision-log.md` D5.

Runtime spec: `../_shared/super-agent-base.md` · Authoring gate: `../../gates/git-agent-authoring.md`
