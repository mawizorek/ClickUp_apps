# DDR Reconcile · AI Toolkit

**Purpose:** Verify what an app's **docs, handoffs, and Decision Logs CLAIM** against what its **DDR (Database Design Report) SHOWS**. The DDR is the FileMaker file's own exported truth, so it is the ground-truth anchor: when a handoff says *"0 relationships, 0 layouts, print path 0% built"* and the DDR shows *15 relationships, 54 layouts, a working import→print pipeline*, the DDR wins and the docs get flagged.

🔴 **READ `hooks/ddr-family.md` FIRST.** It holds the doctrine this hook shares with `hooks/ddr-reaudit.md` and **this file is not self-contained without it:** evidence vs claims · the coverage gate · the locked run order · the three voices · the four-anchor lane boundary.

**Steward:** Tool is **ownerless** by design (any agent fires it, Doc-Rot Sweep precedent). **FMP Fiona** stewards the FileMaker-domain read — schema literacy, what a table occurrence vs a base table means, whether a script bug is real. A formal, scoped, reported full-app pass **IS an audit and seizes to Audit Anna**; Fiona joins as the domain voice.

**Mode:** On-demand routine. Not always-on — a DDR reconcile is a deliberate pass. Always scopable to one app.

**Invocation:** `/ddr-reconcile` · `/reconcile-ddr` (alias) · "reconcile the DDR" · "does the DDR match the docs?" · "is the app doc still true?" Scoped forms preferred: *"ddr-reconcile production-mawster."*

**Trigger:** a fresh DDR lands in an app's `90-file-imports-temp/DDR_imports/` drop · Michael asks whether an app's documented state is still true · **any moment a doc, handoff, or Decision Log quotes a structural COUNT** (tables / relationships / layouts / scripts / custom functions / value lists) — the count contradiction is the canonical catch · before trusting a handoff that describes what is or isn't built · before re-deriving work a handoff claims is missing.

**Front door: this file, and nothing else.** There is no ClickUp Skill for this tool and there must not be one. **Tools live in git only** (LOCKED 2026-07-25, see `brain-config/skills-integration.md`).

**Established 2026-08-15** by Maestro Mira + FMP Fiona, generalized from the live Production MAWster DDR walk (chunk set `7534bbed`) where the DDR showed 37 tables / 15 relationships / 54 layouts while the live handoffs still read `36 tables · 0 relationships · 0 layouts`. Same failure class Doc-Rot Sweep catches, different ground truth: **not docs-vs-HEAD, but docs-vs-DDR.**

---

## Coordinates

| Surface | Location |
| --- | --- |
| 🔴 **Shared doctrine** | `hooks/ddr-family.md` — **read first, every run** |
| **DDR raw paste** | the app's `90-file-imports-temp/DDR_imports/<YYMMDDHHMM>/` (chunk set + `raw.txt`) |
| **⭐ Mirrors (durable anchor — EVIDENCE)** | the app's `<NN>-<SECTION>/_ide/` trees, written by `ddr-reaudit`. **Use these once the export is gone.** |
| **Tombstone log** | the staging folder's `README.md` — recovery SHA **and the coverage table the coverage gate reads** |
| **App docs under test (CLAIMS)** | the app's tree in `mawizorek/uritp-docs` (e.g. `production-mawster/`): `index.md`, `20-tables/`, `30-RELATIONSHIPS/`, `50-LAYOUTS/`, `70-scripts/`, `60-custom-functions/`, `build-sheet.*`, `ddr-punch-list.*` — **everything NOT under an `_ide/`** |
| **Handoffs + session record** | the 🟢 Agent Activity Board list + the app's ClickUp descriptor page and its Decision Log |
| **Report home** | PR to the DOC repo (`uritp-docs` for URITP apps) + session task comment |

---

## ⭐ The premise

**A DDR is the file describing itself; a doc is a human describing the file from memory.** The doc was true when written and then the file moved. Same asymmetry as Doc-Rot Sweep, one level down: prose about an app rots silently while the app is exercised. The specific damage here is **the reverse of the usual rot** — the docs habitually claim LESS is built than actually is, because a handoff written to say *"here's the mountain still to climb"* never gets revised once the climbing happens.

