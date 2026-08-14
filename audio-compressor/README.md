# Audio Compressor

**Status:** v1, live.

Single-file browser app that compresses audio (or strips + compresses audio from video) entirely client-side using ffmpeg.wasm. No upload, no server: pick bitrate + mono/stereo, hit compress, download the result.

Built to solve the "wav file too big to transcribe" problem: shrink a raw .wav locally before handing it to any 25MB-capped transcription tool.

- **Entry point:** `index.html` (self-contained, single view, no `/source` chunk set needed — under the 30KB cap)
- **Engine:** `@ffmpeg/ffmpeg` v0.12 + `@ffmpeg/core` v0.12.6 (single-threaded build), loaded from CDN at runtime
- **Output:** MP3 at selectable bitrate (32/64/96/128 kbps), mono or stereo

## Possible next steps
See `next-build-spec.md`.
