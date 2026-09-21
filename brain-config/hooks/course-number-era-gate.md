# Course Number Era Gate

**Established 2026-09-21** during the F24→S26 retroactive enrollment migration. Cross-agent:
anyone who LABELS course data reads this first — Tutor Tate (curriculum + rosters), Mainstage Milo
(production/course seam), ClickUp Coach Corey (junction + offering structure). Ownerless for
one-off checks; Tate stewards it.

## The hazard

The department moved from an **ENGL** prefix to **THTR** and renumbered nearly every course,
effective **AY 26-27** (Nigel Maister to the company, 2025-12-02). The mapping is **not**
one-to-one and digits were **reused across unrelated courses**.

🚨 **A BARE THREE-DIGIT COURSE NUMBER IS AMBIGUOUS AND RESOLVES WRONG ABOUT HALF THE TIME.**
A course number is not a course identity.

Proven collisions:

| digits | under ENGL | under THTR |
| --- | --- | --- |
| 123 | Playwriting | Intro to Lighting |
| 124 | Lighting | Intro to Sound |
| 141 | Dance for the Actor | Consent & Performance |
| 270 | Advanced Technical Theater | Topics / Dance for the Actor |

## Where the crosswalk actually lives (READ THIS BEFORE ANY NUMBERING SHEET)

⭐ **ClickUp `Course List` (`901305646914`) carries BOTH numbers per course row:** the `ENGL`
number field and the `THTR #` field. This is the live, maintained crosswalk and it is the
first thing to read.

Why this supersedes the documents: the Sept 2025 `NEW Theater Course Numbers.Final Draft.xlsx`
has its **`Old ENGL #` column misaligned by several rows** and contradicts its own second sheet.
A wrong mapping has already been taken from that tab *after* it was flagged unreliable. Nigel's
sheets remain upstream for **credits** and for **new** courses; they are not the place to resolve
a legacy number.

Verified 2026-09-21: **all 35 courses appearing in the 390 migrated enrollment rows resolve
through the `ENGL` field with zero gaps.**

Six courses carry a **blank** `ENGL` field — THTR 101, 131, 132, 221, 228.01, 299 — all plausibly
post-renumber net-new. None appear in migrated (pre-F26) enrollment data. Treat a blank as
"no legacy equivalent," not as a lookup failure, but confirm before asserting it.

## The labeling rule (Michael's ruling, 2026-09-21)

**Report each term in the numbering in force during that term.** F23–S26 → ENGL. F26 onward → THTR.

Rationale worth preserving: a student's transcript and their Workday record both carry the **ENGL**
number for a pre-renumber term, so era-accurate labels **match the paper the student brings to
advising**. Current-THTR labels would not.

## ⚠️ The prefix is NON-OPTIONAL, and era-accuracy is exactly why

Era-accurate labeling does not remove the digit collision — it **relocates it to the era seam**,
where it is harder to spot because a reader assumes a number means one thing throughout a document:

- `THTR 270 Dance for the Actor` reports as **ENGL 141** for S25
- `THTR 141 Consent & Performance` reports as **THTR 141** for F26

Same three digits, two unrelated courses, one report. `ENGL 141 (S25)` and `THTR 141 (F26)` are
unambiguous. **`141` is not.** Never emit a bare number — not in a report, a row name, a view, a
chart axis, or a chat reply. Never accept one either, including from Michael.

## Known naming drift (do NOT "fix")

- The 390 migrated enrollment rows in `Enrollments` (`901327636843`) are named with **bare**
  numbers, prefix stripped: `{120}{F24}@{Name}`. The underlying `Enrollment` relationships are
  **correct** (independently verified by offering-count reconciliation); the defect is display-layer.
  The resolved offering name carries a prefix — surface that instead of renaming 390 rows.
- `{ENGL252}` and `{ENGL124}` offering names are **historically correct** and Michael-ruled. Leave them.
- Offering names mix eras with no stated rule. 65 retroactive offerings now embody an unstated one.
  Unresolved; flag rather than normalize.
