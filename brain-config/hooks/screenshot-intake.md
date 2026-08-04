# Screenshot Intake Triage · AI Toolkit

**Purpose:** Reassemble a flat Dropbox screenshot dump into the **working sessions it was actually captured during**, so a pile of hundreds of timestamps becomes a handful of project clusters that can be reasoned about, deduped, and routed as units.

🔴 **READ `screenshot-intake.BLOCKER.md` BEFORE PASS 2.** Dropbox image content is currently UNREADABLE by any available tool path (MEASURED 2026-08-04, two paths, one real file). Pass 1 works fine and needs no images. Pass 2 cannot honestly assign KEEP/ROUTE by content until Michael rules on a read path.

**Steward: Fleet Felix.** He owns the FILE — correctness, evolution, and the Pass 3 routing contract (a fleet fact, already his lane). **He does not own running it.** A one-off mid-task check is OWNERLESS, same as the Doc-Rot Sweep. Two splits: the **destination** belongs to whoever owns that domain, and a **formal, scoped, reported full-backlog pass IS an audit and SEIZES to Audit Anna** — which is the shape almost every real run takes.

⚠️ **The steward does NOT change per space or content type.** The DESTINATION changes with the content; the owner does not.

**Mode:** On-demand, batched, multi-pass. Never automatic.

**Invocation:** `/screenshot-intake` · `/shot-intake` · "sort my screenshots" · "group my screenshots" · "triage the screenshot inbox"

**Trigger:** Michael names it, OR he references a screenshot he took without attaching it — in which case run a SEARCH-ONLY pass and propose nothing.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Companions — load all three:**
- `screenshot-intake.report-spec.md` — the CLUSTER MAP form. **Never invent report structure.**
- `screenshot-intake.continuity.md` — pickup contract, subject threads, future correlation.
- `screenshot-intake.BLOCKER.md` — the open image-read blocker.

**Established 2026-08-04** by Fleet Felix, as a **sibling of the INBOX Email Intake Triage** (Fold-in Frank: NET-NEW, sibling shape).

---

## 🚦 THE CAPACITY GATE (declare BEFORE working, not after)

**Hundreds of images is too many for one pass. The fix is not "the first 50."**

**The index scan is CHEAP and is ALWAYS done WHOLE.** Filenames, timestamps and sizes for the entire folder cost almost nothing, and the skeleton built from them makes everything else tractable. **A partial index scan is never acceptable** — it produces a map with an invisible edge that the next agent inherits as if it were real.

<p></p>

⚠️ **`has_more: false` IS NOT PROOF THE COUNT IS COMPLETE (MEASURED 2026-08-04).** A read at `max_results: 300` returned `has_more: false` and reported ~205 files. A second read at a larger page size returned **257**. Every capacity estimate in that build was computed against a wrong number that looked terminated. **Always request a page size well ABOVE the expected total, and if a prior count exists, cross-check and reconcile before trusting either.** State the count's evidence class.

<p></p>

**Images are the expensive resource, and they are spent per CLUSTER, not per file.** A fixed file count is the wrong unit: *cutting at file 50 cuts a working session in half, which destroys the exact thing Pass 1 exists to find.* **Work clusters until the budget is spent, then stop ON A CLUSTER BOUNDARY.**

<p></p>

**Declare capacity BEFORE opening a single image**, in the first reply of the run:

> **Capacity declaration.** `<n>` files, `<n>` clusters detected. Image budget: **`<n>` opens**, covering clusters `<a>–<b>`. Remaining `<n>` clusters carry to pass 2 via the session task. Direction: `oldest-first | newest-first`. Proceeding?

<p></p>

**DIRECTION IS DECLARED, NOT ASSUMED.** Oldest-first drains rot; **newest-first is usually better** because recent clusters correlate to sessions still live in the workspace, making them the cheapest to identify and the most likely to still matter. Say which and why.

<p></p>

**Provisional budget: ~40 image opens per pass. ⚠️ CALCULATED, NOT MEASURED**, and still unmeasured as of v5 because the blocker prevented the first real spend. The first pass that actually opens images MUST record what it consumed and where it degraded, and replace this line.

<p></p>

🚫 **Never silently truncate.** The number is announced before the work, not discovered in the report.

---

## ↪️ HANDOFF & PICKUP

Full contract: **`screenshot-intake.continuity.md` §1.** The short version, because it is not optional:

- A multi-pass job lives on a **session task on the 🟢 Agent Activity Board**, per its Gold Standard.
- **The immutable skeleton travels in the description.** Never recomputed — recomputing invites renumbering, and renumbering breaks every reference in every prior map.
- **Cluster ids are immutable across passes.** `C07` is `C07` forever.
- **Every reply ends with the task link.** "Pick this up" must work cold, with no orienting questions.
- **Update the task BEFORE the reply**, never after.
- Michael triggers the next pass. It never fires itself.

---

## 🕐 THE TIMESTAMP IS EVIDENCE

**v1 said "a filename tells you nothing." That is FALSE and Michael struck it** — and the blocker has since made it the only working evidence source, which is a stronger vindication than intended.

