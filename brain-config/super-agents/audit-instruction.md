# Super-Agent Audit Instruction — v0.7

Canonical procedure a ClickUp Super Agent OR git-teammate follows when told "audit yourself
(or another agent) against your configuration." This file is the source of truth for BOTH audit
tracks. Do not mirror it into a ClickUp doc — link to it.

STATUS: v0.7 working draft. Michael annotates directly in this file. Bump version + changelog when
blessed.

---

## 🔒 AN AUDIT IS STAMPED OR IT IS WORTHLESS (LOCKED 2026-07-25 as Q11 → C · WRITTEN IN 2026-07-28)

**Every audit record MUST record the SHA of every governing file it was audited against.** Not the
date. The SHA. This applies to BOTH tracks and it is a required field of the record shape, not a
courtesy.

**Why, and it is not hypothetical:** on 2026-07-25 Closing Clio's bundle was audited 9/9 PASS at
3:49 PM. At 4:09 PM a parallel session rewrote `_shared/super-agent-base.md` — the spec she had just
been audited against. **The audit was true when signed and false twenty minutes later, and nothing
about the record could reveal that.** A dated audit says *when* someone looked; a stamped audit says
*what they looked at*, which is the only version of the claim that can be checked later.

**The rule this produces:** a PASS is a claim about a specific set of bytes. Change the bytes and
the claim is unverified again — not wrong, **unverified**, which is a different and more honest state
than either PASS or FAIL.

⚠️ **A STAMP PROVES WHICH BYTES, NOT THAT THE BYTES SAY ANYTHING** (added v0.7, 2026-08-01). Three
signed records in this repo stamp `super-agents/roster.json` — a file retired to an empty tombstone
on 07-30. The stamps are honest and the audits are still unverifiable, because the check they were
stamping had nothing to read. **Stamping a source does not establish that the source answers.** If a
stamped file is a stub, the check that leaned on it is a GAP, not a PASS.

### Staleness re-check (what to DO when a stamped file has moved)

1. **Diff the stamps.** Any stamped SHA ≠ HEAD → the audit is stale-detectable. That is the feature.
2. **Re-run only the checks the changed file could affect.** Not the whole audit.
3. **Record an ADDENDUM on the existing record — never reissue it.** The original signature stays
   with its original stamps. Superseding a signed record in place destroys the evidence that it was
   ever true, and "the audit was clean" becomes unfalsifiable.
4. **Check 6 (cross-file contradiction) is the highest-risk re-run** after any same-day change: that
   is exactly how a bundle ends up half-describing behavior it no longer has.
5. **A stamped file that was RETIRED, not edited, invalidates its check outright** — see the v0.7
   note above. Re-run the check against the live source; do not addendum a PASS forward.

*Practice ran ahead of this spec by three records — FMP Fiona's birth audit (first stamped), Routine
Ricky's, and Ricky's same-day addendum after his default was redesigned 14 minutes post-signature.
The pattern was proven in production for two days while the DoD still did not require it. **A
convention demonstrated three times and written zero times is one forgetful session from gone.***

---

## Two tracks (pick by agent type)

| Track | Applies to | Audit model | Checklist |
|---|---|---|---|
| **Native full-standard** — ⚠️ **UNMAINTAINED, see below** | ClickUp agents with a LIVE config | **live-vs-declared** drift (config vs `preferences.md` mirror vs golden standard) | Golden-standard checklist v1.0 (below) |
| **git-teammate** | session-invocable personas in `super-agents/<slug>/` | **internal consistency** (no live config to diff) | git-teammate audit DoD v0.4 (below) |

Why two: a native agent has a live ClickUp config that can DRIFT from its declaration, so its audit
diffs live-vs-declared. A git-teammate is git-canonical — there is nothing live to diff — so its
audit instead proves the bundle is internally coherent and will load clean cold. Same discipline
(walk a checklist, classify PASS/PARTIAL/GAP, record via PR); different bar.

