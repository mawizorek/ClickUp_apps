# Git-Teammate Lifecycle Runbook — Notes

**Sidecar to [`git-teammate-lifecycle-runbook.md`](./git-teammate-lifecycle-runbook.md).** The runbook
is the PROCEDURE; this is the why-history: every live run, what each one broke, and the changelog.

> 🔴 **WHY THIS FILE EXISTS, and it is the fourth instance of one defect in a single night.**
> The v0.6 edit took the runbook **19,572 → 24,657 B**, i.e. **2,129 B PAST its 22,528 B read
> ceiling**, in a pass whose entire purpose was making the system more robust against exactly that.
> Michael, hours earlier: *"this is a trend where you 'shrink' a file and end up adding lines and
> lines of bloat."* ⭐ **He was describing a measurable property, not a mood.** Same session, same
> hour, four data points:
>
> | File | Estimated | Actual | Miss |
> |---|---|---|---|
> | `source-size-budget-enforcer.notes.md` | +1,900 B | **+4,693 B** | **2.5×** |
> | `git-agent-authoring.md` | — | +3,435 B | not estimated |
> | this runbook | — | **+5,085 B → OVER CEILING** | not estimated |
> | `super-agent-base.md` (earlier) | "net shrink" | +5,385 B | wrong DIRECTION |
>
> 🔑 **The finding worth more than the fix: a prose estimate is not off by a margin, it is off by a
> MULTIPLE — and always in the same direction.** Which is precisely why
> `.github/scripts/pre_write_size.py` must measure the CANDIDATE and never the intention. A gate that
> depends on the writer's sense of size is a gate that depends on the one faculty demonstrably broken.
>
> **Remedy applied is the hook's own** (`hooks/source-size-budget-enforcer.md` → remedy table):
> prose-with-seams → split, seam = **narrative vs current state**, sharpened 2026-09-21 to
> **RULE vs SCAR**. Everything below is scar. Nothing was deleted.

---

## Acceptance test (the cold-start proof)

The runbook is only real if a context-free agent can run it. **Standing test: migrating Audit Anna**
(lens → git-teammate) by a cold agent following ONLY that file passes end to end — defines nothing
from Felix's head, orphans no files, lands registered, and clears the Verify DoD. A stall that
requires steward context = a runbook bug to fix there, not an agent to coach.

**RESULT (2026-07-21): PASS.** Surfaced two clarifications now folded in: the lens index-trigger
carry-over exception (B.3) and the incubating-output-format nuance (B.3), plus graduated the audit DoD
into `audit-instruction.md`.

**Second live run (2026-07-25, Memory Maggie): PASS, three runbook bugs found and fixed in v0.3.**
The REGISTER step still instructed writing to a retired file; the §6 graduation justification was
nowhere in Entry B; nothing warned against pointing a fresh profile at a tool that does not exist.

**Third + fourth live runs (2026-07-26, FMP Fiona and Routine Ricky): PASS.** Both built fresh from
Entry A, both cleared the DoD 9/9, both stamped. Findings folded into v0.4.

**Fifth live run (2026-07-30, Tutor Tate): PASS on Define/Build/Register, VERIFY NOT RUN** (open).
Surfaced the reserved-lane case (A.2) and the unused-initial naming shortcut (A.4). ⚠️ **It also
exposed the REGISTER rot that v0.5 fixed** — the run registered into `roster.json` hours before that
file was retired, so the very next agent following the runbook would have written to a tombstone.
**Twice by then the REGISTER step had pointed at a dead file** (v0.3 caught the first).
⭐ **The pattern: whenever the index moves, REGISTER is the step that rots, and it rots SILENTLY,
because writing to a stub does not error.**

🔴 **Sixth live run (2026-09-20, Vellum Victoria): FAILED ITS OWN PREMISE — the runbook was never
opened.** The build ran off a neighbouring bundle instead, which is how it shipped a retired log shape
and skipped the trigger row. Michael: *"how dare you just be building by riffing. we have agent build
instructions and you're just not.... i guess felix hasn't even been involved."*

