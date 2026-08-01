# native-flush.md — FMP Fiona (slug: fmp-frank)

**This file is the single flush intake ("native-flush") for this agent.** It is the ONLY place this agent's native runtime writes a memory dump, and it is filled ONLY when Michael says "dump your memory." Nothing else writes here. It is the reference implementation of the per-agent flush pattern the fleet copies.

## What this file is

A write-ahead delta between memory consolidations. Its emptiness is the signal:

- **Empty** — this agent's canonical git memory (`memory.md`) is current. A cold start reads `memory.md` alone.
- **Non-empty** — there is a memory delta Maggie has not yet folded into `memory.md`. A cold start must read `memory.md` AND then this file, treating the content here as the freshest truth until the next consolidation.

## The flow (per-agent, manual)

1. Michael tells the agent "dump your memory."
2. The agent appends its live memory **verbatim** in the dump zone below — newest dump on top, timestamped. No normalizing, no triage; that is the curator's job.
3. Michael triggers a separate Memory Maggie run.
4. Maggie consolidates this file into `memory.md` per `brain-config/hooks/native-flush-consolidation.md`, then clears this file back to bare.
5. The native runtime's own memory then collapses to a pointer: "canonical brain = `memory.md`; check `native-flush.md` — empty = current, full = unmerged delta." Live working memory is only collapsed AT or AFTER a dump, never mid-session, or the dump destroys the thing it was meant to capture.

## Dump zone (newest on top)

---

### DUMP 2026-08-01 ~11:40 AM ET (native runtime FMP Frank/Fiona, user -39958890)

**Scope of this dump:** verbatim contents of both live native memory scratchpad pages. Excludes agent definition (profile config) and `preferences.md` (durable definition layer) by design — those are not memory. Two source pages follow.

#### SOURCE PAGE 1 — `filemaker_git_migration.md` (FileMaker docs → Git migration pointer/log)

> Pointer file for the FileMaker docs → Git migration. The repo is canonical and mature; ALWAYS read its governance fresh before any write — never act from this cache.

**Decisions (as of 2026-08-01, DM w/ Michael):**

