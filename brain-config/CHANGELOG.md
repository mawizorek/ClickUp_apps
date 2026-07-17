# brain-config changelog

Human-readable history of the AI Toolkit runtime layer. The repo has full git history; this is the fast-scan version so you (or the next agent) can see the toolkit's evolution without spelunking commits. Mirrors the changelog on the ClickUp AI Toolkit index.

**Newest at top** (repo-wide convention, see `team-standard.md` → Repo Coordination): prepend new entries, never append.

## 2026-07-16

- **`docs: log-order` PR** — Standardized newest-at-top ordering across the repo's chronological logs (D-018). Flipped `Vectorworks/DECISION-LOG.md` (was oldest-first / append → newest-first / prepend) and made the convention explicit here. Canonical rule added to `brain-config/team-standard.md` (Repo Coordination, v1.2); VWX note in `Vectorworks/VWX-BEST-PRACTICES.md` (Documentation conventions). Per-entity ledgers (`VERSIONS.md`) exempt.

## 2026-07-03

- **`1c798...` → this commit** — Added two write-chain hooks + a memory hook, plus this changelog:
  - `hooks/post-build-verify.md` (v1) — post-commit, fetch the live Pages URL and confirm it's current; closes the silent-stale-build trap.
  - `hooks/skill-ban-guard.md` (v1) — byte-level pre-commit scan for DESIGN-UI absolute bans (gradient text, side-stripe borders, etc.). Born from the gradient-text miss on the fireworks build.
  - `hooks/memory-write-relay.md` (v1) — on a failed memory write, flag once + emit a copy-paste block for the memory agent, defer confirmation, batch at checkpoints. Graduated from a 🎯 roster line.
- **`1c79890`** — `agents/red-team-reviewer.md` v2: Professionalism lens now explicitly checks the active skill's hard bans (the seven generic lenses missed the DESIGN-UI gradient-text ban on the fireworks build).
- **`c38841c`** — `quickfire/fireworks-countdown/` shipped (deep-run test of the full tool chain: Red-Team → Scope Lock → build → Secrets/Size guards → commit → Repo Auditor → Process Auditor). Not a brain-config change; logged for the test trail.
- **`33c73b1`** — `brain-config/` scaffold created. Established the ClickUp↔repo split: guidance index + prose stay in ClickUp, concrete tool definitions live here with commit history. Initial set: `hooks/secrets-pii-guard.md`, `hooks/source-size-budget-enforcer.md`, `agents/red-team-reviewer.md`, `agents/repo-auditor.md`, `agents/research-runner.md`, plus `README.md`.
