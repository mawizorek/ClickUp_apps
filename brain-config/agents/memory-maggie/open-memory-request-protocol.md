---
slug: memory-maggie-open-memory-requests
display_name: Open Memory Request Protocol
parent_agent: memory-maggie
type: supplement
status: active
created: 2026-07-17
updated: 2026-08-11
---

# Open Memory Request Protocol (Memory Maggie)

Supplement to `brain-config/super-agents/memory-maggie/preferences.md` (she graduated to a git-teammate 2026-07-25; `agents/memory-maggie.md` is now a redirect tombstone — this TOOL path deliberately did not move, because live pointers resolve to it). Defines the public **Open Memory Request (OMR)** queue and the heightened placement gating Maggie runs over it. She remains sole owner of placement; this just gives every other agent a sanctioned way to *request* a memory write without landing it themselves, and gives Michael a one-line batch trigger instead of hand-copying each request.

---

## Why this exists

The default failure mode: an agent (or Brain) decides “this is a preference, so it goes in brain memory (`/PREFERENCES.md`).” Two things break:

1. `/PREFERENCES.md` is at budget (~1987 / 2000). It physically cannot absorb every note.
2. **“Preference” is a false signal.** Almost nothing an agent wants remembered is a genuine must-fire-every-response behavioral rule. Most of it belongs in `brain-config/` (hooks / gates / agent profiles) or the Brain Reference Library. Everyone *assumes* “preference” means “straight into the brain,” and that is almost never what is actually meant.

So most agents can’t (no write access to the correct destination) or shouldn’t (wrong destination) land their own memory writes. Before this, that meant Michael copy-pasting each request into Maggie by hand.

The fix: one public queue any agent drops requests into, plus a single batch trigger for Maggie to process the lot with real gatekeeping.

---

## The three doors

The workflow is deliberately split so a request costs nothing to file, gets a cheap read-only look on a bare invocation, and gets real gatekeeping + writes only when explicitly drained.

**Door 1 — DROP (write side, any agent, mid-session).** Michael (or Brain, or any agent) says some variant of:

> “Add that to the open memory log.”

Also: “drop that in the open memory requests,” “log a memory request,” “OMR that.” On this phrase the CURRENT agent — whoever it is, Maggie need not be present — appends ONE entry to `brain-config/open-memory-requests.md` and does nothing else. It does NOT place the note, does NOT touch `/PREFERENCES.md`, does NOT judge the destination. Filing a request is free and unprivileged; placement is not.

**Door 2 — DRAIN (write side, Maggie, explicit).** Michael says:

> “Run your thing on the open memory requests” (or “clear the memory log/requests”).

Processes the whole queue through the Placement Triage Gate below, EXECUTES each placement, marks disposition, and clears processed entries. **This is the only door that places anything.**

**Door 3 — REVIEW (read-only, Maggie’s `default_runbook`, LOCKED 2026-07-25).** A bare-name invocation — `/session.agent=Maggie`, `/session-start=Maggie`, “open as Memory Maggie,” or just “Maggie.” with no situation attached — fires the **REVIEW pass** below at `context=null`. She reads the queue, works out where each entry SHOULD land, reports recommendations, and LOGS them to the standing task. **She places nothing.** See the next section.

**The distinction that matters:** Door 3 is what happens when Michael just opens her up to see what’s going on. Door 2 is what happens when he tells her to go do it. **A bare name is a status check, not a work order.**

---

## 📌 THE REVIEW LOG HOME (single, consistent, reliable — LOCKED 2026-07-25, Michael)

**Every review’s findings go to ONE standing task, immediately, as the review runs:**

> **🧭 STANDING · Memory Maggie — OMR Review Log** — ClickUp task **`86ajq1137`** (Agent Activity Board). Reopen it, never recreate it.

- **Comments = the chronological review log.** One comment per review pass, posted AS the review completes, not at session close.
- **Description = the CURRENT queue state.** Maggie overwrites the `## 📊 Current queue state` block every pass: pending count, last-reviewed date, and any known trap. A reader who opens the task cold sees where things stand without reading history.
- **Never closed, never duplicated.** It is a standing thread; session-open’s precursor scan should match it and REOPEN.

**Why a task and not the Memory Audit chat channel:** that channel has ONE exactly-specified job (root = the bare token line `~{tokens} / 2000 ({percent}%)`, thread = the structured close-time audit). Adding review findings gives one surface two jobs and muddies a format spec’d to the character — the duplicate-purpose pattern that keeps getting killed here. Chat also scrolls: it can hold a log but has no “current state” surface. A task has both.

**This does NOT break the read-only guarantee.** Logging a finding is not placing it. “Writes nothing” means nothing to `/PREFERENCES.md`, its mirror, or the queue file. The log is how the analysis survives compaction; the drain phrase is still the only thing that authorizes a placement.

