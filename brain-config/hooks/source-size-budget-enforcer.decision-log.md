# Source-Size Budget Enforcer — Decision Log

> **How to use this page.** Format and reply rules follow the **Decision Logs — Gold Standard** (ClickUp ▸ Brain Reference Library). Two things never to forget: (1) **checkbox polarity is INVERTED** — a CHECKED `[x]` box = REJECTED; the answer is what stays UNCHECKED; (2) the agent always **READS BACK** the decoded answer before acting. Newest block on top.
>
> **Item this log documents:** `brain-config/hooks/source-size-budget-enforcer.md`. That file is the canonical descriptor (the WHAT); this log holds the WHY.

---

## Q1 · 2026-07-26 · What are the real size targets for the three canonical files?

The Floor Rule (v5) says a target must sit above the floor and that a never-met target is rot. It does not pick the replacement numbers, because that is a judgment call with tradeoffs. Three files need one.

Measured at HEAD 2026-07-26, floors computed as rows × minimum honest row:

| File | Now | Rows | Floor | Current target | Ever met? |
|---|---|---|---|---|---|
| `VERSIONS.md` | 13.7KB | 24 apps + infra | ~9-10KB | ~12KB | **No** |
| `super-agents/roster.json` | 19.4KB | ~38 agents | ~11-12KB | ~12KB | **No** |
| `super-agents/_shared/super-agent-base.md` | 21.7KB | prose (a constitution) | n/a | none stated | n/a |

Note the roster: **its floor and its target are the same number**, so the target permits zero growth on the file whose entire job is registering new agents.

**A. `VERSIONS.md` — pick a target.**

- [ ] **~16KB target, 22KB ceiling** (trim to ~12KB now so headroom is real) — Sally's recommendation
- [ ] Keep ~12KB and accept permanent violation as "aspirational"
- [ ] ~18KB target, no trim, live with less headroom
- [ ] Drop a column (the `Status` column largely duplicates the version cell)
- [ ] Other — see note

**B. `roster.json` — pick a target AND a lever.** Its floor is the current target, so a number alone will not fix it. Available levers: drop the `accent` field (~1KB, cosmetic, used only by `roster.html`), drop per-row `from` lineage prose (~2KB, recoverable from git history), or raise the target.

- [ ] **Drop `accent` + `from`, target ~14KB, ceiling 22KB** — the only lever that deletes no agent
- [ ] Raise the target to ~20KB and change nothing (leaves ~2KB to the ceiling)
- [ ] Keep both fields, raise to ~20KB, and accept the roster will hit the ceiling within a few graduations
- [ ] Other — see note

**C. `super-agent-base.md` — confirm the split.** At 21.7KB against the ~22KB ceiling this is the one genuine emergency: ~300 bytes from unreadable, and unreadable means unwriteable. It is prose WITH clean concern seams (identity / memory model / load contract / lifecycle), so the normal split path applies rather than a trim. Felix flagged it as Dexter's on the session board.

- [ ] **Dexter splits it by section, next session, before anything else touches it**
- [ ] Trim instead of splitting (keep one file)
- [ ] Leave it and accept the risk
- [ ] Other — see note

*Notes:*

<hr/>

## J1 · 2026-07-26 · Floor Rule added to the hook (v5) — a fold-in, not a new tool

**Decision:** the finding that three canonical files sit over a size target none of them has ever met is documented as a **new section in the existing Enforcer hook (v5)**, not as a new tool.

**Fold-in Frank's verdict: FOLD-IN → `hooks/source-size-budget-enforcer.md`.** The hook already carried the base64 multiplier, the ~22KB ceiling, the failing-not-warning step, the prose-vs-rows growth tell, and both 2026-07-25 casualties as worked examples. A net-new "size reconciliation" tool would have duplicated a v4 document written two days earlier — the B12 pattern (designing what already exists), avoidable with one directory listing.

**The real gap was narrow:** v4 gave a CEILING and never gave a FLOOR, so the 12KB target had no way to be wrong. A prescription that cannot fail is precisely what rots (`doc-rot-sweep` lineage). The fix is the Floor Rule plus the enforceable clause: **a stated target never once met is rot, not aspiration — fix the number, and never delete a live warning or security flag to hit a byte count.**

**Size Sally's contribution:** the floor arithmetic (rows × minimum honest row), which is what proves the roster's target was a freeze rather than a budget.

**Second fold-in, same PR:** the missing size clause in `hooks/readme-app-plan-standard.md` landed as a **one-line pointer** to this hook, not as its own budget language. Two places stating byte numbers is two places for them to rot apart — the same two-claimants-on-one-truth problem that retired `app-index.md`.

**Not convened:** the full seven-lens Workshop. Frank returned FOLD-IN on an in-place correction to an existing hook, and the doc-rot protocol says fix in the same pass. Had he returned NET-NEW the seven would have seated before a line was written.

**Self-application, disclosed:** the first v5 draft pushed this hook to 14.2KB, over its own ~12KB target — the exact defect it names. Trimmed to ~11.8KB in the same pass rather than shipping a rule violated by the document stating it.

**Reflected on item descriptor:** yes — `source-size-budget-enforcer.md` v5, Floor Rule section + Pass step 8 + changelog.

**Source:** Michael's "ok doc it" 2026-07-26, following the size escalation surfaced at the PR #543 merge. Per-voice deliberation: session task *Maestro Mira (Opus 5) · F1 app v7 rebuild — schema validation · Jul 25*.

<hr/>

> **Blank starting point.** New blocks go ABOVE this line, newest on top.
