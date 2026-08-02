# Collision Check

**Type:** 🔴 **HARD PRE-WRITE GATE.** Fires before every repo WRITE, not once per session and not once per work item.
**Purpose:** Stop two sessions from building the same thing, or writing the same files, at the same time.
**Created:** 2026-07-31, after two sessions built the batch-import feature simultaneously. **v2 2026-08-01** after a fourth collision that v1 did not prevent.
**Requires:** `githubmcp_list_commits`, `githubmcp_get_file_contents`
**Companion:** `hooks/session-open.md` C6 (the presence POST — this hook is the READ, and now also the enforcement).

---

## 🔴 THE HARD GATE (LOCKED 2026-08-01, Michael)

**NO ROW NAMING YOUR BRANCH = NO WRITE.**

Before any `create_or_update_file`, `push_files`, `create_branch`, `delete_file` or `merge_pull_request`, `brain-config/session-board.md` must carry a row that is **yours**, **current**, and names **the branch you are writing on** plus **the directory you are writing into**.

If it does not, the write does not happen yet. Post or move the row, then write. That is the whole gate.

**It binds to the TOOL, not to the session and not to the work item.** That is the v2 change and it is the only shape that survives contact with how these sessions actually go: a session's scope grows sideways for hours, and every softer trigger — once at Commit, once per work item — has been reached, satisfied, and then outrun by the work.

### The row must name its BRANCH, and that is the load-bearing half

A row that names a branch is **falsifiable in one call.** Anyone can ask whether that branch exists and when it last moved:

    githubmcp_list_commits(owner, repo, sha: '<branch-from-the-row>')

- Branch gone or merged → **the row is dead.** Clear it, say you cleared it, carry on.
- Branch exists, last commit hours old → **stale-looking.** Name the doubt out loud, proceed with care.
- Branch exists, commits in the last minutes → **live. STOP and talk to Michael.**

Before this, the board's own diagnosis of its worst failure was *"the enforcement gap is that nothing checks"* — because there was nothing to check **against.** A prose row is an assertion; a branch is a fact. **This converts the board from a trust surface into a verifiable one**, which is also what finally makes rule 7 (delete your row on close) enforceable by someone other than the person who forgot.

### Clearing someone else's row

Allowed, **with evidence, stated out loud.** Prove the branch is gone or the PR merged, clear the row, and say so in your reply and your commit message. A wrongly-cleared row costs a re-post. A stale row costs an hour — that is not a close call. **Never clear a row you merely doubt.**

---

## Why this exists when C6 already existed — and why v1 was not enough

C6 has mandated a presence post since 2026-07-28. It is numbered, it sits inside the sequence that executes, and other agents demonstrably use it. Four design faults have now been found, each one a design problem rather than a lapse:

**1. THE CHECK WAS A PASSENGER ON THE ANNOUNCEMENT.** C6 read: *read the board, then add an entry.* One step, two acts. Reading protects **you**; writing protects **everyone else**. Bundled, skipping the step lost both — and the cheap self-interested act was gated behind the expensive altruistic one. **Split 07-31:** this hook is the read, C6 is the write.

**2. IT FIRED ONCE, AT SESSION START, WHEN SCOPE WAS SMALLEST.** Commit fires on the first side-effecting action. On 07-31 that was a task comment about a settings link; the collision came four asks later over files nobody had named yet. **Fixed 07-31:** fires per work item.

**3. THE SIGNAL THAT DID FIRE WAS RATIONALISED.** See Halt Signals.

**4. 🔴 THE ROW EXISTED AND WAS NEVER MOVED (found 2026-08-01, and none of the three fixes above touch it).** Two Fleet Felix sessions ran the same 16-file remediation thirteen seconds apart. **BOTH had run a collision check. BOTH had a board row.** The rows described *earlier* work — one still claimed a bundle build that had merged hours before. So the check fired, the claim existed, and the claim was **about something else.**

> **A row that is not moved is worse than no row.** An absent row is honest ambiguity — Concurrency rule 5 already teaches you to distrust it. A row naming the wrong files is a **false negative**: it tells every reader this session is somewhere it is not, and it is believed.

"Per work item" failed because a work item is a judgement call and scope creeps between them. **A write is not a judgement call.** It is a tool invocation with a path in it, and that is why v2 hangs the gate there.

---

## 🔴 What does NOT work in this repo, measured

Both surfaces below look like claim ledgers. Both are graveyards. **Measured against the live repo, not assumed** — and the first draft of this hook was built on the second one before the numbers came in.

