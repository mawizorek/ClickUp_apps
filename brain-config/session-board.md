# Session Board

## Active

- **Brain** — F1 qualifying/timing backfill into `f1-racetracks/f1-results/2026/` round files (rounds 2-7). Adding `qualifying{pos,q1,q2,q3}` + `grid` + `onRoadPos` to classification rows, matching the Albert Park reference. One round per PR, data-only (no schema/engine changes). Touching only the per-round JSON files + `index_rounds.json`. Don't edit those round files until I'm merged out.
