# ZED · Build the URITP musician LIBRARY file (Blender 5.2.2 LTS target; not yet run by its author)
# What it does: imports the performer + every v5.0 prop into its own asset collection, adds named socket
# empties from set_manifest.json, marks each collection as an asset, saves URITP_Musicians_LIB_v5_1.blend.
# Run ONCE in a NEW, EMPTY Blender file. It never deletes anything and refuses to run twice or overwrite a save.
# Repo layout: blender/musicians/blender/ (this script) finds ../dist (run source/export.py, or unzip the set there). Text > Open this file > Run Script.
import bpy, os, json
from mathutils import Vector

LIB_ROOT = 'URITP_MUSICIANS_LIB'
SAVE_NAME = 'URITP_Musicians_LIB_v5_1.blend'
FOLDER = ''   # leave empty: auto-detects the folder this script was opened from

def say(*a): print('[ZED LIB]', *a)

def script_dir():
    if FOLDER: return bpy.path.abspath(FOLDER)
    for t in bpy.data.texts:
        if t.filepath and os.path.basename(t.filepath).startswith('ZED_build_library'):
            return os.path.dirname(bpy.path.abspath(t.filepath))
    raise RuntimeError('Open this script from disk (Text > Open), or set FOLDER at the top.')

def find_layer_coll(lc, name):
    if lc.collection.name == name: return lc
    for ch in lc.children:
        r = find_layer_coll(ch, name)
        if r: return r
    return None

def import_into(path, coll_name, parent):
    coll = bpy.data.collections.new(coll_name); parent.children.link(coll)
    vl = bpy.context.view_layer
    vl.active_layer_collection = find_layer_coll(vl.layer_collection, coll_name)
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=path)
    new = [o for o in bpy.data.objects if o not in before]
    for o in new:   # importer should already have used the active collection; make sure
        if coll not in o.users_collection:
            for c in list(o.users_collection): c.objects.unlink(o)
            coll.objects.link(o)
    return coll, new

def add_sockets(coll, root, sockets, code):
    made = 0
    for name, val in sockets.items():
        if not (isinstance(val, list) and len(val) == 3 and all(isinstance(x, (int, float)) for x in val)):
            continue   # skips LID_HINGE_AXIS / LID_DEG (data, not points)
        e = bpy.data.objects.new(f'{code}_SOCK_{name}', None)
        e.empty_display_type = 'PLAIN_AXES'; e.empty_display_size = 0.05
        e.hide_render = True
        coll.objects.link(e); e.parent = root; e.location = Vector(val)
        e['uritp_socket'] = name; made += 1
    return made

def main():
    if bpy.data.collections.get(LIB_ROOT):
        raise RuntimeError(f'{LIB_ROOT} already exists. This script runs once per file. Nothing was changed.')
    base = script_dir()
    dist = next((p for p in (os.path.join(base, 'dist'), os.path.join(base, '..', 'dist'), os.path.join(base, 'dist_v5_0')) if os.path.isdir(p)), os.path.join(base, 'dist'))
    man_p = os.path.join(dist, 'set_manifest.json')
    if not os.path.isfile(man_p): raise RuntimeError(f'Missing {man_p}. Run source/export.py first (it writes ../dist).')
    man = json.load(open(man_p))
    sc = bpy.context.scene
    sc.unit_settings.system = 'METRIC'; sc.unit_settings.scale_length = 1.0
    root = bpy.data.collections.new(LIB_ROOT); sc.collection.children.link(root)
    report = []

    # performer
    pc, pnew = import_into(os.path.join(dist, 'PERF_Performer_v4_2.glb'), 'LIB_PERF_Performer', root)
    report.append(('LIB_PERF_Performer', len(pnew), 0))

    # props, spaced along X in the library file only (linking ignores this: each collection instances from its own origin)
    x = 1.2
    for name, P in man['props'].items():
        path = os.path.join(dist, f'PROP_{name}_v5_0.glb')
        if not os.path.isfile(path): say('MISSING', path); report.append((name, 0, 0)); continue
        cname = f'LIB_PROP_{name}'
        coll, new = import_into(path, cname, root)
        proot = bpy.data.objects.get(f'PROP_{name}') or next((o for o in new if o.parent is None), None)
        n_s = add_sockets(coll, proot, P['sockets'], P['code']) if proot else 0
        # display only: spread props out in the library so you can see them
        if proot: proot.location.x = x
        coll.instance_offset = (x, 0, 0)
        x += 1.0 if name != 'GrandPiano' else 2.0
        report.append((cname, len(new), n_s))

    # each glTF import brings its own copy of the 6 greys: point every '.001' copy at the original (orphans drop on save)
    for m in list(bpy.data.materials):
        b, dot, num = m.name.rpartition('.')
        if dot and num.isdigit() and bpy.data.materials.get(b): m.user_remap(bpy.data.materials[b])
    for c in root.children:
        try:
            c.asset_mark()
            c.asset_generate_preview()
        except Exception as ex:
            say('asset mark skipped for', c.name, '->', ex)

    say('---- report ----')
    for n, objs, s in report: say(f'{n:32s} objects {objs:3d}   sockets {s:2d}')
    perf = [o for o in pnew if o.type == 'MESH']
    if perf:
        zmax = max((o.matrix_world @ Vector(c)).z for o in perf for c in o.bound_box)
        zmin = min((o.matrix_world @ Vector(c)).z for o in perf for c in o.bound_box)
        say(f'performer height {zmax - zmin:.3f} m (expect 1.768), floor {zmin:.4f} (expect 0.0000)')
    out = os.path.join(base, SAVE_NAME)
    if os.path.exists(out):
        say('NOT SAVED: file exists, refusing to overwrite ->', out, ' Save As manually.')
    else:
        bpy.ops.wm.save_as_mainfile(filepath=out)
        say('saved', out)

main()