> **A handoff is a CLAIM. The DDR is EVIDENCE. On conflict, the DDR wins and the claim gets flagged.**

The founding case: a cold agent reading the `get ONE page to print` handoff (`0 relationships, 0 layouts`) would either re-derive a schema that already exists or distrust the DDR entirely. One reconcile pass turns that from a landmine into a diff.

---

## Pass

### 0. Anchor discipline (non-negotiable)

- **State your anchor before reading a single doc:** either the export's timestamp + chunk-set UUID, **or** the mirror path + the tombstone log's recovery SHA. A reconcile against a week-old anchor reports week-old truth. If the `.fmp12` has been edited since, say so and treat findings as provisional.
- 🔴 **An anchor you cannot name is not an anchor. Never silently substitute a hand-written doc for the evidence** — that inverts the pass into a document agreeing with itself. See `ddr-family.md` §1.
- 🔴 **Run the coverage gate before scoping** (`ddr-family.md` §2). Anything uncaptured is `🔵 CANNOT VERIFY` and is declared in the report header.
- **Read the DDR whole, gated if chunked.** Follow the chunk set's own index rules (UUID-verify each part, in order). A partial read produces a partial count and a false contradiction. **Anchored to mirrors instead, read each section index whole** — they carry the counts and the reconciliation arithmetic.
- **Repo read-path law applies** to the docs side: blob API, base64-decoded, re-fetched before any write (GitHub MCP Operating Standard). Never rewrite from a truncated read.

### 1. Reconcile the counts (Pass A — the canonical catch)

Pull the Overview counts (from the DDR, or from the mirror section indexes which transcribe them) and diff every structural count against what the docs/handoffs claim:

| Count | DDR / mirror | Docs / handoff claim | Verdict |
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

Walk each doc claim that something is missing, gapped, blocked, or not started, and check the evidence. The founding example: the scripts index called the JSON param custom-function family a `{.gap}` "must be installed first" — the DDR shows all 10 CFs built with full definitions. **A claimed gap that the evidence fills is rot, flag it.** The inverse counts too: a doc claiming something DONE that the evidence shows absent or stubbed (e.g. a `goto_view_VALUES` with an empty body).

⚠️ **A gap claim about an UNCAPTURED section resolves to `🔵 CANNOT VERIFY`, not "gap confirmed."**

### 3. Log as-built bugs, do NOT fix them (Pass C)

The DDR will surface real defects in the live file: mis-targeted Set Fields, param-key mismatches, branches on unset variables, hardcoded windows. **Record each with its script/field and why it's wrong. Never correct the file or the transcription** — this pass documents reality, it does not repair it. Fixes are a separate, deliberate build decision.

⚠️ **If `ddr-reaudit` has already run, its `observations.md` holds these.** Cross-reference, do not re-derive, and **do not open a parallel finding list.**

### 4. Flag drift in place, never silently correct (Pass D)

- App docs get **flagged**, proposed, reported — this hook is **PROPOSE-ONLY** and never rewrites the curated doc tree, exactly like `gcal-reconcile` and `doc-destroyer-reconcile`.
- When a doc is factually wrong about a count or a gap, the finding names the file, the quoted claim, its date, and what the evidence shows. Correcting it is a follow-up pass Michael greenlights.
- **Structural calls stay Michael's:** which as-built name wins, whether a table is retired, whether a fork is resolved.
- 🔴 **Never edit a mirror to resolve a conflict.** A mirror is evidence; changing it destroys the record. A genuinely wrong mirror is a `ddr-reaudit` re-transcription, not a reconcile fix.

### 5. Triage vocabulary

