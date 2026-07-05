# On Track — Next Build Spec

One file per app, overwritten each version cycle. Current shipped: **v1.8**.

## Next build

_(nothing committed yet)_

## Recently shipped

- **v1.8** — architecture refactor to multi-file (thin shell + `source/{styles.css,render.js,app.js}`). Export re-inlines source at runtime so downloads stay self-contained. Retired the 30KB chunk dance; source is now directly agent-readable.
- **v1.7** — sticky-hover chip-border fix (all `:hover` behind `@media (hover: hover)`) + collapsible filter sections with live count badges (mobile density, Option 1 from the density render).

## Futures

### 🧹 Brand-asset cleanup (soft, not urgent)

The icon + share banner are live and working, but shipped under their raw mobile-upload filenames because renaming wasn't possible from the phone. Tidy when convenient:

- **Rename** `IMG_4698.png` → `icon.png` (app icon) and `IMG_4689.png` → `og.png` (share/OG banner). Then update the three refs in `index.html` head (`apple-touch-icon`, PNG `favicon`, `og:image` + `twitter:image`) back to the clean names.
- **Downsize:** both are ~1+ MB straight off the phone. Target icon ~512x512 (<100KB) and banner 1200x630 (<200KB) so the OG unfurl loads fast and stays under budget.
- **Optional:** add a 192px PNG variant for best Android home-screen install fidelity, and confirm the banner is exactly 1200x630 (crop if the phone export drifted).

No rush: everything maps and renders as-is. This is polish, not a blocker.

### 🔄 Changed-event UI callout (“was X → now Y”)

When a refresh detects that an existing event materially shifted (rain delay, moved session, time change, cancellation), the UI should be able to surface that it changed — e.g. a small badge or strikethrough showing the old time/status next to the new. Requires: a data field on the event to carry the prior value + a change flag, and engine render support for it. Build item, not a routine (data-only agents can't add fields or render logic). Rare, low priority.

## Known guardrails

- **Multi-file now.** Engine edits = edit the relevant `source/*` file (reads whole under the cap) + bump `APP_VERSION` in `source/render.js`. NEVER recombine into a single monolith `index.html`.
- Data updates = commit `data.json` only, no engine bump.
- The self-contained export in `app.js` (`buildSelfContained`) must keep re-inlining every source file + current `DATA`; if you add a new `source/*` file, add it to that inliner or downloads break.
- Brand asset refs live in the `index.html` head; keep the absolute Pages URL for og/twitter (relative paths don't unfurl).
- Data refreshes verify-and-merge (never blank-slate rebuild) and never shrink series coverage — see `routines/README.md` Data-Refresh Discipline.
