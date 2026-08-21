# QR Forge

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/qr-forge/)

[![Launch](https://img.shields.io/badge/launch-QR%20Forge-f0b429?style=for-the-badge)](https://mawizorek.github.io/ClickUp_apps/qr-forge/)

**Status:** live · v1.0 · access `open`
**Source of truth:** this folder. `index.html` is the shell; the app is in `source/`.

## What it does

Generates static QR codes in the browser. The URL you type is encoded into the
module pattern itself, which is what "static" means and why these codes do not
expire: there is no shortener, no redirect service, no account and no server
anywhere in the chain. A scanner reads the bytes straight off the pattern.

That is the whole reason this exists. Every free QR service sells a *dynamic*
code, which encodes a short URL on *their* domain and redirects. It is a rented
link: it can be rate-limited, paywalled, taken over, or simply switched off, and
when it goes the printed code goes with it. A static code has no owner but you.

- **One code** — live preview on a paper swatch, ECC L/M/Q/H, quiet zone, mask
  override, vector SVG and raster PNG out, SVG markup to clipboard.
- **Batch sheet** — paste `Label | https://link` lines, get a labelled print
  sheet sized in millimetres plus a per-row SVG download. Built for inventory
  tags and form posters.
- **Print maths, not just pixels.** Set the physical width in mm and it reports
  the resulting module size and flags anything under 0.5 mm (marginal) or
  0.33 mm (below what phone cameras resolve). Also gives the rough scan-distance
  ceiling, which is about ten times the code's width.
- **Free error correction.** If the chosen version has spare room, the level is
  raised automatically. Same physical size, more damage survived.
- **Self test** in the settings drawer, checking the encoder against published
  values from the standard.

## How to use it

1. Paste the destination link. The code updates as you type.
2. Set the physical print width in mm. Watch the module-size readout.
3. Download the **SVG** for anything going to a printer or a laser cutter; it is
   resolution-free and carries real millimetre dimensions. PNG is for tools that
   will not take vector.
4. For many codes, switch to **Batch sheet** and open the print sheet. Print at
   100% — any scaling changes the module size, which is the number that decides
   whether it scans.

## Architecture

**The encoder is hand-written, not a library.** `source/qr-gf.js` and
`source/qr-core.js` implement ISO/IEC 18004 directly: GF(256) Reed-Solomon,
versions 1-40, byte mode over UTF-8, block interleaving, all eight mask patterns
with the four penalty rules, and both BCH strings (format and version). No CDN,
no npm, nothing that can 404 in three years. A tool built to remove third-party
dependence should not have one at its core.

**Non-obvious decisions, so nobody re-litigates them cold:**

- **Byte mode only.** Alphanumeric mode is denser but only covers uppercase and a
  short symbol set, so almost no real URL qualifies. The extra code path would
  save a version on a minority of inputs and be wrong on the rest.
- **ECC defaults to Q, not M.** These codes go on printed tags that get handled.
  Q tolerates ~25% loss against M's ~15%. Higher is not free: more modules in the
  same square means a smaller module, which is the actual scan-failure cause.
- **SVG emits one merged path, not thousands of rects.** Horizontal runs are
  merged per row. A version 10 code is ~3,000 dark modules; as individual
  rectangles the file is large and some printers render hairline seams between
  adjacent squares.
- **Print width is in millimetres and drives a warning.** Module size, not pixel
  count, decides whether a code scans. Every generator that only offers "size in
  px" is hiding the number that matters.
- **No theme-spine join in v1.** The app carries its own tokens with a labelled
  fallback floor rather than joining `shared/themes`. Deliberate: the join has
  two documented traps (`applyTheme()` takes a JOIN slug while `data-theme` takes
  a COLOR slug, and a blank vector cell applies a half theme in silence) and this
  build's correctness budget belonged to the encoder. A named seam, not an
  oversight — see `next-build-spec.md`.
- **Spacing tokens are always used with a `var()` fallback.** An unresolved bare
  `var()` invalidates the whole declaration and reverts padding to `0`, which is
  a live defect in `template-app`'s `--s1`…`--s8` ramp. Not inheriting it.
- **Access is `open`.** The gate mechanism ships and works, but the app holds and
  transmits nothing, and gating a tool used at a print station is friction with
  no payoff. Flip `config.json` to `gated` or `down` in a one-line commit.

**Known limits, stated plainly:**

- The self test cannot prove a physical scanner accepts the output. It proves the
  arithmetic, the two BCH strings and the placement/mask round trip. Pointing a
  phone at the screen is still the acceptance test.
- Byte mode only — no numeric, alphanumeric, kanji or ECI segments, and no
  structured append (multi-symbol) codes.
- Modular app, so Pages-hosted only. It does not run from `file://` and is not
  offline-capable.
- `og.png` and `icon.png` are referenced but not committed (binaries cannot go
  through the commit tool). Unfurls degrade to title + description; install falls
  back to `icon.svg`. Drop them through the GitHub UI when convenient.

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | Shell: head block, access gate, static markup, module loader | Version bumps |
| `source/build.js` | Version + PR stamp, single source | Every version |
| `source/qr-gf.js` | GF(256) + Reed-Solomon | Rarely; correctness-critical |
| `source/qr-core.js` | ISO/IEC 18004 encoder, tables, masking | Rarely; correctness-critical |
| `source/qr-render.js` | SVG, PNG canvas, print sheet | Feature changes |
| `source/qr-selftest.js` | Known-answer checks | When the encoder changes |
| `source/app.js` | Single-code view + shared chrome | Feature changes |
| `source/batch.js` | Batch parse, table, print sheet | Feature changes |
| `source/app.css` | All styling | Feature changes |
| `config.json` | 3-state access flag | One-line flips |

No `data.json`. There is no living data: the app computes everything from what
you type and stores nothing. Not a Routine Ricky app.

## Version history

Commit history is authoritative.

- **v1.0** — initial build. Hand-written ISO/IEC 18004 encoder, single + batch
  modes, SVG/PNG export, print sheet, mm-based module-size warnings, self test.

## Related

- Repo standards: Apps / HTML Artifacts, GitHub MCP Operating Standard.
- Next build: `next-build-spec.md`.

## Roadmap

See `next-build-spec.md`. The headline item is a self-hosted redirect layer, so a
code can be static *and* repointable without renting anyone's shortener.
