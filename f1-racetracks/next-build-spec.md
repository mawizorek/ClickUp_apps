# f1-racetracks — next build brief

## Source location

- Runtime app: `f1-racetracks/index.html`
- Runtime data: `f1-racetracks/data.json`
- Live-tracking companion: `f1-racetracks/live-tracker.html`
- Preferred shell/style/logic edit surface: `f1-racetracks/source/`
- Current live version on `main`: `v5`

## Scratch intake

- Broader support-series schedule detail once the first Weekend Center pass is judged
- Richer replay density if the initial race-control / leaderboard playback feels too thin

## Next build

- _Empty._

## In review

### Weekend Center (Option B: Schedule + Replay)

[PR #20](https://github.com/mawizorek/ClickUp_apps/pull/20)

**What is in the branch:**
- high-placement **Weekend Center** below the hero / key stats block
- segmented `Schedule | Replay` shell on circuit pages
- default mode by race state (`Schedule` for upcoming/active, `Replay` for completed where seeded)
- first replay implementation aimed at **race-control / leaderboard playback first**
- initial replay seeds for completed rounds
- schedule rendering from the existing weekend/session metadata already present in the app data model
- grouped manifest source files restored so the current runtime data path is coherent again

**What still needs judgement:**
- whether the first replay feel is rich enough or needs denser event/snapshot pacing
- whether the schedule fallback is acceptable before explicit per-session timed rows are seeded into `data.json`
- whether Weekend Center should absorb more of the live-tracker surface later or stay intentionally narrower

## Futures

- Explicit per-session timed schedule rows in `data.json`
- Broader support-series coverage where it materially improves the weekend-companion feel
- Replay density upgrades (more beats, clearer phase changes, richer event cadence)
- Stronger bridge between the main Weekend Center and the standalone `live-tracker.html` companion

## Known guardrails

- Start shell/style/logic edits from `source/`, not from `index.html`.
- The current branch restores the grouped manifest source files because `data.json` still references them; do not remove them again until the runtime data path is changed in a fully aligned pass.
- Keep semantic source files near the ~10–12 KB planning target and split at ~15 KB unless an exception is explicitly approved.
- `source/10_track_views_and_profile.js` remains the oversized module to split on a future structural pass.
- v1 replay is intentionally narrow: leaderboard snapshot + event rhythm first, not a fake simulator.