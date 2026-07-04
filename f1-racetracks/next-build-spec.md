# f1-racetracks — next build brief

## Source location

- Runtime app: `f1-racetracks/index.html`
- Runtime data: `f1-racetracks/data.json`
- Live-tracking companion: `f1-racetracks/live-tracker.html`
- Preferred shell/style/logic edit surface: `f1-racetracks/source/`
- Current live version: `v5`
- Proposed version target for this build: `v6`

## Scratch intake

- Running-calendar feel when paging circuit to circuit
- High placement for the new weekend module, but still below the hero / key stats so the page remains a circuit page first
- Replay should feel like race control / leaderboard playback first, not lap-chart storytelling first
- Replay is meant to recreate the feel of following the race after the fact using public data, not fake video or full telemetry simulation

## Next build

### Weekend Center (Option B: Schedule + Replay)

**Theme:** each circuit page gets a high-placement **Weekend Center** module that lets the app behave like both a race-weekend companion and a post-race replay surface.

**Placement:**

1. circuit hero / key stats
2. **Weekend Center**
3. deeper circuit breakdown sections

**Core shell:**

- one shared panel shell
- segmented mode switch: `Schedule | Replay`
- the panel should read as the weekend's current story, not as a second unrelated dashboard

#### Default behavior by race state

- upcoming round → default to **Schedule**
- completed round → default to **Replay**
- live/active round → default to **Schedule**, with replay/history available one tap away if meaningful

---

### Schedule mode

**Purpose:** show what is supposed to happen across the weekend.

**What it adds:**

- a compact race-weekend timetable on each circuit detail view
- sessions grouped by day (`Fri`, `Sat`, `Sun` or local equivalent)
- each row shows:
  - series badge
  - session name
  - local time
  - status chip: `done`, `upcoming`, `live`
- a clear **Next up** highlight for imminent sessions
- dense, elegant, editorial feel — not a bulky operations wall

**Series coverage (v1 target):**

- F1 always
- support series where clearly available and worth showing
- keep the schema flexible for F2 / F3 / Porsche Supercup / F1 Academy without forcing every circuit to carry every series on day one

**Schedule schema** (per track in `data.json`):

```json
"schedule": [
  {
    "series": "F1",
    "session": "FP1",
    "datetime": "2026-07-04T13:30:00+01:00",
    "status": "upcoming"
  }
]
```

**Field notes:**

- `series`: short display/source key (`F1`, `F2`, `F3`, `Porsche`, `F1Academy`)
- `session`: visible session label
- `datetime`: ISO 8601 with timezone offset
- `status`: `upcoming` | `live` | `done`

---

### Replay mode

**Purpose:** recreate the feel of following the race after the fact using public timing / event data.

**This is NOT:**

- fake video
- full telemetry simulation
- a deep lap-chart-first analytics product in v1

**v1 replay feel:**

- race control / leaderboard playback first
- session clock progression
- running-order changes
- event feed for incidents / SC / VSC / pit cycles / lead changes / chequered flag
- enough rhythm to feel "live after the fact"

**Replay panel anatomy:**

- top bar:
  - play / pause
  - speed control (`x1`, `x2`, `x4`)
  - scrubber / timeline
  - current phase label (`Formation`, `Lap 12`, `SC ending`, `Chequered flag`, etc.)
- main body:
  1. session clock + phase strip
  2. top running-order snapshot
  3. event feed / race-control-style log
- optional right rail or compact side block for the next key beat when layout allows

**Replay data model** (per track in `data.json`):

```json
"replay": {
  "session": {
    "type": "race",
    "label": "Grand Prix",
    "date": "2026-05-03"
  },
  "snapshots": [
    {
      "t": 0,
      "label": "Lights out",
      "order": ["VER", "ANT", "LEC", "RUS", "NOR"]
    }
  ],
  "events": [
    {
      "t": 3120,
      "lap": 36,
      "kind": "safety_car",
      "label": "Safety Car — debris at Turn 14"
    }
  ]
}
```

**Replay field notes:**

- `t` = replay timeline offset in seconds from session start (or a clearly documented equivalent)
- `snapshots` = ordered leaderboard states at meaningful beats, not exhaustive telemetry samples
- `events` = curated/public event stream that gives the playback its rhythm
- the model should stay editorial and structured first; do not design v1 around ingesting giant raw telemetry datasets

---

## Data / refresh strategy

### Schedule

1. bulk seed the remaining 2026 season schedule
2. pre-weekend verification pass (~Tue/Wed before race week)
3. post-weekend recap flips completed sessions to `done`
4. ad-hoc schedule updates = `data.json` only, no version bump

### Replay

1. start with selected completed rounds / a documented subset if needed
2. use public event/timing/race-control style data to build believable editorial replay timelines
3. treat replay updates as data work first; only touch engine code when the UI contract changes

## Data sources

### Schedule sources

- FIA official event calendar
- formula1.com weekend schedule pages
- FIA F2 / F3 calendars
- Porsche Supercup schedule
- F1 Academy schedule where relevant

### Replay sources

- public timing / classification / incident feeds where available
- race-control style event logs
- official session reports / classification references
- any public source used should be stable enough to rebuild the replay without guesswork

## Engine / source changes

**Preferred module split:**

- new source file: `source/12_weekend_center.js`
- new style file only if needed: `source/03d_weekend_center.css.txt`
- keep integration into existing track render minimal; the host module should mount the panel, not absorb all the behavior

**Why this split:**

- `source/10_track_views_and_profile.js` is already over the preferred threshold and should not absorb a full new weekend module
- Weekend Center should be a self-contained feature surface with its own data hooks and UI render path

**Integration requirements:**

- high placement below hero / key stats
- circuit page still reads as a circuit page first
- mobile-first at 320px
- touch targets ≥44px
- no gimmicky broadcast chrome
- motion should be restrained and useful, not noisy

## In review

- _Empty._

## Futures

- broader support-series coverage if v1 launches F1-first
- richer replay beats / denser classification snapshots
- lap-chart storytelling as a later enhancement, not the v1 replay core
- stronger bridge between the main Weekend Center and the standalone `live-tracker.html` companion when that becomes useful

## Known guardrails

- Start shell/style/logic edits from `source/`, not from `index.html`.
- Start schedule/replay content updates from `data.json`, not from retired source-side data bundles.
- Keep semantic source files near the ~10–12 KB planning target and split at ~15 KB unless an exception is explicitly approved.
- `source/10_track_views_and_profile.js` is already over the preferred threshold and should not be used as the dumping ground for Weekend Center logic.
- v1 replay must feel alive, but it should stay intentionally narrow: leaderboard + event-feed playback first, not a fake simulator.
- The panel should support the "running calendar" experience across rounds without turning every circuit page into an overbuilt event-operations dashboard.