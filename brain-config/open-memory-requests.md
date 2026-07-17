# Open Memory Requests

_Public queue for memory-write candidates that an agent cannot or should not land itself. **Empty by default.** Maggie processes it on "run your thing on the open memory requests" and clears processed entries. Protocol: `brain-config/agents/memory-maggie/open-memory-request-protocol.md`._

**How to use (any agent):** append ONE entry under Open. Do not place it yourself, do not touch `/PREFERENCES.md`. Maggie decides where it lands.

**Placement is NOT yours to assume:** "preference" earns nothing. Deny-by-default for brain memory. Your suggested destination is a hint only. Most requests land in `brain-config/` (hooks / gates / agent profiles) or the Brain Reference Library, not in brain memory.

**Neighbors, don't mix:** this = memory-write candidates · `open-thread.md` = durable pending work · `session-board.md` = live presence.

---

## Open

_None._

---

## Entry template

```
### OMR-<YYYYMMDD>-<n> · OPEN
- Requested by: <agent>
- Candidate note: <self-contained, standalone-readable; must make sense with zero session history>
- Requester's guess (non-binding): <hook | gate | agent profile | reference doc | brain memory | unsure>
- Context / why: <one line>
```
