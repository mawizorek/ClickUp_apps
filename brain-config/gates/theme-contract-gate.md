# Theme Contract Gate (FOUNDATIONAL, LOCKED 2026-07-16)

**Fires on:** any turn that builds, renders, or edits a ClickUp HTML app OR a FileMaker layout render OR their documentation. This is a foundational build gate, same tier as the source-size budget: check it before you write, not after you ship.

**Source of truth for the system:** [`/shared/themes/README.md`](../../shared/themes/README.md).

---

## The rule

**Color comes from a shared theme, never from ad-hoc inline values.** Every app and every render references an existing theme **slug** from `/shared/themes/`. There is one global token contract (17 semantic keys: `bg`, `surface-1/2/3`, `border`, `field`, `text`, `text-soft`, `text-faint`, `accent`, `accent-2`, `accent-soft`, `on-accent`, `good`, `warn`, `bad`, `info`). Both consumers use the same vocabulary.

- **Never hardcode a hex/oklch color** for a role a token already covers. Write `var(--accent)`, not a literal. Structural one-offs (a shadow alpha) are the only tolerated inline color, and even those should migrate to tokens when a pattern emerges.
- **Never invent a per-app theme inline.** If a needed color role doesn't exist, that's a contract change (new token → bump `schemaVersion` in `_index.json`), not an inline override.
- **Never rename or drop the 17 keys.** Semantic names only (`--accent`, never `--f1-red`), so reskinning is a value swap.

## How to comply per consumer

- **ClickUp HTML app (Pages-hosted):** link `/shared/themes/resolve.js` and call `THEMES.apply('<slug>')`, or link `themes.css` + set `data-theme="<slug>"`. Reskins live; no rebuild to change theme.
- **FileMaker layout render (local design mockup, never hosted):** inline the resolved 17 tokens into the render's `:root` at build time. Runtime fetch is the wrong path here (these open from a local filesystem). `resolve.js` is the reference for the values.

## Headline rule for the FileMaker render space (LOCKED)

**FileMaker layout renders in this repo are design mockups and build tools ONLY, never production/hosted assets.** They exist to articulate how a native FileMaker layout should look and behave, so Michael can build it natively in FileMaker (native work planned end-of-year). Web viewing is NOT on the table. An agent entering `filemaker/` is building a *design tool*, not web content.

- No live data, no fetches, no hosting. Michael supplies real placeholder text/fields during the native build.
- The render's job is communication: layout, hierarchy, theming, and object behavior. Encouraged: build-time affordances that speed the native build, e.g. a hover-over inspector on an object that surfaces its theme role + intended field definition ("surface-1 chrome · pulls Race.Winner"). That is build documentation, not app behavior.
- These are the same *kind* of artifact as ClickUp apps (HTML) and theme the same way; they differ only in purpose (documentation vs running product) and delivery (tokens inlined, never fetched).

## Fail-loud

Unknown slug → hard fail with a visible banner, never a silent unstyled render. Stub or missing key → `_base` spine → ultimate fallback (`maw-dark-utility`). See the fallback trail in the shared README.

## Version note

Contract is **v1**. It will evolve as ClickUp-app and FileMaker requirements diverge; treat the token list as a living contract, not frozen. Changes go through `_index.json` (`schemaVersion`) + a regen of `themes.css`, never through per-consumer drift.
