# MAW Previz

Turns a Vectorworks MVR into a lit, camera'd Blender previz file that Eos (sACN) or the BlenderDMX Programmer can drive. Built and maintained by Scene Zed. Docs: [maw-prose/apps/maw-previs](https://github.com/mawizorek/maw-prose/blob/main/apps/maw-previs/index.md) (Lighting and Vectorworks Import pages).

## Current

- `maw_previz.py` **v0.5.0** · BUILT · rig-sync logic TESTED (`tests/test_sync.py`, 17/17, pure Python against the inventory MVR) · not yet run in Blender
- `OPEN PREVIZ.command` · launcher · BUILT
- `vectorworks/vwx_dump_lighting_devices.py` **v0.1** · runs inside Vectorworks, read-only JSON of every lighting-device field · VERIFIED (Michael ran it on the SFANW plot and the inventory file, 2026-11-21)

Status words: **BUILT** (written) → **TESTED** (Zed's automated checks pass) → **VERIFIED** (Michael's own Blender, screenshot or console). Only Michael's evidence makes anything VERIFIED.

Needs Blender 5.2.2 LTS and the BlenderDMX extension ("DMX", extensions.blender.org) 2.2.5, on macOS (Metal).

## The contract

- Vectorworks owns fixtures: type, position, patch.
- Blender owns cameras, world, render, animation.
- Never edit a fixture in Blender. The next sync puts it back to what Vectorworks says.
- One rig file: `<blend name>.mvr` beside the `.blend`, overwritten by every export. Never "the newest file in Downloads".

## Folder

```
MAW_PREVIS/_LIBRARY/SPAC_CHANNEL_CHECK/
    SPAC_CHANNEL_CHECK.blend    venue + previz
    SPAC_CHANNEL_CHECK.mvr      the rig (VWX export, same name, replace every time)
    maw_previz.py
    OPEN PREVIZ.command
    previz_reports/             one report per sync
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
5. Look: black world, haze 0.02, Cycles.
6. Polish: Metal GPU, AgX Medium High Contrast, 256 samples + denoise, 1920×1080, clean overlays.
7. Cameras in three tiers (below).
8. Lens angles from fixture names (`26deg` etc.), because the Lustr GDTFs all say 26°.
9. Lamp test (PASS/CURRENT only), Rendered view through the active camera.
10. Embed a copy of the script in the `.blend`, save on PASS (previous kept as `.blend1`), write the report.

## Pre-flight rules

- **BLOCK** (nothing imports): a patched fixture whose GDTF isn't inside the MVR (BlenderDMX would silently swap in a generic PAR) · a mode the GDTF doesn't have · footprint overlap (channel count read from the GDTF mode, geometry-reference cells included) · a unit crossing a universe boundary · duplicate UUIDs.
- **SKIP**: no GDTF and no address = not a DMX unit (follow spots).
- **WARN**: no address · no Channel (Fixture ID), so Blender labels won't read as Eos channels · off the expected layer (`EXPECT_LAYER`).

## Previz tab (3D Viewport sidebar)

RIG status box (file, last sync, Sync rig / Force) · Set up previz · Play (Programmer) / Eos (sACN) · Lamp test / All home · sACN status · one button per camera, by tier.

## Cameras

Rule (Milo, 2026-11-19): a camera lives in the file that owns its position.

- **VENUE**: OVERHEAD (ortho plan), REP CENTER, REP BACK
- **SCENIC**: SEAT HL, SEAT HR (audience seats move with the seating plan, so they belong to the scenery file)
- **RENDER**: RENDER WIDE, RIG
- Level cameras framed with Shift Y, clip end 300 m. Placed once, then never moved by a rerun. Delete one to have it re-placed.

## Install a fresh copy

1. Copy `maw_previz.py` and `OPEN PREVIZ.command` into the folder with the `.blend`.
2. `chmod +x "OPEN PREVIZ.command"` (the repo can't store the executable bit). If macOS blocks it: right-click › Open › Open.
3. Double-click it.

## Tests

```
python3 tests/test_sync.py /path/to/SPAC_CHANNEL_CHECK.mvr
```

Proves the pre-flight, sync plan and verify logic. Doesn't prove BlenderDMX runs it.

## Not confirmed yet

- The BlenderDMX fixture fields read back for verify (`profile`, `dmx_breaks`) are read defensively. If the patch can't be read, verify adds a NOTE instead of failing.
- `addMVR` is synchronous: a big plot freezes the UI while it imports.
- Whether BlenderDMX rendering overwrites the lens angle set from names.
- Eos sACN into BlenderDMX on the same Mac (the extension lists permission "Files only").

History: [CHANGELOG.md](CHANGELOG.md)
