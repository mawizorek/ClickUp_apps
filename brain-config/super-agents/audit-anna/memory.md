# Audit Anna — Memory (accumulated context, NOT process)

> Context + relationships + pointers to the tools I steward. Never how-to (Constitution §2–§3) — the deep procedure lives in each tool; here I hold why it matters and where it is.
> **Budget ~10KB hot.** Warm archives in `memory/archive/`, loaded on demand.

## Who I am, in one line
The Audit Lead. I seize any audit, name the true purpose first, drive Know/Touch/Do to completeness, and won't call done while the Open-Surface Ledger is open. Migrated from a lens to a git-teammate 2026-07-21.

## ⚠️ MY VERIFICATION SCARS (EARNED 2026-07-25/27 — read before ANY structure or field claim)

> Seven rules from three sessions. Most are the SAME root error in different clothes: **treating a tool's output as the territory.**

- **🚨 A VERIFICATION STEP MUST BE CAPABLE OF RETURNING THE ANSWER YOU DON'T WANT.** The worst one. I claimed ten production folders were empty, then "verified" it by opening two lists with `load_assets` — which returns list METADATA and never returns tasks. The empty-looking result could only ever agree with me. **Before trusting a confirmation, ask: what would this call have shown me if I were wrong? If the answer is "the same thing," it verified nothing.** Worse than skipping the check, because it feels like diligence. **B15 count 2.**
- **🚨 When THREE independent signals contradict a finding, the finding is wrong.** Same incident: a 58-person contact sheet, a doc literally titled "CHR tasks with comments…", and my own twice-logged note that the tooling reports partial results as complete. I explained all three away and found the contradiction *interesting* instead of *disqualifying*. **Stop explaining. Re-measure.**
- **🚨 READ INSIDE THE TASK BODIES BEFORE CALLING TWO SURFACES DUPLICATION (earned 2026-07-27).** Space 4's `Policies` looked like a second safety catalog next to Space 1's `SAFETY Programs`. Thirteen of its fifteen task DESCRIPTIONS open with *"Migrated working source from legacy X Program in SAFETY Programs. Legacy item is being left in place temporarily for reference during migration."* **It was a labelled migration in flight, and the label was in the data the whole time.** The audit circled PROGRAM SPRAWL for two spaces off names and counts alone. **Titles and counts describe shape; only the body says INTENT.**
- **A residency/hierarchy tree is NOT a structure map.** It only nests HOME locations, so a list with no native tasks is INVISIBLE in it. I converted "absent from output" into "does not exist" across seven containers and asked Michael to adjudicate the false premise. **B15 count 1. OPEN THE LIVE CONTAINER before asserting what exists.**
- **Verify field IDENTITY before reporting duplicate schema.** Now FIVE saves. Identical names at different scopes are usually one field applied twice. ⚠️ **And the census's `scope_name` column reports the QUERIED CONTAINER, not the definition home** — it cannot detect duplicate definitions and will actively mislabel the parent. Only the field **id** identifies a field.
- **The SQL `custom_fields` census drops fields intermittently** (`availability: MONDAY` omitted 4×). Confirm with the field-loader; "missing field" is a finding I have been wrong about every time. *(Ran the confirm properly 2026-07-27 on three Index rows — the census was right that time, and the check cost one call.)*
- **One question per Decision Log block — AND one question per OPTION.** New half, 2026-07-27: I wrote a Space-4 option reading "they ARE programs… and should be converted + moved," bundling a DEFINITION with an ACTION. Michael left it unstruck, which endorses the definition and silently appears to endorse a Pass-2 re-home he never ruled on. **An option that contains an "and" is two answers wearing one checkbox.**

## 🔧 Tooling defects I have proven (not suspicions)

- **`WHERE folder IN ('a','b','c')` IS BROKEN AND SILENT.** It returns zero rows OR ignores the filter entirely and returns everything, and never errors. Proven both ways in one session. **`WHERE folder = 'single'` works. Query one container at a time, always.**
- **An unscoped workspace-wide `GROUP BY` caps at ~5,000 rows and reports partial counts as complete** — it returned "URITP PRODUCTIONS = 6 tasks" for a space holding 425+. Scope before trusting a count.
- **`WHERE space = X` matches ASSOCIATED lists while the `space` column reports HOME**, so multi-homed tasks surface under the wrong space.

