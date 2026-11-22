# MAW Previz v0.6.1 · Scene Zed · 2026-11-21
# The previz file syncs its rig from ONE place: the .mvr beside this .blend with the same name
#   SPAC_CHANNEL_CHECK.blend  <->  SPAC_CHANNEL_CHECK.mvr
# Vectorworks owns fixtures (type, position, patch). Blender owns cameras, world, render, animation.
# Never edit a fixture in Blender: the next sync puts it back to what VWX says.
# Sync = pre-flight (refuses bad MVRs) -> BlenderDMX import, matched by fixture UUID (updates in place)
#        -> prune fixtures VWX no longer has -> verify every fixture against the MVR -> PASS/BLOCKED report.
# Bare start: OPEN PREVIZ in a folder with no .blend creates <folder name>.blend and builds everything.
# Venue: Vectorworks FBX at MAW_PREVIS/_LIBRARY/venue/SPAC_venue.fbx -> Previz builds SPAC_venue.blend from it
#   (rebuilt whenever the FBX changes) and LINKS its VENUE collection. Link, never append.
# Cameras: Vectorworks owns their positions too. Renderworks Camera objects (or CAM/AIM 3D-locus pairs) on layers
#   CAM VENUE, CAM SCENIC, CAM RENDER, dumped by vectorworks/vwx_dump_cameras.py; Previz pulls the dump in as
#   <blend name>.cameras.json. No camera file = guessed cameras, flagged GUESSED in the report.
# House ambient: 5% by default (a real house is never black: exits, spill, aisle lights). Camera still sees black void.
# Open with "OPEN PREVIZ.command" (double-click). Built for BlenderDMX 2.2.5 on Blender 5.2.2. Status: BUILT.
import bpy, json, math, re, os, sys, glob, inspect, shutil, time, zipfile, hashlib
import xml.etree.ElementTree as ET
from mathutils import Vector

VERSION = "0.6.1"
UNIVERSES = 64
HAZE = 0.02
AMBIENT = 0.05           # house ambient, 0-1 (5% = a theatre at blackout: exits, spill, aisle lights)
P_AMBIENT = "Previz Ambient"
VENUE = "SPAC"           # venue name: _LIBRARY/venue/<VENUE>_venue.fbx -> <VENUE>_venue.blend
CAM_ROT0 = 0.0           # deg: which way a Renderworks camera at rotation 0 looks (0 = +X). Calibrated by the first camera
EXPECT_LAYER = None      # e.g. "LX 8 - INVENTORY" to warn about strays; None = any layer

# MAW Previz pre-flight: reads an .mvr with plain Python (no Blender needed) and says whether it's safe to sync.


def gdtf_footprint(zf_bytes, mode_name):
    """Channels a GDTF mode occupies (max DMX offset), incl. geometry-reference cells (SoloBAR style)."""
    import io
    g = zipfile.ZipFile(io.BytesIO(zf_bytes))
    root = ET.fromstring(g.read('description.xml'))
    modes = {m.get('Name'): m for m in root.iter('DMXMode')}
    if mode_name not in modes:
        return None, sorted(modes)
    m = modes[mode_name]
    by_geo, direct = {}, 0
    for ch in m.iter('DMXChannel'):
        offs = [int(x) for x in (ch.get('Offset') or '').split(',') if x.strip().isdigit()]
        if not offs: continue
        hi = max(offs); geo = ch.get('Geometry')
        by_geo[geo] = max(by_geo.get(geo, 0), hi); direct = max(direct, hi)
    # geometry references: template channels shift by the reference's Break DMXOffset
    tops = [direct]
    for ref in root.iter('GeometryReference'):
        for b in ref.iter('Break'):
            off = int(b.get('DMXOffset') or 1)
            tpl = ref.get('Geometry')
            if tpl in by_geo:
                tops.append(off - 1 + by_geo[tpl])
    return max(tops), sorted(modes)

def preflight(path, expect_layer=None):
    data = open(path, 'rb').read()
    sha = hashlib.sha256(data).hexdigest()[:16]
    z = zipfile.ZipFile(path); names = set(z.namelist())
    root = ET.fromstring(z.read('GeneralSceneDescription.xml'))
    fixtures, block, warn = [], [], []
    gcache = {}
    for layer in root.iter('Layer'):
        for f in layer.iter('Fixture'):
            spec = (f.findtext('GDTFSpec') or '').strip()
            mode = (f.findtext('GDTFMode') or '').strip()
            addrs = [int(a.text) for a in f.iter('Address') if (a.text or '').strip().isdigit()]
            absa = addrs[0] if addrs else 0
            rec = dict(uuid=f.get('uuid'), name=f.get('name') or '?', layer=layer.get('name'),
                       fid=(f.findtext('FixtureID') or '').strip(), unit=(f.findtext('UnitNumber') or '').strip(),
                       spec=spec, mode=mode, abs=absa, uni=(absa-1)//512+1 if absa else 0,
                       addr=(absa-1)%512+1 if absa else 0, size=None)
            if (not spec or spec not in names) and not absa:
                rec['skip'] = True
                warn.append(f"{rec['name']}: skipped, not a DMX fixture (no GDTF, no address)")
            elif not spec or spec not in names:
                block.append(f"{rec['name']}: patched but its GDTF '{spec or 'none'}' isn't inside the MVR, BlenderDMX would swap in a fake generic PAR. Assign the real GDTF in VWX.")
            else:
                if spec not in gcache: gcache[spec] = z.read(spec)
                size, modes = gdtf_footprint(gcache[spec], mode)
                if size is None:
                    block.append(f"{rec['name']}: mode '{mode}' isn't in {spec} (has: {', '.join(modes)})")
                rec['size'] = size
            if not absa and not rec.get('skip'):
                warn.append(f"{rec['name']}: no DMX address, it will import dark and unpatched")
            if expect_layer and rec['layer'] != expect_layer:
                warn.append(f"{rec['name']}: on layer '{rec['layer']}', expected '{expect_layer}'")
            fixtures.append(rec)
    # overlaps: footprint-aware
    spans = sorted([r for r in fixtures if r['abs'] and r['size']], key=lambda r: r['abs'])
    for a, b in zip(spans, spans[1:]):
        if a['abs'] + a['size'] - 1 >= b['abs']:
            block.append(f"PATCH OVERLAP: {a['name']} {a['uni']}/{a['addr']} ({a['size']}ch) runs into {b['name']} {b['uni']}/{b['addr']}")
        if (a['abs']-1)//512 != (a['abs']+a['size']-2)//512:
            block.append(f"{a['name']} {a['uni']}/{a['addr']} ({a['size']}ch) crosses a universe boundary")
    nofid = [r['name'] for r in fixtures if not r['fid'] and not r.get('skip')]
    if nofid:
        warn.append(f"{len(nofid)} fixtures have no Channel (Fixture ID) in VWX, Blender labels won't match your Eos channels")
    uuids = [r['uuid'] for r in fixtures]
    if len(set(uuids)) != len(uuids):
        block.append("duplicate fixture UUIDs in the MVR")
    return dict(sha=sha, fixtures=fixtures, block=block, warn=warn,
                max_uni=max([r['uni'] for r in fixtures] + [0]))


