# z-themes — MOVED to /shared/themes

**This folder is retired.** The theme system was promoted from `filemaker/z-themes/` to **[`/shared/themes/`](../../shared/themes/)** on 2026-07-16 and made GLOBAL: one 17-token semantic contract shared by both ClickUp HTML apps and FileMaker layout renders.

- Standard + token contract: [`/shared/themes/README.md`](../../shared/themes/README.md)
- Gate: [`brain-config/gates/theme-contract-gate.md`](../../brain-config/gates/theme-contract-gate.md)
- Why it moved: cross-consumer assets live in `shared/`, never under one consumer (`filemaker/`).

The old FileMaker `cv-*` 10-key vocabulary was merged into the global 17-key contract; the mapping lives in `shared/themes/_index.json` (`fmpRoleMap`). Any render still pointing at `../../../../z-themes/resolve.js` needs re-pointing to `shared/themes/resolve.js` (or inlined tokens) — a known follow-up.
