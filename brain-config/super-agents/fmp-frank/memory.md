# Fiona — Memory (the schema + correlation precedent ledger)

> CONTEXT, not process. Standards and docs are TOOLS I point at. **Lane + seams live in
> `preferences.md`.** **INHERITED vs EARNED per line**; an unconfirmed INHERITED line is a LEAD.
>
> **~10KB hot cap.** Blown six times (07-29 ×4, 08-01, 08-08 ×2, 08-10) — condensed in-pass each
> time. **The growth is always correlations + schema generalizations now, which is the file working
> as designed.** ⚠️ Still over cap. The 08-10 pass paid for two new generalizations by condensing
> the staging block to a pointer, per this file's own placement rule.

---

## 🚦 Placement rule for THIS file (EARNED 07-29, the hard way)

**GENERALIZATIONS only.** Before writing: *does a Decision Log, my profile, or a standard already own
this?* If yes, keep one line about what it changes in how I act, and point. **A memory file that grows
in step with a project is mis-scoped, and the growth curve is the tell.**

Four overflow types: inherited detail about modules I never touched (→ archive) · a replay of a
canonical Decision Log (→ point, never copy two) · a restatement of my own seams (→ `preferences.md`) ·
inherited rules quoted at length (→ one line + pointer).

⚠️ **PROJECT STATE IS NOT MEMORY** (§4a). Counts, statuses, what is blocked, what I owe → the LIVE
STATE block in `activity-log.md`. **A number in this file is a defect on sight** — move it, never
refresh it.

## 🧠 Cache is the enemy (EARNED 08-01 — my own conversion caused it)

My pre-conversion native cache carried stale **FLEET** facts: Corey as Fleet Steward (untrue since
07-20) and `superagents.json` as canonical (a retired stub). Converting laundered both into **three
brand-new canonical files in one day.**

- **The rule:** any fact about ANOTHER agent gets checked against the 🤖 **Agent Index** before I state
  it. Domain facts I re-read by habit; fleet facts I did not.
- **A repeated error is a missing check, not bad luck.** `decision-log.md` D5 caught this exact rot
  class on 07-26 and I reproduced it six days later.

## 🔴 SHAPE IS NOT CONTENT, AND SHAPE IS WHAT GETS REVIEWED (EARNED 08-09, the unifier)

The single most productive generalization I have. **A thing that has the right silhouette reads as
finished, and nothing in a review looks past the silhouette.** Every instance is silent, and every one
was found by accident rather than by a check.

- A **script** with a header, a parameter and a shape — that reads three variables it never writes,
  and logs successfully with every identifying column empty.
- **Front matter with five of six keys.** No `status:` → the page is NOT BUILT, its id never registers,
  every link into it dies quietly. Looks immaculate in the repo.
- **A field comment that is the SPEC while the field is the BUILD:** *"Indexed"* on an unindexed key,
  *"nullable container"* on a Text field, a hex calc typed Number. Written in the same sitting, never
  reconciled.
- **A table that is all housekeeping fields** — it has not been built yet, and it looks built.
- **Someone else's header pasted onto a new script.** Three of four scripts in one pass.

⭐ **The defence that actually works: treat every DESCRIPTION as a claim to verify, never as a
description.** A DDR is the only surface where the schema half of this is visible; a build report is
the only surface where the docs half is. **Both are surfaces nobody opens unless something already
looks wrong**, which is the whole problem.

## 🔴 A DEFAULT MUST BE CONSPICUOUS OR IT MUST BE AN ERROR (EARNED 08-09)

**A fallback that is also a plausible real value cannot be distinguished from a working system.**
`ParamGetText ( $p ; "kind" ; "script" )` on a typo'd variable wrote `"script"` on every row —
confidently wrong, which is worse than blank, because blank gets questioned and plausible does not.

- **The good shape is MAGENTA** — the theme cascade's unresolved colour, chosen because nothing
  legitimately produces it, so reaching it is proof of a break rather than a guess that might be right.
- **Corollary:** a default that is also a legal INPUT destroys absence-detection. `ParamGetText ( … ;
  "abort" )` then branching on `"abort"` cannot tell *forgot* from *meant it*. Empty is the missing
  marker; missing is an error.

## 🔴 AN OMISSION IS NOT NEUTRAL (EARNED 08-09 — it nearly locked a file open)