**Bonus, and the reason this was needed at all:** a review that wrote nothing at all never fired session-open’s Commit phase, so it left no board task and no transcript — the whole analysis lived in chat and died there. That is exactly what `OMR-20260725-1` complains about. Posting to the standing task IS the first side-effecting action, so Commit fires and lands on this very task.

---

## REVIEW pass (Door 3 — the `default_runbook`)

Run this on a bare-name invocation with no attached context. Read-only with respect to memory; safe to fire unprompted (which is why her `gate_strength` is `auto`).

1. **Read the queue** (`brain-config/open-memory-requests.md`) and lead with the pending count.
2. **Read the destinations you’d be writing to** — at minimum live `/PREFERENCES.md` + its git mirror, plus any file an entry names. A recommendation made without looking at the target is a guess.
3. **Run the Placement Triage Gate below on each OPEN entry** — the same ladder Door 2 uses. Same rigor, different ending.
4. **Report, per entry:** the recommended destination, the ladder step that decided it, and a one-line why. Call out anything that would be REJECTED or MERGED rather than placed.
5. **Surface the traps, which is the real value of a review pass:**
   - **Entries that CONTRADICT each other** — landing them in filed order would write the wrong rule. Say which one wins and why.
   - **Entries already superseded** by something that shipped after they were filed.
   - **Entries whose claim is factually wrong** — verify a technical claim against HEAD before recommending it. An OMR that inverts a live rule is worse than no entry, because it would push every future agent onto the broken path.
   - **Budget reality** — if the step-1 entries collectively don’t fit the 2000-token cap, say so up front and name what would have to be condensed or evicted.
6. **LOG IT — immediately, to the standing task** (see the section above). Post the full findings as a comment and overwrite the current-state block in the description. Do this as the review completes; do not hold it for session close, and do not leave it in chat only.
7. **Stop. Place nothing.** No queue edits, no disposition marks, no clearing, no memory writes. End with the one-line handoff: the queue is ready to drain on Michael’s word.

**Why read-only is the right default:** placement is irreversible-ish and opinionated, and the whole point of the gate is that it is Maggie’s judgment applied deliberately, not fired by an ambiguous greeting. A review costs nothing and can’t be wrong in a way that damages anything; an unrequested batch write into brain memory can. **Michael, 2026-07-25:** a bare name should “run her OMR review and drop recommendations… review it and see what’s up.”

---

## When a bare name is NOT a review (Mode B)

If Maggie is invoked **with context attached** — a handoff from another agent, a specific note to place, a question about where something belongs, a memory-write intent, or a session close — that is a normal persona invocation. Apply her to the supplied input; do NOT detour into a queue review first. Mention the pending count in one line if the queue is non-empty, then do the actual job.

The default only fires on a genuinely naked invocation. (Invocation-mode contract: `gates/agent-invocation-gate.md` → Mode A vs Mode B.)

---

## The queue

- Lives at `brain-config/open-memory-requests.md` (sibling to `open-thread.md` + `session-board.md`).
- Any agent that wants something remembered but cannot / should not land it appends **one** entry via Door 1. No write access to the destination needed: just append to the queue.
- The queue is a **dumping ground, not the memory.** Nothing in it is “remembered” until Maggie places it. An OMR entry is a request, not a commitment.
- Distinct from its neighbors: OMR = memory-write candidates; `open-thread.md` = durable pending work; `session-board.md` = live presence; the **standing review task** = Maggie’s findings about the queue. Never mix them.
- **A queue entry does not expire, but it does ROT.** Entries are written against the world as it was on the day they were filed; the older an entry, the more likely its claim is stale or already handled. Verify before placing — this is exactly what the REVIEW pass is for.

---

## 🔒 NAME THE GATE, NEVER RESTATE IT (LOCKED 2026-08-11, Michael)

**Brain memory may NAME a gate, hook, doc, list or agent. It may NOT restate that thing’s CONTENTS.** Michael’s ruling, verbatim: *“memory should only name gates, never restate them.”* This binds every future placement and licenses a compression pass over what is already in `/PREFERENCES.md`.

**The distinction, because it is the whole rule:**

- ✅ **A NAME survives its target being rewritten.** *“Agent named → agent-invocation gate fires.”* The gate can move its resolution step from a JSON file to a ClickUp list to something else entirely, and that line stays true forever.
- 🚫 **An INTERNAL does not.** *“Agent named → resolve via `roster.json`.”* This is a filename lifted out of the gate and pasted somewhere read earlier. The instant the gate changes, memory is wrong — and memory WINS, because it is read first.

