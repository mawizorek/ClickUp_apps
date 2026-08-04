# Screenshot Intake Triage · AI Toolkit

**Purpose:** Reassemble a flat Dropbox screenshot dump into the **working sessions it was actually captured during**, so a pile of 200 timestamps becomes a handful of project clusters that can be reasoned about, deduped, and routed as units.

**Steward: Fleet Felix.** He owns the FILE — its correctness, its evolution, and the Pass 3 routing contract (a fleet fact, already his lane). **He does not own running it.** Execution is OWNERLESS, same as the Doc-Rot Sweep: any agent fires a pass mid-task with no persona seated. Two splits: the **destination** doc/task belongs to whoever owns that domain, and a **formal, scoped, reported full-inbox pass IS an audit and SEIZES to Audit Anna**.

⚠️ **The steward does NOT change per space or content type.** The routing DESTINATION changes with the content; the owner does not. A second steward "for URITP shots" means this became two hooks and one will rot.

**Mode:** On-demand, batched, multi-pass. Never automatic.

**Invocation:** `/screenshot-intake` · `/shot-intake` · "sort my screenshots" · "group my screenshots" · "triage the screenshot inbox"

**Trigger:** Michael names it, OR he references a screenshot he took without attaching it — in which case run a SEARCH-ONLY pass and propose nothing.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Companion:** `hooks/screenshot-intake.report-spec.md` — the CLUSTER MAP form. **Load it before reporting. Never invent report structure.**

**Established 2026-08-04** by Fleet Felix, as a **sibling of the INBOX Email Intake Triage** (Fold-in Frank: NET-NEW, sibling shape).

---

## 🚦 THE CAPACITY GATE (MW 2026-08-04 — declare BEFORE working, not after)

**Yes, 200 images is too many for one pass. No, the fix is not "the first 50."**

<p></p>

**The index scan is CHEAP and is ALWAYS done WHOLE.** Filenames, timestamps and sizes for the entire folder cost almost nothing, and the time skeleton built from them is what makes everything else tractable. **A partial index scan is never acceptable** — it produces a map with an invisible edge, and the next agent inherits a boundary that came from a budget rather than from the work.

<p></p>

**Images are the expensive resource, and they are spent per CLUSTER, not per file.** A fixed file count is the wrong unit: *cutting at file 50 cuts a working session in half, which destroys the exact thing Pass 1 exists to find.* **Work clusters until the budget is spent, then stop ON A CLUSTER BOUNDARY. Never mid-cluster.**

<p></p>

**Declare capacity BEFORE opening a single image**, in the first reply of the run:

> **Capacity declaration.** `<n>` files in the folder, `<n>` clusters detected from timestamps. Image budget this pass: **`<n>` opens**. That covers clusters `<a>–<b>` (`<n>` files). Remaining `<n>` clusters carry to pass 2 via a handoff task. Proceeding?

<p></p>

**Provisional budget: ~40 image opens per pass. ⚠️ THIS NUMBER IS CALCULATED, NOT MEASURED.** Per the house rule (Breaker Beckett, Source-Size Budget Enforcer J5): *ask whether a number has been MEASURED or only CALCULATED before treating it as real.* **The first live run MUST record what it actually consumed and where it started to degrade, and that measurement replaces this line.** Until then 40 is a guess wearing a decimal point.

<p></p>

**Degradation is a soft signal, not a hard stop.** If descriptions start getting vaguer, or you are pattern-matching filenames instead of looking, **stop at the current cluster boundary and say so out loud.** A pass that admits it thinned out is worth more than one that quietly did.

<p></p>

🚫 **Never silently truncate.** "I did the first 50" without having declared it up front is the failure this gate exists to prevent. The number is announced before the work, not discovered in the report.

---

## ↪️ THE HANDOFF (a real task, not a promise)

A multi-pass job that lives only in chat is a job that gets re-derived from scratch. When a pass ends with clusters remaining:

1. **Open or update a session task** on the 🟢 Agent Activity Board, per its Gold Standard. Name it to the house pattern: `↪️ HANDOFF · <model or "unassigned"> · Screenshot intake pass <N+1> · <date parked>`.
2. **The full time skeleton travels in the description** — every cluster id, span, file count, and whether it has been worked. **The next pass does NOT recompute it.** Recomputing invites renumbering, and renumbering breaks every reference in the previous map.
3. **Cluster ids are immutable across passes.** `C07` is `C07` forever.
4. **Post each pass's CLUSTER MAP as a comment** on that task. The maps accrete; the task is the record.
5. **Park it at `to do`.** That status means *nobody is driving this yet*, which is exactly true.
6. **Say what the next pass starts with**, by cluster id, in one line. A handoff that says "continue" is not a handoff.

