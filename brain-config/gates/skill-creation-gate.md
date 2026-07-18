# Skill-Creation Gate

*No-bypass pre-gate. Fires BEFORE authoring or materially editing any native ClickUp AI Skill (via the skill-management tool or the Skills Hub). Load this and act on it first; do not create the skill from memory. Established 2026-07-18. Canonical companion: `brain-config/skills-integration.md`.*

---

## Why this gate exists

AI Skills are the platform-native version of the AI Toolkit index + gate/agent profiles — same shape, so the same-logic-in-two-places drift risk is real (the registry↔index failure class). This gate is the pre-write checkpoint that keeps every new skill on the right side of the governing law before it's built, not after it's already drifting.

**The law (from `skills-integration.md`):** *Skill = TRIGGER + PATTERN, git = STEPS. The skill points at git, never copies it. Only sanctioned duplication is the registry↔index mirror pair.*

---

## The gate (run in order, before authoring)

1. **Dedup check.** Does a skill or a git file already cover this? Search the Skills Hub AND `brain-config/`. Exact overlap = HALT, surface the existing one, extend it instead of spawning a twin. Near overlap = WARN + ask. (Mirrors the Task Dedup / Name-Collision gates, applied to skills.)
2. **Summary-collision check.** Will this skill's summary read near-identically to an existing Active skill's? Auto-load is judged on the summary; two overlapping summaries make firing nondeterministic. Make the summary specific enough to fire on the right context and NOT collide. This is the highest-value single check.
3. **Trigger-vs-steps classification (the core gate).** Decide what this skill is allowed to hold:
   - **Is the method/steps canonical anywhere else** (a git hook/gate/agent, a ClickUp doc, an index)? → The skill must be a **pointer**: hold the trigger + pattern, and its body says "load `brain-config/X` (or the named doc) and run it." Do NOT copy the steps in.
   - **Is it a stable, homeless, self-contained method** that lives nowhere else? → It MAY hold the method inline, detailed on purpose (detail increases reliability on fragile ops). It is now the sole canonical home.
4. **Stable-vs-volatile scrub.** Scan every fact you're about to put in the body. Anything **volatile or canonical-elsewhere** (routing maps, list/task IDs, anything an audit backfills, anything with a git/doc home) is FORBIDDEN inline — replace it with a live pointer the skill reads fresh each run (retrieve-then-reason). Only **stable + homeless** content may be inline.
5. **Layering check.** If this is a domain specialization of a broader skill, make it a sub-skill that POINTS at the domain's canonical index/docs for the volatile facts (see `/uritp-email-ingest` as the reference example). The parent holds the general method; the sub-skill holds the domain pointer, not a copied map.
6. **Placement + status.** Confirm category, and set status deliberately: Draft while iterating (creator-only), Active only when it should auto-load for installed users. Don't ship Active with a colliding summary.

---

## Verdict

- **PASS** → author the skill: thin pointer if steps live elsewhere, detailed-but-homeless if it's the sole canonical home, volatile facts pointed-at not copied.
- **HALT** → an existing skill/git file already covers it (extend that), or the body would copy canonical-elsewhere logic (make it a pointer first).
- **WARN + ask** → near-duplicate or summary-collision risk; confirm with Michael before creating.

---

## Standing drift check (post-creation, and on any skill edit)

If a skill body ever restates steps or facts that also live canonically in git or a doc, that's drift — replace the copied content with a pointer. A skill should read as "here's WHEN + the SHAPE; the steps live at `brain-config/X`," never as a second copy of X. The one exception is the sanctioned registry↔index mirror pair, which is reconciled both-sides-same-session by rule.
