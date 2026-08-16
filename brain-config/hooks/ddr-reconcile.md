# DDR Reconcile · AI Toolkit

**Purpose:** Verify what an app's **docs, handoffs, and Decision Logs CLAIM** against what its **DDR (Database Design Report) SHOWS**. The DDR is the FileMaker file's own exported truth, so it is the ground-truth anchor: when a handoff says *"0 relationships, 0 layouts, print path 0% built"* and the DDR shows *15 relationships, 54 layouts, a working import→print pipeline*, the DDR wins and the docs get flagged.

**Steward:** Tool is **ownerless** by design (any agent fires it, Doc-Rot Sweep precedent). **FMP Fiona** stewards the FileMaker-domain read — schema literacy, what a table occurrence vs a base table means, whether a script bug is real. A formal, scoped, reported full-app pass **IS an audit and seizes to Audit Anna**; Fiona joins as the domain voice.

**Mode:** On-demand routine. Not always-on — a DDR reconcile is a deliberate pass. Always scopable to one app.

**Invocation:** `/ddr-reconcile` · `/reconcile-ddr` (alias) · "reconcile the DDR" · "does the DDR match the docs?" · "is the app doc still true?" Scoped forms preferred: *"ddr-reconcile production-mawster."*

**Trigger:** a fresh DDR lands in an app's `90-file-imports-temp/DDR_imports/` drop · Michael asks whether an app's documented state is still true · **any moment a doc, handoff, or Decision Log quotes a structural COUNT** (tables / relationships / layouts / scripts / custom functions / value lists) — the count contradiction is the canonical catch · before trusting a handoff that describes what is or isn't built · before re-deriving work a handoff claims is missing.

**Front door: this file, and nothing else.** There is no ClickUp Skill for this tool and there must not be one. **Tools live in git only** (LOCKED 2026-07-25, see `brain-config/skills-integration.md`). Any agent may fire this mid-task; it needs no owner and no registration beyond its AI Toolkit index trigger row.

**Established 2026-08-15** by Maestro Mira + FMP Fiona, generalized from the live Production MAWster DDR walk (chunk set `7534bbed`) where the DDR showed 37 tables / 15 relationships / 54 layouts while the live handoffs still read `36 tables · 0 relationships · 0 layouts`. Same failure class Doc-Rot Sweep catches, different ground truth: **not docs-vs-HEAD, but docs-vs-DDR.**

---

## 🔴 SEAM WITH `hooks/ddr-reaudit.md` — read this BEFORE running either

**Added 2026-08-16.** `ddr-reaudit` was authored a day after this hook, **from the same DDR and the same chunk set (`7534bbed` / `2608151650`)**, without Fold-in Frank firing. **They are not duplicates and neither is retired** — they are two verbs on one noun:

| | `ddr-reconcile` (this file) | `ddr-reaudit` |
|---|---|---|
| **Verb** | COMPARE — tests claims against evidence | CAPTURE — converts evidence into a permanent record |
| **Writes** | **Nothing. PROPOSE-ONLY.** | Verbatim `_ide` mirrors, punch list, tombstone |
| **Asks** | *Do the docs still match the file?* | *What does the file actually contain?* |
| **Outlives the DDR?** | ❌ No — needs the export or a mirror of it | ✅ Yes — that is its whole point |

🔴 **THE DEPENDENCY RUNS ONE WAY, AND IT IS SHARP: `ddr-reaudit` Phase 7 DELETES the export this hook needs.** Fired after that, this pass has no anchor at all.

**✅ RUN ORDER, LOCKED:**

1. `ddr-reaudit` Phases 0-6 — capture the export into mirrors while it exists.
2. **THIS HOOK, at `ddr-reaudit` Phase 6.5** — diff the hand-written docs against **the MIRRORS**, not the raw export. ⭐ **The mirrors are the durable anchor; that substitution is the whole point of the seam.** They are verbatim, so Pass A counts and Pass B gap-claims are equally checkable against them, and unlike the export they still exist next month.
3. `ddr-reaudit` Phase 7 — tombstone and delete, only after this pass has run.

**Findings from this pass feed the app's EXISTING punch list.** 🔴 **Never open a second one** — `ddr-reaudit` Phase 6 supersedes in place, and two lists means neither is trusted.

⚠️ **Overlap that is DELIBERATE, do not de-duplicate it:** both hooks reconcile structural counts, both log as-built bugs without fixing them, both seat Fiona on the domain read. **This hook catches a doc that LIES about a count; reaudit catches a count that has NO doc at all.** Different failures, same arithmetic.