# per-GDTF home + lamp-test values, read from your MVR's own GDTF files (0-255 per attribute)
LAMP = json.loads(r'''{"ETC@S4 Series 1 Lustr.gdtf": {"home": {"ColorAdd_R": 255, "ColorAdd_W": 0, "ColorAdd_RY": 0, "ColorAdd_G": 255, "ColorAdd_C": 0, "ColorAdd_B": 255, "ColorAdd_BM": 0, "Dimmer": 0, "Shutter1": 255, "Fans": 0}, "lamp": {"ColorAdd_R": 255, "ColorAdd_W": 255, "ColorAdd_RY": 255, "ColorAdd_G": 255, "ColorAdd_C": 255, "ColorAdd_B": 255, "ColorAdd_BM": 255, "Dimmer": 255, "Shutter1": 255, "Fans": 0}}, "ETC@Colorsource PAR.gdtf": {"home": {"Dimmer": 0, "ColorAdd_R": 255, "ColorAdd_G": 255, "ColorAdd_B": 255, "ColorAdd_GY": 255, "StrobeRate": 128}, "lamp": {"Dimmer": 255, "ColorAdd_R": 255, "ColorAdd_G": 255, "ColorAdd_B": 255, "ColorAdd_GY": 255, "StrobeRate": 0}}, "ETC@ColorSource CYC.gdtf": {"home": {"Dimmer": 0, "ColorAdd_R": 255, "ColorAdd_G": 255, "ColorAdd_B": 255, "ColorAdd_BM": 255, "ColorAdd_GY": 255, "StrobeModeStrobe": 0}, "lamp": {"Dimmer": 255, "ColorAdd_R": 255, "ColorAdd_G": 255, "ColorAdd_B": 255, "ColorAdd_BM": 255, "ColorAdd_GY": 255, "StrobeModeStrobe": 0}}, "High End Systems@Lonestar.gdtf": {"home": {"Pan": 128, "Tilt": 128, "Color Mix Mode": 0, "ColorSub_C": 255, "ColorSub_M": 255, "ColorSub_Y": 255, "CTO": 255, "ColorWheel1Mode": 48, "Color1": 0, "GoboWheel1Mode": 0, "Gobo1": 0, "Gobo1Mode": 0, "Gobo1Pos": 128, "Blade1A": 0, "Blade1B": 0, "Blade2A": 0, "Blade2B": 0, "Blade3A": 0, "Blade3B": 0, "Blade4A": 0, "Blade4B": 0, "ShaperRot": 128, "AnimationWheel1Pos": 0, "AnimationWheel1": 0, "Prism1Mode": 0, "Prism1": 0, "Prism2Mode": 0, "Prism2": 0, "Frost1": 0, "Frost2": 0, "Focus1": 128, "Zoom": 128, "Iris": 255, "Strobe1Mode": 0, "Strobe1": 255, "Dimmer": 0, "GlobalMSpeed": 0, "Control1": 0, "Fan1": 0}, "lamp": {"Pan": 128, "Tilt": 128, "Color Mix Mode": 0, "ColorSub_C": 0, "ColorSub_M": 0, "ColorSub_Y": 0, "CTO": 255, "ColorWheel1Mode": 0, "Color1": 0, "GoboWheel1Mode": 0, "Gobo1": 0, "Gobo1Mode": 0, "Gobo1Pos": 128, "Blade1A": 0, "Blade1B": 0, "Blade2A": 0, "Blade2B": 0, "Blade3A": 0, "Blade3B": 0, "Blade4A": 0, "Blade4B": 0, "ShaperRot": 128, "AnimationWheel1Pos": 0, "AnimationWheel1": 0, "Prism1Mode": 0, "Prism1": 0, "Prism2Mode": 0, "Prism2": 0, "Frost1": 0, "Frost2": 0, "Focus1": 128, "Zoom": 128, "Iris": 255, "Strobe1Mode": 0, "Strobe1": 255, "Dimmer": 255, "GlobalMSpeed": 0, "Control1": 0, "Fan1": 0}}, "ETC@S4 Series 2 Lustr.gdtf": {"home": {"ColorAdd_R": 255, "ColorAdd_GY": 0, "ColorAdd_RY": 0, "ColorAdd_G": 255, "ColorAdd_C": 0, "ColorAdd_B": 255, "ColorAdd_BM": 0, "Dimmer": 0, "Shutter1": 255, "Fans": 0}, "lamp": {"ColorAdd_R": 255, "ColorAdd_GY": 255, "ColorAdd_RY": 255, "ColorAdd_G": 255, "ColorAdd_C": 255, "ColorAdd_B": 255, "ColorAdd_BM": 255, "Dimmer": 255, "Shutter1": 255, "Fans": 0}}, "Chauvet Professional@COLOrado SOLO Bar 4.gdtf": {"home": {"Dimmer": 0, "ColorAdd_R": 256, "ColorAdd_G": 256, "ColorAdd_B": 256, "ColorAdd_W": 256, "ColorAdd_GY": 256, "CTC": 256, "Tint": 128, "ColorCrossfade": 255, "Shutter1": 0, "Color1": 0, "Control1": 0}, "lamp": {"Dimmer": 255, "ColorAdd_R": 255, "ColorAdd_G": 255, "ColorAdd_B": 255, "ColorAdd_W": 255, "ColorAdd_GY": 255, "CTC": 256, "Tint": 128, "ColorCrossfade": 255, "Shutter1": 0, "Color1": 0, "Control1": 0}}, "Chauvet Professional@COLOrado SOLO Bar 1.gdtf": {"home": {"Dimmer": 0, "ColorAdd_R": 256, "ColorAdd_G": 256, "ColorAdd_B": 256, "ColorAdd_W": 256, "ColorAdd_GY": 256, "CTC": 256, "Tint": 128, "ColorCrossfade": 255, "Shutter1": 0, "Color1": 0, "Control1": 0}, "lamp": {"Dimmer": 255, "ColorAdd_R": 255, "ColorAdd_G": 255, "ColorAdd_B": 255, "ColorAdd_W": 255, "ColorAdd_GY": 255, "CTC": 256, "Tint": 128, "ColorCrossfade": 255, "Shutter1": 0, "Color1": 0, "Control1": 0}}, "Martin Professional@MAC Aura.gdtf": {"home": {"Shutter1": 22, "Dimmer": 0, "Zoom": 128, "Pan": 128, "Tilt": 128, "Control1": 0, "Color1": 0, "ColorAdd_R": 0, "ColorAdd_G": 0, "ColorAdd_B": 0, "ColorAdd_W": 0, "CTC": 0, "Effects1": 0, "Effects1Rate": 128, "Effects2": 0, "Effects2Rate": 128, "EffectsSync": 0, "Color2": 0}, "lamp": {"Shutter1": 20, "Dimmer": 255, "Zoom": 128, "Pan": 128, "Tilt": 128, "Control1": 0, "Color1": 0, "ColorAdd_R": 255, "ColorAdd_G": 255, "ColorAdd_B": 255, "ColorAdd_W": 255, "CTC": 0, "Effects1": 0, "Effects1Rate": 128, "Effects2": 0, "Effects2Rate": 128, "EffectsSync": 0, "Color2": 0}}}''')


