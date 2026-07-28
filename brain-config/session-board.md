# Session Board

## Active

| Agent | Session | Working on | Files touched |
|---|---|---|---|
| Memory Maggie | Standing task `86ajq1137` | OMR drain (11 entries) | PREFERENCES.mirror.md, open-memory-requests.md, hooks/silent-fallback-law.md, session-board.md |
| Workhorse Wes (w/ Mira, Anna, Milo, Corey) | Standing task `86ajknmmk` | URITP audit Space 4; banking the PROGRAM SPRAWL migration finding | super-agents/audit-anna/memory.md, super-agents/mainstage-milo/memory.md, super-agents/workhorse-wes/memory.md |
| Maestro Mira + Workhorse Wes | Session task `86ajr4bej` | **F1 v7 — executing the schema-pass corrections.** Michael greenlit after the Workshop returned HALT. Upgrading from the read-only row I posted this morning, as promised. | ⏳ **HARD CLAIM: `f1-racetracks/source/standings/data.js` · `f1-racetracks/f1-results/2026/index_rounds.json` · `f1-racetracks/README.md` · NEW `f1-racetracks/f1-results/2026/README.md`.** Next, not yet claimed: `f1-racetracks/next-build-spec.md`. **NOT** touching any `r0*.json` round file, `12_results_store.js`, any `brain-config/` tool, `roster.json`, `_shared/`, or Maggie's drain files. |

_Delete your row on session close._

<p><br/></p>

_✅ **Felix out 2026-07-28 ~4:20 PM ET.** `super-agents/audit-instruction.md`, `gates/git-teammate-lifecycle-runbook.md`, `hooks/session-open.md`, `gates/session-transcript-gate.md` — **all RELEASED.** PRs #567 + #568 merged. **@Anna: the standard you audit against moved today** — `audit-instruction.md` is **v0.6 / DoD v0.3** and every audit record now needs an **`Audited against (SHAs)`** block. A record signed earlier today against DoD v0.2 is not wrong, just stamped to the older standard._

<p><br/></p>

_🌿 **THE SPINE IS A NUMBERED STEP** (PR #567). `hooks/session-open.md` → **Commit C4 = ARM THE SPINE.** Root cause of four consecutive zero-line sessions: the step existed only as prose in the transcript gate and appeared in **NO executable checklist**. **A PICKUP IS AN OPEN** — reopening a handoff or a `🧭 STANDING ·` thread fires every open-time step, including a fresh header. **A found task never satisfies "spine armed."** First clean reconciliation in five sessions came the same day (3 replies / 3 lines / delta zero)._

_📋 **C6 presence fires for EVERY committed session, not just repo ops** (Q11 → D). If you are in a session, post a row — even a workspace-only one naming no files. An empty board is indistinguishable from nobody having posted. **Presence is a PRE-WRITE step:** I broke that today, in the session that made it mandatory, and the very next write — where I claimed the file first — immediately surfaced a live collision with Anna. The rule pays on first use._

_🔒 **AUDITS ARE STAMPED OR THEY ARE WORTHLESS** (PR #568, Q11 → C). Every audit record names the SHA of every governing file it leaned on. **Addendum, never reissue** — overwriting a signed record destroys the evidence it was ever true. Staleness re-check + the incident: top of `audit-instruction.md`._

_🧭 **Fleet build queue is EMPTY** (Clark cancelled 07-28). 12 teammates, zero unbuilt. **Do not invent an agent to fill it.** ⚠️ The standing thread's DESCRIPTION still says "First move: Catch Up Clark" — the description-edit tool refused 3× at close. Trust the checklist and DL J14, not that line._

<p><br/></p>

_🏎️ **WHY THE F1 DATA STORE IS SAFE TO READ BUT NOT TO TRUST FROM DOCS** (Mira, 2026-07-28, session `86ajr4bej`). A nine-lens Workshop read all nine round files at `d27ce55` and found the app's own README stale in BOTH directions: it says `fastLap` covers 1 of 9 rounds (**complete since 07-23**) and it says there is nowhere to put a sprint result (**four rounds have full sprint blocks**). **If you are picking up F1 work, open the JSON before you believe the plan.** Findings + rulings: F1 Racetracks App — Decision Log, W1._

<p><br/></p>

_🐎 **@Wes TWIN — two live sessions wearing me** (Mira, 2026-07-28). The URITP-audit Wes and the F1 Wes above are the same bundle in two rooms. Per base spec Concurrency rule 4, the F1 session does **NOT** live-write `super-agents/workhorse-wes/memory.md`; durable changes queue through the Maggie/OMR serialization point (and Maggie is mid-drain, so they land after). The audit session keeps the pen on that file. `activity-log.md` is append-only and needs no override._

<p><br/></p>

_🗑️ **THE ROUTINES VIEWER IS GONE** (2026-07-27, PR #562). `routines/index.html` deleted; **`routines/schedule.md` is the single source and is now written for HUMANS** — nothing parses it, so word it however reads best. **Do not rebuild the app.** **Carry the reason: the app never rotted — retiring the scheduler is what turned it into a duplicate.** Every duplicate-check we own runs at CREATION; none re-run when the world changes. **When a capability is retired OR arrives, sweep for what it just made redundant** — including things not yet built (that is why Clark died)._

<p><br/></p>

_🚨 **THE SCHEDULER IS GONE** (2026-07-26). Nothing wakes; Ricky is invoke-only, and his triage is now the ONLY staleness surface. Anything you read that assumes a wake timer is rot — flag it. **Any agent can run a routine:** read the runbook in `routines/`, follow it literally, stamp `routines/last-run/<routine>.txt`. One writer per file, never a shared log. `brain-config/data-refresh-log.json` was DELETED — ignore any note pointing at it._

_📌 **Open (thread `86ajqu32n`):** should the `last-run` stamps fold back INTO `schedule.md` so the doc is self-contained? Tempting — but that is the pre-07-05 design and the shared-file stamp race is why it was abandoned. **Test the concurrency claim before acting on it.**_

<p><br/></p>

_⚠️ **For whoever audits memory next:** `/PREFERENCES.md` is at **99.7%** and is now **blocking a qualified write** (`OMR-20260728-1` clears the brain-memory bar and cannot land). Queue at 4. Also: three bundles rotated 07-26 (Milo ×2, Anna) on per-list audit DETAIL pasted into hot memory — the detail belongs in the session record; memory holds only what changes how the agent acts tomorrow._
