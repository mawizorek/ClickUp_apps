# Reconcile Engine — domain-blind surface reconciliation

> **The ENGINE holds the loop + every guardrail. A MANIFEST holds the domain (surfaces, routing,
> normalization, source-of-truth). Same brain, different profile — the fleet's agent law applied to
> tools.** Born from the Reconcile Engine Decision Log (2026-08-31): the reconcile family
> (ddr / doc-destroyer / gcal / contact) was ONE pattern discovered four times. Fold-in Frank
> verdict `MERGE`; 7-lens Workshop review on the same page.

**v1, 2026-08-31.** Steward: **Mainstage Milo** for URITP-domain manifests; the ENGINE itself is
ownerless (any agent runs a one-off pass, Doc-Rot-Sweep precedent). A formal, scoped, reported
full-surface pass IS an audit and SEIZES to **Audit Anna**. Each manifest names its own domain
steward.

**Front door: this file + a manifest, nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

## Invocation + Trigger

The engine never fires bare — it is always invoked THROUGH a manifest, which carries the trigger
words. A reconcile request resolves: (1) which manifest (domain + optional show overlay), (2) load
engine + manifest, (3) run the passes below over the manifest's surface list.

---

## 🔴 THE PRECEDENCE LAW (Q1 — read before writing anything)

Michael ruled (Decision Log Q1, 2026-08-31): manifest surface order is a **DEFAULT TIEBREAKER +
report ordering, NEVER an auto-resolve.** The engine **never auto-writes the losing side of a
conflict.**

- **Per-item freshness OVERRIDES list order.** A surface's stamp/recency can beat its manifest
  rank on any given item — proven live before this engine existed (Big Love's master beat its
  stale PDF; Becoming Curious's PDF beat the master). List order only decides when freshness is a
  tie or unknowable.
- **Every manifest DECLARES its source-of-truth** for its surface set (Q1 note, Michael: *"we
  provide notes on the manifest that says 'this is the source of truth' for this set"*). That
  declaration IS the documented tiebreaker — so precedence is never guessed, it is read from the
  manifest.
- **A genuine conflict SURFACES to Michael. The engine proposes; it does not rule.** *Plausible is
  not authority.* The declared SoT sets which side the proposal LEANS, not a silent overwrite.
- 🔴 **Beckett's break, designed against:** a surface can be newer than one peer and older than
  another at once. Precedence is therefore **per-item, per-field**, never one global "who wins."

---

## The four findings (the shared verb — every reconcile emits these)

For each item across the manifest's surfaces:

1. **NAME/TITLE CORRECTNESS** — the identifying string agrees across surfaces (task name, event
   title, person+role). Spelling/label deltas are findings, matched on identity first.
2. **PRESENCE (orphans)** — present in one surface, absent from others. The highest-severity shape:
   a thing that exists with no counterpart (an unowned Google event; a sheet name with no master
   row; a deliverable date with no task). 🚫 **NEVER auto-create the missing counterpart.**
3. **DRIFT / NEEDS-UPDATE** — present everywhere but a value disagrees (a date, a time, an email, a
   role). Print EVERY surface's value, never just a flag.
4. **UNVERIFIABLE** — a surface could not be read (blocked calendar, missing file, unparseable
   prose, tentative marker). Counted SEPARATELY from clean; a pass that reads an empty surface and
   passes everything is the failure this family keeps re-learning.

---

## The passes (domain-blind)

**P0 · RESOLVE MANIFEST.** Pick domain + any show overlay; load it. Confirm the surface list, the
read method per surface, the normalization rules, and the declared SoT. A missing manifest = STOP,
say so, do not improvise a surface set.

**P1 · READ, FRESHEST-LAST.** Read surfaces in the manifest's stated order, but **read the surface
Michael is actively editing LAST, inside one pass** (usually ClickUp), so the stale side is never
the live one. A STATIC surface (a DOCX, a PDF) is stamped by its export/term date, not a read time.
Never carry a read or a verdict between passes — a prior verdict is VOID, not stale-but-usable.

**P2 · NORMALIZE BEFORE COMPARING.** Apply the manifest's normalization (prefix strips, prose-date
parsing, name/role expansion, timezone/all-day shifts). Comparing raw surfaces scores false
mismatches; this is where most of them come from.

**P3 · CROSS-COMPARE → the four findings.** Join items on the manifest's join key (never a
rename-fragile string alone where an id exists). Emit finding 1–4 per item.

**P4 · REPORT.** Group by finding class, ordered by the manifest's surface precedence. Every
verdict CARRIES ITS PAYLOAD — a `MISSING`/`DRIFT` line prints the values needed to act without
opening the item. Reconcile the counts: aligned + flagged + unverifiable must account for every
item in scope (a gap means a query filter lied — usually the closed/subtask default).