def _dmx():
    return getattr(bpy.context.scene, "dmx", None)


def _fixtures():
    d = _dmx()
    return list(getattr(d, "fixtures", [])) if d else []


def ensure_addon():
    """BlenderDMX must be enabled for scene.dmx to exist. Find it among installed add-ons/extensions and switch it on."""
    if hasattr(bpy.types.Scene, "dmx"):
        return "BlenderDMX enabled"
    import addon_utils
    hits = []
    for mod in addon_utils.modules():
        name = mod.__name__
        info = getattr(mod, "bl_info", {}) or {}
        label = str(info.get("name", "")).lower()
        if name.split(".")[-1].lower() in ("dmx", "blenderdmx", "blender_dmx") or "blenderdmx" in label or label == "dmx":
            hits.append(name)
    if not hits:
        raise RuntimeError("BlenderDMX isn't installed: Edit > Preferences > Get Extensions > search DMX > Install")
    addon_utils.enable(hits[0], default_set=True, persistent=True)
    if not hasattr(bpy.types.Scene, "dmx"):
        raise RuntimeError(f"found {hits[0]} but it didn't switch on: Edit > Preferences > Add-ons > tick DMX")
    try:
        bpy.ops.wm.save_userpref()
    except Exception:
        pass
    return f"BlenderDMX was off; switched it on ({hits[0]}) and saved it in Preferences"


def ensure_show():
    d = _dmx()
    if d is not None and getattr(d, "collection", None):
        return "BlenderDMX show already set up"
    bpy.ops.dmx.new_show()
    return "BlenderDMX show created"


def _live(f):
    coll = getattr(f, "collection", None)
    try:
        return bool(coll and len(coll.all_objects))
    except ReferenceError:
        return False


def rig_path():
    """The one rig file: <blend folder>/<blend name>.mvr"""
    fp = bpy.data.filepath
    if not fp:
        return None
    return os.path.splitext(fp)[0] + ".mvr"


def newest_download():
    files = glob.glob(os.path.join(os.path.expanduser("~/Downloads"), "*.mvr"))
    return max(files, key=os.path.getmtime) if files else None


def adopt_download():
    """Explicit, one-time: copy the newest Downloads .mvr into the rig slot."""
    src, dst = newest_download(), rig_path()
    if not dst:
        return "save the .blend first, the rig file lives beside it"
    if not src:
        return "no .mvr in ~/Downloads"
    shutil.copy2(src, dst)
    return f"copied {os.path.basename(src)} -> {os.path.basename(dst)}"


def _fx_uuid(f):
    return (getattr(f, "uuid", "") or "").upper()


def _patch_of(f):
    br = list(getattr(f, "dmx_breaks", []) or [])
    if br:
        return int(getattr(br[0], "universe", 0) or 0), int(getattr(br[0], "address", 0) or 0)
    return int(getattr(f, "universe", 0) or 0), int(getattr(f, "address", 0) or 0)


def plan_sync(pf, fixtures, last_sha):
    """Pure logic (unit-tested): what the sync will do, given the pre-flight and the fixtures in the file."""
    want = {r["uuid"].upper(): r for r in pf["fixtures"] if not r.get("skip")}
    skip = {r["uuid"].upper() for r in pf["fixtures"] if r.get("skip")}
    have = {_fx_uuid(f): f for f in fixtures}
    dead = [f for f in fixtures if not _live(f)]
    prune = [f for u, f in have.items() if u not in want]          # removed in VWX, or skipped (non-DMX)
    missing = [u for u in want if u not in have or not _live(have[u])]
    current = (pf["sha"] == last_sha) and not missing and not prune and not dead
    return dict(want=want, skip=skip, dead=dead, prune=prune, missing=missing, current=current)


def verify(pf, fixtures):
    """Every importable MVR fixture exists, has objects, and is patched where VWX says."""
    want = {r["uuid"].upper(): r for r in pf["fixtures"] if not r.get("skip")}
    have = {_fx_uuid(f): f for f in fixtures}
    fails, notes = [], []
    for u, r in want.items():
        f = have.get(u)
        if f is None:
            fails.append(f"{r['name']}: not in Blender after sync"); continue
        if not _live(f):
            fails.append(f"{r['name']}: record but no objects"); continue
        prof = str(getattr(f, "profile", "") or "")
        if prof and r["spec"] and os.path.basename(prof) != r["spec"]:
            fails.append(f"{r['name']}: profile {prof} != {r['spec']} (generic fallback?)")
        if r["abs"]:
            uni, addr = _patch_of(f)
            if (uni, addr) == (0, 0):
                notes.append(f"{r['name']}: couldn't read patch back, check by eye")
            elif addr != r["addr"] or uni not in (r["uni"], r["uni"] - 1):
                fails.append(f"{r['name']}: Blender {uni}/{addr}, VWX {r['uni']}/{r['addr']}")
    extra = [f.name for u, f in have.items() if u not in want]
    if extra:
        fails.append(f"{len(extra)} fixtures in Blender that VWX doesn't have: {', '.join(extra[:4])}")
    return fails, notes


def _call_addmvr(d, path):
    want = dict(import_focus_points=False, import_fixtures=True, import_trusses=False,
                import_scene_objects=False, import_projectors=False, import_video_screens=False,
                import_supports=False, use_high_mesh=True)
    fn = d.addMVR                                   # BlenderDMX's own synchronous import, post-steps included
    try:
        ok = set(inspect.signature(fn).parameters)
        kw = {k: v for k, v in want.items() if k in ok}
    except (TypeError, ValueError):
        kw = want
    fn(path, **kw)


def sync_rig(force=False):
    """Returns (status, lines). status: PASS | CURRENT | BLOCKED | MISSING | FAIL"""
    d = _dmx()
    if d is None:
        return "FAIL", ["no BlenderDMX show"]
    path = rig_path()
    if not path:
        return "MISSING", ["save the .blend first; the rig file lives beside it"]
    if not os.path.isfile(path):
        return "MISSING", [f"no rig file. In VWX: File > Export > Export MVR, fixtures layer only, save as {os.path.basename(path)} in {os.path.dirname(path)}"]
    pf = preflight(path, EXPECT_LAYER)
    lines = [f"rig {os.path.basename(path)} · {time.strftime('%Y-%m-%d %H:%M', time.localtime(os.path.getmtime(path)))} · sha {pf['sha']}",
             f"pre-flight: {len(pf['fixtures'])} fixtures in MVR, {len([r for r in pf['fixtures'] if r.get('skip')])} skipped (non-DMX)"]
    lines += [f"  WARN {w}" for w in pf["warn"]]
    if pf["block"]:
        lines += [f"  BLOCK {b}" for b in pf["block"]] + ["nothing imported: fix in VWX, re-export, run again"]
        return "BLOCKED", lines
    sc = bpy.context.scene
    p = plan_sync(pf, _fixtures(), "" if force else sc.get("maw_rig_sha", ""))
    if p["current"]:
        fails, notes = verify(pf, _fixtures())
        if not fails:
            return "CURRENT", lines + [f"rig current: {len(p['want'])} fixtures match the MVR, nothing to do"]
    for f in p["dead"]:
        try: d.removeFixture(f)
        except Exception as e: lines.append(f"  could not clear dead record {f.name}: {e}")
    _call_addmvr(d, path)
    p2 = plan_sync(pf, _fixtures(), "")
    for f in p2["prune"]:
        nm = f.name
        try:
            d.removeFixture(f); lines.append(f"  removed {nm} (not a DMX fixture in the MVR)")
        except Exception as e:
            lines.append(f"  could not remove {nm}: {e}")
    ensure_universes(max(UNIVERSES, pf["max_uni"] + 1))
    fails, notes = verify(pf, _fixtures())
    lines += [f"  NOTE {n}" for n in notes]
    if fails:
        return "FAIL", lines + [f"  FAIL {x}" for x in fails]
    sc["maw_rig_sha"] = pf["sha"]; sc["maw_rig_time"] = time.strftime("%Y-%m-%d %H:%M")
    return "PASS", lines + [f"synced: {len(p2['want'])} fixtures, every one patched where VWX says"]


