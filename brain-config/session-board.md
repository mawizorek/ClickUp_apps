# Session Board

## Active

| Agent | Session | Working on | Files touched |
|---|---|---|---|
| Memory Maggie | Standing task `86ajq1137` | OMR drain (11 entries) | PREFERENCES.mirror.md, open-memory-requests.md, hooks/silent-fallback-law.md, session-board.md |
| Mira + Anna + Milo + Corey (URITP Audit Council) | Standing task `86ajknmmk` | **REFRESHED 07-30 ~11:30 AM ET.** Pickup session: Space 6 (Courses) + Space 7 (BETA BUDGET). Currently executing Michael's memory-shape ruling BEFORE walking any list. | **`ClickUp_apps`:** `super-agents/audit-anna/memory.md` + `activity-log.md`, `super-agents/mainstage-milo/memory.md` + `activity-log.md`, `open-memory-requests.md`, `session-board.md` |
| FMP Fiona | Session task titled `FMP Fiona (Opus 5) · HML_LLC v1 replan — table views + script/automation layer on FMP19 · Jul 28` (Agent Activity Board) | **CORRECTED 07-30: FMP documentation moves to `maw-prose` after all.** Standing up `apps/hml-llc/` there + two scoped convention exemptions. Nothing deleted from this repo until verified there. | **TWO REPOS.** `ClickUp_apps`: `filemaker/hml-llc/**` (read + this board row). **`maw-prose`: `apps/**`, `CONVENTIONS.md`, `DECISIONS.md`** |
| ClickUp Coach Corey (Opus 5) | Session task `86ajtmw95` — *Activity Board comment→channel AI narration automation + block spec · Jul 30* | Designing the AI narration automation for the board channel: prompt text + fixed one-line block spec, so each board-task comment posts as its authoring agent's own voice instead of a contentless clickbot task link. **DESIGN ONLY at this row's writing — NO repo files claimed.** Reads only against `gates/session-transcript-gate.md` + `hooks/session-open.md`. ⚠️ If Michael greenlights the spec write, this row gets moved BEFORE the write to claim `gates/` paths. | **`ClickUp_apps`:** none claimed (this board row only). |
| Maestro Mira (Opus 5) | Session task titled `Maestro Mira (Opus 5) · F1 app — derive hard-coded values from race dates · Aug 1` (Agent Activity Board) | **Season-vector restructure of `f1-racetracks`.** Michael: *"circuits are one vector. weekends are one vector. drivers are one vector. keep things separate and derived."* Splitting the per-year weekend join out of the circuits index into its own vector, deriving round/status/dates from session dates, and adding the reinstated Sepang round. Decision Log J7-J9, Q13/Q14 answered. **Collision-checked 08-01 12:30 ET: only commit on `f1-racetracks` since 07-31 is Ricky's 05:34Z results refresh — clear.** | **`ClickUp_apps`:** `f1-racetracks/season/2026/index_weekends.json` (new), `f1-racetracks/circuits/index_circuits.json`, `f1-racetracks/f1-results/2026/index_rounds.json`, `f1-racetracks/source/08_season.js` (new), `f1-racetracks/source/09_app_bootstrap_and_home.js`, `f1-racetracks/source/12_results_store.js`, `f1-racetracks/circuits.html`, `f1-racetracks/README.md`, `f1-racetracks/f1-results/2026/README.md`, `VERSIONS.md`, `session-board.md` |
| 🐎 Workhorse Wes (Opus 5) — seated by Mira, Dexter at the keyboard | Standing task titled `🧭 STANDING · Inciardi Collection — photos, image library + artwork detail` (Agent Activity Board) | **PHOTO UPLOAD BACKEND** — spec §5 steps 6 + 5, plus a **P0 found on the way in.** ⚠️ **THE APP IS PARTLY DOWN RIGHT NOW AND HAS BEEN SINCE 16:51Z:** migration 001 dropped `artwork.collection_id` and four code paths still name it — `GET /artworks`, `GET /summary`, `GET /shoebox` all 500, and `POST /artwork` (entering a print) fails on insert. **Verified live, cache-busted, with `/sheets` as the passing control.** Fixing that first, then the R2 binding and `worker/images.js`. **Collision-checked 08-01 13:25 + 14:05 ET: only `inciardi-collection` commit today is the workflow's own applied.log write plus my own #657 — clear.** | **`ClickUp_apps`:** `inciardi-collection/worker/worker.js`, `inciardi-collection/worker/reads.js`, `inciardi-collection/worker/images.js` (new), `inciardi-collection/wrangler.toml`, `inciardi-collection/next-build-spec.md`, `VERSIONS.md`, `session-board.md` |

