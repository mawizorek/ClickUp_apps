# Super-Agent Audit Instruction — v0.4

Canonical procedure a ClickUp Super Agent OR git-teammate follows when told "audit yourself
(or another agent) against your configuration." This file is the source of truth for BOTH audit
tracks. Do not mirror it into a ClickUp doc — link to it.

STATUS: v0.4 working draft. Michael annotates directly in this file. Bump version + changelog when
blessed.

---

## Two tracks (pick by agent type)

| Track | Applies to | Audit model | Checklist |
|---|---|---|---|
| **Native full-standard** | ClickUp Super Agents with a LIVE config | **live-vs-declared** drift (config vs `preferences.md` mirror vs golden standard) | Golden-standard checklist v1.0 (below) |
| **git-teammate** | session-invocable personas in `super-agents/<slug>/` (no live config) | **internal consistency** (no live config to diff) | git-teammate audit DoD v0.1 (below) |

Why two: a native agent has a live ClickUp config that can DRIFT from its declaration, so its audit
diffs live-vs-declared. A git-teammate is git-canonical — there is nothing live to diff — so its
audit instead proves the bundle is internally coherent and will load clean cold. Same discipline
(walk a checklist, classify PASS/PARTIAL/GAP, record via PR); different bar.

---

## Purpose

Give every super agent / git-teammate one exact, repeatable procedure to verify its configuration
and record the result as a version-controlled audit whose PR history is the rollback + audit trail.

When an agent is told "audit yourself," it knows precisely:
1. Which configuration to check  -> its own folder `brain-config/super-agents/<slug>/`.
2. Which track + checklist to run -> this file (native vs git-teammate, table above).
3. Where the result goes           -> an audit record committed via PR under `<slug>/audits/`.

---

## Fleet home & file model (single source, no hand-mirror)

```
brain-config/super-agents/
  superagents.json     # ALL global metadata for every agent (identity, track, version, status,
                       #   channels, lane, triggers). SINGLE SOURCE. Hand-edit this.
  index.html           # renders superagents.json (view only, no data)
  index.md             # pointer only
  audit-instruction.md # this file
  <slug>/
    README.md          # pointer only — NO metadata (never mirror superagents.json fields)
    preferences.md     # NATIVE track: NEAR-1:1 VERBATIM MIRROR of the agent's live ClickUp config.
                       #   GIT-TEAMMATE track: the canonical PROFILE (identity + voice + lane +
                       #   load manifest; behavior only, NO how-to). There is no live config to
                       #   mirror — the profile IS canonical.
    memory.md          # git-teammate: accumulated context + pointers to stewarded tools (not process)
    activity-log.md    # rolling session ledger (newest on top, append-only)
    decision-log.md    # git-teammate: reasoning about the AGENT ITSELF (topic decisions live on the topic page)
    working-notes.md   # native: next spec / working notes / per-agent revision log
    audits/<slug>.<YYYY-MM-DD>.md  # dated audit records, one per audit, via PR
```

RULE: any structured metadata fact lives ONLY in `superagents.json`. Folder files never restate it.
Distinct from `brain-config/agents/` (the Brain-session council lenses).

---

## NATIVE TRACK — procedure (high level)

1. Load the three inputs:
   - LIVE config: the agent's current ClickUp instructions / triggers / tools / knowledge.
   - DECLARED config: its `superagents.json` entry + `<slug>/preferences.md` (the verbatim mirror).
   - GOLDEN STANDARD: current version + requirements (see checklist).
2. Confirm the golden-standard version being audited against; record it on the result.
3. Walk the golden-standard checklist item by item, comparing LIVE vs DECLARED.
4. Classify each item: PASS | PARTIAL (works but drifts) | GAP (missing/violates).
5. Record divergences between LIVE config and the declaration explicitly — these are actionable.
   A drift between the LIVE config and the `preferences.md` mirror is itself a finding: either the
   live config changed (re-sync the mirror) or the mirror is stale (fix it).
6. Write the audit record to `<slug>/audits/<slug>.<YYYY-MM-DD>.md` using the shape below.
7. Update the agent's row in `superagents.json` (status, version, last_audit). If the live config
   changed, re-sync `preferences.md` to match verbatim and bump its header timestamp.
8. Recommend fixes for the agent's owner/manager. NEVER edit another agent's live config directly.
9. Commit via PR and merge — the PR is the audit trail. See PR-body standard below.

### Golden-standard checklist (v1.0) — NATIVE track

Full-Standard agents are checked against these. Task-Specific / Exempt agents skip this.

