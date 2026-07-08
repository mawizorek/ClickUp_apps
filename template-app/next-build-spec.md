# <app-slug> — next build brief

## Source location

- Runtime app: `<app-slug>/index.html`
- Runtime data: `<app-slug>/data.json` _(if applicable)_
- Preferred edit surface: `<app-slug>/source/`
- Current live version: `v[N]`

## Scratch intake

_Raw feature ideas, Michael's freeform notes, and unprocessed requests land here. Promote to Next build or Futures once scoped._

- _Empty._

## Next build

_The active build target. Full spec: what to change, why, acceptance criteria, agent instructions. When this ships, clear it and promote the next item from Futures._

- _Empty._

## In review

_Active PRs or iterations being tested/reviewed before merge._

- _Empty._

## Futures

_Queued features with enough detail for sequencing and cold-pickup. Promote to Next build when the current cycle ships._

- _Empty._ Queue the next feature idea only after a new scoped build is chosen.

## Known guardrails

_Standing constraints for this app that every build must respect._

- **Index = pointer, not a store (LOCKED 2026-07-08).** `index.html` must stay a thin shell/router that references source pages; the instant a second servable page/view exists it becomes the dispatcher (real pages = their own named files, default landing = a one-line constant it can repoint without a rebuild). Never grow `index.html` into a multi-page store. Mirror of the Apps / HTML Artifacts + GitHub MCP standards.
- Spot edits should start from `/source`, not from `index.html`.
- Keep semantic source files near the ~10–12 KB soft target and split at ~15 KB unless explicitly approved otherwise.
- _(Add app-specific budget-watch files, architecture notes, or "do NOT" rules here.)_
