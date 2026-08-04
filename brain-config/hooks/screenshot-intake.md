# Screenshot Intake Triage · AI Toolkit

**Purpose:** Reassemble a flat Dropbox screenshot dump into the **working sessions it was actually captured during**, so a pile of 200 timestamps becomes a handful of project clusters that can be reasoned about, deduped, and routed as units.

**Steward: Fleet Felix.** He owns the FILE — its correctness, its evolution, and the routing contract in Pass 3 (which is a fleet fact and therefore already his lane). **He does not own running it.** Execution is OWNERLESS, same as the Doc-Rot Sweep and the Fleet-Fact Sweep: any agent fires a pass mid-task with no persona seated. Two further splits: the **destination** doc/task is owned by whoever owns that domain, and a **formal, scoped, reported full-inbox pass IS an audit and SEIZES to Audit Anna**.

⚠️ **The steward does NOT change per space, per Space, or per content type.** The routing DESTINATION changes with the content; the hook's owner does not. If this file ever grows a second steward "for URITP shots" it has become two hooks and one of them will rot.

**Mode:** On-demand routine (batched). Never automatic — a folder that empties itself unattended is a folder Michael stops trusting.

**Invocation:** `/screenshot-intake` · `/shot-intake` · "sort my screenshots" · "group my screenshots" · "triage the screenshot inbox" · "what's in my screenshots folder"

**Trigger:** Michael names it, OR he references a screenshot he took without attaching it ("the shot I took of the light board") — in which case run a SEARCH-ONLY pass against the inbox and propose nothing.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-08-04** by Fleet Felix, at Michael's direction, scoped as a **sibling of the INBOX Email Intake Triage** rather than a net-new invention (Fold-in Frank: NET-NEW, sibling shape). Same skeleton, different input: an inbox, a grouping, a routing decision, a mandatory greenlight, a disposition.

---

## 🕐 THE TIMESTAMP IS EVIDENCE (MW 2026-08-04 — read before Pass 1)

**v1 of this file said "a filename tells you nothing." That is FALSE and Michael struck it.** `Screenshot 2026-07-13 at 12.04.25 PM.png` tells you the single most useful thing available before an image is ever opened: **exactly when it was captured.** That is the spine of the whole routine.

<p></p>

What the timestamp gives you, for free, across the entire folder at once:

- **Co-capture.** Two shots 40 seconds apart were almost certainly taken about the same thing. That is a relationship you can see before opening either one.
- **Working sessions.** A dense run of shots inside one afternoon is a work session. The session, not the file, is the real unit of meaning.
- **Boundaries.** A multi-hour or multi-day gap is a topic change. Gaps separate clusters as reliably as content does.
- **Sequence.** Within a cluster, order tells the story: a before, an attempt, an error, a fix. Renaming or reordering destroys that, which is why cluster order is preserved.
- **Correlation.** A cluster's date range can be matched against what was actually happening then — a task's activity, a build session, a production date, a Decision Log entry. **This is the strongest single signal for identifying the project, and it costs one date comparison.**

<p></p>

**The name is cheap evidence. The image is expensive evidence. Use the cheap evidence first to decide how to spend the expensive kind.** What a filename does NOT tell you is *what the shot shows* — that still requires opening it, and it is still never inferred from the name alone.

---

## 🔴 THE CULL RULE (MW 2026-08-04)

**Culling is OPT-IN, per run, and Michael opts in. It is never a default, never a tiebreaker, and never volunteered.**

- A standard pass groups and routes. It does not decide what dies.
- **HOLD is the default for anything uncertain.** Uncertain means: you cannot tell what it shows, you cannot tell which project it belongs to, or you think it might be redundant. All three resolve to *leave it exactly where it is and say why you were unsure.* Ambiguity is never evidence for removal.
- **Finding a duplicate is NOT a cull.** Duplicates are *grouped and reported* — that is a finding, and Michael decides what happens to it. Never conflate "these three are the same shot" with "two of these should go."
- Michael opts in by saying so: `/screenshot-intake --cull`, "flag culls too," "mark the dead ones." **Only then** does the pass propose a cull list, and even then every one is named with a reason and waits for greenlight.
- Even a greenlit cull is only ever a **rename in place**. Nothing moves. Nothing is deleted. Ever. By anyone but Michael.
- v1 said "default to CULL on a tie." **Michael struck it within the hour.** Kept struck rather than deleted because the reasoning was seductive and wrong: a tie means the agent does not know, and *an agent that does not know should not be deciding what disappears.*

