# Archive: FMP Fiona / schema + build craft

> **WARM.** Rotated out of `memory.md` 2026-08-10 by Memory Maggie under `hooks/memory-rotation.md`.
> Load on demand when the session touches FileMaker script architecture, schema design, staging
> patterns, or documentation surfaces. **Append-only — never edit, never reorganize.**
>
> **Why these left the hot layer and the correlations stayed:** Fiona's class was justified on
> CROSS-RUNTIME CORRELATION, and her own header flagged the split — *"this file now holds two
> different things... and only the first is what the class was justified on."* These are the second
> thing. They are real craft and they are re-readable on demand; the correlations are what she is
> for, so they stay hot. Content below is preserved VERBATIM from `memory.md` at blob
> `b58d9c92ee24b254ed64d064a81aa61f2392eb39`.

---

## 🔴 A DEFAULT MUST BE CONSPICUOUS OR IT MUST BE AN ERROR (EARNED 08-09)

**A fallback that is also a plausible real value cannot be distinguished from a working system.** A
typo'd variable wrote the default `"script"` on every log row — confidently wrong, worse than blank,
because blank gets questioned. **The good shape is MAGENTA**: the theme cascade's unresolved colour,
chosen because nothing legitimately produces it, so reaching it is proof of a break.

**Corollary:** a default that is also a legal INPUT destroys absence-detection — `"abort"` as both
fallback and branch cannot tell *forgot* from *meant it*. Empty is the missing marker; missing is an error.

## 🔴 AN OMISSION IS NOT NEUTRAL (EARNED 08-09 — it nearly locked a file open)

FileMaker **persists the last subscript's result up to a caller that sets none.** A script with no
`Exit Script` returns a decision made by something else. On the close handler, where the result **is a
veto**, declining a backup prompt would have refused to close the file. **Ask what a runtime FILLS an
omission with before reading a blank as a zero.**

## 🔴 THE DOCUMENTATION SURFACE IS A DESIGN CHOICE (EARNED 08-09, Michael's catch)

He asked where the run-time markers report had gone. Nothing had regressed — **I had written eleven
pages using only the surfaces a human reads.**

- **A callout or an emoji is read by ONE PERSON ON THAT PAGE; a marker span is amassed at build time
  across the whole site.** They feel equally serious while writing, and only one answers *what is
  unconfirmed across this entire app.*
- **A span records a MENTION; a link records an EDGE.** For anything FileMaker cannot enumerate itself,
  the link form turns a folder of pages into a call graph. Use it wherever the target id exists.
- ⚠️ **I skipped the very families I own, added the same day.** Owning a standard is not reaching for it.
- **Tell to watch for:** a report calling a tree clean, about a tree you know is not.

## 🧠 Schema generalizations (EARNED, all runtimes)

- 🔴 **A FLAG MEANING "THIS ROW IS NOT REAL" IS THE SCHEMA SAYING THE ROW SHOULD NOT EXIST** (08-08).
  Same species as a convenience-copy field and a second-claimant table.
- 🔴 **A BOOLEAN ON N ROWS DESIGNATING ONE IS ALWAYS WRONG** — it permits two winners and zero winners; a
  singleton holding a POINTER cannot. Three killed in one afternoon (08-09), then a fourth surfaced in
  the scripts as three claimants on one open handler. **The mechanism does not care which layer it is in.**
- 🔴 **A field belongs to the table whose GRAIN it is one-per-of.** Corollary that keeps catching people:
  two similarly-named fields can be different KINDS of fact — "last date needed" was a **page dimension
  wearing a date**, never schedule.
- 🔴 **Duplicated data does not error, it DIVERGES.** Both copies valid, both render, and the only symptom
  is a wrong printed page. Read through the relationship over any copy-down.
- 🔴 **An equality join cannot match a RANGE.** Multi-predicate (two inequalities + one equality, sorted)
  is the native answer and replaces both stamped flags and duplicated rows. ⚠️ Inequalities cannot use a
  stored index — irrelevant at a few hundred rows.
- 🔴 **ERROR CHECKING GOES WRONG IN BOTH DIRECTIONS** (08-09). No check misses real failures; `≠ 0` after
  a find turns **401 "no records match"** — a correct outcome — into a crash on an empty list. **Branch on
  the CODE** after any step whose "nothing found" case is legitimate. Also 101 at the end of a found set.
- 🔴 **A STORED SPEC IS A STALE COPY WITH NO SYMPTOM.** `Sort Records [ Restore ]` freezes the order inside
  the script; change the intent and "next" quietly goes somewhere wrong. **Make the order DATA** — a field
  is visible, editable and diffable.
- ⚠️ **A list view repeats per RECORD**, so a one-row span cannot produce N report lines. **Michael caught
  this after I had ruled**, which reclassified a generated join from a performance hedge into a reporting
  requirement. **Check what the REPORT needs before ruling on the schema.**
- **A value list built from a field sorts by field 1 or 2 only**; arbitrary order needs a sorted
  RELATIONSHIP. ⚠️ Failed on the first try 08-08 and was parked. **Unproven.**

## 🎛️ The staging pattern (EARNED 08-08 — Michael's, and it beat three of my proposals)

*"Where does state live while a human is CHOOSING, before the thing happens?"* recurs in every app.
**HEADER + LINES, plus a reserved SCRATCH row reset from a TEMPLATE row.** Canonical → *FMP Apps —
Shared Build & Behaviour Decision Log*. What I carry:

- **Overrides on the LINE, never the header** — on the header every line inherits the same override and
  the batch can only mean one thing. 🔴 **EMPTY MEANS INHERIT**; copy the parent down and you can no
  longer tell an OVERRIDE from an INHERITANCE.
- 🔴 **RESET ON ENTRY, NOT ON CLOSE.** Reset-at-close reads tidier and fails the first time the app quits
  unexpectedly. Entry-time reset is idempotent and self-healing. Generalizes to any "restore defaults."
- ⚠️ **I reached for GLOBALS twice and a draft record once; all three were worse.** A record you can see,
  sort and re-run beats a scratchpad. Globals buy per-user isolation, worthless single-operator.
- 🪦 **A hardcoded sequence of outputs IS a set with no table** — same discovery as the six INFO scripts
  being PRODUCTIONS. **Look for the loop before designing the table.**

## 📌 Lineage (full)

Scaffolded 07-15 as FMP Frank → blocked ten days by a rotted stub → renamed Fiona 07-25 (slug
`fmp-frank` immutable) → **BUILT** 07-26 → first real session 07-28/29 (HML_LLC v1) → **08-01 native
shell CONVERTED to a thin git-loader (Model A)**: native `-39958890` KEPT as the body with its triggers,
the brain read fresh from this bundle every run. ⚠️ Supersedes `decision-log.md` **D1** ("retired native,
triggers waived") — read D1 as historical. → **08-09 first marker families I own outside FileMaker
itself** shipped in the doc-render engine (`layout` · `schema` · `alias`).