<p></p>

**Michael triggers pass 2.** It never fires itself.

---

## 🕐 THE TIMESTAMP IS EVIDENCE (MW 2026-08-04)

**v1 said "a filename tells you nothing." That is FALSE and Michael struck it.** `Screenshot 2026-07-13 at 12.04.25 PM.png` tells you exactly when it was captured, which is the spine of the whole routine.

- **Co-capture.** Two shots 40 seconds apart are about the same thing. A relationship visible before opening either.
- **Working sessions.** A dense run inside one afternoon is a session. The session, not the file, is the unit of meaning.
- **Boundaries.** A long gap is a topic change. Gaps separate clusters as reliably as content does.
- **Sequence.** Within a cluster, order tells the story: a before, an attempt, an error, a fix.
- **Correlation.** A cluster's date range matched against what was actually happening then — task activity, a Decision Log entry, a build session, a production date. **Strongest single project-ID signal, and it costs one date comparison.**

<p></p>

**The name is cheap evidence. The image is expensive evidence. Use the cheap kind to decide how to spend the expensive kind.** What a filename does NOT tell you is *what the shot shows* — still requires opening it, still never inferred from the name.

---

## 🔴 THE CULL RULE (MW 2026-08-04)

**Culling is OPT-IN, per run, and Michael opts in. Never a default, never a tiebreaker, never volunteered.**

- A standard pass groups and routes. It does not decide what dies.
- **HOLD is the default for anything uncertain** — cannot tell what it shows, cannot tell which project, might be redundant. All three mean *leave it exactly where it is and say why you were unsure.* Ambiguity is never evidence for removal.
- **Finding a duplicate is NOT a cull.** Duplicates are grouped and reported; Michael decides. Never conflate "these three are the same" with "two should go."
- Opt in explicitly: `/screenshot-intake --cull`, "flag culls too." Only then does a cull list exist, and every entry still needs a reason and a greenlight.
- Even greenlit, a cull is a **rename in place**. Nothing moves. Nothing is deleted. Ever. By anyone but Michael.
- v1 said "default to CULL on a tie." **Struck within the hour.** Kept struck because the reasoning was seductive and wrong: a tie means the agent does not know, and *an agent that does not know should not be deciding what disappears.*

---

## Coordinates

| Surface | Location |
| --- | --- |
| **Inbox (drop zone)** | Dropbox `/MAW/zSCREENSHOTS/manual_input` |
| **Keepers** | Dropbox `/MAW/zSCREENSHOTS/_keep` |
| **Aged-out keepers** | Dropbox `/MAW/zSCREENSHOTS/_archive` |
| **Report form** | `hooks/screenshot-intake.report-spec.md` |
| **Owner resolution** | 🤖 **Agent Index** — filter by `Lane`. NEVER hardcoded here. |
| **Cluster correlation** | ClickUp task/doc activity + Decision Logs + the Agent Activity Board, matched on the cluster's date range |
| **Handoff / record** | 🟢 Agent Activity Board session task |
| **Sibling routine** | INBOX Email Intake Triage (URITP ▸ INBOX) |
| **Tools** | `dropboxmcp_list_folder` · `dropboxmcp_search` · `dropboxmcp_download_link` · `dropboxmcp_move` (rename = move) |

---

## PASS 1 — CLUSTER (read-only, decides nothing)

**Pass 1 answers ONE question: what belongs with what.** No keeping, routing, culling, renaming or moving. Michael's framing, verbatim: *"You aren't necessarily keeping or deleting them, but finding duplicates and lumping them together so that the assignment to other projects is more straightforward."*

### 1a — Index the WHOLE folder, no images

`list_folder`, `recursive: false`, paginate to `has_more: false`. Sort chronologically. **This is a real dataset and it is free.**

### 1b — Separate STRAYS

Not a screenshot (PDF, zip, tsv, `.crwebloc`, UUID-named, a real photo) = a routing problem, not a grouping problem. Set aside, still reported.

### 1c — Build the time skeleton (whole folder)

Cut a boundary at each large gap:

