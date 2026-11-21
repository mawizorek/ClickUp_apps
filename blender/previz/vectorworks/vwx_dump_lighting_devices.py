# MAW · Vectorworks lighting device dump v0.1 · Scene Zed · 2026-11-21
# Runs INSIDE Vectorworks (Python). Read-only: changes nothing in the drawing.
# Writes every field of every Lighting Device to ~/Desktop/maw_vwx_lighting_devices.json
# so we can see exactly what your file calls shutter depth/angle, UID, channel, unit, position.
#
# RUN: Tools > Scripts > Run Script... > pick this file   (or paste into a Python script resource)

import vs, json, os

OUT = os.path.join(os.path.expanduser("~"), "Desktop", "maw_vwx_lighting_devices.json")
devices = []

def grab(h):
    rec = vs.GetParametricRecord(h)
    recname = vs.GetName(rec)
    fields = {}
    for i in range(1, vs.NumFields(rec) + 1):
        f = vs.GetFldName(rec, i)
        fields[f] = vs.GetRField(h, recname, f)
    entry = {"record": recname, "layer": vs.GetLName(vs.GetLayer(h)), "fields": fields}
    try:
        entry["insertion_point"] = list(vs.GetSymLoc(h))
    except Exception:
        pass
    devices.append(entry)

vs.ForEachObject(grab, "(PON='Lighting Device')")

shutterish = sorted({k for d in devices for k in d["fields"] if "shut" in k.lower() or "frame" in k.lower()})
with open(OUT, "w") as f:
    json.dump({"file": vs.GetFName(), "count": len(devices),
               "shutter_like_fields": shutterish, "devices": devices}, f, indent=1)

vs.AlrtDialog(f"MAW dump: {len(devices)} lighting devices\nShutter-like fields: {len(shutterish)}\n{OUT}")
