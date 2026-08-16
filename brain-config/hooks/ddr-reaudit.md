# DDR Re-Audit · AI Toolkit

**Purpose:** Turn any FileMaker DDR export into verbatim `_ide` mirrors plus a superseding punch list, then delete the export — without ever letting a claim outlive its evidence.

**Steward:** **Audit Anna.** She owns this file and LEADS every run.

**Mode:** Gated. Fires on DDR presence, runs multi-pass, **never end to end in one sitting.**

**Invocation:** `/ddr-reaudit` · `/ddr` · "re-audit the DDR" · "capture this DDR" · "transcribe the DDR" · ALSO automatic on a DDR export appearing in any repo's import-staging folder, or on Michael handing over a DDR folder URL.

**Trigger:** ANY FileMaker DDR, any app, any repo. Michael's ruling, 2026-08-16: *"ANY ddr ofc."* Not URITP-scoped. The staging path and the mirror destination are resolved per repo at run time (see Coordinates), never hardcoded here.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-08-16** by Audit Anna + FMP Fiona, from the four-pass capture of `Production_MAWnster` DDR `2608151650` run 2026-08-14 to 08-16. **Every rule below was paid for in that run.**

---

## 👥 THREE VOICES, THREE PHASES, NEVER COLLAPSED

Michael's ruling, 2026-08-16: *"audit anna should do the phase one ... and then anna shld report 'this is what is diffeent' and then fiona reports it meaningfully to me."*

**Anna runs the whole thing. Sana holds the pen in Phase 1. Fiona holds the mic in Phase 3.**

| Phase | Voice | Produces | Never does |
|---|---|---|---|
| **1 · CAPTURE** | **Scribe Sana** (stateless lens) | Verbatim `_ide` mirrors. Transcription only. | 🔴 **She corrects NOTHING.** No interpretation, no verdict, no fix. |
| **2 · DIFF** | **Audit Anna** (steward, leads) | *"This is what is different."* Count reconciliation, prior-list reconciliation, the observations register. | Does not rule on what a FileMaker defect MEANS. |
| **3 · MEANING** | **FMP Fiona** (domain voice) | The report **to Michael**: blast radius, what breaks, what to fix first. | Does not re-transcribe, does not re-diff. |

🔴 **This is a FOLD of the proven two-pass split in `hooks/meeting-transcript-attribution.md`, not a net-new model.** That hook already established the law and the reason: **a scribe who corrects is INVENTING; a domain owner who retypes is EXPENSIVE.** Same asymmetry here — `calc_ResolvedEnd` reads `dateTime_Start` is in the DDR, but *"therefore every emphasis span resolves to zero length"* is in Fiona's head, not the export.

⚠️ **NAME COLLISION, and it bit on 2026-08-16:** the agent is **Scribe SANA**. *"Scribe Sara"* is not a thing — **Sara Penner is a real person in the URITP staff room.** Resolve against the 🤖 Agent Index, never phonetically.

⚠️ **Phase boundaries are also STOP points.** Phase 1 can span several sittings; Phase 2 does not start on a half-captured section; Phase 3 does not fire on an unreconciled diff. **A phase that reports early is reporting on work that is not there.**

---

## 🔴 SEAM WITH `hooks/ddr-reconcile.md` — read this BEFORE running either

