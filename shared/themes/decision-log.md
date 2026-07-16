# Decision Log — Theming

Append-only record of decisions made in the theming space (`shared/themes/`). Newest at top. One decision per entry. Keep it generic and easy to parse: an agent entering this space should read this file to learn *why* things are the way they are, without digging through chat history.

> **Repo-wide convention:** a `decision-log.md` lives at the top of any area we make real decisions in (theme folder, each FileMaker app, each ClickUp app, brain-config, etc.). It records DECISIONS, not changelog (git history is the changelog) and not open work (`open-thread.md` / `next-build-spec.md` own that). When you enter an area with a `decision-log.md`, read it first; when you make or reverse a decision there, append an entry before you finish. Same entry shape everywhere.

**Entry shape:**
```
## YYYY-MM-DD · <short title>
**Decision:** <what was decided, one or two lines>
**Why:** <the reasoning / what problem it solves>
**Status:** locked | provisional | superseded
**Supersedes:** <prior entry, if any>
```

---

## 2026-07-16 · 20-object coverage is the theme acceptance test
**Decision:** A theme is only "done" when it styles all 20 canonical FileMaker objects with no token fallback (17/17). `preview.html` is the theme × object gallery that proves it; `OBJECT-COVERAGE.md` is the contract.
**Why:** Guarantees every object has a defined style in every theme AND forces every theme to define all 17 tokens. Ties the object system and the token system together so neither can drift.
**Status:** locked

## 2026-07-16 · One shared token vocabulary for both consumers
**Decision:** ClickUp HTML apps and FileMaker layout renders share ONE 17-key semantic token contract (`bg`, `surface-1/2/3`, `border`, `field`, `text`, `text-soft`, `text-faint`, `accent`, `accent-2`, `accent-soft`, `on-accent`, `good/warn/bad/info`). Bare `--name` custom properties. Old FileMaker `cv-*` 10-key vocab merged in via `fmpRoleMap`.
**Why:** Michael's call: don't recreate colors every time. One vocabulary means an app and a render theme identically, and "switch F1 to gray + red" is a value change, not a rename. Semantic names, never literal (`--accent`, never `--f1-red`).
**Status:** locked

## 2026-07-16 · Theme system is GLOBAL, lives in `shared/themes/`
**Decision:** Promoted the theme system out of `filemaker/z-themes/` up to `shared/themes/`. Old folder retired to a MOVED pointer; duplicates deleted.
**Why:** The system serves both ClickUp apps and FileMaker renders, so it's cross-consumer. Repo layout rule: cross-consumer assets live in `shared/`, never nested under one consumer (`filemaker/`).
**Status:** locked
**Supersedes:** the FileMaker-scoped `z-themes` location.

## 2026-07-16 · Delivery differs by consumer (resolve live vs inline)
**Decision:** ClickUp apps (hosted) resolve themes live via `resolve.js` and reskin without a rebuild. FileMaker renders inline the resolved 17 tokens at build time — no runtime fetch.
**Why:** FileMaker renders are local design mockups opened from a filesystem, never hosted, so a runtime `fetch()` is the wrong path for them. Hosted apps get live reskin; local mockups get baked tokens. Same vocabulary, different plumbing.
**Status:** locked
**Supersedes:** the earlier four-option integration menu in `filemaker/THEMING-INTEGRATION.md` (now RESOLVED).

## 2026-07-16 · FileMaker renders are design mockups ONLY
**Decision:** Everything under `filemaker/` is a design mockup / build tool, never a production or hosted asset. Web viewing is off the table. Renders articulate how a NATIVE FileMaker layout should look/behave (Michael builds native end-of-year).
**Why:** Removes the whole web-viewer/OKLCH-fallback problem class — these aren't web content. Their job is communication (layout, hierarchy, theming, object behavior), and build-time affordances that speed the native build are encouraged. Enforced by `brain-config/gates/theme-contract-gate.md`.
**Status:** locked

## 2026-07-16 · No ad-hoc inline color; reference a slug
**Decision:** Every app and every render references an existing theme slug from `shared/themes/`. No hardcoded hex/oklch for a role a token covers; no per-app inline themes. A needed-but-missing role is a contract change (new token + `schemaVersion` bump), not an inline override.
**Why:** Colors in one place = reskin without re-rendering, which is the entire point of the system. Enforced by the theme-contract gate.
**Status:** locked

## 2026-07-16 · F1 constructor grid is the first theme batch
**Decision:** Seed set is `maw-dark-utility` (anchor + ultimate fallback) plus the full 2026 F1 constructor grid (11 themes: mclaren, ferrari, mercedes, red-bull, alpine, aston-martin, audi, cadillac dark; haas, racing-bulls, williams light).
**Why:** F1 is Michael's chosen proving ground and gives a wide, opinionated color range (dark + light, warm + cool) that stress-tests whether one object system can carry clearly distinct brands. All shipped with real OKLCH tokens, not stubs.
**Status:** locked