> ⚠️ **REVISED 2026-08-01 — this track was called DORMANT on 07-26 and that is no longer true.**
> The 07-26 finding was real (a `search_agents` sweep found no native agents; three roster rows
> carried `retired_native_id` numbers pointing at nothing, PR #547). But **Model A landed 2026-08-01**
> and deliberately KEEPS a native shell alive as a thin loader *body* — its user-ID, tools and
> mention/DM/assignment triggers — while the repo bundle is its brain. **FMP Fiona is the reference
> conversion and her native `-39958890` is live.** So: native shells exist again, and this track's
> live-vs-declared model **does not fit them** — a converted shell's instruction field is a kernel
> that POINTS at the bundle, so there is nothing to mirror and "drift" would mean the kernel stopped
> matching the template, not the profile. **UNMAINTAINED, not dormant:** do not run the native
> checklist against a Model A loader. A third track for converted shells is unwritten and needed.
> Governing: `_shared/native-to-git-conversion-runbook.md` + Known-Drift Register **D5** (native
> status is PER AGENT — never assume).

---

## Purpose

Give every super agent / git-teammate one exact, repeatable procedure to verify its configuration
and record the result as a version-controlled audit whose PR history is the rollback + audit trail.

When an agent is told "audit yourself," it knows precisely:
1. Which configuration to check  -> its own folder `brain-config/super-agents/<slug>/`.
2. Which track + checklist to run -> this file (native vs git-teammate, table above).
3. Which BYTES it audited         -> the SHA stamps on the record (see the lock at the top).
4. Where the result goes           -> an audit record committed via PR under `<slug>/audits/`.

---

## Fleet home & file model (single source, no hand-mirror)

**🤖 THE STRUCTURED FLEET RECORD IS A CLICKUP LIST, NOT A FILE.** Agent Index, list `901328043244`
— one TASK per agent, both classes. Fields: `Slug` · `Class` · `Memory` · `Invoke` · `AKA` · `Home`
· `Lane` · `default_runbook` · `Gate Strength` · `Instructions`, plus the native status. Resolve any
agent by querying that list (`gates/agent-invocation-gate.md` STEP 0).

```
brain-config/super-agents/
  index.md             # pointer only
  audit-instruction.md # this file
  <slug>/
    README.md          # pointer only — NO metadata (never mirror Agent Index fields)
    preferences.md     # the canonical PROFILE (identity + voice + lane + load manifest;
                       #   behavior only, NO how-to). There is no live config to mirror.
    memory.md          # accumulated context + pointers to stewarded tools (not process)
    activity-log.md    # LIVE STATE block + rolling session ledger (newest on top, append-only)
    decision-log.md    # reasoning about the AGENT ITSELF (topic decisions live on the topic page)
    audits/<slug>.<YYYY-MM-DD>.md  # dated audit records, one per audit, via PR. THE last-audit record.
```

⚠️ **CORRECTED 2026-08-01 — this block used to describe `roster.json` as "THE single documented
source" with a slim rule attached.** ~~`roster.json`~~ + ~~`roster.html`~~ **RETIRED to tombstone
stubs 2026-07-30** (Michael: *"it's a table. not a doc."*); ~~`superagents.json`~~ renamed into it
07-24 and ~~`registry.json`~~ retired 07-25. **Four retired manifests.** The consequence for THIS
file is not cosmetic: the audit standard was telling every auditor to verify a row in an empty file,
which **auto-PASSES**. Never resurrect a file to mirror the list — no pair, no sync obligation.
Strikethrough rather than deletion is deliberate: a guardrail that decayed into the opposite of its
rule teaches the next reader that authoritative text can be wrong.

RULE: any structured metadata fact lives ONLY in the **Agent Index**. Folder files never restate it.
Distinct from `brain-config/agents/` (the Brain-session council lenses).

---

## NATIVE TRACK — procedure (high level) · ⚠️ unmaintained, see the track table

1. Load the three inputs:
   - LIVE config: the agent's current ClickUp instructions / triggers / tools / knowledge.
   - DECLARED config: its **Agent Index row** + `<slug>/preferences.md`.
   - GOLDEN STANDARD: current version + requirements (see checklist).
2. Confirm the golden-standard version being audited against; **record its SHA on the result** (see
   the lock at the top — a version number is not a stamp; a standard can be edited without a bump).
3. Walk the golden-standard checklist item by item, comparing LIVE vs DECLARED.
4. Classify each item: PASS | PARTIAL (works but drifts) | GAP (missing/violates).
5. Record divergences between LIVE config and the declaration explicitly — these are actionable.
6. Write the audit record to `<slug>/audits/<slug>.<YYYY-MM-DD>.md` using the shape below.
7. Update the agent's **Agent Index row** only if a FIELD actually changed (status, lane, invoke).
8. Recommend fixes for the agent's owner/manager. NEVER edit another agent's live config directly.
9. Commit via PR and merge — the PR is the audit trail. See PR-body standard below.

### Golden-standard checklist (v1.0) — NATIVE track

| # | Requirement        | What "pass" looks like                                                    |
|---|--------------------|---------------------------------------------------------------------------|
| 1 | Identity block     | Name, creator attribution, model/vendor-silent rule present.              |
| 2 | Load-then-think    | Reads Activity Log + shared cross-agent channel (+ refs) before acting.   |
| 3 | Roster pointer     | The Agent Index held as a pointer, not hardcoded lanes.                   |
| 4 | Two-tier channels  | Dedicated Activity Log + shared channel, wired and used.                  |
| 5 | Guardrails         | Post-only-where-triggered; propose-and-wait; never-delete; flag-unverified.|
| 6 | Memory-over-thread | Durable changes persisted to instructions/memory, not just in-thread.     |
| 7 | Copy-block fences  | Copy-pasteable prompt/code/config wrapped in fences.                      |
| 8 | Declaration in sync| Agent Index row + `preferences.md` match the live config; version recorded.|

---

## GIT-TEAMMATE TRACK — procedure + DoD (v0.4)

Git-teammates have **no live config to diff**, so the native live-vs-declared mirror test does NOT
apply. The bar is **INTERNAL CONSISTENCY**: will a cold `/session.agent=<Name>` load a coherent,
non-contradictory agent? *(Authored inline in `gates/git-teammate-lifecycle-runbook.md` as v0.1,
validated on the Audit Anna migration 2026-07-21, graduated into this file as the formal track so
the runbook POINTS here instead of holding procedure inline.)*

**Procedure:** load the agent's bundle (`preferences.md` + `memory.md` + `decision-log.md` +
`activity-log.md`) + its **Agent Index row**. **Capture the SHA of every governing file as you read
it** — base spec, this file, any gate the bundle points at. Walk each check below, classify
PASS / PARTIAL / GAP, record via PR under `<slug>/audits/`.