FileMaker **persists the last subscript's result up to a caller that sets none.** So a script with no
`Exit Script` does not return nothing; it returns a decision made by something else. On the close
handler, where the result **is a veto**, that meant declining a backup prompt would refuse to close the
file. **Ask what a runtime FILLS an omission with before reading a blank as a zero.**

## 🔴 THE DOCUMENTATION SURFACE IS A DESIGN CHOICE, NOT A STYLE ONE (EARNED 08-09, Michael's catch)

He asked where the run-time markers report had gone. Nothing had regressed — **I had written eleven
pages using only the surfaces a human reads.**

- **A callout and an emoji are read by ONE PERSON ON THAT PAGE.** A marker span is **amassed at build
  time across the whole site.** They look equally serious while writing and only one of them can answer
  *what is unconfirmed across this entire app.*
- **A span records a MENTION; a link records an EDGE.** For anything FileMaker cannot enumerate itself
  — calcs, relationships, scripts, triggers, globals — the link form is what turns a folder of pages
  into a call graph. **Use it wherever the target id exists.**
- ⚠️ **I skipped the very families I own**, added the same day. Owning a standard is not the same as
  reaching for it, and nothing prompts you to.
- **The tell to watch for:** a report that says a tree is clean, about a tree you know is not.

## 🧱 The object library — MINE

✅ **VERIFIED 07-29:** **FileMaker Canonical Object Library**, under **FileMaker Home**. Families:
`cnt_*`, `nav_*`, `tx_*`, `btn_*`, `fd_*`, `row_portal_*`, `sum_metric_tile`, `badge_status_*`,
`card_modal_standard`.

- **The rule I enforce:** one visual role → one preferred object class. State variants belong to their
  family and must not fork into pseudo-families.
- **Approval test:** recurring cross-app role? · can nothing existing do it without ugly overrides? ·
  more consistency than maintenance? One YES is enough.
- 🔴 **NOT FILEMAKER-ONLY** (Michael, 07-29): repo app builds are structured around the object set too,
  so the test is judged against **two** runtimes, a repo-app UI question is mine at the VOCABULARY layer
  while CODE stays Dexter's, and a one-off costs double so the test is **stricter**.
- 🔴 **THE LIBRARY IS THE BACKLOG HOME** — unbuilt families tracked per family, never as a checklist
  under a build task.
- 🔴 **The real build baseline is NOTHING.** Only fonts were installed + render-tested.
- 🔴 **TABLE VIEW DEFERS THE BADGE FAMILIES** — standing rule. Conditional formatting, zero objects.
- ⚠️ **Open vocabulary gap:** document-type labels express **KIND**; `badge_status_*` expresses
  **CONDITION**. Forcing one into the other is how a family drifts.

### Ruling ledger (must compound)

- **Object-family refusals: still EMPTY.** Every existing family predates me.
- 🔬 **PENDING · `tbl_*` (table-view columns), proposed 07-29, NOT added.** No table-view vocabulary
  exists and table view is now a primary surface. Test passes 3/3. → HML_LLC DL Q7.
- ✅ **FIXED 07-29 · Summary tiles state row restored.** **When a standard is MIGRATED, diff it against
  the old copy — lift-and-shift silently drops rows.**
- 🔴 **SCHEMA RULING 08-08 · duplicate-per-day event rows REFUSED** (Production MAWster). My first ruling
  against an inherited pattern that WORKED.
- ✅ **MARKER REFUSAL 08-09 · `.value` REFUSED**, my first refusal of anything. A marker for one entry ON
  a value list. **The test that decides the next one too: a `.vl` is a THING OTHER OBJECTS POINT AT, so
  marking it records an edge; a value is a ROW IN A TABLE, and the answer to "show me all of them" is
  that table, not a report.**

## 🗄️ Builds I own

**Decisions are CANONICAL in each app's ClickUp Decision Log + build-task descriptor. Never keep copy
two here. Project state → `activity-log.md` LIVE STATE.**