| Gap to next shot | Read as |
| --- | --- |
| under ~2 min | **burst** — one action, one screen, one moment |
| ~2 min – ~2 hrs | same **working session** |
| ~2 hrs – same day | possibly related — needs content to decide |
| next day or later | **different session** until content says otherwise |

**Heuristics, not law.** Michael works overnight; a 3-hour gap at 4am is not a 3-hour gap on a Tuesday afternoon. **Time proposes; content confirms or breaks.**

### 1d — Declare capacity, then sample

Run **THE CAPACITY GATE** now — the skeleton is what makes the declaration honest. Then, per cluster inside budget, open **the first, the last, and one from the middle**. Only open more when the samples disagree. That is what makes 205 files tractable: ~3 opens per cluster, not 205.

<p></p>

Merge adjacent clusters when content is continuous across a gap; split when the middle sample is a different subject. **Say what you split or merged and why** — the most falsifiable judgement in the pass.

### 1e — Name the project (ladder, stop at first hit)

1. **Content** — the images say what they are.
2. **Date correlation** — match the span against task activity, a Decision Log entry, a build session, a production date. Often decisive alone.
3. **Adjacency** — an unlabelled cluster wedged minutes between two identified ones is usually the same work.
4. **UNIDENTIFIED** — a real, acceptable outcome. **Never invent a project to make the map look complete.**

### 1f — Group duplicates (do not judge them)

- **Burst near-dupes** — same screen, seconds apart.
- **Re-captures** — same subject, different dates. **SIGNAL, not waste:** the thing changed, or it kept coming up. A before/after pair is worth more than either half.
- **Already-captured** — content already lives in a task, doc, or the repo. Report the pointer. Still not a cull.

### 1g — Report and STOP

Load `screenshot-intake.report-spec.md` and fill the CLUSTER MAP form verbatim. Post it as a comment on the session task; give Michael the highlights in prose. **No renames, no moves, no dispositions, no proposals about anyone's fate.**

---

## PASS 2 — DISPOSITION (only on Michael's instruction, cluster by cluster)

Runs **only** on clusters Michael names. The **cluster is the unit**, not the file.

| Bucket | Meaning | Disposition |
| --- | --- | --- |
| **KEEP** | Durable reference (schema, rig plot, rate card, UI pattern) | → `_keep`, renamed |
| **ROUTE** | Implies work or a decision (error state, quote, deadline, bug) | → propose the task/comment on the canonical record FIRST, then `_keep` |
| **STRAY** | Not a screenshot | → propose its real home |
| **HOLD** | Unclear content, unclear project, possibly redundant | → **stays put**, with the reason |
| **CULL** | *Opt-in only* | → renamed in place per the Deletion-Flag Gate; **Michael deletes** |

---

## PASS 3 — Resolve the owner (do NOT guess, do NOT hardcode)

Query the **Agent Index** `Lane` field at read time. Production ops, FileMaker schema, repo architecture, ClickUp structure, real-estate, course delivery, professional history — each has a live owner and **this file must never state who.** A routing table written here is a fleet fact copied into a neighbouring file: exactly the rot the Known-Drift Register catches (D14).

No lane match = HOLD, not cull. An unowned cluster is a real finding.

---

## PASS 4 — Rename on promotion (MANDATORY into `_keep`)

```
YYYY-MM-DD · <project/lane> · <what it actually shows> [· NN of NN].png
```

**Capture date from the ORIGINAL filename**, never today's. **Preserve cluster order** with `NN of NN` when a sequence tells a story; a sequence renamed out of order is a destroyed sequence. Never invent content not visibly in the image.

---

## PASS 5 — Cull flagging (SKIP unless Michael opted in this run)

Deletion-Flag Gate verbatim: `🔴 DELETE ME — <what it was> (<why>)`, renamed in place so one name-sort surfaces the block. **Agent renames. Michael deletes. Always.**

---

## PASS 6 — Plan Comment + MANDATORY GREENLIGHT

Separate from the Pass 1 map (that is a finding; this proposes changing bytes). Post it, then **stop**:

> **SCREENSHOT INTAKE PLAN**
> **Clusters being worked:** `<per Michael's instruction>`
> **Cull flagging:** `OFF (default)` | `ON (requested)`
> **→ KEEP:** `<count>` — each with proposed new name + resolved owner
> **→ ROUTE:** `<count>` — each with the exact destination task/doc, full title + link
> **→ STRAY:** `<count>` — each with its proposed real home
> **→ HOLD:** `<count>` — each with the reason
> **→ 🔴 CULL:** `<count or "not requested">` — each with the reason
> **Watch-outs:** DRIFT / DUPES / PATTERNS — `<or "none">`
> Greenlight to execute?

