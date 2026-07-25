# Maggie — Decision Log

> Reasoning about the AGENT ITSELF (why Maggie is shaped this way). Topic decisions live on the topic's own page — memory-system decisions belong on the Brain Preferences Manual's Decision Log, not here. What-changed history = git + PR.

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
