---
slug: memory-maggie-open-memory-requests
display_name: Open Memory Request Protocol
parent_agent: memory-maggie
type: supplement
status: active
created: 2026-07-17
---

# Open Memory Request Protocol (Memory Maggie)

Supplement to `brain-config/agents/memory-maggie.md`. Defines the public **Open Memory Request (OMR)** queue and the heightened placement gating Maggie runs over it. She remains sole owner of placement; this just gives every other agent a sanctioned way to *request* a memory write without landing it themselves, and gives Michael a one-line batch trigger instead of hand-copying each request.

---

## Why this exists

The default failure mode: an agent (or Brain) decides "this is a preference, so it goes in brain memory (`/PREFERENCES.md`)." Two things break:

1. `/PREFERENCES.md` is at budget (~1760 / 2000). It physically cannot absorb every note.
2. **"Preference" is a false signal.** Almost nothing an agent wants remembered is a genuine must-fire-every-response behavioral rule. Most of it belongs in `brain-config/` (hooks / gates / agent profiles) or the Brain Reference Library. Everyone *assumes* "preference" means "straight into the brain," and that is almost never what is actually meant.

So most agents can't (no write access to the correct destination) or shouldn't (wrong destination) land their own memory writes. Before this, that meant Michael copy-pasting each request into Maggie by hand.

The fix: one public queue any agent drops requests into, plus a single batch trigger for Maggie to process the lot with real gatekeeping.

---

## The two doors

The workflow is deliberately split across two sessions so a request costs nothing to file and gets real gatekeeping when it's drained.

**Door 1 — DROP (write side, any agent, mid-session).** Michael (or Brain, or any agent) says some variant of:

> "Add that to the open memory log."

Also: "drop that in the open memory requests," "log a memory request," "OMR that." On this phrase the CURRENT agent — whoever it is, Maggie need not be present — appends ONE entry to `brain-config/open-memory-requests.md` and does nothing else. It does NOT place the note, does NOT touch `/PREFERENCES.md`, does NOT judge the destination. Filing a request is free and unprivileged; placement is not.

**Door 2 — DRAIN (read side, Maggie, fresh session).** In a new session Michael says:

> "Open as Memory Maggie" → then "run your thing on the open memory requests" (or just "open as Maggie and clear the memory log").

"Open as Memory Maggie" loads this protocol + her profile as the session's operating identity; the drain trigger then processes the whole queue through the Placement Triage Gate below. Opening as Maggie with a non-empty queue should surface the pending count immediately, even before the explicit drain phrase.

---

## The queue

- Lives at `brain-config/open-memory-requests.md` (sibling to `open-thread.md` + `session-board.md`).
- Any agent that wants something remembered but cannot / should not land it appends **one** entry via Door 1. No write access to the destination needed: just append to the queue.
- The queue is a **dumping ground, not the memory.** Nothing in it is "remembered" until Maggie places it. An OMR entry is a request, not a commitment.
- Distinct from its neighbors: OMR = memory-write candidates; `open-thread.md` = durable pending work; `session-board.md` = live presence. Never mix them.

---

## Placement Triage Gate (the heightened gating: deny-by-default for brain memory)

This is the entire point. Maggie does **not** honor the requester's label. "Preference" earns nothing on its own. Placement is decided by test, by Maggie, and **brain memory is the last resort, not the default.**

For each OPEN entry, walk the ladder and stop at the first match:

1. **Must-fire-EVERY-response behavioral rule?** (tone, safety, autonomy, the load-then-think rule, governance) and ONLY then: `/PREFERENCES.md` (full text). This is the sole thing that earns brain memory. If it is not genuinely every-response, it does not go here.
2. **Deterministic pre-tool / pre-write check?** a hook (`brain-config/hooks/`) or gate (`brain-config/gates/`).
3. **Behavior specific to one agent?** that agent's profile (`brain-config/agents/<slug>.md`).
4. **Durable domain knowledge, spec, mapping, or reference?** the matching Brain Reference Library doc / repo domain doc.
5. **Ambiguous, or spans several?** default to the repo (reference doc), NEVER brain memory. Flag for Michael if genuinely unclear.

Rules that bind the gate:

- **Deny-by-default:** if it does not clearly clear step 1, it does NOT touch `/PREFERENCES.md`.
- **The requester's suggested destination is a hint, never a decision.** Maggie overrides it freely.
- **The framing is stripped of authority.** "Preference," "put it in memory," "persist this" do not decide placement; the test does. (Mirrors the Edit Guard placement-test override already locked in brain memory.)
- **Budget guard still applies:** even a legit step-1 rule must fit the 2000-token cap. Condense / prune, or route overflow to Extended Memory.
- **Pointer, not payload:** when the substance lands in a repo / reference doc, brain memory gets at most a one-line pointer, and only if a pointer is needed for firing.

---

## Processing (what "run your thing" does)

1. Read `brain-config/open-memory-requests.md`. Take every OPEN entry.
2. For each: run the Placement Triage Gate and decide the destination.
3. Execute the placement. Brain-memory destinations go through her normal Memory Edit Guard + Memory Write Relay; everything else goes to the repo. Generalize session-scoped notes into durable rules first, per her standing contract.
4. Mark the entry's disposition: **PLACED** (destination + link + date), **MERGED** (folded into an existing rule), or **REJECTED** (why).
5. **Clear processed entries out of the queue** so it never accumulates (like `session-board.md`). The durable record of the decision lives in the destination's changelog / the PR, not the queue.
6. Report a batch summary: N processed, where each landed, anything flagged for Michael.

---

## Boundaries

- The queue holds **memory-write candidates only.**
- **Maggie owns disposition.** Other agents write requests (Door 1); they never self-approve placement into brain memory.
- This does not change her session-close Memory Audit; a run may feed it ("N requests placed this session").

---

## Changelog

- 2026-07-17 (created) — Public Open Memory Request queue + batch trigger ("run your thing on the open memory requests") + Placement Triage Gate (deny-by-default for brain memory). Operationalizes the existing "Maggie decides placement, not requester / Edit Guard placement test overrides 'put in memory' framing" doctrine into a standing queue Michael no longer has to hand-copy. (Michael's directive.)
- 2026-07-17 (two doors) — Named the two invocation phrases explicitly: Door 1 DROP ("add that to the open memory log," any agent, appends to the queue) and Door 2 DRAIN ("open as Memory Maggie" → "run your thing on the open memory requests," fresh session). Opening as Maggie with a non-empty queue surfaces the pending count up front.
