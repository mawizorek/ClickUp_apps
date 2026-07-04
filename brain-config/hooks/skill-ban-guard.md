# Skill-Ban Guard — AI Toolkit

**Purpose:** Deterministically block a loaded skill's hard bans from reaching a commit. The Red-Team Reviewer's Professionalism lens catches ban *intent* at brainstorm; this catches the actual *bytes* at write time. Belt and suspenders, same logic as the Secrets Guard.

**Mode:** Contextual (deterministic) — fires on any repo write of skill-governed content while a skill with hard bans is loaded.

**Invocation:** Automatic. ("scan for skill bans" forces a manual run.)

**Trigger:** Before committing HTML/CSS/UI content produced under a skill that declares absolute bans (currently DESIGN-UI / DESIGN-HANDBOOK).

**Pass (DESIGN-UI ban set — grep the outgoing bytes):**
1. **Gradient text:** `background-clip:text` (or `-webkit-background-clip:text`) combined with a gradient `background`. → HALT.
2. **Side-stripe borders:** `border-left`/`border-right` > 1px used as a colored accent on cards/list-items/callouts. → HALT.
3. **Glassmorphism default:** decorative `backdrop-filter: blur(...)` on cards/surfaces. → FLAG (halt if pervasive).
4. **Pure black/white:** `#000`, `#fff`, `rgb(0,0,0)`, `rgb(255,255,255)` as bg/text. → FLAG (should be tinted neutrals / oklch).
5. **Hero-metric template / identical card grids:** structural, not grep-able — defer to the Red-Team lens, note only.
6. On any HALT hit: block the write, name the match + location, offer the compliant rewrite (solid color + weight/size for gradient text; full border / bg tint for side-stripe; etc.).

**Output:** Silent pass when clean ("skill-ban scan: clean" in the write report). On a hit: HALT with the matched pattern, location, and the compliant fix.

**Composes with / overrides:** Runs in the write chain after Secrets Guard + Size Enforcer, before the commit. A HALT blocks the write. Complements Red-Team Reviewer (intent gate) — this is the byte gate.

**Examples:**
- *Before:* headline CSS has `background:linear-gradient(...)` + `-webkit-background-clip:text`. → HALT: "gradient text is a DESIGN-UI absolute ban (line 42). Use a solid color; emphasize with weight/size."
- *Before:* alert card with `border-left:4px solid var(--accent)`. → HALT: "side-stripe border ban. Use a full border or background tint."

**Changelog:**
- v1 (2026-07-03) — initial. Byte-level enforcement of DESIGN-UI bans; born from the gradient-text miss on the fireworks-countdown build.
