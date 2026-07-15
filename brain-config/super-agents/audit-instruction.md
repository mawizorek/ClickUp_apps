# Super-Agent Audit Instruction — v0.1

Canonical procedure a ClickUp Super Agent follows when told "audit yourself against your
configuration." This file is the source of truth. Do not mirror it into a ClickUp doc — link
to it. (Migrated from a ClickUp draft 2026-07-15 and culled there; repo is canonical.)

STATUS: v0.1 working draft. Michael annotates directly in this file (inline under `NOTES:`
markers or anywhere). Once blessed, bump the version + changelog.

---

## Purpose

Give every Full-Standard super agent one exact, repeatable procedure to check its LIVE ClickUp
configuration against its DECLARED configuration in the repo and the current GOLDEN-STANDARD
version — and to record the result as a version-controlled audit whose PR history is the
rollback + audit trail.

When an agent is told "audit yourself against your configuration," it knows precisely:
1. Which configuration to check  -> its own declaration file (see "Fleet home" below).
2. Which audit instruction to read -> this file.
3. Where the result goes           -> an audit record committed via PR.

---

## Fleet home (structural decision — CONFIRM)

`brain-config/agents/` already exists but holds the BRAIN-SESSION COUNCIL (Mira, Workshop Wes,
Recon Renata, the reactive lenses/gates; `type: subagent|gate|hook`). Those are NOT the ClickUp
Super Agent fleet.

RECOMMENDATION: keep the ClickUp Super Agent fleet in a dedicated `brain-config/super-agents/`
folder so the two taxonomies never blur:

```
brain-config/super-agents/
  audit-instruction.md          <- this file (the standard)
  <slug>.md                     <- one declaration per Full-Standard super agent
  <slug>.metadata.json          <- structured sidecar (see metadata-schema.md)
  audits/<slug>.<YYYY-MM-DD>.md  <- one audit record per audit
```

NOTES: (confirm `super-agents/` as the home, or redirect. Corey's config currently still says
`brain-config/agents/<slug>.md` — if you confirm super-agents/, that line gets corrected.)

---

## Roles

- Self-audit  — the agent audits itself when told to, or on cadence.
- Steward audit — ClickUp Coach Corey (Fleet Steward) audits any agent as fleet governance.
Both follow this procedure and produce the same record shape.

---

## Procedure (high level)

1. Load the three inputs:
   - LIVE config: the agent's current ClickUp instructions / triggers / tools / knowledge.
   - DECLARED config: its `<slug>.md` + `.metadata.json` in the fleet home.
   - GOLDEN STANDARD: current version + requirements (see checklist below).
2. Confirm the golden-standard version being audited against; record it on the result.
3. Walk the golden-standard checklist item by item, comparing LIVE vs DECLARED.
4. Classify each item: PASS | PARTIAL (works but drifts) | GAP (missing/violates).
5. Record divergences between LIVE config and the repo declaration explicitly — these are the
   actionable items.
6. Write the audit record to `audits/<slug>.<YYYY-MM-DD>.md` using the shape below.
7. Update the human-facing status dashboard (ClickUp Agent Fleet Register) to match.
8. Recommend fixes for the agent's owner/manager to make in ClickUp. NEVER edit another agent's
   live config directly.
9. Commit via PR and merge — the PR is the audit trail (rollback + history).

NOTES: (add / reorder steps; flag anything to gate harder)

---

## Golden-standard checklist (v1.0)

Full-Standard agents are checked against these. Task-Specific / Exempt agents skip this
(inventory-only).

| # | Requirement        | What "pass" looks like                                                    |
|---|--------------------|---------------------------------------------------------------------------|
| 1 | Identity block     | Name, creator attribution, model/vendor-silent rule present.              |
| 2 | Load-then-think    | Reads Activity Log + shared cross-agent channel (+ refs) before acting.   |
| 3 | Roster pointer     | Cross-Agent Roster held as a pointer, not hardcoded lanes.                |
| 4 | Two-tier channels  | Dedicated Activity Log + shared channel, wired and used.                  |
| 5 | Guardrails         | Post-only-where-triggered; propose-and-wait; never-delete; flag-unverified.|
| 6 | Memory-over-thread | Durable changes persisted to instructions/memory, not just in-thread.     |
| 7 | Copy-block fences  | Copy-pasteable prompt/code/config wrapped in ```markdown fences.          |
| 8 | Declaration in sync| Repo declaration exists and matches live config; version recorded.        |

NOTES: (add/remove requirements; the version number tracks this list)

---

## Audit record shape

```
<slug>: Self-Audit — <YYYY-MM-DD>
Agent: <Display Name> (<slug>)
Auditor: <self | Fleet Steward>
Golden standard: v<X.Y>
Overall: <Up to date | Partial | Behind>

Checklist results:
1. Identity block ....... PASS
2. Load-then-think ...... PASS
...  (per item; one-line note on any PARTIAL/GAP)

Divergences (live vs declaration):
- <none | specific gap + recommended fix + who fixes it>

Actions recommended:
- <concrete config edit for owner/manager>
```

NOTES: (tighten the record shape)

---

## Cadence

- Standard bump -> every Full-Standard agent flips to "Needs re-audit"; work back through them.
- New agent     -> declaration + roster row + register row created; audited in its first cycle.
- Ongoing       -> light periodic self-audits folded into normal runs.

---

## PR / audit-trail mechanics

- Every declaration change and audit record lands via a PR the steward opens and merges — the PR
  history is the rollback + audit trail.
- Honor `brain-config/session-board.md` claim protocol and the commit-message convention before
  writing.
- One agent at a time; declarations and audits are additive and diffable.

NOTES: (commit style: straight-merge vs review-first? author under `maw-agents` bot? your call)

---

## Changelog

- 2026-07-15: v0.1 created. Migrated from a throwaway ClickUp draft (culled there, flagged for
  Michael to delete). Repo is now the single canonical home.
