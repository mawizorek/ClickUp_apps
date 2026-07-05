# On Track — Next Build Spec

One file per app, overwritten each version cycle. Current shipped: **v1.6**. Target: **v1.7**.

## Next build

### 🐛 Sticky-hover border on touch (series chip "won't fully deselect")

**Symptom:** on iOS, tapping a series chip OFF clears the interior fill but leaves the bright series-colored border lit (looks half-selected). Interacting elsewhere clears it. Reported on F1 chip after select → deselect.

**Root cause:** the chip fill is driven by `[aria-pressed="true"]` (clears correctly on deselect), but the border color is ALSO applied by `.chip:hover`. Mobile Safari applies `:hover` on tap and keeps it "stuck" on the last-tapped element until another tap lands elsewhere — so the hover border persists after deselect. Classic sticky-hover-on-touch.

**Fix:** gate ALL interactive `:hover` styling behind `@media (hover: hover)` so hover only applies on true pointer devices, never touch. This is a surgical CSS-only change, no JS, no markup.

Wrap each of these existing rules in a `@media (hover: hover) { ... }` block (they currently sit unguarded in the `<style>`):

```css
/* BEFORE (unguarded — sticks on touch) */
.themebtn:hover { border-color: var(--accent); }
.chip:hover { border-color: var(--cc, var(--accent)); }
.pasttoggle:hover { border-color: var(--accent); color: var(--text); }
.jump select:hover { border-color: var(--accent); }
.foot-src button:hover, .foot-src a:hover { border-color: var(--accent); }

/* AFTER (guarded — pointer only) */
@media (hover: hover) {
  .themebtn:hover { border-color: var(--accent); }
  .chip:hover { border-color: var(--cc, var(--accent)); }
  .pasttoggle:hover { border-color: var(--accent); color: var(--text); }
  .jump select:hover { border-color: var(--accent); }
  .foot-src button:hover, .foot-src a:hover { border-color: var(--accent); }
}
```

Leave `:active`, `:focus-visible`, and `[aria-pressed="true"]` rules untouched — they are correct. Bump `APP_VERSION` to `v1.7` and `APP_DATE`.

### 📱 Collapsible filter sections (mobile density fix) — APPROVED (Michael picked Option 1, 2026-07-05)

**Problem:** front page stacks hero + search + date/tz + ~18 series chips + 15 platform chips before any schedule content — roughly two screens of scroll on a phone before the first race. Michael wants the scroll wall gone WITHOUT losing button accessibility (every chip one tap away) or clarity of scope (what's active must stay visible). Options 2 (bottom sheet) and 3 (swipe rows) were rendered and rejected in favor of this.

**Approved pattern:** wrap SERIES and WHERE TO WATCH each in a collapsible section. Collapsed by default on mobile; the header shows the group label + a live count badge of active filters in that group + a chevron. Tapping the header expands the chip cloud in place (no navigation, no modal). All existing chip markup/behavior lives unchanged inside the expanded body.

**Design reference:** the approved interactive render is the Option 1 phone in the density-options artifact (built this session). Match its structure and motion. Key details from the render:

- Section shell: `1px solid var(--border-soft)` rounded container, subtle tinted fill (`oklch(0.21 0.045 264 / .5)`), `margin-bottom` ~9px between the two sections.
- Header (`<button>`, full-width, keyboard-focusable): uppercase group label in `--text-3`, then a count badge, then a chevron pushed right with `margin-left:auto`.
- **Count badge:** `--accent` bg / `--accent-ink` text when count > 0; muted `--surface-3` / `--text-3` when 0. Shows the integer count of pressed chips in that group. Updates live on every chip toggle AND on `clear`.
- **Chevron:** rotates 180deg on open, `transition: transform .28s var(--ease-out)`.
- **Expand/collapse motion:** animate via `grid-template-rows: 0fr → 1fr` (the least-bad height animation per design laws — do NOT animate `height`), `.32s var(--ease-out)`; inner wrapper `overflow:hidden; min-height:0`. Respect `prefers-reduced-motion` (instant, no transition).
- State attribute: `data-open="true|false"` on the section drives both the chevron rotation and the row expansion.

**Responsive rule:** collapsed-by-default is a MOBILE behavior. On desktop (pointer / wider viewport) the sections may render expanded by default — the scroll wall isn't a problem there and the current always-open layout is fine. Gate the default-collapsed state behind a mobile media query (or `hover: none` / max-width ~620px to match the existing mobile breakpoint) so desktop keeps its current feel. Persist open/closed state per section in `localStorage` (e.g. `ontrack_sec_series`, `ontrack_sec_watch`) so a user's manual expand/collapse sticks across reloads.

**Accessibility:** header is a real `<button>` with `aria-expanded` reflecting `data-open`; `aria-controls` pointing at the body id; body gets `aria-hidden` when collapsed. Keep the existing `clear` affordance working and have it drive the count badge to 0.

**Guardrails / non-goals:** do NOT change chip visuals, chip tap behavior, the `clear` action, or filter logic. Do NOT hide chips behind a swipe or a modal (that was Options 3 and 2, both rejected). The collapsed header + count is the ONLY new scope. This is an engine change → version bump.

## Futures

### 🧹 Brand-asset cleanup (soft, not urgent)

The icon + share banner are live and working, but shipped under their raw mobile-upload filenames because renaming wasn't possible from the phone. Tidy when convenient:

- **Rename** `IMG_4698.png` → `icon.png` (app icon) and `IMG_4689.png` → `og.png` (share/OG banner). Then update the three refs in `index.html` head (`apple-touch-icon`, PNG `favicon`, `og:image` + `twitter:image`) back to the clean names.
- **Downsize:** both are ~1+ MB straight off the phone. Target icon ~512x512 (<100KB) and banner 1200x630 (<200KB) so the OG unfurl loads fast and stays under budget.
- **Optional:** add a 192px PNG variant for best Android home-screen install fidelity, and confirm the banner is exactly 1200x630 (crop if the phone export drifted).

No rush: everything maps and renders as-is. This is polish, not a blocker.

### 🔄 Changed-event UI callout (“was X → now Y”)

When a refresh detects that an existing event materially shifted (rain delay, moved session, time change, cancellation), the UI should be able to surface that it changed — e.g. a small badge or strikethrough showing the old time/status next to the new. Requires: a data field on the event to carry the prior value + a change flag, and engine render support for it. This is why it's a BUILD item, not a routine: Routine Ricky is data-only and can't add fields or render logic. Expected to be rare, so low priority, but captured so a refresh agent that spots a shift has somewhere for it to eventually land. Until built, refresh agents just note the change in their run report.

## Known guardrails

- Data updates = commit `data.json` only, no engine bump.
- Brand asset refs live in the `index.html` head; keep the absolute Pages URL for og/twitter (relative paths don't unfurl).
- Data refreshes verify-and-merge (never blank-slate rebuild) and never shrink series coverage — see `routines/README.md` Data-Refresh Discipline.
