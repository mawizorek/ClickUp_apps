# f1-racetracks — Next Build Spec

**Cycle:** v5 (mobile pass, prior) → v6 (Weekend Story mode)
**Theme:** Add **Story mode** to the Weekend race-detail surface — a Results / Story toggle that brings the same round to life (scrubbable position ladder + starting-grid wheel cards + pit lane + team radio), sharing the one `f1-results/2026/` data load. Option A: one page, one data load, no new lens.

> Story is NOT a new app and NOT a new lens. It is a **mode of the Weekend surface**. The lens switcher stays Matrix / History / Circuits; you still arrive at a race by drilling into a round. The Results/Story toggle lives in the race mast.

## Source location

- **Edit surface (sanctioned):** `f1-racetracks/source/weekend/` chunk set — each file is readable and under the ~15KB budget. THIS is where Story was authored; the shipped `weekend.html` is reassembled from these.
- **Chunk set (weekend):** `base.css`, `panels.css`, `story.css` (NEW), `data.js`, `render.js` (UPDATED v2.1), `nav.js`, `story.js` (NEW).
- **Shipped file:** `f1-racetracks/weekend.html` (assembled artifact, >30KB — do NOT hand-splice blind; reassemble from chunks).

## What shipped to the chunk set this cycle

1. **`story.js` (NEW)** — Story-mode engine. `window.mountStory(rd,i)` / `window.teardownStory()`.
   - Derives the position **ladder from the round's own `classification`** (grid order → finishing order, smoothstep + noise), exactly like every Results panel derives from the store. This is the real light-lap layer, no new backend.
   - Timing tower, position ladder, starting-grid wheel-cards (persistent DOM nodes that slide), pit lane, team-radio group chat, continuous-time scrubber with Lap/Sector/Sec resolution.
   - **Illustrative / future layers (flagged in-UI):** per-second telemetry (speed/gear/rpm/DRS) is procedural; pit stops derive from `stintsFor(slug)` boundaries when present; radio shows an honest empty state until a `rd.radio[]` feed is archived. Ladder + order + gaps are store-derived.
2. **`story.css` (NEW)** — Story styles in the weekend hue-268 tokens (sharp corners, 1px lines, Chakra Petch + JetBrains Mono). Includes `.mode-toggle`.
3. **`render.js` (UPDATED → v2.1)** — adds the Results/Story toggle to the mast, wraps the 8 static panels in `#wk-results`, adds a `#wk-story` mount, and `window.setWeekendMode()` (lazy-mounts story on first entry, tears it down on leave to free the rAF loop).

## Reassembly into shipped `weekend.html` (the remaining step)

The chunk edits are done and reviewable. To ship, reassemble `weekend.html` from the chunk set. Three insertions vs the current shipped file:

1. **Styles:** inline `story.css` into the `<style>` block, AFTER `panels.css`'s content (it references the same tokens + fonts already present).
2. **Logic:** inline `story.js` as a `<script>` BEFORE `nav.js` (so `window.mountStory` exists before boot/route runs) and AFTER `data.js` (it reads `tc`/`last`/`esc`/`el`/`stintsFor` globals). Replace the existing `render.js` block with the v2.1 content.
3. **No shell/markup change needed** — the mode toggle + `#wk-results`/`#wk-story` containers are injected by `render.js` into the existing `#mast` and `#app`. The topbar/lens switcher (`nav.js`) is untouched.

Bump the footer stamp / `APP_VERSION` to v6. Verify: toggle flips cleanly, ladder renders on Story entry, tower/grid/radio tabs work, no rAF leak when switching back to Results, mobile stacks at ≤820px.

## Acceptance criteria

- [ ] Race mast shows a Results / Story toggle; Results is default and unchanged from today.
- [ ] Story mode: ladder derives from the round's classification; play + scrub (Lap/Sector/Sec) work; tower + grid wheel-cards + pit lane + radio tabs all render.
- [ ] Switching Results ←→ Story mounts/tears down cleanly (no runaway animation frame).
- [ ] Illustrative layers (telemetry, pit, radio) are visibly flagged, not passed off as sourced.
- [ ] Weekend hue-268 tokens throughout; reads as the same app as the Results panels.
- [ ] Mobile: stacks cleanly at 820px and below, no horizontal overflow at 320px.
- [ ] Desktop Results layout unchanged.

## Futures (Story)

- **Per-second telemetry (R2 tier):** replace procedural speed/gear/rpm with real OpenF1 car data, one object per race in Cloudflare R2, lazy-loaded per selected driver. The light lap/sector layer stays in the round store.
- **Archived team radio:** populate `rd.radio[]` in the round file (lap-tagged transcripts, driver/pitwall role, sys events); the feed already renders it. Later: audio clip playback on tap.
- **Historical ghost overlay:** the ladder ghost toggle is stubbed; wire it to a prior-year same-circuit line from the growing store.
- **Customizable driver steering wheels (Michael):** per-driver wheel-config (which readouts show, order, skin). Card render is isolated (`buildCards`/`updateGrid`) so the layout is swappable; add a config object when telemetry lands.

## Standing rule (all apps)

Every app must be explicitly designed for clean mobile AND desktop. No horizontal overflow at 320px; wrap/stack action bars; touch targets ≥ 44px; fluid `clamp()`/`min()`/`%`; safe-area insets. Test at phone width before shipping.
