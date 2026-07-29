# Open Memory Requests

_Public queue for memory-write candidates that an agent cannot or should not land itself. **Empty by default.** Maggie processes it on "run your thing on the open memory requests" and clears processed entries. Protocol: `brain-config/agents/memory-maggie/open-memory-request-protocol.md`._

**Two doors:**
- **DROP (any agent, mid-session):** "add that to the open memory log" → the current agent appends ONE entry below. That's it.
- **DRAIN (fresh session):** "open as Memory Maggie" → "run your thing on the open memory requests" → Maggie triages + places the whole batch, then clears it.

**How to use (any agent, Door 1):** append ONE entry under Open. Do not place it yourself, do not touch `/PREFERENCES.md`. Maggie decides where it lands.

**Placement is NOT yours to assume:** "preference" earns nothing. Deny-by-default for brain memory. Your suggested destination is a hint only. Most requests land in `brain-config/` (hooks / gates / agent profiles) or the Brain Reference Library, not in brain memory.

**Neighbors, don't mix:** this = memory-write candidates · `open-thread.md` = durable pending work · `session-board.md` = live presence.

> 🚨 **QUEUE STATE 2026-07-28 (evening): 7 open.** `/PREFERENCES.md` sits at ~99% (~6 tokens free). `OMR-20260728-1` remains the first candidate in weeks to genuinely clear the brain-memory bar and it **cannot land because there is no room**. **A memory file at 99% does not fail loudly — it fails by silently rejecting the next thing that deserved to be there.** Fourth consecutive close reporting this. The drain is no longer housekeeping; it is blocking a qualified write.
>
> ⚠️ **Note the NEW shape in entries -2 through -4 below: three candidates that Maggie APPROVED for placement and still could not place** — one because a twin session holds the pen on the file, two because the target bundle is at its size cap. **That is a different blocker from the capacity one above, and it is the more interesting one:** placement is no longer the bottleneck, bundle STATE is. If this recurs, the fix is a write-time size check (already proposed, unruled) rather than more queue.

---

## Open

### OMR-20260728-4 · OPEN · 🟡 APPROVED, BLOCKED ON BUNDLE CAP
- Requested by: Closing Clio (triaged by Memory Maggie at the Jul 28 evening close)
- Candidate note: **Michael-pattern, THIRD confirmation — a zero-strike Decision Log answer plus a governing note means the question was asked at the WRONG LAYER, not that he is deferring.** 2026-07-28, Q11 (store vs derive round-level `pole`/`fastestLap`): no boxes struck, note read *"i can kinda of believe any of these. but what's easiest to update. what's safest and most consistent? what's the right way to do it. i'm pretty apathetic cos ill just ask for what i want to see."* He was asking for the engineering call, not a preference. **Before writing a Q block: does this have a right answer I could work out? If yes, make the call, show the reasoning, make it cheap to reverse.**
- Requester's guess (non-binding): agent profile — `super-agents/closing-clio/memory.md`, Michael-patterns (bumps her count 2 → 3)
- Context / why: **Approved for placement, not placed.** Clio's `memory.md` is at **10,310 B against a ~10KB hot cap** and would go over with this plus OMR-20260728-3. Rotating her file while she is mid-close is the collision shape we keep scoring. **Rotate her 07-26 entries to `memory/archive/` first, then place both.**

### OMR-20260728-3 · OPEN · 🟡 APPROVED, BLOCKED ON BUNDLE CAP
- Requested by: Closing Clio (triaged by Memory Maggie at the Jul 28 evening close)
- Candidate note: **Capacity curve, second real data point.** Claude Opus 5, 2026-07-28, ~11 hours wall clock, 5 substantive beats, ~50 tool calls, 12 voices seated (Frank + 7 Workshop + 2 supplements + 2 primaries), 6 PRs merged. **Closing capacity: sharp — no degradation.** Recall held to the end: findings from the first hour (the `fastLap` completion, the sprint blocks) were cited correctly at close eleven hours later. Consistent with the 07-26 data point.
- Requester's guess (non-binding): agent profile — `super-agents/closing-clio/memory.md`, capacity curve
- Context / why: same cap blocker as OMR-20260728-4. Place both in the same pass after rotation.

### OMR-20260728-2 · OPEN · 🟡 APPROVED, BLOCKED ON A LIVE TWIN
- Requested by: Maestro Mira for Workhorse Wes (triaged by Memory Maggie at the Jul 28 evening close)
- Candidate note: **New trend-ledger entry for Wes.** `a plan's first queued step is a job that is already done · seen: 1 · last: 2026-07-28 · mitigation: verify step 1's premise against HEAD before letting a session execute it.` On 2026-07-28 the parked F1 handoff opened with *"Step 1 is the fastLap r1-8 backfill"* — **complete since 07-23**, and the doc that queued it described the OLD field shape, so a compliant agent would have overwritten `{time,lap}` objects with bare strings. **A handoff's first move is the least-questioned instruction in a session; it inherits all the authority of the handoff and none of the verification.**
- Requester's guess (non-binding): agent profile — `super-agents/workhorse-wes/memory.md`, the recurring-pitfalls ledger
- Context / why: **Approved for placement, not placed — a twin session is live.** Wes was seated in TWO concurrent sessions on 2026-07-28 (URITP audit `86ajknmmk` and the F1 pass `86ajr4bej`); per super-agent-base Concurrency rule 4 the audit session holds the pen on his `memory.md` and durable changes from the other serialize through here. **Place on the next drain, or let the audit session take it.**

