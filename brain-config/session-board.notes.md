# Session Board — Notes

**Sidecar to [`session-board.md`](./session-board.md). READ-ONLY reference. Nothing here is a live claim.**

The board is a **presence surface**: who is in the repo right now, what branch, which files. It is empty when idle. This file is where its **durable content** lives — the collision post-mortems, the standing scars, and rows retired with evidence.

**Why the split (2026-08-11, Michael):** the board reached **32,393 bytes** while its own spec said *"empty by default"* and *"must never accumulate into a running log."* Roughly **30 of those 32KB were not presence at all** — they were post-mortems and cross-session warnings, which is durable content in an ephemeral file. Two consequences, both measured:

1. **Every session had to rewrite 32KB to post a one-line claim**, through `create_or_update_file`, which the GitHub MCP Operating Standard **LOCKS at ~30KB**. Two such writes succeeded on 2026-08-11. That was luck, not evidence.
2. **The prose buried the table.** Six rows sat above ~30KB of commentary, five of them dormant for five or more days, and the surface a session actually needs to read in two seconds took a full-file fetch.

**Precedent:** `uritp-docs` `CSS-NOTES.md` (2026-08-02) and `hooks/trip-triage.notes.md` (2026-08-10). ⚠️ **The prose was never the problem and must not be deleted as one** — it is the reason these failures stopped recurring. It moves; it does not die.

---

## 🚨 The nine collisions — what each one proved

Eight recorded through 2026-08-05, plus the write-cap near-miss on 08-11.

### ⭐ THE DURABLE LINE, FIRST, BECAUSE IT IS THE ONLY GENERALIZATION THAT HAS HELD

**Every collision was caught by a READ or by a WRITE REFUSING. None was ever caught by a CHECK.**

Our mechanisms all try to answer *"may I write?"* in advance. The only things that have ever worked:

- **Ask what is true RIGHT NOW at the last possible moment** — path-filtered `list_commits --since today`, immediately before the write.
- **Treat a rejected write as information, not an obstacle.** A stale-SHA rejection and a 405 merge conflict are the repo refusing **in the present tense**, which is the only operation in the whole sequence that consults reality at write time instead of predicting it. 🚫 **Never "fix" a SHA rejection by re-fetching and forcing. Re-fetch and MERGE.**

⚠️ **And the read has a measured floor.** Collision eight's last-moment read was clean *and correct* — the twin committed 45 seconds later. **A read tells you the past; a twin's commit is in your future.**

### Collisions 1–3 (2026-07-31) — an entire feature built twice

