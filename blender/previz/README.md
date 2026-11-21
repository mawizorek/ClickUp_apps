# MAW Previz

Turns a Vectorworks MVR into a lit, camera'd Blender previz file that Eos (sACN) or the BlenderDMX Programmer can drive. Built and maintained by Scene Zed. Docs: [maw-prose/apps/maw-previs](https://github.com/mawizorek/maw-prose/blob/main/apps/maw-previs/index.md) (Lighting and Vectorworks Import pages).

## Current

- `maw_previz.py` **v0.5.1** · BUILT · rig-sync logic TESTED (`tests/test_sync.py`, 17/17) · camera pairing TESTED (`tests/test_cameras.py`, 9/9) · pure Python, not yet run in Blender
- `OPEN PREVIZ.command` · launcher · BUILT
- `vectorworks/vwx_dump_lighting_devices.py` **v0.1** · runs inside Vectorworks, read-only JSON of every lighting-device field · VERIFIED (Michael ran it on the SFANW plot and the inventory file, 2026-11-21)
- `vectorworks/vwx_dump_cameras.py` **v0.1** · runs inside Vectorworks, read-only JSON of named 3D loci · BUILT. Units and origin handling unconfirmed until one camera lands where it was drawn.

Status words: **BUILT** (written) → **TESTED** (Zed's automated checks pass) → **VERIFIED** (Michael's own Blender, screenshot or console). Only Michael's evidence makes anything VERIFIED.

Needs Blender 5.2.2 LTS and the BlenderDMX extension ("DMX", extensions.blender.org) 2.2.5, on macOS (Metal).

## The contract

- Vectorworks owns fixtures: type, position, patch.
- Vectorworks owns camera positions too (3D loci). Blender owns lenses' behaviour, world, render, animation.
- Never edit a fixture in Blender. The next sync puts it back to what Vectorworks says.
- One rig file: `<blend name>.mvr` beside the `.blend`, overwritten by every export. Never "the newest file in Downloads".

## Folder

```
MAW_PREVIS/_LIBRARY/SPAC_CHANNEL_CHECK/
    SPAC_CHANNEL_CHECK.blend           venue + previz
    SPAC_CHANNEL_CHECK.mvr             the rig (VWX export, same name, replace every time)
    SPAC_CHANNEL_CHECK.cameras.json    cameras (pulled in from the Desktop dump automatically)
    maw_previz.py
    OPEN PREVIZ.command
    previz_reports/                    one report per sync
```

The channel check is library-level (one of each inventory unit, used by every show), so it sits in `_LIBRARY`. Show previz files (`_SHOWS/<year>_<code>/previz_NN_<number>.blend`) need one shared show MVR instead of one per number: planned as `source/rig.mvr`, **not built**.

## One run, in order

1. Switch BlenderDMX on if it's off (it vanishes from the file when disabled).
2. Create the BlenderDMX show if missing.
3. **Sync the rig**
    - Pre-flight: reads the MVR with plain Python before Blender touches it.
    - Import: BlenderDMX `addMVR`, fixtures only, no focus points. Fixtures match by UUID, so a moved fixture updates in place.
    - Prune: removes any fixture Vectorworks doesn't have (deleted units, and the fake PAR BlenderDMX makes for a non-DMX unit).
    - Verify: every MVR fixture is in Blender, has geometry, uses its real GDTF, and is patched where Vectorworks says.
    - Result: PASS · CURRENT (same MVR, nothing to do) · BLOCKED · MISSING · FAIL.
4. Universes to cover the highest one patched (min 64).
5. Look: black void to the camera, **house ambient 5%** on every surface (a real house is never black: exits, spill, aisle lights), haze 0.02, Cycles. Ambient is a slider in the Previz tab.
6. Polish: Metal GPU, AgX Medium High Contrast, 256 samples + denoise, 1920×1080, clean overlays.
7. Cameras (below).
8. Lens angles from fixture names (`26deg` etc.), because the Lustr GDTFs all say 26°.
9. Lamp test (PASS/CURRENT only), Rendered view through the active camera. **No PASS = no lamp test = dark rig.** Read the RIG line first.
10. Embed a copy of the script in the `.blend`, save on PASS (previous kept as `.blend1`), write the report.

## Pre-flight rules

- **BLOCK** (nothing imports): a patched fixture whose GDTF isn't inside the MVR (BlenderDMX would silently swap in a generic PAR) · a mode the GDTF doesn't have · footprint overlap (channel count read from the GDTF mode, geometry-reference cells included) · a unit crossing a universe boundary · duplicate UUIDs.
- **SKIP**: no GDTF and no address = not a DMX unit (follow spots).
- **WARN**: no address · no Channel (Fixture ID), so Blender labels won't read as Eos channels · off the expected layer (`EXPECT_LAYER`).

## Previz tab (3D Viewport sidebar)

RIG status box (file, last sync, Sync rig / Force) · Set up previz · House ambient · Play (Programmer) / Eos (sACN) · Lamp test / All home · sACN status · one button per camera, by tier.

## Cameras

Rule (Milo, 2026-11-19): a camera lives in the file that owns its position. So Vectorworks places them.

- In Vectorworks, two **3D loci** per camera, named in Object Info: `CAM REP CENTER 35` (where the lens sits; trailing number = lens mm, default 35) and `AIM REP CENTER` (what it looks at).
- Layer decides the tier: `CAM VENUE` (venue file), `CAM SCENIC` (scenery file: SPAC seating moves), `CAM RENDER` (show framings). Layer elevation 0.
- Run `vectorworks/vwx_dump_cameras.py` inside Vectorworks. It writes `~/Desktop/maw_vwx_cameras.json`; the next Previz run copies it in as `<blend name>.cameras.json` and says so. A dump from a different Vectorworks file than last time is refused, not used.
- Vectorworks-owned cameras are re-placed on every run. Move them in Vectorworks, not Blender.
- Level cameras framed with Shift Y (verticals stay straight), clip end 300 m.
- **No camera file yet = GUESSED cameras** from the geometry's bounding box, marked GUESSED in the report. Placed once, never moved by a rerun. When Vectorworks cameras arrive, the guesses move to a hidden `CAM OLD GUESSES` collection (never deleted).

## Install a fresh copy

1. Copy `maw_previz.py` and `OPEN PREVIZ.command` into the folder with the `.blend`.
2. `chmod +x "OPEN PREVIZ.command"` (the repo can't store the executable bit). If macOS blocks it: right-click › Open › Open.
3. Double-click it.

## Tests

```
python3 tests/test_sync.py /path/to/SPAC_CHANNEL_CHECK.mvr
python3 tests/test_cameras.py
```

Proves the pre-flight, sync plan, verify and camera pairing logic. Doesn't prove BlenderDMX or Vectorworks run it.

## Not confirmed yet

- The BlenderDMX fixture fields read back for verify (`profile`, `dmx_breaks`) are read defensively. If the patch can't be read, verify adds a NOTE instead of failing.
- `addMVR` is synchronous: a big plot freezes the UI while it imports.
- Whether BlenderDMX rendering overwrites the lens angle set from names.
- Eos sACN into BlenderDMX on the same Mac (the extension lists permission "Files only").
- Camera dump: `GetLocus3D` coordinates are assumed relative to the user origin (CL × PL) and the layer at elevation 0.

History: [CHANGELOG.md](CHANGELOG.md)
