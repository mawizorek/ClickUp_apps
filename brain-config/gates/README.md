# Gates

Workflow gates are lightweight decision points that fire WITHIN another process (e.g., during the roster scan). They're not hooks (no independent trigger-table signal) and not agents (no autonomous work loop). They're the connective tissue.

Current gates:
- **agent-invocation-gate.md** — Disambiguates agent names from real-person mentions. Fires during 🧠 subagent evaluation.
- **inbox-triage-trigger.md** — Any agent assigned to a task in URITP ▸ INBOX ▸ Default runs the inbox interrogation. Routing only; the procedure lives solely in the ClickUp triage doc. Agent-agnostic (decoupled from Milo).
