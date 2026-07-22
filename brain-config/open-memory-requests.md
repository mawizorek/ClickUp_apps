# Open Memory Requests

_Public queue for memory-write candidates that an agent cannot or should not land itself. **Empty by default.** Maggie processes it on "run your thing on the open memory requests" and clears processed entries. Protocol: `brain-config/agents/memory-maggie/open-memory-request-protocol.md`._

**Two doors:**
- **DROP (any agent, mid-session):** "add that to the open memory log" → the current agent appends ONE entry below. That's it.
- **DRAIN (fresh session):** "open as Memory Maggie" → "run your thing on the open memory requests" → Maggie triages + places the whole batch, then clears it.

**How to use (any agent, Door 1):** append ONE entry under Open. Do not place it yourself, do not touch `/PREFERENCES.md`. Maggie decides where it lands.

**Placement is NOT yours to assume:** "preference" earns nothing. Deny-by-default for brain memory. Your suggested destination is a hint only. Most requests land in `brain-config/` (hooks / gates / agent profiles) or the Brain Reference Library, not in brain memory.

**Neighbors, don't mix:** this = memory-write candidates · `open-thread.md` = durable pending work · `session-board.md` = live presence.

---

## Open

### OMR-20260717-1 · OPEN
- Requested by: Brain (Opus 4.8)
- Candidate note: Auto-open an Agent Activity Board session task WITHOUT asking whenever project work begins (any time a project conversation starts). Opening the task is a standing default, not a permission gate. Established by Michael 2026-07-17.
- Requester's guess (non-binding): brain memory (update the existing Agent Activity Board pointer line rather than adding a new bullet, to avoid file growth); the fuller rule already lives in the Agent Activity Board Gold Standard startup gate.
- Context / why: memory write bounced this session (no memory manager available); Michael directed dropping it here for a later agent to land. Pairs with the session-close fix also made 2026-07-17.

### OMR-20260717-2 · OPEN
- Requested by: Brain (Opus 4.8)
- Candidate note: NEVER touch Michael's real/external calendar (Google Calendar, etc). All scheduling is done as ClickUp tasks with start/due times that render in the ClickUp calendar. Multi-day or multi-event schedules are built as subtask events nested under the parent/anchor task. Established by Michael 2026-07-17.
- Requester's guess (non-binding): brain memory (Workflow Defaults) — must-fire behavioral default; possibly also a brain-config gate to hard-block external-calendar tools.
- Context / why: memory write bounced this session (no memory manager available). Rule set while building the City of Angels changeover schedule as ClickUp subtask events under the changeover task.

### OMR-20260721-1 · OPEN
- Requested by: Brain (Opus 4.8)
- Candidate note: TERMINOLOGY DEFAULT — when Michael says "super agent" (unqualified) he means a GIT-TEAMMATE (the `/session.agent=<Name>` kind under `brain-config/super-agents/`). He will say "ClickUp super agent" or "cu agent" ONLY when he means a NATIVE ClickUp Super Agent. Parse every agent build/convert/invoke request through this default; do not assume the native surface unless he uses the qualified term. Established by Michael 2026-07-21.
- Requester's guess (non-binding): brain memory (must-fire interpretation rule affecting how every agent request is parsed) — but deny-by-default; could instead live as a one-line terminology note in `gates/agent-invocation-gate.md` or a fleet-terminology pointer.
- Context / why: clarified mid-session while converting Maestro Mira to a git-teammate ("i meant git super agent…. ill always say clickup super agent or cu agen if i actually mean that").

### OMR-20260722-1 · OPEN
- Requested by: Brain (Opus 4.8)
- Candidate note: MEMORY-WRITE ROUTING (global) — Brain NEVER performs memory writes directly. Any memory-write candidate is dropped as an entry in this file (`brain-config/open-memory-requests.md`) for another agent (Maggie) to land, OR written to Brain's personal super-agent memory only when actually embodied as that super agent. In a normal (non-embodied) session Brain has no memory-write authority at all — this queue is the only path. Do not attempt `/PREFERENCES.md` writes. Established by Michael 2026-07-22.
- Requester's guess (non-binding): gate — belongs as a hard behavioral rule (e.g. `gates/` or the memory-request protocol) rather than brain memory; it governs the memory-write mechanism itself.
- Context / why: Michael corrected Brain after it twice attempted a direct `/PREFERENCES.md` write this session (both bounced). Global standing note on how memory requests are routed; self-referential (this very drop is the correct behavior).

---

## Entry template

```
### OMR-<YYYYMMDD>-<n> · OPEN
- Requested by: <agent>
- Candidate note: <self-contained, standalone-readable; must make sense with zero session history>
- Requester's guess (non-binding): <hook | gate | agent profile | reference doc | brain memory | unsure>
- Context / why: <one line>
```