_Delete your row on session close._

<p><br/></p>

_🔴 **A MIGRATION IS A DEPLOY, AND NOTHING IN THIS REPO TREATS IT LIKE ONE (08-01, found by Wes).** `001` was declared verified because a cache-busted `/health` returned the same five counts before and after. It did — and `/health` is the ONLY read route that does not name the dropped column. **The verification instrument was the one surface immune to the breakage.** Three reads and the primary write had been 500ing for five hours. **Generalizes past this app: a smoke test that predates the change cannot be trusted to detect the change. After ANY schema migration, hit a route that touches the altered table, not the health check.**_

<p><br/></p>

_✅ **Brain out 2026-08-01 ~12:30 AM ET.** `inciardi-collection` v13→v19 plus the batches, the arrangement editor, `next-build-spec.md`, the worker split and the artwork detail route. **ALL RELEASED, nothing held:** `worker/worker.js` · `worker/reads.js` (new) · `artwork.js` · `artwork.css` · `pages/artwork.html` (new) · `app.js` · `boot.js` · `chrome.js` · `picker.js` · `index.html` · `next-build-spec.md` · `VERSIONS.md` · `batches/**`. PRs #626, #629, #630, #631, #632, #634, #636, #637, #638._

_🔴 **AND THE ONE THING TO CARRY: TWO SESSIONS DESIGNED TWO SCHEMA MIGRATIONS FOR THE SAME EMPTY DATABASE ON 07-31, EACH JUSTIFIED BY THE SAME "the table is empty so it is free today" ARGUMENT.** Neither knew about the other's tables. Merged into ONE pass in the spec §4 before either was applied — but it was caught by reading a decision log, not by any check we own. **`hooks/collision-check.md` compares FILE paths; a schema is not a file, it is a live database two repos' worth of code can reach.** Queued as an OMR; naming it here because the next DDL-shaped idea will hit the same gap._

<p><br/></p>

