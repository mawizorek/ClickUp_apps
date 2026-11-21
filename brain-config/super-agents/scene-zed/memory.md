# Scene Zed · Craft Ledger

Blender 3D craft, org-free. The house/production stamp belongs on the Agent Index row log, never here. 🚫 A number, a status or a house fact in this file is a defect on sight — move it, do not refresh it.

🔴 **Born 2026-11-19 with every ledger genuinely EMPTY except where marked INHERITED.** Inherited entries came from the musician-rig Workshop review and the next-build spec, not from Zed's own work. Entries marked **EARNED** come from Zed's own sessions, with the date. A cold session that finds a ledger empty **says so** rather than inventing a pattern.

Lighting previz tools, current state and statuses: `blender/previz/README.md` and `blender/shutters/README.md`. Method: `hooks/blender-3d-craft-method.md` section 9.

---

## Ledger A — Technique + practice

- **EARNED 2026-11-21.** An import is a **sync**: one fixed input file, pre-flight it with plain Python, update in place by the source's stable ID, prune what the source dropped, verify every item against the source, report. Never "import the newest file".
- **EARNED 2026-11-21.** Split pure logic from `bpy` and test it with fakes against the user's real input file. Fast, honest, and it caught a real data defect before Blender ran.
- **EARNED 2026-11-21.** Framing shutters in Cycles: a mask in the spot light's node tree (the same place BlenderDMX puts gobos and iris), driven from object properties so it works without the add-on loaded. EEVEE ignores light node trees.
- **EARNED 2026-11-21.** Previz cameras: level (no tilt), height framed with Shift Y so verticals stay square, long clip end, tagged as placed so reruns never move them.

## Ledger B — Failure modes + the tell

- **INHERITED (Workshop ADJUST, 2026-11-19).** A rigid-part rig built from exported metadata can produce **detached limbs** when object-space node positions and raw tail custom properties are mixed. The tell: a limb visibly off its joint in rest pose. The discipline: one explicit space, and assert head/tail agreement before creating a single bone.
- **INHERITED.** A pole-vector routine that refuses a near-zero vector will **throw on a straight limb**, which is exactly what a neutral standing rest pose tends toward. The tell: the builder raises instead of posing.
- **INHERITED.** A rebuild step that clears its own output directory destroys the reference it was meant to preserve. The tell: a rerun that "works" and leaves nothing to compare against.
- **INHERITED.** Hard-coded prop parenting cannot express seat → hand → seat without a jump or a cycle. The tell: a prop snaps on the switch frame.
- **EARNED 2026-11-21.** BlenderDMX silently substitutes a generic LED PAR for any MVR fixture whose GDTF isn't inside the package. The tell: the fixture count looks right, one unit is the wrong shape. Catch it in pre-flight.
- **EARNED 2026-11-21.** A disabled BlenderDMX extension removes `scene.dmx`, so the show and every fixture look deleted. The tell: no DMX tab, a tool reports "no DMX show". Re-enable through `addon_utils`; nothing was lost.
- **EARNED 2026-11-21.** BlenderDMX starts with zero universes. The tell: Programmer at full, every fixture patched above universe 0 stays dark.
- **EARNED 2026-11-21.** Driving a library's staged importer by hand skips its own post-steps. Call the public entry point.
- **EARNED 2026-11-21.** Vectorworks default lighting symbols only fetch a GDTF when they carry a Type ID, so the MVR ships without GDTFs. The tell: empty GDTF fields in Object Info.
- **EARNED 2026-11-21.** A Vectorworks MVR export that includes scene geometry balloons to hundreds of MB. Export fixtures only; geometry travels as FBX.
- **EARNED 2026-11-21.** A swapped pair in a mirrored control (Right/Left shutters) reads as correct in a symmetric test. Test asymmetric cases and assert direction, not just amount.

## Ledger C — Standards that keep mattering

- **INHERITED.** Source geometry, rig build, animation, and scenery are **separate ownership surfaces**. A show file may link a library and own its own animation and overrides; it must never silently edit the source. (Blender's documented Link / Library Override / Actions model.)
- **INHERITED.** Interchange is not evidence. A format that carries no pivots cannot be rigged from, whatever it looks like in a viewer.
- **EARNED 2026-11-21.** Vectorworks owns fixtures (type, position, patch); the previz file owns cameras, world, render and animation. Never edit a fixture in Blender; the next sync puts it back.
- **EARNED 2026-11-21.** Fixtures travel by MVR, geometry by FBX, never mixed in one file.
- **EARNED 2026-11-21.** A camera lives in the file that owns its position.
- Cited sources live with the method hook, not here.

## Ledger D — Arguments already lost

- **EARNED 2026-11-21.** Zed offered to write the channel check from the rig. Lost: Michael builds his own channel check in Eos against the simplified rig. Zed builds the rig and the plumbing, never the programming.
- **EARNED 2026-11-21.** Zed coached click-through steps in Blender. Lost: once Michael hands over a clean MVR, Zed's tool sets everything up.

## Ledger E — What Michael has refused to change

- **ONE performer model, repeated for a room of instruments.** His words, 2026-11-19: *"realistically, its ONE model, repeated for a ROOM of instruments."* Playing posture is a saved pose or action on the one rig, never a second rig. Any proposal that forks the rig per instrument is already refused.
- **Keys-first demo design is refused.** Build the reusable rig from the start; the first shot does not get to define the system.
- **The faceted, grey, low-poly sculptural read stays.** *"I like these as a starting point."* Do not smooth it into a realistic mannequin. Builds should be quick and carry good style points.
- **EARNED 2026-11-21. Real lighting words only.** *"Shaper isn't a lighting term."* Tool and control names are what he'd say on a headset.
- **EARNED 2026-11-21. In-house first.** Tools get played across a dozen of his own shows before anything goes upstream: *"impress me first."*
- **EARNED 2026-11-21. Zed leads.** *"You're still floating us through this a little bit instead of leading this project."* Decide the mechanic, build it, report it.

## Measured Blender facts

- **Blender 5.2.2 LTS is confirmed for this seat** (Michael's Shutters self-test console, 2026-11-21).
- BlenderDMX extension "DMX" from extensions.blender.org, as installed on his machine 2026-11-21 (version on the README). Listed permission: Files only. Whether it receives sACN under that permission is unmeasured.
- 🔴 One shared facts ledger between the two Blender seats is still an open question (`decision-log.md` D8).
