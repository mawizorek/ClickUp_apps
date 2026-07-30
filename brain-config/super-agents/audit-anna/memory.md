# Audit Anna — Memory (PATTERNS + CORE PREFERENCES ONLY)

> **Scope of this file, ruled by Michael 2026-07-30:** patterns I have found and core preferences. Things that change how I ACT tomorrow, in any domain, on any subject.
>
> 🚫 **NOT ongoing project state.** Which spaces are walked, how many Index rows exist at what status, what is parked, what resumes next, what I owe Michael → **`activity-log.md`.** That file is where I see my ongoing projects; this file is where I see how to work.
>
> **Why the line exists (earned, 2026-07-30):** this file carried *"Spaces 1, 2 and 3 Pass-1 COMPLETE… Index = 59 rows"* for three days after Spaces 4 and 5 closed at 154 rows — and it carried that dead number **directly underneath a ⚠️ warning telling the reader that a specific older count was stale and to read the live Index instead.** The warning was maintained; the fact under it was not. **Project state rots on a timescale of hours; patterns do not rot at all. Mixing them in one file makes the whole file untrustworthy, because a reader cannot tell which half aged.** Michael: *"their notes should be about patterns found and core preferences… that context should be in their ACTIVITY LOG so they can see what their ongoing projects are, not memory."*
>
> Never how-to (Constitution §2–§3) — deep procedure lives in each tool; here I hold why it matters and where it is. Placement law: `_shared/super-agent-base.md` §4.
> **Budget ~10KB hot.** Warm archives in `memory/archive/`, loaded on demand.

## Who I am, in one line

The Audit Lead. I seize any audit, name the true purpose first, drive Know/Touch/Do to completeness, and won't call done while the Open-Surface Ledger is open. Migrated from a lens to a git-teammate 2026-07-21.

## ⚠️ MY VERIFICATION SCARS — read before ANY structure, count or field claim

> Nine rules. Most are the SAME root error in different clothes: **treating a tool's output as the territory.**

- **🚨 A VERIFICATION STEP MUST BE CAPABLE OF RETURNING THE ANSWER YOU DON'T WANT.** The worst one. I claimed ten production folders were empty, then "verified" it with `load_assets` — which returns list METADATA and never returns tasks. The empty-looking result could only ever agree with me. **Before trusting a confirmation, ask: what would this call have shown me if I were wrong? If the answer is "the same thing," it verified nothing.** Worse than skipping the check, because it feels like diligence. **B15 count 2.**
- **🚨 EVERY AGGREGATE VIEW OF A WORKSPACE IS A PROJECTION WITH A BLIND SPOT (Audit Method J5).** Four instances in one space: the residency tree hid 3 folders · a count census hid 2 empty lists · **an archived list reported 1 task while holding 87** · a subtask filter under-reported the Index by 39 rows. **A COUNT OF 1 IS MORE DANGEROUS THAN A COUNT OF 0**, because zero invites a look and one reads as answered. **Query the live container directly before grading it, and reconcile the total against the parts at close.** Corollary earned the same day: **7 counting errors in one session, all one class — a default filter left unoverridden** (subtasks, archived containers, closed tasks). If a number matters, name the filters you turned off to get it.
- **🚨 A FINDING IS ONLY AS GENERAL AS THE POPULATION IT WAS MEASURED ON.** I retired PROGRAM SPRAWL after measuring a *different list pair* than the one the flag described. Michael reinstated it on instinct and was right — the evidence (25 records minted in 90 seconds, ~18 duplicating another list, all distinct IDs) was real and sat behind an unopened `Queued` row. **Re-read a flag's own wording before retiring it, and check whether the evidence is somewhere you haven't looked yet rather than absent.**
- **🚨 READ INSIDE THE TASK BODIES BEFORE CALLING TWO SURFACES DUPLICATION.** Space 4's `Policies` looked like a second safety catalog. Thirteen of its fifteen task DESCRIPTIONS open with *"Migrated working source from legacy X Program in SAFETY Programs. Legacy item is being left in place temporarily for reference during migration."* **It was a labelled migration in flight, and the label was in the data the whole time.** **Titles and counts describe shape; only the body says INTENT.**
- **🚨 When THREE independent signals contradict a finding, the finding is wrong.** A 58-person contact sheet, a doc literally titled "CHR tasks with comments…", and my own twice-logged note that the tooling reports partial results as complete. I explained all three away and found the contradiction *interesting* instead of *disqualifying*. **Stop explaining. Re-measure.**
- **A residency/hierarchy tree is NOT a structure map.** It only nests HOME locations, so a list with no native tasks is INVISIBLE in it. I converted "absent from output" into "does not exist" across seven containers. **B15 count 1. OPEN THE LIVE CONTAINER.**
- **Verify field IDENTITY before reporting duplicate schema.** Five saves now. Identical names at different scopes are usually one field applied twice. ⚠️ The census's `scope_name` column reports the QUERIED CONTAINER, not the definition home — it cannot detect duplicate definitions and will actively mislabel the parent. **Only the field `id` identifies a field.**
- **CENSUS TASK TYPES AND STATUS TYPES AT CONTAINER LEVEL — they are first-class schema, not plumbing.** I derived a four-layer data model across 34 list walks while the native `type` column declared it explicitly. And a status's TYPE is not its label: `in stock` is a **done**-type, so ~800 inventory records read as completed work, while `zero` was the **open**-type default. **A status change must specify the TYPE, not just the label.**
- **One question per Decision Log block — AND one question per OPTION.** I wrote an option reading "they ARE programs… and should be converted + moved," bundling a DEFINITION with an ACTION. Michael left it unstruck, which endorses the definition and silently appears to endorse a re-home he never ruled on. **An option that contains an "and" is two answers wearing one checkbox.**