def _length_m(v):
    """Vectorworks length -> metres. Numbers are document units (needs upi); strings may carry ' \" mm cm m."""
    if isinstance(v, (int, float)):
        return float(v)
    t = str(v).strip().lower().replace("\u2019", "'").replace("\u201d", '"')
    m = re.match(r"\s*(-?\d+(?:\.\d+)?)\s*'\s*-?\s*(?:(\d+(?:\.\d+)?)\s*\")?", t)     # 5'6" or 5'-6"
    if m:
        return float(m.group(1)) * 0.3048 + float(m.group(2) or 0) * 0.0254
    m = re.match(r"\s*(-?\d+(?:\.\d+)?)\s*(mm|cm|m|\")?", t)
    if not m:
        return 0.0
    n, u = float(m.group(1)), m.group(2)
    return {"mm": n / 1000, "cm": n / 100, "m": n, '"': n * 0.0254}.get(u, n)


def previs_root(start):
    """Walk up from a folder to the MAW_PREVIS root: the first folder that holds _LIBRARY."""
    d = os.path.abspath(start)
    while True:
        if os.path.isdir(os.path.join(d, "_LIBRARY")):
            return d
        up = os.path.dirname(d)
        if up == d:
            return None
        d = up


def venue_paths(blend_path):
    root = previs_root(os.path.dirname(blend_path)) if blend_path else None
    if not root:
        return None, None
    vdir = os.path.join(root, "_LIBRARY", "venue")
    return os.path.join(vdir, f"{VENUE}_venue.fbx"), os.path.join(vdir, f"{VENUE}_venue.blend")


def _sha(path):
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()[:16]


def _build_venue_blend(fbx, vblend):
    """Import the Vectorworks FBX into a VENUE collection, write just that to the venue .blend, clean up here."""
    before = set(bpy.data.objects)
    bpy.ops.import_scene.fbx(filepath=fbx)
    new = [o for o in bpy.data.objects if o not in before]
    col = bpy.data.collections.new("VENUE")
    for o in new:
        for c in list(o.users_collection):
            c.objects.unlink(o)
        col.objects.link(o)
    bpy.data.libraries.write(vblend, {col}, path_remap="RELATIVE_ALL", compress=True)
    lo_hi = _bbox(new)
    for o in new:
        bpy.data.objects.remove(o, do_unlink=True)
    bpy.data.collections.remove(col)
    with open(vblend + ".source.json", "w") as fh:
        json.dump({"fbx": os.path.basename(fbx), "sha": _sha(fbx), "built": time.strftime("%Y-%m-%d %H:%M"),
                   "objects": len(new)}, fh)
    size = (lo_hi[1] - lo_hi[0]) if lo_hi else None
    return len(new), size


def ensure_venue():
    """Rebuild the venue library when its FBX changed, then link VENUE into this file (once)."""
    fbx, vblend = venue_paths(bpy.data.filepath)
    if not fbx:
        return "no MAW_PREVIS/_LIBRARY folder above this file: venue not linked"
    notes = []
    if os.path.isfile(fbx):
        src = {}
        if os.path.isfile(vblend + ".source.json"):
            with open(vblend + ".source.json") as fh:
                src = json.load(fh)
        if not os.path.isfile(vblend) or src.get("sha") != _sha(fbx):
            n, size = _build_venue_blend(fbx, vblend)
            notes.append(f"built {os.path.basename(vblend)} from {os.path.basename(fbx)}: {n} objects"
                         + (f", {size.x:.1f} x {size.y:.1f} x {size.z:.1f} m (check that's SPAC-sized)" if size else ""))
            lib = next((l for l in bpy.data.libraries if os.path.abspath(bpy.path.abspath(l.filepath)) == vblend), None)
            if lib is not None:
                lib.reload(); notes.append("reloaded the linked venue")
    elif not os.path.isfile(vblend):
        return f"MISSING venue: export the SPAC venue from Vectorworks as FBX to {fbx}"
    venue = next((c for c in bpy.data.collections if c.name == "VENUE" and c.library is not None), None)
    if venue is None:
        with bpy.data.libraries.load(vblend, link=True, relative=True) as (src_data, dst_data):
            dst_data.collections = [c for c in src_data.collections if c == "VENUE"]
        venue = dst_data.collections[0] if dst_data.collections else None
        if venue is None:
            return f"FAIL {os.path.basename(vblend)} has no VENUE collection"
        notes.append(f"linked VENUE from {os.path.basename(vblend)}")
    if venue.name not in bpy.context.scene.collection.children:
        bpy.context.scene.collection.children.link(venue)
    return " · ".join(notes) or f"venue linked ({os.path.basename(vblend)})"


def bare_start(new_path):
    """Fresh file from the launcher: clear Blender's default cube/light/camera and save under the folder's name."""
    if bpy.data.filepath:
        return f"file already saved as {os.path.basename(bpy.data.filepath)}"
    for nm in ("Cube", "Light", "Camera"):
        o = bpy.data.objects.get(nm)
        if o is not None:
            bpy.data.objects.remove(o, do_unlink=True)
    bpy.ops.wm.save_as_mainfile(filepath=new_path, relative_remap=True)
    return f"new file {os.path.basename(new_path)}"


def polish():
    """Render + viewport settings that make it feel like a lighting viz, not a modelling session."""
    sc = bpy.context.scene
    notes = []
    try:
        prefs = bpy.context.preferences.addons["cycles"].preferences
        prefs.compute_device_type = "METAL"
        prefs.get_devices()
        for dev in prefs.devices:
            dev.use = True
        sc.cycles.device = "GPU"; notes.append("GPU (Metal)")
    except Exception:
        notes.append("CPU")
    for attr, val in (("max_bounces", 6), ("volume_bounces", 1), ("transparent_max_bounces", 8),
                      ("sample_clamp_indirect", 10.0), ("samples", 256), ("use_denoising", True)):
        try: setattr(sc.cycles, attr, val)
        except Exception: pass
    try:
        sc.view_settings.view_transform = "AgX"
        sc.view_settings.look = "AgX - Medium High Contrast"; notes.append("AgX Medium High Contrast")
    except Exception:
        pass
    sc.render.fps = sc.render.fps or 24
    sc.render.resolution_x, sc.render.resolution_y = 1920, 1080
    for win in bpy.context.window_manager.windows:
        for area in win.screen.areas:
            if area.type == "VIEW_3D":
                ov = area.spaces.active.overlay
                for a in ("show_floor", "show_axis_x", "show_axis_y", "show_cursor"):
                    if hasattr(ov, a): setattr(ov, a, False)
    return "render polish: " + ", ".join(notes) + ", 256 samples + denoise, 1920x1080, clean overlays"



