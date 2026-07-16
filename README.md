# ClickUp_apps

Home of Michael Wizorek's HTML apps (GitHub Pages), FileMaker layout renders, brain-config tooling, and quickfire artifacts. **If you are an agent entering this repo, read this file first, then the standard for whatever you're touching.**

---

## 🎨 THEMING BACKBONE (read before designing ANYTHING)

**Every visual thing built in this repo — ClickUp HTML apps, FileMaker layout renders, standalone artifacts, quickfire pages, any layout — draws its colors from the GLOBAL theme system at [`shared/themes/`](./shared/themes/). Do NOT invent a palette, hardcode colors, or roll your own theme.**

This is a standing law, not a per-project choice. One 17-token semantic contract (`bg`, `surface-1/2/3`, `border`, `field`, `text`, `text-soft`, `text-faint`, `accent`, `accent-2`, `accent-soft`, `on-accent`, `good/warn/bad/info`) skins the whole ecosystem. Reference a theme **slug**; the tokens do the rest.

- **Default to `default-theme` unless told otherwise.** New apps/renders point at the `default-theme` slug (a deliberately grayscale, clearly-unskinned placeholder) unless Michael names a theme or there's an intentional reason to diverge (a stated brand, an obvious fit). If it's still gray, it hasn't been themed yet — swapping is a one-line slug change.
- **What you do:** write `var(--accent)`, `var(--surface-1)`, `var(--text)`, etc. Pick a theme by slug. Never write a literal hex/oklch for a role a token already covers.
- **Need a color that doesn't exist as a role?** That's a contract change (new token + `schemaVersion` bump in `shared/themes/_index.json`), never a one-off inline override.
- **Need a new look?** Add a theme, don't hardcode one. Copy `shared/themes/_template.json`, fill the 17 tokens, register one line, regenerate. See the [theme README](./shared/themes/README.md) → "Adding a theme."
- **Enforced by** [`brain-config/gates/theme-contract-gate.md`](./brain-config/gates/theme-contract-gate.md) — the foundational build gate that fires on any app/render/doc build.

**The point:** change one theme file and every app and render that references it reskins in harmony, with zero rebuilds. Rolling your own colors breaks that, guarantees drift, and will get flagged. When in doubt, use `default-theme` and let Michael pick the real one.

---

## What's here (orientation for a cold agent)

| Path | What it is | Standard to read |
|---|---|---|
| `shared/themes/` | **The global theme system.** Token contract, themes, the theme × object gallery. Default pointer = `default-theme`. | `shared/themes/README.md` |
| `shared/` | Cross-consumer assets (used by more than one app). Never nest these under one app. | — |
| `<app-slug>/` | A ClickUp HTML app (`index.html` = the app, live on Pages). | its `README.md` |
| `filemaker/` | **Design mockups / build tools ONLY**, never hosted. Articulate how a native FileMaker layout should look. | `filemaker/README.md` |
| `quickfire/` | Fast one-off artifacts, indexed by `quickfire/manifest.json`. | — |
| `brain-config/` | Agent tooling: hooks, gates, subagent profiles, session board. | `brain-config/README.md` |
| `VERSIONS.md` | The version ledger — the tiebreaker against stale reads. Check before opening an app PR. | — |

## Working conventions (the short list)

- **`.nojekyll` at root is load-bearing** — never delete it (Pages serves files verbatim; Jekyll would break inline-JS HTML).
- **All changes go branch → PR → self-merge**, then report. Never commit direct to `main`. Full rule in the GitHub MCP Operating Standard (ClickUp).
- **Read file bodies via the git blob API / raw URL**, never trust `get_file_contents` for a body (it returns metadata only). Re-fetch fresh before any decision or write.
- **`decision-log.md` convention:** many areas carry one (theming has the reference implementation). Read it on entering an area; append an entry when you make or reverse a decision. See `brain-config/hooks/decision-log.md`.
- **Sub-~12KB modular files**, no monoliths; `index.html` trends toward a slim shell.

## Live

Apps serve at `https://mawizorek.github.io/ClickUp_apps/<app-slug>/`. The theme × object gallery (opens on `default-theme`, pick any theme, watch 20 canonical objects reskin) is at [`shared/themes/preview.html`](https://mawizorek.github.io/ClickUp_apps/shared/themes/preview.html).