_🔀 **A FOURTH SESSION SHIPPED INTO `inciardi-collection` ON 07-31 WITH NO ROW** (v18 `touch-action`, PR #633). Found by running `hooks/collision-check.md` — path-filtered `list_commits`, `since` today — rather than by colliding. It touched `base.css`, `boot.js` and `index.html`, two of which the next session then needed. **The check worked where the board did not.** Same session fixed a footer stamp that had read `v16` through all of v17, so this is evidence about the mechanism, not a complaint about the agent._

<p><br/></p>

_🔀 **THIRD COLLISION IN A WEEK, AND THE FIRST WHERE AN ENTIRE FEATURE GOT BUILT TWICE (07-31).** Two sessions independently built the batch-import feature — data-file batches, a loader, a validator, a hook — inside the same hour. Discovered at merge, when mine hit conflicts. **NEITHER SESSION HAD A ROW ON THIS BOARD.** Theirs shipped first and their design was better (a 3×3 grid laid out like the photograph makes a pocket collision unrepresentable, where mine merely validated against it), so mine was closed unmerged — PR #621. About an hour of Michael's money._

_🔧 **FIXED, and the diagnosis is not "someone forgot."** C6 has mandated presence since 07-28, it is numbered, it is inside the sequence that executes, and four other agents were using it correctly on this very page. So the question was why an existing rule was not REACHED. Three design faults, all now addressed in **`hooks/collision-check.md`**:_

_1. **The CHECK rode on the ANNOUNCEMENT.** C6 said "read the board, then add an entry" — one step, two jobs, two different beneficiaries. Reading protects YOU; writing protects everyone else. Welded together, skipping the step lost both, and the cheap self-interested act was gated behind the expensive altruistic one. **They are two steps now.**_

_2. **It fired ONCE, at Commit, when scope is smallest.** My first write that day was a task comment about a settings link. A row written then would have been true and useless — the collision came four asks later over files nobody had named yet. **The check now fires PER WORK ITEM.**_

_3. **The signal that DID fire got explained away.** `create_branch` returned **"Reference already exists"** for the exact branch name my work needed. I asked "does this branch have content?" when the question was **"who made this and are they still working?"** **A branch you did not create, named for the work you are about to do, is another session's claim.**_

_📏 **MEASURED, not assumed — and it killed my first design: NEITHER GIT SURFACE WORKS AS A BACKSTOP HERE.** Branch list = **100+ branches, never deleted after merge**; no way to tell live from long-dead. Open PRs = **12, newest six days old, oldest July 7, every one abandoned** — it has the exact shape of a claim ledger and every entry is a lie. What DOES work is `list_commits` with a path filter and `since=today`: self-maintaining, timestamped, cannot go stale. ⚠️ **@Michael — the 12 zombie PRs and the branch graveyard are worth a sweep.** Closing another agent's PR is destructive and was not mine to do._

<p><br/></p>

_🗄️ **A stale presence row is worse than an empty one: an empty board says "nobody posted," a stale row says "someone is here" and is believed.** The URITP audit row was stale for four days and claimed the exact two files a later session needed. Rule 5 already says delete your row on close; the enforcement gap is that nothing checks._

_🗄️ **NAME THE REPO IN YOUR FILES COLUMN.** This board lives inside `ClickUp_apps` and implicitly assumed one repo. Fiona's scope crossed into `maw-prose` mid-session; without the repo named, a collision check reads clean when it is not._

_🗄️ ⚠️ **`maw-prose` DOES NOT MEAN "ONLY PROSE" — READ THIS BEFORE PLACING ANY DOCUMENTATION.** Michael, 07-30: *"it doesn't literally mean only prose. it just means all our documentation."* The split is **CODE vs DOCUMENTATION**. `ClickUp_apps` holds apps, infra and `brain-config`; **`maw-prose` holds documentation of things** — venues, roles, safety programs, and now application schemas. **A repo name is a label, not a schema.**_

_🗄️ **Two `maw-prose` conventions needed scoped exemptions to hold app docs, both hung on the repo's own existing logic:** (1) the table ban is a rule about NOTES — a field registry is a **register**, and D-018 already exempts numbered registers; (2) the 3-segment depth cap was derived for notes, but an app doc tree **mirrors an external application's own menu**, so its depth is not a taxonomy choice._

_🗄️ **Carry this if you touch HML_LLC or any FMP19 build: FileMaker 19 has NO native transaction script steps.** `Open/Commit/Revert Transaction` arrived in **FileMaker 2023 (v20)**. All-or-nothing multi-record writes on 19 need the classic single-parent-relationship + `Revert Record` pattern. ✅ **Q8 ruled 07-29: `ReceivedFunds` IS that single-parent record** — so **table before wrapper** or you ship a rollback that silently reverts half._

_🗄️ ⚠️ **A `.fmscript` is a COPY TARGET, not a note** (locked 07-29). Everything in one gets hand-typed into FileMaker, so status, changelogs and defect flags live in a `<Name>.notes.md` sidecar._

_🗄️ ⚠️ **PII: a real payee name + Venmo handle shipped into the PUBLIC repo in a loan fixture (07-29), scrubbed same day, original values still in history at `eb63e88`.** ⚠️ **07-31: a SECOND instance of the same value was found and scrubbed (PR #635)** — the frozen snapshot row in `Payoffs.tsv`, which by design does not inherit edits to its source. **A remediation must sweep every table that SNAPSHOTS the value, not just the one that owns it.** Strongest single argument for a private repo._

_⚒️🗄️ **@Dexter — the object library is load-bearing in YOUR runtime** (HML_LLC DL Q5, Michael): *"we've begun structuring our clickup app builds around the new object set."* Repo apps are being modelled on FMP object families, not just FMP schema. Read before the next repo-app UI build._

<p><br/></p>

_✅ **Mira + Wes out 2026-07-28.** F1 v7 schema pass closed. **ALL RELEASED.** **Never claimed, still untouched:** `f1-racetracks/next-build-spec.md` — it is the next session's first move. PRs #569–#575. Handoff task `86ajrj6u3`._

_⚠️ **Never hand-type a ClickUp ID into a durable file.** Three recurrences, the third of which landed on `main`. **The guard is: if you are holding a URL and not an id, you do not have an id, so write the TITLE.** Every other row on this board names its session by title for exactly that reason._

<p><br/></p>

_✅ **Felix out 2026-07-28.** `super-agents/audit-instruction.md`, `gates/git-teammate-lifecycle-runbook.md`, `hooks/session-open.md`, `gates/session-transcript-gate.md` — **all RELEASED.** PRs #567 + #568. **@Anna: the standard you audit against moved** — `audit-instruction.md` is **v0.6 / DoD v0.3** and every audit record now needs an **`Audited against (SHAs)`** block._

_🌿 **THE SPINE IS A NUMBERED STEP** (PR #567). `hooks/session-open.md` → **Commit C4 = ARM THE SPINE.** Root cause of four consecutive zero-line sessions: the step existed only as prose and appeared in **NO executable checklist**. **A PICKUP IS AN OPEN.** **A found task never satisfies "spine armed."**_

_📋 **C6 presence fires for EVERY committed session, not just repo ops.** Presence is a PRE-WRITE step — and a **PER-WRITE** one: a row is only true until your scope changes. ⚠️ **07-31: C6 is now the CLAIM only. The CHECK is `hooks/collision-check.md` and it fires per WORK ITEM.**_

_🔒 **AUDITS ARE STAMPED OR THEY ARE WORTHLESS** (PR #568). Every audit record names the SHA of every governing file it leaned on. **Addendum, never reissue.**_

_🧭 **Fleet build queue is EMPTY** (Clark cancelled 07-28). 12 teammates, zero unbuilt. **Do not invent an agent to fill it.** ⚠️ The standing thread's DESCRIPTION still says "First move: Catch Up Clark" — trust the checklist and DL J14, not that line._

<p><br/></p>

_🏎️ **WHY THE F1 DATA STORE IS SAFE TO READ BUT NOT TO TRUST FROM DOCS.** A nine-lens Workshop read all nine round files and found the app's own README stale in BOTH directions. **The habit stands: open the JSON before you believe the plan.** ⚠️ **08-01: the inverse also happened — the README carried the correct Sepang calendar fact while BOTH data stores carried the wrong one. Nothing in this app ever compares the two directions.**_

_⛔ **F1 step 5 is NOT a job you can improvise.** `grid` + `qualifying` for r03/r04/r07 = 66 driver-rows, official sources cross-checked. Sourced or absent._

<p><br/></p>

_🗑️ **THE ROUTINES VIEWER IS GONE** (PR #562). `routines/schedule.md` is the single source and is written for HUMANS. **Do not rebuild the app.** **Carry the reason: the app never rotted — retiring the scheduler is what turned it into a duplicate.** Every duplicate-check we own runs at CREATION; none re-run when the world changes._

_🚨 **THE SCHEDULER IS GONE** (2026-07-26). Nothing wakes; Ricky is invoke-only. **Any agent can run a routine:** read the runbook in `routines/`, follow it literally, stamp `routines/last-run/<routine>.txt`. `brain-config/data-refresh-log.json` was DELETED — ignore any note pointing at it._

_📌 **Open (thread `86ajqu32n`):** should `last-run` stamps fold back INTO `schedule.md`? That is the pre-07-05 design and the shared-file stamp race is why it was abandoned. **Test the concurrency claim before acting.**_

<p><br/></p>

_⚠️ **For whoever audits memory next:** `/PREFERENCES.md` is at **99%**, blocking a qualified write. **Queue is 21 as of 07-31 — three are APPROVED for placement but blocked on BUNDLE STATE**, not on the ruling. 🗄️ **Fiona's pattern, worth generalizing:** content kept getting placed by the LABEL of the surface she happened to be standing in. **Read a surface's PURPOSE, never its name or your own momentum.**_

_🧠 **BUNDLE CAP IS THE #1 OMR BLOCKER AND MICHAEL CUT ITS ROOT CAUSE (07-30).** Ruling: `memory.md` holds **patterns + core preferences only**; ongoing project state belongs in `activity-log.md`. **Every "blocked on bundle cap" entry should be re-tested after the fleet re-shape — the cap was being consumed by content in the wrong file.**_
