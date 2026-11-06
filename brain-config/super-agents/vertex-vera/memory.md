# Vertex Vera · Craft Ledger

Michael's taste, rejections, measured tools, asset pointers. No procedure or copied assets.

## Ledger A Taste

Add approved asset: date · asset · landed palette/weight/style · quote if rule. Locked directions (asset not yet approved) are marked as such.

- 2026-11-05 · Becoming Curious bison (direction, asset not yet approved) · forelegs at "B · column" thickness, picked from v3 sturdy / column / tree-trunk options. Calibrated by v6/v7: in the 1536-wide composition, fore lower leg about 60px wide, hind about 50px at the fetlock.
- 2026-11-05 · Becoming Curious bison (direction) · hind legs slimmer than forelegs, rising out of the haunch, hock angled back.
- 2026-11-05 · Becoming Curious bison (direction) · big cowl/cape over the forelegs hiding most of them, its own group in front of the forelegs.
- 2026-11-05 · Becoming Curious bison (direction) · face is a crescent-moon shape, rounded, never a flat muzzle.
- 2026-11-05 · Becoming Curious bison (direction) · warm-white line #ECE4D2 on black projection, far parts dimmer #7E796D. Character: wise, calm, knowing. (Occlusion fills superseded 2026-11-06, see Ledger B.)
- 2026-11-05 · bison raster concepts (round 6) · "MUCH better. holy shit." Smooth confident contour line, high hump, low crescent head. Method rule: concept the silhouette in raster first, then hand-author.
- 2026-11-05 · bison composite pick (round 9) · front half of heavy S2 (three-tip cowl, head) + rear half of moderate S1 (hind legs rising up into the body, belly tuck/push-up before the hind leg). Stout, belly hangs low in front.
- 2026-11-05 · bison handoff (direction) · "literally the parts": one fore leg and one hind leg form (upper/lower/hoof), duplicated in the rig for near and far. No near/far art.
- 2026-11-06 · Blender handoff (direction, applies to all 2D rig art) · imports as Grease Pencil; Michael sets line thickness. Deliver centerline stroke paths only, fill none, pivot at SVG 0,0, one file per part.

## Ledger B Rejections

Add durable refusal + reason.

- 2026-11-05 · bison v1 · interior fur strokes, curls, mane strokes. "Way too much going on." Rule: minimal line, no fur texture.
- 2026-11-05 · bison v1 · beard. "What is this big muzzly beard thing?" Rule: no beard.
- 2026-11-05 · bison v1 · fussy multi-part head ("his head is all wanky"). Rule: head reads as one clean mass.
- 2026-11-05 · bison v1 + v2 · legs drawn to real anatomy, thin under the mass. "Why his legs so thin." Rule: stylized legs read as carrying the hump, never realistic-thin.
- 2026-11-05 · bison v2-v4 · flat or tapir-leaning muzzle. Rule: rounded crescent face.
- 2026-11-05 · bison v4 · straight post legs. "These just don't look like bison legs." Rule: taper, joint shape, hind hock reads bovine.
- 2026-11-05 · bison v1-v5 · drafting quality: geometric, primitive-built linework did not land. Rule: lock the silhouette as a raster concept before hand-authoring vector.
- 2026-11-05 · bison neck passes N1/N2 · "You overcomplicated the neck." Rule: don't build a separate neck/collar; head seats on the cowl as drawn in S2.
- 2026-11-05 · bison S2 rear half · "he looks like he has a potbelly." Rule: belly sags low in front, tucks up before the hind leg.
- 2026-11-05 · bison v6 · "the legs went wayyy to fat" (fore lower ~90px, hoof ~100px). Rule: match the approved concept's leg widths; don't overcorrect from an earlier too-thin note. Adjust in small steps.
- 2026-11-05 · bison v7 · head "still not sold." Specifics pending; Vera's read: tall round helmet, chin point edging toward goatee.
- 2026-11-05 · bison v7 Blender import · "went poorly" (details not given). Stroke + CSS SVGs are not a Blender handoff.
- 2026-11-06 · parts kit v1 · "i don't want the black fill in all of them ... you should give me paths, not real line." Rule: no occlusion fills by default; never outline strokes into filled shapes for rig art.

## Ledger C Delivered assets

Pointers only: date · asset · format · URL · project. All on ClickUp task MAW-2559.

- 2026-11-05 · bison-sketch-v1 + rig-parts-map-v1 · SVG + PNG · https://app.clickup.com/t/17tuucqu1e7 · Becoming Curious (rejected)
- 2026-11-05 · bison-sketch-v2 · SVG + PNG · https://app.clickup.com/t/17tuucqu1e7 · Becoming Curious (rejected)
- 2026-11-05 · bison-v3-leg-options · PNG · https://app.clickup.com/t/17tuucqu1e7 · Becoming Curious (B picked)
- 2026-11-05 · bison-sketch-v4 · SVG + PNG · https://app.clickup.com/t/17tuucqu1e7 · Becoming Curious (superseded)
- 2026-11-05 · bison-sketch-v5 · SVG + PNG · https://app.clickup.com/t/17tuucqu1e7 · Becoming Curious (superseded by v6)
- 2026-11-05 · bison raster concepts A/B/C, hybrids H1/H2, S1/S2, N1/N2 · PNG (concept only, never shipped as vector) · https://app.clickup.com/t/17tuucqu1e7 · Becoming Curious
- 2026-11-05 · bison-v6 (hand-authored from S2 front + S1 rear) + pivots overlay + near-foreleg Blender test file · SVG + PNG · https://app.clickup.com/t/17tuucqu1e7 · Becoming Curious (rejected: legs too fat)
- 2026-11-05 · bison-v7 / v7.1 + pivots + near-foreleg test file + code-rigged walk test MP4 · SVG + PNG + MP4 · https://app.clickup.com/t/17tuucqu1e7 · Becoming Curious (head not sold, Blender import poor)
- 2026-11-05 · bison parts kit v1 (filled outline shapes) · ZIP of SVGs · https://app.clickup.com/t/17tuucqu1e7 · Becoming Curious (rejected: fills, outlined line)
- 2026-11-06 · bison Grease Pencil kit v2 (centerline paths, no fill) · ZIP of SVGs · https://app.clickup.com/t/17tuucqu1e7 · Becoming Curious (verdict pending)

## Ledger D Measured tooling

Remeasured 2026-11-05; remeasure before relying.

- Present: `cairosvg`, `shapely`, `numpy`, `PIL`, `matplotlib` mplot3d, `ffmpeg`. SVG to PNG proven; frame-by-frame SVG rig render to MP4 proven 2026-11-05.
- Absent: binaries `blender`, `inkscape`, `rsvg-convert` (rechecked 2026-11-05). Blender import tests run on Michael's machine, not in sandbox. 2026-10-08 absent list (`trimesh`, `pygltflib`, `numpy-stl`, `open3d`, `pyvista`, `cadquery`, `solidpython`, `manifold3d`, `svgwrite`, `svgpathtools`, `scikit-image`, `openscad`) not rechecked.

## Ledger E inherited/unverified

- Dark themes default; palette tokens in `mawizorek/maw-themes`, not yet read.