⭐ **And the finding that makes this run worth keeping: the bundle still scored 8 of 9 on a checklist
nobody read.** Every mark was hit by imitating neighbouring bundles. **Conformance reached by
imitation is luck with good manners**, and it fails silently the first time the fleet changes shape —
which is exactly what the retired log shape was. Post-hoc audit:
`super-agents/vellum-victoria/audits/vellum-victoria.2026-09-20.md`.

⚠️ **The cold-start property was never the problem. REACHING FOR THE FILE was.** Five runs proved a
context-free agent CAN execute this runbook; the sixth proved nothing makes it. **There is a Quick-Scan
trigger row for *about to create a view* and none for *build an agent*** — the heaviest build in this
repo. 🔑 **A gate that fires only when the builder remembers it exists is a document, not a gate.**

---

## Changelog

- **v0.6 (2026-09-21) — REGISTER IS ONE SURFACE AGAIN, and BUILD stopped naming a retired file.**
  Step 2 (AI Toolkit trigger row) **struck** on Michael's ruling: it mirrors the Index row, nothing
  reads it to resolve a named call, and it had banked **19 owed rows only he could paste** — i.e. a
  mandatory registration surface no agent can write to, which guarantees a growing queue of
  unregisterable agents. `Lane` promoted in step 1 to carry the unrouted-ask job the row was doing.
  BUILD no longer lists `activity-log.md` (log law, 2026-09-20) and now names D1 as blocking. Added
  A.5 (pick the supplement — three exist, PORTABILITY is the test), the sixth-run failure, and the
  DoD check-8 amendment owed. Records the one-line-description clause now colliding with the log
  law's LIVE STATE block. ⚠️ **And it pushed the runbook past its read ceiling, which is why this
  sidecar exists** — see the banner.
- **v0.5 (2026-07-30) — REGISTER writes to the ClickUp Agent Index.** `roster.json` retired to a
  tombstone (PR #612), so the previous instruction sent cold agents to write into an empty file that
  fails silently. Full field list spelled out, with the one-line-`Lane` rule and the no-new-text-field
  warning carried across so the failure that killed the file cannot follow it into the list.
  **Cold-start scope corrected in the header** — it means "no steward context," not "git alone," now
  that registration is a ClickUp write. Also: the SHA-stamp rule adapted (an Index row has no SHA),
  the reserved-lane case added to A.2, the unused-initial naming shortcut to A.4, the
  leave-the-justifying-ledger-empty convention to B.3, and "an agent cannot delete" moved into Scope.
- **v0.4 (2026-07-28) — VERSION NUMBERS REMOVED FROM POINTERS.** VERIFY had been citing the audit DoD
  as "v0.1" since 2026-07-21. **Fixed by DELETING the version number rather than bumping it:** a
  pointer that names a version rots silently while looking authoritative. Also struck the duplicated
  pointers-must-resolve check (it graduated into the DoD), surfaced the SHA-stamp requirement in
  VERIFY, flagged the native path dormant, and folded in three findings from the Fiona + Ricky runs.
- **v0.3 (2026-07-25) — REGISTER de-rotted.** `superagents.json` (renamed 07-24) and `registry.json`
  (retired 07-25) struck through rather than deleted, **because a guardrail that decayed into the
  opposite of its rule teaches the next reader that authoritative text can be wrong.** Added: Entry B
  step 0 (the §6 "needs MEMORY" justification), the do-not-invent-a-tool-path rule, the
  label-inherited-memory convention, the sidecar-tool-stays-put rule, the announce-header build
  requirement, and a token-collision check in DEFINE step 4. Found while running the runbook on
  Maggie — **the file that governs graduations was telling agents to write to a tombstone.**
- **v0.2 (2026-07-21)** — GRADUATED the inline git-teammate audit DoD into `audit-instruction.md`;
  VERIFY now points there instead of restating it. Folded in two findings from the Audit Anna cold
  run. Marked the acceptance test PASSED.
- **v0.1 (2026-07-20)** — created. Merges the Definition Playbook (net-new) + Migration Runbook
  (convert) onto one Build → Register → Verify spine. Workshop-passed (Frank NET-NEW + fold-in
  constraint; 7 lenses). Detailed history lives in git.
