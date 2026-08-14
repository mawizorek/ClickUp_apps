# Audio Compressor — Next Build Spec

## Scratch
- Batch mode: queue multiple files, compress + zip download
- Drag-drop multiple files at once
- Waveform preview before/after

## Next build / Futures
- Presets tuned per use case ("voice memo", "podcast", "music") instead of raw bitrate/channel pickers
- Direct "send to transcription" handoff once compressed (skip the manual re-upload step)
- Support trimming silence before compression (further size cut for long recordings)

## In review
- (none yet)

## Shipped (v1)
- Single-file drop, bitrate select (32/64/96/128k), mono/stereo, download compressed MP3, fully client-side via ffmpeg.wasm
