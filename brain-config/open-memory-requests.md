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

### OMR-20260727-1 · OPEN
- Requested by: Maestro Mira (queued by Memory Maggie at close)
- Candidate note: When Michael lacks a mechanism for a decision, he answers with a CONSTRAINT rather than a pick — e.g. "want to keep it single source but not sure how," or leaving every box unchecked and writing a better question in the note. That is a decisive ruling, not a non-answer: treat the constraint as binding and go solve the mechanism.
- Requester's guess (non-binding): agent profile — `super-agents/maestro-mira/memory.md`
- Context / why: durable across every future orchestration turn, but it is relational reading-Michael context rather than must-fire-every-response behavior, so it fails the brain-memory test. Distinct from the already-locked Gold Standard rule 4 clause, which covers the mechanical checkbox reading; this is the broader behavioral pattern behind it.

### OMR-20260727-2 · OPEN
- Requested by: Maestro Mira (queued by Memory Maggie at close)
- Candidate note: Seating Counter Cole as designated opposition on a room that has already converged produces the session's strongest correction. On 2026-07-27 he caught that the Workshop kept its recommendation after the premise it rested on had been disproven by measurement.
- Requester's guess (non-binding): agent profile — `super-agents/maestro-mira/memory.md`
- Context / why: NOT procedure — `orchestration.md` step 8 already permits pulling extra voices, so nothing new needs authoring. What is durable is the evidence that it worked, which is exactly the kind of conducting precedent a bundle exists to hold.

---

## Entry template

```
### OMR-<YYYYMMDD>-<n> · OPEN
- Requested by: <agent>
- Candidate note: <self-contained, standalone-readable; must make sense with zero session history>
- Requester's guess (non-binding): <hook | gate | agent profile | reference doc | brain memory | unsure>
- Context / why: <one line>
```
