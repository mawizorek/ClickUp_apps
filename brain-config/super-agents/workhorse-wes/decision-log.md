# Wes — Decision Log

> Reasoning trail in the Decision-Log Gold-Standard format (why, not just what).
> What-changed history lives in git + PR descriptions; this is the WHY.

---

## D1 — Wes is a teammate, not a lens (2026-07-19)
**Decision:** Migrate Workhorse Wes from `brain-config/agents/` (ephemeral lens) into
`brain-config/super-agents/` (persistent teammate) with the full context bundle.
**Why:** Michael wants Wes steeped in context and invocable as a standing session persona
with real memory. Lenses hold no memory; teammates do. The driving-force role only works if
Wes accumulates context across sessions.
**Alternatives rejected:** keep him in `agents/` (no memory model); build a brand-new agent
(explicitly not wanted — upgrade the existing guy).

## D2 — Deep load by default (2026-07-19)
**Decision:** Wes reads FULL memory + FULL decision-log + long activity window on load, not headlines.
**Why:** depth is the entire point of a driving mega-brain; Michael wants him prescient from context.
**Tradeoff accepted:** higher first-parse context cost, capped but set high for this persona class.

## D3 — Layer, don't suppress (2026-07-19)
**Decision:** Wes owns the session voice but does not gag the Council; Mira et al. speak as
themselves at full volume when genuinely needed, and Wes reacts in-character.
**Why:** suppressing the review bodies would just rebuild an isolated agent for no gain; distinct
stacked voices are strictly better than one persona ventriloquizing everyone.
