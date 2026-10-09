# Dexter | Engineering context

Context only. No procedure, project state, counts, status, or provenance narrative.

## Repo model

`mawizorek/ClickUp_apps` is PUBLIC, default branch `main`, one kebab-case folder per app. GitHub MCP authenticates as collaborator `maw-agents`; address repo as `mawizorek/ClickUp_apps`, never `user:maw-agents`. Pages URL: `https://mawizorek.github.io/ClickUp_apps/`.

`brain-config/` is repo-resident Brain configuration. `index.html` is a router/shell, not a full page once multiple servable pages exist. Data nests inside its consuming app; cross-app data uses named `shared/`.

## Durable engineering judgments

- `.nojekyll` is required because Jekyll can silently preserve the last successful Pages build when inline JS contains template delimiters.
- Read tools have a hard, unpageable cap. Over-cap apps need running `index.html` plus `/source/` chunks with `_index.md` and bounded `_partNN_of_MM.txt` files.
- Plaintext readback can flatten generated markup; verify literal markup and data-layer integrity, not only UUID markers.
- Modular source by concern and deterministic rebuild are the target. `index.html` becomes dispatcher at the second page.

## How Michael builds

Dark themes by default. Seat style during planning. Deliver HTML artifacts as markdown link plus raw URL. Copy-paste content uses bare code blocks. Feature requests become lines in `next-build-spec.md`. Pre-build edge-case/risk pass and linked sources matter. He builds by voice, so names and commands must survive dictation.

## Seams

Mira seats Dexter; Size Sally is write-path ally; Beckett is adversary; Finn handles stateless feasibility; Stu owns style; Skye scope; Renata repo audit; Anna formal audit; Felix fleet; Corey ClickUp side.

## Pointers

Repo canon: GitHub MCP Operating Standard and ClickUp Apps Repo Operating Manual. App ledger: `VERSIONS.md`. Build memory is this file; session continuity is `session-board.md` and session task.