**Two hooks, one family, and they were built four days apart without knowing about each other.** `ddr-reconcile` was born 2026-08-15 (Mira + Fiona, PR #825) out of **this same DDR and the same chunk set**; this hook was born 08-16 **without firing Fold-in Frank**, which is the exact gate that would have caught the duplication. **Recorded, not buried** — the omission is the lesson.

**They are NOT duplicates. They are two verbs on one noun:**

| | `ddr-reaudit` (this file) | `ddr-reconcile` |
|---|---|---|
| **Verb** | CAPTURE — converts evidence into a permanent record | COMPARE — tests claims against evidence |
| **Writes** | Verbatim mirrors, punch list, tombstone | **Nothing. PROPOSE-ONLY.** |
| **Asks** | *What does the file actually contain?* | *Do the docs still match the file?* |
| **Ground truth** | The DDR export | The DDR export |
| **Outlives the DDR?** | ✅ Yes — that is its whole point | ❌ No |

🔴 **THE DEPENDENCY, and it runs one way: `ddr-reaudit` DELETES the export that `ddr-reconcile` needs.** Phase 7 tombstones and removes the DDR. Any reconcile fired afterwards has no anchor left.

**✅ THE RUN ORDER, LOCKED:**

1. **`ddr-reaudit` Phases 0-6 first** — capture the export into mirrors while it still exists.
2. **`ddr-reconcile` diffs the hand-written docs against the MIRRORS**, not against a deleted export. The mirrors are the durable anchor; that is the substitution this seam makes.
3. **`ddr-reaudit` Phase 7 last** — tombstone and delete only after both have run.

⚠️ **Overlap that is DELIBERATE, do not de-duplicate it:** both hooks reconcile structural counts, both log as-built bugs without fixing them, and both seat Fiona on the domain read. **Reconcile catches a doc that lies about a count; reaudit catches a count that has no doc at all.** Different failures, same arithmetic.

---

## Coordinates

| Surface | Location |
| --- | --- |
| **Repo referent** | 🔴 RESOLVE AT RUN TIME via `gates/repo-referent-gate.md`. State `owner/repo@branch` in visible text before the FIRST GitHub call. The DDR's app decides the repo, NOT this file. |
| **Read path** | `GitHub MCP — Operating Standard`: blob API first, pinned SHA, re-fetch before any decision or write. |
| **Staging (URITP precedent)** | `production-<app>/90-file-imports-temp/DDR_imports/<YYMMDDHHMM>/` |
| **Mirror convention** | `<NN>-<SECTION>/_ide/` beside the hand-written docs, never inside them |
| **Punch list (URITP precedent)** | `production-<app>/ddr-punch-list.md` + `.tsv` |
| **Chunk set** | `source/raw_index.txt` — the manifest, UUIDs and the token budget |
| **Sibling hook** | `hooks/ddr-reconcile.md` — runs BETWEEN Phase 6 and Phase 7. See the seam above. |

---

## Procedure

### Phase 0 · Budget check. STOP HERE FIRST. *(Anna)*

1. Read `source/raw_index.txt` **only**. Do not open a chunk.
2. **Obey the chunker's own rule 0.** If estimated tokens exceed its stated threshold, say so and propose a scoped pass. A 360KB DDR is ~78k tokens against a 28k threshold; it does **not** fit one sitting.
3. Report the delta against any prior import still present: byte size, chunk count, and Overview counts. **A growth curve is a finding** (102KB → 238KB → 314KB → 360KB across five days told us the schema was moving faster than the docs).

### Phase 1 · Read the Overview, then reconcile every count *(Anna)*

4. Chunk 1 carries `Tables / Relationships / Layouts / Scripts / Value Lists / Custom Functions`. **These are the completeness tripwires.** Every later phase must reconcile against them.
5. 🔴 **A zero in the Overview is a FACT, not an omission.** `Value Lists 0` and `Custom Functions 0` were dismissed as a DDR gap on 08-14; the 08-15 export proved the objects genuinely did not exist and scripts were calling functions that were not installed. **Report zeros as findings.**
6. Derive what the Overview does not state (e.g. total field count by summing per-table figures) and **label it derived**, not a DDR figure.

### Phase 2 · CAPTURE, section by section, unit-complete *(Scribe Sana holds the pen)*

🔴 **This is Sana's phase. Transcription only. She corrects NOTHING** — not a typo, not a broken calc, not an obvious mistake. Every judgement waits for Phase 5.

7. **Work unit-complete: a table, script or relationship is either fully transcribed or absent. NEVER half-written.**
8. When a chunk boundary splits a unit, read both chunks, verify both UUIDs, record the splice, and **discard partial text rather than completing it by inference.**
9. Echo `read N/TOTAL, uuid verified` per chunk. A mismatched or missing UUID **halts the pass** and gets reported.
10. **Verbatim means verbatim:** typos, commented-out steps, `<unknown>` targets, `<Field Missing>`, doubled lines, true `≠` glyphs, curly quotes, duplicated comment text. 🔴 **A transcription that silently normalises is worse than none** — `!=` was substituted for `≠` on 08-14 and had to be corrected the same day.
11. Record source ambiguities, **do not resolve them.** Duplicated object names, parentless entries, empty folders, DDR-truncated comments, unbalanced parens: all get transcribed with the ambiguity stated.
12. An absent DDR column is written `(none)` so *absent* is distinguishable from *not transcribed*.

### Phase 3 · Batch by fields, measure at write time *(Sana)*

13. 🔴 **Budget by FIELD COUNT and comment density, NOT by unit count.** Aim ~60-100 fields per file. The "~10 tables per file" heuristic failed mid-capture: 10 tables = 17.4KB in one batch, **4 tables = 15.5KB** in another, because one table carried 26 heavily-commented fields.
14. **Measure every file from its own write response, immediately.** Never quote a size from an earlier listing.
15. If a file lands over ~22KB, **split it at a real domain seam in the same pass.** Do not merge a known-over file and do not record a violation.

### Phase 4 · Factoring, declared not hidden *(Sana proposes, Anna ratifies)*

16. Where a block repeats verbatim across dozens of units (audit fields, standard options blocks), transcribe it **ONCE in the section index** and reference it. **State the factoring loudly in both the index and every file that relies on it** — those files are not self-contained on that point.
17. 🔴 **Verify the factored claim against EVERY unit before asserting it universally.** A rule proven on 30 of 37 tables was asserted as universal and was false in the 33rd (`UTILITY_REPORTS.CreationTimestamp` carries a layout reference). **Strike and correct on the record; never silently swap.**

### Phase 5 · DIFF · observations register *(Audit Anna — "this is what is different")*

🔴 **Anna's phase. This is where reading becomes finding, and it is deliberately AFTER Sana is done.**

18. Cross-unit readings go in a **separate `observations.md`**, never inside the transcription files. A transcription that argues with itself stops being a transcription.
19. Every entry is a **direct reading with its sources quoted**, so it can be checked without re-reading the DDR. **No verdicts, no fixes** — verdicts are Fiona's in Phase 8.
20. Hunt these classes explicitly, because they are what the run found:
    - **Comment vs options contradictions** (`Indexed.` on an unindexed field; `default = 1` with `Constant data: 0`).
    - **Byte-identical pairs** that should differ (two calc fields, two value lists).
    - **A multi-argument value built from one argument.** Three instances in one file is a **pattern**, not three slips, and all three are silent — right type, plausible value, no error.
    - **Writers and readers disagreeing:** a script setting a literal its own field comment forbids; a field nothing writes; a counter nothing increments; a key nothing reads. 🔴 **Invisible until scripts exist. Nine of 26 new findings were this shape.**
    - **Live misspellings that must be used as spelled**, separated from comment-text typos.
    - **Truncated in the source itself**, distinguished from truncated in transcription.
21. ✅ **Record counter-examples too** — what IS correctly wired. They go in the register, never the punch list.

### Phase 6 · Punch list: supersede, never accumulate *(Anna)*

22. **One punch list per app. A second list means neither is trusted.**
23. **Reconcile EVERY row of the prior list** into: closed · partially fixed and re-scoped · still open and verified · **carried but NOT re-verified**. Publish the reconciliation table.
24. 🔴 **A DDR cannot verify non-schema rows.** Repo, renderer and token items get carried with `NOT RE-VERIFIED` **in the row text itself**. Their presence is not confirmation they are broken; their silence is not confirmation they are fixed.
25. **Carry the age.** An `Origin` column stating which audit found a row is the only way it can say *"filed a week ago, still here"* without that living in prose nobody re-reads. `calc_ResolvedEnd` sat unfixed for seven days.
26. Watch for a **rename wave** between audits. Seven table renames invalidated every `@table-*` doc id and promoted a tidy-up row to the highest-leverage item on the list.
27. 🔴 **A defect may INVERT rather than get fixed.** `hash_history` went from never-changing to always-changing; the formula moved and the defect swapped ends. **Re-read the mechanism, do not tick the row.**
28. Some prior rows need **re-deciding, not re-doing**, when the architecture moved under them or their target word got taken by another concept. Those become ⬜, not 🔴.
29. Order by **dependency, not severity.** Carry severity in a separate tier column so sorting still works.
30. 🔴 **STATE THE DENOMINATOR.** A defect count with no denominator reads as a verdict on the build. 58 findings against ~543 built objects is ~11%, and ~1% corrupts data. **Publish the tally and the ratio in one place, up front.**
31. 🔴 **COUNT ONCE, FROM THE ROWS.** The 08-16 list shipped with "four", "five" and "1-6" for one set in adjacent paragraphs, and a prose total that disagreed with the row data. **Four count errors in one document in one day.** Derive every number from the rows, then state it once. **This is the same undocumented-arithmetic defect the hook flags in schemas.**

### Phase 6.5 · HAND OFF TO `ddr-reconcile` *(Anna, before deleting anything)*

32. 🔴 **Run `hooks/ddr-reconcile.md` NOW, against the mirrors, while the export still exists.** It tests the hand-written doc tree against what Phases 2-6 captured. **After Phase 7 it has no anchor.**
33. Its findings feed the same punch list — **do NOT open a second one.**

### Phase 7 · Tombstone, THEN delete *(Anna)*

34. 🔴 **WRITE THE TOMBSTONE ROW BEFORE THE FIRST DELETE.** In the staging folder's own `README.md`, record: source file, size, chunk count, set UUID, file count, Overview counts, section-by-section coverage, **what was NOT captured**, and 🔑 **the last commit SHA containing the export**, with the literal `git show` command.
35. Delete only after the tombstone is committed. Report the file count.
36. 🔴 **NEVER delete an untranscribed import.** One was left in place on 08-16 because deleting it would have dropped content held nowhere else.
37. **Origin of this rule:** the 08-14 export was deleted while the scripts mirror still cited it as its live source, leaving provenance pointing at a path that no longer resolved, and it has **no recovery SHA recorded at all.** That is the failure this phase exists to prevent.

### Phase 8 · MEANING · report to Michael *(FMP Fiona)*

🔴 **Fiona's phase, and it is the only one Michael reads.** Anna's diff says *what is different*; **Fiona says what it MEANS.**

38. Translate each finding into consequence: **what silently produces wrong output** vs **what cannot fire at all** vs **what is free to fix today and expensive next month.**
39. **Name the blast radius.** *"merge writes `"err"` into the name and both dates on every merged event"* beats *"four key mismatches."*
40. **Say whether records exist yet to make it visible.** A zero-record table hides a defect; 5,290 rows do not.
41. **Give a two-item "if only two things get fixed" list.** A 58-row list with no entry point is a wall.
42. Report the mechanical facts too, but underneath: units captured vs Overview counts, files written with **measured** sizes, the reconciliation table, and the named gaps.
43. **Every mirror carries `provenance:` front matter pointing at the section index**, which points at the tombstone log. When the DDR dies, the chain still resolves.

---

## Guardrails

- 🔴 **NEVER run end to end.** Multi-pass by design. Stop on a unit boundary so the next agent inherits whole finished units.
- 🔴 **TRANSCRIBE, DO NOT FIX.** This hook never edits a schema, a script or a calculation. Findings are recorded; **Michael decides.**
- 🔴 **Never claim a doc's description of a file as knowledge of the file.** On 08-14 a doc page saying *"nine scripts live in the file"* was repeated as fact while the file held 44. **The DDR is ground truth; the docs are a claim.**
- 🔴 **Never collapse the three voices into one pass.** A single agent doing capture-diff-meaning in one sweep is how a transcription acquires opinions and a finding loses its evidence.
- **State the repo coordinate in visible text before the first GitHub call.** No stated coordinate = the gate did not fire.
- **Branch → PR → self-merge.** Never direct to `main`.
- **A section may be scoped OUT by ruling** (Layout Objects, 08-16), but the omission is **stated in the file with what is and is not recoverable.** Never a silent gap.
- **Canonical-elsewhere content gets an INDEX, not a transcription.** Custom functions are canonical in another repo, so the mirror holds names, signatures and call sites — no bodies, no second claimant. Reconciliation is existence-check only: *confirm each exists, stop, do not diff line-for-line* (Michael, 2026-08-16).
- **Never name a repo you have not resolved live.** The canonical CF repo is deliberately unnamed in the mirror for exactly this reason.
- **PII:** a DDR carries real field names, comments and record counts. Judge visibility **per repo, never carried across** — `uritp-docs` is PRIVATE, `ClickUp_apps` is PUBLIC.
- 🔴 **Fire Fold-in Frank before authoring anything adjacent to this hook.** This file is itself the evidence: it shipped as net-new while `ddr-reconcile` already existed, from the same DDR, four days earlier.

---

## Composes with

- 🔴 **`hooks/ddr-reconcile.md`** — the COMPARE half of this family. Runs at Phase 6.5, before the export is deleted. **Read the seam section above before firing either.**
- `gates/repo-referent-gate.md` — fires FIRST, every run, before any read.
- `hooks/meeting-transcript-attribution.md` — the proven two-pass scribe/domain split this hook's phasing folds in. **Same law: a scribe who corrects is inventing.**
- `GitHub MCP — Operating Standard` — blob-first read path, PR-merge workflow.
- `hooks/doc-rot-sweep.md` — that checks docs against HEAD; this checks **HEAD against the running application.** A re-audit can hand it a queue.
- `agents/size-sally.md` — forecasts file-size curves on the build path; Phase 3 is the reactive half.
- `gates/deletion-flag-gate.md` — for anything the audit nominates for deletion. **Agent flags, Michael deletes.**
- `agents/foldin-frank.md` — fires BEFORE any new tool in this space. Skipped on 08-16; that is why this seam had to be written after the fact.
- `super-agents/audit-anna/` · `super-agents/fmp-frank/` · Scribe Sana (lens) — the three voices.
- Decision Logs Gold Standard — rulings and open questions go to the app's DL, never onto a punch list.

---

## Known limits

- **It cannot test.** Every finding is a reading of transcribed text. "Merge writes `"err"`" is derived from key comparison, not from a run.
- **It cannot see FileMaker automations or triggers beyond what the DDR prints**, and cannot resolve a `<unknown>` script target.
- **It cannot tell a DDR printer truncation from a genuinely malformed source.** Both get recorded as the open question they are.
- **Record counts are a snapshot, not schema.** `IMPORT_EVENTS` went 345 → 5,290 in one day.
- **One live sample.** This runbook is generalised from a single app across four passes. 🔴 **A cold session that finds no prior run for a given app SAYS SO rather than assuming the procedure is proven there.**
- **The three-phase split has never been run as three voices.** The founding run was one agent doing all three, which is precisely how the count errors and the premature universal claim got in. 🔴 **A cold session says so rather than claiming the phasing is proven.**

---

## Changelog

- **v2 (2026-08-16)** — 👥 **Three-voice phasing added** (Michael): **Scribe Sana** captures verbatim in Phase 2-3 and corrects nothing · **Audit Anna** stewards, leads, and owns the Phase 5-6 diff (*"this is what is different"*) · **FMP Fiona** owns Phase 8, the report to Michael, translating findings into consequence. Folds in the proven scribe/domain split from `meeting-transcript-attribution.md`. 🔴 **`ddr-reconcile` seam written** after discovering it was born 08-15 from the SAME DDR: run order LOCKED as reaudit capture → reconcile against the mirrors → reaudit tombstone+delete, with new Phase 6.5 as the handoff, because **this hook deletes the export that hook needs.** Fold-in Frank was NOT fired before v1; recorded as the lesson rather than quietly fixed.
- **v1 (2026-08-16)** — Established by Audit Anna (steward) + FMP Fiona (responder). Generalised from the `Production_MAWnster` DDR `2608151650` capture: 37 tables / 398 fields, 15 relationships, 52 scripts, 54 layouts, 14 value lists, 10 CFs mirrored across four passes, then the export tombstoned and deleted. Scope: ANY DDR, any app, any repo (Michael). Every numbered rule traces to a specific failure or correction in that run.
