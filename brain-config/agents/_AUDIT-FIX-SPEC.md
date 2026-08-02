# Audit-Fix Spec: Lens Profiles vs `_LENS-TEMPLATE.md`

> **Auditor:** Anna (audit-fix-pipeline, session #86ajuqznw)
> **Date:** 2026-08-02
> **Standard:** `brain-config/agents/_LENS-TEMPLATE.md` (formalized same session)
> **Target:** all 22 active lens profiles in `brain-config/agents/`
> **Verdict:** EVERY active profile FAILS. Zero conformance. The pattern exists in spirit across all of them, but none use the formalized structure.

---

## Scope

**In scope (22 active lenses):**
breaker-beckett, cautious-cass, clever-cleo, counter-cole, domain-dara, eco-enzo, feasible-finn, foldin-frank, future-faye, handoff-hana, literal-lena, mimic-mika, novice-nia, pivot-piper, polish-polly, recon-renata, risk-rhys, scope-skye, scribe-sana, size-sally, style-stu, template-terry

**Excluded (7 tombstones/redirects):**
audit-anna, closing-clio, maestro-mira, memory-maggie, scout-sage, workhorse-wes, workshop-wes

---

## Universal failures (apply to ALL 22 profiles)

| # | Gap | Fix |
|---|-----|-----|
| U1 | No blockquote opener exists | Add 1-2 sentence blockquote after front-matter; distill personality + angle |
| U2 | Wrong heading names (`## Purpose` not `## Lane`, `## When seated` not `## Fires when`, `## Output shape` not `## Output`, `## Composes with / suppressed by` not `## Bounded against`) | Rename all four headings |
| U3 | Redundant H1 + Primary name / Nicknames / Role / Invocation block | Delete; front-matter carries it |
| U4 | `## Standing-agent conduct` copy-pasted per profile (same 4 directives everywhere) | Delete; replace with one-line pointer to `council.md` in the template itself |
| U5 | Separate `## Personality` paragraph | Delete; fold voice into blockquote opener |
| U6 | `## Composes with / suppressed by` uses soft language ("pairs with", "feeds", "overlaps") | Rewrite as hard boundaries: "Does NOT do X (that is Y's lane)" |

---

## Tier 1: Archetype A batch (17 profiles, identical structural shape)

**Profiles:** breaker-beckett, cautious-cass, clever-cleo, counter-cole, domain-dara, eco-enzo, feasible-finn, foldin-frank, future-faye, literal-lena, mimic-mika, novice-nia, pivot-piper, polish-polly, risk-rhys, scope-skye, style-stu

**Additional gap beyond universals:**

| # | Gap | Fix |
|---|-----|-----|
| A1 | `## The lens / the question` is a separate section with numbered questions | Fold into `## Lane`; the questions ARE the lane description |

**Migration recipe (apply universals U1-U6 + A1):**
1. Keep front-matter as-is (all conformant)
2. Delete H1 + name/role/invocation block
3. Add blockquote opener (distill from Personality paragraph)
4. Rename `## Purpose` to `## Lane`, merge `## The lens / the question` content into it
5. Rename `## When seated` to `## Fires when`
6. Rename `## Composes with / suppressed by` to `## Bounded against`, rewrite soft language to hard boundaries
7. Rename `## Output shape` to `## Output`
8. Delete `## Standing-agent conduct` (4 directives block)
9. Delete `## Personality` (already captured in opener)
10. Keep `## Changelog` as optional appendix

---

## Tier 2: Archetype B workers (2 profiles, richer structure)

### handoff-hana.md

| # | Gap | Fix |
|---|-----|-----|
| B1 | Extra sections: `## Scope & Tools`, `## Handoff Package Contents`, `## Testing` | Collapse Scope into Lane, Contents into Output, Testing into a one-line note |
| B2 | `## Trigger` exists (close to right name but not `## Fires when`) | Rename |
| B3 | Output is a fenced markdown skeleton (verbose) | Compress to shape description; the skeleton can live in a pointed-at hook |

**Migration recipe:** Apply universals + collapse 6 body sections into the lean five. The package-contents detail moves to the hook it executes (`hooks/session-close.md` handoff section), not the profile.

### recon-renata.md

| # | Gap | Fix |
|---|-----|-----|
| B4 | 8-section Audit Checklist dominates the profile (~60% of file) | Extract checklist to a TOOL file (`hooks/repo-audit-checklist.md`); Lane just says "runs the repo audit checklist" |
| B5 | `## Output Format` contains a full fenced report skeleton | Compress to shape description; skeleton travels with the checklist tool |
| B6 | `## Testing` section | Move to the tool file |
| B7 | `## Scope & Tools` | Fold into Lane (read-only, no write = one sentence in Lane) |

**Migration recipe:** This is the MOST bloated profile. Apply universals + extract the 8-point checklist and report skeleton into `hooks/repo-audit-checklist.md`. What remains is the lean five pointing at the tool.

---

## Tier 3: Non-conformant outliers (3 profiles, unique structure)

### size-sally.md

| # | Gap | Fix |
|---|-----|-----|
| C1 | Completely ad-hoc headings: `## Role`, `## When she fires`, `## Boundary vs Source-Size Budget Enforcer`, `## What she returns`, `## Watch targets` | Full restructure to the five. Content maps cleanly: Role→Lane, When she fires→Fires when, Boundary vs→Bounded against, What she returns→Output |
| C2 | `## Watch targets` (a live list of files she watches) | This is operational state, not profile structure. Move to a sidecar or inline into Lane as one sentence ("watches structural files approaching budget") |
| C3 | No `## Standing-agent conduct` (but that is now correct under the lean template) | No fix needed; she accidentally conforms on this point |
| C4 | `seated_with` and `trigger` in front-matter (non-standard fields) | Remove; this info belongs in `## Fires when` |

**Migration recipe:** Full rename of headings. Extract Watch targets to inline mention. Already the leanest body of the three outliers.

### scribe-sana.md

| # | Gap | Fix |
|---|-----|-----|
| C5 | MASSIVE file: Canonical pointers block, Purpose with 2 distinct jobs, live-transcript section, backfill-fallback section (LOCKED), faithful-not-verbatim section (LOCKED) | Extract transcript procedure to `hooks/session-transcript-procedure.md` (or fold into the existing `gates/session-transcript-gate.md`). Profile Lane just says "stewards the live transcript + flags doc gaps" |
| C6 | Multiple LOCKED sections that cannot be edited without Michael's explicit lift | Mark in fix spec as BLOCKED; do not attempt migration without Michael ruling on where the locked text lives post-migration |
| C7 | Two jobs described (doc-gap logging + live transcript) | Lane must state both in one paragraph since they are deliberately co-owned. Not a split signal (Michael has ruled them as one role). |

**Migration recipe:** BLOCKED on Michael. The locked sections need a ruling on their new home before the profile can be trimmed. Candidate: extract all procedural text to the existing `gates/session-transcript-gate.md` (which already exists and governs her), leaving the lean five in the profile.

### template-terry.md

| # | Gap | Fix |
|---|-----|-----|
| C8 | Front-matter is malformed (not proper YAML fence; `---` appears after the first heading) | Fix front-matter fence placement |
| C9 | Body has ad-hoc headings: `## Purpose`, `## Personality & Stance`, `## Primary Action` | Restructure to the five |
| C10 | "Domain status: Active" line in the body (redundant with front-matter `status`) | Remove |
| C11 | Minimal content overall (3 short sections) | Actually close to the lean ideal in spirit; just needs heading renames + blockquote opener + bounded-against section |

**Migration recipe:** Fix front-matter, add opener, rename Purpose→Lane, add Fires when (invoked on-demand for admin tasks), add Bounded against (not a general task creator; just admin dumping ground), rename Primary Action→Output.

---

## Priority order for migration

| Priority | Profile(s) | Rationale |
|----------|-----------|------------|
| 1 (quick wins) | template-terry, size-sally | Shortest files, fastest to fix, prove the template works |
| 2 (batch) | The 17 Archetype-A profiles | Identical recipe; could be scripted or done in one pass |
| 3 (extraction needed) | handoff-hana, recon-renata | Need tool-file extraction before profile can slim |
| 4 (blocked) | scribe-sana | Locked sections need Michael's ruling on relocation |

---

## Open questions for Michael

1. **Sana's locked text:** the faithful-not-verbatim and backfill-fallback sections are LOCKED. Where do they live post-migration? Candidate: `gates/session-transcript-gate.md` (already her governing gate).
2. **Renata's checklist:** extract to `hooks/repo-audit-checklist.md` or keep inline in a tool file under a different path?
3. **Old `_template.md`:** retire (rename to `_template-ARCHIVED.md`) or keep as historical reference?
4. **Batch execution:** greenlight the 17 Archetype-A profiles as a single commit, or drip them in groups?

---

## Provenance

- Audit lead: Anna (audit-fix-pipeline)
- Template input: Fleet Felix (fleet-steward perspective on singularity, bounded-against framing, opener distinctiveness)
- Session: #86ajuqznw (Doc Spec Architecture brainstorm task)
- Committed: 2026-08-02
