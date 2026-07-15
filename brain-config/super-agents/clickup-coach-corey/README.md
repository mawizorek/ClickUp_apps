# ClickUp Coach Corey — Agent Declaration

> **Steward-controlled canonical metadata** for this ClickUp Super Agent. The README carries the
> uniform, steward-owned metadata block (same shape across every agent folder). The agent's own
> mutable layer lives beside it at `preferences.md`. The **folder** (`clickup-coach-corey/`) is
> the unit of identity; **filenames are uniform** across every agent folder, so "audit yourself
> against your configuration" always resolves to the same two files + `audits/`.
>
> Canonical in Git. Do NOT mirror this into a parallel ClickUp doc — reference it.

---

## Identity

| Field | Value |
|-------|-------|
| `slug` | `clickup-coach-corey` |
| `display_name` | ClickUp Coach Corey |
| `clickup_user_id` | -39958913 |
| `profile` | https://app.clickup.com/36074068/ai/agents/12cwjm-53993 |
| `creator` | Michael Wizorek |
| `model/vendor` | silent (never disclosed) |

## Classification

| Field | Value |
|-------|-------|
| `track` | **Full-Standard** |
| `golden_standard_version` | **v1.0** |
| `status` | active |
| `seat` | Fleet Steward + URITP structure/standards |

**Lane (see Cross-Agent Roster — pointer, not copy):** URITP workspace structure, singularity /
cleanup auditing, standards & agent-creation coaching, and **Agent Fleet Steward** (tracks every
super agent + audits each against the golden standard).

## Triggers

@mention · DM · task assignment · schedule.

## Channels (two-tier)

- **Dedicated Activity Log:** https://app.clickup.com/36074068/chat/r/12cwjm-56673
- **Shared cross-agent:** https://app.clickup.com/36074068/chat/r/12cwjm-56653

## Governance references (pointers, never copies)

- **Cross-Agent Roster:** https://app.clickup.com/36074068/docs/12cwjm-54133/12cwjm-74813
- **Audit instruction:** `brain-config/super-agents/audit-instruction.md`
- **Golden standard:** Creation & Setup Checklist (`…/12cwjm-74773`) + Golden Config Skeleton (`…/12cwjm-74793`)
- **Fleet Register (human dashboard):** https://app.clickup.com/36074068/docs/12cwjm-54133/12cwjm-74853
- **Team operating standard (repo floor):** `brain-config/team-standard.md`

## Audit trail

Dated audit records live in `clickup-coach-corey/audits/<slug>.<YYYY-MM-DD>.md`, one per audit,
following the record shape in `audit-instruction.md`. Each lands via its own PR (PR history =
rollback + audit trail).

## Changelog

- 2026-07-15: folder + declaration created via PR. Folder-per-agent pattern established for the
  super-agent fleet (distinct from `brain-config/agents/`, which is the Brain-session council).
