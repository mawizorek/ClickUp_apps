---
id: blender-3d-craft-method
name: Blender 3D Craft Method
shelf: hooks
kind: method
trigger: Building or coaching a Blender 3D rig, show-file scene assembly, prop handoffs, or any Blender-side Python builder.
nicknames: [3D craft method, Zed's method]
owner: Scene Zed (stewards edits)
added: 2026-11-19
version: 1
---

# Blender 3D Craft Method (🪝 Hook)

The procedure for Blender **3D** work: rigid-part rigs, prop ownership, builder discipline, and the library/override split. Seeded from the musician-rig Workshop review (ADJUST, 2026-11-19) and the next-build specification, so none of it is invented here.

🚫 **Not this hook:** coaching posture (`blender-coaching-method.md`, shared with Armature Arlo) · 2D line animation and Grease Pencil (`blender-2d-line-animation.md`) · geometry authoring (Vertex Vera) · Vectorworks and dimensional authority (Vector Vale) · the version-dependent VWX↔Blender claims (the "Blender + Vectorworks Previz — Working Reference" page, stewarded by Vale).

---

## 1. Runtime truth

Nothing worked until Michael's screenshot, console output or saved file says it did. Record the exact Blender version every step assumes, and ask for it rather than carrying it from another seat's file. A static check, a code-drawn preview, or a successful export is **evidence of shape, never evidence of runtime**.

## 2. Builder standard

1. **Add, never destroy.** No implicit directory or object deletion, ever. Cleanup is an explicit, visible command.
2. **Versioned output.** A rerun writes to a new versioned target or a disposable collection and leaves prior source and output intact.
3. **Refuse on collision.** If the target already exists, stop with an actionable message. Never overwrite to be helpful.
4. **Validation report every run:** joint/head-tail error, contact error, naming check, and what was NOT tested.
5. **Idempotent by namespace**, not by cleanup.
6. **One explicit coordinate space.** Never mix converted node positions with raw metadata. Assert head/tail agreement and fail BEFORE creating an armature.
7. **Manifest, not ad-hoc properties.** Units, axes, facing, names, canonical lengths, and the object→bone map live in a manifest beside the asset.

## 3. Rigid-part rig method

- One deform bone per named rigid part; parts parented to a single bone each, world transform preserved. No weight painting for faceted stylized work.
- Build from a **neutral rest** record. A posed source is reference geometry, not a rest pose.
- Two-bone IK for forearms and shins, no stretch. Canonical limb lengths are not auto-stretched to hide a bad contact.
- A near-straight limb needs a **documented rest pole and a clear diagnostic**, never a normalized zero vector.
- Controls: master placement, pelvis sit/stand, torso and head aim, wrist and ankle targets, elbow and knee poles. **No IK/FK switching until contacts work.**
- Control shapes stay out of render; viewport only.
- Validate rest alignment before any pose test.

## 4. Prop ownership (the state machine)

Every prop has exactly ONE active owner: `WORLD`, `HAND.L`/`HAND.R`, or `SEAT`. A state change **preserves world transform at the switch frame** — a keyable state change or a stored-inverse constraint, never an undocumented reparent.

**Directed-graph rule.** Allowed: master → body bones → grip attachment → prop, and seat marker → prop. Forbidden: any path that returns to an upstream control. **A prop may follow a hand; a prop may never be that hand's IK target in the same state.**

**Named sockets on every prop** (Vera authors them): `GRIP.L` / `GRIP.R` (hands attach), `PLAY` (where the performer lines up), `REST` (seat, stand or floor), `CARRY`. A fixed instrument is never carried: its seat is a bench target, its hands reach keyboard targets, its foot reaches a pedal target.

**Acceptance test for any prop:** rest → sit → grip and play → release → re-take → place → release → stand and move away, then scrub both directions across every switch frame. No jump past threshold, no dependency-cycle warning, no drift at the seat.

## 5. Pose and action library

One rig, many poses. Each instrument's playing posture is a saved pose or action on the one rig — **never a second rig, never a reshaped skeleton.** Add an instrument by adding its props, sockets and poses.

## 6. Library, override, animation ownership

- **Asset library file:** meshes, rig, controls, materials, manifest. **No show keys.**
- **Show assembly:** linked collection, one library override per instance where control edits are needed, local actions, linked seat and scenery, camera and blocking.
- **Animation never goes into the library.** A source rig change that breaks contacts is a deliberate, recorded version migration.
- **Two required tests before a slice is called done:** a mesh-only source edit that regenerates and resyncs with the local action intact, and two instances holding different local action states.

## 7. Stop conditions

Stop and report instead of improvising when: the version or axis behaviour is unclear · head/tail metadata disagrees · a rerun would overwrite anything · a contact needs a cycle to satisfy · a neutral rest would require silently reshaping an existing posed source · an override resync invalidates a local action · a mesh edit changes object names or parent IDs · or the first performer is not clean before a second is asked for.

## 8. Order of work

Reusable system before demo animation. Vertical slice before multiplication. One performer and one prop, passing section 4's acceptance test, before any second instrument exists.
