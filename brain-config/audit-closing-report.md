# Audit Closing Report — format spec (v0.6)

> **Steward:** Audit Anna (`super-agents/audit-anna/`). **Status: PERSONAL PRACTICE, pre-template.**
> This is Anna's signature end-of-audit handoff, given its own git home 2026-07-21 so her profile can
> POINT at it instead of carrying the full spec (Constitution §2–§3). It is NOT yet a blessed
> workspace template — Anna runs it to prove the shape; Michael graduates it. Until then it stays a
> single-steward format, not a house standard other agents are held to.
>
> Why a git home and not the profile: the deep template is PROCEDURE-shaped (a fixed output
> structure), which does not belong in an agent's behavior file. Why not force it to a full workspace
> template yet: it is still incubating (the lens→teammate migration explicitly flagged that promoting
> an in-practice format prematurely is wrong). A single-steward reference doc is the correct middle
> home — real, versioned, pointed-at, but not over-promoted.

---

## When Anna uses it

At the close of any audit, as the handoff so a SEPARATE edit agent (or Michael) can act without
re-deriving. It is her ANSWER (Rule 4: the report IS the response, no redundant re-summary after),
and it auto-logs to the session task (Rule 3). The per-turn working view does NOT get the `=`
boundary — that's reserved for the final Closing Report so the handoff stands out.

## Render rules (Rule 2 — mobile-safe)

Wrapping markdown only. Bounded top and bottom by a solid `=` rule. **No ``` fence and no wide
table** (both overflow/clip on mobile). Edit queue = a numbered list of wrapping lines. (Fences stay
correct for commit messages, raw URLs, paste-into-editor snippets — not for this.)

---

## Template

`==================================================`  
**🔍 AUDIT ANNA — CLOSING REPORT**  
**Subject:** <x> · **Date / session:** <date> · <session task link>

**True purpose (confirmed):** <one-line root purpose>  
**Verdict:** <clear picture reached | still open — N surfaces>

**Edit queue** (each item stands alone):
1. `[Now]`/`[Pass-2]` <action> — serves purpose: ✓/✗/~ — <why> · owner: <x>

**Do-not-touch** (healthy as-is, do NOT "fix"):
- <thing> — <why intentional>

**Open / blocked on Michael:**
- <question / pending Decision-Log answer>

**Provenance:** <page> · <Decision Log> · <session task>  
`==================================================`

---

## Why the shape holds

- **Purpose + verdict up top** — the edit agent inherits the anchor + the completeness state before reading a single action.
- **Edit queue "serves purpose?" column** — makes an edit agent prune WITH intent, not mechanically.
- **Do-not-touch** — the piece a plain flag-list omits. It protects healthy quirks from a well-meaning over-correction (an audit that only lists problems invites over-correction). This block proved its worth immediately on first real runs (caught inverted-polarity as protect-not-fix).
- **Open / blocked** — gates unsafe edits behind a human answer.
- **Provenance** — saves the edit agent a re-find.
- **The `=` boundary** — makes it a distinct artifact without a clipping fence.

## Refinement log (condensed)

v0→v0.6 (2026-07-17): established the shape and hardened it through real runs — DO-NOT-TOUCH proved
its worth immediately, the report caught a self-introduced defect, then format hardened to
mobile-safe + `=`-bounded + no-echo + auto-log, and confirmed as the OUTPUT of a defined protocol
run (not a free-form lens). v0.6 (2026-07-21): extracted from the lens into this stewarded git home
on Anna's lens→teammate migration; content unchanged, just rehomed + pointed-at. *(Detailed history
lives in git + the lens tombstone `agents/audit-anna.md`.)*

## Open question (for graduation)

Does the edit queue need a severity column, or do `[Now]`/`[Pass-2]` + serves-purpose already carry
it? Resolve before promoting to a house template.
