# MAW Previz camera tests · run: python3 tests/test_cameras.py   (pure Python, no Blender)
import sys, types, os, importlib.util
from types import SimpleNamespace as NS
bpy = types.ModuleType('bpy')
class _T:
    class Operator: pass
    class Panel: pass
bpy.types = _T; bpy.props = NS(StringProperty=lambda **k: None)
bpy.context = NS(scene=NS(dmx=None)); bpy.data = NS(filepath='/x/SPAC_CHANNEL_CHECK.blend')
sys.modules['bpy'] = bpy
mu = types.ModuleType('mathutils'); mu.Vector = object; sys.modules['mathutils'] = mu
HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('mp', os.path.join(HERE, '..', 'maw_previz.py')); mp = importlib.util.module_from_spec(spec); spec.loader.exec_module(mp)
ok = 0
def check(name, cond):
    global ok
    print(('PASS ' if cond else 'FAIL ') + name); ok += bool(cond)
    if not cond: raise SystemExit(1)
P = lambda n, layer, xyz: {"name": n, "layer": layer, "xyz_m": xyz}
data = {"points": [P("CAM REP CENTER 35", "CAM VENUE", (0, -12, 1.2)), P("AIM REP CENTER", "CAM VENUE", (0, 3, 1.5)),
                   P("cam  seat hl", "CAM SCENIC", (-5, -8, 1.1)), P("AIM SEAT HL", "CAM SCENIC", (0, 3, 1.2)),
                   P("CAM WIDE 24", "CAM RENDER", (0, -15, 1.7)), P("AIM WIDE", "CAM RENDER", (0, 4, 2)),
                   P("CAM LONELY", "CAM VENUE", (1, 1, 1)), P("AIM ORPHAN", "CAM VENUE", (2, 2, 2))]}
cams, problems = mp.parse_cameras(data)
by = {c['name']: c for c in cams}
check('camera file = blend name + .cameras.json', mp.cameras_path() == '/x/SPAC_CHANNEL_CHECK.cameras.json')
check('three paired cameras', sorted(by) == ['CAM REP CENTER', 'CAM SEAT HL', 'CAM WIDE'])
check('lens from trailing number', by['CAM REP CENTER']['lens'] == 35 and by['CAM WIDE']['lens'] == 24)
check('default lens 35 when none given', by['CAM SEAT HL']['lens'] == 35)
check('names normalised (case, double spaces)', 'CAM SEAT HL' in by)
check('tier from layer', [by[n]['tier'] for n in ('CAM REP CENTER', 'CAM SEAT HL', 'CAM WIDE')] == ['VENUE', 'SCENIC', 'RENDER'])
check('aim attached', by['CAM WIDE']['aim'] == (0.0, 4.0, 2.0))
check('CAM without AIM reported, skipped', any('CAM LONELY has no AIM' in p for p in problems) and 'CAM LONELY' not in by)
check('AIM without CAM reported', any('AIM ORPHAN has no CAM' in p for p in problems))
print(f'{ok}/{ok} PASS')
# ---- v0.6: Renderworks Camera objects, lengths, venue paths
rc = {"name": "Rep Center", "layer": "CAM VENUE", "xyz_m": (0.0, -12.0, 0.0), "rot_deg": 90.0,
      "fields": {"Camera Height": "5'-6\"", "Look To Height": "4'", "Camera Distance": "40'", "Focal Length": "35mm"},
      "fields_m": {}}
c, why = mp.rw_camera(rc)
check('RW camera named CAM + upper', c['name'] == 'CAM REP CENTER')
check("5'-6\" camera height = 1.676 m", abs(c['eye'][2] - 1.6764) < 1e-3)
check('look-to height 4 ft', abs(c['aim'][2] - 1.2192) < 1e-3)
check('rotation 90 looks +Y (CAM_ROT0 0 = +X)', abs(c['aim'][0]) < 1e-6 and abs(c['aim'][1] - (-12 + 12.192)) < 1e-3)
check('lens from Focal Length', c['lens'] == 35.0)
rc2 = dict(rc, fields={"Camera Height": "x"}, fields_m={"Camera Height": 1.5, "Look To X": 2.0, "Look To Y": 5.0})
c2, _ = mp.rw_camera(rc2)
check('metres from Vectorworks win; explicit look-to X/Y used', c2['eye'][2] == 1.5 and c2['aim'][:2] == (2.0, 5.0))
check('unnamed camera refused with a reason', mp.rw_camera({"fields": {}})[0] is None)
cams2, probs2 = mp.parse_cameras({"cameras": [rc, dict(rc, name="CAM RENDER WIDE", layer="CAM RENDER")], "points": []})
check('RW cameras flow through parse_cameras with tiers', sorted((x['name'], x['tier']) for x in cams2) == [('CAM RENDER WIDE', 'RENDER'), ('CAM REP CENTER', 'VENUE')])
check('lengths: mm, cm, m, inches, bare', [round(mp._length_m(v), 4) for v in ("2286mm", "228.6cm", "2.286m", '90"', 2.286)] == [2.286] * 5)
import tempfile
root = tempfile.mkdtemp(); os.makedirs(os.path.join(root, "_LIBRARY", "SPAC_CHANNEL_CHECK")); os.makedirs(os.path.join(root, "_SHOWS", "2026_SFANW"))
fbx, vb = mp.venue_paths(os.path.join(root, "_LIBRARY", "SPAC_CHANNEL_CHECK", "SPAC_CHANNEL_CHECK.blend"))
check('channel check finds _LIBRARY/venue/SPAC_venue.*', fbx == os.path.join(root, "_LIBRARY", "venue", "SPAC_venue.fbx") and vb.endswith("SPAC_venue.blend"))
fbx2, _ = mp.venue_paths(os.path.join(root, "_SHOWS", "2026_SFANW", "previz_01_opening.blend"))
check('show file finds the same venue', fbx2 == fbx)
check('no MAW_PREVIS root = no venue path', mp.venue_paths('/tmp/nowhere/x.blend') == (None, None))
print(f'{ok}/{ok} PASS (with v0.6 checks)')
