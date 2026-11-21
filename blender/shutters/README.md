# MAW Shutters

Framing shutters for Cycles spot lights: plain Blender spots or BlenderDMX fixtures. BlenderDMX does gobos and iris but has no framing shutters, so this fills the gap. Built and maintained by Scene Zed. Lighting docs: [maw-prose/apps/maw-previs/lighting.md](https://github.com/mawizorek/maw-prose/blob/main/apps/maw-previs/lighting.md).

## Current

- `maw_shutters.py` **v0.6** · BUILT. Pull from Vectorworks is new and untested in Blender.
- Last VERIFIED: v0.3.1, self-test 9/9 PASS on Blender 5.2.2 (Michael's console, 2026-11-21); the Shutters panel VERIFIED by his screenshot.
- `test_maw_shutters.py` · headless self-test, renders every case in Cycles and measures it.

Status words: BUILT → TESTED → VERIFIED. Only Michael's evidence makes anything VERIFIED.

## Lingo

Matches Vectorworks and Eos/Augment3d, never spec words ("Shaper" was renamed: not a lighting term).

- **Rotate** = Eos Frame Assembly
- **Top/A, Right/B, Bottom/C, Left/D**, each Depth % (100 = through centre, Eos Frame Thrust) and Angle ±45° (Eos Frame Angle, + = CCW)
- **Edge**: Barrel (0 = sharp in the middle, run IN or OUT to soften) + Frost (None, R132, R119, R114). Softens the cuts and the beam edge together, like a real ERS. Frost values are starting points, not calibrated.
- **Key Fade / Key Snap**: record the whole assembly as one look, like a cue. One "Shutters" row in the Dope Sheet. Snap keys show as red diamonds. Only the two segments touching a key change, so curves Michael shaped stay his.

## Use

1. Select one or more spot lights (for a BlenderDMX fixture, its spot light object).
2. Text Editor › Open `maw_shutters.py` › Run Script.
3. 3D Viewport sidebar › **Shutters** tab.
4. Render in Cycles. EEVEE ignores light node trees (same as BlenderDMX gobos).

Pull from Vectorworks: run `../previz/vectorworks/vwx_dump_lighting_devices.py` inside Vectorworks, then Shutters tab › Vectorworks › Pull from Vectorworks › pick the JSON. Matches devices to spots by position (MVR origin) and writes a "VWX pull report" text block.

## Self-test

```
/Applications/Blender.app/Contents/MacOS/Blender -b --factory-startup -P /path/to/blender/shutters/test_maw_shutters.py
```

Writes `maw_shutters_test/` beside the test: one PNG per case, `report.txt`, `test_scene.blend` (opens staged on the test spot). Drop a `maw_vwx_lighting_devices.json` beside it to dry-run the pull on a real plot.

## Next

- Drive the cuts from BlenderDMX fixture channels (Lonestar Standard mode `Blade1A`–`Blade4B` + `ShaperRot`) so Eos runs the shutters. Not built.
- Calibrate frost and barrel against a real unit; confirm the Vectorworks angle sign against a VWX render.
- Stays in-house until it has been played hard across a dozen of Michael's own shows. Only then offer it to BlenderDMX.

History is in the header of `maw_shutters.py` (v0.1 to v0.6, all 2026-11-21). Older zips survive as ClickUp attachments; this folder is the source of truth.
