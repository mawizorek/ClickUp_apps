# Changelog · URITP musician set

## 2026-11-21 · performer straight from the repo
- `ZED_performer_from_repo.py` builds the performer inside Blender from `data/performer_manifest.json`. It needs no GLB and no scipy (PCHIP is reimplemented), and its geometry is identical to `source/performer.py`. It makes real quads + n-gon caps: 2,304 vertices, 2,080 faces, half the lines of the triangulated GLB.
- `render_smooth.py`: a preview with true smooth shading. The old flat-per-triangle preview made v4.3 look worse than it is.

## 2026-11-21 · performer v4.3 smooth
- Every part is now a loft: 16 sides, profile rows densified by PCHIP, quads, shared vertices, fan caps. Same skeleton, names and recipe.
- The exporter writes the performer as indexed meshes with smooth vertex normals, so Blender shades it smooth. Vertices drop from 5,328 to 2,336.
- `ZED_update_performer.py` replaces the v4.2-only script: one VERSION constant, the same in-place swap.
- Props are still flat hulls; the same loft pass is next.

## 2026-11-20 · performer v4.2 + repo home
- Feet re-carved. Their "up" now comes from the floor at rest, and a flat sole line measured on the rest skeleton puts the sole at z = 0. The heel sits under the shin, the instep covers the ankle, and the ankle cap is shortened. No floor shift needed.
- Added `ZED_update_performer_v4_2.py`, the in-place library update (swaps mesh shapes only).
- Moved here from loose ClickUp attachments. The rest skeleton is now JSON (it was a pickle).

## 2026-11-20 · library builder, blocking mover
- `ZED_build_library.py`: one asset collection per item, socket empties, one material set. First Blender run 11-20 21:20 confirmed 5.2.2 LTS and a saved library.
- `ZED_blocking_proxy.py`: a mover empty with a stand-in box; the swap contract is origin, facing, height and name.

## 2026-11-20 · props v5.0
- Panel pass (Stu, Elsa, Greer; one session). Every prop rebuilt in the performer's form language: waisted string outlines, house chair and stand, 7 ft grand with a hinged lid + bench. Values set by role.

## 2026-11-19 · performer v4.0 / v4.1
- Style E picked. v4.1 added blunt turned caps, a rounder head, flat-soled feet (since corrected in v4.2) and mitt hands.
