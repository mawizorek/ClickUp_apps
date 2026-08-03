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

- ~~This is a PLACEHOLDER hook.~~ **No longer placeholder-only as of 2026-08-03** — the comment-mode slot now carries a real branch (see below). This file stays the DETECTOR; procedure lives in the hooks it hands off to (procedure-is-a-tool).
- Detection reliability: high. The structural difference (task metadata present/absent) is consistent and injected by the platform, not user-controlled.
- Edge case: if Brain is invoked from a Doc comment or Chat channel message (not a task), the context shape may differ from both modes. TBD — observe and document. ⚠️ `hooks/task-context-orientation.md` explicitly does NOT claim these shapes; it only claims task context.

---

## Extensions

```
# COMMENT-MODE OVERRIDES
# → hooks/task-context-orientation.md  (ALWAYS-ON, 2026-08-03)
#   Orient BEFORE parsing the prompt: containment path (task→list→folder→space)
#   → list documentation ladder (List Index Purpose field first)
#   → task recency classifier (WARM / COLD / COLD-START)
#   → one-line 🧭 stamp, then answer.
#   Detection stays here; the procedure lives there. Do not copy it back.

# CHAT-MODE OVERRIDES
# (none yet)
```

---

## Changelog

- **2026-08-02 — Created.** Placeholder hook. Detection + emit only, no behavioral branching yet.
- **2026-08-03 — First real branch wired.** COMMENT-MODE OVERRIDES now points at `hooks/task-context-orientation.md`. Michael's diagnosis: a comment-mode session receives more context than a chat session and still answers worse, because it reads the task card and never places it. Detection was never the gap; what to DO on detection was.
