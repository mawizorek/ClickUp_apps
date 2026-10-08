# SVG Authoring Standard · AI Toolkit

**Purpose:** Every SVG this fleet ships is hand-authored, scalable, themeable, and visually verified before anyone calls it done.

**Steward:** Vertex Vera.

**Mode:** Gated (fires conditionally).

**Invocation:** `/svg` · "make an icon / logo / diagram / svg" · any agent about to write SVG markup.

**Trigger:** Any SVG being created or materially edited, by any agent, whether or not Vera is seated.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-10-08** by Vertex Vera's birth session (Felix + Mira).

---

## Coordinates

| Surface | Location |
| --- | --- |
| Palette / theme tokens | `mawizorek/maw-themes` (read, never fork) |
| Render check | sandbox `cairosvg` (verified present 2026-10-08) |
| Placement | `gates/repo-referent-gate.md` (by AUDIENCE) |
| Taste + delivery log | `super-agents/vertex-vera/memory.md` Ledgers A–C |

---

## Procedure

1. **Brief in one line.** What it is, where it will be used, the size it must read at, light or dark ground. Missing size or ground = ask, do not guess.
2. **Concept (optional).** A raster concept from image generation may be used as a SKETCH. It is never shipped as the vector and never traced automatically.
3. **Author as text.** Write the markup directly. Required: `viewBox`, no fixed `width`/`height` unless the consumer needs it; a declared grid (24 for icons, 2px snap); `<title>` (+ `<desc>` for diagrams); ids prefixed with the asset slug.
4. **Color.** Icons use `currentColor`. Brand/art pieces use maw-themes tokens or hex values written into the brief. No color invented without saying so.
5. **Text.** Logos and wordmarks convert text to paths (no font dependency). Diagrams may keep live text on a system font stack.
6. **No cruft.** No embedded raster, no editor metadata, no `transform` stacks that could be baked, no unused `<defs>`.
7. **Render and LOOK.** Render PNG previews with `cairosvg` at 1× and 4×, on dark AND light grounds. Load the preview back and inspect it. **No verdict on a look that was not rendered.**
8. **Ship.** `.svg` + preview PNG, placed by audience. One line to Ledger C. Approval or rejection words go to Ledger A / B.

---

## Guardrails

- Render-before-claim is absolute.
- Never ship a third-party logo or trademark as if it were ours; flag it.
- 🔴 No student name, likeness or data in any asset bound for a repo or a public artifact.
- Michael's taste is learned from Ledgers A/B, never assumed from defaults.

---

## Composes with

- `hooks/3d-build-method.md` (sibling; extrusions start as SVG paths)
- `gates/repo-referent-gate.md` · `hooks/commit-pre-flight.md` · `hooks/secrets-pii-guard.md`
- Style Stu (taste review, seated by Mira)

---

## Changelog

- **v1 (2026-10-08)** — Established with Vertex Vera's birth. Generalized from ZERO live deliveries; a cold session finding no Ledger C rows SAYS SO.
