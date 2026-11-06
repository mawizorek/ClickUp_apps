# Hook: Blender 2D Line Animation

Owner: Armature Arlo. Technique for a rigged Grease Pencil character shown on a projection and cued from QLab. ⚠️ INHERITED and UNVERIFIED: written from the Becoming Curious bison session (Vertex Vera) and Blender/QLab documentation. Not yet run on Michael's Blender. Check each item against his version before teaching it as fact.

## Import and strokes

- Art arrives as centerline SVG paths, no fills, pivot at 0,0, one file per part. Import as Grease Pencil. Michael sets line thickness.
- One stroke per limb (a leg is one stroke, not upper plus lower) so lines stay joined when the limb bends.

## Rig and weights

- Armature with IK on legs and a pole target for knee/hock direction. Per-point vertex-group weights on the leg stroke, bone-to-bone blends at joints.
- The bison per-point weights JSON and weight map are attached to the bison task (memory Ledger C).
- Failure tell: hoof drift or a visible seam at a joint means a split stroke or unbalanced weights.

## Line boil

- Noise modifier on the Grease Pencil object, re-rolling every 3 frames. Confirm the exact field name in his version.
- Apply noise to lift height and body bob only. Never to a planted foot's X.
- Because it re-rolls every 3 frames, every slice length is a multiple of 3 so loops and cuts land on a re-roll boundary.

## Minimal-key walk

- Key one in-place cycle starting at frame 0 (84 frames at the bison's pace). Put it on an NLA strip with Animated Strip Time and Cyclic Strip Time on. Use Cyclic Strip Time, not Shift+E Make Cyclic.
- A custom property `phase` drives strip time. A driver sets root X from `phase` times stride over cycle length.
- 2 to 4 keys on `phase` give start, stop, hitch.
- Overlap: copy the body-bob curve onto cowl and tail a few frames later.
- Bake Action when the motion is approved.

## Camera and render

- Orthographic camera, no lights, black background, EEVEE, View Transform Standard. Line colour #ECE4D2 (far parts dimmer #7E796D).
- Output ProRes 422 or Hap. No alpha unless layering.

## QLab hand-off

- QLab 5. One rendered movie, cut into slices: walk-on, hold A (loop), look, hold B (loop), walk-off.
- Devamp cues release the looping holds. A Devamp waits for the end of the current loop, so keep holds short.
- Every slice boundary matches one stand pose with all four hooves planted. Slow walks use a high duty factor (about 80%) so a quad-support moment exists for the stop pose.
- Hand the playback owner a slice table (name, start frame, end frame, loop or not). Do not author cues.