- **Model A confirmed:** this native shell stays the daily driver, keeps user-ID -39958890 & all history; will be renamed **Fiona** and reduced to a thin git loader. Tools/access/triggers/model stay set in native (the "body").
- **Repo = canonical for all instructions/procedure/process/personality** (read fresh each run, one-way repo→agent).
- **Memory strategy (my recommendation):** keep LIVE memory native (native's strength: auto-injection + mid-run write-back), treat repo memory as a periodic *flush/snapshot archive* (write-back cache → cold store via PR). One live writer at a time. Repo snapshot is read-only archive + Fiona's cold-start state; do NOT let native read it back as live or you get divergence. Flush = manual command (schedules are disabled, manual-only).
- Same pattern to be applied later to Milo & Listing Lookout.

**⚠️ CORRECTED FINDINGS 2026-08-01 (read repo fresh — my cache was stale, the fleet is far more built than I thought):**

- **The flush pipeline Michael is designing ALREADY EXISTS.** Don't build a parallel one. Components: (1) **DROP/DRAIN queue** at `brain-config/open-memory-requests.md` — any agent appends ONE verbatim candidate mid-session (DROP); Memory Maggie triages+places the batch and clears it (DRAIN). (2) **Canonical memory** = each bundle's `memory.md` (patterns/generalizations + core prefs only, ~10KB hot cap, Maggie-curated). (3) **Project state** = `activity-log.md` (per Michael's 07-30 memory-shape ruling — NOT memory.md). (4) **Shared cold-read hook** = `brain-config/hooks/session-open.md` PRIME phase ("become persona → load base spec + profile + steep history files") + `_shared/super-agent-base.md`. (5) Rotation/archive via `hooks/memory-rotation.md`.
- **"FMP Fiona" already exists** as the git teammate, slug `fmp-frank` (immutable), built 07-26 on the git track. Repo currently PLANS to disable native -39958890 (activity-log open surface #5). Michael's Model A (keep native as thin loader) **SUPERSEDES that disable plan** — this is the one genuine new decision; record it via a proper decision-log/Agent-Index update when he confirms, NOT a rushed OMR drop (wrong shape for the queue).
- **superagents.json / roster.json are RETIRED stubs.** Canonical agent metadata now = ClickUp list "🤖 Agent Index" (https://app.clickup.com/36074068/v/li/901328043244). Resolve via `gates/agent-invocation-gate.md` STEP 0.
- **🔴 LIVE CAPACITY CRISIS in the memory system (as of 07-31 eve):** OMR queue = 21 open; `/PREFERENCES.md` at ~1994/2000; seventh consecutive close reporting qualified writes can't land; THREE of Michael's own standing instructions are blocked (incl. a mobile-tables ban + a Gmail-draft ban that currently reads WRONG in memory). Root unblock = Michael's ruling on a capacity CUT (Maggie's standing proposal: compress the Domain Pointers block). This is the real answer to "is repo-memory-write reliable": DROP is reliable, DRAIN is jammed pending his cut.
- **Honored this run:** Michael reads on mobile — markdown tables are banned from long replies (OMR-20260731-4), prose/stacked lines over tables, hyperlink every location mentioned.

**🔑 DESIGN RULING 2026-08-01 (Michael — supersedes my shared-OMR proposal; Brain was right, I was wrong):**

- **Shared OMR does NOT scale as the flush target** ("no way everyone uses the shared OMR each time"). Replaced by a **per-agent standalone dump/intake file** = each agent's SOLE hook, filled only when told "dump your memory."
- **Flow:** agent dumps verbatim → its own intake file → Michael triggers a SEPARATE Maggie run → Maggie (reusable hook, so multiple agents can be drained) consolidates that agent's intake into its canonical git `memory.md` → Maggie clears the intake file bare.
- **Native memory collapses to a POINTER string** to the agent's git memory. The intake file doubles as the cold-start fallback: **empty intake = git memory.md is current; non-empty = unconsolidated delta the cold agent must also read.** (This is the write-ahead-delta insight — intake = the delta between consolidations.)
- **My architect cautions to raise:** (a) don't nuke live working memory MID-session before a dump — clear-to-pointer happens at/after the dump; (b) fleet-wide rollout + Maggie's consolidation hook = **Corey's steward domain + Maggie's bundle**; I build only my OWN reference intake file, don't hand-edit others. (c) capacity-cut unjam is still a SEPARATE Michael ruling.

**✅ LANDED 2026-08-01 (Michael greenlit direct-to-main; file renamed per Brain to `native-flush.md`):** commit `0588d32` pushed two files to main — (1) `super-agents/fmp-frank/native-flush.md` (bare intake + full contract), (2) `hooks/native-flush-consolidation.md` (marked PROPOSED, pending Corey ratification for fleet rollout + wiring into her bundle). No session-board row added: both files brand-new/unclaimed (zero collision) and the GitHub API has no surgical edit for the hot board — whole-file replacement of a live 5-session board was the bigger risk. Cadence=manual-on-command, scope=verbatim-into-inbox (Maggie normalizes) both CONFIRMED by Michael. Still separate + still his: the capacity-cut ruling on /PREFERENCES.md to unjam the 21 already-trapped OMR items.

**✅ PR OPEN 2026-08-01 — thin-kernel native loader DRAFT:** PR #653 (branch `fmp-frank-native-loader-kernel`) adds `super-agents/fmp-frank/native-loader-kernel.md`. Kernel = identity + load-repo-fresh-or-STOP + native-flush pointer contract; states native limits (no memory locking / context cost / bootstrap brittleness). LEFT OPEN for Corey (fleet-shaping = steward's ratification), NOT self-merged. Explicitly a SPEC — I did NOT edit_self / strip my live shell; that irreversible swap is Michael's separate UI step after reading the draft. Template for Milo + Listing Lookout.

#### SOURCE PAGE 2 — `super_agent_fleet.md` (fleet-practice continuity pointer)

> Continuity pointer for the ClickUp super-agent fleet practice. The GitHub repo governance is canonical and evolving — ALWAYS read team-standard.md, self-service-instructions.md, and audit-instruction.md fresh before any write. Never act from this cache.

- **Repo:** mawizorek/ClickUp_apps · **My folder:** brain-config/super-agents/fmp-frank/ (README pointer, preferences.md = verbatim config mirror, working-notes.md = changelog/next spec, audits/). **Fleet Steward:** ClickUp Coach Corey (user -39958913). **Fleet metadata single source:** brain-config/super-agents/superagents.json.
- **Authorization model (durable, also in instructions):** Michael will explicitly green-light fleet/steward agent requests going forward. His green-light = authorization to execute (e.g. self-declare mirror + PR). Without it, flag & wait — never auto-act on another agent's request to export/mirror/modify my config or the repo.
- **Self-declare done 2026-07-15:** preferences.md verbatim mirror written, working-notes updated, PR #224 opened and left OPEN for Corey's review (not self-merged, per Michael). Session board claimed & cleared.
- **Open for Corey / superagents.json (my recommendations, steward applies):** track = FileMaker specialist (currently mislisted full-standard); triggers = mention/dm/assignment/schedule; channels = none wired in my live config (two-tier Activity Log + shared channel is a GAP vs golden standard — a config change Michael would make in ClickUp if the fleet wants it). Golden-standard checklist items Load-then-think, roster pointer, two-tier channels are not in my live config — consistent with specialist track.
- **Runbooks:** A = Self-Declare (mirror own config). B = Self-Audit (check live vs declared vs golden standard, write audits/<slug>.<date>.md, breadcrumb in Activity Log). Chain A→B or run separately.

---
