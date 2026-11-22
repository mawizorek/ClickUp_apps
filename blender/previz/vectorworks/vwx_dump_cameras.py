# MAW · Vectorworks camera dump v0.2.1 · Scene Zed · 2026-11-21
# Runs INSIDE Vectorworks (Python). Read-only: changes nothing in the drawing.
# Writes ~/Desktop/maw_vwx_cameras.json. MAW Previz pulls it in on its next run.
#
# CAMERAS: Renderworks Camera objects (the Renderworks Camera tool: click the lens spot, click the look-to point).
#   Name each one in Object Info: REP CENTER, SEAT HL, RENDER WIDE ... (Previz adds "CAM ").
#   Keep them in the closet: a design layer named CAM VENUE (venue file), CAM SCENIC (scenery) or CAM RENDER (show),
#   layer elevation 0, so the deck drawing stays clean.
#   Also read: 3D loci named CAM <name> [lens] + AIM <name>, the v0.1 way.
# Every field of every camera is dumped too, so the mapping can be checked against what Vectorworks calls things.
#
# RUN: Tools > Scripts > Run Script... > pick this file

import vs, json, os, time

OUT = os.path.join(os.path.expanduser("~"), "Desktop", "maw_vwx_cameras.json")
try:
    UPI = float(vs.GetUnits()[3])          # document units per inch
except Exception:
    UPI = 1.0 / 25.4                        # assume mm
to_m = lambda v: float(v) / UPI * 0.0254
points, cameras, unnamed = [], [], 0


def num(s):
    """A Vectorworks dimension string in document units -> metres, or None."""
    try:
        ok, val = vs.ValidNumStr(str(s))
        return to_m(val) if ok else None
    except Exception:
        return None


def grab_locus(h):
    global unnamed
    name = vs.GetName(h)
    if not name:
        unnamed += 1
        return
    x, y, z = vs.GetLocus3D(h)
    points.append({"name": name, "layer": vs.GetLName(vs.GetLayer(h)),
                   "xyz_doc": [x, y, z], "xyz_m": [to_m(c) for c in (x, y, z)]})


def grab_any(h):
    rec = vs.GetParametricRecord(h)
    if not rec:
        return
    recname = vs.GetName(rec)
    if recname.replace(" ", "").lower() != "renderworkscamera":
        return
    fields, fields_m = {}, {}
    for i in range(1, vs.NumFields(rec) + 1):
        f = vs.GetFldName(rec, i)
        v = vs.GetRField(h, recname, f)
        fields[f] = v
        if any(k in f.lower() for k in ("height", "distance", "look to x", "look to y")):
            m = num(v)
            if m is not None:
                fields_m[f] = m
    try:
        x, y, z = vs.GetSymLoc3D(h)
    except Exception:
        x, y = vs.GetSymLoc(h); z = 0.0
    try:
        rot = float(vs.GetSymRot(h))
    except Exception:
        rot = 0.0
    cameras.append({"name": vs.GetName(h) or fields.get("Name", ""), "layer": vs.GetLName(vs.GetLayer(h)),
                    "record": recname, "xyz_doc": [x, y, z], "xyz_m": [to_m(c) for c in (x, y, z)],
                    "rot_deg": rot, "fields": fields, "fields_m": fields_m})


vs.ForEachObject(grab_locus, "(T=LOCUS3D)")
vs.ForEachObject(grab_any, "(ALL)")
loci = [p for p in points if p["name"].upper().startswith(("CAM ", "AIM "))]
with open(OUT, "w") as f:
    json.dump({"file": vs.GetFName(), "made": time.strftime("%Y-%m-%d %H:%M"), "units_per_inch": UPI,
               "cameras": cameras, "points": loci}, f, indent=1)

on_cam = [c for c in cameras if c["layer"].upper().startswith("CAM ")]
nameless = [c for c in on_cam if not c["name"]]
off = len(cameras) - len(on_cam)
msg = f"MAW cameras: {len(on_cam) - len(nameless)} named on CAM layers, {len(loci)} CAM/AIM loci"
if nameless:
    msg += f"\nNAME THESE: {len(nameless)} unnamed camera(s) on CAM layers will be skipped"
if off:
    msg += f"\n{off} camera(s) on other layers ignored (presentation cameras stay out)"
vs.AlrtDialog(msg + f"\n{OUT}\nNow run OPEN PREVIZ.")
