# f1-racetracks v5 — Build Spec

**Cycle:** v4 → v5
**Theme:** Mobile-first responsive pass. The app currently overflows and clips on phones. Fix the footer/action bar and make the entire screen scale cleanly to small viewports without horizontal overflow.

> **Format note:** This is a DIRECTIONAL spec (observed symptoms + target behavior + acceptance criteria), NOT the surgical-diff format in `template-app/next-build-spec.md`. Reason: there is no `/source` chunk set for this app yet, so exact line-diffs could not be authored (the 126KB `index.html` clips silently at the ~30KB read cap). When the chunk set is generated, this can be upgraded to literal find/replace diffs.

## Source location

- **App source:** `f1-racetracks/index.html` (~126KB, single inline `<style>` block)
- **Repo:** `mawizorek/ClickUp_apps` (branch `main`)
- **Chunk set:** NOT YET GENERATED — Michael generates it when picking this up. Until then the render agent must read the full source via a local whole-file copy, NOT a single >30KB fetch.
- **Encoding (once chunked):** base64 armored

---

## Observed problem (device: iPhone Safari, top-level, mawizorek.github.io)

Screenshot evidence, v4 on a phone:

- **The footer/action bar overflows horizontally and clips off the left edge.** The action buttons — `Copy source`, `Prepare download`, `Open in new tab`, `Export data (.json)`, and the `Right-click → Save As` hint — are laid out in a fixed/wide row wider than the viewport. On mobile the row runs off-screen on the left; the last item reads as a clipped `r Right-click → Save As`. Buttons are not wrapping or stacking.
- **The footer meta line** (`Racetracks v4 · 14 breakdowns · 22 rounds`) sits above the clipped button cluster and is also pinned to a desktop-width layout.
- **General screen scale is desktop-first.** Content is readable but the chrome (footer especially) assumes a wide viewport. There is horizontal overflow somewhere in the footer subtree forcing the whole action bar off-canvas.

---

## Target behavior (v5)

### Footer / action bar (primary fix)
1. **Never overflow the viewport horizontally.** The action bar must fit within `100vw` at 320px width and up.
2. **Wrap or stack the action buttons on narrow screens.** Below ~600px, the button row switches to `flex-wrap: wrap` (or a vertical stack) so every button is fully visible and tappable. No button clipped or pushed off-screen.
3. **Full-width, touch-sized buttons on mobile.** Each button ≥44px tall (iOS tap target), comfortably padded, full-width stacked or two-up wrapped.
4. **The `Right-click → Save As` hint** is a desktop affordance. On mobile hide it under the breakpoint or reword to long-press guidance; never let it clip.
5. **Footer meta line** wraps gracefully and centers on mobile.

### Whole-screen responsive scale (secondary)
6. **Audit for the overflow source.** Find the fixed width / `min-width` / `white-space: nowrap` / non-wrapping flex row in the footer and kill it. `overflow-x: hidden` on the root only as a backstop, not the primary fix.
7. **Fluid layout.** Cards, headers, the legend row, and content padding use fluid units (`%`, `clamp()`, `min()`) to scale 320px → desktop. Reduce outer padding on mobile.
8. **`clamp()` on large headings** so they scale down instead of forcing width.
9. **Safe areas.** Add `env(safe-area-inset-*)` padding to the footer.

---

## Agent instructions

