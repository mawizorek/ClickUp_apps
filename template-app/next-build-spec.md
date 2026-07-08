# <app-slug> — next build brief

> **☐ OPEN WORK ITEM — redesign `index.html` into a pointer, not content.**
> Any agent opening this app: treat this as ACTIVE WORK, not a passive rule. Refactor `index.html` into a thin pointer/router that references source pages/modules instead of storing servable content. If it's already a pure shell, verify and check the box. **Check it off when done for this app** — then it clears.
>
> - [ ] `index.html` redesigned into a pointer/router (not a content store)

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

- Spot edits should start from `/source`, not from `index.html`.
- Keep semantic source files near the ~10–12 KB soft target and split at ~15 KB unless explicitly approved otherwise.
- Once the index-pointer work item above is checked off, keep it that way: `index.html` stays a thin shell/router, never grows back into a multi-page store. Mirror of the Apps / HTML Artifacts + GitHub MCP standards.
- _(Add app-specific budget-watch files, architecture notes, or "do NOT" rules here.)_