| Surface | Reality on 2026-07-31 | Verdict |
|---|---|---|
| **Branch LIST** | 100+ branches; never deleted after merge. A dozen dead `inciardi-collection-*`, plus `audit-anna-v1` through `v11`. | **Useless as a directory.** No way to scan it for live work. |
| **Open PRs** | **12 open. Newest six days old, oldest July 7. Every one abandoned.** | **Worse than useless.** The exact shape of a claim ledger, and every entry is a lie. |

⚠️ **Do not build a collision check on either.** Noise shaped like signal is how a check gets trusted while returning nothing.

**Note the distinction v2 depends on:** browsing the branch list is useless, but **checking ONE named branch is definitive.** The gate never asks you to scan; a row hands you the exact ref to query.

> Live finding for Michael: **the zombie PRs and the branch graveyard are themselves a hazard, and the pile grew again on 08-01** (two abandoned Felix branches from the fourth collision). Closing another agent's PR is destructive and outside this hook's business — somebody should sweep them.

---

## The check

### 0. CLAIM FIRST — the gate above

Row on the board, naming your branch and your directory, **before the write.** This was step 3 in v1, behind two research steps, which is the same ordering mistake fault 1 identified: the act that protects everyone else sat behind the work that protects you. **It is step 0 now.** It costs one edit and it is the only step whose absence harms other people.

### 1. Recent commits on the path you are about to touch

    githubmcp_list_commits(owner, repo, path: '<app-or-dir>', since: '<today>')

One call. **Self-maintaining** — a commit exists because work happened, nobody has to remember to file it, and it cannot go stale because it is timestamped. Run it against the **directory**, not a single file: a parallel session will be in the same *area*, rarely the same file.

**Anything you did not write, landed today, in your area → STOP and tell Michael before building.**

⚠️ **Honest limit, stated because a check with an unstated blind spot gets over-trusted:** this sees work that has *landed*. It cannot see a session mid-flight that has not pushed. On 07-31 the parallel session's commit landed four minutes *after* this session started building, and on 08-01 the gap was **thirteen seconds** — so **this check alone passes at start time in exactly the cases that hurt most.** Step 4 is why the 08-01 collision cost one commit instead of an hour.

### 2. The board

Read `brain-config/session-board.md`. It is the only surface carrying **intent** — work declared before it produces a commit — so it covers step 1's blind spot.

**Treat rows as suspect, then TEST them** (the branch column makes this cheap — see the gate):

- Row names your files, branch live with recent commits → **real. Stop.**
- Row names your files, branch merged or missing → **dead row.** Clear it with evidence, say so, proceed.
- Row names your files, no branch named → **unverifiable.** Treat as real, and ask.
- **No row at all means nothing.** An empty board is indistinguishable from nobody having posted (Concurrency rule 5). Neither session on 07-31 had a row; on 08-01 both did, for other work.

### 3. Re-run step 1 immediately before you merge

The cheapest step and the one that keeps paying. On 07-31 it would have turned an hour of duplicated work into five minutes. On 08-01 the equivalent — re-reading HEAD before the second write — is the only reason the duplicate was caught at all.

### 4. Move your row the moment your scope moves

New files, new directory, new branch → **edit the row before the next write.** Fiona's moved four times in one session; that is correct behaviour, not fussiness. **This is fault 4's fix and it is the step most likely to be skipped**, because by then you are mid-flow and the row feels done.

---

## 🚨 Halt signals — errors that are already telling you

**These fire on their own. The failure is treating them as friction to route around instead of information.** This repo has already named the pattern in the deploy workflow: *the secrets step PRINTED 50 chars and carried a comment saying 32 was expected. The evidence was emitted and not acted on.* **AN OBSERVATION IS NOT A CHECK.**

| Signal | What it means | Do NOT |
|---|---|---|
| **`create_branch` → Reference already exists** | Someone chose your branch name for your work — probably because it is the obvious name for it. | **Adopt the branch and carry on.** |
| **`create_or_update_file` → 404 Branch not found** | You are writing before you cut the branch — so you are almost certainly writing before you claimed. | Cut it and keep going without claiming. |
| `merge_pull_request` → conflicts on a branch cut minutes ago | Someone landed in your files while you worked. | Rebase and force it through. |
| `create_or_update_file` → 409 / SHA mismatch | The file changed under you since you read it. | Re-fetch and re-apply blind. |
| File content not matching the SHA you hold | Same. | Trust the carried SHA. |
| **A file you are about to fix is already fixed** | A parallel session got there. **Stop and diff before writing anything.** | Assume you are looking at your own earlier edit. |

### 🔴 The two that actually happened

