# Invocation Context Detection

**Type:** Passive detection hook, fires every session/invocation.
**Trigger:** Every reply (first reply in chat; every invocation from task comments).
**Created:** 2026-08-02 (Michael directive: detect comment vs. chat invocation, emit header line).

---

## Detection Logic

The trigger is structural, not string-based:

- **Task comment invocation:** The prompt includes task metadata (task ID, task context, comment thread). The `@Brain` mention is consumed as the trigger mechanism and not visible as literal text.
- **Standalone chat invocation:** The prompt contains only `<user-query>` with no surrounding task object or comment thread context.

**Rule:** If task context is present → comment mode. If absent → chat mode.

---

## Behavior

Emit exactly one of the following as the FIRST line of the reply (before any other content):

- **Comment mode:** `📌 replying to comment`
- **Chat mode:** `💬 replying to new chat`

### Frequency

- **In standalone chat:** emit ONCE, on the first reply of the session only.
- **In task comments:** emit on EVERY reply (each `@Brain` is a discrete invocation with no continuity).

---

## Notes

- This is a PLACEHOLDER hook. Behavioral branching (different autonomy levels, different formatting, different tool gates) can be layered on top by adding conditional blocks below.
- Detection reliability: high. The structural difference (task metadata present/absent) is consistent and injected by the platform, not user-controlled.
- Edge case: if Brain is invoked from a Doc comment or Chat channel message (not a task), the context shape may differ from both modes. TBD — observe and document.

---

## Future Extensions (placeholder slots)

```
# COMMENT-MODE OVERRIDES
# (none yet)

# CHAT-MODE OVERRIDES
# (none yet)
```

---

## Changelog

- **2026-08-02 — Created.** Placeholder hook. Detection + emit only, no behavioral branching yet.