Two sessions independently built batch-import inside the same hour, discovered at merge. **Neither had a row.** Theirs shipped first and was better, so mine closed unmerged (PR #621). About an hour of Michael's money. A fourth session shipped v18 `touch-action` into `inciardi-collection` with no row (PR #633), found by running the check rather than by colliding — **the check worked where the board did not.**

Three design faults, written up in `hooks/collision-check.md`: the check rode on the announcement · it fired once, when scope was smallest · the `create_branch` *"Reference already exists"* signal was explained away.

### Collision 4 (2026-08-01, 20:51) — thirteen seconds, and both sessions HAD a row

Two Fleet Felix sessions ran the same 16-file `roster.json` repoint. Theirs merged as PR #693 at 20:51:08; my commit landed 20:50:55.

🔧 **The fault was not a missing row. Both sessions had one — for DIFFERENT work.** The row was never MOVED when scope changed. **A row that is not moved is worse than no row: it is a false negative for everyone who reads it.** Fix: the gate binds to the **WRITE TOOL** rather than to the session or the work item, and **a row names its BRANCH**, making staleness provable in one call instead of unknowable.

### Collisions 5–7 (2026-08-01, 21:23 / 21:27 / 21:43) — self-collisions, and the hard gate merged at 21:10 caught none of them

One session running twice shipped the theme spine (#696) and the ledger row (#697) **61 and 71 seconds before Michael asked for each**, then put three commits on a branch its twin had cut two minutes earlier.

⭐ **Every presence mechanism we own answers "is someone ELSE here?" A twin is not someone else** — it shares the task, the row, the intent and the name, so the gate answers *"that's you,"* which is true and useless. **Michael's own arbitration (*"this one carries it"*) reaches BOTH instances, because every channel we own is addressed to the SESSION.**

🔧 **BRANCH-AS-CLAIM IS FALSIFIED IN BOTH DIRECTIONS. STOP PROPOSING IT.** Same derived name defeats it (one instance creates the ref, the other just writes into it, so `Reference already exists` never fires). Different derived names also defeat it (nothing to collide with — collision eight). ⚠️ **Two instances on ONE branch is the worst venue of all: two branches at least produce a diff somebody reconciles, but one branch has no merge boundary, and the commits interleave into a history that reads as intentional.**

### Collision class 7b (2026-08-01, ~22:38) — the REPO itself was out of scope

`maw-agents/uritp-docs` absorbed six self-collisions in one day (a keystore feature twice, external quick links twice, the `good` colour column twice, PR #52 dying on a 422 because its content had landed by another route) and **not one was preventable from this board, because no row had ever named that repo.**

**A coordination surface only covers what somebody has posted about. Silence on a repo reads identically to safety on that repo.** ⚠️ **NAME THE REPO IN YOUR FILES COLUMN.**

### Collision 8 (2026-08-05, 16:04) — every control ran and every layer returned a true, useless answer

Two sessions made the same one-cell correction to `uritp-docs` `courses/course-index.tsv` (THTR 150, 4cr → 2cr). Theirs merged as PR #43 at 16:04:44Z; mine committed 16:05:29Z and closed unmerged (PR #44).

1. **The last-moment read was CLEAN** — and clean *because the twin had not committed yet.* The mechanism's structural limit, not a lapse.
2. **`create_branch` returned a NEW ref** — we derived DIFFERENT names, so there was nothing to collide with.
3. **A presence row WAS posted before the write**, naming branch, repo and file — the gate satisfied to the letter. **The twin never read it, because a twin is not looking for someone else.**

✅ **The MERGE caught it.** Cheapest of the eight: one wasted commit, one closed PR.

🧾 One thing #43 got slightly wrong, recorded because nobody will re-derive it: its verify note reads *"supersedes Nigel's sheet."* The disagreement the original `.tbc` recorded was **index-vs-ClickUp**, not Nigel's sheet. Data right, provenance misattributed.

### Collision 9 (2026-08-11) — the coordination surface became the hazard

Two 32KB writes to `session-board.md` through a tool LOCKED at ~30KB. Both succeeded. **The file that exists to prevent damage was one byte-count away from being the damage**, and it was the single most-written file in `brain-config`. This split is the fix.

### 🚦 Gate status, stated honestly

- **07-31:** rows were simply absent.
- **08-01:** the claim became a HARD PRE-WRITE GATE bound to the write tool.
- **08-02:** violated once more on `uritp-docs` PR #57 — the CHECK ran clean and the ROW went up *after* the first writes.
- **08-05:** **the gate is no longer being violated. It is being OUTRUN.**
- **08-11:** satisfied twice, and it cost TWO extra PRs to do honestly — the row must be on `main` before the write and everything goes through a branch, so a one-PR change becomes three (row up · work · row down). **Recorded because the next session will be tempted to skip it on exactly that arithmetic.**

---

## 🅿️ Rows retired 2026-08-11 with evidence (NOT resolved — dormant)

All five carried a claim on the board. `list_commits --since 2026-08-06` (whole repo, 40 commits) shows **zero commits to any path any of them claimed.** Every one was already self-flagged stale by a prior session. Retired to keep the Active table honest. 🔁 **If one of these is still live, RE-POST IT with a branch — a wrongly-cleared row costs a re-post; a stale row costs an hour.**

| Session | Claimed | Last movement | Evidence |
|---|---|---|---|
| URITP Audit Council (Mira + Anna + Milo + Corey) · `86ajknmmk` | Anna + Milo bundles, `open-memory-requests.md` | flagged stale **08-01** | Bundles edited by other sessions repeatedly since; no branch ever named. |
| FMP Fiona · HML_LLC v1 replan | `filemaker/hml-llc/**`, and `maw-prose`: `apps/**` | **07-28** | No `filemaker/` commits since 08-06. Fiona's own later commits (08-10) were bundle work, not this claim. |
| ClickUp Coach Corey · board-narration automation | none (design only) | **07-30** | Self-declared as claiming nothing. Row was informational. |
| Workhorse Wes · Inciardi photo backend | `inciardi-collection/**`, `VERSIONS.md` | flagged stale **08-02** | No `inciardi-collection` or `VERSIONS.md` commits since 08-06. No branch ever named. |
| Fleet Felix · board hard-gate · `felix-board-hard-gate` | `hooks/collision-check.md`, `hooks/session-open.md` | **08-01** | Work shipped (#693). No commits to either hook since. |
| Maestro Mira · ledger cleanup · `ledger-cleanup-2026-08-02` | `VERSIONS.md` | **08-02** | No `VERSIONS.md` commits since 08-06. |

**How rows got cleared before this:** by whoever next PROVED the session was done. Only **three** self-clears in the file's history (router nav-seal 08-04 · Tutor Tate 08-05 · dependency-wording 08-11), against six rows cleared by someone else. **Rule 7 said delete your row on close and nothing enforced it.** As of 2026-08-11 the clear is **Step 4 of `hooks/session-close.md`** and a numbered rule, which is the fix for that.

### Two shapes of stale row, and the second one is worse

- **A stale presence row** says *"someone is here"* and is believed. The URITP audit row was stale four days and claimed the exact two files a later session needed. **An empty board says "nobody posted"; a stale row lies.**
- 🔴 **A stale BLOCKER can park real work indefinitely.** The `uritp-docs` row claimed `uritp.css` is *"34.8KB — OVER the write cap, so the nav typography CANNOT be done until that file is split."* All three clauses went false in one PR (#57): file split seven ways, typography shipped, cap enforced by a build gate. **A blocker is a claim with a shelf life, and nothing on this board expires** — which is why the board now has an expiry rule.

---

## 🅿️ Parked, not abandoned — `f1-racetracks-v20-port`

Three commits (`96cd684` board move · `76af417` `config.json` · `0f78661` `chrome.js` placed UNFORKED from the template), **no PR opened**, dormant since 08-01 21:43. It is the live v20 port branch and **must not be re-cut**: re-doing those three commits is the collision, not the branch existing.

⛔ **One thing waits on Michael.** The v18 embed guard (`self !== top`) is deliberately NOT carried into the new `chrome.js`, held as a PROPOSAL because he personally ordered that lock (*"lock. that. shit. down."*). Reasoning is in the file header: the new router has no iframes, so the guard tests a condition the port deletes, and in the one framing case that survives (a whole-app ClickUp embed) **the chrome IS the navigation and suppressing it hides it.** Reversible in ten lines.

---

## 📏 Size, reads, and the numbers that are policy rather than physics

### The read/write ceiling is a POLICY LINE, not a measured wall

A **30.6KB** file read whole on 07-29. A **34.9KB** file clipped silently on 08-01 — four reads in one session returned the same truncated bytes with **no error**, so its last ~6KB was being edited blind. **Nobody has characterised the range between.** ⚠️ **`VERSIONS.md` still asserts a 22KB ceiling as "physics," which is the oldest un-corrected inherited number we own.**

**What a build gate looks like when it works** (`uritp-docs` PR #57): `hooks/sizecheck.py` + `size-budget.tsv` — **maths in the hook, thresholds in a TSV row with a NOTE column so every waiver shows up in a diff.** `ClickUp_apps` has the same disease and no gate.

⚠️ **TOKENISING A STYLESHEET MAKES IT BIGGER.** It removes VALUES and never removes RULES, and `var(--u-text-soft)` is longer than the hex it replaced. Anyone reasoning *"we moved the colours out, so it shrank"* reaches the wrong conclusion.

### Which git surfaces actually work as a backstop

- ❌ **Branch list:** 100+ branches, never deleted after merge. Useless.
- ❌ **Open PRs:** re-measured 08-02 — **thirteen** open, oldest **#46 from 07-07**, eleven predating 07-26. **A claim ledger where nearly every entry is a lie, and it is the surface a human checks first.** ⚠️ **@Michael — triage needs YOUR call per PR, not a bulk close:** #665 (inciardi photo pipe) may be genuinely superseded by v22/v23 rather than abandoned, and closing another session's PR is destructive.
- ✅ **`list_commits` with a path filter and `since=today`.** The one that holds.

### 🕳️ The GitHub API is an unreliable narrator, which attacks the one mechanism above that works

Six endpoints served stale or empty data in two days: Contents (a stale `active.txt`), Deployments (frozen ~4h), Actions `runs` (three runs, 35h old, when there were dozens), Pages `builds/latest` (404), a Pages CSS URL (pre-token stylesheet on first fetch, current on a cache-busted retry), and **`check-runs`, which reported `in_progress` for seven minutes on a job the `jobs` endpoint showed as `success` in 16 seconds.**

⚠️ **The pattern: SUMMARY endpoints rot, SPECIFIC ones do not.** Path-filtered `list_commits`, the git blob API, and `actions/runs/<id>/jobs` have all held. **Ask a narrow question of a specific object; never trust a list endpoint to tell you what exists.**

---

## 🗄️ Standing scars — carry these

### Placement

- ⚠️ **`maw-prose` DOES NOT MEAN "ONLY PROSE."** Michael, 07-30: *"it doesn't literally mean only prose. it just means all our documentation."* The split is **CODE vs DOCUMENTATION**: `ClickUp_apps` holds apps, infra and `brain-config`; `maw-prose` holds documentation of things. **A repo name is a label, not a schema.**
- **Resolved findings stay in the repo beside the content they govern; OPEN QUESTIONS go to ClickUp**, because an inverted-polarity checkbox must be clickable (Prose-Documentation DL J4). That rule is why this file is a repo sidecar and not a doc page.
- 🗄️ **Fiona's pattern, worth generalizing:** content kept getting placed by the LABEL of the surface she happened to be standing in. **Read a surface's PURPOSE, never its name or your own momentum.**
- Two `maw-prose` conventions needed scoped exemptions to hold app docs, both hung on the repo's own logic: the table ban is a rule about NOTES and a field registry is a **register** (D-018 already exempts numbered registers); the 3-segment depth cap was derived for notes, but an app doc tree **mirrors an external application's own menu**.

### Identifiers and IDs

- ⚠️ **Never hand-type a ClickUp ID into a durable file.** Four recurrences, the third landed on `main`. **The guard: if you are holding a URL and not an id, you do not have an id — so write the TITLE.** Every board row names its session by title for exactly that reason. **Four instances means the guard is not being reached at write time.**

### Safety and privacy

- 🔴 **PII has shipped into this PUBLIC repo TWICE.** A real payee name + Venmo handle in a loan fixture (07-29, scrubbed same day, **original values remain in history at `eb63e88`**), then a second instance in the frozen snapshot row of `Payoffs.tsv` (07-31, PR #635) — which by design does not inherit edits to its source. ⚠️ **A remediation must sweep every table that SNAPSHOTS the value, not just the one that owns it.** This scar is now the top line of `super-agents/realty-riley/memory.md`.
- 🔴 **A MIGRATION IS A DEPLOY and nothing in this repo treats it like one** (08-01, found by Wes). Migration `001` was declared verified because a cache-busted `/health` returned the same five counts before and after. It did — and `/health` is the **only** read route that does not name the dropped column. **The verification instrument was the one surface immune to the breakage.** Three reads and the primary write had been 500ing for five hours. **A smoke test that predates the change cannot detect the change. After ANY schema migration, hit a route that touches the ALTERED TABLE.**
- 🔴 **Two sessions designed two schema migrations for the same empty database on 07-31**, each justified by *"the table is empty so it is free today."* Neither knew about the other's tables. Merged before either was applied — caught by reading a decision log, not by any check we own. **`collision-check.md` compares FILE paths; a schema is not a file, it is a live database two repos' worth of code can reach.** ⚠️ Still an open gap.

### Process

- 🌿 **THE SPINE IS A NUMBERED STEP** (PR #567). `hooks/session-open.md` → **Commit C4 = ARM THE SPINE.** Root cause of four consecutive zero-line sessions: the step existed only as prose and appeared in **NO executable checklist**. **A PICKUP IS AN OPEN. A found task never satisfies "spine armed."** ⭐ This is the same fault the board-clear had until 08-11, and the same fix.
- 🔒 **AUDITS ARE STAMPED OR THEY ARE WORTHLESS** (PR #568). Every audit record names the SHA of every governing file it leaned on. **Addendum, never reissue.** ⚠️ **A stamp proves WHICH BYTES, not that the bytes say anything** — three signed records stamp `roster.json`, retired 07-30, so those checks passed on an empty read.
- 🧭 **Do not invent an agent to fill an empty queue.** ⚠️ **Do not put a fleet COUNT anywhere in these files.** Filter the 🤖 Agent Index by `Class` and count rows; that is the only number that cannot rot. The Fleet Build Queue thread's description still says *"First move: Catch Up Clark"* — wrong, unfixed, trust the checklist and DL J14.
- 🚨 **THE SCHEDULER IS GONE** (2026-07-26). Nothing wakes; Ricky is invoke-only. **Any agent can run a routine:** read the runbook in `routines/`, follow it literally, stamp `routines/last-run/<routine>.txt`. `brain-config/data-refresh-log.json` was DELETED — ignore any note pointing at it. ⚠️ **Consequence for this board: there is definitionally no periodic sweep of anything.** Cleanup happens at session close or not at all.
- 🗑️ **THE ROUTINES VIEWER IS GONE** (PR #562). `routines/schedule.md` is the single source and is written for HUMANS. **Do not rebuild the app.** ⭐ **Carry the reason: the app never rotted — retiring the scheduler is what turned it into a duplicate. Every duplicate-check we own runs at CREATION; none re-run when the world changes.**
- 📌 **Open (thread `86ajqu32n`):** should `last-run` stamps fold back INTO `schedule.md`? That is the pre-07-05 design and the shared-file stamp race is why it was abandoned. **Test the concurrency claim before acting.**

### Memory

- ⚠️ `/PREFERENCES.md` is at effectively zero headroom, blocking qualified writes, and the OMR queue is jammed behind Michael's capacity ruling — **DROP works, DRAIN is blocked.**
- 🧠 **BUNDLE CAP WAS THE #1 OMR BLOCKER AND MICHAEL CUT ITS ROOT CAUSE (07-30).** Ruling: `memory.md` holds **patterns + core preferences only**; ongoing project state belongs in `activity-log.md`. **Every "blocked on bundle cap" entry should be re-tested after the fleet re-shape — the cap was being consumed by content in the wrong file.**

### App-specific, carried because it keeps biting

- 🏎️ **The F1 data store is safe to READ but not to TRUST from docs.** A nine-lens Workshop read all nine round files and found the app's own README stale in BOTH directions — and later the inverse, the README correct on Sepang while both data stores were wrong. **Nothing in this app ever compares the two directions. Open the JSON before you believe the plan.** ⛔ Step 5 is not improvisable: `grid` + `qualifying` for r03/r04/r07 = 66 driver-rows, official sources cross-checked. **Sourced or absent.**
- 🎨 **`colors.tsv` is a shared standard with a MEASURED failure mode.** Its `accent` column is a **theme** accent: the actionable colour inside ONE team's theme, where nothing competes with it. Eleven rendered at once on a standings matrix is a use it was never designed for — Ferrari, Red Bull, Audi and Haas landed within **1.1 hue degrees and 0.011 lightness**, two byte-identical. ⭐ **Generalizes: when a design built for singular use is adopted for plural use, the failure is never in the values — it is in the assumption that distinctness was ever a property being maintained.** One hue family per team now; **check a twelfth row against the other eleven in oklch, not by eye.**
- 🧩 **`template-app/chrome.js` is a COPY BASELINE, not a shared runtime.** 10,617 B of full app chrome, **no embed/iframe awareness**. Every app that copies it owns a fork, so **a fix in one copy reaches no other app.** **Place it UNFORKED and let everything app-specific ride in through `cfg`;** if you need something the template cannot express, change the TEMPLATE. ⚠️ **Do not edit `template-app/` to fix your app** — that is a structural change to the gold standard and it is Michael's call.
- 🗄️ **FileMaker 19 has NO native transaction script steps.** `Open/Commit/Revert Transaction` arrived in **FileMaker 2023 (v20)**. All-or-nothing multi-record writes on 19 need the classic single-parent-relationship + `Revert Record` pattern. ✅ Q8 ruled 07-29: **`ReceivedFunds` IS that single-parent record** — so **table before wrapper**, or you ship a rollback that silently reverts half.
- 🗄️ **A `.fmscript` is a COPY TARGET, not a note** (locked 07-29). Everything in one gets hand-typed into FileMaker, so status, changelogs and defect flags live in a `<Name>.notes.md` sidecar.
- ⚒️ **@Dexter — the object library is load-bearing in YOUR runtime** (HML_LLC DL Q5, Michael): *"we've begun structuring our clickup app builds around the new object set."* Repo apps are being modelled on FMP object families, not just FMP schema.

---

## ⭐ One collision control that does not depend on anybody reading anything

**Choose the seam that minimises the shared surface.** `doc-render-engine` PR #47 merged thirteen minutes before the nav-seal row went up. The feature was built onto an **already-registered hook stage** (`prune_nav` at 00b) instead of a new hook file, so there was no `mkdocs.yml` edit and no `hooks/` addition — the only file both sessions could have touched was `state.py`, and that was a six-line append.

**A diff can be kept clear of a live parallel session by DESIGN rather than by luck**, and this is the only control on the list that works while everyone involved is ignoring the board.

---

## Changelog

- **2026-08-11 — Sidecar created.** `session-board.md` split at Michael's direction: **32,393 B → a slim table**, with all post-mortems, scars and retired rows moved here. Board gained an **expiry rule** and a declared **self-claim exception**; the row clear became **Step 4 + rule 28** of `hooks/session-close.md`. Nothing deleted.
