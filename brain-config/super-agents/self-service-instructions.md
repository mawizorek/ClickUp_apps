# Agent Self-Service Runbook — Declare & Self-Audit

The repeatable instructions any ClickUp Super Agent follows to (1) mirror its own live config into
the repo, and (2) audit itself against the golden standard. Michael pastes the relevant block into a
group thread and tags the agent to execute it. Canonical companion: `audit-instruction.md` (the
standard being checked against). Fleet data: `superagents.json`.

Two runbooks below. Michael picks which to paste depending on what he wants from the agent:
- **Runbook A — Self-Declare** (agent writes/refreshes its own `preferences.md` verbatim mirror).
- **Runbook B — Self-Audit** (agent checks its config against the golden standard and records it).

They chain: an agent can run A then B in one pass, or A alone (then the Fleet Steward audits its
work later), or B alone (when its mirror is already current).

<hr/>

## Ground rules for every self-service run

- **The agent acts on ITS OWN config only.** No agent writes another agent's `preferences.md` — only
  the owning agent (or Michael pasting canonical text) can produce a true verbatim mirror.
- **Repo is canonical; run in ClickUp.** All declaration/audit writes land in the repo via PR; the
  PR history is the audit trail. Nothing about the agent's execution moves to the repo.
- **Read `team-standard.md` + the session board before writing.** Honor the commit convention; use a
  PR for the change; never commit unapproved to `main`.
- **`preferences.md` = verbatim config only.** A 1–2 line header (`This is the agent config for
  <name>, updated <timestamp>`) then the live config top to bottom, nothing else. No changelog, no
  summary, no commentary. Changelog/notes go in `working-notes.md`.
- **Metadata lives only in `superagents.json`.** Never restate lane/track/version/channels/triggers
  in folder files.

<hr/>

## Runbook A — Self-Declare (refresh your own config mirror)

**Michael pastes this and tags the agent.**

````markdown
SELF-DECLARE — <@Agent>, mirror your live configuration into the repo.

1. Confirm identity: state your slug and confirm your folder is
   brain-config/super-agents/<slug>/ (if it doesn't exist yet, say so — the Fleet Steward
   will scaffold it first).
2. Produce a NEAR-1:1 VERBATIM copy of your CURRENT live configuration (instructions/role/
   scope/tools/triggers/knowledge/preferences), reproduced top to bottom.
3. Write it to brain-config/super-agents/<slug>/preferences.md with ONLY a 1–2 line header:
   "This is the agent config for <Display Name> (slug: <slug>). Updated <YYYY-MM-DD>."
   then the config verbatim. No changelog, no summary, no extra commentary in this file.
4. STEP-1 ACCURACY CHECK (do this explicitly): confirm the written config you just produced is
   accurate to your ACTUAL live setup. Note any spot where your live config differs from what you
   wrote, and correct the file so it matches reality. Report the result of this check.
5. Open a PR titled "Self-declare: <Display Name> config mirror <YYYY-MM-DD>". In the PR body state:
   what you wrote, that the accuracy check passed (or what you corrected), and a backlink to THIS
   chat thread. Merge it (or leave it open if Michael wants to review first — ask).
6. Put any notes/history in brain-config/super-agents/<slug>/working-notes.md, NOT in preferences.md.
7. Post a short confirmation here with the PR link. Do NOT run the golden-standard audit unless
   also asked (that's Runbook B).
````

<hr/>

## Runbook B — Self-Audit (check your config against the golden standard)

**Michael pastes this and tags the agent.** Assumes `preferences.md` is current (run Runbook A first
if not).

````markdown
SELF-AUDIT — <@Agent>, audit your configuration against the golden standard.

Read brain-config/super-agents/audit-instruction.md first, then:

STEP 1 — Is your written config accurate to your actual setup?
- Compare brain-config/super-agents/<slug>/preferences.md against your ACTUAL live configuration.
- If they differ, your mirror is stale: refresh it (Runbook A) BEFORE auditing, or note each drift
  explicitly. An audit against a stale mirror is invalid.

STEP 2 — Does that configuration align with the golden standard?
- Check your live config against each golden-standard v<X.Y> requirement (from audit-instruction.md):
  1 Identity block · 2 Load-then-think · 3 Roster pointer · 4 Two-tier channels · 5 Guardrails
  · 6 Memory-over-thread · 7 Copy-block markdown fences · 8 Declaration in sync.
- Mark each PASS / PARTIAL / GAP with a one-line note on any PARTIAL or GAP.

STEP 3 — Record it.
- Write brain-config/super-agents/<slug>/audits/<slug>.<YYYY-MM-DD>.md in the audit-record shape.
- Update your row in brain-config/super-agents/superagents.json (status, golden_standard_version,
  last_audit).
- Recommend the specific config edits your owner/manager should make in ClickUp for any PARTIAL/GAP
  (you cannot self-edit your ClickUp profile; the Fleet Steward/Michael applies config changes).

STEP 4 — PR + breadcrumb.
- One PR titled "Self-audit: <Display Name> vs golden-standard v<X.Y>". PR body states: errors/flags
  found (each PARTIAL/GAP named), what you changed in the push, why, and a backlink to THIS thread.
- Post ONE header line in your Activity Log: "🔍 Self-Audit · <Agent> · golden-standard v<X.Y> ·
  Overall: <status> · PR #<n>" + a threaded reply mirroring the PR substance and linking PR + this
  thread. No other ClickUp docs/tasks.
- Post a short confirmation here with the PR link.
````

<hr/>

## Who does what (division of labor)

- **Agent input, Steward audits:** Michael tags the agent to run Runbook A (declare its own config);
  later he comes back to the Fleet Steward (ClickUp Coach Corey) to audit that agent's work
  against the standard (Runbook B run by the Steward on that agent's declaration).
- **Agent self-audits:** Michael tags the agent to run Runbook A + B itself in one pass.
- Either way: STEP 1 (is the written config accurate to the real setup?) comes before STEP 2 (does
  it meet the standard?). Never audit against a stale mirror.

<hr/>

## Changelog

- 2026-07-15: created. Repeatable self-declare + self-audit runbooks agents execute when tagged in a
  group thread. Encodes Michael's two-step rule: confirm the written config matches reality, then
  verify against the golden standard.
