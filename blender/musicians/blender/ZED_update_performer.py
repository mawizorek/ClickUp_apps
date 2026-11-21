# ZED · Update the performer meshes in the musician LIBRARY to the current version (Blender 5.2.2 LTS target; not yet run by its author)
# Run INSIDE the musician library .blend. Keeps every object, name, collection and origin contract; swaps only the
# mesh shapes, so any file that LINKS the performer picks up the change when it reloads the library. Never deletes:
# the old shapes are left with no users and drop out when you save. Runs once (it marks the root), then press Ctrl+S.
# Put the current performer GLB next to this script (or in dist, ../dist or dist_v5_1). Change VERSION when the performer bumps. Text > Open this file > Run Script.
import bpy, os

VERSION = '4.3'   # v4.3: smooth lofted parts (shared vertices, smooth normals)
GLB_NAME = f'PERF_Performer_v{VERSION.replace(".", "_")}.glb'
TMP = f'ZED_TMP_IMPORT_v{VERSION}'
FOLDER = ''   # leave empty: auto-detects the folder this script was opened from

def say(*a): print('[ZED UPDATE]', *a)

def script_dir():
    if FOLDER: return bpy.path.abspath(FOLDER)
    for t in bpy.data.texts:
        if t.filepath and os.path.basename(t.filepath).startswith('ZED_update_performer'):
            return os.path.dirname(bpy.path.abspath(t.filepath))
    raise RuntimeError('Open this script from disk (Text > Open), or set FOLDER at the top. Nothing was changed.')

def base_name(n):
    head, dot, tail = n.rpartition('.')
    return head if dot and tail.isdigit() else n

def main():
    lib = bpy.data.collections.get('LIB_PERF_Performer')
    if not lib:
        raise RuntimeError('LIB_PERF_Performer not found: open the musician LIBRARY file first. Nothing was changed.')
    roots = [o for o in lib.all_objects if o.type == 'EMPTY' and o.name.startswith('PERF_Performer')]
    if not roots: raise RuntimeError('Performer root empty not found in LIB_PERF_Performer. Nothing was changed.')
    root = roots[0]
    if root.get('uritp_mesh_version') == VERSION:
        raise RuntimeError(f'Already updated to v{VERSION}. Nothing was changed.')
    d = script_dir()
    path = next((p for p in (os.path.join(d, GLB_NAME), os.path.join(d, 'dist', GLB_NAME), os.path.join(d, '..', 'dist', GLB_NAME), os.path.join(d, 'dist_v5_1', GLB_NAME)) if os.path.isfile(p)), None)
    if not path: raise RuntimeError(f'{GLB_NAME} not found next to this script or in dist, ../dist or dist_v5_1. Nothing was changed.')

    sc = bpy.context.scene; vl = bpy.context.view_layer
    tmp = bpy.data.collections.new(TMP); sc.collection.children.link(tmp)
    vl.active_layer_collection = vl.layer_collection.children[tmp.name]
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=path)
    new = [o for o in bpy.data.objects if o not in before]
    vl.update()

    swapped, missing = [], []
    for o in new:
        if o.type != 'MESH': continue
        old = bpy.data.objects.get(base_name(o.name))
        if old is None or old is o or old.type != 'MESH':
            missing.append(o.name); continue
        mw = o.matrix_world.copy()
        old.data = o.data                       # new shape, same object, same name, same collection
        old.matrix_world = mw                   # origin = joint (bone head), per the performer manifest
        for k in ('uritp_part', 'uritp_bone_tail', 'uritp_bone_parent'):
            if k in o.keys(): old[k] = o[k]
        swapped.append(old.name)

    for m in list(bpy.data.materials):          # point the import's '.001' greys back at the originals
        b, dot, num = m.name.rpartition('.')
        if dot and num.isdigit() and bpy.data.materials.get(b): m.user_remap(bpy.data.materials[b])
    for o in new:                               # take the temporary import out of the scene (no deletes)
        for c in list(o.users_collection): c.objects.unlink(o)
    sc.collection.children.unlink(tmp)

    root['uritp_mesh_version'] = VERSION
    lines = [f'Swapped {len(swapped)} of 16 performer parts' + ('' if len(swapped) == 16 else '  <-- EXPECTED 16')]
    if missing: lines.append('No match in library for: ' + ', '.join(missing))
    zmin = min((o.matrix_world @ v.co).z for o in lib.all_objects if o.type == 'MESH' for v in o.data.vertices)
    zmax = max((o.matrix_world @ v.co).z for o in lib.all_objects if o.type == 'MESH' for v in o.data.vertices)
    lines.append(f'Performer height {zmax:.3f} m (expect 1.768). Lowest point {zmin:+.4f} m (expect +0.0000)')
    lines.append('Done. Press Ctrl+S to save the library, then reload it in any file that links it.')
    for l in lines: say(l)
    # on-screen report (the printout above only reaches the system console)
    bpy.context.window_manager.popup_menu(lambda self, ctx: [self.layout.label(text=l) for l in lines], title='ZED · performer update', icon='INFO')

main()
