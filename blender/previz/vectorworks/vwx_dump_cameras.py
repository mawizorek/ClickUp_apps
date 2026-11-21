# MAW · Vectorworks camera dump v0.1 · Scene Zed · 2026-11-21
# Runs INSIDE Vectorworks (Python). Read-only: changes nothing in the drawing.
# Every named 3D locus becomes a point in ~/Desktop/maw_vwx_cameras.json. MAW Previz pulls it in on its next run.
#
# HOW TO PLACE A CAMERA (venue file for VENUE cameras, scenery file for SCENIC, show file for RENDER)
#   Two 3D loci per camera, named in the Object Info palette:
#     CAM REP CENTER 35   the lens: eye height, where the camera sits. Trailing number = lens mm (default 35)
#     AIM REP CENTER      what it looks at
#   Put them on a design layer named CAM VENUE, CAM SCENIC or CAM RENDER (layer elevation 0).
#   Origin = centre line x plaster line, same as the MVR.
#
# RUN: Tools > Scripts > Run Script... > pick this file

import vs, json, os, time

OUT = os.path.join(os.path.expanduser("~"), "Desktop", "maw_vwx_cameras.json")
try:
    UPI = float(vs.GetUnits()[3])          # document units per inch
except Exception:
    UPI = 1.0 / 25.4                        # assume mm
points, unnamed = [], 0

def grab(h):
    global unnamed
    name = vs.GetName(h)
    if not name:
        unnamed += 1
        return
    x, y, z = vs.GetLocus3D(h)
    points.append({"name": name, "layer": vs.GetLName(vs.GetLayer(h)),
                   "xyz_doc": [x, y, z], "xyz_m": [c / UPI * 0.0254 for c in (x, y, z)]})

vs.ForEachObject(grab, "(T=LOCUS3D)")
cams = [p for p in points if p["name"].upper().startswith(("CAM ", "AIM "))]
with open(OUT, "w") as f:
    json.dump({"file": vs.GetFName(), "made": time.strftime("%Y-%m-%d %H:%M"), "units_per_inch": UPI,
               "points": cams}, f, indent=1)

vs.AlrtDialog(f"MAW cameras: {len(cams)} CAM/AIM loci ({unnamed} unnamed loci ignored)\n{OUT}\nNow run OPEN PREVIZ.")