- **Co-capture.** Two shots 40 seconds apart are about the same thing.
- **Working sessions.** A dense run in one afternoon is a session. The session, not the file, is the unit of meaning.
- **Boundaries.** A long gap is a topic change.
- **Sequence.** Within a cluster, order tells the story: a before, an attempt, an error, a fix.
- **Correlation.** A cluster's date range matched against what was happening then — task activity, a Decision Log entry, a build session, a production date. **Strongest project-ID signal available, and it costs one date comparison.**

<p></p>

**The name is cheap evidence. The image is expensive evidence. Use the cheap kind to decide how to spend the expensive kind.** What a filename does NOT tell you is *what the shot shows*.

---

## 🔴 THE CULL RULE

**Culling is OPT-IN, per run, and Michael opts in. Never a default, never a tiebreaker, never volunteered.**

- A standard pass groups and routes. It does not decide what dies.
- **HOLD absorbs ALL uncertainty** — unclear content, unclear project, possibly redundant. All three mean *leave it exactly where it is and say why you were unsure.*
- **Finding a duplicate is NOT a cull.** Duplicates are grouped and reported; Michael decides.
- Opt in explicitly: `--cull`, "flag culls too." Even then every entry needs a reason and a greenlight.
- Even greenlit, a cull is a **rename in place**. Nothing moves. Nothing is deleted. Ever. By anyone but Michael.
- v1 said "default to CULL on a tie." **Struck within the hour.** Kept struck because the reasoning was seductive and wrong: *an agent that does not know should not be deciding what disappears.*

---

## Coordinates

| Surface | Location |
| --- | --- |
| **Inbox** | Dropbox `/MAW/zSCREENSHOTS/manual_input` |
| **Keepers** | Dropbox `/MAW/zSCREENSHOTS/_keep` |
| **Aged-out** | Dropbox `/MAW/zSCREENSHOTS/_archive` |
| **Report form** | `screenshot-intake.report-spec.md` |
| **Continuity** | `screenshot-intake.continuity.md` |
| **Blocker** | `screenshot-intake.BLOCKER.md` |
| **Owner resolution** | 🤖 **Agent Index** — filter by `Lane`. NEVER hardcoded here. |
| **Correlation** | ClickUp task/doc activity + Decision Logs + the Agent Activity Board, matched on cluster date range |
| **Record / handoff** | 🟢 Agent Activity Board session task |
| **Tools** | `dropboxmcp_list_folder` · `dropboxmcp_search` · `dropboxmcp_move` (rename = move). ⚠️ `download_link` + `get_file_content` do NOT yield image content — see BLOCKER. |

---

## PASS 1 — CLUSTER (read-only, decides nothing, needs NO images)

**Answers ONE question: what belongs with what.** Michael's framing: *"You aren't necessarily keeping or deleting them, but finding duplicates and lumping them together so that the assignment to other projects is more straightforward."*

**1a — Index the WHOLE folder.** `recursive: false`, page size well above the expected total, cross-check any prior count. Sort chronologically.

**1b — Separate STRAYS.** Not a screenshot (PDF, zip, tsv, `.crwebloc`, UUID-named, a real photo) = a routing problem, not a grouping problem. Set aside; still reported.

**1c — Build the time skeleton (whole folder).** Cut a boundary at each large gap:

| Gap | Read as |
| --- | --- |
| under ~2 min | **burst** — one action, one screen, one moment |
| ~2 min – ~2 hrs | same **working session** |
| ~2 hrs – same day | possibly related — needs content to decide |
| next day or later | **different session** until content says otherwise |

**Heuristics, not law.** Michael works overnight; sessions cross midnight routinely. **Time proposes; content confirms.**

**1d — Subject threads (time-agnostic).** Run the second grouping per `continuity.md` §2: which clusters are the same PROJECT regardless of when. Time clustering structurally cannot see a project worked across three separate nights. Label `T<nn>`, mark `inferred`, say what would falsify it.

**1e — Declare capacity, then sample.** Per cluster inside budget, open the first, the last, and one from the middle. Only open more when samples disagree. ~3 opens per cluster, not hundreds. ⚠️ **Currently blocked — see BLOCKER.**

**1f — Name the project** (ladder, stop at first hit): content → **date correlation** → adjacency → **UNIDENTIFIED**, which is a real and acceptable outcome. **Never invent a project to make the map look complete.**

**1g — Group duplicates, do not judge them.** Burst near-dupes · **re-captures** (SIGNAL, not waste: the thing changed, or it kept coming up) · already-captured (report the pointer).

**1h — Report and STOP.** Fill the CLUSTER MAP form verbatim from the report spec. Post it as a comment on the session task; give Michael the highlights in prose plus the task link.

---

## PASS 2 — DISPOSITION (only on Michael's instruction, cluster by cluster)

| Bucket | Meaning | Disposition |
| --- | --- | --- |
| **KEEP** | Durable reference | → `_keep`, renamed |
| **ROUTE** | Implies work or a decision | → propose the task/comment on the canonical record FIRST |
| **STRAY** | Not a screenshot | → propose its real home |
| **HOLD** | Unclear content, unclear project, possibly redundant | → **stays put**, with the reason |
| **CULL** | *Opt-in only* | → renamed in place; **Michael deletes** |