👥 **Voice position in the family** (`ddr-reaudit` § Three Voices, Michael 2026-08-16): **Scribe Sana** captures verbatim and corrects nothing · **Audit Anna** owns the diff and says *"this is what is different"* — **this hook is one of her instruments** · **FMP Fiona** reports the meaning to Michael. ⚠️ The agent is Scribe **SANA**; *"Scribe Sara"* is not a thing and **Sara Penner is a real person in the URITP staff room.**

---

## Coordinates

| Surface | Location |
| --- | --- |
| **DDR raw paste** | the app's `90-file-imports-temp/DDR_imports/<YYMMDDHHMM>/` (chunk set + `raw.txt`) |
| **⭐ Mirrors (the durable anchor)** | the app's `<NN>-<SECTION>/_ide/` trees — written by `ddr-reaudit`. **Use these when the export is gone.** |
| **Tombstone log** | the staging folder's own `README.md` — carries the deleted export's recovery SHA and coverage table |
| **App docs under test** | the app's tree in `mawizorek/uritp-docs` (e.g. `production-mawster/`): `index.md`, `20-tables/`, `30-RELATIONSHIPS/`, `50-LAYOUTS/`, `70-scripts/`, `60-custom-functions/`, `build-sheet.*`, `ddr-punch-list.*` |
| **Handoffs + session record** | the 🟢 Agent Activity Board list + the app's ClickUp descriptor page and its Decision Log |
| **Report home** | PR to the DOC repo (`uritp-docs` for URITP apps) + session task comment |
| **Lane seams** | `ddr-reaudit` (capture half) · Doc-Rot Sweep (docs vs HEAD) · Fleet-Fact Sweep (fleet claims) · Audit Anna (formal audit lead) |

---

## ⭐ The premise

**A DDR is the file describing itself; a doc is a human describing the file from memory.** The doc was true when written and then the file moved. Same asymmetry as Doc-Rot Sweep, one level down: prose about an app rots silently while the app is exercised. The specific damage here is **the reverse of the usual rot** — the docs habitually claim LESS is built than actually is, because a handoff written to say *"here's the mountain still to climb"* never gets revised once the climbing happens.

> **A handoff is a CLAIM. The DDR is EVIDENCE. On conflict, the DDR wins and the claim gets flagged.**

The founding case: a cold agent reading the `get ONE page to print` handoff (`0 relationships, 0 layouts`) would either re-derive a schema that already exists or distrust the DDR entirely. One reconcile pass turns that from a landmine into a diff.

---

## Lane boundary (do NOT duplicate these)

| Tool | Asks |
| --- | --- |
| **Doc-Rot Sweep** (`hooks/doc-rot-sweep.md`) | Is what our docs CLAIM still TRUE at repo HEAD? Ground truth = the git repo. |
| **Fleet-Fact Sweep** (`hooks/fleet-fact-sweep.md`) | Do our files still describe the FLEET correctly? Ground truth = the 🤖 Agent Index. |
| **`ddr-reaudit`** (`hooks/ddr-reaudit.md`) | What does the file actually CONTAIN? **Produces** the mirrors this hook reads. |
| **THIS reconcile** | Do the app's docs match the DDR? Ground truth = **the FileMaker file's own exported DDR** (or its verbatim mirror). |

