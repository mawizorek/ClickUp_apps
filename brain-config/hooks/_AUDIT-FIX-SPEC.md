# Hooks Template Conformance — Fix Spec for Dexter

**Auditor:** Anna · **Date:** 2026-08-02
**Standard:** `brain-config/hooks/_HOOK-TEMPLATE.md` (SHA: 14419d9)
**Scope:** All `.md` files in `brain-config/hooks/` EXCLUDING: `_HOOK-TEMPLATE.md`, `_AUDIT-FIX-SPEC.md`, `*.metadata.json`, `*.decision-log.md`

---

## True Purpose

Every hook should be actionable by a cold agent without guessing what it is, who owns it, or where it touches. The template defines a consistent header contract. This spec tells Dexter exactly what's missing so he can patch each hook's header without rewriting its body.

---

## The Standard (header fields, in order)

```
# <Hook Name> · AI Toolkit

**Purpose:** <one sentence>
**Steward:** <agent name>
**Mode:** <Always-on | On-demand routine | Gated | Contextual | Procedural>
**Invocation:** <slash commands or "Automatic">
**Trigger:** <when it fires>
**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).
**Established <date>** by <agent(s)>.
```

Plus these sections (can appear in any order after the header, but must exist):
- `## Coordinates` (table of surfaces/locations)
- `## Procedure` (or equivalent: `## Pass`, `## The check` — acceptable aliases)
- `## Guardrails`
- `## Composes with`
- `## Changelog`

---

## Systemic Findings (apply to MOST hooks)

### 1. STEWARD field missing (~37 of 39 hooks)

Only `doc-destroyer-reconcile.md` and `source-freshness-gate.md` have it.

**Fix:** Add `**Steward:** <agent>` after Purpose. If the correct steward is unknown, set to `TBD (Fleet Felix to assign)`. Known steward assignments from lane boundaries:

| Hook | Likely Steward |
|---|---|
| session-close.md | Closing Clio |
| session-open.md | Closing Clio |
| memory-edit-guard.md | Memory Maggie |
| memory-rotation.md | Memory Maggie |
| memory-write-relay.md | Memory Maggie |
| native-memory-flush.md | Memory Maggie |
| native-flush-consolidation.md | Memory Maggie |
| doc-rot-sweep.md | TBD (ownerless by design, any agent fires it) |
| collision-check.md | TBD (ownerless, structural) |
| source-freshness-gate.md | Scout Sage (already present) |
| secrets-pii-guard.md | TBD (ownerless safety gate) |
| batch-import.md | Milo (production domain) |
| decision-elicitation-gate.md | TBD (ownerless, deterministic) |
| team-loop.md | Maestro Mira |
| commit-pre-flight.md | TBD |
| custom-field-gate.md | Corey |
| fleet-fact-sweep.md | Felix stewards the register, Anna leads runs |
| link-provenance.md | TBD |
| post-build-verify.md | TBD |
| stale-context-reload.md | TBD |
| All others | TBD (Fleet Felix to assign) |

**NOTE on "ownerless" hooks:** Some hooks are deliberately ownerless (any agent fires them). Steward still applies: steward = who maintains the HOOK FILE's correctness, not who runs it. Felix should assign these.

### 2. FRONT DOOR statement missing (~37 of 39 hooks)

Only `doc-rot-sweep.md` and `doc-destroyer-reconcile.md` have the full statement.

**Fix:** Add this exact line after Trigger:
```
**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).
```

### 3. COORDINATES table missing (~38 of 39 hooks)

Only `doc-destroyer-reconcile.md` has it.

**Fix:** Add a `## Coordinates` section with a table of relevant surfaces. For hooks that are purely procedural with no external surface (e.g. `secrets-pii-guard.md` fires on content in-flight, no list or folder), the table can contain:
```
| Surface | Location |
| --- | --- |
| **Scope** | All repo writes to `mawizorek/ClickUp_apps` |
```
For hooks tied to specific lists/docs/repos, name them.

### 4. TITLE format inconsistent (~30 hooks)

Variants found:
- `# Hook Name · AI Toolkit` ✓ (correct)
- `# Hook Name — AI Toolkit` ✗ (em-dash, wrong separator)
- `# Hook Name — Subtitle` ✗ (wrong format)
- `# Hook Name` ✗ (no suffix)
- `# Hook Name — v1.0` ✗ (version in title)

**Fix:** Normalize all to `# <Hook Name> · AI Toolkit`. Drop subtitles, version numbers, and em-dashes from the H1. Subtitles can move to a blockquote under the title if valuable.

### 5. ESTABLISHED line missing (~34 hooks)

Many embed the date in Changelog v1 entries but lack the standalone header field.