- 🔴 **COUNT CONTRADICTION**: a doc/handoff structural count disagrees with the evidence. A `0`-vs-nonzero is always 🔴.
- 🔴 **PHANTOM GAP**: doc claims something unbuilt/blocked that the evidence shows built.
- 🟠 **PHANTOM DONE**: doc claims something built that the evidence shows absent or stubbed.
- 🟠 **STALE STATE**: a described state (record counts, statuses) no longer matches. ⚠️ Row counts are **state, not schema** — see gotchas.
- 🟡 **AS-BUILT BUG**: a real defect in the live file, logged not fixed.
- 🟡 **NAMING DRIFT**: docs and evidence disagree on an object's name (the `MAWnster` gotcha).
- 🔵 **CANNOT VERIFY**: the section was never captured, so no verdict is possible. 🔴 **Not a pass. Declared in the header.**
- ⚪ **VERIFIED CURRENT**: doc and evidence agree, said out loud so the pass is auditable.

### 6. Report

Reuse the severity + evidence discipline from `code-review-standard.md`. Do not invent a second format.

```
## DDR Reconcile · <app> · <date>

**Anchor:** <chunk-set UUID> exported <timestamp> | or <mirror path> @ <tombstone SHA>
**Coverage:** verifiable <sections> · 🔵 CANNOT VERIFY <uncaptured sections + why>
**Docs read:** <n> · **Findings:** <n> (🔴 n / 🟠 n / 🟡 n / 🔵 n)

### 🔴 Count contradictions + phantom gaps
- <doc/handoff> claims "<quote>" (dated <when>) — evidence shows <reality>

### 🟠 Phantom done + stale state
### 🟡 As-built bugs (logged, not fixed) + naming drift
### 🔵 Cannot verify
- <doc> makes claims about <section>, which was not captured. Needs a fresh export.

### ⚪ Verified current
- <what was checked and holds>

### For Michael (structural, flagged not decided)
- <as-built name winners, table retirements, forks>
```

**Clean bill → say what was checked.** "I diffed all six counts and the CF family and they hold" is a real result. 🔴 **A clean bill must state its coverage** — "nothing found" across a partially-captured anchor is not a clean bill.

👥 **Inside a full re-audit the report to Michael is FIONA's** (`ddr-family.md` §4). A standalone one-off reconcile reports itself.

---

## ⚠️ Baked-in gotchas (they bite silently)

1. **The filename is `Production_MAWnster.fmp12` — extra `n` — while every doc says `MAWster`.** Whether that is a typo in the file or the docs is Michael's call; the reconcile FLAGS it and never assumes. A cold agent that "corrects" the DDR to match the docs is corrupting the evidence. ⭐ **Confirmed twice on 08-16:** the DDR's own Base Directories block reads `Production_MAWster/` (no `n`) while the file is `Production_MAWnster.fmp12`. **Both spellings sit in one export.**
2. **DDR record counts are STATE, not SCHEMA.** `IMPORT_EVENTS` carrying 5,290 rows is not a design fact — it smells like accumulated test imports. Never treat a row count as a structural claim; 🟠 stale-state at most, often just noise. ⭐ **Proven:** that table went 345 → 5,290 rows in a single day.
3. **A DDR is a snapshot.** It goes stale the instant the file is edited post-export — always state the anchor's date. ⭐ **Proven hard:** the 08-14 export was superseded 18 hours later by one with +8 scripts, +3 relationships, and Value Lists and Custom Functions going 0 → 14 and 0 → 10.
4. **The DDR lists table OCCURRENCES separately from base tables.** A count of occurrences is not a count of tables; read the Overview block, not the relationship graph.
5. 🔴 **A `0` in the Overview is a FACT, not an omission.** `Value Lists 0` / `Custom Functions 0` was dismissed as a DDR gap on 08-14 because scripts visibly called `Param` and `PText`. The next export proved the objects genuinely did not exist — **the scripts were calling functions that were not installed.** Report zeros as findings.
6. 🔴 **One `_ide` in a path is the whole difference between evidence and a claim.** `70-scripts/index.md` is a CLAIM; `70-scripts/_ide/index.md` is EVIDENCE. They sit one folder apart and read similarly. **Check the `provenance:` front matter, not the neighbourhood.**

---

## Composes with

