# f1-racetracks — Build Spec

> **⚠️ MONOLITH BLOCKER (read first).** Neither `index.html` (~126KB) nor `weekend.html` (30KB+) has a `source/` chunk set, and both clip past the ~30KB whole-file read cap. **Do NOT commit edits into either monolith blind.** The unblock is the SAME for every item below: generate the `source/` chunk set for the target file FIRST, then author literal find/replace diffs against the chunks and reassemble. Michael is routing the chunk-set generation to a dedicated agent. Until that lands, no monolith surgery.

---

## Next build — A) Story mode on the Race Detail (weekend.html)

**Theme:** Add a **Results / Story** mode toggle to the Weekend race-detail page. Same round, same page, same data load. Results = the existing weekend render (podium / pole / fastest lap / grid / qualifying / sprint / classification / championship swing). Story = the same race brought to life: a scrubbable lap-by-lap replay.

**Reference build (approved look + behavior):** the `weekend-story-mode.html` preview artifact (ClickUp). It is already themed in weekend.html's exact hue-268 tokens + Chakra Petch / Inter / JetBrains Mono, the brand mark, and the Matrix/History/Weekend/Circuits lens. Treat it as the visual + interaction contract. Do NOT restyle; port it in.

### What Story mode contains
- **Transport bar:** play/pause, `L{lap}/{total}` + phase + sector readout, a scrubber with a lap tick at every lap and SC/Green/flag markers, a **Lap / Sector / Sec** scrub-resolution toggle, and a 1x/2x/4x speed toggle.
- **Continuous-time model:** one time value `T` in [1, TOTAL laps]. Integer-lap views (timing tower, radio) render on lap change; continuous views (ladder scrub dot, grid cards, telemetry) render per animation frame. This split is load-bearing: it is what keeps the page smooth and flash-free. Do not collapse it to per-frame full re-render.
- **Timing tower** (left): position (gold/silver/bronze for P1-3), team bar, DRS pill, tyre compound + stint age, gap-to-leader, interval, last-lap time (purple = fastest overall, green = personal best). Click a row to select a driver.
- **Tab card** (right), three lenses so nothing overlaps:
  - **Positions:** step ladder, 22 lanes, laps L-R; the scrub line + continuous dots ride over the static per-lap step paths. 2025-winner ghost toggle (stub for the history-overlay future).
  - **Grid:** starting-grid formation of persistent wheel-key cards (position, speed, gear, rpm bar, DRS dot, delta) that STAY MOUNTED and transform/slide on a position change (never rebuilt per frame). A steering-wheel focus strip (shift lights, gear, speed, ENG/BBAL/DIFF/DRS) for the selected driver. Pit lane sidebar: a stop card slides in when a driver boxes; the pit list rebuilds ONLY on pit-set-signature change (this is the flicker fix, keep it).
  - **Radio:** team radio as a group chat, timestamped to the lap, driver vs pit-wall roles, system messages (safety car / green / chequered).

### Integration shape (once chunked)
- Story lives INSIDE weekend.html as a second mode of the current race-detail view, gated by the `Results / Story` toggle in the mast. Not a new lens, not a new file. The lens switcher stays Matrix / History / Weekend / Circuits.
- Results markup = the current weekend render, untouched. Story markup + its scoped CSS/JS mount alongside; toggling flips `.hidden` between the two blocks and pauses playback when leaving Story.
- Guard the ladder/grid render behind `mode==='story'` so hidden-mode work is skipped; re-render on toggle-in (offsetWidth is 0 while hidden — the preview already defers the ladder base render until the SVG has width, keep that guard).

### Data (both modes share ONE round file)
- Results already derives everything from `f1-results/2026/` (index_rounds.json + round files): podium, pole, fastest lap, grid, quali, sprint, classification, swing. **Story reuses the SAME round file** for the light layer.
- **Three LOD tiers** (the scrub-resolution architecture):
  - **Lap** (coarse, always loaded, KBs): per-lap order/gaps/intervals/lap-times/tyre-stint/DRS/pit events. Powers tower + ladder + grid positions. Lives in the round file (extend the existing schema; do not store twice).
  - **Sector** (mid): ~3 chunks/lap, the default scrub snap, break at every lap line. Derived or lightly sampled.
  - **Second** (fine, HEAVY, ~1M points/race, ~5-15MB raw / 1-3MB gzip): full telemetry (speed/throttle/brake/gear/rpm/drs/x/y). **Does NOT go in the round file or any ClickUp note (size).** One object per race in **Cloudflare R2**, lazy-loaded per selected driver only. This is the only NEW backend Story needs; everything else rides the existing store.
- The preview currently fabricates positions/telemetry with a seeded model as a stand-in. Real ingest: OpenF1 (positions, laps, pits, car telemetry, team_radio audio) + Jolpica/Ergast for results. Transcribe radio once, cache text, tag to lap/driver.

