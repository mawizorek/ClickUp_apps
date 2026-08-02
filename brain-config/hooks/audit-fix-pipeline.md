# Audit-Fix Pipeline · AI Toolkit

**Purpose:** A reusable, location-agnostic orchestration script that runs a full compliance cycle: audit a collection against a standard, produce a fix spec, execute fixes, stress-test, and close.

**Steward:** Maestro Mira (orchestrates the chain; Anna and Dexter own their stages)

**Mode:** On-demand routine (procedural, multi-agent)

**Invocation:** `/audit-fix-pipeline` · `/compliance-pipeline` · `/audit-fix` · "run the audit-fix pipeline on X" · "Anna audit this, Dexter fix it" · "audit and fix <target> against <standard>"

**Trigger:** Any request to audit a folder/collection against a template/standard AND execute the resulting fixes in the same pipeline. Also fires when a populated `_AUDIT-FIX-SPEC.md` exists in a target location and someone says "pick up the fixes."

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-08-02** by Maestro Mira + Dev Dexter + Audit Anna.

---

## Coordinates

| Surface | Location |
| --- | --- |
| **This hook** | `brain-config/hooks/audit-fix-pipeline.md` |
| **Fix-spec template** | `_AUDIT-FIX-SPEC.md` (placed IN the target folder, not centrally) |
| **Hook template** | `brain-config/hooks/_HOOK-TEMPLATE.md` (one example standard) |
| **AI Toolkit trigger row** | The index table entry for this hook |

---

## Inputs (location-agnostic)

The pipeline takes TWO inputs and runs anywhere:

1. **STANDARD** — a template or spec file that defines what conformance looks like (e.g., `_HOOK-TEMPLATE.md`, `_TEMPLATE.md`, `super-agent-base.md`)
2. **TARGET** — a folder, collection, or list of items to audit against that standard (e.g., `brain-config/hooks/*.md`, `guides/doc-specs/*.md`, agent profiles)

That's it. Everything else derives from these two.

---

## The Chain (5 stages, 3 agents)

### Stage 1: AUDIT (Anna)

**Agent:** Audit Anna
**Input:** Standard + Target
**Action:** Audit every item in the target against the standard. Identify systemic gaps (apply to most) and per-item specifics (unique deviations).
**Output:** A populated `_AUDIT-FIX-SPEC.md` file placed IN the target folder.
**Exit condition:** The fix spec is committed with: True Purpose, the standard referenced, systemic findings, per-item specifics, execution rules, suggested waves, and acceptance criteria.

### Stage 2: EXECUTE (Dexter)

**Agent:** Dev Dexter
**Input:** The populated `_AUDIT-FIX-SPEC.md`
**Action:** Execute the fixes described in the spec. Work in waves (the spec defines wave order). One PR per wave for reviewability.
**Behavior on pickup:**
- If the spec is LARGE (6+ systemic gaps, 10+ items): note the size and context, work in waves, one PR per wave.
- If the spec is SMALL (1-3 gaps, under 10 items): execute in one pass.
- On completion of ALL waves: clear the spec down to a holding cell (see Lifecycle below).
**Exit condition:** Every item passes the acceptance criteria. The spec is cleared.

### Stage 3: BREAK (Mira seats a breaking team)