---

## Coordinates

| Surface | Location |
| --- | --- |
| **Inbox (drop zone)** | Dropbox `/MAW/zSCREENSHOTS/manual_input` |
| **Keepers** | Dropbox `/MAW/zSCREENSHOTS/_keep` |
| **Aged-out keepers** | Dropbox `/MAW/zSCREENSHOTS/_archive` |
| **Owner resolution** | 🤖 **Agent Index** list — filter by `Lane`. NEVER a hardcoded routing table (see Guardrails). |
| **Cluster correlation** | ClickUp task/doc activity + Decision Logs + the Agent Activity Board, matched on the cluster's date range |
| **Sibling routine** | INBOX Email Intake Triage — Agent Reference (URITP ▸ INBOX) |
| **Read/write tools** | `dropboxmcp_list_folder` · `dropboxmcp_search` · `dropboxmcp_download_link` · `dropboxmcp_move` (rename = move) |

---

## PASS 1 — CLUSTER (the first pass, and it decides nothing)

**Pass 1 answers ONE question: what belongs with what.** It does not keep, route, cull, rename, or move anything. Its entire output is a map of the folder. Michael's framing, verbatim: *"You aren't necessarily keeping or deleting them, but finding duplicates and lumping them together so that the assignment to other projects is more straightforward."*

### 1a — Pull the index, no images yet

`list_folder` the inbox, `recursive: false`, paginate to `has_more: false`. You now have every filename, `modified_time`, and size. **This is a real dataset and it is free.** Sort it chronologically and work it before opening a single image.

### 1b — Separate STRAYS

Anything that is not a screenshot — PDF, zip, tsv, `.crwebloc`, UUID-named file, a real photo — is a routing problem, not a grouping problem. Pull it aside and keep it out of clustering. It still gets reported.

### 1c — Build the time skeleton

Walk the sorted list and cut a boundary wherever the gap between consecutive shots is large. Rough, deliberately not a fixed constant:

| Gap to the next shot | Read it as |
| --- | --- |
| under ~2 min | **burst** — one action, one screen, one moment |
| ~2 min to ~2 hrs | same **working session**, still one thread of thought |
| ~2 hrs to same day | possibly related, possibly a new topic — needs content to decide |
| next day or later | **different session.** Treat as separate until content says otherwise |

**These are heuristics, not law.** Michael works overnight and across long sessions; a 3-hour gap at 4am is not the same signal as a 3-hour gap on a Tuesday afternoon. **Time proposes the grouping. Content confirms or breaks it.**

### 1d — Open images to confirm the seams, not to catalogue

Budget the reads. For each candidate cluster open **the first, the last, and one from the middle** — enough to answer "is this actually one thing?" Only open the rest of a cluster when the samples disagree with each other. This is what makes a 205-file folder tractable inside one pass: you are verifying ~3 images per cluster, not 205.

<p></p>

Merge two adjacent clusters when the content is obviously continuous across a gap. Split one when the middle sample is plainly a different subject. **Say which clusters you split or merged and why** — that judgement is the most falsifiable thing in the pass.

### 1e — Name the project

For each cluster, identify what it is about. Ladder, stop at the first hit:

1. **Content** — the images say what they are (a specific app, a light board, a schema, a listing).
2. **Date correlation** — match the cluster's range against what was actually happening then: task activity, a Decision Log entry, a build session, an Activity Board post, a production date. Often decisive on its own.
3. **Adjacency** — an unlabelled cluster wedged between two identified ones, minutes apart, is usually the same work.
4. **UNIDENTIFIED** — a real, acceptable outcome. Say so. Never invent a project to make the map look complete.

### 1f — Find duplicates INSIDE and ACROSS clusters

Group them, do not judge them. Three kinds, and they are different findings:

- **Burst near-dupes** — the same screen shot several times in seconds. Usually one keeper's worth of content, but that is Michael's call.
- **Re-captures** — the same subject shot on different dates. **This is a signal, not waste:** it means the thing changed, or it kept coming up. A before/after pair is worth more than either half.
- **Already-captured** — the shot's content already lives in a task, doc, or the repo. Report the pointer. **Still not a cull** (see THE CULL RULE).

### 1g — Report the map. STOP.

Pass 1 ends with a **CLUSTER MAP** and nothing else. No renames, no moves, no dispositions, no proposals about anyone's fate. Michael reads the map and says what to do with which clusters.

> **SCREENSHOT CLUSTER MAP**
> **Scanned:** `<n>` files · `<oldest>` → `<newest>` · **Images opened:** `<n>` of `<n>`
> **Strays (not screenshots):** `<n>` — listed separately
> <p></p>
> **CLUSTER `<n>` · `<project or UNIDENTIFIED>`**
> `<n>` shots · `<date/time range>` · `<"one 4-minute burst" | "a 3-hour session" | "recurring across 5 weeks">`
> What it appears to be: `<one line>`
> Identified by: `content | date correlation → <what it matched> | adjacency | not identified`
> Duplicates inside: `<n>` — `<burst near-dupes | re-captures on <dates> | already captured on <task/doc + link>>`
> Likely lane: `<resolved from Agent Index, or "unresolved">`
> <p></p>
> **Splits/merges made:** `<what and why, or "none">`
> **Unresolved:** `<clusters you could not identify and what you'd need to>`
> Which clusters do you want worked, and how?

---

## PASS 2 — DISPOSITION (only on Michael's instruction, cluster by cluster)

Pass 2 runs **only** on clusters Michael names, and it operates on the **cluster as the unit**, not the file. Buckets:

| Bucket | Meaning | Disposition |
| --- | --- | --- |
| **KEEP** | Durable reference value (a schema, a rig plot, a rate card, a UI pattern) | → `_keep`, renamed |
| **ROUTE** | Implies work or a decision (an error state, a quote, a deadline, a bug) | → propose the task/comment on the canonical record FIRST, then `_keep` |
| **STRAY** | Not a screenshot | → propose its real home |
| **HOLD** | Unclear content, unclear project, or possibly redundant | → **stays put**, listed with the reason |
| **CULL** | *Opt-in only.* Michael asked for cull flagging this run | → renamed in place per the Deletion-Flag Gate; **Michael deletes** |

---

## PASS 3 — Resolve the owner (do NOT guess, do NOT hardcode)

Name the domain owner by querying the **Agent Index** `Lane` field at read time. Production ops, FileMaker schema, repo architecture, ClickUp structure, real-estate, course delivery, professional history — each has a live owner and **this file must never state who.** A routing table written here is a fleet fact copied into a neighbouring file: exactly the rot the Known-Drift Register exists to catch (D14).

If no lane matches, it is a HOLD, not a cull. An unowned cluster is a real finding.

---

## PASS 4 — Rename on promotion (MANDATORY for anything entering `_keep`)

```
YYYY-MM-DD · <project/lane> · <what it actually shows> [· NN of NN].png
```

**Preserve the capture date from the ORIGINAL filename**, never today's. **Preserve cluster order** with the trailing `NN of NN` when a sequence tells a story (before → attempt → error → fix); a sequence renamed out of order is a destroyed sequence. Never invent content that is not visibly in the image.

---

## PASS 5 — Cull flagging (SKIP ENTIRELY unless Michael opted in this run)

Deletion-Flag Gate verbatim: rename to `🔴 DELETE ME — <what it was> (<why>)`. The file stays where it is, so one name-sort surfaces the block for a single sweep. **The agent renames. Michael deletes. Always.**

---

## PASS 6 — Plan Comment + MANDATORY GREENLIGHT

Inherited from the sibling routine, non-negotiable, and **separate from the Pass 1 map** (the map is a finding; this is a proposal to change bytes). Post it, then **stop**:

> **SCREENSHOT INTAKE PLAN**
> **Clusters being worked:** `<which, per Michael's instruction>`
> **Cull flagging:** `OFF (default)` | `ON (requested)`
> **→ KEEP:** `<count>` — each with proposed new name + resolved owner
> **→ ROUTE:** `<count>` — each with the exact destination task/doc, full title + link
> **→ STRAY:** `<count>` — each with its proposed real home
> **→ HOLD:** `<count>` — each with the reason it is unresolved
> **→ 🔴 CULL:** `<count or "not requested">` — each with the reason
> **Watch-outs:** DRIFT / DUPES / PATTERNS — `<or "none">`
> Greenlight to execute?