### Futures (captured, not this build)
- **Customizable driver steering wheels (Michael):** each grid card is a mini wheel. Let the user choose which readouts show per driver, reorder them, pick a wheel skin per team/driver. Needs a per-driver wheel-config object + a render layer that reads it. Card render is already isolated (buildCards/updateGrid) so the layout is swappable.
- **Historical ghost overlays:** the 2025-winner ghost is stubbed. Overlay any prior-year same-circuit line, or a historical-average line, from the growing results archive.
- **Radio audio playback:** radio is text bubbles now; play the actual OpenF1 team_radio clip on tap, synced to the lap.

### Acceptance
- [ ] `Results / Story` toggle in the weekend mast; Results = current render untouched.
- [ ] Story matches the approved preview (tower, ladder, wheel-key grid, pit lane, radio) in hue-268 tokens.
- [ ] Continuous-time split preserved (lap-render vs frame-render); no flicker on scrub; pit list rebuilds only on signature change.
- [ ] Both modes hydrate from the same `f1-results/2026/` round file.
- [ ] Mobile pass per the standing rule (below): no horizontal overflow at 320px, controls wrap, ≥44px targets.

---

## Next build — B) Mobile-first responsive pass (index.html) [pre-existing, still open]

**Theme:** Mobile-first responsive pass. The app overflows and clips on phones. Fix the footer/action bar and make the whole screen scale cleanly to small viewports without horizontal overflow.

> **Format note:** DIRECTIONAL spec (symptoms + target + acceptance), NOT surgical-diff, because there is no `/source` chunk set for `index.html` yet (see MONOLITH BLOCKER). Upgrade to literal diffs once chunked.

### Observed problem (iPhone Safari, v4)
- Footer/action bar overflows horizontally and clips off the left edge (`Copy source`, `Prepare download`, `Open in new tab`, `Export data (.json)`, `Right-click → Save As`). Buttons not wrapping/stacking.
- Footer meta line (`Racetracks v4 · 14 breakdowns · 22 rounds`) pinned to desktop width.
- General scale is desktop-first; horizontal overflow in the footer subtree forces the action bar off-canvas.

### Target behavior (v5)
1. Never overflow the viewport horizontally (fit within 100vw at 320px+).
2. Below ~600px, action row `flex-wrap:wrap` or vertical stack; every button visible + tappable.
3. Full-width, ≥44px touch targets on mobile.
4. `Right-click → Save As` hint: hide under the breakpoint or reword for touch.
5. Footer meta line wraps + centers on mobile.
6. Audit + kill the overflow source (fixed width / min-width / nowrap / non-wrapping flex) in the footer; `overflow-x:hidden` on root only as backstop.
7. Fluid layout (`%`, `clamp()`, `min()`) 320px → desktop; reduce outer padding on mobile.
8. `clamp()` on large headings.
9. `env(safe-area-inset-*)` padding on the footer.

### Acceptance criteria
- [ ] 320 / 375 / 390px: zero horizontal scroll.
- [ ] Every footer button fully visible + tappable; none clipped.
- [ ] Footer meta + legend rows wrap cleanly.
- [ ] Right-click hint hidden or reworded for touch.
- [ ] Headings scale down on mobile without forcing width.
- [ ] Desktop layout unchanged above 600px.
- [ ] `APP_VERSION` = v5.

---

## Agent instructions (BOTH items)

1. **Generate the `source/` chunk set for the target monolith FIRST** (`source/weekend/` for item A, `source/` for item B — mirror the existing `source/standings/` split: concern-separated CSS + JS chunks + a source_index.md + reassembly note). Do not skip this; it is the blocker.
2. Read the FULL source via the chunk set (or a local whole-file copy), NEVER trust a single >30KB fetch.
3. Confirm REAL class names / IDs / router hooks in the target file before editing — do not assume.
4. Author literal find/replace diffs against the chunks; reassemble; verify.
5. Deliver the complete modified source as a ClickUp artifact. **Commit only if the source was read whole via the chunk set.**

### Do NOT
- Commit into a monolith that could not be read whole.
- Rewrite the desktop layout or restyle cards (item B is responsive-fit + footer, not a redesign).
- Add Print All / Download All buttons or synthetic-click downloads (repo download rules stand).
- Put per-second telemetry in the round file or any note (item A) — that is R2 only.

---

## Standing rule (applies to ALL apps)

**Every app in `mawizorek/ClickUp_apps` must be explicitly designed for clean mobile viewing AND desktop — mobile is a first-class target, not an afterthought.** Every build and build spec includes a responsive pass: no horizontal overflow at 320px, footers/action bars that wrap or stack, touch targets ≥44px, fluid layout via `clamp()`/`min()`/`%`, safe-area insets. Test every ship at phone width before calling it done. Also recorded in the Brain Reference Library (Apps / HTML Artifacts → Architecture).
