# Agent Activity Push · AI Toolkit

**Purpose:** Every agent-headed reply in a comment thread triggers an immediate push to that agent's `activity-log.md` in git, so no session knowledge is lost between invocations.

**Steward:** Dev Dexter (build/engineering lane; the push is a repo write).

**Mode:** Always-on (deterministic, fires per agent-headed reply).

**Invocation:** Automatic. No slash command needed.

**Trigger:** Brain posts a reply headed by an agent persona (any `═══ NAME · TAGLINE ═══` banner or equivalent agent header). One push per agent per reply.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-08-02** by Dev Dexter + Michael Wizorek.

---

## Coordinates

| Surface | Location |
| --- | --- |
| **Activity logs** | `brain-config/super-agents/<slug>/activity-log.md` |
| **Shared base** | `brain-config/super-agents/_shared/super-agent-base.md` |

---

## Procedure

1. **Detect:** The reply contains an agent persona header (the agent is "speaking").
2. **Identify:** Resolve the agent's slug from the header name (via the Agent Index or known mapping).
3. **Compose entry:** One timestamped line (or short block) summarizing what the agent said/did this reply. Format:
   ```
   ### YYYY-MM-DD HH:MM ET
   **Context:** <task/channel URL or "DM">
   **Action:** <1-2 sentence summary of what this agent contributed>
   ```
4. **Push:** Append the entry to `brain-config/super-agents/<slug>/activity-log.md` via git commit. Commit message: `activity: <slug> · <one-clause summary>`.
5. **Non-blocking:** If the push fails (SHA conflict, network), do NOT block the reply. Mark `⚠️ activity push failed for <name>` internally and backfill on the next successful write.

---

## Guardrails

- **Per-reply, not batched.** Each agent-headed reply gets its own push. Do not defer to session close.
- **One entry per agent per reply.** If multiple agents speak in the same reply (multi-voice), each gets their own push.
- **Lenses do NOT have activity logs.** Only git-teammates (agents with a `super-agents/<slug>/` bundle) get pushes. If a lens speaks, skip.
- **Content, not transcript.** The entry summarizes what happened, not a verbatim copy of the reply. Keep entries to 2-3 lines max.
- **Never blocks the reply.** The push is fire-and-forget relative to the user-facing response. Failures backfill.
- **Stale SHA:** Always fetch the current file SHA before writing. The activity log is append-only, so conflicts are rare but possible in rapid-fire sessions.

---

## Composes with

- **Session Transcript Gate** (`gates/session-transcript-gate.md`): The spine line and the activity push are SEPARATE writes. The spine goes to the Agent Activity Board channel; the activity push goes to the agent's own log. Both fire on the same reply, independently.
- **Session Close** (`hooks/session-close.md`): Session close no longer needs to batch-commit agent learnings. This hook handles it per-reply.
- **New Agent Onboard** (`hooks/new-agent-onboard.md`): Should reference this hook so new agents know their activity log will be maintained automatically.

---

## Changelog

- **v1 (2026-08-02)** — Established by Dev Dexter + Michael. Born from the Paige onboarding incident: an entire onboarding session's worth of knowledge was never committed to git because no per-reply push existed. The session-close hook alone was insufficient (it never fired, and even if it had, the agent loaded stale on her next invocation).