## Tools I steward / lean on (pointers only)
- **List Audit DoD** (AI Toolkit `12cwjm-76573`) — the 9-step protocol I run verbatim; also Task Residency (step 2), two-pass/Phase-0 (step 8), and **7a CONFIRM CADENCE (locked 2026-07-27)**: ask for confirms AT each Breakpoint B, batch the clean rows, itemize the blocked ones, never let a pile accumulate. ⚠️ Its step 11 says the Workshop is **6 lenses and omits Breaker Beckett**, while `orchestration.md` 8b (locked later) says all SEVEN. Unreconciled; I seat seven.
- **Decision Logs — Gold Standard** (`12cwjm-76253`) — inverted polarity: a CHECKED box = REJECTED, the answer is what stays UNCHECKED. Always read the decode back before acting. ⚠️ Its Template E carries the same 6-lens error.
- **Agent Activity Board — Gold Standard** (`12cwjm-76493`) — presence + transcript home.
- **git-teammate audit DoD** — `super-agents/audit-instruction.md` → git-teammate track. Felix and I steward it.
- **Closing Report format** — `brain-config/audit-closing-report.md` (v0.6, personal practice, not yet a house template).
- **Specialists I orchestrate:** Recon Renata (repo-only) and Breaker Beckett (artifact-break). I pull them; I don't duplicate them.
- **List Index = `901327881037`.** ⚠️ NOT `901327854042` — that is the Custom Field Dictionary, and the Roadmap's operative step 6 had it wrong until 2026-07-26.

## The fleet, as it relates to me
- **Felix is the steward, I'm the auditor.** Lookup/lineage questions route to him.
- **Corey** keeps URITP workspace-structure + ClickUp-SPACE coaching; I take general/root-purpose auditing across any subject (split resolved at my conversion). As of 2026-07-26 he also owns **cross-board structural pattern notes** across all 22+ workspace spaces.
- **Milo rides the URITP audit with me** and holds the workspace-knowledge half. His connection reads produce findings I can't reach from list data alone — the SM-certification insight, the open-position placeholder, the production growth-order model. Seat him on any URITP subject.
- **Mira** convenes when a session needs the room (she ran the Space-3 and Space-4 Pre-Gate Workshops); I still lead the audit itself.
- **Wes** is momentum, and on 2026-07-27 he was RIGHT to stop my walk: I had a model-changing finding in hand and kept documenting list 2. **When a finding invalidates the frame, banking it outranks completing the sweep.**
- **Fiona** (FMP Fiona, `fmp-frank`) brings FileMaker buildability findings; she is NOT a parallel auditor.
- Bounded against: Renata (repo-only), Beckett (artifact-break), Literal Lena (literal ask vs my root purpose).

## How Michael works (audit-relevant)
- He gets buried reciting fields/process; my job is to set that aside and ask **"why does this exist?"**
- Mobile-first: no fenced blocks, no wide tables in chat.
- **Flag it, don't fix it.** An audit that quietly edits is the failure.
- Never declare done on his silence. The completeness bar is mine.
- **Purpose > coverage** — "done, no questions" gets pushed back on. Say which purposes were trivial and which needed drilling.
- **He answers in batches and parks deliberately.** A park is a real answer with a come-back trigger; check whether the question SHARPENED while parked.
- 🚨 **A ZERO-STRIKE answer plus a governing note means the question was asked at the WRONG LAYER** (twice: the CRM projection-fan, the One Acts format). He is declining the premise that a structural question can be settled before the programmatic one underneath it. Re-ask higher up; do not re-ask the same question.
- **His v1→v2 pattern (confirmed 4×).** Builds cheaply, graduates to a real structure, leaves v1 as history (RECEIPTS → BETA BUDGET · Gen-1 labels → contact sheets · `Theatre` conventions → SHOW TEMPLATE · **SAFETY Programs → Space-4 `Policies`, 2026-07-27**). **Ask whether the older copy is a PREDECESSOR before flagging duplication.** 🌟 The fourth instance is the important one: it is the **first caught MID-FLIGHT**, with the migration note still live in the task bodies. Every earlier instance was reconstructed backwards from residue. **So the pattern is not just "he leaves v1 behind" — it is "he runs both in parallel, on purpose, and says so in the record."**
- **He reorders the walk, and he's right.** He moved SHOW TEMPLATE to LAST: *"see how we use the folders that you can find then review the template."* Lesson that generalizes: **the canonical artifact is the LAST thing you can judge, because "correct" is defined by observed downstream behaviour, not internal tidiness.**

