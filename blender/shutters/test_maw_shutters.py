# MAW Shutters · self-test v0.5.2 · Scene Zed · 2026-11-21
# Builds its own scratch scene, renders 7 cuts in Cycles, measures them, writes a report.
# Never touches your files: run it headless from Terminal, Blender closed or open, doesn't matter.
#
#   Put maw_shutters.py and this file in the same folder, then in Terminal:
#   /Applications/Blender.app/Contents/MacOS/Blender -b --factory-startup -P ~/Downloads/maw_shutters_v0_4/test_maw_shutters.py
#
# Output: a folder "maw_shutters_test" next to this file with one PNG per case,
# report.txt, and test_scene.blend (open it to poke at the rig by hand).

import bpy, os, sys, math, time
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import maw_shutters as ms

OUT = os.path.join(HERE, "maw_shutters_test")
os.makedirs(OUT, exist_ok=True)
RES, SAMPLES = 256, 32
H, CONE = 6.0, 30.0          # light height (m), spot size (deg)

# ---------- scratch scene ----------
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = "CYCLES"
sc.cycles.device = "CPU"
sc.cycles.samples = SAMPLES
sc.cycles.use_denoising = False
sc.render.resolution_x = sc.render.resolution_y = RES
sc.render.image_settings.file_format = "PNG"
sc.render.image_settings.color_mode = "BW"
sc.view_settings.view_transform = "Standard"
world = bpy.data.worlds.new("black"); world.color = (0, 0, 0); sc.world = world

bpy.ops.mesh.primitive_plane_add(size=12, location=(0, 0, 0))
deck = bpy.context.active_object; deck.name = "DECK"
mat = bpy.data.materials.new("deck_white"); mat.diffuse_color = (0.8, 0.8, 0.8, 1)
deck.data.materials.append(mat)

ld = bpy.data.lights.new("TEST_SPOT", "SPOT")
ld.energy = 4000.0
ld.spot_size = math.radians(CONE)
ld.spot_blend = 0.0
ld.shadow_soft_size = 0.0
spot = bpy.data.objects.new("TEST_SPOT", ld)
sc.collection.objects.link(spot)
spot.location = (0, 0, H)    # Blender spots aim down -Z by default: straight onto the deck

cam_d = bpy.data.cameras.new("TOP_CAM"); cam_d.type = "ORTHO"
beam_r = H * math.tan(math.radians(CONE / 2))
cam_d.ortho_scale = beam_r * 2.6
cam = bpy.data.objects.new("TOP_CAM", cam_d); sc.collection.objects.link(cam)
cam.location = (0, 0, H + 2.0)   # looking straight down; image up = +Y on the deck
sc.camera = cam

ms.register()
spot["shaper_top_depth"] = 33.0          # pretend this light was set up with v0.2
print("MAW Shutters test:", ms.apply_to(spot))
MIGRATED = spot.get("Shutter Top") == 33.0 and "shaper_top_depth" not in spot

# ---------- cases: (name, set_cut kwargs, expected lit fraction of open, expected shift) ----------
def chord_left(depth):
    """fraction of a unit circle left after one straight cut at depth % (100 = centre)."""
    h = 1 - depth / 100.0                      # edge distance from centre
    seg = math.acos(h) - h * math.sqrt(1 - h * h)
    return 1 - seg / math.pi

CASES = [
    ("01_open", {}, 1.0, None),
    ("02_top_50", {"top": (50, 0)}, chord_left(50), "down"),
    ("03_right_50", {"right": (50, 0)}, chord_left(50), "left"),
    ("04_top_40_angle_20", {"top": (40, 20)}, None, "down"),
    ("05_box_60", {k: (60, 0) for k in ("top", "right", "bottom", "left")}, 0.64 / math.pi, None),
    ("06_box_60_rotate_20", dict({k: (60, 0) for k in ("top", "right", "bottom", "left")}, rotate=20), 0.64 / math.pi, None),
    ("07_slit_soft", {"right": (90, 0), "left": (90, 0), "barrel": 0.7}, None, None),
]

def reset():
    ms.set_cut(spot, rotate=0, barrel=0, frost=0, **{k: (0, 0) for k, *_ in ms.SHUTTERS})

