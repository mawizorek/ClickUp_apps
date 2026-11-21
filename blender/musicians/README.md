# URITP musician set · CURRENT

This folder is the source of truth for the musician previz set: one sculptural performer plus the instrument and furniture props, built in code and brought into Blender with scripts. Current as of 2026-11-20.

## Current versions

- Performer **v4.2**: form language E "Brancusi" (one turned ovoid per bone), with the "scarecrow / tin man" read as the style test. Neutral standing rest, 1.768 m, 16 rigid parts. Each part's origin sits on its joint. v4.2 fixed the feet: they were rolled onto their edges, and the heel floated with an ankle peg showing. They now have flat soles on the floor and the heel sits under the shin.
- Props **v5.0**: violin + bow, guitar + footstool, cello + bow, NPS Melody chair, Manhasset stand, 7 ft grand (hinged lid object) + bench. Same form language as the performer. Each prop's origin is at its natural pivot, with named sockets for grips, rest points, the seat and the pedal.
- No rig yet. The rig builder is next (Scene Zed).

## Folder map

- `source/`: plain Python 3 (numpy + scipy). `performer.py` builds the performer from `data/performer_rest_skeleton.json`. `props.py` builds the props. `export.py` writes the GLBs into `dist/`.
- `blender/`: scripts for Blender 5.2.2 LTS, run from the Text Editor (Text > Open > Run Script).
- `data/`: the contracts. The rest skeleton, the performer manifest (part names, joints, form recipe) and the set manifest (props, sockets, materials).
- `build/` and `dist/` are generated and not committed. Neither are `.blend` files.

## Get the GLBs

Regenerate them: from this folder, run `python source/performer.py`, then `python source/props.py`, then `python source/export.py`. Output lands in `dist/`. The regenerated files were checked against the shipped ones: props are byte-identical, the performer is within 0.008 mm.

Or download the shipped files from ClickUp: the [set v5.0 ZIP](https://t36074068.p.clickup-attachments.com/t36074068/7b869878-8277-5de9-b9f6-618d1d0c5ae3/URITP_MusicianSet_v5_0.zip?view=open), which carries the v4.1 performer, plus the [performer v4.2 update ZIP](https://t36074068.p.clickup-attachments.com/t36074068/0732abee-6cb6-517b-8443-966d64720fac/PERF_v4_2_update.zip?view=open).

## Blender run order

1. `blender/ZED_build_library.py` in a NEW empty file. Builds and saves `URITP_Musicians_LIB_v5_1.blend`: one asset collection per item (`LIB_PERF_Performer`, `LIB_PROP_<Name>`) and socket empties. Runs once; never overwrites a save.
2. Already have the v5.0 library? Run `blender/ZED_update_performer_v4_2.py` inside it instead. It swaps only the performer's mesh shapes, so linked files get the new feet on reload. Then press Ctrl+S.
3. In a show file (for example the SPAC assembly): File > Link > the library > Collection > `LIB_PERF_Performer`.
4. `blender/ZED_blocking_proxy.py` creates the mover empty for blocking. Animate the mover, never the mesh. Parent the linked performer, or later the rig, to it.

## Contract (don't break it)

Units are meters, up is +Z, the performer faces -Y, and performer-left is +X. The origin sits on the floor between the feet. Part and object names (`PERF_<Part>`), joint positions and limb lengths stay fixed across mesh updates. Shape changes swap meshes in place, so the blocking and links survive.

## Decided

- Style E Brancusi. Michael, 11-19: "generic yet convincing shapes put together to make that persona."
- One performer for every instrument; playing postures are saved poses, not separate models.
- The house piano is about 7 ft (Model B size class, 211 × 148 cm, assumed until measured).
- Block with a mover now; swap in the rig later.

## Open

- Rig builder (IK, prop ownership switching, acceptance sequence): Scene Zed.
- Measure the real piano (make, model, size, lid heights).
- Style fit of the performer next to the SPAC scenery: Michael's call.

Owners: geometry by Vertex Vera; Blender scenes and scripts by Scene Zed. Session record: [vertical-slice handoff task](https://app.clickup.com/t/17tuucqxh17). Changes: `CHANGELOG.md`.
