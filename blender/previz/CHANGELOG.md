# MAW Previz changelog

All 2026-11-21/22, Scene Zed. Older builds survive as ClickUp attachments on the SFANW previz session task; this folder is the source of truth.

## 0.6.1 · no silent camera failures

Michael asked what fails if he forgets a name or a layer is off. Answer before this build: an off-layer camera silently became a VENUE camera, and a camera deleted in Vectorworks silently lingered in Blender. Both broke the Silent-Fallback Law. Now: only cameras and CAM/AIM loci on layers named `CAM ...` are read; others are ignored and named in the report (presentation cameras stay out). Unnamed cameras on a CAM layer are skipped with "name it". Duplicate names are reported. A VWX camera that disappears is parked in the hidden CAM OLD GUESSES and reported. Every camera gets a report line (tier, eye in metres, lens), flagged OUTSIDE the venue when it lands more than 2 m outside the venue bounds (the tell for a wrong user origin or a raised CAM layer). Dump v0.2.1 popup: named cameras on CAM layers, unnamed ones to fix, off-layer ones ignored. Tests 26/26 + 17/17.

## 0.6.0 · clean start, linked venue, Renderworks cameras

Michael wants to start over from a bare file, with cameras predetermined as Vectorworks camera objects. OPEN PREVIZ in a folder with no `.blend` now makes `<folder name>.blend` and builds everything. The venue comes from a Vectorworks FBX at `_LIBRARY/venue/SPAC_venue.fbx`: Previz builds `SPAC_venue.blend` from it (rebuilt when the FBX changes) and links its VENUE collection, so the channel check and every show share one room (Architecture: link, never append). The camera dump v0.2 reads Renderworks Camera objects (all fields kept for checking), alongside the v0.1 CAM/AIM loci. The direction a camera at rotation 0 looks (`CAM_ROT0`) is calibrated by the first real camera. Tests 21/21 + 17/17.

## 0.5.1 · Vectorworks cameras, house ambient

Michael: the cameras were "still pretty trash" and the world should sit at 5% "since it's impossible to get a real blackout anyways". Cameras guessed from a bounding box can't be right, so Vectorworks now places them: CAM/AIM 3D-locus pairs on CAM VENUE / SCENIC / RENDER layers, dumped by `vectorworks/vwx_dump_cameras.py`, pulled in as `<blend>.cameras.json` with an announced adopt. Guessed cameras stay as the fallback, marked GUESSED, and step aside into a hidden collection when real ones arrive. World: warm house ambient at 5% on every surface (Previz tab slider), black void to the camera. `tests/test_cameras.py` 9/9.

## 0.5.0 · rig sync

Replaces "import the newest .mvr in ~/Downloads". One rig file beside the blend, same name. Pre-flight before import (blocks a patched fixture missing its GDTF, overlaps, universe crossings, bad modes; skips non-DMX units). BlenderDMX `addMVR` instead of driving `addMVR_steps` by hand (which skipped the importer's own post-steps). Prune what VWX doesn't have. Verify every fixture against the MVR. PASS/CURRENT/BLOCKED/MISSING/FAIL report, saved to `previz_reports/`. Saves on PASS. Launcher `OPEN PREVIZ.command`. Script embeds itself in the blend.

Why: the first real import "verified" 21 fixtures, but one was a fake generic PAR that BlenderDMX made for the GDTF-less follow spot, and nothing checked.

## 0.4.2

Switches BlenderDMX on via `addon_utils` when it's disabled (a disabled extension removes `scene.dmx`, so the show and fixtures look gone).

## 0.4.1

Status messages, stale fixture records cleared before import.

## 0.4 · Previz

Renamed from Bench (Michael picked "Previz"; "Bench" meant nothing to him). Three-tier cameras from the 11-19 camera plan. Tab "Previz".

## Bench 0.1 to 0.3

First setup script: universes (BlenderDMX defaults to 0, so everything stayed dark), black world + haze, Cycles, lamp test from per-GDTF values, Play/Eos modes.

## Open before SFANW

Cameras come from one Vectorworks file per blend (a dump from a second file is refused). Route by layer instead: CAM VENUE to `_LIBRARY/venue/SPAC_venue.cameras.json` (shared by every SPAC file), CAM SCENIC and CAM RENDER to the show's own file.