def render(name):
    path = os.path.join(OUT, name + ".png")
    sc.render.filepath = path
    sc.frame_set(sc.frame_current)          # make drivers evaluate
    bpy.context.view_layer.update()
    bpy.ops.render.render(write_still=True)
    img = bpy.data.images.load(path, check_existing=False)
    px = np.empty(len(img.pixels), dtype=np.float32); img.pixels.foreach_get(px)
    w, h = img.size
    lum = px.reshape(h, w, 4)[..., 0]
    bpy.data.images.remove(img)
    return lum

def measure(lum, thresh):
    lit = lum > thresh
    n = lit.sum()
    if n == 0:
        return 0, (0.0, 0.0)
    ys, xs = np.nonzero(lit)
    c = (xs.mean() - lum.shape[1] / 2, ys.mean() - lum.shape[0] / 2)  # image rows: 0 = bottom in Blender pixels
    return n, c

def direction(c):
    dx, dy = c
    if max(abs(dx), abs(dy)) < 2:
        return "centred"
    if abs(dx) > abs(dy):
        return "right" if dx > 0 else "left"
    return "up" if dy > 0 else "down"

lines, fails = [], 0
if not MIGRATED:
    lines.append("FAIL migration: v0.2 value did not move to \"Shutter Top\""); fails += 1
else:
    lines.append("PASS migration: v0.2 names -> Shutter Top / Shutter Rotate ...")
t0 = time.time()
reset()
open_lum = render(CASES[0][0])
thresh = 0.5 * float(open_lum.max())
open_n, open_c = measure(open_lum, thresh)
if open_n == 0:
    lines.append("FAIL 01_open: no light on the deck at all. Check the scene, nothing else is meaningful.")
    fails += 1
lines.append(f"01_open: lit px {open_n}, beam radius {beam_r:.2f} m")

for name, kw, expect, shift in CASES[1:]:
    reset(); ms.set_cut(spot, **kw)
    n, c = measure(render(name), thresh)
    frac = n / open_n if open_n else 0
    d = direction((c[0] - open_c[0], c[1] - open_c[1]))
    verdict = "PASS"
    notes = []
    if abs(frac - 1.0) < 0.02:
        verdict = "FAIL"; notes.append("no change from open: shutters aren't reaching the light")
    if expect is not None and abs(frac - expect) > 0.25 * expect:
        verdict = "FAIL"; notes.append(f"expected ~{expect:.2f} of open")
    if shift is not None and d != shift:
        notes.append(f"ORIENTATION: beam centre moved {d}, expected {shift} (calibration fact, not a code fail)")
    fails += verdict == "FAIL"
    lines.append(f"{verdict} {name}: {frac:.2f} of open, beam centre moved {d}" + ("" if not notes else " · " + "; ".join(notes)))