**Name every destination explicitly — full title AND link.** Never "the production task." A wrong-destination mishap gets caught in the plan or not at all.

---

## PASS 7 — On greenlight, execute

RELOAD this file that turn (the greenlight message is not the procedure), then run Passes 3–5 in order. Batch renames into one `dropboxmcp_move` call where possible. Report what moved, what was renamed, what was left on HOLD, and what was already handled.

---

## Guardrails

- 🚫 **NEVER delete a file.** Not one, not ever, not on request. Flag and hand it to Michael.
- 🚫 **NEVER propose a cull unasked.** Uncertainty resolves to HOLD, always. A duplicate is a finding, not a verdict.
- 🚫 **NEVER let Pass 1 change a byte.** Clustering is a read-only mapping exercise. If a rename happens during Pass 1, the pass was run wrong.
- 🚫 **NEVER create a shared link on these folders.** `create_shared_link` converts a plain folder into a shared-folder mount and changes its namespace path. Serve `dropbox.com/home/<path>` navigation URLs instead.
- 🚫 **NEVER add topic subfolders.** Clusters are a REPORTING structure, not a filing structure. Three folders is the design.
- 🚫 **NEVER hardcode the fleet routing table into this file.** Resolve at read time.
- ⚠️ **Never assert what a screenshot shows without having opened it.** The timestamp tells you when and what-with; only the image tells you what.
- ⚠️ **Never break a sequence.** Cluster order carries meaning; preserve it in the rename.
- ⚠️ **Volatile content inside a shot is still volatile.** Hours, prices, availability, staffing go through the Source Freshness Gate — and a screenshot Michael took is often the FRESHEST source, outranking what you already committed to.
- ⚠️ **PII/credentials.** Screenshots catch inboxes, DMs, student data, and logins by accident. Anything with a credential or identifiable student data never leaves Dropbox into the repo, a public channel, or a shipped artifact.
- The inbox is allowed to be messy. That is its job. Do not tidy it unasked.

---

## Composes with

- **INBOX Email Intake Triage** — the sibling. Same skeleton, different input. Divergences are deliberate: a clustering pass ahead of disposition, no transcription step, no MOVE/COMBINE binary, no closing, culls opt-in.
- **Attachment Router** — fires when a shot is pasted into chat. This hook is the FOLDER-scale counterpart; the Router handles one file in flight.
- **Deletion-Flag Gate** — owns the cull rename format. Pass 5 is a pointer, not a copy.
- **Task Dedup Gate / Doc Dedup & Placement Gate** — fire before anything routed becomes a new task or page.
- **Source Freshness Gate** — fires on any volatile fact read off an image.
- **Secrets / PII Guard** — fires before any shot's content crosses into the repo.

---

## Changelog

- **v3 (2026-08-04)** — **The first pass is now CLUSTERING, and the timestamp is evidence.** Michael: *"Saying that the filename gives us nothing is false; it tells us exactly when the screenshot was taken, which is critical for storytelling."* Struck that line, added THE TIMESTAMP IS EVIDENCE, and restructured the routine into Pass 1 (read-only cluster map: time skeleton → sampled confirmation → project identification → duplicate grouping → STOP) ahead of any disposition. Duplicates are now explicitly a FINDING, never a cull trigger. Renames preserve cluster sequence. Michael picks which clusters get worked; the file is no longer the unit, the session is.
- **v2 (2026-08-04)** — **Culling demoted to opt-in.** Michael, one hour after v1: *"I also don't want you automatically culling things!"* Struck "default to CULL on a tie," added the HOLD bucket for all uncertainty, added THE CULL RULE at the top. Named **Fleet Felix** steward of the file (execution stays ownerless) and stated the steward does not vary by space or content type.
- **v1 (2026-08-04)** — Established by Fleet Felix at Michael's direction ("sibling of INBOX triage, write it"). Built against a real 205-file backlog.
