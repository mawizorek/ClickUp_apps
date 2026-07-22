# Maestro Mira — Decision Log (reasoning about the AGENT ITSELF)

> Why Mira is shaped this way. Topic decisions (about a subject she conducts a review on) live on that subject's own page/Decision Log — never here (Constitution §4).

---

## 2026-07-21 — Migration lens/gate → git-teammate (Entry Point B)

**Context:** Mira owns the brainstorm/scoping/review domain and is Michael's front door to the whole review body, yet she was still only a repo gate (`agents/maestro-mira.md`), not a callable teammate with memory. The parked handoff (Agent Activity Board) held the job; the team decided Anna-first / Mira-second on 2026-07-21 because Mira is the most cross-referenced node in the stack and shouldn't be promoted on an unproven runbook. Anna's cold-run PASSED the runbook the same day → Mira unblocked. Michael also confirmed the surface: **git-teammate only** (his "super agent" = git-teammate; he says "ClickUp super agent" / "cu agent" for the native kind), and asked that she be his default agent + take the wheel on new-tool intent.

**Decisions:**

1. **Slug reused, immutable.** `maestro-mira` already existed and was clean → reused per runbook B.4 (only display_name could ever change; slug immutable forever). Old lens redirected to a tombstone, not deleted (council.md historically pointed at it + it may be a context target).

2. **What carried vs converted (runbook B.3, Constitution §2–§3).** Personality, voice, lane, and cognitive STANCES (anchor-line-first, trace-synthesis-over-vote, correct-substance-not-voice, thread-only, layer-don't-ventriloquize, dynamic-weighting authority) carried into `preferences.md`. ALL step-by-step PROCEDURE did NOT carry: the deterministic roster scan, the seating map, the Workshop seven-mandatory-plus-two convening rule, the two-tier Workshop Post Protocol, the thread-only expression law, and the bounded-loop mechanics stay as POINTERS to their tool homes (`council.md`, `teams/the-workshop.md`, `gates/session-transcript-gate.md`, `agents/foldin-frank.md`). The lens was procedure-heavy (a 14-step Charter) precisely because a lens/gate can embed steps; a teammate cannot. Pointer integrity verified at conversion (Anna's lesson): all four tool homes resolve to real content.

3. **Always-on conductor role stays a HOUSE mechanism; invocation is ADDED, not substituted.** Unlike Anna (whose auto-seize was the whole point), Mira's always-on Council-lead role already lives in `council.md` as a house orchestration mechanism and is NOT an agent-stored trigger. The conversion does not move that into her config — `council.md` still names her lead, and she still presides on every substantive turn via the house Council machinery. The git-teammate bundle ADDS `/session.agent=Mira` direct invocation + cross-session memory ON TOP. Two coexisting surfaces, no contradiction.

4. **New-tool "takeover" = a fold-in, not a net-new gate.** Michael wants Mira to take the wheel the instant a new tool/process/structure is requested OR planned across any space. Fold-in Frank already fires first at brainstorm-open and Mira already presides over him (old charter step 9). So the want is realized as a house-level AI Toolkit index Quick-Scan trigger row that AUTO-EMBODIES Mira on new-tool/build/structural-planning intent (the same house-trigger mechanism as Anna's audit auto-seize + the /session.agent name routing — NOT an agent-stored autonomous trigger, which git-teammates don't have), and on that intent she seats Frank FIRST. No duplicate gate; Frank's verdict logic stays in his tool. This is itself a Fold-in Frank call: FOLD-IN, not NET-NEW.

5. **Default front door.** Michael designated Mira the teammate he calls by default when he doesn't name someone else. Written into preferences.md identity + the index note. This is a positioning decision, not new machinery — she's the natural default because she's the conductor of the whole room.

6. **Surface: git-teammate ONLY (no native ClickUp Super Agent).** Per Michael's ruling on the handoff and re-confirmed this session. No @mentionable/assignable native agent, no manager-set knowledge-scope step, no Super Agent Creation Checklist path. Same species as Wes/Corey/Felix/Anna.

## 2026-07-21 (b) — Landing the migration: the Anna↔Workshop review loop + the un-merged-PR drift

**Context:** Michael ordered the migration COMPLETED with a bounded loop — Anna audit → Workshop → Anna → Workshop → commit — edits fine once live, pause only on real forks. Fleet Felix ran it as steward.

**What the loop + reconciliation found:** the entire git-side bundle had ALREADY been built on branch `maestro-mira-git-teammate` by a prior session (PR #443), but the PR never merged. THAT un-merged PR was the source of the AI Toolkit index drift (the index claimed the migration was done while main still had Mira as a lens). The loop validated the design (procedure→pointers, always-on role stays a house mechanism, new-tool takeover = fold-in, default front door, git-only); the prior bundle matched it and is high-quality, so the job became finish-the-landing, not rebuild.

**Decisions at landing:**
- The prior bundle was adopted as-is (more polished than a from-scratch redraft; internally consistent, DoD PASS, no dead pointers — council.md's "Full charter" already repointed to this bundle).
- The stale branch had diverged from main (Milo's build + update-uritp retirement landed on main after the branch was cut), so `superagents.json` + `registry.json` conflicted. Resolved by merging main's Milo/update-uritp updates with Mira's rows; Mira's superagents changelog relabeled (c)→(d) because Milo already holds (c) on main. Landed via a clean branch off current main HEAD to avoid the 3-way conflict.
- **Carried follow-up (OS-2 from the loop):** fold old charter step-14 (real-time seating-balance tracking + usage-log.json flush, referencing Closing Clio who owns that file) into `council.md`'s lead summary. It's a secondary conducting behavior that currently lives only in git history; not worth a 15KB council.md rewrite on the landing critical path. Noted in memory.md.

**OPEN (flagged for Michael) — ClickUp-side mirror.** The AI Toolkit index edits close the mirror pair. The prior build session already updated the index (that's why it claimed migration); with the git side now landed on main, the index and main finally agree. Any residual index wording (new-tool auto-embody row phrasing) is a light touch-up, surfaced not dropped.