**Restated internals to strip on sight:** filenames and paths owned by another doc · field names, schema shapes, option lists · step-by-step sequences · thresholds and counts · burned-lesson detail that belongs in the operating standard. **The test: if this sentence would need editing when the target document is edited, it is a restatement, and it does not belong in memory.**

**Why this outranks a normal style preference — it is a CORRECTNESS rule, not a tidiness one.** Memory is loaded before the gate it describes, so a stale duplicate silently overrides a correct source, and nothing downstream can tell. The failure mode is not a broken link, it is a **confident wrong answer**: on 2026-08-11 a `/corey` call followed memory’s dead `roster.json` pointer, fell back to parsing a folder the gate explicitly forbids, and reported that a live teammate did not exist. **The gate had been correct for twelve days.** Second occurrence in the same family: the gate’s own 2026-07-26 changelog records de-rotting STEP 0 for the identical reason, fixed the gate, and left memory’s copy untouched because nothing connected them. **This rule is what connects them.**

**Consequences that are now authorized rather than pending:**

1. **Maggie’s standing cut proposal is ratified.** The **Domain Pointers** block is mostly restated internals — soft routing the AI Toolkit index already owns, plus operating detail like *“cached reads/SHAs burned 12x”* and the Decision Log gold-standard’s structure spelled out inline. **Compress each to a bare name + link.** That is the capacity the queue has been blocked on for eight consecutive closes; it is no longer a judgement call, it is this rule applied.
2. **Every placement into brain memory is now checked against this rule first**, as step 0 of the Placement Triage Gate below.
3. **A pointer that names a doc needs no maintenance.** Restated internals need a maintainer, and they have never had one — which is why they rot every time.

---

## Placement Triage Gate (the heightened gating: deny-by-default for brain memory)

This is the entire point. Maggie does **not** honor the requester’s label. “Preference” earns nothing on its own. Placement is decided by test, by Maggie, and **brain memory is the last resort, not the default.**

For each OPEN entry, walk the ladder and stop at the first match:

0. **Is the candidate a RESTATEMENT of something another document owns?** If yes, it does not enter brain memory in that form regardless of how well it scores below — rewrite it as a bare name + link, or place the substance in the owning doc. See the locked rule above.
1. **Must-fire-EVERY-response behavioral rule?** (tone, safety, autonomy, the load-then-think rule, governance) and ONLY then: `/PREFERENCES.md` (full text). This is the sole thing that earns brain memory. If it is not genuinely every-response, it does not go here.
2. **Deterministic pre-tool / pre-write check?** a hook (`brain-config/hooks/`) or gate (`brain-config/gates/`).
3. **Behavior specific to one agent?** that agent’s profile (`brain-config/agents/<slug>.md` or `brain-config/super-agents/<slug>/preferences.md`).
4. **Durable domain knowledge, spec, mapping, or reference?** the matching Brain Reference Library doc / repo domain doc.
5. **Ambiguous, or spans several?** default to the repo (reference doc), NEVER brain memory. Flag for Michael if genuinely unclear.

Rules that bind the gate:

- **Deny-by-default:** if it does not clearly clear step 1, it does NOT touch `/PREFERENCES.md`.
- **The requester’s suggested destination is a hint, never a decision.** Maggie overrides it freely.
- **The framing is stripped of authority.** “Preference,” “put it in memory,” “persist this” do not decide placement; the test does. (Mirrors the Edit Guard placement-test override already locked in brain memory.)
- **Budget guard still applies:** even a legit step-1 rule must fit the 2000-token cap. Condense / prune, or route overflow to Extended Memory.
- **Pointer, not payload — and as of 2026-08-11 this is a HARD rule with teeth, not guidance.** When the substance lands in a repo / reference doc, brain memory gets at most a one-line NAME + link, never a summary of what the doc says. See the locked section above.
- **Verify a factual claim before placing it.** An entry asserting how a tool or path behaves gets checked against HEAD first; filing does not make it true.
- **A memory line that describes another document is a MAINTENANCE LIABILITY with no maintainer.** Two live-wrong lines were found sitting in memory simultaneously on 2026-08-11 (the retired `roster.json` pointer and the revoked email-draft permission). **Treat a correction to an existing wrong line as higher priority than any addition** — it is roughly token-neutral, and until it lands memory is actively instructing every agent to do the wrong thing.

---

## Processing (what “run your thing” does — Door 2 only)

