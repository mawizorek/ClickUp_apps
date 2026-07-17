# Datums & Reference Planes — Smith Theatre (S-3 / S-4)

> **Document the RULE, never the numbers.** This states Smith's origin datum and which surface is the measurement reference at each elevation. Actual dimensions (trim heights, beam positions, load ratings) live in the file + exported worksheets, NOT here (S-4).

---

## Origin datum (S-3) — documented, not re-derived

Smith is a **blackbox rectangle**. The drawing origin is the **geometric center of the room rectangle, set coincident with the Vectorworks internal origin (0,0)** — **already built in Michael's file** (D-013). This protects DWG round-trip precision (D-008) and shares one coordinate frame across every referencing file (S-2). Do not re-derive it; document it.

**Coordinate reading (OPEN — confirm per venue):** `+X / -X` = stage-right / left of center; `+Y / -Y` = up / downstage. The `+X/+Y` polarity vs. the N/S/E/W convention still needs confirming (noted in S-3 / DECISION-LOG open threads). Rigging beams run **E/W** — tie the axis polarity to that convention when locked.

## Reference planes (S-4) — Smith's rule

The measurement reference **changes by elevation** at Smith. State the rule so a drafter doesn't measure off the wrong surface:

- At **deck**: measurements are taken off the **interior trim face** (the finished inside surface of the wall).
- At **mezzanine / catwalk**: measurements reference the **nominal wall structure** (behind the trim).

The interior trim sits slightly proud of the nominal wall, so deck geometry and upper-level geometry key off **different surfaces** by design. That is the gotcha this note exists to prevent.

## The hard rule (S-4)

- **Prose captures the logic + gotchas** (which surface, where it changes, why) — above.
- **The file carries the numbers.** Model to real dimensions; let values flow out via worksheet/CSV export. Never hand-transcribe measurements (trim offset, toe height, beam spacing, load limits) into this doc — those live in the file and in the [`../reference-notes/`](../reference-notes/) handouts.

---

## To confirm (per-instance)

- [ ] Lock `+X/+Y` polarity + the N/S/E/W convention off the center datum.
- [ ] Confirm the interior-trim vs. nominal-wall rule against the built file.

*Canonical: [`../../VWX-BEST-PRACTICES.md`](../../VWX-BEST-PRACTICES.md) § S-3 / S-4. Decisions: D-013 (origin), D-014 (convention), D-021 (Smith rule).*