**Fix:** Add `**Established <date>** by <agent(s)>.` to the header block. Source the date and author from the Changelog v1 entry (it's always there). Format: `**Established 2026-07-25** by Dev Dexter.`

### 6. GUARDRAILS section missing or informal (~20 hooks)

Some embed constraints inside procedure text without a formal section.

**Fix:** Extract safety/constraint rules into a `## Guardrails` section. If only 1-2 bullets, that's fine. If constraints are deeply woven into procedure and extracting them would gut the prose, add a minimal Guardrails section that POINTS at the constraints: "See guardrails inline in Procedure above."

---

## Per-Hook Specifics (non-systemic)

### session-close.md
- Uses YAML frontmatter (`slug`, `display_name`, `type`, `status`, `trigger`, `owner_agents`). **Decision needed:** does the YAML stay alongside the flat-markdown header, or get stripped? LEAN: strip it. The template IS the standard. YAML was pre-template convention.
- `owner_agents` field → convert to `**Steward:**` in the markdown header.
- Title: `# Session Close Hook` → `# Session Close · AI Toolkit`

### collision-check.md
- Uses `**Type:**` instead of `**Mode:**`. Rename.
- Uses `**Created:**` instead of `**Established:**`. Rename + reformat.
- `**Requires:**` field is non-standard. Move to Coordinates or Procedure.
- `**Companion:**` field is non-standard. Move to Composes with.

### batch-import.md
- Title: `# Batch Import — Inciardi Collection` → `# Batch Import · AI Toolkit`
- Subtitle "Inciardi Collection" can become a one-line scope note under the title.

### team-loop.md
- Title: `# Team Loop — Sequential Team Pipeline` → `# Team Loop · AI Toolkit`
- Blockquote opener → convert to Purpose field.
- Has no formal Mode/Invocation/Trigger in the header position (they're under a section heading lower). Move to header.

### source-freshness-gate.md
- Title: `# Source Freshness Gate — v1.0` → `# Source Freshness Gate · AI Toolkit`
- Steward section exists but is placed AFTER the procedure. Move to header block.
- Missing: Front door, Established, Coordinates.

### decision-elicitation-gate.md
- Missing: Steward, Front door, Established, Coordinates.
- Has a `## Exceptions` section that could be folded into Guardrails or kept as-is (it's substantive enough to stand alone).

### memory-edit-guard.md
- Missing: Steward, Front door, Established, Coordinates.
- `## Composes with / overrides` → split: keep as `## Composes with` and move override rules to Guardrails.

---

## Execution Rules for Dexter

1. **Header patches ONLY.** Do not rewrite procedure sections. Add the missing header fields and section headers. Preserve the hook's substantive content verbatim.
2. **One PR per wave** (suggest: 10-12 hooks per PR for reviewability).
3. **Wave order:** Start with the hooks that are closest to compliant (need fewest changes) → work toward the most divergent.
4. **Steward = TBD is acceptable.** Don't block on Felix assigning every steward. Ship the field, mark unknowns, Felix can fill them in a follow-up pass.
5. **Coordinates can be minimal.** A one-row table saying what the hook touches is better than no table. Don't invent surfaces that aren't there.
6. **Changelog entry for each patched hook:** `- **v<next> (<date>)** — Header normalized to hook template standard (Audit Anna fix-spec, PR #<n>).`
7. **Do not touch `.metadata.json` or `.decision-log.md` files.** Out of scope.
8. **admin-task-template.md** — verify if this is actually a hook or a different artifact type. If it's not a hook, it may not need template conformance.

---

## Suggested Waves

| Wave | Hooks | Rationale |
|---|---|---|
| 1 (closest to compliant) | `doc-rot-sweep`, `source-freshness-gate`, `memory-edit-guard`, `decision-elicitation-gate`, `secrets-pii-guard`, `batch-import` | Already have most fields, just need gaps filled |
| 2 (moderate gaps) | `collision-check`, `session-close`, `team-loop`, `commit-pre-flight`, `custom-field-gate`, `post-build-verify` | Need field renames or structural moves |
| 3 (remaining) | All others not yet touched | Likely follow the same systemic pattern (missing Steward + Front door + Coordinates + Established + title format) |

---

## Acceptance Criteria

A hook PASSES this audit when:
- [ ] Title is `# <Name> · AI Toolkit`
- [ ] All 7 header fields present in order (Purpose, Steward, Mode, Invocation, Trigger, Front door, Established)
- [ ] `## Coordinates` section exists (even if minimal)
- [ ] `## Guardrails` section exists (even if minimal or pointing at inline constraints)
- [ ] `## Composes with` section exists ("None" is valid)
- [ ] `## Changelog` section exists with at least a v1 entry
- [ ] Procedure section exists (any naming: Procedure, Pass, The check, etc.)

---

## Changelog

- **v1 (2026-08-02)** — Audit Anna pass 1. Sampled 10 of 39 hooks, identified 6 systemic gaps + per-hook specifics. Fix spec committed for Dexter pickup.
