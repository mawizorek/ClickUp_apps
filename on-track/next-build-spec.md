# On Track — Next Build Spec

> **☑ RESOLVED — `index.html` is a pointer, not content.**
>
> Verified 2026-07-13 against the committed shell: `index.html` holds only `<head>`, static chrome markup, and two `<script src="./source/…">` tags. No servable page body of its own, no inline app logic. The pointer/shell redesign is done.
>
> - [x] `index.html` verified as a pointer/shell (not a content store)

One file per app, overwritten each version cycle. Current shipped: **v2.0**.

## Next build _(nothing committed yet)_

## Recently shipped

- **v2.0** — soft TBD event support. Date-known / time-TBD events (`{ "date": "YYYY-MM-DD", "timeTBD": true }`, no `start`/`end`) now live in `data.json` and render as honest “TBD” schedule rows instead of being filtered out. No placeholder hour is ever invented: internally they anchor to their authored calendar date (end-of-day ET) purely for day-grouping + sort ordering, are guarded out of ALL live / up-next / countdown logic via the `_tbd` flag, and render a dim `TBD` where the clock time would be plus a dashed “Time TBD” tag. Fully-timed events are unchanged. Engine-only change in `source/render.js` (new `groupKey()` + `_tbd` branch in `hydrate()`/`stateOf()`/`renderSchedule()`/`renderHero()`/`tick()`). Styling reuses existing classes/vars — no `styles.css` touch.
- **v1.9** _(reconciled from source 2026-07-05; the spec had lagged)_ — settings-popover chrome (gear housing the theme + timezone toggles) and footer cleanup: the source-download buttons (Copy / Prepare / Save / Open) were retired via `cleanupFooter()` since git hosting is the source of truth now. This removed the earlier self-contained runtime export.
- **v1.8** — architecture refactor to multi-file (thin shell + `source/{styles.css,render.js,app.js}`). Retired the 30KB chunk dance; source is now directly agent-readable.
- **v1.7** — sticky-hover chip-border fix (all `:hover` behind `@media (hover: hover)`) + collapsible filter sections with live count badges (mobile density).

## Data schema — soft TBD events (for refresh agents)

A fully-timed event (unchanged):

```json
{ "series": "F1", "kind": "Race", "title": "…", "detail": "…",
  "start": "2026-07-19T07:00:00-04:00", "end": "2026-07-19T09:00:00-04:00",
  "platforms": ["Apple TV"] }
```

A date-known / time-TBD event — use ONLY when the date is confirmed but the start time is not yet published:

```json
{ "series": "MotoAmerica", "kind": "Race 1", "title": "…", "detail": "…",
  "date": "2026-08-15", "timeTBD": true,
  "platforms": ["TBD"] }
```

Rules for writing TBD events:
- Set `"timeTBD": true` and provide `"date"` as a bare `YYYY-MM-DD` calendar date (read in ET, the schedule's home zone). Do NOT include `start`/`end`, and never invent an hour.
- `platforms` is still required (use `["TBD"]` or `["Unknown"]` if the broadcaster isn't known either).
- The instant the real time is published, convert it to a normal timed event (`start`/`end` ISO, drop `date`/`timeTBD`). It rejoins live/next/countdown automatically.

## Futures

### Brand-asset cleanup (soft, not urgent)

The icon + share banner are live and working, but shipped under their raw mobile-upload filenames because renaming wasn't possible from the phone. Tidy when convenient:

- **Rename** `IMG_4698.png` → `icon.png` (app icon) and `IMG_4689.png` → `og.png` (share/OG banner). Then update the three refs in `index.html` head (`apple-touch-icon`, PNG `favicon`, `og:image` + `twitter:image`) back to the clean names.
- **Downsize:** both are ~1+ MB straight off the phone. Target icon ~512x512 (<100KB) and banner 1200x630 (<200KB) so the OG unfurl loads fast and stays under budget.
- **Optional:** add a 192px PNG variant for best Android home-screen install fidelity, and confirm the banner is exactly 1200x630 (crop if the phone export drifted).

No rush: everything maps and renders as-is. This is polish, not a blocker.

### Changed-event UI callout (“was X → now Y”)

When a refresh detects that an existing event materially shifted (rain delay, moved session, time change, cancellation), the UI should be able to surface that it changed — e.g. a small badge or strikethrough showing the old time/status next to the new. Requires: a data field on the event to carry the prior value + a change flag, and engine render support for it. Build item, not a routine (data-only agents can't add fields or render logic). Rare, low priority. Note: the `_tbd` → timed transition (a TBD event getting its real time) is a natural first customer for this callout.

## Known guardrails

- **Multi-file now.** Engine edits = edit the relevant `source/*` file (reads whole under the cap) + bump `APP_VERSION` in `source/render.js`. NEVER recombine into a single monolith `index.html`.
- Data updates = commit `data.json` only, no engine bump.
- **TBD events:** the `_tbd` flag set in `hydrate()` is the single gate. Anything that touches live / up-next / countdown MUST keep excluding `_tbd` events, and all day-grouping MUST go through `groupKey(e)` (never `dayKey(e._s)` directly) so TBD events group by their authored date regardless of the ET/local timezone toggle. Never display a TBD event's anchor time.
- **Self-contained runtime export was retired in v1.9** (`cleanupFooter()` strips the footer source buttons; git hosting is the source of truth). There is no `buildSelfContained` in the current code. If export is ever reintroduced, it must re-inline every `source/*` file + current `DATA`.
- Brand asset refs live in the `index.html` head; keep the absolute Pages URL for og/twitter (relative paths don't unfurl).
- Data refreshes verify-and-merge (never blank-slate rebuild) and never shrink series coverage — see `routines/README.md` Data-Refresh Discipline.