def ensure_universes(n=UNIVERSES):
    d = _dmx()
    if d is None:
        return "no BlenderDMX show in this file (click Create New Show)"
    if getattr(d, "universes_n", 0) < n:
        d.universes_n = n
    while len(d.universes) < n:                     # fallback if the update callback didn't grow it
        u = d.universes.add(); i = len(d.universes) - 1; u.id = i; u.name = f"Universe {i}"
    return f"{len(d.universes)} universes (0-{len(d.universes) - 1})"


def set_mode(mode):
    """PLAY = Programmer drives every universe. EOS = universes 1-63 read sACN."""
    d = _dmx()
    if d is None:
        return "no BlenderDMX show"
    src = "sACN" if mode == "EOS" else "BLENDERDMX"
    for i, u in enumerate(d.universes):
        if i == 0:
            continue                                  # 0 is invalid for sACN
        u.input = src
    try:
        d.sacn_enabled = (mode == "EOS")
    except Exception as e:
        return f"inputs -> {src}, but sACN switch failed: {e}"
    return f"{mode} mode: universes 1-{len(d.universes) - 1} -> {src}" + (", sACN listening" if mode == "EOS" else "")


def look():
    """Black void to the camera, a dim house ambient on every surface, haze in the air."""
    sc = bpy.context.scene
    w = sc.world or bpy.data.worlds.new("MAW Previz World")
    sc.world = w
    w.use_nodes = True
    nt = w.node_tree
    out = next((n for n in nt.nodes if n.type == "OUTPUT_WORLD"), None) or nt.nodes.new("ShaderNodeOutputWorld")
    for n in list(nt.nodes):                          # rebuild the surface side; keep the output and the haze
        if n.type in ("BACKGROUND", "LIGHT_PATH", "MIX_SHADER"):
            nt.nodes.remove(n)
    amb = nt.nodes.new("ShaderNodeBackground"); amb.name = amb.label = "MAW Ambient"
    amb.inputs["Color"].default_value = (1.0, 0.92, 0.82, 1)      # warm, like house spill
    void = nt.nodes.new("ShaderNodeBackground"); void.name = void.label = "MAW Void"
    void.inputs["Color"].default_value = (0, 0, 0, 1); void.inputs["Strength"].default_value = 0.0
    lp = nt.nodes.new("ShaderNodeLightPath"); lp.name = "MAW Camera Ray"
    mix = nt.nodes.new("ShaderNodeMixShader"); mix.name = "MAW Ambient Mix"
    nt.links.new(lp.outputs["Is Camera Ray"], mix.inputs["Fac"])
    nt.links.new(amb.outputs[0], mix.inputs[1])        # everything that isn't the camera sees the ambient
    nt.links.new(void.outputs[0], mix.inputs[2])       # the camera looking into nothing sees black
    nt.links.new(mix.outputs[0], out.inputs["Surface"])
    if P_AMBIENT not in sc:
        sc[P_AMBIENT] = AMBIENT
    sc.id_properties_ui(P_AMBIENT).update(min=0.0, max=0.5, soft_min=0.0, soft_max=0.2,
                                          description="House ambient on every surface (0.05 = 5%). The camera still sees a black void")
    s_in = amb.inputs["Strength"]
    s_in.driver_remove("default_value")
    drv = s_in.driver_add("default_value").driver
    drv.type = "SCRIPTED"
    v = drv.variables.new(); v.name = "a"; v.type = "SINGLE_PROP"
    v.targets[0].id_type = "SCENE"; v.targets[0].id = sc; v.targets[0].data_path = f'["{P_AMBIENT}"]'
    drv.expression = "a"
    vol = nt.nodes.get("MAW Haze") or nt.nodes.new("ShaderNodeVolumePrincipled")
    vol.name = vol.label = "MAW Haze"
    vol.inputs["Density"].default_value = HAZE
    if "Anisotropy" in vol.inputs:
        vol.inputs["Anisotropy"].default_value = 0.3      # forward scatter: beams read from FOH
    nt.links.new(vol.outputs[0], out.inputs["Volume"])
    sc.render.engine = "CYCLES"
    try:
        sc.cycles.preview_samples = 16
        sc.cycles.use_preview_denoising = True
    except Exception:
        pass
    return f"world: black void to camera, house ambient {sc[P_AMBIENT] * 100:.0f}%, haze {HAZE}, Cycles"


CAM_TIERS = ("VENUE", "SCENIC", "RENDER")     # 11-19 contract: a camera lives in the file that owns its position


def _bbox(objs):
    pts = []
    for o in objs:
        if o.type == "MESH" and o.data and len(o.data.vertices):
            pts += [o.matrix_world @ Vector(c) for c in o.bound_box]
        else:
            pts.append(o.matrix_world.translation)
    if not pts:
        return None
    lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    return lo, hi


def _col(name, parent):
    c = bpy.data.collections.get(name) or bpy.data.collections.new(name)
    if c.name not in parent.children:
        parent.children.link(c)
    return c


def _level_cam(name, col, loc, target, lens=24.0, ortho=None, owner="GUESS"):
    """Level camera (no tilt): aims by heading only, frames height with Shift Y so verticals stay square.
    owner VWX: Vectorworks owns the position, so every run re-places it. GUESS: placed once, then your hands win."""
    cam = bpy.data.objects.get(name)
    if owner == "GUESS" and cam is not None and cam.get("maw_placed"):
        return cam                                  # your hands win: re-running never moves a placed camera
    if cam is None:
        cam = bpy.data.objects.new(name, bpy.data.cameras.new(name))
    cam["maw_placed"] = True                        # delete the camera to have Previz re-place it
    cam["maw_owner"] = owner
    for c in list(cam.users_collection):
        c.objects.unlink(cam)
    col.objects.link(cam)
    d = cam.data
    d.clip_start, d.clip_end = 0.1, 300.0          # SPAC-sized house: default 100 m clips the back
    d.sensor_fit = "HORIZONTAL"; d.sensor_width = 36.0
    cam.location = loc
    if ortho:                                       # straight down plan view
        d.type = "ORTHO"; d.ortho_scale = ortho
        cam.rotation_euler = (0.0, 0.0, 0.0)
        d.shift_x = d.shift_y = 0.0
        return cam
    d.type = "PERSP"; d.lens = lens
    v = target - loc
    heading = math.atan2(-v.x, v.y)                 # rotate about Z so the camera faces the target
    cam.rotation_euler = (math.radians(90.0), 0.0, heading)
    dist = max(0.5, Vector((v.x, v.y)).length)
    d.shift_x = 0.0
    d.shift_y = max(-0.6, min(0.6, (v.z / dist) * lens / d.sensor_width))
    return cam