1. Read the full `index.html` source (chunk set once generated, or a local whole-file copy — do NOT trust a single >30KB fetch).
2. Locate the footer / action-bar markup and CSS. Confirm the REAL class names (footer container, button row, buttons, meta line, legend row) before editing — do not assume names.
3. Eliminate the horizontal-overflow source in the footer subtree (target #6).
4. Add a mobile breakpoint (`@media (max-width: 600px)`) to the inline `<style>` block: wrap/stack the buttons, full-width ≥44px, wrap the meta + legend rows, hide/reword the right-click hint, reduce container padding, add `env(safe-area-inset-bottom)`.
5. Apply `clamp()` to large headings.
6. Keep desktop layout unchanged above 600px — additive responsive CSS, not a desktop rewrite.
7. Bump `APP_VERSION` to v5.
8. Verify at 320/375/390px: zero horizontal scroll, every footer button visible + tappable, nothing clipped.
9. Deliver the complete modified source as a ClickUp artifact. Do NOT commit (file >30KB); Michael uploads manually.

### Do NOT
- Rewrite the desktop layout or restyle the cards' visual design — scope is responsive fit + footer, not a redesign.
- Add Print All / Download All buttons or synthetic-click downloads (repo download rules stand).
- Commit if source could not be read whole.

---

## Acceptance criteria

- [ ] At 320px, 375px, 390px: zero horizontal scroll.
- [ ] Every footer action button fully visible and tappable; none clipped off-edge.
- [ ] Footer meta line and legend row wrap cleanly.
- [ ] `Right-click → Save As` hint hidden or reworded for touch.
- [ ] Headings scale down on mobile without forcing width.
- [ ] Desktop layout unchanged above 600px.
- [ ] `APP_VERSION` = v5.

---

## Standing rule (applies to ALL apps)

**Every app in `mawizorek/ClickUp_apps` must be explicitly designed for clean mobile viewing AND desktop — mobile is a first-class target, not an afterthought.** Every build and build spec includes a responsive pass: no horizontal overflow at 320px, footers/action bars that wrap or stack, touch targets ≥44px, fluid layout via `clamp()`/`min()`/`%`, safe-area insets. Test every ship at phone width before calling it done. Also recorded in the Brain Reference Library (Apps / HTML Artifacts → Architecture).

---
---

## Planned (future pushes)

Features queued for post-v5 builds. When the current build ships and the next cycle starts, promote the top item to the active spec (overwriting the completed instructions above).

---

### v6: Data Separation Retrofit

**Theme:** Split inline `TRACKS` data out of `index.html` into `data.json` so Brain can update circuit data via MCP commit without touching the engine.

- Extract the `TRACKS` array into `f1-racetracks/data.json` with a schema wrapper (`{ "version": "YYYY-MM-DD", "tracks": [...] }`).
- `index.html` does `fetch('./data.json')` on load. Same-origin on Pages = no CORS.
- Offline fallback: cache JSON in `localStorage`; on fetch failure fall back to cache. Inline a minimal skeleton dataset so `file://` always renders something.
- Engine commits = version bumps. Data commits = maintenance (no version bump).
- Acceptance: app loads from Pages with live fetch; app loads offline from localStorage cache; app loads from `file://` with inline fallback.

---

### v7: Race Weekend Schedule Panel

**Theme:** Each circuit page shows the full race weekend timetable (all series, all sessions) so the app becomes a weekend companion, not just a static reference.

**What it adds:**
- A Schedule panel on each circuit detail view showing every session: F1 (FP1/FP2/FP3/Quali/Race), F2 (Practice/Qualifying/Sprint/Feature), Porsche Supercup, F1 Academy, and Sprint-format sessions (SQ/Sprint) where applicable.
- Sessions grouped by day, with series badge + session name + local time.
- Visual status: `done` (muted), `upcoming` (normal), `live` (highlighted).

**Data schema** (added to each track object in `data.json`):

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

**Population strategy:**
- **Bulk seed at launch:** Research and commit the FULL remaining 2026 season schedule (all 24 rounds, all support series) from the FIA provisional calendar + series-specific calendars. Every circuit page has value from day one.
- **Pre-weekend verification pass (new weekly step):** ~Tue/Wed before race week, verify the upcoming round's schedule against the latest FIA event timetable. Fix any shifted times or added/cancelled support races. Data-only commit.
- **Post-weekend recap pass (existing):** Flip completed sessions to `status: "done"`.
- **Ad-hoc:** "Update the schedule" = research + data.json commit. No engine touch, no version bump.

**Data sources:**
- FIA official event calendar (session times, format)
- formula1.com race weekend schedule
- fiaformula2.com / fiaformula3.com calendars
- Porsche Supercup schedule (porsche.com/motorsport)

**Engine requirements:**
- Schedule panel on circuit detail view, below or beside the existing breakdown sections.
- Collapsible or tabbed if session count is high (sprint weekends have 8+ sessions).
- Mobile-first: stacks cleanly at 320px.
- "Next up" highlight when viewing a circuit whose weekend is imminent.

**Notes:**
- F2/F3/Porsche don't race at every venue. Only include series that actually appear at each circuit.
- Datetime includes timezone offset so the UI can show local track time.
- Sprint weekend detection: 2026 sprint rounds are published on the FIA calendar. The schedule array simply includes SQ + Sprint sessions for those rounds.
- Depends on v6 (data separation) shipping first so the schedule lives in `data.json`.