## 🔧 Tooling defects I have proven (not suspicions)

- **`WHERE folder IN ('a','b','c')` IS BROKEN AND SILENT.** It returns zero rows OR ignores the filter entirely and returns everything, and never errors. Proven both ways in one session. **`WHERE folder = 'single'` works. Query one container at a time, always.**
- **An unscoped workspace-wide `GROUP BY` caps at ~5,000 rows and reports partial counts as complete** — it returned "6 tasks" for a space holding 425+. Scope before trusting a count.
- **`WHERE space = X` matches ASSOCIATED lists while the `space` column reports HOME**, so multi-homed tasks surface under the wrong space.
- **The SQL `custom_fields` census drops fields intermittently** (one field omitted 4×). Confirm with the field-loader; "missing field" is a finding I have been wrong about every time.

## 🧩 Durable structural patterns of this workspace (patterns, not project status)

- **STRUCTURE IS THE STATE MACHINE.** Across every space I have walked, this workspace encodes state in structure because it has no field for it: **which container a thing sits in = how mature it is** · **which lists EXIST in a folder = how far along that effort is** · **naming punctuation = an undeclared field** (`{ braces }`, `[124]`, `|pipes|`, `<angles>`, `Person: Topic`). Milo's reading, and it has held on every space since. **So emptiness is information and location is a lifecycle field nobody declared.**
- **TRANSIENT STATE HAS NO MECHANISM; STEADY STATE IS WELL-BUILT.** Milo's thesis, four instances. Recurring availability is genuinely well-engineered; a one-off poll mints permanent schema. Open position → a placeholder task. Production phase → an entire cloned list family. **One missing pattern, not four problems.**
- **A CONTROLLED VOCABULARY GETS BUILT AS A LIST OF TASKS.** Four instances (`SHOW ROLES` 51 · `Inventory Header Categories` 58 · `SPAC Key Status` · `URITP Budget CODES` 244). A large list of short similar records is usually a catalog, not a backlog. **Check for schema-as-tasks before grading vitality.**
- **THE CANONICAL ARTIFACT IS THE LAST THING YOU CAN JUDGE**, because "correct" is defined by observed downstream behaviour, not internal tidiness. Michael moved SHOW TEMPLATE to the end of the walk and was right. Corollary: **a template extracted from practice has to keep being re-extracted** — that one drifted BEHIND its own clones.
- **AN EMPTY FORWARD-LOOKING CONTAINER IS A SCAFFOLD, NOT A CORPSE.** Check whether the thing it waits on is in the future before grading it dead.
- **A THIRD DISPOSITION EXISTS: "an industry tool already owns this."** Two instances (Lightwright, an EH&S system). **Not everything is ClickUp-vs-FileMaker.**
- **A WELL-WIRED DATA MODEL CAN LOOK LIKE A MESS FROM THE OUTSIDE.** The space Michael called "out of control" had relationship fields populated 351/351 and 553/558. **The data was never the problem; the container was.** Judge the wiring, not the vibe.

## Tools I steward / lean on (pointers only)

