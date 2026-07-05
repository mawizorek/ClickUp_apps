# On Track — Next Build Spec

One file per app, overwritten each version cycle. Current shipped: **v1.6**.

## Next build

_(nothing committed yet)_

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
