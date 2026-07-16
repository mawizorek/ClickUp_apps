# Theming Integration — RESOLVED (2026-07-16)

**This open handoff is closed. The theming standard it asked for now exists and is GLOBAL.**

Source of truth: **[`/shared/themes/`](../shared/themes/)** · standard: [`/shared/themes/README.md`](../shared/themes/README.md) · gate: [`brain-config/gates/theme-contract-gate.md`](../brain-config/gates/theme-contract-gate.md).

## What was decided

- **One global vocabulary for both consumers.** The two token sets (this doc's render tokens `--orange/--teal/...` and the FileMaker `cv-*` mirror) were merged into **one 17-key semantic contract** (`bg`, `surface-1/2/3`, `border`, `field`, `text`, `text-soft`, `text-faint`, `accent`, `accent-2`, `accent-soft`, `on-accent`, `good/warn/bad/info`). Bare `--name` custom properties, so an app just writes `var(--accent)`. Old `cv-*` roles map onto it via `fmpRoleMap` in `shared/themes/_index.json`.
- **Promoted out of `filemaker/`.** The system was FileMaker-scoped (`filemaker/z-themes/`); it now lives at `shared/themes/` because it is cross-consumer (ClickUp apps + FileMaker renders). The old `z-themes/` files were removed to keep a single home.
- **Delivery, resolved.** FileMaker renders are pure design mockups (never hosted), so they **inline** the resolved tokens at build time — not runtime fetch. ClickUp apps (hosted) resolve live via `resolve.js`. This supersedes the four-option menu below; option 1 (build-time inline) won for renders, live-resolve won for apps.

## Follow-ups (not blockers)

- The existing maw-budget renders referenced `../../../../z-themes/resolve.js`; that path moved to `shared/themes/`. Those one or two renders will be re-pointed/re-tokenized in a later pass (Michael OK'd breaking them temporarily to land the global setup first).
- `filemaker/LAYOUT-RENDER-STANDARD.md` DD-R06 still describes the old per-render token block; reconcile it to point at the global contract on the next FileMaker render pass.
