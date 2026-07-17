# Datums & Reference Planes (S-3 / S-4) — Smith Theatre

> **Document the RULE, never the numbers.** This states the origin datum and which surface is the measurement reference at each elevation. Actual dimensions live in the file + exported worksheets, NOT here (S-4).

---

## Origin datum (S-3) — already built (D-013)

The drawing origin is the **center of the Smith blackbox room rectangle**, set coincident with the Vectorworks **INTERNAL origin (0,0)** — not just a shifted user origin. **This is already built in Michael's file (D-013); document, don't re-derive.**

- Putting it on the **internal** origin keeps DWG round-trips (D-008) precise and gives every referencing file (S-2) one shared coordinate frame.

**Coordinate reading (OPEN — confirm per venue):** `+X / −X` = stage-right / left of center; `+Y / −Y` = up / downstage. **The `+X/+Y` axis polarity vs. the N/S/E/W convention still needs confirming** (open thread, noted in S-3).

## Reference planes (S-4) — the Smith rule (D-020, executing D-014)

The measurement reference **changes by elevation**. State the rule so a drafter doesn't measure off the wrong surface:

- At **deck** (`1 DECK`): measurements are taken off the **interior trim face**.
- At **mezzanine / catwalk** (`1.5 MEZZ` / `2 TOE` / `3 CATWALK`): measurements reference the **nominal wall structure**.

> Why: the interior trim shaves the room slightly off the nominal wall, so deck-level work keys to the trim face a drafter can actually measure to, while upper-level structure keys to the nominal wall the steel is built to. The **magnitudes** of both (trim shave, trim heights) live in the file + exported worksheets, never here (S-4).

## The hard rule (S-4)

- **Prose captures the logic + gotchas** (which surface, where it changes, why).
- **The file carries the numbers.** Model to real dimensions; let values flow out via worksheet/CSV export. Never hand-transcribe measurements into this doc.
- The *convention* of having this note is **universal**; the *specific rules* above are **Smith-specific** (D-014).

---

## TODO (per-instance)

- [x] State the origin datum + confirm it's on the internal origin (D-013).
- [x] Fill the per-elevation reference-plane rule (deck-off-trim / upper-off-nominal-wall).
- [ ] Confirm `+X/+Y` polarity + N/S/E/W (open thread).

*Canonical: [`../../VWX-BEST-PRACTICES.md`](../../VWX-BEST-PRACTICES.md) § S-3 / S-4.*
