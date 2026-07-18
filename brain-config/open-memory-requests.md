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

---

## Entry template

```
### OMR-<YYYYMMDD>-<n> · OPEN
- Requested by: <agent>
- Candidate note: <self-contained, standalone-readable; must make sense with zero session history>
- Requester's guess (non-binding): <hook | gate | agent profile | reference doc | brain memory | unsure>
- Context / why: <one line>
```
