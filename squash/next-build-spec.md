# Squash — next build spec

**Current: v1 (LIVE)**

Self-contained client-side image compressor targeting a user-defined byte cap. One `index.html`, no data file.

## Known guardrails

- Fully client-side: canvas `toBlob` + median-cut quantization. No network, no upload.
- Quantized PNG output is standard 32-bit PNG with a reduced color set; the win is DEFLATE compression, not indexed-mode. Do not claim true palette-PNG.
- ClickUp artifact sandbox blocks `<input type=file>`. Real use is the Pages URL only.
- Keep the single-file architecture unless a portal is genuinely needed; this is a small utility.

## Futures (not committed)

- True indexed 8-bit PNG encoder for a bigger byte win on flat art (needs a JS PNG writer; canvas can't emit indexed).
- Batch mode: multiple files against one cap, zip out.
- Optional Floyd–Steinberg dithering toggle for photographic PNGs at low palette counts.
- SVG raster-in support (rasterize at a chosen dimension before squashing).
- Standard app chrome fast-follow: 3-state access gate + `manifest.webmanifest` + PWA head block to match the locked app standard.
- Footer stamp currently reads `Squash v1` (direct-to-main, no PR number). Reconcile to `Squash vN · PR #<n>` on the first PR-based edit.

## In review

_(none)_

## Scratch intake

_(none)_