**Agent:** Maestro Mira
**Team:** Breaker Beckett + domain voice (Mira picks based on the target's domain)
**Input:** The committed fixes (the PR or the patched files at HEAD)
**Action:** Stress-test the patched items. Does the new conformance break anything? Does a renamed section lose meaning? Does a new field conflict with an existing pattern?
**Output:** PASS / BREAK report (discourse posted as session comments)
**Exit condition:** PASS = advance. BREAK = findings return to Stage 2 (one retry).

### Stage 3b: RETRY (Dexter, conditional)

**Agent:** Dev Dexter
**Fires only on:** BREAK verdict from Stage 3
**Action:** Fix what the breakers found. One PR.
**Exit condition:** Fixes committed. Returns to Stage 3 for re-check (max 1 retry total; after that, hard stop to Michael).

### Stage 4: CLOSE (Mira)

**Agent:** Maestro Mira
**Action:** Synthesize the full run. Report to Michael: what was audited, what was fixed, what broke and was repaired, final state.
**Output:** A closing summary comment on the session task.
**Exit condition:** Michael has the picture. Pipeline done.

---

## The Fix-Spec Lifecycle

The `_AUDIT-FIX-SPEC.md` file is a **standing holding cell** in any folder that participates in this pipeline.

### When EMPTY (holding cell state):

```markdown
# <Collection Name> — Audit Fix Spec

**Status:** Clear
**Last audit:** <date> by <agent> (PASS)
**Standard:** `<path to template/standard>`
**Scope:** <what gets audited>

---

This file is a holding cell for the Audit-Fix Pipeline.
When populated, it contains fix instructions for Dexter.
When clear, the collection is in compliance.
```

### When POPULATED (work to do):

Anna fills it with: True Purpose, the standard, systemic findings, per-item specifics, execution rules, suggested waves, and acceptance criteria. The presence of content IS the signal that work exists.

### Lifecycle transitions:

- **Empty → Populated:** Anna runs an audit (Stage 1)
- **Populated → Empty:** Dexter finishes all waves (Stage 2 exit)
- **Populated stays populated:** Work is in progress or waiting for pickup

### Cold pickup:

Any agent seeing a populated `_AUDIT-FIX-SPEC.md` knows:
- WHO wrote it (the Auditor line)
- WHAT to do (the fix instructions)
- WHEN it's done (the acceptance criteria)
- No prior context needed. The spec IS the context.

---

## Guardrails

- **Bounded iteration.** Stage 3 → Stage 2 retry happens AT MOST once. After that: hard stop, findings to Michael.
- **Header patches only.** Stage 2 does not rewrite procedure sections or substantive content. It adds missing structure and normalizes format.
- **Steward = TBD is acceptable.** Don't block a wave on an assignment. Ship the field, Felix fills it later.
- **The spec is the work order, not a discussion.** If a finding is ambiguous, Anna resolves it BEFORE writing it into the spec. The spec should be executable without judgment calls.
- **One PR per wave.** Keeps diffs reviewable and rollback clean.
- **Never touch adjacent artifacts** (`.metadata.json`, `.decision-log.md`, etc.) unless the spec explicitly names them.

---

## Composes with

- `hooks/_HOOK-TEMPLATE.md` — one example standard (the hooks folder uses this)
- `hooks/doc-destroyer-reconcile.md` — a simpler single-pass reconcile (no multi-agent chain)
- `hooks/team-loop.md` — the broader team-in-phases pattern (this pipeline is a specific INSTANCE of a sequential agent chain, lighter than a full team loop)
- `hooks/doc-rot-sweep.md` — may fire inside Stage 3 if breakers suspect rot
- `hooks/fleet-fact-sweep.md` — may fire inside Stage 1 if Anna finds fleet-claim drift
- Audit Anna's Protocol-FIRST rule — she seats herself for Stage 1
- Breaker Beckett — seated by Mira for Stage 3

---

## Relationship to team-loop.md

This is a **specific procedural instance** of the team-loop concept, but simpler:
- Team-loop = teams-in-phases with dynamic team assignment and build/review variants
- This = named agents in a fixed chain with a file-based handoff artifact

The team-loop routes by Mira's judgment. This pipeline routes by the FIX SPEC: it exists or it doesn't, it's full or it's empty. The artifact IS the routing.

---

## Changelog

- **v1 (2026-08-02)** — Established by Mira + Dexter + Anna. Born from the hooks template conformance audit where Anna produced the first `_AUDIT-FIX-SPEC.md` and Michael named the full agent chain as a reusable pattern. Generalized from that specific instance into a location-agnostic script.
