# MAW Previz changelog

All 2026-11-21, Scene Zed. Older builds survive as ClickUp attachments on the SFANW previz session task; this folder is the source of truth.

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
