# Audit Anna — git-teammate Verify DoD

**Date:** 2026-07-21 · **Auditor:** cold Brain session (the runbook's own acceptance vehicle) · **Standard:** git-teammate audit DoD v0.1 (`gates/git-teammate-lifecycle-runbook.md#verify`) · **Subject:** the freshly-migrated `audit-anna` git-teammate bundle.

> Note: this is a self-audit run BY the conversion session, which is unusual (normally Anna audits others). It's the runbook's designed cold-start proof, so recorded as such. A later independent pass by another session is welcome, but the internal-consistency bar is objective enough to check cold.

## Result: **PASS** (8/8)

| # | Check | Verdict | Evidence |
|---|---|---|---|
| 1 | Base pointer present | PASS | `preferences.md` line 1 = the `_shared/super-agent-base.md` pointer, verbatim per the authoring gate. |
| 2 | Load manifest valid | PASS | Manifest lists preferences / memory / decision-log / activity-log (+ superagents.json/registry.json + session-board), all present, DEEP-steep default. |
| 3 | superagents.json row accurate | PASS | Row present: slug `audit-anna`, track `git-teammate`, status `active`, invocation `/session.agent=Anna` (+ house auto-seize), lane matches; `last_audit=2026-07-21`, `golden_standard_version='git-teammate v0.1'` stamped. |
| 4 | registry.json row present + agreeing | PASS | type flipped subagent→`git-teammate`, profile now `super-agents/audit-anna/preferences.md`, role note agrees with superagents.json (no contradiction). |
| 5 | Bundle files present + in-format | PASS | All five present (preferences, memory, activity-log, decision-log, README) + this `audits/` record. memory.md holds context/pointers only (no procedure); decision-log.md is about the AGENT (not topics); README mirrors no superagents.json fields. |
| 6 | No cross-file contradiction | PASS | The classic miss (a stripped role still asserted in memory) is clean: memory.md points at the tools it no longer stores, and tells the same lens→teammate story as preferences + the manifests. |
| 7 | Voice distinct | PASS | Self-announce `> 🔍 **Anna here**` + prosecutor tone; no bleed with Felix (calm/institutional), Wes (driving), Corey (coach), Renata (repo). |
| 8 | Index mirror fresh | PASS | AI Toolkit index updated same session: roster moved Anna to the git-teammate fleet, audit-intent trigger row repointed to embody her, `/session.agent=Anna` literal row added. Mirror-pair reconciled with registry.json. |

## Ledger
Empty. No GAP / PARTIAL. One OPEN follow-up (does NOT hold the ledger, it's a runbook-improvement item, not an internal-consistency defect): graduate the git-teammate audit DoD into `super-agents/audit-instruction.md` as the formal git-teammate track (Anna + Felix), and add the runbook line about incubating personal output-formats (see decision-log.md + the session's runbook-feedback writeup).

## Cold-start proof
The runbook's standing acceptance test (migrate Audit Anna, lens→teammate, by a cold agent following ONLY the runbook) ran end to end: defined nothing from Felix's head, orphaned no files (old lens redirected), landed registered across the mirror pair + index, and cleared this DoD. **Runbook holds cold.** Feedback on what it assumed-but-didn't-say: see decision-log.md §OPEN + the session runbook-feedback writeup.
