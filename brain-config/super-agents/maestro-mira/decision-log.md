# Maestro Mira — Decision Log (reasoning about the AGENT itself)

> Why this teammate is shaped the way it is. Topic decisions live on the topic's own page; this is about Mira-the-agent. All four decisions below were worked out in the 3-pass audit loop on the migration session task (2026-07-21).

## D1 — Migrate the lens to a git-teammate, adding ONLY invocation + memory

**Q:** Mira was a lead-lens/gate. What does turning her into a git-teammate actually change?
**Decision:** It adds exactly two things — session-invocability (`/session.agent=Mira`) and cross-session memory — and nothing else. Her always-on Council-lead role stays a house mechanism (council.md + the charter), UNCHANGED. She presides regardless of invocation; invoking foregrounds her and holds her across a session.
**Why:** the runbook Entry B + the migration's true-purpose read (Anna, Pass 1): the migration only earns its keep if the bundle carries lens-impossible value (memory + inhabitable voice), not if it relocates the council mechanism. Two owners of one role is exactly the contradiction the git-teammate audit DoD check #6 exists to catch.

## D2 — Procedure stays as pointers; add an anti-drift fence

**Q:** Mira is ~90% procedure by nature (the 14-step charter). How does that survive Constitution §2–§3 (agents store no procedure)?
**Decision:** the profile + memory hold identity / voice / interpretation + pointers to council.md / the charter / the-workshop.md / session-transcript-gate.md. Zero seating steps in the bundle. Added an explicit anti-drift fence at the top of preferences.md: "if you're about to add a seating step here, it belongs in council.md."
**Why:** Cleo's frame — council.md is the score, Mira is the conductor. Rhys's pre-mortem — the slow failure is profile rot (someone pastes a step back in a year from now); a self-documenting fence is cheap insurance. Frank's anti-sprawl religion — duplicating council.md into the profile is the drift.

## D3 — Keep the lens file as the charter home; do NOT tombstone it

**Q:** Anna's migration tombstoned `agents/audit-anna.md`. Do we tombstone `agents/maestro-mira.md` the same way?
**Decision:** NO. Anna's procedure lived in EXTERNAL tools, so tombstoning her lens lost nothing. Mira's 14-step charter lives IN her lens file, and council.md points at it as the charter home. A blind tombstone would delete the charter. So the lens stays LIVE as the charter / house-mechanism home, with a disambiguation header pointing at the teammate bundle to kill Beckett's "two Miras" double-load risk.
**Why:** faithful to the runbook's "always-on lead role UNCHANGED" while being non-destructive. The double-load risk Beckett raised is handled by the header (the lens declares it's the charter layer, the bundle declares it's the persona layer), not by deletion. This is the one place the Pass-2 Workshop assumption ("tombstone it like Anna's") did NOT survive contact with the real files — caught by re-auditing the shipped artifact, not the prose.
**Follow-up (OPEN):** the clean long-term end state is to relocate the charter into council.md and THEN tombstone the lens — a scoped refactor for a future session, deliberately NOT done under this ship's time pressure. Flagged to Felix.

## D4 — Auto-embody trigger stays a house index row

**Q:** the "new tool floated → Mira takes the wheel" auto-embody behavior — does it carry into the bundle?
**Decision:** it stays a HOUSE row in the AI Toolkit Quick-Scan trigger table; the bundle points at it, doesn't own it.
**Why:** runbook B.3 — a lens whose auto-fire was a house index-trigger row CAN carry (repoint the row); only agent-STORED trigger scaffolding is lost. Enzo + Frank: copying it into the bundle as if she owns it is the same anti-drift smell as D2.