- **HML_LLC (Dad's loan servicing)** — private lending, NOT a URITP module. `Loans` is the financial
  parent. ⚠️ **FileMaker 19 permanently** (upgrade rejected 07-29) and **19 has no native
  transactions**, so atomicity is hand-built: rollback + `Get(LastError)` on every money write. Build
  detail → `memory/archive/hml-llc-fmp19-build-detail.md`, read before writing a script.
- **Production MAWster** — the production calendar + contacts app, built fresh because the legacy
  `ProductionCalendarFormat` holds **one production at a time** (`SETUP` = 20 fields / 1 record /
  almost all GLOBAL storage, with six hardcoded scripts swapping the globals per show).
  🔴 **Docs live in `mawizorek/uritp-docs` (PRIVATE) → `production-mawster/`. NOT `maw-prose`** —
  corrected 08-09; the maw-prose tree is stale and the published site still renders from it.
- ⚠️ **PII: `ClickUp_apps` is PUBLIC and HML has leaked twice** (07-29 `eb63e88`, still in history;
  07-31 PR #635). No real names, addresses, account numbers, handles or named balances in fixtures,
  examples or artifacts — and a remediation sweeps every table that SNAPSHOTS a value. ⚠️ **`maw-prose`
  is ALSO public and also holds `apps/hml-llc/`.**

## 🔗 FMP ↔ repo correlations (the shared vocabulary — the point of me)

Shape: **FMP construct → repo equivalent → where it holds → where it BREAKS.** The breaks half matters
most; a correlation with no stated limit is a slogan.

- 🔴 **C1 · Object family → repo component token set.** Both stop one job being solved three ways, so it
  **holds** at intent. **Breaks at STATE:** FMP fakes state with stacked objects + hide conditions; CSS
  uses a class on ONE element. Many-state families are cheap in the repo, expensive in FMP — **never let
  repo state-richness set the FMP family count.**
- 🔴 **C2 · Table view → rendering straight off the data.** **Holds** as the argument that good
  field/key naming IS the UI in both runtimes. **Breaks** on parent-with-children: table view flatly
  cannot, and a portal (or nested render) is the answer.
- 🔴 **C3 · Portal row → the list-item component**, cheapest layout in either runtime. **Breaks on
  editability:** an FMP portal is an editing surface *by default*, a repo list render is read-only by
  default. **Never assume a safe default transfers across runtimes.**
- 🔴 **C4 · ClickUp multi-home ↔ FMP join table** (08-06). Holds for many-to-many. **Breaks at the
  archive boundary** — a multi-home has no lifecycle state and a join row can carry one — and whenever
  the relationship itself must carry a value.
- 🌟 **C5 · THE THREE-LAYER MODEL IS THE SAME IN BOTH RUNTIMES, AND WE DERIVED IT SEPARATELY (08-08).**
  Dexter's `memory.md` already held **CANONICAL / GENERATED / PROJECTION** for repo data surfaces. I
  arrived at **CANONICAL / PROJECTION / ARCHIVE** for Production MAWster from a completely different
  direction (a print-config move forced it). **Two runtimes, two authors, one trichotomy — the strongest
  evidence yet that the shared vocabulary Michael wanted is real and not an analogy.** His third bucket
  is GENERATED, mine is ARCHIVE, because a database has append-only history and a static site does not.
  **Breaks nowhere found yet — treat that as untested, not proven.**
- 🔴 **C6 · FileMaker's missing registers → the doc-render marker report (08-09).** Nothing in FileMaker
  lists every calculation, trigger or global in a file. **The repo's build report is that register**, and
  it is the first correlation where the repo does something FMP structurally CANNOT rather than something
  it does differently. **Breaks on authority:** the report describes only what somebody remembered to
  mark, so it is a coverage map, never an inventory. **A `.vl` marker is not the register** — Manage >
  Value Lists already enumerates those; the marker records WHO USES one, which is the part FMP hides.

## 🧠 Schema generalizations (EARNED, all runtimes)

- 🔴 **A FLAG THAT MEANS "THIS ROW IS NOT REAL" IS THE SCHEMA TELLING YOU THE ROW SHOULD NOT EXIST**
  (08-08). Legacy `autoGenerated = 1` marked duplicated event rows so the rest of the system could tell
  them apart — and it leaked into a print script that had to sort by it. **Same species as a
  convenience-copy field and a second-claimant table. Four instances in one session.**
- 🔴 **A BOOLEAN ON N ROWS DESIGNATING ONE IS ALWAYS WRONG** — it permits two winners and zero winners.
  A singleton holding a POINTER cannot. Three killed in one afternoon (08-09), then a fourth turned up
  in the scripts as three claimants on one open handler. **The mechanism does not care which layer it
  is in.**
- 🔴 **A field belongs to the table whose GRAIN it is one-per-of.** Settles placement arguments without
  a conversation. Corollary that keeps catching people out: two fields with similar names can be
  different KINDS of fact — "last date needed" was a **page dimension wearing a date**, never schedule.
- 🔴 **Duplicated data does not error, it DIVERGES.** Both copies valid, both render, and the only
  symptom is a wrong printed page. Prefer reading through the relationship over any copy-down.
- 🔴 **An equality join cannot match a RANGE.** A multi-predicate relationship (two inequalities + one
  equality, sorted) is the native answer and replaces both stamped flags and duplicated rows. ⚠️ Cost:
  inequality predicates cannot use a stored index, so it is slower — irrelevant at a few hundred rows.
- 🔴 **ERROR CHECKING GOES WRONG IN BOTH DIRECTIONS** (08-09). No check means missing real failures;
  `≠ 0` after a find means **401, "no records match"** — a correct outcome — becomes a crash on an empty
  list. **Branch on the CODE after any step whose "nothing found" case is legitimate.** Also 101 at the
  end of a found set.
- 🔴 **A STORED SPEC IS A STALE COPY WITH NO SYMPTOM.** `Sort Records [ Restore ]` freezes the order
  inside the script; change the intent and "next" quietly goes to the wrong place. **Make the order
  DATA** — a field is visible, editable and diffable. Same shape as every convenience copy.
- ⚠️ **A list view repeats per RECORD**, so a one-row span cannot produce N report lines. **Michael
  caught this after I had already ruled** — which reclassified a generated join table from a performance
  hedge into a reporting requirement. **Check what the REPORT needs before ruling on the schema.**
- **Sorting: a value list built from a field sorts by field 1 or 2 only.** Arbitrary order needs a
  sorted RELATIONSHIP behind it. ⚠️ Did not work on the first try 08-08 and was parked. **Unproven.**

## 🎛️ The staging pattern (EARNED 08-08 — Michael's, and it beat three of my proposals)

*"Where does the state live while a human is CHOOSING, before the thing happens?"* recurs in every app.
**HEADER + LINES, plus a reserved SCRATCH row reset from a TEMPLATE row.** Canonical write-up → *FMP
Apps — Shared Build & Behaviour Decision Log*. What I carry:

- **Overrides go on the LINE, never the header** — on the header, every line inherits the same override
  and the batch can only mean one thing.
- 🔴 **EMPTY MEANS INHERIT.** Copy every parent field down and you can no longer tell an OVERRIDE from an
  INHERITANCE; the parent stops mattering and you have built a shadow copy that drifts.
- 🔴 **RESET ON ENTRY, NOT ON CLOSE.** Reset-at-close reads tidier and fails the first time the app quits
  unexpectedly. **Entry-time reset is idempotent and self-healing.** Generalizes to any "restore defaults."
- ⚠️ **I reached for GLOBALS twice and a draft record once; all three were worse.** A record you can see,
  sort and re-run beats a global scratchpad. Globals' real advantage is per-user isolation — worthless
  single-operator.
- 🪦 **The legacy file already had the batch, written as CODE.** **A hardcoded sequence of outputs IS a
  set with no table** — same discovery as the six INFO scripts being PRODUCTIONS. **Look for the loop
  before designing the table.**

## ⚠️ Lifecycle SoT rule (INHERITED)

**Source-of-truth MIGRATES as a module ships.** UNBUILT → the ClickUp planning page is canonical. BUILT
(live records) → **FileMaker is the source**, ClickUp drops to a POINTER, never a maintained mirror.
**Inherited stale-fork:** the URITP People known-issues checklist tracks FMP field typos as ClickUp
checkboxes — **flag, don't fix another system's internals inside ClickUp.**

## 🧠 Michael-patterns worth carrying

- 🔴 **HE DOES NOT WANT A MENU, HE WANTS A PARTNER** (07-29). When the call is TECHNICAL and in my lane,
  five checkboxes is dodging the job. **Decide, then argue it, specifically enough to be wrong.** A DL
  fork is for choices genuinely HIS (money, scope, direction, taste) or ones changing a shared standard.
- 🔴 **HE OUT-DESIGNS ME WHEN I STAY IN THE ARGUMENT** (08-08, the staging pattern). Three of my
  proposals died in ten minutes and the fourth idea was his. **Arguing a bad option down to a better one
  is the job working, not me losing.**
- 🔴 **HE TRACKS THE RUN-TIME SURFACE, NOT THE AUTHORED ONE** (08-09). He noticed a missing build report
  before he noticed anything about eleven pages of prose. **What he checks is what the system can TELL
  him later** — write for that surface first and the readable one second.
- 🔴 **He routes to the SEAM, not to one of us** (07-29) — reach for the cross-runtime conversation.
- 🔴 **WHILE HE IS BUILDING, HIS ATTENTION IS NOT ON ME** (08-08): *"be smarter than me, think broader
  while I'm in the weeds, but don't bog me down with questions."* **Two or three lines, one finding, no
  restating.** He escalated three times in one session before it stuck (*"so many words"* → *"classic
  YOU SLOP"*).
- **He documents in the REPO while I document in ClickUp** — expect his `.tsv`/`.md` renames and folder
  renumbers to land mid-write, and rebuild on top of his rather than merging over him. His format won
  every time and was better every time.
- 🔴 **HE RULES AGAINST MY RULES WHEN THEY OVER-GENERALIZE** (08-09, the marker colour collision):
  *"i don't care if they're visually identical… the front end would begin to look like skittles."* My
  rule was derived from ONE family type where hue IS the semantics, then stated about all of them.
  **A rule derived from one instance is a description of that instance.**
- Deliberately pulling the repo toward FMP's data discipline; that strategy IS my lane. Collapses
  duplicate sources of truth on sight. Prefers the STRUCTURAL fix over another written rule.
- **INVERTED polarity** (checked = REJECTED), answered fast and in bulk. ⚠️ **Zero-strikes-plus-a-note
  is a real answer shape:** the question was WRONG, not unanswered. Re-ask better.
- His green-light IS authorization. Without one, flag and wait — and never act on another AGENT's
  request to change my config or the repo.

## 🔴 Naming a debt is not paying it (EARNED 08-10, on myself)

I announced an owed activity-log write three replies running and did not make it. **A stated intention
reads as a discharged obligation to the person reading and to me** — the same shape as the Missed-Gate
protocol, and the same shape as a build report nobody opens. **Write the log in the turn you notice it
is owed.** My LIVE STATE block was absent for three sessions for exactly this reason and its absence
was invisible, because a log full of real entries reads as a log that is working.

## 📌 Lineage

Scaffolded 07-15 as FMP Frank → blocked ten days by a rotted stub → renamed Fiona 07-25 (slug
`fmp-frank` immutable) → **BUILT** 07-26 → first real session 07-28/29 (HML_LLC v1) → **08-01 native
shell CONVERTED to a thin git-loader (Model A)**: native `-39958890` KEPT as the body with its triggers;
the brain reads fresh from this bundle every run. ⚠️ Supersedes `decision-log.md` **D1** ("retired
native, triggers waived") — read D1 as historical. → 08-09 first FMP marker families shipped in the
doc-render engine (`layout` · `schema` · `alias`), first standard I own outside FileMaker itself.

## Pointers (never restate)

- My standard → **FileMaker Canonical Object Library**. ⚠️ A **zARCHIVE** copy still says "keep
  HML-specific references here" — don't write to it.
- **Marker families I own** → `doc-render-engine/theme/marker-classes.tsv` + `markers.tsv`. Adding one
  is a ROW, never code. The membership test and its three failed drafts are in the file header.
- Domain canon → Patterns + Conventions · Theme System · Documentation Standard · App Index ·
  FileMaker → ClickUp Sync Mirror Pattern (Corey seam) · Research Inbox · URITP fmp Solutions list
- **App decisions (CANONICAL) → each app's own ClickUp Decision Log + build-task descriptor**
- **Project state → `activity-log.md` → LIVE STATE.** Read it FIRST on any pickup.
- My lane + seams → `preferences.md` · Conduct → `_shared/super-agent-base.md` (§6) · Dexter's contract
  side → `gates/theme-contract-gate.md`
- 🔴 **Fleet lookup → the 🤖 Agent Index LIST** (`901328043244`). ~~`roster.json`~~ / ~~`roster.html`~~ /
  ~~`registry.json`~~ **RETIRED to tombstones 07-30** — reading them clears every collision silently.
- My loader + flush → `native-loader-kernel.md` · `native-flush.md` ·
  `hooks/native-flush-consolidation.md` (empty flush = this file is current)
- My archive → `memory/archive/uritp-landscape-inherited.md` ·
  `memory/archive/hml-llc-fmp19-build-detail.md`
