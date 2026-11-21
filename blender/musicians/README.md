# URITP musician set · CURRENT

This folder is the source of truth for the musician previz set: one sculptural performer plus the instrument and furniture props, built in code and brought into Blender with scripts. Current as of 2026-11-21.

## Current versions

- Performer **v4.3**: form language E "Brancusi" (one turned ovoid per bone), with the "scarecrow / tin man" read as the style test. Neutral standing rest, 1.768 m, 16 rigid parts. Each part's origin sits on its joint. v4.3 makes every part a clean loft (rings of quads, shared vertices, smooth normals), so Blender shades it smooth instead of showing every facet. It has 2,336 vertices; v4.2 had 5,328, because each of its triangles carried its own copies. v4.2's feet (flat sole, heel under the shin) carry over.
- Props **v5.0** (still flat-faceted; the smooth loft pass comes next): violin + bow, guitar + footstool, cello + bow, NPS Melody chair, Manhasset stand, 7 ft grand (hinged lid object) + bench. Same form language as the performer. Each prop's origin is at its natural pivot, with named sockets for grips, rest points, the seat and the pedal.
- No rig yet. The rig builder is next (Scene Zed).

## Folder map

- `source/`: plain Python 3 (numpy + scipy). `performer.py` builds the performer from `data/performer_rest_skeleton.json`. `props.py` builds the props. `export.py` writes the GLBs into `dist/`. `render_smooth.py` makes smooth-shaded preview images.
- `blender/`: scripts for Blender 5.2.2 LTS, run from the Text Editor (Text > Open > Run Script).
- `data/`: the contracts. The rest skeleton, the performer manifest (part names, joints, form recipe) and the set manifest (props, sockets, materials).
- `build/` and `dist/` are generated and not committed. Neither are `.blend` files.

## Get the GLBs

Regenerate them: from this folder, run `python source/performer.py`, then `python source/props.py`, then `python source/export.py`. Output lands in `dist/`. The regenerated props were checked byte-identical to the shipped v5.0 files.

Easiest on a new machine: the [starter kit ZIP](https://t36074068.p.clickup-attachments.com/t36074068/299907ee-279c-535d-99b6-2bc8d3e197e7/URITP_musicians_starter_kit.zip?view=open) is this folder plus a ready-built `dist/` (performer v4.3 + props v5.0). Or download the older shipped files from ClickUp: the [set v5.0 ZIP](https://t36074068.p.clickup-attachments.com/t36074068/7b869878-8277-5de9-b9f6-618d1d0c5ae3/URITP_MusicianSet_v5_0.zip?view=open) (props; it carries the old v4.1 performer) plus the [performer v4.3 update ZIP](https://t36074068.p.clickup-attachments.com/t36074068/dfef8544-6d18-56b5-976e-2883cef1a281/PERF_v4_3_update.zip?view=open).

## Blender run order

**Fastest path for the performer (no GLB, no Python setup):** pull the repo, open your musician library .blend, and run `blender/ZED_performer_from_repo.py`. It reads `data/performer_manifest.json` and builds or updates the 16 parts natively in Blender: real quads with end caps (2,304 vertices, 2,080 faces), smooth shaded, sharp only at the cap rims. It matches `source/performer.py` exactly. A pop-up reports the result. Then press Ctrl+S.

1. `blender/ZED_build_library.py` in a NEW empty file. Builds one asset collection per item (`LIB_PERF_Performer`, `LIB_PROP_<Name>`) plus socket empties, then saves `musicians.blend` into `MAW_PREVIS/_LIBRARY/figures/` (create that folder first; it is found in your home, Documents or Desktop). The name stays stable because show files link by path. Runs once; never overwrites a save; a pop-up reports the result. Then register `MAW_PREVIS/_LIBRARY` in Preferences > File Paths > Asset Libraries with Import Method: Link.
2. GLB route: already have a library file? Run `blender/ZED_update_performer.py` inside it instead. It swaps only the performer's mesh shapes, so linked files pick up the change on reload; a pop-up reports the result. Then press Ctrl+S.
3. In a show file (for example the SPAC assembly): File > Link > the library > Collection > `LIB_PERF_Performer`.
4. `blender/ZED_blocking_proxy.py` creates the mover empty for blocking. Animate the mover, never the mesh. Parent the linked performer, or later the rig, to it.

## Contract (don't break it)

Units are meters, up is +Z, the performer faces -Y, and performer-left is +X. The origin sits on the floor between the feet. Part and object names (`PERF_<Part>`), joint positions and limb lengths stay fixed across mesh updates. Shape changes swap meshes in place, so the blocking and links survive.

## Decided

- Style E Brancusi. Michael, 11-19: "generic yet convincing shapes put together to make that persona."
- One performer for every instrument; playing postures are saved poses, not separate models.
- The house piano is about 7 ft (Model B size class, 211 × 148 cm, assumed until measured).
- Block with a mover now; swap in the rig later.
- Parts are smooth-shaded lofts, not flat facets (Michael, 11-21: fewer visible vertex lines).

## Open

- Rig builder (IK, prop ownership switching, acceptance sequence): Scene Zed.
- Measure the real piano (make, model, size, lid heights).
- Style fit of the performer next to the SPAC scenery: Michael's call.

Owners: geometry by Vertex Vera; Blender scenes and scripts by Scene Zed. Session record: [vertical-slice handoff task](https://app.clickup.com/t/17tuucqxh17). Changes: `CHANGELOG.md`.
