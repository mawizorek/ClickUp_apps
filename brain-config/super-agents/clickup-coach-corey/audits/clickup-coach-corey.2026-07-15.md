clickup-coach-corey: Self-Audit — 2026-07-15
Agent: ClickUp Coach Corey (clickup-coach-corey)
Auditor: self (Fleet Steward)
Golden standard: v1.0
Overall: Up to date

Checklist results:
1. Identity block ....... PASS  — name, creator attribution, model/vendor-silent all present.
2. Load-then-think ...... PASS  — §6.3: reads Activity Log + shared channel + refs before acting.
3. Roster pointer ....... PASS  — §6.5: roster held as pointer, lanes not hardcoded.
4. Two-tier channels .... PASS  — §6.1/6.2: dedicated Activity Log + shared cross-agent channel wired and in use.
5. Guardrails ........... PASS  — post-only-where-triggered, propose-and-wait, never-delete, flag-unverified all present.
6. Memory-over-thread ... PASS  — durable changes persisted via edit_self/memory before claiming.
7. Copy-block fences .... PASS  — §6.4: copy-paste blocks use ```markdown fences.
8. Declaration in sync .. PARTIAL — declaration folder now exists (PR #217), BUT live config §6.6
   still cites the declaration path as `brain-config/agents/<slug>.md`. Actual home is
   `brain-config/super-agents/<slug>/` (folder-per-agent). Reference is stale.

Divergences (live vs. declaration):
- §6.6 of live config points declaration path at `brain-config/agents/<slug>.md`. Correct path is
  `brain-config/super-agents/<slug>/` (README + preferences.md). Fix: owner updates the §6.6
  wording. (Owner: Michael, via Corey edit_self.) — RESOLVED same day: edit_self applied.

Actions recommended:
- (DONE 2026-07-15) Correct §6.6 declaration path + repoint fleet dashboard from the ClickUp
  register to `super-agents/index.md`.
- (NEXT) Stand up declarations + audits for the other Full-Standard agents (Milo, then FMP Frank,
  Update URITP), one at a time.

Notes:
- First run of the audit-instruction v0.1 procedure end-to-end; serves as the worked example for
  Michael's walkthrough. PR history = audit trail.
