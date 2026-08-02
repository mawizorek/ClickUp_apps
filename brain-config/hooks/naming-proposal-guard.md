# Naming Proposal Guard — AI Toolkit

**Purpose:** Block decorative, emoji-driven, or "pretty" naming convention proposals. Enforce slug-style literal string identifiers that tie to real system artifacts (spec files, type slugs, statuses). Naming is architecture, not decoration.

**Mode:** Deterministic — fires before ANY response that proposes a new naming convention, prefix, suffix, or identifier pattern for workspace objects (tasks, docs, lists, views, fields, files).

**Invocation:** Automatic. No manual token needed.

**Trigger:** The moment Brain is about to suggest how something should be NAMED or PREFIXED as a new convention (not applying an existing one).

---

## The Test (sequential, all must pass)

### 1. Is this a NEW convention or applying an existing one?

- Applying an established pattern (`🧭 STANDING ·`, `↪️ HANDOFF ·`, `🔴 DELETE ME —`, `DUE:`, `[ slug ]`) → **PASS THROUGH, no gate.**
- Proposing a new identifier/prefix/suffix/naming rule → **CONTINUE to step 2.**

### 2. Functional token test

The proposed identifier MUST be a **literal string token**, not a decorative glyph. It must read like a system slug, not a sticker.

**PASS examples:**
- `[ info_sheet ]` — bracket-slug, ties to a spec file
- `| HANDOFF |` — pipe-delimited token
- `REF:` — literal prefix
- `(canonical)` — parenthetical type tag

**HALT examples:**
- `📐 CANON ·` — emoji as the identifier anchor
- `🏛️ REFERENCE ·` — glyph doing the job a word should do
- `✨ MASTER` — decorative leading emoji
- Any proposal where removing the emoji makes the convention meaningless

### 3. Artifact-binding test

The proposed identifier SHOULD bind to a real system artifact. Strongest to weakest:

| Binding | Strength | Example |
|---|---|---|
| Matches a spec filename exactly | ✅ Strongest | `[ info_sheet ]` → `guides/doc-specs/info-sheet.md` |
| Matches a status/type/field value | ✅ Strong | `(milestone)` → task type value |
| Matches a conceptual category only | ⚠️ Weak | `[CANON]` → no file, just a label |
| Matches nothing, exists for vibes | 🚫 HALT | `📐 CANON ·` → just looks cool |

Weak bindings get a FLAG ("this doesn't tie to a real artifact yet — should it?"). HALT only on zero binding.

### 4. Case and style rules (for canonical/spec-slug conventions)

- **Lowercase by default.** The slug in brackets should be lowercase to visually match spec filenames and feel like a programmatic token: `[ info_sheet ]` not `[ INFO_SHEET ]`.
- **Underscores for multi-word:** match filename conventions (`info_sheet`, `call_report`, `safety_plan`).
- **Brackets with interior spaces:** `[ slug ]` not `[slug]`. Breathes better in a task title.
- **No trailing punctuation** after the bracket block. The task title follows naturally: `[ info_sheet ] URITP Letterhead`.

---

## On HALT

Block the proposal. Rewrite it as a slug-style token. State:
1. What was wrong (decorative, no artifact binding, emoji-as-identifier)
2. The compliant rewrite
3. What system artifact it should bind to (or flag that one needs creating)

---

## Established conventions (grandfathered, never gated)

These exist and work. The guard does not retroactively question them:

- `🧭 STANDING ·` — permanent reopen-only threads
- `↪️ HANDOFF ·` — parked pickup tasks
- `🔴 DELETE ME —` — flagged for deletion
- `DUE:` — graded deliverables (URITP courses)
- `[ slug ]` — canonical/spec-bound object (NEW, adopted 2026-08-02)

Adding to this list requires Michael's explicit approval. Brain cannot grandfather a new emoji convention by declaring it "established."

---

## Scope boundaries

- **IN scope:** naming conventions, prefixes, suffixes, identifier patterns for any workspace object or file
- **OUT of scope:** emoji used as field values (labels), emoji in prose/chat, emoji in existing conventions being applied, app UI decisions
- **Does NOT block emoji entirely.** It blocks emoji AS the primary identifier mechanism in a new convention. A convention can USE emoji if the identifier is still a literal string (e.g., if Michael ever chose to add an emoji TO the bracket slug, the slug is still the anchor).

---

## Why this exists

Born 2026-08-02 from Brain proposing `📐 CANON ·` as a canonical-object prefix, which was correctly identified as decorative AI slop that prioritized visual kitsch over system architecture. The bracket-slug convention (`[ info_sheet ]`) was adopted instead because it binds the task name to its spec file, makes the canonical object self-identifying in search, and looks like a system token rather than a sticker.

---

## Changelog

- v1 (2026-08-02) — initial. Four-step test: new-vs-existing → functional token → artifact binding → case/style. Grandfathers five established patterns.
