# brain-config changelog

Human-readable history of the AI Toolkit runtime layer. The repo has full git history; this is the fast-scan version so you (or the next agent) can see the toolkit's evolution without spelunking commits. Mirrors the changelog on the ClickUp AI Toolkit index.

**Newest at top** (repo-wide convention, see `team-standard.md` → Repo Coordination): prepend new entries, never append.

## 2026-07-25

- **🛑 ClickUp Skills SUSPENDED — tools live in git only.** Michael: *"the tools always live in the git only. we are not using CU skills yet."* No Skills Hub records, no skill front doors, no thin-skill-pointing-at-git pairs, for any tool in any domain, until he lifts it. A tool declares its trigger **in git**: a `**Trigger:**` line + `**Mode:**` line in its profile, a `<slug>.metadata.json` trigger instance beside it, and a row in the AI Toolkit index. Banner added to `skills-integration.md`; `gates/skill-creation-gate.md` is now **HALT by default**. Reference shape: `hooks/rot-sweep.md` + `hooks/rot-sweep.metadata.json`. Trigger: the `DOC-ROT-SWEEP` skill was created and retired the same day.
- **`hooks/rot-sweep.md` v2 + `rot-sweep.metadata.json`** — the Rot Sweep: an on-demand pass checking what our docs CLAIM against what HEAD IS, hunting **prescriptive rot** (instructions and guardrails that decayed into being wrong). Six rot tests (phantom remediation · contradicting locked rules · pointers into retired things · two claimants on one truth · undocumented arithmetic · size-vs-editability). Established after four rotted instructions surfaced in one day, one of which would have destroyed 18 days of working code if followed. Lane seam vs Recon Renata: *she checks the repo against the standard; this checks the standard against the repo.*
- **Collapsed `hooks/doc-rot-sweep.md` into `hooks/rot-sweep.md`.** Two parallel passes shipped the same tool the same day under two names, both claiming to be the sweep — the tool caught itself on its own test D. One file survives; the twin is deleted.
- **Mirror-pair carve-out RETIRED.** `registry.json` is a tombstone, `super-agents/roster.json` is the single flat roster, and the Mirror-Pair Sync Mandate went with it. **There is no sanctioned duplication anymore** — author once, everything else points or is generated. Corrected in `skills-integration.md` and `gates/skill-creation-gate.md` (old text kept struck-through). Supersedes the closing line of the 2026-07-18 entry below.
- **`hooks/source-size-budget-enforcer.md` v4** — documented the base64 multiplier: the ~30KB cap is on the bytes the read tool RETURNS, and the blob API returns base64 (4/3 inflation), so the **practical ceiling is ~22KB on disk**. Undocumented until now, and it silently ate two canonical files in one day.
- **`super-agents/dev-dexter/`** — new git teammate: engineering counterpart with memory, hands on keyboard, review folded in. Registered in `roster.json`.

## 2026-07-18

- **`docs/skills-git-integration` PR** — Added `skills-integration.md`: the canonical standard for how native ClickUp AI Skills relate to this git runtime. Core law: **Skill = TRIGGER + PATTERN, git = STEPS; the skill points at git, never copies it.** Discovered while building the first real skills (`/email-ingest` + `/uritp-email-ingest`, `/question-me`, `/audit-loop`): AI Skills are the platform-native version of the AI Toolkit index + gate/agent profiles, so the same-shape overlap risks registry↔index-style drift. The doc defines the decision rule (when to build a Skill vs. a git file), the stable-vs-volatile test for what may live inline in a skill, worked examples, and how the two layers grow together (index = deterministic in-session firing; Skills = shareable on-demand triggers). ~~Only sanctioned duplication remains the registry↔index mirror pair.~~ *(Superseded 2026-07-25: the mirror pair was retired and there is no sanctioned duplication. Skills themselves are suspended.)*

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