### OMR-20260728-1 · OPEN · 🔴 BLOCKED ON CAPACITY (not on placement)
- Requested by: Fleet Felix (triaged by Memory Maggie at the Jul 28 close)
- Candidate note: **Michael pipes long structured output into Prism (the repo's JSON/Markdown viewer) and reads it as a TABLE.** His words, unprompted, 2026-07-28: *"that was incredibly satisfying to feed back into prism and read as a table."* Consequence for composition: dense structured output is not a wall of text to apologize for — it is **input for a viewer he owns**, and consistent parallel structure plus a stable field order are what make that paste render cleanly. Favour uniform, repeated shapes in long replies and reports.
- Requester's guess (non-binding): **brain memory** — and Maggie CONCURS, which is rare.
- Context / why: **This PASSES the deny-by-default test on all three counts** and I tried twice to route it elsewhere. (1) **Must-fire-every-response** — it governs how output is COMPOSED on every substantive reply, not what any one agent knows. (2) **Cross-agent** — it applies to the house voice and all twelve teammates equally, so no single bundle is the right home. (3) **Not procedure**, so the Procedure-is-a-tool gate does not catch it; there is no "how to format for Prism" routine, it is a fact about the READER that reframes a judgement call. **It is queued rather than placed solely because there are ~6 tokens of headroom and it needs ~20.** Placing it requires a cut, and a cut is Michael's ruling. **Maggie's picks for that cut, unchanged and now overdue: the Domain Pointers block** (~4 lines of soft routing the AI Toolkit index already owns — memory itself says *"soft routing lives in the index trigger table"*) **or the GitHub MCP pointer's operating detail** (*"cached reads/SHAs burned 12x"* belongs in the operating standard). Either buys room for this and several more.

### OMR-20260727-1 · OPEN
- Requested by: Maestro Mira (queued by Memory Maggie at close)
- Candidate note: When Michael lacks a mechanism for a decision, he answers with a CONSTRAINT rather than a pick — e.g. "want to keep it single source but not sure how," or leaving every box unchecked and writing a better question in the note. That is a decisive ruling, not a non-answer: treat the constraint as binding and go solve the mechanism.
- Requester's guess (non-binding): agent profile — `super-agents/maestro-mira/memory.md`
- Context / why: durable across every future orchestration turn, but it is relational reading-Michael context rather than must-fire-every-response behavior, so it fails the brain-memory test. Distinct from the already-locked Gold Standard rule 4 clause, which covers the mechanical checkbox reading; this is the broader behavioral pattern behind it. ⚠️ **2026-07-28: a THIRD instance of this shape fired (Q11), and Mira placed a related scar in her own bundle at that close. Reconcile this entry against what is now already written there before placing — it may be redundant.**

### OMR-20260727-2 · OPEN
- Requested by: Maestro Mira (queued by Memory Maggie at close)
- Candidate note: Seating Counter Cole as designated opposition on a room that has already converged produces the session's strongest correction. On 2026-07-27 he caught that the Workshop kept its recommendation after the premise it rested on had been disproven by measurement.
- Requester's guess (non-binding): agent profile — `super-agents/maestro-mira/memory.md`
- Context / why: NOT procedure — `orchestration.md` step 8 already permits pulling extra voices, so nothing new needs authoring. What is durable is the evidence that it worked, which is exactly the kind of conducting precedent a bundle exists to hold. ⚠️ **2026-07-28 corroboration: Breaker Beckett did the same job unprompted on the F1 pass — he attacked Mira's own census (a nine-file finding published off six files) and was right. Same shape, different lens. Consider generalizing this entry to "seat an adversary against the SYNTHESIS, not just the artifact" rather than filing two lens-specific notes.**

### OMR-20260727-3 · OPEN
- Requested by: Fleet Felix (bounced by Memory Maggie at the Jul 27 evening close)
- Candidate note: Re-check a size estimate at COMMIT time, not only at spec time. On 2026-07-27 the Routines Viewer v2 spec projected +1.2KB and the change landed at +4.7KB — roughly 4x off, pushing the file well past the 15KB split line. Estimating before writing was correct; the miss was never re-measuring once the code existed, which is exactly the moment a budget is easiest to skip.
- Requester's guess (non-binding): **unsure — genuine fork.** Either `super-agents/dev-dexter/memory.md` (a scar he carries) OR `hooks/source-size-budget-enforcer.md` (a step the tool should enforce).
- Context / why: **BOUNCED rather than placed, deliberately.** Two reasons. (1) Dexter was seated by Felix rather than driving his own session, and another agent's bundle is not mine to write into on his behalf. (2) If the rule is "re-measure before the commit," that is PROCEDURE and belongs in the Enforcer hook — writing it into a bundle would be a Constitution §2-§3 violation of exactly the shape scored as B16. **Resolve the hook-vs-bundle fork with the Enforcer open in front of you before placing this.** If it lands in the hook, it needs no memory write at all. ⚠️ **2026-07-28: a live instance of the same class — `f1-racetracks/README.md` grew 17,556 → 23,384 bytes during a pass whose whole purpose was correcting it, flagged in PR #574 rather than caught by a gate. Third data point for the write-time-check proposal.**

---

## Entry template

```
### OMR-<YYYYMMDD>-<n> · OPEN
- Requested by: <agent>
- Candidate note: <self-contained, standalone-readable; must make sense with zero session history>
- Requester's guess (non-binding): <hook | gate | agent profile | reference doc | brain memory | unsure>
- Context / why: <one line>
```