def cameras_path():
    fp = bpy.data.filepath
    return (os.path.splitext(fp)[0] + ".cameras.json") if fp else None


def _field(fields, *wanted):
    """Find a Renderworks Camera field by loose name (case, spaces, hyphens ignored)."""
    norm = {re.sub(r"[^a-z]", "", k.lower()): v for k, v in fields.items()}
    for w in wanted:
        v = norm.get(re.sub(r"[^a-z]", "", w.lower()))
        if v not in (None, ""):
            return v
    return None


def rw_camera(rc):
    """Pure logic (unit-tested): one Renderworks Camera from the Vectorworks dump -> eye, aim, lens.
    rc: dict(name, layer, xyz_m (insertion point, metres), rot_deg, fields{...})."""
    f = rc.get("fields", {})
    fm = rc.get("fields_m", {})                       # lengths Vectorworks already converted to metres

    def length(*names):
        v = _field(fm, *names)
        if v is not None:
            return float(v)
        v = _field(f, *names)
        return _length_m(v) if v is not None else None
    raw = str(rc.get("name") or _field(f, "Name") or "").strip()
    layer = str(rc.get("layer", "")).upper()
    if not layer.startswith("CAM "):                 # presentation cameras elsewhere in the drawing stay out
        return None, f"ignored camera {raw or '(unnamed)'}: on layer '{rc.get('layer', '')}', not a CAM layer"
    if not raw:
        return None, f"unnamed camera on {rc.get('layer', '')} skipped (name it in Object Info)"
    nm = " ".join(raw.upper().split())
    nm = nm if nm.startswith("CAM ") else "CAM " + nm
    tier = next((t for t in CAM_TIERS if t in layer), "VENUE")
    x, y, z = (float(c) for c in rc.get("xyz_m", (0, 0, 0)))
    h = length("Camera Height", "Height") or 0.0
    look_h = length("Look To Height", "LookTo Height", "Look-To Height")
    look_h = h if look_h is None else look_h
    dist = length("Camera Distance", "Look To Distance", "Distance") or 10.0
    lx, ly = length("Look To X", "LookTo X"), length("Look To Y", "LookTo Y")
    if lx is not None and ly is not None:
        ax, ay = lx, ly
    else:
        a = math.radians(float(rc.get("rot_deg", 0.0)) + CAM_ROT0)
        ax, ay = x + dist * math.cos(a), y + dist * math.sin(a)
    lens = _field(f, "Focal Length", "Lens")
    try:
        lens = float(re.match(r"\s*(\d+(?:\.\d+)?)", str(lens)).group(1)) if lens is not None else 35.0
    except Exception:
        lens = 35.0
    return dict(name=nm, tier=tier, eye=(x, y, z + h), aim=(ax, ay, z + look_h), lens=lens), None


def parse_cameras(data):
    """Pure logic (unit-tested): pair CAM <name> with AIM <name> loci. Returns (cams, problems).
    cams: [dict(name, tier, eye(x,y,z m), aim, lens)]. Lens from a trailing number: 'CAM REP CENTER 35' = 35 mm."""
    eyes, aims, problems = {}, {}, []
    for p in data.get("points", []):
        nm = " ".join(str(p.get("name", "")).upper().split())
        layer = str(p.get("layer", "")).upper()
        tier = next((t for t in CAM_TIERS if t in layer), "VENUE")
        xyz = tuple(float(c) for c in p.get("xyz_m", (0, 0, 0)))
        if nm.startswith(("CAM ", "AIM ")) and not layer.startswith("CAM "):
            problems.append(f"ignored locus {nm}: on layer '{p.get('layer', '')}', not a CAM layer"); continue
        if nm.startswith("CAM "):
            m = re.match(r"^CAM (.+?)(?: (\d{2,3}))?$", nm)
            key, lens = m.group(1), float(m.group(2)) if m.group(2) else 35.0
            if key in eyes:
                problems.append(f"two loci named CAM {key}")
            eyes[key] = dict(name=f"CAM {key}", tier=tier, eye=xyz, lens=lens)
        elif nm.startswith("AIM "):
            aims[nm[4:]] = xyz
    for rc in data.get("cameras", []):            # Renderworks Camera objects
        c, why = rw_camera(rc)
        if c is None:
            problems.append(why); continue
        key = c["name"][4:]
        if key in eyes:
            problems.append(f"two cameras named {c['name']}")
        eyes[key] = c; aims[key] = c["aim"]
    cams = []
    for key, c in sorted(eyes.items()):
        if key not in aims:
            problems.append(f"CAM {key} has no AIM {key}, skipped"); continue
        c["aim"] = aims[key]; cams.append(c)
    for key in sorted(set(aims) - set(eyes)):
        problems.append(f"AIM {key} has no CAM {key}")
    return cams, problems


CAM_INBOX = "~/Desktop/maw_vwx_cameras.json"     # where vwx_dump_cameras.py writes


def adopt_camera_dump():
    """Pull a fresh Vectorworks camera dump from the Desktop into <blend>.cameras.json, announced, never silent.
    Refuses a dump from a different Vectorworks file than last time (stale file from another show)."""
    src, dst = os.path.expanduser(CAM_INBOX), cameras_path()
    if not dst or not os.path.isfile(src):
        return None
    if os.path.isfile(dst) and os.path.getmtime(src) <= os.path.getmtime(dst):
        return None
    with open(src, encoding="utf-8") as fh:
        vwx = str(json.load(fh).get("file", "?"))
    sc = bpy.context.scene
    prev = sc.get("maw_cam_source")
    if prev and prev != vwx:
        return f"WARN camera dump on the Desktop is from {vwx}, this file takes cameras from {prev}: not used"
    shutil.copy2(src, dst); sc["maw_cam_source"] = vwx
    return f"took the new camera dump from {vwx}"