---

## PASS 3 — Resolve the owner (do NOT guess, do NOT hardcode)

Query the **Agent Index** `Lane` field at read time. **This file must never state who owns what** — a routing table written here is a fleet fact copied into a neighbouring file, exactly the rot the Known-Drift Register catches (D14). No lane match = HOLD, not cull.

---

## PASS 4 — Rename on promotion (MANDATORY into `_keep`)

```
YYYY-MM-DD · <project/lane> · <what it actually shows> [· NN of NN].png
```

**Capture date from the ORIGINAL filename**, never today's. **Preserve cluster order** with `NN of NN` when a sequence tells a story.

---

## PASS 5 — Cull flagging (SKIP unless opted in)

`🔴 DELETE ME — <what it was> (<why>)`, renamed in place. **Agent renames. Michael deletes.**

---

## PASS 6 — Plan Comment + MANDATORY GREENLIGHT

Separate from the Pass 1 map (a finding vs a proposal to change bytes). Post it, then **stop**. State clusters worked, cull flagging ON/OFF, and every KEEP/ROUTE/STRAY/HOLD with its reason. **Name every destination explicitly — full title AND link.**

---

## PASS 7 — On greenlight, execute

RELOAD this file that turn. Run Passes 3–5 in order, batch renames into one `dropboxmcp_move`, report what moved and what stayed on HOLD, and **update the session task before replying.**

---

## Guardrails

- 🚫 **NEVER delete a file.** Not one, not ever, not on request.
- 🚫 **NEVER propose a cull unasked.** Uncertainty → HOLD. A duplicate is a finding, not a verdict.
- 🚫 **NEVER describe what a screenshot shows without having opened it** — not from its filename, not from its cluster, not from its neighbours. ⚠️ Under the blocker this is the single most likely failure: a blind agent under pressure to produce a report will start inferring. **Report `unknown` instead.**
- 🚫 **NEVER let Pass 1 change a byte.**
- 🚫 **NEVER truncate silently**, and never trust `has_more: false` as a count proof.
- 🚫 **NEVER renumber clusters across passes.**
- 🚫 **NEVER create a shared link on these folders.** It converts the folder to a mount and changes its namespace path. Use `dropbox.com/home/<path>` navigation URLs.
- 🚫 **NEVER add topic subfolders.** Clusters and threads are REPORTING structures, not filing structures.
- ⚠️ **Ask whether a capability has been EXERCISED or only assumed.** Four versions of this hook rested on an image-read that had never once been attempted.
- ⚠️ **Never break a sequence.** Cluster order carries meaning.
- ⚠️ **Volatile content is still volatile** — Source Freshness Gate applies, and Michael's screenshot often outranks what you already committed to.
- ⚠️ **PII/credentials.** Screenshots catch inboxes, DMs, student data and logins by accident. None of it leaves Dropbox into the repo, a public channel, or a shipped artifact.
- The inbox is allowed to be messy. That is its job.

---

## Composes with

- Its own three companion files (above) — load all of them.
- **INBOX Email Intake Triage** — the sibling. Deliberate divergences: a clustering pass ahead of disposition, no transcription, no MOVE/COMBINE binary, no closing, culls opt-in.
- **Agent Activity Board — Gold Standard** — owns the session/handoff task shape. Point, never copy.
- **Attachment Router** — one file in flight; this is the folder-scale counterpart.
- **Deletion-Flag Gate** · **Task Dedup Gate** · **Doc Dedup & Placement Gate** · **Source Freshness Gate** · **Secrets / PII Guard**.

---

## Changelog

- **v5 (2026-08-04)** — **First live run, and it found a blocker in its own premise.** Dropbox image content is unreadable by every available path (MEASURED, two paths, one real file) — `BLOCKER.md` opened, Pass 2 gated on Michael's ruling, Pass 1 unaffected and proven to work blind. Count corrected **205 → 257**: `has_more: false` returned a terminated-looking but SHORT read, so the index instruction now demands an oversized page and a cross-check. Direction (oldest vs newest first) is now declared, not assumed, with newest-first recommended. New `continuity.md` carries Michael's pickup contract (task link on EVERY reply; the burden is on the parked task), time-agnostic **subject threads** (time clustering structurally cannot see a project worked across separate nights), and a thread registry + weekly cadence so a backlog never rebuilds. New guardrail: *ask whether a capability has been EXERCISED or only assumed.*
- **v4 (2026-08-04)** — Capacity gate (whole index always, images budgeted per cluster, stop on a boundary, ~40 opens labelled CALCULATED), real Activity Board handoff, report spec split out.
- **v3 (2026-08-04)** — First pass is CLUSTERING; the timestamp is evidence. Duplicates are a FINDING.
- **v2 (2026-08-04)** — Culling demoted to opt-in; HOLD bucket added; Felix named steward.
- **v1 (2026-08-04)** — Established by Fleet Felix as a sibling of the INBOX email routine.