| # | Requirement        | What "pass" looks like                                                    |
|---|--------------------|---------------------------------------------------------------------------|
| 1 | Identity block     | Name, creator attribution, model/vendor-silent rule present.              |
| 2 | Load-then-think    | Reads Activity Log + shared cross-agent channel (+ refs) before acting.   |
| 3 | Roster pointer     | Cross-Agent Roster held as a pointer, not hardcoded lanes.                |
| 4 | Two-tier channels  | Dedicated Activity Log + shared channel, wired and used.                  |
| 5 | Guardrails         | Post-only-where-triggered; propose-and-wait; never-delete; flag-unverified.|
| 6 | Memory-over-thread | Durable changes persisted to instructions/memory, not just in-thread.     |
| 7 | Copy-block fences  | Copy-pasteable prompt/code/config wrapped in ```markdown fences.          |
| 8 | Declaration in sync| superagents.json row + preferences.md verbatim-match live config; version recorded.|

---

## GIT-TEAMMATE TRACK — procedure + DoD (v0.1, graduated here 2026-07-21)

Git-teammates have **no live config to diff**, so the native live-vs-declared mirror test does NOT
apply. The bar is **INTERNAL CONSISTENCY**: will a cold `/session.agent=<Name>` load a coherent,
non-contradictory agent? *(This DoD was authored inline in `gates/git-teammate-lifecycle-runbook.md`
as v0.1 and validated on the Audit Anna migration 2026-07-21; graduated into this file as the formal
track so the runbook POINTS here instead of holding procedure inline. The runbook remains the
define/migrate spine; the audit bar lives here.)*

**Procedure:** load the agent's bundle (`preferences.md` + `memory.md` + `decision-log.md` +
`activity-log.md`) + its `superagents.json` and `registry.json` rows. Walk each check below, classify
PASS / PARTIAL / GAP, record via PR under `<slug>/audits/`.

### git-teammate audit DoD (v0.1)

1. **Base pointer present** — `preferences.md` opens with the `_shared/super-agent-base.md` pointer line.
2. **Load manifest valid** — the manifest lists real, present files in load order; deep-steep default.
3. **superagents.json row accurate** — slug/track/status/invocation/lane match reality; `last_audit`
   + standard version stamped.
4. **registry.json row present + agreeing** — no contradiction with superagents.json.
5. **Bundle files present + in-format** — all five exist; each holds ONLY its kind (no procedure in
   memory; no metadata mirrored into folder files; no topic-decisions in the agent's decision-log).
6. **No cross-file contradiction** — memory.md, preferences.md, and the manifests tell ONE story.
   (The classic miss: a stripped role still asserted in memory. Highest-value check.)
7. **Voice is distinct** — self-announce header + tone do not bleed into another teammate.
8. **Index mirror fresh** — the AI Toolkit roster/trigger row matches the JSON.

A PARTIAL or GAP holds the agent's Open-Surface Ledger open until resolved. Record the result as a
dated audit file under `super-agents/<slug>/audits/<slug>.<YYYY-MM-DD>.md` via PR.

---

## Audit record shape (`audits/<slug>.<date>.md`)

```
<slug>: Self-Audit — <YYYY-MM-DD>
Agent: <Display Name> (<slug>)
Track: <native | git-teammate>
Auditor: <self | Audit Anna | Fleet Steward>
Standard: <golden v1.0 | git-teammate DoD v0.1>
Overall: <Up to date | Partial | Behind>

Checklist results:
1. <item> ....... PASS
...  (per item; one-line note on any PARTIAL/GAP)

Divergences / contradictions:
- <none | specific gap + recommended fix + who fixes it>

Actions recommended:
- <concrete config edit for owner/manager>
```

---

## PR-body standard (MANDATORY — Michael, 2026-07-15)

Every audit/declaration PR body must be self-contained about what the push actually did. Do NOT
leave the substance in chat and reference "found one, fixed it." The PR comment must state:

1. **Errors / flags found** — every PARTIAL or GAP the audit surfaced, named explicitly (not
   "a divergence").
2. **What was actually changed in THIS push** — the concrete edits (files touched, config fields
   corrected), so the diff is explained in prose.
3. **Why** — the reason each change was made.
4. **Trigger backlink** — a link back to the ClickUp chat message/thread that triggered the push.

The repo PR body and the ClickUp Activity Log thread tell the same story from both ends.

---

## ClickUp breadcrumb (the only ClickUp footprint)

- Header in the dedicated Activity Log:
  `🔍 Self-Audit · <Agent> · <standard> · Overall: <status> · PR #<n>`
- Threaded reply: mirrors the PR substance — errors/flags + what changed + why + links (PR + the
  triggering chat).
- No separate ClickUp docs/tasks/dashboards for audits or fleet status.

---

## Cadence

- Standard bump -> every agent on that track flips to "needs-re-audit"; work back through them.
- New agent     -> superagents.json row + `<slug>/` folder + roster row; audited in its first cycle.
- Ongoing       -> light periodic self-audits folded into normal runs.

---

## Changelog

- 2026-07-21: v0.4. GRADUATED the git-teammate audit DoD (v0.1) into a formal track here, per its
  own graduation note + the Audit Anna migration finding. This file now holds BOTH tracks (native
  live-vs-declared + git-teammate internal-consistency); the two-track table up top routes by agent
  type. `gates/git-teammate-lifecycle-runbook.md` now POINTS here for the DoD instead of holding it
  inline (stops the define-and-hold-procedure smell). Extended the file model + audit-record shape
  to cover git-teammate bundles.
- 2026-07-15: v0.3. Defined `preferences.md` as a near-1:1 verbatim mirror of the live config
  (header + config only; changelog/notes moved to working-notes.md). Added the config-vs-mirror
  drift finding to the procedure.
- 2026-07-15: v0.2. Global metadata consolidated into superagents.json; folder files reduced to
  preferences.md + working-notes.md + audits/ (no hand-mirror). Added mandatory PR-body standard.
- 2026-07-15: v0.1 created; migrated from a ClickUp draft (culled). Repo is the canonical home.