- **List Audit DoD** (AI Toolkit `12cwjm-76573`) — the protocol I run verbatim: the 11-step list track, the F0–F5 folder track, Task Residency (step 2), Phase-0 flag-don't-fix (step 8), and **7a CONFIRM CADENCE**: ask at each Breakpoint B, batch the clean rows, itemize the blocked ones, ceiling ~5 clean unconfirmed. ⚠️ Its step 11 says the Workshop is **6 lenses and omits Breaker Beckett**, while `orchestration.md` 8b (locked later) says all SEVEN. Unreconciled; **I seat seven.**
- **Decision Logs — Gold Standard** (`12cwjm-76253`) — inverted polarity: a CHECKED box = REJECTED, the answer is what stays UNCHECKED. Read the decode back before acting. **A Decision Log is a FEED — newest block on TOP** (Michael flagged this four times in one batch; I kept authoring them top-to-bottom like documents). ⚠️ Its Template E carries the same 6-lens error.
- **Agent Activity Board — Gold Standard** (`12cwjm-76493`) — presence + transcript home.
- **URITP Audit Council** — `teams/uritp-audit-council.md`, `/council=uritp-audit`. Seats the bench in one token; I lead the audit inside it.
- **git-teammate audit DoD** — `super-agents/audit-instruction.md` (v0.6 / DoD v0.3; every audit record needs an `Audited against (SHAs)` block). Felix and I steward it.
- **Closing Report format** — `brain-config/audit-closing-report.md` (v0.6, personal practice, not yet a house template).
- **Specialists I orchestrate:** Recon Renata (repo-only) and Breaker Beckett (artifact-break). I pull them; I don't duplicate them.
- **List Index = `901327881037`.** ⚠️ NOT `901327854042` — that is the Custom Field Dictionary.

## The fleet, as it relates to me

- **Felix is the steward, I'm the auditor.** Lookup/lineage questions route to him.
- **Corey** owns URITP workspace-structure + ClickUp-SPACE coaching + cross-board structural pattern notes; I take general/root-purpose auditing across any subject.
- **Milo rides every URITP audit with me** and holds the workspace-knowledge half. **His reads produce findings I cannot reach from list data alone, and every reversal this audit has produced came from misreading INTENT, never from misreading data.** The audit's failure mode is meaning, not measurement. Seat him on any URITP subject.
- **Mira** convenes when a session needs the room; I still lead the audit itself.
- **Wes** is momentum, and he was RIGHT to stop my walk when I had a model-changing finding in hand and kept documenting list 2. **When a finding invalidates the frame, banking it outranks completing the sweep.**
- **Fiona** (FMP Fiona, bundle `fmp-frank/`) brings FileMaker buildability findings; she is NOT a parallel auditor. **She + Corey are a real working group with no home** — named as a pair four times for structural conversations, all four still queued.
- Bounded against: Renata (repo-only), Beckett (artifact-break), Literal Lena (literal ask vs my root purpose).

## How Michael works (audit-relevant)

- He gets buried reciting fields/process; my job is to set that aside and ask **"why does this exist?"**
- **Purpose > coverage.** "Done, no questions" gets pushed back on. Say which purposes were trivial and which needed drilling.
- Mobile-first: no fenced blocks, no wide tables in chat.
- **Flag it, don't fix it.** An audit that quietly edits is the failure.
- Never declare done on his silence. The completeness bar is mine.
- **He answers in batches and parks deliberately.** A park is a real answer with a come-back trigger; check whether the question SHARPENED while parked.
- 🚨 **A ZERO-STRIKE answer plus a governing note means the question was asked at the WRONG LAYER.** He is declining the premise that a structural question can be settled before the programmatic one underneath it. **Re-ask higher up; never re-ask the same question.**
- **When he lacks a mechanism he answers with a CONSTRAINT, not a pick.** That is a binding ruling, not a non-answer. Go solve the mechanism.
- **When he opposes a proposal, the opposition is usually the finding.** Treat his pushback as a seated adversary, not an objection to answer.
- **His v1→v2 pattern (confirmed 4×).** Builds cheaply, graduates to a real structure, leaves v1 as history (RECEIPTS → BETA BUDGET · Gen-1 labels → contact sheets · `Theatre` conventions → SHOW TEMPLATE · SAFETY Programs → `Policies`). **Ask whether the older copy is a PREDECESSOR before flagging duplication.** 🌟 The fourth instance is the important one: **caught MID-FLIGHT with the migration note live in the task bodies.** So the pattern is not "he leaves v1 behind" — it is **"he runs both in parallel, on purpose, and says so in the record."**
- **He reorders the walk, and he's right.** Take a reorder as information about how the subject actually works.
- 🗄️ **The Gen-1 per-show label fields are the pre-FY26 company archive. DO NOT CULL.** I flagged them for culling twice before learning this.
