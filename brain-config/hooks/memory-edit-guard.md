# Memory Edit Guard

**Purpose:** Pre-write gate that validates any proposed memory edit before committing it. Prevents budget overruns, PROTECTED content loss, misplaced content, pointer breakage, and architectural drift.

**Mode:** Always-on (deterministic). Fires on EVERY memory write attempt with zero discretion.

**Trigger:** Any call that would create, replace, or modify content in `/PREFERENCES.md`. This includes str_replace, insert, and full-file rewrites. Does NOT fire on read-only access.

**Invocation:** Automatic. No user phrase needed. Brain runs this internally before executing the write tool.

---

## Pass (ordered checklist, all must clear)

### 1. Token Budget
- Estimate the token count of the file AFTER the proposed edit.
- Hard cap: 2000 tokens. If the edit would exceed, HALT.
- Action on halt: propose a trim (identify lowest-priority content to condense or relocate) before retrying.
- If content is valuable but won't fit: route to Extended Memory (https://app.clickup.com/36074068/docs/12cwjm-54133/12cwjm-74153, 8K cap) or Brain Reference Library as appropriate.
- **Budget is relieved by RELOCATION, never by weakening enforcement language (see 2b). When over budget, the first lever is Memory-First: push substance out to docs and keep the hard rule verbatim. Softening a must-fire rule to save tokens is NOT an acceptable trim.**

### 2. PROTECTED Content
- Scan for any section marked `(PROTECTED)` or `(PROTECTED, do not trim)` in the current file.
- If the edit removes, overwrites, or materially weakens a PROTECTED block: HALT.
- Action on halt: surface the specific PROTECTED content being touched, explain what would be lost, ask Michael for explicit override.
- Current PROTECTED sections: Tone & Style.

### 2b. Enforcement-Language Preservation (LOCKED 2026-07-04)
- **The governing principle: compression is SAFE for descriptive pointers, BANNED on enforcement language.** A memory rule's reliability is a function of its explicit, emphatic phrasing. Trimming the emphasis silently converts a hard rule into a soft preference a future agent will feel free to reinterpret.
- **Enforcement language = protected from compression even when NOT inside a `(PROTECTED)` block.** Specifically, do NOT remove, soften, or "tighten away":
  - Absolutes and emphatic qualifiers: `No exceptions`, `NEVER`, `ALWAYS`, `zero discretion`, `every response`, `MANDATORY`, `HALT`.
  - Rationale clauses that encode the WHY of a must-fire rule (e.g. `Load cost < wrong-answer cost`) — they are the reason the rule survives, not filler.
  - The scope of a rule: `check 1-2 levels up`, `audit siblings`, `repo next-build-spec.md NEVER task comments`. Shortening to a vibe ("check context first") deletes the procedure and keeps only the mood.
- **What condensing IS allowed to touch:** descriptive prose, examples, redundant restatement of the SAME rule, and pointers whose full content lives in a doc. Rewording for density is fine ONLY if every absolute, NEVER, scope clause, and rationale survives byte-for-intent.
- **Test before any condense of a rule line:** "Could an agent read the shortened version as optional / discretionary / narrower when the original was not?" If yes → HALT, keep the original phrasing.
- The load-bearing sections most at risk (do not trim their teeth): the LOAD-THEN-THINK directive, Safety Rails, Autonomy, Workflow Defaults' NEVERs, Session Close MANDATORY.

### 3. Firing-Reliability Test
- For any NEW content being added, apply the test: "Does this need to fire on every single response regardless of context?"
- YES (tone rules, safety rails, the load directive, autonomy rules, protected guards) = belongs in memory.
- NO (domain reference data, conditional workflows, tool definitions) = belongs as a pointer to a reference doc or in Extended Memory.
- If content fails this test: WARN. Propose the correct tier (pointer in memory + full content in Brain Reference Library or Extended Memory) instead of the raw addition.

### 4. PROTECTED MIRROR Check
- If the edit would remove a domain pointer or tool reference from memory: verify it's not a hot-path entry that requires dual-placement.
- Hot-path dual-placement items (live in both memory pointers AND the Toolkit index) must NOT be stripped from either location.
- If the edit strips a dual-placement pointer: HALT. Explain the PROTECTED MIRROR rule.

