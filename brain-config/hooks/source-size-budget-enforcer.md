# Source-Size Budget Enforcer — AI Toolkit

**Purpose:** Keep committed source files inside the readable/maintainable budget so Brain can always read a file back whole and modular structure stays the default.

**Mode:** Contextual (deterministic) — fires on any repo write.

**Invocation:** Automatic. ("check the size budget" forces a manual run.)

**Trigger:** Before committing any source file to `mawizorek/ClickUp_apps`.

**Pass:**
1. Measure the outgoing file size.
2. Compare against the budget: **~10–12KB target**, **~15KB soft split threshold**, **~30KB hard read cap** (the MCP read path clips silently past ~30KB — anything Brain must read back whole MUST stay under it).
3. **Under 15KB:** pass, no note needed.
4. **15–30KB:** pass with a flag — "over the semantic-source target, consider splitting into modules by concern."
5. **Over 30KB:** HALT the standard write. This file cannot round-trip through the read path and MUST NOT go through `create_or_update_file` (corrupts + clips). Route to: (a) split into a `/source` chunk set (≤~22KB chunks + `_index.md`), or (b) user uploads via GitHub UI. Never push an over-cap file through the MCP write tool.
6. Confirm `.nojekyll` is present at repo root on any new-app commit.

**Output:** Silent pass when under target. Flag when 15–30KB. HALT + split/upload routing when over 30KB.

**Composes with / overrides:** Runs after Secrets Guard, before the commit. Defers to the GitHub MCP Operating Standard for the split/chunk mechanics.

**Examples:**
- *Before:* new `index.html` measures 41KB. → HALT: "41KB, over the 30KB read cap. This can't go through the write tool safely — split into a /source set or upload via the GitHub UI."
- *Before:* a module measures 18KB. → PASS + flag: "18KB, over the 12KB target but under cap. Fine to ship; worth splitting by concern next pass."

**Changelog:**
- v1 (2026-07-03) — initial. Budget: 10–12KB target / 15KB soft / 30KB hard cap.