def cameras():
    sc = bpy.context.scene
    root = _col("CAMERAS", sc.collection)
    tiers = {t: _col(f"CAM {t}", root) for t in CAM_TIERS}
    note = adopt_camera_dump()
    cp = cameras_path()
    if cp and os.path.isfile(cp):
        with open(cp, encoding="utf-8") as fh:
            data = json.load(fh)
        cams, problems = parse_cameras(data)
        for c in cams:
            _level_cam(c["name"], tiers[c["tier"]], Vector(c["eye"]), Vector(c["aim"]), lens=c["lens"], owner="VWX")
        names = {c["name"] for c in cams}
        old_col = _col("CAM OLD GUESSES", root)
        old_col.hide_viewport = old_col.hide_render = True
        parked = 0
        for t in tiers.values():                     # guessed cameras step aside, never deleted (his tweaks survive)
            for o in list(t.objects):
                if o.type == "CAMERA" and o.get("maw_owner", "GUESS") != "VWX" and o.name not in names:
                    t.objects.unlink(o); old_col.objects.link(o); parked += 1
        if parked:
            problems.append(f"{parked} guessed cameras moved to CAM OLD GUESSES (hidden)")
        gone = 0
        for t in tiers.values():                     # deleted or renamed in Vectorworks: park it, say so
            for o in list(t.objects):
                if o.type == "CAMERA" and o.get("maw_owner") == "VWX" and o.name not in names:
                    t.objects.unlink(o); old_col.objects.link(o); gone += 1
                    problems.append(f"{o.name} is no longer in Vectorworks: parked in CAM OLD GUESSES")
        venue = [o for o in sc.objects if o.type == "MESH" and o.users_collection
                 and any(c.name.startswith("VENUE") for c in o.users_collection)]
        vb = _bbox(venue) if venue else None
        for c in cams:                               # one line per camera, and a tell for a wrong origin/elevation
            e = c["eye"]
            line = f"{c['name']} [{c['tier']}] eye {e[0]:.1f}, {e[1]:.1f}, {e[2]:.2f} m · {c['lens']:.0f} mm"
            if vb and not all(vb[0][i] - 2.0 <= e[i] <= vb[1][i] + 2.0 for i in range(3)):
                line += " · OUTSIDE the venue: check user origin = CL x PL and CAM layer elevation 0"
            problems.append(line)
        if note:
            problems.insert(0, note)
        if cams:
            first = next((c for c in cams if c["tier"] == "RENDER"), cams[0])
            sc.camera = bpy.data.objects.get(first["name"])
        stamp = time.strftime("%Y-%m-%d %H:%M", time.localtime(os.path.getmtime(cp)))
        return (f"{len(cams)} cameras from Vectorworks ({os.path.basename(cp)}, {stamp}), active {getattr(sc.camera, 'name', 'none')}"
                + ("".join(f" | WARN {x}" for x in problems)))
    return "GUESSED cameras (no " + (os.path.basename(cp) if cp else "camera file") + " from Vectorworks yet): " + guessed_cameras()


def guessed_cameras():
    sc = bpy.context.scene
    root = _col("CAMERAS", sc.collection)
    tiers = {t: _col(f"CAM {t}", root) for t in CAM_TIERS}
    dmx = bpy.data.collections.get("DMX")
    rig = _bbox(list(dmx.all_objects)) if dmx else None
    venue_objs = [o for o in sc.objects if o.type == "MESH" and not (dmx and o.name in dmx.all_objects)]
    venue = _bbox(venue_objs) or rig
    if venue is None:
        return "no geometry to frame"
    vlo, vhi = venue
    house_y = min(vlo.y, -6.0)                      # audience side is -Y (CL x PL origin, figures face -Y)
    deck = Vector((0.0, max(2.0, vhi.y * 0.35), 0.0))
    made = []
    # VENUE tier: positions the building owns
    made.append(_level_cam("CAM OVERHEAD", tiers["VENUE"], Vector((0.0, deck.y, vhi.z + 2.0)), deck,
                           ortho=max(vhi.x - vlo.x, vhi.y - vlo.y, 10.0)))
    made.append(_level_cam("CAM REP CENTER", tiers["VENUE"], Vector((0.0, house_y * 0.55, 1.2)), deck + Vector((0, 0, 1.5)), lens=35))
    made.append(_level_cam("CAM REP BACK", tiers["VENUE"], Vector((0.0, house_y * 0.9, 2.4)), deck + Vector((0, 0, 1.5)), lens=28))
    # SCENIC tier: audience seats follow the seating arrangement, so they live in the scenery file
    made.append(_level_cam("CAM SEAT HL", tiers["SCENIC"], Vector((vlo.x * 0.6, house_y * 0.5, 1.2)), deck + Vector((0, 0, 1.2)), lens=35))
    made.append(_level_cam("CAM SEAT HR", tiers["SCENIC"], Vector((vhi.x * 0.6, house_y * 0.5, 1.2)), deck + Vector((0, 0, 1.2)), lens=35))
    # RENDER tier: show-owned framings
    made.append(_level_cam("CAM RENDER WIDE", tiers["RENDER"], Vector((0.0, house_y * 0.8, 1.7)), deck + Vector((0, 0, 2.0)), lens=24))
    if rig:
        rlo, rhi = rig
        rc = (rlo + rhi) / 2
        span = max((rhi - rlo).x, (rhi - rlo).y, 4.0)
        made.append(_level_cam("CAM RIG", tiers["RENDER"], Vector((rc.x, rlo.y - max(8.0, 1.6 * span), 1.7)),
                               Vector((rc.x, rc.y, rc.z * 0.6)), lens=24))
    old = bpy.data.objects.get("BENCH CAM")
    if old is not None:
        bpy.data.objects.remove(old, do_unlink=True)
    sc.camera = bpy.data.objects.get("CAM RIG") or bpy.data.objects.get("CAM RENDER WIDE")
    return f"{len(made)} cameras in CAMERAS/VENUE·SCENIC·RENDER, active {sc.camera.name}"


def use_camera(name):
    cam = bpy.data.objects.get(name)
    if cam is None:
        return f"{name} not found (run Set up previz)"
    bpy.context.scene.camera = cam
    rendered_view()
    return f"looking through {name}"


def _fixture_lights(f):
    coll = getattr(f, "collection", None)
    objs = coll.all_objects if coll else [o for o in bpy.data.objects if o.name.startswith(f.name)]
    return [o for o in objs if o.type == "LIGHT" and o.data.type == "SPOT"]


def lenses_from_names():
    done, skipped = 0, 0
    for f in _fixtures():
        m = re.search(r"(\d+)\s*deg", f.name)
        if not m:
            continue
        lights = _fixture_lights(f)
        if not lights:
            skipped += 1; continue
        for L in lights:
            L.data.spot_size = math.radians(float(m.group(1)))
        done += 1
    return f"lens angles set from names on {done} fixtures" + (f", {skipped} had no spot light found" if skipped else "")


def _values(f, which):
    prof = str(getattr(f, "profile", "") or "")
    key = next((k for k in LAMP if k.lower() == prof.lower() or k.lower() in prof.lower() or prof.lower() in k.lower()), None)
    if key:
        return LAMP[key][which]
    return {"Dimmer": 255 if which == "lamp" else 0}


def lamp_test(on=True):
    set_mode("PLAY")
    n, bad = 0, []
    for f in _fixtures():
        try:
            f.setDMX(_values(f, "lamp" if on else "home")); n += 1
        except Exception as e:
            bad.append(f"{f.name}: {e}")
    d = _dmx()
    if d is not None and hasattr(d, "render"):
        d.render()
    return f"lamp test {'ON' if on else 'off (home)'} on {n} fixtures" + (f"; failed: {bad[:3]}" if bad else "")


def rendered_view():
    n = 0
    for win in bpy.context.window_manager.windows:
        for area in win.screen.areas:
            if area.type == "VIEW_3D":
                sp = area.spaces.active
                sp.shading.type = "RENDERED"
                if sp.region_3d and bpy.context.scene.camera:
                    sp.region_3d.view_perspective = "CAMERA"
                n += 1
    return f"{n} viewport(s) Rendered through {getattr(bpy.context.scene.camera, 'name', 'no camera')}"