All four run the same skeleton (scope → classify claims → verify against a source of truth → flag, don't silently fix) against a **different anchor**. Doc-Rot's anchor is the repo; Fleet-Fact's is the Index; this one's is the DDR export. **The DDR can itself be stale** the moment the file is edited after export — so a reconcile is only as fresh as its DDR, and the run must state the DDR's export timestamp up front. When "the doc is wrong" is really "the repo moved," that is Doc-Rot's. When it is "the doc and the repo agree but neither matches the actual .fmp12," that is THIS tool's. When there is **no doc at all** for something the file contains, that is `ddr-reaudit`'s.

---

## Pass

### 0. Anchor discipline (non-negotiable)

- **State the DDR's export timestamp and chunk-set UUID before reading any doc.** A reconcile against a week-old DDR reports week-old truth. If the file has been edited since export, say so and treat findings as provisional.
- 🔴 **If the export is GONE, say which mirror you are anchored to and cite the tombstone log's recovery SHA.** An anchor you cannot name is not an anchor. Never silently substitute a hand-written doc for the evidence — that inverts the whole pass.
- **Read the DDR whole, gated if chunked.** Follow the chunk set's own index rules (UUID-verify each part, in order). A partial DDR read produces a partial count and a false contradiction.
- **Repo read-path law still applies** to the docs side: blob API, base64-decoded, re-fetched before any write (GitHub MCP Operating Standard). Never rewrite from a truncated read.

### 1. Reconcile the counts (Pass A — the canonical catch)

Pull the DDR's Overview block and diff every structural count against what the docs/handoffs claim:

| Count | DDR Overview | Docs / handoff claim | Verdict |
| --- | --- | --- | --- |
| Tables | | | |
| Relationships | | | |
| Layouts | | | |
| Scripts | | | |
| Custom functions | | | |
| Value lists | | | |

Any mismatch is a finding. **A `0` in a handoff against a non-zero DDR is the highest-severity shape** — it tells a cold agent to build something that exists.

⚠️ **Count ONCE and derive from the rows.** The 08-16 punch list shipped four separate count errors in one day, in a document whose own job is flagging undocumented arithmetic. **State each number once, sourced.**

### 2. Verify every `{.gap}` / "not built" / "blocked" claim (Pass B)

Walk each doc claim that something is missing, gapped, blocked, or not started, and check the DDR. The founding example: the scripts index called the JSON param custom-function family a `{.gap}` "must be installed first" — the DDR shows all 10 CFs built with full definitions. **A claimed gap that the DDR fills is rot, flag it.** The inverse also counts: a doc claiming something is DONE that the DDR shows absent or stubbed (e.g. a `goto_view_VALUES` with an empty body).

### 3. Log as-built bugs, do NOT fix them (Pass C)

The DDR will surface real defects in the live file: mis-targeted Set Fields, param-key mismatches, branches on unset variables, hardcoded windows. **Record each with its script/field and why it's wrong. Never correct the file or the transcription** — this pass documents reality, it does not repair it. Fixes are a separate, deliberate build decision.

⚠️ **If `ddr-reaudit` has already run, its `observations.md` holds these.** Cross-reference, do not re-derive, and **do not open a parallel finding list.**

### 4. Flag drift in place, never silently correct (Pass D)

- App docs get **flagged**, proposed, reported — this hook is **PROPOSE-ONLY** and never rewrites the curated doc tree, exactly like `gcal-reconcile` and `doc-destroyer-reconcile`.
- When a doc is factually wrong about a count or a gap, the finding names the file, the quoted claim, its date, and what the DDR shows. Correcting it is a follow-up pass Michael greenlights.
- **Structural calls stay Michael's:** which as-built name wins, whether a table is retired, whether a fork is resolved.

### 5. Triage vocabulary

- 🔴 **COUNT CONTRADICTION**: a doc/handoff structural count disagrees with the DDR. A `0`-vs-nonzero is always 🔴.
- 🔴 **PHANTOM GAP**: doc claims something unbuilt/blocked that the DDR shows built.
- 🟠 **PHANTOM DONE**: doc claims something built that the DDR shows absent or stubbed.
- 🟠 **STALE STATE**: a described state (record counts, statuses) no longer matches the DDR. ⚠️ Row counts are **state, not schema** — see gotchas.
- 🟡 **AS-BUILT BUG**: a real defect in the live file, logged not fixed.
- 🟡 **NAMING DRIFT**: docs and DDR disagree on an object's name (the `MAWnster` gotcha).
- ⚪ **VERIFIED CURRENT**: doc and DDR agree, said out loud so the pass is auditable.

### 6. Report

Reuse the severity + evidence discipline from `code-review-standard.md`. Do not invent a second format.

```
## DDR Reconcile · <app> · <date>

**Anchor:** <chunk-set UUID> exported <timestamp> | or <mirror path> @ <tombstone SHA>
**Docs read:** <n> · **Findings:** <n> (🔴 n / 🟠 n / 🟡 n)

### 🔴 Count contradictions + phantom gaps
- <doc/handoff> claims "<quote>" (dated <when>) — DDR shows <reality>

### 🟠 Phantom done + stale state
### 🟡 As-built bugs (logged, not fixed) + naming drift
### ⚪ Verified current
- <what was checked and holds>

### For Michael (structural, flagged not decided)
- <as-built name winners, table retirements, forks>
```

**Clean bill → say what was checked.** "I diffed all six counts and the CF family and they hold" is a real result.

👥 **When this pass runs inside a full re-audit, the report to Michael is FIONA's** (`ddr-reaudit` Phase 8): Anna's diff says *what is different*, Fiona says *what it means for the build*. A standalone one-off reconcile reports itself.

---

## ⚠️ Baked-in gotchas (they bite silently)

1. **The filename is `Production_MAWnster.fmp12` — extra `n` — while every doc says `MAWster`.** Whether that is a typo in the file or in the docs is Michael's call; the reconcile FLAGS it and never assumes. A cold agent that "corrects" the DDR to match the docs is corrupting the evidence. ⭐ **Confirmed twice over 08-16:** the DDR's own Base Directories block reads `Production_MAWster/` (no `n`) while the file is `Production_MAWnster.fmp12`. **Both spellings are in one export.**
2. **DDR record counts are STATE, not SCHEMA.** `IMPORT_EVENTS` carrying 5,290 rows is not a design fact — it smells like accumulated test imports. Never treat a row count as a structural claim; it belongs in 🟠 stale-state at most, and often is just noise. ⭐ **Proven:** that table went 345 → 5,290 rows in a single day.
3. **A DDR is a snapshot.** It goes stale the instant the file is edited post-export. The reconcile is only as trustworthy as its DDR timestamp — always state it. ⭐ **Proven hard:** the 08-14 export was superseded 18 hours later by one with +8 scripts, +3 relationships, and Value Lists and Custom Functions going 0 → 14 and 0 → 10.
4. **The DDR lists table OCCURRENCES separately from base tables.** A count of occurrences is not a count of tables; read the Overview block, not the relationship graph, for the table count.
5. 🔴 **A `0` in the Overview is a FACT, not an omission.** `Value Lists 0` / `Custom Functions 0` was dismissed as a DDR gap on 08-14 because scripts were visibly calling `Param` and `PText`. The next export proved the objects genuinely did not exist — **the scripts were calling functions that were not installed.** Report zeros as findings.

---

## Composes with

- 🔴 **`hooks/ddr-reaudit.md`** — the CAPTURE half of this family. **Read the seam section above.** This hook runs at its Phase 6.5, and its Phase 7 deletes the export this hook depends on.
- `hooks/doc-rot-sweep.md` — the docs-vs-HEAD sibling; run it too, it catches repo drift this pass is blind to.
- `hooks/fleet-fact-sweep.md` — the fleet-claims sibling; same skeleton, third anchor.
- `code-review-standard.md` — severity + evidence format, reused never re-invented.
- `hooks/gcal-reconcile.md` · `hooks/doc-destroyer-reconcile.md` — the propose-only reconciler pattern this follows.
- GitHub MCP Operating Standard — the repo read ladder for the docs side.
- FMP Fiona's bundle (`super-agents/fmp-frank/`) — the FileMaker-domain read that makes Pass B and C trustworthy.

---

## Guardrails

- **PROPOSE-ONLY.** Reports and flags; never rewrites the curated doc tree and never edits the .fmp12.
- Read-only until a finding is confirmed against the DDR **and** re-checked against the doc's live HEAD.
- **Never "correct" the DDR to match a doc.** The DDR is the evidence; the doc is the claim under test.
- As-built bugs are LOGGED, not fixed. Repair is a separate greenlit build pass.
- Structural calls (name winners, retirements, forks) are flagged for Michael, not decided.
- A formal scoped full-app pass is an audit → Anna leads; Fiona is the domain voice.
- 🔴 **Never run this AFTER `ddr-reaudit` Phase 7 without naming your anchor.** The export is gone by then; anchor to the mirrors and cite the tombstone SHA, or do not run.
- 🔴 **Never open a second punch list.** Findings supersede into the app's existing one.

---

## Changelog

- **v1.1 (2026-08-16)** — 🔴 **Reciprocal seam with `hooks/ddr-reaudit.md` written**, after discovering that hook was authored 08-16 from the SAME DDR and chunk set without Fold-in Frank firing. Run order LOCKED (reaudit capture → this pass against the MIRRORS → reaudit tombstone+delete); mirrors + tombstone log added to Coordinates as the durable anchor; Pass 0 gains an anchor-naming rule for a deleted export; voice position stated (Sana captures · Anna diffs, this hook is her instrument · Fiona reports). Gotchas 1-3 upgraded from predictions to **proven**, and new gotcha 5 (a `0` is a fact) added from the 08-14 misread. ✅ **Struck the v1 note claiming its AI Toolkit index row still needed adding** — ~~"Needs its AI Toolkit index trigger row added in the same wave"~~ **that row is live; the line was rot in a file whose own job is catching rot.**
- **v1 (2026-08-15)** — Established by Maestro Mira + FMP Fiona out of the Production MAWster DDR walk. Third member of the reconcile/sweep family (Doc-Rot = repo, Fleet-Fact = Index, this = DDR export). Founding contradiction: DDR `37 tables / 15 relationships / 54 layouts / 10 CFs` vs handoffs' `0 relationships / 0 layouts` and a `{.gap}` on an already-built custom-function family.