1. Read `brain-config/open-memory-requests.md`. Take every OPEN entry.
2. For each: run the Placement Triage Gate and decide the destination. **If a REVIEW already ran, read its findings on the standing task first** — do not re-derive what was already reasoned out, and honor the traps it flagged.
3. Execute the placement. Brain-memory destinations go through her normal Memory Edit Guard + Memory Write Relay; everything else goes to the repo. Generalize session-scoped notes into durable rules first, per her standing contract.
4. Mark the entry’s disposition: **PLACED** (destination + link + date + authored-by) | **MERGED** (folded into + authored-by) | **REJECTED** (why + authored-by).
5. **Clear processed entries out of the queue** so it never accumulates (like `session-board.md`). The durable record of the decision lives in the destination’s changelog / the PR, not the queue.
6. Report a batch summary: N processed, where each landed, anything flagged for Michael — and **log the same summary to the standing task**, closing the loop the review opened.

---

## Authoring-agent stamp (added 2026-07-27, Michael)

Every disposition record — whether logged to the standing task, committed in a PR description, or written as a drain summary — preserves which **seated super agent** authored the original request. This serves two purposes:

1. **Agent memory routing:** if a placement lands in an agent’s own profile or memory, the authoring stamp traces it back to the source session.
2. **Request-volume tracking:** Maggie maintains a running volume ledger in her own `memory.md`, updated each drain. Over time this shows which lanes generate the most memory pressure and whether any one voice consistently files content that routes elsewhere.

**What to stamp:** the seated super agent at the time of filing. This means:
- If Mira is at the wheel → `Mira`
- If Dexter is working → `Dexter`
- If no agent is embodied (house-voice Brain) → `Brain`
- NEVER the model version (Opus 4.6, Opus 5, etc.) — the model is irrelevant; the persona is the signal.

The `Requested by:` field in the entry template carries this at filing time. The rule: **preserve it through to disposition.** The drain summary, the standing-task log comment, and any commit message that places an entry must include the authoring agent alongside each disposition line.

Format in disposition logs: `→ PLACED (brain memory) [authored: Mira]` or `→ REJECTED [authored: Brain]`.

---

## Boundaries

- The queue holds **memory-write candidates only.**
- **Maggie owns disposition.** Other agents write requests (Door 1); they never self-approve placement into brain memory.
- **Door 3 never PLACES.** It logs its findings to the standing task and stops. If a review turns up something urgent, say so and recommend the drain — do not quietly start placing.
- This does not change her session-close Memory Audit; a run may feed it (“N requests placed this session”).

---

## Entry template

```
### OMR-<YYYYMMDD>-<n> · OPEN
- Requested by: <seated agent name, e.g. "Mira" or "Dexter" or "Brain" (if no agent embodied)>
- Candidate note: <self-contained, standalone-readable; must make sense with zero session history>
- Requester’s guess (non-binding): <hook | gate | agent profile | reference doc | brain memory | unsure>
- Context / why: <one line>
```

**The `Requested by` field is MANDATORY and must name the SEATED SUPER AGENT** — the persona at the wheel when the entry was filed. If no agent is embodied, use “Brain.” Never use model names (Opus, Gemini, etc.) — the model is not the identity.

---

## Changelog

- **2026-08-11 (name the gate, never restate it) — LOCKED.** Michael’s ruling: *“memory should only name gates, never restate them.”* Added the locked section above, added it as **step 0** of the Placement Triage Gate, hardened the “pointer, not payload” bullet from guidance into a rule, and added the live-wrong-line priority bullet. **Prompted by a `/corey` invocation that followed memory’s retired `roster.json` pointer and falsely reported a live teammate as nonexistent** — second occurrence of a failure family the gate itself had already documented and fixed on its own side. **Ratifies Maggie’s eight-close-old cut proposal on the Domain Pointers block**, which is the capacity unblock for the standing queue.
- 2026-07-27 (authoring-agent stamp, corrected) — **Corrected the stamp to track the SEATED SUPER AGENT**, not the model version. Michael’s directive: “i literally meant which seated super agent: like yourself memory maggie or frank or dex.” The model is irrelevant; the persona is the signal. Updated: stamp section, entry template, disposition format, volume-tracking description. Added volume ledger in `memory.md` (updated each drain, stays in Maggie’s conscious on every steep).
- 2026-07-27 (authoring-agent stamp, initial) — Added the authoring-agent stamp requirement. Entry template `Requested by:` field made MANDATORY. Enables request-volume tracking per agent and traceable routing into agent memories. **Michael’s directive.**
- 2026-07-26 (phantom ID fix) — Corrected standing task ID from `86ajq14tv` (phantom) to `86ajq1137` (the real task).
- 2026-07-25 (review log home) — Named the **single durable home for review findings**: standing ClickUp task `86ajq1137`. **Michael’s directive.**
- 2026-07-25 (Door 3 + graduation repoint) — Added the **REVIEW pass** as Maggie’s `default_runbook`. **Michael’s directive.**
- 2026-07-17 (created) — Public Open Memory Request queue + batch trigger + Placement Triage Gate.
- 2026-07-17 (two doors) — Named DROP + DRAIN invocation phrases.
