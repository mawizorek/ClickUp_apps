# The DDR Hook Family · shared doctrine

**Purpose:** The rules that govern **both** DDR hooks, held once so they cannot drift apart.

**Read this BEFORE firing either hook.** Neither is self-contained on this material.

| Hook | Verb | Writes |
| --- | --- | --- |
| `hooks/ddr-reaudit.md` | **CAPTURE** — converts evidence into a permanent record | verbatim `_ide` mirrors, punch list, tombstone |
| `hooks/ddr-reconcile.md` | **COMPARE** — tests claims against evidence | **nothing. PROPOSE-ONLY.** |

**Established 2026-08-16.** Extracted from `ddr-reconcile.md` when that file hit **24,500 bytes**, over the ~22KB whole-read ceiling, with this doctrine duplicated into `ddr-reaudit.md` as well. **Two copies of one law is the drift vector these hooks exist to catch** — so it now lives once, here.

---

## 🔴 1. Two classes of repo file

Michael, 2026-08-16: *"once the transcription has happened, the audit can happen against the actual repo notes and not the DDR?"* **Yes — with one substitution that must never blur.**

After `ddr-reaudit` runs, the app's repo holds **two kinds of file, and they are not interchangeable:**

| Class | Files | Role |
|---|---|---|
| 🔎 **EVIDENCE** | the `<NN>-<SECTION>/_ide/` mirrors | A **verbatim copy of the export.** Faithful, dated, provenance-stamped. This is what you anchor TO. |
| 📝 **CLAIMS** | every hand-written page — `index.md`, section indexes, `build-sheet.*`, handoffs, Decision Logs | A **human describing the file from memory.** This is what goes ON TRIAL. |

✅ **The anchor moves DDR → mirrors. The anchor NEVER moves to the notes.** Mirrors stand in for the export because they are a transcription of it; the notes cannot, because they are the thing being tested. **A reconcile anchored to the notes is a document agreeing with itself.**

⚠️ **The trap: both classes live in the same tree, one folder apart.** `70-scripts/index.md` is a CLAIM; `70-scripts/_ide/index.md` is EVIDENCE. **One `_ide` in a path is the entire difference between an audit and a tautology.** Every mirror carries `provenance:` front matter for exactly this reason — **if a file has no provenance chain back to a dated export, it is a claim, whatever folder it sits in.**

⚠️ **A mirror inherits its export's date and does NOT refresh.** Anchoring to a mirror means anchoring to the day it was captured, not to today.

---

## 🔴 2. The coverage gate

**A mirror is only evidence for the sections actually captured.** `ddr-reaudit` may scope a section OUT by ruling, and the tombstone log records what was skipped.

🔴 **An uncaptured section is `🔵 CANNOT VERIFY`. It is NEVER `⚪ VERIFIED CURRENT`.** Silence in the mirrors is not agreement, it is absence of evidence. A clean bill on a section never transcribed is the same failure as reading a handoff's silence as confirmation.

**Live case, not hypothetical:** Layout Objects were deliberately not captured from `2608151650` (Michael: *"dont need the loayout objects yet"*). So **no claim about field placement, print geometry, portal geometry or anchoring is checkable from those mirrors** — `print-geometry.md` and `print-first-runbook.md` need a fresh export or FileMaker itself.

**Procedure:** read the tombstone log's coverage table BEFORE scoping, and **declare uncovered sections in the report HEADER, never a footnote.** A reader who learns halfway down that print geometry was never checked has already trusted the summary.

---

## 🔴 3. Run order, LOCKED

**`ddr-reaudit` Phase 7 DELETES the export `ddr-reconcile` needs.** Not a style clash — one hook destroying the other's input.

1. **`ddr-reaudit` Phases 0-6** — capture the export into mirrors while it exists.
2. **`ddr-reconcile` at Phase 6.5** — diff the hand-written docs against **the MIRRORS**, not the raw export.
3. **`ddr-reaudit` Phase 7** — tombstone and delete, only after step 2 has run.

⭐ **The real prize: anchored to mirrors, `ddr-reconcile` becomes RE-RUNNABLE.** Anchored to an export it could only ever run once, in the window before deletion. The evidence is now permanent, so the pass can fire any time a doc changes. **That, not tidier ownership, is what the seam buys.**