- 🔴 **`hooks/ddr-family.md`** — the shared doctrine. **Not optional; this file is incomplete without it.**
- 🔴 **`hooks/ddr-reaudit.md`** — the CAPTURE half. This hook runs at its Phase 6.5, and its Phase 7 deletes the export this hook depends on.
- `hooks/doc-rot-sweep.md` — the docs-vs-HEAD sibling; run it too, it catches repo drift this pass is blind to.
- `hooks/fleet-fact-sweep.md` — the fleet-claims sibling; same skeleton, third anchor.
- `code-review-standard.md` — severity + evidence format, reused never re-invented.
- `hooks/gcal-reconcile.md` · `hooks/doc-destroyer-reconcile.md` — the propose-only reconciler pattern this follows.
- GitHub MCP Operating Standard — the repo read ladder for the docs side.
- FMP Fiona's bundle (`super-agents/fmp-frank/`) — the FileMaker-domain read that makes Pass B and C trustworthy.

---

## Guardrails

- **PROPOSE-ONLY.** Reports and flags; never rewrites the curated doc tree and never edits the `.fmp12`.
- Read-only until a finding is confirmed against the evidence **and** re-checked against the doc's live HEAD.
- **Never "correct" the DDR or a mirror to match a doc.** The evidence is the evidence; the doc is the claim under test.
- As-built bugs are LOGGED, not fixed. Repair is a separate greenlit build pass.
- Structural calls (name winners, retirements, forks) are flagged for Michael, not decided.
- A formal scoped full-app pass is an audit → Anna leads; Fiona is the domain voice.
- 🔴 **Never run AFTER `ddr-reaudit` Phase 7 without naming your anchor.** The export is gone; anchor to the mirrors and cite the tombstone SHA, or do not run.
- 🔴 **Never report ⚪ VERIFIED CURRENT on an uncaptured section.** Absence of evidence is `🔵 CANNOT VERIFY`.
- 🔴 **Never open a second punch list.** Findings supersede into the app's existing one.

---

## Changelog

- **v1.2 (2026-08-16)** — Answers Michael directly (*"once the transcription has happened, the audit can happen against the actual repo notes and not the DDR?"*): **yes, the anchor moves DDR → mirrors, but NEVER to the notes.** Added the **evidence-vs-claims** split and the **COVERAGE GATE** (uncaptured section = new triage code `🔵 CANNOT VERIFY`, declared in the report header, never `⚪ VERIFIED CURRENT`) — live case: Layout Objects were scoped out of `2608151650`, so `print-geometry.md` is not reconcilable against that anchor at all. New gotcha 6 (one `_ide` in a path is the difference between evidence and a claim). 🔴 **Both additions pushed this file to 24,500 bytes, over the ~22KB ceiling, so the shared doctrine was EXTRACTED to `hooks/ddr-family.md`** — which also killed its duplication into `ddr-reaudit.md`. **Two copies of one law is the drift vector these hooks exist to catch.** Split at write time per the measure-then-split rule, not merged over-ceiling.
- **v1.1 (2026-08-16)** — 🔴 **Reciprocal seam with `hooks/ddr-reaudit.md` written**, after discovering that hook was authored 08-16 from the SAME DDR and chunk set without Fold-in Frank firing. Run order LOCKED; mirrors + tombstone log added as the durable anchor; Pass 0 gained an anchor-naming rule; voice positions stated. Gotchas 1-3 upgraded from predictions to **proven**, new gotcha 5 added from the 08-14 misread. ✅ **Struck the v1 note claiming its AI Toolkit index row still needed adding** — ~~"Needs its AI Toolkit index trigger row added in the same wave"~~ **that row is live; the line was rot in a file whose own job is catching rot.**
- **v1 (2026-08-15)** — Established by Maestro Mira + FMP Fiona out of the Production MAWster DDR walk. Third member of the reconcile/sweep family (Doc-Rot = repo, Fleet-Fact = Index, this = DDR export). Founding contradiction: DDR `37 tables / 15 relationships / 54 layouts / 10 CFs` vs handoffs' `0 relationships / 0 layouts` and a `{.gap}` on an already-built custom-function family.