# ---------- edge ladder: same Top 50 cut through every frost + barrel ----------
def edge_width(lum):
    col = lum[:, lum.shape[1] // 2]
    top = float(col.max()) or 1.0
    return int(((col > 0.1 * top) & (col < 0.9 * top)).sum())   # px in the soft transition

LADDER = [("08_edge_sharp", dict(barrel=0, frost=0)), ("09_edge_R132", dict(barrel=0, frost=1)),
          ("10_edge_R119", dict(barrel=0, frost=2)), ("11_edge_R114", dict(barrel=0, frost=3)),
          ("12_edge_barrel_out", dict(barrel=1, frost=0)), ("13_edge_barrel_in", dict(barrel=-1, frost=0))]
strips, widths = [], []
for name, kw in LADDER:
    reset(); ms.set_cut(spot, top=(50, 0), **kw)
    lum = render(name); strips.append(lum); widths.append(edge_width(lum))
rising = widths[0] < widths[1] < widths[2] < widths[3]
sym = abs(widths[4] - widths[5]) <= 1 and widths[4] > widths[0]
fails += not rising
fails += not sym
lines.append(("PASS" if sym else "FAIL") + f" barrel IN/OUT both soften from sharp: out {widths[4]} px, in {widths[5]} px")
lines.append(("PASS" if rising else "FAIL") + " edge ladder px (sharp, R132, R119, R114 | barrel run): "
             + ", ".join(str(w) for w in widths[:4]) + f" | out {widths[4]}, in {widths[5]}")
arr = np.concatenate(strips, axis=1).astype(np.float32)
hh, ww = arr.shape
rgba = np.stack([arr, arr, arr, np.ones_like(arr)], axis=-1).ravel()
img = bpy.data.images.new("edge_ladder", ww, hh, alpha=False)
img.pixels.foreach_set(rgba)
img.filepath_raw = os.path.join(OUT, "edge_ladder.png"); img.file_format = "PNG"; img.save()
lines.append("edge_ladder.png: sharp | R132 | R119 | R114 | barrel OUT | barrel IN (left to right)")

# block keyframe check: one Key = every shutter channel keyed at one frame, in group "Shutters"
reset(); ms.set_cut(spot, top=(30, 10), rotate=15)
n1 = ms.key_shutters(spot, frame=1)
ms.set_cut(spot, top=(60, -10), rotate=-15)
n2 = ms.key_shutters(spot, frame=48, snap=True)
fcs = [fc for fc in ms._fcurves(spot) if fc.data_path.strip('[]"') in ms.ANIMATED]
grouped = all(fc.group is not None and fc.group.name == "Shutters" for fc in fcs)
want = len(ms.ANIMATED)
first = [min(fc.keyframe_points, key=lambda kp: kp.co[0]) for fc in fcs]
snapped = all(kp.interpolation == "CONSTANT" for kp in first)   # frame 48 snap -> frame 1 look holds
top = next(fc for fc in fcs if fc.data_path == '["Shutter Top"]')
held = abs(top.evaluate(24) - 30.0) < 0.01 and abs(top.evaluate(47.5) - 30.0) < 0.01 and abs(top.evaluate(48) - 60.0) < 0.01
# insert a FADE key between: frame 1 must now fade (linear) into 24, and 24 must still SNAP into 48
ms.set_cut(spot, top=(45, 0)); ms.key_shutters(spot, frame=24, snap=False)
mid_fade = abs(top.evaluate(12) - 37.5) < 0.6
mid_hold = abs(top.evaluate(40) - 45.0) < 0.01
# hand-shaped curve survives later keying: shape 1->24 as Sine, then add a fade key at 60
k1 = min(top.keyframe_points, key=lambda kp: kp.co[0]); k1.interpolation = "SINE"
ms.set_cut(spot, top=(20, 0)); ms.key_shutters(spot, frame=60, snap=False)
kept = min(top.keyframe_points, key=lambda kp: kp.co[0]).interpolation == "SINE"
ok = n1 == want and n2 == want and len(fcs) == want and grouped and snapped and held and mid_fade and mid_hold and kept
fails += not ok
lines.append(("PASS" if ok else "FAIL") + f" cue keys: {n1}+{n2} on {len(fcs)}/{want} ch, grouped={grouped}, snap holds={held}, fade-in linear={mid_fade}, snap survives insert={mid_hold}, your curve kept={kept}")
sc.frame_start, sc.frame_end = 1, 72
reset(); sc.frame_set(1)


# ---------------------------------------------------------------- Pull from Vectorworks (v0.6)
import json as _json
def _spot(name, loc):
    ld = bpy.data.lights.new(name, "SPOT"); ob = bpy.data.objects.new(name, ld)
    sc.collection.objects.link(ob); ob.location = loc; return ob
def _dev(t, x, y, z, unit="1", pos="TEST PIPE", color="", **cuts):
    f = {"Inst Type": t, "Unit Number": unit, "Position": pos, "Color": color, "UID": f"{x}.{y}",
         "X Location": f"{x}'", "Y Location": f"{y}'", "Z Location": f"{z}'"}
    for lab in ("Top", "Left", "Right", "Bottom"):
        d, a = cuts.get(lab, (0, 0)); f[f"{lab} Shutter Depth"] = str(d); f[f"{lab} Shutter Angle"] = f"{a}\u00b0"
    return {"record": "Lighting Device", "layer": "LX TEST", "fields": f}
sample = {"file": "self-test sample", "devices": [
    _dev("ETC Source 4 LEDLS 26deg", 0, 0, 20, color="R119", Top=(11, 0)),
    _dev("ETC Source 4 LEDLS 50deg", 10, 0, 20, color="R132", Right=(3, 31), Bottom=(17, 27)),
    _dev("ETC High End Lonestar", 40, 40, 20, unit="2", color="N/C"),        # no spot nearby -> unmatched
    {"record": "Lighting Device", "layer": "LX3", "fields": {"Inst Type": "", "X Location": "10'", "Y Location": "0'", "Z Location": "20'"}},
]}
sample_path = os.path.join(OUT, "vwx_sample.json")
with open(sample_path, "w") as fh: _json.dump(sample, fh)
sa = _spot("VWX_A", (0.0, 0.0, 20 * 0.3048 - 0.2))       # 0.2 m below the hang point, like a fixture body
sb = _spot("VWX_B", (10 * 0.3048, 0.0, 20 * 0.3048 - 0.2))
r = ms.pull_from_vwx(sample_path, lights=[sa, sb], tol=0.75)
okA = sa.get("Shutter Top") == 11.0 and sa.get("Shutter Frost") == 2 and sa.get("Shutter Bottom") == 0.0
okB = (sb.get("Shutter Right"), sb.get("Shutter Right Angle"), sb.get("Shutter Bottom"), sb.get("Shutter Bottom Angle"), sb.get("Shutter Frost")) == (3.0, 31.0, 17.0, 27.0, 1)
okR = r["matched"] == 2 and len(r["unmatched"]) == 1 and r["ghosts"] == 1
ok = okA and okB and okR
fails += 0 if ok else 1
lines.append(("PASS" if ok else "FAIL") + f" VWX pull (sample): A top 11% + R119={okA}, B right 3%/31° bottom 17%/27° + R132={okB}, "
             f"matched {r['matched']}/unmatched {len(r['unmatched'])}/ghosts {r['ghosts']}")
for ob in (sa, sb):
    bpy.data.objects.remove(ob, do_unlink=True)

real = os.path.join(HERE, "maw_vwx_lighting_devices.json")       # optional: drop your own dump next to this file
if os.path.exists(real):
    fname, devs, ghosts = ms.vwx_devices(real)
    spots = [_spot(f"DRY_{i:03d}", d["loc"]) for i, d in enumerate(devs)]
    rr = ms.pull_from_vwx(real, lights=spots, tol=0.05)
    okD = rr["matched"] == len(devs)
    fails += 0 if okD else 1
    lines.append(("PASS" if okD else "FAIL") + f" VWX pull dry run on {fname}: {rr['matched']}/{len(devs)} typed devices matched, "
                 f"{rr['with_cut']} with cuts, {rr['with_frost']} with frost, {ghosts} ghosts skipped")
    with open(os.path.join(OUT, "vwx_pull_report.txt"), "w") as fh: fh.write(rr["text"] + "\n")
    for ob in spots:
        bpy.data.objects.remove(ob, do_unlink=True)
else:
    lines.append("SKIP VWX dry run: put maw_vwx_lighting_devices.json next to this test to run it on your plot")

# embed the tool so the Shutters tab comes back when this .blend opens
# (Blender asks once: "Allow Execution" in the top bar, or Preferences > Save & Load > Auto Run)
txt = bpy.data.texts.load(os.path.join(HERE, "maw_shutters.py"))
txt.use_module = True
ms.select_only(spot)
sc.frame_set(1)
sc.cycles.preview_samples = 16                 # snappy Rendered viewport
sc[ms.STAGE_FLAG] = spot.name                  # this file opens staged
layout = [scr for scr in bpy.data.screens if scr.name == "Layout"]
staged = ms.stage_view(screens=layout)
lines.append(f"staged on open: {spot.name} selected, Rendered + camera + Shutters tab in {staged} Layout view(s)")

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, "test_scene.blend"))
head = [
    f"MAW Shutters self-test v{ms.VERSION}",
    f"Blender {bpy.app.version_string} · Cycles {SAMPLES} spp · {RES}px · {time.time() - t0:.0f}s",
    f"RESULT: {'ALL PASS' if fails == 0 else str(fails) + ' FAIL'}",
    "Camera looks straight down; image up = +Y on the deck.",
    "",
]
report = "\n".join(head + lines)
with open(os.path.join(OUT, "report.txt"), "w") as f:
    f.write(report + "\n")
print("\n" + report + f"\n\nFiles: {OUT}")