**2026-07-31, ~17:17.** `create_branch('inciardi-collection-v16-batch-json')` returned **Reference already exists**. I wrote *that branch already exists — checking what's on it*, listed its files, saw they matched `main`, and built for an hour. The other session's PR merged at **17:19**. Mine hit conflicts at **17:28**. That was the only signal available before any work was wasted, and it fired perfectly. I even investigated it — and checked the wrong thing. I asked *does this branch have content?* The question was **who made this, and are they still working?**

**2026-08-01, ~20:51.** No signal fired at all: two Felix sessions chose different branch names for the same work, so `create_branch` came back clean for both. What caught it was reading HEAD before the second file and finding the fix **already applied, in prose I had not written.** Thirteen seconds of separation.

> **A branch you did not create, named for the work you are about to do, is another session's claim.** And when no branch collides, **the content itself is the last signal** — a file that already says what you were about to make it say is not déjà vu.

---

## When this fires

**The gate (step 0) fires before EVERY repo write. Steps 1–2 fire per work item.** A work item is any coherent chunk you would describe to Michael as a thing you are doing: a feature, a version, an audit pass, a doc rewrite.

- Session starts → full check before the first build
- Michael asks for something new mid-session → **full check again**
- Scope grows into files you had not claimed → **move the row before the write** (step 4)
- About to merge → step 1 only
- Every individual write → the row must already be true

Skip the research steps for: reads, a one-line typo fix in a file you already hold and already claimed, workspace-only work touching no repo files. **The gate itself has no skip.** A workspace-only session still posts a row naming no files.

---

## Does NOT

- Close or clean up anyone else's branch or PR — destructive, and not this hook's business. Surface it to Michael.
- Replace C6. This is the read and the enforcement; C6 is the write. **Both fire.**
- Clear a row on suspicion. **Evidence, or leave it.**
- Fire for pure reads.

---

## Composes with

- **`hooks/session-open.md`** — C6 is the claim half; this is the check half and the gate
- **`hooks/stale-context-reload.md`** — a SHA mismatch is both a staleness problem and a collision signal
- **`hooks/commit-pre-flight.md`** — runs after this, on the write itself
- **`super-agents/_shared/super-agent-base.md`** — Concurrency rules 5–7 (empty ≠ clear; the session-board exception; delete on close)

---

## Failure modes this prevents

- **Two sessions building one feature.** 07-31, batch-import, ~1 hour duplicated.
- **Two sessions running the same REMEDIATION.** 08-01, the `roster.json` repoint, 13 seconds apart. Both had rows; neither row was current.
- **Two sessions writing one file.** 07-25, `_shared/super-agent-base.md` rewritten under a live audit while the board read *No active sessions* for 98 minutes.
- **A row that lies by being stale** — rows name a branch now, so a claim can be tested rather than trusted.
- **A collision signal explained away.** The halt-signals table.
- **A check that only runs when someone also remembers to announce.** Split in two.
- **A check that runs once, when scope is least predictive.** Per work item, and the gate per write.
- **A check built on a surface that looks authoritative and is dead.** The measured table above.

---

## Changelog

- **2026-08-01 — v2: THE HARD GATE.** Michael, after the fourth collision: *"make the board row a hard pre-write gate."* **Fault 4 is new and none of v1's three fixes address it — both colliding sessions HAD a row, for different work, and neither moved it.** So the gate now binds to the **write tool** rather than the session or the work item (a work item is a judgement call; a write is not), the claim moved from step 3 to **step 0** (the altruistic act was again sitting behind the self-interested ones), and **a row must name its BRANCH** so staleness is provable in one `list_commits` call. That last part is the real upgrade: the board's own diagnosis of its worst failure was *"nothing checks,"* and nothing could, because a prose row is an assertion with nothing to test it against. Clearing another session's row is now explicitly allowed **with evidence** — which is what finally makes "delete your row on close" enforceable by someone other than the person who forgot. Added two halt signals (a 404 on write = you never cut the branch, which means you never claimed; and *the fix is already applied* as the last-resort content signal, since on 08-01 no branch collided and nothing else fired).
- **2026-07-31 — created.** Two sessions built the batch-import feature simultaneously; discovered at merge. Third collision that week — [PR #602](https://github.com/mawizorek/ClickUp_apps/pull/602) shipped `/summary` one minute before the request for it arrived, and the 07-25 base-spec rewrite landed under a live audit. **C6 existed and neither session reached it.** The three design faults are at the top of this file. The two dead surfaces were measured rather than assumed — and the first draft of this hook was built on one of them before the numbers came in.
