---
id: blender-3d-craft-method
name: Blender 3D Craft Method
shelf: hooks
kind: method
trigger: Building or coaching a Blender 3D rig, show-file scene assembly, prop handoffs, any Blender-side Python builder, or any Blender tool (add-on, setup script, importer) for lighting previz.
nicknames: [3D craft method, Zed's method, Tool Build Method]
owner: Scene Zed (stewards edits)
added: 2026-11-19
version: 2
---

# Blender 3D Craft Method (🪝 Hook)

The procedure for Blender **3D** work: rigid-part rigs, prop ownership, builder discipline, the library/override split, and building Blender tools. Sections 1 to 8 were seeded from the musician-rig Workshop review (ADJUST, 2026-11-19) and the next-build specification. Section 9 is the Tool Build Method, which passed its own three-pass Workshop on 2026-11-21 during the previz lighting session, and the lessons from that session's MVR import.

🚫 **Not this hook:** coaching posture (`blender-coaching-method.md`, shared with Armature Arlo) · 2D line animation and Grease Pencil (`blender-2d-line-animation.md`) · geometry authoring (Vertex Vera) · Vectorworks and dimensional authority (Vector Vale) · the version-dependent VWX↔Blender claims (the "Blender + Vectorworks Previz — Working Reference" page, stewarded by Vale) · hardware bench builds (`bench-build-method.md`, Pinout Pavel).

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

## 9. Building tools (Tool Build Method)

For any Blender tool Zed writes for Michael: add-ons, setup scripts, importers, sidebar tabs. Live examples: `blender/previz/` (MAW Previz) and `blender/shutters/` (MAW Shutters) in this repo.

### Status words

**BUILT** (written) → **TESTED** (Zed's automated checks pass) → **VERIFIED** (Michael's own Blender, screenshot or console). Only Michael's evidence makes anything VERIFIED. Every README and handoff states the status of every tool it names, and what the tests did not prove.

### Zed sets it up; Michael plays

- Michael's job is the export and one click. If a run asks him to click through Blender menus to get to a usable state, the tool is unfinished. ("Why am I doing any clicking in Blender, you're supposed to set all that up for me once I get you a clean MVR.")
- One-click runner: a double-click `.command` launcher or one Run Script. Never ask him to type a path.
- Zed leads. Decide the mechanic, build it, say what it does. Don't float options he has to adjudicate.

### Inputs and outputs

- **One fixed input, never "the newest file somewhere".** The previz rig is `<blend name>.mvr` beside the `.blend`.
- **Pre-flight the input before mutating anything.** Read it with plain Python, refuse with the fix named (BLOCK), skip what's legitimately out of scope (SKIP), and flag the rest (WARN).
- **Verify the result against the source after.** Count, identity, geometry, patch. Report PASS / CURRENT / BLOCKED / MISSING / FAIL, in the file and on disk.
- **Know the importer's silent fallbacks and catch them before they land.** BlenderDMX swaps a generic PAR in for any MVR fixture whose GDTF isn't in the package. That is a `silent-fallback-law.md` case in third-party code: our tool must announce it, not inherit it.
- **Sync, don't re-import.** Match by the source's stable ID (MVR fixture UUID), update in place, prune what the source no longer has.
- **Call the library's own entry point** (`addMVR`), not its internals (driving `addMVR_steps` by hand skipped its post-steps).

### In the UI

- Theatre lingo in the UI, Vectorworks/Eos terms in tooltips, spec terms never. Names are words Michael would say on a call: Shutters, Previz, Barrel, Frost, Key Fade, Key Snap. ("Shaper isn't a lighting term." "Bench" meant nothing to him.)
- Keys behave like cues: record a whole assembly as one look, Fade or Snap, one row in the Dope Sheet.
- His hands win: reruns never move a camera he placed or reshape a curve he edited. Only the segments touching a new key change.
- Opt-in staging: a file opens staged (selected, Rendered, tab open) only if it asked to. Show files are never hijacked.
- Purge older versions on load: unregister retired class names, migrate old property names, one tab with the current version in its label.

### Tests

- Every bug becomes a behaviour assertion before the fix ships.
- Split pure logic from `bpy` so it tests without Blender, against Michael's real input files. Headless Blender self-tests (`-b --factory-startup`) for what needs a render. Say plainly what each kind of test does not prove.

### Where code lives

- Source of truth: `blender/<tool>/` in this repo, with README, CHANGELOG and tests. ClickUp attachments are copies.
- Upstream (BlenderDMX) only after a tool has been played hard across a dozen of Michael's own shows. Impress him first.

---

## Changelog

- **v2 (2026-11-21)**: section 9, Building tools. Tool Build Method passed its Workshop (three passes) in the SFANW previz session; import lessons from the MVR rig sync (Previz v0.5.0).
- **v1 (2026-11-19)**: sections 1 to 8, from the musician-rig Workshop review and the next-build spec.