**Name every destination explicitly — full title AND link.** Never "the production task."

---

## PASS 7 — On greenlight, execute

RELOAD this file that turn (the greenlight message is not the procedure), then run Passes 3–5 in order. Batch renames into one `dropboxmcp_move` call where possible. Report what moved, what was renamed, what stayed on HOLD, and update the handoff task.

---

## Guardrails

- 🚫 **NEVER delete a file.** Not one, not ever, not on request.
- 🚫 **NEVER propose a cull unasked.** Uncertainty → HOLD. A duplicate is a finding, not a verdict.
- 🚫 **NEVER let Pass 1 change a byte.** A rename during Pass 1 means the pass ran wrong.
- 🚫 **NEVER truncate silently.** Declare capacity before working; stop on a cluster boundary.
- 🚫 **NEVER partial-scan the index.** Cheap, and a partial map has an invisible edge.
- 🚫 **NEVER renumber clusters across passes.**
- 🚫 **NEVER create a shared link on these folders.** `create_shared_link` converts a folder to a mount and changes its namespace path. Use `dropbox.com/home/<path>` navigation URLs.
- 🚫 **NEVER add topic subfolders.** Clusters are a REPORTING structure, not a filing structure. Three folders is the design.
- 🚫 **NEVER hardcode the fleet routing table here.**
- ⚠️ **Never assert what a shot shows without opening it.** The timestamp says when and what-with; only the image says what.
- ⚠️ **Never break a sequence.** Cluster order carries meaning.
- ⚠️ **Volatile content is still volatile.** Hours, prices, availability, staffing go through the Source Freshness Gate — and a screenshot Michael took is often the FRESHEST source, outranking what you already committed to.
- ⚠️ **PII/credentials.** Screenshots catch inboxes, DMs, student data and logins by accident. Nothing with a credential or identifiable student data leaves Dropbox into the repo, a public channel, or a shipped artifact.
- The inbox is allowed to be messy. That is its job.

---

## Composes with

- **`screenshot-intake.report-spec.md`** — the report form. Load before reporting.
- **INBOX Email Intake Triage** — the sibling. Deliberate divergences: a clustering pass ahead of disposition, no transcription step, no MOVE/COMBINE binary, no closing, culls opt-in.
- **Agent Activity Board — Gold Standard** — owns the session/handoff task shape. This hook points, never copies.
- **Attachment Router** — one file in flight; this is the folder-scale counterpart.
- **Deletion-Flag Gate** — owns the cull rename format.
- **Task Dedup Gate / Doc Dedup & Placement Gate** — fire before anything routed becomes a task or page.
- **Source Freshness Gate** · **Secrets / PII Guard** — as noted in Guardrails.

---

## Changelog

- **v4 (2026-08-04)** — **Capacity gate + real handoff + report spec split out.** Michael: *"Is 200 screenshots too many to assume one path can look at?... how do we build that soft gate and true handoff?"* Answer written in: the index scan is always WHOLE (cheap, and a partial map has an invisible edge), images are budgeted, and a pass stops **on a cluster boundary, never at a file count** — cutting at file 50 halves a working session, destroying what Pass 1 exists to find. Capacity is DECLARED before any image opens. Provisional budget ~40 opens, **explicitly labelled CALCULATED not MEASURED**, with the first live run required to replace it. Handoff is a real Activity Board task carrying the immutable skeleton, not a promise in chat. Report form moved to `screenshot-intake.report-spec.md` so a cold agent copies a form instead of inventing one, and so this file stays under the measured ~22KB read-whole ceiling.
- **v3 (2026-08-04)** — **First pass is CLUSTERING; the timestamp is evidence.** Michael: *"Saying that the filename gives us nothing is false."* Struck it, added THE TIMESTAMP IS EVIDENCE, restructured into a read-only cluster map ahead of any disposition. Duplicates are a FINDING, never a cull trigger. Renames preserve sequence.
- **v2 (2026-08-04)** — **Culling demoted to opt-in.** Michael: *"I also don't want you automatically culling things!"* Struck "default to CULL on a tie," added the HOLD bucket, added THE CULL RULE. Named Fleet Felix steward; execution stays ownerless.
- **v1 (2026-08-04)** — Established by Fleet Felix at Michael's direction. Built against a real 205-file backlog.
