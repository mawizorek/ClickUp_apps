# Session Close Hook — Decision Log

> Why the hook is shaped this way. History, scars, reversals, and Michael rulings live here so the runtime hook can stay lean. Commit history is not the retrieval surface.

---

## 2026-07-08 · D1 · Git becomes canonical

**Decision:** `brain-config/hooks/session-close.md` becomes the canonical session-close spec.

**Why:** the ClickUp version had become a reference page, not a safe runtime source. The close path is procedure, and procedure needs a git-native home where related changes land atomically with the rest of the tool stack.

**Consequence:** the ClickUp page becomes archival, never canonical.

---

## 2026-07-16 · D2 · Channel 2 closes Scribe's live transcript

**Decision:** session close finalizes the live transcript model rather than reconstructing a summary from memory.

**Why:** once Scribe owned the live session log, close stopped being "write the whole story from scratch" and became "cap the record that already accrued."

**Later superseded:** this was itself superseded the next day by the Agent Activity Board reframe (D3), when the live transcript moved off the channel and onto the session task.

---

## 2026-07-17 · D3 · Transcript moves to the Agent Activity Board task

**Decision:** the live transcript accrues on the session's Agent Activity Board task, not in the A.I. Prompts channel.

**Why:** the active session record needed to live where the work was, turn by turn, not as a reconstruction at close. The task became the live working record; Channel 2 became a summary plus pointer.

**Consequence:** any instruction that treats Channel 2 as the full transcript is stale on sight.

---

## 2026-07-17 · D4 · The task did not replace the two-channel close

**Decision:** even after the session task became the live transcript home, both close posts still fire.

**Why:** Michael explicitly rejected the false substitution. The task is the working record; the two channels are the institutional breadcrumb surfaces.

**Michael:** "the session task did NOT retire the two-channel close."

---

## 2026-07-17 · D5 · Bounced memory writes must land in the open queue

**Decision:** if a memory write fails, close appends a durable entry to `brain-config/open-memory-requests.md`.

**Why:** chat mention or audit footnote is not a handoff surface. The queue is.

**Michael:** "if you have a memory addition request, drop it in the open memory thread in the Git for another agent to pick up later."

---

## 2026-07-17 · D6 · Open-thread note must also append to `open-thread.md`

**Decision:** the same open-loop note already posted on the session task also gets appended to `brain-config/open-thread.md`.

**Why:** the task comment is the in-session record; `open-thread.md` is the cold-agent queue. One without the other drops continuity.

**Michael:** "take the same open-thread note and just post it in the open thread section... we won't require a review of that; just post it as the next line."

---

## 2026-07-17 · D7 · Handoff becomes a task, not a pasted code block

**Decision:** the next-session warm start is a real Agent Activity Board task in the `to do` handoff slot, not an inline chat block.

**Why:** copy-paste handoffs are brittle and non-walkable. A handoff task creates a real session graph and gives the next agent an actual launch surface.

**Consequence:** any procedure instructing the agent to paste the next-session prompt inline in chat is historical only.

---

## 2026-07-18 · D8 · No-ask execution

**Decision:** when close is triggered, the full close fires without asking permission for mandatory steps.

**Why:** asking "should I do the required thing?" is not diligence, it's stalling on a decision already made by the procedure.

**Origin scar:** Scoreboard B10.

**Michael:** "ofc I want you to complete those tasks to finish out the session close. add documentation that enforces you just getting that done."

**Generalization:** this principle applies beyond close to any mandatory gate.

---

## 2026-07-18 · D9 · Scoreboard delta is part of close

**Decision:** the close must report the revised scoreboard line, bookending the opening read.

**Why:** if the open reading exists without a close-side delta, the session doesn't carry its own score change and the board becomes an orphaned side surface.

---

## 2026-07-19 · D10 · Session Ledger becomes the browse layer

**Decision:** each session task carries a Session Ledger in the description, finalized at close.

**Why:** the transcript is faithful but expensive to browse. The ledger answers provenance questions fast: what was built here, what docs were touched, what repo artifacts moved.

**Important distinction:** this does not replace `usage-log.json`. One is per-session provenance, the other is cumulative machine tally.

---

## 2026-07-19 · D11 · Scrub before cutting the handoff

**Decision:** before creating a new handoff task, run a reopen-over-create scrub against the Agent Activity Board.

**Why:** deep multi-loop work breeds duplicate handoffs. A lazy fresh create forks the thread; a wrong reopen pollutes a real record. So the confidence bar matters: reopen on a clear match, ask on ambiguity, create only when no real precursor exists.

---

## 2026-07-25 · D12 · Runtime hook must stay trim; provenance leaves the hook

**Decision:** the hook is reduced to runtime-critical procedure only. Amendment prose, scar stories, repeated rationale, and duplicate failure-table explanations move here.

**Why:** the hook hit 34.7KB, well past the safe editable ceiling and too close to the hard read cap. The file had started copying each new rule into 4+ surfaces inside itself: narrative section, rules list, execution order, failure table, and often a companion paragraph. That is projection sprawl inside one file.

**Consequence:** this sibling decision-log pattern should become the default for substantial tools. Runtime in the hook, history here.
