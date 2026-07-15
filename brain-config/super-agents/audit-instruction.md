# Super-Agent Audit Instruction — v0.2

Canonical procedure a ClickUp Super Agent follows when told "audit yourself against your
configuration." This file is the source of truth. Do not mirror it into a ClickUp doc — link to it.

STATUS: v0.2 working draft. Michael annotates directly in this file. Bump version + changelog when
blessed.

---

## Purpose

Give every Full-Standard super agent one exact, repeatable procedure to check its LIVE ClickUp
configuration against its DECLARED configuration in the repo and the current GOLDEN-STANDARD
version — and to record the result as a version-controlled audit whose PR history is the rollback +
audit trail.

When an agent is told "audit yourself against your configuration," it knows precisely:
1. Which configuration to check  -> its own folder `brain-config/super-agents/<slug>/`.
2. Which audit instruction to read -> this file.
3. Where the result goes           -> an audit record committed via PR.

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
    preferences.md     # the agent's own config self-mirror (behavioral "how I should be configured")
    working-notes.md   # next spec / working notes / per-agent revision log
    audits/<slug>.<YYYY-MM-DD>.md  # dated audit records, one per audit, via PR
```

RULE: any structured metadata fact lives ONLY in `superagents.json`. Folder files never restate it.
Distinct from `brain-config/agents/` (the Brain-session council).

---

## Procedure (high level)

1. Load the three inputs:
   - LIVE config: the agent's current ClickUp instructions / triggers / tools / knowledge.
   - DECLARED config: its `superagents.json` entry + `<slug>/preferences.md`.
   - GOLDEN STANDARD: current version + requirements (see checklist).
2. Confirm the golden-standard version being audited against; record it on the result.
3. Walk the golden-standard checklist item by item, comparing LIVE vs DECLARED.
4. Classify each item: PASS | PARTIAL (works but drifts) | GAP (missing/violates).
5. Record divergences between LIVE config and the declaration explicitly — these are actionable.
6. Write the audit record to `<slug>/audits/<slug>.<YYYY-MM-DD>.md` using the shape below.
7. Update the agent's row in `superagents.json` (status, version, last_audit).
8. Recommend fixes for the agent's owner/manager. NEVER edit another agent's live config directly.
9. Commit via PR and merge — the PR is the audit trail. See PR-body standard below.

---

## Golden-standard checklist (v1.0)

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
| 8 | Declaration in sync| superagents.json entry + preferences.md match live config; version recorded.|

---

## Audit record shape (`audits/<slug>.<date>.md`)

```
<slug>: Self-Audit — <YYYY-MM-DD>
Agent: <Display Name> (<slug>)
Auditor: <self | Fleet Steward>
Golden standard: v<X.Y>
Overall: <Up to date | Partial | Behind>

Checklist results:
1. Identity block ....... PASS
...  (per item; one-line note on any PARTIAL/GAP)

Divergences (live vs declaration):
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
4. **Trigger backlink** — a link back to the ClickUp chat message/thread that triggered the push
   (the DM or comment), so the repo trail connects to the ClickUp conversation.

The ClickUp side stays minimal: the Activity Log header + threaded reply (below) mirror the same
substance and link to the PR. Repo PR body and ClickUp thread should tell the same story from both
ends.

---

## ClickUp breadcrumb (the only ClickUp footprint)

- Header in the dedicated Activity Log:
  `🔍 Self-Audit · <Agent> · golden-standard v<X.Y> · Overall: <status> · PR #<n>`
- Threaded reply: full checklist + errors/flags + what changed + why + links (PR + triggering chat).
- No separate ClickUp docs/tasks/dashboards for audits or fleet status.

---

## Cadence

- Standard bump -> every Full-Standard agent flips to "needs-re-audit"; work back through them.
- New agent     -> superagents.json row + `<slug>/` folder + roster row; audited in its first cycle.
- Ongoing       -> light periodic self-audits folded into normal runs.

---

## Changelog

- 2026-07-15: v0.2. Global metadata consolidated into superagents.json; folder files reduced to
  preferences.md + working-notes.md + audits/ (no hand-mirror). Added mandatory PR-body standard
  (errors/flags + what changed + why + trigger backlink) per Michael.
- 2026-07-15: v0.1 created; migrated from a ClickUp draft (culled). Repo is the canonical home.