### 5. Pointer Integrity
- Scan all URLs in the proposed final content (https://doc-page-XX, https://chat-XX patterns).
- Every pointer that existed before the edit must survive in the result, unless explicitly being retired.
- If a pointer would be dropped: WARN. Name the missing pointer and what it routes to.

### 6. No Per-Tool Memory Lines
- If the edit adds a line that references a specific tool by name with its own activation instruction: HALT.
- The Memory bridge works via ONE standing pointer to the Toolkit index. Individual tools activate via the roster on that index, not via per-tool memory entries.
- Exception: the LOAD-THEN-THINK directive itself (the master pointer) is the one allowed line.

### 7. Drift Check
- If the edit introduces behavioral rules: cross-check against the Toolkit index and Brain Reference Library for contradictions.
- If a contradiction exists: WARN. Surface both the proposed rule and the existing conflicting rule. Ask which wins.

### 8. Extended Memory Routing
- If content is being added that is:
 - Too verbose for memory (would push toward/over budget)
 - Valuable context but not must-fire-every-response
 - Project-specific standing decisions or people/relationship context
- Route to Extended Memory (https://app.clickup.com/36074068/docs/12cwjm-54133/12cwjm-74153) instead. Propose the move with rationale.

---

## Output

- **All checks pass:** proceed with the write silently. No extra output needed.
- **WARN (non-blocking):** surface the warning inline, propose the fix, proceed if fix is accepted or Michael overrides.
- **HALT (blocking):** do NOT execute the write. Surface the failing check, explain why, propose an alternative that passes.

---

## Composes with / overrides

- **Memory Write Relay** (post-failure hook): Guard fires BEFORE the write. If Guard passes and the write still fails (system error, token miscalculation), Relay handles the aftermath. They are sequential, never competing.
- **Memory Hygiene Review** (periodic trigger): Hygiene proposes edits; those edits still pass through this Guard before executing. Hygiene cannot bypass the Guard. **Hygiene is explicitly bound by check 2b: an audit/condense pass may relocate substance and reword descriptive prose, but may NOT strip enforcement language to hit budget. If Hygiene reports "trimmed to save tokens," verify no absolute/NEVER/scope/rationale was lost.**
- **Precedence:** This hook has HIGHEST priority among memory-touching operations. No other tool can skip it.

---

## Examples

### Example 1: Budget overrun
**Proposed edit:** Add a 400-token "Chicago Trip Notes" section to memory.
**Guard result:** HALT. File is at ~1734 tokens; addition would push to ~2134 (over 2000 cap). Propose: move Chicago Trip Notes to Extended Memory (project context, not must-fire). Add a one-line pointer if needed.

### Example 2: PROTECTED content removal
**Proposed edit:** Condense Tone & Style to two lines to save tokens.
**Guard result:** HALT. Tone & Style is marked PROTECTED. Cannot trim without explicit override from Michael.

### Example 2b: Enforcement-language trim (the audit trap)
**Proposed edit (from a Hygiene/condense pass):** Shorten the load rule from "before ANY response ... No exceptions ... Never compose from memory alone ... Load cost < wrong-answer cost" to "load the index before responding."
**Guard result:** HALT (check 2b). The shortened form reads as discretionary ("before responding when relevant") and drops the rationale clause that keeps the rule alive. Budget must be relieved by relocating substance to docs, not by softening a must-fire directive. Keep original phrasing.

### Example 3: Misplaced content
**Proposed edit:** Add detailed F1 race schedule data to memory.
**Guard result:** WARN. Fails firing-reliability test (domain reference data, not must-fire-every-response). Route to the F1 reference page in Brain Reference Library. Memory gets at most a one-line pointer.

### Example 4: Clean pass
**Proposed edit:** Update the GitHub MCP pointer URL after a page rename.
**Guard result:** All checks pass. Execute silently.

---

## Changelog

- 2026-07-04: v2. Added check **2b Enforcement-Language Preservation** (compression safe for descriptive pointers, BANNED on absolutes/NEVERs/scope clauses/rationale, even outside PROTECTED blocks). Tied Token Budget relief to relocation-not-weakening. Bound Memory Hygiene Review to 2b so periodic audits can't silently strip a rule's teeth. Learned when a proposed condense of the load rule + Workflow Defaults would have softened must-fire directives into preferences.
- 2026-07-03: Initial version. Authored during memory consolidation session.