def _write_report(lines):
    txt = bpy.data.texts.get("Previz report") or bpy.data.texts.new("Previz report")
    txt.clear(); txt.write("\n".join(lines) + "\n")
    if bpy.data.filepath:
        folder = os.path.join(os.path.dirname(bpy.data.filepath), "previz_reports")
        os.makedirs(folder, exist_ok=True)
        with open(os.path.join(folder, time.strftime("%Y-%m-%d_%H%M%S") + ".txt"), "w") as fh:
            fh.write("\n".join(lines) + "\n")
    print("\n".join(lines))


def setup(force=False):
    sc = bpy.context.scene
    lines = [f"MAW Previz v{VERSION} · Blender {bpy.app.version_string} · {time.strftime('%Y-%m-%d %H:%M')}"]
    for step in (ensure_addon, ensure_show):
        try: lines.append("OK   " + step())
        except Exception as e:
            lines.append(f"FAIL {step.__name__}: {e}"); sc["maw_rig_status"] = "FAIL"; _write_report(lines); return lines
    try:
        status, rl = sync_rig(force)
    except Exception as e:
        status, rl = "FAIL", [f"sync crashed: {e!r}"]
    sc["maw_rig_status"] = status
    lines.append(f"RIG  {status}"); lines += ["     " + x for x in rl]
    steps = [ensure_universes, ensure_venue, look, polish, cameras, lenses_from_names, rendered_view]
    if status in ("PASS", "CURRENT"):
        steps.insert(-1, lambda: lamp_test(True))
    for step in steps:
        try: lines.append("OK   " + step())
        except Exception as e: lines.append(f"FAIL {getattr(step, '__name__', 'step')}: {e}")
    _embed_self()
    if status == "PASS" and bpy.data.filepath:
        try:
            bpy.ops.wm.save_mainfile(); lines.append("OK   saved (previous version kept as .blend1)")
        except Exception as e:
            lines.append(f"WARN not saved: {e}")
    _write_report(lines)
    return lines


def _embed_self():
    """Keep a copy of this script inside the .blend so the Previz tab survives without the launcher."""
    try:
        here = os.path.abspath(__file__)
        if os.path.isfile(here):
            t = bpy.data.texts.get("maw_previz.py") or bpy.data.texts.new("maw_previz.py")
            t.clear(); t.write(open(here).read()); t.use_module = True
    except Exception:
        pass


class MAW_OT_previz(bpy.types.Operator):
    bl_idname = "maw.previz"
    bl_label = "Previz"
    bl_options = {"REGISTER", "UNDO"}
    action: bpy.props.StringProperty(default="SETUP")
    cam: bpy.props.StringProperty(default="")

    def execute(self, context):
        a = self.action
        if a == "CAM":
            self.report({"INFO"}, use_camera(self.cam)); return {"FINISHED"}
        msg = {"SETUP": lambda: " | ".join(setup()[1:]), "PLAY": lambda: set_mode("PLAY"),
               "EOS": lambda: set_mode("EOS"), "LAMP": lambda: lamp_test(True),
               "HOME": lambda: lamp_test(False),
               "SYNC": lambda: " | ".join(setup()[1:4]),
               "RESYNC": lambda: " | ".join(setup(force=True)[1:4]),
               "ADOPT": adopt_download}[a]()
        self.report({"INFO"}, f"Previz v{VERSION}: {msg}"[:250])
        return {"FINISHED"}


class MAW_PT_previz(bpy.types.Panel):
    bl_label = f"Previz v{VERSION}"
    bl_space_type = "VIEW_3D"; bl_region_type = "UI"; bl_category = "Previz"

    def draw(self, context):
        L = self.layout
        d = _dmx()
        if not hasattr(bpy.types.Scene, "dmx"):
            L.alert = True
            L.label(text="BlenderDMX is switched off", icon="ERROR")
            L.label(text="Set up previz will switch it on")
            L.alert = False
        else:
            sc = context.scene
            st = sc.get("maw_rig_status", "not synced")
            box = L.box()
            row = box.row(); row.alert = st in ("BLOCKED", "FAIL", "MISSING")
            row.label(text=f"RIG {st} · {len([f for f in _fixtures() if _live(f)])} fixtures",
                      icon="CHECKMARK" if st in ("PASS", "CURRENT") else "ERROR")
            rp = rig_path()
            box.label(text=(os.path.basename(rp) if rp else "save the .blend first"), icon="FILE")
            if sc.get("maw_rig_time"):
                box.label(text=f"last sync {sc['maw_rig_time']}")
            if rp and not os.path.isfile(rp) and newest_download():
                box.operator("maw.previz", text=f"Use {os.path.basename(newest_download())[:28]}", icon="IMPORT").action = "ADOPT"
            r = box.row(align=True)
            r.operator("maw.previz", text="Sync rig", icon="FILE_REFRESH").action = "SYNC"
            r.operator("maw.previz", text="Force", icon="LOOP_BACK").action = "RESYNC"
        L.operator("maw.previz", text="Set up previz", icon="LIGHT_SPOT").action = "SETUP"
        if P_AMBIENT in context.scene:
            L.prop(context.scene, f'["{P_AMBIENT}"]', text="House ambient", slider=True)
        r = L.row(align=True)
        r.operator("maw.previz", text="Play (Programmer)").action = "PLAY"
        r.operator("maw.previz", text="Eos (sACN)").action = "EOS"
        r = L.row(align=True)
        r.operator("maw.previz", text="Lamp test").action = "LAMP"
        r.operator("maw.previz", text="All home").action = "HOME"
        if d is not None:
            L.label(text="sACN: " + str(getattr(d, "sacn_status", "?")))
        root = bpy.data.collections.get("CAMERAS")
        if root:
            for tier in root.children:
                if tier.hide_viewport:
                    continue
                box = L.box(); box.label(text=tier.name)
                col = box.column(align=True)
                for cam in sorted(tier.objects, key=lambda o: o.name):
                    if cam.type != "CAMERA":
                        continue
                    op = col.operator("maw.previz", text=cam.name.replace("CAM ", ""),
                                      depress=(context.scene.camera == cam), icon="CAMERA_DATA")
                    op.action = "CAM"; op.cam = cam.name


CLASSES = (MAW_OT_previz, MAW_PT_previz)
RETIRED = ("MAW_PT_bench", "MAW_OT_bench")   # v0.1-v0.3 names


def register():
    for name in RETIRED:
        old = getattr(bpy.types, name, None)
        if old is not None:
            try: bpy.utils.unregister_class(old)
            except Exception: pass
    for c in CLASSES:
        old = getattr(bpy.types, c.__name__, None)
        if old is not None:
            try: bpy.utils.unregister_class(old)
            except Exception: pass
        bpy.utils.register_class(c)


if __name__ == "__main__":
    register()
    for t in bpy.data.texts:                        # keep the Previz tab when the file reopens
        head = t.as_string()[:20]
        if head.startswith("# MAW Previz v") and t.name != "maw_previz.py":
            t.use_module = False         # older pasted copies: the embedded one wins
        elif head.startswith("# MAW Bench v"):
            t.use_module = False         # retire the old Bench tab
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    if "--new" in argv:
        print("MAW Previz:", bare_start(argv[argv.index("--new") + 1]))
    setup()
elif __name__.endswith(".py"):
    register()
