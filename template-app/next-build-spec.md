# template-app — next build spec (v1 shipped)

One file per app, overwritten each cycle. The version lives in this header, never in the filename.

## Scratch intake
- (raw ideas land here first)

## Next build
- (nothing queued)

## In review
- (active PR items)

## Futures
- Promote `chrome.js` to a shared partial (`shared/chrome/`) once a 2nd app adopts it, so chrome is single-sourced.
- Document an optional data-separated variant (`data.json` + fetch/localStorage cache) for apps with living data.
- Consider a build-time check that greps app folders for color literals and fails on a hit (mechanically enforces the token contract).

## Known guardrails
- `index.html` must stay a router shell. The instant it would store a servable page, add a `pages/` file instead.
- No color literals anywhere but the sanctioned drawer scrim. Unmet color needs → Theme Expansion Flag, never inline.
- Relative spine path only (`../shared/themes/…`); pages stay partials so the path lives in one place.
- Binaries (`og.png`, `icon.png`) are dropped via the GitHub UI, never committed through the file tool.
