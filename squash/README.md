# Squash

Target-size image compressor. Define a byte cap, Squash compresses until the file fits, entirely in the browser. Nothing uploads anywhere.

### ▶︎ [**Launch the app →**](https://mawizorek.github.io/ClickUp_apps/squash/)

## Why it exists

"Save as smaller" does nothing to a PNG because PNG is lossless: re-encoding the same pixels returns the same bytes. Real reduction needs one of three levers: a lossy codec, fewer pixels, or a smaller color palette. Squash pulls all three toward a cap you define.

## What it does

- **Define a cap** in KB (presets for `icon 100` and `og 300`), pick an output format, hit Squash.
- **PNG in, PNG out, actually smaller.** For PNG output it reduces the color palette via median-cut quantization so DEFLATE packs it tighter. Transparency is preserved. It binary-searches the palette down until the file is under cap, then downscales only if it has to.
- **WebP / JPEG** go smaller still by binary-searching encoder quality. WebP keeps alpha; JPEG does not.
- **Max dimension** cap to force a pixel ceiling regardless of bytes.
- Before/after byte + dimension readout, live preview on a transparency checkerboard, one-tap download.

## How the cap is hit

1. Draw to canvas at current scale.
2. **PNG:** try full-color encode; if over cap, walk the palette down `256 → 4` colors, take the largest that fits.
3. **WebP/JPEG:** binary-search quality between 0.05 and 0.98 for the highest quality under cap.
4. If nothing fits at the current scale, downscale ×0.82 and retry (up to 9 steps).
5. If even the floor is over cap, return the smallest attempt and say so.

## Infrastructure

| File | Role | Update frequency |
|------|------|------------------|
| `index.html` | Self-contained app (engine + UI, no data file) | Version bumps |
| `icon.svg` | Vector favicon / PWA mark | Rare |
| `icon.png` | Raster home-screen tile (512²) | Rare |
| `og.png` | Social unfurl image (1200×630) | Rare |

No `data.json`: Squash has no living data, all logic is in the engine. Not a Routine Ricky app.

## Notes

- Runs fully client-side (canvas + `toBlob`). No network, works offline once loaded.
- The ClickUp artifact sandbox blocks file input; use the live Pages URL above for real uploads.
- Quantized PNG output stays a standard 32-bit PNG with a reduced color set (not indexed-mode); the byte win comes from better DEFLATE compression, not palette-mode headers.

## Version history

- **v1** — initial ship. Cap-targeting compressor with PNG palette quantization, WebP/JPEG quality search, max-dimension cap, downscale fallback.
