# Gates

Workflow gates are lightweight decision points that fire WITHIN another process (e.g., during the roster scan). They're not hooks (no independent trigger-table signal) and not agents (no autonomous work loop). They're the connective tissue.

⚠️ **This README is a PARTIAL index and has been for a while** (flagged 2026-08-06: it named 3 gates while the folder held 20). **The directory listing is the authoritative list of gates, not this file.** Do not conclude a gate doesn't exist because it isn't named here. Entries below are the ones someone bothered to annotate.

Annotated gates:
- **repo-referent-gate.md** — 🔒 HARD GATE, fires before the FIRST GitHub call of any kind, read or write. "The repo" is never resolvable from memory: state `owner/repo@branch` out loud, derived from the session subject, or ask. Catches the class both sweeps miss — a TRUE fact bound to the WRONG referent. Visibility (public/private) is per-repo and never cached across repos. Born 2026-08-06 from a near-miss where the bootstrap coordinate silently substituted for `uritp-docs`.
- **agent-invocation-gate.md** — Disambiguates agent names from real-person mentions. Fires during 🧠 subagent evaluation.
- **inbox-triage-trigger.md** — Any agent assigned to a task in URITP ▸ INBOX ▸ Default runs the inbox interrogation. Routing only; the procedure lives solely in the ClickUp triage doc. Agent-agnostic (decoupled from Milo).
- **session-transcript-gate.md** — Decides WHEN Scribe Sana opens the live, chronological, speaker-labeled session log. Evaluated at session start; fires on the first real decision, or by the 3rd message during build/work. Holds on lookups. Once fired, Scribe appends the transcript in real time and finalizes it into the same Session Log thread at close.
