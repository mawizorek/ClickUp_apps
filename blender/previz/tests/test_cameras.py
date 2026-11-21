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
