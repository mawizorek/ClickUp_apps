# Memory Edit Guard

**Purpose:** Pre-write gate that validates any proposed memory edit before committing it. Prevents budget overruns, PROTECTED content loss, misplaced content, pointer breakage, architectural drift, and — the most common failure — defaulting behavioral/preference rules into `/PREFERENCES.md` when they belong in the git runtime layer.

**Mode:** Always-on (deterministic). Fires on EVERY memory write attempt with zero discretion.

**Trigger:** Any call that would create, replace, or modify content in `/PREFERENCES.md`. This includes str_replace, insert, and full-file rewrites. Does NOT fire on read-only access.

**Invocation:** Automatic. No user phrase needed. Brain runs this internally before executing the write tool.

---

## Pass (ordered checklist, all must clear)

### 0. Preference-Save Routing (FIRST gate, LOCKED 2026-07-05)

**The default home for a new behavioral / tone / format / workflow preference is the git runtime layer (`brain-config/`), NOT `/PREFERENCES.md`.** Writing such a rule into memory is the BrainMax reflex Michael has explicitly and repeatedly rejected. Before ANY memory write that adds a behavioral rule, run this routing decision FIRST:

1. **Did Michael EXPLICITLY say it goes in brain memory** ("brain mem," "save to memory," "remember this in preferences")? → memory write is authorized, continue to the rest of the Pass.
2. **Otherwise → route to git by default.** The rule belongs in its canonical hook/gate/profile under `brain-config/` (e.g. a tone/de-slop tic → the De-Slop / Voice Match hook; a reply-format rule → the Question Block hook; a memory-routing rule → this file). Commit it there.
3. **If git-vs-memory is genuinely ambiguous → PITCH it as a brain-mem addition and wait for approval.** Do not silently default to `/PREFERENCES.md`. State: what the rule is, why it might need must-fire memory placement vs a git hook, and let Michael rule.

**Rationale:** `/PREFERENCES.md` is the must-fire-every-response layer and is token-capped at 2000. The git `brain-config/` layer is the runtime home for hooks, gates, and agent profiles, is versioned, and is where behavioral rules are actually executed from. Defaulting rules into memory bloats the cap, duplicates the runtime layer, and drifts the two out of sync. Memory holds pointers + the must-fire minimum; git holds the behavioral machinery.

**Note on canonical homes:** some always-on tone hooks (De-Slop, Voice Match, Question Block) currently live as prose in the ClickUp AI Toolkit index, not yet as git files. When a tic/format rule needs to land and its hook has no git file yet, either fold it into that hook's ClickUp prose OR (Michael's call, per Fold-in Frank) stand up the git hook file. Either way, it does NOT default into `/PREFERENCES.md`.

### 1. Token Budget
- Estimate the token count of the file AFTER the proposed edit.
- Hard cap: 2000 tokens. If the edit would exceed, HALT.
- Action on halt: propose a trim (identify lowest-priority content to condense or relocate) before retrying.
- If content is valuable but won't fit: route to Extended Memory (https://app.clickup.com/36074068/docs/12cwjm-54133/12cwjm-74153, 8K cap) or Brain Reference Library as appropriate.

### 2. PROTECTED Content
- Scan for any section marked `(PROTECTED)` or `(PROTECTED, do not trim)` in the current file.
- If the edit removes, overwrites, or materially weakens a PROTECTED block: HALT.
- Action on halt: surface the specific PROTECTED content being touched, explain what would be lost, ask Michael for explicit override.
- Current PROTECTED sections: Tone & Style.

### 3. Firing-Reliability Test
- For any NEW content being added, apply the test: "Does this need to fire on every single response regardless of context?"
- YES (safety rails, the load directive, autonomy rules, protected guards, and the small must-fire tone core already PROTECTED in memory) = may belong in memory — but still clear Step 0 first.
- NO (domain reference data, conditional workflows, tool definitions, NEW tone/format tics, workflow defaults) = belongs in the git runtime layer (its hook/gate) or as a pointer to a reference doc / Extended Memory.
- **Important (2026-07-05):** a new tone or format refinement is NOT an automatic memory entry just because it's "a tone rule." Tone rules that are refinements/additions default to their git hook per Step 0. Only the already-PROTECTED must-fire tone core stays inline in memory. If content fails this test: WARN and propose the correct git/pointer home.

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
- **Memory Hygiene Review** (periodic trigger): Hygiene proposes edits; those edits still pass through this Guard before executing. Hygiene cannot bypass the Guard.
- **Precedence:** This hook has HIGHEST priority among memory-touching operations. No other tool can skip it. Step 0 (Preference-Save Routing) runs before all other checks.

---

## Examples

### Example 0: Behavioral tic defaulting to memory (the reflex this gate exists to stop)
**Proposed edit:** Add "never use the filler phrase 'and honestly'" + "always end with a copy-paste reply block" to `/PREFERENCES.md`.
**Guard result:** HALT at Step 0. Michael did not say "brain mem." These are tone/format refinements → route to their git hooks (De-Slop / Question Block), not memory. If the hook has no git file yet, fold into its ClickUp prose or pitch a git file. Do NOT write to `/PREFERENCES.md`.

### Example 1: Budget overrun
**Proposed edit:** Add a 400-token "Chicago Trip Notes" section to memory.
**Guard result:** HALT. File is at ~1734 tokens; addition would push to ~2134 (over 2000 cap). Propose: move Chicago Trip Notes to Extended Memory (project context, not must-fire). Add a one-line pointer if needed.

### Example 2: PROTECTED content removal
**Proposed edit:** Condense Tone & Style to two lines to save tokens.
**Guard result:** HALT. Tone & Style is marked PROTECTED. Cannot trim without explicit override from Michael.

### Example 3: Misplaced content
**Proposed edit:** Add detailed F1 race schedule data to memory.
**Guard result:** WARN. Fails firing-reliability test (domain reference data, not must-fire-every-response). Route to the F1 reference page in Brain Reference Library. Memory gets at most a one-line pointer.

### Example 4: Clean pass
**Proposed edit:** Update the GitHub MCP pointer URL after a page rename.
**Guard result:** All checks pass. Execute silently.

---

## Changelog

- 2026-07-05: Added Step 0 (Preference-Save Routing) as the FIRST gate: behavioral/tone/format/workflow rules default to the git runtime layer, NOT `/PREFERENCES.md`; memory only on explicit "brain mem" instruction or an approved pitch. Refined Step 3 so a new tone/format refinement is no longer auto-routed to memory. Added Example 0. Authored after Michael flagged the repeated default-to-brain-doc reflex.
- 2026-07-03: Initial version. Authored during memory consolidation session.
