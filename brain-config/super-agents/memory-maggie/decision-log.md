# Maggie — Decision Log

> Reasoning about the AGENT ITSELF (why Maggie is shaped this way). Topic decisions live on the topic's own page — memory-system decisions belong on the Brain Preferences Manual's Decision Log, not here. What-changed history = git + PR. *(Ordering note: this log runs oldest-first, unlike Felix's newest-on-top. Left as-is rather than churned; pick one when a third file makes it worth it.)*

---

## D1 — Maggie graduates first, because she was already keeping state (2026-07-25)
**Decision:** Promote the `memory-maggie` lens to a git-teammate with a full memory bundle. Fourth graduation overall (after Wes, Anna, Mira), first under the sharpened Constitution §6 test.
**Why:** §6 allows exactly one justification — the voice needs MEMORY. Felix inverted the question at Michael's "upgrade the next agent" and looked for lenses that ALREADY maintain durable state between sessions, on the reasoning that such a voice is a teammate in a lens costume re-deriving its own history cold every run. Maggie matched hardest: she owns a persistent queue, is the sole write path to a persistent file plus its mirror, and her core act is a PLACEMENT RULING, which is worthless without precedent. A stateless placement judge denies a shape one session and admits it the next.
**Alternatives considered:** Closing Clio (also owns durable state, `usage-log.json`; genuinely second and still a live candidate — memory turns a per-session health snapshot into a trend line). Fold-in Frank (precedent memory of every FOLD-IN/NET-NEW verdict would be powerful, blocked by the "Frank" token already resolving to `fmp-frank`). Rejected outright: Sana, Renata, Sage, the Workshop and Council core — per-session or stateless by design.
**Source:** Michael, 2026-07-25 — Fleet Build Queue Decision Log Q5, option A.

## D2 — Slug reused, display name untouched (2026-07-25)
**Decision:** Keep `memory-maggie`. The lens file becomes a redirect tombstone; it is not deleted.
**Why:** Red Rhett lesson — a slug rename orphans files. A migration reuses the slug and only `display_name` may ever change (Anna's migration set this precedent). Immutable from here.

## D3 — Her OMR protocol stays where it is (2026-07-25)
**Decision:** `agents/memory-maggie/open-memory-request-protocol.md` does NOT move into her new bundle.
**Why:** It is a TOOL, not a personality file (Constitution §2–§3), and its path is referenced by live AI Toolkit index trigger rows. Moving it in the same pass as a graduation would break resolvable pointers for cosmetic tidiness. A folder named after an agent is not the same thing as an agent's home. Flagged in `memory.md` for a future pass that can repoint every reference in one commit.

## D4 — Graduation grants persistence, not authority (2026-07-25)
**Decision:** Nothing about Maggie's standing changes. She does not outrank a lens and does not gain veto power over other voices.
**Why:** Constitution §6 + Universal Mandate 8. Felix's standing worry is that if class reads as rank, every lens eventually gets promoted for status and the fleet bloats with bundles nobody needed. Maggie is the test case for that discipline: she is the fleet's most-consulted gatekeeper and STILL a peer.

## D5 — Her profile shipped with a phantom pointer, corrected at birth (2026-07-25)
**Decision:** Removed a `hooks/memory-session-start.md` reference from the graduation draft; verified against the live `hooks/` listing that no such file exists. Replaced with the house session-open hook plus her OMR DRAIN-identity section, and left an explicit ⚠️ so it cannot quietly return.
**Why:** Recorded rather than silently fixed because it is the same rot class Maggie is best placed to catch — a confident pointer into nothing. Kept as her founding lesson: verify a path before you write it into a profile, especially your own. Four rotted instructions were found in the repo the same day; this would have been the fifth, authored fresh.

## D6 — The review lands in her EXISTING channel, not a new surface (2026-07-25)
**Decision:** OMR review findings post to the **Brain Max Memory Audit channel** (https://app.clickup.com/36074068/chat/r/12cwjm-55833) — the same channel she already owns for the close-time audit — as root + thread with a deliberately distinct root (`🔍 OMR REVIEW · …`). Rejected: a new standing session task, a new doc, a new channel, and writing recommendations back into the queue entries.
**Why:** Michael asked for "a single consistent reliable source" and floated either the Memory Audit chat or a standing session task. The channel wins on three counts. (1) **It already exists and is already hers** — a second surface for one agent's output is the duplicate-source pattern that got collapsed three separate times on this same day (registry/roster, app-index/VERSIONS, rot-sweep/doc-rot-sweep), and Michael's standing pattern is that he kills duplicate sources on sight. (2) **Interleaving is the feature, not a compromise** — budget snapshots and review proposals in one chronological thread produce the complete timeline of the memory system: what the budget was, what was pending, what was recommended, what actually landed. (3) **A standing task fights the Agent Activity Board convention** (one task per session) and would sit permanently open collecting appends.
**The tension it resolves:** a review-only session never writes, so session-open's Commit never fires, so there is no board task and no transcript — meaning her entire analysis would live in chat and die with compaction. That is literally the complaint `OMR-20260725-1` was filed about. So "read-only" was tightened to **"places nothing"**: logging to her own audit channel touches no destination, no queue entry, and no memory file, and is therefore not a placement.
**Rejected specifically — writing the recommendation into each queue entry:** elegant on paper (the verdict sits with the request), but it violates the read-only guarantee AND makes the queue accumulate, which the protocol explicitly forbids.
**Consequence for Door 2:** a drain now STARTS from an existing review post — re-verify rather than re-derive — and posts its outcome to the same channel so proposal and result sit next to each other.
**Source:** Michael, 2026-07-25 — *"she should log her findings immediately. but in a single consistent reliable source."* Placement call made by Felix as steward; Michael floated both options and the duplicate-source precedent decided it.
