# F1 Racetracks — next build spec

> **RECONCILED 2026-07-07.** The F1 results SCHEMA-SHIFT is the primary build, brainstormed on clean context (7-lens gate) before writing. Prior module-refactor items converge with the shift and are sequenced underneath it. Decisions below are LOCKED by Michael 2026-07-07; do not re-litigate.

## ⛔ HARD RULE — Segment BEFORE authoring, never flag-after (LOCKED 2026-07-07, Michael)

**Source size is a pre-authoring decision, not a post-build check. The moment a build would be “one HTML file with inline CSS + JS,” that is the trigger to segment BEFORE writing a single line: a slim loader shell + concern-split modules under `source/<app>/`, every file under the ~12KB soft line, never near the 30KB redline.**

- **Authoring a monolith and disclosing its size afterward is a GATE FAILURE, not a heads-up.** A gate that fires after the commit is not a gate. Shipping an over-cap file does not count as a build and must be reverted, no matter how good the content is.
- **The size decision happens at design time.** Before authoring: state the file split. If it can’t be stated as under-cap files up front, it is not ready to author.
- **No “I’ll flag it in the report” escape hatch.** The Source-Size Budget Enforcer, Commit Pre-Flight, and Size Sally all fire BEFORE the write. If any would trip, segment first.
- **Applies to every app, every lens, every future build in the repo.** This is a corrections-generalize rule: it is not scoped to F1.

Context: the standings lens shipped 2026-07-07 as a 38KB monolith with an after-the-fact size note. Michael rejected it outright and it was reverted (PR #68). Rebuilt segmented. This rule exists so it never repeats.

## Build sequence (Michael, 2026-07-07)

1. **Data foundation** — per-round season store `f1-results/2026/`. ✅ SHIPPED (#55 built, #58 split, #61 anchors backfilled).
2. **Standings lens** — `f1-racetracks/standings.html` championship points matrix (NEW sibling lens, add-only; fetches the JSON store; standings computed live). Rebuilt SEGMENTED per the hard rule above. AESTHETIC iterated WITH Michael across renders.
3. **Driver-brief cell interaction** — shipped inside the lens (race + season briefs, teammate H2H, championship trajectory).
4. **Propagate the pit-wall restyle** to the other pages (kill rounded corners, retabularize) — future, WITH Michael.

Standing instruction: backend/data proceeds solo; big aesthetic shifts happen with Michael in the room.

## Locked decisions (Michael, 2026-07-07)

1. **Per-season results store keyed by LOCATION** (slug = identity), `round` a per-season order attribute. Joins cleanly to the racetracks file.
2. **`points` on every classification row.** WDC + WCC COMPUTED live (race + sprint), never stored.
3. **ClickUp history = ONE slim year-labeled “Race History” text field per track.** Full order leaves ClickUp, lives only in JSON. Frozen archive lens: written once per year (fill-if-blank), prior years immutable, conflicts STOP-and-flag.
4. **Migration = full verified 20-car order for all 9 rounds**, primary-source re-verified. ✅ done.
5. **`routines/f1-refresh.md` mirror rework folded in.** Slim writes + append the frozen year-line by `cuTaskId`. STILL PENDING (see open-thread).
6. **Sprints = optional per-round block** reusing the race-classification shape + sprint scale (8-7-6-5-4-3-2-1, top 8). Non-sprint rounds omit the key. Total = race + sprint, computed live.
7. **Standings = ONE canonical final order** + per-row `onRoadPos`/`stewardNote` + round-level amended flag. No multiple standings versions.
8. **Interaction: cell tap = driver race brief; flag tap = provenance.** Full state lifecycle per the Interaction-State Standard.
9. **Aesthetic = dark pit-wall:** sharp corners (a purposeful circle or two is fine), tabular/mono numerics, dense tables over cards, color-as-data (team accent, purple fastest lap, amber amended). Away from the OnTrack nav-app feel. Design-skill hard bans apply.

## Data store layout (SHIPPED — per-round, size-safe)

```
f1-results/2026/
  index.json          season meta + ordered round list (slug/round/name/date/cuTaskId/sprint/file)
  <slug>.json         one file per LOCATION = canonical round record; optional `sprint` block
```

- Round file: `{ season, round, slug, name, date, cuTaskId, version, pole, fastestLap?, summary, sprint?{classification[]}, classification[] }`. Rows: `{ pos, driverId, driver, team, status(FIN|DNF|DNS|DSQ|WD), points, onRoadPos?, stewardNote? }`. Growth (reserved, optional): grid, gap, laps, pits, stints, telemetry. Engine reads defensively.
- Standings computed: WDC = sum race+sprint points per driverId; WCC = sum per team.
- Anchors: round `cuTaskId` → F1 Races task; row `driverId` → F1 Drivers task. Resolve by ID. Dedup complete (Colapinto 86aj1ra0h, Lindblad 86aj1ra31, Bottas 86aj1ra1g, Perez 86aj1ra1z).

## Standings lens layout (SHIPPED — segmented)

```
f1-racetracks/
  standings.html               slim loader shell (markup + <link>/<script> refs only)
  source/standings/
    base.css                   tokens, masthead, controls, matrix table, cells, wcc, footer, states
    panel.css                  side panel, grid→finish flow, badges, story box, stats, tyres, H2H, trajectory
    data.js                    fetch ../f1-results/2026/, compute standings, helpers, story bank, illustrative DETAIL
    matrix.js                  matrix + constructors render + column sort
    panel.js                   race brief + season brief + events + boot
```

- Every file under the ~12KB soft line. `standings.html` references the modules; browser loads them same-origin on Pages.
- Fetches the canonical JSON store; no data duplicated in the engine. Ricky’s data commits flow through automatically.
- Granular grid/lap/pit/tyre + story-tag fields are illustrative (flagged “preview”) until sourced from OpenF1; verified points/positions are real.

## OPEN FLAGS (durable copy in brain-config/open-thread.md)

- **🚩 f1-refresh mirror rework** — targets the retired per-year dropdown; Ricky runs Thu–Sun. Rework before next race weekend.
- **🚩 ClickUp “Race History” field** not yet created (one slim year-labeled text field per track).
- OpenF1 sourcing for the granular per-cell fields (grid, best lap, pits, tyres) to replace the illustrative preview data.

## Futures

- rebalance grouped round-data files `06`/`07`/`08` under the 15KB working threshold
- decide whether `live-tracker.html` stays a separate surface or narrows now the main app owns more weekend context
- per-driver times/gaps, grid-vs-finish, pits, telemetry — populate reserved round-file growth fields as data lands (data change, not engine change)
- standings-progression chart (v2 of the matrix) computed from per-round points
- `f1-results/2027/` and beyond: independent per-year folders; racetracks file persists

## Known guardrails

- **segment before authoring; never author a monolith then flag its size (see HARD RULE above)**
- start normal edits from `source/`, not from a single big file
- semantic source target ~10–12KB soft / ~15KB hard unless explicitly approved; 30KB is an absolute redline / failure state for readback
- do not create temp-fix source buckets; add/split permanent concern-based modules
- keep a visible footer build token useful during runtime verification
- anchor by inline `cuTaskId`/`driverId`; resolve by ID never by name; unresolved anchor = STOP-and-flag
- JSON is canonical data; ClickUp stays slim (events/triggers/notifications/mirrors), never a data store; no field-per-year growth in ClickUp
- do NOT trust the existing store during migration — primary-source re-verify every finishing position (three silent errors found this session)
- data stores that grow by row/round are Size Sally watch targets — forecast the split on the build path