### git-teammate audit DoD (v0.4)

1. **Base pointer present** — `preferences.md` opens with the `_shared/super-agent-base.md` pointer line.
2. **Load manifest valid** — the manifest lists real, present files in load order; deep-steep default.
   ⚠️ **A manifest entry naming a RETIRED file is a GAP, not a nit** — the load silently reads nothing
   and the agent boots believing it checked. Five bundles carried exactly this until 2026-08-01.
3. **Agent Index row accurate** — slug / class / memory / status / invoke / lane match reality.
   ⚠️ **CORRECTED 2026-08-01:** this check read ~~`roster.json` row accurate~~ for two days after that
   file became an empty stub, so **it passed on nothing, every time.** A check whose source returns
   empty is the most dangerous shape of rot: it reports success. ~~`last_audit` + standard version
   stamped~~ — STRUCK 07-28: no such field, and the dated record under `<slug>/audits/` IS the
   last-audit fact. One claimant.
4. ~~**registry.json row present + agreeing**~~ — **STRUCK 2026-07-25 (v0.2).** Replacement check:
   **every PATH the bundle points at must RESOLVE** — verify each pointer in `preferences.md` /
   `memory.md` / `README.md` against a live directory listing, not from memory. A phantom pointer
   authored at birth is indistinguishable from rot by the next reader (caught on the Memory Maggie
   graduation, which shipped pointing at a `hooks/memory-session-start.md` that never existed).
   ⚠️ **Resolving is NOT enough — a tombstone stub resolves perfectly and answers nothing.** Check
   the target still holds content, not just that the path returns 200.
