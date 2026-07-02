# f1-racetracks — v5 Build Spec

**Cycle:** v4 → v5
**Theme:** Mobile-first responsive pass. The app currently overflows and clips on phones. Fix the footer/action bar and make the entire screen scale cleanly to small viewports without horizontal overflow.
**Source of truth:** `f1-racetracks/index.html` (self-contained, ~126KB, single `<style>` block inline). Over the ~30KB read cap → the render agent MUST read the source via a chunk set / whole-file local copy before diffing. This spec is directional (observed symptoms + target behavior + acceptance criteria), NOT literal line-diffs, because the source could not be read whole at spec time. Confirm exact selector names against the source before editing.

---

## Observed problem (device: iPhone Safari, top-level, mawizorek.github.io)

Screenshot evidence, v4 on a phone:

- **The footer/action bar overflows horizontally and clips off the left edge.** The action buttons — `Copy source`, `Prepare download`, `Open in new tab`, `Export data (.json)`, and the `Right-click → Save As` hint — are laid out in a fixed/wide row that is wider than the viewport. On mobile the row runs off-screen on the left; the last item reads as a clipped `r Right-click → Save As`. Buttons are not wrapping or stacking.
- **The footer meta line** (`Racetracks v4 · 14 breakdowns · 22 rounds`) sits above the clipped button cluster and is also pinned to a desktop-width layout.
- **General screen scale is desktop-first.** Content is readable but the chrome (footer especially) assumes a wide viewport. There is horizontal overflow somewhere in the footer subtree forcing the whole action bar off-canvas.

---

## Target behavior (v5)

### Footer / action bar (primary fix)
1. **Never overflow the viewport horizontally.** The action bar must fit within `100vw` at 320px width and up. No element in the footer subtree may be wider than its container.
2. **Wrap or stack the action buttons on narrow screens.** Below a mobile breakpoint (~600px), the button row switches to `flex-wrap: wrap` (or a vertical stack) so every button is fully visible and tappable. No button may be clipped or pushed off-screen.
3. **Full-width, touch-sized buttons on mobile.** Each action button should be at least 44px tall (iOS tap target), comfortably padded, and either full-width stacked or two-up wrapped — not a single non-wrapping row.
4. **The `Right-click → Save As` hint** is a desktop affordance. On mobile either (a) reword/hide it, or (b) keep it but ensure it wraps and never clips. Right-click doesn't exist on touch — prefer hiding it under the mobile breakpoint or replacing with the long-press guidance.
5. **Footer meta line** (`Racetracks vN · N breakdowns · N rounds`) wraps gracefully and centers on mobile.

### Whole-screen responsive scale (secondary, broader fix)
6. **Audit for the overflow source.** Something in the footer (fixed width, `min-width`, `white-space: nowrap`, negative margin, or a non-wrapping flex row) is forcing horizontal scroll. Find and kill it. Add `overflow-x: hidden` on the root container only as a backstop, not as the primary fix — fix the offending element too.
7. **Fluid layout.** Cards, headers, the legend row (`Completed race / Race weekend live / Upcoming / BREAKDOWN READY`), and content padding should use fluid units (`%`, `clamp()`, `min()`) so they scale from 320px → desktop. Reduce outer padding on mobile so cards use more of the available width.
8. **Typographers:** use `clamp()` for the big headings so they scale down on phones instead of forcing width.
9. **Respect safe areas.** Add `env(safe-area-inset-*)` padding to the footer so it clears the iOS home indicator / browser chrome.

---

## Render agent instructions

1. Read the full `index.html` source (chunk set / local whole-file copy — do NOT trust a single >30KB fetch).
2. Locate the footer / action-bar markup and its CSS. Identify the exact class names for: the footer container, the action-button row, the individual buttons, the meta line, and the legend row. Confirm the real selectors before editing (do not assume names).
3. Find and eliminate the horizontal-overflow source in the footer subtree (see target #6).
4. Add a mobile breakpoint (`@media (max-width: 600px)`) to the existing inline `<style>` block that:
   - Switches the action-button row to `flex-wrap: wrap` or a vertical stack.
   - Makes buttons full-width (or two-up), min 44px tall, comfortably padded.
   - Wraps/centers the footer meta line and legend row.
   - Hides or rewords the `Right-click → Save As` hint for touch.
   - Reduces outer/container padding so cards use the width.
   - Adds `env(safe-area-inset-bottom)` padding to the footer.
5. Apply `clamp()` to large headings so they scale down on narrow viewports.
6. Keep the desktop layout unchanged above the breakpoint — this is additive responsive CSS, not a desktop rewrite.
7. Bump `APP_VERSION` to v5.
8. **Verify on a 320–390px viewport:** no horizontal scroll, every footer button fully visible and tappable, nothing clipped off any edge.

### Do NOT
- Do not rewrite the desktop layout or restyle the cards' visual design — scope is responsive fit + footer, not a redesign.
- Do not add Print All / Download All buttons or synthetic-click downloads (repo download rules stand).
- Do not commit if source could not be read whole; >30KB files are uploaded manually by Michael.

---

## Acceptance criteria

- [ ] At 320px, 375px, and 390px widths: zero horizontal scroll.
- [ ] Every footer action button (`Copy source`, `Prepare download`, `Open in new tab`, `Export data (.json)`) is fully visible and tappable; none clipped off-edge.
- [ ] Footer meta line and legend row wrap cleanly, no overflow.
- [ ] `Right-click → Save As` hint hidden or reworded for touch.
- [ ] Headings scale down on mobile without forcing width.
- [ ] Desktop layout unchanged above 600px.
- [ ] `APP_VERSION` = v5.

---

## Standing rule (applies to ALL apps, not just this one)

**Every app in `mawizorek/ClickUp_apps` must be explicitly designed for clean mobile viewing AND desktop — mobile is a first-class target, not an afterthought.** Every build and every build spec must include a responsive pass: no horizontal overflow at 320px, footers/action bars that wrap or stack, touch targets ≥44px, fluid layout with `clamp()`/`min()`/`%`, and safe-area insets. This rule is also recorded in the Brain Reference Library (Apps / HTML Artifacts → Architecture). Test every ship at phone width before calling it done.
