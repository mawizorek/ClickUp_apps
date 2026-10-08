# 3D Build Method · AI Toolkit

**Purpose:** Build 3D models from code with measured tooling, honest limits, and a verified preview, so no agent promises geometry the sandbox cannot make.

**Steward:** Vertex Vera.

**Mode:** Gated (fires conditionally).

**Invocation:** `/3d` · `/model` · "make a 3D model / STL / scale model / printable part" · any agent about to write mesh data.

**Trigger:** Any 3D model being created or edited, by any agent, whether or not Vera is seated.

**Front door: this file, and nothing else.** No ClickUp Skill. Tools live in git only (LOCKED 2026-07-25).

**Established 2026-10-08** by Vertex Vera's birth session (Felix + Mira).

---

## Coordinates

| Surface | Location |
| --- | --- |
| Measured toolchain | `super-agents/vertex-vera/memory.md` Ledger D (re-measure if stale) |
| Interactive viewer | ARTIFACT-CREATOR path (three.js HTML, dark theme) |
| Placement | `gates/repo-referent-gate.md` (by AUDIENCE) |

---

## Procedure

0. **Re-measure the toolchain** if Ledger D is not from today: one import test. Never claim a library from memory.
1. **Brief.** Purpose (visualize / print / web), units (mm unless told otherwise), overall dimensions, and for theatre models the SCALE (1:24, 1:25, 1:48). **Dimensions come from a cited source** (`department-head-base.md` §4 provenance line) or are labelled ASSUMED.
2. **Pick the build method that fits the ceiling:**
   - Primitives (box, cylinder, cone, sphere) composed in numpy.
   - **2.5D:** draw the profile with `shapely` (2D booleans work), then extrude. This is how holes, cutouts and brackets get made.
   - Lathe/revolve a profile for round forms; sweep along a path for rails and trim.
   - 🚫 **True 3D booleans are NOT available** (no mesh library, no CSG). If the form needs one, say so and propose the 2.5D route or a split into parts.
3. **Write the file by hand.** Binary STL for print, OBJ for general use and Vectorworks import, hand-written glTF/GLB JSON for web.
4. **Verify geometry.** Every edge shared by exactly two faces (watertight), consistent winding, no zero-area faces. **"Printable" is never claimed without this check passing.**
5. **Render and LOOK.** Four-angle PNG preview (matplotlib mplot3d) on a dark ground; optional three.js viewer artifact. Inspect before any verdict.
6. **Ship.** Model + previews, placed by audience; filename carries scale for theatre work (`<PROD>_<object>_1-24.stl`). One line to Ledger C.

---

## Guardrails

- 🚫 Not CAD. No parametric history, no tolerancing promise beyond the brief.
- 🚫 Never rate a part's strength or load capacity: Hawthorne / Gable.
- 🚫 Models are presentation, never construction documents: Randy.
- 🚫 Never claim a `.vwx`: Vale.
- Organic / sculpted forms are out of reach; say so up front.

---

## Composes with

- `hooks/svg-authoring-standard.md` (profiles start as SVG paths)
- `hooks/bench-build-method.md` (Pavel's enclosures)
- `gates/repo-referent-gate.md` · `hooks/commit-pre-flight.md`

---

## Changelog

- **v1 (2026-10-08)** — Established with Vertex Vera's birth. Toolchain measured same day. Generalized from ZERO live models; a cold session finding no Ledger C rows SAYS SO.
