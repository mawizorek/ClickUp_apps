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

## Futures

### 📱 Mobile front-page density (collapsible filter sections) — UNDER DISCUSSION

Front page has grown dense: hero + search + date/tz + 20 series chips + 15 platform chips stack before any actual schedule content (~2 screens of scroll on a phone). Michael is happy with button accessibility + clarity of scope and does NOT want to move far from the current model. Leading candidate: make SERIES and WHERE TO WATCH collapsible sections (collapsed by default on mobile) with an active-filter count badge on the collapsed header, so every chip stays one tap away and scope stays legible while the scroll wall disappears. Alternatives considered: bottom-sheet filter panel, single-row horizontal-scroll chip rows. Pending Michael's pick before it promotes to Next build.

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