**P5 · GATED WRITE.** Only after Michael rules per item. Count the rows the batch will touch (and
any automation flips it will trigger) and STATE THE NUMBER before writing. A write that trips a
status automation is inherently TWO operations (write + flip-back); treat as atomic, verify by
re-read. **Never writes a non-ClickUp surface** (a Dropbox file/DOCX/PDF is re-exported by hand).

---

## Guardrails (ENGINE-level — a manifest CANNOT opt out; Polly's rule)

- 🚫 **PROPOSE-ONLY across external surfaces.** Never write Google Calendar, never write a Dropbox
  file. ClickUp writes are gated on Michael's per-item ruling.
- 🚫 **NEVER auto-create** a missing counterpart (orphan / missing event / missing row) — it may
  be someone else's, a hold, or a not-yet-hired slot. Report with a proposed home.
- 🚫 **NEVER cull, merge, or rename** an item found during a pass.
- 🚫 **PII: the repo is PUBLIC.** Student phones/personal emails and any FERPA-adjacent data never
  enter the repo, an artifact, or a public channel. Reports name roles + discrepancies, not raw
  contact values.
- ⚠️ **A silencing terminal state is inferred from KIND, never from "has no value."** (`GCal
  STATUS = N/A`, `Info Sheet Status = n/a` both permanently silence a row.) The test is *will this
  ever be the tracked thing?*, never *is it filled in right now?*
- ⚠️ **Subtasks + closed items are IN SCOPE.** Every ClickUp query carries
  `is_subtask IN (true, false) AND is_closed IN (true, false)`; the default excludes both and a
  pass looks clean while under-reporting.
- ✅ **Read-only reconciliation NEVER needs permission** (Michael, 2026-08-11). Do the pass, report
  it; the WRITE is what waits on his ruling.
- **Batch cap ~40 items.** Stop on a natural boundary, hand off with an `↪️ HANDOFF ·` task.

---

## The manifest contract (what every manifest MUST declare)

A manifest is DATA, not procedure — it never restates the passes or guardrails above (Constitution
§2–§3). It declares:

1. **Invocation + trigger words** (domain-specific).
2. **Surfaces** — ordered list; per surface: where it lives, how to read it, whether it is LIVE
   (edited) or STATIC (snapshot).
3. **🔑 SOURCE OF TRUTH declaration** — which surface leans as SoT for this set, and the tiebreaker
   note (Q1). This is the ONLY place precedence is set.
4. **Join key** — how an item on one surface matches the same item on another.
5. **Normalization rules** — domain-specific (prefix strips, prose dates, name/role expansion, tz).
6. **Routing** — if items fan out to multiple destinations (home-list → calendar, section → header).
7. **Domain steward** + known gaps.
8. **Optional SHOW OVERLAY (Q2):** a THIN block — "for a URITP Mainstage show, surfaces = X, SoT =
   Y." 🔴 Skye's cap: an overlay is a few lines, NEVER a full manifest per production. TIM-D is the
   canonical overlay (participant files ≠ a company sheet).

**Live manifests:** `prod-cal-reconcile.md` (calendar: ClickUp · Google · Info Sheet) ·
`contact-reconcile.md` (contacts: master matrix · contact-sheet PDF · Info Sheet). The ddr and
doc-destroyer reconciles remain standalone for now (their surfaces are a FileMaker DDR and a repo
tree — candidates to migrate once this engine is proven; deliberately NOT converted in this pass).

---

## Composes with

- `cross-space-research-gate.md` — locate surfaces before comparing.
- `task-dedup-gate.md` — before proposing any new item for an orphan.
- `secrets-pii-guard.md` / `commit-pre-flight.md` — on any write touching a public repo.
- `source-freshness-gate.md` — the freshest-last read rule is its sibling.

## Known gaps (honest list)

1. **Engine has never run as an engine.** Its logic is lifted verbatim from gcal-reconcile v3
   (proven, ~12 rows, 2026-08-11) and contact-reconcile v1 (one 5-show manual pass, 2026-08-31).
   The ABSTRACTION is untested as a shared loop; a cold session that finds no engine run history
   SAYS SO.
2. ddr / doc-destroyer NOT yet migrated — two of the four family members still standalone.
3. Show-overlay grain is capped by policy (Skye), not by any mechanism; an agent could still write
   a bloated overlay. Watch it.
4. The manifest is a NEW data-model file class — doc-rot-sweep + fleet-fact-sweep must now police
   it (Enzo). Added to this pass; verify on next sweep.