⚠️ **Overlap between the two is DELIBERATE, do not de-duplicate it:** both reconcile structural counts, both log as-built bugs without fixing them, both seat Fiona on the domain read. **Reconcile catches a doc that LIES about a count; reaudit catches a count that has NO doc at all.** Different failures, same arithmetic.

🔴 **Findings feed the app's EXISTING punch list. Never open a second one** — `ddr-reaudit` Phase 6 supersedes in place, and two lists means neither is trusted.

---

## 👥 4. Three voices, three phases, never collapsed

Michael's ruling, 2026-08-16: *"audit anna should do the phase one ... and then anna shld report 'this is what is diffeent' and then fiona reports it meaningfully to me."*

| Phase | Voice | Produces | Never does |
|---|---|---|---|
| **CAPTURE** | **Scribe Sana** (stateless lens) | verbatim mirrors | 🔴 corrects NOTHING — no interpretation, no verdict, no fix |
| **DIFF** | **Audit Anna** (steward, leads) | *"this is what is different"* | does not rule on what a FileMaker defect MEANS |
| **MEANING** | **FMP Fiona** (domain voice) | the report **to Michael** | does not re-transcribe, does not re-diff |

**A FOLD of the proven split in `hooks/meeting-transcript-attribution.md`, not a net-new model.** Same law: **a scribe who corrects is INVENTING; a domain owner who retypes is EXPENSIVE.** `calc_ResolvedEnd` reads `dateTime_Start` is in the export; *"therefore every emphasis span resolves to zero length"* is in Fiona's head.

`ddr-reconcile` is **one of Anna's instruments** in the DIFF phase. A standalone one-off reconcile reports itself; inside a full re-audit, **the report to Michael is Fiona's.**

⚠️ **NAME COLLISION:** the agent is **Scribe SANA**. *"Scribe Sara"* is not a thing, and **Sara Penner is a real person in the URITP staff room.** Resolve against the 🤖 Agent Index, never phonetically.

⚠️ **Phase boundaries are STOP points.** DIFF never starts on a half-captured section; MEANING never fires on an unreconciled diff.

---

## 5. Lane boundary — four anchors, one skeleton

| Tool | Ground truth |
| --- | --- |
| `hooks/doc-rot-sweep.md` | the git repo — *are our docs still true at HEAD?* |
| `hooks/fleet-fact-sweep.md` | the 🤖 Agent Index — *do our files describe the FLEET correctly?* |
| `hooks/ddr-reaudit.md` | the DDR export — *what does the file CONTAIN?* Produces the mirrors. |
| `hooks/ddr-reconcile.md` | the DDR export or its mirror — *do the docs MATCH the file?* |

All four run the same skeleton (scope → classify claims → verify against a source of truth → flag, don't silently fix) against a **different anchor.** "The doc is wrong" because the repo moved is Doc-Rot's. "The doc and repo agree but neither matches the `.fmp12`" is reconcile's. "There is no doc at all" is reaudit's.

⚠️ **A mirror is a repo file, so Doc-Rot Sweep can read it — but a mirror is EVIDENCE and Doc-Rot tests CLAIMS.** It should verify that a mirror's provenance chain still resolves (tombstone log exists, SHA still works) and stop there. **It must never "fix" a mirror's content to match a doc.**

---

## 6. Origin — why this file exists at all

🔴 **`ddr-reconcile` was born 2026-08-15 (PR #825). `ddr-reaudit` shipped 2026-08-16 (PR #830) as net-new, from the SAME DDR and the SAME chunk set (`7534bbed` / `2608151650`), because Fold-in Frank was never fired.** The seam had to be written after the fact (PR #831), and this shared file after that.

**Recorded, not buried.** 🔴 **Fire Fold-in Frank before authoring anything adjacent to either hook.**

---

## Changelog

- **v1 (2026-08-16)** — Extracted from `ddr-reconcile.md` at 24,500 bytes (over the ~22KB ceiling) where this doctrine was also duplicated into `ddr-reaudit.md`. Holds: two classes of repo file (evidence vs claims) · the coverage gate · the locked run order · the three voices · the four-anchor lane boundary · the Fold-in Frank origin. **Both hooks now point here instead of carrying their own copy.**
