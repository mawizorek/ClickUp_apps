# MAW Previz rig-sync tests · run: python3 tests/test_sync.py /path/to/SPAC_CHANNEL_CHECK.mvr
# Pure Python, no Blender. Asserts written against Michael's inventory MVR (2026-11-21, 21 devices).
import sys, types
from types import SimpleNamespace as NS
bpy = types.ModuleType('bpy')
class _T: 
    class Operator: pass
    class Panel: pass
bpy.types = _T; bpy.props = NS(StringProperty=lambda **k: None)
bpy.context = NS(scene=NS(dmx=None)); bpy.data = NS(filepath='/x/SPAC_CHANNEL_CHECK.blend')
sys.modules['bpy'] = bpy
mu = types.ModuleType('mathutils'); mu.Vector = object; sys.modules['mathutils'] = mu
import importlib.util, os
HERE = os.path.dirname(os.path.abspath(__file__))
MVR = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'rig.mvr')   # any real VWX MVR of the inventory rig
os.chdir(os.path.dirname(MVR) or '.'); MVR = os.path.basename(MVR)
spec = importlib.util.spec_from_file_location('mp', os.path.join(HERE, '..', 'maw_previz.py')); mp = importlib.util.module_from_spec(spec); spec.loader.exec_module(mp)
ok = 0
def check(name, cond):
    global ok
    print(('PASS ' if cond else 'FAIL ') + name); ok += bool(cond)
    if not cond: raise SystemExit(1)
pf = mp.preflight(MVR)
check('rig path = blend name + .mvr', mp.rig_path() == '/x/SPAC_CHANNEL_CHECK.mvr')
check('21 fixtures read', len(pf['fixtures']) == 21)
check('follow spot skipped, not blocked', [r['name'] for r in pf['fixtures'] if r.get('skip')] == ['Lycian SuperArc Follow Spot'] and not pf['block'])
check('SoloBAR4 footprint 259', [r['size'] for r in pf['fixtures'] if 'SoloBAR4' in r['name']] == [259])
check('max universe 63', pf['max_uni'] == 63)
live = NS(all_objects=[1])
def fx(r, **kw):
    d = dict(uuid=r['uuid'], name=r['name'], collection=live, profile=r['spec'], dmx_breaks=[NS(universe=r['uni'], address=r['addr'])]); d.update(kw); return NS(**d)
good = [fx(r) for r in pf['fixtures'] if not r.get('skip')]
check('empty file: plan imports all 20', len(mp.plan_sync(pf, [], '')['missing']) == 20)
p = mp.plan_sync(pf, good, pf['sha'])
check('same MVR + all live = current (no reimport)', p['current'])
check('same MVR but new export sha = not current', not mp.plan_sync(pf, good, 'old')['current'])
fake_spot = NS(uuid=[r for r in pf['fixtures'] if r.get('skip')][0]['uuid'], name='SuperArc', collection=live, profile='BlenderDMX@RysyParLED@version7.gdtf', dmx_breaks=[])
check('fake generic-PAR follow spot gets pruned', fake_spot in mp.plan_sync(pf, good + [fake_spot], '')['prune'])
gone = NS(uuid='DEAD-BEEF', name='Deleted in VWX', collection=live, profile='x', dmx_breaks=[])
check('fixture deleted in VWX gets pruned', gone in mp.plan_sync(pf, good + [gone], '')['prune'])
dead = fx(pf['fixtures'][0], collection=None)
pl = mp.plan_sync(pf, [dead] + good[1:], pf['sha'])
check('record with no objects = dead + missing, not current', dead in pl['dead'] and not pl['current'])
check('verify passes on a correct rig', mp.verify(pf, good) == ([], []))
moved = good[:]; r0 = [r for r in pf['fixtures'] if 'Lonestar' in r['name']][0]
moved = [fx(r0, dmx_breaks=[NS(universe=53, address=5)]) if f.uuid == r0['uuid'] else f for f in good]
check('verify catches a patch mismatch', any('Lonestar' in x for x in mp.verify(pf, moved)[0]))
fb = [fx(r0, profile='BlenderDMX@RysyParLED@version7.gdtf') if f.uuid == r0['uuid'] else f for f in good]
check('verify catches a generic-PAR fallback', any('fallback' in x for x in mp.verify(pf, fb)[0]))
check('verify catches extras', any("doesn't have" in x for x in mp.verify(pf, good + [gone])[0]))
zero = [fx(r, dmx_breaks=[NS(universe=r['uni'] - 1, address=r['addr'])]) for r in pf['fixtures'] if not r.get('skip')]
check('0-based universe numbering tolerated', mp.verify(pf, zero)[0] == [])
# overlap block: forge an MVR with the Aura stacked on the Lonestar
import zipfile, re
src = zipfile.ZipFile(MVR); out = zipfile.ZipFile('bad.mvr', 'w')
for n in src.namelist():
    b = src.read(n)
    if n == 'GeneralSceneDescription.xml': b = b.replace(b'>26725<', b'>26640<')
    out.writestr(n, b)
out.close()
bad = mp.preflight('bad.mvr')
check('overlap (Aura inside Lonestar 48ch) BLOCKS', any('OVERLAP' in x and 'Lonestar' in x for x in bad['block']))
print(f'{ok}/{ok} PASS')