5. **Bundle files present + in-format** — all five exist; each holds ONLY its kind (no procedure in
   memory; no metadata mirrored into folder files; no topic-decisions in the agent's decision-log).
6. **No cross-file contradiction** — memory.md, preferences.md, and the Index row tell ONE story.
   (The classic miss: a stripped role still asserted in memory. Highest-value check — and the FIRST
   one to re-run under the staleness rule at the top.)
7. **Voice is distinct** — self-announce header + tone do not bleed into another teammate. Also check
   the INVOCATION TOKEN, not just the voice: a first name that collides with, or is a homophone of,
   a live token is a finding. **Scan the Agent Index `AKA` + `Invoke` fields INCLUDING retired rows**
   (a retired name is still taken). ⚠️ ~~`roster.json` → `invocation.tokens`~~ — that field died with
   the file; a token check reading it clears EVERY collision silently.
8. **Index row + trigger row fresh** — the AI Toolkit Quick-Scan trigger row matches the Agent Index
   row, and any row that pointed at a migrated agent's OLD lens path now points at the bundle.
9. **Inherited memory labelled** — a freshly graduated agent's `memory.md` marks seeded lines
   INHERITED, not earned, so its first real session replaces reconstruction with lived context.
10. **SHA STAMPS PRESENT — the record names the bytes it audited** *(added 2026-07-28, v0.3; Q11 → C)*.
    The `Audited against (SHAs)` block is filled, covers every governing file the audit leaned on,
    and each SHA was read at audit time — **not carried from earlier in the session.** An unstamped
    audit is an unverifiable audit and this check is a **GAP**, never a PARTIAL.
11. **No stale FLEET FACT** *(added 2026-08-01, v0.4)*. Every claim the bundle makes about ANOTHER
    agent — who is steward, who owns a lane, who ratifies, whether their native shell is live —
    checked against the Agent Index and that agent's OWN bundle, never against a neighbouring file.
    **A fleet fact is correct at its source and wrong at every quote site.** Procedure:
    `hooks/fleet-fact-sweep.md`; the volatile list: `super-agents/fleet-known-drift-register.md`.

A PARTIAL or GAP holds the agent's Open-Surface Ledger open until resolved. Record the result as a
dated audit file under `super-agents/<slug>/audits/<slug>.<YYYY-MM-DD>.md` via PR.

---

## Audit record shape (`audits/<slug>.<date>.md`)

```
<slug>: Self-Audit — <YYYY-MM-DD>
Agent: <Display Name> (<slug>)
Track: <native | git-teammate>
Auditor: <self | Audit Anna | Fleet Steward>
Standard: <golden v1.0 | git-teammate DoD v0.4>
Overall: <Up to date | Partial | Behind>

Audited against (SHAs) — MANDATORY, one line per governing file:
- _shared/super-agent-base.md ......... <sha>
- super-agents/audit-instruction.md ... <sha>
- <any gate/hook/runbook this audit leaned on> ... <sha>
Agent Index row read at: <YYYY-MM-DD HH:MM ET>   # a ClickUp list has no SHA — stamp the READ TIME

Checklist results:
1. <item> ....... PASS
...  (per item; one-line note on any PARTIAL/GAP)

Divergences / contradictions:
- <none | specific gap + recommended fix + who fixes it>

Actions recommended:
- <concrete config edit for owner/manager>
```

**Addenda append; they never overwrite.** A staleness re-check adds a dated block below the original
(`Addendum <YYYY-MM-DD>: <stamped file> moved <old sha> → <new sha>; re-ran checks N, M; result`)
and leaves the original signature and its stamps untouched.

---

## PR-body standard (MANDATORY — Michael, 2026-07-15)

Every audit/declaration PR body must be self-contained about what the push actually did. Do NOT
leave the substance in chat and reference "found one, fixed it." The PR comment must state:

1. **Errors / flags found** — every PARTIAL or GAP the audit surfaced, named explicitly (not
   "a divergence").
2. **What was actually changed in THIS push** — the concrete edits (files touched, config fields
   corrected), so the diff is explained in prose.
3. **Why** — the reason each change was made.
4. **Trigger backlink** — a link back to the ClickUp chat message/thread that triggered the push.

The repo PR body and the ClickUp Activity Log thread tell the same story from both ends.

---

## ClickUp breadcrumb (the only ClickUp footprint)

- Header in the dedicated Activity Log:
  `🔍 Self-Audit · <Agent> · <standard> · Overall: <status> · PR #<n>`
- Threaded reply: mirrors the PR substance — errors/flags + what changed + why + links (PR + the
  triggering chat).
- No separate ClickUp docs/tasks/dashboards for audits or fleet status.

---

## Cadence

- Standard bump -> every agent on that track flips to "needs-re-audit"; work back through them.
- **Stamped file moves** -> only the audits that stamped it are stale, and the stamps say which.
  This is the cheap version of a standard bump and it is why the stamps exist.
- **A stamped file is RETIRED** -> harder than a bump: every check that leaned on it is unverified,
  not stale. Three records currently stamp `roster.json` and need this treatment.
- New agent     -> Agent Index row + `<slug>/` folder; audited in its first cycle.
- Ongoing       -> light periodic self-audits folded into normal runs.

---

## Changelog

- **2026-08-01: v0.7 / DoD v0.4. Repointed off `roster.json` (retired 07-30) and hardened against
  the empty-source failure.** Twelve reads across this file told auditors to verify against a
  tombstone; **DoD check 3 was the worst — it verified a row in an empty file and therefore PASSED
  every time**, and check 7's `invocation.tokens` scan would have cleared every name collision.
  Added: the stamp-proves-bytes-not-answers lock (three signed records stamp the stub), staleness
  rule 5, check 2's retired-manifest-entry GAP, check 4's resolves-is-not-enough clause, and **new
  check 11 (no stale FLEET FACT)** pointing at `hooks/fleet-fact-sweep.md`. Record shape now stamps
  the Agent Index READ TIME, since a ClickUp list has no SHA. **Native track re-labelled DORMANT →
  UNMAINTAINED:** Model A (2026-08-01) keeps native shells alive as loader bodies, so the class is
  no longer empty, but the live-vs-declared model does not fit a kernel that points at a bundle — a
  third track is needed and unwritten. Found by the first full run of the Fleet-Fact Sweep.
- **2026-07-28: v0.6 / DoD v0.3. SHA STAMPS ARE NOW REQUIRED (Q11 → C, authorized 2026-07-25).**
  New lock at the top + **DoD check 10** + a mandatory `Audited against (SHAs)` block + the
  **staleness re-check** procedure (re-run only affected checks; **ADDENDUM, never reissue**).
  Practice had run ahead of the spec by three records for two days: **a convention demonstrated
  three times and written zero times is one forgetful session from gone.** Also struck check 3's
  `last_audit` clause (phantom field) and flagged the native track dormant (PR #547).
- 2026-07-25: v0.5. **De-rotted the git-teammate DoD to v0.2** — it still required a `registry.json`
  row for a file retired the same day (PR #483), so every future audit would have failed on a
  phantom check. Check 4 struck and REPLACED with pointers-must-resolve. Token/homophone check
  folded into check 7 (the Clio/Cleo near-miss); inherited-memory labelling added as check 9. Found
  while running the DoD on the Closing Clio graduation — **the file that defines the audit bar could
  not pass its own bar.**
- 2026-07-21: v0.4. GRADUATED the git-teammate audit DoD (v0.1) into a formal track here. This file
  now holds BOTH tracks; `gates/git-teammate-lifecycle-runbook.md` POINTS here instead of holding
  procedure inline. Extended the file model + record shape to cover git-teammate bundles.
- 2026-07-15: v0.3. Defined `preferences.md` as a near-1:1 verbatim mirror of the live config.
- 2026-07-15: v0.2. Global metadata consolidated into one record; folder files reduced. Added the
  mandatory PR-body standard.
- 2026-07-15: v0.1 created; migrated from a ClickUp draft (culled). Repo is the canonical home.