## URITP audit — live state (detail: `memory/archive/uritp-audit-parks.md`)

**Spaces 1, 2 and 3 are Pass-1 COMPLETE. Space 4 is IN PROGRESS. Index = 59 rows: 39 Confirmed · 20 Documented.** ⚠️ Anything you read saying *"41 rows, none Confirmed"* is stale (it was true at the 2026-07-26 close and was carried in this file until 07-27). **Read the live Index, never a close artifact.**

- **Space 1** = the source/spine layer; calendars, hazard registers and season staffing project OUT.
- **Space 2 (CRM)** = the identity spine. 🗄️ **The Gen-1 per-show label fields are the pre-FY26 company archive — DO NOT CULL** (I flagged them twice before learning this).
- **Space 3 (PRODUCTIONS)** = a production is a time-boxed organization stood up whole and torn down, AND the space is a template system. **The irreducible core is THREE lists** (hub + EVENTS + DESIGN); everything else is elective. **Verdict on SHOW TEMPLATE: it worked, is ~1/3 drafted, and has drifted BEHIND its own clones.** A template extracted from practice has to keep being re-extracted.
- **Space 4 (URITP Programs)** = the **PROOF layer**, not a catalog (true purpose confirmed by Michael 2026-07-27). Space 1 holds WHAT programs exist; Space 4 holds policy → blank form → signed return → incident. Lifecycle state is encoded in NAMING (`{ braces }` = blank, `Person: Topic` = signed) because the space defines **zero custom fields**. ⚠️ Michael's Q4: it is **NOT live and operating** — somewhere between a stalled pilot and superseded, and where that line falls is undecided. Judge every Space-4 flag against that.
- 🌟 **PROGRAM SPRAWL IS RETIRED AS A FLAG.** It was never duplication: 14 of 17 `Programs in Development` tasks are the SAME tasks multi-homed, and `Policies` is the labelled DESTINATION of an in-flight migration off `SAFETY Programs`. **Space 1's PROGRAMS documentation still describes it as sprawl and needs correcting.**
- **`| DEFINITIONS FOR PROGRAMS |`** — a task in Space 1 ▸ Production PROGRAMS, status `researching` since **Jan 2025**. The ROLES/PROGRAMS definition question the audit keeps circling is already an open task in the workspace.
- **Parked, do not force:** ROLES (park #3) · the CRM projection-fan shape · the One Acts format · three umbrella folders' placement · Space-4 Q4's pilot-vs-superseded line. **Scheduled:** Gen-1-going-forward with Corey + Fiona. **Assigned:** ROLES Q1 — Corey + Milo owe a recommendation before Michael rules.

## Open threads I'm carrying
- **General Audit DoD (biggest open build):** no documented protocol for auditing NON-list subjects (docs, builds, workflows, whole systems) the way the List Audit DoD covers lists.
- **Audit-trail indexing gap:** no single "does a trail exist for subject X?" index beyond the List Index.
- **Closing Report graduation:** home built; open question is whether the edit queue needs a severity column.
- **DoD deviation to raise:** the folder track says Vitality/Cadence/Residency/SoT are "N/A (folder)". I set Vitality anyway on 18 Space-3 folder rows. The blanket N/A may be too broad.
- **🔴 Three Index rows sit at `Documented` with NO Purpose set** (PROGRAMS, `| Routines | & Recurring`, URITP Meetings and Events — all Space 1; PROGRAMS is also missing Vitality, Cadence, SoT and List ID). Verified with the field loader, not the census. **The DoD gate says no purpose line = not Documented, so these three are mislabelled.** Raise with Michael; do not silently revert a status.
