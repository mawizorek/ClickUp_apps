# Datums & Reference Planes (S-3 / S-4)

> **Document the RULE, never the numbers.** This note states the origin datum and which surface is the measurement reference at each elevation. Actual dimensions live in the file + exported worksheets, NOT here (S-4).

---

## Origin datum (S-3)

The drawing origin is a **meaningful room datum set coincident with the Vectorworks INTERNAL origin (0,0)** — not just a shifted user origin.

- For a **proscenium** house: center line × plaster line.
- For a **blackbox**: the geometric center of the room rectangle.
- Either way, put it on the **internal** origin so DWG round-trips (D-008) keep precision and every referencing file (S-2) shares one coordinate frame.

**Coordinate reading (confirm per venue):** `+X / −X` = stage-right / left of center; `+Y / −Y` = up / downstage. Tie to the N/S/E/W convention when documented.

## Reference planes (S-4) — which surface is the datum

The measurement reference can **change by elevation**. State the rule so a drafter doesn't measure off the wrong surface.

> **Template placeholder — fill per venue.** Example shape of the rule (this is the pattern, not a committed value):
>
> - At **deck**: measurements are taken off `<surface — e.g. interior trim face>`.
> - At **mezzanine / catwalk**: measurements reference `<surface — e.g. nominal wall structure>`.

## The hard rule (S-4)

- **Prose captures the logic + gotchas** (which surface, where it changes, why).
- **The file carries the numbers.** Model to real dimensions; let values flow out via worksheet/CSV export. Never hand-transcribe measurements into this doc (save a couple of deliberately-flagged exceptions).
- The *convention* of having this note is **universal**; the *specific rules* are **venue-specific**.

---

## TODO (per-instance)

- [ ] State the origin datum for this venue + confirm it's on the internal origin.
- [ ] Fill the per-elevation reference-plane rule (which surface, where it changes).
- [ ] Confirm +X/+Y polarity + N/S/E/W.

*Canonical: [`../../VWX-BEST-PRACTICES.md`](../../VWX-BEST-PRACTICES.md) § S-3 / S-4.*
